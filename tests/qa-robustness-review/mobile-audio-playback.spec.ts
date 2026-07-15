import {
  devices,
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const browserOverride = process.env.MORSE_AUDIO_BROWSER;
const deviceOverride = process.env.MORSE_AUDIO_DEVICE;

if (browserOverride === "webkit" && deviceOverride === "iphone") {
  test.use({ ...devices["iPhone 13"], browserName: "webkit" });
} else if (browserOverride === "webkit") {
  test.use({ ...devices["Desktop Safari"], browserName: "webkit" });
}

const PATTERN_AUDIO_ROUTES = [
  "/0-in-morse-code",
  "/1-in-morse-code",
  "/2-in-morse-code",
  "/3-in-morse-code",
  "/4-in-morse-code",
  "/5-in-morse-code",
  "/6-in-morse-code",
  "/7-in-morse-code",
  "/8-in-morse-code",
  "/9-in-morse-code",
  "/a-in-morse-code",
  "/ampersand-in-morse-code",
  "/apostrophe-in-morse-code",
  "/at-sign-in-morse-code",
  "/b-in-morse-code",
  "/c-in-morse-code",
  "/colon-in-morse-code",
  "/comma-in-morse-code",
  "/cq-in-morse-code",
  "/d-in-morse-code",
  "/e-in-morse-code",
  "/equals-sign-in-morse-code",
  "/exclamation-mark-in-morse-code",
  "/f-in-morse-code",
  "/g-in-morse-code",
  "/h-in-morse-code",
  "/hello-in-morse-code",
  "/hello-world-in-morse-code",
  "/help-in-morse-code",
  "/help-me-in-morse-code",
  "/hi-in-morse-code",
  "/hyphen-in-morse-code",
  "/i-in-morse-code",
  "/i-love-you-in-morse-code",
  "/international-morse-code-reference",
  "/j-in-morse-code",
  "/k-in-morse-code",
  "/l-in-morse-code",
  "/love-in-morse-code",
  "/m-in-morse-code",
  "/morse-code-by-language/greek",
  "/morse-code-by-language/japanese",
  "/morse-code-by-language/russian",
  "/morse-code-chart",
  "/morse-code-numbers",
  "/morse-code-prosigns",
  "/morse-code-punctuation",
  "/morse-code-q-codes",
  "/morse-code-word-trainer",
  "/n-in-morse-code",
  "/name-to-morse-code",
  "/no-in-morse-code",
  "/o-in-morse-code",
  "/ok-in-morse-code",
  "/p-in-morse-code",
  "/parentheses-in-morse-code",
  "/period-in-morse-code",
  "/plus-sign-in-morse-code",
  "/q-in-morse-code",
  "/question-mark-in-morse-code",
  "/quotation-mark-in-morse-code",
  "/r-in-morse-code",
  "/s-in-morse-code",
  "/semicolon-in-morse-code",
  "/slash-in-morse-code",
  "/sorry-in-morse-code",
  "/space-in-morse-code",
  "/t-in-morse-code",
  "/test-in-morse-code",
  "/u-in-morse-code",
  "/underscore-in-morse-code",
  "/v-in-morse-code",
  "/w-in-morse-code",
  "/x-in-morse-code",
  "/y-in-morse-code",
  "/yes-in-morse-code",
  "/z-in-morse-code",
] as const;

const SHARED_AUDIO_ROUTES = [
  { route: "/", playName: /Play/ },
  { route: "/audio", playName: /Play/ },
  { route: "/morse-code-audio-practice", playName: /Play prompt/ },
  { route: "/morse-code-audio-quiz", playName: /Play prompt/ },
  {
    route: "/morse-code-audiobooks/treasure-island",
    playName: /Play selection/,
  },
  { route: "/morse-code-book-translator", playName: /Play live player/ },
  {
    route: "/morse-code-books/treasure-island",
    playName: /Play live player/,
  },
  { route: "/morse-code-decoder", playName: /Play/ },
  { route: "/morse-code-encoder", playName: /Play/ },
  { route: "/morse-code-international-translator", playName: /Play/ },
  { route: "/morse-code-mp3-generator", playName: /Play/ },
  { route: "/morse-code-sos", playName: /Play/ },
  { route: "/morse-code-sound-generator", playName: /Play/ },
  { route: "/morse-code-video-generator", playName: /Play visual preview/ },
  { route: "/the-quick-brown-fox-morse-code", playName: /Play/ },
] as const;

const AUDIO_PRESETS = [
  "cw_radio",
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "sounder",
  "soft_bell",
  "warm_tone",
  "low_beacon",
  "submarine_ping",
  "digital_blip",
  "soft_click",
  "bird_chirp",
] as const;

type HarnessOptions = {
  initialState?: "running" | "suspended" | "interrupted";
  resumeMode?: "resolve" | "reject" | "deferred";
};

type HarnessState = {
  audibleBufferStarts: number;
  bufferSources: number;
  contexts: number;
  events: string[];
  oscillators: number;
  resumeUserActivation: boolean[];
  resumes: number;
  starts: number;
  startsWhileNotRunning: number;
  unlockStartUserActivation: boolean[];
  unlockStarts: number;
  unlockStartsWhileNotRunning: number;
  unhandledRejectionMessages: string[];
  unhandledRejections: number;
};

async function installAudioContextHarness(
  page: Page,
  options: HarnessOptions = {},
) {
  await page.addInitScript(
    ({ initialState = "suspended", resumeMode = "resolve" }) => {
      const harness: HarnessState = {
        audibleBufferStarts: 0,
        bufferSources: 0,
        contexts: 0,
        events: [],
        oscillators: 0,
        resumeUserActivation: [],
        resumes: 0,
        starts: 0,
        startsWhileNotRunning: 0,
        unlockStartUserActivation: [],
        unlockStarts: 0,
        unlockStartsWhileNotRunning: 0,
        unhandledRejectionMessages: [],
        unhandledRejections: 0,
      };
      Object.defineProperty(window, "__mwAudioActivationHarness", {
        configurable: true,
        value: harness,
      });
      window.addEventListener("unhandledrejection", (event) => {
        const message = String(event.reason);
        if (message.includes("WebSocket closed without opened")) return;
        harness.unhandledRejections += 1;
        harness.unhandledRejectionMessages.push(message);
        event.preventDefault();
      });

      Object.defineProperty(HTMLCanvasElement.prototype, "captureStream", {
        configurable: true,
        value: () => new MediaStream(),
      });
      if (typeof MediaRecorder === "undefined") {
        Object.defineProperty(window, "MediaRecorder", {
          configurable: true,
          value: class extends EventTarget {
            static isTypeSupported() {
              return true;
            }
          },
        });
      } else {
        Object.defineProperty(MediaRecorder, "isTypeSupported", {
          configurable: true,
          value: () => true,
        });
      }

      class FakeAudioParam {
        value = 0;
        cancelScheduledValues() {}
        exponentialRampToValueAtTime(value: number) {
          this.value = value;
        }
        linearRampToValueAtTime(value: number) {
          this.value = value;
        }
        setTargetAtTime(value: number) {
          this.value = value;
        }
        setValueAtTime(value: number) {
          this.value = value;
        }
      }

      type FakeAudioNodeKind = "buffer" | "oscillator" | "other";

      class FakeAudioNode extends EventTarget {
        buffer: unknown = null;
        frequency = new FakeAudioParam();
        gain = new FakeAudioParam();
        onended: ((event: Event) => void) | null = null;
        Q = new FakeAudioParam();
        type = "sine";

        constructor(
          private context: FakeAudioContext,
          private kind: FakeAudioNodeKind = "other",
        ) {
          super();
        }

        connect(node: unknown) {
          return node;
        }

        disconnect() {}

        start() {
          const bufferLength =
            this.buffer && typeof this.buffer === "object"
              ? (this.buffer as { length?: number }).length
              : undefined;
          const isUnlockSource = this.kind === "buffer" && bufferLength === 1;
          if (isUnlockSource) {
            harness.events.push("source:start:unlock");
            harness.unlockStarts += 1;
            harness.unlockStartUserActivation.push(
              navigator.userActivation?.isActive ?? false,
            );
            if (this.context.state !== "running") {
              harness.unlockStartsWhileNotRunning += 1;
            }
            return;
          }
          harness.events.push("source:start");
          harness.starts += 1;
          if (this.kind === "buffer") harness.audibleBufferStarts += 1;
          if (this.context.state !== "running") {
            harness.startsWhileNotRunning += 1;
          }
        }

        stop() {
          const event = new Event("ended");
          this.onended?.(event);
          this.dispatchEvent(event);
        }
      }

      let latestContext: FakeAudioContext | null = null;
      let resolveDeferredResume: (() => void) | null = null;

      class FakeAudioContext {
        currentTime = 0;
        destination = {};
        sampleRate = 44100;
        state = initialState as AudioContextState | "interrupted";

        constructor() {
          harness.contexts += 1;
          harness.events.push("context:create");
          latestContext = this;
        }

        close() {
          this.state = "closed";
          return Promise.resolve();
        }

        createBiquadFilter() {
          return new FakeAudioNode(this);
        }

        createBuffer(channels: number, length: number) {
          const data = Array.from(
            { length: channels },
            () => new Float32Array(length),
          );
          return {
            getChannelData: (index: number) => data[index] ?? data[0],
            length,
          };
        }

        createBufferSource() {
          harness.bufferSources += 1;
          harness.events.push("source:create:buffer");
          return new FakeAudioNode(this, "buffer");
        }

        createGain() {
          return new FakeAudioNode(this);
        }

        createMediaStreamDestination() {
          return { stream: new MediaStream() };
        }

        createOscillator() {
          harness.oscillators += 1;
          harness.events.push("source:create:oscillator");
          return new FakeAudioNode(this, "oscillator");
        }

        resume() {
          harness.resumes += 1;
          harness.events.push("context:resume");
          harness.resumeUserActivation.push(
            navigator.userActivation?.isActive ?? false,
          );
          if (resumeMode === "reject") {
            return Promise.reject(new Error("resume rejected"));
          }
          if (resumeMode === "deferred") {
            return new Promise<void>((resolve) => {
              resolveDeferredResume = () => {
                this.state = "running";
                resolve();
              };
            });
          }
          this.state = "running";
          return Promise.resolve();
        }
      }

      Object.defineProperty(window, "__mwResolveAudioResume", {
        configurable: true,
        value: () => resolveDeferredResume?.(),
      });
      Object.defineProperty(window, "__mwSetAudioContextState", {
        configurable: true,
        value: (state: AudioContextState | "interrupted") => {
          if (latestContext) latestContext.state = state;
        },
      });
      Object.defineProperty(window, "AudioContext", {
        configurable: true,
        value: FakeAudioContext,
      });
      Object.defineProperty(window, "webkitAudioContext", {
        configurable: true,
        value: FakeAudioContext,
      });
    },
    options,
  );
}

async function readHarness(page: Page) {
  return page.evaluate(
    () =>
      (
        window as typeof window & {
          __mwAudioActivationHarness: HarnessState;
        }
      ).__mwAudioActivationHarness,
  );
}

async function waitForReactHandler(locator: Locator) {
  await expect
    .poll(
      async () =>
        locator.evaluate((element) =>
          Object.keys(element).some((key) => key.startsWith("__reactProps$")),
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
}

async function openAudioRoute(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/audio", { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await page.getByLabel("Input (Text)").fill("E");
  await page.getByLabel("Character speed").fill("40");
}

test.beforeEach(async ({ page }) => {
  await blockExternalNetwork(page);
});

test("shared playback unlocks before scheduling and reuses one context", async ({
  page,
}) => {
  await installAudioContextHarness(page);
  await openAudioRoute(page);

  const play = page.getByRole("button", { name: /Play/ }).first();
  await expect(play).toBeEnabled();
  await play.click();
  await expect(page.getByRole("button", { name: /Play/ }).first()).toBeEnabled();

  let state = await readHarness(page);
  expect(state.contexts).toBe(1);
  expect(state.resumes).toBe(1);
  expect(state.resumeUserActivation).toEqual([true]);
  expect(state.unlockStarts).toBe(1);
  expect(state.unlockStartUserActivation).toEqual([true]);
  expect(state.starts).toBeGreaterThan(0);
  expect(state.startsWhileNotRunning).toBe(0);
  expect(state.events.indexOf("context:resume")).toBeLessThan(
    state.events.indexOf("source:start:unlock"),
  );
  expect(state.events.indexOf("source:start:unlock")).toBeLessThan(
    state.events.indexOf("source:create:oscillator"),
  );

  await page.getByLabel("Input (Text)").fill("TEST TEST TEST");
  await play.click();
  const stop = page.getByRole("button", { name: /Stop/ }).first();
  await expect(stop).toBeEnabled();
  await stop.click();
  await page.getByLabel("Input (Text)").fill("E");
  await play.click();
  await expect(page.getByRole("button", { name: /Play/ }).first()).toBeEnabled();
  state = await readHarness(page);
  expect(state.contexts).toBe(1);
  expect(state.resumes).toBe(1);
});

test("pause, resume, startup stop, rejection, and unsupported browsers stay safe", async ({
  context,
  page,
}) => {
  await installAudioContextHarness(page);
  await openAudioRoute(page);
  await page.getByLabel("Input (Text)").fill("TT");
  await page.getByLabel("Character speed").fill("5");

  await page.getByRole("button", { name: /Play/ }).first().click();
  await page.getByRole("button", { name: /Pause/ }).first().click();
  await page.evaluate(() => {
    (
      window as typeof window & {
        __mwSetAudioContextState: (state: AudioContextState) => void;
      }
    ).__mwSetAudioContextState("suspended");
  });
  await page.getByRole("button", { name: /Resume/ }).first().click();
  await page.getByRole("button", { name: /Stop/ }).first().click();
  let state = await readHarness(page);
  expect(state.contexts).toBe(1);
  expect(state.resumes).toBe(2);
  expect(state.resumeUserActivation).toEqual([true, true]);
  expect(state.unlockStarts).toBe(2);
  expect(state.unlockStartUserActivation).toEqual([true, true]);

  const deferredPage = await context.newPage();
  await blockExternalNetwork(deferredPage);
  await installAudioContextHarness(deferredPage, { resumeMode: "deferred" });
  await openAudioRoute(deferredPage);
  await deferredPage.getByRole("button", { name: /Play/ }).first().click();
  await deferredPage.getByRole("button", { name: /Stop/ }).first().click();
  await deferredPage.evaluate(() => {
    (
      window as typeof window & { __mwResolveAudioResume: () => void }
    ).__mwResolveAudioResume();
  });
  await expect(
    deferredPage.getByRole("button", { name: /Play/ }).first(),
  ).toBeEnabled();
  state = await readHarness(deferredPage);
  expect(state.starts).toBe(0);
  expect(state.unlockStarts).toBe(1);
  expect(state.startsWhileNotRunning).toBe(0);
  expect(state.unlockStartsWhileNotRunning).toBe(1);
  await deferredPage.close();

  const rejectedPage = await context.newPage();
  await blockExternalNetwork(rejectedPage);
  await installAudioContextHarness(rejectedPage, { resumeMode: "reject" });
  await openAudioRoute(rejectedPage);
  await rejectedPage.getByRole("button", { name: /Play/ }).first().click();
  await expect(
    rejectedPage.getByRole("button", { name: /Play/ }).first(),
  ).toBeEnabled();
  state = await readHarness(rejectedPage);
  expect(state.starts).toBe(0);
  expect(state.unlockStarts).toBe(1);
  expect(state.unhandledRejectionMessages).toEqual([]);
  await rejectedPage.close();

  const unsupportedPage = await context.newPage();
  await blockExternalNetwork(unsupportedPage);
  await unsupportedPage.addInitScript(() => {
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(window, "webkitAudioContext", {
      configurable: true,
      value: undefined,
    });
  });
  await unsupportedPage.goto("/audio", { waitUntil: "domcontentloaded" });
  await waitForRouteReady(unsupportedPage);
  await expect(
    unsupportedPage.getByRole("button", { name: /Play/ }).first(),
  ).toBeDisabled();
  await unsupportedPage.goto("/a-in-morse-code", {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(unsupportedPage);
  await unsupportedPage.getByRole("button", { name: "Play Morse" }).click();
  await unsupportedPage.close();
});

test("mute, repeat, sounder, and oscillator presets keep their existing paths", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await installAudioContextHarness(page);
  await openAudioRoute(page);

  await page.getByRole("button", { name: "Sound" }).click();
  await page.getByRole("button", { name: /Play/ }).first().click();
  await expect(page.getByRole("button", { name: /Play/ }).first()).toBeEnabled();
  let state = await readHarness(page);
  expect(state.starts).toBe(0);
  expect(state.unlockStarts).toBe(1);

  await page.getByRole("button", { name: "Sound" }).click();
  await page.getByRole("button", { name: "Repeat" }).click();
  await page.getByRole("button", { name: /Play/ }).first().click();
  await expect.poll(async () => (await readHarness(page)).starts).toBeGreaterThan(1);
  await page.getByRole("button", { name: /Stop/ }).first().click();
  state = await readHarness(page);
  expect(state.contexts).toBe(1);
  expect(state.resumes).toBe(1);

  await page.getByRole("button", { name: "Repeat" }).click();
  await page.getByRole("button", { name: "Show advanced settings" }).click();
  const preset = page.getByLabel("Tone preset");
  for (const value of AUDIO_PRESETS) {
    const before = await readHarness(page);
    await preset.selectOption(value);
    await page.getByRole("button", { name: /Play/ }).first().click();
    await expect
      .poll(async () => {
        const current = await readHarness(page);
        return current.oscillators + current.bufferSources;
      })
      .toBeGreaterThan(before.oscillators + before.bufferSources);
    await page.getByRole("button", { name: /Stop/ }).first().click();
  }

  state = await readHarness(page);
  expect(state.audibleBufferStarts).toBeGreaterThan(0);
  expect(state.oscillators).toBeGreaterThan(0);
  expect(state.contexts).toBe(1);
});

test("reference playback resumes under the tap and reuses its context", async ({
  context,
  page,
}) => {
  await installAudioContextHarness(page);
  await page.goto("/a-in-morse-code", { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  const play = page.getByRole("button", { name: "Play Morse" });
  await waitForReactHandler(play);
  await play.click();
  await play.click();

  let state = await readHarness(page);
  expect(state.contexts).toBe(1);
  expect(state.resumes).toBe(1);
  expect(state.resumeUserActivation).toEqual([true]);
  expect(state.unlockStarts).toBe(1);
  expect(state.unlockStartUserActivation).toEqual([true]);
  expect(state.starts).toBeGreaterThan(0);
  expect(state.startsWhileNotRunning).toBe(0);

  const rejectedPage = await context.newPage();
  await blockExternalNetwork(rejectedPage);
  await installAudioContextHarness(rejectedPage, { resumeMode: "reject" });
  await rejectedPage.goto("/a-in-morse-code", {
    waitUntil: "domcontentloaded",
  });
  await waitForRouteReady(rejectedPage);
  const rejectedPlay = rejectedPage.getByRole("button", {
    name: "Play Morse",
  });
  await waitForReactHandler(rejectedPlay);
  await rejectedPlay.click();
  state = await readHarness(rejectedPage);
  expect(state.starts).toBe(0);
  expect(state.unlockStarts).toBe(1);
  expect(state.unhandledRejectionMessages).toEqual([]);
  await rejectedPage.close();
});

test("every shared-engine route activates audio under its original click", async ({
  page,
}, testInfo) => {
  test.setTimeout(180_000);
  const mobilePolicy =
    testInfo.project.name.includes("mobile") || deviceOverride === "iphone";
  await page.addInitScript(() => window.localStorage.clear());
  await installAudioContextHarness(page, {
    initialState: mobilePolicy ? "suspended" : "running",
  });

  for (const { route, playName } of SHARED_AUDIO_ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const play = page.getByRole("button", { name: playName }).first();
    await expect(play, route).toBeEnabled({ timeout: 15_000 });
    await waitForReactHandler(play);
    await play.click();
    if (
      route === "/morse-code-book-translator" ||
      route === "/morse-code-books/treasure-island"
    ) {
      const activation = await readHarness(page);
      expect(activation.contexts, `${route} activates before its start timer`).toBe(1);
      expect(activation.starts, `${route} preserves its start buffer`).toBe(0);
      expect(
        activation.resumes,
        `${route} resumes before its start timer`,
      ).toBe(mobilePolicy ? 1 : 0);
      expect(
        activation.unlockStarts,
        `${route} warms audio before its start timer`,
      ).toBe(mobilePolicy ? 1 : 0);
    }
    await expect
      .poll(async () => (await readHarness(page)).starts, {
        message: route,
        timeout: 10_000,
      })
      .toBeGreaterThan(0);
    const state = await readHarness(page);
    expect(state.contexts, route).toBe(1);
    expect(state.startsWhileNotRunning, route).toBe(0);
    if (mobilePolicy) {
      expect(state.resumes, route).toBe(1);
      expect(state.resumeUserActivation, route).toEqual([true]);
      expect(state.unlockStarts, route).toBe(1);
      expect(state.unlockStartUserActivation, route).toEqual([true]);
    } else {
      expect(state.resumes, route).toBe(0);
      expect(state.unlockStarts, route).toBe(0);
    }
  }
});

for (let start = 0; start < PATTERN_AUDIO_ROUTES.length; start += 10) {
  const routeGroup = PATTERN_AUDIO_ROUTES.slice(start, start + 10);
  test(`reference audio routes ${start + 1}-${start + routeGroup.length} honor context state`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);
    const mobilePolicy =
      testInfo.project.name.includes("mobile") || deviceOverride === "iphone";
    await installAudioContextHarness(page, {
      initialState: mobilePolicy ? "suspended" : "running",
    });

    for (const route of routeGroup) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);
      const play = page
        .locator("button:visible")
        .filter({ hasText: /Play|Hear|Listen/i })
        .first();
      await expect(play, route).toBeEnabled();
      await waitForReactHandler(play);
      await play.click();
      const state = await readHarness(page);
      expect(state.contexts, route).toBe(1);
      expect(state.starts, route).toBeGreaterThan(0);
      expect(state.startsWhileNotRunning, route).toBe(0);
      if (mobilePolicy) {
        expect(state.resumes, route).toBe(1);
        expect(state.resumeUserActivation, route).toEqual([true]);
        expect(state.unlockStarts, route).toBe(1);
        expect(state.unlockStartUserActivation, route).toEqual([true]);
      } else {
        expect(state.resumes, route).toBe(0);
        expect(state.unlockStarts, route).toBe(0);
      }
    }
  });
}

test("real-time activation remains independent from WAV export and keeps its API", () => {
  const hookSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "app",
      "client",
      "components",
      "shared",
      "useMorseAudio.tsx",
    ),
    "utf8",
  );
  const patternSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "app",
      "client",
      "components",
      "shared",
      "playMorsePattern.ts",
    ),
    "utf8",
  );
  const renderWav = hookSource.slice(
    hookSource.indexOf("async function renderWav"),
    hookSource.indexOf("return {", hookSource.indexOf("async function renderWav")),
  );

  expect(renderWav).toContain("renderMorseAudioBlob");
  expect(renderWav).not.toContain("ensureRunning");
  for (const api of [
    "play",
    "pause",
    "resume",
    "stop",
    "setLiveOptions",
    "renderWav",
    "renderAudioBuffer",
    "estimateDurationMs",
  ]) {
    expect(hookSource).toContain(api);
  }
  expect(patternSource).toContain("master.gain.value = 0.18");
  expect(patternSource).toContain("ctx.currentTime + 0.04");
  expect(patternSource).toContain('osc.type = "sine"');
  expect(patternSource).toContain("cursor + 0.006");
  expect(patternSource).toContain("cursor + seconds - 0.008");
});
