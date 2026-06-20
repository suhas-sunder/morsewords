import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cleanGutenbergText } from "./clean-gutenberg.ts";

type JsonRecord = Record<string, any>;
type VerificationStatus = "pass" | "warn accepted" | "fail";
type VerdictStatus = "pass" | "warn" | "fail";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-15");
const writeRoot = path.join(auditRoot, "pilot-write-15");
const verificationRoot = path.join(auditRoot, "pilot-write-15-verification");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");

const SELECTED_BATCH = [
  "a-bread-and-butter-miss",
  "bertie-s-christmas-eve",
  "excepting-mrs-pentherby",
  "fate",
  "forewarned",
  "hyacinth",
  "louis",
  "louise",
  "morlvera",
  "tea",
  "the-bull",
  "the-cupboard-of-the-yesterdays",
  "the-disappearance-of-crispina-umberleigh",
  "the-guests",
  "the-hedgehog",
  "the-image-of-the-lost-soul",
  "the-interlopers",
  "the-mappined-life",
  "the-occasional-garden",
  "the-phantom-luncheon",
] as const;

const UNRESOLVED = [
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

const KNOWN_SKIPS = [
  "the-wind-in-the-willows",
  "the-two-magics-the-turn-of-the-screw-covering-end",
  "the-works-of-edgar-allan-poe",
] as const;

const EXACT_TITLE_RISK = new Set([
  "morlvera",
  "the-mappined-life",
  "the-cupboard-of-the-yesterdays",
  "the-disappearance-of-crispina-umberleigh",
  "a-bread-and-butter-miss",
  "bertie-s-christmas-eve",
  "excepting-mrs-pentherby",
]);

function readJson<T = JsonRecord>(filePath: string): T {
  if (!fs.existsSync(filePath)) throw new Error(`Missing required file: ${repoPath(filePath)}`);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function repoPath(filePath: string): string {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function normalize(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function normalizedLoose(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d`]+/g, "'")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9']+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function snippet(input: string | null | undefined, length = 220): string | null {
  if (!input) return null;
  const compact = normalize(input);
  return compact.length <= length ? compact : `${compact.slice(0, length - 3)}...`;
}

function tailSnippet(input: string | null | undefined, length = 220): string | null {
  if (!input) return null;
  const compact = normalize(input);
  return compact.length <= length ? compact : `...${compact.slice(-(length - 3))}`;
}

function verdict(status: VerdictStatus, summary: string, details: string[] = []) {
  return { status, summary, details };
}

function gitStatusFor(paths: readonly string[]): string[] {
  if (paths.length === 0) return [];
  const output = childProcess.execFileSync("git", ["status", "--short", "--", ...paths], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return output.split(/\r?\n/).filter(Boolean);
}

function startPhrase(dryBook: JsonRecord): string {
  const boundary = String(dryBook.expectedStartBoundary ?? "");
  const markerIndex = boundary.indexOf(": ");
  if (markerIndex < 0) throw new Error(`${dryBook.slug}: unclear dry-run start boundary.`);
  return boundary.slice(markerIndex + 2).trim();
}

function expectedReadableText(dryBook: JsonRecord, rawText: string): string {
  const cleaned = cleanGutenbergText(rawText).cleanedText;
  const phrase = startPhrase(dryBook);
  const start = cleaned.indexOf(phrase);
  if (start < 0) throw new Error(`${dryBook.slug}: dry-run start phrase not found in cleaned source.`);
  return cleaned.slice(start).replace(/^\s*THE END\s*$/gim, "").trim();
}

function bodyFromSections(sections: JsonRecord[], key: "displayText" | "text" = "text"): string {
  return sections.map((section) => String(section[key] ?? "")).join("\n\n");
}

function bodyFromProcessed(processedBook: JsonRecord): string {
  return (processedBook.content?.chapters ?? [])
    .flatMap((chapter: JsonRecord) => (chapter.sections ?? []).map((section: JsonRecord) => String(section.text ?? "")))
    .join("\n\n");
}

function sourceLooksUnsafe(text: string): boolean {
  return /Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg|Distributed Proofreading|Transcriber's Notes?|^Author:|^Title:|^Release date:|Contact Us|Site Map|All Rights Reserved|Copyright \u00a9/im.test(text);
}

function previewLooksUnsafe(previewText: string): boolean {
  return /SOS Help!|preview unavailable|placeholder|generic preview|sample preview|Project Gutenberg|table of contents/i.test(previewText);
}

function defaultTextHasCleanupArtifacts(text: string): boolean {
  return /\[(?:Illustration|Image|Plate|Pg\.?\s*\d+|\d+)\]/i.test(text);
}

function rawTitleLine(rawText: string, dryBook: JsonRecord): string {
  const lineNumber = Number(dryBook.titleEvidence?.lineNumber);
  const lines = rawText.split(/\r?\n/);
  const fromLine = Number.isInteger(lineNumber) && lineNumber > 0 ? lines[lineNumber - 1]?.trim() : null;
  if (fromLine) return fromLine;
  const expected = normalizedLoose(String(dryBook.expectedGeneratedTitle ?? ""));
  return lines.map((line) => line.trim()).find((line) => normalizedLoose(line) === expected) ?? "";
}

function verifyBook(dryBook: JsonRecord, writeBook: JsonRecord) {
  const slug = String(dryBook.slug);
  const sourcePath = path.resolve(repoRoot, dryBook.sourceFileUsed);
  const generatedDir = path.join(generatedRoot, slug);
  const manifestPath = path.join(generatedDir, "manifest.json");
  const cleanedBookPath = path.join(generatedDir, "cleaned_book.json");
  const processedBookPath = path.join(generatedDir, "processed_book.json");
  const rightsPath = path.join(generatedDir, "rights_report.json");
  const notesPath = path.join(generatedDir, "processing_notes.md");
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  const perBookDryJson = path.join(dryRunRoot, "books", `${slug}.json`);
  const perBookDryMd = path.join(dryRunRoot, "books", `${slug}.md`);

  for (const required of [
    sourcePath,
    manifestPath,
    cleanedBookPath,
    processedBookPath,
    rightsPath,
    notesPath,
    previewPath,
    perBookDryJson,
    perBookDryMd,
  ]) {
    if (!fs.existsSync(required)) throw new Error(`${slug}: missing ${repoPath(required)}`);
  }

  const rawText = fs.readFileSync(sourcePath, "utf8");
  const rawBody = expectedReadableText(dryBook, rawText);
  const phrase = startPhrase(dryBook);
  const manifest = readJson(manifestPath);
  const cleanedBook = readJson(cleanedBookPath);
  const processedBook = readJson(processedBookPath);
  const preview = readJson(previewPath);
  const sections = (manifest.sections ?? []) as JsonRecord[];
  const sectionPaths = sections.map((section) => path.join(generatedDir, section.sectionJsonPath));
  const sectionJson = sectionPaths.map((sectionPath) => readJson(sectionPath));
  const generatedBody = bodyFromSections(sectionJson, "displayText");
  const morseBody = sectionJson.map((section) => String(section.morseSourceText ?? "")).join("\n\n");
  const cleanedBody = bodyFromSections(cleanedBook.sections ?? []);
  const processedBody = bodyFromProcessed(processedBook);
  const firstSection = sectionJson[0] ?? {};
  const defaultSections = sections.filter((section) => section.includeByDefault);
  const sourceTitle = rawTitleLine(rawText, dryBook);
  const expectedAuthors = dryBook.expectedAuthor ?? [];
  const generatedAuthors = manifest.author ?? [];

  const titleMatchesSource = normalizedLoose(String(manifest.title ?? "")) === normalizedLoose(sourceTitle);
  const exactTitleRiskPass =
    !EXACT_TITLE_RISK.has(slug) ||
    (titleMatchesSource &&
      (slug !== "bertie-s-christmas-eve" || String(manifest.title ?? "").includes("\u2019")));
  const authorMatches =
    JSON.stringify(generatedAuthors) === JSON.stringify(expectedAuthors) &&
    expectedAuthors.includes("Saki") &&
    /Author:\s*Saki/i.test(rawText) &&
    !generatedAuthors.some((author: string) => /unknown author/i.test(author));
  const rawMatchesGenerated =
    generatedBody === rawBody &&
    morseBody === rawBody &&
    cleanedBody === rawBody &&
    processedBody === rawBody;
  const startsCorrectly = generatedBody.startsWith(phrase) && rawBody.startsWith(phrase);
  const endsCorrectly = rawMatchesGenerated && generatedBody.endsWith(rawBody.slice(-Math.min(180, rawBody.length)));
  const sectioningPass =
    sections.length === 1 &&
    sectionJson.length === 1 &&
    defaultSections.length === 1 &&
    sections[0]?.id === firstSection.sectionId &&
    sections[0]?.includeByDefault === true &&
    firstSection.includeByDefault === true &&
    String(sections[0]?.label ?? "") === String(manifest.title ?? "");
  const cleanupPass =
    rawMatchesGenerated &&
    !sourceLooksUnsafe(generatedBody) &&
    !defaultTextHasCleanupArtifacts(generatedBody);
  const previewPass =
    preview.defaultSectionId === sections[0]?.id &&
    typeof preview.previewText === "string" &&
    preview.previewText.length >= 400 &&
    generatedBody.startsWith(preview.previewText) &&
    preview.previewText.startsWith(phrase.slice(0, Math.min(40, phrase.length))) &&
    !previewLooksUnsafe(preview.previewText);
  const allMainDefaultPass =
    sectioningPass &&
    defaultSections.length === sections.length &&
    generatedBody.startsWith(String(firstSection.displayText ?? "").slice(0, 120));
  const writeReportPass =
    writeBook?.finalAction === "first-time processed" &&
    writeBook?.rawVsGeneratedBodyComparisonResult?.status === "pass" &&
    writeBook?.startupPreviewValid === true;

  const checks = {
    title: titleMatchesSource && exactTitleRiskPass,
    author: authorMatches,
    rawGenerated: rawMatchesGenerated,
    start: startsCorrectly,
    end: endsCorrectly,
    sectioning: sectioningPass,
    cleanup: cleanupPass,
    preview: previewPass,
    allDefault: allMainDefaultPass,
    writeReport: writeReportPass,
  };
  const failures = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);
  const verificationStatus: VerificationStatus = failures.length === 0 ? "pass" : "fail";

  return {
    slug,
    verificationStatus,
    generatedOutputInspected: [manifestPath, cleanedBookPath, processedBookPath, rightsPath, notesPath, ...sectionPaths].map(repoPath),
    previewInspected: repoPath(previewPath),
    titleVerdict: verdict(
      checks.title ? "pass" : "fail",
      checks.title
        ? `Individual story title preserved as ${manifest.title}; source heading was ${sourceTitle}.`
        : `Generated title ${manifest.title} does not match source heading ${sourceTitle}.`,
      EXACT_TITLE_RISK.has(slug)
        ? ["Exact-title risk checked against raw source heading; no alternate/common title normalization accepted."]
        : [],
    ),
    authorVerdict: verdict(
      checks.author ? "pass" : "fail",
      checks.author
        ? "Author metadata is source-backed by the Project Gutenberg Author: Saki header."
        : "Author metadata is missing, unknown, or not source-backed.",
      [String(dryBook.authorEvidence?.text ?? "")],
    ),
    rawVsGeneratedBodyComparisonVerdict: verdict(
      checks.rawGenerated ? "pass" : "fail",
      checks.rawGenerated
        ? "Sanitized raw story body matches generated section, cleaned_book, processed_book, and morse source text character-for-character."
        : "Sanitized raw story body differs from one or more generated copies.",
      [
        `Raw characters: ${rawBody.length}`,
        `Generated characters: ${generatedBody.length}`,
        `Morse source matches: ${morseBody === rawBody ? "yes" : "no"}`,
        `cleaned_book matches: ${cleanedBody === rawBody ? "yes" : "no"}`,
        `processed_book matches: ${processedBody === rawBody ? "yes" : "no"}`,
      ],
    ),
    startBoundaryVerdict: verdict(
      checks.start ? "pass" : "fail",
      checks.start
        ? "Generated body starts at the dry-run verified first readable prose phrase."
        : "Generated body does not start at the verified first readable prose phrase.",
    ),
    endBoundaryVerdict: verdict(
      checks.end ? "pass" : "fail",
      checks.end
        ? "Generated body preserves the true cleaned-source story ending."
        : "Generated body does not preserve the cleaned-source ending exactly.",
    ),
    sectioningVerdict: verdict(
      checks.sectioning ? "pass" : "fail",
      checks.sectioning
        ? "Single-section output is source-based and legitimate for this undivided story."
        : "Sectioning/default structure does not match the audited single-story source.",
    ),
    cleanupProsePreservationVerdict: verdict(
      checks.cleanup ? "pass" : "fail",
      checks.cleanup
        ? "No parent collection title, TOC, source/license, contributor, transcriber, byline-only material, artifact text, prose, punctuation, quote mark, dialogue, or ending sentence was removed from the story body."
        : "Cleanup/prose-preservation checks found source noise, artifacts, or a raw/generated mismatch.",
    ),
    previewVerdict: verdict(
      checks.preview ? "pass" : "fail",
      checks.preview
        ? "Preview is book-specific, starts at real readable content, and contains no SOS Help or generic fallback text."
        : "Preview does not start at the verified story opening or contains fallback/source noise.",
    ),
    allMainReadableDefaultVerdict: verdict(
      checks.allDefault ? "pass" : "fail",
      checks.allDefault
        ? "All main readable story content is included by default and source order begins with the first selected/default section."
        : "Default section selection/order needs review.",
    ),
    startupPreviewValid: checks.preview,
    acceptedForMain: verificationStatus === "pass",
    correctionNeededBeforeMain: verificationStatus === "fail",
    correctionAppliedDuringVerification: null,
    remainingWarnings: failures,
    snippets: {
      title: snippet(sourceTitle),
      author: snippet(String(dryBook.authorEvidence?.text ?? "")),
      rawStart: snippet(rawBody),
      generatedStart: snippet(generatedBody),
      rawEnd: tailSnippet(rawBody),
      generatedEnd: tailSnippet(generatedBody),
      previewStart: snippet(preview.previewText),
    },
  };
}

function writeMarkdown(report: JsonRecord) {
  const lines = [
    "# Pilot write batch 15 verification",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Verified: ${report.totals.verified}`,
    `- Pass: ${report.totals.pass}`,
    `- Warn accepted: ${report.totals.warnAccepted}`,
    `- Fail: ${report.totals.fail}`,
    `- Accepted for main: ${report.totals.acceptedForMain}`,
    `- Correction needed before main: ${report.totals.correctionNeededBeforeMain}`,
    "",
    "## Shared Script Scope",
    "",
    `- Classification: ${report.write12SharedScriptScopeFinding.classification}`,
    `- Resolution: ${report.write12SharedScriptScopeFinding.resolution}`,
    `- Unrelated changes found: ${report.write12SharedScriptScopeFinding.unrelatedChangesFound ? "yes" : "no"}`,
    "",
    "## Batch-12 Prose Restoration",
    "",
    `- Result: ${report.batch12ProseRestoration.result}`,
    `- Compared: ${report.batch12ProseRestoration.batch12BooksCompared}`,
    `- Remaining prose omissions: ${report.batch12ProseRestoration.remainingBatch12ProseOmissions}`,
    `- Remaining missing opening-quote defects: ${report.batch12ProseRestoration.remainingMissingOpeningQuoteDefects}`,
    "",
    "## Books",
    "",
    ...report.books.flatMap((book: JsonRecord) => [
      `### ${book.slug}`,
      "",
      `- Verification status: ${book.verificationStatus}`,
      `- Generated output inspected: ${book.generatedOutputInspected.join(", ")}`,
      `- Preview inspected: ${book.previewInspected}`,
      `- Title verdict: ${book.titleVerdict.summary}`,
      `- Author verdict: ${book.authorVerdict.summary}`,
      `- Raw-vs-generated body comparison: ${book.rawVsGeneratedBodyComparisonVerdict.summary}`,
      `- Start boundary verdict: ${book.startBoundaryVerdict.summary}`,
      `- End boundary verdict: ${book.endBoundaryVerdict.summary}`,
      `- Sectioning verdict: ${book.sectioningVerdict.summary}`,
      `- Cleanup/prose-preservation verdict: ${book.cleanupProsePreservationVerdict.summary}`,
      `- Preview verdict: ${book.previewVerdict.summary}`,
      `- All-main-readable-default verdict: ${book.allMainReadableDefaultVerdict.summary}`,
      `- Startup preview valid: ${book.startupPreviewValid ? "yes" : "no"}`,
      `- Accepted for main: ${book.acceptedForMain ? "yes" : "no"}`,
      `- Correction needed before main: ${book.correctionNeededBeforeMain ? "yes" : "no"}`,
      `- Remaining warnings: ${book.remainingWarnings.length ? book.remainingWarnings.join("; ") : "none"}`,
      `- Title evidence: ${book.snippets.title}`,
      `- Author evidence: ${book.snippets.author}`,
      `- Start evidence: ${book.snippets.rawStart} / ${book.snippets.generatedStart}`,
      `- End evidence: ${book.snippets.rawEnd} / ${book.snippets.generatedEnd}`,
      `- Preview evidence: ${book.snippets.previewStart}`,
      "",
    ]),
    "## Protected Scope",
    "",
    `- Unresolved-source generated books untouched: ${report.unresolvedSourceGeneratedBooksUntouched.join(", ")}`,
    `- Duplicate/boundary skips not reintroduced: ${report.knownDuplicateBoundarySkipsNotReintroduced.join(", ")}`,
    `- Raw sources modified: ${report.protectedPaths.rawSourcesModified ? "yes" : "no"}`,
    `- Cloudflare exports modified: ${report.protectedPaths.cloudflareExportsModified ? "yes" : "no"}`,
    "",
    "## Validation Notes",
    "",
    `- Playwright: ${report.playwright.result}`,
    `- Audit side-effect handling: ${report.auditSideEffectHandling.result}`,
    "",
  ];
  writeText(path.join(verificationRoot, "pilot-write-15-verification.md"), `${lines.join("\n").trimEnd()}\n`);
}

function main() {
  const requiredReports = [
    path.join(dryRunRoot, "pilot-dry-run-15.json"),
    path.join(dryRunRoot, "pilot-dry-run-15.md"),
    path.join(writeRoot, "pilot-write-15.json"),
    path.join(writeRoot, "pilot-write-15.md"),
    path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"),
  ];
  for (const reportPath of requiredReports) {
    if (!fs.existsSync(reportPath)) throw new Error(`Missing required report: ${repoPath(reportPath)}`);
    fs.readFileSync(reportPath, "utf8");
  }

  const dry = readJson(path.join(dryRunRoot, "pilot-dry-run-15.json"));
  const write = readJson(path.join(writeRoot, "pilot-write-15.json"));
  const batch12 = readJson(path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"));

  if (dry.reportName !== "pilot-dry-run-15" || write.reportName !== "pilot-write-15") {
    throw new Error("Dry-run or write report identity is incomplete.");
  }
  const selectedFromDry = (dry.books ?? [])
    .filter((book: JsonRecord) => book.candidateType === "raw-only" && book.currentStatus === "needs first-time controlled processing")
    .map((book: JsonRecord) => book.slug);
  if (JSON.stringify(selectedFromDry) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error(`Dry-run selected list mismatch: ${selectedFromDry.join(", ")}`);
  }
  if (JSON.stringify(write.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) {
    throw new Error(`Write selected list mismatch: ${write.selectedBooks?.join(", ")}`);
  }

  const books = SELECTED_BATCH.map((slug) => {
    const dryBook = dry.books.find((book: JsonRecord) => book.slug === slug);
    const writeBook = write.books.find((book: JsonRecord) => book.slug === slug);
    if (!dryBook || !writeBook) throw new Error(`${slug}: missing dry-run or write entry.`);
    return verifyBook(dryBook, writeBook);
  });
  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = 0;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;

  const unresolvedStatus = gitStatusFor(UNRESOLVED.map((slug) => `app/client/assets/books/generated/${slug}`));
  const knownSkipStatus = gitStatusFor(KNOWN_SKIPS.flatMap((slug) => [
    `app/client/assets/books/generated/${slug}`,
    `public/book-previews/${slug}.preview.json`,
  ]));
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-15-verification",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-write-15-jun-2026",
    scope: "post-write QA/review of the exact 20 pilot write batch 15 books",
    sourceReportsRead: requiredReports.map(repoPath),
    selectedBooks: [...SELECTED_BATCH],
    totals: {
      verified: books.length,
      pass,
      warnAccepted,
      fail,
      acceptedForMain: books.filter((book) => book.acceptedForMain).length,
      correctionNeededBeforeMain: books.filter((book) => book.correctionNeededBeforeMain).length,
    },
    write12SharedScriptScopeFinding: {
      files: [
        "scripts/books/pilot-book-processing-write-12.ts",
        "scripts/books/pilot-book-processing-write-15.ts",
      ],
      classification: "harmless shared implementation intentionally used by write batch 15",
      resolution:
        "Retain the shared writer diff: batch 15 follows the existing write-13/write-14 wrapper pattern, selects only the dry-run 15 slugs through MORSEWORDS_PILOT_WRITE_BATCH=15, and adds raw-vs-generated body comparison/report fields used by this controlled pass.",
      unrelatedChangesFound: false,
      movedToSharedHelper: false,
      restoredToOriginMain: false,
    },
    batch12ProseRestoration: {
      result:
        batch12.scope?.remainingBatch12RawVsGeneratedMismatches === 0 &&
        batch12.scope?.remainingBatch12ProseOmissions === 0 &&
        batch12.scope?.remainingMissingOpeningQuoteDefects === 0
          ? "pass"
          : "fail",
      batch12BooksCompared: batch12.scope?.batch12BooksCompared ?? null,
      remainingBatch12ProseOmissions: batch12.scope?.remainingBatch12ProseOmissions ?? null,
      remainingMissingOpeningQuoteDefects: batch12.scope?.remainingMissingOpeningQuoteDefects ?? null,
      remainingBatch12RawVsGeneratedMismatches: batch12.scope?.remainingBatch12RawVsGeneratedMismatches ?? null,
    },
    correctionsMadeDuringVerification: [],
    unresolvedSourceGeneratedBooksUntouched: [...UNRESOLVED],
    unresolvedSourceStatus: unresolvedStatus,
    knownDuplicateBoundarySkipsNotReintroduced: [...KNOWN_SKIPS],
    knownSkipStatus,
    protectedPaths: {
      rawSourcesModified: gitStatusFor(["app/client/assets/temp-books"]).length > 0,
      cloudflareExportsModified: gitStatusFor(["app/client/assets/books/cloudflare-export"]).length > 0,
    },
    playwright: {
      result:
        process.env.MORSEWORDS_PILOT_WRITE_15_PLAYWRIGHT_RESULT ??
        "pending external validation run; rerun verifier after Playwright to stamp the final result",
    },
    auditSideEffectHandling: {
      result:
        process.env.MORSEWORDS_PILOT_WRITE_15_AUDIT_SIDE_EFFECT_HANDLING ??
        "pending external validation run; restore known title/start/default audit churn before commit",
    },
    books,
  };

  writeJson(path.join(verificationRoot, "pilot-write-15-verification.json"), report);
  writeMarkdown(report);
  console.log(`Pilot write 15 verification: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail.`);
  if (fail > 0) process.exitCode = 1;
}

main();
