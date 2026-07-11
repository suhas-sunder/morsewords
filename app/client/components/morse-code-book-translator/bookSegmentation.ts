import { sanitizeDownloadFilename } from "~/client/components/shared/actionOutputUtils";

import type { BookSourceSection } from "./bookSourceTypes";
import {
  estimateBookTextDurationMs,
  getWordGapMs,
  splitParagraphRanges,
  splitSentenceRanges,
  splitWordRanges,
} from "./bookDurationEstimate";
import type { BookExportPart, BookExportSettings } from "./bookExportTypes";

type SegmentInput = {
  cleanedText: string;
  maxPartMs?: number;
  settings: BookExportSettings;
  sourceSections?: BookSourceSection[];
  sourceTitle?: string;
};

type TextUnit = {
  text: string;
  start: number;
  end: number;
  title?: string;
};

const MIN_TRAILING_PART_RATIO = 0.22;
const MAX_FILENAME_BASE_LENGTH = 72;

export function segmentBookText({
  cleanedText,
  maxPartMs,
  settings,
  sourceSections = [],
  sourceTitle,
}: SegmentInput): BookExportPart[] {
  if (!cleanedText.trim()) return [];
  if (settings.splitMode === "none") {
    const text = cleanedText.trim();
    const leadingWhitespace = cleanedText.search(/\S/);
    const sourceStart = Math.max(0, leadingWhitespace);
    return finalizeParts(
      [
        {
          text,
          start: sourceStart,
          end: sourceStart + text.length,
        },
      ],
      settings,
      sourceTitle,
      cleanedText.length,
    );
  }

  const targetMs = settings.targetPartMinutes * 60_000;
  const units =
    settings.preferSourceSections && sourceSections.length > 1
      ? buildSectionUnits(sourceSections, cleanedText)
      : splitParagraphRanges(cleanedText).map((paragraph) => ({
          text: paragraph.text,
          start: paragraph.start,
          end: paragraph.end,
        }));

  const parts = collectPartsFromUnits({
    units: units.length > 0 ? units : [{ text: cleanedText, start: 0, end: cleanedText.length }],
    maxPartMs,
    settings,
    targetMs,
  });

  return finalizeParts(parts, settings, sourceTitle, cleanedText.length);
}

function buildSectionUnits(
  sections: BookSourceSection[],
  fallbackText: string,
): TextUnit[] {
  const units = sections
    .filter((section) => section.rawText.trim())
    .map((section) => ({
      text: section.rawText.trim(),
      start: section.startOffset ?? 0,
      end: section.endOffset ?? section.rawText.length,
      title: section.title || section.sourceLabel,
    }));
  return units.length > 0 ? units : [{ text: fallbackText, start: 0, end: fallbackText.length }];
}

function collectPartsFromUnits({
  maxPartMs,
  units,
  settings,
  targetMs,
}: {
  maxPartMs?: number;
  units: TextUnit[];
  settings: BookExportSettings;
  targetMs: number;
}) {
  const rawParts: TextUnit[] = [];
  let current: TextUnit | null = null;
  let currentMs = 0;
  const combinedUnitGapMs = getWordGapMs(settings) * settings.paragraphPauseMultiplier;
  const splitLimitMs =
    Number.isFinite(maxPartMs) && (maxPartMs ?? 0) > 0
      ? Math.max(1, maxPartMs ?? 1)
      : targetMs * 1.15;

  for (const unit of units) {
    const unitMs = estimateBookTextDurationMs(unit.text, settings);

    if (unitMs > splitLimitMs) {
      if (current) {
        rawParts.push(current);
        current = null;
        currentMs = 0;
      }
      rawParts.push(...splitOversizedUnit(unit, settings, targetMs, splitLimitMs));
      continue;
    }

    if (!current) {
      current = { ...unit };
      currentMs = unitMs;
      continue;
    }

    const combinedMs = currentMs + combinedUnitGapMs + unitMs;
    if (
      (current.title && unit.title && current.title !== unit.title) ||
      combinedMs > splitLimitMs ||
      (combinedMs > targetMs && currentMs > targetMs * 0.55)
    ) {
      rawParts.push(current);
      current = { ...unit };
      currentMs = unitMs;
    } else {
      current = {
        text: `${current.text}\n\n${unit.text}`,
        start: current.start,
        end: unit.end,
        title: current.title,
      };
      currentMs = combinedMs;
    }
  }

  if (current) rawParts.push(current);
  return mergeTinyTrailingPart(rawParts, settings, targetMs, splitLimitMs);
}

