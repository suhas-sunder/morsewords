import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const ALICE_SLUG = "alices-adventures-in-wonderland";
const APPROVED_BOOK_SLUG = "treasure-island";
const TEST_BOOK_SLUG = "test-published-morse-book";
const ALICE_PUBLIC_PATH = `/morse-code-books/${ALICE_SLUG}`;
const APPROVED_BOOK_PUBLIC_PATH = `/morse-code-books/${APPROVED_BOOK_SLUG}`;
const ALICE_PREVIEW_PATH = `${ALICE_PUBLIC_PATH}?preview=unpublished`;
const TEST_BOOK_PUBLIC_PATH = `/morse-code-books/${TEST_BOOK_SLUG}`;
const TEST_BOOK_PREVIEW_PATH = `${TEST_BOOK_PUBLIC_PATH}?preview=test-published`;
const THEME_STORAGE_KEY = "morsewords-theme";

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
  test("keeps generated book summaries summary-only and publish-gated", async ({
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
    expect(alice?.source.rightsReviewed).toBe(false);
    expect(alice?.source.publishReady).toBe(false);
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
    expect(publishedSummaries.map((book) => book.slug)).not.toContain(ALICE_SLUG);
    expect(publishedSummaries.map((book) => book.slug)).toContain(APPROVED_BOOK_SLUG);
    expect(generatedSummaries.map((book) => book.slug)).not.toContain(TEST_BOOK_SLUG);

    const publicSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(publicSitemap).toContain(APPROVED_BOOK_PUBLIC_PATH);
    expect(publicSitemap).not.toContain(ALICE_PUBLIC_PATH);
    expect(publicSitemap).not.toContain(TEST_BOOK_PUBLIC_PATH);

    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const sitemapText = await response.text();
    expect(sitemapText).toContain(APPROVED_BOOK_PUBLIC_PATH);
    expect(sitemapText).not.toContain(ALICE_PUBLIC_PATH);
    expect(sitemapText).not.toContain(TEST_BOOK_PUBLIC_PATH);
  });

  test("does not expose unpublished or unknown book slugs as public pages", async ({
    request,
  }) => {
    const aliceResponse = await request.get(ALICE_PUBLIC_PATH);
    expect(aliceResponse.status()).toBe(404);

    const testFixtureResponse = await request.get(TEST_BOOK_PUBLIC_PATH);
    expect(testFixtureResponse.status()).toBe(404);

    const unknownResponse = await request.get("/morse-code-books/not-a-real-book");
    expect(unknownResponse.status()).toBe(404);
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
      "data-mw-morse-book-publish-ready",
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
  });

  test("renders a noindex unpublished preview with ordered sections and cleaned text", async ({
    page,
  }, testInfo) => {
    await openPreview(page);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
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

    await page.locator("[data-mw-morse-book-section-id='chapter-002']").click();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute("data-mw-morse-book-translator-source-sections", "chapter-002");

    const sourcePreview = page.locator("[data-mw-morse-book-source-preview]");
    await expect(sourcePreview).toContainText("CHAPTER II");
    await expect(sourcePreview).not.toContainText("Project Gutenberg");
    await expect(sourcePreview).not.toContainText("START OF THE PROJECT GUTENBERG");
    await expect(
      page.getByRole("link", {
        name: "Original source: Project Gutenberg ebook #11",
      }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/11");
    await expect(page.getByText("Downloads are disabled until this book is publish-ready.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeDisabled();

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
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeDisabled();
    await expect(page.getByText("ZIP is shown only")).toHaveCount(0);

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeDisabled();
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

  test("renders a noindex publish-ready fixture with real section scope and direct downloads", async ({
    page,
  }) => {
    await openTestBook(page);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-publish-ready",
      "true",
    );
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook/ }),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Current section" })).toBeVisible();
    await expect(page.getByRole("button", { name: "No split" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeEnabled();
    await expect(page.getByText("ZIP is shown because")).toHaveCount(0);

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeEnabled();
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

  test("loads selected sections in stable order and excludes source notes by default", async ({
    page,
  }) => {
    await openTestBook(page);

    await page.locator("[data-mw-morse-book-section-select='chapter-002']").check();
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

    await page.getByRole("button", { name: "Full book" }).click();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    await expect(page.locator("[data-mw-morse-book-full-warning]")).toBeVisible();
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
    await expect(audioTime).not.toContainText("0s /");

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.locator("[data-testid='book-video-preview-lightbulb']")).toBeVisible();
    await expect(page.locator("[data-testid='book-video-preview-morse-overlay']")).toBeVisible();
    await expect(page.locator("[data-testid='book-video-preview-text-overlay']")).toBeVisible();

    const firstToken = await page
      .locator("[data-testid='book-video-preview-text-layers']")
      .getAttribute("data-active-character");
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
    const laterToken = await page
      .locator("[data-testid='book-video-preview-text-layers']")
      .getAttribute("data-active-character");
    expect(laterToken).not.toEqual(firstToken);
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

  test("shows ZIP language only when selected settings really produce a bundle", async ({
    page,
  }) => {
    await openTestBook(page);

    await page.getByRole("button", { name: "Selected sections" }).click();
    await page.locator("[data-mw-morse-book-section-select='chapter-002']").check();
    await page.getByRole("button", { name: "By duration" }).click();
    await page.getByLabel(/Target part length/).fill("1");
    await expect(page.getByRole("button", { name: "Download ZIP bundle" })).toBeVisible();
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
