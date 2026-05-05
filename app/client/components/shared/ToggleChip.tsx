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
  const [focusVisible, setFocusVisible] = React.useState(false);

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 8,
    border: 0,
    background: active ? "#020617" : hover ? "#0f172a" : "#fffdf8",
    color: active || hover ? "#e0f2fe" : "#0f172a",
    fontWeight: 600,
    fontSize: ".9rem",
    cursor: "pointer",
    userSelect: "none",
    outline: focusVisible ? "2px solid #7dd3fc" : "1px solid rgba(11, 36, 71, 0.18)",
    outlineOffset: focusVisible ? 2 : 0,
    transition:
      "background 120ms ease, color 120ms ease, transform 120ms ease",
    transform: "translateY(0)",
  };

  return (
    <button
      type="button"
      title={title}
      style={style}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={onClick}
      onFocus={() => {
        setHover(true);
        setFocusVisible(true);
      }}
      onBlur={() => {
        setHover(false);
        setFocusVisible(false);
      }}
    >
      {label}
    </button>
  );
}
