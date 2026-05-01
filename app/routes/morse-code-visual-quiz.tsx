import * as React from "react";
import type { Route } from "./+types/morse-code-visual-quiz";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import { morseVisualEvents } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-visual-quiz";
const PROMPTS = ["sos", "cq", "test", "help", "73", "qsl"];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Visual Quiz with Flashing Light | MorseWords",
    description:
      "Take a visual Morse code quiz. Watch the flashing light signal, type the answer, and check your recall.",
    path: CANONICAL_PATH,
    keywords: "morse code visual quiz, flashing morse quiz, morse code light test",
  });
}

function useFlash(pattern: string) {
  const [active, setActive] = React.useState(false);
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);
  function play() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    let cursor = 0;
    for (const event of morseVisualEvents(pattern, 14)) {
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
  const prompt = PROMPTS[index % PROMPTS.length];
  const morse = textToMorse(prompt);
  const { active, play } = useFlash(morse);
  const correct = answer.trim().toLowerCase() === prompt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Morse Code Visual Quiz",
    url: canonicalUrl(CANONICAL_PATH),
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Visual test"
          title="Morse code visual quiz"
          description="Watch the flashing bulb, type the message you saw, then check the answer. This is the visual companion to the audio quiz."
          aside={<DarkNote label="Prompt" value={`#${index + 1}`}>Use replay until the pattern is clear, then check.</DarkNote>}
        >
          <ActionLinks
            links={[
              { href: "/morse-code-visual-practice", label: "Visual practice", primary: true },
              { href: "/morse-code-audio-quiz", label: "Audio quiz" },
            ]}
          />
        </PageHero>

        <section className="mt-8 grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-[#fffdf8] p-6">
            <div className={"h-40 w-40 rounded-full border transition-all duration-75 " + (active ? "border-sky-300 bg-sky-200 shadow-[0_0_60px_rgba(56,189,248,0.95)]" : "border-slate-200 bg-slate-100 shadow-inner")} />
            <button type="button" onClick={play} className="mt-5 min-h-12 w-full rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100">
              Flash prompt
            </button>
          </div>
          <div>
            <label className="block">
              <span className="text-sm font-extrabold text-sky-950">Your answer</span>
              <input value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }} className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-mono text-lg outline-none focus:border-sky-400" />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setChecked(true)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold">
                Check answer
              </button>
              <button type="button" onClick={() => { setAnswer(""); setChecked(false); setIndex((value) => (value + 1) % PROMPTS.length); }} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold">
                Next prompt
              </button>
            </div>
            {checked ? (
              <p className={"mt-4 text-lg font-extrabold " + (correct ? "text-green-700" : "text-red-700")}>
                {correct ? "Correct." : `Not quite. Answer: ${prompt.toUpperCase()} (${morse})`}
              </p>
            ) : null}
          </div>
        </section>

        <SectionCard eyebrow="Review" title="Build review from missed visual prompts">
          <ActionLinks
            links={[
              { href: "/morse-code-word-trainer", label: "Word trainer", primary: true },
              { href: "/morse-code-worksheet-generator", label: "Worksheet generator" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

