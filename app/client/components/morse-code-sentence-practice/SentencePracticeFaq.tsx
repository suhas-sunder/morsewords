import * as React from "react";

import { faqItems } from "~/client/components/morse-code-sentence-practice/SentencePracticeData";

export { faqItems as items };

export default function SentencePracticeFaq() {
  return (
    <section className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-sky-900">
        Morse code sentence practice FAQ
      </h2>
      <div className="mt-4 space-y-4">
        {faqItems.map((item) => (
          <details
            key={item.q}
            className="group border border-gray-200 rounded-xl p-4 bg-gray-50"
          >
            <summary className="cursor-pointer font-semibold text-neutral-900 list-none flex items-center justify-between">
              <span>{item.q}</span>
              <span className="ml-4 text-gray-500 group-open:rotate-180 transition-transform">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-gray-700 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
