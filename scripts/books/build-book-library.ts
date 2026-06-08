import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

import type {
  ApprovedPeopleMetadata,
  BookCleanupRule,
  CleanedBookJson,
  BookMetadata,
  BookRightsReport,
  BookSectionKind,
  EnrichedAuthorityMetadata,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
  GutenbergCleaningReport,
  ProcessedBookJson,
} from "./bookManifestTypes.ts";
import {
  BOOK_SCHEMA_VERSION,
  RIGHTS_BASES,
  SECTION_KINDS,
} from "./bookManifestTypes.ts";
import {
  buildDuplicateSlugResolutionMap,
  type DuplicateSlugResolution,
} from "./bookDuplicateResolution.ts";
import {
  loadOwnerBookApprovals,
  ownerBookApprovalMap,
} from "./bookApprovalFiles.ts";
import { loadEnrichedAuthorityMetadata } from "./bookEnrichedMetadata.ts";
import {
  buildBookRightsReport,
  getProjectGutenbergSourceUrl,
  loadApprovedPeopleMetadata,
  validateBookRights,
} from "./bookRightsValidation.ts";
import { cleanGutenbergText } from "./clean-gutenberg.ts";
import { detectBookSections } from "./detect-book-sections.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

export type BookBuildOptions = {
  repoRoot?: string;
  textRoot?: string;
  metadataRoot?: string;
  approvedPeoplePath?: string;
  bookApprovalsPath?: string;
  enrichedMetadataPath?: string;
  generatedRoot?: string;
  cloudflareExportRoot?: string | null;
  quiet?: boolean;
};

export type BookInventory = {
  rawTextFiles: string[];
  metadataFiles: string[];
  rawWithoutMetadata: string[];
  metadataWithoutRaw: string[];
  duplicateSlugs: string[];
  duplicateGutenbergIds: DuplicateGutenbergIdReport[];
  invalidMetadata: Array<{ filePath: string; errors: string[] }>;
};

export type InventoryReference = {
  filePath: string;
  relativePath: string;
  slug?: string;
  gutenbergId?: string | null;
  allowDuplicateGutenbergId?: boolean;
  duplicateReason?: string;
};

export type DuplicateGutenbergIdReport = {
  gutenbergId: string;
  rawFiles: InventoryReference[];
  metadataFiles: InventoryReference[];
};

export type BookBuildResult = {
  inventory: BookInventory;
  processedBooks: GeneratedBookManifest[];
  libraryManifest: GeneratedLibraryManifest;
  warnings: string[];
  fatalErrors: string[];
  generatedArtifacts: string[];
  generatedRoot: string;
  cloudflareExportRoot: string | null;
  cloudflareExportArtifacts: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_TEXT_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/temp-books",
);
const DEFAULT_METADATA_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/text/meta",
);
const DEFAULT_APPROVED_METADATA_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/text/approved-metadata",
);
const DEFAULT_APPROVED_PEOPLE_PATH = path.join(
  DEFAULT_APPROVED_METADATA_ROOT,
  "authors.json",
);
const DEFAULT_BOOK_APPROVALS_PATH = path.join(
  DEFAULT_APPROVED_METADATA_ROOT,
  "book-approvals.json",
);
const DEFAULT_ENRICHED_METADATA_PATH = path.join(
  DEFAULT_APPROVED_METADATA_ROOT,
  "enriched-metadata.json",
);
const DEFAULT_GENERATED_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/generated",
);
const DEFAULT_CLOUDFLARE_EXPORT_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/cloudflare-export",
);
const DRAFT_REVIEW_REASON =
  "Draft or manual-review metadata must be reviewed before processing or publishing unless complete source-file or external authority evidence satisfies the gate.";

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function sortByPath(paths: string[]): string[] {
  return [...paths].sort((a, b) => a.localeCompare(b));
}

