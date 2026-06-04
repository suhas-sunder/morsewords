import { textToMorse } from "~/client/components/shared/morseUtils";
import { buildMorseEvents } from "~/client/components/shared/morseTiming";
import type { MorseVideoAudioSettings } from "./morseVideoRenderer";
import type { MorseVideoTimedEvent } from "./morseVideoRenderer";

import type { MorseVideoSettings } from "./morseVideoTypes";

export type MorseVideoPreview = {
  sampleText: string;
  sampleMorse: string;
  brandLabel: string;
  durationMs: number;
  events: MorseVideoTimedEvent[];
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
  const events = buildPreviewEvents(sampleMorse, audioSettings);
  const durationMs = Math.max(
    1_200,
    events.reduce((max, event) => Math.max(max, event.endMs), 0),
  );

  return {
    sampleText,
    sampleMorse,
    brandLabel: settings.showBranding ? "www.morsewords.com" : "",
    durationMs,
    events,
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
  const symbols = preview.events
    .filter((event) => event.type === "mark" && event.startMs <= loopedElapsedMs)
    .map((event) => event.symbol ?? "")
    .join("");
  return {
    active,
    symbols: symbols.slice(Math.max(0, symbols.length - 44)),
    morseExcerpt: (symbols || preview.sampleMorse.replace(/\s+/g, " ")).slice(
      Math.max(0, (symbols || preview.sampleMorse).length - 92),
    ),
    textExcerpt: currentTextExcerpt(preview.sampleText, loopedElapsedMs, preview.durationMs),
  };
}

function buildPreviewSampleText(text: string) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return "SOS HELP";
  const sample = normalized.split(" ").slice(0, 4).join(" ");
  return sample.length > 34 ? `${sample.slice(0, 31).trimEnd()}...` : sample;
}

function buildPreviewEvents(
  morse: string,
  audioSettings: Pick<MorseVideoAudioSettings, "charWpm" | "farnsworthWpm">,
) {
  const events: MorseVideoTimedEvent[] = [];
  let cursorMs = 0;
  for (const event of buildMorseEvents(morse, audioSettings)) {
    const startMs = cursorMs;
    cursorMs += Math.max(0, event.ms);
    events.push({
      type: event.type,
      startMs,
      endMs: cursorMs,
      symbol: event.type === "mark" ? event.symbol : undefined,
    });
  }
  return events;
}

function currentTextExcerpt(text: string, elapsedMs: number, durationMs: number) {
  const words = text.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);
  if (words.length === 0) return "";
  const progress = Math.max(0, Math.min(1, elapsedMs / Math.max(1, durationMs)));
  const start = Math.max(0, Math.floor(progress * words.length) - 3);
  return words.slice(start, start + 7).join(" ");
}
