import * as React from "react";

import {
  applyThemeMode,
  getAppliedThemeMode,
  readStoredThemeMode,
  setRootThemeMode,
  subscribeThemeModeChanges,
  type ThemeMode,
} from "./themeStorage";

export function useThemeMode(initialTheme: ThemeMode = "light") {
  const [theme, setTheme] = React.useState<ThemeMode>(initialTheme);

  React.useEffect(() => {
    const initialTheme = readStoredThemeMode() ?? getAppliedThemeMode();
    setRootThemeMode(initialTheme);
    setTheme(initialTheme);
    return subscribeThemeModeChanges((nextTheme) => {
      setRootThemeMode(nextTheme);
      setTheme(nextTheme);
    });
  }, []);

  const setThemeMode = React.useCallback((nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    applyThemeMode(nextTheme);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyThemeMode(nextTheme);
      return nextTheme;
    });
  }, []);

  return {
    theme,
    isDark: theme === "dark",
    setThemeMode,
    toggleTheme,
  };
}
