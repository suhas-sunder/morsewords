import { expect, test, type Page } from "@playwright/test";

import {
  AUDIO_GENERATOR_PRESETS,
  MP3_BITRATES,
  TRANSLATOR_AUDIO_PRESETS,
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
  sanitizeMp3Bitrate,
  sanitizeTranslatorAudioPreset,
} from "../../app/client/components/shared/morseSettings";
import {
  clampNumber,
  parseStoredJson,
  readStoredBoolean,
  readStoredEnum,
  readStoredNumber,
  readStoredNumberEnum,
  readStoredString,
  resetMorseWordsSettings,
  safeReadStorage,
  safeRemoveStorage,
  safeWriteStorage,
  safeWriteStorageResult,
  clearMorseWordsSourceData,
  sourceStorageWriteMessage,
} from "../../app/client/components/shared/settingsStorage";
import {
  STORAGE_KEY_REGISTRY,
  STORAGE_KEYS,
  STORAGE_LIMITS,
  getStorageKeyDefinition,
  validateStorageRegistryValue,
} from "../../app/client/components/shared/storageRegistry";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
  writeArtifact,
} from "./helpers";

type MockStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const globalWindow = globalThis as unknown as {
  window?: { localStorage: MockStorage };
};

function withMockStorage(
  initial: Record<string, string>,
  callback: (store: Map<string, string>) => void,
) {
  const originalWindow = globalWindow.window;
  const store = new Map(Object.entries(initial));
  globalWindow.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
  };

  try {
    callback(store);
  } finally {
    if (originalWindow) {
      globalWindow.window = originalWindow;
    } else {
      delete globalWindow.window;
    }
  }
}

test.describe("settingsStorage helpers", () => {
  test("falls back safely without browser storage", () => {
    expect(safeReadStorage("missing")).toBeNull();
    expect(safeWriteStorage("missing", "1")).toBe(false);
    expect(safeRemoveStorage("missing")).toBe(false);
    expect(readStoredBoolean("missing", true)).toBe(true);
    expect(
      readStoredNumber("missing", { fallback: 18, min: 5, max: 40 }),
    ).toBe(18);
  });

  test("handles storage API failures without throwing", () => {
    const originalWindow = globalWindow.window;
    globalWindow.window = {
      localStorage: {
        getItem: () => {
          throw new Error("storage blocked");
        },
        setItem: () => {
          throw new Error("storage blocked");
        },
        removeItem: () => {
          throw new Error("storage blocked");
        },
      },
    };

    try {
      expect(safeReadStorage("x")).toBeNull();
      expect(safeWriteStorage("x", "1")).toBe(false);
      expect(safeRemoveStorage("x")).toBe(false);
    } finally {
      if (originalWindow) {
        globalWindow.window = originalWindow;
      } else {
        delete globalWindow.window;
      }
    }
  });

  test("validates booleans, numbers, enums, strings, and json", () => {
    withMockStorage(
      {
        truthy: "true",
        badBool: "definitely",
        speed: "99",
        badSpeed: "Infinity",
        mode: "morse",
        badMode: "visual",
        rate: "48000",
        badRate: "96000",
        emptyName: "",
      },
      () => {
        expect(readStoredBoolean("truthy", false)).toBe(true);
        expect(readStoredBoolean("badBool", true)).toBe(true);
        expect(
          readStoredNumber("speed", {
            fallback: 18,
            min: 5,
            max: 40,
            integer: true,
          }),
        ).toBe(40);
        expect(
          readStoredNumber("badSpeed", {
            fallback: 18,
            min: 5,
            max: 40,
            integer: true,
          }),
        ).toBe(18);
        expect(readStoredEnum("mode", ["text", "morse"] as const, "text")).toBe(
          "morse",
        );
        expect(
          readStoredEnum("badMode", ["text", "morse"] as const, "text"),
        ).toBe("text");
        expect(
          readStoredNumberEnum("rate", [22050, 44100, 48000] as const, 44100),
        ).toBe(48000);
        expect(
          readStoredNumberEnum(
            "badRate",
            [22050, 44100, 48000] as const,
            44100,
          ),
        ).toBe(44100);
        expect(
          readStoredString("emptyName", "morse-audio", { allowEmpty: false }),
        ).toBe("morse-audio");
      },
    );

    expect(parseStoredJson('{"ok":true}', { ok: false })).toEqual({ ok: true });
    expect(parseStoredJson("{bad json", { ok: false })).toEqual({ ok: false });
  });

  test("keeps Morse setting sanitizers inside supported ranges", () => {
    expect(clampNumber("3", 5, 40)).toBe(5);
    expect(clampFarnsworthWpm(35, 18)).toBe(18);
    for (const preset of AUDIO_GENERATOR_PRESETS) {
      expect(sanitizeAudioGeneratorPreset(preset)).toBe(preset);
    }
    for (const preset of TRANSLATOR_AUDIO_PRESETS) {
      expect(sanitizeTranslatorAudioPreset(preset)).toBe(preset);
    }
    expect(sanitizeAudioGeneratorPreset("old_square")).toBe("cw_radio");
    expect(sanitizeAudioGeneratorPreset("smooth_sine")).toBe("sine");
    expect(sanitizeTranslatorAudioPreset("sounder")).toBe("cw_radio");
    expect(sanitizeAudioSampleRate(96000)).toBe(44100);
    expect(sanitizeMp3Bitrate(320)).toBe(128);
    expect(AUDIO_GENERATOR_PRESETS).toEqual([
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
    ]);
    expect(MP3_BITRATES).toEqual([32, 48, 64, 96, 128, 192, 256]);
  });
});

