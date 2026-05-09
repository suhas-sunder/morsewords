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
  route("name-to-morse-code", "routes/name-to-morse-code.tsx"),
  route("morse-code-encoder", "routes/morse-code-encoder.tsx"),
  route("morse-code-decoder", "routes/morse-code-decoder.tsx"),
  route(
    "the-quick-brown-fox-morse-code",
    "routes/the-quick-brown-fox-morse-code.tsx",
  ),
  route("morse-code-word-separator", "routes/morse-code-word-separator.tsx"),
  route("morse-code-words", "routes/morse-code-words.tsx"),
  route("morse-code-alphabet", "routes/morse-code-alphabet.tsx"),
  route("a-in-morse-code", "routes/a-in-morse-code.tsx"),
  route("e-in-morse-code", "routes/e-in-morse-code.tsx"),
  route("s-in-morse-code", "routes/s-in-morse-code.tsx"),
  route("o-in-morse-code", "routes/o-in-morse-code.tsx"),
  route("q-in-morse-code", "routes/q-in-morse-code.tsx"),
  route("morse-code-numbers", "routes/morse-code-numbers.tsx"),
  route("morse-code-printable-chart", "routes/morse-code-printable-chart.tsx"),
  route(
    "morse-code-international-translator",
    "routes/morse-code-international-translator.tsx",
  ),
  route("morse-code-sos", "routes/morse-code-sos.tsx"),
  route("morse-code-sentence-practice", "routes/morse-code-sentence-practice.tsx"),
  route("learn-morse-code", "routes/learn-morse-code.tsx"),
  route("morse-code-timing", "routes/morse-code-timing.tsx"),
  route("farnsworth-timing", "routes/farnsworth-timing.tsx"),
  route("morse-code-word-trainer", "routes/morse-code-word-trainer.tsx"),
  route("sources", "routes/sources.tsx"),
  route("morse-code-prosigns", "routes/morse-code-prosigns.tsx"),
  route("morse-code-q-codes", "routes/morse-code-q-codes.tsx"),
  route("morse-code-punctuation", "routes/morse-code-punctuation.tsx"),
  route("morse-code-practice-plan", "routes/morse-code-practice-plan.tsx"),
  route(
    "international-morse-code-reference",
    "routes/international-morse-code-reference.tsx",
  ),
  route("morse-code-audio-practice", "routes/morse-code-audio-practice.tsx"),
  route(
    "morse-code-word-search-builder",
    "routes/morse-code-word-search-builder.tsx",
  ),
  route("morse-code-visual-practice", "routes/morse-code-visual-practice.tsx"),
  route("morse-code-audio-quiz", "routes/morse-code-audio-quiz.tsx"),
  route("morse-code-visual-quiz", "routes/morse-code-visual-quiz.tsx"),
  route("morse-code-vidual-quiz", "routes/morse-code-vidual-quiz.tsx"),
  route("morse-code-sound-generator", "routes/morse-code-sound-generator.tsx"),
  route("how-to-read-morse-code", "routes/how-to-read-morse-code.tsx"),
  route("how-to-write-in-morse-code", "routes/how-to-write-in-morse-code.tsx"),
  route("how-to-type-in-morse-code", "routes/how-to-type-in-morse-code.tsx"),
  route("copy-and-paste-morse-code", "routes/copy-and-paste-morse-code.tsx"),
  route("morse-code-without-spaces", "routes/morse-code-without-spaces.tsx"),
  route("i-love-you-in-morse-code", "routes/i-love-you-in-morse-code.tsx"),
  route("cq-in-morse-code", "routes/cq-in-morse-code.tsx"),
  route("question-mark-in-morse-code", "routes/question-mark-in-morse-code.tsx"),
  route("at-sign-in-morse-code", "routes/at-sign-in-morse-code.tsx"),
  route("sitemap", "routes/sitemap.tsx"),

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
