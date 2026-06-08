import { ROUTES } from "./routes";

export type MorseLanguageCharacter = {
  id: string;
  reference: string;
  target: string;
  reading?: string;
  morse: string;
  label: string;
  notes?: string;
};

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

export const INTERNATIONAL_MORSE_A_TO_Z: InternationalMorseLetter[] = [
  ["A", ".-"],
  ["B", "-..."],
  ["C", "-.-."],
  ["D", "-.."],
  ["E", "."],
  ["F", "..-."],
  ["G", "--."],
  ["H", "...."],
  ["I", ".."],
  ["J", ".---"],
  ["K", "-.-"],
  ["L", ".-.."],
  ["M", "--"],
  ["N", "-."],
  ["O", "---"],
  ["P", ".--."],
  ["Q", "--.-"],
  ["R", ".-."],
  ["S", "..."],
  ["T", "-"],
  ["U", "..-"],
  ["V", "...-"],
  ["W", ".--"],
  ["X", "-..-"],
  ["Y", "-.--"],
  ["Z", "--.."],
].map(([letter, morse]) => ({ letter, morse }));

const JAPANESE_KANA: MorseLanguageCharacter[] = [
  {
    id: "ja-a",
    reference: "Romaji a",
    target: "ア",
    reading: "a",
    morse: "--.--",
    label: "Katakana ア in Wabun code",
  },
  {
    id: "ja-i",
    reference: "Romaji i",
    target: "イ",
    reading: "i",
    morse: ".-",
    label: "Katakana イ in Wabun code",
  },
  {
    id: "ja-u",
    reference: "Romaji u",
    target: "ウ",
    reading: "u",
    morse: "..-",
    label: "Katakana ウ in Wabun code",
  },
  {
    id: "ja-e",
    reference: "Romaji e",
    target: "エ",
    reading: "e",
    morse: "-.---",
    label: "Katakana エ in Wabun code",
  },
  {
    id: "ja-o",
    reference: "Romaji o",
    target: "オ",
    reading: "o",
    morse: ".-...",
    label: "Katakana オ in Wabun code",
  },
  {
    id: "ja-ka",
    reference: "Romaji ka",
    target: "カ",
    reading: "ka",
    morse: ".-..",
    label: "Katakana カ in Wabun code",
  },
  {
    id: "ja-ki",
    reference: "Romaji ki",
    target: "キ",
    reading: "ki",
    morse: "-.-..",
    label: "Katakana キ in Wabun code",
  },
  {
    id: "ja-ku",
    reference: "Romaji ku",
    target: "ク",
    reading: "ku",
    morse: "...-",
    label: "Katakana ク in Wabun code",
  },
  {
    id: "ja-ke",
    reference: "Romaji ke",
    target: "ケ",
    reading: "ke",
    morse: "-.--",
    label: "Katakana ケ in Wabun code",
  },
  {
    id: "ja-ko",
    reference: "Romaji ko",
    target: "コ",
    reading: "ko",
    morse: "----",
    label: "Katakana コ in Wabun code",
  },
  {
    id: "ja-n",
    reference: "Romaji n",
    target: "ン",
    reading: "n",
    morse: ".-.-.",
    label: "Katakana ン in Wabun code",
  },
];

const RUSSIAN_CYRILLIC: MorseLanguageCharacter[] = ([
  ["А", "A", ".-"],
  ["Б", "B", "-..."],
  ["В", "V", ".--"],
  ["Г", "G", "--."],
  ["Д", "D", "-.."],
  ["Е", "E", "."],
  ["Ё", "Yo", ".", "Often sent with the same Morse pattern as Е in practical tables."],
  ["Ж", "Zh", "...-"],
  ["З", "Z", "--.."],
  ["И", "I", ".."],
  ["Й", "J", ".---"],
  ["К", "K", "-.-"],
  ["Л", "L", ".-.."],
  ["М", "M", "--"],
  ["Н", "N", "-."],
  ["О", "O", "---"],
  ["П", "P", ".--."],
  ["Р", "R", ".-."],
  ["С", "S", "..."],
  ["Т", "T", "-"],
  ["У", "U", "..-"],
  ["Ф", "F", "..-."],
  ["Х", "Kh", "...."],
  ["Ц", "Ts", "-.-."],
  ["Ч", "Ch", "---."],
  ["Ш", "Sh", "----"],
  ["Щ", "Shch", "--.-"],
  ["Ъ", "Hard sign", "--.--"],
  ["Ы", "Y", "-.--"],
  ["Ь", "Soft sign", "-..-"],
  ["Э", "E", "..-.."],
  ["Ю", "Yu", "..--"],
  ["Я", "Ya", ".-.-"],
] as const).map(([target, reading, morse, notes]) => ({
  id: `ru-${target}`,
  reference: `Latin reading ${reading}`,
  target,
  reading,
  morse,
  label: `Cyrillic ${target}`,
  notes,
}));

const GREEK_ALPHABET: MorseLanguageCharacter[] = ([
  ["Α", "Alpha", "A", ".-"],
  ["Β", "Beta", "B", "-..."],
  ["Γ", "Gamma", "G", "--."],
  ["Δ", "Delta", "D", "-.."],
  ["Ε", "Epsilon", "E", "."],
  ["Ζ", "Zeta", "Z", "--.."],
  ["Η", "Eta", "H", "...."],
  ["Θ", "Theta", "Th", "-.-."],
  ["Ι", "Iota", "I", ".."],
  ["Κ", "Kappa", "K", "-.-"],
  ["Λ", "Lambda", "L", ".-.."],
  ["Μ", "Mu", "M", "--"],
  ["Ν", "Nu", "N", "-."],
  ["Ξ", "Xi", "X", "-..-"],
  ["Ο", "Omicron", "O", "---"],
  ["Π", "Pi", "P", ".--."],
  ["Ρ", "Rho", "R", ".-."],
  ["Σ", "Sigma", "S", "..."],
  ["Τ", "Tau", "T", "-"],
  ["Υ", "Upsilon", "Y", "-.--"],
  ["Φ", "Phi", "F", "..-."],
  ["Χ", "Chi", "Ch", "----"],
  ["Ψ", "Psi", "Ps", "--.-"],
  ["Ω", "Omega", "O", ".--"],
] as const).map(([target, name, reading, morse]) => ({
  id: `el-${target}`,
  reference: `${name} / ${reading}`,
  target,
  reading,
  morse,
  label: `Greek ${name}`,
}));

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
