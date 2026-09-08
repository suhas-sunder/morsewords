import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedLibraryBookSummary,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const libraryManifestPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
  "library-manifest.json",
);
const sitemapPath = path.join(repoRoot, "public", "sitemap.xml");
const siteUrl = "https://www.morsewords.com";
const bookDetailPattern = /^https:\/\/www\.morsewords\.com\/morse-code-books\/[^/]+$/;
const audiobookDetailPattern =
  /^https:\/\/www\.morsewords\.com\/morse-code-audiobooks\/[^/]+$/;
const bookPrintPattern =
  /^https:\/\/www\.morsewords\.com\/morse-code-books\/[^/]+\/print$/;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function isAcceptedGeneratedBook(book: GeneratedLibraryBookSummary) {
  const approvedBySource =
    book.source.approvalSource === "file-evidence" ||
    book.source.approvalSource === "external-authority" ||
    (book.source.approvalSource === "owner-reviewed" &&
      book.source.rightsReviewed === true) ||
    (book.source.approvalSource === undefined &&
      book.source.rightsReviewed === true);
  return (
    approvedBySource &&
    book.source.publishReady === true &&
    book.source.rightsStatus === "approved" &&
    book.source.processingAllowed === true
  );
}

function sitemapUrlLine(url: string) {
  return `  <url><loc>${url}</loc></url>`;
}

function sitemapLocation(line: string) {
  return line.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? null;
}

function isGeneratedBookDetailLine(line: string) {
  const location = sitemapLocation(line);
  return Boolean(
    location &&
      (bookDetailPattern.test(location) ||
        audiobookDetailPattern.test(location) ||
        bookPrintPattern.test(location)),
  );
}

function main() {
  const libraryManifest = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const books = libraryManifest.books
    .filter(isAcceptedGeneratedBook)
    .sort((left, right) => left.slug.localeCompare(right.slug));
  const slugs = books.map((book) => book.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Generated library contains duplicate accepted book slugs.");
  }
  if (slugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
    throw new Error("Generated library contains a non-canonical book slug.");
  }

  const existingLines = fs.readFileSync(sitemapPath, "utf8").split(/\r?\n/);
  const closingIndex = existingLines.findIndex((line) => line.trim() === "</urlset>");
  if (closingIndex < 0) throw new Error("Sitemap is missing the closing urlset tag.");

  const preservedLines = existingLines
    .slice(0, closingIndex)
    .filter((line) => !isGeneratedBookDetailLine(line));
  const bookLines = slugs.map((slug) =>
    sitemapUrlLine(`${siteUrl}/morse-code-books/${slug}`),
  );
  const audiobookLines = slugs.map((slug) =>
    sitemapUrlLine(`${siteUrl}/morse-code-audiobooks/${slug}`),
  );
  const printLines = slugs.map((slug) =>
    sitemapUrlLine(`${siteUrl}/morse-code-books/${slug}/print`),
  );
  const output = [
    ...preservedLines,
    ...bookLines,
    ...audiobookLines,
    ...printLines,
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(sitemapPath, output);
  console.log(`Book sitemap sync complete: ${books.length} accepted books.`);
  console.log(`Book detail URLs: ${bookLines.length}`);
  console.log(`Audiobook detail URLs: ${audiobookLines.length}`);
  console.log(`Printable book URLs: ${printLines.length}`);
}

main();
