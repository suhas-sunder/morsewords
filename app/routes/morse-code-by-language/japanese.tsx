import type { Route } from "./+types/japanese";

import { MorseLanguageDetailPage } from "~/client/components/morse-code-by-language/MorseCodeByLanguagePages";
import { getRequiredMorseLanguagePage } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta } from "~/client/seo";

const language = getRequiredMorseLanguagePage("japanese");
const CANONICAL_PATH = ROUTES.morseCodeJapanese;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Japanese Morse Code | Kana Wabun Code Cards | MorseWords",
    description:
      "Study a starter set of Japanese kana in Wabun code with interactive Morse audio cards and a printable side-by-side reference sheet.",
    path: CANONICAL_PATH,
    keywords:
      "Japanese Morse code, Wabun code, kana Morse code, Japanese kana Morse, Morse code by language",
  });

export default function JapaneseMorseCodeRoute() {
  return <MorseLanguageDetailPage language={language} />;
}
