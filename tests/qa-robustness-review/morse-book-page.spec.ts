import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";
import { BOOK_CACHE_KEY_PREFIX } from "../../app/client/components/shared/storageRegistry";
import { getMorseBookPublicContentUrls } from "../../app/client/data/morseBookContentConfig";

const ROOT = process.cwd();
const ALICE_SLUG = "alices-adventures-in-wonderland";
const APPROVED_BOOK_SLUG = "treasure-island";
const NETWORK_BOOK_SLUG = "dr-jekyll-and-mr-hyde";
const STALE_CACHE_BOOK_SLUG = "the-call-of-the-wild";
const ERROR_BOOK_SLUG = "the-jungle-book";
const TEST_BOOK_SLUG = "test-published-morse-book";
const ART_OF_WAR_SLUG = "the-art-of-war";
const ALICE_PUBLIC_PATH = `/morse-code-books/${ALICE_SLUG}`;
const APPROVED_BOOK_PUBLIC_PATH = `/morse-code-books/${APPROVED_BOOK_SLUG}`;
const NETWORK_BOOK_PUBLIC_PATH = `/morse-code-books/${NETWORK_BOOK_SLUG}`;
const STALE_CACHE_BOOK_PUBLIC_PATH = `/morse-code-books/${STALE_CACHE_BOOK_SLUG}`;
const ERROR_BOOK_PUBLIC_PATH = `/morse-code-books/${ERROR_BOOK_SLUG}`;
const ART_OF_WAR_PUBLIC_PATH = `/morse-code-books/${ART_OF_WAR_SLUG}`;
const ALICE_AUDIOBOOK_PUBLIC_PATH = `/morse-code-audiobooks/${ALICE_SLUG}`;
const APPROVED_AUDIOBOOK_PUBLIC_PATH = `/morse-code-audiobooks/${APPROVED_BOOK_SLUG}`;
const NETWORK_AUDIOBOOK_PUBLIC_PATH = `/morse-code-audiobooks/${NETWORK_BOOK_SLUG}`;
const ALICE_PREVIEW_PATH = `${ALICE_PUBLIC_PATH}?preview=unpublished`;
const TEST_BOOK_PUBLIC_PATH = `/morse-code-books/${TEST_BOOK_SLUG}`;
const TEST_BOOK_PREVIEW_PATH = `${TEST_BOOK_PUBLIC_PATH}?preview=test-published`;
const THEME_STORAGE_KEY = "morsewords-theme";
function bookJsonPattern(slug: string) {
  return `**/morse-book-content/books/${slug}.json*`;
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, relativePath), "utf8"),
  ) as T;
}

