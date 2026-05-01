import type { Route } from "./+types/typing";

import styles from "../client/components/shared/practiceStyles";
import TypingPage from "../client/components/typing/TypingPage";

import { items as faqItems } from "../client/components/typing/TypingFaq";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/typing";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Typing Tool | Real-Time Dot and Dash Decoder",
    description:
      "Type dots, dashes, spaces, and slashes to decode Morse in real time. Use the scratchpad for Morse typing practice, rhythm drills, and quick checks.",
    path: CANONICAL_PATH,
    keywords:
      "morse code typer, morse code typing, morse code typewriter, morse code typing practice, real time morse code translator",
  });
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
