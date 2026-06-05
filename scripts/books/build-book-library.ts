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
  duplicateGutenbergIds: string[];
  invalidMetadata: Array<{ filePath: string; errors: string[] }>;
};

export type BookBuildResult = {
  inventory: BookInventory;
  processedBooks: GeneratedBookManifest[];
  libraryManifest: GeneratedLibraryManifest;
  warnings: string[];
  fatalErrors: string[];
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
    if (
      raw.source.gutenbergId !== null &&
      typeof raw.source.gutenbergId !== "string"
    ) {
      errors.push("source.gutenbergId must be a string or null.");
    }
    validateString(raw.source.rawTextFile, "source.rawTextFile", errors);
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
  }

  if (!isPlainObject(raw.defaults)) {
    errors.push("defaults must be an object.");
  } else {
    validateSectionKindArray(raw.defaults.includeKinds, "defaults.includeKinds", errors);
    validateSectionKindArray(raw.defaults.excludeKinds, "defaults.excludeKinds", errors);
    validateString(raw.defaults.preferredPreset, "defaults.preferredPreset", errors);
  }

  if (!Array.isArray(raw.sectionOverrides)) {
    errors.push("sectionOverrides must be an array.");
  }
  if (!Array.isArray(raw.cleanupRules)) {
    errors.push("cleanupRules must be an array.");
  }

  if (errors.length > 0) {
    return {
      metadata: null,
      errors: errors.map((error) => `${path.basename(filePath)}: ${error}`),
    };
  }

  return { metadata: raw as BookMetadata, errors: [] };
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
      const flags = rule.flags ?? "g";
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
    .filter(({ rawPath }) => !fs.existsSync(rawPath))
    .map(({ filePath }) => filePath);

  const rawGutenbergIds = rawTextFiles.map((filePath) => {
    try {
      return readGutenbergIdFromRaw(filePath);
    } catch {
      return null;
    }
  });
  const duplicateGutenbergIds = [
    ...duplicateValues(rawGutenbergIds),
    ...duplicateValues(validMetadata.map(({ metadata }) => metadata.source.gutenbergId)),
  ];

  return {
    rawTextFiles,
    metadataFiles,
    rawWithoutMetadata,
    metadataWithoutRaw,
    duplicateSlugs: duplicateValues(
      validMetadata.map(({ metadata }) => metadata.slug),
    ),
    duplicateGutenbergIds: [...new Set(duplicateGutenbergIds)].sort((a, b) =>
      a.localeCompare(b),
    ),
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
    sourceOffsets: {
      start: section.sourceStartOffset,
      end: section.sourceEndOffset,
    },
  }));

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
      textPreview: trimBookText(section.displayText).replace(/\s+/g, " ").slice(0, 160),
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

  return { manifest, sectionJson };
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

function printSummary(result: BookBuildResult): void {
  const { inventory, processedBooks, warnings, fatalErrors, generatedRoot } = result;
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

  for (const invalid of inventory.invalidMetadata) {
    fatalErrors.push(...invalid.errors);
  }
  for (const slug of inventory.duplicateSlugs) {
    fatalErrors.push(`Duplicate metadata slug: ${slug}.`);
  }
  for (const id of duplicateValues(
    inventory.metadataFiles.flatMap((filePath) => {
      try {
        const { metadata } = validateMetadataShape(readJson(filePath), filePath);
        return metadata?.source.gutenbergId ?? [];
      } catch {
        return [];
      }
    }),
  )) {
    fatalErrors.push(`Duplicate metadata Gutenberg ID: ${id}.`);
  }
  for (const metadataPath of inventory.metadataWithoutRaw) {
    fatalErrors.push(`Metadata raw text file is missing: ${metadataPath}.`);
  }

  if (inventory.rawWithoutMetadata.length > 0) {
    warnings.push(
      `${inventory.rawWithoutMetadata.length} raw text file(s) do not have metadata yet.`,
    );
  }
  if (inventory.duplicateGutenbergIds.length > 0) {
    warnings.push(
      `Duplicate Gutenberg ID(s) found during inventory: ${inventory.duplicateGutenbergIds.join(", ")}.`,
    );
  }

  if (fatalErrors.length > 0) {
    const result: BookBuildResult = {
      inventory,
      processedBooks: [],
      libraryManifest: { schemaVersion: BOOK_SCHEMA_VERSION, books: [] },
      warnings,
      fatalErrors,
      generatedRoot,
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
    const { manifest, sectionJson } = buildGeneratedManifest(
      metadata,
      rawText,
      bookWarnings,
    );
    warnings.push(...bookWarnings.map((warning) => `${metadata.slug}: ${warning}`));
    processedBooks.push(manifest);

    const bookRoot = path.join(generatedRoot, metadata.slug);
    writeJson(path.join(bookRoot, "manifest.json"), manifest);
    for (const section of sectionJson) {
      writeJson(
        path.join(bookRoot, "sections", `${section.sectionId}.json`),
        section,
      );
    }
  }

  const libraryManifest = makeLibraryManifest(processedBooks);
  writeJson(path.join(generatedRoot, "library-manifest.json"), libraryManifest);

  const result: BookBuildResult = {
    inventory,
    processedBooks,
    libraryManifest,
    warnings,
    fatalErrors,
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
