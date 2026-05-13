import { expect, test, type Page } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";

const THEME_STORAGE_KEY = "morsewords-theme";
const REPRESENTATIVE_THEME_ROUTES = [
  "/",
  "/audio",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/morse-code-sound-generator",
  "/name-to-morse-code",
  "/morse-code-alphabet",
  "/how-to-read-morse-code",
  "/a-in-morse-code",
  "/practice",
  "/typing",
  "/morse-code-printable-chart",
  "/contact",
  "/misc/privacy-policy",
  "/sitemap",
] as const;

async function openMobileNavIfNeeded(page: Page) {
  const openNav = page.getByRole("button", { name: "Open navigation" });
  if (await openNav.isVisible().catch(() => false)) {
    await openNav.click();
  }
}

async function waitForHydration(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
}

async function getVisibleThemeToggle(page: Page, label: string) {
  let toggle = page.getByRole("button", { name: label });
  if (await toggle.isVisible().catch(() => false)) return toggle;

  await openMobileNavIfNeeded(page);
  toggle = page.getByRole("button", { name: label });
  await expect(toggle).toBeVisible();
  return toggle;
}

async function expectRootTheme(page: Page, expected: "light" | "dark") {
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.theme ?? "light"),
    )
    .toBe(expected);
}

test.describe("navbar theme mode", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("defaults to light, toggles dark, persists after reload, then returns to light", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await expectRootTheme(page, "light");

    const darkToggle = await getVisibleThemeToggle(page, "Switch to dark mode");
    await expect(darkToggle).toHaveAttribute("aria-pressed", "false");

    await darkToggle.click();
    await expectRootTheme(page, "dark");
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY))
      .toBe("dark");

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expectRootTheme(page, "dark");
    const lightToggle = await getVisibleThemeToggle(page, "Switch to light mode");
    await expect(lightToggle).toHaveAttribute("aria-pressed", "true");

    await lightToggle.click();
    await expectRootTheme(page, "light");
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY))
      .toBe("light");
  });

  test("keeps light as the default when storage is empty", async ({ page }) => {
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await expectRootTheme(page, "light");
    await expect(await getVisibleThemeToggle(page, "Switch to dark mode")).toBeVisible();
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), THEME_STORAGE_KEY))
      .toBe(null);
  });

  test("does not crash when localStorage is unavailable", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => {
      if (error.message !== "WebSocket closed without opened.") {
        pageErrors.push(error.message);
      }
    });
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          throw new Error("localStorage unavailable");
        },
      });
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await expectRootTheme(page, "light");
    await expect(await getVisibleThemeToggle(page, "Switch to dark mode")).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("mobile navigation exposes the same theme toggle", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    await openMobileNavIfNeeded(page);
    const darkToggle = page.getByRole("button", { name: "Switch to dark mode" });
    await expect(darkToggle).toBeVisible();
    await darkToggle.click();

    await expectRootTheme(page, "dark");
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
  });

  test("query prefill still works after changing theme", async ({ page }) => {
    await page.goto("/?text=HELLO%20WORLD", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    const darkToggle = await getVisibleThemeToggle(page, "Switch to dark mode");
    await darkToggle.click();

    await expectRootTheme(page, "dark");
    await expect(page.locator("#plainA")).toHaveValue("HELLO WORLD");
  });

  test("structured-data scripts are unchanged by theme changes", async ({ page }) => {
    await page.goto("/a-in-morse-code", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    const before = await page.locator('script[type="application/ld+json"]').allTextContents();
    const darkToggle = await getVisibleThemeToggle(page, "Switch to dark mode");
    await darkToggle.click();
    const after = await page.locator('script[type="application/ld+json"]').allTextContents();

    expect(after).toEqual(before);
  });

  test("representative routes render in persisted dark mode", async ({ page }) => {
    test.setTimeout(90_000);
    await page.addInitScript((key) => {
      try {
        window.localStorage.setItem(key, "dark");
        if (document.documentElement) {
          document.documentElement.dataset.theme = "dark";
        }
      } catch (error) {
        if (document.documentElement) {
          document.documentElement.dataset.theme = "light";
        }
      }
    }, THEME_STORAGE_KEY);

    for (const route of REPRESENTATIVE_THEME_ROUTES) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.locator("h1").first().waitFor();

      expect(response?.status(), route).toBeLessThan(400);
      await expectRootTheme(page, "dark");
      await expect(page.locator("h1"), route).toHaveCount(1);
      expect(await page.locator(".mw-theme-toggle").count(), route).toBeGreaterThan(0);
    }
  });
});
