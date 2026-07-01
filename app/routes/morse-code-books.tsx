import * as React from "react";
import { Link } from "react-router";

import type { Route } from "./+types/morse-code-books";

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
  TEST_COLLECTION_BOOK_PREVIEW_VALUE,
  TEST_PUBLISHED_BOOK_PREVIEW_VALUE,
  TEST_PUBLISHED_BOOK_SLUG,
  UNPUBLISHED_BOOK_PREVIEW_PARAM,
  getDiscoverableMorseBookSummaries,
  getPublishedMorseBookSummariesRuntime,
  morseBookPath,
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

const CANONICAL_PATH = ROUTES.morseBooks;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const TITLE = "Morse code books";
const META_TITLE = "Morse Code Books | MorseWords";
const DESCRIPTION =
  "Browse processed Morse book pages with cleaned text, chapter selection, and browser-local practice tools.";
const PAGE_SIZE = 12;
const DEFAULT_SORT_MODE: SortMode = "title-az";

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
    text: "Adjust speed, tone, spacing, MP3 download settings, or live player settings.",
  },
  {
    title: "Download MP3 or open the live player",
    text: "Save Morse MP3 audio from the browser or continue in the live visual player.",
  },
];

const placeholderCards = Array.from({ length: 5 }, (_, index) => ({
  id: `placeholder-${index + 1}`,
  label: `Book page ${index + 1}`,
}));

type SortMode =
  | "title-az"
  | "title-za"
  | "author-az"
  | "author-za"
  | "word-count-asc"
  | "word-count-desc";

type HubBook = MorseBookLibrarySummary & {
  hubDescription: string;
  hubSearchText: string;
  hubSortIndex: number;
  hubSubjects: string[];
};

type PublicBookPresentation = {
  description: string;
  subjects: string[];
};

const APPROVED_BOOK_PRESENTATION: Record<string, PublicBookPresentation> = {
  "anne-of-green-gables": {
    description:
      "A warm coming-of-age classic about Anne Shirley, Avonlea, friendship, and finding a home.",
    subjects: ["Children", "Classics", "Young Adult"],
  },
  "crime-and-punishment": {
    description:
      "A psychological classic following Raskolnikov through guilt, consequence, and moral reckoning.",
    subjects: ["Classics", "Crime", "Fiction"],
  },
  "dr-jekyll-and-mr-hyde": {
    description:
      "A compact Gothic horror story about identity, secrecy, and a dangerous experiment.",
    subjects: ["Classics", "Gothic", "Horror"],
  },
  frankenstein: {
    description:
      "Mary Shelley's Gothic science-fiction novel about creation, responsibility, and isolation.",
    subjects: ["Classics", "Gothic", "Horror", "Science Fiction"],
  },
  "gulliver-s-travels": {
    description:
      "A satirical voyage through strange lands, remote nations, and sharply observed human habits.",
    subjects: ["Adventure", "Classics", "Fantasy"],
  },
  "the-call-of-the-wild": {
    description:
      "A wilderness adventure following Buck through hardship, instinct, and the pull of the North.",
    subjects: ["Adventure", "Classics", "Fiction"],
  },
  "the-emerald-city-of-oz": {
    description:
      "An Oz fantasy adventure with Dorothy, magical lands, and a journey toward the Emerald City.",
    subjects: ["Adventure", "Children", "Fantasy"],
  },
  "the-great-gatsby": {
    description:
      "A Jazz Age classic about longing, wealth, reinvention, and the cost of illusion.",
    subjects: ["Classics", "Fiction"],
  },
  "the-jungle-book": {
    description:
      "Linked animal tales and adventure stories with Mowgli, the jungle, and memorable voices.",
    subjects: ["Adventure", "Children", "Classics"],
  },
  "the-picture-of-dorian-gray": {
    description:
      "A Gothic classic about beauty, vanity, influence, and the hidden cost of corruption.",
    subjects: ["Classics", "Fiction", "Gothic"],
  },
  "the-princess-and-the-goblin": {
    description:
      "A children's fantasy about Princess Irene, Curdie, underground danger, and quiet courage.",
    subjects: ["Children", "Fantasy"],
  },
  "the-railway-children": {
    description:
      "A children's classic about family, kindness, and three children drawn to the railway.",
    subjects: ["Children", "Classics"],
  },
  "the-sea-wolf": {
    description:
      "A sea adventure and character study aboard a sealing schooner under Wolf Larsen.",
    subjects: ["Adventure", "Classics", "Fiction"],
  },
  "the-secret-garden-gutenberg-113": {
    description:
      "A children's classic about loneliness, friendship, renewal, and a hidden garden.",
    subjects: ["Children", "Classics"],
  },
  "the-three-musketeers": {
    description:
      "A swashbuckling adventure of friendship, intrigue, swordplay, and court politics.",
    subjects: ["Adventure", "Classics", "Historical Fiction"],
  },
  "treasure-island": {
    description:
      "A pirate adventure with Jim Hawkins, buried treasure, sea danger, and Long John Silver.",
    subjects: ["Adventure", "Classics", "Young Adult"],
  },
};

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
  return formatMorseBookAuthors(book.author);
}

