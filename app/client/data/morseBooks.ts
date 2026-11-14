import libraryManifestJson from "~/client/assets/books/generated/library-manifest.json";

import type {
  MorseBookLibraryManifest,
  MorseBookLibrarySummary,
  MorseBookManifest,
  MorseBookPublicContentJson,
  MorseBookPublicManifest,
  MorseBookPublicSummary,
  MorseBookSectionJson,
  MorseBookSectionSummary,
} from "./morseBookTypes";

import { getMorseBookSuitability } from "./morseBookSuitability";

import { isMorseBookPublishReady } from "./morseBookEligibility";

const libraryManifest = libraryManifestJson as MorseBookLibraryManifest;

const discoverableMorseBooks = libraryManifest.books
  .filter((book) => isMorseBookPublishReady(book))
  .sort((left, right) => {
    const titleResult = left.title.localeCompare(right.title);
    return titleResult !== 0 ? titleResult : left.slug.localeCompare(right.slug);
  });

const discoverableMorseBooksBySlug = new Map(
  discoverableMorseBooks.map((book) => [book.slug, book]),
);

function normalizedAuthorKey(author: string) {
  return author.trim().replace(/\s+/g, " ").toLowerCase();
}

const discoverableMorseBooksByAuthor = new Map<
  string,
  MorseBookLibrarySummary[]
>();

for (const book of discoverableMorseBooks) {
  for (const author of book.author) {
    const key = normalizedAuthorKey(author);
    if (!key) continue;
    const books = discoverableMorseBooksByAuthor.get(key) ?? [];
    books.push(book);
    discoverableMorseBooksByAuthor.set(key, books);
  }
}

export function getDiscoverableMorseBookSummaries() {
  return [...discoverableMorseBooks];
}

export function getDiscoverableMorseBookSummary(slug: string) {
  return discoverableMorseBooksBySlug.get(slug) ?? null;
}

export function getRelatedMorseBooksByAuthor(
  currentSlug: string,
  authors: readonly string[],
  limit = 4,
) {
  if (limit <= 0) return [];

  const relatedBySlug = new Map<string, MorseBookLibrarySummary>();
  for (const author of authors) {
    const key = normalizedAuthorKey(author);
    if (!key) continue;
    for (const book of discoverableMorseBooksByAuthor.get(key) ?? []) {
      if (book.slug !== currentSlug) relatedBySlug.set(book.slug, book);
    }
  }

  return [...relatedBySlug.values()]
    .sort((left, right) => {
      const titleResult = left.title.localeCompare(right.title);
      return titleResult !== 0 ? titleResult : left.slug.localeCompare(right.slug);
    })
    .slice(0, limit);
}

function publicSummaryToLibrarySummary(
  book: MorseBookPublicSummary,
): MorseBookLibrarySummary {
  const canonicalSummary = discoverableMorseBooksBySlug.get(book.slug);
  const displayTitle = canonicalSummary?.title ?? book.title;
  const suitability = getMorseBookSuitability(book.slug);
  return {
    slug: book.slug,
    title: displayTitle,
    author: book.author,
    contentVersion: book.contentVersion,
    contentHash: book.contentHash,
    language: book.language,
    description: book.description,
    subjects: book.subjects,
    source: {
      provider: book.source.provider,
      gutenbergId: book.source.gutenbergId,
      releaseDate: null,
      sourceUrl: book.source.sourceUrl,
      rawTextUrl: null,
      rightsBasis: book.source.rightsBasis,
      rightsReviewed: true,
      publishReady: book.source.publishReady,
      rightsStatus: book.source.rightsStatus,
      processingAllowed: book.source.processingAllowed,
      approvalSource: book.source.approvalSource,
      duplicateResolutionSource: book.source.duplicateResolutionSource,
      rightsReportPath: "",
      rightsNotes: "",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: canonicalSummary?.cover.alt ?? `Placeholder cover for ${displayTitle}`,
    },
    stats: book.stats,
    defaults: {
      includeKinds: ["chapter"],
      preferredPreset: "main-narrative",
    },
    manifestPath: book.bookPath,
    contentSuitability: book.contentSuitability ?? suitability.contentSuitability,
    strictReviewCandidate:
      book.strictReviewCandidate ?? suitability.strictReviewCandidate,
    contentNote: book.contentNote ?? suitability.contentNote,
  };
}

function createLocalPublicManifest(
  manifest: MorseBookLibraryManifest,
): MorseBookPublicManifest {
  return {
    schemaVersion: 1,
    contentVersion: `generated-library-${manifest.books.length}`,
    contentHash: "derived-from-generated-library-manifest",
    books: manifest.books.map(book => librarySummaryToPublicSummary({ ...getMorseBookSuitability(book.slug), ...book })),
  };
}

