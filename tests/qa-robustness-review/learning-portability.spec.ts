import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { blockExternalNetwork } from "./helpers";
import { applyLearningSnapshot, BEST_KEYS, CUSTOM_WORDS_KEY, exportLearningData, LEARNING_FILE_LIMIT, PORTABLE_KEYS, parseLearningFile, planLearningImport, readLearningFile, type LearningFile } from "../../app/client/components/learning/learningPortability";
import { getStorageKeyDefinition } from "../../app/client/components/shared/storageRegistry";
import { REVIEW_STORAGE_KEY, serializeReviewQueue, type ReviewItem } from "../../app/client/components/learning/learningReviewSchema";
import { emptySoundFirstProgress, SOUND_FIRST_STORAGE_KEY } from "../../app/client/components/learning/soundFirstSchema";
const publicItem: ReviewItem = { source: "practice", mode: "morse_to_text", target: "E", misses: 2, private: false };
const privateItem: ReviewItem = { ...publicItem, source: "word-trainer", target: "PRIVATE WORD", private: true };
const file = (data: LearningFile["data"], includesPrivate = false): LearningFile => ({ format: "morsewords-learning", version: 1, includesPrivate, data });
const memory = (initial: Record<string,string> = {}) => {
  const values = new Map(Object.entries(initial));
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
};

