export type MorseBookSectionKind =
  | "title-page"
  | "dedication"
  | "epigraph"
  | "preface"
  | "introduction"
  | "prologue"
  | "epilogue"
  | "part"
  | "book"
  | "chapter"
  | "scene"
  | "poem"
  | "letter"
  | "appendix"
  | "notes"
  | "glossary"
  | "index"
  | "transcriber-note"
  | "source-license"
  | "advertisement"
  | "unknown";

export type MorseBookRightsBasis =
  | "public-domain-us"
  | "public-domain"
  | "licensed"
  | "permission-granted"
  | "unknown";

export type MorseBookRightsStatus = "approved" | "needs_manual_review" | "reject";

export type MorseBookCover = {
  src: string | null;
  placeholder: boolean;
  alt: string;
};

export type MorseBookSourceSummary = {
  provider: string;
  gutenbergId: string | null;
  releaseDate: string | null;
  sourceUrl: string | null;
  rawTextUrl: string | null;
  rightsBasis: MorseBookRightsBasis;
  rightsReviewed: boolean;
  publishReady: boolean;
  rightsStatus: MorseBookRightsStatus;
  processingAllowed: boolean;
  rightsReportPath: string;
  processedBookPath?: string;
  rightsNotes: string;
  allowDuplicateGutenbergId?: boolean;
  duplicateReason?: string;
};

export type MorseBookStats = {
  originalCharacterCount: number;
  cleanedCharacterCount: number;
  wordCount: number;
  sectionCount: number;
  includedSectionCount: number;
};

export type MorseBookDefaults = {
  includeKinds: MorseBookSectionKind[];
  preferredPreset: string;
};

export type MorseBookSectionSummary = {
  id: string;
  kind: MorseBookSectionKind;
  label: string;
  title: string | null;
  order: number;
  includeByDefault: boolean;
  sectionJsonPath: string;
  characterCount: number;
  wordCount: number;
  morseCharacterEstimate: number;
  textPreview: string;
};

export type MorseBookLibrarySummary = {
  slug: string;
  title: string;
  author: string[];
  language: string;
  description: string;
  subjects: string[];
  source: MorseBookSourceSummary;
  cover: MorseBookCover;
  stats: MorseBookStats;
  defaults: MorseBookDefaults;
  manifestPath: string;
};

export type MorseBookLibraryManifest = {
  schemaVersion: 1;
  books: MorseBookLibrarySummary[];
};

export type MorseBookManifest = Omit<
  MorseBookLibrarySummary,
  "manifestPath"
> & {
  schemaVersion: 1;
  sections: MorseBookSectionSummary[];
  cleaning: {
    originalCharacterCount: number;
    cleanedCharacterCount: number;
    headerStripped: boolean;
    footerStripped: boolean;
    confidence: "high" | "medium" | "low";
    warnings: string[];
  };
  warnings: string[];
};

export type MorseBookSectionJson = {
  schemaVersion: 1;
  bookSlug: string;
  sectionId: string;
  kind: MorseBookSectionKind;
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
