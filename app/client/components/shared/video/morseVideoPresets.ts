import type {
  MorseVideoBackgroundStyle,
  MorseVideoIntensity,
  MorseVideoResolution,
  MorseVideoSettings,
  MorseVideoVisualStyle,
} from "./morseVideoTypes";

export const MORSE_VIDEO_VISUAL_STYLE_DETAILS: Record<
  MorseVideoVisualStyle,
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

export const MORSE_VIDEO_RESOLUTION_LABELS: Record<
  MorseVideoResolution,
  string
> = {
  "720p": "720p",
  "1080p": "1080p",
};

export const MORSE_VIDEO_BACKGROUND_LABELS: Record<
  MorseVideoBackgroundStyle,
  string
> = {
  "site-theme": "Match site theme",
  "warm-morsewords": "Warm MorseWords",
  "dark-morsewords": "Dark MorseWords",
};

export const MORSE_VIDEO_INTENSITY_LABELS: Record<
  MorseVideoIntensity,
  string
> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function describeMorseVideoSettings(settings: MorseVideoSettings) {
  const style = MORSE_VIDEO_VISUAL_STYLE_DETAILS[settings.visualStyle].label;
  const audio = settings.includeAudioTrack ? "audio track on" : "silent video";
  const overlay = settings.showMorseOverlay
    ? "Morse overlay on"
    : "Morse overlay off";
  return `${style}, ${settings.resolution}, ${MORSE_VIDEO_BACKGROUND_LABELS[settings.backgroundStyle]}, ${MORSE_VIDEO_INTENSITY_LABELS[settings.intensity].toLowerCase()} intensity, ${audio}, ${overlay}, ${settings.targetPartMinutes} minute target parts.`;
}
