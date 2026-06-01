import { expect, test } from "@playwright/test";
import type { Page, TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import { renderBookPartPcm } from "../../app/client/components/morse-code-book-translator/bookBundleExport";
import {
  buildMorseTranscript,
  estimateBookTextDurationMs,
} from "../../app/client/components/morse-code-book-translator/bookDurationEstimate";
import { BOOK_EXPORT_PREFERENCES_KEY } from "../../app/client/components/morse-code-book-translator/bookExportPreferences";
import { BOOK_EXPORT_PRESETS } from "../../app/client/components/morse-code-book-translator/bookExportPresets";
import { segmentBookText } from "../../app/client/components/morse-code-book-translator/bookSegmentation";
import { applyCleanupOptions } from "../../app/client/components/morse-code-book-translator/textNormalization";
import { estimateMorseDurationMs } from "../../app/client/components/shared/morseTiming";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
} from "./helpers";

const CANONICAL_PATH = ROUTES.bookTranslator;
const ALIAS_PATH = ROUTES.ebookTranslatorAlias;
const RAW_SECRET_TEXT = "Private Draft Source";
const BOOK_TOOL_LABEL = "Book source review and export tool";

async function openBookTranslator(page: Page) {
  await blockExternalNetwork(page);
  await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.locator("[data-mw-book-export-ready='true']"),
  ).toBeVisible();
}

function bookTool(page: Page) {
  return page.locator(`section[aria-label="${BOOK_TOOL_LABEL}"]`);
}

function sourceStep(page: Page) {
  return page.locator("section[aria-labelledby='book-add-source-heading']");
}

async function expectWorkflowReadyNearSource(page: Page) {
  await expect(
    sourceStep(page).getByRole("link", { name: "Review export" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Ready to export" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    bookTool(page).getByRole("button", { name: "Export ZIP bundle" }),
  ).toHaveCount(1);
}

async function grantClipboard(page: Page) {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });
}

async function expectNoRawSourceInStorage(page: Page, rawText: string) {
  const storageSnapshot = await page.evaluate(() =>
    [
      ...Object.keys(localStorage).map(
        (key) => `${key}:${localStorage.getItem(key)}`,
      ),
      ...Object.keys(sessionStorage).map(
        (key) => `${key}:${sessionStorage.getItem(key)}`,
      ),
    ].join("\n"),
  );
  expect(storageSnapshot).not.toContain(rawText);
}

function writeFixture(testInfo: TestInfo, name: string, data: Buffer | string) {
  const filePath = testInfo.outputPath(name);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data);
  return filePath;
}

function makeEpub(options: {
  encrypted?: boolean;
  broken?: boolean;
  title?: string;
  author?: string;
}) {
  if (options.broken) {
    return Buffer.from(
      zipSync({ "OPS/chapter.xhtml": strToU8("<p>Missing container</p>") }),
    );
  }

  const title = options.title ?? "Signal Book";
  const author = options.author ?? "Ada Morse";
  const files: Record<string, Uint8Array> = {
    "META-INF/container.xml": strToU8(`<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`),
    "OPS/content.opf": strToU8(`<?xml version="1.0"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${title}</dc:title>
    <dc:creator>${author}</dc:creator>
  </metadata>
  <manifest>
    <item id="c2" href="chapter-two.xhtml" media-type="application/xhtml+xml"/>
    <item id="c1" href="chapter-one.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="c1"/>
    <itemref idref="c2"/>
  </spine>
</package>`),
    "OPS/chapter-one.xhtml": strToU8(
      "<html><body><h1>First Signal</h1><p>Alpha comes before beta.</p></body></html>",
    ),
    "OPS/chapter-two.xhtml": strToU8(
      "<html><body><h1>Second Signal</h1><p>Charlie follows.</p></body></html>",
    ),
  };
  if (options.encrypted) {
    files["META-INF/encryption.xml"] = strToU8(
      "<encryption><EncryptedData/></encryption>",
    );
  }
  return Buffer.from(zipSync(files));
}

function escapePdfText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function makePdf(text: string) {
  const stream = text
    ? `BT /F1 12 Tf 72 720 Td (${escapePdfText(text)}) Tj ET`
    : "";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Title (Tiny PDF) /Author (MorseWords Test) >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf, "ascii"));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf, "ascii");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "ascii");
}

async function exportZip(page: Page, testInfo: TestInfo) {
  const downloadPromise = page.waitForEvent("download", { timeout: 90_000 });
  await page.getByRole("button", { name: "Export ZIP bundle" }).click();
  const download = await downloadPromise;
  const zipPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(zipPath);
  const entries = unzipSync(new Uint8Array(fs.readFileSync(zipPath)));
  return {
    filename: download.suggestedFilename(),
    entries,
    names: Object.keys(entries).sort(),
  };
}

