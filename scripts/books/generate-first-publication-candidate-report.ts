import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";

type ReviewQueueBook = {
  slug: string;
  title: string;
  author: string[];
  gutenbergId: string | null;
  currentStatus: "approved" | "needs_manual_review" | "reject";
  processingAllowed: boolean;
  rejectionOrManualReviewReasons: string[];
  missingFields: string[];
  authorDeathYearStatus: {
    authors: Array<{
      name: string;
      deathYear: number | null;
      approvedMetadataFound: boolean;
      status: string;
    }>;
  };
  personStatus: {
    translator: { name: string | null; deathYear: number | null; status: string };
    editor: { name: string | null; deathYear: number | null; status: string };
    illustrator: { name: string | null; deathYear: number | null; status: string };
    introductionAuthor: { name: string | null; deathYear: number | null; status: string };
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
    translation: string;
    edition: string;
    trademarkOrCharacterBrand: string;
    contentBrandSafety: string;
    modernIntroOrNotes: boolean;
    transcriberNotes: boolean;
    illustrationOrImageReferences: boolean;
  };
  nextAction: string;
};

type ReviewQueueReport = {
  summary: {
    totalBooks: number;
    approved: number;
    needsManualReview: number;
    rejected: number;
    processingAllowed: number;
  };
  books: ReviewQueueBook[];
};

type BatchRightsReport = {
  publishReady: number;
  books: Array<{
    slug: string;
    sourceUrl: string | null;
    publishReady: boolean;
    originalPublication: string;
    authorDeathYear: number | null;
    translator: string;
    translatorDeathYear: number | null;
  }>;
};

type OwnerBookApprovals = {
  books?: Array<{
    bookSlug: string;
    ownerReviewed: boolean;
    approvedForWebsite: boolean;
  }>;
};

type CandidateEntry = {
  slug: string;
  title: string;
  author: string;
  gutenbergId: string | null;
  currentStatus: string;
  reasonBlocked: string;
  missingAuthorDeathYear: boolean;
  missingTranslatorDeathYear: boolean;
  duplicateGutenbergIssue: boolean;
  modernIntroEditorIllustratorIssue: boolean;
  originalPublicationIssue: boolean;
  contentBrandSafetyIssue: boolean;
  existingFileEvidenceMayBeEnough: boolean;
  ownerApprovalStillRequired: boolean;
  sourceUrlPresent: boolean;
  processingAllowed: boolean;
  publishReady: boolean;
};

type FirstPublicationCandidateReport = {
  schemaVersion: 1;
  generatedFrom: {
    reviewQueuePath: string;
    rightsReportPath: string;
    ownerBookApprovalsPath: string;
  };
  summary: {
    totalBooks: number;
    approved: number;
    needsManualReview: number;
    rejected: number;
    processingAllowed: number;
    publishReady: number;
    existingFileEvidenceMayBeEnough: number;
    ownerApprovalStillRequired: number;
    missingAuthorDeathYear: number;
    missingTranslatorDeathYear: number;
    duplicateGutenbergIssue: number;
    modernIntroEditorIllustratorIssue: number;
    originalPublicationIssue: number;
    contentBrandSafetyIssue: number;
  };
  candidates: CandidateEntry[];
};

export type FirstPublicationCandidateReportOptions = {
  repoRoot?: string;
  generatedRoot?: string;
  approvedMetadataRoot?: string;
  quiet?: boolean;
};

export type FirstPublicationCandidateReportResult = {
  report: FirstPublicationCandidateReport;
  paths: {
    json: string;
    markdown: string;
  };
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_GENERATED_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/generated",
);
const DEFAULT_APPROVED_METADATA_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/text/approved-metadata",
);

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJsonIfChanged(filePath: string, value: unknown): void {
  const next = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === next) {
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, "utf8");
}

function writeTextIfChanged(filePath: string, value: string): void {
  const next = value.endsWith("\n") ? value : `${value}\n`;
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === next) {
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, "utf8");
}

function isMediumOrHigh(risk: string) {
  return risk === "medium" || risk === "high";
}

function reasonBlocked(book: ReviewQueueBook) {
  const reasons = book.rejectionOrManualReviewReasons.length
    ? book.rejectionOrManualReviewReasons
    : [book.nextAction];
  return reasons.join(" ");
}

function ownerApprovalMap(approvalPath: string) {
  if (!fs.existsSync(approvalPath)) return new Map<string, boolean>();
  const parsed = readJson<OwnerBookApprovals>(approvalPath);
  const result = new Map<string, boolean>();
  for (const approval of parsed.books ?? []) {
    result.set(
      approval.bookSlug,
      approval.ownerReviewed === true && approval.approvedForWebsite === true,
    );
  }
  return result;
}

