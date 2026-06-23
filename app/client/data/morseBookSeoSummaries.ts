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

export const MORSE_BOOK_SEO_SUMMARY_STORAGE_APPROACH =
  "Server-side JSON lookup; route loaders pass only the current summary or compact descriptions into client components.";

export function getMorseBookSeoSummaryParagraphs(
  summary: Pick<MorseBookSeoSummary, "summary"> | null | undefined,
) {
  if (!summary) return [];
  return summary.summary
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
