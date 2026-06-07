import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type {
  ApprovedPeopleMetadata,
  ApprovedPersonMetadata,
  ApprovedPersonRole,
  BookCanadaUsV1Status,
  BookMetadata,
  BookRightsReport,
  BookRightsRiskLevel,
} from "./bookManifestTypes.ts";
import { APPROVED_PERSON_ROLES, BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";
import { loadApprovedPeopleMetadata } from "./bookRightsValidation.ts";

type MetadataEntry = {
  filePath: string;
  relativePath: string;
  metadata: BookMetadata;
};

type RightsReportEntry = {
  metadataEntry: MetadataEntry;
  rightsReport: BookRightsReport;
  rightsReportPath: string;
  processingNotesPath: string;
};

type DuplicateParticipantReview = {
  slug: string;
  title: string;
  authors: string[];
  metadataFile: string;
  rawTextFile: string;
  allowDuplicateGutenbergId: boolean;
  duplicateReason: string | null;
};

type DuplicateGutenbergReviewGroup = {
  gutenbergId: string;
  participants: DuplicateParticipantReview[];
  exactDuplicateCandidates: Array<{
    title: string;
    authors: string[];
    slugs: string[];
  }>;
  hasExactDuplicateCandidates: boolean;
  nextActions: string[];
};

type PersonStatus = {
  name: string | null;
  deathYear: number | null;
  approvedMetadataFound: boolean;
  status: "none_found" | "approved_metadata" | "death_year_missing" | "manual_review_required";
};

type ReviewQueueBook = {
  slug: string;
  title: string;
  author: string[];
  gutenbergId: string | null;
  sourceUrl: string | null;
  metadataFile: string;
  rawTextFile: string;
  rightsReportPath: string;
  processingNotesPath: string;
  currentStatus: BookCanadaUsV1Status;
  processingAllowed: boolean;
  rejectionOrManualReviewReasons: string[];
  missingFields: string[];
  authorDeathYearStatus: {
    authors: Array<{
      name: string;
      deathYear: number | null;
      approvedMetadataFound: boolean;
      status: "approved_metadata" | "death_year_missing" | "manual_review_required";
    }>;
  };
  personStatus: {
    translator: PersonStatus;
    editor: PersonStatus;
    illustrator: PersonStatus;
    introductionAuthor: PersonStatus;
  };
  duplicateGutenbergIdStatus: {
    hasDuplicate: boolean;
    gutenbergId: string | null;
    affectedSlugs: string[];
    needsManualResolution: boolean;
  };
  risks: {
    laterCopyrightNotice: boolean;
    permissionBasedLanguage: boolean;
    creativeCommonsNotice: boolean;
    translation: BookRightsRiskLevel;
    edition: BookRightsRiskLevel;
    trademarkOrCharacterBrand: BookRightsRiskLevel;
    contentBrandSafety: BookRightsRiskLevel;
    modernIntroOrNotes: boolean;
    transcriberNotes: boolean;
    illustrationOrImageReferences: boolean;
  };
  nextAction: string;
  nextActions: string[];
};

type PeopleReviewQueueEntry = {
  suggestedKey: string;
  displayName: string;
  rolesFound: ApprovedPersonRole[];
  booksAffected: Array<{
    slug: string;
    title: string;
    role: ApprovedPersonRole;
    rightsStatus: BookCanadaUsV1Status;
  }>;
  approvedMetadataFound: boolean;
  knownDeathYear: number | null;
  missingDeathYearCount: number;
  suggestedMetadataEntry: ApprovedPersonMetadata;
};

type ApprovalCandidate = {
  slug: string;
  title: string;
  author: string[];
  currentStatus: BookCanadaUsV1Status;
  whyClose: string[];
  remainingBlockers: string[];
  exactMetadataFieldsNeeded: string[];
  addingApprovedAuthorMetadataMightBeEnough: boolean;
  translatorOrEditorAmbiguityRemains: boolean;
};

type RejectedBookEntry = {
  slug: string;
  title: string;
  author: string[];
  reasons: string[];
  nextAction: string;
};

export type BookReviewQueueReport = {
  schemaVersion: 1;
  generatedFrom: {
    metadataRoot: string;
    generatedRoot: string;
    rightsReportsRequired: true;
  };
  workflow: string[];
  summary: {
    totalBooks: number;
    approved: number;
    needsManualReview: number;
    rejected: number;
    processingAllowed: number;
    processingBlocked: number;
    booksWithMissingAuthorDeathYear: number;
    booksWithTranslatorEditorOrIntroReview: number;
    booksInDuplicateGutenbergGroups: number;
    approvalCandidates: number;
    rejectedBooks: number;
  };
  books: ReviewQueueBook[];
};

export type PeopleReviewQueueReport = {
  schemaVersion: 1;
  summary: {
    people: number;
    missingDeathYearEntries: number;
    roles: Record<ApprovedPersonRole, number>;
  };
  people: PeopleReviewQueueEntry[];
};

export type DuplicateGutenbergReviewReport = {
  schemaVersion: 1;
  summary: {
    duplicateGroups: number;
    affectedBooks: number;
    exactDuplicateCandidateGroups: number;
  };
  duplicateGutenbergIds: DuplicateGutenbergReviewGroup[];
};

export type ApprovalCandidatesReport = {
  schemaVersion: 1;
  summary: {
    candidates: number;
    authorMetadataMayBeEnough: number;
    translatorOrEditorAmbiguity: number;
  };
  candidates: ApprovalCandidate[];
};

export type GenerateBookReviewQueueOptions = {
  repoRoot?: string;
  textRoot?: string;
  metadataRoot?: string;
  approvedPeoplePath?: string;
  generatedRoot?: string;
  reviewRoot?: string;
  quiet?: boolean;
};

export type GenerateBookReviewQueueResult = {
  reviewQueue: BookReviewQueueReport;
  peopleReviewQueue: PeopleReviewQueueReport;
  duplicateGutenbergReview: DuplicateGutenbergReviewReport;
  approvalCandidates: ApprovalCandidatesReport;
  rejectedBooks: RejectedBookEntry[];
  reviewRoot: string;
  paths: {
    reviewQueueJson: string;
    reviewQueueMarkdown: string;
    peopleReviewQueueJson: string;
    peopleReviewQueueMarkdown: string;
    duplicateGutenbergReviewJson: string;
    duplicateGutenbergReviewMarkdown: string;
    approvalCandidatesJson: string;
    rejectedBooksMarkdown: string;
  };
  warnings: string[];
  fatalErrors: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_TEXT_ROOT = path.join(DEFAULT_REPO_ROOT, "app/client/assets/text");
const DEFAULT_METADATA_ROOT = path.join(DEFAULT_TEXT_ROOT, "meta");
const DEFAULT_APPROVED_PEOPLE_PATH = path.join(
  DEFAULT_TEXT_ROOT,
  "approved-metadata",
  "authors.json",
);
const DEFAULT_GENERATED_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/generated",
);
const APPROVED_PERSON_ROLE_SET = new Set<string>(APPROVED_PERSON_ROLES);

const WORKFLOW_STEPS = [
  "Run npm run books:review-queue.",
  "Fill approved people metadata only after manual verification.",
  "Fix duplicate Gutenberg ID metadata manually.",
  "Run npm run books:rights-report.",
  "Run npm run books:build.",
  "Only approved and processing_allowed books can become public.",
];

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareBySlug<T extends { slug: string }>(left: T, right: T): number {
  return compareText(left.slug, right.slug);
}

function relativeTo(root: string, filePath: string): string {
  return toPosixPath(path.relative(root, filePath));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findJsonFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
        files.push(entryPath);
      }
    }
  };
  walk(root);
  return files.sort((left, right) => compareText(toPosixPath(left), toPosixPath(right)));
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonIfChanged(filePath: string, value: unknown): boolean {
  const next = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === next) {
    return false;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

function writeTextIfChanged(filePath: string, value: string): boolean {
  const next = value.endsWith("\n") ? value : `${value}\n`;
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === next) {
    return false;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugifyName(input: string): string {
  const normalized = normalizeName(input);
  return normalized === "" ? "unknown-person" : normalized.replace(/\s+/g, "-");
}

function normalizeComparable(input: string): string {
  return normalizeName(input).replace(/\s+/g, " ");
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort(compareText);
}

function uniqueInOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function validateMetadataShape(
  raw: unknown,
  filePath: string,
): { metadata: BookMetadata | null; errors: string[] } {
  if (!isPlainObject(raw)) {
    return { metadata: null, errors: [`${path.basename(filePath)}: metadata must be an object.`] };
  }

  const errors: string[] = [];
  if (typeof raw.slug !== "string" || raw.slug.trim() === "") {
    errors.push("slug must be a non-empty string.");
  }
  if (typeof raw.title !== "string" || raw.title.trim() === "") {
    errors.push("title must be a non-empty string.");
  }
  if (!Array.isArray(raw.author) || raw.author.some((item) => typeof item !== "string")) {
    errors.push("author must be an array of strings.");
  }
  if (typeof raw.language !== "string") {
    errors.push("language must be a string.");
  }
  if (!isPlainObject(raw.source)) {
    errors.push("source must be an object.");
  } else {
    if (
      raw.source.gutenbergId !== null &&
      raw.source.gutenbergId !== undefined &&
      typeof raw.source.gutenbergId !== "string" &&
      typeof raw.source.gutenbergId !== "number"
    ) {
      errors.push("source.gutenbergId must be a string, number, or null.");
    }
    if (typeof raw.source.rawTextFile !== "string" || raw.source.rawTextFile.trim() === "") {
      errors.push("source.rawTextFile must be a non-empty string.");
    }
    if (typeof raw.source.rightsReviewed !== "boolean") {
      errors.push("source.rightsReviewed must be a boolean.");
    }
    if (typeof raw.source.rightsBasis !== "string") {
      errors.push("source.rightsBasis must be a string.");
    }
  }

  if (errors.length > 0) {
    return {
      metadata: null,
      errors: errors.map((error) => `${path.basename(filePath)}: ${error}`),
    };
  }

  const source = raw.source as Record<string, unknown>;
  return {
    metadata: {
      ...(raw as BookMetadata),
      source: {
        ...((raw as BookMetadata).source),
        gutenbergId:
          source.gutenbergId === null || source.gutenbergId === undefined
            ? null
            : String(source.gutenbergId),
      },
    },
    errors: [],
  };
}

function loadMetadataEntries(
  textRoot: string,
  metadataRoot: string,
): { entries: MetadataEntry[]; errors: string[] } {
  const entries: MetadataEntry[] = [];
  const errors: string[] = [];
  for (const filePath of findJsonFiles(metadataRoot)) {
    try {
      const { metadata, errors: shapeErrors } = validateMetadataShape(
        readJson(filePath),
        filePath,
      );
      errors.push(...shapeErrors);
      if (!metadata) continue;
      entries.push({
        filePath,
        relativePath: relativeTo(textRoot, filePath),
        metadata,
      });
    } catch (error) {
      errors.push(
        `${path.basename(filePath)}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  entries.sort((left, right) => compareText(left.metadata.slug, right.metadata.slug));
  return { entries, errors };
}

function validateRightsReportShape(
  raw: unknown,
  filePath: string,
): { report: BookRightsReport | null; errors: string[] } {
  if (!isPlainObject(raw)) {
    return { report: null, errors: [`${filePath}: rights report must be an object.`] };
  }

  const errors: string[] = [];
  const requireString = (key: keyof BookRightsReport) => {
    if (typeof raw[key] !== "string") errors.push(`${filePath}: ${key} must be a string.`);
  };
  const requireBoolean = (key: keyof BookRightsReport) => {
    if (typeof raw[key] !== "boolean") errors.push(`${filePath}: ${key} must be a boolean.`);
  };

  requireString("title");
  requireString("author");
  requireString("language");
  requireString("original_publication");
  requireString("source");
  if (
    raw.author_death_year !== null &&
    typeof raw.author_death_year !== "number"
  ) {
    errors.push(`${filePath}: author_death_year must be a number or null.`);
  }
  if (
    raw.translator_death_year !== null &&
    typeof raw.translator_death_year !== "number"
  ) {
    errors.push(`${filePath}: translator_death_year must be a number or null.`);
  }
  if (
    raw.canada_us_v1_status !== "approved" &&
    raw.canada_us_v1_status !== "needs_manual_review" &&
    raw.canada_us_v1_status !== "reject"
  ) {
    errors.push(`${filePath}: canada_us_v1_status is invalid.`);
  }
  if (
    raw.approval_source !== undefined &&
    raw.approval_source !== "file-evidence" &&
    raw.approval_source !== "owner-reviewed" &&
    raw.approval_source !== "manual-review"
  ) {
    errors.push(`${filePath}: approval_source is invalid.`);
  }
  if (
    raw.duplicate_resolution_source !== undefined &&
    raw.duplicate_resolution_source !== "deterministic-file-match" &&
    raw.duplicate_resolution_source !== "owner-reviewed" &&
    raw.duplicate_resolution_source !== "manual-review" &&
    raw.duplicate_resolution_source !== "not-needed"
  ) {
    errors.push(`${filePath}: duplicate_resolution_source is invalid.`);
  }
  requireBoolean("processing_allowed");
  requireBoolean("contains_later_copyright_notice");
  requireBoolean("contains_permission_based_language");
  requireBoolean("contains_creative_commons_license");
  requireBoolean("contains_modern_intro_or_notes");
  requireBoolean("contains_transcriber_notes");
  requireBoolean("contains_illustrations_or_image_references");
  requireBoolean("owner_reviewed_approval_present");
  requireBoolean("approved_for_website");
  requireBoolean("approved_for_youtube_narration");
  if (
    !Array.isArray(raw.approved_regions) ||
    raw.approved_regions.some((region) => typeof region !== "string")
  ) {
    errors.push(`${filePath}: approved_regions must be an array of strings.`);
  }
  if (typeof raw.reasoning_summary !== "string") {
    errors.push(`${filePath}: reasoning_summary must be a string.`);
  }

  return {
    report: errors.length > 0 ? null : (raw as BookRightsReport),
    errors,
  };
}

function loadRightsReportEntries({
  metadataEntries,
  generatedRoot,
}: {
  metadataEntries: MetadataEntry[];
  generatedRoot: string;
}): { entries: RightsReportEntry[]; errors: string[] } {
  const entries: RightsReportEntry[] = [];
  const errors: string[] = [];

  for (const metadataEntry of metadataEntries) {
    const bookRoot = path.join(generatedRoot, metadataEntry.metadata.slug);
    const rightsReportPath = path.join(bookRoot, "rights_report.json");
    const processingNotesPath = path.join(bookRoot, "processing_notes.md");
    if (!fs.existsSync(rightsReportPath)) {
      errors.push(
        `${metadataEntry.metadata.slug}: missing rights report. Run npm run books:rights-report first.`,
      );
      continue;
    }

    try {
      const { report, errors: reportErrors } = validateRightsReportShape(
        readJson(rightsReportPath),
        relativeTo(generatedRoot, rightsReportPath),
      );
      errors.push(...reportErrors);
      if (!report) continue;
      entries.push({
        metadataEntry,
        rightsReport: report,
        rightsReportPath,
        processingNotesPath,
      });
    } catch (error) {
      errors.push(
        `${metadataEntry.metadata.slug}: malformed rights_report.json: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  entries.sort((left, right) =>
    compareText(left.metadataEntry.metadata.slug, right.metadataEntry.metadata.slug),
  );
  return { entries, errors };
}

function approvedPersonFor(
  name: string,
  approvedPeople: ApprovedPeopleMetadata,
): { slug: string; person: ApprovedPersonMetadata } | null {
  const wanted = normalizeName(name);
  const wantedSlug = slugifyName(name);
  for (const [slug, person] of Object.entries(approvedPeople)) {
    if (slug === wantedSlug || normalizeName(person.name) === wanted) {
      return { slug, person };
    }
  }
  return null;
}

function splitReasons(reasoningSummary: string): string[] {
  return reasoningSummary
    .split(/(?<=\.)\s+/)
    .map((reason) => reason.trim())
    .filter(Boolean);
}

function riskAtLeastMedium(risk: BookRightsRiskLevel): boolean {
  return risk === "medium" || risk === "high";
}

function personStatusFor({
  name,
  deathYear,
  approvedPeople,
}: {
  name: string;
  deathYear: number | null;
  approvedPeople: ApprovedPeopleMetadata;
}): PersonStatus {
  if (!name.trim()) {
    return {
      name: null,
      deathYear: null,
      approvedMetadataFound: false,
      status: "none_found",
    };
  }
  const approved = approvedPersonFor(name, approvedPeople);
  if (approved) {
    return {
      name,
      deathYear: approved.person.deathYear,
      approvedMetadataFound: true,
      status: "approved_metadata",
    };
  }
  return {
    name,
    deathYear,
    approvedMetadataFound: false,
    status: deathYear === null ? "death_year_missing" : "manual_review_required",
  };
}

function authorDeathYearStatusFor({
  authors,
  rightsReport,
  approvedPeople,
}: {
  authors: string[];
  rightsReport: BookRightsReport;
  approvedPeople: ApprovedPeopleMetadata;
}): ReviewQueueBook["authorDeathYearStatus"] {
  return {
    authors: authors.map((name) => {
      const approved = approvedPersonFor(name, approvedPeople);
      if (approved) {
        return {
          name,
          deathYear: approved.person.deathYear,
          approvedMetadataFound: true,
          status: "approved_metadata",
        };
      }
      return {
        name,
        deathYear: rightsReport.author_death_year,
        approvedMetadataFound: false,
        status:
          rightsReport.author_death_year === null
            ? "death_year_missing"
            : "manual_review_required",
      };
    }),
  };
}

function duplicateGroups(entries: MetadataEntry[]): DuplicateGutenbergReviewGroup[] {
  const groups = new Map<string, MetadataEntry[]>();
  for (const entry of entries) {
    const id = entry.metadata.source.gutenbergId;
    if (!id) continue;
    const group = groups.get(id) ?? [];
    group.push(entry);
    groups.set(id, group);
  }

  return [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([gutenbergId, group]) => {
      const participants = group
        .map((entry) => ({
          slug: entry.metadata.slug,
          title: entry.metadata.title,
          authors: entry.metadata.author,
          metadataFile: entry.relativePath,
          rawTextFile: entry.metadata.source.rawTextFile,
          allowDuplicateGutenbergId:
            entry.metadata.source.allowDuplicateGutenbergId === true,
          duplicateReason: entry.metadata.source.duplicateReason ?? null,
        }))
        .sort(compareBySlug);

      const exactCandidateMap = new Map<string, DuplicateParticipantReview[]>();
      for (const participant of participants) {
        const key = [
          normalizeComparable(participant.title),
          participant.authors.map(normalizeComparable).sort(compareText).join("|"),
        ].join("::");
        const exactGroup = exactCandidateMap.get(key) ?? [];
        exactGroup.push(participant);
        exactCandidateMap.set(key, exactGroup);
      }
      const exactDuplicateCandidates = [...exactCandidateMap.values()]
        .filter((candidateGroup) => candidateGroup.length > 1)
        .map((candidateGroup) => ({
          title: candidateGroup[0].title,
          authors: candidateGroup[0].authors,
          slugs: candidateGroup.map((participant) => participant.slug).sort(compareText),
        }))
        .sort((left, right) => compareText(left.slugs.join(","), right.slugs.join(",")));

      return {
        gutenbergId,
        participants,
        exactDuplicateCandidates,
        hasExactDuplicateCandidates: exactDuplicateCandidates.length > 0,
        nextActions: [
          "Keep one canonical metadata entry only after manual comparison.",
          "Mark intentional duplicate metadata with allowDuplicateGutenbergId and duplicateReason.",
          "Remove duplicate raw files from tracked processing lists only after confirming they are redundant.",
          "Manually compare source files before resolving the group.",
        ],
      };
    })
    .sort((left, right) => compareText(left.gutenbergId, right.gutenbergId));
}

function duplicateLookup(
  groups: DuplicateGutenbergReviewGroup[],
): Map<string, DuplicateGutenbergReviewGroup> {
  const lookup = new Map<string, DuplicateGutenbergReviewGroup>();
  for (const group of groups) {
    for (const participant of group.participants) {
      lookup.set(participant.slug, group);
    }
  }
  return lookup;
}

function missingFieldsFor({
  metadata,
  rightsReport,
  duplicateGroup,
}: {
  metadata: BookMetadata;
  rightsReport: BookRightsReport;
  duplicateGroup: DuplicateGutenbergReviewGroup | null;
}): string[] {
  const missing: string[] = [];
  if (!metadata.source.gutenbergId) missing.push("source.gutenbergId");
  if (!rightsReport.source_url) missing.push("sourceUrl");
  if (!rightsReport.original_publication) missing.push("originalPublication");
  if (
    rightsReport.approval_source !== "file-evidence" &&
    metadata.originalPublicationYear === null
  ) {
    missing.push("originalPublicationYear");
  }
  if (rightsReport.author_death_year === null) {
    missing.push("approved author death year");
  }
  if (rightsReport.translator && rightsReport.translator_death_year === null) {
    missing.push("approved translator death year");
  }
  if (rightsReport.editor) missing.push("editor identity/death-year review");
  if (rightsReport.introduction_author) {
    missing.push("introduction author identity/death-year review");
  }
  if (rightsReport.illustrator) missing.push("illustrator handling review");
  if (rightsReport.approval_source !== "file-evidence") {
    if (!metadata.source.rightsReviewed) missing.push("source.rightsReviewed");
    if (!rightsReport.owner_reviewed_approval_present) {
      missing.push("owner-reviewed website approval");
    }
    if (!rightsReport.approved_for_website) missing.push("website approval");
    if (metadata.source.rightsBasis === "unknown") missing.push("source.rightsBasis");
    if (metadata.metadataStatus === "draft") missing.push("metadataStatus reviewed");
    if (metadata.manualReviewRequired === true) missing.push("manualReviewRequired false");
  }
  if (duplicateGroup) missing.push("duplicate Gutenberg ID resolution");
  return uniqueSorted(missing);
}

function nextActionsForBook({
  metadata,
  rightsReport,
  duplicateGroup,
  missingFields,
}: {
  metadata: BookMetadata;
  rightsReport: BookRightsReport;
  duplicateGroup: DuplicateGutenbergReviewGroup | null;
  missingFields: string[];
}): string[] {
  const actions: string[] = [];
  if (rightsReport.canada_us_v1_status === "reject") {
    if (
      rightsReport.contains_later_copyright_notice ||
      rightsReport.contains_permission_based_language ||
      rightsReport.contains_creative_commons_license
    ) {
      actions.push("Reject or remove modern/permission-based text.");
    } else {
      actions.push("Keep blocked until the rejection reason is manually resolved.");
    }
  }
  if (duplicateGroup) actions.push("Review duplicate Gutenberg ID group.");
  if (!metadata.source.gutenbergId || !rightsReport.source_url) {
    actions.push("Confirm source URL/Gutenberg ID.");
  }
  if (rightsReport.author_death_year === null) {
    actions.push("Add approved author death year metadata.");
  }
  if (rightsReport.translator && rightsReport.translator_death_year === null) {
    actions.push("Check translator identity and death year.");
  }
  if (rightsReport.editor || rightsReport.introduction_author) {
    actions.push("Check editor/introduction author identity and death year.");
  }
  if (
    !rightsReport.original_publication ||
    (rightsReport.approval_source !== "file-evidence" &&
      metadata.originalPublicationYear === null)
  ) {
    actions.push("Add original publication metadata.");
  }
  if (rightsReport.contains_later_copyright_notice) {
    actions.push("Review later copyright notice.");
  }
  if (rightsReport.contains_permission_based_language) {
    actions.push("Review permission-based reuse language.");
  }
  if (rightsReport.contains_creative_commons_license) {
    actions.push("Review Creative Commons notice.");
  }
  if (riskAtLeastMedium(rightsReport.content_brand_safety_risk)) {
    actions.push("Review content-brand safety before education use.");
  }
  if (riskAtLeastMedium(rightsReport.trademark_or_character_brand_risk)) {
    actions.push("Review trademark/character brand risk.");
  }
  if (rightsReport.contains_illustrations_or_image_references) {
    actions.push("Review illustration/image references.");
  }
  if (rightsReport.contains_transcriber_notes) {
    actions.push("Review transcriber notes and excluded support matter.");
  }
  if (rightsReport.is_translation && !rightsReport.translator) {
    actions.push("Confirm translation status.");
  }
  if (
    rightsReport.approval_source !== "file-evidence" &&
    (!metadata.source.rightsReviewed || metadata.source.rightsBasis === "unknown")
  ) {
    actions.push("Complete manual rights review metadata.");
  }
  if (
    rightsReport.approval_source !== "file-evidence" &&
    !rightsReport.owner_reviewed_approval_present
  ) {
    actions.push("Add owner-reviewed book approval before processing.");
  }
  if (
    rightsReport.approval_source !== "file-evidence" &&
    (metadata.metadataStatus === "draft" || metadata.manualReviewRequired === true)
  ) {
    actions.push("Move draft metadata through manual review before processing.");
  }
  if (actions.length === 0 && missingFields.length === 0) {
    actions.push("Manual final approval required before any public exposure.");
  }
  return uniqueInOrder(actions);
}

function reviewQueueBookFor({
  entry,
  approvedPeople,
  generatedRoot,
  duplicateGroup,
}: {
  entry: RightsReportEntry;
  approvedPeople: ApprovedPeopleMetadata;
  generatedRoot: string;
  duplicateGroup: DuplicateGutenbergReviewGroup | null;
}): ReviewQueueBook {
  const { metadata } = entry.metadataEntry;
  const { rightsReport } = entry;
  const missingFields = missingFieldsFor({ metadata, rightsReport, duplicateGroup });
  const nextActions = nextActionsForBook({
    metadata,
    rightsReport,
    duplicateGroup,
    missingFields,
  });
  const affectedSlugs =
    duplicateGroup?.participants.map((participant) => participant.slug).sort(compareText) ??
    [];

  return {
    slug: metadata.slug,
    title: metadata.title,
    author: metadata.author,
    gutenbergId: metadata.source.gutenbergId,
    sourceUrl: rightsReport.source_url,
    metadataFile: entry.metadataEntry.relativePath,
    rawTextFile: metadata.source.rawTextFile,
    rightsReportPath: relativeTo(generatedRoot, entry.rightsReportPath),
    processingNotesPath: relativeTo(generatedRoot, entry.processingNotesPath),
    currentStatus: rightsReport.canada_us_v1_status,
    processingAllowed: rightsReport.processing_allowed,
    rejectionOrManualReviewReasons: splitReasons(rightsReport.reasoning_summary),
    missingFields,
    authorDeathYearStatus: authorDeathYearStatusFor({
      authors: metadata.author,
      rightsReport,
      approvedPeople,
    }),
    personStatus: {
      translator: personStatusFor({
        name: rightsReport.translator,
        deathYear: rightsReport.translator_death_year,
        approvedPeople,
      }),
      editor: personStatusFor({
        name: rightsReport.editor,
        deathYear: null,
        approvedPeople,
      }),
      illustrator: personStatusFor({
        name: rightsReport.illustrator,
        deathYear: null,
        approvedPeople,
      }),
      introductionAuthor: personStatusFor({
        name: rightsReport.introduction_author,
        deathYear: null,
        approvedPeople,
      }),
    },
    duplicateGutenbergIdStatus: {
      hasDuplicate: duplicateGroup !== null,
      gutenbergId: duplicateGroup?.gutenbergId ?? null,
      affectedSlugs,
      needsManualResolution:
        duplicateGroup !== null &&
        duplicateGroup.participants.some(
          (participant) =>
            !participant.allowDuplicateGutenbergId ||
            participant.duplicateReason === null ||
            participant.duplicateReason.trim() === "",
        ),
    },
    risks: {
      laterCopyrightNotice: rightsReport.contains_later_copyright_notice,
      permissionBasedLanguage: rightsReport.contains_permission_based_language,
      creativeCommonsNotice: rightsReport.contains_creative_commons_license,
      translation: rightsReport.translation_risk,
      edition: rightsReport.edition_risk,
      trademarkOrCharacterBrand: rightsReport.trademark_or_character_brand_risk,
      contentBrandSafety: rightsReport.content_brand_safety_risk,
      modernIntroOrNotes: rightsReport.contains_modern_intro_or_notes,
      transcriberNotes: rightsReport.contains_transcriber_notes,
      illustrationOrImageReferences:
        rightsReport.contains_illustrations_or_image_references,
    },
    nextAction: nextActions[0],
    nextActions,
  };
}

function addPersonRole({
  people,
  displayName,
  role,
  book,
  approvedPeople,
  deathYear,
}: {
  people: Map<string, PeopleReviewQueueEntry>;
  displayName: string;
  role: ApprovedPersonRole;
  book: ReviewQueueBook;
  approvedPeople: ApprovedPeopleMetadata;
  deathYear: number | null;
}): void {
  const trimmed = displayName.trim();
  if (!trimmed) return;

  const approved = approvedPersonFor(trimmed, approvedPeople);
  const suggestedKey = approved?.slug ?? slugifyName(trimmed);
  const existing = people.get(suggestedKey);
  const rolesFound = uniqueSorted([
    ...(existing?.rolesFound ?? []),
    role,
  ]) as ApprovedPersonRole[];
  const booksAffected = [
    ...(existing?.booksAffected ?? []),
    {
      slug: book.slug,
      title: book.title,
      role,
      rightsStatus: book.currentStatus,
    },
  ].sort((left, right) => compareText(left.slug, right.slug) || compareText(left.role, right.role));
  const approvedMetadataFound = approved !== null;
  const knownDeathYear = approved?.person.deathYear ?? null;
  const missingDeathYear =
    knownDeathYear === null && deathYear === null && book.currentStatus !== "approved"
      ? 1
      : 0;

  people.set(suggestedKey, {
    suggestedKey,
    displayName: approved?.person.name ?? trimmed,
    rolesFound,
    booksAffected,
    approvedMetadataFound,
    knownDeathYear,
    missingDeathYearCount:
      (existing?.missingDeathYearCount ?? 0) + missingDeathYear,
    suggestedMetadataEntry: {
      name: approved?.person.name ?? trimmed,
      deathYear: knownDeathYear,
      canadaLifePlus70Safe: approved?.person.canadaLifePlus70Safe ?? false,
      roles: rolesFound,
      sources: approved?.person.sources ?? [],
      notes: approved?.person.notes || "Fill after manual verification.",
    },
  });
}

function buildPeopleReviewQueue({
  books,
  approvedPeople,
}: {
  books: ReviewQueueBook[];
  approvedPeople: ApprovedPeopleMetadata;
}): PeopleReviewQueueReport {
  const people = new Map<string, PeopleReviewQueueEntry>();
  for (const book of books) {
    for (const author of book.authorDeathYearStatus.authors) {
      addPersonRole({
        people,
        displayName: author.name,
        role: "author",
        book,
        approvedPeople,
        deathYear: author.deathYear,
      });
    }
    addPersonRole({
      people,
      displayName: book.personStatus.translator.name ?? "",
      role: "translator",
      book,
      approvedPeople,
      deathYear: book.personStatus.translator.deathYear,
    });
    addPersonRole({
      people,
      displayName: book.personStatus.editor.name ?? "",
      role: "editor",
      book,
      approvedPeople,
      deathYear: book.personStatus.editor.deathYear,
    });
    addPersonRole({
      people,
      displayName: book.personStatus.illustrator.name ?? "",
      role: "illustrator",
      book,
      approvedPeople,
      deathYear: book.personStatus.illustrator.deathYear,
    });
    addPersonRole({
      people,
      displayName: book.personStatus.introductionAuthor.name ?? "",
      role: "introduction_author",
      book,
      approvedPeople,
      deathYear: book.personStatus.introductionAuthor.deathYear,
    });
  }

  const entries = [...people.values()].sort(
    (left, right) =>
      right.missingDeathYearCount - left.missingDeathYearCount ||
      compareText(left.suggestedKey, right.suggestedKey),
  );
  const roles = APPROVED_PERSON_ROLES.reduce(
    (accumulator, role) => ({ ...accumulator, [role]: 0 }),
    {} as Record<ApprovedPersonRole, number>,
  );
  for (const entry of entries) {
    for (const role of entry.rolesFound) {
      roles[role] += 1;
    }
  }

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    summary: {
      people: entries.length,
      missingDeathYearEntries: entries.filter(
        (entry) => entry.missingDeathYearCount > 0,
      ).length,
      roles,
    },
    people: entries,
  };
}

function metadataFieldsNeededFor(book: ReviewQueueBook): string[] {
  const fields: string[] = [];
  for (const author of book.authorDeathYearStatus.authors) {
    if (author.deathYear === null && !author.approvedMetadataFound) {
      fields.push(
        `app/client/assets/text/approved-metadata/authors.json::${slugifyName(author.name)}.deathYear`,
      );
    }
  }
  const translator = book.personStatus.translator;
  if (translator.name && translator.deathYear === null && !translator.approvedMetadataFound) {
    fields.push(
      `app/client/assets/text/approved-metadata/authors.json::${slugifyName(translator.name)}.deathYear`,
    );
  }
  const editor = book.personStatus.editor;
  if (editor.name && !editor.approvedMetadataFound) {
    fields.push(
      `app/client/assets/text/approved-metadata/authors.json::${slugifyName(editor.name)}`,
    );
  }
  const introductionAuthor = book.personStatus.introductionAuthor;
  if (introductionAuthor.name && !introductionAuthor.approvedMetadataFound) {
    fields.push(
      `app/client/assets/text/approved-metadata/authors.json::${slugifyName(introductionAuthor.name)}`,
    );
  }
  for (const field of book.missingFields) {
    if (field === "approved author death year" || field === "approved translator death year") {
      continue;
    }
    fields.push(`app/client/assets/text/meta/${book.slug}.json::${field}`);
  }
  return uniqueSorted(fields);
}

function approvalCandidateFor(book: ReviewQueueBook): ApprovalCandidate | null {
  if (book.currentStatus !== "needs_manual_review") return null;
  if (book.duplicateGutenbergIdStatus.hasDuplicate) return null;
  if (
    book.risks.laterCopyrightNotice ||
    book.risks.permissionBasedLanguage ||
    book.risks.creativeCommonsNotice ||
    riskAtLeastMedium(book.risks.trademarkOrCharacterBrand)
  ) {
    return null;
  }
  if (!book.gutenbergId || !book.sourceUrl) return null;

  const translatorOrEditorAmbiguityRemains =
    Boolean(book.personStatus.translator.name) ||
    Boolean(book.personStatus.editor.name) ||
    Boolean(book.personStatus.introductionAuthor.name) ||
    riskAtLeastMedium(book.risks.translation) ||
    book.risks.modernIntroOrNotes;
  const whyClose = [
    "Project Gutenberg source URL is present.",
    "No duplicate Gutenberg ID blocker is attached.",
  ];
  if (!book.risks.laterCopyrightNotice && !book.risks.permissionBasedLanguage) {
    whyClose.push("No later copyright or permission-language blocker was detected.");
  }
  if (book.authorDeathYearStatus.authors.some((author) => author.deathYear === null)) {
    whyClose.push("Main remaining person blocker is author death-year evidence.");
  }
  if (book.risks.contentBrandSafety !== "none") {
    whyClose.push("Content needs education-use review even if rights metadata is completed.");
  }
  const exactMetadataFieldsNeeded = metadataFieldsNeededFor(book);
  const addingApprovedAuthorMetadataMightBeEnough =
    book.authorDeathYearStatus.authors.some(
      (author) => author.deathYear === null && !author.approvedMetadataFound,
    ) &&
    !translatorOrEditorAmbiguityRemains &&
    !book.risks.illustrationOrImageReferences &&
    !riskAtLeastMedium(book.risks.contentBrandSafety) &&
    !book.missingFields.includes("originalPublication") &&
    !book.missingFields.includes("originalPublicationYear");

  return {
    slug: book.slug,
    title: book.title,
    author: book.author,
    currentStatus: book.currentStatus,
    whyClose,
    remainingBlockers: book.rejectionOrManualReviewReasons,
    exactMetadataFieldsNeeded,
    addingApprovedAuthorMetadataMightBeEnough,
    translatorOrEditorAmbiguityRemains,
  };
}

function buildApprovalCandidates(books: ReviewQueueBook[]): ApprovalCandidatesReport {
  const candidates = books
    .map(approvalCandidateFor)
    .filter((candidate): candidate is ApprovalCandidate => candidate !== null)
    .sort(
      (left, right) =>
        left.remainingBlockers.length - right.remainingBlockers.length ||
        compareText(left.slug, right.slug),
    );

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    summary: {
      candidates: candidates.length,
      authorMetadataMayBeEnough: candidates.filter(
        (candidate) => candidate.addingApprovedAuthorMetadataMightBeEnough,
      ).length,
      translatorOrEditorAmbiguity: candidates.filter(
        (candidate) => candidate.translatorOrEditorAmbiguityRemains,
      ).length,
    },
    candidates,
  };
}

function buildReviewQueueReport({
  books,
  metadataRoot,
  generatedRoot,
  approvalCandidates,
}: {
  books: ReviewQueueBook[];
  metadataRoot: string;
  generatedRoot: string;
  approvalCandidates: ApprovalCandidatesReport;
}): BookReviewQueueReport {
  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    generatedFrom: {
      metadataRoot: toPosixPath(metadataRoot),
      generatedRoot: toPosixPath(generatedRoot),
      rightsReportsRequired: true,
    },
    workflow: WORKFLOW_STEPS,
    summary: {
      totalBooks: books.length,
      approved: books.filter((book) => book.currentStatus === "approved").length,
      needsManualReview: books.filter(
        (book) => book.currentStatus === "needs_manual_review",
      ).length,
      rejected: books.filter((book) => book.currentStatus === "reject").length,
      processingAllowed: books.filter((book) => book.processingAllowed).length,
      processingBlocked: books.filter((book) => !book.processingAllowed).length,
      booksWithMissingAuthorDeathYear: books.filter((book) =>
        book.authorDeathYearStatus.authors.some((author) => author.deathYear === null),
      ).length,
      booksWithTranslatorEditorOrIntroReview: books.filter(
        (book) =>
          book.personStatus.translator.status === "death_year_missing" ||
          book.personStatus.editor.status === "death_year_missing" ||
          book.personStatus.introductionAuthor.status === "death_year_missing",
      ).length,
      booksInDuplicateGutenbergGroups: books.filter(
        (book) => book.duplicateGutenbergIdStatus.hasDuplicate,
      ).length,
      approvalCandidates: approvalCandidates.summary.candidates,
      rejectedBooks: books.filter((book) => book.currentStatus === "reject").length,
    },
    books: books.sort(compareBySlug),
  };
}

function buildDuplicateGutenbergReview(
  groups: DuplicateGutenbergReviewGroup[],
): DuplicateGutenbergReviewReport {
  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    summary: {
      duplicateGroups: groups.length,
      affectedBooks: groups.reduce(
        (count, group) => count + group.participants.length,
        0,
      ),
      exactDuplicateCandidateGroups: groups.reduce(
        (count, group) => count + group.exactDuplicateCandidates.length,
        0,
      ),
    },
    duplicateGutenbergIds: groups,
  };
}

function buildRejectedBooks(books: ReviewQueueBook[]): RejectedBookEntry[] {
  return books
    .filter((book) => book.currentStatus === "reject")
    .map((book) => ({
      slug: book.slug,
      title: book.title,
      author: book.author,
      reasons: book.rejectionOrManualReviewReasons,
      nextAction: book.nextAction,
    }))
    .sort(compareBySlug);
}

function markdownList(items: string[]): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None.";
}

