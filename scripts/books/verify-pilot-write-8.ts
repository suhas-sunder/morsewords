import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type VerificationStatus = "pass" | "warn accepted" | "fail";

type Evidence = {
  source: string;
  text: string;
  lineNumber: number | null;
};

type Verdict = {
  status: "pass" | "warn" | "fail";
  summary: string;
  details: string[];
};

type SectionSummary = {
  id: string;
  label: string;
  title: string | null;
  kind: string;
  includeByDefault: boolean;
  wordCount: number;
  sectionJsonPath: string;
  textPreview: string;
};

type Manifest = {
  slug: string;
  title: string;
  author: string[];
  contentVersion: string;
  contentHash: string;
  stats: {
    sectionCount: number;
    wordCount: number;
  };
  sections: SectionSummary[];
};

type SectionJson = {
  id: string;
  slug: string;
  title: string | null;
  label: string;
  kind: string;
  includeByDefault: boolean;
  displayText?: string;
  morseSourceText?: string;
  wordCount: number;
};

type PreviewAsset = {
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionKind: string;
  defaultSectionLabel: string;
  defaultSectionTitle: string | null;
  previewText: string;
};

type DryRunBook = {
  slug: string;
  sourceFileUsed: string;
  expectedGeneratedTitle: string;
  expectedAuthor: string[];
  authorEvidence: Evidence;
  detectedStructuralConvention: string;
  meaningfulHeadingsExist: boolean;
  expectedSectioningStrategy: string;
  currentStatus: string;
  snippets: {
    title: string;
    author: string;
    start: string;
    end: string;
  };
};

type DryRunReport = {
  reportName: string;
  selectedBooks: string[];
  selectedCount: number;
  unresolvedSourceGeneratedBooksLeftUntouched: Array<{ slug: string; title: string; reason: string }>;
  books: DryRunBook[];
};

type WriteBook = {
  slug: string;
  finalAction: "first-time processed" | "skipped";
  sourceFileUsed: string;
  expectedTitle: string;
  generatedTitle: string | null;
  expectedAuthor: string[];
  generatedAuthor: string[] | null;
  authorEvidence: Evidence;
  generatedFilesChanged: string[];
  previewAssetChanged: string | null;
  duplicateNearDuplicateSlugCheckResult: string;
  structuralConvention: string;
  sectionCount: number;
  startupPreviewValid: boolean;
  allMainReadableDefaultVerdict: string;
  remainingWarnings: string[];
  supportingSnippets: {
    title: string;
    author: string;
    start: string | null;
    end: string | null;
  };
};

type WriteReport = {
  reportName: string;
  selectedBooks: string[];
  totals: {
    selected: number;
    firstTimeProcessed: number;
    skipped: number;
    unresolvedSourceGeneratedBooksLeftUntouched: number;
  };
  unresolvedSourceGeneratedBooksLeftUntouched: Array<{ slug: string; title: string; reason: string }>;
  books: WriteBook[];
};

