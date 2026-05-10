import type { Route } from "./+types/how-to-separate-words-in-morse-code";

import {
  buildPageJsonLdSet,
  MorseGuidePage,
} from "~/client/components/content/MorseContentSections";
import { GUIDE_PAGES } from "~/client/data/morseContent";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CONTENT = GUIDE_PAGES["how-to-separate-words-in-morse-code"];
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

export default function HowToSeparateWordsInMorseCodeRoute() {
  const jsonLd = buildPageJsonLdSet({
    siteUrl: SITE_URL,
    canonicalUrl: CANONICAL_URL,
    path: CANONICAL_PATH,
    name: CONTENT.h1,
    description: CONTENT.metaDescription,
    schemaType: CONTENT.schemaType,
    faqItems: CONTENT.faqItems,
  });

  return <MorseGuidePage content={CONTENT} jsonLd={jsonLd} />;
}
