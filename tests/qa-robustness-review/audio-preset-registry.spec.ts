import { expect, test } from "@playwright/test";

import {
  AUDIO_TONE_PRESET_REGISTRY,
  AUDIO_TONE_PRESETS,
  CREATIVE_AUDIO_TONE_PRESETS,
  STANDARD_AUDIO_TONE_PRESETS,
  getAudioPresetsForContext,
  mapTranslatorAudioPreset,
  sanitizeAudioTonePreset,
} from "../../app/client/components/shared/audioPresetRegistry";
import { renderBookPartPcm } from "../../app/client/components/morse-code-book-translator/bookBundleExport";
import { BOOK_EXPORT_PRESETS } from "../../app/client/components/morse-code-book-translator/bookExportPresets";

test("shared audio preset registry preserves standard Morse presets", () => {
  expect(STANDARD_AUDIO_TONE_PRESETS).toEqual([
    "cw_radio",
    "sine",
    "square",
    "triangle",
    "sawtooth",
    "sounder",
  ]);

  for (const preset of STANDARD_AUDIO_TONE_PRESETS) {
    const definition = AUDIO_TONE_PRESET_REGISTRY[preset];
    expect(definition.standard).toBe(true);
    expect(definition.category).toBe("standard");
    expect(definition.worksForLivePlayback).toBe(true);
    expect(definition.worksForWavExport).toBe(true);
    expect(definition.worksForMp3Export).toBe(true);
    expect(definition.worksForLongFormExport).toBe(true);
  }
});

test("creative presets are optional and hidden from the translator context", () => {
  expect(CREATIVE_AUDIO_TONE_PRESETS).toEqual([
    "soft_bell",
    "warm_tone",
    "low_beacon",
    "submarine_ping",
    "digital_blip",
    "soft_click",
    "bird_chirp",
  ]);

  const audioPresets = getAudioPresetsForContext("audio");
  const bookPresets = getAudioPresetsForContext("bookExport");
  const translatorPresets = getAudioPresetsForContext("translator");

  for (const preset of CREATIVE_AUDIO_TONE_PRESETS) {
    expect(audioPresets).toContain(preset);
    expect(bookPresets).toContain(preset);
    expect(translatorPresets).not.toContain(preset);
    expect(AUDIO_TONE_PRESET_REGISTRY[preset].standard).toBe(false);
  }

  expect(getAudioPresetsForContext("audio", { includeCreative: false })).toEqual(
    [...STANDARD_AUDIO_TONE_PRESETS],
  );
});

test("unknown and legacy preset IDs resolve safely", () => {
  expect(sanitizeAudioTonePreset("old_square")).toBe("cw_radio");
  expect(sanitizeAudioTonePreset("smooth_sine")).toBe("sine");
  expect(sanitizeAudioTonePreset("bright_square")).toBe("square");
  expect(sanitizeAudioTonePreset("telegraph_sounder")).toBe("sounder");
  expect(sanitizeAudioTonePreset("soft_bell", "cw_radio", "translator")).toBe(
    "cw_radio",
  );
  expect(mapTranslatorAudioPreset("smooth_sine")).toBe("sine");
  expect(mapTranslatorAudioPreset("telegraph_sounder")).toBe("sounder");
});

test("book PCM renderer supports creative synthesized presets", async () => {
  const controller = new AbortController();
  const pcm = await renderBookPartPcm(
    "SOS",
    {
      ...BOOK_EXPORT_PRESETS["Reader Quick Start"],
      tonePreset: "bird_chirp",
      pitch: 920,
      volume: 0.5,
    },
    controller.signal,
  );

  expect(pcm.length).toBeGreaterThan(100);
  expect(Array.from(pcm).some((sample) => Math.abs(sample) > 0.0001)).toBe(
    true,
  );
});