function buildReviewQueueMarkdown(report: BookReviewQueueReport): string {
  const books = report.books
    .map(
      (book) =>
        `- ${book.slug}: ${book.currentStatus}; processing ${
          book.processingAllowed ? "allowed" : "blocked"
        }; next: ${book.nextAction}`,
    )
    .join("\n");

  return [
    "# Morse book manual review queue",
    "",
    "## Summary",
    "",
    `- Total books: ${report.summary.totalBooks}`,
    `- Approved: ${report.summary.approved}`,
    `- Needs manual review: ${report.summary.needsManualReview}`,
    `- Rejected: ${report.summary.rejected}`,
    `- Processing allowed: ${report.summary.processingAllowed}`,
    `- Processing blocked: ${report.summary.processingBlocked}`,
    `- Missing author death year: ${report.summary.booksWithMissingAuthorDeathYear}`,
    `- Translator/editor/intro review: ${report.summary.booksWithTranslatorEditorOrIntroReview}`,
    `- Duplicate Gutenberg group books: ${report.summary.booksInDuplicateGutenbergGroups}`,
    `- Approval candidates: ${report.summary.approvalCandidates}`,
    "",
    "## Manual Workflow",
    "",
    report.workflow.map((step, index) => `${index + 1}. ${step}`).join("\n"),
    "",
    "## Queue",
    "",
    books || "- No books found.",
    "",
  ].join("\n");
}

