import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  REDIRECT_PATHS,
  blockExternalNetwork,
  waitForRouteReady,
} from "./helpers";

type JsonLdRecord = Record<string, unknown>;

const CANONICAL_PATH = "/audio";
const CANONICAL_URL = `https://www.morsewords.com${CANONICAL_PATH}`;

const EXPECTED_AUDIO_TOOL_LINKS = [
  {
    title: "Create Morse sound",
    href: "/morse-code-sound-generator",
  },
  {
    title: "MP3 and WAV generator",
    href: "/morse-code-mp3-generator",
  },
  {
    title: "Decode audio",
    href: "/morse-code-audio-decoder",
  },
  {
    title: "Convert long text or books",
    href: "/morse-code-book-translator",
  },
  {
    title: "Make a Morse video",
    href: "/morse-code-video-generator",
  },
  {
    title: "Practice listening",
    href: "/morse-code-audio-practice",
  },
  {
    title: "Take an audio quiz",
    href: "/morse-code-audio-quiz",
  },
] as const;

function flattenJsonLd(value: unknown): JsonLdRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!value || typeof value !== "object") return [];

  const record = value as JsonLdRecord;
  return [
    record,
    ...flattenJsonLd(record["@graph"]),
    ...flattenJsonLd(record.mainEntity),
    ...flattenJsonLd(record.itemListElement),
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

async function visibleAudioFaqQuestions(page: Page) {
  const faqSection = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Audio FAQ" }) });
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

async function audioToolPathSection(page: Page) {
  const section = page
    .locator("section")
    .filter({
      has: page.getByRole("heading", {
        name: "Choose the right Morse audio tool",
      }),
    });
  await expect(section).toHaveCount(1);
  return section;
}

test.describe("Morse code audio hub", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, guide content, FAQ, and existing audio controls", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page).toHaveTitle(
      "Morse Code Audio Translator & Generator | WAV, MP3, Decoder Tools | MorseWords",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      CANONICAL_URL,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      CANONICAL_URL,
    );

    await expect(
      page.getByRole("heading", {
        exact: true,
        name: "Morse Code Audio Generator",
      }),
    ).toBeVisible();
    await expect(page.getByLabel("Input (Text)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Text to Morse audio" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Morse to audio" })).toBeVisible();
    await expect(page.getByLabel("Character speed")).toBeVisible();
    await expect(page.getByLabel("Farnsworth spacing")).toBeVisible();
    await expect(page.getByLabel("Tone preset")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save MP3 audio" })).toBeVisible();

    await expect(page.getByText("This is the MorseWords audio hub.")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "When to use each Morse audio tool" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "MP3 vs WAV for Morse audio" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Practical audio expectations" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Audio FAQ" })).toBeVisible();
  });

  test("routes users to canonical audio, export, decoder, book, video, and practice tools", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const section = await audioToolPathSection(page);
    const hrefs = await section.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? ""),
    );

    for (const item of EXPECTED_AUDIO_TOOL_LINKS) {
      await expect(
        section.locator(`a[href="${item.href}"]`).filter({ hasText: item.title }),
        item.title,
      ).toHaveCount(1);
      expect(hrefs, item.href).toContain(item.href);
    }

    for (const aliasPath of REDIRECT_PATHS) {
      expect(hrefs, `audio hub avoids redirect alias ${aliasPath}`).not.toContain(
        aliasPath,
      );
    }

    await expect(
      page.locator('main a[href="/morse-code-ebook-translator"]'),
    ).toHaveCount(0);
    await expect(
      page.locator('main a[href="/text-to-morse-code-video"]'),
    ).toHaveCount(0);
  });

  test("keeps FAQPage JSON-LD valid, unique, and aligned with visible FAQs", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const records = (await parseJsonLd(page)).flatMap(flattenJsonLd);
    const faqPages = records.filter((record) => schemaType(record) === "FAQPage");
    expect(faqPages, "single FAQPage schema").toHaveLength(1);

    const webApp = records.find((record) => schemaType(record) === "WebApplication");
    expect(webApp?.url).toBe(CANONICAL_URL);
    expect(webApp?.["@id"]).toBe(`${CANONICAL_URL}#webapp`);

    const breadcrumbs = records.find(
      (record) => schemaType(record) === "BreadcrumbList",
    );
    const breadcrumbItems = breadcrumbs?.itemListElement as JsonLdRecord[];
    expect(breadcrumbItems.at(-1)?.item).toBe(CANONICAL_URL);

    const faqPage = faqPages[0];
    expect(faqPage["@id"]).toBe(`${CANONICAL_URL}#faq`);
    const schemaQuestions = (faqPage.mainEntity as JsonLdRecord[]).map(itemName);
    const visibleQuestions = await visibleAudioFaqQuestions(page);

    expect(schemaQuestions).toContain("Can I translate text into Morse code audio?");
    expect(schemaQuestions).toContain("Can I decode Morse audio back into text?");
    expect(schemaQuestions).toContain("Can I make a Morse code video?");
    expect(schemaQuestions).toContain("How do No split and Split by duration work?");
    expect(schemaQuestions).toContain(
      "Will my browser download every multipart file automatically?",
    );
    for (const schemaQuestion of schemaQuestions) {
      expect(
        visibleQuestions,
        `visible FAQ includes ${schemaQuestion}`,
      ).toContain(schemaQuestion);
    }

    const schemaText = JSON.stringify(records);
    expect(schemaText).toContain(CANONICAL_URL);
    expect(schemaText).not.toContain("https://www.morsewords.com/audio?");
  });

  test("accepts text input, updates Morse output, and preserves shared audio settings", async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.waitForFunction(
      () => window.localStorage.getItem("mw_audio_source") === "text",
    );

    await page.getByLabel("Input (Text)").fill("CQ");
    await expect(
      page.locator("pre").filter({ hasText: "-.-.   --.-" }),
    ).toBeVisible();

    await page.getByLabel("Character speed").fill("24");
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("mw_audio_wpm")))
      .toBe("24");
    await expect(page.getByRole("button", { name: /Play/ }).first()).toBeEnabled();
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });

  test("keeps the audio hub responsive and dark-hover readable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const mobileOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(mobileOverflow).toBeLessThanOrEqual(1);

    await page.addInitScript(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.dataset.theme ?? "light"),
      )
      .toBe("dark");

    const section = await audioToolPathSection(page);
    const link = section.locator('a[href="/morse-code-mp3-generator"]');
    await expect(link).toHaveCount(1);
    await link.hover();

    const linkColors = await renderedColors(link);
    const titleColors = await renderedColors(link.locator(".mw-heading"));
    const descriptionColors = await renderedColors(link.locator(".mw-text-muted"));

    expect(
      contrastRatio(titleColors.color, linkColors.backgroundColor),
      "hovered audio hub title contrast",
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(descriptionColors.color, linkColors.backgroundColor),
      "hovered audio hub description contrast",
    ).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  });
});
