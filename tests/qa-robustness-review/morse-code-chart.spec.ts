import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { TEXT_TO_MORSE } from "../../app/client/components/shared/morseUtils";
import {
  LETTER_ITEMS,
  NUMBER_ITEMS,
  SYMBOL_PAGES,
} from "../../app/client/data/morseContent";
import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

const SITE_URL = "https://www.morsewords.com";
const CANONICAL_PATH = "/morse-code-chart";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;
const CHART_ALIASES = [
  "/international-morse-code-chart",
  "/morse-code-chart-a-z-0-9",
  "/morse-code-alphabet-chart",
] as const;
const THEME_STORAGE_KEY = "morsewords-theme";

const LETTERS = LETTER_ITEMS.filter((item) => item.isPublicLetter);
const DIGITS = NUMBER_ITEMS;
const PUNCTUATION_CHARACTERS = Object.keys(TEXT_TO_MORSE).filter(
  (character) => !/^[A-Z0-9]$/.test(character),
);
const PUNCTUATION_SYMBOL_ROUTES = Object.values(SYMBOL_PAGES)
  .filter((item) =>
    item.plainTextValue
      .split("")
      .some((character) => PUNCTUATION_CHARACTERS.includes(character)),
  )
  .map((item) => item.path);

function flattenJsonLd(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  return [record, ...flattenJsonLd(record["@graph"])];
}

function schemaType(record: Record<string, unknown>) {
  return typeof record["@type"] === "string" ? record["@type"] : "";
}

async function parseJsonLd(page: Page) {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((items) => items.map((item) => item.textContent ?? ""));
  expect(scripts.length, "JSON-LD script count").toBeGreaterThan(0);
  return scripts.map((script) => JSON.parse(script));
}

async function expectNoChartAliasLinks(page: Page, routePath: string) {
  const badLinks = await page.locator("a[href]").evaluateAll(
    (anchors, aliases) =>
      anchors
        .map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? "")
        .filter((href) => {
          try {
            const pathname = new URL(href, window.location.origin).pathname;
            return (aliases as string[]).includes(pathname);
          } catch {
            return false;
          }
        }),
    [...CHART_ALIASES],
  );

  expect(badLinks, `${routePath} should not link chart aliases`).toEqual([]);
}

function isExpectedHarnessConsoleEntry(text: string) {
  return (
    text.includes("ERR_BLOCKED_BY_CLIENT") ||
    text.includes("WebSocket connection") ||
    text.includes("[vite] failed to connect to websocket") ||
    text.includes("WebSocket closed without opened.")
  );
}

