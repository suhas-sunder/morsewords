import { useEffect, useRef, useState } from "react";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";
import { applyLearningSnapshot, exportLearningData, LearningDataError, learningKeyLabel, learningValueSummary, notifyLearningDataChanged, planLearningImport, readLearningFile, type ImportPlan, type LearningFile } from "./learningPortability";

function download(file: LearningFile, backup = false) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = backup ? "morsewords-learning-backup-v1.json" : "morsewords-learning-v1.json";
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
const messageFor = (error: unknown) => error instanceof LearningDataError ? error.message : "The learning file could not be processed. Nothing was uploaded. Keep any backup and try again.";

export default function LearningDataPanel() {
  const [includePrivate, setIncludePrivate] = useState(false);
  const [allowPrivate, setAllowPrivate] = useState(false);
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [recovery, setRecovery] = useState<ImportPlan | null>(null);
  const [applied, setApplied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const request = useRef(0);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const result = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (plan) previewHeading.current?.focus(); }, [plan]);
  useEffect(() => { if (notice) result.current?.focus(); }, [notice]);
  function announce(message: string) { setNotice(message); }
  return <div className="mt-5 text-slate-700" aria-label="Learning data controls">
    <p className="max-w-[68ch]">Export best streaks, saved review targets, and your sound-first set and completed-round counts. Current answers and unfinished sessions are not included. This is a local JSON file; MorseWords does not upload it.</p>
    <p className="mt-2 max-w-[68ch]">Audio settings, theme, cookies, ads, and book data stay unchanged. Use the same browser profile to restore your progress. Close other MorseWords practice tabs first so they do not save older progress over a restore.</p>
    <h3 className="mt-6 text-2xl font-extrabold text-sky-950">Save a learning file</h3>
    <label className="mt-3 flex max-w-[68ch] cursor-pointer items-start gap-3"><input type="checkbox" className="mt-1 cursor-pointer" checked={includePrivate} onChange={event => setIncludePrivate(event.target.checked)} /><span>Include private custom words and private review targets</span></label>
    <p className="mt-2 max-w-[68ch] text-sm">Private text is excluded by default. A file that includes it is readable by anyone you share the file with.</p>
    <ToolButton className="mt-3" onClick={() => { try { download(exportLearningData(localStorage, includePrivate)); announce("Learning file prepared for download. Saved progress has not changed."); } catch (error) { announce(messageFor(error)); } }}>Export learning file</ToolButton>
    <h3 className="mt-7 text-2xl font-extrabold text-sky-950">Restore from a learning file</h3>
    <p className="mt-2 max-w-[68ch]">Choose a version 1 MorseWords JSON file up to 1 MiB. Review the changes before applying them. Missing sections stay unchanged. Public-only files preserve your private words and private review targets.</p>
    <label htmlFor="learning-import-file" className="mt-4 block font-semibold text-sky-950">Choose learning file</label>
    <input id="learning-import-file" type="file" accept="application/json,.json" disabled={busy || recovery !== null} className="mt-2 block w-full max-w-full cursor-pointer rounded-lg bg-[#fffdf8] p-3 text-sm disabled:cursor-not-allowed" onChange={async event => {
      const file = event.target.files?.[0]; event.target.value = "";
      const id = ++request.current; setPlan(null); setAllowPrivate(false); setNotice("");
      if (!file) return;
      setBusy(true);
      try {
        const parsed = await readLearningFile(file);
        const next = planLearningImport(localStorage, parsed);
        if (id !== request.current) return;
        setPlan(next);
      } catch (error) { if (id === request.current) announce(messageFor(error)); }
      finally { if (id === request.current) setBusy(false); }
    }} />
    {busy && <p className="mt-3" role="status">Reading the local learning file…</p>}
    {plan && <section aria-labelledby="learning-import-preview" className="mt-6 border-t border-slate-300 pt-5">
      <h3 id="learning-import-preview" ref={previewHeading} tabIndex={-1} className="text-2xl font-extrabold text-sky-950">Review changes before restoring</h3>
      <p className="mt-2 max-w-[68ch]">The following {Object.keys(plan.after).length} saved values will be replaced or cleared. Best streaks are replaced, not added together. Anything absent from this list stays unchanged.</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{Object.entries(plan.after).map(([key, value]) => <li key={key}>{learningKeyLabel(key)}: {learningValueSummary(key, plan.before[key])} → {value === null ? "clear saved value" : learningValueSummary(key, value)}</li>)}</ul>
      <p className="mt-3 text-sm">{Object.hasOwn(plan.after, "mw_learning_review_v1") ? `${plan.preservedPrivate} existing private review targets will be preserved separately.` : "Review targets stay unchanged."} {plan.file.includesPrivate ? "This file can replace private review targets and any custom word list it contains." : "Your private custom word list stays unchanged."}</p>
      {plan.file.includesPrivate && <label className="mt-3 flex cursor-pointer items-start gap-3"><input type="checkbox" className="mt-1 cursor-pointer" checked={allowPrivate} onChange={event => setAllowPrivate(event.target.checked)} /><span>Allow private learning data from this file to replace the listed values</span></label>}
      <p className="mt-3 max-w-[68ch] text-sm">Save the previous-values backup before restoring if you want recovery after leaving this page. The backup may include your existing private text. Undo is available here until you leave or dismiss it.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <ToolButton onClick={() => { download(plan.backup, true); announce("Previous-values backup prepared for download. It may contain private text."); }}>Download previous-values backup</ToolButton>
        <ToolButton tone="dark" disabled={plan.file.includesPrivate && !allowPrivate} onClick={() => {
          setRecovery(plan); setApplied(false);
          try {
            applyLearningSnapshot(localStorage, plan.before, plan.after);
            notifyLearningDataChanged(Object.keys(plan.after)); setApplied(true); setPlan(null);
            announce("Learning data restored. Undo or download the backup before leaving this page if needed.");
          } catch (error) { setPlan(null); announce(messageFor(error)); }
        }}>Restore listed learning data</ToolButton>
        <ToolButton onClick={() => { request.current++; setPlan(null); announce("Restore cancelled. Saved learning data has not changed."); }}>Cancel restore</ToolButton>
      </div>
    </section>}
    {recovery && <div className="mt-5">
      <p className="max-w-[68ch] text-sm">A previous-values backup is held in this tab and may contain private text. Save it before leaving. Undo refuses to overwrite progress changed since this restore.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <ToolButton onClick={() => { download(recovery.backup, true); announce("Previous-values backup prepared for download. It may contain private text."); }}>Download recovery backup</ToolButton>
        {applied && <ToolButton onClick={() => {
          try { applyLearningSnapshot(localStorage, recovery.after, recovery.before); notifyLearningDataChanged(Object.keys(recovery.before)); setApplied(false); announce("Restore undone. The exact previous saved values are back."); }
          catch (error) { announce(messageFor(error)); }
        }}>Undo learning restore</ToolButton>}
        <ToolButton onClick={() => { setRecovery(null); setApplied(false); announce("In-tab backup dismissed. Any downloaded backup is still available."); }}>Dismiss in-tab backup</ToolButton>
      </div>
    </div>}
    <p ref={result} tabIndex={-1} role="status" className="mt-4 max-w-[68ch] font-semibold text-sky-950">{notice}</p>
  </div>;
}
