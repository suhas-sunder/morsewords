import bookSeoSummariesJson from "~/client/assets/books/seo-summaries/book-seo-summaries.json";

export type MorseBookSeoSummary = {
  slug: string;
  title: string;
  author: string[];
  description: string;
  summary: string;
  shortWorkException?: string;
};

export type MorseBookSeoSummarySubstitution = {
  suggestedSlug: string;
  actualSlug: string;
  reason: string;
};

export type MorseBookSeoSummaryData = {
  schemaVersion: 1;
  summarySet: string;
  generatedAt: string;
  storageApproach: string;
  suggestedPilotSlugs: string[];
  pilotSlugs: string[];
  substitutions: MorseBookSeoSummarySubstitution[];
  summaries: MorseBookSeoSummary[];
};

const bookSeoSummaries = bookSeoSummariesJson as MorseBookSeoSummaryData;
const bookSeoSummaryBySlug = new Map(
  bookSeoSummaries.summaries.map((summary) => [summary.slug, summary]),
);

export const MORSE_BOOK_SEO_SUMMARY_STORAGE_APPROACH =
  bookSeoSummaries.storageApproach;

export function getMorseBookSeoSummary(slug: string) {
  return bookSeoSummaryBySlug.get(slug) ?? null;
}

export function getMorseBookSeoSummaryData() {
  return bookSeoSummaries;
}

export function getMorseBookSeoSummaryParagraphs(slug: string) {
  const summary = getMorseBookSeoSummary(slug);
  if (!summary) return [];
  return summary.summary
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
