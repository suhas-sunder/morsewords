import * as React from "react";
import type { Route } from "./+types/morse-code-audio-quiz";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import ShareResultsButton from "~/client/components/practice/ShareResultsButton";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-quiz";
const PROMPTS = ["sos", "cq", "test", "help", "radio", "qth", "copy", "73", "qsl", "morse"];
const TOTAL_QUESTIONS = 10;

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Quiz | Listen and Type the Answer",
    description:
      "Take an audio-only Morse code quiz. Listen to the prompt, type what you hear, check your answer, and repeat the signal.",
    path: CANONICAL_PATH,
    keywords: "morse code audio quiz, morse listening test, morse code test audio",
  });
}

export default function MorseCodeAudioQuiz() {
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
  const prompt = PROMPTS[index % PROMPTS.length];
  const morse = textToMorse(prompt);
  const isCorrect = answer.trim().toLowerCase() === prompt;
  const gameOver = completed >= TOTAL_QUESTIONS;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

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
      window.localStorage.setItem("mw_audio_quiz_best_streak", String(bestStreak));
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
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio test"
          title="Morse code audio quiz"
          description="Listen first, then type the word you heard. This is intentionally more focused than the main practice page: audio prompt, answer box, feedback."
          aside={<DarkNote label="Score" value={`${correct}/${TOTAL_QUESTIONS}`}>Accuracy counts every answer check, so repeated guesses matter just like the main practice page.</DarkNote>}
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-practice", label: "Audio practice", primary: true },
              { href: "/morse-code-visual-quiz", label: "Visual quiz" },
            ]}
          />
        </PageHero>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <span>Question <strong className="text-sky-950">{Math.min(completed + 1, TOTAL_QUESTIONS)}/{TOTAL_QUESTIONS}</strong></span>
              <span>Attempts <strong className="text-sky-950">{attempts}</strong></span>
              <span>Accuracy <strong className="text-sky-950">{accuracy}%</strong></span>
              <span>Streak <strong className="text-sky-950">{streak}</strong></span>
              <ShareResultsButton
                title="Morse Code Audio Quiz"
                subtitle="Listening quiz results"
                stats={{ attempts, correct, progress: completed, streak, bestStreak, totalQuestions: TOTAL_QUESTIONS }}
                runStartedAt={runStartedAt}
              />
            </div>
          </div>

          {gameOver ? (
            <div className="px-5 py-6 sm:px-8">
              <div className="rounded-2xl border border-slate-200 bg-sky-50/70 p-5 text-center">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Quiz complete</p>
                <h2 className="mt-2 text-2xl font-extrabold text-sky-950">Audio quiz results</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Questions", `${TOTAL_QUESTIONS}/${TOTAL_QUESTIONS}`],
                    ["Attempts", String(attempts)],
                    ["Correct", String(correct)],
                    ["Accuracy", `${accuracy}%`],
                    ["Best streak", String(bestStreak)],
                    ["Final streak", String(streak)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 text-left">
                      <p className="text-sm font-semibold text-slate-600">{label}</p>
                      <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={resetQuiz} className="min-h-11 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100">
                    Try again
                  </button>
                  <ShareResultsButton
                    title="Morse Code Audio Quiz"
                    subtitle="Listening quiz results"
                    stats={{ attempts, correct, progress: TOTAL_QUESTIONS, streak, bestStreak, totalQuestions: TOTAL_QUESTIONS }}
                    runStartedAt={runStartedAt}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 py-6 sm:px-8">
              <button
                type="button"
                onClick={() => playMorsePattern(morse)}
                className="min-h-12 w-full rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100 sm:w-72"
              >
                Play prompt
              </button>
              <label className="mt-5 block max-w-xl">
                <span className="text-sm font-extrabold text-sky-950">Your answer</span>
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
                  <button type="button" onClick={checkAnswer} disabled={!answer.trim()} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold disabled:opacity-50">
                    Check answer
                  </button>
                ) : (
                  <button type="button" onClick={nextPrompt} className="min-h-11 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100">
                    {completed + 1 >= TOTAL_QUESTIONS ? "Finish" : "Next prompt"}
                  </button>
                )}
                <button type="button" onClick={nextPrompt} disabled={solved} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold disabled:opacity-50">
                  Skip
                </button>
              </div>
              {checked ? (
                <p className={"mt-4 inline-flex rounded-full border px-3 py-1 text-sm font-extrabold " + (isCorrect ? "border-sky-200 bg-sky-50 text-sky-950" : "border-amber-200 bg-amber-50 text-amber-900")}>
                  {isCorrect ? "Correct." : "Not quite. Try again before moving on."}
                </p>
              ) : null}
            </div>
          )}
        </section>

        <SectionCard eyebrow="After the quiz" title="Use misses as your next practice list">
          <ActionLinks
            links={[
              { href: "/morse-code-word-trainer", label: "Word trainer", primary: true },
              { href: "/morse-code-worksheet-generator", label: "Worksheet generator" },
              { href: "/practice", label: "General practice" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
