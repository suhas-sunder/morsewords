import { expect, test } from "@playwright/test";
import {
  DEFAULT_GLOBAL_FORWARD_MAP,
  DEFAULT_GLOBAL_REVERSE_MAP,
  DEFAULT_MORSE_SYSTEM_ID,
  MORSE_COLLISION_GROUPS,
  MORSE_REGISTRY_ENTRIES,
  MORSE_SYSTEM_INPUT_SEQUENCES,
  decodeMorseWithSystem,
  encodeMorseWithSystem,
  getLanguageReferenceCharacters,
  getMorseForwardMap,
  getMorseReverseCandidates,
  getMorseReverseMap,
  validateMorseRegistry,
  type MorseRegistryEntry,
} from "../../app/client/components/shared/morseRegistry";
import {
  MORSE_TO_TEXT,
  TEXT_TO_MORSE,
  morseToText,
  textToMorse,
} from "../../app/client/components/shared/morseUtils";
import { MORSE_LANGUAGE_PAGES } from "../../app/client/data/morseLanguages";
import { transliterateForInternationalMorse } from "../../app/client/components/shared/internationalMorse";

// Captured from the pre-registry converter. This fixture deliberately does not
// derive from registry data, so it protects the public compatibility contract.
const LEGACY_GLOBAL_MAP = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "/": "-..-.", "'": ".----.", "!": "-.-.--", "-": "-....-", "@": ".--.-.", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", '"': ".-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", "_": "..--.-",
} as const;

const EXPECTED_COLLISIONS = [
  ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", ".-.-.", ".-...", "--.--", "----",
];

const EXPECTED_LANGUAGE_ROWS = {
  "japanese-wabun": [
    ["ja-e", "エ", "e", "-.---"], ["ja-i", "イ", "i", ".-"], ["ja-te", "テ", "te", ".-.--"], ["ja-ro", "ロ", "ro", ".-.-"],
    ["ja-a", "ア", "a", "--.--"], ["ja-ha", "ハ", "ha", "-..."], ["ja-sa", "サ", "sa", "-.-.-"], ["ja-ni", "ニ", "ni", "-.-."],
    ["ja-ki", "キ", "ki", "-.-.."], ["ja-ho", "ホ", "ho", "-.."], ["ja-yu", "ユ", "yu", "-..--"], ["ja-he", "ヘ", "he", "."],
    ["ja-me", "メ", "me", "-...-"], ["ja-to", "ト", "to", "..-.."], ["ja-mi", "ミ", "mi", "..-.-"], ["ja-chi", "チ", "chi", "..-."],
    ["ja-shi", "シ", "shi", "--.-."], ["ja-ri", "リ", "ri", "--."], ["ja-we", "ヱ", "we", ".--.."], ["ja-nu", "ヌ", "nu", "...."],
    ["ja-hi", "ヒ", "hi", "--..-"], ["ja-ru", "ル", "ru", "-.--."], ["ja-mo", "モ", "mo", "-..-."], ["ja-wo", "ヲ", "wo", ".---"],
    ["ja-se", "セ", "se", ".---."], ["ja-wa", "ワ", "wa", "-.-"], ["ja-su", "ス", "su", "---.-"], ["ja-ka", "カ", "ka", ".-.."],
    ["ja-n", "ン", "n", ".-.-."], ["ja-yo", "ヨ", "yo", "--"], ["ja-ta", "タ", "ta", "-."], ["ja-re", "レ", "re", "---"],
    ["ja-so", "ソ", "so", "---."], ["ja-tsu", "ツ", "tsu", ".--."], ["ja-ne", "ネ", "ne", "--.-"], ["ja-na", "ナ", "na", ".-."],
    ["ja-ra", "ラ", "ra", "..."], ["ja-mu", "ム", "mu", "-"], ["ja-u", "ウ", "u", "..-"], ["ja-wi", "ヰ", "wi", ".-..-"],
    ["ja-no", "ノ", "no", "..--"], ["ja-o", "オ", "o", ".-..."], ["ja-ku", "ク", "ku", "...-"], ["ja-ya", "ヤ", "ya", ".--"],
    ["ja-ma", "マ", "ma", "-..-"], ["ja-ke", "ケ", "ke", "-.--"], ["ja-fu", "フ", "fu", "--.."], ["ja-ko", "コ", "ko", "----"],
  ],
  "russian-cyrillic-reference": [
    ["ru-А", "А", "A", ".-"], ["ru-Б", "Б", "B", "-..."], ["ru-В", "В", "V", ".--"], ["ru-Г", "Г", "G", "--."], ["ru-Д", "Д", "D", "-.."], ["ru-Е", "Е", "E", "."], ["ru-Ё", "Ё", "Yo", "."], ["ru-Ж", "Ж", "Zh", "...-"], ["ru-З", "З", "Z", "--.."], ["ru-И", "И", "I", ".."], ["ru-Й", "Й", "J", ".---"], ["ru-К", "К", "K", "-.-"], ["ru-Л", "Л", "L", ".-.."], ["ru-М", "М", "M", "--"], ["ru-Н", "Н", "N", "-."], ["ru-О", "О", "O", "---"], ["ru-П", "П", "P", ".--."], ["ru-Р", "Р", "R", ".-."], ["ru-С", "С", "S", "..."], ["ru-Т", "Т", "T", "-"], ["ru-У", "У", "U", "..-"], ["ru-Ф", "Ф", "F", "..-."], ["ru-Х", "Х", "Kh", "...."], ["ru-Ц", "Ц", "Ts", "-.-."], ["ru-Ч", "Ч", "Ch", "---."], ["ru-Ш", "Ш", "Sh", "----"], ["ru-Щ", "Щ", "Shch", "--.-"], ["ru-Ъ", "Ъ", "Hard sign", "--.--"], ["ru-Ы", "Ы", "Y", "-.--"], ["ru-Ь", "Ь", "Soft sign", "-..-"], ["ru-Э", "Э", "E", "..-.."], ["ru-Ю", "Ю", "Yu", "..--"], ["ru-Я", "Я", "Ya", ".-.-"],
  ],
  "greek-reference": [
    ["el-Α", "Α", "Alpha", ".-"], ["el-Β", "Β", "Beta", "-..."], ["el-Γ", "Γ", "Gamma", "--."], ["el-Δ", "Δ", "Delta", "-.."], ["el-Ε", "Ε", "Epsilon", "."], ["el-Ζ", "Ζ", "Zeta", "--.."], ["el-Η", "Η", "Eta", "...."], ["el-Θ", "Θ", "Theta", "-.-."], ["el-Ι", "Ι", "Iota", ".."], ["el-Κ", "Κ", "Kappa", "-.-"], ["el-Λ", "Λ", "Lambda", ".-.."], ["el-Μ", "Μ", "Mu", "--"], ["el-Ν", "Ν", "Nu", "-."], ["el-Ξ", "Ξ", "Xi", "-..-"], ["el-Ο", "Ο", "Omicron", "---"], ["el-Π", "Π", "Pi", ".--."], ["el-Ρ", "Ρ", "Rho", ".-."], ["el-Σ", "Σ", "Sigma", "..."], ["el-Τ", "Τ", "Tau", "-"], ["el-Υ", "Υ", "Upsilon", "Y", "-.--"], ["el-Φ", "Φ", "Phi", "F", "..-."], ["el-Χ", "Χ", "Chi", "Ch", "----"], ["el-Ψ", "Ψ", "Psi", "Ps", "--.-"], ["el-Ω", "Ω", "Omega", "O", ".--"],
  ],
} as const;

