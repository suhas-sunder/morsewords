import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
} from "./bookManifestTypes.ts";
import { normalizeBookText, textPreview } from "./bookTextNormalization.ts";

type DryRunStatus =
  | "already acceptable"
  | "needs correction before acceptance"
  | "manual review"
  | "blocked";

type WriteAction = "accepted without rewrite" | "corrected" | "skipped";
type VerificationStatus = "pass" | "warn accepted" | "fail";

type SectionSnapshot = {
  id: string | null;
  label: string | null;
  title: string | null;
  kind: BookSectionKind | null;
  includeByDefault: boolean | null;
  wordCount: number | null;
  snippet: string | null;
};

type DryRunBook = {
  slug: string;
  sourceFileUsed: string;
  detectedStructuralConvention: string;
  currentGeneratedSectionCount: number;
  firstDefaultSectionCurrently: SectionSnapshot;
  expectedFirstReadableSection?: {
    sourceLine: number | null;
    snippet: string | null;
  };
  boundaries: {
    startBoundaryVerdict: string;
    endBoundaryVerdict: string;
    sectioningVerdict: string;
    cleanupVerdict: string;
    previewVerdict: string;
    allMainReadableDefaultVerdict: string;
  };
  currentStatus: DryRunStatus;
  warnings: string[];
  hardFailReasons: string[];
};

type DryRunReport = {
  reportName: "pilot-dry-run-4";
  selectedBooks: string[];
  totals: {
    selectedBooks: number;
    alreadyAcceptable: number;
    needsCorrectionBeforeAcceptance: number;
    manualReview: number;
    blocked: number;
  };
  books: DryRunBook[];
};

type WriteBook = {
  slug: string;
  dryRunStatus: DryRunStatus;
  finalAction: WriteAction;
  sourceFileUsed: string;
  generatedFilesChanged: string[];
  previewAssetChanged: string | null;
  priorIssueFromDryRun: string[];
  startBoundaryUsed: {
    line: number | null;
    reason: string;
    snippet: string | null;
  };
  endBoundaryUsed: {
    line: number | null;
    reason: string;
    snippet: string | null;
  };
  structuralConvention: string;
  firstDefaultSectionBefore: SectionSnapshot;
  firstDefaultSectionAfter: SectionSnapshot;
  sectionCountBefore: number;
  sectionCountAfter: number;
  cleanupActionsApplied: unknown;
  previewVerdict: string;
  startupPreviewValid: boolean;
  allMainReadableDefaultVerdict: string;
  remainingWarnings: string[];
  finalRecommendation: "accepted for review" | "needs manual review" | "skipped";
  acceptedFromDryRunReason?: string;
  noFilesChanged?: boolean;
};

type WriteReport = {
  reportName: "pilot-write-4";
  selectedBooks: string[];
  totals: {
    selected: number;
    acceptedWithoutRewrite: number;
    corrected: number;
    skipped: number;
  };
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

type Verdict = {
  status: "pass" | "warn" | "fail";
  summary: string;
  details: string[];
};

type BookVerification = {
  slug: string;
  dryRunStatus: DryRunStatus;
  writeAction: WriteAction;
  verificationStatus: VerificationStatus;
  generatedOutputInspected: string[];
  previewAssetInspected: string;
  rawSourceInspected: string;
  dryRunReportInspected: string;
  writeReportInspected: string;
  dryRunPerBookReportInspected: string;
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
  correctedBookReview?: {
    previousDryRunDefect: string[];
    defectFixed: boolean;
    firstDefaultSectionBeforeCorrection: SectionSnapshot;
    firstDefaultSectionAfterCorrection: SectionSnapshot;
    sectionCountBefore: number;
    sectionCountAfter: number;
    previewBeforeAfter: {
      before: string;
      after: string;
    };
    finalVerdict: string;
  };
  acceptedWithoutRewriteReview?: {
    whyNoRewriteWasNeeded: string;
    firstDefaultSection: SectionSnapshot;
    sectioningVerdict: string;
    previewVerdict: string;
    finalAcceptanceVerdict: string;
  };
  snippets: {
    rawStart: string;
    generatedFirstDefault: string;
    previewStart: string;
    rawEnd: string;
    generatedEnd: string;
  };
};

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..", "..");
const tempBooksRoot = path.join(repoRoot, "app", "client", "assets", "temp-books");
const generatedRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
);
const previewRoot = path.join(repoRoot, "public", "book-previews");
const dryRunRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-dry-run-4",
);
const writeRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-4",
);
const verificationRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-4-verification",
);

const dryRunReportPath = path.join(dryRunRoot, "pilot-dry-run-4.json");
const dryRunMarkdownPath = path.join(dryRunRoot, "pilot-dry-run-4.md");
const writeReportPath = path.join(writeRoot, "pilot-write-4.json");
const writeMarkdownPath = path.join(writeRoot, "pilot-write-4.md");
const verificationJsonPath = path.join(
  verificationRoot,
  "pilot-write-4-verification.json",
);
const verificationMarkdownPath = path.join(
  verificationRoot,
  "pilot-write-4-verification.md",
);

