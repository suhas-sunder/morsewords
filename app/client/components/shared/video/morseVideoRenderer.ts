import type { AudioTonePresetId } from "~/client/components/shared/audioPresetRegistry";
import {
  defaultAttackMs,
  defaultReleaseMs,
  oscillatorLayers,
} from "~/client/components/shared/audioToneSynthesis";
import {
  buildMorseEvents,
  normalizePlayableMorse,
} from "~/client/components/shared/morseTiming";

import type {
  MorseVideoResolution,
  MorseVideoSettings,
} from "./morseVideoTypes";

export type ResolvedMorseVideoBackgroundStyle =
  | "warm-morsewords"
  | "dark-morsewords";

export type MorseVideoFrameSize = {
  width: number;
  height: number;
};

export type MorseVideoAudioSettings = {
  charWpm: number;
  farnsworthWpm: number;
  tonePreset: AudioTonePresetId;
  pitch: number;
  volume: number;
  sampleRate: number;
  tailPaddingMs?: number;
};

export type MorseVideoTimedEvent = {
  type: "mark" | "gap";
  startMs: number;
  endMs: number;
  symbol?: "." | "-";
};

export type MorseVideoTimeline = {
  events: MorseVideoTimedEvent[];
  morse: string;
  text: string;
  durationMs: number;
  tailPaddingMs: number;
};

type RenderFrameOptions = {
  audioSettings: MorseVideoAudioSettings;
  ctx: CanvasRenderingContext2D;
  elapsedMs: number;
  frame: MorseVideoFrameSize;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
};

const FRAME_RATE = 24;
const MIN_VIDEO_MS = 600;

export function getMorseVideoFrameSize(
  resolution: MorseVideoResolution,
): MorseVideoFrameSize {
  return resolution === "1080p"
    ? { width: 1920, height: 1080 }
    : { width: 1280, height: 720 };
}

export function getMorseVideoFrameRate() {
  return FRAME_RATE;
}

export function buildMorseVideoTimelineFromMorse(
  morse: string,
  audioSettings: MorseVideoAudioSettings,
  text = "",
): MorseVideoTimeline {
  const normalizedMorse = normalizePlayableMorse(morse);
  const timedEvents: MorseVideoTimedEvent[] = [];
  let cursorMs = 0;

  for (const event of buildMorseEvents(normalizedMorse, {
    charWpm: audioSettings.charWpm,
    farnsworthWpm: audioSettings.farnsworthWpm,
  })) {
    const startMs = cursorMs;
    cursorMs += Math.max(0, event.ms);
    timedEvents.push({
      type: event.type,
      startMs,
      endMs: cursorMs,
      symbol: event.type === "mark" ? event.symbol : undefined,
    });
  }

  const tailPaddingMs = Math.max(0, audioSettings.tailPaddingMs ?? 0);
  return {
    events: timedEvents,
    morse: normalizedMorse,
    text: normalizeFrameText(text),
    durationMs: Math.max(MIN_VIDEO_MS, cursorMs + tailPaddingMs),
    tailPaddingMs,
  };
}

