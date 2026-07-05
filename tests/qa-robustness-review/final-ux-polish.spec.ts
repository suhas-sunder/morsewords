import { expect, test, type Page } from "@playwright/test";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const SHOW_AMBIENT_STORAGE_KEY = "morsewords-show-ambient-morse";
const FULL_PAGE_FLASH_STORAGE_KEY = "morsewords-full-page-flash";
const DISABLE_FLASH_STORAGE_KEY = "morsewords-disable-flash-effects";

test.beforeEach(async ({ page }) => {
  await blockExternalNetwork(page);
});

async function waitForHydration(page: Page) {
  await waitForRouteReady(page);
}

async function openSettings(page: Page) {
  const openNav = page.getByRole("button", { name: "Open navigation" });
  if (await openNav.isVisible().catch(() => false)) {
    await openNav.click();
  }

  const settingsButton = page.getByRole("button", {
    name: "Open display settings",
  });
  await expect(settingsButton).toBeVisible();
  await settingsButton.click();

  const dialog = page.getByRole("dialog", { name: "Display settings" });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function installPrintCounter(page: Page) {
  await page.evaluate(() => {
    (window as typeof window & { __morsePrintCount?: number }).__morsePrintCount = 0;

    const originalCreateElement = Document.prototype.createElement;
    Document.prototype.createElement = function patchedCreateElement(
      tagName: string,
      options?: ElementCreationOptions,
    ) {
      const element = originalCreateElement.call(this, tagName, options);
      if (tagName.toLowerCase() !== "iframe") return element;

      const iframe = element as HTMLIFrameElement;
      const frameDocument = document.implementation.createHTMLDocument(
        "MorseWords print test",
      );
      const frameWindow = {
        document: frameDocument,
        focus() {},
        print() {
          (window as typeof window & { __morsePrintCount?: number }).__morsePrintCount =
            ((window as typeof window & { __morsePrintCount?: number })
              .__morsePrintCount ?? 0) + 1;
        },
      };

      let loadHandler: ((event: Event) => void) | null = null;

      Object.defineProperty(iframe, "contentDocument", {
        configurable: true,
        value: frameDocument,
      });
      Object.defineProperty(iframe, "contentWindow", {
        configurable: true,
        value: frameWindow,
      });
      Object.defineProperty(iframe, "onload", {
        configurable: true,
        get() {
          return loadHandler;
        },
        set(nextHandler) {
          loadHandler =
            typeof nextHandler === "function"
              ? (nextHandler as (event: Event) => void)
              : null;
          if (loadHandler) {
            window.setTimeout(() => loadHandler?.call(iframe, new Event("load")), 0);
          }
        },
      });

      return iframe;
    };
  });
}

async function expectSinglePrintForButton(page: Page, label: RegExp | string) {
  await installPrintCounter(page);
  await page.getByRole("button", { name: label }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __morsePrintCount?: number })
            .__morsePrintCount ?? 0,
      ),
    )
    .toBe(1);
  await page.waitForTimeout(450);
  await expect(
    page.evaluate(
      () =>
        (window as typeof window & { __morsePrintCount?: number })
          .__morsePrintCount ?? 0,
    ),
  ).resolves.toBe(1);
}

test("display settings open, close with Escape, and persist ambient Morse preference", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);

  const dialog = await openSettings(page);
  const ambientToggle = dialog.getByRole("switch", {
    name: "Show Morse background text",
  });
  const fullPageFlashToggle = dialog.getByRole("switch", {
    name: "Flash whole page",
  });
  const disableFlashToggle = dialog.getByRole("switch", {
    name: "Disable flashing light effects",
  });

  await expect(ambientToggle).toHaveAttribute("aria-checked", "true");
  await expect(fullPageFlashToggle).toHaveAttribute("aria-checked", "false");
  await expect(disableFlashToggle).toHaveAttribute("aria-checked", "false");
  await expect(page.locator(".mw-ambient-morse")).toBeVisible();

  await ambientToggle.click();
  await expect(ambientToggle).toHaveAttribute("aria-checked", "false");
  await expect(page.locator(".mw-ambient-morse")).toBeHidden();
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), SHOW_AMBIENT_STORAGE_KEY),
    )
    .toBe("0");

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForHydration(page);
  await expect(page.locator(".mw-ambient-morse")).toBeHidden();

  await openSettings(page);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Display settings" }),
  ).toHaveCount(0);
});

