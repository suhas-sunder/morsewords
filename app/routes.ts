import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Canonical translator
  index("routes/home.tsx"),

  // MVP feature routes
  route("audio", "routes/audio.tsx"),
  route("morse-code-translator", "routes/morse-code-translator.tsx"),
  route("practice", "routes/practice.tsx"),
  route("typing", "routes/typing.tsx"),
  route("how-to-use", "routes/how-to-use.tsx"),
  route("dictionary", "routes/dictionary.tsx"),
  route("about", "routes/about.tsx"),

  // Misc / legal
  route("misc", "routes/misc/misc.tsx", [
    route("cookies-policy", "routes/misc/misc.cookies-policy.tsx"),
    route("privacy-policy", "routes/misc/misc.privacy-policy.tsx"),
    route("socials", "routes/misc/misc.socials.tsx"),
    route("terms-of-service", "routes/misc/misc.terms-of-service.tsx"),
  ]),
] satisfies RouteConfig;
