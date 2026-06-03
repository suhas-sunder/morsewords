import {
  buildMorseVideoTimelineFromMorse,
  getMorseVideoFrameSize,
  recordMorseVideoCanvas,
  type MorseVideoAudioSettings,
  type ResolvedMorseVideoBackgroundStyle,
} from "./morseVideoRenderer";
import type { MorseVideoSupport } from "./morseVideoSupport";
import type { MorseVideoSettings } from "./morseVideoTypes";

export type MorseVideoBlobResult = {
  blob: Blob;
  durationMs: number;
};

export async function createMorseVideoBlob({
  audioSettings,
  morse,
  text,
  resolvedBackgroundStyle,
  settings,
  signal,
  support,
  onProgress,
}: {
  audioSettings: MorseVideoAudioSettings;
  morse: string;
  text?: string;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
  signal: AbortSignal;
  support: MorseVideoSupport;
  onProgress?: (elapsedMs: number, durationMs: number) => void;
}): Promise<MorseVideoBlobResult> {
  if (!support.supported) {
    throw new Error(support.reason || "Video export is unavailable.");
  }

  if (typeof document === "undefined") {
    throw new Error("Video export runs in a browser window.");
  }

  const frame = getMorseVideoFrameSize(settings.resolution);
  const canvas = document.createElement("canvas");
  canvas.width = frame.width;
  canvas.height = frame.height;

  const timeline = buildMorseVideoTimelineFromMorse(morse, audioSettings, text);
  const blob = await recordMorseVideoCanvas({
    audioSettings,
    canvas,
    mimeType: support.mimeType,
    resolvedBackgroundStyle,
    settings,
    signal,
    timeline,
    onProgress,
  });

  return { blob, durationMs: timeline.durationMs };
}
