import { expect, test } from "@playwright/test";
import { addMissedTarget, parseReviewQueue, REVIEW_LIMIT, REVIEW_STORAGE_KEY, serializeReviewQueue, validReviewItem, type ReviewItem } from "../../app/client/components/learning/learningReviewSchema";
import { checkReviewAnswer, checkSentenceMorseAnswer } from "../../app/client/components/learning/learningAnswerRules";
import { stageReviewAudio, takeReviewAudio } from "../../app/client/components/learning/reviewAudioHandoff";
import { textToMorse } from "../../app/client/components/shared/morseUtils";
import { checkAnswer } from "../../app/client/components/practice/practiceEngine";
import { blockExternalNetwork } from "./helpers";

const target: ReviewItem = { source: "practice", mode: "text_to_morse", target: "I", misses: 1, private: false };

test.beforeEach(async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
});

test("strict bounded queue deduplicates by exercise and preserves privacy", () => {
  expect(parseReviewQueue(null)).toEqual([]);
  expect(parseReviewQueue("broken")).toBeNull();
  expect(parseReviewQueue('{"version":2,"items":[]}')).toBeNull();
  expect(parseReviewQueue('{"version":1,"items":[],"__proto__":{}}')).toBeNull();
  expect(validReviewItem({ ...target, target: "<script>" })).toBe(false);
  expect(validReviewItem({ ...target, source: "audio-quiz" })).toBe(false);
  expect(validReviewItem({ ...target, target: "A".repeat(4000), private: true })).toBe(true);
  expect(validReviewItem({ ...target, target: "A".repeat(4001) })).toBe(false);
  let items = addMissedTarget([], target);
  items = addMissedTarget(items, { ...target, private: true });
  items = addMissedTarget(items, target);
  expect(items).toEqual([{ ...target, misses: 3, private: true }]);
  expect(parseReviewQueue(serializeReviewQueue([...items, ...items]))).toBeNull();
  for (let index = 0; index < 130; index++) items = addMissedTarget(items, { ...target, target: `WORD${index}` });
  expect(items).toHaveLength(REVIEW_LIMIT);
  expect(items[0].target).toBe("WORD129");
  expect(items.at(-1)?.target).toBe("WORD30");
  expect(parseReviewQueue(serializeReviewQueue(items))).toEqual(items);
  const escaped = Array.from({ length: REVIEW_LIMIT }, (_, index) => ({ ...target, target: String(index).padStart(3, "0") + '"'.repeat(3997) }));
  expect(parseReviewQueue(serializeReviewQueue(escaped))).toEqual(escaped);
});

test("review delegates to existing exercise grading including their different spacing rules", () => {
  for (const mode of ["text_to_morse", "morse_to_text"] as const) for (const answer of ["SOS", "... --- ...", "...---...", "s o s", "  sos  ", "...\n---\n...", "...X---..."]) {
    const prompt = { kind: mode, plain: "SOS", morse: textToMorse("SOS"), label: "Test" };
    expect(checkReviewAnswer({ ...target, mode, target: "SOS" }, answer)).toEqual(checkAnswer(prompt, answer));
    expect(checkReviewAnswer({ ...target, mode, target: "SOS", source: "sentence" }, answer)).toEqual(checkSentenceMorseAnswer(prompt, answer));
  }
  expect(checkReviewAnswer({ ...target, source: "word-trainer", target: "SOS" }, "... --- ...").ok).toBe(true);
  expect(checkReviewAnswer({ ...target, source: "word-trainer", mode: "morse_to_text", target: "SOS" }, "s o s").ok).toBe(true);
  expect(checkReviewAnswer({ ...target, source: "audio-quiz", mode: "morse_to_text", target: "SOS" }, "s o s").ok).toBe(false);
  expect(checkReviewAnswer({ ...target, source: "sentence", target: "SOS SOS" }, "...---... / ...---...").ok).toBe(true);
  expect(checkReviewAnswer({ ...target, source: "sentence", target: "SOS" }, "...X---...").ok).toBe(false);
});

test("listening review handoff is bounded, expires and consumes once", () => {
  expect(stageReviewAudio(target)).toBe(false);
  const audio: ReviewItem = { ...target, source: "audio-quiz", mode: "morse_to_text" };
  expect(stageReviewAudio(audio)).toBe(true);
  expect(takeReviewAudio()).toEqual(audio);
  expect(takeReviewAudio()).toBeNull();
  const now = Date.now;
  try { Date.now = () => 1000; stageReviewAudio(audio); Date.now = () => 301001; expect(takeReviewAudio()).toBeNull(); }
  finally { Date.now = now; }
});

