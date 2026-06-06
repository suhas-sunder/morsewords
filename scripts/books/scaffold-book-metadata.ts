import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { BookMetadata } from "./bookManifestTypes.ts";
import { BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";

type MetadataRecord = {
  filePath: string;
  relativePath: string;
  slug: string | null;
  rawPath: string | null;
  gutenbergId: string | null;
  metadataStatus: string | null;
  manualReviewRequired: boolean;
};

type InventoryReference = {
  filePath: string;
  relativePath: string;
  slug?: string | null;
  gutenbergId?: string | null;
};

type DuplicateGutenbergIdReport = {
  gutenbergId: string;
  rawFiles: InventoryReference[];
  metadataFiles: InventoryReference[];
};

type BookMetadataScaffold = NonNullable<BookMetadata["scaffold"]>;

type ExtractedGutenbergMetadata = BookMetadataScaffold["extracted"] & {
  gutenbergEvidence: boolean;
  extractionConfidence: BookMetadataScaffold["extractionConfidence"];
  missingFields: string[];
  warnings: string[];
};

export type MetadataScaffoldOptions = {
  repoRoot?: string;
  textRoot?: string;
  metadataRoot?: string;
  reportPath?: string;
  quiet?: boolean;
};

export type MetadataScaffoldReport = {
  schemaVersion: 1;
  totalRawFiles: number;
  existingMetadataCount: number;
  totalMetadataFiles: number;
  newMetadataFilesCreated: number;
  rawFilesStillSkipped: string[];
  duplicateGutenbergIds: Array<{
    gutenbergId: string;
    rawFiles: string[];
    metadataFiles: string[];
  }>;
  missingRequiredFieldsSummary: Record<string, number>;
  manualReviewCount: number;
  scaffoldedMetadataFiles: Array<{
    rawTextFile: string;
    metadataFile: string;
    slug: string;
    gutenbergId: string | null;
  }>;
};

export type MetadataScaffoldResult = {
  report: MetadataScaffoldReport;
  reportPath: string;
  createdMetadata: Array<{
    rawTextFile: string;
    metadataFile: string;
    slug: string;
    gutenbergId: string | null;
    warnings: string[];
  }>;
  warnings: string[];
  fatalErrors: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_TEXT_ROOT = path.join(DEFAULT_REPO_ROOT, "app/client/assets/text");
const DEFAULT_METADATA_ROOT = path.join(DEFAULT_TEXT_ROOT, "meta");
const DEFAULT_REPORT_PATH = path.join(
  DEFAULT_TEXT_ROOT,
  "metadata-scaffold-report.json",
);

const DUPLICATE_GUTENBERG_WARNING =
  "Possible duplicate Gutenberg ID; verify whether this is a duplicate, alternate file, or renamed copy.";

const DRAFT_RIGHTS_NOTE =
  "Draft metadata scaffold created from raw Project Gutenberg text. Manual rights review is required before processing, publishing, or reuse claims.";

const EXTRACTED_FIELD_KEYS = [
  "title",
  "author",
  "language",
  "releaseDate",
  "lastUpdated",
  "originalPublication",
  "gutenbergEbookNumber",
  "credits",
  "translator",
  "illustrator",
  "editor",
] as const;

const LANGUAGE_CODES = new Map<string, string>([
  ["english", "en"],
  ["french", "fr"],
  ["german", "de"],
  ["italian", "it"],
  ["spanish", "es"],
  ["portuguese", "pt"],
  ["japanese", "ja"],
  ["chinese", "zh"],
  ["latin", "la"],
]);

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortByPath(paths: string[]): string[] {
  return [...paths].sort((left, right) =>
    compareText(toPosixPath(left), toPosixPath(right)),
  );
}

function relativeTo(root: string, filePath: string): string {
  return toPosixPath(path.relative(root, filePath));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findFiles(root: string, extension: string): string[] {
  if (!fs.existsSync(root)) return [];

  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
        files.push(entryPath);
      }
    }
  };

  walk(root);
  return sortByPath(files);
}

