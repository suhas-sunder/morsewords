import * as React from "react";

import { SmartSettingsIcon } from "~/client/assets/svg/Icons";
import { useDisplaySettings } from "~/client/settings/displaySettings";

type DisplaySettingsToggleProps = {
  className?: string;
  onOpen?: () => void;
};

export default function DisplaySettingsToggle({
  className = "",
  onOpen,
}: DisplaySettingsToggleProps) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const {
    disableFlashEffects,
    fullPageFlash,
    setDisableFlashEffects,
    setFullPageFlash,
    setShowAmbientMorse,
    showAmbientMorse,
  } = useDisplaySettings();

  React.useEffect(() => {
    if (!open) return;

    function onDocMouseDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (target && wrapperRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onDocKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open]);

  function toggleOpen() {
    setOpen((currentOpen) => {
      const nextOpen = !currentOpen;
      if (nextOpen) onOpen?.();
      return nextOpen;
    });
  }

  return (
    <div ref={wrapperRef} className="relative inline-flex shrink-0">
      <button
        type="button"
        className={`mw-nav-icon-button inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full ${className}`}
        onClick={toggleOpen}
        aria-label={open ? "Close display settings" : "Open display settings"}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <SmartSettingsIcon size={24} title={undefined} aria-hidden={true} />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Display settings"
          className="mw-display-settings-panel fixed left-4 right-4 top-20 z-[10000] w-auto rounded-2xl p-4 text-sky-100 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[min(20rem,calc(100vw-2rem))]"
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-sky-200/75">
            Display settings
          </p>

          <div className="mt-3 grid gap-2">
            <SettingsSwitch
              checked={showAmbientMorse}
              label="Show Morse background text"
              description="Controls only the decorative side text."
              onChange={setShowAmbientMorse}
            />
            <SettingsSwitch
              checked={fullPageFlash}
              label="Flash whole page"
              description="Adds the full-page flash when Flash Light is on."
              onChange={setFullPageFlash}
            />
            <SettingsSwitch
              checked={disableFlashEffects}
              label="Disable flashing light effects"
              description="Turns off visual flash while keeping audio available."
              onChange={setDisableFlashEffects}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SettingsSwitch({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (nextChecked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="mw-display-settings-switch flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-3 text-left"
    >
      <span className="min-w-0">
        <span className="block text-sm font-extrabold text-current">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-snug text-sky-100/70">
          {description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="mw-display-settings-track relative inline-flex h-6 w-11 shrink-0 rounded-full"
      >
        <span
          className={
            "mw-display-settings-thumb absolute top-1 h-4 w-4 rounded-full transition-transform " +
            (checked ? "translate-x-6" : "translate-x-1")
          }
        />
      </span>
    </button>
  );
}
