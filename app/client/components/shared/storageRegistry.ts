export type StorageSensitivity =
  | "preference"
  | "source text"
  | "source metadata"
  | "cache"
  | "generated media, forbidden";

export type StorageClearBehavior =
  | "reset settings"
  | "clear source data"
  | "clear all site data";

export type StorageValueType =
  | "boolean-string"
  | "enum-string"
  | "number-string"
  | "string"
  | "json-object"
  | "forbidden";

export type StorageWriteBlockReason =
  | "forbidden"
  | "too-large"
  | "invalid";

export type StorageWritePolicyResult =
  | { ok: true; value: string }
  | {
      ok: false;
      reason: StorageWriteBlockReason;
      message: string;
      maxLength?: number;
    };

export type StorageKeyDefinition = {
  key: string;
  routeScope: string;
  valueType: StorageValueType;
  defaultValue: string;
  validatorName: string;
  validate: (raw: string | null) => boolean;
  sensitivity: StorageSensitivity;
  clearBehaviors: readonly StorageClearBehavior[];
  versionStrategy: string;
  maxLength?: number;
  notes?: string;
  normalizeForWrite?: (value: string) => StorageWritePolicyResult;
};

export const STORAGE_LIMITS = {
  sourceTextMaxLength: 25_000,
  wordTrainerCustomWordsMaxLength: 4_000,
  filenameMaxLength: 120,
  printableChartJsonMaxLength: 90_000,
  preferenceJsonMaxLength: 24_000,
  bookCacheItemMaxLength: 2_200_000,
  bookCacheIndexMaxLength: 24_000,
  bookSectionCacheItemMaxLength: 160_000,
  bookSectionCacheIndexMaxLength: 36_000,
} as const;

export const STORAGE_KEYS = {
  theme: "morsewords-theme",
  showAmbientMorse: "morsewords-show-ambient-morse",
  disableFlashEffects: "morsewords-disable-flash-effects",
  fullPageFlash: "morsewords-full-page-flash",
  bookExportPreferences: "morsewords:book-translator:preferences:v1",
  videoGeneratorPreferences: "morsewords:video-generator:preferences:v1",
  printableChartSettings: "morsewords-printable-chart-settings-v6",
  printableChartPresets: "morsewords-printable-chart-presets-v3",
  bookCacheIndex: "morsewords:book-cache:index:v1",
  bookSectionCacheIndex: "morsewords:book-section-cache:index:v1",
} as const;

export const BOOK_CACHE_KEY_PREFIX = "morsewords:book-cache:item:v1:";
export const BOOK_SECTION_CACHE_KEY_PREFIX =
  "morsewords:book-section-cache:item:v1:";

const SOURCE_MODES = ["text", "morse"] as const;
const TRANSLATOR_PRESETS = [
  "cw_radio",
  "smooth_sine",
  "bright_square",
  "telegraph_sounder",
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
  "smooth_sine",
  "bright_square",
  "telegraph_sounder",
] as const;
const AUDIO_SAMPLE_RATES = [22050, 44100, 48000] as const;
const MP3_BITRATES = [32, 48, 64, 96, 128, 192, 256] as const;
const TYPING_INPUT_MODES = ["dotdash", "fj"] as const;
const TYPING_DURATIONS = [10, 30, 60, 120, 300, 1800] as const;
const PRACTICE_POOLS = [
  "all",
  "letters",
  "numbers",
  "signals",
  "words",
  "sentences",
] as const;
const PRACTICE_MODES = ["text_to_morse", "morse_to_text", "mixed"] as const;
const AUDIO_DIFFICULTIES = ["beginner", "easy", "medium", "hard"] as const;
const SENTENCE_DIFFICULTIES = ["easy", "medium", "hard", "all"] as const;
const SENTENCE_SETS = [
  "all",
  "beginner",
  "radio",
  "reports",
  "spacing",
] as const;
const VIDEO_VISUAL_STYLES = [
  "lightbulb",
  "dot",
  "full-frame",
  "morse-text",
] as const;
const VIDEO_RESOLUTIONS = ["720p", "1080p"] as const;
const VIDEO_BACKGROUNDS = [
  "site-theme",
  "warm-morsewords",
  "dark-morsewords",
] as const;
const VIDEO_INTENSITIES = ["low", "medium", "high"] as const;
const VIDEO_TEXT_DISPLAY_MODES = ["none", "morse", "text", "both"] as const;

