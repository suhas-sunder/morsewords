import libraryManifestJson from "~/client/assets/books/generated/library-manifest.json";
import {
  safeReadStorage,
  safeRemoveStorage,
  safeWriteStorageResult,
} from "~/client/components/shared/settingsStorage";
import {
  BOOK_SECTION_CACHE_KEY_PREFIX,
  STORAGE_KEYS,
  STORAGE_LIMITS,
} from "~/client/components/shared/storageRegistry";

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
export const TEST_COLLECTION_BOOK_PREVIEW_VALUE = "test-collection";
export const TEST_PUBLISHED_BOOK_SLUG = "test-published-morse-book";

const libraryManifest = libraryManifestJson as MorseBookLibraryManifest;
const BOOK_SECTION_CACHE_TOTAL_MAX = 900_000;
const BOOK_SECTION_CACHE_ENTRY_MAX = 32;

const manifestLoaders = import.meta.glob<MorseBookManifest>(
  "../assets/books/generated/*/manifest.json",
  { import: "default" },
);

const publicSectionLoaders = import.meta.glob<MorseBookSectionJson>(
  "../assets/books/cloudflare-export/books/*/sections/*.json",
  { import: "default" },
);

const reviewSectionLoaders = import.meta.env.DEV
  ? import.meta.glob<MorseBookSectionJson>(
      "../assets/books/generated/*/sections/*.json",
      { import: "default" },
    )
  : {};

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
    estimatedTypingMinutes: 1,
    estimatedListeningMinutes: 1,
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
    estimatedTypingMinutes: 1,
    estimatedListeningMinutes: 1,
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
    estimatedTypingMinutes: 1,
    estimatedListeningMinutes: 1,
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
  contentVersion: "test-published-v1",
  contentHash:
    "test-published-morse-book-content-hash-development-fixture-v1",
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
    cleanedBookPath: "test-fixture-cleaned-book.json",
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
    estimatedTypingMinutes: section.estimatedTypingMinutes,
    estimatedListeningMinutes: section.estimatedListeningMinutes,
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
  contentVersion: testPublishedBookManifest.contentVersion,
  contentHash: testPublishedBookManifest.contentHash,
  language: testPublishedBookManifest.language,
  description: testPublishedBookManifest.description,
  subjects: testPublishedBookManifest.subjects,
  source: testPublishedBookManifest.source,
  cover: testPublishedBookManifest.cover,
  stats: testPublishedBookManifest.stats,
  defaults: testPublishedBookManifest.defaults,
  manifestPath: `${TEST_PUBLISHED_BOOK_SLUG}/manifest.json`,
} satisfies MorseBookLibrarySummary;

const testCollectionSubjects = [
  "Adventure practice",
  "Beginner listening",
  "Chapter drills",
  "Public-domain classics",
] as const;

const testCollectionAuthors = [
  "Ada Key",
  "Samuel Tone",
  "Clara Signal",
  "MorseWords QA",
] as const;