function zipText(entries: Record<string, Uint8Array>, name: string) {
  const entry = entries[name];
  if (!entry) throw new Error(`Missing ZIP entry: ${name}`);
  return strFromU8(entry);
}

function zipJson<T = Record<string, unknown>>(
  entries: Record<string, Uint8Array>,
  name: string,
): T {
  return JSON.parse(zipText(entries, name)) as T;
}

function expectOrderedPartFiles(names: string[], extension: "mp3" | "wav") {
  const partFiles = names.filter((name) =>
    new RegExp(`part-\\d{3}\\.${extension}$`).test(name),
  );
  expect(partFiles.length).toBeGreaterThan(0);
  expect(partFiles).toEqual([...partFiles].sort());
  partFiles.forEach((name, index) => {
    expect(name).toMatch(
      new RegExp(`part-${String(index + 1).padStart(3, "0")}\\.${extension}$`),
    );
  });
  return partFiles;
}

function expectPlaylistOrder(playlist: string, partFiles: string[]) {
  expect(playlist).toContain("#EXTM3U");
  expect(
    playlist
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.startsWith("./")),
  ).toEqual(partFiles.map((file) => `./${file}`));
}

function expectMp3Like(bytes: Uint8Array) {
  expect(bytes.length).toBeGreaterThan(128);
  const hasId3 = bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33;
  const hasFrameSync = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
  expect(hasId3 || hasFrameSync).toBe(true);
}

function expectWavHeader(bytes: Uint8Array) {
  expect(bytes.length).toBeGreaterThan(44);
  expect(strFromU8(bytes.slice(0, 4))).toBe("RIFF");
  expect(strFromU8(bytes.slice(8, 12))).toBe("WAVE");
  expect(strFromU8(bytes.slice(12, 16))).toBe("fmt ");
}

type BundleManifest = {
  partCount: number;
  outputFormat: "mp3" | "wav";
  files: { audio: string[]; cleanedText?: string; morseTranscript?: string };
  parts: Array<{
    filename: string;
    runtimeMs: number;
    sourceStart: number;
    sourceEnd: number;
  }>;
  settingsSummary: { outputFormat: string; targetPartMinutes: number };
};

type BundleSettings = {
  presetName: string;
  outputFormat: "mp3" | "wav";
  targetPartMinutes: number;
  includeCleanedText: boolean;
  includeMorseTranscript: boolean;
};

test("book translator route metadata, alias, and sitemap use canonical URL", async ({
  page,
  request,
}) => {
  await openBookTranslator(page);

  await expect(page).toHaveTitle(
    /Book to Morse Code Translator and Audio Exporter/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    absoluteUrl(CANONICAL_PATH),
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    absoluteUrl(CANONICAL_PATH),
  );

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? "").join("\n"),
    );
  expect(jsonLd).toContain(absoluteUrl(CANONICAL_PATH));
  expect(jsonLd).toContain("WebApplication");

  const aliasResponse = await request.get(ALIAS_PATH, { maxRedirects: 0 });
  expect(aliasResponse.status()).toBe(301);
  expect(aliasResponse.headers().location).toBe(CANONICAL_PATH);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(absoluteUrl(CANONICAL_PATH));
  expect(sitemap).not.toContain(absoluteUrl(ALIAS_PATH));
});

