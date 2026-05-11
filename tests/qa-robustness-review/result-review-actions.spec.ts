import { expect, test } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";

test.describe("result review actions", () => {
  test("word trainer weak-word copy and clear controls preserve review behavior", async ({
    page,
  }) => {
    await blockExternalNetwork(page);
    await page.goto("/morse-code-word-trainer", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: new URL(page.url()).origin,
    });

    await page.getByLabel("Your answer").fill("wrong");

    const checkAnswerButton = page.locator('button:has-text("Check answer")');
    await expect(checkAnswerButton).toHaveCount(1);
    await expect(checkAnswerButton).toBeEnabled();
    await checkAnswerButton.click();

    await expect(page.locator('button:has-text("DIT")')).toHaveCount(1);

    const copyWeakWordsButton = page.locator('button:has-text("Copy weak words")');
    await expect(copyWeakWordsButton).toHaveCount(1);
    await copyWeakWordsButton.click();

    await expect(page.getByText("Weak words copied.")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("DIT");

    const clearWeakWordsButton = page.locator('button:has-text("Clear weak words")');
    await expect(clearWeakWordsButton).toHaveCount(1);
    await clearWeakWordsButton.click();

    await expect(
      page.getByText("Missed answers and marked prompts collect here."),
    ).toBeVisible();
    await expect(copyWeakWordsButton).toHaveCount(0);
  });
});
