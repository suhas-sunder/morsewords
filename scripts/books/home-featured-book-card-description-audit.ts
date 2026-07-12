import { readFileSync } from "node:fs";
import path from "node:path";

import { getMorseBookCardDescription } from "../../app/client/data/morseBookCardDescriptions";
import type { MorseBookSeoSummaryData } from "../../app/client/data/morseBookSeoSummaries";
import type {
  MorseBookLibraryManifest,
  MorseBookLibrarySummary,
} from "../../app/client/data/morseBookTypes";

const repoRoot = process.cwd();
const oldFallback =
  "A Morse-friendly classic with readable sections, live playback, and audio options for short practice sessions.";
const featuredBookCount = 8;

function readJson<T>(relativePath: string) {
  return JSON.parse(
    readFileSync(path.join(repoRoot, relativePath), "utf8"),
  ) as T;
}

function isPublishReady(book: MorseBookLibrarySummary) {
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

const libraryManifest = readJson<MorseBookLibraryManifest>(
  "app/client/assets/books/generated/library-manifest.json",
);
const seoSummaries = readJson<MorseBookSeoSummaryData>(
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const seoBySlug = new Map(
  seoSummaries.summaries.map((summary) => [summary.slug, summary]),
);
const featuredBooks = libraryManifest.books
  .filter(isPublishReady)
  .sort((left, right) => left.title.localeCompare(right.title))
  .slice(0, featuredBookCount);

const cardDescriptions = featuredBooks.map((book) => ({
  book,
  description: getMorseBookCardDescription({
    book,
    seoSummary: seoBySlug.get(book.slug) ?? null,
  }),
  seoSummary: seoBySlug.get(book.slug) ?? null,
}));

const blockers: string[] = [];
if (featuredBooks.length !== featuredBookCount) {
  blockers.push(`featured book count is ${featuredBooks.length}, expected ${featuredBookCount}`);
}

for (const entry of cardDescriptions) {
  if (entry.description === oldFallback) {
    blockers.push(`${entry.book.slug} uses old featured-book fallback`);
  }
  if (!entry.book.description.trim() && entry.seoSummary && !entry.description) {
    blockers.push(`${entry.book.slug} has reviewed SEO content but no card description`);
  }
}

const duplicateDescriptions = new Map<string, string[]>();
for (const entry of cardDescriptions) {
  if (!entry.description) continue;
  duplicateDescriptions.set(entry.description, [
    ...(duplicateDescriptions.get(entry.description) ?? []),
    entry.book.slug,
  ]);
}
for (const [description, slugs] of duplicateDescriptions) {
  if (slugs.length > 1) {
    blockers.push(
      `duplicate featured-card description for ${slugs.join(", ")}: ${description}`,
    );
  }
}

for (const relativePath of [
  "app/routes/home.tsx",
  "app/client/data/morseBookCardDescriptions.ts",
]) {
  const source = readFileSync(path.join(repoRoot, relativePath), "utf8");
  if (source.includes(oldFallback)) {
    blockers.push(`${relativePath} still contains the old generic fallback`);
  }
}

console.log("Homepage featured-book card description audit");
console.log(`Featured cards inspected: ${cardDescriptions.length}`);
console.log(
  `Derived from SEO content: ${
    cardDescriptions.filter(
      (entry) => !entry.book.description.trim() && Boolean(entry.description),
    ).length
  }`,
);
console.log(`Old fallback uses: ${cardDescriptions.filter((entry) => entry.description === oldFallback).length}`);
console.log(`Duplicate description groups: ${[...duplicateDescriptions.values()].filter((slugs) => slugs.length > 1).length}`);

if (blockers.length > 0) {
  console.error(blockers.map((blocker) => `- ${blocker}`).join("\n"));
  process.exit(1);
}

console.log("Result: pass");
