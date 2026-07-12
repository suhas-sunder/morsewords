import type { MorseBookSeoSummary } from "./morseBookSeoSummaries";
import type { MorseBookLibrarySummary } from "./morseBookTypes";

export const MORSE_BOOK_CARD_DESCRIPTION_MAX_CHARS = 220;

type CardDescriptionBook = Pick<
  MorseBookLibrarySummary,
  "author" | "description" | "slug" | "stats" | "title"
>;

const SENTENCE_END = new Set([".", "!", "?"]);
const ABBREVIATIONS = new Set([
  "dr",
  "mr",
  "mrs",
  "ms",
  "no",
  "prof",
  "sr",
  "jr",
  "st",
]);

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function usableDescription(value: string | null | undefined) {
  const trimmed = normalizeWhitespace(value ?? "");
  if (!trimmed) return "";
  if (trimmed.toLowerCase().includes("development-only")) return "";
  return trimmed;
}

function previousToken(value: string, endIndex: number) {
  const before = value.slice(0, endIndex).trimEnd();
  return before.match(/([A-Za-z]+|[A-Z](?:\.[A-Z])+)\.?$/)?.[1] ?? "";
}

function isSentenceBoundary(value: string, index: number) {
  const char = value[index];
  if (!SENTENCE_END.has(char)) return false;

  if (char === ".") {
    const token = previousToken(value, index).toLowerCase();
    if (ABBREVIATIONS.has(token)) return false;
    if (/^[a-z]$/i.test(token)) return false;
  }

  const rest = value.slice(index + 1);
  const next = rest.match(/\S/)?.[0];
  return !next || /["'(\[{A-Z0-9]/.test(next);
}

function completeSentences(value: string) {
  const normalized = normalizeWhitespace(value);
  const sentences: string[] = [];
  let start = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    if (!isSentenceBoundary(normalized, index)) continue;
    const sentence = normalized.slice(start, index + 1).trim();
    if (sentence) sentences.push(sentence);
    start = index + 1;
  }
  const tail = normalized.slice(start).trim();
  if (tail) sentences.push(tail);
  return sentences;
}

function trimAtWordBoundary(value: string, maxChars: number) {
  const normalized = normalizeWhitespace(value);
  if (normalized.length <= maxChars) return normalized;
  const clipped = normalized.slice(0, maxChars + 1);
  const boundary = clipped.search(/\s+\S*$/);
  const trimmed =
    boundary > 0 ? clipped.slice(0, boundary).trimEnd() : normalized.slice(0, maxChars).trimEnd();
  return trimmed.replace(/[,:;-]\s*$/, "").trim();
}

export function extractMorseBookSeoCardDescription(
  seoSummary: Pick<MorseBookSeoSummary, "description" | "summary"> | null | undefined,
  maxChars = MORSE_BOOK_CARD_DESCRIPTION_MAX_CHARS,
) {
  const reviewedDescription = usableDescription(seoSummary?.description);
  if (reviewedDescription) {
    return trimAtWordBoundary(reviewedDescription, maxChars);
  }

  const summary = usableDescription(seoSummary?.summary);
  if (!summary) return "";

  const openingParagraph = summary.split(/\n{2,}/)[0] ?? summary;
  const candidates = completeSentences(openingParagraph);
  const chosen =
    candidates.find((sentence) => sentence.length <= maxChars) ?? candidates[0] ?? openingParagraph;
  return trimAtWordBoundary(chosen, maxChars);
}

export function getMorseBookCardDescription({
  book,
  maxChars = MORSE_BOOK_CARD_DESCRIPTION_MAX_CHARS,
  seoSummary,
}: {
  book: CardDescriptionBook;
  maxChars?: number;
  seoSummary?: Pick<MorseBookSeoSummary, "description" | "summary"> | null;
}) {
  const reviewedLibraryDescription = usableDescription(book.description);
  if (reviewedLibraryDescription) {
    return trimAtWordBoundary(reviewedLibraryDescription, maxChars);
  }

  const seoCardDescription = extractMorseBookSeoCardDescription(seoSummary, maxChars);
  if (seoCardDescription) return seoCardDescription;

  return "";
}
