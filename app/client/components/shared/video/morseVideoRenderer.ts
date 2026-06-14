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
import {
  normalizeTextForMorse,
  TEXT_TO_MORSE,
} from "~/client/components/shared/morseUtils";

import type {
  MorseVideoResolution,
  MorseVideoSettings,
} from "./morseVideoTypes";

const MORSE_DISPLAY_WORD_SEPARATOR = " / ";

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

export type MorseVideoTimelineToken = {
  text: string;
  morse: string;
  word: string;
  wordMorse: string;
  wordIndex: number;
  charIndex: number;
  startMs: number;
  markEndMs: number;
  endMs: number;
};

export type MorseVideoTimeline = {
  events: MorseVideoTimedEvent[];
  morse: string;
  text: string;
  tokens: MorseVideoTimelineToken[];
  durationMs: number;
  tailPaddingMs: number;
};

export type MorseVideoFrameTextState = {
  token: MorseVideoTimelineToken | null;
  morseText: string;
  plainText: string;
  activeCharacter: string;
  activeCharacterMorse: string;
};

export type MorseVideoFrameWordWindowItem = {
  wordIndex: number;
  text: string;
  morse: string;
  active: boolean;
  activeCharacter: string;
  activeCharacterMorse: string;
  activeCharIndex: number;
};

export type MorseVideoFrameWordBatch = {
  batchStartWordIndex: number;
  batchEndWordIndex: number;
  startOffset: number;
  endOffset: number;
  groups: MorseVideoTimelineWordGroup[];
};

export type MorseVideoCanonicalFrameState = {
  activeCharacter: string;
  activeCharacterMorse: string;
  activeMorseToken: MorseVideoTimelineToken | null;
  activePlainText: string;
  activeTimedEvent: MorseVideoTimedEvent | null;
  batchEndWordIndex: number | null;
  batchStartWordIndex: number | null;
  bulbActive: boolean;
  elapsedMs: number;
  morseWindow: string;
  plainTextWindow: string;
  progress: number;
  toneState: "tone" | "gap";
  wordWindow: MorseVideoFrameWordWindowItem[];
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

export type MorseVideoTimelineWordGroup = {
  wordIndex: number;
  text: string;
  morse: string;
};

const FRAME_RATE = 24;
const MIN_VIDEO_MS = 600;
const MIN_READABLE_MORSE_SYMBOLS = 6;

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
  audioSettings: Pick<
    MorseVideoAudioSettings,
    "charWpm" | "farnsworthWpm" | "tailPaddingMs"
  >,
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
  const durationMs = Math.max(MIN_VIDEO_MS, cursorMs + tailPaddingMs);
  return {
    events: timedEvents,
    morse: normalizedMorse,
    text: normalizeFrameText(text),
    tokens: buildMorseVideoTimelineTokens({
      durationMs,
      events: timedEvents,
      text,
    }),
    durationMs,
    tailPaddingMs,
  };
}

export function getMorseVideoActiveToken(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
): MorseVideoTimelineToken | null {
  const tokens = timeline.tokens;
  if (tokens.length === 0) return null;
  const safeElapsed = Math.max(
    0,
    Math.min(elapsedMs, Math.max(0, timeline.durationMs - timeline.tailPaddingMs)),
  );
  return (
    tokens.find(
      (token) => safeElapsed >= token.startMs && safeElapsed < token.endMs,
    ) ??
    tokens.find((token) => safeElapsed < token.startMs) ??
    tokens[tokens.length - 1]
  );
}

export function getMorseVideoFrameTextState(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
): MorseVideoFrameTextState {
  const token = getMorseVideoActiveToken(timeline, elapsedMs);
  if (!token) {
    return {
      token: null,
      morseText: readableMorseExcerpt("", timeline.morse, 72),
      plainText: normalizeFrameText(timeline.text).slice(0, 68),
      activeCharacter: "",
      activeCharacterMorse: "",
    };
  }
  return {
    token,
    morseText: token.wordMorse || token.morse,
    plainText: token.word || token.text,
    activeCharacter: token.text,
    activeCharacterMorse: token.morse,
  };
}

export function getMorseVideoFrameWordWindow(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  limit = 168,
): MorseVideoFrameWordWindowItem[] {
  const activeToken = getMorseVideoActiveToken(timeline, elapsedMs);
  const batch = getMorseVideoFrameWordBatchForActiveToken(
    timeline,
    activeToken,
    limit,
  );
  if (!batch) return [];
  return buildWordWindowItems(batch.groups, activeToken);
}

