import { items as faqItems } from "../client/components/practice/PracticeFaq";
import type { Route } from "./+types/practice";

import styles from "../client/components/shared/practiceStyles";
import PracticePage from "../client/components/practice/PracticePage";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/practice";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Practice Test | Quiz Letters, Words and Signals",
    description:
      "Practice Morse code with scored quizzes, instant feedback, streaks, shareable results, and drills for letters, numbers, signals, words, and sentences.",
    path: CANONICAL_PATH,
    keywords:
      "morse code practice test, morse code quiz, morse code practice, morse code drills, morse code words, morse code test",
  });
}

export default function PracticeRoute() {
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
        <PracticePage jsonLd={jsonLd} />
      </div>

      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-5xl pb-4 text-sm text-slate-600"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <a href="/" className="underline hover:no-underline cursor-pointer">
              Home
            </a>
          </li>
          <li>/</li>
          <li className="font-semibold text-sky-950">Morse Code Practice</li>
        </ol>
      </nav>
    </div>
  );
}
