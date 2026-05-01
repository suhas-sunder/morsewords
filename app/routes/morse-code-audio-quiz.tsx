import * as React from "react";
import type { Route } from "./+types/morse-code-audio-quiz";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-quiz";
const PROMPTS = ["sos", "cq", "test", "help", "radio", "qth", "copy", "73"];

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
  const prompt = PROMPTS[index % PROMPTS.length];
  const morse = textToMorse(prompt);
  const correct = answer.trim().toLowerCase() === prompt;

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
          aside={<DarkNote label="Prompt" value={`#${index + 1}`}>Play the signal as many times as needed before checking.</DarkNote>}
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-practice", label: "Audio practice", primary: true },
              { href: "/morse-code-visual-quiz", label: "Visual quiz" },
            ]}
          />
        </PageHero>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
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
              className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-mono text-lg outline-none focus:border-sky-400"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => setChecked(true)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold">
              Check answer
            </button>
            <button
              type="button"
              onClick={() => {
                setAnswer("");
                setChecked(false);
                setIndex((value) => (value + 1) % PROMPTS.length);
              }}
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold"
            >
              Next prompt
            </button>
          </div>
          {checked ? (
            <p className={"mt-4 text-lg font-extrabold " + (correct ? "text-green-700" : "text-red-700")}>
              {correct ? "Correct." : `Not quite. Answer: ${prompt.toUpperCase()} (${morse})`}
            </p>
          ) : null}
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

