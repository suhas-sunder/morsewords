import {
  AUDIO_PITCH_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  AUDIO_TAIL_RANGE,
  MP3_BITRATES,
  VOLUME_RANGE,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
  sanitizeMp3Bitrate,
} from "~/client/components/shared/morseSettings";
import { getAudioPresetShortLabel } from "~/client/components/shared/audioPresetRegistry";
import { clampNumber } from "~/client/components/shared/settingsStorage";

import type {
  BookExportFormat,
  BookExportPresetName,
  BookExportSettings,
  BookPunctuationMode,
  BookSplitMode,
} from "./bookExportTypes";

export const BOOK_EXPORT_PRESET_NAMES = [
  "Reader Quick Start",
  "Long Listen",
  "Practice Copy",
  "Faithful Source",
  "Archive Export",
] as const satisfies readonly BookExportPresetName[];

export const BOOK_EXPORT_FORMATS = ["mp3", "wav"] as const;
export const BOOK_PUNCTUATION_MODES = ["preserve", "simplify"] as const;
export const BOOK_SPLIT_MODES = [
  "none",
  "duration",
  "source-sections",
] as const satisfies readonly BookSplitMode[];

export const BOOK_EXPORT_PRESET_DETAILS: Record<
  BookExportPresetName,
  { description: string; bestFor: string }
> = {
  "Reader Quick Start": {
    description:
      "Compact MP3 settings for turning a chapter or short book into listenable Morse audio.",
    bestFor: "Most first downloads",
  },
  "Long Listen": {
    description:
      "A softer MP3 tone with fewer transcript extras for extended listening.",
    bestFor: "Long books and relaxed listening",
  },
  "Practice Copy": {
    description:
      "Slower Farnsworth spacing and transcript options for copy-practice sessions.",
    bestFor: "Training and review",
  },
  "Faithful Source": {
    description:
      "Preserves supported punctuation and source sections when possible while keeping MP3 output.",
    bestFor: "Closer source structure",
  },
  "Archive Export": {
    description:
      "Uncompressed WAV output with metadata options. Useful for short archival downloads, but large.",
    bestFor: "Short uncompressed bundles",
  },
};

export const BOOK_EXPORT_PRESETS: Record<
  BookExportPresetName,
  BookExportSettings
> = {
  "Reader Quick Start": {
    presetName: "Reader Quick Start",
    charWpm: 18,
    farnsworthWpm: 12,
    tonePreset: "cw_radio",
    pitch: 650,
    volume: 0.75,
    outputFormat: "mp3",
    mp3Bitrate: 32,
    sampleRate: 44100,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: 8,
    preferSourceSections: true,
    paragraphPauseMultiplier: 2.4,
    sentencePauseMultiplier: 1.35,
    punctuationMode: "simplify",
    includeCleanedText: false,
    includeMorseTranscript: false,
    includeManifest: false,
    includeSettings: false,
    includeReadme: false,
  },
  "Long Listen": {
    presetName: "Long Listen",
    charWpm: 16,
    farnsworthWpm: 12,
    tonePreset: "sine",
    pitch: 600,
    volume: 0.68,
    outputFormat: "mp3",
    mp3Bitrate: 32,
    sampleRate: 44100,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: 18,
    preferSourceSections: true,
    paragraphPauseMultiplier: 3,
    sentencePauseMultiplier: 1.5,
    punctuationMode: "simplify",
    includeCleanedText: false,
    includeMorseTranscript: false,
    includeManifest: false,
    includeSettings: false,
    includeReadme: false,
  },
  "Practice Copy": {
    presetName: "Practice Copy",
    charWpm: 20,
    farnsworthWpm: 10,
    tonePreset: "cw_radio",
    pitch: 700,
    volume: 0.78,
    outputFormat: "mp3",
    mp3Bitrate: 48,
    sampleRate: 44100,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: 5,
    preferSourceSections: false,
    paragraphPauseMultiplier: 2,
    sentencePauseMultiplier: 1.25,
    punctuationMode: "simplify",
    includeCleanedText: true,
    includeMorseTranscript: true,
    includeManifest: true,
    includeSettings: true,
    includeReadme: true,
  },
  "Faithful Source": {
    presetName: "Faithful Source",
    charWpm: 18,
    farnsworthWpm: 18,
    tonePreset: "triangle",
    pitch: 620,
    volume: 0.72,
    outputFormat: "mp3",
    mp3Bitrate: 64,
    sampleRate: 44100,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: 10,
    preferSourceSections: true,
    paragraphPauseMultiplier: 1.8,
    sentencePauseMultiplier: 1.1,
    punctuationMode: "preserve",
    includeCleanedText: true,
    includeMorseTranscript: true,
    includeManifest: true,
    includeSettings: true,
    includeReadme: true,
  },
  "Archive Export": {
    presetName: "Archive Export",
    charWpm: 18,
    farnsworthWpm: 18,
    tonePreset: "sine",
    pitch: 650,
    volume: 0.74,
    outputFormat: "wav",
    mp3Bitrate: 64,
    sampleRate: 48000,
    tailPaddingMs: 220,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: 6,
    preferSourceSections: true,
    paragraphPauseMultiplier: 2,
    sentencePauseMultiplier: 1.2,
    punctuationMode: "preserve",
    includeCleanedText: true,
    includeMorseTranscript: true,
    includeManifest: true,
    includeSettings: true,
    includeReadme: true,
  },
};

