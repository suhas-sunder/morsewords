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
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div className="mr-2 font-extrabold text-gray-900">Input mode</div>
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
        <div className="mr-2 font-extrabold text-gray-900">Display</div>
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

      <p className="text-sm text-gray-700">
        Tip: press <span className="font-mono">Esc</span> to re-focus the input
        at any time.
      </p>
    </div>
  );
}
