import * as React from "react";

type FaqItem = { q: string; a: string };

const items: FaqItem[] = [
  {
    q: "What makes this different from the translator?",
    a: "The translator converts anything you paste in. Practice mode gives you one prompt at a time and checks your answer, so you can drill and repeat without a full conversion UI.",
  },
  {
    q: "Do I need perfect spacing when I type Morse?",
    a: "No. Practice mode accepts common spacing styles and normalizes your input before checking. A single space between letters is fine.",
  },
  {
    q: "What does Mixed mode do?",
    a: "Mixed alternates between Text → Morse and Morse → Text prompts so you practice both directions.",
  },
  {
    q: "How is accuracy calculated?",
    a: "Accuracy is correct answers divided by attempts, shown as a percentage. Streak counts consecutive correct answers.",
  },
];

export default function PracticeFaq() {
  return (
    <section className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-neutral-900">Practice FAQ</h2>
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
