import * as React from "react";

import Button from "~/client/components/practice/components/Button";
import ToggleChip from "~/client/components/practice/components/ToggleChip";
import type {
  DrillMode,
  Pool,
} from "~/client/components/practice/components/PracticeControls";
import PromptCard, {
  type Prompt,
} from "~/client/components/practice/components/PromptCard";
import HowItWorksPractice from "~/client/components/practice/components/HowItWorksPractice";
import PracticeFaq from "~/client/components/practice/components/PracticeFaq";
import JsonLdScript from "~/client/components/practice/components/JsonLdScript";

import {
  checkAnswer,
  randomPrompt,
} from "~/client/components/practice/practiceEngine";
import { useState } from "react";

const LS_MODE = "mw_practice_mode";
const LS_POOL = "mw_practice_pool";

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

export default function PracticePage({ jsonLd }: { jsonLd: any }) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  const [mode, setMode] = React.useState<DrillMode>(
    () => readStr(LS_MODE, "mixed") as DrillMode,
  );
  const [pool, setPool] = React.useState<Pool>(
    () => readStr(LS_POOL, "letters") as Pool,
  );

  const [prompt, setPrompt] = React.useState<Prompt>(() =>
    randomPrompt(mode, pool),
  );
  const [answer, setAnswer] = React.useState("");

  const [reveal, setReveal] = React.useState(false);
  const [feedback, setFeedback] = React.useState<null | {
    ok: boolean;
    msg: string;
  }>(null);

  const [total, setTotal] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [streak, setStreak] = React.useState(0);

  React.useEffect(() => {
    writeStr(LS_MODE, mode);
    writeStr(LS_POOL, pool);
  }, [mode, pool]);

  React.useEffect(() => {
    // When settings change, generate a new prompt to match intent.
    setPrompt(randomPrompt(mode, pool));
    setAnswer("");
    setReveal(false);
    setFeedback(null);
  }, [mode, pool]);

  const next = React.useCallback(() => {
    setPrompt(randomPrompt(mode, pool));
    setAnswer("");
    setReveal(false);
    setFeedback(null);
  }, [mode, pool]);

  const resetStats = React.useCallback(() => {
    setTotal(0);
    setCorrect(0);
    setStreak(0);
    setFeedback(null);
  }, []);

  const doCheck = React.useCallback(() => {
    const res = checkAnswer(prompt, answer);
    setTotal((t) => t + 1);
    if (res.ok) {
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setFeedback({ ok: res.ok, msg: res.msg });
  }, [prompt, answer]);

  const placeholder =
    prompt.kind === "text_to_morse"
      ? "Type Morse here (e.g., ... --- ...)"
      : "Type text here (e.g., SOS)";

  const statusBadge = feedback ? (
    <div
      className={[
        "mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold",
        feedback.ok
          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
          : "bg-amber-50 border-amber-200 text-amber-900",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">{feedback.ok ? "✓" : "!"}</span>
      <span>{feedback.msg}</span>
    </div>
  ) : (
    <div className="mt-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">
      Tip: press <span className="mx-1 font-semibold">Enter</span> to check
    </div>
  );

  return (
    <>
      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex flex-col justify-center items-center text-center">
          <h1 className="font-bold !text-2xl sm:!text-4xl">
            Morse Code Practice (Quiz)
          </h1>
          <p className="mt-2 text-sm sm:text-lg text-gray-700">
            Prompt-based drills for learning Morse code. One prompt at a time,
            instant feedback, repeat.
          </p>
        </div>

        {/* Top control bar: match Audio page density */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setMode("text_to_morse")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "text_to_morse"
                  ? "bg-white border border-gray-200 shadow-sm"
                  : "text-gray-700 hover:bg-white/60"
              }`}
            >
              Text → Morse
            </button>
            <button
              type="button"
              onClick={() => setMode("morse_to_text")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "morse_to_text"
                  ? "bg-white border border-gray-200 shadow-sm"
                  : "text-gray-700 hover:bg-white/60"
              }`}
            >
              Morse → Text
            </button>
            <button
              type="button"
              onClick={() => setMode("mixed")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "mixed"
                  ? "bg-white border border-gray-200 shadow-sm"
                  : "text-gray-700 hover:bg-white/60"
              }`}
            >
              Mixed
            </button>
          </div>

          <div className="sm:ml-auto text-sm text-gray-700 flex items-center gap-3">
            <span className="hidden sm:inline">
              Attempts:{" "}
              <span className="font-semibold text-neutral-900">{total}</span>
            </span>
            <span className="hidden sm:inline">
              Correct:{" "}
              <span className="font-semibold text-neutral-900">{correct}</span>
            </span>
            <span className="hidden sm:inline">
              Accuracy:{" "}
              <span className="font-semibold text-neutral-900">
                {total > 0 ? Math.round((correct / total) * 100) : 0}%
              </span>
            </span>
            <span>
              Streak:{" "}
              <span className="font-semibold text-neutral-900">{streak}</span>
            </span>
          </div>
        </div>

        {/* Main drill panel */}
        <div className="mt-4 border border-gray-200 rounded-2xl p-4 sm:p-5 bg-white">
          <PromptCard
            prompt={prompt}
            reveal={reveal}
            onReveal={() => setReveal((v) => !v)}
          />

          <div className="mt-5">
            <label className=" text-neutral-900 font-bold">
              Your answer ({prompt.kind === "text_to_morse" ? "Morse" : "Text"})
            </label>

            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={placeholder}
              className="w-full mt-2 border border-sky-600 rounded-xl p-3 font-mono focus:ring-2 focus:ring-neutral-900"
              onKeyDown={(e) => {
                if (e.key === "Enter") doCheck();
              }}
              autoComplete="off"
              spellCheck={false}
              inputMode="text"
              aria-label="Practice answer"
            />

            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={doCheck}
                disabled={!answer.trim()}
                aria-label="Check answer"
              >
                Check
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  // If they haven't checked yet, checking is more useful than skipping.
                  if (!feedback) {
                    doCheck();
                    return;
                  }
                  next();
                }}
                aria-label="Next prompt"
              >
                Next
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAnswer("")}
                disabled={!answer}
                aria-label="Clear answer"
              >
                Clear
              </Button>

              <div className="ml-auto flex items-center">
                <span className="text-sm text-gray-600">
                  Tip: press{" "}
                  <span className="font-semibold text-neutral-900">Enter</span>{" "}
                  to check
                </span>
              </div>
            </div>

            {statusBadge}
          </div>

          {/* Options accordion to reduce UI noise */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              type="button"
              className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100 active:scale-[0.99] transition cursor-pointer"
              aria-expanded={optionsOpen}
              onClick={() => setOptionsOpen((v) => !v)}
            >
              <span className="text-sm font-semibold text-neutral-900">
                Drill options
              </span>
              <span aria-hidden className="text-gray-500">
                {optionsOpen ? "▴" : "▾"}
              </span>
            </button>

            {optionsOpen && (
              <div className="mt-3 grid gap-3">
                <div>
                  <div className="text-sm text-gray-600">Prompt pool</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <ToggleChip
                      label="Letters"
                      active={pool === "letters"}
                      onClick={() => setPool("letters")}
                    />
                    <ToggleChip
                      label="Numbers"
                      active={pool === "numbers"}
                      onClick={() => setPool("numbers")}
                    />
                    <ToggleChip
                      label="Signals"
                      active={pool === "signals"}
                      onClick={() => setPool("signals")}
                    />
                    <ToggleChip
                      label="Words"
                      active={pool === "words"}
                      onClick={() => setPool("words")}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={next}
                    aria-label="New prompt"
                  >
                    New prompt
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetStats}
                    aria-label="Reset stats"
                  >
                    Reset stats
                  </Button>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  Designed for repetition drills. This page does not try to be a
                  translator.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <HowItWorksPractice />

      <PracticeFaq />

      <JsonLdScript jsonLd={jsonLd} />
    </>
  );
}
