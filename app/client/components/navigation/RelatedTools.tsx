import { useLocation } from "react-router";

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
        description:
          "Look up letters, numbers, punctuation, and common signals.",
        href: "/dictionary",
        badge: "Reference",
      },
      {
        title: "International Morse Reference",
        description:
          "Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.",
        href: "/international-morse-code-reference",
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
        title: "Learn Morse Code",
        description:
          "Follow a practical path through alphabet, words, audio, sentences, and worksheets.",
        href: "/learn-morse-code",
        badge: "Learn",
      },
      {
        title: "Practice Plan",
        description: "Use a 2-week or 6-week routine across the MorseWords tools.",
        href: "/morse-code-practice-plan",
        badge: "Plan",
      },
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
        title: "Word Trainer",
        description: "Practice built-in and custom Morse word lists.",
        href: "/morse-code-word-trainer",
        badge: "Words",
      },
      {
        title: "Audio Practice",
        description: "Practice copying Morse by ear with focused prompts.",
        href: "/morse-code-audio-practice",
        badge: "Listen",
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
        title: "Printable Morse Worksheets",
        description:
          "Build printable charts, learner templates, and teacher-ready handouts.",
        href: "/morse-code-printable-chart",
        badge: "Worksheets",
      },
      {
        title: "Morse Code Audio Generator",
        description:
          "Generate Morse audio for listening, practice, and downloadable clips.",
        href: "/audio",
        badge: "Listen",
      },
      {
        title: "Word Search Builder",
        description:
          "Create printable Morse vocabulary puzzles from custom word lists.",
        href: "/morse-code-word-search-builder",
        badge: "Puzzle",
      },
      {
        title: "Morse Code Word Separator",
        description:
          "Understand spaces, slashes, and word breaks in pasted Morse.",
        href: "/morse-code-word-separator",
        badge: "Formatting",
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
        title: "Morse Code Timing",
        description: "Understand dot, dash, WPM, PARIS, and spacing ratios.",
        href: "/morse-code-timing",
        badge: "Timing",
      },
      {
        title: "Farnsworth Timing",
        description:
          "Learn character speed, effective speed, and learner spacing.",
        href: "/farnsworth-timing",
        badge: "Audio",
      },
      {
        title: "Morse Code Prosigns",
        description: "Look up SOS, AR, SK, BT, KN, and other operating signs.",
        href: "/morse-code-prosigns",
        badge: "Signals",
      },
      {
        title: "Morse Code Q-Codes",
        description: "Browse common Q-codes with meanings and examples.",
        href: "/morse-code-q-codes",
        badge: "Q-code",
      },
      {
        title: "Morse Punctuation",
        description: "Find period, comma, question mark, slash, and symbols.",
        href: "/morse-code-punctuation",
        badge: "Symbols",
      },
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
        title: "Sources",
        description: "See the standards and references used by MorseWords pages.",
        href: "/sources",
        badge: "Trust",
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

const HOME_GROUPS: RouteGroup[] = [
  {
    eyebrow: "Start here",
    title: "Core tools",
    description: "Translate, encode, decode, and look up Morse patterns.",
    links: ROUTE_GROUPS[0].links.slice(0, 4),
  },
  {
    eyebrow: "Practice",
    title: "Learn by doing",
    description: "Move into drills, typing, and guided study when ready.",
    links: ROUTE_GROUPS[1].links.slice(0, 4),
  },
  {
    eyebrow: "Reference",
    title: "Charts and audio",
    description: "Print, listen, and understand the timing rules.",
    links: [
      ROUTE_GROUPS[2].links[0],
      ROUTE_GROUPS[2].links[1],
      ROUTE_GROUPS[2].links[2],
      ROUTE_GROUPS[3].links[0],
    ],
  },
];

const FEATURED_LINKS = [
  {
    title: "Translator",
    href: "/",
    label: "Text to Morse",
  },
  {
    title: "Practice",
    href: "/practice",
    label: "Drills",
  },
  {
    title: "Printable chart",
    href: "/morse-code-printable-chart",
    label: "Worksheets",
  },
  {
    title: "Audio",
    href: "/audio",
    label: "Audio",
  },
];

export default function RelatedTools() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return isHome ? <HomeToolkit /> : <FullToolkit />;
}

