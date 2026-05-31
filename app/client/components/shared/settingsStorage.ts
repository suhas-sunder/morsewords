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

export function safeReadStorage(key: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeWriteStorage(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
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
