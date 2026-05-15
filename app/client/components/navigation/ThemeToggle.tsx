import { MoonIcon, ThemeSunIcon } from "~/client/assets/svg/Icons";
import { useThemeMode } from "~/client/theme/useThemeMode";
import type { ThemeMode } from "~/client/theme/themeStorage";

type ThemeToggleProps = {
  className?: string;
  initialTheme?: ThemeMode;
};

export default function ThemeToggle({
  className = "",
  initialTheme = "light",
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useThemeMode(initialTheme);
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const Icon = isDark ? ThemeSunIcon : MoonIcon;

  return (
    <button
      type="button"
      className={`mw-theme-toggle mw-nav-icon-button inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full ${className}`}
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
    >
      <Icon size={18} title={undefined} aria-hidden={true} />
    </button>
  );
}
