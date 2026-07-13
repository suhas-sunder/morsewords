import * as React from "react";

import { EqualizerIcon } from "~/client/assets/svg/Icons";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";

/** Placement-neutral disclosure control for secondary synthesis and export settings. */
export default function AdvancedSettingsToggle({
  className = "",
  disabled = false,
  onToggle,
  open,
}: {
  className?: string;
  disabled?: boolean;
  onToggle: () => void;
  open: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-expanded={open}
      className={[
        toolControlButtonClass({ disabled, full: true, hover: "dark" }),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid="advanced-settings-toggle"
    >
      <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
      {open ? "Hide advanced settings" : "Show advanced settings"}
    </button>
  );
}
