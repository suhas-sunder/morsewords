import type {
  MorseVideoBackgroundStyle,
  MorseVideoIntensity,
  MorseVideoResolution,
  MorseVideoSettings,
  MorseVideoTextDisplayMode,
  MorseVideoVisualStyle,
} from "./morseVideoTypes";

export const MORSE_VIDEO_VISUAL_STYLE_DETAILS: Record<
  MorseVideoVisualStyle,
  { label: string; description: string }
> = {
  lightbulb: {
    label: "Lightbulb signal",
    description: "A compact flashing bulb signal with optional text overlays.",
  },
  dot: {
    label: "Dot signal",
    description: "A minimal flashing dot signal with optional text overlays.",
  },
  "full-frame": {
    label: "Full-frame flash",
    description: "The whole video frame changes brightness on marks.",
  },
  "morse-text": {
    label: "Animated Morse signal",
    description: "Recent Morse symbols become the main visual focus.",
  },
};

export const MORSE_VIDEO_RESOLUTION_LABELS: Record<
  MorseVideoResolution,
  string
> = {
  "720p": "720p (1280 x 720)",
  "1080p": "1080p (1920 x 1080)",
  "1440p": "1440p (2560 x 1440)",
  "4k": "4K (3840 x 2160)",
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

export const MORSE_VIDEO_TEXT_DISPLAY_LABELS: Record<
  MorseVideoTextDisplayMode,
  string
> = {
  none: "No text",
  morse: "Morse symbols",
  text: "Plain text",
  both: "Morse + plain text",
};

export function describeMorseVideoSettings(settings: MorseVideoSettings) {
  const style = MORSE_VIDEO_VISUAL_STYLE_DETAILS[settings.visualStyle].label;
  const audio = settings.includeAudioTrack ? "audio track on" : "silent video";
  const layers = [
    settings.showVisualSignal ? "visual signal on" : "visual signal off",
    settings.showMorseSymbols ? "Morse symbols on" : "Morse symbols off",
    settings.showPlainText ? "plain text on" : "plain text off",
    settings.showBranding ? "branding on" : "branding off",
  ].join(", ");
  return `${style}, ${settings.resolution}, ${MORSE_VIDEO_BACKGROUND_LABELS[settings.backgroundStyle]}, ${MORSE_VIDEO_INTENSITY_LABELS[settings.intensity].toLowerCase()} intensity, ${audio}, ${layers}, ${settings.targetPartMinutes} minute target parts.`;
}