const publicManifest = createLocalPublicManifest(libraryManifest);

function getLocalPublicSummaries() {
  return publicManifest.books
    .filter((book) => isMorseBookPublishReady(publicSummaryToLibrarySummary(book)))
    .map(publicSummaryToLibrarySummary)
    .sort((a, b) => a.title.localeCompare(b.title));
}

async function getRuntimePublicManifest() {
  const manifestUrl = cloudflareContentUrl("public-manifest.json");
  if (!manifestUrl) return publicManifest;
  return fetchJson(manifestUrl, isPublicManifest);
}

export function getGeneratedMorseBookSummaries() {
  return [...libraryManifest.books].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPublishedMorseBookSummaries(
  options: {
    includeTestFixture?: boolean;
    includeTestCollectionFixture?: boolean;
  } = {},
): MorseBookLibrarySummary[] {
  if (options.includeTestCollectionFixture && canUseTestPublishedBookFixture()) {
    return [...testCollectionSummaries].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (options.includeTestFixture && canUseTestPublishedBookFixture()) {
    return [testPublishedBookSummary];
  }
  return getLocalPublicSummaries();
}

export async function getPublishedMorseBookSummariesRuntime(
  options: {
    includeTestFixture?: boolean;
    includeTestCollectionFixture?: boolean;
  } = {},
): Promise<MorseBookLibrarySummary[]> {
  if (options.includeTestCollectionFixture && canUseTestPublishedBookFixture()) {
    return [...testCollectionSummaries].sort((a, b) => a.title.localeCompare(b.title));
  }
  if (options.includeTestFixture && canUseTestPublishedBookFixture()) {
    return [testPublishedBookSummary];
  }
  const manifest = await getRuntimePublicManifest();
  return manifest.books
    .filter((book) => isMorseBookPublishReady(publicSummaryToLibrarySummary(book)))
    .map(publicSummaryToLibrarySummary)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getMorseBookSummary(
  slug: string,
  options: { includeUnpublished?: boolean; includeTestFixture?: boolean } = {},
) {
  if (
    options.includeTestFixture &&
    canUseTestPublishedBookFixture() &&
    slug === TEST_PUBLISHED_BOOK_SLUG
  ) {
    return testPublishedBookSummary;
  }

  const summary =
    (options.includeUnpublished
      ? libraryManifest.books.find((book) => book.slug === slug)
      : getLocalPublicSummaries().find((book) => book.slug === slug)) ?? null;
  if (!summary) return null;
  if (!options.includeUnpublished && !isMorseBookPublishReady(summary)) {
    return null;
  }
  return summary;
}

export async function getMorseBookManifest(
  slug: string,
  options: { includeUnpublished?: boolean; includeTestFixture?: boolean } = {},
) {
  if (
    options.includeTestFixture &&
    canUseTestPublishedBookFixture() &&
    slug === TEST_PUBLISHED_BOOK_SLUG
  ) {
    return testPublishedBookManifest;
  }

  if (!options.includeUnpublished) {
    const content = await getMorseBookPublicContent(slug);
    return content?.manifest ?? null;
  }

  const summary = getMorseBookSummary(slug, { includeUnpublished: true });
  if (!summary) return null;

  const reviewContent = await loadGeneratedReviewContent();
  const manifest = await reviewContent?.loadGeneratedMorseBookManifest(
    summary.manifestPath,
  );
  if (!manifest) return null;
  if (manifest.slug !== slug) return null;
  if (!options.includeUnpublished && !isMorseBookPublishReady(manifest)) {
    return null;
  }

  return manifest;
}

export function getMorseBookDataLoaderStats() {
  return {
    summaryCount: libraryManifest.books.length,
    manifestLoaderCount: import.meta.env.DEV ? "dev-only" : 0,
    publicBookLoaderCount: publicManifest.books.length,
    reviewSectionLoaderCount: import.meta.env.DEV ? "dev-only" : 0,
  };
}

export * from "./morseBookRuntime";
import { testPublishedBookManifest, testPublishedBookSummary, testCollectionSummaries, canUseTestPublishedBookFixture, loadGeneratedReviewContent, cloudflareContentUrl, librarySummaryToPublicSummary, fetchJson, isPublicManifest, TEST_PUBLISHED_BOOK_SLUG, getMorseBookPublicContent as loadPublicContent } from "./morseBookRuntime";

export async function getMorseBookPublicContent(slug: string) {
  const summary = getDiscoverableMorseBookSummary(slug);
  return summary ? loadPublicContent(summary, getMorseBookSuitability(summary.slug)) : null;
}
