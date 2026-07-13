import { clampNumber } from "~/client/components/shared/settingsStorage";
import {
  AUDIO_TONE_PRESETS,
  TRANSLATOR_AUDIO_PRESET_IDS,
  sanitizeAudioTonePreset,
  sanitizeTranslatorAudioPreset as sanitizeTranslatorPresetId,
  type AudioTonePresetId,
  type TranslatorAudioPresetId,
} from "~/client/components/shared/audioPresetRegistry";

export const AUDIO_GENERATOR_PRESETS = AUDIO_TONE_PRESETS;

export const TRANSLATOR_AUDIO_PRESETS = TRANSLATOR_AUDIO_PRESET_IDS;

export const AUDIO_SAMPLE_RATES = [22050, 44100, 48000] as const;
export const MP3_BITRATES = [32, 48, 64, 96, 128, 192, 256] as const;
export const TYPING_DURATIONS = [10, 30, 60, 120, 300, 1800] as const;

export type MorseNumericSettingId =
  | "characterSpeed"
  | "pitch"
  | "volume"
  | "attack"
  | "release";

export type MorseNumericSettingContract = Readonly<{
  defaultValue: number;
  id: MorseNumericSettingId;
  integer: boolean;
  max: number;
  min: number;
  step: number;
  unit: string;
}>;

/** Shared limits for settings that drive the same timing and synthesis engines. */
export const MORSE_NUMERIC_SETTING_CONTRACTS = {
  characterSpeed: {
    id: "characterSpeed",
    min: 5,
    max: 100,
    step: 1,
    defaultValue: 18,
    unit: "WPM",
    integer: true,
  },
  pitch: {
    id: "pitch",
    min: 200,
    max: 1600,
    step: 10,
    defaultValue: 600,
    unit: "Hz",
    integer: true,
  },
  volume: {
    id: "volume",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0.75,
    unit: "",
    integer: false,
  },
  attack: {
    id: "attack",
    min: 0,
    max: 40,
    step: 1,
    defaultValue: 8,
    unit: "ms",
    integer: true,
  },
  release: {
    id: "release",
    min: 0,
    max: 80,
    step: 1,
    defaultValue: 12,
    unit: "ms",
    integer: true,
  },
} as const satisfies Record<MorseNumericSettingId, MorseNumericSettingContract>;

export const CHARACTER_SPEED_RANGE = MORSE_NUMERIC_SETTING_CONTRACTS.characterSpeed;
export const AUDIO_SPEED_RANGE = CHARACTER_SPEED_RANGE;
// Legacy exports preserve route imports while using the canonical contract.
export const TOOL_SPEED_RANGE = CHARACTER_SPEED_RANGE;
export const VISUAL_SPEED_RANGE = CHARACTER_SPEED_RANGE;
export const WORD_TRAINER_SPEED_RANGE = CHARACTER_SPEED_RANGE;
export const AUDIO_PITCH_RANGE = MORSE_NUMERIC_SETTING_CONTRACTS.pitch;
export const TRANSLATOR_PITCH_RANGE = AUDIO_PITCH_RANGE;
export const PRACTICE_PITCH_RANGE = AUDIO_PITCH_RANGE;
export const VOLUME_RANGE = MORSE_NUMERIC_SETTING_CONTRACTS.volume;
export const AUDIO_ATTACK_RANGE = MORSE_NUMERIC_SETTING_CONTRACTS.attack;
export const AUDIO_RELEASE_RANGE = MORSE_NUMERIC_SETTING_CONTRACTS.release;
/** Export-only silence before each generated file. */
export const AUDIO_LEAD_IN_RANGE = { min: 0, max: 2000 } as const;
export const AUDIO_TAIL_RANGE = { min: 0, max: 400 } as const;

export type AudioGeneratorPreset = AudioTonePresetId;
export type TranslatorAudioPreset = TranslatorAudioPresetId;
export type AudioSampleRate = (typeof AUDIO_SAMPLE_RATES)[number];
export type Mp3Bitrate = (typeof MP3_BITRATES)[number];
export type TypingDuration = (typeof TYPING_DURATIONS)[number];

export const MP3_BITRATE_LABELS: Record<Mp3Bitrate, string> = {
  32: "32 kbps - small, good for long Morse audio",
  48: "48 kbps - compact with a little more headroom",
  64: "64 kbps - higher quality Morse tone",
  96: "96 kbps - larger file",
  128: "128 kbps - large for simple Morse tone",
  192: "192 kbps - very large",
  256: "256 kbps - largest",
};

export function isAudioGeneratorPreset(
  value: unknown,
): value is AudioGeneratorPreset {
  return AUDIO_GENERATOR_PRESETS.includes(value as AudioGeneratorPreset);
}

export function isTranslatorAudioPreset(
  value: unknown,
): value is TranslatorAudioPreset {
  return TRANSLATOR_AUDIO_PRESETS.includes(value as TranslatorAudioPreset);
}

export function sanitizeAudioGeneratorPreset(
  value: unknown,
  fallback: AudioGeneratorPreset = "cw_radio",
): AudioGeneratorPreset {
  return sanitizeAudioTonePreset(value, fallback);
}

export function sanitizeTranslatorAudioPreset(
  value: unknown,
  fallback: TranslatorAudioPreset = "cw_radio",
): TranslatorAudioPreset {
  return sanitizeTranslatorPresetId(value, fallback);
}

export function sanitizeAudioSampleRate(value: unknown): AudioSampleRate {
  return AUDIO_SAMPLE_RATES.includes(value as AudioSampleRate)
    ? (value as AudioSampleRate)
    : 44100;
}

export function sanitizeMp3Bitrate(value: unknown): Mp3Bitrate {
  return MP3_BITRATES.includes(value as Mp3Bitrate)
    ? (value as Mp3Bitrate)
    : 128;
}

export function clampFarnsworthWpm(
  value: unknown,
  charWpm: number,
  min = AUDIO_SPEED_RANGE.min,
): number {
  return Math.round(clampNumber(value, min, Math.max(min, charWpm)));
}

export function sanitizeMorseNumericSetting(
  id: MorseNumericSettingId,
  value: unknown,
  max = MORSE_NUMERIC_SETTING_CONTRACTS[id].max,
) {
  const contract = MORSE_NUMERIC_SETTING_CONTRACTS[id];
  const sanitized = clampNumber(value, contract.min, Math.max(contract.min, max));
  return contract.integer ? Math.round(sanitized) : sanitized;
}
