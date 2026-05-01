import * as React from "react";
import type { Route } from "./+types/morse-code-word-trainer";

import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  CopyIcon,
  LoopIcon,
  PlayIcon,
  SoundIcon,
} from "~/client/assets/svg/Icons";
import { WORD_LISTS } from "~/client/data/morseLearning";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-word-trainer";

type WordListName = keyof typeof WORD_LISTS | "custom";
type TrainerMode = "morse_to_text" | "text_to_morse";

const faqItems = [
  {
    q: "What is the Morse code word trainer for?",
    a: "The word trainer moves beyond single letters. It helps you practice whole words, hear the audio, type the answer, mark weak words, and turn misses into review material.",
  },
  {
    q: "Can I use my own word list?",
    a: "Yes. Choose Custom and paste words separated by commas or new lines. MorseWords keeps the list in the page while you train.",
  },
  {
    q: "Should I answer with text or Morse?",
    a: "Use Morse to text when you want copy practice. Use text to Morse when you want encoding recall and cleaner written output.",
  },
  {
    q: "Does the word trainer support audio timing?",
    a: "Yes. Each word can be played with character speed and Farnsworth spacing, so the same list can become a listening drill.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Word Trainer | Custom Lists, Audio, and Review",
    description:
      "Practice Morse words from built-in or custom lists. Hear each word, type the answer, track accuracy, mark weak words, and build focused review sets.",
    path: CANONICAL_PATH,
    keywords:
      "morse code word trainer, morse code words practice, custom morse word list, morse code word practice",
  });
}

