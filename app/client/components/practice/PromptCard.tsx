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
      <div
        className="flex w-full flex-col rounded-xl bg-slate-950 p-4 text-slate-100"
      >
        <div className="flex items-center gap-2 justify-between">
          <div className="inline-flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-md bg-slate-700 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-200"
            >
              {kindLabel}
            </span>
            <span className="text-sm text-slate-300">
              {prompt.label}
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-200">
            Question {questionNumber}/{totalQuestions}
          </span>
        </div>

        <div
          className="mt-4 min-h-[4.5rem] break-words whitespace-pre-wrap font-mono text-2xl tracking-wide text-sky-100 sm:text-3xl"
        >
          {prompt.kind === "morse_to_text"
            ? renderMorse(prompt.morse)
            : prompt.plain}
        </div>
      </div>
    </div>
  );
}
