import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

test.beforeEach(async ({ page }) => {
  await blockExternalNetwork(page);
  await page.goto("/morse-code-word-separator");
  await expect(page.locator('[data-mw-word-separator-ready="true"]')).toBeVisible();
});

test("word separators share the canonical parser and preserve formatted output", async ({ page }) => {
  await expect(page.getByRole("button", { name: "7-space text notation", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("MorseWords text spacing", { exact: true })).toBeVisible();
  await expect(page.getByText(/In transmitted Morse, the standard silence/)).toContainText("three dot units; between words it is seven dot units");
  const errors = collectConsoleErrors(page);
  const analysis = page.getByRole("region", { name: "What your spacing means" });
  for (const separator of [" / ", " | ", "\n", "       "]) {
    await page.getByRole("textbox", { name: "Paste Morse" }).fill(`... --- ...${separator}.... . .-.. .--.`);
    await expect(analysis.getByRole("status")).toHaveText("2 words · 7 groups · 0 unknown groups · 0 ignored characters");
    await expect(analysis.getByRole("row", { name: /1 .*SOS/ })).toBeVisible();
    await expect(analysis.getByRole("row", { name: /2 .*HELP/ })).toBeVisible();
    await expect(page.locator("pre").first()).toHaveText("... --- ...       .... . .-.. .--.");
  }
  await page.getByRole("button", { name: "|", exact: true }).click();
  await expect(page.locator("pre").first()).toHaveText("... --- ... | .... . .-.. .--.");
  expect((await new AxeBuilder({ page }).include('[aria-labelledby="spacing-analysis-title"]').analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("unknown patterns and discarded characters are explained without guessing missing gaps", async ({ page }) => {
  const analysis = page.getByRole("region", { name: "What your spacing means" });
  await page.getByRole("textbox", { name: "Paste Morse" }).fill(".x- / ........");
  await expect(analysis.getByRole("status")).toHaveText("2 words · 2 groups · 1 unknown group · 1 ignored character");
  await expect(analysis).toContainText('Ignored input characters: "x"');
  await expect(page.locator("pre").first()).toHaveText(".-       ........");
  await analysis.getByRole("button", { name: "Missing letter gaps" }).click();
  await expect(analysis.getByRole("status")).toContainText("1 word · 1 group · 1 unknown group");
  await expect(page.locator("pre").first()).toHaveText("...---...");
  await expect(analysis).toContainText("intentional distress signal");
  await analysis.getByRole("button", { name: "Well-spaced SOS HELP" }).click();
  await expect(analysis.getByRole("status")).toContainText("0 unknown groups");
  await page.getByRole("textbox", { name: "Paste Morse" }).fill("");
  await expect(analysis).toContainText("Paste some dots and dashes");
  await expect(page.getByRole("button", { name: "Copy output" })).toBeDisabled();
});

test("long-input table is bounded while counts and original output stay complete", async ({ page }) => {
  const value = Array.from({ length: 100 }, () => "... --- ...").join(" / ");
  await page.getByRole("textbox", { name: "Paste Morse" }).fill(value);
  const analysis = page.getByRole("region", { name: "What your spacing means" });
  await expect(analysis.getByRole("status")).toContainText("100 words · 300 groups");
  await expect(analysis.getByRole("row")).toHaveCount(13);
  await expect(analysis).toContainText("counts and copied output include the full input");
  expect((await page.locator("pre").first().textContent())?.split("       ")).toHaveLength(100);
  await page.getByRole("textbox", { name: "Paste Morse" }).fill(".".repeat(2000));
  expect((await analysis.locator("tbody").textContent())!.length).toBeLessThan(260);
  expect((await page.locator("pre").first().textContent())!.length).toBe(2000);
  await page.getByRole("button", { name: "English to Morse", exact: true }).click();
  await expect(analysis).toHaveCount(0);
  await page.getByRole("textbox", { name: "English input" }).fill("SOS HELP");
  await expect(page.locator("pre").first()).toHaveText("... --- ...       .... . .-.. .--.");
});