function readJsonObject(filePath: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function collectMetadataRecords(
  textRoot: string,
  metadataRoot: string,
): MetadataRecord[] {
  return findFiles(metadataRoot, ".json").map((filePath) => {
    const raw = readJsonObject(filePath);
    const source = isPlainObject(raw?.source) ? raw.source : null;
    const rawTextFile =
      typeof source?.rawTextFile === "string" ? source.rawTextFile : null;
    const rawPath = rawTextFile
      ? path.resolve(path.dirname(filePath), rawTextFile)
      : null;
    return {
      filePath,
      relativePath: relativeTo(textRoot, filePath),
      slug: typeof raw?.slug === "string" ? raw.slug : null,
      rawPath,
      gutenbergId:
        typeof source?.gutenbergId === "string" ||
        typeof source?.gutenbergId === "number"
          ? String(source.gutenbergId)
          : null,
      metadataStatus:
        typeof raw?.metadataStatus === "string" ? raw.metadataStatus : null,
      manualReviewRequired: raw?.manualReviewRequired === true,
    };
  });
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeFieldValue(input: string): string {
  return input.replace(/\s+/g, " ").trim().slice(0, 500);
}

function looksLikeHeaderField(line: string): boolean {
  return /^\s*[A-Za-z][A-Za-z ]{1,40}:\s+/.test(line);
}

function extractField(headerText: string, labels: string[]): string | null {
  const lines = headerText.split(/\r?\n/);
  const labelPattern = labels.map(escapeRegExp).join("|");
  const pattern = new RegExp(`^\\s*(?:${labelPattern}):\\s*(.*?)\\s*$`, "i");

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(pattern);
    if (!match) continue;

    const parts = [match[1].trim()];
    for (let next = index + 1; next < lines.length; next += 1) {
      const line = lines[next];
      if (line.trim() === "" || looksLikeHeaderField(line)) break;
      if (/^\s+\S/.test(line)) {
        parts.push(line.trim());
        continue;
      }
      break;
    }

    const value = normalizeFieldValue(parts.join(" "));
    return value === "" ? null : value;
  }

  return null;
}

function getHeaderSlice(rawText: string): string {
  const startMarker = rawText.search(/\*\*\*\s*START OF (?:THE )?PROJECT GUTENBERG/i);
  if (startMarker > 0) return rawText.slice(0, startMarker);
  return rawText.slice(0, 20_000);
}

function extractGutenbergId(rawText: string, releaseDate: string | null): string | null {
  const candidates = [
    releaseDate,
    rawText.slice(0, 20_000),
  ].filter((value): value is string => typeof value === "string");

  for (const candidate of candidates) {
    const match =
      candidate.match(/\[(?:eBook|EBook)\s+#(\d+)\]/i) ??
      candidate.match(/Project Gutenberg (?:eBook|EBook).*?#(\d+)/i) ??
      candidate.match(/\bEBook\s+#(\d+)/i) ??
      candidate.match(/\/ebooks\/(\d+)/i);
    if (match?.[1]) return match[1];
  }

  return null;
}

function stripReleaseDateId(releaseDate: string | null): string | null {
  if (!releaseDate) return null;
  const stripped = releaseDate
    .replace(/\s*\[(?:eBook|EBook)\s+#\d+\]\s*$/i, "")
    .trim();
  return stripped === "" ? null : stripped;
}

function parseOriginalPublicationYear(input: string | null): number | null {
  const match = input?.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function normalizeLanguage(input: string | null): string {
  if (!input) return "und";
  return LANGUAGE_CODES.get(input.toLowerCase()) ?? input;
}

function parseAuthors(input: string | null): string[] {
  if (!input) return [];
  return input
    .split(/\s+(?:and|&)\s+|;/i)
    .map((author) => normalizeFieldValue(author))
    .filter(Boolean);
}

function titleFromFilename(filePath: string): string {
  const stem = path.basename(filePath, path.extname(filePath));
  const words = stem
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  if (words.length === 0) return "Untitled MorseWords book";
  return words
    .map((word) =>
      word.length <= 2
        ? word
        : `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
}

function slugify(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "book";
}

function makeUniqueSlug({
  baseSlug,
  gutenbergId,
  metadataRoot,
  usedSlugs,
}: {
  baseSlug: string;
  gutenbergId: string | null;
  metadataRoot: string;
  usedSlugs: Set<string>;
}): string {
  const candidates = [
    baseSlug,
    ...(gutenbergId ? [`${baseSlug}-gutenberg-${gutenbergId}`] : []),
  ];

  const isAvailable = (candidate: string) =>
    !usedSlugs.has(candidate) &&
    !fs.existsSync(path.join(metadataRoot, `${candidate}.json`));

  for (const candidate of candidates) {
    if (isAvailable(candidate)) {
      usedSlugs.add(candidate);
      return candidate;
    }
  }

  for (let suffix = 2; suffix < 10_000; suffix += 1) {
    const candidate = `${baseSlug}-${suffix}`;
    if (isAvailable(candidate)) {
      usedSlugs.add(candidate);
      return candidate;
    }
  }

  throw new Error(`Could not create a unique slug for ${baseSlug}.`);
}

function parseHeaderMetadata(rawText: string): ExtractedGutenbergMetadata {
  const headerText = getHeaderSlice(rawText);
  const releaseDateWithId = extractField(headerText, ["Release date"]);
  const releaseDate = stripReleaseDateId(releaseDateWithId);
  const gutenbergEbookNumber = extractGutenbergId(rawText, releaseDateWithId);
  const gutenbergEvidence =
    /Project Gutenberg/i.test(rawText.slice(0, 20_000)) ||
    /gutenberg\.org/i.test(rawText.slice(0, 20_000)) ||
    gutenbergEbookNumber !== null;
  const hasStrongHeader =
    /\*\*\*\s*START OF (?:THE )?PROJECT GUTENBERG/i.test(rawText.slice(0, 20_000)) ||
    /Project Gutenberg (?:eBook|EBook)/i.test(rawText.slice(0, 20_000));

  const extracted = {
    title: extractField(headerText, ["Title"]),
    author: extractField(headerText, ["Author"]),
    language: extractField(headerText, ["Language"]),
    releaseDate,
    lastUpdated: extractField(headerText, [
      "Most recently updated",
      "Last updated",
      "Updated",
    ]),
    originalPublication: extractField(headerText, [
      "Original publication",
      "First published",
      "Published",
    ]),
    gutenbergEbookNumber,
    credits: extractField(headerText, ["Credits", "Produced by"]),
    translator: extractField(headerText, ["Translator", "Translated by"]),
    illustrator: extractField(headerText, ["Illustrator", "Illustrated by"]),
    editor: extractField(headerText, ["Editor", "Edited by"]),
  };
  const missingFields = EXTRACTED_FIELD_KEYS.filter((key) => !extracted[key]);
  const warnings: string[] = [];

  if (missingFields.length > 0) {
    warnings.push(`Missing extracted header fields: ${missingFields.join(", ")}.`);
  }
  if (!gutenbergEvidence) {
    warnings.push(
      "No clear Project Gutenberg header evidence found; provider is set to Unknown.",
    );
  }
  if (!extracted.title) {
    warnings.push("Title was missing; the draft title was derived from the file name.");
  }
  if (!extracted.language) {
    warnings.push("Language was missing; the draft language is set to und.");
  }

  return {
    ...extracted,
    gutenbergEvidence,
    extractionConfidence: hasStrongHeader
      ? "gutenberg-header"
      : gutenbergEvidence
        ? "gutenberg-reference"
        : "filename-only",
    missingFields,
    warnings,
  };
}

function buildDraftMetadata({
  rawPath,
  metadataPath,
  slug,
  extracted,
  duplicateGutenbergId,
}: {
  rawPath: string;
  metadataPath: string;
  slug: string;
  extracted: ExtractedGutenbergMetadata;
  duplicateGutenbergId: boolean;
}): BookMetadata {
  const title = extracted.title ?? titleFromFilename(rawPath);
  const author = parseAuthors(extracted.author);
  const warnings = [...extracted.warnings];
  if (duplicateGutenbergId) warnings.push(DUPLICATE_GUTENBERG_WARNING);
  const sourceUrl = extracted.gutenbergEbookNumber
    ? `https://www.gutenberg.org/ebooks/${extracted.gutenbergEbookNumber}`
    : null;

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    slug,
    metadataStatus: "draft",
    manualReviewRequired: true,
    title,
    author,
    language: normalizeLanguage(extracted.language),
    source: {
      provider: extracted.gutenbergEvidence ? "Project Gutenberg" : "Unknown",
      gutenbergId: extracted.gutenbergEbookNumber,
      sourceUrl,
      rawTextFile: toPosixPath(path.relative(path.dirname(metadataPath), rawPath)),
      releaseDate: extracted.releaseDate,
      rawTextUrl: null,
      rightsBasis: "unknown",
      rightsReviewed: false,
      rightsNotes: [DRAFT_RIGHTS_NOTE, ...warnings].join(" "),
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${title}`,
    },
    description: "",
    subjects: [],
    originalPublicationYear: parseOriginalPublicationYear(
      extracted.originalPublication,
    ),
    defaults: {
      includeKinds: ["chapter"],
      excludeKinds: ["source-license", "transcriber-note", "advertisement"],
      preferredPreset: "main-narrative",
    },
    sectionOverrides: [],
    cleanupRules: [],
    scaffold: {
      extractionConfidence: extracted.extractionConfidence,
      extracted: {
        title: extracted.title,
        author: extracted.author,
        language: extracted.language,
        releaseDate: extracted.releaseDate,
        lastUpdated: extracted.lastUpdated,
        originalPublication: extracted.originalPublication,
        gutenbergEbookNumber: extracted.gutenbergEbookNumber,
        credits: extracted.credits,
        translator: extracted.translator,
        illustrator: extracted.illustrator,
        editor: extracted.editor,
      },
      missingFields: extracted.missingFields,
      warnings,
    },
  };
}

function writeJsonIfChanged(filePath: string, value: unknown): boolean {
  const next = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === next) {
    return false;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

function readRawReference(filePath: string, textRoot: string): InventoryReference {
  try {
    const rawText = fs.readFileSync(filePath, "utf8");
    const extracted = parseHeaderMetadata(rawText);
    return {
      filePath,
      relativePath: relativeTo(textRoot, filePath),
      gutenbergId: extracted.gutenbergEbookNumber,
    };
  } catch {
    return {
      filePath,
      relativePath: relativeTo(textRoot, filePath),
      gutenbergId: null,
    };
  }
}

function groupDuplicateGutenbergIds(
  rawRefs: InventoryReference[],
  metadataRefs: InventoryReference[],
): DuplicateGutenbergIdReport[] {
  const groups = new Map<
    string,
    { rawFiles: InventoryReference[]; metadataFiles: InventoryReference[] }
  >();

  for (const ref of rawRefs) {
    if (!ref.gutenbergId) continue;
    const group = groups.get(ref.gutenbergId) ?? {
      rawFiles: [],
      metadataFiles: [],
    };
    group.rawFiles.push(ref);
    groups.set(ref.gutenbergId, group);
  }

  for (const ref of metadataRefs) {
    if (!ref.gutenbergId) continue;
    const group = groups.get(ref.gutenbergId) ?? {
      rawFiles: [],
      metadataFiles: [],
    };
    group.metadataFiles.push(ref);
    groups.set(ref.gutenbergId, group);
  }

  return [...groups.entries()]
    .filter(
      ([, group]) => group.rawFiles.length > 1 || group.metadataFiles.length > 1,
    )
    .map(([gutenbergId, group]) => ({
      gutenbergId,
      rawFiles: group.rawFiles.sort((left, right) =>
        compareText(left.relativePath, right.relativePath),
      ),
      metadataFiles: group.metadataFiles.sort((left, right) =>
        compareText(left.relativePath, right.relativePath),
      ),
    }))
    .sort((left, right) => compareText(left.gutenbergId, right.gutenbergId));
}

function buildMissingFieldsSummary(
  draftRecords: MetadataRecord[],
  textRoot: string,
): Record<string, number> {
  const summary = Object.fromEntries(
    EXTRACTED_FIELD_KEYS.map((key) => [key, 0]),
  ) as Record<string, number>;

  for (const record of draftRecords) {
    if (!record.rawPath || !fs.existsSync(record.rawPath)) continue;
    const rawText = fs.readFileSync(record.rawPath, "utf8");
    const extracted = parseHeaderMetadata(rawText);
    for (const field of extracted.missingFields) {
      summary[field] = (summary[field] ?? 0) + 1;
    }
  }

  return Object.fromEntries(
    Object.entries(summary).sort(([left], [right]) => compareText(left, right)),
  );
}

function metadataRefs(records: MetadataRecord[]): InventoryReference[] {
  return records.map((record) => ({
    filePath: record.filePath,
    relativePath: record.relativePath,
    slug: record.slug,
    gutenbergId: record.gutenbergId,
  }));
}

function reportDuplicateGroups(
  groups: DuplicateGutenbergIdReport[],
): MetadataScaffoldReport["duplicateGutenbergIds"] {
  return groups.map((group) => ({
    gutenbergId: group.gutenbergId,
    rawFiles: group.rawFiles.map((ref) => ref.relativePath),
    metadataFiles: group.metadataFiles.map((ref) =>
      ref.slug ? `${ref.slug} (${ref.relativePath})` : ref.relativePath,
    ),
  }));
}

function printSummary(result: MetadataScaffoldResult): void {
  const { report, reportPath, createdMetadata, warnings, fatalErrors } = result;
  console.log("Morse book metadata scaffold");
  console.log(`Raw text files: ${report.totalRawFiles}`);
  console.log(`Existing metadata files: ${report.existingMetadataCount}`);
  console.log(`Draft metadata files: ${report.newMetadataFilesCreated}`);
  console.log(`Created this run: ${createdMetadata.length}`);
  console.log(`Raw files still skipped: ${report.rawFilesStillSkipped.length}`);
  console.log(`Duplicate Gutenberg IDs: ${report.duplicateGutenbergIds.length}`);
  console.log(`Manual review count: ${report.manualReviewCount}`);
  console.log(`Report: ${toPosixPath(reportPath)}`);

  if (createdMetadata.length > 0) {
    console.log("\nCreated metadata:");
    for (const entry of createdMetadata.slice(0, 24)) {
      console.log(`- ${entry.metadataFile}`);
    }
    if (createdMetadata.length > 24) {
      console.log(`- ... ${createdMetadata.length - 24} more`);
    }
  }

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of warnings.slice(0, 24)) {
      console.log(`- ${warning}`);
    }
    if (warnings.length > 24) {
      console.log(`- ... ${warnings.length - 24} more warnings`);
    }
  }

  if (fatalErrors.length > 0) {
    console.error("\nFatal errors:");
    for (const error of fatalErrors) {
      console.error(`- ${error}`);
    }
  }
}

export function scaffoldBookMetadata(
  options: MetadataScaffoldOptions = {},
): MetadataScaffoldResult {
  const repoRoot = path.resolve(options.repoRoot ?? DEFAULT_REPO_ROOT);
  const textRoot = path.resolve(options.textRoot ?? DEFAULT_TEXT_ROOT);
  const metadataRoot = path.resolve(options.metadataRoot ?? DEFAULT_METADATA_ROOT);
  const reportPath = path.resolve(options.reportPath ?? DEFAULT_REPORT_PATH);
  const rawTextFiles = findFiles(textRoot, ".txt");
  const initialMetadataRecords = collectMetadataRecords(textRoot, metadataRoot);
  const usedSlugs = new Set(
    initialMetadataRecords
      .map((record) => record.slug)
      .filter((slug): slug is string => typeof slug === "string"),
  );
  const rawPathsWithMetadata = new Set(
    initialMetadataRecords
      .map((record) => record.rawPath)
      .filter((rawPath): rawPath is string => typeof rawPath === "string"),
  );
  const rawRefs = rawTextFiles.map((filePath) =>
    readRawReference(filePath, textRoot),
  );
  const duplicateGroupsBefore = groupDuplicateGutenbergIds(
    rawRefs,
    metadataRefs(initialMetadataRecords),
  );
  const duplicateRawIds = new Set(
    duplicateGroupsBefore
      .filter((group) => group.rawFiles.length > 1)
      .map((group) => group.gutenbergId),
  );
  const createdMetadata: MetadataScaffoldResult["createdMetadata"] = [];
  const fatalErrors: string[] = [];

  for (const rawPath of rawTextFiles.filter(
    (filePath) => !rawPathsWithMetadata.has(filePath),
  )) {
    try {
      const rawText = fs.readFileSync(rawPath, "utf8");
      const extracted = parseHeaderMetadata(rawText);
      const baseSlug = slugify(path.basename(rawPath, path.extname(rawPath)));
      const slug = makeUniqueSlug({
        baseSlug,
        gutenbergId: extracted.gutenbergEbookNumber,
        metadataRoot,
        usedSlugs,
      });
      const metadataPath = path.join(metadataRoot, `${slug}.json`);
      if (fs.existsSync(metadataPath)) {
        fatalErrors.push(
          `Refusing to overwrite existing metadata: ${relativeTo(repoRoot, metadataPath)}`,
        );
        continue;
      }
      const metadata = buildDraftMetadata({
        rawPath,
        metadataPath,
        slug,
        extracted,
        duplicateGutenbergId:
          extracted.gutenbergEbookNumber !== null &&
          duplicateRawIds.has(extracted.gutenbergEbookNumber),
      });
      writeJsonIfChanged(metadataPath, metadata);
      createdMetadata.push({
        rawTextFile: relativeTo(textRoot, rawPath),
        metadataFile: relativeTo(textRoot, metadataPath),
        slug,
        gutenbergId: extracted.gutenbergEbookNumber,
        warnings: metadata.scaffold?.warnings ?? [],
      });
    } catch (error) {
      fatalErrors.push(
        `${relativeTo(textRoot, rawPath)}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  const finalMetadataRecords = collectMetadataRecords(textRoot, metadataRoot);
  const finalRawPathsWithMetadata = new Set(
    finalMetadataRecords
      .map((record) => record.rawPath)
      .filter((rawPath): rawPath is string => typeof rawPath === "string"),
  );
  const draftRecords = finalMetadataRecords.filter(
    (record) => record.metadataStatus === "draft",
  );
  const existingMetadataRecords = finalMetadataRecords.filter(
    (record) => record.metadataStatus !== "draft",
  );
  const duplicateGroups = groupDuplicateGutenbergIds(
    rawRefs,
    metadataRefs(finalMetadataRecords),
  );
  const report: MetadataScaffoldReport = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    totalRawFiles: rawTextFiles.length,
    existingMetadataCount: existingMetadataRecords.length,
    totalMetadataFiles: finalMetadataRecords.length,
    newMetadataFilesCreated: draftRecords.length,
    rawFilesStillSkipped: rawTextFiles
      .filter((filePath) => !finalRawPathsWithMetadata.has(filePath))
      .map((filePath) => relativeTo(textRoot, filePath)),
    duplicateGutenbergIds: reportDuplicateGroups(duplicateGroups),
    missingRequiredFieldsSummary: buildMissingFieldsSummary(draftRecords, textRoot),
    manualReviewCount: draftRecords.filter(
      (record) =>
        record.metadataStatus === "draft" || record.manualReviewRequired === true,
    ).length,
    scaffoldedMetadataFiles: draftRecords
      .filter((record) => record.slug && record.rawPath)
      .map((record) => ({
        rawTextFile: relativeTo(textRoot, record.rawPath as string),
        metadataFile: record.relativePath,
        slug: record.slug as string,
        gutenbergId: record.gutenbergId,
      }))
      .sort((left, right) => compareText(left.metadataFile, right.metadataFile)),
  };
  const warnings = duplicateGroups.flatMap((group) =>
    group.rawFiles.length > 1
      ? [
          `Duplicate Gutenberg ID ${group.gutenbergId}: ${group.rawFiles
            .map((ref) => ref.relativePath)
            .join(", ")}`,
        ]
      : [],
  );

  writeJsonIfChanged(reportPath, report);

  const result: MetadataScaffoldResult = {
    report,
    reportPath,
    createdMetadata,
    warnings,
    fatalErrors,
  };
  if (!options.quiet) printSummary(result);
  return result;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === invokedPath) {
  const result = scaffoldBookMetadata();
  if (result.fatalErrors.length > 0) {
    process.exitCode = 1;
  }
}