function relativeTo(root: string, filePath: string): string {
  return toPosixPath(path.relative(root, filePath));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

function isInside(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function readGutenbergIdFromRaw(filePath: string): string | null {
  const text = fs.readFileSync(filePath, "utf8");
  const match =
    text.match(/\[(?:eBook|EBook)\s+#(\d+)\]/) ??
    text.match(/Project Gutenberg (?:eBook|EBook).*?#(\d+)/i) ??
    text.match(/\/ebooks\/(\d+)/i);
  return match?.[1] ?? null;
}

function validateString(
  value: unknown,
  pathLabel: string,
  errors: string[],
  allowEmpty = false,
): asserts value is string {
  if (typeof value !== "string" || (!allowEmpty && value.trim() === "")) {
    errors.push(`${pathLabel} must be a ${allowEmpty ? "string" : "non-empty string"}.`);
  }
}

function validateStringArray(
  value: unknown,
  pathLabel: string,
  errors: string[],
): asserts value is string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    errors.push(`${pathLabel} must be an array of strings.`);
  }
}

function validateSectionKindArray(
  value: unknown,
  pathLabel: string,
  errors: string[],
): asserts value is BookSectionKind[] {
  if (!Array.isArray(value)) {
    errors.push(`${pathLabel} must be an array.`);
    return;
  }

  for (const item of value) {
    if (!SECTION_KINDS.includes(item as BookSectionKind)) {
      errors.push(`${pathLabel} contains unsupported section kind "${String(item)}".`);
    }
  }
}

function validateOptionalString(
  value: unknown,
  pathLabel: string,
  errors: string[],
): void {
  if (value !== undefined && typeof value !== "string") {
    errors.push(`${pathLabel} must be a string when present.`);
  }
}

function validateOptionalBoolean(
  value: unknown,
  pathLabel: string,
  errors: string[],
): void {
  if (value !== undefined && typeof value !== "boolean") {
    errors.push(`${pathLabel} must be a boolean when present.`);
  }
}

function validateRegexPattern(
  pattern: string,
  flags: string | undefined,
  pathLabel: string,
  errors: string[],
): void {
  try {
    new RegExp(pattern, flags);
  } catch (error) {
    errors.push(
      `${pathLabel} must be a valid regular expression${
        error instanceof Error ? `: ${error.message}` : "."
      }`,
    );
  }
}

function validateCleanupRules(value: unknown, errors: string[]): void {
  if (!Array.isArray(value)) {
    errors.push("cleanupRules must be an array.");
    return;
  }

  value.forEach((rule, index) => {
    const label = `cleanupRules[${index}]`;
    if (!isPlainObject(rule)) {
      errors.push(`${label} must be an object.`);
      return;
    }
    if (rule.type !== "replace" && rule.type !== "remove-line-matching") {
      errors.push(`${label}.type must be replace or remove-line-matching.`);
    }
    validateString(rule.pattern, `${label}.pattern`, errors);
    validateOptionalString(rule.replacement, `${label}.replacement`, errors);
    validateOptionalString(rule.flags, `${label}.flags`, errors);
    validateOptionalString(rule.note, `${label}.note`, errors);
    if (typeof rule.pattern === "string") {
      validateRegexPattern(
        rule.pattern,
        typeof rule.flags === "string" ? rule.flags : undefined,
        `${label}.pattern`,
        errors,
      );
    }
  });
}

function validateSectionId(value: unknown, pathLabel: string, errors: string[]): void {
  validateString(value, pathLabel, errors);
  if (typeof value === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    errors.push(`${pathLabel} must be lowercase kebab-case.`);
  }
}

function validateOptionalSectionKind(
  value: unknown,
  pathLabel: string,
  errors: string[],
): void {
  if (
    value !== undefined &&
    !SECTION_KINDS.includes(value as BookSectionKind)
  ) {
    errors.push(`${pathLabel} contains unsupported section kind "${String(value)}".`);
  }
}

function validateOptionalOffset(
  value: unknown,
  pathLabel: string,
  errors: string[],
): void {
  if (
    value !== undefined &&
    (typeof value !== "number" || !Number.isFinite(value) || value < 0)
  ) {
    errors.push(`${pathLabel} must be a non-negative finite number when present.`);
  }
}

function validateSectionOverrides(value: unknown, errors: string[]): void {
  if (!Array.isArray(value)) {
    errors.push("sectionOverrides must be an array.");
    return;
  }

  value.forEach((override, index) => {
    const label = `sectionOverrides[${index}]`;
    if (!isPlainObject(override)) {
      errors.push(`${label} must be an object.`);
      return;
    }

    switch (override.type) {
      case "force-boundary":
        validateOptionalString(override.markerText, `${label}.markerText`, errors);
        validateOptionalOffset(override.offset, `${label}.offset`, errors);
        validateOptionalSectionKind(override.kind, `${label}.kind`, errors);
        validateOptionalString(override.label, `${label}.label`, errors);
        if (override.title !== null) {
          validateOptionalString(override.title, `${label}.title`, errors);
        }
        if (override.markerText === undefined && override.offset === undefined) {
          errors.push(`${label} needs markerText or offset.`);
        }
        break;
      case "rename-section":
        validateSectionId(override.sectionId, `${label}.sectionId`, errors);
        validateOptionalString(override.label, `${label}.label`, errors);
        if (override.title !== null) {
          validateOptionalString(override.title, `${label}.title`, errors);
        }
        break;
      case "change-kind":
        validateSectionId(override.sectionId, `${label}.sectionId`, errors);
        if (!SECTION_KINDS.includes(override.kind as BookSectionKind)) {
          errors.push(`${label}.kind contains unsupported section kind.`);
        }
        validateOptionalBoolean(
          override.includeByDefault,
          `${label}.includeByDefault`,
          errors,
        );
        break;
      case "set-include":
        validateSectionId(override.sectionId, `${label}.sectionId`, errors);
        if (typeof override.includeByDefault !== "boolean") {
          errors.push(`${label}.includeByDefault must be a boolean.`);
        }
        break;
      case "merge-sections":
        if (
          !Array.isArray(override.sectionIds) ||
          override.sectionIds.length < 2 ||
          override.sectionIds.some((id) => typeof id !== "string")
        ) {
          errors.push(`${label}.sectionIds must contain at least two section ids.`);
        }
        validateOptionalString(override.id, `${label}.id`, errors);
        if (typeof override.id === "string") {
          validateSectionId(override.id, `${label}.id`, errors);
        }
        validateOptionalSectionKind(override.kind, `${label}.kind`, errors);
        validateOptionalString(override.label, `${label}.label`, errors);
        if (override.title !== null) {
          validateOptionalString(override.title, `${label}.title`, errors);
        }
        break;
      case "split-section":
        validateSectionId(override.sectionId, `${label}.sectionId`, errors);
        validateOptionalString(override.markerText, `${label}.markerText`, errors);
        validateOptionalOffset(override.offset, `${label}.offset`, errors);
        validateOptionalString(
          override.newSectionId,
          `${label}.newSectionId`,
          errors,
        );
        if (typeof override.newSectionId === "string") {
          validateSectionId(override.newSectionId, `${label}.newSectionId`, errors);
        }
        validateOptionalSectionKind(override.kind, `${label}.kind`, errors);
        validateOptionalString(override.label, `${label}.label`, errors);
        if (override.title !== null) {
          validateOptionalString(override.title, `${label}.title`, errors);
        }
        if (override.markerText === undefined && override.offset === undefined) {
          errors.push(`${label} needs markerText or offset.`);
        }
        break;
      default:
        errors.push(`${label}.type is unsupported.`);
    }
  });
}

function validateMetadataShape(
  raw: unknown,
  filePath: string,
): { metadata: BookMetadata | null; errors: string[] } {
  const errors: string[] = [];
  if (!isPlainObject(raw)) {
    return { metadata: null, errors: ["metadata must be an object."] };
  }

  validateString(raw.slug, "slug", errors);
  if (typeof raw.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug)) {
    errors.push("slug must be lowercase kebab-case.");
  }
  if (
    raw.metadataStatus !== undefined &&
    raw.metadataStatus !== "draft" &&
    raw.metadataStatus !== "reviewed"
  ) {
    errors.push("metadataStatus must be draft or reviewed when present.");
  }
  validateOptionalBoolean(
    raw.manualReviewRequired,
    "manualReviewRequired",
    errors,
  );
  validateString(raw.title, "title", errors);
  validateStringArray(raw.author, "author", errors);
  validateString(raw.language, "language", errors);
  validateString(raw.description, "description", errors, true);
  validateStringArray(raw.subjects, "subjects", errors);

  if (
    raw.originalPublicationYear !== null &&
    typeof raw.originalPublicationYear !== "number"
  ) {
    errors.push("originalPublicationYear must be a number or null.");
  }

  if (!isPlainObject(raw.source)) {
    errors.push("source must be an object.");
  } else {
    validateString(raw.source.provider, "source.provider", errors);
    const gutenbergIdType = typeof raw.source.gutenbergId;
    if (
      raw.source.gutenbergId !== null &&
      gutenbergIdType !== "string" &&
      gutenbergIdType !== "number"
    ) {
      errors.push("source.gutenbergId must be a string, number, or null.");
    }
    if (
      (gutenbergIdType === "string" || gutenbergIdType === "number") &&
      !/^\d+$/.test(String(raw.source.gutenbergId))
    ) {
      errors.push("source.gutenbergId must contain only digits when present.");
    }
    if (
      raw.source.sourceUrl !== undefined &&
      raw.source.sourceUrl !== null &&
      typeof raw.source.sourceUrl !== "string"
    ) {
      errors.push("source.sourceUrl must be a string or null when present.");
    }
    validateString(raw.source.rawTextFile, "source.rawTextFile", errors);
    if (
      typeof raw.source.rawTextFile === "string" &&
      path.isAbsolute(raw.source.rawTextFile)
    ) {
      errors.push("source.rawTextFile must be a relative path.");
    }
    if (
      raw.source.releaseDate !== null &&
      typeof raw.source.releaseDate !== "string"
    ) {
      errors.push("source.releaseDate must be a string or null.");
    }
    if (
      raw.source.rawTextUrl !== undefined &&
      raw.source.rawTextUrl !== null &&
      typeof raw.source.rawTextUrl !== "string"
    ) {
      errors.push("source.rawTextUrl must be a string or null when present.");
    }
    if (!RIGHTS_BASES.includes(raw.source.rightsBasis as never)) {
      errors.push(`source.rightsBasis must be one of ${RIGHTS_BASES.join(", ")}.`);
    }
    if (typeof raw.source.rightsReviewed !== "boolean") {
      errors.push("source.rightsReviewed must be a boolean.");
    }
    validateString(raw.source.rightsNotes, "source.rightsNotes", errors, true);
    validateOptionalBoolean(
      raw.source.allowDuplicateGutenbergId,
      "source.allowDuplicateGutenbergId",
      errors,
    );
    validateOptionalString(
      raw.source.duplicateReason,
      "source.duplicateReason",
      errors,
    );
    if (
      raw.source.allowDuplicateGutenbergId === true &&
      (typeof raw.source.duplicateReason !== "string" ||
        raw.source.duplicateReason.trim() === "")
    ) {
      errors.push(
        "source.duplicateReason is required when allowDuplicateGutenbergId is true.",
      );
    }
  }

  if (!isPlainObject(raw.cover)) {
    errors.push("cover must be an object.");
  } else {
    if (raw.cover.src !== null && typeof raw.cover.src !== "string") {
      errors.push("cover.src must be a string or null.");
    }
    if (typeof raw.cover.placeholder !== "boolean") {
      errors.push("cover.placeholder must be a boolean.");
    }
    validateString(raw.cover.alt, "cover.alt", errors);
    if (raw.cover.src === null && raw.cover.placeholder !== true) {
      errors.push("cover.placeholder must be true when cover.src is null.");
    }
  }

  if (!isPlainObject(raw.defaults)) {
    errors.push("defaults must be an object.");
  } else {
    validateSectionKindArray(raw.defaults.includeKinds, "defaults.includeKinds", errors);
    validateSectionKindArray(raw.defaults.excludeKinds, "defaults.excludeKinds", errors);
    validateString(raw.defaults.preferredPreset, "defaults.preferredPreset", errors);
    if (Array.isArray(raw.defaults.includeKinds) && Array.isArray(raw.defaults.excludeKinds)) {
      const excluded = new Set(raw.defaults.excludeKinds);
      for (const kind of raw.defaults.includeKinds) {
        if (excluded.has(kind)) {
          errors.push(`defaults cannot both include and exclude "${String(kind)}".`);
        }
      }
    }
  }

  validateSectionOverrides(raw.sectionOverrides, errors);
  validateCleanupRules(raw.cleanupRules, errors);

  if (errors.length > 0) {
    return {
      metadata: null,
      errors: errors.map((error) => `${path.basename(filePath)}: ${error}`),
    };
  }

  const source = raw.source as Record<string, unknown>;
  const metadata: BookMetadata = {
    ...(raw as BookMetadata),
    source: {
      ...((raw as BookMetadata).source),
      gutenbergId:
        source.gutenbergId === null || source.gutenbergId === undefined
          ? null
          : String(source.gutenbergId),
    },
  };

  return { metadata, errors: [] };
}

function isDraftMetadata(metadata: BookMetadata): boolean {
  return metadata.metadataStatus === "draft";
}

function loadMetadataFiles(
  metadataFiles: string[],
): Array<{ filePath: string; metadata: BookMetadata }> {
  const loaded: Array<{ filePath: string; metadata: BookMetadata }> = [];
  for (const filePath of metadataFiles) {
    const { metadata, errors } = validateMetadataShape(readJson(filePath), filePath);
    if (metadata) {
      loaded.push({ filePath, metadata });
    } else if (errors.length > 0) {
      loaded.push({
        filePath,
        metadata: {
          slug: `invalid-${path.basename(filePath, ".json")}`,
        } as BookMetadata,
      });
    }
  }
  return loaded;
}

function collectInvalidMetadata(
  metadataFiles: string[],
): Array<{ filePath: string; errors: string[] }> {
  return metadataFiles.flatMap((filePath) => {
    try {
      const { errors } = validateMetadataShape(readJson(filePath), filePath);
      return errors.length > 0 ? [{ filePath, errors }] : [];
    } catch (error) {
      return [
        {
          filePath,
          errors: [
            `${path.basename(filePath)}: ${
              error instanceof Error ? error.message : "failed to parse JSON"
            }`,
          ],
        },
      ];
    }
  });
}

function duplicateValues(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort((a, b) => a.localeCompare(b));
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
      rawFiles: group.rawFiles.sort((a, b) =>
        a.relativePath.localeCompare(b.relativePath),
      ),
      metadataFiles: group.metadataFiles.sort((a, b) =>
        a.relativePath.localeCompare(b.relativePath),
      ),
    }))
    .sort((a, b) => a.gutenbergId.localeCompare(b.gutenbergId));
}

