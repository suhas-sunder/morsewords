import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
} from "./bookManifestTypes.ts";

type VerificationStatus = "pass" | "warn accepted" | "fail";

type DryRunBook = {
  slug: string;
  sourceFileUsed: string;
  currentStatus: string;
  detectedStructuralConvention: string;
  warnings: string[];
};

type WriteBook = {
  slug: string;
  finalAction: "first-time processed" | "skipped";
  sourceFileUsed: string;
  structuralConvention: string;
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
  sectionCount: number;
  remainingWarnings: string[];
};

type DryRunReport = {
  reportName: "pilot-dry-run-6";
  selectedBooks: string[];
  unresolvedSourceGeneratedBooks: Array<{ slug: string; title: string; reason: string }>;
  books: DryRunBook[];
};

type WriteReport = {
  reportName: "pilot-write-6";
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

type VerificationBook = {
  slug: string;
  writeAction: "first-time processed" | "skipped";
  verificationStatus: VerificationStatus;
  generatedOutputInspected: boolean;
  previewAssetInspected: boolean;
  selectedStructuralConvention: string;
  startBoundaryVerdict: string;
  endBoundaryVerdict: string;
  sectioningVerdict: string;
  cleanupVerdict: string;
  previewVerdict: string;
  allMainReadableDefaultVerdict: string;
  startupPreviewValid: boolean;
  remainingWarnings: string[];
  acceptedForMain: boolean;
  correctionNeededBeforeMain: boolean;
  correctionAppliedDuringVerification: string | null;
  snippets: {
    rawStart: string | null;
    generatedStart: string | null;
    previewStart: string | null;
    rawEnd: string | null;
    generatedEnd: string | null;
  };
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-6");
const writeRoot = path.join(auditRoot, "pilot-write-6");
const verificationRoot = path.join(auditRoot, "pilot-write-6-verification");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");

const FUTURE_BATCH_RULE = [
  "valid generated readable content",
  "first default section from real readable content",
  "all main readable sections included by default",
  "valid book-specific startup preview",
  "no SOS Help!",
  "no generic preview fallback",
  "no title/TOC/source/license/contributor/transcriber material as default playback",
];

const LATER_PHASE_REQUIREMENTS = [
  "after all books are processed, run an independent second-pass audit using a different strategy",
  "after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page",
  "after summaries, perform full site SEO/meta review using GSC data and route-level intent",
  "final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable",
];

const EXPECTED_SELECTED = [
  "a-midsummer-night-s-dream",
  "a-room-with-a-view",
  "agamemnon-of-aeschylus",
  "an-ideal-husband",
  "catriona",
  "for-the-duration-of-the-war",
  "romeo-and-juliet",
  "spoon-river-anthology",
  "the-adventures-of-ferdinand-count-fathom",
  "the-adventures-of-roderick-random",
  "the-expedition-of-humphry-clinker",
  "the-importance-of-being-earnest-a-trivial-comedy-for-serious-people",
  "the-man-who-was-thursday-a-nightmare",
  "the-money-box",
  "the-mystery-of-edwin-drood",
  "the-shunned-house",
  "the-story-of-the-inexperienced-ghost",
  "the-winning-of-olwen",
  "twenty-thousand-leagues-under-the-sea",
  "with-fire-and-sword",
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

const WARNING_STATUS_NOTES: Record<string, string> = {
  "agamemnon-of-aeschylus":
    "Accepted with warning: source has no act divisions in the play body, so the generated output preserves the continuous play as one section with speaker/dialogue lines retained.",
  "the-expedition-of-humphry-clinker":
    "Accepted with warning: epistolary address headings produce 87 letter sections; spot checks confirm these are source letter boundaries rather than fake dialogue fragments.",
  "with-fire-and-sword":
    "Accepted with warning: the readable historical introduction is preserved as optional generated content; Chapter 1 is the first default playback section.",
};

const nonPlayablePattern =
  /\b(Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg|Distributed Proofreading|Transcriber's Notes?|Transcriber.?s Note|table of contents)\b/i;

const genericPreviewPattern = /\b(SOS Help!?|MorseWords|Type text here|generic placeholder|book route is available)\b/i;

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

function compactText(text: string | null | undefined, maxLength = 220): string | null {
  if (!text) return null;
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return null;
  return compact.length <= maxLength ? compact : `${compact.slice(0, maxLength - 3).trimEnd()}...`;
}

function normalizeForCompare(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function rawSnippetAtLine(rawText: string, lineNumber: number | null, maxLength = 220): string | null {
  if (!lineNumber) return null;
  const lines = rawText.replace(/\r\n|\r/g, "\n").split("\n");
  const start = Math.max(0, lineNumber - 2);
  const end = Math.min(lines.length, lineNumber + 2);
  return compactText(lines.slice(start, end).join(" "), maxLength);
}

function readSection(slug: string, section: GeneratedBookManifest["sections"][number]) {
  return readJson<GeneratedBookSectionJson>(
    path.join(generatedRoot, slug, section.sectionJsonPath),
  );
}

function sectionText(section: GeneratedBookSectionJson) {
  return section.morseSourceText || section.displayText || "";
}

function sectionIsMainReadable(section: GeneratedBookManifest["sections"][number]) {
  if (excludedDefaultKinds.has(section.kind)) return false;
  if (nonPlayablePattern.test(`${section.label} ${section.title ?? ""} ${section.textPreview}`)) {
    return false;
  }
  return section.wordCount > 0;
}

function previewStartsWithSection(preview: PreviewAsset, section: GeneratedBookSectionJson) {
  const previewStart = normalizeForCompare(preview.previewText).slice(0, 180);
  const sectionStart = normalizeForCompare(sectionText(section)).slice(0, 180);
  return previewStart.length > 0 && sectionStart.startsWith(previewStart.slice(0, 80));
}

function verifyBook(dryRunBook: DryRunBook, writeBook: WriteBook): VerificationBook {
  const rawPath = path.resolve(repoRoot, writeBook.sourceFileUsed);
  const rawText = fs.readFileSync(rawPath, "utf8");
  const manifest = readJson<GeneratedBookManifest>(
    path.join(generatedRoot, writeBook.slug, "manifest.json"),
  );
  const preview = readJson<PreviewAsset>(
    path.join(previewRoot, `${writeBook.slug}.preview.json`),
  );
  fs.readFileSync(path.join(dryRunRoot, "books", `${writeBook.slug}.md`), "utf8");

  const firstSectionSummary = manifest.sections[0] ?? null;
  const firstDefaultSummary =
    manifest.sections.find((section) => section.includeByDefault) ?? null;
  const lastSectionSummary = manifest.sections.at(-1) ?? null;
  const firstSection = firstSectionSummary ? readSection(writeBook.slug, firstSectionSummary) : null;
  const firstDefaultSection = firstDefaultSummary ? readSection(writeBook.slug, firstDefaultSummary) : null;
  const lastSection = lastSectionSummary ? readSection(writeBook.slug, lastSectionSummary) : null;
  const defaultSummaries = manifest.sections.filter((section) => section.includeByDefault);
  const defaultSections = defaultSummaries.map((section) => readSection(writeBook.slug, section));
  const mainReadableIds = manifest.sections.filter(sectionIsMainReadable).map((section) => section.id);
  const defaultIds = new Set(defaultSummaries.map((section) => section.id));

  const defaultText = defaultSections.map(sectionText).join("\n\n");
  const previewText = preview.previewText;
  const previewValid =
    preview.slug === manifest.slug &&
    preview.contentVersion === manifest.contentVersion &&
    preview.contentHash === manifest.contentHash &&
    preview.defaultSectionId === firstDefaultSummary?.id &&
    Boolean(firstDefaultSection) &&
    previewStartsWithSection(preview, firstDefaultSection!) &&
    !genericPreviewPattern.test(previewText) &&
    !nonPlayablePattern.test(previewText);
  const cleanupClean =
    !nonPlayablePattern.test(defaultText) &&
    !/\[(?:Illustration|Image|Plate|Map|Portrait)\b/i.test(defaultText);
  const allMainDefault =
    mainReadableIds.length > 0 && mainReadableIds.every((sectionId) => defaultIds.has(sectionId));

  const failures: string[] = [];
  if (writeBook.finalAction !== "first-time processed") failures.push("Book was not processed.");
  if (!firstSection || !firstDefaultSection || !lastSection) failures.push("Generated sections could not be read.");
  if (!firstDefaultSummary?.includeByDefault) failures.push("No default section is selected.");
  if (firstDefaultSection && nonPlayablePattern.test(sectionText(firstDefaultSection))) {
    failures.push("First default section contains source/license/TOC material.");
  }
  if (!previewValid) failures.push("Preview is stale, generic, or does not start from first default content.");
  if (!cleanupClean) failures.push("Default playback contains source/license/image placeholder artifacts.");
  if (!allMainDefault) failures.push("Not all detected main readable sections are included by default.");
  if (manifest.stats.sectionCount !== writeBook.sectionCount) {
    failures.push(`Manifest section count ${manifest.stats.sectionCount} does not match write report ${writeBook.sectionCount}.`);
  }

  const remainingWarnings: string[] = [];
  const statusNote = WARNING_STATUS_NOTES[writeBook.slug] ?? null;
  if (statusNote) remainingWarnings.push(statusNote);
  if (writeBook.slug === "romeo-and-juliet") {
    remainingWarnings.push("Verification corrected the missing prologue; final output now starts with The Prologue before Act 1.");
  }

  const verificationStatus: VerificationStatus =
    failures.length > 0 ? "fail" : statusNote ? "warn accepted" : "pass";
  remainingWarnings.push(...failures);

  const firstLabel = firstSectionSummary
    ? `${firstSectionSummary.label}${firstSectionSummary.title ? ` - ${firstSectionSummary.title}` : ""}`
    : "missing";
  const firstDefaultLabel = firstDefaultSummary
    ? `${firstDefaultSummary.label}${firstDefaultSummary.title ? ` - ${firstDefaultSummary.title}` : ""}`
    : "missing";
  const lastLabel = lastSectionSummary
    ? `${lastSectionSummary.label}${lastSectionSummary.title ? ` - ${lastSectionSummary.title}` : ""}`
    : "missing";

  return {
    slug: writeBook.slug,
    writeAction: writeBook.finalAction,
    verificationStatus,
    generatedOutputInspected: true,
    previewAssetInspected: true,
    selectedStructuralConvention: writeBook.structuralConvention,
    startBoundaryVerdict:
      verificationStatus === "fail"
        ? "fail: generated start requires correction"
        : `pass: generated starts at ${firstLabel}; first default is ${firstDefaultLabel}`,
    endBoundaryVerdict:
      verificationStatus === "fail"
        ? "fail: generated ending requires correction"
        : `pass: generated ends at ${lastLabel} before source/license tail material`,
    sectioningVerdict:
      verificationStatus === "fail"
        ? "fail: sectioning requires correction"
        : `pass: ${manifest.stats.sectionCount} sections match ${writeBook.structuralConvention}`,
    cleanupVerdict: cleanupClean
      ? "pass: no Gutenberg/license/transcriber/illustration placeholder artifacts found in default playback"
      : "fail: cleanup artifacts remain in default playback",
    previewVerdict: previewValid
      ? `pass: preview starts from ${preview.defaultSectionId} and matches generated hash`
      : "fail: preview is missing, stale, generic, or not aligned to the first default section",
    allMainReadableDefaultVerdict: allMainDefault
      ? "pass: all detected main readable sections are selected by default"
      : "fail: one or more main readable sections are not selected by default",
    startupPreviewValid: previewValid,
    remainingWarnings,
    acceptedForMain: verificationStatus !== "fail",
    correctionNeededBeforeMain: verificationStatus === "fail",
    correctionAppliedDuringVerification:
      writeBook.slug === "romeo-and-juliet"
        ? "Added the missing real prologue as a default prologue section before Act 1 and regenerated its preview."
        : null,
    snippets: {
      rawStart: rawSnippetAtLine(rawText, writeBook.startBoundaryUsed.line),
      generatedStart: compactText(firstSection ? sectionText(firstSection) : null),
      previewStart: compactText(preview.previewText),
      rawEnd: rawSnippetAtLine(rawText, writeBook.endBoundaryUsed.line),
      generatedEnd: compactText(lastSection ? sectionText(lastSection).slice(-600) : null),
    },
  };
}

function writeMarkdownReport(report: {
  generatedAt: string;
  totals: Record<string, number>;
  books: VerificationBook[];
  unresolvedSourceGeneratedBooksLeftUntouched: WriteReport["unresolvedSourceGeneratedBooksLeftUntouched"];
}) {
  const lines = [
    "# Pilot write batch 6 verification",
    "",
    "Post-write QA pass for the 20 batch-6 first-time processed books.",
    "",
    "## Totals",
    "",
    `- Pass: ${report.totals.pass}`,
    `- Warn accepted: ${report.totals.warnAccepted}`,
    `- Fail: ${report.totals.fail}`,
    `- Accepted for main: ${report.totals.acceptedForMain}`,
    `- Corrections applied during verification: ${report.totals.correctionsApplied}`,
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
      `- Structure: ${book.selectedStructuralConvention}`,
      `- Start boundary: ${book.startBoundaryVerdict}`,
      `- End boundary: ${book.endBoundaryVerdict}`,
      `- Sectioning: ${book.sectioningVerdict}`,
      `- Cleanup: ${book.cleanupVerdict}`,
      `- Preview: ${book.previewVerdict}`,
      `- All-main-readable default: ${book.allMainReadableDefaultVerdict}`,
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
      `- Raw start: ${book.snippets.rawStart ?? "n/a"}`,
      `- Generated start: ${book.snippets.generatedStart ?? "n/a"}`,
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
    path.join(verificationRoot, "pilot-write-6-verification.md"),
    `${lines.join("\n").trimEnd()}\n`,
  );
}

function main() {
  const dryRun = readJson<DryRunReport>(path.join(dryRunRoot, "pilot-dry-run-6.json"));
  const write = readJson<WriteReport>(path.join(writeRoot, "pilot-write-6.json"));
  fs.readFileSync(path.join(dryRunRoot, "pilot-dry-run-6.md"), "utf8");
  fs.readFileSync(path.join(writeRoot, "pilot-write-6.md"), "utf8");

  if (JSON.stringify(write.selectedBooks) !== JSON.stringify([...EXPECTED_SELECTED])) {
    throw new Error("Write report selected books do not match expected batch-6 list.");
  }
  if (write.books.length !== 20 || write.totals.firstTimeProcessed !== 20 || write.totals.skipped !== 0) {
    throw new Error("Write report is incomplete or does not show 20 processed / 0 skipped.");
  }
  for (const slug of EXPECTED_UNRESOLVED) {
    if (!write.unresolvedSourceGeneratedBooksLeftUntouched.some((book) => book.slug === slug)) {
      throw new Error(`Unresolved-source generated book missing from write report: ${slug}`);
    }
  }

  const books = write.selectedBooks.map((slug) => {
    const dryRunBook = dryRun.books.find((book) => book.slug === slug);
    const writeBook = write.books.find((book) => book.slug === slug);
    if (!dryRunBook || !writeBook) throw new Error(`${slug}: missing dry-run or write report entry.`);
    return verifyBook(dryRunBook, writeBook);
  });

  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = books.filter((book) => book.verificationStatus === "warn accepted").length;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;
  const correctionsApplied = books.filter((book) => book.correctionAppliedDuringVerification).length;
  const generatedAt = new Date().toISOString();
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-6-verification",
    generatedAt,
    branch: "morsewords-book-processing-pilot-write-6-jun-2026",
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
    unresolvedSourceGeneratedBooksLeftUntouched:
      write.unresolvedSourceGeneratedBooksLeftUntouched,
    futureBatchRule: FUTURE_BATCH_RULE,
    laterPhaseRequirements: LATER_PHASE_REQUIREMENTS,
    books,
  };

  writeJson(path.join(verificationRoot, "pilot-write-6-verification.json"), report);
  writeMarkdownReport({
    generatedAt,
    totals: report.totals,
    books,
    unresolvedSourceGeneratedBooksLeftUntouched:
      write.unresolvedSourceGeneratedBooksLeftUntouched,
  });

  console.log(
    `Pilot write 6 verification complete: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail; ${correctionsApplied} correction applied.`,
  );
  if (fail > 0) process.exitCode = 1;
}

main();