export async function recordMorseVideoCanvas({
  audioSettings,
  canvas,
  mimeType,
  resolvedBackgroundStyle,
  settings,
  signal,
  timeline,
  onProgress,
}: {
  audioSettings: MorseVideoAudioSettings;
  canvas: HTMLCanvasElement;
  mimeType: string;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
  signal: AbortSignal;
  timeline: MorseVideoTimeline;
  onProgress?: (elapsedMs: number, durationMs: number) => void;
}) {
  throwIfAborted(signal);
  const stream = captureCanvasStream(canvas);
  const audio = settings.includeAudioTrack
    ? createMorseVideoAudioTrack({
        audioSettings,
        signal,
      })
    : null;

  const tracks = [
    ...stream.getVideoTracks(),
    ...(audio?.stream.getAudioTracks() ?? []),
  ];
  const recordingStream = new MediaStream(tracks);
  const recorder = new MediaRecorder(recordingStream, { mimeType });
  const chunks: Blob[] = [];

  const recording = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => {
      reject(new Error("Video recording failed in this browser."));
    };
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
  });

  const frame = { width: canvas.width, height: canvas.height };
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    cleanupStream(recordingStream, stream, audio?.context);
    throw new Error("Canvas rendering is unavailable in this browser.");
  }

  const startDelayMs = audio ? 80 : 0;
  renderMorseVideoFrame({
    audioSettings,
    ctx,
    elapsedMs: 0,
    frame,
    settings,
    timeline,
    resolvedBackgroundStyle,
  });

  try {
    recorder.start(1000);
    if (audio) {
      await audio.context.resume();
      scheduleMorseVideoAudio({
        audioSettings,
        context: audio.context,
        destination: audio.destination,
        startAtSeconds: audio.context.currentTime + startDelayMs / 1000,
        timeline,
      });
    }
    await renderRealtimeFrames({
      audioSettings,
      ctx,
      frame,
      resolvedBackgroundStyle,
      settings,
      signal,
      startDelayMs,
      timeline,
      onProgress,
    });
  } catch (error) {
    if (recorder.state !== "inactive") recorder.stop();
    cleanupStream(recordingStream, stream, audio?.context);
    throw error;
  }

  throwIfAborted(signal);
  if (recorder.state !== "inactive") recorder.stop();
  const blob = await recording;
  cleanupStream(recordingStream, stream, audio?.context);
  if (blob.size === 0) {
    throw new Error("Video recording produced an empty file.");
  }
  return blob;
}

export function renderMorseVideoFrame({
  audioSettings,
  ctx,
  elapsedMs,
  frame,
  settings,
  timeline,
  resolvedBackgroundStyle,
}: RenderFrameOptions) {
  const palette = getFramePalette(resolvedBackgroundStyle);
  const active = isMarkActive(timeline, elapsedMs);
  const flashFrame = settings.visualStyle === "full-frame" && active;
  const background = flashFrame ? palette.flashBackground : palette.background;
  const text = flashFrame ? palette.flashText : palette.text;
  const accent = flashFrame ? palette.flashAccent : palette.accent;
  const muted = flashFrame ? palette.flashMuted : palette.muted;
  const padding = Math.round(frame.width * 0.045);

  ctx.clearRect(0, 0, frame.width, frame.height);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, frame.width, frame.height);

  ctx.fillStyle = muted;
  ctx.font = `${Math.round(frame.width * 0.018)}px "Space Mono", monospace`;
  ctx.textBaseline = "top";
  ctx.fillText(
    `${audioSettings.charWpm}/${audioSettings.farnsworthWpm} WPM`,
    padding,
    padding,
  );

  if (settings.showBranding) {
    ctx.textAlign = "right";
    ctx.fillStyle = muted;
    ctx.font = `${Math.round(frame.width * 0.018)}px "Space Mono", monospace`;
    ctx.fillText("www.morsewords.com", frame.width - padding, padding);
    ctx.textAlign = "left";
  }

  if (settings.visualStyle === "dot") {
    drawDot(ctx, frame, active, accent, muted, settings.intensity);
  } else if (settings.visualStyle === "full-frame") {
    drawFullFrameSignal(ctx, frame, active, accent, muted, settings.intensity);
  } else if (settings.visualStyle === "morse-text") {
    drawAnimatedMorseText(
      ctx,
      frame,
      timeline,
      elapsedMs,
      text,
      accent,
      muted,
      settings.textDisplayMode,
    );
  } else {
    drawLightbulb(ctx, frame, active, accent, muted, settings.intensity);
  }

  if (settings.visualStyle !== "morse-text") {
    drawTextDisplay(ctx, frame, timeline, elapsedMs, settings, text, muted, padding);
  }

  ctx.textAlign = "left";
}

