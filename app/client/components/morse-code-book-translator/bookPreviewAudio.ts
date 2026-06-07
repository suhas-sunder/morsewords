import { estimateMorseDurationMs } from "~/client/components/shared/morseTiming";
import {
  buildMorseVideoTimelineFromMorse,
  getMorseVideoActiveToken,
  type MorseVideoTimeline,
} from "~/client/components/shared/video/morseVideoRenderer";

import { buildMorseTranscript, formatDuration } from "./bookDurationEstimate";
import type { BookExportSettings } from "./bookExportTypes";

const BOOK_PREVIEW_MIN_DURATION_MS = 15_000;
const BOOK_PREVIEW_MAX_DURATION_MS = 30_000;
const BOOK_PREVIEW_MAX_WORDS = 90;
const BOOK_PREVIEW_MAX_CHARS = 900;

export type BookAudioPreview = {
  sampleText: string;
  sampleMorse: string;
  timeline: MorseVideoTimeline;
  durationMs: number;
  label: string;
  truncated: boolean;
};

export function buildBookAudioPreview(
  cleanedText: string,
  settings: BookExportSettings,
): BookAudioPreview | null {
  const trimmedSource = cleanedText.trim();
  const previewSource = trimmedSource.slice(0, BOOK_PREVIEW_MAX_CHARS * 4);
  const normalized = previewSource.replace(/\s+/g, " ");
  if (!normalized) return null;

  const words = normalized.split(" ").filter(Boolean);
  let sampleText = "";
  let sampleMorse = "";
  let durationMs = 0;
  let usedWords = 0;

  for (
    let index = 0;
    index < words.length && index < BOOK_PREVIEW_MAX_WORDS;
    index += 1
  ) {
    const candidate = sampleText
      ? `${sampleText} ${words[index]}`
      : words[index];
    if (candidate.length > BOOK_PREVIEW_MAX_CHARS && sampleText) break;

    const candidateMorse = buildMorseTranscript(candidate);
    const candidateDurationMs = estimateMorseDurationMs(candidateMorse, {
      charWpm: settings.charWpm,
      farnsworthWpm: settings.farnsworthWpm,
    });

    if (
      candidateDurationMs > BOOK_PREVIEW_MAX_DURATION_MS &&
      durationMs >= BOOK_PREVIEW_MIN_DURATION_MS
    ) {
      break;
    }

    sampleText = candidate;
    sampleMorse = candidateMorse;
    durationMs = candidateDurationMs;
    usedWords = index + 1;

    if (durationMs >= BOOK_PREVIEW_MAX_DURATION_MS) break;
  }

  if (!sampleMorse.trim()) return null;

  const timeline = buildMorseVideoTimelineFromMorse(
    sampleMorse,
    {
      charWpm: settings.charWpm,
      farnsworthWpm: settings.farnsworthWpm,
      tailPaddingMs: 0,
    },
    sampleText,
  );
  durationMs = timeline.durationMs;

  const truncated =
    trimmedSource.length > previewSource.length ||
    usedWords < words.length ||
    normalized.length > sampleText.length;
  const cappedAtTarget = durationMs >= BOOK_PREVIEW_MAX_DURATION_MS * 0.92;
  const label = truncated
    ? cappedAtTarget
      ? "Previewing the first 30 seconds"
      : `Previewing about ${formatDuration(durationMs)} from the start`
    : `Previewing the full ${formatDuration(durationMs)} source`;

  return {
    sampleText,
    sampleMorse,
    timeline,
    durationMs,
    label,
    truncated,
  };
}

export function morseFromPreviewOffset(
  preview: BookAudioPreview,
  elapsedMs: number,
) {
  if (elapsedMs <= 0) return preview.sampleMorse;
  if (elapsedMs >= preview.durationMs) return "";
  const activeToken = getMorseVideoActiveToken(preview.timeline, elapsedMs);
  if (!activeToken) return preview.sampleMorse;
  const startIndex = preview.timeline.tokens.findIndex(
    (token) =>
      token.startMs === activeToken.startMs &&
      token.wordIndex === activeToken.wordIndex &&
      token.charIndex === activeToken.charIndex,
  );
  if (startIndex < 0) return preview.sampleMorse;

  let previousWordIndex = preview.timeline.tokens[startIndex]?.wordIndex ?? 0;
  return preview.timeline.tokens
    .slice(startIndex)
    .map((token, index) => {
      const separator =
        index === 0 ? "" : token.wordIndex === previousWordIndex ? " " : " / ";
      previousWordIndex = token.wordIndex;
      return `${separator}${token.morse}`;
    })
    .join("")
    .trim();
}
