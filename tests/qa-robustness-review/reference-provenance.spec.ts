import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getMorseReferenceSource } from "../../app/client/data/morseReferenceSources";
import { TEXT_TO_MORSE, morseToText } from "../../app/client/components/shared/morseUtils";
import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

test("all compatibility characters have the correct source scope without remapping", () => {
  const standardPunctuation = new Set(['.', ',', ':', '?', "'", '-', '/', '(', ')', '"', '=', '+', '@']);
  const extensions = new Set(['!', ';', '&', '_']);
  for (const [character, pattern] of Object.entries(TEXT_TO_MORSE)) {
    const source = getMorseReferenceSource(character);
    expect(source, character).not.toBeNull();
    expect(source!.standard, character).toBe(/^[A-Z0-9]$/.test(character) || standardPunctuation.has(character));
    expect(source!.section).toBe(/^[A-Z]$/.test(character) ? '1.1.1' : /^[0-9]$/.test(character) ? '1.1.2' : '1.1.3');
    if (extensions.has(character)) expect(source!.note).toContain('not listed as this punctuation');
    expect(morseToText(pattern)).toBe(character);
  }
  expect(getMorseReferenceSource('unrecognized')).toBeNull();
});

test.beforeEach(async ({ page }) => { await blockExternalNetwork(page); });

test("punctuation shows standard versus extension evidence and operating collisions", async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.goto('/morse-code-punctuation', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-mw-reference-character]')).toHaveCount(17);
  await expect(page.getByText('Compatibility extension', { exact: true })).toHaveCount(4);
  await expect(page.getByText('ITU written character', { exact: true })).toHaveCount(13);
  const extension = page.locator('[data-mw-reference-character="!"]');
  await expect(extension).toContainText('not listed as this punctuation');
  await expect(extension.getByRole('link')).toHaveAttribute('href', /PDF-E\.pdf#page=5$/);
  await expect(page.locator('[data-mw-reference-character="&"]')).toContainText('wait signal, not an ampersand');
  await expect(page.locator('[data-mw-reference-character="+"]')).toContainText('AR, marking the end');
  await expect(page.locator('[data-mw-reference-character="="]')).toContainText('BT, a separator');
  await page.locator('.mw-reference-row').first().getByRole('button', { name: /Play/ }).click();
  expect((await new AxeBuilder({ page }).include('.mw-reference-table').analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("dictionary filtering and copy preserve punctuation while exposing scope", async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/dictionary', { waitUntil: 'networkidle' });
  await page.locator('#dictionary-filter').fill('Semicolon');
  const source = page.locator('[data-mw-reference-character=";"]:visible');
  await expect(source).toContainText('Compatibility extension');
  await page.getByRole('button', { name: 'Copy Morse', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('-.-.-.');
  await page.getByRole('button', { name: 'Clear filter' }).click();
  await page.locator('#dictionary-filter').fill('Letter A');
  await expect(page.locator('[data-mw-reference-character="A"]')).toHaveCount(0);
  await expect(page.getByTestId('international-morse-source-note')).toHaveCount(1);
  await expect(page.getByTestId('international-morse-source-note')).toContainText('sections 1.1.1 and 1.1.2');
  await page.getByRole('button', { name: 'Clear filter' }).click();
  expect(await page.locator('[data-mw-reference-character]:visible').count()).toBeLessThanOrEqual(7);
  await page.locator('#dictionary-filter').fill('Plus');
  await expect(page.locator('[data-mw-reference-character="+"]:visible')).toContainText('AR, marking the end');
});

test("shared reference tables stay opt-in on existing reference consumers", async ({ page }) => {
  for (const route of ['/', '/audio', '/international-morse-code-reference', '/morse-code-prosigns', '/morse-code-q-codes']) {
    await page.goto(route, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-mw-reference-character]')).toHaveCount(0);
  }
});