function searchableBookText(book: HubBook) {
  return [
    book.title,
    bookAuthor(book),
    book.hubDescription,
    book.source.provider,
    book.language,
    ...book.hubSubjects,
  ]
    .join(" ")
    .toLowerCase();
}

function sortBooks(books: HubBook[], sortMode: SortMode) {
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
    if (titleResult !== 0) return titleResult;
    return a.hubSortIndex - b.hubSortIndex;
  });
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
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
    return "Chapter-ready text for Morse audio, live playback, and practice.";
  }
  return description;
}

function displayBookProvider(provider: string) {
  return provider.toLowerCase().includes("test fixture") ? "" : provider;
}

function displaySubjectLabel(subject: string) {
  return subject.trim().replace(/\s+/g, " ");
}

function hubSubjectsForBook(book: MorseBookLibrarySummary) {
  const curatedSubjects = APPROVED_BOOK_PRESENTATION[book.slug]?.subjects ?? [];
  const sourceSubjects = book.subjects.map(displaySubjectLabel).filter(Boolean);
  const subjects = uniqueSorted([...curatedSubjects, ...sourceSubjects]);
  return subjects.length > 0 ? subjects : ["Classics"];
}

async function loadSeoDescriptionsBySlug(books: readonly MorseBookLibrarySummary[]) {
  const { getMorseBookSeoDescriptionsBySlug } = await import(
    "~/client/data/morseBookSeoSummaries.server"
  );
  return getMorseBookSeoDescriptionsBySlug(books.map((book) => book.slug));
}

function hubDescriptionForBook(
  book: MorseBookLibrarySummary,
  seoDescriptionsBySlug: Record<string, string>,
) {
  const seoDescription = seoDescriptionsBySlug[book.slug];
  const curatedDescription = APPROVED_BOOK_PRESENTATION[book.slug]?.description;
  const sourceDescription = displayBookDescription(book.description).trim();
  return (
    seoDescription ||
    curatedDescription ||
    sourceDescription ||
    "A processed Project Gutenberg reference text prepared for browser-local Morse reading, MP3 audio, and live playback."
  );
}

function enrichBookForHub(
  book: MorseBookLibrarySummary,
  hubSortIndex: number,
  seoDescriptionsBySlug: Record<string, string>,
): HubBook {
  const hubSubjects = hubSubjectsForBook(book);
  const hubDescription = hubDescriptionForBook(book, seoDescriptionsBySlug);
  const hubBook = {
    ...book,
    hubDescription,
    hubSearchText: "",
    hubSortIndex,
    hubSubjects,
  };
  return {
    ...hubBook,
    hubSearchText: searchableBookText(hubBook),
  };
}

