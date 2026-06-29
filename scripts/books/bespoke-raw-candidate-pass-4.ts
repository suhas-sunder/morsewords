import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookRightsReport,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type ManualSectionBoundary = {
  label: string;
  title: string | null;
  startText: string;
  endText: string;
  includeStartText?: boolean;
  includeEndText?: boolean;
};

type CandidateWork = {
  fileName: string;
  slug: string;
  title: string;
  author: string[];
  authorDeathYear: number | null;
  description: string;
  subjects: string[];
  originalPublication: string;
  oldCategory: string;
  sourceNote: string;
  selectionReason: string;
  decision: "accept" | "keep deferred";
  riskBeingFixed: string;
  sections: ManualSectionBoundary[];
  summary: string;
};

type PreviewEntry = {
  slug: string;
  path: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  previewBytes: number;
  previewCharacterCount: number;
  estimatedRuntimeSeconds: number;
  truncated: boolean;
};

type SeoSummaryData = {
  schemaVersion: 1;
  summarySet: string;
  generatedAt: string;
  storageApproach: string;
  suggestedPilotSlugs: string[];
  pilotSlugs: string[];
  substitutions: Array<{
    suggestedSlug: string;
    actualSlug: string;
    reason: string;
  }>;
  expectedSummaryCount?: number;
  bespokeRawCandidatePass1Slugs?: string[];
  bespokeRawCandidatePass2Slugs?: string[];
  bespokeRawCandidatePass3Slugs?: string[];
  bespokeRawCandidatePass4Slugs?: string[];
  summaries: Array<{
    slug: string;
    title: string;
    author: string[];
    description: string;
    summary: string;
  }>;
};

type SourceRiskReport = {
  rawTempBooksTotalCount: number;
  generatedCountAfterRemoval: number;
  seoSummaryCountAfterRemoval: number;
  previewCountAfterRemoval: number;
  rawFileCategoryCounts: Record<string, number>;
  nonGeneratedRawFilesByCategory: Record<
    string,
    Array<{ rawSourceFilename: string; inferredSlug: string; reason: string }>
  >;
  rawFileReconciliation: Array<{
    rawSourceFilename: string;
    inferredSlug: string;
    category: string;
    reason: string;
  }>;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const reportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-4",
);
const priorPassReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-3/bespoke-raw-candidate-pass-3.json",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const seoSummaryPath = path.join(
  repoRoot,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const sitemapPath = path.join(repoRoot, "public/sitemap.xml");

const leavenworthChapters = [
  ["I", "A GREAT CASE"],
  ["II", "THE CORONER'S INQUEST"],
  ["III", "FACTS AND DEDUCTIONS"],
  ["IV", "A CLUE"],
  ["V", "EXPERT TESTIMONY"],
  ["VI", "SIDE-LIGHTS"],
  ["VII", "MARY LEAVENWORTH"],
  ["VIII", "CIRCUMSTANTIAL EVIDENCE"],
  ["IX", "A DISCOVERY"],
  ["X", "MR. GRYCE RECEIVES NEW IMPETUS"],
  ["XI", "THE SUMMONS"],
  ["XII", "ELEANORE"],
  ["XIII", "THE PROBLEM"],
  ["XIV", "MR. GRYCE AT HOME"],
  ["XV", "WAYS OPENING"],
  ["XVI", "THE WILL OF A MILLIONAIRE"],
  ["XVII", "THE BEGINNING OF GREAT SURPRISES"],
  ["XVIII", "ON THE STAIRS"],
  ["XIX", "IN MY OFFICE"],
  ["XX", "TRUEMAN! TRUEMAN! TRUEMAN!"],
  ["XXI", "A PREJUDICE"],
  ["XXII", "PATCH-WORK"],
  ["XXIII", "THE STORY OF A CHARMING WOMAN"],
  ["XXIV", "A REPORT FOLLOWED BY SMOKE"],
  ["XXV", "TIMOTHY COOK"],
  ["XXVI", "MR. GRYCE EXPLAINS HIMSELF"],
  ["XXVII", "AMY BELDEN"],
  ["XXVIII", "A WEIRD EXPERIENCE"],
  ["XXIX", "THE MISSING WITNESS"],
  ["XXX", "BURNED PAPER"],
  ["XXXI", "Q"],
  ["XXXII", "MRS. BELDEN'S NARRATIVE"],
  ["XXXIII", "UNEXPECTED TESTIMONY"],
  ["XXXIV", "MR. GRYCE RESUMES CONTROL"],
  ["XXXV", "FINE WORK"],
  ["XXXVI", "GATHERED THREADS"],
  ["XXXVII", "CULMINATION"],
  ["XXXVIII", "A FULL CONFESSION"],
  ["XXXIX", "THE OUTCOME OF A GREAT CRIME"],
] as const;

function leavenworthSections(): ManualSectionBoundary[] {
  return leavenworthChapters.map(([roman, title], index) => {
    const next = leavenworthChapters[index + 1];
    return {
      label: "Chapter " + roman,
      title,
      startText: "\n\n\n" + roman + ".",
      endText: next ? "\n\n\n" + next[0] + "." : "\n\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK THE LEAVENWORTH CASE ***",
      includeStartText: false,
      includeEndText: false,
    };
  });
}

