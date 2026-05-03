import * as React from "react";

export default function ToggleChip({
  label,
  active,
  onClick,
  title,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  const [hover, setHover] = React.useState(false);

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 8,
    border: active ? "1px solid #020617" : "1px solid #e2e8f0",
    background: active ? "#020617" : hover ? "#f0f9ff" : "#ffffff",
    color: active ? "#e0f2fe" : "#0f172a",
    fontWeight: 600,
    fontSize: ".9rem",
    cursor: "pointer",
    userSelect: "none",
    transition:
      "background 120ms ease, color 120ms ease, border-color 120ms ease, transform 120ms ease",
    transform: hover ? "translateY(-1px)" : "translateY(0)",
  };

  return (
    <button
      type="button"
      title={title}
      style={style}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={onClick}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {label}
    </button>
  );
}
