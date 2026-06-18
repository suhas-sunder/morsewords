import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
} from "./bookManifestTypes.ts";
import { cleanGutenbergText } from "./clean-gutenberg.ts";
import { normalizeBookText } from "./bookTextNormalization.ts";

type VerificationStatus = "pass" | "warn accepted" | "fail";

type Evidence = {
  source: string;
  text: string;
  lineNumber: number | null;
};

type DryRunBook = {
  slug: string;
  candidateType: "raw-only";
  sourceFileUsed: string;
  expectedGeneratedTitle: string;
  expectedAuthor: string[];
  authorEvidence: Evidence;
  detectedStructuralConvention: string;
  meaningfulHeadingsExist: boolean;
  currentStatus: string;
};

type DryRunReport = {
  reportName: "pilot-dry-run-7";
  selectedBooks: string[];
  selectedCount: number;
  books: DryRunBook[];
};

type BoundaryReport = {
  cleanedLine: number | null;
  reason: string;
  snippet: string | null;
};

type SectionSnapshot = {
  id: string | null;
  label: string | null;
  title: string | null;
  kind: BookSectionKind | null;
  includeByDefault: boolean | null;
  wordCount: number | null;
  snippet: string | null;
};

type WriteBook = {
  slug: string;
  dryRunStatus: string;
  finalAction: "first-time processed" | "skipped";
  sourceFileUsed: string;
  expectedTitle: string;
  generatedTitle: string | null;
  expectedAuthor: string[];
  generatedAuthor: string[] | null;
  authorEvidence: Evidence;
  generatedFilesChanged: string[];
  previewAssetChanged: string | null;
  startBoundaryUsed: BoundaryReport;
  endBoundaryUsed: BoundaryReport;
  structuralConvention: string;
  firstDefaultSectionAfterProcessing: SectionSnapshot;
  sectionCount: number;
  first5SectionsWithWordCounts: Array<{
    id: string;
    label: string;
    title: string | null;
    kind: BookSectionKind;
    wordCount: number;
  }>;
  last5SectionsWithWordCounts: Array<{
    id: string;
    label: string;
    title: string | null;
    kind: BookSectionKind;
    wordCount: number;
  }>;
  cleanupActionsApplied: unknown;
  titleDefaultStartRiskVerdict: string;
  authorMetadataVerdict: string;
  segmentationVerdict: string;
  previewVerdict: string;
  startupPreviewValid: boolean;
  allMainReadableDefaultVerdict: string;
  remainingWarnings: string[];
  supportingSnippets: {
    title: string;
    author: string;
    start: string | null;
    end: string | null;
  };
  finalRecommendation: "accepted for review" | "needs manual review" | "skipped";
};

type WriteReport = {
  reportName: "pilot-write-7";
  selectedBooks: string[];
  totals: {
    selected: number;
    firstTimeProcessed: number;
    skipped: number;
    unresolvedSourceGeneratedBooksLeftUntouched: number;
  };
  unresolvedSourceGeneratedBooksLeftUntouched: Array<{
    slug: string;
    title: string;
    reason: string;
  }>;
  books: WriteBook[];
};

