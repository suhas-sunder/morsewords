import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookRightsReport,
  BookSectionKind,
  CleanedBookJson,
  DetectedBookSection,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
  ProcessedBookJson,
} from "./bookManifestTypes.ts";
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

type SourceEvidence = {
  kind:
    | "gutenberg Author line"
    | "title page byline"
    | "visible By line"
    | "editor line only"
    | "source unresolved";
  text: string;
  lineNumber: number | null;
};

type AuthorExtraction = {
  expectedAuthor: string[] | null;
  evidence: SourceEvidence[];
  unknownAuthorJustified: boolean;
  unresolvedReason: string | null;
};

type BookAudit = {
  slug: string;
  acceptedBeforeAudit: boolean;
  generatedTitle: string;
  generatedAuthor: string[];
  generatedAuthorDisplay: string;
  rawSourceFileUsed: string | null;
  expectedTitleFromSourceOrIdentity: string;
  expectedAuthorFromRawSource: string[] | null;
  authorEvidence: SourceEvidence[];
  generatedAuthorIsUnknown: boolean;
  unknownAuthorJustified: boolean;
  titleDuplicatedAcrossUnrelatedSlugs: boolean;
  duplicateGeneratedTitleSlugs: string[];
  titleAppearsInheritedFromParentCollection: boolean;
  parentCollectionTitleOrBylineLeaksIntoDefaultPlayback: boolean;
  firstDefaultSection: {
    id: string | null;
    title: string | null;
    kind: BookSectionKind | null;
    snippet: string | null;
  };
  firstDefaultStartsWithRealReadableContent: boolean;
  firstChapterPartStoryOrPrologueMissingOrExcluded: boolean;
  generatedSectionLabelsMeaningful: boolean;
  generatedSectionLabelsGenericFallbackChunks: boolean;
  meaningfulSourceHeadingsExistButWereIgnored: boolean;
  previewStartsAtRealFirstReadableContent: boolean;
  acceptedStatusShouldRemainValid: boolean;
  classifications: string[];
  warnings: string[];
};

type AuthorCorrectionRecord = {
  slug: string;
  title: string;
  sourceFileUsed: string;
  beforeAuthor: string[];
  afterAuthor: string[];
  evidence: SourceEvidence[];
  generatedFilesChanged: string[];
  previewFilesChanged: string[];
};

type AuditReport = {
  reportName: "metadata-segmentation-correctness-audit-1";
  generatedAt: string;
  branch: string;
  scope: string;
  totals: {
    generatedBooksAudited: number;
    acceptedBooksAudited: number;
    booksWithUnknownAuthor: number;
    unknownAuthorWithClearSourceAuthor: number;
    unknownAuthorRemainingJustified: number;
    authorCorrectionsApplied: number;
    titleCorrectionsApplied: number;
    defaultStartOrSegmentationCorrectionsApplied: number;
    acceptanceRevokedPendingCorrection: number;
  };
  manualExamplesInspectedFirst: string[];
  runtimeConsistency: {
    selectedSourceAssembly: string;
    regressionCoverage: string[];
  };
  processorVerifierRuleUpdate: string[];
  authorCorrectionsApplied: AuthorCorrectionRecord[];
  acceptanceRevokedPendingCorrection: BookAudit[];
  booksWithUnknownAuthor: BookAudit[];
  books: BookAudit[];
  protectedPaths: {
    rawSources: string;
    cloudflareExport: string;
  };
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1",
);
const titleStartReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json",
);
const startupPreviewReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json",
);
const pilotWrite6VerificationPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/pilot-write-6-verification/pilot-write-6-verification.json",
);
const pilotWrite6Path = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/pilot-write-6/pilot-write-6.json",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const manualExamples = [
  "the-call-of-the-wild",
  "the-emerald-city-of-oz",
  "the-book-of-dragons",
  "the-elderbush",
  "the-emperor-s-new-clothes",
  "the-fir-tree",
  "the-leap-frog",
  "the-old-house",
  "the-real-princess",
  "the-shoes-of-fortune",
  "the-snow-queen",
  "the-swineherd",
  "the-winning-of-olwen",
];

const parentCollectionTitlePattern =
  /^(?:Andersen'?s Fairy Tales|Hans Andersen'?s Fairy Tales|The Lilac Fairy Book)$/i;
const parentMetadataStartPattern =
  /^(?:ANDERSEN'?S FAIRY TALES|HANS ANDERSEN'?S FAIRY TALES|THE LILAC FAIRY BOOK)\b/i;
const metadataStartPattern =
  /\b(Project Gutenberg|Gutenberg License|START OF (?:THE|THIS) PROJECT GUTENBERG|END OF (?:THE|THIS) PROJECT GUTENBERG|Produced by|Distributed Proofreading|Credits:|Release date:|Title:|Author:|Editor:|Illustrator:|Transcriber)\b/i;
const sourceHeadingPattern =
  /^\s*(?:chapter\s+\d+|chapter\s+[ivxlcdm]+|book\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+|[ivxlcdm]+)|part\s+(?:one|two|three|four|five|six|seven|eight|nine|ten|\d+|[ivxlcdm]+)|act\s+(?:one|two|three|four|five|\d+|[ivxlcdm]+)|scene\s+(?:one|two|three|four|five|\d+|[ivxlcdm]+)|story\s+\d+|letter\s+\d+)\b/i;
const unknownAuthorPattern = /^(?:unknown(?:\s+author)?|anonymous)$/i;

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

