import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/morse-code-word-separator/styles";
import WordSeparatorTool from "~/client/components/morse-code-word-separator/WordSeparatorTool";
import HowItWorks from "~/client/components/morse-code-word-separator/HowItWorks";
import FaqSectionGeneric from "~/client/components/morse-code-word-separator/FaqSectionGeneric";
import JsonLdScript from "~/client/components/morse-code-word-separator/JsonLdScript";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Morse Code Word Separator (English ↔ Morse) – 7 Spaces vs / vs |",
    },
    {
      name: "description",
      content:
        "Normalize Morse code word separators and format English → Morse word breaks. Convert between 7-space word gaps, slash (/), pipe (|), and new lines, and generate Morse from English using your preferred word separator.",
    },
    {
      name: "keywords",
      content:
        "morse code word separator, morse code word separator slash, morse code slash separator, morse word break, english to morse word separator, 7 spaces morse",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
    {
      rel: "canonical",
      href: "https://www.morsewords.com/morse-code-word-separator",
    },
  ];
}

export default function MorseCodeWordSeparator() {
  const baseUrl = "https://www.morsewords.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Word Separator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: baseUrl + "/morse-code-word-separator",
    description:
      "Tool to normalize Morse code word separators (7 spaces, /, |, new lines) and format English → Morse word breaks with your chosen separator.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqItems = [
    {
      q: "How are words separated in Morse code?",
      a: "In real Morse timing, words are separated by a longer pause than letters. In pasted text, people represent that longer gap with 7 spaces or a visible separator like /.",
    },
    {
      q: "Can I encode English and choose / between words?",
      a: "Yes. This page can generate Morse from English and format word breaks using 7 spaces, /, or |.",
    },
    {
      q: "Is / a real Morse code character?",
      a: "Not as a timing rule. In copied Morse strings, / is a common convention for a word break because it is easy to see and copy.",
    },
    {
      q: "What is the “7 spaces” rule?",
      a: "It is a text-friendly convention used by many tools to represent the standard Morse word gap (a longer pause).",
    },
    {
      q: "Will this decode Morse into letters?",
      a: "No. This page focuses on word separators and spacing. Use the decoder page to convert dots and dashes into English text.",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <WordSeparatorTool />
        <HowItWorks />
        <FaqSectionGeneric title="Word Separator FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
