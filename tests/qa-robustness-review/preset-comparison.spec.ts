import { expect, test, type Page } from "@playwright/test";
import { AUDIO_TONE_PRESETS, AUDIO_TONE_PRESET_REGISTRY } from "../../app/client/components/shared/audioPresetRegistry";
import { blockExternalNetwork } from "./helpers";

async function installGraph(page: Page, theme: string) {
  await page.addInitScript(theme => {
    if (!sessionStorage.getItem("comparisonInitialized")) {
    localStorage.clear(); localStorage.setItem("morsewords-theme", theme);
    Object.entries({ mw_audio_preset: "triangle", mw_audio_wpm: "5", mw_audio_fwpm: "5", mw_audio_hz: "730",
      mw_audio_vol: "0.61", mw_audio_attack: "7", mw_audio_release: "9", mw_audio_repeat: "true" }).forEach(([k,v]) => localStorage.setItem(k,v));
    sessionStorage.setItem("comparisonInitialized", "true");
    }
    const stats = { contexts: 0, active: 0, starts: [] as { type: string; hz: number }[], stops: [] as number[] };
    Object.assign(window, { comparisonGraph: stats });
    class Param { value = 0; cancelScheduledValues() {} setValueAtTime(v: number) { this.value = v; } linearRampToValueAtTime(v: number) { this.value = v; } exponentialRampToValueAtTime(v: number) { this.value = v; } setTargetAtTime(v: number) { this.value = v; } }
    class Node extends EventTarget {
      frequency = new Param(); gain = new Param(); Q = new Param(); type = "sine";
      buffer: { length: number } | null = null; onended: ((event: Event) => void) | null = null;
      active = false; timer = 0;
      connect(next: unknown) { return next; } disconnect() {}
      start() { if (this.buffer?.length === 1) return; this.active = true; stats.active++; stats.starts.push({ type: this.buffer ? "buffer" : this.type, hz: this.frequency.value }); }
      stop(when = 0) {
        clearTimeout(this.timer);
        if (when > 0) { stats.stops.push(when); this.timer = window.setTimeout(() => this.stop(), when * 1000); return; }
        if (this.active) stats.active--; this.active = false;
        const event = new Event("ended"); this.onended?.(event); this.dispatchEvent(event);
      }
    }
    class Context {
      currentTime = 0; sampleRate = 44100; destination = {}; state = "running";
      constructor() { stats.contexts++; }
      createGain() { return new Node(); } createBiquadFilter() { return new Node(); }
      createOscillator() { return new Node(); } createBufferSource() { return new Node(); }
      createBuffer(channels: number, length: number) { const data = Array.from({ length: channels }, () => new Float32Array(length)); return { length, getChannelData: (i: number) => data[i] }; }
      resume() { this.state = "running"; return Promise.resolve(); } close() { this.state = "closed"; return Promise.resolve(); }
    }
    Object.defineProperty(window, "AudioContext", { configurable: true, value: Context });
    Object.defineProperty(window, "webkitAudioContext", { configurable: true, value: Context });
  }, theme);
}
const stats = (page: Page) => page.evaluate(() => (window as any).comparisonGraph as { contexts: number; active: number; starts: { type: string; hz: number }[]; stops: number[] });

