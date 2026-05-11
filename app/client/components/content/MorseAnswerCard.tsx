import * as React from "react";

import {
  HeadphonesIcon,
  PlayIcon,
  SparklesIcon,
} from "~/client/assets/svg/Icons";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import {
  ToolOutputPanel,
} from "~/client/components/shared/ToolWorkspace";
import {
  ActionButton,
  ActionLinkButton,
  ActionRow,
  CopyActionButton,
} from "~/client/components/shared/ActionControls";

type MorseAnswerCardProps = {
  label: string;
  plainText: string;
  morse: string;
  rhythm?: string;
  summary: string;
  audioHref?: string;
  encoderHref?: string;
  practiceHref?: string;
  translatorHref?: string;
  breakdown?: Array<{ label: string; morse: string; note?: string }>;
};

export default function MorseAnswerCard({
  label,
  plainText,
  morse,
  rhythm,
  summary,
  audioHref,
  encoderHref,
  practiceHref,
  translatorHref,
  breakdown = [],
}: MorseAnswerCardProps) {
  const actionLinks = [
    translatorHref
      ? { href: translatorHref, label: "Open in translator" }
      : null,
    audioHref
      ? {
          href: audioHref,
          label: "Hear in audio",
          icon: <HeadphonesIcon size={16} title={undefined} aria-hidden="true" />,
        }
      : null,
    encoderHref ? { href: encoderHref, label: "Open in encoder" } : null,
    practiceHref
      ? {
          href: practiceHref,
          label: "Practice",
          icon: <SparklesIcon size={16} title={undefined} aria-hidden="true" />,
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon?: React.ReactNode;
  }>;

  return (
    <section className="mt-5">
      <ToolOutputPanel
        label="Direct answer"
        badge={label}
        className="h-fit"
        footer={
          <>
            <CopyActionButton
              value={plainText}
              label="Copy text"
              tone="darkPanel"
              size="sm"
            />
            <CopyActionButton
              value={morse}
              label="Copy Morse"
              tone="darkPanel"
              size="sm"
            />
            <ActionButton
              onClick={() => playMorsePattern(morse)}
              tone="darkPanel"
              size="sm"
              leadingIcon={
                <PlayIcon size={16} title={undefined} aria-hidden="true" />
              }
            >
              Play Morse
            </ActionButton>
          </>
        }
      >
        <div className="px-4 pb-4 text-slate-100">
          <p className="max-w-[72ch] text-base leading-relaxed text-slate-200">
            {summary}
          </p>

          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Plain text
              </p>
              <p className="mt-2 break-words font-mono text-xl font-bold tracking-[0.08em] text-sky-100">
                {plainText}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
                Morse
              </p>
              <p className="mt-2 break-words font-mono text-xl font-bold tracking-[0.14em] text-sky-100">
                {morse}
              </p>
            </div>
            {rhythm ? (
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
                  Rhythm
                </p>
                <p className="mt-2 break-words text-xl font-extrabold text-sky-100">
                  {rhythm}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </ToolOutputPanel>

      {actionLinks.length > 0 || breakdown.length > 0 ? (
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          {actionLinks.length > 0 ? (
            <div className="min-w-0 flex-1 py-1">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Next actions
              </p>
              <ActionRow className="mt-3 max-w-[720px]">
                {actionLinks.map((link, index) => (
                  <ActionLinkButton
                    key={link.href}
                    href={link.href}
                    tone={index === 0 ? "dark" : "light"}
                    size="sm"
                    leadingIcon={link.icon}
                  >
                    {link.label}
                  </ActionLinkButton>
                ))}
              </ActionRow>
            </div>
          ) : null}

          {breakdown.length > 0 ? (
            <div className="min-w-0 py-1 lg:ml-auto lg:w-fit lg:max-w-[420px]">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Quick breakdown
              </p>
              <div
                className={[
                  "mt-2 grid gap-x-6 gap-y-2",
                  breakdown.length > 1 ? "sm:grid-cols-2 lg:grid-cols-1" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {breakdown.slice(0, 4).map((item, index) => (
                  <div
                    key={`${item.label}-${item.morse}-${index}`}
                    className="py-2"
                  >
                    <div className="inline-grid grid-cols-[auto_auto] items-baseline gap-8">
                      <span className="font-bold text-sky-950">{item.label}</span>
                      <span className="font-mono text-sm font-bold tracking-[0.12em] text-slate-900">
                        {item.morse}
                      </span>
                    </div>
                    {item.note ? (
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {item.note}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
