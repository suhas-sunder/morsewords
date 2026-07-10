import { TEXT_TO_MORSE } from "~/client/components/shared/morseUtils";
import { buildPromptDeck } from "~/client/components/shared/practiceSessionUtils";

export const MORSE_CODE_TEST_LENGTH = 10;
export const INITIAL_MORSE_CODE_TEST_SEED = 24071;

export type MorseCodeTestDirection = "morse_to_character" | "character_to_morse";
export type MorseCodeTestCategory = "letter" | "number" | "punctuation";

export type MorseCodeTestQuestion = {
  category: MorseCodeTestCategory;
  character: string;
  direction: MorseCodeTestDirection;
  morse: string;
  id: string;
};

const TEST_CHARACTERS: Readonly<Record<MorseCodeTestCategory, readonly string[]>> = {
  letter: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  number: "0123456789".split(""),
  punctuation: [".", ",", "?", "!", "/"],
};

const CATEGORY_RUN: readonly MorseCodeTestCategory[] = [
  "letter",
  "number",
  "punctuation",
  "letter",
  "number",
  "letter",
  "punctuation",
  "number",
  "letter",
  "punctuation",
];

const DIRECTION_RUN: readonly MorseCodeTestDirection[] = [
  "morse_to_character",
  "character_to_morse",
];

export function normalizeMorseCodeTestAnswer(value: string) {
  return value.trim().toUpperCase().replace(/[\u00b7\u2022\u2219\u22c5]/g, ".").replace(/[\u2010-\u2015\u2212]/g, "-").replace(/\s+/g, "");
}

export function buildMorseCodeTestDeck(
  seed: number,
  length = MORSE_CODE_TEST_LENGTH,
): MorseCodeTestQuestion[] {
  const safeLength = Math.max(0, Math.trunc(length));
  const decks = Object.fromEntries(
    (Object.keys(TEST_CHARACTERS) as MorseCodeTestCategory[]).map((category) => [
      category,
      buildPromptDeck(TEST_CHARACTERS[category], safeLength, seed + category.length, {
        getKey: (character) => character,
      }),
    ]),
  ) as Record<MorseCodeTestCategory, string[]>;
  const offsets: Record<MorseCodeTestCategory, number> = {
    letter: 0,
    number: 0,
    punctuation: 0,
  };
  const directionDeck = buildPromptDeck(DIRECTION_RUN, safeLength, seed + 911, {
    getKey: (direction) => direction,
  });

  return Array.from({ length: safeLength }, (_, index) => {
    const category = CATEGORY_RUN[index % CATEGORY_RUN.length];
    const character = decks[category][offsets[category]++] ?? TEST_CHARACTERS[category][0];
    const direction = directionDeck[index] ?? DIRECTION_RUN[index % DIRECTION_RUN.length];
    const morse = TEXT_TO_MORSE[character];

    return {
      category,
      character,
      direction,
      morse,
      id: `${category}-${character}-${direction}-${index}`,
    };
  });
}

export function getMorseCodeTestExpectedAnswer(question: MorseCodeTestQuestion) {
  return question.direction === "morse_to_character"
    ? question.character
    : question.morse;
}

export function isMorseCodeTestAnswerCorrect(
  question: MorseCodeTestQuestion,
  answer: string,
) {
  return (
    normalizeMorseCodeTestAnswer(answer) ===
    normalizeMorseCodeTestAnswer(getMorseCodeTestExpectedAnswer(question))
  );
}
