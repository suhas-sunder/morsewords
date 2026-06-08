import * as React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";

import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { morseToText, textToMorse } from "~/client/components/shared/morseUtils";
import HowItWorks from "~/client/components/home/HowItWorks";
import { ROUTES } from "~/client/data/routes";
import {
  getPublishedMorseBookSummaries,
  morseAudiobookPath,
  morseBookPath,
} from "~/client/data/morseBooks";
import { canonicalUrl, seoMeta } from "~/client/seo";

const CANONICAL_PATH = ROUTES.home;

const homeRelatedToolsStyles = `
  .mw-home-page ~ #morse-code-navigation {
    margin-top: 1.75rem;
    background: transparent !important;
    border-radius: 0 !important;
    overflow: visible !important;
  }

  .mw-home-page ~ #morse-code-navigation > div {
    background: transparent !important;
  }

  @media (max-width: 767px) {
    .mw-home-page ~ #morse-code-navigation {
      margin-top: 1.25rem;
    }

    .mw-home-page ~ #morse-code-navigation > div {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`;

const ecosystemLinks = [
  {
    title: "Translate text and Morse",
    description:
      "Convert plain text to Morse or decode pasted dots and dashes in the hero workspace.",
    href: ROUTES.home,
  },
  {
    title: "Listen to Morse audio",
    description:
      "Play Morse in the browser with tone, speed, and Farnsworth controls.",
    href: ROUTES.audio,
  },
  {
    title: "Generate MP3 audio",
    description:
      "Turn short messages or longer source text into downloadable Morse MP3 files.",
    href: ROUTES.mp3Generator,
  },
  {
    title: "Create Morse videos",
    description:
      "Build simple text-to-Morse video clips with visual and audio timing controls.",
    href: ROUTES.videoGenerator,
  },
  {
    title: "Practice Morse code",
    description:
      "Use listening, typing, word, visual, and speed drills for short study sessions.",
    href: ROUTES.practice,
  },
  {
    title: "Browse Morse books",
    description:
      "Read approved public-domain books as Morse-ready chapter sources.",
    href: ROUTES.morseBooks,
  },
  {
    title: "Listen to Morse audiobooks",
    description:
      "Open approved books in an audio-first Morse workflow with chapter selection.",
    href: ROUTES.morseAudiobooks,
  },
  {
    title: "Print Morse pages",
    description:
      "Create printable study sheets from custom text or approved book chapters.",
    href: ROUTES.printablePages,
  },
] as const;

const trustPoints = [
  "Core translator, audio, video, practice, and printable tools run in the browser where those workflows apply.",
  "User-entered messages, worksheet text, and custom study text are not needed for public page rendering.",
  "Approved book pages use cleaned public-domain source material; Project Gutenberg links appear where relevant.",
  "The same Morse utilities support translation, listening, printing, and study flows across the site.",
] as const;

function formatAuthor(author: string[]) {
  return author.length > 0 ? author.join(", ") : "Unknown author";
}

function formatCount(value: number, label: string) {
  return `${value.toLocaleString("en-US")} ${label}`;
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="mw-eyebrow-line h-px w-8 bg-sky-800" />
      <span className="mw-eyebrow-text font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
        {children}
      </span>
    </div>
  );
}

