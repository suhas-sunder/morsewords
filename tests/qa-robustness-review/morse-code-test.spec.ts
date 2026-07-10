import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import {
  buildMorseCodeTestDeck,
  INITIAL_MORSE_CODE_TEST_SEED,
  isMorseCodeTestAnswerCorrect,
  MORSE_CODE_TEST_LENGTH,
} from "../../app/client/components/morse-code-test/morseCodeTestEngine";
import { MORSE_TO_TEXT, TEXT_TO_MORSE } from "../../app/client/components/shared/morseUtils";

import {
  blockExternalNetwork,
  collectConsoleErrors,
  isExpectedHarnessConsoleEntry,
  sitemapLocs,
  TEST_ALIAS_PATHS,
  waitForRouteReady,
} from "./helpers";

type JsonLdRecord = Record<string, unknown>;

const SITE_URL = "https://www.morsewords.com";
const CANONICAL_PATH = "/morse-code-test";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;
const THEME_STORAGE_KEY = "morsewords-theme";

const REQUIRED_CHOOSER_LINKS = [
  "/morse-code-audio-quiz",
  "/morse-code-audio-practice",
  "/typing",
  "/morse-code-visual-quiz",
  "/practice",
  "/morse-code-word-trainer",
  "/morse-code-practice-plan",
] as const;

const REQUIRED_SUPPORT_LINKS = [
  "/morse-code-visual-practice",
  "/audio",
  "/morse-code-alphabet",
  "/morse-code-numbers",
  "/morse-code-word-separator",
] as const;

const FORBIDDEN_LINKS = [...TEST_ALIAS_PATHS, "/morse-to-english"] as const;

const CONTEXTUAL_LINK_SOURCE_ROUTES = [
  "/practice",
  "/typing",
  "/morse-code-audio-practice",
  "/morse-code-audio-quiz",
  "/morse-code-practice-plan",
] as const;

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
  if (!value || typeof value !== "object") return "";
  const record = value as JsonLdRecord;
  return typeof record.name === "string" ? record.name : "";
}

async function parseJsonLd(page: Page) {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((items) => items.map((item) => item.textContent ?? ""));
  expect(scripts.length, "JSON-LD script count").toBeGreaterThan(0);
  return scripts.map((script) => JSON.parse(script));
}

async function getLinkedPathnames(page: Page) {
  return page.locator("a[href]").evaluateAll((anchors) =>
    anchors.map((anchor) => {
      const href = (anchor as HTMLAnchorElement).getAttribute("href") ?? "";
      return new URL(href, window.location.origin).pathname;
    }),
  );
}