function buildPeopleReviewMarkdown(report: PeopleReviewQueueReport): string {
  const lines = report.people
    .map((person) => {
      const books = person.booksAffected
        .map((book) => `${book.slug} (${book.role})`)
        .join(", ");
      return `- ${person.suggestedKey}: ${person.displayName}; roles: ${person.rolesFound.join(
        ", ",
      )}; missing death-year uses: ${person.missingDeathYearCount}; books: ${books}`;
    })
    .join("\n");

  return [
    "# Morse book people review queue",
    "",
    `- People: ${report.summary.people}`,
    `- People missing death-year metadata: ${report.summary.missingDeathYearEntries}`,
    "",
    "## Suggested Approved Metadata Shape",
    "",
    "```json",
    JSON.stringify(
      {
        "person-slug": {
          name: "Person Name",
          deathYear: null,
          canadaLifePlus70Safe: false,
          roles: ["author"],
          sources: [],
          notes: "Fill after manual verification.",
        },
      },
      null,
      2,
    ),
    "```",
    "",
    "## People",
    "",
    lines || "- No people found.",
    "",
  ].join("\n");
}

function buildDuplicateMarkdown(report: DuplicateGutenbergReviewReport): string {
  const lines = report.duplicateGutenbergIds
    .map((group) => {
      const participants = group.participants
        .map(
          (participant) =>
            `${participant.slug} (${participant.title}; ${participant.rawTextFile})`,
        )
        .join(", ");
      const exact = group.hasExactDuplicateCandidates ? "yes" : "no";
      return `- ${group.gutenbergId}: exact duplicate candidates: ${exact}; affected: ${participants}`;
    })
    .join("\n");

  return [
    "# Duplicate Gutenberg ID review",
    "",
    `- Duplicate groups: ${report.summary.duplicateGroups}`,
    `- Affected books: ${report.summary.affectedBooks}`,
    `- Exact duplicate candidate groups: ${report.summary.exactDuplicateCandidateGroups}`,
    "",
    "## Required Manual Actions",
    "",
    markdownList([
      "Keep one canonical metadata entry only after manual comparison.",
      "Mark intentional duplicate metadata with allowDuplicateGutenbergId and duplicateReason.",
      "Remove duplicate raw files from tracked processing lists only after confirming they are redundant.",
      "Manually compare source files before resolving each group.",
    ]),
    "",
    "## Groups",
    "",
    lines || "- No duplicate Gutenberg IDs found.",
    "",
  ].join("\n");
}

