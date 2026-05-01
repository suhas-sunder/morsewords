import * as React from "react";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { morseToText, textToMorse } from "~/client/components/shared/morseUtils";
import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-sos";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const SOS_MORSE = "...   ---   ...";
const SOS_PROSIGN = "...---...";

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "SOS in Morse Code - Translate, Play & Copy the Distress Signal",
    description:
      "See SOS in Morse code, play the distress signal with sound or flash, copy the dots and dashes, and learn what SOS means.",
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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-[#fffdf8] shadow-sm">
      <div className="border-b border-slate-200 bg-[#fffaf2] px-5 py-5 sm:px-8">
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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-[#fffdf8] shadow-sm">
      <div className="border-b border-slate-200 bg-[#fffaf2] px-5 py-6 sm:px-8">
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

          <div className="rounded-xl border border-slate-800 bg-[#171717] px-4 py-3 text-white shadow-sm lg:w-72">
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

      <div className="grid gap-4 bg-[#fffdf8] px-5 py-6 sm:grid-cols-3 sm:px-8">
        {[
          { label: "S", marks: ["dot", "dot", "dot"] },
          { label: "O", marks: ["dash", "dash", "dash"] },
          { label: "S", marks: ["dot", "dot", "dot"] },
        ].map((group, index) => (
          <div
            key={`${group.label}-${index}`}
            className="rounded-xl border border-slate-200 bg-[#f7f4ee] p-4 text-center"
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
                      ? "h-5 w-5 rounded bg-[#171717]"
                      : "h-5 w-14 rounded bg-[#171717]"
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
      a: "SOS in Morse code is three dots, three dashes, and three dots: ... --- ... . As a distress prosign it may be sent continuously as ...---... .",
    },
    {
      q: "Does SOS stand for Save Our Souls?",
      a: "No. Save Our Souls and Save Our Ship are popular memory phrases, but SOS was chosen because the Morse pattern is simple, symmetrical, and recognizable.",
    },
    {
      q: "Can SOS be sent with a flashlight?",
      a: "Yes. Use the same rhythm: three short flashes, three long flashes, and three short flashes.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "SOS in Morse Code",
      url: CANONICAL_URL,
      description:
        "Interactive guide to SOS in Morse code with audio playback, flash, copy-ready dots and dashes, and plain-English history.",
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
      about: [
        { "@type": "Thing", name: "SOS distress signal" },
        { "@type": "Thing", name: "International Morse code" },
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
    <div style={styles.page}>
      <main style={styles.wrap}>
        <TranslatorSectionsBasic
          title="SOS Morse Code Translator"
          subtitle={
            <p className="mt-2 max-w-none text-base leading-7 text-slate-700 sm:text-[1.08rem]">
              Translate SOS, play the signal, copy the Morse, or use Flash
              Light with the same controls as the main MorseWords translator.
            </p>
          }
          examples={["SOS", "HELP", "MAYDAY", "CQD", "TEST SOS"]}
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
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

          <FaqSectionGeneric title="SOS FAQ" items={faqItems} />
        </div>

        {jsonLd.map((item, index) => (
          <JsonLdScript key={index} jsonLd={item} />
        ))}
      </main>
    </div>
  );
}
