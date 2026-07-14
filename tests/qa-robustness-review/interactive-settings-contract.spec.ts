import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  CHARACTER_SPEED_RANGE,
  MORSE_NUMERIC_SETTING_CONTRACTS,
  clampFarnsworthWpm,
  sanitizeMorseNumericSetting,
} from "../../app/client/components/shared/morseSettings";
import {
  buildMorseEvents,
  estimateMorseDurationMs,
  getDotMs,
} from "../../app/client/components/shared/morseTiming";
import { morseVisualEvents } from "../../app/client/components/shared/playMorsePattern";
import {
  readStoredNumber,
  safeReadStorage,
} from "../../app/client/components/shared/settingsStorage";
import {
  SHARED_AUDIO_PREFERENCE_KEYS,
  readSharedAudioPreferences,
  writeSharedAudioPreferences,
} from "../../app/client/components/shared/audioPreferenceStorage";
import { AUDIO_TONE_PRESETS } from "../../app/client/components/shared/audioPresetRegistry";
import { blockExternalNetwork, waitForRouteReady } from "./helpers";

const ROOT = process.cwd();

const INTERACTION_PRIMITIVE_OWNERS = [
  "app/client/components/shared/ToolWorkspace.tsx",
  "app/client/components/shared/PlaybackToggleGroup.tsx",
  "app/client/components/shared/AdvancedSettingsToggle.tsx",
  "app/client/components/shared/ui/SliderRow.tsx",
  "app/client/components/shared/ui/TogglePill.tsx",
  "app/client/components/shared/ActionControls.tsx",
  "app/client/components/navigation/ThemeToggle.tsx",
] as const;

function readRepoFile(filePath: string) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function withMockStorage(
  entries: Record<string, string>,
  callback: (store: Map<string, string>) => void,
) {
  const globalWindow = globalThis as typeof globalThis & { window?: Window };
  const originalWindow = globalWindow.window;
  const store = new Map(Object.entries(entries));
  globalWindow.window = {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, String(value)),
      removeItem: (key: string) => store.delete(key),
    },
  } as unknown as Window;

  try {
    callback(store);
  } finally {
    if (originalWindow) globalWindow.window = originalWindow;
    else delete globalWindow.window;
  }
}

