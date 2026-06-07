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
  "Browse Morse book pages and turn chapters into browser-local Morse audio, video, and practice material.";
const PAGE_SIZE = 12;

const processSteps = [
  {
    title: "Open a book page",
    text: "Start from a book page built for focused listening, practice, and export.",
  },
  {
    title: "Choose a chapter or section",
    text: "Work with one chapter or section at a time for a manageable practice session.",
  },
  {
    title: "Preview text and Morse",
    text: "Check the readable text and Morse before you play or export anything.",
  },
  {
    title: "Adjust settings",
    text: "Adjust speed, tone, spacing, audio settings, or video settings.",
  },
  {
    title: "Download Morse audio or video",
    text: "Save Morse audio or video from the browser when the result fits your session.",
  },
];

const placeholderCards = Array.from({ length: 5 }, (_, index) => ({
  id: `placeholder-${index + 1}`,
  label: `Book page ${index + 1}`,
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
  return count === 1 ? "1 book" : `${formatNumber(count)} books`;
}

function resultCountText({
  allBooksCount,
  filteredCount,
  visibleEnd,
  visibleStart,
}: {
  allBooksCount: number;
  filteredCount: number;
  visibleEnd: number;
  visibleStart: number;
}) {
  if (allBooksCount === 0) return "0 books available";
  if (filteredCount === 0) return "Showing 0 of 0 books";
  if (filteredCount === 1) return "Showing 1 of 1 book";
  return `Showing ${formatNumber(visibleStart)}-${formatNumber(
    visibleEnd,
  )} of ${formatBookCount(filteredCount)}`;
}

function displayBookDescription(description: string) {
  if (description.toLowerCase().includes("development-only")) {
    return "Chapter-ready text for Morse audio, video, and practice.";
  }
  return description;
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
  const [currentPage, setCurrentPage] = React.useState(1);

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
    setCurrentPage(1);
  }, [languageFilter, query, sortMode, subjectFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, pageCount);
  const visibleStart = filteredBooks.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const visibleEnd = Math.min(activePage * PAGE_SIZE, filteredBooks.length);
  const visibleBooks = filteredBooks.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE,
  );
  const hasActiveFilters =
    query.trim().length > 0 ||
    subjectFilter !== "all" ||
    languageFilter !== "all" ||
    sortMode !== "title";
  const hasMultiplePages = pageCount > 1;
  const collectionResultText = resultCountText({
    allBooksCount: books.length,
    filteredCount: filteredBooks.length,
    visibleEnd,
    visibleStart,
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
        description="Browse book pages and turn chapters into Morse audio, video, and practice material."
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
        <div className="min-w-0">
          <Eyebrow>Library browser</Eyebrow>
          <h2
            id="morse-books-library"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            Browse the Morse book library
          </h2>
          <p className="mw-text-muted mt-3 max-w-[64ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            Search, filter, sort, and open chapter-ready book pages from the
            collection.
          </p>
        </div>

        <div
          className="mw-static-surface mt-5 rounded-xl bg-[#fffdf8]/76 p-3 sm:p-4 lg:p-5"
          data-testid="morse-books-collection-module"
        >
          <form
            className="grid gap-3"
            role="search"
            aria-label="Browse Morse books"
            data-testid="morse-books-toolbar"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-[minmax(240px,1.25fr)_minmax(150px,0.72fr)_minmax(130px,0.55fr)_minmax(130px,0.55fr)_minmax(120px,0.46fr)] lg:items-end">
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Search
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  className="mw-input-text mw-input-placeholder min-h-10 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  placeholder="Title, author, or subject"
                  aria-label="Search title, author, or subject"
                />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Subject
                <select
                  value={subjectFilter}
                  onChange={(event) =>
                    setSubjectFilter(event.currentTarget.value)
                  }
                  className="mw-input-text min-h-10 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  disabled={subjectOptions.length === 0}
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
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Language
                <select
                  value={languageFilter}
                  onChange={(event) =>
                    setLanguageFilter(event.currentTarget.value)
                  }
                  className="mw-input-text min-h-10 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  disabled={languageOptions.length === 0}
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
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Sort
                <select
                  value={sortMode}
                  onChange={(event) =>
                    setSortMode(event.currentTarget.value as SortMode)
                  }
                  className="mw-input-text min-h-10 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
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
                  rounded: "lg",
                  size: "sm",
                  full: true,
                  disabled: !hasActiveFilters,
                })}
              >
                Clear filters
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p
              className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
              data-testid="morse-books-result-count"
              aria-live="polite"
            >
              {collectionResultText}
            </p>
          </div>

          <div className="mt-4">
            {books.length === 0 ? (
              <EmptyCollectionShelf variant="empty" />
            ) : filteredBooks.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
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
                {hasMultiplePages ? (
                  <PaginationControls
                    currentPage={activePage}
                    pageCount={pageCount}
                    onPageChange={setCurrentPage}
                  />
                ) : null}
              </>
            ) : (
              <EmptyCollectionShelf variant="filtered" />
            )}
          </div>
        </div>
      </section>

      <section className="mt-9 sm:mt-11" aria-labelledby="morse-books-workflow">
        <div className="max-w-[68ch]">
          <Eyebrow>Chapter workflow</Eyebrow>
          <h2
            id="morse-books-workflow"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            What you can do with a Morse book
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            Book pages are meant for short, repeatable sessions: choose a
            chapter, preview the Morse, then listen or export when the signal
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
              Use your own text
            </h2>
            <p className="mw-text-muted mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Convert public-domain text, notes, chapters, or documents with the
              book translator.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Link
              to={ROUTES.bookTranslator}
              className={toolControlButtonClass({ tone: "dark", rounded: "xl" })}
            >
              Convert your own text
            </Link>
          </div>
        </div>
      </section>

      <BreadcrumbTrail current="Morse Code Books" placement="contentFooter" />
    </main>
  );
}

