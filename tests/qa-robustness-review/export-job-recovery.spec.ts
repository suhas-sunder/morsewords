import { expect, test } from "@playwright/test";
import { runSequentialExport } from "../../app/client/components/shared/export/sequentialExport";
import { createBookAudioPartDownloads } from "../../app/client/components/morse-code-book-translator/bookBundleExport";
import { DEFAULT_BOOK_EXPORT_SETTINGS, sanitizeBookExportSettings } from "../../app/client/components/morse-code-book-translator/bookExportPresets";
import { buildBookExportPlan } from "../../app/client/components/morse-code-book-translator/bookExportPlan";
import { bookExportProgressPercent, bookExportRemainingTimeLabel } from "../../app/client/components/morse-code-book-translator/bookExportProgressCopy";
import { blockExternalNetwork } from "./helpers";

const parts = [1, 2, 3].map(index => ({ index, filename: `part-${index}.wav`, durationMs: 100 }));

test("cancel at download boundary requests nothing and late progress is ignored", async () => {
  const controller = new AbortController();
  let late: ((p: number, s: "rendering") => void) | undefined;
  const progress: number[] = [], sent: number[] = [];
  await expect(runSequentialExport({ parts, signal: controller.signal,
    generatePart: async (_part, _signal, report) => { late = report; report(.7, "rendering"); report(.2, "rendering"); report(NaN, "rendering"); return new Blob(["audio"]); },
    finalizePart: part => { sent.push(part.index); },
    onProgress: p => { progress.push(p.overallProgress); if (p.stage === "requesting") controller.abort(); },
  })).rejects.toMatchObject({ name: "AbortError" });
  const count = progress.length; late?.(.9, "rendering");
  expect(progress).toHaveLength(count); expect(sent).toEqual([]);
  expect(progress.every((v, i) => Number.isFinite(v) && (i === 0 || v >= progress[i - 1]))).toBe(true);
});

test("failed finalizer resumes exact uncompleted indexes without duplicated requests", async () => {
  const sent: number[] = [];
  const generatePart = async () => new Blob(["audio"]);
  await expect(runSequentialExport({ parts, signal: new AbortController().signal, generatePart,
    finalizePart: part => { if (part.index === 2) throw new Error("download blocked"); sent.push(part.index); },
  })).rejects.toThrow("download blocked");
  const result = await runSequentialExport({ parts, signal: new AbortController().signal, generatePart,
    completedPartIndexes: [1], finalizePart: part => { sent.push(part.index); },
  });
  expect(sent).toEqual([1, 2, 3]); expect(result.completedPartIndexes).toEqual([1, 2, 3]);
  const sparse: number[] = [];
  await runSequentialExport({ parts, signal: new AbortController().signal, generatePart,
    completedPartIndexes: [2, 999], finalizePart: part => { sparse.push(part.index); },
  });
  expect(sparse).toEqual([1, 3]);
});

test("book cancellation during finalizing does not request a file and errors retain part identity", async () => {
  const settings = sanitizeBookExportSettings({ ...DEFAULT_BOOK_EXPORT_SETTINGS, outputFormat: "wav", sampleRate: 22050 });
  const plan = buildBookExportPlan({ cleanedText: "E", outputType: "audio", settings, sourceTitle: "Recovery" });
  const controller = new AbortController(); let sent = 0;
  const request = { metadata: { sourceType: "pasted" as const, title: "Recovery" }, parts: plan.parts, settings };
  await expect(createBookAudioPartDownloads({ ...request, signal: controller.signal,
    onProgress: p => { if (p.phase === "bundling") controller.abort(); }, onPartReady: () => { sent++; },
  })).rejects.toMatchObject({ name: "AbortError" });
  expect(sent).toBe(0);
  await expect(createBookAudioPartDownloads({ ...request, signal: new AbortController().signal,
    onPartReady: () => { throw new Error("download blocked"); },
  })).rejects.toThrow(/part 1/i);
});

