import { items as faqItems } from "../client/components/morse-code-sentence-practice/SentencePracticeFaq";
import type { Route } from "./+types/morse-code-sentence-practice";

import styles from "../client/components/practice/styles";
import SentencePracticePage from "../client/components/morse-code-sentence-practice/SentencePracticePage";

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/morse-code-sentence-practice";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Morse Code Sentence Practice | Sentence Drills & Spacing",
    },
    {
      name: "description",
      content:
        "Practice Morse code sentences with example sentences, difficulty-based drills, spacing guidance, and common practice sets for sending and copying full phrases.",
    },
    {
      name: "keywords",
      content:
        "morse code sentence practice, morse code sentences, morse sentence drills, practice morse code phrases, morse code spacing, morse code practice sentences, sentence morse code",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },

    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content: "Morse Code Sentence Practice | MorseWords",
    },
    {
      property: "og:description",
      content:
        "Practice complete Morse code sentences with examples, drill sets, and clear spacing guidance.",
    },
    { property: "og:url", content: CANONICAL_URL },

    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:title",
      content: "Morse Code Sentence Practice",
    },
    {
      name: "twitter:description",
      content:
        "Sentence-focused Morse drills with examples, difficulty levels, and spacing help.",
    },
  ];
}

export default function MorseCodeSentencePracticeRoute() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
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
        name: "Morse Code Sentence Practice",
        item: CANONICAL_URL,
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to practice Morse code sentences",
    description:
      "A focused routine for practicing complete Morse code sentences with clean spacing.",
    step: [
      {
        "@type": "HowToStep",
        name: "Start with short sentences",
        text: "Begin with easy uppercase sentences and send them slowly.",
      },
      {
        "@type": "HowToStep",
        name: "Check letter and word spacing",
        text: "Compare your Morse output against the shown sentence and watch for unclear word gaps.",
      },
      {
        "@type": "HowToStep",
        name: "Move to longer drills",
        text: "Increase difficulty only after your spacing and rhythm stay consistent.",
      },
    ],
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: "Morse Code Sentence Practice",
      learningResourceType: "Practice problem",
      educationalUse: "Practice",
      url: CANONICAL_URL,
      description:
        "Sentence-focused Morse code drills with example sentences, difficulty levels, spacing guidance, and common practice sets.",
      teaches: [
        "Morse code sentence practice",
        "Morse code spacing",
        "Morse code word gaps",
        "Morse code phrase copying",
      ],
    },
    breadcrumbJsonLd,
    howToJsonLd,
    faqJsonLd,
  ];

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <SentencePracticePage jsonLd={jsonLd} />
      </div>

      <nav
        aria-label="Breadcrumb"
        className="pb-4 text-sm text-gray-600 max-w-5xl mx-auto"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="underline hover:no-underline cursor-pointer">
              Home
            </a>
          </li>
          <li>/</li>
          <li className="font-semibold text-gray-900">
            Morse Code Sentence Practice
          </li>
        </ol>
      </nav>
    </div>
  );
}
