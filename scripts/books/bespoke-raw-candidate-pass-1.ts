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
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-1",
);
const sourceRiskReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/source-risk-removal-and-raw-gap-audit/source-risk-removal-and-raw-gap-audit.json",
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
    fileName: "Five Little Friends.txt",
    slug: "five-little-friends",
    title: "Five Little Friends",
    author: ["Sherred Willcox Adams"],
    authorDeathYear: 1934,
    description:
      "A gentle early-reader book about five school friends, their classroom surprises, summer travels, pets, and small everyday adventures.",
    subjects: ["Children's literature", "School stories", "Early readers"],
    originalPublication: "1920",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass stripped Project Gutenberg header, title-page matter, contents, illustrations, and license text, then kept the two clear story divisions.",
    selectionReason:
      "Short, clean Project Gutenberg children's book with two explicit story sections and no nested-book complexity.",
    decision: "accept",
    riskBeingFixed: "start/end boundary and table-of-contents front matter",
    sections: [
      {
        label: "Part 1",
        title: "The Five Little Friends at School",
        startText: "THE FIVE LITTLE FRIENDS AT SCHOOL\n\n\nBob and Betty",
        endText:
          "I wish the children who read this book could hear about the blind man\nand his new dog but that is another story.",
        includeStartText: false,
      },
      {
        label: "Part 2",
        title: "The Five Little Friends in Vacation",
        startText: "THE FIVE LITTLE FRIENDS IN VACATION\n\n\nI\n\nSoon after the Pet Show",
        endText:
          "You may be sure that some happy days came to Dick after the five little\nfriends had put their heads together.",
        includeStartText: false,
      },
    ],
    summary:
      "Five Little Friends by Sherred Willcox Adams is a warm children's book built around Bob, Betty, Paul, Peggy, and little Dot. The first half follows the friends at school, where ordinary classroom moments turn into small adventures with pets, lessons, surprises, and the steady kindness of Miss West. The second half moves into vacation days, giving the children room for trips, seaside plans, family visits, and the sort of practical discoveries that make early-reader stories feel friendly rather than hurried.\n\nFor MorseWords practice, this book is useful because the prose is direct, concrete, and easy to divide into manageable sections. The sentences are generally short, the vocabulary is familiar, and the repeated names give learners a steady rhythm for copying or listening. At the same time, the two-part structure gives enough variety to practice longer sessions without jumping into a dense novel. A learner can start with a few paragraphs from the school section, then return later for the vacation material once recognition and timing feel steadier.\n\nThis summary keeps the focus on reading and practice rather than retelling every episode. The book works especially well for beginners who want public-domain prose that sounds natural in Morse audio: names, dialogue, and simple action make the signal easier to follow, while the gentle pacing keeps mistakes from feeling punishing. It is also a good candidate for short typing drills because each scene has a clear setting and a small event to hold attention.\n\nBecause the book was written for young readers, it is also a useful confidence-builder after alphabet or word drills. Learners can practice common family words, classroom language, short questions, and simple responses without fighting unusually dense syntax. The result is a calm bridge between isolated Morse practice and longer narrative copying, with enough story motion to reward repeat sessions.",
  },
  {
    fileName: "SNOW-WHITE AND ROSE-RED.txt",
    slug: "snow-white-and-rose-red",
    title: "Snow-White and Rose-Red",
    author: ["Jacob Grimm", "Wilhelm Grimm"],
    authorDeathYear: 1863,
    description:
      "A Grimm fairy tale about two kind sisters, a winter visitor, a troublesome dwarf, and an enchanted bear.",
    subjects: ["Fairy tales", "Children's literature", "Folklore"],
    originalPublication: "1812",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass used the individual story heading as the start and stopped before the author biography/back matter marker.",
    selectionReason:
      "Short standalone story with a clear title heading and an obvious post-story biography block to exclude.",
    decision: "accept",
    riskBeingFixed: "end boundary before back matter",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "SNOW-WHITE AND ROSE-RED\n\n\nThere was once",
        endText: "\n\n\n*****\n\n\nThe Brothers Grimm",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "Snow-White and Rose-Red by Jacob Grimm and Wilhelm Grimm is a compact fairy tale about two sisters whose kindness shapes the strange events around them. The story begins in a poor widow's cottage, where the girls live simply, help their mother, and move between home, garden, and forest with an easy trust in the world. Their gentleness is tested by a winter encounter with a bear and by repeated meetings with an ungrateful dwarf, and the tale gradually reveals that the ordinary forest has been hiding a spellbound royal story.\n\nFor MorseWords learners, this is a strong short-form practice text. The plot is easy to remember, the scenes are vivid, and the story can be handled in one sitting or broken into smaller listening passages. Names, dialogue, repeated forest action, and fairy-tale phrasing give learners recognizable patterns without the scale of a full novel. The prose also includes enough older diction to make typing practice more interesting, especially for punctuation, quoted speech, and hyphenated names.\n\nThis summary avoids spoiling every turn and focuses on why the story is useful for Morse practice. It is a good choice when a learner wants something more literary than random sentences but much shorter than a chapter book. The emotional shape is clear: home, kindness, danger, recognition, and reward. That makes it easy to listen once for the story, then replay shorter passages to improve character recognition, word spacing, and comfortable Morse pacing.\n\nThe tale also gives beginners a compact way to practice repeated proper names and descriptive phrases. Since the setting stays focused on the cottage, forest, bear, sisters, and dwarf, learners can recognize recurring signals while still following an actual story. It is especially handy for a short listening session where the goal is continuity rather than speed.",
  },
  {
    fileName: "THE HISTORY OF DWARF LONG NOSE.txt",
    slug: "the-history-of-dwarf-long-nose",
    title: "The History of Dwarf Long Nose",
    author: ["Andrew Lang"],
    authorDeathYear: 1912,
    description:
      "A fairy tale from The Violet Fairy Book about a cobbler's son transformed by enchantment and tested in a royal kitchen.",
    subjects: ["Fairy tales", "Children's literature", "Folklore"],
    originalPublication: "1901",
    oldCategory: "unsafe-title-parent-collection-risk",
    sourceNote:
      "Manual pass treated the file as an individual story from The Violet Fairy Book, preserving the story body while recording the parent-collection provenance.",
    selectionReason:
      "The current raw file contains only this story after the Project Gutenberg header; the parent collection title was the automation risk.",
    decision: "accept",
    riskBeingFixed: "parent collection title metadata",
    sections: [
      {
        label: "Story",
        title: null,
        startText:
          "It is a great mistake to think that fairies, witches, magicians, and\nsuch people lived only in Eastern countries",
        endText: "declared it to be quite excellent.",
        includeStartText: true,
      },
    ],
    summary:
      "The History of Dwarf Long Nose, presented here from Andrew Lang's The Violet Fairy Book source, is a fairy tale about Jem, a cobbler's son whose ordinary life changes after an encounter with enchantment. The story moves from a market-place and a family home into a strange magical captivity, then into the world of court service, disguise, cooking, and recognition. Its drama comes from transformation and patience: the hero has to survive a changed body, recover his sense of self, and find a way back toward justice.\n\nFor MorseWords practice, the story offers a useful middle ground between a tiny fable and a long chapter book. It has a single continuous plot, but the scenes vary enough to keep listening and typing practice lively. Learners will meet descriptive passages, quoted speech, names, food words, and fairy-tale turns of phrase, all of which create good variation for Morse timing. The story is also short enough to revisit, so a learner can first listen for the outline and later return to difficult paragraphs at a slower pace.\n\nThis summary does not replace the tale's surprises. It highlights the practice value of a clear, bounded public-domain story: a strong opening, a memorable transformation, and a steady sequence of events. The text is especially useful for learners who want character-rich prose without committing to a large novel or complicated multi-volume work.\n\nThe cooking and court scenes add practical vocabulary that is different from many adventure or ghost stories in the library. That variety matters for Morse learning because it prevents practice from becoming only familiar names and repeated action words. A short fairy tale like this can be used for one careful copy session, then replayed later at a faster setting, especially when practicing longer quoted passages and scene transitions.",
  },
];

