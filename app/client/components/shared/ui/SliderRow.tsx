import * as React from "react";

type SliderLabelTone = "slate" | "sky";

export default function SliderRow({
  className = "",
  disabled = false,
  help,
  icon,
  id,
  label,
  labelTone = "slate",
  max,
  min,
  onChange,
  quietInputFocus = false,
  step,
  unit,
  value,
}: {
  className?: string;
  disabled?: boolean;
  help?: string;
  icon?: React.ReactNode;
  id?: string;
  label: string;
  labelTone?: SliderLabelTone;
  max: number;
  min: number;
  onChange: (value: number) => void;
  quietInputFocus?: boolean;
  step: number;
  unit: string;
  value: number;
}) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const labelClassName =
    labelTone === "sky"
      ? "text-sm font-extrabold text-sky-950"
      : "text-sm font-semibold text-slate-700";

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className={labelClassName}>
          <span className="inline-flex items-center gap-1.5">
            {icon}
            {label}
          </span>
        </label>
        <span className="text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>
      {help ? <p className="mt-1 text-xs text-slate-500">{help}</p> : null}
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        className={`mt-2 w-full rounded-full ${quietInputFocus ? "focus:outline-none focus:ring-0 focus-visible:outline-none" : "mw-focus-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"} ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      />
    </div>
  );
}
