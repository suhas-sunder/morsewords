import { expect, test } from "@playwright/test";

import {
  MORSE_AUDIO_SPLIT_PRESET_MINUTES,
  buildMorseExportPlan,
  getMorseAudioSplitTargetDurationMs,
  validateCustomMorseAudioSplitMinutes,
} from "../../app/client/components/shared/export/morseExportPlan";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const LONG_SOURCE = "T ".repeat(240);
const COMPACT_THRESHOLD = {
  targetDurationMs: 10_000,
  maxDurationMs: 20_000,
  maxEstimatedBytes: 128 * 1024 * 1024,
};

function buildAudioPlan(
  splitMode: "none" | "duration" | "custom",
  targetPartDurationMs?: number,
) {
  return buildMorseExportPlan({
    baseFilename: "audio-format-parity",
    charWpm: 20,
    farnsworthWpm: 20,
    format: "wav",
    kind: "audio",
    sampleRate: 8_000,
    source: LONG_SOURCE,
    sourceMode: "text",
    splitMode,
    targetPartDurationMs,
    threshold: COMPACT_THRESHOLD,
  });
}

test.describe("audio format and split policy", () => {
  test("No split stays one file while duration plans use safe ordered parts", () => {
    const noSplit = buildAudioPlan("none");
    expect(noSplit.parts).toHaveLength(1);
    expect(noSplit.multiPart).toBe(false);
    expect(noSplit.singleFileUnsafe).toBe(true);
    expect(noSplit.parts[0]?.filename).toBe("audio-format-parity.wav");
    expect(noSplit.parts[0]?.sourceStart).toBe(0);
    expect(noSplit.parts[0]?.sourceEnd).toBe(LONG_SOURCE.length);

    const durationSplit = buildAudioPlan("duration", 10_000);
    expect(durationSplit.multiPart).toBe(true);
    expect(durationSplit.singleFileUnsafe).toBe(false);
    expect(durationSplit.parts.length).toBeGreaterThan(1);
    expect(
      durationSplit.parts.every(
        (part) => part.durationMs <= COMPACT_THRESHOLD.targetDurationMs,
      ),
    ).toBe(true);
    expect(
      durationSplit.parts
        .map((part) => LONG_SOURCE.slice(part.sourceStart, part.sourceEnd))
        .join(""),
    ).toBe(LONG_SOURCE);
    expect(durationSplit.parts.map((part) => part.filename)).toEqual(
      durationSplit.parts.map(
        (part, index, parts) =>
          `audio-format-parity-part-${String(index + 1).padStart(2, "0")}-of-${String(
            parts.length,
          ).padStart(2, "0")}.wav`,
      ),
    );
  });

  test("duration presets and custom split validation stay explicit", () => {
    expect(MORSE_AUDIO_SPLIT_PRESET_MINUTES).toEqual([5, 10, 15, 30, 45, 60]);
    expect(validateCustomMorseAudioSplitMinutes("")).toMatch(/positive duration/i);
    expect(validateCustomMorseAudioSplitMinutes("0")).toMatch(/positive duration/i);
    expect(validateCustomMorseAudioSplitMinutes("-5")).toMatch(/positive duration/i);
    expect(validateCustomMorseAudioSplitMinutes("0.5")).toMatch(/at least 1 minute/i);
    expect(validateCustomMorseAudioSplitMinutes("241")).toMatch(/240 minutes or less/i);
    expect(validateCustomMorseAudioSplitMinutes("7")).toBe("");
    expect(
      getMorseAudioSplitTargetDurationMs({
        customMinutes: "7",
        mode: "custom",
        presetMinutes: 60,
      }),
    ).toBe(7 * 60_000);
    expect(
      getMorseAudioSplitTargetDurationMs({
        customMinutes: "",
        mode: "duration",
        presetMinutes: 60,
      }),
    ).toBe(60 * 60_000);
  });
});

