import { clampNumber } from "~/client/components/shared/settingsStorage";

export type MorseVideoVisualStyle =
  | "lightbulb"
  | "dot"
  | "full-frame"
  | "morse-text";

export type MorseVideoResolution = "720p" | "1080p";

export type MorseVideoBackgroundStyle =
  | "site-theme"
  | "warm-morsewords"
  | "dark-morsewords";

export type MorseVideoIntensity = "low" | "medium" | "high";

export type MorseVideoTextDisplayMode =
  | "none"
  | "morse"
  | "text"
  | "both";

export type MorseVideoSettings = {
  visualStyle: MorseVideoVisualStyle;
  includeAudioTrack: boolean;
  resolution: MorseVideoResolution;
  backgroundStyle: MorseVideoBackgroundStyle;
  intensity: MorseVideoIntensity;
  showMorseOverlay: boolean;
  textDisplayMode: MorseVideoTextDisplayMode;
  showBranding: boolean;
  targetPartMinutes: number;
};

export const MORSE_VIDEO_VISUAL_STYLES = [
  "lightbulb",
  "dot",
  "full-frame",
  "morse-text",
] as const satisfies readonly MorseVideoVisualStyle[];

export const MORSE_VIDEO_RESOLUTIONS = [
  "720p",
  "1080p",
] as const satisfies readonly MorseVideoResolution[];

export const MORSE_VIDEO_BACKGROUND_STYLES = [
  "site-theme",
  "warm-morsewords",
  "dark-morsewords",
] as const satisfies readonly MorseVideoBackgroundStyle[];

export const MORSE_VIDEO_STANDALONE_BACKGROUND_STYLES = [
  "warm-morsewords",
  "dark-morsewords",
] as const satisfies readonly MorseVideoBackgroundStyle[];

export const MORSE_VIDEO_INTENSITIES = [
  "low",
  "medium",
  "high",
] as const satisfies readonly MorseVideoIntensity[];

export const MORSE_VIDEO_TEXT_DISPLAY_MODES = [
  "none",
  "morse",
  "text",
  "both",
] as const satisfies readonly MorseVideoTextDisplayMode[];

export const DEFAULT_MORSE_VIDEO_SETTINGS: MorseVideoSettings = {
  visualStyle: "lightbulb",
  includeAudioTrack: true,
  resolution: "720p",
  backgroundStyle: "site-theme",
  intensity: "medium",
  showMorseOverlay: true,
  textDisplayMode: "morse",
  showBranding: true,
  targetPartMinutes: 8,
};

export function isMorseVideoVisualStyle(
  value: unknown,
): value is MorseVideoVisualStyle {
  return MORSE_VIDEO_VISUAL_STYLES.includes(value as MorseVideoVisualStyle);
}

export function isMorseVideoResolution(
  value: unknown,
): value is MorseVideoResolution {
  return MORSE_VIDEO_RESOLUTIONS.includes(value as MorseVideoResolution);
}

export function isMorseVideoBackgroundStyle(
  value: unknown,
): value is MorseVideoBackgroundStyle {
  return MORSE_VIDEO_BACKGROUND_STYLES.includes(
    value as MorseVideoBackgroundStyle,
  );
}

export function isMorseVideoIntensity(
  value: unknown,
): value is MorseVideoIntensity {
  return MORSE_VIDEO_INTENSITIES.includes(value as MorseVideoIntensity);
}

export function isMorseVideoTextDisplayMode(
  value: unknown,
): value is MorseVideoTextDisplayMode {
  return MORSE_VIDEO_TEXT_DISPLAY_MODES.includes(
    value as MorseVideoTextDisplayMode,
  );
}

export function sanitizeMorseVideoSettings(
  settings: Partial<MorseVideoSettings>,
): MorseVideoSettings {
  const textDisplayMode = isMorseVideoTextDisplayMode(settings.textDisplayMode)
    ? settings.textDisplayMode
    : settings.showMorseOverlay === false
      ? "none"
      : DEFAULT_MORSE_VIDEO_SETTINGS.textDisplayMode;

  const showMorseOverlay =
    textDisplayMode === "morse" || textDisplayMode === "both";

  return {
    visualStyle: isMorseVideoVisualStyle(settings.visualStyle)
      ? settings.visualStyle
      : DEFAULT_MORSE_VIDEO_SETTINGS.visualStyle,
    includeAudioTrack: Boolean(
      settings.includeAudioTrack ??
        DEFAULT_MORSE_VIDEO_SETTINGS.includeAudioTrack,
    ),
    resolution: isMorseVideoResolution(settings.resolution)
      ? settings.resolution
      : DEFAULT_MORSE_VIDEO_SETTINGS.resolution,
    backgroundStyle: isMorseVideoBackgroundStyle(settings.backgroundStyle)
      ? settings.backgroundStyle
      : DEFAULT_MORSE_VIDEO_SETTINGS.backgroundStyle,
    intensity: isMorseVideoIntensity(settings.intensity)
      ? settings.intensity
      : DEFAULT_MORSE_VIDEO_SETTINGS.intensity,
    showMorseOverlay,
    textDisplayMode,
    showBranding: Boolean(
      settings.showBranding ?? DEFAULT_MORSE_VIDEO_SETTINGS.showBranding,
    ),
    targetPartMinutes:
      Math.round(
        clampNumber(
          settings.targetPartMinutes ??
            DEFAULT_MORSE_VIDEO_SETTINGS.targetPartMinutes,
          1,
          30,
        ) * 10,
      ) / 10,
  };
}
