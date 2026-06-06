import * as React from "react";
import { Link } from "react-router";

import type { Route } from "./+types/morse-code-books";

import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
  StaticPanel,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import { toolControlButtonClass } from "~/client/components/shared/ToolWorkspace";
import {
  TEST_COLLECTION_BOOK_PREVIEW_VALUE,
  TEST_PUBLISHED_BOOK_PREVIEW_VALUE,
  TEST_PUBLISHED_BOOK_SLUG,
  UNPUBLISHED_BOOK_PREVIEW_PARAM,
  getPublishedMorseBookSummaries,
  morseBookPath,
} from "~/client/data/morseBooks";
import type { MorseBookLibrarySummary } from "~/client/data/morseBookTypes";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.morseBooks;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const TITLE = "Morse Code Books";
const META_TITLE = "Morse Code Books and Morse Audiobooks | MorseWords";
const DESCRIPTION =
  "Browse reviewed Morse book and Morse audiobook-style pages that turn curated long-form text into browser-local Morse audio or video.";
const PAGE_SIZE = 12;

const guideItems = [
  {
    title: "Reviewed book pages",
    text: "The collection lists books only after source and rights checks are complete. Titles still under review stay hidden until they are ready for public use.",
  },
  {
    title: "Book pages, not uploads",
    text: "A book page starts from reviewed, cleaned sections with chapter navigation. The general book translator remains the tool for your own pasted text, TXT, EPUB, MD, or text-native PDF files.",
    href: ROUTES.bookTranslator,
    badge: "Use your text",
  },
  {
    title: "Audio and video output",
    text: "Approved book pages can use familiar MorseWords settings for MP3, WAV, WebM, speed, Farnsworth spacing, tone, visual signal, and text overlays.",
  },
  {
    title: "Chapter-friendly practice",
    text: "The goal is not one giant page of text. Book pages are structured around sections so learners can preview, convert, and practice manageable chapters.",
  },
];

const reviewItems = [
  {
    title: "Source details",
    text: "Each listed book keeps provider, Gutenberg ID when available, source link, release details, and rights status separate from the Morse source text.",
  },
  {
    title: "Boilerplate excluded",
    text: "Project Gutenberg headers, license text, production credits, and transcriber material are kept out of the translated Morse source unless a future book explicitly approves a section.",
  },
  {
    title: "No unreviewed books",
    text: "If a title has not cleared review, it stays off public listings, book pages, sitemaps, and download workflows.",
  },
  {
    title: "Placeholders first",
    text: "Cover thumbnails may start as accessible MorseWords placeholders. Future metadata can add real covers without changing the hub layout.",
  },
];

type SortMode = "title" | "author" | "wordCount";

function isTestPublishedPreviewRequest(request: Request) {
  const url = new URL(request.url);
  return (
    import.meta.env.DEV &&
    url.searchParams.get(UNPUBLISHED_BOOK_PREVIEW_PARAM) ===
      TEST_PUBLISHED_BOOK_PREVIEW_VALUE
  );
}

