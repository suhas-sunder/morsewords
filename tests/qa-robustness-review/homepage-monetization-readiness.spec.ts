import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { ROUTES } from "../../app/client/data/routes";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const publicManifest = JSON.parse(
  fs.readFileSync(
    path.join(
      ROOT,
      "app",
      "client",
      "assets",
      "books",
      "cloudflare-export",
      "public-manifest.json",
    ),
    "utf8",
  ),
) as {
  books: Array<{
    slug: string;
    title: string;
    source: {
      rightsStatus: string;
      publishReady: boolean;
      processingAllowed: boolean;
    };
  }>;
};

const approvedBookSlugs = new Set(
  publicManifest.books
    .filter(
      (book) =>
        book.source.rightsStatus === "approved" &&
        book.source.publishReady === true &&
        book.source.processingAllowed === true,
    )
    .map((book) => book.slug),
);

async function gotoHome(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
}

async function pageLinkPaths(page: Page, selector = "main a[href]") {
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
      scripts.map((script) => JSON.parse(script.textContent?.trim() ?? "{}")),
    );
}

function flattenJsonLd(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  return [
    record,
    ...flattenJsonLd(record["@graph"]),
    ...flattenJsonLd(record.mainEntity),
    ...flattenJsonLd(record.itemListElement),
    ...flattenJsonLd(record.offers),
  ];
}

test.describe("homepage monetization readiness", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("keeps the translator as the hero tool while framing the broader ecosystem", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(
      page.getByRole("heading", {
        name: "Morse Code Translator",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByLabel("Input (Text)")).toBeVisible();
    await page.getByLabel("Input (Text)").fill("HELLO");
    await expect(page.locator("#mw_output")).toHaveValue("....   .   .-..   .-..   ---");

    const hero = page.locator("main").first();
    await expect(hero).toContainText("audio");
    await expect(hero).toContainText("video");
    await expect(hero).toContainText("practice");
    await expect(hero).toContainText("books");
    await expect(hero).toContainText("printable");
  });

  test("surfaces major MorseWords destinations with real canonical links", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(
      page.getByRole("heading", { name: "What you can do on MorseWords" }),
    ).toBeVisible();

    const expectedRoutes = [
      ROUTES.home,
      ROUTES.audio,
      ROUTES.mp3Generator,
      ROUTES.videoGenerator,
      ROUTES.practice,
      ROUTES.morseBooks,
      ROUTES.morseAudiobooks,
      ROUTES.printablePages,
    ] as const;
    const paths = await pageLinkPaths(
      page,
      '[aria-labelledby="morsewords-ecosystem-title"] a[href]',
    );

    for (const route of expectedRoutes) {
      expect(paths, `homepage ecosystem links to ${route}`).toContain(route);
    }
  });

  test("highlights approved public books and audiobook links only", async ({
    page,
  }) => {
    expect(approvedBookSlugs.size).toBe(16);
    await gotoHome(page);

    const section = page.locator('[aria-labelledby="featured-morse-books-title"]');
    await expect(section).toBeVisible();
    await expect(section.locator("article")).toHaveCount(4);
    await expect(section.locator(`a[href="${ROUTES.morseBooks}"]`)).toBeVisible();
    await expect(
      section.locator(`a[href="${ROUTES.morseAudiobooks}"]`),
    ).toBeVisible();

    const linkedBookSlugs = await section.locator('a[href^="/morse-code-books/"]').evaluateAll(
      (anchors) =>
        anchors.map((anchor) =>
          ((anchor as HTMLAnchorElement).getAttribute("href") ?? "")
            .replace(/^\/morse-code-books\//, "")
            .split("/")[0],
        ),
    );
    const linkedAudiobookSlugs = await section
      .locator('a[href^="/morse-code-audiobooks/"]')
      .evaluateAll((anchors) =>
        anchors.map((anchor) =>
          ((anchor as HTMLAnchorElement).getAttribute("href") ?? "")
            .replace(/^\/morse-code-audiobooks\//, "")
            .split("/")[0],
        ),
      );

    for (const slug of [...linkedBookSlugs, ...linkedAudiobookSlugs]) {
      expect(approvedBookSlugs.has(slug), `${slug} is approved`).toBe(true);
    }
    await expect(section).not.toContainText("Test Published Morse Book");
  });

  test("links printables, explains browser print, and keeps schema conservative", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(
      page.getByRole("heading", {
        name: "Printable Morse pages for custom text and books",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Create printable pages" }),
    ).toBeVisible();
    await expect(page.getByText("browser print dialog")).toBeVisible();
    await expect(page.getByText("Project Gutenberg links appear")).toBeVisible();

    const jsonLd = await parsePageJsonLd(page);
    const records = jsonLd.flatMap(flattenJsonLd);
    const schemaText = JSON.stringify(records);
    expect(schemaText).toContain("WebSite");
    expect(schemaText).toContain("WebPage");
    for (const forbidden of [
      "Offer",
      "offers",
      "price",
      "Review",
      "review",
      "AggregateRating",
      "aggregateRating",
      "ratingValue",
    ]) {
      expect(schemaText, `homepage schema omits ${forbidden}`).not.toContain(
        forbidden,
      );
    }
  });

  test("stays readable without horizontal overflow on mobile and in dark mode", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });
    await gotoHome(page);

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(
      page.getByRole("heading", { name: "What you can do on MorseWords" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Create printable pages/i }),
    ).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
  });
});