test("pasted text review reports unsupported characters and avoids localStorage", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill(`${RAW_SECRET_TEXT}\nHello 世界 -- SOS`);

  await expect(page.getByText("Top unsupported characters")).toBeVisible();
  await expectWorkflowReadyNearSource(page);
  await expect(
    page.locator("pre").filter({ hasText: ".... . .-.. .-.. ---" }).first(),
  ).toBeVisible();
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

  const storageSnapshot = await page.evaluate(() =>
    Object.keys(localStorage)
      .map((key) => `${key}:${localStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(storageSnapshot).not.toContain(RAW_SECRET_TEXT);
  const sessionStorageSnapshot = await page.evaluate(() =>
    Object.keys(sessionStorage)
      .map((key) => `${key}:${sessionStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(sessionStorageSnapshot).not.toContain(RAW_SECRET_TEXT);
});

test("TXT and MD uploads populate source review", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const txtPath = writeFixture(
    testInfo,
    "book-source.txt",
    "Plain text chapter\nSOS help",
  );
  const mdPath = writeFixture(
    testInfo,
    "book-source.md",
    "# Markdown Chapter\n\nCQ CQ",
  );

  await page.setInputFiles("#book-source-file", txtPath);
  await expect(page.getByText("Current file: book-source.txt")).toBeVisible();
  await expect(
    page.getByText("This upload is small enough to edit directly"),
  ).toBeVisible();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    "Plain text chapter\nSOS help",
  );
  await expect(
    page.getByRole("button", { name: "Copy extracted text" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Copy cleaned text" }),
  ).toBeEnabled();
  await expectWorkflowReadyNearSource(page);

  await page.setInputFiles("#book-source-file", mdPath);
  await expect(page.getByText("Current file: book-source.md")).toBeVisible();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    "# Markdown Chapter\n\nCQ CQ",
  );
  await expect(
    page.getByRole("heading", { name: "Source ready" }),
  ).toBeVisible();
  await expect(
    sourceStep(page).getByRole("link", { name: "Review export" }),
  ).toBeVisible();
});

test("large uploaded text uses a capped extracted source preview", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const largeSource = `Preview starts here.\n\n${"ALPHA BRAVO SOS HELP ".repeat(
    3_200,
  )}\n\nPreview should not reach this ending marker.`;
  const txtPath = writeFixture(testInfo, "large-source.txt", largeSource);

  await page.setInputFiles("#book-source-file", txtPath);
  await expect(page.getByText("Current file: large-source.txt")).toBeVisible();
  await expect(page.getByText("Extracted source preview")).toBeVisible();
  await expect(page.getByText("Preview is truncated.")).toBeVisible();
  await expect(page.getByLabel("Paste long-form source text")).toHaveCount(0);
  const previewText =
    (await page.getByTestId("book-source-preview").textContent()) ?? "";
  expect(previewText).toContain("Preview starts here.");
  expect(previewText).not.toContain(
    "Preview should not reach this ending marker.",
  );
  expect(previewText.length).toBeLessThanOrEqual(6_050);
  await expect(
    page.getByRole("button", { name: "Edit extracted text" }),
  ).toBeEnabled();
  await expectWorkflowReadyNearSource(page);
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
});

test("EPUB parser extracts metadata and spine text in reading order", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const epubPath = writeFixture(
    testInfo,
    "signal-book.epub",
    makeEpub({ title: "Signal Book", author: "Ada Morse" }),
  );

  await page.setInputFiles("#book-source-file", epubPath);
  await expect(
    page.getByLabel("Source ready").getByText("Signal Book"),
  ).toBeVisible();
  await expect(
    page.getByLabel("Source ready").getByText("Ada Morse"),
  ).toBeVisible();
  await expect(page.getByText("EPUB sections")).toBeVisible();
  await expect(page.getByText("Extracted source preview")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit extracted text" }),
  ).toBeEnabled();
  await expectWorkflowReadyNearSource(page);
  await expect(page.getByLabel("Paste long-form source text")).toHaveCount(0);

  const preview = page.getByTestId("book-source-preview");
  await expect(preview).toBeVisible();
  await expect(preview).toContainText("First Signal");
  const previewText = await bookTool(page).textContent();
  expect(previewText?.indexOf("First Signal")).toBeLessThan(
    previewText?.indexOf("Second Signal") ?? Number.POSITIVE_INFINITY,
  );
});

test("source preview actions copy, edit, and clear uploaded content", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await grantClipboard(page);
  const epubPath = writeFixture(
    testInfo,
    "copy-actions.epub",
    makeEpub({ title: "Copy Action Book", author: "Ada Morse" }),
  );

  await page.setInputFiles("#book-source-file", epubPath);
  await expect(page.getByText("Extracted source preview")).toBeVisible();

  await page.getByRole("button", { name: "Copy extracted text" }).click();
  await expect(page.getByText("Extracted text copied.")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("First Signal");

  await page.getByRole("button", { name: "Copy cleaned text" }).click();
  await expect(page.getByText("Cleaned text copied.")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("Charlie follows.");

  await page.getByRole("button", { name: "Edit extracted text" }).click();
  await expect(page.getByLabel("Paste long-form source text")).toBeVisible();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    /First Signal[\s\S]*Second Signal/,
  );
  await expect(page.getByText("Extracted source preview")).toHaveCount(0);

  await page.getByRole("button", { name: "Clear source" }).first().click();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    page.getByText("Part splitting appears after source text is available."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Export ZIP bundle" }),
  ).toBeDisabled();
  await expect(page.getByText("Last export")).toHaveCount(0);
});

test("empty uploaded source disables source copy actions", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const emptyPath = writeFixture(testInfo, "empty-source.txt", "");

  await page.setInputFiles("#book-source-file", emptyPath);
  await expect(page.getByText("Current file: empty-source.txt")).toBeVisible();
  await expect(
    page.getByText("Extraction finished, but no source text was found."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy extracted text" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Copy cleaned text" }),
  ).toBeDisabled();
  await expect(page.getByText("Extracted text copied.")).toHaveCount(0);
  await expect(page.getByText("Cleaned text copied.")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Clear source" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Clear source" }).click();
  await expect(page.getByText("Current file: empty-source.txt")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Source ready" })).toHaveCount(
    0,
  );
  await expect(
    page.getByText("Add source text or upload a source file to enable export."),
  ).toBeVisible();
});

