import * as React from "react";
import type { Route } from "./+types/home";

import styles from "~/client/components/shared/pageStyles";
import WordSeparatorTool from "~/client/components/morse-code-word-separator/WordSeparatorTool";
import HowItWorks from "~/client/components/morse-code-word-separator/HowItWorks";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-word-separator";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Word Separator - Slash, Spaces & Word Gaps",
    description:
      "Convert Morse code word separators between 7 spaces, slashes, pipes, and line breaks. Learn how to separate words in Morse code.",
    path: CANONICAL_PATH,
    keywords:
      "morse code word separator, morse code slash word separator, how to separate words in morse code, morse code spacing, morse word gaps",
  });
}

export default function MorseCodeWordSeparator() {
  const baseUrl = SITE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Word Separator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
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
