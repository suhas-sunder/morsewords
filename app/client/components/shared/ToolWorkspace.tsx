import * as React from "react";

import {
  HERO_EYEBROW_LINE_CLASS,
  HERO_EYEBROW_ROW_CLASS,
  HERO_EYEBROW_TEXT_CLASS,
  HERO_HEADER_CLASS,
  HERO_LEAD_CLASS,
  HERO_TITLE_CLASS,
} from "./heroStyles";

export const HOME_TOOL_EXAMPLES = [
  "I love Morse code",
  "HELLO WORLD",
  "CQ",
  "SOS",
  "TEST 123",
];

export const TOOL_SPACING_HELPER =
  "3 spaces = letters · 7 = words · / = word break";

const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

export function toolControlButtonClass({
  active = false,
  tone = "light",
  disabled = false,
  size = "md",
  full = false,
  rounded = "lg",
}: {
  active?: boolean;
  tone?: "light" | "dark" | "darkPanel";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  full?: boolean;
  rounded?: "lg" | "xl" | "full";
} = {}) {
  const sizeClass =
    size === "lg"
      ? "min-h-12 px-4 py-2"
      : size === "sm"
        ? "min-h-10 px-3 py-1.5 text-sm"
        : "min-h-11 px-4 py-2 text-sm";
  const roundedClass =
    rounded === "full"
      ? "rounded-full"
      : rounded === "xl"
        ? "rounded-xl"
        : "rounded-lg";
  const enabledClass = active
    ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
    : tone === "dark"
      ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
      : tone === "darkPanel"
        ? "bg-slate-700/95 text-slate-100 hover:bg-slate-800 hover:text-white"
        : "bg-[#fffdf8] text-slate-900 hover:bg-[#fffaf2] hover:text-sky-950";
  const disabledClass =
    tone === "darkPanel"
      ? "cursor-not-allowed bg-slate-800/60 text-slate-500"
      : "cursor-not-allowed bg-white/55 text-slate-400";

  return [
    "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-[background-color,border-color,color] duration-100 ease-out",
    focusClass,
    sizeClass,
    roundedClass,
    full ? "w-full" : "",
    disabled ? disabledClass : enabledClass,
  ]
    .filter(Boolean)
    .join(" ");
}

export function ToolHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  lead: React.ReactNode;
}) {
  return (
    <div className={HERO_HEADER_CLASS}>
      <div className={HERO_EYEBROW_ROW_CLASS}>
        <span className={HERO_EYEBROW_LINE_CLASS} />
        <span className={HERO_EYEBROW_TEXT_CLASS}>{eyebrow}</span>
      </div>
      <h1 className={HERO_TITLE_CLASS}>{title}</h1>
      <p className={HERO_LEAD_CLASS}>{lead}</p>
    </div>
  );
}

export function ToolButton({
  active = false,
  tone = "light",
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  tone?: "light" | "dark" | "darkPanel";
}) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={[
        toolControlButtonClass({ active, tone, disabled }),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

export function ToolModeButton({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <ToolButton
      {...props}
      active={active}
      className={["text-sm", props.className].filter(Boolean).join(" ")}
    >
      {children}
    </ToolButton>
  );
}

export function ToolSampleButtons({
  examples = HOME_TOOL_EXAMPLES,
  onPick,
}: {
  examples?: string[];
  onPick: (example: string) => void;
}) {
  return (
    <>
      {examples.map((example) => (
        <button
          type="button"
          key={example}
          onClick={() => onPick(example)}
          className={`${toolControlButtonClass({
            size: "sm",
            rounded: "full",
          })}`}
        >
          Try &ldquo;{example}&rdquo;
        </button>
      ))}
    </>
  );
}

export function ToolPanel({
  label,
  badge,
  children,
  footer,
  className = "",
}: {
  label: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["overflow-hidden rounded-xl bg-white/88", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="text-sm font-extrabold text-sky-950">{label}</div>
        {badge ? (
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
      {footer ? (
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function ToolTextarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "min-h-[10rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0 focus-visible:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export function ToolOutputPanel({
  label,
  badge = "Result",
  children,
  footer,
  className = "",
}: {
  label: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["overflow-hidden rounded-xl bg-slate-950", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h2 className="text-sm font-extrabold text-slate-200">{label}</h2>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
          {badge}
        </span>
      </div>
      {children}
      {footer ? (
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
