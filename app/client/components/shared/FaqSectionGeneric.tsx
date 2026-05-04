import * as React from "react";

export type FaqItem = { q: string; a: string };
type FaqVariant = "default" | "home";

export default function FaqSectionGeneric({
  title,
  items,
  variant = "default",
}: {
  title: string;
  items: FaqItem[];
  variant?: FaqVariant;
}) {
  const headingId = React.useId();
  const sectionClass =
    variant === "home" ? "mt-12 sm:mt-16" : "mt-10 sm:mt-12";

  return (
    <section className={sectionClass} aria-labelledby={headingId}>
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            FAQ
          </span>
          <span className="h-px w-8 bg-sky-800" />
        </div>
        <h2
          id={headingId}
          className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
          Quick answers for common page questions and MorseWords tool behavior.
        </p>
      </div>

      <div className="mt-7 space-y-3">
        {items.map((it) => (
          <details
            key={it.q}
            className="group rounded-xl bg-[#fffaf2] px-4 outline outline-1 -outline-offset-1 outline-[rgba(11,36,71,0.12)] transition-colors open:bg-white hover:bg-white hover:outline-[rgba(11,36,71,0.24)] sm:px-5"
          >
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-lg font-extrabold leading-snug text-sky-950 transition hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:text-xl">
              <span>{it.q}</span>
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center font-mono text-lg text-sky-700 transition group-open:rotate-90 group-hover:text-sky-900">
                &gt;
              </span>
            </summary>
            <p className="pb-5 pr-8 text-base leading-relaxed text-slate-700 sm:text-lg">
              {it.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
