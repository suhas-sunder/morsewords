import type { AudioTonePresetId } from "~/client/components/shared/audioPresetRegistry";
import {
  defaultAttackMs,
  defaultReleaseMs,
  oscillatorLayers,
} from "~/client/components/shared/audioToneSynthesis";
import {
  buildMorseTimeline,
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
  displayWindowEndWordIndex: number | null;
  displayWindowStartWordIndex: number | null;
  bulbActive: boolean;
  elapsedMs: number;
  morseWindow: string;
  plainTextWindow: string;
  progress: number;
  toneState: "tone" | "gap";
  wordWindow: MorseVideoFrameWordWindowItem[];
};

type RenderFrameOptions = {
  ctx: CanvasRenderingContext2D;
  elapsedMs: number;
  frame: MorseVideoFrameSize;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
};

export type MorseVideoExportFramePlan = {
  activeHighlight: {
    activeWord: boolean;
    roundedContainer: boolean;
  };
  frame: MorseVideoFrameSize;
  frameState: MorseVideoCanonicalFrameState;
  layout: {
    maxTextWidth: number;
    signalCenterY: number;
    textLineGap: number;
    textStartY: number;
    wordWindowLimit: number;
  };
  resolution: MorseVideoResolution;
};

export type MorseVideoRecordingOptions = {
  audioBitsPerSecond?: number;
  mimeType: string;
  videoBitsPerSecond: number;
};

export type MorseVideoExportProfile = {
  frame: MorseVideoFrameSize;
  /**
   * A practical MediaRecorder target, not a promise that every browser will
   * encode at this rate. It is also used only for conservative planning.
   */
  videoBitsPerSecond: number;
  /**
   * Bound one active canvas/recorder part. Bigger resolutions get shorter
   * parts so a browser never has to retain a long, high-pixel-count render.
   */
  threshold: {
    targetDurationMs: number;
    maxDurationMs: number;
    maxEstimatedBytes: number;
  };
};

export type MorseVideoSceneSnapshot = {
  active: boolean;
  background: {
    color: string;
    height: 1;
    width: 1;
    x: 0;
    y: 0;
  };
  branding: {
    enabled: boolean;
    safeInset: number;
    text: string;
    x: number;
    y: number;
  };
  frameState: Pick<
    MorseVideoCanonicalFrameState,
    | "activeCharacter"
    | "activeCharacterMorse"
    | "batchEndWordIndex"
    | "batchStartWordIndex"
    | "displayWindowEndWordIndex"
    | "displayWindowStartWordIndex"
    | "bulbActive"
    | "toneState"
  >;
  layout: {
    maxTextWidth: number;
    signalCenterY: number;
    textLineGap: number;
    textStartY: number;
    wordWindowLimit: number;
  };
  signal: {
    active: boolean;
    centerX: 0.5;
    centerY: number;
    enabled: boolean;
    style: MorseVideoSettings["visualStyle"];
  };
  text: {
    morseSeparator: "/";
    showMorseSymbols: boolean;
    showPlainText: boolean;
    visibleWindowEndWordIndex: number | null;
    visibleWindowStartWordIndex: number | null;
    words: Array<{
      active: boolean;
      activeCharIndex: number;
      morse: string;
      text: string;
      wordIndex: number;
    }>;
  };
};

type MorseVideoScene = {
  active: boolean;
  background: string;
  framePlan: MorseVideoExportFramePlan;
  muted: string;
  padding: number;
  palette: ReturnType<typeof getFramePalette>;
  snapshot: MorseVideoSceneSnapshot;
  text: string;
};

export type MorseVideoTimelineWordGroup = {
  wordIndex: number;
  text: string;
  morse: string;
};

const FRAME_RATE = 24;
const MIN_VIDEO_MS = 600;
const MIN_READABLE_MORSE_SYMBOLS = 6;
const INLINE_PREVIEW_WORD_WINDOW_LIMIT = 168;
const FULLSCREEN_PREVIEW_WORD_WINDOW_LIMIT = 190;
// Export frames need a bounded visual window rather than the broad preview
// character batch. The four-word lead keeps the active word moving through
// later rows before older content scrolls away, while remaining small enough
// for the canvas to keep a readable long-form display.
const EXPORT_DISPLAY_WINDOW_WORD_LIMIT = 12;
const EXPORT_DISPLAY_WINDOW_LEAD_WORDS = 4;
const AUDIO_BITRATE = 128_000;

const MORSE_VIDEO_EXPORT_PROFILES: Record<
  MorseVideoResolution,
  MorseVideoExportProfile
> = {
  "720p": {
    frame: { width: 1280, height: 720 },
    videoBitsPerSecond: 5_000_000,
    threshold: {
      targetDurationMs: 90_000,
      maxDurationMs: 120_000,
      maxEstimatedBytes: 96 * 1024 * 1024,
    },
  },
  "1080p": {
    frame: { width: 1920, height: 1080 },
    videoBitsPerSecond: 9_000_000,
    threshold: {
      targetDurationMs: 60_000,
      maxDurationMs: 75_000,
      maxEstimatedBytes: 96 * 1024 * 1024,
    },
  },
  "1440p": {
    frame: { width: 2560, height: 1440 },
    videoBitsPerSecond: 16_000_000,
    threshold: {
      targetDurationMs: 35_000,
      maxDurationMs: 45_000,
      maxEstimatedBytes: 96 * 1024 * 1024,
    },
  },
  "4k": {
    frame: { width: 3840, height: 2160 },
    videoBitsPerSecond: 32_000_000,
    threshold: {
      targetDurationMs: 18_000,
      maxDurationMs: 24_000,
      maxEstimatedBytes: 96 * 1024 * 1024,
    },
  },
};

export function getMorseVideoFrameSize(
  resolution: MorseVideoResolution,
): MorseVideoFrameSize {
  const frame = MORSE_VIDEO_EXPORT_PROFILES[resolution].frame;
  return { ...frame };
}

export function getMorseVideoExportProfile(
  resolution: MorseVideoResolution,
): MorseVideoExportProfile {
  const profile = MORSE_VIDEO_EXPORT_PROFILES[resolution];
  return {
    ...profile,
    frame: { ...profile.frame },
    threshold: { ...profile.threshold },
  };
}

function resolutionForFrame(frame: MorseVideoFrameSize): MorseVideoResolution {
  if (frame.width >= 3840 || frame.height >= 2160) return "4k";
  if (frame.width >= 2560 || frame.height >= 1440) return "1440p";
  if (frame.width >= 1920 || frame.height >= 1080) return "1080p";
  return "720p";
}

export function getMorseVideoFrameRate() {
  return FRAME_RATE;
}