function buildRejectedBooksMarkdown(rejectedBooks: RejectedBookEntry[]): string {
  const lines = rejectedBooks
    .map(
      (book) =>
        `- ${book.slug}: ${book.title}; next: ${book.nextAction}; reasons: ${book.reasons.join(
          " ",
        )}`,
    )
    .join("\n");

  return [
    "# Rejected Morse book rights queue",
    "",
    `- Rejected books: ${rejectedBooks.length}`,
    "",
    "Rejected means the current generated rights report found blockers. Do not process these books until the source or metadata is manually resolved.",
    "",
    "## Books",
    "",
    lines || "- No rejected books.",
    "",
  ].join("\n");
}

function printSummary(result: GenerateBookReviewQueueResult): void {
  const { reviewQueue, peopleReviewQueue, duplicateGutenbergReview, approvalCandidates } =
    result;
  console.log("Morse book review queue");
  console.log(`Books: ${reviewQueue.summary.totalBooks}`);
  console.log(`Needs manual review: ${reviewQueue.summary.needsManualReview}`);
  console.log(`Rejected: ${reviewQueue.summary.rejected}`);
  console.log(`People needing review: ${peopleReviewQueue.summary.people}`);
  console.log(
    `Duplicate Gutenberg groups: ${duplicateGutenbergReview.summary.duplicateGroups}`,
  );
  console.log(`Approval candidates: ${approvalCandidates.summary.candidates}`);
  console.log(`Review output: ${toPosixPath(result.reviewRoot)}`);
  if (result.warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of result.warnings) {
      console.log(`- ${warning}`);
    }
  }
  if (result.fatalErrors.length > 0) {
    console.error("\nFatal errors:");
    for (const error of result.fatalErrors) {
      console.error(`- ${error}`);
    }
  }
}