const FORBIDDEN_MEDIA_KEY_PATTERNS = [
  /(?:mp3|wav|webm|zip|audio|video).*(?:blob|base64|dataurl|data_url)/i,
  /(?:blob|base64|dataurl|data_url).*(?:mp3|wav|webm|zip|audio|video)/i,
  /generated[-_:]?(?:mp3|wav|webm|zip|audio|video)/i,
] as const;

function ok(value: string): StorageWritePolicyResult {
  return { ok: true, value };
}

function block(
  reason: StorageWriteBlockReason,
  message: string,
  maxLength?: number,
): StorageWritePolicyResult {
  return { ok: false, reason, message, maxLength };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseJsonObject(raw: string | null): Record<string, unknown> | null {
  if (raw === null || raw.trim() === "") return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isBooleanString(raw: string | null) {
  if (raw === null) return false;
  const normalized = raw.trim().toLowerCase();
  return (
    normalized === "1" ||
    normalized === "0" ||
    normalized === "true" ||
    normalized === "false"
  );
}

function enumString<const T extends readonly string[]>(allowed: T) {
  return (raw: string | null) =>
    raw !== null && allowed.includes(raw.trim() as T[number]);
}

function numberString(options: {
  min: number;
  max: number;
  integer?: boolean;
}) {
  return (raw: string | null) => {
    if (raw === null || raw.trim() === "") return false;
    const value = Number(raw);
    if (!Number.isFinite(value)) return false;
    if (value < options.min || value > options.max) return false;
    return options.integer ? Number.isInteger(value) : true;
  };
}

function numberEnum<const T extends readonly number[]>(allowed: T) {
  return (raw: string | null) => {
    if (raw === null || raw.trim() === "") return false;
    const value = Number(raw);
    return Number.isFinite(value) && allowed.includes(value as T[number]);
  };
}

function stringWithMax(maxLength: number, allowEmpty = true) {
  return (raw: string | null) => {
    if (raw === null) return false;
    if (!allowEmpty && raw.trim() === "") return false;
    return raw.length <= maxLength;
  };
}

function normalizeCappedString(maxLength: number): (value: string) => StorageWritePolicyResult {
  return (value) => ok(value.slice(0, maxLength));
}

function normalizeSourceText(maxLength: number): (value: string) => StorageWritePolicyResult {
  return (value) => {
    if (value.length <= maxLength) return ok(value);
    return block(
      "too-large",
      `Source text is too large to save locally. Keep saved source under ${maxLength.toLocaleString()} characters.`,
      maxLength,
    );
  };
}

function validateJsonObjectMax(maxLength: number) {
  return (raw: string | null) =>
    raw !== null && raw.length <= maxLength && parseJsonObject(raw) !== null;
}

function normalizeJsonObjectMax(maxLength: number) {
  return (value: string) => {
    if (value.length > maxLength) {
      return block(
        "too-large",
        `Stored JSON is too large for local browser storage. Keep this saved payload under ${maxLength.toLocaleString()} characters.`,
        maxLength,
      );
    }
    return parseJsonObject(value) ? ok(value) : block("invalid", "Stored JSON must be an object.");
  };
}

function validateBookPreferences(raw: string | null) {
  const value = parseJsonObject(raw);
  if (!value) return false;
  if (
    value.outputType !== undefined &&
    value.outputType !== "audio" &&
    value.outputType !== "video"
  ) {
    return false;
  }
  if (
    value.advancedOpen !== undefined &&
    typeof value.advancedOpen !== "boolean"
  ) {
    return false;
  }
  if (
    value.exportSettings !== undefined &&
    !isPlainObject(value.exportSettings)
  ) {
    return false;
  }
  if (value.videoSettings !== undefined && !isPlainObject(value.videoSettings)) {
    return false;
  }
  return true;
}

function validateVideoSettingsObject(value: unknown) {
  if (!isPlainObject(value)) return false;
  if (
    value.visualStyle !== undefined &&
    !VIDEO_VISUAL_STYLES.includes(
      value.visualStyle as (typeof VIDEO_VISUAL_STYLES)[number],
    )
  ) {
    return false;
  }
  if (
    value.resolution !== undefined &&
    !VIDEO_RESOLUTIONS.includes(
      value.resolution as (typeof VIDEO_RESOLUTIONS)[number],
    )
  ) {
    return false;
  }
  if (
    value.backgroundStyle !== undefined &&
    !VIDEO_BACKGROUNDS.includes(
      value.backgroundStyle as (typeof VIDEO_BACKGROUNDS)[number],
    )
  ) {
    return false;
  }
  if (
    value.intensity !== undefined &&
    !VIDEO_INTENSITIES.includes(
      value.intensity as (typeof VIDEO_INTENSITIES)[number],
    )
  ) {
    return false;
  }
  if (
    value.textDisplayMode !== undefined &&
    !VIDEO_TEXT_DISPLAY_MODES.includes(
      value.textDisplayMode as (typeof VIDEO_TEXT_DISPLAY_MODES)[number],
    )
  ) {
    return false;
  }
  for (const key of ["includeAudioTrack", "showMorseOverlay", "showBranding"]) {
    if (value[key] !== undefined && typeof value[key] !== "boolean") return false;
  }
  if (value.targetPartMinutes !== undefined) {
    if (
      typeof value.targetPartMinutes !== "number" ||
      !Number.isFinite(value.targetPartMinutes) ||
      value.targetPartMinutes < 1 ||
      value.targetPartMinutes > 30
    ) {
      return false;
    }
  }
  return true;
}

function validateVideoGeneratorPreferences(raw: string | null) {
  const value = parseJsonObject(raw);
  if (!value) return false;
  if (
    value.sourceMode !== undefined &&
    !SOURCE_MODES.includes(value.sourceMode as (typeof SOURCE_MODES)[number])
  ) {
    return false;
  }
  if (
    value.videoSettings !== undefined &&
    !validateVideoSettingsObject(value.videoSettings)
  ) {
    return false;
  }
  if (value.charWpm !== undefined && !numberRangeValue(value.charWpm, 5, 60, true)) {
    return false;
  }
  if (
    value.farnsworthWpm !== undefined &&
    !numberRangeValue(value.farnsworthWpm, 5, 60, true)
  ) {
    return false;
  }
  if (value.pitch !== undefined && !numberRangeValue(value.pitch, 200, 1600, true)) {
    return false;
  }
  if (value.volume !== undefined && !numberRangeValue(value.volume, 0, 1)) {
    return false;
  }
  if (
    value.sampleRate !== undefined &&
    !AUDIO_SAMPLE_RATES.includes(
      value.sampleRate as (typeof AUDIO_SAMPLE_RATES)[number],
    )
  ) {
    return false;
  }
  if (
    value.tonePreset !== undefined &&
    !AUDIO_PRESETS.includes(value.tonePreset as (typeof AUDIO_PRESETS)[number])
  ) {
    return false;
  }
  if (
    value.fileName !== undefined &&
    (typeof value.fileName !== "string" ||
      value.fileName.length > STORAGE_LIMITS.filenameMaxLength)
  ) {
    return false;
  }
  return true;
}

function numberRangeValue(
  value: unknown,
  min: number,
  max: number,
  integer = false,
) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max &&
    (!integer || Number.isInteger(value))
  );
}

