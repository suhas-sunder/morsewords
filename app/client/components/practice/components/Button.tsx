import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";

const base: React.CSSProperties = {
  borderRadius: 10,
  fontWeight: 800,
  padding: "10px 14px",
  cursor: "pointer",
  userSelect: "none",
  transition: "filter 120ms ease, transform 120ms ease, background 120ms ease",
};

const variants: Record<Variant, { normal: React.CSSProperties; hover: React.CSSProperties; disabled: React.CSSProperties }> = {
  primary: {
    normal: { border: "1px solid #0b2447", background: "#0b2447", color: "#fff" },
    hover: { filter: "brightness(1.06)", transform: "translateY(-1px)" },
    disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  secondary: {
    normal: { border: "1px solid #0b2447", background: "#fff", color: "#0b2447" },
    hover: { background: "#f1f4fb", transform: "translateY(-1px)" },
    disabled: { opacity: 0.55, cursor: "not-allowed" },
  },
  ghost: {
    normal: { border: "1px solid #e6e8ef", background: "#eeeee", color: "#111317" },
    hover: { background: "#f5f7fb", transform: "translateY(-1px)" },
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
      onPointerEnter={(e) => {
        setHover(true);
        rest.onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setHover(false);
        rest.onPointerLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}
