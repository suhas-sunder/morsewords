import React from "react";

type SiteRouteLink = {
  title: string;
  description: string;
  href: string;
  badge: string;
};

type RouteGroup = {
  eyebrow: string;
  title: string;
  description: string;
  links: SiteRouteLink[];
};

const ROUTE_GROUPS: RouteGroup[] = [
  {
    eyebrow: "Start here",
    title: "Core Morse tools",
    description:
      "Translate, encode, decode, and look up Morse code from the main learning tools.",
    links: [
      {
        title: "Morse Code Translator",
        description: "Convert text to Morse code and Morse code back to text.",
        href: "/",
        badge: "Main tool",
      },
      {
        title: "Morse Code Encoder",
        description: "Turn regular text into clean Morse code output.",
        href: "/morse-code-encoder",
        badge: "Encode",
      },
      {
        title: "Morse Code Decoder",
        description: "Decode dots, dashes, spaces, and separators into text.",
        href: "/morse-code-decoder",
        badge: "Decode",
      },
      {
        title: "Morse Code Dictionary",
        description: "Look up letters, numbers, punctuation, and common signals.",
        href: "/dictionary",
        badge: "Reference",
      },
    ],
  },
  {
    eyebrow: "Practice",
    title: "Learn by doing",
    description:
      "Use these pages for drills, typing practice, sentence work, and guided learning.",
    links: [
      {
        title: "Morse Code Practice",
        description: "Practice reading, writing, and recognizing Morse patterns.",
        href: "/practice",
        badge: "Practice",
      },
      {
        title: "Morse Code Typing",
        description: "Build speed and accuracy with typing-based Morse drills.",
        href: "/typing",
        badge: "Typing",
      },
      {
        title: "Sentence Practice",
        description: "Work with full sentence examples instead of single letters.",
        href: "/morse-code-sentence-practice",
        badge: "Sentences",
      },
      {
        title: "Morse Code Words",
        description: "Practice common words and word-level Morse patterns.",
        href: "/morse-code-words",
        badge: "Words",
      },
    ],
  },
  {
    eyebrow: "Charts + audio",
    title: "Reference and output tools",
    description:
      "Print charts, hear Morse audio, and understand formatting rules used in Morse code.",
    links: [
      {
        title: "Morse Code Alphabet",
        description: "View the full A-Z Morse code alphabet in one place.",
        href: "/morse-code-alphabet",
        badge: "Alphabet",
      },
      {
        title: "Printable Morse Code Chart",
        description:
          "Create a clean printable chart for students, teachers, or personal study.",
        href: "/morse-code-printable-chart",
        badge: "Printable",
      },
      {
        title: "Morse Code Sound Generator",
        description: "Generate Morse audio so learners can hear the rhythm.",
        href: "/morse-code-sound-generator",
        badge: "Audio",
      },
      {
        title: "Morse Code Audio",
        description: "Use audio-focused tools for listening and signal practice.",
        href: "/audio",
        badge: "Listen",
      },
    ],
  },
  {
    eyebrow: "Guides",
    title: "Helpful Morse code pages",
    description:
      "Extra pages for common examples, separators, and basic site guidance.",
    links: [
      {
        title: "How to Use",
        description: "Learn how to use the Morse code tools effectively.",
        href: "/how-to-use",
        badge: "Guide",
      },
      {
        title: "The Quick Brown Fox in Morse Code",
        description: "See a full pangram example converted into Morse code.",
        href: "/the-quick-brown-fox-morse-code",
        badge: "Example",
      },
      {
        title: "Morse Code Word Separator",
        description:
          "Understand spacing, slashes, and word separation in Morse code.",
        href: "/morse-code-word-separator",
        badge: "Formatting",
      },
      {
        title: "About",
        description: "Learn more about the site and its Morse code tools.",
        href: "/about",
        badge: "Site info",
      },
    ],
  },
];

const FEATURED_LINKS = [
  {
    title: "Translator",
    href: "/",
    label: "Text ↔ Morse",
  },
  {
    title: "Practice",
    href: "/practice",
    label: "Drills",
  },
  {
    title: "Printable chart",
    href: "/morse-code-printable-chart",
    label: "Classroom",
  },
  {
    title: "Sound generator",
    href: "/morse-code-sound-generator",
    label: "Audio",
  },
];

export default function RelatedTools() {
  return (
    <section id="morse-code-navigation" className="mt-10 max-w-[1200px] mx-auto">
      <div  className="rounded-[1.75rem] border border-sky-200 bg-sky-50/70 p-4 shadow-sm sm:p-6 lg:p-8">
        <div  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div  className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900">
                Morse code navigation
              </div>

              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-sky-800 sm:text-3xl">
                Explore the Morse code toolkit
              </h2>

              <p className="mt-3 lg:max-w-xl text-base leading-relaxed text-gray-700 sm:text-lg">
                Jump between the translator, encoder, decoder, practice pages,
                printable charts, audio tools, and Morse code reference guides.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:w-[34rem]">
              {FEATURED_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:shadow-md"
                >
                  <span className="font-extrabold">{item.title}</span>
                  <span className="text-sm font-extrabold">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5">
          {ROUTE_GROUPS.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wide text-sky-800">
                    {group.eyebrow}
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold tracking-tight text-sky-800 sm:text-2xl">
                    {group.title}
                  </h3>

                  <p className="mt-2 max-w-4xl text-base leading-relaxed text-gray-700">
                    {group.description}
                  </p>
                </div>

                <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-extrabold text-sky-900">
                  {group.links.length} pages
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {group.links.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group flex h-full cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-extrabold text-sky-800 sm:text-lg">
                        {item.title}
                      </p>

                      <span className="shrink-0 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-extrabold text-sky-900 transition group-hover:border-sky-300 group-hover:bg-white">
                        {item.badge}
                      </span>
                    </div>

                    <p className="mt-2 text-base leading-relaxed text-gray-700">
                      {item.description}
                    </p>

                    <div className="mt-auto pt-4 text-sm font-extrabold text-sky-800">
                      Open page{" "}
                      <span
                        aria-hidden="true"
                        className="inline-block transition group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 