import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import {
  morseToText,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import HowItWorks from "~/client/components/the-quick-brown-fox-morse-code/HowItWorks";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/the-quick-brown-fox-morse-code";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "The Quick Brown Fox in Morse Code | Full Alphabet Practice Phrase | MorseWords",
    description:
      "See the quick brown fox phrase in Morse code and learn why this pangram helps with full alphabet practice.",
    path: CANONICAL_PATH,
    keywords:
      "the quick brown fox morse code, quick brown fox morse, morse code pangram, the quick brown fox jumps over the lazy dog morse code",
  });
}

export default function Home() {
  // Translator state (conversion logic stays in morseUtils)
  const [plainA, setPlainA] = React.useState(
    "the quick brown fox jumps over the lazy dog",
  );
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState(
    textToMorse("the quick brown fox jumps over the lazy dog"),
  );
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const baseUrl = SITE_URL;
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "The Quick Brown Fox in Morse Code",
    url: CANONICAL_URL,
    description:
      "Phrase page showing the quick brown fox pangram in International Morse code with copy, playback, spacing, and practice guidance.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: baseUrl },
    about: [
      { "@type": "Thing", name: "International Morse code" },
      { "@type": "Thing", name: "Pangram" },
      { "@type": "Thing", name: "Alphabet practice" },
    ],
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "The Quick Brown Fox in Morse Code",
        item: CANONICAL_URL,
      },
    ],
  };
  const faqItems = [
    {
      q: "Why use the quick brown fox for Morse code?",
      a: "The phrase is a pangram, so it contains every letter of the alphabet and gives learners a compact full-letter practice example.",
    },
    {
      q: "Does the phrase include every letter?",
      a: "Yes. The full phrase, the quick brown fox jumps over the lazy dog, includes A-Z at least once.",
    },
    {
      q: "Is this good for beginners?",
      a: "It is useful after beginners know several letters. Brand-new learners should start with a shorter alphabet review before attempting the full phrase.",
    },
    {
      q: "Should I practice the phrase visually or by sound?",
      a: "Use both. Visual practice helps you check spacing and letter patterns; audio practice helps you recognize the rhythm without staring at dots and dashes.",
    },
    {
      q: "How is this different from sentence practice?",
      a: "This page focuses on one known pangram and why it covers the alphabet. Sentence practice gives varied prompts for broader fluency.",
    },
  ];
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
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <TranslatorSectionsBasic
          title="The Quick Brown Fox in Morse Code"
          subtitle={
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              See the classic pangram in Morse, copy the spaced output, play it
              as audio, and use it as a full-alphabet practice phrase.
            </p>
          }
          examples={[
            "the quick brown fox jumps over the lazy dog",
            "quick brown fox",
            "lazy dog",
            "alphabet practice",
          ]}
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          quietInputFocus
        />

        <HowItWorks />

        <ReferenceSupportSections
          guide={{
            eyebrow: "Pangram practice",
            title: "How to use this phrase page",
            description:
              "Use this page when you want one known sentence that exercises the whole alphabet.",
            items: [
              {
                title: "Who it is for",
                text: "Learners checking A-Z coverage, teachers building exercises, and puzzle makers who need a recognizable full-alphabet phrase.",
              },
              {
                title: "What it helps with",
                text: "The pangram makes learners handle every letter in one phrase while still practicing word spacing and copy-friendly formatting.",
              },
              {
                title: "How to apply it",
                text: "Copy the Morse, verify spacing, play the audio, then repeat the phrase through typing or sentence practice.",
              },
            ],
          }}
          examples={{
            title: "Quick brown fox practice examples",
            description:
              "These examples show why this phrase belongs on its own page instead of only inside a sentence drill.",
            items: [
              {
                title: "Full phrase",
                morse: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
                children: (
                  <p>
                    The full sentence includes every letter A-Z, so it is a
                    compact test of alphabet coverage.
                  </p>
                ),
              },
              {
                title: "Letter coverage",
                morse: "A-Z",
                children: (
                  <p>
                    If a letter feels weak while reading the phrase, review it
                    on the{" "}
                    <a
                      href="/morse-code-alphabet"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse code alphabet
                    </a>{" "}
                    page before trying again.
                  </p>
                ),
              },
              {
                title: "Practice flow",
                morse: "READ -> TYPE -> HEAR",
                children: (
                  <p>
                    Read the Morse visually, type the phrase from memory, then
                    play it on{" "}
                    <a
                      href="/audio"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      audio
                    </a>{" "}
                    to hear the rhythm.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common pangram practice mistakes",
            description:
              "This phrase is useful, but only when spacing and difficulty are handled deliberately.",
            items: [
              {
                title: "Starting too early",
                children: (
                  <p>
                    If every word feels like guessing, use shorter alphabet
                    drills before the full pangram.
                  </p>
                ),
              },
              {
                title: "Ignoring word gaps",
                children: (
                  <p>
                    The phrase is long enough that collapsed spaces can break
                    decoding. Use slash-separated Morse when sharing it.
                  </p>
                ),
              },
              {
                title: "Treating one phrase as fluency",
                children: (
                  <p>
                    A pangram checks letter coverage. Use{" "}
                    <a
                      href="/morse-code-sentence-practice"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      sentence practice
                    </a>{" "}
                    when you need varied phrase flow.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a phrase page",
            title: "Quick brown fox vs sentence practice vs alphabet chart",
            description:
              "Each page supports a different part of the learning path.",
            items: [
              {
                title: "Quick brown fox",
                text: "Use this page for one known full-alphabet pangram and its Morse formatting.",
                href: "/the-quick-brown-fox-morse-code",
                badge: "Pangram",
              },
              {
                title: "Sentence practice",
                text: "Use sentence practice for varied prompts and broader phrase flow.",
                href: "/morse-code-sentence-practice",
                badge: "Sentences",
              },
              {
                title: "Alphabet chart",
                text: "Use the alphabet chart when individual letters need review before the full phrase.",
                href: "/morse-code-alphabet",
                badge: "A-Z",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after the pangram",
            description:
              "Move from a known phrase into either targeted review or varied practice.",
            links: [
              { href: "/typing", label: "Type the phrase", primary: true },
              { href: "/morse-code-sentence-practice", label: "Practice sentences" },
              { href: "/learn-morse-code", label: "Review the learning path" },
              { href: "/practice", label: "Start practice drills" },
            ],
          }}
        />

        <FaqSectionGeneric
          title="Quick Brown Fox Morse Code FAQ"
          items={faqItems}
        />
      </div>

      <BreadcrumbTrail current="The Quick Brown Fox in Morse Code" />
      <JsonLdScript jsonLd={[pageJsonLd, breadcrumbJsonLd, faqJsonLd]} />
    </div>
  );
}
