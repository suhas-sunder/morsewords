import * as React from "react";
import { Link } from "react-router";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { PageHero } from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import {
  LETTER_ITEMS,
  NUMBER_ITEMS,
  PHRASE_PAGES,
  SYMBOL_PAGES,
} from "~/client/data/morseContent";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/sitemap";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const letterSitemapLinks = LETTER_ITEMS.map((item) => ({
  label: `${item.letter} in Morse Code`,
  to: item.path,
  description: `Study ${item.letter} as ${item.morseValue} with sound, examples, and practice links.`,
}));

const numberSitemapLinks = NUMBER_ITEMS.map((item) => ({
  label: `${item.digit} in Morse Code`,
  to: item.path,
  description: `Study ${item.digit} as ${item.morseValue} with rhythm, examples, and practice links.`,
}));

const phraseSitemapLinks = Object.values(PHRASE_PAGES).map((item) => ({
  label: item.displayTitle,
  to: item.path,
  description: item.metaDescription,
}));

const symbolSitemapLinks = Object.values(SYMBOL_PAGES).map((item) => ({
  label: item.displayTitle,
  to: item.path,
  description: item.metaDescription,
}));

type SitemapGroup = {
  title: string;
  description: string;
  links: Array<{ label: string; to: string; description: string }>;
};

