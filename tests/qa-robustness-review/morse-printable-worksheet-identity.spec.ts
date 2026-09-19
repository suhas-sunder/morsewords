import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROUTE = "/morse-code-printable-worksheets";
const CANONICAL_URL = `https://www.morsewords.com${ROUTE}`;
const DESCRIPTION =
  "Create custom Morse worksheets with words, sentences, student and teacher fields, optional answer keys, and PDF or image export for class or solo practice.";

async function gotoWorksheet(page: Page) {
  await blockExternalNetwork(page);
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
}

async function jsonLd(page: Page) {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((items) => items.map((item) => item.textContent ?? ""));
  return scripts.flatMap((script) => {
    const parsed = JSON.parse(script);
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}

test.describe("printable Morse worksheet identity", () => {
  test("loads existing saved settings and presets after the route move", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("morsewords-printable-chart-settings-v6", JSON.stringify({
        studentName: "Sam", teacherName: "Alex", customWords: "CAT, DOG", printMode: "worksheet", includeAnswerKey: true,
      }));
      localStorage.setItem("morsewords-printable-chart-presets-v3", JSON.stringify({
        beginner: { worksheetTitle: "Saved beginner sheet", customWords: "SUN" },
      }));
    });
    await gotoWorksheet(page);
    await expect(page.getByLabel("Student name", { exact: false })).toHaveValue("Sam");
    await expect(page.getByLabel("Teacher name", { exact: false })).toHaveValue("Alex");
    await expect(page.getByLabel("Print format", { exact: false })).toHaveValue("worksheet");
    await expect(page.getByLabel("Include answer key as the last page")).toBeChecked();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("morsewords-printable-chart-presets-v3")!).beginner.customWords)).toBe("SUN");
  });
  test("publishes a worksheet-specific identity on its new canonical URL", async ({
    page,
  }) => {
    await gotoWorksheet(page);

    await expect(page).toHaveTitle(
      "Printable Morse Code Worksheets | Custom Practice Sheets | MorseWords",
    );
    await expect(page.locator("h1")).toHaveText("Printable Morse Code Worksheets");
    await expect(page.getByText("Custom practice sheets", { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      CANONICAL_URL,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      DESCRIPTION,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Printable Morse Code Worksheets/,
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      DESCRIPTION,
    );

    const mainText = await page.locator("main").innerText();
    expect(mainText).not.toContain("Morse Code Printable Chart");
  });

  test("keeps worksheet controls and genuine chart links intact", async ({ page }) => {
    await gotoWorksheet(page);

    await expect(page.getByRole("link", { name: "Build worksheet" })).toHaveAttribute(
      "href",
      "#builder",
    );
    await expect(page.getByRole("link", { name: "Complete chart" }).first()).toHaveAttribute(
      "href",
      "/morse-code-chart",
    );
    await expect(page.getByRole("button", { name: "Download PDF" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Share" })).toBeVisible();
    await expect(page.getByLabel("Download format")).toBeVisible();
    await expect(page.locator('option[value="chart"]')).toHaveText(
      "Reference guide only",
    );
    await expect(page.getByRole("link", { name: "Browse printable Morse code charts", exact: true })).toHaveAttribute("href", "/morse-code-printable-chart");
    await expect(page.locator("[data-printable-chart]")).toHaveCount(0);
  });

  test("publishes worksheet schema and breadcrumb wording", async ({ page }) => {
    await gotoWorksheet(page);

    const records = await jsonLd(page);
    const learningResource = records.find((record) => record["@type"] === "LearningResource");
    expect(learningResource).toMatchObject({
      name: "Printable Morse Code Worksheet",
      url: CANONICAL_URL,
    });
    expect(String(learningResource?.description)).toContain(
      "printable Morse code worksheet builder",
    );

    const breadcrumb = records.find((record) => record["@type"] === "BreadcrumbList");
    const breadcrumbText = JSON.stringify(breadcrumb);
    expect(breadcrumbText).toContain("Printable Morse Code Worksheet");
    expect(breadcrumbText).not.toContain("Morse Code Printable Chart");
  });

  test("uses worksheet labels in navigation search and the HTML sitemap", async ({
    page,
  }) => {
    await blockExternalNetwork(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open navigation" }).click();
    const navDialog = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(navDialog).toBeVisible();
    await navDialog.getByRole("searchbox", { name: "Search MorseWords tools" }).fill("teacher");
    await expect(navDialog.getByRole("link", { name: "Worksheets" })).toHaveAttribute(
      "href",
      ROUTE,
    );

    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(
      page.getByRole("link", { name: "Printable Morse Code Worksheets" }),
    ).toHaveAttribute("href", ROUTE);
  });
});
