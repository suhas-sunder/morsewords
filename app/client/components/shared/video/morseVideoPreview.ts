import { textToMorse } from "~/client/components/shared/morseUtils";
import type { MorseVideoAudioSettings } from "./morseVideoRenderer";
import {
  getMorseVideoFrameWordWindow,
  buildMorseVideoTimelineFromMorse,
  getMorseVideoFrameTextState,
  type MorseVideoFrameWordWindowItem,
} from "./morseVideoRenderer";
import type {
  MorseVideoTimedEvent,
  MorseVideoTimeline,
} from "./morseVideoRenderer";

import type { MorseVideoSettings } from "./morseVideoTypes";

const MIN_READABLE_MORSE_SYMBOLS = 6;
const PREVIEW_WORD_WINDOW_LIMIT = 168;
export const LONG_MORSE_VIDEO_PREVIEW_MAX_DURATION_MS = 5 * 60 * 1000;
const LONG_PREVIEW_MAX_WORDS = 1_200;
const LONG_PREVIEW_MAX_CHARS = 12_000;

export type MorseVideoPreview = {
  sampleText: string;
  sampleMorse: string;
  brandLabel: string;
  durationMs: number;
  events: MorseVideoTimedEvent[];
  timeline: MorseVideoTimeline;
};

export type MorseVideoPreviewOptions = {
  maxCharacters?: number;
  maxDurationMs?: number;
  maxWords?: number;
};

export type MorseVideoPreviewFrame = {
  active: boolean;
  morseExcerpt: string;
  symbols: string;
  textExcerpt: string;
  words: MorseVideoFrameWordWindowItem[];
};

export function buildMorseVideoPreview(
  settings: MorseVideoSettings,
  text: string,
  audioSettings: Pick<MorseVideoAudioSettings, "charWpm" | "farnsworthWpm"> = {
    charWpm: 18,
    farnsworthWpm: 12,
  },
  options: MorseVideoPreviewOptions = {},
): MorseVideoPreview {
  const { sampleText, sampleMorse } = buildPreviewSample(
    text,
    audioSettings,
    options,
  );
  const timeline = buildMorseVideoTimelineFromMorse(
    sampleMorse,
    audioSettings,
    sampleText,
  );
  const durationMs = Math.max(1_200, timeline.durationMs);

  return {
    sampleText,
    sampleMorse,
    brandLabel: settings.showBranding ? "www.morsewords.com" : "",
    durationMs,
    events: timeline.events,
    timeline,
  };
}

export function buildLongMorseVideoPreview(
  settings: MorseVideoSettings,
  text: string,
  audioSettings: Pick<MorseVideoAudioSettings, "charWpm" | "farnsworthWpm"> = {
    charWpm: 18,
    farnsworthWpm: 12,
  },
): MorseVideoPreview {
  return buildMorseVideoPreview(settings, text, audioSettings, {
    maxDurationMs: LONG_MORSE_VIDEO_PREVIEW_MAX_DURATION_MS,
    maxWords: LONG_PREVIEW_MAX_WORDS,
    maxCharacters: LONG_PREVIEW_MAX_CHARS,
  });
}

export function getMorseVideoPreviewFrame(
  preview: MorseVideoPreview,
  elapsedMs: number,
): MorseVideoPreviewFrame {
  const loopedElapsedMs =
    preview.durationMs > 0 ? elapsedMs % preview.durationMs : elapsedMs;
  const active = preview.events.some(
    (event) =>
      event.type === "mark" &&
      loopedElapsedMs >= event.startMs &&
      loopedElapsedMs < event.endMs,
  );
  const completedSymbols = preview.events
    .filter((event) => event.type === "mark" && event.startMs <= loopedElapsedMs)
    .map((event) => event.symbol ?? "")
    .join("");
  const sampleMorse = preview.sampleMorse.replace(/\s+/g, " ");
  const textState = getMorseVideoFrameTextState(preview.timeline, loopedElapsedMs);
  const words = getMorseVideoFrameWordWindow(
    preview.timeline,
    loopedElapsedMs,
    PREVIEW_WORD_WINDOW_LIMIT,
  );
  const morseExcerpt = words.map((word) => word.morse).join("   ");
  const textExcerpt = words.map((word) => word.text).join(" ");
  return {
    active,
    symbols: readableMorseExcerpt(completedSymbols, sampleMorse, 44),
    morseExcerpt:
      morseExcerpt ||
      textState.morseText ||
      readableMorseExcerpt(completedSymbols, sampleMorse, 92),
    textExcerpt:
      textExcerpt ||
      readableTextExcerpt(preview.timeline, loopedElapsedMs, PREVIEW_WORD_WINDOW_LIMIT) ||
      textState.plainText ||
      preview.sampleText,
    words,
  };
}

