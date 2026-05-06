import * as React from "react";
import type { Route } from "./+types/morse-code-audio-quiz";

import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import {
  audioDifficultyOptions,
  buildPromptDeck,
  getAudioPrompts,
  isAudioDifficulty,
  normalizeAudioAnswer,
  promptTypeLabel,
  type AudioDifficulty,
} from "~/client/components/audioPractice/audioPromptBank";
import { textToMorse } from "~/client/components/shared/morseUtils";
import styles from "~/client/components/shared/pageStyles";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import {
  CheckCircleIcon,
  LightBulbIcon,
  LoopIcon,
  PlayIcon,
  RefreshIcon,
  SoundIcon,
  StopIcon,
} from "~/client/assets/svg/Icons";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-quiz";
const STROBE_WARNING_ID = "audio-quiz-strobe-warning";
const DIFFICULTY_STORAGE_KEY = "mw_audio_quiz_difficulty";
const BEST_STREAK_STORAGE_KEY = "mw_audio_quiz_best_streak";
const TOTAL_QUESTIONS = 10;

type FeedbackState = "idle" | "correct" | "missed";

const faqItems = [
  {
    q: "How does the Morse code audio quiz work?",
    a: "The quiz plays a hidden Morse prompt. You type what you heard, check the answer, and MorseWords tracks score, attempts, accuracy, streak, and shareable results.",
  },
  {
    q: "What do the audio quiz difficulty levels change?",
    a: "Beginner uses letters, numbers, and tiny groups. Easy adds short words and common signals. Medium adds longer words and short sentences. Hard adds Q-codes, longer copy, and tougher sentences.",
  },
  {
    q: "Does the audio quiz support Farnsworth spacing?",
    a: "Yes. Character speed controls the dits and dahs, while Farnsworth spacing slows only the gaps between letters and words.",
  },
  {
    q: "How is this different from audio practice?",
    a: "Audio practice is open-ended and built for repetition. The audio quiz is a fixed scored test, so it is better for checking your current listening level.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Quiz | Test Listening Accuracy",
    description:
      "Take a scored Morse code audio quiz with hidden prompts, difficulty levels, WPM, Farnsworth spacing, streak tracking, and shareable results.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio quiz, morse listening test, morse code test audio, farnsworth morse quiz",
  });
}

