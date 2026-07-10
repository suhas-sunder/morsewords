import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  REDIRECT_ALIASES,
  REDIRECT_ALIAS_PATHS,
  ROUTES,
  absoluteUrl,
  getCanonicalRoutePath,
  routeSlug,
} from "../../app/client/data/routes";
import {
  APP_ROUTES,
  CANONICAL_SMOKE_ROUTES,
  ROUTE_SMOKE_GROUPS,
  blockExternalNetwork,
  waitForRouteReady,
} from "./helpers";

const ROOT = process.cwd();

const CRITICAL_ALIAS_EXPECTATIONS = [
  [ROUTES.translatorAlias, ROUTES.home],
  [ROUTES.morseCodeConverterAlias, ROUTES.home],
  [ROUTES.typingTestAlias, ROUTES.typing],
  [ROUTES.wordGameAlias, ROUTES.wordTrainer],
  [ROUTES.dictionaryAlias, ROUTES.dictionary],
] as const;

const QUERY_PRESERVING_ALIAS_EXPECTATIONS = [
  [
    ROUTES.textToMorseAlias,
    ROUTES.encoder,
    "?text=sos&utm_source=test",
  ],
  [ROUTES.morseToTextAlias, ROUTES.decoder, "?morse=...---..."],
  [ROUTES.morseCodeAudioAlias, ROUTES.audio, "?text=sos"],
] as const;

const REPRESENTATIVE_CANONICAL_PATHS = [
  ROUTES.home,
  ROUTES.dictionary,
  ROUTES.wordTrainer,
  ROUTES.test,
  ROUTES.audio,
  ROUTES.audioDecoder,
] as const;

const FOOTER_PATHS = [
  ROUTES.about,
  ROUTES.contact,
  ROUTES.sitemap,
  ROUTES.sources,
  ROUTES.miscSocials,
  ROUTES.privacy,
  ROUTES.terms,
  ROUTES.cookies,
] as const;

function readRepoFile(filePath: string) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function routeFilePath(routePath: string) {
  return path.join(ROOT, "app", "routes", `${routeSlug(routePath)}.tsx`);
}

