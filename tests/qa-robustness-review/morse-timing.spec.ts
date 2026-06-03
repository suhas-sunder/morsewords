import { expect, test, type Page } from "@playwright/test";

import {
  buildMorseEvents,
  estimateMorseDurationMs,
  farnsworthGapScale,
  getDotMs,
  hasPlayableMorse,
  normalizePlayableMorse,
} from "../../app/client/components/shared/morseTiming";
import {
  morseDurationMs,
  morseVisualEvents,
} from "../../app/client/components/shared/playMorsePattern";
import {
  REDIRECT_ALIAS_PATHS,
  ROUTES,
  absoluteUrl,
} from "../../app/client/data/routes";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  gotoRoute,
} from "./helpers";

type JsonObject = Record<string, unknown>;

const THEME_STORAGE_KEY = "morsewords-theme";

const TIMING_REFERENCE_PAGES = [
  {
    path: ROUTES.timing,
    title: "Morse Code Timing",
    faqTitle: "Timing FAQ",
    minFaqCount: 10,
    articleNeedles: [
      "Farnsworth spacing",
      "Morse code duration",
      "Morse audio export",
      "Morse video timing",
    ],
    visibleNeedles: [
      "Morse timing is measured in units",
      "Dot unit = 1200 / WPM",
      "Speed, duration, and export settings",
      "Why does lower Farnsworth spacing make exports longer?",
    ],
    expectedLinks: [
      ROUTES.farnsworth,
      ROUTES.wordSeparator,
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
      ROUTES.audioPractice,
      ROUTES.audioDecoder,
      ROUTES.decoder,
    ],
  },
  {
    path: ROUTES.farnsworth,
    title: "Farnsworth Timing",
    faqTitle: "Farnsworth FAQ",
    minFaqCount: 10,
    articleNeedles: [
      "Morse audio export",
      "Morse code duration",
      "MP3 Morse audio",
      "Audio decoding",
    ],
    visibleNeedles: [
      "Farnsworth keeps characters fast and spaces slower",
      "Character speed = dot/dash rhythm",
      "How Farnsworth settings affect audio and exports",
      "Does lower Farnsworth WPM make audio exports longer?",
    ],
    expectedLinks: [
      ROUTES.audio,
      ROUTES.soundGenerator,
      ROUTES.mp3Generator,
      ROUTES.bookTranslator,
      ROUTES.videoGenerator,
      ROUTES.audioPractice,
      ROUTES.audioDecoder,
      ROUTES.learn,
      ROUTES.practicePlan,
      ROUTES.timing,
    ],
  },
] as const;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function flattenJsonLd(value: unknown): JsonObject[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!isJsonObject(value)) return [];

  const graph = value["@graph"];
  return [value, ...flattenJsonLd(graph)];
}

function schemaTypes(node: JsonObject) {
  const typeValue = node["@type"];
  if (Array.isArray(typeValue)) {
    return typeValue.filter((value): value is string => typeof value === "string");
  }
  return typeof typeValue === "string" ? [typeValue] : [];
}

function findSchemaNode(nodes: JsonObject[], type: string) {
  return nodes.find((node) => schemaTypes(node).includes(type));
}

function schemaFaqEntries(faqNode: JsonObject) {
  const entities = faqNode.mainEntity;
  if (!Array.isArray(entities)) return [];

  return entities
    .map((entity) => {
      if (!isJsonObject(entity)) return null;
      const answer = entity.acceptedAnswer;
      return {
        question: typeof entity.name === "string" ? entity.name : "",
        answer:
          isJsonObject(answer) && typeof answer.text === "string"
            ? answer.text
            : "",
      };
    })
    .filter((entry): entry is { question: string; answer: string } =>
      Boolean(entry?.question && entry.answer),
    );
}

async function readJsonLdNodes(page: Page) {
  const rawJsonLd = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? ""),
    );

  return rawJsonLd.flatMap((text: string) => flattenJsonLd(JSON.parse(text)));
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function eventNames(code: string) {
  return buildMorseEvents(code, { charWpm: 20 }).map((event) =>
    event.type === "mark" ? event.symbol : event.gap,
  );
}

