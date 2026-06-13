import * as React from "react";

import {
  CollapseIcon,
  ExpandIcon,
  LightBulbIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
  StopIcon,
} from "~/client/assets/svg/Icons";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";

import {
  getMorseVideoFrameTextState,
  type MorseVideoTimeline,
} from "./morseVideoRenderer";
import {
  getMorseVideoPreviewFrame,
  type MorseVideoPreview,
} from "./morseVideoPreview";
import type {
  MorseVideoSettings,
  MorseVideoVisualStyle,
} from "./morseVideoTypes";

type ResolvedPreviewBackground = "warm-morsewords" | "dark-morsewords";
type MorseVideoPreviewLayout = "inline" | "fullscreen";

type MorseVideoPreviewPanelProps = {
  className?: string;
  headingId: string;
  headingText?: string;
  isPlaying: boolean;
  layout?: MorseVideoPreviewLayout;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: ResolvedPreviewBackground;
  settings: MorseVideoSettings;
  testIdPrefix: string;
  visualElapsedMs: number;
};

type MorseVideoPreviewTimelineProps = {
  ariaLabel?: string;
  disabled?: boolean;
  elapsedMs: number;
  onSeek: (elapsedMs: number) => void;
  onSeekCommit?: (elapsedMs: number) => void;
  preview: MorseVideoPreview;
  testIdPrefix: string;
  tone?: "light" | "dark";
};

type MorseAudioTimingStripProps = {
  ariaLabel?: string;
  disabled: boolean;
  elapsedMs: number;
  formatTime?: (elapsedMs: number) => string;
  headingText?: string;
  instructionText?: string;
  onSeek: (elapsedMs: number) => void;
  onSeekCommit?: (elapsedMs: number) => void;
  preview: {
    durationMs: number;
    timeline: MorseVideoTimeline;
  };
  testId?: string;
  testIdPrefix?: string;
  tone?: "light" | "dark";
};

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type FullscreenElement = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const TIMELINE_EDGE_PADDING_PX = 20;
const FULLSCREEN_CONTROLS_HIDE_DELAY_MS = 2_600;
const FULLSCREEN_PLAY_SUPPRESSION_MS = 2_600;
const TIMELINE_DENSE_EVENT_LIMIT = 260;
const TIMELINE_DENSE_BUCKET_COUNT = 180;
const INLINE_PREVIEW_WORD_WINDOW_LIMIT = 168;
const FULLSCREEN_PREVIEW_WORD_WINDOW_LIMIT = 190;

type TimelineDisplayEvent = MorseVideoTimeline["events"][number] & {
  compressed?: boolean;
};

function buildTimingStripDisplayEvents(
  events: MorseVideoTimeline["events"],
  durationMs: number,
) {
  if (events.length <= TIMELINE_DENSE_EVENT_LIMIT) {
    return {
      compressed: false,
      events: events as TimelineDisplayEvent[],
    };
  }

  const markEvents = events.filter((event) => event.type === "mark");
  if (markEvents.length <= TIMELINE_DENSE_EVENT_LIMIT) {
    return {
      compressed: false,
      events: events as TimelineDisplayEvent[],
    };
  }

  const bucketCount = Math.min(
    TIMELINE_DENSE_BUCKET_COUNT,
    Math.max(1, Math.ceil(durationMs / 1_200)),
  );
  const bucketMs = durationMs / bucketCount;
  const displayEvents: TimelineDisplayEvent[] = [];
  let firstCandidateIndex = 0;

  for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
    const bucketStartMs = bucketIndex * bucketMs;
    const bucketEndMs =
      bucketIndex === bucketCount - 1 ? durationMs : bucketStartMs + bucketMs;

    while (
      firstCandidateIndex < events.length &&
      events[firstCandidateIndex].endMs <= bucketStartMs
    ) {
      firstCandidateIndex += 1;
    }

    let cursor = firstCandidateIndex;
    let ditOverlapMs = 0;
    let dashOverlapMs = 0;
    let gapOverlapMs = 0;

    while (cursor < events.length && events[cursor].startMs < bucketEndMs) {
      const event = events[cursor];
      const overlapMs = Math.max(
        0,
        Math.min(event.endMs, bucketEndMs) -
          Math.max(event.startMs, bucketStartMs),
      );
      if (overlapMs > 0) {
        if (event.type === "gap") gapOverlapMs += overlapMs;
        else if (event.symbol === "-") dashOverlapMs += overlapMs;
        else ditOverlapMs += overlapMs;
      }
      cursor += 1;
    }

    const markOverlapMs = ditOverlapMs + dashOverlapMs;
    if (
      gapOverlapMs > 0 &&
      (markOverlapMs <= 0 || gapOverlapMs >= bucketMs * 0.14)
    ) {
      displayEvents.push({
        compressed: true,
        endMs: bucketEndMs,
        startMs: bucketStartMs,
        type: "gap",
      });
    }
    if (markOverlapMs > 0) {
      displayEvents.push({
        compressed: true,
        endMs: bucketEndMs,
        startMs: bucketStartMs,
        symbol: dashOverlapMs >= ditOverlapMs ? "-" : ".",
        type: "mark",
      });
    }
  }

  return {
    compressed: true,
    events: displayEvents,
  };
}

