import * as React from "react";

import { CopyIcon, PlayIcon } from "~/client/assets/svg/Icons";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import {
  ToolOutputPanel,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";

type MorseAnswerCardProps = {
  label: string;
  plainText: string;
  morse: string;
  summary: string;
  audioHref?: string;
  translatorHref?: string;
  breakdown?: Array<{ label: string; morse: string; note?: string }>;
};

async function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") return;

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await copyText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 900);
        } catch {
          setCopied(false);
        }
      }}
      className={toolControlButtonClass({ tone: "darkPanel", size: "sm" })}
    >
      <CopyIcon size={16} title={label} />
      {copied ? "Copied" : label}
    </button>
  );
}

export default function MorseAnswerCard({
  label,
  plainText,
  morse,
  summary,
  audioHref,
  translatorHref,
  breakdown = [],
}: MorseAnswerCardProps) {
  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)]">
      <ToolOutputPanel
        label="Direct answer"
        badge={label}
        footer={
          <>
            <CopyButton value={plainText} label="Copy text" />
            <CopyButton value={morse} label="Copy Morse" />
            <button
              type="button"
              onClick={() => playMorsePattern(morse)}
              className={toolControlButtonClass({ tone: "darkPanel", size: "sm" })}
            >
              <PlayIcon size={16} title="Play Morse" />
              Play Morse
            </button>
          </>
        }
      >
        <div className="space-y-5 px-4 pb-4 text-slate-100">
          <p className="max-w-[64ch] text-base leading-relaxed text-slate-200">
            {summary}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Plain text
              </p>
              <p className="mt-2 break-words font-mono text-lg font-bold tracking-[0.08em] text-sky-100">
                {plainText}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Morse
              </p>
              <p className="mt-2 break-words font-mono text-lg font-bold tracking-[0.12em] text-sky-100">
                {morse}
              </p>
            </div>
          </div>
        </div>
      </ToolOutputPanel>

      <aside className="mw-static-panel rounded-xl bg-[#fffdf8] p-5">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Next action
        </p>
        <div className="mt-4 grid gap-2">
          {translatorHref ? (
            <a
              href={translatorHref}
              className={toolControlButtonClass({ size: "sm", full: true })}
            >
              Open in translator
            </a>
          ) : null}
          {audioHref ? (
            <a
              href={audioHref}
              className={toolControlButtonClass({ size: "sm", full: true })}
            >
              Hear in audio
            </a>
          ) : null}
        </div>

        {breakdown.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-extrabold text-sky-950">Quick breakdown</p>
            <div className="mt-3 grid gap-2">
              {breakdown.slice(0, 4).map((item, index) => (
                <div
                  key={`${item.label}-${item.morse}-${index}`}
                  className="mw-static-tile rounded-lg bg-[#fffaf2] px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-sky-950">{item.label}</span>
                    <span className="font-mono text-sm font-bold tracking-[0.12em] text-slate-900">
                      {item.morse}
                    </span>
                  </div>
                  {item.note ? (
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {item.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
