import {
  AUDIO_ATTACK_RANGE,
  AUDIO_PITCH_RANGE,
  AUDIO_RELEASE_RANGE,
  TOOL_SPEED_RANGE,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
} from "~/client/components/shared/morseSettings";
import type { AudioTonePresetId } from "~/client/components/shared/audioPresetRegistry";
import {
  readStoredBoolean,
  readStoredNumber,
  readStoredString,
  safeReadStorage,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";

export const SHARED_AUDIO_PREFERENCE_KEYS = {
  characterSpeed: "mw_audio_wpm",
  farnsworthSpeed: "mw_audio_fwpm",
  pitch: "mw_audio_hz",
  volume: "mw_audio_vol",
  preset: "mw_audio_preset",
  attack: "mw_audio_attack",
  release: "mw_audio_release",
  repeat: "mw_audio_repeat",
  sound: "mw_audio_sound",
  flash: "mw_audio_flash",
  advancedOpen: "mw_audio_adv_open",
} as const;

export type SharedAudioPreferenceName = keyof typeof SHARED_AUDIO_PREFERENCE_KEYS;

export type SharedAudioPreferences = {
  charWpm: number;
  farnsworthWpm: number;
  toneHz: number;
  volume: number;
  preset: AudioTonePresetId;
  attackMs: number;
  releaseMs: number;
  repeat: boolean;
  soundOn: boolean;
  flash: boolean;
  advancedOpen: boolean;
};

export const DEFAULT_SHARED_AUDIO_PREFERENCES: SharedAudioPreferences = {
  charWpm: TOOL_SPEED_RANGE.defaultValue,
  farnsworthWpm: TOOL_SPEED_RANGE.defaultValue,
  toneHz: AUDIO_PITCH_RANGE.defaultValue,
  volume: VOLUME_RANGE.defaultValue,
  preset: "cw_radio",
  attackMs: AUDIO_ATTACK_RANGE.defaultValue,
  releaseMs: AUDIO_RELEASE_RANGE.defaultValue,
  repeat: false,
  soundOn: true,
  flash: false,
  advancedOpen: false,
};

type LegacyKey = string | readonly string[];
type LegacyKeys = Partial<Record<SharedAudioPreferenceName, LegacyKey>>;

function legacyKeyCandidates(name: SharedAudioPreferenceName, legacyKeys?: LegacyKeys) {
  const legacy = legacyKeys?.[name];
  if (!legacy) return [];
  return typeof legacy === "string" ? [legacy] : legacy;
}

function sourceKey(name: SharedAudioPreferenceName, legacyKeys?: LegacyKeys) {
  const canonical = SHARED_AUDIO_PREFERENCE_KEYS[name];
  if (safeReadStorage(canonical) !== null) return canonical;
  return legacyKeyCandidates(name, legacyKeys).find(
    (candidate) => safeReadStorage(candidate) !== null,
  ) ?? canonical;
}

function migrate(name: SharedAudioPreferenceName, value: string, legacyKeys?: LegacyKeys) {
  const canonical = SHARED_AUDIO_PREFERENCE_KEYS[name];
  const source = sourceKey(name, legacyKeys);
  if (source !== canonical && safeReadStorage(source) !== null) {
    safeWriteStorage(canonical, value);
  }
}

/**
 * Reads the common playback preferences from one namespace and repairs an
 * older route-local key only when no canonical preference has been saved.
 */
export function readSharedAudioPreferences(options: { legacyKeys?: LegacyKeys } = {}) {
  const { legacyKeys } = options;
  const charWpm = readStoredNumber(sourceKey("characterSpeed", legacyKeys), {
    fallback: DEFAULT_SHARED_AUDIO_PREFERENCES.charWpm,
    min: TOOL_SPEED_RANGE.min,
    max: TOOL_SPEED_RANGE.max,
    integer: true,
  });
  migrate("characterSpeed", String(charWpm), legacyKeys);

  const farnsworthWpm = clampFarnsworthWpm(
    readStoredNumber(sourceKey("farnsworthSpeed", legacyKeys), {
      fallback: charWpm,
      min: TOOL_SPEED_RANGE.min,
      max: charWpm,
      integer: true,
    }),
    charWpm,
  );
  migrate("farnsworthSpeed", String(farnsworthWpm), legacyKeys);

  const toneHz = readStoredNumber(sourceKey("pitch", legacyKeys), {
    fallback: DEFAULT_SHARED_AUDIO_PREFERENCES.toneHz,
    min: AUDIO_PITCH_RANGE.min,
    max: AUDIO_PITCH_RANGE.max,
    integer: true,
  });
  migrate("pitch", String(toneHz), legacyKeys);

  const volume = readStoredNumber(sourceKey("volume", legacyKeys), {
    fallback: DEFAULT_SHARED_AUDIO_PREFERENCES.volume,
    min: VOLUME_RANGE.min,
    max: VOLUME_RANGE.max,
  });
  migrate("volume", String(volume), legacyKeys);

  const preset = sanitizeAudioGeneratorPreset(
    readStoredString(sourceKey("preset", legacyKeys), DEFAULT_SHARED_AUDIO_PREFERENCES.preset, {
      maxLength: 64,
    }),
  );
  migrate("preset", preset, legacyKeys);

  const attackMs = readStoredNumber(sourceKey("attack", legacyKeys), {
    fallback: DEFAULT_SHARED_AUDIO_PREFERENCES.attackMs,
    min: AUDIO_ATTACK_RANGE.min,
    max: AUDIO_ATTACK_RANGE.max,
    integer: true,
  });
  migrate("attack", String(attackMs), legacyKeys);

  const releaseMs = readStoredNumber(sourceKey("release", legacyKeys), {
    fallback: DEFAULT_SHARED_AUDIO_PREFERENCES.releaseMs,
    min: AUDIO_RELEASE_RANGE.min,
    max: AUDIO_RELEASE_RANGE.max,
    integer: true,
  });
  migrate("release", String(releaseMs), legacyKeys);

  const repeat = readStoredBoolean(sourceKey("repeat", legacyKeys), false);
  migrate("repeat", repeat ? "1" : "0", legacyKeys);
  const soundOn = readStoredBoolean(sourceKey("sound", legacyKeys), true);
  migrate("sound", soundOn ? "1" : "0", legacyKeys);
  const flash = readStoredBoolean(sourceKey("flash", legacyKeys), false);
  migrate("flash", flash ? "1" : "0", legacyKeys);
  const advancedOpen = readStoredBoolean(sourceKey("advancedOpen", legacyKeys), false);
  migrate("advancedOpen", advancedOpen ? "1" : "0", legacyKeys);

  return {
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    preset,
    attackMs,
    releaseMs,
    repeat,
    soundOn,
    flash,
    advancedOpen,
  } satisfies SharedAudioPreferences;
}

export function writeSharedAudioPreferences(preferences: SharedAudioPreferences) {
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.characterSpeed, String(preferences.charWpm));
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.farnsworthSpeed, String(preferences.farnsworthWpm));
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.pitch, String(preferences.toneHz));
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.volume, String(preferences.volume));
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.preset, preferences.preset);
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.attack, String(preferences.attackMs));
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.release, String(preferences.releaseMs));
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.repeat, preferences.repeat ? "1" : "0");
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.sound, preferences.soundOn ? "1" : "0");
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.flash, preferences.flash ? "1" : "0");
  safeWriteStorage(SHARED_AUDIO_PREFERENCE_KEYS.advancedOpen, preferences.advancedOpen ? "1" : "0");
}
