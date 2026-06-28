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
  sherlockStorySplitPass1Slugs?: string[];
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
  "app/client/assets/books/audit-reports/sherlock-story-split-pass-2",
);
const priorPassReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/sherlock-story-split-pass-1/sherlock-story-split-pass-1.json",
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
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-adventure-of-the-blue-carbuncle",
    title: "The Adventure of the Blue Carbuncle",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a Christmas goose, a lost hat, a blue gem, and a trail of practical clues.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, removing Project Gutenberg boilerplate, title-page matter, contents, unrelated stories, back matter, and license text.",
    selectionReason:
      "Seventh Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "VII. THE ADVENTURE OF THE BLUE CARBUNCLE\n\n\n",
        endText: "\n\n\nVIII. THE ADVENTURE OF THE SPECKLED BAND",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Adventure of the Blue Carbuncle turns a seasonal oddity into a compact Sherlock Holmes investigation. Watson finds Holmes studying a battered hat, and the trail soon expands to a Christmas goose, a missing jewel, and a chain of ordinary people whose actions reveal more than they intend. The story is playful and practical, showing Holmes building a case from small physical details and everyday errands rather than dramatic confrontation.\n\nFor MorseWords learners, this story is useful because it has strong concrete anchors: the hat, the goose, the blue stone, the market, and the repeated questions about where each object came from. Those recurring details make the mystery easier to follow in Morse audio while still giving learners varied vocabulary and dialogue. The Christmas setting also gives the prose a different rhythm from the darker cases.\n\nThe story works well as a listening and copying exercise because it moves through clear stages. Learners can practice Holmes's first observations, the interviews about the goose, or the final explanation as separate blocks. The names and object words repeat often enough to support review, while the sentence structure still feels like real literary prose.\n\nBecause the solution depends on tracing ownership and motive, slower playback helps learners catch transitions between speakers and locations. Replaying the market sequence is especially helpful for practicing names, addresses, and quoted questions. The result is a friendly detective story that gives enough mystery to stay engaging without overwhelming a beginner with too many characters at once.\n\nIt is also a good confidence text after shorter fables or fairy tales. The plot rewards attention to evidence, but the central objects remain memorable, so learners can check their comprehension as they copy. Repeated sessions can focus first on the story, then on punctuation, word gaps, and the longer explanatory passages.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-adventure-of-the-speckled-band",
    title: "The Adventure of the Speckled Band",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a frightened client, a locked-room danger, and a clue hidden in a strange phrase.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Eighth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "VIII. THE ADVENTURE OF THE SPECKLED BAND\n\n\n",
        endText: "\n\n\nIX. THE ADVENTURE OF THE ENGINEER’S THUMB",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Adventure of the Speckled Band is one of the most suspenseful Sherlock Holmes stories. A frightened woman comes to Holmes after the strange death of her sister and the return of a mysterious phrase spoken in the night. The case moves from Baker Street to a country house where family pressure, unusual rooms, and small architectural details all matter.\n\nFor MorseWords practice, the story is strong because the narrative has a clear emotional pull and a memorable clue. Learners hear repeated references to rooms, bells, beds, windows, and the strange phrase at the center of the mystery. Those repeated details give orientation points during a longer and more tense story, while the dialogue keeps the pace readable.\n\nThe story is useful for practicing careful listening around descriptions. Holmes and Watson examine physical arrangements, compare statements, and prepare for a night watch, so learners must follow both action and explanation. Slower Morse playback is helpful for the room descriptions, while later replays can focus on the more dramatic final sequence.\n\nBecause the plot depends on danger and timing, it rewards exact attention to sentence endings and speaker changes. A learner can divide the story into the client interview, the journey and inspection, and the night scene. Each section has a distinct rhythm, making it practical for short review sessions.\n\nThis story is best for learners who are ready for sustained prose with suspense. It includes names, places, legal family details, and vivid sensory language, so it stretches vocabulary without becoming abstract. The result is a gripping practice text that encourages repeat listening because every small clue feels important.\n\nIt also helps learners practice restraint with speed. The tension can tempt a faster pace, but the evidence is easiest to follow when the room layout and repeated warnings are copied accurately first. Once those anchors are familiar, the same passage becomes a useful confidence-building replay.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-adventure-of-the-engineer-s-thumb",
    title: "The Adventure of the Engineer's Thumb",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a hydraulic engineer, a dangerous commission, and a violent mystery.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Ninth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "IX. THE ADVENTURE OF THE ENGINEER’S THUMB\n\n\n",
        endText: "\n\n\nX. THE ADVENTURE OF THE NOBLE BACHELOR",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Adventure of the Engineer's Thumb is a brisk Sherlock Holmes case with a strong action premise. A wounded hydraulic engineer arrives with a strange account of a secretive night commission, a remote house, and machinery that turns out to be connected to a criminal operation. The story is unusual among the Holmes adventures because the danger has already become physical before Holmes begins to reason through the case.\n\nFor MorseWords learners, this story offers clear scene changes and practical technical vocabulary. The engineer's account includes travel, money, machinery, rooms, pressure, and escape, so learners practice more than drawing-room conversation. The narrative remains easy to follow because the central event is vivid and the client's testimony provides a straightforward sequence.\n\nThe story is especially useful for practicing longer first-person explanation. Learners can replay the engineer's narrative in smaller sections, listening for how the job is proposed, how the location is described, and how suspicion builds. The repeated technical terms give useful anchors while the suspense keeps the practice from feeling mechanical.\n\nBecause the case involves urgency and physical movement, pacing matters. Slower playback helps with names, measurements, and machinery references; later replays can focus on the chase-like passages and the final interpretation. The story also gives good punctuation practice because it alternates between Watson's framing, the client's account, and Holmes's deductions.\n\nThis is a helpful intermediate text for learners who want a livelier Holmes story. It has enough action to hold attention, but the structure is still compact and mostly linear. That makes it suitable for copying practice, listening endurance, and review of unfamiliar technical words in a memorable context.\n\nIt is also good for checking how well learners handle unfamiliar nouns under pressure. Repeated replays can separate the technical vocabulary from the suspense, turning a dramatic account into a steady practice piece for names, measurements, tools, and movement.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-adventure-of-the-noble-bachelor",
    title: "The Adventure of the Noble Bachelor",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a vanished bride, a public marriage mystery, and a private explanation.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Tenth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "X. THE ADVENTURE OF THE NOBLE BACHELOR\n\n\n",
        endText: "\n\n\nXI. THE ADVENTURE OF THE BERYL CORONET",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Adventure of the Noble Bachelor begins with a society scandal: a bride disappears almost immediately after her wedding to an English nobleman. Holmes treats the public drama as a puzzle of motive, identity, and timing, using newspaper reports, witness details, and a few overlooked facts to find the private story behind the visible embarrassment.\n\nFor MorseWords learners, this story is helpful because it blends formal social language with direct investigative dialogue. Titles, names, marriage terms, newspaper phrasing, and personal statements all appear often. Those repeated categories make the story good for practicing proper nouns and punctuation while still following a compact mystery.\n\nThe plot moves through a clean sequence of evidence. Learners can work through the client interview, the public account of the wedding, and Holmes's resolution as separate practice blocks. The vocabulary is less technical than some Holmes cases, but the social context asks listeners to track relationships carefully.\n\nBecause the story turns on hidden personal history rather than violence or chase scenes, it rewards patient listening and accurate copying. Slower playback helps with the formal names and quoted explanations, while faster replay can build confidence once the situation is familiar. The result is a useful contrast to the darker or more action-heavy adventures.\n\nThis story also gives learners practice with tone. Much of the mystery depends on public appearance, private feeling, and how different characters explain the same event. That makes it a good Morse text for hearing sentence rhythm, speaker changes, and the difference between report, dialogue, and Holmes's final reasoning.\n\nBecause the case is socially framed, it is useful for reviewing titles and formal address without losing the plot. Learners can compare the newspaper-style wording with conversational explanation, then replay the conclusion to check whether the relationship clues stayed clear. It is compact, polished practice for formal detective prose.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-adventure-of-the-beryl-coronet",
    title: "The Adventure of the Beryl Coronet",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a damaged coronet, a family accusation, and evidence inside a household.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Eleventh Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "XI. THE ADVENTURE OF THE BERYL CORONET\n\n\n",
        endText: "\n\n\nXII. THE ADVENTURE OF THE COPPER BEECHES",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Adventure of the Beryl Coronet is a domestic mystery with high stakes. A banker receives a precious coronet as security, locks it inside his home, and then discovers it damaged under circumstances that appear to implicate his own son. Holmes must look past the obvious accusation and read the household details, tracks, motives, and emotional pressures around the missing jewels.\n\nFor MorseWords learners, the story is useful because it has a strong central object and repeated family terms. The coronet, stones, banker, son, niece, and household movements return throughout the case, giving listeners stable anchors. At the same time, the narrative includes formal business language, domestic conflict, and outdoor evidence, so the vocabulary stays varied.\n\nThe story is a good candidate for sectioned practice even though it is one standalone story. Learners can replay the banker's account slowly, then work through Holmes's investigation and final explanation. The case contains long explanatory passages, but the central question remains clear: what really happened to the coronet and why?\n\nBecause the mystery depends on misread evidence, careful Morse listening is rewarded. Slower speeds help learners catch who did what, when, and where; later replays can focus on punctuation and smooth word spacing. The emotional stakes also make the formal prose easier to remember across repeated sessions.\n\nThis story works well for learners moving into longer detective pieces. It asks them to track family relationships and physical clues at the same time, but it does not sprawl across many chapters. That balance makes it practical for focused listening, copying, and review of names, objects, and cause-and-effect language.\n\nIt also supports careful review of emotional vocabulary. The accusation, worry, loyalty, and relief around the household give the prose a clear human shape, so learners can listen for meaning while still practicing exact Morse spacing and punctuation.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-adventure-of-the-copper-beeches",
    title: "The Adventure of the Copper Beeches",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a governess, an unusual job offer, and a house with hidden danger.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Twelfth Sherlock Holmes story has clear Roman-numeral heading and Project Gutenberg end boundary in the source file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "XII. THE ADVENTURE OF THE COPPER BEECHES\n\n\n",
        endText: "\n\n\n*** END OF THE PROJECT GUTENBERG EBOOK THE ADVENTURES OF SHERLOCK HOLMES ***",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Adventure of the Copper Beeches closes the collection with a case that begins as an unsettling job offer. Violet Hunter asks Holmes whether she should accept a governess position with strange conditions about her hair, clothing, and behavior. The arrangement leads to a country house, a controlling employer, and evidence that someone is being hidden from view.\n\nFor MorseWords learners, this story is valuable because the premise is easy to remember and the clues recur clearly. The job offer, hair, blue dress, window, room, and household rules all become listening anchors. The story also gives learners a strong female client narrative, which creates a different rhythm from cases centered on police reports or male business clients.\n\nThe text works well in short practice blocks. Learners can start with Violet Hunter's interview, then replay the arrival at the house, the strange instructions, and the final investigation. Each block has concrete details and dialogue, making it useful for copying practice as well as listening comprehension.\n\nBecause the story builds unease through ordinary domestic instructions, careful pacing helps. Slower playback makes it easier to hear the conditions of the job and the relationships inside the house; later replays can focus on the more active investigation. The repeated descriptions are excellent for checking word spacing and punctuation.\n\nThis story is also a fitting final Sherlock practice piece because it combines social observation, suspense, and physical clues. It is substantial enough for endurance work but still compact compared with a novel. Learners can return to it for repeated sessions, using the memorable setup to build confidence with longer literary Morse audio.\n\nThe governess premise also makes the early dialogue easy to summarize before replaying. That helps learners test comprehension first, then return for accuracy work on names, household directions, and the shifting clues that make the house feel increasingly suspicious.",
  },
];