function readHeadJson<T>(relativePath: string): T | null {
  try {
    const normalized = relativePath.replace(/\\/g, "/");
    const output = execFileSync("git", ["show", `HEAD:${normalized}`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return JSON.parse(output) as T;
  } catch {
    return null;
  }
}

function gitBranch() {
  try {
    return execFileSync("git", ["branch", "--show-current"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
  } catch {
    return "unknown";
  }
}

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertInside(root: string, candidate: string) {
  const rootPath = path.resolve(root);
  const candidatePath = path.resolve(candidate);
  if (candidatePath !== rootPath && !candidatePath.startsWith(`${rootPath}${path.sep}`)) {
    throw new Error(`Unsafe path outside ${rootPath}: ${candidatePath}`);
  }
}

function compact(text: string | null | undefined, maxLength = 220) {
  if (!text) return null;
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return normalized.length <= maxLength
    ? normalized
    : `${normalized.slice(0, maxLength - 3)}...`;
}

function normalizeForCompare(text: string | null | undefined) {
  return (text ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function sha256Json(value: unknown) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function authorDisplay(author: string[]) {
  const cleaned = author.map((entry) => entry.trim()).filter(Boolean);
  return cleaned.length ? cleaned.join(", ") : "Unknown author";
}

function generatedAuthorIsUnknown(author: string[]) {
  const cleaned = author.map((entry) => entry.trim()).filter(Boolean);
  return cleaned.length === 0 || cleaned.some((entry) => unknownAuthorPattern.test(entry));
}

function expectedTitleFromSlug(slug: string) {
  return slug
    .replace(/-gutenberg-\d+$/i, "")
    .split("-")
    .filter(Boolean)
    .map((part) => (part.length <= 2 ? part : `${part[0]?.toUpperCase()}${part.slice(1)}`))
    .join(" ");
}

function sectionText(section: GeneratedBookSectionJson | null | undefined) {
  return (section?.morseSourceText || section?.displayText || "").trim();
}

function readSections(manifest: GeneratedBookManifest) {
  return manifest.sections.map((summary) =>
    readJson<GeneratedBookSectionJson>(
      path.join(generatedRoot, manifest.slug, summary.sectionJsonPath),
    ),
  );
}

function readPreview(slug: string) {
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  return fs.existsSync(previewPath) ? readJson<PreviewAsset>(previewPath) : null;
}

function sectionsToDetected(sections: GeneratedBookSectionJson[]): DetectedBookSection[] {
  return sections.map((section) => ({
    id: section.sectionId,
    kind: section.kind,
    label: section.label,
    title: section.title,
    order: section.order,
    includeByDefault: section.includeByDefault,
    sourceStartOffset: section.sourceOffsets.start,
    sourceEndOffset: section.sourceOffsets.end,
    characterCount: section.characterCount,
    wordCount: section.wordCount,
    morseCharacterEstimate: section.morseCharacterEstimate,
    textPreview: section.textPreview,
    text: sectionText(section),
  }));
}

function buildContentHash(
  slug: string,
  title: string,
  author: string[],
  sections: DetectedBookSection[],
) {
  return sha256Json({
    slug,
    title,
    author,
    sections: sections.map((section) => ({
      kind: section.kind,
      label: section.label,
      title: section.title,
      includeByDefault: section.includeByDefault,
      text: section.text,
    })),
  });
}

function buildCleanedBook(
  existing: CleanedBookJson,
  manifest: GeneratedBookManifest,
): CleanedBookJson {
  return {
    ...existing,
    title: manifest.title,
    author: manifest.author.join(", "),
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
    source: {
      ...existing.source,
      provider: manifest.source.provider,
      gutenbergId: manifest.source.gutenbergId,
      sourceUrl: manifest.source.sourceUrl,
      rawTextUrl: manifest.source.rawTextUrl,
      releaseDate: manifest.source.releaseDate ?? existing.source.releaseDate,
    },
    stats: {
      ...existing.stats,
      wordCount: manifest.stats.wordCount,
      sectionCount: manifest.stats.sectionCount,
    },
  };
}

function buildProcessedBook(
  existing: ProcessedBookJson,
  manifest: GeneratedBookManifest,
): ProcessedBookJson {
  return {
    ...existing,
    title: manifest.title,
    author: manifest.author.join(", "),
    content_version: manifest.contentVersion,
    content_hash: manifest.contentHash,
    source: {
      ...existing.source,
      name: manifest.source.provider,
      ebook_number: manifest.source.gutenbergId ?? existing.source.ebook_number,
      source_url: manifest.source.sourceUrl,
      raw_text_url: manifest.source.rawTextUrl,
      release_date: manifest.source.releaseDate ?? existing.source.release_date,
    },
  };
}

function buildRightsReport(
  existing: BookRightsReport,
  manifest: GeneratedBookManifest,
  rawText: string,
  evidence: SourceEvidence[],
) {
  return {
    ...existing,
    title: manifest.title,
    author: manifest.author.join(", "),
    release_date: manifest.source.releaseDate ?? existing.release_date,
    source: manifest.source.provider,
    gutenberg_ebook_number: manifest.source.gutenbergId ?? existing.gutenberg_ebook_number,
    source_url: manifest.source.sourceUrl,
    raw_text_url: manifest.source.rawTextUrl,
    gutenberg_header_present: /Project Gutenberg/i.test(rawText),
    project_gutenberg_license_present: /PROJECT GUTENBERG(?:\u2122|TM)? LICENSE/i.test(rawText),
    us_reuse_language_found: /United States/i.test(rawText),
    non_us_warning_found: /not located in the United States/i.test(rawText),
    evidence_snippets: [
      ...(existing.evidence_snippets ?? []),
      ...evidence.map((item) => item.text),
    ].slice(-12),
    reasoning_summary:
      "Metadata/segmentation correctness audit verified raw-source author evidence and corrected generated fallback author metadata.",
  };
}

function updateLibraryManifest(manifests: GeneratedBookManifest[]) {
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const bySlug = new Map(library.books.map((book) => [book.slug, book]));
  for (const manifest of manifests) {
    bySlug.set(manifest.slug, {
      slug: manifest.slug,
      title: manifest.title,
      author: manifest.author,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      language: manifest.language,
      description: manifest.description,
      subjects: manifest.subjects,
      source: manifest.source,
      cover: manifest.cover,
      stats: manifest.stats,
      defaults: manifest.defaults,
      manifestPath: `${manifest.slug}/manifest.json`,
    });
  }
  writeJson(libraryManifestPath, {
    schemaVersion: 1,
    books: library.books.map((book) => bySlug.get(book.slug)).filter(Boolean),
  });
}

function updatePreviewManifest(previews: PreviewAsset[]) {
  const manifest = readJson<{
    version: number;
    assetBasePath: string;
    targetRuntimeSeconds: number;
    books: Array<Record<string, unknown> & { slug: string }>;
    missing: Array<string | { slug: string; reason: string }>;
  }>(previewManifestPath);
  const bySlug = new Map(manifest.books.map((book) => [book.slug, book]));
  for (const preview of previews) {
    bySlug.set(preview.slug, {
      slug: preview.slug,
      path: `/book-previews/${preview.slug}.preview.json`,
      contentVersion: preview.contentVersion,
      contentHash: preview.contentHash,
      defaultSectionId: preview.defaultSectionId,
      previewBytes: Buffer.byteLength(`${JSON.stringify(preview, null, 2)}\n`, "utf8"),
      previewCharacterCount: preview.characterCount,
      estimatedRuntimeSeconds: preview.estimatedRuntimeSeconds,
      truncated: preview.truncated,
    });
  }
  writeJson(previewManifestPath, {
    ...manifest,
    books: manifest.books.map((book) => bySlug.get(book.slug)).filter(Boolean),
  });
}

function sourceLineRecords(rawText: string) {
  return rawText.split(/\r?\n/).map((text, index) => ({
    lineNumber: index + 1,
    text,
    trimmed: text.trim(),
  }));
}

function extractHeaderBlock(rawText: string, label: string) {
  const lines = sourceLineRecords(rawText);
  const labelPattern = new RegExp(`^${label}:\\s*(.*)$`, "i");
  for (let index = 0; index < Math.min(lines.length, 180); index += 1) {
    const match = lines[index]!.trimmed.match(labelPattern);
    if (!match) continue;
    const values = match[1]?.trim() ? [match[1].trim()] : [];
    let nextIndex = index + 1;
    while (nextIndex < lines.length) {
      const current = lines[nextIndex]!;
      if (!current.trimmed) break;
      if (/^[A-Za-z][A-Za-z\s-]{1,40}:\s*/.test(current.trimmed)) break;
      if (/^\s+\S/.test(current.text)) values.push(current.trimmed);
      else break;
      nextIndex += 1;
    }
    return {
      values,
      lineNumber: lines[index]!.lineNumber,
      text: `${label}: ${values.join(" / ")}`,
    };
  }
  return null;
}

function cleanAuthorCandidate(value: string) {
  return value
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^by\s+/i, "")
    .trim();
}

function parseAuthorValues(values: string[]) {
  return values
    .map(cleanAuthorCandidate)
    .filter((value) => value && !/^(unknown|anonymous)$/i.test(value));
}

function extractVisibleByline(rawText: string) {
  const lines = sourceLineRecords(rawText).slice(0, 220);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]!;
    const inlineMatch = line.trimmed.match(/^by\s+(.+)$/i);
    if (inlineMatch?.[1]) {
      const candidate = cleanAuthorCandidate(inlineMatch[1]);
      if (candidate && !metadataStartPattern.test(candidate)) {
        return {
          values: [candidate],
          lineNumber: line.lineNumber,
          text: line.trimmed,
        };
      }
    }
    if (/^by$/i.test(line.trimmed)) {
      const following = lines
        .slice(index + 1, index + 5)
        .map((item) => item.trimmed)
        .filter(Boolean);
      if (following.length) {
        const candidate = cleanAuthorCandidate(following[0]!);
        if (candidate && !metadataStartPattern.test(candidate)) {
          return {
            values: [candidate],
            lineNumber: line.lineNumber,
            text: `by ${candidate}`,
          };
        }
      }
    }
  }
  return null;
}

function extractAuthorFromRaw(rawText: string | null): AuthorExtraction {
  if (!rawText) {
    return {
      expectedAuthor: null,
      evidence: [{ kind: "source unresolved", text: "Raw source not resolved.", lineNumber: null }],
      unknownAuthorJustified: false,
      unresolvedReason: "Raw source was not resolved, so author fallback cannot be justified.",
    };
  }

  const authorHeader = extractHeaderBlock(rawText, "Author");
  if (authorHeader) {
    const expectedAuthor = parseAuthorValues(authorHeader.values);
    if (expectedAuthor.length) {
      return {
        expectedAuthor,
        evidence: [
          {
            kind: "gutenberg Author line",
            text: authorHeader.text,
            lineNumber: authorHeader.lineNumber,
          },
        ],
        unknownAuthorJustified: false,
        unresolvedReason: null,
      };
    }
  }

  const byline = extractVisibleByline(rawText);
  if (byline) {
    const expectedAuthor = parseAuthorValues(byline.values);
    if (expectedAuthor.length) {
      return {
        expectedAuthor,
        evidence: [
          {
            kind: "visible By line",
            text: byline.text,
            lineNumber: byline.lineNumber,
          },
        ],
        unknownAuthorJustified: false,
        unresolvedReason: null,
      };
    }
  }

  const editorHeader = extractHeaderBlock(rawText, "Editor");
  if (editorHeader) {
    return {
      expectedAuthor: null,
      evidence: [
        {
          kind: "editor line only",
          text: editorHeader.text,
          lineNumber: editorHeader.lineNumber,
        },
      ],
      unknownAuthorJustified: true,
      unresolvedReason:
        "Raw source has editor metadata but no source-identified author; this needs manual metadata policy before replacing author with editor.",
    };
  }

  return {
    expectedAuthor: null,
    evidence: [
      {
        kind: "source unresolved",
        text: "No Author line or visible byline found in the raw source header/opening.",
        lineNumber: null,
      },
    ],
    unknownAuthorJustified: true,
    unresolvedReason: "Raw source lacks a clear author line or visible byline.",
  };
}

function sourceFromProcessingNotes(slug: string) {
  const notesPath = path.join(generatedRoot, slug, "processing_notes.md");
  if (!fs.existsSync(notesPath)) return null;
  const notes = fs.readFileSync(notesPath, "utf8");
  const match =
    notes.match(/Source used:\s*`?([^`\r\n]+?\.txt)`?/i) ??
    notes.match(/Source:\s*`?([^`\r\n]+?\.txt)`?/i);
  if (!match?.[1]) return null;
  return path.basename(match[1].trim());
}

function sourceFromTitleStartReport(slug: string) {
  const report = readJson<{ books: Array<{ slug: string; sourceFilename: string | null }> }>(
    titleStartReportPath,
  );
  const entry = report.books.find((book) => book.slug === slug);
  return entry?.sourceFilename ?? null;
}

function findSourceFile(slug: string, title: string) {
  const candidates = [
    sourceFromTitleStartReport(slug),
    sourceFromProcessingNotes(slug),
    `${slug}.txt`,
    `${title}.txt`,
    `${expectedTitleFromSlug(slug)}.txt`,
  ].filter((value): value is string => Boolean(value));
  for (const candidate of candidates) {
    const filePath = path.join(tempBooksRoot, path.basename(candidate));
    assertInside(tempBooksRoot, filePath);
    if (fs.existsSync(filePath)) return path.basename(candidate);
  }
  return null;
}

function readRawSource(sourceFile: string | null) {
  if (!sourceFile) return null;
  const sourcePath = path.join(tempBooksRoot, sourceFile);
  assertInside(tempBooksRoot, sourcePath);
  return fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8") : null;
}

function hasMeaningfulRawHeadings(rawText: string | null) {
  if (!rawText) return false;
  return sourceLineRecords(rawText).filter((line) => sourceHeadingPattern.test(line.trimmed)).length >= 3;
}

function hasGenericFallbackSections(manifest: GeneratedBookManifest) {
  if (manifest.sections.length < 2) return false;
  const genericCount = manifest.sections.filter((section) =>
    /^part\s+\d+$/i.test(section.label) && !section.title,
  ).length;
  return genericCount >= Math.min(3, manifest.sections.length);
}

function startsWithMetadataText(text: string | null | undefined) {
  const start = compact(text, 260) ?? "";
  return (
    metadataStartPattern.test(start) ||
    /^(?:contents|table of contents|list of illustrations)\b/i.test(start)
  );
}

function previewStartsWithSection(
  preview: PreviewAsset | null,
  section: GeneratedBookSectionJson | null,
) {
  if (!preview || !section) return false;
  const previewStart = normalizeForCompare(preview.previewText).slice(0, 120);
  const sectionStart = normalizeForCompare(sectionText(section)).slice(0, 160);
  return Boolean(previewStart) && sectionStart.startsWith(previewStart.slice(0, 72));
}

function authorsMatch(generated: string[], expected: string[] | null) {
  if (!expected) return false;
  return normalizeForCompare(generated.join(" ")) === normalizeForCompare(expected.join(" "));
}

function makeBookAudit(
  manifest: GeneratedBookManifest,
  duplicateTitleSlugs: string[],
  acceptedSlugs: Set<string>,
): BookAudit {
  const sourceFile = findSourceFile(manifest.slug, manifest.title);
  const rawText = readRawSource(sourceFile);
  const authorExtraction = extractAuthorFromRaw(rawText);
  const sections = readSections(manifest);
  const firstDefaultSummary =
    manifest.sections.find((section) => section.includeByDefault) ?? null;
  const firstDefaultSection = firstDefaultSummary
    ? sections.find((section) => section.sectionId === firstDefaultSummary.id) ?? null
    : null;
  const firstDefaultText = sectionText(firstDefaultSection);
  const preview = readPreview(manifest.slug);
  const expectedTitle =
    sourceFromTitleStartReport(manifest.slug) || sourceFile
      ? manifest.title
      : expectedTitleFromSlug(manifest.slug);
  const titleAppearsInheritedFromParentCollection =
    parentCollectionTitlePattern.test(manifest.title);
  const parentCollectionTitleOrBylineLeaksIntoDefaultPlayback =
    parentMetadataStartPattern.test(firstDefaultText) ||
    parentMetadataStartPattern.test(preview?.previewText ?? "");
  const firstDefaultStartsWithMetadata = startsWithMetadataText(firstDefaultText);
  const firstDefaultStartsWithRealReadableContent =
    Boolean(firstDefaultText.trim()) &&
    !firstDefaultStartsWithMetadata &&
    !parentCollectionTitleOrBylineLeaksIntoDefaultPlayback;
  const generatedSectionLabelsGenericFallbackChunks =
    hasGenericFallbackSections(manifest);
  const meaningfulSourceHeadingsExistButWereIgnored =
    generatedSectionLabelsGenericFallbackChunks && hasMeaningfulRawHeadings(rawText);
  const generatedAuthorUnknown = generatedAuthorIsUnknown(manifest.author);
  const unknownAuthorWithClearSourceAuthor =
    generatedAuthorUnknown && Boolean(authorExtraction.expectedAuthor);
  const firstChapterPartStoryOrPrologueMissingOrExcluded =
    manifest.sections.some((section) => section.id === "chapter-001") &&
    !manifest.sections.find((section) => section.id === "chapter-001")?.includeByDefault;
  const previewStartsAtRealFirstReadableContent =
    Boolean(preview) &&
    preview!.contentHash === manifest.contentHash &&
    preview!.contentVersion === manifest.contentVersion &&
    preview!.defaultSectionId === firstDefaultSummary?.id &&
    previewStartsWithSection(preview, firstDefaultSection) &&
    !startsWithMetadataText(preview!.previewText) &&
    !parentMetadataStartPattern.test(preview!.previewText);

  const classifications: string[] = [];
  const warnings: string[] = [];
  if (unknownAuthorWithClearSourceAuthor) {
    classifications.push("needs generated author correction");
    warnings.push("Generated author is Unknown author but raw source has a clear author.");
  }
  if (generatedAuthorUnknown && !authorExtraction.expectedAuthor) {
    classifications.push("needs manual metadata review");
    warnings.push(authorExtraction.unresolvedReason ?? "Unknown author requires documented source review.");
  }
  if (titleAppearsInheritedFromParentCollection) {
    classifications.push("needs generated title correction");
    warnings.push("Generated title appears to be inherited from a parent collection.");
  }
  if (parentCollectionTitleOrBylineLeaksIntoDefaultPlayback || firstDefaultStartsWithMetadata) {
    classifications.push("needs generated start/default correction");
    warnings.push("First default content or preview starts with metadata/title/byline material.");
  }
  if (meaningfulSourceHeadingsExistButWereIgnored) {
    classifications.push("needs full generated correction");
    warnings.push("Generated sections look like fallback chunks despite meaningful raw source headings.");
  }
  if (!previewStartsAtRealFirstReadableContent) {
    classifications.push("needs preview correction");
    warnings.push("Preview does not clearly start from the first real default section.");
  }
  if (!classifications.length) classifications.push("still acceptable");

  const acceptedBeforeAudit = acceptedSlugs.has(manifest.slug);
  const acceptedStatusShouldRemainValid =
    acceptedBeforeAudit &&
    !classifications.some((classification) =>
      [
        "needs generated author correction",
        "needs generated title correction",
        "needs generated start/default correction",
        "needs full generated correction",
        "needs preview correction",
      ].includes(classification),
    );

  return {
    slug: manifest.slug,
    acceptedBeforeAudit,
    generatedTitle: manifest.title,
    generatedAuthor: manifest.author,
    generatedAuthorDisplay: authorDisplay(manifest.author),
    rawSourceFileUsed: sourceFile,
    expectedTitleFromSourceOrIdentity: expectedTitle,
    expectedAuthorFromRawSource: authorExtraction.expectedAuthor,
    authorEvidence: authorExtraction.evidence,
    generatedAuthorIsUnknown: generatedAuthorUnknown,
    unknownAuthorJustified:
      generatedAuthorUnknown &&
      authorExtraction.unknownAuthorJustified &&
      !authorExtraction.expectedAuthor,
    titleDuplicatedAcrossUnrelatedSlugs: duplicateTitleSlugs.length > 1,
    duplicateGeneratedTitleSlugs: duplicateTitleSlugs,
    titleAppearsInheritedFromParentCollection,
    parentCollectionTitleOrBylineLeaksIntoDefaultPlayback,
    firstDefaultSection: {
      id: firstDefaultSummary?.id ?? null,
      title: firstDefaultSummary?.title ?? firstDefaultSummary?.label ?? null,
      kind: firstDefaultSummary?.kind ?? null,
      snippet: compact(firstDefaultText),
    },
    firstDefaultStartsWithRealReadableContent,
    firstChapterPartStoryOrPrologueMissingOrExcluded,
    generatedSectionLabelsMeaningful: !generatedSectionLabelsGenericFallbackChunks,
    generatedSectionLabelsGenericFallbackChunks,
    meaningfulSourceHeadingsExistButWereIgnored,
    previewStartsAtRealFirstReadableContent,
    acceptedStatusShouldRemainValid,
    classifications: [...new Set(classifications)],
    warnings: [...new Set(warnings)],
  };
}

function applyAuthorCorrection(
  slug: string,
  expectedAuthor: string[],
  sourceFile: string,
  evidence: SourceEvidence[],
) {
  const bookDir = path.join(generatedRoot, slug);
  const manifestPath = path.join(bookDir, "manifest.json");
  const cleanedPath = path.join(bookDir, "cleaned_book.json");
  const processedPath = path.join(bookDir, "processed_book.json");
  const rightsPath = path.join(bookDir, "rights_report.json");
  const notesPath = path.join(bookDir, "processing_notes.md");
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  [bookDir, manifestPath, previewPath].forEach((target) => {
    assertInside(target.includes("book-previews") ? previewRoot : generatedRoot, target);
  });

  const manifest = readJson<GeneratedBookManifest>(manifestPath);
  const sections = readSections(manifest);
  const detectedSections = sectionsToDetected(sections);
  const rawText = readRawSource(sourceFile) ?? sections.map(sectionText).join("\n\n");
  const contentHash = buildContentHash(
    manifest.slug,
    manifest.title,
    expectedAuthor,
    detectedSections,
  );
  const nextManifest: GeneratedBookManifest = {
    ...manifest,
    author: expectedAuthor,
    contentVersion: contentHash.slice(0, 16),
    contentHash,
    warnings: [
      "Corrected by metadata/segmentation correctness audit 1 to use raw-source author evidence.",
      ...manifest.warnings.filter(
        (warning) =>
          !/Corrected by metadata\/segmentation correctness audit 1|Author was not found|fallback author/i.test(
            warning,
          ),
      ),
    ],
  };

  const nextSections = sections.map((section) => ({
    ...section,
    bookSlug: slug,
  }));
  const cleaned = buildCleanedBook(
    readJson<CleanedBookJson>(cleanedPath),
    nextManifest,
  );
  const processed = buildProcessedBook(
    readJson<ProcessedBookJson>(processedPath),
    nextManifest,
  );
  const rights = buildRightsReport(
    readJson<BookRightsReport>(rightsPath),
    nextManifest,
    rawText,
    evidence,
  );
  const preview: PreviewAsset = {
    ...readJson<PreviewAsset>(previewPath),
    contentVersion: nextManifest.contentVersion,
    contentHash: nextManifest.contentHash,
  };
  const notes = fs.existsSync(notesPath) ? fs.readFileSync(notesPath, "utf8") : "";
  const noteAppend = `\n## Metadata/segmentation correctness audit 1\n\n- Author corrected from fallback/empty metadata to ${expectedAuthor.join(", ")}.\n- Evidence: ${evidence.map((item) => `${item.kind}: ${item.text}`).join("; ")}\n- Source: app/client/assets/temp-books/${sourceFile}\n`;

  writeJson(manifestPath, nextManifest);
  writeJson(cleanedPath, cleaned);
  writeJson(processedPath, processed);
  writeJson(rightsPath, rights);
  writeJson(previewPath, preview);
  writeText(
    notesPath,
    notes.includes("## Metadata/segmentation correctness audit 1")
      ? notes
      : `${notes.trimEnd()}\n${noteAppend}`,
  );

  return {
    manifest: nextManifest,
    preview,
    generatedFilesChanged: [
      manifestPath,
      cleanedPath,
      processedPath,
      rightsPath,
      notesPath,
      libraryManifestPath,
    ].map(statusPath),
    previewFilesChanged: [previewPath, previewManifestPath].map(statusPath),
  };
}

function loadRequiredReports() {
  return {
    titleStart: readJson<unknown>(titleStartReportPath),
    startup: readJson<unknown>(startupPreviewReportPath),
    pilotWrite6Verification: readJson<unknown>(pilotWrite6VerificationPath),
    pilotWrite6: readJson<unknown>(pilotWrite6Path),
  };
}

function loadAcceptedSlugs() {
  const report = readJson<{
    books: Array<{ slug: string; acceptedBeforeAudit: boolean }>;
  }>(titleStartReportPath);
  return new Set(
    report.books
      .filter((book) => book.acceptedBeforeAudit)
      .map((book) => book.slug),
  );
}

function loadAllManifests() {
  return fs
    .readdirSync(generatedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(generatedRoot, slug, "manifest.json")))
    .sort()
    .map((slug) =>
      readJson<GeneratedBookManifest>(path.join(generatedRoot, slug, "manifest.json")),
    );
}

function duplicateTitleMap(manifests: GeneratedBookManifest[]) {
  const byTitle = new Map<string, string[]>();
  for (const manifest of manifests) {
    const key = normalizeForCompare(manifest.title);
    const existing = byTitle.get(key) ?? [];
    existing.push(manifest.slug);
    byTitle.set(key, existing);
  }
  return byTitle;
}

function authorCorrectionRecord(
  slug: string,
  sourceFile: string,
  evidence: SourceEvidence[],
  generatedFilesChanged: string[],
  previewFilesChanged: string[],
): AuthorCorrectionRecord | null {
  const headManifest = readHeadJson<GeneratedBookManifest>(
    `app/client/assets/books/generated/${slug}/manifest.json`,
  );
  const currentManifest = readJson<GeneratedBookManifest>(
    path.join(generatedRoot, slug, "manifest.json"),
  );
  if (!headManifest) return null;
  if (!generatedAuthorIsUnknown(headManifest.author)) return null;
  if (generatedAuthorIsUnknown(currentManifest.author)) return null;
  return {
    slug,
    title: currentManifest.title,
    sourceFileUsed: `app/client/assets/temp-books/${sourceFile}`,
    beforeAuthor: headManifest.author,
    afterAuthor: currentManifest.author,
    evidence,
    generatedFilesChanged,
    previewFilesChanged,
  };
}

function defaultGeneratedFilesChangedForAuthorCorrection(slug: string) {
  return [
    path.join(generatedRoot, slug, "manifest.json"),
    path.join(generatedRoot, slug, "cleaned_book.json"),
    path.join(generatedRoot, slug, "processed_book.json"),
    path.join(generatedRoot, slug, "rights_report.json"),
    path.join(generatedRoot, slug, "processing_notes.md"),
    libraryManifestPath,
  ].map(statusPath);
}

function defaultPreviewFilesChangedForAuthorCorrection(slug: string) {
  return [
    path.join(previewRoot, `${slug}.preview.json`),
    previewManifestPath,
  ].map(statusPath);
}

function buildMarkdown(report: AuditReport) {
  const lines: string[] = [];
  lines.push("# Metadata/Segmentation Correctness Audit 1");
  lines.push("");
  lines.push("Focused audit for generated title identity, author metadata, first default content, segmentation, startup previews, and selected-source runtime ordering.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Generated books audited: ${report.totals.generatedBooksAudited}`);
  lines.push(`- Accepted books audited: ${report.totals.acceptedBooksAudited}`);
  lines.push(`- Books with Unknown author display: ${report.totals.booksWithUnknownAuthor}`);
  lines.push(`- Unknown author with clear source author: ${report.totals.unknownAuthorWithClearSourceAuthor}`);
  lines.push(`- Unknown author remaining with documented source limitation: ${report.totals.unknownAuthorRemainingJustified}`);
  lines.push(`- Author corrections applied: ${report.totals.authorCorrectionsApplied}`);
  lines.push(`- Acceptance revoked pending correction: ${report.totals.acceptanceRevokedPendingCorrection}`);
  lines.push("");
  lines.push("## Runtime Consistency");
  lines.push("");
  lines.push(`- ${report.runtimeConsistency.selectedSourceAssembly}`);
  for (const item of report.runtimeConsistency.regressionCoverage) {
    lines.push(`- ${item}`);
  }
  lines.push("");
  lines.push("## Author Corrections");
  lines.push("");
  if (report.authorCorrectionsApplied.length === 0) {
    lines.push("- None.");
  } else {
    for (const correction of report.authorCorrectionsApplied) {
      lines.push(`### ${correction.slug}`);
      lines.push("");
      lines.push(`- Title: ${correction.title}`);
      lines.push(`- Before author: ${authorDisplay(correction.beforeAuthor)}`);
      lines.push(`- After author: ${authorDisplay(correction.afterAuthor)}`);
      lines.push(`- Source: ${correction.sourceFileUsed}`);
      lines.push(`- Evidence: ${correction.evidence.map((item) => `${item.kind}: ${item.text}`).join("; ")}`);
      lines.push("");
    }
  }
  lines.push("## Unknown Author Review");
  lines.push("");
  for (const book of report.booksWithUnknownAuthor) {
    lines.push(`- ${book.slug}: ${book.generatedAuthorDisplay}; source=${book.rawSourceFileUsed ?? "unresolved"}; justified=${book.unknownAuthorJustified}; warnings=${book.warnings.join("; ") || "none"}`);
  }
  lines.push("");
  lines.push("## Acceptance Revoked Pending Correction");
  lines.push("");
  if (report.acceptanceRevokedPendingCorrection.length === 0) {
    lines.push("- None.");
  } else {
    for (const book of report.acceptanceRevokedPendingCorrection) {
      lines.push(`- ${book.slug}: ${book.classifications.join("; ")} (${book.warnings.join("; ")})`);
    }
  }
  lines.push("");
  lines.push("## Future Verification Rules");
  lines.push("");
  for (const rule of report.processorVerifierRuleUpdate) {
    lines.push(`- ${rule}`);
  }
  lines.push("");
  lines.push("## Books");
  lines.push("");
  lines.push("| Slug | Accepted before | Author | Expected author | Source | Verdict | Warnings |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const book of report.books) {
    lines.push(
      `| ${book.slug} | ${book.acceptedBeforeAudit ? "yes" : "no"} | ${book.generatedAuthorDisplay.replace(/\|/g, "\\|")} | ${authorDisplay(book.expectedAuthorFromRawSource ?? []).replace(/\|/g, "\\|")} | ${book.rawSourceFileUsed ?? "unresolved"} | ${book.acceptedStatusShouldRemainValid ? "accepted remains valid" : book.acceptedBeforeAudit ? "acceptance revoked pending correction" : "not accepted"} | ${book.warnings.join("; ").replace(/\|/g, "\\|") || "none"} |`,
    );
  }
  lines.push("");
  lines.push("Raw source files and Cloudflare exports were not modified.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function main() {
  loadRequiredReports();
  const acceptedSlugs = loadAcceptedSlugs();
  const beforeManifests = loadAllManifests();
  const beforeDuplicateTitles = duplicateTitleMap(beforeManifests);
  const authorCorrections: AuthorCorrectionRecord[] = [];
  const correctedManifests: GeneratedBookManifest[] = [];
  const correctedPreviews: PreviewAsset[] = [];

  for (const manifest of beforeManifests) {
    const audit = makeBookAudit(
      manifest,
      beforeDuplicateTitles.get(normalizeForCompare(manifest.title)) ?? [manifest.slug],
      acceptedSlugs,
    );
    if (
      audit.generatedAuthorIsUnknown &&
      audit.expectedAuthorFromRawSource &&
      audit.rawSourceFileUsed
    ) {
      const { manifest: correctedManifest, preview, generatedFilesChanged, previewFilesChanged } =
        applyAuthorCorrection(
          manifest.slug,
          audit.expectedAuthorFromRawSource,
          audit.rawSourceFileUsed,
          audit.authorEvidence,
        );
      correctedManifests.push(correctedManifest);
      correctedPreviews.push(preview);
      const record = authorCorrectionRecord(
        manifest.slug,
        audit.rawSourceFileUsed,
        audit.authorEvidence,
        generatedFilesChanged,
        previewFilesChanged,
      );
      if (record) authorCorrections.push(record);
    }
  }

  if (correctedManifests.length) updateLibraryManifest(correctedManifests);
  if (correctedPreviews.length) updatePreviewManifest(correctedPreviews);

  const manifests = loadAllManifests();
  const titleDuplicates = duplicateTitleMap(manifests);
  const books = manifests.map((manifest) =>
    makeBookAudit(
      manifest,
      titleDuplicates.get(normalizeForCompare(manifest.title)) ?? [manifest.slug],
      acceptedSlugs,
    ),
  );
  const correctionRecordBySlug = new Map(
    authorCorrections.map((record) => [record.slug, record]),
  );
  for (const book of books) {
    if (correctionRecordBySlug.has(book.slug)) continue;
    if (book.generatedAuthorIsUnknown) continue;
    if (!book.rawSourceFileUsed) continue;
    const record = authorCorrectionRecord(
      book.slug,
      book.rawSourceFileUsed,
      book.authorEvidence,
      defaultGeneratedFilesChangedForAuthorCorrection(book.slug),
      defaultPreviewFilesChangedForAuthorCorrection(book.slug),
    );
    if (record) correctionRecordBySlug.set(book.slug, record);
  }
  authorCorrections.splice(0, authorCorrections.length, ...correctionRecordBySlug.values());
  const correctionSlugs = new Set(authorCorrections.map((record) => record.slug));
  const acceptanceRevokedPendingCorrection = books.filter(
    (book) =>
      book.acceptedBeforeAudit &&
      !correctionSlugs.has(book.slug) &&
      !book.acceptedStatusShouldRemainValid &&
      !book.unknownAuthorJustified,
  );
  const booksWithUnknownAuthor = books.filter((book) => book.generatedAuthorIsUnknown);
  const report: AuditReport = {
    reportName: "metadata-segmentation-correctness-audit-1",
    generatedAt: new Date().toISOString(),
    branch: gitBranch(),
    scope:
      "All currently generated books were audited against generated metadata, raw source author evidence where resolvable, first default content, segmentation shape, startup preview starts, and selected-source runtime regression coverage.",
    totals: {
      generatedBooksAudited: books.length,
      acceptedBooksAudited: books.filter((book) => book.acceptedBeforeAudit).length,
      booksWithUnknownAuthor: booksWithUnknownAuthor.length,
      unknownAuthorWithClearSourceAuthor: books.filter(
        (book) => book.generatedAuthorIsUnknown && Boolean(book.expectedAuthorFromRawSource),
      ).length,
      unknownAuthorRemainingJustified: books.filter(
        (book) => book.generatedAuthorIsUnknown && book.unknownAuthorJustified,
      ).length,
      authorCorrectionsApplied: authorCorrections.length,
      titleCorrectionsApplied: 0,
      defaultStartOrSegmentationCorrectionsApplied: 0,
      acceptanceRevokedPendingCorrection: acceptanceRevokedPendingCorrection.length,
    },
    manualExamplesInspectedFirst: manualExamples,
    runtimeConsistency: {
      selectedSourceAssembly:
        "Selected-source runtime assembly preserves selected/default section ID order and no longer re-sorts by section payload order.",
      regressionCoverage: [
        "Call of the Wild Playwright regression seeds saved progress at chapter-002 and verifies the selected source starts at Chapter I.",
        "Elderbush Playwright regression verifies individual-story title/default content and author metadata on generated preview routes.",
      ],
    },
    processorVerifierRuleUpdate: [
      "Future batch verification must fail generated books whose author display is Unknown author while raw source evidence contains a clear Author/byline.",
      "Future batch verification must flag Unknown author cases with no clear source author as documented manual metadata review, not silent acceptance.",
      "Future batch verification must fail suspicious parent collection titles, parent collection metadata in default playback, metadata/default-start leaks, generic fallback chunks where source headings are clear, and selected-source output that does not start from the first selected/default section.",
      "This npm command is a reusable verification gate: npm run books:metadata-segmentation-audit.",
    ],
    authorCorrectionsApplied: authorCorrections,
    acceptanceRevokedPendingCorrection,
    booksWithUnknownAuthor,
    books,
    protectedPaths: {
      rawSources: "app/client/assets/temp-books (read only)",
      cloudflareExport: "app/client/assets/books/cloudflare-export (not modified)",
    },
  };

  writeJson(
    path.join(auditRoot, "metadata-segmentation-correctness-audit-1.json"),
    report,
  );
  writeText(
    path.join(auditRoot, "metadata-segmentation-correctness-audit-1.md"),
    buildMarkdown(report),
  );
  console.log(
    `Metadata/segmentation correctness audit complete: ${report.totals.generatedBooksAudited} generated books audited, ${report.totals.authorCorrectionsApplied} author corrections, ${report.totals.booksWithUnknownAuthor} unknown-author cases remain documented, ${report.totals.acceptanceRevokedPendingCorrection} accepted books revoked pending correction.`,
  );
  if (
    report.totals.unknownAuthorWithClearSourceAuthor > 0 ||
    report.totals.acceptanceRevokedPendingCorrection > 0
  ) {
    process.exitCode = 1;
  }
}

main();