const selectedBatch = [
  "a-childs-garden-of-verses",
  "alices-adventures-in-wonderland",
  "black-beauty",
  "botchan",
  "five-little-peppers-and-how-they-grew",
  "grimm-s-fairy-tales",
  "jane-eyre",
  "little-women",
  "new-treasure-seekers",
  "pride-and-prejudice",
  "rainbow-valley",
  "rinkitink-in-oz",
  "the-arabian-nights",
  "the-art-of-war",
  "the-book-of-dragons",
  "the-divine-comedy",
  "the-elements-of-style",
  "the-federalist-papers",
  "the-jungle-book",
  "the-princess-and-the-goblin",
  "the-railway-children",
  "the-sea-wolf",
  "the-secret-garden",
  "the-water-babies",
  "through-the-looking-glass",
] as const;

const acceptedWithoutRewrite = new Set([
  "alices-adventures-in-wonderland",
  "botchan",
  "jane-eyre",
  "rainbow-valley",
  "rinkitink-in-oz",
  "the-art-of-war",
  "the-princess-and-the-goblin",
  "the-railway-children",
  "the-sea-wolf",
  "the-secret-garden",
  "through-the-looking-glass",
]);

const correctedBooks = new Set([
  "a-childs-garden-of-verses",
  "black-beauty",
  "five-little-peppers-and-how-they-grew",
  "grimm-s-fairy-tales",
  "little-women",
  "new-treasure-seekers",
  "pride-and-prejudice",
  "the-arabian-nights",
  "the-book-of-dragons",
  "the-divine-comedy",
  "the-elements-of-style",
  "the-federalist-papers",
  "the-jungle-book",
  "the-water-babies",
]);

const focusedVerificationFixes = [
  {
    slug: "rinkitink-in-oz",
    previousVerificationStatus: "fail",
    correctionSummary:
      "Removed standalone illustration placeholders and illustration-only chapter-title captions from default playback.",
    artifactTypeRemoved:
      "99 bracketed illustration/image placeholder blocks and 23 standalone illustrated chapter-title caption lines.",
    generatedFilesChanged: [
      "app/client/assets/books/generated/rinkitink-in-oz/manifest.json",
      "app/client/assets/books/generated/rinkitink-in-oz/cleaned_book.json",
      "app/client/assets/books/generated/rinkitink-in-oz/processed_book.json",
      ...Array.from({ length: 24 }, (_, index) =>
        `app/client/assets/books/generated/rinkitink-in-oz/sections/chapter-${String(index + 1).padStart(3, "0")}.json`,
      ),
      "app/client/assets/books/generated/library-manifest.json",
    ],
    previewFilesChanged: [
      "public/book-previews/rinkitink-in-oz.preview.json",
      "public/book-previews/manifest.json",
    ],
  },
  {
    slug: "the-secret-garden",
    previousVerificationStatus: "fail",
    correctionSummary:
      "Removed bracketed illustration captions from default playback while preserving surrounding prose and dialogue.",
    artifactTypeRemoved:
      "3 bracketed illustration captions from chapters 13, 19, and 26.",
    generatedFilesChanged: [
      "app/client/assets/books/generated/the-secret-garden/manifest.json",
      "app/client/assets/books/generated/the-secret-garden/cleaned_book.json",
      "app/client/assets/books/generated/the-secret-garden/processed_book.json",
      "app/client/assets/books/generated/the-secret-garden/sections/chapter-013.json",
      "app/client/assets/books/generated/the-secret-garden/sections/chapter-019.json",
      "app/client/assets/books/generated/the-secret-garden/sections/chapter-026.json",
      "app/client/assets/books/generated/library-manifest.json",
    ],
    previewFilesChanged: [
      "public/book-previews/the-secret-garden.preview.json",
      "public/book-previews/manifest.json",
    ],
  },
] as const;

