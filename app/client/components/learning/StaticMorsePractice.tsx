import * as React from "react";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";

export function useStaticPracticePreference(reducedMotion: boolean, disableFlashEffects: boolean) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    if (reducedMotion || disableFlashEffects) setShow(true);
  }, [reducedMotion, disableFlashEffects]);
  return [show, setShow] as const;
}

/** Static presentation of the existing prompt; never reveals decoded answers. */
export default function StaticMorsePractice({ morse, show, onToggle }: {
  morse: string; show: boolean; onToggle: () => void;
}) {
  const id = React.useId();
  return <div className="mb-5">
    <ToolButton aria-expanded={show} aria-controls={id} onClick={onToggle}>{show ? "Hide static pattern" : "Read static pattern"}</ToolButton>
    {show && <div id={id} className="mt-3 rounded-xl bg-slate-950 p-4 text-sky-100">
      <p className="text-sm font-semibold text-slate-200">Same target, without flashing</p>
      <pre aria-label="Static Morse pattern" className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-words font-mono text-xl font-bold leading-relaxed [overflow-wrap:anywhere]">{morse || "No Morse pattern yet"}</pre>
      <p className="mt-3 max-w-[68ch] text-sm text-slate-300">Spaces separate letters; / separates words. Read at your own pace. No sound or flashing is needed.</p>
    </div>}
  </div>;
}
