import { expect, test } from "@playwright/test";
import { AUDIO_TONE_PRESETS, getAudioPresetsForContext, sanitizeAudioTonePreset } from "../../app/client/components/shared/audioPresetRegistry";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

test("translator context preserves the full canonical registry and creative preset identity", () => {
  expect(getAudioPresetsForContext("translator")).toEqual(AUDIO_TONE_PRESETS);
  for (const id of AUDIO_TONE_PRESETS) expect(sanitizeAudioTonePreset(id, "cw_radio", "translator")).toBe(id);
});

for (const legacy of ["translator", "sound-generator"] as const) {
  test(`${legacy} preferences survive opening audio before their original route`, async ({ page }, info) => {
    test.setTimeout(120_000);
    await blockExternalNetwork(page);
    await page.setViewportSize({ width: info.project.name.startsWith("webkit") ? 390 : 1440, height: 844 });
    await page.addInitScript(({ legacy, theme }) => {
      if (sessionStorage.getItem("integration-seeded")) return;
      sessionStorage.setItem("integration-seeded", "1"); localStorage.clear(); localStorage.setItem("morsewords-theme", theme);
      const prefix = legacy === "translator" ? "mw" : "mw_sound_generator";
      Object.entries({ wpm: "73", fwpm: "41", hz: "980", vol: "0.43", preset: "bright_square", sound: "1", repeat: "0", flash: "0", adv_open: "1" }).forEach(([k,v]) => localStorage.setItem(`${prefix}_${k}`,v));
    }, { legacy, theme: info.project.name.endsWith("dark") ? "dark" : "light" });
    for (const route of ["/audio", "/", "/morse-code-sound-generator", "/morse-code-mp3-generator", "/morse-code-audio-practice", "/morse-code-audio-quiz"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" }); await waitForRouteReady(page);
      await expect(page.getByLabel("Character speed").first(), route).toHaveValue("73");
      await expect(page.getByLabel(/Farnsworth/).first(), route).toHaveValue("41");
      await expect(page.getByLabel("Pitch").first(), route).toHaveValue("980");
      await expect(page.getByLabel("Volume").first(), route).toHaveValue("43");
      const preset = page.getByLabel(/(?:Tone|Sound) preset/i).first();
      await expect(preset, route).toHaveValue("square");
      expect(await preset.locator("option").evaluateAll(nodes => nodes.map(n => (n as HTMLOptionElement).value))).toEqual(AUDIO_TONE_PRESETS);
    }
    // A later canonical user choice wins over both retained legacy namespaces.
    await page.getByLabel(/(?:Tone|Sound) preset/i).first().selectOption("soft_bell");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("mw_audio_preset"))).toBe("soft_bell");
    await page.goto("/audio", { waitUntil: "domcontentloaded" }); await waitForRouteReady(page);
    await expect(page.getByLabel("Tone preset", { exact: true })).toHaveValue("soft_bell");
    await page.reload();
    await expect(page.getByLabel("Tone preset", { exact: true })).toHaveValue("soft_bell");
  });
}
