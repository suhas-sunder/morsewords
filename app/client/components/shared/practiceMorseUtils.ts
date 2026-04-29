import { MORSE_TO_TEXT, TEXT_TO_MORSE } from "./morseMaps";

type UnsupportedCounts = Record<string, number>;

/**
 * Normalize user text for encoding.
 *
 * Goals:
 * - Deterministic output
 * - Handle common pasted punctuation consistently
 * - Keep conversions conservative (no transliteration)
 */
export function normalizeTextForEncoding(input: string): string {
  const s = (input ?? "")
    .normalize("NFKC")
    // Curly quotes and primes
    .replace(/[“”]/g, '"')
    .replace(/[‘’‛]/g, "'")
    // Dashes and minus variants
    .replace(/[–—−]/g, "-")
    // Bullet-like dots sometimes used for Morse or lists
    .replace(/[•·∙]/g, ".")
    // Tabs to spaces
    .replace(/\t/g, " ")
    // Normalize newlines to spaces (encoder treats any whitespace as a word break)
    .replace(/\r\n|\r|\n/g, " ")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  return s.toUpperCase();
}

export function getUnsupportedTextCharacters(input: string): UnsupportedCounts {
  const normalized = normalizeTextForEncoding(input);
  const supported = new Set(Object.keys(TEXT_TO_MORSE));
  const counts: UnsupportedCounts = {};

  for (const ch of normalized) {
    if (ch === " ") continue;
    if (!supported.has(ch)) counts[ch] = (counts[ch] ?? 0) + 1;
  }

  return counts;
}

/**
 * Encode plain text to International Morse code.
 * - Letters separated by 3 spaces
 * - Words separated by 7 spaces
 * - Unsupported characters are skipped (use getUnsupportedTextCharacters to report them)
 */
export function textToMorse(input: string): string {
  const normalized = normalizeTextForEncoding(input);
  if (!normalized) return "";

  return normalized
    .split(/\s+/)
    .map((word) =>
      word
        .split("")
        .map((c) => TEXT_TO_MORSE[c] || "")
        .filter(Boolean)
        .join("   ")
    )
    .filter(Boolean)
    .join("       ");
}

type MorseNormalizeResult = {
  normalized: string;
  invalidChars: string[];
};

/**
 * Normalize Morse-like input.
 * - Accepts dot/dash lookalikes
 * - Treats / and newlines as word separators
 * - Converts all whitespace to spaces
 */
export function normalizeMorseForDecoding(input: string): MorseNormalizeResult {
  const raw = (input ?? "")
    .replace(/[•·∙]/g, ".")
    .replace(/[–—−]/g, "-")
    .replace(/\t/g, " ")
    .replace(/\r\n|\r/g, "\n");

  const invalid = new Set<string>();
  let out = "";

  for (const ch of raw) {
    if (ch === "." || ch === "-") {
      out += ch;
      continue;
    }
    if (ch === "/" || ch === "\n") {
      // word separator: normalize to 7 spaces
      out += "       ";
      continue;
    }
    if (ch === " ") {
      out += " ";
      continue;
    }
    if (/\s/.test(ch)) {
      // other whitespace
      out += " ";
      continue;
    }

    invalid.add(ch);
    // Keep going; invalid characters are omitted from the normalized stream.
  }

  // Collapse runs of 7+ spaces to exactly 7 (word gap). Keep 1..6 as-is for letter gaps.
  out = out
    .trim()
    .replace(/\s{7,}/g, "       ")
    // Allow common user spacing between elements within a single character, e.g. ". -" -> ".-"
    .replace(/([.\-]) ([.\-])/g, "$1$2");

  return { normalized: out, invalidChars: [...invalid] };
}

/**
 * Decode International Morse code to text.
 *
 * Rules:
 * - 1..6 spaces: letter boundary
 * - 7+ spaces: word boundary
 * - / and newlines: word boundary
 * - Unknown sequences decode to "?" (never silent)
 */
export function morseToText(input: string): string {
  const { normalized } = normalizeMorseForDecoding(input);
  if (!normalized) return "";

  const words: string[] = [];
  let currentWord = "";
  let currentSymbol = "";
  let spaceRun = 0;

  const flushSymbol = () => {
    if (!currentSymbol) return;
    const mapped = MORSE_TO_TEXT[currentSymbol];
    currentWord += mapped ?? "?";
    currentSymbol = "";
  };

  const flushWord = () => {
    flushSymbol();
    if (currentWord) words.push(currentWord);
    currentWord = "";
  };

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];

    if (ch === "." || ch === "-") {
      if (spaceRun > 0) {
        // Resolve boundary based on previous spaces
        if (spaceRun >= 7) flushWord();
        else flushSymbol();
        spaceRun = 0;
      }
      currentSymbol += ch;
      continue;
    }

    if (ch === " ") {
      spaceRun += 1;
      continue;
    }
  }

  // End of input
  if (spaceRun >= 7) flushWord();
  else flushSymbol();
  if (currentWord) words.push(currentWord);

  return words.join(" ");
}