export function buildMorseVideoFrameWordBatches(
  timeline: MorseVideoTimeline,
  limit = 168,
): MorseVideoFrameWordBatch[] {
  return buildStableWordBatches(buildTimelineWordGroups(timeline), limit);
}

export function getMorseVideoFrameWordBatch(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  limit = 168,
): MorseVideoFrameWordBatch | null {
  return getMorseVideoFrameWordBatchForActiveToken(
    timeline,
    getMorseVideoActiveToken(timeline, elapsedMs),
    limit,
  );
}

function buildWordWindowItems(
  groups: MorseVideoTimelineWordGroup[],
  activeToken: MorseVideoTimelineToken | null,
) {
  const words: MorseVideoFrameWordWindowItem[] = [];

  for (const group of groups) {
    const active = group.wordIndex === activeToken?.wordIndex;

    words.push({
      ...group,
      active,
      activeCharacter: active ? activeToken?.text ?? "" : "",
      activeCharacterMorse: active ? activeToken?.morse ?? "" : "",
      activeCharIndex: active ? activeToken?.charIndex ?? -1 : -1,
    });
  }

  return words;
}

function getMorseVideoFrameWordBatchForActiveToken(
  timeline: MorseVideoTimeline,
  activeToken: MorseVideoTimelineToken | null,
  limit: number,
) {
  const groups = buildTimelineWordGroups(timeline);
  if (groups.length === 0) return null;
  const batches = buildStableWordBatches(groups, limit);
  if (batches.length === 0) return null;
  const activeOffset = groups.findIndex(
    (group) => group.wordIndex === activeToken?.wordIndex,
  );
  const safeActiveOffset = activeOffset >= 0 ? activeOffset : 0;
  return (
    batches.find(
      (batch) =>
        safeActiveOffset >= batch.startOffset &&
        safeActiveOffset < batch.endOffset,
    ) ?? batches[0]
  );
}

function buildStableWordBatches(
  groups: MorseVideoTimelineWordGroup[],
  limit: number,
) {
  const textLimit = Math.max(1, limit);
  const morseLimit = Math.max(1, limit * 1.35);
  const batches: MorseVideoFrameWordBatch[] = [];
  let pageStart = 0;

  while (pageStart < groups.length) {
    let pageEnd = pageStart;
    let textLength = 0;
    let morseLength = 0;

    while (pageEnd < groups.length) {
      const group = groups[pageEnd];
      const nextTextLength =
        textLength + group.text.length + (pageEnd > pageStart ? 1 : 0);
      const nextMorseLength =
        morseLength + group.morse.length + (pageEnd > pageStart ? 3 : 0);

      if (
        pageEnd > pageStart &&
        (nextTextLength > textLimit || nextMorseLength > morseLimit)
      ) {
        break;
      }

      textLength = nextTextLength;
      morseLength = nextMorseLength;
      pageEnd += 1;
    }

    const pageGroups = groups.slice(pageStart, pageEnd);
    const firstGroup = pageGroups[0];
    const lastGroup = pageGroups[pageGroups.length - 1];
    batches.push({
      batchStartWordIndex: firstGroup.wordIndex,
      batchEndWordIndex: lastGroup.wordIndex,
      startOffset: pageStart,
      endOffset: pageEnd,
      groups: pageGroups,
    });

    pageStart = Math.max(pageStart + 1, pageEnd);
  }

  return batches;
}