export const DEFAULT_BOOK_EXPORT_SETTINGS =
  BOOK_EXPORT_PRESETS["Reader Quick Start"];

export function isBookExportPresetName(
  value: unknown,
): value is BookExportPresetName {
  return BOOK_EXPORT_PRESET_NAMES.includes(value as BookExportPresetName);
}

export function isBookSplitMode(value: unknown): value is BookSplitMode {
  return BOOK_SPLIT_MODES.includes(value as BookSplitMode);
}

export function sanitizeBookExportSettings(
  settings: Partial<BookExportSettings>,
): BookExportSettings {
  const presetName = isBookExportPresetName(settings.presetName)
    ? settings.presetName
    : "Reader Quick Start";
  const fallback = BOOK_EXPORT_PRESETS[presetName];
  const charWpm = Math.round(
    clampNumber(
      settings.charWpm ?? fallback.charWpm,
      AUDIO_SPEED_RANGE.min,
      AUDIO_SPEED_RANGE.max,
    ),
  );
  const farnsworthWpm = Math.round(
    clampNumber(
      settings.farnsworthWpm ?? fallback.farnsworthWpm,
      AUDIO_SPEED_RANGE.min,
      charWpm,
    ),
  );
  const outputFormat: BookExportFormat =
    settings.outputFormat === "wav" || settings.outputFormat === "mp3"
      ? settings.outputFormat
      : fallback.outputFormat;
  const punctuationMode: BookPunctuationMode =
    settings.punctuationMode === "preserve" ||
    settings.punctuationMode === "simplify"
      ? settings.punctuationMode
      : fallback.punctuationMode;
  const splitMode = isBookSplitMode(settings.splitMode)
    ? settings.splitMode
    : fallback.splitMode;

  return {
    ...fallback,
    ...settings,
    presetName,
    charWpm,
    farnsworthWpm,
    tonePreset: sanitizeAudioGeneratorPreset(
      settings.tonePreset,
      fallback.tonePreset,
    ),
    pitch: Math.round(
      clampNumber(
        settings.pitch ?? fallback.pitch,
        AUDIO_PITCH_RANGE.min,
        AUDIO_PITCH_RANGE.max,
      ),
    ),
    volume:
      Math.round(
        clampNumber(
          settings.volume ?? fallback.volume,
          VOLUME_RANGE.min,
          VOLUME_RANGE.max,
        ) * 100,
      ) / 100,
    outputFormat,
    mp3Bitrate: sanitizeMp3Bitrate(settings.mp3Bitrate ?? fallback.mp3Bitrate),
    sampleRate: AUDIO_SAMPLE_RATES.includes(settings.sampleRate as never)
      ? sanitizeAudioSampleRate(settings.sampleRate)
      : fallback.sampleRate,
    tailPaddingMs: Math.round(
      clampNumber(
        settings.tailPaddingMs ?? fallback.tailPaddingMs,
        AUDIO_TAIL_RANGE.min,
        AUDIO_TAIL_RANGE.max,
      ),
    ),
    splitMode,
    splitAudio: splitMode !== "none",
    targetPartMinutes:
      Math.round(clampNumber(settings.targetPartMinutes ?? fallback.targetPartMinutes, 1, 30) * 10) /
      10,
    preferSourceSections: splitMode === "source-sections",
    paragraphPauseMultiplier:
      Math.round(
        clampNumber(
          settings.paragraphPauseMultiplier ?? fallback.paragraphPauseMultiplier,
          1,
          6,
        ) * 10,
      ) / 10,
    sentencePauseMultiplier:
      Math.round(
        clampNumber(
          settings.sentencePauseMultiplier ?? fallback.sentencePauseMultiplier,
          1,
          4,
        ) * 10,
      ) / 10,
    punctuationMode,
    includeCleanedText: Boolean(
      settings.includeCleanedText ?? fallback.includeCleanedText,
    ),
    includeMorseTranscript: Boolean(
      settings.includeMorseTranscript ?? fallback.includeMorseTranscript,
    ),
    includeManifest: Boolean(settings.includeManifest ?? fallback.includeManifest),
    includeSettings: Boolean(settings.includeSettings ?? fallback.includeSettings),
    includeReadme: Boolean(settings.includeReadme ?? fallback.includeReadme),
  };
}

export function applyBookPreset(
  presetName: BookExportPresetName,
): BookExportSettings {
  return sanitizeBookExportSettings(BOOK_EXPORT_PRESETS[presetName]);
}

export function describeBookExportSettings(settings: BookExportSettings) {
  const format =
    settings.outputFormat === "mp3"
      ? `MP3 ${settings.mp3Bitrate} kbps`
      : `WAV ${settings.sampleRate} Hz`;
  const split =
    settings.splitMode === "source-sections"
      ? `source-section parts with ${settings.targetPartMinutes} minute fallback`
      : settings.splitMode === "duration"
        ? `${settings.targetPartMinutes} minute target parts`
        : "single audio file";
  const tone = getAudioPresetShortLabel(settings.tonePreset);
  return `${settings.charWpm}/${settings.farnsworthWpm} WPM, ${tone}, ${format}, ${split}.`;
}

export function settingsMatchBookPreset(settings: BookExportSettings) {
  const preset = applyBookPreset(settings.presetName);
  const keys = Object.keys(preset) as Array<keyof BookExportSettings>;
  return keys.every((key) => settings[key] === preset[key]);
}
