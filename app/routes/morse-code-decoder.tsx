import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  morseToText,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import HowItWorks from "~/client/components/morse-code-decoder/HowItWorks";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-decoder";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Decoder | Convert Dots and Dashes to Text",
    description:
      "Decode dots, dashes, spaces, slashes, and pasted Morse into readable text. Clean messy separators and keep uncertain characters visible.",
    path: CANONICAL_PATH,
    keywords:
      "morse code decoder, morse to text, morse code to text, decode morse code, convert morse code to text, morse decoder",
  });
}

export default function Home() {
  // Translator state (conversion logic stays in morseUtils)
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const baseUrl = SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Decoder",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "Browser-based Morse code decoder for converting Morse into readable text.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faqItems = [
    {
      q: "What does a Morse code decoder do?",
      a: "A decoder converts dots and dashes (International Morse) into readable text using a fixed character map.",
    },
    {
      q: "How should I format Morse for best results?",
      a: "Separate letters with spaces and words with longer gaps. Slashes (/) are also treated as word separators when decoding.",
    },
    {
      q: "Can I decode Morse with / between words?",
      a: "Yes. A slash is interpreted as a word break, which is common in puzzles and copied Morse strings.",
    },
    {
      q: "Why do I see “?” in the output sometimes?",
      a: "Unknown or invalid Morse sequences decode to “?” so mistakes stay visible instead of being guessed silently.",
    },
    {
      q: "Is this decoder private?",
      a: "Yes. Decoding runs locally in your browser and does not require sending your Morse input to a server.",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <TranslatorSectionsBasic
          title="Morse Code Decoder"
          subtitle={
            <p className="mt-2 max-w-none text-base leading-7 text-slate-700 sm:text-[1.08rem]">
              Paste Morse from a puzzle, worksheet, screenshot, or message and
              turn it back into readable text with visible separator handling.
            </p>
          }
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
        />

        <HowItWorks />

        <FaqSectionGeneric title="Decoder FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
