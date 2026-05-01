import * as React from "react";
import type { Route } from "./+types/morse-code-word-trainer";

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
import { WORD_LISTS } from "~/client/data/morseLearning";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-word-trainer";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Word Trainer with Custom Lists | MorseWords",
    description:
      "Practice Morse words from built-in or custom lists, play audio, mark weak words, and send word sets into worksheets or audio tools.",
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

export default function MorseCodeWordTrainer() {
  const [listName, setListName] = React.useState<keyof typeof WORD_LISTS>("beginner");
  const [customWords, setCustomWords] = React.useState("signal\nteacher\npractice\ncopy");
  const [index, setIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [weakWords, setWeakWords] = React.useState<string[]>([]);

  const words = listName === "custom" as keyof typeof WORD_LISTS
    ? parseWords(customWords)
    : WORD_LISTS[listName];
  const activeWord = words[index % Math.max(words.length, 1)] ?? "";
  const activeMorse = textToMorse(activeWord);

  function next() {
    setShowAnswer(false);
    setIndex((value) => (value + 1) % Math.max(words.length, 1));
  }

  function markWeak() {
    if (!activeWord) return;
    setWeakWords((current) =>
      current.includes(activeWord) ? current : [...current, activeWord]
    );
    next();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Word Trainer",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Word practice"
          title="Morse code word trainer"
          description="Practice Morse at the word level with built-in lists or your own pasted words. Play the current word, reveal the Morse, mark weak words, and send lists into worksheets or audio."
          aside={
            <DarkNote label="Current word" value={activeWord.toUpperCase() || "READY"}>
              Word-level practice helps patterns become useful chunks instead
              of isolated character drills.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-words", label: "Word chart", primary: true },
              { href: "/morse-code-worksheet-generator", label: "Make worksheet" },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
            ]}
          />
        </PageHero>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-6 sm:px-8">
            <div className="flex flex-wrap gap-2">
              {(["beginner", "classroom", "radio", "custom"] as const).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setListName(name as keyof typeof WORD_LISTS);
                    setIndex(0);
                    setShowAnswer(false);
                  }}
                  className={
                    "min-h-11 cursor-pointer rounded-xl border px-4 py-2 text-sm font-extrabold capitalize transition " +
                    (listName === name
                      ? "border-neutral-950 bg-neutral-950 text-sky-100"
                      : "border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50")
                  }
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              {listName === ("custom" as keyof typeof WORD_LISTS) ? (
                <label className="block">
                  <span className="text-sm font-extrabold text-sky-950">
                    Custom words
                  </span>
                  <textarea
                    value={customWords}
                    onChange={(event) => {
                      setCustomWords(event.target.value);
                      setIndex(0);
                    }}
                    className="mt-2 min-h-36 w-full rounded-xl border border-slate-200 p-4 font-mono text-base outline-none focus:border-sky-400"
                  />
                </label>
              ) : null}

              <div className="mt-4 rounded-xl border border-slate-200 bg-[#f7fbff] p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Prompt {words.length ? index + 1 : 0} / {words.length}
                </p>
                <p className="mt-3 text-5xl font-black text-sky-950">
                  {activeWord || "Add words"}
                </p>
                <p className="mt-4 min-h-8 font-mono text-xl font-bold tracking-[0.18em] text-slate-950">
                  {showAnswer ? activeMorse : "Answer hidden"}
                </p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                <button className="min-h-12 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100" type="button" onClick={() => playMorsePattern(activeMorse)}>
                  Play
                </button>
                <button className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold" type="button" onClick={() => setShowAnswer((v) => !v)}>
                  Reveal
                </button>
                <button className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold" type="button" onClick={next}>
                  Got it
                </button>
                <button className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold" type="button" onClick={markWeak}>
                  Mark weak
                </button>
              </div>
            </div>

            <aside className="rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
              <h2 className="text-xl font-extrabold text-sky-950">Weak words</h2>
              {weakWords.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {weakWords.map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => playMorsePattern(textToMorse(word))}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-bold text-slate-900"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  Mark missed words here, then turn them into a worksheet or
                  audio drill.
                </p>
              )}
            </aside>
          </div>
        </section>

        <SectionCard
          eyebrow="Export next"
          title="Turn word practice into review material"
          description="When a list exposes weak words, send it into a printable worksheet or use the audio page for repeat listening."
        >
          <ActionLinks
            links={[
              { href: "/morse-code-worksheet-generator", label: "Worksheet generator", primary: true },
              { href: "/audio", label: "Audio generator" },
              { href: "/morse-code-word-search-builder", label: "Word search builder" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

