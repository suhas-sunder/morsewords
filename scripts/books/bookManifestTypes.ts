export const BOOK_SCHEMA_VERSION = 1;

export const SECTION_KINDS = [
  "title-page",
  "dedication",
  "epigraph",
  "preface",
  "introduction",
  "prologue",
  "epilogue",
  "part",
  "book",
  "chapter",
  "scene",
  "poem",
  "letter",
  "appendix",
  "notes",
  "glossary",
  "index",
  "transcriber-note",
  "source-license",
  "advertisement",
  "unknown",
] as const;

export type BookSectionKind = (typeof SECTION_KINDS)[number];

export const RIGHTS_BASES = [
  "public-domain-us",
  "public-domain",
  "licensed",
  "permission-granted",
  "unknown",
] as const;

export type BookRightsBasis = (typeof RIGHTS_BASES)[number];

export const CLEANING_CONFIDENCE_VALUES = ["high", "medium", "low"] as const;

export type GutenbergCleaningConfidence =
  (typeof CLEANING_CONFIDENCE_VALUES)[number];

export type BookCleanupRule = {
  type: "replace" | "remove-line-matching";
  pattern: string;
  replacement?: string;
  flags?: string;
  note?: string;
};

export type BookSectionOverride =
  | {
      type: "force-boundary";
      markerText?: string;
      offset?: number;
      kind?: BookSectionKind;
      label?: string;
      title?: string | null;
    }
  | {
      type: "rename-section";
      sectionId: string;
      label?: string;
      title?: string | null;
    }
  | {
      type: "change-kind";
      sectionId: string;
      kind: BookSectionKind;
      includeByDefault?: boolean;
    }
  | {
      type: "set-include";
      sectionId: string;
      includeByDefault: boolean;
    }
  | {
      type: "merge-sections";
      sectionIds: string[];
      id?: string;
      kind?: BookSectionKind;
      label?: string;
      title?: string | null;
    }
  | {
      type: "split-section";
      sectionId: string;
      markerText?: string;
      offset?: number;
      newSectionId?: string;
      kind?: BookSectionKind;
      label?: string;
      title?: string | null;
    };

export type BookMetadata = {
  schemaVersion?: 1;
  slug: string;
  title: string;
  author: string[];
  language: string;
  source: {
    provider: "Project Gutenberg" | string;
    gutenbergId: string | null;
    rawTextFile: string;
    releaseDate: string | null;
    rightsBasis: BookRightsBasis;
    rightsReviewed: boolean;
    rightsNotes: string;
    allowDuplicateGutenbergId?: boolean;
    duplicateReason?: string;
  };
  cover: {
    src: string | null;
    placeholder: boolean;
    alt: string;
  };
  description: string;
  subjects: string[];
  originalPublicationYear: number | null;
  defaults: {
    includeKinds: BookSectionKind[];
    excludeKinds: BookSectionKind[];
    preferredPreset: string;
  };
  sectionOverrides: BookSectionOverride[];
  cleanupRules: BookCleanupRule[];
};

export type GutenbergCleaningReport = {
  originalCharacterCount: number;
  cleanedCharacterCount: number;
  headerStripped: boolean;
  footerStripped: boolean;
  confidence: GutenbergCleaningConfidence;
  warnings: string[];
  bodyStartOffset: number;
  bodyEndOffset: number;
};

export type DetectedBookSection = {
  id: string;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  order: number;
  includeByDefault: boolean;
  sourceStartOffset: number;
  sourceEndOffset: number;
  characterCount: number;
  wordCount: number;
  morseCharacterEstimate: number;
  textPreview: string;
  text: string;
};

export type GeneratedBookSectionSummary = Omit<
  DetectedBookSection,
  "text" | "sourceStartOffset" | "sourceEndOffset"
> & {
  sectionJsonPath: string;
};

export type GeneratedBookManifest = {
  schemaVersion: 1;
  slug: string;
  title: string;
  author: string[];
  language: string;
  description: string;
  subjects: string[];
  source: {
    provider: string;
    gutenbergId: string | null;
    releaseDate: string | null;
    rightsBasis: BookRightsBasis;
    rightsReviewed: boolean;
    publishReady: boolean;
    rightsNotes: string;
    allowDuplicateGutenbergId?: boolean;
    duplicateReason?: string;
  };
  cover: BookMetadata["cover"];
  stats: {
    originalCharacterCount: number;
    cleanedCharacterCount: number;
    wordCount: number;
    sectionCount: number;
    includedSectionCount: number;
  };
  defaults: {
    includeKinds: BookSectionKind[];
    preferredPreset: string;
  };
  sections: GeneratedBookSectionSummary[];
  cleaning: Omit<GutenbergCleaningReport, "bodyStartOffset" | "bodyEndOffset">;
  warnings: string[];
};

export type GeneratedBookSectionJson = {
  schemaVersion: 1;
  bookSlug: string;
  sectionId: string;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  order: number;
  includeByDefault: boolean;
  displayText: string;
  morseSourceText: string;
  paragraphs: string[];
  wordCount: number;
  characterCount: number;
  morseCharacterEstimate: number;
  unsupportedCharacterSummary: Record<string, number>;
  textPreview: string;
  sourceOffsets: {
    start: number;
    end: number;
  };
};

export type GeneratedLibraryBookSummary = {
  slug: string;
  title: string;
  author: string[];
  language: string;
  description: string;
  subjects: string[];
  source: GeneratedBookManifest["source"];
  cover: BookMetadata["cover"];
  stats: GeneratedBookManifest["stats"];
  defaults: GeneratedBookManifest["defaults"];
  manifestPath: string;
};

// Keep this summary-only so app code can list books without bundling full text.
export type GeneratedLibraryManifest = {
  schemaVersion: 1;
  books: GeneratedLibraryBookSummary[];
};
