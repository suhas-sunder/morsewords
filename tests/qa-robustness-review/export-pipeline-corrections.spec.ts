import { expect, test, type Locator, type Page } from "@playwright/test";
import { strFromU8, unzipSync } from "fflate";

import { ROUTES } from "../../app/client/data/routes";
import {
  buildBookExportBatches,
  buildBookExportPlan,
} from "../../app/client/components/morse-code-book-translator/bookExportPlan";
import { createBookDownloadPackage } from "../../app/client/components/morse-code-book-translator/bookBundleExport";
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
import { DEFAULT_BOOK_VIDEO_SETTINGS } from "../../app/client/components/morse-code-book-translator/bookVideoTypes";
import {
  buildMorseVideoPreview,
  getMorseVideoPreviewFrame,
} from "../../app/client/components/shared/video/morseVideoPreview";
import { getMorseVideoCanonicalFrameState } from "../../app/client/components/shared/video/morseVideoRenderer";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const BOOK_TOOL_LABEL = "Book source review and download tool";
const TEST_BOOK_PATH =
  "/morse-code-books/test-published-morse-book?preview=test-published";
const PUBLIC_BOOK_PATH = "/morse-code-books/treasure-island";
const PUBLIC_AUDIOBOOK_PATH = "/morse-code-audiobooks/treasure-island";

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

async function openRoute(page: Page, path: string) {
  await blockExternalNetwork(page);
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  expect(response?.ok()).toBe(true);
}

async function openBookTranslator(page: Page) {
  await openRoute(page, ROUTES.bookTranslator);
  await expect(page.locator("[data-mw-book-export-ready='true']")).toBeVisible();
}

function bookTool(page: Page) {
  return page.locator(`section[aria-label="${BOOK_TOOL_LABEL}"]`);
}

async function expectNoVideoExportControls(scope: Page | Locator) {
  await expect(scope.getByText(["Download", "MP4"].join(" "))).toHaveCount(0);
  await expect(scope.getByText(["Download", "WebM"].join(" "))).toHaveCount(0);
  await expect(scope.getByText(["Download", "video"].join(" "))).toHaveCount(0);
  await expect(scope.getByText(["Rendering", "video"].join(" "))).toHaveCount(0);
  await expect(scope.getByText(["Video", "format"].join(" "))).toHaveCount(0);
  await expect(scope.getByText(["Available", "after export"].join(" "))).toHaveCount(0);
  await expect(scope.getByText("browser-safe file")).toHaveCount(0);
  await expect(scope.getByText("choose fewer chapters")).toHaveCount(0);
}

