import * as React from "react";
import { useNavigate } from "react-router";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";
import { LEARNING_SESSIONS, requestLearningSession, type LearningSession } from "./learningSessions";

export default function LearningSessionChooser({ onChoose, onSkip }: {
  onChoose?: (session: LearningSession) => boolean;
  onSkip?: () => void;
}) {
  const navigate = useNavigate();
  const id = React.useId();
  const [selected, setSelected] = React.useState("first");
  const [open, setOpen] = React.useState(true);
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const session = LEARNING_SESSIONS.find(item => item.id === selected) ?? LEARNING_SESSIONS[0];
  function reopen() {
    setOpen(true);
    requestAnimationFrame(() => selectRef.current?.focus());
  }
  return (
    <section ref={sectionRef} className="my-6" aria-label="Start a learning session">
      {open ? <>
        <h2 className="text-2xl font-extrabold text-sky-950">Start a short session</h2>
        <p className="mt-2 max-w-[68ch] text-base leading-relaxed text-slate-700">Choose one skill for today. No account needed, and you can change your path at any time.</p>
        <form className="mt-4" onSubmit={event => {
          event.preventDefault();
          if (!onChoose?.(session)) { requestLearningSession(session.id); navigate(session.href); }
          setOpen(false);
        }}>
          <label htmlFor={id} className="block text-sm font-semibold text-sky-950">What would you like to practice?</label>
          <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <select ref={selectRef} id={id} value={selected} onChange={event => setSelected(event.target.value)} aria-describedby={`${id}-description`} className="mw-tool-select-surface min-h-11 w-full rounded-lg bg-[#fffdf8] px-3 py-2 text-base text-slate-900 sm:w-auto sm:min-w-72">
              {LEARNING_SESSIONS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <ToolButton type="submit" tone="dark">Start session</ToolButton>
            <ToolButton type="button" onClick={() => {
              setOpen(false);
              if (onSkip) onSkip();
              else requestAnimationFrame(() => sectionRef.current?.querySelector("button")?.focus());
            }}>Skip chooser</ToolButton>
          </div>
          <p id={`${id}-description`} className="mt-3 max-w-[68ch] text-sm leading-relaxed text-slate-600">{session.description}</p>
        </form>
      </> : <ToolButton type="button" onClick={reopen}>Choose another path</ToolButton>}
    </section>
  );
}
