import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blockExternalNetwork } from "./helpers";
import { morseToText, textToMorse } from "../../app/client/components/shared/morseUtils";
import { REVIEW_STORAGE_KEY, serializeReviewQueue } from "../../app/client/components/learning/learningReviewSchema";

test.beforeEach(async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => {
    localStorage.setItem("morsewords-theme", theme);
    Object.assign(window, { reviewFlashes: 0 });
    window.addEventListener("morsewords:flash", () => (window as unknown as { reviewFlashes: number }).reviewFlashes++);
  }, info.project.name.endsWith("dark") ? "dark" : "light");
});
const flashes = (page: Page) => page.evaluate(() => (window as unknown as { reviewFlashes: number }).reviewFlashes);

for (const width of [390, 768, 1440]) for (const kind of ["practice", "quiz"] as const) test(`static visual ${kind} is usable with reduced motion at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  const requests: string[] = []; page.on("request", request => requests.push(request.url() + (request.postData() ?? "")));
  await page.goto(`/morse-code-visual-${kind}`, { waitUntil: "networkidle" });
  const pattern = page.getByLabel("Static Morse pattern", { exact: true });
  await expect(pattern).toBeVisible();
  expect(await flashes(page)).toBe(0);
  if (kind === "practice") {
    await page.getByLabel("Message", { exact: true }).fill("PRIVATE PRACTICE WORD");
    await expect(pattern).toHaveText(textToMorse("PRIVATE PRACTICE WORD"));
    expect(requests.join("\n")).not.toMatch(/PRIVATE[ %]PRACTICE/);
  } else {
    const answer = morseToText((await pattern.textContent()) ?? "").trim();
    await page.getByLabel("Your answer", { exact: true }).fill("WRONG");
    await page.getByRole("button", { name: /Check answer/ }).click();
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items[0].target, REVIEW_STORAGE_KEY)).toBe(answer);
    await page.getByLabel("Your answer", { exact: true }).fill(answer);
    await page.getByLabel("Your answer", { exact: true }).press("Enter");
    await expect(page.getByText("Correct.", { exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: "Hide static pattern", exact: true }).scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: info.outputPath(`w23-static-${kind}-${width}.png`) });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (width === 390) expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
  expect(await flashes(page)).toBe(0);
  expect(errors).toEqual([]);
});

test("static quiz completes the same ten prompts and preserves saved bests through hydration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => { if (!localStorage.getItem("quiz-seeded")) { localStorage.setItem("quiz-seeded", "1"); localStorage.setItem("mw_visual_quiz_best_streak", "7"); } });
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/morse-code-visual-quiz", { waitUntil: "networkidle" });
  expect(await page.evaluate(() => localStorage.getItem("mw_visual_quiz_best_streak"))).toBe("7");
  const seen = new Set<string>();
  for (let i = 0; i < 10; i++) {
    const code = await page.getByLabel("Static Morse pattern", { exact: true }).textContent();
    const answer = morseToText(code ?? "").trim(); seen.add(answer);
    await page.getByLabel("Your answer", { exact: true }).fill(answer);
    await page.getByLabel("Your answer", { exact: true }).press("Enter");
    await expect(page.getByText("Correct.", { exact: true })).toBeVisible();
    await page.getByLabel("Your answer", { exact: true }).press("Enter");
  }
  expect(seen.size).toBe(10);
  await expect(page.getByRole("heading", { name: "Visual quiz results", exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("mw_visual_quiz_best_streak"))).toBe("10");
  expect(await flashes(page)).toBe(0);
  await page.reload({ waitUntil: "networkidle" });
  expect(await page.evaluate(() => localStorage.getItem("mw_visual_quiz_best_streak"))).toBe("10");
  expect(errors).toEqual([]);
});

for (const kind of ["practice", "quiz"] as const) test(`visual ${kind} keeps explicit flash available and stops for static, hidden and disabled states`, async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/morse-code-visual-${kind}`, { waitUntil: "networkidle" });
  const flash = page.getByRole("button", { name: kind === "practice" ? "Flash message" : "Flash prompt", exact: true });
  const warning = page.locator(`#visual-${kind}-strobe-warning`);
  await expect(warning).toBeVisible();
  expect(await warning.evaluate((element, selector) => Boolean(element.compareDocumentPosition(document.querySelector(selector)!) & Node.DOCUMENT_POSITION_FOLLOWING), `[aria-describedby="visual-${kind}-strobe-warning"]`)).toBe(true);
  await expect(flash).toBeEnabled(); await flash.press("Enter");
  await expect.poll(() => flashes(page)).toBeGreaterThan(0);
  await page.screenshot({ path: info.outputPath(`w23-explicit-flash-${kind}.png`) });
  await page.getByRole("button", { name: "Read static pattern", exact: true }).press("Enter");
  const stopped = await flashes(page); await page.waitForTimeout(350);
  expect(await flashes(page)).toBe(stopped);
  await expect(page.getByLabel("Static Morse pattern", { exact: true })).toBeVisible();
  await flash.click();
  await expect.poll(() => flashes(page)).toBeGreaterThan(stopped);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  const hidden = await flashes(page); await page.waitForTimeout(350); expect(await flashes(page)).toBe(hidden);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: false }); document.dispatchEvent(new Event("visibilitychange")); });
  await page.waitForTimeout(200); expect(await flashes(page)).toBe(hidden);
  await flash.click();
  await page.evaluate(() => { localStorage.setItem("morsewords-disable-flash-effects", "1"); window.dispatchEvent(new StorageEvent("storage", { key: "morsewords-disable-flash-effects" })); });
  await expect(flash).toBeDisabled();
  await expect(page.getByLabel("Static Morse pattern", { exact: true })).toBeVisible();
  const disabled = await flashes(page); await page.waitForTimeout(350); expect(await flashes(page)).toBe(disabled);
});

