import * as React from "react";

import { PlayIcon } from "~/client/assets/svg/Icons";
import { MobileUpperContentBannerAd } from "~/client/components/ads/AdSenseAds";
import { ActionLinkButton } from "./ActionControls";
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

export const WAVE_PAGE_MAIN_CLASS =
  "mx-auto w-full max-w-[1120px] px-4 pb-0 pt-2 sm:px-6 sm:pt-4 lg:px-8";

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
            <MobileUpperContentBannerAd />
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
  layout = "split",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
  layout?: "split" | "stacked";
}) {
  if (layout === "stacked") {
    return (
      <section className="mt-9 sm:mt-11">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(260px,0.28fr)] lg:items-end">
          <div className="min-w-0">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="mw-text-muted mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          {aside ? <div className="min-w-0 lg:justify-self-end">{aside}</div> : null}
        </div>
        <div className="mt-6">{children}</div>
      </section>
    );
  }

  return (
    <section className="mt-9 sm:mt-11">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mw-heading mt-3 text-2xl font-extrabold tracking-tight text-sky-950 sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mw-text-muted mt-3 max-w-[34ch] text-base leading-relaxed text-slate-700">
              {description}
            </p>
          ) : null}
        </div>
        <div className="min-w-0">
          {aside ? <div className="mb-5">{aside}</div> : null}
          {children}
        </div>
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
    <aside className="mw-panel-dark rounded-xl bg-slate-950 p-4 text-slate-200">
      <p className="mw-output-muted font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>
      {value ? (
        <p className="mw-output-text mt-2 font-mono text-lg font-bold tracking-[0.18em] text-sky-100">
          {value}
        </p>
      ) : null}
      <div className="mw-output-soft mt-2 text-sm leading-relaxed text-slate-200">{children}</div>
    </aside>
  );
}

type StaticSurfaceElement = "article" | "aside" | "div" | "section";

type StaticSurfaceProps = React.HTMLAttributes<HTMLElement> & {
  as?: StaticSurfaceElement;
  children: React.ReactNode;
};

function createStaticSurface({
  as = "div",
  baseClassName,
  className = "",
  children,
  ...props
}: StaticSurfaceProps & { baseClassName: string }) {
  return React.createElement(
    as,
    {
      ...props,
      className: [baseClassName, className].filter(Boolean).join(" "),
    },
    children,
  );
}

export function StaticPanel(props: StaticSurfaceProps) {
  return createStaticSurface({
    ...props,
    baseClassName: "mw-static-panel rounded-xl bg-[#fffdf8] p-5",
  });
}

export function StaticTile(props: StaticSurfaceProps) {
  return createStaticSurface({
    ...props,
    baseClassName: "mw-static-tile rounded-xl bg-[#f7f4ee] p-5",
  });
}

export function StaticSectionPanel(props: StaticSurfaceProps) {
  return createStaticSurface({
    ...props,
    baseClassName: "mw-surface rounded-xl bg-[#fffdf8] p-6 sm:p-7",
  });
}