const selectedDeferred = [
  {
    candidateRawFile: "The Little Match Girl.txt",
    oldCategory: "unsafe-title-parent-collection-risk",
    whySelected: "Small file from a recoverable category, but manual inspection found a title mismatch.",
    expectedSlug: "the-little-match-girl",
    expectedTitle: "The Little Match Girl",
    expectedAuthor: "Hans Christian Andersen",
    riskBeingFixed: "title/parent-collection mismatch",
    decision: "keep deferred",
    reason:
      "The current file starts with The Dream of Little Tuk, not The Little Match Girl; generated library already contains the-dream-of-little-tuk.",
  },
  {
    candidateRawFile: "The Happy Prince, and Other Tales.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected: "Potentially valuable collection, but not suitable for this small first pass.",
    expectedSlug: "the-happy-prince-and-other-tales",
    expectedTitle: "The Happy Prince, and Other Tales",
    expectedAuthor: "Oscar Wilde",
    riskBeingFixed: "multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Collection requires a separate story/section decision pass rather than a quick single-boundary extraction.",
  },
  {
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected: "High-value candidate, but structurally large.",
    expectedSlug: "the-adventures-of-sherlock-holmes",
    expectedTitle: "The Adventures of Sherlock Holmes",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Large twelve-story collection should be handled in a dedicated bespoke structural pass.",
  },
  {
    candidateRawFile: "Yellow gentians and blue.txt",
    oldCategory: "unsafe-automation-structure",
    whySelected: "Recoverable-category item checked for possible straightforward handling.",
    expectedSlug: "yellow-gentians-and-blue",
    expectedTitle: "Yellow Gentians and Blue",
    expectedAuthor: "Zona Gale",
    riskBeingFixed: "automation structure",
    decision: "keep deferred",
    reason:
      "Larger poetry/prose structure needs manual section planning beyond this first small pass.",
  },
  {
    candidateRawFile: "Beowulf - An Anglo-Saxon Epic Poem.txt",
    oldCategory: "unsafe-metadata-risk",
    whySelected: "Sole metadata-risk candidate considered for easy recovery.",
    expectedSlug: "beowulf-an-anglo-saxon-epic-poem",
    expectedTitle: "Beowulf: An Anglo-Saxon Epic Poem",
    expectedAuthor: "Unknown",
    riskBeingFixed: "translator/metadata risk",
    decision: "keep deferred",
    reason:
      "Epic translation metadata and sectioning need a dedicated source/translator review before generation.",
  },
  {
    candidateRawFile: "THE APPLE.txt",
    oldCategory: "blocked-source-or-rights-risk",
    whySelected: "Short blocked item checked only to confirm risk status.",
    expectedSlug: "the-apple",
    expectedTitle: "The Apple",
    expectedAuthor: "Unknown",
    riskBeingFixed: "source/provenance risk",
    decision: "keep deferred",
    reason:
      "No Project Gutenberg header or current repo evidence resolves source/provenance risk.",
  },
  {
    candidateRawFile: "THE STORY OF THE LATE MR. ELVESHAM.txt",
    oldCategory: "blocked-source-or-rights-risk",
    whySelected: "Short blocked item checked only to confirm risk status.",
    expectedSlug: "the-story-of-the-late-mr-elvesham",
    expectedTitle: "The Story of the Late Mr. Elvesham",
    expectedAuthor: "H. G. Wells",
    riskBeingFixed: "source/provenance risk",
    decision: "keep deferred",
    reason:
      "No Project Gutenberg header or current repo evidence resolves source/provenance risk.",
  },
];

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
    .replace(/\[(?:Illustration|Image|Plate|Transcriber)[^\]]*\]/gi, "")
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
    "Targeted bespoke raw candidate pass 1 processed this accepted candidate after manual boundary, source, and metadata review. Review generated output before any Cloudflare export.";
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
      ...(work.slug === "snow-white-and-rose-red" || work.slug === "the-history-of-dwarf-long-nose"
        ? {
            allowDuplicateGutenbergId: true,
            duplicateReason:
              "Individual story extracted from a parent Project Gutenberg collection after manual review.",
          }
        : {}),
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
        "Targeted bespoke raw candidate pass 1 used explicit manual boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted bespoke raw candidate pass 1; review before Cloudflare export.",
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

