import * as React from "react";
import type { Route } from "./+types/morse-code-worksheet-generator";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-worksheet-generator";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Worksheet Generator | Custom Practice Sheets",
    description:
      "Create custom Morse code worksheets from words or sentences, show or hide answer keys, print browser-ready sheets, and open the full chart builder.",
    path: CANONICAL_PATH,
    keywords:
      "morse code worksheet generator, printable morse worksheets, morse code answer key, morse code teacher worksheet",
  });
}

function parseLines(input: string) {
  return input
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function MorseCodeWorksheetGenerator() {
  const [content, setContent] = React.useState("sos\nhello world\npractice morse\ncopy the signal");
  const [showAnswers, setShowAnswers] = React.useState(true);
  const rows = React.useMemo(() => parseLines(content), [content]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Worksheet Generator",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Printable practice"
          title="Morse code worksheet generator"
          description="Build quick printable Morse worksheets from custom words or sentences. Use this page for fast handouts, or open the full printable chart builder for QR codes, branding, scoring, and export controls."
          aside={
            <DarkNote label="Teacher flow" value="TYPE  PRINT  REVIEW">
              Keep answer keys visible while preparing, then hide them for
              student copies.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-printable-chart", label: "Full chart builder", primary: true },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
              { href: "/morse-code-word-search-builder", label: "Word search" },
            ]}
          />
        </PageHero>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-5 border-b border-slate-200 px-5 py-6 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div>
              <label className="block">
                <span className="text-sm font-extrabold text-sky-950">
                  Words or sentences
                </span>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="mt-2 min-h-56 w-full rounded-xl border border-slate-200 p-4 font-mono text-base outline-none focus:border-sky-400"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnswers((value) => !value)}
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold"
                >
                  {showAnswers ? "Hide answer key" : "Show answer key"}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-11 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100"
                >
                  Print worksheet
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
              <h2 className="text-2xl font-extrabold text-sky-950">
                Worksheet preview
              </h2>
              <div className="mt-4 space-y-3">
                {rows.map((row, index) => (
                  <div key={row + index} className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      Prompt {index + 1}
                    </p>
                    <p className="mt-2 text-lg font-extrabold text-slate-950">
                      {row}
                    </p>
                    <p className="mt-2 min-h-7 font-mono text-base font-bold tracking-[0.14em] text-slate-950">
                      {showAnswers ? textToMorse(row) : "Answer: ______________________________"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionCard
          eyebrow="When to use the full builder"
          title="Need PDFs, branding, scoring, or QR codes?"
          description="The existing printable chart builder remains the most powerful print workflow. This page is the fast custom worksheet route; the full builder handles richer classroom templates."
        >
          <ActionLinks
            links={[
              { href: "/morse-code-printable-chart", label: "Open full builder", primary: true },
              { href: "/morse-code-word-search-builder", label: "Word search builder" },
              { href: "/learn-morse-code", label: "Learning hub" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
