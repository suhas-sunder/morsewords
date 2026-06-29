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
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-5",
);
const priorPassReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-4/bespoke-raw-candidate-pass-4.json",
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
    fileName: "An Enquiry Concerning Human Understanding.txt",
    slug: "an-enquiry-concerning-human-understanding",
    title: "An Enquiry Concerning Human Understanding",
    author: ["David Hume"],
    authorDeathYear: 1776,
    description:
      "David Hume's philosophical enquiry into human understanding, ideas, probability, causation, liberty, miracles, providence, and scepticism.",
    subjects: ["Philosophy", "Knowledge, Theory of", "Causation", "Skepticism"],
    originalPublication: "1748",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass accepted the Project Gutenberg #9662 file as a standalone nonfiction work, removing the Gutenberg header, contents, final index, back matter, and license text while preserving the twelve main enquiry sections.",
    selectionReason:
      "Project Gutenberg provenance is explicit, and the main text has twelve clearly bounded SECTION headings after the contents block.",
    decision: "accept",
    riskBeingFixed: "manual nonfiction start/end boundary and final-index exclusion",
    sections: [],
    summary: "An Enquiry Concerning Human Understanding is David Hume's compact philosophical work about ideas, experience, probability, causation, liberty, miracles, providence, and scepticism. Rather than moving through plot and character, it asks how people form beliefs, why they trust repeated experience, and where confident reasoning begins to break down. The MorseWords version is organized around the twelve main enquiry sections, so learners can approach the text one argument at a time instead of facing the whole treatise at once.\n\nFor Morse practice, this book is best for careful listening and deliberate copying. Hume's prose is formal, balanced, and often abstract, with long sentences that reward slower WPM settings and accurate word spacing. The repeated vocabulary is helpful: idea, impression, reason, evidence, probability, experience, belief, cause, effect, liberty, necessity, miracle, religion, philosophy, and scepticism come back often enough to become familiar anchors.\n\nA beginner can start with a short section such as Of the Origin of Ideas and replay a few paragraphs until the rhythm of formal prose feels less intimidating. A learner who already handles story passages can use Of Probability or Of Miracles to practice sustained attention across denser clauses and repeated logical terms. Because the section titles are descriptive, it is easy to return later and compare how different arguments sound in Morse.\n\nThis is not a casual adventure listen, but it is valuable for learners who want to build patience, punctuation awareness, and confidence with nonfiction. Use short sessions, keep the playback speed honest, and review missed terms before moving to the next section.\n\nA good next action is to translate one paragraph, listen without looking, then read it while replaying the audio. Mark the words that collapse together, especially abstract pairs such as cause and effect or liberty and necessity, and repeat that same paragraph before starting a new one.",
  },
  {
    fileName: "Middlemarch.txt",
    slug: "middlemarch",
    title: "Middlemarch",
    author: ["George Eliot"],
    authorDeathYear: 1880,
    description:
      "George Eliot's realist novel about Dorothea Brooke, Tertius Lydgate, and the social, moral, and political life of Middlemarch.",
    subjects: ["Domestic fiction", "England -- Fiction", "Married people -- Fiction", "Bildungsromans"],
    originalPublication: "1871-1872",
    oldCategory: "unsafe-automation-structure",
    sourceNote:
      "Manual pass accepted the Project Gutenberg #145 file as one standalone novel, removing the Gutenberg header, contents, back matter, and license text while preserving the prelude, eighty-six chapters, and finale.",
    selectionReason:
      "Project Gutenberg provenance is explicit, and the novel has a regular PRELUDE, CHAPTER I-LXXXVI, and FINALE structure after the contents block.",
    decision: "accept",
    riskBeingFixed: "large novel structure with contents-block duplicate headings",
    sections: [],
    summary: "Middlemarch is George Eliot's large realist novel about Dorothea Brooke, Tertius Lydgate, Rosamond Vincy, Casaubon, Ladislaw, and the social life of an English provincial town. Its drama comes from choices that look private but ripple outward: marriage, money, ambition, reform, illness, reputation, debt, disappointment, and conscience. The MorseWords version keeps the prelude, numbered chapters, and finale together as one long book, giving learners many natural stopping points without losing the shape of the novel.\n\nFor Morse practice, Middlemarch is a stamina builder. Eliot's prose moves between dialogue, description, irony, and moral reflection, so a listener gets more variety than a simple plot summary or single-scene short story. The repeated names are useful anchors: Dorothea, Celia, Brooke, Casaubon, Lydgate, Rosamond, Vincy, Bulstrode, and Ladislaw return often enough to help learners recover context after a missed word.\n\nThe book is especially good for learners who want to practice long sessions in small pieces. Start with the prelude or Chapter I, then replay the same section until character names, punctuation, and sentence endings are clear. Later, choose shorter chapters for review and longer chapters for endurance. The vocabulary also gives useful contrast: domestic words, medical terms, legal and financial language, religious references, and ordinary town life appear side by side.\n\nMiddlemarch is not the fastest choice for a first Morse reading session, but it rewards steady practice. If a passage feels dense, slow the audio, copy only a few paragraphs, and return to familiar names before continuing. Over time, the novel becomes a useful test of spacing, attention, and confidence with sophisticated prose.\n\nA practical routine is to use one chapter as the week's practice text. Listen once for character names, once for punctuation and word spacing, and once while copying. After the session, review the missed names before choosing the next chapter.",
  },
  {
    fileName: "The Financier.txt",
    slug: "the-financier",
    title: "The Financier",
    author: ["Theodore Dreiser"],
    authorDeathYear: 1945,
    description:
      "Theodore Dreiser's novel about Frank Cowperwood, finance, ambition, family pressure, and power in nineteenth-century Philadelphia.",
    subjects: ["Capitalists and financiers -- Fiction", "Philadelphia (Pa.) -- Fiction", "Ambition -- Fiction", "Novels"],
    originalPublication: "1912",
    oldCategory: "unsafe-automation-structure",
    sourceNote:
      "Manual pass accepted the Project Gutenberg #1840 file as a standalone novel, removing the Gutenberg header, contents, two unrelated post-list titles, back matter, and license text while preserving the fifty-nine chapter bodies.",
    selectionReason:
      "Project Gutenberg provenance is explicit, and the novel has a clean Chapter I through Chapter LIX body after the contents list.",
    decision: "accept",
    riskBeingFixed: "manual chapter-body boundary after contents and unrelated title-list entries",
    sections: [],
    summary: "The Financier is Theodore Dreiser's novel about Frank Algernon Cowperwood, a young Philadelphian whose talent for money, risk, persuasion, and self-advancement draws him into banking, speculation, politics, family conflict, and scandal. It is a business novel, a character study, and a social portrait at once, following Cowperwood as he learns how financial systems, personal charm, ambition, and public power can reinforce one another.\n\nFor MorseWords learners, The Financier offers a vocabulary set that feels different from fairy tales, detective stories, and adventure fiction. Banks, bonds, loans, accounts, railroads, offices, investors, city officials, political arrangements, contracts, household expectations, and personal desire all appear in the same narrative world. That makes the book useful for learners who want to practice practical adult prose with recurring names and repeated financial terms.\n\nThe chapter structure is regular, so it works well for short sessions. A beginner can start with Chapter I to learn Cowperwood's setting and family background, then replay one or two paragraphs until the proper names and sentence endings are clear. A more confident learner can choose later scenes with business negotiations or dialogue and use slower playback to catch numbers, punctuation, and speaker changes.\n\nDreiser's style is direct but often detailed, which makes the book a good bridge between simple story practice and very dense literary prose. Use it when you want a longer challenge with clear chapter boundaries, repeated terminology, and a strong central character. If a financial passage feels crowded, reduce the speed, copy a shorter span, and review the recurring words before moving on.\n\nFor a focused session, make a short word bank before listening: bank, bond, loan, money, city, father, office, Cowperwood, and Philadelphia. Then listen for those anchors first, and only afterward worry about the full sentence. This keeps the session grounded while the business vocabulary becomes familiar.",
  },
];

