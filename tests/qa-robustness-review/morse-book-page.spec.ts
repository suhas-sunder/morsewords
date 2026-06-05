import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const ALICE_SLUG = "alices-adventures-in-wonderland";
const ALICE_PUBLIC_PATH = `/morse-code-books/${ALICE_SLUG}`;
const ALICE_PREVIEW_PATH = `${ALICE_PUBLIC_PATH}?preview=unpublished`;
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
        source: { rightsReviewed: boolean; publishReady: boolean };
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
      (book) => book.source.rightsReviewed && book.source.publishReady,
    );
    expect(generatedSummaries.map((book) => book.slug)).toContain(ALICE_SLUG);
    expect(publishedSummaries.map((book) => book.slug)).not.toContain(ALICE_SLUG);

    const publicSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(publicSitemap).not.toContain(ALICE_PUBLIC_PATH);

    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    expect(await response.text()).not.toContain(ALICE_PUBLIC_PATH);
  });

  test("does not expose unpublished or unknown book slugs as public pages", async ({
    request,
  }) => {
    const aliceResponse = await request.get(ALICE_PUBLIC_PATH);
    expect(aliceResponse.status()).toBe(404);

    const unknownResponse = await request.get("/morse-code-books/not-a-real-book");
    expect(unknownResponse.status()).toBe(404);
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
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeVisible();
    await expect(page.getByText("ZIP is shown only")).toHaveCount(0);

    await page.getByRole("button", { name: "Video" }).click();
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeVisible();
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
    await expect(page.getByRole("button", { name: "Download ZIP bundle" })).toBeVisible();
    await expect(page.getByText("ZIP is shown only")).toBeVisible();
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
