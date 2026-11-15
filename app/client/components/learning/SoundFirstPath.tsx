import * as React from "react";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";
import { SOUND_FIRST_SETS } from "./soundFirstSchema";
import type { useSoundFirstProgress } from "./useSoundFirstProgress";

export default function SoundFirstPath({ saved, activeSet, onStart, onLeave }: {
  saved: ReturnType<typeof useSoundFirstProgress>;
  activeSet: number | null;
  onStart: (index: number) => void;
  onLeave: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [confirmClear, setConfirmClear] = React.useState(false);
  const set = SOUND_FIRST_SETS[saved.progress.selectedSet];
  return <section className="mt-6" aria-label="Sound-first learning path">
    <ToolButton aria-expanded={open} aria-controls="sound-first-path" onClick={() => setOpen(value => !value)}>{open ? "Hide" : "Explore"} sound-first path</ToolButton>
    {activeSet !== null && <p className="mt-3 font-semibold text-sky-950" role="status">Active set {activeSet + 1}: {SOUND_FIRST_SETS[activeSet].letters.split("").join(" ")}. Ten prompts; press Play when ready.</p>}
    {open && <div id="sound-first-path" className="mt-4">
      <h2 className="text-2xl font-extrabold text-sky-950">Build your listening set</h2>
      <p className="mt-3 max-w-[68ch] text-slate-700">Start with E and T, then add the guide's A, N, I, M, S and O. Later sets add the remaining letters in alphabetic order. Every set includes the earlier letters. Choose any set; nothing is locked.</p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="grid gap-2 text-sm font-semibold text-sky-950"><label htmlFor="sound-first-set">Character set</label>
          <select id="sound-first-set" className="mw-tool-select-surface min-h-11 rounded-lg bg-[#fffdf8] px-3 py-2 text-slate-950" value={set.id} disabled={!saved.ready} onChange={event => saved.choose(Number(event.target.value))}>
            {SOUND_FIRST_SETS.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </div>
        <ToolButton active disabled={!saved.ready} onClick={() => onStart(set.id)}>Start selected set</ToolButton>
        {activeSet !== null && <ToolButton onClick={onLeave}>Return to open-ended practice</ToolButton>}
      </div>
      <p className="mt-3 font-mono text-sky-950">Letters in selected set: {set.letters.split("").join(" ")}</p>
      <p className="mt-2 max-w-[68ch] text-sm text-slate-600">{saved.progress.completedRounds[set.id]}{saved.progress.completedRounds[set.id] === 9999 ? "+" : ""} completed rounds in this set. A round means ten prompts finished, including skips; it is not a mastery score. You choose when to expand. Changing the selection alone keeps the current round; Start selected set begins a fresh round.</p>
      <p className="mt-2 max-w-[68ch] text-sm text-slate-600">Use Read static pattern below for the same targets without sound or flashing. Sound and static practice train different skills. Reload keeps your selection and round counts, and returns to ordinary practice without autoplay.</p>
      {saved.notice && <p role="status" className="mt-3 max-w-[68ch] text-sm text-slate-700">{saved.notice}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        <ToolButton disabled={!saved.ready} onClick={() => setConfirmClear(true)}>Clear path progress</ToolButton>
        {confirmClear && <><span className="self-center text-sm text-slate-700">Clear only saved path selection and round counts?</span><ToolButton onClick={() => { saved.clear(); setConfirmClear(false); }}>Confirm clear path</ToolButton><ToolButton onClick={() => setConfirmClear(false)}>Keep path progress</ToolButton></>}
      </div>
    </div>}
  </section>;
}
