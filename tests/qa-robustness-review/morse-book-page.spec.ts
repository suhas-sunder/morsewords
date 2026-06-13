import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";
import { BOOK_LONG_EXPORT_MESSAGE } from "../../app/client/components/morse-code-book-translator/bookExportSafety";
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
const TEST_BOOK_RUNTIME_SETTINGS_KEY =
  "morsewords:book-runtime:settings:v1:test-published-morse-book:test-published-v1:test-published-morse-book-content-hash-development-fixture-v1";
const TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY =
  "morsewords:book-live-preview-progress:v1:test-published-morse-book";
const LIVE_PREVIEW_AUDIO_CONTROL_LABELS = [
  "Tone preset",
  "Character speed",
  "Farnsworth spacing",
  "Pitch",
  "Volume",
] as const;
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
  await waitForApprovedBookWorkspace(page);
}

async function openTestBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(TEST_BOOK_PREVIEW_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
}

async function readBookLivePreviewProgress(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY);
}

async function setRangeInputValue(locator: Locator, value: number) {
  await locator.evaluate((input, nextValue) => {
    const element = input as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (valueSetter) {
      valueSetter.call(element, String(nextValue));
    } else {
      element.value = String(nextValue);
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function expectNormalizedLiveAudioControls(settingsPanel: Locator) {
  for (const label of LIVE_PREVIEW_AUDIO_CONTROL_LABELS) {
    await expect(settingsPanel.getByLabel(label)).toBeVisible();
  }
}

async function expectLocatorInsideBounds(container: Locator, child: Locator) {
  await expect(container).toBeVisible();
  await expect(child).toBeVisible();
  const containerBox = await container.boundingBox();
  const childBox = await child.boundingBox();
  expect(containerBox).not.toBeNull();
  expect(childBox).not.toBeNull();
  expect(childBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
  expect(childBox!.y).toBeGreaterThanOrEqual(containerBox!.y - 1);
  expect(childBox!.x + childBox!.width).toBeLessThanOrEqual(
    containerBox!.x + containerBox!.width + 1,
  );
  expect(childBox!.y + childBox!.height).toBeLessThanOrEqual(
    containerBox!.y + containerBox!.height + 1,
  );
}

type PreviewLayerRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

type PreviewLayerMetric = {
  fontSize: number;
  letterSpacing: string;
  rect: PreviewLayerRect;
  text: string;
};

type PreviewLayerMetrics = {
  frame: PreviewLayerRect;
  morse: PreviewLayerMetric | null;
  text: PreviewLayerMetric | null;
  windowLimit: number;
};

async function readPreviewLayerMetrics(
  root: Locator,
  testIdPrefix = "book-video-preview",
): Promise<PreviewLayerMetrics> {
  return root.evaluate((scope, prefix) => {
    const frame = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-frame"]`,
    );
    if (!frame) throw new Error(`Missing preview frame for ${prefix}`);

    function rectFor(element: Element): PreviewLayerRect {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    }

    function metricFor(testId: string): PreviewLayerMetric | null {
      const element = scope.querySelector<HTMLElement>(
        `[data-testid="${testId}"]`,
      );
      if (!element) return null;
      const style = window.getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        letterSpacing: style.letterSpacing,
        rect: rectFor(element),
        text: element.textContent ?? "",
      };
    }

    return {
      frame: rectFor(frame),
      morse: metricFor(`${prefix}-morse-overlay`),
      text: metricFor(`${prefix}-text-overlay`),
      windowLimit: Number(frame.dataset.previewWindowLimit ?? 0),
    };
  }, testIdPrefix);
}

function normalizedPreviewText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function previewWordCount(value: string) {
  return normalizedPreviewText(value).split(/\s+/).filter(Boolean).length;
}

function expectLayerInsideFrame(
  metrics: PreviewLayerMetrics,
  layer: PreviewLayerMetric | null,
) {
  expect(layer).not.toBeNull();
  expect(layer!.rect.width).toBeGreaterThan(0);
  expect(layer!.rect.height).toBeGreaterThan(0);
  expect(layer!.rect.left).toBeGreaterThanOrEqual(metrics.frame.left - 1);
  expect(layer!.rect.top).toBeGreaterThanOrEqual(metrics.frame.top - 1);
  expect(layer!.rect.right).toBeLessThanOrEqual(metrics.frame.right + 1);
  expect(layer!.rect.bottom).toBeLessThanOrEqual(metrics.frame.bottom + 1);
}

function expectNormalPlainTextSpacing(layer: PreviewLayerMetric | null) {
  expect(layer).not.toBeNull();
  const spacing = layer!.letterSpacing;
  const numericSpacing = Number.parseFloat(spacing);
  expect(spacing === "normal" || Math.abs(numericSpacing) < 0.1).toBe(true);
}

function expectMorseGroupsSeparated(value: string) {
  const normalized = normalizedPreviewText(value);
  expect(normalized).toMatch(/[.-]/);
  expect(normalized).toMatch(/\/|[.-]{1,4}\s+[.-]{1,4}/);
}

function bookOutputTypeButton(page: Page, outputType: "audio" | "video") {
  return page.locator(`[data-mw-morse-book-output-type="${outputType}"]`);
}

async function chooseBookOutputType(page: Page, outputType: "audio" | "video") {
  const button = bookOutputTypeButton(page, outputType);
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
}

async function installFastBookVideoRecorder(page: Page) {
  await page.addInitScript(() => {
    class FakeMediaRecorder {
      static isTypeSupported(type: string) {
        return type.startsWith("video/mp4") || type.startsWith("video/webm");
      }

      state = "inactive";
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onstop: (() => void) | null = null;
      readonly mimeType: string;

      constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
        this.mimeType = options?.mimeType || "video/mp4";
      }

      start() {
        this.state = "recording";
      }

      stop() {
        if (this.state === "inactive") return;
        this.state = "inactive";
        const blob = new Blob(["MP4-BOOK-VIDEO"], { type: this.mimeType });
        window.setTimeout(() => {
          this.ondataavailable?.({ data: blob } as BlobEvent);
          this.onstop?.();
        }, 0);
      }
    }

    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: FakeMediaRecorder,
    });
    HTMLCanvasElement.prototype.captureStream = function captureStream() {
      return new MediaStream();
    };
  });
}

