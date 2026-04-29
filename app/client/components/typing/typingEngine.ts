import { morseToText } from "~/client/components/shared/practiceMorseUtils";

export type DecodeResult = {
  decoded: string;
  currentSymbol: string;
  normalizedRaw: string;
  lettersDecoded: number;
  wordsDecoded: number;
  invalidSymbols: number;
};

function normalizeRaw(raw: string): string {
  return (raw ?? "")
    .replace(/[·•]/g, ".")
    .replace(/[—–−]/g, "-")
    .replace(/[^.\- /\n\t]/g, "") // keep only dot, dash, space, slash, and whitespace
    .replace(/\t/g, " ")
    .replace(/\n/g, " ");
}

/**
 * Decode a stream of Morse characters in a "typing scratchpad" style:
 * - '.' and '-' build the current symbol
 * - a single space commits the current symbol as a letter
 * - '///' is not special; '/' commits a word boundary
 * - three or more spaces also commit a word boundary
 */
export function decodeTypingRaw(raw: string): DecodeResult {
  const normalizedRaw = normalizeRaw(raw);

  let decoded = "";
  let currentSymbol = "";
  let spaceRun = 0;

  let lettersDecoded = 0;
  let wordsDecoded = 0;
  let invalidSymbols = 0;

  const commitLetter = () => {
    if (!currentSymbol) return;
    const letter = morseToText(currentSymbol);
    if (letter === "?") invalidSymbols += 1;
    decoded += letter;
    lettersDecoded += 1;
    currentSymbol = "";
  };

  const commitWord = () => {
    commitLetter();
    if (!decoded.endsWith(" ") && decoded.length > 0) decoded += " ";
    // Avoid counting leading empty words
    if (decoded.trim().length > 0) wordsDecoded += 1;
  };

  for (let i = 0; i < normalizedRaw.length; i++) {
    const ch = normalizedRaw[i];

    if (ch === "." || ch === "-") {
      if (spaceRun > 0) {
        if (spaceRun >= 3) commitWord();
        else commitLetter();
        spaceRun = 0;
      }
      currentSymbol += ch;
      continue;
    }

    if (ch === "/") {
      spaceRun = 0;
      commitWord();
      continue;
    }

    if (ch === " ") {
      spaceRun += 1;
      continue;
    }
  }

  // Finalize pending boundary (but keep currentSymbol for the live buffer)
  if (spaceRun >= 3) {
    // If the user ends with a big gap, treat it like a word boundary.
    commitWord();
  } else if (spaceRun > 0) {
    // If the user ends with a small gap, commit the letter.
    commitLetter();
  }

  return {
    decoded: decoded.replace(/\s+/g, " ").trimEnd(),
    currentSymbol,
    normalizedRaw,
    lettersDecoded,
    wordsDecoded,
    invalidSymbols,
  };
}
