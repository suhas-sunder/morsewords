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
    title: "Morse Code Typing Practice | Build Recall and Accuracy | MorseWords",
    description:
      "Use Morse code typing practice to build keyboard recall, improve accuracy, and move from recognition to faster answers.",
    path: CANONICAL_PATH,
    keywords:
      "morse code typing practice, morse typing, morse code keyboard practice, morse recall practice, morse typing tool",
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
        "A Morse code typing practice scratchpad for keyboard recall, timed sessions, and real-time decoded output.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    breadcrumbJsonLd,
    faqJsonLd,
  ];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <TypingPage jsonLd={jsonLd} />
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
          <li className="font-semibold text-sky-950">Morse Code Typing</li>
        </ol>
      </nav>
    </div>
  );
}
