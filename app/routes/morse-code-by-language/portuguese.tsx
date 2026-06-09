import type { Route } from "./+types/portuguese";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("portuguese");
const CANONICAL_PATH = ROUTES.morseCodePortuguese;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Portuguese Morse Code | A-Z Practice Cards | MorseWords",
    description:
      "Practice Portuguese words with International Morse A-Z cards, accent and ç notes, audio playback, and a printable sheet.",
    path: CANONICAL_PATH,
    keywords:
      "Portuguese Morse code, Português Morse code, Morse code accents, Morse code by language",
  });

export default function PortugueseMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
