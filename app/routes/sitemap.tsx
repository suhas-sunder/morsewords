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
import {
  getPublishedMorseBookSummaries,
  morseAudiobookPath,
  morseBookPath,
  morseBookPrintPath,
} from "~/client/data/morseBooks";
import { formatMorseBookAuthors } from "~/client/data/morseBookDisplay";
import { MORSE_LANGUAGE_PAGES } from "~/client/data/morseLanguages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = ROUTES.sitemap;
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

const morseBookSitemapLinks = getPublishedMorseBookSummaries().map((book) => ({
  label: `${book.title} in Morse Code`,
  to: morseBookPath(book.slug),
  description: `Read ${book.title} by ${formatMorseBookAuthors(book.author)} as cleaned Morse-ready book text with audio and video preview tools.`,
}));

const morseAudiobookSitemapLinks = getPublishedMorseBookSummaries().map((book) => ({
  label: `${book.title} Morse Audiobook`,
  to: morseAudiobookPath(book.slug),
  description: `Open ${book.title} by ${formatMorseBookAuthors(book.author)} as a browser-generated Morse audiobook with chapter scope and MP3/WAV controls.`,
}));

const morseBookPrintSitemapLinks = getPublishedMorseBookSummaries().map((book) => ({
  label: `${book.title} Printable Morse Pages`,
  to: morseBookPrintPath(book.slug),
  description: `Print ${book.title} by ${formatMorseBookAuthors(book.author)} as text and Morse study pages with QR and source notes.`,
}));