test.describe("storage registry policy", () => {
  test("documents known keys with validators and clear behavior", () => {
    const knownKeys = [
      STORAGE_KEYS.theme,
      STORAGE_KEYS.showAmbientMorse,
      STORAGE_KEYS.disableFlashEffects,
      STORAGE_KEYS.fullPageFlash,
      "mw_audio_text",
      "mw_audio_morse",
      "mw_sound_generator_text",
      "mw_sound_generator_morse",
      "mw_mp3_kbps",
      "mw_word_trainer_custom_words",
      STORAGE_KEYS.bookExportPreferences,
      STORAGE_KEYS.videoGeneratorPreferences,
      STORAGE_KEYS.printableChartSettings,
      STORAGE_KEYS.printableChartPresets,
    ];

    for (const key of knownKeys) {
      expect(getStorageKeyDefinition(key), key).toBeTruthy();
    }

    for (const definition of STORAGE_KEY_REGISTRY) {
      expect(definition.key).toBeTruthy();
      expect(definition.routeScope).toBeTruthy();
      expect(definition.defaultValue).toEqual(expect.any(String));
      expect(definition.validatorName).toBeTruthy();
      expect(definition.validate).toEqual(expect.any(Function));
      expect(definition.clearBehaviors.length, definition.key).toBeGreaterThan(0);
      expect(definition.versionStrategy).toBeTruthy();
      expect([
        "preference",
        "source text",
        "source metadata",
        "cache",
        "generated media, forbidden",
      ]).toContain(definition.sensitivity);
    }
  });

  test("registry validators reject corrupted JSON, invalid enums, and bad numbers", () => {
    expect(validateStorageRegistryValue(STORAGE_KEYS.theme, "dark")).toBe(true);
    expect(validateStorageRegistryValue(STORAGE_KEYS.theme, "system")).toBe(false);
    expect(validateStorageRegistryValue("mw_audio_wpm", "18")).toBe(true);
    expect(validateStorageRegistryValue("mw_audio_wpm", "9000")).toBe(false);
    expect(validateStorageRegistryValue("mw_audio_hz", "NaN")).toBe(false);
    expect(validateStorageRegistryValue("mw_audio_hz", "Infinity")).toBe(false);
    expect(validateStorageRegistryValue("mw_audio_sr", "44100")).toBe(true);
    expect(validateStorageRegistryValue("mw_audio_sr", "96000")).toBe(false);
    expect(validateStorageRegistryValue("mw_audio_preset", "warm_tone")).toBe(true);
    expect(validateStorageRegistryValue("mw_audio_preset", "old_square")).toBe(false);
    expect(validateStorageRegistryValue(STORAGE_KEYS.bookExportPreferences, "{bad")).toBe(false);
    expect(
      validateStorageRegistryValue(
        STORAGE_KEYS.videoGeneratorPreferences,
        JSON.stringify({ videoSettings: { visualStyle: "laser" } }),
      ),
    ).toBe(false);
  });

  test("write policy refuses generated media and oversize source but sanitizes printable logo data", () => {
    withMockStorage({}, (store) => {
      const mediaResult = safeWriteStorageResult(
        "mw_audio_mp3_blob",
        "GENERATED-MP3-BLOB",
      );
      expect(mediaResult.ok).toBe(false);
      expect(store.has("mw_audio_mp3_blob")).toBe(false);
      expect(sourceStorageWriteMessage([mediaResult])).toBe(
        "Generated media is never saved to browser storage.",
      );

      const largeSource = "A".repeat(STORAGE_LIMITS.sourceTextMaxLength + 1);
      const sourceResult = safeWriteStorageResult("mw_audio_text", largeSource);
      expect(sourceResult.ok).toBe(false);
      expect(store.has("mw_audio_text")).toBe(false);
      expect(sourceStorageWriteMessage([sourceResult])).toContain(
        "Source text is too large to save locally",
      );

      const printablePayload = JSON.stringify({
        brandName: "Private class",
        customLogoDataUrl: "data:image/png;base64,SECRET",
        customLogoName: "secret-logo.png",
      });
      expect(
        safeWriteStorageResult(
          STORAGE_KEYS.printableChartSettings,
          printablePayload,
        ).ok,
      ).toBe(true);
      const stored = JSON.parse(
        store.get(STORAGE_KEYS.printableChartSettings) ?? "{}",
      ) as Record<string, unknown>;
      expect(stored.brandName).toBe("Private class");
      expect(stored.customLogoDataUrl).toBe("");
      expect(stored.customLogoName).toBe("");
    });
  });

  test("quota errors are reported without blocking callers", () => {
    const originalWindow = globalWindow.window;
    globalWindow.window = {
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw new DOMException("full", "QuotaExceededError");
        },
        removeItem: () => {},
      },
    };

    try {
      const result = safeWriteStorageResult("mw_audio_text", "SOS");
      expect(result.ok).toBe(false);
      expect(result.ok ? "" : result.reason).toBe("quota-exceeded");
      expect(sourceStorageWriteMessage([result])).toContain(
        "Browser storage is full",
      );
    } finally {
      if (originalWindow) {
        globalWindow.window = originalWindow;
      } else {
        delete globalWindow.window;
      }
    }
  });

  test("clear source data and reset settings keep preference and source scopes separate", () => {
    withMockStorage(
      {
        [STORAGE_KEYS.theme]: "dark",
        mw_audio_text: "PRIVATE SOURCE",
        mw_audio_morse: "... --- ...",
        mw_audio_wpm: "24",
        mw_audio_hz: "700",
      },
      (store) => {
        const resetResult = resetMorseWordsSettings();
        expect(resetResult.failedKeys).toEqual([]);
        expect(store.get("mw_audio_text")).toBe("PRIVATE SOURCE");
        expect(store.get("mw_audio_morse")).toBe("... --- ...");
        expect(store.has("mw_audio_wpm")).toBe(false);
        expect(store.has(STORAGE_KEYS.theme)).toBe(false);

        store.set(STORAGE_KEYS.theme, "dark");
        store.set("mw_audio_wpm", "20");
        const clearResult = clearMorseWordsSourceData();
        expect(clearResult.failedKeys).toEqual([]);
        expect(store.has("mw_audio_text")).toBe(false);
        expect(store.has("mw_audio_morse")).toBe(false);
        expect(store.get("mw_audio_wpm")).toBe("20");
        expect(store.get(STORAGE_KEYS.theme)).toBe("dark");
      },
    );
  });
});

