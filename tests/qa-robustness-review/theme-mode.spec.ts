import { expect, test, type Page } from "@playwright/test";
import { blockExternalNetwork } from "./helpers";

const THEME_STORAGE_KEY = "morsewords-theme";
const REPRESENTATIVE_THEME_ROUTES = [
  "/",
  "/audio",
  "/morse-code-audio-decoder",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/morse-code-sound-generator",
  "/name-to-morse-code",
  "/morse-code-chart",
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
const STORAGE_FALLBACK_ROUTES = [
  "/",
  "/audio",
  "/morse-code-sound-generator",
  "/practice",
  "/typing",
  "/morse-code-word-trainer",
  "/morse-code-printable-chart",
] as const;
const STORED_SETTING_HYDRATION_ROUTES = [
  {
    route: "/",
    values: {
      mw_adv_open: "1",
      mw_preset: "tone",
      mw_char_wpm: "24",
    },
  },
  {
    route: "/audio",
    values: {
      mw_audio_source: "morse",
      mw_audio_adv_open: "0",
      mw_audio_wpm: "24",
    },
  },
  {
    route: "/morse-code-sound-generator",
    values: {
      mw_sound_source: "morse",
      mw_sound_adv_open: "0",
      mw_sound_wpm: "24",
    },
  },
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

function isExpectedTestHarnessConsoleError(text: string) {
  return (
    text.includes("ERR_BLOCKED_BY_CLIENT") ||
    text.includes("WebSocket connection") ||
    text.includes("[vite] failed to connect to websocket") ||
    text.includes("Failed to fetch manifest patches TypeError: Failed to fetch")
  );
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

  test("storage-heavy routes do not crash when localStorage is unavailable", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        if (isExpectedTestHarnessConsoleError(message.text())) return;
        consoleErrors.push(message.text());
      }
    });
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

    for (const route of STORAGE_FALLBACK_ROUTES) {
      pageErrors.length = 0;
      consoleErrors.length = 0;

      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForHydration(page);

      await expectRootTheme(page, "light");
      await expect(page.locator("h1"), route).toHaveCount(1);
      await expect(
        await getVisibleThemeToggle(page, "Switch to dark mode"),
        route,
      ).toBeVisible();
      expect(pageErrors, route).toEqual([]);
      expect(consoleErrors, route).toEqual([]);
    }
  });

  test("stored tool settings do not create hydration errors", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        if (isExpectedTestHarnessConsoleError(message.text())) return;
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      if (error.message !== "WebSocket closed without opened.") {
        pageErrors.push(error.message);
      }
    });

    for (const item of STORED_SETTING_HYDRATION_ROUTES) {
      pageErrors.length = 0;
      consoleErrors.length = 0;

      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate((values) => {
        window.localStorage.clear();
        Object.entries(values).forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });
      }, item.values);
      await page.goto(item.route, { waitUntil: "domcontentloaded" });
      await waitForHydration(page);

      await expectRootTheme(page, "light");
      await expect(page.locator("h1"), item.route).toHaveCount(1);
      expect(pageErrors, item.route).toEqual([]);
      expect(consoleErrors, item.route).toEqual([]);
    }
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

  test("dark surface shadows do not create persistent outline boxes", async ({ page }) => {
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

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expectRootTheme(page, "dark");

    const shadowAudit = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const boxShadowFor = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element).boxShadow : "";
      };

      return {
        cardToken: root.getPropertyValue("--mw-shadow-card").trim(),
        panelToken: root.getPropertyValue("--mw-shadow-panel").trim(),
        softToken: root.getPropertyValue("--mw-shadow-soft").trim(),
        inputPanelShadow: boxShadowFor(".mw-input-panel"),
        outputPanelShadow: boxShadowFor(".mw-panel-dark"),
        staticTileShadow: boxShadowFor(".mw-static-tile"),
        buttonShadow:
          Array.from(document.querySelectorAll(".mw-page-content button"))
            .map((element) => getComputedStyle(element).boxShadow)
            .find((shadow) => shadow !== "none") ?? "none",
      };
    });

    expect(shadowAudit.cardToken).toBe("none");
    expect(shadowAudit.panelToken).toBe("none");
    expect(shadowAudit.softToken).not.toContain("0 0 0 1px");
    expect(shadowAudit.softToken).not.toContain("0 0");
    expect(shadowAudit.inputPanelShadow).toBe("none");
    expect(shadowAudit.outputPanelShadow).toBe("none");
    expect(shadowAudit.staticTileShadow).toBe("none");
    expect(shadowAudit.buttonShadow).not.toBe("none");
    expect(shadowAudit.buttonShadow).not.toContain("0px 0px 0px 1px");
    expect(shadowAudit.buttonShadow).not.toContain("0px 0px");
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
