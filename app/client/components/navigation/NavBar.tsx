import * as React from "react";
import { useLocation } from "react-router";

import logoUrl from "~/client/assets/images/logo.png";

type NavItem = { label: string; href: string };

const MAIN_ITEMS: NavItem[] = [
  { label: "Translator", href: "/" },
  { label: "Audio", href: "/audio" },
  { label: "Practice", href: "/practice" },
  { label: "Worksheets", href: "/morse-code-printable-chart" },
  { label: "Typing", href: "/typing" },
  { label: "How to use", href: "/how-to-use" },
];

const MORE_ITEMS: NavItem[] = [
  { label: "Learn Morse code", href: "/learn-morse-code" },
  { label: "Practice plan", href: "/morse-code-practice-plan" },
  {
    label: "Morse code sentence practice",
    href: "/morse-code-sentence-practice",
  },
  { label: "Word trainer", href: "/morse-code-word-trainer" },
  { label: "Audio practice", href: "/morse-code-audio-practice" },
  { label: "Visual practice", href: "/morse-code-visual-practice" },
  { label: "Audio quiz", href: "/morse-code-audio-quiz" },
  { label: "Visual quiz", href: "/morse-code-visual-quiz" },
  { label: "Dictionary", href: "/dictionary" },
  { label: "Morse code words (chart)", href: "/morse-code-words" },
  { label: "Worksheet generator", href: "/morse-code-worksheet-generator" },
  { label: "Word search builder", href: "/morse-code-word-search-builder" },
  {
    label: "International translator",
    href: "/morse-code-international-translator",
  },
  {
    label: "International reference",
    href: "/international-morse-code-reference",
  },
  { label: "SOS in Morse code", href: "/morse-code-sos" },
  { label: "Morse code encoder", href: "/morse-code-encoder" },
  { label: "Morse code decoder", href: "/morse-code-decoder" },
  { label: "Timing guide", href: "/morse-code-timing" },
  { label: "Farnsworth timing", href: "/farnsworth-timing" },
  { label: "Prosigns", href: "/morse-code-prosigns" },
  { label: "Q-codes", href: "/morse-code-q-codes" },
  { label: "Punctuation", href: "/morse-code-punctuation" },
  {
    label: "Quick Brown Fox (Morse)",
    href: "/the-quick-brown-fox-morse-code",
  },
  { label: "Word separator", href: "/morse-code-word-separator" },
  { label: "About", href: "/about" },
  { label: "Sources", href: "/sources" },
  { label: "Morse code alphabet", href: "/morse-code-alphabet" },
];

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
    <span className="relative inline-flex h-4 w-5 items-center justify-center">
      <span
        className={
          "absolute block h-0.5 w-5 bg-neutral-900 transition-transform duration-200 " +
          (open ? "translate-y-0 rotate-45" : "-translate-y-1.5 rotate-0")
        }
      />
      <span
        className={
          "absolute block h-0.5 w-5 bg-neutral-900 transition-opacity duration-200 " +
          (open ? "opacity-0" : "opacity-100")
        }
      />
      <span
        className={
          "absolute block h-0.5 w-5 bg-neutral-900 transition-transform duration-200 " +
          (open ? "translate-y-0 -rotate-45" : "translate-y-1.5 rotate-0")
        }
      />
    </span>
  );
}

function ChevronDown(props: { open: boolean }) {
  return (
    <span
      className={
        "ml-2 inline-block transition-transform duration-150 " +
        (props.open ? "rotate-180" : "rotate-0")
      }
      aria-hidden="true"
    >
      ▾
    </span>
  );
}

export default function NavBar(props: { pathname?: string }) {
  const [open, setOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const location = useLocation();
  const pathname = normalizePathname(props.pathname ?? location.pathname);

  const moreWrapRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!moreOpen) return;

    function onDocMouseDown(e: MouseEvent) {
      const el = moreWrapRef.current;
      if (!el) return;

      const target = e.target as Node | null;
      if (target && !el.contains(target)) setMoreOpen(false);
    }

    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [moreOpen]);

  const moreActive = anyActive(pathname, MORE_ITEMS);

  function handleAllToolsClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById("morse-code-navigation");

    setOpen(false);
    setMoreOpen(false);

    if (!target) return;

    e.preventDefault();

    const headerOffset = 100;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const scrollTo = Math.max(targetTop - headerOffset, 0);

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", "#morse-code-navigation");
  }

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between py-3">
          <a
            href="/"
            className="flex cursor-pointer items-center gap-3 text-white transition hover:text-sky-200"
          >
            <img
              src={logoUrl}
              alt="MorseWords"
              className="h-10 w-10 rounded-sm"
              loading="eager"
            />

            <div className="leading-tight">
              <div className="text-lg font-extrabold">MorseWords</div>
              <div className="text-sm text-sky-200 sm:text-xs">
                Translate, listen, and practice Morse code
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#morse-code-navigation"
              onClick={handleAllToolsClick}
              className="text-sm font-semibold text-white transition cursor-pointer hover:text-sky-200"
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
                    "text-sm font-semibold transition cursor-pointer " +
                    (active ? "text-sky-200" : "text-white hover:text-sky-200")
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
                  "inline-flex items-center text-sm font-semibold transition cursor-pointer " +
                  (moreActive || moreOpen
                    ? "text-sky-200"
                    : "text-white hover:text-sky-200")
                }
                aria-haspopup="menu"
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown open={moreOpen} />
              </button>

              {moreOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-4 w-80 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-xl ring-1 ring-black/5"
                >
                  <div className="border-b border-sky-100 bg-sky-50 px-4 py-3">
                    <p className="text-sm font-extrabold text-sky-900">
                      More Morse tools
                    </p>
                    <p className="mt-1 text-xs font-medium text-sky-900/70">
                      Practice pages, charts, guides, and utilities.
                    </p>
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto p-2">
                    {MORE_ITEMS.map((item) => {
                      const active = isActive(pathname, item.href);

                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className={
                            "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition " +
                            (active
                              ? "bg-sky-100 text-sky-950"
                              : "text-neutral-900 hover:bg-sky-50 hover:text-sky-900")
                          }
                          aria-current={active ? "page" : undefined}
                          onClick={() => setMoreOpen(false)}
                        >
                          <span>{item.label}</span>
                          <span
                            aria-hidden="true"
                            className={
                              "text-xs transition " +
                              (active
                                ? "text-sky-800"
                                : "text-sky-700 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100")
                            }
                          >
                            →
                          </span>
                        </a>
                      );
                    })}
                  </div>

                  <div className="border-t border-sky-100 bg-sky-50/70 p-2">
                    <a
                      href="#morse-code-navigation"
                      onClick={handleAllToolsClick}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-sm font-extrabold text-sky-900 transition hover:border-sky-300 hover:bg-sky-100"
                    >
                      <span>View all tools</span>
                      <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={
              "inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold transition cursor-pointer md:hidden " +
              (open ? "bg-gray-100" : "bg-white") +
              " hover:bg-gray-100"
            }
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <BurgerIcon open={open} />
          </button>
        </div>

        {open ? (
          <nav id="mobile-nav" className="pb-4 md:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#morse-code-navigation"
                onClick={handleAllToolsClick}
                className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-white transition cursor-pointer hover:bg-sky-200 hover:text-neutral-900"
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
                      "w-full rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer " +
                      (active
                        ? "text-sky-200"
                        : "text-white hover:bg-sky-200 hover:text-neutral-900")
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}

              {MORE_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={
                      "w-full rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer " +
                      (active
                        ? "text-sky-200"
                        : "text-white hover:bg-sky-200 hover:text-neutral-900")
                    }
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
