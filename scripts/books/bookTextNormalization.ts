import {
  getUnsupportedTextCharacters,
  textToMorse,
} from "../../app/client/components/shared/morseUtils.ts";

export function normalizeBookText(input: string): string {
  return input
    .replace(/^\uFEFF/, "")
    .replace(/\r\n|\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n");
}

export function trimBookText(input: string): string {
  return normalizeBookText(input).replace(/^\s+|\s+$/g, "");
}

export function countBookWords(input: string): number {
  const matches = input.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g);
  return matches?.length ?? 0;
}

export function estimateMorseCharacters(input: string): number {
  const morse = textToMorse(input, { unsupportedText: "omit" });
  return morse.length;
}

export function summarizeUnsupportedCharacters(
  input: string,
): Record<string, number> {
  return getUnsupportedTextCharacters(input);
}

export function textPreview(input: string, length = 160): string {
  const compact = input.replace(/\s+/g, " ").trim();
  if (compact.length <= length) return compact;
  return `${compact.slice(0, length - 1).trimEnd()}...`;
}

export function splitParagraphs(input: string): string[] {
  return trimBookText(input)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}
