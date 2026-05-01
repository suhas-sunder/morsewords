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
    <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-[#fffdf8] shadow-sm">
      <div className="border-b border-slate-200 bg-[#fffaf2] px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            Help notes
          </span>
        </div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          {title}
        </h2>
      </div>

      <div className="divide-y divide-slate-200 px-5 py-2 sm:px-8">
        {items.map((it) => (
          <details key={it.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-sky-950">
              <span>{it.q}</span>
              <span className="text-slate-500 transition-transform group-open:rotate-180">
                v
              </span>
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
