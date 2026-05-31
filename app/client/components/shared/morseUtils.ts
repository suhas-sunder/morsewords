export const MORSE_LETTER_GAP = "   ";
export const MORSE_WORD_GAP = "       ";

// ITU-ish core map used by every text/Morse conversion path.
export const TEXT_TO_MORSE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "/": "-..-.",
  "'": ".----.",
  "!": "-.-.--",
  "-": "-....-",
  "@": ".--.-.",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  '"': ".-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  "_": "..--.-",
};

export const MORSE_TO_TEXT: Record<string, string> = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([k, v]) => [v, k]),
);

export const SUPPORTED_TEXT_CHARACTERS = Object.freeze(
  Object.keys(TEXT_TO_MORSE),
);
export const SUPPORTED_MORSE_SYMBOLS = Object.freeze(
  Object.keys(MORSE_TO_TEXT),
);

type UnsupportedCounts = Record<string, number>;

export type MorseTextIssue =
  | {
      type: "unsupported-text-character";
      value: string;
      index: number;
    }
  | {
      type: "invalid-morse-character";
      value: string;
      index: number;
    }
  | {
      type: "unknown-morse-token";
      value: string;
    };

export type MorseNormalizeResult = {
  normalized: string;
  invalidChars: string[];
  issues: MorseTextIssue[];
};

export type MorseNormalizeOptions = {
  trim?: boolean;
};

export type TextToMorseOptions = {
  wordSeparator?: "spaces" | "slash" | "newline";
  unsupportedText?: "omit" | "placeholder";
  returnResult?: boolean;
};

export type MorseToTextOptions = {
  mode?: "loose" | "strict";
  unknownToken?: "placeholder" | "omit";
  returnResult?: boolean;
};

export type MorseTextResult = {
  value: string;
  normalizedInput: string;
  issues: MorseTextIssue[];
  invalidChars?: string[];
  unsupportedCounts?: UnsupportedCounts;
};