function getPreviewWordWindowLimit({
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

export function MorseVideoPreviewPanel({
  className = "",
  headingId,
  headingText = "Video preview frame",
  isPlaying,
  layout = "inline",
  preview,
  resolvedBackgroundStyle,
  settings,
  testIdPrefix,
  visualElapsedMs,
}: MorseVideoPreviewPanelProps) {
  const fullscreen = layout === "fullscreen";
  const darkFrame = resolvedBackgroundStyle === "dark-morsewords";
  const showTextLayers = settings.showMorseSymbols || settings.showPlainText;
  const textLayerCount =
    (settings.showMorseSymbols ? 1 : 0) + (settings.showPlainText ? 1 : 0);
  const signalVisible = settings.showVisualSignal;
  const previewWordWindowLimit = getPreviewWordWindowLimit({
    fullscreen,
    signalVisible,
    textLayerCount,
  });
  const previewFrame = getMorseVideoPreviewFrame(
    preview,
    visualElapsedMs,
    previewWordWindowLimit,
  );
  const textState = getMorseVideoFrameTextState(preview.timeline, visualElapsedMs);
  const markActive =
    isPlaying && signalVisible && visualElapsedMs > 0 && previewFrame.active;
  const fullFrameActive = markActive && settings.visualStyle === "full-frame";
  const frameStyle = previewFrameStyle(darkFrame, fullFrameActive);
  const longTextExcerpt = previewFrame.textExcerpt.length > 44;
  const denseText =
    previewFrame.textExcerpt.length > 96 ||
    previewFrame.morseExcerpt.length > 132 ||
    previewFrame.words.length > 8;
  const textStackClass = fullscreen
    ? signalVisible
      ? "w-full max-w-[min(98vw,112rem)] space-y-3 sm:space-y-5"
      : "w-full max-w-[min(98vw,116rem)] space-y-3 sm:space-y-5"
    : signalVisible
      ? "w-full max-w-[64rem] space-y-0.5 sm:space-y-2"
      : "w-full max-w-[66rem] space-y-1 sm:space-y-3";
  const morseTextClass = fullscreen
    ? denseText
      ? "mx-auto max-w-full whitespace-normal break-words font-mono text-[clamp(1.15rem,3vw,4.25rem)] font-bold leading-[1.08] tracking-normal"
      : "mx-auto max-w-full whitespace-normal break-words font-mono text-[clamp(1.55rem,5vw,6.25rem)] font-bold leading-[1.08] tracking-normal"
    : signalVisible
      ? "mx-auto max-w-full whitespace-normal break-words font-mono text-base font-bold leading-tight tracking-normal sm:text-3xl lg:text-4xl"
      : "mx-auto max-w-full whitespace-normal break-words font-mono text-base font-bold leading-tight tracking-normal sm:text-3xl lg:text-4xl";
  const plainTextClass = fullscreen
    ? denseText
      ? "mx-auto max-w-[min(98vw,108rem)] whitespace-normal break-words text-[clamp(1.15rem,2.75vw,3.75rem)] font-extrabold leading-[1.1]"
      : "mx-auto max-w-[min(98vw,108rem)] whitespace-normal break-words text-[clamp(1.4rem,4.2vw,5.4rem)] font-extrabold leading-[1.1]"
    : signalVisible
      ? [
          "mx-auto max-w-[64rem] whitespace-normal break-words font-extrabold leading-tight",
          longTextExcerpt
            ? "text-sm leading-snug sm:text-3xl sm:leading-tight"
            : "text-sm sm:text-3xl lg:text-4xl",
        ].join(" ")
      : [
          "mx-auto max-w-[64rem] whitespace-normal break-words font-extrabold leading-tight",
          longTextExcerpt
            ? "text-sm leading-snug sm:text-3xl sm:leading-tight"
            : "text-sm sm:text-3xl lg:text-4xl",
        ].join(" ");
  const rootClass = fullscreen
    ? ["h-full min-h-0 w-full", className].filter(Boolean).join(" ")
    : ["space-y-3", className].filter(Boolean).join(" ");
  const frameClass = fullscreen
    ? "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none p-1 sm:p-3"
    : "relative flex aspect-video min-h-[12rem] w-full flex-col overflow-hidden rounded-xl p-3 sm:min-h-[20rem] sm:p-6";
  const frameContentClass = fullscreen
    ? signalVisible
      ? "flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(0.75rem,2.2vh,2.25rem)] overflow-y-auto px-[clamp(0.5rem,2vw,2rem)] pb-[clamp(4.5rem,11vh,7rem)] pt-[clamp(3rem,7vh,5.5rem)] text-center"
      : "flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(1rem,3vh,3rem)] overflow-y-auto px-[clamp(0.5rem,2vw,2rem)] pb-[clamp(4.5rem,11vh,7rem)] pt-[clamp(3rem,7vh,5.5rem)] text-center"
    : [
        "flex min-h-0 flex-1 flex-col items-center justify-center pb-7 pt-0 text-center sm:pb-9 sm:pt-2",
        signalVisible ? "gap-1 sm:gap-4" : "gap-3 sm:gap-6",
      ].join(" ");

  return (
    <section
      data-testid={testIdPrefix}
      data-preview-playing={isPlaying ? "true" : "false"}
      data-preview-active={markActive ? "true" : "false"}
      aria-labelledby={headingId}
      className={rootClass}
    >
      <div
        className={frameClass}
        style={frameStyle}
        data-testid={`${testIdPrefix}-frame`}
        data-preview-playing={isPlaying ? "true" : "false"}
        data-preview-active={markActive ? "true" : "false"}
        data-full-frame-active={fullFrameActive ? "true" : "false"}
        data-preview-window-limit={previewWordWindowLimit}
      >
        <h3 id={headingId} className="sr-only">
          {headingText}
        </h3>

        <div
          className={frameContentClass}
        >
          {signalVisible ? (
            <MorseVideoPreviewVisual
              active={markActive}
              fullscreen={fullscreen}
              intensity={settings.intensity}
              preview={preview}
              previewFrame={previewFrame}
              testIdPrefix={testIdPrefix}
              visualStyle={settings.visualStyle}
            />
          ) : null}

          {showTextLayers ? (
            <div
              className={textStackClass}
              data-testid={`${testIdPrefix}-text-layers`}
              data-active-character={textState.activeCharacter}
              data-active-morse={textState.activeCharacterMorse}
              data-active-word={textState.plainText}
            >
              {settings.showMorseSymbols ? (
                <div
                  data-testid={`${testIdPrefix}-morse-overlay`}
                  className={morseTextClass}
                >
                  {previewFrame.words.length
                    ? renderMorsePreviewWords(
                        previewFrame.words,
                        darkFrame,
                        fullFrameActive,
                        testIdPrefix,
                      )
                    : previewFrame.morseExcerpt}
                </div>
              ) : null}
              {settings.showPlainText ? (
                <div
                  data-testid={`${testIdPrefix}-text-overlay`}
                  className={plainTextClass}
                >
                  {previewFrame.words.length
                    ? renderTextPreviewWords(
                        previewFrame.words,
                        darkFrame,
                        fullFrameActive,
                        testIdPrefix,
                      )
                    : previewFrame.textExcerpt}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {settings.showBranding && preview.brandLabel ? (
          <p
            data-testid={`${testIdPrefix}-branding`}
            className="absolute bottom-3 left-4 max-w-[calc(100%-2rem)] truncate font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-70 sm:bottom-4 sm:left-5 sm:text-[11px]"
          >
            {preview.brandLabel}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function MorseVideoPreviewTimeline({
  ariaLabel = "Video preview timeline",
  disabled = false,
  elapsedMs,
  onSeek,
  onSeekCommit,
  preview,
  testIdPrefix,
  tone = "light",
}: MorseVideoPreviewTimelineProps) {
  const durationMs = Math.max(1, preview.durationMs);
  const safeElapsed = Math.max(0, Math.min(durationMs, elapsedMs));
  const textState = getMorseVideoFrameTextState(preview.timeline, safeElapsed);

  return (
    <div
      className="mt-4 w-full"
      data-testid={`${testIdPrefix}-timeline`}
      data-active-character={textState.activeCharacter}
      data-active-morse={textState.activeCharacterMorse}
      data-active-word={textState.plainText}
    >
      <MorseAudioTimingStrip
        ariaLabel={ariaLabel}
        disabled={disabled}
        elapsedMs={safeElapsed}
        headingText="Morse timing strip"
        onSeek={onSeek}
        onSeekCommit={onSeekCommit}
        preview={preview}
        testId={`${testIdPrefix}-timing-strip`}
        testIdPrefix={`${testIdPrefix}-timing-strip`}
        tone={tone}
      />
    </div>
  );
}

export function MorseAudioTimingStrip({
  ariaLabel = "Audio preview timeline",
  disabled,
  elapsedMs,
  formatTime = formatPreviewDuration,
  headingText = "Morse timing strip",
  onSeek,
  onSeekCommit,
  preview,
  testId = "book-audio-preview-timeline",
  testIdPrefix = "book-audio-preview",
  tone = "light",
}: MorseAudioTimingStripProps) {
  const stripRef = React.useRef<HTMLDivElement | null>(null);
  const latestSeekRef = React.useRef<number | null>(null);
  const draggingRef = React.useRef(false);
  const [dragging, setDragging] = React.useState(false);
  const durationMs = Math.max(1, preview.durationMs);
  const safeElapsed = Math.max(0, Math.min(durationMs, elapsedMs));
  const playheadPercent = (safeElapsed / durationMs) * 100;
  const timingStripDisplay = React.useMemo(
    () => buildTimingStripDisplayEvents(preview.timeline.events, durationMs),
    [durationMs, preview.timeline.events],
  );
  const timeText = `Preview time ${formatTime(safeElapsed)} / ${formatTime(durationMs)}`;
  const labelClass =
    tone === "dark"
      ? "font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-100"
      : "font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500";
  const stripClass =
    tone === "dark"
      ? "relative mt-2 h-14 w-full touch-none select-none overflow-hidden rounded-xl bg-slate-900/95"
      : "relative mt-2 h-14 w-full touch-none select-none overflow-hidden rounded-xl bg-slate-950/90";

  const seekFromClientX = React.useCallback(
    (clientX: number) => {
      const strip = stripRef.current;
      if (!strip) return safeElapsed;
      const rect = strip.getBoundingClientRect();
      const contentLeft = rect.left + TIMELINE_EDGE_PADDING_PX;
      const contentWidth = Math.max(1, rect.width - TIMELINE_EDGE_PADDING_PX * 2);
      const progress = (clientX - contentLeft) / contentWidth;
      const nextElapsed = Math.max(0, Math.min(1, progress)) * durationMs;
      latestSeekRef.current = nextElapsed;
      onSeek(nextElapsed);
      return nextElapsed;
    },
    [durationMs, onSeek, safeElapsed],
  );

  const commitSeek = React.useCallback(
    (elapsedMs: number | null = latestSeekRef.current) => {
      if (elapsedMs === null) return;
      onSeekCommit?.(Math.max(0, Math.min(durationMs, elapsedMs)));
      latestSeekRef.current = null;
    },
    [durationMs, onSeekCommit],
  );

  const setDraggingState = React.useCallback((nextDragging: boolean) => {
    draggingRef.current = nextDragging;
    setDragging(nextDragging);
  }, []);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Some browsers can reject capture for synthetic or interrupted pointers.
      }
      setDraggingState(true);
      seekFromClientX(event.clientX);
    },
    [disabled, seekFromClientX, setDraggingState],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || disabled) return;
      seekFromClientX(event.clientX);
    },
    [disabled, seekFromClientX],
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const committedElapsed = seekFromClientX(event.clientX);
      setDraggingState(false);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be released by the browser.
      }
      commitSeek(committedElapsed);
    },
    [commitSeek, seekFromClientX, setDraggingState],
  );

  const handlePointerCancel = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setDraggingState(false);
      latestSeekRef.current = null;
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be released by the browser.
      }
    },
    [setDraggingState],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const step = event.shiftKey ? 2_000 : 500;
      let nextElapsed: number | null = null;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        nextElapsed = Math.max(0, safeElapsed - step);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextElapsed = Math.min(durationMs, safeElapsed + step);
      } else if (event.key === "Home") {
        event.preventDefault();
        nextElapsed = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextElapsed = durationMs;
      }
      if (nextElapsed !== null) {
        latestSeekRef.current = nextElapsed;
        onSeek(nextElapsed);
        commitSeek(nextElapsed);
      }
    },
    [commitSeek, disabled, durationMs, onSeek, safeElapsed],
  );

  React.useEffect(() => {
    if (!dragging) return undefined;
    const commitAndStopDragging = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const committedElapsed = seekFromClientX(event.clientX);
      commitSeek(committedElapsed);
      setDraggingState(false);
    };
    const cancelDragging = () => {
      setDraggingState(false);
      latestSeekRef.current = null;
    };
    window.addEventListener("pointerup", commitAndStopDragging);
    window.addEventListener("blur", cancelDragging);
    window.addEventListener("pointercancel", cancelDragging);
    return () => {
      window.removeEventListener("pointerup", commitAndStopDragging);
      window.removeEventListener("blur", cancelDragging);
      window.removeEventListener("pointercancel", cancelDragging);
    };
  }, [commitSeek, dragging, seekFromClientX, setDraggingState]);

  React.useEffect(() => {
    if (!disabled) return;
    setDraggingState(false);
    latestSeekRef.current = null;
  }, [disabled, setDraggingState]);

  return (
    <div className="mt-4 w-full" data-testid={testId}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={labelClass}>
          {headingText}
        </span>
        <span
          className={labelClass}
          data-testid={`${testIdPrefix}-time`}
        >
          {timeText}
        </span>
      </div>
      <div
        ref={stripRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs)}
        aria-valuenow={Math.round(safeElapsed)}
        aria-valuetext={`${formatTime(safeElapsed)} of ${formatTime(durationMs)}`}
        aria-disabled={disabled ? "true" : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={() => {
          if (!draggingRef.current) return;
          commitSeek();
          setDraggingState(false);
        }}
        onKeyDown={handleKeyDown}
        data-mw-timeline-density={
          timingStripDisplay.compressed ? "condensed" : "full"
        }
        className={[
          stripClass,
          disabled
            ? "cursor-not-allowed opacity-65"
            : "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
        ].join(" ")}
      >
        <div className="absolute inset-x-5 inset-y-0">
          {timingStripDisplay.events.map((event, index) => {
            const left = Math.max(0, Math.min(100, (event.startMs / durationMs) * 100));
            const rawWidth = ((event.endMs - event.startMs) / durationMs) * 100;
            const width = Math.max(
              event.compressed ? 0.32 : 0.18,
              Math.min(100 - left, rawWidth),
            );
            const isMark = event.type === "mark";
            const isDash = event.symbol === "-";
            return (
              <span
                key={`${event.startMs}-${event.endMs}-${index}`}
                data-testid={
                  isMark
                    ? `${testIdPrefix}-${isDash ? "dash" : "dit"}`
                    : `${testIdPrefix}-gap`
                }
                aria-hidden="true"
                className={[
                  "absolute top-1/2 block -translate-y-1/2 rounded-full",
                  isMark
                    ? isDash
                      ? event.compressed
                        ? "h-6 bg-sky-300/90"
                        : "h-7 bg-sky-300"
                      : event.compressed
                        ? "h-3.5 bg-sky-200/90"
                        : "h-4 bg-sky-200"
                    : "h-1.5 bg-slate-500/55",
                ].join(" ")}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              />
            );
          })}
          <span
            aria-hidden="true"
            data-testid={`${testIdPrefix}-playhead`}
            className="absolute top-1/2 h-10 w-1.5 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_0_2px_rgba(248,250,252,0.85)]"
            style={{ left: `calc(${playheadPercent}% - 2px)` }}
          />
        </div>
      </div>
    </div>
  );
}