for (const width of [390, 768, 1440]) test(`miss → review → remove and clear is local at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(() => {
    Math.random = () => .55;
    localStorage.setItem("mw_practice_pool", "starter");
    localStorage.setItem("mw_practice_mode_starter", "text_to_morse");
  });
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("request", request => requests.push(request.url() + (request.postData() ?? "")));
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/practice", { waitUntil: "networkidle" });
  await expect(page.getByText("First characters: E T A N I M S O")).toBeVisible();
  await page.getByLabel("Practice answer").fill("PRIVATE_REVIEW_ANSWER");
  await page.getByLabel("Practice answer").press("Enter");
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? "null")?.items?.[0]?.misses, REVIEW_STORAGE_KEY)).toBe(1);
  await page.getByLabel("Practice answer").fill(".-");
  await page.getByLabel("Practice answer").press("Enter");
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items, REVIEW_STORAGE_KEY)).toEqual([{ ...target, misses: 2 }]);
  await page.getByRole("link", { name: "Review missed items", exact: true }).click();
  const queue = page.getByRole("region", { name: "Review queue", exact: true });
  await expect(queue.getByRole("list", { name: "Saved review targets" })).toContainText("2 times marked");
  await queue.getByRole("button", { name: "Start review", exact: true }).click();
  await expect(page.getByLabel("Review answer", { exact: true })).toBeFocused();
  await page.getByLabel("Review answer", { exact: true }).fill("..");
  const reviewInput = page.getByLabel("Review answer", { exact: true });
  const focusStyle = await reviewInput.evaluate(element => ({ fill: getComputedStyle(element).backgroundColor, panel: getComputedStyle(element.parentElement!).backgroundColor }));
  await reviewInput.blur();
  expect(await reviewInput.evaluate(element => ({ fill: getComputedStyle(element).backgroundColor, panel: getComputedStyle(element.parentElement!).backgroundColor }))).toEqual(focusStyle);
  await page.getByRole("button", { name: "Check review answer" }).click();
  await expect(queue).toContainText("Your answer matches");
  await queue.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath(`w20-review-${width}.png`) });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await queue.getByRole("button", { name: "Remove this review item" }).click();
  await expect(queue).toContainText("Your review queue is empty");
  await page.getByLabel("Practice answer").fill(".-");
  await page.getByLabel("Practice answer").press("Enter");
  await queue.getByRole("button", { name: "Clear review queue", exact: true }).click();
  await queue.getByRole("button", { name: "Keep review queue" }).click();
  await expect(queue.getByRole("list", { name: "Saved review targets" }).getByRole("listitem")).toHaveCount(1);
  await queue.getByRole("button", { name: "Clear review queue", exact: true }).click();
  await queue.getByRole("button", { name: "Confirm clear review queue" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("region", { name: "Review queue", exact: true })).toContainText("Your review queue is empty");
  expect(requests.join("\n")).not.toContain("PRIVATE_REVIEW_ANSWER");
  expect(errors).toEqual([]);
});

for (const route of ["/morse-code-sentence-practice", "/morse-code-audio-practice", "/morse-code-audio-quiz", "/morse-code-visual-quiz"]) test(`${route} saves expected target only`, async ({ page }) => {
  await page.goto(route, { waitUntil: "networkidle" });
  // A network-idle SSR document can precede hydration on a loaded test host.
  if (route === "/morse-code-audio-practice") await expect(page.getByRole("button", { name: /advanced settings/i })).toBeEnabled();
  await page.getByLabel(route.includes("sentence") ? "Sentence practice answer" : "Your answer", { exact: true }).fill("PRIVATE_WRONG_SENTINEL");
  await page.getByRole("button", { name: route.includes("sentence") ? /Check sentence/ : /Check answer/ }).click();
  await expect(page.getByRole("link", { name: "Review missed items", exact: true })).toBeVisible();
  const raw = await page.evaluate(key => localStorage.getItem(key), REVIEW_STORAGE_KEY);
  expect(raw).not.toContain("PRIVATE_WRONG_SENTINEL");
  expect(parseReviewQueue(raw)).toHaveLength(1);
});

for (const failure of ["malformed", "quota", "denied"] as const) test(`${failure} storage preserves exercise and gives an honest queue notice`, async ({ page }) => {
  await page.addInitScript(({ key, failure }) => {
    if (failure === "malformed") localStorage.setItem(key, "unreadable-original");
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
    Storage.prototype.getItem = function (name) { if (name === key && failure === "denied") throw new DOMException("denied", "SecurityError"); return get.call(this, name); };
    Storage.prototype.setItem = function (name, value) { if (name === key && failure !== "malformed") throw new DOMException("full", "QuotaExceededError"); return set.call(this, name, value); };
  }, { key: REVIEW_STORAGE_KEY, failure });
  await page.goto("/practice#review-queue", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "Start review", exact: true })).toBeVisible();
  await page.getByLabel("Practice answer").fill("WRONG");
  await page.getByLabel("Practice answer").press("Enter");
  const queue = page.getByRole("region", { name: "Review queue", exact: true });
  await expect(queue).toContainText(/only in this tab|stay in this tab/);
  await expect(queue.getByRole("list", { name: "Saved review targets" }).getByRole("listitem")).toHaveCount(1);
  if (failure === "malformed") {
    expect(await page.evaluate(key => localStorage.getItem(key), REVIEW_STORAGE_KEY)).toBe("unreadable-original");
    await queue.getByRole("button", { name: "Clear review queue", exact: true }).click();
    await queue.getByRole("button", { name: "Confirm clear review queue" }).click();
    expect(await page.evaluate(key => localStorage.getItem(key), REVIEW_STORAGE_KEY)).toBe(serializeReviewQueue([]));
  }
});

test("storage events update mounted queue without resetting the active snapshot", async ({ page }) => {
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), { key: REVIEW_STORAGE_KEY, raw: serializeReviewQueue([target]) });
  await page.goto("/practice#review-queue", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start review", exact: true }).click();
  await page.evaluate(({ key, raw }) => { localStorage.setItem(key, raw); dispatchEvent(new StorageEvent("storage", { key, newValue: raw })); }, { key: REVIEW_STORAGE_KEY, raw: serializeReviewQueue([]) });
  await expect(page.getByRole("region", { name: "Review queue", exact: true })).toContainText("Your review queue is empty");
  await expect(page.getByRole("region", { name: "Review exercise" })).toContainText("Review item 1 of 1");
});

test("listening target retains its source and moves without text in URL or requests", async ({ page }) => {
  const item: ReviewItem = { ...target, source: "audio-quiz", mode: "morse_to_text", target: "PRIVATE AUDIO TARGET", private: true };
  await page.addInitScript(({ key, raw }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, raw); }, { key: REVIEW_STORAGE_KEY, raw: serializeReviewQueue([item]) });
  const requests: string[] = [];
  page.on("request", request => requests.push(request.url() + (request.postData() ?? "")));
  await page.goto("/practice#review-queue", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start review", exact: true }).click();
  await page.getByRole("button", { name: "Open listening review" }).click();
  await expect(page).toHaveURL(/\/morse-code-audio-practice$/);
  await expect(page.getByText("Reviewing one saved listening target.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: /Restart prompt/ })).toHaveCount(0);
  await page.getByLabel("Your answer", { exact: true }).fill("WRONG");
  await page.getByRole("button", { name: /Check answer/ }).click();
  const expected = page.getByRole("region", { name: "Answer comparison" }).getByRole("heading", { name: "Expected", exact: true }).locator("..").locator("p").first();
  expect((await expected.innerText()).replaceAll("␠", " ")).toBe(item.target);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items, REVIEW_STORAGE_KEY)).toEqual([{ ...item, misses: 2 }]);
  expect(requests.join("\n")).not.toMatch(/PRIVATE[ %]AUDIO/);
  await page.getByRole("button", { name: /Next prompt/ }).click();
  await expect(page.getByText("Reviewing one saved listening target.", { exact: false })).toHaveCount(0);
});

test("custom weak words survive reload privately and clearing them preserves other exercises", async ({ page }) => {
  await page.addInitScript(({ key, raw }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, raw); }, { key: REVIEW_STORAGE_KEY, raw: serializeReviewQueue([target]) });
  await page.goto("/morse-code-word-trainer", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Custom", exact: true }).click();
  await page.getByRole("textbox").first().fill("PRIVATEWORD\nSECONDWORD");
  await page.getByLabel("Your answer", { exact: true }).fill("WRONG");
  await page.getByRole("button", { name: /Check answer/ }).click();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items, REVIEW_STORAGE_KEY);
  expect(saved).toHaveLength(2);
  expect(saved[0].private).toBe(true);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Practice weak words Practice weak words", exact: true }).first().click();
  await page.getByLabel("Your answer", { exact: true }).fill("WRONG");
  await page.getByRole("button", { name: /Check answer/ }).click();
  await expect(page.getByRole("region", { name: "Answer comparison" })).toContainText(saved[0].target);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items[0].misses, REVIEW_STORAGE_KEY)).toBe(2);
  await page.getByRole("button", { name: /Clear weak words/ }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items, REVIEW_STORAGE_KEY)).toEqual([target]);
  await expect(page.getByRole("region", { name: "Answer comparison" })).toHaveCount(0);
});

test("marking a weak-round target keeps the active prompt stable and the site clear event updates it", async ({ page }) => {
  const items: ReviewItem[] = ["ALPHA", "BRAVO", "CHARLIE"].map(text => ({ ...target, source: "word-trainer", target: text, private: true }));
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), { key: REVIEW_STORAGE_KEY, raw: serializeReviewQueue(items) });
  await page.goto("/morse-code-word-trainer", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Text to Morse", exact: true }).click();
  await page.getByRole("button", { name: "Practice weak words Practice weak words", exact: true }).first().click();
  const prompt = page.getByText("Prompt", { exact: true }).locator("..").locator("p").nth(1);
  const original = await prompt.innerText();
  await page.getByLabel("Your answer", { exact: true }).fill(".");
  await page.getByRole("button", { name: /Check answer/ }).click();
  await expect(prompt).toHaveText(original);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).items[0].private, REVIEW_STORAGE_KEY)).toBe(true);
  await page.evaluate(key => { localStorage.removeItem(key); dispatchEvent(new CustomEvent("morsewords:storage-clear", { detail: { removedKeys: [key], failedKeys: [] } })); }, REVIEW_STORAGE_KEY);
  await expect(page.getByRole("button", { name: "Practice weak words Practice weak words", exact: true }).first()).toBeDisabled();
  await expect(prompt).toHaveText(original);
});
