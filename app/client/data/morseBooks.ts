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
export const TEST_PUBLISHED_BOOK_PREVIEW_VALUE = "test-published";
export const TEST_PUBLISHED_BOOK_SLUG = "test-published-morse-book";

const libraryManifest = libraryManifestJson as MorseBookLibraryManifest;

const manifestLoaders = import.meta.glob<MorseBookManifest>(
  "../assets/books/generated/*/manifest.json",
  { import: "default" },
);

const sectionLoaders = import.meta.glob<MorseBookSectionJson>(
  "../assets/books/generated/*/sections/*.json",
  { import: "default" },
);

const testPublishedBookSections = [
  {
    schemaVersion: 1,
    bookSlug: TEST_PUBLISHED_BOOK_SLUG,
    sectionId: "chapter-001",
    kind: "chapter",
    label: "Chapter 1",
    title: "Signals at Dawn",
    order: 1,
    includeByDefault: true,
    displayText:
      "CHAPTER I. Signals at Dawn\n\nSOS HELP carried across the practice room. The learner copied each signal, checked the spacing, and tried again with a steadier hand.",
    morseSourceText:
      "CHAPTER I. Signals at Dawn\n\nSOS HELP carried across the practice room. The learner copied each signal, checked the spacing, and tried again with a steadier hand.",
    paragraphs: [
      "CHAPTER I. Signals at Dawn",
      "SOS HELP carried across the practice room. The learner copied each signal, checked the spacing, and tried again with a steadier hand.",
    ],
    wordCount: 25,
    characterCount: 151,
    morseCharacterEstimate: 620,
    unsupportedCharacterSummary: {},
    textPreview:
      "CHAPTER I. Signals at Dawn SOS HELP carried across the practice room...",
    sourceOffsets: { start: 0, end: 151 },
  },
  {
    schemaVersion: 1,
    bookSlug: TEST_PUBLISHED_BOOK_SLUG,
    sectionId: "chapter-002",
    kind: "chapter",
    label: "Chapter 2",
    title: "Evening Copy",
    order: 2,
    includeByDefault: true,
    displayText:
      "CHAPTER II. Evening Copy\n\nMorse practice was shorter tonight. The words came slowly, then clearly, as the tone settled into a calm rhythm.",
    morseSourceText:
      "CHAPTER II. Evening Copy\n\nMorse practice was shorter tonight. The words came slowly, then clearly, as the tone settled into a calm rhythm.",
    paragraphs: [
      "CHAPTER II. Evening Copy",
      "Morse practice was shorter tonight. The words came slowly, then clearly, as the tone settled into a calm rhythm.",
    ],
    wordCount: 22,
    characterCount: 135,
    morseCharacterEstimate: 570,
    unsupportedCharacterSummary: {},
    textPreview:
      "CHAPTER II. Evening Copy Morse practice was shorter tonight...",
    sourceOffsets: { start: 151, end: 286 },
  },
  {
    schemaVersion: 1,
    bookSlug: TEST_PUBLISHED_BOOK_SLUG,
    sectionId: "source-license-001",
    kind: "source-license",
    label: "Source note",
    title: null,
    order: 3,
    includeByDefault: false,
    displayText:
      "Source note for a development-only fixture. This section is intentionally excluded from default Morse output.",
    morseSourceText:
      "Source note for a development-only fixture. This section is intentionally excluded from default Morse output.",
    paragraphs: [
      "Source note for a development-only fixture. This section is intentionally excluded from default Morse output.",
    ],
    wordCount: 14,
    characterCount: 101,
    morseCharacterEstimate: 430,
    unsupportedCharacterSummary: {},
    textPreview: "Source note for a development-only fixture...",
    sourceOffsets: { start: 286, end: 387 },
  },
] as const satisfies MorseBookSectionJson[];

const testPublishedBookManifest = {
  schemaVersion: 1,
  slug: TEST_PUBLISHED_BOOK_SLUG,
  title: "Test Published Morse Book",
  author: ["MorseWords QA"],
  language: "en",
  description:
    "Development-only publish-ready fixture for exercising Morse book page previews and downloads.",
  subjects: ["Morse code practice"],
  source: {
    provider: "MorseWords test fixture",
    gutenbergId: null,
    releaseDate: null,
    sourceUrl: null,
    rawTextUrl: null,
    rightsBasis: "permission-granted",
    rightsReviewed: true,
    publishReady: true,
    rightsStatus: "approved",
    processingAllowed: true,
    rightsReportPath: "test-fixture-rights-report.json",
    processedBookPath: "test-fixture-processed-book.json",
    rightsNotes:
      "Development-only fixture. It is not included in generated production manifests, navigation, or sitemaps.",
  },
  cover: {
    src: null,
    placeholder: true,
    alt: "Placeholder cover for Test Published Morse Book",
  },
  stats: {
    originalCharacterCount: 387,
    cleanedCharacterCount: 387,
    wordCount: 61,
    sectionCount: 3,
    includedSectionCount: 2,
  },
  defaults: {
    includeKinds: ["chapter"],
    preferredPreset: "main-narrative",
  },
  sections: testPublishedBookSections.map((section) => ({
    id: section.sectionId,
    kind: section.kind,
    label: section.label,
    title: section.title,
    order: section.order,
    includeByDefault: section.includeByDefault,
    sectionJsonPath: `sections/${section.sectionId}.json`,
    characterCount: section.characterCount,
    wordCount: section.wordCount,
    morseCharacterEstimate: section.morseCharacterEstimate,
    textPreview: section.textPreview,
  })),
  cleaning: {
    originalCharacterCount: 387,
    cleanedCharacterCount: 387,
    headerStripped: false,
    footerStripped: false,
    confidence: "high",
    warnings: [],
  },
  warnings: [],
} as const satisfies MorseBookManifest;

const testPublishedBookSummary = {
  slug: testPublishedBookManifest.slug,
  title: testPublishedBookManifest.title,
  author: testPublishedBookManifest.author,
  language: testPublishedBookManifest.language,
  description: testPublishedBookManifest.description,
  subjects: testPublishedBookManifest.subjects,
  source: testPublishedBookManifest.source,
  cover: testPublishedBookManifest.cover,
  stats: testPublishedBookManifest.stats,
  defaults: testPublishedBookManifest.defaults,
  manifestPath: `${TEST_PUBLISHED_BOOK_SLUG}/manifest.json`,
} satisfies MorseBookLibrarySummary;

function canUseTestPublishedBookFixture() {
  return import.meta.env.DEV;
}

function getTestPublishedBookSection(sectionId: string) {
  return (
    testPublishedBookSections.find((section) => section.sectionId === sectionId) ??
    null
  );
}

export function morseBookPath(slug: string) {
  return `${MORSE_BOOKS_BASE_PATH}/${slug}`;
}

export function isMorseBookPublishReady(
  book: Pick<MorseBookLibrarySummary, "source"> | MorseBookManifest,
) {
  return (
    book.source.rightsReviewed === true &&
    book.source.publishReady === true &&
    book.source.rightsStatus === "approved" &&
    book.source.processingAllowed === true
  );
}

export function getGeneratedMorseBookSummaries() {
  return [...libraryManifest.books].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPublishedMorseBookSummaries() {
  return getGeneratedMorseBookSummaries().filter(isMorseBookPublishReady);
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

  const summary = libraryManifest.books.find((book) => book.slug === slug) ?? null;
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
  if (
    canUseTestPublishedBookFixture() &&
    book.slug === TEST_PUBLISHED_BOOK_SLUG
  ) {
    return getTestPublishedBookSection(sectionId);
  }

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