export function getMorseVideoPreviewWordWindowLimit({
  fullscreen,
  signalVisible,
  textLayerCount,
}: {
  fullscreen: boolean;
  signalVisible: boolean;
  textLayerCount: number;
}) {
  const base = fullscreen
    ? FULLSCREEN_PREVIEW_WORD_WINDOW_LIMIT
    : INLINE_PREVIEW_WORD_WINDOW_LIMIT;
  if (textLayerCount === 0) return base;
  const freedSignalSpace = signalVisible ? 0 : fullscreen ? 96 : 48;
  const freedTextLayerSpace = textLayerCount === 1 ? (fullscreen ? 96 : 54) : 0;
  return base + freedSignalSpace + freedTextLayerSpace;
}

export function buildMorseVideoExportFramePlan({
  elapsedMs,
  frame,
  settings,
  timeline,
}: {
  elapsedMs: number;
  frame: MorseVideoFrameSize;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
}): MorseVideoExportFramePlan {
  const textLayerCount =
    (settings.showMorseSymbols ? 1 : 0) + (settings.showPlainText ? 1 : 0);
  const signalVisible = settings.showVisualSignal;
  const wordWindowLimit = getMorseVideoPreviewWordWindowLimit({
    fullscreen: false,
    signalVisible,
    textLayerCount,
  });
  const canonicalFrameState = getMorseVideoCanonicalFrameState(
    timeline,
    elapsedMs,
    wordWindowLimit,
  );
  const exportDisplayWindow = buildMorseVideoExportDisplayWindow(
    timeline,
    canonicalFrameState.activeMorseToken,
  );
  const frameState: MorseVideoCanonicalFrameState = {
    ...canonicalFrameState,
    displayWindowEndWordIndex: exportDisplayWindow.endWordIndex,
    displayWindowStartWordIndex: exportDisplayWindow.startWordIndex,
    morseWindow:
      exportDisplayWindow.words
        .map((word) => word.morse)
        .join(MORSE_DISPLAY_WORD_SEPARATOR) || canonicalFrameState.morseWindow,
    plainTextWindow:
      exportDisplayWindow.words.map((word) => word.text).join(" ") ||
      canonicalFrameState.plainTextWindow,
    wordWindow: exportDisplayWindow.words,
  };
  const layout = getPreviewMatchedExportBaselineLayout({
    activeTextRow: frameState.wordWindow.some((word) => word.active),
    frame,
    settings,
    textLayerCount,
  });

  return {
    activeHighlight: {
      activeWord: frameState.wordWindow.some((word) => word.active),
      roundedContainer: true,
    },
    frame,
    frameState,
    layout: {
      maxTextWidth: layout.maxTextWidth,
      signalCenterY: layout.signalCenterY,
      textLineGap: layout.textLineGap,
      textStartY: layout.textStartY,
      wordWindowLimit,
    },
    resolution: settings.resolution,
  };
}

export function getMorseVideoRecordingOptions({
  frame,
  includeAudioTrack,
  mimeType,
}: {
  frame: MorseVideoFrameSize;
  includeAudioTrack: boolean;
  mimeType: string;
}): MorseVideoRecordingOptions {
  return {
    ...(includeAudioTrack ? { audioBitsPerSecond: AUDIO_BITRATE } : {}),
    mimeType,
    videoBitsPerSecond: getMorseVideoExportProfile(
      resolutionForFrame(frame),
    ).videoBitsPerSecond,
  };
}

/**
 * The normalized 16:9 scene for exported frames. The on-page preview keeps
 * its established DOM layout and is intentionally not rendered from this.
 */
export function buildMorseVideoScene({
  elapsedMs,
  frame,
  settings,
  timeline,
  resolvedBackgroundStyle,
}: {
  elapsedMs: number;
  frame: MorseVideoFrameSize;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
}): MorseVideoScene {
  const palette = getFramePalette(resolvedBackgroundStyle);
  const framePlan = buildMorseVideoExportFramePlan({
    elapsedMs,
    frame,
    settings,
    timeline,
  });
  const active = framePlan.frameState.bulbActive;
  const flashFrame =
    settings.showVisualSignal && settings.visualStyle === "full-frame" && active;
  const background = flashFrame ? palette.flashBackground : palette.background;
  const text = flashFrame ? palette.flashText : palette.text;
  const muted = flashFrame ? palette.flashMuted : palette.muted;
  const padding = frame.width * (20 / EXPORT_PREVIEW_VIRTUAL_WIDTH);
  const brandingBaselineY =
    frame.height - frame.width * (20 / EXPORT_PREVIEW_VIRTUAL_WIDTH);
  const normaliseX = (value: number) => roundSceneCoordinate(value / frame.width);
  const normaliseY = (value: number) => roundSceneCoordinate(value / frame.height);

  return {
    active,
    background,
    framePlan,
    muted,
    padding,
    palette,
    text,
    snapshot: {
      active,
      background: {
        color: background,
        height: 1,
        width: 1,
        x: 0,
        y: 0,
      },
      branding: {
        enabled: settings.showBranding,
        safeInset: normaliseX(padding),
        text: "www.morsewords.com",
        x: normaliseX(padding),
        y: normaliseY(brandingBaselineY),
      },
      frameState: {
        activeCharacter: framePlan.frameState.activeCharacter,
        activeCharacterMorse: framePlan.frameState.activeCharacterMorse,
        batchEndWordIndex: framePlan.frameState.batchEndWordIndex,
        batchStartWordIndex: framePlan.frameState.batchStartWordIndex,
        displayWindowEndWordIndex:
          framePlan.frameState.displayWindowEndWordIndex,
        displayWindowStartWordIndex:
          framePlan.frameState.displayWindowStartWordIndex,
        bulbActive: framePlan.frameState.bulbActive,
        toneState: framePlan.frameState.toneState,
      },
      layout: {
        maxTextWidth: normaliseX(framePlan.layout.maxTextWidth),
        signalCenterY: normaliseY(framePlan.layout.signalCenterY),
        textLineGap: normaliseY(framePlan.layout.textLineGap),
        textStartY: normaliseY(framePlan.layout.textStartY),
        wordWindowLimit: framePlan.layout.wordWindowLimit,
      },
      signal: {
        active,
        centerX: 0.5,
        centerY: normaliseY(framePlan.layout.signalCenterY),
        enabled: settings.showVisualSignal,
        style: settings.visualStyle,
      },
      text: {
        morseSeparator: "/",
        showMorseSymbols: settings.showMorseSymbols,
        showPlainText: settings.showPlainText,
        visibleWindowEndWordIndex:
          framePlan.frameState.displayWindowEndWordIndex,
        visibleWindowStartWordIndex:
          framePlan.frameState.displayWindowStartWordIndex,
        words: framePlan.frameState.wordWindow.map((word) => ({
          active: word.active,
          activeCharIndex: word.activeCharIndex,
          morse: word.morse,
          text: word.text,
          wordIndex: word.wordIndex,
        })),
      },
    },
  };
}

/**
 * A resolution-independent export geometry record for deterministic checks.
 */
