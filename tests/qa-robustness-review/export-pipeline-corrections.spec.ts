import { expect, test, type Page } from "@playwright/test";
import { strFromU8, unzipSync } from "fflate";

import { ROUTES } from "../../app/client/data/routes";
import {
  buildBookExportBatches,
  buildBookExportPlan,
} from "../../app/client/components/morse-code-book-translator/bookExportPlan";
import {
  createBookDownloadPackage,
} from "../../app/client/components/morse-code-book-translator/bookBundleExport";
import {
  BOOK_DEFAULT_PART_TARGET_MS,
  BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
  BOOK_LONG_EXPORT_MESSAGE,
  BOOK_ZIP_BATCH_TARGET_MS,
} from "../../app/client/components/morse-code-book-translator/bookExportSafety";
import {
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "../../app/client/components/morse-code-book-translator/bookExportPresets";
import {
  bookExportProgressDetail,
  bookExportProgressPercent,
} from "../../app/client/components/morse-code-book-translator/bookExportProgressCopy";
import type { BookExportPart } from "../../app/client/components/morse-code-book-translator/bookExportTypes";
import {
  buildBookVideoTimeline,
  renderBookVideoFrame,
} from "../../app/client/components/morse-code-book-translator/bookVideoRenderer";
import {
  DEFAULT_BOOK_VIDEO_SETTINGS,
  sanitizeBookVideoSettings,
} from "../../app/client/components/morse-code-book-translator/bookVideoTypes";
import {
  buildMorseVideoPreview,
  getMorseVideoPreviewFrame,
} from "../../app/client/components/shared/video/morseVideoPreview";
import { getMorseVideoCanonicalFrameState } from "../../app/client/components/shared/video/morseVideoRenderer";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const BOOK_TOOL_LABEL = "Book source review and download tool";

function part(index: number, minutes: number): BookExportPart {
  return {
    index,
    title: `Part ${index}`,
    sourceStart: index * 100,
    sourceEnd: index * 100 + 80,
    cleanedText: `SOS HELP ${index}`,
    cleanedExcerpt: `SOS HELP ${index}`,
    morseDurationMs: minutes * 60_000,
    estimatedFilename: `morse-book-part-${String(index).padStart(3, "0")}.mp3`,
  };
}

function longText(repetitions: number) {
  return "SOS HELP ".repeat(repetitions).trim();
}

async function installMp4RecorderSupport(page: Page) {
  await page.addInitScript(() => {
    class FakeMediaRecorder {
      static isTypeSupported(type: string) {
        return type.startsWith("video/mp4");
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

async function installFailingMp4Recorder(page: Page) {
  await page.addInitScript(() => {
    class FailingMediaRecorder {
      mimeType: string;
      ondataavailable: ((event: BlobEvent) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;
      onstop: ((event: Event) => void) | null = null;
      state = "inactive";

      static isTypeSupported(type: string) {
        return type.startsWith("video/mp4");
      }

      constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
        this.mimeType = options?.mimeType || "video/mp4";
      }

      start() {
        throw new Error("Invalid typed array length");
      }

      stop() {
        this.state = "inactive";
        this.onstop?.(new Event("stop"));
      }
    }

    Object.defineProperty(window, "MediaRecorder", {
      configurable: true,
      value: FailingMediaRecorder,
    });
    HTMLCanvasElement.prototype.captureStream = function captureStream() {
      return new MediaStream();
    };
  });
}

async function openBookTranslator(page: Page) {
  await installMp4RecorderSupport(page);
  await blockExternalNetwork(page);
  await page.goto(ROUTES.bookTranslator, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(page.locator("[data-mw-book-export-ready='true']")).toBeVisible();
}

function bookTool(page: Page) {
  return page.locator(`section[aria-label="${BOOK_TOOL_LABEL}"]`);
}

test.describe("export pipeline correction planning", () => {
  test("short audio and video exports plan as one direct file", () => {
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      splitMode: "none",
    });

    for (const outputType of ["audio", "video"] as const) {
      const plan = buildBookExportPlan({
        cleanedText: "SOS HELP",
        outputType,
        settings,
        videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
      });
      expect(plan.directFileRuntimeLimitMs).toBe(BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS);
      expect(plan.parts).toHaveLength(1);
      expect(plan.zipWorkflow).toBe(false);
      expect(plan.automaticSplit).toBe(false);
    }
  });

  test("long audio and video exports use 30 minute parts and two hour ZIP batches", () => {
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      splitMode: "none",
      targetPartMinutes: 30,
    });

    for (const outputType of ["audio", "video"] as const) {
      const plan = buildBookExportPlan({
        cleanedText: longText(1_200),
        outputType,
        settings,
        videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
      });
      expect(plan.automaticSplit).toBe(true);
      expect(plan.zipWorkflow).toBe(true);
      expect(plan.targetPartMs).toBe(BOOK_DEFAULT_PART_TARGET_MS);
      expect(plan.batchTargetMs).toBe(BOOK_ZIP_BATCH_TARGET_MS);
      expect(plan.parts.length).toBeGreaterThan(1);
      expect(plan.parts.every((item) => item.morseDurationMs <= 60 * 60_000)).toBe(true);
    }
  });

  test("example durations produce batch counts without tiny video parts", () => {
    expect(buildBookExportBatches([part(1, 59)])).toHaveLength(1);
    const oneHourOne = buildBookExportBatches([part(1, 30), part(2, 30), part(3, 1)]);
    expect(oneHourOne).toHaveLength(1);
    expect(oneHourOne[0].parts).toHaveLength(3);

    const twoFortyThree = buildBookExportBatches([
      part(1, 30),
      part(2, 30),
      part(3, 30),
      part(4, 30),
      part(5, 30),
      part(6, 13),
    ]);
    expect(twoFortyThree).toHaveLength(2);
    expect(twoFortyThree.map((batch) => batch.parts.length)).toEqual([4, 2]);

    const elevenThirtyEightParts = Array.from({ length: 24 }, (_, index) =>
      part(index + 1, index === 23 ? 8 : 30),
    );
    const elevenThirtyEight = buildBookExportBatches(elevenThirtyEightParts);
    expect(elevenThirtyEight).toHaveLength(6);
    expect(elevenThirtyEightParts).toHaveLength(24);
    expect(elevenThirtyEightParts.length).toBeLessThan(119);
  });

  test("ZIP batches contain ordered media and manifest metadata", async () => {
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      splitMode: "duration",
      includeManifest: false,
      includeSettings: false,
      includeReadme: false,
    });
    const parts = [part(1, 0.01), part(2, 0.01)].map((item) => ({
      ...item,
      cleanedText: item.index === 1 ? "SOS" : "HELP",
      morseDurationMs: 500,
    }));
    const batches = buildBookExportBatches(parts);
    const result = await createBookDownloadPackage({
      allParts: parts,
      batch: batches[0],
      metadata: { title: "Tiny Batch", sourceType: "pasted" },
      parts,
      settings,
      signal: new AbortController().signal,
      totalSelectedRuntimeMs: 1_000,
    });
    expect(result.downloadKind).toBe("zip");
    const entries = unzipSync(new Uint8Array(await result.blob.arrayBuffer()));
    const names = Object.keys(entries).sort();
    expect(names.filter((name) => name.endsWith(".mp3"))).toEqual([
      "morse-book-part-001.mp3",
      "morse-book-part-002.mp3",
    ]);
    expect(names).toContain("manifest.json");
    const manifest = JSON.parse(strFromU8(entries["manifest.json"]));
    expect(manifest.app).toBe("MorseWords");
    expect(manifest.batchNumber).toBe(1);
    expect(manifest.totalBatches).toBe(1);
    expect(manifest.partCountInBatch).toBe(2);
    expect(manifest.globalPartCount).toBe(2);
    expect(manifest.files.audio).toEqual([
      "morse-book-part-001.mp3",
      "morse-book-part-002.mp3",
    ]);
    expect(manifest.parts[0].coverage.sourceStart).toEqual(expect.any(Number));
    expect(manifest.settingsSummary.targetPartMinutes).toBe(30);
  });

  test("progress copy reports elapsed time, honest ETA, and estimating fallback", () => {
    const calculating = {
      phase: "encoding",
      batchNumber: 1,
      batchPartCount: 4,
      batchPartIndex: 2,
      currentPart: 1,
      renderedDurationMs: 30 * 60_000,
      totalBatches: 6,
      totalDurationMs: 120 * 60_000,
      totalParts: 4,
    } as const;
    expect(bookExportProgressPercent(calculating)).toBe(25);
    expect(bookExportProgressDetail(calculating, 6_000)).toBe(
      "ZIP batch 1 of 6 / Part 2 of 4 / about 18s left",
    );

    expect(
      bookExportProgressDetail(
        {
          phase: "encoding",
          currentPart: 0,
          renderedDurationMs: 0,
          totalDurationMs: 120 * 60_000,
          totalParts: 4,
        },
        45_000,
      ),
    ).toBe("Working / 45s elapsed / estimating time remaining...");
  });
});

test.describe("export pipeline correction UI", () => {
  test("book translator defaults to video, hides source-section split, and exposes ZIP batches", async ({
    page,
  }) => {
    await openBookTranslator(page);
    await expect(bookTool(page).getByRole("radio", { name: "Video", exact: true })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(bookTool(page).getByRole("radio", { name: "Audio", exact: true })).toHaveAttribute(
      "aria-checked",
      "false",
    );

    await page.getByLabel("Paste long-form source text").fill(longText(2_500));
    await bookTool(page).locator("summary").filter({ hasText: "Download settings" }).click();
    await expect(bookTool(page).getByRole("radio", { name: "By source sections" })).toHaveCount(0);
    await bookTool(page).getByRole("radio", { name: "By duration" }).click();
    await expect(bookTool(page).getByLabel("Target part length")).toHaveValue("30");
    await expect(bookTool(page).getByLabel("ZIP batch")).toBeVisible();
    await expect(bookTool(page).getByRole("button", { name: "Download ZIP batch 1" })).toBeEnabled();
    await expect(bookTool(page).getByText(BOOK_LONG_EXPORT_MESSAGE)).toBeVisible();
    await expect(bookTool(page).getByText("browser-safe file")).toHaveCount(0);
    await expect(bookTool(page).getByText("choose fewer chapters")).toHaveCount(0);
    await bookTool(page).getByLabel("ZIP batch").selectOption("2");
    await expect(bookTool(page).getByRole("button", { name: "Download ZIP batch 2" })).toBeEnabled();
  });

  test("book pages default to video and keep audio persistence available", async ({
    page,
  }) => {
    await installMp4RecorderSupport(page);
    await blockExternalNetwork(page);
    await page.goto("/morse-code-books/test-published-morse-book?preview=test-published", {
      waitUntil: "domcontentloaded",
    });
    await waitForRouteReady(page);
    await expect(page.locator("[data-mw-morse-book-page]")).toHaveAttribute(
      "data-mw-morse-book-settings-restored",
      "true",
    );
    await expect(page.locator("[data-mw-morse-book-output-type='video']")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("button", { name: "Download MP4" })).toBeEnabled();
    await page.locator("[data-mw-morse-book-output-type='audio']").click();
    await expect(page.locator("[data-mw-morse-book-output-type='audio']")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const stored = await page.evaluate(() =>
      Object.values(localStorage).join("\n"),
    );
    expect(stored).toContain('"outputType":"audio"');
    expect(stored).not.toContain("SOS HELP carried");
  });

  test("failed video export shows a readable retryable error and recovers controls", async ({
    page,
  }) => {
    await installFailingMp4Recorder(page);
    await blockExternalNetwork(page);
    await page.goto(ROUTES.bookTranslator, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await page.getByLabel("Paste long-form source text").fill("SOS HELP");
    const downloadButton = bookTool(page).getByRole("button", { name: "Download MP4" });
    await expect(downloadButton).toBeEnabled();
    await downloadButton.click();
    await expect(
      bookTool(page).getByText(
        "Video export failed while rendering a part. Retry the download, or lower video resolution if it fails again.",
      ),
    ).toBeVisible();
    await expect(bookTool(page).getByText("Invalid typed array length")).toHaveCount(0);
    await expect(downloadButton).toBeEnabled();
  });
});

test.describe("video preview/export canonical state", () => {
  for (const sample of [
    "SOS HELP",
    "THE QUICK BROWN FOX",
    "Signals at dawn moved across the ridge.",
    "SOS HELP PART ONE\n\nPART TWO BEGINS",
  ]) {
    test(`preview and export state match at fixed timestamps for ${sample.slice(0, 14)}`, () => {
      const settings = sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS);
      const videoSettings = sanitizeBookVideoSettings(DEFAULT_BOOK_VIDEO_SETTINGS);
      const timeline = buildBookVideoTimeline(sample, settings);
      const preview = buildMorseVideoPreview(videoSettings, sample, settings, {
        maxCharacters: 10_000,
        maxDurationMs: 10 * 60_000,
        maxWords: 1_000,
      });
      const timestamps = [
        0,
        Math.min(500, timeline.durationMs / 4),
        Math.min(1_500, timeline.durationMs / 2),
        Math.max(0, timeline.durationMs - 120),
      ];

      for (const elapsedMs of timestamps) {
        const exportState = getMorseVideoCanonicalFrameState(timeline, elapsedMs);
        const previewState = getMorseVideoCanonicalFrameState(preview.timeline, elapsedMs);
        const previewFrame = getMorseVideoPreviewFrame(preview, elapsedMs);
        expect(exportState.bulbActive).toBe(previewState.bulbActive);
        expect(exportState.toneState).toBe(previewState.toneState);
        expect(exportState.activeCharacter).toBe(previewState.activeCharacter);
        expect(exportState.activeCharacterMorse).toBe(previewState.activeCharacterMorse);
        expect(previewFrame.textExcerpt).toContain(previewState.plainTextWindow.split(" ")[0] ?? "");
        expect(exportState.plainTextWindow).not.toMatch(/S O HHELP/i);
      }
    });
  }

  test("canvas export clears and repaints each frame before drawing overlays", () => {
    const settings = sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS);
    const timeline = buildBookVideoTimeline("SOS HELP", settings);
    const calls: string[] = [];
    const ctx = {
      arc: () => calls.push("arc"),
      beginPath: () => calls.push("beginPath"),
      clearRect: () => calls.push("clearRect"),
      fill: () => calls.push("fill"),
      fillStyle: "",
      fillRect: () => calls.push("fillRect"),
      fillText: (text: string) => calls.push(`fillText:${text}`),
      font: "",
      measureText: (text: string) => ({ width: text.length * 18 }),
      textAlign: "left",
      textBaseline: "alphabetic",
    } as unknown as CanvasRenderingContext2D;

    renderBookVideoFrame({
      ctx,
      elapsedMs: 250,
      exportSettings: settings,
      frame: { width: 1280, height: 720 },
      settings: DEFAULT_BOOK_VIDEO_SETTINGS,
      timeline,
      resolvedBackgroundStyle: "warm-morsewords",
    });

    expect(calls[0]).toBe("clearRect");
    expect(calls[1]).toBe("fillRect");
    expect(calls.some((call) => call.startsWith("fillText:"))).toBe(true);
  });
});
