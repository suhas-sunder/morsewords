import { expect, test, type Page, type TestInfo } from "@playwright/test";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
} from "./helpers";

type JsonLdRecord = Record<string, unknown>;

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
  const record = value as JsonLdRecord;
  return typeof record?.name === "string" ? record.name : "";
}

async function parseJsonLd(page: Page) {
  const scriptTexts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? "").filter(Boolean),
    );
  expect(scriptTexts.length).toBeGreaterThan(0);
  return scriptTexts.map((text) => JSON.parse(text));
}

async function visibleFaqQuestions(page: Page) {
  return page.locator("#faq details summary > span:first-child").allTextContents();
}

async function expectRouteSchemaAndFaq({
  aliasPath,
  canonicalPath,
  page,
  titlePattern,
}: {
  aliasPath: string;
  canonicalPath: string;
  page: Page;
  titlePattern: RegExp | string;
}) {
  const canonical = absoluteUrl(canonicalPath);
  const alias = absoluteUrl(aliasPath);

  await expect(page).toHaveTitle(titlePattern);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    canonical,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonical,
  );

  const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
  const faqPages = records.filter((record) => schemaType(record) === "FAQPage");
  expect(faqPages).toHaveLength(1);
  expect(records.map(schemaType)).toContain("WebApplication");
  expect(records.map(schemaType)).toContain("BreadcrumbList");

  const allSchemaText = JSON.stringify(records);
  expect(allSchemaText).toContain(canonical);
  expect(allSchemaText).not.toContain(alias);

  const webApplication = records.find(
    (record) => schemaType(record) === "WebApplication",
  );
  expect(webApplication?.url).toBe(canonical);

  const breadcrumb = records.find(
    (record) => schemaType(record) === "BreadcrumbList",
  );
  expect(JSON.stringify(breadcrumb)).toContain(canonical);

  const visibleQuestions = (await visibleFaqQuestions(page)).map((question) =>
    question.trim(),
  );
  expect(visibleQuestions.length).toBeGreaterThan(10);
  expect(new Set(visibleQuestions).size).toBe(visibleQuestions.length);

  const schemaQuestions = ((faqPages[0].mainEntity as JsonLdRecord[]) ?? []).map(
    itemName,
  );
  expect(schemaQuestions).toEqual(visibleQuestions);
}

test.describe("new book and video route SEO FAQ schema", () => {
  test("book translator renders useful SEO sections, FAQ, canonical schema, and core tool states", async ({
    page,
  }, testInfo: TestInfo) => {
    const consoleEntries = collectConsoleErrors(page);
    await blockExternalNetwork(page);
    await page.goto(ROUTES.bookTranslator, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(
      page.locator("[data-mw-book-export-ready='true']"),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Book to Morse Code Translator",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Choose a source that will convert cleanly",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "One audio file by default, split parts by choice",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Use source text responsibly" }),
    ).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();

    await expectRouteSchemaAndFaq({
      aliasPath: ROUTES.ebookTranslatorAlias,
      canonicalPath: ROUTES.bookTranslator,
      page,
      titlePattern: /Book to Morse Code Translator \| Long Text to Morse Audio/,
    });

    await page
      .getByLabel("Paste long-form source text")
      .fill("Project Gutenberg practice text\nSOS HELP");
    await expect(page.getByRole("button", { name: /Download (MP3|WAV)/ })).toBeVisible();
    await page.getByRole("radio", { name: "Video", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Video preview", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    expect(consoleEntries, testInfo.title).toEqual([]);
  });

  test("video generator renders useful SEO sections, FAQ, canonical schema, and core tool states", async ({
    page,
  }, testInfo: TestInfo) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript(() => {
      class FakeMediaRecorder {
        static isTypeSupported(type: string) {
          return type.startsWith("video/webm");
        }

        state = "inactive";
        ondataavailable: ((event: BlobEvent) => void) | null = null;
        onstop: (() => void) | null = null;
        readonly mimeType: string;

        constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
          this.mimeType = options?.mimeType || "video/webm";
        }

        start() {
          this.state = "recording";
        }

        stop() {
          this.state = "inactive";
          window.setTimeout(() => {
            this.ondataavailable?.({
              data: new Blob(["WEBM"], { type: this.mimeType }),
            } as BlobEvent);
            this.onstop?.();
          }, 0);
        }
      }

      Object.defineProperty(window, "MediaRecorder", {
        configurable: true,
        value: FakeMediaRecorder,
      });
      HTMLCanvasElement.prototype.captureStream = function captureStream() {
        return new MediaStream();
      };
    });
    await blockExternalNetwork(page);
    await page.goto(ROUTES.videoGenerator, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(
      page.locator("[data-mw-video-generator-ready='true']"),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Morse Code Video Generator",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Turn text or pasted Morse into WebM" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Choose how the Morse signal appears" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Keep the clip short, local, and viewer-friendly",
      }),
    ).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();

    await expectRouteSchemaAndFaq({
      aliasPath: ROUTES.textToMorseVideoAlias,
      canonicalPath: ROUTES.videoGenerator,
      page,
      titlePattern:
        "Morse Code Video Generator | Text to Morse Code Video | MorseWords",
    });

    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("SOS VIDEO");
    await expect(page.getByLabel("Generated Morse output")).toHaveValue(/\.{3}/);
    await expect(page.getByTestId("morse-video-preview")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeEnabled();
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

    await page.setViewportSize({ width: 390, height: 844 });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    expect(consoleEntries, testInfo.title).toEqual([]);
  });
});
