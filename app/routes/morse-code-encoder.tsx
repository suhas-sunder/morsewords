import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/morse-code-encoder/styles";
import TranslatorSectionsBasic from "~/client/components/morse-code-encoder/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/morse-code-encoder/FaqSectionGeneric";
import JsonLdScript from "~/client/components/morse-code-encoder/JsonLdScript";
import {
  morseToText,
  textToMorse,
} from "~/client/components/morse-code-encoder/morseUtils";
import HowItWorks from "~/client/components/morse-code-encoder/HowItWorks";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Morse Code Encoder (Text → Morse) | Instant & Free",
    },
    {
      name: "description",
      content:
        "Convert text to Morse code instantly. Generate clean dots and dashes, copy the output, and use built-in audio and practice tools in your browser for free.",
    },
    {
      name: "keywords",
      content:
        "morse code encoder, text to morse, text to morse code, morse encoder, dots and dashes",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
    {
      rel: "canonical",
      href: "https://www.morsewords.com/morse-code-encoder",
    },
  ];
}

export default function Home() {
  // Translator state (conversion logic stays in morseUtils)
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const baseUrl = "https://www.morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Encoder",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/morse-code-encoder",
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
      a: "Letters are separated with a single space by default. Words are separated clearly so the output stays readable and easy to paste elsewhere.",
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
    <div style={styles.page}>
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

        <FaqSectionGeneric title="Encoder FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
