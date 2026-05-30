import {
  morseToText,
  normalizeMorseForDecode,
} from "~/client/components/shared/morseUtils";

export type DecodeResult = {
  decoded: string;
  currentSymbol: string;
  normalizedRaw: string;
  lettersDecoded: number;
  wordsDecoded: number;
  invalidSymbols: number;
};

function normalizeRaw(raw: string): string {
  return normalizeMorseForDecode(raw, { trim: false });
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

    if (ch === " ") {
      spaceRun += 1;
    }
  }

  // Finalize pending boundary (but keep currentSymbol for the live buffer).
  if (spaceRun >= 3) {
    commitWord();
  } else if (spaceRun > 0) {
    commitLetter();
  }

  const decodedText = decoded.replace(/\s+/g, " ").trimEnd();
  const wordsDecoded = decodedText.trim().split(/\s+/).filter(Boolean).length;

  return {
    decoded: decodedText,
    currentSymbol,
    normalizedRaw,
    lettersDecoded,
    wordsDecoded,
    invalidSymbols,
  };
}
