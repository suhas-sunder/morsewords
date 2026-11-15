import { expect, test, type Page } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";
import { getAudioPrompts } from "../../app/client/components/audioPractice/audioPromptBank";
import { REVIEW_STORAGE_KEY, serializeReviewQueue } from "../../app/client/components/learning/learningReviewSchema";

test.beforeEach(async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
});

for (const width of [390, 768, 1440]) test(`practice ends early with only actual progress at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(() => {
    Math.random = () => .55;
    localStorage.setItem("mw_practice_pool", "starter");
    localStorage.setItem("mw_practice_mode_starter", "text_to_morse");
  });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/practice", { waitUntil: "networkidle" });
  await page.getByLabel("Practice answer").fill("..");
  await page.getByLabel("Practice answer").press("Enter");
  await page.getByRole("button", { name: "Finish session early", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your results", exact: true })).toBeFocused();
  await expect(page.getByText("Session ended early", { exact: true })).toBeVisible();
  await expect(page.getByText(/1 of 10 prompts finished: 1 solved, 0 skipped/)).toBeVisible();
  await expect(page.getByText(/9 unfinished/)).toBeVisible();
  await page.screenshot({ path: info.outputPath(`w21-practice-summary-${width}.png`) });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page.getByRole("button", { name: "Skip question", exact: true }).click();
  await page.getByRole("button", { name: "Finish session early", exact: true }).click();
  await expect(page.getByText(/1 of 10 prompts finished: 0 solved, 1 skipped/)).toBeVisible();
  expect(errors).toEqual([]);
});

test("full practice round preserves ten prompts and rapid correct submission counts once", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .55; localStorage.setItem("mw_practice_pool", "starter"); localStorage.setItem("mw_practice_mode_starter", "text_to_morse"); });
  await page.goto("/practice", { waitUntil: "networkidle" });
  await page.getByLabel("Practice answer").fill("..");
  await page.getByRole("button", { name: "Check answer", exact: true }).evaluate(button => { (button as HTMLButtonElement).click(); (button as HTMLButtonElement).click(); });
  await page.getByRole("button", { name: "Next prompt", exact: true }).click();
  for (let i = 0; i < 9; i++) await page.getByRole("button", { name: "Skip question", exact: true }).click();
  await expect(page.getByText("Quiz complete", { exact: true })).toBeVisible();
  await expect(page.getByText(/10 of 10 prompts finished: 1 solved, 9 skipped/)).toBeVisible();
  await expect(page.getByText(/0 unfinished/)).toBeVisible();
});

for (const route of ["/practice", "/morse-code-sentence-practice"]) test(`${route} early finish includes a checked but unsolved target`, async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  const sentence = route.includes("sentence");
  await page.getByLabel(sentence ? "Sentence practice answer" : "Practice answer", { exact: true }).fill("WRONG");
  await page.getByRole("button", { name: sentence ? "Check sentence" : "Check answer", exact: true }).click();
  await page.getByRole("button", { name: sentence ? "Finish sentence session early" : "Finish session early", exact: true }).click();
  await expect(page.getByText(sentence ? /1 of 8 sentences finished; 7 unfinished/ : /1 of 10 prompts finished: 0 solved, 1 skipped/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Review missed items when you are ready" })).toBeVisible();
});

test("sentence completion preserves the eight-prompt goal and counts skips separately", async ({ page }, info) => {
  await page.goto("/morse-code-sentence-practice", { waitUntil: "networkidle" });
  await page.getByLabel("Sentence practice answer").fill("WRONG");
  await page.getByRole("button", { name: "Check sentence", exact: true }).click();
  await page.getByRole("button", { name: /Skip sentence/ }).click();
  await page.getByRole("button", { name: "Finish sentence session early" }).click();
  await expect(page.getByRole("heading", { name: "Your sentence practice results" })).toBeFocused();
  await expect(page.getByText(/1 of 8 sentences finished; 7 unfinished/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Review missed items when you are ready" })).toBeVisible();
  await page.screenshot({ path: info.outputPath("w21-sentence-summary.png") });
  await page.getByRole("button", { name: "Restart sentence drill" }).click();
  await page.getByRole("button", { name: "Finish sentence session early" }).click();
  await expect(page.getByText(/0 of 8 sentences finished; 8 unfinished/)).toBeVisible();
});

test("listening credit cannot be inflated by editing, checking or replaying a solved target", async ({ page }, info) => {
  await page.addInitScript(() => { Math.random = () => 0; localStorage.setItem("mw_audio_practice_difficulty", "easy"); });
  await page.goto("/morse-code-audio-practice", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start 10-prompt session", exact: true }).click();
  const expected = getAudioPrompts("easy").filter(item => item.text !== getAudioPrompts("easy")[0].text)[0].text;
  await page.getByLabel("Your answer", { exact: true }).fill(expected);
  await page.getByRole("button", { name: /Check answer/ }).click();
  await expect(page.getByText("Correct. Move to the next hidden prompt when ready.", { exact: true })).toBeVisible();
  await page.getByLabel("Your answer", { exact: true }).fill(expected.toLowerCase());
  await expect(page.getByRole("button", { name: /Check answer/ })).toBeDisabled();
  if (await page.evaluate(() => Boolean(window.AudioContext))) {
    await page.getByRole("button", { name: "Repeat", exact: true }).click();
    await page.getByRole("button", { name: /^Play prompt/ }).click();
    await expect(page.getByRole("button", { name: /Restart prompt/ })).toBeVisible();
    await page.getByRole("button", { name: /Stop audio Stop/ }).click();
  }
  await page.getByRole("button", { name: "Finish listening session", exact: true }).click();
  const result = page.getByRole("region", { name: "Listening session results" });
  await expect(result).toContainText("1 of 10 prompts finished: 1 solved, 0 skipped. 1 answer check.");
  await expect(result).toContainText("9 planned prompts unfinished");
  await expect(result.getByRole("heading")).toBeFocused();
  await expect(page.getByRole("button", { name: /^Play prompt/ })).toBeDisabled();
  await page.screenshot({ path: info.outputPath("w21-listening-summary.png") });
  await page.getByRole("button", { name: "Restart listening session", exact: true }).click();
  await page.getByRole("button", { name: "Finish listening session", exact: true }).click();
  await expect(result).toContainText("0 of 10 prompts finished: 0 solved, 0 skipped. 0 answer checks.");
});

test("ten listening skips end the round and open-ended practice remains available", async ({ page }) => {
  await page.goto("/morse-code-audio-practice", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start 10-prompt session", exact: true }).click();
  for (let i = 0; i < 10; i++) await page.getByRole("button", { name: "Skip", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Listening session complete" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Listening session results" })).toContainText("10 of 10 prompts finished: 0 solved, 10 skipped");
  await page.getByRole("button", { name: "Start open-ended practice" }).click();
  await expect(page.getByRole("region", { name: "Listening session results" })).toHaveCount(0);
  for (let i = 0; i < 11; i++) await page.getByRole("button", { name: "Skip", exact: true }).click();
  await expect(page.getByRole("region", { name: "Listening session results" })).toHaveCount(0);
  await page.getByRole("button", { name: "Finish listening session", exact: true }).click();
  await expect(page.getByRole("region", { name: "Listening session results" })).toContainText("11 prompts finished: 0 solved, 11 skipped");
});

async function advanceClock(page: Page, ms: number) {
  await page.evaluate(ms => { (window as unknown as { testTime: number }).testTime += ms; }, ms);
}
async function changeVisibility(page: Page, hidden: boolean) {
  await page.evaluate(hidden => { Object.defineProperty(document, "hidden", { configurable: true, value: hidden }); document.dispatchEvent(new Event("visibilitychange")); }, hidden);
}

for (const width of [390, 768, 1440]) test(`typing excludes hidden time and ends early truthfully at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(() => { const clock = window as unknown as { testTime: number }; clock.testTime = 1_000_000; Date.now = () => clock.testTime; localStorage.setItem("mw_typing_duration_sec", "30"); });
  await page.goto("/typing", { waitUntil: "networkidle" });
  await page.getByLabel("Morse typing input").fill("... ");
  await advanceClock(page, 4000);
  await expect(page.getByText("00:26", { exact: true })).toBeVisible();
  await changeVisibility(page, true);
  await expect(page.getByRole("button", { name: "Resume session", exact: true })).toBeEnabled();
  await advanceClock(page, 60_000);
  await changeVisibility(page, false);
  await expect(page.getByText("00:26", { exact: true })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Hidden time is not counted" })).toBeVisible();
  await page.getByRole("button", { name: "Resume session", exact: true }).click();
  await advanceClock(page, 6000);
  await expect(page.getByText("00:20", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Finish typing session early", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Session ended early", exact: true });
  await expect(dialog).toContainText("Active time: 00:10 of 00:30 planned");
  await expect(dialog.getByRole("button", { name: "Close results" })).toBeFocused();
  expect(await dialog.locator(".mw-surface").evaluate(element => getComputedStyle(element).backgroundColor)).toMatch(/^rgb\(/);
  expect(await page.getByLabel("Morse typing input").evaluate(element => Boolean(element.closest("[inert]")))).toBe(true);
  await page.screenshot({ path: info.outputPath(`w21-typing-summary-${width}.png`) });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel("Morse typing input")).toBeFocused();
  expect(await page.getByLabel("Morse typing input").evaluate(element => Boolean(element.closest("[inert]")))).toBe(false);
  await page.getByRole("button", { name: "Reset session", exact: true }).click();
  await expect(page.getByLabel("Morse typing input")).toHaveValue("");
  await expect(page.getByRole("button", { name: "Finish typing session early", exact: true })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("review finish distinguishes skipped and unfinished targets", async ({ page }) => {
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), { key: REVIEW_STORAGE_KEY, raw: serializeReviewQueue([
    { source: "practice", mode: "text_to_morse", target: "I", misses: 1, private: false },
    { source: "practice", mode: "text_to_morse", target: "T", misses: 1, private: false },
  ]) });
  await page.goto("/practice#review-queue", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start review", exact: true }).click();
  await page.getByRole("button", { name: "Finish review early", exact: true }).click();
  await expect(page.getByRole("region", { name: "Review session results" })).toContainText("0 of 2 targets finished: 0 solved, 0 skipped without a correct answer. 2 unfinished.");
  await page.getByRole("button", { name: "Start review", exact: true }).click();
  await page.getByRole("button", { name: "Next review item", exact: true }).click();
  await page.getByLabel("Review answer", { exact: true }).fill("-");
  await page.getByRole("button", { name: "Check review answer" }).click();
  await page.getByRole("button", { name: "Finish review", exact: true }).click();
  await expect(page.getByRole("region", { name: "Review session results" })).toContainText("2 of 2 targets finished: 1 solved, 1 skipped without a correct answer. 0 unfinished.");
  await expect(page.getByRole("heading", { name: "Review session finished" })).toBeFocused();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items.length, REVIEW_STORAGE_KEY)).toBe(2);
});

