import { expect, test } from "@playwright/test";
import { compareAnswerElements, describeDifference } from "../../app/client/components/learning/answerDifferences";
import { checkAnswer } from "../../app/client/components/practice/practiceEngine";
import { blockExternalNetwork } from "./helpers";

test.beforeEach(async ({ page }, info) => {
  await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
});

test("comparison explains replacement, omission and insertion without becoming a second grader", () => {
  expect(compareAnswerElements("..", "..").differences).toEqual([]);
  const replaced = compareAnswerElements("..", ".-");
  expect(replaced.differences.map(item => item.kind)).toEqual(["replace"]);
  expect(describeDifference(replaced.differences[0], true)).toBe("Position 2: expected dot, entered dash.");
  expect(compareAnswerElements("..", ".").differences.map(item => item.kind)).toEqual(["missing"]);
  expect(compareAnswerElements("..", "...").differences.map(item => item.kind)).toEqual(["extra"]);
  expect(compareAnswerElements("ABC", "AXBC").count).toBe(1);
  expect(compareAnswerElements("ABC", "AC").count).toBe(1);
  const equivalent = checkAnswer({ kind: "text_to_morse", plain: "A", morse: ".-", label: "Letter" }, "  .-  ");
  expect(equivalent.ok).toBe(true);
  expect(compareAnswerElements(equivalent.normalizedExpected, equivalent.normalizedGot).count).toBe(0);
  const bounded = compareAnswerElements("A".repeat(20000), "Z".repeat(20000));
  expect(bounded.truncated).toBe(true);
  expect(bounded.expected).toHaveLength(240);
  expect(bounded.differences).toHaveLength(1);
  expect(bounded.count).toBe(240);
  expect(compareAnswerElements("A", "XYZ A").differences[0].attempted).toBe("XYZ ");
  expect(compareAnswerElements("😀".repeat(120), "😀".repeat(120)).truncated).toBe(false);
});

for (const [attempt, expectedExplanation] of [[".-", "expected dot, entered dash"], [".", "missing dot"], ["...", "extra dot"]]) {
  test(`practice compares ${attempt} with the submitted target and preserves retry`, async ({ page }, info) => {
    await blockExternalNetwork(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      Math.random = () => 0.55; // I from the canonical eight-character starter bank.
      localStorage.setItem("mw_practice_pool", "starter");
      localStorage.setItem("mw_practice_mode_starter", "text_to_morse");
    });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/practice", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Skip chooser", exact: true }).click();
    const answer = page.getByLabel("Practice answer");
    await expect(answer).toHaveAttribute("placeholder", /Type Morse/);
    await expect(page.getByRole("button", { name: "Compare submitted answer" })).toHaveCount(0);
    await answer.fill(attempt);
    await answer.press("Enter");
    await expect(page.getByRole("region", { name: "Answer comparison" })).toHaveCount(0);
    const reveal = page.getByRole("button", { name: "Compare submitted answer" });
    await reveal.focus();
    await page.keyboard.press("Enter");
    const comparison = page.getByRole("region", { name: "Answer comparison" });
    await expect(comparison).toContainText(expectedExplanation);
    await expect(comparison.getByRole("status")).toContainText("1 difference");
    await expect(comparison.locator("mark").first()).toBeVisible();
    await answer.fill("PRIVATE_EDIT_AFTER_SUBMIT");
    await expect(comparison).not.toContainText("PRIVATE_EDIT_AFTER_SUBMIT");
    await comparison.scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath("w19-feedback-390.png") });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await answer.fill("..");
    await answer.press("Enter");
    await expect(page.getByRole("status").filter({ hasText: "Your answer matches" })).toBeVisible();
    await page.getByRole("button", { name: "Next prompt", exact: true }).click();
    await expect(comparison).toHaveCount(0);
    await page.getByRole("button", { name: "Skip question", exact: true }).click();
    await expect(comparison).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

for (const route of ["/morse-code-audio-practice", "/morse-code-audio-quiz", "/morse-code-word-trainer", "/morse-code-visual-quiz", "/morse-code-sentence-practice"]) for (const width of [390, 768, 1440]) {
  test(`${route} at ${width}px exposes comparison only after checking and clears it for the next task`, async ({ page }, info) => {
    await blockExternalNetwork(page);
    await page.setViewportSize({ width, height: 844 });
    const requests: string[] = [];
    const errors: string[] = [];
    page.on("request", request => requests.push(request.url() + (request.postData() ?? "")));
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(route, { waitUntil: "networkidle" });
    const comparison = page.getByRole("region", { name: "Answer comparison" });
    await expect(comparison).toHaveCount(0);
    const answer = route.includes("sentence") ? page.getByLabel("Sentence practice answer")
      : page.getByLabel("Your answer", { exact: true });
    await answer.fill("PRIVATE_FEEDBACK_SENTINEL");
    const check = page.getByRole("button", { name: route.includes("sentence") ? /Check sentence/ : /Check answer/ });
    await check.click();
    const reveal = page.getByRole("button", { name: "Compare submitted answer" });
    if (await reveal.count()) await reveal.click();
    await expect(comparison).toBeVisible();
    await expect(comparison.getByRole("heading", { name: "Submitted", exact: true })).toBeVisible();
    await expect(comparison.getByRole("status")).toContainText(/difference|unsupported/);
    await comparison.scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`w19-comparison-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const next = page.getByRole("button", { name: route.includes("word-trainer") ? /Skip \/ next/ : route.includes("visual") ? /Skip prompt/ : route.includes("sentence") ? /Skip sentence/ : route.includes("audio-quiz") ? /Next question|Finish quiz/ : /Next prompt/ });
    await next.click();
    await expect(comparison).toHaveCount(0);
    expect(requests.join("\n")).not.toContain("PRIVATE_FEEDBACK_SENTINEL");
    expect(errors).toEqual([]);
  });
}

test("native audio replay preserves submitted feedback and the score", async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.goto("/morse-code-audio-practice", { waitUntil: "networkidle" });
  const supported = await page.evaluate(() => Boolean(window.AudioContext));
  test.skip(!supported, "Windows WebKit has no native audio backend; shared ownership uses separate harness coverage.");
  await page.getByLabel("Your answer", { exact: true }).fill("WRONG ANSWER");
  await page.getByRole("button", { name: /Check answer/ }).click();
  const comparison = page.getByRole("region", { name: "Answer comparison" });
  const before = await comparison.innerText();
  const stats = page.locator("main span").filter({ hasText: /^Accuracy/ }).first();
  const accuracy = await stats.innerText();
  await page.getByRole("button", { name: "Repeat", exact: true }).click();
  await page.getByRole("button", { name: /^Play prompt/ }).click();
  await expect(page.getByRole("button", { name: /Restart prompt/ })).toBeVisible();
  await page.getByRole("button", { name: /Stop audio Stop/ }).click();
  expect(await comparison.innerText()).toBe(before);
  expect(await stats.innerText()).toBe(accuracy);
});
