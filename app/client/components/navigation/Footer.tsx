import { Link } from "react-router";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 w-full border-t border-black/10 py-8 text-center text-sm font-nunito text-skull-brown">
      <nav
        aria-label="Footer navigation"
        className="mb-4 flex flex-wrap items-center justify-center gap-4"
      >
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <span className="opacity-50">|</span>

        <Link to="/misc/privacy-policy" className="hover:underline">
          Privacy Policy
        </Link>

        <span className="opacity-50">|</span>

        <Link to="/misc/terms-of-service" className="hover:underline">
          Terms of Service
        </Link>

        <span className="opacity-50">|</span>

        <Link to="/misc/cookies-policy" className="hover:underline">
          Cookies Policy
        </Link>

        <span className="opacity-50">|</span>

        <Link to="/misc/socials" className="hover:underline">
          Socials
        </Link>
      </nav>

      <p className="leading-relaxed">
        © {year} MorseWords. Educational learning tools for Morse code.
        <br />
        -- .- -.. . ..--.- .-- .. - .... ..--.-💖!
      </p>
    </footer>
  );
}
