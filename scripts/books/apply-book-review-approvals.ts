import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type {
  ApprovedPeopleMetadata,
  BookMetadata,
  OwnerBookApproval,
} from "./bookManifestTypes.ts";
import { BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";
import {
  loadOwnerBookApprovals,
  loadOwnerDuplicateResolutions,
  loadOwnerPeopleApprovals,
  ownerBookApprovalMap,
  type OwnerDuplicateResolution,
  type OwnerPersonApproval,
} from "./bookApprovalFiles.ts";
import { generateBookReviewQueue } from "./generate-book-review-queue.ts";
import { generateBookRightsReports } from "./generate-book-rights-reports.ts";

export type ApplyBookReviewApprovalsOptions = {
  repoRoot?: string;
  textRoot?: string;
  metadataRoot?: string;
  approvedMetadataRoot?: string;
  approvedPeoplePath?: string;
  peopleApprovalsPath?: string;
  bookApprovalsPath?: string;
  duplicateResolutionsPath?: string;
  generatedRoot?: string;
  reviewRoot?: string;
  quiet?: boolean;
};

export type ApprovalApplicationBookSummary = {
  slug: string;
  title: string;
  currentStatus: string;
  processingAllowed: boolean;
  publishReady: boolean;
  nextAction: string;
};

export type ApprovalApplicationReport = {
  schemaVersion: 1;
  summary: {
    ownerPeopleApprovals: number;
    ownerBookApprovals: number;
    ownerDuplicateResolutions: number;
    processingAllowedAfterApplication: number;
    publishReadyAfterApplication: number;
    stillNeedsManualReview: number;
    rejected: number;
    invalidOwnerInputWarnings: number;
  };
  approvedAfterOwnerInput: ApprovalApplicationBookSummary[];
  stillNeedsManualReview: ApprovalApplicationBookSummary[];
  rejected: ApprovalApplicationBookSummary[];
  peopleApprovalsUsed: Array<{
    slug: string;
    name: string;
    roles: string[];
    deathYear: number | null;
  }>;
  duplicateResolutionsUsed: Array<{
    gutenbergId: string;
    resolution: string;
    keepSlug: string | null;
    duplicateSlugs: string[];
  }>;
  booksNewlyEligibleForProcessing: string[];
  booksStillBlocked: Array<{
    slug: string;
    currentStatus: string;
    missingFields: string[];
    nextAction: string;
  }>;
  invalidOwnerInputWarnings: string[];
  ownerInputFiles: {
    peopleJson: string;
    peopleCsv: string;
    booksJson: string;
    booksCsv: string;
    duplicatesJson: string;
    duplicatesCsv: string;
  };
};

export type ApplyBookReviewApprovalsResult = {
  report: ApprovalApplicationReport;
  paths: {
    approvalApplicationReportJson: string;
    approvalApplicationReportMarkdown: string;
    ownerInputDir: string;
  };
  warnings: string[];
  fatalErrors: string[];
};

type MetadataEntry = {
  filePath: string;
  metadata: BookMetadata;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_TEXT_ROOT = path.join(DEFAULT_REPO_ROOT, "app/client/assets/text");
const DEFAULT_METADATA_ROOT = path.join(DEFAULT_TEXT_ROOT, "meta");
const DEFAULT_GENERATED_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/generated",
);

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function relativeTo(root: string, filePath: string): string {
  return toPosixPath(path.relative(root, filePath));
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
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
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
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

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvFromRows(rows: Array<Record<string, unknown>>, headers: string[]): string {
  return [
    headers.map(csvCell).join(","),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")),
  ].join("\n");
}

function ensureFile(filePath: string, value: unknown): void {
  if (fs.existsSync(filePath)) return;
  writeJsonIfChanged(filePath, value);
}

function ensureApprovalFiles({
  approvedMetadataRoot,
  peopleApprovalsPath,
  bookApprovalsPath,
  duplicateResolutionsPath,
}: {
  approvedMetadataRoot: string;
  peopleApprovalsPath: string;
  bookApprovalsPath: string;
  duplicateResolutionsPath: string;
}) {
  fs.mkdirSync(approvedMetadataRoot, { recursive: true });
  ensureFile(peopleApprovalsPath, { schemaVersion: 1, people: [] });
  ensureFile(bookApprovalsPath, { schemaVersion: 1, books: [] });
  ensureFile(duplicateResolutionsPath, { schemaVersion: 1, duplicates: [] });
}

function loadMetadataEntries(metadataRoot: string): {
  entries: MetadataEntry[];
  errors: string[];
} {
  const entries: MetadataEntry[] = [];
  const errors: string[] = [];
  for (const filePath of findJsonFiles(metadataRoot)) {
    try {
      const raw = readJson(filePath);
      if (!isPlainObject(raw)) {
        errors.push(`${filePath}: metadata must be an object.`);
        continue;
      }
      if (typeof raw.slug !== "string" || raw.slug.trim() === "") {
        errors.push(`${filePath}: metadata slug is missing.`);
        continue;
      }
      entries.push({ filePath, metadata: raw as BookMetadata });
    } catch (error) {
      errors.push(
        `${filePath}: ${
          error instanceof Error ? error.message : "unknown metadata error"
        }`,
      );
    }
  }
  return { entries, errors };
}

function loadLegacyApprovedPeople(filePath: string): ApprovedPeopleMetadata {
  if (!fs.existsSync(filePath)) return {};
  const parsed = readJson(filePath);
  return isPlainObject(parsed) ? (parsed as ApprovedPeopleMetadata) : {};
}

function mergeOwnerPeopleIntoLegacyAuthors(
  approvedPeoplePath: string,
  people: OwnerPersonApproval[],
): string[] {
  if (people.length === 0) return [];
  const existing = loadLegacyApprovedPeople(approvedPeoplePath);
  const used: string[] = [];
  for (const person of people) {
    existing[person.slug] = {
      name: person.name,
      deathYear: person.deathYear,
      canadaLifePlus70Safe: person.canadaLifePlus70Safe,
      roles: person.roles,
      sources: [person.sourceNotes, person.reviewDate]
        .filter((value): value is string => typeof value === "string" && value.trim() !== ""),
      notes: person.notes,
    };
    used.push(person.slug);
  }
  writeJsonIfChanged(approvedPeoplePath, existing);
  return used;
}

function approvalNotes(approval: OwnerBookApproval): string {
  return [
    "Owner book approval applied.",
    approval.notes,
    approval.editionNotes ? `Edition notes: ${approval.editionNotes}` : "",
    approval.translationNotes ? `Translation notes: ${approval.translationNotes}` : "",
    approval.excludeModernAdditions
      ? "Modern additions must be excluded from processed output."
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function applyBookApprovalsToMetadata(
  metadataEntries: MetadataEntry[],
  approvals: Map<string, OwnerBookApproval>,
): string[] {
  const changed: string[] = [];
  for (const entry of metadataEntries) {
    const approval = approvals.get(entry.metadata.slug);
    if (!approval || !approval.approvedForWebsite || !approval.ownerReviewed) {
      continue;
    }
    const next = {
      ...entry.metadata,
      metadataStatus: "reviewed" as const,
      manualReviewRequired: false,
      originalPublicationYear:
        approval.originalPublicationYear ?? entry.metadata.originalPublicationYear,
      source: {
        ...entry.metadata.source,
        rightsReviewed: true,
        rightsNotes: [entry.metadata.source.rightsNotes, approvalNotes(approval)]
          .filter((value) => value.trim() !== "")
          .join(" "),
      },
    };
    writeJsonIfChanged(entry.filePath, next);
    entry.metadata = next;
    changed.push(entry.metadata.slug);
  }
  return changed;
}

function duplicateSlugSet(resolution: OwnerDuplicateResolution): Set<string> {
  return new Set(
    [resolution.keepSlug, ...resolution.duplicateSlugs].filter(
      (slug): slug is string => typeof slug === "string" && slug.trim() !== "",
    ),
  );
}

function applyDuplicateResolutionsToMetadata(
  metadataEntries: MetadataEntry[],
  resolutions: OwnerDuplicateResolution[],
): string[] {
  const changed: string[] = [];
  const bySlug = new Map(metadataEntries.map((entry) => [entry.metadata.slug, entry]));
  const byGutenbergId = new Map<string, MetadataEntry[]>();
  for (const entry of metadataEntries) {
    const id = entry.metadata.source.gutenbergId;
    if (!id) continue;
    const group = byGutenbergId.get(id) ?? [];
    group.push(entry);
    byGutenbergId.set(id, group);
  }

  for (const resolution of resolutions) {
    if (resolution.resolution === "ignore-until-reviewed") continue;
    const group = byGutenbergId.get(resolution.gutenbergId) ?? [];
    const slugs =
      duplicateSlugSet(resolution).size > 0
        ? duplicateSlugSet(resolution)
        : new Set(group.map((entry) => entry.metadata.slug));
    for (const slug of slugs) {
      const entry = bySlug.get(slug);
      if (!entry) continue;
      const next = {
        ...entry.metadata,
        source: {
          ...entry.metadata.source,
          allowDuplicateGutenbergId: true,
          duplicateReason: resolution.reason,
        },
      };
      writeJsonIfChanged(entry.filePath, next);
      entry.metadata = next;
      changed.push(slug);
    }
  }
  return changed;
}

function validateOwnerInputTargets({
  metadataEntries,
  bookApprovals,
  duplicateResolutions,
}: {
  metadataEntries: MetadataEntry[];
  bookApprovals: OwnerBookApproval[];
  duplicateResolutions: OwnerDuplicateResolution[];
}): string[] {
  const errors: string[] = [];
  const bySlug = new Map(metadataEntries.map((entry) => [entry.metadata.slug, entry]));
  const byGutenbergId = new Map<string, Set<string>>();
  for (const entry of metadataEntries) {
    const id = entry.metadata.source.gutenbergId;
    if (!id) continue;
    const group = byGutenbergId.get(id) ?? new Set<string>();
    group.add(entry.metadata.slug);
    byGutenbergId.set(id, group);
  }

  for (const approval of bookApprovals) {
    if (!bySlug.has(approval.bookSlug)) {
      errors.push(`book-approvals: unknown bookSlug "${approval.bookSlug}".`);
    }
  }
  for (const resolution of duplicateResolutions) {
    const group = byGutenbergId.get(resolution.gutenbergId);
    if (!group) {
      errors.push(
        `duplicate-resolutions: unknown Gutenberg ID "${resolution.gutenbergId}".`,
      );
      continue;
    }
    for (const slug of duplicateSlugSet(resolution)) {
      if (!group.has(slug)) {
        errors.push(
          `duplicate-resolutions: slug "${slug}" is not in Gutenberg ID ${resolution.gutenbergId}.`,
        );
      }
    }
  }

  return errors;
}

function ownerPeopleRows(queue: ReturnType<typeof generateBookReviewQueue>) {
  return queue.peopleReviewQueue.people.map((person) => ({
    suggestedSlug: person.suggestedKey,
    displayName: person.displayName,
    roles: person.rolesFound.join("; "),
    affectedBooks: person.booksAffected
      .map((book) => `${book.slug} (${book.role})`)
      .join("; "),
    currentStatus: person.approvedMetadataFound ? "approved metadata found" : "needs owner review",
    missingFields:
      person.missingDeathYearCount > 0
        ? "deathYear; canadaLifePlus70Safe; reviewedByOwner"
        : "reviewedByOwner",
    nextAction: "Fill verified deathYear/sourceNotes and set reviewedByOwner true.",
    reviewedByOwner: false,
    deathYear: "",
    canadaLifePlus70Safe: "",
    reviewDate: "",
    sourceNotes: "",
    notes: "",
  }));
}

function ownerBookRows(queue: ReturnType<typeof generateBookReviewQueue>) {
  return queue.reviewQueue.books.map((book) => ({
    bookSlug: book.slug,
    title: book.title,
    authors: book.author.join("; "),
    gutenbergId: book.gutenbergId ?? "",
    currentStatus: book.currentStatus,
    processingAllowed: book.processingAllowed,
    missingFields: book.missingFields.join("; "),
    nextAction: book.nextAction,
    ownerReviewed: false,
    approvedForWebsite: false,
    approvedForYoutubeNarration: false,
    approvedRegions: "US; CA",
    originalPublicationYear: "",
    editionNotes: "",
    translationNotes: "",
    excludeModernAdditions: true,
    notes: "",
  }));
}

function ownerDuplicateRows(queue: ReturnType<typeof generateBookReviewQueue>) {
  return queue.duplicateGutenbergReview.duplicateGutenbergIds.map((group) => ({
    gutenbergId: group.gutenbergId,
    affectedBooks: group.participants
      .map((participant) => `${participant.slug}: ${participant.title}`)
      .join("; "),
    currentStatus: "needs owner duplicate resolution",
    nextAction: group.nextActions.join(" "),
    ownerReviewed: false,
    resolution: "ignore-until-reviewed",
    keepSlug: "",
    duplicateSlugs: group.participants.map((participant) => participant.slug).join("; "),
    reason: "",
  }));
}

function writeOwnerInputFiles({
  queue,
  ownerInputDir,
}: {
  queue: ReturnType<typeof generateBookReviewQueue>;
  ownerInputDir: string;
}) {
  const peopleRows = ownerPeopleRows(queue);
  const bookRows = ownerBookRows(queue);
  const duplicateRows = ownerDuplicateRows(queue);
  const paths = {
    peopleJson: path.join(ownerInputDir, "people-to-review.json"),
    peopleCsv: path.join(ownerInputDir, "people-to-review.csv"),
    booksJson: path.join(ownerInputDir, "books-to-review.json"),
    booksCsv: path.join(ownerInputDir, "books-to-review.csv"),
    duplicatesJson: path.join(ownerInputDir, "duplicates-to-review.json"),
    duplicatesCsv: path.join(ownerInputDir, "duplicates-to-review.csv"),
  };

  writeJsonIfChanged(paths.peopleJson, {
    schemaVersion: BOOK_SCHEMA_VERSION,
    people: peopleRows,
  });
  writeTextIfChanged(
    paths.peopleCsv,
    csvFromRows(peopleRows, [
      "suggestedSlug",
      "displayName",
      "roles",
      "affectedBooks",
      "currentStatus",
      "missingFields",
      "nextAction",
      "reviewedByOwner",
      "deathYear",
      "canadaLifePlus70Safe",
      "reviewDate",
      "sourceNotes",
      "notes",
    ]),
  );
  writeJsonIfChanged(paths.booksJson, {
    schemaVersion: BOOK_SCHEMA_VERSION,
    books: bookRows,
  });
  writeTextIfChanged(
    paths.booksCsv,
    csvFromRows(bookRows, [
      "bookSlug",
      "title",
      "authors",
      "gutenbergId",
      "currentStatus",
      "processingAllowed",
      "missingFields",
      "nextAction",
      "ownerReviewed",
      "approvedForWebsite",
      "approvedForYoutubeNarration",
      "approvedRegions",
      "originalPublicationYear",
      "editionNotes",
      "translationNotes",
      "excludeModernAdditions",
      "notes",
    ]),
  );
  writeJsonIfChanged(paths.duplicatesJson, {
    schemaVersion: BOOK_SCHEMA_VERSION,
    duplicates: duplicateRows,
  });
  writeTextIfChanged(
    paths.duplicatesCsv,
    csvFromRows(duplicateRows, [
      "gutenbergId",
      "affectedBooks",
      "currentStatus",
      "nextAction",
      "ownerReviewed",
      "resolution",
      "keepSlug",
      "duplicateSlugs",
      "reason",
    ]),
  );

  return paths;
}

function bookSummaryFor(
  book: ReturnType<typeof generateBookReviewQueue>["reviewQueue"]["books"][number],
): ApprovalApplicationBookSummary {
  return {
    slug: book.slug,
    title: book.title,
    currentStatus: book.currentStatus,
    processingAllowed: book.processingAllowed,
    publishReady: book.processingAllowed && book.currentStatus === "approved",
    nextAction: book.nextAction,
  };
}

function emptyReport({
  ownerInputFiles,
  invalidOwnerInputWarnings,
}: {
  ownerInputFiles: ApprovalApplicationReport["ownerInputFiles"];
  invalidOwnerInputWarnings: string[];
}): ApprovalApplicationReport {
  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    summary: {
      ownerPeopleApprovals: 0,
      ownerBookApprovals: 0,
      ownerDuplicateResolutions: 0,
      processingAllowedAfterApplication: 0,
      publishReadyAfterApplication: 0,
      stillNeedsManualReview: 0,
      rejected: 0,
      invalidOwnerInputWarnings: invalidOwnerInputWarnings.length,
    },
    approvedAfterOwnerInput: [],
    stillNeedsManualReview: [],
    rejected: [],
    peopleApprovalsUsed: [],
    duplicateResolutionsUsed: [],
    booksNewlyEligibleForProcessing: [],
    booksStillBlocked: [],
    invalidOwnerInputWarnings,
    ownerInputFiles,
  };
}

function buildApprovalReport({
  queue,
  peopleApprovals,
  bookApprovals,
  duplicateResolutions,
  invalidOwnerInputWarnings,
  ownerInputFiles,
}: {
  queue: ReturnType<typeof generateBookReviewQueue>;
  peopleApprovals: OwnerPersonApproval[];
  bookApprovals: OwnerBookApproval[];
  duplicateResolutions: OwnerDuplicateResolution[];
  invalidOwnerInputWarnings: string[];
  ownerInputFiles: ApprovalApplicationReport["ownerInputFiles"];
}): ApprovalApplicationReport {
  const approvedAfterOwnerInput = queue.reviewQueue.books
    .filter((book) => book.currentStatus === "approved" && book.processingAllowed)
    .map(bookSummaryFor);
  const stillNeedsManualReview = queue.reviewQueue.books
    .filter((book) => book.currentStatus === "needs_manual_review")
    .map(bookSummaryFor);
  const rejected = queue.reviewQueue.books
    .filter((book) => book.currentStatus === "reject")
    .map(bookSummaryFor);

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    summary: {
      ownerPeopleApprovals: peopleApprovals.length,
      ownerBookApprovals: bookApprovals.length,
      ownerDuplicateResolutions: duplicateResolutions.length,
      processingAllowedAfterApplication: approvedAfterOwnerInput.length,
      publishReadyAfterApplication: approvedAfterOwnerInput.length,
      stillNeedsManualReview: stillNeedsManualReview.length,
      rejected: rejected.length,
      invalidOwnerInputWarnings: invalidOwnerInputWarnings.length,
    },
    approvedAfterOwnerInput,
    stillNeedsManualReview,
    rejected,
    peopleApprovalsUsed: peopleApprovals.map((person) => ({
      slug: person.slug,
      name: person.name,
      roles: person.roles,
      deathYear: person.deathYear,
    })),
    duplicateResolutionsUsed: duplicateResolutions.map((resolution) => ({
      gutenbergId: resolution.gutenbergId,
      resolution: resolution.resolution,
      keepSlug: resolution.keepSlug,
      duplicateSlugs: resolution.duplicateSlugs,
    })),
    booksNewlyEligibleForProcessing: approvedAfterOwnerInput.map((book) => book.slug),
    booksStillBlocked: queue.reviewQueue.books
      .filter((book) => !book.processingAllowed)
      .map((book) => ({
        slug: book.slug,
        currentStatus: book.currentStatus,
        missingFields: book.missingFields,
        nextAction: book.nextAction,
      })),
    invalidOwnerInputWarnings,
    ownerInputFiles,
  };
}

function buildApprovalMarkdown(report: ApprovalApplicationReport): string {
  const list = (items: string[]) =>
    items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None.";

  return [
    "# Morse book approval application report",
    "",
    `- Owner people approvals used: ${report.summary.ownerPeopleApprovals}`,
    `- Owner book approvals used: ${report.summary.ownerBookApprovals}`,
    `- Duplicate resolutions used: ${report.summary.ownerDuplicateResolutions}`,
    `- Processing allowed after application: ${report.summary.processingAllowedAfterApplication}`,
    `- Still needs manual review: ${report.summary.stillNeedsManualReview}`,
    `- Rejected: ${report.summary.rejected}`,
    `- Invalid owner input warnings: ${report.summary.invalidOwnerInputWarnings}`,
    "",
    "## Books newly eligible for processing",
    "",
    list(report.booksNewlyEligibleForProcessing),
    "",
    "## Books still blocked",
    "",
    report.booksStillBlocked.length > 0
      ? report.booksStillBlocked
          .map(
            (book) =>
              `- ${book.slug}: ${book.currentStatus}; ${book.nextAction}`,
          )
          .join("\n")
      : "- None.",
    "",
    "## People approvals used",
    "",
    report.peopleApprovalsUsed.length > 0
      ? report.peopleApprovalsUsed
          .map((person) => `- ${person.slug}: ${person.name} (${person.deathYear})`)
          .join("\n")
      : "- None.",
    "",
    "## Duplicate resolutions used",
    "",
    report.duplicateResolutionsUsed.length > 0
      ? report.duplicateResolutionsUsed
          .map(
            (resolution) =>
              `- ${resolution.gutenbergId}: ${resolution.resolution}`,
          )
          .join("\n")
      : "- None.",
    "",
    "## Invalid owner input warnings",
    "",
    list(report.invalidOwnerInputWarnings),
    "",
  ].join("\n");
}

function relativeOwnerInputFiles(
  generatedRoot: string,
  paths: ApprovalApplicationReport["ownerInputFiles"],
): ApprovalApplicationReport["ownerInputFiles"] {
  return {
    peopleJson: relativeTo(generatedRoot, paths.peopleJson),
    peopleCsv: relativeTo(generatedRoot, paths.peopleCsv),
    booksJson: relativeTo(generatedRoot, paths.booksJson),
    booksCsv: relativeTo(generatedRoot, paths.booksCsv),
    duplicatesJson: relativeTo(generatedRoot, paths.duplicatesJson),
    duplicatesCsv: relativeTo(generatedRoot, paths.duplicatesCsv),
  };
}

export function applyBookReviewApprovals(
  options: ApplyBookReviewApprovalsOptions = {},
): ApplyBookReviewApprovalsResult {
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT);
  const textRoot = path.resolve(options.textRoot ?? DEFAULT_TEXT_ROOT);
  const metadataRoot = path.resolve(options.metadataRoot ?? DEFAULT_METADATA_ROOT);
  const approvedMetadataRoot = path.resolve(
    options.approvedMetadataRoot ?? path.join(textRoot, "approved-metadata"),
  );
  const approvedPeoplePath = path.resolve(
    options.approvedPeoplePath ??
      path.join(approvedMetadataRoot, "authors.json"),
  );
  const peopleApprovalsPath = path.resolve(
    options.peopleApprovalsPath ??
      path.join(approvedMetadataRoot, "people.json"),
  );
  const bookApprovalsPath = path.resolve(
    options.bookApprovalsPath ??
      path.join(approvedMetadataRoot, "book-approvals.json"),
  );
  const duplicateResolutionsPath = path.resolve(
    options.duplicateResolutionsPath ??
      path.join(approvedMetadataRoot, "duplicate-resolutions.json"),
  );
  const generatedRoot = path.resolve(options.generatedRoot ?? DEFAULT_GENERATED_ROOT);
  const reviewRoot = path.resolve(
    options.reviewRoot ?? path.join(generatedRoot, "review"),
  );
  const ownerInputDir = path.join(reviewRoot, "owner-input");
  const reportJsonPath = path.join(reviewRoot, "approval-application-report.json");
  const reportMarkdownPath = path.join(reviewRoot, "approval-application-report.md");
  const warnings: string[] = [];
  const ownerInputWarnings: string[] = [];
  const fatalErrors: string[] = [];

  void repoRoot;
  ensureApprovalFiles({
    approvedMetadataRoot,
    peopleApprovalsPath,
    bookApprovalsPath,
    duplicateResolutionsPath,
  });

  const metadataLoad = loadMetadataEntries(metadataRoot);
  fatalErrors.push(...metadataLoad.errors);

  const peopleLoad = loadOwnerPeopleApprovals(peopleApprovalsPath);
  const bookLoad = loadOwnerBookApprovals(bookApprovalsPath);
  const duplicateLoad = loadOwnerDuplicateResolutions(duplicateResolutionsPath);
  fatalErrors.push(
    ...peopleLoad.errors,
    ...bookLoad.errors,
    ...duplicateLoad.errors,
  );
  ownerInputWarnings.push(
    ...peopleLoad.warnings,
    ...bookLoad.warnings,
    ...duplicateLoad.warnings,
  );
  warnings.push(...ownerInputWarnings);
  fatalErrors.push(
    ...validateOwnerInputTargets({
      metadataEntries: metadataLoad.entries,
      bookApprovals: bookLoad.entries,
      duplicateResolutions: duplicateLoad.entries,
    }),
  );

  const placeholderInputFiles = {
    peopleJson: relativeTo(generatedRoot, path.join(ownerInputDir, "people-to-review.json")),
    peopleCsv: relativeTo(generatedRoot, path.join(ownerInputDir, "people-to-review.csv")),
    booksJson: relativeTo(generatedRoot, path.join(ownerInputDir, "books-to-review.json")),
    booksCsv: relativeTo(generatedRoot, path.join(ownerInputDir, "books-to-review.csv")),
    duplicatesJson: relativeTo(generatedRoot, path.join(ownerInputDir, "duplicates-to-review.json")),
    duplicatesCsv: relativeTo(generatedRoot, path.join(ownerInputDir, "duplicates-to-review.csv")),
  };

  if (fatalErrors.length > 0) {
    const report = emptyReport({
      ownerInputFiles: placeholderInputFiles,
      invalidOwnerInputWarnings: [...ownerInputWarnings, ...fatalErrors],
    });
    writeJsonIfChanged(reportJsonPath, report);
    writeTextIfChanged(reportMarkdownPath, buildApprovalMarkdown(report));
    if (!options.quiet) printSummary(report, fatalErrors);
    return {
      report,
      paths: {
        approvalApplicationReportJson: reportJsonPath,
        approvalApplicationReportMarkdown: reportMarkdownPath,
        ownerInputDir,
      },
      warnings,
      fatalErrors,
    };
  }

  mergeOwnerPeopleIntoLegacyAuthors(approvedPeoplePath, peopleLoad.entries);
  applyBookApprovalsToMetadata(
    metadataLoad.entries,
    ownerBookApprovalMap(bookLoad.entries),
  );
  applyDuplicateResolutionsToMetadata(metadataLoad.entries, duplicateLoad.entries);

  const rightsResult = generateBookRightsReports({
    textRoot,
    metadataRoot,
    approvedPeoplePath,
    bookApprovalsPath,
    generatedRoot,
    quiet: true,
  });
  fatalErrors.push(...rightsResult.fatalErrors);
  warnings.push(...rightsResult.warnings);

  const queue = generateBookReviewQueue({
    textRoot,
    metadataRoot,
    approvedPeoplePath,
    generatedRoot,
    reviewRoot,
    quiet: true,
  });
  fatalErrors.push(...queue.fatalErrors);
  warnings.push(...queue.warnings);

  const ownerInputFilesAbsolute = writeOwnerInputFiles({ queue, ownerInputDir });
  const ownerInputFiles = relativeOwnerInputFiles(
    generatedRoot,
    ownerInputFilesAbsolute,
  );
  const report = buildApprovalReport({
    queue,
    peopleApprovals: peopleLoad.entries,
    bookApprovals: bookLoad.entries,
    duplicateResolutions: duplicateLoad.entries,
    invalidOwnerInputWarnings: ownerInputWarnings,
    ownerInputFiles,
  });

  writeJsonIfChanged(reportJsonPath, report);
  writeTextIfChanged(reportMarkdownPath, buildApprovalMarkdown(report));

  if (!options.quiet) printSummary(report, fatalErrors);
  return {
    report,
    paths: {
      approvalApplicationReportJson: reportJsonPath,
      approvalApplicationReportMarkdown: reportMarkdownPath,
      ownerInputDir,
    },
    warnings,
    fatalErrors,
  };
}

function printSummary(report: ApprovalApplicationReport, fatalErrors: string[]) {
  console.log("Morse book approval intake");
  console.log(`Owner people approvals: ${report.summary.ownerPeopleApprovals}`);
  console.log(`Owner book approvals: ${report.summary.ownerBookApprovals}`);
  console.log(`Duplicate resolutions: ${report.summary.ownerDuplicateResolutions}`);
  console.log(
    `Processing allowed after application: ${report.summary.processingAllowedAfterApplication}`,
  );
  console.log(`Still needs manual review: ${report.summary.stillNeedsManualReview}`);
  console.log(`Rejected: ${report.summary.rejected}`);

  if (fatalErrors.length > 0) {
    console.error("\nFatal errors:");
    for (const error of fatalErrors) console.error(`- ${error}`);
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === invokedPath) {
  const result = applyBookReviewApprovals();
  if (result.fatalErrors.length > 0) {
    process.exitCode = 1;
  }
}
