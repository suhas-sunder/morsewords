import { expect, test } from "@playwright/test";
import { morseToText } from "../../app/client/components/shared/morseUtils";
import { stageMorseHandoff, takeMorseDraft, returnMorseDraft, HANDOFF_LIMIT } from "../../app/client/components/shared/morseHandoff";
import { blockExternalNetwork } from "./helpers";

test("failed groups retain exact tokens and normalized positions; actual punctuation stays distinct", () => {
  const result = morseToText("..--.. ........ / ........ ...---...", { returnResult: true });
  expect(result.value).toBe("?? ??");
  expect(result.issues).toEqual([
    { type: "unknown-morse-token", value: "........", wordIndex: 0, groupIndex: 1 },
    { type: "unknown-morse-token", value: "........", wordIndex: 1, groupIndex: 0 },
    { type: "unknown-morse-token", value: "...---...", wordIndex: 1, groupIndex: 1 },
  ]);
  expect(morseToText("..--..", { returnResult: true }).issues).toEqual([]);
});

test("handoff is explicit, bounded, single-consumption and route restricted", () => {
  expect(stageMorseHandoff("https://elsewhere.invalid", "secret")).toBe(false);
  expect(stageMorseHandoff("/morse-code-decoder", ".".repeat(HANDOFF_LIMIT + 1))).toBe(false);
  expect(stageMorseHandoff("/morse-code-decoder", "........")).toBe(true);
  expect(takeMorseDraft("/morse-code-word-separator")).toBe("........");
  expect(takeMorseDraft("/morse-code-word-separator")).toBeNull();
  expect(returnMorseDraft("... --- ...")).toBe("/morse-code-decoder");
  expect(takeMorseDraft("/morse-code-decoder")).toBe("... --- ...");
});

for (const width of [390, 768, 1440]) test(`failed groups, local handoff and back preservation at ${width}`, async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => localStorage.setItem('morsewords-theme', theme), info.project.name.endsWith('dark') ? 'dark' : 'light');
  await page.setViewportSize({ width, height: 844 });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  const leaked: string[] = [];
  page.on('request', r => { if ((r.url() + (r.postData() ?? '')).includes('........')) leaked.push(r.url()); });
  for (const route of ['/morse-code-decoder', '/morse-code-reader', '/']) {
    await page.goto(route, { waitUntil: 'networkidle' });
    if (route === '/') await page.getByRole('button', { name: 'Morse → Text', exact: true }).click();
    const input = page.locator('textarea:not([readonly])').first();
    await input.fill('..--..');
    const diagnostic = page.locator('[data-boundary-diagnostics]');
    await expect(diagnostic).toContainText('0 unknown groups. 1 actual question-mark pattern');
    await expect(page.getByText('Reader note: ? marks', { exact: false })).toHaveCount(0);
    await input.fill('..--.. ........ / ........ ...---...');
    await expect(diagnostic).toContainText('3 unknown groups. 1 actual question-mark pattern');
    await diagnostic.locator('summary').click();
    await expect(diagnostic).toContainText('Normalized word 2, group 1: ........');
    await diagnostic.screenshot({ path: info.outputPath(`${route.replaceAll('/', '') || 'home'}-${width}.png`) });
    await diagnostic.getByRole('button', { name: 'Inspect spacing with this input' }).click();
    await expect(page.getByLabel('Paste Morse')).toHaveValue('..--.. ........ / ........ ...---...');
    expect(new URL(page.url()).search).toBe('');
    await page.goBack();
    await expect(page.locator('textarea:not([readonly])').first()).toHaveValue('..--.. ........ / ........ ...---...');
    await page.getByRole('button', { name: 'Inspect spacing with this input' }).click();
    await page.getByLabel('Paste Morse').fill('... --- ...');
    await page.getByRole('button', { name: 'Use formatted Morse in original tool' }).click();
    await expect(page.locator('textarea:not([readonly])').first()).toHaveValue('... --- ...');
    expect(new URL(page.url()).search).toBe('');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  }
  expect(leaked).toEqual([]); expect(errors).toEqual([]);
});
