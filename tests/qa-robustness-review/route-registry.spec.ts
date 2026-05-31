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
import { blockExternalNetwork } from "./helpers";

const ROOT = process.cwd();

const CRITICAL_ALIAS_EXPECTATIONS = [
  [ROUTES.typingTestAlias, ROUTES.test],
  [ROUTES.wordGameAlias, ROUTES.wordTrainer],
  [ROUTES.dictionaryAlias, ROUTES.dictionary],
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
  ROUTES.miscPrivacy,
  ROUTES.miscTerms,
  ROUTES.miscCookies,
] as const;

function readRepoFile(filePath: string) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function routeFilePath(routePath: string) {
  return path.join(ROOT, "app", "routes", `${routeSlug(routePath)}.tsx`);
}

test.describe("route registry source of truth", () => {
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

  test("public sitemap and robots use canonical URLs and exclude aliases", async ({
    request,
  }) => {
    const response = await request.get(ROUTES.sitemap + ".xml");
    expect(response.ok()).toBe(true);
    const xml = await response.text();
    const robotsResponse = await request.get("/robots.txt");
    expect(robotsResponse.ok()).toBe(true);
    const robots = await robotsResponse.text();

    expect(robots).toContain(`Sitemap: ${absoluteUrl("/sitemap.xml")}`);

    for (const routePath of REPRESENTATIVE_CANONICAL_PATHS) {
      expect(xml, `${routePath} is present`).toContain(absoluteUrl(routePath));
    }

    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(xml, `${aliasPath} stays out of XML sitemap`).not.toContain(
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

    for (const aliasPath of REDIRECT_ALIAS_PATHS) {
      expect(jsonLdText, `${aliasPath} absent from sitemap JSON-LD`).not.toContain(
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
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

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

    await page.getByRole("button", { name: /^More$/ }).click();
    const dialog = page.getByRole("dialog", { name: "More MorseWords tools" });
    await expect(dialog).toBeVisible();

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
    for (const [aliasPath, canonicalPath] of Object.entries(REDIRECT_ALIASES)) {
      const response = await request.get(aliasPath, { maxRedirects: 0 });

      expect(response.status(), `${aliasPath} status`).toBe(301);
      expect(response.headers().location, `${aliasPath} location`).toBe(
        canonicalPath,
      );
    }
  });
});