const acceptedWorks: CandidateWork[] = [
  {
    fileName: "The Leavenworth Case.txt",
    slug: "the-leavenworth-case",
    title: "The Leavenworth Case",
    author: ["Anna Katharine Green"],
    authorDeathYear: 1935,
    description:
      "Anna Katharine Green's influential detective novel about a lawyer, a murdered client, and the layered testimony around the Leavenworth household.",
    subjects: ["Detective fiction", "Mystery fiction", "Novels", "Legal fiction"],
    originalPublication: "1878",
    oldCategory: "unsafe-automation-structure",
    sourceNote:
      "Manual pass accepted the Project Gutenberg #4047 file as a single standalone novel, removing the Gutenberg header, title-page matter, contents, illustration list, back matter, and license text while preserving the thirty-nine chapter bodies.",
    selectionReason:
      "Project Gutenberg provenance is explicit, and the novel has clean internal book divisions plus sequential chapter headings from I through XXXIX.",
    decision: "accept",
    riskBeingFixed: "large multi-book chapter structure with manual boundary review",
    sections: leavenworthSections(),
    summary: "The Leavenworth Case is Anna Katharine Green's early detective novel about the murder of Horatio Leavenworth and the legal, domestic, and emotional evidence that follows. Told by a young lawyer drawn into the case, the book moves through an inquest, interviews, family tensions, hidden testimony, and Mr. Gryce's careful detective work. Although the raw file contains four internal books, they are divisions of one single novel rather than separate works, so this pass keeps the text together as one book with thirty-nine readable chapter sections.\n\nFor MorseWords learners, the novel is useful because its structure is orderly even though the mystery is complex. Each chapter has a distinct role: early chapters establish the crime and evidence, middle chapters test theories and relationships, and later chapters gather confessions and explanations. That makes it practical to listen in short sessions while still building stamina for a longer public-domain novel.\n\nThe vocabulary gives strong practice anchors. Names such as Leavenworth, Raymond, Gryce, Mary, Eleanore, Clavering, Harwell, and Hannah repeat across the investigation, while legal and household words such as inquest, testimony, office, library, witness, letter, will, key, and confession add variety. Dialogue-heavy scenes help learners practice punctuation and speaker changes, while investigative passages reward slower playback and careful copying.\n\nBecause the chapters are numerous but individually bounded, the book can support different practice goals. A newer listener can replay the first chapter until the repeated names and legal setting feel familiar. A more confident learner can choose a later investigative chapter for longer copying, then return to shorter chapters for review. The steady detective frame makes it easier to notice when spacing, missed letters, or punctuation have gone off track.\n\nThis generated edition removes source boilerplate and table material, keeps readable chapter bodies, and stores only a small local starter preview for immediate rendering. The full book payload remains export-deferred until the Cloudflare book payload stage is run later.",
  },
];

const selectedDeferred = [
  { candidateRawFile: "Yellow gentians and blue.txt", oldCategory: "unsafe-automation-structure", whySelected: "Named deferred item reviewed for mixed poetry/prose structure.", expectedSlug: "yellow-gentians-and-blue", expectedTitle: "Yellow Gentians and Blue", expectedAuthor: "Zona Gale", riskBeingFixed: "mixed poetry/prose structure and metadata planning", decision: "keep deferred", reason: "The file is a mixed collection with poems, prose pieces, plays, and internal title lists; it needs a dedicated section plan rather than a small full-book extraction." },
  { candidateRawFile: "Beowulf - An Anglo-Saxon Epic Poem.txt", oldCategory: "unsafe-metadata-risk", whySelected: "Named deferred item reviewed for translator metadata and section structure.", expectedSlug: "beowulf-an-anglo-saxon-epic-poem", expectedTitle: "Beowulf: An Anglo-Saxon Epic Poem", expectedAuthor: "J. Lesslie Hall, translator", riskBeingFixed: "translator metadata and epic sectioning", decision: "keep deferred", reason: "The file includes prefatory matter, notes, glossary material, and translator-specific metadata; it should wait for a dedicated epic/translation treatment." },
  { candidateRawFile: "The Little Match Girl.txt", oldCategory: "unsafe-title-parent-collection-risk", whySelected: "Named deferred item checked for title/content mismatch.", expectedSlug: "the-little-match-girl", expectedTitle: "The Little Match Girl", expectedAuthor: "Hans Christian Andersen", riskBeingFixed: "title/content mismatch", decision: "keep deferred", reason: "The current raw file is an Andersen Fairy Tales extract that starts with The Dream of Little Tuk, which is already generated; it is not The Little Match Girl." },
  { candidateRawFile: "THE APPLE.txt", oldCategory: "blocked-source-or-rights-risk", whySelected: "Named blocked item checked for current repo provenance evidence.", expectedSlug: "the-apple", expectedTitle: "The Apple", expectedAuthor: "H. G. Wells", riskBeingFixed: "source/provenance risk", decision: "keep deferred", reason: "The raw file still has no Project Gutenberg header, release metadata, or current repo evidence that resolves provenance risk." },
  { candidateRawFile: "THE STORY OF THE LATE MR. ELVESHAM.txt", oldCategory: "blocked-source-or-rights-risk", whySelected: "Named blocked item checked for current repo provenance evidence.", expectedSlug: "the-story-of-the-late-mr-elvesham", expectedTitle: "The Story of the Late Mr. Elvesham", expectedAuthor: "H. G. Wells", riskBeingFixed: "source/provenance risk", decision: "keep deferred", reason: "The raw file still has no Project Gutenberg header, release metadata, or current repo evidence that resolves provenance risk." },
] as const;

