import * as React from "react";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import Button from "~/client/components/shared/Button";
import {
  ToolOutputPanel,
  ToolPanel,
} from "~/client/components/shared/ToolWorkspace";
import {
  HERO_EYEBROW_LINE_CLASS,
  HERO_EYEBROW_ROW_CLASS,
  HERO_EYEBROW_TEXT_CLASS,
  HERO_HEADER_CLASS,
  HERO_LEAD_CLASS,
  HERO_SECTION_CLASS,
  HERO_TITLE_CLASS,
} from "~/client/components/shared/heroStyles";
import ShareResultsButton from "./components/ShareResultsButton";

import { type InputMode } from "./TypingControls";
import HowItWorksTyping from "./HowItWorksTyping";
import TypingFaq from "./TypingFaq";
// NOTE: We intentionally keep stats inline on this page to match the Practice UI density.

import { decodeTypingRaw } from "./typingEngine";

const LS_INPUT_MODE = "mw_typing_input_mode";
const LS_SHOW_STATS = "mw_typing_show_stats";
const LS_TYPING_DURATION = "mw_typing_duration_sec";

function readStr(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function writeStr(key: string, val: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, val);
  } catch {
    // ignore
  }
}

function readBool(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (v == null) return fallback;
    return v === "1";
  } catch {
    return fallback;
  }
}

function writeBool(key: string, val: boolean) {
  writeStr(key, val ? "1" : "0");
}