test("duration estimates and segmentation use shared Morse timing", async () => {
  const settings = {
    ...BOOK_EXPORT_PRESETS["Faithful Source"],
    targetPartMinutes: 0.035,
  };
  const plainText = "SOS HELP";
  const morse = buildMorseTranscript(plainText);
  expect(estimateBookTextDurationMs(plainText, settings)).toBeCloseTo(
    estimateMorseDurationMs(morse, {
      charWpm: settings.charWpm,
      farnsworthWpm: settings.farnsworthWpm,
    }),
    5,
  );

  const paragraphParts = segmentBookText({
    cleanedText: "ALPHA SOS.\n\nBRAVO HELP.\n\nCHARLIE CQ.",
    settings,
    sourceTitle: "Unsafe:/Book Name",
  });
  expect(paragraphParts.length).toBeGreaterThan(1);
  expect(paragraphParts.every((part) => part.cleanedText.trim())).toBe(true);
  expect(paragraphParts.map((part) => part.estimatedFilename)).toEqual(
    paragraphParts.map((part, index) =>
      expect.stringContaining(`part-${String(index + 1).padStart(3, "0")}`),
    ),
  );
  expect(paragraphParts[0].estimatedFilename).not.toContain(":");

  const sentenceParts = segmentBookText({
    cleanedText: "ALPHA SOS. BRAVO HELP. CHARLIE CQ. DELTA TEST.",
    settings: { ...settings, targetPartMinutes: 0.02 },
  });
  expect(sentenceParts.length).toBeGreaterThan(1);

  const wordParts = segmentBookText({
    cleanedText: "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA",
    settings: { ...settings, targetPartMinutes: 0.01 },
  });
  expect(wordParts.length).toBeGreaterThan(1);

  const hinted = segmentBookText({
    cleanedText: "FIRST SECTION SOS.\n\nSECOND SECTION HELP.",
    settings: {
      ...settings,
      preferSourceSections: true,
      targetPartMinutes: 0.02,
    },
    sourceSections: [
      {
        title: "First",
        rawText: "FIRST SECTION SOS.",
        startOffset: 0,
        endOffset: 18,
      },
      {
        title: "Second",
        rawText: "SECOND SECTION HELP.",
        startOffset: 20,
        endOffset: 40,
      },
    ],
  });
  expect(hinted.some((part) => part.title.includes("First"))).toBe(true);
  expect(hinted.some((part) => part.title.includes("Second"))).toBe(true);
});

test("segmentation handles long-source boundary edge cases without empty parts", async () => {
  const settings = {
    ...BOOK_EXPORT_PRESETS["Practice Copy"],
    targetPartMinutes: 0.018,
  };
  const cases = [
    "SOS",
    Array.from(
      { length: 40 },
      (_, index) => `Paragraph ${index + 1} SOS.`,
    ).join("\n\n"),
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT. ".repeat(120),
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA ".repeat(80),
    "ALPHA   BRAVO\n\n\nSOS\tHELP ".repeat(80),
    "SOSHELP".repeat(160),
  ];

  for (const source of cases) {
    const cleanedText = applyCleanupOptions(source, {
      normalizeSmartPunctuation: true,
      stripZeroWidthAndSoftHyphen: true,
      stripGutenbergHeaderFooter: false,
      simplifyPunctuation: true,
    }).cleanedText;
    const parts = segmentBookText({
      cleanedText,
      settings,
      sourceTitle: "QA/Stress",
    });
    expect(parts.length).toBeGreaterThan(0);
    parts.forEach((part, index) => {
      expect(part.cleanedText.trim()).toBeTruthy();
      expect(part.sourceStart).toBeLessThan(part.sourceEnd);
      expect(part.index).toBe(index + 1);
      expect(part.estimatedFilename).toContain(
        `part-${String(index + 1).padStart(3, "0")}`,
      );
      expect(part.morseDurationMs).toBeCloseTo(
        estimateBookTextDurationMs(part.cleanedText, settings),
        5,
      );
    });
  }

  const wordBoundarySource =
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA JULIET ".repeat(
      20,
    );
  const wordParts = segmentBookText({
    cleanedText: wordBoundarySource,
    settings: { ...settings, targetPartMinutes: 0.01 },
  });
  expect(wordParts.length).toBeGreaterThan(1);
  for (const part of wordParts) {
    const before =
      part.sourceStart > 0 ? wordBoundarySource[part.sourceStart - 1] : " ";
    const after =
      part.sourceEnd < wordBoundarySource.length
        ? wordBoundarySource[part.sourceEnd]
        : " ";
    expect(before).toMatch(/\s/);
    expect(after).toMatch(/\s/);
  }

  const trailingParts = segmentBookText({
    cleanedText: `${"ALPHA BRAVO. ".repeat(35)}\n\nSOS`,
    settings,
  });
  if (trailingParts.length > 1) {
    const targetMs = settings.targetPartMinutes * 60_000;
    expect(trailingParts.at(-1)?.morseDurationMs).toBeGreaterThanOrEqual(
      targetMs * 0.22,
    );
  }

  const stripped = applyCleanupOptions(
    `Header
*** START OF THE PROJECT GUTENBERG EBOOK TEST ***
Signal body SOS.
*** END OF THE PROJECT GUTENBERG EBOOK TEST ***
Footer`,
    {
      normalizeSmartPunctuation: true,
      stripZeroWidthAndSoftHyphen: true,
      stripGutenbergHeaderFooter: true,
      simplifyPunctuation: false,
    },
  );
  expect(stripped.cleanedText).toBe("Signal body SOS.");
  const strippedEmpty = applyCleanupOptions(
    `*** START OF THE PROJECT GUTENBERG EBOOK TEST ***
*** END OF THE PROJECT GUTENBERG EBOOK TEST ***`,
    {
      normalizeSmartPunctuation: true,
      stripZeroWidthAndSoftHyphen: true,
      stripGutenbergHeaderFooter: true,
      simplifyPunctuation: false,
    },
  );
  expect(strippedEmpty.cleanedText).toBe("");
});