export function buildMorseVideoSceneSnapshot(options: {
  elapsedMs: number;
  frame: MorseVideoFrameSize;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
}): MorseVideoSceneSnapshot {
  return buildMorseVideoScene(options).snapshot;
}

export function serializeMorseVideoSceneSnapshot(
  snapshot: MorseVideoSceneSnapshot,
) {
  return JSON.stringify(snapshot);
}

function roundSceneCoordinate(value: number) {
  return Number(value.toFixed(6));
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
  const canonicalTimeline = buildMorseTimeline(normalizedMorse, {
    charWpm: audioSettings.charWpm,
    farnsworthWpm: audioSettings.farnsworthWpm,
    tailPaddingMs: audioSettings.tailPaddingMs,
  });
  const timedEvents: MorseVideoTimedEvent[] = canonicalTimeline.events.map(
    (event) => ({
      type: event.type,
      startMs: event.startMs,
      endMs: event.endMs,
      symbol: event.type === "mark" ? event.symbol : undefined,
    }),
  );

  const tailPaddingMs = canonicalTimeline.tailPaddingMs;
  const durationMs = Math.max(MIN_VIDEO_MS, canonicalTimeline.durationMs);
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

/**
 * Export-only viewport selection. The DOM preview keeps its existing broad
 * batch/window behavior; recorded frames use this smaller local word window
 * so wrapped rows progress as the canonical active token advances.
 */
export function buildMorseVideoExportDisplayWindow(
  timeline: MorseVideoTimeline,
  activeToken: MorseVideoTimelineToken | null,
) {
  const groups = buildTimelineWordGroups(timeline);
  if (groups.length === 0) {
    return {
      endWordIndex: null,
      startWordIndex: null,
      words: [] as MorseVideoFrameWordWindowItem[],
    };
  }
  const activeOffset = groups.findIndex(
    (group) => group.wordIndex === activeToken?.wordIndex,
  );
  const safeActiveOffset = activeOffset >= 0 ? activeOffset : 0;
  const maxStart = Math.max(0, groups.length - EXPORT_DISPLAY_WINDOW_WORD_LIMIT);
  const startOffset = Math.min(
    maxStart,
    Math.max(0, safeActiveOffset - EXPORT_DISPLAY_WINDOW_LEAD_WORDS),
  );
  const endOffset = Math.min(
    groups.length,
    startOffset + EXPORT_DISPLAY_WINDOW_WORD_LIMIT,
  );
  const visibleGroups = groups.slice(startOffset, endOffset);

  return {
    endWordIndex: visibleGroups.at(-1)?.wordIndex ?? null,
    startWordIndex: visibleGroups[0]?.wordIndex ?? null,
    words: buildWordWindowItems(visibleGroups, activeToken),
  };
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
    displayWindowEndWordIndex: wordBatch?.batchEndWordIndex ?? null,
    displayWindowStartWordIndex: wordBatch?.batchStartWordIndex ?? null,
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
  let audio: ReturnType<typeof createMorseVideoAudioTrack> | null = null;
  let recordingStream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;
  const chunks: Blob[] = [];

  try {
    audio = settings.includeAudioTrack
      ? createMorseVideoAudioTrack({
          audioSettings,
          signal,
        })
      : null;
    const tracks = [
      ...stream.getVideoTracks(),
      ...(audio?.stream.getAudioTracks() ?? []),
    ];
    recordingStream = new MediaStream(tracks);
    const frame = { width: canvas.width, height: canvas.height };
    const activeRecorder = new MediaRecorder(
      recordingStream,
      getMorseVideoRecordingOptions({
        frame,
        includeAudioTrack: settings.includeAudioTrack,
        mimeType,
      }),
    );
    recorder = activeRecorder;
    const requestedContainerType = mimeType.split(";", 1)[0].toLowerCase();
    const observedChunkTypes = new Set<string>();
    const recording = new Promise<Blob>((resolve, reject) => {
      activeRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          if (event.data.type) {
            observedChunkTypes.add(event.data.type.toLowerCase());
          }
          chunks.push(event.data);
        }
      };
      activeRecorder.onerror = () => {
        reject(new Error("Video recording failed in this browser."));
      };
      activeRecorder.onstop = () => {
        const recorderType = activeRecorder.mimeType?.toLowerCase() || "";
        const observedTypes = [...observedChunkTypes];
        const actualType =
          observedTypes[0] || recorderType || requestedContainerType;
        const hasMismatchedType =
          !actualType.startsWith(requestedContainerType) ||
          observedTypes.some(
            (type) => !type.startsWith(requestedContainerType),
          );
        if (hasMismatchedType) {
          reject(
            new Error(
              "The browser returned a different video container than requested.",
            ),
          );
          return;
        }
        resolve(new Blob(chunks, { type: actualType }));
      };
    });
    void recording.catch(() => undefined);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas rendering is unavailable in this browser.");
    }

    const startDelayMs = audio ? 80 : 0;
    renderMorseVideoFrame({
      ctx,
      elapsedMs: 0,
      frame,
      settings,
      timeline,
      resolvedBackgroundStyle,
    });

    recorder.start(1000);
    if (audio) {
      await resumeVideoAudioContext(audio.context, signal);
      scheduleMorseVideoAudio({
        audioSettings,
        context: audio.context,
        destination: audio.destination,
        startAtSeconds: audio.context.currentTime + startDelayMs / 1000,
        timeline,
      });
    }
    await renderRealtimeFrames({
      ctx,
      frame,
      resolvedBackgroundStyle,
      settings,
      signal,
      startDelayMs,
      timeline,
      onProgress,
    });
    throwIfAborted(signal);
    if (recorder.state !== "inactive") recorder.stop();
    const blob = await recording;
    if (blob.size === 0) {
      throw new Error("Video recording produced an empty file.");
    }
    return blob;
  } finally {
    if (recorder?.state !== "inactive") {
      try {
        recorder?.stop();
      } catch {
        // The recorder may already be stopping after a browser-side failure.
      }
    }
    cleanupStream(recordingStream, stream, audio?.context);
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onerror = null;
      recorder.onstop = null;
    }
    chunks.length = 0;
  }
}

export function renderMorseVideoFrame({
  ctx,
  elapsedMs,
  frame,
  settings,
  timeline,
  resolvedBackgroundStyle,
}: RenderFrameOptions) {
  const scene = buildMorseVideoScene({
    elapsedMs,
    frame,
    settings,
    timeline,
    resolvedBackgroundStyle,
  });

  ctx.clearRect(0, 0, frame.width, frame.height);
  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = "high";
  drawPreviewMatchedExportFrame({
    active: scene.active,
    ctx,
    elapsedMs,
    frame,
    framePlan: scene.framePlan,
    resolvedBackgroundStyle,
    settings,
    timeline,
  });

  ctx.textAlign = "left";
}