function readNum(key: string, fallback: number) {
  const s = readStr(key, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

function writeNum(key: string, val: number) {
  writeStr(key, String(val));
}

type Props = {
  jsonLd: any[];
};

export default function TypingPage({ jsonLd }: Props) {
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  const [inputMode, setInputMode] = React.useState<InputMode>(
    () => (readStr(LS_INPUT_MODE, "dotdash") as InputMode) || "dotdash",
  );
  const [showStats, setShowStats] = React.useState(() =>
    readBool(LS_SHOW_STATS, true),
  );

  // Session timer (endurance typing)
  const DURATION_PRESETS: Array<{ label: string; sec: number }> = React.useMemo(
    () => [
      { label: "10s", sec: 10 },
      { label: "30s", sec: 30 },
      { label: "1m", sec: 60 },
      { label: "2m", sec: 120 },
      { label: "5m", sec: 300 },
      { label: "30m", sec: 1800 },
    ],
    [],
  );

  const [durationSec, setDurationSec] = React.useState<number>(() =>
    readNum(LS_TYPING_DURATION, 30),
  );
  const [sessionState, setSessionState] = React.useState<
    "idle" | "running" | "paused" | "done"
  >("idle");
  const [sessionStartMs, setSessionStartMs] = React.useState<number | null>(
    null,
  );
  const [elapsedBeforePauseMs, setElapsedBeforePauseMs] = React.useState(0);
  const [endsAtMs, setEndsAtMs] = React.useState<number | null>(null);
  const [pausedRemainingMs, setPausedRemainingMs] = React.useState<
    number | null
  >(null);
  const [completedAtMs, setCompletedAtMs] = React.useState<number | null>(null);
  const [showEndScreen, setShowEndScreen] = React.useState(false);

  const [raw, setRaw] = React.useState("");

  React.useEffect(() => {
    writeStr(LS_INPUT_MODE, inputMode);
  }, [inputMode]);

  React.useEffect(() => {
    writeBool(LS_SHOW_STATS, showStats);
  }, [showStats]);

  React.useEffect(() => {
    writeNum(LS_TYPING_DURATION, durationSec);
  }, [durationSec]);

  const decoded = React.useMemo(() => decodeTypingRaw(raw), [raw]);

  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const fmtMMSS = React.useCallback((sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }, []);

  // Countdown and completion handling
  React.useEffect(() => {
    if (sessionState !== "running") return;
    if (endsAtMs == null) return;
    if (now < endsAtMs) return;
    // Session complete
    setSessionState("done");
    setSessionStartMs(null);
    setEndsAtMs(null);
    setPausedRemainingMs(null);
    setElapsedBeforePauseMs(durationSec * 1000);
    setCompletedAtMs(Date.now());
    setShowEndScreen(true);
  }, [now, sessionState, endsAtMs, durationSec]);

  const runningElapsedMs =
    sessionState === "running" && sessionStartMs != null
      ? Math.max(0, now - sessionStartMs)
      : 0;
  const elapsedMs = elapsedBeforePauseMs + runningElapsedMs;
  const elapsedSec = Math.floor(elapsedMs / 1000);

  const remainingSec = React.useMemo(() => {
    if (durationSec <= 0) return 0;
    if (sessionState === "idle") return durationSec;
    if (sessionState === "done") return 0;

    // paused
    const ms =
      sessionState === "paused"
        ? (pausedRemainingMs ?? 0)
        : endsAtMs != null
          ? Math.max(0, endsAtMs - now)
          : 0;
    return Math.max(0, Math.ceil(ms / 1000));
  }, [durationSec, sessionState, pausedRemainingMs, endsAtMs, now]);

  // Display remaining time while running/paused, otherwise show the selected duration.
  const timeDisplay =
    sessionState === "running" || sessionState === "paused"
      ? fmtMMSS(remainingSec)
      : fmtMMSS(durationSec);

  const timeLabel =
    sessionState === "running" || sessionState === "paused"
      ? "Remaining"
      : "Duration";

  const lettersPerMin =
    elapsedSec === 0
      ? 0
      : Math.round((decoded.lettersDecoded / elapsedSec) * 60);

  const focusInput = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        focusInput();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusInput]);

  const ensureRunning = React.useCallback(() => {
    if (sessionState === "running") return true;
    if (sessionState === "paused" || sessionState === "done") return false;

    // idle -> running (auto-start on first input)
    const nowMs = Date.now();
    setSessionState("running");
    setElapsedBeforePauseMs(0);
    setSessionStartMs(nowMs);
    setPausedRemainingMs(null);
    setEndsAtMs(durationSec > 0 ? nowMs + durationSec * 1000 : null);
    setCompletedAtMs(null);
    return true;
  }, [durationSec, sessionState]);

  const append = React.useCallback(
    (s: string) => {
      if (!ensureRunning()) return;
      setRaw((prev) => prev + s);
      focusInput();
    },
    [ensureRunning, focusInput],
  );

  const backspace = React.useCallback(() => {
    if (sessionState !== "running" && sessionState !== "idle") return;
    // Backspace should not auto-start a session.
    setRaw((prev) => prev.slice(0, -1));
    focusInput();
  }, [focusInput, sessionState]);

  const clearAll = React.useCallback(() => {
    setRaw("");
    setSessionState("idle");
    setSessionStartMs(null);
    setElapsedBeforePauseMs(0);
    setEndsAtMs(null);
    setPausedRemainingMs(null);
    setCompletedAtMs(null);
    setShowEndScreen(false);
    focusInput();
  }, [focusInput]);

  const pauseSession = React.useCallback(() => {
    if (sessionState !== "running") return;
    const nowMs = Date.now();
    const runningMs =
      sessionStartMs != null ? Math.max(0, nowMs - sessionStartMs) : 0;
    setElapsedBeforePauseMs((prev) => prev + runningMs);
    setSessionStartMs(null);
    setSessionState("paused");
    if (durationSec > 0) {
      const remainingMs = endsAtMs != null ? Math.max(0, endsAtMs - nowMs) : 0;
      setPausedRemainingMs(remainingMs);
      setEndsAtMs(null);
    }
    focusInput();
  }, [durationSec, endsAtMs, focusInput, sessionStartMs, sessionState]);

  const resumeSession = React.useCallback(() => {
    if (sessionState !== "paused") return;
    const nowMs = Date.now();
    setSessionState("running");
    setSessionStartMs(nowMs);
    if (durationSec > 0) {
      setEndsAtMs(nowMs + Math.max(0, pausedRemainingMs || 0));
      setPausedRemainingMs(null);
    }
    focusInput();
  }, [durationSec, focusInput, pausedRemainingMs, sessionState]);

  const resetSession = React.useCallback(() => {
    setRaw("");
    setSessionState("idle");
    setSessionStartMs(null);
    setElapsedBeforePauseMs(0);
    setEndsAtMs(null);
    setPausedRemainingMs(null);
    setCompletedAtMs(null);
    setShowEndScreen(false);
    focusInput();
  }, [focusInput]);

  const copyDecoded = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(decoded.decoded);
    } catch {
      // ignore
    }
    focusInput();
  }, [decoded.decoded, focusInput]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const k = e.key;

    if (sessionState === "paused" || sessionState === "done") {
      // Prevent accidental edits while paused/completed.
      if (!e.metaKey && !e.ctrlKey && !e.altKey) e.preventDefault();
      return;
    }
    // No newlines in the scratchpad.
    if (k === "Enter") {
      e.preventDefault();
      return;
    }

    // Let browser shortcuts work (copy/paste, etc.)
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (k === "Backspace") {
      e.preventDefault();
      backspace();
      return;
    }

    if (k === " " || k === "/") {
      e.preventDefault();
      append(k);
      return;
    }

    if (inputMode === "dotdash") {
      if (k === "." || k === "-") {
        e.preventDefault();
        append(k);
      }
      return;
    }

    // inputMode === "fj"
    if (k.toLowerCase() === "f") {
      e.preventDefault();
      append(".");
      return;
    }
    if (k.toLowerCase() === "j") {
      e.preventDefault();
      append("-");
      return;
    }

    // Block other printable characters (desktop) to keep the input clean.
    if (k.length === 1) {
      e.preventDefault();
    }
  };

  const sanitizeAndMap = React.useCallback(
    (val: string) => {
      let out = "";
      for (const ch of val) {
        if (ch === " " || ch === "/") {
          out += ch;
          continue;
        }

        if (inputMode === "dotdash") {
          if (ch === "." || ch === "-") out += ch;
          continue;
        }

        // inputMode === "fj"
        if (ch === "." || ch === "-") {
          out += ch;
          continue;
        }
        const lower = ch.toLowerCase();
        if (lower === "f") out += ".";
        if (lower === "j") out += "-";
      }
      return out;
    },
    [inputMode],
  );

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (sessionState === "paused" || sessionState === "done") return;
      const nextRaw = sanitizeAndMap(e.target.value);

      // Auto-start only when the user actually adds a valid symbol.
      const prev = raw;
      if (sessionState === "idle" && nextRaw.length > prev.length) {
        const added = nextRaw.slice(prev.length);
        if (
          added.trim().length > 0 ||
          added.includes(".") ||
          added.includes("-") ||
          added.includes("/") ||
          added.includes(" ")
        ) {
          ensureRunning();
        }
      }

      setRaw(nextRaw);
    },
    [ensureRunning, raw, sanitizeAndMap, sessionState],
  );

  return (
    <main>
      <JsonLdScript jsonLd={jsonLd} />

      {showEndScreen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Session complete"
        >
          <div className="mw-static-panel w-full max-w-3xl overflow-hidden rounded-xl bg-[#fffdf8]">
            <div className="mw-static-surface-soft flex items-center justify-between gap-3 bg-[#fffaf2]/70 p-4 sm:p-5">
              <div>
                <div className="text-xl font-extrabold text-sky-950 sm:text-2xl">
                  Session complete
                </div>
                <div className="mt-1 text-sm text-slate-700 sm:text-base">
                  Duration: {fmtMMSS(durationSec)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEndScreen(false)}
                className="cursor-pointer rounded-lg bg-[#fffdf8] px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
                aria-label="Close results"
              >
                Close
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="mw-static-surface-soft rounded-xl bg-[#fffaf2]/70 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Letters
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-sky-950 sm:text-3xl">
                    {decoded.lettersDecoded}
                  </div>
                </div>
                <div className="mw-static-surface-soft rounded-xl bg-[#fffaf2]/70 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Words
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-sky-950 sm:text-3xl">
                    {decoded.wordsDecoded}
                  </div>
                </div>
                <div className="mw-static-surface-soft rounded-xl bg-[#fffaf2]/70 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Letters/min
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-sky-950 sm:text-3xl">
                    {lettersPerMin}
                  </div>
                </div>
                <div className="mw-static-surface-soft rounded-xl bg-[#fffaf2]/70 p-4 sm:col-span-2">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Invalid
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-sky-950 sm:text-3xl">
                    {decoded.invalidSymbols}
                  </div>
                </div>
                <div className="mw-static-surface-soft rounded-xl bg-[#fffaf2]/70 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Time
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-sky-950 sm:text-3xl">
                    {fmtMMSS(durationSec)}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={resetSession}
                    aria-label="Restart session"
                  >
                    Restart
                  </Button>

                  <ShareResultsButton
                    title="Morse Code Typing"
                    subtitle="Results summary"
                    completedAt={completedAtMs}
                    stats={{
                      durationSec,
                      letters: decoded.lettersDecoded,
                      words: decoded.wordsDecoded,
                      lettersPerMin,
                      invalid: decoded.invalidSymbols,
                    }}
                  />
                </div>

                <div className="text-sm text-slate-600 sm:text-base">
                  Pick a duration above, then start typing to begin a new
                  session.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="">
      <section className={HERO_SECTION_CLASS}>
        <div className={HERO_HEADER_CLASS}>
            <div className={HERO_EYEBROW_ROW_CLASS}>
              <span className={HERO_EYEBROW_LINE_CLASS} />
              <span className={HERO_EYEBROW_TEXT_CLASS}>
                Typing practice
              </span>
            </div>
            <h1 className={HERO_TITLE_CLASS}>
              Morse Code Typing
            </h1>
            <p className={HERO_LEAD_CLASS}>
              Freeform, input-first Morse typing with real-time decoding. Built
              for fluent users who want repetition, rhythm, and endurance.
            </p>
          </div>

          <div className="pb-4 pt-4 sm:pb-5 sm:pt-4">
          {/* Top control bar: durations + session controls + input mode + stats */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                {DURATION_PRESETS.map((p) => (
                  <button
                    key={p.sec}
                    type="button"
                    onClick={() => {
                      if (sessionState === "running") return;
                      setDurationSec(p.sec);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition ${
                      durationSec === p.sec
                        ? "bg-slate-950 text-sky-100"
                        : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                    }`}
                    aria-label={`Set session duration to ${p.label}`}
                    title={
                      sessionState === "running"
                        ? "Pause or reset to change duration"
                        : `Set duration: ${p.label}`
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant={sessionState === "paused" ? "primary" : "secondary"}
                  onClick={
                    sessionState === "paused" ? resumeSession : pauseSession
                  }
                  disabled={
                    sessionState !== "running" && sessionState !== "paused"
                  }
                  aria-label={
                    sessionState === "paused"
                      ? "Resume session"
                      : "Pause session"
                  }
                >
                  {sessionState === "paused" ? "Resume" : "Pause"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetSession}
                  disabled={sessionState === "idle" && !raw}
                  aria-label="Reset session"
                >
                  Reset
                </Button>
              </div>

              <div className="sm:ml-auto flex flex-wrap items-center gap-2 justify-end">
                <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setInputMode("dotdash")}
                    className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition w-1/2 sm:w-auto ${
                      inputMode === "dotdash"
                        ? "bg-slate-950 text-sky-100"
                        : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                    }`}
                    aria-label="Use dot and dash input"
                    title="Type . for dit and - for dah"
                  >
                    Type . and -
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("fj")}
                    className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition w-1/2 sm:w-auto ${
                      inputMode === "fj"
                        ? "bg-slate-950 text-sky-100"
                        : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                    }`}
                    aria-label="Use F and J input"
                    title="Type F for dit and J for dah"
                  >
                    F = dit, J = dah
                  </button>
                </div>
              </div>
            </div>

            <div className="text-base sm:text-lg text-slate-700 flex flex-wrap items-center gap-3 justify-end">
              {showStats ? (
                <>
                  <span>
                    {timeLabel}:{" "}
                    <span className="font-extrabold text-[#0b2447]">
                      {timeDisplay}
                    </span>
                  </span>
                  <span>
                    Letters:{" "}
                    <span className="font-extrabold text-[#0b2447]">
                      {decoded.lettersDecoded}
                    </span>
                  </span>
                  <span className="hidden sm:inline">
                    Words:{" "}
                    <span className="font-extrabold text-[#0b2447]">
                      {decoded.wordsDecoded}
                    </span>
                  </span>
                  <span className="hidden sm:inline">
                    Letters/min:{" "}
                    <span className="font-extrabold text-[#0b2447]">
                      {lettersPerMin}
                    </span>
                  </span>
                  <span>
                    Invalid:{" "}
                    <span className="font-extrabold text-[#0b2447]">
                      {decoded.invalidSymbols}
                    </span>
                  </span>
                </>
              ) : null}

              <button
                type="button"
                onClick={() => setShowStats((s) => !s)}
                className="cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
                aria-label={showStats ? "Hide stats" : "Show stats"}
              >
                {showStats ? "Hide stats" : "Show stats"}
              </button>

              {sessionState === "done" ? (
                <ShareResultsButton
                  title="Morse Code Typing"
                  subtitle="Results summary"
                  completedAt={completedAtMs}
                  stats={{
                    durationSec,
                    letters: decoded.lettersDecoded,
                    words: decoded.wordsDecoded,
                    lettersPerMin,
                    invalid: decoded.invalidSymbols,
                  }}
                />
              ) : null}
            </div>
          </div>

          {/* Main typing panel */}
          <div className="mt-4">
            <div className="space-y-4">
              <ToolOutputPanel
                label="Decoded output"
                badge={`Current symbol ${decoded.currentSymbol || "."}`}
              >
              <pre className="min-h-[160px] max-h-[320px] overflow-auto whitespace-pre-wrap break-words bg-transparent px-4 pb-5 pt-2 font-mono text-base leading-relaxed text-sky-50">
                {decoded.decoded || ""}
              </pre>

              {sessionState === "done" ? (
                <div className="mx-4 mb-4 rounded-xl bg-slate-900 p-4">
                  <div className="text-sm font-extrabold text-white">
                    Session complete
                  </div>
                  <div className="mt-1 text-sm text-slate-300">
                    Duration:{" "}
                    <span className="font-extrabold text-sky-100">
                      {fmtMMSS(durationSec)}
                    </span>{" "}
                    · Letters:{" "}
                    <span className="font-extrabold text-sky-100">
                      {decoded.lettersDecoded}
                    </span>{" "}
                    · Words:{" "}
                    <span className="font-extrabold text-sky-100">
                      {decoded.wordsDecoded}
                    </span>{" "}
                    · Letters/min:{" "}
                    <span className="font-extrabold text-sky-100">
                      {lettersPerMin}
                    </span>{" "}
                    · Invalid:{" "}
                    <span className="font-extrabold text-sky-100">
                      {decoded.invalidSymbols}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={resetSession}
                      aria-label="Reset and type again"
                    >
                      Type again
                    </Button>
                    <ShareResultsButton
                      title="Morse Code Typing"
                      subtitle="Results summary"
                      completedAt={completedAtMs}
                      stats={{
                        durationSec,
                        letters: decoded.lettersDecoded,
                        words: decoded.wordsDecoded,
                        lettersPerMin,
                        invalid: decoded.invalidSymbols,
                      }}
                    />
                  </div>
                </div>
              ) : null}
              </ToolOutputPanel>

              <ToolPanel label="Input" badge="Source">
                <textarea
                  ref={inputRef}
                  value={raw}
                  onChange={onInputChange}
                  readOnly={
                    sessionState === "paused" || sessionState === "done"
                  }
                  rows={5}
                  wrap="soft"
                  onKeyDown={onInputKeyDown}
                  onFocus={(e) => {
                    const el = e.currentTarget;
                    const len = el.value.length;
                    try {
                      el.setSelectionRange(len, len);
                    } catch {
                      // ignore
                    }
                  }}
                  inputMode="text"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="box-border min-h-[10rem] max-h-[260px] w-full max-w-full min-w-0 resize-y overflow-auto border-0 bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0 focus-visible:outline-none"
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowX: "hidden",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    maxWidth: "100%",
                    minWidth: 0,
                  }}
                  placeholder={
                    sessionState === "paused"
                      ? "Paused"
                      : sessionState === "done"
                        ? "Session finished"
                        : inputMode === "dotdash"
                          ? "Type . and -"
                          : "Type F and J"
                  }
                  aria-label="Morse typing input"
                />
              </ToolPanel>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={copyDecoded}
                    aria-label="Copy decoded output"
                  >
                    Copy decoded
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearAll}
                    disabled={!raw}
                    aria-label="Clear scratchpad"
                  >
                    Clear
                  </Button>
                </div>

                <p className="text-right text-sm leading-relaxed text-slate-600 sm:ml-auto">
                  Space = letter · / = word · timer starts on first keypress
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="mt-6 pt-5">
              <div className="text-sm font-extrabold text-sky-950">
                Typing helpers
              </div>

              <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:items-start">
                <div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">On-screen keys</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => append(".")}
                      aria-label="Append dit"
                    >
                      Dit (.)
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => append("-")}
                      aria-label="Append dah"
                    >
                      Dah (-)
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => append(" ")}
                      aria-label="Commit letter (space)"
                    >
                      Space
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => append("/")}
                      aria-label="Commit word (slash)"
                    >
                      Word (/)
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={backspace}
                      aria-label="Backspace"
                    >
                      Backspace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={clearAll}
                      aria-label="Clear all"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="sm:justify-end">
                  <div className="mw-static-surface-soft rounded-xl bg-[#fffaf2]/70 p-4">
                    <div className="text-sm font-extrabold text-sky-950">
                      Keyboard tips
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      <li>
                        {inputMode === "dotdash" ? (
                          <>
                            Type{" "}
                            <span className="font-mono font-semibold">.</span>{" "}
                            for dit and{" "}
                            <span className="font-mono font-semibold">-</span>{" "}
                            for dah.
                          </>
                        ) : (
                          <>
                            Type{" "}
                            <span className="font-mono font-semibold">F</span>{" "}
                            for dit and{" "}
                            <span className="font-mono font-semibold">J</span>{" "}
                            for dah.
                          </>
                        )}
                      </li>
                      <li>
                        Press{" "}
                        <span className="font-mono font-semibold">Space</span>{" "}
                        to commit a letter,{" "}
                        <span className="font-mono font-semibold">/</span> to
                        commit a word.
                      </li>
                      <li>
                        Press{" "}
                        <span className="font-mono font-semibold">Esc</span> to
                        re-focus the input at any time.
                      </li>
                    </ul>
                  </div>

                  <details className="mt-4">
                    <summary className="mw-button-outline cursor-pointer select-none rounded-xl bg-[#fffaf2]/70 p-4 font-bold text-sky-950 transition hover:bg-slate-900 hover:text-sky-100">
                      Show raw input
                    </summary>
                    <pre className="mw-static-code mt-3 whitespace-pre-wrap break-words rounded-xl bg-[#fffdf8] p-4 font-mono text-sm text-slate-950">
                      {decoded.normalizedRaw}
                    </pre>
                  </details>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                This tool is for repetition and flow. No prompts, no grading, no
                lessons.
              </p>
            </div>
          </div>
          </div>
        </section>
      </div>

      <HowItWorksTyping />
      <TypingFaq />
    </main>
  );
}
