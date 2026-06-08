import {
  BOOK_CACHE_KEY_PREFIX,
  BOOK_SECTION_CACHE_KEY_PREFIX,
  STORAGE_KEYS,
  getStorageKeysForClearBehavior,
  prepareStorageValueForWrite,
  type StorageClearBehavior,
  type StorageWriteBlockReason,
} from "~/client/components/shared/storageRegistry";

export type StoredNumberOptions = {
  fallback: number;
  min?: number;
  max?: number;
  integer?: boolean;
  selfHeal?: boolean;
};

export type StoredStringOptions = {
  allowEmpty?: boolean;
  maxLength?: number;
  selfHeal?: boolean;
};

export type StoredReadOptions = {
  selfHeal?: boolean;
};

export type SafeWriteStorageResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | StorageWriteBlockReason
        | "unavailable"
        | "quota-exceeded"
        | "unknown";
      message: string;
      maxLength?: number;
    };

export type StorageClearResult = {
  removedKeys: string[];
  failedKeys: string[];
};

export function safeReadStorage(key: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeWriteStorageResult(
  key: string,
  value: string,
): SafeWriteStorageResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      reason: "unavailable",
      message: "Browser storage is unavailable during server rendering.",
    };
  }

  const prepared = prepareStorageValueForWrite(key, value);
  if (!prepared.ok) {
    return {
      ok: false,
      reason: prepared.reason,
      message: prepared.message,
      maxLength: prepared.maxLength,
    };
  }

  try {
    window.localStorage.setItem(key, prepared.value);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: isQuotaExceededError(error) ? "quota-exceeded" : "unknown",
      message: isQuotaExceededError(error)
        ? "Browser storage quota is full. The current tool can continue, but this value was not saved."
        : "Browser storage could not save this value.",
    };
  }
}

export function safeWriteStorage(key: string, value: string): boolean {
  return safeWriteStorageResult(key, value).ok;
}

export function sourceStorageWriteMessage(
  results: SafeWriteStorageResult[],
) {
  const blocked = results.find((result) => !result.ok);
  if (!blocked || blocked.ok) return "";

  if (blocked.reason === "too-large") {
    return blocked.message;
  }
  if (blocked.reason === "quota-exceeded") {
    return "Browser storage is full, so this source was not saved locally. Conversion and downloads can continue.";
  }
  if (blocked.reason === "forbidden") {
    return "Generated media is never saved to browser storage.";
  }
  return "This source could not be saved locally, but the tool can continue.";
}

export function safeRemoveStorage(key: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function clearMorseWordsStorageByBehavior(
  behavior: StorageClearBehavior,
): StorageClearResult {
  const result: StorageClearResult = {
    removedKeys: [],
    failedKeys: [],
  };
  const dynamicBookSectionCacheKeys =
    behavior === "clear source data" || behavior === "clear all site data"
      ? getDynamicBookSectionCacheKeys()
      : [];
  const dynamicBookCacheKeys =
    behavior === "clear source data" || behavior === "clear all site data"
      ? getDynamicBookCacheKeys()
      : [];

  for (const key of getStorageKeysForClearBehavior(behavior)) {
    if (safeRemoveStorage(key)) {
      result.removedKeys.push(key);
    } else {
      result.failedKeys.push(key);
    }
  }

  if (behavior === "clear source data" || behavior === "clear all site data") {
    for (const key of dynamicBookCacheKeys) {
      if (safeRemoveStorage(key)) {
        result.removedKeys.push(key);
      } else {
        result.failedKeys.push(key);
      }
    }
    for (const key of dynamicBookSectionCacheKeys) {
      if (safeRemoveStorage(key)) {
        result.removedKeys.push(key);
      } else {
        result.failedKeys.push(key);
      }
    }
  }

  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function" &&
    typeof CustomEvent !== "undefined"
  ) {
    window.dispatchEvent(
      new CustomEvent<StorageClearResult>("morsewords:storage-clear", {
        detail: result,
      }),
    );
  }

  return result;
}

export function clearMorseWordsSourceData() {
  return clearMorseWordsStorageByBehavior("clear source data");
}

export function clearMorseWordsBookCacheData(): StorageClearResult {
  const result: StorageClearResult = {
    removedKeys: [],
    failedKeys: [],
  };
  for (const key of [
    STORAGE_KEYS.bookCacheIndex,
    STORAGE_KEYS.bookSectionCacheIndex,
    ...getDynamicBookCacheKeys(),
    ...getDynamicBookSectionCacheKeys(),
  ]) {
    if (safeRemoveStorage(key)) {
      result.removedKeys.push(key);
    } else {
      result.failedKeys.push(key);
    }
  }
  return result;
}

export function resetMorseWordsSettings() {
  return clearMorseWordsStorageByBehavior("reset settings");
}

export function clearAllMorseWordsSiteData() {
  return clearMorseWordsStorageByBehavior("clear all site data");
}

