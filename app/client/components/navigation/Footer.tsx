import { Link } from "react-router";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div>
      <SocialLinks />
      <footer className=" w-full border-t border-gray-200 bg-neutral-900 text-sm text-gray-300">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <nav
            aria-label="Footer navigation"
            className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6"
          >
            <Link
              to="/"
              className="cursor-pointer font-semibold text-white transition hover:text-sky-200"
            >
              Home
            </Link>

            <Link
              to="/sitemap"
              className="cursor-pointer transition hover:text-sky-200"
            >
              Sitemap
            </Link>

            <Link
              to="/misc/privacy-policy"
              className="cursor-pointer transition hover:text-sky-200"
            >
              Privacy Policy
            </Link>

            <Link
              to="/misc/terms-of-service"
              className="cursor-pointer transition hover:text-sky-200"
            >
              Terms of Service
            </Link>

            <Link
              to="/misc/cookies-policy"
              className="cursor-pointer transition hover:text-sky-200"
            >
              Cookies Policy
            </Link>

            <Link
              to="/misc/socials"
              className="cursor-pointer transition hover:text-sky-200"
            >
              Socials
            </Link>
            <Link
              to="/about"
              className="cursor-pointer transition hover:text-sky-200"
            >
              About
            </Link>
          </nav>

          <div className="text-center leading-relaxed">
            <div className="mb-1 text-gray-400">
              © 2025{" "}-{" "}{year}{" "}
              <span className="font-semibold text-white">MorseWords</span>
              <span className=""> ~</span>
              <span className=""> By Suhas Sunder</span>
            </div>

            <div className="text-sky-200">
              Fast, practical tools for translating, listening to, and
              practicing Morse code.
            </div>

            <div className="mt-2 text-xs text-gray-500">
              -- .- -.. . / .-- .. - .... / 💖
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