const testCollectionSummaries = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const subject = testCollectionSubjects[index % testCollectionSubjects.length];
  const author = testCollectionAuthors[index % testCollectionAuthors.length];
  const language = index % 7 === 0 ? "fr" : "en";
  const slug = `test-collection-morse-book-${number.toString().padStart(2, "0")}`;
  const wordCount = 8_000 + number * 425;
  const includedSectionCount = 4 + (index % 8);

  return {
    slug,
    title: `Test Collection Morse Book ${number.toString().padStart(2, "0")}`,
    author: [author],
    contentVersion: `test-collection-v1-${number}`,
    contentHash: `test-collection-morse-book-${number}-content-hash-development-fixture-v1`,
    language,
    description:
      "Development-only collection fixture for testing Morse book browsing controls.",
    subjects: [subject, "Morse audiobook fixture"],
    source: {
      ...testPublishedBookSummary.source,
      rightsReportPath: `${slug}/rights_report.json`,
      processedBookPath: `${slug}/processed_book.json`,
      rightsNotes:
        "Development-only fixture. It is not included in generated production manifests, navigation, or sitemaps.",
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for Test Collection Morse Book ${number.toString().padStart(2, "0")}`,
    },
    stats: {
      originalCharacterCount: wordCount * 6,
      cleanedCharacterCount: wordCount * 6,
      wordCount,
      sectionCount: includedSectionCount + 1,
      includedSectionCount,
    },
    defaults: testPublishedBookSummary.defaults,
    manifestPath: `${slug}/manifest.json`,
  } satisfies MorseBookLibrarySummary;
});

function canUseTestPublishedBookFixture() {
  return import.meta.env.DEV;
}

function getTestPublishedBookSection(sectionId: string) {
  return (
    testPublishedBookSections.find((section) => section.sectionId === sectionId) ??
    null
  );
}

type BookSectionCacheIndexEntry = {
  key: string;
  slug: string;
  contentVersion: string;
  sectionId: string;
  bytes: number;
  rank: number;
};

type BookSectionCacheIndex = {
  schemaVersion: 1;
  nextRank: number;
  entries: BookSectionCacheIndexEntry[];
};

function emptyBookSectionCacheIndex(): BookSectionCacheIndex {
  return { schemaVersion: 1, nextRank: 1, entries: [] };
}

function parseBookSectionCacheIndex(): BookSectionCacheIndex {
  const raw = safeReadStorage(STORAGE_KEYS.bookSectionCacheIndex);
  if (!raw) return emptyBookSectionCacheIndex();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray((parsed as BookSectionCacheIndex).entries)
    ) {
      return emptyBookSectionCacheIndex();
    }
    const candidate = parsed as BookSectionCacheIndex;
    return {
      schemaVersion: 1,
      nextRank:
        typeof candidate.nextRank === "number" && Number.isFinite(candidate.nextRank)
          ? Math.max(1, Math.floor(candidate.nextRank))
          : 1,
      entries: candidate.entries.filter(
        (entry) =>
          entry &&
          typeof entry.key === "string" &&
          typeof entry.slug === "string" &&
          typeof entry.contentVersion === "string" &&
          typeof entry.sectionId === "string" &&
          typeof entry.bytes === "number" &&
          typeof entry.rank === "number",
      ),
    };
  } catch {
    return emptyBookSectionCacheIndex();
  }
}

function writeBookSectionCacheIndex(index: BookSectionCacheIndex) {
  safeWriteStorageResult(STORAGE_KEYS.bookSectionCacheIndex, JSON.stringify(index));
}

function bookSectionCacheKey(book: MorseBookManifest, sectionId: string) {
  return `${BOOK_SECTION_CACHE_KEY_PREFIX}${book.slug}:${book.contentVersion}:${sectionId}`;
}

function isCacheableBookSection(book: MorseBookManifest, sectionId: string) {
  return (
    isMorseBookPublishReady(book) &&
    typeof book.contentVersion === "string" &&
    book.contentVersion.trim() !== "" &&
    book.sections.some((section) => section.id === sectionId)
  );
}

function readCachedBookSection(
  book: MorseBookManifest,
  sectionId: string,
): MorseBookSectionJson | null {
  if (!isCacheableBookSection(book, sectionId)) return null;
  const key = bookSectionCacheKey(book, sectionId);
  const raw = safeReadStorage(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as MorseBookSectionJson;
    if (parsed.bookSlug !== book.slug || parsed.sectionId !== sectionId) {
      safeRemoveStorage(key);
      return null;
    }
    const index = parseBookSectionCacheIndex();
    const nextRank = index.nextRank + 1;
    writeBookSectionCacheIndex({
      schemaVersion: 1,
      nextRank,
      entries: index.entries.map((entry) =>
        entry.key === key ? { ...entry, rank: index.nextRank } : entry,
      ),
    });
    return parsed;
  } catch {
    safeRemoveStorage(key);
    return null;
  }
}

function writeCachedBookSection(
  book: MorseBookManifest,
  section: MorseBookSectionJson,
) {
  if (!isCacheableBookSection(book, section.sectionId)) return;
  const key = bookSectionCacheKey(book, section.sectionId);
  const value = JSON.stringify(section);
  if (value.length > STORAGE_LIMITS.bookSectionCacheItemMaxLength) return;
  const writeResult = safeWriteStorageResult(key, value);
  if (!writeResult.ok) return;

  const current = parseBookSectionCacheIndex();
  const nextRank = current.nextRank + 1;
  const entries = [
    ...current.entries.filter(
      (entry) =>
        entry.key !== key &&
        entry.key.startsWith(BOOK_SECTION_CACHE_KEY_PREFIX),
    ),
    {
      key,
      slug: book.slug,
      contentVersion: book.contentVersion,
      sectionId: section.sectionId,
      bytes: value.length,
      rank: current.nextRank,
    },
  ].sort((a, b) => b.rank - a.rank);

  let keptBytes = 0;
  const kept: BookSectionCacheIndexEntry[] = [];
  for (const entry of entries) {
    if (
      kept.length >= BOOK_SECTION_CACHE_ENTRY_MAX ||
      keptBytes + entry.bytes > BOOK_SECTION_CACHE_TOTAL_MAX
    ) {
      safeRemoveStorage(entry.key);
      continue;
    }
    keptBytes += entry.bytes;
    kept.push(entry);
  }

  writeBookSectionCacheIndex({
    schemaVersion: 1,
    nextRank,
    entries: kept.sort((a, b) => a.key.localeCompare(b.key)),
  });
}

export function morseBookPath(slug: string) {
  return `${MORSE_BOOKS_BASE_PATH}/${slug}`;
}

export function isMorseBookPublishReady(
  book: Pick<MorseBookLibrarySummary, "source"> | MorseBookManifest,
) {
  const approvedBySource =
    book.source.approvalSource === "file-evidence" ||
    (book.source.approvalSource === "owner-reviewed" &&
      book.source.rightsReviewed === true) ||
    (book.source.approvalSource === undefined &&
      book.source.rightsReviewed === true);
  return (
    approvedBySource &&
    book.source.publishReady === true &&
    book.source.rightsStatus === "approved" &&
    book.source.processingAllowed === true
  );
}

export function getGeneratedMorseBookSummaries() {
  return [...libraryManifest.books].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPublishedMorseBookSummaries(
  options: {
    includeTestFixture?: boolean;
    includeTestCollectionFixture?: boolean;
  } = {},
) {
  const books = getGeneratedMorseBookSummaries().filter(isMorseBookPublishReady);
  if (options.includeTestFixture && canUseTestPublishedBookFixture()) {
    books.push(testPublishedBookSummary);
  }
  if (options.includeTestCollectionFixture && canUseTestPublishedBookFixture()) {
    books.push(...testCollectionSummaries);
  }
  return books.sort((a, b) => a.title.localeCompare(b.title));
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
  const cached = readCachedBookSection(book, sectionId);
  if (cached) return cached;

  const reviewLoaderKey = `../assets/books/generated/${book.slug}/${summary.sectionJsonPath}`;
  const publicLoaderKey = `../assets/books/cloudflare-export/books/${book.slug}/${summary.sectionJsonPath}`;
  const loadSection = isMorseBookPublishReady(book)
    ? (publicSectionLoaders[publicLoaderKey] ?? reviewSectionLoaders[reviewLoaderKey])
    : reviewSectionLoaders[reviewLoaderKey];
  if (!loadSection) return null;

  const section = await loadSection();
  if (section.bookSlug !== book.slug || section.sectionId !== sectionId) return null;
  writeCachedBookSection(book, section);
  return section;
}

export function getMorseBookDataLoaderStats() {
  return {
    summaryCount: libraryManifest.books.length,
    manifestLoaderCount: Object.keys(manifestLoaders).length,
    publicSectionLoaderCount: Object.keys(publicSectionLoaders).length,
    reviewSectionLoaderCount: Object.keys(reviewSectionLoaders).length,
  };
}