test("typing duration change starts fresh and a full timer ends with the actual duration", async ({ page }) => {
  await page.addInitScript(() => { const clock = window as unknown as { testTime: number }; clock.testTime = 1_000_000; Date.now = () => clock.testTime; });
  await page.goto("/typing", { waitUntil: "networkidle" });
  await page.getByLabel("Morse typing input").fill("... ");
  await advanceClock(page, 3000);
  await page.getByRole("button", { name: "Pause session", exact: true }).click();
  await page.getByRole("button", { name: "Set session duration to 10s", exact: true }).click();
  await expect(page.getByLabel("Morse typing input")).toHaveValue("");
  await expect(page.getByRole("button", { name: "Resume session", exact: true })).toHaveCount(0);
  await page.getByLabel("Morse typing input").fill(". ");
  await advanceClock(page, 10_000);
  const dialog = page.getByRole("dialog", { name: "Session complete", exact: true });
  await expect(dialog).toContainText("Active time: 00:10 of 00:10 planned");
  await page.getByRole("button", { name: "Close results", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByLabel("Morse typing input")).toHaveValue("");
  expect(await page.evaluate(() => localStorage.getItem("mw_typing_duration_sec"))).toBe("10");
  await expect(page.getByRole("button", { name: "Finish typing session early", exact: true })).toBeDisabled();
});

test("hiding at the typing deadline finishes instead of leaving a zero-time paused run", async ({ page }) => {
  await page.addInitScript(() => { const clock = window as unknown as { testTime: number }; clock.testTime = 1_000_000; Date.now = () => clock.testTime; localStorage.setItem("mw_typing_duration_sec", "10"); });
  await page.goto("/typing", { waitUntil: "networkidle" });
  await page.getByLabel("Morse typing input").fill(". ");
  await page.evaluate(() => {
    (window as unknown as { testTime: number }).testTime += 10_000;
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("dialog", { name: "Session complete", exact: true })).toContainText("Active time: 00:10 of 00:10 planned");
  await changeVisibility(page, false);
  await page.getByRole("button", { name: "Close results", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resume session", exact: true })).toHaveCount(0);
});
