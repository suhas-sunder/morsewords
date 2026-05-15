import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { blockExternalNetwork } from "./helpers";

const SUPPORT_NOINDEX_ROUTES = [
  "/sitemap",
  "/misc",
  "/misc/privacy-policy",
  "/misc/terms-of-service",
  "/misc/cookies-policy",
  "/misc/socials",
] as const;

const SUPPORT_ROUTES_EXCLUDED_FROM_APP_SITEMAP = [
  "/misc/privacy-policy",
  "/misc/terms-of-service",
  "/misc/cookies-policy",
  "/misc/socials",
] as const;

const SITE_URL = "https://www.morsewords.com";
const NON_WWW_SITE_URL = "https://morsewords.com";

const CHANGED_VISIBLE_ROUTES = [
  "/",
  "/sitemap",
  "/misc/socials",
  "/misc/privacy-policy",
  "/misc/terms-of-service",
  "/morse-code-audio-quiz",
  "/morse-code-visual-quiz",
] as const;

function metaContent(html: string, name: string) {
  const pattern = new RegExp(
    `<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  return html.match(pattern)?.[1] ?? "";
}

function propertyContent(html: string, property: string) {
  const pattern = new RegExp(
    `<meta\\s+[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  return html.match(pattern)?.[1] ?? "";
}

function canonicalHref(html: string) {
  return (
    html.match(
      /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,
    )?.[1] ?? ""
  );
}

function titleText(html: string) {
  return html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
}

function xmlSitemapPaths(xml: string) {
  return [...xml.matchAll(/<loc>https:\/\/www\.morsewords\.com([^<]*)<\/loc>/g)].map(
    (match) => match[1],
  );
}

test.describe("final SEO support and content quality", () => {
  test("support-only routes are noindex/follow and excluded from XML sitemap", async ({
    request,
  }) => {
    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();

    for (const route of SUPPORT_NOINDEX_ROUTES) {
      const response = await request.get(route);
      expect(response.ok(), `${route} response`).toBe(true);
      const html = await response.text();

      expect(
        metaContent(html, "robots").toLowerCase(),
        `${route} robots meta`,
      ).toBe("noindex,follow");
      expect(xml, `${route} absent from XML sitemap`).not.toContain(
        `${SITE_URL}${route}`,
      );
    }
  });

  test("HTML and XML sitemaps agree on indexable canonical route coverage", async ({
    page,
    request,
  }) => {
    await blockExternalNetwork(page);

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml, "XML sitemap avoids non-www canonical host").not.toContain(
      NON_WWW_SITE_URL,
    );
    const xmlPaths = xmlSitemapPaths(xml).sort();

    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    const htmlPaths = (
      await page.locator("main a[href]").evaluateAll((anchors) =>
        anchors
          .map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? "")
          .filter((href) => href.startsWith("/")),
      )
    ).sort();

    expect(htmlPaths).toEqual(xmlPaths);
  });

  test("XML sitemap routes expose unique indexable metadata and canonical URLs", async ({
    request,
  }) => {
    test.setTimeout(120_000);

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml, "XML sitemap avoids non-www canonical host").not.toContain(
      NON_WWW_SITE_URL,
    );
    const paths = xmlSitemapPaths(xml);

    const titles = new Map<string, string[]>();
    const descriptions = new Map<string, string[]>();

    for (const route of paths) {
      const response = await request.get(route);
      expect(response.ok(), `${route} response`).toBe(true);
      const html = await response.text();
      const canonical = `${SITE_URL}${route}`;
      const robots = metaContent(html, "robots").toLowerCase();
      const title = titleText(html);
      const description = metaContent(html, "description");

      expect(title, `${route} title`).toBeTruthy();
      expect(description, `${route} description`).toBeTruthy();
      expect(canonicalHref(html), `${route} canonical`).toBe(canonical);
      expect(propertyContent(html, "og:url"), `${route} og:url`).toBe(canonical);
      expect(robots, `${route} robots`).not.toContain("noindex");

      titles.set(title, [...(titles.get(title) ?? []), route]);
      descriptions.set(description, [
        ...(descriptions.get(description) ?? []),
        route,
      ]);
    }

    const duplicateTitles = [...titles.entries()].filter(
      ([, routes]) => routes.length > 1,
    );
    const duplicateDescriptions = [...descriptions.entries()].filter(
      ([, routes]) => routes.length > 1,
    );

    expect(duplicateTitles).toEqual([]);
    expect(duplicateDescriptions).toEqual([]);
  });

  test("HTML sitemap keeps noindex legal and support pages out of its main inventory", async ({
    page,
  }) => {
    await blockExternalNetwork(page);
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });

    await expect(page.locator('main a[href="/about"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/contact"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/sources"]').first()).toBeVisible();

    for (const route of SUPPORT_ROUTES_EXCLUDED_FROM_APP_SITEMAP) {
      await expect(page.locator(`main a[href="${route}"]`), route).toHaveCount(0);
    }
  });

  test("support copy avoids official-profile overclaims and broken policy URLs", async ({
    page,
  }) => {
    await blockExternalNetwork(page);

    await page.goto("/misc/socials", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle("MorseWords Links | Related Utility Sites");
    const socialsDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(socialsDescription).toBe(
      "Find MorseWords-related support links and related utility projects from the site maintainer.",
    );
    expect((await page.locator("body").innerText()).toLowerCase()).not.toContain(
      "official profiles",
    );

    await page.goto("/misc/privacy-policy", { waitUntil: "domcontentloaded" });
    const privacyText = await page.locator("body").innerText();
    expect(privacyText).not.toContain("/cookiecollection");
    expect(privacyText).toContain("https://www.morsewords.com/misc/cookies-policy");

    await page.goto("/misc/terms-of-service", { waitUntil: "domcontentloaded" });
    const termsText = await page.locator("body").innerText();
    expect(termsText).not.toContain("MorseWords admin");
    expect(termsText).not.toContain("fake or borrowed name");
  });

  test("public learning copy avoids implementation wording and mojibake footer text", async ({
    page,
  }) => {
    await blockExternalNetwork(page);

    for (const route of ["/morse-code-audio-quiz", "/morse-code-visual-quiz"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const bodyText = await page.locator("body").innerText();
      const normalizedBodyText = bodyText.toLowerCase();
      expect(normalizedBodyText, route).not.toContain("result model");
      expect(normalizedBodyText, route).toContain("result summary");
    }

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const footerMorse = await page.locator(".mw-footer-faint").innerText();
    expect(footerMorse).toBe(
      "-- .- -.. . / .-- .. - .... / .-.. --- ...- .",
    );
  });

  test("changed visible pages stay accessible in light and dark modes", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await blockExternalNetwork(page);

    for (const theme of ["light", "dark"] as const) {
      await page.addInitScript((selectedTheme) => {
        const applyTheme = () => {
          if (!document.documentElement) return;
          try {
            window.localStorage.setItem("morsewords-theme", selectedTheme);
          } catch {}
          document.documentElement.dataset.theme = selectedTheme;
        };
        applyTheme();
        document.addEventListener("DOMContentLoaded", applyTheme, { once: true });
      }, theme);

      for (const route of CHANGED_VISIBLE_ROUTES) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.locator("h1").first(), `${route} h1`).toBeVisible();
        await expect
          .poll(() =>
            page.evaluate(() => document.documentElement.dataset.theme ?? "light"),
          )
          .toBe(theme);

        const results = await new AxeBuilder({ page })
          .disableRules(["color-contrast"])
          .analyze();
        const serious = results.violations.filter((violation) =>
          ["critical", "serious"].includes(violation.impact ?? ""),
        );
        expect(serious, `${route} ${theme} axe violations`).toEqual([]);
      }
    }
  });
});
