import * as React from "react";

import { LightBulbIcon } from "~/client/assets/svg/Icons";

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

type MorseVideoPreviewPanelProps = {
  className?: string;
  headingId: string;
  headingText?: string;
  isPlaying: boolean;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: ResolvedPreviewBackground;
  settings: MorseVideoSettings;
  testIdPrefix: string;
  visualElapsedMs: number;
};

type MorseVideoPreviewTimelineProps = {
  disabled?: boolean;
  elapsedMs: number;
  onSeek: (elapsedMs: number) => void;
  onSeekCommit?: (elapsedMs: number) => void;
  preview: MorseVideoPreview;
  testIdPrefix: string;
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
};

const TIMELINE_EDGE_PADDING_PX = 16;

export function MorseVideoPreviewPanel({
  className = "",
  headingId,
  headingText = "Video preview frame",
  isPlaying,
  preview,
  resolvedBackgroundStyle,
  settings,
  testIdPrefix,
  visualElapsedMs,
}: MorseVideoPreviewPanelProps) {
  const darkFrame = resolvedBackgroundStyle === "dark-morsewords";
  const previewFrame = getMorseVideoPreviewFrame(preview, visualElapsedMs);
  const textState = getMorseVideoFrameTextState(preview.timeline, visualElapsedMs);
  const showTextLayers = settings.showMorseSymbols || settings.showPlainText;
  const textLayerCount =
    (settings.showMorseSymbols ? 1 : 0) + (settings.showPlainText ? 1 : 0);
  const signalVisible = settings.showVisualSignal;
  const markActive = isPlaying && signalVisible && previewFrame.active;
  const fullFrameActive = markActive && settings.visualStyle === "full-frame";
  const frameStyle = previewFrameStyle(darkFrame, fullFrameActive);
  const longTextExcerpt = previewFrame.textExcerpt.length > 44;
  const textStackClass = signalVisible
    ? "w-full max-w-[64rem] space-y-0.5 sm:space-y-2"
    : "w-full max-w-[66rem] space-y-3 sm:space-y-4";
  const morseTextClass = signalVisible
    ? "mx-auto max-h-[4.6rem] max-w-full overflow-hidden break-words font-mono text-base font-bold leading-tight tracking-normal sm:max-h-none sm:text-3xl lg:text-4xl"
    : textLayerCount === 1
      ? "mx-auto max-w-full overflow-hidden break-words font-mono text-4xl font-bold leading-tight tracking-normal sm:text-6xl"
      : "mx-auto max-w-full overflow-hidden break-words font-mono text-3xl font-bold leading-tight tracking-normal sm:text-5xl";
  const plainTextClass = signalVisible
    ? [
        "mx-auto max-w-[64rem] overflow-hidden break-words font-extrabold leading-tight",
        longTextExcerpt
          ? "max-h-[4rem] text-sm leading-snug sm:max-h-none sm:text-3xl sm:leading-tight"
          : "text-sm sm:text-3xl lg:text-4xl",
      ].join(" ")
    : textLayerCount === 1
      ? "mx-auto max-w-[60rem] overflow-hidden break-words text-4xl font-extrabold leading-tight sm:text-6xl"
      : "mx-auto max-w-[60rem] overflow-hidden break-words text-3xl font-extrabold leading-tight sm:text-5xl";

  return (
    <section
      data-testid={testIdPrefix}
      data-preview-playing={isPlaying ? "true" : "false"}
      data-preview-active={markActive ? "true" : "false"}
      aria-labelledby={headingId}
      className={["space-y-3", className].filter(Boolean).join(" ")}
    >
      <div
        className="relative flex aspect-video min-h-[12rem] w-full flex-col overflow-hidden rounded-xl p-3 sm:min-h-[20rem] sm:p-6"
        style={frameStyle}
        data-testid={`${testIdPrefix}-frame`}
        data-preview-playing={isPlaying ? "true" : "false"}
        data-preview-active={markActive ? "true" : "false"}
        data-full-frame-active={fullFrameActive ? "true" : "false"}
      >
        <h3 id={headingId} className="sr-only">
          {headingText}
        </h3>

        <div
          className={[
            "flex min-h-0 flex-1 flex-col items-center justify-center pb-7 pt-0 text-center sm:pb-9 sm:pt-2",
            signalVisible ? "gap-1 sm:gap-4" : "gap-3 sm:gap-6",
          ].join(" ")}
        >
          {signalVisible ? (
            <MorseVideoPreviewVisual
              active={markActive}
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
  disabled = false,
  elapsedMs,
  onSeek,
  onSeekCommit,
  preview,
  testIdPrefix,
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
        ariaLabel="Video preview timeline"
        disabled={disabled}
        elapsedMs={safeElapsed}
        headingText="Morse timing strip"
        onSeek={onSeek}
        onSeekCommit={onSeekCommit}
        preview={preview}
        testId={`${testIdPrefix}-timing-strip`}
        testIdPrefix={`${testIdPrefix}-timing-strip`}
      />
      <p
        className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
        data-testid={`${testIdPrefix}-time`}
      >
        Preview time {formatPreviewDuration(safeElapsed)} /{" "}
        {formatPreviewDuration(durationMs)}
      </p>
    </div>
  );
}

export function MorseAudioTimingStrip({
  ariaLabel = "Audio preview timeline",
  disabled,
  elapsedMs,
  formatTime = formatPreviewDuration,
  headingText = "Morse timing strip",
  instructionText = "Click or drag to preview another segment",
  onSeek,
  onSeekCommit,
  preview,
  testId = "book-audio-preview-timeline",
  testIdPrefix = "book-audio-preview",
}: MorseAudioTimingStripProps) {
  const stripRef = React.useRef<HTMLDivElement | null>(null);
  const latestSeekRef = React.useRef<number | null>(null);
  const draggingRef = React.useRef(false);
  const [dragging, setDragging] = React.useState(false);
  const durationMs = Math.max(1, preview.durationMs);
  const safeElapsed = Math.max(0, Math.min(durationMs, elapsedMs));
  const playheadPercent = (safeElapsed / durationMs) * 100;

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
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {headingText}
        </span>
        <span className="text-xs font-semibold text-slate-600">
          {instructionText}
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
        className={[
          "relative mt-2 h-14 w-full touch-none select-none overflow-hidden rounded-xl bg-slate-950/90",
          disabled
            ? "cursor-not-allowed opacity-65"
            : "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
        ].join(" ")}
      >
        <div className="absolute inset-x-4 inset-y-0">
          {preview.timeline.events.map((event, index) => {
            const left = (event.startMs / durationMs) * 100;
            const width = Math.max(
              0.18,
              ((event.endMs - event.startMs) / durationMs) * 100,
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
                      ? "h-7 bg-sky-300"
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

function MorseVideoPreviewVisual({
  active,
  intensity,
  preview,
  previewFrame,
  testIdPrefix,
  visualStyle,
}: {
  active: boolean;
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
          "block h-14 w-14 rounded-full sm:h-36 sm:w-36",
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
          "h-14 w-14 rounded-full sm:h-36 sm:w-36",
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
          "max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-4xl font-bold tracking-normal sm:text-6xl",
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
        size="clamp(4rem, 12vw, 7.5rem)"
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
          className={[
            word.active
              ? activePreviewWordClass(darkFrame, fullFrameActive)
              : "mx-1 inline-flex flex-wrap justify-center gap-1",
          ].join(" ")}
        >
          {morseCharacters.map((morse, morseIndex) => (
            <span
              key={`${word.wordIndex}-${morseIndex}-${morse}`}
              data-testid={
                word.active && morseIndex === word.activeCharIndex
                  ? `${testIdPrefix}-active-morse-character`
                  : undefined
              }
              className={
                word.active && morseIndex === word.activeCharIndex
                  ? activePreviewCharacterClass(darkFrame, fullFrameActive)
                  : undefined
              }
            >
              {morse}
            </span>
          ))}
        </span>
        {wordOffset < words.length - 1 ? "   " : null}
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
            : undefined
        }
      >
        {[...word.text].map((character, charIndex) => (
          <span
            key={`${word.wordIndex}-${charIndex}-${character}`}
            data-testid={
              word.active && charIndex === word.activeCharIndex
                ? `${testIdPrefix}-active-text-character`
                : undefined
            }
            className={
              word.active && charIndex === word.activeCharIndex
                ? activePreviewCharacterClass(darkFrame, fullFrameActive)
                : undefined
            }
          >
            {character}
          </span>
        ))}
      </span>
      {wordOffset < words.length - 1 ? " " : null}
    </React.Fragment>
  ));
}

function activePreviewWordClass(
  darkFrame: boolean,
  fullFrameActive: boolean,
) {
  if (fullFrameActive) {
    return "mx-1 inline-flex flex-wrap justify-center gap-1 rounded-lg bg-sky-950/20 px-1.5 py-0.5 text-sky-950 ring-1 ring-sky-950/20";
  }
  if (darkFrame) {
    return "mx-1 inline-flex flex-wrap justify-center gap-1 rounded-lg bg-sky-300 px-1.5 py-0.5 text-slate-950 ring-1 ring-sky-100/80";
  }
  return "mx-1 inline-flex flex-wrap justify-center gap-1 rounded-lg bg-sky-100 px-1.5 py-0.5 text-sky-950 ring-1 ring-sky-300/70";
}

function activePreviewCharacterClass(
  darkFrame: boolean,
  fullFrameActive: boolean,
) {
  if (fullFrameActive) {
    return "rounded bg-white/90 px-1 text-sky-950";
  }
  if (darkFrame) {
    return "rounded bg-white px-1 text-slate-950";
  }
  return "rounded bg-sky-300 px-1 text-slate-950";
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

function formatPreviewDuration(elapsedMs: number) {
  const seconds = Math.max(0, Math.round(elapsedMs / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}
