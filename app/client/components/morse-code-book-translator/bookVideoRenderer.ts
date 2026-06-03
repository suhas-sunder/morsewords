import { buildBookSignalEvents } from "./bookBundleExport";
import { buildMorseTranscript } from "./bookDurationEstimate";
import type { BookExportSettings } from "./bookExportTypes";
import type { BookVideoSettings } from "./bookVideoTypes";

export {
  getMorseVideoFrameRate as getBookVideoFrameRate,
  getMorseVideoFrameSize as getBookVideoFrameSize,
  recordMorseVideoCanvas as recordBookVideoCanvasBase,
  renderMorseVideoFrame as renderBookVideoFrameBase,
} from "~/client/components/shared/video/morseVideoRenderer";
export type {
  MorseVideoFrameSize as BookVideoFrameSize,
  MorseVideoTimeline as BookVideoTimeline,
  ResolvedMorseVideoBackgroundStyle as ResolvedBookVideoBackgroundStyle,
} from "~/client/components/shared/video/morseVideoRenderer";

import {
  recordMorseVideoCanvas,
  renderMorseVideoFrame,
  type MorseVideoAudioSettings,
  type MorseVideoTimedEvent,
  type MorseVideoTimeline,
  type ResolvedMorseVideoBackgroundStyle,
} from "~/client/components/shared/video/morseVideoRenderer";

const MIN_VIDEO_MS = 600;

export function buildBookVideoTimeline(
  text: string,
  settings: BookExportSettings,
): MorseVideoTimeline {
  const events = buildBookSignalEvents(text, settings);
  const timedEvents: MorseVideoTimedEvent[] = [];
  let cursorMs = 0;

  for (const event of events) {
    const startMs = cursorMs;
    cursorMs += Math.max(0, event.ms);
    timedEvents.push({
      type: event.type,
      startMs,
      endMs: cursorMs,
      symbol: event.type === "mark" ? event.symbol : undefined,
    });
  }

  const tailPaddingMs = Math.max(0, settings.tailPaddingMs ?? 0);
  return {
    events: timedEvents,
    morse: buildMorseTranscript(text),
    durationMs: Math.max(MIN_VIDEO_MS, cursorMs + tailPaddingMs),
    tailPaddingMs,
  };
}

export async function recordBookVideoCanvas({
  canvas,
  exportSettings,
  mimeType,
  resolvedBackgroundStyle,
  settings,
  signal,
  timeline,
  onProgress,
}: {
  canvas: HTMLCanvasElement;
  exportSettings: BookExportSettings;
  mimeType: string;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: BookVideoSettings;
  signal: AbortSignal;
  timeline: MorseVideoTimeline;
  onProgress?: (elapsedMs: number, durationMs: number) => void;
}) {
  return recordMorseVideoCanvas({
    audioSettings: bookExportToVideoAudioSettings(exportSettings),
    canvas,
    mimeType,
    resolvedBackgroundStyle,
    settings,
    signal,
    timeline,
    onProgress,
  });
}

export function renderBookVideoFrame({
  ctx,
  elapsedMs,
  exportSettings,
  frame,
  settings,
  timeline,
  resolvedBackgroundStyle,
}: {
  ctx: CanvasRenderingContext2D;
  elapsedMs: number;
  exportSettings: BookExportSettings;
  frame: { width: number; height: number };
  settings: BookVideoSettings;
  timeline: MorseVideoTimeline;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
}) {
  return renderMorseVideoFrame({
    audioSettings: bookExportToVideoAudioSettings(exportSettings),
    ctx,
    elapsedMs,
    frame,
    settings,
    timeline,
    resolvedBackgroundStyle,
  });
}

function bookExportToVideoAudioSettings(
  settings: BookExportSettings,
): MorseVideoAudioSettings {
  return {
    charWpm: settings.charWpm,
    farnsworthWpm: settings.farnsworthWpm,
    tonePreset: settings.tonePreset,
    pitch: settings.pitch,
    volume: settings.volume,
    sampleRate: settings.sampleRate,
    tailPaddingMs: settings.tailPaddingMs,
  };
}
