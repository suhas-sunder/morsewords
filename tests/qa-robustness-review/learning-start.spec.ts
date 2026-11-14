import { expect, test } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";
import { deterministicPrompt, randomPrompt } from "../../app/client/components/practice/practiceEngine";
import { LEARNING_SESSIONS, STARTER_CHARACTERS, requestLearningSession, takeLearningSession } from "../../app/client/components/learning/learningSessions";

test("starter membership matches the existing guide and goal handoff is bounded and one-use", () => {
  expect(STARTER_CHARACTERS.map(item => item.letter)).toEqual(["E", "T", "A", "N", "I", "M", "S", "O"]);
  expect(deterministicPrompt("morse_to_text", "starter").plain).toBe("E");
  for (let i = 0; i < 100; i++) expect(STARTER_CHARACTERS.map(item => item.letter)).toContain(randomPrompt("mixed", "starter").plain);
  requestLearningSession("first");
  expect(takeLearningSession("/practice")?.practice).toEqual({ pool: "starter", mode: "morse_to_text" });
  expect(takeLearningSession("/practice")).toBeNull();
  requestLearningSession("listening");
  expect(takeLearningSession("/typing")).toBeNull();
  expect(takeLearningSession("/morse-code-audio-practice")).toBeNull();
  requestLearningSession("not-a-goal");
  expect(takeLearningSession("/practice")).toBeNull();
  const clock = Date.now;
  try {
    Date.now = () => 1000;
    requestLearningSession("first");
    Date.now = () => 301001;
    expect(takeLearningSession("/practice")).toBeNull();
  } finally { Date.now = clock; }
  expect(LEARNING_SESSIONS.every(item => !item.href.includes("?"))).toBe(true);
});

