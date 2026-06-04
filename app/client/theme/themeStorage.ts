import {
  safeRemoveStorage,
  safeReadStorage,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";
import { STORAGE_KEYS } from "~/client/components/shared/storageRegistry";

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const THEME_MODE_EVENT = "morsewords:theme-mode-change";

export type ThemeMode = "light" | "dark";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function readStoredThemeMode(): ThemeMode | null {
  const value = safeReadStorage(THEME_STORAGE_KEY);
  if (isThemeMode(value)) return value;

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
  safeWriteStorage(THEME_STORAGE_KEY, mode);
  writeCookieThemeMode(mode);
}

export function applyThemeMode(mode: ThemeMode) {
  setRootThemeMode(mode);
  writeStoredThemeMode(mode);
  dispatchThemeModeChange(mode);
}

export function clearStoredThemeMode() {
  safeRemoveStorage(THEME_STORAGE_KEY);
  expireCookieThemeMode();
}

export function resetThemeModeToDefault() {
  clearStoredThemeMode();
  setRootThemeMode("light");
  dispatchThemeModeChange("light");
}

export function subscribeThemeModeChanges(
  callback: (mode: ThemeMode) => void,
) {
  if (typeof window === "undefined") return () => {};

  const handleThemeChange = (event: Event) => {
    const mode = (event as CustomEvent<ThemeMode>).detail;
    if (isThemeMode(mode)) callback(mode);
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    callback(readStoredThemeMode() ?? "light");
  };

  window.addEventListener(THEME_MODE_EVENT, handleThemeChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_MODE_EVENT, handleThemeChange);
    window.removeEventListener("storage", handleStorage);
  };
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

function expireCookieThemeMode() {
  if (typeof document === "undefined") return;
  document.cookie = `${THEME_STORAGE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function dispatchThemeModeChange(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_MODE_EVENT, { detail: mode }));
}
