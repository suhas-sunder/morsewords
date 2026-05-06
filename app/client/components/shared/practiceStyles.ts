import * as React from "react";

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "transparent",
    color: "#111317",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    margin: 0,
  },
  wrap: { maxWidth: 1120, margin: "0 auto", padding: "16px 24px 36px" },

  hero: {
    padding: "18px 0 10px",
    borderBottom: 0,
    marginBottom: 16,
  },
  h1: {
    fontSize: "clamp(2.25rem, 2.2vw + 1rem, 4rem)",
    lineHeight: 1.08,
    margin: 0,
    color: "#08324f",
    fontWeight: 900,
  },
  lead: {
    marginTop: 12,
    color: "#334155",
    fontSize: "1.08rem",
    lineHeight: 1.7,
    maxWidth: 760,
  },

  card: {
    background: "#fffdf8",
    border: 0,
    borderRadius: 16,
  },
  cardPad: { padding: 16 },
  section: { padding: "8px 0 24px" },
  sectionTitle: { fontSize: "1.35rem", margin: "0 0 12px" },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 16,
    alignItems: "start",
  },

  label: { fontSize: ".9rem", color: "#5a616c" },

  promptBox: {
    border: 0,
    borderRadius: 14,
    padding: 16,
    background: "#fffdf8",
  },
  promptKind: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: ".85rem",
    color: "#5a616c",
    marginBottom: 10,
  },
  promptMain: {
    font: '800 clamp(1.6rem, 2.2vw + 1rem, 2.6rem)/1.15 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
    letterSpacing: 0.4,
    margin: 0,
    wordBreak: "break-word",
  },
  promptHint: {
    marginTop: 12,
    color: "#5a616c",
    fontSize: ".92rem",
  },

  input: {
    width: "100%",
    minHeight: 44,
    padding: 10,
    border: 0,
    borderRadius: 10,
    background: "#fffdf8",
    color: "#111317",
    font: '650 1.05rem/1.1 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
  },

  row: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 12,
  },

  chipRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },

  note: { color: "#5a616c", fontSize: ".9rem" },

  status: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 12,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: ".9rem",
    fontWeight: 800,
    border: 0,
    background: "#fffdf8",
  },
  badgeGood: { borderColor: "#bae6fd", background: "#f0f9ff", color: "#082f49" },
  badgeBad: { borderColor: "#e2e8f0", background: "#fffdf8", color: "#334155" },
  badgeNeutral: { borderColor: "#e6e8ef", background: "#fff", color: "#111317" },

  footer: {
    color: "#5a616c",
    fontSize: ".9rem",
    textAlign: "center",
    padding: "28px 0",
  },
};

export default styles;
