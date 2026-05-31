import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  blockExternalNetwork,
  collectConsoleErrors,
  isExpectedHarnessConsoleEntry,
  MP3_ALIAS_PATHS,
  waitForRouteReady,
} from "./helpers";

const CANONICAL_PATH = "/morse-code-mp3-generator";
const CANONICAL_URL = `https://www.morsewords.com${CANONICAL_PATH}`;
const THEME_STORAGE_KEY = "morsewords-theme";

const REQUIRED_LINKS = [
  "/audio",
  "/morse-code-encoder",
  "/morse-code-decoder",
  "/morse-code-audio-decoder",
  "/morse-code-chart",
  "/morse-code-alphabet",
  "/copy-and-paste-morse-code",
] as const;

function filterHarnessConsoleNoise(
  entries: Array<{ type: string; text: string }>,
) {
  return entries.filter((entry) => !isExpectedHarnessConsoleEntry(entry.text));
}

test.describe("Morse code MP3 generator", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders canonical metadata, useful tool controls, FAQ, and JSON-LD", async ({
    page,
  }) => {
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page).toHaveTitle(
      "Morse Code MP3 Generator | Download Morse Audio | MorseWords",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Morse Code MP3 Generator");
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
    expect(description).toContain("download an MP3");
    expect(description).toContain("speed");
    expect(description).toContain("tone");
    expect(description).toContain("browser");

    await expect(page.getByLabel("Message to turn into MP3 audio")).toBeVisible();
    await expect(page.getByRole("button", { name: "Play audio" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download WAV" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy Morse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sound" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Repeat" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Flash Light" })).toBeVisible();
    await expect(page.getByLabel("Sound type")).toBeVisible();
    await expect(page.getByLabel("Attack")).toBeVisible();
    await expect(page.getByLabel("Release")).toBeVisible();
    await expect(page.getByLabel("Tail padding")).toBeVisible();

    for (const heading of [
      "How the MP3 generator works",
      "MP3 vs WAV",
      "Settings that change the audio",
      "When to use MP3",
      "Troubleshooting",
      "MP3 generator vs audio decoder",
      "Morse code MP3 generator FAQ",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }

    const jsonLdTexts = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => script.textContent ?? ""));
    expect(jsonLdTexts.length).toBeGreaterThan(0);
    const jsonLdText = jsonLdTexts.join("\n");
    for (const schemaType of ["WebApplication", "BreadcrumbList", "FAQPage"]) {
      expect(jsonLdText).toContain(`"@type":"${schemaType}"`);
    }
  });

  test("exports real MP3 on demand and keeps WAV export available", async ({
    page,
  }) => {
    const requestedUrls: string[] = [];
    page.on("request", (request) => requestedUrls.push(request.url()));
    await page.addInitScript(() => {
      const originalCreateObjectUrl = URL.createObjectURL.bind(URL);
      const captures: Array<{ size: number; type: string }> = [];
      URL.createObjectURL = (object: Blob | MediaSource) => {
        if (object instanceof Blob) {
          captures.push({ size: object.size, type: object.type });
        }
        return originalCreateObjectUrl(object);
      };
      Object.defineProperty(window, "__mwDownloadBlobs", {
        value: captures,
        configurable: true,
      });
    });

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    expect(
      requestedUrls.filter((url) => /lame|mp3-encoder/i.test(url)),
      "MP3 encoder should not load during initial render",
    ).toHaveLength(0);

    await page.getByLabel("Message to turn into MP3 audio").fill("SOS");
    await page.getByLabel("File name").fill("morse-code");

    const mp3Download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download MP3" }).click();
    const download = await mp3Download;
    expect(download.suggestedFilename()).toBe("morse-code.mp3");
    await expect(page.getByText("MP3 download started.")).toBeVisible();

    const mp3Blobs = await page.evaluate(
      () => (window as any).__mwDownloadBlobs as Array<{ size: number; type: string }>,
    );
    const mp3Blob = mp3Blobs.at(-1);
    expect(mp3Blob?.type).toBe("audio/mpeg");
    expect(mp3Blob?.size ?? 0).toBeGreaterThan(100);

    const wavDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download WAV" }).click();
    const wav = await wavDownload;
    expect(wav.suggestedFilename()).toBe("morse-code.wav");

    const blobs = await page.evaluate(
      () => (window as any).__mwDownloadBlobs as Array<{ size: number; type: string }>,
    );
    expect(blobs.at(-1)?.type).toBe("audio/wav");
  });

  test("handles unsupported and long input without crashing", async ({ page }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-mw-mp3-tool-ready='true']")).toBeVisible();

    await page
      .getByLabel("Message to turn into MP3 audio")
      .fill(`SOS 😀 ${"HELLO WORLD ".repeat(120)}`);

    await expect(page.getByText(/Unsupported characters are ignored:/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeEnabled();
    expect(filterHarnessConsoleNoise(consoleEntries)).toEqual([]);
  });

  test("sitemap, redirects, contextual links, and page links use canonical URLs", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    await expect(page.locator(`a[href="${CANONICAL_PATH}"]`).first()).toBeVisible();

    for (const alias of MP3_ALIAS_PATHS) {
      await expect(page.locator(`a[href="${alias}"]`)).toHaveCount(0);
    }

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml).toContain(CANONICAL_URL);
    for (const alias of MP3_ALIAS_PATHS) {
      expect(xml).not.toContain(`https://www.morsewords.com${alias}`);
    }

    for (const alias of MP3_ALIAS_PATHS) {
      const response = await request.get(alias, { maxRedirects: 0 });
      expect(response.status(), `${alias} status`).toBe(301);
      expect(response.headers().location, `${alias} location`).toBe(
        CANONICAL_PATH,
      );
    }

    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
    for (const href of REQUIRED_LINKS) {
      await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
    }
    for (const alias of MP3_ALIAS_PATHS) {
      await expect(page.locator(`a[href="${alias}"]`)).toHaveCount(0);
    }
  });

  test("works in dark mode, passes focused axe scan, and is usable on mobile", async ({
    page,
  }) => {
    const consoleEntries = collectConsoleErrors(page);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, "dark");
    }, THEME_STORAGE_KEY);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByLabel("Message to turn into MP3 audio")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download MP3" })).toBeVisible();

    const axeResults = await new AxeBuilder({ page })
      .include("main")
      .disableRules(["color-contrast"])
      .analyze();
    expect(
      axeResults.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
    expect(filterHarnessConsoleNoise(consoleEntries)).toEqual([]);
  });
});
