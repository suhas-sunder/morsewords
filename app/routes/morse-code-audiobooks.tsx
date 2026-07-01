import * as React from "react";
import { Link } from "react-router";

import type { Route } from "./+types/morse-code-audiobooks";

import MorseBookLinkDirectory from "~/client/components/morse-code-books/MorseBookLinkDirectory";
import MorseBookPagination from "~/client/components/morse-code-books/MorseBookPagination";
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
  getDiscoverableMorseBookSummaries,
  morseAudiobookPath,
} from "~/client/data/morseBooks";
import { formatMorseBookAuthors } from "~/client/data/morseBookDisplay";
import {
  getMorseBookSuitability,
  morseBookSuitabilityLabel,
  shouldShowInLowerRiskBookFilter,
} from "~/client/data/morseBookSuitability";
import type { MorseBookLibrarySummary } from "~/client/data/morseBookTypes";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.morseAudiobooks;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const TITLE = "Morse code audiobooks";
const META_TITLE = "Morse Code Audiobooks | MorseWords";
const DESCRIPTION =
  "Browse processed books prepared for live browser Morse playback and MP3 download.";
const PAGE_SIZE = 12;
const DEFAULT_SORT_MODE: SortMode = "title-az";

type SortMode =
  | "title-az"
  | "title-za"
  | "author-az"
  | "author-za"
  | "word-count-asc"
  | "word-count-desc";

type AudiobookSummary = MorseBookLibrarySummary & {
  hubDescription: string;
  searchText: string;
  sortIndex: number;
  subjectsForHub: string[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function bookAuthor(book: MorseBookLibrarySummary) {
  return formatMorseBookAuthors(book.author);
}

function displayProvider(provider: string) {
  return provider.toLowerCase().includes("test fixture") ? "" : provider;
}

function cleanSubject(subject: string) {
  return subject.trim().replace(/\s+/g, " ");
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

async function loadSeoDescriptionsBySlug(books: readonly MorseBookLibrarySummary[]) {
  const { getMorseBookSeoDescriptionsBySlug } = await import(
    "~/client/data/morseBookSeoSummaries.server"
  );
  return getMorseBookSeoDescriptionsBySlug(books.map((book) => book.slug));
}

function audiobookDescription(
  book: MorseBookLibrarySummary,
  seoDescriptionsBySlug: Record<string, string>,
) {
  const seoDescription = seoDescriptionsBySlug[book.slug];
  if (seoDescription) return seoDescription;

  const description = book.description.trim();
  if (description && !description.toLowerCase().includes("development-only")) {
    return description;
  }
  return "A processed Project Gutenberg reference text prepared for browser-generated Morse audiobook practice.";
}

function enrichAudiobook(
  book: MorseBookLibrarySummary,
  sortIndex: number,
  seoDescriptionsBySlug: Record<string, string>,
): AudiobookSummary {
  const subjectsForHub = uniqueSorted(book.subjects.map(cleanSubject));
  const hubSubjects = subjectsForHub.length > 0 ? subjectsForHub : ["Classics"];
  const hubDescription = audiobookDescription(book, seoDescriptionsBySlug);
  const searchText = [
    book.title,
    bookAuthor(book),
    hubDescription,
    book.language,
    book.source.provider,
    ...hubSubjects,
  ]
    .join(" ")
    .toLowerCase();

  return {
    ...book,
    hubDescription,
    searchText,
    sortIndex,
    subjectsForHub: hubSubjects,
  };
}

function sortAudiobooks(books: AudiobookSummary[], sortMode: SortMode) {
  return [...books].sort((a, b) => {
    let result = 0;
    if (sortMode === "author-az" || sortMode === "author-za") {
      result = bookAuthor(a).localeCompare(bookAuthor(b));
      if (sortMode === "author-za") result *= -1;
    }
    if (sortMode === "title-az" || sortMode === "title-za") {
      result = a.title.localeCompare(b.title);
      if (sortMode === "title-za") result *= -1;
    }
    if (sortMode === "word-count-asc" || sortMode === "word-count-desc") {
      result = a.stats.wordCount - b.stats.wordCount;
      if (sortMode === "word-count-desc") result *= -1;
    }
    if (result !== 0) return result;
    const titleResult = a.title.localeCompare(b.title);
    return titleResult !== 0 ? titleResult : a.sortIndex - b.sortIndex;
  });
}

function subjectOptionsForBooks(books: AudiobookSummary[]) {
  const counts = new Map<string, number>();
  books.forEach((book) => {
    book.subjectsForHub.forEach((subject) => {
      counts.set(subject, (counts.get(subject) ?? 0) + 1);
    });
  });
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([subject, count]) => ({
      count,
      label: `${subject} (${formatNumber(count)})`,
      value: subject,
    }));
}

function resultCountText({
  filteredCount,
  totalCount,
  visibleEnd,
  visibleStart,
}: {
  filteredCount: number;
  totalCount: number;
  visibleEnd: number;
  visibleStart: number;
}) {
  if (totalCount === 0) return "0 audiobooks available";
  if (filteredCount === 0) return "Showing 0 of 0 audiobooks";
  if (filteredCount === 1) return "Showing 1 of 1 audiobook";
  return `Showing ${formatNumber(visibleStart)}-${formatNumber(
    visibleEnd,
  )} of ${formatNumber(filteredCount)} audiobooks`;
}

export async function loader() {
  const books = getDiscoverableMorseBookSummaries();
  return {
    books,
    seoDescriptionsBySlug: await loadSeoDescriptionsBySlug(books),
  };
}

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: META_TITLE,
    description: DESCRIPTION,
    path: CANONICAL_PATH,
    keywords:
      "Morse code audiobooks, Morse audiobook, book to Morse audio, chapter audio, Morse MP3 books",
  });