const selectedDeferred: Array<Record<string, string>> = [];

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
    editor: "",
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
      "Cloudflare export was not run in this Sherlock story-split branch.",
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
    "Targeted Sherlock story-split pass 2 processed this accepted story after manual collection-split, source, and metadata review. Review generated output before any Cloudflare export.";
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
        "Targeted Sherlock story-split pass 2 used explicit manual story boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted Sherlock story-split pass 2; review before Cloudflare export.",
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

Processed by targeted Sherlock story-split pass 2.

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
    summarySet: "sherlock-story-split-pass-2",
    generatedAt: "2026-06-28",
    expectedSummaryCount: expectedCount,
    sherlockStorySplitPass1Slugs: data.sherlockStorySplitPass1Slugs,
    sherlockStorySplitPass2Slugs: works.map((work) => work.slug),
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
            "Accepted in Sherlock story-split pass 2 as individual generated story pages after manual collection-split/source/boundary review.",
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
        "The Sherlock raw collection is now fully mapped to live generated story pages. The remaining raw/generated gap is explained by current non-generated categories, collection/story split outputs, and accepted live generated books that do not have a one-to-one current temp-books filename match.",
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
  const reportJsonPath = path.join(reportRoot, "sherlock-story-split-pass-2.json");
  const reportMdPath = path.join(reportRoot, "sherlock-story-split-pass-2.md");
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
  const md = `# Sherlock story-split pass 2

## Summary

- Pass-1 branch merge status: ${report.pass1BranchMergeStatus}
- Raw source file split: ${report.rawSourceFileSplit}
- Previous generated count: ${report.previousGeneratedCount}
- Previous SEO summary count: ${report.previousSeoSummaryCount}
- Previous preview count: ${report.previousPreviewCount}
- Accepted/generated story units: ${(report.acceptedGeneratedStoryUnits as string[]).join(", ")}
- Collection parent generated: ${report.collectionParentGenerated}
- Generated count after branch: ${report.generatedCountAfterBranch}
- SEO summary count after branch: ${report.seoSummaryCountAfterBranch}
- Startup preview count after branch: ${report.startupPreviewCountAfterBranch}
- Missing summary count: ${report.missingSummaryCountAfterBranch}
- Status of The Adventures of Sherlock Holmes.txt: ${report.statusOfSherlockRawFileAfterBranch}
- Unknown/unclassified raw count: ${report.unknownUnclassifiedCount}
- Cloudflare export: ${report.cloudflareExportCheckpoint}

## Story Units

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
    ["the-adventures-of-sherlock-holmes"],
    updatedLibrary.books.length,
  );
  if (reconciliation.unknownUnclassifiedCount !== 0) {
    throw new Error(`Unknown raw files remain: ${reconciliation.unknownUnclassifiedCount}`);
  }
  const previewSizes = written.map((item) => item.previewCharacterCount);
  const report = {
    schemaVersion: 1,
    reportName: "sherlock-story-split-pass-2",
    generatedAt: "2026-06-28",
    branch: "morsewords-sherlock-story-split-pass-2-jun-2026",
    pass1BranchMergeStatus:
      "morsewords-sherlock-story-split-pass-1-jun-2026 was merged to main and pushed before this branch.",
    previousGeneratedCount: sourceRiskReport.generatedCountAfterRemoval,
    previousSeoSummaryCount: sourceRiskReport.seoSummaryCountAfterRemoval,
    previousPreviewCount: sourceRiskReport.previewCountAfterRemoval,
    candidateCategoriesReviewed: [
      "unsafe-start-end-boundary-risk",
      "The Adventures of Sherlock Holmes.txt only",
    ],
    rawSourceFileSplit: "app/client/assets/temp-books/The Adventures of Sherlock Holmes.txt",
    rawFileCountContribution: 1,
    generatedStoryPagesAdded: acceptedWorks.length,
    collectionParentGenerated: "no",
    storyUnitsInspected: [
      ...acceptedWorks.map((work) => work.title),
      ...selectedDeferred.map((candidate) => candidate.expectedTitle),
    ],
    selectedCandidates,
    acceptedGeneratedStoryUnits: acceptedWorks.map((work) => work.slug),
    collectionStorySplitsPerformed: [
      {
        rawSourceFilename: "The Adventures of Sherlock Holmes.txt",
        parentCollectionSlug: "the-adventures-of-sherlock-holmes",
        generatedStorySlugs: acceptedWorks.map((work) => work.slug),
        reason:
          "The Project Gutenberg file contains twelve clean titled Sherlock Holmes stories. This pass generated the remaining six individual story pages and did not create a parent collection page.",
      },
    ],
    deferredCandidates: selectedDeferred,
    duplicatesConfirmed: [],
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
    statusOfSherlockRawFileAfterBranch:
      "fully split, no further action needed; all twelve clean Sherlock story units from The Adventures of Sherlock Holmes.txt are now generated as standalone pages",
    unknownUnclassifiedCount: reconciliation.unknownUnclassifiedCount,
    remainingNonGeneratedRawFilesByCategory: reconciliation.nonGeneratedRawFilesByCategory,
    starterPreviewFirstRenderCheckpoint:
      "Local starter previews remain small and are available for immediate first render; no full chapter preview was stored.",
    cloudflareExportCheckpoint: "not run",
    urlPageIndexabilityBlockerCheckpoint:
      "URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.",
    mobileFinalStageCheckpoint: "Broad mobile optimization remains the final stage and was not started.",
    recommendedNextMajorPhase:
      "bespoke/manual raw candidate pass 3 if additional recoverable raw candidates remain; otherwise user decision checkpoint before book-library Cloudflare export.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/sherlock-story-split-pass-2",
    ],
    routeUiCheckResult:
      "Pending route/UI verification after generation and validation.",
    validationResults: {
      typecheck: "pending",
      seoSummaryAudit: "pending",
      batch12ProseRestore: "pending",
      startupPreviewAudit: "pending",
      titleStartDefaultAudit: "pending",
      metadataSegmentationAudit: "pending",
      manualUiDefectFollowup: "pending",
      independentSecondPassAudit: "pending",
      linkingSitemapAudit: "pending",
      testIfPresent: "pending",
      buildNetlify: "pending",
      playwrightBookPage: "pending",
    },
  };
  writeReport(report);
  console.log(
    `Sherlock story-split pass 2 generated ${acceptedWorks.length} books: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
