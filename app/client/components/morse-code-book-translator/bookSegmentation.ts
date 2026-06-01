import { sanitizeDownloadFilename } from "~/client/components/shared/actionOutputUtils";

import type { BookSourceSection } from "./bookSourceTypes";
import {
  estimateBookTextDurationMs,
  splitParagraphRanges,
  splitSentenceRanges,
  splitWordRanges,
} from "./bookDurationEstimate";
import type { BookExportPart, BookExportSettings } from "./bookExportTypes";

type SegmentInput = {
  cleanedText: string;
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
  settings,
  sourceSections = [],
  sourceTitle,
}: SegmentInput): BookExportPart[] {
  if (!cleanedText.trim()) return [];
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
    settings,
    targetMs,
  });

  return finalizeParts(parts, settings, sourceTitle);
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
  units,
  settings,
  targetMs,
}: {
  units: TextUnit[];
  settings: BookExportSettings;
  targetMs: number;
}) {
  const rawParts: TextUnit[] = [];
  let current: TextUnit | null = null;
  let currentMs = 0;

  for (const unit of units) {
    const unitMs = estimateBookTextDurationMs(unit.text, settings);

    if (unitMs > targetMs * 1.15) {
      if (current) {
        rawParts.push(current);
        current = null;
        currentMs = 0;
      }
      rawParts.push(...splitOversizedUnit(unit, settings, targetMs));
      continue;
    }

    if (!current) {
      current = { ...unit };
      currentMs = unitMs;
      continue;
    }

    const combinedText: string = `${current.text}\n\n${unit.text}`;
    const combinedMs = estimateBookTextDurationMs(combinedText, settings);
    if (combinedMs > targetMs && currentMs > targetMs * 0.55) {
      rawParts.push(current);
      current = { ...unit };
      currentMs = unitMs;
    } else {
      current = {
        text: combinedText,
        start: current.start,
        end: unit.end,
        title: current.title,
      };
      currentMs = combinedMs;
    }
  }

  if (current) rawParts.push(current);
  return mergeTinyTrailingPart(rawParts, settings, targetMs);
}

function splitOversizedUnit(
  unit: TextUnit,
  settings: BookExportSettings,
  targetMs: number,
): TextUnit[] {
  const paragraphParts = splitByBoundary(
    splitParagraphRanges(unit.text),
    unit,
    settings,
    targetMs,
  );
  if (paragraphParts.length > 1) return paragraphParts;

  const sentenceParts = splitByBoundary(
    splitSentenceRanges(unit.text),
    unit,
    settings,
    targetMs,
  );
  if (sentenceParts.length > 1) return sentenceParts;

  const wordParts = splitByBoundary(splitWordRanges(unit.text), unit, settings, targetMs);
  if (wordParts.length > 1) return wordParts;

  return hardSplitUnit(unit, settings, targetMs);
}

function splitByBoundary(
  ranges: Array<{ text: string; start: number; end: number }>,
  parent: TextUnit,
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
  return collectPartsFromUnits({ units, settings, targetMs });
}

function hardSplitUnit(
  unit: TextUnit,
  settings: BookExportSettings,
  targetMs: number,
): TextUnit[] {
  const averageMsPerChar = Math.max(
    1,
    estimateBookTextDurationMs(unit.text, settings) / Math.max(1, unit.text.length),
  );
  const chunkSize = Math.max(60, Math.floor(targetMs / averageMsPerChar));
  const parts: TextUnit[] = [];

  for (let start = 0; start < unit.text.length; start += chunkSize) {
    const end = Math.min(unit.text.length, start + chunkSize);
    const text = unit.text.slice(start, end).trim();
    if (!text) continue;
    const trimStart = unit.text.slice(start, end).search(/\S/);
    const sourceStart = unit.start + start + Math.max(0, trimStart);
    parts.push({
      text,
      start: sourceStart,
      end: sourceStart + text.length,
      title: unit.title,
    });
  }

  return parts.length > 0 ? parts : [unit];
}

function mergeTinyTrailingPart(
  parts: TextUnit[],
  settings: BookExportSettings,
  targetMs: number,
) {
  if (parts.length < 2) return parts;
  const last = parts[parts.length - 1];
  const previous = parts[parts.length - 2];
  const lastMs = estimateBookTextDurationMs(last.text, settings);
  if (lastMs >= targetMs * MIN_TRAILING_PART_RATIO) return parts;

  const combined = {
    text: `${previous.text}\n\n${last.text}`,
    start: previous.start,
    end: last.end,
    title: previous.title,
  };
  return [...parts.slice(0, -2), combined];
}

function finalizeParts(
  rawParts: TextUnit[],
  settings: BookExportSettings,
  sourceTitle?: string,
): BookExportPart[] {
  return rawParts
    .filter((part) => part.text.trim())
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
        }),
      };
    });
}

export function buildPartFilename({
  sourceTitle,
  partIndex,
  format,
}: {
  sourceTitle?: string;
  partIndex: number;
  format: "mp3" | "wav";
}) {
  const base = sanitizeDownloadFilename(
    sourceTitle || "morse-book",
    "morse-book",
  )
    .replace(/\.(mp3|wav|zip|txt|json|m3u)$/i, "")
    .slice(0, MAX_FILENAME_BASE_LENGTH);
  return `${base || "morse-book"}-part-${String(partIndex).padStart(3, "0")}.${format}`;
}

export function buildBundleFilename(sourceTitle?: string) {
  const base = sanitizeDownloadFilename(sourceTitle || "morse-book", "morse-book")
    .replace(/\.zip$/i, "")
    .slice(0, MAX_FILENAME_BASE_LENGTH);
  return `${base || "morse-book"}-morse-audio-bundle.zip`;
}

function excerpt(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
}
