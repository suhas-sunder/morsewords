import { expect, test } from "@playwright/test";
import { diagnoseTextInput } from "../../app/client/components/shared/textDiagnostics";
import { textToMorse, normalizeTextForMorse } from "../../app/client/components/shared/morseUtils";
import { blockExternalNetwork } from "./helpers";

test("original spans survive repeated emoji, combining accents, smart marks and whitespace", () => {
  const raw = "Hi 😀😀\ne\u0301 \tＡ—‘’ Â· #";
  const result = diagnoseTextInput(raw);
  expect(result.normalizedInput).toBe(normalizeTextForMorse(raw));
  expect(result.issues.filter(i => i.kind === "unsupported").map(i => raw.slice(i.start, i.end))).toEqual(["😀", "😀", "e\u0301", "#"]);
  expect(result.issues.find(i => i.source === "e\u0301")).toMatchObject({ line: 2, column: 1, omitted: "É" });
  expect(result.issues.find(i => i.source === "Â·")).toMatchObject({ normalized: "." });
  expect(textToMorse("sos test 123")).toBe("...   ---   ...       -   .   ...   -       .----   ..---   ...--");
  expect(textToMorse("Ａ—‘’ Â·")).toBe(textToMorse("A-'' ."));
});

test("long pastes retain counts with bounded output and practical processing cost", () => {
  const start = performance.now();
  const result = diagnoseTextInput(("Hello 😀 \t").repeat(10_000));
  expect(result.unsupported).toBe(10_000);
  expect(result.issues.length).toBeLessThanOrEqual(24);
  expect(performance.now() - start).toBeLessThan(2500);
  expect(diagnoseTextInput("hello world").issues).toEqual([]);
  expect(diagnoseTextInput("").issues).toEqual([]);
});

for (const width of [390, 768, 1440]) test(`diagnostics locate original input and keep output stable at ${width}`, async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width, height: 844 });
  for (const route of ["/", "/morse-code-encoder", "/morse-code-international-translator"]) {
    await page.goto(route);
    await expect(page.getByTestId("advanced-settings-toggle")).toBeEnabled();
    const input = page.locator('textarea:not([readonly])').first();
    await input.fill("Hi 😀😀\ne\u0301 \tＡ—‘’ #");
    const details = page.locator('[data-text-diagnostics]');
    await details.locator('summary').click();
    await expect(details).toContainText("unsupported");
    if (route.includes("international")) await expect(details).toContainText("not the original script");
    await details.getByRole('button', { name: /Select unsupported/ }).first().click();
    const selection = await page.evaluate(() => {
      const el = document.activeElement as HTMLTextAreaElement;
      return el.value.slice(el.selectionStart, el.selectionEnd);
    });
    expect(selection).toBe("😀");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await details.screenshot({ path: info.outputPath(`${route.replaceAll('/', '') || 'home'}-${width}.png`) });
    await input.fill("SOS TEST 123");
    await expect(page.locator('#mw_output')).toHaveValue(textToMorse("SOS TEST 123"));
    await input.fill("");
    await expect(details.locator('summary')).toHaveCount(0);
    expect(errors).toEqual([]);
  }
});
