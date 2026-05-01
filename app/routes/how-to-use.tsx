import * as React from "react";
import type { Route } from "./+types/how-to-use";

import styles from "~/client/components/shared/pageStyles";
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
    title: "How to Use MorseWords | Translator, Audio, Practice & Worksheets",
    description:
      "Learn how to translate Morse, generate audio, run practice drills, type dots and dashes, and build printable Morse worksheets with consistent spacing.",
    path: CANONICAL_PATH,
    keywords:
      "how to use morse code translator, morse code tools, how to read morse code, how to write morse code, morse code practice",
  });
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
        <HowToUseSuiteGuide />
        <FaqSectionGeneric title="How to Use FAQ" items={faqItems} />
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
          <li className="font-semibold text-gray-900">How to Use MorseWords</li>
        </ol>
      </nav>
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
