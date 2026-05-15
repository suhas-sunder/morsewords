import * as React from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";

import logoUrl from "~/client/assets/images/logo.png";
import DisplaySettingsToggle from "./DisplaySettingsToggle";
import ThemeToggle from "./ThemeToggle";

type NavItem = {
  label: string;
  href: string;
  description?: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const MAIN_ITEMS: NavItem[] = [
  { label: "Translator", href: "/" },
  { label: "Audio", href: "/audio" },
  { label: "Practice", href: "/practice" },
  { label: "Worksheets", href: "/morse-code-printable-chart" },
  { label: "Typing", href: "/typing" },
  { label: "How to use", href: "/how-to-use" },
];

const MORE_GROUPS: NavGroup[] = [
  {
    title: "Learn Morse code",
    items: [
      {
        label: "Learn Morse code",
        href: "/learn-morse-code",
        description: "Start with letters, sound, words, and short sessions.",
      },
      {
        label: "How to read Morse",
        href: "/how-to-read-morse-code",
        description: "Read rhythm, spacing, and beginner examples.",
      },
      {
        label: "How to write Morse",
        href: "/how-to-write-in-morse-code",
        description: "Write letters, words, punctuation, and word gaps.",
      },
      {
        label: "Practice plan",
        href: "/morse-code-practice-plan",
        description: "Follow a 2-week or 6-week practice path.",
      },
      {
        label: "Timing guide",
        href: "/morse-code-timing",
        description: "Understand WPM, spacing, dots, and dashes.",
      },
      {
        label: "Farnsworth timing",
        href: "/farnsworth-timing",
        description: "Slow the gaps while keeping character speed steady.",
      },
    ],
  },
  {
    title: "Practice and drills",
    items: [
      {
        label: "Sentence practice",
        href: "/morse-code-sentence-practice",
        description: "Practice short sentence-style prompts.",
      },
      {
        label: "Word trainer",
        href: "/morse-code-word-trainer",
        description: "Repeat custom words and weak words.",
      },
      {
        label: "Audio practice",
        href: "/morse-code-audio-practice",
        description: "Listen and recognize Morse by ear.",
      },
      {
        label: "Audio quiz",
        href: "/morse-code-audio-quiz",
        description: "Test listening recall with score feedback.",
      },
      {
        label: "Visual practice",
        href: "/morse-code-visual-practice",
        description: "Recognize dot-dash patterns by sight.",
      },
      {
        label: "Visual quiz",
        href: "/morse-code-visual-quiz",
        description: "Test visual recognition with feedback.",
      },
    ],
  },
  {
    title: "Reference and lookup",
    items: [
      {
        label: "Morse code alphabet",
        href: "/morse-code-alphabet",
        description: "View A-Z Morse patterns in one place.",
      },
      {
        label: "Morse code numbers",
        href: "/morse-code-numbers",
        description: "Review the 0-9 number chart and pattern logic.",
      },
      {
        label: "Dictionary",
        href: "/dictionary",
        description: "Look up letters, numbers, punctuation, and signals.",
      },
      {
        label: "International reference",
        href: "/international-morse-code-reference",
        description: "Check International Morse code reference patterns.",
      },
      {
        label: "Punctuation",
        href: "/morse-code-punctuation",
        description: "Find supported punctuation and spacing notes.",
      },
      {
        label: "Prosigns",
        href: "/morse-code-prosigns",
        description: "Review common procedural signal patterns.",
      },
      {
        label: "Q-codes",
        href: "/morse-code-q-codes",
        description: "Browse common Q-code meanings and use cases.",
      },
      {
        label: "Morse code words",
        href: "/morse-code-words",
        description: "Explore common word examples and practice ideas.",
      },
      {
        label: "SOS in Morse code",
        href: "/morse-code-sos",
        description: "Understand the SOS distress pattern.",
      },
      {
        label: "Quick Brown Fox",
        href: "/the-quick-brown-fox-morse-code",
        description: "Use the pangram for full alphabet practice.",
      },
    ],
  },
  {
    title: "Conversion and tools",
    items: [
      {
        label: "Morse code encoder",
        href: "/morse-code-encoder",
        description: "Turn regular text into clean Morse output.",
      },
      {
        label: "Name to Morse code",
        href: "/name-to-morse-code",
        description: "Convert names and open them in audio or translator tools.",
      },
      {
        label: "Morse code decoder",
        href: "/morse-code-decoder",
        description: "Decode dots, dashes, spaces, and separators.",
      },
      {
        label: "Word separator",
        href: "/morse-code-word-separator",
        description: "Fix Morse word and letter spacing.",
      },
      {
        label: "How to separate words",
        href: "/how-to-separate-words-in-morse-code",
        description: "Follow step-by-step spacing and slash examples.",
      },
      {
        label: "Copy and paste Morse",
        href: "/copy-and-paste-morse-code",
        description: "Use safe dots, dashes, spaces, and slashes.",
      },
      {
        label: "Sound generator",
        href: "/morse-code-sound-generator",
        description: "Generate Morse tone clips with audio settings.",
      },
      {
        label: "International translator",
        href: "/morse-code-international-translator",
        description: "Convert international text to Morse with transliteration.",
      },
      {
        label: "Word search builder",
        href: "/morse-code-word-search-builder",
        description: "Build printable Morse learning puzzles.",
      },
    ],
  },
  {
    title: "About and trust",
    items: [
      {
        label: "About MorseWords",
        href: "/about",
        description: "Learn what the site is for and who it helps.",
      },
      {
        label: "Sources",
        href: "/sources",
        description: "Review reference approach and site notes.",
      },
      {
        label: "Sitemap",
        href: "/sitemap",
        description: "See the public page index.",
      },
    ],
  },
];

const MOBILE_GROUPS: NavGroup[] = [
  {
    title: "Start here",
    items: MAIN_ITEMS,
  },
  ...MORE_GROUPS,
];

const MORE_ITEMS = MORE_GROUPS.flatMap((group) => group.items);

const desktopNavLinkClass =
  "mw-nav-link -mx-2 -my-2 inline-flex cursor-pointer items-center whitespace-nowrap px-2 py-2 text-sm font-semibold transition";

function normalizePathname(raw: string) {
  const base = raw.split("#")[0]?.split("?")[0] ?? "/";
  if (base.length > 1 && base.endsWith("/")) return base.slice(0, -1);
  return base || "/";
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function anyActive(pathname: string, items: NavItem[]) {
  return items.some((it) => isActive(pathname, it.href));
}

function BurgerIcon(props: { open: boolean }) {
  const { open } = props;

  return (
    <span className="relative inline-flex h-6 w-7 items-center justify-center">
      <span
        className={
          "mw-nav-burger-line absolute block h-0.5 w-7 bg-white transition-transform duration-200 " +
          (open ? "translate-y-0 rotate-45" : "-translate-y-1.5 rotate-0")
        }
      />
      <span
        className={
          "mw-nav-burger-line absolute block h-0.5 w-7 bg-white transition-opacity duration-200 " +
          (open ? "opacity-0" : "opacity-100")
        }
      />
      <span
        className={
          "mw-nav-burger-line absolute block h-0.5 w-7 bg-white transition-transform duration-200 " +
          (open ? "translate-y-0 -rotate-45" : "translate-y-1.5 rotate-0")
        }
      />
    </span>
  );
}

function ChevronDown(props: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={
        "ml-2 h-3 w-3 transition-transform duration-150 " +
        (props.open ? "rotate-180" : "rotate-0")
      }
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function NavBar(props: { pathname?: string }) {
  const [open, setOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [moreQuery, setMoreQuery] = React.useState("");
  const [mobileQuery, setMobileQuery] = React.useState("");

  const location = useLocation();
  const pathname = normalizePathname(props.pathname ?? location.pathname);

  const moreWrapRef = React.useRef<HTMLDivElement | null>(null);
  const moreDialogRef = React.useRef<HTMLDivElement | null>(null);
  const moreSearchRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
    setMoreQuery("");
    setMobileQuery("");
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!moreOpen) return;
    window.setTimeout(() => moreSearchRef.current?.focus(), 0);
  }, [moreOpen]);

  React.useEffect(() => {
    if (!moreOpen) return;

    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node | null;
      const trigger = moreWrapRef.current;
      const dialog = moreDialogRef.current;

      if (
        target &&
        ((trigger && trigger.contains(target)) ||
          (dialog && dialog.contains(target)))
      ) {
        return;
      }

      setMoreOpen(false);
    }

    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }

    function onPageScroll(e: Event) {
      const target = e.target;
      const dialog = moreDialogRef.current;

      if (target instanceof Node && dialog?.contains(target)) {
        return;
      }

      setMoreOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    window.addEventListener("scroll", onPageScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
      window.removeEventListener("scroll", onPageScroll);
    };
  }, [moreOpen]);

  const moreActive = anyActive(pathname, MORE_ITEMS);
  function filterGroups(rawQuery: string, groups = MORE_GROUPS) {
    const normalizedQuery = rawQuery.trim().toLowerCase();

    return groups.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (isActive(pathname, item.href)) return false;
        if (!normalizedQuery) return true;

        const haystack = `${group.title} ${item.label} ${
          item.description ?? ""
        } ${item.href}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    })).filter((group) => group.items.length > 0);
  }

  const filteredMoreGroups = filterGroups(moreQuery);
  const filteredMobileGroups = filterGroups(mobileQuery, MOBILE_GROUPS);

  function handleAllToolsClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("morse-code-navigation");

    setOpen(false);
    setMoreOpen(false);

    if (!target) return;

    e.preventDefault();

    const headerOffset = 16;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const scrollTo = Math.max(targetTop - headerOffset, 0);

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", "#morse-code-navigation");
  }

  return (
    <header className="mw-nav-shell relative z-50 bg-neutral-900 backdrop-blur">
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-3 py-3">
          <a
            href="/"
            className="mw-nav-link flex min-w-0 cursor-pointer items-center gap-3 text-white transition hover:text-sky-200 min-[1400px]:shrink-0"
          >
            <img
              src={logoUrl}
              alt="MorseWords"
              className="h-10 w-10 shrink-0 rounded-sm"
              loading="eager"
            />

            <div className="min-w-0 leading-tight">
              <div className="truncate text-lg font-extrabold">MorseWords</div>
              <div className="mw-nav-muted truncate text-sm text-sky-200 sm:text-xs">
                Translate, listen, and practice Morse code
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-4 min-[1400px]:flex min-[1536px]:gap-6">
            <a
              href="#morse-code-navigation"
              onClick={handleAllToolsClick}
              className={`${desktopNavLinkClass} text-white hover:text-sky-200`}
            >
              All tools
            </a>

            {MAIN_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={
                    desktopNavLinkClass +
                    " " +
                    (active ? "mw-nav-active text-sky-200" : "text-white hover:text-sky-200")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}

            <div ref={moreWrapRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={
                  desktopNavLinkClass +
                  " " +
                  (moreActive || moreOpen
                    ? "mw-nav-active text-sky-200"
                    : "text-white hover:text-sky-200")
                }
                aria-haspopup="dialog"
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown open={moreOpen} />
              </button>

              {moreOpen && typeof document !== "undefined" ? (
                createPortal(
                <div
                  ref={moreDialogRef}
                  role="dialog"
                  aria-label="More MorseWords tools"
                  className="mw-nav-panel fixed left-1/2 top-16 z-[9999] w-[min(96vw,1680px)] -translate-x-1/2 overflow-hidden rounded-2xl bg-neutral-900 text-sky-100"
                >
                  <div className="px-5 py-5">
                    <label className="block w-full">
                      <span className="sr-only">Search MorseWords tools</span>
                      <input
                        ref={moreSearchRef}
                        value={moreQuery}
                        onChange={(event) => setMoreQuery(event.target.value)}
                        type="search"
                        placeholder="Search tools..."
                        className="mw-nav-input min-h-10 w-full rounded-xl bg-neutral-800 px-3 py-2 text-sm font-semibold text-sky-100 outline-none placeholder:text-sky-100/55 focus:bg-neutral-800"
                      />
                    </label>
                  </div>

                  <div className="mw-nav-menu-scroll max-h-[70vh] overflow-y-auto px-5 pb-5 pt-2">
                    {filteredMoreGroups.length > 0 ? (
                      <div className="grid gap-x-8 gap-y-6 lg:grid-cols-3 xl:grid-cols-5">
                        {filteredMoreGroups.map((group) => (
                          <section key={group.title}>
                            <h2 className="mw-nav-muted font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-sky-200/70">
                              {group.title}
                            </h2>
                            <div className="mt-2 grid gap-1.5">
                              {group.items.map((item) => {
                                const active = isActive(pathname, item.href);

                                return (
                                  <a
                                    key={item.href}
                                    href={item.href}
                                    className={
                                      "group block cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold transition " +
                                      (active
                                        ? "mw-nav-item-active bg-sky-100 text-slate-950"
                                        : "mw-nav-item text-sky-100 hover:bg-neutral-800 hover:text-white")
                                    }
                                    aria-current={active ? "page" : undefined}
                                    onClick={() => setMoreOpen(false)}
                                  >
                                    <span className="flex items-center justify-between gap-3">
                                      <span>{item.label}</span>
                                      <span
                                        aria-hidden="true"
                                        className={
                                          active
                                            ? "mw-nav-item-arrow text-slate-700"
                                            : "mw-nav-item-arrow text-sky-200 opacity-0 group-hover:opacity-100"
                                        }
                                      >
                                        -&gt;
                                      </span>
                                    </span>
                                    {item.description ? (
                                      <span
                                        className={
                                          "mt-1 block max-w-[34ch] text-xs leading-snug " +
                                          (active
                                            ? "mw-nav-item-description text-slate-700"
                                            : "mw-nav-item-description text-sky-100/65")
                                        }
                                      >
                                        {item.description}
                                      </span>
                                    ) : null}
                                  </a>
                                );
                              })}
                            </div>
                          </section>
                        ))}
                      </div>
                    ) : (
                      <p className="mw-nav-item-description py-6 text-sm font-semibold text-sky-100/70">
                        No tools match that search.
                      </p>
                    )}
                  </div>
                </div>,
                document.body,
                )
              ) : null}
            </div>

            <DisplaySettingsToggle onOpen={() => setMoreOpen(false)} />
            <ThemeToggle />
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mw-nav-link inline-flex shrink-0 cursor-pointer items-center justify-center px-3 py-2 text-sm font-semibold text-white transition hover:text-sky-200 min-[1400px]:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <BurgerIcon open={open} />
          </button>
        </div>

        {open && typeof document !== "undefined" ? (
          createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="mw-nav-panel fixed inset-0 z-[9999] bg-neutral-900 text-sky-100 min-[1400px]:hidden"
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between px-4 py-3">
                <a
                  href="/"
                  onClick={() => setOpen(false)}
                  className="mw-nav-link flex cursor-pointer items-center gap-3 text-white transition hover:text-sky-200"
                >
                  <img
                    src={logoUrl}
                    alt="MorseWords"
                    className="h-12 w-12 rounded-sm"
                    loading="eager"
                  />

                  <div className="hidden leading-tight">
                    <div className="text-xl font-extrabold">MorseWords</div>
                    <div className="mw-nav-muted text-sm text-sky-200">
                      Translate, listen, and practice Morse code
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-2">
                  <DisplaySettingsToggle
                    className="h-12 w-12"
                    onOpen={() => setMoreOpen(false)}
                  />
                  <ThemeToggle className="h-12 w-12" />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mw-nav-link inline-flex h-12 w-12 cursor-pointer items-center justify-center text-white transition hover:text-sky-200"
                    aria-label="Close navigation"
                    aria-controls="mobile-nav"
                  >
                    <BurgerIcon open={true} />
                  </button>
                </div>
              </div>

              <nav
                id="mobile-nav"
                className="mw-mobile-nav-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-3"
              >
                <div className="flex flex-col">
              <label className="block px-3">
                <span className="sr-only">Search MorseWords tools</span>
                <input
                  value={mobileQuery}
                  onChange={(event) => setMobileQuery(event.target.value)}
                  type="search"
                  placeholder="Search tools..."
                  className="mw-nav-input min-h-12 w-full rounded-xl bg-neutral-800 px-4 py-3 text-base font-semibold text-sky-100 outline-none placeholder:text-sky-100/55 focus:bg-neutral-800"
                />
              </label>

              {filteredMobileGroups.length > 0 ? (
                filteredMobileGroups.map((group) => (
                <div key={group.title} className="mt-7">
                  <div className="mw-nav-item-description px-4 pb-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-sky-100/50">
                    {group.title}
                  </div>
                  <div className="grid gap-2">
                    {group.items.map((item) => {
                      const active = isActive(pathname, item.href);

                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          className={
                            "flex min-h-12 w-full cursor-pointer items-center rounded-xl px-4 text-base font-extrabold leading-snug transition " +
                            (active
                              ? "mw-nav-mobile-active bg-neutral-800 text-sky-200"
                              : "mw-nav-mobile-item text-white hover:bg-neutral-800 hover:text-sky-100")
                          }
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
                ))
              ) : (
                <p className="mw-nav-item-description px-3 py-6 text-sm font-semibold text-sky-100/70">
                  No tools match that search.
                </p>
              )}
                </div>
              </nav>
            </div>
          </div>,
          document.body,
          )
        ) : null}
      </div>
    </header>
  );
}