export function getMorseVideoCanonicalFrameState(
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  wordWindowLimit = 168,
): MorseVideoCanonicalFrameState {
  const safeElapsed = Math.max(
    0,
    Math.min(Math.max(0, timeline.durationMs), elapsedMs),
  );
  const activeTimedEvent =
    timeline.events.find(
      (event) => safeElapsed >= event.startMs && safeElapsed < event.endMs,
    ) ?? null;
  const textState = getMorseVideoFrameTextState(timeline, safeElapsed);
  const wordBatch = getMorseVideoFrameWordBatchForActiveToken(
    timeline,
    textState.token,
    wordWindowLimit,
  );
  const wordWindow = wordBatch
    ? buildWordWindowItems(wordBatch.groups, textState.token)
    : [];
  const morseWindow =
    wordWindow.map((word) => word.morse).join(MORSE_DISPLAY_WORD_SEPARATOR) ||
    textState.morseText;
  const plainTextWindow =
    wordWindow.map((word) => word.text).join(" ") || textState.plainText;
  const durationMs = Math.max(1, timeline.durationMs);

  return {
    activeCharacter: textState.activeCharacter,
    activeCharacterMorse: textState.activeCharacterMorse,
    activeMorseToken: textState.token,
    activePlainText: textState.plainText,
    activeTimedEvent,
    batchEndWordIndex: wordBatch?.batchEndWordIndex ?? null,
    batchStartWordIndex: wordBatch?.batchStartWordIndex ?? null,
    bulbActive: activeTimedEvent?.type === "mark",
    elapsedMs: safeElapsed,
    morseWindow,
    plainTextWindow,
    progress: Math.max(0, Math.min(1, safeElapsed / durationMs)),
    toneState: activeTimedEvent?.type === "mark" ? "tone" : "gap",
    wordWindow,
  };
}

function buildTimelineWordGroups(timeline: MorseVideoTimeline) {
  const groups: MorseVideoTimelineWordGroup[] = [];
  for (const token of timeline.tokens) {
    if (!token.word || !token.wordMorse) continue;
    const previous = groups.at(-1);
    if (previous?.wordIndex === token.wordIndex) continue;
    groups.push({
      wordIndex: token.wordIndex,
      text: token.word,
      morse: token.wordMorse,
    });
  }
  return groups;
}