type PreviewAsset = {
  version: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionKind: BookSectionKind;
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

type StartupAuditBook = {
  slug: string;
  startupPreviewValid?: boolean;
  recommendation?: string;
  warnings?: string[];
};

type Verdict = {
  status: "pass" | "warn" | "fail";
  summary: string;
  details: string[];
};

type VerificationBook = {
  slug: string;
  writeAction: "first-time processed" | "skipped";
  verificationStatus: VerificationStatus;
  generatedOutputInspected: string[];
  previewAssetInspected: string;
  rawSourceInspected: string;
  dryRunReportInspected: string;
  dryRunPerBookReportInspected: string;
  writeReportInspected: string;
  generatedTitleVerdict: Verdict;
  generatedAuthorVerdict: Verdict;
  selectedStructuralConvention: string;
  startBoundaryVerdict: Verdict;
  endBoundaryVerdict: Verdict;
  sectioningVerdict: Verdict;
  cleanupVerdict: Verdict;
  previewVerdict: Verdict;
  allMainReadableDefaultVerdict: Verdict;
  startupPreviewValid: boolean;
  remainingWarnings: string[];
  acceptedForMain: boolean;
  correctionNeededBeforeMain: boolean;
  correctionAppliedDuringVerification: string | null;
  snippets: {
    titleEvidence: string | null;
    authorEvidence: string | null;
    rawStart: string | null;
    generatedFirstSection: string | null;
    generatedFirstDefault: string | null;
    previewStart: string | null;
    rawEnd: string | null;
    generatedEnd: string | null;
  };
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-7");
const writeRoot = path.join(auditRoot, "pilot-write-7");
const verificationRoot = path.join(auditRoot, "pilot-write-7-verification");

const EXPECTED_SELECTED = [
  "a-japanese-blossom",
  "at-the-earth-s-core",
  "can-you-forgive-her",
  "despair-s-last-journey",
  "five-children-and-it",
  "flatland-a-romance-of-many-dimensions",
  "herland",
  "hero-myths-and-legends-of-the-british-race",
  "howards-end",
  "king-arthur-and-the-knights-of-the-round-table",
  "lord-jim",
  "love-among-the-chickens",
  "parnassus-on-wheels",
  "pollyanna",
  "shen-of-the-sea-a-book-for-children",
  "the-adventures-of-pinocchio",
  "the-invisible-man-a-grotesque-romance",
  "the-virginian-a-horseman-of-the-plains",
  "the-green-mummy",
  "the-mark-of-zorro",
  "typhoon",
  "robert-orange",
  "the-warden",
  "the-sea-lady",
  "the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel",
] as const;

const EXPECTED_UNRESOLVED = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "jabberwocky",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-great-gatsby",
  "the-picture-of-dorian-gray",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
] as const;

const FUTURE_BATCH_RULE = [
  "valid generated readable content",
  "correct generated title",
  "correct author metadata or documented unresolved-author policy",
  "first default section from real readable content",
  "all main readable sections included by default",
  "meaningful source-based segmentation",
  "valid book-specific startup preview",
  "no SOS Help!",
  "no generic preview fallback",
  "no title/TOC/source/license/contributor/transcriber/byline material as default playback",
  "selected/default source order begins from the first selected/default section",
];

const LATER_PHASE_REQUIREMENTS = [
  "after all books are processed, run an independent second-pass audit using a different strategy",
  "after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page",
  "after summaries, perform full site SEO/meta review using GSC data and route-level intent",
  "final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable",
];

const WARNING_STATUS_NOTES: Record<string, string> = {
  "the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel":
    "Accepted with warning: verification corrected the duplicated Gutenberg author header to the title-page byline, Baroness Orczy.",
  "the-virginian-a-horseman-of-the-plains":
    "Accepted with warning: dry-run over-counted two lowercase prose false positives; write output preserves 36 roman-numbered chapter headings.",
  "the-warden":
    "Accepted with warning: dry-run under-counted Chapter XX; write output uses explicit Chapter I-XXI boundaries and preserves 21 chapters.",
};

const correctionNotes: Record<string, string> = {
  "the-laughing-cavalier-the-story-of-the-ancestor-of-the-scarlet-pimpernel":
    "Corrected generated author metadata from duplicated Gutenberg header to title-page byline: Baroness Orczy.",
};

const nonPlayablePattern =
  /\b(Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg\.org|Distributed Proofreading|Transcriber'?s Notes?|Transcriber.?s Note|table of contents)\b/i;

const genericPreviewPattern =
  /\b(SOS Help!?|MorseWords placeholder|generic placeholder|Type text here|book route is available)\b/i;

const imageOrPageArtifactPattern =
  /(?:\[(?:Illustration|Image|Plate|Map|Portrait)\b|^\s*\[[ivxlcdm\d]+\]\s*$)/im;

const excludedDefaultKinds = new Set<BookSectionKind>([
  "title-page",
  "dedication",
  "epigraph",
  "preface",
  "introduction",
  "appendix",
  "notes",
  "glossary",
  "index",
  "transcriber-note",
  "source-license",
  "advertisement",
]);

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function statusPath(filePath: string): string {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function compactText(text: string | null | undefined, maxLength = 260): string | null {
  if (!text) return null;
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return null;
  return compact.length <= maxLength ? compact : `${compact.slice(0, maxLength - 3).trimEnd()}...`;
}

function normalizeForCompare(text: string) {
  return normalizeBookText(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function arraysEqual(a: string[] | null | undefined, b: string[] | null | undefined) {
  return JSON.stringify(a ?? []) === JSON.stringify(b ?? []);
}

function sectionPath(slug: string, section: GeneratedBookManifest["sections"][number]) {
  return path.join(generatedRoot, slug, section.sectionJsonPath);
}

function readSection(slug: string, section: GeneratedBookManifest["sections"][number]) {
  return readJson<GeneratedBookSectionJson>(sectionPath(slug, section));
}

function sectionText(section: GeneratedBookSectionJson) {
  return section.morseSourceText || section.displayText || "";
}

function startsWithSection(preview: PreviewAsset, section: GeneratedBookSectionJson) {
  const previewStart = normalizeForCompare(preview.previewText).slice(0, 160);
  const sectionStart = normalizeForCompare(sectionText(section)).slice(0, 220);
  if (!previewStart || !sectionStart) return false;
  return sectionStart.startsWith(previewStart.slice(0, Math.min(120, previewStart.length)));
}

function sourceContainsSnippet(
  sourceText: string,
  snippet: string | null | undefined,
  minimumLength = 30,
) {
  if (!snippet) return false;
  const normalizedSource = normalizeForCompare(sourceText);
  const normalizedSnippet = normalizeForCompare(snippet).slice(0, 140);
  return normalizedSnippet.length >= minimumLength && normalizedSource.includes(normalizedSnippet);
}

function textHasNonPlayableArtifact(text: string) {
  return nonPlayablePattern.test(text) || imageOrPageArtifactPattern.test(text);
}

function sectionIsMainReadable(section: GeneratedBookManifest["sections"][number]) {
  if (excludedDefaultKinds.has(section.kind)) return false;
  if (section.wordCount <= 0) return false;
  if (textHasNonPlayableArtifact(`${section.label} ${section.title ?? ""} ${section.textPreview}`)) {
    return false;
  }
  return true;
}

function verdict(status: Verdict["status"], summary: string, details: string[] = []): Verdict {
  return { status, summary, details };
}

function summarizeQualityReports() {
  const startup = readJson<Record<string, unknown>>(
    path.join(auditRoot, "book-startup-preview-audit-1/book-startup-preview-audit-1.json"),
  );
  const title = readJson<Record<string, unknown>>(
    path.join(auditRoot, "title-start-default-content-audit-1/title-start-default-content-audit-1.json"),
  );
  const metadata = readJson<Record<string, unknown>>(
    path.join(
      auditRoot,
      "metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json",
    ),
  );
  const manual = readJson<Record<string, unknown>>(
    path.join(auditRoot, "manual-ui-defect-followup-1/manual-ui-defect-followup-1.json"),
  );
  return {
    startup: {
      generatedBookCount: startup.generatedBookCount,
      validStartupPreviewCount: startup.validStartupPreviewCount,
      previewAssetsUpdated: startup.previewAssetsUpdated,
    },
    titleStartDefault: title.totals,
    metadataSegmentation: metadata.totals,
    manualUiDefectFollowup: manual.summary,
    startupBooks: (startup.books ?? []) as StartupAuditBook[],
  };
}

function verifyBook(
  dryRunBook: DryRunBook,
  writeBook: WriteBook,
  startupBooks: StartupAuditBook[],
): VerificationBook {
  const rawPath = path.resolve(repoRoot, writeBook.sourceFileUsed);
  if (!rawPath.startsWith(tempBooksRoot)) {
    throw new Error(`${writeBook.slug}: source path is outside temp-books.`);
  }
  const rawText = fs.readFileSync(rawPath, "utf8");
  const cleanedSourceText = cleanGutenbergText(rawText).cleanedText;
  const generatedDir = path.join(generatedRoot, writeBook.slug);
  const manifestPath = path.join(generatedDir, "manifest.json");
  const processedPath = path.join(generatedDir, "processed_book.json");
  const cleanedPath = path.join(generatedDir, "cleaned_book.json");
  const rightsPath = path.join(generatedDir, "rights_report.json");
  const notesPath = path.join(generatedDir, "processing_notes.md");
  const manifest = readJson<GeneratedBookManifest>(manifestPath);
  fs.readFileSync(processedPath, "utf8");
  fs.readFileSync(cleanedPath, "utf8");
  fs.readFileSync(rightsPath, "utf8");
  fs.readFileSync(notesPath, "utf8");
  const previewPath = path.join(previewRoot, `${writeBook.slug}.preview.json`);
  const preview = readJson<PreviewAsset>(previewPath);
  const perBookDryRunPath = path.join(dryRunRoot, "books", `${writeBook.slug}.md`);
  fs.readFileSync(perBookDryRunPath, "utf8");

  const firstSectionSummary = manifest.sections[0] ?? null;
  const firstDefaultSummary =
    manifest.sections.find((section) => section.includeByDefault) ?? null;
  const lastSectionSummary = manifest.sections.at(-1) ?? null;
  const firstSection = firstSectionSummary ? readSection(writeBook.slug, firstSectionSummary) : null;
  const firstDefaultSection = firstDefaultSummary
    ? readSection(writeBook.slug, firstDefaultSummary)
    : null;
  const lastSection = lastSectionSummary ? readSection(writeBook.slug, lastSectionSummary) : null;
  const defaultSummaries = manifest.sections.filter((section) => section.includeByDefault);
  const defaultSections = defaultSummaries.map((section) => readSection(writeBook.slug, section));
  const defaultText = defaultSections.map(sectionText).join("\n\n");
  const firstDefaultText = firstDefaultSection ? sectionText(firstDefaultSection) : "";
  const lastText = lastSection ? sectionText(lastSection) : "";
  const mainReadableIds = manifest.sections.filter(sectionIsMainReadable).map((section) => section.id);
  const defaultIds = new Set(defaultSummaries.map((section) => section.id));
  const startupAuditEntry = startupBooks.find((book) => book.slug === writeBook.slug);

  const titleMatches =
    manifest.title === writeBook.generatedTitle &&
    manifest.title === writeBook.expectedTitle &&
    Boolean(manifest.title) &&
    sourceContainsSnippet(rawText, writeBook.supportingSnippets.title || manifest.title, 5);
  const generatedTitleVerdict = titleMatches
    ? verdict("pass", `pass: generated title is ${manifest.title}`)
    : verdict("fail", "fail: generated title does not match write report and source evidence", [
        `manifest=${manifest.title}`,
        `write expected=${writeBook.expectedTitle}`,
        `write generated=${writeBook.generatedTitle ?? "n/a"}`,
      ]);

  const authorMatches =
    arraysEqual(manifest.author, writeBook.generatedAuthor) &&
    arraysEqual(manifest.author, writeBook.expectedAuthor) &&
    !manifest.author.some((author) => /^unknown author$/i.test(author)) &&
    sourceContainsSnippet(rawText, writeBook.authorEvidence.text, 5);
  const generatedAuthorVerdict = authorMatches
    ? verdict("pass", `pass: generated author is ${manifest.author.join(", ")}`)
    : verdict("fail", "fail: generated author does not match source-supported write report metadata", [
        `manifest=${manifest.author.join(", ")}`,
        `write expected=${writeBook.expectedAuthor.join(", ")}`,
        `author evidence=${writeBook.authorEvidence.text}`,
      ]);

  const firstDefaultLooksReadable =
    Boolean(firstDefaultSection) &&
    Boolean(firstDefaultSummary?.includeByDefault) &&
    !excludedDefaultKinds.has(firstDefaultSummary!.kind) &&
    !textHasNonPlayableArtifact(firstDefaultText) &&
    !genericPreviewPattern.test(firstDefaultText);
  const rawStartFound = sourceContainsSnippet(cleanedSourceText, firstDefaultText.slice(0, 260));
  const startBoundaryVerdict =
    firstDefaultLooksReadable && rawStartFound
      ? verdict(
          "pass",
          `pass: first default is ${firstDefaultSummary!.label}${
            firstDefaultSummary!.title ? ` - ${firstDefaultSummary!.title}` : ""
          } and starts from readable source content`,
          [writeBook.startBoundaryUsed.reason],
        )
      : verdict("fail", "fail: first default section is missing, non-readable, or not traceable to source", [
          `firstDefault=${firstDefaultSummary?.id ?? "missing"}`,
          `rawStartFound=${rawStartFound}`,
        ]);

  const generatedEndClean =
    Boolean(lastSection) &&
    !textHasNonPlayableArtifact(lastText.slice(-1200)) &&
    sourceContainsSnippet(cleanedSourceText, lastText.slice(-320));
  const endBoundaryVerdict = generatedEndClean
    ? verdict(
        "pass",
        `pass: generated output ends at ${
          lastSectionSummary
            ? `${lastSectionSummary.label}${lastSectionSummary.title ? ` - ${lastSectionSummary.title}` : ""}`
            : "last generated section"
        } before license/source tail material`,
        [writeBook.endBoundaryUsed.reason],
      )
    : verdict("fail", "fail: generated ending is not cleanly traceable to source readable ending", [
        `lastSection=${lastSectionSummary?.id ?? "missing"}`,
      ]);

  const hasGenericFallbackLabels =
    dryRunBook.meaningfulHeadingsExist &&
    manifest.sections.some(
      (section) => /^Part \d+$/i.test(section.label) && section.title === null,
    );
  const sectionCountMatches =
    manifest.stats.sectionCount === writeBook.sectionCount &&
    manifest.sections.length === writeBook.sectionCount &&
    writeBook.finalAction === "first-time processed";
  const sectioningVerdict =
    sectionCountMatches && !hasGenericFallbackLabels
      ? verdict(
          "pass",
          `pass: ${manifest.stats.sectionCount} sections preserve ${writeBook.structuralConvention}`,
        )
      : verdict("fail", "fail: generated sectioning does not match the write report or source heading strategy", [
          `manifestCount=${manifest.stats.sectionCount}`,
          `writeCount=${writeBook.sectionCount}`,
          `genericFallbackLabels=${hasGenericFallbackLabels}`,
        ]);

  const cleanupClean = !textHasNonPlayableArtifact(defaultText);
  const cleanupVerdict = cleanupClean
    ? verdict(
        "pass",
        "pass: no source/license/transcriber/TOC/illustration/page-marker artifacts found in default playback",
      )
    : verdict("fail", "fail: cleanup artifacts remain in default playback");

  const previewValid =
    preview.slug === manifest.slug &&
    preview.contentVersion === manifest.contentVersion &&
    preview.contentHash === manifest.contentHash &&
    preview.defaultSectionId === firstDefaultSummary?.id &&
    Boolean(firstDefaultSection) &&
    startsWithSection(preview, firstDefaultSection!) &&
    !genericPreviewPattern.test(preview.previewText) &&
    !textHasNonPlayableArtifact(preview.previewText);
  const previewVerdict = previewValid
    ? verdict("pass", `pass: preview starts from ${preview.defaultSectionId} and matches generated hash`)
    : verdict("fail", "fail: preview is stale, generic, or not aligned to first default content", [
        `previewDefault=${preview.defaultSectionId}`,
        `firstDefault=${firstDefaultSummary?.id ?? "missing"}`,
      ]);

  const allMainDefault =
    mainReadableIds.length > 0 && mainReadableIds.every((sectionId) => defaultIds.has(sectionId));
  const defaultOrderStartsCorrectly =
    Boolean(defaultSummaries[0]) && defaultSummaries[0].id === firstDefaultSummary?.id;
  const allMainReadableDefaultVerdict =
    allMainDefault && defaultOrderStartsCorrectly
      ? verdict(
          "pass",
          "pass: all detected main readable sections are selected by default and default source order starts at first default section",
        )
      : verdict("fail", "fail: default selection omits main readable sections or has incorrect source order", [
          `mainReadable=${mainReadableIds.length}`,
          `default=${defaultIds.size}`,
        ]);

  const startupPreviewValid =
    startupAuditEntry?.startupPreviewValid === true ||
    (startupAuditEntry === undefined && previewValid);

  const failures = [
    generatedTitleVerdict,
    generatedAuthorVerdict,
    startBoundaryVerdict,
    endBoundaryVerdict,
    sectioningVerdict,
    cleanupVerdict,
    previewVerdict,
    allMainReadableDefaultVerdict,
  ].filter((entry) => entry.status === "fail");
  if (!startupPreviewValid) {
    failures.push(verdict("fail", "fail: startup audit did not mark preview valid"));
  }

  const acceptedWarning = WARNING_STATUS_NOTES[writeBook.slug] ?? null;
  const verificationStatus: VerificationStatus =
    failures.length > 0 ? "fail" : acceptedWarning ? "warn accepted" : "pass";
  const remainingWarnings = [
    ...(acceptedWarning ? [acceptedWarning] : []),
    ...failures.map((entry) => entry.summary),
  ];

  return {
    slug: writeBook.slug,
    writeAction: writeBook.finalAction,
    verificationStatus,
    generatedOutputInspected: [
      statusPath(manifestPath),
      statusPath(processedPath),
      statusPath(cleanedPath),
      statusPath(rightsPath),
      statusPath(notesPath),
      ...manifest.sections.map((section) => statusPath(sectionPath(writeBook.slug, section))),
    ],
    previewAssetInspected: statusPath(previewPath),
    rawSourceInspected: statusPath(rawPath),
    dryRunReportInspected: statusPath(path.join(dryRunRoot, "pilot-dry-run-7.json")),
    dryRunPerBookReportInspected: statusPath(perBookDryRunPath),
    writeReportInspected: statusPath(path.join(writeRoot, "pilot-write-7.json")),
    generatedTitleVerdict,
    generatedAuthorVerdict,
    selectedStructuralConvention: writeBook.structuralConvention,
    startBoundaryVerdict,
    endBoundaryVerdict,
    sectioningVerdict,
    cleanupVerdict,
    previewVerdict,
    allMainReadableDefaultVerdict,
    startupPreviewValid,
    remainingWarnings,
    acceptedForMain: verificationStatus !== "fail",
    correctionNeededBeforeMain: verificationStatus === "fail",
    correctionAppliedDuringVerification: correctionNotes[writeBook.slug] ?? null,
    snippets: {
      titleEvidence: compactText(writeBook.supportingSnippets.title),
      authorEvidence: compactText(writeBook.authorEvidence.text),
      rawStart: compactText(writeBook.startBoundaryUsed.snippet),
      generatedFirstSection: compactText(firstSection ? sectionText(firstSection) : null),
      generatedFirstDefault: compactText(firstDefaultSection ? sectionText(firstDefaultSection) : null),
      previewStart: compactText(preview.previewText),
      rawEnd: compactText(writeBook.endBoundaryUsed.snippet),
      generatedEnd: compactText(lastSection ? sectionText(lastSection).slice(-700) : null),
    },
  };
}

function writeMarkdownReport(report: {
  generatedAt: string;
  totals: Record<string, number>;
  qualityGateReports: unknown;
  books: VerificationBook[];
  unresolvedSourceGeneratedBooksLeftUntouched: WriteReport["unresolvedSourceGeneratedBooksLeftUntouched"];
}) {
  const lines = [
    "# Pilot write batch 7 verification",
    "",
    "Post-write QA pass for the 25 batch-7 first-time processed books.",
    "",
    "## Totals",
    "",
    `- Selected: ${report.totals.selected}`,
    `- Pass: ${report.totals.pass}`,
    `- Warn accepted: ${report.totals.warnAccepted}`,
    `- Fail: ${report.totals.fail}`,
    `- Accepted for main: ${report.totals.acceptedForMain}`,
    `- Corrections applied during verification: ${report.totals.correctionsApplied}`,
    "",
    "## Active quality-gate reports read",
    "",
    "```json",
    JSON.stringify(report.qualityGateReports, null, 2),
    "```",
    "",
    "## Unresolved-source generated books left untouched",
    "",
    ...report.unresolvedSourceGeneratedBooksLeftUntouched.map(
      (book) => `- ${book.slug}: ${book.reason}`,
    ),
    "",
    "## Books",
    "",
    ...report.books.flatMap((book) => [
      `### ${book.slug}`,
      "",
      `- Write action: ${book.writeAction}`,
      `- Verification status: ${book.verificationStatus}`,
      `- Generated output inspected: ${book.generatedOutputInspected.length} files`,
      `- Preview asset inspected: ${book.previewAssetInspected}`,
      `- Title: ${book.generatedTitleVerdict.summary}`,
      `- Author: ${book.generatedAuthorVerdict.summary}`,
      `- Structure: ${book.selectedStructuralConvention}`,
      `- Start boundary: ${book.startBoundaryVerdict.summary}`,
      `- End boundary: ${book.endBoundaryVerdict.summary}`,
      `- Sectioning: ${book.sectioningVerdict.summary}`,
      `- Cleanup: ${book.cleanupVerdict.summary}`,
      `- Preview: ${book.previewVerdict.summary}`,
      `- All-main-readable default: ${book.allMainReadableDefaultVerdict.summary}`,
      `- Startup preview valid: ${book.startupPreviewValid ? "yes" : "no"}`,
      `- Accepted for main: ${book.acceptedForMain ? "yes" : "no"}`,
      `- Correction needed before main: ${book.correctionNeededBeforeMain ? "yes" : "no"}`,
      book.correctionAppliedDuringVerification
        ? `- Correction applied: ${book.correctionAppliedDuringVerification}`
        : "- Correction applied: none",
      book.remainingWarnings.length > 0
        ? `- Remaining warnings: ${book.remainingWarnings.join("; ")}`
        : "- Remaining warnings: none",
      "",
      "Supporting snippets:",
      "",
      `- Title evidence: ${book.snippets.titleEvidence ?? "n/a"}`,
      `- Author evidence: ${book.snippets.authorEvidence ?? "n/a"}`,
      `- Raw start: ${book.snippets.rawStart ?? "n/a"}`,
      `- Generated first section: ${book.snippets.generatedFirstSection ?? "n/a"}`,
      `- Generated first default: ${book.snippets.generatedFirstDefault ?? "n/a"}`,
      `- Preview start: ${book.snippets.previewStart ?? "n/a"}`,
      `- Raw end: ${book.snippets.rawEnd ?? "n/a"}`,
      `- Generated end: ${book.snippets.generatedEnd ?? "n/a"}`,
      "",
    ]),
    "## Future-batch rule",
    "",
    ...FUTURE_BATCH_RULE.map((rule) => `- ${rule}`),
    "",
    "## Later-phase requirements",
    "",
    ...LATER_PHASE_REQUIREMENTS.map((rule) => `- ${rule}`),
  ];
  writeText(
    path.join(verificationRoot, "pilot-write-7-verification.md"),
    `${lines.join("\n").trimEnd()}\n`,
  );
}

function main() {
  const dryRun = readJson<DryRunReport>(path.join(dryRunRoot, "pilot-dry-run-7.json"));
  const write = readJson<WriteReport>(path.join(writeRoot, "pilot-write-7.json"));
  fs.readFileSync(path.join(dryRunRoot, "pilot-dry-run-7.md"), "utf8");
  fs.readFileSync(path.join(writeRoot, "pilot-write-7.md"), "utf8");
  const quality = summarizeQualityReports();

  if (dryRun.reportName !== "pilot-dry-run-7" || write.reportName !== "pilot-write-7") {
    throw new Error("Missing or incorrect batch-7 dry-run/write reports.");
  }
  if (JSON.stringify(dryRun.selectedBooks) !== JSON.stringify([...EXPECTED_SELECTED])) {
    throw new Error("Dry-run selected books do not match the expected batch-7 list.");
  }
  if (JSON.stringify(write.selectedBooks) !== JSON.stringify([...EXPECTED_SELECTED])) {
    throw new Error("Write report selected books do not match the expected batch-7 list.");
  }
  if (
    write.books.length !== 25 ||
    write.totals.firstTimeProcessed !== 25 ||
    write.totals.skipped !== 0
  ) {
    throw new Error("Write report is missing or incomplete for batch 7.");
  }
  for (const slug of EXPECTED_UNRESOLVED) {
    if (!write.unresolvedSourceGeneratedBooksLeftUntouched.some((book) => book.slug === slug)) {
      throw new Error(`Unresolved-source generated book missing from write report: ${slug}`);
    }
  }

  const books = write.selectedBooks.map((slug) => {
    const dryRunBook = dryRun.books.find((book) => book.slug === slug);
    const writeBook = write.books.find((book) => book.slug === slug);
    if (!dryRunBook || !writeBook) {
      throw new Error(`${slug}: missing dry-run or write report entry.`);
    }
    return verifyBook(dryRunBook, writeBook, quality.startupBooks);
  });

  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = books.filter((book) => book.verificationStatus === "warn accepted").length;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;
  const correctionsApplied = books.filter((book) => book.correctionAppliedDuringVerification).length;
  const generatedAt = new Date().toISOString();
  const qualityGateReports = {
    startup: quality.startup,
    titleStartDefault: quality.titleStartDefault,
    metadataSegmentation: quality.metadataSegmentation,
    manualUiDefectFollowup: quality.manualUiDefectFollowup,
  };
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-7-verification",
    generatedAt,
    branch: "morsewords-book-processing-pilot-write-7-jun-2026",
    mode: "post-write verification",
    selectedBooks: [...EXPECTED_SELECTED],
    totals: {
      selected: books.length,
      pass,
      warnAccepted,
      fail,
      acceptedForMain: books.filter((book) => book.acceptedForMain).length,
      correctionsApplied,
      unresolvedSourceGeneratedBooksLeftUntouched:
        write.unresolvedSourceGeneratedBooksLeftUntouched.length,
    },
    qualityGateReportsRead: qualityGateReports,
    unresolvedSourceGeneratedBooksLeftUntouched:
      write.unresolvedSourceGeneratedBooksLeftUntouched,
    futureBatchRule: FUTURE_BATCH_RULE,
    laterPhaseRequirements: LATER_PHASE_REQUIREMENTS,
    books,
  };

  writeJson(path.join(verificationRoot, "pilot-write-7-verification.json"), report);
  writeMarkdownReport({
    generatedAt,
    totals: report.totals,
    qualityGateReports,
    books,
    unresolvedSourceGeneratedBooksLeftUntouched:
      write.unresolvedSourceGeneratedBooksLeftUntouched,
  });

  console.log(
    `Pilot write 7 verification complete: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail; ${correctionsApplied} correction applied.`,
  );
  if (fail > 0) process.exitCode = 1;
}

main();
