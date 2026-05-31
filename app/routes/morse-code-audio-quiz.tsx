import * as React from "react";
import type { Route } from "./+types/morse-code-audio-quiz";

import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import StrobeWarning, {
  FlashEffectsDisabledNotice,
} from "~/client/components/shared/StrobeWarning";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import TogglePill from "~/client/components/shared/ui/TogglePill";
import FlashLamp from "~/client/components/shared/FlashLamp";
import { useFlashLampState } from "~/client/components/shared/useFlashSafety";
import {
  audioDifficultyOptions,
  buildPromptDeck,
  getAudioPrompts,
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
  TOOL_SPEED_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
} from "~/client/components/shared/morseSettings";
import {
  clampNumber,
  readStoredEnum,
  readStoredNumber,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";
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
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/morse-code-audio-quiz";
const STROBE_WARNING_ID = "audio-quiz-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "audio-quiz-flash-disabled";
const DIFFICULTY_STORAGE_KEY = "mw_audio_quiz_difficulty";
const BEST_STREAK_STORAGE_KEY = "mw_audio_quiz_best_streak";
const TOTAL_QUESTIONS = 10;
const DEFAULT_AUDIO_DIFFICULTY: AudioDifficulty = "easy";
const INITIAL_AUDIO_QUIZ_SEED = 12053;
const AUDIO_DIFFICULTIES: readonly AudioDifficulty[] = [
  "beginner",
  "easy",
  "medium",
  "hard",
] as const;

type FeedbackState = "idle" | "correct" | "missed";

const faqItems = [
  {
    q: "Is the Morse code audio quiz scored?",
    a: "Yes. The audio quiz uses a fixed run, checks typed answers, and tracks score, attempts, accuracy, streak, and shareable results.",
  },
  {
    q: "Should beginners start with quiz mode?",
    a: "Beginners should usually start with audio practice first. Use the quiz when you want a test-like check of listening recall.",
  },
  {
    q: "What should I do after missed audio quiz answers?",
    a: "Drop the difficulty, return to audio practice for repetition, or move missed words into the word trainer before taking another quiz.",
  },
  {
    q: "How is the audio quiz different from audio practice?",
    a: "Audio practice is open-ended and built for repetition. The audio quiz is a fixed scored test, so it is better for checking your current listening level.",
  },
  {
    q: "Does pitch affect the correct answer?",
    a: "No. Pitch changes the tone you hear, not the dots, dashes, letters, or correct decoded answer.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Quiz | Test Listening Recall | MorseWords",
    description:
      "Take a Morse code audio quiz to test listening recall, review missed answers, and decide what to practice next.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio quiz, morse listening test, morse code test audio, farnsworth morse quiz",
  });
}