function PaginationControls({
  currentPage,
  onPageChange,
  pageCount,
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageCount: number;
}) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      className="mt-5 flex flex-wrap items-center justify-center gap-2"
      aria-label="Morse books pages"
      data-testid="morse-books-pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={toolControlButtonClass({
          rounded: "lg",
          size: "sm",
          disabled: currentPage === 1,
        })}
      >
        Previous
      </button>
      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? "page" : undefined}
            className={toolControlButtonClass({
              active: isCurrent,
              rounded: "lg",
              size: "sm",
            })}
          >
            {page}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
        disabled={currentPage === pageCount}
        className={toolControlButtonClass({
          rounded: "lg",
          size: "sm",
          disabled: currentPage === pageCount,
        })}
      >
        Next
      </button>
    </nav>
  );
}

function EmptyCollectionShelf({ variant }: { variant: "empty" | "filtered" }) {
  const isFiltered = variant === "filtered";

  return (
    <section
      className="rounded-lg"
      data-testid={
        isFiltered ? "morse-books-no-matches" : "morse-books-empty-state"
      }
      aria-label={
        isFiltered ? "No matching Morse books" : "Morse books empty collection"
      }
      aria-live="polite"
    >
      {isFiltered ? (
        <div
          className="mb-4 rounded-lg bg-[#fffdf8]/82 px-4 py-3"
          data-testid="morse-books-no-match-note"
        >
          <h3 className="mw-heading text-lg font-extrabold text-sky-950">
            No books match your current view
          </h3>
          <p className="mw-text-muted mt-1 text-sm leading-relaxed text-slate-700">
            Clear filters or try another title, author, or subject.
          </p>
        </div>
      ) : (
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#fffdf8]/82 px-4 py-3"
          data-testid="morse-books-empty-copy"
        >
          <div className="min-w-0">
            <h3 className="mw-heading text-xl font-extrabold text-sky-950">
              The collection is being prepared
            </h3>
            <p className="mw-text-muted mt-1 max-w-[58ch] text-sm leading-relaxed text-slate-700">
              Create Morse audio or video from your own text while the first
              book pages are added.
            </p>
          </div>
          <Link
            to={ROUTES.bookTranslator}
            className={toolControlButtonClass({
              tone: "dark",
              rounded: "lg",
              size: "sm",
            })}
          >
            Convert your own text
          </Link>
        </div>
      )}

      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3 sm:gap-4"
        data-testid="morse-books-placeholder-grid"
        aria-label="Empty shelf of Morse book cards"
      >
        {placeholderCards.map((card) => (
          <article
            key={card.id}
            className="mw-static-tile flex min-h-[18rem] flex-col rounded-xl p-4"
            data-testid="morse-books-placeholder-card"
            data-mw-morse-books-placeholder-card="true"
            aria-label={card.label}
          >
            <div
              className="rounded-lg bg-[#fffdf8]/72 p-3"
              data-testid="morse-books-placeholder-cover"
              aria-hidden="true"
            >
              <div className="mx-auto flex aspect-[2.85/4] w-full max-w-[8.5rem] flex-col justify-between rounded-lg bg-[#f2eee6] p-3">
                <span className="block h-2 w-14 rounded-full bg-slate-300/45" />
                <span className="block h-16 w-full rounded-md bg-[#fffdf8]/72" />
                <div className="grid gap-1.5">
                  <span className="block h-1.5 w-16 rounded-full bg-slate-300/45" />
                  <span className="block h-1.5 w-10 rounded-full bg-slate-300/45" />
                </div>
              </div>
            </div>
            <p
              className="mw-heading mt-4 text-base font-extrabold leading-tight text-sky-950"
              data-testid="morse-books-placeholder-title"
            >
              Book page
            </p>
          </article>
        ))}
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
  const description = displayBookDescription(book.description);

  return (
    <Link
      to={href}
      className="mw-static-surface group flex h-full min-w-0 cursor-pointer flex-col rounded-xl bg-[#fffdf8]/90 p-3 text-left no-underline hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:p-4"
      data-testid="morse-book-card"
      data-mw-morse-book-card-slug={book.slug}
      aria-label={`${book.title} by ${bookAuthor(book)}`}
    >
      <BookCover book={book} />
      <div className="mt-4 grid min-w-0 gap-2">
        <h3
          className="mw-heading break-words text-lg font-extrabold leading-tight text-sky-950 underline-offset-4 group-hover:underline"
          data-testid="morse-book-card-title"
        >
          {book.title}
        </h3>
        <p
          className="break-words text-sm font-semibold leading-snug text-slate-600"
          data-testid="morse-book-card-author"
        >
          {bookAuthor(book)}
        </p>
        {description ? (
          <p
            className="mw-text-muted break-words text-sm leading-relaxed text-slate-700"
            data-testid="morse-book-card-description"
          >
            {description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function BookCover({ book }: { book: MorseBookLibrarySummary }) {
  if (book.cover.src) {
    return (
      <img
        src={book.cover.src}
        alt={book.cover.alt}
        className="aspect-[4/3] w-full rounded-lg object-cover"
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
      className="mw-static-tile rounded-lg p-3"
    >
      <div className="mx-auto flex aspect-[3/4] w-full max-w-[8.5rem] flex-col justify-between rounded-lg bg-[#fffdf8]/72 p-3">
        <span className="block h-2 w-16 rounded-full bg-slate-300/45" />
        <span className="block h-16 w-full rounded-md bg-[#f2eee6]" />
        <div className="grid gap-1.5">
          <span className="block h-1.5 w-20 rounded-full bg-slate-300/45" />
          <span className="block h-1.5 w-12 rounded-full bg-slate-300/45" />
        </div>
      </div>
    </div>
  );
}
