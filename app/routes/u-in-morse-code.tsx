import type { Route } from "./+types/u-in-morse-code";

import {
  buildPageJsonLdSet,
  MorseLetterPage,
} from "~/client/components/content/MorseContentSections";
import { LETTER_PAGES } from "~/client/data/morseContent";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CONTENT = LETTER_PAGES["u-in-morse-code"];
const CANONICAL_PATH = CONTENT.path;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    path: CANONICAL_PATH,
    keywords: CONTENT.keywords,
  });
}

export default function UInMorseCodeRoute() {
  const jsonLd = buildPageJsonLdSet({
    siteUrl: SITE_URL,
    canonicalUrl: CANONICAL_URL,
    path: CANONICAL_PATH,
    name: CONTENT.displayTitle,
    description: CONTENT.metaDescription,
    schemaType: "WebPage",
    faqItems: CONTENT.faqItems,
  });

  return <MorseLetterPage content={CONTENT} jsonLd={jsonLd} />;
}