export function normalizeTextForMorse(input: string): string {
  return normalizePastedMarks(input ?? "")
    .normalize("NFKC")
    .replace(/\t/g, " ")
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export const normalizeTextForEncoding = normalizeTextForMorse;

export function isSupportedTextCharacter(character: string): boolean {
  return Object.prototype.hasOwnProperty.call(
    TEXT_TO_MORSE,
    normalizeTextForMorse(character),
  );
}

export function isSupportedMorseToken(token: string): boolean {
  return Object.prototype.hasOwnProperty.call(MORSE_TO_TEXT, token);
}

export function getUnsupportedTextCharacters(
  input: string,
): UnsupportedCounts {
  const normalized = normalizeTextForMorse(input);
  const counts: UnsupportedCounts = {};

  for (const ch of normalized) {
    if (ch === " ") continue;
    if (!isSupportedTextCharacter(ch)) counts[ch] = (counts[ch] ?? 0) + 1;
  }

  return counts;
}

export function textToMorse(input: string): string;
export function textToMorse(
  input: string,
  options: TextToMorseOptions & { returnResult: true },
): MorseTextResult;
export function textToMorse(
  input: string,
  options?: TextToMorseOptions & { returnResult?: false },
): string;
export function textToMorse(
  input: string,
  options: TextToMorseOptions = {},
): string | MorseTextResult {
  const normalizedInput = normalizeTextForMorse(input);
  const issues: MorseTextIssue[] = [];
  const unsupportedCounts: UnsupportedCounts = {};

  if (!normalizedInput) {
    return resultOrValue(options, {
      value: "",
      normalizedInput,
      issues,
      unsupportedCounts,
    });
  }

  const words = normalizedInput
    .split(/\s+/)
    .map((word) => {
      const letters: string[] = [];

      [...word].forEach((character, index) => {
        const morse = TEXT_TO_MORSE[character];
        if (morse) {
          letters.push(morse);
          return;
        }

        unsupportedCounts[character] =
          (unsupportedCounts[character] ?? 0) + 1;
        issues.push({
          type: "unsupported-text-character",
          value: character,
          index,
        });

        if (options.unsupportedText === "placeholder") {
          letters.push(TEXT_TO_MORSE["?"]);
        }
      });

      return letters.join(MORSE_LETTER_GAP);
    })
    .filter(Boolean);

  const wordSeparator =
    options.wordSeparator === "slash"
      ? " / "
      : options.wordSeparator === "newline"
        ? "\n"
        : MORSE_WORD_GAP;
  const value = words.join(wordSeparator);

  return resultOrValue(options, {
    value,
    normalizedInput,
    issues,
    unsupportedCounts,
  });
}

export function normalizeMorseForDecode(
  input: string,
  options?: MorseNormalizeOptions,
): string {
  return normalizeMorseForDecoding(input, options).normalized;
}

export function normalizeMorseForDecoding(
  input: string,
  options: MorseNormalizeOptions = {},
): MorseNormalizeResult {
  const raw = normalizePastedMarks(input ?? "").replace(/\r\n|\r/g, "\n");
  const invalid = new Set<string>();
  const issues: MorseTextIssue[] = [];
  let out = "";
  let pendingSpaces = 0;

  const flushPendingSpaces = () => {
    if (pendingSpaces <= 0) return;
    if (out) out += pendingSpaces >= 7 ? MORSE_WORD_GAP : " ";
    pendingSpaces = 0;
  };

  [...raw].forEach((ch, index) => {
    if (ch === "." || ch === "-") {
      flushPendingSpaces();
      out += ch;
      return;
    }

    if (ch === "/" || ch === "|" || ch === "\n") {
      if (out) pendingSpaces = Math.max(pendingSpaces, 7);
      return;
    }

    if (/\s/.test(ch)) {
      if (out) pendingSpaces += 1;
      return;
    }

    invalid.add(ch);
    issues.push({
      type: "invalid-morse-character",
      value: ch,
      index,
    });
  });

  if (options.trim === false) {
    flushPendingSpaces();
  }

  return {
    normalized: options.trim === false ? out : out.trim(),
    invalidChars: [...invalid],
    issues,
  };
}

export function splitMorseWords(input: string): string[][] {
  const normalized = normalizeMorseForDecode(input);
  if (!normalized) return [];

  return normalized
    .split(MORSE_WORD_GAP)
    .map((word) => word.split(" ").filter(Boolean))
    .filter((word) => word.length > 0);
}

export function formatMorseWords(
  words: string[][],
  options: {
    letterSeparator?: string;
    wordSeparator?: string;
  } = {},
): string {
  const letterSeparator = options.letterSeparator ?? " ";
  const wordSeparator = options.wordSeparator ?? MORSE_WORD_GAP;

  return words
    .filter((word) => word.length > 0)
    .map((word) => word.join(letterSeparator))
    .join(wordSeparator);
}

export function countDecodedWords(input: string): number {
  return splitMorseWords(input)
    .map((word) =>
      word
        .map((token) => MORSE_TO_TEXT[token] ?? "?")
        .join("")
        .trim(),
    )
    .filter(Boolean).length;
}

export function countTextWords(input: string): number {
  const normalized = normalizeTextForMorse(input);
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}

export function morseToText(input: string): string;
export function morseToText(
  input: string,
  options: MorseToTextOptions & { returnResult: true },
): MorseTextResult;
export function morseToText(
  input: string,
  options?: MorseToTextOptions & { returnResult?: false },
): string;
export function morseToText(
  input: string,
  options: MorseToTextOptions = {},
): string | MorseTextResult {
  const normalizedResult = normalizeMorseForDecoding(input);
  const issues = [...normalizedResult.issues];
  const normalizedInput = normalizedResult.normalized;
  const unknownToken = options.unknownToken ?? "placeholder";

  if (!normalizedInput) {
    const value =
      options.mode === "strict" && normalizedResult.invalidChars.length > 0
        ? unknownToken === "placeholder"
          ? "?"
          : ""
        : "";
    return resultOrValue(options, {
      value,
      normalizedInput,
      issues,
      invalidChars: normalizedResult.invalidChars,
    });
  }

  if (options.mode === "strict" && normalizedResult.invalidChars.length > 0) {
    const value = unknownToken === "placeholder" ? "?" : "";
    return resultOrValue(options, {
      value,
      normalizedInput,
      issues,
      invalidChars: normalizedResult.invalidChars,
    });
  }

  const words = splitMorseWords(normalizedInput);
  const decoded = words
    .map((word) =>
      word
        .map((token) => {
          const mapped = MORSE_TO_TEXT[token];
          if (mapped) return mapped;

          issues.push({ type: "unknown-morse-token", value: token });
          return unknownToken === "placeholder" ? "?" : "";
        })
        .join(""),
    )
    .filter(Boolean)
    .join(" ");

  return resultOrValue(options, {
    value: decoded,
    normalizedInput,
    issues,
    invalidChars: normalizedResult.invalidChars,
  });
}

function resultOrValue(
  options: { returnResult?: boolean },
  result: MorseTextResult,
) {
  return options.returnResult ? result : result.value;
}

function normalizePastedMarks(input: string): string {
  return input
    .replace(/\u00c2\u00b7|\u00e2\u20ac\u00a2|\u00e2\u02c6\u2122/g, ".")
    .replace(/[\u00b7\u2022\u2219\u22c5]/g, ".")
    .replace(
      /\u00e2\u20ac[\u201c\u201d]|\u00e2\u02c6\u2019/g,
      "-",
    )
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\u00e2\u20ac[\u02dc\u2122\u203a]/g, "'")
    .replace(/[\u2018\u2019\u2032\u2035]/g, "'")
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/[\u201c\u201d]/g, '"');
}
