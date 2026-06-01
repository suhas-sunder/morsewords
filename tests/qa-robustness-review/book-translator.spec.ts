import { expect, test } from "@playwright/test";
import type { Page, TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { strToU8, zipSync } from "fflate";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
} from "./helpers";

const CANONICAL_PATH = ROUTES.bookTranslator;
const ALIAS_PATH = ROUTES.ebookTranslatorAlias;
const RAW_SECRET_TEXT = "Private Draft Source";

async function openBookTranslator(page: Page) {
  await blockExternalNetwork(page);
  await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
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
    return Buffer.from(zipSync({ "OPS/chapter.xhtml": strToU8("<p>Missing container</p>") }));
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
    files["META-INF/encryption.xml"] = strToU8("<encryption><EncryptedData/></encryption>");
  }
  return Buffer.from(zipSync(files));
}

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
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

test("book translator route metadata, alias, and sitemap use canonical URL", async ({
  page,
  request,
}) => {
  await openBookTranslator(page);

  await expect(page).toHaveTitle(/Book to Morse Code Translator and Audio Exporter/);
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
    .evaluateAll((scripts) => scripts.map((script) => script.textContent ?? "").join("\n"));
  expect(jsonLd).toContain(absoluteUrl(CANONICAL_PATH));
  expect(jsonLd).toContain("WebApplication");

  const aliasResponse = await request.get(ALIAS_PATH, { maxRedirects: 0 });
  expect(aliasResponse.status()).toBe(301);
  expect(aliasResponse.headers().location).toBe(CANONICAL_PATH);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(absoluteUrl(CANONICAL_PATH));
  expect(sitemap).not.toContain(absoluteUrl(ALIAS_PATH));
});

test("pasted text preflight reports unsupported characters and avoids localStorage", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill(`${RAW_SECRET_TEXT}\nHello 世界 -- SOS`);

  await expect(page.getByText("Top unsupported characters")).toBeVisible();
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
});

test("TXT and MD uploads populate source preflight", async ({ page }, testInfo) => {
  await openBookTranslator(page);
  const txtPath = writeFixture(testInfo, "book-source.txt", "Plain text chapter\nSOS help");
  const mdPath = writeFixture(testInfo, "book-source.md", "# Markdown Chapter\n\nCQ CQ");

  await page.setInputFiles("#book-source-file", txtPath);
  await expect(page.getByText("Current file: book-source.txt")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "Plain text chapter" }).first(),
  ).toBeVisible();

  await page.setInputFiles("#book-source-file", mdPath);
  await expect(page.getByText("Current file: book-source.md")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "Markdown Chapter" }).first(),
  ).toBeVisible();
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
  await expect(page.getByText("Signal Book")).toBeVisible();
  await expect(page.getByText("Ada Morse")).toBeVisible();
  await expect(page.getByText("EPUB sections")).toBeVisible();

  const preview = page.locator("pre").filter({ hasText: "First Signal" }).first();
  await expect(preview).toBeVisible();
  const previewText = await page.getByLabel("Book source preflight tool").textContent();
  expect(previewText?.indexOf("First Signal")).toBeLessThan(
    previewText?.indexOf("Second Signal") ?? Number.POSITIVE_INFINITY,
  );
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
  const brokenPath = writeFixture(testInfo, "broken.epub", makeEpub({ broken: true }));

  await page.setInputFiles("#book-source-file", encryptedPath);
  await expect(
    page.locator("li").filter({ hasText: "DRM-protected" }).first(),
  ).toBeVisible();

  await page.setInputFiles("#book-source-file", brokenPath);
  await expect(page.getByText("missing META-INF/container.xml")).toBeVisible();
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

  await page.setInputFiles("#book-source-file", pdfPath);
  await expect(page.getByText("PDF pages")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "PDF Morse source text" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Tiny PDF")).toBeVisible();

  await page.setInputFiles("#book-source-file", blankPdfPath);
  await expect(page.getByText("scanned or image-only", { exact: false })).toBeVisible();
});

test("cleanup toggles update preview and report Gutenberg stripping", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page.getByLabel("Paste long-form source text").fill(`Header
*** START OF THE PROJECT GUTENBERG EBOOK TEST ***
This is \u201cpractice\u201d text \u2014 with an emoji \u2603.
*** END OF THE PROJECT GUTENBERG EBOOK TEST ***
Footer`);

  const cleanedPreview = page.locator("pre").filter({ hasText: "Header" }).first();
  await expect(cleanedPreview).toBeVisible();
  await page.getByLabel("Strip Project Gutenberg header/footer").check();
  await expect(
    page.locator("li").filter({ hasText: "Project Gutenberg header/footer" }).first(),
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
  await expect(page.getByText("Characters", { exact: true })).toBeVisible();
  await expect(page.getByText("63,999")).toBeVisible();

  const epubPath = writeFixture(testInfo, "slowish.epub", makeEpub({}));
  const txtPath = writeFixture(testInfo, "replacement.txt", "Replacement source wins");
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
  await expect(page.getByRole("heading", { name: /Book to Morse Code/ })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(consoleEntries, testInfo.title).toEqual([]);
});