export default function MorseCodeAudiobooksRoute({
  loaderData,
}: Route.ComponentProps) {
  const { books, seoDescriptionsBySlug } = loaderData;
  const [query, setQuery] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [lowerRiskOnly, setLowerRiskOnly] = React.useState(false);
  const [sortMode, setSortMode] = React.useState<SortMode>(DEFAULT_SORT_MODE);
  const [currentPage, setCurrentPage] = React.useState(1);
  const collectionHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const collectionModuleRef = React.useRef<HTMLDivElement | null>(null);

  const audiobookBooks = React.useMemo(
    () =>
      books.map((book, index) =>
        enrichAudiobook(book, index, seoDescriptionsBySlug),
      ),
    [books, seoDescriptionsBySlug],
  );
  const subjectOptions = React.useMemo(
    () => subjectOptionsForBooks(audiobookBooks),
    [audiobookBooks],
  );

  const filteredBooks = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const candidates = audiobookBooks.filter((book) => {
      if (normalizedQuery && !book.searchText.includes(normalizedQuery)) {
        return false;
      }
      if (
        subjectFilter !== "all" &&
        !book.subjectsForHub.includes(subjectFilter)
      ) {
        return false;
      }
      if (lowerRiskOnly && !shouldShowInLowerRiskBookFilter(book.slug)) {
        return false;
      }
      return true;
    });
    return sortAudiobooks(candidates, sortMode);
  }, [audiobookBooks, lowerRiskOnly, query, sortMode, subjectFilter]);

  function returnToCollectionTop(options: { focusHeading?: boolean } = {}) {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      const target = collectionModuleRef.current ?? collectionHeadingRef.current;
      target?.scrollIntoView({ block: "start" });
      if (options.focusHeading) {
        collectionHeadingRef.current?.focus({ preventScroll: true });
      }
    });
  }

  function resetToFirstPageAndReturn() {
    setCurrentPage(1);
    returnToCollectionTop();
  }

  const pageCount = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, pageCount);
  const visibleStart =
    filteredBooks.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const visibleEnd = Math.min(activePage * PAGE_SIZE, filteredBooks.length);
  const visibleBooks = filteredBooks.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE,
  );
  const hasActiveFilters =
    query.trim().length > 0 ||
    subjectFilter !== "all" ||
    lowerRiskOnly ||
    sortMode !== DEFAULT_SORT_MODE;
  const resultText = resultCountText({
    filteredCount: filteredBooks.length,
    totalCount: books.length,
    visibleEnd,
    visibleStart,
  });

  function clearFilters() {
    setQuery("");
    setSubjectFilter("all");
    setLowerRiskOnly(false);
    setSortMode(DEFAULT_SORT_MODE);
    resetToFirstPageAndReturn();
  }

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: CANONICAL_URL,
    description: DESCRIPTION,
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    about: [
      "Morse code audiobooks",
      "Browser-generated Morse audio",
      "Chapter audio",
      "Morse MP3 downloads",
    ],
    ...(books.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: books.map((book, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${book.title} Morse audiobook`,
              url: canonicalUrl(morseAudiobookPath(book.slug)),
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
        name: "Morse Code Audiobooks",
        item: CANONICAL_URL,
      },
    ],
  };

  return (
    <main className={WAVE_PAGE_MAIN_CLASS}>
      <JsonLdScript jsonLd={[collectionJsonLd, breadcrumbJsonLd]} />
      <PageHero
        eyebrow="Morse audiobooks"
        title={TITLE}
        description="Open processed books as live Morse player pages. Audio and visuals are generated in your browser from your speed, tone, Farnsworth, and player settings."
      >
        <ActionLinks
          links={[
            {
              href: ROUTES.morseBooks,
              label: "Browse text book pages",
              primary: true,
            },
            { href: ROUTES.bookTranslator, label: "Convert your own text" },
            { href: ROUTES.mp3Generator, label: "Create MP3 audio" },
          ]}
        />
      </PageHero>

      <section
        className="mt-6 sm:mt-7"
        aria-labelledby="morse-audiobooks-library"
        data-testid="morse-audiobooks-browser"
      >
        <div className="min-w-0">
          <Eyebrow>Audio library</Eyebrow>
          <h2
            id="morse-audiobooks-library"
            ref={collectionHeadingRef}
            tabIndex={-1}
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            Browse Morse audiobook pages
          </h2>
          <p className="mw-text-muted mt-3 max-w-[64ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            Search processed public books by title, author, source, and subject.
            Opening a result loads that one whole-book JSON file, then chapter
            switching works from the loaded book data. These are historical
            public-domain works, not a youth-safe list by default; use the
            lower-risk filter for classroom or younger-reader review.
          </p>
        </div>

        <div
          ref={collectionModuleRef}
          className="mw-static-surface mt-5 rounded-xl bg-[#fffdf8]/76 p-3 sm:p-4 lg:p-5"
          data-testid="morse-audiobooks-collection-module"
        >
          <form
            className="grid gap-3"
            role="search"
            aria-label="Browse Morse audiobooks"
            data-testid="morse-audiobooks-toolbar"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid min-w-0 gap-2.5 md:grid-cols-2 lg:grid-cols-[minmax(280px,1.25fr)_minmax(190px,0.78fr)_minmax(190px,0.72fr)] lg:items-end">
              <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Search
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.currentTarget.value);
                    resetToFirstPageAndReturn();
                  }}
                  className="mw-input-text mw-input-placeholder min-h-10 w-full min-w-0 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  placeholder="Title, author, source, or subject"
                  aria-label="Search Morse audiobooks by title, author, source, or subject"
                />
              </label>
              <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Subject / genre
                <select
                  value={subjectFilter}
                  onChange={(event) => {
                    setSubjectFilter(event.currentTarget.value);
                    resetToFirstPageAndReturn();
                  }}
                  className="mw-input-text min-h-10 w-full min-w-0 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  disabled={subjectOptions.length === 0}
                  aria-label="Filter Morse audiobooks by subject"
                >
                  <option value="all">All subjects</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid min-w-0 gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Sort
                <select
                  value={sortMode}
                  onChange={(event) => {
                    setSortMode(event.currentTarget.value as SortMode);
                    resetToFirstPageAndReturn();
                  }}
                  className="mw-input-text min-h-10 w-full min-w-0 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  aria-label="Sort Morse audiobooks"
                >
                  <option value="title-az">Title A-Z</option>
                  <option value="title-za">Title Z-A</option>
                  <option value="author-az">Author A-Z</option>
                  <option value="author-za">Author Z-A</option>
                  <option value="word-count-asc">Word count low to high</option>
                  <option value="word-count-desc">Word count high to low</option>
                </select>
              </label>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-[#fffdf8]/82 px-3 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={lowerRiskOnly}
                onChange={(event) => {
                  setLowerRiskOnly(event.currentTarget.checked);
                  resetToFirstPageAndReturn();
                }}
                className="mt-0.5 h-4 w-4 accent-sky-500"
                data-testid="morse-audiobooks-lower-risk-filter"
              />
              <span className="grid min-w-0 gap-1">
                <span className="text-sky-950">Show lower-risk books only</span>
                <span className="text-xs font-medium leading-relaxed text-slate-600">
                  Hides audiobooks the strict audit flagged for classroom or younger-reader review.
                </span>
              </span>
            </label>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p
              className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
              data-testid="morse-audiobooks-result-count"
              aria-live="polite"
            >
              {resultText}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer text-sm font-semibold text-sky-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                data-testid="morse-audiobooks-reset-view"
              >
                Reset view
              </button>
            ) : null}
          </div>

          <div className="mt-4">
            {visibleBooks.length > 0 ? (
              <>
                <div
                  className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
                  data-testid="morse-audiobooks-card-grid"
                >
                  {visibleBooks.map((book) => (
                    <AudiobookCard key={book.slug} book={book} />
                  ))}
                </div>
                {pageCount > 1 ? (
                  <MorseBookPagination
                    ariaLabel="Morse audiobooks pages"
                    currentPage={activePage}
                    pageCount={pageCount}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      returnToCollectionTop({ focusHeading: true });
                    }}
                    testId="morse-audiobooks-pagination"
                  />
                ) : null}
              </>
            ) : (
              <section
                className="rounded-lg bg-[#fffdf8]/82 px-4 py-3"
                data-testid="morse-audiobooks-no-matches"
                aria-live="polite"
              >
                <h3 className="mw-heading text-lg font-extrabold text-sky-950">
                  No audiobooks match your current view
                </h3>
                <p className="mw-text-muted mt-1 text-sm leading-relaxed text-slate-700">
                  Reset the view or try another title, author, source, or subject.
                </p>
              </section>
            )}
          </div>
        </div>
      </section>

      <MorseBookLinkDirectory books={books} mode="audiobook" />

      <section className="mt-9 sm:mt-11" aria-labelledby="morse-audiobooks-flow">
        <div className="max-w-[68ch]">
          <Eyebrow>Listening flow</Eyebrow>
          <h2
            id="morse-audiobooks-flow"
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            Browser-generated audio, not hosted files
          </h2>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            These pages do not point to pre-made audio files. Choose the full
            book or selected chapters, adjust speed, tone, Farnsworth timing,
            player settings, and visual layers, then listen or watch from your
            browser.
          </p>
        </div>
      </section>

      <BreadcrumbTrail current="Morse Code Audiobooks" placement="contentFooter" />
    </main>
  );
}

function AudiobookCard({ book }: { book: AudiobookSummary }) {
  const suitability = getMorseBookSuitability(book.slug);
  const metadata = [
    "Morse audiobook",
    book.stats.sectionCount > 0
      ? `${formatNumber(book.stats.sectionCount)} chapters/sections`
      : "",
    `${formatNumber(book.stats.wordCount)} words`,
    displayProvider(book.source.provider),
  ].filter(Boolean);

  return (
    <Link
      to={morseAudiobookPath(book.slug)}
      className="mw-static-surface group flex h-full min-w-0 cursor-pointer flex-col rounded-xl bg-[#fffdf8]/90 p-3 text-left no-underline hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:p-4"
      data-testid="morse-audiobook-card"
      data-mw-morse-audiobook-card-slug={book.slug}
      aria-label={`${book.title} Morse audiobook by ${bookAuthor(book)}`}
    >
      <div className="mw-static-tile rounded-lg p-3">
        <div className="mx-auto flex aspect-[3/4] w-full max-w-[8.5rem] flex-col justify-between rounded-lg bg-[#fffdf8]/72 p-3">
          <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Morse audio
          </span>
          <span className="mw-heading text-lg font-extrabold leading-tight text-sky-950">
            {book.title}
          </span>
          <span className="block h-1.5 w-20 rounded-full bg-slate-300/45" />
        </div>
      </div>
      <div className="mt-4 grid min-w-0 gap-2">
        <h3
          className="mw-heading break-words text-lg font-extrabold leading-tight text-sky-950 underline-offset-4 group-hover:underline"
          data-testid="morse-audiobook-card-title"
        >
          {book.title}
        </h3>
        <p
          className="break-words text-sm font-semibold leading-snug text-slate-600"
          data-testid="morse-audiobook-card-author"
        >
          {bookAuthor(book)}
        </p>
        <p
          className="mw-text-muted break-words text-sm leading-relaxed text-slate-700"
          data-testid="morse-audiobook-card-description"
        >
          {book.hubDescription}
        </p>
        <p
          className="break-words font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500"
          data-testid="morse-audiobook-card-subjects"
        >
          {book.subjectsForHub.join(" / ")}
        </p>
        <p
          className="break-words text-xs font-semibold leading-relaxed text-slate-600"
          data-testid="morse-audiobook-card-meta"
        >
          {metadata.join(" / ")}
        </p>
        <p
          className="break-words rounded-lg bg-[#fffaf2]/80 px-2 py-1.5 text-xs font-semibold leading-relaxed text-slate-700"
          data-testid="morse-audiobook-card-content-suitability"
        >
          {morseBookSuitabilityLabel(suitability)}
        </p>
        <span
          className={toolControlButtonClass({
            rounded: "lg",
            size: "sm",
            tone: "dark",
          })}
        >
          Open live player
        </span>
      </div>
    </Link>
  );
}
