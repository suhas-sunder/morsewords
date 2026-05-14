import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

type JsonLdRecord = Record<string, unknown>;

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/morse-code-test";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;
const THEME_STORAGE_KEY = "morsewords-theme";

const TEST_ALIASES = [
  "/morse-code-practice-test",
  "/morse-code-listening-test",
  "/morse-code-typing-test",
  "/morse-code-speed-test",
  "/morse-type-test",
  "/morse-code-tests",
  "/morse-code-test-online",
] as const;

const REQUIRED_CHOOSER_LINKS = [
  "/morse-code-audio-quiz",
  "/morse-code-audio-practice",
  "/typing",
  "/morse-code-visual-quiz",
  "/practice",
  "/morse-code-word-trainer",
  "/morse-code-practice-plan",
] as const;

const REQUIRED_SUPPORT_LINKS = [
  "/morse-code-visual-practice",
  "/audio",
  "/morse-code-alphabet",
  "/morse-code-numbers",
  "/morse-code-word-separator",
] as const;

const FORBIDDEN_LINKS = [
  ...TEST_ALIASES,
  "/morse-to-english",
  "/morse-code-mp3-generator",
] as const;

const CONTEXTUAL_LINK_SOURCE_ROUTES = [
  "/practice",
  "/typing",
  "/morse-code-audio-practice",
  "/morse-code-audio-quiz",
  "/morse-code-practice-plan",
] as const;

function flattenJsonLd(value: unknown): JsonLdRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return [record, ...flattenJsonLd(record["@graph"])];
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
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((items) => items.map((item) => item.textContent ?? ""));
  expect(scripts.length, "JSON-LD script count").toBeGreaterThan(0);
  return scripts.map((script) => JSON.parse(script));
}

async function getLinkedPathnames(page: Page) {
  return page.locator("a[href]").evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const href = (anchor as HTMLAnchorElement).getAttribute("href") ?? "";
      return new URL(href, window.location.origin).pathname;
    }),
  );
}

function isExpectedHarnessConsoleEntry(text: string) {
  return (
    text.includes("ERR_BLOCKED_BY_CLIENT") ||
    text.includes("WebSocket connection") ||
    text.includes("[vite] failed to connect to websocket") ||
    text.includes("WebSocket closed without opened.")
  );
}