function renderRealtimeFrames({
  ctx,
  frame,
  resolvedBackgroundStyle,
  settings,
  signal,
  startDelayMs,
  timeline,
  onProgress,
}: {
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
    let animationFrameId: number | null = null;
    let fallbackTimerId: number | null = null;
    let settled = false;

    const clearScheduledFrame = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (fallbackTimerId !== null) {
        window.clearTimeout(fallbackTimerId);
        fallbackTimerId = null;
      }
    };

    const finish = (error?: unknown) => {
      if (settled) return;
      settled = true;
      clearScheduledFrame();
      if (error !== undefined) reject(error);
      else resolve();
    };

    const scheduleFrame = () => {
      let invoked = false;
      const invoke = () => {
        if (invoked || settled) return;
        invoked = true;
        clearScheduledFrame();
        step();
      };
      animationFrameId = window.requestAnimationFrame(invoke);
      // Browsers pause requestAnimationFrame in hidden/background tabs. A
      // timer keeps the real-time recorder moving without synthesizing fake
      // elapsed time; background timer throttling may make export slower, but
      // it will not leave the job permanently stuck.
      fallbackTimerId = window.setTimeout(invoke, Math.ceil(1000 / FRAME_RATE));
    };

    const step = () => {
      try {
        throwIfAborted(signal);
        const elapsedMs = Math.max(0, performance.now() - startAt);
        renderMorseVideoFrame({
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
          finish();
          return;
        }
        scheduleFrame();
      } catch (error) {
        finish(error);
      }
    };
    scheduleFrame();
  });
}

async function resumeVideoAudioContext(
  context: AudioContext,
  signal: AbortSignal,
) {
  let timeoutId: number | null = null;
  const resumed = await Promise.race([
    context.resume().then(() => context.state === "running"),
    new Promise<boolean>((resolve) => {
      timeoutId = window.setTimeout(
        () => resolve(context.state === "running"),
        2_000,
      );
    }),
  ]).finally(() => {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  });
  throwIfAborted(signal);
  if (!resumed) {
    throw new Error(
      "The browser did not start the optional video audio track. Turn off Include audio and retry.",
    );
  }
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
  try {
    const destination = context.createMediaStreamDestination();
    return {
      context,
      destination,
      stream: destination.stream,
    };
  } catch (error) {
    void context.close().catch(() => undefined);
    throw error;
  }
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
  recordingStream: MediaStream | null,
  canvasStream: MediaStream,
  context?: AudioContext,
) {
  recordingStream?.getTracks().forEach((track) => track.stop());
  canvasStream.getTracks().forEach((track) => track.stop());
  void context?.close().catch(() => undefined);
}

// The protected inline preview has a 1056 × 594 desktop content box at the
// 1440px reference viewport. These values reproduce that existing DOM/CSS
// composition in the export canvas only; the preview itself remains DOM based.
const EXPORT_PREVIEW_VIRTUAL_WIDTH = 1056;
const EXPORT_PREVIEW_VIRTUAL_HEIGHT = 594;
const EXPORT_PREVIEW_FRAME_PADDING = 24;
const EXPORT_PREVIEW_CONTENT_PADDING_TOP = 8;
const EXPORT_PREVIEW_CONTENT_PADDING_BOTTOM = 36;
const EXPORT_PREVIEW_TEXT_WIDTH =
  EXPORT_PREVIEW_VIRTUAL_WIDTH - EXPORT_PREVIEW_FRAME_PADDING * 2;
const EXPORT_PREVIEW_BRANDING_BASELINE_Y = 574;
const EXPORT_LIGHTBULB_PATH =
  "M7 20h4c0 1.1-.9 2-2 2s-2-.9-2-2m-2-1h8v-2H5zm11.5-9.5c0 3.82-2.66 5.86-3.77 6.5H5.27c-1.11-.64-3.77-2.68-3.77-6.5C1.5 5.36 4.86 2 9 2s7.5 3.36 7.5 7.5m4.87-2.13L20 8l1.37.63L22 10l.63-1.37L24 8l-1.37-.63L22 6zM19 6l.94-2.06L22 3l-2.06-.94L19 0l-.94 2.06L16 3l2.06.94z";

type ExportPreviewTextKind = "morse" | "plain";

type ExportPreviewTextStyle = {
  activeCharacterPaddingX: number;
  activeWordPaddingX: number;
  activeWordPaddingY: number;
  font: string;
  fontSize: number;
  lineHeight: number;
  separatorMargin: number;
  separatorWidth: number;
  wordMargin: number;
};

type ExportPreviewWordMetrics = {
  activeSegmentIndex: number;
  advance: number;
  boxWidth: number;
  internalSeparatorWidth: number;
  segmentWidths: number[];
  segments: string[];
};

type ExportPreviewLineItem = {
  metrics: ExportPreviewWordMetrics;
  word: MorseVideoFrameWordWindowItem;
};

type ExportPreviewLine = {
  items: ExportPreviewLineItem[];
  width: number;
};

type ExportPreviewRow = {
  kind: ExportPreviewTextKind;
  lineHeights: number[];
  lines: ExportPreviewLine[];
  style: ExportPreviewTextStyle;
};

let exportLightbulbPath: Path2D | null | undefined;

function getPreviewMatchedExportBaselineLayout({
  activeTextRow,
  frame,
  settings,
  textLayerCount,
}: {
  activeTextRow: boolean;
  frame: MorseVideoFrameSize;
  settings: MorseVideoSettings;
  textLayerCount: number;
}) {
  const scale = frame.width / EXPORT_PREVIEW_VIRTUAL_WIDTH;
  const visualHeight = settings.showVisualSignal
    ? exportPreviewVisualHeight(settings.visualStyle, 1)
    : 0;
  const textRowHeight = 45 + (activeTextRow ? 4 : 0);
  const textHeight =
    textLayerCount * textRowHeight + Math.max(0, textLayerCount - 1) * 8;
  const visualGap = visualHeight > 0 && textLayerCount > 0 ? 16 : 0;
  const totalHeight = visualHeight + visualGap + textHeight;
  const contentHeight =
    EXPORT_PREVIEW_VIRTUAL_HEIGHT - EXPORT_PREVIEW_FRAME_PADDING * 2;
  const usableContentHeight =
    contentHeight -
    EXPORT_PREVIEW_CONTENT_PADDING_TOP -
    EXPORT_PREVIEW_CONTENT_PADDING_BOTTOM;
  const top =
    EXPORT_PREVIEW_FRAME_PADDING +
    EXPORT_PREVIEW_CONTENT_PADDING_TOP +
    (usableContentHeight - totalHeight) / 2;
  const textTop = top + visualHeight + visualGap;

  return {
    maxTextWidth: EXPORT_PREVIEW_TEXT_WIDTH * scale,
    signalCenterY: (top + visualHeight / 2) * scale,
    textLineGap: (textRowHeight + 8) * scale,
    textStartY:
      (textLayerCount > 0 ? textTop + textRowHeight / 2 : top + totalHeight / 2) *
      scale,
  };
}

