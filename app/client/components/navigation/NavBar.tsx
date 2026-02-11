import * as React from "react";
import { useLocation } from "react-router";

import logoUrl from "~/client/assets/images/logo.png";

type NavItem = { label: string; href: string };

const MAIN_ITEMS: NavItem[] = [
  { label: "Translator", href: "/" },
  { label: "Audio", href: "/audio" },
  { label: "Practice", href: "/practice" },
  { label: "Typing", href: "/typing" },
  { label: "How to use", href: "/how-to-use" },
];

const MORE_ITEMS: NavItem[] = [
  { label: "Dictionary", href: "/dictionary" },
  { label: "Morse code encoder", href: "/morse-code-encoder" },
  { label: "Morse code decoder", href: "/morse-code-decoder" },
  {
    label: "Quick Brown Fox (Morse)",
    href: "/the-quick-brown-fox-morse-code",
  },
  { label: "Word separator", href: "/morse-code-word-separator" },
  { label: "About", href: "/about" },
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

  // Remix provides location during SSR and on the client.
  // Using it avoids SSR/client divergence caused by window.location.
  const location = useLocation();
  const pathname = normalizePathname(props.pathname ?? location.pathname);

  const moreWrapRef = React.useRef<HTMLDivElement | null>(null);

  // Close mobile menu on route change.
  React.useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Click outside closes More dropdown
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

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between py-3">
          <a
            href="/"
            className="flex items-center gap-3 cursor-pointer transition text-white hover:text-sky-200"
          >
            <img
              src={logoUrl}
              alt="MorseWords"
              className="h-10 w-10 rounded-sm"
              loading="eager"
            />
            <div className="leading-tight">
              <div className="text-lg font-extrabold">MorseWords</div>
              <div className="text-sm sm:text-xs text-sky-200">
                Translate, listen, and practice Morse code
              </div>
            </div>
          </a>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {MAIN_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={
                    "px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition " +
                    (active
                      ? "bg-sky-200 text-neutral-900"
                      : "text-white hover:bg-sky-200 hover:text-neutral-900")
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
                  "px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition inline-flex items-center " +
                  (moreActive || moreOpen
                    ? "bg-sky-200 text-neutral-900"
                    : "text-white hover:bg-sky-200 hover:text-neutral-900")
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
                  className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
                >
                  <div className="p-2">
                    {MORE_ITEMS.map((item) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className={
                            "block w-full px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition " +
                            (active
                              ? "bg-sky-50 text-sky-900 border border-sky-200"
                              : "text-neutral-900 hover:bg-gray-50")
                          }
                          aria-current={active ? "page" : undefined}
                          onClick={() => setMoreOpen(false)}
                        >
                          {item.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={
              "md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold cursor-pointer transition " +
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

        {/* Mobile menu (flat list, no dropdown) */}
        {open ? (
          <nav id="mobile-nav" className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              {[...MAIN_ITEMS, ...MORE_ITEMS].map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={
                      "w-full px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition " +
                      (active
                        ? "bg-sky-200 text-neutral-900"
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
