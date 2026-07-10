import { expect, test } from "@playwright/test";

import { textToMorse } from "../../app/client/components/shared/morseUtils";
import { PHRASE_PAGES } from "../../app/client/data/morseContent";

test("keeps HI phrase content aligned with its canonical computed Morse value", () => {
  const content = PHRASE_PAGES["hi-in-morse-code"];
  const expectedMorse = textToMorse("HI");

  expect(expectedMorse.replace(/\s+/g, " ")).toBe(".... ..");
  expect(content.morseValue).toBe(expectedMorse);
  expect(content.answerSummary).toContain(expectedMorse);
  expect(content.context.find((item) => item.title === "Keep H and I separate")?.text).toContain(
    expectedMorse,
  );
  expect(content.faqItems.find((item) => item.q === "What is HI in Morse code?")?.a).toContain(
    expectedMorse,
  );
  expect(content.examples.find((item) => item.text === "HI")?.morse).toBe(
    expectedMorse,
  );
});