async function openDisplaySettingsDialog(page: Page) {
  const openNav = page.getByRole("button", { name: "Open navigation" });
  if (await openNav.isVisible().catch(() => false)) {
    await openNav.click();
  }

  const settingsButton = page.getByRole("button", {
    name: "Open display settings",
  });
  await expect(settingsButton).toBeVisible();
  await settingsButton.click();

  const dialog = page.getByRole("dialog", { name: "Display settings" });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe("nav storage controls", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("clear source data removes source keys while preserving theme and preferences", async ({
    page,
  }) => {
    await page.addInitScript((keys) => {
      window.localStorage.setItem(keys.theme, "dark");
      window.localStorage.setItem("mw_audio_text", "PRIVATE SOURCE");
      window.localStorage.setItem("mw_audio_morse", "... --- ...");
      window.localStorage.setItem("mw_audio_wpm", "24");
    }, STORAGE_KEYS);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const dialog = await openDisplaySettingsDialog(page);

    page.once("dialog", async (confirmDialog) => {
      expect(confirmDialog.message()).toContain(
        "Clear locally saved source text",
      );
      await confirmDialog.accept();
    });
    await dialog
      .getByRole("button", { name: "Clear locally saved source data" })
      .click();

    await expect(dialog.getByText("Locally saved source data cleared.")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mw_audio_text")))
      .toBeNull();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mw_audio_morse")))
      .toBeNull();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mw_audio_wpm")))
      .toBe("24");
    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) => localStorage.getItem(storageKey),
          STORAGE_KEYS.theme,
        ),
      )
      .toBe("dark");
  });

  test("reset settings clears preference keys without wiping separated source text", async ({
    page,
  }) => {
    await page.addInitScript((keys) => {
      window.localStorage.setItem(keys.theme, "dark");
      window.localStorage.setItem(keys.fullPageFlash, "1");
      window.localStorage.setItem("mw_audio_text", "PRIVATE SOURCE");
      window.localStorage.setItem("mw_audio_wpm", "24");
      document.documentElement.dataset.theme = "dark";
    }, STORAGE_KEYS);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const dialog = await openDisplaySettingsDialog(page);

    page.once("dialog", async (confirmDialog) => {
      expect(confirmDialog.message()).toContain("Reset MorseWords settings");
      await confirmDialog.accept();
    });
    await dialog
      .getByRole("button", { name: "Reset MorseWords settings" })
      .click();

    await expect(dialog.getByText("MorseWords settings reset.")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mw_audio_text")))
      .toBe("PRIVATE SOURCE");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mw_audio_wpm")))
      .toBeNull();
    await expect
      .poll(() =>
        page.evaluate(
          (storageKey) => localStorage.getItem(storageKey),
          STORAGE_KEYS.theme,
        ),
      )
      .toBeNull();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe("light");
  });

  test("mobile dark-mode settings panel exposes usable storage controls", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((keys) => {
      window.localStorage.setItem(keys.theme, "dark");
      window.localStorage.setItem("mw_audio_text", "MOBILE PRIVATE SOURCE");
      document.documentElement.dataset.theme = "dark";
    }, STORAGE_KEYS);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await waitForRouteReady(page);
    const dialog = await openDisplaySettingsDialog(page);
    const clearButton = dialog.getByRole("button", {
      name: "Clear locally saved source data",
    });
    const resetButton = dialog.getByRole("button", {
      name: "Reset MorseWords settings",
    });

    await expect(clearButton).toBeVisible();
    await expect(resetButton).toBeVisible();
    const colorSnapshot = await resetButton.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });
    expect(colorSnapshot.color).not.toBe(colorSnapshot.backgroundColor);

    page.once("dialog", async (confirmDialog) => {
      await confirmDialog.accept();
    });
    await clearButton.click();
    await expect(dialog.getByText("Locally saved source data cleared.")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("mw_audio_text")))
      .toBeNull();
  });

  for (const route of [
    "/audio",
    "/morse-code-sound-generator",
    "/morse-code-mp3-generator",
  ] as const) {
    test(`${route} discloses local browser source saving`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await waitForRouteReady(page);

      await expect(page.locator("body")).toContainText(
        /source may be saved only in this browser on this device and can be cleared from site settings\./i,
      );
    });
  }
});