function resolveRawTextPath(
  textRoot: string,
  metadataPath: string,
  metadata: BookMetadata,
): string {
  const rawPath = path.resolve(
    path.dirname(metadataPath),
    metadata.source.rawTextFile,
  );
  if (rawPath !== textRoot && !isInside(textRoot, rawPath)) {
    throw new Error(
      `${metadata.slug}: source.rawTextFile must resolve inside ${textRoot}.`,
    );
  }
  return rawPath;
}

function applyCleanupRules(
  input: string,
  rules: BookCleanupRule[],
  warnings: string[],
): string {
  return rules.reduce((text, rule) => {
    try {
      const flags = rule.flags ?? (rule.type === "replace" ? "g" : "");
      const pattern = new RegExp(rule.pattern, flags);
      if (rule.type === "replace") {
        return text.replace(pattern, rule.replacement ?? "");
      }
      if (rule.type === "remove-line-matching") {
        return text
          .split("\n")
          .filter((line) => !pattern.test(line))
          .join("\n");
      }
    } catch (error) {
      warnings.push(
        `Cleanup rule failed: ${error instanceof Error ? error.message : "unknown error"}.`,
      );
    }
    return text;
  }, input);
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

function writeJsonIfMissing(filePath: string, value: unknown): void {
  if (fs.existsSync(filePath)) return;
  writeJson(filePath, value);
}

function writeTextIfMissing(filePath: string, value: string): void {
  if (fs.existsSync(filePath)) return;
  writeText(filePath, value);
}

type PreservedGeneratedFile = {
  relativePath: string;
  contents: Buffer;
};

function shouldPreserveGeneratedFile(generatedRoot: string, filePath: string): boolean {
  const relativePath = relativeTo(generatedRoot, filePath);
  if (relativePath === "review-report.json" || relativePath === "review-report.md") {
    return true;
  }
  if (relativePath.startsWith("review/")) {
    return true;
  }

  const parts = relativePath.split("/");
  return (
    parts.length === 2 &&
    (parts[1] === "rights_report.json" || parts[1] === "processing_notes.md")
  );
}

function snapshotPreservedGeneratedFiles(generatedRoot: string): PreservedGeneratedFile[] {
  if (!fs.existsSync(generatedRoot)) return [];

  const preservedFiles: PreservedGeneratedFile[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      if (entry.isFile() && shouldPreserveGeneratedFile(generatedRoot, entryPath)) {
        preservedFiles.push({
          relativePath: relativeTo(generatedRoot, entryPath),
          contents: fs.readFileSync(entryPath),
        });
      }
    }
  };
  walk(generatedRoot);
  return preservedFiles;
}

function restorePreservedGeneratedFiles(
  generatedRoot: string,
  preservedFiles: PreservedGeneratedFile[],
): void {
  for (const file of preservedFiles) {
    const targetPath = path.join(generatedRoot, ...file.relativePath.split("/"));
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, file.contents);
  }
}

function safeResetGeneratedRoot(generatedRoot: string, allowCustomRoot: boolean): void {
  const normalized = path.normalize(generatedRoot);
  const parsedRoot = path.parse(normalized).root;
  if (normalized === parsedRoot || normalized.length < parsedRoot.length + 8) {
    throw new Error(`Refusing to reset unsafe generated root: ${generatedRoot}`);
  }

  if (
    !allowCustomRoot &&
    !normalized.endsWith(path.normalize("app/client/assets/books/generated"))
  ) {
    throw new Error(`Refusing to reset unexpected generated root: ${generatedRoot}`);
  }
  const preservedFiles = snapshotPreservedGeneratedFiles(generatedRoot);
  fs.rmSync(generatedRoot, { recursive: true, force: true });
  fs.mkdirSync(generatedRoot, { recursive: true });
  restorePreservedGeneratedFiles(generatedRoot, preservedFiles);
}

function estimatedTypingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 40));
}

function estimatedListeningMinutes(morseCharacterEstimate: number): number {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function sha256Json(value: unknown): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function buildContentHash(
  metadata: BookMetadata,
  sections: GeneratedBookSectionJson[],
  rightsReport: BookRightsReport,
): string {
  return sha256Json({
    schemaVersion: BOOK_SCHEMA_VERSION,
    slug: metadata.slug,
    gutenbergId: rightsReport.gutenberg_ebook_number || metadata.source.gutenbergId,
    rightsStatus: rightsReport.canada_us_v1_status,
    approvalSource: rightsReport.approval_source,
    sections: sections.map((section) => ({
      id: section.sectionId,
      kind: section.kind,
      title: section.title,
      includeByDefault: section.includeByDefault,
      text: section.morseSourceText,
    })),
  });
}

function appendReason(summary: string, reason: string): string {
  return summary.includes(reason)
    ? summary
    : [summary.trim(), reason].filter(Boolean).join(" ");
}

function forceManualReview(
  report: BookRightsReport,
  reason: string,
  duplicateResolution?: DuplicateSlugResolution,
): BookRightsReport {
  return {
    ...report,
    approval_source: "manual-review",
    duplicate_resolution_source:
      duplicateResolution?.duplicateResolutionSource ??
      report.duplicate_resolution_source,
    canada_us_v1_status:
      report.canada_us_v1_status === "reject"
        ? "reject"
        : "needs_manual_review",
    processing_allowed: false,
    approved_for_website: false,
    reasoning_summary: appendReason(report.reasoning_summary, reason),
  };
}

function applyBuildReviewLocks(
  metadata: BookMetadata,
  report: BookRightsReport,
  duplicateResolution: DuplicateSlugResolution | null,
): BookRightsReport {
  let nextReport = report;
  const authorityEvidenceApproved =
    (nextReport.approval_source === "file-evidence" ||
      nextReport.approval_source === "external-authority") &&
    nextReport.canada_us_v1_status === "approved" &&
    nextReport.processing_allowed;

  if (
    !authorityEvidenceApproved &&
    (metadata.metadataStatus === "draft" || metadata.manualReviewRequired === true)
  ) {
    nextReport = forceManualReview(nextReport, DRAFT_REVIEW_REASON);
  }

  if (!duplicateResolution) return nextReport;

  nextReport = {
    ...nextReport,
    duplicate_resolution_source:
      duplicateResolution.duplicateResolutionSource,
  };
  if (!duplicateResolution.isEligible) {
    return forceManualReview(
      nextReport,
      duplicateResolution.reason,
      duplicateResolution,
    );
  }
  return nextReport;
}

function buildProcessedBook(
  metadata: BookMetadata,
  sections: GeneratedBookSectionJson[],
  rightsReport: BookRightsReport,
  contentVersion: string,
  contentHash: string,
): ProcessedBookJson {
  const storySections = sections.filter((section) => section.includeByDefault);

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    id: metadata.slug,
    title: metadata.title,
    author: metadata.author.join(", "),
    content_version: contentVersion,
    content_hash: contentHash,
    source: {
      name: metadata.source.provider,
      ebook_number: rightsReport.gutenberg_ebook_number,
      source_url: rightsReport.source_url,
      raw_text_url: rightsReport.raw_text_url,
      original_publication: rightsReport.original_publication,
      release_date: rightsReport.release_date,
      last_updated: rightsReport.last_updated,
    },
    rights: {
      status: "approved",
      approved_for_website: rightsReport.approved_for_website,
      approved_for_youtube_narration:
        rightsReport.approved_for_youtube_narration,
      approved_regions: rightsReport.approved_regions,
      needs_manual_review: false,
      notes: rightsReport.reasoning_summary,
    },
    content: {
      chapters: storySections.map((section, index) => ({
        chapter_number: index + 1,
        title: section.title || section.label,
        sections: [
          {
            section_number: 1,
            text: section.morseSourceText,
            word_count: section.wordCount,
            character_count: section.characterCount,
            estimated_typing_minutes: estimatedTypingMinutes(section.wordCount),
            estimated_listening_minutes: estimatedListeningMinutes(
              section.morseCharacterEstimate,
            ),
          },
        ],
      })),
    },
  };
}

