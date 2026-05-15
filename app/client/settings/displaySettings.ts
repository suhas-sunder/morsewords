import * as React from "react";

export const SHOW_AMBIENT_MORSE_STORAGE_KEY =
  "morsewords-show-ambient-morse";
export const DISABLE_FLASH_EFFECTS_STORAGE_KEY =
  "morsewords-disable-flash-effects";

export type DisplaySettings = {
  showAmbientMorse: boolean;
  disableFlashEffects: boolean;
};

const DISPLAY_SETTINGS_EVENT = "morsewords:display-settings-change";

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  showAmbientMorse: true,
  disableFlashEffects: false,
};

function readStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    if (value === "1" || value === "true") return true;
    if (value === "0" || value === "false") return false;
    return fallback;
  } catch {
    return fallback;
  }
}

function writeStoredBoolean(key: string, value: boolean) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // Display settings are optional. The root dataset still updates.
  }
}

export function readDisplaySettings(): DisplaySettings {
  return {
    showAmbientMorse: readStoredBoolean(
      SHOW_AMBIENT_MORSE_STORAGE_KEY,
      DEFAULT_DISPLAY_SETTINGS.showAmbientMorse,
    ),
    disableFlashEffects: readStoredBoolean(
      DISABLE_FLASH_EFFECTS_STORAGE_KEY,
      DEFAULT_DISPLAY_SETTINGS.disableFlashEffects,
    ),
  };
}

export function getAppliedDisplaySettings(): DisplaySettings {
  if (typeof document === "undefined") return DEFAULT_DISPLAY_SETTINGS;

  const root = document.documentElement.dataset;

  return {
    showAmbientMorse: root.ambientMorse === "hidden" ? false : true,
    disableFlashEffects: root.flashEffects === "disabled",
  };
}

export function setRootDisplaySettings(settings: DisplaySettings) {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.ambientMorse = settings.showAmbientMorse
    ? "visible"
    : "hidden";
  document.documentElement.dataset.flashEffects = settings.disableFlashEffects
    ? "disabled"
    : "enabled";
}

export function writeDisplaySettings(settings: DisplaySettings) {
  writeStoredBoolean(
    SHOW_AMBIENT_MORSE_STORAGE_KEY,
    settings.showAmbientMorse,
  );
  writeStoredBoolean(
    DISABLE_FLASH_EFFECTS_STORAGE_KEY,
    settings.disableFlashEffects,
  );
}

export function applyDisplaySettings(settings: DisplaySettings) {
  setRootDisplaySettings(settings);
  writeDisplaySettings(settings);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<DisplaySettings>(DISPLAY_SETTINGS_EVENT, {
        detail: settings,
      }),
    );
  }
}

export function areFlashEffectsDisabled() {
  if (typeof document !== "undefined") {
    return document.documentElement.dataset.flashEffects === "disabled";
  }

  return readDisplaySettings().disableFlashEffects;
}

export function useDisplaySettings() {
  const [settings, setSettingsState] = React.useState<DisplaySettings>(
    DEFAULT_DISPLAY_SETTINGS,
  );

  React.useEffect(() => {
    const initialSettings = readDisplaySettings();
    setRootDisplaySettings(initialSettings);
    setSettingsState(initialSettings);

    const handleSettingsChange = (event: Event) => {
      const nextSettings = (event as CustomEvent<DisplaySettings>).detail;
      if (nextSettings) setSettingsState(nextSettings);
    };

    const handleStorage = (event: StorageEvent) => {
      if (
        event.key !== SHOW_AMBIENT_MORSE_STORAGE_KEY &&
        event.key !== DISABLE_FLASH_EFFECTS_STORAGE_KEY
      ) {
        return;
      }

      const nextSettings = readDisplaySettings();
      setRootDisplaySettings(nextSettings);
      setSettingsState(nextSettings);
    };

    window.addEventListener(DISPLAY_SETTINGS_EVENT, handleSettingsChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(DISPLAY_SETTINGS_EVENT, handleSettingsChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const setDisplaySettings = React.useCallback(
    (
      next:
        | Partial<DisplaySettings>
        | ((current: DisplaySettings) => Partial<DisplaySettings>),
    ) => {
      setSettingsState((currentSettings) => {
        const patch =
          typeof next === "function" ? next(currentSettings) : next;
        const nextSettings = { ...currentSettings, ...patch };
        applyDisplaySettings(nextSettings);
        return nextSettings;
      });
    },
    [],
  );

  const setShowAmbientMorse = React.useCallback(
    (showAmbientMorse: boolean) => {
      setDisplaySettings({ showAmbientMorse });
    },
    [setDisplaySettings],
  );

  const setDisableFlashEffects = React.useCallback(
    (disableFlashEffects: boolean) => {
      setDisplaySettings({ disableFlashEffects });
    },
    [setDisplaySettings],
  );

  return {
    ...settings,
    setDisplaySettings,
    setShowAmbientMorse,
    setDisableFlashEffects,
  };
}
