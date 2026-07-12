import * as React from "react";
import type { Route } from "./+types/how-to-use";

import styles from "~/client/components/shared/pageStyles";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import HowToUseSuiteGuide from "~/client/components/how-to-use/HowToUseSuiteGuide";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/how-to-use";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "How to Use MorseWords | Choose the Right Morse Code Tool | MorseWords",
    description:
      "Learn which MorseWords tool to use for translating, decoding, listening, practicing, typing, printing, or looking up Morse code.",
    path: CANONICAL_PATH,
    keywords:
      "how to use morse code translator, morse code tools, how to read morse code, how to write morse code, morse code practice",
  });
}

export default function HowToUse() {
  const baseUrl = SITE_URL;

  const faqItems = [
    {
      q: "Which MorseWords tool should I start with?",
      a: "Start with the main translator when you want a quick conversion. If your goal is learning, open the learning guide or practice page after you understand the basic pattern.",
    },
    {
      q: "What should I use if I only have dots and dashes?",
      a: "Use the decoder when the Morse is already separated. If spacing is messy or missing, use the word separator page first so letters and words are easier to read.",
    },
    {
      q: "What should I use if I want to hear Morse?",
      a: "Use the audio page when you want to play or save a full message as sound. Use the sound generator when you are testing tone and beep settings for practice.",
    },
    {
      q: "What should I use for learning?",
      a: "Use the learning guide for the overall path, the practice plan for a short routine, and the timing pages when speed or spacing starts causing mistakes.",
    },
    {
      q: "What should I use for printing or teaching?",
      a: "Use the printable worksheet for practice sheets and the word search builder for classroom or practice handouts.",
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "How to Use MorseWords",
        item: CANONICAL_URL,
      },
    ],
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How to Use MorseWords",
    url: CANONICAL_URL,
    description:
      "A practical guide to choosing the right MorseWords tool for translating, decoding, listening, practicing, typing, printing, and looking up Morse code.",
    isPartOf: {
      "@type": "WebSite",
      name: "MorseWords",
      url: baseUrl,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
    url: CANONICAL_URL,
  };

  const jsonLd = [pageJsonLd, breadcrumbJsonLd, faqJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <HowToUseSuiteGuide />
        <FaqSectionGeneric title="How to Use FAQ" items={faqItems} />
      </main>
      <BreadcrumbTrail
        current="How to Use MorseWords"
        placement="pageBottom"
      />
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
