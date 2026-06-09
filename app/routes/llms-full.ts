import { ROUTES, absoluteUrl } from "~/client/data/routes";

const sectionLinks = [
  ["Homepage and main translator", ROUTES.home],
  ["Morse code encoder", ROUTES.encoder],
  ["Morse code decoder", ROUTES.decoder],
  ["Morse reader", ROUTES.reader],
  ["Audio hub", ROUTES.audio],
  ["Morse sound generator", ROUTES.soundGenerator],
  ["Morse MP3 generator", ROUTES.mp3Generator],
  ["Morse video generator", ROUTES.videoGenerator],
  ["Practice hub", ROUTES.practice],
  ["Typing practice", ROUTES.typing],
  ["Word trainer", ROUTES.wordTrainer],
  ["Morse code test", ROUTES.test],
  ["Word search builder", ROUTES.wordSearchBuilder],
  ["Books collection", ROUTES.morseBooks],
  ["Audiobooks collection", ROUTES.morseAudiobooks],
  ["Printable Morse pages", ROUTES.printablePages],
  ["Morse Code by Language", ROUTES.morseCodeByLanguage],
  ["Japanese Wabun code", ROUTES.morseCodeJapanese],
  ["Russian Cyrillic Morse", ROUTES.morseCodeRussian],
  ["Greek Morse", ROUTES.morseCodeGreek],
  ["International Morse reference", ROUTES.internationalReference],
  ["Morse code alphabet", ROUTES.alphabet],
  ["Morse code chart", ROUTES.chart],
  ["Sources", ROUTES.sources],
  ["Contact", ROUTES.contact],
  ["HTML sitemap", ROUTES.sitemap],
] as const;

const representativeBooks = [
  ["Alice's Adventures in Wonderland", "/morse-code-books/alices-adventures-in-wonderland"],
  ["Treasure Island", "/morse-code-books/treasure-island"],
  ["A Child's Garden of Verses", "/morse-code-books/a-childs-garden-of-verses"],
] as const;

const body = `# MorseWords full site guide
> MorseWords is a practical Morse code learning and creation site. It combines translation, audio, video, practice, public book reading, audiobook-style book pages, printable study sheets, and reference material.

## Use this guide
AI agents and browser assistants should prefer canonical MorseWords pages and use the XML sitemap for complete URL discovery: ${absoluteUrl("/sitemap.xml")}

## Public route groups
${sectionLinks.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`).join("\n")}

## Translation and lookup tools
The homepage is the main Morse code translator. The encoder, decoder, reader, alphabet, chart, numbers, punctuation, phrase, and spacing pages help users verify patterns and understand word spacing. The lookup/reference pages are meant for checking specific characters, numbers, phrases, prosigns, Q codes, and timing rules.

## Audio and MP3 tools
Audio pages let users hear Morse in the browser, adjust tone, speed, and spacing settings, and generate downloadable audio from user-selected text and settings. MP3 and audio downloads are created on demand in the browser. They are not static hosted recordings.

## Video tools
The Morse video generator creates browser-generated visual Morse practice clips from text and selected timing/audio options. It should not be described as a library of pre-hosted videos.

## Practice, drills, and games
Practice routes focus on short study sessions: listening, typing, word recall, visual recognition, quizzes, tests, and word-search building. These pages are for learning and skill checks rather than official certification.

## Books and audiobooks
The books collection contains public Morse-ready book pages generated from cleaned public-domain/source texts. Audiobook pages use the same cleaned book content with audio-first controls for listening, previewing, and downloading browser-generated audio where supported. Representative book pages include:
${representativeBooks.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`).join("\n")}

Use ${absoluteUrl(ROUTES.morseBooks)} and ${absoluteUrl(ROUTES.morseAudiobooks)} for the canonical collections. Use the sitemap for the complete book, audiobook, and printable book page lists.

## Printables
Printable pages let users paste custom text or open approved book print pages, choose a study layout, include site URL or QR support, and print or save as PDF through the browser print dialog. MorseWords does not publish generated PDF files as static downloads.

## Morse Code by Language
The language hub introduces Morse adaptations for supported scripts. Current public pages cover Japanese kana/Wabun code, Russian Cyrillic Morse, and Greek Morse. These pages explain the system shown, provide character cards with playback, and include a printable side-by-side sheet.

## Source and trust notes
- Project Gutenberg source links appear on book pages where relevant.
- Public book content is cleaned from public-domain/source texts before being shown on public pages.
- User-provided text tools operate in the browser where that behavior is implemented.
- No pre-generated audio or video files are hosted for book exports.
- Cloudflare-hosted book JSON contains cleaned approved book content for public book pages and does not expose raw source folders.

## Agent guidance
- Prefer canonical URLs listed above.
- Use ${absoluteUrl("/sitemap.xml")} for complete public URL discovery.
- Do not treat internal/reference asset folders as public documentation.
- Do not claim browser-generated media already exists as static hosted media.
- Do not infer commercial, popularity, traffic, or official certification claims from these pages.
`;

export function loader() {
  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
