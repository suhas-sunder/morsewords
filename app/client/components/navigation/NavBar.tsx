import * as React from "react";

import logoUrl from "~/client/assets/images/logo.png";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Translator", href: "/" },
  { label: "Audio", href: "/audio" },
  { label: "Practice", href: "/practice" },
  { label: "Typing", href: "/typing" },
  { label: "How to use", href: "/how-to-use" },
  { label: "Dictionary", href: "/dictionary" },
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

/**
 * Fixes "Translator flashes active" by preventing an SSR/hydration default "/"
 * from being used as the active pathname.
 *
 * If pathname is not provided:
 * - On SSR we render with "unknown" pathname (no active item).
 * - On client mount we read window.location.pathname once and set it.
 *
 * This eliminates the incorrect brief active state.
 */
function useResolvedPathname(provided?: string) {
  const providedNormalized = provided ? normalizePathname(provided) : undefined;

  const [pathname, setPathname] = React.useState<string | null>(() => {
    if (providedNormalized) return providedNormalized;
    if (typeof window === "undefined") return null; // unknown during SSR
    return normalizePathname(window.location.pathname);
  });

  React.useEffect(() => {
    if (providedNormalized) {
      setPathname(providedNormalized);
      return;
    }
    // If no pathname prop, resolve once on mount.
    setPathname(normalizePathname(window.location.pathname));
  }, [providedNormalized]);

  return pathname;
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

export default function NavBar(props: { pathname?: string }) {
  const [open, setOpen] = React.useState(false);
  const pathname = useResolvedPathname(props.pathname);

  // Close mobile menu on route change (only when we actually have a pathname).
  React.useEffect(() => {
    if (!pathname) return;
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 backdrop-blur ">
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
              <div className="text-lg font-extrabold ">MorseWords</div>
              <div className=" text-sm sm:text-xs text-sky-200">
                Translate, listen, and practice Morse code
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname ? isActive(pathname, item.href) : false;
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
          </nav>

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

        {open ? (
          <nav id="mobile-nav" className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const active = pathname ? isActive(pathname, item.href) : false;

                // Match desktop styling: same active and hover behavior, but full-width rows.
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
