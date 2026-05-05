import * as React from "react";

type Props = {
  startedAtMs: number | null;
  lettersDecoded: number;
  wordsDecoded: number;
  invalidSymbols: number;
};

function fmtSeconds(s: number) {
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  const mmStr = String(mm).padStart(2, "0");
  const ssStr = String(ss).padStart(2, "0");
  return `${mmStr}:${ssStr}`;
}

export default function TypingStatsBar({
  startedAtMs,
  lettersDecoded,
  wordsDecoded,
  invalidSymbols,
}: Props) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  const elapsedSec =
    startedAtMs == null ? 0 : Math.max(0, Math.round((now - startedAtMs) / 1000));

  const lpm =
    startedAtMs == null || elapsedSec === 0
      ? 0
      : Math.round((lettersDecoded / elapsedSec) * 60);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fffdf8]/80 p-4">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Time</div>
          <div className="font-extrabold text-sky-950">{fmtSeconds(elapsedSec)}</div>
        </div>
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Letters</div>
          <div className="font-extrabold text-sky-950">{lettersDecoded}</div>
        </div>
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Words</div>
          <div className="font-extrabold text-sky-950">{wordsDecoded}</div>
        </div>
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Letters/min</div>
          <div className="font-extrabold text-sky-950">{lpm}</div>
        </div>
      </div>

      <div className="text-sm">
        <span className="text-slate-500">Invalid letters:</span>{" "}
        <span className="font-extrabold text-sky-950">{invalidSymbols}</span>
      </div>
    </div>
  );
}
