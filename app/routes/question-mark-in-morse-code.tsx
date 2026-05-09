import type { Route } from "./+types/question-mark-in-morse-code";

import {
  buildPageJsonLdSet,
  MorseLeafPage,
} from "~/client/components/content/MorseContentSections";
import { SYMBOL_PAGES } from "~/client/data/morseContent";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CONTENT = SYMBOL_PAGES["question-mark-in-morse-code"];
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

export default function QuestionMarkInMorseCodeRoute() {
  const jsonLd = buildPageJsonLdSet({
    siteUrl: SITE_URL,
    canonicalUrl: CANONICAL_URL,
    path: CANONICAL_PATH,
    name: CONTENT.displayTitle,
    description: CONTENT.metaDescription,
    schemaType: "WebPage",
    faqItems: CONTENT.faqItems,
  });

  return <MorseLeafPage content={CONTENT} jsonLd={jsonLd} />;
}

