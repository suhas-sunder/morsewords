import { expect, test, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";
import { ROUTES, absoluteUrl } from "../../app/client/data/routes";

const ROOT = process.cwd();
const APPROVED_BOOK_SLUG = "treasure-island";
const PUBLIC_TEMP_BOOK_SLUG = "alices-adventures-in-wonderland";
const MISSING_BOOK_SLUG = "missing-temp-book";
const PRINTABLE_PATH = ROUTES.printablePages;
const APPROVED_BOOK_PATH = `${ROUTES.morseBooks}/${APPROVED_BOOK_SLUG}`;
const APPROVED_PRINT_PATH = `${APPROVED_BOOK_PATH}/print`;
const PUBLIC_TEMP_PRINT_PATH = `${ROUTES.morseBooks}/${PUBLIC_TEMP_BOOK_SLUG}/print`;
const MISSING_PRINT_PATH = `${ROUTES.morseBooks}/${MISSING_BOOK_SLUG}/print`;

async function gotoPrintable(page: Page, route: string) {
  await blockExternalNetwork(page);
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  if (response?.ok() && (route === PRINTABLE_PATH || route.endsWith("/print"))) {
    await expect(page.getByTestId("printable-morse-pages")).toHaveAttribute(
      "data-mw-print-client-ready",
      "true",
    );
  }
  return response;
}

async function parseJsonLd(page: Page) {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => JSON.parse(script.textContent || "{}")),
    );
  return blocks.flat();
}

async function saveScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const screenshotPath = testInfo.outputPath(name);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await testInfo.attach(name, {
    path: screenshotPath,
    contentType: "image/png",
  });
}