function sanitizePrintablePayloadForStorage(
  value: string,
): StorageWritePolicyResult {
  const parsed = parseJsonObject(value);
  if (!parsed) return block("invalid", "Printable chart settings must be JSON objects.");

  const sanitized = sanitizePrintableSettingsLikeObject(parsed);
  const serialized = JSON.stringify(sanitized);
  if (serialized.length > STORAGE_LIMITS.printableChartJsonMaxLength) {
    return block(
      "too-large",
      `Printable chart settings are too large to save locally. Keep saved worksheet text under ${STORAGE_LIMITS.printableChartJsonMaxLength.toLocaleString()} characters.`,
      STORAGE_LIMITS.printableChartJsonMaxLength,
    );
  }
  return ok(serialized);
}

function sanitizePrintablePresetsForStorage(
  value: string,
): StorageWritePolicyResult {
  const parsed = parseJsonObject(value);
  if (!parsed) return block("invalid", "Printable chart presets must be JSON objects.");

  const sanitized: Record<string, unknown> = {};
  for (const [key, preset] of Object.entries(parsed)) {
    sanitized[key] = isPlainObject(preset)
      ? sanitizePrintableSettingsLikeObject(preset)
      : preset;
  }
  const serialized = JSON.stringify(sanitized);
  if (serialized.length > STORAGE_LIMITS.printableChartJsonMaxLength) {
    return block(
      "too-large",
      `Printable chart presets are too large to save locally. Keep saved preset text under ${STORAGE_LIMITS.printableChartJsonMaxLength.toLocaleString()} characters.`,
      STORAGE_LIMITS.printableChartJsonMaxLength,
    );
  }
  return ok(serialized);
}

