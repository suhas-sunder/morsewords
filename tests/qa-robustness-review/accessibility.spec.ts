import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blockExternalNetwork, writeArtifact } from "./helpers";

const ACCESSIBILITY_ROUTES = [
  "/",
  "/audio",
  "/practice",
  "/typing",
  "/morse-code-printable-chart",
  "/morse-code-word-search-builder",
  "/morse-code-word-trainer",
  "/morse-code-audio-quiz",
  "/morse-code-visual-quiz",
];

test.describe("axe accessibility scans", () => {
  for (const route of ACCESSIBILITY_ROUTES) {
    test(`${route} has no critical/serious axe violations`, async ({ page }, testInfo) => {
      await blockExternalNetwork(page);
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"])
        .analyze();
      const serious = results.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      );

      await writeArtifact(
        testInfo,
        `axe-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.json`,
        results,
      );

      expect(serious).toEqual([]);
    });
  }
});
