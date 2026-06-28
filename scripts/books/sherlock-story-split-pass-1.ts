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
  "app/client/assets/books/audit-reports/sherlock-story-split-pass-1",
);
const priorPassReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-2/bespoke-raw-candidate-pass-2.json",
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
    slug: "a-scandal-in-bohemia",
    title: "A Scandal in Bohemia",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about Irene Adler, a royal secret, and a case that tests Holmes's assumptions.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, removing Project Gutenberg boilerplate, title-page matter, contents, unrelated stories, back matter, and license text.",
    selectionReason:
      "Opening Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "I. A SCANDAL IN BOHEMIA\n\n\n",
        endText: "\n\n\nII. THE RED-HEADED LEAGUE",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "A Scandal in Bohemia introduces one of the most famous Sherlock Holmes cases: a royal client, an incriminating photograph, and Irene Adler, whose intelligence unsettles Holmes's expectations. The story begins with Watson visiting Baker Street and quickly moves into a problem that requires disguise, observation, and careful reading of human behavior. Rather than a violent puzzle, the case turns on social strategy and the limits of Holmes's confidence.\n\nFor MorseWords practice, the story is useful because it mixes familiar narrative framing with lively dialogue and clear investigative stages. Learners hear recurring names such as Holmes, Watson, Adler, and the King, which create orientation points while the plot moves through interviews, disguises, and a staged scene. The sentences range from brisk exchanges to longer explanatory passages, giving learners a balanced practice text.\n\nThis story works well after shorter prose because it asks the listener to follow cause and effect across several scenes. A learner can begin with Watson's opening visit, then replay the client interview or the later street scene as separate practice blocks. The text also gives excellent punctuation practice: quotation marks, titles, formal address, and reported plans all appear often.\n\nBecause the mystery depends on what characters notice and infer, careful pacing matters. Slower Morse playback helps learners catch names, places, and repeated objects before increasing speed. The result is a compact detective story that feels complete while still offering enough variety for repeated listening, copying, and review sessions.\n\nIt is also a useful benchmark for recognizing proper nouns in Morse. The story repeats formal names, royal titles, street references, and ordinary objects in close succession, so learners can compare how familiar and unfamiliar words feel at the same speed. That makes it a practical text for building confidence with real literary sentences rather than isolated vocabulary drills. Short replays make progress easy to hear.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-red-headed-league",
    title: "The Red-Headed League",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a strange newspaper advertisement, an odd employment scheme, and a hidden crime.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Second Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "II. THE RED-HEADED LEAGUE\n\n\n",
        endText: "\n\n\nIII. A CASE OF IDENTITY",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Red-Headed League is one of Arthur Conan Doyle's most playful Sherlock Holmes stories. A pawnbroker named Jabez Wilson comes to Holmes with a strange account of a well-paid job offered only to men with red hair. The oddity sounds comic at first, but Holmes sees that the ridiculous advertisement and daily copying work may be covering a much more practical scheme.\n\nFor MorseWords practice, this story gives learners strong anchors and a clear puzzle shape. The repeated phrases around the league, Wilson's red hair, the advertisement, and Holmes's questions make the opening easy to follow in Morse audio. The later investigation shifts into street observation and action, so the vocabulary changes without losing the listener.\n\nThe story is especially useful for practicing dialogue. Wilson's long explanation, Holmes's questions, and Watson's narration create a clean rhythm between quoted speech and descriptive prose. Learners can copy the client interview slowly, then use the shorter investigative scenes for faster review. The humor in the premise also makes the repeated listening less dry than a purely procedural text.\n\nBecause the mystery depends on connecting an absurd surface to a hidden plan, the story rewards careful attention to ordinary details. It is a good practice choice for learners who are ready to handle names, addresses, dates, money, and dialogue punctuation while still staying inside a compact, memorable plot.\n\nThe piece is also helpful for endurance because Wilson's statement is long but easy to visualize. A learner can replay the same explanation several times, first listening for the story, then copying the repeated business terms, and finally checking spacing around quotations and numbers. That layered approach turns a funny premise into a practical Morse review session. The comic setup keeps repetition fresh, even during careful accuracy passes. It also rewards comparing slow and normal-speed playback.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "a-case-of-identity",
    title: "A Case of Identity",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a missing bridegroom, family pressure, and a deception hidden in plain sight.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Third Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "III. A CASE OF IDENTITY\n\n\n",
        endText: "\n\n\nIV. THE BOSCOMBE VALLEY MYSTERY",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "A Case of Identity follows Sherlock Holmes as he hears the story of Mary Sutherland, whose fiance vanished on the way to their wedding. The case appears emotional and domestic rather than dramatic, but Holmes treats the small details with the same seriousness he gives to larger crimes. The solution depends on letters, family motives, disguise, and the pressure placed on a young woman who wants control over her own life.\n\nFor MorseWords learners, this story is a useful listening bridge because it is driven by conversation. Mary Sutherland's account gives a sustained first-person explanation, while Holmes and Watson frame the problem through observation and inference. That structure helps learners practice long quoted passages, names, dates, and repeated family terms without the interruptions of a complicated action plot.\n\nThe story is also good for careful pacing. Several clues are ordinary words and objects: typewritten letters, spectacles, clothing, income, and a familiar household. In Morse audio, those repeated concrete details help the learner stay oriented while Holmes builds the case. A beginner can work through the client interview in smaller chunks, while a more confident listener can use the complete story for endurance practice.\n\nBecause the mystery is compact and mostly domestic, it rewards accuracy more than speed. Learners can replay the explanation to catch punctuation, speaker changes, and the formal language of letters and promises. It is a quiet but effective practice text for moving from short story listening into more nuanced detective prose.\n\nIt also makes a good contrast with the more action-heavy Sherlock stories. The listener practices attention to tone, hesitation, and reported facts instead of chase scenes. That slower texture is useful for Morse work because it highlights sentence endings, commas, and the rhythm of formal speech, all of which can disappear when learners focus only on individual letters.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-boscombe-valley-mystery",
    title: "The Boscombe Valley Mystery",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a murder investigation, disputed evidence, and hidden history in Boscombe Valley.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Fourth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "IV. THE BOSCOMBE VALLEY MYSTERY\n\n\n",
        endText: "\n\n\nV. THE FIVE ORANGE PIPS",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Boscombe Valley Mystery sends Holmes and Watson away from Baker Street into a country murder case. A young man appears to have strong evidence against him after a quarrel with his father, but Holmes is not satisfied with the obvious reading of the facts. The story combines newspaper reports, local testimony, family history, and outdoor observation as Holmes looks for a pattern that explains more than the first accusation.\n\nFor MorseWords practice, this story offers a different rhythm from the drawing-room cases. It includes travel, landscape, legal suspicion, and witness statements, so learners hear a wider range of vocabulary while staying inside a single investigation. Names and places recur often enough to provide anchors, and the central question remains easy to remember.\n\nThe story is useful for practicing longer narrative passages. Watson's account includes summaries of evidence, descriptions of the countryside, and direct dialogue with people connected to the case. A learner can treat each scene as a separate practice segment, replaying the opening trip, the interview material, or Holmes's reasoning as confidence improves.\n\nBecause the mystery depends on comparing public evidence with private history, the text rewards patient listening. It is a good story for learners who want to practice sustained Morse audio without losing the thread of the case. The balance of action, explanation, and dialogue makes it suitable for both full-story listening and shorter copy drills.\n\nThe country setting also brings vocabulary that differs from the Baker Street stories: valleys, farms, roads, woods, police, evidence, and family relationships. That variety helps learners test whether they are recognizing full words or merely anticipating a familiar phrase. It is a solid choice for stepping from compact urban puzzles into a broader narrative environment. Scene-based replays work especially well here, especially for improving recall and confidence.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-five-orange-pips",
    title: "The Five Orange Pips",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a cryptic warning, inherited danger, and five orange pips.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Fifth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "V. THE FIVE ORANGE PIPS\n\n\n",
        endText: "\n\n\nVI. THE MAN WITH THE TWISTED LIP",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Five Orange Pips is a darker Sherlock Holmes story built around a small object that carries a frightening warning. A young client comes to Baker Street with a family history marked by strange letters, sudden deaths, and the repeated arrival of five orange pips. Holmes has to connect the symbol, the dates, and the hidden past before the danger reaches its next target.\n\nFor MorseWords learners, this story is strong practice because it combines suspense with clear recurring clues. The pips, letters, dates, family names, and places appear repeatedly, giving listeners familiar signals as the case develops. The atmosphere is more urgent than in some Holmes stories, which can help learners stay attentive through longer passages.\n\nThe text also gives useful practice with chronology. The client explains earlier events, Holmes organizes the clues, and the story moves from warning to action. In Morse audio, that sequence encourages careful listening for time words, names, and locations. A learner can replay the family-history section slowly, then use Holmes's later reasoning for a more confident copy pass.\n\nBecause the story has a compact structure and a memorable central symbol, it works well for repeat sessions. Learners can first follow the plot, then return to the same paragraphs to improve spacing, punctuation, and recognition speed. It is a good choice for anyone ready for a tense detective story that remains shorter than a full novel chapter sequence.\n\nThe repeated warning motif is especially useful for Morse review. Learners can listen for the same object and phrase as it returns in different contexts, then check whether the surrounding dates and locations were copied correctly. That makes the story good for practicing both recognition and short-term memory under a slightly more suspenseful narrative pace. The clear clue pattern supports focused review across several shorter sittings.",
  },
  {
    fileName: "The Adventures of Sherlock Holmes.txt",
    slug: "the-man-with-the-twisted-lip",
    title: "The Man with the Twisted Lip",
    author: ["Arthur Conan Doyle"],
    authorDeathYear: 1930,
    description:
      "Arthur Conan Doyle's Sherlock Holmes story about a missing gentleman, a mysterious beggar, and an identity puzzle.",
    subjects: ["Detective fiction", "Short stories", "Mystery fiction"],
    originalPublication: "1891",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Adventures of Sherlock Holmes into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Sixth Sherlock Holmes story has clear Roman-numeral heading and next-story boundary in the Project Gutenberg file.",
    decision: "accept",
    riskBeingFixed: "large multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "VI. THE MAN WITH THE TWISTED LIP\n\n\n",
        endText: "\n\n\nVII. THE ADVENTURE OF THE BLUE CARBUNCLE",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Man with the Twisted Lip begins with Watson being drawn into a personal errand that unexpectedly leads back to Sherlock Holmes. A respectable man has vanished under strange circumstances, and the trail points toward a shabby room, an opium den, and a beggar whose appearance seems to hide more than it reveals. The case turns on identity, observation, and the difference between public appearance and private fact.\n\nFor MorseWords practice, this story is valuable because it has a strong sequence of scenes. Watson's opening errand, the surprise meeting with Holmes, the missing-person account, and the final explanation each provide natural practice blocks. Learners can work through one scene at a time or listen to the whole story for a longer detective session.\n\nThe vocabulary is varied but anchored by repeated names, places, and case details. Holmes, Watson, St. Clair, Boone, the window, the coat, and the room all return as clues, helping listeners stay oriented while the mystery develops. The story also includes sustained dialogue, descriptive passages, and formal explanation, so it supports both Morse listening and typing practice.\n\nBecause the solution depends on a hidden role rather than a complicated chain of action, the story rewards careful attention to detail. Slower playback can make the changes in speaker and setting easier to follow, while later replays can focus on cleaner word gaps, punctuation, and longer-sentence endurance.\n\nIt is also a useful story for practicing transitions between locations. The opening moves from a domestic request to a city errand and then into Holmes's investigation, so learners must follow setting changes without relying on chapter breaks. That makes the text a good intermediate step before longer mystery chapters with more characters and more frequent scene shifts. Its staged reveal rewards patient listening and deliberate replay across focused sessions.",
  },
];

