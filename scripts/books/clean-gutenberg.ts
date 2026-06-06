import type { GutenbergCleaningReport } from "./bookManifestTypes.ts";
import { normalizeBookText, trimBookText } from "./bookTextNormalization.ts";

type MarkerMatch = {
  start: number;
  end: number;
};

export type CleanGutenbergResult = {
  cleanedText: string;
  report: GutenbergCleaningReport;
};

const START_MARKERS = [
  /^\s*\*{3}\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*\*{3}\s*$/gim,
  /^\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*$/gim,
];

const END_MARKERS = [
  /^\s*\*{3}\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*\*{3}\s*$/gim,
  /^\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK\b.*$/gim,
  /^\s*End of (?:the|this) Project Gutenberg EBook\b.*$/gim,
];

function findFirstMarker(text: string, patterns: RegExp[]): MarkerMatch | null {
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      return {
        start: match.index,
        end: match.index + match[0].length,
      };
    }
  }

  return null;
}

function findLastMarker(text: string, patterns: RegExp[]): MarkerMatch | null {
  let best: MarkerMatch | null = null;

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      const candidate = {
        start: match.index,
        end: match.index + match[0].length,
      };
      if (!best || candidate.start > best.start) {
        best = candidate;
      }
    }
  }

  return best;
}

export function cleanGutenbergText(rawText: string): CleanGutenbergResult {
  const normalized = normalizeBookText(rawText);
  const originalCharacterCount = normalized.length;
  const warnings: string[] = [];
  const startMarker = findFirstMarker(normalized, START_MARKERS);
  const endMarker = findLastMarker(normalized, END_MARKERS);

  let bodyStartOffset = 0;
  let bodyEndOffset = normalized.length;
  let headerStripped = false;
  let footerStripped = false;

  if (startMarker) {
    bodyStartOffset = startMarker.end;
    headerStripped = true;
  } else {
    warnings.push(
      "Missing Project Gutenberg start marker; body text was not destructively stripped.",
    );
  }

  if (endMarker && endMarker.start > bodyStartOffset) {
    bodyEndOffset = endMarker.start;
    footerStripped = true;
  } else {
    warnings.push(
      "Missing Project Gutenberg end marker; footer text was not destructively stripped.",
    );
  }

  if (bodyStartOffset >= bodyEndOffset) {
    bodyStartOffset = 0;
    bodyEndOffset = normalized.length;
    headerStripped = false;
    footerStripped = false;
    warnings.push(
      "Project Gutenberg markers were out of order; using the full normalized text.",
    );
  }

  const sliced = normalized.slice(bodyStartOffset, bodyEndOffset);
  const cleanedText = trimBookText(sliced);
  const confidence =
    headerStripped && footerStripped
      ? "high"
      : headerStripped || footerStripped
        ? "medium"
        : "low";

  return {
    cleanedText,
    report: {
      originalCharacterCount,
      cleanedCharacterCount: cleanedText.length,
      headerStripped,
      footerStripped,
      confidence,
      warnings,
      bodyStartOffset,
      bodyEndOffset,
    },
  };
}
