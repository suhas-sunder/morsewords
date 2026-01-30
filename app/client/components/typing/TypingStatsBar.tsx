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
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div>
          <div className="text-gray-500">Time</div>
          <div className="font-extrabold text-gray-900">{fmtSeconds(elapsedSec)}</div>
        </div>
        <div>
          <div className="text-gray-500">Letters</div>
          <div className="font-extrabold text-gray-900">{lettersDecoded}</div>
        </div>
        <div>
          <div className="text-gray-500">Words</div>
          <div className="font-extrabold text-gray-900">{wordsDecoded}</div>
        </div>
        <div>
          <div className="text-gray-500">Letters/min</div>
          <div className="font-extrabold text-gray-900">{lpm}</div>
        </div>
      </div>

      <div className="text-sm">
        <span className="text-gray-500">Invalid letters:</span>{" "}
        <span className="font-extrabold text-gray-900">{invalidSymbols}</span>
      </div>
    </div>
  );
}