test("registry-derived default maps exactly preserve the legacy 53-entry converter", () => {
  const expectedReverse = Object.fromEntries(
    Object.entries(LEGACY_GLOBAL_MAP).map(([character, pattern]) => [pattern, character]),
  );

  expect(Object.keys(DEFAULT_GLOBAL_FORWARD_MAP)).toHaveLength(53);
  expect(DEFAULT_GLOBAL_FORWARD_MAP).toEqual(LEGACY_GLOBAL_MAP);
  expect(DEFAULT_GLOBAL_REVERSE_MAP).toEqual(expectedReverse);
  expect(TEXT_TO_MORSE).toEqual(LEGACY_GLOBAL_MAP);
  expect(MORSE_TO_TEXT).toEqual(expectedReverse);
});

test("existing public converter behavior remains compatible with the generated maps", () => {
  for (const [character, pattern] of Object.entries(LEGACY_GLOBAL_MAP)) {
    expect(textToMorse(character)).toBe(pattern);
    expect(morseToText(pattern)).toBe(character);
  }
  expect(textToMorse("hello 123?!")).toBe("....   .   .-..   .-..   ---       .----   ..---   ...--   ..--..   -.-.--");
  expect(textToMorse("HI 💡", { returnResult: true })).toMatchObject({
    value: "....   ..",
    unsupportedCounts: { "💡": 1 },
  });
  expect(morseToText("... / ---")).toBe("S O");
});

