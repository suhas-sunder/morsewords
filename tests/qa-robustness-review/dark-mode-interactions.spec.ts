import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  blockExternalNetwork,
  waitForRouteReady,
} from "./helpers";

const THEME_STORAGE_KEY = "morsewords-theme";

type ColorChannels = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type ContrastResult = {
  background: string;
  color: string;
  label: string;
  ratio: number;
  text: string;
};

test.describe("dark mode interactive states", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
    await installDarkMode(page);
  });

  test("desktop More menu and mobile navigation keep readable active states", async ({
    page,
  }) => {
    await gotoDarkRoute(page, "/");

    const openNavButton = page.getByRole("button", {
      name: "Open navigation",
    });

    if (await openNavButton.isVisible().catch(() => false)) {
      await openNavButton.click();
      const mobileNav = page.locator("#mobile-nav");
      await expect(mobileNav).toBeVisible();

      const mobileItem = mobileNav.locator(".mw-nav-mobile-item").first();
      await expectReadable(mobileItem, "mobile navigation item");

      const mobileSearch = mobileNav.locator(".mw-nav-input").first();
      await expectReadable(mobileSearch, "mobile navigation search");
      await expectCleanFocus(mobileSearch, "mobile navigation search");
      return;
    }

    const moreButton = page.getByRole("button", { name: /^More$/ });
    await expect(async () => {
      if ((await moreButton.getAttribute("aria-expanded")) !== "true") {
        await moreButton.click();
      }
      await expect(moreButton).toHaveAttribute("aria-expanded", "true", {
        timeout: 1_000,
      });
    }).toPass({ timeout: 15_000 });

    const menu = page.locator(".mw-nav-panel");
    await expect(menu).toBeVisible();

    const menuItem = menu.locator(".mw-nav-item").first();
    await hoverAndExpectReadable(menuItem, "desktop More menu item");

    const menuDescription = menu.locator(".mw-nav-item-description").first();
    await expectReadable(menuDescription, "desktop More menu description");

    const menuSearch = menu.locator(".mw-nav-input").first();
    await expectReadable(menuSearch, "desktop More menu search");
    await expectCleanFocus(menuSearch, "desktop More menu search");
  });

  test("tool settings, upload, warning, disabled, and advanced states stay readable", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await gotoDarkRoute(page, "/morse-code-book-translator");
    await page.locator("textarea").first().fill("SOS help. CQ CQ.");
    const downloadSettings = page
      .locator("summary")
      .filter({ hasText: "Download settings" });
    await expect(async () => {
      if ((await downloadSettings.getAttribute("aria-expanded")) !== "true") {
        await downloadSettings.click();
      }
      await expect(downloadSettings).toHaveAttribute("aria-expanded", "true", {
        timeout: 1_000,
      });
    }).toPass({ timeout: 15_000 });
    await expectReadable(downloadSettings, "book download settings summary");
    await expectCleanFocus(downloadSettings, "book download settings summary");

    await clickIfVisible(page.getByRole("radio", { name: /Video/i }).first());
    const bookFullFrame = page.getByRole("radio", { name: /Full-frame/i }).first();
    await expect(bookFullFrame).toBeVisible();
    await bookFullFrame.click();
    await expect(bookFullFrame).toBeChecked();
    await expectReadable(
      page.getByTestId("book-video-full-frame-warning"),
      "book full-frame warning",
    );

    await gotoDarkRoute(page, "/morse-code-video-generator");
    await page.locator("textarea").first().fill("SOS");
    const videoFullFrame = page.getByRole("radio", { name: /Full-frame/i }).first();
    await expect(videoFullFrame).toBeVisible();
    await videoFullFrame.click();
    await expect(videoFullFrame).toBeChecked();
    const videoSettings = page
      .locator("summary")
      .filter({ hasText: "Video settings" });
    await expectReadable(videoSettings, "video settings summary");
    await expectReadable(
      page.getByTestId("morse-video-full-frame-warning"),
      "video generator full-frame warning",
    );

    await gotoDarkRoute(page, "/morse-code-sound-generator");
    const soundAdvancedToggle = await openSoundGeneratorAdvanced(page);
    await expectReadable(soundAdvancedToggle, "sound generator settings");
    await expectCleanFocus(soundAdvancedToggle, "sound generator settings");

    await gotoDarkRoute(page, "/morse-code-mp3-generator");
    await openAdvancedSettings(page);
    await expectExpandedMainToggleReadable(page, "MP3 generator settings");
    const disabledMp3Actions = page
      .locator("main button:disabled")
      .filter({ hasText: /Download|Export/i });
    if ((await disabledMp3Actions.count()) > 0) {
      await expectReadable(
        disabledMp3Actions.first(),
        "disabled MP3 export action",
        3,
      );
    }

    await gotoDarkRoute(page, "/morse-code-audio-decoder");
    await hoverAndExpectReadable(
      page.getByTestId("audio-decoder-dropzone"),
      "audio decoder upload dropzone",
    );
    await openAdvancedSettings(page);
    await expectExpandedMainToggleReadable(page, "audio decoder advanced settings");
  });

  test("audio hub, word separator, timing FAQ, and toolkit hover states stay readable", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await gotoDarkRoute(page, "/audio");
    await hoverAndExpectReadable(
      page.locator("#morse-code-navigation .mw-related-tool-link").first(),
      "audio related tool hover",
    );
    await hoverAndExpectReadable(
      page.locator("#morse-code-navigation .mw-related-quick-link").first(),
      "audio quick access hover",
    );

    await gotoDarkRoute(page, "/morse-code-word-separator");
    await hoverAndExpectReadable(
      page.locator("#morse-code-navigation .mw-related-tool-link").first(),
      "word separator related hover",
    );

    for (const route of ["/morse-code-timing", "/farnsworth-timing"]) {
      await gotoDarkRoute(page, route);
      const faqSummary = page.locator("main .mw-faq-trigger").first();
      await faqSummary.click();
      await expectReadable(faqSummary, `${route} open FAQ summary`);
      await expectCleanFocus(faqSummary, `${route} FAQ summary`);

      const toolkitSummary = page.locator("#morse-code-navigation summary").first();
      await toolkitSummary.click();
      await expectReadable(toolkitSummary, `${route} open toolkit summary`);
    }
  });
});

