import { expect, test } from "@playwright/test";
import fc from "fast-check";
import { decodeTypingRaw } from "../../app/client/components/typing/typingEngine";
import {
  countDecodedWords,
  formatMorseWords,
  morseToText,
  normalizeMorseForDecode,
  normalizeMorseForDecoding,
  normalizeTextForEncoding,
  splitMorseWords,
  SUPPORTED_TEXT_CHARACTERS,
  textToMorse,
} from "../../app/client/components/shared/morseUtils";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const supportedText = fc
  .array(fc.constantFrom(...SUPPORTED_TEXT_CHARACTERS, " "), {
    minLength: 0,
    maxLength: 80,
  })
  .map((chars) => chars.join(""));

test("supported text round-trips through Morse", () => {
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

test("smart punctuation and pasted Morse lookalikes normalize to ASCII", () => {
  expect(normalizeTextForEncoding("\u201cSOS\u201d \u2014 \u2018HELP\u2019")).toBe(
    '"SOS" - \'HELP\'',
  );
  expect(normalizeMorseForDecode("\u2022\u00b7\u2219 / \u2013\u2014\u2212")).toBe(
    "...       ---",
  );
  expect(morseToText("\u2022\u00b7\u2219 / \u2013\u2014\u2212")).toBe("S O");
});

test("word boundaries are consistent across slash, pipe, newline, and seven spaces", () => {
  const expectedWords = [["..."], ["....", ".", ".-..", ".--."]];

  expect(splitMorseWords("... / .... . .-.. .--.")).toEqual(expectedWords);
  expect(splitMorseWords("... | .... . .-.. .--.")).toEqual(expectedWords);
  expect(splitMorseWords("...\n.... . .-.. .--.")).toEqual(expectedWords);
  expect(splitMorseWords("...       .... . .-.. .--.")).toEqual(expectedWords);
  expect(splitMorseWords("/// ... / / | .... ///")).toEqual([
    ["..."],
    ["...."],
  ]);
  expect(countDecodedWords("/// ... / / | .... ///")).toBe(2);
});

test("single and three spaces are letter gaps, while seven spaces are word gaps", () => {
  expect(morseToText(". -")).toBe("ET");
  expect(morseToText(".   -")).toBe("ET");
  expect(morseToText(".       -")).toBe("E T");
  expect(formatMorseWords(splitMorseWords("... / ---"), {
    wordSeparator: " | ",
  })).toBe("... | ---");
});

test("unsupported text and invalid Morse are reported without breaking legacy string callers", () => {
  const encoded = textToMorse("hi \u{1f4a1}", { returnResult: true });
  expect(encoded.value).toBe("....   ..");
  expect(encoded.unsupportedCounts?.["\u{1f4a1}"]).toBe(1);
  expect(encoded.issues).toContainEqual(
    expect.objectContaining({ type: "unsupported-text-character" }),
  );

  expect(morseToText("... x ---")).toBe("SO");
  expect(morseToText("........")).toBe("?");
  expect(morseToText("........", { unknownToken: "omit" })).toBe("");

  const strict = morseToText("... x ---", {
    mode: "strict",
    returnResult: true,
  });
  expect(strict.value).toBe("?");
  expect(strict.invalidChars).toEqual(["x"]);
  expect(strict.issues).toContainEqual(
    expect.objectContaining({ type: "invalid-morse-character", value: "x" }),
  );
});

test("typing scratchpad counts decoded words from text, not repeated separators", () => {
  const decoded = decodeTypingRaw("... / / --- /// ... ");

  expect(decoded.decoded).toBe("S O S");
  expect(decoded.wordsDecoded).toBe(3);
  expect(decoded.lettersDecoded).toBe(3);
  expect(decoded.currentSymbol).toBe("");
});

test("reader and word separator routes use shared repeated-separator behavior", async ({
  page,
}) => {
  await blockExternalNetwork(page);

  await page.goto("/morse-code-reader", { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  const readerInput = page.getByLabel("Morse code input");
  await expect(async () => {
    await readerInput.fill("... /// //// --- ||| ...");
    await expect(readerInput).toHaveValue("... /// //// --- ||| ...");
    await expect(page.getByLabel("Decoded text output")).toHaveText("S O S", {
      timeout: 1_000,
    });
    await expect(page.getByLabel("Normalized Morse output")).toHaveText(
      "... / --- / ...",
      { timeout: 1_000 },
    );
  }).toPass({ timeout: 15_000 });

  await page.goto("/morse-code-word-separator", {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  const separatorInput = page.getByLabel("Paste Morse");
  await expect(async () => {
    await separatorInput.fill("... /// //// --- ||| ...");
    await expect(separatorInput).toHaveValue("... /// //// --- ||| ...");
    await expect(page.getByText("Words: 3 | Letters: 3")).toBeVisible({
      timeout: 1_000,
    });
    await expect(page.locator("pre").first()).toHaveText("...       ---       ...", {
      timeout: 1_000,
    });
  }).toPass({ timeout: 15_000 });
});
