import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  REDIRECT_PATHS,
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
} from "./helpers";

const SITE_URL = "https://www.morsewords.com";
const CANONICAL_PATH = "/morse-code-word-separator";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;
const THEME_STORAGE_KEY = "morsewords-theme";

const REQUIRED_LINKS = [
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/morse-code-punctuation",
  "/slash-in-morse-code",
  "/space-in-morse-code",
  "/morse-code-reader",
  "/morse-code-timing",
  "/farnsworth-timing",
  "/audio",
  "/morse-code-sound-generator",
  "/morse-code-mp3-generator",
  "/morse-code-book-translator",
] as const;

const REQUIRED_FAQ_QUESTIONS = [
  "What is the word separator in Morse code?",
  "Why is a slash used between Morse code words?",
  "Do you put spaces between Morse code letters?",
  "Do you put a slash between every letter?",
  "Is the slash actually sent in Morse audio?",
  "What is the difference between a word gap and a slash?",
  "How do I write a space in Morse code?",
  "What does / mean in written Morse code?",
  "How do I separate sentences in Morse code?",
  "Why does Morse code without spaces become hard to read?",
  "Does slash also have its own Morse code character?",
  "What spacing should I use for copy and paste?",
] as const;

const LINKED_ROUTE_SMOKE_PATHS = [
  ...REQUIRED_LINKS,
  "/morse-code-decoder",
] as const;

type JsonLdRecord = Record<string, unknown>;

function flattenJsonLd(value: unknown): JsonLdRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return [
    record,
    ...flattenJsonLd(record["@graph"]),
    ...flattenJsonLd(record.mainEntity),
    ...flattenJsonLd(record.itemListElement),
  ];
}

function schemaType(record: JsonLdRecord) {
  return typeof record["@type"] === "string" ? record["@type"] : "";
}

function itemName(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const record = value as JsonLdRecord;
  return typeof record.name === "string" ? record.name : "";
}

async function parseJsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? "null")),
  );
}

async function visibleFaqQuestions(page: Page) {
  const faqSection = page.locator("#faq section").filter({
    has: page.getByRole("heading", {
      name: "Morse code word separator FAQ",
    }),
  });
  await expect(faqSection).toHaveCount(1);

  return faqSection.locator("details summary").evaluateAll((summaries) =>
    summaries
      .map((summary) => summary.textContent?.trim().replace(/>$/, "").trim() ?? "")
      .filter(Boolean),
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
    .reduce((sum, channel, index) => {
      return sum + channel * [0.2126, 0.7152, 0.0722][index];
    }, 0);
}

function contrastRatio(foreground: string, background: string) {
  const foregroundRgb = parseRgbTriplet(foreground);
  const backgroundRgb = parseRgbTriplet(background);
  expect(foregroundRgb, `foreground color ${foreground}`).not.toBeNull();
  expect(backgroundRgb, `background color ${background}`).not.toBeNull();

  const foregroundLuminance = relativeLuminance(foregroundRgb as number[]);
  const backgroundLuminance = relativeLuminance(backgroundRgb as number[]);
  const light = Math.max(foregroundLuminance, backgroundLuminance);
  const dark = Math.min(foregroundLuminance, backgroundLuminance);

  return (light + 0.05) / (dark + 0.05);
}

async function renderedColors(locator: Locator) {
  return locator.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
    };
  });
}

function pageContent(page: Page) {
  return page.locator(".mw-page-content");
}

async function relatedToolsSection(page: Page) {
  const section = page.locator("section").filter({
    has: page.getByRole("heading", {
      name: "Related spacing, reference, and audio tools",
    }),
  });
  await expect(section).toHaveCount(1);
  return section;
}

