import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import {
  matchesNormalizedSearch,
  normalizeSearchText,
  tokenizeSearchText,
} from "../../app/client/utils/searchNormalization";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const ALICE_SLUG = "alices-adventures-in-wonderland";
const APPROVED_BOOK_SLUG = ALICE_SLUG;
const APPROVED_BOOK_PATH = `${ROUTES.morseBooks}/${APPROVED_BOOK_SLUG}`;
const APPROVED_AUDIOBOOK_PATH = `${ROUTES.morseAudiobooks}/${APPROVED_BOOK_SLUG}`;
const TEST_BOOK_SLUG = "test-published-morse-book";
const TEST_BOOK_HUB_PATH = `${ROUTES.morseBooks}?preview=test-published`;
const TEST_COLLECTION_HUB_PATH = `${ROUTES.morseBooks}?preview=test-collection`;
const THEME_STORAGE_KEY = "morsewords-theme";
const NORMALIZED_BOOK_SEARCH_CASES = [
  { query: "The Hound of the Baskervilles", title: "The Hound of the Baskervilles" },
  { query: "The  Hound  of  the  Baskervilles", title: "The Hound of the Baskervilles" },
  { query: "The Hound of the Baskervilles!", title: "The Hound of the Baskervilles" },
  { query: "\u201cThe Hound of the Baskervilles\u201d", title: "The Hound of the Baskervilles" },
  { query: "The-Hound-of-the-Baskervilles", title: "The Hound of the Baskervilles" },
  { query: "Hound Baskervilles", title: "The Hound of the Baskervilles" },
  { query: "The Call of Cthulhu", title: /The call of Cthulhu/i },
  { query: "The  Call  of  Cthulhu", title: /The call of Cthulhu/i },
  { query: "The Call of Cthulhu!", title: /The call of Cthulhu/i },
  { query: "The-Call-of-Cthulhu", title: /The call of Cthulhu/i },
  { query: "Alice's Adventures in Wonderland", title: "Alice's Adventures in Wonderland" },
  { query: "Alice\u2019s Adventures in Wonderland", title: "Alice's Adventures in Wonderland" },
  { query: "Alice Adventures in Wonderland", title: "Alice's Adventures in Wonderland" },
  { query: "Alice in Wonderland", title: "Alice's Adventures in Wonderland" },
  { query: "Alice-in-Wonderland", title: "Alice's Adventures in Wonderland" },
] satisfies { query: string; title: string | RegExp }[];
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

function publicBookCount() {
  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "app/client/assets/books/cloudflare-export/public-manifest.json",
      ),
      "utf8",
    ),
  ) as { books: unknown[] };
  return manifest.books.length;
}
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

async function selectOptionLabels(locator: Locator) {
  return locator.locator("option").evaluateAll((options) =>
    options.map((option) => (option.textContent ?? "").trim()),
  );
}

async function cardTitles(page: Page) {
  return page.locator("[data-testid='morse-book-card-title']").evaluateAll((titles) =>
    titles.map((title) => (title.textContent ?? "").trim()),
  );
}

async function expectBookSearchResult(
  page: Page,
  searchInput: Locator,
  query: string,
  title: string | RegExp,
) {
  await searchInput.fill(query);
  await expect(searchInput).toHaveValue(query);
  await expect(page.locator("[data-testid='morse-books-no-matches']")).toHaveCount(0);
  await expect(page.locator("[data-testid='morse-book-card']").first()).toBeVisible();
  await expect(
    page.locator("[data-testid='morse-book-card-title']").filter({ hasText: title }),
  ).toBeVisible();
  await expect(page.locator("[data-testid='morse-audiobook-card']")).toHaveCount(0);
}

async function expectAudiobookSearchResult(
  page: Page,
  searchInput: Locator,
  query: string,
  title: string | RegExp,
) {
  await searchInput.fill(query);
  await expect(searchInput).toHaveValue(query);
  await expect(page.locator("[data-testid='morse-audiobooks-no-matches']")).toHaveCount(
    0,
  );
  await expect(page.locator("[data-testid='morse-audiobook-card']").first()).toBeVisible();
  await expect(
    page
      .locator("[data-testid='morse-audiobook-card-title']")
      .filter({ hasText: title }),
  ).toBeVisible();
  await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(0);
}

