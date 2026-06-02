import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  CANONICAL_ROUTE_PATHS,
  REDIRECT_ALIASES,
  ROUTES,
  absoluteUrl,
} from "../../app/client/data/routes";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const THEME_STORAGE_KEY = "morsewords-theme";

const NEW_CANONICAL_ROUTES = [
  ROUTES.bookTranslator,
  ROUTES.videoGenerator,
] as const;

const NEW_ALIAS_ROUTES = [
  ROUTES.ebookTranslatorAlias,
  ROUTES.textToMorseVideoAlias,
] as const;

const CONTEXTUAL_LINK_EXPECTATIONS = [
  {
    source: ROUTES.audio,
    expected: [ROUTES.bookTranslator, ROUTES.videoGenerator, ROUTES.mp3Generator],
  },
  {
    source: ROUTES.soundGenerator,
    expected: [ROUTES.bookTranslator, ROUTES.videoGenerator, ROUTES.audio],
  },
  {
    source: ROUTES.mp3Generator,
    expected: [ROUTES.bookTranslator, ROUTES.videoGenerator, ROUTES.audio],
  },
  {
    source: ROUTES.audioDecoder,
    expected: [ROUTES.soundGenerator, ROUTES.mp3Generator, ROUTES.reader],
  },
  {
    source: ROUTES.reader,
    expected: [ROUTES.bookTranslator, ROUTES.encoder, ROUTES.audioDecoder],
  },
  {
    source: ROUTES.test,
    expected: [ROUTES.bookTranslator, ROUTES.wordTrainer, ROUTES.audioPractice],
  },
  {
    source: ROUTES.timing,
    expected: [ROUTES.bookTranslator, ROUTES.soundGenerator, ROUTES.audio],
  },
  {
    source: ROUTES.farnsworth,
    expected: [ROUTES.bookTranslator, ROUTES.soundGenerator, ROUTES.audio],
  },
  {
    source: ROUTES.bookTranslator,
    expected: [ROUTES.videoGenerator, ROUTES.mp3Generator, ROUTES.audio],
  },
  {
    source: ROUTES.videoGenerator,
    expected: [ROUTES.bookTranslator, ROUTES.mp3Generator, ROUTES.soundGenerator],
  },
] as const;

async function linkPathnames(page: Page) {
  return page.locator("a[href]").evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const href = (anchor as HTMLAnchorElement).getAttribute("href") ?? "";
      return new URL(href, window.location.origin).pathname;
    }),
  );
}

async function jsonLdText(page: Page) {
  return page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? "").join("\n"),
    );
}

function parseRgbTriplet(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;

  const channels = match[1]
    .split(",")
    .slice(0, 3)
    .map((part) => Number.parseFloat(part.trim()));

  return channels.length === 3 && channels.every(Number.isFinite)
    ? channels
    : null;
}

function relativeLuminance(rgb: number[]) {
  return rgb
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    })
    .reduce(
      (sum, channel, index) =>
        sum + channel * ([0.2126, 0.7152, 0.0722][index] ?? 0),
      0,
    );
}

function contrastRatio(foreground: string, background: string) {
  const foregroundRgb = parseRgbTriplet(foreground);
  const backgroundRgb = parseRgbTriplet(background);
  expect(foregroundRgb, `foreground ${foreground}`).not.toBeNull();
  expect(backgroundRgb, `background ${background}`).not.toBeNull();

  const foregroundLuminance = relativeLuminance(foregroundRgb as number[]);
  const backgroundLuminance = relativeLuminance(backgroundRgb as number[]);
  const light = Math.max(foregroundLuminance, backgroundLuminance);
  const dark = Math.min(foregroundLuminance, backgroundLuminance);

  return (light + 0.05) / (dark + 0.05);
}

async function readableColors(locator: Locator) {
  const colors = await locator.evaluate((element) => {
    function visibleBackground(node: Element | null) {
      let current: Element | null = node;

      while (current) {
        const backgroundColor = window.getComputedStyle(current).backgroundColor;
        if (!backgroundColor.endsWith(", 0)") && backgroundColor !== "transparent") {
          return backgroundColor;
        }
        current = current.parentElement;
      }

      return window.getComputedStyle(document.body).backgroundColor;
    }

    return {
      color: window.getComputedStyle(element).color,
      backgroundColor: visibleBackground(element),
    };
  });

  expect(contrastRatio(colors.color, colors.backgroundColor)).toBeGreaterThanOrEqual(
    4.5,
  );
}