test("preset settings, reset, and safe route preferences persist", async ({
  page,
}) => {
  await openBookTranslator(page);
  await expect(page.getByText("Balanced MP3 settings")).toBeVisible();

  await page.getByRole("button", { name: "Practice Copy" }).click();
  await expect(
    page.getByText("Shorter parts, slower Farnsworth spacing"),
  ).toBeVisible();
  await expect(page.getByText("Best for: Training and review")).toBeVisible();
  await expect(
    page.getByText(
      "20/10 WPM, MP3 128 kbps, 5 minute target parts, splits by Morse runtime boundaries.",
    ),
  ).toBeVisible();

  const advancedToggle = page
    .locator("summary")
    .filter({ hasText: "Advanced export settings" });
  await advancedToggle.click();
  await expect(page.getByLabel("Output format")).toBeVisible();
  await page.getByLabel("Output format").selectOption("wav");
  await expect(page.getByText("Modified from preset")).toBeVisible();

  await page.getByLabel("Paste long-form source text").fill(RAW_SECRET_TEXT);
  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .toContain('"outputFormat":"wav"');
  const storageSnapshot = await page.evaluate(() =>
    Object.keys(localStorage)
      .map((key) => `${key}:${localStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(storageSnapshot).not.toContain(RAW_SECRET_TEXT);

  await page.getByRole("button", { name: "Reset preset" }).click();
  await expect(page.getByText("Modified from preset")).toHaveCount(0);
  await expect(page.getByLabel("Output format")).toHaveValue("mp3");

  await page.getByLabel("Output format").selectOption("wav");
  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .toContain('"advancedOpen":true');

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.locator("[data-mw-book-export-ready='true']"),
  ).toBeVisible();
  await expect(page.getByLabel("Output format")).toBeVisible();
  await expect(page.getByLabel("Output format")).toHaveValue("wav");
  await expect(page.getByText("Modified from preset")).toBeVisible();
});

test("malformed saved preferences fall back safely without source persistence", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "{not valid json");
  }, BOOK_EXPORT_PREFERENCES_KEY);
  await openBookTranslator(page);
  await expect(
    page.getByRole("button", { name: "Reader Quick Start" }),
  ).toBeVisible();
  await page.getByLabel("Paste long-form source text").fill(RAW_SECRET_TEXT);
  await expect(
    page.locator("pre").filter({ hasText: RAW_SECRET_TEXT }).first(),
  ).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .toContain('"presetName":"Reader Quick Start"');
  const storageSnapshot = await page.evaluate(() =>
    [
      ...Object.keys(localStorage).map(
        (key) => `${key}:${localStorage.getItem(key)}`,
      ),
      ...Object.keys(sessionStorage).map(
        (key) => `${key}:${sessionStorage.getItem(key)}`,
      ),
    ].join("\n"),
  );
  expect(storageSnapshot).not.toContain(RAW_SECRET_TEXT);
});

test("empty source, cleaned-empty source, large WAV, and progress semantics are clear", async ({
  page,
}) => {
  await openBookTranslator(page);
  const advancedToggle = page
    .locator("summary")
    .filter({ hasText: "Advanced export settings" });
  const exportButton = page.getByRole("button", { name: "Export ZIP bundle" });
  await expect(
    bookTool(page).getByRole("button", { name: "Export ZIP bundle" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Review export" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Add source" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Choose export style" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    page.getByText("Add source text or upload a source file to enable export."),
  ).toBeVisible();
  await expect(advancedToggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByLabel("Output format")).toBeHidden();
  await expect(exportButton).toBeDisabled();

  await page.getByLabel("Paste long-form source text").fill("   \n   ");
  await expect(exportButton).toBeDisabled();

  await page.getByLabel("Paste long-form source text")
    .fill(`*** START OF THE PROJECT GUTENBERG EBOOK TEST ***

*** END OF THE PROJECT GUTENBERG EBOOK TEST ***`);
  await page.getByLabel("Strip Project Gutenberg header/footer").check();
  await expect(page.getByText("Cleanup removed all source text")).toBeVisible();
  const toolText = (await bookTool(page).textContent()) ?? "";
  expect(toolText.indexOf("Cleanup removed all source text")).toBeLessThan(
    toolText.indexOf("Choose export style"),
  );
  await expect(exportButton).toBeDisabled();

  await page
    .getByLabel("Paste long-form source text")
    .fill("ALPHA BRAVO SOS ".repeat(4_000));
  await advancedToggle.click();
  await expect(advancedToggle).toHaveAttribute("aria-expanded", "true");
  await page.getByLabel("Output format").selectOption("wav");
  await expect(page.getByText("WAV output may be very large")).toBeVisible();

  const progressbar = page.getByRole("progressbar", {
    name: "Book export progress",
  });
  await expect(progressbar).toHaveAttribute("aria-valuemin", "0");
  await expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  await expect(progressbar).toHaveAttribute("aria-valuenow", "0");
});

test("route exports MP3 ZIP bundles with transcripts, manifest, settings, and playlist", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const raw = "Private Export Draft\n\nSOS HELP. CQ CQ.";
  await page.getByLabel("Paste long-form source text").fill(raw);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await expectWorkflowReadyNearSource(page);
  await expect(
    page.locator("#book-review-export").getByText("Practice Copy"),
  ).toBeVisible();
  await expect(page.getByText("Split summary")).toBeVisible();

  const zip = await exportZip(page, testInfo);
  expect(zip.filename).toMatch(/morse-audio-bundle\.zip$/);
  await expect(page.getByText("Last export")).toBeVisible();
  await expect(page.getByText(zip.filename)).toBeVisible();
  await expect(page.getByText("Bundle contents:")).toBeVisible();
  const partFiles = expectOrderedPartFiles(zip.names, "mp3");
  for (const name of [
    "cleaned-text.txt",
    "morse-transcript.txt",
    "manifest.json",
    "settings.json",
    "playlist.m3u",
    "README.txt",
  ]) {
    expect(zip.names).toContain(name);
  }
  expectMp3Like(zip.entries[partFiles[0]]);
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain("SOS HELP");
  expect(zipText(zip.entries, "morse-transcript.txt")).toContain(
    "...   ---   ...",
  );
  const manifest = zipJson<BundleManifest>(zip.entries, "manifest.json");
  expect(manifest.generatedAt).toEqual(expect.any(String));
  expect(manifest.sourceKind).toBe("pasted");
  expect(manifest.source.kind).toBe("pasted");
  expect(manifest.runtimeMs).toBeGreaterThan(0);
  expect(manifest.outputFormat).toBe("mp3");
  expect(manifest.partCount).toBe(partFiles.length);
  expect(manifest.files.audio).toEqual(partFiles);
  expect(manifest.files.audio[0]).toMatch(/part-001\.mp3$/);
  expect(manifest.parts.map((part) => part.filename)).toEqual(partFiles);
  expect(manifest.parts.every((part) => part.runtimeMs > 0)).toBe(true);
  expect(
    manifest.parts.every((part) => part.sourceStart < part.sourceEnd),
  ).toBe(true);
  expect(manifest.settingsSummary.targetPartMinutes).toBe(5);
  expect(manifest.settingsSummary.outputFormat).toBe("mp3");
  expect(manifest.parts[0].filename).toMatch(/part-001\.mp3$/);
  const settings = zipJson<BundleSettings>(zip.entries, "settings.json");
  expect(settings.generatedAt).toEqual(expect.any(String));
  expect(settings.presetName).toBe("Practice Copy");
  expect(settings.outputFormat).toBe("mp3");
  expect(settings.targetPartMinutes).toBe(5);
  expect(settings.includeCleanedText).toBe(true);
  expect(settings.includeMorseTranscript).toBe(true);
  const playlist = zipText(zip.entries, "playlist.m3u");
  expectPlaylistOrder(playlist, partFiles);
  const readme = zipText(zip.entries, "README.txt");
  expect(readme).toContain("Generated:");
  expect(readme).toContain("Part count:");
  expect(readme).toContain("MP3 is recommended for long exports");
  expect(readme).toContain("right to convert and use");

  const storageSnapshot = await page.evaluate(() =>
    Object.keys(localStorage)
      .map((key) => `${key}:${localStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(storageSnapshot).not.toContain("Private Export Draft");
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
});

test("route exports uploaded extracted text without persisting raw source", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const raw = "Uploaded Private Export Draft\n\nSOS HELP from upload.";
  const txtPath = writeFixture(testInfo, "uploaded-export.txt", raw);

  await page.setInputFiles("#book-source-file", txtPath);
  await expect(
    page.getByText("Current file: uploaded-export.txt"),
  ).toBeVisible();
  await expectWorkflowReadyNearSource(page);

  const zip = await exportZip(page, testInfo);
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain(
    "Uploaded Private Export Draft",
  );
  expect(zipText(zip.entries, "morse-transcript.txt")).toContain(
    "...   ---   ...",
  );
  const manifest = zipJson<BundleManifest>(zip.entries, "manifest.json");
  expect(manifest.sourceKind).toBe("txt");
  expect(manifest.source.kind).toBe("txt");
  expect(manifest.source.filename).toBe("uploaded-export.txt");
  await expectNoRawSourceInStorage(page, "Uploaded Private Export Draft");
});

test("route exports WAV ZIP bundles and sample audio on demand", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page.getByLabel("Paste long-form source text").fill("WAV sample SOS");
  await page.getByText("Advanced export settings").click();
  await page.getByLabel("Output format").selectOption("wav");

  const sampleDownload = page.waitForEvent("download", { timeout: 60_000 });
  await page.getByRole("button", { name: "Download sample" }).click();
  expect((await sampleDownload).suggestedFilename()).toBe(
    "morse-book-sample.wav",
  );

  const zip = await exportZip(page, testInfo);
  const partFiles = expectOrderedPartFiles(zip.names, "wav");
  expectWavHeader(zip.entries[partFiles[0]]);
  const manifest = zipJson<BundleManifest>(zip.entries, "manifest.json");
  expect(manifest.outputFormat).toBe("wav");
  expect(manifest.partCount).toBe(partFiles.length);
  expect(manifest.files.audio).toEqual(partFiles);
  expect(manifest.parts.map((part) => part.filename)).toEqual(partFiles);
  expectPlaylistOrder(zipText(zip.entries, "playlist.m3u"), partFiles);
  const settings = zipJson<BundleSettings>(zip.entries, "settings.json");
  expect(settings.outputFormat).toBe("wav");
  expect(settings.presetName).toBe("Reader Quick Start");
});

test("export cancellation can abort stale work before completion", async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(
    renderBookPartPcm(
      "SOS HELP",
      BOOK_EXPORT_PRESETS["Reader Quick Start"],
      controller.signal,
    ),
  ).rejects.toThrow();
});

