import {
  buildMorseVideoTimelineFromMorse,
  getMorseVideoFrameSize,
  recordMorseVideoCanvas,
  type MorseVideoAudioSettings,
  type ResolvedMorseVideoBackgroundStyle,
} from "./morseVideoRenderer";
import type { MorseVideoFormatSupport } from "./morseVideoSupport";
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
  support: MorseVideoFormatSupport;
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
  try {
    await waitForMorseVideoFonts();
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
    const expectedContainer = `video/${support.extension}`;
    if (!blob.type.toLowerCase().startsWith(expectedContainer)) {
      throw new Error(
        "The browser returned a different video container than requested.",
      );
    }

    return { blob, durationMs: timeline.durationMs };
  } finally {
    // Release the backing frame buffer before a later sequential part starts.
    canvas.width = 1;
    canvas.height = 1;
  }
}

async function waitForMorseVideoFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const fonts = document.fonts;
  let timeoutId: number | null = null;
  try {
    await Promise.race([
      Promise.all([
        fonts.load('700 64px "Space Mono"'),
        fonts.load('800 64px "Space Grotesk"'),
        fonts.ready,
      ]),
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(resolve, 2_000);
      }),
    ]);
  } catch {
    // Browser font loading failures should not block an otherwise valid export.
  } finally {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  }
}
