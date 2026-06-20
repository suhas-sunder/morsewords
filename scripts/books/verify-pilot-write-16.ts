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
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-16");
const writeRoot = path.join(auditRoot, "pilot-write-16");
const verificationRoot = path.join(auditRoot, "pilot-write-16-verification");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const safeDirectory = repoRoot.replace(/\\/g, "/");

const SELECTED_BATCH = [
  "the-purple-of-the-balkan-kings",
  "the-seven-cream-jugs",
  "the-sheep",
  "the-threat",
  "the-toys-of-peace",
  "the-wolves-of-cernogratz",
  "how-an-old-man-lost-his-wen",
  "momotaro-or-the-story-of-the-son-of-a-peach",
  "my-lord-bag-of-rice",
  "the-mirror-of-matsuyama",
  "the-ogre-of-rashomon",
  "the-quarrel-of-the-monkey-and-the-crab",
  "the-sagacious-monkey-and-the-boar",
  "the-shinansha-or-the-south-pointing-carriage",
  "the-stones-of-five-colors-and-the-empress-jokwa",
  "the-story-of-prince-yamato-take",
  "the-story-of-princess-hase",
  "the-white-hare-and-the-crocodiles",
  "the-golden-goose",
  "the-turnip",
] as const;

const SAKI = new Set(SELECTED_BATCH.slice(0, 6));
const JAPANESE = new Set(SELECTED_BATCH.slice(6, 18));
const GRIMM = new Set(SELECTED_BATCH.slice(18));

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

