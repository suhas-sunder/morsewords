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

const guideItems = [
  {
    title: "Reviewed book pages",
    text: "The collection lists books only after source and rights checks are complete. Raw text files and unpublished pilot artifacts do not appear here.",
  },
  {
    title: "Book pages, not uploads",
    text: "A book page starts from generated, cleaned sections with chapter navigation. The general book translator remains the tool for your own pasted text, TXT, EPUB, MD, or text-native PDF files.",
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
    title: "Source metadata",
    text: "Generated book data keeps provider, Gutenberg ID when available, source link, release details, and rights status separate from the Morse source text.",
  },
  {
    title: "Boilerplate excluded",
    text: "Project Gutenberg headers, license text, production credits, and transcriber material are kept out of the translated Morse source unless a future book explicitly approves a section.",
  },
  {
    title: "No unreviewed books",
    text: "A generated artifact can exist for local testing while still being blocked from public listing, book pages, sitemaps, and download workflows.",
  },
  {
    title: "Placeholders first",
    text: "Cover thumbnails may start as accessible MorseWords placeholders. Future metadata can add real covers without changing the hub layout.",
  },
];

type SortMode = "title" | "author";

function isTestPublishedPreviewRequest(request: Request) {
  const url = new URL(request.url);
  return (
    import.meta.env.DEV &&
    url.searchParams.get(UNPUBLISHED_BOOK_PREVIEW_PARAM) ===
      TEST_PUBLISHED_BOOK_PREVIEW_VALUE
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
    return a.title.localeCompare(b.title);
  });
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
  return {
    books: getPublishedMorseBookSummaries({ includeTestFixture }),
    includeTestFixture,
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
  const [sortMode, setSortMode] = React.useState<SortMode>("title");

  const filteredBooks = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const candidates = normalizedQuery
      ? books.filter((book) => searchableBookText(book).includes(normalizedQuery))
      : books;
    return sortBooks(candidates, sortMode);
  }, [books, query, sortMode]);

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
    ...(books.length > 0
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(260px,0.3fr)] lg:items-end">
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
              Only publish-ready books are listed here. The current generated
              library can contain unpublished pilot data, but those books stay
              out of public cards, navigation, and sitemaps until review is
              complete.
            </p>
          </div>
          {books.length > 0 ? (
            <form
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-1"
              role="search"
              aria-label="Search reviewed Morse books"
            >
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Search title or author
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  className="min-h-11 rounded-xl bg-white/88 px-4 py-2 text-slate-950 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  placeholder="Search reviewed books"
                />
              </label>
              <label className="grid gap-1 text-sm font-semibold text-slate-700">
                Sort
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.currentTarget.value as SortMode)}
                  className="min-h-11 rounded-xl bg-white/88 px-4 py-2 text-slate-950 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                >
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                </select>
              </label>
            </form>
          ) : null}
        </div>

        {books.length === 0 ? (
          <StaticPanel
            as="section"
            className="mt-6"
            data-testid="morse-books-empty-state"
            aria-label="Morse books review status"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Review queue
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
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.slug}
                book={book}
                href={publicBookHref(book, includeTestFixture)}
              />
            ))}
          </div>
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
        description="The collection is for reviewed, structured books. Personal text, drafts, uploads, and unreviewed raw files belong in the general book translator instead."
        layout="stacked"
      >
        <SimpleGrid items={guideItems} variant="plain" linkedItemStyle="inline" />
      </SectionCard>

      <SectionCard
        eyebrow="Source checks"
        title="Why reviewed books are listed slowly"
        description="MorseWords separates raw text inventory from public book pages so future public-domain Morse audiobook workflows have a clear review trail."
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
  const outputText = "Morse audio/video";
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
        className="aspect-[3/4] w-full rounded-xl object-cover"
      />
    );
  }

  return (
    <div
      aria-label={book.cover.alt}
      data-mw-morse-books-cover-placeholder="true"
      className="mw-static-tile flex aspect-[3/4] w-full flex-col justify-between rounded-xl p-4"
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
