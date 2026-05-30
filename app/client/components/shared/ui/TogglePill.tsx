import * as React from "react";

import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";

type TogglePillRounded = "lg" | "xl" | "full";
type TogglePillSize = "sm" | "md" | "lg";
type TogglePillHover = "soft" | "dark";

export default function TogglePill({
  checked,
  className = "",
  describedBy,
  disabled = false,
  hover = "dark",
  icon,
  label,
  onChange,
  rounded = "full",
  size = "sm",
}: {
  checked: boolean;
  className?: string;
  describedBy?: string;
  disabled?: boolean;
  hover?: TogglePillHover;
  icon?: React.ReactNode;
  label: string;
  onChange: (value: boolean) => void;
  rounded?: TogglePillRounded;
  size?: TogglePillSize;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      disabled={disabled}
      className={[
        toolControlButtonClass({
          active: checked,
          disabled,
          hover,
          rounded,
          size,
        }),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={checked}
      aria-describedby={describedBy}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