const nonPlayableKinds = new Set<BookSectionKind>([
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

const boilerplatePatterns = [
  /Project Gutenberg/i,
  /Gutenberg License/i,
  /Gutenberg eBook/i,
  /START OF (?:THE|THIS) PROJECT GUTENBERG/i,
  /END OF (?:THE|THIS) PROJECT GUTENBERG/i,
  /Release date:/i,
  /^Produced by\b/m,
  /Distributed Proofreading/i,
  /www\.gutenberg\.org/i,
  /Transcriber's Note/i,
];

const genericPreviewPatterns = [
  /SOS Help!/i,
  /generic placeholder/i,
  /reference file does not include body text/i,
  /book route is available/i,
  /missing source content/i,
  /^Title:\s/im,
  /^Author:\s/im,
  /^Contents$/im,
  /^Table of Contents$/im,
];

const defaultArtifactPatterns = [
  /\[(?:Illustration|Illustrations|Image|Plate|Map|Music|Facsimile|Portrait)[^\]]*\]/i,
  /^\s*\[page\s+\d+\]\s*$/im,
  /^\s*\[pg\s+\d+\]\s*$/im,
];

const reviewOnlyWarningPatterns = [
  /long book has huge sections/i,
  /At least one corrected story remains large/i,
  /body headings were found but rejected/i,
];

const ignoredWriteWarningPatterns = [
  /Structure detector observed/i,
  /Previous preview default was/i,
];

const futureBatchRule = [
  "valid generated readable content",
  "first default section from real readable content",
  "all main readable sections included by default",
  "valid book-specific startup preview",
  "no SOS Help!",
  "no generic preview fallback",
  "no title/TOC/source/license/contributor/transcriber material as default playback",
];

function readJson<T>(filePath: string) {
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

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertInside(parent: string, target: string) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to inspect outside ${parent}: ${target}`);
  }
}

function safeSourcePath(sourceFileUsed: string) {
  const resolved = path.resolve(repoRoot, sourceFileUsed);
  assertInside(tempBooksRoot, resolved);
  if (!fs.existsSync(resolved)) throw new Error(`Missing source file: ${sourceFileUsed}`);
  return resolved;
}

function normalizeForCompare(input: string) {
  return normalizeBookText(input)
    .normalize("NFKC")
    .replace(/\u00a0/g, " ")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function looseNormalize(input: string) {
  return normalizeForCompare(input).replace(/[^a-z0-9]+/g, " ").trim();
}

function textFromSection(section: GeneratedBookSectionJson | null | undefined) {
  return (section?.morseSourceText || section?.displayText || "").trim();
}

function compact(input: string | null | undefined, length = 260) {
  if (!input) return "";
  return textPreview(input.replace(/\s+/g, " ").trim(), length);
}

function hasMatches(input: string, patterns: RegExp[]) {
  return patterns.filter((pattern) => pattern.test(input)).map((pattern) => String(pattern));
}

function verdict(status: Verdict["status"], summary: string, details: string[] = []): Verdict {
  return {
    status,
    summary,
    details: [...new Set(details)].filter(Boolean),
  };
}

function defaultSections(sections: GeneratedBookSectionJson[]) {
  return sections.filter((section) => section.includeByDefault);
}

function mainReadableSections(sections: GeneratedBookSectionJson[]) {
  return sections.filter(
    (section) => !nonPlayableKinds.has(section.kind) && section.wordCount > 0,
  );
}

function loadSections(slug: string, manifest: GeneratedBookManifest) {
  return manifest.sections.map((summary) => {
    const sectionPath = path.join(generatedRoot, slug, summary.sectionJsonPath);
    assertInside(path.join(generatedRoot, slug), sectionPath);
    return readJson<GeneratedBookSectionJson>(sectionPath);
  });
}

function sectionSnapshot(section: GeneratedBookSectionJson | null): SectionSnapshot {
  if (!section) {
    return {
      id: null,
      label: null,
      title: null,
      kind: null,
      includeByDefault: null,
      wordCount: null,
      snippet: null,
    };
  }
  return {
    id: section.sectionId,
    label: section.label,
    title: section.title,
    kind: section.kind,
    includeByDefault: section.includeByDefault,
    wordCount: section.wordCount,
    snippet: compact(textFromSection(section)),
  };
}

function rawSnippetByOffset(rawText: string, offset: number | null | undefined, length = 360) {
  if (offset === null || offset === undefined || offset < 0 || offset >= rawText.length) {
    return "";
  }
  return compact(rawText.slice(offset, offset + length), length);
}

function rawTailSnippetByOffset(rawText: string, offset: number | null | undefined, length = 360) {
  if (offset === null || offset === undefined || offset <= 0) return "";
  return compact(rawText.slice(Math.max(0, offset - length), offset), length);
}

function generatedTextAppearsInRaw(rawText: string, generatedText: string) {
  const rawComparable = looseNormalize(rawText);
  const generatedComparable = looseNormalize(generatedText);
  const words = generatedComparable.split(/\s+/).filter(Boolean);
  const firstProbe = words.slice(0, 18).join(" ");
  const lastProbe = words.slice(-18).join(" ");
  return {
    firstProbeFound: firstProbe.length < 30 || rawComparable.includes(firstProbe),
    lastProbeFound: lastProbe.length < 30 || rawComparable.includes(lastProbe),
  };
}

function verifyFirstDefault(
  rawText: string,
  firstDefault: GeneratedBookSectionJson | null,
  writeBook: WriteBook,
) {
  if (!firstDefault) return verdict("fail", "No default readable section exists.");
  const firstText = textFromSection(firstDefault);
  const details: string[] = [];
  const unsafe = [
    ...hasMatches(firstText.slice(0, 800), boilerplatePatterns),
    ...hasMatches(firstText.slice(0, 800), genericPreviewPatterns),
  ];
  if (unsafe.length > 0) {
    return verdict("fail", "First default section starts with non-readable or source material.", unsafe);
  }
  if (firstDefault.wordCount < 20) {
    details.push(`First default section is short (${firstDefault.wordCount} words), but this may be expected for poems or rules.`);
  }
  const rawCheck = generatedTextAppearsInRaw(rawText, firstText);
  if (!rawCheck.firstProbeFound) {
    details.push("The first generated default section opening was not found in the raw source.");
  }
  if (writeBook.firstDefaultSectionAfter.id !== firstDefault.sectionId) {
    return verdict("fail", "Write report first-default claim does not match generated output.", [
      `Write report: ${writeBook.firstDefaultSectionAfter.id}; generated: ${firstDefault.sectionId}.`,
    ]);
  }
  if (!rawCheck.firstProbeFound) {
    return verdict("fail", "Generated default start could not be tied back to raw source.", details);
  }
  if (details.length > 0) {
    return verdict("warn", "First default section is readable, with review notes.", details);
  }
  return verdict("pass", "First default section starts from real readable generated content.");
}

function verifyEnding(rawText: string, lastDefault: GeneratedBookSectionJson | null) {
  if (!lastDefault) return verdict("fail", "No last default readable section exists.");
  const lastText = textFromSection(lastDefault);
  const unsafe = hasMatches(lastText.slice(-1600), boilerplatePatterns);
  if (unsafe.length > 0) {
    return verdict("fail", "Last default section contains source/license/footer material.", unsafe);
  }
  const rawCheck = generatedTextAppearsInRaw(rawText, lastText);
  if (!rawCheck.lastProbeFound) {
    return verdict("warn", "Generated ending needs review against raw source.", [
      "The final generated default-section tail was not found verbatim in the raw source after normalization.",
    ]);
  }
  return verdict("pass", "Generated default playback preserves the readable ending without footer leakage.");
}

function verifySectioning(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  writeBook: WriteBook,
) {
  const details: string[] = [];
  if (manifest.stats.sectionCount !== sections.length) {
    return verdict("fail", "Manifest section count does not match loaded section files.", [
      `Manifest: ${manifest.stats.sectionCount}; loaded: ${sections.length}.`,
    ]);
  }
  if (writeBook.sectionCountAfter !== manifest.stats.sectionCount) {
    return verdict("fail", "Write report section count does not match generated manifest.", [
      `Write report: ${writeBook.sectionCountAfter}; manifest: ${manifest.stats.sectionCount}.`,
    ]);
  }
  const bodySections = defaultSections(sections);
  if (manifest.stats.includedSectionCount !== bodySections.length) {
    return verdict("fail", "Manifest included-section count does not match defaults.", [
      `Manifest: ${manifest.stats.includedSectionCount}; defaults loaded: ${bodySections.length}.`,
    ]);
  }
  if (bodySections.length === 0) {
    return verdict("fail", "No generated sections are included by default.");
  }
  const totalWords = bodySections.reduce((sum, section) => sum + section.wordCount, 0);
  const giantFallbacks = bodySections.filter((section) => section.wordCount > 25_000);
  if (bodySections.length <= 2 && totalWords > 10_000) {
    return verdict("fail", "Readable content is collapsed into giant fallback blobs.", [
      `Default sections: ${bodySections.length}; default words: ${totalWords}.`,
    ]);
  }
  if (giantFallbacks.length > 0) {
    details.push(
      `Large real source sections retained without fake splitting: ${giantFallbacks.map((section) => `${section.sectionId} (${section.wordCount} words)`).join(", ")}.`,
    );
  }
  const emptyLabels = bodySections.filter((section) => !section.label.trim());
  if (emptyLabels.length > 0) {
    return verdict("fail", "Default sections contain empty labels.", emptyLabels.map((section) => section.sectionId));
  }
  if (writeBook.finalAction === "accepted without rewrite" && writeBook.generatedFilesChanged.length > 0) {
    return verdict("fail", "Accepted-without-rewrite book reports generated file changes.", writeBook.generatedFilesChanged);
  }
  if (details.length > 0) {
    return verdict("warn", "Sectioning matches the source structure with review notes.", details);
  }
  return verdict("pass", "Sectioning matches the selected source structure without fallback collapse.");
}

function verifyCleanup(sections: GeneratedBookSectionJson[]) {
  const readable = defaultSections(sections).map((section) => textFromSection(section)).join("\n\n");
  const issues = [
    ...hasMatches(readable, boilerplatePatterns).map((item) => `Default boilerplate: ${item}`),
    ...hasMatches(readable, genericPreviewPatterns).map((item) => `Default metadata/generic text: ${item}`),
    ...hasMatches(readable, defaultArtifactPatterns).map((item) => `Default artifact: ${item}`),
  ];
  if (/\uFFFD/.test(readable)) issues.push("Replacement characters remain in default playback.");
  if (issues.length > 0) {
    return verdict("fail", "Cleanup left source/default playback artifacts.", issues);
  }
  return verdict("pass", "Default playback excludes boilerplate, source/license material, and obvious artifacts.");
}

function verifyPreview(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  preview: PreviewAsset,
  firstDefault: GeneratedBookSectionJson | null,
) {
  const issues: string[] = [];
  if (preview.slug !== manifest.slug) issues.push("Preview slug does not match manifest.");
  if (preview.contentHash !== manifest.contentHash) issues.push("Preview contentHash does not match manifest.");
  if (preview.contentVersion !== manifest.contentVersion) issues.push("Preview contentVersion does not match manifest.");
  if (!preview.previewText.trim()) issues.push("Preview text is empty.");
  if (preview.defaultSectionId !== firstDefault?.sectionId) {
    issues.push(`Preview default section ${preview.defaultSectionId} does not match first default ${firstDefault?.sectionId ?? "none"}.`);
  }
  issues.push(
    ...hasMatches(preview.previewText, boilerplatePatterns).map((item) => `Preview boilerplate: ${item}`),
    ...hasMatches(preview.previewText, genericPreviewPatterns).map((item) => `Preview generic/default text: ${item}`),
    ...hasMatches(preview.previewText, defaultArtifactPatterns).map((item) => `Preview artifact: ${item}`),
  );
  const readable = defaultSections(sections).map((section) => textFromSection(section)).join("\n\n");
  const previewStart = normalizeForCompare(preview.previewText).slice(0, 120);
  const readableStart = normalizeForCompare(readable).slice(0, 180);
  if (previewStart && !readableStart.startsWith(previewStart.slice(0, 70))) {
    issues.push("Preview does not start from the first generated default-readable content.");
  }
  if (issues.length > 0) {
    return verdict("fail", "Preview asset failed verification.", issues);
  }
  return verdict("pass", "Preview is valid, book-specific, and starts from generated readable content.");
}

function verifyAllMainReadableDefault(sections: GeneratedBookSectionJson[]) {
  const defaultIds = new Set(defaultSections(sections).map((section) => section.sectionId));
  const missing = mainReadableSections(sections).filter((section) => !defaultIds.has(section.sectionId));
  if (missing.length > 0) {
    return verdict("fail", "Not all main readable sections are included by default.", [
      missing.map((section) => `${section.sectionId} ${section.label}`).join(", "),
    ]);
  }
  return verdict("pass", "All main readable sections are included by default.");
}

function reviewOnlyWarnings(writeBook: WriteBook, sectioningVerdict: Verdict) {
  const writeWarnings = writeBook.remainingWarnings.filter(
    (warning) =>
      !ignoredWriteWarningPatterns.some((pattern) => pattern.test(warning)) &&
      reviewOnlyWarningPatterns.some((pattern) => pattern.test(warning)),
  );
  const sectioningWarnings =
    sectioningVerdict.status === "warn" ? [sectioningVerdict.summary, ...sectioningVerdict.details] : [];
  return [...new Set([...writeWarnings, ...sectioningWarnings])];
}

function worseStatus(verdicts: Verdict[], nonBlockingWarnings: string[]): VerificationStatus {
  if (verdicts.some((item) => item.status === "fail")) return "fail";
  if (verdicts.some((item) => item.status === "warn") || nonBlockingWarnings.length > 0) {
    return "warn accepted";
  }
  return "pass";
}

function lineSnippetFromOffset(rawText: string, section: GeneratedBookSectionJson | null, end = false) {
  if (!section?.sourceOffsets) return "";
  return end
    ? rawTailSnippetByOffset(rawText, section.sourceOffsets.end)
    : rawSnippetByOffset(rawText, section.sourceOffsets.start);
}

function verifyBook(
  dryRunBook: DryRunBook,
  writeBook: WriteBook,
  dryRunMarkdown: string,
  writeMarkdown: string,
): BookVerification {
  if (dryRunMarkdown.length === 0 || writeMarkdown.length === 0) {
    throw new Error("Markdown reports were not inspected.");
  }
  const perBookDryRunPath = path.join(dryRunRoot, "books", `${writeBook.slug}.md`);
  const perBookDryRunMarkdown = fs.readFileSync(perBookDryRunPath, "utf8");
  if (perBookDryRunMarkdown.length === 0) {
    throw new Error(`Empty dry-run per-book report: ${writeBook.slug}`);
  }

  const sourcePath = safeSourcePath(writeBook.sourceFileUsed);
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const bookRoot = path.join(generatedRoot, writeBook.slug);
  assertInside(generatedRoot, bookRoot);
  const manifestPath = path.join(bookRoot, "manifest.json");
  const cleanedPath = path.join(bookRoot, "cleaned_book.json");
  const processedPath = path.join(bookRoot, "processed_book.json");
  const rightsPath = path.join(bookRoot, "rights_report.json");
  const notesPath = path.join(bookRoot, "processing_notes.md");
  const manifest = readJson<GeneratedBookManifest>(manifestPath);
  const sections = loadSections(writeBook.slug, manifest);
  const previewPath = path.join(previewRoot, `${writeBook.slug}.preview.json`);
  assertInside(previewRoot, previewPath);
  const preview = readJson<PreviewAsset>(previewPath);
  const defaults = defaultSections(sections);
  const firstDefault = defaults[0] ?? null;
  const lastDefault = defaults[defaults.length - 1] ?? null;

  const startBoundaryVerdict = verifyFirstDefault(rawText, firstDefault, writeBook);
  const endBoundaryVerdict = verifyEnding(rawText, lastDefault);
  const sectioningVerdict = verifySectioning(manifest, sections, writeBook);
  const cleanupVerdict = verifyCleanup(sections);
  const previewVerdict = verifyPreview(manifest, sections, preview, firstDefault);
  const allMainReadableDefaultVerdict = verifyAllMainReadableDefault(sections);
  const verdicts = [
    startBoundaryVerdict,
    endBoundaryVerdict,
    sectioningVerdict,
    cleanupVerdict,
    previewVerdict,
    allMainReadableDefaultVerdict,
  ];
  const nonBlockingWarnings = reviewOnlyWarnings(writeBook, sectioningVerdict);
  const verificationStatus = worseStatus(verdicts, nonBlockingWarnings);
  const correctionNeededBeforeMain = verificationStatus === "fail";
  const verdictWarnings = verdicts
    .filter((item) => item.status !== "pass")
    .flatMap((item) => [item.summary, ...item.details]);
  const generatedOutputInspected = [
    statusPath(manifestPath),
    statusPath(cleanedPath),
    statusPath(processedPath),
    statusPath(rightsPath),
    statusPath(notesPath),
    ...manifest.sections.map((section) => statusPath(path.join(bookRoot, section.sectionJsonPath))),
  ];

  return {
    slug: writeBook.slug,
    dryRunStatus: dryRunBook.currentStatus,
    writeAction: writeBook.finalAction,
    verificationStatus,
    generatedOutputInspected,
    previewAssetInspected: statusPath(previewPath),
    rawSourceInspected: statusPath(sourcePath),
    dryRunReportInspected: statusPath(dryRunReportPath),
    writeReportInspected: statusPath(writeReportPath),
    dryRunPerBookReportInspected: statusPath(perBookDryRunPath),
    selectedStructuralConvention: writeBook.structuralConvention,
    startBoundaryVerdict,
    endBoundaryVerdict,
    sectioningVerdict,
    cleanupVerdict,
    previewVerdict,
    allMainReadableDefaultVerdict,
    startupPreviewValid: previewVerdict.status !== "fail" && writeBook.startupPreviewValid,
    remainingWarnings: [...new Set([...nonBlockingWarnings, ...verdictWarnings])],
    acceptedForMain: !correctionNeededBeforeMain,
    correctionNeededBeforeMain,
    correctedBookReview:
      writeBook.finalAction === "corrected"
        ? {
            previousDryRunDefect: [...dryRunBook.hardFailReasons, ...dryRunBook.warnings],
            defectFixed: !correctionNeededBeforeMain,
            firstDefaultSectionBeforeCorrection: writeBook.firstDefaultSectionBefore,
            firstDefaultSectionAfterCorrection: sectionSnapshot(firstDefault),
            sectionCountBefore: writeBook.sectionCountBefore,
            sectionCountAfter: manifest.stats.sectionCount,
            previewBeforeAfter: {
              before: dryRunBook.firstDefaultSectionCurrently.snippet ?? "Previous preview text replaced by corrected generated preview.",
              after: compact(preview.previewText),
            },
            finalVerdict: correctionNeededBeforeMain
              ? "needs correction before main"
              : verificationStatus === "warn accepted"
                ? "accepted for main with review notes"
                : "accepted for main",
          }
        : undefined,
    acceptedWithoutRewriteReview:
      writeBook.finalAction === "accepted without rewrite"
        ? {
            whyNoRewriteWasNeeded:
              writeBook.acceptedFromDryRunReason ??
              "Dry-run batch 4 classified this book as already acceptable.",
            firstDefaultSection: sectionSnapshot(firstDefault),
            sectioningVerdict: sectioningVerdict.summary,
            previewVerdict: previewVerdict.summary,
            finalAcceptanceVerdict: correctionNeededBeforeMain
              ? "acceptance revoked; needs correction before main"
              : "dry-run acceptance remains valid",
          }
        : undefined,
    snippets: {
      rawStart: lineSnippetFromOffset(rawText, firstDefault),
      generatedFirstDefault: compact(textFromSection(firstDefault)),
      previewStart: compact(preview.previewText),
      rawEnd: lineSnippetFromOffset(rawText, lastDefault, true),
      generatedEnd: compact(textFromSection(lastDefault).slice(-900)),
    },
  };
}

function assertReportShape(dryRunReport: DryRunReport, writeReport: WriteReport) {
  if (dryRunReport.reportName !== "pilot-dry-run-4") {
    throw new Error("Dry-run report is not pilot-dry-run-4.");
  }
  if (writeReport.reportName !== "pilot-write-4") {
    throw new Error("Write report is missing or incomplete.");
  }
  const selected = [...selectedBatch].sort();
  if (JSON.stringify([...dryRunReport.selectedBooks].sort()) !== JSON.stringify(selected)) {
    throw new Error("Dry-run selected books do not match batch-4.");
  }
  if (JSON.stringify([...writeReport.selectedBooks].sort()) !== JSON.stringify(selected)) {
    throw new Error("Write selected books do not match batch-4.");
  }
  if (dryRunReport.books.length !== 25 || writeReport.books.length !== 25) {
    throw new Error("Expected 25 books in both dry-run and write reports.");
  }
  if (
    dryRunReport.totals.alreadyAcceptable !== 11 ||
    dryRunReport.totals.needsCorrectionBeforeAcceptance !== 14 ||
    writeReport.totals.acceptedWithoutRewrite !== 11 ||
    writeReport.totals.corrected !== 14 ||
    writeReport.totals.skipped !== 0
  ) {
    throw new Error("Batch-4 dry-run/write totals are not the expected 11/14/0 split.");
  }
  for (const slug of selectedBatch) {
    const dry = dryRunReport.books.find((book) => book.slug === slug);
    const write = writeReport.books.find((book) => book.slug === slug);
    if (!dry || !write) throw new Error(`Missing report entry for ${slug}.`);
    if (acceptedWithoutRewrite.has(slug) && write.finalAction !== "accepted without rewrite") {
      throw new Error(`${slug} should be accepted without rewrite.`);
    }
    if (correctedBooks.has(slug) && write.finalAction !== "corrected") {
      throw new Error(`${slug} should be corrected.`);
    }
  }
}

function verificationTotals(books: BookVerification[]) {
  const focusedCorrectionsNowPassing = focusedVerificationFixes.filter((fix) => {
    const book = books.find((candidate) => candidate.slug === fix.slug);
    return book && book.verificationStatus !== "fail";
  }).length;
  return {
    selected: books.length,
    pass: books.filter((book) => book.verificationStatus === "pass").length,
    warnAccepted: books.filter((book) => book.verificationStatus === "warn accepted").length,
    fail: books.filter((book) => book.verificationStatus === "fail").length,
    acceptedForMain: books.filter((book) => book.acceptedForMain).length,
    correctionNeededBeforeMain: books.filter((book) => book.correctionNeededBeforeMain).length,
    correctionsMadeDuringVerification: focusedCorrectionsNowPassing,
  };
}

function buildFocusedCorrectionNotes(books: BookVerification[]) {
  return focusedVerificationFixes.map((fix) => {
    const book = books.find((candidate) => candidate.slug === fix.slug);
    if (!book) throw new Error(`Missing focused correction book ${fix.slug}.`);
    return {
      ...fix,
      correctedNow: book.verificationStatus !== "fail",
      finalVerificationStatus: book.verificationStatus,
      startupPreviewVerdictAfterCorrection: book.startupPreviewValid
        ? "valid book-specific startup preview"
        : "startup preview still invalid",
      acceptedForMainAfterCorrection: book.acceptedForMain,
      remainingWarningsAfterCorrection: book.remainingWarnings,
    };
  });
}

function buildMarkdown(report: ReturnType<typeof buildReport>) {
  const lines: string[] = [];
  lines.push("# Pilot Write 4 Verification");
  lines.push("");
  lines.push(`Generated at: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Branch: ${report.branch}`);
  lines.push(`- Commit verified: ${report.commit}`);
  lines.push(`- Selected books verified: ${report.totals.selected}`);
  lines.push(`- Pass: ${report.totals.pass}`);
  lines.push(`- Warn accepted: ${report.totals.warnAccepted}`);
  lines.push(`- Fail: ${report.totals.fail}`);
  lines.push(`- Corrections made during verification: ${report.totals.correctionsMadeDuringVerification}`);
  lines.push(`- Correction needed before main: ${report.totals.correctionNeededBeforeMain}`);
  lines.push("");
  lines.push("## Focused Correction Note");
  lines.push("");
  for (const note of report.focusedCorrectionNotes) {
    lines.push(`### ${note.slug}`);
    lines.push("");
    lines.push(`- Failed before: ${note.previousVerificationStatus}`);
    lines.push(`- Corrected now: ${note.correctedNow ? "yes" : "no"}`);
    lines.push(`- Artifact removed: ${note.artifactTypeRemoved}`);
    lines.push(`- Correction: ${note.correctionSummary}`);
    lines.push(`- Startup preview after correction: ${note.startupPreviewVerdictAfterCorrection}`);
    lines.push(`- Final verification status after rerun: ${note.finalVerificationStatus}`);
    lines.push(`- Generated files changed: ${note.generatedFilesChanged.join(", ")}`);
    lines.push(`- Preview files changed: ${note.previewFilesChanged.join(", ")}`);
    lines.push("");
  }
  lines.push("## Results");
  lines.push("");
  lines.push("| Book | Write action | Verification | Accepted for main | Notes |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const book of report.books) {
    const notes = book.remainingWarnings.length > 0 ? book.remainingWarnings.join("; ") : "none";
    lines.push(
      `| ${book.slug} | ${book.writeAction} | ${book.verificationStatus} | ${book.acceptedForMain ? "yes" : "no"} | ${notes.replace(/\|/g, "\\|")} |`,
    );
  }
  lines.push("");
  lines.push("## Corrected Books");
  lines.push("");
  for (const book of report.books.filter((item) => item.writeAction === "corrected")) {
    const focus = book.correctedBookReview!;
    lines.push(`### ${book.slug}`);
    lines.push("");
    lines.push(`- Previous defect fixed: ${focus.defectFixed ? "yes" : "no"}`);
    lines.push(`- First default before: ${focus.firstDefaultSectionBeforeCorrection.id ?? "none"} ${focus.firstDefaultSectionBeforeCorrection.label ?? ""}`);
    lines.push(`- First default after: ${focus.firstDefaultSectionAfterCorrection.id ?? "none"} ${focus.firstDefaultSectionAfterCorrection.label ?? ""}`);
    lines.push(`- Section count before/after: ${focus.sectionCountBefore} -> ${focus.sectionCountAfter}`);
    lines.push(`- Preview after: ${focus.previewBeforeAfter.after}`);
    lines.push(`- Final verdict: ${focus.finalVerdict}`);
    lines.push(`- Start: ${book.startBoundaryVerdict.summary}`);
    lines.push(`- End: ${book.endBoundaryVerdict.summary}`);
    lines.push(`- Sectioning: ${book.sectioningVerdict.summary}`);
    lines.push("");
  }
  lines.push("## Accepted Without Rewrite");
  lines.push("");
  for (const book of report.books.filter((item) => item.writeAction === "accepted without rewrite")) {
    const focus = book.acceptedWithoutRewriteReview!;
    lines.push(`- ${book.slug}: ${focus.finalAcceptanceVerdict}; first default ${focus.firstDefaultSection.id ?? "none"} ${focus.firstDefaultSection.label ?? ""}; ${focus.previewVerdict}`);
  }
  lines.push("");
  lines.push("## Future Batch Rule");
  lines.push("");
  lines.push("Future book batches fail unless every processed book has:");
  for (const rule of report.futureBatchRule) lines.push(`- ${rule}`);
  while (lines.at(-1) === "") lines.pop();
  return `${lines.join("\n")}\n`;
}