test.describe("printable Morse pages foundation", () => {
  test("custom printable page converts text, changes layouts, renders QR, and hides controls for print", async ({
    page,
  }, testInfo) => {
    const response = await gotoPrintable(page, PRINTABLE_PATH);
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(new RegExp(`${PRINTABLE_PATH}$`));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      absoluteUrl(PRINTABLE_PATH),
    );

    const customInput = page.getByLabel("Paste custom text for printable Morse pages");
    await expect(customInput).toBeVisible();
    await customInput.click();
    await customInput.fill("SOS TEST");
    await expect(customInput).toHaveValue("SOS TEST");
    const preview = page.getByTestId("printable-preview");
    await expect(preview).toContainText("SOS TEST");
    await expect(preview).toContainText("... --- ... / - . ... -");

    await page.getByTestId("printable-layout-side-by-side").click();
    await expect(page.getByTestId("printable-layout-side-by-side")).toHaveClass(
      /mw-button-primary/,
    );
    await page.getByTestId("printable-output-morse").click();
    await expect(page.getByTestId("printable-output-morse")).toHaveClass(
      /mw-button-primary/,
    );
    await expect(page.getByTestId("printable-print-button")).toBeVisible();
    await expect(page.getByTestId("printable-qr")).toContainText(
      absoluteUrl(PRINTABLE_PATH),
    );

    const schemaText = JSON.stringify(await parseJsonLd(page));
    expect(schemaText).toContain('"@type":"WebPage"');
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain("reviewRating");
    expect(schemaText).not.toContain('"price"');
    expect(schemaText).not.toContain('"offers"');

    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".mw-nav-shell")).toBeHidden();
    await expect(page.getByTestId("printable-print-button")).toBeHidden();
    await expect(page.getByTestId("printable-page").first()).toBeVisible();

    await page.emulateMedia({ media: "screen" });
    await saveScreenshot(page, testInfo, "printable-morse-pages-custom.png");
  });

  test("approved book print route loads one public book, selects sections, and exposes source notes", async ({
    page,
  }, testInfo) => {
    const sectionJsonRequests: string[] = [];
    page.on("request", (request) => {
      if (
        request.url().includes("/sections/") ||
        request.url().includes("/chapter-")
      ) {
        sectionJsonRequests.push(request.url());
      }
    });

    const response = await gotoPrintable(page, APPROVED_PRINT_PATH);
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(new RegExp(`${APPROVED_PRINT_PATH}$`));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      absoluteUrl(APPROVED_PRINT_PATH),
    );
    await expect(page.getByTestId("printable-morse-pages")).toHaveAttribute(
      "data-mw-print-source",
      "approved-book-json",
    );
    await expect(page.getByTestId("printable-morse-pages")).toHaveAttribute(
      "data-mw-print-book-slug",
      APPROVED_BOOK_SLUG,
    );
    expect(sectionJsonRequests).toEqual([]);

    await expect(page.getByRole("heading", { name: /Treasure Island printable Morse pages/i })).toBeVisible();
    await expect(
      page.getByTestId("printable-page").first().getByText("Robert Louis Stevenson", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByTestId("printable-preview")).toContainText("MorseWords.com");
    await expect(
      page.getByTestId("printable-page").first().locator('a[href*="gutenberg.org"]'),
    ).toHaveCount(1);
    await expect(page.locator("main")).not.toContainText(
      "START OF THE PROJECT GUTENBERG",
    );
    await expect(page.locator("main")).not.toContainText(
      "Project Gutenberg License",
    );

    await page.getByRole("button", { name: "Selected sections" }).click();
    const enabledCheckbox = page.locator('input[type="checkbox"]:not(:disabled)').first();
    await expect(enabledCheckbox).toBeVisible();
    await enabledCheckbox.uncheck();
    await enabledCheckbox.check();
    await expect(page.getByTestId("printable-preview")).toContainText("Page 1 of");

    await page.getByRole("button", { name: "Full book" }).click();
    await expect(page.getByRole("button", { name: "Full book" })).toHaveClass(
      /mw-button-primary/,
    );

    const schemaText = JSON.stringify(await parseJsonLd(page));
    expect(schemaText).toContain('"@type":"WebPage"');
    expect(schemaText).toContain('"@type":"Book"');
    expect(schemaText).not.toContain("aggregateRating");
    expect(schemaText).not.toContain("reviewRating");
    expect(schemaText).not.toContain('"price"');
    expect(schemaText).not.toContain('"offers"');

    await saveScreenshot(page, testInfo, "printable-morse-pages-book.png");
  });

  test("public safety, sitemap entries, and book cross-links cover processed temp books", async ({
    page,
    request,
  }) => {
    const notFound = await gotoPrintable(page, MISSING_PRINT_PATH);
    expect(notFound?.status()).toBe(404);

    const bookResponse = await gotoPrintable(page, APPROVED_BOOK_PATH);
    expect(bookResponse?.ok()).toBe(true);
    await expect(page.getByTestId("morse-book-print-link")).toHaveAttribute(
      "href",
      APPROVED_PRINT_PATH,
    );

    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain(absoluteUrl(PRINTABLE_PATH));
    expect(xml).toContain(absoluteUrl(APPROVED_PRINT_PATH));
    expect(xml).toContain(absoluteUrl(PUBLIC_TEMP_PRINT_PATH));
    expect(xml).not.toContain(absoluteUrl(MISSING_PRINT_PATH));

    const staticSitemap = fs.readFileSync(
      path.join(ROOT, "public", "sitemap.xml"),
      "utf8",
    );
    expect(staticSitemap).toContain(absoluteUrl(PRINTABLE_PATH));
    expect(staticSitemap).toContain(absoluteUrl(APPROVED_PRINT_PATH));
    expect(staticSitemap).toContain(absoluteUrl(PUBLIC_TEMP_PRINT_PATH));
    expect(staticSitemap).not.toContain(absoluteUrl(MISSING_PRINT_PATH));

    await gotoPrintable(page, ROUTES.sitemap);
    const htmlLinks = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) =>
        new URL(
          (anchor as HTMLAnchorElement).getAttribute("href") || "",
          window.location.origin,
        ).pathname,
      ),
    );
    expect(htmlLinks).toContain(PRINTABLE_PATH);
    expect(htmlLinks).toContain(APPROVED_PRINT_PATH);
    expect(htmlLinks).toContain(PUBLIC_TEMP_PRINT_PATH);
    expect(htmlLinks).not.toContain(MISSING_PRINT_PATH);
  });
});
