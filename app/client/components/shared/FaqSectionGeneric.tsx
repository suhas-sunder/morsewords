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
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-sky-950">
        {title}
      </h2>
      <div className="mt-4 space-y-4">
        {items.map((it) => (
          <details
            key={it.q}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 font-extrabold text-slate-950">
              <span className="text-slate-950 transition-transform group-open:rotate-90">
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
