import * as React from "react";
import { Link } from "react-router";

import type { Route } from "./+types/morse-code-books";

import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  Eyebrow,
  PageHero,
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
const TITLE = "Morse code books and audiobooks";
const META_TITLE = "Morse Code Books and Audiobooks | MorseWords";
const DESCRIPTION =
  "Browse reviewed public-domain Morse books and turn chapters into browser-local Morse audio, video, and practice material.";
const PAGE_SIZE = 12;

const processSteps = [
  {
    title: "Pick a reviewed book",
    text: "Start from a public listing that has been prepared for chapter-based Morse practice.",
  },
  {
    title: "Choose a section",
    text: "Open one chapter or combine a small group of sections for a manageable session.",
  },
  {
    title: "Preview text and Morse",
    text: "Check the readable text and generated Morse before you play or export anything.",
  },
  {
    title: "Tune the signal",
    text: "Adjust speed, tone, Farnsworth spacing, audio settings, or video settings.",
  },
  {
    title: "Download output",
    text: "Save Morse audio or video from the browser when the book page is ready for export.",
  },
];

const placeholderCards = Array.from({ length: 6 }, (_, index) => ({
  id: `placeholder-${index + 1}`,
  label: `Coming soon preview ${index + 1}`,
}));

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

function resultCountText({
  allBooksCount,
  filteredCount,
  visibleCount,
}: {
  allBooksCount: number;
  filteredCount: number;
  visibleCount: number;
}) {
  if (allBooksCount === 0) return "0 reviewed books available";
  return `Showing ${formatNumber(visibleCount)} of ${formatBookCount(filteredCount)}`;
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
  const collectionResultText = resultCountText({
    allBooksCount: books.length,
    filteredCount: filteredBooks.length,
    visibleCount: visibleBooks.length,
  });

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
        title={TITLE}
        description="Browse reviewed public-domain books and turn chapters into Morse audio, video, and practice material."
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

      <section
        className="mt-6 sm:mt-7"
        aria-labelledby="morse-books-library"
        data-testid="morse-books-browser"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <Eyebrow>Library browser</Eyebrow>
            <h2
              id="morse-books-library"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Browse the Morse book library
            </h2>
            <p className="mw-text-muted mt-3 max-w-[64ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Search, filter, sort, and open chapter-ready book pages when
              reviewed titles are available.
            </p>
          </div>
          <p
            className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 lg:text-right"
            data-testid="morse-books-result-count"
            aria-live="polite"
          >
            {collectionResultText}
          </p>
        </div>

        <form
          className="mw-input-panel mt-5 rounded-xl bg-white/88 p-4 sm:p-5"
          role="search"
          aria-label="Browse reviewed Morse books"
          data-testid="morse-books-toolbar"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,1.35fr)_minmax(160px,0.8fr)_minmax(140px,0.65fr)_minmax(140px,0.65fr)_minmax(132px,0.55fr)] lg:items-end">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Search title, author, or subject
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                className="mw-input-text mw-input-placeholder min-h-11 rounded-xl bg-white/88 px-4 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                placeholder={
                  controlsDisabled
                    ? "Books coming soon"
                    : "Search reviewed books"
                }
                disabled={controlsDisabled}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Subject
              <select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.currentTarget.value)}
                className="mw-input-text min-h-11 rounded-xl bg-white/88 px-3 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
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
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Language
              <select
                value={languageFilter}
                onChange={(event) => setLanguageFilter(event.currentTarget.value)}
                className="mw-input-text min-h-11 rounded-xl bg-white/88 px-3 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
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
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              Sort
              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.currentTarget.value as SortMode)
                }
                className="mw-input-text min-h-11 rounded-xl bg-white/88 px-3 py-2 text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                disabled={controlsDisabled}
                aria-label="Sort Morse books"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="wordCount">Word count</option>
              </select>
            </label>
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
        </form>

        {books.length === 0 ? (
          <EmptyCollectionShelf />
        ) : filteredBooks.length > 0 ? (
          <>
            <div
              className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              data-testid="morse-books-card-grid"
            >
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
          <section
            className="mw-static-surface mt-6 rounded-xl p-5 sm:p-6"
            aria-live="polite"
            data-testid="morse-books-no-matches"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              No matches
            </p>
            <h3 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
              No reviewed books match that search.
            </h3>
            <p className="mw-text-muted mt-3 max-w-[58ch] text-base leading-relaxed text-slate-700">
              Try a title, author, source provider, or subject from the
              reviewed collection.
            </p>
          </section>
        )}
      </section>

      <section className="mt-9 sm:mt-11" aria-labelledby="morse-books-workflow">
        <div className="max-w-[68ch]">
          <Eyebrow>Chapter workflow</Eyebrow>
          <h2
            id="morse-books-workflow"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            How Morse book pages work
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            Book pages are meant for short, repeatable sessions: choose a
            section, inspect the output, then listen or export when the signal
            feels right.
          </p>
        </div>
        <ol className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => (
            <li key={step.title} className="min-w-0">
              <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Step {index + 1}
              </p>
              <h3 className="mw-heading mt-2 text-lg font-extrabold leading-snug text-sky-950">
                {step.title}
              </h3>
              <p className="mw-text-muted mt-2 text-sm leading-relaxed text-slate-700">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-9 sm:mt-11" aria-labelledby="morse-books-own-text">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.68fr)_minmax(240px,0.32fr)] lg:items-start">
          <div className="min-w-0">
            <Eyebrow>Use your own text</Eyebrow>
            <h2
              id="morse-books-own-text"
              className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
            >
              Want to use your own text?
            </h2>
            <p className="mw-text-muted mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Paste or upload your own public-domain text, notes, chapters, or
              documents in the book translator. It is the best place for custom
              material while this library grows.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Link
              to={ROUTES.bookTranslator}
              className={toolControlButtonClass({ tone: "dark", rounded: "xl" })}
            >
              Open the book translator
            </Link>
          </div>
        </div>
      </section>

      <section
        className="mt-9 sm:mt-11"
        aria-labelledby="morse-books-small-collection"
      >
        <div className="max-w-[68ch]">
          <Eyebrow>Library quality</Eyebrow>
          <h2
            id="morse-books-small-collection"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            Why the collection starts small
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            Books appear after source details are checked and chapter text is
            prepared. That keeps the collection useful for learners and avoids
            cluttered, low-quality book pages.
          </p>
        </div>
      </section>

      <BreadcrumbTrail current="Morse Code Books" placement="contentFooter" />
    </main>
  );
}

