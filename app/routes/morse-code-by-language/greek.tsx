import type { Route } from "./+types/greek";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("greek");
const CANONICAL_PATH = ROUTES.morseCodeGreek;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Greek Morse Code | Greek Alphabet Morse Cards | MorseWords",
    description:
      "Compare Greek alphabet characters with Morse patterns, readings, audio play buttons, and a printable side-by-side study sheet.",
    path: CANONICAL_PATH,
    keywords:
      "Greek Morse code, Greek alphabet Morse, Morse code by language, Greek Morse chart",
  });

export default function GreekMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