test("book retry time estimates exclude earlier work and finalizing is below 100 percent", () => {
  const progress = { phase: "encoding" as const, message: "", currentPart: 1, totalParts: 2,
    renderedDurationMs: 900, resumedDurationMs: 800, totalDurationMs: 1000 };
  expect(bookExportRemainingTimeLabel(progress, 10000)).toBe("about 10s left");
  expect(bookExportProgressPercent({ ...progress, renderedDurationMs: 1000, phase: "bundling" })).toBe(99);
  expect(bookExportProgressPercent({ ...progress, renderedDurationMs: 1000, phase: "complete" })).toBe(100);
});

for (const width of [390, 768, 1440]) test(`real WAV export retries failed part without duplicates at ${width}`, async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(theme => {
    localStorage.clear(); localStorage.setItem("morsewords-theme", theme);
    const state = { attempts: [] as string[], sent: [] as string[], created: [] as string[], revoked: [] as string[], failed: false };
    Object.assign(window, { recoveryDownloads: state });
    const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = blob => { const url = create(blob); state.created.push(url); return url; };
    URL.revokeObjectURL = url => { state.revoked.push(url); revoke(url); };
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (!this.download) return click.call(this);
      state.attempts.push(this.download);
      if (state.attempts.length === 2 && !state.failed) { state.failed = true; throw new Error("Simulated browser download failure"); }
      state.sent.push(this.download);
    };
  }, info.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/audio", { waitUntil: "networkidle" });
  await page.getByLabel("Input (Text)").fill("SOS ".repeat(60));
  await page.getByRole("button", { name: "Show advanced settings" }).click();
  await page.getByLabel("Output format", { exact: true }).selectOption("wav");
  await page.getByRole("radio", { name: /Custom split time/ }).click();
  await page.getByLabel("Custom part duration").fill("1");
  const expected = Number(await page.getByTestId("morse-export-plan").getAttribute("data-export-part-count"));
  expect(expected).toBeGreaterThan(1);
  await page.getByRole("button", { name: "Save WAV audio", exact: true }).click();
  const job = page.getByTestId("morse-export-job");
  await expect(job).toHaveAttribute("data-export-status", "failed");
  await expect(job.getByText("1 download request already sent", { exact: true })).toBeVisible();
  await job.screenshot({ path: info.outputPath(`failed-${width}.png`) });
  await job.getByRole("button", { name: "Retry part 2", exact: true }).click();
  await expect(job).toHaveAttribute("data-export-status", "complete");
  await expect.poll(() => page.evaluate(() => {
    const state = (window as any).recoveryDownloads;
    return state.created.length === state.revoked.length;
  })).toBe(true);
  const downloads = await page.evaluate(() => (window as any).recoveryDownloads);
  expect(downloads.sent).toHaveLength(expected);
  expect(new Set(downloads.sent).size).toBe(expected);
  expect(downloads.attempts[1]).toBe(downloads.attempts[2]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});


