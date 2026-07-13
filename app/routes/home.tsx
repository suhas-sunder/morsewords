import * as React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";

import styles from "~/client/components/shared/pageStyles";
import { PostHeroBannerAd } from "~/client/components/ads/AdSenseAds";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import { morseToText, textToMorse } from "~/client/components/shared/morseUtils";
import HowItWorks from "~/client/components/home/HowItWorks";
import { ROUTES } from "~/client/data/routes";
import {
  getPublishedMorseBookSummaries,
  morseBookPath,
} from "~/client/data/morseBooks";
import { getMorseBookCardDescription } from "~/client/data/morseBookCardDescriptions";
import { formatMorseBookAuthors } from "~/client/data/morseBookDisplay";
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

const trustPoints = [
  "Core translator, audio, video, practice, and printable tools run in the browser where those workflows apply.",
  "User-entered messages, worksheet text, and custom study text are not needed for public page rendering.",
  "Processed book pages use cleaned public reference material; Project Gutenberg links appear where relevant.",
  "The same Morse utilities support translation, listening, printing, and study flows across the site.",
] as const;

const offeringSections = [
  {
    title: "Translator and conversion tools",
    description:
      "Use the main translator to convert text to Morse code or decode Morse to text, then move into encoder, decoder, separator, and copy-ready formatting tools when you need more control.",
    links: [
      { href: ROUTES.encoder, label: "Encoder" },
      { href: ROUTES.decoder, label: "Decoder" },
      { href: ROUTES.wordSeparator, label: "Word separator" },
    ],
  },
  {
    title: "Audio and MP3",
    description:
      "Listen to Morse with tone, speed, and Farnsworth settings, or generate downloadable MP3/WAV audio from messages and longer source text.",
    links: [
      { href: ROUTES.audio, label: "Morse code audio translator" },
      { href: ROUTES.mp3Generator, label: "MP3 generator" },
      { href: ROUTES.soundGenerator, label: "Morse code sound generator" },
    ],
  },
  {
    title: "Practice and drills",
    description:
      "Build recall with listening, visual, word, sentence, typing, and timed practice flows designed for short repeatable study sessions.",
    links: [
      { href: ROUTES.practice, label: "Practice hub" },
      { href: ROUTES.wordTrainer, label: "Word trainer" },
      { href: ROUTES.audioPractice, label: "Audio practice" },
    ],
  },
  {
    title: "Reference and lookup",
    description:
      "Check the Morse code alphabet A to Z, number patterns, punctuation, prosigns, Q-codes, dictionary entries, and language-specific Morse adaptations when you need a reliable pattern.",
    links: [
      { href: ROUTES.alphabet, label: "Morse code alphabet A to Z" },
      { href: ROUTES.numbers, label: "Morse code numbers" },
      { href: ROUTES.dictionary, label: "Dictionary" },
      { href: ROUTES.morseCodeByLanguage, label: "By language" },
    ],
  },
  {
    title: "Books and audiobooks",
    description:
      "Open processed public books as text-first Morse sources, audio-first audiobook workflows, or chapter-based study material.",
    links: [
      { href: ROUTES.morseBooks, label: "Books" },
      { href: ROUTES.morseAudiobooks, label: "Audiobooks" },
      { href: ROUTES.bookTranslator, label: "Book translator" },
    ],
  },
  {
    title: "Printables and word search",
    description:
      "Create printable Morse pages, printable worksheets, and word-search style learning materials for paper practice or saved PDFs.",
    links: [
      { href: ROUTES.printablePages, label: "Printable pages" },
      { href: ROUTES.printableChart, label: "Printable worksheet" },
      { href: ROUTES.wordSearchBuilder, label: "Word search" },
    ],
  },
] as const;

function formatCount(value: number, label: string) {
  return `${value.toLocaleString("en-US")} ${label}`;
}

const FEATURED_BOOK_LIMIT = 8;

function formatUnitCount(
  value: number,
  singular: string,
  plural = `${singular}s`,
) {
  const label = value === 1 ? singular : plural;
  return `${value.toLocaleString("en-US")} ${label}`;
}

function formatCompactWordCount(value: number) {
  if (value < 1000) return value.toLocaleString("en-US");
  const precision = value < 10000 ? 1 : 0;
  return `${Number((value / 1000).toFixed(precision)).toLocaleString(
    "en-US",
  )}k`;
}

function formatFeaturedBookValueLine(sectionCount: number, wordCount: number) {
  return `${formatUnitCount(
    sectionCount,
    "section",
  )} / ${formatCompactWordCount(wordCount)} words`;
}