const selectedDeferred = [
  {
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected:
      "Remaining six story units were inspected through their headings and deferred to keep this split pass reviewable.",
    expectedSlug: "the-adventure-of-the-blue-carbuncle",
    expectedTitle: "The Adventure of the Blue Carbuncle",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2.",
  },
  {
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected:
      "Remaining six story units were inspected through their headings and deferred to keep this split pass reviewable.",
    expectedSlug: "the-adventure-of-the-speckled-band",
    expectedTitle: "The Adventure of the Speckled Band",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2.",
  },
  {
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected:
      "Remaining six story units were inspected through their headings and deferred to keep this split pass reviewable.",
    expectedSlug: "the-adventure-of-the-engineer-s-thumb",
    expectedTitle: "The Adventure of the Engineer's Thumb",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2.",
  },
  {
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected:
      "Remaining six story units were inspected through their headings and deferred to keep this split pass reviewable.",
    expectedSlug: "the-adventure-of-the-noble-bachelor",
    expectedTitle: "The Adventure of the Noble Bachelor",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2.",
  },
  {
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected:
      "Remaining six story units were inspected through their headings and deferred to keep this split pass reviewable.",
    expectedSlug: "the-adventure-of-the-beryl-coronet",
    expectedTitle: "The Adventure of the Beryl Coronet",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2.",
  },
  {
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected:
      "Remaining six story units were inspected through their headings and deferred to keep this split pass reviewable.",
    expectedSlug: "the-adventure-of-the-copper-beeches",
    expectedTitle: "The Adventure of the Copper Beeches",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Clean story boundary exists, but this pass stops after the first six standalone stories; defer to Sherlock story-split pass 2.",
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
    "Targeted Sherlock story-split pass 1 processed this accepted story after manual collection-split, source, and metadata review. Review generated output before any Cloudflare export.";
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
        "Targeted Sherlock story-split pass 1 used explicit manual story boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted Sherlock story-split pass 1; review before Cloudflare export.",
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

Processed by targeted Sherlock story-split pass 1.

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
    summarySet: "sherlock-story-split-pass-1",
    generatedAt: "2026-06-28",
    expectedSummaryCount: expectedCount,
    sherlockStorySplitPass1Slugs: works.map((work) => work.slug),
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
            "Accepted in Sherlock story-split pass 1 as individual generated story pages after manual collection-split/source/boundary review.",
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
      generatedBooksWithoutDirectCurrentRawFilenameEvidence: 12,
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
        "wind-in-the-willows",
      ],
      reconciliationNote:
        "The Sherlock raw collection is now partially mapped to live generated story pages. The remaining raw/generated gap is explained by current non-generated categories, collection/story split outputs, and accepted live generated books that do not have a one-to-one current temp-books filename match.",
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
  const reportJsonPath = path.join(reportRoot, "sherlock-story-split-pass-1.json");
  const reportMdPath = path.join(reportRoot, "sherlock-story-split-pass-1.md");
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
  const md = `# Sherlock story-split pass 1

## Summary

- Pass-2 branch merge status: ${report.pass2BranchMergeStatus}
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
    reportName: "sherlock-story-split-pass-1",
    generatedAt: "2026-06-28",
    branch: "morsewords-sherlock-story-split-pass-1-jun-2026",
    pass2BranchMergeStatus:
      "morsewords-bespoke-raw-candidate-pass-2-jun-2026 was merged to main and pushed before this branch.",
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
          "The Project Gutenberg file contains twelve clean titled Sherlock Holmes stories. This pass generated the first six individual story pages and did not create a parent collection page.",
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
      "partially split, more stories remain; first six story pages generated, six clean story units deferred to Sherlock story-split pass 2",
    unknownUnclassifiedCount: reconciliation.unknownUnclassifiedCount,
    remainingNonGeneratedRawFilesByCategory: reconciliation.nonGeneratedRawFilesByCategory,
    starterPreviewFirstRenderCheckpoint:
      "Local starter previews remain small and are available for immediate first render; no full chapter preview was stored.",
    cloudflareExportCheckpoint: "not run",
    urlPageIndexabilityBlockerCheckpoint:
      "URL/page/indexability and planned non-book sitemap work remains a later final-release blocker.",
    mobileFinalStageCheckpoint: "Broad mobile optimization remains the final stage and was not started.",
    recommendedNextMajorPhase:
      "Sherlock story-split pass 2, because six clean Sherlock story units remain in the same raw collection.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/sherlock-story-split-pass-1",
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
    `Sherlock story-split pass 1 generated ${acceptedWorks.length} books: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