test.describe("audio download controls", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("the audio hub directly selects MP3 or WAV and explains all split modes", async ({
    page,
  }) => {
    await page.goto("/audio", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    await expect(page.getByRole("button", { name: "Save MP3 audio" })).toBeVisible();
    const controls = page.getByTestId("audio-export-format-split-controls");
    if (!(await controls.isVisible())) {
      await page.getByRole("button", { name: "Show advanced" }).click();
    }
    await expect(controls).toBeVisible();
    const format = controls.getByLabel("Output format");
    await expect(format).toHaveValue("mp3");
    await expect(format.locator("option")).toHaveText(["MP3", "WAV"]);

    await format.selectOption("wav");
    await expect(format).toHaveValue("wav");
    await expect(page.getByRole("button", { name: "Save WAV audio" })).toBeVisible();
    await page.getByRole("button", { name: "Hide advanced" }).click();
    await page.getByRole("button", { name: "Show advanced" }).click();
    await expect(controls.getByLabel("Output format")).toHaveValue("wav");

    await expect(controls.getByRole("radio", { name: "No split" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(
      controls.getByRole("radio", { name: "Split by duration" }),
    ).toBeVisible();
    await expect(
      controls.getByRole("radio", { name: /Custom split time/ }),
    ).toContainText("Experimental");

    await controls.getByRole("radio", { name: "Split by duration" }).click();
    const duration = controls.getByLabel("Part duration");
    await expect(duration.locator("option")).toHaveText([
      "5 minutes",
      "10 minutes",
      "15 minutes",
      "30 minutes",
      "45 minutes",
      "60 minutes",
    ]);
    await duration.selectOption("60");
    await expect(duration).toHaveValue("60");

    await controls.getByRole("radio", { name: /Custom split time/ }).click();
    const customDuration = controls.getByLabel("Custom part duration");
    await customDuration.fill("0");
    await expect(controls.getByRole("alert")).toHaveText(
      "Enter a positive duration in minutes.",
    );
    await customDuration.fill("7");
    await expect(controls.getByRole("alert")).toHaveCount(0);

    await expect
      .poll(() =>
        page.evaluate(() => ({
          custom: window.localStorage.getItem("mw_audio_custom_split_minutes"),
          format: window.localStorage.getItem("mw_audio_format"),
          mode: window.localStorage.getItem("mw_audio_split_mode"),
        })),
      )
      .toEqual({ custom: "7", format: "wav", mode: "custom" });

    const plan = page.getByTestId("morse-export-plan");
    await expect(plan).toHaveAttribute(
      "data-export-part-count",
      "1",
    );
    await expect(page.getByTestId("morse-export-split-note")).toHaveCount(0);
    const splitFaq = page.getByText("How do No split and Split by duration work?", {
      exact: true,
    });
    await splitFaq.click();
    await expect(page.getByText("No split requests exactly one file.", { exact: false })).toBeVisible();
    const downloadFaq = page.getByText(
      "Will my browser download every multipart file automatically?",
      { exact: true },
    );
    await downloadFaq.click();
    await expect(page.getByText("download was requested", { exact: false })).toBeVisible();

  });

  test("the MP3 generator exposes WAV through the shared format control", async ({
    page,
  }) => {
    await page.goto("/morse-code-mp3-generator", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);

    const controls = page.getByTestId("audio-export-format-split-controls");
    await expect(controls).toBeVisible();
    const format = controls.getByLabel("Output format");
    await expect(format).toHaveValue("mp3");
    await format.selectOption("wav");
    await expect(page.getByRole("button", { name: "Download WAV" }).first()).toBeVisible();
    await expect(page.getByLabel("MP3 kbps")).toHaveCount(0);

    await controls.getByRole("radio", { name: "Split by duration" }).click();
    await expect(controls.getByLabel("Part duration")).toHaveValue("15");
    await controls.getByRole("radio", { name: /Custom split time/ }).click();
    const customDuration = controls.getByLabel("Custom part duration");
    await customDuration.fill("-1");
    await expect(controls.getByRole("alert")).toHaveText(
      "Enter a positive duration in minutes.",
    );
    await customDuration.fill("10");
    await expect(controls.getByRole("alert")).toHaveCount(0);
  });
});