function renderRealtimeFrames({
  audioSettings,
  ctx,
  frame,
  resolvedBackgroundStyle,
  settings,
  signal,
  startDelayMs,
  timeline,
  onProgress,
}: {
  audioSettings: MorseVideoAudioSettings;
  ctx: CanvasRenderingContext2D;
  frame: MorseVideoFrameSize;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
  signal: AbortSignal;
  startDelayMs: number;
  timeline: MorseVideoTimeline;
  onProgress?: (elapsedMs: number, durationMs: number) => void;
}) {
  const durationMs = timeline.durationMs;
  const startAt = performance.now() + startDelayMs;
  let lastProgressMs = -1_000;

  return new Promise<void>((resolve, reject) => {
    const step = () => {
      try {
        throwIfAborted(signal);
        const elapsedMs = Math.max(0, performance.now() - startAt);
        renderMorseVideoFrame({
          audioSettings,
          ctx,
          elapsedMs: Math.min(durationMs, elapsedMs),
          frame,
          settings,
          timeline,
          resolvedBackgroundStyle,
        });
        if (elapsedMs - lastProgressMs >= 500 || elapsedMs >= durationMs) {
          lastProgressMs = elapsedMs;
          onProgress?.(Math.min(durationMs, elapsedMs), durationMs);
        }
        if (elapsedMs >= durationMs) {
          resolve();
          return;
        }
        window.requestAnimationFrame(step);
      } catch (error) {
        reject(error);
      }
    };
    window.requestAnimationFrame(step);
  });
}

function captureCanvasStream(canvas: HTMLCanvasElement) {
  const capture = (canvas as HTMLCanvasElement & {
    captureStream?: (frameRate?: number) => MediaStream;
  }).captureStream;
  if (typeof capture !== "function") {
    throw new Error("Canvas video capture is unavailable in this browser.");
  }
  return capture.call(canvas, FRAME_RATE);
}

function createMorseVideoAudioTrack({
  audioSettings,
  signal,
}: {
  audioSettings: MorseVideoAudioSettings;
  signal: AbortSignal;
}) {
  throwIfAborted(signal);
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) {
    throw new Error("Audio tracks are unavailable in this browser.");
  }
  const context = new AudioContextCtor({
    sampleRate: audioSettings.sampleRate,
  });
  const destination = context.createMediaStreamDestination();
  return {
    context,
    destination,
    stream: destination.stream,
  };
}

function scheduleMorseVideoAudio({
  audioSettings,
  context,
  destination,
  startAtSeconds,
  timeline,
}: {
  audioSettings: MorseVideoAudioSettings;
  context: AudioContext;
  destination: MediaStreamAudioDestinationNode;
  startAtSeconds: number;
  timeline: MorseVideoTimeline;
}) {
  const amplitude = Math.max(0, Math.min(1, audioSettings.volume)) * 0.32;
  const attackSeconds = defaultAttackMs(audioSettings.tonePreset) / 1000;
  const releaseSeconds = defaultReleaseMs(audioSettings.tonePreset) / 1000;

  for (const event of timeline.events) {
    if (event.type !== "mark") continue;
    const start = startAtSeconds + event.startMs / 1000;
    const end = startAtSeconds + event.endMs / 1000;
    const duration = Math.max(0.01, end - start);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(
      amplitude,
      start + Math.min(attackSeconds, duration / 2),
    );
    gain.gain.setValueAtTime(
      amplitude,
      Math.max(start, end - Math.min(releaseSeconds, duration / 2)),
    );
    gain.gain.linearRampToValueAtTime(0, end);
    gain.connect(destination);

    for (const layer of oscillatorLayers({
      hz: audioSettings.pitch,
      preset: audioSettings.tonePreset,
    })) {
      const oscillator = context.createOscillator();
      oscillator.type = layer.type;
      oscillator.frequency.setValueAtTime(layer.startHz, start);
      if (layer.endHz) {
        oscillator.frequency.linearRampToValueAtTime(layer.endHz, end);
      }
      const layerGain = context.createGain();
      layerGain.gain.setValueAtTime(layer.gain, start);
      oscillator.connect(layerGain);
      layerGain.connect(gain);
      oscillator.start(start);
      oscillator.stop(end + 0.02);
    }
  }
}