function emptyResult({
  metadataRoot,
  generatedRoot,
  reviewRoot,
  warnings,
  fatalErrors,
}: {
  metadataRoot: string;
  generatedRoot: string;
  reviewRoot: string;
  warnings: string[];
  fatalErrors: string[];
}): GenerateBookReviewQueueResult {
  const emptyApprovalCandidates: ApprovalCandidatesReport = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    summary: {
      candidates: 0,
      authorMetadataMayBeEnough: 0,
      translatorOrEditorAmbiguity: 0,
    },
    candidates: [],
  };
  const reviewQueue = buildReviewQueueReport({
    books: [],
    metadataRoot,
    generatedRoot,
    approvalCandidates: emptyApprovalCandidates,
  });
  const peopleReviewQueue: PeopleReviewQueueReport = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    summary: {
      people: 0,
      missingDeathYearEntries: 0,
      roles: APPROVED_PERSON_ROLES.reduce(
        (accumulator, role) => ({ ...accumulator, [role]: 0 }),
        {} as Record<ApprovedPersonRole, number>,
      ),
    },
    people: [],
  };
  const duplicateGutenbergReview = buildDuplicateGutenbergReview([]);
  return {
    reviewQueue,
    peopleReviewQueue,
    duplicateGutenbergReview,
    approvalCandidates: emptyApprovalCandidates,
    rejectedBooks: [],
    reviewRoot,
    paths: {
      reviewQueueJson: path.join(reviewRoot, "review-queue.json"),
      reviewQueueMarkdown: path.join(reviewRoot, "review-queue.md"),
      peopleReviewQueueJson: path.join(reviewRoot, "people-review-queue.json"),
      peopleReviewQueueMarkdown: path.join(reviewRoot, "people-review-queue.md"),
      duplicateGutenbergReviewJson: path.join(
        reviewRoot,
        "duplicate-gutenberg-review.json",
      ),
      duplicateGutenbergReviewMarkdown: path.join(
        reviewRoot,
        "duplicate-gutenberg-review.md",
      ),
      approvalCandidatesJson: path.join(reviewRoot, "approval-candidates.json"),
      rejectedBooksMarkdown: path.join(reviewRoot, "rejected-books.md"),
    },
    warnings,
    fatalErrors,
  };
}

