import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type {
  ApprovedPeopleMetadata,
  BookCleanupRule,
  BookMetadata,
  BookRightsReport,
  BookRightsRiskLevel,
  BookCanadaUsV1Status,
} from "./bookManifestTypes.ts";
import { BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";
import {
  buildDuplicateSlugResolutionMap,
  type DuplicateSlugResolution,
} from "./bookDuplicateResolution.ts";
import {
  loadOwnerBookApprovals,
  ownerBookApprovalMap,
} from "./bookApprovalFiles.ts";
import {
  buildBookRightsReport,
  loadApprovedPeopleMetadata,
  validateBookRights,
} from "./bookRightsValidation.ts";
import { cleanGutenbergText } from "./clean-gutenberg.ts";
import { trimBookText } from "./bookTextNormalization.ts";

type MetadataEntry = {
  filePath: string;
  relativePath: string;
  metadata: BookMetadata;
  rawPath: string;
  rawRelativePath: string;
};

type DuplicateParticipant = {
  slug: string;
  title: string;
  author: string[];
  metadataFile: string;
  rawTextFile: string;
  allowDuplicateGutenbergId: boolean;
  duplicateReason: string | null;
};

type DuplicateGutenbergReview = {
  gutenbergId: string;
  participants: DuplicateParticipant[];
};

type BookRightsReviewEntry = {
  slug: string;
  title: string;
  author: string[];
  metadataFile: string;
  rawTextFile: string;
  metadataStatus: BookMetadata["metadataStatus"] | null;
  manualReviewRequired: boolean;
  rightsReviewed: boolean;
  rightsBasis: BookMetadata["source"]["rightsBasis"];
  gutenbergId: string | null;
  sourceUrl: string | null;
  canadaUsV1Status: BookCanadaUsV1Status;
  processingAllowed: boolean;
  publishReady: boolean;
  approvalSource: BookRightsReport["approval_source"];
  duplicateResolutionSource: BookRightsReport["duplicate_resolution_source"];
  authorDeathYear: number | null;
  translator: string;
  translatorDeathYear: number | null;
  originalPublication: string;
  releaseDate: string;
  lastUpdated: string;
  risks: {
    translation: BookRightsRiskLevel;
    edition: BookRightsRiskLevel;
    trademarkOrCharacterBrand: BookRightsRiskLevel;
    contentBrandSafety: BookRightsRiskLevel;
    laterCopyrightNotice: boolean;
    permissionBasedLanguage: boolean;
    creativeCommonsNotice: boolean;
    modernIntroOrNotes: boolean;
    transcriberNotes: boolean;
    illustrationOrImageReferences: boolean;
  };
  nextAction: string;
  rightsReportPath: string;
  processingNotesPath: string;
};

export type BookRightsBatchReviewReport = {
  schemaVersion: 1;
  totalMetadataBooks: number;
  statusCounts: {
    approved: number;
    needsManualReview: number;
    rejected: number;
  };
  processingAllowed: number;
  processingBlocked: number;
  publishReady: number;
  missingAuthorDeathYear: number;
  missingTranslatorDeathYearOrStatus: number;
  missingOriginalPublication: number;
  duplicateGutenbergIds: DuplicateGutenbergReview[];
  riskCounts: {
    laterCopyrightOrPermission: number;
    translationRisk: number;
    introEditorAnnotationRisk: number;
    illustrationImageRisk: number;
    contentBrandSafetyRisk: number;
    creativeCommons: number;
  };
  sourceUrlCoverage: {
    withSourceUrl: number;
    missingSourceUrl: number;
  };
  books: BookRightsReviewEntry[];
};

export type GenerateBookRightsReportOptions = {
  repoRoot?: string;
  textRoot?: string;
  metadataRoot?: string;
  approvedPeoplePath?: string;
  bookApprovalsPath?: string;
  generatedRoot?: string;
  quiet?: boolean;
};

export type GenerateBookRightsReportResult = {
  report: BookRightsBatchReviewReport;
  generatedRoot: string;
  reviewReportJsonPath: string;
  reviewReportMarkdownPath: string;
  rightsReports: string[];
  processingNotes: string[];
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
const DEFAULT_BOOK_APPROVALS_PATH = path.join(
  DEFAULT_TEXT_ROOT,
  "approved-metadata",
  "book-approvals.json",
);
const DEFAULT_GENERATED_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/generated",
);

const DRAFT_REVIEW_REASON =
  "Draft or manual-review metadata must be reviewed before processing or publishing.";
const DUPLICATE_REVIEW_REASON =
  "Duplicate Gutenberg ID requires explicit review before processing or publishing.";

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortByPath(paths: string[]): string[] {
  return [...paths].sort((left, right) =>
    compareText(toPosixPath(left), toPosixPath(right)),
  );
}

function relativeTo(root: string, filePath: string): string {
  return toPosixPath(path.relative(root, filePath));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findFiles(root: string, extension: string): string[] {
  if (!fs.existsSync(root)) return [];

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
        files.push(entryPath);
      }
    }
  };

  walk(root);
  return sortByPath(files);
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

