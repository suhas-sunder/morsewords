/**
 * Internal Morse registry. It records only mappings already used by MorseWords.
 * Future source-vetted systems belong here; do not treat migration provenance as
 * external standards verification.
 */

export const DEFAULT_MORSE_SYSTEM_ID = "international" as const;

export type MorseSystemId =
  | "international"
  | "japanese-wabun"
  | "russian-cyrillic-reference"
  | "greek-reference";

export type MorseEntryCategory =
  | "letter"
  | "digit"
  | "punctuation"
  | "language-letter"
  | "prosign"
  | "control-token"
  | "input-alias"
  | "transliteration-alias";

export type MorseCaseBehavior = "uppercase" | "preserve" | "none";
export type MorseNormalizationPolicy = "none" | "NFC" | "NFKC";
export type MorseCollisionPolicy =
  | "reject"
  | "allow-cross-system"
  | "allow-same-system";
export type MorseStandardizationStatus =
  | "legacy-repository"
  | "unverified-reference"
  | "pending-external-verification";

export type MorseProvenance = {
  kind: "repository-legacy-map" | "repository-language-reference";
  verificationStatus: "repository-migrated" | "pending-external-verification" | "objectively-source-verified" | "objectively-unsupported";
  verificationDecisionId?: string;
  sourceCategorySummary?: "international-standard" | "national-amateur-radio-organization" | "national-telecommunications-authority" | "insufficient-authoritative-evidence";
  reverseEligibility?: "selected-system" | "compatibility-default" | "not-source-verified";
  caveatFlags?: readonly string[];
  sourceTitle?: string;
  issuingOrganization?: string;
  documentIdentifier?: string;
  url?: string;
  publicationDate?: string;
  accessedDate?: string;
  authorityLevel?: string;
  classification?: "primary" | "secondary";
  conflictingSourceNotes?: string;
};

export type MorseLanguagePresentation = {
  reference: string;
  reading?: string;
  label: string;
  notes?: string;
};

type MorseEntryBase = {
  id: string;
  character: string;
  codePoints: readonly string[];
  displayLabel: string;
  normalizedInputs: readonly string[];
  pattern: string;
  category: MorseEntryCategory;
  systemId: MorseSystemId;
  languageIds: readonly string[];
  script: string;
  forwardEncoding: boolean;
  reverseDecoding: boolean;
  defaultGlobal: boolean;
  caseBehavior: MorseCaseBehavior;
  normalization: MorseNormalizationPolicy;
  collisionPolicy: MorseCollisionPolicy;
  standardizationStatus: MorseStandardizationStatus;
  provenance: MorseProvenance;
  notes?: string;
  deprecated?: boolean;
  presentation?: MorseLanguagePresentation;
};

export type MorseDirectEntry = MorseEntryBase & {
  kind: "canonical";
  aliasOf?: never;
};

export type MorseAliasEntry = MorseEntryBase & {
  kind: "alias";
  aliasOf: string;
};

export type MorseRegistryEntry = MorseDirectEntry | MorseAliasEntry;

export type MorseSystem = {
  id: MorseSystemId;
  displayName: string;
  script: string;
  languageIds: readonly string[];
  relationship: "default-international" | "language-reference";
  globallySelectable: boolean;
  reverseDecodingDeterministic: boolean;
  mixedSystemDecodingPermitted: boolean;
  defaultNormalization: MorseNormalizationPolicy;
  provenance: MorseProvenance;
  implementationStatus: "active-compatibility" | "reference-only";
};

export type MorseSystemInputSequence = {
  id: string;
  systemId: MorseSystemId;
  character: string;
  normalizedInputs: readonly string[];
  expansionEntryIds: readonly string[];
  canonicalOutput: string;
};

export type LanguageReferenceCharacter = {
  id: string;
  reference: string;
  target: string;
  reading?: string;
  morse: string;
  label: string;
  notes?: string;
};

type EntrySeed = Omit<MorseDirectEntry, "codePoints" | "kind">;

const legacyMapProvenance: MorseProvenance = {
  kind: "repository-legacy-map",
  verificationStatus: "repository-migrated",
};

const languageReferenceProvenance: MorseProvenance = {
  kind: "repository-language-reference",
  verificationStatus: "repository-migrated",
};

const ITU_WRITTEN_CHARACTERS = new Set([".", ",", ":", "?", "'", "-", "/", "(", ")", '"', "=", "+", "@"]);

function researchProvenance(
  base: MorseProvenance,
  entryId: string,
  verified: boolean,
  sourceCategorySummary: MorseProvenance["sourceCategorySummary"],
): MorseProvenance {
  return {
    ...base,
    verificationStatus: verified ? "objectively-source-verified" : "objectively-unsupported",
    verificationDecisionId: `objective-${entryId}`,
    sourceCategorySummary,
    reverseEligibility: verified ? "selected-system" : "not-source-verified",
    ...(verified ? {} : { caveatFlags: ["requires-production-correction"] }),
  };
}

export const MORSE_SYSTEMS: readonly MorseSystem[] = Object.freeze([
  {
    id: "international",
    displayName: "International Morse compatibility map",
    script: "Latin",
    languageIds: ["en"],
    relationship: "default-international",
    globallySelectable: true,
    reverseDecodingDeterministic: true,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFKC",
    provenance: legacyMapProvenance,
    implementationStatus: "active-compatibility",
  },
  {
    id: "japanese-wabun",
    displayName: "Japanese Wabun system",
    script: "Kana",
    languageIds: ["ja"],
    relationship: "language-reference",
    globallySelectable: false,
    reverseDecodingDeterministic: true,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFC",
    provenance: languageReferenceProvenance,
    implementationStatus: "reference-only",
  },
  {
    id: "russian-cyrillic-reference",
    displayName: "Russian Cyrillic reference",
    script: "Cyrillic",
    languageIds: ["ru"],
    relationship: "language-reference",
    globallySelectable: false,
    reverseDecodingDeterministic: false,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFC",
    provenance: languageReferenceProvenance,
    implementationStatus: "reference-only",
  },
  {
    id: "greek-reference",
    displayName: "Greek reference",
    script: "Greek",
    languageIds: ["el"],
    relationship: "language-reference",
    globallySelectable: false,
    reverseDecodingDeterministic: true,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFC",
    provenance: languageReferenceProvenance,
    implementationStatus: "reference-only",
  },
]);

