import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ExportPublicManifest = {
  schemaVersion: 1;
  books: Array<{
    slug: string;
    title: string;
    author: string[];
    source?: Record<string, unknown>;
    stats: { wordCount: number; sectionCount: number };
    bookPath: string;
  }>;
};

type ExportBook = {
  schemaVersion: 1;
  slug: string;
  title: string;
  author: string[];
  source?: Record<string, unknown>;
  stats: { wordCount: number; sectionCount: number };
  manifest: {
    title: string;
    author: string[];
    source?: Record<string, unknown>;
    stats: { wordCount: number; sectionCount: number };
  };
  sections: Array<{
    title?: string;
    content?: string;
    text?: string;
    morseSourceText?: string;
    displayText?: string;
  }>;
};

type RepresentativeCheck = {
  slug: string;
  role: string;
  result: "pass" | "fail";
  notes: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const EXPORT_ROOT = path.join(REPO_ROOT, "app/client/assets/books/cloudflare-export");
const EXPECTED_COUNT = 519;
const DEFAULT_REMOTE_BASE_URL = "https://assets.morsewords.com";
const BAD_LABELS = [
  "Unknown author",
  "Unknown source",
  "Source unavailable",
  "Metadata unavailable",
  "0 sections",
  "Sections: 0",
];

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function normalizeBaseUrl(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim().replace(/\/+$/, "")
    : "";
}

function contentText(book: ExportBook) {
  return book.sections
    .map(
      (section) =>
        section.morseSourceText ??
        section.displayText ??
        section.content ??
        section.text ??
        "",
    )
    .filter((value) => value.trim().length > 0)
    .join("\n\n");
}

function hasBadLabel(value: unknown) {
  const text = JSON.stringify(value);
  return BAD_LABELS.some((label) => text.includes(label));
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

function compareBook(
  local: ExportBook,
  remote: ExportBook,
  role: string,
): RepresentativeCheck {
  const notes: string[] = [];
  if (remote.schemaVersion !== 1) notes.push("remote schemaVersion is not 1");
  if (remote.slug !== local.slug) notes.push("remote slug does not match local");
  if (remote.title !== local.title) notes.push("remote title does not match local");
  if (JSON.stringify(remote.author) !== JSON.stringify(local.author)) {
    notes.push("remote author does not match local");
  }
  if (remote.stats.sectionCount !== local.stats.sectionCount) {
    notes.push("remote section count does not match local");
  }
  if (remote.stats.wordCount !== local.stats.wordCount) {
    notes.push("remote word count does not match local");
  }
  if (!Array.isArray(remote.sections) || remote.sections.length !== local.sections.length) {
    notes.push("remote section array does not match local section length");
  }
  if (contentText(remote).trim().length < 200) {
    notes.push("remote payload does not contain enough readable full content");
  }
  if (hasBadLabel(remote)) notes.push("remote payload contains a blocked public label");

  return {
    slug: local.slug,
    role,
    result: notes.length === 0 ? "pass" : "fail",
    notes,
  };
}

async function main() {
  const baseUrl = normalizeBaseUrl(DEFAULT_REMOTE_BASE_URL);

  const localManifest = readJson<ExportPublicManifest>(
    path.join(EXPORT_ROOT, "public-manifest.json"),
  );
  const remoteManifest = await fetchJson<ExportPublicManifest>(
    `${baseUrl}/public-manifest.json`,
  );

  const blockers: string[] = [];
  if (remoteManifest.schemaVersion !== 1) blockers.push("remote manifest schemaVersion is not 1");
  if (remoteManifest.books.length !== EXPECTED_COUNT) {
    blockers.push(`remote manifest has ${remoteManifest.books.length} books, expected ${EXPECTED_COUNT}`);
  }

  const localSlugs = new Set(localManifest.books.map((book) => book.slug));
  const remoteSlugs = new Set(remoteManifest.books.map((book) => book.slug));
  const missingRemote = [...localSlugs].filter((slug) => !remoteSlugs.has(slug)).sort();
  const extraRemote = [...remoteSlugs].filter((slug) => !localSlugs.has(slug)).sort();
  if (missingRemote.length) blockers.push(`remote manifest is missing ${missingRemote.length} slugs`);
  if (extraRemote.length) blockers.push(`remote manifest has ${extraRemote.length} extra slugs`);
  if (hasBadLabel(remoteManifest)) blockers.push("remote manifest contains a blocked public label");

  const representativeRoles = new Map([
    ["middlemarch", "long work"],
    ["the-bottle-imp", "short story"],
    ["the-masque-of-the-red-death", "Poe story"],
    ["the-happy-prince", "Wilde story"],
    ["the-leavenworth-case", "39-section check"],
    ["walden", "18-section check"],
  ]);

  const representativeChecks: RepresentativeCheck[] = [];
  for (const [slug, role] of representativeRoles) {
    const summary = localManifest.books.find((book) => book.slug === slug);
    if (!summary) {
      representativeChecks.push({ slug, role, result: "fail", notes: ["local slug is missing"] });
      continue;
    }
    const localBook = readJson<ExportBook>(path.join(EXPORT_ROOT, summary.bookPath));
    const remoteBook = await fetchJson<ExportBook>(`${baseUrl}/${summary.bookPath}`);
    representativeChecks.push(compareBook(localBook, remoteBook, role));
  }

  for (const check of representativeChecks) {
    if (check.result === "fail") {
      blockers.push(`${check.slug}: ${check.notes.join("; ")}`);
    }
  }

  console.log("Cloudflare post-upload validation complete.");
  console.log(`Remote base URL: ${baseUrl}`);
  console.log(`Remote manifest books: ${remoteManifest.books.length}`);
  console.log(`Missing remote slugs: ${missingRemote.length}`);
  console.log(`Extra remote slugs: ${extraRemote.length}`);
  console.log(`Representative checks: ${representativeChecks.filter((check) => check.result === "pass").length}/${representativeChecks.length} pass`);
  console.log(`Blockers: ${blockers.length}`);

  if (blockers.length) {
    for (const blocker of blockers) console.error(`- ${blocker}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
