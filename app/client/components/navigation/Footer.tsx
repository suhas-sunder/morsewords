import { Link } from "react-router";

import logoUrl from "~/client/assets/images/logo.png";
import SocialLinks from "./SocialLinks";

const footerLinks = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Sitemap", to: "/sitemap" },
  { label: "Sources", to: "/sources" },
  { label: "Socials", to: "/misc/socials" },
  { label: "Privacy", to: "/misc/privacy-policy" },
  { label: "Terms", to: "/misc/terms-of-service" },
  { label: "Cookies", to: "/misc/cookies-policy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div>
      <SocialLinks />
      <footer className="mw-footer-shell w-full bg-neutral-900 text-sm text-gray-300">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-between">
            <Link
              to="/"
              className="mw-footer-brand flex cursor-pointer items-center gap-3 text-white transition hover:text-sky-200"
              aria-label="MorseWords home"
            >
              <img
                src={logoUrl}
                alt=""
                className="h-9 w-9 rounded-sm"
                loading="lazy"
              />
              <span className="leading-tight">
                <span className="block text-base font-extrabold">
                  MorseWords
                </span>
                <span className="mw-nav-muted block text-xs text-sky-200">
                  Translate, listen, practice
                </span>
              </span>
            </Link>

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center"
            >
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="mw-footer-link cursor-pointer transition hover:text-sky-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="text-center leading-relaxed">
            <div className="mw-footer-muted mb-1 text-gray-400">
              &copy; 2025-{year}{" "}
              <span className="mw-footer-brand font-semibold text-white">MorseWords</span>
              <span className=""> ~</span>
              <span className=""> By Suhas Sunder</span>
            </div>

            <div className="mw-nav-muted text-sky-200">
              Fast, practical tools for translating, listening to, and
              practicing Morse code.
            </div>

            <div className="mw-footer-faint mt-2 text-xs text-gray-500">
              -- .- -.. . / .-- .. - .... / .-.. --- ...- .
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
