import * as React from "react";
import type { Route } from "./+types/morse-code-visual-quiz";

import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
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
    q: "Is the visual Morse quiz scored?",
    a: "Yes. The quiz flashes a hidden prompt, checks your typed answer, and tracks attempts, accuracy, streak, and a shareable result card.",
  },
  {
    q: "Should I use visual practice or visual quiz first?",
    a: "Use visual practice first if the flashes still feel unfamiliar. Use the quiz when you want a scored check of dot-dash recognition.",
  },
  {
    q: "What should I do when I miss a visual prompt?",
    a: "Replay short visual prompts in practice mode, lower the speed or Farnsworth pressure, then retake the quiz after the pattern feels clearer.",
  },
  {
    q: "Is visual quiz enough for audio Morse?",
    a: "No. Visual quiz measures sight-based recognition. Use audio practice or audio quiz separately for listening recall.",
  },
  {
    q: "How often should I retake the visual quiz?",
    a: "Retake it after a short practice session, not repeatedly without review. The score is most useful when it checks whether targeted practice worked.",
  },
  {
    q: "Is the visual quiz safe for light-sensitive users?",
    a: "Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Visual Quiz | Test Dot-Dash Recognition | MorseWords",
    description:
      "Use the Morse code visual quiz to test dot-dash recognition, review missed patterns, and improve recall.",
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
  const [bestStreak, setBestStreak] = React.useState(() =>
    readStoredInt("mw_visual_quiz_best_streak", 0),
  );
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
    "@type": "WebApplication",
    name: "Morse Code Visual Quiz",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    description:
      "A scored visual Morse quiz for testing dot-dash recognition with flashing prompts, answer checks, and score feedback.",
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
        name: "Morse Code Visual Quiz",
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
          eyebrow="Visual test"
          title="Morse Code Visual Quiz"
          description="Test dot-dash recognition with hidden flashing prompts, score feedback, and follow-up review for missed patterns."
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
                    className={toolControlButtonClass({ tone: "dark" })}
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
                    className={`${toolControlButtonClass({
                      tone: "dark",
                      size: "lg",
                      full: true,
                    })} mt-5`}
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
 className="mt-2 min-h-12 w-full rounded-xl bg-[#fffdf8] px-4 font-mono text-lg transition focus:outline-none focus:ring-0 focus-visible:outline-none"
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
                        className={toolControlButtonClass({
                          disabled: !answer.trim(),
                        })}
                      >
                        <CheckCircleIcon size={18} title="Check answer" />
                        Check answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextPrompt}
                        className={toolControlButtonClass({ tone: "dark" })}
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
                    className={toolControlButtonClass({ disabled: solved })}
                  >
                    <RefreshIcon size={18} title="Skip prompt" />
                    Skip
                  </button>
                </div>
                {checked ? (
                  <p
                    className={
                        "mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold " +
                        (isCorrect ? "mw-static-tile bg-[#f7f4ee] text-sky-950" : "bg-[#fffdf8] text-slate-800")
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
              kicker: "Result summary",
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

        <ReferenceSupportSections
          guide={{
            eyebrow: "Visual quiz guide",
            title: "Use this page to test dot-dash recognition",
            description:
              "The visual quiz is the scored version of flash practice. It hides the prompt, flashes the Morse signal, checks your answer, and shows whether sight-based recall is holding.",
            items: [
              {
                title: "Who it is for",
                text: "Learners who have practiced visual Morse and want a fixed scored check instead of open-ended reveal practice.",
              },
              {
                title: "What it tests",
                text: "Visual prompt recall, answer accuracy, streak consistency, and whether current flash timing is readable.",
              },
              {
                title: "How to use it",
                text: "Watch the full flash sequence, type the prompt from memory, check the answer, and review missed patterns afterward.",
              },
            ],
          }}
          examples={{
            title: "Visual quiz scenarios",
            description:
              "Use these scenarios to decide when a quiz score is useful.",
            items: [
              {
                title: "A-Z recognition check",
                morse: ".- -... -.-.",
                children:
                  "Take a visual quiz after alphabet review to confirm short letter patterns are recognizable as flashes.",
              },
              {
                title: "Missed character review",
                morse: "MISS -> PRACTICE",
                children:
                  "When a pattern is missed, go back to visual practice instead of retaking the same quiz immediately.",
              },
              {
                title: "Combine with word trainer",
                morse: "FLASH -> WORD",
                children:
                  "If missed prompts are actual words, repeat them in the word trainer so visual recognition connects to vocabulary.",
              },
            ],
          }}
          mistakes={{
            title: "Common visual quiz mistakes",
            description:
              "Visual quiz scores are most useful when they follow targeted visual practice.",
            items: [
              {
                title: "Quizzing before practicing",
                children:
                  "Use open-ended visual practice first if flash timing or prompt length still feels unfamiliar.",
              },
              {
                title: "Ignoring missed prompts",
                children:
                  "A miss should send you to visual practice, typing, or word trainer review. Repeating the quiz alone is less efficient.",
              },
              {
                title: "Confusing visual and audio skill",
                children:
                  "A strong visual score does not prove listening recall. Use audio practice separately.",
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a practice mode",
            title: "Visual quiz vs visual practice",
            description:
              "Both use flashes. Practice is for learning the pattern; quiz is for checking recall.",
            items: [
              {
                title: "Visual practice",
                text: "Use visual practice when you need answer reveal and repeated flash review.",
                href: "/morse-code-visual-practice",
              },
              {
                title: "Typing practice",
                text: "Use typing practice when the prompt is recognizable but answer entry is slow.",
                href: "/typing",
              },
              {
                title: "General practice",
                text: "Use general practice for mixed written prompts outside the flash mode.",
                href: "/practice",
              },
            ],
          }}
          nextStep={{
            title: "Use missed flashes as the next review set",
            description:
              "A visual quiz should point to a follow-up drill, especially when certain words or patterns keep failing.",
            links: [
              { href: "/morse-code-visual-practice", label: "Visual practice", primary: true },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
              { href: "/typing", label: "Typing practice" },
              { href: "/learn-morse-code", label: "Learning path" },
            ],
          }}
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

        <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd, faqJsonLd]} />
      </main>
      <BreadcrumbTrail current="Morse Code Visual Quiz" />
    </div>
  );
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
 className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-0 focus-visible:outline-none"
      />
    </div>
  );
}
