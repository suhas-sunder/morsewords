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
import HowItWorks from "~/client/components/the-quick-brown-fox-morse-code/HowItWorks";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/the-quick-brown-fox-morse-code";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "The Quick Brown Fox in Morse Code | Copy & Play the Pangram",
    description:
      "See the full quick brown fox pangram in Morse code, copy the dots and dashes, play the audio, and use the phrase for alphabet practice.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Quick Brown Fox Morse Code",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "Page showing the Quick Brown Fox pangram in International Morse code with copy and audio.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faqItems = [
    {
      q: "Why is “the quick brown fox…” used so often?",
      a: "It is a pangram: a sentence that contains every letter A–Z. That makes it useful for typing tests, font previews, and decoding practice.",
    },
    {
      q: "What Morse standard is shown here?",
      a: "This page uses International Morse code (the standard mapping for letters, numbers, and common punctuation).",
    },
    {
      q: "How are words separated in the Morse string?",
      a: "Words are separated with clear gaps. When decoding, the tool also accepts slashes (/) as word breaks, which is common in puzzles.",
    },
    {
      q: "Can I listen to the phrase in Morse code?",
      a: "Yes. Use the audio controls in the tool to play the Morse timing and spacing.",
    },
    {
      q: "Can I copy the Morse code version?",
      a: "Yes. Copy the Morse output directly for puzzles, worksheets, or practice drills.",
    },
  ];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <TranslatorSectionsBasic
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
        />

        <HowItWorks />

        <FaqSectionGeneric
          title="Quick Brown Fox Morse Code FAQ"
          items={faqItems}
        />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