test.describe("MP3 export planning", () => {
  test("short MP3 exports plan as one direct file", () => {
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      outputFormat: "mp3",
      splitMode: "none",
    });
    const plan = buildBookExportPlan({
      cleanedText: "SOS HELP",
      outputType: "audio",
      settings,
    });

    expect(plan.directFileRuntimeLimitMs).toBe(BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS);
    expect(plan.parts).toHaveLength(1);
    expect(plan.zipWorkflow).toBe(false);
    expect(plan.automaticSplit).toBe(false);
  });

  test("long MP3 exports use browser-safe sequential parts", () => {
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      outputFormat: "mp3",
      splitMode: "none",
      targetPartMinutes: 30,
    });
    const plan = buildBookExportPlan({
      cleanedText: longText(1_200),
      outputType: "audio",
      settings,
    });

    expect(plan.automaticSplit).toBe(true);
    expect(plan.zipWorkflow).toBe(false);
    expect(plan.targetPartMs).toBeLessThanOrEqual(BOOK_DEFAULT_PART_TARGET_MS);
    expect(plan.batchTargetMs).toBe(BOOK_ZIP_BATCH_TARGET_MS);
    expect(plan.parts.length).toBeGreaterThan(1);
    expect(plan.parts.every((item) => item.morseDurationMs <= 45 * 60_000)).toBe(
      true,
    );
  });

  test("example durations produce the expected ZIP batch counts", () => {
    expect(buildBookExportBatches([part(1, 59)])).toHaveLength(1);

    const oneHourOne = buildBookExportBatches([
      part(1, 30),
      part(2, 30),
      part(3, 1),
    ]);
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
    expect(elevenThirtyEightParts.length).toBeLessThan(119);
  });

  test("ZIP batches contain ordered MP3 parts and manifest metadata", async () => {
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      outputFormat: "mp3",
      splitMode: "duration",
      includeManifest: true,
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

test.describe("MP3-only book and translator UI", () => {
  test("short book page offers direct MP3 and links to the live player", async ({
    page,
  }) => {
    await openRoute(page, TEST_BOOK_PATH);
    await expect(page.locator("[data-mw-morse-book-output-foundation]")).toBeVisible();
    await expect(page.getByText("Preview and download")).toBeVisible();
    await expect(page.getByText("Settings", { exact: true })).toBeVisible();
    await expect(page.getByTestId("book-audio-preview")).toBeVisible();
    await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-download-label]")).toHaveAttribute(
      "data-mw-morse-book-download-label",
      "Download MP3",
    );
    await expect(
      page.getByTestId("morse-book-live-player-link"),
    ).toHaveAttribute("href", /\/morse-code-audiobooks\/test-published-morse-book/);
    await expectNoVideoExportControls(page);
  });

  test("long public book page uses sequential MP3 parts", async ({ page }) => {
    await openRoute(page, PUBLIC_BOOK_PATH);
    await expect(page.locator("[data-mw-morse-book-output-foundation]")).toBeVisible();
    await expect(page.locator("[data-mw-morse-book-download-label]")).toHaveAttribute(
      "data-mw-morse-book-download-label",
      "Download MP3 parts",
    );
    await expect(page.getByLabel("ZIP batch")).toHaveCount(0);
    await expect(page.getByText(BOOK_LONG_EXPORT_MESSAGE)).toBeVisible();
    await expect(page.getByTestId("morse-book-live-player-link")).toHaveAttribute(
      "href",
      /\/morse-code-audiobooks\/treasure-island/,
    );
    await expect(page.getByTestId("morse-book-live-player")).toBeVisible();
    await expectNoVideoExportControls(page);
  });

  test("book listing defaults to the primary book page for specific books", async ({
    page,
  }) => {
    await openRoute(page, "/morse-code-books");
    const firstBookCard = page.getByTestId("morse-book-card").first();
    await expect(firstBookCard).toHaveAttribute(
      "href",
      /\/morse-code-books\//,
    );
    await expect(page.locator('a[href^="/morse-code-audiobooks/"]')).toHaveCount(0);

    await openRoute(page, "/");
    await expect(
      page.getByTestId("home-featured-book-primary-link").first(),
    ).toHaveAttribute("href", /\/morse-code-books\//);
  });

  test("book translator exposes MP3 download and live player, not video export", async ({
    page,
  }) => {
    await openBookTranslator(page);
    const tool = bookTool(page);
    await expect(tool.getByRole("region", { name: "Download MP3" })).toBeVisible();
    await expect(tool.getByTestId("book-live-player-workflow")).toBeVisible();
    await expect(tool.getByRole("radio", { name: "Video", exact: true })).toHaveCount(0);
    await expect(tool.getByRole("radio", { name: "Audio", exact: true })).toHaveCount(0);
    await expectNoVideoExportControls(tool);

    await page.getByLabel("Paste long-form source text").fill(longText(2_500));
    await tool.locator("summary").filter({ hasText: "Download settings" }).click();
    await expect(tool.getByRole("radio", { name: "By source sections" })).toHaveCount(0);
    await tool.getByRole("radio", { name: "By duration" }).click();
    await expect(tool.getByLabel("Target part length")).toHaveValue("30");
    await expect(tool.getByLabel("ZIP batch")).toHaveCount(0);
    await expect(
      tool.getByRole("button", { name: /Download \d+ MP3 parts/ }),
    ).toBeEnabled();
    await expect(
      tool.getByText(/browser may ask you to allow multiple downloads/i),
    ).toBeVisible();

    const stored = await page.evaluate(() => Object.values(localStorage).join("\n"));
    expect(stored).not.toContain("SOS HELP SOS HELP");
  });
});

test.describe("audiobook audio workflow", () => {
  test("keeps playback audio-only and exposes the local multipart export plan", async ({
    page,
  }) => {
    await openRoute(page, PUBLIC_AUDIOBOOK_PATH);

    const player = page.getByTestId("morse-book-live-player");
    const exportPlan = page.getByTestId("morse-audiobook-export-plan");
    await expect(player).toBeVisible();
    await expect(
      player.getByRole("button", { name: "Play selection" }),
    ).toBeVisible();
    await expect(player.getByTestId("book-video-preview-workflow")).not.toBeVisible();
    await expect(
      player.getByTestId("morse-book-live-section-select"),
    ).not.toBeVisible();
    await expect(exportPlan).toBeVisible();
    await expect(exportPlan.getByText("Export plan", { exact: true })).toBeVisible();
    await expect(
      exportPlan.getByText("Selection duration", { exact: true }),
    ).toBeVisible();
    await expect(exportPlan.getByText("Audio settings", { exact: true })).toBeVisible();
    await expectNoVideoExportControls(page);

    const source = page.locator(
      "[data-mw-morse-book-translator-source-sections]",
    );
    await expect(
      page.locator("[data-mw-morse-book-select-all-default]"),
    ).toBeChecked();
    await expect(
      player.getByRole("button", { name: "Play selection" }),
    ).toBeEnabled();

    await page.getByRole("button", { name: "Clear selection" }).click();
    await expect(source).toHaveAttribute(
      "data-mw-morse-book-translator-source-sections",
      "",
    );
    await expect(
      exportPlan.getByRole("button", {
        name: /Download MP3|Download MP3 parts|Download ZIP/,
      }),
    ).toBeDisabled();
  });
});

test.describe("canonical live visual state", () => {
  for (const sample of [
    "SOS HELP",
    "THE QUICK BROWN FOX",
    "HELLO WORLD",
    "BOOK ONE CHAPTER ONE",
    "EEE TTT SSS OOO",
    "WAIT, STOP. GO!",
    "Signals at dawn moved across the ridge.",
  ]) {
    test(`live player state is deterministic for ${sample}`, () => {
      const settings = sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS);
      const preview = buildMorseVideoPreview(
        DEFAULT_BOOK_VIDEO_SETTINGS,
        sample,
        settings,
        {
          maxCharacters: 10_000,
          maxDurationMs: 10 * 60_000,
          maxWords: 1_000,
        },
      );
      const mark = preview.timeline.events.find((event) => event.type === "mark");
      const gap = preview.timeline.events.find((event) => event.type === "gap");
      expect(mark).toBeTruthy();
      expect(gap).toBeTruthy();

      const toneState = getMorseVideoCanonicalFrameState(
        preview.timeline,
        mark!.startMs + 1,
      );
      expect(toneState.bulbActive).toBe(true);
      expect(toneState.toneState).toBe("tone");
      expect(toneState.activeMorseToken).not.toBeNull();
      expect(toneState.activeCharacter).not.toBe("");
      expect(toneState.morseWindow).toContain(toneState.activeCharacterMorse);

      const gapState = getMorseVideoCanonicalFrameState(
        preview.timeline,
        gap!.startMs + 1,
      );
      expect(gapState.bulbActive).toBe(false);
      expect(gapState.toneState).toBe("gap");

      for (const elapsedMs of [
        0,
        mark!.startMs + 1,
        Math.min(preview.durationMs, preview.durationMs / 2),
        Math.max(0, preview.durationMs - 120),
      ]) {
        const frame = getMorseVideoPreviewFrame(preview, elapsedMs);
        const state = getMorseVideoCanonicalFrameState(preview.timeline, elapsedMs);
        expect(frame.active).toBe(state.bulbActive);
        expect(frame.textExcerpt).not.toMatch(/S O HHELP/i);
        expect(frame.textExcerpt).not.toMatch(/\b(\w+)\s+\1\s+\1\b/i);
      }
    });
  }
});