function EmptyCollectionShelf() {
  return (
    <section
      className="mw-static-surface mt-6 rounded-xl p-4 sm:p-6"
      data-testid="morse-books-empty-state"
      aria-label="Morse books empty collection"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:items-center">
        <div className="min-w-0">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Coming soon
          </p>
          <h3 className="mw-heading mt-3 text-2xl font-extrabold text-sky-950">
            Reviewed Morse books are coming soon.
          </h3>
          <p className="mw-text-muted mt-3 max-w-[58ch] text-base leading-relaxed text-slate-700">
            Books will appear here after they are checked and prepared for
            chapter-based Morse audio and video. For now, use the book
            translator to convert your own public-domain text.
          </p>
          <div className="mt-5">
            <Link
              to={ROUTES.bookTranslator}
              className={toolControlButtonClass({ tone: "dark", rounded: "xl" })}
            >
              Open the book translator
            </Link>
          </div>
        </div>
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          data-testid="morse-books-placeholder-grid"
          aria-label="Preview shelf of coming-soon Morse book cards"
        >
          {placeholderCards.map((card) => (
            <article
              key={card.id}
              className="mw-static-tile flex min-h-[10rem] flex-col justify-between rounded-xl p-3"
              data-testid="morse-books-placeholder-card"
              data-mw-morse-books-placeholder-card="true"
              aria-label={card.label}
            >
              <span className="mw-muted-label font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Preview
              </span>
              <div>
                <div className="mb-3 h-14 rounded-lg bg-[#fffdf8]/70" />
                <p className="mw-heading text-base font-extrabold leading-tight text-sky-950">
                  Coming soon
                </p>
                <p className="mw-text-soft mt-1 text-xs font-semibold text-slate-600">
                  Not a public listing yet
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookCard({
  book,
  href,
}: {
  book: MorseBookLibrarySummary;
  href: string;
}) {
  return (
    <article
      className="mw-static-surface flex h-full flex-col rounded-xl bg-[#fffdf8]/86 p-4 sm:p-5"
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
        {book.description ? (
          <p className="mw-text-muted mt-3 text-sm leading-relaxed text-slate-700">
            {book.description}
          </p>
        ) : null}
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
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
          <div>
            <dt className="mw-muted-label font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Sections
            </dt>
            <dd className="mw-heading mt-1 font-extrabold text-sky-950">
              {formatNumber(book.stats.includedSectionCount)}
            </dd>
          </div>
          <div>
            <dt className="mw-muted-label font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Words
            </dt>
            <dd className="mw-heading mt-1 font-extrabold text-sky-950">
              {formatNumber(book.stats.wordCount)}
            </dd>
          </div>
        </dl>
        <div
          className="mt-4 flex flex-wrap gap-1.5"
          aria-label="Available Morse book outputs"
        >
          {["Morse audio", "Morse video", "Chapter practice"].map((badge) => (
            <span
              key={badge}
              className="mw-muted-label mw-static-tile rounded-full px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500"
              data-testid="morse-book-output-badge"
            >
              {badge}
            </span>
          ))}
        </div>
        <Link
          to={href}
          className={[
            toolControlButtonClass({ tone: "dark", rounded: "xl", full: true }),
            "mt-5",
          ].join(" ")}
        >
          Open book
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
        className="h-56 w-full rounded-xl object-cover sm:h-60"
        data-testid="morse-book-cover"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={book.cover.alt}
      data-testid="morse-book-cover-placeholder"
      data-mw-morse-books-cover-placeholder="true"
      className="mw-static-tile flex min-h-56 w-full flex-col justify-between rounded-xl p-4 sm:min-h-60"
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