function subjectOptionsForBooks(books: HubBook[]) {
  const counts = new Map<string, number>();
  books.forEach((book) => {
    book.hubSubjects.forEach((subject) => {
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

function publicBookHref(book: MorseBookLibrarySummary, includeTestFixture: boolean) {
  const path = morseBookPath(book.slug);
  if (includeTestFixture && book.slug === TEST_PUBLISHED_BOOK_SLUG) {
    return `${morseBookPath(book.slug)}?${UNPUBLISHED_BOOK_PREVIEW_PARAM}=${TEST_PUBLISHED_BOOK_PREVIEW_VALUE}`;
  }
  return path;
}

export async function loader({ request }: Route.LoaderArgs) {
  const includeTestFixture = isTestPublishedPreviewRequest(request);
  const includeTestCollectionFixture = isTestCollectionPreviewRequest(request);
  const books =
    includeTestFixture || includeTestCollectionFixture
      ? await getPublishedMorseBookSummariesRuntime({
          includeTestFixture,
          includeTestCollectionFixture,
        })
      : getDiscoverableMorseBookSummaries();
  return {
    books,
    includeTestFixture: includeTestFixture || includeTestCollectionFixture,
    seoDescriptionsBySlug: await loadSeoDescriptionsBySlug(books),
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
      "Morse code books, book to Morse code, public domain Morse text, Project Gutenberg Morse code, long text to Morse audio",
  });

export default function MorseCodeBooksHubRoute({
  loaderData,
}: Route.ComponentProps) {
  const { books, includeTestFixture, seoDescriptionsBySlug } = loaderData;
  const [query, setQuery] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [lowerRiskOnly, setLowerRiskOnly] = React.useState(false);
  const [sortMode, setSortMode] = React.useState<SortMode>(DEFAULT_SORT_MODE);
  const [currentPage, setCurrentPage] = React.useState(1);
  const collectionHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
  const collectionModuleRef = React.useRef<HTMLDivElement | null>(null);

  const hubBooks = React.useMemo(
    () =>
      books.map((book, index) =>
        enrichBookForHub(book, index, seoDescriptionsBySlug),
      ),
    [books, seoDescriptionsBySlug],
  );
  const subjectOptions = React.useMemo(
    () => subjectOptionsForBooks(hubBooks),
    [hubBooks],
  );

  const filteredBooks = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const candidates = hubBooks.filter((book) => {
      if (
        normalizedQuery &&
        !book.hubSearchText.includes(normalizedQuery)
      ) {
        return false;
      }
      if (
        subjectFilter !== "all" &&
        !book.hubSubjects.includes(subjectFilter)
      ) {
        return false;
      }
      if (lowerRiskOnly && !shouldShowInLowerRiskBookFilter(book.slug)) {
        return false;
      }
      return true;
    });
    return sortBooks(candidates, sortMode);
  }, [hubBooks, lowerRiskOnly, query, sortMode, subjectFilter]);

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
  const visibleStart = filteredBooks.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
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
    setLowerRiskOnly(false);
    setSortMode(DEFAULT_SORT_MODE);
    resetToFirstPageAndReturn();
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    resetToFirstPageAndReturn();
  }

  function handleSubjectChange(value: string) {
    setSubjectFilter(value);
    resetToFirstPageAndReturn();
  }

  function handleSortChange(value: SortMode) {
    setSortMode(value);
    resetToFirstPageAndReturn();
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    returnToCollectionTop({ focusHeading: true });
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
        description="Browse processed book pages, preview cleaned text and Morse, download MP3 audio, or open the live Morse player."
      >
        <ActionLinks
          links={[
            {
              href: ROUTES.bookTranslator,
              label: "Convert your own text",
              primary: true,
            },
            { href: ROUTES.morseAudiobooks, label: "Browse audiobooks" },
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
            ref={collectionHeadingRef}
            tabIndex={-1}
            className="mw-heading mt-3 text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl"
          >
            Browse the Morse book library
          </h2>
          <p className="mw-text-muted mt-3 max-w-[64ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            Search, filter, sort, and open processed text-first book pages from
            the collection. These are historical public-domain works, not a
            youth-safe list by default; use the lower-risk filter for classroom
            or younger-reader review.
          </p>
        </div>

        <div
          ref={collectionModuleRef}
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
            <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-[minmax(280px,1.25fr)_minmax(190px,0.78fr)_minmax(190px,0.72fr)] lg:items-end">
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Search
                <input
                  type="search"
                  value={query}
                  onChange={(event) => handleQueryChange(event.currentTarget.value)}
                  className="mw-input-text mw-input-placeholder min-h-10 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  placeholder="Title, author, description, or subject"
                  aria-label="Search title, author, description, or subject"
                />
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Subject / genre
                <select
                  value={subjectFilter}
                  onChange={(event) =>
                    handleSubjectChange(event.currentTarget.value)
                  }
                  className="mw-input-text min-h-10 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  disabled={subjectOptions.length === 0}
                  aria-label="Filter Morse books by subject"
                >
                  <option value="all">All subjects</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-600">
                Sort
                <select
                  value={sortMode}
                  onChange={(event) =>
                    handleSortChange(event.currentTarget.value as SortMode)
                  }
                  className="mw-input-text min-h-10 rounded-lg bg-white px-3 py-1.5 text-sm text-slate-950 outline-none disabled:cursor-not-allowed disabled:bg-white/55 disabled:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  aria-label="Sort Morse books"
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
                data-testid="morse-books-lower-risk-filter"
              />
              <span className="grid min-w-0 gap-1">
                <span className="text-sky-950">Show lower-risk books only</span>
                <span className="text-xs font-medium leading-relaxed text-slate-600">
                  Hides books the strict audit flagged for classroom or younger-reader review.
                </span>
              </span>
            </label>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p
              className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
              data-testid="morse-books-result-count"
              aria-live="polite"
            >
              {collectionResultText}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer text-sm font-semibold text-sky-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                data-testid="morse-books-reset-view"
              >
                Reset view
              </button>
            ) : null}
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
                  <MorseBookPagination
                    ariaLabel="Morse books pages"
                    currentPage={activePage}
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    testId="morse-books-pagination"
                  />
                ) : null}
              </>
            ) : (
              <EmptyCollectionShelf variant="filtered" />
            )}
          </div>
        </div>
      </section>

      {!includeTestFixture ? (
        <MorseBookLinkDirectory books={books} mode="book" />
      ) : null}

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
            Reset the view or try another title, author, description, or subject.
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
              Create Morse MP3 audio or live player sessions from your own text
              while the first book pages are added.
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
  book: HubBook;
  href: string;
}) {
  const description = book.hubDescription;
  const suitability = getMorseBookSuitability(book.slug);
  const metadata = [
    book.stats.sectionCount > 0
      ? `${formatNumber(book.stats.sectionCount)} sections`
      : "",
    `${formatNumber(book.stats.wordCount)} words`,
    displayBookProvider(book.source.provider),
  ].filter(Boolean);

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
        <p
          className="break-words font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500"
          data-testid="morse-book-card-subjects"
        >
          {book.hubSubjects.join(" / ")}
        </p>
        <p
          className="break-words text-xs font-semibold leading-relaxed text-slate-600"
          data-testid="morse-book-card-meta"
        >
          {metadata.join(" / ")}
        </p>
        <p
          className="break-words rounded-lg bg-[#fffaf2]/80 px-2 py-1.5 text-xs font-semibold leading-relaxed text-slate-700"
          data-testid="morse-book-card-content-suitability"
        >
          {morseBookSuitabilityLabel(suitability)}
        </p>
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