for (const route of ["/practice", "/learn-morse-code"]) for (const width of [390, 768, 1440]) {
  test(`${route} provides a keyboard session start at ${width}px`, async ({ page }, info) => {
    await blockExternalNetwork(page);
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(route, { waitUntil: "networkidle" });
    const chooser = page.getByRole("region", { name: "Start a learning session" });
    await expect(chooser).toContainText("No account needed");
    const choice = page.getByRole("combobox", { name: "What would you like to practice?" });
    const restingFill = await choice.evaluate(element => getComputedStyle(element).backgroundColor);
    await page.getByRole("combobox", { name: "What would you like to practice?" }).focus();
    expect(await choice.evaluate(element => getComputedStyle(element).backgroundColor)).toBe(restingFill);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Start session", exact: true })).toBeFocused();
    await page.screenshot({ path: info.outputPath(`w18-chooser-${width}.png`) });
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/practice(?:#practice-workspace)?$/);
    await expect(page.getByLabel("Practice answer")).toBeFocused();
    expect(await page.getByLabel("Practice answer").evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
    await expect(page.getByText("First characters: E T A N I M S O")).toBeVisible();
    await expect(page.getByLabel("Practice answer")).toHaveValue("");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await page.screenshot({ path: info.outputPath(`w18-exercise-${width}.png`) });
  });
}

test("choosing a drill overrides stale per-pool settings atomically and later manual choices persist", async ({ page }) => {
  await blockExternalNetwork(page);
  await page.addInitScript(() => {
    if (sessionStorage.getItem("w18-seeded")) return;
    sessionStorage.setItem("w18-seeded", "1");
    localStorage.setItem("mw_practice_mode_letters", "text_to_morse");
    localStorage.setItem("mw_practice_best_streak_letters", "17");
    localStorage.setItem("mw_practice_best_streak_all", "9");
  });
  await page.goto("/practice", { waitUntil: "networkidle" });
  await page.getByRole("combobox", { name: "What would you like to practice?" }).selectOption("visual");
  await page.getByRole("button", { name: "Start session", exact: true }).click();
  await expect(page.getByLabel("Practice answer")).toHaveAttribute("placeholder", /Type text/);
  expect(await page.evaluate(() => localStorage.getItem("mw_practice_mode_letters"))).toBe("morse_to_text");
  expect(await page.evaluate(() => localStorage.getItem("mw_practice_best_streak_letters"))).toBe("17");
  expect(await page.evaluate(() => localStorage.getItem("mw_practice_best_streak_all"))).toBe("9");
  await page.getByRole("button", { name: "Text → Morse", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByLabel("Practice answer")).toHaveAttribute("placeholder", /Type Morse/);
  await page.getByRole("button", { name: "Skip chooser", exact: true }).click();
  await expect(page.getByLabel("Practice answer")).toBeFocused();
  await page.getByRole("button", { name: "Choose another path", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "What would you like to practice?" })).toBeFocused();
  await page.getByRole("combobox", { name: "What would you like to practice?" }).selectOption("words");
  await page.getByRole("button", { name: "Start session", exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem("mw_practice_pool"))).toBe("words");
  await expect(page.getByLabel("Practice answer")).toHaveAttribute("placeholder", /Type Morse/);
});

for (const goal of ["listening", "typing"]) test(`${goal} opens its configured exercise without autoplay or a persistent URL intent`, async ({ page }) => {
  await blockExternalNetwork(page);
  await page.addInitScript(() => {
    localStorage.setItem("mw_audio_practice_difficulty", "hard");
    localStorage.setItem("mw_typing_duration_sec", "120");
    const tracked = window as typeof window & { __w18SignalStarts: number };
    tracked.__w18SignalStarts = 0;
    const Context = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    // Windows WebKit has no native audio backend. A constructor probe checks
    // absence of playback dispatch there; it does not claim audible output.
    const ObservedContext = Context ? new Proxy(Context, {
      construct(target, args) { tracked.__w18SignalStarts++; return Reflect.construct(target, args); },
    }) : class {
      constructor() { tracked.__w18SignalStarts++; throw new Error("Unexpected audio start before interaction"); }
    };
    Object.defineProperty(window, "AudioContext", { value: ObservedContext, configurable: true });
    Object.defineProperty(window, "webkitAudioContext", { value: ObservedContext, configurable: true });
  });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/learn-morse-code", { waitUntil: "networkidle" });
  await page.getByRole("combobox", { name: "What would you like to practice?" }).selectOption(goal);
  await page.getByRole("button", { name: "Start session", exact: true }).click();
  await expect(page).toHaveURL(goal === "typing" ? /\/typing$/ : /\/morse-code-audio-practice$/);
  await expect.poll(() => page.evaluate(key => localStorage.getItem(key), goal === "typing" ? "mw_typing_duration_sec" : "mw_audio_practice_difficulty")).toBe(goal === "typing" ? "30" : "beginner");
  if (goal === "typing") await expect(page.getByRole("button", { name: "Set session duration to 30s" })).toBeEnabled();
  else await expect(page.getByRole("button", { name: /^Play prompt/ })).toBeEnabled();
  expect(await page.evaluate(() => (window as typeof window & { __w18SignalStarts: number }).__w18SignalStarts)).toBe(0);
  expect(errors).toEqual([]);
});

test("learning intent works without storage and answers never enter requests or URLs", async ({ page }) => {
  await blockExternalNetwork(page);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
  });
  const outgoing: string[] = [];
  page.on("request", request => outgoing.push(request.url() + (request.postData() ?? "")));
  await page.goto("/learn-morse-code", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start session", exact: true }).click();
  await expect(page.getByText("First characters: E T A N I M S O")).toBeVisible();
  await page.getByLabel("Practice answer").fill("PRIVATE_LEARNING_SENTINEL");
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Not quite" })).toBeVisible();
  expect(outgoing.join("\n")).not.toContain("PRIVATE_LEARNING_SENTINEL");
  expect(page.url()).not.toContain("PRIVATE_LEARNING_SENTINEL");
});

test("skipping the guide chooser retains keyboard focus and preserves guide access", async ({ page }) => {
  await blockExternalNetwork(page);
  await page.goto("/learn-morse-code", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Skip chooser", exact: true }).click();
  await expect(page.getByRole("button", { name: "Choose another path", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("combobox", { name: "What would you like to practice?" })).toBeFocused();
  await expect(page.locator('h1')).toHaveText("Learn Morse Code");
});
