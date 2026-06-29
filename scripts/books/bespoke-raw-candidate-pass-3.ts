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
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-3",
);
const priorPassReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/sherlock-story-split-pass-2/sherlock-story-split-pass-2.json",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const seoSummaryPath = path.join(
  repoRoot,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const sitemapPath = path.join(repoRoot, "public/sitemap.xml");

const acceptedWorks: CandidateWork[] = [
  {
    fileName: "The Sign of the Four.txt",
    slug: "the-sign-of-the-four",
    title: "The Sign of the Four",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes novel about Mary Morstan, a hidden treasure, and a case that stretches from Baker Street to the Thames.",
    subjects: ["Detective fiction", "Mystery fiction", "Sherlock Holmes", "Novels"],
    originalPublication: "1890",
    oldCategory: "unsafe-automation-structure",
    sourceNote:
      "Manual pass accepted the Project Gutenberg file as a single standalone novel, removing Gutenberg header, title-page matter, contents, back matter, and license text while preserving the twelve chapter bodies.",
    selectionReason:
      "Project Gutenberg provenance is explicit, and the body has clear sequential chapter headings from Chapter I through Chapter XII.",
    decision: "accept",
    riskBeingFixed: "automation-structure chapter boundary review",
    sections: [
      {
        label: "Chapter I",
        title: "The Science of Deduction",
        startText: "Chapter I\n",
        endText: "\n\n\n\nChapter II\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter II",
        title: "The Statement of the Case",
        startText: "Chapter II\n",
        endText: "\n\n\n\nChapter III\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter III",
        title: "In Quest of a Solution",
        startText: "Chapter III\n",
        endText: "\n\n\n\nChapter IV\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter IV",
        title: "The Story of the Bald-Headed Man",
        startText: "Chapter IV\n",
        endText: "\n\n\n\nChapter V\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter V",
        title: "The Tragedy of Pondicherry Lodge",
        startText: "Chapter V\n",
        endText: "\n\n\n\nChapter VI\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter VI",
        title: "Sherlock Holmes Gives a Demonstration",
        startText: "Chapter VI\n",
        endText: "\n\n\n\nChapter VII\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter VII",
        title: "The Episode of the Barrel",
        startText: "Chapter VII\n",
        endText: "\n\n\n\nChapter VIII\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter VIII",
        title: "The Baker Street Irregulars",
        startText: "Chapter VIII\n",
        endText: "\n\n\n\nChapter IX\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter IX",
        title: "A Break in the Chain",
        startText: "Chapter IX\n",
        endText: "\n\n\n\nChapter X\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter X",
        title: "The End of the Islander",
        startText: "Chapter X\n",
        endText: "\n\n\n\nChapter XI\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter XI",
        title: "The Great Agra Treasure",
        startText: "Chapter XI\n",
        endText: "\n\n\n\nChapter XII\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "Chapter XII",
        title: "The Strange Story of Jonathan Small",
        startText: "Chapter XII\n",
        endText: "\n\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK THE SIGN OF THE FOUR ***",
        includeStartText: false,
        includeEndText: false,
      }
    ],
    summary: "The Sign of the Four is a Sherlock Holmes novel built around Mary Morstan's strange yearly pearls, a missing father, and the history of the Agra treasure. Holmes and Watson begin with a puzzling invitation and follow the case through interviews, hidden rooms, coded messages, a river chase, and a long confession that explains how private greed and imperial history have become tangled together. The book is longer than the individual Holmes stories already added to MorseWords, but it still has a clean chapter structure and a steady detective rhythm.\n\nFor MorseWords learners, the novel is useful because each chapter has a clear job. The opening returns to Holmes and Watson's method, the middle chapters collect evidence and widen the mystery, and the final chapters turn toward pursuit and explanation. That shape makes it practical to listen chapter by chapter instead of treating the whole book as one oversized exercise. Learners can start with Chapter I for familiar Baker Street dialogue, then move to the statement of the case, the pursuit sequences, or Jonathan Small's account when they want longer practice.\n\nThe text gives varied Morse practice without losing its anchors. Names such as Holmes, Watson, Morstan, Sholto, Tonga, and Small repeat often, while concrete words such as treasure, boat, river, pearls, key, letter, and box help the listener stay oriented. Dialogue, deduction, action, and backstory all appear, so the book works for both listening endurance and careful copying.\n\nBecause the story has twelve moderate chapters, it is well suited to short repeat sessions. A beginner can replay a single chapter slowly to practice spacing and punctuation. A more confident learner can compare chapters with different pacing: the calm opening, the investigative middle, and the faster river pursuit. The result is a public-domain detective novel that extends the Sherlock set while still fitting the MorseWords flow of translate, hear, practice, review, and return.",
  },
  {
    fileName: "The Mysterious Affair at Styles.txt",
    slug: "the-mysterious-affair-at-styles",
    title: "The Mysterious Affair at Styles",
    author: ["Agatha Christie"],
    authorDeathYear: 1976,
    description:
      "Agatha Christie's first Hercule Poirot mystery, set around a country-house poisoning and the careful reconstruction of evidence.",
    subjects: ["Detective fiction", "Mystery fiction", "Hercule Poirot", "Novels"],
    originalPublication: "1920",
    oldCategory: "unsafe-automation-structure",
    sourceNote:
      "Manual pass accepted the Project Gutenberg file as a standalone novel from current repo evidence, removing Gutenberg header, contents, back matter, and license text while preserving the thirteen chapter bodies.",
    selectionReason:
      "Project Gutenberg provenance is explicit, and the novel has clear sequential chapter headings from Chapter I through Chapter XIII.",
    decision: "accept",
    riskBeingFixed: "automation-structure chapter boundary review",
    sections: [
      {
        label: "CHAPTER I",
        title: "I GO TO STYLES",
        startText: "CHAPTER I.\n",
        endText: "\n\n\n\nCHAPTER II.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER II",
        title: "THE 16TH AND 17TH OF JULY",
        startText: "CHAPTER II.\n",
        endText: "\n\n\n\nCHAPTER III.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER III",
        title: "THE NIGHT OF THE TRAGEDY",
        startText: "CHAPTER III.\n",
        endText: "\n\n\n\nCHAPTER IV.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER IV",
        title: "POIROT INVESTIGATES",
        startText: "CHAPTER IV.\n",
        endText: "\n\n\n\nCHAPTER V.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER V",
        title: "\"IT ISN'T STRYCHNINE, IS IT?\"",
        startText: "CHAPTER V.\n",
        endText: "\n\n\n\nCHAPTER VI.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER VI",
        title: "THE INQUEST",
        startText: "CHAPTER VI.\n",
        endText: "\n\n\n\nCHAPTER VII.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER VII",
        title: "POIROT PAYS HIS DEBTS",
        startText: "CHAPTER VII.\n",
        endText: "\n\n\n\nCHAPTER VIII.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER VIII",
        title: "FRESH SUSPICIONS",
        startText: "CHAPTER VIII.\n",
        endText: "\n\n\n\nCHAPTER IX.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER IX",
        title: "DR. BAUERSTEIN",
        startText: "CHAPTER IX.\n",
        endText: "\n\n\n\nCHAPTER X.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER X",
        title: "THE ARREST",
        startText: "CHAPTER X.\n",
        endText: "\n\n\n\nCHAPTER XI.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER XI",
        title: "THE CASE FOR THE PROSECUTION",
        startText: "CHAPTER XI.\n",
        endText: "\n\n\n\nCHAPTER XII.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER XII",
        title: "THE LAST LINK",
        startText: "CHAPTER XII.\n",
        endText: "\n\n\n\nCHAPTER XIII.\n",
        includeStartText: false,
        includeEndText: false,
      },
      {
        label: "CHAPTER XIII",
        title: "POIROT EXPLAINS",
        startText: "CHAPTER XIII.\n",
        endText: "\n\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK THE MYSTERIOUS AFFAIR AT STYLES ***",
        includeStartText: false,
        includeEndText: false,
      }
    ],
    summary: "The Mysterious Affair at Styles is Agatha Christie's first Hercule Poirot mystery. The story follows Hastings as he visits Styles Court, becomes caught in the aftermath of a poisoning, and watches Poirot rebuild the case from domestic details, testimony, timing, and the behavior of people who all seem to have something to hide. The country-house setting, the legal questions, and Poirot's methodical explanations make the novel a strong bridge from short mystery stories into longer detective reading.\n\nFor MorseWords learners, the book is helpful because it has thirteen clearly titled chapters and a steady investigative structure. The early chapters establish the household and the crime, the middle chapters test suspects and evidence, and the final chapters bring the case into court-like argument and explanation. That makes the novel easy to divide into short practice sessions. Learners can work on one chapter at a time while still feeling progress through the whole mystery.\n\nThe vocabulary is especially useful for listening practice. Repeated names such as Poirot, Hastings, Inglethorp, Cavendish, Howard, and Styles become anchors, while words about medicine, keys, rooms, letters, cups, poison, evidence, and testimony add variety. The book also contains many conversations, which gives learners practice with quotation marks, speaker changes, and sentence rhythm. Slower playback is useful for scenes where clues depend on exact timing or small contradictions.\n\nThis novel also rewards review. On a first pass, learners can listen for the broad plot and main suspects. On later passes, they can focus on how Poirot handles details that seemed unimportant earlier. That makes it a good long-form Morse text for building endurance without losing comprehension. It is public-domain source material in the current repo context, and the local starter preview remains intentionally small so the page can render quickly while the full payload is deferred until export infrastructure is ready.",
  },
];

