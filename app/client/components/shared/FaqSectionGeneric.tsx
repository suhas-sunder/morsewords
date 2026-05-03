import * as React from "react";

export type FaqItem = { q: string; a: string };

export default function FaqSectionGeneric({
  title,
  items,
}: {
  title: string;
  items: FaqItem[];
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-[#fffdf8] shadow-sm">
      <div className="border-b border-slate-200 bg-[#fffaf2] px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            FAQ
          </span>
        </div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          {title}
        </h2>
      </div>
      <div className="space-y-3 bg-[#fffdf8] px-5 py-6 sm:px-8 sm:py-7">
        {items.map((it) => (
          <details
            key={it.q}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 text-base font-semibold text-slate-950">
              <span className="text-sky-900 transition-transform group-open:rotate-90">
                &gt;
              </span>
              <span>{it.q}</span>
            </summary>
            <p className="mt-3 max-w-[72ch] text-base leading-relaxed text-slate-700">
              {it.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
