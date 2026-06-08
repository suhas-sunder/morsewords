import fs from "node:fs";
import path from "node:path";

import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  CANONICAL_ROUTE_PATHS,
  REDIRECT_ALIASES,
  REDIRECT_ALIAS_PATHS,
  ROUTES,
  absoluteUrl,
  getCanonicalRoutePath,
  routeSlug,
} from "../../app/client/data/routes";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const THEME_STORAGE_KEY = "morsewords-theme";

const KEY_CANONICAL_ROUTES = [
  ROUTES.audio,
  ROUTES.audioDecoder,
  ROUTES.soundGenerator,
  ROUTES.mp3Generator,
  ROUTES.bookTranslator,
  ROUTES.printablePages,
  ROUTES.morseBooks,
  ROUTES.morseAudiobooks,
  ROUTES.videoGenerator,
  ROUTES.wordSeparator,
  ROUTES.timing,
  ROUTES.farnsworth,
] as const;

const KEY_ALIAS_EXPECTATIONS = [
  [ROUTES.ebookTranslatorAlias, ROUTES.bookTranslator],
  [ROUTES.textToMorseVideoAlias, ROUTES.videoGenerator],
] as const;

const INTERNAL_LINK_EXPECTATIONS = [
  {
    source: ROUTES.home,
    expected: [
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.printablePages,
      ROUTES.videoGenerator,
    ],
  },
  {
    source: ROUTES.audio,
    expected: [
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.audioDecoder,
      ROUTES.bookTranslator,
      ROUTES.printablePages,
      ROUTES.videoGenerator,
    ],
  },
  {
    source: ROUTES.soundGenerator,
    expected: [
      ROUTES.audio,
      ROUTES.mp3Generator,
      ROUTES.audioDecoder,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
      ROUTES.farnsworth,
    ],
  },
  {
    source: ROUTES.mp3Generator,
    expected: [
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.audioDecoder,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
      ROUTES.timing,
      ROUTES.farnsworth,
    ],
  },
  {
    source: ROUTES.audioDecoder,
    expected: [
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
      ROUTES.audioPractice,
      ROUTES.audioQuiz,
      ROUTES.timing,
      ROUTES.farnsworth,
    ],
  },
  {
    source: ROUTES.bookTranslator,
    expected: [
      ROUTES.audio,
      ROUTES.mp3Generator,
      ROUTES.videoGenerator,
      ROUTES.farnsworth,
      ROUTES.soundGenerator,
      ROUTES.wordSeparator,
    ],
  },
  {
    source: ROUTES.videoGenerator,
    expected: [
      ROUTES.bookTranslator,
      ROUTES.mp3Generator,
      ROUTES.soundGenerator,
      ROUTES.timing,
      ROUTES.farnsworth,
    ],
  },
  {
    source: ROUTES.wordSeparator,
    expected: [
      ROUTES.timing,
      ROUTES.farnsworth,
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
    ],
  },
  {
    source: ROUTES.timing,
    expected: [
      ROUTES.farnsworth,
      ROUTES.wordSeparator,
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
      ROUTES.audioPractice,
      ROUTES.audioDecoder,
    ],
  },
  {
    source: ROUTES.farnsworth,
    expected: [
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
      ROUTES.audioPractice,
      ROUTES.audioDecoder,
      ROUTES.timing,
    ],
  },
] as const;

type JsonLdRecord = Record<string, unknown>;
function routeFilePath(routePath: string) {
  const slug = routeSlug(routePath);
  return path.join(ROOT, "app", "routes", slug ? `${slug}.tsx` : "home.tsx");
}

function routeFileCandidates(routePath: string) {
  const slug = routeSlug(routePath);
  if (!slug) return [routeFilePath(routePath)];

  const parts = slug.split("/");
  if (parts.length === 1) return [routeFilePath(routePath)];

  if (parts[0] === "morse-code-books") {
    return [
      routeFilePath(routePath),
      path.join(ROOT, "app", "routes", "morse-code-books.$slug.tsx"),
    ];
  }

  if (parts[0] === "morse-code-audiobooks") {
    return [
      routeFilePath(routePath),
      path.join(ROOT, "app", "routes", "morse-code-audiobooks.$slug.tsx"),
    ];
  }

  return [
    routeFilePath(routePath),
    path.join(
      ROOT,
      "app",
      "routes",
      parts[0],
      `${parts[0]}.${parts.slice(1).join(".")}.tsx`,
    ),
  ];
}

