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
const PROMPTS = [
  "sos",
  "cq",
  "test",
  "help",
  "radio",
  "qth",
  "copy",
  "73",
  "qsl",
  "morse",
];
const TOTAL_QUESTIONS = 10;

const faqItems = [
  {
    q: "How does the Morse code audio quiz work?",
    a: "The quiz plays a hidden Morse prompt. You type what you heard, check the answer, and MorseWords tracks attempts, accuracy, streak, and a shareable result.",
  },
  {
    q: "Does the audio quiz support Farnsworth spacing?",
    a: "Yes. Character speed controls the dits and dahs, while Farnsworth spacing slows only the gaps between letters and words.",
  },
  {
    q: "How is this different from audio practice?",
    a: "Audio practice keeps the prompt visible so you can tune timing and repeat the sound. The audio quiz hides the answer and scores recall.",
  },
  {
    q: "Is the Flash option safe for everyone?",
    a: "Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Quiz | Test Listening Accuracy",
    description:
      "Take a scored Morse code audio quiz with WPM, Farnsworth spacing, pitch, waveform, repeat, answer checks, streaks, and shareable results.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio quiz, morse listening test, morse code test audio, farnsworth morse quiz",
  });
}

export default function MorseCodeAudioQuiz() {
  const player = useMorseAudio();
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [solved, setSolved] = React.useState(false);
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
  const [advancedOpen, setAdvancedOpen] = React.useState(true);

  const prompt = PROMPTS[index % PROMPTS.length];
  const morse = textToMorse(prompt);
  const isCorrect = answer.trim().toLowerCase() === prompt;
  const gameOver = completed >= TOTAL_QUESTIONS;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const durationMs = player.estimateDurationMs({
    code: morse,
    wpm: charWpm,
    farnsworthWpm,
  });

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

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("mw_audio_quiz_best_streak");
      const parsed = raw ? Number(raw) : 0;
      if (Number.isFinite(parsed)) setBestStreak(parsed);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        "mw_audio_quiz_best_streak",
        String(bestStreak),
      );
    } catch {
      // ignore
    }
  }, [bestStreak]);

  async function playPrompt() {
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
    if (gameOver || solved) return;
    if (runStartedAt === null) setRunStartedAt(Date.now());
    setAttempts((value) => value + 1);
    setChecked(true);
    if (isCorrect) {
      setSolved(true);
      setCorrect((value) => value + 1);
      setStreak((value) => {
        const next = value + 1;
        setBestStreak((best) => (next > best ? next : best));
        return next;
      });
    } else {
      setStreak(0);
    }
  }

  function nextPrompt() {
    player.stop();
    if (!solved) setStreak(0);
    const nextCompleted = completed + 1;
    setCompleted(nextCompleted);
    setAnswer("");
    setChecked(false);
    setSolved(false);
    if (nextCompleted < TOTAL_QUESTIONS) {
      setIndex((value) => (value + 1) % PROMPTS.length);
    }
  }

  function resetQuiz() {
    player.stop();
    setIndex(0);
    setAnswer("");
    setChecked(false);
    setAttempts(0);
    setCorrect(0);
    setCompleted(0);
    setSolved(false);
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
    <div style={styles.page}>
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
          description="Listen first, then type the word you heard. The quiz uses the same timing controls as audio practice, including Farnsworth spacing for slower gaps."
          aside={
            <DarkNote label="Score" value={`${correct}/${TOTAL_QUESTIONS}`}>
              Accuracy counts every answer check. Current prompt time is about{" "}
              {formatMs(durationMs)} with these settings.
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

        <section className="mt-8 overflow-hidden rounded-2xl bg-white">
          <div className="px-5 pb-4 pt-6 sm:px-8 sm:pt-7">
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
                subtitle="Listening quiz results"
                stats={{
                  attempts,
                  correct,
                  progress: completed,
                  streak,
                  bestStreak,
                  totalQuestions: TOTAL_QUESTIONS,
                }}
                runStartedAt={runStartedAt}
              />
            </div>
          </div>

          {gameOver ? (
            <div className="px-5 pb-6 pt-4 sm:px-8 sm:pb-7 sm:pt-5">
              <div className="rounded-2xl border border-slate-200 bg-sky-50/70 p-5 text-center">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Quiz complete
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Audio quiz results
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Questions", `${TOTAL_QUESTIONS}/${TOTAL_QUESTIONS}`],
                    ["Attempts", String(attempts)],
                    ["Correct", String(correct)],
                    ["Accuracy", `${accuracy}%`],
                    ["Best streak", String(bestStreak)],
                    ["Final streak", String(streak)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-white p-4 text-left"
                    >
                      <p className="text-sm font-semibold text-slate-600">
                        {label}
                      </p>
                      <p className="mt-1 text-3xl font-black text-slate-950">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-950 bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                  >
                    <LoopIcon size={18} title="Try again" />
                    Try again
                  </button>
                  <ShareResultsButton
                    title="Morse Code Audio Quiz"
                    subtitle="Listening quiz results"
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
            </div>
          ) : (
            <div className="px-5 py-6 sm:px-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <label className="block max-w-xl">
                    <span className="text-sm font-extrabold text-sky-950">
                      Your answer
                    </span>
                    <input
                      value={answer}
                      onChange={(event) => {
                        setAnswer(event.target.value);
                        setChecked(false);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          if (solved) nextPrompt();
                          else if (answer.trim()) checkAnswer();
                        }
                      }}
                      className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-mono text-lg outline-none focus:border-sky-400"
                    />
                  </label>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!solved ? (
                      <button
                        type="button"
                        onClick={checkAnswer}
                        disabled={!answer.trim()}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircleIcon size={18} title="Check answer" />
                        Check answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextPrompt}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-950 bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                      >
                        <LoopIcon size={18} title="Next prompt" />
                        {completed + 1 >= TOTAL_QUESTIONS
                          ? "Finish"
                          : "Next prompt"}
                      </button>
                    )}
                    <button
                    type="button"
                    onClick={nextPrompt}
                    disabled={solved}
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshIcon size={18} title="Skip prompt" />
                    Skip
                  </button>
                  </div>
                  {checked ? (
                    <p
                      className={
                        "mt-4 inline-flex rounded-full border px-3 py-1 text-sm font-semibold " +
                        (isCorrect
                          ? "border-sky-200 bg-sky-50 text-sky-950"
                          : "border-slate-200 bg-[#fffdf8] text-slate-800")
                      }
                    >
                      {isCorrect
                        ? "Correct."
                        : "Not quite. Try again before moving on."}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Playback
                  </p>
                  <button
                    type="button"
                    onClick={playPrompt}
                    className="mt-4 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-950 bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                  >
                    <PlayIcon size={20} title="Play prompt" />
                    {player.state === "playing" ? "Restart prompt" : "Play prompt"}
                  </button>
                  <button
                    type="button"
                    onClick={player.stop}
                    disabled={player.state === "idle"}
                    className="mt-2 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <StopIcon size={20} title="Stop audio" />
                    Stop
                  </button>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    The prompt stays hidden during the quiz.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
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
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_2fr] md:items-end">
                      <label className="block">
                        <span className="text-sm font-extrabold text-sky-950">
                          Sound preset
                        </span>
                        <select
                          value={preset}
                          onChange={(event) =>
                            setPreset(event.target.value as SoundPreset)
                          }
                          className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-semibold"
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
                    {flash ? (
                      <StrobeWarning id={STROBE_WARNING_ID} className="mt-4" />
                    ) : null}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setAdvancedOpen((value) => !value)}
                  className="mt-5 min-h-11 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                >
                  {advancedOpen ? "Hide advanced settings" : "Show advanced settings"}
                </button>
              </div>
            </div>
          )}
        </section>

        <ToolHowItWorks
          eyebrow="Audio quiz spec"
          title="How this Morse code audio quiz works"
          description="The audio quiz hides the prompt, plays the Morse signal, and asks you to copy what you heard. It keeps the full listening controls from audio practice so testing and training use the same timing model."
          referenceLabel="Hidden signal"
          referenceValue="... --- ..."
          referenceText="Replay the prompt, then type the word. Farnsworth changes gaps only."
          chips={[
            { label: "Prompt", href: "#audio-quiz-prompt" },
            { label: "Scoring", href: "#audio-quiz-scoring" },
            { label: "Timing", href: "#audio-quiz-timing" },
            { label: "Review", href: "#audio-quiz-review" },
          ]}
          summary={[
            {
              title: "Hidden-answer test",
              text: "The word stays hidden while you listen, answer, and check recall.",
            },
            {
              title: "Full audio controls",
              text: "WPM, Farnsworth, pitch, volume, waveform, attack, release, repeat, and flash stay available.",
            },
            {
              title: "Shareable results",
              text: "The quiz tracks attempts, accuracy, streak, and best streak for a useful result card.",
            },
          ]}
          details={[
            {
              kicker: "Listening prompt",
              title: "Prompt",
              text: "Each question uses a short practice word or signal. You can replay the audio with your current settings, but the text answer stays hidden until you check it.",
            },
            {
              kicker: "Result model",
              title: "Scoring",
              text: "Every answer check counts as an attempt. Correct answers increase your score and streak; misses reset the current streak but keep the question active for another try.",
            },
            {
              kicker: "Learner timing",
              title: "Timing",
              text: "Character speed controls the dit and dah rhythm. Farnsworth spacing slows only the letter and word gaps, which gives learners more copy time without distorting the Morse character shapes.",
              bullets: [
                "Use lower Farnsworth spacing when copying feels rushed.",
                "Use repeat for short prompts and weak words.",
                "Use attack and release to soften the start and end of tones.",
              ],
            },
            {
              kicker: "Next session",
              title: "Review",
              text: "After the quiz, move missed words into the word trainer or make a printable review sheet so the next practice block starts with the signals that need the most work.",
            },
          ]}
        />

        <SectionCard eyebrow="After the quiz" title="Use misses as your next practice list">
          <ActionLinks
            links={[
              {
                href: "/morse-code-word-trainer",
                label: "Word trainer",
                primary: true,
              },
              {
                href: "/morse-code-printable-chart",
                label: "Worksheet generator",
              },
              { href: "/practice", label: "General practice" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Audio quiz FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
      </main>
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
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 " +
        (checked
          ? "border-slate-950 bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
          : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50")
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

function formatMs(ms: number) {
  if (!ms || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}