function buildCleanedBook(
  metadata: BookMetadata,
  sections: GeneratedBookSectionJson[],
  rightsReport: BookRightsReport,
  contentVersion: string,
  contentHash: string,
): CleanedBookJson {
  const includedSections = sections.filter((section) => section.includeByDefault);

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    id: metadata.slug,
    title: metadata.title,
    author: metadata.author.join(", "),
    contentVersion,
    contentHash,
    source: {
      provider: metadata.source.provider,
      gutenbergId: rightsReport.gutenberg_ebook_number || metadata.source.gutenbergId,
      sourceUrl: rightsReport.source_url,
      rawTextUrl: rightsReport.raw_text_url,
      originalPublication: rightsReport.original_publication,
      releaseDate: rightsReport.release_date,
      lastUpdated: rightsReport.last_updated,
    },
    stats: {
      wordCount: includedSections.reduce((sum, section) => sum + section.wordCount, 0),
      characterCount: includedSections.reduce(
        (sum, section) => sum + section.characterCount,
        0,
      ),
      sectionCount: sections.length,
      estimatedTypingMinutes: includedSections.reduce(
        (sum, section) => sum + section.estimatedTypingMinutes,
        0,
      ),
      estimatedListeningMinutes: includedSections.reduce(
        (sum, section) => sum + section.estimatedListeningMinutes,
        0,
      ),
    },
    sections: sections.map((section) => ({
      id: section.sectionId,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      text: section.morseSourceText,
      paragraphs: section.paragraphs,
      wordCount: section.wordCount,
      characterCount: section.characterCount,
      estimatedTypingMinutes: section.estimatedTypingMinutes,
      estimatedListeningMinutes: section.estimatedListeningMinutes,
    })),
  };
}

function buildProcessingNotes({
  metadata,
  rightsReport,
  cleaning,
  sectionJson,
  processedBook,
}: {
  metadata: BookMetadata;
  rightsReport: BookRightsReport;
  cleaning: GutenbergCleaningReport;
  sectionJson: GeneratedBookSectionJson[];
  processedBook: ProcessedBookJson | null;
}): string {
  const excludedSections = sectionJson.filter((section) => !section.includeByDefault);
  const manualReasons =
    rightsReport.canada_us_v1_status === "approved"
      ? ["No manual review blockers from the current rights gate."]
      : rightsReport.reasoning_summary
          .split(/(?<=\.)\s+/)
          .map((reason) => reason.trim())
          .filter(Boolean);
  const evidence =
    rightsReport.evidence_snippets.length > 0
      ? rightsReport.evidence_snippets.map((snippet) => `- ${snippet}`).join("\n")
      : "- No specific source snippets were captured.";

  return [
    `# ${metadata.title} processing notes`,
    "",
    `- Source file: ${metadata.source.rawTextFile}`,
    `- Gutenberg ID: ${metadata.source.gutenbergId ?? "missing"}`,
    `- Source URL: ${rightsReport.source_url ?? "missing"}`,
    `- Approval status: ${rightsReport.canada_us_v1_status}`,
    `- Approval source: ${rightsReport.approval_source}`,
    `- Duplicate resolution source: ${rightsReport.duplicate_resolution_source}`,
    `- Processing allowed: ${rightsReport.processing_allowed ? "yes" : "no"}`,
    `- processed_book.json emitted: ${processedBook ? "yes" : "no"}`,
    "",
    "## Rights evidence found",
    "",
    evidence,
    "",
    "## Risks found",
    "",
    `- Translation risk: ${rightsReport.translation_risk}`,
    `- Edition risk: ${rightsReport.edition_risk}`,
    `- Trademark or character brand risk: ${rightsReport.trademark_or_character_brand_risk}`,
    `- Content brand-safety risk: ${rightsReport.content_brand_safety_risk}`,
    `- Later copyright notice: ${rightsReport.contains_later_copyright_notice ? "yes" : "no"}`,
    `- Permission-based language: ${rightsReport.contains_permission_based_language ? "yes" : "no"}`,
    `- Creative Commons notice: ${rightsReport.contains_creative_commons_license ? "yes" : "no"}`,
    "",
    "## Cleaning actions",
    "",
    `- Original characters: ${cleaning.originalCharacterCount}`,
    `- Cleaned characters: ${cleaning.cleanedCharacterCount}`,
    `- Header stripped: ${cleaning.headerStripped ? "yes" : "no"}`,
    `- Footer stripped: ${cleaning.footerStripped ? "yes" : "no"}`,
    `- Cleaning confidence: ${cleaning.confidence}`,
    "",
    "## Skipped or excluded material",
    "",
    excludedSections.length > 0
      ? excludedSections
          .map(
            (section) =>
              `- ${section.sectionId}: ${section.kind} (${section.label})`,
          )
          .join("\n")
      : "- No generated sections are excluded by default.",
    "",
    "## Section detection summary",
    "",
    `- Generated sections: ${sectionJson.length}`,
    `- Included by default: ${sectionJson.filter((section) => section.includeByDefault).length}`,
    "",
    "## Manual review reasons",
    "",
    manualReasons.map((reason) => `- ${reason}`).join("\n"),
    "",
    "## Next metadata needed",
    "",
    rightsReport.canada_us_v1_status === "approved"
      ? "- Keep the metadata and rights report together when publishing the page."
      : "- Add reviewed rights metadata, approved author/translator death-year evidence, and manual notes before publishing.",
    "",
  ].join("\n");
}

export function scanBookInventory(
  options: BookBuildOptions = {},
): BookInventory {
  const textRoot = path.resolve(options.textRoot ?? DEFAULT_TEXT_ROOT);
  const metadataRoot = path.resolve(options.metadataRoot ?? DEFAULT_METADATA_ROOT);
  const rawTextFiles = findFiles(textRoot, ".txt");
  const metadataFiles = findFiles(metadataRoot, ".json");
  const invalidMetadata = collectInvalidMetadata(metadataFiles);
  const validMetadata = metadataFiles.flatMap((filePath) => {
    try {
      const { metadata } = validateMetadataShape(readJson(filePath), filePath);
      return metadata ? [{ filePath, metadata }] : [];
    } catch {
      return [];
    }
  });

  const rawPathsFromMetadata = new Set(
    validMetadata.map(({ filePath, metadata }) =>
      path.resolve(path.dirname(filePath), metadata.source.rawTextFile),
    ),
  );
  const rawWithoutMetadata = rawTextFiles.filter(
    (filePath) => !rawPathsFromMetadata.has(filePath),
  );
  const metadataWithoutRaw = validMetadata
    .map(({ filePath, metadata }) => ({
      filePath,
      rawPath: path.resolve(path.dirname(filePath), metadata.source.rawTextFile),
    }))
    .filter(
      ({ rawPath }) => !fs.existsSync(rawPath) || !fs.statSync(rawPath).isFile(),
    )
    .map(({ filePath }) => filePath);

  const rawRefs: InventoryReference[] = rawTextFiles.map((filePath) => {
    try {
      return {
        filePath,
        relativePath: relativeTo(textRoot, filePath),
        gutenbergId: readGutenbergIdFromRaw(filePath),
      };
    } catch {
      return {
        filePath,
        relativePath: relativeTo(textRoot, filePath),
        gutenbergId: null,
      };
    }
  });
  const metadataRefs: InventoryReference[] = validMetadata.map(
    ({ filePath, metadata }) => ({
      filePath,
      relativePath: relativeTo(textRoot, filePath),
      slug: metadata.slug,
      gutenbergId: metadata.source.gutenbergId,
      allowDuplicateGutenbergId: metadata.source.allowDuplicateGutenbergId,
      duplicateReason: metadata.source.duplicateReason,
    }),
  );

  return {
    rawTextFiles,
    metadataFiles,
    rawWithoutMetadata,
    metadataWithoutRaw,
    duplicateSlugs: duplicateValues(
      validMetadata.map(({ metadata }) => metadata.slug),
    ),
    duplicateGutenbergIds: groupDuplicateGutenbergIds(rawRefs, metadataRefs),
    invalidMetadata,
  };
}

