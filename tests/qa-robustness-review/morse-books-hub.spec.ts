import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const ALICE_SLUG = "alices-adventures-in-wonderland";
const TEST_BOOK_SLUG = "test-published-morse-book";
const TEST_BOOK_HUB_PATH = `${ROUTES.morseBooks}?preview=test-published`;
const TEST_COLLECTION_HUB_PATH = `${ROUTES.morseBooks}?preview=test-collection`;
const THEME_STORAGE_KEY = "morsewords-theme";
const PUBLIC_INTERNAL_TERMS = [
  "generated artifacts",
  "generated artifact",
  "raw text inventory",
  "metadata files",
  "pilot artifacts",
  "pilot artifact",
  "review trail",
  "unpublished pilot",
];
const FAKE_PUBLIC_SIGNALS = [
  "star rating",
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
  test("loads the canonical hub with empty state and canonical metadata", async ({
    page,
  }, testInfo) => {
    await gotoHub(page);

    await expect(page).toHaveURL(new RegExp(`${ROUTES.morseBooks}$`));
    await expect(page).toHaveTitle(/Morse Code Books and Morse Audiobooks/);
    await expect(page.locator("h1")).toHaveText(
      "Morse code books and audiobook-style practice",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      absoluteUrl(ROUTES.morseBooks),
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      absoluteUrl(ROUTES.morseBooks),
    );
    await expect(page.locator("[data-testid='morse-books-empty-state']")).toContainText(
      "Curated Morse books are being reviewed.",
    );
    await expect(page.locator("[data-testid='morse-books-toolbar']")).toBeVisible();
    await expect(page.getByLabel("Search title, author, or subject")).toBeDisabled();
    await expect(page.getByLabel("Filter Morse books by subject")).toBeDisabled();
    await expect(page.getByLabel("Filter Morse books by language")).toBeDisabled();
    await expect(page.getByLabel("Sort Morse books")).toBeDisabled();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "0 reviewed books available",
    );
    await expect(
      page.getByText("Books will appear here after source and rights checks are complete."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open the book translator" }),
    ).toHaveAttribute("href", ROUTES.bookTranslator);
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

    const collectionBeforeGuide = await page.evaluate(() => {
      const toolbar = document.querySelector("[data-testid='morse-books-toolbar']");
      const guideHeading = [...document.querySelectorAll("h2")].find((heading) =>
        heading.textContent?.includes("What a Morse book page will do"),
      );
      return Boolean(
        toolbar &&
          guideHeading &&
          toolbar.compareDocumentPosition(guideHeading) &
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
    expect(schemaText).not.toContain(ALICE_SLUG);
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain("reviewRating");
    expect(schemaText).not.toContain('"price"');

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
    expect(xml).not.toContain(absoluteUrl(ROUTES.morseAudiobooksAlias));
    expect(xml).not.toContain(`/morse-code-books/${ALICE_SLUG}`);

    const staticSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(staticSitemap).toContain(absoluteUrl(ROUTES.morseBooks));
    expect(staticSitemap).not.toContain(absoluteUrl(ROUTES.morseAudiobooksAlias));

    await gotoHub(page, ROUTES.sitemap);
    const htmlLinks = await pageLinkPaths(page);
    expect(htmlLinks).toContain(ROUTES.morseBooks);
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
    await expect(page.getByText("Morse audio/video")).toBeVisible();

    const bookLink = page.getByRole("link", {
      name: "Open book page for Test Published Morse Book",
    });
    await expect(bookLink).toHaveAttribute(
      "href",
      `/morse-code-books/${TEST_BOOK_SLUG}?preview=test-published`,
    );

    await page.getByPlaceholder("Search reviewed books").fill("MorseWords QA");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(1);
    await page.getByPlaceholder("Search reviewed books").fill("Alice");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(0);
    await expect(page.getByText("No reviewed books match that search.")).toBeVisible();

    const jsonLd = await parseJsonLd(page);
    const schemaText = JSON.stringify(jsonLd);
    expect(schemaText).not.toContain("Test Published Morse Book");
    expect(schemaText).not.toContain(ALICE_SLUG);

    await saveScreenshot(page, testInfo, "morse-books-hub-test-card.png");
  });

  test("filters, sorts, clears, and shows more development fixture cards", async ({
    page,
  }, testInfo) => {
    await gotoHub(page, TEST_COLLECTION_HUB_PATH);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 12 of 30 reviewed books",
    );
    await expect(page.getByRole("button", { name: "Show more books" })).toBeVisible();
    await expect(page.getByText("Alice's Adventures in Wonderland")).toHaveCount(0);
    await expect(page.locator(`a[href*="${ALICE_SLUG}"]`)).toHaveCount(0);

    await page.getByRole("button", { name: "Show more books" }).click();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(24);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 24 of 30 reviewed books",
    );

    await page.getByLabel("Search title, author, or subject").fill("Book 25");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Test Collection Morse Book 25" })).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1 of 1 reviewed book",
    );

    await page.getByLabel("Search title, author, or subject").fill("Ada Key");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(8);
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 01" }),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 8 of 8 reviewed books",
    );

    await page.getByLabel("Search title, author, or subject").fill("Chapter drills");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(7);
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 03" }),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 7 of 7 reviewed books",
    );

    await page.getByLabel("Search title, author, or subject").fill("");
    await page.getByLabel("Filter Morse books by subject").selectOption(
      "Adventure practice",
    );
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(8);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 8 of 8 reviewed books",
    );

    await page.getByLabel("Filter Morse books by language").selectOption("fr");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(2);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 2 of 2 reviewed books",
    );

    await page.getByLabel("Filter Morse books by subject").selectOption("all");
    await page.getByLabel("Sort Morse books").selectOption("author");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(5);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 5 of 5 reviewed books",
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
    await expect(page.getByText("No reviewed books match that search.")).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 0 of 0 reviewed books",
    );

    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 12 of 30 reviewed books",
    );
    await expect(page.getByLabel("Search title, author, or subject")).toHaveValue("");
    await expect(page.getByLabel("Filter Morse books by subject")).toHaveValue("all");
    await expect(page.getByLabel("Filter Morse books by language")).toHaveValue("all");
    await expect(page.getByLabel("Sort Morse books")).toHaveValue("title");

    const firstCardLink = page
      .locator("[data-testid='morse-book-card']")
      .filter({ hasText: "Test Collection Morse Book 01" })
      .getByRole("link", {
        name: "Open book page for Test Collection Morse Book 01",
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
    await expect(page.locator("[data-testid='morse-books-empty-state']")).toBeVisible();
    expect(await contrastRatio(page.locator("h1"))).toBeGreaterThanOrEqual(4.5);
    expect(
      await contrastRatio(page.locator("[data-testid='morse-books-empty-state'] h3")),
    ).toBeGreaterThanOrEqual(4.5);

    await saveScreenshot(page, testInfo, "morse-books-hub-mobile-dark.png");
  });
});