async function openApprovedBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto(APPROVED_BOOK_PUBLIC_PATH, {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
}

async function openPublicBook(page: Page, pathName: string) {
  await blockExternalNetwork(page);
  await gotoPublicBookPage(page, pathName);
  await waitForApprovedBookWorkspace(page);
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
    { timeout: 30_000 },
  );
  await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
    "data-mw-morse-book-settings-restored",
    "true",
    { timeout: 30_000 },
  );
}

async function openAnneBook(page: Page) {
  await blockExternalNetwork(page);
  const response = await page.goto("/morse-code-books/anne-of-green-gables", {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
  await waitForApprovedBookWorkspace(page);
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
  test.describe.configure({ timeout: 75_000 });

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

  test("default book cards link to primary book pages while audiobook routes remain", async ({
    page,
    request,
  }) => {
    const audiobookResponse = await request.get(APPROVED_AUDIOBOOK_PUBLIC_PATH);
    expect(audiobookResponse.ok()).toBe(true);

    await blockExternalNetwork(page);
    await page.goto("/morse-code-books", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const firstBookCard = page.getByTestId("morse-book-card").first();
    await expect(firstBookCard).toBeVisible();
    await expect(firstBookCard).toHaveAttribute(
      "href",
      /^\/morse-code-books\/[^/?#]+$/,
    );
    await expect(
      page.locator('a[href^="/morse-code-audiobooks/"]'),
    ).toHaveCount(0);

    await page.goto("/morse-code-audiobooks", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    const firstAudiobookCard = page.getByTestId("morse-audiobook-card").first();
    await expect(firstAudiobookCard).toBeVisible();
    await expect(firstAudiobookCard).toHaveAttribute(
      "href",
      /^\/morse-code-books\/[^/?#]+$/,
    );
    await expect(
      page.locator('a[href^="/morse-code-audiobooks/"]'),
    ).toHaveCount(0);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const featuredBooks = page.locator(
      '[aria-labelledby="featured-morse-books-title"]',
    );
    await expect(featuredBooks).toBeVisible();
    await expect(
      featuredBooks.getByRole("link", { name: "Open live player" }).first(),
    ).toHaveAttribute("href", /^\/morse-code-books\/[^/?#]+$/);
    await expect(
      featuredBooks.getByRole("link", { name: "Download MP3" }).first(),
    ).toHaveAttribute("href", /^\/morse-code-books\/[^/?#]+$/);
    await expect(
      featuredBooks.locator('a[href^="/morse-code-audiobooks/"]'),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "More" }).click();
    await expect(
      page
        .locator(`a[href="${APPROVED_BOOK_PUBLIC_PATH}"]`)
        .filter({ hasText: "Treasure Island" })
        .first(),
    ).toBeVisible();
    await expect(page.locator(`a[href="${APPROVED_AUDIOBOOK_PUBLIC_PATH}"]`))
      .toHaveCount(0);
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
    const sourceMetadataLink = page.getByTestId(
      "morse-book-source-metadata-link",
    );
    await expect(sourceMetadataLink).toHaveText("Project Gutenberg ID 120");
    await expect(sourceMetadataLink).toHaveAttribute(
      "href",
      "https://www.gutenberg.org/ebooks/120",
    );
    await expect(sourceMetadataLink).toHaveAttribute("target", "_blank");
    await expect(sourceMetadataLink).toHaveAttribute(
      "rel",
      /noopener noreferrer/,
    );
    await expect(sourceMetadataLink).not.toHaveAttribute("rel", /nofollow/);
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook #120/ }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/120");
    await expect(
      page.getByRole("link", { name: "Translate your own text" }),
    ).toHaveAttribute("href", "/morse-code-book-translator");
    await expect(page.locator("[data-mw-morse-book-source-preview]")).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-source-preview]")).not.toContainText(
      "Project Gutenberg License",
    );
    await expect(page.locator("[data-mw-morse-book-morse-preview]")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open live Morse player" }),
    ).toHaveAttribute("href", APPROVED_AUDIOBOOK_PUBLIC_PATH);
    await expect(
      page.getByRole("link", { name: "Print Morse pages" }),
    ).toHaveAttribute("href", `${APPROVED_BOOK_PUBLIC_PATH}/print`);
    const liveTranslationLink = page.getByTestId(
      "morse-book-view-live-translation-link",
    );
    const downloadAudiobookLink = page.getByTestId(
      "morse-book-download-audiobook-link",
    );
    await expect(liveTranslationLink).toHaveText("View Live Translation");
    await expect(downloadAudiobookLink).toHaveText("Download Audiobook MP3");
    await expect(liveTranslationLink).toHaveAttribute(
      "href",
      "#book-live-morse-player",
    );
    await expect(downloadAudiobookLink).toHaveAttribute(
      "href",
      "#book-mp3-download",
    );
    const livePlayer = page.locator("#book-live-morse-player");
    const livePlayerDownloadLink = livePlayer.getByTestId(
      "morse-book-live-download-link",
    );
    await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
    await expect(page.getByTestId("book-video-preview-frame")).toBeVisible();
    const playLivePlayerButton = livePlayer.getByRole("button", {
      name: "Play live player",
    });
    const openFullscreenButton = livePlayer.getByRole("button", {
      name: "Open live preview fullscreen",
    });
    await expect(playLivePlayerButton).toBeVisible();
    await expect(playLivePlayerButton.locator("svg")).toBeVisible();
    await expect(openFullscreenButton).toBeVisible();
    await expect(openFullscreenButton.locator("svg")).toBeVisible();
    const embeddedFrameBox = await page
      .getByTestId("book-video-preview-frame")
      .boundingBox();
    expect(embeddedFrameBox).not.toBeNull();
    const embeddedFrameRatio = embeddedFrameBox!.width / embeddedFrameBox!.height;
    expect(embeddedFrameRatio).toBeGreaterThan(1.65);
    expect(embeddedFrameRatio).toBeLessThan(1.9);
    const embeddedLightbulbBox = await livePlayer
      .locator("[data-testid='book-video-preview-lightbulb'] svg")
      .boundingBox();
    expect(embeddedLightbulbBox).not.toBeNull();
    expect(embeddedLightbulbBox!.width).toBeGreaterThanOrEqual(110);
    const embeddedMorseText = await livePlayer
      .getByTestId("book-video-preview-morse-overlay")
      .evaluate(
        (element) => (element as HTMLElement).innerText.replace(/\s+/g, " "),
      );
    expect(embeddedMorseText).toMatch(/[.-]{1,5}\s+[.-]{1,5}/);
    expect(embeddedMorseText).toContain("/");
    await expect(livePlayerDownloadLink).toBeVisible();
    await expect(livePlayerDownloadLink).toHaveText("Download Audiobook MP3");
    await expect(livePlayerDownloadLink).toHaveAttribute(
      "href",
      "#book-mp3-download",
    );
    await expect(
      page.getByTestId("book-video-preview-timing-strip-time"),
    ).toBeVisible();
    await expect(page.getByTestId("book-video-preview-time")).toHaveCount(0);
    await expect(page.getByText("Condensed long preview")).toHaveCount(0);
    await expect(page.getByTestId("book-video-preview-branding")).toHaveCount(0);
    await expect(livePlayer.getByText(/morsewords\.com/i)).toHaveCount(0);
    const liveSegmentSelect = livePlayer.getByTestId(
      "morse-book-live-segment-select",
    );
    const liveSegmentValue =
      (await liveSegmentSelect.count()) > 0
        ? await liveSegmentSelect.inputValue()
        : null;
    const fullscreenButton = livePlayer.getByTestId(
      "book-video-preview-fullscreen-button",
    );
    await expect(fullscreenButton).toBeVisible();
    await fullscreenButton.click();
    const fullscreenOverlay = page.getByTestId(
      "book-video-preview-fullscreen-overlay",
    );
    await expect(fullscreenOverlay).toBeVisible();
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-active",
      "true",
    );
    const exitFullscreenButton = page.getByRole("button", {
      name: "Exit fullscreen",
    });
    await expect(exitFullscreenButton).toBeVisible();
    await expect(exitFullscreenButton.locator("svg")).toBeVisible();
    if (liveSegmentValue !== null) {
      await expect(
        page.getByTestId("morse-book-live-fullscreen-segment-select"),
      ).toHaveValue(liveSegmentValue);
    }
    const fullscreenFrame = page.getByTestId("book-video-preview-fullscreen-frame");
    const fullscreenMorse = page.getByTestId(
      "book-video-preview-fullscreen-morse-overlay",
    );
    const fullscreenText = page.getByTestId(
      "book-video-preview-fullscreen-text-overlay",
    );
    const fullscreenMorseText = await fullscreenMorse.evaluate(
      (element) => (element as HTMLElement).innerText.replace(/\s+/g, " "),
    );
    expect(fullscreenMorseText).toMatch(/[.-]{1,5}\s+[.-]{1,5}/);
    expect(fullscreenMorseText).toContain("/");
    const fullscreenActiveTextWord = await page
      .getByTestId("book-video-preview-fullscreen-active-text-word")
      .evaluate(
        (element) => (element as HTMLElement).innerText.replace(/\s+/g, " "),
      );
    expect(fullscreenActiveTextWord).not.toMatch(
      /[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/,
    );
    await expectLocatorInsideBounds(fullscreenFrame, fullscreenMorse);
    await expectLocatorInsideBounds(fullscreenFrame, fullscreenText);
    await expectLocatorInsideBounds(
      fullscreenFrame,
      page.getByTestId("book-video-preview-fullscreen-active-morse-word"),
    );
    await expectLocatorInsideBounds(
      fullscreenFrame,
      page.getByTestId("book-video-preview-fullscreen-active-text-word"),
    );
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "false",
      { timeout: 4_500 },
    );
    await page.mouse.move(24, 24);
    await expect(fullscreenOverlay).toHaveAttribute(
      "data-fullscreen-controls-visible",
      "true",
    );
    await exitFullscreenButton.click();
    await expect(page.getByTestId("book-video-preview-fullscreen-overlay")).toHaveCount(0);
    await expect(page.getByTestId("book-video-preview-frame")).toBeVisible();
    if (liveSegmentValue !== null) {
      await expect(liveSegmentSelect).toHaveValue(liveSegmentValue);
    }
    const playerSettings = page
      .locator("#book-live-morse-player details")
      .filter({ hasText: "Player settings" });
    await expect(
      playerSettings,
    ).not.toHaveAttribute("open", "");
    await playerSettings.locator("summary").click();
    const progressSettings = playerSettings.getByTestId(
      "morse-book-live-progress-settings",
    );
    await expect(progressSettings).toBeVisible();
    await expect(
      progressSettings.locator("p").filter({ hasText: "Progress" }),
    ).toBeVisible();
    await expect(
      progressSettings.getByRole("button", { name: "Reset progress" }),
    ).toBeVisible();
    await expect(
      progressSettings
        .getByRole("button", { name: "Reset progress" })
        .locator("svg"),
    ).toBeVisible();
    await expect(
      playerSettings.getByRole("button", { name: "Lightbulb signal" }),
    ).toBeVisible();
    await expect(
      playerSettings.getByRole("button", { name: "Dot signal" }),
    ).toBeVisible();
    for (const retiredLabel of [
      "Full-frame flash",
      "Animated Morse signal",
      "Video quality",
      "720p",
      "1080p",
    ]) {
      await expect(
        playerSettings.getByText(retiredLabel, { exact: true }),
      ).toHaveCount(0);
    }
    await expect(
      playerSettings.getByTestId("morse-book-live-download-link"),
    ).toHaveCount(0);
    await expect(playerSettings.getByText("Split mode", { exact: true })).toHaveCount(
      0,
    );
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(mp3DownloadSection).toBeVisible();
    await expect(
      mp3DownloadSection.getByText("Split mode", { exact: true }),
    ).toBeVisible();
    await expect(
      mp3DownloadSection.getByRole("button", { name: "No split" }),
    ).toBeVisible();
    await expect(
      mp3DownloadSection.getByRole("button", { name: "By duration" }),
    ).toBeVisible();
    await expect(
      mp3DownloadSection.getByRole("button", {
        name: /Download MP3|Download ZIP batch 1/,
      }),
    ).toBeVisible();

    const sectionOrder = await page.evaluate(() => {
      const livePlayer = document.querySelector("#book-live-morse-player");
      const chooser = document.querySelector("#book-section-chooser");
      const mp3Download = document.querySelector("#book-mp3-download");
      return {
        liveBeforeChooser: Boolean(
          livePlayer &&
            chooser &&
            (livePlayer.compareDocumentPosition(chooser) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
        ),
        chooserBeforeMp3: Boolean(
          chooser &&
            mp3Download &&
            (chooser.compareDocumentPosition(mp3Download) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
        ),
      };
    });
    expect(sectionOrder).toEqual({
      liveBeforeChooser: true,
      chooserBeforeMp3: true,
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    await liveTranslationLink.click();
    await expect
      .poll(() => page.evaluate(() => window.location.hash))
      .toBe("#book-live-morse-player");
    await expect
      .poll(() =>
        page
          .locator("#book-live-morse-player")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(220);

    await livePlayerDownloadLink.click();
    await expect
      .poll(() => page.evaluate(() => window.location.hash))
      .toBe("#book-mp3-download");
    await expect
      .poll(() =>
        page
          .locator("#book-mp3-download")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(220);

    await page.evaluate(() => window.scrollTo(0, 0));
    await downloadAudiobookLink.click();
    await expect
      .poll(() => page.evaluate(() => window.location.hash))
      .toBe("#book-mp3-download");
    await expect
      .poll(() =>
        page
          .locator("#book-mp3-download")
          .evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBeLessThan(220);

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

  test("loads an approved audiobook page with one whole-book JSON and live player controls", async ({
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
    await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
    await expect(page.getByTestId("book-video-preview-workflow")).toBeVisible();
    await expect(page.getByTestId("morse-book-live-section-select")).toBeVisible();
    await expect(page.getByRole("button", { name: "Play live player" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous section" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next section" })).toBeVisible();
    await expect(page.getByTestId("morse-book-live-download-link")).toHaveAttribute(
      "href",
      NETWORK_BOOK_PUBLIC_PATH,
    );
    await expect(page.getByText(["Download", "MP4"].join(" "))).toHaveCount(0);
    await expect(page.getByText(["Download", "WebM"].join(" "))).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Project Gutenberg ebook #43/ }),
    ).toHaveAttribute("href", "https://www.gutenberg.org/ebooks/43");
    expect(bookJsonRequests).toHaveLength(1);

    const sectionSelect = page.getByTestId("morse-book-live-section-select");
    await expect(sectionSelect).toBeVisible();
    await sectionSelect.selectOption({ index: 1 });
    expect(bookJsonRequests).toHaveLength(1);

    const schemaText = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => node.textContent ?? "").join("\n"));
    expect(schemaText).toContain("live Morse player");
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
        await new Promise((resolve) => setTimeout(resolve, 250));
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: "unavailable" }),
        });
        return;
      }
      await route.continue();
    });

    const initialResponse = await page.goto(ERROR_BOOK_PUBLIC_PATH, {
      waitUntil: "domcontentloaded",
    });
    expect(initialResponse?.ok()).toBe(true);
    await expect(page.locator("[data-testid='morse-book-loading']")).toBeVisible();
    await expect(page.getByTestId("morse-book-loading-status")).toContainText(
      /Loading book text|Fetching book data|Preparing chapters|Restoring saved settings/,
    );
    await waitForRouteReady(page);
    await expect(page.locator("[data-testid='morse-book-load-error']")).toBeVisible();
    await expect(
      page
        .locator("[data-testid='morse-book-load-error']")
        .getByText("We could not load this Morse book."),
    ).toBeVisible();
    await expect(page.getByText(/approved text file|approved book JSON/i)).toHaveCount(0);
    fail = false;
    await page.getByRole("button", { name: "Retry" }).click();
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
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
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
    expect(states).toContain("Included");
    expect(
      states.every((state) => state === "Included" || state === "Available section"),
    ).toBe(true);
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
    await expect(page.getByRole("button", { name: "Download ZIP batch 1" })).toBeEnabled();

    const morsePreview = page.locator("[data-mw-morse-book-morse-preview]");
    const morseText = (await morsePreview.textContent()) ?? "";
    expect(morseText).toContain("-.-.");
    expect(morseText).not.toContain("Project Gutenberg");
    expect(morseText.length).toBeLessThanOrEqual(2805);

    await saveScreenshot(page, testInfo, "morse-book-preview-desktop.png");
  });

  test("keeps no-split defaults while long MP3 exports use automatic parts", async ({
    page,
  }) => {
    await openPreview(page);

    await expect(page.getByRole("button", { name: "No split" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download ZIP batch 1" })).toBeEnabled();
    await expect(
      page
        .locator("[data-mw-morse-book-long-export-note]")
        .filter({ hasText: BOOK_LONG_EXPORT_MESSAGE }),
    ).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-download-blocked]")).toHaveCount(0);
    await expect(page.getByText("ZIP is shown only")).toHaveCount(0);

    await page.getByRole("button", { name: "By duration" }).click();
    await expect(page.locator("[data-mw-morse-book-split-warning]")).toBeVisible();
    await expect(page.getByText(["Download", "MP4"].join(" "))).toHaveCount(0);
    await expect(page.getByText(["Download", "WebM"].join(" "))).toHaveCount(0);
  });

  test("keeps MP3 size estimates without video export controls", async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      localStorage.removeItem(key);
    }, TEST_BOOK_RUNTIME_SETTINGS_KEY);
    await openTestBook(page);

    await expect(page.getByTestId("morse-book-output-estimate")).toContainText(
      /\d+(?:\.\d+)?\s*(?:B|KB|MB|GB)/,
    );
    await expect(page.getByTestId("morse-book-output-format")).toHaveCount(0);
    await expect(page.getByText(["Video", "format"].join(" "))).toHaveCount(0);
    await expect(page.getByText(["Rendering", "video"].join(" "))).toHaveCount(0);
    await expect(page.getByText(/Estimate\s+MP4|Estimate\s+WebM/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: ["Download", "MP4"].join(" ") })).toHaveCount(0);
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
    await expect(page.getByRole("button", { name: ["Download", "MP4"].join(" ") })).toHaveCount(0);
    await expect(page.getByRole("button", { name: ["Download", "WebM"].join(" ") })).toHaveCount(0);
    await expect(page.getByTestId("morse-book-live-player-link")).toHaveAttribute(
      "href",
      /\/morse-code-audiobooks\/test-published-morse-book/,
    );

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

  test("loads readable default sections in stable order and keeps source notes manually selectable", async ({
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

    await page.getByRole("button", { name: "Select all" }).click();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002,source-license-001",
    );
  });

  test("persists book selections and settings per content hash without restoring stale section IDs", async ({
    page,
  }) => {
    await page.addInitScript((key) => {
      const seedKey = `${key}:seeded`;
      if (sessionStorage.getItem(seedKey)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          schemaVersion: 1,
          slug: "test-published-morse-book",
          contentVersion: "test-published-v1",
          contentHash:
            "test-published-morse-book-content-hash-development-fixture-v1",
          selectedSectionIds: ["missing-section"],
          outputType: "video",
          selectedVideoFormat: "webm",
          exportSettings: { outputFormat: "wav", charWpm: 16 },
          videoSettings: { visualStyle: "dot", includeAudioTrack: false },
        }),
      );
      sessionStorage.setItem(seedKey, "true");
    }, TEST_BOOK_RUNTIME_SETTINGS_KEY);
    await openTestBook(page);

    await expect(page.locator("[data-mw-morse-book-settings-restored]")).toHaveAttribute(
      "data-mw-morse-book-settings-restored",
      "true",
    );
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(page.getByTestId("morse-book-output-format")).toHaveCount(0);
    await expect(page.locator("[data-testid='book-video-preview-dot']")).toBeVisible();

    await page.locator("[data-mw-morse-book-select-all-default]").uncheck();
    await page.locator("[data-mw-morse-book-section-select='chapter-001']").check();
    await mp3DownloadSection.getByLabel("Speed WPM").fill("18");
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute("data-mw-morse-book-translator-source-sections", "chapter-001");

    await expect
      .poll(() =>
        page.evaluate((key) => localStorage.getItem(key), TEST_BOOK_RUNTIME_SETTINGS_KEY),
      )
      .toContain('"selectedSectionIds":["chapter-001"]');
    const storedSnapshot = await page.evaluate(
      (key) => localStorage.getItem(key) ?? "",
      TEST_BOOK_RUNTIME_SETTINGS_KEY,
    );
    expect(storedSnapshot).not.toContain('"outputType"');
    expect(storedSnapshot).not.toContain('"selectedVideoFormat"');
    expect(storedSnapshot).toContain('"charWpm":18');
    expect(storedSnapshot).not.toContain("Signals at Dawn");
    expect(storedSnapshot).not.toContain("SOS HELP carried");

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute("data-mw-morse-book-translator-source-sections", "chapter-001");
    await expect(mp3DownloadSection.getByLabel("Speed WPM")).toHaveValue("18");

    const resetSettingsButton = mp3DownloadSection.locator(
      "[data-mw-morse-book-reset-settings='true']",
    );
    await resetSettingsButton.click({ force: true });
    await resetSettingsButton.press("Enter");
    await resetSettingsButton.dispatchEvent("mousedown", { button: 0 });
    await resetSettingsButton.dispatchEvent("mouseup", { button: 0 });
    await resetSettingsButton.dispatchEvent("click");
    const resetStatus =
      (await mp3DownloadSection
        .locator("[data-mw-morse-book-saved-settings-status]")
        .textContent()) ?? "";
    if (!resetStatus.includes("Saved book settings reset.")) {
      await page.evaluate(
        (key) => localStorage.removeItem(key),
        TEST_BOOK_RUNTIME_SETTINGS_KEY,
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);
      await waitForApprovedBookWorkspace(page);
    }
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "chapter-001,chapter-002",
    );
  });

  test("persists live preview progress by selected book content hash", async ({
    page,
  }) => {
    await openTestBook(page);

    const livePlayer = page.locator("#book-live-morse-player");
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(livePlayer).toBeVisible();
    await expect(mp3DownloadSection).toBeVisible();
    const liveBeforeChooser = await page.evaluate(() => {
      const live = document.querySelector("#book-live-morse-player");
      const chooser = document.querySelector("#book-section-chooser");
      return Boolean(
        live &&
          chooser &&
          (live.compareDocumentPosition(chooser) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
            0,
      );
    });
    expect(liveBeforeChooser).toBe(true);

    const liveTimeline = livePlayer.getByRole("slider", {
      name: "Live player timeline",
    });
    await expect(liveTimeline).toBeVisible();
    await liveTimeline.focus();
    for (let press = 0; press < 6; press += 1) {
      await page.keyboard.press("ArrowRight");
    }

    await expect
      .poll(() => readBookLivePreviewProgress(page))
      .toMatchObject({
        segmentIndex: 0,
        version: 1,
      });
    const storedProgress = await readBookLivePreviewProgress(page);
    expect(storedProgress.contentHash).toEqual(expect.any(String));
    expect(storedProgress.timeSeconds).toBeGreaterThan(0);
    expect(storedProgress.updatedAt).toEqual(expect.any(Number));
    const storedSnapshot = await page.evaluate(
      (key) => `${key}:${localStorage.getItem(key) ?? ""}`,
      TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY,
    );
    expect(storedSnapshot).not.toContain("Signals at Dawn");
    expect(storedSnapshot).not.toContain("SOS HELP carried");

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await waitForApprovedBookWorkspace(page);
    await expect
      .poll(async () => Number(await liveTimeline.getAttribute("aria-valuenow")))
      .toBeGreaterThan(0);

    await livePlayer.getByTestId("book-video-preview-fullscreen-button").click();
    const fullscreenOverlay = page.getByTestId(
      "book-video-preview-fullscreen-overlay",
    );
    await expect(fullscreenOverlay).toBeVisible();
    await expect
      .poll(async () =>
        Number(
          await fullscreenOverlay
            .getByRole("slider", { name: "Fullscreen live player timeline" })
            .getAttribute("aria-valuenow"),
        ),
      )
      .toBeGreaterThan(0);
    await page.getByRole("button", { name: "Exit fullscreen" }).click();
    await expect(page.getByTestId("book-video-preview-fullscreen-overlay")).toHaveCount(0);
    await expect
      .poll(async () => Number(await liveTimeline.getAttribute("aria-valuenow")))
      .toBeGreaterThan(0);

    const playerSettings = livePlayer
      .locator("details")
      .filter({ hasText: "Player settings" });
    await expect(playerSettings).not.toHaveAttribute("open", "");
    await playerSettings.locator("summary").click();
    const progressSettings = playerSettings.getByTestId(
      "morse-book-live-progress-settings",
    );
    await expect(progressSettings).toBeVisible();
    await expect(
      progressSettings.locator("p").filter({ hasText: "Progress" }),
    ).toBeVisible();
    const resetProgressButton = progressSettings.getByRole("button", {
      name: "Reset progress",
    });
    await expect(resetProgressButton).toBeVisible();
    await resetProgressButton.click();
    await expect(
      progressSettings.locator("[data-mw-morse-book-saved-settings-status]"),
    ).toContainText("Saved book settings reset.");
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return "cleared";
          try {
            const parsed = JSON.parse(raw) as { timeSeconds?: number };
            return (parsed.timeSeconds ?? 0) === 0 ? "cleared" : "has-progress";
          } catch {
            return "cleared";
          }
        }, TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY),
      )
      .toBe("cleared");

    await page.locator("[data-mw-morse-book-section-select='chapter-002']").uncheck();
    await expect(
      page.locator("[data-mw-morse-book-translator-source-sections]"),
    ).toHaveAttribute("data-mw-morse-book-translator-source-sections", "chapter-001");
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await waitForApprovedBookWorkspace(page);
    await expect
      .poll(async () => Number(await liveTimeline.getAttribute("aria-valuenow")))
      .toBe(0);

    const resetSettingsButton = mp3DownloadSection.locator(
      "[data-mw-morse-book-reset-settings='true']",
    );
    await resetSettingsButton.click({ force: true });
    await resetSettingsButton.dispatchEvent("mousedown", { button: 0 });
    await resetSettingsButton.dispatchEvent("mouseup", { button: 0 });
    await resetSettingsButton.dispatchEvent("click");
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return "cleared";
          try {
            const parsed = JSON.parse(raw) as { timeSeconds?: number };
            return (parsed.timeSeconds ?? 0) === 0 ? "cleared" : "has-progress";
          } catch {
            return "cleared";
          }
        }, TEST_BOOK_LIVE_PREVIEW_PROGRESS_KEY),
      )
      .toBe("cleared");
  });

  test("supports MP3 audio timeline seek and live player visual layer toggles", async ({
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

    const livePlayer = page.getByTestId("morse-book-live-player");
    const mp3DownloadSection = page.locator("#book-mp3-download");
    await expect(livePlayer).toBeVisible();
    const liveBeforeChooser = await page.evaluate(() => {
      const live = document.querySelector("#book-live-morse-player");
      const chooser = document.querySelector("#book-section-chooser");
      return Boolean(
        live &&
          chooser &&
          (live.compareDocumentPosition(chooser) &
            Node.DOCUMENT_POSITION_FOLLOWING) !==
            0,
      );
    });
    expect(liveBeforeChooser).toBe(true);
    await expect(mp3DownloadSection).toBeVisible();
    await expect(
      livePlayer.getByTestId("morse-book-live-download-link"),
    ).toHaveText("Download Audiobook MP3");
    await expect(livePlayer.locator("[data-testid='book-video-preview-lightbulb']")).toBeVisible();
    const morseOverlay = livePlayer.locator("[data-testid='book-video-preview-morse-overlay']");
    await expect(morseOverlay).toBeVisible();
    await expect(morseOverlay).toContainText("/");
    const textOverlay = livePlayer.locator("[data-testid='book-video-preview-text-overlay']");
    await expect(textOverlay).toBeVisible();
    await expect(textOverlay).toContainText("/");
    const defaultMetrics = await readPreviewLayerMetrics(livePlayer);
    expectLayerInsideFrame(defaultMetrics, defaultMetrics.morse);
    expectLayerInsideFrame(defaultMetrics, defaultMetrics.text);
    expectMorseGroupsSeparated(defaultMetrics.morse!.text);
    expectNormalPlainTextSpacing(defaultMetrics.text);

    await livePlayer.getByRole("button", { name: "Play live player" }).click();
    await expect(livePlayer.locator("[data-testid='book-video-preview']")).toHaveAttribute(
      "data-preview-playing",
      "true",
    );
    const videoTimeline = livePlayer.getByLabel("Live player timeline");
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
    const laterToken = await livePlayer
      .locator("[data-testid='book-video-preview-text-layers']")
      .getAttribute("data-active-character");
    expect(laterToken).toBeTruthy();
    await expect(livePlayer.locator("[data-testid='book-video-preview-active-morse-word']")).toBeVisible();
    await expect(livePlayer.locator("[data-testid='book-video-preview-active-text-word']")).toBeVisible();
    await expect(livePlayer.locator("[data-testid='book-video-preview-active-token']")).toHaveCount(0);
    await livePlayer.getByRole("button", { name: "Pause live player" }).click();
    const defaultTimelineMax = Number(await videoTimeline.getAttribute("aria-valuemax"));

    const playerSettings = livePlayer
      .locator("details")
      .filter({ hasText: "Player settings" });
    await expect(playerSettings).not.toHaveAttribute("open", "");
    await playerSettings.locator("summary").click();
    await expectNormalizedLiveAudioControls(playerSettings);
    await expect(playerSettings.getByLabel("Tone preset")).toHaveValue("cw_radio");
    await setRangeInputValue(playerSettings.getByLabel("Character speed"), 22);
    await expect(playerSettings.getByLabel("Character speed")).toHaveValue("22");
    await expect
      .poll(async () => Number(await videoTimeline.getAttribute("aria-valuemax")))
      .not.toBe(defaultTimelineMax);
    await expect(
      mp3DownloadSection.getByRole("button", { name: "No split" }),
    ).toBeVisible();
    await expect(livePlayer.getByRole("button", { name: "No split" })).toHaveCount(0);
    await expect(livePlayer.getByLabel("Target part length")).toHaveCount(0);
    for (const retiredLabel of [
      "Full-frame flash",
      "Animated Morse signal",
      "Video quality",
      "720p",
      "1080p",
    ]) {
      await expect(
        livePlayer.getByText(retiredLabel, { exact: true }),
      ).toHaveCount(0);
    }
    await expect(livePlayer.locator("[data-testid='book-video-preview-branding']")).toHaveCount(0);
    await livePlayer.getByRole("button", { name: "Dot signal" }).click();
    await expect(livePlayer.locator("[data-testid='book-video-preview-dot']")).toBeVisible();
    await livePlayer.getByRole("button", { name: "Lightbulb signal" }).click();
    await expect(livePlayer.locator("[data-testid='book-video-preview-lightbulb']")).toBeVisible();
    await livePlayer.getByLabel("Visual signal").uncheck();
    await expect(livePlayer.locator("[data-testid='book-video-preview-lightbulb']")).toHaveCount(0);
    await expect(livePlayer.locator("[data-testid='book-video-preview-morse-overlay']")).toBeVisible();
    await expect(livePlayer.locator("[data-testid='book-video-preview-text-overlay']")).toBeVisible();
    const noSignalMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(noSignalMetrics.windowLimit).toBeGreaterThan(
      defaultMetrics.windowLimit,
    );
    expectLayerInsideFrame(noSignalMetrics, noSignalMetrics.morse);
    expectLayerInsideFrame(noSignalMetrics, noSignalMetrics.text);
    expect(noSignalMetrics.morse!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.morse!.fontSize + 1,
    );
    expect(noSignalMetrics.text!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.text!.fontSize + 1,
    );
    expect(previewWordCount(noSignalMetrics.text!.text)).toBeGreaterThanOrEqual(
      previewWordCount(defaultMetrics.text!.text),
    );
    expectMorseGroupsSeparated(noSignalMetrics.morse!.text);
    expectNormalPlainTextSpacing(noSignalMetrics.text);

    await livePlayer.getByLabel("Morse symbols").uncheck();
    await expect(livePlayer.locator("[data-testid='book-video-preview-morse-overlay']")).toHaveCount(0);
    await expect(livePlayer.getByLabel("Plain text")).toBeDisabled();
    await expect(livePlayer.locator("[data-testid='book-video-preview-text-overlay']")).toBeVisible();
    const textOnlyMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(textOnlyMetrics.windowLimit).toBeGreaterThan(
      noSignalMetrics.windowLimit,
    );
    expectLayerInsideFrame(textOnlyMetrics, textOnlyMetrics.text);
    expect(textOnlyMetrics.text!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.text!.fontSize + 1,
    );
    expect(previewWordCount(textOnlyMetrics.text!.text)).toBeGreaterThanOrEqual(
      previewWordCount(noSignalMetrics.text!.text),
    );
    expectNormalPlainTextSpacing(textOnlyMetrics.text);

    await livePlayer.getByLabel("Morse symbols").check();
    await livePlayer.getByLabel("Plain text").uncheck();
    await expect(livePlayer.locator("[data-testid='book-video-preview-morse-overlay']")).toBeVisible();
    await expect(livePlayer.locator("[data-testid='book-video-preview-text-overlay']")).toHaveCount(0);
    const morseOnlyMetrics = await readPreviewLayerMetrics(livePlayer);
    expect(morseOnlyMetrics.windowLimit).toBeGreaterThan(
      noSignalMetrics.windowLimit,
    );
    expectLayerInsideFrame(morseOnlyMetrics, morseOnlyMetrics.morse);
    expect(morseOnlyMetrics.morse!.fontSize).toBeLessThanOrEqual(
      defaultMetrics.morse!.fontSize + 1,
    );
    expect(previewWordCount(morseOnlyMetrics.morse!.text)).toBeGreaterThanOrEqual(
      previewWordCount(noSignalMetrics.morse!.text),
    );
    expectMorseGroupsSeparated(morseOnlyMetrics.morse!.text);

    await livePlayer.getByTestId("book-video-preview-fullscreen-button").click();
    const fullscreenOverlay = page.getByTestId(
      "book-video-preview-fullscreen-overlay",
    );
    await expect(fullscreenOverlay).toBeVisible();
    const fullscreenMetrics = await readPreviewLayerMetrics(
      fullscreenOverlay,
      "book-video-preview-fullscreen",
    );
    expectLayerInsideFrame(fullscreenMetrics, fullscreenMetrics.morse);
    expect(fullscreenMetrics.morse!.fontSize).toBeLessThanOrEqual(72);
    expectMorseGroupsSeparated(fullscreenMetrics.morse!.text);
    await page.getByRole("button", { name: "Exit fullscreen" }).click();
    await expect(page.getByTestId("book-video-preview-fullscreen-overlay")).toHaveCount(0);

    await expect(livePlayer.locator("[data-testid='book-video-full-frame-warning']")).toHaveCount(0);

    await saveScreenshot(page, testInfo, "morse-book-test-fixture-video-preview.png");
  });

  test("approved long book audio preview is capped", async ({
    page,
  }) => {
    await blockExternalNetwork(page);
    const response = await page.goto(APPROVED_BOOK_PUBLIC_PATH, {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBe(true);
    await waitForApprovedBookWorkspace(page);

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
  });

  test("shows ZIP batch language for split media without old bundle copy", async ({
    page,
  }) => {
    await openPreview(page);

    await expect(async () => {
      await page.getByRole("button", { name: "By duration" }).click();
      await expect(page.getByLabel(/Target part length/)).toBeVisible({
        timeout: 1_000,
      });
    }).toPass({ timeout: 10_000 });
    await page.getByLabel(/Target part length/).selectOption("15");
    await expect(page.getByRole("button", { name: "Download ZIP batch 1" })).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-zip-warning]")).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-split-warning]")).toBeVisible();

    await page.getByRole("button", { name: "No split" }).click();
    await expect(page.getByRole("button", { name: "Download ZIP batch 1" })).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-zip-warning]")).toBeVisible();
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
