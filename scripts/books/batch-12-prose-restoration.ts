import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { cleanGutenbergText } from "./clean-gutenberg.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  normalizeBookText,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type JsonRecord = Record<string, any>;

type DryRunBook = {
  slug: string;
  sourceFileUsed: string;
  expectedStartBoundary: string;
};

type Comparison = {
  slug: string;
  sourceFile: string;
  exactMatch: boolean;
  mismatchClassification: string;
  omissionFound: boolean;
  correctionMade: boolean;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const dryRunPath = path.join(auditRoot, "pilot-dry-run-12/pilot-dry-run-12.json");
const reportRoot = path.join(auditRoot, "batch-12-prose-restoration");
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const ALL_BATCH_12 = [
  "ole-luk-oie-the-dream-god",
  "clever-hans",
  "the-fisherman-and-his-wife",
  "the-story-of-the-old-man-who-made-withered-trees-to-flower",
  "the-story-of-urashima-taro-the-fisher-lad",
  "the-story-of-the-man-who-did-not-wish-to-die",
  "the-happy-hunter-and-the-skillful-fisher",
  "the-conceited-apple-branch",
  "the-darning-needle",
  "the-greenies",
  "the-loving-pair",
  "little-ida-s-flowers",
  "the-roses-and-the-sparrows",
  "the-steadfast-tin-soldier",
  "shock-tactics",
  "canossa",
  "the-oversight",
  "the-penance",
  "mark",
  "quail-seed",
] as const;

const ORIGINAL_CORRECTED_TARGETS = [
  "ole-luk-oie-the-dream-god",
  "the-story-of-the-old-man-who-made-withered-trees-to-flower",
  "the-conceited-apple-branch",
  "little-ida-s-flowers",
  "the-steadfast-tin-soldier",
] as const;

const ADDITIONAL_CORRECTED_TARGETS = [
  "the-fisherman-and-his-wife",
  "the-greenies",
  "shock-tactics",
  "canossa",
  "the-oversight",
  "quail-seed",
] as const;

const TARGETS: ReadonlySet<string> = new Set([
  ...ORIGINAL_CORRECTED_TARGETS,
  ...ADDITIONAL_CORRECTED_TARGETS,
]);

const EXPECTED_RESTORED_SNIPPETS: Record<string, string[]> = {
  "ole-luk-oie-the-dream-god": [
    "by he caught hold of one side of the sugar heart and held it fast, and",
  ],
  "the-story-of-the-old-man-who-made-withered-trees-to-flower": [
    "by erect with pride and looking fondly at his master as if to say, “You",
  ],
  "the-conceited-apple-branch": [
    "By and by an old woman came into the field and, with a blunt knife",
    "by Heaven with another kind of loveliness, and although they differ in",
  ],
  "little-ida-s-flowers": [
    "\"MY POOR flowers are quite faded!\"",
    "music with them. Wild hyacinths and little white snowdrops jingled merry",
  ],
  "the-steadfast-tin-soldier": [
    "by grief, no one could say. He looked at the little lady, she looked at",
  ],
  "the-fisherman-and-his-wife": [
    "by the seaside. The fisherman used to go out all day long a-fishing; and",
  ],
  "the-greenies": [
    "by this pretty name. It is only human beings who do not. They give us",
  ],
  "shock-tactics": [
    "by this one splendid haul.",
    "By the time Bertie arrived his mother had discussed every possible and",
  ],
  canossa: ["musicians’ strike on, I suppose you know.”"],
  "the-oversight": ["“It’s like a Chinese puzzle"],
  "quail-seed": ["“The outlook is not encouraging for us smaller businesses"],
};

const EXPECTED_DEFECTS: Record<string, string> = {
  "ole-luk-oie-the-dream-god": "wrapped-line prose omission",
  "the-story-of-the-old-man-who-made-withered-trees-to-flower":
    "wrapped-line prose omission",
  "the-conceited-apple-branch": "two wrapped-line prose omissions",
  "little-ida-s-flowers": "missing opening quotation mark and wrapped-line prose omission",
  "the-steadfast-tin-soldier": "wrapped-line prose omission",
  "the-fisherman-and-his-wife":
    "wrapped-line prose omission",
  "the-greenies":
    "wrapped-line prose omission",
  "shock-tactics": "two wrapped-line prose omissions",
  canossa: "wrapped-line prose omission",
  "the-oversight": "opening curly quotation mark omitted at the selected start boundary",
  "quail-seed": "opening curly quotation mark omitted at the selected start boundary",
};

const UNRESOLVED_SOURCE_BOOKS = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "jabberwocky",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-great-gatsby",
  "the-picture-of-dorian-gray",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
];

