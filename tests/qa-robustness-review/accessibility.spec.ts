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
const ACCESSIBILITY_THEMES = ["light", "dark"] as const;
const THEME_STORAGE_KEY = "morsewords-theme";

test.describe("axe accessibility scans", () => {
  for (const theme of ACCESSIBILITY_THEMES) {
    for (const route of ACCESSIBILITY_ROUTES) {
      test(`${route} has no critical/serious axe violations in ${theme} mode`, async ({
        page,
      }, testInfo) => {
        await blockExternalNetwork(page);
        if (theme === "dark") {
          await page.addInitScript((key) => {
            try {
              window.localStorage.setItem(key, "dark");
              if (document.documentElement) {
                document.documentElement.dataset.theme = "dark";
              }
            } catch (error) {
              if (document.documentElement) {
                document.documentElement.dataset.theme = "light";
              }
            }
          }, THEME_STORAGE_KEY);
        }
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
          `axe-${theme}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.json`,
          results,
        );

        expect(serious).toEqual([]);
      });
    }
  }
});