test("strict file schema rejects unknown versions, fields, keys, HTML, prototype fields and invalid ranges", () => {
  const good = file({ bestStreaks: { [BEST_KEYS[0]]: 12 }, reviewQueue: [publicItem], soundFirstProgress: emptySoundFirstProgress() });
  expect(parseLearningFile(JSON.stringify(good))).toEqual(good);
  for (const invalid of [null, [], {}, { ...good, version: 2 }, { ...good, extra: true }, { ...good, data: { ads: {} } }, file({ bestStreaks: { "morsewords-theme": 3 } }), file({ bestStreaks: { [BEST_KEYS[0]]: -1 } }), file({ bestStreaks: { [BEST_KEYS[0]]: 10000 } }), file({ reviewQueue: [{ ...publicItem, target: "<SCRIPT>" }] }), file({ reviewQueue: [privateItem] }), file({ customWords: "WORDS" }), file({ customWords: "<img onerror=alert(1)>" }, true), file({ soundFirstProgress: { ...emptySoundFirstProgress(), selectedSet: 7 } })]) expect(() => parseLearningFile(JSON.stringify(invalid))).toThrow();
  expect(() => parseLearningFile('{"format":"morsewords-learning","version":1,"includesPrivate":false,"data":{"bestStreaks":{"__proto__":1}}}')).toThrow();
  expect(() => parseLearningFile('{"format":"morsewords-learning","version":1,"includesPrivate":false,"data":{"__proto__":{}}}')).toThrow();
  expect(() => parseLearningFile("not JSON")).toThrow();
});
test("size guard runs before reading a local file and supports the full bounded queue", async () => {
  let read = false;
  await expect(readLearningFile({ size: LEARNING_FILE_LIMIT + 1, text: async () => { read = true; return "{}"; } })).rejects.toThrow(/1 MiB/);
  expect(read).toBe(false);
  const queue = Array.from({ length: 100 }, (_, i) => ({ ...publicItem, target: String(i).padStart(3, "0") + '"'.repeat(3997) }));
  const raw = JSON.stringify(file({ reviewQueue: queue }), null, 2);
  expect(Buffer.byteLength(raw)).toBeLessThan(LEARNING_FILE_LIMIT);
  expect(parseLearningFile(raw).data.reviewQueue).toHaveLength(100);
});
test("public export excludes private text; partial import preserves unrelated and private data", () => {
  const store = memory({ [BEST_KEYS[0]]: "7", [REVIEW_STORAGE_KEY]: serializeReviewQueue([publicItem, privateItem]), [CUSTOM_WORDS_KEY]: "PRIVATE WORD", "morsewords-theme": "dark", "mw_audio_text": "SECRET INPUT" });
  const exported = exportLearningData(store, false);
  expect(JSON.stringify(exported)).not.toContain("PRIVATE"); expect(JSON.stringify(exported)).not.toContain("SECRET");
  expect(exportLearningData(store, true).data.customWords).toBe("PRIVATE WORD");
  const plan = planLearningImport(store, file({ reviewQueue: [publicItem] }));
  expect(plan.preservedPrivate).toBe(1);
  applyLearningSnapshot(store, plan.before, plan.after);
  expect(JSON.parse(store.getItem(REVIEW_STORAGE_KEY)!).items).toEqual([privateItem, publicItem]);
  expect(store.getItem(BEST_KEYS[0])).toBe("7"); expect(store.getItem(CUSTOM_WORDS_KEY)).toBe("PRIVATE WORD");
  expect(store.getItem("morsewords-theme")).toBe("dark"); expect(store.getItem("mw_audio_text")).toBe("SECRET INPUT");
  applyLearningSnapshot(store, plan.after, plan.before);
  expect(store.getItem(REVIEW_STORAGE_KEY)).toBe(serializeReviewQueue([publicItem, privateItem]));
});
test("private merge deduplicates safely, rejects overflow, and unreadable saved data is protected", () => {
  const store = memory({ [REVIEW_STORAGE_KEY]: serializeReviewQueue([privateItem]) });
  const plan = planLearningImport(store, file({ reviewQueue: [{ ...privateItem, private: false }] }));
  expect(JSON.parse(plan.after[REVIEW_STORAGE_KEY]!).items).toEqual([privateItem]);
  const hundred = Array.from({ length: 100 }, (_, i) => ({ ...publicItem, target: `TARGET${i}` }));
  expect(() => planLearningImport(store, file({ reviewQueue: hundred }))).toThrow(/exceeds 100/);
  store.setItem(REVIEW_STORAGE_KEY, "corrupt-preserve-me");
  expect(() => planLearningImport(store, file({ reviewQueue: [] }))).toThrow(/unreadable/);
  expect(store.getItem(REVIEW_STORAGE_KEY)).toBe("corrupt-preserve-me");
});
test("transaction rejects stale previews, rolls back partial writes and refuses stale undo", () => {
  const store = memory({ [BEST_KEYS[0]]: "7", [BEST_KEYS[1]]: "9" });
  const plan = planLearningImport(store, file({ bestStreaks: { [BEST_KEYS[0]]: 2, [BEST_KEYS[1]]: 3 } }));
  let writes = 0; const realSet = store.setItem;
  store.setItem = (key, value) => { if (++writes === 2) throw Error("quota"); realSet(key, value); };
  expect(() => applyLearningSnapshot(store, plan.before, plan.after)).toThrow(/Previous values were restored/);
  expect(store.getItem(BEST_KEYS[0])).toBe("7"); expect(store.getItem(BEST_KEYS[1])).toBe("9");
  store.setItem = realSet; store.setItem(BEST_KEYS[0], "8");
  expect(() => applyLearningSnapshot(store, plan.before, plan.after)).toThrow(/changed since/);
  store.setItem(BEST_KEYS[0], "7"); applyLearningSnapshot(store, plan.before, plan.after);
  store.setItem(BEST_KEYS[1], "4");
  expect(() => applyLearningSnapshot(store, plan.after, plan.before)).toThrow(/changed since/);
  expect(store.getItem(BEST_KEYS[1])).toBe("4");
});

