import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

const base: React.CSSProperties = {
  borderRadius: 8,
  fontWeight: 600,
  padding: "10px 14px",
  cursor: "pointer",
  userSelect: "none",
  transition:
    "background 120ms ease, color 120ms ease, outline-color 120ms ease, transform 120ms ease",
};

const variants: Record<
  Variant,
  {
    normal: React.CSSProperties;
    hover: React.CSSProperties;
    disabled: React.CSSProperties;
  }
> = {
  primary: {
    normal: {
      border: 0,
      background: "#020617",
      color: "#e0f2fe",
    },
    hover: {
      background: "#0f172a",
      color: "#ffffff",
    },
    disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  secondary: {
    normal: {
      border: 0,
      background: "#fffdf8",
      color: "#0f172a",
    },
    hover: {
      background: "#0f172a",
      color: "#e0f2fe",
    },
    disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  ghost: {
    normal: {
      border: 0,
      background: "#fffaf2",
      color: "#0f172a",
    },
    hover: {
      background: "#0f172a",
      color: "#e0f2fe",
    },
    disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
};

export default function Button({
  children,
  variant = "primary",
  style,
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
}) {
  const [hover, setHover] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const v = variants[variant];

  const computed: React.CSSProperties = {
    ...base,
    ...v.normal,
    ...(hover && !disabled ? v.hover : null),
    ...(disabled ? v.disabled : null),
    ...(focusVisible && !disabled
      ? { outline: "2px solid #7dd3fc", outlineOffset: 2 }
      : null),
    ...style,
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      style={computed}
      onPointerDown={(e) => {
        // Keep the same "active" feel as the rest of the site.
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
        rest.onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        rest.onPointerUp?.(e);
      }}
      onPointerEnter={(e) => {
        setHover(true);
        rest.onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setHover(false);
        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        rest.onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        setFocusVisible(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocusVisible(false);
        rest.onBlur?.(e);
      }}
    >
      {children}
    </button>
  );
}
