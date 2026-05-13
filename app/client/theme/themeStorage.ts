export const THEME_STORAGE_KEY = "morsewords-theme";

export type ThemeMode = "light" | "dark";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function readStoredThemeMode(): ThemeMode | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(value) ? value : null;
  } catch {
    return null;
  }
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
}

export function applyThemeMode(mode: ThemeMode) {
  setRootThemeMode(mode);
  writeStoredThemeMode(mode);
}