function sanitizePrintableSettingsLikeObject(value: Record<string, unknown>) {
  const next: Record<string, unknown> = { ...value };
  // A logo file can still be used during the current session, but image data
  // URLs are generated media and must not be persisted in Web Storage.
  next.customLogoDataUrl = "";
  next.customLogoName = "";
  return next;
}

function preferenceKey(
  key: string,
  routeScope: string,
  valueType: StorageValueType,
  defaultValue: string,
  validatorName: string,
  validate: (raw: string | null) => boolean,
  options: Partial<StorageKeyDefinition> = {},
): StorageKeyDefinition {
  return {
    key,
    routeScope,
    valueType,
    defaultValue,
    validatorName,
    validate,
    sensitivity: "preference",
    clearBehaviors: ["reset settings", "clear all site data"],
    versionStrategy: "stable unversioned key; validators migrate invalid values to defaults",
    ...options,
  };
}

function sourceTextKey(
  key: string,
  routeScope: string,
  defaultValue: string,
  maxLength: number = STORAGE_LIMITS.sourceTextMaxLength,
): StorageKeyDefinition {
  return {
    key,
    routeScope,
    valueType: "string",
    defaultValue,
    validatorName: `stringMax${maxLength}`,
    validate: stringWithMax(maxLength),
    sensitivity: "source text",
    clearBehaviors: ["clear source data", "clear all site data"],
    versionStrategy: "stable unversioned key; oversize values are ignored on read and refused on write",
    maxLength,
    normalizeForWrite: normalizeSourceText(maxLength),
  };
}

function sourceMetadataKey(
  key: string,
  routeScope: string,
  defaultValue: string,
  maxLength: number = STORAGE_LIMITS.filenameMaxLength,
): StorageKeyDefinition {
  return {
    key,
    routeScope,
    valueType: "string",
    defaultValue,
    validatorName: `stringMax${maxLength}`,
    validate: stringWithMax(maxLength),
    sensitivity: "source metadata",
    clearBehaviors: ["clear source data", "clear all site data"],
    versionStrategy: "stable unversioned key; oversized metadata is trimmed on write",
    maxLength,
    normalizeForWrite: normalizeCappedString(maxLength),
  };
}