test.describe("interactive state and Morse settings contracts", () => {
  test("keeps shared interactive primitives and output ownership explicit", () => {
    for (const filePath of INTERACTION_PRIMITIVE_OWNERS) {
      expect(fs.existsSync(path.join(ROOT, filePath)), filePath).toBe(true);
    }

    expect(readRepoFile("app/client/components/shared/ToolWorkspace.tsx")).toContain(
      "mw-noneditable-output",
    );
    expect(readRepoFile("app/client/components/shared/ToolWorkspace.tsx")).toContain(
      '"mw-output-text mw-input-placeholder',
    );
    expect(readRepoFile("app/client/components/shared/TranslatorSectionsBasic.tsx")).toContain(
      "mw-noneditable-output",
    );
    expect(readRepoFile("app/app.css")).toContain("::selection");
    expect(readRepoFile("app/app.css")).toContain("--mw-focus-visible");
  });

  test("keeps equivalent playback toggles and concise setting rows on shared contracts", () => {
    const playbackConsumers = [
      "app/client/components/shared/TranslatorSectionsBasic.tsx",
      "app/client/components/audio/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool.tsx",
      "app/routes/morse-code-audio-practice.tsx",
      "app/routes/morse-code-audio-quiz.tsx",
    ] as const;
    const bannedSettingHints = [
      "Slows spacing only.",
      "Slower spacing, same character speed",
      "Softens clicks at the start.",
      "Softens clicks at the end.",
      "Extra silence to avoid clipped tails.",
    ];

    for (const filePath of playbackConsumers) {
      const source = readRepoFile(filePath);
      expect(source, filePath).toContain("PlaybackToggleGroup");
      expect(source, filePath).toContain("AdvancedSettingsToggle");
      expect(source, filePath).not.toContain("<TogglePill");
      for (const hint of bannedSettingHints) {
        expect(source, `${filePath}: ${hint}`).not.toContain(hint);
      }
    }
  });

  test("uses one speed contract and a dynamic Farnsworth ceiling", () => {
    expect(CHARACTER_SPEED_RANGE).toMatchObject({ min: 5, max: 100, step: 1 });
    expect(MORSE_NUMERIC_SETTING_CONTRACTS.characterSpeed.unit).toBe("WPM");
    expect(clampFarnsworthWpm(999, 24)).toBe(24);
    expect(clampFarnsworthWpm(-1, 24)).toBe(5);
    expect(sanitizeMorseNumericSetting("characterSpeed", "Infinity")).toBe(5);
    expect(sanitizeMorseNumericSetting("pitch", 2_000)).toBe(1_600);

    for (const filePath of [
      "app/client/components/shared/TranslatorSectionsBasic.tsx",
      "app/client/components/audio/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool.tsx",
      "app/routes/morse-code-audio-practice.tsx",
      "app/routes/morse-code-audio-quiz.tsx",
    ]) {
      const source = readRepoFile(filePath);
      expect(source, filePath).toMatch(/(?:AUDIO|TOOL)_SPEED_RANGE\.max/);
      expect(source, filePath).toContain("clampFarnsworthWpm");
      expect(source, filePath).toMatch(/(?:AUDIO|TRANSLATOR)_PITCH_RANGE\.min/);
      expect(source, filePath).toContain("VOLUME_RANGE.min * 100");
      if (!filePath.endsWith("TranslatorSectionsBasic.tsx")) {
        expect(source, filePath).toContain("AUDIO_ATTACK_RANGE.min");
        expect(source, filePath).toContain("AUDIO_RELEASE_RANGE.min");
      }
      expect(source, filePath).not.toContain("clampNum(charWpm, 5, 60)");
      expect(source, filePath).not.toContain("clampNum(farnsworthWpm, 5, 60)");
      expect(source, filePath).not.toMatch(/max=\{40\}/);
    }
  });

  test("keeps the advanced disclosure labels and tone options on shared primitives", () => {
    const advancedToggle = readRepoFile(
      "app/client/components/shared/AdvancedSettingsToggle.tsx",
    );
    expect(advancedToggle).toContain("Show advanced settings");
    expect(advancedToggle).toContain("Hide advanced settings");

    for (const filePath of [
      "app/client/components/shared/TranslatorSectionsBasic.tsx",
      "app/routes/morse-code-audio-practice.tsx",
      "app/routes/morse-code-audio-quiz.tsx",
    ]) {
      const source = readRepoFile(filePath);
      expect(source, filePath).toContain('<AudioPresetOptions context="livePlayback" />');
      expect(source, filePath).not.toContain('<option value="cw_radio">');
    }
  });

  test("uses one preference namespace and migrates legacy translator values", () => {
    withMockStorage(
      {
        mw_wpm: "100",
        mw_fwpm: "72",
        mw_hz: "980",
        mw_vol: "0.42",
        mw_preset: "smooth_sine",
        mw_sound: "0",
        mw_repeat: "1",
        mw_flash: "1",
        mw_adv_open: "1",
      },
      (store) => {
        const preferences = readSharedAudioPreferences({
          legacyKeys: {
            characterSpeed: ["mw_char_wpm", "mw_wpm"],
            farnsworthSpeed: "mw_fwpm",
            pitch: "mw_hz",
            volume: "mw_vol",
            preset: "mw_preset",
            sound: "mw_sound",
            repeat: "mw_repeat",
            flash: "mw_flash",
            advancedOpen: "mw_adv_open",
          },
        });
        expect(preferences).toMatchObject({
          charWpm: 100,
          farnsworthWpm: 72,
          toneHz: 980,
          volume: 0.42,
          preset: "sine",
          soundOn: false,
          repeat: true,
          flash: true,
          advancedOpen: true,
        });
        expect(store.get(SHARED_AUDIO_PREFERENCE_KEYS.characterSpeed)).toBe("100");
        expect(store.get(SHARED_AUDIO_PREFERENCE_KEYS.preset)).toBe("sine");

        writeSharedAudioPreferences({ ...preferences, charWpm: 88 });
        expect(store.get(SHARED_AUDIO_PREFERENCE_KEYS.characterSpeed)).toBe("88");
      },
    );
  });

  test("routes using the shared live playback engine have no detached lamp or legacy preset subset", () => {
    for (const filePath of [
      "app/client/components/shared/TranslatorSectionsBasic.tsx",
      "app/client/components/audio/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool.tsx",
      "app/routes/morse-code-audio-practice.tsx",
      "app/routes/morse-code-audio-quiz.tsx",
    ]) {
      const source = readRepoFile(filePath);
      expect(source, filePath).toContain("PlaybackToggleGroup");
      expect(source, filePath).not.toContain("<FlashLamp");
    }

    for (const filePath of [
      "app/client/components/shared/TranslatorSectionsBasic.tsx",
      "app/client/components/audio/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx",
      "app/client/components/morse-code-mp3-generator/MorseMp3GeneratorTool.tsx",
      "app/routes/morse-code-audio-practice.tsx",
      "app/routes/morse-code-audio-quiz.tsx",
    ]) {
      expect(readRepoFile(filePath), filePath).toContain("readSharedAudioPreferences");
    }
  });

  test("keeps timing finite and shared at 100 WPM", () => {
    const options = { charWpm: 100, farnsworthWpm: 100 };
    const events = buildMorseEvents("... --- ...", options);
    expect(getDotMs(100)).toBe(12);
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((event) => Number.isFinite(event.ms) && event.ms > 0)).toBe(
      true,
    );
    expect(estimateMorseDurationMs("... --- ...", options)).toBeCloseTo(
      events.reduce((total, event) => total + event.ms, 0),
      8,
    );
    expect(morseVisualEvents("... --- ...", 100, 100)).toEqual(
      events.map((event) => ({ on: event.on, ms: event.ms })),
    );
  });

  test("self-heals stale numeric settings to their rendered value", () => {
    withMockStorage({ speed: "999", malformed: "not-a-number" }, (store) => {
      expect(
        readStoredNumber("speed", { fallback: 18, min: 5, max: 100, integer: true }),
      ).toBe(100);
      expect(store.get("speed")).toBe("100");
      expect(
        readStoredNumber("malformed", {
          fallback: 18,
          min: 5,
          max: 100,
          integer: true,
        }),
      ).toBe(18);
      expect(safeReadStorage("malformed")).toBe("18");
    });
  });

  test("shares the canonical character-speed preference across equivalent routes", async ({ page }) => {
    await blockExternalNetwork(page);
    await page.addInitScript(() => {
      const marker = "mw-test-shared-preferences-initialized";
      if (sessionStorage.getItem(marker)) return;
      window.localStorage.clear();
      sessionStorage.setItem(marker, "1");
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(page.getByRole("button", { name: "Show advanced settings" })).toBeEnabled();
    const homeSpeed = page.getByLabel("Character speed").first();
    await expect(homeSpeed).toBeVisible();
    await homeSpeed.focus();
    await page.keyboard.press("End");
    await expect(homeSpeed).toHaveValue("100");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mw_audio_wpm")))
      .toBe("100");

    for (const route of ["/audio", "/morse-code-audio-practice"] as const) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);
      await expect(page.getByLabel("Character speed").first()).toHaveValue("100");
    }

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    await expect(page.getByLabel("Character speed").first()).toHaveValue("100");
  });

  test("renders the canonical shared settings and preset inventory on every equivalent route", async ({ page }) => {
    await blockExternalNetwork(page);
    await page.addInitScript((preferences) => {
      window.localStorage.clear();
      for (const [key, value] of Object.entries(preferences)) {
        window.localStorage.setItem(key, value);
      }
    }, {
      mw_audio_wpm: "73",
      mw_audio_fwpm: "41",
      mw_audio_hz: "980",
      mw_audio_vol: "0.43",
      mw_audio_preset: "warm_tone",
      mw_audio_attack: "17",
      mw_audio_release: "29",
      mw_audio_repeat: "1",
      mw_audio_sound: "1",
      mw_audio_flash: "1",
      mw_audio_adv_open: "1",
    });

    for (const route of [
      "/",
      "/audio",
      "/morse-code-sound-generator",
      "/morse-code-mp3-generator",
      "/morse-code-audio-practice",
      "/morse-code-audio-quiz",
    ] as const) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);
      await expect(
        page.getByRole("button", { name: "Hide advanced settings" }),
        route,
      ).toBeVisible();
      await expect(page.getByLabel("Character speed").first(), route).toHaveValue("73");
      await expect(page.getByLabel(/Farnsworth/).first(), route).toHaveValue("41");
      await expect(page.getByLabel("Pitch").first(), route).toHaveValue("980");
      await expect(page.getByLabel("Volume").first(), route).toHaveValue("43");
      await expect(page.getByLabel("Attack").first(), route).toHaveValue("17");
      await expect(page.getByLabel("Release").first(), route).toHaveValue("29");
      await expect(page.getByRole("button", { name: "Sound", exact: true }), route).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("button", { name: "Repeat", exact: true }), route).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("button", { name: "Flash Light", exact: true }), route).toHaveAttribute("aria-pressed", "true");

      const preset = page.getByLabel(/(?:Tone|Sound) preset/i).first();
      await expect(preset, route).toHaveValue("warm_tone");
      const optionValues = await preset
        .locator("option")
        .evaluateAll((options) =>
          options.map((option) => (option as HTMLOptionElement).value),
        );
      expect(optionValues, route).toEqual(AUDIO_TONE_PRESETS);
    }
  });

  for (const theme of ["light", "dark"] as const) {
    test(`${theme} keyboard focus has a visible shared indicator`, async ({ page }) => {
      await blockExternalNetwork(page);
      await page.addInitScript((activeTheme) => {
        localStorage.setItem("morsewords-theme", activeTheme);
        document.documentElement.dataset.theme = activeTheme;
      }, theme);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toHaveCount(1);
      await expect(focused).toHaveCSS("outline-style", "solid");
      await expect(focused).toHaveCSS("outline-width", "2px");
    });

    test(`${theme} output surfaces prevent pointer selection while editable input remains selectable`, async ({
      page,
    }, testInfo) => {
      await blockExternalNetwork(page);
      await page.addInitScript((activeTheme) => {
        localStorage.setItem("morsewords-theme", activeTheme);
        document.documentElement.dataset.theme = activeTheme;
      }, theme);
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      const input = page.getByLabel("Input (Text)");
      await input.fill("HELLO WORLD");
      const output = page.locator("#mw_output");
      await expect(output).toHaveValue(/\.{4}/);
      await output.scrollIntoViewIfNeeded();

      const box = await output.boundingBox();
      expect(box).not.toBeNull();
      if (testInfo.project.name === "mobile-chromium") {
        await output.tap();
      } else {
        await page.mouse.move((box?.x ?? 0) + 18, (box?.y ?? 0) + 18);
        await page.mouse.down();
        await page.mouse.move((box?.x ?? 0) + 180, (box?.y ?? 0) + 18);
        await page.mouse.up();
      }
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
      );
      const outputSelection = await output.evaluate((element) => {
        const textarea = element as HTMLTextAreaElement;
        return textarea.selectionEnd - textarea.selectionStart;
      });
      expect(outputSelection).toBe(0);

      const editableSelection = await input.evaluate((element) => {
        const textarea = element as HTMLTextAreaElement;
        textarea.setSelectionRange(0, 5);
        return textarea.selectionEnd - textarea.selectionStart;
      });
      expect(editableSelection).toBe(5);

      const selection = await page.evaluate(() => {
        const root = document.documentElement;
        const selected = getComputedStyle(root, "::selection");
        return { background: selected.backgroundColor, color: selected.color };
      });
      expect(selection.background).not.toBe("rgba(0, 0, 0, 0)");
      expect(selection.color).not.toBe("rgba(0, 0, 0, 0)");

      const copy = page.getByRole("button", { name: /Copy output/i });
      await expect(copy).toBeEnabled();
    });
  }
});
