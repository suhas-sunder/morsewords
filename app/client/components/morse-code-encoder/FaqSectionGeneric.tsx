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
    <section className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
      <div className="mt-4 space-y-4">
        {items.map((it) => (
          <details
            key={it.q}
            className="group border border-gray-200 rounded-xl p-4 bg-gray-50"
          >
            <summary className="cursor-pointer font-semibold text-neutral-900 list-none flex items-center justify-between">
              <span>{it.q}</span>
              <span className="ml-4 text-gray-500 group-open:rotate-180 transition-transform">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-gray-700 leading-relaxed">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
