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

export type MorseBookApprovalSource =
  | "file-evidence"
  | "external-authority"
  | "owner-reviewed"
  | "manual-review";

export type MorseBookDuplicateResolutionSource =
  | "deterministic-file-match"
  | "owner-reviewed"
  | "manual-review"
  | "not-needed";

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
  approvalSource?: MorseBookApprovalSource;
  duplicateResolutionSource?: MorseBookDuplicateResolutionSource;
  rightsReportPath: string;
  processedBookPath?: string;
  cleanedBookPath?: string;
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

export type MorseBookContentSuitability = "low" | "moderate" | "elevated";

export type MorseBookContentSuitabilityProfile = {
  contentSuitability: MorseBookContentSuitability;
  strictReviewCandidate: boolean;
  contentNote: string;
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
  estimatedTypingMinutes: number;
  estimatedListeningMinutes: number;
  morseCharacterEstimate: number;
  textPreview: string;
};

export type MorseBookLibrarySummary = {
  slug: string;
  title: string;
  author: string[];
  contentVersion: string;
  contentHash: string;
  language: string;
  description: string;
  subjects: string[];
  source: MorseBookSourceSummary;
  cover: MorseBookCover;
  stats: MorseBookStats;
  defaults: MorseBookDefaults;
  manifestPath: string;
  contentSuitability?: MorseBookContentSuitability;
  strictReviewCandidate?: boolean;
  contentNote?: string;
};

export type MorseBookLibraryManifest = {
  schemaVersion: 1;
  books: MorseBookLibrarySummary[];
};

export type MorseBookPublicSummary = Pick<
  MorseBookLibrarySummary,
  | "slug"
  | "title"
  | "author"
  | "language"
  | "description"
  | "subjects"
  | "stats"
  | "contentVersion"
  | "contentHash"
> & {
  source: Pick<
    MorseBookSourceSummary,
    | "provider"
    | "gutenbergId"
    | "sourceUrl"
    | "rightsBasis"
    | "rightsStatus"
    | "publishReady"
    | "processingAllowed"
    | "approvalSource"
    | "duplicateResolutionSource"
  >;
  bookPath: string;
  contentSuitability?: MorseBookContentSuitability;
  strictReviewCandidate?: boolean;
  contentNote?: string;
};

export type MorseBookPublicManifest = {
  schemaVersion: 1;
  contentVersion: string;
  contentHash: string;
  books: MorseBookPublicSummary[];
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
  estimatedTypingMinutes: number;
  estimatedListeningMinutes: number;
  morseCharacterEstimate: number;
  unsupportedCharacterSummary: Record<string, number>;
  textPreview: string;
  sourceOffsets: {
    start: number;
    end: number;
  };
};

export type MorseBookPublicContentJson = {
  schemaVersion: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  manifest: MorseBookManifest;
  sections: MorseBookSectionJson[];
  contentSuitability?: MorseBookContentSuitability;
  strictReviewCandidate?: boolean;
  contentNote?: string;
};

export type MorseBookPreviewAsset = {
  version: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionKind: MorseBookSectionKind;
  defaultSectionLabel: string;
  defaultSectionTitle: string | null;
  previewText: string;
  estimatedRuntimeSeconds: number;
  wordCount: number;
  characterCount: number;
  estimatedTypingMinutes: number;
  estimatedListeningMinutes: number;
  morseCharacterEstimate: number;
  textPreview: string;
  truncated: boolean;
};

export type MorseBookPreviewManifest = {
  version: 1;
  assetBasePath: string;
  targetRuntimeSeconds: number;
  books: Array<{
    slug: string;
    path: string;
    contentVersion: string;
    contentHash: string;
    defaultSectionId: string;
    previewBytes: number;
    previewCharacterCount: number;
    estimatedRuntimeSeconds: number;
    truncated: boolean;
  }>;
  missing: Array<{
    slug: string;
    reason: string;
  }>;
};