function routeFileExists(routePath: string) {
  return routeFileCandidates(routePath).some((candidate) =>
    fs.existsSync(candidate),
  );
}

async function pageLinkPaths(page: Page, selector = "a[href]") {
  return page.locator(selector).evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const href = (anchor as HTMLAnchorElement).getAttribute("href") ?? "";
      return new URL(href, window.location.href).pathname.replace(/\/$/, "") || "/";
    }),
  );
}

async function parsePageJsonLd(page: Page) {
  return page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script, index) => {
        const text = script.textContent?.trim() ?? "";
        if (!text) throw new Error(`JSON-LD script ${index + 1} is empty`);
        return JSON.parse(text) as unknown;
      }),
    );
}

function flattenJsonLd(value: unknown): JsonLdRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return [
    record,
    ...flattenJsonLd(record["@graph"]),
    ...flattenJsonLd(record.mainEntity),
    ...flattenJsonLd(record.itemListElement),
    ...flattenJsonLd(record.breadcrumb),
    ...flattenJsonLd(record.offers),
    ...flattenJsonLd(record.isPartOf),
  ];
}

function schemaTypes(record: JsonLdRecord) {
  const type = record["@type"];
  if (Array.isArray(type)) {
    return type.filter((item): item is string => typeof item === "string");
  }
  return typeof type === "string" ? [type] : [];
}

function hasSchemaType(record: JsonLdRecord, type: string) {
  return schemaTypes(record).includes(type);
}

function itemName(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const name = (value as JsonLdRecord).name;
  return typeof name === "string" ? name : "";
}

function assertNoAliasReferences(records: JsonLdRecord[], routePath: string) {
  const schemaText = JSON.stringify(records);

  for (const aliasPath of REDIRECT_ALIAS_PATHS) {
    expect(
      schemaText,
      `${routePath} JSON-LD should not reference redirect alias ${aliasPath}`,
    ).not.toContain(aliasPath);
  }
}

function assertNoUntrustedCommercialClaims(value: unknown, routePath: string) {
  if (Array.isArray(value)) {
    value.forEach((item) => assertNoUntrustedCommercialClaims(item, routePath));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value as JsonLdRecord)) {
    expect(
      ["aggregateRating", "review", "reviewRating", "ratingValue"],
      `${routePath} should not include review or rating schema field ${key}`,
    ).not.toContain(key);

    if (key === "price") {
      expect(
        ["0", 0, "0.00"],
        `${routePath} price schema should only describe a free tool`,
      ).toContain(child);
    }

    assertNoUntrustedCommercialClaims(child, routePath);
  }
}

async function visibleFaqQuestions(page: Page) {
  return page.locator("section").evaluateAll((sections) =>
    sections.flatMap((section) => {
      const eyebrow = section.querySelector(".mw-eyebrow-text");
      if (eyebrow?.textContent?.trim() !== "FAQ") return [];

      return [...section.querySelectorAll("details summary")]
        .map((summary) => summary.textContent?.trim().replace(/\s+/g, " ") ?? "")
        .filter(Boolean);
    }),
  );
}

async function assertCanonicalMetadata(page: Page, routePath: string) {
  const canonical = absoluteUrl(routePath);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    canonical,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonical,
  );
  await expect.poll(() => page.title()).not.toBe("");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /.+/,
  );
}