const GROUPS: SitemapGroup[] = [
  {
    title: "Core Morse tools",
    description: "Translate, encode, decode, and play Morse code.",
    links: [
      {
        label: "Morse Code Translator with Audio",
        to: "/",
        description: "Convert text to Morse, decode Morse to text, and play audio.",
      },
      {
        label: "Morse Code Audio Generator",
        to: "/audio",
        description:
          "Generate Morse code audio from text or Morse input for practice and downloads.",
      },
      {
        label: "Morse Code Audio Decoder",
        to: "/morse-code-audio-decoder",
        description:
          "Upload clean Morse audio and decode it into raw dots and dashes plus readable text.",
      },
      {
        label: "Name to Morse Code",
        to: "/name-to-morse-code",
        description:
          "Convert names into Morse code, copy the output, and open it in audio tools.",
      },
      {
        label: "Morse Code Sound Generator",
        to: "/morse-code-sound-generator",
        description:
          "Create Morse code beeps, tune the tone, and export MP3 or WAV audio.",
      },
      {
        label: "Morse Code MP3 Generator",
        to: "/morse-code-mp3-generator",
        description:
          "Type text or Morse, preview the tone, and download a browser-generated MP3 file.",
      },
      {
        label: "Morse Code Encoder",
        to: "/morse-code-encoder",
        description: "Turn English text into Morse code dots and dashes.",
      },
      {
        label: "Morse Code Decoder",
        to: "/morse-code-decoder",
        description: "Convert Morse code back into readable text.",
      },
      {
        label: "Morse Code Reader",
        to: "/morse-code-reader",
        description:
          "Paste typed dots, dashes, spaces, and slashes to read the decoded text.",
      },
      {
        label: "International Morse Code Translator",
        to: "/morse-code-international-translator",
        description:
          "Translate English and international words into Morse code with transliteration.",
      },
      {
        label: "International Morse Code Reference",
        to: "/international-morse-code-reference",
        description:
          "Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.",
      },
    ],
  },
  {
    title: "Practice and learning",
    description: "Build recognition, accuracy, and speed with practical drills.",
    links: [
      {
        label: "Learn Morse Code",
        to: "/learn-morse-code",
        description:
          "Follow a practical path through alphabet, practice, audio, words, sentences, and worksheets.",
      },
      {
        label: "Morse Code Practice Plan",
        to: "/morse-code-practice-plan",
        description:
          "Use a 2-week or 6-week routine across MorseWords tools.",
      },
      {
        label: "Morse Code Test",
        to: "/morse-code-test",
        description:
          "Choose the right listening, typing, visual, practice, word trainer, or practice-plan assessment.",
      },
      {
        label: "Practice",
        to: "/practice",
        description: "Train text-to-Morse and Morse-to-text recognition.",
      },
      {
        label: "Typing",
        to: "/typing",
        description: "Practice typing answers from Morse prompts.",
      },
      {
        label: "Morse Code Sentence Practice",
        to: "/morse-code-sentence-practice",
        description: "Decode and practice complete Morse code sentences.",
      },
      {
        label: "Morse Code Word Trainer",
        to: "/morse-code-word-trainer",
        description:
          "Practice built-in or custom word lists with audio and weak-word review.",
      },
      {
        label: "Morse Code Audio Practice",
        to: "/morse-code-audio-practice",
        description:
          "Practice copying Morse by ear with focused audio prompts.",
      },
      {
        label: "Morse Code Visual Practice",
        to: "/morse-code-visual-practice",
        description:
          "Practice reading Morse from a flashing light signal.",
      },
      {
        label: "Morse Code Audio Quiz",
        to: "/morse-code-audio-quiz",
        description:
          "Test Morse listening recall with a 10-question scored audio quiz.",
      },
      {
        label: "Morse Code Visual Quiz",
        to: "/morse-code-visual-quiz",
        description:
          "Test visual Morse recall with a 10-question scored flashing-light quiz.",
      },
      {
        label: "How to Use MorseWords",
        to: "/how-to-use",
        description: "Learn the site workflow and common Morse conventions.",
      },
      {
        label: "How to Read Morse Code",
        to: "/how-to-read-morse-code",
        description:
          "Learn rhythm, letter boundaries, word boundaries, and worked examples.",
      },
      {
        label: "How to Write in Morse Code",
        to: "/how-to-write-in-morse-code",
        description:
          "Write letters, words, punctuation, and spaces in readable Morse.",
      },
      {
        label: "How to Type in Morse Code",
        to: "/how-to-type-in-morse-code",
        description:
          "Use keyboard-safe dots, dashes, spaces, and slashes for typed Morse.",
      },
      {
        label: "How to Separate Words in Morse Code",
        to: "/how-to-separate-words-in-morse-code",
        description:
          "Learn letter gaps, word gaps, slash separators, timing gaps, and decoder-safe spacing.",
      },
      {
        label: "Printable Morse Code Worksheets",
        to: "/morse-code-printable-chart",
        description:
          "Print or download learner, teacher, and classroom Morse code templates.",
      },
      {
        label: "Morse Code Word Search Builder",
        to: "/morse-code-word-search-builder",
        description:
          "Build printable Morse vocabulary word searches from custom lists.",
      },
    ],
  },
  {
    title: "Charts and references",
    description: "Look up alphabets, words, symbols, and spacing rules.",
    links: [
      {
        label: "Morse Code Chart",
        to: "/morse-code-chart",
        description:
          "Use one complete chart for A-Z letters, 0-9 numbers, supported punctuation, spacing notes, audio checks, and printable chart next steps.",
      },
      {
        label: "Morse Code Alphabet",
        to: "/morse-code-alphabet",
        description: "Browse A-Z letter patterns for Morse alphabet learning.",
      },
      ...letterSitemapLinks,
      {
        label: "Morse Code Numbers",
        to: "/morse-code-numbers",
        description:
          "Review the 0-9 Morse number chart with pattern logic and examples.",
      },
      ...numberSitemapLinks,
      {
        label: "Dictionary",
        to: "/dictionary",
        description: "Find Morse code terms, abbreviations, and references.",
      },
      {
        label: "Morse Code Words",
        to: "/morse-code-words",
        description: "Copy common words, phrases, prosigns, and Q-codes.",
      },
      ...phraseSitemapLinks,
      {
        label: "Morse Code Word Separator",
        to: "/morse-code-word-separator",
        description: "Understand spaces, slashes, and word breaks in Morse.",
      },
      {
        label: "Copy and Paste Morse Code",
        to: "/copy-and-paste-morse-code",
        description:
          "Use safe dots, dashes, spaces, and slashes when copying Morse.",
      },
      {
        label: "Morse Code Without Spaces",
        to: "/morse-code-without-spaces",
        description:
          "Understand why unspaced Morse is ambiguous and how to add separators.",
      },
      {
        label: "Morse Code Timing",
        to: "/morse-code-timing",
        description:
          "Understand dot, dash, character gap, word gap, WPM, and PARIS timing.",
      },
      {
        label: "Farnsworth Timing",
        to: "/farnsworth-timing",
        description:
          "Learn character speed, effective speed, and learner spacing.",
      },
      {
        label: "Morse Code Prosigns",
        to: "/morse-code-prosigns",
        description:
          "Look up SOS, AR, SK, BT, and other procedural Morse signals.",
      },
      {
        label: "Morse Code Q-Codes",
        to: "/morse-code-q-codes",
        description:
          "Browse common Q-codes with meanings, examples, and audio.",
      },
      {
        label: "Morse Code Punctuation",
        to: "/morse-code-punctuation",
        description:
          "Find Morse punctuation for period, comma, question mark, slash, and symbols.",
      },
      ...symbolSitemapLinks,
      {
        label: "The Quick Brown Fox in Morse Code",
        to: "/the-quick-brown-fox-morse-code",
        description: "Use the classic pangram as a full-alphabet practice phrase.",
      },
      {
        label: "SOS in Morse Code",
        to: "/morse-code-sos",
        description:
          "Play, copy, and learn the SOS Morse code distress signal.",
      },
    ],
  },
  {
    title: "Site information",
    description: "About MorseWords, contact details, and source notes.",
    links: [
      {
        label: "About",
        to: "/about",
        description: "Learn what MorseWords is built for.",
      },
      {
        label: "Contact",
        to: "/contact",
        description:
          "Send MorseWords feedback, correction requests, bug reports, and classroom notes.",
      },
      {
        label: "Sources",
        to: "/sources",
        description:
          "See the standards and references used for MorseWords timing and reference pages.",
      },
    ],
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "HTML Sitemap | MorseWords Tools and Reference Pages",
    description:
      "Browse MorseWords translator, audio, practice, worksheet, quiz, and reference pages from one clean HTML sitemap.",
    path: CANONICAL_PATH,
    robots: "noindex,follow",
    keywords:
      "morsewords sitemap, morse code tools, morse code translator sitemap, morse code practice pages",
  });
}

