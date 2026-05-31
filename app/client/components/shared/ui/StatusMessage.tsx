import * as React from "react";

type StatusMessageKind = "info" | "success" | "error" | "working";

const kindClassName: Record<StatusMessageKind, string> = {
  error: "font-semibold text-slate-700",
  info: "leading-relaxed text-slate-600",
  success: "font-semibold text-sky-900",
  working: "font-semibold text-sky-900",
};

export default function StatusMessage({
  children,
  className = "",
  kind = "info",
  live = false,
}: {
  children: React.ReactNode;
  className?: string;
  kind?: StatusMessageKind;
  live?: boolean;
}) {
  return (
    <p
      className={["text-sm", kindClassName[kind], className]
        .filter(Boolean)
        .join(" ")}
      role={kind === "error" ? "alert" : live ? "status" : undefined}
      aria-live={live && kind !== "error" ? "polite" : undefined}
    >
      {children}
    </p>
  );
}
