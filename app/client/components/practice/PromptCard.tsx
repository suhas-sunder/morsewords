import * as React from "react";

import {
  ToolOutputPanel,
  ToolPanel,
} from "~/client/components/shared/ToolWorkspace";

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
    prompt.kind === "text_to_morse" ? "Text -> Morse" : "Morse -> Text";
  const questionLabel = `Question ${questionNumber}/${totalQuestions}`;

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

  const body = (
    <div
      className={[
        "min-h-[4.5rem] break-words whitespace-pre-wrap px-4 pb-5 pt-2 font-mono tracking-wide",
        prompt.kind === "morse_to_text"
          ? "text-2xl text-sky-100 sm:text-3xl"
          : "text-2xl text-slate-950 sm:text-3xl",
      ].join(" ")}
    >
      {prompt.kind === "morse_to_text"
        ? renderMorse(prompt.morse)
        : prompt.plain}
    </div>
  );

  return prompt.kind === "morse_to_text" ? (
    <ToolOutputPanel
      label={
        <span className="inline-flex flex-wrap items-center gap-2">
          <span>{kindLabel}</span>
          <span className="text-sm font-medium text-slate-300">
            {prompt.label}
          </span>
        </span>
      }
      badge={questionLabel}
    >
      {body}
    </ToolOutputPanel>
  ) : (
    <ToolPanel
      label={
        <span className="inline-flex flex-wrap items-center gap-2">
          <span>{kindLabel}</span>
          <span className="text-sm font-medium text-slate-600">
            {prompt.label}
          </span>
        </span>
      }
      badge={questionLabel}
    >
      {body}
    </ToolPanel>
  );
}