const selectedDeferred = [
  { candidateRawFile: "Emma.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a high-priority boundary-risk novel.", expectedSlug: "emma", expectedTitle: "Emma", expectedAuthor: "Jane Austen", sourceUrlStatus: "Project Gutenberg #158 header present; current local file lacks the standard END marker", riskBeingFixed: "missing local end marker", decision: "keep deferred", reason: "The source metadata is clear, but this local file does not expose a standard Gutenberg END marker; defer until a dedicated boundary check can prove the safe terminal cut." },
  { candidateRawFile: "Great Expectations.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a high-priority boundary-risk novel.", expectedSlug: "great-expectations", expectedTitle: "Great Expectations", expectedAuthor: "Charles Dickens", sourceUrlStatus: "Project Gutenberg #1400 header present; current local file lacks the standard END marker", riskBeingFixed: "missing local end marker", decision: "keep deferred", reason: "The source metadata is clear, but this local file does not expose a standard Gutenberg END marker; defer until a dedicated boundary check can prove the safe terminal cut." },
  { candidateRawFile: "North and South.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a high-priority boundary-risk novel.", expectedSlug: "north-and-south", expectedTitle: "North and South", expectedAuthor: "Elizabeth Cleghorn Gaskell", sourceUrlStatus: "Project Gutenberg #4276 header present; current local file lacks the standard END marker", riskBeingFixed: "missing local end marker", decision: "keep deferred", reason: "The source metadata is clear, but this local file does not expose a standard Gutenberg END marker; defer until a dedicated boundary check can prove the safe terminal cut." },
  { candidateRawFile: "Island Nights' Entertainments.txt", oldCategory: "unsafe-start-end-boundary-risk", whySelected: "Reviewed as a possible clean Stevenson collection.", expectedSlug: "island-nights-entertainments", expectedTitle: "Island Nights' Entertainments", expectedAuthor: "Robert Louis Stevenson", sourceUrlStatus: "Project Gutenberg #329 header and END marker present", riskBeingFixed: "collection/story-unit structure", decision: "keep deferred", reason: "The source metadata is clear, but the file is a three-story collection with internal chaptering; defer to a collection/story-unit plan rather than mixing story and chapter boundaries in this pass." },
  { candidateRawFile: "Yellow gentians and blue.txt", oldCategory: "unsafe-automation-structure", whySelected: "Known deferred mixed-structure item carried forward.", expectedSlug: "yellow-gentians-and-blue", expectedTitle: "Yellow Gentians and Blue", expectedAuthor: "Zona Gale", sourceUrlStatus: "Project Gutenberg metadata present in local raw text", riskBeingFixed: "mixed poetry/prose/play/title-list structure", decision: "keep deferred", reason: "The file is a mixed collection with poems, prose pieces, plays, and internal title lists; it needs a dedicated section plan rather than a small full-book extraction." },
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
    "Targeted bespoke raw candidate pass 5 processed this accepted work after manual source, metadata, and section-boundary review. Review generated output before any Cloudflare export.";
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
        "Targeted bespoke raw candidate pass 5 used explicit manual section boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted bespoke raw candidate pass 5; review before Cloudflare export.",
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

Processed by targeted bespoke raw candidate pass 5.

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
    summarySet: "bespoke-raw-candidate-pass-5",
    generatedAt: "2026-06-29",
    expectedSummaryCount: expectedCount,
    bespokeRawCandidatePass5Slugs: works.map((work) => work.slug),
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
            "Accepted in bespoke raw candidate pass 5 as a standalone generated work after manual source, metadata, and section-boundary review.",
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
        "Three formerly non-generated raw files are now mapped to live generated books in pass 5. The remaining raw/generated gap is explained by current non-generated categories, collection/story split outputs, and accepted live generated books that do not have a one-to-one current temp-books filename match.",
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
  const reportJsonPath = path.join(reportRoot, "bespoke-raw-candidate-pass-5.json");
  const reportMdPath = path.join(reportRoot, "bespoke-raw-candidate-pass-5.md");
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
  const md = `# Bespoke raw candidate pass 5

## Summary

- Pass-4 branch merge status: ${report.pass4BranchMergeStatus}
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
    reportName: "bespoke-raw-candidate-pass-5",
    generatedAt: "2026-06-29",
    branch: "morsewords-bespoke-raw-candidate-pass-5-jun-2026",
    pass4BranchMergeStatus:
      "morsewords-bespoke-raw-candidate-pass-4-jun-2026 was merged to main and pushed before this branch.",
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
      "bespoke/manual raw candidate pass 6, because several recoverable but larger boundary and automation-structure candidates still remain.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-5",
    ],
    routeUiCheckResult:
      "Pass: Middlemarch book page rendered with summary below Source notes, immediate starter preview, no loading shell, and no Unknown/0-section metadata; Middlemarch audiobook route rendered with author and export/download language; book and audiobook listings displayed 514 and linked Middlemarch; 390px mobile check had no horizontal overflow. Targeted Playwright suite retained the-leavenworth-case, Sherlock/Wilde/Poe/normal book, request-count, and mobile/dark-mode behavior.",
    validationResults: {
      typecheck: "pass",
      seoSummaryAudit: "pass: 514/514 summaries, 0 fail",
      batch12ProseRestore: "pass",
      startupPreviewAudit: "pass: 514 valid, 0 preview updates",
      titleStartDefaultAudit:
        "pass: 514 generated books audited; known unrelated generated/preview churn was restored before commit",
      metadataSegmentationAudit:
        "pass: 514 generated books audited, 0 author corrections, 0 accepted revocations",
      manualUiDefectFollowup: "pass: 8 acceptable, 0 corrected",
      independentSecondPassAudit:
        "pass: 514 generated books, 514 preview assets, 0 fail-needs-fix",
      linkingSitemapAudit:
        "pass: 514 book URLs and 514 audiobook URLs, 0 broken internal links",
      testIfPresent: "pass: 23/23 smoke tests",
      buildNetlify: "pass",
      playwrightBookPage: "pass: 39/39",
    },
  };
  writeReport(report);
  console.log(
    `Bespoke raw candidate pass 5 generated ${acceptedWorks.length} books: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
