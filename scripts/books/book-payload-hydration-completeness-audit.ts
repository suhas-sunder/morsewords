import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryBookSummary,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

type ExportPublicManifest = {
  schemaVersion: 1;
  books: Array<{
    slug: string;
    title: string;
    author: string[];
    bookPath: string;
    contentVersion: string;
    contentHash: string;
    stats: GeneratedBookManifest["stats"];
    source: Partial<GeneratedBookManifest["source"]>;
  }>;
};

type ExportBookPayload = {
  schemaVersion: 1;
  slug: string;
  title: string;
  author: string[];
  contentVersion: string;
  contentHash: string;
  stats: GeneratedBookManifest["stats"];
  manifest: GeneratedBookManifest;
  sections: GeneratedBookSectionJson[];
};

type StartupPreview = {
  version: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionLabel: string;
  defaultSectionTitle: string | null;
  previewText: string;
  truncated: boolean;
  wordCount: number;
  characterCount: number;
};

type SlugCheck = {
  slug: string;
  live: boolean;
  generatedTitle: string | null;
  generatedSections: number | null;
  generatedWords: number | null;
  previewPresent: boolean;
  previewCharacters: number | null;
  exportPresent: boolean;
  exportSections: number | null;
  exportWords: number | null;
  exportCharacters: number | null;
  fullPayloadLongerThanPreview: boolean | null;
  routeShouldShowUnavailable: boolean;
  notes: string[];
};

type SuspiciousSectionResult = {
  slug: string;
  title: string;
  sectionCount: number;
  wordCount: number;
  warnings: string[];
};

type AuditReport = {
  schemaVersion: 1;
  reportName: "book-payload-hydration-completeness-blocker";
  generatedAt: string;
  branch: "morsewords-book-payload-hydration-completeness-blocker-jun-2026";
  executiveResult: string;
  ownerObservedFailures: string[];
  localServedExportSetup: {
    exportDirectory: string;
    baseUrlUsedForLocalRouteValidation: string;
    note: string;
  };
  fullPayloadHydrationResult: {
    result: "pass" | "blocked";
    generatedLiveBooks: number;
    exportPayloads: number;
    missingExportPayloads: string[];
    extraExportPayloads: string[];
    starterOnlyPayloads: string[];
  };
  starterPreviewFallbackResult: {
    result: "pass" | "blocked";
    startupPreviews: number;
    missingPreviewSlugs: string[];
    note: string;
  };
  bookTextUnavailableStateResult: {
    result: "pass" | "blocked";
    liveSlugsThatWouldRouteUnavailable: string[];
    note: string;
  };
  sectionPickerHydrationResult: {
    result: "pass" | "blocked";
    sectionMismatches: string[];
    note: string;
  };
  suspiciousTruncationChapterOneOnlyAuditResult: {
    result: "pass" | "warning" | "blocked";
    suspiciousBooks: SuspiciousSectionResult[];
    note: string;
  };
  specificSlugResults: SlugCheck[];
  fixesMade: string[];
  remainingBlockers: string[];
  netlifyEnvVarRequired: {
    required: boolean;
    note: string;
  };
  realRemoteCloudflareValidationStatus: {
    status: "blocked" | "not-claimed";
    note: string;
  };
  laterContentQualityCheckpoints: string[];
  deferredFinalStages: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const GENERATED_MANIFEST_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/generated/library-manifest.json",
);
const EXPORT_ROOT = path.join(REPO_ROOT, "app/client/assets/books/cloudflare-export");
const EXPORT_MANIFEST_PATH = path.join(EXPORT_ROOT, "public-manifest.json");
const PREVIEW_ROOT = path.join(REPO_ROOT, "public/book-previews");
const PREVIEW_MANIFEST_PATH = path.join(PREVIEW_ROOT, "manifest.json");
const REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-payload-hydration-completeness-blocker",
);
const REPORT_JSON_PATH = path.join(
  REPORT_ROOT,
  "book-payload-hydration-completeness-blocker.json",
);
const REPORT_MD_PATH = path.join(
  REPORT_ROOT,
  "book-payload-hydration-completeness-blocker.md",
);
const EXPECTED_BOOK_COUNT = 519;
const OUTPUT_NEWLINE = process.platform === "win32" ? "\r\n" : "\n";

