import * as React from "react";

import { PlayIcon } from "~/client/assets/svg/Icons";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-sky-800" />
      <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
        {children}
      </span>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const headerGridClass = aside
    ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start"
    : "grid gap-6";

  return (
    <section className="mw-tool-section mt-4">
      <div className="tool-header py-6 sm:py-7">
        <div className={headerGridClass}>
          <div className="min-w-0">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              {description}
            </p>
            {children ? <div className="mt-5">{children}</div> : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  aside,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/40 py-8 sm:py-10">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

export function DarkNote({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="rounded-xl bg-slate-950 p-4 text-slate-200">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>
      {value ? (
        <p className="mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
          {value}
        </p>
      ) : null}
      <div className="mt-2 text-sm leading-relaxed text-slate-200">{children}</div>
    </aside>
  );
}

export function ActionLinks({
  links,
}: {
  links: Array<{ href: string; label: string; primary?: boolean }>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.href + link.label}
          href={link.href}
          className={
            "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 " +
            (link.primary
              ? "bg-slate-950 text-sky-100 shadow-[0_10px_24px_rgba(2,6,23,0.16)] hover:bg-slate-800 hover:text-white hover:shadow-[0_12px_28px_rgba(2,6,23,0.2)]"
              : "bg-[#fffdf8] text-slate-900 shadow-[0_7px_18px_rgba(11,36,71,0.07)] hover:bg-white hover:text-sky-950 hover:shadow-[0_10px_24px_rgba(11,36,71,0.12)]")
          }
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function SimpleGrid({
  items,
}: {
  items: Array<{ title: string; text: string; href?: string; badge?: string }>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const body = (
          <>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-extrabold leading-snug text-sky-950">
                {item.title}
              </h3>
              {item.badge ? (
                <span className="shrink-0 rounded-md bg-[#f7f4ee] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              {item.text}
            </p>
          </>
        );

        if (item.href) {
          return (
            <a
              key={item.title}
              href={item.href}
              className="group block min-h-[142px] cursor-pointer rounded-xl bg-[#fffdf8] p-5 no-underline shadow-[0_7px_18px_rgba(11,36,71,0.07)] transition hover:bg-white hover:shadow-[0_10px_24px_rgba(11,36,71,0.12)]"
            >
              {body}
              <span className="mt-4 inline-block text-sm font-semibold text-sky-900">
                Open page{" "}
                <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">
                  -&gt;
                </span>
              </span>
            </a>
          );
        }

        return (
          <div key={item.title} className="rounded-xl bg-[#fffdf8] p-5 shadow-[0_7px_18px_rgba(11,36,71,0.07)]">
            {body}
          </div>
        );
      })}
    </div>
  );
}

export function ReferenceTable({
  items,
  onPlay,
}: {
  items: Array<{ label: string; morse: string; description: string; example?: string }>;
  onPlay?: (morse: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#fffdf8] shadow-[0_7px_18px_rgba(11,36,71,0.07)]">
      <div className="grid grid-cols-[1fr_1fr] bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 sm:grid-cols-[180px_1fr_2fr_120px]">
        <span>Name</span>
        <span>Morse</span>
        <span className="hidden sm:block">Use</span>
        <span className="hidden text-right sm:block">Audio</span>
      </div>
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] sm:grid-cols-[180px_1fr_2fr_120px] sm:items-center"
        >
          <div>
            <p className="font-bold text-sky-950">{item.label}</p>
            {item.example ? (
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                {item.example}
              </p>
            ) : null}
          </div>
          <p className="font-mono text-base font-bold tracking-[0.16em] text-slate-950">
            {item.morse}
          </p>
          <p className="text-sm leading-relaxed text-slate-700">{item.description}</p>
          <button
            type="button"
            onClick={() => onPlay?.(item.morse)}
            className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-900 shadow-[0_7px_18px_rgba(11,36,71,0.07)] transition hover:bg-white hover:text-sky-950 hover:shadow-[0_10px_24px_rgba(11,36,71,0.12)] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            disabled={!onPlay}
          >
            <PlayIcon size={16} title="Play" />
            Play
          </button>
        </div>
      ))}
    </div>
  );
}