test.beforeEach(async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
});
async function openData(page: Page) {
  await page.goto("/learn-morse-code#learning-data", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Manage learning data", exact: true }).click();
  await expect(page.getByLabel("Choose learning file", { exact: true })).toBeVisible();
}
async function choose(page: Page, input: LearningFile | string) {
  await page.getByLabel("Choose learning file", { exact: true }).setInputFiles({ name: "PRIVATE_FILENAME.json", mimeType: "application/json", buffer: Buffer.from(typeof input === "string" ? input : JSON.stringify(input)) });
}
for (const width of [390, 768, 1440]) test(`export, preview, restore and undo are local and accessible at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: "reduce" });
  const requests: string[] = [], errors: string[] = []; page.on("request", r => requests.push(r.url() + (r.postData() ?? ""))); page.on("pageerror", e => errors.push(e.message));
  await openData(page);
  await page.evaluate(({ best, review, custom, item, privateItem, sound }) => {
    localStorage.setItem(best, "7"); localStorage.setItem(review, JSON.stringify({ version: 1, items: [item, privateItem] })); localStorage.setItem(custom, "PRIVATE WORD"); localStorage.setItem(sound, JSON.stringify({ version: 1, selectedSet: 2, completedRounds: [1,2,3,0,0,0,0] }));
  }, { best: BEST_KEYS[0], review: REVIEW_STORAGE_KEY, custom: CUSTOM_WORDS_KEY, item: publicItem, privateItem, sound: SOUND_FIRST_STORAGE_KEY });
  const downloading = page.waitForEvent("download"); await page.getByRole("button", { name: "Export learning file", exact: true }).press("Enter");
  const downloaded = await downloading; const path = await downloaded.path(); const raw = await readFile(path!, "utf8");
  expect(downloaded.suggestedFilename()).toBe("morsewords-learning-v1.json"); expect(raw).not.toContain("PRIVATE");
  await page.evaluate(key => localStorage.setItem(key, "2"), BEST_KEYS[0]);
  await choose(page, raw);
  const preview = page.getByRole("heading", { name: "Review changes before restoring", exact: true }); await expect(preview).toBeFocused();
  expect(await page.evaluate(key => localStorage.getItem(key), BEST_KEYS[0])).toBe("2");
  await page.locator("#learning-data").scrollIntoViewIfNeeded(); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: info.outputPath(`w24-preview-${width}.png`) });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).include("#learning-data").analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Restore listed learning data", exact: true }).press("Enter");
  await expect(page.getByRole("status").filter({ hasText: "Learning data restored" })).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), BEST_KEYS[0])).toBe("7");
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items.length, REVIEW_STORAGE_KEY)).toBe(2);
  await page.getByRole("button", { name: "Undo learning restore", exact: true }).press("Enter");
  expect(await page.evaluate(key => localStorage.getItem(key), BEST_KEYS[0])).toBe("2");
  expect(await page.evaluate(key => localStorage.getItem(key), CUSTOM_WORDS_KEY)).toBe("PRIVATE WORD");
  expect(requests.join("\n")).not.toMatch(/PRIVATE|morsewords-learning-v1/); expect(errors).toEqual([]);
});
test("private restore needs opt-in; cancel and malformed files leave storage unchanged", async ({ page }) => {
  await openData(page);
  await page.evaluate(key => localStorage.setItem(key, "ORIGINAL PRIVATE"), CUSTOM_WORDS_KEY);
  await choose(page, file({ customWords: "IMPORTED PRIVATE", reviewQueue: [privateItem] }, true));
  const restore = page.getByRole("button", { name: "Restore listed learning data", exact: true }); await expect(restore).toBeDisabled();
  await page.getByRole("button", { name: "Cancel restore", exact: true }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), CUSTOM_WORDS_KEY)).toBe("ORIGINAL PRIVATE");
  await choose(page, "<script>no</script>"); await expect(page.getByRole("status").filter({ hasText: "not valid JSON" })).toBeVisible();
  await choose(page, file({ customWords: "IMPORTED PRIVATE", reviewQueue: [privateItem] }, true));
  await page.getByLabel("Allow private learning data from this file to replace the listed values").check(); await restore.click();
  expect(await page.evaluate(key => localStorage.getItem(key), CUSTOM_WORDS_KEY)).toBe("IMPORTED PRIVATE");
  await page.getByRole("button", { name: "Undo learning restore", exact: true }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), CUSTOM_WORDS_KEY)).toBe("ORIGINAL PRIVATE");
});
for (const failure of ["quota", "denied", "stale"] as const) test(`browser ${failure} failure is honest and preserves old values`, async ({ page }) => {
  await openData(page);
  await page.evaluate(key => localStorage.setItem(key, "7"), BEST_KEYS[0]);
  if (failure === "denied") await page.evaluate(() => { Storage.prototype.getItem = () => { throw new DOMException("denied", "SecurityError"); }; });
  await choose(page, file({ bestStreaks: { [BEST_KEYS[0]]: 2 } }));
  if (failure === "denied") { await expect(page.getByRole("status").filter({ hasText: "could not be read" })).toBeVisible(); return; }
  if (failure === "quota") await page.evaluate(key => { const real = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === key && v === "2") throw new DOMException("quota", "QuotaExceededError"); return real.call(this, k, v); }; }, BEST_KEYS[0]);
  else await page.evaluate(key => localStorage.setItem(key, "9"), BEST_KEYS[0]);
  await page.getByRole("button", { name: "Restore listed learning data", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: failure === "quota" ? "Previous values were restored" : "changed since" })).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), BEST_KEYS[0])).toBe(failure === "quota" ? "7" : "9");
  await expect(page.getByRole("button", { name: "Download recovery backup", exact: true })).toBeEnabled();
});

for (const width of [390, 768, 1440]) test(`beginner journey reaches feedback, review, completion and portable history at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/learn-morse-code", { waitUntil: "networkidle" });
  await page.getByRole("combobox", { name: "What would you like to practice?" }).selectOption("first");
  await page.getByRole("button", { name: "Start session", exact: true }).press("Enter");
  const input = page.getByLabel("Practice answer"); await expect(input).toBeFocused();
  await input.fill("WRONG"); await input.press("Enter");
  await expect(page.getByRole("link", { name: "Review missed items", exact: true })).toBeVisible();
  const target = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items[0].target, REVIEW_STORAGE_KEY);
  await page.getByRole("button", { name: "Compare submitted answer", exact: true }).press("Enter");
  await expect(page.getByRole("region", { name: "Answer comparison" })).toContainText(target);
  await input.fill(target); await input.press("Enter");
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Finish session early", exact: true }).press("Enter");
  await expect(page.getByRole("heading", { name: "Your results", exact: true })).toBeFocused();
  await expect(page.getByText(/1 of 10 prompts finished: 1 solved, 0 skipped/)).toBeVisible();
  await page.getByRole("link", { name: "Review missed items when you are ready", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Start review", exact: true }).press("Enter");
  await page.getByLabel("Review answer", { exact: true }).fill(target);
  await page.getByRole("button", { name: "Check review answer", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Finish review", exact: true }).press("Enter");
  await expect(page.getByRole("region", { name: "Review session results" })).toContainText("1 solved");
  await page.screenshot({ path: info.outputPath(`w24-beginner-review-${width}.png`) });
  await openData(page);
  const downloading = page.waitForEvent("download"); await page.getByRole("button", { name: "Export learning file", exact: true }).click();
  const raw = await readFile((await (await downloading).path())!, "utf8");
  expect(parseLearningFile(raw).data.bestStreaks![BEST_KEYS[0]]).toBe(1);
  await page.evaluate(({ best, review }) => { localStorage.removeItem(best); localStorage.removeItem(review); }, { best: BEST_KEYS[0], review: REVIEW_STORAGE_KEY });
  await choose(page, raw); await page.getByRole("button", { name: "Restore listed learning data", exact: true }).click();
  await page.goto("/practice#review-queue", { waitUntil: "networkidle" });
  await expect(page.getByRole("list", { name: "Saved review targets" })).toContainText(target);
  expect(await page.evaluate(key => localStorage.getItem(key), BEST_KEYS[0])).toBe("1");
});
for (const width of [390, 768, 1440]) test(`listening progression connects to weak review without mandatory flashes at ${width}px`, async ({ page, browserName }, info) => {
  await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/learn-morse-code", { waitUntil: "networkidle" });
  await page.getByRole("combobox", { name: "What would you like to practice?" }).selectOption("listening");
  await page.getByRole("button", { name: "Start session", exact: true }).press("Enter");
  await expect(page.getByRole("button", { name: /advanced settings/i })).toBeEnabled();
  await page.getByRole("button", { name: "Explore sound-first path", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Start selected set", exact: true }).press("Enter");
  if (browserName === "chromium") { await page.getByRole("button", { name: "Play prompt Play prompt", exact: true }).click(); await expect(page.getByRole("button", { name: "Stop audio Stop", exact: true })).toBeDisabled(); }
  // Native audio is covered in Chromium. Windows WebKit continues via the equivalent static task.
  await page.getByRole("button", { name: "Read static pattern", exact: true }).press("Enter");
  const target = (await page.getByLabel("Static Morse pattern").textContent()) === "." ? "E" : "T";
  const input = page.getByLabel("Your answer", { exact: true }); await input.fill("Z");
  await page.getByRole("button", { name: /Check answer/ }).press("Enter");
  await expect(page.getByText(`Expected: ${target}`, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Finish listening session", exact: true }).press("Enter");
  await expect(page.getByRole("region", { name: "Listening session results" })).toContainText("1 of 10 prompts finished");
  await page.getByRole("link", { name: "Review missed items when you are ready", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Start review", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Review as a static pattern", exact: true }).press("Enter");
  await page.getByLabel("Review answer", { exact: true }).fill(target);
  await page.getByRole("button", { name: "Check review answer", exact: true }).press("Enter");
  await expect(page.getByRole("region", { name: "Review exercise" })).toContainText("Your answer matches");
  await page.screenshot({ path: info.outputPath(`w24-listening-review-${width}.png`) });
});

test("portable keys remain registered and recovery backup survives a failed rollback", () => {
  expect(PORTABLE_KEYS.every(key => getStorageKeyDefinition(key))).toBe(true);
  const store = memory({ [BEST_KEYS[0]]: "7", [BEST_KEYS[1]]: "9" });
  const plan = planLearningImport(store, file({ bestStreaks: { [BEST_KEYS[0]]: 2, [BEST_KEYS[1]]: 3 } }));
  let writes = 0; const real = store.setItem;
  store.setItem = (key, value) => { if (++writes > 1) throw Error("storage unavailable"); real(key, value); };
  expect(() => applyLearningSnapshot(store, plan.before, plan.after)).toThrow(/failed during recovery/);
  expect(plan.backup.data.bestStreaks).toEqual({ [BEST_KEYS[0]]: 7, [BEST_KEYS[1]]: 9 });
  store.setItem = real;
  const recovery = planLearningImport(store, parseLearningFile(JSON.stringify(plan.backup)));
  applyLearningSnapshot(store, recovery.before, recovery.after);
  expect(store.getItem(BEST_KEYS[0])).toBe("7"); expect(store.getItem(BEST_KEYS[1])).toBe("9");
});
test("explicit null clears only included values and preserves private targets in public imports", () => {
  const store = memory({ [BEST_KEYS[0]]: "7", [BEST_KEYS[1]]: "9", [REVIEW_STORAGE_KEY]: serializeReviewQueue([publicItem, privateItem]), [CUSTOM_WORDS_KEY]: "PRIVATE WORD" });
  const plan = planLearningImport(store, file({ bestStreaks: { [BEST_KEYS[0]]: null }, reviewQueue: null }));
  applyLearningSnapshot(store, plan.before, plan.after);
  expect(store.getItem(BEST_KEYS[0])).toBeNull(); expect(store.getItem(BEST_KEYS[1])).toBe("9");
  expect(JSON.parse(store.getItem(REVIEW_STORAGE_KEY)!).items).toEqual([privateItem]);
  expect(store.getItem(CUSTOM_WORDS_KEY)).toBe("PRIVATE WORD");
  applyLearningSnapshot(store, plan.after, plan.before);
  expect(store.getItem(REVIEW_STORAGE_KEY)).toBe(serializeReviewQueue([publicItem, privateItem]));
});
