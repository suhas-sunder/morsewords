import { clampNumber } from "~/client/components/shared/settingsStorage";

export type BookVideoVisualStyle =
  | "lightbulb"
  | "dot"
  | "full-frame"
  | "morse-text";

export type BookVideoResolution = "720p" | "1080p";

export type BookVideoBackgroundStyle =
  | "site-theme"
  | "warm-morsewords"
  | "dark-morsewords";

export type BookVideoIntensity = "low" | "medium" | "high";

export type BookVideoSettings = {
  visualStyle: BookVideoVisualStyle;
  includeAudioTrack: boolean;
  resolution: BookVideoResolution;
  backgroundStyle: BookVideoBackgroundStyle;
  intensity: BookVideoIntensity;
  showMorseOverlay: boolean;
  showBranding: boolean;
  targetPartMinutes: number;
};

export const BOOK_VIDEO_VISUAL_STYLES = [
  "lightbulb",
  "dot",
  "full-frame",
  "morse-text",
] as const satisfies readonly BookVideoVisualStyle[];

export const BOOK_VIDEO_RESOLUTIONS = [
  "720p",
  "1080p",
] as const satisfies readonly BookVideoResolution[];

export const BOOK_VIDEO_BACKGROUND_STYLES = [
  "site-theme",
  "warm-morsewords",
  "dark-morsewords",
] as const satisfies readonly BookVideoBackgroundStyle[];

export const BOOK_VIDEO_INTENSITIES = [
  "low",
  "medium",
  "high",
] as const satisfies readonly BookVideoIntensity[];

export const DEFAULT_BOOK_VIDEO_SETTINGS: BookVideoSettings = {
  visualStyle: "lightbulb",
  includeAudioTrack: true,
  resolution: "720p",
  backgroundStyle: "site-theme",
  intensity: "medium",
  showMorseOverlay: true,
  showBranding: true,
  targetPartMinutes: 8,
};

export function isBookVideoVisualStyle(
  value: unknown,
): value is BookVideoVisualStyle {
  return BOOK_VIDEO_VISUAL_STYLES.includes(value as BookVideoVisualStyle);
}

export function isBookVideoResolution(
  value: unknown,
): value is BookVideoResolution {
  return BOOK_VIDEO_RESOLUTIONS.includes(value as BookVideoResolution);
}

export function isBookVideoBackgroundStyle(
  value: unknown,
): value is BookVideoBackgroundStyle {
  return BOOK_VIDEO_BACKGROUND_STYLES.includes(
    value as BookVideoBackgroundStyle,
  );
}

export function isBookVideoIntensity(
  value: unknown,
): value is BookVideoIntensity {
  return BOOK_VIDEO_INTENSITIES.includes(value as BookVideoIntensity);
}

export function sanitizeBookVideoSettings(
  settings: Partial<BookVideoSettings>,
): BookVideoSettings {
  return {
    visualStyle: isBookVideoVisualStyle(settings.visualStyle)
      ? settings.visualStyle
      : DEFAULT_BOOK_VIDEO_SETTINGS.visualStyle,
    includeAudioTrack: Boolean(
      settings.includeAudioTrack ??
        DEFAULT_BOOK_VIDEO_SETTINGS.includeAudioTrack,
    ),
    resolution: isBookVideoResolution(settings.resolution)
      ? settings.resolution
      : DEFAULT_BOOK_VIDEO_SETTINGS.resolution,
    backgroundStyle: isBookVideoBackgroundStyle(settings.backgroundStyle)
      ? settings.backgroundStyle
      : DEFAULT_BOOK_VIDEO_SETTINGS.backgroundStyle,
    intensity: isBookVideoIntensity(settings.intensity)
      ? settings.intensity
      : DEFAULT_BOOK_VIDEO_SETTINGS.intensity,
    showMorseOverlay: Boolean(
      settings.showMorseOverlay ??
        DEFAULT_BOOK_VIDEO_SETTINGS.showMorseOverlay,
    ),
    showBranding: Boolean(
      settings.showBranding ?? DEFAULT_BOOK_VIDEO_SETTINGS.showBranding,
    ),
    targetPartMinutes:
      Math.round(
        clampNumber(
          settings.targetPartMinutes ??
            DEFAULT_BOOK_VIDEO_SETTINGS.targetPartMinutes,
          1,
          30,
        ) * 10,
      ) / 10,
  };
}
