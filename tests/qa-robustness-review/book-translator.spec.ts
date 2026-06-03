import { expect, test } from "@playwright/test";
import type { Page, TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import {
  buildBookSignalEvents,
  renderBookPartPcm,
} from "../../app/client/components/morse-code-book-translator/bookBundleExport";
import {
  buildMorseTranscript,
  estimateBookTextDurationMs,
} from "../../app/client/components/morse-code-book-translator/bookDurationEstimate";
import {
  buildBookVideoWarnings,
  describeBookVideoDownloadContents,
  getBookVideoDownloadKind,
} from "../../app/client/components/morse-code-book-translator/bookVideoExport";
import { buildBookVideoTimeline } from "../../app/client/components/morse-code-book-translator/bookVideoRenderer";
import { DEFAULT_BOOK_VIDEO_SETTINGS } from "../../app/client/components/morse-code-book-translator/bookVideoTypes";
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
const BOOK_TOOL_LABEL = "Book source review and download tool";

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
  ).toHaveCount(0);
  await expect(
    sourceStep(page).getByRole("heading", { name: "Download audio" }),
  ).toBeVisible();
  await expect(
    sourceStep(page).getByRole("heading", { name: "Preview audio" }),
  ).toBeVisible();
  await expectPreviewReady(page);
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    bookTool(page).getByRole("button", {
      name: /Download (MP3|WAV|ZIP bundle)/,
    }),
  ).toHaveCount(1);
  await expect(
    sourceStep(page).getByRole("button", {
      name: /Download (MP3|WAV|ZIP bundle)/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download sample" }),
  ).toHaveCount(0);
  await expect(downloadSettingsToggle(page)).toHaveAttribute(
    "aria-expanded",
    "false",
  );
}

function downloadSettingsToggle(page: Page) {
  return page.locator("summary").filter({ hasText: "Download settings" });
}

async function openDownloadSettings(page: Page) {
  const toggle = downloadSettingsToggle(page);
  if ((await toggle.getAttribute("aria-expanded")) !== "true") {
    await toggle.click();
  }
}

async function chooseOutputFormat(page: Page, format: "mp3" | "wav") {
  await openDownloadSettings(page);
  await page
    .getByRole("radio", { name: format === "mp3" ? /MP3/ : /WAV/ })
    .click();
}

function outputTypeRadio(page: Page, outputType: "audio" | "video") {
  return bookTool(page).getByRole("radio", {
    exact: true,
    name: outputType === "audio" ? "Audio" : "Video",
  });
}

async function chooseOutputType(page: Page, outputType: "audio" | "video") {
  await outputTypeRadio(page, outputType).click();
}

async function chooseSplitMode(
  page: Page,
  mode: "No split" | "By duration" | "By source sections",
) {
  await openDownloadSettings(page);
  await page.getByRole("radio", { name: mode, exact: true }).click();
}

function previewSection(page: Page) {
  return bookTool(page).getByTestId("book-preview-section");
}

async function expectPreviewReady(page: Page) {
  await expect(
    previewSection(page).getByTestId("book-preview-status"),
  ).toContainText(/Ready|Stopped/);
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

async function downloadZip(page: Page, testInfo: TestInfo) {
  const downloadPromise = page.waitForEvent("download", { timeout: 90_000 });
  await page.getByRole("button", { name: /Download ZIP bundle/ }).click();
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

async function downloadAudioFile(
  page: Page,
  testInfo: TestInfo,
  buttonName: RegExp,
) {
  const downloadPromise = page.waitForEvent("download", { timeout: 90_000 });
  await page.getByRole("button", { name: buttonName }).click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(filePath);
  return {
    filename: download.suggestedFilename(),
    bytes: new Uint8Array(fs.readFileSync(filePath)),
  };
}

async function downloadVideoFile(
  page: Page,
  testInfo: TestInfo,
  buttonName: RegExp,
) {
  const downloadPromise = page.waitForEvent("download", { timeout: 90_000 });
  await page.getByRole("button", { name: buttonName }).click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(filePath);
  return {
    filename: download.suggestedFilename(),
    bytes: new Uint8Array(fs.readFileSync(filePath)),
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

function expectOrderedMediaPartFiles(
  names: string[],
  extension: "mp3" | "wav" | "webm",
) {
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

function expectWebmLike(bytes: Uint8Array) {
  expect(bytes.length).toBeGreaterThan(4);
  expect(strFromU8(bytes)).toContain("WEBM");
}

async function installFastVideoRecorder(page: Page) {
  await page.addInitScript(() => {
    class FakeMediaRecorder {
      static isTypeSupported(type: string) {
        return type.startsWith("video/webm");
      }

      state = "inactive";
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onerror: (() => void) | null = null;
      onstop: (() => void) | null = null;
      readonly mimeType: string;

      constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
        this.mimeType = options?.mimeType || "video/webm";
      }

      start() {
        this.state = "recording";
      }

      stop() {
        if (this.state === "inactive") return;
        this.state = "inactive";
        const blob = new Blob(["WEBM-BOOK-VIDEO"], {
          type: this.mimeType,
        });
        window.setTimeout(() => {
          this.ondataavailable?.({ data: blob } as BlobEvent);
          this.onstop?.();
        }, 0);
      }
    }

    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: FakeMediaRecorder,
    });
    HTMLCanvasElement.prototype.captureStream = function captureStream() {
      return new MediaStream();
    };
  });
}

async function installUnsupportedVideoRecorder(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, "captureStream", {
      configurable: true,
      value: undefined,
    });
  });
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
  settingsSummary: {
    outputFormat: string;
    targetPartMinutes: number;
    tonePreset: string;
    pitch: number;
    volume: number;
    mp3Bitrate: number;
    sampleRate: number;
    tailPaddingMs: number;
    splitMode: string;
    splitAudio: boolean;
  };
};

type BundleSettings = {
  generatedAt: string;
  presetName: string;
  outputFormat: "mp3" | "wav";
  tonePreset: string;
  pitch: number;
  volume: number;
  mp3Bitrate: number;
  sampleRate: number;
  tailPaddingMs: number;
  splitMode: string;
  splitAudio: boolean;
  targetPartMinutes: number;
  includeCleanedText: boolean;
  includeMorseTranscript: boolean;
};