const CORRUPTED_SETTINGS: Record<string, string> = {
  mw_hz: "nope",
  mw_vol: "2",
  mw_preset: "old_square",
  mw_wpm: "-50",
  mw_char_wpm: "Infinity",
  mw_fwpm: "999",
  mw_audio_source: "video",
  mw_audio_wpm: "9000",
  mw_audio_fwpm: "9000",
  mw_audio_hz: "NaN",
  mw_audio_vol: "-2",
  mw_audio_preset: "smooth_sine",
  mw_audio_attack: "-1",
  mw_audio_release: "900",
  mw_audio_repeat: "maybe",
  mw_audio_sound: "probably",
  mw_audio_flash: "yes please",
  mw_audio_sr: "96000",
  mw_audio_tail: "99999",
  mw_mp3_kbps: "320",
  mw_typing_input_mode: "vim",
  mw_typing_show_stats: "sometimes",
  mw_typing_duration_sec: "37",
  mw_practice_pool: "aliens",
  mw_practice_mode_all: "telepathy",
  mw_practice_best_streak_all: "-99",
  mw_sentence_practice_mode: "telepathy",
  mw_sentence_practice_difficulty: "expert",
  mw_sentence_practice_set: "unknown",
  mw_sentence_practice_best_streak: "Infinity",
  mw_audio_practice_difficulty: "expert",
  mw_audio_practice_best_streak: "-10",
  mw_audio_quiz_difficulty: "expert",
  mw_audio_quiz_best_streak: "Infinity",
  mw_sound_generator_source: "video",
  mw_sound_generator_text: "SAFE TEXT",
  mw_sound_generator_wpm: "Infinity",
  mw_sound_generator_preset: "old_square",
  mw_visual_quiz_best_streak: "Infinity",
  mw_word_trainer_best_streak: "Infinity",
  "morsewords:book-translator:preferences:v1": "{not json",
  "morsewords:video-generator:preferences:v1": JSON.stringify({
    charWpm: Infinity,
    videoSettings: { visualStyle: "laser" },
  }),
  "morsewords-printable-chart-settings-v6": "{not json",
  "morsewords-printable-chart-presets-v3": "{not json",
};

