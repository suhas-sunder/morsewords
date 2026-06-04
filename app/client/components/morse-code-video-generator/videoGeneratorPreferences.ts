import {
  clampNumber,
  parseStoredJson,
  safeReadStorage,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";
import { STORAGE_KEYS } from "~/client/components/shared/storageRegistry";
import {
  getAudioPresetDefaults,
  sanitizeAudioTonePreset,
  type AudioTonePresetId,
} from "~/client/components/shared/audioPresetRegistry";
import {
  AUDIO_PITCH_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioSampleRate,
} from "~/client/components/shared/morseSettings";
import {
  DEFAULT_MORSE_VIDEO_SETTINGS,
  sanitizeMorseVideoSettings,
  type MorseVideoSettings,
} from "~/client/components/shared/video/morseVideoTypes";

export const VIDEO_GENERATOR_PREFERENCES_KEY =
  STORAGE_KEYS.videoGeneratorPreferences;

export type VideoGeneratorSourceMode = "text" | "morse";

export type MorseVideoGeneratorPreferences = {
  sourceMode: VideoGeneratorSourceMode;
  videoSettings: MorseVideoSettings;
  charWpm: number;
  farnsworthWpm: number;
  tonePreset: AudioTonePresetId;
  pitch: number;
  volume: number;
  sampleRate: 22050 | 44100 | 48000;
  fileName: string;
};

export const DEFAULT_STANDALONE_VIDEO_SETTINGS: MorseVideoSettings = {
  ...DEFAULT_MORSE_VIDEO_SETTINGS,
  backgroundStyle: "warm-morsewords",
  showMorseSymbols: true,
  showPlainText: false,
  showMorseOverlay: true,
  textDisplayMode: "morse",
  targetPartMinutes: 8,
};

const DEFAULT_AUDIO = getAudioPresetDefaults("cw_radio");

export const DEFAULT_VIDEO_GENERATOR_PREFERENCES: MorseVideoGeneratorPreferences =
  {
    sourceMode: "text",
    videoSettings: DEFAULT_STANDALONE_VIDEO_SETTINGS,
    charWpm: 18,
    farnsworthWpm: 12,
    tonePreset: "cw_radio",
    pitch: DEFAULT_AUDIO.pitchHz,
    volume: DEFAULT_AUDIO.volume,
    sampleRate: 44100,
    fileName: "morse-code-video",
  };

export function loadVideoGeneratorPreferences(): MorseVideoGeneratorPreferences {
  const parsed = parseStoredJson<Partial<MorseVideoGeneratorPreferences>>(
    safeReadStorage(VIDEO_GENERATOR_PREFERENCES_KEY),
    {},
    isPreferenceObject,
  );
  return sanitizeVideoGeneratorPreferences(parsed);
}

export function saveVideoGeneratorPreferences(
  preferences: MorseVideoGeneratorPreferences,
) {
  const payload = sanitizeVideoGeneratorPreferences(preferences);
  return safeWriteStorage(
    VIDEO_GENERATOR_PREFERENCES_KEY,
    JSON.stringify(payload),
  );
}

function sanitizeVideoGeneratorPreferences(
  value: Partial<MorseVideoGeneratorPreferences>,
): MorseVideoGeneratorPreferences {
  const charWpm = Math.round(
    clampNumber(
      value.charWpm ?? DEFAULT_VIDEO_GENERATOR_PREFERENCES.charWpm,
      AUDIO_SPEED_RANGE.min,
      AUDIO_SPEED_RANGE.max,
    ),
  );
  const tonePreset = sanitizeAudioTonePreset(
    value.tonePreset,
    DEFAULT_VIDEO_GENERATOR_PREFERENCES.tonePreset,
    "bookExport",
  );
  const defaults = getAudioPresetDefaults(tonePreset);

  return {
    sourceMode: value.sourceMode === "morse" ? "morse" : "text",
    videoSettings: sanitizeMorseVideoSettings({
      ...DEFAULT_STANDALONE_VIDEO_SETTINGS,
      ...(isPlainObject(value.videoSettings)
        ? (value.videoSettings as Partial<MorseVideoSettings>)
        : {}),
    }),
    charWpm,
    farnsworthWpm: clampFarnsworthWpm(
      value.farnsworthWpm ??
        DEFAULT_VIDEO_GENERATOR_PREFERENCES.farnsworthWpm,
      charWpm,
    ),
    tonePreset,
    pitch: Math.round(
      clampNumber(
        value.pitch ?? defaults.pitchHz,
        AUDIO_PITCH_RANGE.min,
        AUDIO_PITCH_RANGE.max,
      ),
    ),
    volume: clampNumber(value.volume ?? defaults.volume, VOLUME_RANGE.min, VOLUME_RANGE.max),
    sampleRate: sanitizeAudioSampleRate(
      value.sampleRate ?? DEFAULT_VIDEO_GENERATOR_PREFERENCES.sampleRate,
    ),
    fileName:
      typeof value.fileName === "string" && value.fileName.trim()
        ? value.fileName.slice(0, 120)
        : DEFAULT_VIDEO_GENERATOR_PREFERENCES.fileName,
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isPreferenceObject(
  value: unknown,
): value is Partial<MorseVideoGeneratorPreferences> {
  return isPlainObject(value);
}
