import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const ALICE_SLUG = "alices-adventures-in-wonderland";
const APPROVED_BOOK_SLUG = "anne-of-green-gables";
const APPROVED_BOOK_PATH = `${ROUTES.morseBooks}/${APPROVED_BOOK_SLUG}`;
const TEST_BOOK_SLUG = "test-published-morse-book";
const TEST_BOOK_HUB_PATH = `${ROUTES.morseBooks}?preview=test-published`;
const TEST_COLLECTION_HUB_PATH = `${ROUTES.morseBooks}?preview=test-collection`;
const THEME_STORAGE_KEY = "morsewords-theme";
const PUBLIC_INTERNAL_TERMS = [
  "reviewed morse books are coming soon",
  "checked and prepared",
  "rights-approved",
  "source and rights",
  "review queue",
  "generated artifacts",
  "generated artifact",
  "raw text inventory",
  "metadata",
  "pilot artifacts",
  "pilot artifact",
  "review trail",
  "raw files",
  "source checks",
  "rights review",
  "unpublished pilot",
  "not a public listing yet",
  "reviewed public-domain",
  "reviewed books",
  "reviewed book",
  "what a morse book page will do",
  "why reviewed books are listed slowly",
];
const FAKE_PUBLIC_SIGNALS = [
  "star rating",
  "rating",
  "page count",
  "reviews",
  "favorites",
  "popularity",
];

async function gotoHub(page: Page, pathName = ROUTES.morseBooks) {
  await blockExternalNetwork(page);
  const response = await page.goto(pathName, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
}

async function saveScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const screenshotPath = testInfo.outputPath(name);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(name, {
    path: screenshotPath,
    contentType: "image/png",
  });
}

async function pageLinkPaths(page: Page) {
  return page.locator("a[href]").evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const href = (anchor as HTMLAnchorElement).getAttribute("href") ?? "";
      return new URL(href, window.location.href).pathname;
    }),
  );
}

async function parseJsonLd(page: Page) {
  return page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent ?? "{}") as unknown),
    );
}

