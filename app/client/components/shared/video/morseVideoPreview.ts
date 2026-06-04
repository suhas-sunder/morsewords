import { textToMorse } from "~/client/components/shared/morseUtils";
import type { MorseVideoAudioSettings } from "./morseVideoRenderer";
import {
  buildMorseVideoTimelineFromMorse,
  getMorseVideoFrameTextState,
} from "./morseVideoRenderer";
import type {
  MorseVideoTimedEvent,
  MorseVideoTimeline,
} from "./morseVideoRenderer";

import type { MorseVideoSettings } from "./morseVideoTypes";

const MIN_READABLE_MORSE_SYMBOLS = 6;

export type MorseVideoPreview = {
  sampleText: string;
  sampleMorse: string;
  brandLabel: string;
  durationMs: number;
  events: MorseVideoTimedEvent[];
  timeline: MorseVideoTimeline;
};

export type MorseVideoPreviewFrame = {
  active: boolean;
  morseExcerpt: string;
  symbols: string;
  textExcerpt: string;
};

export function buildMorseVideoPreview(
  settings: MorseVideoSettings,
  text: string,
  audioSettings: Pick<MorseVideoAudioSettings, "charWpm" | "farnsworthWpm"> = {
    charWpm: 18,
    farnsworthWpm: 12,
  },
): MorseVideoPreview {
  const sampleText = buildPreviewSampleText(text);
  const morse = textToMorse(sampleText, {
    unsupportedText: "omit",
    wordSeparator: "spaces",
  });
  const sampleMorse =
    typeof morse === "string" && morse.trim()
      ? morse
      : textToMorse("SOS HELP", { wordSeparator: "spaces" });
  const timeline = buildMorseVideoTimelineFromMorse(sampleMorse, audioSettings, sampleText);
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
  return {
    active,
    symbols: readableMorseExcerpt(completedSymbols, sampleMorse, 44),
    morseExcerpt:
      textState.morseText || readableMorseExcerpt(completedSymbols, sampleMorse, 92),
    textExcerpt: textState.plainText || preview.sampleText,
  };
}

function buildPreviewSampleText(text: string) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return "SOS HELP";
  const sample = normalized.split(" ").slice(0, 4).join(" ");
  return sample.length > 34 ? `${sample.slice(0, 31).trimEnd()}...` : sample;
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
