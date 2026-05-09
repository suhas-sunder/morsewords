import * as React from "react";
import type { Route } from "./+types/morse-code-encoder";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import {
  morseToText,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-encoder";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Encoder | Convert Text to Dots and Dashes | MorseWords",
    description:
      "Use the Morse code encoder to convert text into dots and dashes, copy the output, and understand spacing between letters and words.",
    path: CANONICAL_PATH,
    keywords:
      "morse code encoder, text to morse code, convert text to morse code, english to morse code, dots and dashes encoder",
  });
}

const faqItems = [
  {
    q: "What is a Morse code encoder?",
    a: "A Morse code encoder converts normal text into dots and dashes using International Morse mappings. Use it when you want to write or copy a message in Morse.",
  },
  {
    q: "Can I encode numbers and punctuation?",
    a: "Yes. The encoder supports letters, numbers, and common punctuation that exists in the MorseWords character map. Unsupported characters are skipped rather than guessed.",
  },
  {
    q: "Why are some characters skipped or unsupported?",
    a: "MorseWords keeps encoding conservative. If a pasted symbol is not in the supported Morse map, the tool omits it so the output does not invent an incorrect signal.",
  },
  {
    q: "How should words be separated in Morse code?",
    a: "The encoder separates letters with 3 spaces and words with 7 spaces. If you need slash, pipe, or newline word breaks, use the word separator page after encoding.",
  },
  {
    q: "Should I use the encoder or the main translator?",
    a: "Use the encoder when your task is only text to Morse. Use the main translator when you want the two-way workspace with audio and quick examples in one place.",
  },
];

export default function MorseCodeEncoder() {
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Encoder",
        item: CANONICAL_URL,
      },
    ],
  };
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Encoder",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "Text-to-Morse encoder for converting normal text into dots and dashes with readable letter and word spacing.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const jsonLd = [breadcrumbJsonLd, webAppJsonLd, faqJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <TranslatorSectionsBasic
          title="Morse Code Encoder"
          subtitle={
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Turn normal text into Morse code dots and dashes. Use this page
              when you want to write a message in Morse, copy the output, or
              check how supported letters, numbers, and punctuation are encoded.
            </p>
          }
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          enableQueryPrefill
          preferredDirection="encode"
          quietInputFocus
        />

        <ReferenceSupportSections
          guide={{
            eyebrow: "Text to Morse",
            title: "How to use the Morse code encoder",
            description:
              "Use this page when the input starts as normal text and the result needs to be copyable Morse.",
            items: [
              {
                title: "Who it is for",
                text: "Writers, students, teachers, and puzzle solvers who need to turn readable text into dots and dashes.",
              },
              {
                title: "What it does",
                text: "The tool normalizes supported text, maps each character to International Morse, and keeps letter and word gaps readable.",
              },
              {
                title: "How to use it",
                text: "Type or paste text, review the Morse output, then copy it or move it into audio, practice, or spacing tools.",
              },
            ],
          }}
          examples={{
            title: "Worked encoding examples",
            description:
              "These examples show how plain text becomes Morse and why spacing matters.",
            items: [
              {
                title: "HELLO",
                morse: "....   .   .-..   .-..   ---",
                children: (
                  <p>
                    Each letter becomes its own Morse pattern. The encoder uses
                    3 spaces between letters so the decoder can read the word
                    back correctly.
                  </p>
                ),
              },
              {
                title: "SOS",
                morse: "...   ---   ...",
                children: (
                  <p>
                    SOS is short and recognizable, which makes it useful for
                    checking output before moving into the{" "}
                    <a
                      href="/morse-code-sos"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      SOS explanation
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "TEST 123",
                morse: "-   .   ...   -       .----   ..---   ...--",
                children: (
                  <p>
                    The 7-space word gap keeps TEST separate from 123. Use the{" "}
                    <a
                      href="/morse-code-word-separator"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      word separator
                    </a>{" "}
                    if you need slash or pipe formatting.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common encoding mistakes",
            description:
              "Most encoding problems come from pasted characters, missing word gaps, or using the wrong conversion page.",
            items: [
              {
                title: "Unsupported symbols",
                children: (
                  <p>
                    If a symbol is skipped, replace it with a supported
                    punctuation mark or check the{" "}
                    <a
                      href="/morse-code-punctuation"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      punctuation reference
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "Collapsed spacing",
                children: (
                  <p>
                    Morse needs visible boundaries. Keep letter gaps and word
                    gaps intact before copying the output into another tool.
                  </p>
                ),
              },
              {
                title: "Wrong direction",
                children: (
                  <p>
                    If you already have dots and dashes, start with the{" "}
                    <a
                      href="/morse-code-decoder"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse code decoder
                    </a>{" "}
                    instead of the encoder.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            title: "Encoder vs decoder vs word separator",
            description:
              "Choose the page based on what is wrong with the input you already have.",
            items: [
              {
                title: "Encoder",
                text: "Use this page when you want to turn readable text into Morse code.",
                href: "/morse-code-encoder",
                badge: "Text to Morse",
              },
              {
                title: "Decoder",
                text: "Use the decoder when you already have Morse and want readable text.",
                href: "/morse-code-decoder",
                badge: "Morse to text",
              },
              {
                title: "Word separator",
                text: "Use the separator page when the Morse pattern is present but spacing needs cleanup.",
                href: "/morse-code-word-separator",
                badge: "Spacing",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after encoding",
            description:
              "Once the text is encoded, hear the rhythm or practice the words so the output becomes recognizable, not just copyable.",
            links: [
              { href: "/", label: "Open the main translator", primary: true },
              { href: "/name-to-morse-code", label: "Convert a name" },
              { href: "/how-to-write-in-morse-code", label: "Writing guide" },
              { href: "/copy-and-paste-morse-code", label: "Copy-paste guide" },
              { href: "/audio", label: "Play the message as audio" },
              { href: "/morse-code-word-trainer", label: "Practice encoded words" },
              { href: "/morse-code-word-separator", label: "Change word separators" },
            ],
          }}
        />

        <FaqSectionGeneric title="Encoder FAQ" items={faqItems} />
      </div>

      <BreadcrumbTrail current="Morse Code Encoder" />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
