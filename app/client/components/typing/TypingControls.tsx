import * as React from "react";

import ToggleChip from "~/client/components/shared/ToggleChip";

export type InputMode = "dotdash" | "fj";

type Props = {
  inputMode: InputMode;
  setInputMode: (m: InputMode) => void;
  showStats: boolean;
  setShowStats: (v: boolean) => void;
};

export default function TypingControls({
  inputMode,
  setInputMode,
  showStats,
  setShowStats,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-[#fffdf8]/80 p-4 shadow-[0_5px_14px_rgba(11,36,71,0.05)]">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2 font-extrabold text-sky-950">Input mode</div>
        <ToggleChip
          active={inputMode === "dotdash"}
          onClick={() => setInputMode("dotdash")}
          label="Type . and -"
        />
        <ToggleChip
          active={inputMode === "fj"}
          onClick={() => setInputMode("fj")}
          label="F = dit, J = dah"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2 font-extrabold text-sky-950">Display</div>
        <ToggleChip
          active={showStats}
          onClick={() => setShowStats(true)}
          label="Show stats"
        />
        <ToggleChip
          active={!showStats}
          onClick={() => setShowStats(false)}
          label="Hide stats"
        />
      </div>

      <p className="text-sm text-slate-700">
        Tip: press <span className="font-mono">Esc</span> to re-focus the input
        at any time.
      </p>
    </div>
  );
}
