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

  const isMorsePrompt = prompt.kind === "morse_to_text";

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
        className={`flex w-full flex-col rounded-2xl p-4 ${
          isMorsePrompt ? "bg-slate-950 text-slate-100" : "bg-[#fffdf8]/85 text-slate-950 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.1)]"
        }`}
      >
        <div className="flex items-center gap-2 justify-between">
          <div className="inline-flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] ${
                isMorsePrompt
                  ? "bg-slate-700 text-slate-200"
                  : "bg-white text-slate-600"
              }`}
            >
              {kindLabel}
            </span>
            <span
              className={`text-sm ${isMorsePrompt ? "text-slate-300" : "text-slate-600"}`}
            >
              {prompt.label}
            </span>
          </div>

          <span
            className={`text-sm font-semibold ${isMorsePrompt ? "text-slate-200" : "text-slate-700"}`}
          >
            Question {questionNumber}/{totalQuestions}
          </span>
        </div>

        <div
          className={`mt-4 break-words whitespace-pre-wrap font-mono text-2xl tracking-wide sm:text-3xl ${
            isMorsePrompt ? "text-sky-100" : "text-slate-950"
          }`}
        >
          {prompt.kind === "morse_to_text"
            ? renderMorse(prompt.morse)
            : prompt.plain}
        </div>
      </div>
    </div>
  );
}
