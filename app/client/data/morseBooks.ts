import libraryManifestJson from "~/client/assets/books/generated/library-manifest.json";
import publicManifestJson from "~/client/assets/books/cloudflare-export/public-manifest.json";
import {
  safeReadStorage,
  safeRemoveStorage,
  safeWriteStorageResult,
} from "~/client/components/shared/settingsStorage";
import {
  BOOK_CACHE_KEY_PREFIX,
  BOOK_SECTION_CACHE_KEY_PREFIX,
  STORAGE_KEYS,
  STORAGE_LIMITS,
} from "~/client/components/shared/storageRegistry";

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
import { getDefaultMorseBookLiveSectionId } from "./morseBookSectionDefaults";
import {
  getMorseBookPublicContentUrls as getConfiguredMorseBookPublicContentUrls,
  normalizeMorseBookContentBaseUrl,
} from "./morseBookContentConfig";

export const MORSE_BOOKS_BASE_PATH = "/morse-code-books";
export const MORSE_AUDIOBOOKS_BASE_PATH = "/morse-code-audiobooks";
export const UNPUBLISHED_BOOK_PREVIEW_PARAM = "preview";
export const UNPUBLISHED_BOOK_PREVIEW_VALUE = "unpublished";
export const TEST_PUBLISHED_BOOK_PREVIEW_VALUE = "test-published";
export const TEST_COLLECTION_BOOK_PREVIEW_VALUE = "test-collection";
export const TEST_PUBLISHED_BOOK_SLUG = "test-published-morse-book";

const libraryManifest = libraryManifestJson as MorseBookLibraryManifest;
const publicManifest = publicManifestJson as unknown as MorseBookPublicManifest;
const BOOK_CACHE_TOTAL_MAX = 4_800_000;
const BOOK_CACHE_ENTRY_MAX = 3;

const publicBookContentCache = new Map<string, MorseBookPublicContentJson>();

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

type GeneratedReviewContentModule = typeof import("./morseBookReviewContent");

async function loadGeneratedReviewContent(): Promise<GeneratedReviewContentModule | null> {
  if (!import.meta.env.DEV) return null;
  const modulePath = new URL(
    `./morseBookReviewContent${".ts"}`,
    import.meta.url,
  ).href;
  return import(/* @vite-ignore */ modulePath) as Promise<GeneratedReviewContentModule>;
}

type BookCacheIndexEntry = {
  key: string;
  slug: string;
  contentVersion: string;
  contentHash: string;
  bytes: number;
  rank: number;
};

type BookCacheIndex = {
  schemaVersion: 1;
  nextRank: number;
  entries: BookCacheIndexEntry[];
};

function emptyBookCacheIndex(): BookCacheIndex {
  return { schemaVersion: 1, nextRank: 1, entries: [] };
}

function parseBookCacheIndex(): BookCacheIndex {
  const raw = safeReadStorage(STORAGE_KEYS.bookCacheIndex);
  if (!raw) return emptyBookCacheIndex();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray((parsed as BookCacheIndex).entries)
    ) {
      return emptyBookCacheIndex();
    }
    const candidate = parsed as BookCacheIndex;
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
          typeof entry.contentHash === "string" &&
          typeof entry.bytes === "number" &&
          typeof entry.rank === "number",
      ),
    };
  } catch {
    return emptyBookCacheIndex();
  }
}

function writeBookCacheIndex(index: BookCacheIndex) {
  safeWriteStorageResult(STORAGE_KEYS.bookCacheIndex, JSON.stringify(index));
}

function bookCacheKey(summary: Pick<MorseBookPublicSummary, "slug" | "contentVersion" | "contentHash">) {
  return `${BOOK_CACHE_KEY_PREFIX}${summary.slug}:${summary.contentVersion}:${summary.contentHash}`;
}

function isCacheablePublicBook(content: MorseBookPublicContentJson) {
  return (
    isMorseBookPublishReady(content.manifest) &&
    content.slug === content.manifest.slug &&
    typeof content.contentVersion === "string" &&
    content.contentVersion.trim() !== "" &&
    typeof content.contentHash === "string" &&
    content.contentHash.trim() !== "" &&
    content.sections.length > 0
  );
}