function splitOversizedUnit(
  unit: TextUnit,
  settings: BookExportSettings,
  targetMs: number,
  maxPartMs: number,
): TextUnit[] {
  const paragraphParts = splitByBoundary(
    splitParagraphRanges(unit.text),
    unit,
    maxPartMs,
    settings,
    targetMs,
  );
  if (paragraphParts.length > 1) return paragraphParts;

  const sentenceParts = splitByBoundary(
    splitSentenceRanges(unit.text),
    unit,
    maxPartMs,
    settings,
    targetMs,
  );
  if (sentenceParts.length > 1) return sentenceParts;

  const wordParts = splitByBoundary(
    splitWordRanges(unit.text),
    unit,
    maxPartMs,
    settings,
    targetMs,
  );
  if (wordParts.length > 1) return wordParts;

  return hardSplitUnit(unit, settings, Math.min(targetMs, maxPartMs * 0.86));
}

function splitByBoundary(
  ranges: Array<{ text: string; start: number; end: number }>,
  parent: TextUnit,
  maxPartMs: number,
  settings: BookExportSettings,
  targetMs: number,
): TextUnit[] {
  if (ranges.length <= 1) return [parent];
  const units = ranges.map((range) => ({
    text: range.text,
    start: parent.start + range.start,
    end: parent.start + range.end,
    title: parent.title,
  }));
  return collectPartsFromUnits({ units, maxPartMs, settings, targetMs });
}

function hardSplitUnit(
  unit: TextUnit,
  settings: BookExportSettings,
  targetMs: number,
): TextUnit[] {
  const durationLimitMs = Math.max(1, targetMs);
  const parts: TextUnit[] = [];
  let cursor = 0;

  while (cursor < unit.text.length) {
    let low = nextCodePointEnd(unit.text, cursor);
    let high = unit.text.length;
    let bestEnd = low;

    while (low <= high) {
      const midpoint = Math.floor((low + high) / 2);
      const candidateEnd = avoidSurrogateSplit(unit.text, cursor, midpoint);
      if (candidateEnd <= cursor) {
        low = midpoint + 1;
        continue;
      }
      const candidate = unit.text.slice(cursor, candidateEnd).trim();
      const candidateMs = candidate
        ? estimateBookTextDurationMs(candidate, settings)
        : 0;
      if (candidateMs <= durationLimitMs) {
        bestEnd = candidateEnd;
        low = midpoint + 1;
      } else {
        high = midpoint - 1;
      }
    }

    const rawText = unit.text.slice(cursor, bestEnd);
    const text = rawText.trim();
    if (text) {
      const trimStart = rawText.search(/\S/);
      const trailingWhitespace = rawText.length - rawText.trimEnd().length;
      parts.push({
        text,
        start: unit.start + cursor + Math.max(0, trimStart),
        end: unit.start + bestEnd - trailingWhitespace,
        title: unit.title,
      });
    }
    cursor = bestEnd;
  }

  return parts.length > 0 ? parts : [unit];
}

function nextCodePointEnd(text: string, start: number) {
  const codePoint = text.codePointAt(start);
  return Math.min(text.length, start + (codePoint !== undefined && codePoint > 0xffff ? 2 : 1));
}

function avoidSurrogateSplit(text: string, start: number, proposedEnd: number) {
  let end = Math.max(start + 1, Math.min(text.length, proposedEnd));
  if (
    end < text.length &&
    /[\uD800-\uDBFF]/.test(text[end - 1]) &&
    /[\uDC00-\uDFFF]/.test(text[end])
  ) {
    end -= 1;
  }
  return end > start ? end : nextCodePointEnd(text, start);
}