function existingFileEvidenceMayBeEnough(
  book: ReviewQueueBook,
  rightsBook: BatchRightsReport["books"][number] | undefined,
) {
  if (!book.gutenbergId || !rightsBook?.sourceUrl) return false;
  if (book.currentStatus === "reject") return false;
  if (book.duplicateGutenbergIdStatus.needsManualResolution) return false;
  if (book.missingFields.includes("originalPublication")) return false;
  if (book.missingFields.includes("originalPublicationYear")) return false;
  if (!rightsBook.originalPublication) return false;
  if (book.authorDeathYearStatus.authors.some((author) => author.deathYear === null)) {
    return false;
  }
  if (book.personStatus.translator.name && book.personStatus.translator.deathYear === null) {
    return false;
  }
  if (
    book.risks.laterCopyrightNotice ||
    book.risks.permissionBasedLanguage ||
    book.risks.creativeCommonsNotice ||
    book.risks.modernIntroOrNotes ||
    book.risks.illustrationOrImageReferences ||
    isMediumOrHigh(book.risks.translation) ||
    isMediumOrHigh(book.risks.edition) ||
    isMediumOrHigh(book.risks.trademarkOrCharacterBrand) ||
    isMediumOrHigh(book.risks.contentBrandSafety)
  ) {
    return false;
  }
  return true;
}

function buildMarkdown(report: FirstPublicationCandidateReport): string {
  const yesNo = (value: boolean) => (value ? "yes" : "no");
  const tableRows = report.candidates.map((book) =>
    [
      book.slug,
      book.title,
      book.author,
      book.gutenbergId ?? "",
      book.currentStatus,
      book.reasonBlocked.replace(/\s+/g, " ").slice(0, 180),
      yesNo(book.missingAuthorDeathYear),
      yesNo(book.missingTranslatorDeathYear),
      yesNo(book.duplicateGutenbergIssue),
      yesNo(book.modernIntroEditorIllustratorIssue),
      yesNo(book.originalPublicationIssue),
      yesNo(book.contentBrandSafetyIssue),
      yesNo(book.existingFileEvidenceMayBeEnough),
      yesNo(book.ownerApprovalStillRequired),
    ]
      .map((cell) => String(cell).replace(/\|/g, "\\|"))
      .join(" | "),
  );

  return [
    "# First publication candidate report",
    "",
    "This report uses generated metadata, rights reports, owner approval files, and review queues only. It does not include full story text.",
    "",
    "## Summary",
    "",
    `- Total books: ${report.summary.totalBooks}`,
    `- Approved: ${report.summary.approved}`,
    `- Needs manual review: ${report.summary.needsManualReview}`,
    `- Rejected: ${report.summary.rejected}`,
    `- Processing allowed: ${report.summary.processingAllowed}`,
    `- Publish-ready: ${report.summary.publishReady}`,
    `- Existing file evidence may be enough after owner review: ${report.summary.existingFileEvidenceMayBeEnough}`,
    `- Owner approval still required: ${report.summary.ownerApprovalStillRequired}`,
    `- Missing author death year: ${report.summary.missingAuthorDeathYear}`,
    `- Missing translator death year: ${report.summary.missingTranslatorDeathYear}`,
    `- Duplicate Gutenberg issue: ${report.summary.duplicateGutenbergIssue}`,
    `- Modern intro/editor/illustrator issue: ${report.summary.modernIntroEditorIllustratorIssue}`,
    `- Original publication issue: ${report.summary.originalPublicationIssue}`,
    `- Content/brand safety issue: ${report.summary.contentBrandSafetyIssue}`,
    "",
    "## Candidate Table",
    "",
    "slug | title | author | Gutenberg ID | current status | reason blocked | missing author death year | missing translator death year | duplicate Gutenberg issue | modern intro/editor/illustrator issue | original publication issue | content/brand safety issue | existing file evidence may be enough | owner approval still required",
    "--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---",
    ...tableRows,
    "",
  ].join("\n");
}

