import * as React from "react";
import type { Route } from "./+types/morse-code-word-search-builder";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-word-search-builder";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Word Search Builder | Printable Classroom Puzzles",
    description:
      "Build a printable Morse code word search from custom vocabulary, classroom lists, radio terms, or learner words with a clean answer key.",
    path: CANONICAL_PATH,
    keywords:
      "morse code word search, morse word search builder, printable morse code puzzle, morse code puzzle maker",
  });
}

function parseWords(input: string) {
  return input
    .split(/[\n,]+/)
    .map((word) => word.trim().toUpperCase().replace(/[^A-Z0-9]/g, ""))
    .filter(Boolean)
    .slice(0, 14);
}

function buildGrid(words: string[], size: number) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => letters[(x * 7 + y * 11) % letters.length])
  );

  words.forEach((word, index) => {
    const clean = word.slice(0, size);
    if (!clean) return;
    if (index % 2 === 0) {
      const row = (index * 2) % size;
      const start = Math.max(0, Math.min(size - clean.length, 1 + index));
      [...clean].forEach((ch, offset) => {
        grid[row][start + offset] = ch;
      });
    } else {
      const col = (index * 3) % size;
      const start = Math.max(0, Math.min(size - clean.length, 1 + index));
      [...clean].forEach((ch, offset) => {
        grid[start + offset][col] = ch;
      });
    }
  });

  return grid;
}

export default function MorseCodeWordSearchBuilder() {
  const [input, setInput] = React.useState("MORSE\nSIGNAL\nRADIO\nTEACHER\nPRACTICE\nCOPY\nAUDIO\nLIGHT");
  const [size, setSize] = React.useState(12);
  const words = React.useMemo(() => parseWords(input), [input]);
  const grid = React.useMemo(() => buildGrid(words, size), [words, size]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Word Search Builder",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Printable puzzle"
          title="Morse code word search builder"
          description="Create a simple printable word search from Morse vocabulary, classroom terms, Q-codes, or custom learner words. Use it as a warm-up before translation and audio practice."
          aside={
            <DarkNote label="Puzzle words" value={`${words.length} WORDS`}>
              Keep words short for cleaner grids. Use the answer list as the
              teacher key.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-worksheet-generator", label: "Worksheet generator", primary: true },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
              { href: "/morse-code-printable-chart", label: "Full print builder" },
            ]}
          />
        </PageHero>

        <section className="mt-8 grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div>
            <label className="block">
              <span className="text-sm font-extrabold text-sky-950">
                Word list
              </span>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="mt-2 min-h-56 w-full rounded-xl border border-slate-200 p-4 font-mono text-base outline-none focus:border-sky-400"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-extrabold text-sky-950">
                Grid size: {size} x {size}
              </span>
              <input
                type="range"
                min={10}
                max={16}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="mt-3 w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </label>
            <button type="button" onClick={() => window.print()} className="mt-4 min-h-11 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100">
              Print puzzle
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {grid.flatMap((row, rowIndex) =>
                row.map((letter, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="flex aspect-square items-center justify-center rounded border border-slate-200 bg-white font-mono text-sm font-black text-slate-950"
                  >
                    {letter}
                  </div>
                ))
              )}
            </div>
            <div className="mt-5">
              <h2 className="text-lg font-extrabold text-sky-950">Answer list</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {words.map((word) => (
                  <span key={word} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm font-bold text-slate-800">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionCard eyebrow="Teaching flow" title="Pair puzzles with real Morse practice">
          <ActionLinks
            links={[
              { href: "/morse-code-word-trainer", label: "Practice the words", primary: true },
              { href: "/morse-code-audio-practice", label: "Hear the words" },
              { href: "/morse-code-worksheet-generator", label: "Make answer sheet" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