function progressKey(
  key: string,
  routeScope: string,
  defaultValue = "0",
): StorageKeyDefinition {
  return {
    key,
    routeScope,
    valueType: "number-string",
    defaultValue,
    validatorName: "integerRange0To9999",
    validate: numberString({ min: 0, max: 9999, integer: true }),
    sensitivity: "preference",
    clearBehaviors: ["clear all site data"],
    versionStrategy: "stable unversioned key; invalid progress falls back to zero",
  };
}

const audioPreferenceKeys = (prefix: "mw_audio" | "mw_sound_generator") => [
  preferenceKey(`${prefix}_source`, `${prefix} source mode`, "enum-string", "text", "sourceMode", enumString(SOURCE_MODES)),
  sourceTextKey(`${prefix}_text`, `${prefix} text source`, "sos help"),
  sourceTextKey(`${prefix}_morse`, `${prefix} Morse source`, "... --- ..."),
  preferenceKey(`${prefix}_wpm`, `${prefix} audio speed`, "number-string", "18", "integerRange5To60", numberString({ min: 5, max: 60, integer: true })),
  preferenceKey(`${prefix}_fwpm`, `${prefix} Farnsworth spacing`, "number-string", "12", "integerRange5To60", numberString({ min: 5, max: 60, integer: true }), {
    notes: "Read helpers also clamp this value against character WPM.",
  }),
  preferenceKey(`${prefix}_hz`, `${prefix} pitch`, "number-string", "650", "integerRange200To1600", numberString({ min: 200, max: 1600, integer: true })),
  preferenceKey(`${prefix}_vol`, `${prefix} volume`, "number-string", "0.75", "numberRange0To1", numberString({ min: 0, max: 1 })),
  preferenceKey(`${prefix}_preset`, `${prefix} tone preset`, "enum-string", "cw_radio", "audioTonePresetOrLegacyAlias", enumString(AUDIO_PRESETS)),
  preferenceKey(`${prefix}_attack`, `${prefix} attack envelope`, "number-string", "8", "integerRange0To40", numberString({ min: 0, max: 40, integer: true })),
  preferenceKey(`${prefix}_release`, `${prefix} release envelope`, "number-string", "12", "integerRange0To80", numberString({ min: 0, max: 80, integer: true })),
  preferenceKey(`${prefix}_repeat`, `${prefix} repeat playback`, "boolean-string", "0", "booleanString", isBooleanString),
  preferenceKey(`${prefix}_sound`, `${prefix} sound enabled`, "boolean-string", "1", "booleanString", isBooleanString),
  preferenceKey(`${prefix}_flash`, `${prefix} flash enabled`, "boolean-string", "0", "booleanString", isBooleanString),
  preferenceKey(`${prefix}_adv_open`, `${prefix} advanced settings open`, "boolean-string", "1", "booleanString", isBooleanString),
  preferenceKey(`${prefix}_export_open`, `${prefix} export settings open`, "boolean-string", "1", "booleanString", isBooleanString),
  sourceMetadataKey(`${prefix}_filename`, `${prefix} export filename`, prefix === "mw_audio" ? "morse-audio" : "morse-sound"),
  preferenceKey(`${prefix}_sr`, `${prefix} sample rate`, "number-string", "44100", "audioSampleRate", numberEnum(AUDIO_SAMPLE_RATES)),
  preferenceKey(`${prefix}_tail`, `${prefix} tail padding`, "number-string", "120", "integerRange0To400", numberString({ min: 0, max: 400, integer: true })),
  preferenceKey(`${prefix}_mp3_kbps`, `${prefix} MP3 bitrate`, "number-string", "128", "mp3Bitrate", numberEnum(MP3_BITRATES)),
] as const;

