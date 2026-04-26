import type { Route } from "./+types/typing";

import styles from "../client/components/typing/styles";
import TypingPage from "../client/components/typing/TypingPage";

import { items as faqItems } from "../client/components/typing/TypingFaq";

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/typing";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Free Morse Code Typing Tool",
    },
    {
      name: "description",
      content:
        "Type Morse code freely and see it decode in real time. Use this scratchpad to practice rhythm, repetition, and longer Morse typing sessions without prompts.",
    },
    {
      name: "keywords",
      content:
        "morse code typing tool, morse code scratchpad, real time morse decoder, cw typing practice, morse typing practice",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "MorseWords" },
    { property: "og:url", content: CANONICAL_URL },
    {
      property: "og:title",
      content: "Free Morse Code Typing Tool",
    },
    {
      property: "og:description",
      content:
        "Type Morse code freely and see it decode in real time. A simple scratchpad for rhythm, repetition, and longer practice sessions.",
    },

    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:title",
      content: "Free Morse Code Typing Tool",
    },
    {
      name: "twitter:description",
      content:
        "Type Morse code freely and see it decode in real time with a simple practice scratchpad.",
    },
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
        <TypingPage jsonLd={jsonLd} />
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
          <li className="font-semibold text-gray-900">Morse Code Typing</li>
        </ol>
      </nav>
    </div>
  );
}
