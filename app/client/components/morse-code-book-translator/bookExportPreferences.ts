import {
  parseStoredJson,
  safeReadStorage,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";

import {
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "./bookExportPresets";
import type {
  BookExportSettings,
  BookOutputType,
} from "./bookExportTypes";
import {
  DEFAULT_BOOK_VIDEO_SETTINGS,
  sanitizeBookVideoSettings,
} from "./bookVideoTypes";
import type { BookVideoSettings } from "./bookVideoTypes";

export const BOOK_EXPORT_PREFERENCES_KEY =
  "morsewords:book-translator:preferences:v1";

export type BookExportPreferences = {
  outputType: BookOutputType;
  exportSettings: BookExportSettings;
  videoSettings: BookVideoSettings;
  advancedOpen: boolean;
};

const DEFAULT_BOOK_EXPORT_PREFERENCES: BookExportPreferences = {
  outputType: "audio",
  exportSettings: DEFAULT_BOOK_EXPORT_SETTINGS,
  videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
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
  const outputType =
    parsed.outputType === "video" || parsed.outputType === "audio"
      ? parsed.outputType
      : DEFAULT_BOOK_EXPORT_PREFERENCES.outputType;
  const videoSettings = sanitizeBookVideoSettings(
    isPlainObject(parsed.videoSettings) ? parsed.videoSettings : {},
  );

  return {
    outputType,
    exportSettings,
    videoSettings,
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
    outputType:
      preferences.outputType === "video" || preferences.outputType === "audio"
        ? preferences.outputType
        : DEFAULT_BOOK_EXPORT_PREFERENCES.outputType,
    exportSettings: sanitizeBookExportSettings(preferences.exportSettings),
    videoSettings: sanitizeBookVideoSettings(preferences.videoSettings),
    advancedOpen: Boolean(preferences.advancedOpen),
  };

  // Keep this payload intentionally small: never persist raw book text,
  // cleaned text, Morse transcripts, video frames, uploaded file contents,
  // or extracted metadata.
  return safeWriteStorage(BOOK_EXPORT_PREFERENCES_KEY, JSON.stringify(payload));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