for (const kind of ["practice", "quiz"] as const) test(`visual ${kind} starts with usable static patterns when flash is globally disabled`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("morsewords-disable-flash-effects", "1"));
  await page.goto(`/morse-code-visual-${kind}`, { waitUntil: "networkidle" });
  await expect(page.getByLabel("Static Morse pattern", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: kind === "practice" ? "Flash message" : "Flash prompt", exact: true })).toBeDisabled();
  expect(await flashes(page)).toBe(0);
});

for (const kind of ["practice", "quiz"] as const) test(`audio ${kind} warns before Play even for lamp-only flash and preserves the compound control`, async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("morsewords-full-page-flash", "0"); localStorage.setItem("mw_audio_flash", "0"); });
  await page.goto(`/morse-code-audio-${kind}`, { waitUntil: "networkidle" });
  const toggle = page.getByRole("button", { name: "Flash Light", exact: true });
  await toggle.click();
  const warning = page.locator(`#audio-${kind}-strobe-warning`);
  await expect(warning).toContainText("Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity.");
  const play = page.getByRole("button", { name: /^Play prompt/ });
  expect(await warning.evaluate((element, id) => { const button = [...document.querySelectorAll('button')].find(node => node.textContent?.includes("Play prompt")); return !!button && !!(element.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING); }, kind)).toBe(true);
  await expect(play).toBeEnabled();
  const compound = page.getByTestId("mw-flash-control");
  await expect(compound.getByRole("button", { name: "Flash Light", exact: true })).toBeVisible();
  await expect(compound.getByTestId("mw-flash-lamp")).toHaveCount(1);
  expect(await compound.evaluate(element => getComputedStyle(element).flexWrap)).toBe("nowrap");
  expect(await flashes(page)).toBe(0);
  await toggle.click(); await expect(warning).toHaveCount(0);
});

test("saved listening targets have an equivalent static review with original grading", async ({ page }) => {
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), { key: REVIEW_STORAGE_KEY, raw: serializeReviewQueue([{ source: "audio-practice", mode: "morse_to_text", target: "SOS", private: false, misses: 1 }]) });
  await page.goto("/practice#review-queue", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start review", exact: true }).click();
  await page.getByRole("button", { name: "Review as a static pattern", exact: true }).press("Enter");
  const exercise = page.getByRole("region", { name: "Review exercise", exact: true });
  await expect(exercise.locator("pre")).toHaveText(textToMorse("SOS"));
  await page.getByLabel("Review answer", { exact: true }).fill("sos");
  await page.getByRole("button", { name: "Check review answer", exact: true }).click();
  await page.getByRole("button", { name: "Finish review", exact: true }).click();
  await expect(page.getByRole("region", { name: "Review session results" })).toContainText("1 of 1 targets finished: 1 solved, 0 skipped");
  expect(await flashes(page)).toBe(0);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items.length, REVIEW_STORAGE_KEY)).toBe(1);
});