export const STORAGE_KEY_REGISTRY: readonly StorageKeyDefinition[] = [
  preferenceKey(STORAGE_KEYS.theme, "site theme", "enum-string", "light", "themeMode", enumString(["light", "dark"] as const), {
    versionStrategy: "localStorage key plus same-name cookie for SSR first paint",
  }),
  preferenceKey(STORAGE_KEYS.showAmbientMorse, "site display", "boolean-string", "1", "booleanString", isBooleanString),
  preferenceKey(STORAGE_KEYS.disableFlashEffects, "site display", "boolean-string", "0", "booleanString", isBooleanString),
  preferenceKey(STORAGE_KEYS.fullPageFlash, "site display", "boolean-string", "0", "booleanString", isBooleanString),

  preferenceKey("mw_wpm", "translator legacy speed", "number-string", "20", "integerRange5To40", numberString({ min: 5, max: 40, integer: true }), {
    notes: "Legacy translator speed key mirrored by mw_char_wpm for compatibility.",
  }),
  preferenceKey("mw_char_wpm", "translator character speed", "number-string", "20", "integerRange5To40", numberString({ min: 5, max: 40, integer: true })),
  preferenceKey("mw_fwpm", "translator Farnsworth spacing", "number-string", "20", "integerRange5To40", numberString({ min: 5, max: 40, integer: true }), {
    notes: "Read helpers also clamp this value against character WPM.",
  }),
  preferenceKey("mw_hz", "translator pitch", "number-string", "600", "integerRange300To900", numberString({ min: 300, max: 900, integer: true })),
  preferenceKey("mw_vol", "translator volume", "number-string", "0.75", "numberRange0To1", numberString({ min: 0, max: 1 })),
  preferenceKey("mw_sound", "translator sound enabled", "boolean-string", "1", "booleanString", isBooleanString),
  preferenceKey("mw_repeat", "translator repeat playback", "boolean-string", "0", "booleanString", isBooleanString),
  preferenceKey("mw_flash", "translator flash enabled", "boolean-string", "0", "booleanString", isBooleanString),
  preferenceKey("mw_preset", "translator tone preset", "enum-string", "cw_radio", "translatorAudioPreset", enumString(TRANSLATOR_PRESETS)),
  preferenceKey("mw_adv_open", "translator advanced settings open", "boolean-string", "0", "booleanString", isBooleanString),

  ...audioPreferenceKeys("mw_audio"),
  sourceMetadataKey("mw_mp3_filename", "MP3 generator filename", "morse-code"),
  preferenceKey("mw_mp3_kbps", "MP3 generator bitrate", "number-string", "128", "mp3Bitrate", numberEnum(MP3_BITRATES)),
  ...audioPreferenceKeys("mw_sound_generator"),

  preferenceKey("mw_typing_input_mode", "typing input mode", "enum-string", "dotdash", "typingInputMode", enumString(TYPING_INPUT_MODES)),
  preferenceKey("mw_typing_show_stats", "typing stats visibility", "boolean-string", "1", "booleanString", isBooleanString),
  preferenceKey("mw_typing_duration_sec", "typing duration", "number-string", "30", "typingDuration", numberEnum(TYPING_DURATIONS)),

  preferenceKey("mw_practice_pool", "practice pool", "enum-string", "all", "practicePool", enumString(PRACTICE_POOLS)),
  ...PRACTICE_POOLS.map((pool) =>
    preferenceKey(`mw_practice_mode_${pool}`, `practice mode for ${pool}`, "enum-string", pool === "words" || pool === "sentences" ? "text_to_morse" : "mixed", "practiceMode", enumString(PRACTICE_MODES)),
  ),
  ...PRACTICE_POOLS.map((pool) =>
    progressKey(`mw_practice_best_streak_${pool}`, `practice best streak for ${pool}`),
  ),

  preferenceKey("mw_sentence_practice_mode", "sentence practice mode", "enum-string", "morse_to_text", "practiceMode", enumString(PRACTICE_MODES)),
  preferenceKey("mw_sentence_practice_difficulty", "sentence practice difficulty", "enum-string", "all", "sentenceDifficulty", enumString(SENTENCE_DIFFICULTIES)),
  preferenceKey("mw_sentence_practice_set", "sentence practice set", "enum-string", "all", "sentenceSet", enumString(SENTENCE_SETS)),
  progressKey("mw_sentence_practice_best_streak", "sentence practice best streak"),

  preferenceKey("mw_audio_practice_difficulty", "audio practice difficulty", "enum-string", "easy", "audioDifficulty", enumString(AUDIO_DIFFICULTIES)),
  progressKey("mw_audio_practice_best_streak", "audio practice best streak"),
  preferenceKey("mw_audio_quiz_difficulty", "audio quiz difficulty", "enum-string", "easy", "audioDifficulty", enumString(AUDIO_DIFFICULTIES)),
  progressKey("mw_audio_quiz_best_streak", "audio quiz best streak"),
  progressKey("mw_visual_quiz_best_streak", "visual quiz best streak"),

  sourceTextKey(
    "mw_word_trainer_custom_words",
    "word trainer custom words",
    "signal\nteacher\npractice\ncopy",
    STORAGE_LIMITS.wordTrainerCustomWordsMaxLength,
  ),
  progressKey("mw_word_trainer_best_streak", "word trainer best streak"),

  {
    key: STORAGE_KEYS.printableChartSettings,
    routeScope: "printable chart settings",
    valueType: "json-object",
    defaultValue: "default printable chart settings",
    validatorName: "printableSettingsJsonObjectNoPersistedLogoData",
    validate: validateJsonObjectMax(STORAGE_LIMITS.printableChartJsonMaxLength),
    sensitivity: "source text",
    clearBehaviors: ["reset settings", "clear source data", "clear all site data"],
    versionStrategy: "versioned key suffix v6; malformed JSON falls back to defaults",
    maxLength: STORAGE_LIMITS.printableChartJsonMaxLength,
    notes: "Mixed settings and worksheet text. Custom logo data URLs are removed before write.",
    normalizeForWrite: sanitizePrintablePayloadForStorage,
  },
  {
    key: STORAGE_KEYS.printableChartPresets,
    routeScope: "printable chart saved presets",
    valueType: "json-object",
    defaultValue: "default printable chart presets",
    validatorName: "printablePresetJsonObjectNoPersistedLogoData",
    validate: validateJsonObjectMax(STORAGE_LIMITS.printableChartJsonMaxLength),
    sensitivity: "source text",
    clearBehaviors: ["reset settings", "clear source data", "clear all site data"],
    versionStrategy: "versioned key suffix v3; malformed JSON falls back to defaults",
    maxLength: STORAGE_LIMITS.printableChartJsonMaxLength,
    notes: "Mixed settings and worksheet text. Custom logo data URLs are removed before write.",
    normalizeForWrite: sanitizePrintablePresetsForStorage,
  },
  {
    key: STORAGE_KEYS.bookExportPreferences,
    routeScope: "book translator export preferences",
    valueType: "json-object",
    defaultValue: "Reader Quick Start audio preferences",
    validatorName: "bookExportPreferencesObject",
    validate: validateBookPreferences,
    sensitivity: "preference",
    clearBehaviors: ["reset settings", "clear all site data"],
    versionStrategy: "versioned key suffix v1; malformed or unknown fields are sanitized on read",
    maxLength: STORAGE_LIMITS.preferenceJsonMaxLength,
    notes: "Never stores raw book text, extracted text, Morse transcripts, uploaded files, audio, video, or ZIPs.",
    normalizeForWrite: normalizeJsonObjectMax(STORAGE_LIMITS.preferenceJsonMaxLength),
  },
  {
    key: STORAGE_KEYS.videoGeneratorPreferences,
    routeScope: "standalone video generator preferences",
    valueType: "json-object",
    defaultValue: "default video generator preferences",
    validatorName: "videoGeneratorPreferencesObject",
    validate: validateVideoGeneratorPreferences,
    sensitivity: "preference",
    clearBehaviors: ["reset settings", "clear all site data"],
    versionStrategy: "versioned key suffix v1; malformed or unknown fields are sanitized on read",
    maxLength: STORAGE_LIMITS.preferenceJsonMaxLength,
    notes: "Stores video/audio preferences only. Raw source text and generated WebM blobs are not persisted.",
    normalizeForWrite: normalizeJsonObjectMax(STORAGE_LIMITS.preferenceJsonMaxLength),
  },
  {
    key: STORAGE_KEYS.bookCacheIndex,
    routeScope: "approved Morse book JSON cache index",
    valueType: "json-object",
    defaultValue: "empty approved book cache index",
    validatorName: "bookCacheIndexObject",
    validate: validateJsonObjectMax(STORAGE_LIMITS.bookCacheIndexMaxLength),
    sensitivity: "cache",
    clearBehaviors: ["clear source data", "clear all site data"],
    versionStrategy:
      "versioned key plus whole-book cache keys containing slug, content version, and content hash",
    maxLength: STORAGE_LIMITS.bookCacheIndexMaxLength,
    notes:
      "Tracks approved cleaned whole-book JSON only. Raw source text and generated media are not cached.",
    normalizeForWrite: normalizeJsonObjectMax(STORAGE_LIMITS.bookCacheIndexMaxLength),
  },
  {
    key: STORAGE_KEYS.bookSectionCacheIndex,
    routeScope: "approved Morse book section cache index",
    valueType: "json-object",
    defaultValue: "empty approved section cache index",
    validatorName: "bookSectionCacheIndexObject",
    validate: validateJsonObjectMax(STORAGE_LIMITS.bookSectionCacheIndexMaxLength),
    sensitivity: "cache",
    clearBehaviors: ["clear source data", "clear all site data"],
    versionStrategy:
      "versioned key plus per-section cache keys containing slug, content version, and section id",
    maxLength: STORAGE_LIMITS.bookSectionCacheIndexMaxLength,
    notes:
      "Tracks approved cleaned section JSON only. Raw source text and generated media are not cached.",
    normalizeForWrite: normalizeJsonObjectMax(
      STORAGE_LIMITS.bookSectionCacheIndexMaxLength,
    ),
  },
  {
    key: "morsewords:generated-media:*",
    routeScope: "site-wide forbidden generated media",
    valueType: "forbidden",
    defaultValue: "",
    validatorName: "alwaysForbidden",
    validate: () => false,
    sensitivity: "generated media, forbidden",
    clearBehaviors: ["clear source data", "clear all site data"],
    versionStrategy: "forbidden storage pattern; generated files must remain blobs/downloads only",
    notes: "MP3, WAV, WebM, ZIP, uploaded audio, uploaded book files, and base64 media must never be written to Web Storage.",
    normalizeForWrite: () =>
      block("forbidden", "Generated media must not be stored in browser Web Storage."),
  },
] as const;