/**
 * Canvas cannot capture the protected DOM preview. This export-only painter
 * mirrors its established desktop inline 16:9 layout in a virtual 1120×630
 * surface, then scales that scene to the selected output resolution.
 */
function drawPreviewMatchedExportFrame({
  active,
  ctx,
  elapsedMs,
  frame,
  framePlan,
  resolvedBackgroundStyle,
  settings,
  timeline,
}: {
  active: boolean;
  ctx: CanvasRenderingContext2D;
  elapsedMs: number;
  frame: MorseVideoFrameSize;
  framePlan: MorseVideoExportFramePlan;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
}) {
  const scale = frame.width / EXPORT_PREVIEW_VIRTUAL_WIDTH;
  const fullFrameActive =
    settings.showVisualSignal && settings.visualStyle === "full-frame" && active;
  const palette = getExportPreviewPalette({
    fullFrameActive,
    resolvedBackgroundStyle,
  });

  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = palette.background;
  ctx.fillRect(
    0,
    0,
    EXPORT_PREVIEW_VIRTUAL_WIDTH,
    frame.height / scale,
  );

  let composition = buildExportPreviewComposition({
    ctx,
    elapsedMs,
    fontScale: 1,
    framePlan,
    settings,
    timeline,
  });
  const availableHeight =
    EXPORT_PREVIEW_VIRTUAL_HEIGHT - EXPORT_PREVIEW_FRAME_PADDING * 2;
  if (composition.height > availableHeight) {
    composition = buildExportPreviewComposition({
      ctx,
      elapsedMs,
      fontScale: availableHeight / composition.height,
      framePlan,
      settings,
      timeline,
    });
  }

  const usableContentHeight =
    availableHeight -
    EXPORT_PREVIEW_CONTENT_PADDING_TOP -
    EXPORT_PREVIEW_CONTENT_PADDING_BOTTOM;
  let cursorY =
    EXPORT_PREVIEW_FRAME_PADDING +
    EXPORT_PREVIEW_CONTENT_PADDING_TOP +
    (usableContentHeight - composition.height) / 2;
  if (composition.visualHeight > 0) {
    drawExportPreviewVisual({
      active,
      centerY: cursorY + composition.visualHeight / 2,
      ctx,
      fontScale: composition.fontScale,
      framePlan,
      palette,
      settings,
      timeline,
    });
    cursorY += composition.visualHeight;
    if (composition.rows.length > 0) cursorY += composition.visualGap;
  }

  composition.rows.forEach((row, rowIndex) => {
    cursorY = drawExportPreviewRow({
      ctx,
      palette,
      row,
      top: cursorY,
    });
    if (rowIndex < composition.rows.length - 1) {
      cursorY += composition.rowGap;
    }
  });

  if (settings.showBranding) {
    drawExportPreviewBranding(ctx, palette.text);
  }
  ctx.restore();
}

function buildExportPreviewComposition({
  ctx,
  elapsedMs,
  fontScale,
  framePlan,
  settings,
  timeline,
}: {
  ctx: CanvasRenderingContext2D;
  elapsedMs: number;
  fontScale: number;
  framePlan: MorseVideoExportFramePlan;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
}) {
  const rows = buildExportPreviewRows({
    ctx,
    elapsedMs,
    fontScale,
    framePlan,
    settings,
    timeline,
  });
  const visualHeight = settings.showVisualSignal
    ? exportPreviewVisualHeight(settings.visualStyle, fontScale)
    : 0;
  const visualGap = visualHeight > 0 && rows.length > 0 ? 16 * fontScale : 0;
  const rowGap = rows.length > 1 ? 8 * fontScale : 0;
  const rowHeight = rows.reduce(
    (total, row) =>
      total + row.lineHeights.reduce((lineTotal, height) => lineTotal + height, 0),
    0,
  );

  return {
    fontScale,
    height: visualHeight + visualGap + rowHeight + rowGap * Math.max(0, rows.length - 1),
    rowGap,
    rows,
    visualGap,
    visualHeight,
  };
}

function buildExportPreviewRows({
  ctx,
  elapsedMs,
  fontScale,
  framePlan,
  settings,
  timeline,
}: {
  ctx: CanvasRenderingContext2D;
  elapsedMs: number;
  fontScale: number;
  framePlan: MorseVideoExportFramePlan;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
}) {
  const rows: ExportPreviewRow[] = [];
  const textState = getMorseVideoFrameTextState(timeline, elapsedMs);
  const maxWidth = EXPORT_PREVIEW_TEXT_WIDTH;
  const plainTextLength =
    framePlan.frameState.plainTextWindow.length || textState.plainText.length;

  if (settings.showMorseSymbols) {
    const row = createExportPreviewRow({
      ctx,
      fallback: framePlan.frameState.morseWindow || textState.morseText,
      fontScale,
      kind: "morse",
      maxWidth,
      plainTextLength,
      words: framePlan.frameState.wordWindow,
    });
    if (row) rows.push(row);
  }
  if (settings.showPlainText) {
    const row = createExportPreviewRow({
      ctx,
      fallback:
        framePlan.frameState.plainTextWindow ||
        currentTextExcerpt(timeline, elapsedMs, 220) ||
        textState.plainText,
      fontScale,
      kind: "plain",
      maxWidth,
      plainTextLength,
      words: framePlan.frameState.wordWindow,
    });
    if (row) rows.push(row);
  }

  return rows;
}

function createExportPreviewRow({
  ctx,
  fallback,
  fontScale,
  kind,
  maxWidth,
  plainTextLength,
  words,
}: {
  ctx: CanvasRenderingContext2D;
  fallback: string;
  fontScale: number;
  kind: ExportPreviewTextKind;
  maxWidth: number;
  plainTextLength: number;
  words: MorseVideoFrameWordWindowItem[];
}): ExportPreviewRow | null {
  const visibleWords = words.filter((word) =>
    Boolean(kind === "morse" ? word.morse : word.text),
  );
  const rowWords =
    visibleWords.length > 0
      ? visibleWords
      : fallback.trim()
        ? [
            {
              active: false,
              activeCharacter: "",
              activeCharacterMorse: "",
              activeCharIndex: -1,
              morse: kind === "morse" ? fallback : "",
              text: kind === "plain" ? fallback : "",
              wordIndex: 0,
            },
          ]
        : [];
  if (rowWords.length === 0) return null;

  const style = getExportPreviewTextStyle({
    fontScale,
    kind,
    plainTextLength,
  });
  ctx.font = style.font;
  const lines = layoutExportPreviewWords(ctx, rowWords, kind, style, maxWidth);
  return {
    kind,
    lineHeights: lines.map((line) =>
      line.items.some(({ word }) => word.active)
        ? style.lineHeight + style.activeWordPaddingY * 2
        : style.lineHeight,
    ),
    lines,
    style,
  };
}