export async function loader() {
  const featuredBooks = getPublishedMorseBookSummaries().slice(
    0,
    FEATURED_BOOK_LIMIT,
  );
  const { getMorseBookSeoSummariesBySlug } = await import(
    "~/client/data/morseBookSeoSummaries.server"
  );
  const seoSummariesBySlug = getMorseBookSeoSummariesBySlug(
    featuredBooks.map((book) => book.slug),
  );
  const featuredBookDescriptionsBySlug = Object.fromEntries(
    featuredBooks.map((book) => [
      book.slug,
      getMorseBookCardDescription({
        book,
        seoSummary: seoSummariesBySlug[book.slug] ?? null,
      }),
    ]),
  );

  return { featuredBookDescriptionsBySlug };
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

function OfferingsSection() {
  return (
    <section
      className="mx-auto mt-10 w-full max-w-[1120px] px-4 sm:px-6 lg:px-8"
      aria-labelledby="morsewords-offerings-title"
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <div>
          <SectionEyebrow>Site toolkit</SectionEyebrow>
          <h2
            id="morsewords-offerings-title"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            One Morse workspace for reading, listening, practice, and study
          </h2>
          <p className="mw-text-muted mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            MorseWords is built around the flow learners actually use: translate
            a message, hear the rhythm, check the reference, practice weak
            spots, and turn useful material into audio, video, or printable
            pages.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {offeringSections.map((section) => (
            <article
              key={section.title}
              className="mw-surface-card rounded-xl bg-[#fffdf8]/86 p-4"
            >
              <h3 className="mw-heading text-base font-extrabold leading-snug text-sky-950">
                {section.title}
              </h3>
              <p className="mw-text-muted mt-2 text-sm leading-relaxed text-slate-700">
                {section.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sky-900 underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedBooksSection({
  descriptionsBySlug,
}: {
  descriptionsBySlug: Record<string, string>;
}) {
  const featuredBooks = React.useMemo(
    () => getPublishedMorseBookSummaries().slice(0, FEATURED_BOOK_LIMIT),
    [],
  );

  if (featuredBooks.length === 0) return null;

  return (
    <section
      className="mw-bg-page-soft relative left-1/2 mt-12 w-screen max-w-[100vw] -translate-x-1/2 bg-[#fffaf2]/35 py-10"
      aria-labelledby="featured-morse-books-title"
    >
      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div>
            <SectionEyebrow>Books and audiobooks</SectionEyebrow>
            <h2
              id="featured-morse-books-title"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Classic stories for Morse reading and listening
            </h2>
            <p className="mw-text-muted mt-4 max-w-[58ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Explore classic stories converted into Morse code practice. Each
              title opens to a readable book page with live Morse playback,
              sections, and audio options.
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

        <div className="mt-8 grid items-start gap-4 md:grid-cols-2 md:items-stretch xl:grid-cols-4">
          {featuredBooks.map((book, index) => {
            const bookPath = morseBookPath(book.slug);
            const authorText = formatMorseBookAuthors(book.author);
            const valueLine = formatFeaturedBookValueLine(
              book.stats.includedSectionCount,
              book.stats.wordCount,
            );
            const description = descriptionsBySlug[book.slug] ?? "";
            const wideScreenOnly = index >= 4;

            return (
              <article
                key={book.slug}
                className={`min-w-0 md:h-full ${wideScreenOnly ? "hidden xl:block" : ""}`}
                data-testid="home-featured-book-card"
                data-mw-home-book-slug={book.slug}
                data-mw-home-book-title={book.title}
                data-mw-home-book-author={authorText}
                data-mw-home-book-priority={
                  wideScreenOnly ? "wide-screen" : "primary"
                }
              >
                <Link
                  to={bookPath}
                  className="mw-static-surface group block min-w-0 cursor-pointer rounded-xl bg-[#fffdf8] p-3 text-slate-900 no-underline shadow-[var(--mw-shadow-soft)] ring-1 ring-slate-950/10 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 md:h-full"
                  aria-label={`Open ${book.title} by ${authorText}`}
                  title={`Open ${book.title}`}
                  data-testid="home-featured-book-primary-link"
                >
                  <div
                    className="mw-static-tile relative flex min-h-0 w-full overflow-hidden rounded-lg bg-[#f2eee6] px-5 py-5 md:h-full xl:aspect-[3/5]"
                    data-testid="home-featured-book-cover"
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-3 bg-slate-950/10"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute inset-y-0 left-3 w-px bg-white/70"
                      aria-hidden="true"
                    />
                    <div className="relative z-10 flex min-w-0 flex-1 flex-col pl-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        MorseWords book
                      </span>

                      <div className="min-w-0 pt-8">
                        <h3
                          className="mw-heading line-clamp-4 break-words text-xl font-extrabold leading-tight text-sky-950"
                          title={book.title}
                          data-testid="home-featured-book-title"
                        >
                          {book.title}
                        </h3>
                        <p
                          className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-slate-600"
                          title={authorText}
                          data-testid="home-featured-book-author"
                        >
                          {authorText}
                        </p>
                      </div>

                      <div className="min-w-0 pt-5">
                        {description ? (
                          <p
                            className="line-clamp-4 text-sm leading-relaxed text-slate-700"
                            data-testid="home-featured-book-description"
                          >
                            {description}
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-3 min-w-0 space-y-2 md:mt-auto">
                        <p
                          className="mw-muted-label font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 xl:whitespace-nowrap xl:text-[10px] xl:tracking-normal"
                          data-testid="home-featured-book-value-line"
                        >
                          {valueLine}
                        </p>
                        <span
                          className="block text-sm font-bold text-sky-900"
                          data-testid="home-featured-book-affordance"
                        >
                          Read and listen -&gt;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
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
          Paste custom text to make a study sheet, or open a processed book
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
    title: "Morse Code Translator | Text to Morse and Morse to Text | MorseWords",
    description:
      "Convert text to Morse code or decode Morse to text, then copy, play, or continue with audio and practice tools in your browser.",
    path: CANONICAL_PATH,
    keywords:
      "morse code translator, text to morse code, morse to text, morse code decoder, morse code audio, morse code books, morse code printables",
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
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
        name: "Morse Code Translator",
        url: canonicalUrl(CANONICAL_PATH),
        isPartOf: { "@id": `${canonicalUrl(CANONICAL_PATH)}#website` },
        description:
          "MorseWords converts text to Morse code and decodes Morse to text, with browser-based copy, playback, audio, and practice paths.",
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
              Convert text to Morse code or decode Morse to text with the
              MorseWords translator. Enter supported letters, numbers, and
              punctuation, then copy, play, or generate Morse output for the
              next practice step.
            </p>
          }
        />
      </div>

      <PostHeroBannerAd />

      <OfferingsSection />
      <FeaturedBooksSection
        descriptionsBySlug={loaderData.featuredBookDescriptionsBySlug}
      />
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
