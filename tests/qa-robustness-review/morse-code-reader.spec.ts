import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

type JsonLdRecord = Record<string, unknown>;

const SITE_URL = "https://morsewords.com";
const CANONICAL_PATH = "/morse-code-reader";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;
const THEME_STORAGE_KEY = "morsewords-theme";

const READER_ALIASES = [
  "/morse-reader",
  "/read-morse-code",
  "/morse-to-english",
  "/morse-code-to-english",
] as const;

const REQUIRED_LINKS = [
  "/morse-code-decoder",
  "/morse-code-audio-decoder",
  "/morse-code-encoder",
  "/copy-and-paste-morse-code",
  "/morse-code-word-separator",
  "/space-in-morse-code",
  "/slash-in-morse-code",
  "/morse-code-without-spaces",
  "/how-to-read-morse-code",
  "/morse-code-alphabet",
  "/morse-code-chart",
] as const;

const CONTEXTUAL_SOURCE_ROUTES = [
  "/morse-code-decoder",
  "/copy-and-paste-morse-code",
  "/morse-code-without-spaces",
  "/how-to-read-morse-code",
  "/morse-code-word-separator",
  "/space-in-morse-code",
  "/slash-in-morse-code",
  "/morse-code-audio-decoder",
] as const;

const FORBIDDEN_LINKS = [
  ...READER_ALIASES,
  "/morse-code-mp3-generator",
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

test.describe("Morse code reader", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, visible tool, useful sections, FAQ, and JSON-LD", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(
      "Morse Code Reader | Paste Morse and Read Text | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse Code Reader");
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
    expect(description).toContain("pasting Morse code");
    expect(description).toContain("decoded text");
    expect(description).toContain("spacing help");
    expect(description).toContain("audio tools");

    const readerInput = page.getByLabel("Morse code input");
    await expect(readerInput).toBeVisible();
    const readerInputHeight = await readerInput.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    const viewportWidth = page.viewportSize()?.width ?? 0;
    expect(readerInputHeight).toBeGreaterThanOrEqual(
      viewportWidth >= 768 ? 320 : 220,
    );
    await expect(page.getByLabel("Decoded text output")).toBeVisible();
    await expect(page.getByLabel("Normalized Morse output")).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy decoded text" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy normalized Morse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear reader" })).toBeVisible();

    for (const name of [
      "Try SOS",
      "Try HELLO WORLD",
      "Try HELP ME",
      "Try I LOVE YOU",
      "Try TEST",
    ]) {
      await expect(page.getByRole("button", { name })).toBeVisible();
    }

    for (const heading of [
      "How to read Morse code with this tool",
      "Morse reader examples",
      "Why spacing matters",
      "Reader vs decoder",
      "Common Morse reader mistakes",
      "Morse code reader FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    for (const heading of [
      "How to read Morse code with this tool",
      "Morse reader examples",
      "Why spacing matters",
      "Reader vs decoder",
      "Common Morse reader mistakes",
    ]) {
      const section = page.locator("section").filter({
        has: page.getByRole("heading", { name: heading }),
      });
      await expect(
        section.locator(
          ".mw-static-panel, .mw-static-tile, .mw-static-surface, .mw-static-surface-soft",
        ),
        `${heading} should use spacing instead of filled nested surfaces`,
      ).toHaveCount(0);
    }

    const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
    const types = records.map(schemaType);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("WebApplication");
    expect(types).toContain("FAQPage");

    const breadcrumbs = records.find((record) => schemaType(record) === "BreadcrumbList");
    const breadcrumbItems = breadcrumbs?.itemListElement as JsonLdRecord[];
    expect(breadcrumbItems).toEqual([
      expect.objectContaining({ "@type": "ListItem", position: 1, name: "Home" }),
      expect.objectContaining({
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Reader",
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

  test("decodes pasted Morse examples, shows spacing help, and clears state", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    const input = page.getByLabel("Morse code input");
    const output = page.getByLabel("Decoded text output");
    const normalized = page.getByLabel("Normalized Morse output");

    await expect(input).toHaveValue(
      ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
    );
    await input.fill("... --- ...");
    await expect(input).toHaveValue("... --- ...");
    await expect(output).toHaveText("SOS");
    await expect(normalized).toHaveText("... --- ...");

    await page.getByRole("button", { name: "Try HELLO WORLD" }).click();
    await expect(input).toHaveValue(".... . .-.. .-.. --- / .-- --- .-. .-.. -..");
    await expect(output).toHaveText("HELLO WORLD");
    await expect(normalized).toHaveText(".... . .-.. .-.. --- / .-- --- .-. .-.. -..");

    await page.getByRole("button", { name: "Try HELP ME" }).click();
    await expect(output).toHaveText("HELP ME");

    await page.getByRole("button", { name: "Try I LOVE YOU" }).click();
    await expect(output).toHaveText("I LOVE YOU");

    await page.getByRole("button", { name: "Try TEST" }).click();
    await expect(output).toHaveText("TEST");

    await input.fill("...---...");
    await expect(page.getByText("Spacing help:", { exact: false })).toBeVisible();

    await page.getByRole("button", { name: "Clear reader" }).click();
    await expect(input).toHaveValue("");
    await expect(output).toHaveText("Decoded text will appear here.");
  });

  test("sitemap, redirects, contextual links, and page links use only canonical URLs", async ({
    page,
    request,
  }) => {
    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml).toContain(CANONICAL_URL);

    for (const alias of READER_ALIASES) {
      const response = await request.get(alias, { maxRedirects: 0 });
      expect(response.status(), `${alias} status`).toBe(301);
      expect(response.headers().location, `${alias} target`).toBe(CANONICAL_PATH);
      expect(xml, `XML sitemap excludes ${alias}`).not.toContain(`${SITE_URL}${alias}`);
      expect(await response.text(), `${alias} has no JSON-LD`).not.toContain(
        "application/ld+json",
      );
    }

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    for (const href of REQUIRED_LINKS) {
      await expect(
        page.locator("main").locator(`a[href="${href}"]`).first(),
        `${href} linked from reader`,
      ).toBeVisible();
    }
    let linkedPathnames = await getLinkedPathnames(page);
    for (const href of FORBIDDEN_LINKS) {
      expect(linkedPathnames, `reader should not link ${href}`).not.toContain(href);
    }

    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    await expect(page.locator(`a[href="${CANONICAL_PATH}"]`).first()).toBeVisible();
    for (const alias of READER_ALIASES) {
      await expect(page.locator(`a[href="${alias}"]`)).toHaveCount(0);
    }

    for (const routePath of CONTEXTUAL_SOURCE_ROUTES) {
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator(`a[href="${CANONICAL_PATH}"]`).first(),
        `${routePath} links to reader`,
      ).toBeVisible();
      linkedPathnames = await getLinkedPathnames(page);
      for (const alias of READER_ALIASES) {
        expect(linkedPathnames, `${routePath} avoids ${alias}`).not.toContain(alias);
      }
    }
  });

  test("works in dark mode, passes focused axe scan, and is usable on mobile", async ({
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
    await expect(page.locator("h1")).toHaveText("Morse Code Reader");
    await page.getByRole("button", { name: "Try SOS" }).click();
    await expect(page.getByLabel("Decoded text output")).toHaveText("SOS");

    const axeResults = await new AxeBuilder({ page })
      .include('[data-testid="morse-code-reader-tool"]')
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
    await expect(page.getByLabel("Morse code input")).toBeVisible();
    await expect(page.getByLabel("Decoded text output")).toBeVisible();

    const layoutAudit = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      toolTop: document
        .querySelector('[data-testid="morse-code-reader-tool"]')
        ?.getBoundingClientRect().top,
    }));
    expect(layoutAudit.scrollWidth).toBeLessThanOrEqual(layoutAudit.clientWidth + 1);
    expect(layoutAudit.toolTop).toBeLessThan(760);
  });
});
