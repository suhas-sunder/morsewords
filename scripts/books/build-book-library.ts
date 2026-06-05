import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import type {
  BookCleanupRule,
  BookMetadata,
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";
import {
  BOOK_SCHEMA_VERSION,
  RIGHTS_BASES,
  SECTION_KINDS,
} from "./bookManifestTypes.ts";
import { validateBookRights } from "./bookRightsValidation.ts";
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
  generatedRoot?: string;
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
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_TEXT_ROOT = path.join(DEFAULT_REPO_ROOT, "app/client/assets/text");
const DEFAULT_METADATA_ROOT = path.join(DEFAULT_TEXT_ROOT, "meta");
const DEFAULT_GENERATED_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/generated",
);

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
  fs.rmSync(generatedRoot, { recursive: true, force: true });
  fs.mkdirSync(generatedRoot, { recursive: true });
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
  warnings: string[],
): {
  manifest: GeneratedBookManifest;
  sectionJson: GeneratedBookSectionJson[];
  fatalErrors: string[];
} {
  const cleaning = cleanGutenbergText(rawText);
  const cleanedText = trimBookText(
    applyCleanupRules(
      cleaning.cleanedText,
      metadata.cleanupRules,
      warnings,
    ),
  );
  const sectionsResult = detectBookSections(cleanedText, metadata);
  warnings.push(...cleaning.report.warnings, ...sectionsResult.warnings);
  const rights = validateBookRights(metadata);
  warnings.push(...rights.warnings);
  const fatalErrors: string[] = [];

  if (!cleanedText) {
    fatalErrors.push(`${metadata.slug}: cleaner produced no body text.`);
  }

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

  const manifest: GeneratedBookManifest = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    slug: metadata.slug,
    title: metadata.title,
    author: metadata.author,
    language: metadata.language,
    description: metadata.description,
    subjects: metadata.subjects,
    source: {
      provider: metadata.source.provider,
      gutenbergId: metadata.source.gutenbergId,
      releaseDate: metadata.source.releaseDate,
      rightsBasis: metadata.source.rightsBasis,
      rightsReviewed: metadata.source.rightsReviewed,
      publishReady: rights.publishReady,
      rightsNotes: metadata.source.rightsNotes,
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

  return { manifest, sectionJson, fatalErrors };
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
  console.log(`Raw files without metadata: ${inventory.rawWithoutMetadata.length}`);
  console.log(`Metadata files without raw text: ${inventory.metadataWithoutRaw.length}`);
  console.log(`Duplicate slugs: ${inventory.duplicateSlugs.length}`);
  console.log(`Duplicate Gutenberg IDs: ${inventory.duplicateGutenbergIds.length}`);
  console.log(`Generated output: ${generatedRoot}`);

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
  const generatedRoot = path.resolve(options.generatedRoot ?? DEFAULT_GENERATED_ROOT);
  const inventory = scanBookInventory({ textRoot, metadataRoot });
  const warnings: string[] = [];
  const fatalErrors: string[] = [];
  const generatedArtifacts: string[] = [];

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
    };
    if (!options.quiet) printSummary(result);
    return result;
  }

  const validMetadata = inventory.metadataFiles
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

  safeResetGeneratedRoot(generatedRoot, Boolean(options.generatedRoot));

  const processedBooks: GeneratedBookManifest[] = [];
  for (const { filePath, metadata } of validMetadata) {
    const bookWarnings: string[] = [];
    let rawPath: string;
    try {
      rawPath = resolveRawTextPath(textRoot, filePath, metadata);
    } catch (error) {
      fatalErrors.push(error instanceof Error ? error.message : String(error));
      continue;
    }

    const rawText = fs.readFileSync(rawPath, "utf8");
    const { manifest, sectionJson, fatalErrors: bookFatalErrors } = buildGeneratedManifest(
      metadata,
      rawText,
      bookWarnings,
    );
    fatalErrors.push(...bookFatalErrors);
    warnings.push(...bookWarnings.map((warning) => `${metadata.slug}: ${warning}`));
    if (bookFatalErrors.length > 0) continue;
    processedBooks.push(manifest);

    const bookRoot = path.join(generatedRoot, metadata.slug);
    const manifestPath = path.join(bookRoot, "manifest.json");
    writeJson(manifestPath, manifest);
    generatedArtifacts.push(relativeTo(generatedRoot, manifestPath));
    for (const section of sectionJson) {
      const sectionPath = path.join(
        bookRoot,
        "sections",
        `${section.sectionId}.json`,
      );
      writeJson(sectionPath, section);
      generatedArtifacts.push(relativeTo(generatedRoot, sectionPath));
    }
  }

  const libraryManifest = makeLibraryManifest(processedBooks);
  const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
  writeJson(libraryManifestPath, libraryManifest);
  generatedArtifacts.push(relativeTo(generatedRoot, libraryManifestPath));

  const result: BookBuildResult = {
    inventory,
    processedBooks,
    libraryManifest,
    warnings,
    fatalErrors,
    generatedArtifacts: generatedArtifacts.sort((a, b) => a.localeCompare(b)),
    generatedRoot: toPosixPath(generatedRoot),
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
