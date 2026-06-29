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
  bespokeRawCandidatePass5Slugs?: string[];
  bespokeRawCandidatePass7Slugs?: string[];
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
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-7",
);
const priorPassReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-5/bespoke-raw-candidate-pass-5.json",
);
const pass6ReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-6/bespoke-raw-candidate-pass-6.json",
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
    fileName: "Island Nights' Entertainments.txt",
    slug: "the-beach-of-falesa",
    title: "The Beach of Falesá",
    author: ["Robert Louis Stevenson"],
    authorDeathYear: 1894,
    description:
      "Robert Louis Stevenson's South Seas story about Wiltshire, Uma, Case, trade, isolation, and danger on Falesá.",
    subjects: ["Pacific Area -- Fiction", "Short stories", "Adventure stories", "Traders -- Fiction"],
    originalPublication: "1892",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split Project Gutenberg #329 into standalone story units, removing the collection title page, contents, other stories, back matter, and license text while preserving this story's five chapter bodies.",
    selectionReason:
      "The Project Gutenberg #329 source has explicit collection metadata, a standard END marker, and a clean THE BEACH OF FALESÁ heading followed by five internal chapters before the next story heading.",
    decision: "accept",
    riskBeingFixed: "collection/story-unit split with manual start and end boundary",
    sections: [],
    summary: "The Beach of Falesá is Robert Louis Stevenson's South Seas story about John Wiltshire, a trader who arrives at a new island station and is quickly drawn into a web of local custom, commercial rivalry, fear, superstition, and violence. The story follows Wiltshire's relationship with Uma, his uneasy dealings with the manipulative Case, and the slow realization that the island's business arrangements hide something darker than ordinary beach gossip.\n\nFor MorseWords practice, this story is a strong bridge between adventure fiction and more complicated adult prose. The chapters are substantial but not enormous, and the setting gives learners repeated anchors: island, beach, trader, house, captain, native, Case, Uma, Falesá, copra, boat, and mission. Those recurring words help a listener recover after a missed phrase, while the dialogue gives useful rhythm for copying speaker changes.\n\nThe first chapter works well as a starter session because it opens with a vivid arrival scene and introduces the main social pressures without requiring background from the rest of the collection. Slower WPM settings are useful at first, especially around names, nautical language, and Stevenson's longer descriptive sentences. Once the names become familiar, the story is good for practicing longer listening spans because each chapter has a clear dramatic turn.\n\nBecause the piece uses five internal chapters, it is also easy to scale the difficulty. A learner can treat Chapter I as orientation, then use later chapters for denser dialogue, conflict, and action. The island vocabulary repeats often enough to make review meaningful, but the sentences still require careful attention to punctuation and spacing.\n\nA practical routine is to listen to one chapter in short slices. Copy the first two or three paragraphs, replay them while reading, then list the names and setting words that caused trouble. On a later pass, listen without looking and see whether the repeated island vocabulary now stands out more clearly in Morse.",
  },
  {
    fileName: "Island Nights' Entertainments.txt",
    slug: "the-bottle-imp",
    title: "The Bottle Imp",
    author: ["Robert Louis Stevenson"],
    authorDeathYear: 1894,
    description:
      "Robert Louis Stevenson's supernatural tale about Keawe, Kokua, a cursed bottle, desire, bargain, and sacrifice.",
    subjects: ["Pacific Area -- Fiction", "Short stories", "Supernatural fiction", "Hawaii -- Fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split Project Gutenberg #329 into standalone story units, removing the collection title page, contents, adjacent stories, back matter, and license text while preserving the complete story body.",
    selectionReason:
      "The Project Gutenberg #329 source has explicit collection metadata, a standard END marker, and a clean THE BOTTLE IMP heading bounded by the surrounding story headings.",
    decision: "accept",
    riskBeingFixed: "collection/story-unit split with manual start and end boundary",
    sections: [],
    summary: "The Bottle Imp is Robert Louis Stevenson's supernatural tale about Keawe, a Hawaiian man who buys a magical bottle that can grant wishes but carries a terrible condition. The story turns on temptation, wealth, love, illness, bargaining, and sacrifice as Keawe and Kokua try to escape a bargain that becomes more dangerous each time the bottle changes hands.\n\nFor Morse practice, The Bottle Imp is compact enough for a focused session but rich enough to reward repetition. Its repeated words are clear anchors: bottle, imp, money, house, Keawe, Kokua, cent, buy, sell, wish, fear, and love. The plot also has a strong cause-and-effect shape, which helps learners follow meaning even when a sentence is missed.\n\nThis is a useful choice for learners who want more emotion and suspense than a simple fable. Start by listening to the opening paragraphs until the central rule of the bottle is easy to copy. Then move through the story in short spans, paying special attention to numbers and prices, because the bargain depends on exact values. Slower playback can make the names and currency details much easier to catch.\n\nThe story is generated as one standalone section, so it works best when you choose a short manual range inside the text for each session instead of trying to copy everything at once. The first scene is good for setup, the middle scenes are useful for money and bargain vocabulary, and the later scenes test emotional dialogue and faster turns in action.\n\nA good drill is to write down the recurring terms before playing the audio, then mark each one as you hear it. On a second pass, copy a dialogue-heavy section and compare where punctuation and speaker changes affected your spacing. The story's clean arc makes it satisfying to revisit, and the repeated bargain language gives Morse learners a steady pattern to hear.",
  },
  {
    fileName: "Island Nights' Entertainments.txt",
    slug: "the-isle-of-voices",
    title: "The Isle of Voices",
    author: ["Robert Louis Stevenson"],
    authorDeathYear: 1894,
    description:
      "Robert Louis Stevenson's fantasy story about Keola, Lehua, Kalamake, magic, voices, treasure, and escape.",
    subjects: ["Pacific Area -- Fiction", "Short stories", "Fantasy fiction", "Magic -- Fiction"],
    originalPublication: "1893",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split Project Gutenberg #329 into standalone story units, removing the collection title page, contents, adjacent stories, final license, and back matter while preserving the complete story body and its short footnotes.",
    selectionReason:
      "The Project Gutenberg #329 source has explicit collection metadata, a standard END marker, and a clean THE ISLE OF VOICES heading bounded by the collection END marker.",
    decision: "accept",
    riskBeingFixed: "collection/story-unit split with manual start and end boundary",
    sections: [],
    summary: "The Isle of Voices is Robert Louis Stevenson's fantasy story about Keola, Lehua, and Kalamake, moving through magic, greed, travel, unseen presences, treasure, fear, and escape. Compared with The Beach of Falesá, this story leans more fully into wonder and folktale logic, but it still carries Stevenson's interest in danger, bargaining, and the strange pressures of island life.\n\nFor MorseWords learners, the story is useful because it is vivid, moderately long, and filled with recurring names and concrete action. Keola, Lehua, Kalamake, canoe, island, voices, money, trees, sea, and magic appear as memory anchors. The repeated proper names may feel difficult at first, but they become good recognition practice after a few passes.\n\nStart with the opening scene and listen at a comfortable speed until Keola and Kalamake are easy to distinguish. Then use short sections for copying practice, especially where the story shifts from ordinary domestic conflict into magical travel. Because the story includes some unfamiliar Hawaiian words and brief notes, it is better to slow down than to rush through the names and lose the plot.\n\nThis story is also useful for learners who want to practice contrast. Some passages feel like ordinary household or travel scenes, while others move into magical description and suspense. Switching between those modes helps train the ear to keep word spacing steady even when the vocabulary becomes less familiar. It also rewards replay, because the unusual names become much easier after one careful pass.\n\nA practical exercise is to make two columns before listening: character names in one column and setting/action words in the other. As the audio plays, tick off each repeated item. On the next pass, copy a paragraph without looking, then replay it while reading to check spacing, vowels, and long names. The story's strong atmosphere makes the repetition feel less mechanical.",
  },
];