function codePointsFor(character: string): string[] {
  return Array.from(character, (value) =>
    `U+${value.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
  );
}

function canonicalEntry(seed: EntrySeed): MorseDirectEntry {
  return Object.freeze({ ...seed, kind: "canonical", codePoints: codePointsFor(seed.character) });
}

function globalEntry(
  character: string,
  pattern: string,
  category: "letter" | "digit" | "punctuation",
): MorseDirectEntry {
  const descriptor =
    category === "letter"
      ? `latin-${character.toLowerCase()}`
      : category === "digit"
        ? `digit-${character}`
        : `punctuation-${character.codePointAt(0)!.toString(16)}`;
  const id = `international-${descriptor}`;
  const isItuWrittenCharacter = category === "letter" || category === "digit" || ITU_WRITTEN_CHARACTERS.has(character);
  return canonicalEntry({
    id,
    character,
    displayLabel: character,
    normalizedInputs: [character],
    pattern,
    category,
    systemId: "international",
    languageIds: ["en"],
    script: "Latin",
    forwardEncoding: true,
    reverseDecoding: true,
    defaultGlobal: true,
    caseBehavior: category === "letter" ? "uppercase" : "none",
    normalization: "NFKC",
    collisionPolicy: "allow-cross-system",
    standardizationStatus: "legacy-repository",
    provenance: researchProvenance(legacyMapProvenance, id, isItuWrittenCharacter, isItuWrittenCharacter ? "international-standard" : "insufficient-authoritative-evidence"),
  });
}

const GLOBAL_MORSE_DATA: ReadonlyArray<
  readonly [string, string, "letter" | "digit" | "punctuation"]
> = [
  ["A", ".-", "letter"], ["B", "-...", "letter"], ["C", "-.-.", "letter"],
  ["D", "-..", "letter"], ["E", ".", "letter"], ["F", "..-.", "letter"],
  ["G", "--.", "letter"], ["H", "....", "letter"], ["I", "..", "letter"],
  ["J", ".---", "letter"], ["K", "-.-", "letter"], ["L", ".-..", "letter"],
  ["M", "--", "letter"], ["N", "-.", "letter"], ["O", "---", "letter"],
  ["P", ".--.", "letter"], ["Q", "--.-", "letter"], ["R", ".-.", "letter"],
  ["S", "...", "letter"], ["T", "-", "letter"], ["U", "..-", "letter"],
  ["V", "...-", "letter"], ["W", ".--", "letter"], ["X", "-..-", "letter"],
  ["Y", "-.--", "letter"], ["Z", "--..", "letter"], ["0", "-----", "digit"],
  ["1", ".----", "digit"], ["2", "..---", "digit"], ["3", "...--", "digit"],
  ["4", "....-", "digit"], ["5", ".....", "digit"], ["6", "-....", "digit"],
  ["7", "--...", "digit"], ["8", "---..", "digit"], ["9", "----.", "digit"],
  [".", ".-.-.-", "punctuation"], [",", "--..--", "punctuation"], ["?", "..--..", "punctuation"],
  ["/", "-..-.", "punctuation"], ["'", ".----.", "punctuation"], ["!", "-.-.--", "punctuation"],
  ["-", "-....-", "punctuation"], ["@", ".--.-.", "punctuation"], [":", "---...", "punctuation"],
  [";", "-.-.-.", "punctuation"], ["=", "-...-", "punctuation"], ["+", ".-.-.", "punctuation"],
  ['"', ".-..-.", "punctuation"], ["(", "-.--.", "punctuation"], [")", "-.--.-", "punctuation"],
  ["&", ".-...", "punctuation"], ["_", "..--.-", "punctuation"],
];

export const JAPANESE_WABUN_STARTER_ENTRY_IDS = [
  "ja-a", "ja-i", "ja-u", "ja-e", "ja-o", "ja-ka", "ja-ki", "ja-ku", "ja-ke", "ja-ko", "ja-n",
] as const;

// JARL's current Wabun table uses Katakana. Hiragana pairs are accepted as
// Unicode aliases, but never become the system's reverse-decoding output.
const JAPANESE_WABUN_DATA = [
  ["ja-e", "エ", "え", "e", "-.---"], ["ja-i", "イ", "い", "i", ".-"], ["ja-te", "テ", "て", "te", ".-.--"], ["ja-ro", "ロ", "ろ", "ro", ".-.-"],
  ["ja-a", "ア", "あ", "a", "--.--"], ["ja-ha", "ハ", "は", "ha", "-..."], ["ja-sa", "サ", "さ", "sa", "-.-.-"], ["ja-ni", "ニ", "に", "ni", "-.-."],
  ["ja-ki", "キ", "き", "ki", "-.-.."], ["ja-ho", "ホ", "ほ", "ho", "-.."], ["ja-yu", "ユ", "ゆ", "yu", "-..--"], ["ja-he", "ヘ", "へ", "he", "."],
  ["ja-me", "メ", "め", "me", "-...-"], ["ja-to", "ト", "と", "to", "..-.."], ["ja-mi", "ミ", "み", "mi", "..-.-"], ["ja-chi", "チ", "ち", "chi", "..-."],
  ["ja-shi", "シ", "し", "shi", "--.-."], ["ja-ri", "リ", "り", "ri", "--."], ["ja-we", "ヱ", "ゑ", "we", ".--.."], ["ja-nu", "ヌ", "ぬ", "nu", "...."],
  ["ja-hi", "ヒ", "ひ", "hi", "--..-"], ["ja-ru", "ル", "る", "ru", "-.--."], ["ja-mo", "モ", "も", "mo", "-..-."], ["ja-wo", "ヲ", "を", "wo", ".---"],
  ["ja-se", "セ", "せ", "se", ".---."], ["ja-wa", "ワ", "わ", "wa", "-.-"], ["ja-su", "ス", "す", "su", "---.-"], ["ja-ka", "カ", "か", "ka", ".-.."],
  ["ja-n", "ン", "ん", "n", ".-.-."], ["ja-yo", "ヨ", "よ", "yo", "--"], ["ja-ta", "タ", "た", "ta", "-."], ["ja-re", "レ", "れ", "re", "---"],
  ["ja-so", "ソ", "そ", "so", "---."], ["ja-tsu", "ツ", "つ", "tsu", ".--."], ["ja-ne", "ネ", "ね", "ne", "--.-"], ["ja-na", "ナ", "な", "na", ".-."],
  ["ja-ra", "ラ", "ら", "ra", "..."], ["ja-mu", "ム", "む", "mu", "-"], ["ja-u", "ウ", "う", "u", "..-"], ["ja-wi", "ヰ", "ゐ", "wi", ".-..-"],
  ["ja-no", "ノ", "の", "no", "..--"], ["ja-o", "オ", "お", "o", ".-..."], ["ja-ku", "ク", "く", "ku", "...-"], ["ja-ya", "ヤ", "や", "ya", ".--"],
  ["ja-ma", "マ", "ま", "ma", "-..-"], ["ja-ke", "ケ", "け", "ke", "-.--"], ["ja-fu", "フ", "ふ", "fu", "--.."], ["ja-ko", "コ", "こ", "ko", "----"],
] as const;

const JAPANESE_WABUN_DIGITS = [
  ["0", "-----"], ["1", ".----"], ["2", "..---"], ["3", "...--"], ["4", "....-"],
  ["5", "....."], ["6", "-...."], ["7", "--..."], ["8", "---.."], ["9", "----."],
] as const;

const JAPANESE_WABUN_PUNCTUATION = [
  ["ja-long-vowel", "ー", ".--.-", "Wabun prolonged sound mark"],
  ["ja-comma", "、", ".-.-.-", "Wabun comma"],
] as const;

const JAPANESE_WABUN_MODIFIERS = [
  ["ja-dakuten", "゛", "..", "Wabun voiced sound mark"],
  ["ja-handakuten", "゜", "..--.", "Wabun semi-voiced sound mark"],
] as const;

const RUSSIAN_REFERENCE_DATA = [
  ["А", "A", ".-"], ["Б", "B", "-..."], ["В", "V", ".--"], ["Г", "G", "--."],
  ["Д", "D", "-.."], ["Е", "E", "."], ["Ё", "Yo", ".", "Often sent with the same Morse pattern as Е in practical tables."],
  ["Ж", "Zh", "...-"], ["З", "Z", "--.."], ["И", "I", ".."], ["Й", "J", ".---"],
  ["К", "K", "-.-"], ["Л", "L", ".-.."], ["М", "M", "--"], ["Н", "N", "-."],
  ["О", "O", "---"], ["П", "P", ".--."], ["Р", "R", ".-."], ["С", "S", "..."],
  ["Т", "T", "-"], ["У", "U", "..-"], ["Ф", "F", "..-."], ["Х", "Kh", "...."],
  ["Ц", "Ts", "-.-."], ["Ч", "Ch", "---."], ["Ш", "Sh", "----"], ["Щ", "Shch", "--.-"],
  ["Ъ", "Hard sign", "--.--"], ["Ы", "Y", "-.--"], ["Ь", "Soft sign", "-..-"],
  ["Э", "E", "..-.."], ["Ю", "Yu", "..--"], ["Я", "Ya", ".-.-"],
] as const;

const GREEK_REFERENCE_DATA = [
  ["Α", "Alpha", "A", ".-"], ["Β", "Beta", "B", "-..."], ["Γ", "Gamma", "G", "--."],
  ["Δ", "Delta", "D", "-.."], ["Ε", "Epsilon", "E", "."], ["Ζ", "Zeta", "Z", "--.."],
  ["Η", "Eta", "H", "...."], ["Θ", "Theta", "Th", "-.-."], ["Ι", "Iota", "I", ".."],
  ["Κ", "Kappa", "K", "-.-"], ["Λ", "Lambda", "L", ".-.."], ["Μ", "Mu", "M", "--"],
  ["Ν", "Nu", "N", "-."], ["Ξ", "Xi", "X", "-..-"], ["Ο", "Omicron", "O", "---"],
  ["Π", "Pi", "P", ".--."], ["Ρ", "Rho", "R", ".-."], ["Σ", "Sigma", "S", "..."],
  ["Τ", "Tau", "T", "-"], ["Υ", "Upsilon", "Y", "-.--"], ["Φ", "Phi", "F", "..-."],
  ["Χ", "Chi", "Ch", "----"], ["Ψ", "Psi", "Ps", "--.-"], ["Ω", "Omega", "O", ".--"],
] as const;

const japaneseEntries = JAPANESE_WABUN_DATA.map(
  ([id, target, hiragana, reading, pattern]) =>
    canonicalEntry({
      id,
      character: target,
      displayLabel: `Katakana ${target} in Wabun code`,
      normalizedInputs: [target, hiragana],
      pattern,
      category: "language-letter",
      systemId: "japanese-wabun",
      languageIds: ["ja"],
      script: "Kana",
      forwardEncoding: true,
      reverseDecoding: true,
      defaultGlobal: false,
      caseBehavior: "none",
      normalization: "NFC",
      collisionPolicy: "allow-cross-system",
      standardizationStatus: "unverified-reference",
      provenance: researchProvenance(languageReferenceProvenance, id, true, "national-amateur-radio-organization"),
      presentation: { reference: `Romaji ${reading}`, reading, label: `Katakana ${target} in Wabun code` },
    }),
);

const japaneseDigitEntries = JAPANESE_WABUN_DIGITS.map(([character, pattern]) =>
  canonicalEntry({
    id: `ja-digit-${character}`,
    character,
    displayLabel: `Digit ${character} in Wabun code`,
    normalizedInputs: [character],
    pattern,
    category: "digit",
    systemId: "japanese-wabun",
    languageIds: ["ja"],
    script: "Common",
    forwardEncoding: true,
    reverseDecoding: true,
    defaultGlobal: false,
    caseBehavior: "none",
    normalization: "NFC",
    collisionPolicy: "allow-cross-system",
    standardizationStatus: "unverified-reference",
    provenance: researchProvenance(languageReferenceProvenance, `ja-digit-${character}`, true, "national-amateur-radio-organization"),
  }),
);

const japanesePunctuationEntries = JAPANESE_WABUN_PUNCTUATION.map(([id, character, pattern, label]) =>
  canonicalEntry({
    id,
    character,
    displayLabel: label,
    normalizedInputs: [character],
    pattern,
    category: "punctuation",
    systemId: "japanese-wabun",
    languageIds: ["ja"],
    script: "Kana",
    forwardEncoding: true,
    reverseDecoding: true,
    defaultGlobal: false,
    caseBehavior: "none",
    normalization: "NFC",
    collisionPolicy: "allow-cross-system",
    standardizationStatus: "unverified-reference",
    provenance: researchProvenance(languageReferenceProvenance, id, true, "national-amateur-radio-organization"),
  }),
);

const japaneseModifierEntries = JAPANESE_WABUN_MODIFIERS.map(([id, character, pattern, label]) =>
  canonicalEntry({
    id,
    character,
    displayLabel: label,
    normalizedInputs: [character],
    pattern,
    category: "control-token",
    systemId: "japanese-wabun",
    languageIds: ["ja"],
    script: "Kana",
    forwardEncoding: true,
    reverseDecoding: true,
    defaultGlobal: false,
    caseBehavior: "none",
    normalization: "NFC",
    collisionPolicy: "allow-cross-system",
    standardizationStatus: "unverified-reference",
    provenance: researchProvenance(languageReferenceProvenance, id, true, "national-amateur-radio-organization"),
  }),
);

const WABUN_VOICED_SEQUENCE_DATA = [
  ["ja-seq-vu", "ヴ", ["ヴ", "ゔ"], ["ja-u", "ja-dakuten"]],
  ["ja-seq-ga", "ガ", ["ガ", "が"], ["ja-ka", "ja-dakuten"]], ["ja-seq-gi", "ギ", ["ギ", "ぎ"], ["ja-ki", "ja-dakuten"]], ["ja-seq-gu", "グ", ["グ", "ぐ"], ["ja-ku", "ja-dakuten"]], ["ja-seq-ge", "ゲ", ["ゲ", "げ"], ["ja-ke", "ja-dakuten"]], ["ja-seq-go", "ゴ", ["ゴ", "ご"], ["ja-ko", "ja-dakuten"]],
  ["ja-seq-za", "ザ", ["ザ", "ざ"], ["ja-sa", "ja-dakuten"]], ["ja-seq-ji", "ジ", ["ジ", "じ"], ["ja-shi", "ja-dakuten"]], ["ja-seq-zu", "ズ", ["ズ", "ず"], ["ja-su", "ja-dakuten"]], ["ja-seq-ze", "ゼ", ["ゼ", "ぜ"], ["ja-se", "ja-dakuten"]], ["ja-seq-zo", "ゾ", ["ゾ", "ぞ"], ["ja-so", "ja-dakuten"]],
  ["ja-seq-da", "ダ", ["ダ", "だ"], ["ja-ta", "ja-dakuten"]], ["ja-seq-di", "ヂ", ["ヂ", "ぢ"], ["ja-chi", "ja-dakuten"]], ["ja-seq-du", "ヅ", ["ヅ", "づ"], ["ja-tsu", "ja-dakuten"]], ["ja-seq-de", "デ", ["デ", "で"], ["ja-te", "ja-dakuten"]], ["ja-seq-do", "ド", ["ド", "ど"], ["ja-to", "ja-dakuten"]],
  ["ja-seq-ba", "バ", ["バ", "ば"], ["ja-ha", "ja-dakuten"]], ["ja-seq-bi", "ビ", ["ビ", "び"], ["ja-hi", "ja-dakuten"]], ["ja-seq-bu", "ブ", ["ブ", "ぶ"], ["ja-fu", "ja-dakuten"]], ["ja-seq-be", "ベ", ["ベ", "べ"], ["ja-he", "ja-dakuten"]], ["ja-seq-bo", "ボ", ["ボ", "ぼ"], ["ja-ho", "ja-dakuten"]],
  ["ja-seq-pa", "パ", ["パ", "ぱ"], ["ja-ha", "ja-handakuten"]], ["ja-seq-pi", "ピ", ["ピ", "ぴ"], ["ja-hi", "ja-handakuten"]], ["ja-seq-pu", "プ", ["プ", "ぷ"], ["ja-fu", "ja-handakuten"]], ["ja-seq-pe", "ペ", ["ペ", "ぺ"], ["ja-he", "ja-handakuten"]], ["ja-seq-po", "ポ", ["ポ", "ぽ"], ["ja-ho", "ja-handakuten"]],
  ["ja-seq-va", "ヷ", ["ヷ"], ["ja-wa", "ja-dakuten"]], ["ja-seq-vi", "ヸ", ["ヸ"], ["ja-wi", "ja-dakuten"]], ["ja-seq-ve", "ヹ", ["ヹ"], ["ja-we", "ja-dakuten"]], ["ja-seq-vo", "ヺ", ["ヺ"], ["ja-wo", "ja-dakuten"]],
] as const;

export const MORSE_SYSTEM_INPUT_SEQUENCES: readonly MorseSystemInputSequence[] = Object.freeze(
  WABUN_VOICED_SEQUENCE_DATA.map(([id, character, normalizedInputs, expansionEntryIds]) =>
    Object.freeze({
      id,
      systemId: "japanese-wabun" as const,
      character,
      normalizedInputs,
      expansionEntryIds,
      canonicalOutput: character,
    }),
  ),
);

const russianEntries = RUSSIAN_REFERENCE_DATA.map(
  ([target, reading, pattern, notes]) =>
    canonicalEntry({
      id: `ru-${target}`,
      character: target,
      displayLabel: `Cyrillic ${target}`,
      normalizedInputs: [target],
      pattern,
      category: "language-letter",
      systemId: "russian-cyrillic-reference",
      languageIds: ["ru"],
      script: "Cyrillic",
      forwardEncoding: true,
      reverseDecoding: true,
      defaultGlobal: false,
      caseBehavior: "none",
      normalization: "NFC",
      // The legacy Russian reference intentionally shows Е and Ё with the same
      // pattern. Keep both candidates visible to a system-aware decoder.
      collisionPolicy:
        target === "Е" || target === "Ё"
          ? "allow-same-system"
          : "allow-cross-system",
      standardizationStatus: "unverified-reference",
      provenance: researchProvenance(languageReferenceProvenance, `ru-${target}`, false, "insufficient-authoritative-evidence"),
      presentation: {
        reference: `Latin reading ${reading}`,
        reading,
        label: `Cyrillic ${target}`,
        ...(notes ? { notes } : {}),
      },
    }),
);

const greekEntries = GREEK_REFERENCE_DATA.map(
  ([target, name, reading, pattern]) =>
    canonicalEntry({
      id: `el-${target}`,
      character: target,
      displayLabel: `Greek ${name}`,
      normalizedInputs: [target],
      pattern,
      category: "language-letter",
      systemId: "greek-reference",
      languageIds: ["el"],
      script: "Greek",
      forwardEncoding: true,
      reverseDecoding: true,
      defaultGlobal: false,
      caseBehavior: "none",
      normalization: "NFC",
      collisionPolicy: "allow-cross-system",
      standardizationStatus: "unverified-reference",
      provenance: researchProvenance(languageReferenceProvenance, `el-${target}`, false, "insufficient-authoritative-evidence"),
      presentation: { reference: `${name} / ${reading}`, reading, label: `Greek ${name}` },
    }),
);

export const MORSE_REGISTRY_ENTRIES: readonly MorseRegistryEntry[] = Object.freeze([
  ...GLOBAL_MORSE_DATA.map(([character, pattern, category]) => globalEntry(character, pattern, category)),
  ...japaneseEntries,
  ...japaneseDigitEntries,
  ...japanesePunctuationEntries,
  ...japaneseModifierEntries,
  ...russianEntries,
  ...greekEntries,
]);

export type MorseCollisionGroup = {
  pattern: string;
  candidates: readonly MorseRegistryEntry[];
  systemIds: readonly MorseSystemId[];
  defaultGlobalCandidates: readonly MorseRegistryEntry[];
  sameSystemCollisionSystemIds: readonly MorseSystemId[];
};

export type MorseRegistryValidationIssue = {
  code:
    | "duplicate-entry-id"
    | "malformed-pattern"
    | "empty-character"
    | "malformed-code-points"
    | "invalid-system-id"
    | "missing-alias-target"
    | "duplicate-canonical-character"
    | "unsafe-same-system-collision"
    | "duplicate-default-global-reverse"
    | "unsupported-category-system"
    | "invalid-input-sequence"
    | "invalid-sequence-expansion"
    | "duplicate-sequence-input";
  message: string;
  entryIds?: string[];
};

export function validateMorseRegistry(
  entries: readonly MorseRegistryEntry[] = MORSE_REGISTRY_ENTRIES,
  systems: readonly MorseSystem[] = MORSE_SYSTEMS,
  inputSequences: readonly MorseSystemInputSequence[] = MORSE_SYSTEM_INPUT_SEQUENCES,
): MorseRegistryValidationIssue[] {
  const issues: MorseRegistryValidationIssue[] = [];
  const systemIds = new Set(systems.map((system) => system.id));
  const byId = new Map<string, MorseRegistryEntry>();
  const bySystemCharacter = new Map<string, MorseRegistryEntry>();
  const bySystemPattern = new Map<string, MorseRegistryEntry[]>();
  const defaultPatterns = new Map<string, MorseRegistryEntry[]>();

  for (const entry of entries) {
    if (byId.has(entry.id)) {
      issues.push({ code: "duplicate-entry-id", message: `Duplicate entry id: ${entry.id}`, entryIds: [entry.id] });
    }
    byId.set(entry.id, entry);
    if (!entry.character) issues.push({ code: "empty-character", message: `Entry ${entry.id} has no character`, entryIds: [entry.id] });
    if (!/^[.-]+$/.test(entry.pattern)) issues.push({ code: "malformed-pattern", message: `Entry ${entry.id} has malformed Morse pattern`, entryIds: [entry.id] });
    if (!systemIds.has(entry.systemId)) issues.push({ code: "invalid-system-id", message: `Entry ${entry.id} uses unknown system ${entry.systemId}`, entryIds: [entry.id] });
    if (entry.codePoints.join("|") !== codePointsFor(entry.character).join("|")) {
      issues.push({ code: "malformed-code-points", message: `Entry ${entry.id} has incorrect Unicode metadata`, entryIds: [entry.id] });
    }
    if (entry.category === "language-letter" && !entry.presentation) {
      issues.push({ code: "unsupported-category-system", message: `Language entry ${entry.id} lacks presentation data`, entryIds: [entry.id] });
    }
    if (entry.systemId === "international" && entry.category === "language-letter") {
      issues.push({ code: "unsupported-category-system", message: `International entry ${entry.id} cannot be language-only`, entryIds: [entry.id] });
    }
    if (entry.kind === "canonical") {
      const key = `${entry.systemId}\u0000${entry.character}`;
      const previous = bySystemCharacter.get(key);
      if (previous) issues.push({ code: "duplicate-canonical-character", message: `Duplicate canonical character ${entry.character} in ${entry.systemId}`, entryIds: [previous.id, entry.id] });
      bySystemCharacter.set(key, entry);
    }
    if (entry.reverseDecoding) {
      const key = `${entry.systemId}\u0000${entry.pattern}`;
      bySystemPattern.set(key, [...(bySystemPattern.get(key) ?? []), entry]);
      if (entry.defaultGlobal) defaultPatterns.set(entry.pattern, [...(defaultPatterns.get(entry.pattern) ?? []), entry]);
    }
  }

  for (const entry of entries) {
    if (entry.kind === "alias" && !byId.has(entry.aliasOf)) {
      issues.push({ code: "missing-alias-target", message: `Alias ${entry.id} points to missing ${entry.aliasOf}`, entryIds: [entry.id] });
    }
  }
  for (const candidates of bySystemPattern.values()) {
    if (candidates.length > 1 && candidates.some((entry) => entry.collisionPolicy !== "allow-same-system")) {
      issues.push({ code: "unsafe-same-system-collision", message: `Unsafe reverse collision for ${candidates[0].pattern} in ${candidates[0].systemId}`, entryIds: candidates.map((entry) => entry.id) });
    }
  }
  for (const candidates of defaultPatterns.values()) {
    if (candidates.length > 1) issues.push({ code: "duplicate-default-global-reverse", message: `Duplicate default-global reverse pattern ${candidates[0].pattern}`, entryIds: candidates.map((entry) => entry.id) });
  }
  const sequenceInputs = new Map<string, MorseSystemInputSequence>();
  for (const sequence of inputSequences) {
    if (!systemIds.has(sequence.systemId) || !sequence.character || !sequence.canonicalOutput || !sequence.normalizedInputs.length || !sequence.expansionEntryIds.length) {
      issues.push({ code: "invalid-input-sequence", message: `Input sequence ${sequence.id} is incomplete or uses an unknown system`, entryIds: [sequence.id] });
      continue;
    }
    for (const input of sequence.normalizedInputs) {
      const key = `${sequence.systemId}\u0000${input}`;
      const direct = bySystemCharacter.get(key);
      const previous = sequenceInputs.get(key);
      if (direct || previous) {
        issues.push({
          code: "duplicate-sequence-input",
          message: `Input sequence ${sequence.id} duplicates ${direct?.id ?? previous!.id} for ${input}`,
          entryIds: [sequence.id, direct?.id ?? previous!.id],
        });
      }
      sequenceInputs.set(key, sequence);
    }
    for (const entryId of sequence.expansionEntryIds) {
      const entry = byId.get(entryId);
      if (!entry || entry.systemId !== sequence.systemId || !entry.forwardEncoding || entry.kind !== "canonical") {
        issues.push({ code: "invalid-sequence-expansion", message: `Input sequence ${sequence.id} expands through invalid entry ${entryId}`, entryIds: [sequence.id, entryId] });
      }
    }
  }
  return issues;
}

export function assertValidMorseRegistry(
  entries: readonly MorseRegistryEntry[] = MORSE_REGISTRY_ENTRIES,
  systems: readonly MorseSystem[] = MORSE_SYSTEMS,
  inputSequences: readonly MorseSystemInputSequence[] = MORSE_SYSTEM_INPUT_SEQUENCES,
): void {
  const issues = validateMorseRegistry(entries, systems, inputSequences);
  if (issues.length) throw new Error(`Invalid Morse registry: ${issues.map((issue) => issue.message).join("; ")}`);
}

assertValidMorseRegistry();

function mapEntries<T>(
  entries: readonly MorseRegistryEntry[],
  key: (entry: MorseRegistryEntry) => string,
  value: (entry: MorseRegistryEntry) => T,
): Record<string, T> {
  return Object.fromEntries(entries.map((entry) => [key(entry), value(entry)]));
}

export const DEFAULT_GLOBAL_FORWARD_MAP: Record<string, string> = mapEntries(
  MORSE_REGISTRY_ENTRIES.filter((entry) => entry.defaultGlobal && entry.forwardEncoding && entry.kind === "canonical"),
  (entry) => entry.character,
  (entry) => entry.pattern,
);

export const DEFAULT_GLOBAL_REVERSE_MAP: Record<string, string> = mapEntries(
  MORSE_REGISTRY_ENTRIES.filter((entry) => entry.defaultGlobal && entry.reverseDecoding && entry.kind === "canonical"),
  (entry) => entry.pattern,
  (entry) => entry.character,
);

const entriesBySystem = new Map<MorseSystemId, readonly MorseRegistryEntry[]>(
  MORSE_SYSTEMS.map((system) => [system.id, Object.freeze(MORSE_REGISTRY_ENTRIES.filter((entry) => entry.systemId === system.id))]),
);
const entriesById = new Map(MORSE_REGISTRY_ENTRIES.map((entry) => [entry.id, entry]));
const inputSequencesBySystem = new Map<MorseSystemId, readonly MorseSystemInputSequence[]>(
  MORSE_SYSTEMS.map((system) => [
    system.id,
    Object.freeze(MORSE_SYSTEM_INPUT_SEQUENCES.filter((sequence) => sequence.systemId === system.id)),
  ]),
);
const entriesByPattern = new Map<string, readonly MorseRegistryEntry[]>();
for (const entry of MORSE_REGISTRY_ENTRIES.filter((entry) => entry.reverseDecoding)) {
  entriesByPattern.set(entry.pattern, Object.freeze([...(entriesByPattern.get(entry.pattern) ?? []), entry]));
}

export const MORSE_COLLISION_GROUPS: readonly MorseCollisionGroup[] = Object.freeze(
  [...entriesByPattern.entries()]
    .filter(([, candidates]) => candidates.length > 1)
    .map(([pattern, candidates]) => {
      const systemIds = [...new Set(candidates.map((entry) => entry.systemId))];
      const sameSystemCollisionSystemIds = systemIds.filter(
        (systemId) => candidates.filter((entry) => entry.systemId === systemId).length > 1,
      );
      return Object.freeze({
        pattern,
        candidates,
        systemIds,
        defaultGlobalCandidates: candidates.filter((entry) => entry.defaultGlobal),
        sameSystemCollisionSystemIds,
      });
    }),
);

export function getMorseSystem(systemId: MorseSystemId): MorseSystem {
  const system = MORSE_SYSTEMS.find((candidate) => candidate.id === systemId);
  if (!system) throw new Error(`Unknown Morse system: ${systemId}`);
  return system;
}

export function getMorseRegistryEntry(entryId: string): MorseRegistryEntry | null {
  return entriesById.get(entryId) ?? null;
}

export function getMorseRegistryEntries(filters: {
  systemId?: MorseSystemId;
  script?: string;
  languageId?: string;
  category?: MorseEntryCategory;
  defaultGlobal?: boolean;
  reverseDecoding?: boolean;
  forwardEncoding?: boolean;
} = {}): readonly MorseRegistryEntry[] {
  return MORSE_REGISTRY_ENTRIES.filter((entry) =>
    (filters.systemId === undefined || entry.systemId === filters.systemId) &&
    (filters.script === undefined || entry.script === filters.script) &&
    (filters.languageId === undefined || entry.languageIds.includes(filters.languageId)) &&
    (filters.category === undefined || entry.category === filters.category) &&
    (filters.defaultGlobal === undefined || entry.defaultGlobal === filters.defaultGlobal) &&
    (filters.reverseDecoding === undefined || entry.reverseDecoding === filters.reverseDecoding) &&
    (filters.forwardEncoding === undefined || entry.forwardEncoding === filters.forwardEncoding),
  );
}

export function getLanguageReferenceCharacters(systemId: MorseSystemId): readonly LanguageReferenceCharacter[] {
  return Object.freeze(
    getMorseRegistryEntries({ systemId, category: "language-letter" }).map(toLanguageReferenceCharacter),
  );
}

export function getLanguageReferenceCharactersByIds(entryIds: readonly string[]): readonly LanguageReferenceCharacter[] {
  return Object.freeze(entryIds.map((entryId) => {
    const entry = getMorseRegistryEntry(entryId);
    if (!entry) throw new Error(`Language reference entry ${entryId} is missing`);
    return toLanguageReferenceCharacter(entry);
  }));
}

function toLanguageReferenceCharacter(entry: MorseRegistryEntry): LanguageReferenceCharacter {
  if (!entry.presentation) throw new Error(`Language reference entry ${entry.id} is missing presentation data`);
  return Object.freeze({
    id: entry.id,
    reference: entry.presentation.reference,
    target: entry.character,
    reading: entry.presentation.reading,
    morse: entry.pattern,
    label: entry.presentation.label,
    ...(entry.presentation.notes ? { notes: entry.presentation.notes } : {}),
  });
}

export function getMorseSystemInputSequences(systemId: MorseSystemId): readonly MorseSystemInputSequence[] {
  return MORSE_SYSTEM_INPUT_SEQUENCES.filter((sequence) => sequence.systemId === systemId);
}

export function getMorseForwardMap(systemId: MorseSystemId): Readonly<Record<string, string>> {
  return mapEntries(
    entriesBySystem.get(systemId)!.filter((entry) => entry.forwardEncoding && entry.kind === "canonical"),
    (entry) => entry.character,
    (entry) => entry.pattern,
  );
}

export function getMorseReverseCandidates(
  pattern: string,
  systemId?: MorseSystemId,
): readonly MorseRegistryEntry[] {
  const candidates = entriesByPattern.get(pattern) ?? [];
  return systemId === undefined ? candidates : candidates.filter((entry) => entry.systemId === systemId);
}

export function getMorseReverseMap(systemId: MorseSystemId): Readonly<Record<string, string>> {
  const entries = entriesBySystem.get(systemId)!.filter((entry) => entry.reverseDecoding);
  const unambiguous = new Map<string, MorseRegistryEntry[]>();
  for (const entry of entries) unambiguous.set(entry.pattern, [...(unambiguous.get(entry.pattern) ?? []), entry]);
  return Object.freeze(Object.fromEntries([...unambiguous.entries()].filter(([, candidates]) => candidates.length === 1).map(([pattern, candidates]) => [pattern, candidates[0].character])));
}

export type MorseEncodeIssue = {
  type: "unsupported-character";
  value: string;
  index: number;
};

export type MorseEncodeWithSystemResult = {
  value: string;
  systemId: MorseSystemId;
  normalizedInput: string;
  consumedCharacters: readonly string[];
  unsupportedCharacters: readonly MorseEncodeIssue[];
  aliasResolutions: readonly { input: string; entryId: string; canonicalEntryIds: readonly string[] }[];
  usedSystemIds: readonly MorseSystemId[];
  mixedSystem: false;
};

export type MorseDecodeTokenResult = {
  token: string;
  status: "decoded" | "ambiguous" | "unknown";
  value?: string;
  candidates: readonly MorseRegistryEntry[];
};

export type MorseDecodeWithSystemResult = {
  value: string;
  selectedSystemId?: MorseSystemId;
  usedDefaultGlobalFallback: boolean;
  normalizedInput: string;
  tokens: readonly MorseDecodeTokenResult[];
  ambiguousTokens: readonly MorseDecodeTokenResult[];
  unknownTokens: readonly string[];
};

function normalizeForSystem(input: string, system: MorseSystem): string {
  const normalized = (input ?? "").normalize(system.defaultNormalization).replace(/\s+/g, " ").trim();
  return system.id === DEFAULT_MORSE_SYSTEM_ID ? normalized.toUpperCase() : normalized;
}

export function encodeMorseWithSystem(
  input: string,
  options: { systemId?: MorseSystemId; unsupportedText?: "omit" | "placeholder" } = {},
): MorseEncodeWithSystemResult {
  const systemId = options.systemId ?? DEFAULT_MORSE_SYSTEM_ID;
  const system = getMorseSystem(systemId);
  const normalizedInput = normalizeForSystem(input, system);
  const entries = entriesBySystem.get(systemId)!.filter((entry) => entry.forwardEncoding);
  const byInput = new Map(entries.flatMap((entry) => entry.normalizedInputs.map((value) => [value, entry] as const)));
  const sequenceByInput = new Map(
    (inputSequencesBySystem.get(systemId) ?? []).flatMap((sequence) =>
      sequence.normalizedInputs.map((value) => [value, sequence] as const),
    ),
  );
  const unsupportedCharacters: MorseEncodeIssue[] = [];
  const consumedCharacters: string[] = [];
  const aliasResolutions: Array<{ input: string; entryId: string; canonicalEntryIds: readonly string[] }> = [];
  const words = normalizedInput.split(/\s+/).filter(Boolean).map((word) => {
    const patterns: string[] = [];
    Array.from(word).forEach((character, index) => {
      const entry = byInput.get(character);
      if (entry) {
        patterns.push(entry.pattern);
        consumedCharacters.push(character);
        return;
      }
      const sequence = sequenceByInput.get(character);
      if (sequence) {
        const expandedEntries = sequence.expansionEntryIds.map((entryId) => entriesById.get(entryId));
        if (expandedEntries.some((expanded) => !expanded || !expanded.forwardEncoding)) {
          throw new Error(`Invalid input sequence ${sequence.id}`);
        }
        patterns.push(...expandedEntries.map((expanded) => expanded!.pattern));
        consumedCharacters.push(character);
        aliasResolutions.push({
          input: character,
          entryId: sequence.id,
          canonicalEntryIds: sequence.expansionEntryIds,
        });
      } else {
        unsupportedCharacters.push({ type: "unsupported-character", value: character, index });
        if (options.unsupportedText === "placeholder") patterns.push(DEFAULT_GLOBAL_FORWARD_MAP["?"]);
      }
    });
    return patterns.join("   ");
  }).filter(Boolean);
  return {
    value: words.join("       "),
    systemId,
    normalizedInput,
    consumedCharacters,
    unsupportedCharacters,
    aliasResolutions,
    usedSystemIds: consumedCharacters.length ? [systemId] : [],
    mixedSystem: false,
  };
}

function normalizeSystemMorse(input: string): string {
  let output = "";
  let pendingSpaces = 0;
  const flushSpaces = () => {
    if (pendingSpaces <= 0) return;
    if (output) output += pendingSpaces >= 7 ? "       " : " ";
    pendingSpaces = 0;
  };

  for (const character of input ?? "") {
    if (character === "." || character === "-") {
      flushSpaces();
      output += character;
    } else if (character === "/" || character === "|" || character === "\n") {
      if (output) pendingSpaces = Math.max(pendingSpaces, 7);
    } else if (/\s/.test(character)) {
      if (output) pendingSpaces += 1;
    }
  }
  return output.trim();
}

export function decodeMorseWithSystem(
  input: string,
  options: { systemId?: MorseSystemId; useDefaultGlobalFallback?: boolean; unknownToken?: "placeholder" | "omit" } = {},
): MorseDecodeWithSystemResult {
  const normalizedInput = normalizeSystemMorse(input);
  const useDefaultGlobalFallback = options.useDefaultGlobalFallback === true;
  const selectedSystemId = options.systemId ?? (useDefaultGlobalFallback ? DEFAULT_MORSE_SYSTEM_ID : undefined);
  const unknownToken = options.unknownToken ?? "placeholder";
  const tokens: MorseDecodeTokenResult[] = [];
  const outputSequences = inputSequencesBySystem.get(selectedSystemId ?? DEFAULT_MORSE_SYSTEM_ID) ?? [];
  const decoded = normalizedInput.split("       ").filter(Boolean).map((word) => {
    const wordTokens = word.split(" ").filter(Boolean).map((token) => {
      const candidates = getMorseReverseCandidates(token, selectedSystemId);
      if (candidates.length === 1) {
        const result: MorseDecodeTokenResult = { token, status: "decoded", value: candidates[0].character, candidates };
        tokens.push(result);
        return result;
      }
      if (candidates.length > 1) {
        const result: MorseDecodeTokenResult = { token, status: "ambiguous", candidates };
        tokens.push(result);
        return result;
      }
      const result: MorseDecodeTokenResult = { token, status: "unknown", candidates: [] };
      tokens.push(result);
      return result;
    });
    let output = "";
    for (let index = 0; index < wordTokens.length;) {
      const sequence = outputSequences.find((candidate) =>
        candidate.expansionEntryIds.every((entryId, offset) =>
          wordTokens[index + offset]?.candidates.length === 1 &&
          wordTokens[index + offset]?.candidates[0]?.id === entryId,
        ),
      );
      if (sequence) {
        output += sequence.canonicalOutput;
        index += sequence.expansionEntryIds.length;
        continue;
      }
      const token = wordTokens[index];
      output += token.status === "decoded" ? token.value : unknownToken === "placeholder" ? "?" : "";
      index += 1;
    }
    return output;
  }).filter(Boolean).join(" ");
  return {
    value: decoded,
    selectedSystemId,
    usedDefaultGlobalFallback: useDefaultGlobalFallback,
    normalizedInput,
    tokens,
    ambiguousTokens: tokens.filter((token) => token.status === "ambiguous"),
    unknownTokens: tokens.filter((token) => token.status === "unknown").map((token) => token.token),
  };
}