export function generateFirstPublicationCandidateReport(
  options: FirstPublicationCandidateReportOptions = {},
): FirstPublicationCandidateReportResult {
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT);
  void repoRoot;
  const generatedRoot = path.resolve(options.generatedRoot ?? DEFAULT_GENERATED_ROOT);
  const approvedMetadataRoot = path.resolve(
    options.approvedMetadataRoot ?? DEFAULT_APPROVED_METADATA_ROOT,
  );
  const reviewRoot = path.join(generatedRoot, "review");
  const reviewQueuePath = path.join(reviewRoot, "review-queue.json");
  const rightsReportPath = path.join(generatedRoot, "review-report.json");
  const ownerBookApprovalsPath = path.join(
    approvedMetadataRoot,
    "book-approvals.json",
  );
  const outputJsonPath = path.join(
    reviewRoot,
    "first-publication-candidate-report.json",
  );
  const outputMarkdownPath = path.join(
    reviewRoot,
    "first-publication-candidate-report.md",
  );

  const reviewQueue = readJson<ReviewQueueReport>(reviewQueuePath);
  const rightsReport = readJson<BatchRightsReport>(rightsReportPath);
  const ownerApprovals = ownerApprovalMap(ownerBookApprovalsPath);
  const rightsBySlug = new Map(rightsReport.books.map((book) => [book.slug, book]));

  const candidates: CandidateEntry[] = reviewQueue.books.map((book) => {
    const rightsBook = rightsBySlug.get(book.slug);
    const missingAuthorDeathYear = book.authorDeathYearStatus.authors.some(
      (author) => author.deathYear === null,
    );
    const missingTranslatorDeathYear =
      Boolean(book.personStatus.translator.name) &&
      book.personStatus.translator.deathYear === null;
    const modernIntroEditorIllustratorIssue =
      book.risks.modernIntroOrNotes ||
      Boolean(book.personStatus.editor.name) ||
      Boolean(book.personStatus.illustrator.name) ||
      Boolean(book.personStatus.introductionAuthor.name) ||
      book.risks.illustrationOrImageReferences ||
      isMediumOrHigh(book.risks.edition);
    const originalPublicationIssue =
      book.missingFields.includes("originalPublication") ||
      book.missingFields.includes("originalPublicationYear") ||
      !rightsBook?.originalPublication;
    const contentBrandSafetyIssue =
      isMediumOrHigh(book.risks.contentBrandSafety) ||
      isMediumOrHigh(book.risks.trademarkOrCharacterBrand);
    const ownerApproved = ownerApprovals.get(book.slug) === true;

    return {
      slug: book.slug,
      title: book.title,
      author: book.author.join(", "),
      gutenbergId: book.gutenbergId,
      currentStatus: book.currentStatus,
      reasonBlocked: reasonBlocked(book),
      missingAuthorDeathYear,
      missingTranslatorDeathYear,
      duplicateGutenbergIssue: book.duplicateGutenbergIdStatus.needsManualResolution,
      modernIntroEditorIllustratorIssue,
      originalPublicationIssue,
      contentBrandSafetyIssue,
      existingFileEvidenceMayBeEnough: existingFileEvidenceMayBeEnough(
        book,
        rightsBook,
      ),
      ownerApprovalStillRequired: !ownerApproved,
      sourceUrlPresent: Boolean(rightsBook?.sourceUrl),
      processingAllowed: book.processingAllowed,
      publishReady: rightsBook?.publishReady === true,
    };
  });

  const count = (predicate: (book: CandidateEntry) => boolean) =>
    candidates.filter(predicate).length;
  const report: FirstPublicationCandidateReport = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    generatedFrom: {
      reviewQueuePath: toPosixPath(path.relative(generatedRoot, reviewQueuePath)),
      rightsReportPath: toPosixPath(path.relative(generatedRoot, rightsReportPath)),
      ownerBookApprovalsPath: toPosixPath(
        path.relative(generatedRoot, ownerBookApprovalsPath),
      ),
    },
    summary: {
      totalBooks: reviewQueue.summary.totalBooks,
      approved: reviewQueue.summary.approved,
      needsManualReview: reviewQueue.summary.needsManualReview,
      rejected: reviewQueue.summary.rejected,
      processingAllowed: reviewQueue.summary.processingAllowed,
      publishReady: rightsReport.publishReady,
      existingFileEvidenceMayBeEnough: count(
        (book) => book.existingFileEvidenceMayBeEnough,
      ),
      ownerApprovalStillRequired: count((book) => book.ownerApprovalStillRequired),
      missingAuthorDeathYear: count((book) => book.missingAuthorDeathYear),
      missingTranslatorDeathYear: count((book) => book.missingTranslatorDeathYear),
      duplicateGutenbergIssue: count((book) => book.duplicateGutenbergIssue),
      modernIntroEditorIllustratorIssue: count(
        (book) => book.modernIntroEditorIllustratorIssue,
      ),
      originalPublicationIssue: count((book) => book.originalPublicationIssue),
      contentBrandSafetyIssue: count((book) => book.contentBrandSafetyIssue),
    },
    candidates,
  };

  writeJsonIfChanged(outputJsonPath, report);
  writeTextIfChanged(outputMarkdownPath, buildMarkdown(report));

  if (!options.quiet) {
    console.log("First publication candidate report");
    console.log(`Books: ${report.summary.totalBooks}`);
    console.log(`Processing allowed: ${report.summary.processingAllowed}`);
    console.log(`Publish-ready: ${report.summary.publishReady}`);
    console.log(
      `Existing file evidence may be enough: ${report.summary.existingFileEvidenceMayBeEnough}`,
    );
    console.log(`Report: ${toPosixPath(outputJsonPath)}`);
  }

  return {
    report,
    paths: {
      json: outputJsonPath,
      markdown: outputMarkdownPath,
    },
  };
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === invokedPath) {
  generateFirstPublicationCandidateReport();
}
