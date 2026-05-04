import * as React from "react";

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "transparent",
    color: "#111317",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    margin: 0,
  },
  wrap: { maxWidth: 1120, margin: "0 auto", padding: "16px 24px 32px" },

  hero: {
    padding: "18px 0 10px",
    borderBottom: 0,
    marginBottom: 16,
  },
  h1: {
    fontSize: "clamp(2.25rem, 4vw + 1rem, 4rem)",
    lineHeight: 1.05,
    margin: 0,
    color: "#08324f",
    fontWeight: 900,
  },
  lead: {
    marginTop: 10,
    maxWidth: 760,
    color: "#334155",
    fontSize: "1.08rem",
    lineHeight: 1.7,
  },

  card: {
    background: "rgba(255, 253, 248, 0.78)",
    border: 0,
    borderRadius: 14,
    boxShadow: "none",
    outline: "1px solid rgba(11,36,71,0.08)",
    outlineOffset: -1,
  },
  cardPad: { padding: 18 },
  section: { padding: "14px 0 30px" },
  sectionTitle: {
    fontSize: "1.45rem",
    margin: "0 0 12px",
    color: "#08324f",
    fontWeight: 900,
  },

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
    background: "rgba(255, 253, 248, 0.82)",
    outline: "1px solid rgba(11, 36, 71, 0.1)",
    outlineOffset: -1,
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
    border: "1px solid rgba(11, 36, 71, 0.12)",
    borderRadius: 12,
    background: "rgba(255, 253, 248, 0.9)",
    color: "#0f172a",
    outline: "1px solid rgba(11,36,71,0.1)",
    outlineOffset: -1,
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
    background: "#fffaf2",
  },
  badgeGood: { background: "#e0f2fe", color: "#082f49" },
  badgeBad: { background: "#fffaf2", color: "#334155" },
  badgeNeutral: { background: "#fffdf8", color: "#0f172a" },

  footer: {
    color: "#5a616c",
    fontSize: ".9rem",
    textAlign: "center",
    padding: "28px 0",
  },
};

export default styles;