function getExportPreviewTextStyle({
  fontScale,
  kind,
  plainTextLength,
}: {
  fontScale: number;
  kind: ExportPreviewTextKind;
  plainTextLength: number;
}): ExportPreviewTextStyle {
  const fontSize =
    kind === "morse"
      ? 36 * fontScale
      : (plainTextLength > 44 ? 30 : 36) * fontScale;
  return {
    activeCharacterPaddingX: 4 * fontScale,
    activeWordPaddingX: 6 * fontScale,
    activeWordPaddingY: 2 * fontScale,
    font: `${kind === "morse" ? 700 : 800} ${fontSize}px "${
      kind === "morse" ? "Space Mono" : "DM Sans"
    }", ${kind === "morse" ? "monospace" : "sans-serif"}`,
    fontSize,
    lineHeight: fontSize * 1.25,
    separatorMargin: kind === "morse" ? fontSize * 0.1 : 4 * fontScale,
    separatorWidth: 0,
    wordMargin: 4 * fontScale,
  };
}

function layoutExportPreviewWords(
  ctx: CanvasRenderingContext2D,
  words: MorseVideoFrameWordWindowItem[],
  kind: ExportPreviewTextKind,
  style: ExportPreviewTextStyle,
  maxWidth: number,
) {
  const separatorWidth =
    measureCanvasTextWidth(ctx, "/") + style.separatorMargin * 2;
  style.separatorWidth = separatorWidth;
  const lines: ExportPreviewLine[] = [];
  let currentItems: ExportPreviewLineItem[] = [];
  let currentWidth = 0;

  words.forEach((word) => {
    const metrics = measureExportPreviewWord(ctx, word, kind, style);
    const separator = currentItems.length > 0 ? separatorWidth : 0;
    if (
      currentItems.length > 0 &&
      currentWidth + separator + metrics.advance > maxWidth
    ) {
      lines.push({ items: currentItems, width: currentWidth });
      currentItems = [{ metrics, word }];
      currentWidth = metrics.advance;
      return;
    }
    currentItems.push({ metrics, word });
    currentWidth += separator + metrics.advance;
  });
  if (currentItems.length > 0) {
    lines.push({ items: currentItems, width: currentWidth });
  }
  return lines;
}

function measureExportPreviewWord(
  ctx: CanvasRenderingContext2D,
  word: MorseVideoFrameWordWindowItem,
  kind: ExportPreviewTextKind,
  style: ExportPreviewTextStyle,
): ExportPreviewWordMetrics {
  const source = kind === "morse" ? word.morse : word.text;
  const segments =
    kind === "morse"
      ? source.split(" ").filter(Boolean)
      : Array.from(source);
  const activeSegmentIndex = word.active ? word.activeCharIndex : -1;
  const internalSeparatorWidth =
    kind === "morse" ? measureCanvasTextWidth(ctx, " ") : 0;
  const segmentWidths = segments.map((segment) => measureCanvasTextWidth(ctx, segment));
  let contentWidth = segmentWidths.reduce((total, width) => total + width, 0);
  if (segments.length > 1) {
    contentWidth += internalSeparatorWidth * (segments.length - 1);
  }
  if (activeSegmentIndex >= 0 && activeSegmentIndex < segments.length) {
    contentWidth += style.activeCharacterPaddingX * 2;
  }
  const boxWidth =
    contentWidth + (word.active ? style.activeWordPaddingX * 2 : 0);

  return {
    activeSegmentIndex,
    advance: boxWidth + style.wordMargin * 2,
    boxWidth,
    internalSeparatorWidth,
    segmentWidths,
    segments,
  };
}

function drawExportPreviewRow({
  ctx,
  palette,
  row,
  top,
}: {
  ctx: CanvasRenderingContext2D;
  palette: ReturnType<typeof getExportPreviewPalette>;
  row: ExportPreviewRow;
  top: number;
}) {
  let cursorY = top;
  ctx.font = row.style.font;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  row.lines.forEach((line, lineIndex) => {
    const lineHeight = row.lineHeights[lineIndex] ?? row.style.lineHeight;
    drawExportPreviewLine({
      centerY: cursorY + lineHeight / 2,
      ctx,
      line,
      lineHeight,
      palette,
      row,
    });
    cursorY += lineHeight;
  });
  return cursorY;
}

function drawExportPreviewLine({
  centerY,
  ctx,
  line,
  lineHeight,
  palette,
  row,
}: {
  centerY: number;
  ctx: CanvasRenderingContext2D;
  line: ExportPreviewLine;
  lineHeight: number;
  palette: ReturnType<typeof getExportPreviewPalette>;
  row: ExportPreviewRow;
}) {
  let x = (EXPORT_PREVIEW_VIRTUAL_WIDTH - line.width) / 2;
  line.items.forEach((item, index) => {
    if (index > 0) {
      ctx.save();
      ctx.globalAlpha = row.kind === "morse" ? 0.7 : 0.55;
      ctx.fillStyle = palette.text;
      ctx.fillText("/", x + row.style.separatorMargin, centerY);
      ctx.restore();
      x += row.style.separatorWidth;
    }
    drawExportPreviewWord({
      centerY,
      ctx,
      item,
      lineHeight,
      palette,
      row,
      x,
    });
    x += item.metrics.advance;
  });
}

function drawExportPreviewWord({
  centerY,
  ctx,
  item,
  lineHeight,
  palette,
  row,
  x,
}: {
  centerY: number;
  ctx: CanvasRenderingContext2D;
  item: ExportPreviewLineItem;
  lineHeight: number;
  palette: ReturnType<typeof getExportPreviewPalette>;
  row: ExportPreviewRow;
  x: number;
}) {
  const { metrics, word } = item;
  const boxX = x + row.style.wordMargin;
  const wordBoxHeight = lineHeight;
  const wordBoxY = centerY - wordBoxHeight / 2;
  const contentX = boxX + (word.active ? row.style.activeWordPaddingX : 0);

  if (word.active) {
    drawExportRoundedRect({
      ctx,
      fill: palette.activeWordFill,
      height: wordBoxHeight,
      lineWidth: Math.max(1, row.style.fontSize / 36),
      radius: 8 * (row.style.wordMargin / 4),
      stroke: palette.activeWordStroke,
      width: metrics.boxWidth,
      x: boxX,
      y: wordBoxY,
    });
  }

  let segmentX = contentX;
  metrics.segments.forEach((segment, index) => {
    const segmentWidth = metrics.segmentWidths[index];
    const activeCharacter =
      word.active && metrics.activeSegmentIndex === index;
    if (activeCharacter) {
      drawExportRoundedRect({
        ctx,
        fill: palette.activeCharacterFill,
        height: row.style.lineHeight,
        lineWidth: 0,
        radius: 6 * (row.style.wordMargin / 4),
        stroke: palette.activeCharacterFill,
        width: segmentWidth + row.style.activeCharacterPaddingX * 2,
        x: segmentX - row.style.activeCharacterPaddingX,
        y: centerY - row.style.lineHeight / 2,
      });
    }
    ctx.fillStyle = activeCharacter
      ? palette.activeCharacterText
      : word.active
        ? palette.activeWordText
        : palette.text;
    ctx.fillText(segment, segmentX, centerY);
    segmentX += segmentWidth;
    if (index < metrics.segments.length - 1) {
      segmentX += metrics.internalSeparatorWidth;
    }
  });
}

