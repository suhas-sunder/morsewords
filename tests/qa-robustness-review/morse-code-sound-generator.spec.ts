import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  REDIRECT_PATHS,
  blockExternalNetwork,
  collectConsoleErrors,
  isExpectedHarnessConsoleEntry,
  sameHostPathnamesInText,
  waitForRouteReady,
} from "./helpers";

const CANONICAL_PATH = "/morse-code-sound-generator";
const CANONICAL_URL = `https://www.morsewords.com${CANONICAL_PATH}`;
const AUDIO_GENERATOR_ALIAS = "/morse-code-audio-generator";
const THEME_STORAGE_KEY = "morsewords-theme";

const REQUIRED_LINKS = [
  "/audio",
  "/morse-code-mp3-generator",
  "/morse-code-book-translator",
  "/morse-code-video-generator",
  "/morse-code-audio-decoder",
  "/morse-code-audio-practice",
  "/morse-code-audio-quiz",
  "/morse-code-timing",
  "/farnsworth-timing",
] as const;

const REQUIRED_FAQ_QUESTIONS = [
  "What does a Morse code sound generator do?",
  "Can I turn text into Morse code sound?",
  "What tone should I use for Morse code?",
  "What is the CW radio tone preset?",
  "Can I change the pitch or frequency?",
  "Can I use creative sounds like bells or chirps?",
  "Why is CW radio the default?",
  "Can I download the sound as MP3 or WAV?",
  "Can I make long book-length Morse audio?",
  "Can I decode Morse sound back into text?",
  "What is Farnsworth spacing?",
  "Is my text uploaded to a server?",
] as const;

const STANDARD_PRESETS = [
  { label: "CW (Radio)", value: "cw_radio" },
  { label: "Sine", value: "sine" },
  { label: "Square", value: "square" },
  { label: "Triangle", value: "triangle" },
  { label: "Sawtooth", value: "sawtooth" },
  { label: "Telegraph sounder", value: "sounder" },
] as const;

const CREATIVE_PRESETS = [
  { label: "Soft bell", value: "soft_bell" },
  { label: "Warm tone", value: "warm_tone" },
  { label: "Low beacon", value: "low_beacon" },
  { label: "Submarine ping", value: "submarine_ping" },
  { label: "Digital blip", value: "digital_blip" },
  { label: "Soft click", value: "soft_click" },
  { label: "Bird chirp", value: "bird_chirp" },
] as const;

type JsonLdRecord = Record<string, unknown>;

function filterHarnessConsoleNoise(
  entries: Array<{ type: string; text: string }>,
) {
  return entries.filter((entry) => !isExpectedHarnessConsoleEntry(entry.text));
}

function flattenJsonLd(value: unknown): JsonLdRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return [
    record,
    ...flattenJsonLd(record["@graph"]),
    ...flattenJsonLd(record.mainEntity),
    ...flattenJsonLd(record.itemListElement),
    ...flattenJsonLd(record.step),
  ];
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
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts.map((script) => JSON.parse(script.textContent ?? "null")),
  );
}

async function visibleSoundFaqQuestions(page: Page) {
  const faqSection = page
    .locator("#faq section")
    .filter({
      has: page.getByRole("heading", {
        name: "Morse code sound generator FAQ",
      }),
    });
  await expect(faqSection).toHaveCount(1);

  return faqSection.locator("details summary").evaluateAll((summaries) =>
    summaries
      .map((summary) => summary.textContent?.trim().replace(/>$/, "").trim() ?? "")
      .filter(Boolean),
  );
}

function parseRgbTriplet(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;

  const channels = match[1]
    .split(",")
    .slice(0, 3)
    .map((part) => Number.parseFloat(part.trim()));

  return channels.length === 3 && channels.every(Number.isFinite)
    ? channels
    : null;
}

function relativeLuminance(rgb: number[]) {
  return rgb
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    })
    .reduce((sum, channel, index) => {
      return sum + channel * [0.2126, 0.7152, 0.0722][index];
    }, 0);
}