test("language reference rows retain their current count, order, values, and page projection", () => {
  for (const [systemId, expected] of Object.entries(EXPECTED_LANGUAGE_ROWS)) {
    const actual = getLanguageReferenceCharacters(systemId as keyof typeof EXPECTED_LANGUAGE_ROWS);
    expect(actual.map((entry) => [entry.id, entry.target, entry.morse])).toEqual(
      expected.map((row) => [row[0], row[1], row[row.length - 1]]),
    );
  }
  expect(MORSE_LANGUAGE_PAGES.find((page) => page.slug === "japanese")?.characters).toHaveLength(11);
  expect(MORSE_LANGUAGE_PAGES.find((page) => page.slug === "japanese")?.characters.map((entry) => entry.id)).toEqual([
    "ja-a", "ja-i", "ja-u", "ja-e", "ja-o", "ja-ka", "ja-ki", "ja-ku", "ja-ke", "ja-ko", "ja-n",
  ]);
  expect(MORSE_LANGUAGE_PAGES.find((page) => page.slug === "russian")?.characters).toHaveLength(33);
  expect(MORSE_LANGUAGE_PAGES.find((page) => page.slug === "greek")?.characters).toHaveLength(24);
  expect(getLanguageReferenceCharacters("greek-reference").map((entry) => entry.reading)).toEqual([
    "A", "B", "G", "D", "E", "Z", "H", "Th", "I", "K", "L", "M", "N", "X", "O", "P", "R", "S", "T", "Y", "F", "Ch", "Ps", "O",
  ]);
});

test("collision groups retain every legacy candidate without insertion-order decoding", () => {
  expect(MORSE_COLLISION_GROUPS).toHaveLength(48);
  expect(MORSE_COLLISION_GROUPS.map((group) => group.pattern)).toEqual(expect.arrayContaining(EXPECTED_COLLISIONS));
  expect(getMorseReverseCandidates(".-").map((entry) => entry.character)).toEqual(["A", "イ", "А", "Α"]);
  expect(getMorseReverseCandidates(".", "russian-cyrillic-reference").map((entry) => entry.character)).toEqual(["Е", "Ё"]);
  expect(getMorseReverseMap("russian-cyrillic-reference")["."]).toBeUndefined();
  expect(MORSE_COLLISION_GROUPS.filter((group) => group.sameSystemCollisionSystemIds.includes("japanese-wabun"))).toEqual([]);
  expect(getMorseReverseMap("greek-reference")[".-"]).toBe("Α");
});

test("system-aware conversion reports unsupported input and ambiguity without cross-system guessing", () => {
  expect(encodeMorseWithSystem("SOS", { systemId: DEFAULT_MORSE_SYSTEM_ID })).toMatchObject({
    value: "...   ---   ...",
    systemId: "international",
    mixedSystem: false,
  });
  expect(encodeMorseWithSystem("アイ", { systemId: "japanese-wabun" })).toMatchObject({
    value: "--.--   .-",
    unsupportedCharacters: [],
  });
  expect(encodeMorseWithSystem("АБ", { systemId: "russian-cyrillic-reference" }).value).toBe(".-   -...");
  expect(encodeMorseWithSystem("ΑΒ", { systemId: "greek-reference" }).value).toBe(".-   -...");
  expect(encodeMorseWithSystem("A", { systemId: "greek-reference" }).unsupportedCharacters).toHaveLength(1);

  expect(decodeMorseWithSystem(".-").tokens[0]).toMatchObject({ status: "ambiguous" });
  expect(decodeMorseWithSystem(".-", { useDefaultGlobalFallback: true })).toMatchObject({ value: "A", selectedSystemId: "international" });
  expect(decodeMorseWithSystem(".", { systemId: "russian-cyrillic-reference" }).tokens[0]).toMatchObject({ status: "ambiguous" });
  expect(decodeMorseWithSystem("--.--", { systemId: "japanese-wabun" })).toMatchObject({ value: "ア" });
  expect(decodeMorseWithSystem("........")).toMatchObject({ value: "?", unknownTokens: ["........"] });
  expect(decodeMorseWithSystem(".- / -", { useDefaultGlobalFallback: true }).value).toBe("A T");
});

