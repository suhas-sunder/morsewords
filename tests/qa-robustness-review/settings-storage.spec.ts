import { expect, test } from "@playwright/test";

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
  safeReadStorage,
  safeRemoveStorage,
  safeWriteStorage,
} from "../../app/client/components/shared/settingsStorage";
import {
  blockExternalNetwork,
  collectConsoleErrors,
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
  mw_visual_quiz_best_streak: "Infinity",
  mw_word_trainer_best_streak: "Infinity",
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