type VideoBundleManifest = {
  outputType: "video";
  outputFormat: "webm";
  mimeType: string;
  partCount: number;
  files: { video: string[]; cleanedText?: string; morseTranscript?: string };
  parts: Array<{
    filename: string;
    runtimeMs: number;
    sourceStart: number;
    sourceEnd: number;
  }>;
  settingsSummary: {
    visualStyle: string;
    includeAudioTrack: boolean;
    resolution: string;
    showBranding: boolean;
    textDisplayMode: string;
    targetPartMinutes: number;
    charWpm: number;
    farnsworthWpm: number;
  };
};

type VideoBundleSettings = {
  outputType: "video";
  outputFormat: "webm";
  mimeType: string;
  frameRate: number;
  visualStyle: string;
  includeAudioTrack: boolean;
  resolution: string;
  showBranding: boolean;
  textDisplayMode: string;
  targetPartMinutes: number;
  charWpm: number;
  farnsworthWpm: number;
};

function makeVideoPart(index: number, text = "E") {
  return {
    index,
    title: `Part ${index}`,
    sourceStart: index - 1,
    sourceEnd: index,
    cleanedText: text,
    cleanedExcerpt: text,
    morseDurationMs: estimateBookTextDurationMs(
      text,
      BOOK_EXPORT_PRESETS["Reader Quick Start"],
    ),
    estimatedFilename: `morse-book-part-${String(index).padStart(3, "0")}.mp3`,
  };
}

