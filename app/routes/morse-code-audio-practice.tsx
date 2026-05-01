import * as React from "react";
import type { Route } from "./+types/morse-code-audio-practice";

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

const CANONICAL_PATH = "/morse-code-audio-practice";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Practice with WPM and Repeat | MorseWords",
    description:
      "Practice Morse by ear with audio-only prompts, WPM control, repeat loops, built-in examples, and links to word and sentence drills.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio practice, listen to morse code, morse code by ear, morse audio drills, morse code listening practice",
  });
}

export default function MorseCodeAudioPractice() {
  const [message, setMessage] = React.useState("sos help");
  const [wpm, setWpm] = React.useState(18);
  const morse = React.useMemo(() => textToMorse(message), [message]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Audio Practice",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio practice"
          title="Morse code audio practice"
          description="Practice Morse by ear without turning the page into a full translator. Type or choose a short message, set the speed, listen, repeat, then move into quiz mode when you are ready."
          aside={
            <DarkNote label="Current signal" value={morse || "... --- ..."}>
              Audio practice is for recognition. Use the main audio generator
              when you need export controls and downloadable files.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-quiz", label: "Take audio quiz", primary: true },
              { href: "/audio", label: "Full audio generator" },
              { href: "/farnsworth-timing", label: "Farnsworth guide" },
            ]}
          />
        </PageHero>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-6 sm:px-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <label className="block">
                <span className="text-sm font-extrabold text-sky-950">
                  Practice message
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="mt-2 min-h-40 w-full rounded-xl border border-slate-200 p-4 font-mono text-base outline-none focus:border-sky-400"
                />
              </label>
              <div className="rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
                <label className="block">
                  <span className="text-sm font-extrabold text-sky-950">
                    Speed: {wpm} WPM
                  </span>
                  <input
                    type="range"
                    min={8}
                    max={30}
                    value={wpm}
                    onChange={(event) => setWpm(Number(event.target.value))}
                    className="mt-3 w-full"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => playMorsePattern(morse, { wpm })}
                  className="mt-5 min-h-12 w-full rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100"
                >
                  Play audio
                </button>
              </div>
            </div>
          </div>
          <div className="px-5 py-6 sm:px-8">
            <p className="font-mono text-base font-bold tracking-[0.16em] text-slate-950">
              {morse}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["CQ CQ", "TEST 123", "HELLO WORLD", "QTH HOME", "SOS"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMessage(preset)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-sky-300 hover:bg-sky-50"
                >
                  Try {preset}
                </button>
              ))}
            </div>
          </div>
        </section>

        <SectionCard
          eyebrow="Listening flow"
          title="Use audio practice before tests"
          description="Listen with the answer visible first, then hide the text and move into the audio quiz when the rhythm feels familiar."
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-quiz", label: "Audio quiz", primary: true },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
              { href: "/morse-code-sentence-practice", label: "Sentence practice" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

