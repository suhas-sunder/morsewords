import {
  getLanguageReferenceCharacters,
  getLanguageReferenceCharactersByIds,
  getMorseRegistryEntries,
  JAPANESE_WABUN_STARTER_ENTRY_IDS,
  type LanguageReferenceCharacter,
} from "~/client/components/shared/morseRegistry";
import { ROUTES } from "./routes";

export type MorseLanguageCharacter = LanguageReferenceCharacter;

export type InternationalMorseLetter = {
  letter: string;
  morse: string;
};

export type MorseLanguagePage = {
  slug: "japanese" | "russian" | "greek";
  path: string;
  languageName: string;
  nativeName: string;
  script: string;
  morseSystemName: string;
  description: string;
  shortDescription: string;
  methodologyNote: string;
  coverageNote: string;
  examples: Array<{ label: string; text: string; morse: string }>;
  characters: MorseLanguageCharacter[];
};

export const INTERNATIONAL_MORSE_A_TO_Z: InternationalMorseLetter[] =
  getMorseRegistryEntries({ systemId: "international", category: "letter" }).map(
    (entry) => ({ letter: entry.character, morse: entry.pattern }),
  );

// The registry contains complete Wabun data, while this existing public page
// intentionally remains the reviewed eleven-row starter presentation.
const JAPANESE_KANA = [...getLanguageReferenceCharactersByIds(JAPANESE_WABUN_STARTER_ENTRY_IDS)];
const RUSSIAN_CYRILLIC = [...getLanguageReferenceCharacters("russian-cyrillic-reference")];
const GREEK_ALPHABET = [...getLanguageReferenceCharacters("greek-reference")];

export const MORSE_LANGUAGE_PAGES: MorseLanguagePage[] = [
  {
    slug: "japanese",
    path: ROUTES.morseCodeJapanese,
    languageName: "Japanese",
    nativeName: "日本語 kana",
    script: "Kana",
    morseSystemName: "Wabun code",
    description:
      "Study a starter set of Japanese kana in Wabun code, the Japanese Morse adaptation used for kana rather than Latin letters.",
    shortDescription:
      "Starter kana cards for Wabun code with audio and a printable side-by-side sheet.",
    methodologyNote:
      "This first page uses a manually vetted starter set from common Wabun/kana Morse tables. It is not a full kana chart yet and it does not transliterate Japanese into International Morse.",
    coverageNote:
      "Foundation set only: vowels, the k-row, and ン are included so learners can compare kana, romaji readings, and Wabun rhythm without implying full coverage.",
    examples: [
      { label: "ア", text: "a", morse: "--.--" },
      { label: "カ", text: "ka", morse: ".-.." },
      { label: "ン", text: "n", morse: ".-.-." },
    ],
    characters: JAPANESE_KANA,
  },
  {
    slug: "russian",
    path: ROUTES.morseCodeRussian,
    languageName: "Russian",
    nativeName: "Русский",
    script: "Cyrillic",
    morseSystemName: "Cyrillic Morse",
    description:
      "Browse Russian Cyrillic Morse mappings with native characters, readings, sound buttons, and a print-friendly reference sheet.",
    shortDescription:
      "Cyrillic Morse cards for Russian letters with readable transliteration notes.",
    methodologyNote:
      "This page uses a manually defined Cyrillic Morse table. Readings are shown as learning aids; the Morse patterns belong to the Cyrillic letters, not to an English transliteration pass.",
    coverageNote:
      "Includes the Russian alphabet used by the page foundation, with Ё noted where practical tables commonly share the Е pattern.",
    examples: [
      { label: "СОС", text: "SOS-style Cyrillic letters", morse: "... --- ..." },
      { label: "МАМА", text: "mama", morse: "-- .- -- .-" },
      { label: "РАДИО", text: "radio", morse: ".-. .- -.. .. ---" },
    ],
    characters: RUSSIAN_CYRILLIC,
  },
  {
    slug: "greek",
    path: ROUTES.morseCodeGreek,
    languageName: "Greek",
    nativeName: "Ελληνικά",
    script: "Greek alphabet",
    morseSystemName: "Greek Morse",
    description:
      "Compare Greek alphabet characters with their Morse patterns, readings, audio playback, and a printable study sheet.",
    shortDescription:
      "Greek Morse alphabet cards with native letters, readings, audio, and print output.",
    methodologyNote:
      "This page uses a manually defined Greek Morse table. The English readings help learners identify letters; they are not a claim that every Greek message should be transliterated first.",
    coverageNote:
      "Includes the core Greek alphabet characters used for this foundation page.",
    examples: [
      { label: "Α", text: "Alpha", morse: ".-" },
      { label: "Ω", text: "Omega", morse: ".--" },
      { label: "Σ", text: "Sigma", morse: "..." },
    ],
    characters: GREEK_ALPHABET,
  },
];

export function morseLanguagePath(slug: MorseLanguagePage["slug"]) {
  return `/morse-code-by-language/${slug}`;
}

export function getMorseLanguagePage(slug: string) {
  return MORSE_LANGUAGE_PAGES.find((page) => page.slug === slug) ?? null;
}

export function getRequiredMorseLanguagePage(slug: MorseLanguagePage["slug"]) {
  const page = getMorseLanguagePage(slug);
  if (!page) throw new Error(`Missing Morse language page data: ${slug}`);
  return page;
}
