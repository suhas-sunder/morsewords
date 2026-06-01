import {
  parseStoredJson,
  safeReadStorage,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";

import {
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "./bookExportPresets";
import type { BookExportSettings } from "./bookExportTypes";

export const BOOK_EXPORT_PREFERENCES_KEY =
  "morsewords:book-translator:preferences:v1";

export type BookExportPreferences = {
  exportSettings: BookExportSettings;
  advancedOpen: boolean;
};

const DEFAULT_BOOK_EXPORT_PREFERENCES: BookExportPreferences = {
  exportSettings: DEFAULT_BOOK_EXPORT_SETTINGS,
  advancedOpen: false,
};

export function loadBookExportPreferences(): BookExportPreferences {
  const parsed = parseStoredJson<Partial<BookExportPreferences>>(
    safeReadStorage(BOOK_EXPORT_PREFERENCES_KEY),
    {},
    isPlainObject,
  );
  const exportSettings = sanitizeBookExportSettings(
    isPlainObject(parsed.exportSettings) ? parsed.exportSettings : {},
  );

  return {
    exportSettings,
    advancedOpen:
      typeof parsed.advancedOpen === "boolean"
        ? parsed.advancedOpen
        : DEFAULT_BOOK_EXPORT_PREFERENCES.advancedOpen,
  };
}

export function saveBookExportPreferences(
  preferences: BookExportPreferences,
): boolean {
  const payload: BookExportPreferences = {
    exportSettings: sanitizeBookExportSettings(preferences.exportSettings),
    advancedOpen: Boolean(preferences.advancedOpen),
  };

  // Keep this payload intentionally small: never persist raw book text,
  // cleaned text, Morse transcripts, uploaded file contents, or extracted metadata.
  return safeWriteStorage(BOOK_EXPORT_PREFERENCES_KEY, JSON.stringify(payload));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