export function StaticCodeBlock({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { children: React.ReactNode }) {
  return (
    <pre
      {...props}
      className={[
        "mw-static-code mw-code-surface whitespace-pre-wrap rounded-xl bg-[#f7f4ee] p-4 font-mono overflow-x-auto",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </pre>
  );
}

export function ActionLinks({
  className = "",
  layout = "wrap",
  links,
}: {
  className?: string;
  layout?: "grid" | "wrap";
  links: Array<{
    href: string;
    icon?: React.ReactNode;
    label: string;
    primary?: boolean;
  }>;
}) {
  const baseClassName =
    layout === "grid" ? "grid gap-2" : "flex flex-wrap gap-1.5 sm:gap-2";

  return (
    <div className={[baseClassName, className].filter(Boolean).join(" ")}>
      {links.map((link) => (
        <ActionLinkButton
          key={link.href + link.label}
          href={link.href}
          className={layout === "grid" ? "min-w-0 text-center" : undefined}
          full={layout === "grid"}
          tone={link.primary ? "dark" : "light"}
          size="md"
          leadingIcon={link.icon}
        >
          {link.label}
        </ActionLinkButton>
      ))}
    </div>
  );
}

export function SimpleGrid({
  items,
  variant = "plain",
  linkedItemStyle = "card",
}: {
  items: Array<{ title: string; text: string; href?: string; badge?: string }>;
  variant?: "plain" | "cards";
  linkedItemStyle?: "card" | "inline";
}) {
  return (
    <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
      {items.map((item) => {
        const body = (
          <>
            <div className="flex items-start justify-between gap-4">
              <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                {item.title}
              </h3>
              {item.badge ? (
                <span
                  className={
                    "mw-muted-label shrink-0 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500" +
                    (item.href ? " mw-related-badge" : " mw-static-tile")
                  }
                >
                  {item.badge}
                </span>
              ) : null}
            </div>
            <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
              {item.text}
            </p>
          </>
        );

        if (item.href) {
          if (linkedItemStyle === "card") {
            return (
              <a
                key={item.title}
                href={item.href}
                className="mw-button-outline mw-related-tool-link mw-surface group block min-h-[128px] cursor-pointer rounded-xl bg-[#fffdf8] p-4 no-underline hover:bg-[#fffaf2] hover:text-sky-950 sm:p-5"
              >
                {body}
                <span className="mw-link mt-4 inline-block text-sm font-semibold text-sky-900">
                  Open {item.title}{" "}
                  <span aria-hidden="true" className="inline-block">
                    -&gt;
                  </span>
                </span>
              </a>
            );
          }

          return (
            <div key={item.title} className="py-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="mw-heading text-lg font-extrabold leading-snug">
                  <a
                    href={item.href}
                    className="mw-link inline-flex cursor-pointer items-center gap-1.5 text-sky-900 underline decoration-sky-900/40 underline-offset-4 hover:decoration-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  >
                    {item.title}
                    <span aria-hidden="true" className="font-mono text-sm">
                      -&gt;
                    </span>
                  </a>
                </h3>
                {item.badge ? (
                  <span className="mw-muted-label inline-flex align-middle font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                {item.text}
              </p>
            </div>
          );
        }

        if (variant === "cards") {
          return (
            <div key={item.title} className="mw-static-panel rounded-xl bg-[#fffdf8] p-4 sm:p-5">
              {body}
            </div>
          );
        }

        return (
          <div key={item.title} className="py-1">
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
    <div className="mw-static-panel mw-reference-table overflow-hidden rounded-xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft mw-muted-label grid grid-cols-[1fr_1fr] bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 sm:grid-cols-[180px_1fr_2fr_120px]">
        <span>Name</span>
        <span>Morse</span>
        <span className="hidden sm:block">Use</span>
        <span className="hidden text-right sm:block">Audio</span>
      </div>
      {items.map((item) => (
        <div
          key={item.label}
          className="mw-reference-row grid gap-3 px-4 py-4 even:bg-[#fffaf2] sm:grid-cols-[180px_1fr_2fr_120px] sm:items-center"
        >
          <div>
            <p className="mw-heading font-bold text-sky-950">{item.label}</p>
            {item.example ? (
              <p className="mw-muted-label mt-1 font-mono text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                {item.example}
              </p>
            ) : null}
          </div>
          <p className="mw-input-text font-mono text-base font-bold tracking-[0.16em] text-slate-950">
            {item.morse}
          </p>
          <p className="mw-text-muted text-sm leading-relaxed text-slate-700">{item.description}</p>
          <button
            type="button"
            onClick={() => onPlay?.(item.morse)}
            className="mw-button-secondary mw-light-interactive-link inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-900 transition-[background-color,border-color,color] duration-100 ease-out hover:bg-[#fffaf2] hover:text-sky-950 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