test("book translator route metadata, alias, and sitemap use canonical URL", async ({
  page,
  request,
}) => {
  await openBookTranslator(page);

  await expect(page).toHaveTitle(
    /Book to Morse Code Translator \| Long Text to Morse Audio/,
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
    previewSection(page).getByRole("heading", { name: "Preview audio" }),
  ).toBeVisible();
  await expect(
    previewSection(page).getByTestId("book-preview-sample"),
  ).toContainText("Plain text chapter");
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
  await expectWorkflowReadyNearSource(page);
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

test("large extracted edit mode uses apply and cancel without downloading draft text", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const largeSource = `Original active source SOS.\n\n${"ALPHA BRAVO HELP ".repeat(
    3_200,
  )}`;
  const txtPath = writeFixture(testInfo, "large-edit-source.txt", largeSource);

  await page.setInputFiles("#book-source-file", txtPath);
  await page.getByRole("button", { name: "Edit extracted text" }).click();
  await expect(page.getByText("Large edits apply manually")).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply edits" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel edits" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Download (MP3|WAV|ZIP bundle)/ }),
  ).toBeEnabled();

  await page
    .getByRole("textbox", { name: "Edit extracted text draft" })
    .fill("Draft only SOS");
  await expect(page.getByText("Draft edits are not included")).toBeVisible();
  await expect(
    page
      .locator("pre")
      .filter({ hasText: "Original active source SOS" })
      .first(),
  ).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "Draft only SOS" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Cancel edits" }).click();
  await expect(
    page.getByRole("textbox", { name: "Edit extracted text draft" }),
  ).toHaveCount(0);
  await expect(
    page
      .locator("pre")
      .filter({ hasText: "Original active source SOS" })
      .first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Edit extracted text" }).click();
  await page
    .getByRole("textbox", { name: "Edit extracted text draft" })
    .fill("Applied draft source SOS");
  await page.getByRole("button", { name: "Apply edits" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "Applied draft source SOS" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Extracted text edits applied.")).toBeVisible();
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
  await expect(
    page.getByRole("textbox", { name: "Edit extracted text draft" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Edit extracted text draft" }),
  ).toHaveValue(/First Signal[\s\S]*Second Signal/);
  await expect(
    page.getByRole("button", { name: "Copy extracted text" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Copy cleaned text" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: /Download (MP3|WAV|ZIP bundle)/ }),
  ).toBeEnabled();
  await expect(page.getByRole("button", { name: "Apply edits" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel edits" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Edit extracted text draft" })
    .fill("Edited extracted source SOS");
  await page.getByRole("button", { name: "Apply edits" }).click();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    "Edited extracted source SOS",
  );

  await page.getByRole("button", { name: "Clear source" }).first().click();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    page.getByText("Part splitting appears after source text is available."),
  ).toHaveCount(0);
  await expect(page.getByText("Audio file summary")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Download (MP3|WAV|ZIP bundle)/ }),
  ).toBeDisabled();
  await expect(page.getByText("Last download")).toHaveCount(0);
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
    page.getByText(
      "Add source text or upload a source file to enable download.",
    ),
  ).toBeVisible();
});

test("duration estimates and segmentation use shared Morse timing", async () => {
  const settings = {
    ...BOOK_EXPORT_PRESETS["Faithful Source"],
    splitMode: "duration" as const,
    splitAudio: true,
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

  const directParts = segmentBookText({
    cleanedText: "ALPHA SOS.\n\nBRAVO HELP.",
    settings: { ...settings, splitMode: "none", splitAudio: false },
    sourceTitle: "Direct Book",
  });
  expect(directParts).toHaveLength(1);

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
      splitMode: "source-sections",
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

test("video timeline and package kind use shared timing and direct-vs-ZIP rules", () => {
  const settings = BOOK_EXPORT_PRESETS["Reader Quick Start"];
  const text = "SOS HELP";
  const timeline = buildBookVideoTimeline(text, settings);
  const signalEvents = buildBookSignalEvents(text, settings);
  expect(timeline.events.length).toBe(signalEvents.length);
  expect(timeline.durationMs).toBeGreaterThanOrEqual(
    signalEvents.reduce((sum, event) => sum + event.ms, 0),
  );

  const singlePart = [makeVideoPart(1)];
  const multiPart = [makeVideoPart(1), makeVideoPart(2)];
  expect(getBookVideoDownloadKind(singlePart, settings)).toBe("video");
  expect(getBookVideoDownloadKind(multiPart, settings)).toBe("zip");
  expect(describeBookVideoDownloadContents(singlePart, settings)).toEqual([
    "WebM video file",
  ]);
  expect(describeBookVideoDownloadContents(multiPart, settings)).toContain(
    "WebM video parts",
  );

  const sidecarSettings = {
    ...settings,
    includeManifest: true,
  };
  expect(getBookVideoDownloadKind(singlePart, sidecarSettings)).toBe("zip");
  expect(
    buildBookVideoWarnings({
      downloadKind: "video",
      partCount: 1,
      support: null,
      totalRuntimeMs: 91_000,
      videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
    }),
  ).toContain(
    "Long videos may take time to render. Keep this tab open until the WebM is ready.",
  );
  expect(
    buildBookVideoWarnings({
      downloadKind: "zip",
      partCount: 1,
      support: null,
      totalRuntimeMs: 91_000,
      videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
    }),
  ).toContain(
    "Long videos may take time to render. Selected extras are packaged with the WebM in a ZIP download.",
  );
  expect(
    buildBookVideoWarnings({
      downloadKind: "zip",
      partCount: 2,
      support: null,
      totalRuntimeMs: 91_000,
      videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
    }),
  ).toContain(
    "Long videos may take time to render. Split video downloads are packaged in ZIP files.",
  );
});

test("segmentation handles long-source boundary edge cases without empty parts", async () => {
  const settings = {
    ...BOOK_EXPORT_PRESETS["Practice Copy"],
    splitMode: "duration" as const,
    splitAudio: true,
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

test("custom cleanup rules are plain-text, ordered, reversible transforms", async () => {
  const cleanupOptions = {
    normalizeSmartPunctuation: true,
    stripZeroWidthAndSoftHyphen: true,
    stripGutenbergHeaderFooter: false,
    simplifyPunctuation: false,
  };

  const cleaned = applyCleanupOptions(
    "Intro REMOVE old phrase cat scatter Cat",
    cleanupOptions,
    [
      {
        id: "remove",
        enabled: true,
        find: "REMOVE ",
        replacement: "",
        caseSensitive: false,
        wholeWord: false,
      },
      {
        id: "replace",
        enabled: true,
        find: "old phrase",
        replacement: "new phrase",
        caseSensitive: false,
        wholeWord: false,
      },
      {
        id: "disabled",
        enabled: false,
        find: "Intro",
        replacement: "Hidden",
        caseSensitive: false,
        wholeWord: false,
      },
      {
        id: "case",
        enabled: true,
        find: "Cat",
        replacement: "Lynx",
        caseSensitive: true,
        wholeWord: true,
      },
      {
        id: "whole-word",
        enabled: true,
        find: "cat",
        replacement: "dog",
        caseSensitive: false,
        wholeWord: true,
      },
    ],
  );

  expect(cleaned.cleanedText).toBe("Intro new phrase dog scatter Lynx");
  expect(cleaned.customRuleMatches).toEqual([
    { id: "remove", count: 1, active: true },
    { id: "replace", count: 1, active: true },
    { id: "disabled", count: 0, active: false },
    { id: "case", count: 1, active: true },
    { id: "whole-word", count: 1, active: true },
  ]);

  const reverted = applyCleanupOptions(
    "Intro REMOVE old phrase cat scatter Cat",
    cleanupOptions,
    [],
  );
  expect(reverted.cleanedText).toBe("Intro REMOVE old phrase cat scatter Cat");
});

test("preset settings, reset, and safe route preferences persist", async ({
  page,
}) => {
  await openBookTranslator(page);
  await expect(downloadSettingsToggle(page)).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await openDownloadSettings(page);
  await expect(page.getByText("Compact MP3 settings")).toBeVisible();

  await page.getByRole("button", { name: "Practice Copy" }).click();
  await expect(page.getByText("Slower Farnsworth spacing")).toBeVisible();
  await expect(page.getByText("Best for: Training and review")).toBeVisible();
  await expect(
    page.getByText("20/10 WPM, CW radio, MP3 48 kbps, single audio file."),
  ).toBeVisible();
  await expect(
    page.getByRole("radiogroup", { name: "Split download" }),
  ).toBeVisible();
  await expect(page.getByRole("radio", { name: "No split" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByRole("radio", { name: "By duration" })).toBeVisible();
  await expect(
    page.getByRole("radio", { name: "By source sections" }),
  ).toBeVisible();
  await expect(page.getByLabel("Target part length")).toHaveCount(0);
  await chooseSplitMode(page, "By duration");
  await expect(page.getByLabel("Target part length")).toBeVisible();
  await expect(page.getByLabel("Tone preset")).toHaveValue("cw_radio");
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();
  await expect(page.getByLabel("WAV sample rate")).toHaveCount(0);
  await expect(page.getByLabel("Tail padding")).toHaveCount(0);

  const settingsToggle = downloadSettingsToggle(page);
  await expect(settingsToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByLabel("Include Morse transcript")).toBeVisible();
  await chooseOutputFormat(page, "wav");
  await expect(page.getByLabel("MP3 bitrate")).toHaveCount(0);
  await expect(page.getByLabel("WAV sample rate")).toBeVisible();
  await expect(page.getByLabel("Tail padding")).toBeVisible();
  await expect(page.getByText("Modified from preset")).toBeVisible();

  await page.getByLabel("Tone preset").selectOption("warm_tone");
  await expect(page.getByLabel("Tone preset")).toHaveValue("warm_tone");
  await expect(page.getByLabel("Pitch")).toHaveValue("560");
  await expect(page.getByLabel("Volume")).toHaveValue("72");

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
  await expect(page.getByRole("radio", { name: /MP3/ })).toHaveAttribute(
    "aria-checked",
    "true",
  );

  await chooseOutputFormat(page, "wav");
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
  await expect(page.getByRole("radio", { name: /WAV/ })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByText("Modified from preset")).toBeVisible();
});

test("malformed saved preferences fall back safely without source persistence", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "{not valid json");
  }, BOOK_EXPORT_PREFERENCES_KEY);
  await openBookTranslator(page);
  await expect(downloadSettingsToggle(page)).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await openDownloadSettings(page);
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

test("split mode controls expose duration and source-section fallback behavior", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Split controls SOS HELP. ".repeat(20));
  await openDownloadSettings(page);

  await expect(page.getByRole("radio", { name: "No split" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByLabel("Target part length")).toHaveCount(0);

  await chooseSplitMode(page, "By source sections");
  await expect(page.getByLabel("Target part length")).toBeVisible();
  await expect(page.getByTestId("book-split-section-fallback")).toContainText(
    "No source section hints are available",
  );

  await chooseSplitMode(page, "No split");
  await expect(page.getByLabel("Target part length")).toHaveCount(0);
  await expect(page.getByTestId("book-split-section-fallback")).toHaveCount(0);

  await chooseSplitMode(page, "By duration");
  await expect(page.getByLabel("Target part length")).toBeVisible();
  await expect(page.getByTestId("book-split-section-fallback")).toHaveCount(0);
});

test("audio preview plays current cleaned source and updates with audio settings", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Preview KEEP REMOVE SOS HELP. ".repeat(8));

  const preview = previewSection(page);
  await expect(
    preview.getByRole("heading", { name: "Preview audio" }),
  ).toBeVisible();
  await expectPreviewReady(page);
  await expect(preview.getByTestId("book-preview-sample")).toContainText(
    "REMOVE",
  );
  await expect(preview.getByText("18/12 WPM")).toBeVisible();
  await expect(preview.getByText("650 Hz")).toBeVisible();
  await expect(preview.getByText("75%")).toBeVisible();

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").fill("REMOVE");
  await expect(preview.getByTestId("book-preview-sample")).not.toContainText(
    "REMOVE",
  );
  await expectPreviewReady(page);

  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Long Listen" }).click();
  await expect(preview.getByText("16/12 WPM")).toBeVisible();
  await expect(preview.getByText("600 Hz")).toBeVisible();
  await expect(preview.getByText("68%")).toBeVisible();
  await expectPreviewReady(page);

  const playButton = preview.getByRole("button", { name: "Play preview" });
  await playButton.click();
  await expect(
    preview.getByRole("button", { name: "Stop preview" }),
  ).toBeVisible();
  const clickedFocusStyle = await preview
    .getByRole("button", { name: "Stop preview" })
    .evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
  expect(clickedFocusStyle).toEqual({
    outlineStyle: "none",
    outlineWidth: "0px",
  });

  await page
    .getByLabel("Paste long-form source text")
    .fill("Changed preview SOS");
  await expect(
    preview.getByRole("button", { name: "Play preview" }),
  ).toBeVisible();
  await expect(preview.getByTestId("book-preview-sample")).toContainText(
    "Changed preview SOS",
  );
  await expectNoRawSourceInStorage(page, "Changed preview SOS");
  await expect(
    page.getByRole("button", { name: "Download sample" }),
  ).toHaveCount(0);
});

test("output type selector gates audio and video settings without clearing source", async ({
  page,
}) => {
  await installFastVideoRecorder(page);
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill(`${RAW_SECRET_TEXT} output mode SOS`);

  await expect(outputTypeRadio(page, "audio")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(outputTypeRadio(page, "video")).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await openDownloadSettings(page);
  await expect(
    page.getByRole("heading", { name: "Audio settings" }),
  ).toBeVisible();
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Video settings" }),
  ).toHaveCount(0);
  await expectPreviewReady(page);
  await previewSection(page)
    .getByRole("button", { name: "Play preview" })
    .click();
  await expect(
    previewSection(page).getByRole("button", { name: "Stop preview" }),
  ).toBeVisible();

  await chooseOutputType(page, "video");
  await expect(outputTypeRadio(page, "video")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(
    previewSection(page).getByRole("button", { name: "Stop preview" }),
  ).toHaveCount(0);
  await expect(
    previewSection(page).getByRole("heading", { name: "Preview video" }),
  ).toBeVisible();
  const clickedVideoFocusStyle = await outputTypeRadio(page, "video").evaluate(
    (element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    },
  );
  expect(clickedVideoFocusStyle).toEqual({
    outlineStyle: "none",
    outlineWidth: "0px",
  });
  await expect(
    page.getByRole("heading", { name: "Download video" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download WebM" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("heading", { name: "Video settings" }),
  ).toBeVisible();
  await expect(page.getByRole("radio", { name: /Lightbulb/ })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByLabel("MP3 bitrate")).toHaveCount(0);
  await expect(page.getByLabel("WAV sample rate")).toHaveCount(0);
  await expect(page.getByRole("radio", { name: /MP3/ })).toHaveCount(0);
  await expect(page.getByRole("radio", { name: /WAV/ })).toHaveCount(0);
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    `${RAW_SECRET_TEXT} output mode SOS`,
  );
  await expectNoRawSourceInStorage(page, RAW_SECRET_TEXT);
  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .toContain('"outputType":"video"');

  await chooseOutputType(page, "audio");
  await expect(outputTypeRadio(page, "audio")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Download audio" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Audio settings" }),
  ).toBeVisible();
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Video settings" }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    `${RAW_SECRET_TEXT} output mode SOS`,
  );
});

test("video preview modes, branding, and full-frame warning stay scoped", async ({
  page,
}) => {
  await installFastVideoRecorder(page);
  await openBookTranslator(page);
  await page.getByLabel("Paste long-form source text").fill("SOS HELP preview");
  await chooseOutputType(page, "video");
  await openDownloadSettings(page);

  await expect(
    previewSection(page).getByRole("heading", { name: "Preview video" }),
  ).toBeVisible();
  await expectPreviewReady(page);
  await expect(
    previewSection(page).getByTestId("book-preview-sample"),
  ).toContainText("SOS HELP preview");
  await expect(previewSection(page).getByText("Audio track on")).toBeVisible();
  await expect(
    previewSection(page).getByRole("button", { name: "Play visual preview" }),
  ).toBeVisible();
  await expect(page.getByTestId("book-video-preview")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-lightbulb")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-branding")).toContainText(
    "www.morsewords.com",
  );
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

  await page.getByRole("radio", { name: /Dot/ }).click();
  await expect(page.getByTestId("book-video-preview-dot")).toBeVisible();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );

  await page.getByRole("radio", { name: /Full-frame flash/ }).click();
  await expect(page.getByTestId("book-video-preview-full-frame")).toBeVisible();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    1,
  );
  await expect(page.getByText("Strobe warning:")).toBeVisible();
  await expect(
    page.getByText("can create rapid full-frame flashing"),
  ).toBeVisible();
  await expectPreviewReady(page);
  await previewSection(page)
    .getByRole("button", { name: "Play visual preview" })
    .click();
  await expect(page.getByTestId("book-video-preview")).toHaveAttribute(
    "data-preview-playing",
    "true",
  );
  await expect(
    previewSection(page).getByRole("button", { name: "Stop visual preview" }),
  ).toBeVisible();
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

  await page.getByRole("radio", { name: /Animated Morse text/ }).click();
  await expect(
    previewSection(page).getByRole("button", { name: "Play visual preview" }),
  ).toBeVisible();
  await expect(page.getByTestId("book-video-preview-morse-text")).toBeVisible();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );
  await page.getByLabel("Show small MorseWords branding").uncheck();
  await expect(page.getByTestId("book-video-preview-branding")).toHaveCount(0);
  await expect(
    page.getByTestId("book-video-preview-morse-overlay"),
  ).toBeVisible();
  await expect(
    page.getByRole("radiogroup", { name: "Text shown in video" }),
  ).toBeVisible();
  for (const label of ["None", "Morse only", "Text only", "Morse + text"]) {
    await expect(
      page.getByRole("radio", { name: label, exact: true }),
    ).toBeVisible();
  }
  await page.getByRole("radio", { name: "Text only", exact: true }).click();
  await expect(previewSection(page).getByText("Text only")).toBeVisible();
  await expect(
    page.getByTestId("book-video-preview-morse-overlay"),
  ).toHaveCount(0);
  await expect(
    page.getByTestId("book-video-preview-text-overlay"),
  ).toBeVisible();
  await page.getByRole("radio", { name: "None", exact: true }).click();
  await expect(page.getByTestId("book-video-preview-text-overlay")).toHaveCount(
    0,
  );
  await page.getByRole("radio", { name: "Morse + text", exact: true }).click();
  await expect(
    page.getByTestId("book-video-preview-morse-overlay"),
  ).toBeVisible();
  await expect(
    page.getByTestId("book-video-preview-text-overlay"),
  ).toBeVisible();
  await page.getByLabel("Include audio track").uncheck();
  await expect(previewSection(page).getByText("Audio track off")).toBeVisible();
});

test("visual preview visibly animates and stops stale playback", async ({
  page,
}) => {
  await installFastVideoRecorder(page);
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("SOS HELP visual preview animation");
  await chooseOutputType(page, "video");
  await openDownloadSettings(page);
  await expectPreviewReady(page);

  const frameBox = await page
    .getByTestId("book-video-preview-frame")
    .boundingBox();
  expect(frameBox).not.toBeNull();
  const frameRatio = frameBox!.width / frameBox!.height;
  expect(frameRatio).toBeGreaterThan(1.65);
  expect(frameRatio).toBeLessThan(1.9);
  const lightbulbBox = await page
    .getByTestId("book-video-preview-lightbulb")
    .locator("svg")
    .boundingBox();
  expect(lightbulbBox).not.toBeNull();
  expect(lightbulbBox!.width).toBeGreaterThanOrEqual(80);
  await expect(page.getByLabel("Video preview timeline")).toBeVisible();

  await previewSection(page)
    .getByRole("button", { name: "Play visual preview" })
    .click();
  await expect
    .poll(() =>
      page.getByTestId("book-video-preview-lightbulb").getAttribute("class"),
    )
    .toContain("text-sky-100");
  await previewSection(page)
    .getByRole("button", { name: "Stop visual preview" })
    .click();
  await expect(page.getByTestId("book-video-preview")).toHaveAttribute(
    "data-preview-playing",
    "false",
  );

  await page.getByRole("radio", { name: /Dot/ }).click();
  await expectPreviewReady(page);
  await previewSection(page)
    .getByRole("button", { name: "Play visual preview" })
    .click();
  await expect
    .poll(() =>
      page.getByTestId("book-video-preview-dot").getAttribute("class"),
    )
    .toContain("ring-4");
  await previewSection(page)
    .getByRole("button", { name: "Stop visual preview" })
    .click();

  await page.getByRole("radio", { name: /Animated Morse text/ }).click();
  await expectPreviewReady(page);
  const initialMorseText = await page
    .getByTestId("book-video-preview-morse-text")
    .innerText();
  await page.getByLabel("Video preview timeline").evaluate((element) => {
    const input = element as HTMLInputElement;
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    nativeSetter?.call(input, "5000");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(page.getByTestId("book-video-preview-time")).toContainText(
    /^5s \/ \d+s$/,
  );
  await expect
    .poll(() => page.getByTestId("book-video-preview-morse-text").innerText())
    .not.toBe(initialMorseText);
  const seekedMorseText = await page
    .getByTestId("book-video-preview-morse-text")
    .innerText();
  await previewSection(page)
    .getByRole("button", { name: "Play visual preview" })
    .click();
  await expect
    .poll(() => page.getByTestId("book-video-preview-morse-text").innerText())
    .not.toBe(seekedMorseText);

  await page
    .getByLabel("Paste long-form source text")
    .fill("Replacement preview source stops playback");
  await expect(page.getByTestId("book-video-preview")).toHaveAttribute(
    "data-preview-playing",
    "false",
  );
  await expect(
    previewSection(page).getByRole("button", { name: "Play visual preview" }),
  ).toBeVisible();
});

test("unsupported video export APIs show a clear unavailable message", async ({
  page,
}) => {
  await installUnsupportedVideoRecorder(page);
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Video fallback SOS");
  await chooseOutputType(page, "video");

  await expect(page.locator("#book-download-disabled-reason")).toContainText(
    "This browser does not support MediaRecorder video export.",
  );
  await expect(
    page.getByRole("button", { name: "Download WebM" }),
  ).toBeDisabled();
  await expect(
    page.getByText("MP4 is not guaranteed in-browser"),
  ).toBeVisible();
});

for (const mode of [
  { label: "Lightbulb", testId: "book-video-preview-lightbulb" },
  { label: "Dot", testId: "book-video-preview-dot" },
  { label: "Animated Morse text", testId: "book-video-preview-morse-text" },
] as const) {
  test(`${mode.label} mode downloads a non-empty direct WebM`, async ({
    page,
  }, testInfo) => {
    await installFastVideoRecorder(page);
    await openBookTranslator(page);
    const rawSource = `qz ${mode.label.toLowerCase().split(" ")[0]}`;
    await page.getByLabel("Paste long-form source text").fill(rawSource);
    await chooseOutputType(page, "video");
    await openDownloadSettings(page);
    if (mode.label !== "Lightbulb") {
      await page.getByRole("radio", { name: new RegExp(mode.label) }).click();
    }

    await expect(page.getByTestId(mode.testId)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download WebM" }),
    ).toBeEnabled();
    const video = await downloadVideoFile(page, testInfo, /Download WebM/);
    expect(video.filename).toMatch(/morse-video\.webm$/);
    expectWebmLike(video.bytes);
    await expect(page.getByText("Last download")).toBeVisible();
    await expect(
      page.getByText("Download contents: WebM video file", { exact: false }),
    ).toBeVisible();
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
    await expectNoRawSourceInStorage(page, rawSource);
  });
}

test("video sidecar downloads use a ZIP with WebM parts and video metadata", async ({
  page,
}, testInfo) => {
  await installFastVideoRecorder(page);
  await openBookTranslator(page);
  await page.getByLabel("Paste long-form source text").fill("ZIP video SOS");
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await chooseOutputType(page, "video");
  await page.getByRole("radio", { name: "Morse + text", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Download ZIP bundle" }),
  ).toBeEnabled();

  const zip = await downloadZip(page, testInfo);
  expect(zip.filename).toMatch(/morse-video-bundle\.zip$/);
  const partFiles = expectOrderedMediaPartFiles(zip.names, "webm");
  expectWebmLike(zip.entries[partFiles[0]]);
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
  const manifest = zipJson<VideoBundleManifest>(zip.entries, "manifest.json");
  expect(manifest.outputType).toBe("video");
  expect(manifest.outputFormat).toBe("webm");
  expect(manifest.mimeType).toContain("video/webm");
  expect(manifest.files.video).toEqual(partFiles);
  expect(manifest.parts.map((part) => part.filename)).toEqual(partFiles);
  expect(manifest.settingsSummary.visualStyle).toBe("lightbulb");
  expect(manifest.settingsSummary.textDisplayMode).toBe("both");
  expect(manifest.settingsSummary.showBranding).toBe(true);
  expect(manifest.settingsSummary.resolution).toBe("720p");
  const settings = zipJson<VideoBundleSettings>(zip.entries, "settings.json");
  expect(settings.outputType).toBe("video");
  expect(settings.outputFormat).toBe("webm");
  expect(settings.frameRate).toBe(24);
  expect(settings.visualStyle).toBe("lightbulb");
  expect(settings.textDisplayMode).toBe("both");
  expect(settings.showBranding).toBe(true);
  expectPlaylistOrder(zipText(zip.entries, "playlist.m3u"), partFiles);
  const readme = zipText(zip.entries, "README.txt");
  expect(readme).toContain("WebM is the browser-native video format");
  expect(readme).toContain("MP4 is not guaranteed");

  await page.getByLabel("Show small MorseWords branding").uncheck();
  await expect(page.getByText("Last download")).toHaveCount(0);
});

test("video WebM rendering receives selected text display mode", async ({
  page,
}, testInfo) => {
  await installFastVideoRecorder(page);
  await page.addInitScript(() => {
    const originalFillText = CanvasRenderingContext2D.prototype.fillText;
    Object.defineProperty(window, "__bookVideoFillText", {
      configurable: true,
      value: [] as string[],
      writable: true,
    });
    CanvasRenderingContext2D.prototype.fillText = function fillText(
      text,
      x,
      y,
      maxWidth,
    ) {
      (
        window as typeof window & { __bookVideoFillText: string[] }
      ).__bookVideoFillText.push(String(text));
      if (typeof maxWidth === "number") {
        return originalFillText.call(this, text, x, y, maxWidth);
      }
      return originalFillText.call(this, text, x, y);
    };
  });
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Plain display SOS HELP");
  await chooseOutputType(page, "video");
  await openDownloadSettings(page);
  await page.getByRole("radio", { name: "Text only", exact: true }).click();

  const video = await downloadVideoFile(page, testInfo, /Download WebM/);
  expectWebmLike(video.bytes);
  const drawnText = await page.evaluate(
    () =>
      (
        window as typeof window & { __bookVideoFillText?: string[] }
      ).__bookVideoFillText?.join("\n") ?? "",
  );
  expect(drawnText).toContain("Plain display SOS HELP");
  expect(drawnText).not.toContain("... .--.");
});

test("video cancellation and source changes prevent stale completed state", async ({
  page,
}) => {
  await installFastVideoRecorder(page);
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Long video cancel SOS HELP ".repeat(8));
  await chooseOutputType(page, "video");

  await page.getByRole("button", { name: "Download WebM" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Cancel download" }).click();
  await expect(page.getByText("Download cancelled.")).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("Last download")).toHaveCount(0);

  await page.getByRole("button", { name: "Download WebM" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toBeEnabled();
  await page
    .getByLabel("Paste long-form source text")
    .fill("Replacement video source");
  await expect(
    page.getByText("Source changed; download cancelled."),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("Last download")).toHaveCount(0);
  await expect(page.getByText("WebM download started.")).toHaveCount(0);
});

test("switching output type clears stale results and audio still downloads", async ({
  page,
}, testInfo) => {
  await installFastVideoRecorder(page);
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Mode switch download SOS HELP.");

  const firstAudio = await downloadAudioFile(page, testInfo, /Download MP3/);
  expect(firstAudio.filename).toMatch(/morse-audio\.mp3$/);
  expectMp3Like(firstAudio.bytes);
  await expect(page.getByText("Last download")).toBeVisible();

  await chooseOutputType(page, "video");
  await expect(page.getByText("Last download")).toHaveCount(0);
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    "Mode switch download SOS HELP.",
  );
  await expect(
    page.getByRole("button", { name: "Download WebM" }),
  ).toBeEnabled();

  await chooseOutputType(page, "audio");
  await expect(
    page.getByRole("button", { name: "Download MP3" }),
  ).toBeEnabled();
  const secondAudio = await downloadAudioFile(page, testInfo, /Download MP3/);
  expect(secondAudio.filename).toMatch(/morse-audio\.mp3$/);
  expectMp3Like(secondAudio.bytes);
});

test("empty source, cleaned-empty source, large WAV, and progress semantics are clear", async ({
  page,
}) => {
  await openBookTranslator(page);
  const settingsToggle = downloadSettingsToggle(page);
  const downloadButton = page.getByRole("button", {
    name: /Download (MP3|WAV|ZIP bundle)/,
  });
  await expect(
    bookTool(page).getByRole("button", {
      name: /Download (MP3|WAV|ZIP bundle)/,
    }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Download audio" }),
  ).toBeVisible();
  await expect(page.getByText("Review export")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Add source" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Add source text or upload a source file to enable download.",
    ),
  ).toBeVisible();
  await expect(settingsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(downloadButton).toBeDisabled();
  await expect(
    page.getByRole("progressbar", { name: "Book download progress" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Choose download settings, then download audio."),
  ).toHaveCount(0);

  await page.getByLabel("Paste long-form source text").fill("   \n   ");
  await expect(downloadButton).toBeDisabled();

  await page.getByLabel("Paste long-form source text")
    .fill(`*** START OF THE PROJECT GUTENBERG EBOOK TEST ***

*** END OF THE PROJECT GUTENBERG EBOOK TEST ***`);
  await page.getByLabel("Strip Project Gutenberg header/footer").check();
  await expect(page.getByText("Cleanup removed all source text")).toBeVisible();
  await expect(downloadButton).toBeDisabled();

  await page
    .getByLabel("Paste long-form source text")
    .fill("ALPHA BRAVO SOS ".repeat(4_000));
  await chooseOutputFormat(page, "wav");
  await expect(page.getByText("WAV output may be very large")).toBeVisible();
  await expect(settingsToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByLabel("WAV sample rate")).toBeVisible();
  await expect(page.getByLabel("Tail padding")).toBeVisible();
  await expect(page.getByLabel("MP3 bitrate")).toHaveCount(0);

  await expect(
    page.getByRole("progressbar", { name: "Book download progress" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toHaveCount(0);
});

test("download controls stay lean and ZIP/split copy is scoped", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("ALPHA BRAVO SOS HELP ".repeat(4_000));

  const tool = bookTool(page);
  await expectWorkflowReadyNearSource(page);
  await expect(tool.getByText("ZIP bundle")).toHaveCount(0);
  await expect(
    tool.getByText("Split downloads save timed parts in a ZIP bundle."),
  ).toHaveCount(0);
  await expect(
    tool.getByRole("progressbar", { name: "Book download progress" }),
  ).toHaveCount(0);
  await expect(
    tool.getByRole("button", { name: "Cancel download" }),
  ).toHaveCount(0);

  await openDownloadSettings(page);
  const presetControls = page.getByTestId("book-preset-controls");
  await expect(
    presetControls.getByRole("button", { name: "Reader Quick Start" }),
  ).toBeVisible();
  const resetPreset = presetControls.getByRole("button", {
    name: "Reset preset",
  });
  await expect(resetPreset).toBeVisible();
  const presetBox = await presetControls.boundingBox();
  const resetBox = await resetPreset.boundingBox();
  expect(presetBox).not.toBeNull();
  expect(resetBox).not.toBeNull();
  expect(resetBox!.y).toBeGreaterThanOrEqual(presetBox!.y - 2);
  expect(resetBox!.y + resetBox!.height).toBeLessThanOrEqual(
    presetBox!.y + presetBox!.height + 2,
  );

  await chooseSplitMode(page, "By duration");
  await expect(
    tool.getByText("Split downloads save timed parts in a ZIP bundle."),
  ).toBeVisible();

  await chooseSplitMode(page, "No split");
  await expect(
    tool.getByText("Split downloads save timed parts in a ZIP bundle."),
  ).toHaveCount(0);

  await page.getByLabel("Include manifest").check();
  await expect(
    sourceStep(page).getByRole("button", { name: "Download ZIP bundle" }),
  ).toBeVisible();
  await expect(
    tool.getByText("No split is selected. A ZIP is still required"),
  ).toBeVisible();
  await page.getByLabel("Include manifest").uncheck();

  await chooseOutputType(page, "video");
  await expect(
    sourceStep(page).getByRole("button", { name: "Download WebM" }),
  ).toBeVisible();
  await expect(
    tool.getByText(
      "Long videos may take time to render. Keep this tab open until the WebM is ready.",
    ),
  ).toBeVisible();
  await expect(tool.getByText(/split into ZIP parts/i)).toHaveCount(0);
  await expect(
    tool.getByText("Split video downloads are packaged in ZIP files."),
  ).toHaveCount(0);
  await expect(
    tool.getByText(
      "Selected extras are packaged with the WebM in a ZIP download.",
    ),
  ).toHaveCount(0);

  await chooseSplitMode(page, "By duration");
  await expect(
    tool.getByText("Split video downloads are packaged in ZIP files."),
  ).toBeVisible();

  await chooseSplitMode(page, "No split");
  await expect(
    tool.getByText("Split video downloads are packaged in ZIP files."),
  ).toHaveCount(0);
});

test("route downloads a direct MP3 by default when no sidecars are selected", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Direct MP3 SOS HELP.");
  await expectWorkflowReadyNearSource(page);
  await expect(
    sourceStep(page).getByRole("button", { name: "Download MP3" }),
  ).toBeEnabled();
  await expect(page.getByText("Audio file summary")).toBeVisible();
  await expect(page.getByText("Single file")).toBeVisible();
  await expect(page.getByText("Split summary")).toHaveCount(0);

  const audio = await downloadAudioFile(page, testInfo, /Download MP3/);
  expect(audio.filename).toMatch(/morse-audio\.mp3$/);
  expectMp3Like(audio.bytes);
  await expect(page.getByText("Last download")).toBeVisible();
  await expect(page.getByText("MP3 audio file")).toBeVisible();
  await openDownloadSettings(page);
  await expect(page.getByRole("radio", { name: "No split" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await chooseSplitMode(page, "By duration");
  await expect(page.getByText("Last download")).toHaveCount(0);
});

test("route downloads MP3 ZIP bundles with transcripts, manifest, settings, and playlist", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const raw = "Private Export Draft\n\nSOS HELP. CQ CQ.";
  await page.getByLabel("Paste long-form source text").fill(raw);
  await expectWorkflowReadyNearSource(page);
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await chooseSplitMode(page, "By duration");
  await page.getByLabel("Tone preset").selectOption("warm_tone");
  await page.getByLabel("Pitch").fill("590");
  await page.getByLabel("Volume").fill("64");
  await expect(
    sourceStep(page).getByText("Practice Copy").first(),
  ).toBeVisible();
  await expect(page.getByLabel("Tone preset")).toHaveValue("warm_tone");
  await expect(page.getByText("Split summary")).toBeVisible();

  const zip = await downloadZip(page, testInfo);
  expect(zip.filename).toMatch(/morse-audio-bundle\.zip$/);
  await expect(page.getByText("Last download")).toBeVisible();
  await expect(page.getByText(zip.filename)).toBeVisible();
  await expect(page.getByText("Download contents:")).toBeVisible();
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
  expect(manifest.settingsSummary.splitMode).toBe("duration");
  expect(manifest.settingsSummary.splitAudio).toBe(true);
  expect(manifest.settingsSummary.outputFormat).toBe("mp3");
  expect(manifest.settingsSummary.tonePreset).toBe("warm_tone");
  expect(manifest.settingsSummary.pitch).toBe(590);
  expect(manifest.settingsSummary.volume).toBe(0.64);
  expect(manifest.settingsSummary.mp3Bitrate).toBe(48);
  expect(manifest.settingsSummary.sampleRate).toBe(44100);
  expect(manifest.settingsSummary.tailPaddingMs).toBe(180);
  expect(manifest.parts[0].filename).toMatch(/part-001\.mp3$/);
  const settings = zipJson<BundleSettings>(zip.entries, "settings.json");
  expect(settings.generatedAt).toEqual(expect.any(String));
  expect(settings.presetName).toBe("Practice Copy");
  expect(settings.outputFormat).toBe("mp3");
  expect(settings.tonePreset).toBe("warm_tone");
  expect(settings.pitch).toBe(590);
  expect(settings.volume).toBe(0.64);
  expect(settings.mp3Bitrate).toBe(48);
  expect(settings.sampleRate).toBe(44100);
  expect(settings.tailPaddingMs).toBe(180);
  expect(settings.splitAudio).toBe(true);
  expect(settings.splitMode).toBe("duration");
  expect(settings.targetPartMinutes).toBe(5);
  expect(settings.includeCleanedText).toBe(true);
  expect(settings.includeMorseTranscript).toBe(true);
  const playlist = zipText(zip.entries, "playlist.m3u");
  expectPlaylistOrder(playlist, partFiles);
  const readme = zipText(zip.entries, "README.txt");
  expect(readme).toContain("Generated:");
  expect(readme).toContain("Part count:");
  expect(readme).toContain("MP3 is recommended for long downloads");
  expect(readme).toContain("right to convert and use");

  const storageSnapshot = await page.evaluate(() =>
    Object.keys(localStorage)
      .map((key) => `${key}:${localStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(storageSnapshot).not.toContain("Private Export Draft");
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

  await page.getByLabel("Pitch").fill("610");
  await expect(page.getByText("Last download")).toHaveCount(0);
});

test("route downloads uploaded extracted text without persisting raw source", async ({
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
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await chooseSplitMode(page, "By duration");

  const zip = await downloadZip(page, testInfo);
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

test("route downloads direct WAV files and ZIP bundles when extras require it", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page.getByLabel("Paste long-form source text").fill("WAV sample SOS");
  await chooseOutputFormat(page, "wav");
  await page.getByLabel("WAV sample rate").selectOption("48000");
  await page.getByLabel("Tail padding").fill("240");

  const direct = await downloadAudioFile(page, testInfo, /Download WAV/);
  expect(direct.filename).toMatch(/morse-audio\.wav$/);
  expectWavHeader(direct.bytes);
  await expect(page.getByText("Last download")).toBeVisible();
  await expect(page.getByText("WAV audio file")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download sample" }),
  ).toHaveCount(0);

  await page.getByLabel("Include manifest").check();
  await page.getByLabel("Include settings").check();
  const zip = await downloadZip(page, testInfo);
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
  expect(settings.sampleRate).toBe(48000);
  expect(settings.tailPaddingMs).toBe(240);
  expect(manifest.settingsSummary.sampleRate).toBe(48000);
  expect(manifest.settingsSummary.tailPaddingMs).toBe(240);
  expect(manifest.settingsSummary.splitMode).toBe("none");
  expect(manifest.settingsSummary.splitAudio).toBe(false);
  expect(settings.splitMode).toBe("none");
  expect(settings.splitAudio).toBe(false);
});

test("download cancellation can abort stale work before completion", async () => {
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
  await chooseOutputFormat(page, "wav");
  await chooseSplitMode(page, "By duration");

  await page.getByRole("button", { name: /Download ZIP bundle/ }).click();
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Cancel download" }).click();
  await expect(page.getByText("Download cancelled.")).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("Last download")).toHaveCount(0);
  await expect(page.getByText("Download failed.")).toHaveCount(0);
});

test("source changes during active download cancel stale completion", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("SOS HELP ALPHA BRAVO ".repeat(4_000));
  await chooseOutputFormat(page, "wav");
  await chooseSplitMode(page, "By duration");

  await page.getByRole("button", { name: /Download ZIP bundle/ }).click();
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toBeEnabled();
  await page
    .getByLabel("Paste long-form source text")
    .fill("Replacement source wins");
  await expect(
    page.getByText("Source changed; download cancelled."),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.locator("pre").filter({ hasText: "Replacement source wins" }),
  ).toBeVisible();
  await expect(page.getByText("Last download")).toHaveCount(0);
  await expect(page.getByText("ZIP download started")).toHaveCount(0);
});

test("transcript inclusion toggles remove private text artifacts from bundle", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Toggle download SOS HELP.");
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await page.getByLabel("Include cleaned text").uncheck();
  await page.getByLabel("Include Morse transcript").uncheck();

  const zip = await downloadZip(page, testInfo);
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

test("custom cleanup rules update previews, estimates, and downloaded transcripts", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("REMOVE ME\nOld phrase SOS. cat scatter Cat.");
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").fill("REMOVE ME");
  await expect(page.getByText("Rule 1 - 1 match")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "REMOVE ME" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").nth(1).fill("Old phrase");
  await page.getByLabel("Replacement text").nth(1).fill("New phrase");
  await expect(
    page.locator("pre").filter({ hasText: "New phrase SOS" }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").nth(2).fill("cat");
  await page.getByLabel("Replacement text").nth(2).fill("dog");
  await page.getByLabel("Whole word").nth(2).check();
  await expect(page.getByText("Rule 3 - 2 matches")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "dog scatter dog" }).first(),
  ).toBeVisible();

  await page.getByLabel("Case-sensitive").nth(2).check();
  await expect(page.getByText("Rule 3 - 1 match")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "dog scatter Cat" }).first(),
  ).toBeVisible();

  await page.getByLabel("Enabled").nth(2).uncheck();
  await expect(page.getByText("Rule 3 - Disabled")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "cat scatter Cat" }).first(),
  ).toBeVisible();

  await page.getByLabel("Enabled").nth(2).check();
  await page.getByLabel("Case-sensitive").nth(2).uncheck();
  const zip = await downloadZip(page, testInfo);
  expect(zipText(zip.entries, "cleaned-text.txt")).not.toContain("REMOVE ME");
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain("New phrase SOS");
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain("dog scatter dog");
  expect(zipText(zip.entries, "morse-transcript.txt")).toContain(
    "...   ---   ...",
  );

  await page.getByRole("button", { name: "Clear custom rules" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "REMOVE ME" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Last download")).toHaveCount(0);
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
    page.locator("[data-mw-book-export-ready='true']"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Book to Morse Code/ }),
  ).toBeVisible();
  await chooseOutputType(page, "video");
  await expect(outputTypeRadio(page, "video")).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await openDownloadSettings(page);
  await page.getByRole("radio", { name: /Full-frame flash/ }).click();
  await expect(page.getByTestId("book-video-preview")).toBeVisible();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    1,
  );
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(consoleEntries, testInfo.title).toEqual([]);
});
