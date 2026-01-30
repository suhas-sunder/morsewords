import * as React from "react";
import Button from "~/client/components/practice/Button";
import ToggleChip from "~/client/components/practice/ToggleChip";

export type DrillMode = "text_to_morse" | "morse_to_text" | "mixed";
export type Pool = "all" | "letters" | "numbers" | "signals" | "words";

export default function PracticeControls({
  mode,
  setMode,
  pool,
  setPool,
  onNext,
  onReset,
}: {
  mode: DrillMode;
  setMode: (v: DrillMode) => void;
  pool: Pool;
  setPool: (v: Pool) => void;
  onNext: () => void;
  onReset: () => void;
}) {
  return (
    <div>
      <div className="text-lg font-extrabold text-neutral-900">
        Drill settings
      </div>

      <div className="mt-3 text-sm text-gray-600">Mode</div>
      <div className="mt-2 flex flex-wrap gap-2">
        <ToggleChip
          label="Text → Morse"
          active={mode === "text_to_morse"}
          onClick={() => setMode("text_to_morse")}
        />
        <ToggleChip
          label="Morse → Text"
          active={mode === "morse_to_text"}
          onClick={() => setMode("morse_to_text")}
        />
        <ToggleChip
          label="Mixed"
          active={mode === "mixed"}
          onClick={() => setMode("mixed")}
          title="Alternates direction each prompt"
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">Prompt pool</div>
      <div className="mt-2 flex flex-wrap gap-2">
        <ToggleChip
          label="All"
          active={pool === "all"}
          onClick={() => setPool("all")}
          title="Mixes letters, numbers, signals, and words"
        />
        <ToggleChip
          label="Letters"
          active={pool === "letters"}
          onClick={() => setPool("letters")}
        />
        <ToggleChip
          label="Numbers"
          active={pool === "numbers"}
          onClick={() => setPool("numbers")}
        />
        <ToggleChip
          label="Signals"
          active={pool === "signals"}
          onClick={() => setPool("signals")}
          title="Common abbreviations like SOS, CQ, and Q-codes"
        />
        <ToggleChip
          label="Words"
          active={pool === "words"}
          onClick={() => setPool("words")}
          title="Short words to practice spacing"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onNext}>
          New prompt
        </Button>
        <Button type="button" variant="ghost" onClick={onReset}>
          Reset stats
        </Button>
      </div>
    </div>
  );
}
