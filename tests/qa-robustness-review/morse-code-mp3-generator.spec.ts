import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  REDIRECT_PATHS,
  blockExternalNetwork,
  collectConsoleErrors,
  isExpectedHarnessConsoleEntry,
  MP3_ALIAS_PATHS,
  sameHostPathnamesInText,
  sitemapLocs,
  waitForRouteReady,
} from "./helpers";

const CANONICAL_PATH = "/morse-code-mp3-generator";
const CANONICAL_URL = `https://www.morsewords.com${CANONICAL_PATH}`;
const THEME_STORAGE_KEY = "morsewords-theme";

const REQUIRED_LINKS = [
  "/audio",
  "/morse-code-sound-generator",
  "/morse-code-book-translator",
  "/morse-code-video-generator",
  "/morse-code-audio-decoder",
  "/morse-code-timing",
  "/farnsworth-timing",
] as const;

const REQUIRED_FAQ_QUESTIONS = [
  "Can I download Morse code as an MP3 file?",
  "Can I download WAV instead of MP3?",
  "Which format should I choose, MP3 or WAV?",
  "What MP3 bitrate should I use for Morse code?",
  "Why is a long Morse MP3 file still large?",
  "Does ZIP make MP3 files smaller?",
  "Can I convert a whole book into Morse MP3 files?",
  "Can I change the pitch or tone?",
  "Can I change the speed and Farnsworth spacing?",
  "Is my text uploaded to a server?",
  "Can I convert an MP3 back into Morse text?",
] as const;

type JsonLdRecord = Record<string, unknown>;

function filterHarnessConsoleNoise(
  entries: Array<{ type: string; text: string }>,
) {
  return entries.filter((entry) => !isExpectedHarnessConsoleEntry(entry.text));
}

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

