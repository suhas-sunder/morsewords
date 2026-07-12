import { expect, test, type Page } from "@playwright/test";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROUTE = "/morse-code-printable-chart";
const CANONICAL_URL = `https://www.morsewords.com${ROUTE}`;
const DESCRIPTION =
  "Create a printable Morse code worksheet with custom words, sentences, student fields, optional answer keys, and PDF or image export for class or solo practice.";

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
  test("uses worksheet identity while preserving the existing canonical URL", async ({
    page,
  }) => {
    await gotoWorksheet(page);

    await expect(page).toHaveTitle(
      "Printable Morse Code Worksheet | Practice Sheet Generator | MorseWords",
    );
    await expect(page.locator("h1")).toHaveText("Printable Morse Code Worksheet");
    await expect(page.getByText("Printable worksheet").first()).toBeVisible();
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
      /Printable Morse Code Worksheet/,
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
    await expect(page.locator("main")).not.toContainText("Printable chart");
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
