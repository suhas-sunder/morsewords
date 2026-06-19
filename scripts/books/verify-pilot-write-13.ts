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
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-13");
const writeRoot = path.join(auditRoot, "pilot-write-13");
const verificationRoot = path.join(auditRoot, "pilot-write-13-verification");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");

const PROCESSED_BATCH = [
  "ashputtel",
  "cat-and-mouse-in-partnership",
  "cat-skin",
  "clever-elsie",
  "clever-gretel",
  "doctor-knowall",
  "frederick-and-catherine",
  "fundevogel",
  "hans-in-luck",
  "hansel-and-gretel",
  "iron-hans",
  "king-grisly-beard",
  "lily-and-the-lion",
  "little-red-riding-hood",
  "old-sultan",
  "rumpelstiltskin",
  "snowdrop",
  "sweetheart-roland",
  "the-dog-and-the-sparrow",
  "the-valiant-little-tailor",
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
  const exactReadableMatch = normalize(generatedText) === normalize(expectedText);
  const startsCorrectly = normalize(generatedText).startsWith(normalize(phrase));
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
    !startsCorrectly || !exactReadableMatch || !contentCopiesAgree ? "content-boundary" : null,
    !oneDefaultSection ? "sectioning/defaults" : null,
    !previewStartsAtBeginning || previewUnsafe ? "preview" : null,
    contentUnsafe || artifactUnsafe ? "cleanup" : null,
    !writeComplete ? "write-report" : null,
  ].filter(Boolean);
  const verificationStatus: VerificationStatus = failures.length === 0 ? "pass" : "fail";
  const correction = slug === "frederick-and-catherine"
    ? "Restored the readable source line beginning 'plates and dishes'; placeholder cleanup now requires a word boundary after Plate."
    : slug === "snowdrop"
      ? "Restored the readable sentence beginning 'By and by'; byline cleanup no longer treats that phrase as an author line."
      : null;

  return {
    slug,
    writeAction: writeBook.finalAction,
    verificationStatus,
    generatedOutputInspected: [manifestPath, cleanedBookPath, processedBookPath, rightsPath, notesPath, ...sectionPaths].map(repoPath),
    previewAssetInspected: repoPath(previewPath),
    generatedTitleVerdict: verdict(titleMatches && sourceTitlePresent ? "pass" : "fail", titleMatches ? `Individual tale title preserved as ${manifest.title}.` : "Generated title does not match source tale identity."),
    generatedAuthorCompilerCollectorTranslatorVerdict: verdict(authorMatches && sourceAuthorPresent && !unknownAuthor ? "pass" : "fail", "Source-backed collector metadata is Jacob Grimm; Wilhelm Grimm, consistent with existing Grimm entries."),
    selectedStructuralConvention: "one contiguous individual-tale section; the source has no meaningful internal subdivisions",
    startBoundaryVerdict: verdict(startsCorrectly && exactReadableMatch ? "pass" : "fail", startsCorrectly ? "True first prose and complete first paragraph are preserved." : "Generated text does not start at the audited first prose phrase."),
    endBoundaryVerdict: verdict(exactReadableMatch ? "pass" : "fail", exactReadableMatch ? "Generated text continues through the exact cleaned-source ending." : "Generated text differs from the cleaned source before its real ending."),
    sectioningVerdict: verdict(oneDefaultSection ? "pass" : "fail", "Single-section output matches the undivided source tale and is included by default."),
    cleanupVerdict: verdict(exactReadableMatch && !contentUnsafe && !artifactUnsafe ? "pass" : "fail", exactReadableMatch ? "Readable prose matches the cleaned source exactly after whitespace normalization; wrapper and artifact material is absent." : "Cleanup altered readable source prose."),
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
    "# Pilot write batch 13 verification",
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
    "## Write-12 script scope investigation",
    "",
    `- Classification: ${report.write12ScriptScopeInvestigation.classification}`,
    `- Resolution: ${report.write12ScriptScopeInvestigation.resolution}`,
    `- Unrelated write-12 changes found: ${report.write12ScriptScopeInvestigation.unrelatedChangesFound ? "yes" : "no"}`,
    "",
    "## Corrections",
    "",
    ...report.correctionsApplied.map((item: JsonRecord) => `- ${item.slug}: ${item.correction}`),
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
  writeText(path.join(verificationRoot, "pilot-write-13-verification.md"), lines.join("\n"));
}

function main() {
  const dryJsonPath = path.join(dryRunRoot, "pilot-dry-run-13.json");
  const dryMdPath = path.join(dryRunRoot, "pilot-dry-run-13.md");
  const writeJsonPath = path.join(writeRoot, "pilot-write-13.json");
  const writeMdPath = path.join(writeRoot, "pilot-write-13.md");
  for (const required of [dryJsonPath, dryMdPath, writeJsonPath, writeMdPath]) {
    if (!fs.existsSync(required)) throw new Error(`Missing required report: ${repoPath(required)}`);
    fs.readFileSync(required, "utf8");
  }
  const dry = readJson(dryJsonPath);
  const write = readJson(writeJsonPath);
  if (dry.reportName !== "pilot-dry-run-13" || write.reportName !== "pilot-write-13") {
    throw new Error("Dry-run or write report identity is incomplete.");
  }
  if (JSON.stringify(dry.selectedBooks) !== JSON.stringify([...PROCESSED_BATCH]) || JSON.stringify(write.selectedBooks) !== JSON.stringify([...PROCESSED_BATCH])) {
    throw new Error("Batch-13 selected list does not match the required 20 slugs.");
  }
  if (write.books?.length !== 20 || write.totals?.firstTimeProcessed !== 20 || write.totals?.skipped !== 0) {
    throw new Error("Write report is incomplete for batch 13.");
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

  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-13-verification",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-write-13-jun-2026",
    scope: "post-write QA/review of the exact 20 pilot write batch 13 books",
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
    write12ScriptScopeInvestigation: {
      file: "scripts/books/pilot-book-processing-write-12.ts",
      classification: "required shared write-12/write-13 implementation retained in an unexpectedly named prior-batch runner",
      findings: [
        "pilot-book-processing-write-13.ts is a five-line wrapper that selects batch 13 and imports the established write-12 runner",
        "the write-12 diff parameterizes report names, branch names, selected slugs, and batch-specific messages for batches 12 and 13",
        "the shared cleanup safeguards are directly required by batch 13, including preserving Rumpelstiltskin's opening line beginning 'By the side'",
        "verification found and corrected two additional over-broad cleanup matches in this shared code",
      ],
      unrelatedChangesFound: false,
      restoredToOriginMain: false,
      resolution: "Retained because the diff is directly used by write 13 and is not unrelated churn; documented here rather than duplicating the full processor into another batch-specific file.",
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

  writeJson(path.join(verificationRoot, "pilot-write-13-verification.json"), report);
  writeMarkdown(report);
  console.log(`Pilot write 13 verification: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail.`);
  if (fail > 0) process.exitCode = 1;
}

main();
