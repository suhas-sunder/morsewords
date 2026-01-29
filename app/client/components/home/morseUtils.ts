import { MORSE_TO_TEXT, TEXT_TO_MORSE } from "./morseMaps";

export function textToMorse(text: string): string {
  return text
    .normalize("NFKC")
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      word
        .split("")
        .map((c) => TEXT_TO_MORSE[c] || "")
        .filter(Boolean)
        // 3 spaces between letters
        .join("   ")
    )
    // 7 spaces between words
    .join("       ");
}

export function morseToText(code: string): string {
  const normalized = code
    .trim()
    .replace(/\/+\s*/g, "       ")
    .replace(/\s{7,}/g, "       ");

  return normalized
    .split(/\s{7}/)
    .map((word) =>
      word
        .trim()
        // Accept either 3+ spaces between letters (preferred) or single spaces.
        .split(/\s{1,6}/)
        .map((sym) => MORSE_TO_TEXT[sym.trim()] || "")
        .join("")
    )
    .join(" ");
}
