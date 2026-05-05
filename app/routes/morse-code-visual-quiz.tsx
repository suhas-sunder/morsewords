import * as React from "react";
import type { Route } from "./+types/morse-code-visual-quiz";

import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { morseVisualEvents } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import {
  CheckCircleIcon,
  LightBulbIcon,
  LoopIcon,
  RefreshIcon,
} from "~/client/assets/svg/Icons";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-visual-quiz";
const STROBE_WARNING_ID = "visual-quiz-strobe-warning";
const PROMPTS = [
  "sos",
  "cq",
  "test",
  "help",
  "73",
  "qsl",
  "copy",
  "radio",
  "qth",
  "morse",
];
const TOTAL_QUESTIONS = 10;

const faqItems = [
  {
    q: "How does the visual Morse quiz work?",
    a: "The quiz flashes a hidden prompt. You type what you saw, check the answer, and the page tracks attempts, accuracy, streak, and a shareable result card.",
  },
  {
    q: "Does visual quiz use Farnsworth spacing?",
    a: "Yes. Character speed controls each flashed Morse character, while Farnsworth spacing slows the gaps only.",
  },
  {
    q: "Can I practice before taking the quiz?",
    a: "Yes. Use visual practice first so you can see the answer, tune the speed, and get comfortable with the flash rhythm.",
  },
  {
    q: "Is this safe for light-sensitive users?",
    a: "Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Visual Quiz | Flashing Light Test",
    description:
      "Take a scored visual Morse code quiz with flashing-light prompts, WPM, Farnsworth spacing, answer checks, streaks, and shareable results.",
    path: CANONICAL_PATH,
    keywords:
      "morse code visual quiz, flashing morse quiz, morse code light test, farnsworth visual morse",
  });
}

function useFlash(pattern: string, wpm: number, farnsworthWpm: number) {
  const [active, setActive] = React.useState(false);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function play() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    let cursor = 0;
    for (const event of morseVisualEvents(pattern, wpm, farnsworthWpm)) {
      timers.current.push(window.setTimeout(() => setActive(event.on), cursor));
      cursor += event.ms;
    }
    timers.current.push(window.setTimeout(() => setActive(false), cursor + 80));
  }

  return { active, play };
}