test.describe("book and video route sitemap and interlinking", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("route registry and aliases keep canonical routes separate", async ({
    request,
  }) => {
    for (const routePath of NEW_CANONICAL_ROUTES) {
      expect(CANONICAL_ROUTE_PATHS).toContain(routePath);
      expect(REDIRECT_ALIASES[routePath as keyof typeof REDIRECT_ALIASES]).toBeUndefined();
    }

    for (const aliasPath of NEW_ALIAS_ROUTES) {
      const canonicalPath = REDIRECT_ALIASES[aliasPath];
      expect(NEW_CANONICAL_ROUTES).toContain(canonicalPath);
      expect(CANONICAL_ROUTE_PATHS).not.toContain(aliasPath);

      const response = await request.get(aliasPath, { maxRedirects: 0 });
      expect(response.status(), `${aliasPath} redirect status`).toBe(301);
      expect(response.headers().location, `${aliasPath} target`).toBe(
        canonicalPath,
      );
    }
  });

  test("XML and HTML sitemaps expose canonical book and video routes only", async ({
    page,
    request,
  }) => {
    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();

    for (const routePath of NEW_CANONICAL_ROUTES) {
      expect(xml, `${routePath} XML sitemap entry`).toContain(
        absoluteUrl(routePath),
      );
    }

    for (const aliasPath of NEW_ALIAS_ROUTES) {
      expect(xml, `${aliasPath} absent from XML sitemap`).not.toContain(
        absoluteUrl(aliasPath),
      );
    }

    await page.goto(ROUTES.sitemap, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const htmlLinks = await linkPathnames(page);
    for (const routePath of NEW_CANONICAL_ROUTES) {
      expect(htmlLinks, `${routePath} HTML sitemap link`).toContain(routePath);
      await expect(page.locator(`main a[href="${routePath}"]`).first()).toBeVisible();
    }

    for (const aliasPath of NEW_ALIAS_ROUTES) {
      expect(htmlLinks, `${aliasPath} absent from HTML sitemap`).not.toContain(
        aliasPath,
      );
    }

    const sitemapSchema = await jsonLdText(page);
    for (const routePath of NEW_CANONICAL_ROUTES) {
      expect(sitemapSchema, `${routePath} sitemap schema URL`).toContain(
        absoluteUrl(routePath),
      );
    }
    for (const aliasPath of NEW_ALIAS_ROUTES) {
      expect(sitemapSchema, `${aliasPath} absent from sitemap schema`).not.toContain(
        absoluteUrl(aliasPath),
      );
    }
  });

  test("home toolkit and More menu surface canonical audio/export tools", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(ROUTES.home, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const homeLinks = await linkPathnames(page);
    for (const routePath of [
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
    ]) {
      expect(homeLinks, `${routePath} linked from home toolkit`).toContain(
        routePath,
      );
    }
    for (const aliasPath of NEW_ALIAS_ROUTES) {
      expect(homeLinks, `${aliasPath} absent from home`).not.toContain(aliasPath);
    }

    await page.getByRole("button", { name: /^More$/ }).click();
    const dialog = page.getByRole("dialog", { name: "More MorseWords tools" });
    await expect(dialog).toBeVisible();

    const moreMenuLinks = await dialog.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) =>
        new URL(
          (anchor as HTMLAnchorElement).getAttribute("href") ?? "",
          window.location.origin,
        ).pathname,
      ),
    );
    for (const routePath of [
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
    ]) {
      expect(moreMenuLinks, `${routePath} More menu link`).toContain(routePath);
    }
    for (const aliasPath of NEW_ALIAS_ROUTES) {
      expect(moreMenuLinks, `${aliasPath} absent from More menu`).not.toContain(
        aliasPath,
      );
    }
  });

  test("contextual pages link to canonical export routes without alias leakage", async ({
    page,
  }) => {
    for (const { source, expected } of CONTEXTUAL_LINK_EXPECTATIONS) {
      await page.goto(source, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      const pageLinks = await linkPathnames(page);
      for (const routePath of expected) {
        expect(pageLinks, `${source} links to ${routePath}`).toContain(routePath);
      }
      for (const aliasPath of NEW_ALIAS_ROUTES) {
        expect(pageLinks, `${source} avoids ${aliasPath}`).not.toContain(aliasPath);
      }
    }
  });

  test("book and video metadata, schema, and FAQ remain canonical", async ({
    page,
  }) => {
    for (const [routePath, aliasPath] of [
      [ROUTES.bookTranslator, ROUTES.ebookTranslatorAlias],
      [ROUTES.videoGenerator, ROUTES.textToMorseVideoAlias],
    ] as const) {
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        absoluteUrl(routePath),
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        absoluteUrl(routePath),
      );

      const schema = await jsonLdText(page);
      expect(schema, `${routePath} schema canonical URL`).toContain(
        absoluteUrl(routePath),
      );
      expect(schema, `${routePath} schema excludes alias`).not.toContain(
        absoluteUrl(aliasPath),
      );
      expect(schema.match(/"@type":"FAQPage"/g) ?? []).toHaveLength(1);
    }
  });

  test("new dark-mode link and hover states stay readable", async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
    }, THEME_STORAGE_KEY);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(ROUTES.home, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: /^More$/ }).click();
    const dialog = page.getByRole("dialog", { name: "More MorseWords tools" });
    const videoNavLink = dialog.locator(`a[href="${ROUTES.videoGenerator}"]`);
    await expect(videoNavLink).toBeVisible();
    await videoNavLink.hover();
    await readableColors(videoNavLink);

    await page.goto(ROUTES.mp3Generator, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const bookLink = page.locator(`main a[href="${ROUTES.bookTranslator}"]`).first();
    await expect(bookLink).toBeVisible();
    await bookLink.hover();
    await readableColors(bookLink);
  });
});
