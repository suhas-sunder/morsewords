import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const AUDIO_PRESETS = [
  "cw_radio",
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "sounder",
] as const;

test("useAudio remains a compatibility wrapper around useMorseAudio", () => {
  const source = fs.readFileSync(
    path.join(
      process.cwd(),
      "app",
      "client",
      "components",
      "shared",
      "useAudio.tsx",
    ),
    "utf8",
  );

  expect(source).toContain("useMorseAudio");
  expect(source).toContain("smooth_sine");
  expect(source).toContain("bright_square");
  expect(source).toContain("telegraph_sounder");
  expect(source).not.toContain("new AudioContext");
  expect(source).not.toContain("createOscillator");
  expect(source).not.toContain("buildMorseEvents");
});

test.describe("consolidated audio behavior", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("homepage playback cancels duplicate starts, text changes, and flash lamp state", async ({
    page,
  }) => {
    await installAudioHarness(page);
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/");
    await waitForRouteReady(page);

    await page.getByLabel("Input (Text)").fill("T");
    await page.getByLabel("Speed").fill("5");
    await page.locator("button").filter({ hasText: "Flash Light" }).click();

    const playButton = page.getByRole("button", { name: /Play/ }).first();
    await expect(playButton).toBeEnabled();
    await playButton.evaluate((button) => {
      (button as HTMLButtonElement).click();
      (button as HTMLButtonElement).click();
    });

    await expect(page.getByTestId("mw-flash-lamp").first()).toHaveAttribute(
      "data-active",
      "true",
    );

    const duringPlayback = await readAudioHarness(page);
    expect(duringPlayback.starts).toBeGreaterThan(0);
    expect(duringPlayback.active).toBeLessThanOrEqual(1);

    await page.getByLabel("Input (Text)").fill("E");
    await expect(page.getByTestId("mw-flash-lamp").first()).toHaveAttribute(
      "data-active",
      "false",
    );
    const afterTextChange = await readAudioHarness(page);
    expect(afterTextChange.active).toBe(0);

    await page.getByLabel("Input (Text)").fill("TTTTT");
    await page.getByRole("button", { name: /Play/ }).first().click();
    await expect(page.getByTestId("mw-flash-lamp").first()).toHaveAttribute(
      "data-active",
      "true",
    );
    const stopButton = page.getByRole("button", { name: /Stop/ }).first();
    await expect(stopButton).toBeEnabled();
    await stopButton.click();
    await expect(page.getByTestId("mw-flash-lamp").first()).toHaveAttribute(
      "data-active",
      "false",
    );
    const afterStop = await readAudioHarness(page);
    expect(afterStop.active).toBe(0);
  });

  test("homepage Flash Light remains available in reduced-motion mode", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/");
    await waitForRouteReady(page);

    const flashButton = page.locator("button").filter({ hasText: "Flash Light" });
    await expect(flashButton).toBeEnabled();
    await flashButton.click();
    await expect(flashButton).toHaveAttribute("aria-pressed", "true");
  });

  for (const route of [
    "/morse-code-audio-practice",
    "/morse-code-audio-quiz",
  ] as const) {
    test(`${route} keeps audio and flash controls available`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(() => window.localStorage.clear());
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      await expect(
        page.getByRole("button", { name: /Play|Replay/ }).first(),
      ).toBeEnabled();

      await page.getByRole("button", { name: "Show advanced settings" }).click();

      const flashButton = page.getByRole("button", { name: /Flash/ });
      await expect(flashButton).toBeEnabled();
      await flashButton.click();
      await expect(flashButton).toHaveAttribute("aria-pressed", "true");
    });
  }

  for (const route of [
    "/audio",
    "/morse-code-sound-generator",
    "/morse-code-mp3-generator",
  ] as const) {
    test(`${route} keeps shared presets and export controls`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      for (const preset of AUDIO_PRESETS) {
        expect(
          await page.locator(`option[value="${preset}"]`).count(),
          `${route} has ${preset}`,
        ).toBeGreaterThan(0);
      }

      await expect(page.getByRole("button", { name: /Play/ }).first()).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Download WAV|Export WAV/ }).first(),
      ).toBeVisible();
    });
  }

  test("sound generator and MP3 generator report invalid Morse before export", async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/morse-code-sound-generator", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () => window.localStorage.getItem("mw_sound_generator_source") === "text",
    );
    await page.getByRole("button", { name: /Morse to beep tone/ }).click();
    await expect(page.getByText("Morse code to play as a tone")).toBeVisible();
    await page.locator("textarea").first().fill("abc");
    await page.getByRole("button", { name: "Download MP3" }).first().click();
    await expect(
      page.getByText("Enter text or valid dots and dashes before exporting audio."),
    ).toBeVisible();

    await page.goto("/morse-code-mp3-generator", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () => window.localStorage.getItem("mw_audio_source") === "text",
    );
    await page.getByRole("button", { name: "Morse input" }).click();
    await page.locator("textarea").first().fill("abc");
    await page.getByRole("button", { name: "Download MP3" }).click();
    await expect(
      page.getByText("Enter text or valid dots and dashes before exporting audio."),
    ).toBeVisible();
  });

  test("sound generator still exports WAV and MP3 from valid Morse", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
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

    await page.goto("/morse-code-sound-generator", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () => window.localStorage.getItem("mw_sound_generator_source") === "text",
    );
    const source = page.locator("textarea").first();
    await source.fill("SOS");
    await expect(source).toHaveValue("SOS");

    const wavDownload = page.waitForEvent("download", { timeout: 30_000 });
    await page.getByRole("button", { name: "Download WAV" }).first().click();
    const wav = await wavDownload;
    expect(wav.suggestedFilename()).toBe("morse-code-sound.wav");

    const wavBlobs = await readDownloadBlobs(page);
    expect(wavBlobs.at(-1)?.type).toBe("audio/wav");
    expect(wavBlobs.at(-1)?.size ?? 0).toBeGreaterThan(100);

    const mp3Download = page.waitForEvent("download", { timeout: 30_000 });
    await page.getByRole("button", { name: "Download MP3" }).first().click();
    const mp3 = await mp3Download;
    expect(mp3.suggestedFilename()).toBe("morse-code-sound.mp3");

    const mp3Blobs = await readDownloadBlobs(page);
    expect(mp3Blobs.at(-1)?.type).toBe("audio/mpeg");
    expect(mp3Blobs.at(-1)?.size ?? 0).toBeGreaterThan(100);
  });
});

