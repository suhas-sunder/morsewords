import * as React from "react";

type FaqItem = { q: string; a: string };

export const items: FaqItem[] = [
  {
    q: "How is /typing different from /practice?",
    a: "/typing is freeform and user-driven. There are no prompts, no grading, and no progression. It behaves like a scratchpad so you can type continuously and build fluency and rhythm.",
  },
  {
    q: "What input does it accept?",
    a: "Type dots (.) and dashes (-) with spaces between letters. Use a slash (/) or three spaces to separate words. The decoded text updates instantly as you type.",
  },
  {
    q: "Does this teach Morse code?",
    a: "No. This tool assumes you already know Morse and want repetition and endurance without interruptions.",
  },
  {
    q: "Can I use a keying-friendly layout?",
    a: "Yes. You can switch to a key mapping (F = dit, J = dah) so you can practice muscle memory without typing punctuation.",
  },
  {
    q: "Can I copy what I typed?",
    a: "Yes. You can copy the decoded output at any time. Clearing only affects this page and does not store anything on a server.",
  },
];

export default function TypingFaq() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-extrabold text-gray-900">FAQ</h2>
      <div className="mt-4 space-y-4">
        {items.map((it) => (
          <details
            key={it.q}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <summary className="cursor-pointer select-none font-bold text-gray-900">
              {it.q}
            </summary>
            <p className="mt-2 text-gray-700">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