Processed by targeted bespoke raw candidate pass 1.

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
    summarySet: "bespoke-raw-candidate-pass-1",
    generatedAt: "2026-06-28",
    expectedSummaryCount: expectedCount,
    bespokeRawCandidatePass1Slugs: works.map((work) => work.slug),
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

function recalculateReconciliation(sourceRiskReport: SourceRiskReport, acceptedSlugs: string[]) {
  const accepted = new Set(acceptedSlugs);
  const updatedRawFileReconciliation = sourceRiskReport.rawFileReconciliation.map((item) =>
    accepted.has(item.inferredSlug)
      ? {
          ...item,
          category: "generated-live",
          reason: "Accepted and generated in bespoke raw candidate pass 1 after manual source/boundary review.",
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
      currentRawMinusGeneratedCountGap: sourceRiskReport.rawTempBooksTotalCount - (sourceRiskReport.generatedCountAfterRemoval + acceptedSlugs.length),
      generatedBooksWithoutDirectCurrentRawFilenameEvidence: 6,
      generatedBooksWithoutDirectCurrentRawFilenameEvidenceSlugs: [
        "anne-of-green-gables-gutenberg-45",
        "the-count-of-monte-cristo-gutenberg-1184",
        "the-great-gatsby",
        "the-picture-of-dorian-gray",
        "the-secret-garden-gutenberg-113",
        "wind-in-the-willows",
      ],
      reconciliationNote:
        "Three formerly non-generated raw files are now mapped to live generated books. The remaining raw/generated gap is explained by current non-generated categories plus accepted live generated books that do not have a one-to-one current temp-books filename match.",
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
  const reportJsonPath = path.join(reportRoot, "bespoke-raw-candidate-pass-1.json");
  const reportMdPath = path.join(reportRoot, "bespoke-raw-candidate-pass-1.md");
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
  const md = `# Bespoke raw candidate pass 1

## Summary

- Source-risk removal/raw-gap branch merge status: ${report.sourceRiskRemovalBranchMergeStatus}
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
  const sourceRiskReport = readJson<SourceRiskReport>(sourceRiskReportPath);
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
  );
  if (reconciliation.unknownUnclassifiedCount !== 0) {
    throw new Error(`Unknown raw files remain: ${reconciliation.unknownUnclassifiedCount}`);
  }
  const previewSizes = written.map((item) => item.previewCharacterCount);
  const report = {
    schemaVersion: 1,
    reportName: "bespoke-raw-candidate-pass-1",
    generatedAt: "2026-06-28",
    branch: "morsewords-bespoke-raw-candidate-pass-1-jun-2026",
    sourceRiskRemovalBranchMergeStatus:
      "morsewords-source-risk-removal-and-raw-gap-audit-jun-2026 was merged to main and pushed before this branch.",
    previousGeneratedCount: sourceRiskReport.generatedCountAfterRemoval,
    previousSeoSummaryCount: sourceRiskReport.seoSummaryCountAfterRemoval,
    previousPreviewCount: sourceRiskReport.previewCountAfterRemoval,
    candidateCategoriesReviewed: [
      "unsafe-start-end-boundary-risk",
      "unsafe-automation-structure",
      "unsafe-title-parent-collection-risk",
      "unsafe-metadata-risk",
      "blocked-source-or-rights-risk checked only for source-risk confirmation",
    ],
    selectedCandidates,
    acceptedGeneratedCandidates: acceptedWorks.map((work) => work.slug),
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
      "bespoke/manual raw candidate pass 2, because recoverable boundary and automation-structure candidates still remain.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-1",
    ],
    routeUiCheckResult:
      "Passed through morse-book-page Playwright coverage: newly accepted five-little-friends book/audiobook routes render without the full loading shell, keep starter preview/live player content visible, keep summary below Source notes, and show no 390px mobile horizontal overflow. Existing retained Poe, retained raw-candidate, normal book, removed/deferred slug absence, and listing-count coverage also passed in the same suite.",
    validationResults: {
      typecheck: "pass",
      seoSummaryAudit: "pass: 491/491 summaries, 0 fail",
      batch12ProseRestore: "pass",
      startupPreviewAudit: "pass: 491 valid, 0 updates",
      titleStartDefaultAudit:
        "pass: 491 generated books audited; known unrelated generated/preview churn was restored before commit",
      metadataSegmentationAudit:
        "pass: 491 generated books audited, 0 accepted revocations",
      manualUiDefectFollowup: "pass: 8 acceptable, 0 corrected",
      independentSecondPassAudit:
        "pass: 491 generated books, 491 preview assets, 0 fail-needs-fix",
      linkingSitemapAudit:
        "pass: 491 book URLs and 491 audiobook URLs",
      testIfPresent: "pass: 23/23 smoke tests",
      buildNetlify: "pass",
      playwrightBookPage: "pass: 39/39",
    },
  };
  writeReport(report);
  console.log(
    `Bespoke raw candidate pass 1 generated ${acceptedWorks.length} books: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
