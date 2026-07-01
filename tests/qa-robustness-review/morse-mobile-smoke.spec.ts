import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, gotoRoute, waitForRouteReady } from "./helpers";

const MOBILE_ROUTES = [
  "/",
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-books/walden",
  "/morse-code-audiobooks/walden",
  "/morse-code-books/walden/print",
  "/sources",
  "/about",
  "/learn-morse-code",
  "/morse-code-practice-plan",
];

const BOOK_DETAIL_ROUTES = new Set([
  "/morse-code-books/walden",
  "/morse-code-audiobooks/walden",
]);

test.use({ viewport: { width: 390, height: 844 } });

test.beforeEach(async ({ page }) => {
  await blockExternalNetwork(page);
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

async function expectNoHorizontalOverflow(page: Page, route: string) {
  const overflow = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth ?? 0,
    );
    const overflowingElements = Array.from(document.body.querySelectorAll<HTMLElement>("*"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: String(element.className),
          right: rect.right,
          left: rect.left,
          width: rect.width,
        };
      })
      .filter((entry) => entry.width > 1 && (entry.right > viewportWidth + 4 || entry.left < -4))
      .slice(0, 5);

    return {
      viewportWidth,
      documentWidth,
      overflowPixels: documentWidth - viewportWidth,
      overflowingElements,
    };
  });

  expect(overflow.overflowPixels, `${route} horizontal overflow: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(4);
  expect(overflow.overflowingElements, `${route} overflowing elements`).toHaveLength(0);
}

async function expectMobileNavigationUsable(page: Page) {
  const openNavigation = page.getByRole("button", { name: /open navigation/i });
  await expect(openNavigation).toBeVisible();
  await expect(openNavigation).toHaveAttribute("aria-expanded", "false");
  await openNavigation.click();

  const mobileDialog = page.getByRole("dialog", { name: /mobile navigation/i });
  try {
    await expect(mobileDialog).toBeVisible({ timeout: 2500 });
  } catch {
    await page.waitForTimeout(250);
    await openNavigation.click();
    await expect(mobileDialog).toBeVisible();
  }
  await expect(mobileDialog.getByRole("searchbox", { name: /search morsewords tools/i })).toBeVisible();

  await mobileDialog.getByRole("button", { name: /close navigation/i }).click();
  await expect(mobileDialog).toBeHidden();
}

async function expectUnsupportedSafetyClaimsAbsent(page: Page) {
  await expect(page.getByText(/all-audience safe/i)).toHaveCount(0);
  await expect(page.getByText(/classroom-safe by default/i)).toHaveCount(0);
  await expect(page.getByText(/youth-safe by default/i)).toHaveCount(0);
  await expect(page.getByText(/safe for all ages/i)).toHaveCount(0);
}

async function expectMainVisible(page: Page) {
  await expect(page.locator("main").first()).toBeVisible();
}

async function expectBookContentAvailable(page: Page) {
  await expect(page.getByText(/Book text unavailable/i)).toHaveCount(0);
  await expect(page.getByText(/This Morse book is not available right now/i)).toHaveCount(0);
}

async function expectSuitabilityVisible(page: Page, route: string) {
  if (route === "/morse-code-books") {
    await expect(page.getByTestId("morse-book-card-content-suitability").first()).toBeVisible();
    return;
  }
  if (route === "/morse-code-audiobooks") {
    await expect(page.getByTestId("morse-audiobook-card-content-suitability").first()).toBeVisible();
    return;
  }
  if (route === "/morse-code-books/walden/print") {
    await expect(page.getByTestId("printable-book-content-suitability")).toBeVisible();
    await expect(page.getByTestId("printable-book-content-suitability")).toContainText(/Historical public-domain|Review for younger readers/i);
    return;
  }
  if (BOOK_DETAIL_ROUTES.has(route)) {
    await expect(page.getByTestId("morse-book-content-suitability")).toBeVisible();
  }
}

async function expectLowerRiskFilterUsable(page: Page, kind: "books" | "audiobooks") {
  const isBooks = kind === "books";
  const filter = page.getByTestId(isBooks ? "morse-books-lower-risk-filter" : "morse-audiobooks-lower-risk-filter");
  const browser = page.getByTestId(isBooks ? "morse-books-browser" : "morse-audiobooks-browser");
  const cardSelector = isBooks ? "morse-book-card" : "morse-audiobook-card";
  const slugAttr = isBooks ? "data-mw-morse-book-card-slug" : "data-mw-morse-audiobook-card-slug";
  const elevatedCard = page.locator(`[data-testid="${cardSelector}"][${slugAttr}="a-christmas-carol"]`);
  const lowerRiskCard = page.locator(`[data-testid="${cardSelector}"][${slugAttr}="a-catastrophe"]`);
  const search = browser.locator('input[type="search"]');

  await expect(filter).toBeVisible();
  await search.fill("A Christmas Carol");
  await expect(elevatedCard).toHaveCount(1);
  await filter.check();
  await expect(elevatedCard).toHaveCount(0);

  await search.fill("A Catastrophe");
  await expect(lowerRiskCard).toHaveCount(1);
  await expect(lowerRiskCard.getByTestId(isBooks ? "morse-book-card-content-suitability" : "morse-audiobook-card-content-suitability")).toBeVisible();
}

test("core local routes load cleanly at 390px", async ({ page }) => {
  for (const route of MOBILE_ROUTES) {
    await gotoRoute(page, route);
    await waitForRouteReady(page);
    await expectMainVisible(page);
    await expectMobileNavigationUsable(page);
    await expectUnsupportedSafetyClaimsAbsent(page);

    if (route.includes("/morse-code-books") || route.includes("/morse-code-audiobooks")) {
      await expectBookContentAvailable(page);
      await expectSuitabilityVisible(page, route);
    }

    await expectNoHorizontalOverflow(page, route);
  }
});

test("lower-risk listing filters remain usable on mobile", async ({ page }) => {
  await gotoRoute(page, "/morse-code-books");
  await waitForRouteReady(page);
  await expectLowerRiskFilterUsable(page, "books");
  await expectNoHorizontalOverflow(page, "/morse-code-books lower-risk filter");

  await gotoRoute(page, "/morse-code-audiobooks");
  await waitForRouteReady(page);
  await expectLowerRiskFilterUsable(page, "audiobooks");
  await expectNoHorizontalOverflow(page, "/morse-code-audiobooks lower-risk filter");
});

test("print route keeps suitability visible on mobile", async ({ page }) => {
  await gotoRoute(page, "/morse-code-books/walden/print");
  await waitForRouteReady(page);
  await expect(page.getByTestId("printable-preview")).toBeVisible();
  await expect(page.getByTestId("printable-book-content-suitability")).toBeVisible();
  await expect(page.getByTestId("printable-book-content-suitability")).toContainText(/Historical public-domain|Review for younger readers/i);
  await expectBookContentAvailable(page);
  await expectNoHorizontalOverflow(page, "/morse-code-books/walden/print");
});
