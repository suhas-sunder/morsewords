import { expect, test, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import { VIDEO_GENERATOR_PREFERENCES_KEY } from "../../app/client/components/morse-code-video-generator/videoGeneratorPreferences";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
} from "./helpers";

const CANONICAL_PATH = ROUTES.videoGenerator;
const ALIAS_PATH = ROUTES.textToMorseVideoAlias;
const CANONICAL_URL = absoluteUrl(CANONICAL_PATH);
const RAW_SECRET_TEXT = "Private Video Draft Source";

async function openVideoGenerator(page: Page) {
  await blockExternalNetwork(page);
  await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.locator("[data-mw-video-generator-ready='true']"),
  ).toBeVisible();
}

async function installFastVideoRecorder(page: Page) {
  await page.addInitScript(() => {
    class FakeMediaRecorder {
      static isTypeSupported(type: string) {
        return type.startsWith("video/webm");
      }

      state = "inactive";
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onerror: (() => void) | null = null;
      onstop: (() => void) | null = null;
      readonly mimeType: string;

      constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
        this.mimeType = options?.mimeType || "video/webm";
      }

      start() {
        this.state = "recording";
      }

      stop() {
        if (this.state === "inactive") return;
        this.state = "inactive";
        const blob = new Blob(["WEBM-MORSE-VIDEO"], {
          type: this.mimeType,
        });
        window.setTimeout(() => {
          this.ondataavailable?.({ data: blob } as BlobEvent);
          this.onstop?.();
        }, 0);
      }
    }

    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: FakeMediaRecorder,
    });
    HTMLCanvasElement.prototype.captureStream = function captureStream() {
      return new MediaStream();
    };
  });
}

async function installUnsupportedVideoRecorder(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, "captureStream", {
      configurable: true,
      value: undefined,
    });
  });
}

async function downloadVideoFile(page: Page, testInfo: TestInfo) {
  const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
  await page.getByRole("button", { name: "Download WebM" }).click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(filePath);
  return {
    filename: download.suggestedFilename(),
    bytes: fs.readFileSync(filePath),
  };
}

async function expectNoRawInputInStorage(page: Page, rawText: string) {
  const storageSnapshot = await page.evaluate(() =>
    [
      ...Object.keys(localStorage).map(
        (key) => `${key}:${localStorage.getItem(key)}`,
      ),
      ...Object.keys(sessionStorage).map(
        (key) => `${key}:${sessionStorage.getItem(key)}`,
      ),
    ].join("\n"),
  );
  expect(storageSnapshot).not.toContain(rawText);
}

