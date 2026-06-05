import libraryManifestJson from "~/client/assets/books/generated/library-manifest.json";

import type {
  MorseBookLibraryManifest,
  MorseBookLibrarySummary,
  MorseBookManifest,
  MorseBookSectionJson,
  MorseBookSectionSummary,
} from "./morseBookTypes";

export const MORSE_BOOKS_BASE_PATH = "/morse-code-books";
export const UNPUBLISHED_BOOK_PREVIEW_PARAM = "preview";
export const UNPUBLISHED_BOOK_PREVIEW_VALUE = "unpublished";

const libraryManifest = libraryManifestJson as MorseBookLibraryManifest;

const manifestLoaders = import.meta.glob<MorseBookManifest>(
  "../assets/books/generated/*/manifest.json",
  { import: "default" },
);

const sectionLoaders = import.meta.glob<MorseBookSectionJson>(
  "../assets/books/generated/*/sections/*.json",
  { import: "default" },
);

export function morseBookPath(slug: string) {
  return `${MORSE_BOOKS_BASE_PATH}/${slug}`;
}

export function isMorseBookPublishReady(
  book: Pick<MorseBookLibrarySummary, "source"> | MorseBookManifest,
) {
  return book.source.rightsReviewed === true && book.source.publishReady === true;
}

export function getGeneratedMorseBookSummaries() {
  return [...libraryManifest.books].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPublishedMorseBookSummaries() {
  return getGeneratedMorseBookSummaries().filter(isMorseBookPublishReady);
}

export function getMorseBookSummary(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
) {
  const summary = libraryManifest.books.find((book) => book.slug === slug) ?? null;
  if (!summary) return null;
  if (!options.includeUnpublished && !isMorseBookPublishReady(summary)) {
    return null;
  }
  return summary;
}

export async function getMorseBookManifest(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
) {
  const summary = getMorseBookSummary(slug, { includeUnpublished: true });
  if (!summary) return null;
  if (!options.includeUnpublished && !isMorseBookPublishReady(summary)) {
    return null;
  }

  const loaderKey = `../assets/books/generated/${summary.manifestPath}`;
  const loadManifest = manifestLoaders[loaderKey];
  if (!loadManifest) return null;

  const manifest = await loadManifest();
  if (manifest.slug !== slug) return null;
  if (!options.includeUnpublished && !isMorseBookPublishReady(manifest)) {
    return null;
  }

  return manifest;
}

export function getDefaultMorseBookSectionId(book: MorseBookManifest) {
  return (
    book.sections.find((section) => section.includeByDefault)?.id ??
    book.sections[0]?.id ??
    null
  );
}

export function getMorseBookSectionSummary(
  book: MorseBookManifest,
  sectionId: string,
): MorseBookSectionSummary | null {
  return book.sections.find((section) => section.id === sectionId) ?? null;
}

export async function getMorseBookSection(
  book: MorseBookManifest,
  sectionId: string,
) {
  const summary = getMorseBookSectionSummary(book, sectionId);
  if (!summary) return null;

  const loaderKey = `../assets/books/generated/${book.slug}/${summary.sectionJsonPath}`;
  const loadSection = sectionLoaders[loaderKey];
  if (!loadSection) return null;

  const section = await loadSection();
  if (section.bookSlug !== book.slug || section.sectionId !== sectionId) return null;
  return section;
}

export function getMorseBookDataLoaderStats() {
  return {
    summaryCount: libraryManifest.books.length,
    manifestLoaderCount: Object.keys(manifestLoaders).length,
    sectionLoaderCount: Object.keys(sectionLoaders).length,
  };
}
