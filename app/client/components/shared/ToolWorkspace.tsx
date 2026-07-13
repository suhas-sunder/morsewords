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
  "mw-focus-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

export function toolControlButtonClass({
  active = false,
  tone = "light",
  disabled = false,
  hover = "soft",
  size = "md",
  full = false,
  rounded = "lg",
}: {
  active?: boolean;
  tone?: "light" | "dark" | "darkPanel";
  disabled?: boolean;
  hover?: "soft" | "dark";
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
    ? "mw-button-primary"
    : tone === "dark"
      ? "mw-button-primary"
      : tone === "darkPanel"
        ? "mw-button-dark-panel"
        : "mw-button-secondary";
  const disabledClass =
    tone === "darkPanel"
      ? "mw-button-dark-panel-disabled cursor-not-allowed"
      : "mw-button-disabled-light cursor-not-allowed";

  return [
    "mw-button-outline inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-[background-color,border-color,color] duration-100 ease-out",
    !active && tone === "light" && !disabled
      ? hover === "dark"
        ? "mw-button-secondary-dark-hover"
        : "mw-light-interactive-link"
      : "",
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
  hover = "soft",
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  tone?: "light" | "dark" | "darkPanel";
  hover?: "soft" | "dark";
}) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={[
        toolControlButtonClass({ active, tone, disabled, hover }),
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
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
  hover?: "soft" | "dark";
}) {
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
  hover = "soft",
  onPick,
}: {
  examples?: string[];
  hover?: "soft" | "dark";
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
            hover,
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
      className={["mw-input-panel overflow-hidden rounded-xl bg-white/88", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="mw-heading text-sm font-extrabold text-sky-950">{label}</div>
        {badge ? (
          <span className="mw-muted-label font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
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
        "mw-input-text mw-input-placeholder min-h-[10rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0 focus-visible:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

/**
 * Read-only results use an explicit Copy action. Clear native selection without
 * preventing focus, keyboard navigation, scrolling, or textarea resizing.
 */
export function ToolOutputTextarea({
  className = "",
  onFocus,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onMouseDown,
  onMouseUp,
  onClick,
  onSelect,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const clearSelection = (element: HTMLTextAreaElement) => {
    const cursor = element.value.length;
    element.setSelectionRange(cursor, cursor);
  };
  const clearSelectionAfterNativePointerWork = (element: HTMLTextAreaElement) => {
    clearSelection(element);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => clearSelection(element));
    }
  };
  const isResizeGrip = (event: React.PointerEvent<HTMLTextAreaElement>) => {
    if (event.pointerType !== "mouse") return false;
    const rect = event.currentTarget.getBoundingClientRect();
    return rect.right - event.clientX < 20 && rect.bottom - event.clientY < 20;
  };
  const isMouseResizeGrip = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return rect.right - event.clientX < 20 && rect.bottom - event.clientY < 20;
  };

  return (
    <textarea
      {...props}
      readOnly
      className={[
        "mw-output-text mw-input-placeholder min-h-[10rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-sky-100 outline-none placeholder:text-slate-400 focus:ring-0 focus-visible:outline-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onFocus={(event) => {
        clearSelection(event.currentTarget);
        onFocus?.(event);
      }}
      onPointerDown={(event) => {
        clearSelection(event.currentTarget);
        if (!isResizeGrip(event)) {
          event.currentTarget.focus({ preventScroll: true });
          event.preventDefault();
        }
        onPointerDown?.(event);
      }}
      onPointerMove={(event) => {
        clearSelection(event.currentTarget);
        onPointerMove?.(event);
      }}
      onMouseDown={(event) => {
        clearSelection(event.currentTarget);
        if (!isMouseResizeGrip(event)) {
          event.currentTarget.focus({ preventScroll: true });
          event.preventDefault();
        }
        onMouseDown?.(event);
      }}
      onPointerUp={(event) => {
        clearSelectionAfterNativePointerWork(event.currentTarget);
        onPointerUp?.(event);
      }}
      onMouseUp={(event) => {
        clearSelectionAfterNativePointerWork(event.currentTarget);
        onMouseUp?.(event);
      }}
      onClick={(event) => {
        clearSelectionAfterNativePointerWork(event.currentTarget);
        onClick?.(event);
      }}
      onSelect={(event) => {
        clearSelectionAfterNativePointerWork(event.currentTarget);
        onSelect?.(event);
      }}
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
      className={["mw-panel-dark mw-output-panel mw-noneditable-output overflow-hidden rounded-xl bg-slate-950", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h2 className="mw-output-soft text-sm font-extrabold text-slate-200">{label}</h2>
        <span className="mw-output-muted font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
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