function validateString(
  value: unknown,
  pathLabel: string,
  errors: string[],
  allowEmpty = false,
): asserts value is string {
  if (typeof value !== "string" || (!allowEmpty && value.trim() === "")) {
    errors.push(`${pathLabel} must be a ${allowEmpty ? "string" : "non-empty string"}.`);
  }
}

function validateStringArray(
  value: unknown,
  pathLabel: string,
  errors: string[],
): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`${pathLabel} must be an array of strings.`);
  }
}

function validateMetadataShape(
  raw: unknown,
  filePath: string,
): { metadata: BookMetadata | null; errors: string[] } {
  const errors: string[] = [];
  if (!isPlainObject(raw)) {
    return { metadata: null, errors: [`${path.basename(filePath)}: metadata must be an object.`] };
  }

  validateString(raw.slug, "slug", errors);
  if (typeof raw.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug)) {
    errors.push("slug must be lowercase kebab-case.");
  }
  if (
    raw.metadataStatus !== undefined &&
    raw.metadataStatus !== "draft" &&
    raw.metadataStatus !== "reviewed"
  ) {
    errors.push("metadataStatus must be draft or reviewed when present.");
  }
  if (
    raw.manualReviewRequired !== undefined &&
    typeof raw.manualReviewRequired !== "boolean"
  ) {
    errors.push("manualReviewRequired must be a boolean when present.");
  }
  validateString(raw.title, "title", errors);
  validateStringArray(raw.author, "author", errors);
  validateString(raw.language, "language", errors);
  validateString(raw.description, "description", errors, true);
  validateStringArray(raw.subjects, "subjects", errors);

  if (
    raw.originalPublicationYear !== null &&
    typeof raw.originalPublicationYear !== "number"
  ) {
    errors.push("originalPublicationYear must be a number or null.");
  }

  if (!isPlainObject(raw.source)) {
    errors.push("source must be an object.");
  } else {
    validateString(raw.source.provider, "source.provider", errors);
    const gutenbergIdType = typeof raw.source.gutenbergId;
    if (
      raw.source.gutenbergId !== null &&
      gutenbergIdType !== "string" &&
      gutenbergIdType !== "number"
    ) {
      errors.push("source.gutenbergId must be a string, number, or null.");
    }
    if (
      (gutenbergIdType === "string" || gutenbergIdType === "number") &&
      !/^\d+$/.test(String(raw.source.gutenbergId))
    ) {
      errors.push("source.gutenbergId must contain only digits when present.");
    }
    if (
      raw.source.sourceUrl !== undefined &&
      raw.source.sourceUrl !== null &&
      typeof raw.source.sourceUrl !== "string"
    ) {
      errors.push("source.sourceUrl must be a string or null when present.");
    }
    validateString(raw.source.rawTextFile, "source.rawTextFile", errors);
    if (
      typeof raw.source.rawTextFile === "string" &&
      path.isAbsolute(raw.source.rawTextFile)
    ) {
      errors.push("source.rawTextFile must be a relative path.");
    }
    if (
      raw.source.releaseDate !== null &&
      typeof raw.source.releaseDate !== "string"
    ) {
      errors.push("source.releaseDate must be a string or null.");
    }
    if (
      raw.source.rawTextUrl !== undefined &&
      raw.source.rawTextUrl !== null &&
      typeof raw.source.rawTextUrl !== "string"
    ) {
      errors.push("source.rawTextUrl must be a string or null when present.");
    }
    validateString(raw.source.rightsBasis, "source.rightsBasis", errors);
    if (typeof raw.source.rightsReviewed !== "boolean") {
      errors.push("source.rightsReviewed must be a boolean.");
    }
    validateString(raw.source.rightsNotes, "source.rightsNotes", errors, true);
  }

  if (!isPlainObject(raw.cover)) {
    errors.push("cover must be an object.");
  }
  if (!isPlainObject(raw.defaults)) {
    errors.push("defaults must be an object.");
  }
  if (!Array.isArray(raw.sectionOverrides)) {
    errors.push("sectionOverrides must be an array.");
  }
  if (!Array.isArray(raw.cleanupRules)) {
    errors.push("cleanupRules must be an array.");
  }

  if (errors.length > 0) {
    return {
      metadata: null,
      errors: errors.map((error) => `${path.basename(filePath)}: ${error}`),
    };
  }

  const source = raw.source as Record<string, unknown>;
  const metadata: BookMetadata = {
    ...(raw as BookMetadata),
    source: {
      ...((raw as BookMetadata).source),
      gutenbergId:
        source.gutenbergId === null || source.gutenbergId === undefined
          ? null
          : String(source.gutenbergId),
    },
  };

  return { metadata, errors: [] };
}

