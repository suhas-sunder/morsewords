import { expect, test } from "@playwright/test";

import {
  blockExternalNetwork,
  collectConsoleErrors,
  gotoRoute,
} from "./helpers";

const ROUTES = [
  { path: "/", h1: "Morse Code Translator", finalPath: "/" },
  { path: "/audio", h1: "Morse Code Audio Generator", finalPath: "/audio" },
  {
    path: "/morse-code-sound-generator",
    h1: "Morse Code Sound Generator",
    finalPath: "/morse-code-sound-generator",
  },
  {
    path: "/morse-code-mp3-generator",
    h1: "Morse Code MP3 Generator",
    finalPath: "/morse-code-mp3-generator",
  },
  {
    path: "/morse-code-audio-decoder",
    h1: "Morse Code Audio Decoder",
    finalPath: "/morse-code-audio-decoder",
  },
  {
    path: "/morse-code-audio-practice",
    h1: "Morse Code Audio Practice",
    finalPath: "/morse-code-audio-practice",
  },
  {
    path: "/morse-code-audio-quiz",
    h1: "Morse Code Audio Quiz",
    finalPath: "/morse-code-audio-quiz",
  },
  {
    path: "/morse-code-visual-practice",
    h1: "Morse Code Visual Practice",
    finalPath: "/morse-code-visual-practice",
  },
  {
    path: "/morse-code-visual-quiz",
    h1: "Morse Code Visual Quiz",
    finalPath: "/morse-code-visual-quiz",
  },
  {
    path: "/morse-code-word-trainer",
    h1: "Morse Code Word Trainer",
    finalPath: "/morse-code-word-trainer",
  },
  {
    path: "/morse-code-typing-test",
    h1: "Morse Code Test",
    finalPath: "/morse-code-test",
  },
  {
    path: "/morse-code-word-game",
    h1: "Morse Code Word Trainer",
    finalPath: "/morse-code-word-trainer",
  },
  {
    path: "/morse-code-word-search-builder",
    h1: "Morse Code Word Search Builder",
    finalPath: "/morse-code-word-search-builder",
  },
  {
    path: "/morse-code-chart",
    h1: "Morse Code Chart",
    finalPath: "/morse-code-chart",
  },
  {
    path: "/morse-code-printable-chart",
    h1: "Morse Code Printable Chart",
    finalPath: "/morse-code-printable-chart",
  },
  {
    path: "/morse-code-reader",
    h1: "Morse Code Reader",
    finalPath: "/morse-code-reader",
  },
  {
    path: "/morse-code-dictionary",
    h1: "Morse Code Dictionary",
    finalPath: "/dictionary",
  },
  {
    path: "/morse-code-word-separator",
    h1: "Morse code word separator",
    finalPath: "/morse-code-word-separator",
  },
] as const;

test.describe("final production readiness route smoke", () => {
  for (const route of ROUTES) {
    test(`${route.path} loads controls without console regressions`, async ({
      page,
    }) => {
      await blockExternalNetwork(page);
      const consoleEntries = collectConsoleErrors(page);
      const response = await gotoRoute(page, route.path);

      expect(response?.status(), `${route.path} HTTP status`).toBeLessThan(400);
      await expect(page).toHaveURL(new RegExp(`${route.finalPath}$`));
      await expect(page.locator("h1")).toHaveText(route.h1);
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

      const audit = await page.evaluate(() => {
        const visible = (element: Element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          );
        };
        const namelessButtons = Array.from(document.querySelectorAll("button"))
          .filter(visible)
          .filter((button) => {
            const label =
              button.getAttribute("aria-label") ||
              button.getAttribute("title") ||
              button.textContent ||
              "";
            return !label.trim();
          })
          .map((button) => button.outerHTML.slice(0, 160));

        const disabledPointerButtons = Array.from(
          document.querySelectorAll('button:disabled, button[aria-disabled="true"]'),
        )
          .filter(visible)
          .filter((button) => getComputedStyle(button).cursor === "pointer")
          .map((button) =>
            (
              button.textContent ||
              button.getAttribute("aria-label") ||
              button.outerHTML
            )
              .trim()
              .slice(0, 120),
          );

        const fullScreenFixedPanels = Array.from(document.querySelectorAll("body *"))
          .filter(visible)
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return (
              style.position === "fixed" &&
              style.pointerEvents !== "none" &&
              rect.width >= window.innerWidth * 0.9 &&
              rect.height >= window.innerHeight * 0.9
            );
          })
          .map((element) => element.outerHTML.slice(0, 160));

        return {
          overflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 2,
          visibleControlCount: Array.from(
            document.querySelectorAll("button, input, textarea, select, a[href]"),
          ).filter(visible).length,
          namelessButtons,
          disabledPointerButtons,
          fullScreenFixedPanels,
        };
      });

      expect(audit.overflow, `${route.path} horizontal overflow`).toBe(false);
      expect(audit.visibleControlCount, `${route.path} controls`).toBeGreaterThan(0);
      expect(audit.namelessButtons, `${route.path} nameless buttons`).toEqual([]);
      expect(
        audit.disabledPointerButtons,
        `${route.path} disabled pointer buttons`,
      ).toEqual([]);
      expect(
        audit.fullScreenFixedPanels,
        `${route.path} full-screen fixed panels`,
      ).toEqual([]);
      expect(consoleEntries, `${route.path} console entries`).toEqual([]);
    });
  }
});
