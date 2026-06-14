import { expect, test, type Page } from "@playwright/test";

import { ROUTES } from "../../app/client/data/routes";
import { MORSEWORDS_SUPPORT_EMAIL } from "../../app/client/data/siteTrust";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const staticTrustPages = [
  {
    path: ROUTES.contact,
    footerLabel: "Contact",
    heading: "Contact MorseWords",
    requiredText: MORSEWORDS_SUPPORT_EMAIL,
  },
  {
    path: ROUTES.privacy,
    footerLabel: "Privacy",
    heading: "Privacy Policy",
    requiredText: "does not currently provide user accounts",
  },
  {
    path: ROUTES.terms,
    footerLabel: "Terms",
    heading: "Terms of Use",
    requiredText: "does not guarantee",
  },
  {
    path: ROUTES.cookies,
    footerLabel: "Cookies",
    heading: "Cookie Policy",
    requiredText: "localStorage",
  },
  {
    path: ROUTES.sources,
    footerLabel: "Sources",
    heading: "Sources and public domain notes",
    requiredText: "Project Gutenberg",
  },
] as const;

async function gotoStaticPage(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
}

test.describe("contact and legal foundation", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("static trust routes load with expected headings and copy", async ({
    page,
  }) => {
    for (const staticPage of staticTrustPages) {
      await gotoStaticPage(page, staticPage.path);
      await expect(
        page.getByRole("heading", { name: staticPage.heading, level: 1 }),
      ).toBeVisible();
      await expect(page.locator("main")).toContainText(staticPage.requiredText);
    }
  });

  test("contact page exposes mailto support and no contact form", async ({
    page,
  }) => {
    await gotoStaticPage(page, ROUTES.contact);

    await expect(
      page
        .locator("main")
        .locator(`a[href="mailto:${MORSEWORDS_SUPPORT_EMAIL}"]`),
    ).toBeVisible();
    await expect(
      page.locator(
        'main form, main textarea, main input, main button[type="submit"]',
      ),
    ).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("Resend");
  });

  test("homepage footer exposes trust links and they navigate", async ({
    page,
  }) => {
    for (const staticPage of staticTrustPages) {
      await gotoStaticPage(page, ROUTES.home);
      const footerLink = page
        .locator("footer")
        .getByRole("link", { name: staticPage.footerLabel, exact: true });

      await expect(footerLink).toHaveAttribute("href", staticPage.path);
      await footerLink.click();
      await waitForRouteReady(page);
      await expect
        .poll(() => new URL(page.url()).pathname)
        .toBe(staticPage.path);
      await expect(
        page.getByRole("heading", { name: staticPage.heading, level: 1 }),
      ).toBeVisible();
    }
  });
});
