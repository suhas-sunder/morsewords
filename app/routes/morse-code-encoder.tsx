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
import HowItWorks from "~/client/components/morse-code-encoder/HowItWorks";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-encoder";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Text to Morse Code Encoder | Clean Copyable Morse",
    description:
      "Turn plain text into clean International Morse code with consistent separators, copyable output, audio links, and printable worksheet workflows.",
    path: CANONICAL_PATH,
    keywords:
      "text to morse code, english to morse code, words to morse code, morse code encoder, convert text to morse code",
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
    name: "MorseWords Morse Code Encoder",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "Browser-based Morse code encoder for converting text into International Morse.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faqItems = [
    {
      q: "What does a Morse code encoder do?",
      a: "An encoder converts plain text into dots and dashes using standard International Morse mappings.",
    },
    {
      q: "What characters are supported?",
      a: "It supports A–Z, 0–9, and common punctuation (like . , ? ! / - @). Unsupported characters are skipped and listed so you can fix the input.",
    },
    {
      q: "How are letters and words separated?",
      a: "MorseWords accepts common pasted spacing styles, then exports readable Morse with single spaces between letters and clear word breaks. Use the word separator page when you need a different separator style.",
    },
    {
      q: "Can I copy the Morse output?",
      a: "Yes. Use the copy controls to copy the encoded Morse for sharing, practice drills, or audio playback.",
    },
    {
      q: "Is this encoder private?",
      a: "Yes. The conversion happens in your browser, and your text is not sent to a server by this page.",
    },
  ];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <TranslatorSectionsBasic
          title="Text to Morse Code Encoder"
          subtitle={
            <p className="mt-2 max-w-none text-base leading-7 text-slate-700 sm:text-[1.08rem]">
              Encode plain text into predictable International Morse output,
              then copy it, play it as audio, or turn it into a worksheet.
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

        <FaqSectionGeneric title="Encoder FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