function repoPath(filePath: string): string {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

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

function normalize(input: string): string {
  return input.replace(/\s+/g, " ").trim();
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
  const output = childProcess.execFileSync(
    "git",
    ["-c", `safe.directory=${safeDirectory}`, "status", "--short", "--", ...paths],
    { cwd: repoRoot, encoding: "utf8" },
  );
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
  if (start < 0) throw new Error(`${dryBook.slug}: verified start phrase not found in source.`);
  return cleaned
    .slice(start)
    .replace(/^\s*THE END\s*$/gim, "")
    .replace(/\n{2,}[ \t]*(?:\*\s*){3,}[ \t]*\n{2,}/g, "\n\n")
    .trim();
}

function bodyFromProcessed(processedBook: JsonRecord): string {
  return (processedBook.content?.chapters ?? [])
    .flatMap((chapter: JsonRecord) =>
      (chapter.sections ?? []).map((section: JsonRecord) => String(section.text ?? "")),
    )
    .join("\n\n");
}

function sourceLooksUnsafe(text: string): boolean {
  return /Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg|Distributed Proofreading|Transcriber's Notes?|^Author:|^Title:|^Release date:|Contact Us|Site Map|All Rights Reserved|Copyright ©/im.test(text);
}

function previewLooksUnsafe(text: string): boolean {
  return /SOS Help!|preview unavailable|placeholder|generic preview|sample preview|Project Gutenberg|table of contents/i.test(text);
}

function cleanupArtifactsRemain(text: string): boolean {
  return /\[(?:Illustration|Image|Plate|Pg\.?\s*\d+|\d+)\]/i.test(text);
}

function metadataRole(slug: string): "author" | "compiler" | "authors" {
  if (SAKI.has(slug as (typeof SELECTED_BATCH)[number])) return "author";
  if (JAPANESE.has(slug as (typeof SELECTED_BATCH)[number])) return "compiler";
  return "authors";
}

function roleEvidencePass(slug: string, rawText: string): boolean {
  if (SAKI.has(slug as (typeof SELECTED_BATCH)[number])) return /^Author:\s*Saki\s*$/im.test(rawText);
  if (JAPANESE.has(slug as (typeof SELECTED_BATCH)[number])) {
    return /^Author:\s*Yei Theodora Ozaki\s*$/im.test(rawText) &&
      /COMPILED BY[\s\S]{0,80}Yei Theodora Ozaki/i.test(rawText);
  }
  return /^Author:\s*Jacob Grimm\s*\r?\n\s*Wilhelm Grimm\s*$/im.test(rawText) &&
    /By Jacob Grimm and Wilhelm Grimm/i.test(rawText);
}

function verifyBook(dryBook: JsonRecord, writeBook: JsonRecord) {
  const slug = String(dryBook.slug);
  const sourcePath = path.resolve(repoRoot, dryBook.sourceFileUsed);
  const generatedDir = path.join(generatedRoot, slug);
  const manifestPath = path.join(generatedDir, "manifest.json");
  const cleanedPath = path.join(generatedDir, "cleaned_book.json");
  const processedPath = path.join(generatedDir, "processed_book.json");
  const rightsPath = path.join(generatedDir, "rights_report.json");
  const notesPath = path.join(generatedDir, "processing_notes.md");
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  const perBookDryJson = path.join(dryRunRoot, "books", `${slug}.json`);
  const perBookDryMd = path.join(dryRunRoot, "books", `${slug}.md`);
  for (const required of [sourcePath, manifestPath, cleanedPath, processedPath, rightsPath, notesPath, previewPath, perBookDryJson, perBookDryMd]) {
    if (!fs.existsSync(required)) throw new Error(`${slug}: missing ${repoPath(required)}`);
  }

  const rawText = fs.readFileSync(sourcePath, "utf8");
  const rawBody = expectedReadableText(dryBook, rawText);
  const phrase = startPhrase(dryBook);
  const manifest = readJson(manifestPath);
  const cleaned = readJson(cleanedPath);
  const processed = readJson(processedPath);
  const preview = readJson(previewPath);
  const sections = (manifest.sections ?? []) as JsonRecord[];
  const sectionPaths = sections.map((section) => path.join(generatedDir, String(section.sectionJsonPath)));
  const sectionJson = sectionPaths.map((sectionPath) => readJson(sectionPath));
  const generatedBody = sectionJson.map((section) => String(section.displayText ?? "")).join("\n\n");
  const morseBody = sectionJson.map((section) => String(section.morseSourceText ?? "")).join("\n\n");
  const cleanedBody = (cleaned.sections ?? []).map((section: JsonRecord) => String(section.text ?? "")).join("\n\n");
  const processedBody = bodyFromProcessed(processed);
  const expectedAuthors = dryBook.expectedAuthor ?? [];
  const generatedAuthors = manifest.author ?? [];
  const parentTitle = rawText.match(/^Title:\s*(.+)$/im)?.[1]?.trim() ?? "";
  const firstSection = sectionJson[0] ?? {};
  const defaults = sections.filter((section) => section.includeByDefault);
  const role = metadataRole(slug);

  const checks = {
    title:
      String(manifest.title ?? "") === String(dryBook.expectedGeneratedTitle ?? "") &&
      String(manifest.title ?? "") !== parentTitle,
    metadata:
      JSON.stringify(generatedAuthors) === JSON.stringify(expectedAuthors) &&
      !generatedAuthors.some((name: string) => /unknown author/i.test(name)) &&
      roleEvidencePass(slug, rawText),
    rawGenerated:
      generatedBody === rawBody && morseBody === rawBody && cleanedBody === rawBody && processedBody === rawBody,
    start: generatedBody.startsWith(phrase) && rawBody.startsWith(phrase),
    end: generatedBody === rawBody && generatedBody.endsWith(rawBody.slice(-Math.min(220, rawBody.length))),
    sectioning:
      sections.length === 1 && sectionJson.length === 1 && defaults.length === 1 &&
      sections[0]?.id === firstSection.sectionId && sections[0]?.includeByDefault === true &&
      firstSection.includeByDefault === true && sections[0]?.label === manifest.title,
    cleanup: generatedBody === rawBody && !sourceLooksUnsafe(generatedBody) && !cleanupArtifactsRemain(generatedBody),
    preview:
      preview.slug === slug && preview.defaultSectionLabel === manifest.title && preview.defaultSectionId === sections[0]?.id &&
      typeof preview.previewText === "string" && preview.previewText.length >= 400 &&
      generatedBody.startsWith(preview.previewText) && !previewLooksUnsafe(preview.previewText),
    allDefault:
      defaults.length === sections.length && sections.length === 1 &&
      generatedBody.startsWith(String(firstSection.displayText ?? "").slice(0, 120)),
    writeReport:
      writeBook?.finalAction === "first-time processed" &&
      writeBook?.rawVsGeneratedBodyComparisonResult?.status === "pass" &&
      writeBook?.startupPreviewValid === true,
  };
  const failures = Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name);
  const verificationStatus: VerificationStatus = failures.length ? "fail" : "pass";

  return {
    slug,
    verificationStatus,
    generatedOutputInspected: [manifestPath, cleanedPath, processedPath, rightsPath, notesPath, ...sectionPaths].map(repoPath),
    previewInspected: repoPath(previewPath),
    titleVerdict: verdict(checks.title ? "pass" : "fail", checks.title
      ? `Individual title preserved exactly as “${manifest.title}”; parent collection “${parentTitle}” is excluded.`
      : `Generated title “${manifest.title}” does not match the audited individual title or leaks the parent title.`),
    authorCompilerCollectorTranslatorRetellerVerdict: verdict(checks.metadata ? "pass" : "fail", checks.metadata
      ? role === "compiler"
        ? "Yei Theodora Ozaki is source-backed as compiler; the legacy author array follows the existing Japanese-tale metadata convention without claiming an unknown author."
        : role === "authors"
          ? "Jacob Grimm and Wilhelm Grimm match the raw Author/byline evidence and the existing semicolon-joined Grimm convention."
          : "Saki matches the raw Project Gutenberg Author line and existing generated metadata convention."
      : "Generated creator metadata is missing, unknown, inconsistent with the source, or uses the wrong role convention.",
      [String(dryBook.authorEvidence?.text ?? ""), `Verified role: ${role}`]),
    rawVsGeneratedBodyComparisonVerdict: verdict(checks.rawGenerated ? "pass" : "fail", checks.rawGenerated
      ? "Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character."
      : "Sanitized raw body differs from one or more generated copies.", [
      `Raw characters: ${rawBody.length}`,
      `Generated characters: ${generatedBody.length}`,
      `All generated copies agree: ${morseBody === rawBody && cleanedBody === rawBody && processedBody === rawBody ? "yes" : "no"}`,
    ]),
    startBoundaryVerdict: verdict(checks.start ? "pass" : "fail", checks.start
      ? "Body starts at the dry-run verified first readable prose phrase."
      : "Body does not start at the verified readable boundary."),
    endBoundaryVerdict: verdict(checks.end ? "pass" : "fail", checks.end
      ? "True readable ending and final sentence are preserved exactly after sanitization."
      : "Readable ending differs from the sanitized source."),
    sectioningVerdict: verdict(checks.sectioning ? "pass" : "fail", checks.sectioning
      ? "One source-based section is appropriate for this undivided tale and is default-selected."
      : "Section structure/default selection does not match the source."),
    cleanupProsePreservationVerdict: verdict(checks.cleanup ? "pass" : "fail", checks.cleanup
      ? "No collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, dialogue, punctuation, quotes, names, and ending remain exact."
      : "Source noise, cleanup artifacts, or prose loss remains."),
    previewVerdict: verdict(checks.preview ? "pass" : "fail", checks.preview
      ? "Preview is valid, book-specific, starts at real content, and contains no SOS Help or generic fallback."
      : "Preview is invalid, generic, unsafe, or starts outside readable content."),
    allMainReadableDefaultVerdict: verdict(checks.allDefault ? "pass" : "fail", checks.allDefault
      ? "All readable story content is included by default and selected order starts at the first section."
      : "Main readable content/default source order needs correction."),
    startupPreviewValid: checks.preview && checks.writeReport,
    acceptedForMain: verificationStatus !== "fail",
    correctionNeededBeforeMain: verificationStatus === "fail",
    correctionAppliedDuringVerification: null,
    remainingWarnings: failures,
    snippets: {
      title: snippet(String(dryBook.titleEvidence?.text ?? "")),
      metadata: snippet(`${dryBook.authorEvidence?.text ?? ""}; role ${role}`),
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
    "# Pilot write batch 16 verification", "", `Generated: ${report.generatedAt}`, "", "## Summary", "",
    `- Verified: ${report.totals.verified}`,
    `- Pass: ${report.totals.pass}`,
    `- Warn accepted: ${report.totals.warnAccepted}`,
    `- Fail: ${report.totals.fail}`,
    `- Accepted for main: ${report.totals.acceptedForMain}`,
    `- Correction needed before main: ${report.totals.correctionNeededBeforeMain}`, "",
    "## Shared Script Scope", "",
    `- Classification: ${report.write12SharedScriptScopeFinding.classification}`,
    `- Resolution: ${report.write12SharedScriptScopeFinding.resolution}`,
    `- Unrelated changes found: ${report.write12SharedScriptScopeFinding.unrelatedChangesFound ? "yes" : "no"}`, "",
    "## Batch-12 Prose Restoration", "",
    `- Result: ${report.batch12ProseRestoration.result}`,
    `- Compared: ${report.batch12ProseRestoration.batch12BooksCompared}`,
    `- Remaining raw/generated mismatches: ${report.batch12ProseRestoration.remainingBatch12RawVsGeneratedMismatches}`,
    `- Remaining prose omissions: ${report.batch12ProseRestoration.remainingBatch12ProseOmissions}`,
    `- Remaining missing opening-quote defects: ${report.batch12ProseRestoration.remainingMissingOpeningQuoteDefects}`, "",
    "## Books", "",
    ...report.books.flatMap((book: JsonRecord) => [
      `### ${book.slug}`, "",
      `- Verification status: ${book.verificationStatus}`,
      `- Generated output inspected: ${book.generatedOutputInspected.join(", ")}`,
      `- Preview inspected: ${book.previewInspected}`,
      `- Title verdict: ${book.titleVerdict.summary}`,
      `- Author/compiler/collector/translator/reteller verdict: ${book.authorCompilerCollectorTranslatorRetellerVerdict.summary}`,
      `- Raw-vs-generated body comparison verdict: ${book.rawVsGeneratedBodyComparisonVerdict.summary}`,
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
      `- Metadata evidence: ${book.snippets.metadata}`,
      `- Start evidence: ${book.snippets.rawStart} / ${book.snippets.generatedStart}`,
      `- End evidence: ${book.snippets.rawEnd} / ${book.snippets.generatedEnd}`,
      `- Preview evidence: ${book.snippets.previewStart}`, "",
    ]),
    "## Protected Scope", "",
    `- Unresolved-source generated books untouched: ${report.unresolvedSourceGeneratedBooksUntouched.join(", ")}`,
    `- Duplicate/boundary skips not reintroduced: ${report.knownDuplicateBoundarySkipsNotReintroduced.join(", ")}`,
    `- Raw sources modified: ${report.protectedPaths.rawSourcesModified ? "yes" : "no"}`,
    `- Cloudflare exports modified: ${report.protectedPaths.cloudflareExportsModified ? "yes" : "no"}`,
    `- Unrelated generated/preview changes: ${report.protectedPaths.unrelatedGeneratedOrPreviewChanges.length ? report.protectedPaths.unrelatedGeneratedOrPreviewChanges.join(", ") : "none"}`, "",
    "## Validation", "",
    ...Object.entries(report.validationResults).map(([name, result]) => `- ${name}: ${result}`),
    `- Playwright wrapper timeout after 36/36 JSON result: ${report.playwright.wrapperTimeoutAfter36Of36 ? "yes" : "no"}`,
    `- Audit side-effect handling: ${report.auditSideEffectHandling.result}`, "",
  ];
  writeText(path.join(verificationRoot, "pilot-write-16-verification.md"), `${lines.join("\n").trimEnd()}\n`);
}

function main() {
  const requiredReports = [
    path.join(dryRunRoot, "pilot-dry-run-16.json"),
    path.join(dryRunRoot, "pilot-dry-run-16.md"),
    path.join(writeRoot, "pilot-write-16.json"),
    path.join(writeRoot, "pilot-write-16.md"),
    path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"),
  ];
  requiredReports.forEach((reportPath) => fs.readFileSync(reportPath, "utf8"));
  fs.readdirSync(path.join(dryRunRoot, "books"));

  const dry = readJson(path.join(dryRunRoot, "pilot-dry-run-16.json"));
  const write = readJson(path.join(writeRoot, "pilot-write-16.json"));
  const batch12 = readJson(path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"));
  if (dry.reportName !== "pilot-dry-run-16" || write.reportName !== "pilot-write-16") throw new Error("Report identity mismatch.");
  const selectedFromDry = (dry.books ?? []).filter((book: JsonRecord) => book.candidateType === "raw-only" && book.currentStatus === "needs first-time controlled processing").map((book: JsonRecord) => book.slug);
  if (JSON.stringify(selectedFromDry) !== JSON.stringify([...SELECTED_BATCH])) throw new Error("Dry-run selected list mismatch.");
  if (JSON.stringify(write.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) throw new Error("Write selected list mismatch.");

  const books = SELECTED_BATCH.map((slug) => verifyBook(
    dry.books.find((book: JsonRecord) => book.slug === slug),
    write.books.find((book: JsonRecord) => book.slug === slug),
  ));
  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = 0;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;
  const batch12Pass = batch12.scope?.remainingBatch12RawVsGeneratedMismatches === 0 && batch12.scope?.remainingBatch12ProseOmissions === 0 && batch12.scope?.remainingMissingOpeningQuoteDefects === 0;
  const unrelatedGeneratedOrPreviewChanges = gitStatusFor(["app/client/assets/books/generated", "public/book-previews"]).filter((line) => !SELECTED_BATCH.some((slug) => line.includes(`/${slug}/`) || line.includes(`/${slug}.preview.json`)) && !/library-manifest\.json|book-previews\/manifest\.json/.test(line));

  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-16-verification",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-write-16-jun-2026",
    scope: "post-write QA/review of the exact 20 pilot write batch 16 books",
    sourceReportsRead: requiredReports.map(repoPath),
    selectedBooks: [...SELECTED_BATCH],
    totals: { verified: books.length, pass, warnAccepted, fail, acceptedForMain: books.filter((book) => book.acceptedForMain).length, correctionNeededBeforeMain: books.filter((book) => book.correctionNeededBeforeMain).length },
    write12SharedScriptScopeFinding: {
      files: ["scripts/books/pilot-book-processing-write-12.ts", "scripts/books/pilot-book-processing-write-16.ts"],
      classification: "harmless shared implementation intentionally used by write batch 16",
      resolution: "Retain the write-12 change. The existing shared writer is explicitly batch-selected by MORSEWORDS_PILOT_WRITE_BATCH; write-16 is a five-line scoped wrapper, and the write-12 diff adds only dry-run 16 typing, selection, and dispatch support.",
      unrelatedChangesFound: false,
      movedToSharedHelper: false,
      restoredToOriginMain: false,
    },
    batch12ProseRestoration: {
      result: batch12Pass ? "pass" : "fail",
      batch12BooksCompared: batch12.scope?.batch12BooksCompared ?? null,
      remainingBatch12RawVsGeneratedMismatches: batch12.scope?.remainingBatch12RawVsGeneratedMismatches ?? null,
      remainingBatch12ProseOmissions: batch12.scope?.remainingBatch12ProseOmissions ?? null,
      remainingMissingOpeningQuoteDefects: batch12.scope?.remainingMissingOpeningQuoteDefects ?? null,
    },
    correctionsMadeDuringVerification: [],
    unresolvedSourceGeneratedBooksUntouched: [...UNRESOLVED],
    unresolvedSourceStatus: gitStatusFor(UNRESOLVED.map((slug) => `app/client/assets/books/generated/${slug}`)),
    knownDuplicateBoundarySkipsNotReintroduced: [...KNOWN_SKIPS],
    knownSkipStatus: gitStatusFor(KNOWN_SKIPS.flatMap((slug) => [`app/client/assets/books/generated/${slug}`, `public/book-previews/${slug}.preview.json`])),
    protectedPaths: {
      rawSourcesModified: gitStatusFor(["app/client/assets/temp-books"]).length > 0,
      cloudflareExportsModified: gitStatusFor(["app/client/assets/books/cloudflare-export"]).length > 0,
      unrelatedGeneratedOrPreviewChanges,
    },
    validationResults: {
      typecheck: process.env.MORSEWORDS_VERIFY_TYPECHECK ?? "pending",
      pilotWrite16: process.env.MORSEWORDS_VERIFY_WRITE16 ?? "pending",
      batch12ProseRestore: process.env.MORSEWORDS_VERIFY_BATCH12 ?? "pending",
      startupPreviewAudit: process.env.MORSEWORDS_VERIFY_STARTUP ?? "pending",
      titleStartDefaultAudit: process.env.MORSEWORDS_VERIFY_TITLE ?? "pending",
      metadataSegmentationAudit: process.env.MORSEWORDS_VERIFY_METADATA ?? "pending",
      manualUiDefectFollowup: process.env.MORSEWORDS_VERIFY_MANUAL ?? "pending",
      targetedVerifier: process.env.MORSEWORDS_VERIFY_TARGETED ?? "pending",
      playwright: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT ?? "pending",
      gitDiffCheck: process.env.MORSEWORDS_VERIFY_DIFFCHECK ?? "pending",
    },
    playwright: {
      result: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT ?? "pending",
      wrapperTimeoutAfter36Of36: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT_WRAPPER_TIMEOUT === "true",
    },
    auditSideEffectHandling: { result: process.env.MORSEWORDS_VERIFY_AUDIT_SIDE_EFFECTS ?? "pending; restore unrelated validation churn before commit" },
    books,
  };
  writeJson(path.join(verificationRoot, "pilot-write-16-verification.json"), report);
  writeMarkdown(report);
  console.log(`Pilot write 16 verification: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail.`);
  if (fail || !batch12Pass) process.exitCode = 1;
}

main();
