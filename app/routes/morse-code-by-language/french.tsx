import type { Route } from "./+types/french";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("french");
const CANONICAL_PATH = ROUTES.morseCodeFrench;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "French Morse Code | A-Z Practice Cards | MorseWords",
    description:
      "Practice French words in Morse with International A-Z cards, accent-handling notes, audio playback, and a printable reference sheet.",
    path: CANONICAL_PATH,
    keywords:
      "French Morse code, Français Morse code, Morse code accents, Morse code by language",
  });

export default function FrenchMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
