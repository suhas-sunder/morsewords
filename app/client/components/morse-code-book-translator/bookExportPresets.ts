import {
  AUDIO_ATTACK_RANGE,
  AUDIO_PITCH_RANGE,
  AUDIO_LEAD_IN_RANGE,
  AUDIO_RELEASE_RANGE,
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
import { BOOK_DEFAULT_PART_TARGET_MINUTES } from "./bookExportSafety";

export const BOOK_EXPORT_PRESET_NAMES = [
  "Reader Quick Start",
  "Long Listen",
  "Practice Copy",
  "Faithful Source",
] as const satisfies readonly BookExportPresetName[];

export const BOOK_EXPORT_FORMATS = ["mp3", "wav"] as const;
export const BOOK_PUNCTUATION_MODES = ["preserve", "simplify"] as const;
export const BOOK_SPLIT_MODES = [
  "none",
  "duration",
  "custom",
] as const satisfies readonly BookSplitMode[];
export const BOOK_TARGET_PART_MINUTE_OPTIONS = [5, 10, 15, 30, 45, 60] as const;
export const BOOK_CUSTOM_PART_MINUTES_MIN = 1;
export const BOOK_CUSTOM_PART_MINUTES_MAX = 240;

export const BOOK_EXPORT_PRESET_DETAILS: Record<
  BookExportPresetName,
  { description: string; bestFor: string }
> = {
  "Reader Quick Start": {
    description:
      "Compact audio settings for turning a chapter or short book into listenable Morse audio.",
    bestFor: "Most first downloads",
  },
  "Long Listen": {
    description:
      "A softer tone with fewer transcript extras for extended listening.",
    bestFor: "Long books and relaxed listening",
  },
  "Practice Copy": {
    description:
      "Slower Farnsworth spacing and transcript options for copy-practice sessions.",
    bestFor: "Training and review",
  },
  "Faithful Source": {
    description:
      "Preserves supported punctuation and source sections when possible.",
    bestFor: "Closer source structure",
  },
  "Archive Export": {
    description:
      "Legacy internal preset retained for compatibility with older saved settings.",
    bestFor: "Legacy saved settings",
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
    attackMs: 8,
    releaseMs: 12,
    outputFormat: "mp3",
    mp3Bitrate: 32,
    sampleRate: 44100,
    leadInMs: 0,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: BOOK_DEFAULT_PART_TARGET_MINUTES,
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
    attackMs: 10,
    releaseMs: 14,
    outputFormat: "mp3",
    mp3Bitrate: 32,
    sampleRate: 44100,
    leadInMs: 0,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: BOOK_DEFAULT_PART_TARGET_MINUTES,
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
    attackMs: 8,
    releaseMs: 12,
    outputFormat: "mp3",
    mp3Bitrate: 48,
    sampleRate: 44100,
    leadInMs: 0,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: BOOK_DEFAULT_PART_TARGET_MINUTES,
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
    attackMs: 12,
    releaseMs: 18,
    outputFormat: "mp3",
    mp3Bitrate: 64,
    sampleRate: 44100,
    leadInMs: 0,
    tailPaddingMs: 180,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: BOOK_DEFAULT_PART_TARGET_MINUTES,
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
    attackMs: 10,
    releaseMs: 14,
    outputFormat: "wav",
    mp3Bitrate: 64,
    sampleRate: 48000,
    leadInMs: 0,
    tailPaddingMs: 220,
    splitMode: "none",
    splitAudio: false,
    targetPartMinutes: BOOK_DEFAULT_PART_TARGET_MINUTES,
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
  return (
    typeof value === "string" &&
    (BOOK_EXPORT_PRESET_NAMES as readonly string[]).includes(value)
  );
}

export function isBookSplitMode(
  value: unknown,
): value is (typeof BOOK_SPLIT_MODES)[number] {
  return typeof value === "string" && BOOK_SPLIT_MODES.includes(value as never);
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
  const outputFormat: BookExportFormat = BOOK_EXPORT_FORMATS.includes(
    settings.outputFormat as BookExportFormat,
  )
    ? (settings.outputFormat as BookExportFormat)
    : fallback.outputFormat;
  const punctuationMode: BookPunctuationMode =
    settings.punctuationMode === "preserve" ||
    settings.punctuationMode === "simplify"
      ? settings.punctuationMode
      : fallback.punctuationMode;
  const rawSplitMode = settings.splitMode as unknown;
  const legacySourceSections = rawSplitMode === "source-sections";
  const splitMode = legacySourceSections
    ? "duration"
    : isBookSplitMode(rawSplitMode)
      ? rawSplitMode
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
    attackMs: Math.round(
      clampNumber(
        settings.attackMs ?? fallback.attackMs,
        AUDIO_ATTACK_RANGE.min,
        AUDIO_ATTACK_RANGE.max,
      ),
    ),
    releaseMs: Math.round(
      clampNumber(
        settings.releaseMs ?? fallback.releaseMs,
        AUDIO_RELEASE_RANGE.min,
        AUDIO_RELEASE_RANGE.max,
      ),
    ),
    outputFormat,
    mp3Bitrate: sanitizeMp3Bitrate(settings.mp3Bitrate ?? fallback.mp3Bitrate),
    sampleRate: AUDIO_SAMPLE_RATES.includes(settings.sampleRate as never)
      ? sanitizeAudioSampleRate(settings.sampleRate)
      : fallback.sampleRate,
    leadInMs: Math.round(
      clampNumber(
        settings.leadInMs ?? fallback.leadInMs,
        AUDIO_LEAD_IN_RANGE.min,
        AUDIO_LEAD_IN_RANGE.max,
      ),
    ),
    tailPaddingMs: Math.round(
      clampNumber(
        settings.tailPaddingMs ?? fallback.tailPaddingMs,
        AUDIO_TAIL_RANGE.min,
        AUDIO_TAIL_RANGE.max,
      ),
    ),
    splitMode,
    splitAudio: splitMode !== "none",
    targetPartMinutes: sanitizeTargetPartMinutes(
      settings.targetPartMinutes ?? fallback.targetPartMinutes,
      splitMode,
    ),
    preferSourceSections: Boolean(
      settings.preferSourceSections ?? fallback.preferSourceSections,
    ),
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

function sanitizeTargetPartMinutes(value: number, splitMode: BookSplitMode) {
  if (splitMode === "custom") {
    return clampNumber(
      value,
      BOOK_CUSTOM_PART_MINUTES_MIN,
      BOOK_CUSTOM_PART_MINUTES_MAX,
    );
  }
  const clamped = clampNumber(value, 5, 60);
  return BOOK_TARGET_PART_MINUTE_OPTIONS.reduce((best, option) =>
    Math.abs(option - clamped) < Math.abs(best - clamped) ? option : best,
  );
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
    settings.splitMode === "duration"
      ? `${settings.targetPartMinutes} minute target parts`
      : settings.splitMode === "custom"
        ? `custom ${settings.targetPartMinutes} minute target parts`
      : "single audio file";
  const tone = getAudioPresetShortLabel(settings.tonePreset);
  const leadIn = settings.leadInMs > 0 ? `, ${settings.leadInMs}ms lead-in` : "";
  return `${settings.charWpm}/${settings.farnsworthWpm} WPM, ${tone}, ${format}, ${split}${leadIn}.`;
}

export function settingsMatchBookPreset(settings: BookExportSettings) {
  const preset = applyBookPreset(settings.presetName);
  const keys = Object.keys(preset) as Array<keyof BookExportSettings>;
  return keys.every((key) => settings[key] === preset[key]);
}