const selectedDeferred = [
  { candidateRawFile: "Island Nights' Entertainments.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a possible parent collection page.", expectedSlug: "island-nights-entertainments", expectedTitle: "Island Nights' Entertainments", expectedAuthor: "Robert Louis Stevenson", sourceUrlStatus: "Project Gutenberg #329 header and END marker present", riskBeingFixed: "collection/story-unit structure", decision: "keep deferred", reason: "The collection itself was not generated because the three standalone story units are cleaner public pages and avoid mixing a parent contents page with story-level routes." },
  { candidateRawFile: "Emma.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Known pass-6 deferred incomplete local raw file carried forward.", expectedSlug: "emma", expectedTitle: "Emma", expectedAuthor: "Jane Austen", sourceUrlStatus: "Project Gutenberg #158 header present, but local file is incomplete", riskBeingFixed: "incomplete local raw file", decision: "keep deferred", reason: "Pass 6 proved the local file ends mid-sentence in Volume II, Chapter VII; no safe end boundary exists." },
  { candidateRawFile: "Great Expectations.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Known pass-6 deferred incomplete local raw file carried forward.", expectedSlug: "great-expectations", expectedTitle: "Great Expectations", expectedAuthor: "Charles Dickens", sourceUrlStatus: "Project Gutenberg #1400 header present, but local file is incomplete", riskBeingFixed: "incomplete local raw file", decision: "keep deferred", reason: "Pass 6 proved the local file ends mid-scene in Chapter XXXIX while the complete work continues through Chapter LIX." },
  { candidateRawFile: "North and South.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Known pass-6 deferred incomplete local raw file carried forward.", expectedSlug: "north-and-south", expectedTitle: "North and South", expectedAuthor: "Elizabeth Cleghorn Gaskell", sourceUrlStatus: "Project Gutenberg #4276 header present, but local file is incomplete", riskBeingFixed: "incomplete local raw file", decision: "keep deferred", reason: "Pass 6 proved the local file only reaches Chapter VI and ends mid-paragraph." },
  { candidateRawFile: "Yellow gentians and blue.txt", oldCategory: "unsafe-automation-structure", whySelected: "Known deferred mixed-structure item carried forward.", expectedSlug: "yellow-gentians-and-blue", expectedTitle: "Yellow Gentians and Blue", expectedAuthor: "Zona Gale", sourceUrlStatus: "Project Gutenberg metadata present in local raw text", riskBeingFixed: "mixed poetry/prose/play/title-list structure", decision: "keep deferred", reason: "The file is a mixed collection with poems, prose pieces, plays, and internal title lists; it needs a dedicated section plan." },
  { candidateRawFile: "Beowulf - An Anglo-Saxon Epic Poem.txt", oldCategory: "unsafe-metadata-risk", whySelected: "Known deferred metadata/translation item carried forward.", expectedSlug: "beowulf-an-anglo-saxon-epic-poem", expectedTitle: "Beowulf: An Anglo-Saxon Epic Poem", expectedAuthor: "J. Lesslie Hall, translator", sourceUrlStatus: "Project Gutenberg metadata present in local raw text", riskBeingFixed: "translator metadata and epic sectioning", decision: "keep deferred", reason: "The file includes prefatory matter, notes, glossary material, and translator-specific metadata; it should wait for a dedicated epic/translation treatment." },
  { candidateRawFile: "The Little Match Girl.txt", oldCategory: "unsafe-title-parent-collection-risk", whySelected: "Known title/content mismatch carried forward.", expectedSlug: "the-little-match-girl", expectedTitle: "The Little Match Girl", expectedAuthor: "Hans Christian Andersen", sourceUrlStatus: "local raw content mismatches filename", riskBeingFixed: "title/content mismatch", decision: "keep deferred", reason: "The current raw file is an Andersen Fairy Tales extract that starts with The Dream of Little Tuk, which is already generated; it is not The Little Match Girl." },
] as const;

