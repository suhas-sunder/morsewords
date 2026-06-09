import type { Route } from "./+types/german";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("german");
const CANONICAL_PATH = ROUTES.morseCodeGerman;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "German Morse Code | Ä Ö Ü ß Cards | MorseWords",
    description:
      "Study German Morse code with International A-Z cards, German extension notes for Ä, Ö, Ü, ß, audio playback, and a printable sheet.",
    path: CANONICAL_PATH,
    keywords:
      "German Morse code, Deutsch Morse code, Ä Morse code, Ö Morse code, Ü Morse code, Morse code by language",
  });

export default function GermanMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
