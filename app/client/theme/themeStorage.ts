export const THEME_STORAGE_KEY = "morsewords-theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type ThemeMode = "light" | "dark";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function readStoredThemeMode(): ThemeMode | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(value)) return value;
  } catch {
    // Fall back to the cookie below.
  }

  return readCookieThemeMode();
}

export function getAppliedThemeMode(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setRootThemeMode(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = mode;
}

export function writeStoredThemeMode(mode: ThemeMode) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Theme persistence is optional. The root attribute still updates.
  }

  writeCookieThemeMode(mode);
}

export function applyThemeMode(mode: ThemeMode) {
  setRootThemeMode(mode);
  writeStoredThemeMode(mode);
}

function readCookieThemeMode(): ThemeMode | null {
  if (typeof document === "undefined") return null;

  const prefix = `${THEME_STORAGE_KEY}=`;
  const item = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!item) return null;

  const value = decodeURIComponent(item.slice(prefix.length));
  return isThemeMode(value) ? value : null;
}

function writeCookieThemeMode(mode: ThemeMode) {
  if (typeof document === "undefined") return;

  document.cookie = `${THEME_STORAGE_KEY}=${encodeURIComponent(
    mode,
  )}; Max-Age=${THEME_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
}
