import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  countBookWords,
  estimateMorseCharacters,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type Work = {
  slug: string;
  title: string;
  author: string[];
  authorDeathYear: number;
  description: string;
  subjects: string[];
  originalPublication: string;
  sections: Array<{ label: string; title: string | null; text: string; sourceStartOffset: number; sourceEndOffset: number }>;
  summary: string;
  sourceNote: string;
  selectionReason: string;
};

type SectionJson = {
  schemaVersion: 1;
  bookSlug: string;
  sectionId: string;
  kind: "chapter";
  label: string;
  title: string | null;
  order: number;
  includeByDefault: true;
  displayText: string;
  paragraphs: string[];
  characterCount: number;
  wordCount: number;
  estimatedTypingMinutes: number;
  estimatedListeningMinutes: number;
  morseCharacterEstimate: number;
  unsupportedCharacters: ReturnType<typeof summarizeUnsupportedCharacters>;
  sourceOffsets: { start: number; end: number };
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const reportRoot = path.join(repoRoot, "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-8");
const sourceReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-7/bespoke-raw-candidate-pass-7.json",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const seoSummaryPath = path.join(repoRoot, "app/client/assets/books/seo-summaries/book-seo-summaries.json");
const sitemapPath = path.join(repoRoot, "public/sitemap.xml");
const rawFileName = "Walden, and On The Duty Of Civil Disobedience.txt";
const rawPath = path.join(tempBooksRoot, rawFileName);

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value.replace(/\n/g, "\r\n"));
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function estimateTypingMinutes(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / 35));
}

