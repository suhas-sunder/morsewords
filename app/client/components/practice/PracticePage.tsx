import * as React from "react";

import Button from "~/client/components/shared/Button";
import ToggleChip from "~/client/components/shared/ToggleChip";
import type {
  DrillMode,
  Pool,
} from "~/client/components/practice/PracticeControls";
import PromptCard, {
  type Prompt,
} from "~/client/components/practice/PromptCard";
import HowItWorksPractice from "~/client/components/practice/HowItWorksPractice";
import PracticeFaq from "~/client/components/practice/PracticeFaq";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ShareResultsButton from "~/client/components/practice/ShareResultsButton";

import {
  checkAnswer,
  randomPrompt,
} from "~/client/components/practice/practiceEngine";

const LS_POOL = "mw_practice_pool";
const lsModeKey = (pool: string) => `mw_practice_mode_${pool}`;
const lsBestStreakKey = (pool: string) => `mw_practice_best_streak_${pool}`;

const TOTAL_QUESTIONS = 10;

const defaultModeForPool = (pool: Pool): DrillMode => {
  // Words are primarily an encoding drill; default to Text → Morse.
  return pool === "words" || pool === "sentences" ? "text_to_morse" : "mixed";
};

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

function readInt(key: string, fallback: number) {
  const v = readStr(key, String(fallback));
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function writeInt(key: string, val: number) {
  writeStr(key, String(val));
}

export default function PracticePage({ jsonLd }: { jsonLd: any }) {
  // Hydration safety: do not read localStorage or generate random prompts during SSR/first paint.
  // Load persisted settings after mount.
  const [hydrated, setHydrated] = React.useState(false);

  const [pool, setPool] = React.useState<Pool>("all");
  const [mode, setMode] = React.useState<DrillMode>(defaultModeForPool("all"));

  const [prompt, setPrompt] = React.useState<Prompt>(() => ({
    kind: "text_to_morse",
    plain: "SOS",
    morse: "... --- ...",
    label: "Practice",
  }));
  const [answer, setAnswer] = React.useState("");

  // Quiz flow
  const [questionNumber, setQuestionNumber] = React.useState(1);
  const [completed, setCompleted] = React.useState(0); // questions finished (0..TOTAL_QUESTIONS)
  const [solvedThisQuestion, setSolvedThisQuestion] = React.useState(false);

  // Attempts count every check (including failed tries). This drives accuracy.
  const [attempts, setAttempts] = React.useState(0);
  const [feedback, setFeedback] = React.useState<null | {
    ok: boolean;
    msg: string;
  }>(null);

  const [runStartedAt, setRunStartedAt] = React.useState<number | null>(null);
  const [correct, setCorrect] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);

  React.useEffect(() => {
    // Load persisted settings once on mount.
    const poolRaw = readStr(LS_POOL, "all");
    const nextPool: Pool =
      poolRaw === "all" ||
      poolRaw === "letters" ||
      poolRaw === "numbers" ||
      poolRaw === "signals" ||
      poolRaw === "words" ||
      poolRaw === "sentences"
        ? (poolRaw as Pool)
        : "all";

    const modeRaw = readStr(lsModeKey(nextPool), defaultModeForPool(nextPool));
    const nextMode: DrillMode =
      modeRaw === "text_to_morse" ||
      modeRaw === "morse_to_text" ||
      modeRaw === "mixed"
        ? (modeRaw as DrillMode)
        : defaultModeForPool(nextPool);

    const nextBest = readInt(lsBestStreakKey(nextPool), 0);

    setPool((p) => (p === nextPool ? p : nextPool));
    setMode((m) => (m === nextMode ? m : nextMode));
    setBestStreak((b) => (b === nextBest ? b : nextBest));
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (completed > TOTAL_QUESTIONS) {
      setCompleted(TOTAL_QUESTIONS);
      return;
    }
    const expected =
      completed >= TOTAL_QUESTIONS
        ? TOTAL_QUESTIONS
        : Math.min(TOTAL_QUESTIONS, completed + 1);
    setQuestionNumber((q) => (q === expected ? q : expected));
  }, [completed]);

  React.useEffect(() => {
    if (!hydrated) return;
    writeStr(LS_POOL, pool);
  }, [pool]);

  React.useEffect(() => {
    if (!hydrated) return;
    // When pool changes, load pool-specific settings instead of inheriting from other drills.
    const v = readStr(lsModeKey(pool), defaultModeForPool(pool));
    const nextMode: DrillMode =
      v === "text_to_morse" || v === "morse_to_text" || v === "mixed"
        ? (v as DrillMode)
        : defaultModeForPool(pool);
    setMode((m) => (m === nextMode ? m : nextMode));

    const bs = readInt(lsBestStreakKey(pool), 0);
    setBestStreak((b) => (b === bs ? b : bs));
  }, [pool, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    writeStr(lsModeKey(pool), mode);
  }, [mode, pool, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    writeInt(lsBestStreakKey(pool), bestStreak);
  }, [bestStreak, pool, hydrated]);

  React.useEffect(() => {
    // When settings change, generate a new prompt to match intent.
    setPrompt(randomPrompt(mode, pool));
    setAnswer("");
    setFeedback(null);
    setQuestionNumber(1);
    setCompleted(0);
    setSolvedThisQuestion(false);
    setAttempts(0);
    setRunStartedAt(null);
    setCorrect(0);
    setStreak(0);
  }, [mode, pool]);

  const next = React.useCallback(() => {
    setCompleted((c) => {
      if (c >= TOTAL_QUESTIONS) return c;

      const nextCompleted = c + 1;
      const clamped =
        nextCompleted > TOTAL_QUESTIONS ? TOTAL_QUESTIONS : nextCompleted;

      // If they advance without solving, break the streak.
      if (!solvedThisQuestion) setStreak(0);

      if (clamped >= TOTAL_QUESTIONS) {
        // Game over. Keep last prompt visible but disable interactions.
        setFeedback(null);
        return clamped;
      }

      setQuestionNumber((q) => q + 1);
      setPrompt(randomPrompt(mode, pool));
      setAnswer("");
      setFeedback(null);
      setSolvedThisQuestion(false);

      return clamped;
    });
  }, [mode, pool, solvedThisQuestion]);

  const resetStats = React.useCallback(() => {
    setCompleted(0);
    setQuestionNumber(1);
    setRunStartedAt(null);
    setAttempts(0);
    setCorrect(0);
    setStreak(0);
    setSolvedThisQuestion(false);
    setFeedback(null);
    setPrompt(randomPrompt(mode, pool));
    setAnswer("");
  }, [mode, pool]);

  const doCheck = React.useCallback(() => {
    if (completed >= TOTAL_QUESTIONS) return;
    if (solvedThisQuestion) return;
    if (runStartedAt === null) setRunStartedAt(Date.now());

    // Every check counts as an attempt (correct or not).
    setAttempts((n) => n + 1);

    const res = checkAnswer(prompt, answer);

    if (res.ok) {
      // Only count the first correct solve per question.
      if (!solvedThisQuestion) {
        setSolvedThisQuestion(true);
        setCorrect((c) => c + 1);
        setStreak((s) => {
          const nextStreak = s + 1;
          setBestStreak((b) => (nextStreak > b ? nextStreak : b));
          return nextStreak;
        });
      }
    } else {
      // Incorrect attempts break streak in this quiz.
      setStreak(0);
    }

    // Do not leak the expected answer in feedback.
    setFeedback({
      ok: res.ok,
      msg: res.ok ? "Correct" : "Not quite. Try again.",
    });
  }, [prompt, answer, runStartedAt, solvedThisQuestion, completed]);

  const progress = Math.min(
    TOTAL_QUESTIONS,
    completed + (solvedThisQuestion ? 1 : 0),
  );
  const accuracy =
    attempts > 0 ? Math.min(100, Math.round((correct / attempts) * 100)) : 0;
  const gameOver = completed >= TOTAL_QUESTIONS;
  const questionsShown = gameOver ? TOTAL_QUESTIONS : questionNumber;

  const placeholder =
    prompt.kind === "text_to_morse"
      ? "Type Morse here (e.g., ... --- ...) ~ Tip: press Enter to check"
      : "Type text here (e.g., SOS) ~ Tip: press Enter to check";

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
    <></>
  );

  return (
    <div className=" ">
      <section className="mw-tool-section overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="tool-header flex flex-col gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <span className="h-px w-8 bg-sky-800" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
              Practice drill
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
            Morse Code Practice (Quiz)
          </h1>
          <p className="hidden text-base leading-relaxed text-slate-700 sm:flex sm:text-lg">
            A focused 10-question Morse quiz. One prompt at a time with instant
            feedback.
          </p>
        </div>

        {/* Top control bar: match Audio page density */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setMode("text_to_morse")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "text_to_morse"
                  ? "bg-white border border-slate-200 text-sky-950 shadow-sm"
                  : "text-slate-700 hover:bg-white/70"
              }`}
            >
              Text → Morse
            </button>
            <button
              type="button"
              onClick={() => setMode("morse_to_text")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "morse_to_text"
                  ? "bg-white border border-slate-200 text-sky-950 shadow-sm"
                  : "text-slate-700 hover:bg-white/70"
              }`}
            >
              Morse → Text
            </button>
            <button
              type="button"
              onClick={() => setMode("mixed")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "mixed"
                  ? "bg-white border border-slate-200 text-sky-950 shadow-sm"
                  : "text-slate-700 hover:bg-white/70"
              }`}
            >
              Mixed
            </button>
          </div>

          <div className="sm:ml-auto text-sm text-slate-700 flex flex-wrap items-center gap-3 justify-end">
            <span className="hidden sm:inline">
              Questions:{" "}
              <span className="font-semibold text-sky-900">
                {questionsShown}/{TOTAL_QUESTIONS}
              </span>
            </span>
            <span className="hidden sm:inline">
              Attempts:{" "}
              <span className="font-semibold text-sky-900">{attempts}</span>
            </span>
            <span className="hidden sm:inline">
              Correct:{" "}
              <span className="font-semibold text-sky-900">{correct}</span>
            </span>
            <span className="hidden sm:inline">
              Accuracy:{" "}
              <span className="font-semibold text-sky-900">{accuracy}%</span>
            </span>

            <span>
              Streak:{" "}
              <span className="font-semibold text-sky-900">{streak}</span>
            </span>
            <span className="hidden sm:inline">
              Best:{" "}
              <span className="font-semibold text-sky-900">{bestStreak}</span>
            </span>

            <ShareResultsButton
              title="Morse Code Practice"
              subtitle="Results summary"
              stats={{
                attempts,
                correct,
                progress,
                streak,
                bestStreak,
                totalQuestions: TOTAL_QUESTIONS,
              }}
              runStartedAt={runStartedAt}
            />
          </div>
        </div>

        {/* Main drill panel */}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          {gameOver ? (
            <div className="rounded-2xl border border-slate-200 bg-sky-50/70 p-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-sky-950">
                  Quiz complete
                </div>
                <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-sky-950">
                  Your results
                </h2>
                <p className="mt-1 text-sm sm:text-base text-gray-700">
                  10 questions, unlimited attempts per question. Accuracy
                  reflects all attempts.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-600">
                    Questions
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-900">
                    {TOTAL_QUESTIONS}/{TOTAL_QUESTIONS}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-600">
                    Attempts
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-900">
                    {attempts}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-600">
                    Correct
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-900">
                    {correct}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-600">
                    Accuracy
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-900">
                    {accuracy}%
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-600">
                    Best streak
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-900">
                    {bestStreak}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-600">
                    Final streak
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-900">
                    {streak}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={resetStats}
                  aria-label="Try again"
                >
                  Try again
                </Button>
                <ShareResultsButton
                  title="Morse Code Practice"
                  subtitle="Results summary"
                  stats={{
                    attempts,
                    correct,
                    progress: TOTAL_QUESTIONS,
                    streak,
                    bestStreak,
                    totalQuestions: TOTAL_QUESTIONS,
                  }}
                  runStartedAt={runStartedAt}
                />
              </div>
            </div>
          ) : (
            <>
              <PromptCard
                prompt={prompt}
                questionNumber={questionNumber}
                totalQuestions={TOTAL_QUESTIONS}
              />

              <div className="mt-5">
                <label className="text-sky-900 font-bold">
                  Your answer (
                  {prompt.kind === "text_to_morse" ? "Morse" : "Text"})
                </label>

                <input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={placeholder}
                  className="w-full mt-2 rounded-xl p-3 font-mono border border-sky-500 outline-sky-500"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    if (solvedThisQuestion) {
                      next();
                      return;
                    }
                    if (!answer.trim()) return;
                    doCheck();
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="text"
                  aria-label="Practice answer"
                />

                <div className="mt-3 flex flex-wrap gap-3">
                  {!solvedThisQuestion ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={doCheck}
                      disabled={!answer.trim()}
                      aria-label="Check answer"
                    >
                      Check
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={next}
                      aria-label="Next prompt"
                    >
                      {progress + 1 >= TOTAL_QUESTIONS ? "Finish" : "Next"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAnswer("")}
                    disabled={!answer}
                    aria-label="Clear answer"
                  >
                    Clear
                  </Button>
                </div>

                {statusBadge}
              </div>
            </>
          )}

          {/* Drill options (always visible) */}
          <div className="mt-6 border-t border-gray-200 pt-5">
            <div className="text-sm font-semibold text-neutral-900">
              Drill options (Quiz settings)
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:items-start">
              <div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ToggleChip
                    label="All"
                    active={pool === "all"}
                    onClick={() => setPool("all")}
                    title="Mixes letters, numbers, signals, words, and sentences"
                  />
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
                  <ToggleChip
                    label="Sentences"
                    active={pool === "sentences"}
                    onClick={() => setPool("sentences")}
                    title="Short, radio-realistic sentences"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={next}
                  disabled={gameOver || solvedThisQuestion}
                  aria-label="Skip question"
                >
                  Skip question
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetStats}
                  aria-label="Restart quiz"
                >
                  Restart (10 questions)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksPractice />
      <PracticeFaq />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