type VerificationBook = {
  slug: string;
  writeAction: "first-time processed";
  verificationStatus: VerificationStatus;
  rawSourceInspected: string;
  generatedOutputInspected: string[];
  previewAssetInspected: string;
  dryRunReportInspected: string;
  dryRunPerBookReportsInspected: string[];
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
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-8");
const writeRoot = path.join(auditRoot, "pilot-write-8");
const verificationRoot = path.join(auditRoot, "pilot-write-8-verification");

const SKIPPED_DUPLICATE_SLUG = "the-wind-in-the-willows";
const EXISTING_DUPLICATE_TARGET = "wind-in-the-willows";

const PROCESSED_BATCH = [
  "unicorns",
  "six-girls-a-home-story",
  "the-dunwich-horror",
  "the-regent-s-daughter",
  "the-scarlet-letter",
  "the-tower-treasure",
  "the-wailing-octopus-a-rick-brant-science-adventure-story",
  "winnie-the-pooh",
  "the-lady-of-the-lake",
  "the-lurking-fear",
  "metamorphosis",
  "the-monkey-s-paw",
  "the-hound",
  "the-masque-of-the-red-death",
  "the-red-room",
  "from-beyond",
  "the-other-gods",
  "the-statement-of-randolph-carter",
  "the-silver-key",
] as const;

const SELECTED_BATCH = [SKIPPED_DUPLICATE_SLUG, ...PROCESSED_BATCH] as const;

const UNRESOLVED_SOURCE_GENERATED_BOOKS = [
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

const CORRECTION_NOTES: Record<string, string> = {
  unicorns: "Trimmed a trailing decorative asterisk divider from the final chapter.",
  "six-girls-a-home-story": "Trimmed a trailing decorative ASCII box from the final chapter.",
  "the-regent-s-daughter": "Trimmed a redundant END OF title marker after the final sentence.",
  "the-scarlet-letter": "Trimmed a printer/imprint line after the final readable paragraph.",
  "the-tower-treasure": "Trimmed a trailing Hardy Boys series advertisement from the final chapter.",
  "the-wailing-octopus-a-rick-brant-science-adventure-story":
    "Trimmed a trailing Rick Brant series advertisement from the final chapter.",
  "the-hound": "Trimmed a source-site return/revision tail from the final section.",
  "from-beyond": "Trimmed a source-site return/revision tail from the story section.",
  "the-other-gods": "Trimmed a source-site return/revision tail from the story section.",
  "the-statement-of-randolph-carter":
    "Trimmed a source-site return/revision tail from the story section.",
};

const FUTURE_BATCH_RULE = [
  "valid generated readable content",
  "correct generated title",
  "correct author metadata or documented unresolved-author policy",
  "no duplicate generated work under a slightly different slug unless intentionally documented",
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

const NON_PLAYABLE_PATTERNS = [
  {
    label: "Project Gutenberg/source license",
    pattern:
      /Project Gutenberg|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|Gutenberg License|www\.gutenberg/i,
  },
  { label: "source-site return tail", pattern: /Return to\s+["\u201c]|This page last revised/i },
  { label: "publisher/series advertisement", pattern: /MYSTERY STORIES FOR BOYS|RICK BRANT SCIENCE-ADVENTURE Stories/i },
  { label: "printer/imprint tail", pattern: /Electrotyped and Printed|Printed by Welch/i },
  { label: "decorative box", pattern: /\+-{8,}\+/ },
  { label: "image placeholder", pattern: /\[(?:Illustration|Image|Plate|Decorative image|Music)\b/i },
  { label: "generic preview fallback", pattern: /SOS Help!?|generic placeholder|MorseWords placeholder|Type text here/i },
  { label: "duplicate end marker", pattern: /END OF ["\u201c]THE REGENT/i },
];

function readText(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(readText(filePath)) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function repoPath(filePath: string): string {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertInside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${candidate} is outside ${root}`);
  }
}

function compactText(value: string | null | undefined, maxLength = 260): string | null {
  if (!value) return null;
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) return null;
  return compact.length <= maxLength ? compact : `${compact.slice(0, maxLength - 3).trimEnd()}...`;
}

function normalizeForCompare(value: string): string {
  return value
    .replace(/â€œ|â€|â€�|[\u201c\u201d]/g, '"')
    .replace(/â€™|[\u2018\u2019]/g, "'")
    .replace(/â€”|[\u2014]/g, "-")
    .replace(/â€“|[\u2013]/g, "-")
    .replace(/Ã«/g, "e")
    .replace(/Ã©/g, "e")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceContainsSnippet(sourceText: string, snippet: string | null | undefined, minimumLength = 20): boolean {
  if (!snippet) return false;
  const normalizedSnippet = normalizeForCompare(snippet).slice(0, 180);
  if (normalizedSnippet.length < minimumLength) return false;
  return normalizeForCompare(sourceText).includes(normalizedSnippet);
}

function arraysEqual(left: string[] | null | undefined, right: string[] | null | undefined): boolean {
  return JSON.stringify(left ?? []) === JSON.stringify(right ?? []);
}

function verdict(status: Verdict["status"], summary: string, details: string[] = []): Verdict {
  return { status, summary, details };
}

function sectionText(section: SectionJson): string {
  return section.morseSourceText || section.displayText || "";
}

function readSection(slug: string, section: SectionSummary): SectionJson {
  return readJson<SectionJson>(path.join(generatedRoot, slug, section.sectionJsonPath));
}

function previewStartsFromSection(previewText: string, generatedText: string): boolean {
  const previewStart = normalizeForCompare(previewText).slice(0, 140);
  const generatedStart = normalizeForCompare(generatedText).slice(0, 220);
  if (!previewStart || !generatedStart) return false;
  return generatedStart.startsWith(previewStart.slice(0, Math.min(110, previewStart.length)));
}

function findNonPlayableArtifacts(text: string): string[] {
  return NON_PLAYABLE_PATTERNS
    .filter((entry) => entry.pattern.test(text))
    .map((entry) => entry.label);
}

function gitStatusFor(paths: string[]): string[] {
  const output = childProcess
    .execFileSync("git", ["status", "--short", "--", ...paths], {
      cwd: repoRoot,
      encoding: "utf8",
    })
    .trim();
  return output ? output.split(/\r?\n/) : [];
}

function summarizeQualityReports() {
  const startupPath = path.join(auditRoot, "book-startup-preview-audit-1/book-startup-preview-audit-1.json");
  const titlePath = path.join(auditRoot, "title-start-default-content-audit-1/title-start-default-content-audit-1.json");
  const metadataPath = path.join(
    auditRoot,
    "metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json",
  );
  const manualPath = path.join(auditRoot, "manual-ui-defect-followup-1/manual-ui-defect-followup-1.json");
  const startup = readJson<Record<string, unknown> & { books?: Array<Record<string, unknown> & { slug: string }> }>(
    startupPath,
  );
  const title = readJson<Record<string, unknown>>(titlePath);
  const metadata = readJson<Record<string, unknown>>(metadataPath);
  const manual = readJson<Record<string, unknown>>(manualPath);
  return {
    pathsRead: [startupPath, titlePath, metadataPath, manualPath].map(repoPath),
    startup: {
      generatedBookCount: startup.generatedBookCount,
      validStartupPreviewCount: startup.validStartupPreviewCount,
      previewAssetsUpdated: startup.previewAssetsUpdated,
      invalidOrMissing: startup.booksWithInvalidOrMissingPreviews,
    },
    titleStartDefault: title.totals,
    metadataSegmentation: metadata.totals,
    manualUiDefectFollowup: manual.summary,
    startupBooks: startup.books ?? [],
  };
}

function verifyProcessedBook(
  slug: string,
  dryRunBook: DryRunBook,
  writeBook: WriteBook,
  startupBooks: Array<Record<string, unknown> & { slug: string }>,
): VerificationBook {
  const rawPath = path.resolve(repoRoot, writeBook.sourceFileUsed);
  assertInside(tempBooksRoot, rawPath);
  const rawText = readText(rawPath);
  const generatedDir = path.join(generatedRoot, slug);
  const manifestPath = path.join(generatedDir, "manifest.json");
  const processedPath = path.join(generatedDir, "processed_book.json");
  const cleanedPath = path.join(generatedDir, "cleaned_book.json");
  const rightsPath = path.join(generatedDir, "rights_report.json");
  const notesPath = path.join(generatedDir, "processing_notes.md");
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  const dryRunBookJsonPath = path.join(dryRunRoot, "books", `${slug}.json`);
  const dryRunBookMdPath = path.join(dryRunRoot, "books", `${slug}.md`);

  const manifest = readJson<Manifest>(manifestPath);
  readJson<Record<string, unknown>>(processedPath);
  readJson<Record<string, unknown>>(cleanedPath);
  readJson<Record<string, unknown>>(rightsPath);
  readText(notesPath);
  readJson<Record<string, unknown>>(dryRunBookJsonPath);
  readText(dryRunBookMdPath);
  const preview = readJson<PreviewAsset>(previewPath);

  const sections = manifest.sections.map((section) => readSection(slug, section));
  const defaultSummaries = manifest.sections.filter((section) => section.includeByDefault);
  const defaultIds = new Set(defaultSummaries.map((section) => section.id));
  const firstSummary = manifest.sections[0] ?? null;
  const firstDefaultSummary = defaultSummaries[0] ?? null;
  const lastSummary = manifest.sections.at(-1) ?? null;
  const firstSection = firstSummary ? readSection(slug, firstSummary) : null;
  const firstDefaultSection = firstDefaultSummary ? readSection(slug, firstDefaultSummary) : null;
  const lastSection = lastSummary ? readSection(slug, lastSummary) : null;
  const defaultText = defaultSummaries.map((section) => sectionText(readSection(slug, section))).join("\n\n");

  const titleMatches =
    manifest.title === writeBook.generatedTitle &&
    manifest.title === writeBook.expectedTitle &&
    manifest.title === dryRunBook.expectedGeneratedTitle &&
    sourceContainsSnippet(rawText, writeBook.supportingSnippets.title || manifest.title, 5);
  const generatedTitleVerdict = titleMatches
    ? verdict("pass", `pass: generated title is ${manifest.title}`)
    : verdict("fail", "fail: generated title does not match dry-run/write/source evidence", [
        `manifest=${manifest.title}`,
        `write expected=${writeBook.expectedTitle}`,
        `dry-run expected=${dryRunBook.expectedGeneratedTitle}`,
      ]);

  const authorMatches =
    arraysEqual(manifest.author, writeBook.generatedAuthor) &&
    arraysEqual(manifest.author, writeBook.expectedAuthor) &&
    arraysEqual(manifest.author, dryRunBook.expectedAuthor) &&
    !manifest.author.some((author) => /^unknown author$/i.test(author)) &&
    sourceContainsSnippet(rawText, writeBook.authorEvidence.text, 5);
  const generatedAuthorVerdict = authorMatches
    ? verdict("pass", `pass: generated author is ${manifest.author.join(", ")}`)
    : verdict("fail", "fail: generated author does not match source-supported metadata", [
        `manifest=${manifest.author.join(", ")}`,
        `write expected=${writeBook.expectedAuthor.join(", ")}`,
        `evidence=${writeBook.authorEvidence.text}`,
      ]);

  const firstDefaultText = firstDefaultSection ? sectionText(firstDefaultSection) : "";
  const firstDefaultArtifacts = findNonPlayableArtifacts(firstDefaultText);
  const startLooksReadable =
    Boolean(firstDefaultSection) &&
    Boolean(firstDefaultSummary?.includeByDefault) &&
    defaultSummaries[0]?.id === firstDefaultSummary?.id &&
    firstDefaultArtifacts.length === 0 &&
    (sourceContainsSnippet(rawText, firstDefaultText.slice(0, 260)) ||
      sourceContainsSnippet(rawText, writeBook.supportingSnippets.start));
  const startBoundaryVerdict = startLooksReadable
    ? verdict(
        "pass",
        `pass: first default is ${firstDefaultSummary!.label}${
          firstDefaultSummary!.title ? ` - ${firstDefaultSummary!.title}` : ""
        } and starts from real readable content`,
      )
    : verdict("fail", "fail: first default section is missing, non-readable, or not source-traceable", [
        `firstDefault=${firstDefaultSummary?.id ?? "missing"}`,
        `artifacts=${firstDefaultArtifacts.join(", ") || "none"}`,
      ]);

  const lastText = lastSection ? sectionText(lastSection) : "";
  const lastArtifacts = findNonPlayableArtifacts(lastText.slice(-1400));
  const endLooksReadable =
    Boolean(lastSection) &&
    lastArtifacts.length === 0 &&
    (sourceContainsSnippet(rawText, lastText.slice(-320)) ||
      sourceContainsSnippet(rawText, writeBook.supportingSnippets.end));
  const endBoundaryVerdict = endLooksReadable
    ? verdict(
        "pass",
        `pass: generated output ends at ${lastSummary!.label}${
          lastSummary!.title ? ` - ${lastSummary!.title}` : ""
        } with source/license/end-matter tails removed`,
      )
    : verdict("fail", "fail: generated ending contains non-readable tail material or is not source-traceable", [
        `lastSection=${lastSummary?.id ?? "missing"}`,
        `artifacts=${lastArtifacts.join(", ") || "none"}`,
      ]);

  const sectionCountMatches =
    writeBook.finalAction === "first-time processed" &&
    manifest.sections.length === writeBook.sectionCount &&
    manifest.stats.sectionCount === writeBook.sectionCount &&
    sections.length === writeBook.sectionCount;
  const vagueFallback =
    dryRunBook.meaningfulHeadingsExist &&
    manifest.sections.some((section) => /^Part \d+$/i.test(section.label) && section.title === null);
  const sectioningVerdict =
    sectionCountMatches && !vagueFallback
      ? verdict("pass", `pass: ${manifest.sections.length} sections preserve ${writeBook.structuralConvention}`)
      : verdict("fail", "fail: sectioning count or heading strategy does not match source-backed write report", [
          `manifest=${manifest.sections.length}`,
          `write=${writeBook.sectionCount}`,
          `vagueFallback=${vagueFallback}`,
        ]);

  const cleanupArtifacts = findNonPlayableArtifacts(defaultText);
  const cleanupVerdict =
    cleanupArtifacts.length === 0
      ? verdict(
          "pass",
          "pass: no title/TOC/source/license/contributor/transcriber/byline/default-playback artifacts detected",
        )
      : verdict("fail", "fail: cleanup artifacts remain in default playback", cleanupArtifacts);

  const previewArtifacts = findNonPlayableArtifacts(preview.previewText);
  const previewValid =
    preview.slug === slug &&
    preview.contentVersion === manifest.contentVersion &&
    preview.contentHash === manifest.contentHash &&
    preview.defaultSectionId === firstDefaultSummary?.id &&
    Boolean(firstDefaultSection) &&
    previewStartsFromSection(preview.previewText, firstDefaultText) &&
    previewArtifacts.length === 0;
  const previewVerdict = previewValid
    ? verdict("pass", `pass: preview starts from ${preview.defaultSectionId} and matches generated content hash`)
    : verdict("fail", "fail: preview is stale, generic, or not aligned to first default section", [
        `previewDefault=${preview.defaultSectionId}`,
        `firstDefault=${firstDefaultSummary?.id ?? "missing"}`,
        `artifacts=${previewArtifacts.join(", ") || "none"}`,
      ]);

  const allSectionsDefault = manifest.sections.every((section) => defaultIds.has(section.id));
  const defaultOrderStartsAtFirstDefault =
    Boolean(defaultSummaries[0]) && defaultSummaries[0].id === firstDefaultSummary?.id;
  const allMainReadableDefaultVerdict =
    allSectionsDefault && defaultOrderStartsAtFirstDefault && /all .*default/i.test(writeBook.allMainReadableDefaultVerdict)
      ? verdict(
          "pass",
          "pass: all generated main readable sections are included by default and source order starts at first default",
        )
      : verdict("fail", "fail: default selection omits readable sections or source order does not start at first default", [
          `defaultCount=${defaultSummaries.length}`,
          `sectionCount=${manifest.sections.length}`,
        ]);

  const startupEntry = startupBooks.find((book) => book.slug === slug);
  const startupPreviewValid =
    writeBook.startupPreviewValid === true &&
    (startupEntry ? startupEntry.startupPreviewValid === true : previewValid);

  const failedVerdicts = [
    generatedTitleVerdict,
    generatedAuthorVerdict,
    startBoundaryVerdict,
    endBoundaryVerdict,
    sectioningVerdict,
    cleanupVerdict,
    previewVerdict,
    allMainReadableDefaultVerdict,
  ].filter((entry) => entry.status === "fail");
  const remainingWarnings = [
    ...failedVerdicts.map((entry) => entry.summary),
    ...(startupPreviewValid ? [] : ["fail: startup preview audit did not mark this book valid"]),
  ];
  const verificationStatus: VerificationStatus =
    remainingWarnings.length > 0 ? "fail" : "pass";

  return {
    slug,
    writeAction: "first-time processed",
    verificationStatus,
    rawSourceInspected: repoPath(rawPath),
    generatedOutputInspected: [
      manifestPath,
      processedPath,
      cleanedPath,
      rightsPath,
      notesPath,
      ...manifest.sections.map((section) => path.join(generatedDir, section.sectionJsonPath)),
    ].map(repoPath),
    previewAssetInspected: repoPath(previewPath),
    dryRunReportInspected: repoPath(path.join(dryRunRoot, "pilot-dry-run-8.json")),
    dryRunPerBookReportsInspected: [repoPath(dryRunBookJsonPath), repoPath(dryRunBookMdPath)],
    writeReportInspected: repoPath(path.join(writeRoot, "pilot-write-8.json")),
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
    correctionAppliedDuringVerification: CORRECTION_NOTES[slug] ?? null,
    snippets: {
      titleEvidence: compactText(writeBook.supportingSnippets.title || dryRunBook.snippets.title),
      authorEvidence: compactText(writeBook.authorEvidence.text),
      rawStart: compactText(writeBook.supportingSnippets.start || dryRunBook.snippets.start),
      generatedFirstSection: compactText(firstSection ? sectionText(firstSection) : null),
      generatedFirstDefault: compactText(firstDefaultText),
      previewStart: compactText(preview.previewText),
      rawEnd: compactText(writeBook.supportingSnippets.end || dryRunBook.snippets.end),
      generatedEnd: compactText(lastText.slice(-700)),
    },
  };
}

function writeMarkdownReport(report: {
  generatedAt: string;
  totals: Record<string, number>;
  qualityGateReportsRead: unknown;
  books: VerificationBook[];
  skippedDuplicate: Record<string, unknown>;
  unresolvedSourceGeneratedBooksLeftUntouched: unknown;
  unresolvedSourceGitStatus: string[];
}) {
  const lines = [
    "# Pilot write batch 8 verification",
    "",
    "Post-write QA pass for the 19 processed batch-8 books plus the duplicate skip.",
    "",
    "## Totals",
    "",
    `- Processed books verified: ${report.totals.processedVerified}`,
    `- Pass: ${report.totals.pass}`,
    `- Warn accepted: ${report.totals.warnAccepted}`,
    `- Fail: ${report.totals.fail}`,
    `- Accepted for main: ${report.totals.acceptedForMain}`,
    `- Corrections applied during verification: ${report.totals.correctionsApplied}`,
    "",
    "## Active quality-gate reports read",
    "",
    "```json",
    JSON.stringify(report.qualityGateReportsRead, null, 2),
    "```",
    "",
    "## Duplicate skip: the-wind-in-the-willows",
    "",
    `- Skipped as duplicate: ${report.skippedDuplicate.skippedAsDuplicate ? "yes" : "no"}`,
    `- No generated output created: ${report.skippedDuplicate.noGeneratedOutputCreated ? "yes" : "no"}`,
    `- No preview asset created: ${report.skippedDuplicate.noPreviewAssetCreated ? "yes" : "no"}`,
    `- Existing generated duplicate target unchanged: ${
      report.skippedDuplicate.existingGeneratedDuplicateTargetUnchanged ? "yes" : "no"
    }`,
    "- Accepted for skip: yes",
    "- Accepted as newly processed: no",
    `- Skip reason: ${report.skippedDuplicate.skipReason}`,
    "",
    "## Unresolved-source generated books left untouched",
    "",
    "```json",
    JSON.stringify(report.unresolvedSourceGeneratedBooksLeftUntouched, null, 2),
    "```",
    "",
    report.unresolvedSourceGitStatus.length === 0
      ? "Git status for unresolved-source generated books/previews: clean."
      : `Git status for unresolved-source generated books/previews:\n\n${report.unresolvedSourceGitStatus.join("\n")}`,
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
      `- Generated title verdict: ${book.generatedTitleVerdict.summary}`,
      `- Generated author verdict: ${book.generatedAuthorVerdict.summary}`,
      `- Selected structural convention: ${book.selectedStructuralConvention}`,
      `- Start boundary verdict: ${book.startBoundaryVerdict.summary}`,
      `- End boundary verdict: ${book.endBoundaryVerdict.summary}`,
      `- Sectioning verdict: ${book.sectioningVerdict.summary}`,
      `- Cleanup verdict: ${book.cleanupVerdict.summary}`,
      `- Preview verdict: ${book.previewVerdict.summary}`,
      `- All-main-readable-default verdict: ${book.allMainReadableDefaultVerdict.summary}`,
      `- Startup preview valid: ${book.startupPreviewValid ? "yes" : "no"}`,
      `- Accepted for main: ${book.acceptedForMain ? "yes" : "no"}`,
      `- Correction needed before main: ${book.correctionNeededBeforeMain ? "yes" : "no"}`,
      book.correctionAppliedDuringVerification
        ? `- Correction applied during verification: ${book.correctionAppliedDuringVerification}`
        : "- Correction applied during verification: none",
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
    path.join(verificationRoot, "pilot-write-8-verification.md"),
    `${lines.join("\n").trimEnd()}\n`,
  );
}

function main() {
  const dryRunJsonPath = path.join(dryRunRoot, "pilot-dry-run-8.json");
  const dryRunMdPath = path.join(dryRunRoot, "pilot-dry-run-8.md");
  const writeJsonPath = path.join(writeRoot, "pilot-write-8.json");
  const writeMdPath = path.join(writeRoot, "pilot-write-8.md");
  const dryRun = readJson<DryRunReport>(dryRunJsonPath);
  const write = readJson<WriteReport>(writeJsonPath);
  readText(dryRunMdPath);
  readText(writeMdPath);

  if (dryRun.reportName !== "pilot-dry-run-8" || write.reportName !== "pilot-write-8") {
    throw new Error("Missing or incorrect batch-8 dry-run/write reports.");
  }
  if (JSON.stringify(dryRun.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error("Dry-run selectedBooks do not match the expected batch-8 list.");
  }
  if (JSON.stringify(write.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error("Write selectedBooks do not match the expected batch-8 list.");
  }
  if (
    dryRun.selectedCount !== 20 ||
    write.totals.selected !== 20 ||
    write.totals.firstTimeProcessed !== 19 ||
    write.totals.skipped !== 1
  ) {
    throw new Error("Write report is missing or incomplete for batch 8.");
  }
  for (const slug of UNRESOLVED_SOURCE_GENERATED_BOOKS) {
    if (!write.unresolvedSourceGeneratedBooksLeftUntouched.some((book) => book.slug === slug)) {
      throw new Error(`Write report unresolved-source list is missing ${slug}.`);
    }
  }

  const quality = summarizeQualityReports();
  const books = PROCESSED_BATCH.map((slug) => {
    const dryRunBook = dryRun.books.find((book) => book.slug === slug);
    const writeBook = write.books.find((book) => book.slug === slug);
    if (!dryRunBook || !writeBook) {
      throw new Error(`${slug}: missing dry-run or write report entry.`);
    }
    if (writeBook.finalAction !== "first-time processed") {
      throw new Error(`${slug}: expected first-time processed write action.`);
    }
    return verifyProcessedBook(slug, dryRunBook, writeBook, quality.startupBooks);
  });

  const skippedWrite = write.books.find((book) => book.slug === SKIPPED_DUPLICATE_SLUG);
  const skippedGeneratedPath = path.join(generatedRoot, SKIPPED_DUPLICATE_SLUG);
  const skippedPreviewPath = path.join(previewRoot, `${SKIPPED_DUPLICATE_SLUG}.preview.json`);
  const existingGeneratedPath = path.join(generatedRoot, EXISTING_DUPLICATE_TARGET);
  const existingPreviewPath = path.join(previewRoot, `${EXISTING_DUPLICATE_TARGET}.preview.json`);
  const existingDuplicateGitStatus = gitStatusFor([
    repoPath(existingGeneratedPath),
    repoPath(existingPreviewPath),
  ]);
  const skippedDuplicate = {
    slug: SKIPPED_DUPLICATE_SLUG,
    writeAction: skippedWrite?.finalAction ?? null,
    skippedAsDuplicate:
      skippedWrite?.finalAction === "skipped" &&
      /existing generated slug wind-in-the-willows/i.test(skippedWrite.duplicateNearDuplicateSlugCheckResult),
    skipReason: skippedWrite?.duplicateNearDuplicateSlugCheckResult ?? null,
    noGeneratedOutputCreated: !fs.existsSync(skippedGeneratedPath),
    noPreviewAssetCreated: !fs.existsSync(skippedPreviewPath),
    existingGeneratedDuplicateTarget: EXISTING_DUPLICATE_TARGET,
    existingGeneratedDuplicateTargetPresent: fs.existsSync(existingGeneratedPath),
    existingPreviewDuplicateTargetPresent: fs.existsSync(existingPreviewPath),
    existingGeneratedDuplicateTargetUnchanged: existingDuplicateGitStatus.length === 0,
    acceptedForSkip: true,
    acceptedAsNewlyProcessed: false,
  };
  if (
    !skippedDuplicate.skippedAsDuplicate ||
    !skippedDuplicate.noGeneratedOutputCreated ||
    !skippedDuplicate.noPreviewAssetCreated ||
    !skippedDuplicate.existingGeneratedDuplicateTargetUnchanged
  ) {
    throw new Error("Duplicate skip verification failed for the-wind-in-the-willows.");
  }

  const unresolvedStatusPaths = UNRESOLVED_SOURCE_GENERATED_BOOKS.flatMap((slug) => [
    repoPath(path.join(generatedRoot, slug)),
    repoPath(path.join(previewRoot, `${slug}.preview.json`)),
  ]);
  const unresolvedSourceGitStatus = gitStatusFor(unresolvedStatusPaths);

  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = books.filter((book) => book.verificationStatus === "warn accepted").length;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;
  const correctionsApplied = books.filter((book) => book.correctionAppliedDuringVerification).length;
  const generatedAt = new Date().toISOString();
  const qualityGateReportsRead = {
    pathsRead: quality.pathsRead,
    startup: quality.startup,
    titleStartDefault: quality.titleStartDefault,
    metadataSegmentation: quality.metadataSegmentation,
    manualUiDefectFollowup: quality.manualUiDefectFollowup,
  };
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-8-verification",
    generatedAt,
    branch: "morsewords-book-processing-pilot-write-8-jun-2026",
    mode: "post-write verification",
    processedBooks: [...PROCESSED_BATCH],
    skippedDuplicate,
    totals: {
      processedVerified: books.length,
      pass,
      warnAccepted,
      fail,
      acceptedForMain: books.filter((book) => book.acceptedForMain).length,
      correctionsApplied,
      duplicateSkipped: 1,
      unresolvedSourceGeneratedBooksLeftUntouched:
        write.unresolvedSourceGeneratedBooksLeftUntouched.length,
    },
    requiredReportsRead: [
      repoPath(dryRunJsonPath),
      repoPath(dryRunMdPath),
      repoPath(path.join(dryRunRoot, "books")),
      repoPath(writeJsonPath),
      repoPath(writeMdPath),
      ...quality.pathsRead,
    ],
    qualityGateReportsRead,
    unresolvedSourceGeneratedBooksLeftUntouched: write.unresolvedSourceGeneratedBooksLeftUntouched,
    unresolvedSourceGeneratedBooksGitStatus: unresolvedSourceGitStatus,
    futureBatchRule: FUTURE_BATCH_RULE,
    laterPhaseRequirements: LATER_PHASE_REQUIREMENTS,
    books,
  };

  writeJson(path.join(verificationRoot, "pilot-write-8-verification.json"), report);
  writeMarkdownReport({
    generatedAt,
    totals: report.totals,
    qualityGateReportsRead,
    books,
    skippedDuplicate,
    unresolvedSourceGeneratedBooksLeftUntouched:
      write.unresolvedSourceGeneratedBooksLeftUntouched,
    unresolvedSourceGitStatus,
  });

  console.log(
    `Pilot write 8 verification complete: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail; ${correctionsApplied} corrections documented.`,
  );
  if (fail > 0) process.exitCode = 1;
}

main();