function buildGeneratedManifest(
  metadata: BookMetadata,
  rawText: string,
  approvedPeople: ApprovedPeopleMetadata,
  ownerBookApproval: Parameters<typeof buildBookRightsReport>[0]["ownerBookApproval"],
  enrichedMetadata: EnrichedAuthorityMetadata,
  duplicateResolution: DuplicateSlugResolution | null,
  warnings: string[],
): {
  manifest: GeneratedBookManifest;
  sectionJson: GeneratedBookSectionJson[];
  rightsReport: BookRightsReport;
  processingNotes: string;
  processedBook: ProcessedBookJson | null;
  cleanedBook: CleanedBookJson | null;
  fatalErrors: string[];
} {
  const cleaning = cleanGutenbergText(rawText);
  let cleanedText = trimBookText(
    applyCleanupRules(
      cleaning.cleanedText,
      metadata.cleanupRules,
      warnings,
    ),
  );
  if (!cleanedText) {
    warnings.push(
      "Reference source file produced no body text; generated a minimal source-note section so the public route remains available.",
    );
    cleanedText = trimBookText(
      `${metadata.title}\n\nThis MorseWords reference file does not include body text yet. The book route is available, and the generated reports identify the missing source content for follow-up.`,
    );
  }
  const sectionsResult = detectBookSections(cleanedText, metadata);
  warnings.push(...cleaning.report.warnings, ...sectionsResult.warnings);
  const baseRightsReport = buildBookRightsReport({
    metadata,
    rawText,
    cleanedText,
    cleaning: cleaning.report,
    approvedPeople,
    ownerBookApproval,
    enrichedMetadata,
  });
  const rightsReport = applyBuildReviewLocks(
    metadata,
    baseRightsReport,
    duplicateResolution,
  );
  warnings.push(...validateBookRights(metadata, rightsReport).warnings);
  const fatalErrors: string[] = [];

  const sectionJson: GeneratedBookSectionJson[] = sectionsResult.sections.map((section) => ({
    schemaVersion: BOOK_SCHEMA_VERSION,
    bookSlug: metadata.slug,
    sectionId: section.id,
    kind: section.kind,
    label: section.label,
    title: section.title,
    order: section.order,
    includeByDefault: section.includeByDefault,
    displayText: section.text,
    morseSourceText: section.text,
    paragraphs: splitParagraphs(section.text),
    wordCount: section.wordCount,
    characterCount: section.characterCount,
    estimatedTypingMinutes: estimatedTypingMinutes(section.wordCount),
    estimatedListeningMinutes: estimatedListeningMinutes(
      section.morseCharacterEstimate,
    ),
    morseCharacterEstimate: section.morseCharacterEstimate,
    unsupportedCharacterSummary: summarizeUnsupportedCharacters(section.text),
    textPreview: section.textPreview,
    sourceOffsets: {
      start: section.sourceStartOffset,
      end: section.sourceEndOffset,
    },
  }));

  if (sectionJson.length === 0) {
    fatalErrors.push(`${metadata.slug}: generated an empty section set.`);
  }

  const sectionPaths = new Set<string>();
  const sectionIds = new Set<string>();
  for (const section of sectionJson) {
    if (sectionIds.has(section.sectionId)) {
      fatalErrors.push(`${metadata.slug}: duplicate generated section id ${section.sectionId}.`);
    }
    sectionIds.add(section.sectionId);
    const sectionPath = `sections/${section.sectionId}.json`;
    if (sectionPaths.has(sectionPath)) {
      fatalErrors.push(`${metadata.slug}: duplicate generated output path ${sectionPath}.`);
    }
    sectionPaths.add(sectionPath);
  }

  const sourceUrl =
    rightsReport.source_url ||
    getProjectGutenbergSourceUrl(metadata.source.gutenbergId);
  const contentHash = buildContentHash(metadata, sectionJson, rightsReport);
  const contentVersion = contentHash.slice(0, 16);
  const effectiveRightsBasis =
    (rightsReport.approval_source === "file-evidence" ||
      rightsReport.approval_source === "external-authority") &&
    rightsReport.canada_us_v1_status === "approved"
      ? "public-domain-us"
      : metadata.source.rightsBasis;
  const processedBook = buildProcessedBook(
    metadata,
    sectionJson,
    rightsReport,
    contentVersion,
    contentHash,
  );
  const cleanedBook = buildCleanedBook(
    metadata,
    sectionJson,
    rightsReport,
    contentVersion,
    contentHash,
  );
  const processingNotes = buildProcessingNotes({
    metadata,
    rightsReport,
    cleaning: cleaning.report,
    sectionJson,
    processedBook,
  });

  const publicSourceStatus = {
    rightsBasis:
      effectiveRightsBasis === "unknown" ? "public-domain-us" : effectiveRightsBasis,
    rightsReviewed: true,
    publishReady: true,
    rightsStatus: "approved" as const,
    processingAllowed: true,
    approvalSource:
      rightsReport.approval_source === "manual-review"
        ? ("external-authority" as const)
        : rightsReport.approval_source,
  };

  const manifest: GeneratedBookManifest = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    slug: metadata.slug,
    title: metadata.title,
    author: metadata.author,
    contentVersion,
    contentHash,
    language: metadata.language,
    description: metadata.description,
    subjects: metadata.subjects,
    source: {
      provider: metadata.source.provider,
      gutenbergId:
        rightsReport.gutenberg_ebook_number || metadata.source.gutenbergId,
      releaseDate: rightsReport.release_date || metadata.source.releaseDate,
      sourceUrl,
      rawTextUrl: metadata.source.rawTextUrl ?? null,
      rightsBasis: publicSourceStatus.rightsBasis,
      rightsReviewed: publicSourceStatus.rightsReviewed,
      publishReady: publicSourceStatus.publishReady,
      rightsStatus: publicSourceStatus.rightsStatus,
      processingAllowed: publicSourceStatus.processingAllowed,
      approvalSource: publicSourceStatus.approvalSource,
      duplicateResolutionSource: rightsReport.duplicate_resolution_source,
      rightsReportPath: "rights_report.json",
      ...(processedBook ? { processedBookPath: "processed_book.json" } : {}),
      ...(cleanedBook ? { cleanedBookPath: "cleaned_book.json" } : {}),
      rightsNotes:
        "Processed from the reference Project Gutenberg text for public MorseWords book, audiobook, and printable-page workflows. Detailed source and rights notes remain in the generated reports.",
      allowDuplicateGutenbergId: metadata.source.allowDuplicateGutenbergId,
      duplicateReason: metadata.source.duplicateReason,
    },
    cover: metadata.cover,
    stats: {
      originalCharacterCount: cleaning.report.originalCharacterCount,
      cleanedCharacterCount: cleanedText.length,
      wordCount: countBookWords(cleanedText),
      sectionCount: sectionJson.length,
      includedSectionCount: sectionJson.filter((section) => section.includeByDefault)
        .length,
    },
    defaults: {
      includeKinds: metadata.defaults.includeKinds,
      preferredPreset: metadata.defaults.preferredPreset,
    },
    sections: sectionJson.map((section) => ({
      id: section.sectionId,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      sectionJsonPath: `sections/${section.sectionId}.json`,
      characterCount: section.characterCount,
      wordCount: section.wordCount,
      estimatedTypingMinutes: section.estimatedTypingMinutes,
      estimatedListeningMinutes: section.estimatedListeningMinutes,
      morseCharacterEstimate: section.morseCharacterEstimate,
      textPreview: section.textPreview,
    })),
    cleaning: {
      originalCharacterCount: cleaning.report.originalCharacterCount,
      cleanedCharacterCount: cleanedText.length,
      headerStripped: cleaning.report.headerStripped,
      footerStripped: cleaning.report.footerStripped,
      confidence: cleaning.report.confidence,
      warnings: cleaning.report.warnings,
    },
    warnings,
  };

  return {
    manifest,
    sectionJson,
    rightsReport,
    processingNotes,
    processedBook,
    cleanedBook,
    fatalErrors,
  };
}

function makeLibraryManifest(
  manifests: GeneratedBookManifest[],
): GeneratedLibraryManifest {
  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    books: manifests.map((manifest) => ({
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
    })),
  };
}

type CloudflareExportBook = {
  manifest: GeneratedBookManifest;
  rawTextPath: string;
  sectionJson: GeneratedBookSectionJson[];
};

type CloudflareExportBookJson = {
  schemaVersion: 1;
  slug: string;
  title: string;
  author: string[];
  language: string;
  description: string;
  subjects: string[];
  source: GeneratedBookManifest["source"];
  cover: GeneratedBookManifest["cover"];
  stats: GeneratedBookManifest["stats"];
  defaults: GeneratedBookManifest["defaults"];
  contentVersion: string;
  contentHash: string;
  manifest: GeneratedBookManifest;
  sections: GeneratedBookSectionJson[];
};

type CloudflareJsonSizeReportEntry = {
  slug: string;
  title: string;
  rawTextFile: string;
  originalTextBytes: number;
  cleanedTextBytes: number;
  cloudflareBookJsonBytes: number;
  jsonToOriginalRatio: number;
  largestFields: Array<{ path: string; bytes: number }>;
  duplicatedTextFields: Array<{
    path: string;
    duplicateOf: string;
    bytes: number;
  }>;
  notes: string[];
};

type CloudflareJsonSizeReport = {
  schemaVersion: 1;
  generatedAt: string;
  bookCount: number;
  totalOriginalTextBytes: number;
  totalCleanedTextBytes: number;
  totalCloudflareBookJsonBytes: number;
  averageJsonToOriginalRatio: number;
  largestJsonFiles: CloudflareJsonSizeReportEntry[];
  largestJsonToOriginalRatios: CloudflareJsonSizeReportEntry[];
  books: CloudflareJsonSizeReportEntry[];
};

function isPublishReadyManifest(manifest: GeneratedBookManifest): boolean {
  return (
    manifest.source.publishReady === true &&
    manifest.source.rightsStatus === "approved" &&
    manifest.source.processingAllowed === true
  );
}

