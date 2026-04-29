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

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Free Morse Code Decoder",
    },
    {
      name: "description",
      content:
        "Decode Morse code to text instantly. Paste dots, dashes, spaces, or word separators to read Morse code, then copy the translated result for free.",
    },
    {
      name: "keywords",
      content:
        "morse code decoder, morse to text, decode morse code, morse decoder, decode dots and dashes, morse code translator",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
    {
      rel: "canonical",
      href: "https://www.morsewords.com/morse-code-decoder",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:site_name",
      content: "MorseWords",
    },
    {
      property: "og:url",
      content: "https://www.morsewords.com/morse-code-decoder",
    },
    {
      property: "og:title",
      content: "Free Morse Code Decoder",
    },
    {
      property: "og:description",
      content:
        "Paste Morse code to decode it into readable text instantly. Supports dots, dashes, spaces, and word separators.",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: "Free Morse Code Decoder",
    },
    {
      name: "twitter:description",
      content:
        "Decode Morse code to text instantly. Paste dots, dashes, spaces, or word separators and copy the result for free.",
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
    name: "MorseWords Morse Code Decoder",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/morse-code-decoder",
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
