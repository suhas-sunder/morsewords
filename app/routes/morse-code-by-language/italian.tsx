import type { Route } from "./+types/italian";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("italian");
const CANONICAL_PATH = ROUTES.morseCodeItalian;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Italian Morse Code | A-Z Practice Cards | MorseWords",
    description:
      "Practice Italian words with International Morse A-Z cards, accent notes, audio playback, and a printable reference sheet.",
    path: CANONICAL_PATH,
    keywords:
      "Italian Morse code, Italiano Morse code, Italian alphabet Morse, Morse code by language",
  });

export default function ItalianMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