async function installAudioHarness(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const state = { starts: 0, stops: 0, active: 0, closed: 0 };
    Object.defineProperty(window, "__mwAudioHarness", {
      value: state,
      configurable: true,
    });

    class FakeAudioParam {
      value = 0;
      cancelScheduledValues() {}
      setTargetAtTime(value: number) {
        this.value = value;
      }
      setValueAtTime(value: number) {
        this.value = value;
      }
      linearRampToValueAtTime(value: number) {
        this.value = value;
      }
    }

    class FakeAudioNode extends EventTarget {
      connect(node: unknown) {
        return node;
      }
    }

    class FakeScheduledSourceNode extends FakeAudioNode {
      buffer: unknown = null;
      frequency = { value: 0 };
      type = "sine";
      onended: ((this: FakeScheduledSourceNode, ev: Event) => unknown) | null =
        null;
      private stopTimer: number | null = null;
      private started = false;
      private stopped = false;

      start() {
        if (this.started) return;
        this.started = true;
        state.starts += 1;
        state.active += 1;
      }

      stop(when = 0) {
        if (this.stopped) return;
        const finish = () => {
          if (this.stopped) return;
          this.stopped = true;
          if (this.stopTimer !== null) window.clearTimeout(this.stopTimer);
          this.stopTimer = null;
          if (this.started) {
            state.stops += 1;
            state.active = Math.max(0, state.active - 1);
          }
          const event = new Event("ended");
          this.onended?.call(this, event);
          this.dispatchEvent(event);
        };

        if (when > 0) {
          this.stopTimer = window.setTimeout(finish, Math.max(0, when * 1000));
          return;
        }

        finish();
      }
    }

    class FakeGainNode extends FakeAudioNode {
      gain = new FakeAudioParam();
    }

    class FakeFilterNode extends FakeAudioNode {
      type = "bandpass";
      frequency = { value: 0 };
      Q = { value: 0 };
    }

    class FakeAudioContext {
      currentTime = 0;
      destination = {};
      sampleRate = 44100;
      state = "running";

      createGain() {
        return new FakeGainNode();
      }
      createOscillator() {
        return new FakeScheduledSourceNode();
      }
      createBufferSource() {
        return new FakeScheduledSourceNode();
      }
      createBiquadFilter() {
        return new FakeFilterNode();
      }
      createBuffer(channels: number, length: number) {
        const data = Array.from(
          { length: channels },
          () => new Float32Array(length),
        );
        return {
          getChannelData: (index: number) => data[index] ?? data[0],
        };
      }
      resume() {
        this.state = "running";
        return Promise.resolve();
      }
      close() {
        state.closed += 1;
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "AudioContext", {
      value: FakeAudioContext,
      configurable: true,
    });
    Object.defineProperty(window, "webkitAudioContext", {
      value: FakeAudioContext,
      configurable: true,
    });
  });
}

async function readAudioHarness(page: import("@playwright/test").Page) {
  return page.evaluate(
    () =>
      (window as unknown as {
        __mwAudioHarness: {
          starts: number;
          stops: number;
          active: number;
          closed: number;
        };
      }).__mwAudioHarness,
  );
}

async function readDownloadBlobs(page: import("@playwright/test").Page) {
  return page.evaluate(
    () =>
      (window as unknown as {
        __mwDownloadBlobs: Array<{ size: number; type: string }>;
      }).__mwDownloadBlobs,
  );
}
