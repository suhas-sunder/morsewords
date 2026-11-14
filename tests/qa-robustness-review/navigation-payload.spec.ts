import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { buildNavigationBookIndex } from "../../scripts/books/navigation-index";
import { parseNavigationBooks } from "../../app/client/components/navigation/navigationBooks";
import { blockExternalNetwork } from "./helpers";

const indexText = fs.readFileSync("public/navigation-books.json", "utf8");
const index = JSON.parse(indexText);
const library = JSON.parse(fs.readFileSync("app/client/assets/books/generated/library-manifest.json", "utf8"));

test("core routes keep library data out of initial client requests and retain real SSR hub links", async ({ page }) => {
  await blockExternalNetwork(page);
  const eagerLibrary: string[] = [];
  page.on('request', request => { if (/navigation-books\.json|\/assets\/morseBooks[-.]|\/app\/client\/data\/morseBooks\.ts/.test(request.url())) eagerLibrary.push(request.url()); });
  for (const route of ['/', '/audio', '/practice', '/morse-code-alphabet']) {
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    const html = await response!.text();
    const links = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('script,style').forEach(node => node.remove());
      return [...doc.querySelectorAll('a[href]')].map(link => link.getAttribute('href'));
    }, html);
    expect(links).toContain('/morse-code-books');
    expect(links).toContain('/morse-code-audiobooks');
    expect(eagerLibrary).toEqual([]);
  }
});

test("generated discovery index follows canonical eligibility, titles, authors, ordering and aliases", () => {
  expect(index).toEqual(buildNavigationBookIndex(library.books));
  const items = parseNavigationBooks(index);
  expect(new Set(items.map(item => item.href)).size).toBe(items.length);
  expect(items.length).toBe(524);
  expect(items.find(item => item.href.endsWith('/a-scandal-in-bohemia'))?.searchKeywords).toContain('Sherlock Holmes');
  const unpublished = structuredClone(library.books[0]); unpublished.source.publishReady = false;
  expect(buildNavigationBookIndex([unpublished]).books).toEqual([]);
  expect(() => parseNavigationBooks({ schemaVersion: 1, books: [['https://elsewhere.test', 'Title', '', '']] })).toThrow();
  expect(() => parseNavigationBooks({ schemaVersion: 1, books: [index.books[0], index.books[0]] })).toThrow();
  // Prevent accidental reintroduction of a full runtime-data edge in the shell.
  expect(fs.readFileSync('app/client/components/navigation/NavBar.tsx', 'utf8')).not.toMatch(/from ["'].*data\/morseBooks["']/);
  expect(Buffer.byteLength(indexText)).toBeLessThan(100_000);
});

for (const width of [390, 768, 1440]) test(`menu loads book search only on demand, retries and caches at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(theme => localStorage.setItem('morsewords-theme', theme), info.project.name.endsWith('-dark') ? 'dark' : 'light');
  await blockExternalNetwork(page);
  let attempts = 0, fail = true, release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/navigation-books.json', async route => {
    attempts++;
    if (fail) { await gate; return route.fulfill({ status: 503, body: 'Fixture unavailable' }); }
    return route.fulfill({ contentType: 'application/json', body: indexText });
  });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    const response = await page.goto('/audio', { waitUntil: 'networkidle' });
    const html = await response!.text();
    expect(html).toContain('href="/morse-code-books"');
    expect(html).toContain('href="/morse-code-audiobooks"');
    expect(attempts).toBe(0);
    const trigger = page.getByRole('button', { name: width < 1180 ? 'Open navigation' : 'More', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: width < 1180 ? 'Mobile navigation' : 'More MorseWords tools', exact: true });
    const search = dialog.getByRole('searchbox');
    await expect(search).toBeFocused();
    await expect(dialog.locator('[data-mw-book-search-state]')).toHaveAttribute('data-mw-book-search-state', 'loading');
    await search.fill('audio decoder');
    await expect(dialog.locator('a[href="/morse-code-audio-decoder"]')).toBeVisible();
    await search.fill('');
    await page.screenshot({ path: info.outputPath(`navigation-${width}-loading.png`) });
    release();
    await expect(dialog.getByRole('button', { name: 'Retry book search' })).toBeVisible();
    await page.screenshot({ path: info.outputPath(`navigation-${width}-error.png`) });
    await search.fill('Lewis Carroll');
    fail = false;
    await dialog.getByRole('button', { name: 'Retry book search' }).click();
    await expect(search).toBeFocused();
    await expect(dialog.locator('a[href="/morse-code-books/alices-adventures-in-wonderland"]')).toBeVisible();
    await expect(dialog.locator('[data-mw-book-search-state]')).toHaveAttribute('data-mw-book-search-state', 'ready');
    await page.screenshot({ path: info.outputPath(`navigation-${width}-results.png`) });
    await search.fill('Sherlock Holmes Chapter 1');
    await expect(dialog.locator('a[href="/morse-code-books/a-scandal-in-bohemia"]')).toBeVisible();
    await search.fill('zzzznotatitle');
    await expect(dialog).toContainText('No tools match that search');
    await search.fill('');
    await expect(dialog.getByRole('link', { name: /^Morse book library/ })).toBeVisible();
    await expect(dialog.getByRole('link', { name: /^Morse audiobook library/ })).toBeVisible();
    await expect(dialog.locator('a[href^="/morse-code-books/"]')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await search.fill('time machine');
    await expect(dialog.locator('a[href="/morse-code-books/the-time-machine"]')).toBeVisible();
    expect(attempts).toBe(2);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { release(); }
});
