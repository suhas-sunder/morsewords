import { estimateMorseDurationMs } from "~/client/components/shared/morseTiming";
import {
  buildMorseVideoTimelineFromMorse,
  getMorseVideoActiveToken,
  type MorseVideoTimeline,
} from "~/client/components/shared/video/morseVideoRenderer";
import { LONG_MORSE_VIDEO_PREVIEW_MAX_DURATION_MS } from "~/client/components/shared/video/morseVideoPreview";

import { buildMorseTranscript, formatDuration } from "./bookDurationEstimate";
import type { BookExportSettings } from "./bookExportTypes";

const BOOK_PREVIEW_MAX_DURATION_MS = LONG_MORSE_VIDEO_PREVIEW_MAX_DURATION_MS;
const BOOK_PREVIEW_MAX_WORDS = 1_200;
const BOOK_PREVIEW_MAX_CHARS = 12_000;

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
  const previewSource = trimmedSource.slice(0, BOOK_PREVIEW_MAX_CHARS * 2);
  const normalized = previewSource.replace(/\s+/g, " ");
  if (!normalized) return null;

  const words = collectPreviewWords(normalized);
  const selection = choosePreviewSelection(words, settings);
  const { sampleText, sampleMorse } = selection;
  let durationMs = selection.durationMs;

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
    selection.usedWords < words.length ||
    normalized.length > sampleText.length;
  const cappedAtTarget = durationMs >= BOOK_PREVIEW_MAX_DURATION_MS * 0.92;
  const label = truncated
    ? cappedAtTarget
      ? "Previewing the first 5 minutes"
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

function collectPreviewWords(normalized: string) {
  const words: string[] = [];
  let characterCount = 0;
  for (const word of normalized.split(" ").filter(Boolean)) {
    const nextCharacterCount = characterCount + word.length + (words.length ? 1 : 0);
    if (
      words.length >= BOOK_PREVIEW_MAX_WORDS ||
      (nextCharacterCount > BOOK_PREVIEW_MAX_CHARS && words.length > 0)
    ) {
      break;
    }
    words.push(word);
    characterCount = nextCharacterCount;
  }
  return words;
}

function choosePreviewSelection(
  words: string[],
  settings: BookExportSettings,
) {
  const buildCandidate = (wordCount: number) => {
    const sampleText = words.slice(0, wordCount).join(" ");
    const sampleMorse = buildMorseTranscript(sampleText);
    const durationMs = estimateMorseDurationMs(sampleMorse, {
      charWpm: settings.charWpm,
      farnsworthWpm: settings.farnsworthWpm,
    });
    return {
      durationMs,
      sampleMorse,
      sampleText,
      usedWords: wordCount,
    };
  };

  if (words.length === 0) return buildCandidate(0);

  const fullCandidate = buildCandidate(words.length);
  if (fullCandidate.durationMs <= BOOK_PREVIEW_MAX_DURATION_MS) {
    return fullCandidate;
  }

  let low = 1;
  let high = words.length;
  let best = buildCandidate(1);

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = buildCandidate(mid);
    if (candidate.durationMs <= BOOK_PREVIEW_MAX_DURATION_MS) {
      best = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
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