function contrastRatio(foreground: string, background: string) {
  const foregroundRgb = parseRgbTriplet(foreground);
  const backgroundRgb = parseRgbTriplet(background);
  expect(foregroundRgb, `foreground color ${foreground}`).not.toBeNull();
  expect(backgroundRgb, `background color ${background}`).not.toBeNull();

  const foregroundLuminance = relativeLuminance(foregroundRgb as number[]);
  const backgroundLuminance = relativeLuminance(backgroundRgb as number[]);
  const light = Math.max(foregroundLuminance, backgroundLuminance);
  const dark = Math.min(foregroundLuminance, backgroundLuminance);

  return (light + 0.05) / (dark + 0.05);
}

async function renderedColors(locator: Locator) {
  return locator.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    return {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
    };
  });
}

async function relatedSoundToolsSection(page: Page) {
  const section = page
    .locator("section")
    .filter({
      has: page.getByRole("heading", {
        name: "Related Morse audio tools",
      }),
    });
  await expect(section).toHaveCount(1);
  return section;
}

function pageContent(page: Page) {
  return page.locator(".mw-page-content");
}

function soundInput(page: Page) {
  return page.getByRole("textbox", { name: "Example: Hello world" });
}

test.describe("Morse code sound generator", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, sound controls, guide content, FAQ, and JSON-LD", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page).toHaveTitle(
      "Morse Code Sound Generator | Tone, Beep & CW Audio | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse Code Sound Generator");
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
    expect(description).toContain("Morse code sound");
    expect(description).toContain("CW radio");
    expect(description).toContain("beep waveform");
    expect(description).toContain("Farnsworth");

    await expect(page.getByText("Message to turn into a Morse tone")).toBeVisible();
    await expect(soundInput(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Play sound" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download MP3" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Download WAV" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Copy Output" }).first(),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear output" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Sound Sound$/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Repeat Repeat$/ }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Flash Light" })).toBeVisible();
    await expect(page.getByLabel("Tone preset")).toBeVisible();
    await expect(page.getByLabel("Character speed")).toBeVisible();
    await expect(page.getByLabel("Farnsworth spacing")).toBeVisible();
    await expect(page.getByLabel("Pitch")).toBeVisible();
    await expect(page.getByLabel("Volume")).toBeVisible();
    await expect(page.getByLabel("Attack")).toBeVisible();
    await expect(page.getByLabel("Release")).toBeVisible();

    for (const heading of [
      "How this Morse code sound generator works",
      "How to create a Morse practice tone",
      "Worked sound examples",
      "CW, beep, and waveform presets",
      "Creative synthesized sound presets",
      "Pitch, volume, and timing settings",
      "Sound generator vs audio, MP3, video, and decoder tools",
      "Common sound setup mistakes",
      "Best next step after testing a signal",
      "Related Morse audio tools",
      "Morse code sound generator FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    for (const heading of [
      "CW radio",
      "Sine",
      "Square",
      "Triangle and sawtooth",
      "Telegraph sounder",
      "Soft bell and warm tone",
      "Low beacon and submarine ping",
      "Digital blip and soft click",
      "Bird chirp",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    await expect(
      page.getByText("synthesized tones rather than sampled audio", {
        exact: false,
      }),
    ).toBeVisible();

    const presetSelect = page.getByLabel("Tone preset");
    for (const preset of [...STANDARD_PRESETS, ...CREATIVE_PRESETS]) {
      await expect(
        page.locator(`option[value="${preset.value}"]`),
        preset.value,
      ).toHaveText(preset.label);
      await presetSelect.selectOption(preset.value);
      await expect(presetSelect).toHaveValue(preset.value);
    }

    const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
    for (const expectedSchemaType of [
      "WebApplication",
      "HowTo",
      "BreadcrumbList",
      "FAQPage",
    ]) {
      expect(
        records.some((record) => schemaType(record) === expectedSchemaType),
        expectedSchemaType,
      ).toBe(true);
    }
    expect(records.filter((record) => schemaType(record) === "FAQPage")).toHaveLength(
      1,
    );
  });

  test("links to canonical audio destinations and avoids redirect aliases", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const content = pageContent(page);
    const contentHrefs = await content.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? ""),
    );

    for (const href of REQUIRED_LINKS) {
      await expect(content.locator(`a[href="${href}"]`).first()).toBeVisible();
      expect(contentHrefs, href).toContain(href);
    }

    for (const alias of REDIRECT_PATHS) {
      expect(contentHrefs, `sound generator avoids redirect alias ${alias}`).not.toContain(
        alias,
      );
    }
    await expect(
      content.locator(`a[href="${AUDIO_GENERATOR_ALIAS}"]`),
    ).toHaveCount(0);
  });

  test("keeps FAQPage JSON-LD unique, canonical, and aligned with visible FAQs", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const parsedJsonLd = await parseJsonLd(page);
    const records = parsedJsonLd.flatMap(flattenJsonLd);
    const faqPages = records.filter((record) => schemaType(record) === "FAQPage");
    expect(faqPages, "single FAQPage schema").toHaveLength(1);

    const webApp = records.find((record) => schemaType(record) === "WebApplication");
    expect(webApp?.url).toBe(CANONICAL_URL);
    expect(webApp?.["@id"]).toBe(`${CANONICAL_URL}#webapp`);

    const howTo = records.find((record) => schemaType(record) === "HowTo");
    expect(howTo?.["@id"]).toBe(`${CANONICAL_URL}#howto`);

    const breadcrumbs = records.find(
      (record) => schemaType(record) === "BreadcrumbList",
    );
    const breadcrumbItems = breadcrumbs?.itemListElement as JsonLdRecord[];
    expect(breadcrumbItems.at(-1)?.item).toBe(CANONICAL_URL);

    const faqPage = faqPages[0];
    expect(faqPage["@id"]).toBe(`${CANONICAL_URL}#faq`);
    const schemaQuestions = (faqPage.mainEntity as JsonLdRecord[]).map(itemName);
    const visibleQuestions = await visibleSoundFaqQuestions(page);
    expect(schemaQuestions).toEqual(visibleQuestions);
    for (const question of REQUIRED_FAQ_QUESTIONS) {
      expect(schemaQuestions, question).toContain(question);
    }

    const schemaText = JSON.stringify(parsedJsonLd);
    const schemaPaths = sameHostPathnamesInText(schemaText);
    expect(schemaText).toContain(CANONICAL_URL);
    expect(schemaText).not.toContain(`${CANONICAL_URL}?`);
    expect(schemaPaths).not.toContain(AUDIO_GENERATOR_ALIAS);
  });

  test("accepts text input, updates Morse output, and keeps flash dormant", async ({
    page,
  }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await soundInput(page).fill("CQ SOUND");
    await expect(
      page.locator("code").filter({ hasText: "-.-. --.-" }),
    ).toBeVisible();
    await page.getByLabel("Tone preset").selectOption("warm_tone");
    await expect(page.getByLabel("Tone preset")).toHaveValue("warm_tone");
    await expect(page.getByRole("button", { name: "Play sound" })).toBeEnabled();
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
    expect(filterHarnessConsoleNoise(consoleEntries)).toEqual([]);
  });

  test("works in dark mode, passes focused axe scan, and stays usable on mobile", async ({
    page,
  }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
    }, THEME_STORAGE_KEY);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByText("Message to turn into a Morse tone")).toBeVisible();
    await expect(soundInput(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Play sound" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    const axeResults = await new AxeBuilder({ page })
      .include(".mw-page-content")
      .disableRules(["color-contrast"])
      .analyze();
    expect(
      axeResults.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
    expect(filterHarnessConsoleNoise(consoleEntries)).toEqual([]);
  });

  test("keeps touched related-tool links readable on dark hover", async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
      document.documentElement.dataset.theme = "dark";
    }, THEME_STORAGE_KEY);
    await page.setViewportSize({ width: 1280, height: 760 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const section = await relatedSoundToolsSection(page);
    const link = section.locator('a[href="/morse-code-mp3-generator"]');
    await expect(link).toHaveCount(1);
    await link.hover();

    const colors = await renderedColors(link);
    expect(
      contrastRatio(colors.color, colors.backgroundColor),
      "hovered related link contrast",
    ).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });
});
