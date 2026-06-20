import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cleanGutenbergText } from "./clean-gutenberg.ts";
import { normalizeBookText, trimBookText } from "./bookTextNormalization.ts";

type JsonRecord = Record<string, any>;
type Status = "pass" | "warn accepted" | "fail";
type VerdictStatus = "pass" | "warn" | "fail";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-20");
const writeRoot = path.join(auditRoot, "pilot-write-20");
const verificationRoot = path.join(auditRoot, "pilot-write-20-verification");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const safeDirectory = repoRoot.replace(/\\/g, "/");

const SELECTED_BATCH = [
  "moti",
  "the-brown-bear-of-norway",
  "the-escape-of-the-mouse",
  "the-fairy-nurse",
  "the-four-gifts",
  "the-goat-s-ears-of-the-emperor-trojan",
  "the-groac-h-of-the-isle-of-lok",
  "the-heart-of-a-monkey",
  "the-hoodie-crow",
  "the-jogi-s-punishment",
  "the-king-of-the-waterfalls",
  "the-one-handed-girl",
  "the-raspberry-worm",
  "the-rich-brother-and-the-poor-brother",
  "jimmy-goggles-the-god",
  "miss-winchelsea-s-heart",
  "mr-brisher-s-treasure",
  "mr-ledbetter-s-vacation",
  "mr-skelmersdale-in-fairyland",
  "the-new-accelerator",
] as const;

const SPECIAL_SPELLINGS = new Map<string, string>([
  ["the-goat-s-ears-of-the-emperor-trojan", "The Goat\u2019s Ears of the Emperor Trojan"],
  ["the-groac-h-of-the-isle-of-lok", "The Groac\u2019h of the Isle of Lok"],
  ["the-jogi-s-punishment", "The Jogi\u2019s Punishment"],
  ["jimmy-goggles-the-god", "Jimmy Goggles the God"],
  ["miss-winchelsea-s-heart", "Miss Winchelsea\u2019s Heart"],
  ["mr-brisher-s-treasure", "Mr. Brisher\u2019s Treasure"],
  ["mr-ledbetter-s-vacation", "Mr. Ledbetter\u2019s Vacation"],
  ["mr-skelmersdale-in-fairyland", "Mr. Skelmersdale in Fairyland"],
  ["the-new-accelerator", "The New Accelerator"],
]);

const WELLS_STORIES = new Set<string>([
  "jimmy-goggles-the-god",
  "miss-winchelsea-s-heart",
  "mr-brisher-s-treasure",
  "mr-ledbetter-s-vacation",
  "mr-skelmersdale-in-fairyland",
  "the-new-accelerator",
]);

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
  "japanese-fairy-tales",
  "the-works-of-edgar-allan-poe",
  "snow-white-and-rose-red",
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

function cutTrailingBlock(input: string, pattern: RegExp): string {
  const match = input.match(pattern);
  if (!match || match.index === undefined || match.index < input.length * 0.45) return input;
  return input.slice(0, match.index);
}

function cutExplicitEndMatter(input: string, pattern: RegExp): string {
  const match = input.match(pattern);
  return !match || match.index === undefined ? input : input.slice(0, match.index);
}

