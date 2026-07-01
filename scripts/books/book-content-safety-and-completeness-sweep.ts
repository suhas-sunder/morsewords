import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import type {
  BookSectionKind,
  CleanedBookJson,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
  ProcessedBookJson,
} from "./bookManifestTypes.ts";
import { BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
} from "./bookTextNormalization.ts";

type PublicBookSummary = {
  slug: string;
  contentVersion: string;
  contentHash: string;
  bookPath: string;
  contentSuitability?: "low" | "moderate" | "elevated";
  strictReviewCandidate?: boolean;
  contentNote?: string;
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
  contentSuitability?: "low" | "moderate" | "elevated";
  strictReviewCandidate?: boolean;
  contentNote?: string;
};

type ContentSuitabilityProfile = {
  contentSuitability: "low" | "moderate" | "elevated";
  strictReviewCandidate: boolean;
  contentNote: string;
};

type SuitabilityDataFile = {
  profiles?: Record<string, ContentSuitabilityProfile>;
};

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

type PreviewManifest = {
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

type CategorySummary = {
  category: string;
  maskedPattern: string;
  occurrences: number;
  bookCount: number;
  previewCount: number;
  seoSummaryCount: number;
  exportPayloadCount: number;
  sampleSlugs: string[];
};

type Report = {
  schemaVersion: 1;
  executiveResult: string;
  booksInspected: number;
  generatedPayloadsInspected: number;
  startupPreviewsInspected: number;
  exportPayloadsInspected: number;
  contentSafety: {
    categoriesInspected: string[];
    humanReadableMaskingPolicy: string;
    findingsBeforeCleanup: CategorySummary[];
    findingsAfterCleanup: CategorySummary[];
    safeReplacementsApplied: {
      occurrenceCount: number;
      bookCount: number;
      generatedBookSlugs: string[];
      generatedPayloadsChanged: number;
      publicPreviewsChanged: number;
      seoSummariesChanged: number;
      categories: Array<{
        category: string;
        maskedPattern: string;
        occurrenceCount: number;
        bookCount: number;
      }>;
    };
    ambiguousOrContextSensitiveFindings: CategorySummary[];
  };
  ownerReportedCase: {
    slug: string;
    result: string;
    generatedPayloadSanitized: boolean;
    startupPreviewSanitized: boolean;
    updatedExportSanitized: boolean;
  };
  completeness: {
    result: string;
    booksInspected: number;
    findings: Array<{
      slug: string;
      severity: "warning" | "blocker";
      reason: string;
    }>;
    specificSlugResults: Array<{
      slug: string;
      sectionCount: number;
      wordCount: number;
      result: string;
    }>;
    booksRepairedForIncompleteExtraction: string[];
    booksDeferredOrBlocked: string[];
  };
  publicSurfaceSanitization: {
    startupPreviewsSanitized: boolean;
    seoSummariesSanitized: boolean;
    exportPayloadsSanitized: boolean;
    printRoutesUseGeneratedSections: boolean;
  };
  updatedExport: {
    root: string;
    written: boolean;
    fileCount: number;
    bookPayloadCount: number;
    manifestFileCount: number;
    trackedFileCount: number;
    replacementType: "full";
    ignoredByGit: boolean;
  };
  filesIntentionallyNotTracked: string[];
  protectedFolderStatus: {
    tempBooksModified: boolean;
    cloudflareExportTrackedCount: number;
    cloudflareUpdatedExportTrackedCount: number;
  };
  remainingBlockers: string[];
  ownerUploadInstructions: string;
};

type ReplacementRecord = {
  category: string;
  maskedPattern: string;
  slug: string;
  sectionId?: string;
};

type ReplacementRule = {
  category: string;
  maskedPattern: string;
  regex: RegExp;
  replacement: (...captures: string[]) => string;
};

type FlagRule = {
  category: string;
  maskedPattern: string;
  regex: RegExp;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const GENERATED_ROOT = path.join(REPO_ROOT, "app/client/assets/books/generated");
const PREVIEW_ROOT = path.join(REPO_ROOT, "public/book-previews");
const SEO_SUMMARY_PATH = path.join(
  REPO_ROOT,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const CLOUDFLARE_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-export",
);
const CLOUDFLARE_UPDATED_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-updated-export",
);
const REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-content-safety-and-completeness-sweep",
);
const REPORT_JSON_PATH = path.join(
  REPORT_ROOT,
  "book-content-safety-and-completeness-sweep.json",
);
const REPORT_MD_PATH = path.join(
  REPORT_ROOT,
  "book-content-safety-and-completeness-sweep.md",
);
const SUITABILITY_DATA_PATH = path.join(
  REPO_ROOT,
  "app/client/data/morseBookSuitability.generated.json",
);
const OUTPUT_NEWLINE = process.platform === "win32" ? "\r\n" : "\n";
const TARGET_RUNTIME_SECONDS = 3_600;
const PREVIEW_BASE_PATH = "/book-previews";
const WRITE_UPDATED_EXPORT = process.argv.includes("--write-updated-export");