export function buildMorseVideoTimelineTokens({
  durationMs,
  events,
  text,
}: {
  durationMs: number;
  events: MorseVideoTimedEvent[];
  text: string;
}): MorseVideoTimelineToken[] {
  const normalizedWords = normalizeTextForMorse(text)
    .split(/\s+/)
    .filter(Boolean);
  const tokens: Array<Omit<MorseVideoTimelineToken, "endMs">> = [];
  let eventIndex = 0;

  normalizedWords.forEach((word, wordIndex) => {
    const wordCharacters = [...word].filter((character) =>
      Object.prototype.hasOwnProperty.call(TEXT_TO_MORSE, character),
    );
    const wordMorse = wordCharacters
      .map((character) => TEXT_TO_MORSE[character])
      .filter(Boolean)
      .join(" ");

    wordCharacters.forEach((character, charIndex) => {
      const morse = TEXT_TO_MORSE[character];
      if (!morse) return;
      const symbolEvents: MorseVideoTimedEvent[] = [];

      for (const expectedSymbol of morse) {
        while (
          eventIndex < events.length &&
          (events[eventIndex].type !== "mark" ||
            events[eventIndex].symbol !== expectedSymbol)
        ) {
          eventIndex += 1;
        }
        const markEvent = events[eventIndex];
        if (!markEvent || markEvent.type !== "mark") break;
        symbolEvents.push(markEvent);
        eventIndex += 1;
      }

      if (symbolEvents.length === 0) return;
      tokens.push({
        text: character,
        morse,
        word,
        wordMorse,
        wordIndex,
        charIndex,
        startMs: symbolEvents[0].startMs,
        markEndMs: symbolEvents[symbolEvents.length - 1].endMs,
      });
    });
  });

  return tokens.map((token, index) => {
    const nextToken = tokens[index + 1];
    return {
      ...token,
      endMs: nextToken?.startMs ?? Math.max(token.markEndMs, durationMs),
    };
  });
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
  const frameState = getMorseVideoCanonicalFrameState(timeline, elapsedMs);
  const active = frameState.bulbActive;
  const flashFrame =
    settings.showVisualSignal && settings.visualStyle === "full-frame" && active;
  const background = flashFrame ? palette.flashBackground : palette.background;
  const text = flashFrame ? palette.flashText : palette.text;
  const accent = flashFrame ? palette.flashAccent : palette.accent;
  const muted = flashFrame ? palette.flashMuted : palette.muted;
  const padding = Math.round(frame.width * 0.045);

  ctx.clearRect(0, 0, frame.width, frame.height);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, frame.width, frame.height);

  if (settings.showVisualSignal) {
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
        settings,
      );
    } else {
      drawLightbulb(ctx, frame, active, accent, muted, settings.intensity);
    }
  }

  if (settings.visualStyle !== "morse-text" || !settings.showVisualSignal) {
    drawTextDisplay(ctx, frame, timeline, elapsedMs, settings, text, muted, padding);
  }

  if (settings.showBranding) {
    drawFrameBranding(ctx, frame, muted, padding);
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
  settings: MorseVideoSettings,
) {
  const textState = getMorseVideoFrameTextState(timeline, elapsedMs);
  const wordWindow = getMorseVideoFrameWordWindow(timeline, elapsedMs, 168);
  const symbols =
    wordWindow.map((word) => word.morse).join(MORSE_DISPLAY_WORD_SEPARATOR) ||
    textState.morseText ||
    recentMorseSymbols(timeline, elapsedMs, 44);
  const maxWidth = frame.width * 0.84;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = symbols ? text : muted;
  ctx.font = `${Math.round(frame.width * 0.05)}px "Space Mono", monospace`;
  if (wordWindow.length > 0) {
    drawCenteredWordWindow(
      ctx,
      wordWindow,
      "morse",
      frame.width / 2,
      settings.showPlainText ? frame.height * 0.42 : frame.height * 0.5,
      maxWidth,
      frame.height * 0.062,
      settings.showPlainText ? 2 : 3,
      text,
      accent,
    );
  } else {
    ctx.fillText(
      symbols || "...",
      frame.width / 2,
      settings.showPlainText ? frame.height * 0.42 : frame.height * 0.5,
      maxWidth,
    );
  }
  if (settings.showPlainText) {
    ctx.fillStyle = muted;
    ctx.font = `${Math.round(frame.width * 0.028)}px "Space Grotesk", sans-serif`;
    if (wordWindow.length > 0) {
      drawCenteredWordWindow(
        ctx,
        wordWindow,
        "plain",
        frame.width / 2,
        frame.height * 0.63,
        maxWidth,
        frame.height * 0.052,
        3,
        muted,
        accent,
      );
    } else {
      drawCenteredWrappedText(
        ctx,
        currentTextExcerpt(timeline, elapsedMs, 132) || textState.plainText,
        frame.width / 2,
        frame.height * 0.63,
        maxWidth,
        frame.height * 0.052,
        3,
      );
    }
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
  const signalVisible =
    settings.showVisualSignal && settings.visualStyle !== "morse-text";
  const wordWindow = getMorseVideoFrameWordWindow(
    timeline,
    elapsedMs,
    signalVisible ? 168 : 220,
  );
  const rows: Array<{ text: string; kind: "morse" | "plain" }> = [];
  const textState = getMorseVideoFrameTextState(timeline, elapsedMs);
  if (settings.showMorseSymbols) {
    rows.push({
      kind: "morse",
      text:
        wordWindow.map((word) => word.morse).join(MORSE_DISPLAY_WORD_SEPARATOR) ||
        textState.morseText,
    });
  }
  if (settings.showPlainText) {
    rows.push({
      kind: "plain",
      text:
        wordWindow.map((word) => word.text).join(" ") ||
        currentTextExcerpt(timeline, elapsedMs, signalVisible ? 168 : 220) ||
        textState.plainText,
    });
  }
  const visibleRows = rows.filter((row) => row.text);
  if (visibleRows.length === 0) return;

  const firstLineY =
    signalVisible
      ? visibleRows.length === 1
        ? frame.height * 0.66
        : frame.height * 0.62
      : visibleRows.length === 1
        ? frame.height * 0.52
        : frame.height * 0.47;
  const lineGap = frame.height * (signalVisible ? 0.074 : 0.12);
  const maxWidth = frame.width - padding * 2;

  ctx.fillStyle = muted;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  visibleRows.forEach((row, index) => {
    const isMorseRow = row.kind === "morse";
    const scale = signalVisible
      ? isMorseRow
        ? 0.036
        : 0.032
      : isMorseRow
        ? visibleRows.length === 1
          ? 0.068
          : 0.058
        : visibleRows.length === 1
          ? 0.058
          : 0.048;
    ctx.font = `${Math.round(frame.width * scale)}px "${
      isMorseRow ? "Space Mono" : "Space Grotesk"
    }", ${isMorseRow ? "monospace" : "sans-serif"}`;
    if (wordWindow.length > 0) {
      drawCenteredWordWindow(
        ctx,
        wordWindow,
        isMorseRow ? "morse" : "plain",
        frame.width / 2,
        firstLineY + index * lineGap,
        maxWidth,
        frame.height * (signalVisible ? 0.046 : 0.062),
        signalVisible ? 2 : isMorseRow ? 3 : 4,
        muted,
        text,
      );
    } else if (isMorseRow) {
      ctx.fillText(
        row.text,
        frame.width / 2,
        firstLineY + index * lineGap,
        maxWidth,
      );
    } else {
      drawCenteredWrappedText(
        ctx,
        row.text,
        frame.width / 2,
        firstLineY + index * lineGap,
        maxWidth,
        frame.height * (signalVisible ? 0.046 : 0.062),
        signalVisible ? 2 : 4,
      );
    }
  });
  ctx.fillStyle = text;
  ctx.textAlign = "left";
}

function drawCenteredWordWindow(
  ctx: CanvasRenderingContext2D,
  words: MorseVideoFrameWordWindowItem[],
  kind: "morse" | "plain",
  centerX: number,
  centerY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  normalFill: string,
  activeFill: string,
) {
  const separator = kind === "morse" ? MORSE_DISPLAY_WORD_SEPARATOR : " ";
  const parts = words.map((word) => ({
    active: word.active,
    text: kind === "morse" ? word.morse : word.text,
  }));
  const lines: Array<typeof parts> = [];
  let currentLine: typeof parts = [];
  let currentText = "";

  for (const part of parts) {
    const candidate = currentText
      ? `${currentText}${separator}${part.text}`
      : part.text;
    if (currentLine.length > 0 && measureCanvasTextWidth(ctx, candidate) > maxWidth) {
      lines.push(currentLine);
      if (lines.length >= maxLines) break;
      currentLine = [part];
      currentText = part.text;
    } else {
      currentLine.push(part);
      currentText = candidate;
    }
  }
  if (lines.length < maxLines && currentLine.length > 0) {
    lines.push(currentLine);
  }

  const offset = ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, lineIndex) => {
    const lineText = line.map((part) => part.text).join(separator);
    const separatorWidth = measureCanvasTextWidth(ctx, separator);
    const totalWidth = measureCanvasTextWidth(ctx, lineText);
    let x = centerX - totalWidth / 2;
    const y = centerY - offset + lineIndex * lineHeight;

    line.forEach((part) => {
      ctx.fillStyle = part.active ? activeFill : normalFill;
      ctx.fillText(part.text, x, y, maxWidth);
      x += measureCanvasTextWidth(ctx, part.text) + separatorWidth;
    });
  });
}