function cleanupStream(
  recordingStream: MediaStream,
  canvasStream: MediaStream,
  context?: AudioContext,
) {
  recordingStream.getTracks().forEach((track) => track.stop());
  canvasStream.getTracks().forEach((track) => track.stop());
  void context?.close().catch(() => undefined);
}

function getFramePalette(
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle,
) {
  if (resolvedBackgroundStyle === "dark-morsewords") {
    return {
      background: "#020617",
      text: "#e0f2fe",
      muted: "#94a3b8",
      accent: "#bae6fd",
      flashBackground: "#e0f2fe",
      flashText: "#08324f",
      flashMuted: "#334155",
      flashAccent: "#08324f",
    };
  }
  return {
    background: "#fffdf8",
    text: "#08324f",
    muted: "#64748b",
    accent: "#38bdf8",
    flashBackground: "#08324f",
    flashText: "#f8fafc",
    flashMuted: "#dbeafe",
    flashAccent: "#bae6fd",
  };
}

function isMarkActive(timeline: MorseVideoTimeline, elapsedMs: number) {
  return timeline.events.some(
    (event) =>
      event.type === "mark" &&
      elapsedMs >= event.startMs &&
      elapsedMs < event.endMs,
  );
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  active: boolean,
  accent: string,
  muted: string,
  intensity: MorseVideoSettings["intensity"],
) {
  const radius = frame.width * (active ? 0.058 : 0.046);
  ctx.fillStyle = active ? accent : withAlpha(muted, intensityAlpha(intensity));
  ctx.beginPath();
  ctx.arc(frame.width / 2, frame.height / 2, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawFullFrameSignal(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  active: boolean,
  accent: string,
  muted: string,
  intensity: MorseVideoSettings["intensity"],
) {
  const radius = frame.width * 0.045;
  ctx.fillStyle = active ? accent : withAlpha(muted, intensityAlpha(intensity));
  ctx.beginPath();
  ctx.arc(frame.width / 2, frame.height / 2, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawAnimatedMorseText(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  text: string,
  accent: string,
  muted: string,
  textDisplayMode: MorseVideoSettings["textDisplayMode"],
) {
  const symbols = recentMorseSymbols(timeline, elapsedMs, 44);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = symbols ? text : muted;
  ctx.font = `${Math.round(frame.width * 0.05)}px "Space Mono", monospace`;
  ctx.fillText(symbols || "...", frame.width / 2, frame.height / 2);
  ctx.fillStyle = accent;
  ctx.font = `${Math.round(frame.width * 0.024)}px "Space Grotesk", sans-serif`;
  ctx.fillText(
    "Morse signal",
    frame.width / 2,
    frame.height / 2 - frame.height * 0.16,
  );
  if (textDisplayMode === "text" || textDisplayMode === "both") {
    ctx.fillStyle = muted;
    ctx.font = `${Math.round(frame.width * 0.024)}px "Space Grotesk", sans-serif`;
    ctx.fillText(
      currentTextExcerpt(timeline, elapsedMs, 58),
      frame.width / 2,
      frame.height / 2 + frame.height * 0.16,
    );
  }
  ctx.textAlign = "left";
}

function drawLightbulb(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  active: boolean,
  accent: string,
  muted: string,
  intensity: MorseVideoSettings["intensity"],
) {
  const centerX = frame.width / 2;
  const centerY = frame.height / 2 - frame.height * 0.02;
  const bulbRadius = frame.width * 0.045;
  ctx.fillStyle = active ? accent : withAlpha(muted, intensityAlpha(intensity));
  ctx.beginPath();
  ctx.arc(centerX, centerY, bulbRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(
    centerX - bulbRadius * 0.45,
    centerY + bulbRadius * 0.8,
    bulbRadius * 0.9,
    bulbRadius * 0.3,
  );
  ctx.fillRect(
    centerX - bulbRadius * 0.28,
    centerY + bulbRadius * 1.18,
    bulbRadius * 0.56,
    bulbRadius * 0.16,
  );
}

function drawTextDisplay(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  settings: MorseVideoSettings,
  text: string,
  muted: string,
  padding: number,
) {
  const mode = settings.textDisplayMode;
  if (mode === "none") return;
  const rows: Array<{ text: string; kind: "morse" | "plain" }> = [];
  if (mode === "morse" || mode === "both") {
    rows.push({
      kind: "morse",
      text: recentMorseExcerpt(timeline, elapsedMs, mode === "both" ? 54 : 72),
    });
  }
  if (mode === "text" || mode === "both") {
    rows.push({
      kind: "plain",
      text: currentTextExcerpt(timeline, elapsedMs, mode === "both" ? 54 : 68),
    });
  }
  const visibleRows = rows.filter((row) => row.text);
  if (visibleRows.length === 0) return;

  const firstLineY =
    visibleRows.length === 1 ? frame.height * 0.66 : frame.height * 0.62;
  const lineGap = frame.height * 0.074;
  const maxWidth = frame.width - padding * 2;

  ctx.fillStyle = muted;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  visibleRows.forEach((row, index) => {
    const isMorseRow = row.kind === "morse";
    ctx.font = `${Math.round(frame.width * (isMorseRow ? 0.032 : 0.03))}px "${
      isMorseRow ? "Space Mono" : "Space Grotesk"
    }", ${isMorseRow ? "monospace" : "sans-serif"}`;
    ctx.fillText(
      row.text,
      frame.width / 2,
      firstLineY + index * lineGap,
      maxWidth,
    );
  });
  ctx.fillStyle = text;
  ctx.textAlign = "left";
}

function recentMorseSymbols(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  limit: number,
) {
  const symbols = timeline.events
    .filter((event) => event.type === "mark" && event.startMs <= elapsedMs)
    .map((event) => event.symbol ?? "")
    .join("");
  return symbols.slice(Math.max(0, symbols.length - limit));
}

function recentMorseExcerpt(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  limit: number,
) {
  const completed = timeline.events
    .filter((event) => event.type === "mark" && event.startMs <= elapsedMs)
    .map((event) => event.symbol ?? "")
    .join("");
  const normalized = completed || timeline.morse.replace(/\s+/g, " ");
  return normalized.slice(Math.max(0, normalized.length - limit));
}

function currentTextExcerpt(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  limit: number,
) {
  const text = normalizeFrameText(timeline.text);
  if (!text) return "";
  const words = text.split(" ").filter(Boolean);
  if (words.length === 0) return "";
  const progress = Math.max(
    0,
    Math.min(1, elapsedMs / Math.max(1, timeline.durationMs - timeline.tailPaddingMs)),
  );
  const start = Math.max(0, Math.floor(progress * words.length) - 5);
  let excerpt = "";
  for (let index = start; index < words.length; index += 1) {
    const candidate = excerpt ? `${excerpt} ${words[index]}` : words[index];
    if (candidate.length > limit && excerpt) break;
    excerpt = candidate;
  }
  return excerpt.length > limit ? `${excerpt.slice(0, limit - 3).trimEnd()}...` : excerpt;
}

function normalizeFrameText(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function intensityAlpha(intensity: MorseVideoSettings["intensity"]) {
  if (intensity === "low") return 0.38;
  if (intensity === "high") return 0.86;
  return 0.62;
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new DOMException("Video download cancelled.", "AbortError");
  }
}
