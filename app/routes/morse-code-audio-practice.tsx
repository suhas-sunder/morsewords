import * as React from "react";
import type { Route } from "./+types/morse-code-audio-practice";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  CheckCircleIcon,
  LightBulbIcon,
  LoopIcon,
  PlayIcon,
  RefreshIcon,
  SoundIcon,
  StopIcon,
  VisibilityIcon,
} from "~/client/assets/svg/Icons";
import {
  audioDifficultyOptions,
  getAudioPrompts,
  isAudioDifficulty,
  normalizeAudioAnswer,
  pickPrompt,
  promptTypeLabel,
  type AudioDifficulty,
  type AudioPrompt,
} from "~/client/components/audioPractice/audioPromptBank";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-practice";
const STROBE_WARNING_ID = "audio-practice-strobe-warning";
const DIFFICULTY_STORAGE_KEY = "mw_audio_practice_difficulty";
const BEST_STREAK_STORAGE_KEY = "mw_audio_practice_best_streak";
const DEFAULT_AUDIO_DIFFICULTY: AudioDifficulty = "easy";

const faqItems = [
  {
    q: "What does Morse code audio practice train?",
    a: "Audio practice trains listening recall. You hear a hidden Morse prompt first, type what you copied, and review the answer without a fixed scored quiz format.",
  },
  {
    q: "Should I use audio practice before audio quiz?",
    a: "Yes, if listening recall is still uneven. Practice mode is open-ended, so it is better for repetition before taking the scored audio quiz.",
  },
  {
    q: "What speed should I start with for audio practice?",
    a: "Start at a speed where characters sound clear and use Farnsworth spacing if the gaps feel rushed. Raise speed only after answers stay accurate.",
  },
  {
    q: "Why do I recognize visual Morse but not audio Morse?",
    a: "Visual recall and sound recall are different skills. Audio practice forces you to recognize rhythm by ear instead of reading dots and dashes.",
  },
  {
    q: "What should I do after listening practice?",
    a: "Move to the audio quiz when recall feels steady, or return to word trainer and timing pages when certain words or spacing settings still cause misses.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Practice | Listen and Recognize Morse by Ear | MorseWords",
    description:
      "Practice recognizing Morse code by sound with listening drills, common mistake tips, and links to quiz and timing tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio practice, listen to morse code, morse code by ear, morse audio drills, morse listening practice",
  });
}

