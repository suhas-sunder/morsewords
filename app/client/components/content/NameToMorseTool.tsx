import * as React from "react";

import { CopyIcon, PlayIcon } from "~/client/assets/svg/Icons";
import {
  NAME_EXAMPLES,
  morseForText,
} from "~/client/data/morseContent";
import {
  getUnsupportedTextCharacters,
  normalizeTextForEncoding,
} from "~/client/components/shared/morseUtils";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import { encodeToolQueryValue } from "~/client/components/shared/queryPrefill";
import {
  ToolOutputPanel,
  ToolPanel,
  ToolSampleButtons,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    if (typeof document === "undefined") return false;
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }
}

function CopyButton({
  value,
  label,
  disabled,
}: {
  value: string;
  label: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={async () => {
        if (disabled) return;
        const ok = await copyText(value);
        if (!ok) return;
        setCopied(true);
        window.setTimeout(() => setCopied(false), 900);
      }}
      className={toolControlButtonClass({
        tone: "darkPanel",
        size: "sm",
        disabled,
      })}
    >
      <CopyIcon size={16} title={label} />
      {copied ? "Copied" : label}
    </button>
  );
}

export default function NameToMorseTool() {
  const [name, setName] = React.useState("Avery");
  const normalizedName = React.useMemo(
    () => normalizeTextForEncoding(name),
    [name],
  );
  const morse = React.useMemo(() => morseForText(name), [name]);
  const unsupported = React.useMemo(
    () => getUnsupportedTextCharacters(name),
    [name],
  );
  const unsupportedEntries = Object.entries(unsupported);
  const canUseOutput = normalizedName.length > 0 && morse.length > 0;
  const encodedName = encodeToolQueryValue(normalizedName);

  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <ToolPanel
        label={<label htmlFor="mw_name_input">Name</label>}
        badge="Input"
        footer={
          <p className="text-sm leading-relaxed text-slate-600">
            Morse converts spelling, not meaning. Spaces, hyphens, and
            apostrophes are handled when they are in the supported Morse map.
          </p>
        }
      >
        <div className="px-4 pb-4">
          <input
            id="mw_name_input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-h-12 w-full rounded-xl bg-transparent px-0 font-mono text-lg font-bold text-slate-950 outline-none placeholder:text-slate-400 focus-visible:outline-none"
            placeholder="Example: Avery"
            autoCapitalize="words"
            autoCorrect="off"
            spellCheck={false}
          />

          {unsupportedEntries.length > 0 ? (
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Unsupported characters ignored:{" "}
              {unsupportedEntries
                .map(([character, count]) => `${character} x ${count}`)
                .join(", ")}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <ToolSampleButtons
              examples={NAME_EXAMPLES.map((example) => example.label)}
              onPick={setName}
            />
          </div>
        </div>
      </ToolPanel>

      <ToolOutputPanel
        label="Name in Morse"
        footer={
          <>
            <CopyButton
              value={normalizedName}
              label="Copy name"
              disabled={!canUseOutput}
            />
            <CopyButton
              value={morse}
              label="Copy Morse"
              disabled={!canUseOutput}
            />
            <button
              type="button"
              disabled={!canUseOutput}
              onClick={() => playMorsePattern(morse)}
              className={toolControlButtonClass({
                tone: "darkPanel",
                size: "sm",
                disabled: !canUseOutput,
              })}
            >
              <PlayIcon size={16} title="Play Morse" />
              Play Morse
            </button>
          </>
        }
      >
        <div className="space-y-5 px-4 pb-4">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
              Normalized name
            </p>
            <p className="mt-2 min-h-8 break-words font-mono text-lg font-bold tracking-[0.08em] text-sky-100">
              {normalizedName || "Enter a name"}
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
              Morse output
            </p>
            <p className="mt-2 min-h-8 break-words font-mono text-lg font-bold tracking-[0.12em] text-sky-100">
              {morse || "..."}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <a
              href={canUseOutput ? `/?text=${encodedName}` : "/"}
              className={toolControlButtonClass({
                tone: "darkPanel",
                size: "sm",
                full: true,
                disabled: !canUseOutput,
              })}
              aria-disabled={!canUseOutput}
              tabIndex={canUseOutput ? undefined : -1}
              onClick={(event) => {
                if (!canUseOutput) event.preventDefault();
              }}
            >
              Open in translator
            </a>
            <a
              href={canUseOutput ? `/audio?text=${encodedName}` : "/audio"}
              className={toolControlButtonClass({
                tone: "darkPanel",
                size: "sm",
                full: true,
                disabled: !canUseOutput,
              })}
              aria-disabled={!canUseOutput}
              tabIndex={canUseOutput ? undefined : -1}
              onClick={(event) => {
                if (!canUseOutput) event.preventDefault();
              }}
            >
              Hear in audio
            </a>
          </div>
        </div>
      </ToolOutputPanel>
    </section>
  );
}