test.describe("Morse code word separator", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, quick answer, examples, FAQ, and JSON-LD", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page).toHaveTitle(
      "Morse Code Word Separator | Spaces, Slash & Word Gaps | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse code word separator");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      CANONICAL_URL,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      CANONICAL_URL,
    );

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toContain("slash notation");
    expect(description).toContain("written spaces");
    expect(description).toContain("timed audio word gaps");

    await expect(page.getByLabel("Paste Morse")).toBeVisible();
    await expect(page.getByRole("button", { name: "Normalize Morse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "English to Morse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "7 spaces" })).toBeVisible();
    await expect(page.getByRole("button", { name: "/", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy output" })).toBeVisible();

    for (const heading of [
      "Use spaces for letters and / for words",
      "How written Morse spacing works",
      "Written Morse spacing examples",
      "Common spacing mistakes",
      "Where to check spacing, symbols, and timing",
      "Related spacing, reference, and audio tools",
      "Morse code word separator FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    for (const text of [
      "letters are usually separated by spaces",
      "Words are often separated by a slash",
      "the slash is not sent as a symbol between words",
      "The slash is a text notation convenience",
      "Audio Morse uses silence",
      "The slash punctuation character has its own Morse pattern",
    ]) {
      await expect(page.getByText(text, { exact: false })).toBeVisible();
    }

    for (const morseExample of [
      "... --- ... / .... . .-.. .--.",
      ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
      ".. / .-.. --- ...- . / -.-- --- ..-",
      "-.-. --.- / -.-. --.-",
      ".... . .-.. .-.. --- --..-- / .-- --- .-. .-.. -..",
    ]) {
      await expect(page.getByText(morseExample, { exact: true })).toBeVisible();
    }

    const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
    for (const expectedSchemaType of ["BreadcrumbList", "WebApplication", "FAQPage"]) {
      expect(
        records.some((record) => schemaType(record) === expectedSchemaType),
        expectedSchemaType,
      ).toBe(true);
    }
    expect(records.filter((record) => schemaType(record) === "FAQPage")).toHaveLength(
      1,
    );
  });

  test("keeps separator tool behavior intact", async ({ page }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const output = page.locator("pre").first();
    const morseInput = page.getByLabel("Paste Morse");

    await morseInput.fill("");
    await expect(output).toHaveText("-");
    await expect(page.getByRole("button", { name: "Copy output" })).toBeDisabled();

    await morseInput.fill("... /// //// --- ||| ...");
    await expect(output).toHaveText("...       ---       ...");

    await page.getByRole("button", { name: "/", exact: true }).click();
    await expect(output).toHaveText("... / --- / ...");

    await page.getByRole("button", { name: "English to Morse" }).click();
    await page.getByLabel("English input").fill("HELLO WORLD");
    await expect(output).toHaveText(
      ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
    );
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });

  test("links to canonical spacing, reference, and audio routes and avoids aliases", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const content = pageContent(page);
    const contentHrefs = await content.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? ""),
    );

    for (const href of REQUIRED_LINKS) {
      await expect(content.locator(`a[href="${href}"]`).first()).toBeVisible();
      expect(contentHrefs, href).toContain(href);
    }

    for (const alias of REDIRECT_PATHS) {
      expect(contentHrefs, `word separator avoids redirect alias ${alias}`).not.toContain(
        alias,
      );
    }
  });

  test("keeps FAQPage JSON-LD unique, canonical, and aligned with visible FAQs", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const parsedJsonLd = await parseJsonLd(page);
    const records = parsedJsonLd.flatMap(flattenJsonLd);
    const faqPages = records.filter((record) => schemaType(record) === "FAQPage");
    expect(faqPages, "single FAQPage schema").toHaveLength(1);

    const webApp = records.find((record) => schemaType(record) === "WebApplication");
    expect(webApp?.url).toBe(CANONICAL_URL);
    expect(webApp?.["@id"]).toBe(`${CANONICAL_URL}#webapp`);

    const breadcrumbs = records.find(
      (record) => schemaType(record) === "BreadcrumbList",
    );
    const breadcrumbItems = breadcrumbs?.itemListElement as JsonLdRecord[];
    expect(breadcrumbItems.at(-1)?.item).toBe(CANONICAL_URL);

    const faqPage = faqPages[0];
    expect(faqPage["@id"]).toBe(`${CANONICAL_URL}#faq`);
    expect(faqPage.url).toBe(CANONICAL_URL);

    const schemaQuestions = (faqPage.mainEntity as JsonLdRecord[]).map(itemName);
    const visibleQuestions = await visibleFaqQuestions(page);
    expect(schemaQuestions).toEqual(visibleQuestions);
    for (const question of REQUIRED_FAQ_QUESTIONS) {
      expect(schemaQuestions, question).toContain(question);
    }

    const schemaText = JSON.stringify(parsedJsonLd);
    expect(schemaText).toContain(CANONICAL_URL);
    expect(schemaText).not.toContain(`${CANONICAL_URL}?`);
  });

  test("works in dark mode and mobile without overflow or strobe", async ({ page }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
    }, THEME_STORAGE_KEY);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(
      page.getByRole("heading", {
        exact: true,
        name: "Morse code word separator",
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Use spaces for letters and / for words" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const axeResults = await new AxeBuilder({ page })
      .include(".mw-page-content")
      .disableRules(["color-contrast"])
      .analyze();
    expect(
      axeResults.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
    expect(consoleEntries).toEqual([]);
  });

  test("keeps touched related links readable on dark hover", async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
    }, THEME_STORAGE_KEY);
    await page.setViewportSize({ width: 1280, height: 760 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const section = await relatedToolsSection(page);
    const link = section.locator('a[href="/morse-code-sound-generator"]');
    await expect(link).toHaveCount(1);
    await link.hover();

    const colors = await renderedColors(link);
    expect(
      contrastRatio(colors.color, colors.backgroundColor),
      "hovered word separator related link contrast",
    ).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });

  test("linked canonical routes load for spacing, reference, and audio followups", async ({
    page,
  }) => {
    for (const path of LINKED_ROUTE_SMOKE_PATHS) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);
      await expect(page.locator("h1").first(), path).toBeVisible();
      await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute(
        "href",
        `${SITE_URL}${path}`,
      );
      await expect(page.locator(".mw-strobe-flash"), path).toHaveCount(0);
    }
  });
});
