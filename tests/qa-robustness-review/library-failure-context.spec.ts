import fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { startNetlifyBuildServer } from "../../scripts/serve-netlify-build.mjs";

// Run after build:netlify and books:cloudflare-export. The latter writes only
// ignored local fixtures; this suite never publishes assets or alters source files.
const slug = "alices-adventures-in-wonderland";
const fixtureRoot = "app/client/assets/books/cloudflare-export";
const payload = JSON.parse(fs.readFileSync(`${fixtureRoot}/books/${slug}.json`, "utf8"));
const manifest = fs.readFileSync(`${fixtureRoot}/public-manifest.json`, "utf8");
const selectedId = payload.manifest.sections.find((section: { id: string; includeByDefault: boolean }, index: number) => index > 2 && section.includeByDefault).id;
const settingsKey = `morsewords:book-runtime:settings:v1:${slug}:${payload.manifest.contentVersion}:${payload.manifest.contentHash}`;
const progressKey = `morsewords:book-live-preview-progress:v1:${slug}`;
const saved = JSON.stringify({ schemaVersion: 1, slug, contentVersion: payload.manifest.contentVersion, contentHash: payload.manifest.contentHash, selectionMode: "custom", selectionScopeVersion: 2, selectedSectionIds: [selectedId], exportSettings: { charWpm: 27, farnsworthWpm: 19 }, videoSettings: {}, livePlayer: { activeSectionId: selectedId, activeSegmentIndex: 0, elapsedMs: 5000, completedSectionIds: [] } });
let blockPreview = true;
let server: Awaited<ReturnType<typeof startNetlifyBuildServer>>;

test.beforeAll(async () => {
  server = await startNetlifyBuildServer(0, { configure(app) {
    app.use((req, res, next) => blockPreview && req.path.startsWith("/book-previews/") ? res.status(503).end("Simulated preview outage") : next());
  } });
});
test.afterAll(async () => { await server?.close(); });

async function prepare(page: Page) {
  let fullAvailable = false;
  await page.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") return route.continue();
    if (url.hostname === "assets.morsewords.com") {
      if (url.pathname === "/public-manifest.json") return route.fulfill({ contentType: "application/json", body: manifest, headers: { "access-control-allow-origin": "*" } });
      if (fullAvailable && url.pathname === `/books/${slug}.json`) return route.fulfill({ contentType: "application/json", body: JSON.stringify(payload), headers: { "access-control-allow-origin": "*" } });
      return route.fulfill({ status: 503, body: "Simulated full-content outage", headers: { "access-control-allow-origin": "*" } });
    }
    return route.abort("blockedbyclient");
  });
  await page.addInitScript(({ settingsKey, saved, progressKey }) => {
    localStorage.setItem(settingsKey, saved);
    localStorage.setItem(progressKey, "protected-full-book-progress");
  }, { settingsKey, saved, progressKey });
  return () => { fullAvailable = true; };
}

async function expectRestored(page: Page) {
  const workspace = page.locator("[data-mw-morse-book-page]");
  await expect(workspace).toHaveAttribute("data-mw-morse-book-preview-state", "ready");
  await expect(workspace).toHaveAttribute("data-mw-morse-book-settings-restored", "true");
  await expect(page.locator("[data-mw-morse-book-translator-source-sections]")).toHaveAttribute("data-mw-morse-book-translator-source-sections", selectedId);
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).exportSettings.charWpm, settingsKey)).toBe(27);
}

for (const mode of ["books", "audiobooks"]) {
  test(`${mode}: missing preview and full content retain real SSR context and recover on Retry`, async ({ page }) => {
    blockPreview = true;
    const recover = await prepare(page);
    const response = await page.goto(`${server.baseUrl}/morse-code-${mode}/${slug}`);
    expect(response?.status()).toBe(200);
    const html = await response!.text();
    const ssr = await page.evaluate(html => {
      const document = new DOMParser().parseFromString(html, "text/html");
      document.querySelectorAll("script").forEach(node => node.remove());
      return { context: document.querySelector('[data-testid="morse-book-failure-context"]')?.textContent, canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"), h1s: document.querySelectorAll("h1").length };
    }, html);
    expect(ssr.context).toContain("Lewis Carroll");
    expect(ssr.context!.length).toBeGreaterThan(250);
    expect(ssr.canonical).toBe(`https://www.morsewords.com/morse-code-${mode}/${slug}`);
    expect(ssr.h1s).toBe(1);
    await expect(page.getByTestId("morse-book-load-error")).toBeVisible();
    await expect(page.getByTestId("morse-book-load-error")).toHaveCSS("min-height", "0px");
    expect((await new AxeBuilder({ page }).include('[data-testid="morse-book-load-error"]').include('[data-testid="morse-book-failure-context"]').analyze()).violations).toEqual([]);
    await expect(page.getByTestId("morse-book-failure-context").getByRole("link", { name: /Source:/ })).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/11");
    await expect(page.getByRole("link", { name: mode === "books" ? "Translate your own text" : "Make Morse audio from your text" })).toHaveAttribute("href", mode === "books" ? "/morse-code-book-translator" : "/audio");
    expect(await page.evaluate(key => localStorage.getItem(key), settingsKey)).toBe(saved);
    recover();
    await page.getByRole("button", { name: "Retry", exact: true }).focus();
    await page.keyboard.press("Enter");
    await expectRestored(page);
    await expect(page.getByTestId("morse-book-load-error")).toHaveCount(0);
  });

  test(`${mode}: excerpt remains usable without replacing saved full-book settings`, async ({ page }) => {
    blockPreview = false;
    const recover = await prepare(page);
    await page.goto(`${server.baseUrl}/morse-code-${mode}/${slug}`);
    const workspace = page.locator("[data-mw-morse-book-page]");
    await expect(page.getByTestId("morse-book-excerpt-only")).toBeVisible();
    expect((await new AxeBuilder({ page }).include('[data-testid="morse-book-excerpt-only"]').analyze()).violations).toEqual([]);
    await expect(workspace).toHaveAttribute("data-mw-morse-book-preview-state", "preview");
    await expect(workspace).toHaveAttribute("data-mw-morse-book-full-loading", "false");
    // Keep the existing explicit single-file safety contract: this 2,068-word
    // excerpt is long at the default speed. The segmented path must still work.
    await page.getByRole("radio", { name: "Split by duration", exact: true }).click();
    await expect(page.locator("[data-mw-morse-book-download-label]")).toBeEnabled();
    const play = page.getByTestId("morse-book-live-player").getByRole("button", { name: mode === "audiobooks" ? "Play selection" : "Play live player", exact: true });
    await expect(play).toBeEnabled();
    await play.click();
    const stop = page.getByTestId("morse-book-live-player").getByRole("button", { name: mode === "audiobooks" ? "Stop selection" : "Pause live player", exact: true });
    await expect(stop).toBeVisible();
    await stop.click();
    expect(await page.evaluate(key => localStorage.getItem(key), settingsKey)).toBe(saved);
    expect(await page.evaluate(key => localStorage.getItem(key), progressKey)).toBe("protected-full-book-progress");
    recover();
    await page.getByRole("button", { name: "Retry full book", exact: true }).click();
    await expectRestored(page);
    await expect(page.getByTestId("morse-book-excerpt-only")).toHaveCount(0);
  });
}