test.describe("shared Morse timing", () => {
  test("dot duration at 20 WPM is 60 ms", () => {
    expect(getDotMs(20)).toBe(60);
  });

  test("does not apply Farnsworth slowdown when effective WPM is missing", () => {
    expect(farnsworthGapScale(20)).toBe(1);
  });

  test("does not apply Farnsworth slowdown when effective WPM is equal or greater", () => {
    expect(farnsworthGapScale(20, 20)).toBe(1);
    expect(farnsworthGapScale(20, 25)).toBe(1);
  });

  test("uses PARIS-style Farnsworth spacing for 18 character WPM at 12 effective WPM", () => {
    const scale = farnsworthGapScale(18, 12);
    const events = buildMorseEvents(". . / .", {
      charWpm: 18,
      farnsworthWpm: 12,
    });
    const letterGap = events.find(
      (event) => event.type === "gap" && event.gap === "letter",
    );
    const wordGap = events.find(
      (event) => event.type === "gap" && event.gap === "word",
    );

    expect(scale).toBeCloseTo(44 / 19, 8);
    expect(getDotMs(18)).toBeCloseTo(1200 / 18, 8);
    expect(letterGap?.units).toBeCloseTo(3 * (44 / 19), 8);
    expect(wordGap?.units).toBeCloseTo(7 * (44 / 19), 8);
  });

  test("SOS creates the correct mark and gap sequence", () => {
    expect(eventNames("...   ---   ...")).toEqual([
      ".",
      "intra-symbol",
      ".",
      "intra-symbol",
      ".",
      "letter",
      "-",
      "intra-symbol",
      "-",
      "intra-symbol",
      "-",
      "letter",
      ".",
      "intra-symbol",
      ".",
      "intra-symbol",
      ".",
    ]);
  });

  test("SOS HELP produces a word gap between words", () => {
    const gaps = buildMorseEvents("... --- ... / .... . .-.. .--.", {
      charWpm: 20,
    }).filter((event) => event.type === "gap");

    expect(gaps.some((event) => event.gap === "word")).toBe(true);
  });

  test("slash and seven spaces are treated as word breaks", () => {
    const slashEvents = eventNames(".../...");
    const spacedEvents = eventNames("...       ...");

    expect(slashEvents).toEqual(spacedEvents);
    expect(slashEvents).toContain("word");
  });

  test("duration estimation equals the sum of generated event durations", () => {
    const options = { charWpm: 18, farnsworthWpm: 12 };
    const events = buildMorseEvents("... --- ... / .... . .-.. .--.", options);
    const sum = events.reduce((total, event) => total + event.ms, 0);

    expect(estimateMorseDurationMs("... --- ... / .... . .-.. .--.", options)).toBeCloseTo(
      sum,
      8,
    );
  });

  test("compact Morse with single spaces between letters parses correctly", () => {
    expect(eventNames(". -")).toEqual([".", "letter", "-"]);
  });

  test("normalizes pasted dot and dash lookalikes safely", () => {
    expect(
      normalizePlayableMorse(
        "\u00c2\u00b7 \u00e2\u20ac\u00a2 / \u00e2\u20ac\u201c \u00e2\u20ac\u201d \u00e2\u02c6\u2019",
      ),
    ).toBe(". .       - - -");
  });

  test("detects whether pasted input contains playable Morse marks", () => {
    expect(hasPlayableMorse("... --- ...")).toBe(true);
    expect(hasPlayableMorse("   /   ")).toBe(false);
    expect(hasPlayableMorse("not morse")).toBe(false);
  });

  test("visual helper exports keep the existing on/ms shape and shared timing", () => {
    const code = "... / ...";
    const visualEvents = morseVisualEvents(code, 18, 12);
    const sharedEvents = buildMorseEvents(code, {
      charWpm: 18,
      farnsworthWpm: 12,
    }).map((event) => ({
      on: event.on,
      ms: event.ms,
    }));

    expect(visualEvents).toEqual(sharedEvents);
    expect(morseDurationMs(code, 18, 12)).toBeCloseTo(
      sharedEvents.reduce((total, event) => total + event.ms, 0),
      8,
    );
  });
});

