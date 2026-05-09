import type { Route } from "./+types/morse-code-numbers";

import {
  buildPageJsonLdSet,
  MorseNumbersPage,
} from "~/client/components/content/MorseContentSections";
import { NUMBER_PAGE_FAQ_ITEMS } from "~/client/data/morseContent";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-numbers";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Numbers | 0-9 Chart, Sound, and Examples | MorseWords",
    description:
      "Learn Morse code numbers with a 0-9 chart, number pattern logic, copy buttons, audio links, and examples for dates, counts, codes, and radio-style text.",
    path: CANONICAL_PATH,
    keywords:
      "morse code numbers, numbers in morse code, 0-9 morse code, morse number chart, morse code digits",
  });
}

export default function MorseCodeNumbersRoute() {
  const jsonLd = buildPageJsonLdSet({
    siteUrl: SITE_URL,
    canonicalUrl: CANONICAL_URL,
    path: CANONICAL_PATH,
    name: "Morse Code Numbers",
    description:
      "A 0-9 Morse code number chart with pattern logic, examples, copy buttons, and audio links.",
    schemaType: "CollectionPage",
    faqItems: NUMBER_PAGE_FAQ_ITEMS,
  });

  return <MorseNumbersPage jsonLd={jsonLd} />;
}