async function visibleMp3FaqQuestions(page: Page) {
  const faqSection = page
    .locator("#faq section")
    .filter({
      has: page.getByRole("heading", {
        name: "Morse code MP3 generator FAQ",
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

async function relatedToolsSection(page: Page) {
  const section = page
    .locator("section")
    .filter({
      has: page.getByRole("heading", {
        name: "Related Morse audio tools",
      }),
    });
  await expect(section).toHaveCount(1);
  return section;
}

test.describe("Morse code MP3 generator", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, useful tool controls, FAQ, and JSON-LD", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page).toHaveTitle(
      "Morse Code MP3 Generator | Download MP3 or WAV Audio | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse Code MP3 Generator");
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
    expect(description).toContain("downloadable Morse audio");
    expect(description).toContain("MP3");
    expect(description).toContain("WAV");
    expect(description).toContain("Farnsworth");
    expect(description).toContain("tone");
    expect(description).toContain("bitrate");

    await expect(page.getByLabel("Message to turn into MP3 audio")).toBeVisible();
    await expect(page.getByRole("button", { name: "Play audio" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download WAV" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sound" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Repeat" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Flash Light" })).toBeVisible();
    await expect(page.getByLabel("Tone preset")).toBeVisible();
    await expect(page.getByLabel("Attack")).toBeVisible();
    await expect(page.getByLabel("Release")).toBeVisible();
    await expect(page.getByLabel("Tail padding")).toBeVisible();

    for (const heading of [
      "How the MP3 generator works",
      "MP3 vs WAV for downloadable Morse audio",
      "Settings that change the audio",
      "MP3 bitrate and ZIP expectations",
      "Practical download notes",
      "Which Morse audio tool to use",
      "Related Morse audio tools",
      "Morse code MP3 generator FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    const fileSizeSection = page
      .locator("section")
      .filter({
        has: page.getByRole("heading", {
          name: "MP3 bitrate and ZIP expectations",
        }),
      });
    await expect(fileSizeSection).toHaveCount(1);
    await expect(fileSizeSection.getByRole("heading", { name: "32 kbps" })).toBeVisible();
    await expect(fileSizeSection.getByRole("heading", { name: "48 kbps" })).toBeVisible();
    await expect(fileSizeSection.getByRole("heading", { name: "128 kbps" })).toBeVisible();
    await expect(
      fileSizeSection.getByText("ZIP does not meaningfully compress an MP3"),
    ).toBeVisible();

    const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
    for (const expectedSchemaType of ["WebApplication", "BreadcrumbList", "FAQPage"]) {
      expect(
        records.some((record) => schemaType(record) === expectedSchemaType),
        expectedSchemaType,
      ).toBe(true);
    }
    expect(records.filter((record) => schemaType(record) === "FAQPage")).toHaveLength(
      1,
    );
  });

  test("exports real MP3 on demand and keeps WAV export available", async ({
    page,
  }) => {
    const requestedUrls: string[] = [];
    page.on("request", (request) => requestedUrls.push(request.url()));
    await page.addInitScript(() => {
      const originalCreateObjectUrl = URL.createObjectURL.bind(URL);
      const captures: Array<{ size: number; type: string }> = [];
      URL.createObjectURL = (object: Blob | MediaSource) => {
        if (object instanceof Blob) {
          captures.push({ size: object.size, type: object.type });
        }
        return originalCreateObjectUrl(object);
      };
      Object.defineProperty(window, "__mwDownloadBlobs", {
        value: captures,
        configurable: true,
      });
    });

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(page.locator("[data-mw-mp3-tool-ready='true']")).toBeVisible();
    expect(
      requestedUrls.filter((url) => /lame|mp3-encoder/i.test(url)),
      "MP3 encoder should not load during initial render",
    ).toHaveLength(0);

    const messageInput = page.getByLabel("Message to turn into MP3 audio");
    await messageInput.fill("SOS");
    await expect(messageInput).toHaveValue("SOS");
    await page.getByLabel("File name").fill("morse-code");

    const mp3Download = page.waitForEvent("download", { timeout: 30_000 });
    await page.getByRole("button", { name: "Download MP3" }).click();
    const download = await mp3Download;
    expect(download.suggestedFilename()).toBe("morse-code.mp3");
    await expect(page.getByText("MP3 download started.")).toBeVisible();

    const mp3Blobs = await page.evaluate(
      () => (window as any).__mwDownloadBlobs as Array<{ size: number; type: string }>,
    );
    const mp3Blob = mp3Blobs.at(-1);
    expect(mp3Blob?.type).toBe("audio/mpeg");
    expect(mp3Blob?.size ?? 0).toBeGreaterThan(100);

    const wavDownload = page.waitForEvent("download", { timeout: 30_000 });
    await page.getByRole("button", { name: "Download WAV" }).click();
    const wav = await wavDownload;
    expect(wav.suggestedFilename()).toBe("morse-code.wav");

    const blobs = await page.evaluate(
      () => (window as any).__mwDownloadBlobs as Array<{ size: number; type: string }>,
    );
    expect(blobs.at(-1)?.type).toBe("audio/wav");
  });

  test("handles unsupported and long input without crashing", async ({ page }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-mw-mp3-tool-ready='true']")).toBeVisible();

    await page
      .getByLabel("Message to turn into MP3 audio")
      .fill(`SOS 😀 ${"HELLO WORLD ".repeat(120)}`);

    await expect(page.getByText(/Unsupported characters are ignored:/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeEnabled();
    expect(filterHarnessConsoleNoise(consoleEntries)).toEqual([]);
  });

  test("sitemap, redirects, contextual links, and page links use canonical URLs", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    await expect(page.locator(`a[href="${CANONICAL_PATH}"]`).first()).toBeVisible();

    for (const alias of MP3_ALIAS_PATHS) {
      await expect(page.locator(`a[href="${alias}"]`)).toHaveCount(0);
    }

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    const locs = sitemapLocs(xml);
    expect(xml).toContain(CANONICAL_URL);
    for (const alias of MP3_ALIAS_PATHS) {
      expect(locs).not.toContain(`https://www.morsewords.com${alias}`);
    }

    for (const alias of MP3_ALIAS_PATHS) {
      const response = await request.get(alias, { maxRedirects: 0 });
      expect(response.status(), `${alias} status`).toBe(301);
      expect(response.headers().location, `${alias} location`).toBe(
        CANONICAL_PATH,
      );
    }

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const mainHrefs = await page.locator("main a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? ""),
    );
    for (const href of REQUIRED_LINKS) {
      await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
      expect(mainHrefs, href).toContain(href);
    }
    for (const alias of REDIRECT_PATHS) {
      expect(mainHrefs, `MP3 generator avoids redirect alias ${alias}`).not.toContain(
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
    const schemaQuestions = (faqPage.mainEntity as JsonLdRecord[]).map(itemName);
    const visibleQuestions = await visibleMp3FaqQuestions(page);
    expect(schemaQuestions).toEqual(visibleQuestions);
    for (const question of REQUIRED_FAQ_QUESTIONS) {
      expect(schemaQuestions, question).toContain(question);
    }

    const schemaText = JSON.stringify(parsedJsonLd);
    const schemaPaths = sameHostPathnamesInText(schemaText);
    expect(schemaText).toContain(CANONICAL_URL);
    expect(schemaText).not.toContain(`${CANONICAL_URL}?`);
    for (const alias of MP3_ALIAS_PATHS) {
      expect(schemaPaths).not.toContain(alias);
    }
  });

  test("works in dark mode, passes focused axe scan, and is usable on mobile", async ({
    page,
  }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
    }, THEME_STORAGE_KEY);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByLabel("Message to turn into MP3 audio")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const axeResults = await new AxeBuilder({ page })
      .include("main")
      .disableRules(["color-contrast"])
      .analyze();
    expect(
      axeResults.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
    expect(filterHarnessConsoleNoise(consoleEntries)).toEqual([]);
  });

  test("keeps touched related-tool links readable on dark hover", async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
      document.documentElement.dataset.theme = "dark";
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
      "hovered related link contrast",
    ).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });
});
