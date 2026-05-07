import * as React from "react";

import { PlayIcon } from "~/client/assets/svg/Icons";
import {
  HERO_EYEBROW_LINE_CLASS,
  HERO_EYEBROW_ROW_CLASS,
  HERO_EYEBROW_TEXT_CLASS,
  HERO_HEADER_CLASS,
  HERO_LEAD_CLASS,
  HERO_SECTION_CLASS,
  HERO_TITLE_CLASS,
} from "./heroStyles";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className={HERO_EYEBROW_ROW_CLASS}>
      <span className={HERO_EYEBROW_LINE_CLASS} />
      <span className={HERO_EYEBROW_TEXT_CLASS}>
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
    <section className={HERO_SECTION_CLASS}>
      <div className={HERO_HEADER_CLASS}>
        <div className={headerGridClass}>
          <div className="min-w-0">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={HERO_TITLE_CLASS}>
              {title}
            </h1>
            <p className={HERO_LEAD_CLASS}>
              {description}
            </p>
            {children ? <div className="mt-4 sm:mt-5">{children}</div> : null}
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
    <section className="mw-static-surface-soft relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/40 py-8 sm:py-10">
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
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {links.map((link) => (
        <a
          key={link.href + link.label}
          href={link.href}
          className={
            "mw-button-outline inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none sm:min-h-11 sm:px-4 " +
            (link.primary
              ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
              : "bg-[#fffdf8] text-slate-900 hover:bg-slate-900 hover:text-sky-100")
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
                <span
                  className={
                    "shrink-0 rounded-md bg-[#f7f4ee] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500" +
                    (item.href
                      ? " transition group-hover:bg-slate-800 group-hover:text-current"
                      : " mw-static-tile")
                  }
                >
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
              className="mw-button-outline mw-related-tool-link group block min-h-[142px] cursor-pointer rounded-xl bg-[#fffdf8] p-5 no-underline transition hover:bg-slate-900 hover:text-sky-100"
            >
              {body}
              <span className="mt-4 inline-block text-sm font-semibold text-sky-900">
                Open page{" "}
                <span aria-hidden="true" className="inline-block transition-colors">
                  -&gt;
                </span>
              </span>
            </a>
          );
        }

        return (
          <div key={item.title} className="mw-static-panel rounded-xl bg-[#fffdf8] p-5">
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
    <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft grid grid-cols-[1fr_1fr] bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 sm:grid-cols-[180px_1fr_2fr_120px]">
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
            className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