test("real MP3 cancellation continues remaining files and source edits invalidate recovery", async ({ page }) => {
  await blockExternalNetwork(page);
  await page.addInitScript(() => {
    localStorage.clear();
    const state = { sent: [] as string[], cancelled: false };
    Object.assign(window, { recoveryDownloads: state });
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (!this.download) return click.call(this);
      state.sent.push(this.download);
      if (!state.cancelled) {
        state.cancelled = true;
        // Cancel from the actual control at the browser request boundary.
        Array.from(document.querySelectorAll("button")).find(b => b.textContent?.trim() === "Cancel export")?.click();
      }
    };
  });
  await page.goto("/audio", { waitUntil: "networkidle" });
  await page.getByLabel("Input (Text)").fill("SOS ".repeat(60));
  await page.getByRole("button", { name: "Show advanced settings" }).click();
  await page.getByLabel("Output format", { exact: true }).selectOption("mp3");
  await page.getByRole("radio", { name: /Custom split time/ }).click();
  await page.getByLabel("Custom part duration").fill("1");
  const expected = Number(await page.getByTestId("morse-export-plan").getAttribute("data-export-part-count"));
  await page.getByRole("button", { name: "Save MP3 audio", exact: true }).click();
  const job = page.getByTestId("morse-export-job");
  await expect(job).toHaveAttribute("data-export-status", "cancelled", { timeout: 30000 });
  await expect(job.getByRole("button", { name: "Continue remaining parts" })).toBeEnabled();
  await expect(job.getByText("1 download request already sent", { exact: true })).toBeVisible();
  await job.getByRole("button", { name: "Continue remaining parts" }).click();
  await expect(job).toHaveAttribute("data-export-status", "complete", { timeout: 30000 });
  const sent = await page.evaluate(() => (window as any).recoveryDownloads.sent as string[]);
  expect(sent).toHaveLength(expected); expect(new Set(sent).size).toBe(expected);
  await page.getByLabel("Input (Text)").fill("NEW SOURCE");
  await expect(job).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Retry part|Continue remaining parts/ })).toHaveCount(0);
});

test("sequential retry ETA measures only this attempt", async () => {
  const original = performance.now.bind(performance); let now = 0;
  Object.defineProperty(performance, "now", { configurable: true, value: () => now });
  let remaining: number | undefined;
  try {
    await runSequentialExport({
      parts: [{ index: 1, durationMs: 800, filename: "old.wav" }, { index: 2, durationMs: 200, filename: "new.wav" }],
      completedPartIndexes: [1], signal: new AbortController().signal,
      generatePart: async (_part, _signal, report) => { now = 10000; report(.5, "rendering"); return new Blob(["audio"]); },
      finalizePart: () => {}, onProgress: p => { if (p.stage === "rendering") remaining = p.remainingMs; },
    });
    expect(remaining).toBeCloseTo(10000);
  } finally { Object.defineProperty(performance, "now", { configurable: true, value: original }); }
});


test("book source replacement cannot reuse completed parts with the same filenames", async ({ page }) => {
  await blockExternalNetwork(page);
  await page.addInitScript(() => {
    localStorage.clear();
    const state = { attempts: 0, sent: [] as string[] };
    Object.assign(window, { bookRecoveryDownloads: state });
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (!this.download) return click.call(this);
      state.attempts++;
      if (state.attempts === 2) throw new Error("Simulated second-part failure");
      state.sent.push(this.download);
    };
  });
  await page.goto("/morse-code-book-translator", { waitUntil: "networkidle" });
  const tool = page.getByRole("region", { name: "Book source review and download tool" });
  await expect(page.locator("[data-mw-book-export-ready='true']")).toBeVisible();
  await page.getByLabel("Paste long-form source text").fill("SOS ".repeat(70));
  await tool.locator("summary").filter({ hasText: "Download settings" }).click();
  const controls = tool.getByTestId("audio-export-format-split-controls");
  await controls.getByLabel("Output format").selectOption("wav");
  await controls.getByRole("radio", { name: /Custom split time/ }).click();
  await controls.getByLabel("Custom part duration").fill("1");
  await tool.getByRole("button", { name: /Download \d+ WAV parts/ }).click();
  await expect(tool.getByRole("button", { name: "Continue remaining audio parts" })).toBeEnabled();
  expect(await page.evaluate(() => (window as any).bookRecoveryDownloads.sent.length)).toBe(1);
  await page.getByLabel("Paste long-form source text").fill("OSO ".repeat(70));
  await tool.getByRole("button", { name: /Download \d+ WAV parts/ }).click();
  await expect(tool.getByText(/ordered WAV download requests sent/).first()).toBeVisible();
  const sent = await page.evaluate(() => (window as any).bookRecoveryDownloads.sent as string[]);
  expect(sent.length).toBeGreaterThan(2);
  expect(sent[1]).toBe(sent[0]); // new source must request its first part again
});