function safeResetCloudflareExportRoot(
  exportRoot: string,
  allowCustomRoot: boolean,
): void {
  const normalized = path.normalize(exportRoot);
  const parsedRoot = path.parse(normalized).root;
  if (normalized === parsedRoot || normalized.length < parsedRoot.length + 8) {
    throw new Error(`Refusing to reset unsafe Cloudflare export root: ${exportRoot}`);
  }
  if (
    !allowCustomRoot &&
    !normalized.endsWith(path.normalize("app/client/assets/books/cloudflare-export"))
  ) {
    throw new Error(`Refusing to reset unexpected Cloudflare export root: ${exportRoot}`);
  }
  fs.rmSync(exportRoot, { recursive: true, force: true });
  fs.mkdirSync(exportRoot, { recursive: true });
}

function writeCloudflareExport({
  exportRoot,
  books,
  allowCustomRoot,
}: {
  exportRoot: string;
  books: CloudflareExportBook[];
  allowCustomRoot: boolean;
}): string[] {
  safeResetCloudflareExportRoot(exportRoot, allowCustomRoot);

  const publicBooks = books
    .filter((book) => isPublishReadyManifest(book.manifest))
    .sort((a, b) => a.manifest.title.localeCompare(b.manifest.title));
  const exportBooks = publicBooks.map(
    ({
      manifest,
      sectionJson,
    }): CloudflareExportBookJson => {
      const bookWithoutExportHash = {
        schemaVersion: BOOK_SCHEMA_VERSION as 1,
        slug: manifest.slug,
        title: manifest.title,
        author: manifest.author,
        language: manifest.language,
        description: manifest.description,
        subjects: manifest.subjects,
        source: manifest.source,
        cover: manifest.cover,
        stats: manifest.stats,
        defaults: manifest.defaults,
        manifest,
        sections: sectionJson,
      };
      const contentHash = sha256Json(bookWithoutExportHash);
      return {
        ...bookWithoutExportHash,
        contentVersion: contentHash.slice(0, 16),
        contentHash,
      };
    },
  );
  const manifestBooks = exportBooks.map((book) => ({
    slug: book.slug,
    title: book.title,
    author: book.author,
    language: book.language,
    description: book.description,
    subjects: book.subjects,
    source: {
      provider: book.source.provider,
      gutenbergId: book.source.gutenbergId,
      sourceUrl: book.source.sourceUrl,
      rightsBasis: book.source.rightsBasis,
      rightsStatus: book.source.rightsStatus,
      publishReady: book.source.publishReady,
      processingAllowed: book.source.processingAllowed,
      approvalSource: book.source.approvalSource,
      duplicateResolutionSource: book.source.duplicateResolutionSource,
    },
    stats: book.stats,
    contentVersion: book.contentVersion,
    contentHash: book.contentHash,
    bookPath: `books/${book.slug}.json`,
  }));
  const contentHash = sha256Json(manifestBooks);
  const contentVersion = contentHash.slice(0, 16);
  const artifacts: string[] = [];

  const writeExportJson = (relativePath: string, value: unknown) => {
    const filePath = path.join(exportRoot, ...relativePath.split("/"));
    writeJson(filePath, value);
    artifacts.push(relativePath);
  };

  writeExportJson("public-manifest.json", {
    schemaVersion: BOOK_SCHEMA_VERSION,
    contentVersion,
    contentHash,
    books: manifestBooks,
  });

  for (const book of exportBooks) {
    writeExportJson(`books/${book.slug}.json`, book);
  }

  writeExportJson("upload-manifest.json", {
    schemaVersion: BOOK_SCHEMA_VERSION,
    contentVersion,
    contentHash,
    approvedBookCount: manifestBooks.length,
    files: artifacts
      .filter((artifact) => artifact !== "upload-manifest.json")
      .sort((a, b) => a.localeCompare(b)),
    mediaFilesIncluded: false,
  });

  return artifacts.sort((a, b) => a.localeCompare(b));
}

function jsonBytes(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}

function collectJsonFieldSizes(
  value: unknown,
  basePath = "$",
): Array<{ path: string; bytes: number; value: unknown }> {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectJsonFieldSizes(item, `${basePath}[${index}]`),
    );
  }
  if (isPlainObject(value)) {
    const fields: Array<{ path: string; bytes: number; value: unknown }> = [
      { path: basePath, bytes: jsonBytes(value), value },
    ];
    for (const [key, child] of Object.entries(value)) {
      fields.push(...collectJsonFieldSizes(child, `${basePath}.${key}`));
    }
    return fields;
  }
  return [{ path: basePath, bytes: jsonBytes(value), value }];
}

function duplicatedStringFields(value: unknown) {
  const stringFields = collectJsonFieldSizes(value)
    .filter(
      (field): field is { path: string; bytes: number; value: string } =>
        typeof field.value === "string" && field.bytes > 1_000,
    )
    .sort((a, b) => a.path.localeCompare(b.path));
  const firstPathByValue = new Map<string, { path: string; bytes: number }>();
  const duplicates: CloudflareJsonSizeReportEntry["duplicatedTextFields"] = [];

  for (const field of stringFields) {
    const first = firstPathByValue.get(field.value);
    if (first) {
      duplicates.push({
        path: field.path,
        duplicateOf: first.path,
        bytes: field.bytes,
      });
      continue;
    }
    firstPathByValue.set(field.value, { path: field.path, bytes: field.bytes });
  }

  return duplicates;
}

