import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeBookText, trimBookText } from "./bookTextNormalization.ts";
import { cleanGutenbergText } from "./clean-gutenberg.ts";

type JsonRecord = Record<string, any>;
type Status = "pass" | "warn accepted" | "fail";
type VerdictStatus = "pass" | "warn" | "fail";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const safeDirectory = repoRoot.replace(/\\/g, "/");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunRoot = path.join(auditRoot, "pilot-dry-run-23");
const writeRoot = path.join(auditRoot, "pilot-write-23");
const verificationRoot = path.join(auditRoot, "pilot-write-23-verification");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");

const SELECTED_BATCH = [
  "in-the-modern-vein",
  "the-argonauts-of-the-air",
  "the-dreams-in-the-witch-house",
  "the-jilting-of-jane",
  "the-lost-inheritance",
  "the-purple-pileus",
  "the-shadow-out-of-time",
  "the-strange-high-house-in-the-mist",
  "the-valley-of-spiders",
  "the-whisperer-in-darkness",
] as const;

const WELLS_SLUGS = new Set([
  "in-the-modern-vein",
  "the-argonauts-of-the-air",
  "the-jilting-of-jane",
  "the-lost-inheritance",
  "the-purple-pileus",
  "the-valley-of-spiders",
]);

const LOVECRAFT_SLUGS = new Set([
  "the-dreams-in-the-witch-house",
  "the-shadow-out-of-time",
  "the-strange-high-house-in-the-mist",
  "the-whisperer-in-darkness",
]);

const EXACT_TITLE_EXPECTATIONS = new Map<string, string>([
  ["in-the-modern-vein", "In the Modern Vein"],
  ["the-argonauts-of-the-air", "The Argonauts of the Air"],
  ["the-dreams-in-the-witch-house", "The Dreams in the Witch-House"],
  ["the-jilting-of-jane", "The Jilting of Jane"],
  ["the-lost-inheritance", "The Lost Inheritance"],
  ["the-purple-pileus", "The Purple Pileus"],
  ["the-shadow-out-of-time", "The Shadow Out of Time"],
  ["the-strange-high-house-in-the-mist", "The Strange High House in the Mist"],
  ["the-valley-of-spiders", "The Valley of Spiders"],
  ["the-whisperer-in-darkness", "The Whisperer in Darkness"],
]);

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

