import { expect, test } from "@playwright/test";
import {
  DEFAULT_GLOBAL_FORWARD_MAP,
  DEFAULT_GLOBAL_REVERSE_MAP,
  DEFAULT_MORSE_SYSTEM_ID,
  MORSE_COLLISION_GROUPS,
  MORSE_REGISTRY_ENTRIES,
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
  "japanese-wabun-starter": [
    ["ja-a", "ア", "a", "--.--"], ["ja-i", "イ", "i", ".-"], ["ja-u", "ウ", "u", "..-"], ["ja-e", "エ", "e", "-.---"], ["ja-o", "オ", "o", ".-..."], ["ja-ka", "カ", "ka", ".-.."], ["ja-ki", "キ", "ki", "-.-.."], ["ja-ku", "ク", "ku", "...-"], ["ja-ke", "ケ", "ke", "-.--"], ["ja-ko", "コ", "ko", "----"], ["ja-n", "ン", "n", ".-.-."],
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
  expect(MORSE_LANGUAGE_PAGES.find((page) => page.slug === "russian")?.characters).toHaveLength(33);
  expect(MORSE_LANGUAGE_PAGES.find((page) => page.slug === "greek")?.characters).toHaveLength(24);
  expect(getLanguageReferenceCharacters("greek-reference").map((entry) => entry.reading)).toEqual([
    "A", "B", "G", "D", "E", "Z", "H", "Th", "I", "K", "L", "M", "N", "X", "O", "P", "R", "S", "T", "Y", "F", "Ch", "Ps", "O",
  ]);
});

test("collision groups retain every legacy candidate without insertion-order decoding", () => {
  expect(MORSE_COLLISION_GROUPS).toHaveLength(30);
  expect(MORSE_COLLISION_GROUPS.map((group) => group.pattern)).toEqual(EXPECTED_COLLISIONS);
  expect(getMorseReverseCandidates(".-").map((entry) => entry.character)).toEqual(["A", "イ", "А", "Α"]);
  expect(getMorseReverseCandidates(".", "russian-cyrillic-reference").map((entry) => entry.character)).toEqual(["Е", "Ё"]);
  expect(getMorseReverseMap("russian-cyrillic-reference")["."]).toBeUndefined();
  expect(getMorseReverseMap("greek-reference")[".-"]).toBe("Α");
});

test("system-aware conversion reports unsupported input and ambiguity without cross-system guessing", () => {
  expect(encodeMorseWithSystem("SOS", { systemId: DEFAULT_MORSE_SYSTEM_ID })).toMatchObject({
    value: "...   ---   ...",
    systemId: "international",
    mixedSystem: false,
  });
  expect(encodeMorseWithSystem("アイ", { systemId: "japanese-wabun-starter" })).toMatchObject({
    value: "--.--   .-",
    unsupportedCharacters: [],
  });
  expect(encodeMorseWithSystem("АБ", { systemId: "russian-cyrillic-reference" }).value).toBe(".-   -...");
  expect(encodeMorseWithSystem("ΑΒ", { systemId: "greek-reference" }).value).toBe(".-   -...");
  expect(encodeMorseWithSystem("A", { systemId: "greek-reference" }).unsupportedCharacters).toHaveLength(1);

  expect(decodeMorseWithSystem(".-").tokens[0]).toMatchObject({ status: "ambiguous" });
  expect(decodeMorseWithSystem(".-", { useDefaultGlobalFallback: true })).toMatchObject({ value: "A", selectedSystemId: "international" });
  expect(decodeMorseWithSystem(".", { systemId: "russian-cyrillic-reference" }).tokens[0]).toMatchObject({ status: "ambiguous" });
  expect(decodeMorseWithSystem("--.--", { systemId: "japanese-wabun-starter" })).toMatchObject({ value: "ア" });
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
  const codes = validateMorseRegistry(invalid).map((issue) => issue.code);
  expect(codes).toEqual(expect.arrayContaining([
    "duplicate-entry-id",
    "malformed-pattern",
    "invalid-system-id",
    "malformed-code-points",
    "duplicate-default-global-reverse",
    "unsafe-same-system-collision",
    "missing-alias-target",
  ]));

  expect(transliterateForInternationalMorse("先生")).toBe("sensei");
  expect(transliterateForInternationalMorse("Учитель")).toBe("uchitel'");
  expect(encodeMorseWithSystem("先", { systemId: "international" }).unsupportedCharacters).toHaveLength(1);
});

test("registry remains deterministic and code-point-safe without browser state", () => {
  expect(MORSE_REGISTRY_ENTRIES.every((entry) => entry.codePoints.length === Array.from(entry.character).length)).toBe(true);
  expect(getMorseForwardMap("international")).toEqual(DEFAULT_GLOBAL_FORWARD_MAP);
  expect(getMorseForwardMap("japanese-wabun-starter")["ア"]).toBe("--.--");
  expect(encodeMorseWithSystem("ア", { systemId: "japanese-wabun-starter" }).consumedCharacters).toEqual(["ア"]);
});
