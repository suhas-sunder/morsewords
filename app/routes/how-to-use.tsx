import * as React from "react";
import type { Route } from "./+types/how-to-use";

import styles from "~/client/components/home/styles";
import FaqSectionGeneric from "~/client/components/home/FaqSectionGeneric";
import JsonLdScript from "~/client/components/home/JsonLdScript";
import HowToUseSuiteGuide from "~/client/components/how-to-use/HowToUseSuiteGuide";

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/how-to-use";
const CANONICAL_URL = SITE_URL + CANONICAL_PATH;

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "How to Use MorseWords (Translator, Audio, Practice & More)",
    },
    {
      name: "description",
      content:
        "Learn how to use MorseWords tools step by step. Translate text and Morse, play audio at your own speed, practice drills, type dots and dashes, and look up patterns in the dictionary.",
    },
    {
      name: "keywords",
      content:
        "how to use morsewords, morse code tools, morse translator guide, morse audio, morse practice, morse typing tool, morse dictionary",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },

    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content: "How to Use MorseWords",
    },
    {
      property: "og:description",
      content:
        "A simple guide to using MorseWords tools for translating, listening, practicing, typing, and looking up Morse code.",
    },
    { property: "og:url", content: CANONICAL_URL },

    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:title",
      content: "How to Use MorseWords",
    },
    {
      name: "twitter:description",
      content:
        "Learn how to use MorseWords tools to translate, practice, listen to, and type Morse code.",
    },
    { name: "twitter:url", content: CANONICAL_URL },
  ];
}

export default function HowToUse() {
  const baseUrl = SITE_URL;

  const faqItems = [
    {
      q: "Do I have to format spacing a specific way when decoding?",
      a: "No, but clean spacing makes decoding reliable. The safest format is 3 spaces between letters and 7 spaces between words. A slash (/) and new lines also work as word breaks.",
    },
    {
      q: "Why do you recommend 3 spaces and 7 spaces?",
      a: "It prevents ambiguity when you paste Morse from different sources. Three spaces keeps letter chunks separate, and seven spaces makes word breaks obvious even when apps compress whitespace.",
    },
    {
      q: "What is the fastest way to go from text to audio?",
      a: "Translate your text on the main translator, copy the Morse output, then paste it into the Audio tool and press Play Audio. Set WPM and tone first if you want a specific sound.",
    },
    {
      q: "The audio is silent. What should I check first?",
      a: "Make sure your device volume is up and not muted. If you are on Bluetooth, reconnect. Then confirm you have a non-empty Morse string and press Play Audio again.",
    },
    {
      q: "Which tool should I use if I only have dots and dashes and want to decode quickly?",
      a: "Use the Translator if you already have clean separators. If you are entering it manually and want full control over spacing, use the Typing tool.",
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
      "A practical guide to using MorseWords tools: translator, audio translator, practice drills, typing tool, and dictionary.",
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
            <li className="font-semibold text-gray-900">
              How to Use MorseWords
            </li>
          </ol>
        </nav>
        <HowToUseSuiteGuide />
        <FaqSectionGeneric title="How to Use FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
