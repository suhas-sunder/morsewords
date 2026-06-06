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

export const RIGHTS_RISK_LEVELS = ["none", "low", "medium", "high"] as const;

export type BookRightsRiskLevel = (typeof RIGHTS_RISK_LEVELS)[number];

export const CANADA_US_V1_STATUSES = [
  "approved",
  "needs_manual_review",
  "reject",
] as const;

export type BookCanadaUsV1Status = (typeof CANADA_US_V1_STATUSES)[number];

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
  metadataStatus?: "draft" | "reviewed";
  manualReviewRequired?: boolean;
  title: string;
  author: string[];
  language: string;
  source: {
    provider: "Project Gutenberg" | string;
    gutenbergId: string | null;
    sourceUrl?: string | null;
    rawTextFile: string;
    releaseDate: string | null;
    rawTextUrl?: string | null;
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
  scaffold?: {
    extractionConfidence: "gutenberg-header" | "gutenberg-reference" | "filename-only";
    extracted: {
      title: string | null;
      author: string | null;
      language: string | null;
      releaseDate: string | null;
      lastUpdated: string | null;
      originalPublication: string | null;
      gutenbergEbookNumber: string | null;
      credits: string | null;
      translator: string | null;
      illustrator: string | null;
      editor: string | null;
    };
    missingFields: string[];
    warnings: string[];
  };
};

export type ApprovedPersonMetadata = {
  name: string;
  deathYear: number | null;
  canadaLifePlus70Safe?: boolean;
  notes: string;
};

export type ApprovedPeopleMetadata = Record<string, ApprovedPersonMetadata>;

export type BookRightsReport = {
  schemaVersion: 1;
  title: string;
  author: string;
  author_death_year: number | null;
  language: string;
  original_publication: string;
  release_date: string;
  last_updated: string;
  source: string;
  gutenberg_ebook_number: string;
  source_url: string | null;
  raw_text_url: string | null;
  gutenberg_header_present: boolean;
  project_gutenberg_license_present: boolean;
  us_reuse_language_found: boolean;
  non_us_warning_found: boolean;
  credits: string;
  translator: string;
  translator_death_year: number | null;
  illustrator: string;
  editor: string;
  introduction_author: string;
  contains_modern_intro_or_notes: boolean;
  contains_transcriber_notes: boolean;
  contains_illustrations_or_image_references: boolean;
  contains_later_copyright_notice: boolean;
  contains_creative_commons_license: boolean;
  contains_permission_based_language: boolean;
  is_translation: boolean;
  translation_risk: BookRightsRiskLevel;
  edition_risk: BookRightsRiskLevel;
  trademark_or_character_brand_risk: BookRightsRiskLevel;
  content_brand_safety_risk: BookRightsRiskLevel;
  canada_us_v1_status: BookCanadaUsV1Status;
  reasoning_summary: string;
  evidence_snippets: string[];
  processing_allowed: boolean;
};

export type ProcessedBookJson = {
  schemaVersion: 1;
  id: string;
  title: string;
  author: string;
  source: {
    name: "Project Gutenberg" | string;
    ebook_number: string;
    source_url: string | null;
    raw_text_url: string | null;
    original_publication: string;
    release_date: string;
    last_updated: string;
  };
  rights: {
    status: "approved";
    approved_for_website: boolean;
    approved_for_youtube_narration: boolean;
    approved_regions: string[];
    needs_manual_review: boolean;
    notes: string;
  };
  content: {
    chapters: Array<{
      chapter_number: number;
      title: string;
      sections: Array<{
        section_number: number;
        text: string;
        word_count: number;
        character_count: number;
        estimated_typing_minutes: number;
      }>;
    }>;
  };
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
    sourceUrl: string | null;
    rawTextUrl: string | null;
    rightsBasis: BookRightsBasis;
    rightsReviewed: boolean;
    publishReady: boolean;
    rightsStatus: BookCanadaUsV1Status;
    processingAllowed: boolean;
    rightsReportPath: string;
    processedBookPath?: string;
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
