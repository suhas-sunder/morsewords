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
    borderRadius: 999,
    border: active ? "1px solid #111827" : "1px solid #e5e7eb",
    background: active ? "#111827" : hover ? "#f9fafb" : "#eee",
    color: active ? "#b8e6fe" : "#111827",
    fontWeight: 800,
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
    >
      {label}
    </button>
  );
}
