import * as React from "react";
import type { Route } from "./+types/practice";

import styles from "../client/components/practice/styles";
import PracticePage from "../client/components/practice/PracticePage";

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/practice";
const CANONICAL_URL = SITE_URL + CANONICAL_PATH;
import { items as faqItems } from "../client/components/practice/PracticeFaq";

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Morse Code Practice & Quiz (Instant Feedback Drills) | MorseWords",
    },
    {
      name: "description",
      content:
        "Practice Morse code with focused quizzes and drills. One question at a time with instant feedback to train letters, numbers, and common signals. No signup, start immediately.",
    },
    {
      name: "keywords",
      content:
        "morse code practice, morse code quiz, morse code drills, morse flashcards, learn morse code, morse training",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },

    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content: "Morse Code Practice & Quiz | MorseWords",
    },
    {
      property: "og:description",
      content:
        "Practice Morse code with instant-feedback quizzes and drills designed for fast learning.",
    },
    { property: "og:url", content: CANONICAL_URL },

    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:title",
      content: "Morse Code Practice & Quiz",
    },
    {
      name: "twitter:description",
      content:
        "Train Morse code with instant-feedback quizzes and drills. Start practicing immediately.",
    },
    { name: "twitter:url", content: CANONICAL_URL },
  ];
}

export default function PracticeRoute() {
  const baseUrl = SITE_URL;
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
        name: "Morse Code Practice",
        item: CANONICAL_URL,
      },
    ],
  };
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "MorseWords Morse Code Practice (Quiz)",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      url: CANONICAL_URL,
      description:
        "A focused 10-question Morse code quiz with instant feedback.",
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
              <a
                href="/"
                className="underline hover:no-underline cursor-pointer"
              >
                Home
              </a>
            </li>
            <li>/</li>
            <li className="font-semibold text-gray-900">Morse Code Practice</li>
          </ol>
        </nav>
        <PracticePage jsonLd={jsonLd} />
      </div>
    </div>
  );
}