function drawExportPreviewVisual({
  active,
  centerY,
  ctx,
  fontScale,
  framePlan,
  palette,
  settings,
  timeline,
}: {
  active: boolean;
  centerY: number;
  ctx: CanvasRenderingContext2D;
  fontScale: number;
  framePlan: MorseVideoExportFramePlan;
  palette: ReturnType<typeof getExportPreviewPalette>;
  settings: MorseVideoSettings;
  timeline: MorseVideoTimeline;
}) {
  const centerX = EXPORT_PREVIEW_VIRTUAL_WIDTH / 2;
  if (settings.visualStyle === "morse-text") {
    const symbolText =
      framePlan.frameState.morseWindow ||
      recentMorseSymbols(timeline, framePlan.frameState.elapsedMs, 44) ||
      "...";
    ctx.save();
    ctx.fillStyle = active ? "#7dd3fc" : palette.text;
    ctx.font = `700 ${60 * fontScale}px "Space Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      truncateExportPreviewText(ctx, symbolText, EXPORT_PREVIEW_TEXT_WIDTH),
      centerX,
      centerY,
    );
    ctx.restore();
    return;
  }

  const opacity = exportPreviewIntensityAlpha(settings.intensity);
  if (settings.visualStyle === "lightbulb") {
    drawExportPreviewLightbulb({
      active,
      centerX,
      centerY,
      color: active ? "#0ea5e9" : "#94a3b8",
      ctx,
      opacity,
      size: 120 * fontScale,
    });
    return;
  }

  const radius = 72 * fontScale;
  ctx.save();
  ctx.globalAlpha = opacity;
  if (active) {
    ctx.fillStyle = "#bae6fd";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 4 * fontScale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = active ? "#7dd3fc" : "#94a3b8";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawExportPreviewLightbulb({
  active,
  centerX,
  centerY,
  color,
  ctx,
  opacity,
  size,
}: {
  active: boolean;
  centerX: number;
  centerY: number;
  color: string;
  ctx: CanvasRenderingContext2D;
  opacity: number;
  size: number;
}) {
  const path = getExportLightbulbPath();
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.translate(centerX - size / 2, centerY - size / 2);
  ctx.scale(size / 24, size / 24);
  if (path) {
    ctx.fill(path);
  } else {
    // This fallback is only for browsers without Path2D SVG parsing.
    ctx.beginPath();
    ctx.arc(9, 9.5, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(5, 15, 8, 2);
    ctx.fillRect(7, 18, 4, 1);
    drawSignalSparkles(ctx, 9, 9, 7.5, color);
  }
  ctx.restore();
}

function getExportLightbulbPath() {
  if (exportLightbulbPath !== undefined) return exportLightbulbPath;
  if (typeof Path2D === "undefined") {
    exportLightbulbPath = null;
    return exportLightbulbPath;
  }
  try {
    exportLightbulbPath = new Path2D(EXPORT_LIGHTBULB_PATH);
  } catch {
    exportLightbulbPath = null;
  }
  return exportLightbulbPath;
}

function drawExportPreviewBranding(
  ctx: CanvasRenderingContext2D,
  color: string,
) {
  const text = "WWW.MORSEWORDS.COM";
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.7;
  ctx.font = '700 11px "Space Mono", monospace';
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  drawTrackedExportPreviewText(
    ctx,
    text,
    20,
    EXPORT_PREVIEW_BRANDING_BASELINE_Y,
    11 * 0.14,
  );
  ctx.restore();
}

function drawTrackedExportPreviewText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
) {
  let cursor = x;
  for (const character of text) {
    ctx.fillText(character, cursor, y);
    cursor += measureCanvasTextWidth(ctx, character) + tracking;
  }
}

function drawExportRoundedRect({
  ctx,
  fill,
  height,
  lineWidth,
  radius,
  stroke,
  width,
  x,
  y,
}: {
  ctx: CanvasRenderingContext2D;
  fill: string;
  height: number;
  lineWidth: number;
  radius: number;
  stroke: string;
  width: number;
  x: number;
  y: number;
}) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (lineWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function getExportPreviewPalette({
  fullFrameActive,
  resolvedBackgroundStyle,
}: {
  fullFrameActive: boolean;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
}) {
  const dark = resolvedBackgroundStyle === "dark-morsewords";
  if (fullFrameActive) {
    return {
      activeCharacterFill: dark ? "#ffffff" : "#ffffff",
      activeCharacterText: "#08324f",
      activeWordFill: withAlpha("#082f49", 0.2),
      activeWordStroke: withAlpha("#082f49", 0.2),
      activeWordText: "#08324f",
      background: dark ? "#e0f2fe" : "#08324f",
      text: dark ? "#08324f" : "#f8fafc",
    };
  }
  if (dark) {
    return {
      activeCharacterFill: "#ffffff",
      activeCharacterText: "#020617",
      activeWordFill: "#7dd3fc",
      activeWordStroke: withAlpha("#e0f2fe", 0.8),
      activeWordText: "#020617",
      background: "#020617",
      text: "#e0f2fe",
    };
  }
  return {
    activeCharacterFill: "#7dd3fc",
    activeCharacterText: "#020617",
    activeWordFill: "#e0f2fe",
    activeWordStroke: withAlpha("#7dd3fc", 0.7),
    activeWordText: "#08324f",
    background: "#fffdf8",
    text: "#08324f",
  };
}

function exportPreviewVisualHeight(
  visualStyle: MorseVideoSettings["visualStyle"],
  fontScale: number,
) {
  if (visualStyle === "morse-text") return 72 * fontScale;
  if (visualStyle === "lightbulb") return 120 * fontScale;
  return 144 * fontScale;
}

function exportPreviewIntensityAlpha(
  intensity: MorseVideoSettings["intensity"],
) {
  if (intensity === "low") return 0.6;
  if (intensity === "high") return 1;
  return 0.8;
}

function truncateExportPreviewText(
  ctx: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
) {
  if (measureCanvasTextWidth(ctx, value) <= maxWidth) return value;
  let truncated = value;
  while (truncated.length > 1 && measureCanvasTextWidth(ctx, `${truncated}…`) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
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
      activeHighlightFill: "#7dd3fc",
      activeHighlightStroke: "#e0f2fe",
      activeHighlightText: "#020617",
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
    activeHighlightFill: "#e0f2fe",
    activeHighlightStroke: "#7dd3fc",
    activeHighlightText: "#08324f",
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
  centerY: number,
) {
  const radius = frame.width * (active ? 0.058 : 0.046);
  ctx.fillStyle = active ? accent : withAlpha(muted, intensityAlpha(intensity));
  ctx.beginPath();
  ctx.arc(frame.width / 2, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawFullFrameSignal(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  active: boolean,
  accent: string,
  muted: string,
  intensity: MorseVideoSettings["intensity"],
  centerY: number,
) {
  const radius = frame.width * 0.045;
  ctx.fillStyle = active ? accent : withAlpha(muted, intensityAlpha(intensity));
  ctx.beginPath();
  ctx.arc(frame.width / 2, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawAnimatedMorseText(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  framePlan: MorseVideoExportFramePlan,
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  text: string,
  accent: string,
  muted: string,
  settings: MorseVideoSettings,
  palette: ReturnType<typeof getFramePalette>,
) {
  const textState = getMorseVideoFrameTextState(timeline, elapsedMs);
  const wordWindow = framePlan.frameState.wordWindow;
  const symbols =
    wordWindow.map((word) => word.morse).join(MORSE_DISPLAY_WORD_SEPARATOR) ||
    textState.morseText ||
    recentMorseSymbols(timeline, elapsedMs, 44);
  const maxWidth = frame.width * 0.84;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = symbols ? text : muted;
  ctx.font = `700 ${frame.width * 0.05}px "Space Mono", monospace`;
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
      {
        fill: palette.activeHighlightFill,
        stroke: palette.activeHighlightStroke,
        textFill: palette.activeHighlightText,
      },
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
    ctx.font = `700 ${frame.width * 0.028}px "Space Grotesk", sans-serif`;
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
        {
          fill: palette.activeHighlightFill,
          stroke: palette.activeHighlightStroke,
          textFill: palette.activeHighlightText,
        },
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
  centerY: number,
) {
  const centerX = frame.width / 2;
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
  if (active) {
    drawSignalSparkles(ctx, centerX, centerY, bulbRadius, accent);
  }
}

function drawTextDisplay(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  framePlan: MorseVideoExportFramePlan,
  timeline: MorseVideoTimeline,
  elapsedMs: number,
  settings: MorseVideoSettings,
  text: string,
  muted: string,
  padding: number,
  palette: ReturnType<typeof getFramePalette>,
) {
  const signalVisible =
    settings.showVisualSignal && settings.visualStyle !== "morse-text";
  const wordWindow = framePlan.frameState.wordWindow;
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

  const firstLineY = framePlan.layout.textStartY;
  const lineGap = framePlan.layout.textLineGap;
  const maxWidth = Math.min(frame.width - padding * 2, framePlan.layout.maxTextWidth);

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
    ctx.font = `700 ${frame.width * scale}px "${
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
        {
          fill: palette.activeHighlightFill,
          stroke: palette.activeHighlightStroke,
          textFill: palette.activeHighlightText,
        },
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
  activeHighlight?: {
    fill: string;
    stroke: string;
    textFill: string;
  },
) {
  const separator = kind === "morse" ? MORSE_DISPLAY_WORD_SEPARATOR : " ";
  const parts = words.map((word) => ({
    active: word.active,
    activeCharIndex: word.activeCharIndex,
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

    line.forEach((part, partIndex) => {
      const partWidth = measureCanvasTextWidth(ctx, part.text);
      if (part.active && activeHighlight) {
        const fontSize = Number.parseFloat(ctx.font) || 24;
        const paddingX = Math.max(8, fontSize * 0.22);
        const paddingY = Math.max(4, fontSize * 0.12);
        const highlightHeight = fontSize + paddingY * 2;
        drawRoundedRect(
          ctx,
          x - paddingX,
          y - highlightHeight / 2,
          partWidth + paddingX * 2,
          highlightHeight,
          Math.max(8, fontSize * 0.28),
          activeHighlight.fill,
          activeHighlight.stroke,
        );
        drawActiveCharacterMarker({
          activeCharIndex: part.activeCharIndex,
          activeHighlight,
          ctx,
          kind,
          lineHeight,
          text: part.text,
          x,
          y,
        });
      }
      ctx.fillStyle =
        part.active && activeHighlight
          ? activeHighlight.textFill
          : part.active
            ? activeFill
            : normalFill;
      ctx.fillText(part.text, x, y, maxWidth);
      x += partWidth;
      if (partIndex < line.length - 1) {
        ctx.fillStyle = normalFill;
        ctx.fillText(separator, x, y, maxWidth);
        x += separatorWidth;
      }
    });
  });
}

function drawActiveCharacterMarker({
  activeCharIndex,
  activeHighlight,
  ctx,
  kind,
  lineHeight,
  text,
  x,
  y,
}: {
  activeCharIndex: number;
  activeHighlight: { fill: string; stroke: string; textFill: string };
  ctx: CanvasRenderingContext2D;
  kind: "morse" | "plain";
  lineHeight: number;
  text: string;
  x: number;
  y: number;
}) {
  const segments =
    kind === "morse" ? text.split(" ").filter(Boolean) : [...text];
  const activeSegment = segments[activeCharIndex];
  if (!activeSegment) return;
  const separator = kind === "morse" ? " " : "";
  const prefix = segments.slice(0, activeCharIndex).join(separator);
  const prefixWidth = prefix
    ? measureCanvasTextWidth(ctx, `${prefix}${separator}`)
    : 0;
  const segmentWidth = measureCanvasTextWidth(ctx, activeSegment);
  const fontSize = Number.parseFloat(ctx.font) || 24;
  const paddingX = Math.max(4, fontSize * 0.09);
  const markerHeight = Math.min(lineHeight * 0.8, fontSize * 1.2);
  drawRoundedRect(
    ctx,
    x + prefixWidth - paddingX,
    y - markerHeight / 2,
    segmentWidth + paddingX * 2,
    markerHeight,
    Math.max(4, fontSize * 0.16),
    activeHighlight.stroke,
    activeHighlight.stroke,
  );
}

function drawSignalSparkles(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  accent: string,
) {
  const sparkleSize = radius * 0.22;
  const positions = [
    { x: centerX - radius * 1.55, y: centerY - radius * 0.95 },
    { x: centerX + radius * 1.45, y: centerY - radius * 1.08 },
    { x: centerX + radius * 1.55, y: centerY + radius * 0.22 },
  ];
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.lineWidth = Math.max(2, radius * 0.05);
  ctx.lineCap = "round";
  positions.forEach(({ x, y }, index) => {
    const size = sparkleSize * (index === 1 ? 1.12 : 0.9);
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  });
  ctx.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke: string,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = Math.max(1, height * 0.035);
  ctx.stroke();
  ctx.restore();
}

function drawFrameBranding(
  ctx: CanvasRenderingContext2D,
  frame: MorseVideoFrameSize,
  muted: string,
  padding: number,
) {
  ctx.fillStyle = muted;
  ctx.font = `700 ${frame.width * 0.016}px "Space Mono", monospace`;
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
