import type { Route } from "./+types/korean";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("korean");
const CANONICAL_PATH = ROUTES.morseCodeKorean;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Korean Morse Code | Romanized Practice Cards | MorseWords",
    description:
      "Practice Korean words in Morse with romanized Korean A-Z cards, clear Hangul limitation notes, audio playback, and a printable sheet.",
    path: CANONICAL_PATH,
    keywords:
      "Korean Morse code, Hangul Morse code, romanized Korean Morse, Morse code by language",
  });

export default function KoreanMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