export default function MorseCodeAudioPractice() {
  const player = useMorseAudio();
  const didSyncInitialDifficulty = React.useRef(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [difficulty, setDifficulty] =
    React.useState<AudioDifficulty>(DEFAULT_AUDIO_DIFFICULTY);
  const promptPool = React.useMemo(() => getAudioPrompts(difficulty), [difficulty]);
  const [prompt, setPrompt] = React.useState<AudioPrompt>(() =>
    getAudioPrompts(DEFAULT_AUDIO_DIFFICULTY)[0],
  );
  const [answer, setAnswer] = React.useState("");
  const [feedback, setFeedback] = React.useState<"idle" | "correct" | "missed" | "revealed">(
    "idle",
  );
  const [attempts, setAttempts] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [skipped, setSkipped] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);

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

  const morse = React.useMemo(() => textToMorse(prompt.text), [prompt.text]);
  const normalizedAnswer = normalizeAudioAnswer(answer);
  const expectedAnswer = normalizeAudioAnswer(prompt.text);
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  const durationMs = player.estimateDurationMs({
    code: morse,
    wpm: charWpm,
    farnsworthWpm,
  });

  React.useEffect(() => {
    const storedDifficulty = readStoredDifficulty(
      DIFFICULTY_STORAGE_KEY,
      DEFAULT_AUDIO_DIFFICULTY,
    );
    setDifficulty(storedDifficulty);
    setBestStreak(readStoredInt(BEST_STREAK_STORAGE_KEY, 0));
    setPrompt(pickPrompt(getAudioPrompts(storedDifficulty)));
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
    } catch {
      // local-only preference; ignore storage failures
    }
  }, [difficulty, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(BEST_STREAK_STORAGE_KEY, String(bestStreak));
    } catch {
      // ignore
    }
  }, [bestStreak, hydrated]);

  React.useEffect(() => {
    if (!hydrated) return;
    if (!didSyncInitialDifficulty.current) {
      didSyncInitialDifficulty.current = true;
      return;
    }
    setPrompt((current) => pickPrompt(promptPool, current.text));
    setAnswer("");
    setFeedback("idle");
    player.stop();
  }, [difficulty, promptPool, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const el = document.getElementById("mw_audio_practice_flash");
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
    if (!normalizedAnswer || feedback === "correct" || feedback === "revealed") {
      return;
    }
    setAttempts((value) => value + 1);
    if (normalizedAnswer === expectedAnswer) {
      setCorrect((value) => value + 1);
      setFeedback("correct");
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

  function revealAnswer() {
    if (feedback !== "idle") return;
    setFeedback("revealed");
    setStreak(0);
  }

  function nextPrompt({ skippedPrompt = false }: { skippedPrompt?: boolean } = {}) {
    player.stop();
    setPrompt((current) => pickPrompt(promptPool, current.text));
    setAnswer("");
    setFeedback("idle");
    setCompleted((value) => value + 1);
    if (skippedPrompt) {
      setSkipped((value) => value + 1);
      setStreak(0);
    }
  }

  function resetSession() {
    player.stop();
    setPrompt((current) => pickPrompt(promptPool, current.text));
    setAnswer("");
    setFeedback("idle");
    setAttempts(0);
    setCorrect(0);
    setCompleted(0);
    setSkipped(0);
    setStreak(0);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Audio Practice",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    description:
      "An open-ended Morse code audio practice tool for listening recall, hidden prompts, timing controls, and repeated review.",
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
        name: "Morse Code Audio Practice",
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
      {flash ? (
        <div
          id="mw_audio_practice_flash"
          className="pointer-events-none fixed inset-0 z-50 bg-white opacity-0 transition-opacity duration-75"
        />
      ) : null}

      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio practice"
          title="Morse Code Audio Practice"
          description="Listen first, type what you copied, and repeat hidden prompts until Morse patterns become recognizable by ear."
          aside={
            <DarkNote label="Practice mode" value="Endless">
              {promptPool.length} prompts available. Answers stay hidden until you
              check or reveal them.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-quiz", label: "Take audio quiz", primary: true },
              { href: "/farnsworth-timing", label: "Farnsworth guide" },
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

            <div className="flex flex-wrap gap-3 text-sm text-slate-700">
              <span>
                Done <strong className="text-sky-950">{completed}</strong>
              </span>
              <span>
                Accuracy <strong className="text-sky-950">{accuracy}%</strong>
              </span>
              <span>
                Streak <strong className="text-sky-950">{streak}</strong>
              </span>
              <span>
                Best <strong className="text-sky-950">{bestStreak}</strong>
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label
                  htmlFor="mw_audio_practice_answer"
                  className="text-sm font-extrabold text-sky-950"
                >
                  Your answer
                </label>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {promptTypeLabel(prompt.type)}
                </span>
              </div>
              <textarea
                id="mw_audio_practice_answer"
                value={answer}
                onChange={(event) => {
                  setAnswer(event.target.value);
                  if (feedback !== "revealed") setFeedback("idle");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    checkAnswer();
                  }
                }}
                placeholder="Type what you hear"
                className="min-h-[10rem] w-full resize-y bg-transparent font-mono text-lg text-slate-950 outline-none placeholder:text-slate-500 focus:ring-0 focus-visible:outline-none"
              />
            </div>

            <div className="rounded-xl bg-slate-950 p-4 text-sky-100">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-extrabold text-slate-100">
                  Hidden audio prompt
                </h2>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                  Prompt
                </span>
              </div>
              <div className="min-h-[10rem] text-sm leading-relaxed text-slate-200">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                  {audioDifficultyOptions.find((option) => option.value === difficulty)
                    ?.label}{" "}
                  {promptTypeLabel(prompt.type)}
                </p>
                <p className="mt-4 max-w-lg text-base">
                  Play the signal, copy it by ear, then check your answer. The text
                  and Morse pattern stay hidden while you practice.
                </p>
                {feedback !== "idle" ? (
                  <div className="mt-5 rounded-lg bg-slate-900/80 p-3">
                    <p className="font-semibold text-sky-100">
                      Expected: {prompt.text}
                    </p>
                    <p className="mt-2 font-mono text-sm font-bold tracking-[0.16em] text-sky-100">
                      {morse}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {feedback !== "idle" ? (
            <div
              className={
                "mt-4 rounded-xl px-4 py-3 text-sm font-semibold " +
                (feedback === "correct"
                  ? "mw-static-tile bg-[#f7f4ee] text-sky-950"
                  : "bg-[#fffaf2] text-slate-800")
              }
            >
              {feedback === "correct"
                ? "Correct. Move to the next hidden prompt when ready."
                : feedback === "revealed"
                  ? "Answer revealed. Use it as a listening reference, then try the next prompt."
                  : "Not quite. Compare the answer, replay the sound, then continue."}
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
            <button
              type="button"
              onClick={checkAnswer}
              disabled={!normalizedAnswer || feedback === "correct" || feedback === "revealed"}
              className={toolControlButtonClass({
                disabled: !normalizedAnswer || feedback === "correct" || feedback === "revealed",
                size: "lg",
                rounded: "xl",
              })}
            >
              <CheckCircleIcon size={20} title="Check answer" />
              Check answer
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={revealAnswer}
                disabled={feedback !== "idle"}
                className={toolControlButtonClass({
                  disabled: feedback !== "idle",
                  rounded: "xl",
                })}
              >
                <VisibilityIcon size={18} title="Reveal answer" />
                Reveal answer
              </button>
              <button
                type="button"
                onClick={() => nextPrompt()}
                className={toolControlButtonClass({ rounded: "xl" })}
              >
                <RefreshIcon size={18} title="Next prompt" />
                Next prompt
              </button>
              <button
                type="button"
                onClick={() => nextPrompt({ skippedPrompt: true })}
                className={toolControlButtonClass({ rounded: "xl" })}
              >
                Skip
              </button>
            </div>
            <button
              type="button"
              onClick={resetSession}
              className={toolControlButtonClass({ rounded: "xl" })}
            >
              <LoopIcon size={18} title="Reset session" />
              Reset session
            </button>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-sky-950">
                Audio practice settings
              </h3>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {player.state === "idle" ? "Ready" : player.state}
              </span>
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <SliderRow label="Character speed" value={charWpm} min={5} max={40} step={1} unit="WPM" onChange={setCharWpm} />
              <SliderRow label="Farnsworth spacing" value={farnsworthWpm} min={5} max={40} step={1} unit="WPM" onChange={setFarnsworthWpm} help="Slower spacing, same character speed." />
              <SliderRow label="Pitch" value={toneHz} min={300} max={1000} step={10} unit="Hz" onChange={setToneHz} disabled={!soundOn || preset === "sounder"} />
              <SliderRow label="Volume" value={Math.round(volume * 100)} min={0} max={100} step={1} unit="%" onChange={(value) => setVolume(value / 100)} disabled={!soundOn} />
              <SliderRow label="Attack" value={attackMs} min={0} max={40} step={1} unit="ms" onChange={setAttackMs} disabled={!soundOn || preset === "sounder"} />
              <SliderRow label="Release" value={releaseMs} min={0} max={80} step={1} unit="ms" onChange={setReleaseMs} disabled={!soundOn || preset === "sounder"} />
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
              className={`${toolControlButtonClass({ full: true })} mt-5`}
            >
              {advancedOpen ? "Hide advanced settings" : "Show advanced settings"}
            </button>
          </div>
        </section>

        <ToolHowItWorks
          eyebrow="Audio practice spec"
          title="How hidden Morse audio practice works"
          description="Audio practice chooses a random hidden prompt from your selected difficulty. You listen first, type what you copied, then check or reveal the answer before moving on."
          referenceLabel="Hidden signal"
          referenceValue="... --- ..."
          referenceText="The prompt is audio-first. Text appears only after checking or revealing."
          chips={[
            { label: "Difficulty", href: "#audio-practice-difficulty" },
            { label: "Hidden prompt", href: "#audio-practice-hidden" },
            { label: "Farnsworth", href: "#audio-practice-farnsworth" },
            { label: "Quiz next", href: "#audio-practice-quiz" },
          ]}
          summary={[
            {
              title: "Endless training",
              text: "Practice keeps serving new prompts so you can repeat weak listening patterns without a score cap.",
            },
            {
              title: "Difficulty memory",
              text: "Your selected level is saved locally, so the next session starts where you left off.",
            },
            {
              title: "Same audio engine",
              text: "WPM, Farnsworth spacing, pitch, volume, waveform, attack, release, repeat, and flash all use the same local audio engine.",
            },
          ]}
          details={[
            {
              kicker: "Prompt pool",
              title: "Difficulty",
              text: "Beginner starts with single characters and tiny groups. Easy adds common words and signals. Medium adds longer words and short sentences. Hard includes tougher copy such as Q-codes and longer sentences.",
            },
            {
              kicker: "Listening first",
              title: "Hidden prompt",
              text: "The page intentionally hides the text and Morse pattern while you listen. That keeps the task focused on copying by ear instead of reading the answer.",
            },
            {
              kicker: "Learner spacing",
              title: "Farnsworth",
              text: "Farnsworth spacing slows only the gaps between letters and words. The character rhythm stays crisp, which helps you recognize Morse shapes at real speed.",
            },
            {
              kicker: "Skill check",
              title: "Quiz next",
              text: "When practice feels steady, move to the audio quiz. The quiz uses the same prompt style but limits the run to ten scored questions.",
            },
          ]}
        />

        <ReferenceSupportSections
          guide={{
            eyebrow: "Audio practice guide",
            title: "Use this page for open-ended listening",
            description:
              "Audio practice is for hearing Morse first, answering from memory, and repeating prompts until listening recall becomes more reliable.",
            items: [
              {
                title: "Who it is for",
                text: "Learners who can read some Morse but need to recognize the same patterns by ear.",
              },
              {
                title: "What it trains",
                text: "Hidden audio prompts, answer recall, WPM choice, Farnsworth spacing, tone comfort, and repeated listening without a fixed quiz cap.",
              },
              {
                title: "How to use it",
                text: "Choose a difficulty, play the prompt, type what you heard, check or reveal, then repeat at a comfortable speed.",
              },
            ],
          }}
          examples={{
            title: "Listening practice scenarios",
            description:
              "Use these patterns to decide how difficult the next listening session should be.",
            items: [
              {
                title: "Short letters by sound",
                morse: ". / - / ...",
                children:
                  "Start with short character groups if the rhythm of individual letters is still unfamiliar.",
              },
              {
                title: "Slower copy",
                morse: "18 WPM / 12 WPM",
                children:
                  "Keep the character speed crisp and lower Farnsworth spacing when you need more time between letters.",
              },
              {
                title: "Practice to quiz",
                morse: "OPEN -> SCORED",
                children:
                  "Move to the audio quiz after a practice run feels calm enough that scoring will be useful.",
              },
            ],
          }}
          mistakes={{
            title: "Common listening mistakes",
            description:
              "Audio practice gets more useful when the speed and prompt choice match your current recall level.",
            items: [
              {
                title: "Starting too fast",
                children:
                  "If every prompt turns into guessing, lower the difficulty or use more Farnsworth spacing before raising speed.",
              },
              {
                title: "Reading instead of hearing",
                children:
                  "Keep the answer hidden until after the first listen. The goal is rhythm recognition, not visual Morse reading.",
              },
              {
                title: "Skipping timing review",
                children:
                  "If gaps feel crowded, review standard timing and Farnsworth timing before changing several controls at once.",
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a practice mode",
            title: "Audio practice vs audio quiz and generator",
            description:
              "Use this page for repetition. Use related audio pages when the goal is testing or sound creation.",
            items: [
              {
                title: "Audio quiz",
                text: "Use the audio quiz for a fixed scored listening test with results.",
                href: "/morse-code-audio-quiz",
              },
              {
                title: "Audio generator",
                text: "Use the audio generator when you want to play or save a specific message as audio.",
                href: "/audio",
              },
              {
                title: "Sound generator",
                text: "Use the sound generator when tone shape and beep settings are the main task.",
                href: "/morse-code-sound-generator",
              },
            ],
          }}
          nextStep={{
            title: "Turn listening misses into a focused drill",
            description:
              "After a practice session, choose a scored quiz, a timing guide, or a word-level review based on what caused the misses.",
            links: [
              { href: "/morse-code-audio-quiz", label: "Audio quiz", primary: true },
              { href: "/morse-code-timing", label: "Timing guide" },
              { href: "/farnsworth-timing", label: "Farnsworth timing" },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
            ],
          }}
        />

        <SectionCard
          eyebrow="Listening flow"
          title="Practice until it feels easy, then test it"
          description="Use this page for open-ended listening. Switch to the audio quiz when you want a score, or move missed words into word and sentence practice."
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-quiz", label: "Audio quiz", primary: true },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
              { href: "/morse-code-sentence-practice", label: "Sentence practice" },
              { href: "/morse-code-practice-plan", label: "Practice plan" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Audio practice FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd, faqJsonLd]} />
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
        toolControlButtonClass({
          active: checked,
          size: "sm",
          rounded: "full",
        })
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
 className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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

function readStoredInt(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? Number(raw) : fallback;
    return Number.isFinite(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function formatMs(ms: number) {
  if (!ms || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}
