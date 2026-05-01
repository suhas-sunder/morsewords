import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { morseToText, textToMorse } from "~/client/components/shared/morseUtils";
import HowItWorks from "~/client/components/home/HowItWorks";
import { seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/";

export function links() {
  return [{ rel: "canonical", href: SITE_URL + "/" }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Translator - Text to Morse & Morse to Text",
    description:
      "Type text to convert it into Morse code, or paste dots and dashes to decode Morse to text. Play audio, adjust speed, and copy the result instantly.",
    path: CANONICAL_PATH,
    keywords:
      "morse code translator, text to morse code, morse to text, morse code decoder, morse code audio, english to morse code",
  });
}

export default function Home() {
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const baseUrl = SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Translator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/",
    description:
      "Browser-based Morse code translator for converting between text and Morse code.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqItems = [
    {
      q: "What does this translator support?",
      a: "It supports A–Z, 0–9, and common punctuation (like . , ? ! / - @). When encoding, unsupported characters are ignored and listed under the input so you can spot what was skipped.",
    },
    {
      q: "How do I paste Morse code to decode it?",
      a: "Paste dots and dashes into the Morse input. For best results, separate letters with 3 spaces and words with 7 spaces. A single space between letters also works, and new lines are treated like word breaks.",
    },
    {
      q: "Can I use / as a word separator?",
      a: "Yes. A slash is treated as a word separator when decoding.",
    },
    {
      q: "Why is spacing important for decoding?",
      a: "The decoder needs separators to know where one letter ends and the next begins. This tool treats 1–6 spaces as a letter gap and 7+ spaces (or / or a new line) as a word gap.",
    },
    {
      q: "What if my Morse has an unknown sequence?",
      a: "Unknown Morse sequences are shown as “?” in the decoded output so mistakes don’t disappear silently.",
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

        <FaqSectionGeneric title="Translator FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
