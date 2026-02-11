import React from "react";

type RelatedLink = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

const RELATED_LINKS: RelatedLink[] = [
  {
    title: "TypingStories",
    description: "Timed typing practice with engaging stories and passages.",
    href: "https://ilovetimers.com",
    badge: "Typing Practice",
  },
  {
    title: "iLoveWordSearch",
    description: "Explore word puzzles and pattern recognition.",
    href: "https://ilovewordsearch.com",
    badge: "Word Puzzles",
  },
  {
    title: "WordMythology",
    description: "Word games and vocabulary exploration.",
    href: "https://wordmythology.com",
    badge: "Fun with words",
  },
];

export default function RelatedTools() {
  return (
    <section className="mt-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900 border border-sky-200">
              Related tools
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-800 tracking-tight">
            Keep practicing
          </h2>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            A small set of adjacent tools for timed practice and word-based
            skill development.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {RELATED_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-gray-200 bg-white p-5 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-base sm:text-lg font-extrabold text-sky-800">
                  {item.title}
                </p>

                {item.badge ? (
                  <span className="shrink-0 inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs sm:text-sm font-extrabold text-sky-900 border border-sky-200">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-base sm:text-lg text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