async function openPreview(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(ALICE_PREVIEW_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
}

async function openTestBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(TEST_BOOK_PREVIEW_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
}

async function openApprovedBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(APPROVED_BOOK_PUBLIC_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
}

async function openPublicBook(page: Page, pathName: string) {
  await blockExternalNetwork(page);
  await gotoPublicBookPage(page, pathName);
}

async function gotoPublicBookPage(page: Page, pathName: string) {
  const response = await page.goto(pathName, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
}

async function waitForApprovedBookWorkspace(page: Page) {
  await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
    "data-mw-morse-book-available",
    "true",
  );
}

async function openAnneBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto("/morse-code-books/anne-of-green-gables", {
    waitUntil: "domcontentloaded",
  });
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

test.describe("Morse book page foundation", () => {
  test("builds local fallback and configured Cloudflare content URLs", () => {
    expect(
      getMorseBookPublicContentUrls("books/treasure-island.json"),
    ).toEqual({
      publicManifestUrl:
        "local:app/client/assets/books/cloudflare-export/public-manifest.json",
      bookUrl: "local:app/client/assets/books/cloudflare-export/books/treasure-island.json",
    });
    expect(
      getMorseBookPublicContentUrls(
        "/books/treasure-island.json",
        "https://cdn.example.test/morse-books/",
      ),
    ).toEqual({
      publicManifestUrl: "https://cdn.example.test/morse-books/public-manifest.json",
      bookUrl: "https://cdn.example.test/morse-books/books/treasure-island.json",
    });
    expect(
      getMorseBookPublicContentUrls(
        "books/treasure-island.json",
        "https://cdn.example.test/morse-books",
      ),
    ).toEqual({
      publicManifestUrl: "https://cdn.example.test/morse-books/public-manifest.json",
      bookUrl: "https://cdn.example.test/morse-books/books/treasure-island.json",
    });
  });

  test("keeps generated book summaries summary-only and publishes processed temp books", async ({
    request,
  }) => {
    const libraryManifest = readJson<{
      books: Array<{
        slug: string;
        source: {
          rightsReviewed: boolean;
          publishReady: boolean;
          processingAllowed: boolean;
          approvalSource?: string;
        };
      }>;
    }>("app/client/assets/books/generated/library-manifest.json");
    const alice = libraryManifest.books.find((book) => book.slug === ALICE_SLUG);

    expect(alice, "Alice pilot summary exists").toBeTruthy();
    expect(alice?.source.rightsReviewed).toBe(true);
    expect(alice?.source.publishReady).toBe(true);
    expect(JSON.stringify(libraryManifest)).not.toContain("morseSourceText");
    expect(JSON.stringify(libraryManifest)).not.toContain("displayText");

    const generatedSummaries = libraryManifest.books;
    const publishedSummaries = libraryManifest.books.filter(
      (book) =>
        book.source.publishReady &&
        book.source.processingAllowed &&
        (book.source.approvalSource === "external-authority" ||
          book.source.approvalSource === "file-evidence" ||
          book.source.rightsReviewed),
    );
    expect(generatedSummaries.map((book) => book.slug)).toContain(ALICE_SLUG);
    expect(publishedSummaries.map((book) => book.slug)).toContain(ALICE_SLUG);
    expect(publishedSummaries.map((book) => book.slug)).toContain(APPROVED_BOOK_SLUG);
    expect(generatedSummaries.map((book) => book.slug)).not.toContain(TEST_BOOK_SLUG);

    const publicSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(publicSitemap).toContain(APPROVED_BOOK_PUBLIC_PATH);
    expect(publicSitemap).toContain(ALICE_PUBLIC_PATH);
    expect(publicSitemap).not.toContain(TEST_BOOK_PUBLIC_PATH);

    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const sitemapText = await response.text();
    expect(sitemapText).toContain(APPROVED_BOOK_PUBLIC_PATH);
    expect(sitemapText).toContain(ALICE_PUBLIC_PATH);
    expect(sitemapText).not.toContain(TEST_BOOK_PUBLIC_PATH);
  });

  test("exposes processed temp books and rejects unknown public slugs", async ({
    request,
  }) => {
    const aliceResponse = await request.get(ALICE_PUBLIC_PATH);
    expect(aliceResponse.ok()).toBe(true);
    const aliceAudiobookResponse = await request.get(ALICE_AUDIOBOOK_PUBLIC_PATH);
    expect(aliceAudiobookResponse.ok()).toBe(true);

    const testFixtureResponse = await request.get(TEST_BOOK_PUBLIC_PATH);
    expect(testFixtureResponse.status()).toBe(404);
    const testFixtureAudiobookResponse = await request.get(
      `/morse-code-audiobooks/${TEST_BOOK_SLUG}`,
    );
    expect(testFixtureAudiobookResponse.status()).toBe(404);

    const unknownResponse = await request.get("/morse-code-books/not-a-real-book");
    expect(unknownResponse.status()).toBe(404);
    const unknownAudiobookResponse = await request.get(
      "/morse-code-audiobooks/not-a-real-book",
    );
    expect(unknownAudiobookResponse.status()).toBe(404);
  });

  test("renders an approved external-authority Gutenberg book as a public page", async ({
    page,
  }) => {
    await openApprovedBook(page);

    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-available",
      "true",
    );
    await expect(page.locator("h1")).toContainText("Treasure Island");
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook #120/ }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/120");
    await expect(page.locator("[data-mw-morse-book-source-preview]")).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-source-preview]")).not.toContainText(
      "Project Gutenberg License",
    );
    await expect(page.locator("[data-mw-morse-book-morse-preview]")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open audiobook page" }),
    ).toHaveAttribute("href", APPROVED_AUDIOBOOK_PUBLIC_PATH);

    const selectorRows = page.locator("[data-mw-morse-book-section-row]");
    await expect(selectorRows.first()).toBeVisible();
    await expect(
      selectorRows.first().locator("[data-mw-morse-book-section-label]"),
    ).toBeVisible();
    await expect(
      selectorRows.first().locator("[data-mw-morse-book-section-kind]"),
    ).toContainText(/Chapter|Opening|Part|Section|Source notes/);
    await expect(
      selectorRows.first().locator("[data-mw-morse-book-section-selection-state]"),
    ).toContainText(/Included|Not selected|Available section/);
  });

  test("loads one approved book JSON and reuses it for section switching", async ({
    page,
  }) => {
    const bookJsonRequests: string[] = [];
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(NETWORK_BOOK_SLUG), async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });

    await gotoPublicBookPage(page, NETWORK_BOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);
    expect(bookJsonRequests).toHaveLength(1);

    const sectionCheckbox = page
      .locator("[data-mw-morse-book-section-row]")
      .filter({ hasText: /Chapter|Part|Opening|Source notes/ })
      .locator("input[type='checkbox']")
      .last();
    await sectionCheckbox.setChecked(true);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).not.toHaveAttribute("data-mw-morse-book-translator-source-sections", "");
    expect(bookJsonRequests).toHaveLength(1);
  });

  test("loads an approved audiobook page with one whole-book JSON and audio-first controls", async ({
    page,
  }) => {
    const bookJsonRequests: string[] = [];
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(NETWORK_BOOK_SLUG), async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });

    await gotoPublicBookPage(page, NETWORK_AUDIOBOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-page-mode",
      "audiobook",
    );
    await expect(page.locator("h1")).toContainText(/Jekyll|Hyde/);
    await expect(page.locator("[data-testid='morse-audiobook-audio-first-panel']")).toBeVisible();
    await expect(page.getByText("Audiobook preview and download")).toBeVisible();
    await expect(page.getByRole("button", { name: "Audio" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Download MP3|Download WAV/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Read book page" })).toHaveAttribute(
      "href",
      NETWORK_BOOK_PUBLIC_PATH,
    );
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook #43/ }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/43");
    expect(bookJsonRequests).toHaveLength(1);

    const sectionCheckbox = page
      .locator("[data-mw-morse-book-section-row]")
      .filter({ hasText: /Chapter|Part|Opening|Source notes/ })
      .locator("input[type='checkbox']")
      .last();
    await sectionCheckbox.setChecked(true);
    expect(bookJsonRequests).toHaveLength(1);

    const schemaText = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? "").join("\n"));
    expect(schemaText).toContain("Morse audiobook");
    expect(schemaText).toContain(NETWORK_AUDIOBOOK_PUBLIC_PATH);
    expect(schemaText).not.toContain("AudioObject");
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain("reviewRating");
    expect(schemaText).not.toContain('"price"');
  });

  test("caches opened approved book JSON and serves a valid cache hit offline", async ({
    page,
  }) => {
    await openPublicBook(page, NETWORK_BOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);

    const cachedKeys = await page.evaluate((prefix) =>
      Object.keys(localStorage).filter((key) => key.startsWith(prefix)),
    BOOK_CACHE_KEY_PREFIX);
    expect(cachedKeys).toHaveLength(1);
    expect(cachedKeys[0]).toContain(NETWORK_BOOK_SLUG);

    let jsonRequests = 0;
    await page.route(bookJsonPattern(NETWORK_BOOK_SLUG), async (route) => {
      jsonRequests += 1;
      await route.abort();
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await waitForApprovedBookWorkspace(page);
    expect(jsonRequests).toBe(0);
    await expect(page.locator("[data-mw-morse-book-source-preview]")).toBeVisible();
  });

  test("stale cached book JSON is ignored and refetched", async ({ page }) => {
    const publicManifest = readJson<{
      books: Array<{
        slug: string;
        contentVersion: string;
        contentHash: string;
      }>;
    }>("app/client/assets/books/cloudflare-export/public-manifest.json");
    const treasure = publicManifest.books.find(
      (book) => book.slug === STALE_CACHE_BOOK_SLUG,
    );
    expect(treasure).toBeTruthy();
    await page.addInitScript(
      ({ hash, prefix, version }) => {
        localStorage.setItem(
          `${prefix}${slug}:${version}:${hash}`,
          JSON.stringify({
            schemaVersion: 1,
            slug,
            contentVersion: "stale-version",
            contentHash: hash,
            manifest: { slug: "treasure-island" },
            sections: [],
          }),
        );
      },
      {
        prefix: BOOK_CACHE_KEY_PREFIX,
        slug: STALE_CACHE_BOOK_SLUG,
        version: treasure!.contentVersion,
        hash: treasure!.contentHash,
      },
    );
    const bookJsonRequests: string[] = [];
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(STALE_CACHE_BOOK_SLUG), async (route) => {
      bookJsonRequests.push(route.request().url());
      await route.continue();
    });

    await gotoPublicBookPage(page, STALE_CACHE_BOOK_PUBLIC_PATH);
    await waitForApprovedBookWorkspace(page);
    expect(bookJsonRequests).toHaveLength(1);
  });

  test("shows a readable retry state when book JSON fetch fails or is malformed", async ({
    page,
  }) => {
    let fail = true;
    await blockExternalNetwork(page);
    await page.route(bookJsonPattern(ERROR_BOOK_SLUG), async (route) => {
      if (fail) {
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: "unavailable" }),
        });
        return;
      }
      await route.continue();
    });

    await gotoPublicBookPage(page, ERROR_BOOK_PUBLIC_PATH);
    await expect(page.locator("[data-testid='morse-book-load-error']")).toBeVisible();
    await expect(
      page
        .locator("[data-testid='morse-book-load-error']")
        .getByText("We could not load this Morse book."),
    ).toBeVisible();
    fail = false;
    await page.getByRole("button", { name: "Try again" }).click();
    await waitForApprovedBookWorkspace(page);

    await page.evaluate(() => localStorage.clear());
    await page.unroute(bookJsonPattern(ERROR_BOOK_SLUG));
    await page.route(bookJsonPattern(ERROR_BOOK_SLUG), async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ schemaVersion: 1, slug: "treasure-island" }),
      });
    });
    await page.goto(ERROR_BOOK_PUBLIC_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(page.locator("[data-testid='morse-book-load-error']")).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  test("renders approved book selector labels without detector artifacts", async ({
    page,
  }) => {
    await openAnneBook(page);
    await expect(page.locator("[data-mw-morse-book-section-label]").first()).toBeVisible();

    const labels = await page
      .locator("[data-mw-morse-book-section-label]")
      .evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? ""));
    const labelText = labels.join("\n");

    expect(labels).toContain("Chapter 13: The Delights of Anticipation");
    expect(labelText).not.toMatch(/Book\s+501|Book\s+5\s+01/i);
    expect(labelText).not.toMatch(
      /Diana lent me|That was a thrilling book|The heroine had/i,
    );

    const states = await page
      .locator("[data-mw-morse-book-section-selection-state]")
      .evaluateAll((nodes) => nodes.map((node) => node.textContent?.trim() ?? ""));
    expect(states.length).toBeGreaterThan(0);
    expect(states.every((state) => state === "Included")).toBe(true);
  });

  test("renders a public processed preview with ordered sections and cleaned text", async ({
    page,
  }, testInfo) => {
    await openPreview(page);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index,follow",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.morsewords.com/morse-code-books/alices-adventures-in-wonderland",
    );
    await expect(
      page.locator("[data-mw-morse-book-cover-placeholder='true']"),
    ).toBeVisible();
    await expect(
      page.locator("[data-mw-morse-book-cover-placeholder='true'] img"),
    ).toHaveCount(0);

    const sectionIds = await page
      .locator("[data-mw-morse-book-section-id]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-mw-morse-book-section-id")),
      );
    expect(sectionIds.slice(0, 4)).toEqual([
      "title-page-001",
      "title-page-002",
      "chapter-001",
      "chapter-002",
    ]);

    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      /chapter-001,chapter-002/,
    );
    await expect(page.locator("[data-mw-morse-book-select-all-default]")).toBeChecked();

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText("CHAPTER I");
    await expect(sourcePreview).not.toContainText("Project Gutenberg");
    await expect(sourcePreview).not.toContainText("START OF THE PROJECT GUTENBERG");
    await expect(
      page.getByRole("link", {
        name: "Original source: Project Gutenberg ebook #11",
      }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/11");
    await expect(page.getByText("Downloads are unavailable for this book.")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeEnabled();

    const morsePreview = page.locator("[data-mw-morse-book-morse-preview]");
    const morseText = (await morsePreview.textContent()) ?? "";
    expect(morseText).toContain("-.-.");
    expect(morseText).not.toContain("Project Gutenberg");
    expect(morseText.length).toBeLessThanOrEqual(2805);

    await saveScreenshot(page, testInfo, "morse-book-preview-desktop.png");
  });

  test("keeps direct no-split defaults and video layer defaults", async ({ page }) => {
    await openPreview(page);

    await expect(page.getByRole("button", { name: "No split" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeEnabled();
    await expect(page.getByText("ZIP is shown only")).toHaveCount(0);

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.getByRole("button", { name: /Download (WebM|MP4)/ })).toBeEnabled();
    await expect(page.getByText("Lightbulb signal")).toBeVisible();
    await expect(page.getByText("Dot signal")).toBeVisible();
    await expect(page.getByText("Full-frame flash")).toBeVisible();
    await expect(page.getByText("Animated Morse signal")).toBeVisible();
    await expect(page.getByText("Visual signal", { exact: true })).toBeVisible();
    await expect(page.getByText("Morse symbols", { exact: true })).toBeVisible();
    await expect(page.getByText("Plain text", { exact: true })).toBeVisible();
    await expect(
      page.locator("[data-mw-morse-book-video-layer-defaults]"),
    ).toHaveAttribute("data-mw-morse-book-video-layer-defaults", "true:true:true");

    await page.getByRole("button", { name: "By duration" }).click();
    await expect(page.locator("[data-mw-morse-book-split-warning]")).toBeVisible();
  });

  test("separates video format from estimate and keeps audio size estimates", async ({
    page,
  }) => {
    await openPreview(page);

    await expect(page.getByTestId("morse-book-output-estimate")).toContainText(
      /\d+(?:\.\d+)?\s*(?:B|KB|MB|GB)/,
    );
    await expect(page.getByTestId("morse-book-output-format")).toHaveCount(0);

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.getByTestId("morse-book-output-format")).toContainText(
      /WebM|MP4/,
    );
    await expect(page.getByTestId("morse-book-output-estimate")).toContainText(
      /Available after export|Unavailable in this browser/,
    );
    await expect(page.getByTestId("morse-book-output-estimate")).not.toContainText(
      /WebM|MP4/,
    );
    await expect(page.getByText(/Estimate\s+MP4|Estimate\s+WebM/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Download (WebM|MP4)/ })).toBeEnabled();
  });

  test("displays Art of War author and context separately", async ({ page }) => {
    await openPublicBook(page, ART_OF_WAR_PUBLIC_PATH);

    await expect(page.locator("h1")).toContainText("The Art of War");
    await expect(
      page.getByRole("heading", { name: "Sunzi", exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("morse-book-author-context")).toContainText(
      "Active 6th century B.C.",
    );
    await expect(page.getByText("active 6th century B.C. Sunzi")).toHaveCount(0);
  });

  test("does not show internal review or processing labels publicly", async ({
    page,
  }) => {
    await openApprovedBook(page);

    await expect(
      page.getByText(
        /manual-review|rights gate|review queue|publish-ready|Lazy JSON|Rights review|generated reports/i,
      ),
    ).toHaveCount(0);
    await expect(page.getByText("Available", { exact: true })).toBeVisible();
  });

  test("renders a noindex publish-ready fixture with selected chapters and direct downloads", async ({
    page,
  }) => {
    await openTestBook(page);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-available",
      "true",
    );
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook/ }),
    ).toHaveCount(0);
    await expect(page.locator("[data-mw-morse-book-select-all-default]")).toBeChecked();
    await expect(page.getByRole("button", { name: "Current section" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Selected sections" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Full book" })).toHaveCount(0);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    await expect(page.getByRole("button", { name: "No split" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeEnabled();
    await expect(page.getByText("ZIP is shown because")).toHaveCount(0);

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.getByRole("button", { name: /Download (WebM|MP4)/ })).toBeEnabled();
    await expect(
      page.locator("[data-mw-morse-book-video-layer-defaults]"),
    ).toHaveAttribute("data-mw-morse-book-video-layer-defaults", "true:true:true");

    await page.getByRole("button", { name: "Audio" }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download MP3" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/test-published-morse-book.*\.mp3$/i);

    const storedMedia = await page.evaluate(() => {
      const entries = [
        ...Object.entries(window.localStorage),
        ...Object.entries(window.sessionStorage),
      ];
      return entries
        .map(([key, value]) => `${key}:${value.slice(0, 80)}`)
        .filter((entry) => /(blob|base64|webm|mp3|wav|zip)/i.test(entry));
    });
    expect(storedMedia).toEqual([]);
  });

  test("loads default full-book sections in stable order and excludes source notes by default", async ({
    page,
  }) => {
    await openTestBook(page);

    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    await expect(page.locator("[data-mw-morse-book-source-preview]")).toContainText(
      "CHAPTER I",
    );
    await expect(page.locator("[data-mw-morse-book-source-preview]")).toContainText(
      "CHAPTER II",
    );
    await expect(page.locator("[data-mw-morse-book-source-preview]")).not.toContainText(
      "development-only fixture",
    );

    await expect(
      page.locator("[data-mw-morse-book-section-select='source-license-001']"),
    ).not.toBeChecked();
    await page.locator("[data-mw-morse-book-select-all-default]").uncheck();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute("data-mw-morse-book-translator-source-sections", "");
    await page.locator("[data-mw-morse-book-section-select='source-license-001']").check();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "source-license-001",
    );
    await expect(page.locator("[data-mw-morse-book-source-preview]")).toContainText(
      "development-only fixture",
    );
  });

  test("supports audio timeline seek and video preview layer toggles", async ({
    page,
  }, testInfo) => {
    await openTestBook(page);

    const audioTime = page.locator("[data-testid='book-audio-preview-time']");
    await expect(page.locator("[data-testid='book-audio-preview-timeline']")).toBeVisible();
    await expect(page.locator("[data-testid='book-audio-preview-dit']").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Play preview" })).toBeEnabled();
    const timeline = page.locator("[data-testid='book-audio-preview-timeline'] [role='slider']");
    await timeline.focus();
    await page.keyboard.press("End");
    await expect
      .poll(async () => Number(await timeline.getAttribute("aria-valuenow")))
      .toBeGreaterThan(0);
    await expect(audioTime).toBeVisible();

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.locator("[data-testid='book-video-preview-lightbulb']")).toBeVisible();
    const morseOverlay = page.locator("[data-testid='book-video-preview-morse-overlay']");
    await expect(morseOverlay).toBeVisible();
    await expect(morseOverlay).toContainText("/");
    const textOverlay = page.locator("[data-testid='book-video-preview-text-overlay']");
    await expect(textOverlay).toBeVisible();
    await expect(textOverlay).toContainText("/");

    await page.getByRole("button", { name: "Play visual preview" }).click();
    await expect(page.locator("[data-testid='book-video-preview']")).toHaveAttribute(
      "data-preview-playing",
      "true",
    );
    const videoTimeline = page.getByLabel("Video preview timeline");
    const videoTimelineBox = await videoTimeline.boundingBox();
    expect(videoTimelineBox).not.toBeNull();
    await videoTimeline.click({
      position: {
        x: videoTimelineBox!.width * 0.65,
        y: videoTimelineBox!.height / 2,
      },
    });
    await expect
      .poll(() => videoTimeline.getAttribute("aria-valuenow"))
      .not.toBe("0");
    const laterToken = await page
      .locator("[data-testid='book-video-preview-text-layers']")
      .getAttribute("data-active-character");
    expect(laterToken).toBeTruthy();
    await expect(page.locator("[data-testid='book-video-preview-active-morse-word']")).toBeVisible();
    await expect(page.locator("[data-testid='book-video-preview-active-text-word']")).toBeVisible();
    await expect(page.locator("[data-testid='book-video-preview-active-token']")).toHaveCount(0);
    await page.getByRole("button", { name: "Stop visual preview" }).click();

    await page.getByLabel("Visual signal").uncheck();
    await expect(page.locator("[data-testid='book-video-preview-lightbulb']")).toHaveCount(0);
    await expect(page.locator("[data-testid='book-video-preview-morse-overlay']")).toBeVisible();
    await page.getByLabel("Morse symbols").uncheck();
    await expect(page.locator("[data-testid='book-video-preview-morse-overlay']")).toHaveCount(0);
    await expect(page.getByLabel("Plain text")).toBeDisabled();
    await expect(page.locator("[data-testid='book-video-preview-text-overlay']")).toBeVisible();

    await expect(page.locator("[data-testid='book-video-full-frame-warning']")).toHaveCount(0);
    await page.getByRole("button", { name: "Full-frame flash" }).click();
    await expect(page.locator("[data-testid='book-video-full-frame-warning']")).toBeVisible();
    await page.getByRole("button", { name: "Lightbulb signal" }).click();
    await expect(page.locator("[data-testid='book-video-full-frame-warning']")).toHaveCount(0);

    await saveScreenshot(page, testInfo, "morse-book-test-fixture-video-preview.png");
  });

  test("approved long book previews expose up to five minutes", async ({
    page,
  }) => {
    await openApprovedBook(page);

    const audioTimeline = page.getByRole("slider", {
      name: "Audio preview timeline",
    });
    await expect(audioTimeline).toBeVisible();
    await expect
      .poll(async () => Number(await audioTimeline.getAttribute("aria-valuemax")))
      .toBeGreaterThanOrEqual(270_000);
    const audioDurationMs = Number(
      await audioTimeline.getAttribute("aria-valuemax"),
    );
    expect(audioDurationMs).toBeLessThanOrEqual(300_000);

    await page.getByRole("button", { name: "Video" }).click();
    const videoTimeline = page.getByRole("slider", {
      name: "Video preview timeline",
    });
    await expect(videoTimeline).toBeVisible();
    await expect
      .poll(async () => Number(await videoTimeline.getAttribute("aria-valuemax")))
      .toBeGreaterThanOrEqual(270_000);
    const videoDurationMs = Number(
      await videoTimeline.getAttribute("aria-valuemax"),
    );
    expect(videoDurationMs).toBeLessThanOrEqual(300_000);
    await expect(videoTimeline).toHaveAttribute(
      "data-mw-timeline-density",
      "condensed",
    );

    const timelineBox = await videoTimeline.boundingBox();
    expect(timelineBox).not.toBeNull();
    const markers = page.locator(
      "[data-testid='book-video-preview-timing-strip-dit'], [data-testid='book-video-preview-timing-strip-dash']",
    );
    await expect(markers.first()).toBeVisible();
    const firstMarkerBox = await markers.first().boundingBox();
    const lastMarkerBox = await markers.last().boundingBox();
    expect(firstMarkerBox).not.toBeNull();
    expect(lastMarkerBox).not.toBeNull();
    expect(firstMarkerBox!.x).toBeGreaterThanOrEqual(timelineBox!.x);
    expect(
      lastMarkerBox!.x + lastMarkerBox!.width,
    ).toBeLessThanOrEqual(timelineBox!.x + timelineBox!.width);
  });

  test("shows ZIP language only when selected settings really produce a bundle", async ({
    page,
  }) => {
    await openTestBook(page);

    await expect(async () => {
      await page.getByRole("button", { name: "By duration" }).click();
      await expect(page.getByLabel(/Target part length/)).toBeVisible({
        timeout: 1_000,
      });
    }).toPass({ timeout: 10_000 });
    await page.getByLabel(/Target part length/).fill("1");
    await expect(page.getByRole("button", { name: "Download MP3 ZIP" })).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-zip-warning]")).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-split-warning]")).toBeVisible();

    await page.getByRole("button", { name: "No split" }).click();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-zip-warning]")).toHaveCount(0);
    await expect(page.locator("[data-mw-morse-book-split-warning]")).toHaveCount(0);
  });

  test("keeps the unpublished preview readable on mobile and dark mode", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((themeKey) => {
      window.localStorage.setItem(themeKey, "dark");
      document.documentElement.dataset.theme = "dark";
    }, THEME_STORAGE_KEY);

    await openPreview(page);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { name: /Alice's Adventures/ })).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-morse-preview]")).toBeVisible();
    expect(
      await contrastRatio(page.getByRole("heading", { name: /Alice's Adventures/ })),
    ).toBeGreaterThanOrEqual(4.5);
    expect(await contrastRatio(page.locator("[data-mw-morse-book-morse-preview]"))).toBeGreaterThanOrEqual(
      4.5,
    );

    await saveScreenshot(page, testInfo, "morse-book-preview-mobile-dark.png");
  });
});
