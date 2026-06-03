import {
  estimateMorseDurationMs,
  farnsworthGapScale,
  getDotMs,
} from "~/client/components/shared/morseTiming";
import { getUnsupportedTextCharacters, textToMorse } from "~/client/components/shared/morseUtils";

import type { PreflightSummary } from "./bookSourceTypes";
import type { BookExportAnalysis, BookExportSettings } from "./bookExportTypes";

export const MORSE_TRANSCRIPT_PREVIEW_LIMIT = 1_800;
export const SAMPLE_EXPORT_CHARACTER_LIMIT = 420;
export const LARGE_WAV_WARNING_BYTES = 250 * 1024 * 1024;

type TextRange = {
  text: string;
  start: number;
  end: number;
};

export function applyExportPunctuationMode(
  text: string,
  settings: BookExportSettings,
) {
  if (settings.punctuationMode === "preserve") return text;

  return text
    .replace(/[\[\{]/g, "(")
    .replace(/[\]\}]/g, ")")
    .replace(/[~`^#$%*<>\\|]+/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildMorseTranscript(text: string) {
  return textToMorse(text, {
    wordSeparator: "slash",
    returnResult: true,
  }).value;
}

export function estimateBookTextDurationMs(
  text: string,
  settings: BookExportSettings,
) {
  const paragraphs = splitParagraphRanges(text);
  if (paragraphs.length === 0) return 0;

  let total = 0;
  paragraphs.forEach((paragraph, paragraphIndex) => {
    const sentences = splitSentenceRanges(paragraph.text);
    if (sentences.length === 0) return;

    sentences.forEach((sentence, sentenceIndex) => {
      total += estimateMorseForText(sentence.text, settings);
      if (sentenceIndex < sentences.length - 1) {
        total += getWordGapMs(settings) * settings.sentencePauseMultiplier;
      }
    });

    if (paragraphIndex < paragraphs.length - 1) {
      total += getWordGapMs(settings) * settings.paragraphPauseMultiplier;
    }
  });

  return total;
}

export function estimateMorseForText(
  text: string,
  settings: BookExportSettings,
) {
  const morse = buildMorseTranscript(text);
  if (!morse) return 0;
  return estimateMorseDurationMs(morse, {
    charWpm: settings.charWpm,
    farnsworthWpm: settings.farnsworthWpm,
  });
}

export function getWordGapMs(settings: BookExportSettings) {
  return (
    7 *
    farnsworthGapScale(settings.charWpm, settings.farnsworthWpm) *
    getDotMs(settings.charWpm)
  );
}

export function buildExportAnalysis({
  preflight,
  settings,
  partCount,
}: {
  preflight: PreflightSummary;
  settings: BookExportSettings;
  partCount: number;
}): BookExportAnalysis {
  const cleanedText = applyExportPunctuationMode(preflight.cleanedText, settings);
  const morseTranscript = buildMorseTranscript(
    cleanedText.slice(0, SAMPLE_EXPORT_CHARACTER_LIMIT),
  );
  const totalRuntimeMs =
    estimateBookTextDurationMs(cleanedText, settings) +
    Math.max(0, partCount) * (settings.tailPaddingMs ?? 0);
  const estimatedBytes = estimateBundleBytes(totalRuntimeMs, settings, partCount);
  const warnings: string[] = [];

  if (settings.outputFormat === "wav" && estimatedBytes > LARGE_WAV_WARNING_BYTES) {
    warnings.push(
      "WAV output may be very large. MP3 is safer for long books and slow connections.",
    );
  }

  if (totalRuntimeMs > 0 && partCount > 1) {
    warnings.push(
      "Split downloads save timed parts in a ZIP bundle.",
    );
  }

  return {
    cleanedText,
    morseTranscriptPreview: excerpt(morseTranscript, MORSE_TRANSCRIPT_PREVIEW_LIMIT),
    totalRuntimeMs,
    partCount,
    targetPartMs: settings.targetPartMinutes * 60_000,
    estimatedBytes,
    estimatedSizeLabel: formatBytes(estimatedBytes),
    unsupportedImpact: formatUnsupportedImpact(preflight),
    warnings,
  };
}

export function estimateBundleBytes(
  runtimeMs: number,
  settings: BookExportSettings,
  partCount: number,
) {
  if (runtimeMs <= 0) return 0;
  const seconds = runtimeMs / 1000;
  const textOverhead = Math.max(16_384, partCount * 2048);
  if (settings.outputFormat === "mp3") {
    return Math.ceil((settings.mp3Bitrate * 1000 * seconds) / 8 + textOverhead);
  }
  return Math.ceil(seconds * settings.sampleRate * 2 + textOverhead);
}

export function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value >= 10 || unitIndex === 0 ? Math.round(value) : value.toFixed(1)} ${
    units[unitIndex]
  }`;
}

export function splitParagraphRanges(text: string): TextRange[] {
  return splitRanges(text, /\n{2,}/g).filter((range) => range.text.trim());
}

export function splitSentenceRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];
  const pattern = /[^.!?]+(?:[.!?]+["')\]]*)?|[^.!?]+$/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const value = match[0].trim();
    if (!value) continue;
    ranges.push({
      text: value,
      start: match.index + match[0].indexOf(value),
      end: match.index + match[0].indexOf(value) + value.length,
    });
  }
  return ranges.length > 0 ? ranges : [{ text, start: 0, end: text.length }];
}

export function splitWordRanges(text: string): TextRange[] {
  const ranges: TextRange[] = [];
  const pattern = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    ranges.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return ranges;
}

function splitRanges(text: string, separator: RegExp): TextRange[] {
  const ranges: TextRange[] = [];
  let start = 0;
  let match: RegExpExecArray | null;
  while ((match = separator.exec(text)) !== null) {
    const value = text.slice(start, match.index).trim();
    if (value) {
      const leading = text.slice(start, match.index).search(/\S/);
      const rangeStart = start + Math.max(0, leading);
      ranges.push({
        text: value,
        start: rangeStart,
        end: rangeStart + value.length,
      });
    }
    start = match.index + match[0].length;
  }
  const tail = text.slice(start).trim();
  if (tail) {
    const leading = text.slice(start).search(/\S/);
    const rangeStart = start + Math.max(0, leading);
    ranges.push({ text: tail, start: rangeStart, end: rangeStart + tail.length });
  }
  return ranges;
}

function formatUnsupportedImpact(preflight: PreflightSummary) {
  if (preflight.unsupportedCount === 0) {
    return "No unsupported characters detected.";
  }
  const examples = Object.entries(getUnsupportedTextCharacters(preflight.cleanedText))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([character, count]) => `${character} x ${count}`)
    .join(", ");
  return `${preflight.unsupportedCount.toLocaleString()} unsupported character${
    preflight.unsupportedCount === 1 ? "" : "s"
  } will be skipped by Morse conversion${examples ? ` (${examples})` : ""}.`;
}

function excerpt(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
}