export default function MorseCodeVisualQuiz() {
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
  const [wpm, setWpm] = React.useState(14);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(10);
  const [hasFlashed, setHasFlashed] = React.useState(false);

  const prompt = PROMPTS[index % PROMPTS.length];
  const morse = textToMorse(prompt);
  const { active, play } = useFlash(morse, wpm, farnsworthWpm);
  const isCorrect = answer.trim().toLowerCase() === prompt;
  const gameOver = completed >= TOTAL_QUESTIONS;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("mw_visual_quiz_best_streak");
      const parsed = raw ? Number(raw) : 0;
      if (Number.isFinite(parsed)) setBestStreak(parsed);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        "mw_visual_quiz_best_streak",
        String(bestStreak),
      );
    } catch {
      // ignore
    }
  }, [bestStreak]);

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
    setIndex(0);
    setAnswer("");
    setChecked(false);
    setAttempts(0);
    setCorrect(0);
    setCompleted(0);
    setSolved(false);
    setStreak(0);
    setRunStartedAt(null);
    setHasFlashed(false);
  }

  function flashPrompt() {
    setHasFlashed(true);
    play();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Morse Code Visual Quiz",
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
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Visual test"
          title="Morse code visual quiz"
          description="Watch the flashing bulb, type the message you saw, then check the answer. The quiz uses the same speed and Farnsworth spacing controls as visual practice."
          aside={
            <DarkNote label="Score" value={`${correct}/${TOTAL_QUESTIONS}`}>
              Ten prompts, attempts, accuracy, streak, and a share card. Set
              Farnsworth lower when you need slower gaps between flashes.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              {
                href: "/morse-code-visual-practice",
                label: "Visual practice",
                primary: true,
              },
              { href: "/morse-code-audio-quiz", label: "Audio quiz" },
            ]}
          />
        </PageHero>

        <section className="mw-static-surface-soft mt-8 rounded-xl bg-[#fffaf2]/45 p-5 sm:p-7">
          <div className="pb-4">
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
                title="Morse Code Visual Quiz"
                subtitle="Flashing-light quiz results"
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
              <div className="py-6">
                <div className="mw-static-panel rounded-xl bg-[#fffdf8]/85 p-5 text-center">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Quiz complete
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-sky-950">
                  Visual quiz results
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
                        className="rounded-xl bg-[#fffdf8] p-4 text-left"
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
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none"
                  >
                    <LoopIcon size={18} title="Try again" />
                    Try again
                  </button>
                  <ShareResultsButton
                    title="Morse Code Visual Quiz"
                    subtitle="Flashing-light quiz results"
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
            <div className="grid gap-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="mw-static-panel flex flex-col items-center rounded-xl bg-[#fffdf8]/85 p-6">
                {hasFlashed ? (
                  <StrobeWarning id={STROBE_WARNING_ID} className="mb-5 w-full" />
                ) : null}
                <div
                  role="img"
                  className={
                      "h-40 w-40 rounded-full transition-all duration-75 " +
                      (active ? "bg-sky-200" : "bg-[#fffaf2]")
                  }
                  aria-label={active ? "Morse light on" : "Morse light off"}
                />
                <button
                  type="button"
                  onClick={flashPrompt}
                  aria-describedby={hasFlashed ? STROBE_WARNING_ID : undefined}
                    className="mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none"
                >
                  <LightBulbIcon size={20} title="Flash prompt" />
                  Flash prompt
                </button>
              </div>
              <div>
                <label className="block">
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
                    className="mt-2 min-h-12 w-full rounded-xl bg-[#fffdf8] px-4 font-mono text-lg transition focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </label>

                <div className="mt-5 grid gap-5">
                  <SliderRow
                    label="Character speed"
                    value={wpm}
                    min={6}
                    max={30}
                    step={1}
                    unit="WPM"
                    onChange={setWpm}
                  />
                  <SliderRow
                    label="Farnsworth spacing"
                    value={farnsworthWpm}
                    min={5}
                    max={30}
                    step={1}
                    unit="WPM"
                    onChange={setFarnsworthWpm}
                    help="Slows spacing only."
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {!solved ? (
                      <button
                        type="button"
                        onClick={checkAnswer}
                        disabled={!answer.trim()}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-4 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircleIcon size={18} title="Check answer" />
                        Check answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextPrompt}
                        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none"
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
                    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-4 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshIcon size={18} title="Skip prompt" />
                    Skip
                  </button>
                </div>
                {checked ? (
                  <p
                    className={
                        "mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold " +
                        (isCorrect ? "bg-sky-50 text-sky-950" : "bg-[#fffdf8] text-slate-800")
                    }
                  >
                    {isCorrect
                      ? "Correct."
                      : "Not quite. Try again before moving on."}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </section>

        <ToolHowItWorks
          eyebrow="Visual quiz spec"
          title="How this visual Morse quiz works"
          description="The visual quiz hides the prompt, flashes the Morse signal, and asks you to copy what you saw. It keeps the visual practice timing controls, including Farnsworth spacing, so practice and testing feel consistent."
          referenceLabel="Hidden prompt"
          referenceValue={active ? "FLASHING" : "READY"}
          referenceText="Watch the full sequence before answering. Replays use your current timing settings."
          chips={[
            { label: "Prompt", href: "#visual-quiz-prompt" },
            { label: "Scoring", href: "#visual-quiz-scoring" },
            { label: "Farnsworth", href: "#visual-quiz-farnsworth" },
            { label: "Review", href: "#visual-quiz-review" },
          ]}
          summary={[
            {
              title: "Hidden answer",
              text: "The word is hidden until you check it, unlike visual practice.",
            },
            {
              title: "Same timing controls",
              text: "Character speed and Farnsworth spacing match visual practice.",
            },
            {
              title: "Shareable results",
              text: "The quiz tracks attempts, accuracy, streak, and best streak.",
            },
          ]}
          details={[
            {
              kicker: "Test prompt",
              title: "Prompt",
              text: "Each question chooses a short MorseWords practice prompt and flashes it as a light signal. Replay the prompt when needed, then type the copied word.",
            },
            {
              kicker: "Result model",
              title: "Scoring",
              text: "Every answer check counts as an attempt. Correct answers increase your score and streak; misses reset the current streak but keep the question active.",
            },
            {
              kicker: "Learner timing",
              title: "Farnsworth",
              text: "Farnsworth spacing slows only the gaps between characters and words. This helps you copy visual Morse without distorting the dit and dah shapes.",
            },
            {
              kicker: "Next drill",
              title: "Review",
              text: "After the quiz, turn missed words into a word trainer set or printable worksheet so the next session starts with the weak prompts.",
            },
          ]}
        />

        <SectionCard eyebrow="Review" title="Build review from missed visual prompts">
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
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Visual quiz FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
      </main>
    </div>
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
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  help?: string;
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
        style={{ accentColor: "#38bdf8" }}
        className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
    </div>
  );
}