async function contrastForLocator(locator: Locator, label: string) {
  return locator.evaluate((element, readableLabel) => {
    type RuntimeColorChannels = {
      r: number;
      g: number;
      b: number;
      a: number;
    };

    function parseRuntimeColor(value: string): RuntimeColorChannels | null {
      const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/);
      if (rgbMatch) {
        const parts = rgbMatch[1]
          .split(",")
          .map((part) => Number.parseFloat(part.trim()));
        return {
          r: parts[0],
          g: parts[1],
          b: parts[2],
          a: parts.length > 3 ? parts[3] : 1,
        };
      }

      const colorFunctionMatch = value.match(
        /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/,
      );
      if (!colorFunctionMatch) return null;

      return {
        r: Number(colorFunctionMatch[1]) * 255,
        g: Number(colorFunctionMatch[2]) * 255,
        b: Number(colorFunctionMatch[3]) * 255,
        a: colorFunctionMatch[4] ? Number(colorFunctionMatch[4]) : 1,
      };
    }

    function blend(
      foreground: RuntimeColorChannels,
      background: RuntimeColorChannels,
    ) {
      const alpha = foreground.a + background.a * (1 - foreground.a);
      if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };

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

    function effectiveBackground(node: Element) {
      let background: RuntimeColorChannels = { r: 0, g: 0, b: 0, a: 0 };
      for (let current: Element | null = node; current; current = current.parentElement) {
        const parsed = parseRuntimeColor(window.getComputedStyle(current).backgroundColor);
        if (parsed) background = blend(background, parsed);
        if (background.a > 0.985) return background;
      }

      const bodyBackground =
        parseRuntimeColor(window.getComputedStyle(document.body).backgroundColor) ??
        { r: 7, g: 17, b: 31, a: 1 };
      return blend(background, bodyBackground);
    }

    function relativeLuminance(color: RuntimeColorChannels) {
      return [color.r, color.g, color.b]
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.03928
            ? channel / 12.92
            : Math.pow((channel + 0.055) / 1.055, 2.4);
        })
        .reduce((sum, channel, index) => {
          return sum + channel * [0.2126, 0.7152, 0.0722][index];
        }, 0);
    }

    function contrastRatio(
      foreground: RuntimeColorChannels,
      background: RuntimeColorChannels,
    ) {
      const foregroundLuminance = relativeLuminance(foreground);
      const backgroundLuminance = relativeLuminance(background);
      const light = Math.max(foregroundLuminance, backgroundLuminance);
      const dark = Math.min(foregroundLuminance, backgroundLuminance);
      return (light + 0.05) / (dark + 0.05);
    }

    const styles = window.getComputedStyle(element);
    const foreground = parseRuntimeColor(styles.color);
    if (!foreground) throw new Error(`Could not parse ${styles.color}`);

    const background = effectiveBackground(element);
    const text =
      element.getAttribute("aria-label") ??
      element.textContent?.trim().replace(/\s+/g, " ") ??
      element.tagName;

    return {
      background: `rgb(${Math.round(background.r)}, ${Math.round(background.g)}, ${Math.round(background.b)})`,
      color: styles.color,
      label: readableLabel,
      ratio: contrastRatio(foreground, background),
      text,
    };
  }, label);
}

async function expectReadable(locator: Locator, label: string, minimumRatio = 4.5) {
  await expect(locator).toBeVisible();
  await locator.scrollIntoViewIfNeeded();
  await locator.hover();

  const result = await contrastForLocator(locator, label);
  expect(
    result.ratio,
    `${label} contrast ${result.ratio.toFixed(2)} for "${result.text}" (${result.color} on ${result.background})`,
  ).toBeGreaterThanOrEqual(minimumRatio);
}

async function installDarkMode(page: Page) {
  await page.addInitScript((themeStorageKey) => {
    window.localStorage.setItem(themeStorageKey, "dark");
    document.documentElement.dataset.theme = "dark";
  }, THEME_STORAGE_KEY);
}

