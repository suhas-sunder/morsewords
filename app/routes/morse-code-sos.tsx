import * as React from "react";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import { morseToText, textToMorse } from "~/client/components/shared/morseUtils";
import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/morse-code-sos";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const SOS_MORSE = "...   ---   ...";
const SOS_PROSIGN = "...---...";

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "Morse Code SOS | Distress Signal Pattern and Examples | MorseWords",
    description:
      "Learn SOS in Morse code, how the pattern is written and recognized, common mistakes, and ways to hear or practice it.",
    path: CANONICAL_PATH,
    keywords:
      "sos in morse code, sos morse code, what is sos in morse code, sos distress signal, save our souls morse code, morse code sos sound",
  });
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mw-static-panel overflow-hidden rounded-2xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft bg-[#fffaf2] px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            {eyebrow}
          </span>
        </div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          {title}
        </h2>
      </div>
      <div className="px-5 py-6 text-base leading-relaxed text-slate-700 sm:px-8 sm:text-lg">
        {children}
      </div>
    </section>
  );
}

function SosReferenceCard() {
  return (
    <section className="mw-static-panel overflow-hidden rounded-2xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft bg-[#fffaf2] px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Distress signal
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              What is SOS in Morse code?
            </h2>
            <p className="mt-4 max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              SOS is three short signals, three long signals, and three short
              signals. For everyday translation it appears as the letters S O S;
              as a distress prosign, it is often sent as one continuous pattern.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 px-4 py-3 text-white lg:w-72">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
              Copy-ready signal
            </p>
            <p className="mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
              {SOS_MORSE}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              Continuous prosign:{" "}
              <span className="font-mono font-bold">{SOS_PROSIGN}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mw-static-panel grid gap-4 bg-[#fffdf8] px-5 py-6 sm:grid-cols-3 sm:px-8">
        {[
          { label: "S", marks: ["dot", "dot", "dot"] },
          { label: "O", marks: ["dash", "dash", "dash"] },
          { label: "S", marks: ["dot", "dot", "dot"] },
        ].map((group, index) => (
          <div
            key={`${group.label}-${index}`}
            className="rounded-xl bg-[#f7f4ee] p-4 text-center"
          >
            <div className="text-4xl font-extrabold text-sky-950">
              {group.label}
            </div>
            <div className="mt-4 flex min-h-8 items-center justify-center gap-2">
              {group.marks.map((mark, markIndex) => (
                <span
                  key={`${mark}-${markIndex}`}
                  className={
                    mark === "dot"
                      ? "h-5 w-5 rounded bg-slate-950"
                      : "h-5 w-14 rounded bg-slate-950"
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function MorseCodeSos() {
  const [plainA, setPlainA] = React.useState("SOS");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);
  const [morseB, setMorseB] = React.useState(SOS_MORSE);
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const faqItems = [
    {
      q: "What is SOS in Morse code?",
      a: "SOS in Morse code is three dots, three dashes, and three dots: ... --- ... . It is widely recognized as a distress signal.",
    },
    {
      q: "Is SOS three letters or one distress signal?",
      a: "It can be written as the letters S O S, but in distress signaling the pattern is often treated as one continuous, recognizable signal.",
    },
    {
      q: "What does SOS stand for?",
      a: "Officially, SOS does not stand for a phrase. Save Our Souls and Save Our Ship are memory aids, not the original meaning.",
    },
    {
      q: "How do you hear SOS?",
      a: "Listen for three short beeps, three longer beeps, and three short beeps. The long beeps are dashes and last about three dot units.",
    },
    {
      q: "Is SOS the same as a prosign?",
      a: "SOS is a special distress signal. Prosign pages explain normal operating procedure signals such as wait, end, or correction.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Morse Code SOS",
      url: CANONICAL_URL,
      description:
        "Guide to the SOS Morse distress signal pattern, how it is written, how it sounds, common mistakes, and ways to practice it.",
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
      about: [
        { "@type": "Thing", name: "SOS distress signal" },
        { "@type": "Thing", name: "International Morse code" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Morse Code SOS",
          item: CANONICAL_URL,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <TranslatorSectionsBasic
          title="Morse Code SOS"
          subtitle={
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              See the SOS distress pattern, play it as sound, copy the dots
              and dashes, or compare the spaced letter form with the continuous
              signal form.
            </p>
          }
          examples={["SOS", "HELP", "MAYDAY", "CQD", "TEST SOS"]}
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          quietInputFocus
        />

        <div className="grid gap-6">
          <SosReferenceCard />

          <Section eyebrow="Sound pattern" title="What does SOS sound like?">
            <p>
              SOS sounds like three short beeps, three long beeps, and three
              short beeps. In Morse timing, a dash is three times as long as a
              dot. The pauses are just as important as the marks because they
              make the signal readable.
            </p>
          </Section>

          <Section eyebrow="Meaning" title="Does SOS mean Save Our Souls?">
            <p>
              Not officially. "Save Our Souls" and "Save Our Ship" are easy
              ways to remember SOS, but the signal itself was adopted because
              the pattern is short, clear, and hard to miss in an emergency.
            </p>
          </Section>

          <Section eyebrow="Practical use" title="How to send SOS">
            <ul className="m-0 grid gap-2 pl-5">
              <li>By sound: three short beeps, three long beeps, three short beeps.</li>
              <li>By light: three short flashes, three long flashes, three short flashes.</li>
              <li>By tapping: three quick taps, three longer taps, three quick taps.</li>
              <li>By writing: use SOS or the Morse pattern ... --- ... .</li>
            </ul>
          </Section>

          <ReferenceSupportSections
            guide={{
              eyebrow: "Distress pattern",
              title: "How to use this SOS page",
              description:
                "Use this page when you need the specific SOS pattern, not a broad prosign list or a general practice drill.",
              items: [
                {
                  title: "Who it is for",
                  text: "Learners, teachers, puzzle makers, and anyone checking the SOS pattern, meaning, sound, and spacing.",
                },
                {
                  title: "What it explains",
                  text: "The page shows SOS as spaced letters, the continuous distress pattern, and the short-long-short rhythm that makes it recognizable.",
                },
                {
                  title: "How to apply it",
                  text: "Copy the pattern, play it, compare the spacing, then move into audio or visual practice if you want to recognize it faster.",
                },
              ],
            }}
            examples={{
              title: "Worked SOS examples",
              description:
                "These examples separate the written letters, continuous signal, and practice use.",
              items: [
                {
                  title: "Written SOS",
                  morse: "... --- ...",
                  children: (
                    <p>
                      This is the letter-by-letter form:{" "}
                      <a
                        href="/s-in-morse-code"
                        className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                      >
                        S
                      </a>
                      , then{" "}
                      <a
                        href="/o-in-morse-code"
                        className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                      >
                        O
                      </a>
                      , then S. It is easiest to read in normal text and
                      translators.
                    </p>
                  ),
                },
                {
                  title: "Continuous distress signal",
                  morse: "...---...",
                  children: (
                    <p>
                      Operators often recognize SOS as one continuous distress
                      pattern: three short, three long, three short.
                    </p>
                  ),
                },
                {
                  title: "Practice by sound",
                  morse: "short short short / long long long / short short short",
                  children: (
                    <p>
                      Use{" "}
                      <a
                        href="/morse-code-audio-practice"
                        className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                      >
                        audio practice
                      </a>{" "}
                      or{" "}
                      <a
                        href="/morse-code-visual-practice"
                        className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                      >
                        visual practice
                      </a>{" "}
                      after you understand the pattern.
                    </p>
                  ),
                },
              ],
            }}
            mistakes={{
              title: "Common SOS mistakes",
              description:
                "SOS is simple, but people often mix up the meaning, spacing, or page type.",
              items: [
                {
                  title: "Inventing a phrase",
                  children: (
                    <p>
                      Treat Save Our Souls as a memory aid, not the official
                      origin of the signal.
                    </p>
                  ),
                },
                {
                  title: "Confusing signal and text",
                  children: (
                    <p>
                      The spaced letter form is easiest for copying. The
                      continuous pattern is the recognizable distress rhythm.
                    </p>
                  ),
                },
                {
                  title: "Using the wrong reference",
                  children: (
                    <p>
                      Use{" "}
                      <a
                        href="/morse-code-prosigns"
                        className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                      >
                        prosigns
                      </a>{" "}
                      for operating procedure signals, not for the SOS pattern
                      alone.
                    </p>
                  ),
                },
              ],
            }}
            comparison={{
              eyebrow: "Choose a signal page",
              title: "SOS vs prosigns vs practice pages",
              description:
                "Use the page that matches the signal or learning task.",
              items: [
                {
                  title: "SOS",
                  text: "Use this page for the specific distress signal pattern, meaning, sound, and practice links.",
                  href: "/morse-code-sos",
                  badge: "Distress",
                },
                {
                  title: "Prosigns",
                  text: "Use the prosigns page for procedural signals that control operating flow.",
                  href: "/morse-code-prosigns",
                  badge: "Procedure",
                },
                {
                  title: "Practice",
                  text: "Use practice pages when you already know the pattern and want recall drills.",
                  href: "/practice",
                  badge: "Drill",
                },
              ],
            }}
            nextStep={{
              title: "Best next step after SOS",
              description:
                "Practice recognizing the pattern in the format you plan to use.",
              links: [
                { href: "/audio", label: "Play SOS as audio", primary: true },
                { href: "/help-in-morse-code", label: "HELP in Morse" },
                { href: "/help-me-in-morse-code", label: "HELP ME in Morse" },
                { href: "/morse-code-sound-generator", label: "Test the beep tone" },
                { href: "/morse-code-audio-practice", label: "Practice by ear" },
                { href: "/morse-code-prosigns", label: "Compare prosigns" },
              ],
            }}
          />

          <FaqSectionGeneric title="SOS FAQ" items={faqItems} />
        </div>

        {jsonLd.map((item, index) => (
          <JsonLdScript key={index} jsonLd={item} />
        ))}
      </main>
      <BreadcrumbTrail current="Morse Code SOS" />
    </div>
  );
}
