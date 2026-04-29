import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

const base: React.CSSProperties = {
  borderRadius: 12,
  fontWeight: 800,
  padding: "10px 14px",
  cursor: "pointer",
  userSelect: "none",
  transition:
    "background 120ms ease, color 120ms ease, border-color 120ms ease, transform 120ms ease, filter 120ms ease",
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
    // Match the Audio page: neutral primary with a subtle sky accent.
    normal: {
      border: "1px solid #111827",
      background: "#111827",
      color: "#bae6fd",
    },
    hover: {
      background: "#0f172a",
      color: "#ffffff",
      transform: "translateY(-1px)",
    },
    disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  secondary: {
    normal: {
      border: "1px solid #d1d5db",
      background: "#ffffff",
      color: "#374151",
    },
    hover: { background: "#f9fafb", transform: "translateY(-1px)" },
    disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  ghost: {
    normal: {
      border: "1px solid #e5e7eb",
      background: "#ffffff",
      color: "#111827",
    },
    hover: { background: "#f9fafb", transform: "translateY(-1px)" },
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
  const v = variants[variant];

  const computed: React.CSSProperties = {
    ...base,
    ...v.normal,
    ...(hover && !disabled ? v.hover : null),
    ...(disabled ? v.disabled : null),
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
        (e.currentTarget as HTMLButtonElement).style.transform = hover && !disabled ? "translateY(-1px)" : "translateY(0)";
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
    >
      {children}
    </button>
  );
}