function sitemapLocs(xml: string) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function canonicalUrlsInText(text: string) {
  return [...text.matchAll(/https:\/\/www\.morsewords\.com[^"\\\s<]*/g)].map(
    (match) => match[0],
  );
}

test.describe("route registry source of truth", () => {
  test("keeps the primary Morse code translator alias on the homepage", () => {
    expect(REDIRECT_ALIASES[ROUTES.translatorAlias]).toBe(ROUTES.home);
    expect(REDIRECT_ALIASES[ROUTES.translatorAlias]).not.toBe(
      ROUTES.internationalTranslator,
    );
  });

  test("keeps the broad Morse code converter alias on the homepage", () => {
    expect(REDIRECT_ALIASES[ROUTES.morseCodeConverterAlias]).toBe(ROUTES.home);
    expect(REDIRECT_ALIASES[ROUTES.morseCodeConverterAlias]).not.toBe(
      ROUTES.encoder,
    );
    expect(REDIRECT_ALIASES[ROUTES.morseCodeConverterAlias]).not.toBe(
      ROUTES.internationalTranslator,
    );
  });

  test("keeps critical aliases explicit and prevents alias chains", () => {
    for (const [aliasPath, canonicalPath] of CRITICAL_ALIAS_EXPECTATIONS) {
      expect(REDIRECT_ALIASES[aliasPath], aliasPath).toBe(canonicalPath);
      expect(getCanonicalRoutePath(aliasPath), aliasPath).toBe(canonicalPath);
    }

    for (const [aliasPath, canonicalPath] of Object.entries(REDIRECT_ALIASES)) {
      expect(aliasPath, `${aliasPath} is not self-referential`).not.toBe(
        canonicalPath,
      );
      expect(
        REDIRECT_ALIASES[canonicalPath as keyof typeof REDIRECT_ALIASES],
        `${aliasPath} does not point at another alias`,
      ).toBeUndefined();
      expect(fs.existsSync(routeFilePath(aliasPath)), `${aliasPath} route file`).toBe(
        true,
      );
    }
  });

  test("redirect modules read targets from the registry map", () => {
    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      const source = readRepoFile(
        path.join("app", "routes", `${routeSlug(aliasPath)}.tsx`),
      );

      expect(source, aliasPath).toContain("makeRedirectAliasLoader");
      expect(source, aliasPath).toContain("ROUTES.");
      expect(source, aliasPath).not.toMatch(/redirect\(\s*["']/);
    }
  });

  test("test route smoke groups cover canonical and alias routes without duplicates", () => {
    const groupedRoutes = Object.values(ROUTE_SMOKE_GROUPS).flat();

    expect(new Set(groupedRoutes).size, "smoke route duplicates").toBe(
      groupedRoutes.length,
    );
    expect(APP_ROUTES, "exported smoke route order").toEqual(groupedRoutes);

    for (const routePath of CANONICAL_SMOKE_ROUTES) {
      expect(APP_ROUTES, `${routePath} canonical smoke coverage`).toContain(
        routePath,
      );
    }

    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(APP_ROUTES, `${aliasPath} alias smoke coverage`).toContain(aliasPath);
    }
  });

  test("public sitemap and robots use canonical URLs and exclude aliases", async ({
    request,
  }) => {
    const response = await request.get(ROUTES.sitemap + ".xml");
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    const locs = sitemapLocs(xml);
    const robotsResponse = await request.get("/robots.txt");
    expect(robotsResponse.ok()).toBe(true);
    const robots = await robotsResponse.text();

    expect(robots).toContain(`Sitemap: ${absoluteUrl("/sitemap.xml")}`);

    for (const routePath of REPRESENTATIVE_CANONICAL_PATHS) {
      expect(xml, `${routePath} is present`).toContain(absoluteUrl(routePath));
    }

    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(locs, `${aliasPath} stays out of XML sitemap`).not.toContain(
        absoluteUrl(aliasPath),
      );
    }
  });

  test("HTML sitemap metadata, schema URLs, and links stay canonical", async ({
    page,
  }) => {
    await blockExternalNetwork(page);
    await page.goto(ROUTES.sitemap, { waitUntil: "domcontentloaded" });

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      absoluteUrl(ROUTES.sitemap),
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      absoluteUrl(ROUTES.sitemap),
    );

    const linkPaths = await page.locator("main a[href]").evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute("href") ?? ""),
    );
    for (const routePath of [
      ROUTES.dictionary,
      ROUTES.wordTrainer,
      ROUTES.test,
    ]) {
      expect(linkPaths, `${routePath} HTML sitemap link`).toContain(routePath);
    }
    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(linkPaths, `${aliasPath} absent from HTML sitemap`).not.toContain(
        aliasPath,
      );
    }

    const jsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? "").join("\n"),
      );
    const jsonLdUrls = canonicalUrlsInText(jsonLdText);

    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(jsonLdUrls, `${aliasPath} absent from sitemap JSON-LD`).not.toContain(
        absoluteUrl(aliasPath),
      );
    }
  });

  test("home navigation, route cards, and footer link canonical paths", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await blockExternalNetwork(page);
    await page.goto(ROUTES.home, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const pageHrefPaths = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) =>
        new URL((anchor as HTMLAnchorElement).href).pathname,
      ),
    );

    for (const routePath of [
      ROUTES.dictionary,
      ROUTES.wordTrainer,
      ROUTES.audio,
      ROUTES.printableChart,
    ]) {
      expect(pageHrefPaths, `${routePath} appears on home surfaces`).toContain(
        routePath,
      );
    }
    for (const footerPath of FOOTER_PATHS) {
      await expect(page.locator(`footer a[href="${footerPath}"]`)).toBeVisible();
    }
    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(pageHrefPaths, `${aliasPath} is not linked from home`).not.toContain(
        aliasPath,
      );
    }

    const moreButton = page.getByRole("button", { name: /^More$/ });
    const dialog = page.getByRole("dialog", { name: "More MorseWords tools" });
    await expect(async () => {
      await moreButton.click();
      await expect(dialog).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 10_000 });

    const moreMenuPaths = await dialog.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) =>
        new URL(
          (anchor as HTMLAnchorElement).getAttribute("href") ?? "",
          window.location.href,
        ).pathname,
      ),
    );

    for (const routePath of [
      ROUTES.dictionary,
      ROUTES.wordTrainer,
      ROUTES.encoder,
      ROUTES.decoder,
      ROUTES.wordSearchBuilder,
    ]) {
      expect(moreMenuPaths, `${routePath} appears in More menu`).toContain(
        routePath,
      );
    }
    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(moreMenuPaths, `${aliasPath} is not linked from More menu`).not.toContain(
        aliasPath,
      );
    }
  });

  test("legacy aliases redirect to registry canonical destinations", async ({
    request,
  }) => {
    test.setTimeout(120_000);

    for (const [aliasPath, canonicalPath] of Object.entries(REDIRECT_ALIASES)) {
      const response = await request.get(aliasPath, { maxRedirects: 0 });

      expect(response.status(), `${aliasPath} status`).toBe(301);
      expect(response.headers().location, `${aliasPath} location`).toBe(
        canonicalPath,
      );
    }
  });

  test("legacy aliases preserve query strings when redirecting", async ({
    request,
  }) => {
    for (const [
      aliasPath,
      canonicalPath,
      search,
    ] of QUERY_PRESERVING_ALIAS_EXPECTATIONS) {
      const response = await request.get(`${aliasPath}${search}`, {
        maxRedirects: 0,
      });

      expect(response.status(), `${aliasPath}${search} status`).toBe(301);
      expect(response.headers().location, `${aliasPath}${search} location`).toBe(
        `${canonicalPath}${search}`,
      );
    }
  });
});