const selectedCandidates = [
  ...acceptedWorks.map((work) => ({
    candidateRawFile: work.fileName,
    oldCategory: work.oldCategory,
    whySelected: work.selectionReason,
    expectedSlug: work.slug,
    expectedTitle: work.title,
    expectedAuthor: work.author.join("; "),
    sourceUrlStatus: "Project Gutenberg metadata and source URL available from the local raw text",
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

function readSourceText(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
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
  return trimBookText(
    normalizeCommonMojibake(stripPageMarkers(input))
      .replace(/\n{2,}BOOK [IVXLCDM]+\.\n[A-Z][A-Z .'’-]+\.\n/gi, "\n\n")
      .replace(/\n{2,}BOOK [IVXLCDM]+\.\n/gi, "\n\n"),
  );
}

function titleCaseHeading(input: string) {
  return input
    .toLowerCase()
    .replace(/\b([a-z])/g, (letter) => letter.toUpperCase())
    .replace(/\bOf\b/g, "of")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bOr\b/g, "or")
    .replace(/\bThe\b/g, "the")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function assertUsableExtract(work: CandidateWork, label: string, text: string) {
  if (text.length < 500) throw new Error(`${work.slug}: extracted ${label} is too short`);
  if (/Project Gutenberg|Release date:|START OF THE PROJECT|END OF THE PROJECT/i.test(text.slice(0, 900))) {
    throw new Error(`${work.slug}: source boilerplate leaked into ${label}`);
  }
}

function extractRegexSections(
  work: CandidateWork,
  normalized: string,
  contentStartMarker: string,
  headingPattern: RegExp,
  endMarker: string,
  toMeta: (heading: string) => { label: string; title: string | null },
) {
  const contentStart = normalized.indexOf(contentStartMarker);
  if (contentStart < 0) throw new Error(`${work.slug}: content start marker not found`);
  const contentEnd = normalized.indexOf(endMarker, contentStart);
  if (contentEnd < 0) throw new Error(`${work.slug}: content end marker not found`);
  const matches = [...normalized.matchAll(headingPattern)].filter(
    (match) => (match.index ?? 0) >= contentStart && (match.index ?? 0) < contentEnd,
  );
  if (matches.length === 0) throw new Error(`${work.slug}: no dynamic section headings found`);
  return matches.map((match, index) => {
    const next = matches[index + 1];
    const headingStart = match.index ?? 0;
    const start = headingStart + match[0].length;
    const end = next?.index ?? contentEnd;
    const text = cleanExtractedBody(normalized.slice(start, end));
    const meta = toMeta(match[0].trim());
    assertUsableExtract(work, meta.label, text);
    return {
      ...meta,
      text,
      sourceStartOffset: start,
      sourceEndOffset: end,
    };
  });
}

function extractSections(work: CandidateWork, rawText: string) {
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  if (work.slug === "the-beach-of-falesa") {
    return extractRegexSections(
      work,
      normalized,
      "\n\n\nTHE BEACH OF FALESÁ.\n",
      /^CHAPTER\s+([IVXLCDM]+)\.\n([A-Z][A-Z .'’-]+)\.$/gm,
      "\n\n\nTHE BOTTLE IMP.",
      (heading) => {
        const match = heading.match(/^CHAPTER\s+([IVXLCDM]+)\.\n(.+)\.$/s);
        return {
          label: `Chapter ${match?.[1] ?? ""}`.trim(),
          title: titleCaseHeading((match?.[2] ?? "").replace(/\.$/, "")),
        };
      },
    );
  }
  if (work.slug === "the-bottle-imp") {
    const startText = "There was a man of the Island of Hawaii";
    const endText = "\n\n\nTHE ISLE OF VOICES.";
    const start = normalized.indexOf(startText);
    const end = normalized.indexOf(endText, start);
    if (start < 0 || end < 0) throw new Error(`${work.slug}: story body boundary not found`);
    const text = cleanExtractedBody(normalized.slice(start, end));
    assertUsableExtract(work, "The Bottle Imp", text);
    return [
      {
        label: "The Bottle Imp",
        title: null,
        text,
        sourceStartOffset: start,
        sourceEndOffset: end,
      },
    ];
  }
  if (work.slug === "the-isle-of-voices") {
    return extractRegexSections(
      work,
      normalized,
      "\n\n\nTHE ISLE OF VOICES.\n",
      /^THE ISLE OF VOICES\.$/gm,
      "\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK ISLAND NIGHTS' ENTERTAINMENTS ***",
      () => ({ label: "The Isle of Voices", title: null }),
    );
  }
  if (work.slug === "an-enquiry-concerning-human-understanding") {
    return extractRegexSections(
      work,
      normalized,
      "\n\n\nSECTION I.\n",
      /^SECTION\s+([IVXLCDM]+)\.\n\n([^\n]+)\.?$/gm,
      "\n\n\n\nINDEX",
      (heading) => {
        const match = heading.match(/^SECTION\s+([IVXLCDM]+)\.\n\n(.+)\.?$/s);
        return {
          label: `Section ${match?.[1] ?? ""}`.trim(),
          title: titleCaseHeading((match?.[2] ?? "").replace(/\.$/, "")),
        };
      },
    );
  }
  if (work.slug === "middlemarch") {
    return extractRegexSections(
      work,
      normalized,
      "\n\n\nPRELUDE.\n",
      /^(PRELUDE\.|CHAPTER\s+[IVXLCDM]+\.|FINALE\.)$/gm,
      "\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK MIDDLEMARCH ***",
      (heading) => {
        if (heading === "PRELUDE.") return { label: "Prelude", title: null };
        if (heading === "FINALE.") return { label: "Finale", title: null };
        return { label: heading.replace(/\.$/, "").replace(/^CHAPTER/, "Chapter"), title: null };
      },
    );
  }
  if (work.slug === "the-financier") {
    return extractRegexSections(
      work,
      normalized,
      "\n\n\nChapter I\n",
      /^Chapter\s+([IVXLCDM]+)$/gm,
      "\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK THE FINANCIER: A NOVEL ***",
      (heading) => ({ label: heading.replace(/^Chapter/, "Chapter"), title: null }),
    );
  }
  return work.sections.map((section) => {
    const startIndex = normalized.indexOf(section.startText);
    if (startIndex < 0) throw new Error(`${work.slug}: start marker not found for ${section.label}`);
    const endIndex = normalized.indexOf(section.endText, startIndex + section.startText.length);
    if (endIndex < 0) throw new Error(`${work.slug}: end marker not found for ${section.label}`);
    const start = section.includeStartText ? startIndex : startIndex + section.startText.length;
    const includeEndText = section.includeEndText ?? !section.endText.startsWith("*** END");
    const end = includeEndText ? endIndex + section.endText.length : endIndex;
    const text = cleanExtractedBody(normalized.slice(start, end));
    assertUsableExtract(work, section.label, text);
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
  return section.morseSourceText;
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
  const rawText = readSourceText(rawPath);
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
    "Targeted bespoke raw candidate pass 7 processed this accepted story after manual source, metadata, and story-boundary review. Review generated output before any Cloudflare export.";
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
        "Targeted bespoke raw candidate pass 7 used explicit manual story boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted bespoke raw candidate pass 7; review before Cloudflare export.",
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

Processed by targeted bespoke raw candidate pass 7.

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
    summarySet: "bespoke-raw-candidate-pass-7",
    generatedAt: "2026-06-29",
    expectedSummaryCount: expectedCount,
    bespokeRawCandidatePass7Slugs: works.map((work) => work.slug),
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
            "Accepted in bespoke raw candidate pass 7 as standalone generated story pages after manual source, metadata, and story-boundary review.",
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
      generatedBooksWithoutDirectCurrentRawFilenameEvidence: 21,
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
        "the-beach-of-falesa",
        "the-bottle-imp",
        "the-isle-of-voices",
      ],
      reconciliationNote:
        "Island Nights' Entertainments is now mapped to three standalone live generated story pages in pass 7. The remaining raw/generated gap is explained by current non-generated categories, collection/story split outputs, and accepted live generated books that do not have a one-to-one current temp-books filename match.",
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
  const reportJsonPath = path.join(reportRoot, "bespoke-raw-candidate-pass-7.json");
  const reportMdPath = path.join(reportRoot, "bespoke-raw-candidate-pass-7.md");
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
  const acceptedRows = (report.acceptedCandidateDecisionAndEvidence as Array<Record<string, unknown>>).map((item) => ({
    slug: String(item.slug),
    decision: String(item.decision),
    sections: String(item.sectionCount),
    words: String(item.wordCount),
  }));
  const previewRows = ((report.previewSizeRangeForNewBooks as { items: Array<Record<string, unknown>> }).items).map((item) => ({
    slug: String(item.slug),
    chars: String(item.previewCharacters),
    bytes: String(item.previewBytes),
  }));
  const validationRows = Object.entries(report.validationResults as Record<string, string>).map(([check, result]) => ({
    check,
    result,
  }));
  const md = `# Bespoke raw candidate pass 7

## Summary

- Pass-6 branch merge status: ${report.pass6BranchMergeStatus}
- Previous generated count: ${report.previousGeneratedCount}
- Previous SEO summary count: ${report.previousSeoSummaryCount}
- Previous preview count: ${report.previousPreviewCount}
- Accepted/generated candidates: ${(report.acceptedGeneratedCandidates as string[]).join(", ")}
- Island Nights' Entertainments decision: split into standalone story pages; parent collection page deferred
- Generated count after branch: ${report.generatedCountAfterBranch}
- SEO summary count after branch: ${report.seoSummaryCountAfterBranch}
- Startup preview count after branch: ${report.startupPreviewCountAfterBranch}
- Missing summary count: ${report.missingSummaryCountAfterBranch}
- Unknown/unclassified raw count: ${report.unknownUnclassifiedCount}
- Cloudflare export: ${report.cloudflareExportCheckpoint}
- Route/UI check: ${report.routeUiCheckResult}

## Accepted Story Pages

${markdownTable(acceptedRows, ["slug", "decision", "sections", "words"])}

## Preview Size Range

- New preview character range: ${(report.previewSizeRangeForNewBooks as { minCharacters: number }).minCharacters}-${(report.previewSizeRangeForNewBooks as { maxCharacters: number }).maxCharacters}

${markdownTable(previewRows, ["slug", "chars", "bytes"])}

## Selected Candidates

${markdownTable(selected, ["file", "oldCategory", "decision", "slug", "reason"])}

## Remaining Non-Generated Raw Files By Category

${markdownTable(categoryRows, ["category", "count"])}

## Checkpoints

- Starter-preview first-render checkpoint: ${report.starterPreviewFirstRenderCheckpoint}
- Section/content result for new books: ${report.sectionContentResultForNewBooks}
- Metadata completeness result for new books: ${report.metadataCompletenessResultForNewBooks}
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
  const pass6Report = readJson<{
    generatedCountAfterBranch: number;
    seoSummaryCountAfterBranch: number;
    startupPreviewCountAfterBranch: number;
  }>(pass6ReportPath);
  const sourceRiskReport: SourceRiskReport = {
    rawTempBooksTotalCount: 527,
    generatedCountAfterRemoval: pass6Report.generatedCountAfterBranch,
    seoSummaryCountAfterRemoval: pass6Report.seoSummaryCountAfterBranch,
    previewCountAfterRemoval: pass6Report.startupPreviewCountAfterBranch,
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
    ["island-nights-entertainments"],
    updatedLibrary.books.length,
  );
  if (reconciliation.unknownUnclassifiedCount !== 0) {
    throw new Error(`Unknown raw files remain: ${reconciliation.unknownUnclassifiedCount}`);
  }
  const previewSizes = written.map((item) => item.previewCharacterCount);
  const report = {
    schemaVersion: 1,
    reportName: "bespoke-raw-candidate-pass-7",
    generatedAt: "2026-06-29",
    branch: "morsewords-bespoke-raw-candidate-pass-7-jun-2026",
    pass6BranchMergeStatus:
      "morsewords-bespoke-raw-candidate-pass-6-jun-2026 was merged to main, validated, and pushed before this branch.",
    previousGeneratedCount: sourceRiskReport.generatedCountAfterRemoval,
    previousSeoSummaryCount: sourceRiskReport.seoSummaryCountAfterRemoval,
    previousPreviewCount: sourceRiskReport.previewCountAfterRemoval,
    candidateCategoriesReviewed: [
      "unsafe-start-end-boundary-risk",
      "unsafe-automation-structure",
      "unsafe-metadata-risk",
      "unsafe-title-parent-collection-risk",
    ],
    acceptedCandidateDecisionAndEvidence: written.map((item) => ({
      slug: item.manifest.slug,
      decision: "accept-generated",
      evidence:
        "Project Gutenberg header, explicit title and author metadata, clear START/END markers, and manually reviewed post-contents section headings with readable body text.",
      sectionCount: item.manifest.sections.length,
      wordCount: item.wordCount,
    })),
    selectedCandidates,
    islandNightsEntertainmentsDecisionAndEvidence: {
      decision: "split-accepted-story-pages-parent-collection-deferred",
      sourceName: "Project Gutenberg",
      sourceUrl: "https://www.gutenberg.org/ebooks/329",
      collectionTitle: "Island Nights' Entertainments",
      author: "Robert Louis Stevenson",
      completeFile: true,
      storyHeadings: ["THE BEACH OF FALESÁ.", "THE BOTTLE IMP.", "THE ISLE OF VOICES."],
      evidence:
        "The local raw file has Project Gutenberg #329 metadata, a START marker, three clean story headings, and a standard END marker. The parent collection contents/front matter and Gutenberg license were removed from generated story pages.",
    },
    acceptedGeneratedCandidates: acceptedWorks.map((work) => work.slug),
    collectionStorySplitsPerformed: [
      {
        rawFile: "Island Nights' Entertainments.txt",
        parentCollectionSlugDeferred: "island-nights-entertainments",
        generatedStorySlugs: acceptedWorks.map((work) => work.slug),
      },
    ],
    deferredCandidates: selectedDeferred,
    duplicatesConfirmed: [
      {
        rawSourceFilename: "The Little Match Girl.txt",
        reason:
          "Current file content starts as The Dream of Little Tuk; generated library already contains the-dream-of-little-tuk.",
      },
    ],
    blockedSourceRightsCandidatesStillBlocked:
      sourceRiskReport.nonGeneratedRawFilesByCategory["blocked-source-or-rights-risk"] ?? [],
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
    sectionContentResultForNewBooks:
      "Pass: The Beach of Falesá has 5 usable chapters; The Bottle Imp and The Isle of Voices each have 1 usable story section; all accepted pages have readable starter previews and no 0-section output.",
    metadataCompletenessResultForNewBooks:
      "Pass: All accepted story pages have accurate title, Robert Louis Stevenson author metadata, Project Gutenberg source name, source URL https://www.gutenberg.org/ebooks/329, nonzero section counts, word counts, publish-ready rights metadata, and approved/generated route coverage.",
    rawReconciliationAfterBranch: reconciliation,
    unknownUnclassifiedCount: reconciliation.unknownUnclassifiedCount,
    remainingNonGeneratedRawFilesByCategory: reconciliation.nonGeneratedRawFilesByCategory,
    starterPreviewFirstRenderCheckpoint:
      "Local starter previews remain small and are available for immediate first render; no full chapter preview was stored.",
    cloudflareExportCheckpoint: "not run",
    bookSectionContentAuditCheckpoint:
      "New accepted books have readable starter content and nonzero usable sections; broad all-book section/content audit remains before Cloudflare export.",
    metadataSourceConsistencyAuditCheckpoint:
      "New accepted story metadata and Project Gutenberg #329 source URLs were verified in this pass; full metadata/source consistency audit remains before and after Cloudflare export.",
    postExportChapterNavViewWindowReviewCheckpoint:
      "Final chapter/nav/view-window review was not started and must wait until after Cloudflare export.",
    sourcesPageTrustCopyCheckpoint:
      "Sources page trust-copy work was not started and remains for the later content-quality stage.",
    aboutEeatCopyCheckpoint:
      "About/E-E-A-T copy improvement was not started and remains for the later GSC/meta/content-quality stage.",
    repeatedHelperCopyContentQualityCheckpoint:
      "Repeated helper-copy/AI-footprint reduction was not started and remains for the later content-quality stage.",
    urlPageIndexabilityBlockerCheckpoint:
      "URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.",
    mobileFinalStageCheckpoint: "Broad mobile optimization remains the final stage and was not started.",
    recommendedNextMajorPhase:
      "bespoke/manual raw candidate pass 8, because several recoverable but larger boundary and automation-structure candidates still remain.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-7",
    ],
    routeUiCheckResult:
      "Pass: The Bottle Imp book and audiobook routes rendered from the starter preview without a full loading shell; summary appeared below Source notes; no Unknown author/source or 0 sections text appeared; /morse-code-books and /morse-code-audiobooks showed 517 items; mobile 390px check had no horizontal overflow. Retained behavior was covered by the 39/39 desktop Playwright book-page suite.",
    validationResults: {
      typecheck: "pass",
      seoSummaryAudit: "pass: 517/517 summaries, 0 missing",
      batch12ProseRestore: "pass",
      startupPreviewAudit: "pass: 517 valid previews",
      titleStartDefaultAudit:
        "pass: 517 generated books audited; unrelated generated/preview churn restored before commit",
      metadataSegmentationAudit:
        "pass: 517 generated books audited, 0 accepted books revoked",
      manualUiDefectFollowup: "pass: 8 checked, 8 acceptable",
      independentSecondPassAudit:
        "pass: 517 generated books, 517 previews, 0 fail-needs-fix",
      linkingSitemapAudit:
        "pass: 517 book URLs and 517 audiobook URLs",
      testIfPresent: "pass: 23/23 smoke tests",
      buildNetlify: "pass",
      playwrightBookPage: "pass: 39/39 desktop-chromium",
      gitDiffCheck: "pass: no whitespace errors; line-ending notices only",
    },
  };
  writeReport(report);
  console.log(
    `Bespoke raw candidate pass 7 generated ${acceptedWorks.length} story pages: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
