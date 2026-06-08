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
    title: "Morse Code by Language | Wabun, Cyrillic, Greek | MorseWords",
    description:
      "Explore Morse code by language with starter Japanese Wabun kana, Russian Cyrillic Morse, Greek Morse, audio cards, and printable reference sheets.",
    path: CANONICAL_PATH,
    keywords:
      "Morse code by language, Wabun code, Japanese Morse code, Russian Morse code, Greek Morse code, Cyrillic Morse",
  });

export default function MorseCodeByLanguageRoute() {
  return <MorseCodeByLanguageHub />;
}
