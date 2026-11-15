import { useLocation } from "react-router";
import { captureReviewAnswer } from "~/client/components/learning/reviewSubmission";
import AnswerComparison, { type SubmittedAnswer } from "~/client/components/learning/AnswerComparison";
import { useLearningSessionIntent } from "~/client/components/learning/useLearningSessionIntent";
import LearningSessionChooser from "~/client/components/learning/LearningSessionChooser";
import type { LearningSession } from "~/client/components/learning/learningSessions";
import * as React from "react";

import { PostPrimaryContentBannerAd } from "~/client/components/ads/AdSenseAds";
import ToggleChip from "~/client/components/shared/ToggleChip";
import { ActionButton } from "~/client/components/shared/ActionControls";
import {
  ActionLinks,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import {
  ToolButton,
  ToolPanel,
  toolControlButtonClass,
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
  readStoredEnum,
  readStoredNumber,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";

import {
  checkAnswer,
  deterministicPrompt,
  randomPrompt,
} from "~/client/components/practice/practiceEngine";

const ReviewQueuePanel = React.lazy(() => import("~/client/components/learning/ReviewQueuePanel"));

const LS_POOL = "mw_practice_pool";
const lsModeKey = (pool: string) => `mw_practice_mode_${pool}`;
const lsBestStreakKey = (pool: string) => `mw_practice_best_streak_${pool}`;

const TOTAL_QUESTIONS = 10;
const DEFAULT_POOL: Pool = "all";
const POOLS: readonly Pool[] = [
  "starter",
  "all",
  "letters",
  "numbers",
  "signals",
  "words",
  "sentences",
] as const;
const DRILL_MODES: readonly DrillMode[] = [
  "text_to_morse",
  "morse_to_text",
  "mixed",
] as const;

const defaultModeForPool = (pool: Pool): DrillMode => {
  // Words are primarily an encoding drill; default to Text → Morse.
  return pool === "words" || pool === "sentences" ? "text_to_morse" : "mixed";
};
const DEFAULT_MODE: DrillMode = defaultModeForPool(DEFAULT_POOL);

function readStoredPool(): Pool {
  return readStoredEnum(LS_POOL, POOLS, DEFAULT_POOL);
}

function readStoredMode(pool: Pool): DrillMode {
  return readStoredEnum(lsModeKey(pool), DRILL_MODES, defaultModeForPool(pool));
}

function writeStr(key: string, val: string) {
  safeWriteStorage(key, val);
}

function readInt(key: string, fallback: number) {
  return readStoredNumber(key, {
    fallback,
    min: 0,
    max: 9999,
    integer: true,
  });
}

function writeInt(key: string, val: number) {
  writeStr(key, String(val));
}

export default function PracticePage({ jsonLd }: { jsonLd: unknown }) {
  const location = useLocation();
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const reviewRef = React.useRef<HTMLElement>(null);
  function openReview() { setReviewOpen(true); requestAnimationFrame(() => { reviewRef.current?.focus(); reviewRef.current?.scrollIntoView({ block: "start" }); }); }
  React.useEffect(() => { if (location.hash === "#review-queue") openReview(); }, [location.hash]);
  const readSessionIntent = useLearningSessionIntent("/practice");
  const answerRef = React.useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = React.useState<SubmittedAnswer | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  const [{ pool, mode, bestStreak }, setDrill] = React.useState({
    pool: DEFAULT_POOL, mode: DEFAULT_MODE, bestStreak: 0,
  });

  const [prompt, setPrompt] = React.useState<Prompt>(() =>
    deterministicPrompt(DEFAULT_MODE, DEFAULT_POOL),
  );
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
  function setBestStreak(value: React.SetStateAction<number>) {
    setDrill(previous => ({ ...previous, bestStreak: typeof value === "function" ? value(previous.bestStreak) : value }));
  }
  function configureDrill(nextPool: Pool, nextMode: DrillMode) {
    setDrill({ pool: nextPool, mode: nextMode, bestStreak: nextPool === pool ? bestStreak : readInt(lsBestStreakKey(nextPool), 0) });
    resetRun(nextMode, nextPool);
  }
  function setPool(nextPool: Pool) { if (nextPool !== pool) configureDrill(nextPool, readStoredMode(nextPool)); }
  function setMode(nextMode: DrillMode) { if (nextMode !== mode) configureDrill(pool, nextMode); }
  function focusExercise() {
    requestAnimationFrame(() => { const target = answerRef.current ?? document.getElementById("practice-workspace"); target?.focus(); target?.scrollIntoView({ block: "center", behavior: "auto" }); });
  }
  function startSession(session: LearningSession) {
    if (session.id === "review") { openReview(); return true; }
    if (!session.practice) return false;
    configureDrill(session.practice.pool, session.practice.mode);
    focusExercise();
    return true;
  }

  React.useEffect(() => {
    const intent = readSessionIntent()?.practice;
    const storedPool = intent?.pool ?? readStoredPool();
    const storedMode = intent?.mode ?? readStoredMode(storedPool);
    setDrill({ pool: storedPool, mode: storedMode, bestStreak: readInt(lsBestStreakKey(storedPool), 0) });
    resetRun(storedMode, storedPool);
    setHydrated(true);
    if (intent) focusExercise();
  }, [readSessionIntent]);

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
    writeStr(lsModeKey(pool), mode);
    writeInt(lsBestStreakKey(pool), bestStreak);
  }, [pool, mode, bestStreak, hydrated]);

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
        setFeedback(null); setSubmitted(null);
        return clamped;
      }

      setQuestionNumber((q) => q + 1);
      setPrompt(randomPrompt(mode, pool));
      setAnswer("");
      setFeedback(null); setSubmitted(null);
      setSolvedThisQuestion(false);

      return clamped;
    });
  }, [mode, pool, solvedThisQuestion]);

  function resetRun(nextMode: DrillMode, nextPool: Pool) {
    setCompleted(0);
    setQuestionNumber(1);
    setRunStartedAt(null);
    setAttempts(0);
    setCorrect(0);
    setStreak(0);
    setSolvedThisQuestion(false);
    setFeedback(null); setSubmitted(null);
    setPrompt(randomPrompt(nextMode, nextPool));
    setAnswer("");
  }
  const resetStats = () => resetRun(mode, pool);

  const doCheck = React.useCallback(() => {
    if (completed >= TOTAL_QUESTIONS) return;
    if (solvedThisQuestion) return;
    if (runStartedAt === null) setRunStartedAt(Date.now());

    // Every check counts as an attempt (correct or not).
    setAttempts((n) => n + 1);

    const res = checkAnswer(prompt, answer);
    setSubmitted(captureReviewAnswer({ expected: res.normalizedExpected, attempted: res.normalizedGot, correct: res.ok, kind: prompt.kind === "text_to_morse" ? "morse" : "text" }, { source: "practice", mode: prompt.kind, target: prompt.plain, private: false }));

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

    // Keep the compact status separate from the optional comparison.
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
            Morse Code Practice
          </h1>
          <p className={HERO_LEAD_CLASS}>
            Flexible 10-question drills for letters, words, spacing, and Morse
            recall.
          </p>
        </div>

        <LearningSessionChooser onChoose={startSession} onSkip={focusExercise} />
        <section ref={reviewRef} id="review-queue" tabIndex={-1} className="my-6" aria-label="Review queue">
          <ToolButton aria-expanded={reviewOpen} aria-controls="review-queue-content" onClick={() => setReviewOpen(value => !value)}>{reviewOpen ? "Hide review queue" : "Show review queue"}</ToolButton>
          {reviewOpen && <div id="review-queue-content"><h2 className="mt-4 text-2xl font-extrabold text-sky-950">Your review queue</h2><React.Suspense fallback={<p role="status">Opening review queue...</p>}><ReviewQueuePanel /></React.Suspense></div>}
        </section>
        <div id="practice-workspace" tabIndex={-1} className="pb-2 pt-4 sm:pb-3 sm:pt-4">
        {/* Top control bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            <button
              type="button"
              onClick={() => setMode("text_to_morse")}
              className={`${toolControlButtonClass({
                active: mode === "text_to_morse",
                size: "sm",
              })} flex-1 sm:flex-none`}
            >
              Text → Morse
            </button>
            <button
              type="button"
              onClick={() => setMode("morse_to_text")}
              className={`${toolControlButtonClass({
                active: mode === "morse_to_text",
                size: "sm",
              })} flex-1 sm:flex-none`}
            >
              Morse → Text
            </button>
            <button
              type="button"
              onClick={() => setMode("mixed")}
              className={`${toolControlButtonClass({
                active: mode === "mixed",
                size: "sm",
              })} flex-1 sm:flex-none`}
            >
              Mixed
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700 lg:justify-end">
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
                <ActionButton
                  type="button"
                  tone="dark"
                  onClick={resetStats}
                  aria-label="Try again"
                >
                  Try again
                </ActionButton>
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
                forceDarkPrompt
              />

              <div className="mt-5">
                <ToolPanel
                  label={`Your answer (${prompt.kind === "text_to_morse" ? "Morse" : "Text"})`}
                >
                  <input
                    ref={answerRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={placeholder}
                    className="mw-tool-input-surface w-full border-0 bg-transparent px-4 pb-5 pt-2 font-mono text-slate-950 outline-none transition focus:ring-0 focus-visible:outline-none"
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

                <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {!solvedThisQuestion ? (
                      <ToolButton
                        type="button"
                        tone="dark"
                        onClick={doCheck}
                        disabled={!answer.trim()}
                        aria-label="Check answer"
                      >
                        Check
                      </ToolButton>
                    ) : (
                      <ToolButton
                        type="button"
                        tone="dark"
                        onClick={next}
                        aria-label="Next prompt"
                      >
                        {progress + 1 >= TOTAL_QUESTIONS ? "Finish" : "Next"}
                      </ToolButton>
                    )}
                    <ActionButton
                      type="button"
                      onClick={() => setAnswer("")}
                      disabled={!answer}
                      aria-label="Clear answer"
                    >
                      Clear
                    </ActionButton>
                    <ToolButton
                      type="button"
                      onClick={next}
                      disabled={solvedThisQuestion}
                      aria-label="Skip question"
                    >
                      Skip
                    </ToolButton>
                    <ActionButton
                      type="button"
                      onClick={resetStats}
                      aria-label="Restart quiz"
                    >
                      Restart
                    </ActionButton>
                  </div>

                  <div
                    className="flex flex-wrap gap-2 lg:justify-end"
                    aria-label="Drill options"
                  >
                    <ToggleChip
                      label="First characters"
                      active={pool === "starter"}
                      onClick={() => setPool("starter")}
                      title="E, T, A, N, I, M, S and O"
                    />
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

                {statusBadge}
                {submitted && <AnswerComparison key={attempts} answer={submitted} optional={!submitted.correct} />}
              </div>
            </>
          )}

        </div>
        </div>
      </section>
      <PostPrimaryContentBannerAd local />
      <HowItWorksPractice />
      <SectionCard
        eyebrow="Assessment"
        title="Ready to test a specific Morse skill?"
        description="Use the test hub when general practice shows a pattern and you need to choose listening, typing, visual, word, or plan-based assessment."
      >
        <ActionLinks
          links={[
            { href: "/morse-code-test", label: "Choose a Morse code test", primary: true },
            { href: "/morse-code-audio-quiz", label: "Audio quiz" },
            { href: "/typing", label: "Typing practice" },
          ]}
        />
      </SectionCard>
      <PracticeFaq />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
