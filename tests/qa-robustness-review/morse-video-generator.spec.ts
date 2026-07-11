import { expect, test, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import { VIDEO_GENERATOR_PREFERENCES_KEY } from "../../app/client/components/morse-code-video-generator/videoGeneratorPreferences";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  sitemapLocs,
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

async function installFastVideoRecorder(
  page: Page,
  options: { mismatchedMp4?: boolean; mp4?: boolean } = {},
) {
  await page.addInitScript(({ mismatchedMp4, supportsMp4 }) => {
    Object.defineProperty(window, "__morseVideoRecorderMimeTypes", {
      configurable: true,
      value: [] as string[],
      writable: true,
    });
    Object.defineProperty(window, "__morseVideoCaptureSizes", {
      configurable: true,
      value: [] as Array<{ height: number; width: number }>,
      writable: true,
    });
    Object.defineProperty(window, "__morseVideoRecorderOptions", {
      configurable: true,
      value: [] as MediaRecorderOptions[],
      writable: true,
    });
    Object.defineProperty(window, "__morseVideoCleanupCounts", {
      configurable: true,
      value: { recorderStops: 0, trackStops: 0 },
      writable: true,
    });

    class FakeMediaStreamTrack {
      readonly kind: "audio" | "video";
      private stopped = false;

      constructor(kind: "audio" | "video") {
        this.kind = kind;
      }

      stop() {
        if (this.stopped) return;
        this.stopped = true;
        (
          window as typeof window & {
            __morseVideoCleanupCounts: {
              recorderStops: number;
              trackStops: number;
            };
          }
        ).__morseVideoCleanupCounts.trackStops += 1;
      }
    }

    class FakeMediaStream {
      private readonly tracks: FakeMediaStreamTrack[];

      constructor(tracks: FakeMediaStreamTrack[] = []) {
        this.tracks = [...tracks];
      }

      getTracks() {
        return [...this.tracks];
      }

      getVideoTracks() {
        return this.tracks.filter((track) => track.kind === "video");
      }

      getAudioTracks() {
        return this.tracks.filter((track) => track.kind === "audio");
      }
    }

    Object.defineProperty(window, "MediaStream", {
      configurable: true,
      value: FakeMediaStream,
    });

    class FakeMediaRecorder {
      static isTypeSupported(type: string) {
        return (
          type.startsWith("video/webm") ||
          (supportsMp4 && type.startsWith("video/mp4"))
        );
      }

      state = "inactive";
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onerror: (() => void) | null = null;
      onstop: (() => void) | null = null;
      readonly mimeType: string;

      constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
        this.mimeType = options?.mimeType || "video/webm";
        (
          window as typeof window & { __morseVideoRecorderMimeTypes: string[] }
        ).__morseVideoRecorderMimeTypes.push(this.mimeType);
        (
          window as typeof window & {
            __morseVideoRecorderOptions: MediaRecorderOptions[];
          }
        ).__morseVideoRecorderOptions.push({ ...(options ?? {}) });
      }

      start() {
        this.state = "recording";
      }

      stop() {
        if (this.state === "inactive") return;
        this.state = "inactive";
        (
          window as typeof window & {
            __morseVideoCleanupCounts: {
              recorderStops: number;
              trackStops: number;
            };
          }
        ).__morseVideoCleanupCounts.recorderStops += 1;
        const outputIsMp4 =
          this.mimeType.startsWith("video/mp4") && !mismatchedMp4;
        const blob = new Blob(
          [
            outputIsMp4
              ? "MP4-MORSE-VIDEO"
              : "WEBM-MORSE-VIDEO",
          ],
          {
            type: outputIsMp4 ? this.mimeType : "video/webm",
          },
        );
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
      (
        window as typeof window & {
          __morseVideoCaptureSizes: Array<{ height: number; width: number }>;
        }
      ).__morseVideoCaptureSizes.push({
        height: this.height,
        width: this.width,
      });
      return new MediaStream([
        new FakeMediaStreamTrack("video") as unknown as MediaStreamTrack,
      ]);
    };
  }, {
    mismatchedMp4: Boolean(options.mismatchedMp4),
    supportsMp4: Boolean(options.mp4),
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

async function installPreviewAudioProbe(page: Page) {
  await page.addInitScript(() => {
    const events: string[] = [];
    Object.defineProperty(window, "__morsePreviewAudioEvents", {
      configurable: true,
      value: events,
    });

    function fakeAudioParam() {
      return {
        value: 0,
        cancelScheduledValues: () => undefined,
        exponentialRampToValueAtTime: () => undefined,
        linearRampToValueAtTime: () => undefined,
        setTargetAtTime: () => undefined,
        setValueAtTime: () => undefined,
      };
    }

    class FakeAudioNode {
      connect() {
        return this;
      }

      addEventListener() {
        return undefined;
      }
    }

    class FakeOscillatorNode extends FakeAudioNode {
      frequency = fakeAudioParam();
      type: OscillatorType = "sine";
      onended: ((event: Event) => void) | null = null;

      start() {
        events.push("oscillator-start");
      }

      stop() {
        events.push("oscillator-stop");
      }
    }

    class FakeAudioContext {
      currentTime = 0;
      destination = new FakeAudioNode();
      sampleRate = 44100;
      state: AudioContextState = "running";

      createGain() {
        return Object.assign(new FakeAudioNode(), { gain: fakeAudioParam() });
      }

      createOscillator() {
        return new FakeOscillatorNode();
      }

      createMediaStreamDestination() {
        return Object.assign(new FakeAudioNode(), { stream: new MediaStream() });
      }

      resume() {
        events.push("resume");
        return Promise.resolve();
      }

      close() {
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: FakeAudioContext,
    });
    Object.defineProperty(window, "webkitAudioContext", {
      configurable: true,
      value: FakeAudioContext,
    });
  });
}

async function readPreviewAudioEvents(page: Page) {
  return page.evaluate(
    () => (window as typeof window & { __morsePreviewAudioEvents?: string[] })
      .__morsePreviewAudioEvents ?? [],
  );
}

async function readRecordedVideoMimeTypes(page: Page) {
  return page.evaluate(
    () =>
      (window as typeof window & { __morseVideoRecorderMimeTypes?: string[] })
        .__morseVideoRecorderMimeTypes ?? [],
  );
}

async function readCapturedVideoSizes(page: Page) {
  return page.evaluate(
    () =>
      (
        window as typeof window & {
          __morseVideoCaptureSizes?: Array<{ height: number; width: number }>;
        }
      ).__morseVideoCaptureSizes ?? [],
  );
}

async function readRecordedVideoOptions(page: Page) {
  return page.evaluate(
    () =>
      (
        window as typeof window & {
          __morseVideoRecorderOptions?: MediaRecorderOptions[];
        }
      ).__morseVideoRecorderOptions ?? [],
  );
}

async function downloadVideoFile(
  page: Page,
  testInfo: TestInfo,
  buttonName: string | RegExp = "Download WebM",
) {
  const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
  await page.getByRole("button", { name: buttonName }).click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(filePath);
  return {
    filename: download.suggestedFilename(),
    bytes: fs.readFileSync(filePath),
  };
}

async function expectVideoPreviewUsesModuleWidth(page: Page) {
  const previewBox = await page.getByTestId("morse-video-preview").boundingBox();
  const frameBox = await page
    .getByTestId("morse-video-preview-frame")
    .boundingBox();
  const timelineBox = await page
    .getByTestId("morse-video-preview-timeline")
    .boundingBox();
  expect(previewBox).not.toBeNull();
  expect(frameBox).not.toBeNull();
  expect(timelineBox).not.toBeNull();
  expect(frameBox!.width).toBeGreaterThan(previewBox!.width * 0.96);
  expect(timelineBox!.width).toBeGreaterThan(previewBox!.width * 0.96);
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

async function contrastAgainstRenderedBackground(
  page: Page,
  selector: string,
) {
  return page.locator(selector).first().evaluate((element) => {
    type Channels = { r: number; g: number; b: number; a: number };

    function parseColor(value: string): Channels | null {
      const rgb = value.match(/^rgba?\(([^)]+)\)$/);
      if (!rgb) return null;
      const parts = rgb[1].split(",").map((part) => Number.parseFloat(part));
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: parts.length > 3 ? parts[3] : 1,
      };
    }

    function blend(foreground: Channels, background: Channels): Channels {
      const alpha = foreground.a + background.a * (1 - foreground.a);
      if (alpha <= 0) return { r: 0, g: 0, b: 0, a: 0 };
      return {
        r:
          (foreground.r * foreground.a +
            background.r * background.a * (1 - foreground.a)) /
          alpha,
        g:
          (foreground.g * foreground.a +
            background.g * background.a * (1 - foreground.a)) /
          alpha,
        b:
          (foreground.b * foreground.a +
            background.b * background.a * (1 - foreground.a)) /
          alpha,
        a: alpha,
      };
    }

    function luminance(color: Channels) {
      const channels = [color.r, color.g, color.b].map((value) => {
        const channel = value / 255;
        return channel <= 0.03928
          ? channel / 12.92
          : Math.pow((channel + 0.055) / 1.055, 2.4);
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }

    function contrast(first: Channels, second: Channels) {
      const light = Math.max(luminance(first), luminance(second));
      const dark = Math.min(luminance(first), luminance(second));
      return (light + 0.05) / (dark + 0.05);
    }

    const style = window.getComputedStyle(element);
    const foreground = parseColor(style.color);
    const elementBackground = parseColor(style.backgroundColor);
    let background = elementBackground;
    for (
      let current = element.parentElement;
      (!background || background.a < 0.98) && current;
      current = current.parentElement
    ) {
      const parentBackground = parseColor(
        window.getComputedStyle(current).backgroundColor,
      );
      if (parentBackground) {
        background = background
          ? blend(background, parentBackground)
          : parentBackground;
      }
    }
    if (!foreground || !background) return 0;
    return contrast(foreground, background);
  });
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
    await expectVideoPreviewUsesModuleWidth(page);
    await expect(page.getByTestId("morse-video-preview-morse-overlay")).toBeVisible();
    await expect(
      page.getByTestId("morse-video-preview-active-morse-word"),
    ).toBeVisible();
    await expect(page.getByTestId("morse-video-preview-active-token")).toHaveCount(0);
    const formatOptions = await page
      .getByLabel("Video format")
      .locator("option")
      .evaluateAll((options) =>
        options.map((element) => {
          const option = element as HTMLOptionElement;
          return {
            disabled: option.disabled,
            label: option.textContent ?? "",
            value: option.value,
          };
        }),
      );
    expect(formatOptions).toEqual([
      expect.objectContaining({ disabled: false, label: "WebM", value: "webm" }),
      expect.objectContaining({
        disabled: true,
        label: "MP4 not supported in this browser.",
        value: "mp4",
      }),
    ]);
    expect(formatOptions.map((option) => option.value)).not.toContain("wmv");
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

  test("exports with native 720p and 1080p canvas quality settings", async ({
    page,
  }, testInfo) => {
    await installFastVideoRecorder(page);
    await openVideoGenerator(page);
    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("SOS VIDEO QUALITY");
    await page.getByLabel("File name").fill("video-quality-check");

    await expect(
      page.getByRole("radio", { name: "720p (1280 x 720)" }),
    ).toHaveAttribute("aria-checked", "true");
    await expect(
      page.getByRole("radio", { name: "1080p (1920 x 1080)" }),
    ).toHaveAttribute("aria-checked", "false");
    await expect(
      page.getByText("Export quality: 720p (1280 x 720)."),
    ).toBeVisible();

    await downloadVideoFile(page, testInfo);
    expect((await readCapturedVideoSizes(page)).at(-1)).toEqual({
      height: 720,
      width: 1280,
    });
    expect((await readRecordedVideoOptions(page)).at(-1)).toEqual(
      expect.objectContaining({
        mimeType: expect.stringMatching(/^video\/webm/),
        videoBitsPerSecond: expect.any(Number),
      }),
    );
    expect(
      ((await readRecordedVideoOptions(page)).at(-1)?.videoBitsPerSecond ?? 0),
    ).toBeGreaterThanOrEqual(5_000_000);

    await page.getByRole("radio", { name: "1080p (1920 x 1080)" }).click();
    await expect(
      page.getByText("Export quality: 1080p (1920 x 1080)."),
    ).toBeVisible();
    await downloadVideoFile(page, testInfo);
    expect((await readCapturedVideoSizes(page)).at(-1)).toEqual({
      height: 1080,
      width: 1920,
    });
    expect(
      ((await readRecordedVideoOptions(page)).at(-1)?.videoBitsPerSecond ?? 0),
    ).toBeGreaterThanOrEqual(9_000_000);
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
    const locs = sitemapLocs(xml);
    expect(xml).toContain(CANONICAL_URL);
    expect(locs).not.toContain(absoluteUrl(ALIAS_PATH));
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

    await page.getByRole("radio", { name: /Animated Morse signal/ }).click();
    await expect(page.getByTestId("morse-video-preview-morse-text")).toBeVisible();
    await expect(page.getByLabel("Tone preset")).toBeVisible();
    await page.getByRole("button", { name: "Include audio track" }).click();
    await expect(page.getByLabel("Tone preset")).toHaveCount(0);
    await expect(page.getByLabel("Pitch")).toHaveCount(0);
    await page.getByRole("button", { name: "Include audio track" }).click();
    await expect(page.getByLabel("Tone preset")).toBeVisible();
  });

  test("preview syncs visual signal, readable text, and timeline markers", async ({
    page,
  }) => {
    await installFastVideoRecorder(page);
    await installPreviewAudioProbe(page);
    await openVideoGenerator(page);
    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("ABCDE FGHIJ KLMNO PQRST visual preview");
    await expectVideoPreviewUsesModuleWidth(page);

    const textLayers = page.getByTestId("morse-video-preview-text-layers");
    const timelineMarker = page.getByTestId("morse-video-preview-timeline");
    await expect(textLayers).toHaveAttribute("data-active-character", /./);
    await expect(timelineMarker).toHaveAttribute("data-active-character", /./);
    const beforeSeek = (await textLayers.getAttribute("data-active-character")) ?? "";

    await page.getByRole("button", { name: "Play visual preview" }).click();
    await expect(page.getByTestId("morse-video-preview")).toHaveAttribute(
      "data-preview-playing",
      "true",
    );
    await expect
      .poll(async () =>
        (await readPreviewAudioEvents(page)).includes("oscillator-start"),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page
          .getByTestId("morse-video-preview-lightbulb")
          .getAttribute("data-preview-active"),
      )
      .toBe("true");
    await page.getByRole("button", { name: "Stop visual preview" }).click();

    await page.getByRole("radio", { name: /Dot/ }).click();
    await page.getByRole("button", { name: "Play visual preview" }).click();
    await expect
      .poll(() =>
        page
          .getByTestId("morse-video-preview-dot")
          .getAttribute("data-preview-active"),
      )
      .toBe("true");
    await page.getByRole("button", { name: "Stop visual preview" }).click();

    await page.getByRole("radio", { name: /Full-frame flash/ }).click();
    await page.getByRole("button", { name: "Play visual preview" }).click();
    await expect(page.getByTestId("morse-video-preview-frame")).toHaveAttribute(
      "data-full-frame-active",
      "true",
    );
    await expect(
      page.getByTestId("morse-video-preview-full-frame"),
    ).toHaveAttribute("data-preview-active", "true");
    await page.getByRole("button", { name: "Stop visual preview" }).click();

    const timeline = page.getByLabel("Video preview timeline");
    const timelineBox = await timeline.boundingBox();
    expect(timelineBox).not.toBeNull();
    await timeline.click({
      position: {
        x: timelineBox!.width * 0.72,
        y: timelineBox!.height / 2,
      },
    });
    await expect
      .poll(() => timeline.getAttribute("aria-valuenow"))
      .not.toBe("0");
    await expect(timeline).not.toHaveAttribute("aria-valuenow", "NaN");
    await expect
      .poll(() => textLayers.getAttribute("data-active-character"))
      .not.toBe(beforeSeek);
    expect(await textLayers.getAttribute("data-active-morse")).toBe(
      await timelineMarker.getAttribute("data-active-morse"),
    );
    await expect(
      page.getByTestId("morse-video-preview-active-morse-word"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Play visual preview" }).click();
    await expect(page.getByTestId("morse-video-preview")).toHaveAttribute(
      "data-preview-playing",
      "true",
    );
    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("Replacement source stops preview");
    await expect(page.getByTestId("morse-video-preview")).toHaveAttribute(
      "data-preview-playing",
      "false",
    );
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
    await expect(
      page.getByText("1 WebM file generated; download request sent."),
    ).toBeVisible();
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
    await expect(
      page.getByText("1 WebM file generated; download request sent."),
    ).toHaveCount(0);
  });

  test("native MediaRecorder keeps real video MIME types aligned with filenames", async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      const originalCreateObjectUrl = URL.createObjectURL.bind(URL);
      const captures: Array<{ size: number; type: string }> = [];
      URL.createObjectURL = (object: Blob | MediaSource) => {
        if (object instanceof Blob) {
          captures.push({ size: object.size, type: object.type });
        }
        return originalCreateObjectUrl(object);
      };
      Object.defineProperty(window, "__morseNativeVideoBlobs", {
        configurable: true,
        value: captures,
      });
    });
    await openVideoGenerator(page);
    await page.getByLabel("Video format").selectOption("webm");
    await page.getByLabel("Message to turn into a Morse code video").fill("E");
    await page.getByLabel("File name").fill("native-morse-video");

    const webm = await downloadVideoFile(page, testInfo);
    expect(webm.filename).toBe("native-morse-video.webm");
    expect(webm.bytes.length).toBeGreaterThan(0);
    const webmCapture = await page.evaluate(
      () =>
        (
          window as typeof window & {
            __morseNativeVideoBlobs?: Array<{ size: number; type: string }>;
          }
        ).__morseNativeVideoBlobs?.at(-1),
    );
    expect(webmCapture?.type).toMatch(/^video\/webm/i);
    expect(webmCapture?.size ?? 0).toBeGreaterThan(0);

    const mp4Option = page
      .getByLabel("Video format")
      .locator('option[value="mp4"]');
    if (!(await mp4Option.isDisabled())) {
      await page.getByLabel("Video format").selectOption("mp4");
      const mp4Button = page.getByRole("button", { name: "Download MP4" });
      await expect(mp4Button).toBeEnabled();
      await page.getByLabel("File name").fill("native-morse-video-mp4");
      const mp4 = await downloadVideoFile(page, testInfo, "Download MP4");
      expect(mp4.filename).toBe("native-morse-video-mp4.mp4");
      expect(mp4.bytes.length).toBeGreaterThan(0);
      const mp4Capture = await page.evaluate(
        () =>
          (
            window as typeof window & {
              __morseNativeVideoBlobs?: Array<{ size: number; type: string }>;
            }
          ).__morseNativeVideoBlobs?.at(-1),
      );
      expect(mp4Capture?.type).toMatch(/^video\/mp4/i);
      expect(mp4Capture?.size ?? 0).toBeGreaterThan(0);
    } else {
      await expect(
        page.getByText("MP4 not supported in this browser."),
      ).toBeVisible();
    }
  });

  test("enables MP4 only when MediaRecorder reports real MP4 support", async ({
    page,
  }, testInfo) => {
    await installFastVideoRecorder(page, { mp4: true });
    await openVideoGenerator(page);
    await page.getByLabel("Message to turn into a Morse code video").fill("SOS");
    await page.getByLabel("File name").fill("short-sos-mp4");

    await expect(page.getByLabel("Video format")).toHaveValue("mp4");
    await expect(page.getByRole("button", { name: "Download MP4" })).toBeEnabled();
    await expect(page.getByText("MP4 export starts only when")).toBeVisible();

    const video = await downloadVideoFile(page, testInfo, /Download MP4/);
    expect(video.filename).toBe("short-sos-mp4.mp4");
    expect(video.bytes.toString("utf8")).toContain("MP4-MORSE-VIDEO");
    expect(await readRecordedVideoMimeTypes(page)).toContainEqual(
      expect.stringMatching(/^video\/mp4/),
    );
    expect(video.filename).not.toMatch(/\.webm$/i);
    await expect(
      page.getByText("1 MP4 file generated; download request sent."),
    ).toBeVisible();
  });

  test("rejects WebM recorder output instead of saving it with an MP4 name", async ({
    page,
  }) => {
    await installFastVideoRecorder(page, { mp4: true, mismatchedMp4: true });
    await openVideoGenerator(page);
    await page.getByLabel("Message to turn into a Morse code video").fill("SOS");
    await expect(page.getByRole("button", { name: "Download MP4" })).toBeEnabled();
    await page.getByRole("button", { name: "Download MP4" }).click();
    await expect(page.getByRole("button", { name: "Retry part 1" })).toBeVisible();
    await expect(
      page.getByText("1 MP4 file generated; download request sent."),
    ).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (
              window as typeof window & {
                __morseVideoCleanupCounts?: {
                  recorderStops: number;
                  trackStops: number;
                };
              }
            ).__morseVideoCleanupCounts,
        ),
      )
      .toEqual({ recorderStops: 1, trackStops: 1 });
  });

  test("does not expose video formats when MIME support cannot be verified", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      class UnverifiedMediaRecorder {
        state = "inactive";
      }
      Object.defineProperty(window, "MediaRecorder", {
        configurable: true,
        value: UnverifiedMediaRecorder,
      });
      HTMLCanvasElement.prototype.captureStream = function captureStream() {
        return new MediaStream();
      };
    });
    await openVideoGenerator(page);
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeDisabled();
    await expect(
      page.getByText(
        "This browser cannot verify a supported MediaRecorder video format.",
      ),
    ).toBeVisible();
  });

  test("dark preview Morse highlight and timeline marker stay readable", async ({
    page,
  }) => {
    await installFastVideoRecorder(page);
    await page.addInitScript(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });
    await openVideoGenerator(page);
    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("Dark mode highlight contrast SOS HELP");
    await page.getByRole("radio", { name: "Dark MorseWords" }).click();

    await expect(
      page.getByTestId("morse-video-preview-active-morse-word"),
    ).toBeVisible();
    await expect(
      page.getByTestId("morse-video-preview-timing-strip-playhead"),
    ).toBeVisible();
    expect(
      await contrastAgainstRenderedBackground(
        page,
        '[data-testid="morse-video-preview-active-morse-word"]',
      ),
    ).toBeGreaterThanOrEqual(4.5);
    await expect(
      page.getByTestId("morse-video-preview-timing-strip-playhead"),
    ).toHaveClass(/bg-sky-300/);
  });

  test("long input plans ordered parts, keeps mobile layout, and stays clean", async ({
    page,
  }, testInfo) => {
    const consoleEntries = collectConsoleErrors(page);
    await installFastVideoRecorder(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await openVideoGenerator(page);

    await page
      .getByLabel("Message to turn into a Morse code video")
      .fill("ALPHA BRAVO CHARLIE ".repeat(400));
    const exportPlan = page.getByTestId("morse-export-plan");
    await expect(exportPlan).toBeVisible();
    await expect(exportPlan).toHaveAttribute("data-export-format", "webm");
    await expect
      .poll(async () => Number(await exportPlan.getAttribute("data-export-part-count")))
      .toBeGreaterThan(1);
    await expect(page.getByTestId("morse-export-split-note")).toBeVisible();
    await expect(
      page.getByText(/browser may ask you to allow multiple downloads/i),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Download WebM" })).toBeEnabled();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    expect(consoleEntries, testInfo.title).toEqual([]);
  });
});