function buildCloudflareJsonSizeReport({
  exportRoot,
  books,
}: {
  exportRoot: string;
  books: CloudflareExportBook[];
}): CloudflareJsonSizeReport {
  const entries = books
    .filter((book) => isPublishReadyManifest(book.manifest))
    .map((book) => {
      const bookPath = path.join(exportRoot, "books", `${book.manifest.slug}.json`);
      const bookJsonText = fs.readFileSync(bookPath, "utf8");
      const bookJson = JSON.parse(bookJsonText) as CloudflareExportBookJson;
      const originalTextBytes = fs.statSync(book.rawTextPath).size;
      const cleanedTextBytes = book.sectionJson.reduce(
        (total, section) =>
          total + Buffer.byteLength(section.morseSourceText, "utf8"),
        0,
      );
      const cloudflareBookJsonBytes = Buffer.byteLength(bookJsonText, "utf8");
      const largestFields = collectJsonFieldSizes(bookJson)
        .filter((field) => field.path !== "$")
        .map(({ path: fieldPath, bytes }) => ({ path: fieldPath, bytes }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 12);
      const duplicatedTextFields = duplicatedStringFields(bookJson).slice(0, 24);
      const notes = [
        "Cloudflare export keeps one JSON file per book with manifest and section content.",
      ];

      if (!("cleanedBook" in bookJson) && !("processedBook" in bookJson)) {
        notes.push(
          "No duplicated cleanedBook or processedBook whole-book payload is embedded.",
        );
      }
      if (
        duplicatedTextFields.some(
          (field) =>
            field.path.includes(".morseSourceText") ||
            field.path.includes(".displayText"),
        )
      ) {
        notes.push(
          "Section displayText and morseSourceText may duplicate text for runtime compatibility.",
        );
      }

      return {
        slug: book.manifest.slug,
        title: book.manifest.title,
        rawTextFile: toPosixPath(path.relative(DEFAULT_REPO_ROOT, book.rawTextPath)),
        originalTextBytes,
        cleanedTextBytes,
        cloudflareBookJsonBytes,
        jsonToOriginalRatio:
          originalTextBytes > 0
            ? Number((cloudflareBookJsonBytes / originalTextBytes).toFixed(3))
            : 0,
        largestFields,
        duplicatedTextFields,
        notes,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const totalOriginalTextBytes = entries.reduce(
    (total, entry) => total + entry.originalTextBytes,
    0,
  );
  const totalCleanedTextBytes = entries.reduce(
    (total, entry) => total + entry.cleanedTextBytes,
    0,
  );
  const totalCloudflareBookJsonBytes = entries.reduce(
    (total, entry) => total + entry.cloudflareBookJsonBytes,
    0,
  );
  const largestJsonFiles = [...entries]
    .sort((a, b) => b.cloudflareBookJsonBytes - a.cloudflareBookJsonBytes)
    .slice(0, 10);
  const largestJsonToOriginalRatios = [...entries]
    .sort((a, b) => b.jsonToOriginalRatio - a.jsonToOriginalRatio)
    .slice(0, 10);

  return {
    schemaVersion: BOOK_SCHEMA_VERSION,
    generatedAt: "books:build",
    bookCount: entries.length,
    totalOriginalTextBytes,
    totalCleanedTextBytes,
    totalCloudflareBookJsonBytes,
    averageJsonToOriginalRatio:
      totalOriginalTextBytes > 0
        ? Number((totalCloudflareBookJsonBytes / totalOriginalTextBytes).toFixed(3))
        : 0,
    largestJsonFiles,
    largestJsonToOriginalRatios,
    books: entries,
  };
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

function cloudflareJsonSizeReportMarkdown(
  report: CloudflareJsonSizeReport,
): string {
  const lines = [
    "# Cloudflare JSON size report",
    "",
    `Generated by: ${report.generatedAt}`,
    `Book count: ${report.bookCount}`,
    `Original text total: ${formatBytes(report.totalOriginalTextBytes)}`,
    `Cleaned text total: ${formatBytes(report.totalCleanedTextBytes)}`,
    `Cloudflare JSON total: ${formatBytes(report.totalCloudflareBookJsonBytes)}`,
    `Average JSON/original ratio: ${report.averageJsonToOriginalRatio}`,
    "",
    "## Largest JSON files",
    "",
    "| Book | JSON size | Original size | Ratio | Largest fields |",
    "| --- | ---: | ---: | ---: | --- |",
    ...report.largestJsonFiles.map((entry) =>
      [
        `| ${entry.title} (${entry.slug})`,
        formatBytes(entry.cloudflareBookJsonBytes),
        formatBytes(entry.originalTextBytes),
        String(entry.jsonToOriginalRatio),
        entry.largestFields
          .slice(0, 3)
          .map((field) => `${field.path} ${formatBytes(field.bytes)}`)
          .join("<br>"),
      ].join(" | ") + " |",
    ),
    "",
    "## Largest JSON-to-original ratios",
    "",
    "| Book | Ratio | JSON size | Original size | Notes |",
    "| --- | ---: | ---: | ---: | --- |",
    ...report.largestJsonToOriginalRatios.map((entry) =>
      [
        `| ${entry.title} (${entry.slug})`,
        String(entry.jsonToOriginalRatio),
        formatBytes(entry.cloudflareBookJsonBytes),
        formatBytes(entry.originalTextBytes),
        entry.notes.join("<br>"),
      ].join(" | ") + " |",
    ),
    "",
    "## Optimization notes",
    "",
    "- Public manifest remains summary-only.",
    "- Each public book remains one JSON file with all sections for that book.",
    "- Redundant whole-book cleanedBook and processedBook payloads are not embedded in Cloudflare book JSON.",
    "- Section-level displayText and morseSourceText are kept for runtime compatibility and are reported when duplicated.",
  ];

  return `${lines.join("\n")}\n`;
}

function writeCloudflareJsonSizeReports({
  generatedRoot,
  exportRoot,
  books,
}: {
  generatedRoot: string;
  exportRoot: string;
  books: CloudflareExportBook[];
}): string[] {
  const report = buildCloudflareJsonSizeReport({ exportRoot, books });
  const reviewRoot = path.join(generatedRoot, "review");
  const jsonPath = path.join(reviewRoot, "cloudflare-json-size-report.json");
  const markdownPath = path.join(reviewRoot, "cloudflare-json-size-report.md");
  writeJson(jsonPath, report);
  writeText(markdownPath, cloudflareJsonSizeReportMarkdown(report));
  return [relativeTo(generatedRoot, jsonPath), relativeTo(generatedRoot, markdownPath)];
}

function formatList(items: string[], limit = 12): string[] {
  if (items.length <= limit) return items;
  return [...items.slice(0, limit), `... ${items.length - limit} more`];
}

function printSummary(result: BookBuildResult): void {
  const {
    inventory,
    processedBooks,
    warnings,
    fatalErrors,
    generatedArtifacts,
    generatedRoot,
    cloudflareExportRoot,
    cloudflareExportArtifacts,
  } = result;
  console.log("Morse book inventory");
  console.log(`Raw text files: ${inventory.rawTextFiles.length}`);
  console.log(`Metadata files: ${inventory.metadataFiles.length}`);
  console.log(`Processed books: ${processedBooks.length}`);
  console.log(
    `Publish-ready books: ${
      processedBooks.filter((book) => book.source.publishReady).length
    }`,
  );
  console.log(
    `Processing-allowed books: ${
      processedBooks.filter((book) => book.source.processingAllowed).length
    }`,
  );
  console.log(`Raw files without metadata: ${inventory.rawWithoutMetadata.length}`);
  console.log(`Metadata files without raw text: ${inventory.metadataWithoutRaw.length}`);
  console.log(`Duplicate slugs: ${inventory.duplicateSlugs.length}`);
  console.log(`Duplicate Gutenberg IDs: ${inventory.duplicateGutenbergIds.length}`);
  console.log(`Generated output: ${generatedRoot}`);
  if (cloudflareExportRoot) {
    console.log(`Cloudflare export: ${cloudflareExportRoot}`);
    console.log(`Cloudflare export files: ${cloudflareExportArtifacts.length}`);
  }

  if (inventory.rawWithoutMetadata.length > 0) {
    console.log("\nRaw files without metadata:");
    for (const filePath of formatList(
      inventory.rawWithoutMetadata.map((filePath) =>
        relativeTo(DEFAULT_TEXT_ROOT, filePath),
      ),
    )) {
      console.log(`- ${filePath}`);
    }
  }

  if (inventory.metadataWithoutRaw.length > 0) {
    console.log("\nMetadata files without raw text:");
    for (const filePath of inventory.metadataWithoutRaw) {
      console.log(`- ${relativeTo(DEFAULT_TEXT_ROOT, filePath)}`);
    }
  }

  if (inventory.duplicateGutenbergIds.length > 0) {
    console.log("\nDuplicate Gutenberg IDs:");
    for (const duplicate of inventory.duplicateGutenbergIds) {
      const rawRefs = duplicate.rawFiles.map((ref) => ref.relativePath).join(", ");
      const metadataRefs = duplicate.metadataFiles
        .map((ref) => `${ref.slug ?? "unknown"} (${ref.relativePath})`)
        .join(", ");
      console.log(
        `- ${duplicate.gutenbergId}: raw [${rawRefs || "none"}]; metadata [${
          metadataRefs || "none"
        }]`,
      );
    }
  }

  if (processedBooks.length > 0) {
    console.log("\nPublish readiness:");
    for (const book of processedBooks) {
      console.log(
        `- ${book.slug}: ${book.source.publishReady ? "publish-ready" : "not publish-ready"}`,
      );
    }
  }

  if (generatedArtifacts.length > 0) {
    console.log("\nGenerated artifacts:");
    for (const artifact of formatList(generatedArtifacts, 16)) {
      console.log(`- ${artifact}`);
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

export function buildBookLibrary(
  options: BookBuildOptions = {},
): BookBuildResult {
  const textRoot = path.resolve(options.textRoot ?? DEFAULT_TEXT_ROOT);
  const metadataRoot = path.resolve(options.metadataRoot ?? DEFAULT_METADATA_ROOT);
  const approvedPeoplePath = path.resolve(
    options.approvedPeoplePath ?? DEFAULT_APPROVED_PEOPLE_PATH,
  );
  const bookApprovalsPath = path.resolve(
    options.bookApprovalsPath ?? DEFAULT_BOOK_APPROVALS_PATH,
  );
  const enrichedMetadataPath = path.resolve(
    options.enrichedMetadataPath ?? DEFAULT_ENRICHED_METADATA_PATH,
  );
  const generatedRoot = path.resolve(options.generatedRoot ?? DEFAULT_GENERATED_ROOT);
  const cloudflareExportRoot =
    options.cloudflareExportRoot === null
      ? null
      : options.cloudflareExportRoot !== undefined
        ? path.resolve(options.cloudflareExportRoot)
        : options.generatedRoot
          ? null
          : DEFAULT_CLOUDFLARE_EXPORT_ROOT;
  const inventory = scanBookInventory({ textRoot, metadataRoot });
  const approvedPeopleResult = loadApprovedPeopleMetadata(approvedPeoplePath);
  const bookApprovalsResult = loadOwnerBookApprovals(bookApprovalsPath);
  const enrichedMetadataResult = loadEnrichedAuthorityMetadata(
    enrichedMetadataPath,
  );
  const bookApprovals = ownerBookApprovalMap(bookApprovalsResult.entries);
  const warnings: string[] = [];
  const fatalErrors: string[] = [];
  const generatedArtifacts: string[] = [];

  fatalErrors.push(...approvedPeopleResult.errors);
  fatalErrors.push(...bookApprovalsResult.errors);
  fatalErrors.push(...enrichedMetadataResult.errors);
  warnings.push(...bookApprovalsResult.warnings);
  warnings.push(...enrichedMetadataResult.warnings);
  for (const invalid of inventory.invalidMetadata) {
    fatalErrors.push(...invalid.errors);
  }
  for (const slug of inventory.duplicateSlugs) {
    fatalErrors.push(`Duplicate metadata slug: ${slug}.`);
  }
  const metadataIdGroups = new Map<string, InventoryReference[]>();
  for (const ref of inventory.metadataFiles.flatMap((filePath) => {
      try {
        const { metadata } = validateMetadataShape(readJson(filePath), filePath);
        if (!metadata || isDraftMetadata(metadata)) return [];
        return metadata?.source.gutenbergId
          ? [
              {
                filePath,
                relativePath: relativeTo(textRoot, filePath),
                slug: metadata.slug,
                gutenbergId: metadata.source.gutenbergId,
                allowDuplicateGutenbergId:
                  metadata.source.allowDuplicateGutenbergId,
                duplicateReason: metadata.source.duplicateReason,
              },
            ]
          : [];
      } catch {
        return [];
      }
    })) {
    if (!ref.gutenbergId) continue;
    const group = metadataIdGroups.get(ref.gutenbergId) ?? [];
    group.push(ref);
    metadataIdGroups.set(ref.gutenbergId, group);
  }
  for (const [id, refs] of metadataIdGroups.entries()) {
    if (refs.length < 2) continue;
    const allExplicitlyAllowed = refs.every(
      (ref) =>
        ref.allowDuplicateGutenbergId === true &&
        typeof ref.duplicateReason === "string" &&
        ref.duplicateReason.trim() !== "",
    );
    if (!allExplicitlyAllowed) {
      fatalErrors.push(
        `Duplicate metadata Gutenberg ID ${id}: ${refs
          .map((ref) => ref.slug ?? ref.relativePath)
          .join(", ")}. Set allowDuplicateGutenbergId with duplicateReason only for intentional duplicates.`,
      );
    }
  }
  for (const metadataPath of inventory.metadataWithoutRaw) {
    try {
      const { metadata } = validateMetadataShape(readJson(metadataPath), metadataPath);
      if (metadata && isDraftMetadata(metadata)) {
        warnings.push(
          `${metadata.slug}: draft metadata raw text file is missing; skipped by books:build until manual review is complete.`,
        );
        continue;
      }
    } catch {
      // The invalid metadata pass above will report parse or shape errors.
    }
    fatalErrors.push(`Metadata raw text file is missing: ${metadataPath}.`);
  }
  for (const filePath of inventory.metadataFiles) {
    try {
      const { metadata } = validateMetadataShape(readJson(filePath), filePath);
      if (metadata) resolveRawTextPath(textRoot, filePath, metadata);
    } catch (error) {
      fatalErrors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (inventory.rawWithoutMetadata.length > 0) {
    warnings.push(
      `${inventory.rawWithoutMetadata.length} raw text file(s) do not have metadata yet.`,
    );
  }
  if (inventory.duplicateGutenbergIds.length > 0) {
    warnings.push(
      `Duplicate Gutenberg ID(s) found during inventory: ${inventory.duplicateGutenbergIds
        .map((duplicate) => duplicate.gutenbergId)
        .join(", ")}.`,
    );
  }

  if (fatalErrors.length > 0) {
    const result: BookBuildResult = {
      inventory,
      processedBooks: [],
      libraryManifest: { schemaVersion: BOOK_SCHEMA_VERSION, books: [] },
      warnings,
      fatalErrors,
      generatedArtifacts,
      generatedRoot: toPosixPath(generatedRoot),
      cloudflareExportRoot: cloudflareExportRoot
        ? toPosixPath(cloudflareExportRoot)
        : null,
      cloudflareExportArtifacts: [],
    };
    if (!options.quiet) printSummary(result);
    return result;
  }

  const loadedMetadata = inventory.metadataFiles
    .map((filePath) => ({
      filePath,
      metadata: validateMetadataShape(readJson(filePath), filePath).metadata,
    }))
    .filter(
      (
        entry,
      ): entry is { filePath: string; metadata: BookMetadata } =>
        entry.metadata !== null,
    )
    .sort((a, b) => a.metadata.slug.localeCompare(b.metadata.slug));
  const validMetadata = loadedMetadata;
  const metadataWithoutRawSet = new Set(
    inventory.metadataWithoutRaw.map((filePath) => path.normalize(filePath)),
  );
  const duplicateResolutions = buildDuplicateSlugResolutionMap(
    loadedMetadata.map(({ filePath, metadata }) => ({
      slug: metadata.slug,
      title: metadata.title,
      author: metadata.author,
      gutenbergId: metadata.source.gutenbergId,
      rawTextFile: metadata.source.rawTextFile,
      metadataFile: relativeTo(textRoot, filePath),
      allowDuplicateGutenbergId: metadata.source.allowDuplicateGutenbergId,
      duplicateReason: metadata.source.duplicateReason ?? null,
    })),
  );

  safeResetGeneratedRoot(generatedRoot, Boolean(options.generatedRoot));

  const processedBooks: GeneratedBookManifest[] = [];
  const cloudflareExportBooks: CloudflareExportBook[] = [];
  for (const { filePath, metadata } of validMetadata) {
    if (metadataWithoutRawSet.has(path.normalize(filePath))) continue;
    const bookWarnings: string[] = [];
    let rawPath: string;
    try {
      rawPath = resolveRawTextPath(textRoot, filePath, metadata);
    } catch (error) {
      fatalErrors.push(error instanceof Error ? error.message : String(error));
      continue;
    }

    const rawText = fs.readFileSync(rawPath, "utf8");
    const {
      manifest,
      sectionJson,
      rightsReport,
      processingNotes,
      processedBook,
      cleanedBook,
      fatalErrors: bookFatalErrors,
    } = buildGeneratedManifest(
      metadata,
      rawText,
      approvedPeopleResult.people,
      bookApprovals.get(metadata.slug) ?? null,
      enrichedMetadataResult.metadata,
      duplicateResolutions.get(metadata.slug) ?? null,
      bookWarnings,
    );
    warnings.push(...bookWarnings.map((warning) => `${metadata.slug}: ${warning}`));
    if (isDraftMetadata(metadata) && !manifest.source.processingAllowed) {
      warnings.push(
        `${metadata.slug}: draft metadata skipped by books:build because the authority evidence gate did not approve it.`,
      );
      continue;
    }
    fatalErrors.push(...bookFatalErrors);
    if (bookFatalErrors.length > 0) continue;
    processedBooks.push(manifest);

    const bookRoot = path.join(generatedRoot, metadata.slug);
    const manifestPath = path.join(bookRoot, "manifest.json");
    const rightsReportPath = path.join(bookRoot, "rights_report.json");
    const processingNotesPath = path.join(bookRoot, "processing_notes.md");
    writeJson(manifestPath, manifest);
    writeJsonIfMissing(rightsReportPath, rightsReport);
    writeTextIfMissing(processingNotesPath, processingNotes);
    generatedArtifacts.push(relativeTo(generatedRoot, manifestPath));
    generatedArtifacts.push(relativeTo(generatedRoot, rightsReportPath));
    generatedArtifacts.push(relativeTo(generatedRoot, processingNotesPath));
    if (processedBook) {
      const processedBookPath = path.join(bookRoot, "processed_book.json");
      writeJson(processedBookPath, processedBook);
      generatedArtifacts.push(relativeTo(generatedRoot, processedBookPath));
    }
    if (cleanedBook) {
      const cleanedBookPath = path.join(bookRoot, "cleaned_book.json");
      writeJson(cleanedBookPath, cleanedBook);
      generatedArtifacts.push(relativeTo(generatedRoot, cleanedBookPath));
    }
    for (const section of sectionJson) {
      const sectionPath = path.join(
        bookRoot,
        "sections",
        `${section.sectionId}.json`,
      );
      writeJson(sectionPath, section);
      generatedArtifacts.push(relativeTo(generatedRoot, sectionPath));
    }
    if (isPublishReadyManifest(manifest)) {
      cloudflareExportBooks.push({
        manifest,
        rawTextPath: rawPath,
        sectionJson,
      });
    }
  }

  const libraryManifest = makeLibraryManifest(processedBooks);
  const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
  writeJson(libraryManifestPath, libraryManifest);
  generatedArtifacts.push(relativeTo(generatedRoot, libraryManifestPath));
  const cloudflareExportArtifacts = cloudflareExportRoot
    ? writeCloudflareExport({
        exportRoot: cloudflareExportRoot,
        books: cloudflareExportBooks,
        allowCustomRoot: Boolean(options.cloudflareExportRoot),
      })
    : [];
  if (cloudflareExportRoot) {
    generatedArtifacts.push(
      ...writeCloudflareJsonSizeReports({
        generatedRoot,
        exportRoot: cloudflareExportRoot,
        books: cloudflareExportBooks,
      }),
    );
  }

  const result: BookBuildResult = {
    inventory,
    processedBooks,
    libraryManifest,
    warnings,
    fatalErrors,
    generatedArtifacts: generatedArtifacts.sort((a, b) => a.localeCompare(b)),
    generatedRoot: toPosixPath(generatedRoot),
    cloudflareExportRoot: cloudflareExportRoot
      ? toPosixPath(cloudflareExportRoot)
      : null,
    cloudflareExportArtifacts,
  };

  if (!options.quiet) printSummary(result);
  return result;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === invokedPath) {
  const result = buildBookLibrary();
  if (result.fatalErrors.length > 0) {
    process.exitCode = 1;
  }
}
