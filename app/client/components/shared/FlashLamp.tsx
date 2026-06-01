import * as React from "react";

type FlashLampProps = {
  active: boolean;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: {
    shell: "h-9 w-9",
    bulb: "h-4 w-4",
  },
  md: {
    shell: "h-12 w-12",
    bulb: "h-5 w-5",
  },
  lg: {
    shell: "h-28 w-28",
    bulb: "h-16 w-16",
  },
} as const;

export default function FlashLamp({
  active,
  disabled = false,
  label,
  size = "md",
  className,
}: FlashLampProps) {
  const lit = active && !disabled;
  const accessibleLabel =
    label ??
    (disabled
      ? "Morse flash lamp disabled"
      : lit
        ? "Morse flash lamp on"
        : "Morse flash lamp ready");
  const classes = sizeClasses[size];

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      data-testid="mw-flash-lamp"
      data-mw-flash-lamp=""
      data-active={lit ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      className={[
        "inline-flex shrink-0 items-center justify-center self-center text-slate-700",
        "transition-colors duration-75 motion-reduce:transition-none",
        disabled ? "opacity-60" : "",
        classes.shell,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "rounded-full transition-colors duration-75 motion-reduce:transition-none",
          lit ? "bg-[#38bdf8]" : "bg-slate-300",
          classes.bulb,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}
