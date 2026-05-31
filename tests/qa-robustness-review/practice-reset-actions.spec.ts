import { expect, test } from "@playwright/test";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

test.describe("practice reset actions", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
    await page.addInitScript(() => {
      const values = [0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.98];
      let randomIndex = 0;
      Math.random = () => {
        const value = values[randomIndex % values.length];
        randomIndex += 1;
        return value;
      };
      localStorage.clear();
    });
  });

  test("clear and restart preserve the active practice state contract", async ({
    page,
  }) => {
    await page.goto("/practice", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const answerInput = page.getByLabel("Practice answer");
    const clearAnswerButton = page.getByRole("button", { name: "Clear answer" });
    const restartQuizButton = page.getByRole("button", { name: "Restart quiz" });

    await expect(clearAnswerButton).toBeDisabled();
    await answerInput.fill("test answer");
    await expect(clearAnswerButton).toBeEnabled();

    await clearAnswerButton.click();
    await expect(answerInput).toHaveValue("");
    await expect(clearAnswerButton).toBeDisabled();

    await answerInput.fill("wrong");
    await expect(clearAnswerButton).toBeEnabled();
    await restartQuizButton.click();

    await expect(answerInput).toHaveValue("");
    await expect(clearAnswerButton).toBeDisabled();
    await expect(page.getByText("Not quite. Try again.")).toHaveCount(0);
    await expect(page.getByText("Attempts: 0")).toHaveCount(1);
    await expect(page.getByText("Questions: 1/10")).toHaveCount(1);
  });

  test("try again returns a completed practice run to a fresh active drill", async ({
    page,
  }) => {
    await page.goto("/practice", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const skipQuestionButton = page.getByRole("button", { name: "Skip question" });
    const quizComplete = page.getByText("Quiz complete");
    await expect(async () => {
      if (!(await quizComplete.isVisible())) {
        await expect(skipQuestionButton).toBeEnabled({ timeout: 1_000 });
        await skipQuestionButton.click();
      }
      await expect(quizComplete).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 30_000 });
    const tryAgainButton = page.getByRole("button", { name: "Try again" });
    await expect(async () => {
      if (await quizComplete.isVisible()) {
        await expect(tryAgainButton).toBeEnabled({ timeout: 1_000 });
        await tryAgainButton.click();
      }
      await expect(quizComplete).toHaveCount(0, { timeout: 1_000 });
    }).toPass({ timeout: 15_000 });

    await expect(page.getByText("Quiz complete")).toHaveCount(0);
    await expect(page.getByLabel("Practice answer")).toBeVisible();
    await expect(page.getByText("Questions: 1/10")).toHaveCount(1);
  });
});