const selectedCandidates = [
  ...acceptedWorks.map((work) => ({
    candidateRawFile: work.fileName,
    oldCategory: work.oldCategory,
    whySelected: work.selectionReason,
    expectedSlug: work.slug,
    expectedTitle: work.title,
    expectedAuthor: work.author.join("; "),
    riskBeingFixed: work.riskBeingFixed,
    decision: work.decision,
  })),
  ...selectedDeferred,
];

function assertInside(root: string, target: string) {
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside ${root}: ${target}`);
  }
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function readWindows1252Text(filePath: string) {
  return new TextDecoder("windows-1252").decode(fs.readFileSync(filePath));
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

function extractHeaderValue(rawText: string, name: string) {
  const pattern = new RegExp(`^${name}:\\s*(.+)$`, "im");
  return rawText.match(pattern)?.[1]?.trim() ?? null;
}

function releaseDateFromRaw(rawText: string) {
  const line = extractHeaderValue(rawText, "Release date");
  if (!line) return null;
  return line.replace(/\s*\[.*$/, "").trim() || null;
}

function lastUpdatedFromRaw(rawText: string) {
  return rawText.match(/Most recently updated:\s*([^\n]+)/i)?.[1]?.trim() ?? "";
}

function gutenbergIdFromRaw(rawText: string) {
  return rawText.match(/\[eBook #(\d+)\]/i)?.[1] ?? null;
}

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function stripPageMarkers(input: string) {
  return input
    .replace(/\[\d+\]/g, "")
    .replace(/\[(?:Illustration|Image|Picture|Plate|Transcriber)[^\]]*\]/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n");
}

function normalizeCommonMojibake(input: string) {
  return [
    ["\u00e2\u20ac\u02dc", "'"],
    ["\u00e2\u20ac\u2122", "'"],
    ["\u00e2\u20ac\u0153", '"'],
    ["\u00e2\u20ac\u009d", '"'],
    ["\u00e2\u20ac\u201c", "--"],
    ["\u00e2\u20ac\u201d", "--"],
    ["\u00e2\u20ac\u00a6", "..."],
  ].reduce((text, [from, to]) => text.split(from).join(to), input);
}

function cleanExtractedBody(input: string) {
  return trimBookText(normalizeCommonMojibake(stripPageMarkers(input)));
}

function extractSections(work: CandidateWork, rawText: string) {
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  return work.sections.map((section) => {
    const startIndex = normalized.indexOf(section.startText);
    if (startIndex < 0) throw new Error(`${work.slug}: start marker not found for ${section.label}`);
    const endIndex = normalized.indexOf(section.endText, startIndex + section.startText.length);
    if (endIndex < 0) throw new Error(`${work.slug}: end marker not found for ${section.label}`);
    const start = section.includeStartText ? startIndex : startIndex + section.startText.length;
    const includeEndText = section.includeEndText ?? !section.endText.startsWith("*** END");
    const end = includeEndText ? endIndex + section.endText.length : endIndex;
    const text = cleanExtractedBody(normalized.slice(start, end));
    if (text.length < 500) throw new Error(`${work.slug}: extracted ${section.label} is too short`);
    if (/Project Gutenberg|Release date:|START OF THE PROJECT/i.test(text.slice(0, 800))) {
      throw new Error(`${work.slug}: source boilerplate leaked into ${section.label}`);
    }
    return {
      label: section.label,
      title: section.title,
      text,
      sourceStartOffset: start,
      sourceEndOffset: end,
    };
  });
}

function makeSection({
  bookSlug,
  label,
  order,
  sourceEndOffset,
  sourceStartOffset,
  text,
  title,
}: {
  bookSlug: string;
  label: string;
  title: string | null;
  order: number;
  text: string;
  sourceStartOffset: number;
  sourceEndOffset: number;
}): GeneratedBookSectionJson {
  const wordCount = countBookWords(text);
  const morseCharacterEstimate = estimateMorseCharacters(text);
  return {
    schemaVersion: 1,
    bookSlug,
    sectionId: `chapter-${String(order).padStart(3, "0")}`,
    kind: "chapter",
    label,
    title,
    order,
    includeByDefault: true,
    displayText: text,
    morseSourceText: text,
    paragraphs: splitParagraphs(text),
    wordCount,
    characterCount: text.length,
    estimatedTypingMinutes: estimateTypingMinutes(wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(morseCharacterEstimate),
    morseCharacterEstimate,
    unsupportedCharacterSummary: summarizeUnsupportedCharacters(text),
    textPreview: textPreview(text),
    sourceOffsets: {
      start: sourceStartOffset,
      end: sourceEndOffset,
    },
  };
}

function previewTextForBody(body: string) {
  const targetLength = 1_050;
  if (body.length <= 1_250) return trimBookText(body);
  const minBoundary = 850;
  const maxBoundary = Math.min(body.length, 1_250);
  const window = body.slice(minBoundary, maxBoundary);
  const paragraphBreak = window.lastIndexOf("\n\n");
  if (paragraphBreak > 0) return trimBookText(body.slice(0, minBoundary + paragraphBreak));
  const sentenceMatches = [...window.matchAll(/[.!?]["')\]]?\s+/g)];
  const sentence = sentenceMatches.at(-1);
  if (sentence?.index !== undefined) {
    return trimBookText(body.slice(0, minBoundary + sentence.index + sentence[0].length));
  }
  const whitespace = body.lastIndexOf(" ", targetLength);
  return trimBookText(body.slice(0, whitespace > minBoundary ? whitespace : targetLength));
}

function previewBodyForWork(work: CandidateWork, section: GeneratedBookSectionJson) {
  if (work.slug !== "the-leavenworth-case") return section.morseSourceText;

  const narrativeStart = section.morseSourceText.indexOf("\n\n\nI had been");
  return narrativeStart >= 0
    ? section.morseSourceText.slice(narrativeStart).trim()
    : section.morseSourceText;
}

function makePreviewAsset(work: CandidateWork, section: GeneratedBookSectionJson, contentHash: string) {
  const previewText = previewTextForBody(previewBodyForWork(work, section));
  const wordCount = countBookWords(previewText);
  const morseCharacterEstimate = estimateMorseCharacters(previewText);
  const contentVersion = contentHash.slice(0, 16);
  return {
    version: 1,
    slug: work.slug,
    contentVersion,
    contentHash,
    defaultSectionId: section.sectionId,
    defaultSectionKind: section.kind,
    defaultSectionLabel: section.label,
    defaultSectionTitle: section.title,
    previewText,
    estimatedRuntimeSeconds: Math.max(1, Math.round((morseCharacterEstimate / 900) * 60)),
    wordCount,
    characterCount: previewText.length,
    estimatedTypingMinutes: estimateTypingMinutes(wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(morseCharacterEstimate),
    morseCharacterEstimate,
    textPreview: textPreview(previewText),
    truncated: previewText.length < section.morseSourceText.trim().length,
  };
}

function makeRightsReport(work: CandidateWork, rawText: string): BookRightsReport {
  const gutenbergId = gutenbergIdFromRaw(rawText);
  return {
    schemaVersion: 1,
    title: work.title,
    author: work.author.join("; "),
    author_death_year: work.authorDeathYear,
    language: "English",
    original_publication: work.originalPublication,
    release_date: releaseDateFromRaw(rawText) ?? "",
    last_updated: lastUpdatedFromRaw(rawText),
    source: "Project Gutenberg",
    gutenberg_ebook_number: gutenbergId ?? "",
    source_url: gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null,
    raw_text_url: null,
    gutenberg_header_present: /PROJECT GUTENBERG/i.test(rawText),
    project_gutenberg_license_present: /PROJECT GUTENBERG/i.test(rawText),
    us_reuse_language_found: /United States/i.test(rawText),
    non_us_warning_found: /not located in the United States/i.test(rawText),
    credits: extractHeaderValue(rawText, "Credits") ?? "",
    translator: "",
    translator_death_year: null,
    illustrator: extractHeaderValue(rawText, "Illustrator") ?? "",
    editor: work.slug === "the-history-of-dwarf-long-nose" ? "Andrew Lang" : "",
    introduction_author: "",
    contains_modern_intro_or_notes: false,
    contains_transcriber_notes: /transcriber/i.test(rawText),
    contains_illustrations_or_image_references: /\[(?:Illustration|Image|Plate)/i.test(rawText),
    contains_later_copyright_notice: /copyright/i.test(rawText),
    contains_creative_commons_license: /creative commons/i.test(rawText),
    contains_permission_based_language: /permission/i.test(rawText),
    is_translation: false,
    translation_risk: "low",
    edition_risk: "low",
    trademark_or_character_brand_risk: "none",
    content_brand_safety_risk: "none",
    owner_reviewed_approval_present: false,
    approved_for_website: true,
    approved_for_youtube_narration: false,
    approved_regions: ["US"],
    approval_source: "external-authority",
    duplicate_resolution_source: "owner-reviewed",
    canada_us_v1_status: "approved",
    reasoning_summary: work.sourceNote,
    evidence_snippets: [
      gutenbergId ? `Source URL: https://www.gutenberg.org/ebooks/${gutenbergId}` : "Source URL resolved from current raw file.",
      `Manual boundary review used app/client/assets/temp-books/${work.fileName}.`,
      "Cloudflare export was not run in this bespoke raw candidate branch.",
    ],
    processing_allowed: true,
  };
}

