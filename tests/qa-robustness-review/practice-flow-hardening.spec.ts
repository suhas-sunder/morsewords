import { expect, test } from "@playwright/test";

import {
  buildVisualQuizPromptDeck,
  VISUAL_QUIZ_PROMPTS,
} from "../../app/routes/morse-code-visual-quiz";
import {
  buildPromptDeck,
  normalizePlainAnswer,
} from "../../app/client/components/shared/practiceSessionUtils";
import {
  audioPromptBank,
  buildPromptDeck as buildAudioPromptDeck,
  normalizeAudioAnswer,
} from "../../app/client/components/audioPractice/audioPromptBank";
import { blockExternalNetwork } from "./helpers";

test.describe("shared practice session helpers", () => {
  test("visual quiz prompt decks are shuffled without mutating the prompt bank", () => {
    const sourceBefore = [...VISUAL_QUIZ_PROMPTS];
    const deck = buildVisualQuizPromptDeck(20260530);

    expect(deck).toHaveLength(10);
    expect(deck).not.toEqual(VISUAL_QUIZ_PROMPTS);
    expect(VISUAL_QUIZ_PROMPTS).toEqual(sourceBefore);
    expect(new Set(deck).size).toBe(deck.length);

    for (let index = 1; index < deck.length; index += 1) {
      expect(deck[index]).not.toBe(deck[index - 1]);
    }
  });

  test("prompt decks avoid immediate repeats across reshuffled cycles", () => {
    const deck = buildPromptDeck(["A", "B"], 8, 17);

    expect(deck).toHaveLength(8);
    for (let index = 1; index < deck.length; index += 1) {
      expect(deck[index]).not.toBe(deck[index - 1]);
    }
  });

  test("plain answer normalization is shared across quiz answer checks", () => {
    expect(normalizePlainAnswer("  copy,   that!  ")).toBe("COPY THAT");
    expect(normalizeAudioAnswer("copy---that")).toBe("COPY THAT");
  });

  test("audio prompt decks fall back safely for empty prompt pools", () => {
    const deck = buildAudioPromptDeck([], 3, Number.NaN);

    expect(deck).toHaveLength(3);
    expect(deck.every((prompt) => audioPromptBank.includes(prompt))).toBe(true);
  });
});

test.describe("practice and quiz route hardening", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("visual quiz treats whitespace answers as blank and restarts cleanly", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/morse-code-visual-quiz", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    const answer = page.getByLabel("Your answer");
    const checkAnswer = page.getByRole("button", { name: "Check answer" });

    await expect(page.getByRole("button", { name: "Flash prompt" })).toBeEnabled();
    await expect(checkAnswer).toBeDisabled();
    await answer.fill("   ");
    await expect(checkAnswer).toBeDisabled();

    const skipPrompt = page.getByRole("button", { name: "Skip prompt" });
    for (let index = 0; index < 10; index += 1) {
      await skipPrompt.click();
    }

    await expect(page.getByText("Visual quiz results")).toBeVisible();
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByText("Visual quiz results")).toHaveCount(0);
    await expect(page.getByText(/Question\s+1\/10/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Check answer" })).toBeDisabled();
  });

  test("visual practice keeps the flash control available for the existing blank-message flow", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/morse-code-visual-practice", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    const flashMessage = page.getByRole("button", { name: "Flash message" });
    await expect(flashMessage).toBeEnabled();
    await page.getByRole("textbox", { name: "Message" }).fill("");
    await expect(flashMessage).toBeEnabled();
  });

  test("audio quiz does not double-count a repeated submit event", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("mw_audio_quiz_difficulty", "beginner");
    });
    await page.goto("/morse-code-audio-quiz", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await page.getByLabel("Your answer").fill("not the prompt");
    await page.evaluate(() => {
      const button = [...document.querySelectorAll("button")].find((candidate) =>
        candidate.textContent?.includes("Check answer"),
      );
      button?.click();
      button?.click();
    });

    await expect(page.getByText("Not quite. Review the answer, then continue.")).toBeVisible();
    await expect(page.locator("body")).toContainText(/Attempts\s*1/);
  });

  test("word trainer does not double-count the same incorrect answer", async ({
    page,
  }) => {
    await page.goto("/morse-code-word-trainer", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await page.getByLabel("Your answer").fill("wrong answer");
    await page.evaluate(() => {
      const button = [...document.querySelectorAll("button")].find((candidate) =>
        candidate.textContent?.includes("Check answer"),
      );
      button?.click();
      button?.click();
    });

    await expect(page.getByText(/Not quite\. Expected:/)).toBeVisible();
    await expect(page.locator("body")).toContainText(/Attempts\s*1/);
  });
});