const CORRUPTED_STORAGE_ROUTES = [
  "/",
  "/audio",
  "/morse-code-sound-generator",
  "/morse-code-mp3-generator",
  "/typing",
  "/practice",
  "/morse-code-sentence-practice",
  "/morse-code-audio-practice",
  "/morse-code-audio-quiz",
  "/morse-code-visual-quiz",
  "/morse-code-word-trainer",
  "/morse-code-printable-chart",
  "/morse-code-book-translator",
  "/morse-code-video-generator",
  "/morse-code-word-search-builder",
] as const;

test.describe("corrupted persisted settings smoke", () => {
  for (const route of CORRUPTED_STORAGE_ROUTES) {
    test(`${route} recovers from invalid local settings`, async ({
      page,
    }, testInfo) => {
      await blockExternalNetwork(page);
      const consoleErrors = collectConsoleErrors(page);

      await page.addInitScript((entries) => {
        for (const [key, value] of entries as Array<[string, string]>) {
          window.localStorage.setItem(key, value);
        }
      }, Object.entries(CORRUPTED_SETTINGS));

      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("body")).not.toContainText(/NaN|Infinity/);
      await expect(page.locator("body")).not.toContainText(/Application Error/);

      const seriousErrors = consoleErrors.filter(
        (entry) =>
          (entry.type === "pageerror" &&
            !/WebSocket closed without opened/i.test(entry.text)) ||
          /TypeError|ReferenceError|Hydration failed/i.test(entry.text),
      );
      await writeArtifact(
        testInfo,
        `corrupted-settings-${route.replace(/[^a-z0-9]+/gi, "-")}.json`,
        { route, seriousErrors },
      );
      expect(seriousErrors).toEqual([]);
    });
  }
});