export function generateBookReviewQueue(
  options: GenerateBookReviewQueueOptions = {},
): GenerateBookReviewQueueResult {
  const textRoot = path.resolve(options.textRoot ?? DEFAULT_TEXT_ROOT);
  const metadataRoot = path.resolve(options.metadataRoot ?? DEFAULT_METADATA_ROOT);
  const approvedPeoplePath = path.resolve(
    options.approvedPeoplePath ?? DEFAULT_APPROVED_PEOPLE_PATH,
  );
  const generatedRoot = path.resolve(options.generatedRoot ?? DEFAULT_GENERATED_ROOT);
  const reviewRoot = path.resolve(options.reviewRoot ?? path.join(generatedRoot, "review"));
  const warnings: string[] = [];
  const fatalErrors: string[] = [];

  if (!fs.existsSync(path.join(generatedRoot, "review-report.json"))) {
    warnings.push(
      "Generated review-report.json was not found; building workflow from metadata and per-book rights reports only.",
    );
  }

  const approvedPeopleResult = loadApprovedPeopleMetadata(approvedPeoplePath);
  fatalErrors.push(...approvedPeopleResult.errors);
  const metadataResult = loadMetadataEntries(textRoot, metadataRoot);
  fatalErrors.push(...metadataResult.errors);
  const rightsResult = loadRightsReportEntries({
    metadataEntries: metadataResult.entries,
    generatedRoot,
  });
  fatalErrors.push(...rightsResult.errors);

  if (fatalErrors.length > 0) {
    const result = emptyResult({
      metadataRoot,
      generatedRoot,
      reviewRoot,
      warnings,
      fatalErrors,
    });
    if (!options.quiet) printSummary(result);
    return result;
  }

  const duplicateGroupsResult = duplicateGroups(metadataResult.entries);
  const duplicatesBySlug = duplicateLookup(duplicateGroupsResult);
  const books = rightsResult.entries.map((entry) =>
    reviewQueueBookFor({
      entry,
      approvedPeople: approvedPeopleResult.people,
      generatedRoot,
      duplicateGroup: duplicatesBySlug.get(entry.metadataEntry.metadata.slug) ?? null,
    }),
  );
  const peopleReviewQueue = buildPeopleReviewQueue({
    books,
    approvedPeople: approvedPeopleResult.people,
  });
  const duplicateGutenbergReview = buildDuplicateGutenbergReview(
    duplicateGroupsResult,
  );
  const approvalCandidates = buildApprovalCandidates(books);
  const reviewQueue = buildReviewQueueReport({
    books,
    metadataRoot,
    generatedRoot,
    approvalCandidates,
  });
  const rejectedBooks = buildRejectedBooks(books);

  const paths = {
    reviewQueueJson: path.join(reviewRoot, "review-queue.json"),
    reviewQueueMarkdown: path.join(reviewRoot, "review-queue.md"),
    peopleReviewQueueJson: path.join(reviewRoot, "people-review-queue.json"),
    peopleReviewQueueMarkdown: path.join(reviewRoot, "people-review-queue.md"),
    duplicateGutenbergReviewJson: path.join(
      reviewRoot,
      "duplicate-gutenberg-review.json",
    ),
    duplicateGutenbergReviewMarkdown: path.join(
      reviewRoot,
      "duplicate-gutenberg-review.md",
    ),
    approvalCandidatesJson: path.join(reviewRoot, "approval-candidates.json"),
    rejectedBooksMarkdown: path.join(reviewRoot, "rejected-books.md"),
  };

  writeJsonIfChanged(paths.reviewQueueJson, reviewQueue);
  writeTextIfChanged(paths.reviewQueueMarkdown, buildReviewQueueMarkdown(reviewQueue));
  writeJsonIfChanged(paths.peopleReviewQueueJson, peopleReviewQueue);
  writeTextIfChanged(
    paths.peopleReviewQueueMarkdown,
    buildPeopleReviewMarkdown(peopleReviewQueue),
  );
  writeJsonIfChanged(paths.duplicateGutenbergReviewJson, duplicateGutenbergReview);
  writeTextIfChanged(
    paths.duplicateGutenbergReviewMarkdown,
    buildDuplicateMarkdown(duplicateGutenbergReview),
  );
  writeJsonIfChanged(paths.approvalCandidatesJson, approvalCandidates);
  writeTextIfChanged(paths.rejectedBooksMarkdown, buildRejectedBooksMarkdown(rejectedBooks));

  const result: GenerateBookReviewQueueResult = {
    reviewQueue,
    peopleReviewQueue,
    duplicateGutenbergReview,
    approvalCandidates,
    rejectedBooks,
    reviewRoot,
    paths,
    warnings,
    fatalErrors,
  };
  if (!options.quiet) printSummary(result);
  return result;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === invokedPath) {
  const result = generateBookReviewQueue();
  if (result.fatalErrors.length > 0) {
    process.exitCode = 1;
  }
}
