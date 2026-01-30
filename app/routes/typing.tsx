import * as React from "react";
import type { Route } from "./+types/typing";

import styles from "../client/components/typing/styles";
import TypingPage from "../client/components/typing/TypingPage";

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/typing";
const CANONICAL_URL = SITE_URL + CANONICAL_PATH;

import { items as faqItems } from "../client/components/typing/TypingFaq";

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Morse Code Typing Tool | Real-Time Decoder Scratchpad for Fluent Users | MorseWords",
    },
    {
      name: "description",
      content:
        "A freeform Morse code typing scratchpad with real-time decoding. Built for people who already know Morse and want repetition, rhythm, and endurance.",
    },
    {
      name: "keywords",
      content:
        "morse code typing tool, morse code scratchpad, real time morse decoder, morse drills, cw practice typing, morse code practice typing",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content:
        "Morse Code Typing Tool | Real-Time Decoder Scratchpad for Fluent Users | MorseWords",
    },
    {
      property: "og:description",
      content:
        "Freeform Morse typing with instant decode feedback. No lessons, no prompts, just flow.",
    },
    { property: "og:url", content: CANONICAL_URL },
    { property: "og:site_name", content: "MorseWords" },
    { property: "twitter:card", content: "summary" },
    {
      property: "twitter:title",
      content:
        "Morse Code Typing Tool | Real-Time Decoder Scratchpad for Fluent Users | MorseWords",
    },
    {
      property: "twitter:description",
      content:
        "Type Morse continuously and see the decode instantly. Built for repetition and rhythm, not teaching.",
    },
    { name: "twitter:url", content: CANONICAL_URL },
  ];
}

export default function TypingRoute() {
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Typing",
        item: CANONICAL_URL,
      },
    ],
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "MorseWords Morse Code Typing Tool",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      url: CANONICAL_URL,
      description:
        "A freeform Morse code typing scratchpad with real-time decoding for fluent users.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    breadcrumbJsonLd,
    faqJsonLd,
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="underline hover:no-underline cursor-pointer">
                Home
              </a>
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-900">Morse Code Typing</li>
          </ol>
        </nav>

        <TypingPage jsonLd={jsonLd} />
      </div>
    </div>
  );
}
