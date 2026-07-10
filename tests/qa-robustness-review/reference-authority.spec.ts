import { expect, test } from "@playwright/test";

import { TEXT_TO_MORSE } from "../../app/client/components/shared/morseUtils";
import {
  LETTER_ITEMS,
  NUMBER_ITEMS,
} from "../../app/client/data/morseContent";
import {
  DIGITS,
  LETTERS,
  PUNCTUATION,
} from "../../app/client/data/morseLearning";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const REFERENCE_ROUTES = [
  {
    path: "/morse-code-alphabet",
    heading: "Morse Code Alphabet",
    referenceHeading: "Letters A-Z",
  },
  {
    path: "/morse-code-chart",
    heading: "Morse Code Chart",
    referenceHeading: "A-Z Morse code chart",
  },
  {
    path: "/morse-code-numbers",
    heading: "Morse Code Numbers",
    referenceHeading: "0-9 Morse number chart",
  },
  {
    path: "/morse-code-punctuation",
    heading: "Morse Code Punctuation",
    referenceHeading: "Morse punctuation chart",
  },
  {
    path: "/morse-code-word-separator",
    heading: "Morse code word separator",
    referenceHeading: "Use spaces for letters and / for words",
  },
  {
    path: "/international-morse-code-reference",
    heading: "International Morse Code Reference",
    referenceHeading: "A-Z Morse code letters",
  },
  {
    path: "/morse-code-printable-chart",
    heading: "Morse Code Printable Chart",
    referenceHeading: "Build the printable",
  },
] as const;

function punctuationFor(label: string) {
  const entry = PUNCTUATION.find((item) => item.label === label);
  expect(entry, `${label} is included in the shared punctuation reference`).toBeDefined();
  return entry!;
}

test.describe("reference-page authority and canonical mappings", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("derives the complete alphabet, digits, and supported punctuation from the canonical map", () => {
    expect(LETTERS).toHaveLength(26);
    for (const item of LETTERS) {
      expect(item.morse, `letter ${item.label}`).toBe(TEXT_TO_MORSE[item.label]);
    }
    for (const item of LETTER_ITEMS.filter((item) => item.isPublicLetter)) {
      expect(item.morseValue, `letter route ${item.letter}`).toBe(
        TEXT_TO_MORSE[item.letter],
      );
    }

    expect(DIGITS).toHaveLength(10);
    for (const item of DIGITS) {
      expect(item.morse, `digit ${item.label}`).toBe(TEXT_TO_MORSE[item.label]);
    }
    for (const item of NUMBER_ITEMS) {
      expect(item.morseValue, `number route ${item.digit}`).toBe(
        TEXT_TO_MORSE[item.digit],
      );
    }
    expect(TEXT_TO_MORSE["9"]).toBe("----.");

    expect(punctuationFor("Question mark").morse).toBe(TEXT_TO_MORSE["?"]);
    expect(punctuationFor("Exclamation mark").morse).toBe(TEXT_TO_MORSE["!"]);
    expect(punctuationFor("Slash").morse).toBe(TEXT_TO_MORSE["/"]);
  });

  test("shows an authoritative context note and readable primary reference on desktop and mobile", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1536, height: 1100 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);

      for (const route of REFERENCE_ROUTES) {
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await waitForRouteReady(page);
        await expect(page.locator("h1")).toHaveText(route.heading);

        const sourceNote = page.getByTestId("international-morse-source-note");
        await expect(sourceNote).toBeVisible();
        await expect(sourceNote).toContainText(
          "MorseWords is not an official standards body. These mappings are referenced against ITU-R Recommendation M.1677-1, International Morse code.",
        );
        await expect(
          sourceNote.getByRole("link", { name: "ITU-R Recommendation M.1677-1" }),
        ).toHaveAttribute("href", "https://www.itu.int/rec/R-REC-M.1677-1-200910-I/");

        await expect(
          page.getByRole("heading", { name: route.referenceHeading, exact: true }).first(),
        ).toBeVisible();
        const layout = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(layout.scrollWidth, `${route.path} at ${viewport.width}px`).toBeLessThanOrEqual(
          layout.clientWidth + 1,
        );
      }
    }
  });

  test("keeps every reference page readable in dark mode at desktop and mobile widths", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });

    for (const viewport of [
      { width: 1536, height: 1100 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);

      for (const route of REFERENCE_ROUTES) {
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await waitForRouteReady(page);
        await expect
          .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
          .toBe("dark");
        await expect(page.locator("h1")).toHaveText(route.heading);
        await expect(
          page.getByRole("heading", { name: route.referenceHeading, exact: true }).first(),
        ).toBeVisible();

        const layout = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(layout.scrollWidth, `${route.path} dark at ${viewport.width}px`).toBeLessThanOrEqual(
          layout.clientWidth + 1,
        );
      }
    }
  });

  test("keeps category boundaries, direct answers, and reference pathways clear", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1536, height: 1100 });

    await page.goto("/morse-code-alphabet", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#letters article")).toHaveCount(26);
    await expect(page.locator('a[href="/morse-code-chart"]').first()).toBeVisible();
    await expect(page.locator('a[href="/morse-code-punctuation"]').first()).toBeVisible();

    await page.goto("/morse-code-numbers", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#number-chart")).toContainText("9");
    await expect(page.locator("#number-chart")).toContainText("----.");
    await expect(page.locator('a[href="/morse-code-chart"]').first()).toBeVisible();

    await page.goto("/morse-code-punctuation", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toContainText("Question mark");
    await expect(page.locator("main")).toContainText("Exclamation mark");
    await expect(page.locator("main")).toContainText("Specialized or local variants may differ");

    await page.goto("/morse-code-word-separator", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main")).toContainText("spaces between letters");
    await expect(page.locator("main")).toContainText("longer silence between words");
    await expect(page.locator("main")).toContainText("not a sound you insert between words");
    await expect(page.locator('a[href="/morse-code-encoder"]').first()).toBeVisible();
    await expect(page.locator('a[href="/morse-code-chart"]').first()).toBeVisible();

    await page.goto("/international-morse-code-reference", { waitUntil: "domcontentloaded" });
    for (const href of [
      "/morse-code-alphabet",
      "/morse-code-numbers",
      "/morse-code-punctuation",
      "/morse-code-by-language",
    ]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }

    await page.goto("/morse-code-printable-chart", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="/morse-code-chart"]').first()).toBeVisible();
    await expect(page.locator('a[href="/morse-code-word-search-builder"]').first()).toBeVisible();
  });
});