test("route cancellation state is distinct from failure", async ({ page }) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("SOS HELP ALPHA BRAVO ".repeat(4_000));
  await page.getByText("Advanced export settings").click();
  await page.getByLabel("Output format").selectOption("wav");

  await page.getByRole("button", { name: "Export ZIP bundle" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel export" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Cancel export" }).click();
  await expect(page.getByText("Export cancelled.")).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("Last export")).toHaveCount(0);
  await expect(page.getByText("Export failed.")).toHaveCount(0);
});

test("source changes during active export cancel stale completion", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("SOS HELP ALPHA BRAVO ".repeat(4_000));
  await page.getByText("Advanced export settings").click();
  await page.getByLabel("Output format").selectOption("wav");

  await page.getByRole("button", { name: "Export ZIP bundle" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel export" }),
  ).toBeEnabled();
  await page
    .getByLabel("Paste long-form source text")
    .fill("Replacement source wins");
  await expect(page.getByText("Source changed; export cancelled.")).toBeVisible(
    {
      timeout: 30_000,
    },
  );
  await expect(
    page.locator("pre").filter({ hasText: "Replacement source wins" }),
  ).toBeVisible();
  await expect(page.getByText("Last export")).toHaveCount(0);
  await expect(page.getByText("Bundle download started")).toHaveCount(0);
});

