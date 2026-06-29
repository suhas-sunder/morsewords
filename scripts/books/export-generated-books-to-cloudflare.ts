import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import type {
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";
import { BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";

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

type ExportResult = {
  exportRoot: string;
  generatedRoot: string;
  bookCount: number;
  files: string[];
  contentVersion: string;
  contentHash: string;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const GENERATED_ROOT = path.join(REPO_ROOT, "app/client/assets/books/generated");
const EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-export",
);
const OUTPUT_NEWLINE = process.platform === "win32" ? "\r\n" : "\n";

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const json = JSON.stringify(value, null, 2).replace(/\n/g, OUTPUT_NEWLINE);
  fs.writeFileSync(filePath, `${json}${OUTPUT_NEWLINE}`, "utf8");
}

function sha256Json(value: unknown): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function isPublishReadyManifest(manifest: GeneratedBookManifest): boolean {
  return (
    manifest.source.publishReady === true &&
    manifest.source.rightsStatus === "approved" &&
    manifest.source.processingAllowed === true
  );
}

function safeResetExportRoot(exportRoot: string): void {
  const normalized = path.normalize(exportRoot);
  const parsedRoot = path.parse(normalized).root;
  if (normalized === parsedRoot || normalized.length < parsedRoot.length + 8) {
    throw new Error(`Refusing to reset unsafe Cloudflare export root: ${exportRoot}`);
  }
  if (
    !normalized.endsWith(
      path.normalize("app/client/assets/books/cloudflare-export"),
    )
  ) {
    throw new Error(`Refusing to reset unexpected Cloudflare export root: ${exportRoot}`);
  }

  fs.rmSync(exportRoot, { recursive: true, force: true });
  fs.mkdirSync(exportRoot, { recursive: true });
}

function loadBookManifest(summaryPath: string): GeneratedBookManifest {
  return readJson<GeneratedBookManifest>(path.join(GENERATED_ROOT, summaryPath));
}

function loadBookSections(manifest: GeneratedBookManifest): GeneratedBookSectionJson[] {
  return manifest.sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((section) =>
      readJson<GeneratedBookSectionJson>(
        path.join(GENERATED_ROOT, manifest.slug, section.sectionJsonPath),
      ),
    );
}

function makeExportBook(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): CloudflareExportBookJson {
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
    sections,
  };
  const contentHash = sha256Json(bookWithoutExportHash);
  return {
    ...bookWithoutExportHash,
    contentVersion: contentHash.slice(0, 16),
    contentHash,
  };
}

export function exportGeneratedBooksToCloudflare(): ExportResult {
  const libraryManifest = readJson<GeneratedLibraryManifest>(
    path.join(GENERATED_ROOT, "library-manifest.json"),
  );
  const books = libraryManifest.books
    .map((book) => {
      const manifest = loadBookManifest(book.manifestPath);
      return {
        manifest,
        sections: loadBookSections(manifest),
      };
    })
    .filter(({ manifest }) => isPublishReadyManifest(manifest))
    .sort((a, b) => a.manifest.title.localeCompare(b.manifest.title));

  const exportBooks = books.map(({ manifest, sections }) =>
    makeExportBook(manifest, sections),
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

  safeResetExportRoot(EXPORT_ROOT);

  const writeExportJson = (relativePath: string, value: unknown) => {
    writeJson(path.join(EXPORT_ROOT, ...relativePath.split("/")), value);
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

  const bookFiles = manifestBooks
    .map((book) => book.bookPath)
    .sort((a, b) => a.localeCompare(b));
  const uploadFiles = [...artifacts, "upload-manifest.json"].sort((a, b) =>
    a.localeCompare(b),
  );

  writeExportJson("upload-manifest.json", {
    schemaVersion: BOOK_SCHEMA_VERSION,
    contentVersion,
    contentHash,
    approvedBookCount: manifestBooks.length,
    sourceFolder: "app/client/assets/books/cloudflare-export/",
    requiredFiles: [
      {
        sourcePath: "public-manifest.json",
        destinationPath: "public-manifest.json",
      },
      {
        sourcePath: "upload-manifest.json",
        destinationPath: "upload-manifest.json",
      },
      {
        sourcePath: "books/*.json",
        destinationPath: "books/*.json",
      },
    ],
    bookFiles,
    files: uploadFiles,
    destinationObjectPaths: uploadFiles,
    runtimeBaseUrlEnvVars: [
      "VITE_MORSE_BOOK_CONTENT_BASE_URL",
      "PUBLIC_MORSE_BOOK_CONTENT_BASE_URL",
    ],
    exampleUrls: {
      publicManifest: "<CLOUDFLARE_BOOKS_BASE_URL>/public-manifest.json",
      bookJson: "<CLOUDFLARE_BOOKS_BASE_URL>/books/<slug>.json",
    },
    doNotUpload: [
      "app/client/assets/temp-books/",
      "app/client/assets/asdf/",
      "app/client/assets/text/*.txt",
      "app/client/assets/books/generated/review/",
      "generated MP3/WAV/WebM/MP4/PDF/ZIP files",
    ],
    mediaFilesIncluded: false,
    notes: [
      "Upload the contents of sourceFolder with these relative object paths preserved.",
      "The runtime trims a trailing slash from the configured base URL.",
      "If no base URL is configured, the app uses the committed local fallback route.",
    ],
  });

  return {
    exportRoot: toPosixPath(path.relative(REPO_ROOT, EXPORT_ROOT)),
    generatedRoot: toPosixPath(path.relative(REPO_ROOT, GENERATED_ROOT)),
    bookCount: exportBooks.length,
    files: uploadFiles,
    contentVersion,
    contentHash,
  };
}

const result = exportGeneratedBooksToCloudflare();
console.log("Cloudflare export refreshed from generated books.");
console.log(`Generated input: ${result.generatedRoot}`);
console.log(`Export output: ${result.exportRoot}`);
console.log(`Book payloads: ${result.bookCount}`);
console.log(`Export files: ${result.files.length}`);
console.log(`Content version: ${result.contentVersion}`);
