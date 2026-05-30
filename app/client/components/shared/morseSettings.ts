import { clampNumber } from "~/client/components/shared/settingsStorage";

export const AUDIO_GENERATOR_PRESETS = [
  "cw_radio",
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "sounder",
] as const;

export const TRANSLATOR_AUDIO_PRESETS = [
  "cw_radio",
  "smooth_sine",
  "bright_square",
  "telegraph_sounder",
] as const;

export const AUDIO_SAMPLE_RATES = [22050, 44100, 48000] as const;
export const MP3_BITRATES = [96, 128, 192, 256] as const;
export const TYPING_DURATIONS = [10, 30, 60, 120, 300, 1800] as const;

export const AUDIO_SPEED_RANGE = { min: 5, max: 60 } as const;
export const TOOL_SPEED_RANGE = { min: 5, max: 40 } as const;
export const VISUAL_SPEED_RANGE = { min: 6, max: 30 } as const;
export const WORD_TRAINER_SPEED_RANGE = { min: 5, max: 35 } as const;
export const AUDIO_PITCH_RANGE = { min: 200, max: 1600 } as const;
export const TRANSLATOR_PITCH_RANGE = { min: 300, max: 900 } as const;
export const PRACTICE_PITCH_RANGE = { min: 300, max: 1000 } as const;
export const VOLUME_RANGE = { min: 0, max: 1 } as const;
export const AUDIO_ATTACK_RANGE = { min: 0, max: 40 } as const;
export const AUDIO_RELEASE_RANGE = { min: 0, max: 80 } as const;
export const AUDIO_TAIL_RANGE = { min: 0, max: 400 } as const;

export type AudioGeneratorPreset = (typeof AUDIO_GENERATOR_PRESETS)[number];
export type TranslatorAudioPreset = (typeof TRANSLATOR_AUDIO_PRESETS)[number];
export type AudioSampleRate = (typeof AUDIO_SAMPLE_RATES)[number];
export type Mp3Bitrate = (typeof MP3_BITRATES)[number];
export type TypingDuration = (typeof TYPING_DURATIONS)[number];

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
  return isAudioGeneratorPreset(value) ? value : fallback;
}

export function sanitizeTranslatorAudioPreset(
  value: unknown,
  fallback: TranslatorAudioPreset = "cw_radio",
): TranslatorAudioPreset {
  return isTranslatorAudioPreset(value) ? value : fallback;
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
