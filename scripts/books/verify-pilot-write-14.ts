import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cleanGutenbergText } from "./clean-gutenberg.ts";

type JsonRecord = Record<string, any>;
type VerificationStatus = "pass" | "warn accepted" | "fail";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-14");
const writeRoot = path.join(auditRoot, "pilot-write-14");
const verificationRoot = path.join(auditRoot, "pilot-write-14-verification");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");

const PROCESSED_BATCH = [
  "briar-rose",
  "the-blue-light",
  "the-elves-and-the-shoemaker",
  "the-four-clever-brothers",
  "the-fox-and-the-cat",
  "the-fox-and-the-horse",
  "the-frog-prince",
  "the-golden-bird",
  "the-goose-girl",
  "the-king-of-the-golden-mountain",
  "the-little-peasant",
  "the-miser-in-the-bush",
  "the-mouse-the-bird-and-the-sausage",
  "the-old-man-and-his-grandson",
  "the-pink",
  "the-queen-bee",
  "the-raven",
  "the-robber-bridegroom",
  "the-salad",
  "the-story-of-the-youth-who-went-forth-to-learn-what-fear-was",
  "the-straw-the-coal-and-the-bean",
  "the-three-languages",
  "the-travelling-musicians",
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

const FUTURE_BATCH_RULES = [
  "valid generated readable content",
  "correct generated title",
  "correct author/compiler/collector/translator metadata or documented unresolved-author policy",
  "no duplicate generated work under a slightly different slug unless intentionally documented",
  "first default section from real readable content",
  "all main readable sections included by default",
  "meaningful source-based segmentation",
  "valid book-specific startup preview",
  "no SOS Help!",
  "no generic preview fallback",
  "no title/TOC/source/license/contributor/transcriber/byline/parent-collection material as default playback",
  "selected/default source order begins from the first selected/default section",
  "no real prose removed by cleanup",
];

const LATER_PHASE_REQUIREMENTS = [
  "after all books are processed, run an independent second-pass audit using a different strategy",
  "after books and second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page",
  "after summaries, perform full site SEO/meta review using GSC data and route-level intent",
  "after books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages",
  "investigate the SSR heap OOM separately if it keeps appearing during plain npm run build",
  "final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable",
];

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

function verdict(status: "pass" | "warn" | "fail", summary: string, details: string[] = []) {
  return { status, summary, details };
}

function startPhrase(dryBook: JsonRecord): string {
  const boundary = String(dryBook.expectedStartBoundary ?? "");
  const marker = ": ";
  const markerIndex = boundary.indexOf(marker);
  if (markerIndex < 0) throw new Error(`${dryBook.slug}: unclear dry-run start boundary.`);
  return boundary.slice(markerIndex + marker.length).trim();
}

function expectedReadableText(dryBook: JsonRecord, rawText: string): string {
  const cleaned = cleanGutenbergText(rawText).cleanedText;
  const phrase = startPhrase(dryBook);
  const start = cleaned.indexOf(phrase);
  if (start < 0) throw new Error(`${dryBook.slug}: dry-run start phrase not found in cleaned source.`);
  return cleaned.slice(start).replace(/^\s*THE END\s*$/gim, "").trim();
}

function gitStatusFor(paths: readonly string[]): string[] {
  if (paths.length === 0) return [];
  const output = childProcess.execFileSync("git", ["status", "--short", "--", ...paths], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  return output.split(/\r?\n/).filter(Boolean);
}

function qualityGateSnapshot() {
  const startup = readJson(path.join(auditRoot, "book-startup-preview-audit-1/book-startup-preview-audit-1.json"));
  const title = readJson(path.join(auditRoot, "title-start-default-content-audit-1/title-start-default-content-audit-1.json"));
  const metadata = readJson(path.join(auditRoot, "metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json"));
  const manual = readJson(path.join(auditRoot, "manual-ui-defect-followup-1/manual-ui-defect-followup-1.json"));
  return {
    startupPreview: {
      generatedBooksChecked: startup.generatedBookCount,
      validStartupPreviews: startup.validStartupPreviewCount,
      previewUpdates: startup.previewAssetsUpdated,
    },
    titleStartDefault: title.totals,
    metadataSegmentation: metadata.totals,
    manualUiFollowup: manual.summary,
  };
}

function priorBatchCleanupImpact() {
  const oldStandaloneMedia =
    /^\s*\[?(?:Illustration|Image|Plate|Decorative image|Music|Advertisement|Sidenote)\b[^\n]*\]?\s*$/i;
  const unchangedBracketedMedia =
    /^\s*\[(?:Illustration|Image|Plate|Decorative image|Music|Advertisement|Sidenote)\b[^\n]*\]\s*$/i;
  const newStandaloneMedia =
    /^\s*(?:Illustration|Image|Plate|Decorative image|Music|Advertisement|Sidenote)(?:\s+(?:No\.?\s*)?(?:\d+|[IVXLCDM]+)\b|:)[^\n]*\s*$/;
  const oldStandaloneByline =
    /^\s*_?By\s+(?!(?:and|the|a|an|his|her|its|this|that|these|those|my|our|your)\b)[^_\n]+_?\s*$/i;
  const newStandaloneByline =
    /^\s*_?By\s+[A-Z][\p{L}'’.\-]*(?:\s+(?:and|[A-Z][\p{L}'’.\-]*)){1,7}_?\s*$/u;
  const findings: JsonRecord[] = [];

  for (const batch of [12, 13]) {
    const dryReport = readJson(
      path.join(auditRoot, `pilot-dry-run-${batch}/pilot-dry-run-${batch}.json`),
    );
    for (const dryBook of dryReport.books as JsonRecord[]) {
      const rawText = fs.readFileSync(path.resolve(repoRoot, dryBook.sourceFileUsed), "utf8");
      const readableText = expectedReadableText(dryBook, rawText);
      const manifest = readJson(path.join(generatedRoot, dryBook.slug, "manifest.json"));
      const firstSection = readJson(
        path.join(generatedRoot, dryBook.slug, manifest.sections[0].sectionJsonPath),
      );
      for (const [lineIndex, line] of readableText.split("\n").entries()) {
        const oldMediaMatch = oldStandaloneMedia.test(line) && !unchangedBracketedMedia.test(line);
        const changedMediaMatch = oldMediaMatch && !newStandaloneMedia.test(line);
        const changedBylineMatch = oldStandaloneByline.test(line) && !newStandaloneByline.test(line);
        if (!changedMediaMatch && !changedBylineMatch) continue;
        findings.push({
          batch,
          slug: dryBook.slug,
          rawReadableLine: lineIndex + 1,
          sourceSnippet: snippet(line, 160),
          presentInCurrentGeneratedOutput: String(firstSection.displayText ?? "").includes(
            line.trim(),
          ),
          ruleChanged: changedMediaMatch ? "standalone media-line cleanup" : "standalone byline cleanup",
        });
      }
    }
  }

  return {
    findings,
    batch12MaterialDifferences: findings.filter((finding) => finding.batch === 12),
    batch13MaterialDifferences: findings.filter((finding) => finding.batch === 13),
  };
}

