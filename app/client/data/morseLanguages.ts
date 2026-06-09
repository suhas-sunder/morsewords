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
  slug:
    | "japanese"
    | "russian"
    | "greek"
    | "german"
    | "french"
    | "spanish"
    | "korean"
    | "italian"
    | "portuguese";
  path: string;
  languageName: string;
  nativeName: string;
  script: string;
  morseSystemName: string;
  standardClassification: string;
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

function latinMorseCharacters(prefix: string, targetNote = "Latin alphabet") {
  return INTERNATIONAL_MORSE_A_TO_Z.map((item) => ({
    id: `${prefix}-${item.letter.toLowerCase()}`,
    reference: `English ${item.letter}`,
    target: item.letter,
    reading: item.letter.toLowerCase(),
    morse: item.morse,
    label: `${targetNote} ${item.letter}`,
  }));
}

const GERMAN_CHARACTERS: MorseLanguageCharacter[] = [
  ...latinMorseCharacters("de", "German Latin letter"),
  {
    id: "de-ae",
    reference: "German Ä",
    target: "Ä",
    reading: "ae",
    morse: ".-.-",
    label: "German letter Ä",
    notes:
      "Shown as a common German/International extension; plain-text practice may also use AE.",
  },
  {
    id: "de-oe",
    reference: "German Ö",
    target: "Ö",
    reading: "oe",
    morse: "---.",
    label: "German letter Ö",
    notes:
      "Shown as a common German/International extension; plain-text practice may also use OE.",
  },
  {
    id: "de-ue",
    reference: "German Ü",
    target: "Ü",
    reading: "ue",
    morse: "..--",
    label: "German letter Ü",
    notes:
      "Shown as a common German/International extension; plain-text practice may also use UE.",
  },
  {
    id: "de-ss",
    reference: "German ß",
    target: "ß",
    reading: "ss",
    morse: "...--..",
    label: "German sharp S",
    notes:
      "Shown as a German-specific extension; many modern plain-text workflows write SS.",
  },
];

const FRENCH_CHARACTERS: MorseLanguageCharacter[] = latinMorseCharacters(
  "fr",
  "French Latin letter",
);

const SPANISH_CHARACTERS: MorseLanguageCharacter[] = [
  ...latinMorseCharacters("es", "Spanish Latin letter"),
  {
    id: "es-enye",
    reference: "Spanish Ñ",
    target: "Ñ",
    reading: "enye",
    morse: "--.--",
    label: "Spanish letter Ñ",
    notes:
      "Shown as a commonly listed International extension; accented vowels are usually sent by context or transliteration in many modern practice workflows.",
  },
];

const KOREAN_ROMANIZATION_CHARACTERS: MorseLanguageCharacter[] =
  latinMorseCharacters("ko", "Romanized Korean Latin letter").map((item) => ({
    ...item,
    notes:
      "Korean practice on this page uses romanized text with International Morse; this is not a Hangul Morse alphabet.",
  }));

const ITALIAN_CHARACTERS: MorseLanguageCharacter[] = latinMorseCharacters(
  "it",
  "Italian Latin letter",
);

const PORTUGUESE_CHARACTERS: MorseLanguageCharacter[] = latinMorseCharacters(
  "pt",
  "Portuguese Latin letter",
);

