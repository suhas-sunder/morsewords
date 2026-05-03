import { expect, test } from "@playwright/test";
import fc from "fast-check";
import {
  morseToText,
  normalizeMorseForDecoding,
  normalizeTextForEncoding,
  textToMorse,
} from "../../app/client/components/shared/morseUtils";

const supportedText = fc
  .array(fc.constantFrom(...("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ".split(""))), {
    minLength: 0,
    maxLength: 80,
  })
  .map((chars) => chars.join(""));

test("supported letters/numbers round-trip through Morse", () => {
  fc.assert(
    fc.property(supportedText, (input) => {
      const normalized = normalizeTextForEncoding(input);
      const expected = normalized.replace(/\s+/g, " ").trim();
      const morse = textToMorse(input);
      expect(morseToText(morse)).toBe(expected);
    }),
    { numRuns: 500, seed: 20260503 },
  );
});

test("arbitrary pasted Morse-like input never throws while normalizing or decoding", () => {
  fc.assert(
    fc.property(fc.string({ minLength: 0, maxLength: 200 }), (input) => {
      expect(() => normalizeMorseForDecoding(input)).not.toThrow();
      expect(() => morseToText(input)).not.toThrow();
    }),
    { numRuns: 500, seed: 20260504 },
  );
});

test("smart punctuation normalizes to ASCII before encoding", () => {
  expect(normalizeTextForEncoding("“SOS” — ‘HELP’")).toBe('"SOS" - \'HELP\'');
});
