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
  startBoundaryUsed: {
    cleanedLine: number | null;
    reason: string;
    snippet: string | null;
  };
  endBoundaryUsed: {
    cleanedLine: number | null;
    reason: string;
    snippet: string | null;
  };
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

type KnownExclusionVerification = {
  slug: string;
  generatedStatus: string[];
  previewStatus: string[];
  reintroducedInWriteReport: boolean;
  untouched: boolean;
};

type PlaywrightTriage = {
  priorFailureTitle: string;
  priorFailureAssertion: string;
  priorFailureExpected: string;
  priorFailureActual: string;
  priorFailureSelector: string;
  priorFailureTiming: string;
  priorFailureSurface: string;
  writeBranchFullSuite: string;
  mainFullSuite: string;
  writeBranchNonFullscreenSubset: string;
  classification: "flaky/unstable assertion" | "pre-existing main failure" | "branch regression";
  uiCodeChanged: boolean;
  notes: string[];
};

type AuditSideEffectHandling = {
  titleStartDefaultAuditKnownUnrelatedCorrections: number;
  unrelatedAuditChurnCommitted: boolean;
  handling: string;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-11");
const writeRoot = path.join(auditRoot, "pilot-write-11");
const verificationRoot = path.join(auditRoot, "pilot-write-11-verification");

const PROCESSED_BATCH = [
  "cool-air",
  "the-dream-of-little-tuk",
  "the-false-collar",
  "the-naughty-boy",
  "the-red-shoes",
  "the-shadow",
  "the-story-of-a-mother",
  "the-ugly-duckling",
  "the-adventures-of-chanticleer-and-partlet",
  "jorinda-and-jorindel",
  "mother-holle",
  "rapunzel",
  "the-juniper-tree",
  "the-seven-ravens",
  "the-wedding-of-mrs-fox",
  "the-adventures-of-kintaro-the-golden-boy",
  "the-bamboo-cutter-and-the-moon-child",
  "the-goblin-of-adachigahara",
  "the-jelly-fish-and-the-monkey",
  "the-tongue-cut-sparrow",
] as const;

const SELECTED_BATCH = PROCESSED_BATCH;

const KNOWN_DUPLICATE_BOUNDARY_EXCLUSIONS = [
  "the-wind-in-the-willows",
  "the-two-magics-the-turn-of-the-screw-covering-end",
  "the-works-of-edgar-allan-poe",
] as const;

const PLAYWRIGHT_TRIAGE: PlaywrightTriage = {
  priorFailureTitle:
    "Morse book page foundation > renders an approved external-authority Gutenberg book as a public page",
  priorFailureAssertion:
    'expect(getByTestId("book-video-preview-fullscreen-overlay")).toHaveAttribute("data-fullscreen-controls-visible", "false")',
  priorFailureExpected: "false",
  priorFailureActual: "true",
  priorFailureSelector: 'getByTestId("book-video-preview-fullscreen-overlay")',
  priorFailureTiming:
    "after entering fullscreen; overlay had data-fullscreen-active=\"true\" and data-fullscreen-mode=\"browser\"",
  priorFailureSurface:
    "general approved external-authority Gutenberg book public page UI, specifically Treasure Island, not a batch-11 generated book page",
  writeBranchFullSuite:
    "2026-06-19 verification rerun on morsewords-book-processing-pilot-write-11-jun-2026: 35 passed, 1 failed with --reporter=line; sole failure was the Treasure Island fullscreen-controls assertion",
  mainFullSuite:
    "2026-06-19 comparison rerun on latest main after git fetch/pull and typecheck: 35 passed, 1 failed with --reporter=line; same Treasure Island fullscreen-controls assertion failed",
  writeBranchNonFullscreenSubset:
    "2026-06-19 follow-up on morsewords-book-processing-pilot-write-11-jun-2026 with the Treasure Island fullscreen-controls test excluded: 35 passed with --reporter=line",
  classification: "pre-existing main failure",
  uiCodeChanged: false,
  notes: [
    "The same full Playwright command failed on the write branch and on latest main with identical selector, assertion, expected value, and actual value.",
    "The narrowed non-fullscreen/book-page subset passed on the write branch after excluding that one known fullscreen assertion.",
    "The failing test is the Treasure Island public page, not a newly generated batch-11 book.",
    "The failure occurs after the test opens fullscreen and waits for controls to auto-hide; data-fullscreen-controls-visible remains true instead of false.",
    "No fullscreen, hover, bulb, dark-mode, or live-preview UI code was modified in this verification branch.",
    "Classified as a pre-existing non-book UX/test failure on main, not a batch-11 regression.",
  ],
};

const AUDIT_SIDE_EFFECT_HANDLING: AuditSideEffectHandling = {
  titleStartDefaultAuditKnownUnrelatedCorrections: 12,
  unrelatedAuditChurnCommitted: false,
  handling:
    "books:title-start-default-audit is known to reapply 12 unrelated older generated-book corrections; validation side effects are restored unless they are explicit batch-11 corrections.",
};

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

const CORRECTION_NOTES: Record<string, string> = {};

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
  "after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages",
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

function authorSourceSupported(rawText: string, authors: string[], evidence: Evidence): boolean {
  if (sourceContainsSnippet(rawText, evidence.text, 5)) return true;
  if (authors.some((author) => sourceContainsSnippet(rawText, author, 5))) return true;
  if (
    authors.some((author) => normalizeForCompare(author) === "h p lovecraft") &&
    /Lovecraft/i.test(rawText)
  ) {
    return true;
  }
  return false;
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
    !manifest.author.some((author) => /^unknown author$/i.test(author)) &&
    authorSourceSupported(rawText, manifest.author, writeBook.authorEvidence);
  const generatedAuthorVerdict = authorMatches
    ? verdict("pass", `pass: generated author is ${manifest.author.join(", ")}`)
    : verdict("fail", "fail: generated author does not match source-supported metadata", [
        `manifest=${manifest.author.join(", ")}`,
        `write expected=${writeBook.expectedAuthor.join(", ")}`,
        `dry-run expected=${dryRunBook.expectedAuthor.join(", ")}`,
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
      sourceContainsSnippet(rawText, writeBook.startBoundaryUsed.snippet) ||
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
    dryRunReportInspected: repoPath(path.join(dryRunRoot, "pilot-dry-run-11.json")),
    dryRunPerBookReportsInspected: [repoPath(dryRunBookJsonPath), repoPath(dryRunBookMdPath)],
    writeReportInspected: repoPath(path.join(writeRoot, "pilot-write-11.json")),
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
      rawStart: compactText(writeBook.startBoundaryUsed.snippet || writeBook.supportingSnippets.start || dryRunBook.snippets.start),
      generatedFirstSection: compactText(firstSection ? sectionText(firstSection) : null),
      generatedFirstDefault: compactText(firstDefaultText),
      previewStart: compactText(preview.previewText),
      rawEnd: compactText(writeBook.endBoundaryUsed.snippet || writeBook.supportingSnippets.end || dryRunBook.snippets.end),
      generatedEnd: compactText(lastText.slice(-700)),
    },
  };
}

function writeMarkdownReport(report: {
  generatedAt: string;
  totals: Record<string, number>;
  qualityGateReportsRead: unknown;
  playwrightTriage: PlaywrightTriage;
  auditSideEffectHandling: AuditSideEffectHandling;
  books: VerificationBook[];
  knownDuplicateBoundaryExclusions: KnownExclusionVerification[];
  unresolvedSourceGeneratedBooksLeftUntouched: unknown;
  unresolvedSourceGitStatus: string[];
}) {
  const lines = [
    "# Pilot write batch 11 verification",
    "",
    "Post-write QA pass for the 20 processed batch-11 books.",
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
    "## Playwright fullscreen-controls triage",
    "",
    `- Classification: ${report.playwrightTriage.classification}`,
    `- Prior failing test: ${report.playwrightTriage.priorFailureTitle}`,
    `- Prior assertion: ${report.playwrightTriage.priorFailureAssertion}`,
    `- Prior expected/actual: ${report.playwrightTriage.priorFailureExpected} / ${report.playwrightTriage.priorFailureActual}`,
    `- Selector: ${report.playwrightTriage.priorFailureSelector}`,
    `- Timing: ${report.playwrightTriage.priorFailureTiming}`,
    `- Surface: ${report.playwrightTriage.priorFailureSurface}`,
    `- Write branch rerun: ${report.playwrightTriage.writeBranchFullSuite}`,
    `- Main rerun: ${report.playwrightTriage.mainFullSuite}`,
    `- Write branch non-fullscreen subset: ${report.playwrightTriage.writeBranchNonFullscreenSubset}`,
    `- UI code changed: ${report.playwrightTriage.uiCodeChanged ? "yes" : "no"}`,
    ...report.playwrightTriage.notes.map((note) => `- ${note}`),
    "",
    "## Audit side-effect handling",
    "",
    `- Known unrelated title/start/default auto-corrections: ${report.auditSideEffectHandling.titleStartDefaultAuditKnownUnrelatedCorrections}`,
    `- Unrelated audit churn committed: ${report.auditSideEffectHandling.unrelatedAuditChurnCommitted ? "yes" : "no"}`,
    `- Handling: ${report.auditSideEffectHandling.handling}`,
    "",
    "## Active quality-gate reports read",
    "",
    "```json",
    JSON.stringify(report.qualityGateReportsRead, null, 2),
    "```",
    "",
    "## Known duplicate/boundary exclusions not reintroduced",
    "",
    ...report.knownDuplicateBoundaryExclusions.flatMap((book) => [
      `### ${book.slug}`,
      "",
      `- Reintroduced in write report: ${book.reintroducedInWriteReport ? "yes" : "no"}`,
      `- Generated status: ${book.generatedStatus.length > 0 ? book.generatedStatus.join("; ") : "clean"}`,
      `- Preview status: ${book.previewStatus.length > 0 ? book.previewStatus.join("; ") : "clean"}`,
      `- Untouched: ${book.untouched ? "yes" : "no"}`,
      "",
    ]),
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
    path.join(verificationRoot, "pilot-write-11-verification.md"),
    `${lines.join("\n").trimEnd()}\n`,
  );
}

function main() {
  const dryRunJsonPath = path.join(dryRunRoot, "pilot-dry-run-11.json");
  const dryRunMdPath = path.join(dryRunRoot, "pilot-dry-run-11.md");
  const writeJsonPath = path.join(writeRoot, "pilot-write-11.json");
  const writeMdPath = path.join(writeRoot, "pilot-write-11.md");
  const dryRun = readJson<DryRunReport>(dryRunJsonPath);
  const write = readJson<WriteReport>(writeJsonPath);
  readText(dryRunMdPath);
  readText(writeMdPath);

  if (dryRun.reportName !== "pilot-dry-run-11" || write.reportName !== "pilot-write-11") {
    throw new Error("Missing or incorrect batch-11 dry-run/write reports.");
  }
  if (JSON.stringify(dryRun.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error("Dry-run selectedBooks do not match the expected batch-11 list.");
  }
  if (JSON.stringify(write.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error("Write selectedBooks do not match the expected batch-11 list.");
  }
  if (
    dryRun.selectedCount !== 20 ||
    write.totals.selected !== 20 ||
    write.totals.firstTimeProcessed !== 20 ||
    write.totals.skipped !== 0
  ) {
    throw new Error("Write report is missing or incomplete for batch 11.");
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

  const knownDuplicateBoundaryExclusions: KnownExclusionVerification[] =
    KNOWN_DUPLICATE_BOUNDARY_EXCLUSIONS.map((slug) => {
      const generatedStatus = gitStatusFor([repoPath(path.join(generatedRoot, slug))]);
      const previewStatus = gitStatusFor([repoPath(path.join(previewRoot, `${slug}.preview.json`))]);
      const reintroducedInWriteReport = write.books.some((book) => book.slug === slug);
      return {
        slug,
        generatedStatus,
        previewStatus,
        reintroducedInWriteReport,
        untouched:
          generatedStatus.length === 0 &&
          previewStatus.length === 0 &&
          !reintroducedInWriteReport,
      };
    });
  if (knownDuplicateBoundaryExclusions.some((entry) => !entry.untouched)) {
    throw new Error("Known duplicate/boundary exclusions were touched or reintroduced.");
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
    reportName: "pilot-write-11-verification",
    generatedAt,
    branch: "morsewords-book-processing-pilot-write-11-jun-2026",
    mode: "post-write verification",
    processedBooks: [...PROCESSED_BATCH],
    knownDuplicateBoundaryExclusions,
    playwrightTriage: PLAYWRIGHT_TRIAGE,
    auditSideEffectHandling: AUDIT_SIDE_EFFECT_HANDLING,
    totals: {
      processedVerified: books.length,
      pass,
      warnAccepted,
      fail,
      acceptedForMain: books.filter((book) => book.acceptedForMain).length,
      correctionsApplied,
      knownDuplicateBoundaryExclusionsVerified: knownDuplicateBoundaryExclusions.length,
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

  writeJson(path.join(verificationRoot, "pilot-write-11-verification.json"), report);
  writeMarkdownReport({
    generatedAt,
    totals: report.totals,
    qualityGateReportsRead,
    playwrightTriage: PLAYWRIGHT_TRIAGE,
    auditSideEffectHandling: AUDIT_SIDE_EFFECT_HANDLING,
    books,
    knownDuplicateBoundaryExclusions,
    unresolvedSourceGeneratedBooksLeftUntouched:
      write.unresolvedSourceGeneratedBooksLeftUntouched,
    unresolvedSourceGitStatus,
  });

  console.log(
    `Pilot write 11 verification complete: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail; ${correctionsApplied} corrections documented.`,
  );
  if (fail > 0) process.exitCode = 1;
}

main();