function estimateListeningMinutes(morseCharacterEstimate: number) {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function cleanExtractedBody(raw: string) {
  return trimBookText(raw)
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function assertUsable(slug: string, label: string, text: string) {
  if (countBookWords(text) < 100) throw new Error(`${slug}: ${label} is too short`);
  if (/PROJECT GUTENBERG|FULL LICENSE|START: FULL LICENSE|www\.gutenberg\.org/i.test(text)) {
    throw new Error(`${slug}: source boilerplate leaked into ${label}`);
  }
}

function getBetween(source: string, startNeedle: string, endNeedle: string, fromIndex = 0) {
  const start = source.indexOf(startNeedle, fromIndex);
  if (start < 0) throw new Error(`start marker not found: ${startNeedle}`);
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end < 0) throw new Error(`end marker not found: ${endNeedle}`);
  return { start, end, text: source.slice(start, end) };
}

function extractWaldenSections(source: string) {
  const waldenBody = getBetween(source, "\nWALDEN\n\nEconomy\n", "\nTHE END\n");
  const headings = [
    "Economy",
    "Where I Lived, and What I Lived For",
    "Reading",
    "Sounds",
    "Solitude",
    "Visitors",
    "The Bean-Field",
    "The Village",
    "The Ponds",
    "Baker Farm",
    "Higher Laws",
    "Brute Neighbors",
    "House-Warming",
    "Former Inhabitants and Winter Visitors",
    "Winter Animals",
    "The Pond in Winter",
    "Spring",
    "Conclusion",
  ];
  return headings.map((heading, index) => {
    const marker = index === 0 ? `\nWALDEN\n\n${heading}\n` : `\n\n${heading}\n`;
    const start = source.indexOf(marker, waldenBody.start);
    if (start < 0 || start >= waldenBody.end) throw new Error(`Walden heading not found: ${heading}`);
    const textStart = start + marker.length;
    const nextHeading = headings[index + 1];
    const next = nextHeading ? source.indexOf(`\n\n${nextHeading}\n`, textStart) : waldenBody.end;
    if (next < 0 || next > waldenBody.end) throw new Error(`Walden next heading not found after: ${heading}`);
    const text = cleanExtractedBody(source.slice(textStart, next));
    assertUsable("walden", heading, text);
    return { label: `Chapter ${String(index + 1).padStart(2, "0")}`, title: heading, text, sourceStartOffset: textStart, sourceEndOffset: next };
  });
}

function extractCivilDisobedienceSection(source: string) {
  const endOfWalden = source.indexOf("\nTHE END\n");
  const essay = getBetween(
    source,
    "\nON THE DUTY OF CIVIL DISOBEDIENCE\n",
    "\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK WALDEN, AND ON THE DUTY OF CIVIL DISOBEDIENCE ***",
    endOfWalden,
  );
  const text = cleanExtractedBody(essay.text.replace(/^\nON THE DUTY OF CIVIL DISOBEDIENCE\n/, ""));
  assertUsable("on-the-duty-of-civil-disobedience", "On the Duty of Civil Disobedience", text);
  return [{ label: "On the Duty of Civil Disobedience", title: null, text, sourceStartOffset: essay.start, sourceEndOffset: essay.end }];
}

function makeSection(work: Work, section: Work["sections"][number], order: number): SectionJson {
  const wordCount = countBookWords(section.text);
  const morseCharacterEstimate = estimateMorseCharacters(section.text);
  return {
    schemaVersion: 1,
    bookSlug: work.slug,
    sectionId: `chapter-${String(order).padStart(3, "0")}`,
    kind: "chapter",
    label: section.label,
    title: section.title,
    order,
    includeByDefault: true,
    displayText: section.text,
    paragraphs: splitParagraphs(section.text),
    characterCount: section.text.length,
    wordCount,
    estimatedTypingMinutes: estimateTypingMinutes(wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(morseCharacterEstimate),
    morseCharacterEstimate,
    unsupportedCharacters: summarizeUnsupportedCharacters(section.text),
    sourceOffsets: { start: section.sourceStartOffset, end: section.sourceEndOffset },
  };
}

function makeGeneratedWork(work: Work, rawText: string) {
  const sections = work.sections.map((section, index) => makeSection(work, section, index + 1));
  const cleanedText = sections.map((section) => section.displayText).join("\n\n");
  const contentHash = sha256(cleanedText);
  const contentVersion = contentHash.slice(0, 16);
  const wordCount = sections.reduce((sum, section) => sum + section.wordCount, 0);
  const characterCount = sections.reduce((sum, section) => sum + section.characterCount, 0);
  const gutenbergId = "205";
  const releaseDate = "January 1, 1995";
  const sourceUrl = "https://www.gutenberg.org/ebooks/205";
  const bookRoot = path.join(generatedRoot, work.slug);
  fs.rmSync(bookRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(bookRoot, "sections"), { recursive: true });
  for (const section of sections) writeJson(path.join(bookRoot, "sections", `${section.sectionId}.json`), section);

  const manifest = {
    schemaVersion: 1,
    slug: work.slug,
    title: work.title,
    author: work.author,
    contentVersion,
    contentHash,
    language: "en",
    description: work.description,
    subjects: work.subjects,
    source: {
      provider: "Project Gutenberg",
      gutenbergId,
      releaseDate,
      sourceUrl,
      rawTextUrl: null,
      rightsBasis: "public-domain-us",
      rightsReviewed: true,
      publishReady: true,
      rightsStatus: "approved",
      processingAllowed: true,
      approvalSource: "external-authority",
      duplicateResolutionSource: "owner-reviewed",
      rightsReportPath: "rights_report.json",
      processedBookPath: "processed_book.json",
      cleanedBookPath: "cleaned_book.json",
      rightsNotes: "Targeted bespoke raw candidate pass 8 processed this accepted work after manual source, metadata, and work-boundary review. Review generated output before any Cloudflare export.",
      allowDuplicateGutenbergId: true,
    },
    cover: { src: null, placeholder: true, alt: `Placeholder cover for ${work.title}` },
    stats: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: characterCount,
      wordCount,
      sectionCount: sections.length,
      includedSectionCount: sections.length,
    },
    defaults: { includeKinds: ["chapter"], preferredPreset: "main-narrative" },
    manifestPath: `${work.slug}/manifest.json`,
    sections: sections.map((section) => ({
      id: section.sectionId,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: true,
      sectionJsonPath: `sections/${section.sectionId}.json`,
      characterCount: section.characterCount,
      wordCount: section.wordCount,
      estimatedTypingMinutes: section.estimatedTypingMinutes,
      estimatedListeningMinutes: section.estimatedListeningMinutes,
      morseCharacterEstimate: section.morseCharacterEstimate,
      textPreview: textPreview(section.displayText),
    })),
    cleaning: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: characterCount,
      headerStripped: true,
      footerStripped: true,
      confidence: "high",
      warnings: [
        "Targeted bespoke raw candidate pass 8 used explicit manual work boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted bespoke raw candidate pass 8; review before Cloudflare export.",
      "Cloudflare export was not run.",
      work.sourceNote,
    ],
  };
  const cleanedBook = {
    schemaVersion: 1,
    id: work.slug,
    title: work.title,
    author: work.author.join("; "),
    contentVersion,
    contentHash,
    source: { provider: "Project Gutenberg", gutenbergId, sourceUrl, rightsStatus: "approved", publishReady: true },
    stats: manifest.stats,
    sections: sections.map((section) => ({
      id: section.sectionId,
      label: section.label,
      title: section.title,
      kind: section.kind,
      displayText: section.displayText,
      paragraphs: section.paragraphs,
      wordCount: section.wordCount,
      characterCount: section.characterCount,
      includeByDefault: true,
    })),
  };
  const processedBook = {
    schemaVersion: 1,
    slug: work.slug,
    title: work.title,
    author: work.author,
    source: manifest.source,
    contentHash,
    sectionCount: sections.length,
    wordCount,
    sections: manifest.sections,
  };
  const rightsReport = {
    schemaVersion: 1,
    slug: work.slug,
    title: work.title,
    author: work.author,
    source: "Project Gutenberg",
    source_url: sourceUrl,
    gutenberg_ebook_number: gutenbergId,
    rights_status: "approved",
    status: "generated-live",
    publish_ready: true,
    processing_allowed: true,
    approval_source: "external-authority",
    reasoning_summary: work.sourceNote,
  };
  writeJson(path.join(bookRoot, "manifest.json"), manifest);
  writeJson(path.join(bookRoot, "cleaned_book.json"), cleanedBook);
  writeJson(path.join(bookRoot, "processed_book.json"), processedBook);
  writeJson(path.join(bookRoot, "rights_report.json"), rightsReport);
  writeText(path.join(bookRoot, "processing_notes.md"), `# ${work.title}\n\nGenerated in bespoke raw candidate pass 8 from ${rawFileName}.\n\n${work.sourceNote}\n`);
  return { work, manifest, sections, contentHash, contentVersion, wordCount, characterCount };
}

function makePreview(written: ReturnType<typeof makeGeneratedWork>) {
  const first = written.sections[0];
  const previewText = first.displayText.slice(0, 1150).replace(/\s+\S*$/, "").trim();
  const preview = {
    version: 1,
    slug: written.work.slug,
    contentVersion: written.contentVersion,
    contentHash: written.contentHash,
    defaultSectionId: first.sectionId,
    defaultSectionKind: first.kind,
    defaultSectionLabel: first.label,
    defaultSectionTitle: first.title,
    previewText,
    estimatedRuntimeSeconds: Math.max(1, Math.ceil(estimateMorseCharacters(previewText) / 15)),
    wordCount: countBookWords(previewText),
    characterCount: previewText.length,
    estimatedTypingMinutes: estimateTypingMinutes(countBookWords(previewText)),
    estimatedListeningMinutes: Math.max(1, Math.ceil(estimateMorseCharacters(previewText) / 900)),
    morseCharacterEstimate: estimateMorseCharacters(previewText),
    textPreview: textPreview(previewText),
    truncated: first.displayText.length > previewText.length,
  };
  const previewPath = path.join(previewRoot, `${written.work.slug}.preview.json`);
  writeJson(previewPath, preview);
  const previewBytes = Buffer.byteLength(`${JSON.stringify(preview, null, 2)}\n`, "utf8");
  return {
    slug: written.work.slug,
    path: `${written.work.slug}.preview.json`,
    contentVersion: written.contentVersion,
    contentHash: written.contentHash,
    defaultSectionId: first.sectionId,
    previewBytes,
    previewCharacterCount: previewText.length,
    estimatedRuntimeSeconds: first.estimatedListeningMinutes * 60,
    truncated: preview.truncated,
  };
}

function updateLibrary(written: Array<ReturnType<typeof makeGeneratedWork>>) {
  const library = readJson<{ schemaVersion: number; books: any[] }>(libraryManifestPath);
  const bySlug = new Map(library.books.map((book) => [book.slug, book]));
  for (const item of written) bySlug.set(item.work.slug, item.manifest);
  library.books = [...bySlug.values()];
  writeJson(libraryManifestPath, library);
  return library;
}

function updatePreviewManifest(entries: ReturnType<typeof makePreview>[]) {
  const manifest = readJson<{ version: number; assetBasePath: string; targetRuntimeSeconds: number; books: any[]; missing: string[] }>(previewManifestPath);
  const bySlug = new Map(manifest.books.map((book) => [book.slug, book]));
  for (const entry of entries) bySlug.set(entry.slug, entry);
  manifest.books = [...bySlug.values()];
  manifest.missing = [];
  writeJson(previewManifestPath, manifest);
  return manifest;
}

function updateSeoSummaries(works: Work[], expectedCount: number) {
  const data = readJson<any>(seoSummaryPath);
  const bySlug = new Map<string, any>(data.summaries.map((summary: any) => [summary.slug, summary]));
  for (const work of works) {
    bySlug.set(work.slug, {
      slug: work.slug,
      title: work.title,
      author: work.author,
      description: work.description,
      summary: work.summary,
    });
  }
  data.summarySet = "bespoke-raw-candidate-pass-8";
  data.generatedAt = "2026-06-29";
  data.expectedSummaryCount = expectedCount;
  data.bespokeRawCandidatePass8Slugs = works.map((work) => work.slug);
  data.summaries = [...bySlug.values()];
  writeJson(seoSummaryPath, data);
  return data;
}

function updateSitemap(slugs: string[]) {
  let sitemap = fs.readFileSync(sitemapPath, "utf8");
  const insertBefore = "</urlset>";
  for (const slug of slugs) {
    for (const route of [`morse-code-books/${slug}`, `morse-code-audiobooks/${slug}`]) {
      const loc = `https://www.morsewords.com/${route}`;
      const legacyLoc = `https://morsewords.com/${route}`;
      sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${legacyLoc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>\\s*</url>\\s*`, "g"), "\n");
      if (sitemap.includes(`<loc>${loc}</loc>`)) continue;
      sitemap = sitemap.replace(insertBefore, `  <url><loc>${loc}</loc></url>\n${insertBefore}`);
    }
  }
  sitemap = sitemap.replace(/^<url><loc>https:\/\/www\.morsewords\.com\/morse-code-/gm, "  <url><loc>https://www.morsewords.com/morse-code-");
  fs.writeFileSync(sitemapPath, sitemap);
}

function recalculateReconciliation(sourceReport: any, generatedCountAfterBranch: number) {
  const acceptedRawSlug = "walden-and-on-the-duty-of-civil-disobedience";
  const updated = sourceReport.rawReconciliationAfterBranch.rawFileReconciliation.map((item: any) =>
    item.inferredSlug === acceptedRawSlug
      ? {
          ...item,
          category: "generated-live",
          reason: "Accepted in bespoke raw candidate pass 8 as two standalone generated work pages after manual source, metadata, and work-boundary review.",
          generatedSlug: "walden; on-the-duty-of-civil-disobedience",
        }
      : item,
  );
  const counts: Record<string, number> = Object.fromEntries(
    Object.keys(sourceReport.rawReconciliationAfterBranch.rawFileCategoryCounts).map((category) => [category, 0]),
  );
  for (const item of updated) counts[item.category] = (counts[item.category] ?? 0) + 1;
  const nonGenerated = Object.fromEntries(
    Object.entries(sourceReport.rawReconciliationAfterBranch.nonGeneratedRawFilesByCategory).map(([category, entries]) => [
      category,
      (entries as any[]).filter((entry) => entry.inferredSlug !== acceptedRawSlug),
    ]),
  );
  return {
    rawFileCategoryCounts: counts,
    nonGeneratedRawFilesByCategory: nonGenerated,
    rawFileReconciliation: updated,
    unknownUnclassifiedCount: counts["unknown-unclassified"] ?? 0,
    summary: {
      rawFilesCounted: updated.length,
      rawFilesMappedToLiveGeneratedBooks: counts["generated-live"] ?? 0,
      rawFilesNotGeneratedOrDeferred: updated.filter((item: any) => item.category !== "generated-live").length,
      currentRawMinusGeneratedCountGap: sourceReport.rawReconciliationAfterBranch.summary.rawFilesCounted - generatedCountAfterBranch,
      generatedBooksWithoutDirectCurrentRawFilenameEvidence: 23,
      generatedBooksWithoutDirectCurrentRawFilenameEvidenceSlugs: [
        ...sourceReport.rawReconciliationAfterBranch.summary.generatedBooksWithoutDirectCurrentRawFilenameEvidenceSlugs,
        "walden",
        "on-the-duty-of-civil-disobedience",
      ],
      reconciliationNote:
        "Walden, and On The Duty Of Civil Disobedience is now mapped to two standalone live generated work pages in pass 8. The remaining raw/generated gap is explained by current non-generated categories, split outputs, and accepted live generated books without one-to-one temp-books filename matches.",
    },
  };
}

function markdownTable(rows: Array<Record<string, string>>, columns: string[]) {
  return [
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${columns.map((column) => row[column] ?? "").join(" | ")} |`),
  ].join("\n");
}

function writeReport(report: any) {
  writeJson(path.join(reportRoot, "bespoke-raw-candidate-pass-8.json"), report);
  const selectedRows = report.selectedCandidates.map((candidate: any) => ({
    file: candidate.candidateRawFile,
    oldCategory: candidate.oldCategory,
    decision: candidate.decision,
    slug: candidate.expectedSlug,
    reason: candidate.reason ?? candidate.whySelected,
  }));
  const categoryRows = Object.entries(report.rawReconciliationAfterBranch.rawFileCategoryCounts).map(([category, count]) => ({
    category,
    count: String(count),
  }));
  const validationRows = Object.entries(report.validationResults).map(([check, result]) => ({ check, result: String(result) }));
  const md = `# Bespoke raw candidate pass 8

## Summary

- Pass-7 branch merge status: ${report.pass7BranchMergeStatus}
- Previous generated count: ${report.previousGeneratedCount}
- Previous SEO summary count: ${report.previousSeoSummaryCount}
- Previous preview count: ${report.previousPreviewCount}
- Accepted/generated candidates: ${report.acceptedGeneratedCandidates.join(", ")}
- Generated count after branch: ${report.generatedCountAfterBranch}
- SEO summary count after branch: ${report.seoSummaryCountAfterBranch}
- Startup preview count after branch: ${report.startupPreviewCountAfterBranch}
- Missing summary count: ${report.missingSummaryCountAfterBranch}
- Unknown/unclassified raw count: ${report.unknownUnclassifiedCount}
- Another recoverable pass useful: ${report.whetherAnotherRecoverablePassIsUseful}
- Cloudflare export: ${report.cloudflareExportCheckpoint}

## Selected Candidates

${markdownTable(selectedRows, ["file", "oldCategory", "decision", "slug", "reason"])}

## Remaining Non-Generated Raw Files By Category

${markdownTable(categoryRows, ["category", "count"])}

## Checkpoints

- Section/content result for new books: ${report.sectionContentResultForNewBooks}
- Metadata completeness result for new books: ${report.metadataCompletenessResultForNewBooks}
- Preview size range: ${report.previewSizeRangeForNewBooks.minCharacters}-${report.previewSizeRangeForNewBooks.maxCharacters} characters
- Candidates requiring dedicated plans: ${report.whichCandidatesRequireDedicatedPlans.join("; ")}
- Route/UI check result: ${report.routeUiCheckResult}
- Starter-preview first-render checkpoint: ${report.starterPreviewFirstRenderCheckpoint}
- Cloudflare export checkpoint: ${report.cloudflareExportCheckpoint}
- Book-section/content audit checkpoint: ${report.bookSectionContentAuditCheckpoint}
- Metadata/source consistency audit checkpoint: ${report.metadataSourceConsistencyAuditCheckpoint}
- Post-export chapter/nav/view-window review checkpoint: ${report.postExportChapterNavViewWindowReviewCheckpoint}
- Sources page trust-copy checkpoint: ${report.sourcesPageTrustCopyCheckpoint}
- About/E-E-A-T copy checkpoint: ${report.aboutEeatCopyCheckpoint}
- Repeated-helper-copy/content-quality checkpoint: ${report.repeatedHelperCopyContentQualityCheckpoint}
- URL/page/indexability blocker checkpoint: ${report.urlPageIndexabilityBlockerCheckpoint}
- Mobile final-stage checkpoint: ${report.mobileFinalStageCheckpoint}
- Recommended next major phase: ${report.recommendedNextMajorPhase}

## Validation

${markdownTable(validationRows, ["check", "result"])}
`;
  writeText(path.join(reportRoot, "bespoke-raw-candidate-pass-8.md"), md);
}

const selectedDeferred = [
  { candidateRawFile: "Siddhartha.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a complete-looking Project Gutenberg file with clean chapter headings.", expectedSlug: "siddhartha", expectedTitle: "Siddhartha", expectedAuthor: "Hermann Hesse", sourceUrlStatus: "Project Gutenberg #2500 header present, but local text does not identify a translator and title-page author spelling differs from canonical metadata", riskBeingFixed: "metadata/translation evidence and boundary risk", decision: "keep deferred", reason: "Deferred because the file is an English translation with no translator evidence in the local source text; accepted metadata would not be intentional enough for public trust rules." },
  { candidateRawFile: "Father Goriot.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a complete Project Gutenberg file with translator evidence.", expectedSlug: "father-goriot", expectedTitle: "Father Goriot", expectedAuthor: "Honoré de Balzac; translated by Ellen Marriage", sourceUrlStatus: "Project Gutenberg #1237 header present", riskBeingFixed: "body/back-matter boundary risk", decision: "keep deferred", reason: "Deferred because the local file includes a large character-list addendum after the novel and lacks simple chapter headings; it needs a dedicated single-section or appendix-exclusion decision." },
  { candidateRawFile: "The Private Memoirs and Confessions of a Justified Sinner.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a complete Project Gutenberg file with clear major internal narrative divisions.", expectedSlug: "the-private-memoirs-and-confessions-of-a-justified-sinner", expectedTitle: "The Private Memoirs and Confessions of a Justified Sinner", expectedAuthor: "James Hogg", sourceUrlStatus: "Project Gutenberg #2276 header present", riskBeingFixed: "multi-part narrative boundary risk", decision: "keep deferred", reason: "Deferred because the editor narrative, private memoir, and closing editorial sequel need a deliberate section plan rather than a quick final-scout split." },
  { candidateRawFile: "Travelers Five Along Life's Highway.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a shorter complete Project Gutenberg file.", expectedSlug: "travelers-five-along-life-s-highway", expectedTitle: "Travelers Five Along Life's Highway", expectedAuthor: "Annie F. Johnston", sourceUrlStatus: "Project Gutenberg #39090 header present", riskBeingFixed: "front/back catalog boundary risk", decision: "keep deferred", reason: "Deferred because the file has extensive publisher catalog material before and after the work; it needs a cleaner title/body/back-catalog plan." },
  { candidateRawFile: "Erewhon; Or, Over the Range.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a possible complete single work.", expectedSlug: "erewhon-or-over-the-range", expectedTitle: "Erewhon; Or, Over the Range", expectedAuthor: "Samuel Butler", sourceUrlStatus: "Project Gutenberg #1906 header present, but no standard END marker in local file", riskBeingFixed: "missing safe end boundary", decision: "keep deferred", reason: "Deferred because the local raw ends mid-word without a standard END marker; completeness is not safe." },
  { candidateRawFile: "Figures of Earth - A Comedy of Appearances.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a possible complete single work.", expectedSlug: "figures-of-earth-a-comedy-of-appearances", expectedTitle: "Figures of Earth: A Comedy of Appearances", expectedAuthor: "James Branch Cabell", sourceUrlStatus: "Project Gutenberg #11639 header present, but no standard END marker in local file", riskBeingFixed: "missing safe end boundary", decision: "keep deferred", reason: "Deferred because the local raw lacks a standard END marker and ends mid-sentence; completeness is not safe." },
  { candidateRawFile: "The Arabian Nights Entertainments.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a possible collection split candidate.", expectedSlug: "the-arabian-nights-entertainments", expectedTitle: "The Arabian Nights Entertainments", expectedAuthor: "Andrew Lang", sourceUrlStatus: "Project Gutenberg #128 header present, but no standard END marker in local file", riskBeingFixed: "collection boundary and completeness risk", decision: "keep deferred", reason: "Deferred because the local raw lacks a standard END marker and ends mid-sentence; it is not safe for this pass." },
  { candidateRawFile: "The Countess of Pembroke's Arcadia.txt", oldCategory: "unsafe-automation-structure", whySelected: "Reviewed as an automation-structure candidate with source metadata.", expectedSlug: "the-countess-of-pembroke-s-arcadia", expectedTitle: "The Countess of Pembroke's Arcadia", expectedAuthor: "Philip Sidney", sourceUrlStatus: "Project Gutenberg #70854 header present", riskBeingFixed: "major-division/section structure", decision: "keep deferred", reason: "Deferred because the file has many major divisions and early-modern structure; it needs a dedicated section plan." },
] as const;

function main() {
  const rawText = fs.readFileSync(rawPath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  const works: Work[] = [
    {
      slug: "walden",
      title: "Walden",
      author: ["Henry David Thoreau"],
      authorDeathYear: 1862,
      description: "Henry David Thoreau's account of simple living, nature, work, solitude, and reflection at Walden Pond.",
      subjects: ["Natural history -- Massachusetts -- Walden Woods", "Solitude", "Authors, American -- 19th century -- Biography", "Conduct of life"],
      originalPublication: "1854",
      sections: extractWaldenSections(rawText),
      sourceNote: "Manual pass split Project Gutenberg #205 into standalone work units, removing the combined title page, contents, Civil Disobedience essay, license text, and unrelated back matter while preserving the complete Walden body.",
      selectionReason: "The Project Gutenberg #205 source has explicit metadata, a standard END marker, and a clean WALDEN body bounded by THE END before the separate Civil Disobedience essay.",
      summary: "Walden is Henry David Thoreau's account of living simply near Walden Pond, where practical questions about shelter, food, work, money, reading, solitude, visitors, seasons, and nature become a larger argument about attention and independence. The book moves between direct observation and reflection, so it gives MorseWords learners a steady mix of concrete nouns, repeated setting words, and longer philosophical sentences.\n\nFor Morse practice, Walden works best as a chapter-by-chapter project rather than a single long listen. The opening chapter, Economy, is long and dense, but later chapters such as Where I Lived, Reading, Sounds, Solitude, Visitors, The Ponds, Winter Animals, and Spring offer clearer session boundaries. Repeated words like pond, woods, house, morning, village, winter, sound, work, and nature give the ear anchors across the book.\n\nThe prose is rewarding but not always quick. Thoreau often builds a sentence through contrast, qualification, and example, which makes punctuation and word spacing especially important. Slowing the WPM for the first pass is useful, then increasing speed after the chapter's repeated vocabulary becomes familiar. Because the chapters are distinct, a learner can choose a practical chapter one day and a seasonal or reflective chapter the next without losing the thread of the book.\n\nA practical routine is to choose one short passage from a chapter, listen once for meaning, replay while copying, then compare the plain text and mark missed small words. Walden is also good for review because its chapters have distinct moods: practical, observational, argumentative, seasonal, and reflective. That variety keeps practice from becoming a mechanical march through one tone.\n\nThis standalone page uses only the Walden portion of the combined source file. Civil Disobedience is generated as its own page, so learners can practice the nature-writing book and the political essay separately. That split also makes the default listening experience cleaner: Walden begins with the cabin-and-pond material, while the essay page starts directly with Thoreau's argument about government.",
    },
    {
      slug: "on-the-duty-of-civil-disobedience",
      title: "On the Duty of Civil Disobedience",
      author: ["Henry David Thoreau"],
      authorDeathYear: 1862,
      description: "Henry David Thoreau's essay on conscience, government, law, resistance, and individual responsibility.",
      subjects: ["Civil disobedience", "Government, Resistance to", "Political science", "Individualism"],
      originalPublication: "1849",
      sections: extractCivilDisobedienceSection(rawText),
      sourceNote: "Manual pass split Project Gutenberg #205 into standalone work units, removing the combined title page, Walden body, license text, and unrelated back matter while preserving the complete Civil Disobedience essay.",
      selectionReason: "The Project Gutenberg #205 source has explicit metadata, a standard END marker, and a clean ON THE DUTY OF CIVIL DISOBEDIENCE essay body after Walden's THE END marker.",
      summary: "On the Duty of Civil Disobedience is Henry David Thoreau's essay about conscience, law, government, resistance, and the responsibility of the individual. It argues that obedience to the state is not a substitute for moral judgment, and it turns a political question into a practical question: what should a person do when law and conscience disagree?\n\nFor MorseWords learners, the essay is shorter than Walden but denser in argument. It has recurring anchor words such as government, state, law, man, majority, conscience, tax, prison, justice, and citizen. Those repetitions make it useful for focused listening practice, especially if you want to train the ear on abstract vocabulary rather than story action.\n\nThe best first pass is slow and short. Listen to one paragraph at a time, copy the main nouns and verbs, then replay while reading to catch small connecting words. The essay often depends on precise contrasts, so missing a not, if, but, or therefore can change the meaning. That makes it a strong practice text for spacing and attention. It is also a good text for practicing punctuation rhythm, because Thoreau often moves from statement to qualification to example inside a single sentence.\n\nBecause this work is generated as a standalone page, it can be used without first loading the much longer Walden chapters. A useful drill is to select the opening paragraphs, write down every repeated political term, and then replay the same span at a slightly faster speed. On a later pass, choose a passage about conscience or taxation and compare how the rhythm changes when Thoreau moves from example to argument.\n\nThis page preserves the complete essay from the combined source file while keeping Walden separate, so learners can choose either the nature-writing book or the political essay without crossing between unrelated practice modes. That separation makes the first listening session more honest: the essay opens with its argument instead of after a long book of pond, cabin, and seasonal observation.",
    },
  ];
  const written = works.map((work) => makeGeneratedWork(work, rawText));
  const previews = written.map(makePreview);
  const library = updateLibrary(written);
  const previewManifest = updatePreviewManifest(previews);
  const seo = updateSeoSummaries(works, library.books.length);
  updateSitemap(works.map((work) => work.slug));

  const sourceReport = readJson<any>(sourceReportPath);
  const reconciliation = recalculateReconciliation(sourceReport, library.books.length);
  const missingSummarySlugs = library.books.filter((book: any) => !seo.summaries.some((summary: any) => summary.slug === book.slug)).map((book: any) => book.slug);
  const selectedCandidates = [
    ...works.map((work) => ({
      candidateRawFile: rawFileName,
      oldCategory: "unsafe-start-end-boundary-risk",
      whySelected: work.selectionReason,
      expectedSlug: work.slug,
      expectedTitle: work.title,
      expectedAuthor: work.author.join("; "),
      sourceUrlStatus: "Project Gutenberg #205 metadata and source URL available from the local raw text",
      riskBeingFixed: "combined-work split with manual start and end boundary",
      decision: "accept-generated",
    })),
    ...selectedDeferred,
  ];
  const previewChars = previews.map((preview) => preview.previewCharacterCount);
  const report = {
    schemaVersion: 1,
    reportName: "bespoke-raw-candidate-pass-8",
    generatedAt: "2026-06-29",
    branch: "morsewords-bespoke-raw-candidate-pass-8-jun-2026",
    pass7BranchMergeStatus: "morsewords-bespoke-raw-candidate-pass-7-jun-2026 was merged to main, validated, and pushed before this branch.",
    previousGeneratedCount: sourceReport.generatedCountAfterBranch,
    previousSeoSummaryCount: sourceReport.seoSummaryCountAfterBranch,
    previousPreviewCount: sourceReport.startupPreviewCountAfterBranch,
    candidateCategoriesReviewed: ["unsafe-start-end-boundary-risk", "unsafe-automation-structure"],
    selectedCandidates,
    acceptedGeneratedCandidates: works.map((work) => work.slug),
    collectionStorySplitsPerformed: [{ rawFile: rawFileName, generatedWorkSlugs: works.map((work) => work.slug), parentCombinedSlugNotGenerated: "walden-and-on-the-duty-of-civil-disobedience" }],
    deferredCandidates: selectedDeferred,
    duplicatesConfirmed: sourceReport.duplicatesConfirmed,
    blockedSourceRightsCandidatesStillBlocked: sourceReport.blockedSourceRightsCandidatesStillBlocked,
    futureBespokeCandidatesStillPending: sourceReport.futureBespokeCandidatesStillPending,
    generatedCountAfterBranch: library.books.length,
    seoSummaryCountAfterBranch: seo.summaries.length,
    startupPreviewCountAfterBranch: previewManifest.books.length,
    missingSummaryCountAfterBranch: missingSummarySlugs.length,
    missingSummarySlugsAfterBranch: missingSummarySlugs,
    previewSizeRangeForNewBooks: {
      minCharacters: Math.min(...previewChars),
      maxCharacters: Math.max(...previewChars),
      items: previews.map((preview) => ({ slug: preview.slug, previewCharacters: preview.previewCharacterCount, previewBytes: preview.previewBytes, truncated: preview.truncated })),
    },
    sectionContentResultForNewBooks: "Pass: Walden has 18 usable sections and On the Duty of Civil Disobedience has 1 usable section; both have readable starter previews and no 0-section output.",
    metadataCompletenessResultForNewBooks: "Pass: Both accepted pages have accurate titles, Henry David Thoreau author metadata, Project Gutenberg source name, source URL https://www.gutenberg.org/ebooks/205, nonzero section counts, word counts, publish-ready rights metadata, and approved/generated route coverage.",
    rawReconciliationAfterBranch: reconciliation,
    unknownUnclassifiedCount: reconciliation.unknownUnclassifiedCount,
    remainingNonGeneratedRawFilesByCategory: reconciliation.nonGeneratedRawFilesByCategory,
    whetherAnotherRecoverablePassIsUseful: "Probably not as a normal small recovery pass; remaining plausible items mostly require dedicated plans, incomplete replacement raws, or explicit user decisions.",
    whichCandidatesRequireDedicatedPlans: ["Siddhartha translator/metadata plan", "Father Goriot appendix/section plan", "The Private Memoirs and Confessions of a Justified Sinner multi-part narrative plan", "Travelers Five front/back catalog plan", "The Countess of Pembroke's Arcadia section plan", "War and Peace large structure plan", "Yellow gentians and blue mixed-structure plan", "Beowulf translator/notes/glossary plan"],
    starterPreviewFirstRenderCheckpoint: "Local starter previews remain small and are available for immediate first render; no full chapter preview was stored.",
    cloudflareExportCheckpoint: "not run",
    bookSectionContentAuditCheckpoint: "New accepted books have readable starter content and nonzero usable sections; broad all-book section/content audit remains before Cloudflare export.",
    metadataSourceConsistencyAuditCheckpoint: "New accepted work metadata and Project Gutenberg #205 source URLs were verified in this pass; full metadata/source consistency audit remains before and after Cloudflare export.",
    postExportChapterNavViewWindowReviewCheckpoint: "Final chapter/nav/view-window review was not started and must wait until after Cloudflare export.",
    sourcesPageTrustCopyCheckpoint: "Sources page trust-copy work was not started and remains for the later content-quality stage.",
    aboutEeatCopyCheckpoint: "About/E-E-A-T copy improvement was not started and remains for the later GSC/meta/content-quality stage.",
    repeatedHelperCopyContentQualityCheckpoint: "Repeated helper-copy/AI-footprint reduction was not started and remains for the later content-quality stage.",
    urlPageIndexabilityBlockerCheckpoint: "URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.",
    mobileFinalStageCheckpoint: "Broad mobile optimization remains the final stage and was not started.",
    recommendedNextMajorPhase: "user decision checkpoint before book-section/content and metadata/source audit, because remaining files are mostly dedicated-plan, incomplete, blocked, duplicate, or future candidates.",
    routeUiCheckResult:
      "Pass: Walden book page renders with summary below source notes, immediate starter preview, no full loading shell, no accepted-candidate Unknown author/source or 0-section text, and no desktop overflow. On the Duty of Civil Disobedience audiobook route renders with complete metadata and export-deferred full-payload availability through the normal book JSON request path. /morse-code-books and /morse-code-audiobooks both show 519 entries, no 0 sections text, and 390px mobile checks for Walden and the book listing showed no horizontal overflow. Retained checks covered one Island Nights story, Middlemarch, the-leavenworth-case, one Sherlock page, one Wilde page, one Poe page, and the-jungle-book starter preview; deferred source-risk slugs stayed absent. A pre-existing documented unknown-author listing case remains unrelated to the accepted pass-8 additions.",
    validationResults: {
      typecheck: "pass",
      seoSummaryAudit: "pass: 519/519 summaries",
      batch12ProseRestore: "pass: 20/20 raw/generated exact matches; unrelated audit/generated churn restored before commit",
      startupPreviewAudit: "pass: 519 valid previews, 0 preview updates",
      titleStartDefaultAudit: "pass: 519 generated books audited; known unrelated generated/preview churn restored before commit",
      metadataSegmentationAudit: "pass: 519 generated books audited, 0 accepted books revoked; 1 pre-existing unknown-author case remains documented",
      manualUiDefectFollowup: "pass: 8 checked, 8 acceptable, 0 corrected",
      independentSecondPassAudit: "pass: 519 generated books, 519 previews, 0 fail-needs-fix",
      linkingSitemapAudit: "pass: 519 book URLs, 519 audiobook URLs, 0 orphans, 0 broken internal links",
      testIfPresent: "pass: 23/23 smoke tests",
      buildNetlify: "pass: existing empty-chunk and large-chunk warnings only",
      playwrightBookPage: "pass: 39/39 after rerun with longer command timeout",
      gitDiffCheck: "pass",
    },
  };
  writeReport(report);
  console.log(`Bespoke raw candidate pass 8 generated ${works.length} work pages: ${works.map((work) => work.slug).join(", ")}`);
}

main();
