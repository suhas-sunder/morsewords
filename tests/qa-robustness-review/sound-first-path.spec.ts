import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blockExternalNetwork } from "./helpers";
import { STARTER_CHARACTERS } from "../../app/client/components/learning/learningSessions";
import { emptySoundFirstProgress, parseSoundFirstProgress, SOUND_FIRST_ORDER, SOUND_FIRST_SETS, SOUND_FIRST_STORAGE_KEY, soundFirstPrompts } from "../../app/client/components/learning/soundFirstSchema";
import { textToMorse } from "../../app/client/components/shared/morseUtils";
import { AUDIO_TONE_PRESETS } from "../../app/client/components/shared/audioPresetRegistry";

test.beforeEach(async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => { localStorage.setItem("morsewords-theme", theme); Math.random = () => 0; }, info.project.name.endsWith("dark") ? "dark" : "light");
});

test("sets extend the actual guide and cover each alphabet letter without hidden membership", () => {
  expect(SOUND_FIRST_ORDER.slice(0, 8)).toBe(STARTER_CHARACTERS.map(item => item.letter).join(""));
  expect([...SOUND_FIRST_ORDER].sort().join("")).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  expect(SOUND_FIRST_SETS.map(set => set.letters.length)).toEqual([2, 4, 6, 8, 12, 18, 26]);
  for (const set of SOUND_FIRST_SETS) {
    expect(soundFirstPrompts(set.id).map(prompt => prompt.text).join("")).toBe(set.letters);
    for (const letter of set.letters) expect(textToMorse(letter)).toMatch(/^[.-]+$/);
    if (set.id > 0) expect(set.letters.startsWith(SOUND_FIRST_SETS[set.id - 1].letters)).toBe(true);
  }
});

test("native listening starts only on Play and changing set releases playback", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Native WebKit audio is unavailable on this Windows host; static/scoring/settings are covered separately.");
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const stats = { starts: 0, active: 0 };
    Object.assign(window, { pathAudio: stats });
    window.AudioContext = class extends Native {
      createOscillator() {
        const node = super.createOscillator();
        const start = node.start.bind(node), stop = node.stop.bind(node);
        let active = false;
        node.start = when => { active = true; stats.active++; stats.starts++; start(when); };
        node.stop = when => { if (active) stats.active--; active = false; stop(when); };
        node.addEventListener("ended", () => { if (active) stats.active--; active = false; });
        return node;
      }
    };
  });
  await openPath(page);
  await page.getByRole("button", { name: "Start selected set", exact: true }).press("Enter");
  expect(await page.evaluate(() => (window as unknown as { pathAudio: { starts: number } }).pathAudio.starts)).toBe(0);
  await page.getByRole("button", { name: "Repeat", exact: true }).click();
  await page.getByRole("button", { name: "Play prompt Play prompt", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { pathAudio: { starts: number } }).pathAudio.starts)).toBeGreaterThan(0);
  await page.getByLabel("Character set", { exact: true }).selectOption("1");
  await page.getByRole("button", { name: "Start selected set", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { pathAudio: { active: number } }).pathAudio.active)).toBe(0);
  await expect(page.getByRole("button", { name: "Play prompt Play prompt", exact: true })).toBeVisible();
  const before = await page.evaluate(() => (window as unknown as { pathAudio: { starts: number } }).pathAudio.starts);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => (window as unknown as { pathAudio: { starts: number } }).pathAudio.starts)).toBe(before);
});

test("path progress schema rejects unknown fields, wrong sets, versions, oversized and invalid counts", () => {
  const valid = emptySoundFirstProgress();
  expect(parseSoundFirstProgress(JSON.stringify(valid))).toEqual(valid);
  for (const value of [{ ...valid, selectedSet: 7 }, { ...valid, selectedSet: -1 }, { ...valid, version: 2 }, { ...valid, html: "<script>" }, { ...valid, completedRounds: [1] }, { ...valid, completedRounds: [0,0,0,0,0,0,1.2] }, { ...valid, completedRounds: [0,0,0,0,0,0,10000] }]) expect(parseSoundFirstProgress(JSON.stringify(value))).toBeNull();
  expect(parseSoundFirstProgress("x".repeat(513))).toBeNull();
  expect(parseSoundFirstProgress('{"__proto__":{},"version":1,"selectedSet":0,"completedRounds":[0,0,0,0,0,0,0]}')).toBeNull();
});

