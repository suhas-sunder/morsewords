import { MoonIcon, ThemeSunIcon } from "~/client/assets/svg/Icons";
import { useThemeMode } from "~/client/theme/useThemeMode";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useThemeMode();
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const Icon = isDark ? ThemeSunIcon : MoonIcon;

  return (
    <button
      type="button"
      className={`mw-theme-toggle inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full ${className}`}
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
    >
      <Icon size={18} title={undefined} aria-hidden={true} />
    </button>
  );
}