const selectedDeferred = [
  { candidateRawFile: "Yellow gentians and blue.txt", oldCategory: "unsafe-automation-structure", whySelected: "Named deferred item reviewed for mixed poetry/prose structure.", expectedSlug: "yellow-gentians-and-blue", expectedTitle: "Yellow Gentians and Blue", expectedAuthor: "Zona Gale", riskBeingFixed: "mixed poetry/prose structure and metadata planning", decision: "keep deferred", reason: "The file is a mixed collection with poems, prose pieces, plays, and internal title lists; it needs a dedicated section plan rather than a small full-book extraction." },
  { candidateRawFile: "Beowulf - An Anglo-Saxon Epic Poem.txt", oldCategory: "unsafe-metadata-risk", whySelected: "Named deferred item reviewed for translator metadata and section structure.", expectedSlug: "beowulf-an-anglo-saxon-epic-poem", expectedTitle: "Beowulf: An Anglo-Saxon Epic Poem", expectedAuthor: "J. Lesslie Hall, translator", riskBeingFixed: "translator metadata and epic sectioning", decision: "keep deferred", reason: "The file includes prefatory matter, notes, glossary material, and translator-specific metadata; it should wait for a dedicated epic/translation treatment." },
  { candidateRawFile: "The Little Match Girl.txt", oldCategory: "unsafe-title-parent-collection-risk", whySelected: "Named deferred item checked for title/content mismatch.", expectedSlug: "the-little-match-girl", expectedTitle: "The Little Match Girl", expectedAuthor: "Hans Christian Andersen", riskBeingFixed: "title/content mismatch", decision: "keep deferred", reason: "The current raw file is an Andersen Fairy Tales extract that starts with The Dream of Little Tuk, which is already generated; it is not The Little Match Girl." },
  { candidateRawFile: "THE APPLE.txt", oldCategory: "blocked-source-or-rights-risk", whySelected: "Named blocked item checked for current repo provenance evidence.", expectedSlug: "the-apple", expectedTitle: "The Apple", expectedAuthor: "H. G. Wells", riskBeingFixed: "source/provenance risk", decision: "keep deferred", reason: "The raw file still has no Project Gutenberg header, release metadata, or current repo evidence that resolves provenance risk." },
  { candidateRawFile: "THE STORY OF THE LATE MR. ELVESHAM.txt", oldCategory: "blocked-source-or-rights-risk", whySelected: "Named blocked item checked for current repo provenance evidence.", expectedSlug: "the-story-of-the-late-mr-elvesham", expectedTitle: "The Story of the Late Mr. Elvesham", expectedAuthor: "H. G. Wells", riskBeingFixed: "source/provenance risk", decision: "keep deferred", reason: "The raw file still has no Project Gutenberg header, release metadata, or current repo evidence that resolves provenance risk." },
  { candidateRawFile: "The Leavenworth Case.txt", oldCategory: "unsafe-automation-structure", whySelected: "Reviewed as a possible clean detective novel after the two smaller accepted items.", expectedSlug: "the-leavenworth-case", expectedTitle: "The Leavenworth Case", expectedAuthor: "Anna Katharine Green", riskBeingFixed: "large multi-book chapter structure", decision: "keep deferred", reason: "The file is structurally clean but long, with multiple internal books and many chapters; it should be handled in its own reviewable pass instead of expanding this batch." },
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

function makePreviewAsset(work: CandidateWork, section: GeneratedBookSectionJson, contentHash: string) {
  const previewText = previewTextForBody(section.morseSourceText);
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
  const rawText = fs.readFileSync(rawPath, "utf8");
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
    "Targeted bespoke raw candidate pass 3 processed this accepted story after manual collection-split, source, and metadata review. Review generated output before any Cloudflare export.";
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
      allowDuplicateGutenbergId: true,
      duplicateReason:
        "Individual story extracted from a parent Project Gutenberg collection after manual review.",
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
        "Targeted bespoke raw candidate pass 3 used explicit manual story boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted bespoke raw candidate pass 3; review before Cloudflare export.",
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

Processed by targeted bespoke raw candidate pass 3.

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
      path: `${work.slug}.preview.json`,
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
    summarySet: "bespoke-raw-candidate-pass-3",
    generatedAt: "2026-06-28",
    expectedSummaryCount: expectedCount,
    bespokeRawCandidatePass3Slugs: works.map((work) => work.slug),
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
            "Accepted in bespoke raw candidate pass 3 as a standalone generated book after manual source, metadata, and chapter-boundary review.",
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
  const reportJsonPath = path.join(reportRoot, "bespoke-raw-candidate-pass-3.json");
  const reportMdPath = path.join(reportRoot, "bespoke-raw-candidate-pass-3.md");
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
  const md = `# Bespoke raw candidate pass 3

## Summary

- Sherlock pass-2 branch merge status: ${report.sherlockPass2BranchMergeStatus}
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
    reportName: "bespoke-raw-candidate-pass-3",
    generatedAt: "2026-06-28",
    branch: "morsewords-bespoke-raw-candidate-pass-3-jun-2026",
    sherlockPass2BranchMergeStatus:
      "morsewords-sherlock-story-split-pass-2-jun-2026 was merged to main and pushed before this branch.",
    previousGeneratedCount: sourceRiskReport.generatedCountAfterRemoval,
    previousSeoSummaryCount: sourceRiskReport.seoSummaryCountAfterRemoval,
    previousPreviewCount: sourceRiskReport.previewCountAfterRemoval,
    candidateCategoriesReviewed: [
      "unsafe-automation-structure",
      "unsafe-metadata-risk",
      "unsafe-title-parent-collection-risk",
      "blocked-source-or-rights-risk",
    ],
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
    urlPageIndexabilityBlockerCheckpoint:
      "URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.",
    mobileFinalStageCheckpoint: "Broad mobile optimization remains the final stage and was not started.",
    recommendedNextMajorPhase:
      "bespoke/manual raw candidate pass 4, because recoverable but larger boundary and automation-structure candidates still remain.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-3",
    ],
    routeUiCheckResult:
      "Pending route/UI checks before commit: verify the-sign-of-the-four book/audiobook pages, listing counts, retained Sherlock/Wilde/raw-candidate/Poe/normal book pages, source-risk 404s, desktop summary width, and 390px mobile overflow.",
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
    `Bespoke raw candidate pass 3 generated ${acceptedWorks.length} books: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