async function openPath(page: Page) {
  await page.goto("/morse-code-audio-practice", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Explore sound-first path", exact: true }).click();
}
const savedProgress = (page: Page) => page.evaluate(key => JSON.parse(localStorage.getItem(key)!), SOUND_FIRST_STORAGE_KEY);

for (const width of [390, 768, 1440]) test(`manual sets, static equivalent, feedback and round completion at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 });
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await openPath(page);
  await expect(page.getByText("Letters in selected set: E T", { exact: true })).toBeVisible();
  const setSelector = page.getByLabel("Character set", { exact: true });
  const fill = await setSelector.evaluate(element => getComputedStyle(element).backgroundColor);
  await setSelector.focus();
  expect(await setSelector.evaluate(element => getComputedStyle(element).backgroundColor)).toBe(fill);
  await page.getByRole("button", { name: "Start selected set", exact: true }).click();
  await expect(page.getByText("Active set 1: E T. Ten prompts; press Play when ready.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Static Morse pattern")).toHaveCount(0);
  await page.getByRole("button", { name: "Read static pattern", exact: true }).click();
  await expect(page.getByLabel("Your answer", { exact: true })).toHaveAttribute("placeholder", "Type the letter");
  const pattern = await page.getByLabel("Static Morse pattern").textContent();
  const expected = pattern === "." ? "E" : "T";
  await page.getByLabel("Your answer", { exact: true }).fill("Z");
  await page.getByRole("button", { name: "Check answer Check answer", exact: true }).click();
  await expect(page.getByText(`Expected: ${expected}`, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mw_learning_review_v1")!).items[0].target)).toBe(expected);
  await page.getByLabel("Your answer", { exact: true }).fill(expected);
  await page.getByRole("button", { name: "Check answer Check answer", exact: true }).click();
  await page.getByRole("button", { name: "Next prompt Next prompt", exact: true }).click();
  for (let i = 1; i < 10; i++) {
    expect([".", "-"]).toContain(await page.getByLabel("Static Morse pattern").textContent());
    await page.getByRole("button", { name: "Skip", exact: true }).click();
  }
  await expect(page.getByRole("region", { name: "Listening session results" })).toContainText("10 of 10 prompts finished: 1 solved, 9 skipped");
  expect((await savedProgress(page)).completedRounds).toEqual([1,0,0,0,0,0,0]);
  await page.getByRole("button", { name: "Finish listening session", exact: true }).evaluate((button: HTMLButtonElement) => button.click());
  expect((await savedProgress(page)).completedRounds[0]).toBe(1);
  await page.getByRole("button", { name: "Try next character set", exact: true }).click();
  await expect(page.getByText("Active set 2: E T A N. Ten prompts; press Play when ready.", { exact: true })).toBeVisible();
  await page.getByLabel("Character set", { exact: true }).selectOption("6");
  await expect(page.getByText("Active set 2: E T A N. Ten prompts; press Play when ready.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start selected set", exact: true }).click();
  await expect(page.getByText(/Active set 7:/)).toBeVisible();
  await page.getByRole("region", { name: "Sound-first learning path" }).scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  if (width === 390) expect((await new AxeBuilder({ page }).include('[aria-label="Sound-first learning path"]').analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath(`w22-path-${width}.png`) });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByText(/Active set 7:/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Start open-ended practice", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explore sound-first path", exact: true }).click();
  await expect(page.getByLabel("Character set", { exact: true })).toHaveValue("6");
  expect((await savedProgress(page)).completedRounds[0]).toBe(1);
  expect(errors).toEqual([]);
});

test("early finish, difficulty changes and static presentation preserve ordinary practice and audio settings", async ({ page }) => {
  await openPath(page);
  await page.getByRole("button", { name: "Show advanced settings", exact: true }).click();
  const preset = page.getByLabel(/^Sound preset/);
  expect(await preset.locator("option").evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).toEqual(AUDIO_TONE_PRESETS);
  await preset.selectOption("soft_bell");
  const speed = page.getByLabel("Character speed");
  const changedSpeed = String(Number(await speed.inputValue()) + 1);
  await speed.press("ArrowRight");
  await expect(speed).toHaveValue(changedSpeed);
  await page.getByRole("button", { name: "Start selected set", exact: true }).click();
  await page.getByRole("button", { name: "Finish listening session", exact: true }).click();
  expect((await savedProgress(page)).completedRounds).toEqual([0,0,0,0,0,0,0]);
  await page.getByRole("button", { name: "Restart listening session", exact: true }).click();
  await page.getByRole("button", { name: "Flash Light", exact: true }).click();
  await page.getByRole("button", { name: "Read static pattern", exact: true }).click();
  await expect(page.getByRole("button", { name: "Flash Light", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Flash Light", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Listen first", exact: true }).click();
  await expect(page.getByRole("button", { name: "Flash Light", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Easy", exact: true }).click();
  await expect(page.getByText(/Active set 1:/)).toHaveCount(0);
  await expect(page.getByLabel("Static Morse pattern")).toHaveCount(0);
  await expect(preset).toHaveValue("soft_bell");
  await expect(speed).toHaveValue(changedSpeed);
  await page.getByRole("button", { name: "Clear path progress", exact: true }).click();
  await page.getByRole("button", { name: "Confirm clear path", exact: true }).click();
  await expect(preset).toHaveValue("soft_bell");
  expect(await savedProgress(page)).toEqual(emptySoundFirstProgress());
});

for (const failure of ["malformed", "quota", "denied"] as const) test(`${failure} path storage remains usable and honest`, async ({ page }) => {
  await page.addInitScript(({ key, failure }) => {
    if (failure === "malformed") localStorage.setItem(key, "bad-existing-data");
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
    Storage.prototype.getItem = function (name) { if (name === key && failure === "denied") throw new DOMException("denied", "SecurityError"); return get.call(this, name); };
    Storage.prototype.setItem = function (name, value) { if (name === key && failure === "quota") throw new DOMException("full", "QuotaExceededError"); return set.call(this, name, value); };
  }, { key: SOUND_FIRST_STORAGE_KEY, failure });
  await openPath(page);
  await page.getByRole("button", { name: "Start selected set", exact: true }).click();
  await expect(page.getByRole("region", { name: "Sound-first learning path" })).toContainText(/tab/);
  await page.getByRole("button", { name: "Read static pattern", exact: true }).click();
  await expect(page.getByLabel("Static Morse pattern")).toBeVisible();
  if (failure === "malformed") expect(await page.evaluate(key => localStorage.getItem(key), SOUND_FIRST_STORAGE_KEY)).toBe("bad-existing-data");
});

test("storage changes and site clearing refresh saved counts without changing the active set", async ({ page }) => {
  await openPath(page);
  await page.getByRole("button", { name: "Start selected set", exact: true }).click();
  await page.evaluate(({ key, data }) => { localStorage.setItem(key, JSON.stringify(data)); window.dispatchEvent(new StorageEvent("storage", { key })); }, { key: SOUND_FIRST_STORAGE_KEY, data: { ...emptySoundFirstProgress(), selectedSet: 2, completedRounds: [3,0,4,0,0,0,0] } });
  await expect(page.getByLabel("Character set", { exact: true })).toHaveValue("2");
  await expect(page.getByText(/Active set 1:/)).toBeVisible();
  await expect(page.getByText(/4 completed rounds in this set/)).toBeVisible();
  await page.evaluate(key => { localStorage.removeItem(key); window.dispatchEvent(new CustomEvent("morsewords:storage-clear", { detail: { removedKeys: [key], failedKeys: [] } })); }, SOUND_FIRST_STORAGE_KEY);
  await expect(page.getByLabel("Character set", { exact: true })).toHaveValue("0");
  await expect(page.getByText(/0 completed rounds in this set/)).toBeVisible();
});
