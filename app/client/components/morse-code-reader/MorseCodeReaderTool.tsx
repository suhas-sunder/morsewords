import * as React from "react";

import { TrashIcon } from "~/client/assets/svg/Icons";
import {
  ActionButton,
  ActionRow,
  CopyActionButton,
} from "~/client/components/shared/ActionControls";
import {
  ToolOutputPanel,
  ToolPanel,
  ToolTextarea,
} from "~/client/components/shared/ToolWorkspace";
import {
  morseToText,
  normalizeMorseForDecoding,
} from "~/client/components/shared/morseUtils";

const READER_EXAMPLES = [
  { label: "SOS", morse: "... --- ..." },
  {
    label: "HELLO WORLD",
    morse: ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
  },
  { label: "HELP ME", morse: ".... . .-.. .--. / -- ." },
  { label: "I LOVE YOU", morse: ".. / .-.. --- ...- . / -.-- --- ..-" },
  { label: "TEST", morse: "- . ... -" },
] as const;

export default function MorseCodeReaderTool() {
  const [morseInput, setMorseInput] = React.useState<string>(
    READER_EXAMPLES[1].morse,
  );
  const result = React.useMemo(() => readMorseInput(morseInput), [morseInput]);
  const handleMorseInput = React.useCallback(
    (
      event:
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.FormEvent<HTMLTextAreaElement>,
    ) => {
      setMorseInput(event.currentTarget.value);
    },
    [],
  );

  const hasDecodedText = result.decodedText.trim().length > 0;
  const hasNormalizedMorse = result.normalizedDisplay.trim().length > 0;

  return (
    <section
      data-testid="morse-code-reader-tool"
      className="pb-4 pt-4 sm:pb-5 sm:pt-4"
      aria-label="Morse code reader tool"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <ActionRow>
            {READER_EXAMPLES.map((example) => (
              <ActionButton
                key={example.label}
                onClick={() => setMorseInput(example.morse)}
                rounded="full"
                size="sm"
              >
                Try {example.label}
              </ActionButton>
            ))}
          </ActionRow>
          <ActionButton
            onClick={() => setMorseInput("")}
            leadingIcon={
              <TrashIcon size={16} title={undefined} aria-hidden="true" />
            }
            size="sm"
            className="lg:ml-auto"
          >
            Clear reader
          </ActionButton>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ToolPanel
            label="Paste Morse code"
            badge="Dots + dashes"
            footer={
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <p className="mw-text-soft text-sm leading-relaxed text-slate-600">
                  Spaces = letters; / = words.
                </p>
                {result.feedback.length > 0 ? (
                  <p
                    className="mw-text-muted text-xs font-medium leading-relaxed text-slate-700"
                    aria-live="polite"
                  >
                    {result.feedback.join(" ")}
                  </p>
                ) : null}
              </div>
            }
          >
            <label htmlFor="morse-reader-input" className="sr-only">
              Morse code input
            </label>
            <ToolTextarea
              id="morse-reader-input"
              aria-label="Morse code input"
              value={morseInput}
              onChange={handleMorseInput}
              onInput={handleMorseInput}
              spellCheck={false}
              autoComplete="off"
              placeholder="Example: ... --- ..."
              className="min-h-[14rem] md:min-h-[20rem] lg:min-h-[22rem]"
            />
          </ToolPanel>

          <ToolOutputPanel
            label="Decoded text"
            badge="Result"
            footer={
              <ActionRow>
                <CopyActionButton
                  label="Copy decoded text"
                  value={result.decodedText}
                  disabled={!hasDecodedText}
                  tone="darkPanel"
                  size="sm"
                />
                <CopyActionButton
                  label="Copy normalized Morse"
                  value={result.normalizedDisplay}
                  disabled={!hasNormalizedMorse}
                  tone="darkPanel"
                  size="sm"
                />
              </ActionRow>
            }
          >
            <pre
              aria-label="Decoded text output"
              className="mw-output-bright min-h-[10rem] whitespace-pre-wrap px-4 py-5 font-mono text-xl font-bold tracking-[0.08em] text-sky-100"
            >
              {result.decodedText || "Decoded text will appear here."}
            </pre>
            <div className="px-4 pb-4">
              <p className="mw-output-muted font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                Normalized Morse
              </p>
              <pre
                aria-label="Normalized Morse output"
                className="mw-output-bright mt-2 min-h-12 whitespace-pre-wrap font-mono text-sm font-bold tracking-[0.14em] text-sky-100"
              >
                {result.normalizedDisplay || "Normalized Morse will appear here."}
              </pre>
            </div>
          </ToolOutputPanel>
        </div>
      </div>
    </section>
  );
}

type ReaderResult = {
  decodedText: string;
  feedback: string[];
  normalizedDisplay: string;
};

function readMorseInput(input: string): ReaderResult {
  const { normalized, invalidChars } = normalizeMorseForDecoding(input);
  const normalizedDisplay = formatNormalizedMorse(normalized);
  const decodedText = morseToText(input);
  const feedback: string[] = [];

  if (!input.trim()) {
    feedback.push(
      "Spacing note: paste dots and dashes, then keep spaces between letter groups.",
    );
  } else if (hasNoVisibleLetterSpacing(normalized)) {
    feedback.push(
      "Spacing help: this input has no visible letter spaces, so the result may be ambiguous.",
    );
  }

  if (invalidChars.length > 0) {
    feedback.push(
      `Ignored characters: ${invalidChars.join(" ")}. Use periods, hyphens, spaces, and slashes for typed Morse.`,
    );
  }

  if (decodedText.includes("?")) {
    feedback.push(
      "Reader note: ? marks a dot-dash group that is not in the supported Morse table.",
    );
  }

  return { decodedText, feedback, normalizedDisplay };
}

function formatNormalizedMorse(normalized: string) {
  return normalized
    .trim()
    .replace(/\s{7,}/g, " / ")
    .replace(/ {2,6}/g, " ");
}

function hasNoVisibleLetterSpacing(normalized: string) {
  const compact = normalized.replace(/\s/g, "");
  if (compact.length < 6) return false;
  return /^[.-]+$/.test(compact) && !/\s/.test(normalized);
}
