import { expect, test } from "@playwright/test";
import { claimPlayback, releasePlayback, stopOwnedPlayback } from "../../app/client/components/shared/playbackOwnership";
import { blockExternalNetwork } from "./helpers";

test("playback ownership replaces once and ignores stale owner releases", () => {
  const one = {}, two = {};
  const calls: string[] = [];
  claimPlayback(one, () => calls.push("one"));
  claimPlayback(one, () => calls.push("duplicate"));
  claimPlayback(two, () => calls.push("two"));
  expect(calls).toEqual(["one"]);
  releasePlayback(one);
  stopOwnedPlayback(); stopOwnedPlayback();
  expect(calls).toEqual(["one", "two"]);
});

test("native Chromium audio graph reuses its context and releases nodes on stop", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Windows WebKit is covered by deterministic API-boundary checks, not certified native Safari audio.");
  await blockExternalNetwork(page);
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const stats = { contexts: 0, starts: 0, active: 0 };
    Object.assign(window, { mwNativeAudioStats: stats });
    window.AudioContext = class extends Native {
      constructor() { super(); stats.contexts++; }
      createOscillator() {
        const node = super.createOscillator();
        const start = node.start.bind(node), stop = node.stop.bind(node);
        let active = false;
        const ended = () => { if (active) stats.active--; active = false; };
        node.addEventListener("ended", ended);
        node.start = when => { active = true; stats.active++; stats.starts++; start(when); };
        node.stop = when => { stop(when); if (!when || when <= this.currentTime) ended(); };
        return node;
      }
    };
  });
  await page.goto('/audio', { waitUntil: 'networkidle' });
  await page.getByLabel('Input (Text)').fill('TTTT');
  await page.getByLabel('Character speed').fill('5');
  const stats = () => page.evaluate(() => (window as unknown as { mwNativeAudioStats: { contexts: number; starts: number; active: number } }).mwNativeAudioStats);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Play/ }).first().click();
    await expect.poll(async () => (await stats()).active).toBeGreaterThan(0);
    await page.getByRole('button', { name: /Stop/ }).first().click();
    await expect.poll(async () => (await stats()).active).toBe(0);
  }
  expect((await stats()).contexts).toBe(1);
});
