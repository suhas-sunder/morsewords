import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
} from "./bookManifestTypes.ts";

const TARGET_RUNTIME_SECONDS = 3_600;
const PREVIEW_BASE_PATH = "/book-previews";

type PublicBookSummary = {
  slug: string;
  contentVersion: string;
  contentHash: string;
  bookPath: string;
};

type PublicManifest = {
  schemaVersion: 1;
  contentVersion: string;
  contentHash: string;
  books: PublicBookSummary[];
};

type PublicContentJson = {
  schemaVersion: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  manifest: GeneratedBookManifest;
  sections: GeneratedBookSectionJson[];
};

type BookPreviewAsset = {
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

type BookPreviewManifest = {
  version: 1;
  assetBasePath: string;
  targetRuntimeSeconds: number;
  books: Array<{
    slug: string;
    path: string;
    contentVersion: string;
    contentHash: string;
    defaultSectionId: string;
    previewBytes: number;
    previewCharacterCount: number;
    estimatedRuntimeSeconds: number;
    truncated: boolean;
  }>;
  missing: Array<{
    slug: string;
    reason: string;
  }>;
};

type BookSectionSummary = GeneratedBookManifest["sections"][number];

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const cloudflareExportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-export",
);
const publicPreviewRoot = path.join(repoRoot, "public", "book-previews");
const publicManifestPath = path.join(cloudflareExportRoot, "public-manifest.json");

