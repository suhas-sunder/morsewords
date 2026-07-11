import {
  morseToText,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import {
  buildMorseTimeline,
  type MorseTimeline,
} from "~/client/components/shared/morseTiming";

export type MorseExportKind = "audio" | "video";
export type MorseExportFormat = "mp3" | "wav" | "mp4" | "webm";
export type MorseExportSourceMode = "text" | "morse";

export type MorseExportThreshold = {
  /** Preferred part size. Parts may be smaller at natural boundaries. */
  targetDurationMs: number;
  /** Last-resort ceiling. This reduces risk but cannot guarantee every device. */
  maxDurationMs: number;
  maxEstimatedBytes: number;
};

export type MorseExportPlanPart = {
  durationMs: number;
  estimatedBytes: number;
  filename: string;
  index: number;
  morse: string;
  sourceEnd: number;
  sourceStart: number;
  text: string;
  timeline: MorseTimeline;
  totalParts: number;
};

export type MorseExportPlan = {
  estimatedBytes: number;
  format: MorseExportFormat;
  kind: MorseExportKind;
  multiPart: boolean;
  parts: MorseExportPlanPart[];
  threshold: MorseExportThreshold;
  totalDurationMs: number;
};

export const MORSE_EXPORT_THRESHOLDS: Record<
  MorseExportFormat,
  MorseExportThreshold
> = {
  // These limits bound one in-memory Blob and one active encoder. They are
  // intentionally conservative; device and browser capacity still varies.
  mp3: {
    targetDurationMs: 20 * 60_000,
    maxDurationMs: 30 * 60_000,
    maxEstimatedBytes: 64 * 1024 * 1024,
  },
  wav: {
    targetDurationMs: 8 * 60_000,
    maxDurationMs: 12 * 60_000,
    maxEstimatedBytes: 72 * 1024 * 1024,
  },
  mp4: {
    targetDurationMs: 90_000,
    maxDurationMs: 120_000,
    maxEstimatedBytes: 96 * 1024 * 1024,
  },
  webm: {
    targetDurationMs: 90_000,
    maxDurationMs: 120_000,
    maxEstimatedBytes: 96 * 1024 * 1024,
  },
};

type BuildMorseExportPlanOptions = {
  baseFilename: string;
  charWpm: number;
  farnsworthWpm?: number;
  format: MorseExportFormat;
  kind: MorseExportKind;
  mp3Kbps?: number;
  sampleRate?: number;
  source: string;
  sourceMode: MorseExportSourceMode;
  tailPaddingMs?: number;
  threshold?: MorseExportThreshold;
  videoBitsPerSecond?: number;
};

type SourceRange = { start: number; end: number };

export function buildMorseExportPlan({
  baseFilename,
  charWpm,
  farnsworthWpm,
  format,
  kind,
  mp3Kbps = 128,
  sampleRate = 44_100,
  source,
  sourceMode,
  tailPaddingMs = 0,
  threshold = MORSE_EXPORT_THRESHOLDS[format],
  videoBitsPerSecond,
}: BuildMorseExportPlanOptions): MorseExportPlan {
  const safeSource = source ?? "";
  const timelineForRange = (range: SourceRange) => {
    const value = safeSource.slice(range.start, range.end).trim();
    const morse = sourceMode === "text" ? textToMorse(value) : value;
    return buildMorseTimeline(morse, {
      charWpm,
      farnsworthWpm,
      tailPaddingMs,
    });
  };
  const fullRange = { start: 0, end: safeSource.length };
  const fullTimeline = timelineForRange(fullRange);
  const fullEstimatedBytes = estimateExportBytes({
    durationMs: fullTimeline.durationMs,
    format,
    mp3Kbps,
    sampleRate,
    videoBitsPerSecond,
  });
  const needsSplit =
    fullTimeline.durationMs > threshold.maxDurationMs ||
    fullEstimatedBytes > threshold.maxEstimatedBytes;
  const ranges = needsSplit
    ? splitSourceRanges({
        source: safeSource,
        sourceMode,
        timelineForRange,
        threshold,
        estimateBytes: (durationMs) =>
          estimateExportBytes({
            durationMs,
            format,
            mp3Kbps,
            sampleRate,
            videoBitsPerSecond,
          }),
      })
    : [fullRange];
  const rawParts = ranges
    .map((range) => {
      const text = safeSource.slice(range.start, range.end).trim();
      const morse = sourceMode === "text" ? textToMorse(text) : text;
      const timeline = buildMorseTimeline(morse, {
        charWpm,
        farnsworthWpm,
        tailPaddingMs,
      });
      return {
        durationMs: timeline.durationMs,
        estimatedBytes: estimateExportBytes({
          durationMs: timeline.durationMs,
          format,
          mp3Kbps,
          sampleRate,
          videoBitsPerSecond,
        }),
        morse,
        sourceEnd: range.end,
        sourceStart: range.start,
        text: sourceMode === "text" ? text : morseToText(morse),
        timeline,
      };
    })
    .filter((part) => part.timeline.events.some((event) => event.type === "mark"));
  const totalParts = rawParts.length;
  const safeBase = sanitizeExportBaseFilename(baseFilename);
  const parts = rawParts.map((part, offset): MorseExportPlanPart => ({
    ...part,
    filename: buildMorsePartFilename({
      baseFilename: safeBase,
      format,
      index: offset + 1,
      totalParts,
    }),
    index: offset + 1,
    totalParts,
  }));

  return {
    estimatedBytes: parts.reduce((sum, part) => sum + part.estimatedBytes, 0),
    format,
    kind,
    multiPart: parts.length > 1,
    parts,
    threshold,
    totalDurationMs: parts.reduce((sum, part) => sum + part.durationMs, 0),
  };
}

export function buildMorsePartFilename({
  baseFilename,
  format,
  index,
  totalParts,
}: {
  baseFilename: string;
  format: MorseExportFormat;
  index: number;
  totalParts: number;
}) {
  const base = sanitizeExportBaseFilename(baseFilename);
  if (totalParts <= 1) return `${base}.${format}`;
  const width = Math.max(2, String(totalParts).length);
  return `${base}-part-${String(index).padStart(width, "0")}-of-${String(
    totalParts,
  ).padStart(width, "0")}.${format}`;
}

export function sanitizeExportBaseFilename(value: string) {
  return (
    value
      .trim()
      .replace(/\.(mp3|wav|mp4|webm)$/i, "")
      .replace(/[\u0000-\u001f\u007f]+/g, "")
      .replace(/[<>:"/\\|?*]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[.\-\s]+|[.\-\s]+$/g, "")
      .slice(0, 80) || "morsewords-export"
  );
}

export function estimateExportBytes({
  durationMs,
  format,
  mp3Kbps = 128,
  sampleRate = 44_100,
  videoBitsPerSecond,
}: {
  durationMs: number;
  format: MorseExportFormat;
  mp3Kbps?: number;
  sampleRate?: number;
  videoBitsPerSecond?: number;
}) {
  const seconds = Math.max(0, durationMs) / 1000;
  if (format === "wav") return Math.ceil(44 + seconds * sampleRate * 2);
  if (format === "mp3") return Math.ceil((seconds * mp3Kbps * 1000) / 8 + 4096);
  const defaultVideoRate = format === "mp4" ? 5_128_000 : 4_628_000;
  return Math.ceil((seconds * (videoBitsPerSecond ?? defaultVideoRate)) / 8 + 1_048_576);
}

function splitSourceRanges({
  estimateBytes,
  source,
  sourceMode,
  threshold,
  timelineForRange,
}: {
  estimateBytes: (durationMs: number) => number;
  source: string;
  sourceMode: MorseExportSourceMode;
  threshold: MorseExportThreshold;
  timelineForRange: (range: SourceRange) => MorseTimeline;
}) {
  const fits = (range: SourceRange, target = false) => {
    const durationMs = timelineForRange(range).durationMs;
    const durationLimit = target
      ? threshold.targetDurationMs
      : threshold.maxDurationMs;
    return (
      durationMs <= durationLimit &&
      estimateBytes(durationMs) <= threshold.maxEstimatedBytes
    );
  };
  const levels =
    sourceMode === "text"
      ? [paragraphRanges(source), sentenceRanges(source), wordRanges(source), characterRanges(source)]
      : [morseWordRanges(source), morseLetterRanges(source)];

  let pending: SourceRange[] = levels[0];
  const final: SourceRange[] = [];

  const splitOversized = (range: SourceRange, levelIndex: number): SourceRange[] => {
    if (fits(range)) return [range];
    const nextLevel = levels[Math.min(levelIndex + 1, levels.length - 1)].filter(
      (candidate) => candidate.start >= range.start && candidate.end <= range.end,
    );
    if (nextLevel.length <= 1 || levelIndex >= levels.length - 1) return [range];
    return packRanges(nextLevel, fits).flatMap((candidate) =>
      fits(candidate) ? [candidate] : splitOversized(candidate, levelIndex + 1),
    );
  };

  pending = pending.flatMap((range) => splitOversized(range, 0));
  for (const range of packRanges(pending, fits)) {
    final.push(...(fits(range) ? [range] : splitOversized(range, levels.length - 2)));
  }
  return final.length > 0
    ? normalizeCoverage(final, source.length)
    : [{ start: 0, end: source.length }];
}

function packRanges(
  ranges: SourceRange[],
  fits: (range: SourceRange, target?: boolean) => boolean,
) {
  if (ranges.length === 0) return [];
  const packed: SourceRange[] = [];
  let current = ranges[0];
  for (const next of ranges.slice(1)) {
    const combined = { start: current.start, end: next.end };
    if (fits(combined, true)) current = combined;
    else {
      packed.push(current);
      current = next;
    }
  }
  packed.push(current);
  return packed;
}

function normalizeCoverage(ranges: SourceRange[], sourceLength: number) {
  return ranges.map((range, index) => ({
    start: index === 0 ? 0 : ranges[index - 1].end,
    end: index === ranges.length - 1 ? sourceLength : range.end,
  }));
}

function rangesFromMatches(source: string, pattern: RegExp) {
  const starts: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) starts.push(match.index);
  if (starts.length === 0) return source ? [{ start: 0, end: source.length }] : [];
  return starts.map((start, index) => ({
    start,
    end: starts[index + 1] ?? source.length,
  }));
}

function paragraphRanges(source: string) {
  return rangesFromMatches(source, /\S(?:[\s\S]*?)(?=\n\s*\n|$)/g);
}

function sentenceRanges(source: string) {
  return rangesFromMatches(source, /\S(?:[^.!?]|[.!?](?!\s|$))*[.!?]?(?=\s|$)/g);
}

function wordRanges(source: string) {
  return rangesFromMatches(source, /\S+/g);
}

function characterRanges(source: string) {
  const ranges: SourceRange[] = [];
  let offset = 0;
  for (const character of source) {
    ranges.push({ start: offset, end: offset + character.length });
    offset += character.length;
  }
  return ranges;
}

function morseWordRanges(source: string) {
  return rangesFromMatches(source, /[^/\s](?:[^/]*?)(?=\s*\/|$)/g);
}

function morseLetterRanges(source: string) {
  return rangesFromMatches(source, /[.-]+/g);
}