function mergeTinyTrailingPart(
  parts: TextUnit[],
  settings: BookExportSettings,
  targetMs: number,
  maxPartMs: number,
) {
  if (parts.length < 2) return parts;
  const last = parts[parts.length - 1];
  const previous = parts[parts.length - 2];
  if (last.title && previous.title && last.title !== previous.title) return parts;
  const lastMs = estimateBookTextDurationMs(last.text, settings);
  if (lastMs >= targetMs * MIN_TRAILING_PART_RATIO) return parts;

  const combined = {
    text: `${previous.text}\n\n${last.text}`,
    start: previous.start,
    end: last.end,
    title: previous.title,
  };
  if (estimateBookTextDurationMs(combined.text, settings) > maxPartMs) {
    return parts;
  }
  return [...parts.slice(0, -2), combined];
}

function finalizeParts(
  rawParts: TextUnit[],
  settings: BookExportSettings,
  sourceTitle?: string,
  sourceLength?: number,
): BookExportPart[] {
  const parts = rawParts.filter((part) => part.text.trim());
  const normalizedParts = normalizeSourceCoverage(
    parts,
    Math.max(0, sourceLength ?? parts.at(-1)?.end ?? 0),
  );
  return normalizedParts
    .map((part, index) => {
      const partIndex = index + 1;
      const title = part.title
        ? `Part ${partIndex}: ${part.title}`
        : `Part ${partIndex}`;
      return {
        index: partIndex,
        title,
        sourceStart: part.start,
        sourceEnd: part.end,
        cleanedText: part.text,
        cleanedExcerpt: excerpt(part.text, 180),
        morseDurationMs: estimateBookTextDurationMs(part.text, settings),
        estimatedFilename: buildPartFilename({
          sourceTitle,
          partIndex,
          format: settings.outputFormat,
          sectionTitle: part.title,
        }),
      };
    });
}

function normalizeSourceCoverage(parts: TextUnit[], sourceLength: number) {
  let sourceStart = 0;
  return parts.map((part, index) => {
    const next = parts[index + 1];
    const naturalEnd =
      index === parts.length - 1
        ? sourceLength
        : Math.max(part.end, next?.start ?? part.end);
    const sourceEnd = Math.max(
      sourceStart,
      Math.min(sourceLength, naturalEnd),
    );
    const normalized = {
      ...part,
      start: sourceStart,
      end: sourceEnd,
    };
    sourceStart = sourceEnd;
    return normalized;
  });
}

export function buildPartFilename({
  sourceTitle,
  partIndex,
  format,
  sectionTitle,
}: {
  sourceTitle?: string;
  partIndex: number;
  format: "mp3" | "wav";
  sectionTitle?: string;
}) {
  const base = sanitizeDownloadFilename(
    sourceTitle || "morse-book",
    "morse-book",
  )
    .replace(/\.(mp3|wav|zip|txt|json|m3u)$/i, "")
    .slice(0, MAX_FILENAME_BASE_LENGTH);
  const sectionSlug = sectionTitle
    ? sanitizeDownloadFilename(sectionTitle, "")
        .replace(/^part-?\d+[-:]?/i, "")
        .slice(0, 36)
    : "";
  return `${base || "morse-book"}-part-${String(partIndex).padStart(3, "0")}${
    sectionSlug ? `-${sectionSlug}` : ""
  }.${format}`;
}

export function buildSingleAudioFilename({
  sourceTitle,
  format,
}: {
  sourceTitle?: string;
  format: "mp3" | "wav";
}) {
  const base = sanitizeDownloadFilename(sourceTitle || "morse-book", "morse-book")
    .replace(/\.(mp3|wav|zip|txt|json|m3u)$/i, "")
    .slice(0, MAX_FILENAME_BASE_LENGTH);
  return `${base || "morse-book"}-morse-audio.${format}`;
}

export function buildBundleFilename(sourceTitle?: string, batchNumber?: number) {
  const base = sanitizeDownloadFilename(sourceTitle || "morse-book", "morse-book")
    .replace(/\.zip$/i, "")
    .slice(0, MAX_FILENAME_BASE_LENGTH);
  const batchSuffix =
    typeof batchNumber === "number"
      ? `-batch-${String(batchNumber).padStart(2, "0")}`
      : "";
  return `${base || "morse-book"}-morse-audio${batchSuffix}-bundle.zip`;
}

function excerpt(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
}