function HomeToolkit() {
  return (
    <section
      id="morse-code-navigation"
      className="mx-auto mt-8 max-w-[1040px] px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-[#f4efe5]/65 px-1 py-8 sm:px-2 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="max-w-[42rem]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Morse code navigation
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              Explore the Morse code toolkit
            </h2>

            <p className="mt-4 max-w-[38rem] text-base leading-relaxed text-slate-700 sm:text-lg">
              Start with the core translator, then move into practice, audio,
              worksheets, and reference pages as needed.
            </p>
          </div>

          <aside>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-sky-900">
              Quick access
            </p>

            <div className="mt-3 grid gap-2">
              {FEATURED_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="mw-button-outline group flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-950 px-4 py-3 text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none active:scale-[0.99]"
                >
                  <span className="text-base font-semibold leading-snug text-current">
                    {item.title}
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-sky-100 transition group-hover:text-white">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {HOME_GROUPS.map((group) => (
            <section key={group.title}>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {group.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-sky-950">
                {group.title}
              </h3>
              <p className="mt-3 max-w-[22rem] text-base leading-relaxed text-slate-600">
                {group.description}
              </p>

              <div className="mt-5 grid gap-2">
                {group.links.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="mw-button-outline group flex cursor-pointer items-start justify-between gap-4 rounded-xl bg-[#fffdf8]/86 px-4 py-3 transition hover:bg-slate-900 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  >
                    <span>
                      <span className="block text-base font-extrabold leading-snug text-sky-950 transition group-hover:text-current">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-700 group-hover:text-current">
                        {item.description}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-md bg-[#f7f4ee] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 transition group-hover:bg-slate-800 group-hover:text-current">
                      {item.badge}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <details className="mt-8">
          <summary className="mw-button-outline flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg bg-[#fffdf8] px-4 py-3 font-extrabold text-sky-950 transition hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
            <span>View the full MorseWords toolkit</span>
            <span className="font-mono text-sm text-sky-700">+</span>
          </summary>

          <div className="grid gap-7 py-5 lg:grid-cols-2">
            {ROUTE_GROUPS.map((group) => (
              <section key={group.title}>
                <h4 className="text-lg font-extrabold text-sky-950">
                  {group.title}
                </h4>
                <div className="mt-3 grid gap-2">
                  {group.links.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="mw-button-outline inline-flex cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold text-sky-900 transition hover:bg-slate-900 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}

function FullToolkit() {
  return (
    <section
      id="morse-code-navigation"
      className="mx-auto mt-8 max-w-[1040px] px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-[#f4efe5]/65 px-1 py-8 sm:px-2 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="max-w-[44rem]">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Morse code navigation
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
              Explore the Morse code toolkit
            </h2>

            <p className="mt-4 max-w-[38rem] text-base leading-relaxed text-slate-700 sm:text-lg">
              Jump between the translator, encoder, decoder, practice pages,
              printable charts, audio tools, and Morse code reference guides.
            </p>
          </div>

          <aside className="rounded-xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-sky-900">
              Quick access
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {FEATURED_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="mw-button-outline mw-related-quick-link group flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-950 px-4 py-3 text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none"
                >
                  <span className="text-base font-semibold leading-snug text-current">
                    {item.title}
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-sky-100 transition group-hover:text-white">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 space-y-8">
          {ROUTE_GROUPS.map((group) => (
            <section key={group.title}>
              <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                <header>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {group.eyebrow}
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-sky-950">
                    {group.title}
                  </h3>

                  <p className="mt-3 max-w-[18rem] text-base leading-relaxed text-slate-600">
                    {group.description}
                  </p>

                  <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {group.links.length} pages
                  </p>
                </header>

                <div className="grid gap-3 md:grid-cols-2">
                  {group.links.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="mw-button-outline mw-related-tool-link group flex min-h-[150px] cursor-pointer flex-col rounded-xl bg-[#fffdf8]/86 p-5 text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="max-w-[17rem] text-[1.05rem] font-extrabold leading-snug text-sky-950 transition group-hover:text-current sm:text-[1.15rem]">
                          {item.title}
                        </h4>

                        <span className="shrink-0 rounded-md bg-[#f7f4ee] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 transition group-hover:bg-slate-800 group-hover:text-current">
                          {item.badge}
                        </span>
                      </div>

                      <p className="mt-3 max-w-[30ch] text-base leading-relaxed text-slate-700 group-hover:text-current">
                        {item.description}
                      </p>

                      <span className="mt-auto pt-5 text-sm font-extrabold text-sky-900 group-hover:text-current">
                        Open page{" "}
                        <span
                          aria-hidden="true"
                          className="inline-block transition-colors"
                        >
                          -&gt;
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
