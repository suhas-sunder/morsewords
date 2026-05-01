import * as React from "react";
import type { Route } from "./+types/morse-code-audio-quiz";

import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import { textToMorse } from "~/client/components/shared/morseUtils";
import styles from "~/client/components/shared/pageStyles";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import {
  LightBulbIcon,
  LoopIcon,
  PlayIcon,
  SoundIcon,
  StopIcon,
} from "~/client/assets/svg/Icons";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-quiz";
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

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-8">
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
            <div className="px-5 py-6 sm:px-8">
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
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100"
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
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold disabled:opacity-50"
                      >
                        Check answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextPrompt}
                        className="min-h-11 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100"
                      >
                        {completed + 1 >= TOTAL_QUESTIONS
                          ? "Finish"
                          : "Next prompt"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={nextPrompt}
                      disabled={solved}
                      className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold disabled:opacity-50"
                    >
                      Skip
                    </button>
                  </div>
                  {checked ? (
                    <p
                      className={
                        "mt-4 inline-flex rounded-full border px-3 py-1 text-sm font-extrabold " +
                        (isCorrect
                          ? "border-sky-200 bg-sky-50 text-sky-950"
                          : "border-amber-200 bg-amber-50 text-amber-900")
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
                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100"
                  >
                    <PlayIcon size={20} title="Play prompt" />
                    {player.state === "playing" ? "Restart prompt" : "Play prompt"}
                  </button>
                  <button
                    type="button"
                    onClick={player.stop}
                    disabled={player.state === "idle"}
                    className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
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
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setAdvancedOpen((value) => !value)}
                  className="mt-5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold text-slate-900"
                >
                  {advancedOpen ? "Hide advanced settings" : "Show advanced settings"}
                </button>
              </div>
            </div>
          )}
        </section>

        <SectionCard eyebrow="After the quiz" title="Use misses as your next practice list">
          <ActionLinks
            links={[
              {
                href: "/morse-code-word-trainer",
                label: "Word trainer",
                primary: true,
              },
              {
                href: "/morse-code-worksheet-generator",
                label: "Worksheet generator",
              },
              { href: "/practice", label: "General practice" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

function TogglePill({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-extrabold transition " +
        (checked
          ? "border-neutral-950 bg-neutral-950 text-sky-100"
          : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50")
      }
      aria-pressed={checked}
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
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-extrabold text-sky-950">{label}</label>
        <span className="text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>
      {help ? <p className="mt-1 text-xs text-slate-500">{help}</p> : null}
      <input
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