export default function MorseCodeAudioQuiz() {
  const player = useMorseAudio();
  const playerRef = React.useRef(player);
  const didResetInitialDifficulty = React.useRef(false);
  const answeredQuestionRef = React.useRef(false);
  const advancingQuestionRef = React.useRef(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [difficulty, setDifficulty] =
    React.useState<AudioDifficulty>(DEFAULT_AUDIO_DIFFICULTY);
  const [deckSeed, setDeckSeed] = React.useState(INITIAL_AUDIO_QUIZ_SEED);
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
  const flashLamp = useFlashLampState(flash);
  const { disableFlashEffects, flashAllowed } = flashLamp;
  const effectiveFlash = flashAllowed && flash;

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

  const handleCharWpmChange = React.useCallback((value: number) => {
    const next = Math.round(
      clampNumber(value, TOOL_SPEED_RANGE.min, TOOL_SPEED_RANGE.max),
    );
    setCharWpm(next);
    setFarnsworthWpm((current) => clampFarnsworthWpm(current, next));
  }, []);

  const handleFarnsworthWpmChange = React.useCallback(
    (value: number) => {
      setFarnsworthWpm(clampFarnsworthWpm(value, charWpm));
    },
    [charWpm],
  );

  React.useEffect(() => {
    playerRef.current = player;
  }, [player]);

  React.useEffect(() => {
    setDifficulty(readStoredDifficulty(DIFFICULTY_STORAGE_KEY, "easy"));
    setBestStreak(readStoredInt(BEST_STREAK_STORAGE_KEY, 0));
    setDeckSeed(Date.now());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    return () => playerRef.current.stop();
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    safeWriteStorage(DIFFICULTY_STORAGE_KEY, difficulty);
  }, [difficulty, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    safeWriteStorage(BEST_STREAK_STORAGE_KEY, String(bestStreak));
  }, [bestStreak, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!didResetInitialDifficulty.current) {
      didResetInitialDifficulty.current = true;
      return;
    }
    resetQuiz({ preserveDifficulty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, hydrated]);

  React.useEffect(() => {
    if (feedback !== "idle") return;
    answeredQuestionRef.current = false;
    advancingQuestionRef.current = false;
  }, [feedback, index]);

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
      flash: effectiveFlash,
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
    effectiveFlash,
    attackMs,
    releaseMs,
  ]);

  React.useEffect(() => {
    if (flashAllowed) return;
    setFlash(false);
    const anyPlayer = player as typeof player & {
      setLiveOptions?: (options: unknown) => void;
    };
    anyPlayer.setLiveOptions?.({ flash: false });
  }, [flashAllowed, player]);

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
      flash: effectiveFlash,
      attackMs,
      releaseMs,
    });
  }

  function checkAnswer() {
    if (
      gameOver ||
      feedback !== "idle" ||
      !normalizedAnswer ||
      answeredQuestionRef.current
    ) {
      return;
    }
    answeredQuestionRef.current = true;
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
    if (gameOver || advancingQuestionRef.current) return;
    advancingQuestionRef.current = true;
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
    answeredQuestionRef.current = false;
    advancingQuestionRef.current = false;
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
    "@type": "WebApplication",
    name: "Morse Code Audio Quiz",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    description:
      "A scored Morse code audio quiz for testing listening recall with hidden prompts, difficulty levels, and score feedback.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Audio Quiz",
        item: canonicalUrl(CANONICAL_PATH),
      },
    ],
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
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio test"
          title="Morse Code Audio Quiz"
          description="Test listening recall with hidden Morse audio prompts, answer checks, score feedback, and a clear path back to practice."
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
                  className={toolControlButtonClass({
                    active: difficulty === option.value,
                    rounded: "xl",
                  })}
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
                    className="min-h-[11rem] w-full resize-y bg-transparent font-mono text-lg text-slate-950 outline-none placeholder:text-slate-500 focus:ring-0 focus-visible:outline-none read-only:cursor-default"
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
                  className={toolControlButtonClass({ tone: "dark", size: "lg", rounded: "xl" })}
                >
                  <PlayIcon size={20} title="Play prompt" />
                  {player.state === "playing" ? "Restart prompt" : "Play prompt"}
                </button>
                <button
                  type="button"
                  onClick={player.stop}
                  disabled={player.state === "idle"}
                  className={toolControlButtonClass({ disabled: player.state === "idle", size: "lg", rounded: "xl" })}
                >
                  <StopIcon size={20} title="Stop audio" />
                  Stop
                </button>
                {feedback === "idle" ? (
                  <button
                    type="button"
                    onClick={checkAnswer}
                    disabled={!normalizedAnswer}
                    className={toolControlButtonClass({
                      disabled: !normalizedAnswer,
                      size: "lg",
                      rounded: "xl",
                    })}
                  >
                    <CheckCircleIcon size={20} title="Check answer" />
                    Check answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className={toolControlButtonClass({ tone: "dark", size: "lg", rounded: "xl" })}
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
                  className={toolControlButtonClass({
                    disabled: feedback !== "idle",
                    rounded: "xl",
                  })}
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
                labelTone="sky"
                value={charWpm}
                min={5}
                max={40}
                step={1}
                unit="WPM"
                onChange={handleCharWpmChange}
              />
              <SliderRow
                label="Farnsworth spacing"
                labelTone="sky"
                value={farnsworthWpm}
                min={5}
                max={Math.max(5, charWpm)}
                step={1}
                unit="WPM"
                onChange={handleFarnsworthWpmChange}
                help="Slows spacing only."
              />
              <SliderRow
                label="Pitch"
                labelTone="sky"
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
                labelTone="sky"
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
                labelTone="sky"
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
                labelTone="sky"
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
                      onChange={(event) =>
                        setPreset(sanitizeAudioGeneratorPreset(event.target.value))
                      }
                className="mt-2 min-h-11 w-full cursor-pointer rounded-xl bg-[#fffdf8] px-3 font-semibold text-slate-950 transition hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none"
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
                      hover="soft"
                    />
                    <TogglePill
                      label="Repeat"
                      checked={repeat}
                      onChange={setRepeat}
                      icon={<LoopIcon size={16} title="Repeat" />}
                      hover="soft"
                    />
                    <TogglePill
                      label="Flash"
                      checked={effectiveFlash}
                      onChange={(value) => setFlash(value && flashAllowed)}
                      icon={<LightBulbIcon size={16} title="Flash" />}
                      describedBy={
                        disableFlashEffects
                          ? FLASH_DISABLED_NOTICE_ID
                          : effectiveFlash
                            ? STROBE_WARNING_ID
                          : undefined
                      }
                      disabled={!flashAllowed}
                      hover="soft"
                    />
                    {flash ? (
                      <FlashLamp
                        active={flashLamp.active}
                        disabled={!effectiveFlash}
                        label="Morse audio quiz flash lamp"
                        size="sm"
                      />
                    ) : null}
                  </div>
                </div>
                {disableFlashEffects ? (
                  <FlashEffectsDisabledNotice
                    id={FLASH_DISABLED_NOTICE_ID}
                    className="mt-4"
                  />
                ) : effectiveFlash ? (
                  <StrobeWarning id={STROBE_WARNING_ID} className="mt-4" />
                ) : null}
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
              kicker: "Result summary",
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

        <ReferenceSupportSections
          guide={{
            eyebrow: "Audio quiz guide",
            title: "Use this page to test listening recall",
            description:
              "The audio quiz is a scored checkpoint. It keeps prompts hidden, plays the signal, checks your answer, and turns results into a clearer next practice choice.",
            items: [
              {
                title: "Who it is for",
                text: "Learners who have practiced by ear and now want a fixed score instead of open-ended repetition.",
              },
              {
                title: "What it tests",
                text: "Listening recall, answer accuracy, difficulty readiness, streak consistency, and whether current timing settings are workable.",
              },
              {
                title: "How to use it",
                text: "Choose a difficulty, play each hidden prompt, answer from memory, and use the final score to decide what to repeat.",
              },
            ],
          }}
          examples={{
            title: "Audio quiz scenarios",
            description:
              "Use the quiz when a measurable result helps you choose the next drill.",
            items: [
              {
                title: "Known character set",
                morse: "E T A N S O",
                children:
                  "Test a difficulty only after the underlying character set feels familiar in practice mode.",
              },
              {
                title: "Score feedback",
                morse: "7 / 10",
                children:
                  "A score near the middle means the level is useful but still needs repetition before increasing speed or difficulty.",
              },
              {
                title: "Return after misses",
                morse: "QUIZ -> PRACTICE",
                children:
                  "Missed prompts should become the next audio practice or word trainer set instead of another blind quiz run.",
              },
            ],
          }}
          mistakes={{
            title: "Common audio quiz mistakes",
            description:
              "A quiz is useful when it measures practiced skill, not when it becomes guessing.",
            items: [
              {
                title: "Testing too early",
                children:
                  "If you miss most prompts, move back to audio practice and lower difficulty before retesting.",
              },
              {
                title: "Changing every setting",
                children:
                  "Adjust one variable at a time. Changing speed, Farnsworth, pitch, and waveform together makes results harder to interpret.",
              },
              {
                title: "Ignoring the miss pattern",
                children:
                  "A final score is less useful than the pattern behind it. Review whether misses came from speed, words, or listening fatigue.",
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a practice mode",
            title: "Audio quiz vs audio practice",
            description:
              "Both pages use listening prompts, but the quiz is the test and practice is the repetition space.",
            items: [
              {
                title: "Audio practice",
                text: "Use audio practice when you want unlimited repetition and answer reveals.",
                href: "/morse-code-audio-practice",
              },
              {
                title: "Sound generator",
                text: "Use the sound generator when tone shape and beep settings matter more than score.",
                href: "/morse-code-sound-generator",
              },
              {
                title: "Practice plan",
                text: "Use the practice plan when you need a routine instead of another test.",
                href: "/morse-code-practice-plan",
              },
            ],
          }}
          nextStep={{
            title: "Use the score to choose the next session",
            description:
              "A quiz should create a decision: repeat by ear, review words, adjust timing, or move into sentence-level practice.",
            links: [
              { href: "/morse-code-audio-practice", label: "Audio practice", primary: true },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
              { href: "/morse-code-test", label: "Choose a test" },
              { href: "/morse-code-practice-plan", label: "Practice plan" },
              { href: "/learn-morse-code", label: "Learning path" },
            ],
          }}
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
              { href: "/morse-code-test", label: "Test hub" },
              { href: "/morse-code-sentence-practice", label: "Sentence practice" },
              { href: "/morse-code-practice-plan", label: "Practice plan" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Audio quiz FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd, faqJsonLd]} />
      </main>
      <BreadcrumbTrail current="Morse Code Audio Quiz" />
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
          className={toolControlButtonClass({ tone: "dark" })}
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

function readStoredDifficulty(key: string, fallback: AudioDifficulty): AudioDifficulty {
  return readStoredEnum(key, AUDIO_DIFFICULTIES, fallback);
}

function readStoredInt(key: string, fallback: number) {
  return readStoredNumber(key, {
    fallback,
    min: 0,
    max: 9999,
    integer: true,
  });
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