async function expectCollectionTopReturned(page: Page) {
  await expect
    .poll(async () =>
      page.evaluate(() => {
        const collection = document.querySelector(
          "[data-testid='morse-books-collection-module']",
        );
        return collection ? Math.round(collection.getBoundingClientRect().top) : 9999;
      }),
    )
    .toBeLessThan(120);
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
  test("normalizes search text without losing exact phrase matching", () => {
    expect(normalizeSearchText("  \u201cAlice\u2019s-Adventures!\u201d  ")).toBe(
      "alice s adventures",
    );
    expect(tokenizeSearchText("The--Hound  of  the Baskervilles")).toEqual([
      "the",
      "hound",
      "of",
      "the",
      "baskervilles",
    ]);
    expect(
      matchesNormalizedSearch(
        "The Hound of the Baskervilles by Arthur Conan Doyle",
        "Hound Baskervilles",
      ),
    ).toBe(true);
    expect(
      matchesNormalizedSearch(
        "Alice's Adventures in Wonderland",
        "Alice Adventures in Wonderland",
      ),
    ).toBe(true);
    expect(matchesNormalizedSearch("Morse code chart", "x")).toBe(false);
    expect(matchesNormalizedSearch("Morse code chart", "morse x")).toBe(false);
  });

  test("loads the canonical hub with approved books and canonical metadata", async ({
    page,
    request,
  }, testInfo) => {
    const bookJsonRequests: string[] = [];
    await page.route(/\/morse-book-content\/books\/(?:anne-of-green-gables|treasure-island|frankenstein)\.json(?:\?|$)/, async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });
    await gotoHub(page);

    await expect(page).toHaveURL(new RegExp(`${ROUTES.morseBooks}$`));
    await expect(page).toHaveTitle(/Morse Code Books/);
    await expect(page.locator("h1")).toHaveText("Morse code books");
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
    await expect(page.getByRole("link", { name: /^Open book/ })).toHaveCount(0);
    await expect(page.locator("[data-testid='morse-book-output-badge']")).toHaveCount(0);
    await expect(page.locator("[data-testid='morse-book-subject-chip']")).toHaveCount(0);
    await expect(collectionModule.locator("[data-testid='morse-books-toolbar']")).toBeVisible();
    const searchInput = page.getByLabel(
      "Search title, author, description, or subject",
    );
    const subjectFilter = page.getByLabel("Filter Morse books by subject");
    const sortSelect = page.getByLabel("Sort Morse books");
    await expect(searchInput).toBeEnabled();
    await expect(subjectFilter).toBeEnabled();
    await expect(page.getByLabel("Filter Morse books by language")).toHaveCount(0);
    await expect(sortSelect).toBeEnabled();
    await expect(sortSelect).toHaveValue("title-az");
    await expect(page.getByRole("button", { name: "Clear filters" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Reset view" })).toHaveCount(0);
    const publicSubjectLabels = await selectOptionLabels(subjectFilter);
    expect(publicSubjectLabels.length).toBeGreaterThan(3);
    expect(publicSubjectLabels.join(" ")).toContain("Adventure");
    const sortLabels = await selectOptionLabels(sortSelect);
    expect(sortLabels).toEqual([
      "Title A-Z",
      "Title Z-A",
      "Author A-Z",
      "Author Z-A",
      "Word count low to high",
      "Word count high to low",
    ]);

    await searchInput.fill("Alice");
    await expect(searchInput).toHaveValue("Alice");
    const aliceBookCount = await page
      .locator("[data-testid='morse-book-card']")
      .count();
    expect(aliceBookCount).toBeGreaterThan(0);
    expect(aliceBookCount).toBeLessThanOrEqual(12);
    await expect(page.getByRole("heading", { name: "Alice's Adventures in Wonderland" })).toBeVisible();
    const approvedCard = page
      .locator("[data-testid='morse-book-card']")
      .filter({ hasText: "Alice's Adventures in Wonderland" });
    await expect(approvedCard).toHaveAttribute("href", APPROVED_BOOK_PATH);
    await expect(approvedCard.locator("[data-testid='morse-book-card-description']")).toBeVisible();
    await expect(approvedCard.locator("[data-testid='morse-book-card-subjects']")).toContainText(
      "Children",
    );
    await expect(approvedCard.locator("[data-testid='morse-book-card-meta']")).toContainText(
      "Project Gutenberg",
    );
    await expect(page.getByRole("button", { name: "Reset view" })).toBeVisible();
    await page.getByRole("button", { name: "Reset view" }).click();
    await expect(searchInput).toHaveValue("");
    await expect(subjectFilter).toHaveValue("all");
    await expect(sortSelect).toHaveValue("title-az");
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      `Showing 1-12 of ${publicBookCount()} books`,
    );

    await searchInput.fill("Stevenson");
    const stevensonBookCount = await page
      .locator("[data-testid='morse-book-card']")
      .count();
    expect(stevensonBookCount).toBeGreaterThan(0);
    expect(stevensonBookCount).toBeLessThanOrEqual(12);
    await expect(page.getByRole("heading", { name: "Treasure Island" })).toBeVisible();
    await searchInput.fill("Gothic");
    await expect(page.locator("[data-testid='morse-book-card']").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Frankenstein; or, the modern prometheus" })).toBeVisible();
    await searchInput.fill("");
    await subjectFilter.selectOption("Adventure");
    const adventureCount = await page.locator("[data-testid='morse-book-card']").count();
    expect(adventureCount).toBeGreaterThan(0);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      /Showing 1-\d+ of \d+ books/,
    );
    await page.getByRole("button", { name: "Reset view" }).click();
    expect(bookJsonRequests).toEqual([]);

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

    await expect(page.getByText("Alice's Adventures in Wonderland").first()).toBeVisible();
    await expect(page.locator(`a[href*="${ALICE_SLUG}"]`).first()).toBeVisible();

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
    expect(publicMainText, "public hub lists processed Alice").toContain("alice");

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
    expect(links, "hub links to audiobook collection").toContain(
      ROUTES.morseAudiobooks,
    );

    const jsonLd = await parseJsonLd(page);
    const schemaText = JSON.stringify(jsonLd);
    expect(schemaText).toContain('"@type":"CollectionPage"');
    expect(schemaText).toContain(absoluteUrl(ROUTES.morseBooks));
    expect(schemaText).toContain(APPROVED_BOOK_PATH);
    expect(schemaText).toContain(ALICE_SLUG);
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain("reviewRating");
    expect(schemaText).not.toContain('"price"');

    const alicePublicResponse = await request.get(
      `/morse-code-books/${ALICE_SLUG}`,
    );
    expect(alicePublicResponse.ok()).toBe(true);
    await saveScreenshot(page, testInfo, "morse-books-hub-desktop.png");
  });

  test("finds books with normalized title search variants", async ({ page }) => {
    await gotoHub(page);

    const searchInput = page.getByLabel(
      "Search title, author, description, or subject",
    );
    await expect(searchInput).toBeEnabled();

    for (const searchCase of NORMALIZED_BOOK_SEARCH_CASES) {
      await test.step(`book search: ${searchCase.query}`, async () => {
        await expectBookSearchResult(
          page,
          searchInput,
          searchCase.query,
          searchCase.title,
        );
      });
    }
  });

  test("loads audiobook hub as canonical page and keeps sitemap approved-only", async ({
    page,
    request,
  }, testInfo) => {
    const bookJsonRequests: string[] = [];
    await page.route(/\/morse-book-content\/books\/(?:anne-of-green-gables|treasure-island|frankenstein)\.json(?:\?|$)/, async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });
    await gotoHub(page, ROUTES.morseAudiobooks);

    await expect(page).toHaveURL(new RegExp(`${ROUTES.morseAudiobooks}$`));
    await expect(page).toHaveTitle(/Morse Code Audiobooks/);
    await expect(page.locator("h1")).toHaveText("Morse code audiobooks");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      absoluteUrl(ROUTES.morseAudiobooks),
    );
    await expect(page.locator("[data-testid='morse-audiobooks-browser']")).toBeVisible();
    await expect(page.locator("[data-testid='morse-audiobook-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-audiobooks-result-count']")).toHaveText(
      `Showing 1-12 of ${publicBookCount()} audiobooks`,
    );
    const searchInput = page.getByLabel(
      "Search Morse audiobooks by title, author, source, or subject",
    );
    const subjectFilter = page.getByLabel("Filter Morse audiobooks by subject");
    const sortSelect = page.getByLabel("Sort Morse audiobooks");
    await expect(searchInput).toBeEnabled();
    await expect(subjectFilter).toBeEnabled();
    await expect(sortSelect).toHaveValue("title-az");
    await searchInput.fill("Alice");
    const approvedAudiobookCard = page
      .locator("[data-testid='morse-audiobook-card']")
      .filter({ hasText: "Alice's Adventures in Wonderland" });
    await expect(approvedAudiobookCard).toHaveAttribute("href", APPROVED_AUDIOBOOK_PATH);
    await expect(approvedAudiobookCard.locator("[data-testid='morse-audiobook-card-meta']")).toContainText(
      "Morse audiobook",
    );
    await searchInput.fill("Stevenson");
    const stevensonAudiobookCount = await page
      .locator("[data-testid='morse-audiobook-card']")
      .count();
    expect(stevensonAudiobookCount).toBeGreaterThan(0);
    expect(stevensonAudiobookCount).toBeLessThanOrEqual(12);
    await searchInput.fill("");
    const firstSubjectValue = await subjectFilter.locator("option").nth(1).getAttribute("value");
    expect(firstSubjectValue).toBeTruthy();
    await subjectFilter.selectOption(firstSubjectValue!);
    const filteredAudiobookCount = await page.locator("[data-testid='morse-audiobook-card']").count();
    expect(filteredAudiobookCount).toBeGreaterThan(0);
    expect(filteredAudiobookCount).toBeLessThanOrEqual(12);
    await page.getByRole("button", { name: "Reset view" }).click();
    await sortSelect.selectOption("word-count-desc");
    await expect(sortSelect).toHaveValue("word-count-desc");
    expect(bookJsonRequests).toEqual([]);

    const audiobookJsonLd = await parseJsonLd(page);
    const audiobookSchemaText = JSON.stringify(audiobookJsonLd);
    expect(audiobookSchemaText).toContain('"@type":"CollectionPage"');
    expect(audiobookSchemaText).toContain(absoluteUrl(ROUTES.morseAudiobooks));
    expect(audiobookSchemaText).toContain(absoluteUrl(APPROVED_AUDIOBOOK_PATH));
    expect(audiobookSchemaText).toContain(ALICE_SLUG);
    expect(audiobookSchemaText).not.toContain("aggregateRating");
    expect(audiobookSchemaText).not.toContain("reviewRating");
    expect(audiobookSchemaText).not.toContain('"price"');

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml).toContain(absoluteUrl(ROUTES.morseBooks));
    expect(xml).toContain(absoluteUrl(APPROVED_BOOK_PATH));
    expect(xml).toContain(absoluteUrl(ROUTES.morseAudiobooks));
    expect(xml).toContain(absoluteUrl(APPROVED_AUDIOBOOK_PATH));
    expect(xml).toContain(`/morse-code-books/${ALICE_SLUG}`);
    expect(xml).toContain(`/morse-code-audiobooks/${ALICE_SLUG}`);

    const staticSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(staticSitemap).toContain(absoluteUrl(ROUTES.morseBooks));
    expect(staticSitemap).toContain(absoluteUrl(APPROVED_BOOK_PATH));
    expect(staticSitemap).toContain(absoluteUrl(ROUTES.morseAudiobooks));
    expect(staticSitemap).toContain(absoluteUrl(APPROVED_AUDIOBOOK_PATH));

    await gotoHub(page, ROUTES.sitemap);
    const htmlLinks = await pageLinkPaths(page);
    expect(htmlLinks).toContain(ROUTES.morseBooks);
    expect(htmlLinks).toContain(APPROVED_BOOK_PATH);
    expect(htmlLinks).toContain(ROUTES.morseAudiobooks);
    expect(htmlLinks).toContain(APPROVED_AUDIOBOOK_PATH);

    await saveScreenshot(page, testInfo, "morse-audiobooks-hub-desktop.png");
  });

  test("finds audiobooks with normalized title search variants", async ({ page }) => {
    await gotoHub(page, ROUTES.morseAudiobooks);

    const searchInput = page.getByLabel(
      "Search Morse audiobooks by title, author, source, or subject",
    );
    await expect(searchInput).toBeEnabled();

    for (const searchCase of NORMALIZED_BOOK_SEARCH_CASES) {
      await test.step(`audiobook search: ${searchCase.query}`, async () => {
        await expectAudiobookSearchResult(
          page,
          searchInput,
          searchCase.query,
          searchCase.title,
        );
      });
    }
  });

  test("filters the More menu with normalized tool intent queries", async ({
    page,
  }) => {
    await gotoHub(page, ROUTES.home);

    const moreButton = page.getByRole("button", { name: "More" });
    await expect(moreButton).toBeVisible();
    await expect
      .poll(async () => {
        await moreButton.click();
        return moreButton.getAttribute("aria-expanded");
      })
      .toBe("true");
    const moreDialog = page.getByRole("dialog", {
      name: "More MorseWords tools",
    });
    await expect(moreDialog).toBeVisible();

    const searchInput = moreDialog.getByLabel("Search MorseWords tools");
    await searchInput.fill("translator");
    await expect(moreDialog.getByText("No tools match that search.")).toHaveCount(0);
    await expect(moreDialog.locator("a").filter({ hasText: "Book translator" })).toBeVisible();

    await searchInput.fill("audio decoder");
    await expect(moreDialog.getByText("No tools match that search.")).toHaveCount(0);
    await expect(moreDialog.locator("a").filter({ hasText: "Morse code decoder" })).toBeVisible();

    await searchInput.fill("morse code chart");
    await expect(moreDialog.getByText("No tools match that search.")).toHaveCount(0);
    await expect(moreDialog.locator("a").filter({ hasText: "Morse code alphabet" })).toBeVisible();
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
    await expect(card).toHaveAttribute(
      "href",
      `/morse-code-books/${TEST_BOOK_SLUG}?preview=test-published`,
    );
    await expect(card.locator("[data-testid='morse-book-card-description']")).toBeVisible();
    await expect(card.locator("[data-testid='morse-book-card-subjects']")).toBeVisible();
    await expect(card.locator("[data-testid='morse-book-card-meta']")).toContainText(
      "61 words",
    );
    await expect(card.locator("[data-testid='morse-book-output-badge']")).toHaveCount(0);
    await expect(card.locator("[data-testid='morse-book-subject-chip']")).toHaveCount(0);

    await expect(page.getByRole("link", { name: /^Open book/ })).toHaveCount(0);

    await expect(page.getByLabel("Filter Morse books by language")).toHaveCount(0);
    await expect(page.getByLabel("Filter Morse books by subject")).toBeEnabled();
    const searchInput = page.getByLabel(
      "Search title, author, description, or subject",
    );
    await searchInput.fill("MorseWords QA");
    await expect(searchInput).toHaveValue("MorseWords QA");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(1);
    await searchInput.fill("Alice");
    await expect(searchInput).toHaveValue("Alice");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(0);
    await expect(page.getByText("No books match your current view")).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-no-matches']")).toContainText(
      "Reset the view or try another title, author, description, or subject.",
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

  test("filters, sorts, resets, and paginates development fixture cards", async ({
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
      page.getByRole("link", {
        name: "Test Collection Morse Book 01 by Ada Key",
      }),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-book-subject-chip']")).toHaveCount(0);
    await expect(page.locator("[data-testid='morse-book-output-badge']")).toHaveCount(0);
    await expect(page.locator("[data-testid='morse-book-card']").first()).not.toContainText(
      "MorseWords test fixture",
    );
    await expect(page.locator("[data-testid='morse-book-card']").first()).not.toContainText(
      "Development-only",
    );
    await expect(
      page.locator("[data-testid='morse-book-card-description']").first(),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-12 of 30 books",
    );
    await expect(page.getByRole("button", { name: "Show more books" })).toHaveCount(0);
    const pagination = page.locator("[data-testid='morse-books-pagination']");
    await expect(pagination).toBeVisible();
    await expect(pagination.getByRole("button", { name: "Page 1" })).toHaveAttribute(
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

    const searchInput = page.getByLabel(
      "Search title, author, description, or subject",
    );
    const subjectFilter = page.getByLabel("Filter Morse books by subject");
    const sortSelect = page.getByLabel("Sort Morse books");
    await expect(page.getByLabel("Filter Morse books by language")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Clear filters" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Reset view" })).toHaveCount(0);
    expect(await selectOptionLabels(subjectFilter)).toEqual([
      "All subjects",
      "Adventure practice (8)",
      "Beginner listening (8)",
      "Chapter drills (7)",
      "Morse audiobook fixture (30)",
      "Public-domain classics (7)",
    ]);
    expect(await selectOptionLabels(sortSelect)).toEqual([
      "Title A-Z",
      "Title Z-A",
      "Author A-Z",
      "Author Z-A",
      "Word count low to high",
      "Word count high to low",
    ]);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pagination.getByRole("button", { name: "Next" }).click();
    await expectCollectionTopReturned(page);
    await expect(page.locator("#morse-books-library")).toBeFocused();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 13-24 of 30 books",
    );
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 13" }),
    ).toBeVisible();

    await pagination.getByRole("button", { name: "Page 3" }).click();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(6);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 25-30 of 30 books",
    );

    await searchInput.fill("Book 25");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Test Collection Morse Book 25" })).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1 of 1 book",
    );

    await searchInput.fill("Ada Key");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(8);
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 01" }),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-8 of 8 books",
    );

    await searchInput.fill("Chapter drills");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(7);
    await expect(
      page.getByRole("heading", { name: "Test Collection Morse Book 03" }),
    ).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-7 of 7 books",
    );

    await searchInput.fill("");
    await subjectFilter.selectOption("Adventure practice");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(8);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-8 of 8 books",
    );

    await subjectFilter.selectOption("all");
    await sortSelect.selectOption("title-za");
    expect(await cardTitles(page)).toEqual(
      Array.from({ length: 12 }, (_, index) =>
        `Test Collection Morse Book ${(30 - index).toString().padStart(2, "0")}`,
      ),
    );

    await sortSelect.selectOption("author-az");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-12 of 30 books",
    );
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").first(),
    ).toHaveText("Test Collection Morse Book 01");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").nth(1),
    ).toHaveText("Test Collection Morse Book 05");

    await sortSelect.selectOption("author-za");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").first(),
    ).toHaveText("Test Collection Morse Book 02");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").nth(1),
    ).toHaveText("Test Collection Morse Book 06");

    await sortSelect.selectOption("word-count-asc");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").first(),
    ).toHaveText("Test Collection Morse Book 01");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").nth(1),
    ).toHaveText("Test Collection Morse Book 02");

    await sortSelect.selectOption("word-count-desc");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").first(),
    ).toHaveText("Test Collection Morse Book 30");
    await expect(
      page.locator("[data-testid='morse-book-card'] h3").nth(1),
    ).toHaveText("Test Collection Morse Book 29");

    await searchInput.fill("not a book");
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(0);
    await expect(page.getByText("No books match your current view")).toBeVisible();
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 0 of 0 books",
    );

    await page.getByRole("button", { name: "Reset view" }).click();
    await expect(page.locator("[data-testid='morse-book-card']")).toHaveCount(12);
    await expect(page.locator("[data-testid='morse-books-result-count']")).toHaveText(
      "Showing 1-12 of 30 books",
    );
    await expect(searchInput).toHaveValue("");
    await expect(subjectFilter).toHaveValue("all");
    await expect(page.getByLabel("Filter Morse books by language")).toHaveCount(0);
    await expect(sortSelect).toHaveValue("title-az");

    const firstCardLink = page
      .locator("[data-testid='morse-book-card']")
      .filter({ hasText: "Test Collection Morse Book 01" });
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
    await expect(page.getByLabel("Filter Morse books by language")).toHaveCount(0);
    await expect(page.getByLabel("Filter Morse books by subject")).toBeEnabled();
    expect(await contrastRatio(page.locator("h1"))).toBeGreaterThanOrEqual(4.5);
    expect(
      await contrastRatio(
        page.locator("[data-testid='morse-book-card-title']").first(),
      ),
    ).toBeGreaterThanOrEqual(4.5);

    await saveScreenshot(page, testInfo, "morse-books-hub-mobile-dark.png");
  });
});