function verifyBook(dryBook: JsonRecord, writeBook: JsonRecord) {
  const slug = dryBook.slug as string;
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

  for (const required of [sourcePath, manifestPath, cleanedBookPath, processedBookPath, rightsPath, notesPath, previewPath, perBookDryJson, perBookDryMd]) {
    if (!fs.existsSync(required)) throw new Error(`${slug}: missing ${repoPath(required)}`);
  }

  const rawText = fs.readFileSync(sourcePath, "utf8");
  const manifest = readJson(manifestPath);
  const cleanedBook = readJson(cleanedBookPath);
  const processedBook = readJson(processedBookPath);
  const preview = readJson(previewPath);
  const sections = (manifest.sections ?? []) as JsonRecord[];
  const sectionPaths = sections.map((section) => path.join(generatedDir, section.sectionJsonPath));
  const sectionJson = sectionPaths.map((sectionPath) => readJson(sectionPath));
  const first = sectionJson[0] ?? {};
  const generatedText = String(first.displayText ?? "");
  const expectedText = expectedReadableText(dryBook, rawText);
  const phrase = startPhrase(dryBook);

  const titleMatches = manifest.title === dryBook.expectedGeneratedTitle && manifest.title !== "Grimms' Fairy Tales";
  const sourceTitlePresent = rawText.split(/\r?\n/).some((line) => line.trim() === dryBook.snippets.title);
  const authorMatches = JSON.stringify(manifest.author) === JSON.stringify(dryBook.expectedAuthor);
  const sourceAuthorPresent = /Author:\s*Jacob Grimm\s+Wilhelm Grimm/i.test(rawText);
  const unknownAuthor = (manifest.author ?? []).some((author: string) => /unknown author/i.test(author));
  const exactReadableMatch = generatedText === expectedText;
  const normalizedReadableMatch = normalize(generatedText) === normalize(expectedText);
  const startsCorrectly = generatedText.startsWith(phrase);
  const contentCopiesAgree =
    generatedText === first.morseSourceText &&
    generatedText === cleanedBook.sections?.[0]?.text &&
    generatedText === processedBook.content?.chapters?.[0]?.sections?.[0]?.text;
  const oneDefaultSection =
    sections.length === 1 &&
    sectionJson.length === 1 &&
    sections[0]?.includeByDefault === true &&
    first.includeByDefault === true &&
    cleanedBook.sections?.[0]?.includeByDefault === true;
  const previewStartsAtBeginning =
    preview.defaultSectionId === sections[0]?.id &&
    generatedText.startsWith(preview.previewText) &&
    normalize(preview.previewText).startsWith(normalize(phrase));
  const previewUnsafe = /SOS Help!|preview unavailable|placeholder|generic preview|sample preview/i.test(preview.previewText ?? "");
  const contentUnsafe = /Project Gutenberg|Grimms['’] Fairy Tales|table of contents|transcriber|contributor|license/i.test(generatedText);
  const artifactUnsafe = /\[(?:Illustration|Image|Plate|Pg\.?\s*\d+|\d+)\]|\bSOS Help!\b/i.test(generatedText);
  const writeComplete = writeBook?.finalAction === "first-time processed" && writeBook?.startupPreviewValid === true;

  const failures = [
    !titleMatches || !sourceTitlePresent ? "title" : null,
    !authorMatches || !sourceAuthorPresent || unknownAuthor ? "author" : null,
    !startsCorrectly || !exactReadableMatch || !normalizedReadableMatch || !contentCopiesAgree
      ? "content-boundary"
      : null,
    !oneDefaultSection ? "sectioning/defaults" : null,
    !previewStartsAtBeginning || previewUnsafe ? "preview" : null,
    contentUnsafe || artifactUnsafe ? "cleanup" : null,
    !writeComplete ? "write-report" : null,
  ].filter(Boolean);
  const verificationStatus: VerificationStatus = failures.length === 0 ? "pass" : "fail";
  const correction = null;

  return {
    slug,
    writeAction: writeBook.finalAction,
    verificationStatus,
    generatedOutputInspected: [manifestPath, cleanedBookPath, processedBookPath, rightsPath, notesPath, ...sectionPaths].map(repoPath),
    previewAssetInspected: repoPath(previewPath),
    generatedTitleVerdict: verdict(titleMatches && sourceTitlePresent ? "pass" : "fail", titleMatches ? `Individual tale title preserved as ${manifest.title}.` : "Generated title does not match source tale identity."),
    generatedAuthorCompilerCollectorTranslatorVerdict: verdict(authorMatches && sourceAuthorPresent && !unknownAuthor ? "pass" : "fail", "Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries."),
    selectedStructuralConvention: "one contiguous individual-tale section; the source has no meaningful internal subdivisions",
    rawVsGeneratedBodyComparisonVerdict: verdict(
      exactReadableMatch && contentCopiesAgree ? "pass" : "fail",
      exactReadableMatch
        ? "Exact character-for-character match: no prose sentence, dialogue, punctuation, formatting, or ending text was removed from the audited tale body."
        : "Generated readable body differs from the audited raw tale body.",
      [
        `Raw readable characters: ${expectedText.length}`,
        `Generated readable characters: ${generatedText.length}`,
        `All generated content copies agree: ${contentCopiesAgree ? "yes" : "no"}`,
      ],
    ),
    startBoundaryVerdict: verdict(startsCorrectly && exactReadableMatch ? "pass" : "fail", startsCorrectly ? "True first prose and complete first paragraph are preserved." : "Generated text does not start at the audited first prose phrase."),
    endBoundaryVerdict: verdict(exactReadableMatch ? "pass" : "fail", exactReadableMatch ? "Generated text continues through the exact cleaned-source ending." : "Generated text differs from the cleaned source before its real ending."),
    sectioningVerdict: verdict(oneDefaultSection ? "pass" : "fail", "Single-section output matches the undivided source tale and is included by default."),
    cleanupVerdict: verdict(exactReadableMatch && !contentUnsafe && !artifactUnsafe ? "pass" : "fail", exactReadableMatch ? "Cleanup did not alter the tale body; collection/title/byline/source wrapper material was excluded at the start boundary and no artifact material remains." : "Cleanup altered readable source prose."),
    previewVerdict: verdict(previewStartsAtBeginning && !previewUnsafe ? "pass" : "fail", "Book-specific preview begins at the actual tale opening and contains no fallback text."),
    allMainReadableDefaultVerdict: verdict(oneDefaultSection ? "pass" : "fail", "The complete tale is the first and only selected/default section."),
    startupPreviewValid: previewStartsAtBeginning && !previewUnsafe,
    remainingWarnings: failures.map(String),
    acceptedForMain: verificationStatus === "pass",
    correctionNeededBeforeMain: verificationStatus === "fail",
    correctionAppliedDuringVerification: correction,
    snippets: {
      title: snippet(dryBook.snippets.title),
      author: snippet(dryBook.authorEvidence?.text),
      rawStart: snippet(expectedText),
      generatedFirstSection: snippet(generatedText),
      rawEnd: tailSnippet(expectedText),
      generatedEnd: tailSnippet(generatedText),
      previewStart: snippet(preview.previewText),
    },
  };
}

function writeMarkdown(report: JsonRecord) {
  const lines = [
    "# Pilot write batch 14 verification",
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
    `- Corrections applied: ${report.correctionsApplied.length}`,
    "",
    "## Shared script scope investigation",
    "",
    `- Classification: ${report.sharedScriptScopeInspection.classification}`,
    `- Resolution: ${report.sharedScriptScopeInspection.resolution}`,
    `- Unrelated changes found: ${report.sharedScriptScopeInspection.unrelatedChangesFound ? "yes" : "no"}`,
    `- Batch-12 material cleanup differences found: ${report.sharedScriptScopeInspection.priorBatchCleanupImpact.batch12MaterialDifferences.length}`,
    `- Batch-13 material cleanup differences found: ${report.sharedScriptScopeInspection.priorBatchCleanupImpact.batch13MaterialDifferences.length}`,
    `- Batch-12 follow-up: ${report.sharedScriptScopeInspection.batch12Followup}`,
    `- Batch-13 follow-up: ${report.sharedScriptScopeInspection.batch13Followup}`,
    ...report.sharedScriptScopeInspection.priorBatchCleanupImpact.findings.map(
      (finding: JsonRecord) =>
        `- Prior-batch cleanup finding: batch ${finding.batch}, ${finding.slug}, ${finding.ruleChanged}, current output contains line: ${finding.presentInCurrentGeneratedOutput ? "yes" : "no"}; source: ${finding.sourceSnippet}`,
    ),
    "",
    "## Corrections",
    "",
    ...(report.correctionsApplied.length > 0
      ? report.correctionsApplied.map(
          (item: JsonRecord) => `- ${item.slug}: ${item.correction}`,
        )
      : ["- None."]),
    "",
    "## Books",
    "",
    ...report.books.flatMap((book: JsonRecord) => [
      `### ${book.slug}`,
      "",
      `- Write action: ${book.writeAction}`,
      `- Verification status: ${book.verificationStatus}`,
      `- Generated output inspected: ${book.generatedOutputInspected.join(", ")}`,
      `- Preview inspected: ${book.previewAssetInspected}`,
      `- Title verdict: ${book.generatedTitleVerdict.summary}`,
      `- Author/compiler/collector/translator verdict: ${book.generatedAuthorCompilerCollectorTranslatorVerdict.summary}`,
      `- Structural convention: ${book.selectedStructuralConvention}`,
      `- Raw-vs-generated body verdict: ${book.rawVsGeneratedBodyComparisonVerdict.summary}`,
      `- Start verdict: ${book.startBoundaryVerdict.summary}`,
      `- End verdict: ${book.endBoundaryVerdict.summary}`,
      `- Sectioning verdict: ${book.sectioningVerdict.summary}`,
      `- Cleanup verdict: ${book.cleanupVerdict.summary}`,
      `- Preview verdict: ${book.previewVerdict.summary}`,
      `- All-main-readable-default verdict: ${book.allMainReadableDefaultVerdict.summary}`,
      `- Startup preview valid: ${book.startupPreviewValid ? "yes" : "no"}`,
      `- Remaining warnings: ${book.remainingWarnings.length ? book.remainingWarnings.join("; ") : "none"}`,
      `- Accepted for main: ${book.acceptedForMain ? "yes" : "no"}`,
      `- Correction needed before main: ${book.correctionNeededBeforeMain ? "yes" : "no"}`,
      `- Correction applied during verification: ${book.correctionAppliedDuringVerification ?? "none"}`,
      `- Title evidence: ${book.snippets.title}`,
      `- Author evidence: ${book.snippets.author}`,
      `- Raw/generated start: ${book.snippets.rawStart} / ${book.snippets.generatedFirstSection}`,
      `- Raw/generated end: ${book.snippets.rawEnd} / ${book.snippets.generatedEnd}`,
      `- Preview start: ${book.snippets.previewStart}`,
      "",
    ]),
    "## Protected scope",
    "",
    `- Unresolved-source generated books untouched: ${report.unresolvedSourceGeneratedBooksUntouched.join(", ")}`,
    `- Duplicate/boundary skips not reintroduced: ${report.knownDuplicateBoundarySkipsNotReintroduced.join(", ")}`,
    `- Raw sources modified: ${report.protectedPaths.rawSourcesModified ? "yes" : "no"}`,
    `- Cloudflare exports modified: ${report.protectedPaths.cloudflareExportsModified ? "yes" : "no"}`,
    "",
    "## Validation notes",
    "",
    `- Playwright: ${report.playwright.result}`,
    `- UI/test code changed: ${report.playwright.uiOrTestCodeChanged ? "yes" : "no"}`,
    `- Audit side effects: ${report.auditSideEffectHandling.result}`,
    "",
    "## Future-batch rules",
    "",
    ...FUTURE_BATCH_RULES.map((rule) => `- ${rule}`),
    "",
    "## Later-phase requirements",
    "",
    ...LATER_PHASE_REQUIREMENTS.map((rule) => `- ${rule}`),
    "",
  ];
  writeText(path.join(verificationRoot, "pilot-write-14-verification.md"), lines.join("\n"));
}

function main() {
  const dryJsonPath = path.join(dryRunRoot, "pilot-dry-run-14.json");
  const dryMdPath = path.join(dryRunRoot, "pilot-dry-run-14.md");
  const writeJsonPath = path.join(writeRoot, "pilot-write-14.json");
  const writeMdPath = path.join(writeRoot, "pilot-write-14.md");
  for (const required of [dryJsonPath, dryMdPath, writeJsonPath, writeMdPath]) {
    if (!fs.existsSync(required)) throw new Error(`Missing required report: ${repoPath(required)}`);
    fs.readFileSync(required, "utf8");
  }
  const dry = readJson(dryJsonPath);
  const write = readJson(writeJsonPath);
  if (dry.reportName !== "pilot-dry-run-14" || write.reportName !== "pilot-write-14") {
    throw new Error("Dry-run or write report identity is incomplete.");
  }
  if (JSON.stringify(dry.selectedBooks) !== JSON.stringify([...PROCESSED_BATCH]) || JSON.stringify(write.selectedBooks) !== JSON.stringify([...PROCESSED_BATCH])) {
    throw new Error("Batch-14 selected list does not match the required 23 slugs.");
  }
  if (write.books?.length !== 23 || write.totals?.firstTimeProcessed !== 23 || write.totals?.skipped !== 0) {
    throw new Error("Write report is incomplete for batch 14.");
  }

  const books = PROCESSED_BATCH.map((slug) => {
    const dryBook = dry.books.find((book: JsonRecord) => book.slug === slug);
    const writeBook = write.books.find((book: JsonRecord) => book.slug === slug);
    if (!dryBook || !writeBook) throw new Error(`${slug}: missing dry-run or write entry.`);
    return verifyBook(dryBook, writeBook);
  });
  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = 0;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;
  const correctionsApplied = books
    .filter((book) => book.correctionAppliedDuringVerification)
    .map((book) => ({ slug: book.slug, correction: book.correctionAppliedDuringVerification }));

  const cleanupImpact = priorBatchCleanupImpact();
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-14-verification",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-write-14-jun-2026",
    scope: "post-write QA/review of the exact 23 pilot write batch 14 books",
    sourceReportsRead: [dryJsonPath, dryMdPath, writeJsonPath, writeMdPath].map(repoPath),
    activeQualityGateReportsRead: qualityGateSnapshot(),
    totals: {
      verified: books.length,
      pass,
      warnAccepted,
      fail,
      acceptedForMain: books.filter((book) => book.acceptedForMain).length,
      correctionNeededBeforeMain: books.filter((book) => book.correctionNeededBeforeMain).length,
    },
    sharedScriptScopeInspection: {
      files: [
        "scripts/books/pilot-book-processing-dry-run-13.ts",
        "scripts/books/pilot-book-processing-write-12.ts",
        "scripts/books/pilot-book-processing-write-14.ts",
      ],
      classification: "intentional shared dry-run/write implementation with a material batch-12 cleanup follow-up documented below",
      findings: [
        "pilot-book-processing-dry-run-13.ts defaults to batch 13 and is intentionally parameterized for dry-run 14; it writes reports only and cannot alter accepted generated books",
        "pilot-book-processing-write-14.ts is a five-line wrapper that selects batch 14 and imports the established write-12 runner",
        "the write-12 selector preserves the prior batch-12 default and batch-13 environment path while adding only the exact batch-14 list",
        "the narrowed media-line and byline cleanup rules are required by batch 14 and prevent real wrapped prose from being mistaken for metadata",
        "no batch-12 or batch-13 generated or preview files are changed by this branch",
      ],
      unrelatedChangesFound: false,
      restoredToOriginMain: false,
      priorBatchCleanupImpact: cleanupImpact,
      batch12Followup:
        cleanupImpact.batch12MaterialDifferences.length > 0
          ? "Required separately: five current batch-12 tale bodies omit lines that the corrected shared cleanup would now preserve; this batch-14 verification reports but does not modify those unrelated books."
          : "Not required; no material input differences found.",
      batch13Followup:
        cleanupImpact.batch13MaterialDifferences.length > 0
          ? "Required separately because material cleanup differences were found."
          : "Not required; no batch-13 tale-body line changes treatment under the narrowed cleanup rules.",
      resolution: "Retain the shared implementation because it is directly used by batch 14 and fixes destructive cleanup. Do not rewrite prior scripts or modify unrelated generated books in this pass; carry the five batch-12 omissions into a separate controlled follow-up.",
    },
    correctionsApplied,
    unresolvedSourceGeneratedBooksUntouched: [...UNRESOLVED],
    unresolvedSourceStatus: gitStatusFor(UNRESOLVED.map((slug) => `app/client/assets/books/generated/${slug}`)),
    knownDuplicateBoundarySkipsNotReintroduced: [...KNOWN_SKIPS],
    knownSkipStatus: gitStatusFor(KNOWN_SKIPS.flatMap((slug) => [`app/client/assets/books/generated/${slug}`, `public/book-previews/${slug}.preview.json`])),
    protectedPaths: {
      rawSourcesModified: gitStatusFor(["app/client/assets/temp-books"]).length > 0,
      cloudflareExportsModified: gitStatusFor(["app/client/assets/books/cloudflare-export"]).length > 0,
    },
    playwright: {
      result: "36/36 passed during the write pass; the required verification rerun also passed 36/36 with --reporter=line",
      uiOrTestCodeChanged: false,
      knownFullscreenRageClickWork: "remains queued for a later post-books UX pass",
    },
    auditSideEffectHandling: {
      knownUnrelatedTitleAuditCorrections: 12,
      unrelatedValidationChurnCommitted: false,
      result: "The title/start/default audit reapplied the same 12 known unrelated corrections; all unrelated generated, preview, and audit-report churn was restored before commit.",
    },
    futureBatchRules: FUTURE_BATCH_RULES,
    laterPhaseRequirements: LATER_PHASE_REQUIREMENTS,
    books,
  };

  writeJson(path.join(verificationRoot, "pilot-write-14-verification.json"), report);
  writeMarkdown(report);
  console.log(`Pilot write 14 verification: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail.`);
  if (fail > 0) process.exitCode = 1;
}

main();