test("transcript inclusion toggles remove private text artifacts from bundle", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Toggle export SOS HELP.");
  await page.getByText("Advanced export settings").click();
  await page.getByLabel("Include cleaned text").uncheck();
  await page.getByLabel("Include Morse transcript").uncheck();

  const zip = await exportZip(page, testInfo);
  const partFiles = expectOrderedPartFiles(zip.names, "mp3");
  expect(zip.names).not.toContain("cleaned-text.txt");
  expect(zip.names).not.toContain("morse-transcript.txt");
  const manifest = zipJson<BundleManifest>(zip.entries, "manifest.json");
  expect(manifest.files.audio).toEqual(partFiles);
  expect(manifest.files.cleanedText).toBeUndefined();
  expect(manifest.files.morseTranscript).toBeUndefined();
  const settings = zipJson<BundleSettings>(zip.entries, "settings.json");
  expect(settings.includeCleanedText).toBe(false);
  expect(settings.includeMorseTranscript).toBe(false);
});

test("EPUB rejection paths are clear for encrypted and broken files", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const encryptedPath = writeFixture(
    testInfo,
    "encrypted.epub",
    makeEpub({ encrypted: true }),
  );
  const brokenPath = writeFixture(
    testInfo,
    "broken.epub",
    makeEpub({ broken: true }),
  );

  await page.setInputFiles("#book-source-file", encryptedPath);
  await expect(
    page.getByLabel("Source upload failed").getByText("DRM-protected"),
  ).toBeVisible();

  await page.setInputFiles("#book-source-file", brokenPath);
  await expect(
    page
      .getByLabel("Source upload failed")
      .getByText("missing META-INF/container.xml"),
  ).toBeVisible();
});