async function installDarkMode(page: Page) {
  await page.addInitScript((themeStorageKey) => {
    window.localStorage.setItem(themeStorageKey, "dark");
    document.documentElement.dataset.theme = "dark";
  }, THEME_STORAGE_KEY);
}

async function gotoDarkRoute(page: Page, route: string) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
    .toBe("dark");
}

async function openAdvancedSettings(page: Page) {
  const toggle = page
    .locator("main button[aria-expanded]")
    .filter({ hasText: /Advanced settings/i })
    .first();
  await expect(toggle).toBeVisible();

  if ((await toggle.getAttribute("aria-expanded")) !== "true") {
    await toggle.click();
  }

  await expect(toggle).toHaveAttribute("aria-expanded", "true");
}

async function openSoundGeneratorAdvanced(page: Page) {
  const toggle = page
    .getByRole("button", { name: /Show advanced|Hide advanced/i })
    .first();
  await expect(toggle).toBeVisible();

  if (/Show advanced/i.test((await toggle.textContent()) ?? "")) {
    await toggle.click();
  }

  return toggle;
}

async function expectExpandedMainToggleReadable(page: Page, label: string) {
  const toggle = page
    .locator("main button[aria-expanded='true']")
    .filter({ hasText: /Advanced settings/i })
    .first();
  await expectReadable(toggle, label);
  await expectCleanFocus(toggle, label);
}

async function clickIfVisible(locator: Locator) {
  if (!(await locator.isVisible().catch(() => false))) return;
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
}

async function hoverAndExpectReadable(
  locator: Locator,
  label: string,
  minimumRatio = 4.5,
) {
  await expect(locator).toBeVisible();
  await locator.scrollIntoViewIfNeeded();
  await locator.hover();
  await expectReadable(locator, label, minimumRatio);
}

async function expectCleanFocus(locator: Locator, label: string) {
  await expect(locator).toBeVisible();
  await locator.focus();

  const styles = await locator.evaluate((element) => {
    const computed = window.getComputedStyle(element);
    return {
      borderBottomWidth: computed.borderBottomWidth,
      borderLeftWidth: computed.borderLeftWidth,
      borderRightWidth: computed.borderRightWidth,
      borderTopWidth: computed.borderTopWidth,
      outlineStyle: computed.outlineStyle,
      ringShadow: computed.getPropertyValue("--tw-ring-shadow").trim(),
    };
  });

  expect(styles.outlineStyle, `${label} outline style`).toBe("none");
  expect(styles.ringShadow, `${label} Tailwind ring shadow`).toBe("0 0 #0000");
  expect(styles.borderTopWidth, `${label} top border`).toBe("0px");
  expect(styles.borderRightWidth, `${label} right border`).toBe("0px");
  expect(styles.borderBottomWidth, `${label} bottom border`).toBe("0px");
  expect(styles.borderLeftWidth, `${label} left border`).toBe("0px");
}