function drawFrameBranding(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  muted: string,
  padding: number,
) {
  ctx.fillStyle = muted;
  ctx.font = `${Math.round(frame.width * 0.016)}px "Space Mono", monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("www.morsewords.com", padding, frame.height - padding * 0.72);
}

function drawCenteredWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = normalizeFrameText(text).split(" ").filter(Boolean);
  if (words.length === 0) return;
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (measureCanvasTextWidth(ctx, candidate) > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length >= maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (lines.length < maxLines && line) {
    lines.push(line);
  }
  const renderedText = lines.join(" ");
  if (renderedText.length < normalizeFrameText(text).length && lines.length > 0) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = `${lines[lastIndex].replace(/\.*$/, "").trimEnd()}...`;
  }
  const offset = ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((wrappedLine, index) => {
    ctx.fillText(wrappedLine, centerX, centerY - offset + index * lineHeight, maxWidth);
  });
}

function measureCanvasTextWidth(ctx: CanvasRenderingContext2D, text: string) {
  if (typeof ctx.measureText === "function") {
    return ctx.measureText(text).width;
  }
  const fontSize = Number.parseFloat(ctx.font) || 16;
  return text.length * fontSize * 0.58;
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
  return readableMorseExcerpt(symbols, timeline.morse, limit);
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
  return readableMorseExcerpt(completed, timeline.morse, limit);
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
  const token = getMorseVideoActiveToken(timeline, elapsedMs);
  const start = Math.max(0, (token?.wordIndex ?? 0) - 4);
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

function readableMorseExcerpt(
  completedSymbols: string,
  fallbackMorse: string,
  limit: number,
) {
  const normalizedCompleted = completedSymbols.trim();
  const normalizedFallback = fallbackMorse.trim().replace(/\s+/g, " ");
  if (
    normalizedCompleted.replace(/\s+/g, "").length <
    MIN_READABLE_MORSE_SYMBOLS
  ) {
    return normalizedFallback.slice(0, limit);
  }
  return normalizedCompleted.slice(
    Math.max(0, normalizedCompleted.length - limit),
  );
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