function isTestCollectionPreviewRequest(request: Request) {
  const url = new URL(request.url);
  return (
    import.meta.env.DEV &&
    url.searchParams.get(UNPUBLISHED_BOOK_PREVIEW_PARAM) ===
      TEST_COLLECTION_BOOK_PREVIEW_VALUE
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function bookAuthor(book: MorseBookLibrarySummary) {
  return book.author.join(", ");
}

function searchableBookText(book: MorseBookLibrarySummary) {
  return [
    book.title,
    bookAuthor(book),
    book.description,
    book.source.provider,
    book.language,
    ...book.subjects,
  ]
    .join(" ")
    .toLowerCase();
}

function sortBooks(books: MorseBookLibrarySummary[], sortMode: SortMode) {
  return [...books].sort((a, b) => {
    if (sortMode === "author") {
      const authorCompare = bookAuthor(a).localeCompare(bookAuthor(b));
      if (authorCompare !== 0) return authorCompare;
    }
    if (sortMode === "wordCount") {
      const wordCompare = a.stats.wordCount - b.stats.wordCount;
      if (wordCompare !== 0) return wordCompare;
    }
    return a.title.localeCompare(b.title);
  });
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function formatLanguage(language: string) {
  return language.toUpperCase();
}

function formatBookCount(count: number) {
  return count === 1 ? "1 reviewed book" : `${formatNumber(count)} reviewed books`;
}

function publicBookHref(book: MorseBookLibrarySummary, includeTestFixture: boolean) {
  const path = morseBookPath(book.slug);
  if (includeTestFixture && book.slug === TEST_PUBLISHED_BOOK_SLUG) {
    return `${path}?${UNPUBLISHED_BOOK_PREVIEW_PARAM}=${TEST_PUBLISHED_BOOK_PREVIEW_VALUE}`;
  }
  return path;
}

export function loader({ request }: Route.LoaderArgs) {
  const includeTestFixture = isTestPublishedPreviewRequest(request);
  const includeTestCollectionFixture = isTestCollectionPreviewRequest(request);
  return {
    books: getPublishedMorseBookSummaries({
      includeTestFixture,
      includeTestCollectionFixture,
    }),
    includeTestFixture: includeTestFixture || includeTestCollectionFixture,
  };
}

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = ({ data }) =>
  seoMeta({
    title: META_TITLE,
    description: DESCRIPTION,
    path: CANONICAL_PATH,
    robots: data?.includeTestFixture ? "noindex,nofollow" : "index,follow",
    keywords:
      "Morse code books, Morse code audiobooks, book to Morse code, public domain Morse audio, Project Gutenberg Morse code, long text to Morse audio",
  });

export default function MorseCodeBooksHubRoute({
  loaderData,
}: Route.ComponentProps) {
  const { books, includeTestFixture } = loaderData;
  const [query, setQuery] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [languageFilter, setLanguageFilter] = React.useState("all");
  const [sortMode, setSortMode] = React.useState<SortMode>("title");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const subjectOptions = React.useMemo(
    () => uniqueSorted(books.flatMap((book) => book.subjects)),
    [books],
  );
  const languageOptions = React.useMemo(
    () => uniqueSorted(books.map((book) => book.language)),
    [books],
  );

  const filteredBooks = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const candidates = books.filter((book) => {
      if (
        normalizedQuery &&
        !searchableBookText(book).includes(normalizedQuery)
      ) {
        return false;
      }
      if (
        subjectFilter !== "all" &&
        !book.subjects.includes(subjectFilter)
      ) {
        return false;
      }
      if (languageFilter !== "all" && book.language !== languageFilter) {
        return false;
      }
      return true;
    });
    return sortBooks(candidates, sortMode);
  }, [books, languageFilter, query, sortMode, subjectFilter]);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [languageFilter, query, sortMode, subjectFilter]);

  const visibleBooks = filteredBooks.slice(0, visibleCount);
  const hasActiveFilters =
    query.trim().length > 0 ||
    subjectFilter !== "all" ||
    languageFilter !== "all" ||
    sortMode !== "title";
  const hasMoreBooks = visibleBooks.length < filteredBooks.length;
  const controlsDisabled = books.length === 0;

  function clearFilters() {
    setQuery("");
    setSubjectFilter("all");
    setLanguageFilter("all");
    setSortMode("title");
  }

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: CANONICAL_URL,
    description: DESCRIPTION,
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    about: [
      "Morse code books",
      "Morse code audiobooks",
      "Book to Morse code",
      "Long text to Morse audio",
    ],
    ...(books.length > 0 && !includeTestFixture
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: books.map((book, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: book.title,
              url: canonicalUrl(morseBookPath(book.slug)),
            })),
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: TITLE,
        item: CANONICAL_URL,
      },
    ],
  };

  return (
    <main className={WAVE_PAGE_MAIN_CLASS}>
      <JsonLdScript jsonLd={[collectionJsonLd, breadcrumbJsonLd]} />
      <PageHero
        eyebrow="Morse books"
        title="Morse code books and audiobook-style practice"
        description="Browse curated book pages as they pass MorseWords source and rights review, then use chapter-based text to make Morse audio or video in your browser."
      >
        <ActionLinks
          links={[
            {
              href: ROUTES.bookTranslator,
              label: "Convert your own text",
              primary: true,
            },
            { href: ROUTES.videoGenerator, label: "Create Morse video" },
            { href: ROUTES.mp3Generator, label: "Create MP3 audio" },
          ]}
        />
      </PageHero>

      <section className="mt-8 sm:mt-10" aria-labelledby="morse-books-list">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Collection
              </span>
            </div>
            <h2
              id="morse-books-list"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Reviewed Morse book pages
            </h2>
            <p className="mw-text-muted mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Search reviewed titles, filter by source subjects or language,
              and open rights-approved book pages for chapter-based Morse audio,
              video, and practice. Books still under review stay out of public
              cards, navigation, and sitemaps.
            </p>
          </div>
          <form
            className="mw-static-panel rounded-xl bg-[#fffdf8] p-4"
            role="search"
            aria-label="Browse reviewed Morse books"
            data-testid="morse-books-toolbar"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                Search title, author, or subject
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  className="min-h-11 rounded-xl bg-white/88 px-4 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  placeholder="Search reviewed books"
                  disabled={controlsDisabled}
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Subject
                <select
                  value={subjectFilter}
                  onChange={(event) => setSubjectFilter(event.currentTarget.value)}
                  className="min-h-11 rounded-xl bg-white/88 px-3 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  disabled={controlsDisabled || subjectOptions.length === 0}
                  aria-label="Filter Morse books by subject"
                >
                  <option value="all">All subjects</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Language
                <select
                  value={languageFilter}
                  onChange={(event) => setLanguageFilter(event.currentTarget.value)}
                  className="min-h-11 rounded-xl bg-white/88 px-3 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  disabled={controlsDisabled || languageOptions.length === 0}
                  aria-label="Filter Morse books by language"
                >
                  <option value="all">All languages</option>
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>
                      {formatLanguage(language)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Sort
                <select
                  value={sortMode}
                  onChange={(event) =>
                    setSortMode(event.currentTarget.value as SortMode)
                  }
                  className="min-h-11 rounded-xl bg-white/88 px-3 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  disabled={controlsDisabled}
                  aria-label="Sort Morse books"
                >
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="wordCount">Word count</option>
                </select>
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className={toolControlButtonClass({
                    rounded: "xl",
                    full: true,
                    disabled: !hasActiveFilters,
                  })}
                >
                  Clear filters
                </button>
              </div>
            </div>
            <p
              className="mw-muted-label mt-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
              data-testid="morse-books-result-count"
              aria-live="polite"
            >
              {books.length === 0
                ? "0 reviewed books available"
                : `Showing ${formatNumber(visibleBooks.length)} of ${formatBookCount(filteredBooks.length)}`}
            </p>
          </form>
        </div>

        {books.length === 0 ? (
          <StaticPanel
            as="section"
            className="mt-6"
            data-testid="morse-books-empty-state"
            aria-label="Morse books empty collection"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Coming soon
            </p>
            <h3 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
              Curated Morse books are being reviewed.
            </h3>
            <p className="mw-text-muted mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700">
              Books will appear here after source and rights checks are
              complete. You can still convert your own public-domain chapters,
              notes, or long text today with the book translator.
            </p>
            <div className="mt-5">
              <Link
                to={ROUTES.bookTranslator}
                className={toolControlButtonClass({ tone: "dark", rounded: "xl" })}
              >
                Open the book translator
              </Link>
            </div>
          </StaticPanel>
        ) : filteredBooks.length > 0 ? (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleBooks.map((book) => (
                <BookCard
                  key={book.slug}
                  book={book}
                  href={publicBookHref(book, includeTestFixture)}
                />
              ))}
            </div>
            {hasMoreBooks ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((current) => current + PAGE_SIZE)
                  }
                  className={toolControlButtonClass({
                    tone: "dark",
                    rounded: "xl",
                  })}
                >
                  Show more books
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <StaticPanel as="section" className="mt-6" aria-live="polite">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              No matches
            </p>
            <h3 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
              No reviewed books match that search.
            </h3>
            <p className="mw-text-muted mt-3 max-w-[58ch] text-base leading-relaxed text-slate-700">
              Try a title, author, source provider, or subject from the reviewed
              collection.
            </p>
          </StaticPanel>
        )}
      </section>

      <SectionCard
        eyebrow="How it works"
        title="What a Morse book page will do"
        description="The collection is for reviewed, structured books. Personal text, drafts, uploads, and titles still under review belong in the general book translator instead."
        layout="stacked"
      >
        <SimpleGrid items={guideItems} variant="plain" linkedItemStyle="inline" />
      </SectionCard>

      <SectionCard
        eyebrow="Source checks"
        title="Why reviewed books are listed slowly"
        description="MorseWords lists only titles that pass source and rights checks so future public-domain Morse audiobook workflows start from reviewed, source-linked text."
        layout="stacked"
      >
        <SimpleGrid items={reviewItems} variant="plain" />
      </SectionCard>

      <section className="mt-9 sm:mt-11" aria-labelledby="morse-books-next">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.58fr)_minmax(260px,0.42fr)] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-sky-800" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                Use it now
              </span>
            </div>
            <h2
              id="morse-books-next"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Need a Morse audiobook file today?
            </h2>
            <p className="mw-text-muted mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Use the book translator for your own text while curated pages are
              reviewed. It can handle pasted long text, TXT, MD, EPUB, and
              text-native PDF files locally in your browser.
            </p>
          </div>
          <StaticPanel as="aside">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Local workflow
            </p>
            <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
              Book pages and the translator generate audio/video in the browser.
              MorseWords does not pre-render static audio files on this hub, and
              generated media is not stored in browser storage.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to={ROUTES.bookTranslator}
                className={toolControlButtonClass({ tone: "dark", rounded: "xl" })}
              >
                Book translator
              </Link>
              <Link
                to={ROUTES.audio}
                className={toolControlButtonClass({ rounded: "xl" })}
              >
                Audio tools
              </Link>
            </div>
          </StaticPanel>
        </div>
      </section>

      <BreadcrumbTrail current="Morse Code Books" placement="contentFooter" />
    </main>
  );
}

