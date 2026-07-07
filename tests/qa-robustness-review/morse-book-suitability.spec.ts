import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ELEVATED_BOOK_SLUG = "a-christmas-carol";
const LOW_RISK_BOOK_SLUG = "a-catastrophe";
const MODERATE_BOOK_SLUG = "the-threat";
const MODERATE_STRICT_BOOK_SLUG = "walden";

const ELEVATED_LABEL = "Elevated suitability review";
const LOWER_RISK_LABEL = "Lower-risk profile";
const MODERATE_LABEL = "Historical content note";
const REVIEW_FOR_YOUNGER_READERS_LABEL = "Review for younger readers";
const PUBLIC_YOUNG_READER_LABEL = "Suitable for young readers";

const ELEVATED_NOTE =
  "Historical public-domain text with elevated content-suitability concerns. Review before classroom or younger-user use.";
const LOWER_RISK_NOTE =
  "Historical public-domain text reviewed in the current content-safety sweep.";
const MODERATE_NOTE =
  "Historical public-domain text. May include period language, mature themes, or intense scenes.";
const MODERATE_STRICT_NOTE =
  "Historical public-domain text. May include period language, mature themes, or intense scenes. Review before classroom or younger-user use.";
const FINAL_SANITY_PRINT_ROUTES = [
  {
    slug: "walden",
    label: REVIEW_FOR_YOUNGER_READERS_LABEL,
    note: MODERATE_STRICT_NOTE,
  },
  {
    slug: "the-call-of-cthulhu",
    label: ELEVATED_LABEL,
    note: ELEVATED_NOTE,
  },
  {
    slug: "the-adventures-of-roderick-random",
    label: ELEVATED_LABEL,
    note: ELEVATED_NOTE,
  },
] as const;

type ListingSurface = {
  path: string;
  browserTestId: string;
  cardTestId: string;
  cardSlugAttribute: string;
  cardSuitabilityTestId: string;
  filterTestId: string;
  youngReaderOnlyListingLabels: boolean;
};

const LISTING_SURFACES: ListingSurface[] = [
  {
    path: "/morse-code-books",
    browserTestId: "morse-books-browser",
    cardTestId: "morse-book-card",
    cardSlugAttribute: "data-mw-morse-book-card-slug",
    cardSuitabilityTestId: "morse-book-card-content-suitability",
    filterTestId: "morse-books-lower-risk-filter",
    youngReaderOnlyListingLabels: true,
  },
  {
    path: "/morse-code-audiobooks",
    browserTestId: "morse-audiobooks-browser",
    cardTestId: "morse-audiobook-card",
    cardSlugAttribute: "data-mw-morse-audiobook-card-slug",
    cardSuitabilityTestId: "morse-audiobook-card-content-suitability",
    filterTestId: "morse-audiobooks-lower-risk-filter",
    youngReaderOnlyListingLabels: false,
  },
];

const UNSUPPORTED_SAFETY_CLAIMS = [
  /\ball[- ]audience[- ]safe\b/i,
  /\bsafe for all audiences\b/i,
  /\bclassroom[-/ ]safe[- ]by[- ]default\b/i,
  /\byouth[-/ ]safe[- ]by[- ]default\b/i,
  /\bclassroom or youth[-/ ]safe[- ]by[- ]default\b/i,
] as const;

async function gotoPublicPage(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  expect(response?.status(), `${path} status`).toBeLessThan(400);
}

function cardBySlug(page: Page, surface: ListingSurface, slug: string) {
  return page.locator(
    `[data-testid="${surface.cardTestId}"][${surface.cardSlugAttribute}="${slug}"]`,
  );
}

async function expectListingCardSuitability(
  page: Page,
  surface: ListingSurface,
  slug: string,
  expectedLabel: string | null,
) {
  const card = cardBySlug(page, surface, slug);
  await expect(card).toBeVisible();
  if (expectedLabel === null) {
    await expect(card.getByTestId(surface.cardSuitabilityTestId)).toHaveCount(0);
    return;
  }
  await expect(card.getByTestId(surface.cardSuitabilityTestId)).toHaveText(
    expectedLabel,
  );
}

async function searchListing(page: Page, surface: ListingSurface, query: string) {
  await page
    .getByTestId(surface.browserTestId)
    .locator('input[type="search"]')
    .fill(query);
}

async function expectNoUnsupportedSafetyClaims(page: Page) {
  const bodyText = (await page.locator("body").innerText()).replace(/\s+/g, " ");
  for (const pattern of UNSUPPORTED_SAFETY_CLAIMS) {
    expect(bodyText, `Unsupported safety claim matched ${pattern}`).not.toMatch(
      pattern,
    );
  }
}