test("whole-page flash setting persists without disabling visual flash controls", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);

  const dialog = await openSettings(page);
  const flashToggle = dialog.getByRole("switch", {
    name: "Flash whole page",
  });
  await flashToggle.click();
  await expect(flashToggle).toHaveAttribute("aria-checked", "true");
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), FULL_PAGE_FLASH_STORAGE_KEY),
    )
    .toBe("1");

  await page.goto("/morse-code-visual-practice", {
    waitUntil: "domcontentloaded",
  });
  await waitForHydration(page);

  await expect(page.getByRole("button", { name: "Flash message" })).toBeEnabled();
  await expect(page.locator("#visual-practice-strobe-warning")).toHaveCount(0);
  await page.getByRole("button", { name: "Flash message" }).click();
  await expect(page.locator("#visual-practice-strobe-warning")).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForHydration(page);
  await expect(page.getByRole("button", { name: "Flash message" })).toBeEnabled();
  await expect(page.locator("#visual-practice-strobe-warning")).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), FULL_PAGE_FLASH_STORAGE_KEY),
    )
    .toBe("1");
});

test("explicit disable flash setting persists without enabling whole-page flash", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);

  const dialog = await openSettings(page);
  const disableFlashToggle = dialog.getByRole("switch", {
    name: "Disable flashing light effects",
  });
  const fullPageFlashToggle = dialog.getByRole("switch", {
    name: "Flash whole page",
  });
  await expect(disableFlashToggle).toHaveAttribute("aria-checked", "false");
  await expect(fullPageFlashToggle).toHaveAttribute("aria-checked", "false");

  await disableFlashToggle.click();
  await expect(disableFlashToggle).toHaveAttribute("aria-checked", "true");
  await expect(fullPageFlashToggle).toHaveAttribute("aria-checked", "false");
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), DISABLE_FLASH_STORAGE_KEY),
    )
    .toBe("1");
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), FULL_PAGE_FLASH_STORAGE_KEY),
    )
    .toBe("0");

  await page.goto("/morse-code-visual-practice", {
    waitUntil: "domcontentloaded",
  });
  await waitForHydration(page);
  await expect(page.getByRole("button", { name: "Flash message" })).toBeDisabled();
  await expect(
    page.getByText("Flashing effects are disabled in display settings."),
  ).toBeVisible();
});

test("mobile navigation hides logo text while menu is open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);

  await expect(page.locator("header").getByText("MorseWords").first()).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();

  const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('a[href="/"] img[alt="MorseWords"]')).toBeVisible();
  await expect(dialog.locator('a[href="/"]').getByText("MorseWords")).toBeHidden();
  await expect(page.getByRole("button", { name: "Open display settings" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close navigation" })).toBeVisible();
});

test("international translator is explicit about one-way transliteration", async ({
  page,
}) => {
  await page.goto("/morse-code-international-translator", {
    waitUntil: "domcontentloaded",
  });
  await waitForHydration(page);

  await expect(
    page
      .locator("main")
      .getByText(
        "This page does not reconstruct the original accents or script from Morse.",
      )
      .first(),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /^Morse.*Text$/i })).toHaveCount(0);

  const mainText = (await page.locator("main").innerText()).toLowerCase();
  expect(mainText).not.toContain("decode morse back to international");
  expect(mainText).not.toContain("morse back into world-language words");
});

test("print-style exports invoke print once per click", async ({ page }) => {
  await page.goto("/morse-code-printable-chart", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);
  await expectSinglePrintForButton(page, "Download PDF");

  await page.goto("/morse-code-word-search-builder", {
    waitUntil: "domcontentloaded",
  });
  await waitForHydration(page);
  await expectSinglePrintForButton(page, "Print selected output");
});

test("social links include maintainer and related project links", async ({
  page,
}) => {
  await page.goto("/misc/socials", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);

  await expect(
    page.locator('a[href="https://www.linkedin.com/in/s-sunder/"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('a[href="https://www.suhassunder.com"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('a[href="https://www.ilovesvg.com/"]').first(),
  ).toBeVisible();
  await expect(
    page.locator('a[href="http://doodlegarden.com"]').first(),
  ).toBeVisible();

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);
  await expect(
    page.locator('a[href="https://www.suhassunder.com"]').first(),
  ).toHaveAttribute("aria-label", /Developer portfolio|Suhas Sunder/);
  await expect(
    page.locator('a[href="https://www.ilovesvg.com/"]').first(),
  ).toHaveText(/iLoveSVG[\s\S]*Image utility/);
  await expect(
    page.locator('a[href="http://doodlegarden.com"]').first(),
  ).toHaveText(/DoodleGarden[\s\S]*Art & Animation/);
});
