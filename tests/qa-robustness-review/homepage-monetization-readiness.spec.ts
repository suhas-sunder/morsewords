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

function parseRgb(color: string) {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Could not parse color: ${color}`);
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  return [r, g, b]
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    })
    .reduce(
      (total, channel, index) =>
        total + channel * ([0.2126, 0.7152, 0.0722][index] ?? 0),
      0,
    );
}

function contrastRatio(foreground: string, background: string) {
  const light = Math.max(
    relativeLuminance(parseRgb(foreground)),
    relativeLuminance(parseRgb(background)),
  );
  const dark = Math.min(
    relativeLuminance(parseRgb(foreground)),
    relativeLuminance(parseRgb(background)),
  );
  return (light + 0.05) / (dark + 0.05);
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

  test("keeps homepage discovery substantive instead of duplicating the nav", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(
      page.getByRole("heading", { name: "What you can do on MorseWords" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        name: "One Morse workspace for reading, listening, practice, and study",
      }),
    ).toBeVisible();
    for (const offering of [
      "Translator and conversion tools",
      "Audio and MP3",
      "Practice and drills",
      "Reference and lookup",
      "Books and audiobooks",
      "Printables and word search",
    ]) {
      await expect(page.getByRole("heading", { name: offering })).toBeVisible();
    }
    await expect(
      page.getByRole("heading", {
        name: /Read and listen with processed public books/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Printable Morse pages for custom text and books",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Practical tools with clear source notes",
      }),
    ).toBeVisible();
  });

  test("keeps light toolkit card hover states readable", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await gotoHome(page);

    const toolkitCard = page
      .locator("#morse-code-navigation .mw-toolkit-card-light")
      .first();
    await toolkitCard.scrollIntoViewIfNeeded();
    await toolkitCard.hover();

    const styles = await toolkitCard
      .locator(".mw-heading")
      .first()
      .evaluate((node) => {
        const card = node.closest(".mw-toolkit-card-light");
        if (!card) throw new Error("Missing toolkit card");
        const textStyle = window.getComputedStyle(node);
        const cardStyle = window.getComputedStyle(card);
        return {
          color: textStyle.color,
          backgroundColor: cardStyle.backgroundColor,
        };
      });

    expect(
      contrastRatio(styles.color, styles.backgroundColor),
      "hovered light toolkit card heading contrast",
    ).toBeGreaterThanOrEqual(4.5);
    expect(styles.backgroundColor).not.toBe("rgb(15, 23, 42)");
    expect(styles.backgroundColor).not.toBe("rgb(2, 6, 23)");
  });

  test("lays out the More menu with books as a full-width second row", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await gotoHome(page);

    await page.getByRole("button", { name: /More/i }).click();
    const dialog = page.getByRole("dialog", { name: "More MorseWords tools" });
    await expect(dialog).toBeVisible();

    const aboutSection = dialog.locator("section", {
      has: page.getByRole("heading", { name: "About and trust" }),
    });
    const booksSection = dialog.locator("section", {
      has: page.getByRole("heading", { name: "Books and audiobooks" }),
    });
    await expect(aboutSection).toBeVisible();
    await expect(booksSection).toBeVisible();

    const aboutBox = await aboutSection.boundingBox();
    const booksBox = await booksSection.boundingBox();
    expect(aboutBox).not.toBeNull();
    expect(booksBox).not.toBeNull();
    expect(booksBox!.y).toBeGreaterThan(aboutBox!.y + aboutBox!.height / 2);
    expect(booksBox!.width).toBeGreaterThan(aboutBox!.width * 3);

    const bookLinkColumns = await booksSection.locator("a").evaluateAll((links) =>
      Array.from(
        new Set(
          links
            .slice(0, 20)
            .map((link) => Math.round(link.getBoundingClientRect().left / 10) * 10),
        ),
      ).length,
    );
    expect(bookLinkColumns).toBeGreaterThanOrEqual(3);
  });

  test("highlights approved public books and audiobook links only", async ({
    page,
  }) => {
    expect(approvedBookSlugs.size).toBeGreaterThan(16);
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
      page.getByRole("heading", {
        name: /Read and listen with processed public books/i,
      }),
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
