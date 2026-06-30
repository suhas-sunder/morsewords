import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

type LiveBookExpectation = {
  slug: string;
  expectedSections: number;
  expectedText?: string;
};

const LIVE_BOOK_EXPECTATIONS: LiveBookExpectation[] = [
  {
    slug: "the-call-of-cthulhu",
    expectedSections: 3,
    expectedText: "The most merciful thing in the world",
  },
  {
    slug: "five-little-friends",
    expectedSections: 2,
  },
  {
    slug: "the-leavenworth-case",
    expectedSections: 39,
  },
  {
    slug: "walden",
    expectedSections: 18,
  },
  {
    slug: "the-bottle-imp",
    expectedSections: 1,
  },
  {
    slug: "middlemarch",
    expectedSections: 88,
  },
  {
    slug: "the-happy-prince",
    expectedSections: 1,
  },
  {
    slug: "the-masque-of-the-red-death",
    expectedSections: 1,
  },
  {
    slug: "the-jungle-book",
    expectedSections: 14,
  },
  {
    slug: "the-adventures-of-roderick-random",
    expectedSections: 69,
    expectedText: "Of my Birth and Parentage",
  },
];

function fullPayloadPattern(slug: string) {
  return new RegExp(`/books/${slug}\\.json(?:\\?|$)`);
}

async function gotoBook(page: Page, slug: string) {
  const fullPayloadRequests: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (fullPayloadPattern(slug).test(url)) fullPayloadRequests.push(url);
  });

  const response = await page.goto(`/morse-code-books/${slug}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.status(), `${slug} route status`).toBeLessThan(400);
  await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
    "data-mw-morse-book-available",
    "true",
  );
  await expect(page.getByText("This Morse book is not available right now")).toHaveCount(0);
  await expect(page.getByText("Book text unavailable")).toHaveCount(0);
  await expect(page.locator("[data-mw-morse-book-source-preview]")).toBeVisible();
  await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
    "data-mw-morse-book-full-loading",
    "false",
    { timeout: 45_000 },
  );
  await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
    "data-mw-morse-book-preview-state",
    "ready",
  );
  expect(fullPayloadRequests.length, `${slug} full payload request count`).toBeGreaterThan(0);
  return fullPayloadRequests;
}

test.describe("Morse book post-export hydration", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await blockExternalNetwork(page);
  });

  for (const expectation of LIVE_BOOK_EXPECTATIONS) {
    test(`${expectation.slug} hydrates from full export payload`, async ({ page }) => {
      await gotoBook(page, expectation.slug);
      await expect(page.locator("[data-mw-morse-book-section-row]")).toHaveCount(
        expectation.expectedSections,
      );
      if (expectation.expectedText) {
        await expect(page.locator("[data-mw-morse-book-source-preview]")).toContainText(
          expectation.expectedText,
        );
      }
    });
  }

  test("section selection updates cleaned and Morse previews after hydration", async ({ page }) => {
    await gotoBook(page, "walden");
    await expect(page.locator("[data-mw-morse-book-section-row]")).toHaveCount(18);
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-settings-restored",
      "true",
    );

    const sourceSections = page.locator("[data-mw-morse-book-translator-source-sections]");
    await page.locator("[data-mw-morse-book-select-all-default]").uncheck();
    await page.locator("[data-mw-morse-book-section-select='chapter-002']").check();
    await expect(sourceSections).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-002",
    );
    await expect(page.locator("[data-mw-morse-book-source-preview]")).not.toHaveText("");
    await expect(page.locator("[data-mw-morse-book-morse-preview]")).not.toHaveText("");
  });
});
