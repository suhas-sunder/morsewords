import { installAbsentPcmWavDecoder } from "./pcm-wav-test-boundary";
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
  expect(errors).toEqual([]);
  // Fetching a deliberately revoked blob logs a browser error, with different
  // wording in Chromium and WebKit. Assert application errors before this probe.
  expect(await page.evaluate(async (url) => { try { await fetch(url!); return false; } catch { return true; } }, oldUrl)).toBe(true);
});

test("clear cancels a sample still waiting for its renderer", async ({ page }) => {
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => { release = resolve; });
  let rendererBlocked = false;
  await page.route(/\/(?:export\/morseAudioExport\.ts|assets\/morseAudioExport-[^/]+\.js)(?:\?|$)/, async (route) => { rendererBlocked = true; await waiting; await route.continue(); });
  await page.goto("/morse-code-audio-decoder");
  await expect(page.locator('[data-mw-audio-decoder-ready="true"]')).toBeVisible();
  await page.getByRole("button", { name: "Try a clean sample", exact: true }).click();
  await expect.poll(() => rendererBlocked).toBe(true);
  await expect(page.getByRole("button", { name: "Preparing sample...", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  release();
  await expect(page.getByRole("button", { name: "Try a clean sample", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Decode audio", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Choose an audio file");
  await expect(page.locator("audio")).toHaveCount(0);
});

// Same absent-API boundary used by signal inspection; Chromium remains native.
test.beforeEach(async ({ page, browserName }) => {
  if (browserName === "webkit") await installAbsentPcmWavDecoder(page);
});


test("missing native audio API explains the limitation and still allows clearing", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "AudioContext", { value: undefined, configurable: true });
    Object.defineProperty(window, "webkitAudioContext", { value: undefined, configurable: true });
  });
  await page.goto("/morse-code-audio-decoder");
  await expect(page.locator('[data-mw-audio-decoder-ready="true"]')).toBeVisible();
  await page.getByRole("button", { name: "Try a clean sample", exact: true }).click();
  await expect(page.locator("audio")).toHaveAttribute("src", /^blob:/);
  await page.getByRole("button", { name: "Decode audio", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("This browser does not expose the Web Audio API needed to decode files.");
  await expect(page.getByLabel("Decoded text output")).toHaveText("Decoded text will appear here.");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.locator("audio")).toHaveCount(0);
  await expect(page.getByRole("alert")).toHaveCount(0);
});
