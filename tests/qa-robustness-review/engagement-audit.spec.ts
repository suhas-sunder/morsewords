import fs from "node:fs";
import path from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { textToMorse } from "../../app/client/components/shared/morseUtils";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  gotoRoute,
  waitForRouteReady,
} from "./helpers";

const AUDIT_REPORT = path.join(
  process.cwd(),
  "docs",
  "morsewords-analytics-engagement-audit.md",
);

const PRIORITY_ROUTES = [
  "/morse-code-encoder",
  "/morse-code-chart",
  "/morse-code-numbers",
  "/morse-code-alphabet",
  "/dictionary",
  "/international-morse-code-reference",
  "/how-to-use",
  "/how-to-separate-words-in-morse-code",
  "/morse-code-visual-quiz",
  "/morse-code-practice-plan",
  "/contact",
] as const;

const CHANGED_ROUTES = [
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/dictionary",
  "/international-morse-code-reference",
  "/how-to-separate-words-in-morse-code",
  "/morse-code-visual-quiz",
] as const;

const ABOVE_FOLD_TARGETS = [
  { route: "/morse-code-encoder", selector: "#plainA", label: "encoder text input" },
  {
    route: "/morse-code-chart",
    selector: '[data-chart-section="letters"]',
    label: "letter chart",
  },
  {
    route: "/morse-code-numbers",
    selector: "text=The Morse number chart is",
    label: "number direct answer",
  },
  { route: "/morse-code-alphabet", selector: "#letters", label: "alphabet chart" },
  { route: "/dictionary", selector: "#dictionary-filter", label: "dictionary filter" },
  {
    route: "/international-morse-code-reference",
    selector: 'main a[href="/morse-code-numbers"]',
    label: "reference number quick link",
  },
  {
    route: "/how-to-separate-words-in-morse-code",
    selector: 'main a[href="/morse-code-word-separator"]',
    label: "word separator next step",
  },
  {
    route: "/morse-code-visual-quiz",
    selector: 'main a[href="#visual-quiz"]',
    label: "visual quiz start link",
  },
] as const;

const ADDED_LINKS = [
  {
    source: "/morse-code-chart",
    href: "/morse-code-by-language",
    label: "Morse by language",
  },
  {
    source: "/morse-code-chart",
    href: "/morse-code-audio-practice",
    label: "Audio practice",
  },
  {
    source: "/morse-code-alphabet",
    href: "/morse-code-printable-chart",
    label: "Printable chart",
  },
  {
    source: "/morse-code-alphabet",
    href: "/morse-code-audio-practice",
    label: "Audio practice",
  },
  {
    source: "/morse-code-alphabet",
    href: "/morse-code-by-language",
    label: "Morse by language",
  },
  {
    source: "/international-morse-code-reference",
    href: "/morse-code-numbers",
    label: "Number chart",
  },
  {
    source: "/international-morse-code-reference",
    href: "/morse-code-prosigns",
    label: "Prosigns",
  },
  {
    source: "/international-morse-code-reference",
    href: "/practice",
    label: "Practice",
  },
  {
    source: "/how-to-separate-words-in-morse-code",
    href: "/morse-code-timing",
    label: "Timing guide",
  },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

async function expectAboveFold(page: Page, selector: string, label: string) {
  const locator = page.locator(selector).first();
  await expect(locator, label).toBeVisible();
  const position = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { bottom: rect.bottom, top: rect.top, viewportHeight: window.innerHeight };
  });
  expect(position.top, `${label} starts before viewport bottom`).toBeLessThan(
    position.viewportHeight,
  );
  expect(position.bottom, `${label} enters first viewport`).toBeGreaterThan(0);
}