function buildPreviewSample(
  text: string,
  audioSettings: Pick<MorseVideoAudioSettings, "charWpm" | "farnsworthWpm">,
  options: MorseVideoPreviewOptions,
) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return morseSampleFromText("SOS HELP");
  if (options.maxDurationMs) {
    return buildTimedPreviewSample(normalized, audioSettings, options);
  }
  const sample = normalized.split(" ").slice(0, 20).join(" ");
  return morseSampleFromText(
    sample.length > 180 ? `${sample.slice(0, 177).trimEnd()}...` : sample,
  );
}

function buildTimedPreviewSample(
  normalized: string,
  audioSettings: Pick<MorseVideoAudioSettings, "charWpm" | "farnsworthWpm">,
  options: MorseVideoPreviewOptions,
) {
  const maxDurationMs = Math.max(1_200, options.maxDurationMs ?? 0);
  const maxWords = Math.max(1, options.maxWords ?? LONG_PREVIEW_MAX_WORDS);
  const maxCharacters = Math.max(
    1,
    options.maxCharacters ?? LONG_PREVIEW_MAX_CHARS,
  );
  const candidateWords: string[] = [];
  let candidateLength = 0;

  for (const word of normalized.split(" ").filter(Boolean)) {
    const nextLength = candidateLength + word.length + (candidateWords.length ? 1 : 0);
    if (
      candidateWords.length >= maxWords ||
      (nextLength > maxCharacters && candidateWords.length > 0)
    ) {
      break;
    }
    candidateWords.push(word);
    candidateLength = nextLength;
  }

  if (candidateWords.length === 0) return morseSampleFromText("SOS HELP");

  const buildCandidate = (wordCount: number) => {
    const sampleText = candidateWords.slice(0, wordCount).join(" ");
    const sampleMorse = morseTextFromSample(sampleText);
    const timeline = buildMorseVideoTimelineFromMorse(
      sampleMorse,
      audioSettings,
      sampleText,
    );
    return {
      sampleText,
      sampleMorse,
      durationMs: timeline.durationMs,
    };
  };

  const fullCandidate = buildCandidate(candidateWords.length);
  if (fullCandidate.durationMs <= maxDurationMs) return fullCandidate;

  let low = 1;
  let high = candidateWords.length;
  let best = buildCandidate(1);

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = buildCandidate(mid);
    if (candidate.durationMs <= maxDurationMs) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}

function morseSampleFromText(sampleText: string) {
  return {
    sampleText,
    sampleMorse: morseTextFromSample(sampleText),
  };
}

function morseTextFromSample(sampleText: string) {
  const morse = textToMorse(sampleText, {
    unsupportedText: "omit",
    wordSeparator: "spaces",
  });
  return typeof morse === "string" && morse.trim()
    ? morse
    : textToMorse("SOS HELP", { wordSeparator: "spaces" });
}

function readableTextExcerpt(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  limit: number,
) {
  const normalized = timeline.text.trim().replace(/\s+/g, " ");
  if (!normalized) return "";
  const words = normalized.split(" ").filter(Boolean);
  if (words.length <= 4) return normalized.slice(0, limit);

  const { token } = getMorseVideoFrameTextState(timeline, elapsedMs);
  const start = Math.max(0, (token?.wordIndex ?? 0) - 4);
  let excerpt = "";
  for (let index = start; index < words.length; index += 1) {
    const candidate = excerpt ? `${excerpt} ${words[index]}` : words[index];
    if (candidate.length > limit && excerpt) break;
    excerpt = candidate;
  }
  return excerpt.length > limit
    ? `${excerpt.slice(0, limit - 3).trimEnd()}...`
    : excerpt;
}

function readableMorseExcerpt(
  completedSymbols: string,
  fallbackMorse: string,
  limit: number,
) {
  const normalizedCompleted = completedSymbols.trim();
  const normalizedFallback = fallbackMorse.trim();
  if (
    normalizedCompleted.replace(/\s+/g, "").length <
    MIN_READABLE_MORSE_SYMBOLS
  ) {
    return normalizedFallback.slice(0, limit);
  }
  return normalizedCompleted.slice(
    Math.max(0, normalizedCompleted.length - limit),
  );
}