test.describe("Morse code chart route", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, visible FAQ, and valid chart JSON-LD", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(
      "Morse Code Chart | A-Z, Numbers, Punctuation, and Audio | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse Code Chart");
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
    expect(description).toContain("A-Z");
    expect(description).toContain("numbers");
    expect(description).toContain("punctuation");
    expect(description).toContain("audio");
    expect(description).toContain("printable chart");

    for (const name of [
      "Letters A-Z",
      "Numbers 0-9",
      "Punctuation",
      "Printable chart",
    ]) {
      await expect(page.getByRole("link", { name }).first()).toBeVisible();
    }

    for (const name of [
      "Open translator",
      "Open audio tool",
      "Print/download chart",
      "View printable chart",
    ]) {
      await expect(page.getByRole("link", { name }).first()).toBeVisible();
    }

    for (const heading of [
      "A-Z Morse code chart",
      "0-9 Morse number chart",
      "Punctuation and symbols chart",
      "Prosigns and reference signals",
      "Timing and spacing mini-reference",
      "How to use this chart",
      "Morse code chart FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    await expect(page.locator("#faq details summary")).toHaveCount(6);

    const parsedJsonLd = await parseJsonLd(page);
    const records = parsedJsonLd.flatMap(flattenJsonLd);
    const types = records.map(schemaType);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("CollectionPage");
    expect(types).toContain("FAQPage");

    const breadcrumbs = records.find((record) => schemaType(record) === "BreadcrumbList");
    expect(breadcrumbs?.itemListElement).toEqual([
      expect.objectContaining({ "@type": "ListItem", position: 1, name: "Home" }),
      expect.objectContaining({
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Chart",
        item: CANONICAL_URL,
      }),
    ]);

    const faqPage = records.find((record) => schemaType(record) === "FAQPage");
    const schemaQuestions = (faqPage?.mainEntity as Array<Record<string, unknown>>).map(
      (item) => item.name,
    );
    const visibleQuestions = await page.locator("#faq details summary").allTextContents();
    for (const question of schemaQuestions) {
      expect(
        visibleQuestions.some((visibleQuestion) =>
          visibleQuestion.includes(String(question)),
        ),
        `visible FAQ includes ${String(question)}`,
      ).toBe(true);
    }
  });

  test("renders complete letters, digits, and supported punctuation with actions", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page.locator('[data-chart-section="letters"] [data-chart-row]')).toHaveCount(
      LETTERS.length,
    );
    await expect(page.locator('[data-chart-section="numbers"] [data-chart-row]')).toHaveCount(
      DIGITS.length,
    );
    await expect(
      page.locator('[data-chart-section="punctuation"] [data-chart-row]'),
    ).toHaveCount(PUNCTUATION_CHARACTERS.length);

    for (const item of LETTERS) {
      const row = page.locator(`[data-chart-row="letter-${item.letter}"]`);
      await expect(row).toContainText(item.morseValue);
      await expect(row.locator(`a[href="${item.path}"]`)).toBeVisible();
    }

    for (const item of DIGITS) {
      const row = page.locator(`[data-chart-row="number-${item.digit}"]`);
      await expect(row).toContainText(item.morseValue);
      await expect(row.locator(`a[href="${item.path}"]`)).toBeVisible();
    }

    for (const path of PUNCTUATION_SYMBOL_ROUTES) {
      await expect(
        page.locator('[data-chart-section="punctuation"]').locator(`a[href="${path}"]`).first(),
        `${path} punctuation detail link`,
      ).toBeVisible();
    }

    const expectedActionCount =
      LETTERS.length + DIGITS.length + PUNCTUATION_CHARACTERS.length;
    await expect(page.getByRole("button", { name: /^Copy Morse for/ })).toHaveCount(
      expectedActionCount,
    );
    await expect(page.getByRole("button", { name: /^Play Morse for/ })).toHaveCount(
      expectedActionCount,
    );
  });

  test("sitemap, redirects, and internal links use only the canonical chart URL", async ({
    page,
    request,
  }) => {
    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml).toContain(CANONICAL_URL);

    for (const alias of CHART_ALIASES) {
      const response = await request.get(alias, { maxRedirects: 0 });
      expect(response.status(), `${alias} status`).toBe(301);
      expect(response.headers().location, `${alias} target`).toBe(CANONICAL_PATH);
      expect(xml, `XML sitemap excludes ${alias}`).not.toContain(`${SITE_URL}${alias}`);
      expect(await response.text(), `${alias} has no JSON-LD`).not.toContain(
        "application/ld+json",
      );
    }

    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    await expect(page.locator(`a[href="${CANONICAL_PATH}"]`).first()).toBeVisible();
    for (const alias of CHART_ALIASES) {
      await expect(page.locator(`a[href="${alias}"]`)).toHaveCount(0);
    }

    for (const routePath of [
      CANONICAL_PATH,
      "/morse-code-alphabet",
      "/morse-code-numbers",
      "/morse-code-punctuation",
      "/morse-code-printable-chart",
      "/audio",
      "/morse-code-encoder",
    ]) {
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await expectNoChartAliasLinks(page, routePath);
    }

    for (const routePath of [
      "/morse-code-alphabet",
      "/morse-code-numbers",
      "/morse-code-punctuation",
      "/morse-code-printable-chart",
      "/audio",
      "/morse-code-encoder",
    ]) {
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator(`a[href="${CANONICAL_PATH}"]`).first(),
        `${routePath} links to canonical chart`,
      ).toBeVisible();
    }
  });

  test("renders in dark mode, passes focused axe scan, and stays usable on mobile", async ({
    page,
  }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript((key) => {
      try {
        window.localStorage.setItem(key, "dark");
        if (document.documentElement) {
          document.documentElement.dataset.theme = "dark";
        }
      } catch {
        if (document.documentElement) {
          document.documentElement.dataset.theme = "light";
        }
      }
    }, THEME_STORAGE_KEY);

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe("dark");
    await expect(page.locator("h1")).toHaveText("Morse Code Chart");
    await expect(page.locator('[data-chart-section="letters"] [data-chart-row]').first()).toBeVisible();

    const axeResults = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();
    expect(
      axeResults.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);

    expect(
      consoleEntries.filter(
        (entry) => !isExpectedHarnessConsoleEntry(entry.text),
      ),
    ).toEqual([]);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('[data-chart-section="numbers"] [data-chart-row]').first()).toBeVisible();

    const layoutAudit = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(layoutAudit.scrollWidth).toBeLessThanOrEqual(layoutAudit.clientWidth + 1);
  });
});
