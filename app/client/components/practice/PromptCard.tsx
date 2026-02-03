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
      <div className="flex flex-col w-full border border-gray-200 rounded-2xl p-4 bg-sky-50">
        <div className="flex items-center gap-2 justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-neutral-900">
              {kindLabel}
            </span>
            <span className="text-sm text-gray-600">{prompt.label}</span>
          </div>

          <span className="text-sm font-semibold text-gray-700">
            Question {questionNumber}/{totalQuestions}
          </span>
        </div>

        <div className="mt-4 text-2xl sm:text-3xl font-mono tracking-wide text-neutral-900 break-words whitespace-pre-wrap">
          {prompt.kind === "morse_to_text"
            ? renderMorse(prompt.morse)
            : prompt.plain}
        </div>
      </div>
    </div>
  );
}
