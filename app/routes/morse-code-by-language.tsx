import type { Route } from "./+types/morse-code-by-language";

import { MorseCodeByLanguageHub } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const CANONICAL_PATH = ROUTES.morseCodeByLanguage;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Morse Code by Language | Japanese, Russian, Greek, More | MorseWords",
    description:
      "Explore Morse code by language with Japanese Wabun kana, Russian Cyrillic, Greek, German, French, Spanish, Korean, Italian, and Portuguese pages.",
    path: CANONICAL_PATH,
    keywords:
      "Morse code by language, Japanese Morse code, German Morse code, French Morse code, Spanish Morse code, Korean Morse code",
  });

export default function MorseCodeByLanguageRoute() {
  return <MorseCodeByLanguageHub />;
}