export const MORSE_LANGUAGE_PAGES: MorseLanguagePage[] = [
  {
    slug: "japanese",
    path: ROUTES.morseCodeJapanese,
    languageName: "Japanese",
    nativeName: "日本語 kana",
    script: "Kana",
    morseSystemName: "Wabun code",
    standardClassification: "Established native-script Morse adaptation",
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
    standardClassification: "Native-script Morse adaptation",
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
    standardClassification: "Native-script Morse adaptation",
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
  {
    slug: "german",
    path: ROUTES.morseCodeGerman,
    languageName: "German",
    nativeName: "Deutsch",
    script: "Latin alphabet",
    morseSystemName: "International Morse with German extensions",
    standardClassification:
      "International Morse plus sourceable national extensions",
    description:
      "Study German Morse practice with the International A-Z alphabet plus common German letters Ä, Ö, Ü, and ß where extension patterns are used.",
    shortDescription:
      "German A-Z Morse cards with careful notes for Ä, Ö, Ü, ß and transliteration fallbacks.",
    methodologyNote:
      "German Morse practice is mostly International Morse for A-Z. This page includes common German extension patterns for Ä, Ö, Ü, and ß, while noting that plain-text workflows often use AE, OE, UE, and SS instead.",
    coverageNote:
      "Includes the complete International Morse A-Z set plus German-specific extension notes. It does not claim German uses a completely separate Morse alphabet.",
    examples: [
      {
        label: "HALLO",
        text: "German hello with A-Z letters",
        morse: ".... .- .-.. .-.. ---",
      },
      { label: "Ä", text: "A umlaut / ae", morse: ".-.-" },
      { label: "Ü", text: "U umlaut / ue", morse: "..--" },
    ],
    characters: GERMAN_CHARACTERS,
  },
  {
    slug: "french",
    path: ROUTES.morseCodeFrench,
    languageName: "French",
    nativeName: "Français",
    script: "Latin alphabet",
    morseSystemName: "International Morse with French transliteration notes",
    standardClassification:
      "International Morse with accent transliteration guidance",
    description:
      "Practice French words in Morse using the International A-Z alphabet, with clear notes about accent handling and transliteration.",
    shortDescription:
      "French A-Z Morse cards for readable practice with careful accent-handling notes.",
    methodologyNote:
      "This first French page uses International Morse for A-Z and explains accent handling through context or transliteration. It does not present accented-letter patterns unless they are intentionally added and verified later.",
    coverageNote:
      "Includes the complete International Morse A-Z set. Accented French letters are discussed as limitations rather than treated as a separate unsupported alphabet.",
    examples: [
      { label: "SALUT", text: "French greeting in A-Z letters", morse: "... .- .-.. ..- -" },
      { label: "MERCI", text: "French thank-you in A-Z letters", morse: "-- . .-. -.-. .." },
      {
        label: "ETE",
        text: "ÉTÉ commonly transliterated without accents",
        morse: ". - .",
      },
    ],
    characters: FRENCH_CHARACTERS,
  },
  {
    slug: "spanish",
    path: ROUTES.morseCodeSpanish,
    languageName: "Spanish",
    nativeName: "Español",
    script: "Latin alphabet",
    morseSystemName: "International Morse with Ñ",
    standardClassification: "International Morse plus sourceable Ñ extension",
    description:
      "Practice Spanish Morse with International A-Z letters, Ñ, audio playback, and a printable side-by-side sheet.",
    shortDescription:
      "Spanish A-Z Morse cards with Ñ and clear notes for accented vowels.",
    methodologyNote:
      "Spanish Morse practice uses International Morse for A-Z. This page includes Ñ as a commonly listed extension and treats accented vowels as context/transliteration notes, not as invented new patterns.",
    coverageNote:
      "Includes the complete International Morse A-Z set plus Ñ. Accented vowels are explained as a practical limitation for this first page.",
    examples: [
      { label: "HOLA", text: "Spanish hello", morse: ".... --- .-.. .-" },
      { label: "SEÑAL", text: "Spanish word using Ñ", morse: "... . --.-- .- .-.." },
      { label: "SI", text: "Spanish yes without accent", morse: "... .." },
    ],
    characters: SPANISH_CHARACTERS,
  },
  {
    slug: "korean",
    path: ROUTES.morseCodeKorean,
    languageName: "Korean",
    nativeName: "한국어 romanization",
    script: "Romanized Korean",
    morseSystemName: "International Morse for romanized Korean",
    standardClassification:
      "Transliteration practice guide, not a Hangul Morse standard",
    description:
      "Practice Korean words in Morse by romanizing Hangul first, then sending the Latin letters with International Morse.",
    shortDescription:
      "Romanized Korean A-Z Morse cards with explicit notes that this is not a Hangul Morse alphabet.",
    methodologyNote:
      "This page intentionally avoids inventing Hangul Morse patterns. It uses romanized Korean text with International Morse so learners can practice readable Korean examples without claiming an unsupported official Hangul mapping.",
    coverageNote:
      "Includes the complete International Morse A-Z set for romanized Korean practice. Hangul characters are not assigned Morse patterns on this page.",
    examples: [
      {
        label: "HANGUK",
        text: "한국 romanized for practice",
        morse: ".... .- -. --. ..- -.-",
      },
      {
        label: "SEOUL",
        text: "서울 romanized for practice",
        morse: "... . --- ..- .-..",
      },
      { label: "KIM", text: "Common romanized name", morse: "-.- .. --" },
    ],
    characters: KOREAN_ROMANIZATION_CHARACTERS,
  },
  {
    slug: "italian",
    path: ROUTES.morseCodeItalian,
    languageName: "Italian",
    nativeName: "Italiano",
    script: "Latin alphabet",
    morseSystemName: "International Morse for Italian",
    standardClassification:
      "International Morse with accent transliteration guidance",
    description:
      "Practice Italian words with International Morse A-Z cards, browser audio, and a printable study sheet.",
    shortDescription:
      "Italian A-Z Morse cards with notes for accented vowels and practice examples.",
    methodologyNote:
      "Italian Morse practice generally uses the Latin alphabet with International Morse. Accented vowels are usually handled through context or transliteration in simple practice workflows.",
    coverageNote:
      "Includes the complete International Morse A-Z set. Accented vowels are explained as text-handling notes rather than a separate Italian Morse alphabet.",
    examples: [
      { label: "CIAO", text: "Italian greeting", morse: "-.-. .. .- ---" },
      { label: "ROMA", text: "Italian place name", morse: ".-. --- -- .-" },
      { label: "SI", text: "Sì commonly transliterated without accent", morse: "... .." },
    ],
    characters: ITALIAN_CHARACTERS,
  },
  {
    slug: "portuguese",
    path: ROUTES.morseCodePortuguese,
    languageName: "Portuguese",
    nativeName: "Português",
    script: "Latin alphabet",
    morseSystemName: "International Morse with Portuguese transliteration notes",
    standardClassification:
      "International Morse with accent transliteration guidance",
    description:
      "Practice Portuguese words using International Morse A-Z cards, careful accent notes, audio playback, and a printable sheet.",
    shortDescription:
      "Portuguese A-Z Morse cards with practical notes for accents and ç handling.",
    methodologyNote:
      "This first Portuguese page uses International Morse for A-Z and explains that accented vowels and ç are commonly handled through context or transliteration in simple Morse practice.",
    coverageNote:
      "Includes the complete International Morse A-Z set. Portuguese diacritics are discussed as limitations instead of being presented as unsupported new Morse patterns.",
    examples: [
      { label: "OLA", text: "Olá commonly transliterated without accent", morse: "--- .-.. .-" },
      { label: "BRASIL", text: "Portuguese country name", morse: "-... .-. .- ... .. .-.." },
      { label: "CAO", text: "Cão commonly transliterated without accent", morse: "-.-. .- ---" },
    ],
    characters: PORTUGUESE_CHARACTERS,
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