export default function HtmlSitemap() {
  const itemList = GROUPS.flatMap((group) => group.links).map((link, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: link.label,
    url: canonicalUrl(link.to),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HTML Sitemap",
    url: CANONICAL_URL,
    description:
      "A complete browsable sitemap for MorseWords tools, learning pages, reference guides, and policies.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemList,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "HTML Sitemap",
        item: CANONICAL_URL,
      },
    ],
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="MorseWords sitemap"
          title="HTML Sitemap"
          description="A simple map of every main MorseWords page, including translator tools, audio generators, practice pages, printable learning resources, reference charts, and site information."
        />

        <div className="grid gap-5 pb-8 md:grid-cols-2">
          {GROUPS.map((group) => (
            <section
              key={group.title}
              className="overflow-hidden rounded-2xl bg-[#fffdf8]"
            >
              <div className="mw-static-surface-soft bg-[#fffaf2] px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-sky-800" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                    Sitemap
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-sky-950">
                  {group.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {group.description}
                </p>
              </div>
              <div className="px-5 py-5 sm:px-6">
                <div className="grid gap-3">
                  {group.links.map((link, index) => (
                    <Link
                      key={`${link.to}-${link.label}-${index}`}
                      to={link.to}
                      className="mw-button-outline mw-light-interactive-link group block cursor-pointer rounded-xl bg-white px-4 py-3 text-slate-900 no-underline hover:bg-[#fffaf2] hover:text-sky-950 focus:outline-none"
                    >
                      <span className="block font-extrabold text-sky-950 group-hover:text-current">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600 group-hover:text-current">
                        {link.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <JsonLdScript jsonLd={[jsonLd, breadcrumbJsonLd]} />
      </main>
      <BreadcrumbTrail current="HTML Sitemap" />
    </div>
  );
}
