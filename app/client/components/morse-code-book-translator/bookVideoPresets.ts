import type {
  BookVideoBackgroundStyle,
  BookVideoIntensity,
  BookVideoResolution,
  BookVideoSettings,
  BookVideoVisualStyle,
} from "./bookVideoTypes";

export const BOOK_VIDEO_VISUAL_STYLE_DETAILS: Record<
  BookVideoVisualStyle,
  { label: string; description: string }
> = {
  lightbulb: {
    label: "Lightbulb",
    description: "A compact bulb signal beside the Morse text.",
  },
  dot: {
    label: "Dot",
    description: "A minimal dot indicator for clean practice clips.",
  },
  "full-frame": {
    label: "Full-frame flash",
    description: "The whole video frame changes brightness on marks.",
  },
  "morse-text": {
    label: "Animated Morse text",
    description: "Recent Morse symbols become the main visual focus.",
  },
};

export const BOOK_VIDEO_RESOLUTION_LABELS: Record<BookVideoResolution, string> = {
  "720p": "720p",
  "1080p": "1080p",
};

export const BOOK_VIDEO_BACKGROUND_LABELS: Record<
  BookVideoBackgroundStyle,
  string
> = {
  "site-theme": "Match site theme",
  "warm-morsewords": "Light MorseWords",
  "dark-morsewords": "Dark MorseWords",
};

export const BOOK_VIDEO_INTENSITY_LABELS: Record<BookVideoIntensity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function describeBookVideoSettings(settings: BookVideoSettings) {
  const style = BOOK_VIDEO_VISUAL_STYLE_DETAILS[settings.visualStyle].label;
  const audio = settings.includeAudioTrack ? "audio track on" : "silent video";
  const overlay = settings.showMorseOverlay
    ? "Morse overlay on"
    : "Morse overlay off";
  return `${style}, ${settings.resolution}, ${BOOK_VIDEO_BACKGROUND_LABELS[settings.backgroundStyle]}, ${BOOK_VIDEO_INTENSITY_LABELS[settings.intensity].toLowerCase()} intensity, ${audio}, ${overlay}, ${settings.targetPartMinutes} minute target parts.`;
}