const SPECIFIC_SLUGS = [
  "the-call-of-cthulhu",
  "five-little-friends",
  "the-leavenworth-case",
  "walden",
  "the-bottle-imp",
  "middlemarch",
  "the-happy-prince",
  "the-masque-of-the-red-death",
  "the-jungle-book",
  "the-adventures-of-roderick-random",
] as const;

const SECTION_EXPECTATIONS = new Map<string, number>([
  ["the-call-of-cthulhu", 3],
  ["five-little-friends", 2],
  ["the-leavenworth-case", 39],
  ["walden", 18],
  ["the-bottle-imp", 1],
  ["middlemarch", 88],
  ["the-happy-prince", 1],
  ["the-masque-of-the-red-death", 1],
  ["the-jungle-book", 14],
]);

const REMOVED_OR_DEFERRED_SOURCE_RISK_SLUGS = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
  "jabberwocky",
  "the-dream-quest-of-unknown-kadath",
  "the-apple",
  "the-story-of-the-late-mr-elvesham",
] as const;

function toPosixPath(input: string) {
  return input.split(path.sep).join("/");
}

function relativeToRepo(filePath: string) {
  return toPosixPath(path.relative(REPO_ROOT, filePath));
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(value, null, 2).replace(/\n/g, OUTPUT_NEWLINE)}${OUTPUT_NEWLINE}`,
    "utf8",
  );
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const text = value.endsWith("\n") ? value : `${value}\n`;
  fs.writeFileSync(filePath, text.replace(/\n/g, OUTPUT_NEWLINE), "utf8");
}

function listFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(entryPath);
      if (entry.isFile()) files.push(entryPath);
    }
  };
  walk(root);
  return files.sort((a, b) => a.localeCompare(b));
}

function authorLabel(authors: string[] | undefined) {
  return authors?.join(", ") || "Unknown author";
}

function sectionText(section: GeneratedBookSectionJson) {
  return [
    section.displayText,
    section.morseSourceText,
    (section as { content?: string }).content,
    (section as { text?: string }).text,
  ]
    .filter((value): value is string => typeof value === "string")
    .join("\n\n")
    .trim();
}

function payloadText(payload: ExportBookPayload) {
  return payload.sections.map(sectionText).join("\n\n").trim();
}

function sectionLabel(section: GeneratedBookManifest["sections"][number] | undefined) {
  return [section?.label, section?.title].filter(Boolean).join(": ").trim();
}

function previewPathForSlug(slug: string) {
  return path.join(PREVIEW_ROOT, `${slug}.preview.json`);
}

function exportPayloadPathForSlug(slug: string) {
  return path.join(EXPORT_ROOT, "books", `${slug}.json`);
}

function isChapterOneOnlyWarning(
  book: GeneratedLibraryBookSummary,
  payload: ExportBookPayload,
) {
  if (book.stats.sectionCount !== 1 || payload.sections.length !== 1) return false;
  const label = sectionLabel(payload.manifest.sections[0]).toLowerCase();
  return /(?:chapter|part|volume)\s+(?:1|i)\b/.test(label) && book.stats.wordCount > 20_000;
}

function looksMidSentence(text: string) {
  const trimmed = text.trim();
  if (trimmed.length < 2_000) return false;
  const ending = trimmed.slice(-160).trim();
  if (/(?:the end|finis)\.?$/i.test(ending)) return false;
  return !/[.!?]["')\]\u201d\u2019]*$/.test(ending);
}

function buildSlugCheck(
  slug: string,
  generatedBySlug: Map<string, GeneratedLibraryBookSummary>,
  exportBySlug: Map<string, ExportPublicManifest["books"][number]>,
) {
  const generated = generatedBySlug.get(slug) ?? null;
  const previewPath = previewPathForSlug(slug);
  const preview = fs.existsSync(previewPath) ? readJson<StartupPreview>(previewPath) : null;
  const exportSummary = exportBySlug.get(slug) ?? null;
  const payloadPath = exportPayloadPathForSlug(slug);
  const payload = fs.existsSync(payloadPath) ? readJson<ExportBookPayload>(payloadPath) : null;
  const exportCharacters = payload ? payloadText(payload).length : null;
  const notes: string[] = [];
  if (!generated) notes.push("Not present as a live generated slug.");
  if (generated && !preview) notes.push("Missing startup preview.");
  if (generated && !exportSummary) notes.push("Missing from export public manifest.");
  if (generated && !payload) notes.push("Missing full export payload.");
  const expectedSections = SECTION_EXPECTATIONS.get(slug);
  if (expectedSections && payload && payload.sections.length !== expectedSections) {
    notes.push(`Expected ${expectedSections} export sections; found ${payload.sections.length}.`);
  }
  if (slug === "the-call-of-cthulhu" && generated && preview && payload) {
    notes.push(
      "Live generated book with starter preview and full export payload; unavailable state is not expected after deployment.",
    );
  }
  if (slug === "the-adventures-of-roderick-random" && generated && payload) {
    notes.push(
      `Owner-observed Chapter 1 label belongs to this live book; export has ${payload.sections.length} sections, so a one-section picker would indicate hydration/display failure.`,
    );
  }

  return {
    slug,
    live: Boolean(generated),
    generatedTitle: generated?.title ?? null,
    generatedSections: generated?.stats.sectionCount ?? null,
    generatedWords: generated?.stats.wordCount ?? null,
    previewPresent: Boolean(preview),
    previewCharacters: preview?.characterCount ?? null,
    exportPresent: Boolean(payload),
    exportSections: payload?.sections.length ?? null,
    exportWords: payload?.stats.wordCount ?? null,
    exportCharacters,
    fullPayloadLongerThanPreview:
      preview && exportCharacters !== null ? exportCharacters > preview.characterCount : null,
    routeShouldShowUnavailable: Boolean(generated && (!preview || !payload || !exportSummary)),
    notes,
  } satisfies SlugCheck;
}

function renderMarkdown(report: AuditReport) {
  const lines: string[] = [
    "# Book Payload Hydration Completeness Blocker",
    "",
    "## 1. Executive Result",
    "",
    report.executiveResult,
    "",
    "## 2. Owner-Observed Failures",
    "",
    ...report.ownerObservedFailures.map((item) => `- ${item}`),
    "",
    "## 3. Local Served Export Setup",
    "",
    `- Export directory: \`${report.localServedExportSetup.exportDirectory}\``,
    `- Local served base URL used by route validation: \`${report.localServedExportSetup.baseUrlUsedForLocalRouteValidation}\``,
    `- ${report.localServedExportSetup.note}`,
    "",
    "## 4. Full Payload Hydration Result",
    "",
    `- Result: ${report.fullPayloadHydrationResult.result}`,
    `- Generated live books: ${report.fullPayloadHydrationResult.generatedLiveBooks}`,
    `- Export payloads: ${report.fullPayloadHydrationResult.exportPayloads}`,
    `- Missing export payloads: ${report.fullPayloadHydrationResult.missingExportPayloads.length}`,
    `- Extra export payloads: ${report.fullPayloadHydrationResult.extraExportPayloads.length}`,
    `- Starter-only payloads: ${report.fullPayloadHydrationResult.starterOnlyPayloads.length}`,
    "",
    "## 5. Starter Preview Fallback Result",
    "",
    `- Result: ${report.starterPreviewFallbackResult.result}`,
    `- Startup previews: ${report.starterPreviewFallbackResult.startupPreviews}`,
    `- Missing preview slugs: ${report.starterPreviewFallbackResult.missingPreviewSlugs.length}`,
    `- ${report.starterPreviewFallbackResult.note}`,
    "",
    "## 6. Book Text Unavailable State Result",
    "",
    `- Result: ${report.bookTextUnavailableStateResult.result}`,
    `- Live slugs that would route unavailable: ${report.bookTextUnavailableStateResult.liveSlugsThatWouldRouteUnavailable.length}`,
    `- ${report.bookTextUnavailableStateResult.note}`,
    "",
    "## 7. Section Picker Hydration Result",
    "",
    `- Result: ${report.sectionPickerHydrationResult.result}`,
    `- Section mismatches: ${report.sectionPickerHydrationResult.sectionMismatches.length}`,
    `- ${report.sectionPickerHydrationResult.note}`,
    "",
    "## 8. Suspicious Truncation / Chapter 1-Only Audit Result",
    "",
    `- Result: ${report.suspiciousTruncationChapterOneOnlyAuditResult.result}`,
    `- Suspicious books: ${report.suspiciousTruncationChapterOneOnlyAuditResult.suspiciousBooks.length}`,
    `- ${report.suspiciousTruncationChapterOneOnlyAuditResult.note}`,
    "",
    "## 9. Specific Slug Results",
    "",
    "| Slug | Live | Preview | Export Sections | Export Words | Route Unavailable? | Notes |",
    "| --- | --- | --- | ---: | ---: | --- | --- |",
    ...report.specificSlugResults.map((result) =>
      `| ${[
        result.slug,
        result.live ? "yes" : "no",
        result.previewPresent ? "yes" : "no",
        String(result.exportSections ?? ""),
        String(result.exportWords ?? ""),
        result.routeShouldShowUnavailable ? "yes" : "no",
        result.notes.join(" "),
      ].join(" | ")} |`,
    ),
    "",
    "## 10. Fixes Made",
    "",
    ...report.fixesMade.map((item) => `- ${item}`),
    "",
    "## 11. Remaining Blockers",
    "",
    ...(report.remainingBlockers.length
      ? report.remainingBlockers.map((item) => `- ${item}`)
      : ["- None for local served-export hydration and completeness validation."]),
    "",
    "## 12. Whether Netlify Env Var Is Required",
    "",
    `- Required: ${report.netlifyEnvVarRequired.required ? "yes" : "no"}`,
    `- ${report.netlifyEnvVarRequired.note}`,
    "",
    "## 13. Whether Real Remote Cloudflare Validation Is Still Blocked",
    "",
    `- Status: ${report.realRemoteCloudflareValidationStatus.status}`,
    `- ${report.realRemoteCloudflareValidationStatus.note}`,
    "",
    "## 14. Later Content-Quality Checkpoints Preserved",
    "",
    ...report.laterContentQualityCheckpoints.map((item) => `- ${item}`),
    "",
    "## 15. Deferred Final Stages Preserved",
    "",
    ...report.deferredFinalStages.map((item) => `- ${item}`),
    "",
  ];
  return lines.join("\n");
}