export function getStorageKeyDefinition(key: string) {
  return STORAGE_KEY_REGISTRY.find((definition) => definition.key === key);
}

export function getStorageKeysForClearBehavior(
  behavior: StorageClearBehavior,
) {
  return STORAGE_KEY_REGISTRY.filter(
    (definition) =>
      definition.valueType !== "forbidden" &&
      definition.clearBehaviors.includes(behavior),
  ).map((definition) => definition.key);
}

export function isForbiddenStorageKey(key: string) {
  const normalized = key.trim();
  return FORBIDDEN_MEDIA_KEY_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );
}

export function prepareStorageValueForWrite(
  key: string,
  value: string,
): StorageWritePolicyResult {
  if (isForbiddenStorageKey(key)) {
    return block(
      "forbidden",
      "Generated media and base64 media must not be stored in browser Web Storage.",
    );
  }

  const definition = getStorageKeyDefinition(key);
  if (!definition) return ok(value);
  if (definition.valueType === "forbidden") {
    return block(
      "forbidden",
      definition.notes ?? "This storage key is forbidden.",
    );
  }

  if (definition.normalizeForWrite) {
    return definition.normalizeForWrite(value);
  }
  return ok(value);
}

export function validateStorageRegistryValue(key: string, raw: string | null) {
  const definition = getStorageKeyDefinition(key);
  return definition ? definition.validate(raw) : true;
}
