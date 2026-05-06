import { items as faqItems } from "../client/components/morse-code-sentence-practice/SentencePracticeFaq";
import type { Route } from "./+types/morse-code-sentence-practice";

import styles from "../client/components/shared/practiceStyles";
import SentencePracticePage from "../client/components/morse-code-sentence-practice/SentencePracticePage";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-sentence-practice";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Sentence Practice | Full Message Drills",
    description:
      "Practice Morse code with complete sentences, realistic spacing, beginner sets, radio-style prompts, answer checks, and longer-message confidence drills.",
    path: CANONICAL_PATH,
    keywords:
      "morse code sentence practice, morse code sentences, morse code practice sentences, morse code sentence, morse code spacing",
  });
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
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <SentencePracticePage jsonLd={jsonLd} />
      </div>

      <nav
        aria-label="Breadcrumb"
        className="mx-auto w-full max-w-[1120px] px-4 pb-4 text-sm text-slate-600 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="underline hover:no-underline cursor-pointer">
              Home
            </a>
          </li>
          <li>/</li>
          <li className="font-semibold text-sky-950">
            Morse Code Sentence Practice
          </li>
        </ol>
      </nav>
    </div>
  );
}