async function contrastRatio(locator: Locator) {
  return locator.evaluate((element) => {
    type Channels = { r: number; g: number; b: number; a: number };

    function parseColor(value: string): Channels | null {
      const rgb = value.match(/^rgba?\(([^)]+)\)$/);
      if (!rgb) return null;
      const parts = rgb[1].split(",").map((part) => Number.parseFloat(part));
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: parts.length > 3 ? parts[3] : 1,
      };
    }

    function blend(foreground: Channels, background: Channels): Channels {
      const alpha = foreground.a + background.a * (1 - foreground.a);
      if (alpha <= 0) return { r: 0, g: 0, b: 0, a: 0 };
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

    function backgroundFor(node: Element) {
      let background: Channels = { r: 0, g: 0, b: 0, a: 0 };
      for (let current: Element | null = node; current; current = current.parentElement) {
        const parsed = parseColor(window.getComputedStyle(current).backgroundColor);
        if (parsed) background = blend(background, parsed);
        if (background.a > 0.98) return background;
      }
      const body =
        parseColor(window.getComputedStyle(document.body).backgroundColor) ?? {
          r: 245,
          g: 242,
          b: 235,
          a: 1,
        };
      return blend(background, body);
    }

    function luminance(color: Channels) {
      const channels = [color.r, color.g, color.b].map((value) => {
        const channel = value / 255;
        return channel <= 0.03928
          ? channel / 12.92
          : Math.pow((channel + 0.055) / 1.055, 2.4);
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }

    const foreground = parseColor(window.getComputedStyle(element).color);
    if (!foreground) return 0;
    const background = backgroundFor(element);
    const light = Math.max(luminance(foreground), luminance(background));
    const dark = Math.min(luminance(foreground), luminance(background));
    return (light + 0.05) / (dark + 0.05);
  });
}

test.describe("Morse books hub", () => {
  test("loads the canonical hub with approved books and canonical metadata", async ({
    page,
    request,
  }, testInfo) => {
    await gotoHub(page);

    await expect(page).toHaveURL(new RegExp(`${ROUTES.morseBooks}$`));
    await expect(page).toHaveTitle(/Morse Code Books and Audiobooks/);
    await expect(page.locator("h1")).toHaveText("Morse code books and audiobooks");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      absoluteUrl(ROUTES.morseBooks),
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      absoluteUrl(ROUTES.morseBooks),
    );
    await expect(page.locator("main > section").first()).not.toContainText(
      "source and rights review",
    );
    await expect(page.locator("[data-testid='morse-books-browser']")).toBeVisible();
    const collectionModule = page.locator(
      "[data-testid='morse-books-collection-module']",
    );
    await expect(collectionModule).toBeVisible();
    await expect(collectionModule.locator("[data-testid='morse-books-toolbar']")).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-empty-state']")).toHaveCount(0);
    await expect(collectionModule.locator("[data-testid='morse-books-card-grid']")).toBeVisible();
    await expect(collectionModule.locator("[data-testid='morse-books-placeholder-grid']")).toHaveCount(0);
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.getByRole("heading", { name: "Anne of Green Gables" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open book for Anne of Green Gables" }),
    ).toHaveAttribute("href", APPROVED_BOOK_PATH);
    await expect(collectionModule.locator("[data-testid='morse-books-toolbar']")).toBeVisible();
    await expect(page.getByLabel("Search title, author, or subject")).toBeEnabled();
    await expect(page.getByLabel("Filter Morse books by subject")).toBeDisabled();
    await expect(page.getByLabel("Filter Morse books by language")).toBeEnabled();
    await expect(page.getByLabel("Sort Morse books")).toBeEnabled();
    await page.getByLabel("Search title, author, or subject").fill("Alice");
    await expect(page.getByLabel("Search title, author, or subject")).toHaveValue(
      "Alice",
    );
    await expect(page.getByRole("button", { name: "Clear filters" })).toBeEnabled();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByLabel("Search title, author, or subject")).toHaveValue("");
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-12 of 16 books",
    );

    const collectionOrder = await page.evaluate(() => {
      const toolbar = document.querySelector("[data-testid='morse-books-toolbar']");
      const resultCount = document.querySelector(
        "[data-testid='morse-books-result-count']",
      );
      const shelf = document.querySelector(
        "[data-testid='morse-books-card-grid']",
      );
      return Boolean(
        toolbar &&
          resultCount &&
          shelf &&
          (toolbar.compareDocumentPosition(resultCount) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
            0 &&
          (resultCount.compareDocumentPosition(shelf) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
            0,
      );
    });
    expect(collectionOrder).toBe(true);

    const [shellBox, shelfBox, firstPlaceholderBox] = await Promise.all([
      page.locator("[data-testid='morse-books-collection-module']").boundingBox(),
      page.locator("[data-testid='morse-books-card-grid']").boundingBox(),
      page.locator("[data-testid='morse-book-card']").first().boundingBox(),
    ]);
    expect(shelfBox?.width ?? 0).toBeGreaterThan((shellBox?.width ?? 0) * 0.88);
    expect(firstPlaceholderBox?.height ?? 0).toBeGreaterThan(250);
    expect(firstPlaceholderBox?.width ?? 0).toBeGreaterThan(150);

    await expect(page.getByText("Alice's Adventures in Wonderland")).toHaveCount(0);
    await expect(page.locator(`a[href*="${ALICE_SLUG}"]`)).toHaveCount(0);

    const publicMainText = (await page.locator("main").innerText()).toLowerCase();
    for (const term of PUBLIC_INTERNAL_TERMS) {
      expect(publicMainText, `public hub hides internal term: ${term}`).not.toContain(
        term,
      );
    }
    for (const term of FAKE_PUBLIC_SIGNALS) {
      expect(publicMainText, `public hub hides fake signal: ${term}`).not.toContain(
        term,
      );
    }
    expect(publicMainText, "public hub hides Alice by name").not.toContain("alice");
    expect(publicMainText, "public hub hides unpublished slug").not.toContain(
      ALICE_SLUG,
    );

    const collectionBeforeGuide = await page.evaluate(() => {
      const browser = document.querySelector("[data-testid='morse-books-browser']");
      const guideHeading = [...document.querySelectorAll("h2")].find((heading) =>
        heading.textContent?.includes("What you can do with a Morse book"),
      );
      return Boolean(
        browser &&
          guideHeading &&
          browser.compareDocumentPosition(guideHeading) &
            Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
    expect(collectionBeforeGuide).toBe(true);

    const links = await pageLinkPaths(page);
    expect(links, "hub links use canonical destinations").toContain(
      ROUTES.bookTranslator,
    );
    expect(links, "hub does not link audiobook alias").not.toContain(
      ROUTES.morseAudiobooksAlias,
    );

    const jsonLd = await parseJsonLd(page);
    const schemaText = JSON.stringify(jsonLd);
    expect(schemaText).toContain('"@type":"CollectionPage"');
    expect(schemaText).toContain(absoluteUrl(ROUTES.morseBooks));
    expect(schemaText).toContain(APPROVED_BOOK_PATH);
    expect(schemaText).not.toContain(ALICE_SLUG);
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain("reviewRating");
    expect(schemaText).not.toContain('"price"');

    const alicePublicResponse = await request.get(
      `/morse-code-books/${ALICE_SLUG}`,
    );
    expect(alicePublicResponse.status()).toBe(404);
    const alicePreviewResponse = await request.get(
      `/morse-code-books/${ALICE_SLUG}?preview=unpublished`,
    );
    expect(alicePreviewResponse.ok()).toBe(true);
    const alicePreviewHtml = await alicePreviewResponse.text();
    expect(alicePreviewHtml).toContain("noindex,nofollow");

    await saveScreenshot(page, testInfo, "morse-books-hub-empty-desktop.png");
  });

  test("redirects audiobook alias and keeps sitemap canonical", async ({
    page,
    request,
  }) => {
    const aliasResponse = await request.get(ROUTES.morseAudiobooksAlias, {
      maxRedirects: 0,
    });
    expect(aliasResponse.status()).toBe(301);
    expect(aliasResponse.headers().location).toBe(ROUTES.morseBooks);

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml).toContain(absoluteUrl(ROUTES.morseBooks));
    expect(xml).toContain(absoluteUrl(APPROVED_BOOK_PATH));
    expect(xml).not.toContain(absoluteUrl(ROUTES.morseAudiobooksAlias));
    expect(xml).not.toContain(`/morse-code-books/${ALICE_SLUG}`);

    const staticSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(staticSitemap).toContain(absoluteUrl(ROUTES.morseBooks));
    expect(staticSitemap).toContain(absoluteUrl(APPROVED_BOOK_PATH));
    expect(staticSitemap).not.toContain(absoluteUrl(ROUTES.morseAudiobooksAlias));

    await gotoHub(page, ROUTES.sitemap);
    const htmlLinks = await pageLinkPaths(page);
    expect(htmlLinks).toContain(ROUTES.morseBooks);
    expect(htmlLinks).toContain(APPROVED_BOOK_PATH);
    expect(htmlLinks).not.toContain(ROUTES.morseAudiobooksAlias);
  });

  test("shows only publish-ready books when a development fixture is enabled", async ({
    page,
  }, testInfo) => {
    await gotoHub(page, TEST_BOOK_HUB_PATH);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Test Published Morse Book" }),
    ).toBeVisible();
    await expect(page.getByText("Alice's Adventures in Wonderland")).toHaveCount(0);
    await expect(
      page.locator("[data-mw-morse-books-cover-placeholder='true']"),
    ).toBeVisible();
    await expect(
      page.locator("[data-mw-morse-books-cover-placeholder='true']"),
    ).toHaveAttribute("role", "img");
    await expect(
      page.locator("[data-mw-morse-books-cover-placeholder='true'] img"),
    ).toHaveCount(0);
    const card = page.locator("[data-testid='morse-book-card']");
    await expect(card.locator("[data-testid='morse-book-output-badge']")).toHaveText([
      "Audio",
      "Video",
      "Practice",
    ]);
    await expect(card).toContainText("sections");
    await expect(card).toContainText("words");

    const bookLink = page.getByRole("link", {
      name: "Open book for Test Published Morse Book",
    });
    await expect(bookLink).toHaveAttribute(
      "href",
      `/morse-code-books/${TEST_BOOK_SLUG}?preview=test-published`,
    );

    const searchInput = page.getByLabel("Search title, author, or subject");
    await searchInput.fill("MorseWords QA");
    await expect(searchInput).toHaveValue("MorseWords QA");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(1);
    await searchInput.fill("Alice");
    await expect(searchInput).toHaveValue("Alice");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(0);
    await expect(page.getByText("No books match your current view")).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-no-matches']")).toContainText(
      "Clear filters or try another title, author, or subject.",
    );
    await expect(page.locator("[data-testid='morse-books-no-matches'] a")).toHaveCount(
      0,
    );
    await expect(page.locator("[data-testid='morse-books-placeholder-card']")).toHaveCount(
      5,
    );

    const jsonLd = await parseJsonLd(page);
    const schemaText = JSON.stringify(jsonLd);
    expect(schemaText).not.toContain("Test Published Morse Book");
    expect(schemaText).not.toContain(ALICE_SLUG);

    await saveScreenshot(page, testInfo, "morse-books-hub-test-card.png");
  });

  test("filters, sorts, clears, and paginates development fixture cards", async ({
    page,
  }, testInfo) => {
    await gotoHub(page, TEST_COLLECTION_HUB_PATH);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    const collectionModule = page.locator(
      "[data-testid='morse-books-collection-module']",
    );
    await expect(collectionModule).toBeVisible();
    await expect(collectionModule.locator("[data-testid='morse-books-toolbar']")).toBeVisible();
    await expect(collectionModule.locator("[data-testid='morse-books-card-grid']")).toBeVisible();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-book-cover-placeholder']").first()).toBeVisible();
    await expect(page.locator("[data-testid='morse-book-card-title']").first()).toHaveText(
      "Test Collection Morse Book 01",
    );
    await expect(page.locator("[data-testid='morse-book-card-author']").first()).toHaveText(
      "Ada Key",
    );
    await expect(
      page.locator("[data-testid='morse-book-card']").first().getByRole("link", {
        name: "Open book for Test Collection Morse Book 01",
      }),
    ).toBeVisible();
    await expect(
      page.locator("[data-testid='morse-book-subject-chip']").filter({
        hasText: "fixture",
      }),
    ).toHaveCount(0);
    await expect(
      page.locator("[data-testid='morse-book-card']").first().locator(
        "[data-testid='morse-book-subject-chip']",
      ),
    ).toHaveCount(2);
    await expect(
      page.locator("[data-testid='morse-book-output-badge']").filter({
        hasText: "Audio",
      }),
    ).toHaveCount(12);
    await expect(
      page.locator("[data-testid='morse-book-output-badge']").filter({
        hasText: "Video",
      }),
    ).toHaveCount(12);
    await expect(
      page.locator("[data-testid='morse-book-output-badge']").filter({
        hasText: "Practice",
      }),
    ).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-book-card']").first()).not.toContainText(
      "MorseWords test fixture",
    );
    await expect(page.locator("[data-testid='morse-book-card']").first()).not.toContainText(
      "Development-only",
    );
    await expect(page.locator("[data-testid='morse-book-card']").first()).toContainText(
      "sections",
    );
    await expect(page.locator("[data-testid='morse-book-card']").first()).toContainText(
      "words",
    );
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-12 of 30 books",
    );
    await expect(page.getByRole("button", { name: "Show more books" })).toHaveCount(0);
    const pagination = page.locator("[data-testid='morse-books-pagination']");
    await expect(pagination).toBeVisible();
    await expect(pagination.getByRole("button", { name: "1", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(pagination.getByRole("button", { name: "Previous" })).toBeDisabled();
    await expect(pagination.getByRole("button", { name: "Next" })).toBeEnabled();
    await expect(page.getByText("Alice's Adventures in Wonderland")).toHaveCount(0);
    await expect(page.locator(`a[href*="${ALICE_SLUG}"]`)).toHaveCount(0);

    const collectionMainText = (await page.locator("main").innerText()).toLowerCase();
    for (const term of FAKE_PUBLIC_SIGNALS) {
      expect(
        collectionMainText,
        `fixture collection hides fake signal: ${term}`,
      ).not.toContain(term);
    }

    await pagination.getByRole("button", { name: "Next" }).click();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 13-24 of 30 books",
    );
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 13" }),
    ).toBeVisible();

    await pagination.getByRole("button", { name: "3", exact: true }).click();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(6);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 25-30 of 30 books",
    );

    await page.getByLabel("Search title, author, or subject").fill("Book 25");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Test Collection Morse Book 25" })).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1 of 1 book",
    );

    await page.getByLabel("Search title, author, or subject").fill("Ada Key");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(8);
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 01" }),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-8 of 8 books",
    );

    await page.getByLabel("Search title, author, or subject").fill("Chapter drills");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(7);
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 03" }),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-7 of 7 books",
    );

    await page.getByLabel("Search title, author, or subject").fill("");
    await page.getByLabel("Filter Morse books by subject").selectOption(
      "Adventure practice",
    );
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(8);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-8 of 8 books",
    );

    await page.getByLabel("Filter Morse books by language").selectOption("fr");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(2);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-2 of 2 books",
    );

    await page.getByLabel("Filter Morse books by subject").selectOption("all");
    await page.getByLabel("Sort Morse books").selectOption("author");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(5);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-5 of 5 books",
    );
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").first(),
    ).toHaveText("Test Collection Morse Book 01");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").nth(1),
    ).toHaveText("Test Collection Morse Book 29");

    await page.getByLabel("Sort Morse books").selectOption("wordCount");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").first(),
    ).toHaveText("Test Collection Morse Book 01");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").nth(1),
    ).toHaveText("Test Collection Morse Book 08");

    await page.getByLabel("Search title, author, or subject").fill("not a book");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(0);
    await expect(page.getByText("No books match your current view")).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 0 of 0 books",
    );

    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-12 of 30 books",
    );
    await expect(page.getByLabel("Search title, author, or subject")).toHaveValue("");
    await expect(page.getByLabel("Filter Morse books by subject")).toHaveValue("all");
    await expect(page.getByLabel("Filter Morse books by language")).toHaveValue("all");
    await expect(page.getByLabel("Sort Morse books")).toHaveValue("title");

    const firstCardLink = page
      .locator("[data-testid='morse-book-card']")
      .filter({ hasText: "Test Collection Morse Book 01" })
      .getByRole("link", {
        name: "Open book for Test Collection Morse Book 01",
      });
    await expect(firstCardLink).toHaveAttribute(
      "href",
      "/morse-code-books/test-collection-morse-book-01",
    );

    const jsonLd = await parseJsonLd(page);
    const schemaText = JSON.stringify(jsonLd);
    expect(schemaText).not.toContain("Test Collection Morse Book 01");
    expect(schemaText).not.toContain(ALICE_SLUG);

    await saveScreenshot(page, testInfo, "morse-books-hub-test-collection.png");
  });

  test("stays readable on mobile and dark mode", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((themeKey) => {
      window.localStorage.setItem(themeKey, "dark");
      document.documentElement.dataset.theme = "dark";
    }, THEME_STORAGE_KEY);

    await gotoHub(page);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-card-grid']")).toBeVisible();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    expect(await contrastRatio(page.locator("h1"))).toBeGreaterThanOrEqual(4.5);
    expect(
      await contrastRatio(
        page.locator("[data-testid='morse-book-card-title']").first(),
      ),
    ).toBeGreaterThanOrEqual(4.5);

    await saveScreenshot(page, testInfo, "morse-books-hub-mobile-dark.png");
  });
});