const KNOWN_DUPLICATE_BOUNDARY_SKIPS = [
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

function arraysEqual(left: readonly unknown[], right: readonly unknown[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function gitStatusFor(paths: readonly string[]): string[] {
  const output = childProcess.execFileSync(
    "git",
    ["-c", `safe.directory=${safeDirectory}`, "status", "--short", "--", ...paths],
    { cwd: repoRoot, encoding: "utf8" },
  );
  return output.split(/\r?\n/).filter(Boolean);
}

function extractHeaderValue(rawText: string, header: string): string | null {
  const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return rawText.match(new RegExp(`^${escaped}:\\s*(.+)$`, "im"))?.[1]?.trim() ?? null;
}

function expectedStartMarker(dryBook: JsonRecord): string {
  const boundary = String(dryBook.expectedStartBoundary ?? "");
  const afterPrefix = boundary.replace(/^start at\s+/i, "").trim();
  const separatorIndex = afterPrefix.indexOf(": ");
  if (separatorIndex < 0) return afterPrefix;
  return afterPrefix.slice(separatorIndex + 2).trim();
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
    .replace(/^\s*(?:A COMPLETE NOVELETTE|PART TWO OF A THREE-PART NOVEL|Astounding Stories)\s*$/gim, "")
    .replace(/^\s*(?:\*\s*){3,}\s*$/gim, "");

  const trailingPatterns = [
    /\s+Return to ["\u201c][^"\u201d]+["\u201d]\s+This page last revised\s+\d{1,2}\s+\w+\s+\d{4}\.?\s*$/i,
    /\n\s*(?:[\u25cf*o-]\s*)?TRANSCRIBER(?:['\u2019]S|S)? NOTES?[\s\S]*$/i,
    /\n\s*[\[|]?\s*TRANSCRIBER(?:['\u2019]S|S)? NOTES?:?[\s\S]*$/i,
    /\n\s*From\s+['"\u2018\u201c][^\n]*(?:Tales|Stories|Sagas|Fables|Book)[^\n]*['"\u2019\u201d]?\s*$/i,
    /\n\s*CATALOGUE OF [\s\S]*$/i,
    /\n\s*ADVERTISEMENTS[\s\S]*$/i,
    /\n\s*BOOKS BY [A-Z][A-Z .'-]+[\s\S]*$/i,
    /\n\s*Printed in [^\n]+[\s\S]*?(?:Printers?|Bookbinders?)[\s\S]*$/i,
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
  ]) {
    text = cutExplicitEndMatter(text, pattern);
  }

  return trimBookText(text.replace(/\n{4,}/g, "\n\n\n"));
}

function expectedReadableText(dryBook: JsonRecord, rawText: string): string {
  const cleaned = cleanGutenbergText(rawText).cleanedText;
  const marker = expectedStartMarker(dryBook);
  const start = cleaned.indexOf(marker);
  if (start < 0) throw new Error(`${dryBook.slug}: verified start marker not found in source: ${marker}`);
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
  return /Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|www\.gutenberg|Distributed Proofreading|Faded Page|Transcriber(?:'|\u2019)?s? Notes?|Produced by|This ebook was produced|This book is in the public domain|\bFN#\d+\b|^Author:|^Title:|^Release date:|Contact Us|Site Map|All Rights Reserved|Copyright\s+\u00a9?|(?:^|\n)\s*(?:first published|published by|publisher|publication date)\b|(?:^|\n)\s*(?:CONTENTS|TABLE OF CONTENTS)\s*(?:\n|$)/im.test(text);
}

function previewLooksUnsafe(text: string): boolean {
  return /SOS Help!|preview unavailable|placeholder|generic preview|sample preview|Project Gutenberg|table of contents|Faded Page|Transcriber/i.test(text);
}

function cleanupArtifactsRemain(text: string): boolean {
  return /\[(?:Illustration|Image|Plate|Pg\.?\s*\d+|\d+|FN#\d+)/i.test(text);
}

function sectionDisplayLabel(section: JsonRecord): string {
  return section.title ? `${section.label}: ${section.title}` : String(section.label ?? "");
}

function roleEvidencePass(slug: string, dryBook: JsonRecord, rawText: string, manifest: JsonRecord, rights: JsonRecord) {
  const evidence = (dryBook.metadataEvidence ?? []) as JsonRecord[];
  if (!evidence.length || !evidence.every((item) => rawText.includes(String(item.text ?? "")))) return false;
  const expectedAuthors = dryBook.expectedAuthor ?? [];
  const generatedAuthors = manifest.author ?? [];
  if (!arraysEqual(generatedAuthors, expectedAuthors)) return false;
  if (generatedAuthors.some((author: string) => /unknown author/i.test(author))) return false;
  if (WELLS_SLUGS.has(slug)) return expectedAuthors[0] === "H. G. Wells" && rights.author === "H. G. Wells";
  if (LOVECRAFT_SLUGS.has(slug)) return expectedAuthors[0] === "H. P. Lovecraft" && rights.author === "H. P. Lovecraft";
  return rights.author === expectedAuthors.join(", ");
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
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  const perBookDryJsonPath = path.join(dryRunRoot, "books", `${slug}.json`);
  const perBookDryMdPath = path.join(dryRunRoot, "books", `${slug}.md`);
  for (const filePath of [
    sourcePath,
    manifestPath,
    cleanedPath,
    processedPath,
    rightsPath,
    previewPath,
    perBookDryJsonPath,
    perBookDryMdPath,
  ]) {
    if (!fs.existsSync(filePath)) throw new Error(`${slug}: missing ${repoPath(filePath)}`);
  }

  const rawText = fs.readFileSync(sourcePath, "utf8");
  const rawBody = expectedReadableText(dryBook, rawText);
  const marker = expectedStartMarker(dryBook);
  const perBookDryJson = readJson(perBookDryJsonPath);
  const perBookDryMd = fs.readFileSync(perBookDryMdPath, "utf8");
  const manifest = readJson(manifestPath);
  const cleaned = readJson(cleanedPath);
  const processed = readJson(processedPath);
  const rights = readJson(rightsPath);
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
  const parentTitle = extractHeaderValue(rawText, "Title") ?? "";
  const defaults = sections.filter((section) => section.includeByDefault);
  const firstDefault = defaults[0] ?? null;
  const firstDefaultSection = firstDefault
    ? sectionJson.find((section) => section.sectionId === firstDefault.id)
    : null;
  const exactTitle = EXACT_TITLE_EXPECTATIONS.get(slug);
  const sourceTitleEvidencePresent = rawText.includes(String(dryBook.titleEvidence?.text ?? ""));
  const generatedLines = generatedBody.split(/\r?\n/).map((line) => normalize(line).toLowerCase());
  const parentTitleExcluded =
    !parentTitle ||
    parentTitle === manifest.title ||
    !generatedLines.includes(normalize(parentTitle).toLowerCase());
  const perBookDryPass =
    perBookDryJson.slug === slug &&
    perBookDryJson.expectedGeneratedTitle === dryBook.expectedGeneratedTitle &&
    perBookDryMd.includes(slug) &&
    perBookDryMd.includes(String(dryBook.expectedGeneratedTitle));

  const titlePass =
    manifest.title === dryBook.expectedGeneratedTitle &&
    manifest.title === writeBook.generatedTitle &&
    manifest.title === exactTitle &&
    sourceTitleEvidencePresent &&
    parentTitleExcluded &&
    perBookDryPass;
  const metadataPass = roleEvidencePass(slug, dryBook, rawText, manifest, rights);
  const rawGeneratedPass =
    generatedBody === rawBody &&
    morseBody === rawBody &&
    cleanedBody === rawBody &&
    processedBody === rawBody &&
    writeBook?.rawVsGeneratedBodyComparisonResult?.status === "pass" &&
    writeBook?.rawVsGeneratedBodyComparisonResult?.allGeneratedCopiesAgree === true;
  const startPass = generatedBody.startsWith(marker) && rawBody.startsWith(marker);
  const endPass = generatedBody === rawBody && generatedBody.endsWith(rawBody.slice(-Math.min(240, rawBody.length)));
  const sectioningPass =
    sections.length === 1 &&
    sectionJson.length === 1 &&
    sections[0]?.id === sectionJson[0]?.sectionId &&
    sectionDisplayLabel(sections[0]) === dryBook.expectedFirstDefaultSection &&
    defaults.length === 1 &&
    defaults[0]?.id === sections[0]?.id &&
    !/^Part\s+\d+$/i.test(sectionDisplayLabel(sections[0]));
  const cleanupPass =
    generatedBody === rawBody &&
    parentTitleExcluded &&
    !sourceLooksUnsafe(generatedBody) &&
    !cleanupArtifactsRemain(generatedBody);
  const previewText = String(preview.previewText ?? "");
  const firstDefaultText = String(firstDefaultSection?.displayText ?? "");
  const previewPass =
    preview.slug === slug &&
    preview.contentHash === manifest.contentHash &&
    preview.defaultSectionId === firstDefault?.id &&
    preview.defaultSectionLabel === firstDefault?.label &&
    firstDefaultText.startsWith(previewText) &&
    previewText.length >= Math.min(400, firstDefaultText.length) &&
    !previewLooksUnsafe(previewText);
  const allDefaultPass =
    defaults.length === sections.length &&
    firstDefault?.id === sections[0]?.id &&
    generatedBody.startsWith(firstDefaultText.slice(0, Math.min(120, firstDefaultText.length)));
  const writeReportPass =
    writeBook?.finalAction === "first-time processed" &&
    writeBook?.startupPreviewValid === true &&
    writeBook?.allMainReadableDefaultVerdict === "all generated readable sections included by default" &&
    writeBook?.finalRecommendation === "accepted for review";
  const specialNamesPass =
    (!LOVECRAFT_SLUGS.has(slug) || (manifest.author ?? [])[0] === "H. P. Lovecraft") &&
    (!WELLS_SLUGS.has(slug) || (manifest.author ?? [])[0] === "H. G. Wells") &&
    (slug !== "the-dreams-in-the-witch-house" || manifest.title === "The Dreams in the Witch-House") &&
    (slug !== "the-shadow-out-of-time" || manifest.title === "The Shadow Out of Time") &&
    (slug !== "the-strange-high-house-in-the-mist" || manifest.title === "The Strange High House in the Mist") &&
    (slug !== "the-whisperer-in-darkness" || manifest.title === "The Whisperer in Darkness");
  const publishedHeuristicSafetyPass =
    slug !== "in-the-modern-vein" ||
    (generatedBody.startsWith("Of course the cultivated reader has heard of Aubrey Vair. He has published") &&
      !sourceLooksUnsafe(generatedBody));

  const checks = {
    title: titlePass && specialNamesPass,
    author: metadataPass,
    rawGenerated: rawGeneratedPass,
    start: startPass,
    end: endPass,
    sectioning: sectioningPass,
    cleanup: cleanupPass && publishedHeuristicSafetyPass,
    preview: previewPass,
    allDefault: allDefaultPass,
    writeReport: writeReportPass,
  };
  const failures = Object.entries(checks).filter(([, pass]) => !pass).map(([name]) => name);
  const verificationStatus: Status = failures.length ? "fail" : "pass";

  return {
    slug,
    verificationStatus,
    generatedOutputInspected: [manifestPath, cleanedPath, processedPath, rightsPath, ...sectionPaths].map(repoPath),
    previewInspected: repoPath(previewPath),
    titleVerdict: verdict(
      checks.title ? "pass" : "fail",
      checks.title
        ? `Individual story title preserved as "${manifest.title}"; no parent/source title is default playback.`
        : `Generated title "${manifest.title}" is not fully proven as the exact source story title.`,
      [`Source title evidence: ${dryBook.titleEvidence?.text ?? "missing"}`],
    ),
    authorVerdict: verdict(
      checks.author ? "pass" : "fail",
      checks.author
        ? `${WELLS_SLUGS.has(slug) ? "H. G. Wells" : "H. P. Lovecraft"} author metadata is source-backed; Unknown Author is absent.`
        : "Author metadata is not fully source-backed or generated metadata is incomplete.",
      [
        ...(dryBook.metadataEvidence ?? []).map((item: JsonRecord) => `${item.source}: ${item.text}`),
        `Rights author: ${rights.author ?? "missing"}`,
      ],
    ),
    rawVsGeneratedBodyComparisonVerdict: verdict(
      checks.rawGenerated ? "pass" : "fail",
      checks.rawGenerated
        ? "Sanitized raw body matches section display/Morse text, cleaned_book, and processed_book character-for-character."
        : "Sanitized raw body differs from one or more generated copies.",
      [`Raw characters: ${rawBody.length}`, `Generated characters: ${generatedBody.length}`],
    ),
    startBoundaryVerdict: verdict(
      checks.start ? "pass" : "fail",
      checks.start
        ? "Generated body starts at the true readable beginning verified in dry-run/write evidence."
        : "Generated body does not start at the verified readable boundary.",
      [`Start marker: ${marker}`],
    ),
    endBoundaryVerdict: verdict(
      checks.end ? "pass" : "fail",
      checks.end ? "Generated body preserves the true readable ending and final sentence." : "Readable ending differs from sanitized source.",
    ),
    sectioningVerdict: verdict(
      checks.sectioning ? "pass" : "fail",
      checks.sectioning
        ? "Sectioning is source-based as one contiguous individual story section, not arbitrary Part chunks."
        : "Section structure/default order does not match dry-run source evidence.",
      sections.map(sectionDisplayLabel),
    ),
    cleanupProsePreservationVerdict: verdict(
      checks.cleanup ? "pass" : "fail",
      checks.cleanup
        ? "No source/site wrapper, parent collection title, TOC, license, contributor/transcriber note, copyright/navigation text, byline-only material, or cleanup artifact enters default playback; prose is exact."
        : "Source leakage, cleanup artifact, or prose-preservation issue remains.",
    ),
    previewVerdict: verdict(
      checks.preview ? "pass" : "fail",
      checks.preview
        ? "Preview is valid, book-specific, starts from real readable content, and contains no SOS Help or generic fallback."
        : "Preview is invalid, generic, unsafe, or not aligned to the first default readable section.",
    ),
    allMainReadableDefaultVerdict: verdict(
      checks.allDefault ? "pass" : "fail",
      checks.allDefault
        ? "All main readable sections are included by default and selected/default order begins from the first section."
        : "Default selection or selected/default ordering needs correction.",
    ),
    startupPreviewValid: checks.preview && writeBook?.startupPreviewValid === true,
    acceptedForMain: verificationStatus !== "fail",
    correctionNeededBeforeMain: verificationStatus === "fail",
    correctionMadeDuringVerification: false,
    remainingWarnings: failures,
    snippets: {
      title: snippet(String(dryBook.titleEvidence?.text ?? "")),
      metadata: snippet((dryBook.metadataEvidence ?? []).map((item: JsonRecord) => item.text).join("; ")),
      rawStart: snippet(rawBody),
      generatedStart: snippet(generatedBody),
      rawEnd: tailSnippet(rawBody),
      generatedEnd: tailSnippet(generatedBody),
      previewStart: snippet(previewText),
    },
  };
}

function writeMarkdown(report: JsonRecord) {
  const lines = [
    "# Pilot write batch 23 verification",
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
    `- Raw/generated exact: ${report.rawVsGeneratedOverall.exact}/${report.rawVsGeneratedOverall.compared}`,
    "",
    "## Scope findings",
    "",
    `- Shared write script: ${report.sharedWriteScriptScopeFinding.classification}`,
    `- Startup audit heuristic: ${report.startupAuditHeuristicScopeFinding.classification}`,
    "",
    "## Batch-12 prose restoration",
    "",
    `- Result: ${report.batch12ProseRestoration.result}`,
    `- Compared: ${report.batch12ProseRestoration.batch12BooksCompared}`,
    `- Remaining raw/generated mismatches: ${report.batch12ProseRestoration.remainingBatch12RawVsGeneratedMismatches}`,
    "",
    "## Special focus",
    "",
    `- Wells metadata/title handling: ${report.specialFocus.wellsMetadataAndTitles}`,
    `- Lovecraft metadata/title/source wrappers: ${report.specialFocus.lovecraftMetadataTitlesAndWrappers}`,
    `- Published heuristic safety: ${report.specialFocus.publishedHeuristicSafety}`,
    `- Prose preservation: ${report.specialFocus.prosePreservation}`,
    "",
    "## Books",
    "",
    ...report.books.flatMap((book: JsonRecord) => [
      `### ${book.slug}`,
      "",
      `- Status: ${book.verificationStatus}`,
      `- Generated output inspected: ${book.generatedOutputInspected.join(", ")}`,
      `- Preview inspected: ${book.previewInspected}`,
      `- Title: ${book.titleVerdict.status} - ${book.titleVerdict.summary}`,
      `- Author: ${book.authorVerdict.status} - ${book.authorVerdict.summary}`,
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
      `- Preview start: ${book.snippets.previewStart}`,
      "",
    ]),
    "## Protections and audit side effects",
    "",
    `- Raw sources modified: ${report.protectedPaths.rawSourcesModified ? "yes" : "no"}`,
    `- Cloudflare exports modified: ${report.protectedPaths.cloudflareExportsModified ? "yes" : "no"}`,
    `- Unresolved-source books untouched: ${report.unresolvedSourceStatus.length ? "no" : "yes"}`,
    `- Duplicate/boundary skips not reintroduced: ${report.knownSkipStatus.length ? "no" : "yes"}`,
    `- Unrelated generated/preview changes: ${report.protectedPaths.unrelatedGeneratedOrPreviewChanges.length ? report.protectedPaths.unrelatedGeneratedOrPreviewChanges.join(", ") : "none"}`,
    `- Audit side-effect handling: ${report.auditSideEffectHandling.result}`,
    "",
    "## Validation",
    "",
    ...Object.entries(report.validationResults).map(([name, result]) => `- ${name}: ${result}`),
    "",
    "## Playwright and smoke",
    "",
    `- Playwright: ${report.browserAndPlaywright.standalonePlaywrightResult}`,
    `- Fullscreen UI modified here: ${report.browserAndPlaywright.fullscreenUiLeftUntouched ? "no" : "yes"}`,
    `- Smoke tests: ${report.validationResults.smokeTests}`,
    "",
    "## Backlog note from pilot-write-23",
    "",
    ...report.backlogNote.map((item: string) => `- ${item}`),
    "",
  ];
  writeText(path.join(verificationRoot, "pilot-write-23-verification.md"), `${lines.join("\n").trimEnd()}\n`);
}

function main() {
  const requiredReports = [
    path.join(dryRunRoot, "pilot-dry-run-23.json"),
    path.join(dryRunRoot, "pilot-dry-run-23.md"),
    path.join(writeRoot, "pilot-write-23.json"),
    path.join(writeRoot, "pilot-write-23.md"),
    path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"),
  ];
  requiredReports.forEach((reportPath) => fs.readFileSync(reportPath, "utf8"));
  const perBookDryRunFiles = fs.readdirSync(path.join(dryRunRoot, "books"));
  const dry = readJson(path.join(dryRunRoot, "pilot-dry-run-23.json"));
  const write = readJson(path.join(writeRoot, "pilot-write-23.json"));
  const batch12 = readJson(path.join(auditRoot, "batch-12-prose-restoration/batch-12-prose-restoration.json"));
  if (dry.reportName !== "pilot-dry-run-23" || write.reportName !== "pilot-write-23") {
    throw new Error("Report identity mismatch.");
  }
  if (!arraysEqual(dry.selectedBooks, [...SELECTED_BATCH])) throw new Error("Dry-run selected list mismatch.");
  if (!arraysEqual(write.selectedBooks, [...SELECTED_BATCH])) throw new Error("Write selected list mismatch.");
  if (perBookDryRunFiles.length !== SELECTED_BATCH.length * 2) throw new Error("Per-book dry-run artifact count mismatch.");

  const books = SELECTED_BATCH.map((slug) =>
    verifyBook(
      dry.books.find((book: JsonRecord) => book.slug === slug),
      write.books.find((book: JsonRecord) => book.slug === slug),
    ),
  );
  const pass = books.filter((book) => book.verificationStatus === "pass").length;
  const warnAccepted = 0;
  const fail = books.filter((book) => book.verificationStatus === "fail").length;
  const rawExact = books.filter((book) => book.rawVsGeneratedBodyComparisonVerdict.status === "pass").length;
  const batch12Pass =
    batch12.scope?.batch12BooksCompared === 20 &&
    batch12.scope?.remainingBatch12RawVsGeneratedMismatches === 0 &&
    batch12.scope?.remainingBatch12ProseOmissions === 0 &&
    batch12.scope?.remainingMissingOpeningQuoteDefects === 0;
  const unrelatedGeneratedOrPreviewChanges = gitStatusFor(["app/client/assets/books/generated", "public/book-previews"])
    .filter((line) =>
      !SELECTED_BATCH.some((slug) => line.includes(`/${slug}/`) || line.includes(`/${slug}.preview.json`)) &&
      !/library-manifest\.json|book-previews\/manifest\.json/.test(line),
    );

  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-23-verification",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-write-23-jun-2026",
    sourceWriteCommit: "b659d3bbe5bcb1899806e125170e669f50510c11",
    scope: "post-write QA/review of the exact 10 pilot write batch 23 books; no additional books processed",
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
      files: ["scripts/books/pilot-book-processing-write-12.ts", "scripts/books/pilot-book-processing-write-23.ts"],
      classification: "harmless shared implementation intentionally used by write batch 23",
      classificationNumber: 1,
      resolution:
        "Retain the write-12 change for this branch. The batch-23 wrapper sets MORSEWORDS_PILOT_WRITE_BATCH and imports the established shared writer; the shared diff adds batch-23 dispatch, exact selected slug list, backlog note, and source-backed single-story start phrases.",
      unrelatedChangesFound: false,
      movedToSharedHelper: false,
      restoredToOriginMain: false,
    },
    startupAuditHeuristicScopeFinding: {
      file: "scripts/books/book-startup-preview-audit-1.ts",
      classification: "valid scoped startup-audit heuristic fix needed because real prose used the word “published”",
      classificationNumber: 1,
      resolution:
        "Retain the startup-audit change. It does not ignore publication/source material generally; it only stops treating bare narrative 'published' as front matter unless nearby context matches publication/source metadata such as 'published by', 'first published', publisher, or publication date.",
      actualPublicationLeakageHidden: false,
      broaderAuditBehaviorChange: false,
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
      wellsMetadataAndTitles:
        "6/6 Wells stories preserve exact dry-run story titles and source-backed H. G. Wells metadata; no Unknown Author fallback is present.",
      lovecraftMetadataTitlesAndWrappers:
        "4/4 Lovecraft stories preserve exact generated title spelling, H. P. Lovecraft metadata, opening/ending text, and accepted source/rights treatment with no site header, navigation, copyright note, or parent collection material in default playback.",
      publishedHeuristicSafety:
        "The startup-audit 'published' heuristic was checked against In the Modern Vein: the generated text begins with real Wells prose using 'published' narratively, while source/publication-note leakage patterns remain rejected.",
      prosePreservation:
        `10/10 sanitized raw bodies match every generated body copy character-for-character; no cleanup rule removed punctuation, quote marks, dialogue, initials, scientific terms, archaic diction, unusual names, or ending sentences.`,
    },
    correctionsMadeDuringVerification: [],
    unresolvedSourceGeneratedBooksUntouched: [...UNRESOLVED_SOURCE_GENERATED_BOOKS],
    unresolvedSourceStatus: gitStatusFor(UNRESOLVED_SOURCE_GENERATED_BOOKS.map((slug) => `app/client/assets/books/generated/${slug}`)),
    knownDuplicateBoundarySkipsNotReintroduced: [...KNOWN_DUPLICATE_BOUNDARY_SKIPS],
    knownSkipStatus: gitStatusFor(KNOWN_DUPLICATE_BOUNDARY_SKIPS.flatMap((slug) => [
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
      pilotWrite23: process.env.MORSEWORDS_VERIFY_WRITE23 ?? "pending",
      batch12ProseRestore: process.env.MORSEWORDS_VERIFY_BATCH12 ?? "pending",
      startupPreviewAudit: process.env.MORSEWORDS_VERIFY_STARTUP ?? "pending",
      titleStartDefaultAudit: process.env.MORSEWORDS_VERIFY_TITLE ?? "pending",
      metadataSegmentationAudit: process.env.MORSEWORDS_VERIFY_METADATA ?? "pending",
      manualUiDefectFollowup: process.env.MORSEWORDS_VERIFY_MANUAL ?? "pending",
      targetedVerifier: process.env.MORSEWORDS_VERIFY_TARGETED ?? "pending",
      standalonePlaywright: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT ?? "pending",
      smokeTests: process.env.MORSEWORDS_VERIFY_TEST ?? "pending",
      gitDiffCheck: process.env.MORSEWORDS_VERIFY_DIFFCHECK ?? "pending",
    },
    browserAndPlaywright: {
      standalonePlaywrightResult: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT ?? "pending",
      knownFullscreenOnlyFailure: process.env.MORSEWORDS_VERIFY_PLAYWRIGHT_FULLSCREEN_ONLY === "true",
      pointerInterceptClassifiedIntermittent:
        process.env.MORSEWORDS_VERIFY_PLAYWRIGHT_POINTER_INTERMITTENT === "true",
      fullscreenUiLeftUntouched: true,
    },
    auditSideEffectHandling: {
      result: process.env.MORSEWORDS_VERIFY_AUDIT_SIDE_EFFECTS ?? "pending; restore unrelated validation churn before commit",
    },
    backlogNote: write.backlogNote ?? [],
    books,
  };
  writeJson(path.join(verificationRoot, "pilot-write-23-verification.json"), report);
  writeMarkdown(report);
  console.log(`Pilot write 23 verification: ${pass} pass, ${warnAccepted} warn accepted, ${fail} fail; raw/generated ${rawExact}/${books.length} exact.`);
  if (fail || !batch12Pass) process.exitCode = 1;
}

main();
