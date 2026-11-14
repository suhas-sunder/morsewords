import { useMemo, useState, useEffect } from "react";
import { diagnoseTextInput, describeDiagnosticText } from "./textDiagnostics";
import { ToolButton } from "./ToolWorkspace";

export default function TextInputDiagnostics({ value, inputId, transliterated = false }: {
  value: string; inputId: string; transliterated?: boolean;
}) {
  const result = useMemo(() => diagnoseTextInput(value), [value]);
  const [announcement, setAnnouncement] = useState("");
  const summary = result.unsupported || result.normalized
    ? `${result.unsupported} unsupported occurrence${result.unsupported === 1 ? "" : "s"}; ${result.normalized} normalization change${result.normalized === 1 ? "" : "s"}.` : "";
  useEffect(() => { const timer = setTimeout(() => setAnnouncement(summary), 500); return () => clearTimeout(timer); }, [summary]);
  return <div className="w-full text-sm leading-relaxed text-slate-700" data-text-diagnostics>
    <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
    {transliterated && <p className="mb-2">These positions refer to the transliterated text below, not the original script. Accents and script can change before encoding.</p>}
    {transliterated && <textarea id={inputId} aria-label="Transliterated text for diagnostics" readOnly value={value} className="mw-output-text mw-tool-output-surface mb-2 max-h-28 min-h-20 w-full rounded-lg border-0 bg-slate-950 p-2 font-mono text-sky-100 outline-none focus:ring-0 focus-visible:outline-none" />}
    {summary && <details>
      <summary className="cursor-pointer rounded-lg px-2 py-2 font-semibold focus-visible:outline focus-visible:outline-2">Input details: {summary}</summary>
      <p className="mt-2">Unsupported characters are omitted. Letter case is folded automatically. Positions count Unicode characters from 1; Select locates the original span. Showing at most 12 occurrences of each kind.</p>
      <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto p-1">
        {result.issues.map(issue => <li key={`${issue.start}-${issue.kind}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <span className="min-w-0 break-all">Line {issue.line}, column {issue.column}: <code>{describeDiagnosticText(issue.source)}</code> — {issue.kind === "unsupported" ? `omitted ${describeDiagnosticText(issue.omitted)}` : `normalized to ${describeDiagnosticText(issue.normalized)}`}</span>
          <ToolButton onClick={() => {
            const field = document.getElementById(inputId) as HTMLTextAreaElement | null;
            field?.focus(); field?.setSelectionRange(issue.start, issue.end);
          }} aria-label={`Select ${issue.kind} input at line ${issue.line}, column ${issue.column}`}>Select</ToolButton>
        </li>)}
      </ul>
    </details>}
  </div>;
}

