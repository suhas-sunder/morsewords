import type { Route } from "./+types/spanish";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("spanish");
const CANONICAL_PATH = ROUTES.morseCodeSpanish;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Spanish Morse Code | Ñ and A-Z Cards | MorseWords",
    description:
      "Study Spanish Morse code with International A-Z cards, Ñ, accent notes, audio playback, and a printable side-by-side sheet.",
    path: CANONICAL_PATH,
    keywords:
      "Spanish Morse code, Español Morse code, Ñ Morse code, Morse code by language",
  });

export default function SpanishMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