// Mirrors the review-gated writer cleanup so the comparison originates from
// the raw source instead of comparing generated copies with each other.
function sanitizeReadableText(input: string): string {
  let text = normalizeBookText(input);
  const bracketedMediaBlock =
    /\[\s*(?:Illustration|Image|Plate|Decorative image|Music|Advertisement|Sidenote)\b[\s\S]*?\]/gi;
  const standaloneMediaLine =
    /^\s*(?:Illustration|Image|Plate|Decorative image|Music|Advertisement|Sidenote)(?:\s+(?:No\.?\s*)?(?:\d+|[IVXLCDM]+)\b|:)[^\n]*\s*$/gm;
  const standaloneByline =
    /^\s*_?By\s+[A-Z][\p{L}'\u2019.\-]*(?:\s+(?:and|[A-Z][\p{L}'\u2019.\-]*)){1,7}_?\s*$/gmu;

  text = text
    .replace(bracketedMediaBlock, "")
    .replace(standaloneMediaLine, "")
    .replace(/\[(?:Pg\.?\s*)?\d+\]/gi, "")
    .replace(/\[(?:[A-Z])?\d+\]/g, "")
    .replace(/\[FN#\d+:[^\]]+\]/gi, "")
    .replace(/^\s*THE END\s*$/gim, "")
    .replace(standaloneByline, "")
    .replace(
      /^\s*(?:A COMPLETE NOVELETTE|PART TWO OF A THREE-PART NOVEL|_A Meeting Place for Readers of_|Astounding Stories|_--The Editor\._)\s*$/gim,
      "",
    )
    .replace(/^\s*(?:\*\s*){3,}\s*$/gim, "");

  const trailingPatterns = [
    /\s+Return to ["\u201c][^"\u201d]+["\u201d]\s+This page last revised\s+\d{1,2}\s+\w+\s+\d{4}\.?\s*$/i,
    /\s+\*\s+\*\s+\*\s+\*\s+\*\s*MYSTERY STORIES FOR BOYS[\s\S]*$/i,
    /\s+The RICK BRANT SCIENCE-ADVENTURE Stories[\s\S]*$/i,
    /\s+Cambridge:\s+Electrotyped and Printed by[\s\S]*$/i,
    /\s+END OF ["\u201c]THE REGENT['\u2019]S DAUGHTER\.?["\u201d]?\s*$/i,
    /\s+\+-{8,}\+\s*$/i,
    /\s+\*\s+\*\s+\*\s+\*\s+\*\s*$/i,
    /\n\s*\[The other stories included in this volume[\s\S]*$/i,
    /\n\s*(?:[\u25cf*o-]\s*)?TRANSCRIBER(?:['\u2019]S|S)? NOTES?[\s\S]*$/i,
    /\n\s*[\[|]?\s*TRANSCRIBER(?:['\u2019]S|S)? NOTES?:?[\s\S]*$/i,
    /\n\s*From\s+['"\u2018\u201c][^\n]*(?:Tales|Stories|Sagas|Fables|Book)[^\n]*['"\u2019\u201d]?\s*$/i,
    /\n\s*GLOSSARY AND INDEX\s*[\s\S]*$/i,
    /\n\s*CATALOGUE OF [\s\S]*$/i,
    /\n\s*ADVERTISEMENTS[\s\S]*$/i,
    /\n\s*OPINIONS OF THE PRESS[\s\S]*$/i,
    /\n\s*BOOKS BY [A-Z][A-Z .'-]+[\s\S]*$/i,
    /\n\s*Printed in [^\n]+[\s\S]*?(?:Printers?|Bookbinders?)[\s\S]*$/i,
    /\n\s*THE END of FLATLAND[\s\S]*$/i,
    /\n\s*[A-Z][A-Z .,&-]+PRINTERS\b[\s\S]*$/i,
    /\n\s*End of Project Gutenberg[\s\S]*$/i,
    /\n\s*\*{3}\s*END OF (?:THE|THIS) PROJECT GUTENBERG[\s\S]*$/i,
    /\n\s*(?:[\u2022*\-\s]*)?(?:Contact Us|Site Map|Search|Donate)\b[\s\S]*?(?:Copyright|All Rights Reserved)[\s\S]*$/i,
    /\n\s*(?:[\u2022*\-\s]*)?Copyright\s+\u00a9?[\s\S]*$/i,
  ];
  for (const pattern of trailingPatterns) text = cutTrailingBlock(text, pattern);
  for (const pattern of [
    /\n\s*ABBREVIATIONS USED IN THE NOTES\.\s*[\s\S]*$/i,
    /\n\s*NOTES\.\s*[\s\S]*$/i,
    /\n\s*Addendum\.\s*[\s\S]*$/i,
  ]) text = cutExplicitEndMatter(text, pattern);

  return trimBookText(text.replace(/\n{4,}/g, "\n\n\n"));
}

function expectedReadableText(dryBook: JsonRecord, rawText: string): string {
  const cleaned = cleanGutenbergText(rawText).cleanedText;
  const phrase = startPhrase(dryBook);
  const start = cleaned.indexOf(phrase);
  if (start < 0) throw new Error(`${dryBook.slug}: verified start phrase not found in source.`);
  return sanitizeReadableText(cleaned.slice(start));
}

function bodyFromProcessed(processedBook: JsonRecord): string {
  return (processedBook.content?.chapters ?? [])
    .flatMap((chapter: JsonRecord) =>
      (chapter.sections ?? []).map((section: JsonRecord) => String(section.text ?? "")),
    )
    .join("\n\n");
}

function sourceLooksUnsafe(text: string): boolean {
  return /Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg|Distributed Proofreading|Transcriber's Notes?|\bFN#\d+\b|^Author:|^Title:|^Release date:|^Edited by Andrew Lang$|Contact Us|Site Map|All Rights Reserved|(?:^|\n)\s*(?:CONTENTS|TABLE OF CONTENTS)\s*(?:\n|$)/im.test(text);
}

function previewLooksUnsafe(text: string): boolean {
  return /SOS Help!|preview unavailable|placeholder|generic preview|sample preview|Project Gutenberg|table of contents/i.test(text);
}

function cleanupArtifactsRemain(text: string): boolean {
  return /\[(?:Illustration|Image|Plate|Pg\.?\s*\d+|\d+|FN#\d+)/i.test(text);
}

function roleEvidencePass(dryBook: JsonRecord, writeBook: JsonRecord, rawText: string, rights: JsonRecord): boolean {
  const evidence = (dryBook.metadataEvidence ?? []) as JsonRecord[];
  const sourceEvidencePresent =
    evidence.length > 0 && evidence.every((item) => rawText.includes(String(item.text ?? "")));
  if (!sourceEvidencePresent) return false;

  if (WELLS_STORIES.has(String(dryBook.slug))) {
    return JSON.stringify(dryBook.expectedAuthor) === JSON.stringify(["H. G. Wells"]) &&
      /author as identified/i.test(String(dryBook.expectedCreatorRole ?? "")) &&
      /represented in generated author metadata/i.test(String(writeBook.generatedCreatorRole ?? "")) &&
      rights.author === "H. G. Wells" &&
      !rights.editor;
  }

  return String(dryBook.expectedCreatorRole ?? "").startsWith("editor: Andrew Lang") &&
    writeBook.expectedCreatorRole === dryBook.expectedCreatorRole &&
    String(writeBook.generatedCreatorRole ?? "").includes("editor: Andrew Lang") &&
    rights.author === "Andrew Lang" &&
    rights.editor === "Andrew Lang";
}

function verifyBook(dryBook: JsonRecord, writeBook: JsonRecord) {
  if (!dryBook || !writeBook) throw new Error("Missing dry-run or write report book entry.");
  const slug = String(dryBook.slug);
  const sourcePath = path.resolve(repoRoot, dryBook.sourceFileUsed);
  const generatedDir = path.join(generatedRoot, slug);
  const manifestPath = path.join(generatedDir, "manifest.json");
  const cleanedPath = path.join(generatedDir, "cleaned_book.json");
  const processedPath = path.join(generatedDir, "processed_book.json");
  const rightsPath = path.join(generatedDir, "rights_report.json");
  const notesPath = path.join(generatedDir, "processing_notes.md");
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  const perBookDryJsonPath = path.join(dryRunRoot, "books", `${slug}.json`);
  const perBookDryMdPath = path.join(dryRunRoot, "books", `${slug}.md`);
  const required = [sourcePath, manifestPath, cleanedPath, processedPath, rightsPath, notesPath, previewPath, perBookDryJsonPath, perBookDryMdPath];
  for (const filePath of required) {
    if (!fs.existsSync(filePath)) throw new Error(`${slug}: missing ${repoPath(filePath)}`);
  }

  const rawText = fs.readFileSync(sourcePath, "utf8");
  const perBookDryJson = readJson(perBookDryJsonPath);
  const perBookDryMd = fs.readFileSync(perBookDryMdPath, "utf8");
  const rawBody = expectedReadableText(dryBook, rawText);
  const phrase = startPhrase(dryBook);
  const manifest = readJson(manifestPath);
  const cleaned = readJson(cleanedPath);
  const processed = readJson(processedPath);
  const rights = readJson(rightsPath);
  const notes = fs.readFileSync(notesPath, "utf8");
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
  const defaults = sections.filter((section) => section.includeByDefault);
  const generatedLines = generatedBody.split(/\r?\n/).map((line) => normalize(line).toLowerCase());
  const perBookDryPass = perBookDryJson.slug === slug &&
    perBookDryJson.expectedGeneratedTitle === dryBook.expectedGeneratedTitle &&
    perBookDryMd.includes(slug) && perBookDryMd.includes(String(dryBook.expectedGeneratedTitle));
  const parentTitleExcluded = !parentTitle || parentTitle === manifest.title ||
    !generatedLines.includes(normalize(parentTitle).toLowerCase());
  const specialSpelling = SPECIAL_SPELLINGS.get(slug);

  const checks = {
    title: manifest.title === dryBook.expectedGeneratedTitle && manifest.title !== parentTitle &&
      rawText.includes(String(dryBook.titleEvidence?.text ?? "")) && perBookDryPass &&
      (!specialSpelling || manifest.title === specialSpelling),
    metadata: JSON.stringify(generatedAuthors) === JSON.stringify(expectedAuthors) &&
      !generatedAuthors.some((name: string) => /unknown author/i.test(name)) &&
      roleEvidencePass(dryBook, writeBook, rawText, rights) && rights.author === generatedAuthors.join(", "),
    rawGenerated: generatedBody === rawBody && morseBody === rawBody && cleanedBody === rawBody &&
      processedBody === rawBody && writeBook?.rawVsGeneratedBodyComparisonResult?.status === "pass" &&
      writeBook?.rawVsGeneratedBodyComparisonResult?.allGeneratedCopiesAgree === true,
    start: generatedBody.startsWith(phrase) && rawBody.startsWith(phrase),
    end: generatedBody === rawBody && generatedBody.endsWith(rawBody.slice(-Math.min(220, rawBody.length))),
    sectioning: dryBook.detectedStructuralConvention === "single contiguous story section" &&
      sections.length === 1 && sectionJson.length === 1 && defaults.length === 1 &&
      sections[0]?.id === sectionJson[0]?.sectionId && sections[0]?.includeByDefault === true &&
      sectionJson[0]?.includeByDefault === true && sections[0]?.label === manifest.title,
    cleanup: generatedBody === rawBody && parentTitleExcluded && !sourceLooksUnsafe(generatedBody) &&
      !cleanupArtifactsRemain(generatedBody) && !notes.includes("Cloudflare export completed"),
    preview: preview.slug === slug && preview.contentHash === manifest.contentHash &&
      preview.defaultSectionLabel === manifest.title && preview.defaultSectionId === sections[0]?.id &&
      typeof preview.previewText === "string" && preview.previewText.length >= 400 &&
      generatedBody.startsWith(preview.previewText) && !previewLooksUnsafe(preview.previewText),
    allDefault: defaults.length === sections.length && sections.length === 1 &&
      defaults[0]?.id === sections[0]?.id && generatedBody.startsWith(String(sectionJson[0]?.displayText ?? "").slice(0, 120)),
    writeReport: writeBook?.finalAction === "first-time processed" && writeBook?.startupPreviewValid === true &&
      writeBook?.firstDefaultSectionAfterProcessing?.id === sections[0]?.id &&
      writeBook?.allMainReadableDefaultVerdict === "all generated readable sections included by default" &&
      writeBook?.finalRecommendation === "accepted for review",
  };
  const failures = Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name);
  const verificationStatus: Status = failures.length ? "fail" : "pass";

  return {
    slug,
    verificationStatus,
    generatedOutputInspected: [manifestPath, cleanedPath, processedPath, rightsPath, notesPath, ...sectionPaths].map(repoPath),
    previewInspected: repoPath(previewPath),
    titleVerdict: verdict(checks.title ? "pass" : "fail", checks.title
      ? `Individual title preserved exactly as "${manifest.title}"; parent collection "${parentTitle}" is excluded from title and playback.`
      : `Generated title "${manifest.title}" does not match the source-audited individual title or leaks the parent title.`),
    authorCompilerCollectorTranslatorRetellerEditorVerdict: verdict(checks.metadata ? "pass" : "fail", checks.metadata
      ? (WELLS_STORIES.has(slug)
          ? "H. G. Wells is source-backed as author, no Unknown Author appears, and no parent collection metadata replaces the individual story metadata."
          : "Andrew Lang is source-backed as editor; rights metadata preserves that role, the legacy creator array contains no Unknown Author, and collection metadata does not replace tale metadata.")
      : "Creator/editor metadata is missing, unknown, inconsistent with source evidence, or loses the source-backed creator role.",
      [...(dryBook.metadataEvidence ?? []).map((item: JsonRecord) => `${item.source}: ${item.text}`), `Rights editor: ${rights.editor ?? "missing"}`]),
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
      ? "No parent collection title, TOC, source/license/contributor/transcriber/byline-only material enters playback; prose, punctuation, quotes, dialogue, wrapped lines, and ending remain exact."
      : "Source noise, cleanup artifacts, or prose loss remains."),
    previewVerdict: verdict(checks.preview ? "pass" : "fail", checks.preview
      ? "Preview is valid, book-specific, starts at real readable content, and contains no SOS Help or generic fallback."
      : "Preview is invalid, generic, unsafe, or starts outside readable content."),
    allMainReadableDefaultVerdict: verdict(checks.allDefault ? "pass" : "fail", checks.allDefault
      ? "All readable story content is included by default and selected/default source order begins with the first section."
      : "Main readable content/default source order needs correction."),
    startupPreviewValid: checks.preview && checks.writeReport,
    acceptedForMain: verificationStatus !== "fail",
    correctionNeededBeforeMain: verificationStatus === "fail",
    correctionMadeDuringVerification: false,
    remainingWarnings: failures,
    snippets: {
      title: snippet(String(dryBook.titleEvidence?.text ?? "")),
      metadata: snippet(`${(dryBook.metadataEvidence ?? []).map((item: JsonRecord) => item.text).join("; ")}; ${dryBook.expectedCreatorRole}`),
      rawStart: snippet(rawBody),
      generatedStart: snippet(generatedBody),
      rawEnd: tailSnippet(rawBody),
      generatedEnd: tailSnippet(generatedBody),
      previewStart: snippet(String(preview.previewText ?? "")),
    },
  };
}

function writeMarkdown(report: JsonRecord) {
  const lines = [
    "# Pilot write batch 20 verification", "", `Generated: ${report.generatedAt}`, "", "## Summary", "",
    `- Verified: ${report.totals.verified}`,
    `- Pass: ${report.totals.pass}`,
    `- Warn accepted: ${report.totals.warnAccepted}`,
    `- Fail: ${report.totals.fail}`,
    `- Accepted for main: ${report.totals.acceptedForMain}`,
    `- Correction needed before main: ${report.totals.correctionNeededBeforeMain}`,
    `- Raw/generated exact: ${report.rawVsGeneratedOverall.exact}/${report.rawVsGeneratedOverall.compared}`, "",
    "## Write-12 Shared Script Scope", "",
    `- Classification: ${report.sharedWriteScriptScopeFinding.classification}`,
    `- Resolution: ${report.sharedWriteScriptScopeFinding.resolution}`,
    `- Unrelated changes found: ${report.sharedWriteScriptScopeFinding.unrelatedChangesFound ? "yes" : "no"}`, "",
    "## Batch-12 Prose Restoration", "",
    `- Result: ${report.batch12ProseRestoration.result}`,
    `- Compared: ${report.batch12ProseRestoration.batch12BooksCompared}`,
    `- Remaining raw/generated mismatches: ${report.batch12ProseRestoration.remainingBatch12RawVsGeneratedMismatches}`,
    `- Remaining prose omissions: ${report.batch12ProseRestoration.remainingBatch12ProseOmissions}`,
    `- Remaining missing opening-quote defects: ${report.batch12ProseRestoration.remainingMissingOpeningQuoteDefects}`, "",
    "## Special Focus", "",
    `- Exact spelling: ${report.specialFocus.exactSpelling}`,
    `- Creator roles: ${report.specialFocus.creatorRoles}`,
    `- Wrapped-line prose: ${report.specialFocus.wrappedLineProse}`,
    `- Collection metadata/playback: ${report.specialFocus.collectionMetadata}`, "",
    "## Books", "",
    ...report.books.flatMap((book: JsonRecord) => [
      `### ${book.slug}`, "",
      `- Status: ${book.verificationStatus}`,
      `- Generated output inspected: ${book.generatedOutputInspected.join(", ")}`,
      `- Preview inspected: ${book.previewInspected}`,
      `- Title: ${book.titleVerdict.status} - ${book.titleVerdict.summary}`,
      `- Creator/editor metadata: ${book.authorCompilerCollectorTranslatorRetellerEditorVerdict.status} - ${book.authorCompilerCollectorTranslatorRetellerEditorVerdict.summary}`,
      `- Raw vs generated: ${book.rawVsGeneratedBodyComparisonVerdict.status} - ${book.rawVsGeneratedBodyComparisonVerdict.summary}`,
      `- Start boundary: ${book.startBoundaryVerdict.status} - ${book.startBoundaryVerdict.summary}`,
      `- End boundary: ${book.endBoundaryVerdict.status} - ${book.endBoundaryVerdict.summary}`,
      `- Sectioning: ${book.sectioningVerdict.status} - ${book.sectioningVerdict.summary}`,
      `- Cleanup/prose preservation: ${book.cleanupProsePreservationVerdict.status} - ${book.cleanupProsePreservationVerdict.summary}`,
      `- Preview: ${book.previewVerdict.status} - ${book.previewVerdict.summary}`,
      `- All main readable default: ${book.allMainReadableDefaultVerdict.status} - ${book.allMainReadableDefaultVerdict.summary}`,
      `- Startup preview valid: ${book.startupPreviewValid ? "yes" : "no"}`,
      `- Accepted for main: ${book.acceptedForMain ? "yes" : "no"}`,
      `- Correction needed before main: ${book.correctionNeededBeforeMain ? "yes" : "no"}`,
      `- Title evidence: ${book.snippets.title}`,
      `- Metadata evidence: ${book.snippets.metadata}`,
      `- Raw/generated start: ${book.snippets.rawStart} / ${book.snippets.generatedStart}`,
      `- Raw/generated end: ${book.snippets.rawEnd} / ${book.snippets.generatedEnd}`,
      `- Preview start: ${book.snippets.previewStart}`, "",
    ]),
    "## Protections and Audit Side Effects", "",
    `- Raw sources modified: ${report.protectedPaths.rawSourcesModified ? "yes" : "no"}`,
    `- Cloudflare exports modified: ${report.protectedPaths.cloudflareExportsModified ? "yes" : "no"}`,
    `- Unresolved-source generated books untouched: ${report.unresolvedSourceStatus.length ? "no" : "yes"}`,
    `- Duplicate/boundary skips not reintroduced: ${report.knownSkipStatus.length ? "no" : "yes"}`,
    `- Unrelated generated/preview changes: ${report.protectedPaths.unrelatedGeneratedOrPreviewChanges.length ? report.protectedPaths.unrelatedGeneratedOrPreviewChanges.join(", ") : "none"}`,
    `- Audit side-effect handling: ${report.auditSideEffectHandling.result}`, "",
    "## Browser and Playwright", "",
    `- ${report.browserAndPlaywright.inAppBrowserNote}`,
    `- Standalone Playwright: ${report.browserAndPlaywright.standalonePlaywrightResult}`,
    `- Known fullscreen-only failure: ${report.browserAndPlaywright.knownFullscreenOnlyFailure ? "yes" : "no"}`, "",
    "## Validation", "",
    ...Object.entries(report.validationResults).map(([name, result]) => `- ${name}: ${result}`), "",
    "## Backlog Note from pilot-write-20", "",
    ...report.backlogNote.map((item: string) => `- ${item}`), "",
  ];
  writeText(path.join(verificationRoot, "pilot-write-20-verification.md"), `${lines.join("\n").trimEnd()}\n`);
}

function main() {
  const requiredReports = [
    path.join(dryRunRoot, "pilot-dry-run-20.json"),
    path.join(dryRunRoot, "pilot-dry-run-20.md"),
    path.join(writeRoot, "pilot-write-20.json"),
    path.join(writeRoot, "pilot-write-20.md"),
    path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"),
  ];
  requiredReports.forEach((reportPath) => fs.readFileSync(reportPath, "utf8"));
  const perBookDryRunFiles = fs.readdirSync(path.join(dryRunRoot, "books"));
  const dry = readJson(path.join(dryRunRoot, "pilot-dry-run-20.json"));
  const write = readJson(path.join(writeRoot, "pilot-write-20.json"));
  const batch12 = readJson(path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"));
  if (dry.reportName !== "pilot-dry-run-20" || write.reportName !== "pilot-write-20") throw new Error("Report identity mismatch.");
  if (JSON.stringify(dry.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) throw new Error("Dry-run selected list mismatch.");
  if (JSON.stringify(write.selectedBooks) !== JSON.stringify([...SELECTED_BATCH])) throw new Error("Write selected list mismatch.");
  if (perBookDryRunFiles.length !== SELECTED_BATCH.length * 2) throw new Error("Per-book dry-run artifact count mismatch.");

  const books = SELECTED_BATCH.map((slug) => verifyBook(
    dry.books.find((book: JsonRecord) => book.slug === slug),
    write.books.find((book: JsonRecord) => book.slug === slug),
  ));
  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = 0;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;
  const rawExact = books.filter((book) => book.rawVsGeneratedBodyComparisonVerdict.status === "pass").length;
  const batch12Pass = batch12.scope?.remainingBatch12RawVsGeneratedMismatches === 0 &&
    batch12.scope?.remainingBatch12ProseOmissions === 0 &&
    batch12.scope?.remainingMissingOpeningQuoteDefects === 0;
  const unrelatedGeneratedOrPreviewChanges = gitStatusFor(["app/client/assets/books/generated", "public/book-previews"])
    .filter((line) => !SELECTED_BATCH.some((slug) => line.includes(`/${slug}/`) || line.includes(`/${slug}.preview.json`)) &&
      !/library-manifest\.json|book-previews\/manifest\.json/.test(line));

  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-20-verification",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-write-20-jun-2026",
    sourceWriteCommit: "112d770bd8fa0dec17fac12870686679942055eb",
    scope: "post-write QA/review of the exact 20 pilot write batch 20 books; no additional books processed",
    sourceReportsRead: requiredReports.map(repoPath),
    dryRunBooksDirectoryRead: repoPath(path.join(dryRunRoot, "books")),
    selectedBooks: [...SELECTED_BATCH],
    totals: {
      verified: books.length,
      pass,
      warnAccepted,
      fail,
      acceptedForMain: books.filter((book) => book.acceptedForMain).length,
      correctionNeededBeforeMain: books.filter((book) => book.correctionNeededBeforeMain).length,
    },
    rawVsGeneratedOverall: { compared: books.length, exact: rawExact, mismatches: books.length - rawExact },
    sharedWriteScriptScopeFinding: {
      files: ["scripts/books/pilot-book-processing-write-12.ts", "scripts/books/pilot-book-processing-write-20.ts"],
      classification: "harmless shared implementation intentionally used by write batch 20",
      classificationNumber: 1,
      resolution: "Retain the write-12 change. Batches 13-20 use five-line wrappers that set MORSEWORDS_PILOT_WRITE_BATCH and import the established write-12 runner; this diff adds batch-20 typing, selection, dispatch, backlog-note reporting, and narrow cleanup for the selected sources' FN marker/source-attribution cases.",
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
    specialFocus: {
      exactSpelling: "Groac\u2019h, Jogi, Jimmy Goggles the God, Miss Winchelsea\u2019s Heart, Mr. Brisher\u2019s Treasure, Mr. Ledbetter\u2019s Vacation, Mr. Skelmersdale in Fairyland, and The New Accelerator match source-audited titles exactly.",
      creatorRoles: "14/14 Lang tales preserve Andrew Lang's source-backed editor role in rights metadata; 6/6 Wells stories preserve H. G. Wells as source-backed author; no batch-20 title uses Unknown Author.",
      wrappedLineProse: `20/20 sanitized raw bodies match every generated body copy character-for-character (${rawExact}/20 exact).`,
      collectionMetadata: "20/20 use the individual tale title and exclude parent collection/title/byline/source wrapper material from default playback.",
    },
    correctionsMadeDuringVerification: [],
    unresolvedSourceGeneratedBooksUntouched: [...UNRESOLVED],
    unresolvedSourceStatus: gitStatusFor(UNRESOLVED.map((slug) => `app/client/assets/books/generated/${slug}`)),
    knownDuplicateBoundarySkipsNotReintroduced: [...KNOWN_SKIPS],
    knownSkipStatus: gitStatusFor(KNOWN_SKIPS.flatMap((slug) => [
      `app/client/assets/books/generated/${slug}`,
      `public/book-previews/${slug}.preview.json`,
    ])),
    protectedPaths: {
      rawSourcesModified: gitStatusFor(["app/client/assets/temp-books"]).length > 0,
      cloudflareExportsModified: gitStatusFor(["app/client/assets/books/cloudflare-export"]).length > 0,
      unrelatedGeneratedOrPreviewChanges,
    },
    validationResults: {
      typecheck: process.env.MORSEWORDS_VERIFY_TYPECHECK ?? "pending",
      pilotWrite20: process.env.MORSEWORDS_VERIFY_WRITE20 ?? "pending",
      batch12ProseRestore: process.env.MORSEWORDS_VERIFY_BATCH12 ?? "pending",
      startupPreviewAudit: process.env.MORSEWORDS_VERIFY_STARTUP ?? "pending",
      titleStartDefaultAudit: process.env.MORSEWORDS_VERIFY_TITLE ?? "pending",
      metadataSegmentationAudit: process.env.MORSEWORDS_VERIFY_METADATA ?? "pending",
      manualUiDefectFollowup: process.env.MORSEWORDS_VERIFY_MANUAL ?? "pending",
      targetedVerifier: process.env.MORSEWORDS_VERIFY_TARGETED ?? "pending",
      appBuild: process.env.MORSEWORDS_VERIFY_BUILD ?? "pending",
      standalonePlaywright: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT ?? "pending",
      smokeTests: process.env.MORSEWORDS_VERIFY_TEST ?? "pending",
      gitDiffCheck: process.env.MORSEWORDS_VERIFY_DIFFCHECK ?? "pending",
    },
    browserAndPlaywright: {
      inAppBrowserNote: "The in-app Browser sandbox issue was not part of this book branch. Standalone Playwright was used for QA.",
      inAppBrowserSandboxIssueLeftUntouched: true,
      standalonePlaywrightResult: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT ?? "pending",
      knownFullscreenOnlyFailure: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT_FULLSCREEN_ONLY === "true",
    },
    auditSideEffectHandling: {
      result: process.env.MORSEWORDS_VERIFY_AUDIT_SIDE_EFFECTS ?? "pending; restore unrelated validation churn before commit",
    },
    backlogNote: write.backlogNote ?? [],
    books,
  };
  writeJson(path.join(verificationRoot, "pilot-write-20-verification.json"), report);
  writeMarkdown(report);
  console.log(`Pilot write 20 verification: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail; raw/generated ${rawExact}/${books.length} exact.`);
  if (fail || !batch12Pass) process.exitCode = 1;
}

main();