async function expectPrintableSuitabilityNote(
  page: Page,
  slug: string,
  expectedLabel: string,
  expectedNote: string,
) {
  await gotoPublicPage(page, `/morse-code-books/${slug}/print`);
  await expect(page.getByText("Book text unavailable")).toHaveCount(0);
  await expect(page.getByText("This Morse book is not available right now")).toHaveCount(0);
  await expect(
    page.getByTestId("printable-book-content-suitability"),
  ).toContainText(expectedLabel);
  await expect(
    page.getByTestId("printable-book-content-suitability"),
  ).toContainText(expectedNote);
  await expect(page.getByTestId("printable-preview")).toBeVisible();
  await expectNoUnsupportedSafetyClaims(page);
}

test.describe("Morse book suitability labels and filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await blockExternalNetwork(page);
  });

  for (const surface of LISTING_SURFACES) {
    test(`${surface.path} renders suitability labels and filters lower-risk results`, async ({
      page,
    }) => {
      await gotoPublicPage(page, surface.path);

      await expect(page.getByTestId(surface.filterTestId)).toBeVisible();
      await expect(page.getByText("Show lower-risk books only")).toBeVisible();
      await expectListingCardSuitability(
        page,
        surface,
        ELEVATED_BOOK_SLUG,
        surface.youngReaderOnlyListingLabels ? null : ELEVATED_LABEL,
      );
      await expectListingCardSuitability(
        page,
        surface,
        LOW_RISK_BOOK_SLUG,
        surface.youngReaderOnlyListingLabels
          ? PUBLIC_YOUNG_READER_LABEL
          : LOWER_RISK_LABEL,
      );

      await searchListing(page, surface, "A Christmas Carol");
      await expectListingCardSuitability(
        page,
        surface,
        ELEVATED_BOOK_SLUG,
        surface.youngReaderOnlyListingLabels ? null : ELEVATED_LABEL,
      );
      await page.getByTestId(surface.filterTestId).check();
      await expect(page.getByTestId(surface.filterTestId)).toBeChecked();
      await expect(cardBySlug(page, surface, ELEVATED_BOOK_SLUG)).toHaveCount(0);

      await searchListing(page, surface, "A Catastrophe");
      await expectListingCardSuitability(
        page,
        surface,
        LOW_RISK_BOOK_SLUG,
        surface.youngReaderOnlyListingLabels
          ? PUBLIC_YOUNG_READER_LABEL
          : LOWER_RISK_LABEL,
      );

      await searchListing(page, surface, "The Threat");
      await expectListingCardSuitability(
        page,
        surface,
        MODERATE_BOOK_SLUG,
        surface.youngReaderOnlyListingLabels ? null : MODERATE_LABEL,
      );

      await expectNoUnsupportedSafetyClaims(page);
    });
  }

  test("book, audiobook, and printable detail pages show suitability notes", async ({
    page,
  }) => {
    await gotoPublicPage(page, `/morse-code-books/${ELEVATED_BOOK_SLUG}`);
    await expect(page.getByTestId("morse-book-content-suitability")).toContainText(
      ELEVATED_LABEL,
    );
    await expect(page.getByTestId("morse-book-content-suitability")).toContainText(
      ELEVATED_NOTE,
    );
    await expectNoUnsupportedSafetyClaims(page);

    await gotoPublicPage(page, `/morse-code-books/${LOW_RISK_BOOK_SLUG}`);
    await expect(page.getByTestId("morse-book-content-suitability")).toContainText(
      LOWER_RISK_LABEL,
    );
    await expect(page.getByTestId("morse-book-content-suitability")).toContainText(
      LOWER_RISK_NOTE,
    );
    await expectNoUnsupportedSafetyClaims(page);

    await gotoPublicPage(page, `/morse-code-audiobooks/${MODERATE_BOOK_SLUG}`);
    await expect(page.getByTestId("morse-book-content-suitability")).toContainText(
      MODERATE_LABEL,
    );
    await expect(page.getByTestId("morse-book-content-suitability")).toContainText(
      MODERATE_NOTE,
    );
    await expectNoUnsupportedSafetyClaims(page);

    await gotoPublicPage(page, `/morse-code-books/${LOW_RISK_BOOK_SLUG}/print`);
    await expect(
      page.getByTestId("printable-book-content-suitability"),
    ).toContainText(LOWER_RISK_LABEL);
    await expect(
      page.getByTestId("printable-book-content-suitability"),
    ).toContainText(LOWER_RISK_NOTE);
    await expectNoUnsupportedSafetyClaims(page);
  });

  test("print routes load with suitability notes and no unavailable-book state", async ({
    page,
  }) => {
    await expectPrintableSuitabilityNote(
      page,
      MODERATE_STRICT_BOOK_SLUG,
      REVIEW_FOR_YOUNGER_READERS_LABEL,
      MODERATE_STRICT_NOTE,
    );

    await expectPrintableSuitabilityNote(
      page,
      ELEVATED_BOOK_SLUG,
      ELEVATED_LABEL,
      ELEVATED_NOTE,
    );
  });

  test("final sanity sampled print routes expose suitability notes", async ({
    page,
  }) => {
    for (const route of FINAL_SANITY_PRINT_ROUTES) {
      await expectPrintableSuitabilityNote(
        page,
        route.slug,
        route.label,
        route.note,
      );
    }
  });
});
