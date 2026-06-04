import { items as faqItems } from "../client/components/practice/PracticeFaq";
import type { Route } from "./+types/practice";

import styles from "../client/components/shared/practiceStyles";
import PracticePage from "../client/components/practice/PracticePage";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/practice";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Practice | Flexible Drills for Learning Morse | MorseWords",
    description:
      "Practice Morse code with flexible drills for letters, words, and recall, plus guidance on what to practice next.",
    path: CANONICAL_PATH,
    keywords:
      "morse code practice, morse code drills, learn morse practice, morse code recall practice, morse practice tools",
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
        "A flexible Morse code practice hub for drilling letters, numbers, signals, words, and sentences with feedback.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    breadcrumbJsonLd,
    faqJsonLd,
  ];

  return (
    <main className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <PracticePage jsonLd={jsonLd} />
      </div>

      <BreadcrumbTrail current="Morse Code Practice" placement="pageBottom" />
    </main>
  );
}
