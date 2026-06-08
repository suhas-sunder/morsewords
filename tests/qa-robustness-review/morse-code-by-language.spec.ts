import { expect, test, type Page } from "@playwright/test";

import {
  INTERNATIONAL_MORSE_A_TO_Z,
  MORSE_LANGUAGE_PAGES,
} from "../../app/client/data/morseLanguages";
import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const LANGUAGE_PATHS = [
  ROUTES.morseCodeJapanese,
  ROUTES.morseCodeRussian,
  ROUTES.morseCodeGreek,
] as const;

async function gotoReady(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
}

async function parsedJsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent || "{}") as unknown),
  );
}

test.describe("Morse code by language", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("hub loads and links to Japanese, Russian, and Greek pages", async ({
    page,
  }) => {
    await gotoReady(page, ROUTES.morseCodeByLanguage);

    await expect(page.getByRole("heading", { name: "Morse Code by Language" })).toBeVisible();
    await expect(page.getByText(/established Morse adaptations/i)).toBeVisible();

    for (const path of LANGUAGE_PATHS) {
      await expect(page.locator(`main a[href="${path}"]`).first()).toBeVisible();
    }

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      absoluteUrl(ROUTES.morseCodeByLanguage),
    );
  });

  for (const language of MORSE_LANGUAGE_PAGES) {
    test(`${language.languageName} page renders cards, audio buttons, and print sheet`, async ({
      page,
    }) => {
      await gotoReady(page, language.path);

      await expect(
        page.getByRole("heading", { name: `${language.languageName} Morse Code` }).first(),
      ).toBeVisible();
      await expect(page.getByText(language.morseSystemName).first()).toBeVisible();

      const cards = page.locator('[data-testid="language-character-card"]');
      await expect(cards.first()).toBeVisible();
      await expect(cards.first()).toContainText(language.characters[0].target);
      await expect(cards.first()).toContainText(language.characters[0].morse);

      const playButton = cards.first().getByRole("button", { name: /Play .* Morse pattern/i });
      await expect(playButton).toBeVisible();
      await expect(playButton).toBeEnabled();

      const audioSettings = page.locator('[data-testid="language-audio-settings"]');
      await expect(audioSettings).toBeVisible();
      await expect(page.getByLabel("Character speed")).toBeVisible();
      await expect(page.getByLabel("Farnsworth spacing")).toBeVisible();
      await expect(page.getByLabel("Tone")).toBeVisible();

      const englishReference = page.locator('[data-testid="english-a-z-reference"]');
      await expect(englishReference).toBeVisible();
      for (const item of INTERNATIONAL_MORSE_A_TO_Z) {
        await expect(
          englishReference.getByRole("button", {
            name: `Play English letter ${item.letter} Morse pattern ${item.morse}`,
          }),
        ).toBeVisible();
      }

      const printSection = page.locator('[data-testid="language-print-section"]');
      const guideSection = page.locator('[data-testid="language-seo-section"]');
      await expect(printSection).toBeVisible();
      await expect(guideSection).toBeVisible();
      expect(
        await printSection.evaluate((node) => {
          const guide = document.querySelector('[data-testid="language-seo-section"]');
          if (!guide) return false;
          return Boolean(
            node.compareDocumentPosition(guide) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          );
        }),
        "printable sheet appears before SEO/explanation section",
      ).toBe(true);

      await expect(page.locator('[data-testid="language-printable-sheet"]')).toContainText(
        "MorseWords.com",
      );
      await expect(page.locator('[data-testid="language-printable-sheet"]')).toContainText(
        absoluteUrl(language.path),
      );
      await expect(page.locator('[data-testid="language-printable-sheet"]')).toContainText(
        "English A-Z comparison",
      );
      await expect(page.locator('[data-testid="language-printable-sheet"]')).toContainText(
        "Z",
      );
      await expect(page.locator('[data-testid="language-printable-sheet"]')).toContainText(
        "--..",
      );
      await expect(page.locator('[data-testid="language-print-qr"]')).toBeVisible();
      await expect(page.getByTestId("language-print-button")).toBeVisible();

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        absoluteUrl(language.path),
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        absoluteUrl(language.path),
      );
    });
  }

  test("Japanese page uses kana and Wabun terminology without misleading letter copy", async ({
    page,
  }) => {
    await gotoReady(page, ROUTES.morseCodeJapanese);

    const bodyText = await page.locator("main").innerText();
    expect(bodyText).toContain("Wabun code");
    expect(bodyText).toContain("kana");
    expect(bodyText).toContain("Katakana ア");
    expect(bodyText).not.toMatch(/Japanese letter A/i);
    expect(bodyText).not.toMatch(/covers every Japanese kana/i);
  });

  test("schema and sitemap stay canonical without fake commercial claims", async ({
    page,
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const xml = await response.text();

    for (const path of [ROUTES.morseCodeByLanguage, ...LANGUAGE_PATHS]) {
      expect(xml).toContain(absoluteUrl(path));
      await gotoReady(page, path);
      const jsonLd = await parsedJsonLd(page);
      const schemaText = JSON.stringify(jsonLd);
      expect(schemaText).toContain(absoluteUrl(path));
      expect(schemaText).not.toMatch(/aggregateRating|reviewRating|Offer|price|Product|Review/);
    }
  });

  test("mobile and dark mode stay readable without horizontal overflow", async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });
    await gotoReady(page, ROUTES.morseCodeGreek);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator('[data-testid="language-character-card"]').first()).toBeVisible();

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(
      overflow.scrollWidth,
      `${testInfo.project.name} language page width`,
    ).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});