function EcosystemSection() {
  return (
    <section
      className="mx-auto mt-8 w-full max-w-[1120px] px-4 sm:px-6 lg:px-8"
      aria-labelledby="morsewords-ecosystem-title"
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
        <div>
          <SectionEyebrow>Start anywhere</SectionEyebrow>
          <h2
            id="morsewords-ecosystem-title"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            What you can do on MorseWords
          </h2>
          <p className="mw-text-muted mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            Translate a phrase, hear its rhythm, turn it into audio or video,
            practice recall, read public-domain books in Morse, and print clean
            study pages from the same toolkit.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ecosystemLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="mw-related-tool-link mw-button-secondary-dark-hover group block rounded-xl bg-[#fffdf8] p-4 text-slate-900 hover:bg-slate-950 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              <span className="mw-muted-label font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 group-hover:text-sky-200">
                Open tool
              </span>
              <span className="mw-heading mt-2 block text-base font-extrabold text-sky-950 group-hover:text-sky-100">
                {item.title}
              </span>
              <span className="mw-text-muted mt-2 block text-sm leading-relaxed text-slate-700 group-hover:text-slate-200">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedBooksSection() {
  const featuredBooks = getPublishedMorseBookSummaries().slice(0, 4);

  if (featuredBooks.length === 0) return null;

  return (
    <section
      className="mw-bg-page-soft relative left-1/2 mt-12 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/35 px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="featured-morse-books-title"
    >
      <div className="mx-auto max-w-[1160px]">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div>
            <SectionEyebrow>Books and audiobooks</SectionEyebrow>
            <h2
              id="featured-morse-books-title"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Read and listen with approved public-domain books
            </h2>
            <p className="mw-text-muted mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              MorseWords includes approved book content as cleaned chapter
              sources. Open a book for text-first study, or open the audiobook
              page when you want Morse audio controls first.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              to={ROUTES.morseBooks}
              className="mw-button-outline mw-button-secondary-dark-hover inline-flex min-h-11 items-center rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-bold text-slate-900 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Browse Morse books
            </Link>
            <Link
              to={ROUTES.morseAudiobooks}
              className="mw-button-outline mw-button-secondary-dark-hover inline-flex min-h-11 items-center rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-bold text-slate-900 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Browse Morse audiobooks
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredBooks.map((book) => (
            <article
              key={book.slug}
              className="mw-static-surface rounded-xl bg-[#fffdf8] p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className="mw-static-tile flex h-20 w-14 shrink-0 items-center justify-center rounded-lg bg-[#f2eee6] px-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-sky-950"
                  aria-hidden="true"
                >
                  Morse book
                </div>
                <div className="min-w-0">
                  <h3 className="mw-heading text-base font-extrabold leading-snug text-sky-950">
                    {book.title}
                  </h3>
                  <p className="mw-text-soft mt-1 text-sm leading-relaxed text-slate-600">
                    {formatAuthor(book.author)}
                  </p>
                </div>
              </div>

              <p className="mw-text-muted mt-3 line-clamp-3 text-sm leading-relaxed text-slate-700">
                {book.description}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="mw-muted-label font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Sections
                  </dt>
                  <dd className="mw-text-muted mt-1 text-slate-700">
                    {formatCount(book.stats.includedSectionCount, "sections")}
                  </dd>
                </div>
                <div>
                  <dt className="mw-muted-label font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Words
                  </dt>
                  <dd className="mw-text-muted mt-1 text-slate-700">
                    {formatCount(book.stats.wordCount, "words")}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link
                  to={morseBookPath(book.slug)}
                  className="mw-link font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  Open book
                </Link>
                <Link
                  to={morseAudiobookPath(book.slug)}
                  className="mw-link font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  Open audiobook
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrintableAndTrustSection() {
  const printExample =
    getPublishedMorseBookSummaries().find(
      (book) => book.slug === "treasure-island",
    ) ?? getPublishedMorseBookSummaries()[0];

  return (
    <section
      className="mx-auto grid w-full max-w-[1120px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-8"
      aria-labelledby="printable-resources-title"
    >
      <div>
        <SectionEyebrow>Print and study</SectionEyebrow>
        <h2
          id="printable-resources-title"
          className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
        >
          Printable Morse pages for custom text and books
        </h2>
        <p className="mw-text-muted mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
          Paste custom text to make a study sheet, or open an approved book
          print page for chapter-based Morse practice. Use the browser print
          dialog when you want paper copies or a saved PDF.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={ROUTES.printablePages}
            className="mw-button-outline mw-button-secondary-dark-hover inline-flex min-h-11 items-center rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-bold text-slate-900 hover:text-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            Create printable pages
          </Link>
          {printExample ? (
            <Link
              to={`${morseBookPath(printExample.slug)}/print`}
              className="mw-link inline-flex min-h-11 items-center font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              Example book print page
            </Link>
          ) : null}
        </div>
      </div>

      <div aria-labelledby="trust-source-title">
        <SectionEyebrow>Trust and sources</SectionEyebrow>
        <h2
          id="trust-source-title"
          className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
        >
          Practical tools with clear source notes
        </h2>
        <ul className="mw-text-muted mt-4 grid list-disc gap-3 pl-6 text-base leading-relaxed text-slate-700 sm:text-lg">
          {trustPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "Morse Code Translator, Audio, Practice, Books, and Printables | MorseWords",
    description:
      "Translate Morse code, hear audio, create MP3 and video exports, practice, read Morse books and audiobooks, and print study pages with browser-based tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code translator, text to morse code, morse to text, morse code decoder, morse code audio, morse code books, morse code printables",
  });
}

export default function Home() {
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${canonicalUrl(CANONICAL_PATH)}#organization`,
        name: "MorseWords",
        url: canonicalUrl(CANONICAL_PATH),
      },
      {
        "@type": "WebSite",
        "@id": `${canonicalUrl(CANONICAL_PATH)}#website`,
        name: "MorseWords",
        url: canonicalUrl(CANONICAL_PATH),
        publisher: { "@id": `${canonicalUrl(CANONICAL_PATH)}#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl(CANONICAL_PATH)}#webpage`,
        name: "Morse Code Translator, Audio, Practice, Books, and Printables",
        url: canonicalUrl(CANONICAL_PATH),
        isPartOf: { "@id": `${canonicalUrl(CANONICAL_PATH)}#website` },
        description:
          "MorseWords is a browser-based Morse code toolkit for translating, listening, practicing, reading approved public-domain books, and printing study pages.",
      },
    ],
  };

  const faqItems = [
    {
      q: "What does this translator support?",
      a: "It supports A–Z, 0–9, and common punctuation (like . , ? ! / - @). When encoding, unsupported characters are ignored and listed under the input so you can spot what was skipped.",
    },
    {
      q: "How do I paste Morse code to decode it?",
      a: "Paste dots and dashes into the Morse input. For best results, separate letters with 3 spaces and words with 7 spaces. A single space between letters also works, and new lines are treated like word breaks.",
    },
    {
      q: "Can I use / as a word separator?",
      a: "Yes. A slash is treated as a word separator when decoding.",
    },
    {
      q: "Why is spacing important for decoding?",
      a: "The decoder needs separators to know where one letter ends and the next begins. This tool treats 1–6 spaces as a letter gap and 7+ spaces (or / or a new line) as a word gap.",
    },
    {
      q: "What if my Morse has an unknown sequence?",
      a: "Unknown Morse sequences are shown as “?” in the decoded output so mistakes don’t disappear silently.",
    },
  ];
  return (
    <main className="mw-home-page" style={styles.page}>
      <style dangerouslySetInnerHTML={{ __html: homeRelatedToolsStyles }} />

      <div className="mx-auto w-full max-w-[1120px] px-4 pb-0 pt-2 sm:px-6 sm:pt-4 lg:px-8">
        <TranslatorSectionsBasic
          variant="home"
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          enableQueryPrefill
          subtitle={
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Translate plain text, decode Morse, listen to the signal, then
              keep going with audio, video, practice, books, audiobooks, and
              printable study pages.
            </p>
          }
        />
      </div>

      <EcosystemSection />
      <FeaturedBooksSection />
      <PrintableAndTrustSection />
      <HowItWorks />

      <div className="mx-auto w-full max-w-[1040px] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <FaqSectionGeneric
          title="Translator FAQ"
          items={faqItems}
          variant="home"
        />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </main>
  );
}