test.describe("Morse code test assessment hub", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, useful assessment content, visible FAQ, and valid JSON-LD", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(
      "Morse Code Test | Listening, Typing, Visual, and Speed Practice | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse Code Test");
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
    expect(description).toContain("Morse listening test");
    expect(description).toContain("typing test");
    expect(description).toContain("visual quiz");
    expect(description).toContain("accuracy");
    expect(description).toContain("speed");

    for (const name of [
      "Start listening test",
      "Start typing test",
      "Start visual test",
      "Start general practice",
      "Build a practice plan",
    ]) {
      await expect(page.getByRole("link", { name }).first()).toBeVisible();
    }

    for (const heading of [
      "Choose the right Morse code test",
      "Which Morse test should I choose?",
      "How the Morse code test hub works",
      "Test types explained",
      "Beginner and intermediate paths",
      "How to read your results",
      "Morse WPM and speed notes",
      "Common Morse test mistakes",
      "Morse code test FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    await expect(page.locator('[data-testid="morse-test-chooser"] a')).toHaveCount(
      REQUIRED_CHOOSER_LINKS.length,
    );
    await expect(page.locator('[data-testid="morse-test-chooser"]')).not.toHaveClass(
      /mw-static|mw-surface|bg-\[/,
    );
    for (const heading of [
      "How the Morse code test hub works",
      "How to read your results",
      "Morse WPM and speed notes",
      "Common Morse test mistakes",
    ]) {
      const section = page.locator("section").filter({
        has: page.getByRole("heading", { name: heading }),
      });
      await expect(
        section.locator(
          ".mw-static-panel, .mw-static-tile, .mw-static-surface, .mw-static-surface-soft",
        ),
        `${heading} should use spacing, not filled card surfaces`,
      ).toHaveCount(0);
    }
    await expect(page.locator("#faq details summary")).toHaveCount(6);
    const wpmSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: "Morse WPM and speed notes" }),
    });
    await expect(wpmSection.getByText("PARIS", { exact: false })).toBeVisible();
    await expect(
      page.locator("main").getByText("not an official licensing exam").first(),
    ).toBeVisible();
    await expect(
      page.locator("main").getByText("single test result").first(),
    ).toBeVisible();

    const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
    const types = records.map(schemaType);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("CollectionPage");
    expect(types).toContain("FAQPage");

    const breadcrumbs = records.find((record) => schemaType(record) === "BreadcrumbList");
    const breadcrumbItems = breadcrumbs?.itemListElement as JsonLdRecord[];
    expect(breadcrumbItems).toEqual([
      expect.objectContaining({ "@type": "ListItem", position: 1, name: "Home" }),
      expect.objectContaining({
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Test",
        item: CANONICAL_URL,
      }),
    ]);

    const faqPage = records.find((record) => schemaType(record) === "FAQPage");
    const schemaQuestions = (faqPage?.mainEntity as JsonLdRecord[]).map(itemName);
    const visibleQuestions = await page.locator("#faq details summary").allTextContents();
    for (const question of schemaQuestions) {
      expect(
        visibleQuestions.some((visibleQuestion) =>
          visibleQuestion.includes(question),
        ),
        `visible FAQ includes ${question}`,
      ).toBe(true);
    }
  });

  test("routes users only to existing canonical assessment and support tools", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    for (const href of REQUIRED_CHOOSER_LINKS) {
      await expect(
        page.locator('[data-testid="morse-test-chooser"]').locator(`a[href="${href}"]`),
        `${href} chooser link`,
      ).toBeVisible();
    }

    for (const href of REQUIRED_SUPPORT_LINKS) {
      await expect(
        page.locator("main").locator(`a[href="${href}"]`).first(),
        `${href} support link`,
      ).toBeVisible();
    }

    const linkedPathnames = await getLinkedPathnames(page);
    for (const href of FORBIDDEN_LINKS) {
      expect(linkedPathnames, `page should not link ${href}`).not.toContain(href);
    }

    await expect(page.locator('a[href="/morse-code-speed-test"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="morse-test-chooser"]')).not.toContainText(
      "formal WPM speed test",
    );
  });

  test("sitemap, redirects, and internal links use only the canonical test URL", async ({
    page,
    request,
  }) => {
    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml).toContain(CANONICAL_URL);

    for (const alias of TEST_ALIASES) {
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
    for (const alias of TEST_ALIASES) {
      await expect(page.locator(`a[href="${alias}"]`)).toHaveCount(0);
    }

    for (const routePath of CONTEXTUAL_LINK_SOURCE_ROUTES) {
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator(`a[href="${CANONICAL_PATH}"]`).first(),
        `${routePath} links to canonical test hub`,
      ).toBeVisible();
      const linkedPathnames = await getLinkedPathnames(page);
      for (const alias of TEST_ALIASES) {
        expect(linkedPathnames, `${routePath} avoids ${alias}`).not.toContain(alias);
      }
    }
  });

  test("works in dark mode, passes focused axe scan, and keeps chooser usable on mobile", async ({
    page,
  }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
      if (document.documentElement) {
        document.documentElement.dataset.theme = "dark";
      }
    }, THEME_STORAGE_KEY);

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe("dark");
    await expect(page.locator("h1")).toHaveText("Morse Code Test");

    const chooser = page.locator('[data-testid="morse-test-chooser"]');
    await expect(chooser).toBeVisible();
    await expect(chooser.getByRole("link", { name: "Listening test" })).toHaveAttribute(
      "href",
      "/morse-code-audio-quiz",
    );

    const axeResults = await new AxeBuilder({ page })
      .include('[data-testid="morse-test-chooser"]')
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
    await expect(page.locator('[data-testid="morse-test-chooser"] a').first()).toBeVisible();

    const layoutAudit = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      firstChooserTop: document
        .querySelector('[data-testid="morse-test-chooser"]')
        ?.getBoundingClientRect().top,
    }));
    expect(layoutAudit.scrollWidth).toBeLessThanOrEqual(layoutAudit.clientWidth + 1);
    expect(layoutAudit.firstChooserTop).toBeLessThan(760);
  });
});
