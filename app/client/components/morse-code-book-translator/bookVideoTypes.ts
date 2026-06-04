export {
  DEFAULT_MORSE_VIDEO_SETTINGS as DEFAULT_BOOK_VIDEO_SETTINGS,
  MORSE_VIDEO_BACKGROUND_STYLES as BOOK_VIDEO_BACKGROUND_STYLES,
  MORSE_VIDEO_INTENSITIES as BOOK_VIDEO_INTENSITIES,
  MORSE_VIDEO_RESOLUTIONS as BOOK_VIDEO_RESOLUTIONS,
  MORSE_VIDEO_TEXT_DISPLAY_MODES as BOOK_VIDEO_TEXT_DISPLAY_MODES,
  MORSE_VIDEO_VISUAL_STYLES as BOOK_VIDEO_VISUAL_STYLES,
  isMorseVideoBackgroundStyle as isBookVideoBackgroundStyle,
  isMorseVideoIntensity as isBookVideoIntensity,
  isMorseVideoResolution as isBookVideoResolution,
  isMorseVideoTextDisplayMode as isBookVideoTextDisplayMode,
  isMorseVideoVisualStyle as isBookVideoVisualStyle,
  sanitizeMorseVideoSettings as sanitizeBookVideoSettings,
} from "~/client/components/shared/video/morseVideoTypes";

export type {
  MorseVideoBackgroundStyle as BookVideoBackgroundStyle,
  MorseVideoIntensity as BookVideoIntensity,
  MorseVideoResolution as BookVideoResolution,
  MorseVideoSettings as BookVideoSettings,
  MorseVideoTextDisplayMode as BookVideoTextDisplayMode,
  MorseVideoVisualStyle as BookVideoVisualStyle,
} from "~/client/components/shared/video/morseVideoTypes";