test.describe("Morse code test assessment hub", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, useful assessment content, visible FAQ, and valid JSON-LD", async ({
  page,
}) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(
      "Morse Code Skills Test | Listening, Typing, Visual, and Speed Practice | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse Code Skills Test");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      CANONICAL_URL,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      CANONICAL_URL,
    );

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toContain("scored Morse code test");
    expect(description).toContain("typing");
    expect(description).toContain("visual");
    expect(description).toContain("speed");

    for (const name of [
      "Go to skills test",
      "Listening test",
      "Typing test",
      "Visual test",
      "Build a practice plan",
    ]) {
      await expect(page.getByRole("link", { name }).first()).toBeVisible();
    }

    for (const heading of [
      "Continue with a specialist Morse test",
      "Which Morse test should I choose?",
      "How this Morse code test works",
      "Test types explained",
      "Beginner and intermediate paths",
      "How to read your results",
      "Morse WPM and speed notes",
      "Common Morse test mistakes",
      "Morse code test FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    await expect(
      page
        .getByTestId("morse-code-assessment")
        .getByRole("heading", { name: "Morse Code Skills Test" }),
    ).toBeVisible();

    await expect(page.locator('[data-testid="morse-test-chooser"] a')).toHaveCount(
      REQUIRED_CHOOSER_LINKS.length,
    );
    await expect(page.locator('[data-testid="morse-test-chooser"]')).not.toHaveClass(
      /mw-static|mw-surface|bg-\[/,
    );
    for (const heading of [
      "How this Morse code test works",
      "How to read your results",
      "Morse WPM and speed notes",
      "Common Morse test mistakes",
    ]) {
      const section = page.locator("section").filter({
        has: page.getByRole("heading", { name: heading }),
      });
      await expect(
        section.locator(
          ".mw-static-panel, .mw-static-tile, .mw-static-surface, .mw-static-surface-soft",
        ),
        `${heading} should use spacing, not filled card surfaces`,
      ).toHaveCount(0);
    }
    await expect(page.locator("#faq details summary")).toHaveCount(6);
    const wpmSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: "Morse WPM and speed notes" }),
    });
    await expect(wpmSection.getByText("PARIS", { exact: false })).toBeVisible();
    await expect(
      page.locator("main").getByText("not an official licensing exam").first(),
    ).toBeVisible();
    await expect(
      page.locator("main").getByText("single test result").first(),
    ).toBeVisible();

    const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
    const types = records.map(schemaType);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("WebApplication");
    expect(types).toContain("ItemList");
    expect(types).toContain("FAQPage");

    const breadcrumbs = records.find((record) => schemaType(record) === "BreadcrumbList");
    const breadcrumbItems = breadcrumbs?.itemListElement as JsonLdRecord[];
    expect(breadcrumbItems).toEqual([
      expect.objectContaining({ "@type": "ListItem", position: 1, name: "Home" }),
      expect.objectContaining({
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Test",
        item: CANONICAL_URL,
      }),
    ]);

    const faqPage = records.find((record) => schemaType(record) === "FAQPage");
    const schemaQuestions = (faqPage?.mainEntity as JsonLdRecord[]).map(itemName);
    const visibleQuestions = await page.locator("#faq details summary").allTextContents();
    for (const question of schemaQuestions) {
      expect(
        visibleQuestions.some((visibleQuestion) =>
          visibleQuestion.includes(question),
        ),
        `visible FAQ includes ${question}`,
      ).toBe(true);
    }
  });

  test("builds a balanced canonical mixed question deck", () => {
    const deck = buildMorseCodeTestDeck(INITIAL_MORSE_CODE_TEST_SEED);

    expect(deck).toHaveLength(MORSE_CODE_TEST_LENGTH);
    expect(new Set(deck.map((question) => question.id)).size).toBe(
      MORSE_CODE_TEST_LENGTH,
    );
    expect(new Set(deck.map((question) => question.direction))).toEqual(
      new Set(["morse_to_character", "character_to_morse"]),
    );
    expect(deck.filter((question) => question.category === "letter")).toHaveLength(4);
    expect(deck.filter((question) => question.category === "number")).toHaveLength(3);
    expect(deck.filter((question) => question.category === "punctuation")).toHaveLength(3);

    for (const question of deck) {
      expect(TEXT_TO_MORSE[question.character]).toBe(question.morse);
      expect(MORSE_TO_TEXT[question.morse]).toBe(question.character);
      expect(
        isMorseCodeTestAnswerCorrect(
          question,
          question.direction === "morse_to_character"
            ? question.character
            : question.morse,
        ),
      ).toBe(true);
    }
  });

  test("shows question one immediately, gives feedback, prevents double submission, and restarts", async ({
  page,
}) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const answer = page.getByLabel(/Character or symbol|Morse pattern/);
    await expect(
      page
        .getByTestId("morse-code-assessment")
        .getByRole("heading", { name: "Morse Code Skills Test" }),
    ).toBeVisible();
    await expect(page.getByText(/Question\s+1\/10/)).toBeVisible();
    await expect(answer).toBeVisible();
    await expect(
      page
        .getByTestId("morse-code-assessment")
        .getByRole("button", { name: /^Start.*test/i }),
    ).toHaveCount(0);
    await expect(page.getByText(/Mixed test|Mixed assessment/i)).toHaveCount(0);
    await expect(page.locator('[data-testid="morse-code-assessment"]')).toHaveCount(1);
    await page.screenshot({
      path: "test-artifacts/qa-robustness-review/morse-code-test-active.png",
    });

    await answer.fill("wrong");
    await page.evaluate(() => {
      const button = document.querySelector('button[aria-label="Check test answer"]') as HTMLButtonElement | null;
      button?.click();
      button?.click();
    });
    await expect(page.getByRole("status")).toContainText("Not quite. Correct answer:");
    await expect(page.getByText(/Question\s+1\/10/)).toBeVisible();
    await page.screenshot({
      path: "test-artifacts/qa-robustness-review/morse-code-test-incorrect.png",
    });

    await page.getByRole("button", { name: "Next test question" }).click();
    await expect(page.getByText(/Question\s+2\/10/)).toBeVisible();

    const prompt =
      (await page.getByTestId("morse-code-test-prompt").textContent())?.trim() ?? "";
    const answerPrompt = await page
      .locator('label[for="morse-code-test-answer"]')
      .textContent();
    await answer.fill(
      answerPrompt?.includes("Character or symbol")
        ? MORSE_TO_TEXT[prompt.replace(/[^.-]/g, "")]
        : TEXT_TO_MORSE[prompt],
    );
    await answer.press("Enter");
    await expect(page.getByRole("status")).toContainText("Correct.");
    await page.screenshot({
      path: "test-artifacts/qa-robustness-review/morse-code-test-correct.png",
    });
    await answer.press("Enter");
    await expect(page.getByText(/Question\s+3\/10/)).toBeVisible();

    await page.getByRole("button", { name: "Restart Morse Code Skills Test" }).click();
    await expect(page.getByText(/Question\s+1\/10/)).toBeVisible();
    await expect(answer).toHaveValue("");
    await page.screenshot({
      path: "test-artifacts/qa-robustness-review/morse-code-test-restarted.png",
    });
  });

  test("completes the skills test with keyboard answers and shows score plus percentage", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    for (let index = 0; index < MORSE_CODE_TEST_LENGTH; index += 1) {
      const prompt =
        (await page.getByTestId("morse-code-test-prompt").textContent())?.trim() ?? "";
      const direction = await page
        .getByTestId("morse-code-assessment")
        .getAttribute("data-morse-code-test-direction");
      const expected =
        direction === "morse_to_character"
          ? MORSE_TO_TEXT[prompt.replace(/[^.-]/g, "")]
          : TEXT_TO_MORSE[prompt];
      expect(expected, `question ${index + 1} has a canonical answer`).toBeTruthy();
      const answer = page.getByLabel(/Character or symbol|Morse pattern/);
      const checkAnswer = page.getByRole("button", { name: "Check test answer" });
      await answer.click();
      await answer.pressSequentially(expected);
      await expect(checkAnswer).toBeEnabled();
      await checkAnswer.click();
      await expect(page.getByRole("status")).toContainText("Correct.");
      await page.getByRole("button", { name: "Next test question" }).click();
      if (index + 1 < MORSE_CODE_TEST_LENGTH) {
        await expect(page.getByText(new RegExp(`Question\\s+${index + 2}/10`))).toBeVisible();
      }
    }

    await expect(page.getByRole("heading", { name: "Your Morse Code Skills Test result" })).toBeVisible();
    await expect(page.getByLabel("Test score summary")).toContainText("10/10");
    await expect(page.getByLabel("Test score summary")).toContainText("100%");
    await page.screenshot({
      path: "test-artifacts/qa-robustness-review/morse-code-test-complete.png",
    });
    await page.getByRole("button", { name: "Start a new Morse Code Skills Test" }).click();
    await expect(page.getByText(/Question\s+1\/10/)).toBeVisible();
  });

  test("routes users only to existing canonical assessment and support tools", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    for (const href of REQUIRED_CHOOSER_LINKS) {
      await expect(
        page.locator('[data-testid="morse-test-chooser"]').locator(`a[href="${href}"]`),
        `${href} chooser link`,
      ).toBeVisible();
    }

    for (const href of REQUIRED_SUPPORT_LINKS) {
      await expect(
        page.locator("main").locator(`a[href="${href}"]`).first(),
        `${href} support link`,
      ).toBeVisible();
    }

    const linkedPathnames = await getLinkedPathnames(page);
    for (const href of FORBIDDEN_LINKS) {
      expect(linkedPathnames, `page should not link ${href}`).not.toContain(href);
    }

    await expect(page.locator('a[href="/morse-code-speed-test"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="morse-test-chooser"]')).not.toContainText(
      "formal WPM speed test",
    );
  });

  test("sitemap, redirects, and internal links use only the canonical test URL", async ({
    page,
    request,
  }) => {
    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    const locs = sitemapLocs(xml);
    expect(xml).toContain(CANONICAL_URL);

    for (const alias of TEST_ALIAS_PATHS) {
      const response = await request.get(alias, { maxRedirects: 0 });
      expect(response.status(), `${alias} status`).toBe(301);
      expect(response.headers().location, `${alias} target`).toBe(CANONICAL_PATH);
      expect(locs, `XML sitemap excludes ${alias}`).not.toContain(`${SITE_URL}${alias}`);
      expect(await response.text(), `${alias} has no JSON-LD`).not.toContain(
        "application/ld+json",
      );
    }

    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    await expect(page.locator(`a[href="${CANONICAL_PATH}"]`).first()).toBeVisible();
    for (const alias of TEST_ALIAS_PATHS) {
      await expect(page.locator(`a[href="${alias}"]`)).toHaveCount(0);
    }

    for (const routePath of CONTEXTUAL_LINK_SOURCE_ROUTES) {
      await page.goto(routePath, { waitUntil: "domcontentloaded" });
      await expect(
        page.locator(`a[href="${CANONICAL_PATH}"]`).first(),
        `${routePath} links to canonical test hub`,
      ).toBeVisible();
      const linkedPathnames = await getLinkedPathnames(page);
      for (const alias of TEST_ALIAS_PATHS) {
        expect(linkedPathnames, `${routePath} avoids ${alias}`).not.toContain(alias);
      }
    }
  });

  test("works in dark mode, passes focused axe scan, and keeps chooser usable on mobile", async ({
    page,
  }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
      if (document.documentElement) {
        document.documentElement.dataset.theme = "dark";
      }
    }, THEME_STORAGE_KEY);

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe("dark");
    await expect(page.locator("h1")).toHaveText("Morse Code Skills Test");

    const chooser = page.locator('[data-testid="morse-test-chooser"]');
    await expect(chooser).toBeVisible();
    await expect(chooser.getByRole("link", { name: "Listening test" })).toHaveAttribute(
      "href",
      "/morse-code-audio-quiz",
    );

    const axeResults = await new AxeBuilder({ page })
      .include('[data-testid="morse-test-chooser"]')
      .disableRules(["color-contrast"])
      .analyze();
    expect(
      axeResults.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);

    expect(
      consoleEntries.filter(
        (entry) => !isExpectedHarnessConsoleEntry(entry.text),
      ),
    ).toEqual([]);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByLabel(/Character or symbol|Morse pattern/)).toBeVisible();
    await expect(page.locator('[data-testid="morse-test-chooser"] a').first()).toBeVisible();

    const layoutAudit = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      assessmentBottom: document
        .querySelector('[data-testid="morse-code-assessment"]')
        ?.getBoundingClientRect().bottom,
      firstChooserTop: document
        .querySelector('[data-testid="morse-test-chooser"]')
        ?.getBoundingClientRect().top,
    }));
    expect(layoutAudit.scrollWidth).toBeLessThanOrEqual(layoutAudit.clientWidth + 1);
    expect(
      (layoutAudit.firstChooserTop ?? Number.POSITIVE_INFINITY) -
        (layoutAudit.assessmentBottom ?? Number.NEGATIVE_INFINITY),
    ).toBeLessThanOrEqual(260);

    await page.setViewportSize({ width: 430, height: 932 });
    const widerMobileLayoutAudit = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(widerMobileLayoutAudit.scrollWidth).toBeLessThanOrEqual(
      widerMobileLayoutAudit.clientWidth + 1,
    );
  });
});