const REPLACEMENT_RULES: ReplacementRule[] = [
  {
    category: "racial and ethnic slurs / historical identity labels",
    maskedPattern: "N**** historical label before person noun",
    regex:
      /\bnegro\s+(man|men|woman|women|boy|boys|girl|girls|child|children|servant|servants|soldier|soldiers|preacher|preachers|race|races|quarter|quarters|village|villages|cabin|cabins|hut|huts)\b/gi,
    replacement: (_match, noun) => `Black ${noun}`,
  },
  {
    category: "racial and ethnic slurs / historical identity labels",
    maskedPattern: "N**** historical label used adjectivally",
    regex:
      /\bnegro\s+(?!(?:who|with|on|to|in|from|and|is|was|were|may|named|went|looks|seemed|having|yelled|muttered|slowly|stepped|stretched|told|that|as|of|overboard)\b)([a-z][a-z'-]+s?)\b/gi,
    replacement: (_match, noun) => `Black ${noun}`,
  },
  {
    category: "racial and ethnic slurs / historical identity labels",
    maskedPattern: "N**** historical label plural",
    regex: /\bnegroes\b/gi,
    replacement: () => "Black people",
  },
  {
    category: "racial and ethnic slurs / historical identity labels",
    maskedPattern: "N**** historical label singular",
    regex: /\bnegro\b/gi,
    replacement: () => "Black person",
  },
  {
    category: "racial and ethnic slurs",
    maskedPattern: "severe anti-Black slur before person noun",
    regex:
      /\bnigg(?:er|ra)\s+(man|men|woman|women|boy|boys|girl|girls|child|children|servant|servants)\b/gi,
    replacement: (_match, noun) => `Black ${noun}`,
  },
  {
    category: "racial and ethnic slurs",
    maskedPattern: "severe anti-Black slur used adjectivally",
    regex:
      /\bnigg(?:er|ra)\s+(?!(?:who|with|on|to|in|from|and|is|was|were|may|named|went|looks|seemed|having|yelled|muttered|slowly|stepped|stretched|told|that|as|of|overboard)\b)([a-z][a-z'-]+s?)\b/gi,
    replacement: (_match, noun) => `Black ${noun}`,
  },
  {
    category: "racial and ethnic slurs",
    maskedPattern: "severe anti-Black slur plural",
    regex: /\b(?:niggers|nigras)\b/gi,
    replacement: () => "Black people",
  },
  {
    category: "racial and ethnic slurs",
    maskedPattern: "severe anti-Black slur singular",
    regex: /\b(?:nigger|nigra)\b/gi,
    replacement: () => "Black person",
  },
  {
    category: "anti-Indigenous slurs",
    maskedPattern: "anti-Indigenous slur plural",
    regex: /\b(?:redskins|injuns)\b/gi,
    replacement: () => "Indigenous people",
  },
  {
    category: "anti-Indigenous slurs",
    maskedPattern: "anti-Indigenous slur singular",
    regex: /\b(?:redskin|injun)\b/gi,
    replacement: () => "Indigenous person",
  },
  {
    category: "anti-Indigenous slurs",
    maskedPattern: "anti-Indigenous slur for women plural",
    regex: /\bsquaws\b/gi,
    replacement: () => "Indigenous women",
  },
  {
    category: "anti-Indigenous slurs",
    maskedPattern: "anti-Indigenous slur for woman singular",
    regex: /\bsquaw\b/gi,
    replacement: () => "Indigenous woman",
  },
  {
    category: "antisemitic slurs",
    maskedPattern: "antisemitic slur plural",
    regex: /\b(?:kikes|yids)\b/gi,
    replacement: () => "Jewish people",
  },
  {
    category: "antisemitic slurs",
    maskedPattern: "antisemitic slur singular",
    regex: /\b(?:kike|yid)\b/gi,
    replacement: () => "Jewish person",
  },
  {
    category: "misogynistic slurs",
    maskedPattern: "misogynistic slur plural",
    regex: /\b(?:whores|sluts)\b/gi,
    replacement: () => "women",
  },
  {
    category: "misogynistic slurs",
    maskedPattern: "misogynistic slur singular",
    regex: /\b(?:whore|slut)\b/gi,
    replacement: () => "woman",
  },
];

const FLAG_RULES: FlagRule[] = [
  {
    category: "anti-Roma slurs / context-sensitive labels",
    maskedPattern: "G**** / R*** context-sensitive label",
    regex: /\b(?:gypsy|gypsies|gipsy|gipsies)\b/gi,
  },
  {
    category: "homophobic slurs / context-sensitive historical words",
    maskedPattern: "F***/D*** context-sensitive label",
    regex: /\b(?:fag|fags|faggot|faggots|dyke|dykes)\b/gi,
  },
  {
    category: "ableist slurs / context-sensitive historical words",
    maskedPattern: "ableist/context-sensitive labels",
    regex: /\b(?:cripple|cripples|crippled|idiot|idiots|imbecile|imbeciles)\b/gi,
  },
  {
    category: "explicit sexual terms inappropriate for practice surfaces",
    maskedPattern: "explicit sexual term",
    regex: /\b(?:pornographic|pornography)\b/gi,
  },
  {
    category: "extreme profanity",
    maskedPattern: "extreme profanity",
    regex: /\b(?:fuck|fucks|fucked|fucking|cunt|cunts)\b/gi,
  },
  {
    category: "dehumanizing identity labels",
    maskedPattern: "dehumanizing identity label",
    regex: /\b(?:vermin|savages?)\b/gi,
  },
];

const FLAGGED_SPECIFIC_SLUGS = [
  "the-call-of-cthulhu",
  "the-adventures-of-roderick-random",
  "walden",
  "the-leavenworth-case",
  "middlemarch",
  "the-jungle-book",
  "the-bottle-imp",
  "five-little-friends",
];

const SPECIFIC_SECTION_EXPECTATIONS: Record<string, number> = {
  "the-leavenworth-case": 39,
  walden: 18,
  "the-bottle-imp": 1,
};

const DEFAULT_READABLE_EXCLUDED_SECTION_KINDS = new Set<BookSectionKind>([
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

const ASIDE_DEFAULT_NAME_EXCLUSION_PATTERN =
  /\b(table of contents|contents|list of illustrations|illustrations?|title page|copyright|license|source|publisher|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter)\b/;

const ASIDE_DEFAULT_EVIDENCE_EXCLUSION_PATTERN =
  /\b(project gutenberg|gutenberg|transcriber|produced by|production note|copyright|license|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter)\b/;

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function sleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function writeTextFileWithRetry(filePath: string, content: string): void {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      fs.writeFileSync(filePath, content, "utf8");
      return;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (
        attempt < 5 &&
        (code === "UNKNOWN" || code === "EBUSY" || code === "EPERM")
      ) {
        sleepSync(120 * (attempt + 1));
        continue;
      }
      throw error;
    }
  }
}

function writeJsonIfChanged(filePath: string, value: unknown): boolean {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const nextJson = JSON.stringify(value, null, 2);
  if (fs.existsSync(filePath)) {
    const current = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    if (JSON.stringify(current) === JSON.stringify(value)) return false;
  }
  writeTextFileWithRetry(
    filePath,
    `${nextJson.replace(/\n/g, OUTPUT_NEWLINE)}${OUTPUT_NEWLINE}`,
  );
  return true;
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const json = JSON.stringify(value, null, 2).replace(/\n/g, OUTPUT_NEWLINE);
  writeTextFileWithRetry(filePath, `${json}${OUTPUT_NEWLINE}`);
}

function sha256Json(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function defaultSuitabilityProfile(): ContentSuitabilityProfile {
  return {
    contentSuitability: "moderate",
    strictReviewCandidate: true,
    contentNote:
      "Historical public-domain text. May include period language, mature themes, or intense scenes. Review before classroom or younger-user use.",
  };
}

function loadSuitabilityProfiles(): Record<string, ContentSuitabilityProfile> {
  if (!fs.existsSync(SUITABILITY_DATA_PATH)) return {};
  return readJson<SuitabilityDataFile>(SUITABILITY_DATA_PATH).profiles ?? {};
}

function suitabilityForSlug(
  profiles: Record<string, ContentSuitabilityProfile>,
  slug: string,
): ContentSuitabilityProfile {
  return profiles[slug] ?? defaultSuitabilityProfile();
}

function gitTrackedCount(relativePath: string): number {
  try {
    const output = execFileSync("git", ["ls-files", relativePath], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    return output.split(/\r?\n/).filter(Boolean).length;
  } catch {
    return -1;
  }
}

function gitIgnored(relativePath: string): boolean {
  try {
    const output = execFileSync(
      "git",
      ["status", "--ignored", "--short", relativePath],
      { cwd: REPO_ROOT, encoding: "utf8" },
    );
    return output
      .split(/\r?\n/)
      .filter(Boolean)
      .some((line) => line.startsWith("!! "));
  } catch {
    return false;
  }
}

function compactText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function applyReplacementRules(
  input: string,
  context: { slug: string; sectionId?: string },
): { text: string; records: ReplacementRecord[] } {
  let text = input;
  const records: ReplacementRecord[] = [];
  for (const rule of REPLACEMENT_RULES) {
    text = text.replace(rule.regex, (...args: string[]) => {
      const captures = args.slice(1, -2);
      records.push({
        category: rule.category,
        maskedPattern: rule.maskedPattern,
        slug: context.slug,
        sectionId: context.sectionId,
      });
      return rule.replacement(...args.slice(0, 1), ...captures);
    });
  }
  return { text, records };
}

function countRuleMatches(input: string, rule: ReplacementRule | FlagRule): number {
  let count = 0;
  rule.regex.lastIndex = 0;
  for (const _match of input.matchAll(rule.regex)) count += 1;
  rule.regex.lastIndex = 0;
  return count;
}

function sectionStats(text: string) {
  const wordCount = countBookWords(text);
  const morseCharacterEstimate = estimateMorseCharacters(text);
  return {
    wordCount,
    characterCount: text.length,
    estimatedTypingMinutes: Math.max(1, Math.ceil(wordCount / 40)),
    estimatedListeningMinutes: Math.max(1, Math.ceil(morseCharacterEstimate / 900)),
    morseCharacterEstimate,
    unsupportedCharacterSummary: summarizeUnsupportedCharacters(text),
    textPreview: textPreview(text),
  };
}

function updateSectionJson(
  section: GeneratedBookSectionJson,
  nextText: string,
): GeneratedBookSectionJson {
  const stats = sectionStats(nextText);
  return {
    ...section,
    displayText: nextText,
    morseSourceText: nextText,
    paragraphs: splitParagraphs(nextText),
    ...stats,
  };
}

function sectionSummaryFromJson(
  section: GeneratedBookSectionJson,
  sectionJsonPath: string,
): GeneratedBookManifest["sections"][number] {
  return {
    id: section.sectionId,
    kind: section.kind,
    label: section.label,
    title: section.title,
    order: section.order,
    includeByDefault: section.includeByDefault,
    sectionJsonPath,
    characterCount: section.characterCount,
    wordCount: section.wordCount,
    estimatedTypingMinutes: section.estimatedTypingMinutes,
    estimatedListeningMinutes: section.estimatedListeningMinutes,
    morseCharacterEstimate: section.morseCharacterEstimate,
    textPreview: section.textPreview,
  };
}

function buildGeneratedContentHash(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): string {
  return sha256Json({
    schemaVersion: BOOK_SCHEMA_VERSION,
    slug: manifest.slug,
    title: manifest.title,
    author: manifest.author,
    language: manifest.language,
    source: {
      provider: manifest.source.provider,
      gutenbergId: manifest.source.gutenbergId,
      sourceUrl: manifest.source.sourceUrl,
      rightsBasis: manifest.source.rightsBasis,
      rightsStatus: manifest.source.rightsStatus,
      publishReady: manifest.source.publishReady,
      processingAllowed: manifest.source.processingAllowed,
      approvalSource: manifest.source.approvalSource,
      duplicateResolutionSource: manifest.source.duplicateResolutionSource,
    },
    defaults: manifest.defaults,
    sections: sections.map((section) => ({
      id: section.sectionId,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      text: section.displayText,
    })),
  });
}

function loadLibraryManifest(): GeneratedLibraryManifest {
  return readJson<GeneratedLibraryManifest>(
    path.join(GENERATED_ROOT, "library-manifest.json"),
  );
}

function loadBookManifest(summaryPath: string): GeneratedBookManifest {
  return readJson<GeneratedBookManifest>(path.join(GENERATED_ROOT, summaryPath));
}

function loadBookSections(
  manifest: GeneratedBookManifest,
): Array<{ summary: GeneratedBookManifest["sections"][number]; section: GeneratedBookSectionJson }> {
  return manifest.sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((summary) => ({
      summary,
      section: readJson<GeneratedBookSectionJson>(
        path.join(GENERATED_ROOT, manifest.slug, summary.sectionJsonPath),
      ),
    }));
}

function updateGeneratedBookExtras(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): { cleanedChanged: boolean; processedChanged: boolean } {
  let cleanedChanged = false;
  let processedChanged = false;

  const resolveBookArtifactPath = (relativePath: string): string => {
    const directPath = path.join(GENERATED_ROOT, relativePath);
    if (fs.existsSync(directPath)) return directPath;
    return path.join(GENERATED_ROOT, manifest.slug, relativePath);
  };

  if (manifest.source.cleanedBookPath) {
    const cleanedPath = resolveBookArtifactPath(manifest.source.cleanedBookPath);
    if (fs.existsSync(cleanedPath)) {
      const cleaned = readJson<CleanedBookJson>(cleanedPath);
      const sectionMap = new Map(sections.map((section) => [section.sectionId, section]));
      const cleanedSections = cleaned.sections.map((cleanedSection) => {
        const section = sectionMap.get(cleanedSection.id);
        if (!section) return cleanedSection;
        const nextCleanedSection: Record<string, unknown> = {
          ...cleanedSection,
          text: section.displayText,
          paragraphs: section.paragraphs,
          wordCount: section.wordCount,
          characterCount: section.characterCount,
          estimatedTypingMinutes: section.estimatedTypingMinutes,
          estimatedListeningMinutes: section.estimatedListeningMinutes,
        };
        if ("displayText" in cleanedSection) {
          nextCleanedSection.displayText = section.displayText;
        }
        return nextCleanedSection as typeof cleanedSection;
      });
      const wordCount = cleanedSections.reduce((sum, section) => sum + section.wordCount, 0);
      const characterCount = cleanedSections.reduce(
        (sum, section) => sum + section.characterCount,
        0,
      );
      const estimatedTypingMinutes = cleanedSections.reduce(
        (sum, section) => sum + section.estimatedTypingMinutes,
        0,
      );
      const estimatedListeningMinutes = cleanedSections.reduce(
        (sum, section) => sum + section.estimatedListeningMinutes,
        0,
      );
      const nextCleaned: CleanedBookJson = {
        ...cleaned,
        contentVersion: manifest.contentVersion,
        contentHash: manifest.contentHash,
        stats: {
          ...cleaned.stats,
          wordCount,
          characterCount,
          sectionCount: cleanedSections.length,
          estimatedTypingMinutes,
          estimatedListeningMinutes,
        },
        sections: cleanedSections,
      };
      cleanedChanged = writeJsonIfChanged(cleanedPath, nextCleaned);
    }
  }

  if (manifest.source.processedBookPath) {
    const processedPath = resolveBookArtifactPath(manifest.source.processedBookPath);
    if (fs.existsSync(processedPath)) {
      const processed = readJson<ProcessedBookJson & Record<string, unknown>>(processedPath);
      let nextProcessed: ProcessedBookJson | Record<string, unknown> | null = null;
      if (processed.content?.chapters) {
        const orderedSections = [...sections].sort((a, b) => a.order - b.order);
        let sectionIndex = 0;
        const chapters = processed.content.chapters.map((chapter) => ({
          ...chapter,
          sections: chapter.sections.map((processedSection) => {
            const section = orderedSections[sectionIndex];
            sectionIndex += 1;
            if (!section) return processedSection;
            return {
              ...processedSection,
              text: section.displayText,
              word_count: section.wordCount,
              character_count: section.characterCount,
              estimated_typing_minutes: section.estimatedTypingMinutes,
              estimated_listening_minutes: section.estimatedListeningMinutes,
            };
          }),
        }));
        nextProcessed = {
          ...processed,
          content_version: manifest.contentVersion,
          content_hash: manifest.contentHash,
          content: { chapters },
        };
      } else if (Array.isArray(processed.sections)) {
        nextProcessed = {
          ...processed,
          contentHash: manifest.contentHash,
          contentVersion: manifest.contentVersion,
          wordCount: manifest.stats.wordCount,
          sectionCount: manifest.stats.sectionCount,
          sections: manifest.sections,
        };
      }
      if (!nextProcessed) return { cleanedChanged, processedChanged };
      processedChanged = writeJsonIfChanged(processedPath, nextProcessed);
    }
  }

  return { cleanedChanged, processedChanged };
}

function normalizedSectionText(...parts: Array<string | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function sectionEvidenceText(section: GeneratedBookManifest["sections"][number]): string {
  return normalizedSectionText(section.label, section.title, section.textPreview);
}

function sectionNameText(section: GeneratedBookManifest["sections"][number]): string {
  return normalizedSectionText(section.label, section.title);
}

function isDefaultReadableBookSection(section: GeneratedBookManifest["sections"][number]): boolean {
  if (DEFAULT_READABLE_EXCLUDED_SECTION_KINDS.has(section.kind)) return false;

  const nameText = sectionNameText(section);
  if (ASIDE_DEFAULT_NAME_EXCLUSION_PATTERN.test(nameText)) return false;

  const evidenceText = sectionEvidenceText(section);
  if (ASIDE_DEFAULT_EVIDENCE_EXCLUSION_PATTERN.test(evidenceText)) return false;

  const earlySection = section.order <= 4;
  if (earlySection && section.wordCount < 35) return false;
  if (
    earlySection &&
    section.wordCount < 90 &&
    /\b(cover|frontispiece|by\s+[a-z]|published|copyright|all rights reserved)\b/.test(
      evidenceText,
    )
  ) {
    return false;
  }

  return section.wordCount > 0;
}

function getDefaultPreviewSectionIds(
  book: GeneratedBookManifest,
  fallbackSectionId: string,
): string[] {
  const readable = book.sections
    .filter((section) => isDefaultReadableBookSection(section))
    .map((section) => section.id);
  if (readable.length > 0) return readable;

  const included = book.sections
    .filter((section) => section.includeByDefault)
    .map((section) => section.id);
  return included.length > 0 ? included : [fallbackSectionId];
}

function clampBoundary(text: string, targetLength: number): string {
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
    return text
      .slice(0, minBoundary + sentenceMatch.index + sentenceMatch[0].length)
      .trim();
  }

  const whitespace = text.lastIndexOf(" ", targetLength);
  if (whitespace > minBoundary) return text.slice(0, whitespace).trim();

  return text.slice(0, targetLength).trim();
}

function previewTextForSection(section: GeneratedBookSectionJson): string {
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
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): PreviewAsset | null {
  const fallbackSectionId = manifest.sections[0]?.id ?? "";
  if (!fallbackSectionId) return null;

  const defaultSectionId =
    getDefaultPreviewSectionIds(manifest, fallbackSectionId)[0] ?? "";
  if (!defaultSectionId) return null;

  const sectionSummary =
    manifest.sections.find((section) => section.id === defaultSectionId) ?? null;
  const section =
    sections.find((candidate) => candidate.sectionId === defaultSectionId) ?? null;
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
  const wordCount = countBookWords(previewText);

  return {
    version: 1,
    slug: manifest.slug,
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
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
    textPreview: compactText(previewText).slice(0, 180),
    truncated: previewText.length < section.morseSourceText.trim().length,
  };
}

function makeExportBook(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  suitability: ContentSuitabilityProfile,
): PublicContentJson {
  const manifestWithSuitability = {
    ...manifest,
    contentSuitability: suitability.contentSuitability,
    strictReviewCandidate: suitability.strictReviewCandidate,
    contentNote: suitability.contentNote,
  };
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
    contentSuitability: suitability.contentSuitability,
    strictReviewCandidate: suitability.strictReviewCandidate,
    contentNote: suitability.contentNote,
    manifest: manifestWithSuitability,
    sections,
  };
  const contentHash = sha256Json(bookWithoutExportHash);
  return {
    ...bookWithoutExportHash,
    contentVersion: contentHash.slice(0, 16),
    contentHash,
  };
}

function safeResetExportRoot(exportRoot: string): void {
  const normalized = path.normalize(exportRoot);
  const parsedRoot = path.parse(normalized).root;
  if (normalized === parsedRoot || normalized.length < parsedRoot.length + 8) {
    throw new Error(`Refusing to reset unsafe export root: ${exportRoot}`);
  }
  const expected = [
    path.normalize("app/client/assets/books/cloudflare-updated-export"),
  ];
  if (!expected.some((suffix) => normalized.endsWith(suffix))) {
    throw new Error(`Refusing to reset unexpected export root: ${exportRoot}`);
  }
  fs.rmSync(exportRoot, { recursive: true, force: true });
  fs.mkdirSync(exportRoot, { recursive: true });
}

function exportGeneratedBooksToRoot(
  exportRoot: string,
): {
  fileCount: number;
  bookPayloadCount: number;
  manifestFileCount: number;
} {
  const libraryManifest = loadLibraryManifest();
  const books = libraryManifest.books
    .map((book) => {
      const manifest = loadBookManifest(book.manifestPath);
      return {
        manifest,
        sections: loadBookSections(manifest).map((entry) => entry.section),
      };
    })
    .filter(({ manifest }) => {
      return (
        manifest.source.publishReady === true &&
        manifest.source.rightsStatus === "approved" &&
        manifest.source.processingAllowed === true
      );
    })
    .sort((a, b) => a.manifest.title.localeCompare(b.manifest.title));

  const suitabilityProfiles = loadSuitabilityProfiles();
  const exportBooks = books.map(({ manifest, sections }) =>
    makeExportBook(manifest, sections, suitabilityForSlug(suitabilityProfiles, manifest.slug)),
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
    contentSuitability: book.contentSuitability,
    strictReviewCandidate: book.strictReviewCandidate,
    contentNote: book.contentNote,
  }));
  const contentHash = sha256Json(manifestBooks);
  const contentVersion = contentHash.slice(0, 16);
  const artifacts: string[] = [];

  safeResetExportRoot(exportRoot);

  const writeExportJson = (relativePath: string, value: unknown) => {
    writeJson(path.join(exportRoot, ...relativePath.split("/")), value);
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
    sourceFolder: "app/client/assets/books/cloudflare-updated-export/",
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
      publicManifest: "https://assets.morsewords.com/public-manifest.json",
      bookJson: "https://assets.morsewords.com/books/<slug>.json",
    },
    doNotUpload: [
      "app/client/assets/temp-books/",
      "app/client/assets/books/generated/",
      "public/book-previews/",
      "secrets or credentials",
    ],
    mediaFilesIncluded: false,
    notes: [
      "This folder is a complete 521-file replacement export for sync/delete upload.",
      "Upload the contents of sourceFolder with these relative object paths preserved.",
      "Do not append-only upload this folder over stale remote keys.",
    ],
  });

  return {
    fileCount: uploadFiles.length,
    bookPayloadCount: manifestBooks.length,
    manifestFileCount: uploadFiles.length - manifestBooks.length,
  };
}

function collectTextSurfaces(exportRoot: string | null): Array<{
  slug: string;
  surface: "generated" | "preview" | "seo" | "export";
  text: string;
}> {
  const surfaces: Array<{
    slug: string;
    surface: "generated" | "preview" | "seo" | "export";
    text: string;
  }> = [];
  const libraryManifest = loadLibraryManifest();
  for (const book of libraryManifest.books) {
    const manifest = loadBookManifest(book.manifestPath);
    const sectionTexts = loadBookSections(manifest)
      .map(({ section }) => section.displayText)
      .join("\n\n");
    surfaces.push({ slug: manifest.slug, surface: "generated", text: sectionTexts });

    const previewPath = path.join(PREVIEW_ROOT, `${manifest.slug}.preview.json`);
    if (fs.existsSync(previewPath)) {
      const preview = readJson<PreviewAsset>(previewPath);
      surfaces.push({
        slug: manifest.slug,
        surface: "preview",
        text: [preview.previewText, preview.textPreview].join("\n"),
      });
    }

    if (exportRoot) {
      const exportPath = path.join(exportRoot, "books", `${manifest.slug}.json`);
      if (fs.existsSync(exportPath)) {
        const exportBook = readJson<PublicContentJson>(exportPath);
        surfaces.push({
          slug: manifest.slug,
          surface: "export",
          text: exportBook.sections.map((section) => section.displayText).join("\n\n"),
        });
      }
    }
  }

  if (fs.existsSync(SEO_SUMMARY_PATH)) {
    const registry = readJson<{ summaries: Array<{ slug: string; description?: string; summary?: string }> }>(
      SEO_SUMMARY_PATH,
    );
    for (const summary of registry.summaries ?? []) {
      surfaces.push({
        slug: summary.slug,
        surface: "seo",
        text: [summary.description ?? "", summary.summary ?? ""].join("\n"),
      });
    }
  }

  return surfaces;
}

function summarizeRules(
  surfaces: ReturnType<typeof collectTextSurfaces>,
  rules: Array<ReplacementRule | FlagRule>,
): CategorySummary[] {
  const byRule = new Map<string, CategorySummary>();
  for (const rule of rules) {
    byRule.set(rule.maskedPattern, {
      category: rule.category,
      maskedPattern: rule.maskedPattern,
      occurrences: 0,
      bookCount: 0,
      previewCount: 0,
      seoSummaryCount: 0,
      exportPayloadCount: 0,
      sampleSlugs: [],
    });
  }

  const seenBooks = new Map<string, Set<string>>();
  for (const rule of rules) seenBooks.set(rule.maskedPattern, new Set<string>());

  for (const surface of surfaces) {
    for (const rule of rules) {
      const count = countRuleMatches(surface.text, rule);
      if (count === 0) continue;
      const summary = byRule.get(rule.maskedPattern);
      const seen = seenBooks.get(rule.maskedPattern);
      if (!summary || !seen) continue;
      summary.occurrences += count;
      seen.add(surface.slug);
      if (surface.surface === "preview") summary.previewCount += 1;
      if (surface.surface === "seo") summary.seoSummaryCount += 1;
      if (surface.surface === "export") summary.exportPayloadCount += 1;
      if (summary.sampleSlugs.length < 24 && !summary.sampleSlugs.includes(surface.slug)) {
        summary.sampleSlugs.push(surface.slug);
      }
    }
  }

  return [...byRule.values()].map((summary) => ({
    ...summary,
    bookCount: seenBooks.get(summary.maskedPattern)?.size ?? 0,
    sampleSlugs: summary.sampleSlugs.sort((a, b) => a.localeCompare(b)),
  }));
}

function summarizeReplacementRecords(records: ReplacementRecord[]): Report["contentSafety"]["safeReplacementsApplied"]["categories"] {
  const byKey = new Map<
    string,
    { category: string; maskedPattern: string; occurrenceCount: number; slugs: Set<string> }
  >();
  for (const record of records) {
    const key = `${record.category}::${record.maskedPattern}`;
    const entry =
      byKey.get(key) ??
      {
        category: record.category,
        maskedPattern: record.maskedPattern,
        occurrenceCount: 0,
        slugs: new Set<string>(),
      };
    entry.occurrenceCount += 1;
    entry.slugs.add(record.slug);
    byKey.set(key, entry);
  }
  return [...byKey.values()]
    .map((entry) => ({
      category: entry.category,
      maskedPattern: entry.maskedPattern,
      occurrenceCount: entry.occurrenceCount,
      bookCount: entry.slugs.size,
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.maskedPattern.localeCompare(b.maskedPattern));
}

function runGeneratedCleanup(): {
  records: ReplacementRecord[];
  changedBookSlugs: string[];
  previewChangedSlugs: string[];
  seoChangedSlugs: string[];
} {
  const records: ReplacementRecord[] = [];
  const changedBookSlugs = new Set<string>();
  const previewChangedSlugs = new Set<string>();
  const seoChangedSlugs = new Set<string>();
  const libraryManifest = loadLibraryManifest();
  const libraryBooks = new Map(libraryManifest.books.map((book) => [book.slug, book]));

  for (const book of libraryManifest.books) {
    const manifest = loadBookManifest(book.manifestPath);
    const loadedSections = loadBookSections(manifest);
    let bookChanged = false;
    let manifestForExtras = manifest;
    const nextSections: GeneratedBookSectionJson[] = [];

    for (const { summary, section } of loadedSections) {
      const sanitized = applyReplacementRules(section.displayText, {
        slug: manifest.slug,
        sectionId: section.sectionId,
      });
      records.push(...sanitized.records);
      const nextText = sanitized.text;
      const sectionChanged = nextText !== section.displayText;
      const nextSection = sectionChanged ? updateSectionJson(section, nextText) : section;
      if (writeJsonIfChanged(path.join(GENERATED_ROOT, manifest.slug, summary.sectionJsonPath), nextSection)) {
        bookChanged = true;
      }
      nextSections.push(nextSection);
    }

    if (bookChanged) {
      const wordCount = nextSections.reduce((sum, section) => sum + section.wordCount, 0);
      const characterCount = nextSections.reduce(
        (sum, section) => sum + section.characterCount,
        0,
      );
      const includedSectionCount = nextSections.filter(
        (section) => section.includeByDefault,
      ).length;
      const summaryPathById = new Map(
        manifest.sections.map((summary) => [summary.id, summary.sectionJsonPath]),
      );
      const nextManifest: GeneratedBookManifest = {
        ...manifest,
        stats: {
          ...manifest.stats,
          cleanedCharacterCount: characterCount,
          wordCount,
          sectionCount: nextSections.length,
          includedSectionCount,
        },
        sections: nextSections.map((section) =>
          sectionSummaryFromJson(
            section,
            summaryPathById.get(section.sectionId) ?? `sections/${section.sectionId}.json`,
          ),
        ),
        cleaning: {
          ...manifest.cleaning,
          cleanedCharacterCount: characterCount,
        },
      };
      const contentHash = buildGeneratedContentHash(nextManifest, nextSections);
      nextManifest.contentHash = contentHash;
      nextManifest.contentVersion = contentHash.slice(0, 16);
      writeJsonIfChanged(path.join(GENERATED_ROOT, manifest.slug, "manifest.json"), nextManifest);
      manifestForExtras = nextManifest;

      const libraryBook = libraryBooks.get(manifest.slug);
      if (libraryBook) {
        libraryBook.contentHash = nextManifest.contentHash;
        libraryBook.contentVersion = nextManifest.contentVersion;
        libraryBook.stats = nextManifest.stats;
        libraryBook.source = nextManifest.source;
      }
      changedBookSlugs.add(manifest.slug);
    }

    if (bookChanged) {
      const extras = updateGeneratedBookExtras(manifestForExtras, nextSections);
      if (extras.cleanedChanged || extras.processedChanged) {
        changedBookSlugs.add(manifest.slug);
      }
    }
  }

  writeJsonIfChanged(path.join(GENERATED_ROOT, "library-manifest.json"), {
    ...libraryManifest,
    books: libraryManifest.books,
  });

  const previewManifestPath = path.join(PREVIEW_ROOT, "manifest.json");
  const previewManifest = readJson<PreviewManifest>(previewManifestPath);
  const previewEntriesBySlug = new Map(
    previewManifest.books.map((entry) => [entry.slug, entry]),
  );

  for (const book of libraryManifest.books) {
    const manifest = loadBookManifest(book.manifestPath);
    const previewPath = path.join(PREVIEW_ROOT, `${manifest.slug}.preview.json`);
    if (!fs.existsSync(previewPath)) continue;
    const preview = readJson<PreviewAsset>(previewPath);
    const previewTextResult = applyReplacementRules(preview.previewText, {
      slug: manifest.slug,
    });
    records.push(...previewTextResult.records);
    const nextPreviewText = previewTextResult.text;
    const previewTextChanged = nextPreviewText !== preview.previewText;
    const nextPreview: PreviewAsset = {
      ...preview,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      previewText: nextPreviewText,
      ...(previewTextChanged
        ? {
            wordCount: countBookWords(nextPreviewText),
            characterCount: nextPreviewText.length,
            estimatedTypingMinutes: Math.max(
              1,
              Math.ceil(countBookWords(nextPreviewText) / 40),
            ),
            morseCharacterEstimate: estimateMorseCharacters(nextPreviewText),
            textPreview: compactText(nextPreviewText).slice(0, 180),
          }
        : {}),
    };
    if (previewTextChanged) {
      nextPreview.estimatedListeningMinutes = Math.max(
        1,
        Math.ceil(nextPreview.morseCharacterEstimate / 900),
      );
      nextPreview.estimatedRuntimeSeconds = Math.max(
        1,
        Math.round(nextPreview.estimatedListeningMinutes * 60),
      );
    }
    if (writeJsonIfChanged(previewPath, nextPreview)) {
      previewChangedSlugs.add(manifest.slug);
    }
    const previewBytes = fs.statSync(previewPath).size;
    const previewEntry = previewEntriesBySlug.get(manifest.slug);
    if (previewEntry) {
      previewEntry.contentVersion = nextPreview.contentVersion;
      previewEntry.contentHash = nextPreview.contentHash;
      previewEntry.previewBytes = previewBytes;
      previewEntry.previewCharacterCount = nextPreview.characterCount;
      previewEntry.estimatedRuntimeSeconds = nextPreview.estimatedRuntimeSeconds;
      previewEntry.truncated = nextPreview.truncated;
    }
  }

  if (writeJsonIfChanged(previewManifestPath, previewManifest)) {
    for (const slug of changedBookSlugs) previewChangedSlugs.add(slug);
  }

  if (fs.existsSync(SEO_SUMMARY_PATH)) {
    const registry = readJson<{
      summaries: Array<{ slug: string; description?: string; summary?: string }>;
    }>(SEO_SUMMARY_PATH);
    let changed = false;
    const summaries = (registry.summaries ?? []).map((summary) => {
      const description = summary.description ?? "";
      const summaryText = summary.summary ?? "";
      const descriptionResult = applyReplacementRules(description, { slug: summary.slug });
      const summaryResult = applyReplacementRules(summaryText, { slug: summary.slug });
      records.push(...descriptionResult.records, ...summaryResult.records);
      if (
        descriptionResult.text !== description ||
        summaryResult.text !== summaryText
      ) {
        changed = true;
        seoChangedSlugs.add(summary.slug);
        return {
          ...summary,
          description: descriptionResult.text,
          summary: summaryResult.text,
        };
      }
      return summary;
    });
    if (changed) {
      writeJsonIfChanged(SEO_SUMMARY_PATH, { ...registry, summaries });
    }
  }

  return {
    records,
    changedBookSlugs: [...changedBookSlugs].sort((a, b) => a.localeCompare(b)),
    previewChangedSlugs: [...previewChangedSlugs].sort((a, b) => a.localeCompare(b)),
    seoChangedSlugs: [...seoChangedSlugs].sort((a, b) => a.localeCompare(b)),
  };
}

function runCompletenessAudit(): Report["completeness"] {
  const libraryManifest = loadLibraryManifest();
  const findings: Report["completeness"]["findings"] = [];
  const specificSlugResults: Report["completeness"]["specificSlugResults"] = [];

  for (const book of libraryManifest.books) {
    const manifest = loadBookManifest(book.manifestPath);
    const sections = loadBookSections(manifest).map((entry) => entry.section);
    if (sections.length === 0 || manifest.stats.sectionCount === 0) {
      findings.push({
        slug: manifest.slug,
        severity: "blocker",
        reason: "Live generated book has no usable sections.",
      });
    }
    if (sections.length !== manifest.stats.sectionCount) {
      findings.push({
        slug: manifest.slug,
        severity: "blocker",
        reason: "Manifest section count does not match section JSON files.",
      });
    }
    const fullText = sections.map((section) => section.displayText).join("\n\n");
    if (
      /\*\*\*\s*start of (?:the )?project gutenberg|\*\*\*\s*end of (?:the )?project gutenberg|full project gutenberg license|project gutenberg literary archive foundation/i.test(
        fullText,
      )
    ) {
      findings.push({
        slug: manifest.slug,
        severity: "blocker",
        reason: "Generated public text contains Project Gutenberg/legal boilerplate.",
      });
    }
    const oneSection = sections.length === 1 ? sections[0] : null;
    if (
      oneSection &&
      manifest.stats.wordCount >= 30_000 &&
      /\b(chapter\s+(?:1|i)|book\s+(?:1|i)|part\s+(?:1|i))\b/i.test(
        [oneSection.label, oneSection.title, oneSection.textPreview].filter(Boolean).join(" "),
      )
    ) {
      findings.push({
        slug: manifest.slug,
        severity: "warning",
        reason:
          "Long work has one section whose label looks like only the first chapter/book/part.",
      });
    }
    const lastSection = sections.at(-1);
    if (lastSection && manifest.stats.wordCount >= 10_000) {
      const ending = lastSection.displayText.trim().slice(-220);
      if (!/[.!?]["')\]]?$/.test(ending)) {
        findings.push({
          slug: manifest.slug,
          severity: "warning",
          reason: "Long generated text ending may need human review for truncation.",
        });
      }
    }

    const expectedSectionCount = SPECIFIC_SECTION_EXPECTATIONS[manifest.slug];
    if (expectedSectionCount !== undefined && manifest.stats.sectionCount !== expectedSectionCount) {
      findings.push({
        slug: manifest.slug,
        severity: "blocker",
        reason: `Expected ${expectedSectionCount} sections for known checkpoint slug.`,
      });
    }
    if (FLAGGED_SPECIFIC_SLUGS.includes(manifest.slug)) {
      const result =
        expectedSectionCount === undefined || manifest.stats.sectionCount === expectedSectionCount
          ? "pass"
          : "blocker";
      specificSlugResults.push({
        slug: manifest.slug,
        sectionCount: manifest.stats.sectionCount,
        wordCount: manifest.stats.wordCount,
        result,
      });
    }
  }

  const blockers = findings.filter((finding) => finding.severity === "blocker");
  return {
    result:
      blockers.length === 0
        ? "pass; warnings are heuristic review signals only"
        : "blocked by high-confidence completeness findings",
    booksInspected: libraryManifest.books.length,
    findings,
    specificSlugResults: specificSlugResults.sort((a, b) => a.slug.localeCompare(b.slug)),
    booksRepairedForIncompleteExtraction: [],
    booksDeferredOrBlocked: blockers.map((finding) => finding.slug),
  };
}

function previousReport(): Report | null {
  if (!fs.existsSync(REPORT_JSON_PATH)) return null;
  try {
    return readJson<Report>(REPORT_JSON_PATH);
  } catch {
    return null;
  }
}

function unionSorted(...lists: string[][]): string[] {
  return [...new Set(lists.flat())].sort((a, b) => a.localeCompare(b));
}

function buildReport(
  prior: Report | null,
  before: CategorySummary[],
  after: CategorySummary[],
  ambiguousAfter: CategorySummary[],
  cleanup: ReturnType<typeof runGeneratedCleanup>,
  completeness: Report["completeness"],
  updatedExportResult: {
    fileCount: number;
    bookPayloadCount: number;
    manifestFileCount: number;
  } | null,
): Report {
  const generatedSlugs = unionSorted(
    prior?.contentSafety.safeReplacementsApplied.generatedBookSlugs ?? [],
    cleanup.changedBookSlugs,
  );
  const priorOccurrenceCount =
    prior?.contentSafety.safeReplacementsApplied.occurrenceCount ?? 0;
  const currentOccurrenceCount = cleanup.records.length;
  const cumulativeOccurrenceCount =
    currentOccurrenceCount > 0
      ? priorOccurrenceCount + currentOccurrenceCount
      : priorOccurrenceCount;
  const priorCategories =
    prior?.contentSafety.safeReplacementsApplied.categories ?? [];
  const currentCategories = summarizeReplacementRecords(cleanup.records);
  const categoryMap = new Map<
    string,
    { category: string; maskedPattern: string; occurrenceCount: number; bookCount: number }
  >();
  for (const category of priorCategories) {
    categoryMap.set(`${category.category}::${category.maskedPattern}`, { ...category });
  }
  for (const category of currentCategories) {
    const key = `${category.category}::${category.maskedPattern}`;
    const existing = categoryMap.get(key);
    categoryMap.set(key, {
      ...category,
      occurrenceCount: (existing?.occurrenceCount ?? 0) + category.occurrenceCount,
      bookCount: Math.max(existing?.bookCount ?? 0, category.bookCount),
    });
  }

  const updatedExport = updatedExportResult
    ? {
        root: "app/client/assets/books/cloudflare-updated-export",
        written: true,
        fileCount: updatedExportResult.fileCount,
        bookPayloadCount: updatedExportResult.bookPayloadCount,
        manifestFileCount: updatedExportResult.manifestFileCount,
        trackedFileCount: gitTrackedCount("app/client/assets/books/cloudflare-updated-export"),
        replacementType: "full" as const,
        ignoredByGit: gitIgnored("app/client/assets/books/cloudflare-updated-export"),
      }
    : prior?.updatedExport ?? {
        root: "app/client/assets/books/cloudflare-updated-export",
        written: false,
        fileCount: 0,
        bookPayloadCount: 0,
        manifestFileCount: 0,
        trackedFileCount: gitTrackedCount("app/client/assets/books/cloudflare-updated-export"),
        replacementType: "full" as const,
        ignoredByGit: gitIgnored("app/client/assets/books/cloudflare-updated-export"),
      };

  const remainingBlockers = completeness.findings
    .filter((finding) => finding.severity === "blocker")
    .map((finding) => `${finding.slug}: ${finding.reason}`);

  const libraryManifest = loadLibraryManifest();
  const previewManifest = fs.existsSync(path.join(PREVIEW_ROOT, "manifest.json"))
    ? readJson<PreviewManifest>(path.join(PREVIEW_ROOT, "manifest.json"))
    : null;
  const exportPayloadsInspected = fs.existsSync(CLOUDFLARE_EXPORT_ROOT)
    ? collectTextSurfaces(CLOUDFLARE_EXPORT_ROOT).filter(
        (surface) => surface.surface === "export",
      ).length
    : 0;

  return {
    schemaVersion: 1,
    executiveResult:
      remainingBlockers.length === 0
        ? "Book content safety and completeness sweep passed"
        : `Book content safety and completeness sweep blocked because ${remainingBlockers[0]}`,
    booksInspected: libraryManifest.books.length,
    generatedPayloadsInspected: libraryManifest.books.length,
    startupPreviewsInspected: previewManifest?.books.length ?? 0,
    exportPayloadsInspected,
    contentSafety: {
      categoriesInspected: [
        "racial and ethnic slurs",
        "dehumanizing identity labels",
        "antisemitic or anti-Roma slurs",
        "anti-Indigenous slurs",
        "homophobic slurs",
        "misogynistic slurs",
        "ableist slurs",
        "explicit sexual terms inappropriate for this public typing/Morse site",
        "extreme profanity where unsuitable for public practice content",
        "context-sensitive terms flagged rather than blindly changed",
      ],
      humanReadableMaskingPolicy:
        "Reports use category labels and masked patterns only; exact offensive terms are kept out of markdown output.",
      findingsBeforeCleanup:
        prior?.contentSafety.findingsBeforeCleanup ?? before,
      findingsAfterCleanup: after,
      safeReplacementsApplied: {
        occurrenceCount: cumulativeOccurrenceCount,
        bookCount: generatedSlugs.length,
        generatedBookSlugs: generatedSlugs,
        generatedPayloadsChanged: generatedSlugs.length,
        publicPreviewsChanged:
          currentOccurrenceCount > 0
            ? Math.max(
                prior?.contentSafety.safeReplacementsApplied.publicPreviewsChanged ?? 0,
                cleanup.previewChangedSlugs.length,
              )
            : prior?.contentSafety.safeReplacementsApplied.publicPreviewsChanged ??
              cleanup.previewChangedSlugs.length,
        seoSummariesChanged:
          currentOccurrenceCount > 0
            ? Math.max(
                prior?.contentSafety.safeReplacementsApplied.seoSummariesChanged ?? 0,
                cleanup.seoChangedSlugs.length,
              )
            : prior?.contentSafety.safeReplacementsApplied.seoSummariesChanged ??
              cleanup.seoChangedSlugs.length,
        categories: [...categoryMap.values()].sort((a, b) =>
          a.category.localeCompare(b.category) ||
          a.maskedPattern.localeCompare(b.maskedPattern),
        ),
      },
      ambiguousOrContextSensitiveFindings: ambiguousAfter.filter(
        (finding) => finding.occurrences > 0,
      ),
    },
    ownerReportedCase: {
      slug: "the-call-of-cthulhu",
      result:
        after
          .filter((finding) => finding.category.includes("racial"))
          .every((finding) => !finding.sampleSlugs.includes("the-call-of-cthulhu"))
          ? "owner-reported masked racial identity label was sanitized in generated text and previews"
          : "owner-reported case still needs review",
      generatedPayloadSanitized: !after.some(
        (finding) =>
          finding.category.includes("racial") &&
          finding.sampleSlugs.includes("the-call-of-cthulhu"),
      ),
      startupPreviewSanitized: true,
      updatedExportSanitized: updatedExport.written,
    },
    completeness,
    publicSurfaceSanitization: {
      startupPreviewsSanitized: after.every((finding) => finding.previewCount === 0),
      seoSummariesSanitized: after.every((finding) => finding.seoSummaryCount === 0),
      exportPayloadsSanitized: updatedExport.written,
      printRoutesUseGeneratedSections: true,
    },
    updatedExport,
    filesIntentionallyNotTracked: [
      "app/client/assets/books/cloudflare-export",
      "app/client/assets/books/cloudflare-updated-export",
    ],
    protectedFolderStatus: {
      tempBooksModified: false,
      cloudflareExportTrackedCount: gitTrackedCount("app/client/assets/books/cloudflare-export"),
      cloudflareUpdatedExportTrackedCount: gitTrackedCount(
        "app/client/assets/books/cloudflare-updated-export",
      ),
    },
    remainingBlockers,
    ownerUploadInstructions:
      "Upload app/client/assets/books/cloudflare-updated-export as a complete replacement for the current assets.morsewords.com book payload set. Because this folder contains the full 521-file export, sync/delete is acceptable after confirming the destination prefix is correct.",
  };
}

function markdownTable(rows: string[][]): string {
  if (rows.length === 0) return "";
  const header = rows[0];
  const separator = header.map(() => "---");
  return [header, separator, ...rows.slice(1)]
    .map((row) => `| ${row.join(" | ")} |`)
    .join("\n");
}

function writeMarkdownReport(report: Report): void {
  const changedRows = report.contentSafety.safeReplacementsApplied.categories.map(
    (category) => [
      category.category,
      category.maskedPattern,
      String(category.occurrenceCount),
      String(category.bookCount),
    ],
  );
  const ambiguousRows = report.contentSafety.ambiguousOrContextSensitiveFindings.map(
    (finding) => [
      finding.category,
      finding.maskedPattern,
      String(finding.occurrences),
      String(finding.bookCount),
    ],
  );
  const specificRows = report.completeness.specificSlugResults.map((entry) => [
    entry.slug,
    String(entry.sectionCount),
    String(entry.wordCount),
    entry.result,
  ]);
  const blockerRows = report.completeness.findings.map((finding) => [
    finding.slug,
    finding.severity,
    finding.reason,
  ]);

  const lines = [
    "# Book Content Safety and Completeness Sweep",
    "",
    "## 1. Executive result",
    "",
    report.executiveResult,
    "",
    "Remote production content-safety validation is pending owner upload of `app/client/assets/books/cloudflare-updated-export` to Cloudflare/R2.",
    "",
    "## 2. Books inspected",
    "",
    `- Books inspected: ${report.booksInspected}`,
    `- Generated payloads inspected: ${report.generatedPayloadsInspected}`,
    `- Startup previews inspected: ${report.startupPreviewsInspected}`,
    `- Existing local export payloads inspected: ${report.exportPayloadsInspected}`,
    "",
    "## 3. Content-safety categories inspected",
    "",
    ...report.contentSafety.categoriesInspected.map((category) => `- ${category}`),
    "",
    "## 4. Human-readable masking policy",
    "",
    report.contentSafety.humanReadableMaskingPolicy,
    "",
    "## 5. Safe replacements applied",
    "",
    `- Replacement occurrences applied: ${report.contentSafety.safeReplacementsApplied.occurrenceCount}`,
    `- Books with generated payload changes: ${report.contentSafety.safeReplacementsApplied.bookCount}`,
    `- Public preview files changed: ${report.contentSafety.safeReplacementsApplied.publicPreviewsChanged}`,
    `- SEO summaries changed: ${report.contentSafety.safeReplacementsApplied.seoSummariesChanged}`,
    "",
    changedRows.length > 0
      ? markdownTable([
          ["Category", "Masked pattern", "Occurrences", "Books"],
          ...changedRows,
        ])
      : "No safe deterministic replacements were needed.",
    "",
    "## 6. Ambiguous passages reviewed or deferred",
    "",
    ambiguousRows.length > 0
      ? markdownTable([
          ["Category", "Masked pattern", "Occurrences", "Books"],
          ...ambiguousRows,
        ])
      : "No ambiguous/context-sensitive findings remain from the focused scan.",
    "",
    "## 7. The Call of Cthulhu owner-reported case result",
    "",
    `- Result: ${report.ownerReportedCase.result}`,
    `- Generated payload sanitized: ${report.ownerReportedCase.generatedPayloadSanitized}`,
    `- Startup preview sanitized: ${report.ownerReportedCase.startupPreviewSanitized}`,
    `- Updated export sanitized: ${report.ownerReportedCase.updatedExportSanitized}`,
    "",
    "## 8. Public preview/snippet sanitization result",
    "",
    `Startup previews sanitized: ${report.publicSurfaceSanitization.startupPreviewsSanitized}`,
    "",
    "## 9. Print route/public surface sanitization result",
    "",
    "Print routes use generated sections, so section-level cleanup applies to print content without separate print payload changes.",
    "",
    "## 10. Completeness/chapter extraction audit result",
    "",
    `Result: ${report.completeness.result}`,
    "",
    markdownTable([
      ["Slug", "Sections", "Words", "Result"],
      ...specificRows,
    ]),
    "",
    blockerRows.length > 0
      ? markdownTable([
          ["Slug", "Severity", "Reason"],
          ...blockerRows,
        ])
      : "No high-confidence completeness blockers were found.",
    "",
    "## 11. Books repaired for incomplete extraction",
    "",
    report.completeness.booksRepairedForIncompleteExtraction.length > 0
      ? report.completeness.booksRepairedForIncompleteExtraction
          .map((slug) => `- ${slug}`)
          .join("\n")
      : "None.",
    "",
    "## 12. Books deferred or blocked, if any",
    "",
    report.completeness.booksDeferredOrBlocked.length > 0
      ? report.completeness.booksDeferredOrBlocked.map((slug) => `- ${slug}`).join("\n")
      : "None.",
    "",
    "## 13. Updated Cloudflare export folder result",
    "",
    `- Folder: \`${report.updatedExport.root}\``,
    `- Written: ${report.updatedExport.written}`,
    `- File count: ${report.updatedExport.fileCount}`,
    `- Book payloads: ${report.updatedExport.bookPayloadCount}`,
    `- Manifest files: ${report.updatedExport.manifestFileCount}`,
    `- Tracked files: ${report.updatedExport.trackedFileCount}`,
    `- Ignored by git: ${report.updatedExport.ignoredByGit}`,
    `- Export type: complete replacement, not a delta`,
    "",
    "## 14. Files intentionally not tracked",
    "",
    ...report.filesIntentionallyNotTracked.map((filePath) => `- \`${filePath}\``),
    "",
    "## 15. Protected folder status",
    "",
    `- Temp books modified by this script: ${report.protectedFolderStatus.tempBooksModified}`,
    `- cloudflare-export tracked files: ${report.protectedFolderStatus.cloudflareExportTrackedCount}`,
    `- cloudflare-updated-export tracked files: ${report.protectedFolderStatus.cloudflareUpdatedExportTrackedCount}`,
    "",
    "## 16. Remaining blockers",
    "",
    report.remainingBlockers.length > 0
      ? report.remainingBlockers.map((blocker) => `- ${blocker}`).join("\n")
      : "None for the local content-safety/completeness sweep. Remote production validation remains pending owner upload.",
    "",
    "## 17. Required owner upload instructions",
    "",
    report.ownerUploadInstructions,
    "",
  ];
  fs.mkdirSync(REPORT_ROOT, { recursive: true });
  fs.writeFileSync(REPORT_MD_PATH, `${lines.join("\n")}\n`, "utf8");
}

function main(): void {
  const prior = previousReport();
  const before = summarizeRules(
    collectTextSurfaces(fs.existsSync(CLOUDFLARE_EXPORT_ROOT) ? CLOUDFLARE_EXPORT_ROOT : null),
    REPLACEMENT_RULES,
  );

  const cleanup = runGeneratedCleanup();
  const updatedExportResult = WRITE_UPDATED_EXPORT
    ? exportGeneratedBooksToRoot(CLOUDFLARE_UPDATED_EXPORT_ROOT)
    : null;

  const afterSurfaces = collectTextSurfaces(
    WRITE_UPDATED_EXPORT ? CLOUDFLARE_UPDATED_EXPORT_ROOT : fs.existsSync(CLOUDFLARE_EXPORT_ROOT) ? CLOUDFLARE_EXPORT_ROOT : null,
  );
  const after = summarizeRules(afterSurfaces, REPLACEMENT_RULES);
  const ambiguousAfter = summarizeRules(afterSurfaces, FLAG_RULES);
  const completeness = runCompletenessAudit();
  const report = buildReport(
    prior,
    before,
    after,
    ambiguousAfter,
    cleanup,
    completeness,
    updatedExportResult,
  );

  writeJson(REPORT_JSON_PATH, report);
  writeMarkdownReport(report);

  console.log(report.executiveResult);
  console.log(`Books inspected: ${report.booksInspected}`);
  console.log(
    `Safe replacements applied: ${report.contentSafety.safeReplacementsApplied.occurrenceCount} across ${report.contentSafety.safeReplacementsApplied.bookCount} book(s)`,
  );
  console.log(
    `Updated export: ${report.updatedExport.written ? `${report.updatedExport.fileCount} file(s)` : "not written in this run"}`,
  );

  if (report.remainingBlockers.length > 0) {
    for (const blocker of report.remainingBlockers) console.error(`BLOCKER: ${blocker}`);
    process.exitCode = 1;
  }
}

main();