test("PDF parser extracts text-native PDFs and rejects image-like PDFs", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const pdfPath = writeFixture(
    testInfo,
    "text-native.pdf",
    makePdf("PDF Morse source text with SOS and CQ"),
  );
  const blankPdfPath = writeFixture(testInfo, "blank.pdf", makePdf(""));
  const brokenPdfPath = writeFixture(
    testInfo,
    "broken.pdf",
    Buffer.from("%PDF-1.4\nbroken\n%%EOF", "ascii"),
  );

  await page.setInputFiles("#book-source-file", pdfPath);
  await expect(page.getByText("PDF pages")).toBeVisible();
  await expect(page.getByText("Extracted source preview")).toBeVisible();
  await expect(page.getByTestId("book-source-preview")).toContainText(
    "PDF Morse source text",
  );
  await expect(
    page.getByRole("button", { name: "Edit extracted text" }),
  ).toBeEnabled();
  await expect(
    page.getByLabel("Source ready").getByText("Tiny PDF"),
  ).toBeVisible();
  await expectWorkflowReadyNearSource(page);

  await page.setInputFiles("#book-source-file", blankPdfPath);
  await expect(
    page.getByText("scanned or image-only", { exact: false }),
  ).toBeVisible();

  await page.setInputFiles("#book-source-file", brokenPdfPath);
  await expect(
    page
      .getByLabel("Source upload failed")
      .getByText("This PDF could not be parsed as text."),
  ).toBeVisible();
});

test("cleanup toggles update preview and report Gutenberg stripping", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const cleanupPath = writeFixture(
    testInfo,
    "cleanup-upload.txt",
    `Header
*** START OF THE PROJECT GUTENBERG EBOOK TEST ***
This is \u201cpractice\u201d text \u2014 with an emoji \u2603.
*** END OF THE PROJECT GUTENBERG EBOOK TEST ***
Footer`,
  );

  await page.setInputFiles("#book-source-file", cleanupPath);
  await expect(
    page.getByText("Current file: cleanup-upload.txt"),
  ).toBeVisible();
  const cleanedPreview = page
    .locator("pre")
    .filter({ hasText: "Header" })
    .first();
  await expect(cleanedPreview).toBeVisible();
  await page.getByLabel("Strip Project Gutenberg header/footer").check();
  await expect(
    page
      .locator("li")
      .filter({ hasText: "Project Gutenberg header/footer" })
      .first(),
  ).toBeVisible();
  await expect(cleanedPreview).toHaveCount(0);
  await page.getByLabel("Simplify punctuation for practice").check();
  await expect(page.getByText("Top unsupported characters")).toBeVisible();
});

test("large synthetic input and quick file replacement stay usable", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const largeText = "ALPHA BRAVO SOS ".repeat(4_000);
  await page.getByLabel("Paste long-form source text").fill(largeText);
  const detailsSection = page.locator(
    "section[aria-labelledby='book-details-previews-heading']",
  );
  await expect(
    detailsSection.getByText("Characters", { exact: true }),
  ).toBeVisible();
  await expect(
    detailsSection.getByText("63,999", { exact: true }),
  ).toBeVisible();

  const epubPath = writeFixture(testInfo, "slowish.epub", makeEpub({}));
  const txtPath = writeFixture(
    testInfo,
    "replacement.txt",
    "Replacement source wins",
  );
  const input = page.locator("#book-source-file");
  await Promise.allSettled([
    input.setInputFiles(epubPath),
    input.setInputFiles(txtPath),
  ]);
  await expect(page.getByText("Current file: replacement.txt")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "Replacement source wins" }).first(),
  ).toBeVisible();
});

test("mobile route smoke has no horizontal overflow or console regressions", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await blockExternalNetwork(page);
  const consoleEntries = collectConsoleErrors(page);
  await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.getByRole("heading", { name: /Book to Morse Code/ }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(consoleEntries, testInfo.title).toEqual([]);
});