function readJson<T>(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function assertSafePreviewRoot() {
  const resolvedRoot = path.resolve(publicPreviewRoot);
  const publicRoot = path.resolve(repoRoot, "public");
  if (
    resolvedRoot !== path.join(publicRoot, "book-previews") ||
    !resolvedRoot.startsWith(`${publicRoot}${path.sep}`)
  ) {
    throw new Error(`Unsafe preview output directory: ${resolvedRoot}`);
  }
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function compactTextPreview(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 180);
}

const defaultReadableExcludedSectionKinds = new Set<BookSectionKind>([
  "title-page",
  "dedication",
  "epigraph",
  "preface",
  "introduction",
  "epilogue",
  "appendix",
  "notes",
  "glossary",
  "index",
  "transcriber-note",
  "source-license",
  "advertisement",
]);

const asideDefaultNameExclusionPattern =
  /\b(table of contents|contents|list of illustrations|illustrations?|title page|copyright|license|source|publisher|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter)\b/;

const asideDefaultEvidenceExclusionPattern =
  /\b(project gutenberg|gutenberg|transcriber|produced by|production note|copyright|license|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter)\b/;

function normalizedSectionText(
  ...parts: Array<string | null | undefined>
) {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function sectionEvidenceText(section: BookSectionSummary) {
  return normalizedSectionText(
    section.label,
    section.title,
    section.textPreview,
  );
}

function sectionNameText(section: BookSectionSummary) {
  return normalizedSectionText(section.label, section.title);
}

function isDefaultReadableBookSection(section: BookSectionSummary) {
  if (defaultReadableExcludedSectionKinds.has(section.kind)) return false;

  const nameText = sectionNameText(section);
  if (asideDefaultNameExclusionPattern.test(nameText)) return false;

  const labelText = sectionEvidenceText(section);
  if (asideDefaultEvidenceExclusionPattern.test(labelText)) return false;

  const earlySection = section.order <= 4;
  if (earlySection && section.wordCount < 35) return false;
  if (
    earlySection &&
    section.wordCount < 90 &&
    /\b(cover|frontispiece|by\s+[a-z]|published|copyright|all rights reserved)\b/.test(
      labelText,
    )
  ) {
    return false;
  }

  return section.wordCount > 0;
}

function getDefaultPreviewSectionIds(
  book: GeneratedBookManifest,
  fallbackSectionId: string,
) {
  const readable = book.sections
    .filter((section) => isDefaultReadableBookSection(section))
    .map((section) => section.id);
  if (readable.length > 0) return readable;

  const included = book.sections
    .filter((section) => section.includeByDefault)
    .map((section) => section.id);
  return included.length > 0 ? included : [fallbackSectionId];
}

function clampBoundary(text: string, targetLength: number) {
  if (text.length <= targetLength) return text.trim();

  const minBoundary = Math.max(0, Math.floor(targetLength * 0.72));
  const maxBoundary = Math.min(text.length, Math.floor(targetLength * 1.08));
  const searchWindow = text.slice(minBoundary, maxBoundary);
  const paragraphBreak = searchWindow.lastIndexOf("\n\n");
  if (paragraphBreak > 0) {
    return text.slice(0, minBoundary + paragraphBreak).trim();
  }

  const sentenceMatch = [...searchWindow.matchAll(/[.!?]["')\]]?\s+/g)].at(-1);
  if (sentenceMatch?.index !== undefined) {
    return text.slice(0, minBoundary + sentenceMatch.index + sentenceMatch[0].length).trim();
  }

  const whitespace = text.lastIndexOf(" ", targetLength);
  if (whitespace > minBoundary) return text.slice(0, whitespace).trim();

  return text.slice(0, targetLength).trim();
}

function previewTextForSection(section: GeneratedBookSectionJson) {
  const text = (section.morseSourceText || section.displayText).trim();
  if (!text) return "";

  const estimatedRuntimeSeconds = Math.max(
    1,
    Math.round(section.estimatedListeningMinutes * 60),
  );
  if (estimatedRuntimeSeconds <= TARGET_RUNTIME_SECONDS) return text;

  const ratio = TARGET_RUNTIME_SECONDS / estimatedRuntimeSeconds;
  const targetLength = Math.max(1, Math.floor(text.length * ratio));
  return clampBoundary(text, targetLength);
}

function buildPreviewAsset(
  content: PublicContentJson,
): BookPreviewAsset | null {
  const fallbackSectionId = content.manifest.sections[0]?.id ?? "";
  if (!fallbackSectionId) return null;

  const defaultSectionId =
    getDefaultPreviewSectionIds(content.manifest, fallbackSectionId)[0] ?? "";
  if (!defaultSectionId) return null;

  const sectionSummary =
    content.manifest.sections.find((section) => section.id === defaultSectionId) ??
    null;
  const section =
    content.sections.find((candidate) => candidate.sectionId === defaultSectionId) ??
    null;
  if (!sectionSummary || !section) return null;

  const previewText = previewTextForSection(section);
  if (!previewText) return null;

  const ratio = Math.min(
    1,
    Math.max(0, previewText.length / Math.max(1, section.morseSourceText.length)),
  );
  const estimatedRuntimeSeconds = Math.max(
    1,
    Math.round(section.estimatedListeningMinutes * 60 * ratio),
  );
  const wordCount = countWords(previewText);

  return {
    version: 1,
    slug: content.slug,
    contentVersion: content.contentVersion,
    contentHash: content.contentHash,
    defaultSectionId,
    defaultSectionKind: sectionSummary.kind,
    defaultSectionLabel: sectionSummary.label,
    defaultSectionTitle: sectionSummary.title,
    previewText,
    estimatedRuntimeSeconds,
    wordCount,
    characterCount: previewText.length,
    estimatedTypingMinutes: Math.max(1, Math.ceil(wordCount / 40)),
    estimatedListeningMinutes: Math.max(1, Math.ceil(estimatedRuntimeSeconds / 60)),
    morseCharacterEstimate: Math.max(
      1,
      Math.round(section.morseCharacterEstimate * ratio),
    ),
    textPreview: compactTextPreview(previewText),
    truncated: previewText.length < section.morseSourceText.trim().length,
  };
}

function previewFileName(slug: string) {
  return `${slug}.preview.json`;
}

function main() {
  assertSafePreviewRoot();
  const publicManifest = readJson<PublicManifest>(publicManifestPath);
  fs.rmSync(publicPreviewRoot, { recursive: true, force: true });
  fs.mkdirSync(publicPreviewRoot, { recursive: true });

  const manifestEntries: BookPreviewManifest["books"] = [];
  const missing: BookPreviewManifest["missing"] = [];

  for (const book of publicManifest.books) {
    try {
      const contentPath = path.join(cloudflareExportRoot, book.bookPath);
      const content = readJson<PublicContentJson>(contentPath);
      if (
        content.slug !== book.slug ||
        content.contentVersion !== book.contentVersion ||
        content.contentHash !== book.contentHash
      ) {
        missing.push({
          slug: book.slug,
          reason: "Public content does not match the public manifest.",
        });
        continue;
      }

      const preview = buildPreviewAsset(content);
      if (!preview) {
        missing.push({
          slug: book.slug,
          reason: "No safe default-readable section could be previewed.",
        });
        continue;
      }

      const fileName = previewFileName(book.slug);
      const filePath = path.join(publicPreviewRoot, fileName);
      writeJson(filePath, preview);
      const previewBytes = fs.statSync(filePath).size;
      manifestEntries.push({
        slug: book.slug,
        path: `${PREVIEW_BASE_PATH}/${fileName}`,
        contentVersion: preview.contentVersion,
        contentHash: preview.contentHash,
        defaultSectionId: preview.defaultSectionId,
        previewBytes,
        previewCharacterCount: preview.characterCount,
        estimatedRuntimeSeconds: preview.estimatedRuntimeSeconds,
        truncated: preview.truncated,
      });
    } catch (error) {
      missing.push({
        slug: book.slug,
        reason: error instanceof Error ? error.message : "Unknown preview error.",
      });
    }
  }

  const manifest: BookPreviewManifest = {
    version: 1,
    assetBasePath: PREVIEW_BASE_PATH,
    targetRuntimeSeconds: TARGET_RUNTIME_SECONDS,
    books: manifestEntries,
    missing,
  };
  const manifestPath = path.join(publicPreviewRoot, "manifest.json");
  writeJson(manifestPath, manifest);

  const totalBytes = fs
    .readdirSync(publicPreviewRoot)
    .filter((fileName) => fileName.endsWith(".json"))
    .reduce(
      (sum, fileName) => sum + fs.statSync(path.join(publicPreviewRoot, fileName)).size,
      0,
    );
  const digest = crypto
    .createHash("sha256")
    .update(JSON.stringify(manifestEntries.map((entry) => entry.contentHash)))
    .digest("hex")
    .slice(0, 12);

  console.log(
    `Built ${manifestEntries.length} book previews (${totalBytes} bytes, manifest ${digest}).`,
  );
  if (missing.length > 0) {
    console.log(`Missing or unsafe previews: ${missing.length}`);
    missing.forEach((entry) => console.log(`- ${entry.slug}: ${entry.reason}`));
  }
}

main();