function readCachedPublicBook(
  summary: Pick<MorseBookPublicSummary, "slug" | "contentVersion" | "contentHash">,
): MorseBookPublicContentJson | null {
  const key = bookCacheKey(summary);
  const raw = safeReadStorage(key);
  if (!raw) return null;
  try {
    const parsed = normalizePublicBookContent(
      JSON.parse(raw) as MorseBookPublicContentJson,
    );
    if (
      parsed.slug !== summary.slug ||
      parsed.contentVersion !== summary.contentVersion ||
      parsed.contentHash !== summary.contentHash ||
      !isCacheablePublicBook(parsed)
    ) {
      safeRemoveStorage(key);
      return null;
    }
    const index = parseBookCacheIndex();
    const nextRank = index.nextRank + 1;
    writeBookCacheIndex({
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

function writeCachedPublicBook(content: MorseBookPublicContentJson) {
  if (!isCacheablePublicBook(content)) return;
  const key = bookCacheKey(content);
  const value = JSON.stringify(content);
  if (value.length > STORAGE_LIMITS.bookCacheItemMaxLength) return;
  const writeResult = safeWriteStorageResult(key, value);
  if (!writeResult.ok) return;

  const current = parseBookCacheIndex();
  const nextRank = current.nextRank + 1;
  const entries = [
    ...current.entries.filter(
      (entry) =>
        entry.key !== key &&
        entry.key.startsWith(BOOK_CACHE_KEY_PREFIX),
    ),
    {
      key,
      slug: content.slug,
      contentVersion: content.contentVersion,
      contentHash: content.contentHash,
      bytes: value.length,
      rank: current.nextRank,
    },
  ].sort((a, b) => b.rank - a.rank);

  let keptBytes = 0;
  const kept: BookCacheIndexEntry[] = [];
  for (const entry of entries) {
    if (
      kept.length >= BOOK_CACHE_ENTRY_MAX ||
      keptBytes + entry.bytes > BOOK_CACHE_TOTAL_MAX
    ) {
      safeRemoveStorage(entry.key);
      continue;
    }
    keptBytes += entry.bytes;
    kept.push(entry);
  }

  writeBookCacheIndex({
    schemaVersion: 1,
    nextRank,
    entries: kept.sort((a, b) => a.key.localeCompare(b.key)),
  });
}

export function morseBookPath(slug: string) {
  return `${MORSE_BOOKS_BASE_PATH}/${slug}`;
}

export function morseBookPrintPath(slug: string) {
  return `${morseBookPath(slug)}/print`;
}

export function morseAudiobookPath(slug: string) {
  return `${MORSE_AUDIOBOOKS_BASE_PATH}/${slug}`;
}

export function isMorseBookPublishReady(
  book: Pick<MorseBookLibrarySummary, "source"> | MorseBookManifest,
) {
  const approvedBySource =
    book.source.approvalSource === "file-evidence" ||
    book.source.approvalSource === "external-authority" ||
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

function normalizeContentBaseUrl(value: unknown) {
  return normalizeMorseBookContentBaseUrl(value);
}

export function getMorseBookContentBaseUrl() {
  return normalizeContentBaseUrl(
    import.meta.env.VITE_MORSE_BOOK_CONTENT_BASE_URL ||
      import.meta.env.PUBLIC_MORSE_BOOK_CONTENT_BASE_URL,
  );
}

function cloudflareContentUrl(path: string) {
  const baseUrl = getMorseBookContentBaseUrl();
  const normalizedPath = path.replace(/^\/+/, "");
  return baseUrl ? `${baseUrl}/${normalizedPath}` : "";
}

function publicSummaryToLibrarySummary(
  book: MorseBookPublicSummary,
): MorseBookLibrarySummary {
  return {
    slug: book.slug,
    title: book.title,
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
      alt: `Placeholder cover for ${book.title}`,
    },
    stats: book.stats,
    defaults: {
      includeKinds: ["chapter"],
      preferredPreset: "main-narrative",
    },
    manifestPath: book.bookPath,
  };
}

function getLocalPublicSummaries() {
  return publicManifest.books
    .filter((book) => isMorseBookPublishReady(publicSummaryToLibrarySummary(book)))
    .map(publicSummaryToLibrarySummary)
    .sort((a, b) => a.title.localeCompare(b.title));
}

function isPublicManifest(value: unknown): value is MorseBookPublicManifest {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    (value as MorseBookPublicManifest).schemaVersion === 1 &&
    Array.isArray((value as MorseBookPublicManifest).books)
  );
}

function isPublicBookContent(value: unknown): value is MorseBookPublicContentJson {
  const candidate = value as Partial<MorseBookPublicContentJson>;
  return (
    Boolean(candidate) &&
    typeof candidate === "object" &&
    candidate.schemaVersion === 1 &&
    typeof candidate.slug === "string" &&
    Boolean(candidate.manifest) &&
    typeof candidate.manifest?.contentVersion === "string" &&
    typeof candidate.manifest?.contentHash === "string" &&
    Array.isArray(candidate.sections)
  );
}

function normalizePublicBookContent(
  content: MorseBookPublicContentJson,
): MorseBookPublicContentJson {
  return {
    ...content,
    contentVersion: content.contentVersion ?? content.manifest.contentVersion,
    contentHash: content.contentHash ?? content.manifest.contentHash,
  };
}

async function fetchJson<T>(url: string, validate: (value: unknown) => value is T) {
  const fetchUrl =
    import.meta.env.SSR && url.startsWith("/")
      ? new URL(
          url,
          process.env.MORSEWORDS_INTERNAL_ORIGIN ??
            `http://localhost:${process.env.PORT ?? "3101"}`,
        ).href
      : url;
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const value: unknown = await response.json();
  if (!validate(value)) {
    throw new Error("Response was not valid Morse book JSON.");
  }
  return value;
}

async function getRuntimePublicManifest() {
  const manifestUrl = cloudflareContentUrl("public-manifest.json");
  if (!manifestUrl) return publicManifest;
  return fetchJson(manifestUrl, isPublicManifest);
}

function getLocalPublicBookUrl(bookPath: string) {
  return `/morse-book-content/${bookPath.replace(/^\/+/, "")}`;
}

export function getMorseBookPublicContentUrls(
  bookPath = "books/example.json",
  baseUrlOverride?: string,
) {
  const baseUrl =
    baseUrlOverride === undefined
      ? getMorseBookContentBaseUrl()
      : normalizeContentBaseUrl(baseUrlOverride);
  return getConfiguredMorseBookPublicContentUrls(bookPath, baseUrl);
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

export function getDefaultMorseBookSectionId(book: MorseBookManifest) {
  const fallbackSectionId = book.sections[0]?.id ?? null;
  return fallbackSectionId
    ? getDefaultMorseBookLiveSectionId(book, fallbackSectionId)
    : null;
}

export function getMorseBookSectionSummary(
  book: MorseBookManifest,
  sectionId: string,
): MorseBookSectionSummary | null {
  return book.sections.find((section) => section.id === sectionId) ?? null;
}

async function getMorseBookPublicSummaryRuntime(slug: string) {
  const manifest = await getRuntimePublicManifest();
  const summary = manifest.books.find((book) => book.slug === slug) ?? null;
  if (!summary) return null;
  const publicSummary = publicSummaryToLibrarySummary(summary);
  return isMorseBookPublishReady(publicSummary) ? summary : null;
}

function validatePublicContentForSummary(
  content: MorseBookPublicContentJson,
  summary: MorseBookPublicSummary,
) {
  return (
    content.slug === summary.slug &&
    content.contentVersion === summary.contentVersion &&
    content.contentHash === summary.contentHash &&
    content.manifest.slug === summary.slug &&
    isCacheablePublicBook(content)
  );
}

export async function getMorseBookPublicContent(slug: string) {
  const summary = await getMorseBookPublicSummaryRuntime(slug);
  if (!summary) return null;

  const memoryKey = bookCacheKey(summary);
  const memoryCached = publicBookContentCache.get(memoryKey);
  if (memoryCached && validatePublicContentForSummary(memoryCached, summary)) {
    return memoryCached;
  }

  const cached = readCachedPublicBook(summary);
  if (cached && validatePublicContentForSummary(cached, summary)) {
    publicBookContentCache.set(memoryKey, cached);
    return cached;
  }

  const bookUrl =
    cloudflareContentUrl(summary.bookPath) || getLocalPublicBookUrl(summary.bookPath);
  if (!bookUrl) return null;

  const content = normalizePublicBookContent(
    await fetchJson(bookUrl, isPublicBookContent),
  );
  if (!validatePublicContentForSummary(content, summary)) {
    throw new Error("Book content did not match the public manifest.");
  }

  publicBookContentCache.set(memoryKey, content);
  writeCachedPublicBook(content);
  return content;
}

async function loadPublicBookSectionMap(book: MorseBookManifest) {
  const cacheKey = bookCacheKey(book);
  const cached = publicBookContentCache.get(cacheKey);
  const content =
    cached && cached.slug === book.slug
      ? cached
      : await getMorseBookPublicContent(book.slug);
  if (!content) return null;

  const sections = new Map<string, MorseBookSectionJson>();
  content.sections.forEach((section) => {
    if (section.bookSlug !== book.slug) return;
    sections.set(section.sectionId, section);
  });
  return sections;
}

async function loadReviewBookSection(
  book: MorseBookManifest,
  sectionId: string,
) {
  const summary = getMorseBookSectionSummary(book, sectionId);
  if (!summary) return null;

  const reviewContent = await loadGeneratedReviewContent();
  const section = await reviewContent?.loadGeneratedMorseBookSection(
    book.slug,
    summary.sectionJsonPath,
  );
  if (!section) return null;
  if (section.bookSlug !== book.slug || section.sectionId !== sectionId) return null;
  return section;
}

export async function getMorseBookSections(
  book: MorseBookManifest,
  sectionIds: string[],
) {
  const uniqueSectionIds = [...new Set(sectionIds)];
  if (
    canUseTestPublishedBookFixture() &&
    book.slug === TEST_PUBLISHED_BOOK_SLUG
  ) {
    const fixtureSections: MorseBookSectionJson[] = [];
    uniqueSectionIds.forEach((sectionId) => {
      const section = getTestPublishedBookSection(sectionId);
      if (section) fixtureSections.push(section);
    });
    return fixtureSections;
  }

  const sections = new Map<string, MorseBookSectionJson>();
  const missingIds = [...uniqueSectionIds];

  if (missingIds.length > 0 && import.meta.env.DEV) {
    const reviewSections = await Promise.all(
      missingIds.map((id) => loadReviewBookSection(book, id)),
    );
    reviewSections.forEach((section) => {
      if (section) sections.set(section.sectionId, section);
    });
  }

  if (missingIds.length > 0 && isMorseBookPublishReady(book)) {
    const publicSections = await loadPublicBookSectionMap(book);
    if (publicSections) {
      missingIds
        .filter((sectionId) => !sections.has(sectionId))
        .forEach((sectionId) => {
          const section = publicSections.get(sectionId);
          if (section) sections.set(sectionId, section);
        });
    }
  }

  const stillMissingIds = uniqueSectionIds.filter((id) => !sections.has(id));
  if (stillMissingIds.length > 0) {
    const reviewSections = await Promise.all(
      stillMissingIds.map((id) => loadReviewBookSection(book, id)),
    );
    reviewSections.forEach((section) => {
      if (section) sections.set(section.sectionId, section);
    });
  }

  return uniqueSectionIds
    .map((sectionId) => sections.get(sectionId))
    .filter((section): section is MorseBookSectionJson => Boolean(section));
}

export async function getMorseBookSection(
  book: MorseBookManifest,
  sectionId: string,
) {
  const [section] = await getMorseBookSections(book, [sectionId]);
  return section ?? null;
}

export function getMorseBookDataLoaderStats() {
  return {
    summaryCount: libraryManifest.books.length,
    manifestLoaderCount: import.meta.env.DEV ? "dev-only" : 0,
    publicBookLoaderCount: publicManifest.books.length,
    reviewSectionLoaderCount: import.meta.env.DEV ? "dev-only" : 0,
  };
}
