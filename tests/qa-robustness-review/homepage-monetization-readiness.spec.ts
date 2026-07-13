import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import {
  MORSE_BOOK_CARD_DESCRIPTION_MAX_CHARS,
  extractMorseBookSeoCardDescription,
  getMorseBookCardDescription,
} from "../../app/client/data/morseBookCardDescriptions";
import { formatMorseBookAuthors } from "../../app/client/data/morseBookDisplay";
import type {
  MorseBookSeoSummary,
  MorseBookSeoSummaryData,
} from "../../app/client/data/morseBookSeoSummaries";
import { ROUTES } from "../../app/client/data/routes";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();
const libraryManifest = JSON.parse(
  fs.readFileSync(
    path.join(
      ROOT,
      "app",
      "client",
      "assets",
      "books",
      "generated",
      "library-manifest.json",
    ),
    "utf8",
  ),
) as {
  books: Array<{
    slug: string;
    title: string;
    author: string[];
    description: string;
    source: {
      rightsStatus: string;
      publishReady: boolean;
      processingAllowed: boolean;
      approvalSource?: string;
      rightsReviewed?: boolean;
    };
    stats: {
      wordCount: number;
      sectionCount: number;
      includedSectionCount: number;
    };
  }>;
};

const approvedBooks = libraryManifest.books
  .filter((book) => {
    const approvedBySource =
      book.source.approvalSource === "file-evidence" ||
      book.source.approvalSource === "external-authority" ||
      (book.source.approvalSource === "owner-reviewed" &&
        book.source.rightsReviewed === true) ||
      (book.source.approvalSource === undefined &&
        book.source.rightsReviewed === true);
    return (
      approvedBySource &&
      book.source.rightsStatus === "approved" &&
      book.source.publishReady === true &&
      book.source.processingAllowed === true
    );
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const approvedBookSlugs = new Set(approvedBooks.map((book) => book.slug));
const approvedBooksBySlug = new Map(
  approvedBooks.map((book) => [book.slug, book]),
);
const seoSummaries = JSON.parse(
  fs.readFileSync(
    path.join(
      ROOT,
      "app",
      "client",
      "assets",
      "books",
      "seo-summaries",
      "book-seo-summaries.json",
    ),
    "utf8",
  ),
) as MorseBookSeoSummaryData;
const seoSummariesBySlug = new Map(
  seoSummaries.summaries.map((summary) => [summary.slug, summary]),
);
const FEATURED_BOOK_COUNT = 8;
const PRIMARY_VISIBLE_FEATURED_BOOK_COUNT = 4;
const OLD_FEATURED_BOOK_FALLBACK_DESCRIPTION =
  "A Morse-friendly classic with readable sections, live playback, and audio options for short practice sessions.";

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

async function readFeaturedBookCards(page: Page) {
  const section = page.locator('[aria-labelledby="featured-morse-books-title"]');
  return section
    .locator('[data-testid="home-featured-book-card"]')
    .evaluateAll((cards) =>
      cards.map((card) => {
        const title = card.querySelector<HTMLElement>(
          '[data-testid="home-featured-book-title"]',
        );
        const author = card.querySelector<HTMLElement>(
          '[data-testid="home-featured-book-author"]',
        );
        const valueLine = card.querySelector<HTMLElement>(
          '[data-testid="home-featured-book-value-line"]',
        );
        const description = card.querySelector<HTMLElement>(
          '[data-testid="home-featured-book-description"]',
        );
        const affordance = card.querySelector<HTMLElement>(
          '[data-testid="home-featured-book-affordance"]',
        );
        const primaryLink = card.querySelector<HTMLAnchorElement>(
          '[data-testid="home-featured-book-primary-link"]',
        );
        const links = Array.from(
          card.querySelectorAll<HTMLAnchorElement>("a"),
        ).map((link) => ({
          href: link.getAttribute("href") ?? "",
          text: link.textContent?.trim().replace(/\s+/g, " ") ?? "",
          label: link.getAttribute("aria-label") ?? "",
        }));

        return {
          slug: card.getAttribute("data-mw-home-book-slug") ?? "",
          dataTitle: card.getAttribute("data-mw-home-book-title") ?? "",
          dataAuthor: card.getAttribute("data-mw-home-book-author") ?? "",
          priority: card.getAttribute("data-mw-home-book-priority") ?? "",
          visible:
            card.getClientRects().length > 0 &&
            window.getComputedStyle(card).display !== "none",
          title: title?.textContent?.trim() ?? "",
          titleAttr: title?.getAttribute("title") ?? "",
          titleClass: title?.className ?? "",
          author: author?.textContent?.trim() ?? "",
          authorAttr: author?.getAttribute("title") ?? "",
          authorClass: author?.className ?? "",
          description: description?.textContent?.trim() ?? "",
          descriptionClass: description?.className ?? "",
          valueLine: valueLine?.textContent?.trim() ?? "",
          affordanceText: affordance?.textContent?.trim() ?? "",
          primaryHref: primaryLink?.getAttribute("href") ?? "",
          primaryLabel: primaryLink?.getAttribute("aria-label") ?? "",
          primaryTitle: primaryLink?.getAttribute("title") ?? "",
          links,
        };
      }),
    );
}

async function readVisibleFeaturedBookLayoutMetrics(page: Page) {
  const section = page.locator('[aria-labelledby="featured-morse-books-title"]');
  const horizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

  const cards = await section
    .locator('[data-testid="home-featured-book-card"]')
    .evaluateAll((nodes) =>
      nodes
        .filter(
          (card) =>
            card.getClientRects().length > 0 &&
            window.getComputedStyle(card).display !== "none",
        )
        .map((card, index) => {
          const required = <T extends Element>(selector: string) => {
            const element = card.querySelector<T>(selector);
            if (!element) {
              throw new Error(`Missing featured book card element ${selector}`);
            }
            return element;
          };
          const link = required<HTMLAnchorElement>(
            '[data-testid="home-featured-book-primary-link"]',
          );
          const cover = required<HTMLElement>(
            '[data-testid="home-featured-book-cover"]',
          );
          const title = required<HTMLElement>(
            '[data-testid="home-featured-book-title"]',
          );
          const author = required<HTMLElement>(
            '[data-testid="home-featured-book-author"]',
          );
          const description = required<HTMLElement>(
            '[data-testid="home-featured-book-description"]',
          );
          const affordance = required<HTMLElement>(
            '[data-testid="home-featured-book-affordance"]',
          );
          const valueLine = required<HTMLElement>(
            '[data-testid="home-featured-book-value-line"]',
          );
          const cardBox = card.getBoundingClientRect();
          const linkBox = link.getBoundingClientRect();
          const coverBox = cover.getBoundingClientRect();
          const titleBox = title.getBoundingClientRect();
          const authorBox = author.getBoundingClientRect();
          const descriptionBox = description.getBoundingClientRect();
          const affordanceBox = affordance.getBoundingClientRect();
          const valueLineBox = valueLine.getBoundingClientRect();

          return {
            index,
            slug: card.getAttribute("data-mw-home-book-slug") ?? "",
            title: title.textContent?.trim() ?? "",
            description: description.textContent?.trim() ?? "",
            href: link.getAttribute("href") ?? "",
            ariaLabel: link.getAttribute("aria-label") ?? "",
            cardHeight: cardBox.height,
            linkHeight: linkBox.height,
            coverHeight: coverBox.height,
            coverWidth: coverBox.width,
            titleHeight: titleBox.height,
            descriptionHeight: descriptionBox.height,
            authorToDescriptionGap: descriptionBox.top - authorBox.bottom,
            contentBottomGap: coverBox.bottom - affordanceBox.bottom,
            valueToAffordanceGap: affordanceBox.top - valueLineBox.bottom,
          };
        }),
    );

  return { cards, horizontalOverflow };
}

function expectFeaturedBookCardsToMatchApprovedRecords(
  cards: Awaited<ReturnType<typeof readFeaturedBookCards>>,
) {
  expect(cards).toHaveLength(FEATURED_BOOK_COUNT);
  cards.forEach((card, index) => {
    const book = approvedBooksBySlug.get(card.slug);
    expect(book, `${card.slug} is an approved public book`).toBeDefined();
    expect(card.priority).toBe(
      index < PRIMARY_VISIBLE_FEATURED_BOOK_COUNT ? "primary" : "wide-screen",
    );
    expect(card.dataTitle).toBe(book!.title);
    expect(card.title).toBe(book!.title);
    expect(card.titleAttr).toBe(book!.title);

    const authorText = formatMorseBookAuthors(book!.author);
    expect(card.dataAuthor).toBe(authorText);
    expect(card.author).toBe(authorText);
    expect(card.authorAttr).toBe(authorText);

    const bookPath = `/morse-code-books/${card.slug}`;
    expect(card.primaryHref).toBe(bookPath);
    expect(card.primaryLabel).toBe(`Open ${book!.title} by ${authorText}`);
    expect(card.primaryTitle).toBe(`Open ${book!.title}`);
    expect(card.affordanceText).toBe("Read and listen ->");

    const expectedDescription = getMorseBookCardDescription({
      book: book!,
      seoSummary: seoSummariesBySlug.get(card.slug) ?? null,
    });
    expect(card.description).toBe(expectedDescription);
    expect(card.description).not.toBe(OLD_FEATURED_BOOK_FALLBACK_DESCRIPTION);
    expect(card.description).not.toMatch(
      /processed public books|cleaned chapter sources|source content|text-first study/i,
    );
    expect(card.description.length).toBeLessThanOrEqual(
      MORSE_BOOK_CARD_DESCRIPTION_MAX_CHARS,
    );
    expect(card.valueLine).toMatch(
      /^\d[\d,]* sections? \/ (?:\d[\d,]*|\d+(?:\.\d)?k) words$/,
    );
    expect(card.links).toHaveLength(1);
    expect(card.links[0]).toEqual(
      expect.objectContaining({
        href: bookPath,
        label: `Open ${book!.title} by ${authorText}`,
      }),
    );
    expect(
      card.links.some((link) => link.href.startsWith("/morse-code-audiobooks/")),
    ).toBe(false);
    expect(
      card.links.some((link) => /Open book|Download MP3/i.test(link.text)),
    ).toBe(false);

    expect(card.titleClass).toContain("line-clamp-4");
    expect(card.authorClass).toContain("line-clamp-2");
    expect(card.descriptionClass).toContain("line-clamp-4");
  });
}

test.describe("featured book card description source", () => {
  test("keeps reviewed library descriptions before SEO descriptions", () => {
    const book = approvedBooks.find((candidate) => candidate.description.trim());
    expect(book, "expected at least one reviewed library description").toBeDefined();
    const description = getMorseBookCardDescription({
      book: book!,
      seoSummary: seoSummariesBySlug.get(book!.slug) ?? null,
    });
    expect(description).toBe(book!.description.trim());
    expect(description).not.toBe(OLD_FEATURED_BOOK_FALLBACK_DESCRIPTION);
  });

  test("uses reviewed SEO descriptions when library descriptions are empty", () => {
    const book = approvedBooks.find(
      (candidate) =>
        !candidate.description.trim() &&
        Boolean(seoSummariesBySlug.get(candidate.slug)?.description),
    );
    expect(book, "expected an empty-description featured-source book").toBeDefined();
    const seoSummary = seoSummariesBySlug.get(book!.slug)!;
    expect(getMorseBookCardDescription({ book: book!, seoSummary })).toBe(
      seoSummary.description,
    );
  });

  test("extracts concise complete-sentence copy when only a summary is present", () => {
    const seoSummary: Pick<MorseBookSeoSummary, "description" | "summary"> = {
      description: "",
      summary:
        "Étude No. 1 opens with a quiet room, a careful listener, and a signal repeated until it becomes familiar. The second sentence stays available but is not needed for a compact card.",
    };
    const description = extractMorseBookSeoCardDescription(seoSummary, 120);
    expect(description).toBe(
      "Étude No. 1 opens with a quiet room, a careful listener, and a signal repeated until it becomes familiar.",
    );
    expect(description).toMatch(/[.!?]$/);
    expect(description).not.toContain("\uFFFD");
  });

  test("keeps long SEO summaries concise without cutting words", () => {
    const seoSummary: Pick<MorseBookSeoSummary, "description" | "summary"> = {
      description: "",
      summary:
        "This unusually long opening sentence describes a title-specific practice scene with careful punctuation, several concrete details, and enough extra language to exceed a compact card ceiling before the sentence naturally comes to a close. A shorter second sentence works.",
    };
    const description = extractMorseBookSeoCardDescription(seoSummary, 80);
    expect(description).toBe("A shorter second sentence works.");
    expect(description.length).toBeLessThanOrEqual(80);
    expect(description).not.toMatch(/\s$/);
  });

  test("fails safely when descriptive content is missing", () => {
    const book = {
      ...approvedBooks[0],
      description: "",
      slug: "missing-summary-fixture",
    };
    const description = getMorseBookCardDescription({
      book,
      seoSummary: null,
    });
    expect(description).toBe("");
    expect(description).not.toBe(OLD_FEATURED_BOOK_FALLBACK_DESCRIPTION);
  });

  test("does not retain the old fallback in homepage source or helper source", () => {
    for (const relativePath of [
      "app/routes/home.tsx",
      "app/client/data/morseBookCardDescriptions.ts",
    ]) {
      const source = fs.readFileSync(path.join(ROOT, relativePath), "utf8");
      expect(source).not.toContain(OLD_FEATURED_BOOK_FALLBACK_DESCRIPTION);
    }
  });
});

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

  test("keeps homepage and audio metadata stable", async ({ page }) => {
    await gotoHome(page);

    await expect(page).toHaveTitle(
      "Morse Code Translator | Text to Morse and Morse to Text | MorseWords",
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Convert text to Morse code or decode Morse to text, then copy, play, or continue with audio and practice tools in your browser.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.morsewords.com/",
    );
    await expect(
      page.getByRole("heading", {
        name: "Morse Code Translator",
        exact: true,
      }),
    ).toBeVisible();
    const homeJsonLd = await parsePageJsonLd(page);
    const homeGraph = homeJsonLd.flatMap((entry) => entry["@graph"] ?? []);
    expect(homeGraph).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "WebPage",
          name: "Morse Code Translator",
          description:
            "MorseWords converts text to Morse code and decodes Morse to text, with browser-based copy, playback, audio, and practice paths.",
        }),
      ]),
    );

    await page.goto(ROUTES.audio, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(page).toHaveTitle(
      "Morse Code Audio Translator & Generator | WAV, MP3, Decoder Tools | MorseWords",
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Translate text or Morse into playable audio, tune WPM and Farnsworth spacing, export WAV, and find Morse MP3, decoder, book, video, and listening tools.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.morsewords.com/audio",
    );
    await expect(
      page.getByRole("heading", {
        name: "Morse Code Audio Generator",
        exact: true,
      }),
    ).toBeVisible();
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
    const textInput = page.locator("#plainA");
    const morseOutput = page.locator("#mw_output");
    await expect(textInput).toBeVisible();
    await expect(textInput).toHaveValue("sos help");
    await expect(morseOutput).toHaveValue(
      "...   ---   ...       ....   .   .-..   .--.",
    );
    await textInput.fill("HELLO");
    await expect(morseOutput).toHaveValue("....   .   .-..   .-..   ---");

    const hero = page.locator("main").first();
    await expect(hero).toContainText("Convert text to Morse code");
    await expect(hero).toContainText("decode Morse to text");
    await expect(hero).toContainText(
      "supported letters, numbers, and punctuation",
    );
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
        name: "Classic stories for Morse reading and listening",
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

    const toolkit = page.locator(
      '[aria-labelledby="morsewords-offerings-title"]',
    );
    const audioTranslatorLink = toolkit.getByRole("link", {
      name: "Morse code audio translator",
      exact: true,
    });
    const soundGeneratorLink = toolkit.getByRole("link", {
      name: "Morse code sound generator",
      exact: true,
    });
    const alphabetLink = toolkit.getByRole("link", {
      name: "Morse code alphabet A to Z",
      exact: true,
    });
    const numbersLink = toolkit.getByRole("link", {
      name: "Morse code numbers",
      exact: true,
    });
    await expect(audioTranslatorLink).toHaveAttribute("href", ROUTES.audio);
    await expect(soundGeneratorLink).toHaveAttribute(
      "href",
      ROUTES.soundGenerator,
    );
    await expect(alphabetLink).toHaveAttribute("href", ROUTES.alphabet);
    await expect(numbersLink).toHaveAttribute("href", ROUTES.numbers);
    await expect(
      toolkit.locator(`a[href="${ROUTES.printableChart}"]`),
    ).toHaveText("Printable worksheet");
    const linkedPaths = await toolkit.locator("a[href]").evaluateAll((links) =>
      links.map((link) =>
        new URL(
          (link as HTMLAnchorElement).getAttribute("href") ?? "",
          window.location.origin,
        ).pathname,
      ),
    );
    expect(
      linkedPaths.filter((pathname) => pathname === ROUTES.audio),
      "homepage should link to the audio translator once from main content",
    ).toHaveLength(1);
    expect(
      linkedPaths.filter((pathname) => pathname === ROUTES.soundGenerator),
      "homepage should link to the sound generator once from main content",
    ).toHaveLength(1);
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

    const moreButton = page.getByRole("button", {
      name: "More",
      exact: true,
    });
    await expect(moreButton).toBeVisible();
    await expect(moreButton).toBeEnabled();
    await expect(async () => {
      if ((await moreButton.getAttribute("aria-expanded")) !== "true") {
        await moreButton.click();
      }
      await expect(moreButton).toHaveAttribute("aria-expanded", "true", {
        timeout: 1_000,
      });
    }).toPass({ timeout: 10_000 });

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

  test("highlights approved public books with focused book links", async ({
    page,
  }) => {
    expect(approvedBookSlugs.size).toBeGreaterThan(16);
    await gotoHome(page);

    const section = page.locator('[aria-labelledby="featured-morse-books-title"]');
    await expect(section).toBeVisible();
    await expect(section.getByText("Books and audiobooks")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Classic stories for Morse reading and listening",
      }),
    ).toBeVisible();
    await expect(
      section.locator('[data-testid="home-featured-book-card"]'),
    ).toHaveCount(FEATURED_BOOK_COUNT);
    await expect(section.locator(`a[href="${ROUTES.morseBooks}"]`)).toBeVisible();
    await expect(
      section.locator(`a[href="${ROUTES.morseAudiobooks}"]`),
    ).toBeVisible();

    expectFeaturedBookCardsToMatchApprovedRecords(
      await readFeaturedBookCards(page),
    );
    const viewportWidth = page.viewportSize()?.width ?? 0;
    const expectedVisibleFeaturedBookCount =
      viewportWidth >= 1280
        ? FEATURED_BOOK_COUNT
        : PRIMARY_VISIBLE_FEATURED_BOOK_COUNT;
    expect(
      (await readFeaturedBookCards(page)).filter((card) => card.visible),
    ).toHaveLength(expectedVisibleFeaturedBookCount);
    await expect(section.getByText("Open book")).toHaveCount(0);
    await expect(section.getByText("Download MP3")).toHaveCount(0);
    await expect(
      section.locator('[data-testid="home-featured-book-cta"]'),
    ).toHaveCount(0);
    await expect(
      section.locator('[data-testid="home-featured-book-mp3-link"]'),
    ).toHaveCount(0);
    await expect(section).not.toContainText("Test Published Morse Book");
  });

  test("preserves the large-desktop featured book card poster layout", async ({
    page,
  }) => {
    for (const width of [1440, 1280] as const) {
      await page.setViewportSize({ width, height: 1000 });
      await gotoHome(page);

      const { cards, horizontalOverflow } =
        await readVisibleFeaturedBookLayoutMetrics(page);
      expect(cards, `${width}px visible featured cards`).toHaveLength(
        FEATURED_BOOK_COUNT,
      );
      expect(horizontalOverflow, `${width}px horizontal overflow`).toBeLessThanOrEqual(
        1,
      );

      for (const card of cards) {
        expect(
          card.cardHeight,
          `${width}px ${card.slug} keeps approved desktop card height`,
        ).toBeGreaterThanOrEqual(390);
        expect(
          card.cardHeight,
          `${width}px ${card.slug} keeps approved desktop card height`,
        ).toBeLessThanOrEqual(420);
        expect(
          card.coverHeight / card.coverWidth,
          `${width}px ${card.slug} keeps desktop cover proportions`,
        ).toBeCloseTo(5 / 3, 1);
        expect(
          card.linkHeight,
          `${width}px ${card.slug} link fills the approved desktop card`,
        ).toBeCloseTo(card.cardHeight, 0);
        expect(card.href, `${width}px ${card.slug} link href`).toMatch(
          /^\/morse-code-books\//,
        );
        expect(card.ariaLabel, `${width}px ${card.slug} accessible link`).toContain(
          "Open ",
        );
      }
    }
  });

  test("uses content-led featured book card height below desktop", async ({
    page,
  }) => {
    const viewports = [1024, 768, 600, 390, 320] as const;

    for (const theme of ["light", "dark"] as const) {
      for (const width of viewports) {
        await page.setViewportSize({ width, height: 1000 });
        await page.addInitScript((selectedTheme) => {
          window.localStorage.setItem("morsewords-theme", selectedTheme);
          document.documentElement.dataset.theme = selectedTheme;
        }, theme);
        await gotoHome(page);
        await expect(page.locator("html")).toHaveAttribute(
          "data-theme",
          theme,
        );

        const { cards, horizontalOverflow } =
          await readVisibleFeaturedBookLayoutMetrics(page);
        expect(cards, `${theme} ${width}px visible featured cards`).toHaveLength(
          PRIMARY_VISIBLE_FEATURED_BOOK_COUNT,
        );
        expect(
          horizontalOverflow,
          `${theme} ${width}px horizontal overflow`,
        ).toBeLessThanOrEqual(1);

        for (const card of cards) {
          expect(
            card.cardHeight,
            `${theme} ${width}px ${card.slug} avoids desktop-scale height`,
          ).toBeLessThanOrEqual(width === 320 ? 390 : 360);
          expect(
            card.authorToDescriptionGap,
            `${theme} ${width}px ${card.slug} removes the pinned blank region`,
          ).toBeLessThanOrEqual(32);
          expect(
            card.contentBottomGap,
            `${theme} ${width}px ${card.slug} keeps content inside the card`,
          ).toBeGreaterThanOrEqual(12);
          expect(
            card.contentBottomGap,
            `${theme} ${width}px ${card.slug} avoids hidden bottom padding`,
          ).toBeLessThanOrEqual(32);
          expect(
            card.valueToAffordanceGap,
            `${theme} ${width}px ${card.slug} preserves metadata spacing`,
          ).toBeGreaterThanOrEqual(6);
          expect(card.title, `${theme} ${width}px ${card.slug} title`).not.toBe(
            "",
          );
          expect(
            card.description,
            `${theme} ${width}px ${card.slug} description`,
          ).not.toBe("");
        }
      }
    }
  });

  test("keeps featured book cards usable with varied content and keyboard focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await gotoHome(page);

    const { cards } = await readVisibleFeaturedBookLayoutMetrics(page);
    expect(cards).toHaveLength(PRIMARY_VISIBLE_FEATURED_BOOK_COUNT);
    expect(new Set(cards.map((card) => card.title)).size).toBe(cards.length);
    expect(
      Math.max(...cards.map((card) => card.titleHeight)),
      "at least one title wraps on narrow mobile",
    ).toBeGreaterThan(Math.min(...cards.map((card) => card.titleHeight)) + 8);
    expect(
      Math.max(...cards.map((card) => card.descriptionHeight)),
      "description area remains bounded",
    ).toBeLessThanOrEqual(96);

    const firstLink = page
      .locator('[data-testid="home-featured-book-primary-link"]')
      .first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
    await expect(firstLink).toHaveClass(/focus-visible:outline/);
  });

  test("keeps featured book cards deterministic without hydration swapping", async ({
    page,
    context,
  }) => {
    expect(approvedBooks.length).toBeGreaterThan(FEATURED_BOOK_COUNT);
    await page.addInitScript(() => {
      Math.random = () => 0.999999;
    });
    await gotoHome(page);

    const expectedSlugs = approvedBooks
      .slice(0, FEATURED_BOOK_COUNT)
      .map((book) => book.slug)
      .join("|");
    await expect
      .poll(async () =>
        (await readFeaturedBookCards(page)).map((card) => card.slug).join("|"),
      )
      .toBe(expectedSlugs);
    expectFeaturedBookCardsToMatchApprovedRecords(
      await readFeaturedBookCards(page),
    );

    const secondPage = await context.newPage();
    await blockExternalNetwork(secondPage);
    await secondPage.addInitScript(() => {
      Math.random = () => 0;
    });
    await gotoHome(secondPage);

    await expect
      .poll(async () =>
        (await readFeaturedBookCards(secondPage))
          .map((card) => card.slug)
          .join("|"),
      )
      .toBe(expectedSlugs);
    expectFeaturedBookCardsToMatchApprovedRecords(
      await readFeaturedBookCards(secondPage),
    );
    await secondPage.close();
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
        name: /Classic stories for Morse reading and listening/i,
      }),
    ).toBeVisible();
    expect(
      (await readFeaturedBookCards(page)).filter((card) => card.visible),
    ).toHaveLength(PRIMARY_VISIBLE_FEATURED_BOOK_COUNT);
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