for (const route of ["/audio", "/morse-code-sound-generator"]) {
  for (const width of [390, 768, 1440]) {
    test(`${route} compares canonical tones without changing preferences at ${width}`, async ({ page }, info) => {
      await blockExternalNetwork(page); await installGraph(page, info.project.name.endsWith("dark") ? "dark" : "light");
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.getByLabel(route === "/audio" ? "Input (Text)" : "Message to turn into a Morse tone").fill("TTTT");
      await page.getByRole("button", { name: "Show advanced settings" }).click();
      const comparison = page.getByTestId("tone-comparison");
      await comparison.locator("summary").focus(); await page.keyboard.press("Enter");
      const a = comparison.getByLabel("Comparison A tone"), b = comparison.getByLabel("Comparison B tone");
      for (const select of [a, b]) {
        expect(await select.locator("option").evaluateAll(options => options.map(o => (o as HTMLOptionElement).value))).toEqual([...AUDIO_TONE_PRESETS]);
        expect(await select.locator("option").allTextContents()).toEqual(AUDIO_TONE_PRESETS.map(id => AUDIO_TONE_PRESET_REGISTRY[id].label));
        expect(await select.locator("optgroup").evaluateAll(groups => groups.map(g => g.getAttribute("label")))).toEqual(["Standard Morse tones", "Creative synthesized tones"]);
      }
      expect((await stats(page)).contexts).toBe(0);
      const saved = () => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => /^mw_audio_(preset|wpm|fwpm|hz|vol|attack|release|repeat|sound|flash)$/.test(key))));
      const before = await saved();
      await a.selectOption("sine"); await b.selectOption("square");
      await comparison.getByRole("button", { name: "Play comparison A" }).focus(); await page.keyboard.press("Enter");
      await expect(comparison.getByRole("status")).toHaveText("Playing A: Sine");
      await expect.poll(async () => (await stats(page)).starts.at(-1)?.type).toBe("sine");
      const durationA = (await stats(page)).stops.at(-1)!;
      await comparison.getByRole("button", { name: "Play comparison B" }).click();
      await expect(comparison.getByRole("status")).toHaveText("Playing B: Square");
      const graph = await stats(page);
      expect(graph.starts.at(-1)).toEqual({ type: "square", hz: 730 });
      expect(graph.stops.at(-1)).toBeCloseTo(durationA);
      expect(graph.active).toBe(1); expect(graph.contexts).toBe(1);
      await comparison.screenshot({ path: info.outputPath(`comparison-${width}.png`) });
      await page.screenshot({ path: info.outputPath(`context-${width}.png`) });
      await comparison.getByRole("button", { name: "Stop comparison" }).click();
      expect((await stats(page)).active).toBe(0);
      if (width === 1440) {
        for (const preset of AUDIO_TONE_PRESETS) {
          await a.selectOption(preset); const count = (await stats(page)).starts.length;
          await comparison.getByRole("button", { name: "Play comparison A" }).click();
          await expect.poll(async () => (await stats(page)).starts.length).toBeGreaterThan(count);
          await comparison.getByRole("button", { name: "Stop comparison" }).click();
          expect((await stats(page)).active).toBe(0);
        }
      }
      expect(await saved()).toEqual(before);
      await expect(page.getByLabel("Tone preset", { exact: true })).toHaveValue("triangle");
      await comparison.getByRole("button", { name: "Play comparison B" }).click();
      await page.getByLabel(route === "/audio" ? "Input (Text)" : "Message to turn into a Morse tone").fill("NEW MESSAGE");
      await expect(comparison.getByRole("button", { name: "Stop comparison" })).toBeDisabled();
      expect((await stats(page)).active).toBe(0);
      await page.getByLabel(route === "/audio" ? "Input (Text)" : "Message to turn into a Morse tone").fill("");
      await expect(comparison.getByRole("button", { name: "Play comparison A" })).toBeDisabled();
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
      await page.reload({ waitUntil: "networkidle" });
      await expect(page.getByLabel("Tone preset", { exact: true })).toHaveValue("triangle");
    });
  }
}


test("comparison stops on feedback changes, closing, settings changes and navigation", async ({ page }, info) => {
  await blockExternalNetwork(page); await installGraph(page, info.project.name.endsWith("dark") ? "dark" : "light");
  await page.goto("/audio", { waitUntil: "networkidle" });
  await page.getByLabel("Input (Text)").fill("TTTT");
  await page.getByRole("button", { name: "Show advanced settings" }).click();
  const comparison = page.getByTestId("tone-comparison");
  await comparison.locator("summary").click();
  await comparison.getByRole("button", { name: "Play comparison A" }).click();
  await page.getByRole("button", { name: "Sound", exact: true }).click();
  await expect(comparison.getByRole("button", { name: "Play comparison A" })).toBeDisabled();
  await expect(comparison.getByRole("status")).toHaveText("Turn Sound on to compare tones.");
  expect((await stats(page)).active).toBe(0);
  await page.getByRole("button", { name: "Sound", exact: true }).click();
  await comparison.getByRole("button", { name: "Play comparison B" }).click();
  await comparison.locator("summary").click();
  expect((await stats(page)).active).toBe(0);
  await comparison.locator("summary").click();
  await comparison.getByRole("button", { name: "Play comparison A" }).click();
  await page.getByLabel("Character speed").fill("10");
  await expect(comparison.getByRole("button", { name: "Stop comparison" })).toBeDisabled();
  expect((await stats(page)).active).toBe(0);
  await comparison.getByRole("button", { name: "Play comparison B" }).click();
  await page.getByRole("banner").getByRole("link").first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(async () => (await stats(page)).active).toBe(0);
  await page.goto("/morse-code-sound-generator", { waitUntil: "networkidle" });
  await expect(page.getByLabel("Tone preset", { exact: true })).toHaveValue("triangle");
  await expect(page.getByLabel("Character speed")).toHaveValue("10");
});


test("rejected audio unlock leaves comparison stopped with an actionable status", async ({ page }) => {
  await blockExternalNetwork(page); await installGraph(page, "light");
  await page.goto("/audio", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Show advanced settings" }).click();
  const comparison = page.getByTestId("tone-comparison");
  await comparison.locator("summary").click();
  await page.evaluate(() => {
    const Context = window.AudioContext;
    Object.defineProperty(window, "AudioContext", { configurable: true, value: class extends Context {
      constructor() { super(); Object.defineProperty(this, "state", { value: "suspended" }); }
      resume() { return Promise.reject(new Error("Audio unlock rejected")); }
    } });
  });
  await comparison.getByRole("button", { name: "Play comparison A" }).click();
  await expect(comparison.getByRole("status")).toHaveText("Audio could not start. Try Play again to unlock sound.");
  await expect(comparison.getByRole("button", { name: "Stop comparison" })).toBeDisabled();
  expect((await stats(page)).active).toBe(0);
});
