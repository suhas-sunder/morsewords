import * as React from "react";

export type PromptKind = "text_to_morse" | "morse_to_text";

export type Prompt = {
  kind: PromptKind;
  plain: string;
  morse: string;
  label: string;
};

export default function PromptCard({
  prompt,
  questionNumber,
  totalQuestions,
}: {
  prompt: Prompt;
  questionNumber: number;
  totalQuestions: number;
}) {
  const kindLabel =
    prompt.kind === "text_to_morse" ? "Text → Morse" : "Morse → Text";

  const renderMorse = (morse: string) => {
    return morse.split("").map((ch, i) => {
      if (ch === " ") {
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: "0.6em",
              // Only spaces get a subtle tint so users can visually count gaps.
              // Dots and dashes remain completely unstyled.
              backgroundColor: "#dbeaf6",
              opacity: 0.3,
              borderRadius: "6px",
              // Tiny separation so consecutive spaces don't look like a single block.
              marginRight: "3px",
            }}
          >
            &nbsp;
          </span>
        );
      }
      return <span key={i}>{ch}</span>;
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full flex-col rounded-2xl border border-slate-200 bg-[#fffdf8] p-4 shadow-sm">
        <div className="flex items-center gap-2 justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600">
              {kindLabel}
            </span>
            <span className="text-sm text-slate-600">{prompt.label}</span>
          </div>

          <span className="text-sm font-semibold text-slate-700">
            Question {questionNumber}/{totalQuestions}
          </span>
        </div>

        <div className="mt-4 break-words whitespace-pre-wrap font-mono text-2xl tracking-wide text-slate-950 sm:text-3xl">
          {prompt.kind === "morse_to_text"
            ? renderMorse(prompt.morse)
            : prompt.plain}
        </div>
      </div>
    </div>
  );
}