function parseWords(input: string) {
  return input
    .split(/[\n,]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeMorse(value: string) {
  return value
    .replace(/[·•]/g, ".")
    .replace(/[–—−]/g, "-")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
}

function listLabel(name: WordListName) {
  if (name === "custom") return "Custom";
  if (name === "beginner") return "Beginner";
  if (name === "classroom") return "Classroom";
  return "Radio";
}

export default function MorseCodeWordTrainer() {
  const [listName, setListName] = React.useState<WordListName>("beginner");
  const [customWords, setCustomWords] = React.useState(
    "signal\nteacher\npractice\ncopy",
  );
  const [mode, setMode] = React.useState<TrainerMode>("morse_to_text");
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [solved, setSolved] = React.useState(false);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [weakWords, setWeakWords] = React.useState<string[]>([]);
  const [attempts, setAttempts] = React.useState(0);
  const [correct, setCorrect] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);
  const [runStartedAt, setRunStartedAt] = React.useState<number | null>(null);
  const [wpm, setWpm] = React.useState(18);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(12);
  const [copiedWeak, setCopiedWeak] = React.useState(false);

  const words = React.useMemo(
    () => (listName === "custom" ? parseWords(customWords) : WORD_LISTS[listName]),
    [customWords, listName],
  );
  const activeWord = words[index % Math.max(words.length, 1)] ?? "";
  const activeMorse = textToMorse(activeWord);
  const expectedAnswer =
    mode === "morse_to_text" ? activeWord : normalizeMorse(activeMorse);
  const normalizedAnswer =
    mode === "morse_to_text" ? normalizeText(answer) : normalizeMorse(answer);
  const answerIsCorrect =
    !!activeWord &&
    normalizedAnswer ===
      (mode === "morse_to_text"
        ? normalizeText(expectedAnswer)
        : normalizeMorse(expectedAnswer));
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  React.useEffect(() => {
    if (index >= words.length) setIndex(0);
  }, [index, words.length]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("mw_word_trainer_best_streak");
      const parsed = raw ? Number(raw) : 0;
      if (Number.isFinite(parsed)) setBestStreak(parsed);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(
        "mw_word_trainer_best_streak",
        String(bestStreak),
      );
    } catch {
      // ignore
    }
  }, [bestStreak]);

  function resetPrompt() {
    setAnswer("");
    setChecked(false);
    setSolved(false);
    setShowAnswer(false);
    setCopiedWeak(false);
  }

  function chooseList(name: WordListName) {
    setListName(name);
    setIndex(0);
    resetPrompt();
  }

  function playWord(word = activeWord) {
    const code = textToMorse(word);
    if (!code) return;
    playMorsePattern(code, { wpm, farnsworthWpm });
  }

  function checkAnswer() {
    if (!activeWord || solved) return;
    if (runStartedAt === null) setRunStartedAt(Date.now());
    setAttempts((value) => value + 1);
    setChecked(true);

    if (answerIsCorrect) {
      setSolved(true);
      setCorrect((value) => value + 1);
      setCompleted((value) => value + 1);
      setStreak((value) => {
        const next = value + 1;
        setBestStreak((best) => (next > best ? next : best));
        return next;
      });
    } else {
      setStreak(0);
      setWeakWords((current) =>
        current.includes(activeWord) ? current : [...current, activeWord],
      );
    }
  }

  function next() {
    if (!activeWord) return;
    if (!solved) setStreak(0);
    setIndex((value) => (value + 1) % Math.max(words.length, 1));
    resetPrompt();
  }

  function markWeak() {
    if (!activeWord) return;
    setWeakWords((current) =>
      current.includes(activeWord) ? current : [...current, activeWord],
    );
    next();
  }

  async function copyWeakWords() {
    if (!weakWords.length) return;
    try {
      await navigator.clipboard?.writeText(weakWords.join("\n"));
      setCopiedWeak(true);
    } catch {
      setCopiedWeak(false);
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Word Trainer",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
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
          eyebrow="Word practice"
          title="Morse code word trainer"
          description="Practice Morse at the word level with built-in lists or your own pasted words. Hear each word, type the answer, track accuracy, mark weak words, and send review sets into worksheets or audio practice."
          aside={
            <DarkNote label="Current list" value={listLabel(listName).toUpperCase()}>
              Word-level practice turns isolated character recall into real copy.
              Use short words first, then move into sentences and audio quizzes.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-words", label: "Word chart", primary: true },
              { href: "/morse-code-printable-chart", label: "Make worksheet" },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
            ]}
          />
        </PageHero>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {(["beginner", "classroom", "radio", "custom"] as const).map(
                  (name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => chooseList(name)}
                      className={
                        "inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-extrabold capitalize transition " +
                        (listName === name
                          ? "border-neutral-950 bg-neutral-950 text-sky-100"
                          : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50")
                      }
                    >
                      {name}
                    </button>
                  ),
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("morse_to_text");
                    resetPrompt();
                  }}
                  className={
                    "min-h-11 rounded-xl border px-4 py-2 text-sm font-extrabold transition " +
                    (mode === "morse_to_text"
                      ? "border-neutral-950 bg-neutral-950 text-sky-100"
                      : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50")
                  }
                >
                  Morse to text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("text_to_morse");
                    resetPrompt();
                  }}
                  className={
                    "min-h-11 rounded-xl border px-4 py-2 text-sm font-extrabold transition " +
                    (mode === "text_to_morse"
                      ? "border-neutral-950 bg-neutral-950 text-sky-100"
                      : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50")
                  }
                >
                  Text to Morse
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              {listName === "custom" ? (
                <label className="mb-5 block">
                  <span className="text-sm font-extrabold text-sky-950">
                    Custom words
                  </span>
                  <textarea
                    value={customWords}
                    onChange={(event) => {
                      setCustomWords(event.target.value);
                      setIndex(0);
                      resetPrompt();
                    }}
                    className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-4 font-mono text-base outline-none focus:border-sky-400"
                  />
                </label>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-[#f7fbff]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Prompt {words.length ? index + 1 : 0} / {words.length}
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-sky-950">
                      {mode === "morse_to_text"
                        ? "Copy the Morse word"
                        : "Encode the word into Morse"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => playWord()}
                    disabled={!activeWord}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PlayIcon size={18} title="Play word" />
                    Play
                  </button>
                </div>

                <div className="px-5 py-7">
                  <p className="min-h-16 break-words font-mono text-4xl font-black tracking-[0.18em] text-slate-950 sm:text-5xl">
                    {activeWord
                      ? mode === "morse_to_text"
                        ? activeMorse
                        : activeWord.toUpperCase()
                      : "Add words"}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {mode === "morse_to_text"
                      ? "Type the word you think the Morse spells."
                      : "Type the Morse pattern for this word using dots, dashes, and spaces."}
                  </p>
                </div>
              </div>

              <label className="mt-5 block">
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
                      if (solved) next();
                      else if (answer.trim()) checkAnswer();
                    }
                  }}
                  placeholder={
                    mode === "morse_to_text" ? "Type the word" : "-- --- .-. ..."
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-mono text-lg outline-none focus:border-sky-400"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-2">
                {!solved ? (
                  <button
                    type="button"
                    onClick={checkAnswer}
                    disabled={!activeWord || !answer.trim()}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Check answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100"
                  >
                    <LoopIcon size={18} title="Next word" />
                    Next word
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAnswer((value) => !value)}
                  disabled={!activeWord}
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showAnswer ? "Hide answer" : "Reveal answer"}
                </button>
                <button
                  type="button"
                  onClick={markWeak}
                  disabled={!activeWord}
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark weak
                </button>
              </div>

              {checked ? (
                <p
                  className={
                    "mt-4 inline-flex rounded-full border px-3 py-1 text-sm font-extrabold " +
                    (answerIsCorrect
                      ? "border-sky-200 bg-sky-50 text-sky-950"
                      : "border-amber-200 bg-amber-50 text-amber-900")
                  }
                >
                  {answerIsCorrect
                    ? "Correct."
                    : "Not quite. The word was added to weak review."}
                </p>
              ) : null}

              {showAnswer ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-[#fffdf8] p-4">
                  <p className="text-sm font-extrabold text-sky-950">
                    Answer
                  </p>
                  <p className="mt-2 font-mono text-lg font-bold tracking-[0.14em] text-slate-950">
                    {activeWord.toUpperCase()} / {activeMorse}
                  </p>
                </div>
              ) : null}
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-[#fffdf8] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-extrabold text-sky-950">
                    Session
                  </h2>
                  <ShareResultsButton
                    title="Morse Code Word Trainer"
                    subtitle="Word practice results"
                    stats={{
                      attempts,
                      correct,
                      progress: completed,
                      streak,
                      bestStreak,
                      totalQuestions: words.length || 1,
                    }}
                    runStartedAt={runStartedAt}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["Attempts", attempts],
                    ["Correct", correct],
                    ["Accuracy", `${accuracy}%`],
                    ["Streak", streak],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-950">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <SoundIcon size={18} title="Audio settings" />
                  <h2 className="text-xl font-extrabold text-sky-950">
                    Audio settings
                  </h2>
                </div>
                <div className="mt-4 grid gap-5">
                  <SliderRow
                    label="Character speed"
                    value={wpm}
                    min={5}
                    max={35}
                    step={1}
                    unit="WPM"
                    onChange={setWpm}
                  />
                  <SliderRow
                    label="Farnsworth spacing"
                    value={farnsworthWpm}
                    min={5}
                    max={35}
                    step={1}
                    unit="WPM"
                    onChange={setFarnsworthWpm}
                    help="Slows spacing only."
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#fffdf8] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-extrabold text-sky-950">
                    Weak words
                  </h2>
                  <button
                    type="button"
                    onClick={copyWeakWords}
                    disabled={!weakWords.length}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CopyIcon size={16} title="Copy weak words" />
                    {copiedWeak ? "Copied" : "Copy"}
                  </button>
                </div>
                {weakWords.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {weakWords.map((word) => (
                      <button
                        key={word}
                        type="button"
                        onClick={() => playWord(word)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-bold text-slate-900 hover:border-sky-300 hover:bg-sky-50"
                      >
                        <PlayIcon size={14} title={`Play ${word}`} />
                        {word}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-base leading-relaxed text-slate-700">
                    Missed answers and marked prompts collect here. Copy them
                    into worksheets, audio practice, or a custom word list.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </section>

        <ToolHowItWorks
          eyebrow="Word trainer spec"
          title="How this Morse code word trainer works"
          description="The word trainer gives you a focused list, one prompt at a time, then asks you to answer in text or Morse. Audio playback uses the same timing ideas as the rest of MorseWords so word practice can become listening practice without changing tools."
          referenceLabel="Current pattern"
          referenceValue={activeMorse || "... --- ..."}
          referenceText="Whole-word practice builds useful chunks after alphabet drills."
          chips={[
            { label: "Lists", href: "#word-trainer-lists" },
            { label: "Modes", href: "#word-trainer-modes" },
            { label: "Audio", href: "#word-trainer-audio" },
            { label: "Review", href: "#word-trainer-review" },
          ]}
          summary={[
            {
              title: "Built-in or custom",
              text: "Use beginner, classroom, radio, or pasted custom words.",
            },
            {
              title: "Two answer modes",
              text: "Copy Morse to text or encode the word back into Morse.",
            },
            {
              title: "Weak-word loop",
              text: "Misses and marked words become a clean review list.",
            },
          ]}
          details={[
            {
              kicker: "Word source",
              title: "Lists",
              text: "Choose a built-in list for quick practice, or paste your own classroom, puzzle, radio, or vocabulary list. Custom words can be separated by new lines or commas.",
            },
            {
              kicker: "Recall direction",
              title: "Modes",
              text: "Morse to text is best for reading and copying. Text to Morse is better when you want to write clean code from memory and catch spacing mistakes.",
            },
            {
              kicker: "Listening support",
              title: "Audio",
              text: "Every word can be played as Morse audio. Character speed controls the signal shape, while Farnsworth spacing slows only the gaps for learners.",
            },
            {
              kicker: "Next action",
              title: "Review",
              text: "Weak words can be copied into the printable chart builder, audio practice, or the word search builder. That makes each missed prompt useful after the session ends.",
            },
          ]}
        />

        <SectionCard
          eyebrow="Export next"
          title="Turn word practice into review material"
          description="When a list exposes weak words, send it into a printable worksheet or use the audio page for repeat listening."
        >
          <ActionLinks
            links={[
              {
                href: "/morse-code-printable-chart",
                label: "Printable worksheet builder",
                primary: true,
              },
              { href: "/audio", label: "Audio generator" },
              {
                href: "/morse-code-word-search-builder",
                label: "Word search builder",
              },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Word trainer FAQ" items={faqItems} />

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
        style={{ accentColor: "#38bdf8" }}
        className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
    </div>
  );
}
