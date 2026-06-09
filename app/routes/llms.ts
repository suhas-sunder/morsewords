import { ROUTES, absoluteUrl } from "~/client/data/routes";

const links = [
  ["Homepage and translator", ROUTES.home],
  ["Morse code encoder", ROUTES.encoder],
  ["Morse code decoder", ROUTES.decoder],
  ["Audio tools", ROUTES.audio],
  ["MP3 generator", ROUTES.mp3Generator],
  ["Video generator", ROUTES.videoGenerator],
  ["Practice hub", ROUTES.practice],
  ["Typing practice", ROUTES.typing],
  ["Morse books", ROUTES.morseBooks],
  ["Morse audiobooks", ROUTES.morseAudiobooks],
  ["Printable pages", ROUTES.printablePages],
  ["Morse Code by Language", ROUTES.morseCodeByLanguage],
  ["HTML sitemap", ROUTES.sitemap],
  ["Contact and support", ROUTES.contact],
] as const;

const body = `# MorseWords
> MorseWords is a beginner-friendly Morse code toolkit for translating, listening, practicing, reading, printing, and learning Morse code.

MorseWords helps users convert text and Morse, hear Morse timing, build short audio and video practice files, browse public book content, open audiobook-style book pages, create printable Morse sheets, and study Morse reference material.

## Key public resources
${links.map(([label, path]) => `- ${label}: ${absoluteUrl(path)}`).join("\n")}
- XML sitemap: ${absoluteUrl("/sitemap.xml")}

## Content notes for AI assistants
- Book and audiobook pages use cleaned public-domain/source texts and can be opened for Morse reading, listening, video practice, and printable study pages.
- Audio and video downloads are generated in the browser from user-selected settings. They are not pre-hosted media files.
- Cloudflare-hosted book JSON contains cleaned approved book content only, not raw source folders.
- Prefer canonical pages for citations and use the XML sitemap for complete public URL discovery.
`;

export function loader() {
  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