export default function MorseCodeAudioQuiz() {
  const player = useMorseAudio();
  const [difficulty, setDifficulty] = React.useState<AudioDifficulty>(() =>
    readStoredDifficulty(DIFFICULTY_STORAGE_KEY, "easy"),
  );
  const [deckSeed, setDeckSeed] = React.useState(() => Date.now());
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [feedback, setFeedback] = React.useState<FeedbackState>("idle");
  const [attempts, setAttempts] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [skipped, setSkipped] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);
  const [runStartedAt, setRunStartedAt] = React.useState<number | null>(null);

  const [charWpm, setCharWpm] = React.useState(18);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(12);
  const [toneHz, setToneHz] = React.useState(650);
  const [volume, setVolume] = React.useState(0.75);
  const [preset, setPreset] = React.useState<SoundPreset>("cw_radio");
  const [attackMs, setAttackMs] = React.useState(8);
  const [releaseMs, setReleaseMs] = React.useState(12);
  const [repeat, setRepeat] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(true);
  const [flash, setFlash] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const promptPool = React.useMemo(() => getAudioPrompts(difficulty), [difficulty]);
  const deck = React.useMemo(
    () => buildPromptDeck(promptPool, TOTAL_QUESTIONS, deckSeed),
    [promptPool, deckSeed],
  );
  const prompt = deck[Math.min(index, TOTAL_QUESTIONS - 1)];
  const morse = React.useMemo(() => textToMorse(prompt.text), [prompt.text]);
  const normalizedAnswer = normalizeAudioAnswer(answer);
  const expectedAnswer = normalizeAudioAnswer(prompt.text);
  const isCorrect = normalizedAnswer === expectedAnswer;
  const currentProgress = Math.min(completed + (feedback !== "idle" ? 1 : 0), TOTAL_QUESTIONS);
  const gameOver = completed >= TOTAL_QUESTIONS;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const durationMs = player.estimateDurationMs({
    code: morse,
    wpm: charWpm,
    farnsworthWpm,
  });

  React.useEffect(() => {
    try {
      window.localStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
    } catch {
      // local-only preference; ignore storage failures
    }
  }, [difficulty]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BEST_STREAK_STORAGE_KEY);
      const parsed = raw ? Number(raw) : 0;
      if (Number.isFinite(parsed)) setBestStreak(parsed);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(BEST_STREAK_STORAGE_KEY, String(bestStreak));
    } catch {
      // ignore
    }
  }, [bestStreak]);

  React.useEffect(() => {
    resetQuiz({ preserveDifficulty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  React.useEffect(() => {
    const anyPlayer = player as typeof player & {
      setLiveOptions?: (options: unknown) => void;
    };
    anyPlayer.setLiveOptions?.({
      code: morse,
      wpm: charWpm,
      farnsworthWpm,
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash,
      attackMs,
      releaseMs,
    });
  }, [
    player,
    morse,
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    soundOn,
    preset,
    repeat,
    flash,
    attackMs,
    releaseMs,
  ]);

  React.useEffect(() => {
    if (!flash) return;
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { ms?: number } | undefined;
      const ms = detail?.ms ?? 0;
      const el = document.getElementById("mw_audio_quiz_flash");
      if (!el || !ms) return;
      el.classList.remove("opacity-0");
      el.classList.add("opacity-100");
      window.setTimeout(() => {
        el.classList.remove("opacity-100");
        el.classList.add("opacity-0");
      }, ms);
    };
    window.addEventListener("morsewords:flash", handler as EventListener);
    return () =>
      window.removeEventListener("morsewords:flash", handler as EventListener);
  }, [flash]);

  async function playPrompt() {
    if (runStartedAt === null) setRunStartedAt(Date.now());
    await player.play({
      code: morse,
      wpm: charWpm,
      farnsworthWpm,
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash,
      attackMs,
      releaseMs,
    });
  }

  function checkAnswer() {
    if (gameOver || feedback !== "idle" || !normalizedAnswer) return;
    if (runStartedAt === null) setRunStartedAt(Date.now());
    setAttempts((value) => value + 1);
    if (isCorrect) {
      setFeedback("correct");
      setCorrect((value) => value + 1);
      setStreak((value) => {
        const next = value + 1;
        setBestStreak((best) => (next > best ? next : best));
        return next;
      });
      return;
    }
    setFeedback("missed");
    setStreak(0);
  }

  function nextQuestion() {
    player.stop();
    if (feedback === "idle") {
      setSkipped((value) => value + 1);
      setStreak(0);
    }
    const nextCompleted = completed + 1;
    setCompleted(nextCompleted);
    setAnswer("");
    setFeedback("idle");
    if (nextCompleted < TOTAL_QUESTIONS) setIndex((value) => value + 1);
  }

  function resetQuiz(_: { preserveDifficulty?: boolean } = {}) {
    player.stop();
    setDeckSeed(Date.now());
    setIndex(0);
    setAnswer("");
    setFeedback("idle");
    setAttempts(0);
    setCorrect(0);
    setCompleted(0);
    setSkipped(0);
    setStreak(0);
    setRunStartedAt(null);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Morse Code Audio Quiz",
    url: canonicalUrl(CANONICAL_PATH),
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      {flash ? (
        <div
          id="mw_audio_quiz_flash"
          className="pointer-events-none fixed inset-0 z-50 bg-white opacity-0 transition-opacity duration-75"
        />
      ) : null}

      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio test"
          title="Morse code audio quiz"
          description="Test Morse listening recall with hidden audio prompts. Pick a difficulty, play each signal, type what you copied, and get a scored result."
          aside={
            <DarkNote label="Score" value={`${correct}/${TOTAL_QUESTIONS}`}>
              {audioDifficultyOptions.find((option) => option.value === difficulty)?.label}{" "}
              quiz. Current prompt time is about {formatMs(durationMs)}.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              {
                href: "/morse-code-audio-practice",
                label: "Audio practice",
                primary: true,
              },
              { href: "/morse-code-visual-quiz", label: "Visual quiz" },
            ]}
          />
        </PageHero>

        <section className="mw-static-surface-soft mt-8 rounded-xl bg-[#fffaf2]/45 px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {audioDifficultyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  className={
                    "min-h-11 cursor-pointer rounded-xl px-4 py-2 font-semibold transition focus:outline-none " +
                    (difficulty === option.value
                      ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                      : "bg-[#fffdf8] text-slate-800 hover:bg-slate-900 hover:text-sky-100")
                  }
                  aria-pressed={difficulty === option.value}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <span>
                Question{" "}
                <strong className="text-sky-950">
                  {Math.min(completed + 1, TOTAL_QUESTIONS)}/{TOTAL_QUESTIONS}
                </strong>
              </span>
              <span>
                Attempts <strong className="text-sky-950">{attempts}</strong>
              </span>
              <span>
                Accuracy <strong className="text-sky-950">{accuracy}%</strong>
              </span>
              <span>
                Streak <strong className="text-sky-950">{streak}</strong>
              </span>
              <ShareResultsButton
                title="Morse Code Audio Quiz"
                subtitle={`${difficultyLabel(difficulty)} listening quiz`}
                stats={{
                  attempts,
                  correct,
                  progress: currentProgress,
                  streak,
                  bestStreak,
                  totalQuestions: TOTAL_QUESTIONS,
                }}
                runStartedAt={runStartedAt}
              />
            </div>
          </div>

          {gameOver ? (
            <QuizComplete
              attempts={attempts}
              correct={correct}
              skipped={skipped}
              accuracy={accuracy}
              streak={streak}
              bestStreak={bestStreak}
              difficulty={difficulty}
              runStartedAt={runStartedAt}
              onReset={() => resetQuiz()}
            />
          ) : (
            <>
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label
                      htmlFor="mw_audio_quiz_answer"
                      className="text-sm font-extrabold text-sky-950"
                    >
                      Your answer
                    </label>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      {promptTypeLabel(prompt.type)}
                    </span>
                  </div>
                  <textarea
                    id="mw_audio_quiz_answer"
                    value={answer}
                    onChange={(event) => {
                      if (feedback === "idle") setAnswer(event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                        event.preventDefault();
                        if (feedback === "idle") checkAnswer();
                        else nextQuestion();
                      }
                    }}
                    placeholder="Type what you heard"
                    readOnly={feedback !== "idle"}
                    className="min-h-[11rem] w-full resize-y bg-transparent font-mono text-lg text-slate-950 outline-none placeholder:text-slate-500 focus:ring-0 read-only:cursor-default"
                  />
                </div>

                <div className="rounded-xl bg-slate-950 p-4 text-sky-100">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-extrabold text-slate-100">
                      Playback
                    </h2>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                      Hidden prompt
                    </span>
                  </div>
                  <div className="min-h-[11rem] text-sm leading-relaxed text-slate-200">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                      {difficultyLabel(difficulty)} {promptTypeLabel(prompt.type)}
                    </p>
                    {feedback === "idle" ? (
                      <p className="mt-4 max-w-lg text-base">
                        Listen to the signal, then type what you copied. The
                        answer stays hidden until you check it.
                      </p>
                    ) : (
                      <div className="mt-4">
                        <p className="font-semibold text-sky-100">
                          {feedback === "correct"
                            ? "Correct."
                            : "Not quite. Expected:"}{" "}
                          {prompt.text}
                        </p>
                        <p className="mt-3 font-mono text-sm font-bold tracking-[0.16em] text-sky-100">
                          {morse}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-right text-sm text-slate-600">
                Prompt stays hidden until you check. Press Ctrl+Enter to check or continue.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={playPrompt}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none"
                >
                  <PlayIcon size={20} title="Play prompt" />
                  {player.state === "playing" ? "Restart prompt" : "Play prompt"}
                </button>
                <button
                  type="button"
                  onClick={player.stop}
                  disabled={player.state === "idle"}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#fffdf8] px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  <StopIcon size={20} title="Stop audio" />
                  Stop
                </button>
                {feedback === "idle" ? (
                  <button
                    type="button"
                    onClick={checkAnswer}
                    disabled={!normalizedAnswer}
                    className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#fffdf8] px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    <CheckCircleIcon size={20} title="Check answer" />
                    Check answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none"
                  >
                    <LoopIcon size={20} title="Next question" />
                    {completed + 1 >= TOTAL_QUESTIONS ? "Finish quiz" : "Next question"}
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p
                  className={
                    "min-h-10 text-sm font-semibold " +
                    (feedback === "correct"
                      ? "text-sky-950"
                      : feedback === "missed"
                        ? "text-slate-800"
                        : "text-slate-500")
                  }
                >
                  {feedback === "correct"
                    ? "Correct. Continue when ready."
                    : feedback === "missed"
                      ? "Not quite. Review the answer, then continue."
                      : "Answer by ear before checking."}
                </p>
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={feedback !== "idle"}
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#fffdf8] px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  <RefreshIcon size={18} title="Skip question" />
                  Skip question
                </button>
              </div>
            </>
          )}

          <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-sky-950">
                Audio quiz settings
              </h3>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {player.state === "idle" ? "Ready" : player.state}
              </span>
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <SliderRow
                label="Character speed"
                value={charWpm}
                min={5}
                max={40}
                step={1}
                unit="WPM"
                onChange={setCharWpm}
              />
              <SliderRow
                label="Farnsworth spacing"
                value={farnsworthWpm}
                min={5}
                max={40}
                step={1}
                unit="WPM"
                onChange={setFarnsworthWpm}
                help="Slows spacing only."
              />
              <SliderRow
                label="Pitch"
                value={toneHz}
                min={300}
                max={1000}
                step={10}
                unit="Hz"
                onChange={setToneHz}
                disabled={!soundOn || preset === "sounder"}
              />
              <SliderRow
                label="Volume"
                value={Math.round(volume * 100)}
                min={0}
                max={100}
                step={1}
                unit="%"
                onChange={(value) => setVolume(value / 100)}
                disabled={!soundOn}
              />
              <SliderRow
                label="Attack"
                value={attackMs}
                min={0}
                max={40}
                step={1}
                unit="ms"
                onChange={setAttackMs}
                disabled={!soundOn || preset === "sounder"}
              />
              <SliderRow
                label="Release"
                value={releaseMs}
                min={0}
                max={80}
                step={1}
                unit="ms"
                onChange={setReleaseMs}
                disabled={!soundOn || preset === "sounder"}
              />
            </div>

            {advancedOpen ? (
              <div className="mt-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_2fr] md:items-end">
                  <label className="block">
                    <span className="text-sm font-extrabold text-sky-950">
                      Sound preset
                    </span>
                    <select
                      value={preset}
                      onChange={(event) => setPreset(event.target.value as SoundPreset)}
                className="mt-2 min-h-11 w-full rounded-xl bg-[#fffdf8] px-3 font-semibold text-slate-950 transition hover:bg-slate-900 hover:text-sky-100"
                    >
                      <option value="cw_radio">CW (Radio)</option>
                      <option value="sine">Sine</option>
                      <option value="square">Square</option>
                      <option value="triangle">Triangle</option>
                      <option value="sawtooth">Sawtooth</option>
                      <option value="sounder">Telegraph sounder</option>
                    </select>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <TogglePill
                      label="Sound"
                      checked={soundOn}
                      onChange={setSoundOn}
                      icon={<SoundIcon size={16} title="Sound" />}
                    />
                    <TogglePill
                      label="Repeat"
                      checked={repeat}
                      onChange={setRepeat}
                      icon={<LoopIcon size={16} title="Repeat" />}
                    />
                    <TogglePill
                      label="Flash"
                      checked={flash}
                      onChange={setFlash}
                      icon={<LightBulbIcon size={16} title="Flash" />}
                      describedBy={flash ? STROBE_WARNING_ID : undefined}
                    />
                  </div>
                </div>
                {flash ? <StrobeWarning id={STROBE_WARNING_ID} className="mt-4" /> : null}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setAdvancedOpen((value) => !value)}
              className="mt-5 min-h-11 w-full cursor-pointer rounded-lg bg-[#fffdf8] px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
            >
              {advancedOpen ? "Hide advanced settings" : "Show advanced settings"}
            </button>
          </div>
        </section>

        <ToolHowItWorks
          eyebrow="Audio quiz spec"
          title="How this Morse code audio quiz works"
          description="The audio quiz hides each prompt, plays the Morse signal, and scores your copied answer. It is a fixed test, unlike open-ended audio practice."
          referenceLabel="Hidden signal"
          referenceValue="... --- ..."
          referenceText="Listen first, answer from memory, then check."
          chips={[
            { label: "Difficulty", href: "#audio-quiz-difficulty" },
            { label: "Scoring", href: "#audio-quiz-scoring" },
            { label: "Timing", href: "#audio-quiz-timing" },
            { label: "Practice", href: "#audio-quiz-practice" },
          ]}
          summary={[
            {
              title: "Ten hidden prompts",
              text: "Each run uses a shuffled deck from the selected difficulty level.",
            },
            {
              title: "Skill check",
              text: "Score, attempts, accuracy, skips, streak, and best streak show how well you copied by ear.",
            },
            {
              title: "Local audio",
              text: "Playback and answer checking stay in the browser; only the difficulty and best streak are saved locally.",
            },
          ]}
          details={[
            {
              kicker: "Prompt bank",
              title: "Difficulty",
              text: "Beginner focuses on letters, numbers, and tiny groups. Easy adds short words and common signals. Medium adds longer words and sentences. Hard adds Q-codes and tougher copy.",
            },
            {
              kicker: "Result model",
              title: "Scoring",
              text: "A checked answer counts as an attempt. Correct answers raise your score and streak. Skipped prompts move the quiz forward without adding a correct answer.",
            },
            {
              kicker: "Copy speed",
              title: "Timing",
              text: "Character speed sets the dit and dah rhythm. Farnsworth spacing slows only the gaps, so you can test at a realistic character rhythm while giving yourself more copy time.",
            },
            {
              kicker: "Next step",
              title: "Practice",
              text: "If the quiz feels rough, switch to audio practice. It uses the same prompt bank and timing controls but keeps the session open-ended for repetition.",
            },
          ]}
        />

        <SectionCard
          eyebrow="After the test"
          title="Use the score to pick the next drill"
          description="If accuracy is low, drop one difficulty level and run open-ended audio practice. If accuracy is steady, move into sentence practice or a faster WPM setting."
        >
          <ActionLinks
            links={[
              {
                href: "/morse-code-audio-practice",
                label: "Audio practice",
                primary: true,
              },
              { href: "/morse-code-sentence-practice", label: "Sentence practice" },
              { href: "/morse-code-practice-plan", label: "Practice plan" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Audio quiz FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
      </main>
    </div>
  );
}

function QuizComplete({
  attempts,
  correct,
  skipped,
  accuracy,
  streak,
  bestStreak,
  difficulty,
  runStartedAt,
  onReset,
}: {
  attempts: number;
  correct: number;
  skipped: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  difficulty: AudioDifficulty;
  runStartedAt: number | null;
  onReset: () => void;
}) {
  return (
    <div className="mw-static-surface-soft mt-6 rounded-xl bg-[#fffaf2]/70 p-5 text-center">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        Quiz complete
      </p>
      <h2 className="mt-2 text-2xl font-extrabold text-sky-950">
        {difficultyLabel(difficulty)} audio quiz results
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Score", `${correct}/${TOTAL_QUESTIONS}`],
          ["Attempts", String(attempts)],
          ["Skipped", String(skipped)],
          ["Accuracy", `${accuracy}%`],
          ["Best streak", String(bestStreak)],
          ["Final streak", String(streak)],
        ].map(([label, value]) => (
          <div key={label} className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4 text-left">
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none"
        >
          <LoopIcon size={18} title="Try again" />
          Try again
        </button>
        <ShareResultsButton
          title="Morse Code Audio Quiz"
          subtitle={`${difficultyLabel(difficulty)} listening quiz`}
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
  );
}

function TogglePill({
  label,
  checked,
  onChange,
  icon,
  describedBy,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ReactNode;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition focus:outline-none " +
        (checked
          ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
          : "bg-[#fffdf8] text-slate-800 hover:bg-slate-900 hover:text-sky-100")
      }
      aria-pressed={checked}
      aria-describedby={describedBy}
    >
      {icon}
      {label}
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  help,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  help?: string;
  disabled?: boolean;
}) {
  const id = React.useId();

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-extrabold text-sky-950">
          {label}
        </label>
        <span className="text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>
      {help ? <p className="mt-1 text-xs text-slate-500">{help}</p> : null}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        style={{ accentColor: "#38bdf8" }}
        className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function readStoredDifficulty(key: string, fallback: AudioDifficulty): AudioDifficulty {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return isAudioDifficulty(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}

function difficultyLabel(difficulty: AudioDifficulty) {
  return (
    audioDifficultyOptions.find((option) => option.value === difficulty)?.label ??
    "Easy"
  );
}

function formatMs(ms: number) {
  if (!ms || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}
