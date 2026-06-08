import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  blockExternalNetwork,
  gotoRoute,
  waitForRouteReady,
  writeArtifact,
} from "./helpers";

const ACCESSIBILITY_ROUTES = [
  "/",
  "/audio",
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-audiobooks/treasure-island",
  "/morse-code-printable-pages",
  "/morse-code-by-language",
  "/morse-code-by-language/japanese",
  "/morse-code-books/treasure-island/print",
  "/morse-code-books/alices-adventures-in-wonderland?preview=unpublished",
  "/morse-code-audio-decoder",
  "/practice",
  "/typing",
  "/morse-code-chart",
  "/morse-code-printable-chart",
  "/morse-code-word-search-builder",
  "/morse-code-word-trainer",
  "/morse-code-audio-quiz",
  "/morse-code-visual-quiz",
];
const ACCESSIBILITY_THEMES = ["light", "dark"] as const;
const THEME_STORAGE_KEY = "morsewords-theme";
const MAIN_LANDMARK_ROUTES = [
  "/",
  "/audio",
  "/morse-code-books",
  "/morse-code-audiobooks",
  "/morse-code-audiobooks/treasure-island",
  "/morse-code-printable-pages",
  "/morse-code-by-language",
  "/morse-code-by-language/japanese",
  "/morse-code-books/treasure-island/print",
  "/morse-code-books/alices-adventures-in-wonderland?preview=unpublished",
  "/practice",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/the-quick-brown-fox-morse-code",
  "/morse-code-word-separator",
  "/morse-code-words",
  "/morse-code-sentence-practice",
  "/morse-code-sound-generator",
] as const;

function routeArtifactName(route: string) {
  if (route === "/") return "home";
  return route
    .slice(1)
    .replaceAll("/", "-")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

test.describe("page landmarks", () => {
  for (const route of MAIN_LANDMARK_ROUTES) {
    test(`${route} exposes one visible main landmark`, async ({ page }) => {
      await blockExternalNetwork(page);
      await gotoRoute(page, route);

      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("main")).toBeVisible();
    });
  }
});

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
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await waitForRouteReady(page);

        const results = await new AxeBuilder({ page })
          .disableRules(["color-contrast"])
          .analyze();
        const serious = results.violations.filter((violation) =>
          ["critical", "serious"].includes(violation.impact ?? ""),
        );

        await writeArtifact(
          testInfo,
          `axe-${theme}-${routeArtifactName(route)}.json`,
          results,
        );

        expect(serious).toEqual([]);
      });
    }
  }
});