test.describe("analytics engagement audit coverage", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("audit report exists and covers the priority pages", async () => {
    const report = fs.readFileSync(AUDIT_REPORT, "utf8");

    expect(report).toContain("Frustrated-click, rage-click, dead-click, and error rows");
    expect(report).toMatch(/not available to\s+this local Codex run/);
    for (const route of PRIORITY_ROUTES) {
      expect(report, `${route} is listed`).toContain(`| \`${route}\``);
    }
  });

  test("encoder input, output, and copy controls work", async ({ page }) => {
    await gotoRoute(page, "/morse-code-encoder");
    await page.waitForLoadState("networkidle");

    const input = page.locator("#plainA");
    const output = page.locator("#mw_output");
    await expect(input).toBeVisible();
    await expect(output).toBeVisible();

    await input.fill("HELLO 123");
    await expect(input).toHaveValue("HELLO 123");
    await expect(output).toHaveValue(textToMorse("HELLO 123"));

    const copyOutput = page.getByRole("button", { name: "Copy Output" });
    await expect(copyOutput).toBeVisible();
    await copyOutput.click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save Audio" })).toBeVisible();
  });

  for (const { label, route, selector } of ABOVE_FOLD_TARGETS) {
    test(`${route} keeps the primary answer or tool above the fold`, async ({
      page,
    }) => {
      const consoleEntries = collectConsoleErrors(page);
      const response = await gotoRoute(page, route);

      expect(response?.status(), `${route} status`).toBeLessThan(400);
      await expectAboveFold(page, selector, label);
      expect(consoleEntries, `${route} console errors`).toEqual([]);
    });
  }

  test("dictionary empty search has recovery feedback", async ({ page }) => {
    await gotoRoute(page, "/dictionary");

    const filter = page.getByLabel("Filter dictionary");
    await filter.fill("zzzzzz-not-a-match");

    await expect(page.getByText("0 matches")).toBeVisible();
    await expect(page.getByText("No character matches")).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear filter" })).toBeVisible();

    await page.getByRole("button", { name: "Clear filter" }).click();
    await expect(filter).toHaveValue("");
    await expect(page.getByText("0 matches")).toHaveCount(0);
  });

  test("visual quiz mobile start action and strobe warning are visible before flashing", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, "/morse-code-visual-quiz");

    await expect(page.getByRole("link", { name: "Start quiz" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Share results" })).toHaveCount(0);
    await page.getByRole("link", { name: "Start quiz" }).click();

    await expect(
      page.locator("#visual-quiz").getByText("Strobe warning:", { exact: false }).first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Flash prompt" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("new next-step links point to real routes", async ({ page, request }) => {
    for (const item of ADDED_LINKS) {
      await gotoRoute(page, item.source);
      const link = page.locator(`main a[href="${item.href}"]`).filter({
        hasText: item.label,
      });
      await expect(link.first(), `${item.source} -> ${item.href}`).toBeVisible();

      const response = await request.get(item.href);
      expect(response.status(), `${item.href} status`).toBeLessThan(400);
    }
  });

  test("changed priority pages have no mobile overflow and pass focused axe scans", async ({
    page,
  }) => {
    for (const route of CHANGED_ROUTES) {
      await page.setViewportSize({ width: 390, height: 844 });
      await gotoRoute(page, route);
      await expectNoHorizontalOverflow(page);

      await page.setViewportSize({ width: 1440, height: 1000 });
      await gotoRoute(page, route);
      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"])
        .analyze();
      const serious = results.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      );
      expect(serious, `${route} serious axe violations`).toEqual([]);
    }
  });

  test("changed priority pages render in dark mode", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });

    for (const route of CHANGED_ROUTES) {
      await gotoRoute(page, route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.locator("h1")).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });

  test("audit changes do not introduce fake commercial or review claims", () => {
    const changedSources = [
      "app/routes/dictionary.tsx",
      "app/routes/morse-code-visual-quiz.tsx",
      "app/routes/morse-code-chart.tsx",
      "app/routes/morse-code-alphabet.tsx",
      "app/routes/international-morse-code-reference.tsx",
      "app/client/data/morseContent.ts",
    ];
    const forbidden = /\b(aggregateRating|reviewRating|ratingValue|testimonials?|special offer|prices?)\b/i;

    for (const file of changedSources) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).not.toMatch(forbidden);
    }
  });
});