const morseLanguageSitemapLinks = [
  {
    label: "Morse Code by Language",
    to: ROUTES.morseCodeByLanguage,
    description:
      "Browse language-specific Morse adaptations including Japanese Wabun code, Russian Cyrillic Morse, and Greek Morse.",
  },
  ...MORSE_LANGUAGE_PAGES.map((page) => ({
    label: `${page.languageName} Morse Code`,
    to: page.path,
    description: `${page.shortDescription} Includes interactive cards and a printable side-by-side sheet.`,
  })),
];

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
        to: ROUTES.home,
        description: "Convert text to Morse, decode Morse to text, and play audio.",
      },
      {
        label: "Morse Code Audio Generator",
        to: ROUTES.audio,
        description:
          "Generate Morse code audio from text or Morse input for practice and downloads.",
      },
      {
        label: "Morse Code Audio Decoder",
        to: ROUTES.audioDecoder,
        description:
          "Upload clean Morse audio and decode it into raw dots and dashes plus readable text.",
      },
      {
        label: "Name to Morse Code",
        to: ROUTES.nameToMorse,
        description:
          "Convert names into Morse code, copy the output, and open it in audio tools.",
      },
      {
        label: "Morse Code Sound Generator",
        to: ROUTES.soundGenerator,
        description:
          "Create Morse code beeps, tune the tone, and export MP3 or WAV audio.",
      },
      {
        label: "Morse Code MP3 Generator",
        to: ROUTES.mp3Generator,
        description:
          "Type text or Morse, preview the tone, and download a browser-generated MP3 file.",
      },
      {
        label: "Book to Morse Code Translator",
        to: ROUTES.bookTranslator,
        description:
          "Convert long text, TXT, EPUB, or PDF into Morse audio or video downloads.",
      },
      {
        label: "Printable Morse Pages",
        to: ROUTES.printablePages,
        description:
          "Create printable Morse pages from custom text or processed book sections.",
      },
      {
        label: "Morse Code Books",
        to: ROUTES.morseBooks,
        description:
          "Browse processed Morse book pages from public reference texts.",
      },
      {
        label: "Morse Code Audiobooks",
        to: ROUTES.morseAudiobooks,
        description:
          "Browse processed books with browser-generated Morse audiobook preview and download controls.",
      },
      {
        label: "Morse Code Video Generator",
        to: ROUTES.videoGenerator,
        description:
          "Type text or Morse, preview a short visual signal, and download a browser-generated WebM clip.",
      },
      {
        label: "Morse Code Encoder",
        to: ROUTES.encoder,
        description: "Turn English text into Morse code dots and dashes.",
      },
      {
        label: "Morse Code Decoder",
        to: ROUTES.decoder,
        description: "Convert Morse code back into readable text.",
      },
      {
        label: "Morse Code Reader",
        to: ROUTES.reader,
        description:
          "Paste typed dots, dashes, spaces, and slashes to read the decoded text.",
      },
      {
        label: "International Morse Code Translator",
        to: ROUTES.internationalTranslator,
        description:
          "Translate English and international words into Morse code with transliteration.",
      },
      {
        label: "International Morse Code Reference",
        to: ROUTES.internationalReference,
        description:
          "Browse letters, digits, punctuation, prosigns, Q-codes, and standards notes.",
      },
    ],
  },
  ...(morseBookSitemapLinks.length > 0
    ? [
        {
          title: "Morse code books",
          description:
            "Processed Project Gutenberg reference texts prepared as Morse book pages.",
          links: morseBookSitemapLinks,
        },
      ]
    : []),
  ...(morseAudiobookSitemapLinks.length > 0
    ? [
        {
          title: "Morse code audiobooks",
          description:
            "Processed Project Gutenberg reference texts available as browser-generated Morse audiobook pages.",
          links: morseAudiobookSitemapLinks,
        },
      ]
    : []),
  ...(morseBookPrintSitemapLinks.length > 0
    ? [
        {
          title: "Printable Morse book pages",
          description:
            "Processed Project Gutenberg reference texts prepared as print-friendly Morse study pages.",
          links: morseBookPrintSitemapLinks,
        },
      ]
    : []),
  {
    title: "Morse code by language",
    description:
      "Language-specific Morse reference pages with native-script cards, audio, and printable sheets.",
    links: morseLanguageSitemapLinks,
  },
  {
    title: "Practice and learning",
    description: "Build recognition, accuracy, and speed with practical drills.",
    links: [
      {
        label: "Learn Morse Code",
        to: ROUTES.learn,
        description:
          "Follow a practical path through alphabet, practice, audio, words, sentences, and worksheets.",
      },
      {
        label: "Morse Code Practice Plan",
        to: ROUTES.practicePlan,
        description:
          "Use a 2-week or 6-week routine across MorseWords tools.",
      },
      {
        label: "Morse Code Test",
        to: ROUTES.test,
        description:
          "Choose the right listening, typing, visual, practice, word trainer, or practice-plan assessment.",
      },
      {
        label: "Practice",
        to: ROUTES.practice,
        description: "Train text-to-Morse and Morse-to-text recognition.",
      },
      {
        label: "Typing",
        to: ROUTES.typing,
        description: "Practice typing answers from Morse prompts.",
      },
      {
        label: "Morse Code Sentence Practice",
        to: ROUTES.sentencePractice,
        description: "Decode and practice complete Morse code sentences.",
      },
      {
        label: "Morse Code Word Trainer",
        to: ROUTES.wordTrainer,
        description:
          "Practice built-in or custom word lists with audio and weak-word review.",
      },
      {
        label: "Morse Code Audio Practice",
        to: ROUTES.audioPractice,
        description:
          "Practice copying Morse by ear with focused audio prompts.",
      },
      {
        label: "Morse Code Visual Practice",
        to: ROUTES.visualPractice,
        description:
          "Practice reading Morse from a flashing light signal.",
      },
      {
        label: "Morse Code Audio Quiz",
        to: ROUTES.audioQuiz,
        description:
          "Test Morse listening recall with a 10-question scored audio quiz.",
      },
      {
        label: "Morse Code Visual Quiz",
        to: ROUTES.visualQuiz,
        description:
          "Test visual Morse recall with a 10-question scored flashing-light quiz.",
      },
      {
        label: "How to Use MorseWords",
        to: ROUTES.howToUse,
        description: "Learn the site workflow and common Morse conventions.",
      },
      {
        label: "How to Read Morse Code",
        to: ROUTES.howToRead,
        description:
          "Learn rhythm, letter boundaries, word boundaries, and worked examples.",
      },
      {
        label: "How to Write in Morse Code",
        to: ROUTES.howToWrite,
        description:
          "Write letters, words, punctuation, and spaces in readable Morse.",
      },
      {
        label: "How to Type in Morse Code",
        to: ROUTES.howToType,
        description:
          "Use keyboard-safe dots, dashes, spaces, and slashes for typed Morse.",
      },
      {
        label: "How to Separate Words in Morse Code",
        to: ROUTES.separateWords,
        description:
          "Learn letter gaps, word gaps, slash separators, timing gaps, and decoder-safe spacing.",
      },
      {
        label: "Printable Morse Code Worksheets",
        to: ROUTES.printableChart,
        description:
          "Print or download learner, teacher, and classroom Morse code templates.",
      },
      {
        label: "Morse Code Word Search Builder",
        to: ROUTES.wordSearchBuilder,
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
        to: ROUTES.chart,
        description:
          "Use one complete chart for A-Z letters, 0-9 numbers, supported punctuation, spacing notes, audio checks, and printable chart next steps.",
      },
      {
        label: "Morse Code Alphabet",
        to: ROUTES.alphabet,
        description: "Browse A-Z letter patterns for Morse alphabet learning.",
      },
      ...letterSitemapLinks,
      {
        label: "Morse Code Numbers",
        to: ROUTES.numbers,
        description:
          "Review the 0-9 Morse number chart with pattern logic and examples.",
      },
      ...numberSitemapLinks,
      {
        label: "Dictionary",
        to: ROUTES.dictionary,
        description: "Find Morse code terms, abbreviations, and references.",
      },
      {
        label: "Morse Code Words",
        to: ROUTES.words,
        description: "Copy common words, phrases, prosigns, and Q-codes.",
      },
      ...phraseSitemapLinks,
      {
        label: "Morse Code Word Separator",
        to: ROUTES.wordSeparator,
        description: "Understand spaces, slashes, and word breaks in Morse.",
      },
      {
        label: "Copy and Paste Morse Code",
        to: ROUTES.copyAndPaste,
        description:
          "Use safe dots, dashes, spaces, and slashes when copying Morse.",
      },
      {
        label: "Morse Code Without Spaces",
        to: ROUTES.withoutSpaces,
        description:
          "Understand why unspaced Morse is ambiguous and how to add separators.",
      },
      {
        label: "Morse Code Timing",
        to: ROUTES.timing,
        description:
          "Understand dot, dash, character gap, word gap, WPM, and PARIS timing.",
      },
      {
        label: "Farnsworth Timing",
        to: ROUTES.farnsworth,
        description:
          "Learn character speed, effective speed, and learner spacing.",
      },
      {
        label: "Morse Code Prosigns",
        to: ROUTES.prosigns,
        description:
          "Look up SOS, AR, SK, BT, and other procedural Morse signals.",
      },
      {
        label: "Morse Code Q-Codes",
        to: ROUTES.qCodes,
        description:
          "Browse common Q-codes with meanings, examples, and audio.",
      },
      {
        label: "Morse Code Punctuation",
        to: ROUTES.punctuation,
        description:
          "Find Morse punctuation for period, comma, question mark, slash, and symbols.",
      },
      ...symbolSitemapLinks,
      {
        label: "The Quick Brown Fox in Morse Code",
        to: ROUTES.quickBrownFox,
        description: "Use the classic pangram as a full-alphabet practice phrase.",
      },
      {
        label: "SOS in Morse Code",
        to: ROUTES.sos,
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
        to: ROUTES.about,
        description: "Learn what MorseWords is built for.",
      },
      {
        label: "Contact",
        to: ROUTES.contact,
        description:
          "Send MorseWords feedback, correction requests, bug reports, and classroom notes.",
      },
      {
        label: "Sources",
        to: ROUTES.sources,
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: canonicalUrl(ROUTES.home),
      },
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
