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

  if (variant === "home") {
    const defaultDescription =
      "Quick answers for spacing, supported characters, and decoding pasted Morse.";
    const renderedDescription = description ?? defaultDescription;

    return (
      <section
        className="mt-8 sm:mt-10"
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
              className="group rounded-xl"
            >
              <summary className="mw-button-outline flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl bg-[#fffaf2] px-4 py-4 text-left text-lg font-extrabold leading-snug text-sky-950 transition hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:px-5 sm:text-xl">
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
      className="mt-10 sm:mt-12"
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
        {description ? (
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-7 space-y-3">
        {items.map((it) => (
          <details key={it.q} className="group rounded-xl">
            <summary className="mw-faq-trigger flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl bg-[#fffaf2] px-4 py-4 text-left text-lg font-extrabold leading-snug text-sky-950 transition hover:bg-slate-950 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 group-open:bg-slate-950 group-open:text-sky-100 sm:px-5 sm:text-xl">
              <span>{it.q}</span>
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center font-mono text-lg text-sky-700 transition group-open:rotate-90 group-open:text-sky-100">
                &gt;
              </span>
            </summary>
            <div className="mw-faq-answer mw-static-surface-soft mt-2 rounded-xl px-5 py-4">
              <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
                {it.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
