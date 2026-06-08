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
  /^\s*End of Project Gutenberg's\b.*$/gim,
];

const TRAILING_EDITORIAL_NOTE_MARKERS = [
  /^\s*Transcriber's notes?:\s*$/gim,
  /^\s*Transcriber(?:'s)? Notes?\s*$/gim,
  /^\s*Notes? by the Transcriber\s*$/gim,
  /^\s*Transcription notes?:\s*$/gim,
];

const LEADING_PRODUCTION_CREDIT_LINES = [
  /^\s*Produced by\b.*$/i,
  /^\s*E-?text prepared by\b.*$/i,
  /^\s*Transcribed from\b.*$/i,
  /^\s*This eBook was produced by\b.*$/i,
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

function findFirstMarkerAfter(
  text: string,
  patterns: RegExp[],
  offset: number,
): MarkerMatch | null {
  let best: MarkerMatch | null = null;

  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      if (match.index <= offset) continue;
      const candidate = {
        start: match.index,
        end: match.index + match[0].length,
      };
      if (!best || candidate.start < best.start) {
        best = candidate;
      }
    }
  }

  return best;
}

function stripLeadingProductionCredits(text: string) {
  const lines = text.split("\n");
  let firstContentLine = 0;
  while (
    firstContentLine < lines.length &&
    lines[firstContentLine].trim().length === 0
  ) {
    firstContentLine += 1;
  }

  let cursor = firstContentLine;
  let strippedAny = false;
  while (cursor < Math.min(lines.length, firstContentLine + 12)) {
    const line = lines[cursor];
    if (line.trim().length === 0) {
      cursor += 1;
      continue;
    }
    if (LEADING_PRODUCTION_CREDIT_LINES.some((pattern) => pattern.test(line))) {
      lines[cursor] = "";
      strippedAny = true;
      cursor += 1;
      continue;
    }
    break;
  }

  return strippedAny ? lines.join("\n") : text;
}

export function cleanGutenbergText(rawText: string): CleanGutenbergResult {
  const normalized = normalizeBookText(rawText);
  const originalCharacterCount = normalized.length;
  const warnings: string[] = [];
  const startMarker = findFirstMarker(normalized, START_MARKERS);

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

  const endMarker = findFirstMarkerAfter(
    normalized,
    END_MARKERS,
    bodyStartOffset,
  );

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

  let sliced = stripLeadingProductionCredits(
    normalized.slice(bodyStartOffset, bodyEndOffset),
  );
  const trailingEditorialNote = findLastMarker(
    sliced,
    TRAILING_EDITORIAL_NOTE_MARKERS,
  );
  if (trailingEditorialNote) {
    const trailingText = sliced.slice(trailingEditorialNote.start);
    const leadingText = sliced.slice(0, trailingEditorialNote.start);
    const noteWordCount = trailingText.trim().split(/\s+/).filter(Boolean).length;
    const leadingWordCount = leadingText.trim().split(/\s+/).filter(Boolean).length;

    if (
      leadingWordCount > 0 &&
      noteWordCount > 0 &&
      noteWordCount < leadingWordCount
    ) {
      sliced = leadingText;
      bodyEndOffset = bodyStartOffset + trailingEditorialNote.start;
    }
  }

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