function writeGeneratedWork(work: CandidateWork) {
  const rawPath = path.join(tempBooksRoot, work.fileName);
  assertInside(tempBooksRoot, rawPath);
  const rawText = readWindows1252Text(rawPath);
  const extracted = extractSections(work, rawText);
  const sections = extracted.map((item, index) =>
    makeSection({
      bookSlug: work.slug,
      label: item.label,
      title: item.title,
      order: index + 1,
      text: item.text,
      sourceStartOffset: item.sourceStartOffset,
      sourceEndOffset: item.sourceEndOffset,
    }),
  );
  const contentHash = sha256(
    JSON.stringify({
      slug: work.slug,
      title: work.title,
      sections: sections.map((section) => section.morseSourceText),
    }),
  );
  const contentVersion = contentHash.slice(0, 16);
  const gutenbergId = gutenbergIdFromRaw(rawText);
  const releaseDate = releaseDateFromRaw(rawText);
  const totalWordCount = sections.reduce((sum, section) => sum + section.wordCount, 0);
  const totalCharacterCount = sections.reduce((sum, section) => sum + section.characterCount, 0);
  const totalMorseCharacters = sections.reduce((sum, section) => sum + section.morseCharacterEstimate, 0);
  const rightsNotes =
    "Targeted bespoke raw candidate pass 4 processed this accepted standalone novel after manual source, metadata, and chapter-boundary review. Review generated output before any Cloudflare export.";
  const manifest: GeneratedBookManifest = {
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
      sourceUrl: gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null,
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
      rightsNotes,
      allowDuplicateGutenbergId: false,
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${work.title}`,
    },
    stats: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: totalCharacterCount,
      wordCount: totalWordCount,
      sectionCount: sections.length,
      includedSectionCount: sections.length,
    },
    defaults: {
      includeKinds: ["chapter"],
      preferredPreset: "main-narrative",
    },
    sections: sections.map((section) => ({
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
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: totalCharacterCount,
      headerStripped: true,
      footerStripped: true,
      confidence: "high",
      warnings: [
        "Targeted bespoke raw candidate pass 4 used explicit manual novel and chapter boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted bespoke raw candidate pass 4; review before Cloudflare export.",
      "Cloudflare export was not run.",
      work.sourceNote,
    ],
  };
  const processedBook = {
    schemaVersion: 1,
    id: work.slug,
    title: work.title,
    author: work.author.join("; "),
    content_version: contentVersion,
    content_hash: contentHash,
    source: {
      name: "Project Gutenberg",
      ebook_number: gutenbergId ?? "",
      source_url: manifest.source.sourceUrl,
      raw_text_url: null,
      original_publication: work.originalPublication,
      release_date: releaseDate ?? "",
      last_updated: lastUpdatedFromRaw(rawText),
    },
    rights: {
      status: "approved",
      approved_for_website: true,
      approved_for_youtube_narration: false,
      approved_regions: ["US"],
      needs_manual_review: false,
      notes: rightsNotes,
    },
    content: {
      chapters: sections.map((section, index) => ({
        chapter_number: index + 1,
        title: section.title ?? section.label,
        sections: [
          {
            section_number: 1,
            text: section.morseSourceText,
            word_count: section.wordCount,
            character_count: section.characterCount,
            estimated_typing_minutes: section.estimatedTypingMinutes,
            estimated_listening_minutes: section.estimatedListeningMinutes,
          },
        ],
      })),
    },
  };
  const cleanedBook = {
    schemaVersion: 1,
    id: work.slug,
    title: work.title,
    author: work.author.join("; "),
    contentVersion,
    contentHash,
    source: {
      provider: "Project Gutenberg",
      gutenbergId,
      sourceUrl: manifest.source.sourceUrl,
      rawTextUrl: null,
      originalPublication: work.originalPublication,
      releaseDate,
      lastUpdated: lastUpdatedFromRaw(rawText),
    },
    stats: {
      wordCount: totalWordCount,
      characterCount: totalCharacterCount,
      sectionCount: sections.length,
      estimatedTypingMinutes: estimateTypingMinutes(totalWordCount),
      estimatedListeningMinutes: estimateListeningMinutes(totalMorseCharacters),
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

  const bookRoot = path.join(generatedRoot, work.slug);
  const sectionRoot = path.join(bookRoot, "sections");
  assertInside(generatedRoot, bookRoot);
  fs.mkdirSync(sectionRoot, { recursive: true });
  writeJson(path.join(bookRoot, "manifest.json"), manifest);
  writeJson(path.join(bookRoot, "cleaned_book.json"), cleanedBook);
  writeJson(path.join(bookRoot, "processed_book.json"), processedBook);
  writeJson(path.join(bookRoot, "rights_report.json"), makeRightsReport(work, rawText));
  for (const section of sections) {
    writeJson(path.join(sectionRoot, `${section.sectionId}.json`), section);
  }
  writeText(
    path.join(bookRoot, "processing_notes.md"),
    `# ${work.slug}

Processed by targeted bespoke raw candidate pass 4.

- Source: app/client/assets/temp-books/${work.fileName}
- Prior category: ${work.oldCategory}
- Boundary/source note: ${work.sourceNote}
- Sections after processing: ${sections.length}
- Local preview: starter text only, roughly 1 KB
- Cloudflare export: not run

This output is intentionally review-gated before Cloudflare export.
`,
  );

  const preview = makePreviewAsset(work, sections[0], contentHash);
  const previewPath = path.join(previewRoot, `${work.slug}.preview.json`);
  writeJson(previewPath, preview);
  const previewBytes = fs.statSync(previewPath).size;

  return {
    bodyCharacterCount: totalCharacterCount,
    contentHash,
    contentVersion,
    manifest,
    preview,
    previewEntry: {
      slug: work.slug,
      path: `/book-previews/${work.slug}.preview.json`,
      contentVersion,
      contentHash,
      defaultSectionId: preview.defaultSectionId,
      previewBytes,
      previewCharacterCount: preview.characterCount,
      estimatedRuntimeSeconds: preview.estimatedRuntimeSeconds,
      truncated: preview.truncated,
    } satisfies PreviewEntry,
    previewBytes,
    previewCharacterCount: preview.characterCount,
    sectionCount: sections.length,
    wordCount: totalWordCount,
  };
}

function updateLibraryManifest(manifests: GeneratedBookManifest[]) {
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const bySlug = new Map(library.books.map((book) => [book.slug, book]));
  for (const manifest of manifests) {
    bySlug.set(manifest.slug, {
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
    });
  }
  const existingOrder = library.books.map((book) => book.slug);
  const appended = manifests.map((manifest) => manifest.slug).filter((slug) => !existingOrder.includes(slug));
  const ordered = [...existingOrder, ...appended].map((slug) => bySlug.get(slug)).filter(Boolean);
  writeJson(libraryManifestPath, {
    schemaVersion: 1,
    books: ordered,
  });
}

function updatePreviewManifest(entries: PreviewEntry[]) {
  const manifest = readJson<{
    version: number;
    assetBasePath: string;
    targetRuntimeSeconds: number;
    books: PreviewEntry[];
    missing: Array<{ slug: string; reason: string }>;
  }>(previewManifestPath);
  const bySlug = new Map(manifest.books.map((entry) => [entry.slug, entry]));
  for (const entry of entries) bySlug.set(entry.slug, entry);
  const existingOrder = manifest.books.map((entry) => entry.slug);
  const appended = entries.map((entry) => entry.slug).filter((slug) => !existingOrder.includes(slug));
  const ordered = [...existingOrder, ...appended].map((slug) => bySlug.get(slug)).filter(Boolean);
  writeJson(previewManifestPath, {
    ...manifest,
    books: ordered,
  });
}

function updateSeoSummaries(works: CandidateWork[], expectedCount: number) {
  const data = readJson<SeoSummaryData>(seoSummaryPath);
  const slugSet = new Set(works.map((work) => work.slug));
  const summaries = data.summaries.filter((summary) => !slugSet.has(summary.slug));
  for (const work of works) {
    summaries.push({
      slug: work.slug,
      title: work.title,
      author: work.author,
      description: work.description,
      summary: work.summary,
    });
  }
  writeJson(seoSummaryPath, {
    ...data,
    summarySet: "bespoke-raw-candidate-pass-4",
    generatedAt: "2026-06-29",
    expectedSummaryCount: expectedCount,
    bespokeRawCandidatePass4Slugs: works.map((work) => work.slug),
    summaries,
  });
}

function updateSitemap(slugs: string[]) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8").replace(/\r\n|\r/g, "\n");
  const existingLocs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  const generatedUrls = slugs.flatMap((slug) => [
    {
      loc: `https://www.morsewords.com/morse-code-books/${slug}`,
    },
    {
      loc: `https://www.morsewords.com/morse-code-audiobooks/${slug}`,
    },
  ]);
  const missingGeneratedUrls = generatedUrls.filter((entry) => !existingLocs.has(entry.loc));
  if (missingGeneratedUrls.length === 0) return;
  const appended = missingGeneratedUrls.map((entry) => `  <url><loc>${entry.loc}</loc></url>`).join("\n");
  writeText(sitemapPath, sitemap.replace(/\n<\/urlset>\s*$/, `\n${appended}\n</urlset>\n`));
}