test.describe("Morse code video generator", () => {
  test("renders canonical metadata and core short-form video controls", async ({
    page,
  }) => {
    await installFastVideoRecorder(page);
    await openVideoGenerator(page);

    await expect(page).toHaveTitle(
      "Morse Code Video Generator | Text to Morse Code Video | MorseWords",
    );
    await expect(page.locator("h1")).toHaveText("Morse Code Video Generator");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      CANONICAL_URL,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      CANONICAL_URL,
    );
    await expect(
      page.getByRole("button", { name: "Text to Morse video" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Morse code to video" }),
    ).toBeVisible();
    await expect(
      page.getByLabel("Message to turn into a Morse code video"),
    ).toBeVisible();
    await expect(page.getByTestId("morse-video-preview")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeEnabled();
    await expect(page.getByText("WebM export starts only when")).toBeVisible();
    await expect(
      page.getByText(
        "Your message is not uploaded to MorseWords servers or stored in a database.",
      ),
    ).toBeVisible();

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent ?? "").join("\n"),
      );
    expect(jsonLd).toContain(CANONICAL_URL);
    expect(jsonLd).toContain("WebApplication");
  });

  test("alias and sitemaps use the canonical video generator URL", async ({
    page,
    request,
  }) => {
    await page.goto("/sitemap", { waitUntil: "domcontentloaded" });
    await expect(page.locator(`a[href="${CANONICAL_PATH}"]`).first()).toBeVisible();
    await expect(page.locator(`a[href="${ALIAS_PATH}"]`)).toHaveCount(0);

    const aliasResponse = await request.get(ALIAS_PATH, { maxRedirects: 0 });
    expect(aliasResponse.status()).toBe(301);
    expect(aliasResponse.headers().location).toBe(CANONICAL_PATH);

    const xmlResponse = await request.get("/sitemap.xml");
    expect(xmlResponse.ok()).toBe(true);
    const xml = await xmlResponse.text();
    expect(xml).toContain(CANONICAL_URL);
    expect(xml).not.toContain(absoluteUrl(ALIAS_PATH));
  });

  test("text and Morse modes report issues, disable blank export, and avoid raw storage", async ({
    page,
  }) => {
    await installFastVideoRecorder(page);
    await openVideoGenerator(page);
    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill(`${RAW_SECRET_TEXT} snowman \u2603`);

    await expect(page.getByText("Unsupported characters are ignored")).toBeVisible();
    await expect(page.getByLabel("Generated Morse output")).toHaveValue(/\.--\./);
    await expectNoRawInputInStorage(page, RAW_SECRET_TEXT);

    await page.getByRole("button", { name: "Morse code to video" }).click();
    await page.getByLabel("Morse code to turn into a video").fill("... --- ... $");
    await expect(page.getByText("Invalid Morse input characters: $")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeEnabled();

    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.getByLabel("Morse code to turn into a video")).toHaveValue("");
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeDisabled();
    await expect(page.getByText("Add text or typed Morse")).toBeVisible();
  });

  test("video preferences persist without saving raw source input", async ({
    page,
  }) => {
    await installFastVideoRecorder(page);
    await openVideoGenerator(page);
    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill(RAW_SECRET_TEXT);
    await page.getByRole("radio", { name: /Dot/ }).click();
    await page.getByLabel("File name").fill("private-video-title");

    await expect
      .poll(() =>
        page.evaluate((key) => localStorage.getItem(key), VIDEO_GENERATOR_PREFERENCES_KEY),
      )
      .toContain('"visualStyle":"dot"');
    await expect
      .poll(() =>
        page.evaluate((key) => localStorage.getItem(key), VIDEO_GENERATOR_PREFERENCES_KEY),
      )
      .toContain('"fileName":"private-video-title"');
    await expectNoRawInputInStorage(page, RAW_SECRET_TEXT);

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(
      page.locator("[data-mw-video-generator-ready='true']"),
    ).toBeVisible();
    await expect(page.getByTestId("morse-video-preview-dot")).toBeVisible();
    await expect(page.getByLabel("Message to turn into a Morse code video")).not.toHaveValue(
      RAW_SECRET_TEXT,
    );
  });

  test("visual styles, warning, audio controls, and preview stay scoped", async ({
    page,
  }) => {
    await installFastVideoRecorder(page);
    await openVideoGenerator(page);

    await expect(page.getByTestId("morse-video-preview-lightbulb")).toBeVisible();
    await expect(page.getByTestId("morse-video-full-frame-warning")).toHaveCount(0);
    await page.getByRole("radio", { name: /Dot/ }).click();
    await expect(page.getByTestId("morse-video-preview-dot")).toBeVisible();
    await page.getByRole("radio", { name: /Full-frame flash/ }).click();
    await expect(page.getByTestId("morse-video-preview-full-frame")).toBeVisible();
    await expect(page.getByTestId("morse-video-full-frame-warning")).toHaveCount(1);
    await expect(page.getByText("Strobe warning:")).toBeVisible();
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

    await page.getByRole("button", { name: "Play visual preview" }).click();
    await expect(page.getByTestId("morse-video-preview")).toHaveAttribute(
      "data-preview-playing",
      "true",
    );
    await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
    await page.getByRole("button", { name: "Stop visual preview" }).click();

    await page.getByRole("radio", { name: /Animated Morse text/ }).click();
    await expect(page.getByTestId("morse-video-preview-morse-text")).toBeVisible();
    await expect(page.getByLabel("Tone preset")).toBeVisible();
    await page.getByRole("button", { name: "Include audio track" }).click();
    await expect(page.getByLabel("Tone preset")).toHaveCount(0);
    await expect(page.getByLabel("Pitch")).toHaveCount(0);
    await page.getByRole("button", { name: "Include audio track" }).click();
    await expect(page.getByLabel("Tone preset")).toBeVisible();
  });

  test("unsupported browser video APIs disable WebM export with a clear message", async ({
    page,
  }) => {
    await installUnsupportedVideoRecorder(page);
    await openVideoGenerator(page);

    await expect(page.getByRole("button", { name: "Download WebM" })).toBeDisabled();
    await expect(
      page.getByText("This browser does not support MediaRecorder video export."),
    ).toBeVisible();
  });

  test("downloads a direct WebM and cancels stale work", async ({
    page,
  }, testInfo) => {
    await installFastVideoRecorder(page);
    await openVideoGenerator(page);
    await page.getByRole("button", { name: "Include audio track" }).click();
    await page.getByLabel("Message to turn into a Morse code video").fill("SOS");
    await page.getByLabel("File name").fill("short-sos-video");

    const video = await downloadVideoFile(page, testInfo);
    expect(video.filename).toBe("short-sos-video.webm");
    expect(video.bytes.toString("utf8")).toContain("WEBM-MORSE-VIDEO");
    await expect(page.getByText("WebM download started.")).toBeVisible();
    await expect(page.getByText("Last download")).toBeVisible();

    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("SOS HELP ".repeat(20));
    await page.getByRole("button", { name: "Download WebM" }).click();
    await expect(page.getByRole("button", { name: "Cancel download" })).toBeEnabled();
    await page.getByRole("button", { name: "Cancel download" }).click();
    await expect(page.getByText("Video download cancelled.")).toBeVisible();

    await page.getByRole("button", { name: "Download WebM" }).click();
    await expect(page.getByRole("button", { name: "Cancel download" })).toBeEnabled();
    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("Replacement video source");
    await expect(
      page.getByText("Input or settings changed; video download cancelled."),
    ).toBeVisible();
    await expect(page.getByText("WebM download started.")).toHaveCount(0);
  });

  test("long guard, mobile layout, and console stay clean", async ({
    page,
  }, testInfo) => {
    const consoleEntries = collectConsoleErrors(page);
    await installFastVideoRecorder(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await openVideoGenerator(page);

    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("ALPHA BRAVO CHARLIE ".repeat(400));
    await expect(page.getByText("capped at about 3 minutes")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Use the book translator for long-form export." }),
    ).toHaveAttribute("href", ROUTES.bookTranslator);
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeDisabled();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    expect(consoleEntries, testInfo.title).toEqual([]);
  });
});
