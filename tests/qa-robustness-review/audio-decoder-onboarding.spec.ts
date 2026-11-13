import { expect, test } from "@playwright/test";
import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

test.beforeEach(async ({ page }) => { await blockExternalNetwork(page); });

test("sample uses the real WAV detector, preview is opt-in and clear revokes it", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.goto("/morse-code-audio-decoder");
  await expect(page.locator('[data-mw-audio-decoder-ready="true"]')).toBeVisible();
  await page.getByRole("button", { name: "Try a clean sample", exact: true }).click();
  const preview = page.locator("audio");
  await expect(preview).toHaveAttribute("src", /^blob:/);
  await expect(page.locator('[aria-label="Decoded text output"]')).toHaveText("Decoded text will appear here.");
  expect(await preview.evaluate((audio: HTMLAudioElement) => audio.paused && !audio.autoplay)).toBe(true);
  await page.getByRole("button", { name: "Decode audio", exact: true }).click();
  await expect(page.locator('[aria-label="Decoded text output"]')).toHaveText("SOS HELP");
  await expect(page.locator('[aria-label="Raw Morse output"]')).toHaveText("... --- ... / .... . .-.. .--.");
  await expect(page.getByRole("button", { name: "Download text", exact: true })).toBeEnabled();
  const oldUrl = await preview.getAttribute("src");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(preview).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Download text", exact: true })).toBeDisabled();
  expect(await page.evaluate(async (url) => { try { await fetch(url!); return false; } catch { return true; } }, oldUrl)).toBe(true);
  expect(errors.filter((entry) => !entry.text.includes("ERR_FILE_NOT_FOUND"))).toEqual([]);
});

test("clear cancels a sample still waiting for its renderer", async ({ page }) => {
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/export/morseAudioExport.ts*", async (route) => { await waiting; await route.continue(); });
  await page.goto("/morse-code-audio-decoder");
  await expect(page.locator('[data-mw-audio-decoder-ready="true"]')).toBeVisible();
  await page.getByRole("button", { name: "Try a clean sample", exact: true }).click();
  await expect(page.getByRole("button", { name: "Preparing sample...", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  release();
  await expect(page.getByRole("button", { name: "Try a clean sample", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Decode audio", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Choose an audio file");
  await expect(page.locator("audio")).toHaveCount(0);
});
