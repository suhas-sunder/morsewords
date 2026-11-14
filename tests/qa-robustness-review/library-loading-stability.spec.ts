import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { startNetlifyBuildServer } from "../../scripts/serve-netlify-build.mjs";

const slug = "alices-adventures-in-wonderland";
const payload = fs.readFileSync(`app/client/assets/books/cloudflare-export/books/${slug}.json`, "utf8");
const manifest = fs.readFileSync("app/client/assets/books/cloudflare-export/public-manifest.json", "utf8");
const preview = fs.readFileSync(`public/book-previews/${slug}.preview.json`, "utf8");
let server: Awaited<ReturnType<typeof startNetlifyBuildServer>>;
test.beforeAll(async () => { server = await startNetlifyBuildServer(0, { configure(app) { app.use((req, res, next) => req.path.startsWith("/book-previews/") ? res.status(503).end("Delayed preview fixture") : next()); } }); });
test.afterAll(async () => { await server?.close(); });

for (const width of [390, 768, 1440]) for (const mode of ["books", "audiobooks"]) {
  test(`${mode} loading transitions reserve useful space at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("-dark") ? "dark" : "light");
    let releasePreview!: () => void, releaseFull!: () => void;
    const previewGate = new Promise<void>(resolve => { releasePreview = resolve; });
    const fullGate = new Promise<void>(resolve => { releaseFull = resolve; });
    await page.addInitScript(() => {
      const measurements: { value: number; recentInput: boolean }[] = [];
      Object.assign(window, { loadingLayoutShifts: measurements });
      if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) new PerformanceObserver(list => {
        for (const entry of list.getEntries()) { const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }; measurements.push({ value: shift.value, recentInput: shift.hadRecentInput }); }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.route("**/*", async route => {
      const url = new URL(route.request().url());
      if (url.pathname.includes("/book-previews/")) { await previewGate; return route.fulfill({ contentType: "application/json", body: preview }); }
      if (url.hostname === "127.0.0.1") return route.continue();
      if (url.hostname === "assets.morsewords.com") {
        if (url.pathname === "/public-manifest.json") return route.fulfill({ contentType: "application/json", body: manifest });
        await fullGate;
        return route.fulfill({ contentType: "application/json", body: payload });
      }
      return route.abort();
    });
    const sample = async () => page.evaluate(() => {
      const rectangle = (selector: string) => { const node = document.querySelector(selector); const r = node?.getBoundingClientRect(); return r ? { top: r.top, height: r.height } : null; };
      return { loading: rectangle('[data-testid="morse-book-loading"]'), h1: rectangle('h1'), context: rectangle('[data-testid="morse-book-failure-context"]'), footer: rectangle('footer'), overflow: document.documentElement.scrollWidth > innerWidth, shifts: (window as typeof window & { loadingLayoutShifts: { value: number; recentInput: boolean }[] }).loadingLayoutShifts };
    });
    try {
      await page.goto(`${server.baseUrl}/morse-code-${mode}/${slug}`);
      await expect(page.getByTestId("morse-book-loading")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const loading = await sample();
      if (!process.env.MW_LOADING_BASELINE) expect(loading.loading!.height).toBeGreaterThan(450);
      expect(loading.overflow).toBe(false);
      await page.screenshot({ path: info.outputPath("loading.png") });
      releasePreview();
      await expect(page.locator('[data-mw-morse-book-preview-state="preview"]')).toBeVisible();
      await page.screenshot({ path: info.outputPath("preview.png") });
      const excerpt = await sample();
      releaseFull();
      await expect(page.locator('[data-mw-morse-book-preview-state="ready"]')).toBeVisible();
      await page.screenshot({ path: info.outputPath("ready.png") });
      const ready = await sample();
      expect(ready.overflow).toBe(false);
      if (!process.env.MW_LOADING_BASELINE) expect(ready.h1!.top).toBe(loading.h1!.top);
      await info.attach("loading-transition-lab.json", { body: JSON.stringify({ width, mode, loading, excerpt, ready, note: "Deterministic local lab shifts; not field CWV. WebKit may not expose LayoutShift." }, null, 2), contentType: "application/json" });
    } finally { releasePreview(); releaseFull(); }
  });
}
