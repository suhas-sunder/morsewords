import { readFileSync } from "node:fs";
import path from "node:path";

import type {
  MorseBookSeoSummary,
  MorseBookSeoSummaryData,
} from "./morseBookSeoSummaries";

const SUMMARY_DATA_PATH = path.join(
  "app",
  "client",
  "assets",
  "books",
  "seo-summaries",
  "book-seo-summaries.json",
);

let bookSeoSummaries: MorseBookSeoSummaryData | null = null;
let bookSeoSummaryBySlug: Map<string, MorseBookSeoSummary> | null = null;

export const MORSE_BOOK_SEO_SUMMARY_STORAGE_APPROACH =
  "Server-side JSON lookup; route loaders pass only the current summary or compact descriptions into client components.";

function loadMorseBookSeoSummaryData() {
  if (!bookSeoSummaries) {
    const jsonPath = path.resolve(process.cwd(), SUMMARY_DATA_PATH);
    bookSeoSummaries = JSON.parse(
      readFileSync(jsonPath, "utf8"),
    ) as MorseBookSeoSummaryData;
  }
  return bookSeoSummaries;
}

function loadMorseBookSeoSummaryBySlug() {
  if (!bookSeoSummaryBySlug) {
    bookSeoSummaryBySlug = new Map(
      loadMorseBookSeoSummaryData().summaries.map((summary) => [
        summary.slug,
        summary,
      ]),
    );
  }
  return bookSeoSummaryBySlug;
}

export function getMorseBookSeoSummary(slug: string) {
  return loadMorseBookSeoSummaryBySlug().get(slug) ?? null;
}

export function getMorseBookSeoSummaryData() {
  return loadMorseBookSeoSummaryData();
}

export function getMorseBookSeoDescriptionsBySlug(slugs: readonly string[]) {
  const descriptions: Record<string, string> = {};
  const summariesBySlug = loadMorseBookSeoSummaryBySlug();
  slugs.forEach((slug) => {
    const summary = summariesBySlug.get(slug);
    if (summary?.description) descriptions[slug] = summary.description;
  });
  return descriptions;
}

export type { MorseBookSeoSummary };