function isInside(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function resolveRawTextPath(
  textRoot: string,
  metadataPath: string,
  metadata: BookMetadata,
): string {
  const rawPath = path.resolve(
    path.dirname(metadataPath),
    metadata.source.rawTextFile,
  );
  if (rawPath !== textRoot && !isInside(textRoot, rawPath)) {
    throw new Error(
      `${metadata.slug}: source.rawTextFile must resolve inside ${textRoot}.`,
    );
  }
  return rawPath;
}

function loadMetadataEntries(
  textRoot: string,
  metadataRoot: string,
): { entries: MetadataEntry[]; errors: string[] } {
  const entries: MetadataEntry[] = [];
  const errors: string[] = [];
  const metadataFiles = findFiles(metadataRoot, ".json");

  for (const filePath of metadataFiles) {
    try {
      const { metadata, errors: shapeErrors } = validateMetadataShape(
        readJson(filePath),
        filePath,
      );
      errors.push(...shapeErrors);
      if (!metadata) continue;
      const rawPath = resolveRawTextPath(textRoot, filePath, metadata);
      if (!fs.existsSync(rawPath) || !fs.statSync(rawPath).isFile()) {
        errors.push(`${metadata.slug}: raw text file is missing: ${rawPath}.`);
        continue;
      }
      entries.push({
        filePath,
        relativePath: relativeTo(textRoot, filePath),
        metadata,
        rawPath,
        rawRelativePath: relativeTo(textRoot, rawPath),
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  entries.sort((left, right) => compareText(left.metadata.slug, right.metadata.slug));
  return { entries, errors };
}

function applyCleanupRules(
  input: string,
  rules: BookCleanupRule[],
  warnings: string[],
): string {
  return rules.reduce((text, rule) => {
    try {
      const flags = rule.flags ?? (rule.type === "replace" ? "g" : "");
      const pattern = new RegExp(rule.pattern, flags);
      if (rule.type === "replace") {
        return text.replace(pattern, rule.replacement ?? "");
      }
      if (rule.type === "remove-line-matching") {
        return text
          .split("\n")
          .filter((line) => !pattern.test(line))
          .join("\n");
      }
    } catch (error) {
      warnings.push(
        `Cleanup rule failed: ${error instanceof Error ? error.message : "unknown error"}.`,
      );
    }
    return text;
  }, input);
}

function duplicateGroups(entries: MetadataEntry[]): DuplicateGutenbergReview[] {
  const groups = new Map<string, DuplicateParticipant[]>();
  for (const entry of entries) {
    const id = entry.metadata.source.gutenbergId;
    if (!id) continue;
    const participants = groups.get(id) ?? [];
    participants.push({
      slug: entry.metadata.slug,
      title: entry.metadata.title,
      author: entry.metadata.author,
      metadataFile: entry.relativePath,
      rawTextFile: entry.rawRelativePath,
      allowDuplicateGutenbergId:
        entry.metadata.source.allowDuplicateGutenbergId === true,
      duplicateReason: entry.metadata.source.duplicateReason ?? null,
    });
    groups.set(id, participants);
  }

  return [...groups.entries()]
    .filter(([, participants]) => participants.length > 1)
    .map(([gutenbergId, participants]) => ({
      gutenbergId,
      participants: participants.sort((left, right) =>
        compareText(left.slug, right.slug),
      ),
    }))
    .sort((left, right) => compareText(left.gutenbergId, right.gutenbergId));
}

function duplicateIdsNeedingReview(
  duplicates: DuplicateGutenbergReview[],
  duplicateResolutions: Map<string, DuplicateSlugResolution> = new Map(),
): Set<string> {
  return new Set(
    duplicates
      .filter((group) =>
        group.participants.some((participant) => {
          const resolution = duplicateResolutions.get(participant.slug);
          return (
            !resolution ||
            resolution.duplicateResolutionSource === "manual-review"
          );
        }),
      )
      .map((group) => group.gutenbergId),
  );
}

function appendReason(summary: string, reason: string): string {
  return summary.includes(reason)
    ? summary
    : [summary.trim(), reason].filter(Boolean).join(" ");
}

function forceManualReview(
  report: BookRightsReport,
  reason: string,
  duplicateResolution?: DuplicateSlugResolution,
): BookRightsReport {
  if (report.canada_us_v1_status === "reject") {
    return {
      ...report,
      approval_source: "manual-review",
      duplicate_resolution_source:
        duplicateResolution?.duplicateResolutionSource ??
        report.duplicate_resolution_source,
      processing_allowed: false,
      reasoning_summary: appendReason(report.reasoning_summary, reason),
    };
  }

  return {
    ...report,
    approval_source: "manual-review",
    duplicate_resolution_source:
      duplicateResolution?.duplicateResolutionSource ??
      report.duplicate_resolution_source,
    canada_us_v1_status: "needs_manual_review",
    processing_allowed: false,
    reasoning_summary: appendReason(report.reasoning_summary, reason),
  };
}

function maybeApplyMetadataReviewLocks(
  metadata: BookMetadata,
  report: BookRightsReport,
  duplicateReviewIds: Set<string>,
  duplicateResolution: DuplicateSlugResolution | null,
): BookRightsReport {
  let nextReport = report;
  const fileEvidenceApproved =
    nextReport.approval_source === "file-evidence" &&
    nextReport.canada_us_v1_status === "approved" &&
    nextReport.processing_allowed;
  if (
    !fileEvidenceApproved &&
    (metadata.metadataStatus === "draft" || metadata.manualReviewRequired === true)
  ) {
    nextReport = forceManualReview(nextReport, DRAFT_REVIEW_REASON);
  }
  if (duplicateResolution) {
    nextReport = {
      ...nextReport,
      duplicate_resolution_source:
        duplicateResolution.duplicateResolutionSource,
    };
    if (!duplicateResolution.isEligible) {
      return forceManualReview(nextReport, duplicateResolution.reason, duplicateResolution);
    }
  }
  if (
    metadata.source.gutenbergId &&
    duplicateReviewIds.has(metadata.source.gutenbergId)
  ) {
    nextReport = forceManualReview(nextReport, DUPLICATE_REVIEW_REASON);
  }
  return nextReport;
}

function hasRisk(risk: BookRightsRiskLevel): boolean {
  return risk === "medium" || risk === "high";
}

function nextActionFor(
  metadata: BookMetadata,
  report: BookRightsReport,
  duplicateReviewIds: Set<string>,
): string {
  if (report.canada_us_v1_status === "approved" && report.processing_allowed) {
    return "Keep rights evidence attached; only publish after an explicit product approval step.";
  }
  if (report.canada_us_v1_status === "reject") {
    return "Do not process for public use. Resolve copyright, permission, source, or license blockers first.";
  }
  if (
    report.duplicate_resolution_source === "deterministic-file-match" &&
    !report.processing_allowed
  ) {
    return "Keep this duplicate alternate blocked; the deterministic file match selected the canonical normalized-title slug.";
  }
  if (
    metadata.source.gutenbergId &&
    duplicateReviewIds.has(metadata.source.gutenbergId)
  ) {
    return "Review duplicate Gutenberg ID participants and add an explicit duplicate reason only if intentional.";
  }
  if (report.author_death_year === null) {
    return "Add approved author death-year evidence or keep the book blocked.";
  }
  if (report.is_translation && report.translator_death_year === null) {
    return "Identify translator status and approved death-year evidence before any processing.";
  }
  if (!report.original_publication) {
    return "Add original publication evidence before approval.";
  }
  return "Manual rights review required before processing or publishing.";
}

function buildProcessingNotes({
  metadata,
  report,
  cleaningWarnings,
  rightsWarnings,
  duplicateReviewIds,
}: {
  metadata: BookMetadata;
  report: BookRightsReport;
  cleaningWarnings: string[];
  rightsWarnings: string[];
  duplicateReviewIds: Set<string>;
}): string {
  const manualReasons =
    report.canada_us_v1_status === "approved"
      ? ["No manual review blockers from the current rights gate."]
      : report.reasoning_summary
          .split(/(?<=\.)\s+/)
          .map((reason) => reason.trim())
          .filter(Boolean);
  const evidence =
    report.evidence_snippets.length > 0
      ? report.evidence_snippets.map((snippet) => `- ${snippet}`).join("\n")
      : "- No specific source snippets were captured.";
  const warnings = [...cleaningWarnings, ...rightsWarnings];

  return [
    `# ${metadata.title} rights review notes`,
    "",
    `- Source file: ${metadata.source.rawTextFile}`,
    `- Gutenberg ID: ${metadata.source.gutenbergId ?? "missing"}`,
    `- Source URL: ${report.source_url ?? "missing"}`,
    `- Metadata status: ${metadata.metadataStatus ?? "unspecified"}`,
    `- Manual review required: ${metadata.manualReviewRequired ? "yes" : "no"}`,
    `- Approval status: ${report.canada_us_v1_status}`,
    `- Approval source: ${report.approval_source}`,
    `- Duplicate resolution source: ${report.duplicate_resolution_source}`,
    `- Processing allowed: ${report.processing_allowed ? "yes" : "no"}`,
    "- processed_book.json emitted: no",
    "- Section/story artifacts emitted by rights-only command: no",
    "",
    "## Rights evidence found",
    "",
    evidence,
    "",
    "## Source clues",
    "",
    `- Project Gutenberg header present: ${report.gutenberg_header_present ? "yes" : "no"}`,
    `- Project Gutenberg license present: ${report.project_gutenberg_license_present ? "yes" : "no"}`,
    `- U.S. reuse language found: ${report.us_reuse_language_found ? "yes" : "no"}`,
    `- Non-U.S. warning found: ${report.non_us_warning_found ? "yes" : "no"}`,
    `- Release date: ${report.release_date || "missing"}`,
    `- Last updated: ${report.last_updated || "missing"}`,
    `- Original publication: ${report.original_publication || "missing"}`,
    `- Credits: ${report.credits || "missing"}`,
    `- Translator: ${report.translator || "none found"}`,
    `- Illustrator: ${report.illustrator || "none found"}`,
    `- Editor: ${report.editor || "none found"}`,
    `- Introduction author: ${report.introduction_author || "none found"}`,
    "",
    "## Risks found",
    "",
    `- Translation risk: ${report.translation_risk}`,
    `- Edition risk: ${report.edition_risk}`,
    `- Trademark or character brand risk: ${report.trademark_or_character_brand_risk}`,
    `- Content brand-safety risk: ${report.content_brand_safety_risk}`,
    `- Later copyright notice: ${report.contains_later_copyright_notice ? "yes" : "no"}`,
    `- Permission-based language: ${report.contains_permission_based_language ? "yes" : "no"}`,
    `- Creative Commons notice: ${report.contains_creative_commons_license ? "yes" : "no"}`,
    `- Modern intro or notes: ${report.contains_modern_intro_or_notes ? "yes" : "no"}`,
    `- Transcriber notes: ${report.contains_transcriber_notes ? "yes" : "no"}`,
    `- Illustration or image references: ${report.contains_illustrations_or_image_references ? "yes" : "no"}`,
    metadata.source.gutenbergId && duplicateReviewIds.has(metadata.source.gutenbergId)
      ? `- Duplicate Gutenberg ID: ${metadata.source.gutenbergId}`
      : "- Duplicate Gutenberg ID: no unresolved duplicate found",
    "",
    "## Command warnings",
    "",
    warnings.length > 0
      ? warnings.map((warning) => `- ${warning}`).join("\n")
      : "- No command warnings.",
    "",
    "## Manual review reasons",
    "",
    manualReasons.map((reason) => `- ${reason}`).join("\n"),
    "",
    "## Next action",
    "",
    `- ${nextActionFor(metadata, report, duplicateReviewIds)}`,
    "",
  ].join("\n");
}

function reviewEntryFor({
  entry,
  report,
  rights,
  generatedRoot,
  duplicateReviewIds,
}: {
  entry: MetadataEntry;
  report: BookRightsReport;
  rights: ReturnType<typeof validateBookRights>;
  generatedRoot: string;
  duplicateReviewIds: Set<string>;
}): BookRightsReviewEntry {
  const rightsReportPath = path.join(
    generatedRoot,
    entry.metadata.slug,
    "rights_report.json",
  );
  const processingNotesPath = path.join(
    generatedRoot,
    entry.metadata.slug,
    "processing_notes.md",
  );

  return {
    slug: entry.metadata.slug,
    title: entry.metadata.title,
    author: entry.metadata.author,
    metadataFile: entry.relativePath,
    rawTextFile: entry.rawRelativePath,
    metadataStatus: entry.metadata.metadataStatus ?? null,
    manualReviewRequired: entry.metadata.manualReviewRequired === true,
    rightsReviewed: entry.metadata.source.rightsReviewed,
    rightsBasis: entry.metadata.source.rightsBasis,
    gutenbergId: entry.metadata.source.gutenbergId,
    sourceUrl: report.source_url,
    canadaUsV1Status: report.canada_us_v1_status,
    processingAllowed: report.processing_allowed,
    publishReady: rights.publishReady,
    approvalSource: report.approval_source,
    duplicateResolutionSource: report.duplicate_resolution_source,
    authorDeathYear: report.author_death_year,
    translator: report.translator,
    translatorDeathYear: report.translator_death_year,
    originalPublication: report.original_publication,
    releaseDate: report.release_date,
    lastUpdated: report.last_updated,
    risks: {
      translation: report.translation_risk,
      edition: report.edition_risk,
      trademarkOrCharacterBrand: report.trademark_or_character_brand_risk,
      contentBrandSafety: report.content_brand_safety_risk,
      laterCopyrightNotice: report.contains_later_copyright_notice,
      permissionBasedLanguage: report.contains_permission_based_language,
      creativeCommonsNotice: report.contains_creative_commons_license,
      modernIntroOrNotes: report.contains_modern_intro_or_notes,
      transcriberNotes: report.contains_transcriber_notes,
      illustrationOrImageReferences:
        report.contains_illustrations_or_image_references,
    },
    nextAction: nextActionFor(entry.metadata, report, duplicateReviewIds),
    rightsReportPath: relativeTo(generatedRoot, rightsReportPath),
    processingNotesPath: relativeTo(generatedRoot, processingNotesPath),
  };
}

function buildBatchReport({
  entries,
  bookReviews,
  duplicates,
}: {
  entries: MetadataEntry[];
  bookReviews: BookRightsReviewEntry[];
  duplicates: DuplicateGutenbergReview[];
}): BookRightsBatchReviewReport {
  const statusCounts = {
    approved: bookReviews.filter((book) => book.canadaUsV1Status === "approved").length,
    needsManualReview: bookReviews.filter(
      (book) => book.canadaUsV1Status === "needs_manual_review",
    ).length,
    rejected: bookReviews.filter((book) => book.canadaUsV1Status === "reject").length,
  };
  const sourceUrlCoverage = {
    withSourceUrl: bookReviews.filter((book) => book.sourceUrl !== null).length,
    missingSourceUrl: bookReviews.filter((book) => book.sourceUrl === null).length,
  };

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    totalMetadataBooks: entries.length,
    statusCounts,
    processingAllowed: bookReviews.filter((book) => book.processingAllowed).length,
    processingBlocked: bookReviews.filter((book) => !book.processingAllowed).length,
    publishReady: bookReviews.filter((book) => book.publishReady).length,
    missingAuthorDeathYear: bookReviews.filter(
      (book) => book.authorDeathYear === null,
    ).length,
    missingTranslatorDeathYearOrStatus: bookReviews.filter(
      (book) => book.translator !== "" && book.translatorDeathYear === null,
    ).length,
    missingOriginalPublication: bookReviews.filter(
      (book) => book.originalPublication === "",
    ).length,
    duplicateGutenbergIds: duplicates,
    riskCounts: {
      laterCopyrightOrPermission: bookReviews.filter(
        (book) =>
          book.risks.laterCopyrightNotice || book.risks.permissionBasedLanguage,
      ).length,
      translationRisk: bookReviews.filter((book) =>
        hasRisk(book.risks.translation),
      ).length,
      introEditorAnnotationRisk: bookReviews.filter(
        (book) => book.risks.modernIntroOrNotes || book.risks.edition !== "none",
      ).length,
      illustrationImageRisk: bookReviews.filter(
        (book) => book.risks.illustrationOrImageReferences,
      ).length,
      contentBrandSafetyRisk: bookReviews.filter((book) =>
        hasRisk(book.risks.contentBrandSafety),
      ).length,
      creativeCommons: bookReviews.filter(
        (book) => book.risks.creativeCommonsNotice,
      ).length,
    },
    sourceUrlCoverage,
    books: bookReviews.sort((left, right) => compareText(left.slug, right.slug)),
  };
}

function buildBatchMarkdown(report: BookRightsBatchReviewReport): string {
  const duplicateLines =
    report.duplicateGutenbergIds.length > 0
      ? report.duplicateGutenbergIds
          .map(
            (group) =>
              `- ${group.gutenbergId}: ${group.participants
                .map(
                  (participant) =>
                    `${participant.slug} (${participant.rawTextFile})`,
                )
                .join(", ")}`,
          )
          .join("\n")
      : "- No duplicate Gutenberg IDs found.";
  const bookLines = report.books
    .map(
      (book) =>
        `- ${book.slug}: ${book.canadaUsV1Status}; processing ${
          book.processingAllowed ? "allowed" : "blocked"
        }; approval source ${book.approvalSource}; next: ${book.nextAction}`,
    )
    .join("\n");

  return [
    "# Morse book rights review report",
    "",
    `- Metadata books: ${report.totalMetadataBooks}`,
    `- Approved: ${report.statusCounts.approved}`,
    `- Needs manual review: ${report.statusCounts.needsManualReview}`,
    `- Rejected: ${report.statusCounts.rejected}`,
    `- Processing allowed: ${report.processingAllowed}`,
    `- Processing blocked: ${report.processingBlocked}`,
    `- Publish-ready: ${report.publishReady}`,
    `- Missing author death year: ${report.missingAuthorDeathYear}`,
    `- Missing translator death year or status: ${report.missingTranslatorDeathYearOrStatus}`,
    `- Missing original publication: ${report.missingOriginalPublication}`,
    `- Source URLs present: ${report.sourceUrlCoverage.withSourceUrl}`,
    `- Source URLs missing: ${report.sourceUrlCoverage.missingSourceUrl}`,
    "",
    "## Risk counts",
    "",
    `- Later copyright or permission: ${report.riskCounts.laterCopyrightOrPermission}`,
    `- Translation risk: ${report.riskCounts.translationRisk}`,
    `- Intro/editor/annotation risk: ${report.riskCounts.introEditorAnnotationRisk}`,
    `- Illustration/image risk: ${report.riskCounts.illustrationImageRisk}`,
    `- Content brand-safety risk: ${report.riskCounts.contentBrandSafetyRisk}`,
    `- Creative Commons: ${report.riskCounts.creativeCommons}`,
    "",
    "## Duplicate Gutenberg IDs",
    "",
    duplicateLines,
    "",
    "## Next Action Per Book",
    "",
    bookLines,
    "",
  ].join("\n");
}

function printSummary(result: GenerateBookRightsReportResult): void {
  const { report, generatedRoot, rightsReports, processingNotes, warnings, fatalErrors } =
    result;
  console.log("Morse book rights report batch");
  console.log(`Metadata books: ${report.totalMetadataBooks}`);
  console.log(`Rights reports: ${rightsReports.length}`);
  console.log(`Processing notes: ${processingNotes.length}`);
  console.log(`Approved: ${report.statusCounts.approved}`);
  console.log(`Needs manual review: ${report.statusCounts.needsManualReview}`);
  console.log(`Rejected: ${report.statusCounts.rejected}`);
  console.log(`Processing allowed: ${report.processingAllowed}`);
  console.log(`Duplicate Gutenberg IDs: ${report.duplicateGutenbergIds.length}`);
  console.log(`Generated output: ${toPosixPath(generatedRoot)}`);

  if (report.duplicateGutenbergIds.length > 0) {
    console.log("\nDuplicate Gutenberg IDs:");
    for (const duplicate of report.duplicateGutenbergIds) {
      console.log(
        `- ${duplicate.gutenbergId}: ${duplicate.participants
          .map((participant) => `${participant.slug} (${participant.rawTextFile})`)
          .join(", ")}`,
      );
    }
  }

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of warnings.slice(0, 24)) {
      console.log(`- ${warning}`);
    }
    if (warnings.length > 24) {
      console.log(`- ... ${warnings.length - 24} more warnings`);
    }
  }

  if (fatalErrors.length > 0) {
    console.error("\nFatal errors:");
    for (const error of fatalErrors) {
      console.error(`- ${error}`);
    }
  }
}

export function generateBookRightsReports(
  options: GenerateBookRightsReportOptions = {},
): GenerateBookRightsReportResult {
  const textRoot = path.resolve(options.textRoot ?? DEFAULT_TEXT_ROOT);
  const metadataRoot = path.resolve(options.metadataRoot ?? DEFAULT_METADATA_ROOT);
  const approvedPeoplePath = path.resolve(
    options.approvedPeoplePath ?? DEFAULT_APPROVED_PEOPLE_PATH,
  );
  const bookApprovalsPath = path.resolve(
    options.bookApprovalsPath ?? DEFAULT_BOOK_APPROVALS_PATH,
  );
  const generatedRoot = path.resolve(options.generatedRoot ?? DEFAULT_GENERATED_ROOT);
  const warnings: string[] = [];
  const fatalErrors: string[] = [];
  const rightsReports: string[] = [];
  const processingNotes: string[] = [];

  const approvedPeopleResult = loadApprovedPeopleMetadata(approvedPeoplePath);
  const bookApprovalsResult = loadOwnerBookApprovals(bookApprovalsPath);
  const bookApprovals = ownerBookApprovalMap(bookApprovalsResult.entries);
  fatalErrors.push(...approvedPeopleResult.errors);
  fatalErrors.push(...bookApprovalsResult.errors);
  warnings.push(...bookApprovalsResult.warnings);
  const { entries, errors } = loadMetadataEntries(textRoot, metadataRoot);
  fatalErrors.push(...errors);
  const slugCounts = new Map<string, number>();
  for (const entry of entries) {
    slugCounts.set(entry.metadata.slug, (slugCounts.get(entry.metadata.slug) ?? 0) + 1);
  }
  for (const [slug, count] of slugCounts.entries()) {
    if (count > 1) fatalErrors.push(`Duplicate metadata slug: ${slug}.`);
  }

  if (fatalErrors.length > 0) {
    const emptyReport: BookRightsBatchReviewReport = {
      schemaVersion: BOOK_SCHEMA_VERSION,
      totalMetadataBooks: entries.length,
      statusCounts: { approved: 0, needsManualReview: 0, rejected: 0 },
      processingAllowed: 0,
      processingBlocked: entries.length,
      publishReady: 0,
      missingAuthorDeathYear: 0,
      missingTranslatorDeathYearOrStatus: 0,
      missingOriginalPublication: 0,
      duplicateGutenbergIds: [],
      riskCounts: {
        laterCopyrightOrPermission: 0,
        translationRisk: 0,
        introEditorAnnotationRisk: 0,
        illustrationImageRisk: 0,
        contentBrandSafetyRisk: 0,
        creativeCommons: 0,
      },
      sourceUrlCoverage: { withSourceUrl: 0, missingSourceUrl: 0 },
      books: [],
    };
    const result: GenerateBookRightsReportResult = {
      report: emptyReport,
      generatedRoot,
      reviewReportJsonPath: path.join(generatedRoot, "review-report.json"),
      reviewReportMarkdownPath: path.join(generatedRoot, "review-report.md"),
      rightsReports,
      processingNotes,
      warnings,
      fatalErrors,
    };
    if (!options.quiet) printSummary(result);
    return result;
  }

  const duplicates = duplicateGroups(entries);
  const duplicateResolutions = buildDuplicateSlugResolutionMap(
    entries.map((entry) => ({
      slug: entry.metadata.slug,
      title: entry.metadata.title,
      author: entry.metadata.author,
      gutenbergId: entry.metadata.source.gutenbergId,
      rawTextFile: entry.rawRelativePath,
      metadataFile: entry.relativePath,
      allowDuplicateGutenbergId: entry.metadata.source.allowDuplicateGutenbergId,
      duplicateReason: entry.metadata.source.duplicateReason ?? null,
    })),
  );
  const duplicateReviewIds = duplicateIdsNeedingReview(
    duplicates,
    duplicateResolutions,
  );
  const bookReviews: BookRightsReviewEntry[] = [];

  for (const entry of entries) {
    const rawText = fs.readFileSync(entry.rawPath, "utf8");
    const cleaning = cleanGutenbergText(rawText);
    const bookWarnings = [...cleaning.report.warnings];
    const cleanedText = trimBookText(
      applyCleanupRules(
        cleaning.cleanedText,
        entry.metadata.cleanupRules,
        bookWarnings,
      ),
    );
    const baseReport = buildBookRightsReport({
      metadata: entry.metadata,
      rawText,
      cleanedText,
      cleaning: cleaning.report,
      approvedPeople: approvedPeopleResult.people as ApprovedPeopleMetadata,
      ownerBookApproval: bookApprovals.get(entry.metadata.slug) ?? null,
    });
    const report = maybeApplyMetadataReviewLocks(
      entry.metadata,
      baseReport,
      duplicateReviewIds,
      duplicateResolutions.get(entry.metadata.slug) ?? null,
    );
    const rights = validateBookRights(entry.metadata, report);
    const bookRoot = path.join(generatedRoot, entry.metadata.slug);
    const rightsReportPath = path.join(bookRoot, "rights_report.json");
    const processingNotesPath = path.join(bookRoot, "processing_notes.md");
    const notes = buildProcessingNotes({
      metadata: entry.metadata,
      report,
      cleaningWarnings: bookWarnings,
      rightsWarnings: rights.warnings,
      duplicateReviewIds,
    });

    writeJsonIfChanged(rightsReportPath, report);
    writeTextIfChanged(processingNotesPath, notes);
    rightsReports.push(relativeTo(generatedRoot, rightsReportPath));
    processingNotes.push(relativeTo(generatedRoot, processingNotesPath));
    warnings.push(
      ...bookWarnings.map((warning) => `${entry.metadata.slug}: ${warning}`),
      ...rights.warnings.map((warning) => `${entry.metadata.slug}: ${warning}`),
    );
    bookReviews.push(
      reviewEntryFor({
        entry,
        report,
        rights,
        generatedRoot,
        duplicateReviewIds,
      }),
    );
  }

  const report = buildBatchReport({ entries, bookReviews, duplicates });
  const reviewReportJsonPath = path.join(generatedRoot, "review-report.json");
  const reviewReportMarkdownPath = path.join(generatedRoot, "review-report.md");
  writeJsonIfChanged(reviewReportJsonPath, report);
  writeTextIfChanged(reviewReportMarkdownPath, buildBatchMarkdown(report));

  const result: GenerateBookRightsReportResult = {
    report,
    generatedRoot,
    reviewReportJsonPath,
    reviewReportMarkdownPath,
    rightsReports: rightsReports.sort(compareText),
    processingNotes: processingNotes.sort(compareText),
    warnings,
    fatalErrors,
  };
  if (!options.quiet) printSummary(result);
  return result;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === invokedPath) {
  const result = generateBookRightsReports();
  if (result.fatalErrors.length > 0) {
    process.exitCode = 1;
  }
}