async function gotoRoute(page: Page, routePath: string) {
  await page.goto(routePath, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
}

test.describe("final SEO schema sitemap and internal link audit", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("keeps canonical route registry and redirect aliases separated", async ({
    request,
  }) => {
    for (const routePath of KEY_CANONICAL_ROUTES) {
      expect(CANONICAL_ROUTE_PATHS, `${routePath} canonical registry`).toContain(
        routePath,
      );
      expect(
        REDIRECT_ALIASES[routePath as keyof typeof REDIRECT_ALIASES],
        `${routePath} must not be a redirect alias`,
      ).toBeUndefined();
      expect(fs.existsSync(routeFilePath(routePath)), `${routePath} route file`).toBe(
        true,
      );
      expect(getCanonicalRoutePath(routePath), `${routePath} canonical lookup`).toBe(
        routePath,
      );
    }

    for (const [aliasPath, canonicalPath] of KEY_ALIAS_EXPECTATIONS) {
      expect(REDIRECT_ALIAS_PATHS, `${aliasPath} alias registry`).toContain(
        aliasPath,
      );
      expect(REDIRECT_ALIASES[aliasPath], `${aliasPath} canonical target`).toBe(
        canonicalPath,
      );
      expect(getCanonicalRoutePath(aliasPath), `${aliasPath} canonical lookup`).toBe(
        canonicalPath,
      );
      expect(CANONICAL_ROUTE_PATHS, `${aliasPath} not canonical`).not.toContain(
        aliasPath,
      );

      const source = fs.readFileSync(routeFilePath(aliasPath), "utf8");
      expect(source, `${aliasPath} route uses shared redirect loader`).toContain(
        "makeRedirectAliasLoader",
      );

      const response = await request.get(aliasPath, { maxRedirects: 0 });
      expect(response.status(), `${aliasPath} redirect status`).toBe(301);
      expect(response.headers().location, `${aliasPath} redirect target`).toBe(
        canonicalPath,
      );
      expect(await response.text(), `${aliasPath} does not render JSON-LD`).not.toContain(
        "application/ld+json",
      );
    }
  });

  test("XML sitemap lists target canonicals and excludes redirect aliases", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const sitemapPaths = locs.map(
      (loc) => new URL(loc).pathname.replace(/\/$/, "") || "/",
    );

    expect(new Set(locs).size, "XML sitemap duplicate locs").toBe(locs.length);
    expect(new Set(sitemapPaths).size, "XML sitemap duplicate paths").toBe(
      sitemapPaths.length,
    );
    for (const loc of locs) {
      expect(loc, `canonical host for ${loc}`).toMatch(/^https:\/\/www\.morsewords\.com\//);
    }
    for (const routePath of sitemapPaths) {
      expect(getCanonicalRoutePath(routePath), `${routePath} is canonical`).toBe(
        routePath,
      );
      expect(routeFileExists(routePath), `${routePath} XML sitemap route file`).toBe(
        true,
      );
    }
    for (const routePath of KEY_CANONICAL_ROUTES) {
      expect(locs, `${routePath} XML sitemap loc`).toContain(absoluteUrl(routePath));
    }
    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(locs, `${aliasPath} absent from XML sitemap`).not.toContain(
        absoluteUrl(aliasPath),
      );
    }
    for (const lastmod of [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(
      (match) => match[1],
    )) {
      expect(lastmod, `lastmod date ${lastmod}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test("HTML sitemap metadata, links, and schema stay canonical and crawlable", async ({
    page,
  }) => {
    await gotoRoute(page, ROUTES.sitemap);
    await assertCanonicalMetadata(page, ROUTES.sitemap);

    const links = await page.locator("main a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => {
        const element = anchor as HTMLAnchorElement;
        return {
          path: new URL(element.getAttribute("href") ?? "", window.location.href)
            .pathname,
          text: element.textContent?.trim().replace(/\s+/g, " ") ?? "",
        };
      }),
    );
    const linkPaths = links.map((link) => link.path);

    for (const routePath of KEY_CANONICAL_ROUTES) {
      expect(linkPaths, `${routePath} HTML sitemap link`).toContain(routePath);
      const link = links.find((item) => item.path === routePath);
      expect(link?.text.length ?? 0, `${routePath} link has description text`).toBeGreaterThan(
        40,
      );
    }
    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(linkPaths, `${aliasPath} absent from HTML sitemap`).not.toContain(
        aliasPath,
      );
    }

    const jsonLd = await parsePageJsonLd(page);
    const records = jsonLd.flatMap(flattenJsonLd);
    const schemaText = JSON.stringify(records);
    for (const routePath of KEY_CANONICAL_ROUTES) {
      expect(schemaText, `${routePath} HTML sitemap schema URL`).toContain(
        absoluteUrl(routePath),
      );
    }
    assertNoAliasReferences(records, ROUTES.sitemap);
  });

  test("target pages keep canonical metadata and conservative JSON-LD", async ({
    page,
  }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const routePath of KEY_CANONICAL_ROUTES) {
      await gotoRoute(page, routePath);
      await assertCanonicalMetadata(page, routePath);

      const title = await page.title();
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(titles, `${routePath} unique title`).not.toContain(title);
      expect(descriptions, `${routePath} unique description`).not.toContain(
        description,
      );
      titles.add(title ?? "");
      descriptions.add(description ?? "");

      const parsedJsonLd = await parsePageJsonLd(page);
      const records = parsedJsonLd.flatMap(flattenJsonLd);
      const schemaText = JSON.stringify(records);
      expect(schemaText, `${routePath} schema canonical URL`).toContain(
        absoluteUrl(routePath),
      );
      expect(schemaText, `${routePath} schema canonical host`).not.toContain(
        "https://morsewords.com",
      );
      assertNoAliasReferences(records, routePath);
      assertNoUntrustedCommercialClaims(parsedJsonLd, routePath);

      const breadcrumbLists = records.filter((record) =>
        hasSchemaType(record, "BreadcrumbList"),
      );
      expect(
        breadcrumbLists.length,
        `${routePath} duplicate BreadcrumbList schema`,
      ).toBeLessThanOrEqual(1);

      const faqPages = records.filter((record) => hasSchemaType(record, "FAQPage"));
      expect(faqPages.length, `${routePath} duplicate FAQPage schema`).toBeLessThanOrEqual(
        1,
      );
      if (faqPages.length === 0) continue;

      const visibleQuestions = await visibleFaqQuestions(page);
      expect(visibleQuestions.length, `${routePath} visible FAQ questions`).toBeGreaterThan(
        0,
      );

      const schemaQuestions = (
        (faqPages[0].mainEntity as JsonLdRecord[] | undefined) ?? []
      ).map(itemName);
      expect(new Set(schemaQuestions).size, `${routePath} duplicate FAQ schema`).toBe(
        schemaQuestions.length,
      );

      for (const question of schemaQuestions) {
        expect(
          visibleQuestions.some((visible) => visible.includes(question)),
          `${routePath} visible FAQ includes schema question: ${question}`,
        ).toBe(true);
      }
    }
  });

  test("internal links use canonical destinations and keep the target cluster connected", async ({
    page,
  }) => {
    for (const { source, expected } of INTERNAL_LINK_EXPECTATIONS) {
      await gotoRoute(page, source);
      const paths = await pageLinkPaths(page);

      for (const routePath of expected) {
        expect(paths, `${source} links to ${routePath}`).toContain(routePath);
      }
      for (const aliasPath of REDIRECT_ALIAS_PATHS) {
        expect(paths, `${source} avoids redirect alias ${aliasPath}`).not.toContain(
          aliasPath,
        );
      }
    }
  });

  test("dark mode navigation, sitemap, FAQ, and toolkit links stay readable", async ({
    page,
  }, testInfo) => {
    await installDarkMode(page);
    await gotoRoute(page, ROUTES.home);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    const desktopMoreButton = page.getByRole("button", { name: /^More$/ });
    if (await desktopMoreButton.isVisible().catch(() => false)) {
      const dialog = page.getByRole("dialog", {
        name: "More MorseWords tools",
      });
      await expect(async () => {
        await desktopMoreButton.click();
        await expect(dialog).toBeVisible({ timeout: 1_000 });
      }).toPass({ timeout: 10_000 });
      await expect(dialog).toBeVisible();
      await expectReadable(
        dialog.locator(`a[href="${ROUTES.videoGenerator}"]`),
        `${testInfo.project.name} More menu video link`,
      );
    } else {
      const mobileButton = page.getByRole("button", { name: "Open navigation" });
      const mobileDialog = page.getByRole("dialog", {
        name: "Mobile navigation",
      });
      await expect(async () => {
        await mobileButton.click();
        await expect(mobileDialog).toBeVisible({ timeout: 1_000 });
      }).toPass({ timeout: 10_000 });
      const mobileNav = mobileDialog.locator("#mobile-nav");
      await expect(mobileNav).toBeVisible();
      await expectReadable(
        mobileNav.locator(`a[href="${ROUTES.videoGenerator}"]`),
        `${testInfo.project.name} mobile video link`,
      );
    }

    await gotoRoute(page, ROUTES.sitemap);
    await expectReadable(
      page.locator(`main a[href="${ROUTES.bookTranslator}"]`).first(),
      `${testInfo.project.name} sitemap book link`,
    );

    await gotoRoute(page, ROUTES.audio);
    await expectReadable(
      page.locator("#morse-code-navigation .mw-related-tool-link").first(),
      `${testInfo.project.name} audio toolkit link`,
    );

    await gotoRoute(page, ROUTES.farnsworth);
    const faqSummary = page.locator("main .mw-faq-trigger").first();
    await faqSummary.click();
    await expectReadable(
      faqSummary,
      `${testInfo.project.name} Farnsworth open FAQ trigger`,
    );

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(
      overflow.scrollWidth,
      `${testInfo.project.name} dark route has no horizontal overflow`,
    ).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test("canonical route pages avoid horizontal overflow on mobile", async ({
    page,
  }, testInfo) => {
    test.skip(
      !testInfo.project.name.includes("mobile"),
      "Mobile overflow guard runs in the mobile project.",
    );

    for (const routePath of KEY_CANONICAL_ROUTES) {
      await gotoRoute(page, routePath);
      const overflow = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        overflow.scrollWidth,
        `${routePath} mobile width`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
    }
  });
});