async function expectReadable(
  locator: Locator,
  label: string,
  minimumRatio = 4.5,
) {
  await expect(locator).toBeVisible();
  const result = await contrastForLocator(locator, label);

  expect(
    result.ratio,
    `${label} contrast ${result.ratio.toFixed(2)} for "${result.text}" (${result.color} on ${result.background})`,
  ).toBeGreaterThanOrEqual(minimumRatio);
}

async function contrastForLocator(locator: Locator, label: string) {
  return locator.evaluate((element, readableLabel): ContrastResult => {
    function parseColor(value: string): ColorChannels | null {
      const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/);
      if (rgbMatch) {
        const parts = rgbMatch[1]
          .split(",")
          .map((part) => Number.parseFloat(part.trim()));
        return {
          r: parts[0],
          g: parts[1],
          b: parts[2],
          a: parts.length > 3 ? parts[3] : 1,
        };
      }

      const colorFunctionMatch = value.match(
        /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/,
      );
      if (colorFunctionMatch) {
        return {
          r: Number(colorFunctionMatch[1]) * 255,
          g: Number(colorFunctionMatch[2]) * 255,
          b: Number(colorFunctionMatch[3]) * 255,
          a: colorFunctionMatch[4] ? Number(colorFunctionMatch[4]) : 1,
        };
      }

      return null;
    }

    function blend(foreground: ColorChannels, background: ColorChannels) {
      const alpha = foreground.a + background.a * (1 - foreground.a);
      if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };

      return {
        r:
          (foreground.r * foreground.a +
            background.r * background.a * (1 - foreground.a)) /
          alpha,
        g:
          (foreground.g * foreground.a +
            background.g * background.a * (1 - foreground.a)) /
          alpha,
        b:
          (foreground.b * foreground.a +
            background.b * background.a * (1 - foreground.a)) /
          alpha,
        a: alpha,
      };
    }

    function effectiveBackground(node: Element) {
      let background: ColorChannels = { r: 0, g: 0, b: 0, a: 0 };
      for (
        let current: Element | null = node;
        current;
        current = current.parentElement
      ) {
        const parsed = parseColor(window.getComputedStyle(current).backgroundColor);
        if (parsed) background = blend(background, parsed);
        if (background.a > 0.985) return background;
      }

      const bodyBackground =
        parseColor(window.getComputedStyle(document.body).backgroundColor) ??
        ({ r: 7, g: 17, b: 31, a: 1 } satisfies ColorChannels);
      return blend(background, bodyBackground);
    }

    function relativeLuminance(color: ColorChannels) {
      return [color.r, color.g, color.b]
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
        })
        .reduce((sum, channel, index) => {
          return sum + channel * [0.2126, 0.7152, 0.0722][index];
        }, 0);
    }

    function contrastRatio(foreground: ColorChannels, background: ColorChannels) {
      const foregroundLuminance = relativeLuminance(foreground);
      const backgroundLuminance = relativeLuminance(background);
      const light = Math.max(foregroundLuminance, backgroundLuminance);
      const dark = Math.min(foregroundLuminance, backgroundLuminance);
      return (light + 0.05) / (dark + 0.05);
    }

    const styles = window.getComputedStyle(element);
    const foreground = parseColor(styles.color);
    if (!foreground) {
      throw new Error(`Could not parse foreground color ${styles.color}`);
    }

    const background = effectiveBackground(element);
    const text =
      element.getAttribute("aria-label") ??
      element.textContent?.trim().replace(/\s+/g, " ") ??
      element.tagName;

    return {
      background: `rgb(${Math.round(background.r)}, ${Math.round(background.g)}, ${Math.round(background.b)})`,
      color: styles.color,
      label: readableLabel,
      ratio: contrastRatio(foreground, background),
      text,
    };
  }, label);
}
