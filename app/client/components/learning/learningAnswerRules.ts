import { checkAnswer } from "~/client/components/practice/practiceEngine";
import type { Prompt } from "~/client/components/practice/PromptCard";
import { normalizeMorseForDecode, normalizeMorseForDecoding, splitMorseWords, textToMorse } from "~/client/components/shared/morseUtils";
import { normalizePlainAnswer } from "~/client/components/shared/practiceSessionUtils";
import type { ReviewItem } from "./learningReviewSchema";

export const normalizeWordText = (value: string) => normalizePlainAnswer(value).replace(/\s+/g, "");
export const normalizeWordMorse = (value: string) => normalizeMorseForDecode(value).replace(/\s+/g, "");
export function morseWithWordSlashes(text: string) {
  return splitMorseWords(textToMorse(text)).map(word => word.join("")).join("/");
}
export function canonicalizeSentenceMorse(input: string) {
  // Pasted line wrapping is spacing, not an automatic word boundary.
  const wrappedInput = (input ?? "").replace(/\r\n|\r|\n/g, " ");
  const { invalidChars } = normalizeMorseForDecoding(wrappedInput);
  const words = splitMorseWords(wrappedInput).map(word => word.join("")).filter(Boolean);
  return { value: words.join("/"), invalidChars };
}
export function checkSentenceMorseAnswer(prompt: Prompt, answer: string) {
  if (prompt.kind !== "text_to_morse") return checkAnswer(prompt, answer);
  const expected = canonicalizeSentenceMorse(morseWithWordSlashes(prompt.plain));
  const got = canonicalizeSentenceMorse(answer);
  const ok = expected.value.length > 0 && got.invalidChars.length === 0 && expected.value === got.value;
  return { ok, msg: ok ? "Correct" : "Not quite. Try again.", expected: morseWithWordSlashes(prompt.plain), got: answer, normalizedExpected: expected.value, normalizedGot: got.value };
}

export function checkReviewAnswer(item: ReviewItem, answer: string) {
  const prompt: Prompt = { kind: item.mode, plain: item.target, morse: textToMorse(item.target), label: "Review item" };
  if (item.source === "sentence") return checkSentenceMorseAnswer(prompt, answer);
  if (item.source === "practice") return checkAnswer(prompt, answer);
  const expected = item.mode === "text_to_morse" ? prompt.morse : prompt.plain;
  const normalize = item.source === "word-trainer"
    ? item.mode === "text_to_morse" ? normalizeWordMorse : normalizeWordText
    : normalizePlainAnswer;
  const normalizedExpected = normalize(expected);
  const normalizedGot = normalize(answer);
  const ok = normalizedGot.length > 0 && normalizedGot === normalizedExpected;
  return { ok, msg: ok ? "Correct" : "Not quite. Try again.", expected, got: answer, normalizedExpected, normalizedGot };
}