function BookCard({
  book,
  href,
}: {
  book: MorseBookLibrarySummary;
  href: string;
}) {
  const outputText = "Morse audio/video, chapter practice";
  return (
    <article
      className="mw-static-surface flex h-full flex-col rounded-xl bg-[#fffdf8]/86 p-4"
      data-testid="morse-book-card"
      data-mw-morse-book-card-slug={book.slug}
    >
      <BookCover book={book} />
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {book.source.provider}
        </p>
        <h3 className="mw-heading mt-2 text-xl font-extrabold leading-tight text-sky-950">
          {book.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          {bookAuthor(book)}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {book.subjects.slice(0, 3).map((subject) => (
            <span
              key={subject}
              className="mw-muted-label mw-static-tile rounded-full px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500"
            >
              {subject}
            </span>
          ))}
        </div>
        {book.description ? (
          <p className="mw-text-muted mt-3 text-sm leading-relaxed text-slate-700">
            {book.description}
          </p>
        ) : null}
        <dl className="mt-4 grid gap-2 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold">Sections</dt>
            <dd>{formatNumber(book.stats.includedSectionCount)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold">Words</dt>
            <dd>{formatNumber(book.stats.wordCount)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold">Language</dt>
            <dd>{formatLanguage(book.language)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="font-semibold">Outputs</dt>
            <dd>{outputText}</dd>
          </div>
        </dl>
        <Link
          to={href}
          className={[
            toolControlButtonClass({ tone: "dark", rounded: "xl", full: true }),
            "mt-5",
          ].join(" ")}
        >
          Open book page
          <span className="sr-only"> for {book.title}</span>
        </Link>
      </div>
    </article>
  );
}

function BookCover({ book }: { book: MorseBookLibrarySummary }) {
  if (book.cover.src) {
    return (
      <img
        src={book.cover.src}
        alt={book.cover.alt}
        className="h-44 w-full rounded-xl object-cover sm:h-48"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={book.cover.alt}
      data-mw-morse-books-cover-placeholder="true"
      className="mw-static-tile flex min-h-44 w-full flex-col justify-between rounded-xl p-4 sm:min-h-48"
    >
      <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        MorseWords book
      </span>
      <div>
        <p className="mw-heading text-xl font-extrabold leading-tight text-sky-950">
          {book.title}
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-600">
          {bookAuthor(book)}
        </p>
      </div>
    </div>
  );
}
