import * as React from "react";

export type FaqItem = { q: string; a: string };
type FaqVariant = "default" | "home";

export default function FaqSectionGeneric({
  title,
  items,
  variant,
  description,
}: {
  title: string;
  items: FaqItem[];
  variant?: FaqVariant;
  description?: React.ReactNode;
}) {
  const headingId = React.useId();
  const useLightStyle = variant === undefined || variant === "home";

  if (useLightStyle) {
    const defaultDescription =
      variant === "home"
        ? "Quick answers for spacing, supported characters, and decoding pasted Morse."
        : null;
    const renderedDescription = description ?? defaultDescription;

    return (
      <section
        className={variant === "home" ? "mt-12 sm:mt-16" : "mt-10 sm:mt-12"}
        aria-labelledby={headingId}
      >
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
          {renderedDescription ? (
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
              {renderedDescription}
            </p>
          ) : null}
        </div>

        <div className="mt-7 space-y-3">
          {items.map((it) => (
            <details
              key={it.q}
              className="group rounded-xl bg-[#fffaf2] px-4 shadow-[0_7px_18px_rgba(11,36,71,0.07)] transition-colors open:bg-white hover:bg-white sm:px-5"
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

  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl bg-[#fffdf8]"
      aria-labelledby={headingId}
    >
      <div className="bg-[#fffaf2] px-5 pt-6 pb-4 sm:px-8 sm:pt-7 sm:pb-5">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            FAQ
          </span>
        </div>
        <h2
          id={headingId}
          className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
        >
          {title}
        </h2>
      </div>
      <div className="space-y-4 bg-[#fffdf8] px-5 pt-5 pb-7 sm:px-8 sm:pt-5 sm:pb-8">
        {items.map((it) => (
          <details key={it.q} className="group">
            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-5 rounded-xl bg-slate-950 px-6 py-6 text-xl font-medium leading-snug text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-[#fffdf8] active:scale-[0.99]">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sky-100 transition group-open:rotate-90 group-hover:bg-slate-700 group-hover:text-white">
                &gt;
              </span>
              <span className="leading-snug">{it.q}</span>
            </summary>
            <div className="px-1 pt-4">
              <p className="w-full max-w-none rounded-xl bg-white px-6 py-5 text-lg leading-relaxed text-slate-700 sm:text-xl">
                {it.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