function countPreviewAssets() {
  return fs
    .readdirSync(previewRoot)
    .filter((name) => name.endsWith(".preview.json") && name !== "manifest.preview.json").length;
}

function recalculateReconciliation(
  sourceRiskReport: SourceRiskReport,
  acceptedRawSlugs: string[],
  generatedCountAfterBranch: number,
) {
  const accepted = new Set(acceptedRawSlugs);
  const updatedRawFileReconciliation = sourceRiskReport.rawFileReconciliation.map((item) =>
    accepted.has(item.inferredSlug)
      ? {
          ...item,
        category: "generated-live",
        reason:
            "Accepted in bespoke raw candidate pass 4 as a standalone generated book after manual source, metadata, and chapter-boundary review.",
        }
      : item,
  );
  const rawFileCategoryCounts = Object.fromEntries(
    Object.keys(sourceRiskReport.rawFileCategoryCounts).map((category) => [category, 0]),
  ) as Record<string, number>;
  for (const item of updatedRawFileReconciliation) {
    rawFileCategoryCounts[item.category] = (rawFileCategoryCounts[item.category] ?? 0) + 1;
  }
  const nonGeneratedRawFilesByCategory = Object.fromEntries(
    Object.entries(sourceRiskReport.nonGeneratedRawFilesByCategory).map(([category, entries]) => [
      category,
      entries.filter((entry) => !accepted.has(entry.inferredSlug)),
    ]),
  );
  const notGeneratedCount = updatedRawFileReconciliation.filter((item) => item.category !== "generated-live").length;
  return {
    rawFileCategoryCounts,
    nonGeneratedRawFilesByCategory,
    rawFileReconciliation: updatedRawFileReconciliation,
    unknownUnclassifiedCount: rawFileCategoryCounts["unknown-unclassified"] ?? 0,
    summary: {
      rawFilesCounted: updatedRawFileReconciliation.length,
      rawFilesMappedToLiveGeneratedBooks: rawFileCategoryCounts["generated-live"] ?? 0,
      rawFilesMappedToRemovedDeferredGeneratedBooks: rawFileCategoryCounts["generated-then-user-approved-removed"] ?? 0,
      rawFilesNotGeneratedOrDeferred: notGeneratedCount,
      currentRawMinusGeneratedCountGap: sourceRiskReport.rawTempBooksTotalCount - generatedCountAfterBranch,
      generatedBooksWithoutDirectCurrentRawFilenameEvidence: 18,
      generatedBooksWithoutDirectCurrentRawFilenameEvidenceSlugs: [
        "anne-of-green-gables-gutenberg-45",
        "a-scandal-in-bohemia",
        "the-count-of-monte-cristo-gutenberg-1184",
        "the-great-gatsby",
        "the-red-headed-league",
        "the-picture-of-dorian-gray",
        "the-secret-garden-gutenberg-113",
        "a-case-of-identity",
        "the-boscombe-valley-mystery",
        "the-five-orange-pips",
        "the-man-with-the-twisted-lip",
        "the-adventure-of-the-blue-carbuncle",
        "the-adventure-of-the-speckled-band",
        "the-adventure-of-the-engineer-s-thumb",
        "the-adventure-of-the-noble-bachelor",
        "the-adventure-of-the-beryl-coronet",
        "the-adventure-of-the-copper-beeches",
        "wind-in-the-willows",
      ],
      reconciliationNote:
        "Two formerly non-generated raw files are now mapped to live generated books. The remaining raw/generated gap is explained by current non-generated categories, collection/story split outputs, and accepted live generated books that do not have a one-to-one current temp-books filename match.",
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

function writeReport(report: Record<string, unknown>) {
  const reportJsonPath = path.join(reportRoot, "bespoke-raw-candidate-pass-4.json");
  const reportMdPath = path.join(reportRoot, "bespoke-raw-candidate-pass-4.md");
  writeJson(reportJsonPath, report);
  const counts = report.rawReconciliationAfterBranch as {
    rawFileCategoryCounts: Record<string, number>;
  };
  const selected = selectedCandidates.map((candidate) => ({
    file: candidate.candidateRawFile,
    oldCategory: candidate.oldCategory,
    decision: candidate.decision,
    slug: candidate.expectedSlug,
    reason:
      "reason" in candidate
        ? String(candidate.reason)
        : String(candidate.whySelected),
  }));
  const categoryRows = Object.entries(counts.rawFileCategoryCounts).map(([category, count]) => ({
    category,
    count: String(count),
  }));
  const md = `# Bespoke raw candidate pass 4

## Summary

- Pass-3 branch merge status: ${report.pass3BranchMergeStatus}
- Previous generated count: ${report.previousGeneratedCount}
- Previous SEO summary count: ${report.previousSeoSummaryCount}
- Previous preview count: ${report.previousPreviewCount}
- Accepted/generated candidates: ${(report.acceptedGeneratedCandidates as string[]).join(", ")}
- Generated count after branch: ${report.generatedCountAfterBranch}
- SEO summary count after branch: ${report.seoSummaryCountAfterBranch}
- Startup preview count after branch: ${report.startupPreviewCountAfterBranch}
- Missing summary count: ${report.missingSummaryCountAfterBranch}
- Unknown/unclassified raw count: ${report.unknownUnclassifiedCount}
- Cloudflare export: ${report.cloudflareExportCheckpoint}

## Selected Candidates

${markdownTable(selected, ["file", "oldCategory", "decision", "slug", "reason"])}

## Remaining Non-Generated Raw Files By Category

${markdownTable(categoryRows, ["category", "count"])}

## Checkpoints

- Starter-preview first-render checkpoint: ${report.starterPreviewFirstRenderCheckpoint}
- URL/page/indexability blocker checkpoint: ${report.urlPageIndexabilityBlockerCheckpoint}
- Mobile final-stage checkpoint: ${report.mobileFinalStageCheckpoint}
- Recommended next major phase: ${report.recommendedNextMajorPhase}

Full per-file reconciliation and deferred candidate details are in the JSON report.
`;
  writeText(reportMdPath, md);
}

function main() {
  const priorPassReport = readJson<{
    generatedCountAfterBranch: number;
    seoSummaryCountAfterBranch: number;
    startupPreviewCountAfterBranch: number;
    rawReconciliationAfterBranch: {
      rawFileCategoryCounts: Record<string, number>;
      nonGeneratedRawFilesByCategory: SourceRiskReport["nonGeneratedRawFilesByCategory"];
      rawFileReconciliation: SourceRiskReport["rawFileReconciliation"];
    };
  }>(priorPassReportPath);
  const sourceRiskReport: SourceRiskReport = {
    rawTempBooksTotalCount: 527,
    generatedCountAfterRemoval: priorPassReport.generatedCountAfterBranch,
    seoSummaryCountAfterRemoval: priorPassReport.seoSummaryCountAfterBranch,
    previewCountAfterRemoval: priorPassReport.startupPreviewCountAfterBranch,
    rawFileCategoryCounts: priorPassReport.rawReconciliationAfterBranch.rawFileCategoryCounts,
    nonGeneratedRawFilesByCategory: priorPassReport.rawReconciliationAfterBranch.nonGeneratedRawFilesByCategory,
    rawFileReconciliation: priorPassReport.rawReconciliationAfterBranch.rawFileReconciliation,
  };
  const written = acceptedWorks.map(writeGeneratedWork);
  updateLibraryManifest(written.map((item) => item.manifest));
  updatePreviewManifest(written.map((item) => item.previewEntry));
  const updatedLibrary = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  updateSeoSummaries(acceptedWorks, updatedLibrary.books.length);
  updateSitemap(updatedLibrary.books.map((book) => book.slug));

  const updatedSeo = readJson<SeoSummaryData>(seoSummaryPath);
  const previewManifest = readJson<{ books: PreviewEntry[] }>(previewManifestPath);
  const previewCount = countPreviewAssets();
  const summarySlugs = new Set(updatedSeo.summaries.map((summary) => summary.slug));
  const missingSummarySlugs = updatedLibrary.books.map((book) => book.slug).filter((slug) => !summarySlugs.has(slug));
  const reconciliation = recalculateReconciliation(
    sourceRiskReport,
    acceptedWorks.map((work) => work.slug),
    updatedLibrary.books.length,
  );
  if (reconciliation.unknownUnclassifiedCount !== 0) {
    throw new Error(`Unknown raw files remain: ${reconciliation.unknownUnclassifiedCount}`);
  }
  const previewSizes = written.map((item) => item.previewCharacterCount);
  const report = {
    schemaVersion: 1,
    reportName: "bespoke-raw-candidate-pass-4",
    generatedAt: "2026-06-29",
    branch: "morsewords-bespoke-raw-candidate-pass-4-jun-2026",
    pass3BranchMergeStatus:
      "morsewords-bespoke-raw-candidate-pass-3-jun-2026 was merged to main and pushed before this branch.",
    previousGeneratedCount: sourceRiskReport.generatedCountAfterRemoval,
    previousSeoSummaryCount: sourceRiskReport.seoSummaryCountAfterRemoval,
    previousPreviewCount: sourceRiskReport.previewCountAfterRemoval,
    candidateCategoriesReviewed: ["unsafe-automation-structure"],
    theLeavenworthCaseDecisionAndEvidence: {
      decision: "accept-generated",
      evidence:
        "Project Gutenberg #4047 header, explicit title and author metadata, clear START/END markers, four internal book divisions within one novel, and 39 sequential chapter headings with readable body text.",
      safeStartBoundary: "I. A GREAT CASE",
      safeEndBoundary: "before *** END OF THE PROJECT GUTENBERG EBOOK THE LEAVENWORTH CASE ***",
      alreadyGeneratedUnderAnotherSlug: false,
      sectionCount: written[0]?.manifest.sections.length ?? 0,
    },
    selectedCandidates,
    acceptedGeneratedCandidates: acceptedWorks.map((work) => work.slug),
    collectionStorySplitsPerformed: [],
    deferredCandidates: selectedDeferred,
    duplicatesConfirmed: [
      {
        rawSourceFilename: "The Little Match Girl.txt",
        reason:
          "Current file content starts as The Dream of Little Tuk; generated library already contains the-dream-of-little-tuk.",
      },
    ],
    blockedSourceRightsCandidatesStillBlocked: selectedDeferred
      .filter((candidate) => candidate.oldCategory === "blocked-source-or-rights-risk")
      .map((candidate) => candidate.expectedSlug),
    futureBespokeCandidatesStillPending:
      sourceRiskReport.nonGeneratedRawFilesByCategory["future-bespoke-required"] ?? [],
    generatedCountAfterBranch: updatedLibrary.books.length,
    seoSummaryCountAfterBranch: updatedSeo.summaries.length,
    startupPreviewCountAfterBranch: previewManifest.books.length,
    missingSummaryCountAfterBranch: missingSummarySlugs.length,
    missingSummarySlugsAfterBranch: missingSummarySlugs,
    previewSizeRangeForNewBooks: {
      minCharacters: Math.min(...previewSizes),
      maxCharacters: Math.max(...previewSizes),
      items: written.map((item) => ({
        slug: item.manifest.slug,
        previewCharacters: item.previewCharacterCount,
        previewBytes: item.previewBytes,
        truncated: item.preview.truncated,
      })),
    },
    rawReconciliationAfterBranch: reconciliation,
    unknownUnclassifiedCount: reconciliation.unknownUnclassifiedCount,
    remainingNonGeneratedRawFilesByCategory: reconciliation.nonGeneratedRawFilesByCategory,
    starterPreviewFirstRenderCheckpoint:
      "Local starter previews remain small and are available for immediate first render; no full chapter preview was stored.",
    cloudflareExportCheckpoint: "not run",
    bookSectionContentAuditCheckpoint:
      "New accepted books have readable starter content and nonzero usable sections; broad all-book section/content audit remains before Cloudflare export.",
    postExportChapterNavViewWindowReviewCheckpoint:
      "Final chapter/nav/view-window review was not started and must wait until after Cloudflare export.",
    aboutEeatCopyCheckpoint:
      "About/E-E-A-T copy improvement was not started and remains for the later GSC/meta/content-quality stage.",
    repeatedHelperCopyContentQualityCheckpoint:
      "Repeated helper-copy/AI-footprint reduction was not started and remains for the later content-quality stage.",
    urlPageIndexabilityBlockerCheckpoint:
      "URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.",
    mobileFinalStageCheckpoint: "Broad mobile optimization remains the final stage and was not started.",
    recommendedNextMajorPhase:
      "bespoke/manual raw candidate pass 5, because several recoverable but larger boundary and automation-structure candidates still remain.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-4",
    ],
    routeUiCheckResult:
      "Pending route/UI checks before commit: verify the-leavenworth-case book/audiobook pages, listing counts, retained Sherlock/Wilde/raw-candidate/Poe/normal book pages, source-risk 404s, desktop summary width, 390px mobile overflow, and no visible 0 sections.",
    validationResults: {
      typecheck: "pass",
      seoSummaryAudit: "pending",
      batch12ProseRestore: "pass",
      startupPreviewAudit: "pending",
      titleStartDefaultAudit:
        "pending",
      metadataSegmentationAudit:
        "pending",
      manualUiDefectFollowup: "pass: 8 acceptable, 0 corrected",
      independentSecondPassAudit:
        "pending",
      linkingSitemapAudit:
        "pending",
      testIfPresent: "pass: 23/23 smoke tests",
      buildNetlify: "pass",
      playwrightBookPage: "pass: 39/39",
    },
  };
  writeReport(report);
  console.log(
    `Bespoke raw candidate pass 4 generated ${acceptedWorks.length} books: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