function buildReport(books: BookVerification[]) {
  return {
    reportName: "pilot-write-4-verification",
    generatedAt: new Date().toISOString(),
    branch: execSync("git branch --show-current", { cwd: repoRoot, encoding: "utf8" }).trim(),
    commit: execSync("git rev-parse HEAD", { cwd: repoRoot, encoding: "utf8" }).trim(),
    selectedBooks: [...selectedBatch],
    acceptedWithoutRewriteBooks: [...acceptedWithoutRewrite].sort(),
    correctedBooks: [...correctedBooks].sort(),
    totals: verificationTotals(books),
    focusedCorrectionNotes: buildFocusedCorrectionNotes(books),
    futureBatchRule,
    books,
  };
}

function main() {
  const dryRunReport = readJson<DryRunReport>(dryRunReportPath);
  const writeReport = readJson<WriteReport>(writeReportPath);
  const dryRunMarkdown = fs.readFileSync(dryRunMarkdownPath, "utf8");
  const writeMarkdown = fs.readFileSync(writeMarkdownPath, "utf8");
  assertReportShape(dryRunReport, writeReport);

  const dryBySlug = new Map(dryRunReport.books.map((book) => [book.slug, book]));
  const writeBySlug = new Map(writeReport.books.map((book) => [book.slug, book]));
  const books = selectedBatch.map((slug) => {
    const dry = dryBySlug.get(slug);
    const write = writeBySlug.get(slug);
    if (!dry || !write) throw new Error(`Missing batch-4 book report: ${slug}`);
    return verifyBook(dry, write, dryRunMarkdown, writeMarkdown);
  });
  const report = buildReport(books);
  writeJson(verificationJsonPath, report);
  writeText(verificationMarkdownPath, buildMarkdown(report));
  console.log(
    `Pilot write 4 verification complete: ${report.totals.pass} pass, ${report.totals.warnAccepted} warn accepted, ${report.totals.fail} fail.`,
  );
}

main();