test("registry validation catches structural defects and preserves direct transliteration boundaries", () => {
  const first = MORSE_REGISTRY_ENTRIES[0];
  const japanese = MORSE_REGISTRY_ENTRIES.find((entry) => entry.id === "ja-i")!;
  const invalid = [
    ...MORSE_REGISTRY_ENTRIES,
    { ...first },
    { ...first, id: "bad-pattern", character: "Å", codePoints: ["U+00C5"], pattern: "-x-" },
    { ...first, id: "bad-system", character: "Æ", codePoints: ["U+00C6"], systemId: "missing-system" as typeof first.systemId },
    { ...first, id: "bad-code-point", character: "Ø", codePoints: ["U+0000"] },
    { ...first, id: "bad-default-reverse", character: "Ω", codePoints: ["U+03A9"] },
    { ...japanese, id: "unsafe-japanese-collision", character: "テ", codePoints: ["U+30C6"], collisionPolicy: "reject" as const },
    { ...first, id: "broken-alias", character: "Ä", codePoints: ["U+00C4"], kind: "alias" as const, category: "input-alias" as const, aliasOf: "missing-entry", forwardEncoding: false, reverseDecoding: false, defaultGlobal: false },
  ] as MorseRegistryEntry[];
  const codes = validateMorseRegistry(invalid, undefined, [
    ...MORSE_SYSTEM_INPUT_SEQUENCES,
    { ...MORSE_SYSTEM_INPUT_SEQUENCES[0], id: "bad-sequence", normalizedInputs: ["カ"], expansionEntryIds: ["missing-entry"] },
  ]).map((issue) => issue.code);
  expect(codes).toEqual(expect.arrayContaining([
    "duplicate-entry-id",
    "malformed-pattern",
    "invalid-system-id",
    "malformed-code-points",
    "duplicate-default-global-reverse",
    "unsafe-same-system-collision",
    "missing-alias-target",
    "duplicate-sequence-input",
    "invalid-sequence-expansion",
  ]));

  expect(transliterateForInternationalMorse("先生")).toBe("sensei");
  expect(transliterateForInternationalMorse("Учитель")).toBe("uchitel'");
  expect(encodeMorseWithSystem("先", { systemId: "international" }).unsupportedCharacters).toHaveLength(1);
});

test("complete Wabun input remains system-scoped, Unicode-safe, and source-defined", () => {
  const canonicalFixture = EXPECTED_LANGUAGE_ROWS["japanese-wabun"];
  for (const [, character, , pattern] of canonicalFixture) {
    expect(encodeMorseWithSystem(character, { systemId: "japanese-wabun" })).toMatchObject({ value: pattern, unsupportedCharacters: [] });
    expect(decodeMorseWithSystem(pattern, { systemId: "japanese-wabun" })).toMatchObject({ value: character });
  }
  for (const [character, pattern] of [["0", "-----"], ["1", ".----"], ["2", "..---"], ["3", "...--"], ["4", "....-"], ["5", "....."], ["6", "-...."], ["7", "--..."], ["8", "---.."], ["9", "----."], ["ー", ".--.-"], ["、", ".-.-.-"], ["゛", ".."], ["゜", "..--."]] as const) {
    expect(encodeMorseWithSystem(character, { systemId: "japanese-wabun" })).toMatchObject({ value: pattern, unsupportedCharacters: [] });
    expect(decodeMorseWithSystem(pattern, { systemId: "japanese-wabun" })).toMatchObject({ value: character });
  }
  expect(encodeMorseWithSystem("かゑ", { systemId: "japanese-wabun" })).toMatchObject({ value: ".-..   .--..", unsupportedCharacters: [] });
  expect(encodeMorseWithSystem("ｶァ", { systemId: "japanese-wabun" }).unsupportedCharacters.map((character) => character.value)).toEqual(["ｶ", "ァ"]);
  expect(encodeMorseWithSystem("カ\u3099ハ\u309A", { systemId: "japanese-wabun" })).toMatchObject({
    value: ".-..   ..   -...   ..--.",
    normalizedInput: "ガパ",
    unsupportedCharacters: [],
  });
  expect(decodeMorseWithSystem(".-..   ..   -...   ..--.", { systemId: "japanese-wabun" })).toMatchObject({ value: "ガパ" });
  expect(encodeMorseWithSystem("カA", { systemId: "japanese-wabun" }).unsupportedCharacters.map((character) => character.value)).toEqual(["A"]);
  expect(encodeMorseWithSystem("\ud800", { systemId: "japanese-wabun" }).unsupportedCharacters.map((character) => character.value)).toEqual(["\ud800"]);
  expect(decodeMorseWithSystem(".-", { systemId: "japanese-wabun" }).value).toBe("イ");
  expect(decodeMorseWithSystem(".-").tokens[0]).toMatchObject({ status: "ambiguous" });
});

test("registry remains deterministic and code-point-safe without browser state", () => {
  expect(MORSE_REGISTRY_ENTRIES.every((entry) => entry.codePoints.length === Array.from(entry.character).length)).toBe(true);
  expect(getMorseForwardMap("international")).toEqual(DEFAULT_GLOBAL_FORWARD_MAP);
  expect(getMorseForwardMap("japanese-wabun")["ア"]).toBe("--.--");
  expect(encodeMorseWithSystem("ア", { systemId: "japanese-wabun" }).consumedCharacters).toEqual(["ア"]);
  expect(MORSE_SYSTEM_INPUT_SEQUENCES).toHaveLength(30);
});
