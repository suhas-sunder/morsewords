export {
  countDecodedWords,
  countTextWords,
  formatMorseWords,
  getUnsupportedTextCharacters,
  MORSE_LETTER_GAP,
  MORSE_TO_TEXT,
  MORSE_WORD_GAP,
  morseToText,
  normalizeMorseForDecode,
  normalizeMorseForDecoding,
  normalizeTextForEncoding,
  normalizeTextForMorse,
  splitMorseWords,
  SUPPORTED_MORSE_SYMBOLS,
  SUPPORTED_TEXT_CHARACTERS,
  TEXT_TO_MORSE,
  textToMorse,
} from "./morseUtils";

export type {
  MorseNormalizeResult,
  MorseNormalizeOptions,
  MorseTextIssue,
  MorseTextResult,
  MorseToTextOptions,
  TextToMorseOptions,
} from "./morseUtils";
