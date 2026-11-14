import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { morseToText, splitMorseWords } from "./morseUtils";
import { ActionButton, CopyActionButton } from "./ActionControls";
import { HANDOFF_LIMIT, stageMorseHandoff } from "./morseHandoff";

export default function MorseBoundaryDiagnostics({ value, handoff = true }: { value: string; handoff?: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const result = useMemo(() => morseToText(value, { returnResult: true }), [value]);
  const unknown = result.issues.filter(issue => issue.type === "unknown-morse-token");
  const questions = useMemo(() => splitMorseWords(value).flat().filter(token => token === "..--..").length, [value]);
  if (!unknown.length && !result.invalidChars?.length && !questions) return null;
  return <div className="w-full text-sm leading-relaxed text-slate-700" data-boundary-diagnostics>
    <p>{unknown.length} unknown group{unknown.length === 1 ? "" : "s"}. {questions} actual question-mark pattern{questions === 1 ? "" : "s"} (<code>..--..</code>).</p>
    {result.invalidChars?.length ? <p className="mt-2 break-words">Ignored input characters: {result.invalidChars.slice(0, 12).map(ch => JSON.stringify(ch)).join(", ")}{result.invalidChars.length > 12 ? " …" : ""}. Removing a character can join adjacent marks. Check the original input.</p> : null}
    {unknown.length > 0 && <>
      <p className="mt-2">Unknown groups produce a placeholder ?. Their marks stay intact here. Missing boundaries cannot be inferred reliably; check your source before adding spaces.</p>
      <details className="mt-2">
        <summary className="cursor-pointer rounded-lg p-2 font-semibold focus-visible:outline focus-visible:outline-2">Inspect failed groups ({unknown.length})</summary>
        <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto p-1">
          {unknown.slice(0, 12).map((issue, i) => <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <span className="min-w-0 break-words">Normalized word {issue.wordIndex + 1}, group {issue.groupIndex + 1}: <code className="break-all">{issue.value.slice(0, 240)}{issue.value.length > 240 ? "…" : ""}</code></span>
            <CopyActionButton value={issue.value} label="Copy group" aria-label={`Copy group ${issue.groupIndex + 1} in word ${issue.wordIndex + 1}`} size="sm" />
          </li>)}
        </ul>
        <p className="mt-2">Showing up to 12 failed groups and 240 marks each. Copy preserves the complete group.</p>
      </details>
    </>}
    {handoff && (unknown.length > 0 || !!result.invalidChars?.length) && <div className="mt-3">
      <ActionButton size="sm" disabled={value.length > HANDOFF_LIMIT} onClick={() => {
        if (stageMorseHandoff(pathname, value)) navigate("/morse-code-word-separator");
      }}>Inspect spacing with this input</ActionButton>
      <p className="mt-2">The handoff stays in this tab’s memory for 30 minutes; refreshing clears it.{value.length > HANDOFF_LIMIT ? " For this very long input, copy the section you want to inspect." : ""}</p>
    </div>}
  </div>;
}