test.describe("timing reference pages", () => {
  for (const pageInfo of TIMING_REFERENCE_PAGES) {
    test(`${pageInfo.path} keeps metadata, FAQ schema, links, and layout aligned`, async ({
      page,
    }) => {
      await blockExternalNetwork(page);
      const consoleEntries = collectConsoleErrors(page);

      const response = await gotoRoute(page, pageInfo.path);
      expect(response?.status(), `${pageInfo.path} HTTP status`).toBeLessThan(400);

      await expect(page.locator("h1")).toHaveText(pageInfo.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        absoluteUrl(pageInfo.path),
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        absoluteUrl(pageInfo.path),
      );
      await expect(page.locator("main #faq")).toBeVisible();
      await expect(page.locator("main h2", { hasText: pageInfo.faqTitle })).toBeVisible();
      await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

      const mainText = normalizeText(await page.locator("main").innerText());
      for (const expectedText of pageInfo.visibleNeedles) {
        expect(mainText, `${pageInfo.path} includes ${expectedText}`).toContain(
          expectedText,
        );
      }

      const hrefs = await page.locator("main a[href]").evaluateAll((anchors) =>
        anchors.map((anchor) =>
          (anchor as HTMLAnchorElement).getAttribute("href") ?? "",
        ),
      );
      for (const expectedLink of pageInfo.expectedLinks) {
        expect(hrefs, `${pageInfo.path} links ${expectedLink}`).toContain(
          expectedLink,
        );
      }
      for (const aliasPath of REDIRECT_ALIAS_PATHS) {
        expect(hrefs, `${pageInfo.path} avoids alias ${aliasPath}`).not.toContain(
          aliasPath,
        );
      }

      const nodes = await readJsonLdNodes(page);
      const articleNode = findSchemaNode(nodes, "TechArticle");
      expect(articleNode?.url, `${pageInfo.path} article URL`).toBe(
        absoluteUrl(pageInfo.path),
      );
      const articleJson = JSON.stringify(articleNode);
      for (const needle of pageInfo.articleNeedles) {
        expect(articleJson, `${pageInfo.path} article mentions ${needle}`).toContain(
          needle,
        );
      }

      const faqNode = findSchemaNode(nodes, "FAQPage");
      expect(faqNode?.["@id"], `${pageInfo.path} FAQ id`).toBe(
        `${absoluteUrl(pageInfo.path)}#faq`,
      );
      const schemaFaq = schemaFaqEntries(faqNode ?? {});
      expect(schemaFaq.length, `${pageInfo.path} FAQ count`).toBeGreaterThanOrEqual(
        pageInfo.minFaqCount,
      );

      const visibleQuestions = await page
        .locator("main #faq details summary > span:first-child")
        .evaluateAll((spans) =>
          spans.map((span) => (span.textContent ?? "").replace(/\s+/g, " ").trim()),
        );
      const visibleAnswers = await page
        .locator("main #faq details .mw-faq-answer p")
        .evaluateAll((answers) =>
          answers.map((answer) =>
            (answer.textContent ?? "").replace(/\s+/g, " ").trim(),
          ),
        );

      expect(schemaFaq.map((entry) => entry.question)).toEqual(visibleQuestions);
      expect(schemaFaq.map((entry) => entry.answer)).toEqual(visibleAnswers);

      const layoutMetrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(layoutMetrics.scrollWidth).toBeLessThanOrEqual(
        layoutMetrics.clientWidth + 1,
      );

      await page.waitForTimeout(250);
      expect(consoleEntries, `${pageInfo.path} console entries`).toEqual([]);
    });

    test(`${pageInfo.path} renders cleanly with persisted dark mode`, async ({
      page,
    }) => {
      await blockExternalNetwork(page);
      await page.addInitScript((key) => {
        try {
          window.localStorage.setItem(key, "dark");
          if (document.documentElement) {
            document.documentElement.dataset.theme = "dark";
          }
        } catch {
          if (document.documentElement) {
            document.documentElement.dataset.theme = "light";
          }
        }
      }, THEME_STORAGE_KEY);

      const response = await gotoRoute(page, pageInfo.path);
      expect(response?.status(), `${pageInfo.path} dark HTTP status`).toBeLessThan(
        400,
      );
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.locator("h1")).toHaveText(pageInfo.title);
      await expect(page.locator("main #faq details")).toHaveCount(
        pageInfo.minFaqCount,
      );
      await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

      const layoutMetrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(layoutMetrics.scrollWidth).toBeLessThanOrEqual(
        layoutMetrics.clientWidth + 1,
      );
    });
  }
});
