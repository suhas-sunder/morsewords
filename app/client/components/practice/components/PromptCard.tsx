import * as React from "react";
import Button from "~/client/components/practice/components/Button";

export type PromptKind = "text_to_morse" | "morse_to_text";

export type Prompt = {
  kind: PromptKind;
  plain: string;
  morse: string;
  label: string;
};

export default function PromptCard({
  prompt,
  reveal,
  onReveal,
}: {
  prompt: Prompt;
  reveal: boolean;
  onReveal: () => void;
}) {
  const shown = prompt.kind === "text_to_morse" ? prompt.plain : prompt.morse;
  const answer = prompt.kind === "text_to_morse" ? prompt.morse : prompt.plain;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col w-full border border-gray-200 rounded-2xl p-4 bg-sky-50">
       

        <div className="mt-4 text-2xl sm:text-3xl font-mono tracking-wide text-neutral-900 break-words">
          {shown}
        </div>

      </div>
      <div className="mt-4 flex w-full flex-wrap items-center gap-3">
        <Button variant="ghost" type="button" onClick={onReveal}>
          {reveal ? "Hide answer" : "Reveal answer"}
        </Button>

        {reveal ? (
          <div className="text-sm text-gray-700">
            Answer:{" "}
            <span className="font-extrabold text-neutral-900">{answer}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