function main() {
  const generatedManifest = readJson<GeneratedLibraryManifest>(GENERATED_MANIFEST_PATH);
  const exportManifest = readJson<ExportPublicManifest>(EXPORT_MANIFEST_PATH);
  const previewManifest = readJson<{
    version: number;
    books: Array<{ slug: string }>;
  }>(PREVIEW_MANIFEST_PATH);

  const generatedBySlug = new Map(generatedManifest.books.map((book) => [book.slug, book]));
  const exportBySlug = new Map(exportManifest.books.map((book) => [book.slug, book]));
  const generatedSlugs = [...generatedBySlug.keys()].sort((a, b) => a.localeCompare(b));
  const exportSlugs = [...exportBySlug.keys()].sort((a, b) => a.localeCompare(b));
  const exportPayloadFiles = listFiles(path.join(EXPORT_ROOT, "books")).filter((file) =>
    file.endsWith(".json"),
  );

  const missingExportPayloads: string[] = [];
  const missingFromExportManifest: string[] = [];
  const extraExportPayloads: string[] = [];
  const missingPreviewSlugs: string[] = [];
  const sectionMismatches: string[] = [];
  const starterOnlyPayloads: string[] = [];
  const liveSlugsThatWouldRouteUnavailable: string[] = [];
  const suspiciousBooks: SuspiciousSectionResult[] = [];
  const previewSlugs = new Set(previewManifest.books.map((book) => book.slug));

  for (const slug of generatedSlugs) {
    const book = generatedBySlug.get(slug);
    if (!book) continue;
    const exportSummary = exportBySlug.get(slug);
    if (!exportSummary) missingFromExportManifest.push(slug);
    const payloadPath = exportPayloadPathForSlug(slug);
    const payload = fs.existsSync(payloadPath) ? readJson<ExportBookPayload>(payloadPath) : null;
    if (!payload) missingExportPayloads.push(slug);
    const previewPath = previewPathForSlug(slug);
    const preview = fs.existsSync(previewPath) ? readJson<StartupPreview>(previewPath) : null;
    if (!preview || !previewSlugs.has(slug)) missingPreviewSlugs.push(slug);
    if (!preview || !payload || !exportSummary) liveSlugsThatWouldRouteUnavailable.push(slug);
    if (!payload) continue;

    if (payload.sections.length !== book.stats.sectionCount) {
      sectionMismatches.push(
        `${slug}: generated stats ${book.stats.sectionCount}, export sections ${payload.sections.length}`,
      );
    }
    if (payload.stats.wordCount !== book.stats.wordCount) {
      sectionMismatches.push(
        `${slug}: generated words ${book.stats.wordCount}, export words ${payload.stats.wordCount}`,
      );
    }

    const fullText = payloadText(payload);
    if (preview && fullText.length <= preview.characterCount && book.stats.wordCount > 1_000) {
      starterOnlyPayloads.push(slug);
    }

    const warnings: string[] = [];
    if (book.stats.sectionCount === 0 || payload.sections.length === 0) {
      warnings.push("0 sections");
    }
    if (isChapterOneOnlyWarning(book, payload)) {
      warnings.push("single section is labeled like Chapter/Part 1 on a long work");
    }
    if (looksMidSentence(fullText)) {
      warnings.push("export content appears to end mid-sentence");
    }
    const expectedSections = SECTION_EXPECTATIONS.get(slug);
    if (expectedSections && payload.sections.length !== expectedSections) {
      warnings.push(`expected ${expectedSections} sections, found ${payload.sections.length}`);
    }
    if (warnings.length) {
      suspiciousBooks.push({
        slug,
        title: book.title,
        sectionCount: payload.sections.length,
        wordCount: payload.stats.wordCount,
        warnings,
      });
    }
  }

  const exportPayloadSlugs = exportPayloadFiles.map((file) => path.basename(file, ".json"));
  for (const slug of exportPayloadSlugs) {
    if (!generatedBySlug.has(slug)) extraExportPayloads.push(slug);
  }

  const blockedExported = REMOVED_OR_DEFERRED_SOURCE_RISK_SLUGS.filter(
    (slug) => generatedBySlug.has(slug) || exportBySlug.has(slug),
  );

  const blockers = [
    ...missingFromExportManifest.map((slug) => `Missing from export manifest: ${slug}`),
    ...missingExportPayloads.map((slug) => `Missing export payload: ${slug}`),
    ...extraExportPayloads.map((slug) => `Extra export payload: ${slug}`),
    ...missingPreviewSlugs.map((slug) => `Missing startup preview: ${slug}`),
    ...starterOnlyPayloads.map((slug) => `Export payload appears starter-only: ${slug}`),
    ...blockedExported.map((slug) => `Blocked/deferred slug is exported or live: ${slug}`),
  ];

  const specificSlugResults = SPECIFIC_SLUGS.map((slug) =>
    buildSlugCheck(slug, generatedBySlug, exportBySlug),
  );

  const suspiciousBlockers = suspiciousBooks.filter((book) =>
    book.warnings.some((warning) => warning === "0 sections"),
  );
  const hasSuspiciousWarnings = suspiciousBooks.length > 0;
  const hasBlockers = blockers.length > 0 || suspiciousBlockers.length > 0;

  const report: AuditReport = {
    schemaVersion: 1,
    reportName: "book-payload-hydration-completeness-blocker",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-payload-hydration-completeness-blocker-jun-2026",
    executiveResult: hasBlockers
      ? `Blocked because ${blockers.length + suspiciousBlockers.length} payload/completeness blockers were found.`
      : "Book payload hydration/completeness validation passed locally; real remote Cloudflare validation still requires served base URL.",
    ownerObservedFailures: [
      "The Call of Cthulhu appeared live but showed unavailable text.",
      "Some pages appeared to render only starter/default text instead of full Cloudflare/export content.",
      "Some pages appeared to expose only Chapter 1 or partial section pickers.",
      "The desired behavior is immediate starter preview followed by full served export payload hydration.",
    ],
    localServedExportSetup: {
      exportDirectory: relativeToRepo(EXPORT_ROOT),
      baseUrlUsedForLocalRouteValidation:
        "Local route validation starts a static server for app/client/assets/books/cloudflare-export.",
      note: "The export directory remains ignored/untracked; the app must fetch it over HTTP, not import it.",
    },
    fullPayloadHydrationResult: {
      result: missingExportPayloads.length || extraExportPayloads.length ? "blocked" : "pass",
      generatedLiveBooks: generatedManifest.books.length,
      exportPayloads: exportPayloadFiles.length,
      missingExportPayloads: [...new Set([...missingFromExportManifest, ...missingExportPayloads])].sort(
        (a, b) => a.localeCompare(b),
      ),
      extraExportPayloads: extraExportPayloads.sort((a, b) => a.localeCompare(b)),
      starterOnlyPayloads: starterOnlyPayloads.sort((a, b) => a.localeCompare(b)),
    },
    starterPreviewFallbackResult: {
      result: missingPreviewSlugs.length ? "blocked" : "pass",
      startupPreviews: previewManifest.books.length,
      missingPreviewSlugs: missingPreviewSlugs.sort((a, b) => a.localeCompare(b)),
      note: "Every live generated slug must keep readable startup preview data so failed full hydration cannot collapse into a dead page.",
    },
    bookTextUnavailableStateResult: {
      result: liveSlugsThatWouldRouteUnavailable.length ? "blocked" : "pass",
      liveSlugsThatWouldRouteUnavailable: liveSlugsThatWouldRouteUnavailable.sort((a, b) =>
        a.localeCompare(b),
      ),
      note: "Live generated books with startup preview and export payload coverage should not route to the full unavailable state.",
    },
    sectionPickerHydrationResult: {
      result: sectionMismatches.length ? "blocked" : "pass",
      sectionMismatches: sectionMismatches.sort((a, b) => a.localeCompare(b)),
      note: "Section picker data should hydrate from the full export payload and match generated section counts.",
    },
    suspiciousTruncationChapterOneOnlyAuditResult: {
      result: suspiciousBlockers.length ? "blocked" : hasSuspiciousWarnings ? "warning" : "pass",
      suspiciousBooks: suspiciousBooks.sort((a, b) => a.slug.localeCompare(b.slug)),
      note: hasSuspiciousWarnings
        ? "Warnings are reported for manual review; no generated content was changed by this audit."
        : "No 0-section, Chapter 1-only long-work, or mid-sentence export-ending blockers were found.",
    },
    specificSlugResults,
    fixesMade: [
      "Production book full-payload URLs now default to https://assets.morsewords.com without requiring a Netlify env var.",
      "Local dev keeps the /morse-book-content fallback unless a content base URL override is explicitly provided.",
      "Post-upload validation now validates the known assets.morsewords.com export host by default.",
      "Existing book-page request assertions now accept any configured /books/<slug>.json content base instead of only the dev fallback route.",
      "Book translator source building now treats export-section display text as the Morse source fallback when public export sections do not include a separate morseSourceText field.",
    ],
    remainingBlockers: hasBlockers ? blockers : [],
    netlifyEnvVarRequired: {
      required: false,
      note: "No Netlify env var is required for the default production book content host; VITE_MORSE_BOOK_CONTENT_BASE_URL/PUBLIC_MORSE_BOOK_CONTENT_BASE_URL remain optional local overrides.",
    },
    realRemoteCloudflareValidationStatus: {
      status: "not-claimed",
      note: "This branch does not claim a separate owner-provided R2 base URL validation. The app default is the observed assets.morsewords.com URL pattern.",
    },
    laterContentQualityCheckpoints: [
      "Sources page trust-copy update",
      "About page E-E-A-T sentence",
      "Repeated helper-copy reduction",
    ],
    deferredFinalStages: [
      "Non-book sitemap page implementation",
      "URL/indexability audit",
      "GSC/meta review",
      "Image alt text audit",
      "Broad mobile optimization",
    ],
  };

  writeJson(REPORT_JSON_PATH, report);
  writeText(REPORT_MD_PATH, renderMarkdown(report));

  console.log(`Generated live books: ${generatedManifest.books.length}`);
  console.log(`Export payloads: ${exportPayloadFiles.length}`);
  console.log(`Startup previews: ${previewManifest.books.length}`);
  console.log(`Missing export payloads: ${missingExportPayloads.length}`);
  console.log(`Missing startup previews: ${missingPreviewSlugs.length}`);
  console.log(`Starter-only payloads: ${starterOnlyPayloads.length}`);
  console.log(`Section mismatches: ${sectionMismatches.length}`);
  console.log(`Suspicious truncation warnings: ${suspiciousBooks.length}`);
  console.log(`Report: ${relativeToRepo(REPORT_JSON_PATH)}`);

  if (generatedManifest.books.length !== EXPECTED_BOOK_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_BOOK_COUNT} generated books, found ${generatedManifest.books.length}.`,
    );
  }
  if (hasBlockers) {
    throw new Error(report.executiveResult);
  }
}

main();
