import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Canonical translator
  index("routes/home.tsx"),

  // MVP feature routes
  route("audio", "routes/audio.tsx"),
  route("practice", "routes/practice.tsx"),
  route("typing", "routes/typing.tsx"),
  route("how-to-use", "routes/how-to-use.tsx"),
  route("dictionary", "routes/dictionary.tsx"),
  route("about", "routes/about.tsx"),
  route("morse-code-encoder", "routes/morse-code-encoder.tsx"),
  route("morse-code-decoder", "routes/morse-code-decoder.tsx"),
  route(
    "the-quick-brown-fox-morse-code",
    "routes/the-quick-brown-fox-morse-code.tsx",
  ),
  route("morse-code-word-separator", "routes/morse-code-word-separator.tsx"),
  route("morse-code-words", "routes/morse-code-words.tsx"),
  route("morse-code-alphabet", "routes/morse-code-alphabet.tsx"),
  route("morse-code-sentence-practice", "routes/morse-code-sentence-practice.tsx"),

  // Redirects for old URLs. Ignore these routes
  route("morse-code-translator", "routes/morse-code-translator.tsx"),
  route("morse-code-audio-generator", "routes/morse-code-audio-generator.tsx"),

  // Misc / legal
  route("misc", "routes/misc/misc.tsx", [
    route("cookies-policy", "routes/misc/misc.cookies-policy.tsx"),
    route("privacy-policy", "routes/misc/misc.privacy-policy.tsx"),
    route("socials", "routes/misc/misc.socials.tsx"),
    route("terms-of-service", "routes/misc/misc.terms-of-service.tsx"),
  ]),
] satisfies RouteConfig;