export function MorseLivePreviewFullscreenControl({
  disabled = false,
  elapsedMs,
  headingText = "Fullscreen live Morse preview",
  isPlaying,
  onPlay,
  onRestart,
  onSeek,
  onSeekCommit,
  onStop,
  preview,
  resolvedBackgroundStyle,
  segmentControl,
  settings,
  testIdPrefix,
  timelineAriaLabel = "Fullscreen live player timeline",
}: {
  disabled?: boolean;
  elapsedMs: number;
  headingText?: string;
  isPlaying: boolean;
  onPlay: () => void;
  onRestart?: () => void;
  onSeek: (elapsedMs: number) => void;
  onSeekCommit?: (elapsedMs: number) => void;
  onStop: () => void;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: ResolvedPreviewBackground;
  segmentControl?: React.ReactNode;
  settings: MorseVideoSettings;
  testIdPrefix: string;
  timelineAriaLabel?: string;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const hideControlsTimerRef = React.useRef<number | null>(null);
  const controlsSuppressionTimerRef = React.useRef<number | null>(null);
  const controlsSuppressedUntilRef = React.useRef(0);
  const fullscreenApiActiveRef = React.useRef(false);
  const [open, setOpen] = React.useState(false);
  const [fullscreenApiActive, setFullscreenApiActive] = React.useState(false);
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const [controlsSuppressed, setControlsSuppressed] = React.useState(false);
  const safeElapsed = Math.max(0, Math.min(Math.max(1, preview.durationMs), elapsedMs));
  const fullscreenSettings = React.useMemo(
    () =>
      settings.showBranding
        ? {
            ...settings,
            showBranding: false,
          }
        : settings,
    [settings],
  );

  const clearHideControlsTimer = React.useCallback(() => {
    if (hideControlsTimerRef.current === null) return;
    window.clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = null;
  }, []);

  const clearControlsSuppression = React.useCallback(() => {
    if (controlsSuppressionTimerRef.current !== null) {
      window.clearTimeout(controlsSuppressionTimerRef.current);
      controlsSuppressionTimerRef.current = null;
    }
    controlsSuppressedUntilRef.current = 0;
    setControlsSuppressed(false);
  }, []);

  const controlsAreSuppressed = React.useCallback(
    () => performance.now() < controlsSuppressedUntilRef.current,
    [],
  );

  const showControlsBriefly = React.useCallback((force = false) => {
    if (!force && controlsAreSuppressed()) {
      setControlsVisible(false);
      return;
    }
    setControlsVisible(true);
    clearHideControlsTimer();
    hideControlsTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
      hideControlsTimerRef.current = null;
    }, FULLSCREEN_CONTROLS_HIDE_DELAY_MS);
  }, [clearHideControlsTimer, controlsAreSuppressed]);

  const suppressControlsAfterPlay = React.useCallback(() => {
    clearHideControlsTimer();
    if (controlsSuppressionTimerRef.current !== null) {
      window.clearTimeout(controlsSuppressionTimerRef.current);
    }
    controlsSuppressedUntilRef.current =
      performance.now() + FULLSCREEN_PLAY_SUPPRESSION_MS;
    setControlsSuppressed(true);
    setControlsVisible(false);
    controlsSuppressionTimerRef.current = window.setTimeout(() => {
      controlsSuppressionTimerRef.current = null;
      controlsSuppressedUntilRef.current = 0;
      setControlsSuppressed(false);
    }, FULLSCREEN_PLAY_SUPPRESSION_MS);
  }, [clearHideControlsTimer]);

  const handleFullscreenPlaybackToggle = React.useCallback(() => {
    if (isPlaying) {
      onStop();
      showControlsBriefly(true);
      return;
    }
    onPlay();
    suppressControlsAfterPlay();
  }, [isPlaying, onPlay, onStop, showControlsBriefly, suppressControlsAfterPlay]);

  const handleRestart = React.useCallback(() => {
    onRestart?.();
  }, [onRestart]);

  const closeFullscreen = React.useCallback(() => {
    if (typeof document === "undefined") {
      setOpen(false);
      return;
    }
    const activeElement = getBrowserFullscreenElement();
    if (activeElement && activeElement === containerRef.current) {
      void Promise.resolve(exitBrowserFullscreen())
        .catch(() => undefined)
        .finally(() => {
          clearControlsSuppression();
          fullscreenApiActiveRef.current = false;
          setFullscreenApiActive(false);
          setOpen(false);
        });
      return;
    }
    clearControlsSuppression();
    fullscreenApiActiveRef.current = false;
    setFullscreenApiActive(false);
    setOpen(false);
  }, [clearControlsSuppression]);

  React.useEffect(
    () => () => {
      clearHideControlsTimer();
      clearControlsSuppression();
    },
    [clearControlsSuppression, clearHideControlsTimer],
  );

  React.useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    containerRef.current?.focus();
    showControlsBriefly();

    const element = containerRef.current;
    if (element) {
      const requestFullscreen = getRequestFullscreen(element);
      if (requestFullscreen) {
        void Promise.resolve(requestFullscreen())
          .then(() => {
            fullscreenApiActiveRef.current = true;
            setFullscreenApiActive(true);
          })
          .catch(() => {
            fullscreenApiActiveRef.current = false;
            setFullscreenApiActive(false);
          });
      }
    }

    return () => {
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.body.style.overflow = previousBodyOverflow;
      clearHideControlsTimer();
      clearControlsSuppression();
    };
  }, [clearControlsSuppression, clearHideControlsTimer, open, showControlsBriefly]);

  React.useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const handleFullscreenChange = () => {
      const activeElement = getBrowserFullscreenElement();
      const active = activeElement === containerRef.current;
      const wasActive = fullscreenApiActiveRef.current;
      fullscreenApiActiveRef.current = active;
      setFullscreenApiActive(active);
      if (wasActive && !active && !activeElement) {
        setOpen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange,
    );
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeFullscreen, open]);

  return (
    <>
      <button
        type="button"
        className={toolControlButtonClass({
          tone: "light",
          hover: "dark",
          rounded: "xl",
        })}
        onClick={() => setOpen(true)}
        data-testid={`${testIdPrefix}-fullscreen-button`}
        aria-label="Open live preview fullscreen"
      >
        <ExpandIcon size={18} title={undefined} aria-hidden="true" />
        Fullscreen
      </button>
      {open ? (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={headingText}
          data-testid={`${testIdPrefix}-fullscreen-overlay`}
          data-fullscreen-active="true"
          data-fullscreen-mode={fullscreenApiActive ? "browser" : "fallback"}
          data-fullscreen-controls-visible={controlsVisible ? "true" : "false"}
          data-fullscreen-controls-suppressed={
            controlsSuppressed ? "true" : "false"
          }
          tabIndex={-1}
          className="fixed inset-0 z-[1000] h-[100dvh] w-screen overflow-hidden bg-slate-950 text-slate-50"
          onFocusCapture={() => showControlsBriefly(true)}
          onMouseMove={() => showControlsBriefly()}
          onPointerDown={() => showControlsBriefly()}
          onPointerMove={() => showControlsBriefly()}
        >
          <MorseVideoPreviewPanel
            className="h-full min-h-0 w-full"
            headingId={`${testIdPrefix}-fullscreen-heading`}
            headingText={headingText}
            isPlaying={isPlaying}
            layout="fullscreen"
            preview={preview}
            resolvedBackgroundStyle={resolvedBackgroundStyle}
            settings={fullscreenSettings}
            testIdPrefix={`${testIdPrefix}-fullscreen`}
            visualElapsedMs={safeElapsed}
          />
          <button
            type="button"
            className={[
              "absolute right-3 top-3 z-20 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950/82 px-3 py-2 text-sm font-extrabold text-slate-50 shadow-lg backdrop-blur transition-opacity hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:right-5 sm:top-5 sm:rounded-xl sm:px-4",
              controlsVisible
                ? "sm:opacity-100"
                : "sm:pointer-events-none sm:opacity-0",
            ].join(" ")}
            onClick={closeFullscreen}
            data-testid={`${testIdPrefix}-fullscreen-exit`}
            aria-label="Exit fullscreen"
            onFocus={() => showControlsBriefly(true)}
          >
            <CollapseIcon size={18} title={undefined} aria-hidden="true" />
            <span className="hidden sm:inline">Exit fullscreen</span>
          </button>
          <div
            className={[
              "absolute inset-x-3 bottom-3 z-20 hidden rounded-xl bg-slate-950/88 p-3 text-slate-50 shadow-lg backdrop-blur transition-opacity sm:block sm:p-4",
              controlsVisible ? "opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={toolControlButtonClass({
                  tone: isPlaying ? "light" : "dark",
                  hover: isPlaying ? "dark" : undefined,
                  rounded: "xl",
                })}
                onClick={handleFullscreenPlaybackToggle}
                disabled={disabled && !isPlaying}
              >
                {isPlaying ? (
                  <PauseIcon size={18} title={undefined} aria-hidden="true" />
                ) : (
                  <PlayIcon size={18} title={undefined} aria-hidden="true" />
                )}
                {isPlaying ? "Pause live player" : "Play live player"}
              </button>
              {isPlaying && onRestart ? (
                <button
                  type="button"
                  className={toolControlButtonClass({
                    tone: "light",
                    hover: "dark",
                    rounded: "xl",
                  })}
                  onClick={handleRestart}
                  disabled={disabled}
                >
                  <RefreshIcon size={18} title={undefined} aria-hidden="true" />
                  Restart live player
                </button>
              ) : null}
              {segmentControl}
            </div>
            <MorseVideoPreviewTimeline
              ariaLabel={timelineAriaLabel}
              disabled={disabled && !isPlaying}
              elapsedMs={safeElapsed}
              onSeek={onSeek}
              onSeekCommit={onSeekCommit}
              preview={preview}
              testIdPrefix={`${testIdPrefix}-fullscreen`}
              tone="dark"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

function MorseVideoPreviewVisual({
  active,
  fullscreen,
  intensity,
  preview,
  previewFrame,
  testIdPrefix,
  visualStyle,
}: {
  active: boolean;
  fullscreen: boolean;
  intensity: MorseVideoSettings["intensity"];
  preview: MorseVideoPreview;
  previewFrame: ReturnType<typeof getMorseVideoPreviewFrame>;
  testIdPrefix: string;
  visualStyle: MorseVideoVisualStyle;
}) {
  const intensityClass =
    intensity === "high"
      ? "opacity-100"
      : intensity === "low"
        ? "opacity-60"
        : "opacity-80";

  if (visualStyle === "dot") {
    return (
      <span
        data-testid={`${testIdPrefix}-dot`}
        data-preview-active={active ? "true" : "false"}
        aria-label="Dot preview"
        role="img"
        className={[
          fullscreen
            ? "block h-[clamp(3.5rem,13vw,10rem)] w-[clamp(3.5rem,13vw,10rem)] rounded-full"
            : "block h-14 w-14 rounded-full sm:h-36 sm:w-36",
          active ? "bg-sky-300 ring-4 ring-sky-200/50" : "bg-slate-400",
          intensityClass,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  if (visualStyle === "full-frame") {
    return (
      <div
        data-testid={`${testIdPrefix}-full-frame`}
        data-preview-active={active ? "true" : "false"}
        aria-label="Full-frame flash preview"
        role="img"
        className={[
          fullscreen
            ? "h-[clamp(3.5rem,13vw,10rem)] w-[clamp(3.5rem,13vw,10rem)] rounded-full"
            : "h-14 w-14 rounded-full sm:h-36 sm:w-36",
          active ? "bg-sky-300 ring-4 ring-sky-200/50" : "bg-slate-400",
          intensityClass,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  if (visualStyle === "morse-text") {
    return (
      <div
        data-testid={`${testIdPrefix}-morse-text`}
        data-preview-active={active ? "true" : "false"}
        className={[
          fullscreen
            ? "max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[clamp(2.5rem,10vw,9rem)] font-bold tracking-normal"
            : "max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-4xl font-bold tracking-normal sm:text-6xl",
          active ? "text-sky-300" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {previewFrame.symbols || preview.sampleMorse}
      </div>
    );
  }

  return (
    <div
      data-testid={`${testIdPrefix}-lightbulb`}
      data-preview-active={active ? "true" : "false"}
      aria-label="Lightbulb preview"
      role="img"
      className={[
        "inline-flex items-center justify-center",
        active ? "text-sky-500" : "text-slate-400",
        intensityClass,
      ].join(" ")}
    >
      <LightBulbIcon
        size={
          fullscreen
            ? "clamp(4rem, 14vw, 11rem)"
            : "clamp(4rem, 12vw, 7.5rem)"
        }
        title={undefined}
        aria-hidden="true"
      />
    </div>
  );
}

function renderMorsePreviewWords(
  words: ReturnType<typeof getMorseVideoPreviewFrame>["words"],
  darkFrame: boolean,
  fullFrameActive: boolean,
  testIdPrefix: string,
) {
  return words.map((word, wordOffset) => {
    const morseCharacters = word.morse.split(" ").filter(Boolean);
    return (
      <React.Fragment key={`${word.wordIndex}-${word.morse}`}>
        <span
          data-testid={
            word.active ? `${testIdPrefix}-active-morse-word` : undefined
          }
          className={
            word.active
              ? activePreviewWordClass(darkFrame, fullFrameActive)
              : "mx-1 inline-block whitespace-nowrap"
          }
        >
          {morseCharacters.map((morse, morseIndex) => (
            <React.Fragment key={`${word.wordIndex}-${morseIndex}-${morse}`}>
              <span
                data-testid={
                  word.active && morseIndex === word.activeCharIndex
                    ? `${testIdPrefix}-active-morse-character`
                    : undefined
                }
                className={
                  word.active && morseIndex === word.activeCharIndex
                    ? activePreviewCharacterClass(darkFrame, fullFrameActive)
                    : "inline-block whitespace-nowrap"
                }
              >
                {morse}
              </span>
              {morseIndex < morseCharacters.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </span>
        {wordOffset < words.length - 1 ? (
          <span className="mx-[0.1em] select-none opacity-70">
            /
          </span>
        ) : null}
      </React.Fragment>
    );
  });
}

function renderTextPreviewWords(
  words: ReturnType<typeof getMorseVideoPreviewFrame>["words"],
  darkFrame: boolean,
  fullFrameActive: boolean,
  testIdPrefix: string,
) {
  return words.map((word, wordOffset) => (
    <React.Fragment key={`${word.wordIndex}-${word.text}`}>
      <span
        data-testid={word.active ? `${testIdPrefix}-active-text-word` : undefined}
        className={
          word.active
            ? activePreviewWordClass(darkFrame, fullFrameActive)
            : "mx-1 inline-block whitespace-nowrap"
        }
      >
        {word.active
          ? [...word.text].map((character, charIndex) => (
              <span
                key={`${word.wordIndex}-${charIndex}-${character}`}
                data-testid={
                  charIndex === word.activeCharIndex
                    ? `${testIdPrefix}-active-text-character`
                    : undefined
                }
                className={
                  charIndex === word.activeCharIndex
                    ? activePreviewCharacterClass(darkFrame, fullFrameActive)
                    : undefined
                }
              >
                {character}
              </span>
            ))
          : word.text}
      </span>
      {wordOffset < words.length - 1 ? (
        <span className="mx-1 select-none opacity-55" aria-hidden="true">
          /
        </span>
      ) : null}
    </React.Fragment>
  ));
}

function activePreviewWordClass(
  darkFrame: boolean,
  fullFrameActive: boolean,
) {
  return activePreviewHighlightClass(darkFrame, fullFrameActive, "mx-1");
}

function activePreviewHighlightClass(
  darkFrame: boolean,
  fullFrameActive: boolean,
  marginClass: string,
) {
  const baseClass = [
    marginClass,
    "inline-block whitespace-nowrap rounded-lg px-1.5 py-0.5",
  ]
    .filter(Boolean)
    .join(" ");
  if (fullFrameActive) {
    return `${baseClass} bg-sky-950/20 text-sky-950 ring-1 ring-sky-950/20`;
  }
  if (darkFrame) {
    return `${baseClass} bg-sky-300 text-slate-950 ring-1 ring-sky-100/80`;
  }
  return `${baseClass} bg-sky-100 text-sky-950 ring-1 ring-sky-300/70`;
}

function activePreviewCharacterClass(
  darkFrame: boolean,
  fullFrameActive: boolean,
) {
  const baseClass =
    "inline-block whitespace-nowrap rounded-md px-1 text-center";
  if (fullFrameActive) {
    return `${baseClass} bg-white/90 text-sky-950`;
  }
  if (darkFrame) {
    return `${baseClass} bg-white text-slate-950`;
  }
  return `${baseClass} bg-sky-300 text-slate-950`;
}

function previewFrameStyle(darkFrame: boolean, fullFrameActive: boolean) {
  if (darkFrame) {
    return fullFrameActive
      ? { backgroundColor: "#e0f2fe", color: "#08324f" }
      : { backgroundColor: "#020617", color: "#e0f2fe" };
  }
  return fullFrameActive
    ? { backgroundColor: "#08324f", color: "#f8fafc" }
    : { backgroundColor: "#fffdf8", color: "#08324f" };
}

function getRequestFullscreen(element: FullscreenElement) {
  if (element.requestFullscreen) {
    return () => element.requestFullscreen();
  }
  if (element.webkitRequestFullscreen) {
    return () => element.webkitRequestFullscreen?.();
  }
  return null;
}

function getBrowserFullscreenElement() {
  if (typeof document === "undefined") return null;
  const fullscreenDocument = document as FullscreenDocument;
  return document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;
}

function exitBrowserFullscreen() {
  if (typeof document === "undefined") return undefined;
  const fullscreenDocument = document as FullscreenDocument;
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  }
  return fullscreenDocument.webkitExitFullscreen?.();
}

function formatPreviewDuration(elapsedMs: number) {
  const seconds = Math.max(0, Math.round(elapsedMs / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}
