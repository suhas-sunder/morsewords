import { expect, test } from "@playwright/test";

import { textToMorse } from "../../app/client/components/shared/morseUtils";
import {
  buildMorseVideoExportFramePlan,
  buildMorseVideoTimelineFromMorse,
  getMorseVideoFrameSize,
  getMorseVideoPreviewWordWindowLimit,
  getMorseVideoRecordingOptions,
} from "../../app/client/components/shared/video/morseVideoRenderer";
import { DEFAULT_MORSE_VIDEO_SETTINGS } from "../../app/client/components/shared/video/morseVideoTypes";

const AUDIO_SETTINGS = {
  charWpm: 18,
  farnsworthWpm: 12,
  tailPaddingMs: 600,
};

function buildTimeline(text: string) {
  return buildMorseVideoTimelineFromMorse(
    textToMorse(text, { wordSeparator: "spaces" }),
    AUDIO_SETTINGS,
    text,
  );
}

test.describe("Morse video export parity", () => {
  test("export frame plan uses preview word windows and active highlight data", () => {
    const settings = {
      ...DEFAULT_MORSE_VIDEO_SETTINGS,
      backgroundStyle: "warm-morsewords" as const,
      resolution: "720p" as const,
    };
    const timeline = buildTimeline("SOS HELP");
    const elapsedMs =
      (timeline.events.find((event) => event.type === "mark")?.startMs ?? 0) + 1;
    const frame = getMorseVideoFrameSize(settings.resolution);
    const plan = buildMorseVideoExportFramePlan({
      elapsedMs,
      frame,
      settings,
      timeline,
    });

    expect(frame).toEqual({ height: 720, width: 1280 });
    expect(plan.layout.wordWindowLimit).toBe(
      getMorseVideoPreviewWordWindowLimit({
        fullscreen: false,
        signalVisible: true,
        textLayerCount: 2,
      }),
    );
    expect(plan.activeHighlight).toEqual({
      activeWord: true,
      roundedContainer: true,
    });
    expect(plan.frameState.bulbActive).toBe(true);
    expect(plan.frameState.wordWindow.some((word) => word.active)).toBe(true);
    expect(plan.frameState.morseWindow).toContain(" / ");
  });

  test("1080p export plan and recorder options use native sharp dimensions", () => {
    const settings = {
      ...DEFAULT_MORSE_VIDEO_SETTINGS,
      resolution: "1080p" as const,
    };
    const frame = getMorseVideoFrameSize(settings.resolution);
    const recordingOptions = getMorseVideoRecordingOptions({
      frame,
      includeAudioTrack: true,
      mimeType: "video/webm;codecs=vp9,opus",
    });

    expect(frame).toEqual({ height: 1080, width: 1920 });
    expect(recordingOptions).toEqual({
      audioBitsPerSecond: 128_000,
      mimeType: "video/webm;codecs=vp9,opus",
      videoBitsPerSecond: 9_000_000,
    });
  });
});