export function parseStoredJson<T>(
  raw: string | null,
  fallback: T,
  validate?: (value: unknown) => value is T,
): T {
  if (raw === null || raw.trim() === "") return fallback;

  try {
    const parsed: unknown = JSON.parse(raw);
    return validate && !validate(parsed) ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function clampNumber(value: unknown, min: number, max: number): number {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : NaN;

  if (!Number.isFinite(numeric)) return low;
  return Math.min(high, Math.max(low, numeric));
}

export function readStoredBoolean(
  key: string,
  fallback: boolean,
  options: StoredReadOptions = {},
): boolean {
  const raw = safeReadStorage(key);
  if (raw === null) return fallback;

  const normalized = raw.trim().toLowerCase();
  if (normalized === "1" || normalized === "true") return true;
  if (normalized === "0" || normalized === "false") return false;

  if (options.selfHeal) safeWriteStorage(key, fallback ? "1" : "0");
  return fallback;
}

export function readStoredNumber(
  key: string,
  options: StoredNumberOptions,
): number {
  const raw = safeReadStorage(key);
  if (raw === null || raw.trim() === "") {
    return normalizeStoredNumber(options.fallback, options);
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    const fallback = normalizeStoredNumber(options.fallback, options);
    if (options.selfHeal) safeWriteStorage(key, String(fallback));
    return fallback;
  }

  const normalized = normalizeStoredNumber(parsed, options);
  if (options.selfHeal && normalized !== parsed) {
    safeWriteStorage(key, String(normalized));
  }
  return normalized;
}

export function readStoredString(
  key: string,
  fallback: string,
  options: StoredStringOptions = {},
): string {
  const raw = safeReadStorage(key);
  if (raw === null) return normalizeStoredString(fallback, options);
  if (options.allowEmpty === false && raw.trim() === "") {
    const normalizedFallback = normalizeStoredString(fallback, options);
    if (options.selfHeal) safeWriteStorage(key, normalizedFallback);
    return normalizedFallback;
  }

  const normalized = normalizeStoredString(raw, options);
  if (options.selfHeal && normalized !== raw) {
    safeWriteStorage(key, normalized);
  }
  return normalized;
}

export function readStoredEnum<const T extends readonly string[]>(
  key: string,
  allowed: T,
  fallback: T[number],
  options: StoredReadOptions = {},
): T[number] {
  const raw = safeReadStorage(key);
  const value = raw?.trim();
  if (value && allowed.includes(value as T[number])) return value as T[number];

  if (raw !== null && options.selfHeal) safeWriteStorage(key, fallback);
  return fallback;
}

export function readStoredNumberEnum<const T extends readonly number[]>(
  key: string,
  allowed: T,
  fallback: T[number],
  options: StoredReadOptions = {},
): T[number] {
  const raw = safeReadStorage(key);
  const value = raw === null || raw.trim() === "" ? NaN : Number(raw);
  if (Number.isFinite(value) && allowed.includes(value as T[number])) {
    return value as T[number];
  }

  if (raw !== null && options.selfHeal) safeWriteStorage(key, String(fallback));
  return fallback;
}

function normalizeStoredNumber(
  value: number,
  { min, max, integer }: StoredNumberOptions,
) {
  const fallback = Number.isFinite(value) ? value : 0;
  const bounded =
    typeof min === "number" || typeof max === "number"
      ? clampNumber(
          fallback,
          typeof min === "number" ? min : Number.NEGATIVE_INFINITY,
          typeof max === "number" ? max : Number.POSITIVE_INFINITY,
        )
      : fallback;

  return integer ? Math.round(bounded) : bounded;
}

function normalizeStoredString(
  value: string,
  { allowEmpty = true, maxLength }: StoredStringOptions,
) {
  const next = allowEmpty || value.trim() !== "" ? value : "";
  const limited =
    typeof maxLength === "number" && maxLength >= 0
      ? next.slice(0, maxLength)
      : next;

  if (allowEmpty || limited.trim() !== "") return limited;
  return "";
}

function isQuotaExceededError(error: unknown) {
  return (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED")
  );
}

function getDynamicBookSectionCacheKeys() {
  return getDynamicCacheKeys(
    STORAGE_KEYS.bookSectionCacheIndex,
    BOOK_SECTION_CACHE_KEY_PREFIX,
  );
}

function getDynamicBookCacheKeys() {
  return getDynamicCacheKeys(STORAGE_KEYS.bookCacheIndex, BOOK_CACHE_KEY_PREFIX);
}

function getDynamicCacheKeys(indexKey: string, keyPrefix: string) {
  if (typeof window === "undefined") return [];
  const keys = new Set<string>();
  try {
    const rawIndex = window.localStorage.getItem(indexKey);
    const parsed: unknown = rawIndex ? JSON.parse(rawIndex) : null;
    const entries =
      parsed && typeof parsed === "object" && "entries" in parsed
        ? (parsed as { entries?: unknown }).entries
        : null;
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (
          entry &&
          typeof entry === "object" &&
          "key" in entry &&
          typeof entry.key === "string" &&
          entry.key.startsWith(keyPrefix)
        ) {
          keys.add(entry.key);
        }
      }
    }
  } catch {
    // Cache cleanup is best-effort; fall through to storage enumeration.
  }

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith(keyPrefix)) {
        keys.add(key);
      }
    }
  } catch {
    return Array.from(keys);
  }
  return Array.from(keys);
}
