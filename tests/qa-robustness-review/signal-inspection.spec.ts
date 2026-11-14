import { expect, test } from "@playwright/test";
import { analyzeSamplesToMorse, analyzeSamplesToMorseAsync, mixAudioBufferToMono, mixAudioBufferToMonoAsync } from "../../app/client/components/morse-code-audio-decoder/audioDecodeUtils";
import { blockExternalNetwork, collectConsoleErrors } from "./helpers";

// Windows Playwright WebKit has no AudioContext. Adapt only PCM WAV decoding at
// that absent browser boundary; the sample renderer, samples and analyzer remain real.
test.beforeEach(async ({ page, browserName }) => {
  if (browserName !== "webkit") return;
  await page.addInitScript(() => {
    if (typeof AudioContext !== "undefined") return;
    class PcmWavContext {
      decodeAudioData(buffer: ArrayBuffer) {
        const view = new DataView(buffer);
        if (view.getUint16(20, true) !== 1 || view.getUint16(34, true) !== 16) return Promise.reject(new Error("PCM WAV only"));
        const sampleRate = view.getUint32(24, true), channels = view.getUint16(22, true);
        const length = view.getUint32(40, true) / (2 * channels);
        const data = Array.from({ length: channels }, (_, channel) => Float32Array.from({ length }, (_, i) => view.getInt16(44 + (i * channels + channel) * 2, true) / 32768));
        return Promise.resolve({ length, sampleRate, numberOfChannels: channels, duration: length / sampleRate, getChannelData: (n: number) => data[n] });
      }
      close() { return Promise.resolve(); }
    }
    Object.defineProperty(window, "AudioContext", { value: PcmWavContext, configurable: true });
  });
});

function pulses(seconds: number, rate = 48_000) {
  const samples = new Float32Array(seconds * rate);
  for (let i = 0; i < samples.length; i += 1) samples[i] = Math.floor(i / rate / .06) % 8 < 3 ? .55 * Math.sin(2 * Math.PI * 600 * i / rate) : 0;
  return samples;
}

test("sync and cooperative analysis preserve exact results and bounded peak/region evidence", async () => {
  for (const seconds of [1, 30, 180]) {
    const samples = pulses(seconds);
    const expected = analyzeSamplesToMorse(samples, 48_000, { expectedWpm: 20 });
    const actual = await analyzeSamplesToMorseAsync(samples, 48_000, { expectedWpm: 20 }, new AbortController().signal);
    expect(actual).toEqual(expected);
    expect(actual.inspection!.envelope.length).toBeLessThanOrEqual(512);
    expect(Math.max(...actual.inspection!.envelope)).toBe(actual.timing.peakLevel);
    expect(actual.inspection!.toneCoverage.every(x => x >= 0 && x <= 1)).toBe(true);
    const occupiedMs = actual.inspection!.toneCoverage.reduce((a, b) => a + b, 0) * seconds * 1000 / actual.inspection!.envelope.length;
    expect(occupiedMs).toBeGreaterThan(seconds * 1000 * .3);
    expect(occupiedMs).toBeLessThan(seconds * 1000 * .5);
    expect(actual.inspection!.timingSource).toBe("selected");
    expect(JSON.stringify(actual.inspection).length).toBeLessThan(25_000);
  }
  const silent = analyzeSamplesToMorse(new Float32Array(48_000), 48_000);
  expect(silent.status).toBe("no-tones");
  expect(silent.inspection!.envelope.every(x => x === 0)).toBe(true);
  expect(silent.inspection!.toneCoverage.every(x => x === 0)).toBe(true);
  expect(analyzeSamplesToMorse(new Float32Array(181 * 8000), 8000).inspection).toBeUndefined();
});

test("long analysis yields to cancellation and mixing preserves channel arithmetic", async () => {
  const samples = pulses(180);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 0);
  await expect(analyzeSamplesToMorseAsync(samples, 48_000, {}, controller.signal)).rejects.toMatchObject({ name: "AbortError" });
  clearTimeout(timer);
  const channels = [pulses(1), pulses(1).map(x => -x / 2)];
  const buffer = { length: channels[0].length, numberOfChannels: 2, getChannelData: (n: number) => channels[n] } as AudioBuffer;
  expect(await mixAudioBufferToMonoAsync(buffer, new AbortController().signal)).toEqual(mixAudioBufferToMono(buffer));
  const aborted = new AbortController(); aborted.abort();
  await expect(mixAudioBufferToMonoAsync(buffer, aborted.signal)).rejects.toMatchObject({ name: "AbortError" });
});

for (const width of [390, 768, 1440]) test(`signal evidence stays optional, accessible and readable at ${width}`, async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.setViewportSize({ width, height: 844 });
  await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
  const errors = collectConsoleErrors(page);
  await page.goto("/morse-code-audio-decoder");
  await expect(page.locator('[data-mw-audio-decoder-ready="true"]')).toBeVisible();
  await expect(page.getByText("Inspect detected signal", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Try a clean sample", exact: true }).click();
  await expect(page.locator("audio")).toHaveAttribute("src", /^blob:/);
  await page.getByRole("button", { name: "Decode audio", exact: true }).click();
  await expect(page.locator('[aria-label="Decoded text output"]')).toHaveText("SOS HELP");
  const disclosure = page.locator("details").filter({ has: page.getByText("Inspect detected signal", { exact: true }) });
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").focus(); await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure).toContainText("not a probability");
  await expect(disclosure).toContainText("estimated timing");
  await expect(disclosure.getByRole("img")).toBeVisible();
  expect(await disclosure.locator("svg path").count()).toBe(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await disclosure.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath(`signal-${width}.png`), fullPage: false });
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(disclosure).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("selected timing is identified and silent audio has honest flat evidence", async ({ page }, info) => {
  await blockExternalNetwork(page);
  await page.addInitScript(theme => localStorage.setItem("morsewords-theme", theme), info.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/morse-code-audio-decoder");
  await page.getByRole("button", { name: "Try a clean sample", exact: true }).click();
  await expect(page.locator("audio")).toHaveAttribute("src", /^blob:/);
  await page.getByRole("button", { name: "Advanced settings", exact: true }).click();
  await page.locator("#audio-decoder-wpm").focus();
  await page.keyboard.press("Home");
  for (let i = 0; i < 20; i += 1) await page.keyboard.press("ArrowRight");
  await page.getByRole("button", { name: "Decode audio", exact: true }).click();
  await page.getByText("Inspect detected signal", { exact: true }).click();
  await expect(page.getByText("Selected speed", { exact: true })).toBeVisible();
  await expect(page.getByText(/60 ms dot duration.*selected timing/)).toBeVisible();
  const rate = 8000, wav = Buffer.alloc(44 + rate * 2);
  wav.write("RIFF"); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVE", 8); wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write("data", 36); wav.writeUInt32LE(rate * 2, 40);
  await page.locator('input[type="file"]').setInputFiles({ name: "silence.wav", mimeType: "audio/wav", buffer: wav });
  await page.getByRole("button", { name: "Decode audio", exact: true }).click();
  await page.getByText("Inspect detected signal", { exact: true }).click();
  await expect(page.getByText("No clear tones", { exact: true })).toBeVisible();
  await expect(page.getByText(/0 tone regions and 0 internal silence gaps/)).toBeVisible();
  await expect(page.getByText("Not established", { exact: true })).toHaveCount(2);
});
