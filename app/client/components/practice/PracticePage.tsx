import * as React from "react";

import Button from "~/client/components/shared/Button";
import ToggleChip from "~/client/components/shared/ToggleChip";
import { ToolPanel } from "~/client/components/shared/ToolWorkspace";
import {
  HERO_EYEBROW_LINE_CLASS,
  HERO_EYEBROW_ROW_CLASS,
  HERO_EYEBROW_TEXT_CLASS,
  HERO_HEADER_CLASS,
  HERO_LEAD_CLASS,
  HERO_SECTION_CLASS,
  HERO_TITLE_CLASS,
} from "~/client/components/shared/heroStyles";
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

function readStoredPool(): Pool {
  const poolRaw = readStr(LS_POOL, "all");
  return poolRaw === "all" ||
    poolRaw === "letters" ||
    poolRaw === "numbers" ||
    poolRaw === "signals" ||
    poolRaw === "words" ||
    poolRaw === "sentences"
    ? (poolRaw as Pool)
    : "all";
}

function readStoredMode(pool: Pool): DrillMode {
  const modeRaw = readStr(lsModeKey(pool), defaultModeForPool(pool));
  return modeRaw === "text_to_morse" ||
    modeRaw === "morse_to_text" ||
    modeRaw === "mixed"
    ? (modeRaw as DrillMode)
    : defaultModeForPool(pool);
}

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
  const initialPool = React.useMemo(() => readStoredPool(), []);
  const initialMode = React.useMemo(
    () => readStoredMode(initialPool),
    [initialPool],
  );
  const [hydrated, setHydrated] = React.useState(false);

  const [pool, setPool] = React.useState<Pool>(initialPool);
  const [mode, setMode] = React.useState<DrillMode>(initialMode);

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
  const [bestStreak, setBestStreak] = React.useState(() =>
    readInt(lsBestStreakKey(initialPool), 0),
  );

  React.useEffect(() => {
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
        "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
        feedback.ok
          ? "bg-[#e0f2fe] text-sky-950"
          : "bg-[#fffaf2] text-slate-800",
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
    <div>
      <section className={HERO_SECTION_CLASS}>
        <div className={HERO_HEADER_CLASS}>
          <div className={HERO_EYEBROW_ROW_CLASS}>
            <span className={HERO_EYEBROW_LINE_CLASS} />
            <span className={HERO_EYEBROW_TEXT_CLASS}>
              Practice drill
            </span>
          </div>
          <h1 className={HERO_TITLE_CLASS}>
            Morse Code Practice (Quiz)
          </h1>
          <p className={HERO_LEAD_CLASS}>
            A focused 10-question Morse quiz. One prompt at a time with instant
            feedback.
          </p>
        </div>

        <div className="pb-4 pt-4 sm:pb-5 sm:pt-4">
        {/* Top control bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setMode("text_to_morse")}
              className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "text_to_morse"
                  ? "bg-slate-950 text-sky-100"
                  : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
              }`}
            >
              Text → Morse
            </button>
            <button
              type="button"
              onClick={() => setMode("morse_to_text")}
              className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "morse_to_text"
                  ? "bg-slate-950 text-sky-100"
                  : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
              }`}
            >
              Morse → Text
            </button>
            <button
              type="button"
              onClick={() => setMode("mixed")}
              className={`px-3 py-2 rounded-md text-sm font-semibold cursor-pointer transition w-1/3 sm:w-auto ${
                mode === "mixed"
                  ? "bg-slate-950 text-sky-100"
                  : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
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
        <div className="mt-4">
          {gameOver ? (
            <div className="mw-static-surface-soft rounded-xl bg-[#fffaf2]/45 p-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full bg-[#fffdf8] px-3 py-1 text-sm font-semibold text-sky-950">
                  Quiz complete
                </div>
                <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-sky-950">
                  Your results
                </h2>
                <p className="mt-1 text-sm text-slate-700 sm:text-base">
                  10 questions, unlimited attempts per question. Accuracy
                  reflects all attempts.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Questions
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-sky-950">
                    {TOTAL_QUESTIONS}/{TOTAL_QUESTIONS}
                  </div>
                </div>
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Attempts
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-sky-950">
                    {attempts}
                  </div>
                </div>
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Correct
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-sky-950">
                    {correct}
                  </div>
                </div>
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Accuracy
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-sky-950">
                    {accuracy}%
                  </div>
                </div>
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Best streak
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-sky-950">
                    {bestStreak}
                  </div>
                </div>
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Final streak
                  </div>
                  <div className="mt-1 text-3xl font-extrabold text-sky-950">
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
                <ToolPanel
                  label={`Your answer (${prompt.kind === "text_to_morse" ? "Morse" : "Text"})`}
                  badge="Source"
                >
                  <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={placeholder}
                    className="w-full border-0 bg-transparent px-4 pb-5 pt-2 font-mono text-slate-950 outline-none transition focus:ring-0 focus-visible:outline-none"
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
                </ToolPanel>

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
            <div className="mt-6 pt-5">
            <div className="text-sm font-extrabold text-sky-950">
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
        </div>
      </section>

      <HowItWorksPractice />
      <PracticeFaq />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
