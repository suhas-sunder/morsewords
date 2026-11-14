import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";

const fixtureRoot = "app/client/assets/books/cloudflare-export";
const read = (file: string) => JSON.parse(fs.readFileSync(file, "utf8"));
const alice = "alices-adventures-in-wonderland";

for (const width of [390, 768, 1440]) for (const mode of ["books", "audiobooks"]) {
  test(`${mode} payload isolation retains loader context and full-content readiness at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
    await blockExternalNetwork(page);
    const requests: string[] = [];
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.route("https://assets.morsewords.com/**", async route => {
      const pathname = new URL(route.request().url()).pathname;
      requests.push(pathname);
      const body = fs.readFileSync(`${fixtureRoot}${pathname}`);
      await route.fulfill({ contentType: "application/json", body, headers: { "access-control-allow-origin": "*" } });
    });
    const response = await page.goto(`/morse-code-${mode}/${alice}`);
    expect(response?.status()).toBe(200);
    const html = await response!.text();
    expect(html).toContain("Lewis Carroll");
    expect(html).toContain("through-the-looking-glass");
    const workspace = page.locator('[data-mw-morse-book-page="true"]');
    await expect(workspace).toHaveAttribute("data-mw-morse-book-preview-state", "ready");
    await expect(workspace).toHaveAttribute("data-mw-morse-book-settings-restored", "true");
    await expect(page.getByTestId("morse-book-related-author")).toContainText("Through the Looking-Glass");
    const serialized = await page.evaluate(() => {
      const state = (window as unknown as { __reactRouterContext: { state: { loaderData: Record<string, { relatedBooks?: unknown[]; titleVariant?: string }> } } }).__reactRouterContext.state.loaderData;
      const data = Object.values(state).find(v => v?.relatedBooks)!;
      return { related: data.relatedBooks, bytes: JSON.stringify(state).length };
    });
    expect(serialized.related).toHaveLength(1);
    expect(serialized.bytes).toBeLessThan(43_000);
    expect(requests).toContain(`/books/${alice}.json`);
    expect(requests).not.toContain("/public-manifest.json");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await page.screenshot({ path: info.outputPath(`w17-${mode}-${width}.png`) });
  });
}

for (const changedVersion of [false, true]) test(`content integrity ${changedVersion ? "retains verified remote-version compatibility" : "rejects a mismatched book"}`, async ({ page }) => {
  await blockExternalNetwork(page);
  const payload = read(`${fixtureRoot}/books/${alice}.json`);
  const remote = read(`${fixtureRoot}/public-manifest.json`);
  payload.manifest.contentHash = "different-approved-source-version";
  if (!changedVersion) payload.slug = "wrong-title";
  // Existing export identity is independent of the source-version identity.
  const exported = remote.books.find((b: { slug: string }) => b.slug === alice);
  expect(exported.contentHash).toBe(payload.contentHash);
  let indexRequests = 0;
  await page.route("https://assets.morsewords.com/**", route => {
    const index = new URL(route.request().url()).pathname.endsWith("public-manifest.json");
    if (index) indexRequests++;
    return route.fulfill({ contentType: "application/json", body: JSON.stringify(index ? remote : payload), headers: { "access-control-allow-origin": "*" } });
  });
  await page.goto(`/morse-code-books/${alice}`);
  if (changedVersion) await expect(page.locator('[data-mw-morse-book-page="true"]')).toHaveAttribute("data-mw-morse-book-preview-state", "ready");
  else await expect(page.getByTestId("morse-book-excerpt-only")).toBeVisible();
  expect(indexRequests).toBe(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Alice");
});