const KNOWN_SKIPPED_CASES = [
  "the-wind-in-the-willows",
  "the-two-magics-the-turn-of-the-screw-covering-end",
  "the-works-of-edgar-allan-poe",
];

function readJson<T = JsonRecord>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256Json(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function estimateTypingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 35));
}

function estimateListeningMinutes(morseCharacterEstimate: number): number {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function extractStartPhrase(boundary: string): string {
  const marker = "start at first readable prose after source/title/byline wrapper: ";
  const markerIndex = boundary.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Unrecognized batch-12 start boundary: ${boundary}`);
  return boundary.slice(markerIndex + marker.length).trim();
}

function sanitizeReadableBody(input: string): string {
  let text = normalizeBookText(input);
  text = text.replace(
    /\[\s*(?:Illustration|Image|Plate|Decorative image|Music|Advertisement|Sidenote)\b[\s\S]*?\]/gi,
    "",
  );
  text = text.replace(
    /^\s*(?:Illustration|Image|Plate|Decorative image|Music|Advertisement|Sidenote)(?:\s+(?:No\.?\s*)?(?:\d+|[IVXLCDM]+)\b|:)[^\n]*\s*$/gm,
    "",
  );
  text = text.replace(/\[(?:Pg\.?\s*)?\d+\]/gi, "");
  text = text.replace(/\[(?:[A-Z])?\d+\]/g, "");
  text = text.replace(/^\s*THE END\s*$/gim, "");
  text = text.replace(
    /^\s*_?By\s+[A-Z][\p{L}'’.-]*(?:\s+(?:and|[A-Z][\p{L}'’.-]*)){1,7}_?\s*$/gmu,
    "",
  );
  text = text.replace(/^\s*(?:\*\s*){3,}\s*$/gim, "");
  return trimBookText(text.replace(/\n{4,}/g, "\n\n\n"));
}

function expectedReadableBody(dryRun: DryRunBook): { rawText: string; body: string } {
  const rawPath = path.resolve(repoRoot, dryRun.sourceFileUsed);
  const rawText = fs.readFileSync(rawPath, "utf8");
  const cleaned = cleanGutenbergText(rawText).cleanedText;
  const startPhrase = extractStartPhrase(dryRun.expectedStartBoundary);
  let start = cleaned.indexOf(startPhrase);
  if (start < 0) {
    throw new Error(`${dryRun.slug}: dry-run start phrase not found in cleaned raw source.`);
  }
  const preceding = cleaned[start - 1] ?? "";
  if (/^[\"'“‘]$/.test(preceding)) start -= 1;
  return { rawText, body: sanitizeReadableBody(cleaned.slice(start)) };
}

function bodyForSlug(slug: string): { manifest: JsonRecord; section: JsonRecord; text: string } {
  const manifestPath = path.join(generatedRoot, slug, "manifest.json");
  const manifest = readJson(manifestPath);
  if (manifest.sections.length !== 1) {
    throw new Error(`${slug}: expected one batch-12 story section, found ${manifest.sections.length}.`);
  }
  const section = readJson(path.join(generatedRoot, slug, manifest.sections[0].sectionJsonPath));
  return { manifest, section, text: section.displayText };
}

function buildContentHash(manifest: JsonRecord, text: string): string {
  const summary = manifest.sections[0];
  return sha256Json({
    slug: manifest.slug,
    title: manifest.title,
    author: manifest.author,
    sections: [
      {
        kind: summary.kind,
        label: summary.label,
        title: summary.title,
        includeByDefault: summary.includeByDefault,
        text,
      },
    ],
  });
}

function makePreviewAsset(manifest: JsonRecord, section: JsonRecord): JsonRecord {
  const targetMorseCharacters = 900 * 60;
  const joined = section.displayText as string;
  const totalMorse = section.morseCharacterEstimate as number;
  const truncated = totalMorse > targetMorseCharacters;
  let previewText = joined;
  if (truncated) {
    const ratio = Math.min(1, targetMorseCharacters / Math.max(1, totalMorse));
    const targetChars = Math.max(1_000, Math.floor(joined.length * ratio));
    const paragraphBreak = joined.lastIndexOf("\n\n", targetChars);
    previewText = trimBookText(
      joined.slice(0, paragraphBreak > 1_000 ? paragraphBreak : targetChars),
    );
  }
  const morseEstimate = estimateMorseCharacters(previewText);
  const wordCount = countBookWords(previewText);
  return {
    version: 1,
    slug: manifest.slug,
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
    defaultSectionId: section.sectionId,
    defaultSectionKind: section.kind,
    defaultSectionLabel: section.label,
    defaultSectionTitle: section.title,
    previewText,
    estimatedRuntimeSeconds: Math.ceil((morseEstimate / 900) * 60),
    wordCount,
    characterCount: previewText.length,
    estimatedTypingMinutes: estimateTypingMinutes(wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(morseEstimate),
    morseCharacterEstimate: morseEstimate,
    textPreview: textPreview(previewText),
    truncated,
  };
}

function restoreTarget(slug: string, expectedText: string): {
  generatedFiles: string[];
  previewFile: string;
  correctionMade: boolean;
} {
  const bookRoot = path.join(generatedRoot, slug);
  const manifestPath = path.join(bookRoot, "manifest.json");
  const manifest = readJson(manifestPath);
  const summary = manifest.sections[0];
  const sectionPath = path.join(bookRoot, summary.sectionJsonPath);
  const section = readJson(sectionPath);
  const correctionMade = section.displayText !== expectedText;

  for (const snippet of EXPECTED_RESTORED_SNIPPETS[slug]) {
    if (!expectedText.includes(snippet)) {
      throw new Error(`${slug}: expected source-backed restoration snippet not found: ${snippet}`);
    }
  }

  const wordCount = countBookWords(expectedText);
  const characterCount = expectedText.length;
  const morseCharacterEstimate = estimateMorseCharacters(expectedText);
  const estimatedTypingMinutes = estimateTypingMinutes(wordCount);
  const estimatedListeningMinutes = estimateListeningMinutes(morseCharacterEstimate);
  const preview = textPreview(expectedText);

  section.displayText = expectedText;
  section.morseSourceText = expectedText;
  section.paragraphs = splitParagraphs(expectedText);
  section.wordCount = wordCount;
  section.characterCount = characterCount;
  section.estimatedTypingMinutes = estimatedTypingMinutes;
  section.estimatedListeningMinutes = estimatedListeningMinutes;
  section.morseCharacterEstimate = morseCharacterEstimate;
  section.unsupportedCharacterSummary = summarizeUnsupportedCharacters(expectedText);
  section.textPreview = preview;

  const contentHash = buildContentHash(manifest, expectedText);
  const contentVersion = contentHash.slice(0, 16);
  manifest.contentHash = contentHash;
  manifest.contentVersion = contentVersion;
  manifest.stats.cleanedCharacterCount = characterCount;
  manifest.stats.wordCount = wordCount;
  summary.characterCount = characterCount;
  summary.wordCount = wordCount;
  summary.estimatedTypingMinutes = estimatedTypingMinutes;
  summary.estimatedListeningMinutes = estimatedListeningMinutes;
  summary.morseCharacterEstimate = morseCharacterEstimate;
  summary.textPreview = preview;
  const restorationWarning =
    "Batch-12 prose restoration recovered source-backed readable text removed by the earlier over-broad cleanup rule.";
  if (!manifest.warnings.includes(restorationWarning)) manifest.warnings.push(restorationWarning);
  if (!manifest.cleaning.warnings.includes(restorationWarning)) {
    manifest.cleaning.warnings.push(restorationWarning);
  }

  const cleanedPath = path.join(bookRoot, "cleaned_book.json");
  const cleaned = readJson(cleanedPath);
  cleaned.contentHash = contentHash;
  cleaned.contentVersion = contentVersion;
  cleaned.stats.wordCount = wordCount;
  cleaned.stats.characterCount = characterCount;
  cleaned.stats.estimatedTypingMinutes = estimatedTypingMinutes;
  cleaned.stats.estimatedListeningMinutes = estimatedListeningMinutes;
  cleaned.sections[0].text = expectedText;
  cleaned.sections[0].wordCount = wordCount;
  cleaned.sections[0].characterCount = characterCount;
  cleaned.sections[0].estimatedTypingMinutes = estimatedTypingMinutes;
  cleaned.sections[0].estimatedListeningMinutes = estimatedListeningMinutes;

  const processedPath = path.join(bookRoot, "processed_book.json");
  const processed = readJson(processedPath);
  processed.content_hash = contentHash;
  processed.content_version = contentVersion;
  processed.content.chapters[0].sections[0].text = expectedText;

  const notesPath = path.join(bookRoot, "processing_notes.md");
  let notes = fs.readFileSync(notesPath, "utf8").replace(
    /\n## Batch-12 prose restoration[\s\S]*$/,
    "",
  );
  notes = `${notes.trimEnd()}\n\n## Batch-12 prose restoration\n\n- Restored source-backed prose removed by the earlier over-broad cleanup rule.\n- Final generated readable body matches the sanitized raw tale body character-for-character.\n- No source, title, table-of-contents, license, contributor, transcriber, byline, or parent-collection material was introduced.\n`;

  writeJson(sectionPath, section);
  writeJson(manifestPath, manifest);
  writeJson(cleanedPath, cleaned);
  writeJson(processedPath, processed);
  fs.writeFileSync(notesPath, notes, "utf8");

  const previewAsset = makePreviewAsset(manifest, section);
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  writeJson(previewPath, previewAsset);

  return {
    generatedFiles: [manifestPath, cleanedPath, processedPath, notesPath, sectionPath].map(
      (filePath) => path.relative(repoRoot, filePath).replaceAll("\\", "/"),
    ),
    previewFile: path.relative(repoRoot, previewPath).replaceAll("\\", "/"),
    correctionMade,
  };
}

function updateSharedManifests() {
  const library = readJson(libraryManifestPath);
  const previewManifest = readJson(previewManifestPath);
  for (const slug of TARGETS) {
    const manifest = readJson(path.join(generatedRoot, slug, "manifest.json"));
    const libraryIndex = library.books.findIndex((book: JsonRecord) => book.slug === slug);
    if (libraryIndex < 0) throw new Error(`${slug}: missing from generated library manifest.`);
    library.books[libraryIndex] = {
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
      manifestPath: `${slug}/manifest.json`,
    };

    const preview = readJson(path.join(previewRoot, `${slug}.preview.json`));
    const previewIndex = previewManifest.books.findIndex((book: JsonRecord) => book.slug === slug);
    if (previewIndex < 0) throw new Error(`${slug}: missing from preview manifest.`);
    const serialized = `${JSON.stringify(preview, null, 2)}\n`;
    previewManifest.books[previewIndex] = {
      slug,
      path: `/book-previews/${slug}.preview.json`,
      contentVersion: preview.contentVersion,
      contentHash: preview.contentHash,
      defaultSectionId: preview.defaultSectionId,
      previewBytes: Buffer.byteLength(serialized),
      previewCharacterCount: preview.characterCount,
      estimatedRuntimeSeconds: preview.estimatedRuntimeSeconds,
      truncated: preview.truncated,
    };
  }
  writeJson(libraryManifestPath, library);
  writeJson(previewManifestPath, previewManifest);
}

function excerpt(value: string, max = 105): string {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length <= max ? compact : `${compact.slice(0, max - 3)}...`;
}

function makeMarkdown(report: JsonRecord): string {
  const targetRows = report.targets
    .map(
      (book: JsonRecord) =>
        `| \`${book.slug}\` | ${book.restorationPass} | ${book.defectType} | ${book.exactRestoredProseSnippets.join("<br>")} | ${book.previewImpact} |`,
    )
    .join("\n");
  const comparisonRows = report.allBatch12Comparisons
    .map(
      (book: JsonRecord) =>
        `| \`${book.slug}\` | ${book.rawVsGeneratedBodyComparisonResult} | ${book.correctedHere ? "yes" : "no"} |`,
    )
    .join("\n");
  return `# Batch-12 prose restoration\n\n` +
    `Eleven batch-12 books have now been corrected from their audited raw source: the original five from the first restoration pass and six additional documented defects. All twenty batch-12 readable bodies now match their narrowly sanitized raw tale bodies character-for-character.\n\n` +
    `- Total corrected batch-12 books: ${report.scope.correctedBatch12BooksTotal}\n` +
    `- Original first-pass corrections: ${report.scope.originalCorrectedTargets.length}\n` +
    `- Additional corrections in this pass: ${report.scope.additionalCorrectedTargets.length}\n` +
    `- Remaining batch-12 prose omissions: ${report.scope.remainingBatch12ProseOmissions}\n` +
    `- Remaining missing opening-quote defects: ${report.scope.remainingMissingOpeningQuoteDefects}\n\n` +
    `## Corrected books\n\n` +
    `| Slug | Restoration pass | Defect type | Restored excerpt | Preview impact |\n| --- | --- | --- | --- | --- |\n${targetRows}\n\n` +
    `The excerpts above are intentionally short and source-backed. They do not include title, table-of-contents, source, license, transcriber, contributor, byline, or parent-collection material.\n\n` +
    `## All 20 batch-12 comparisons\n\n` +
    `| Slug | Raw/generated body comparison | Corrected on this branch |\n| --- | --- | --- |\n${comparisonRows}\n\n` +
    `The all-20 comparison is a hard verifier check. Any remaining wrapped-line omission, missing opening punctuation, or other sanitized raw/generated body mismatch fails \`npm run books:batch-12-prose-restore\`.\n\n` +
    `## Scope and protections\n\n` +
    `- Raw sources were read only and were not modified.\n` +
    `- Cloudflare exports were not modified.\n` +
    `- The 11 unresolved-source generated books were not touched.\n` +
    `- The three known duplicate/boundary skipped cases were not reintroduced.\n` +
    `- No unrelated generated book was modified.\n` +
    `- Dry-run batch 15 was not started.\n` +
    `- The current shared cleanup implementation uses the narrow media/byline rules introduced during write 14; this repair does not broadly refactor cleanup.\n`;
}

function main() {
  const dryRunReport = readJson(dryRunPath);
  const dryRunBooks = new Map<string, DryRunBook>(
    dryRunReport.books.map((book: DryRunBook) => [book.slug, book]),
  );
  const before = new Map<string, Comparison>();
  const expectedBodies = new Map<string, string>();

  for (const slug of ALL_BATCH_12) {
    const dryRun = dryRunBooks.get(slug);
    if (!dryRun) throw new Error(`${slug}: missing from batch-12 dry-run report.`);
    const expected = expectedReadableBody(dryRun);
    const generated = bodyForSlug(slug).text;
    expectedBodies.set(slug, expected.body);
    before.set(slug, {
      slug,
      sourceFile: dryRun.sourceFileUsed,
      exactMatch: generated === expected.body,
      mismatchClassification:
        generated === expected.body
          ? "exact character-for-character match after intentional artifact cleanup"
          : EXPECTED_DEFECTS[slug] ?? "unexpected sanitized raw/generated body mismatch",
      omissionFound: generated !== expected.body,
      correctionMade: false,
    });
  }

  const correctionResults = new Map<string, ReturnType<typeof restoreTarget>>();
  for (const slug of TARGETS) {
    correctionResults.set(slug, restoreTarget(slug, expectedBodies.get(slug)!));
  }
  updateSharedManifests();

  const after = ALL_BATCH_12.map((slug) => {
    const result = bodyForSlug(slug);
    return { slug, exact: result.text === expectedBodies.get(slug) };
  });
  const remainingMismatches = after.filter((entry) => !entry.exact);
  if (remainingMismatches.length > 0) {
    throw new Error(
      `Remaining batch-12 raw-vs-generated body mismatches: ${remainingMismatches
        .map((entry) => entry.slug)
        .join(", ")}`,
    );
  }

  const targets = [...TARGETS].map((slug) => {
    const dryRun = dryRunBooks.get(slug)!;
    const result = correctionResults.get(slug)!;
    const previewPath = path.join(previewRoot, `${slug}.preview.json`);
    const preview = readJson(previewPath);
    const expected = expectedBodies.get(slug)!;
    return {
      slug,
      sourceFile: dryRun.sourceFileUsed,
      restorationPass: ADDITIONAL_CORRECTED_TARGETS.includes(slug as any)
        ? "additional follow-up"
        : "original first pass",
      defectType: EXPECTED_DEFECTS[slug],
      generatedFilesInspected: result.generatedFiles,
      previewInspected: result.previewFile,
      omittedProseFound: EXPECTED_RESTORED_SNIPPETS[slug].map((snippet) => excerpt(snippet)),
      exactRestoredProseSnippets: EXPECTED_RESTORED_SNIPPETS[slug].map((snippet) =>
        excerpt(snippet),
      ),
      correctionMade: result.correctionMade,
      correctionSummary:
        "restored only source-backed readable prose/punctuation and synchronized derived generated artifacts",
      rawVsGeneratedBodyComparisonAfterCorrection:
        bodyForSlug(slug).text === expected
          ? "pass: exact character-for-character match after intentional artifact cleanup"
          : "fail",
      previewImpact: result.correctionMade
        ? "preview rebuilt for the corrected content hash; opening/default text remains real, book-specific readable content"
        : "preview already reflected the corrected content hash; opening/default text remains real, book-specific readable content",
      startupPreviewValid:
        preview.previewText.length >= 400 &&
        !/SOS Help!|Type text here|Project Gutenberg|Table of Contents/i.test(preview.previewText),
      finalStatus: "corrected pass",
    };
  });

  const allBatch12Comparisons = ALL_BATCH_12.map((slug) => {
    const comparison = before.get(slug)!;
    const exactAfter = after.find((entry) => entry.slug === slug)!.exact;
    return {
      slug,
      sourceFile: comparison.sourceFile,
      rawVsGeneratedBodyComparisonBeforeCorrection: comparison.exactMatch
        ? comparison.mismatchClassification
        : `mismatch: ${comparison.mismatchClassification}`,
      rawVsGeneratedBodyComparisonResult: exactAfter
        ? "pass: exact character-for-character match after intentional artifact cleanup"
        : `fail: ${comparison.mismatchClassification}`,
      correctedHere: TARGETS.has(slug),
    };
  });

  const report = {
    reportName: "Batch-12 prose restoration",
    scope: {
      batch12BooksCompared: ALL_BATCH_12.length,
      correctedBatch12BooksTotal: targets.length,
      originalCorrectedTargets: [...ORIGINAL_CORRECTED_TARGETS],
      additionalCorrectedTargets: [...ADDITIONAL_CORRECTED_TARGETS],
      authorizedTargets: [...TARGETS],
      targetsCorrected: targets.filter((book) => book.finalStatus === "corrected pass").length,
      remainingBatch12ProseOmissions: 0,
      remainingMissingOpeningQuoteDefects: 0,
      remainingBatch12RawVsGeneratedMismatches: remainingMismatches.length,
    },
    targets,
    allBatch12Comparisons,
    intentionalCleanupClassifications: [
      "bracketed illustration/image placeholders removed",
      "standalone decorative star dividers removed",
      "numeric footnote markers removed without removing their readable note prose",
      "Project Gutenberg/source/license wrapper excluded",
    ],
    protections: {
      rawSourcesModified: false,
      cloudflareExportModified: false,
      unresolvedSourceGeneratedBooksTouched: false,
      unresolvedSourceGeneratedBooks: UNRESOLVED_SOURCE_BOOKS,
      knownDuplicateBoundaryCasesReintroduced: false,
      knownDuplicateBoundaryCases: KNOWN_SKIPPED_CASES,
      unrelatedGeneratedBooksModified: false,
      dryRunBatch15Started: false,
    },
    implementationNote:
      "The current shared writer already contains the narrowed standalone-media and byline cleanup rules adopted during write 14. This command restores the eleven known batch-12 prose/punctuation defects and does not broadly rewrite cleanup.",
  };

  fs.mkdirSync(reportRoot, { recursive: true });
  writeJson(path.join(reportRoot, "batch-12-prose-restoration.json"), report);
  fs.writeFileSync(
    path.join(reportRoot, "batch-12-prose-restoration.md"),
    makeMarkdown(report),
    "utf8",
  );

  console.log("Batch-12 prose restoration complete.");
  console.log(`Batch-12 books compared: ${ALL_BATCH_12.length}`);
  console.log(`Authorized targets corrected/pass: ${targets.length}`);
  console.log(`Additional targets corrected/pass: ${ADDITIONAL_CORRECTED_TARGETS.length}`);
  console.log(`All batch-12 raw/generated exact matches: ${after.filter((entry) => entry.exact).length}/${after.length}`);
}

main();
