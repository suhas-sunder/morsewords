import type { Route } from "./+types/russian";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("russian");
const CANONICAL_PATH = ROUTES.morseCodeRussian;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Russian Morse Code | Cyrillic Morse Cards | MorseWords",
    description:
      "Browse Russian Cyrillic Morse mappings with native letters, readings, audio play buttons, and a printable side-by-side reference sheet.",
    path: CANONICAL_PATH,
    keywords:
      "Russian Morse code, Cyrillic Morse, Russian alphabet Morse, Morse code by language",
  });

export default function RussianMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
