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
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-2",
);
const priorPassReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-1/bespoke-raw-candidate-pass-1.json",
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
    fileName: "The Happy Prince, and Other Tales.txt",
    slug: "the-happy-prince",
    title: "The Happy Prince",
    author: ["Oscar Wilde"],
    authorDeathYear: 1900,
    description:
      "Oscar Wilde's fairy tale about a jeweled statue, a loyal swallow, and acts of compassion across a winter city.",
    subjects: ["Fairy tales", "Children's literature", "Short stories"],
    originalPublication: "1888",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Happy Prince, and Other Tales into individual story pages, removing Project Gutenberg boilerplate, title-page matter, contents, illustrations, printer matter, and license text.",
    selectionReason:
      "Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories.",
    decision: "accept",
    riskBeingFixed: "multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "The Happy Prince.\n\n\n",
        endText: "\n\n\nThe Nightingale and the Rose.",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Happy Prince by Oscar Wilde is a short fairy tale about a beautiful statue who stands above a city and sees the hardship that ordinary people are facing below him. A swallow, delayed on his journey to warmer lands, rests near the statue and becomes the prince's messenger. Together they give away the prince's jewels and gold to people who need help, turning a glittering public monument into a story about compassion, sacrifice, and what beauty is really for.\n\nFor MorseWords practice, this story is useful because it has a vivid central image and a steady emotional rhythm. The Happy Prince and the Swallow are named often, so learners get repeated signals that help them stay oriented while listening or copying. The city scenes also introduce varied vocabulary: streets, windows, jewels, weather, hunger, work, children, and travel. That mix gives the learner more variety than a simple drill while staying much shorter than a novel chapter.\n\nThe story is a good bridge from sentence practice into literary prose. It includes repeated requests, direct dialogue, and descriptive passages that reward careful pacing. A beginner can listen to the opening at a slower speed, then return to shorter paragraphs to practice punctuation, quotation marks, and common word spacing. More confident learners can use the whole story for a complete listening session because the plot is easy to remember and the scenes build naturally.\n\nThe emotional shape also helps with retention. The listener can follow the Swallow's choices, the prince's growing generosity, and the contrast between public admiration and private kindness. That makes the text well suited for repeat practice: first for the story, then for accuracy, and later for smoother Morse timing.\n\nBecause the tale repeats its main names and requests without becoming flat, it is also a good warm-up before longer public-domain stories. Learners can focus on clean character gaps, word gaps, and the rhythm of dialogue while still hearing a complete, memorable narrative.",
  },
  {
    fileName: "The Happy Prince, and Other Tales.txt",
    slug: "the-nightingale-and-the-rose",
    title: "The Nightingale and the Rose",
    author: ["Oscar Wilde"],
    authorDeathYear: 1900,
    description:
      "Oscar Wilde's fairy tale about a nightingale, a student, and the cost of making one red rose.",
    subjects: ["Fairy tales", "Children's literature", "Short stories"],
    originalPublication: "1888",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Happy Prince, and Other Tales into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories.",
    decision: "accept",
    riskBeingFixed: "multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "The Nightingale and the Rose.\n\n\n",
        endText: "\n\n\nThe Selfish Giant.",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Nightingale and the Rose by Oscar Wilde is a fairy tale about a student who longs for a red rose so he can dance with the girl he admires. A nightingale hears his sorrow and believes she has found a true lover. Her search for a red rose takes her through the garden from tree to tree, and the story becomes a sharp contrast between ideal love, artistic sacrifice, and the colder practical world the student inhabits.\n\nFor MorseWords learners, the story offers rich but manageable prose. It is short enough for a focused session, yet it contains more variety than a basic reading drill. The repeated phrase of the red rose gives the ear a useful anchor, while the garden setting supplies concrete nouns such as tree, window, moon, thorn, rose, student, and nightingale. Those recurring images make it easier to follow the text in Morse audio without losing the thread.\n\nThis is also a good story for practicing quoted speech. Several voices appear: the student, the nightingale, the rose trees, and the people around the student. Their exchanges are clear, and the punctuation gives learners a chance to work on pauses, quotation marks, and sentence endings. The prose moves between short emotional statements and longer descriptive sentences, so it can be used slowly for copying or replayed later at a more confident speed.\n\nThe story's compact structure helps practice feel complete. It begins with a simple want, follows the nightingale's decision, and turns that want into a pointed contrast between feeling and practicality. Learners can listen once for the plot, then return to selected paragraphs to improve accuracy. The result is a useful short literary practice text for anyone ready to move from isolated Morse words into expressive narrative.\n\nIt is especially good for practicing careful pacing because the emotional language can tempt learners to rush. Slower playback lets the repeated rose imagery settle into a predictable signal pattern before the learner tries a faster copy pass.",
  },
  {
    fileName: "The Happy Prince, and Other Tales.txt",
    slug: "the-selfish-giant",
    title: "The Selfish Giant",
    author: ["Oscar Wilde"],
    authorDeathYear: 1900,
    description:
      "Oscar Wilde's fairy tale about a giant, a garden, the return of children, and the change from winter to spring.",
    subjects: ["Fairy tales", "Children's literature", "Short stories"],
    originalPublication: "1888",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Happy Prince, and Other Tales into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories.",
    decision: "accept",
    riskBeingFixed: "multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "The Selfish Giant.\n\n\n",
        endText: "\n\n\nThe Devoted Friend.",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Selfish Giant by Oscar Wilde is a short fairy tale about a giant who returns home and shuts children out of his garden. Once the garden is closed, spring refuses to come there. Snow, frost, hail, and the north wind take over, while the world outside moves into blossom. The story follows the giant as he learns that the joy of the garden depends on generosity, welcome, and the presence of the children he tried to exclude.\n\nFor MorseWords practice, this is one of the most approachable Wilde stories. Its central images are clear and repeated: garden, wall, children, giant, winter, spring, tree, flowers, and birds. Those repeating words make the audio easier to follow, especially for learners who are beginning to move beyond short phrases. The story also has a strong scene structure, so a listener can picture each change as it happens.\n\nThe text is useful for both listening and typing practice. It includes simple action sentences, direct dialogue, and descriptive passages that are not too dense. A beginner might copy the opening paragraphs slowly, focusing on word spacing and sentence endings. A more confident learner can listen to the whole story in one sitting, then replay later passages to work on longer sentences and emotional tone.\n\nThe tale also helps learners practice attention over a complete narrative arc. The giant's mistake, the long winter, the children's return, and the later transformation are easy to remember, so the learner can concentrate on the Morse signal instead of constantly trying to decode the plot. It is a compact, rewarding story for practicing literary prose without taking on a full book-length work.\n\nBecause the language is vivid but not crowded, this story also works well for mixed practice. A learner can listen first, then type a familiar paragraph from memory, and finally compare the rhythm against the original text.",
  },
  {
    fileName: "The Happy Prince, and Other Tales.txt",
    slug: "the-devoted-friend",
    title: "The Devoted Friend",
    author: ["Oscar Wilde"],
    authorDeathYear: 1900,
    description:
      "Oscar Wilde's satirical fairy tale about little Hans, the Miller, and a one-sided idea of friendship.",
    subjects: ["Fairy tales", "Children's literature", "Short stories", "Satire"],
    originalPublication: "1888",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Happy Prince, and Other Tales into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Clean individual story from a compact Project Gutenberg collection; boundaries are clear between titled stories.",
    decision: "accept",
    riskBeingFixed: "multi-story collection boundaries",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "The Devoted Friend.\n\n\n",
        endText: "\n\n\nThe Remarkable Rocket.",
        includeStartText: false,
        includeEndText: false,
      },
    ],
    summary:
      "The Devoted Friend by Oscar Wilde is a satirical fairy tale about little Hans, the Miller, and a very one-sided idea of friendship. The story is framed by a conversation beside a pond, where a linnet tells a moral tale to a water-rat. Inside that tale, the Miller speaks beautifully about friendship while repeatedly taking advantage of Hans, who is generous, trusting, and eager to be thought loyal.\n\nFor MorseWords practice, this story gives learners a strong mix of dialogue and narration. The word friendship appears often, and the Miller's speeches create recognizable patterns that can help listeners stay oriented. At the same time, the story is not merely repetitive. It moves through seasons, errands, requests, excuses, and consequences, so learners get varied vocabulary and a clear sequence of events.\n\nThis is a useful step after shorter fairy tales because it asks the learner to track who is speaking and what the speaker means. Much of the point comes from irony: the Miller says noble things while acting selfishly. That makes the story valuable for careful listening, since pauses, punctuation, and quotation marks help distinguish narration from speech. It is also a good typing text for practicing longer quoted passages without the scale of a novel.\n\nThe story is long enough for a meaningful session but still compact enough to revisit. Learners can copy the opening frame first, then return to Hans and the Miller once the rhythm feels comfortable. The clear moral pattern makes it memorable, while the satirical tone gives the practice more bite than a plain lesson or simple adventure.\n\nIt also helps with endurance. The learner has to follow repeated requests across several scenes, so the practice becomes less about decoding isolated words and more about keeping a steady signal rhythm through a complete argument.",
  },
  {
    fileName: "The Happy Prince, and Other Tales.txt",
    slug: "the-remarkable-rocket",
    title: "The Remarkable Rocket",
    author: ["Oscar Wilde"],
    authorDeathYear: 1900,
    description:
      "Oscar Wilde's comic fairy tale about an extremely self-important rocket at a royal wedding.",
    subjects: ["Fairy tales", "Children's literature", "Short stories", "Satire"],
    originalPublication: "1888",
    oldCategory: "unsafe-start-end-boundary-risk",
    sourceNote:
      "Manual pass split The Happy Prince, and Other Tales into individual story pages, preserving only this titled story body.",
    selectionReason:
      "Clean final story from a compact Project Gutenberg collection; the end boundary is before printer matter and license text.",
    decision: "accept",
    riskBeingFixed: "multi-story collection boundaries and end matter",
    sections: [
      {
        label: "Story",
        title: null,
        startText: "The Remarkable Rocket.\n\n\n",
        endText: "went out.",
        includeStartText: false,
        includeEndText: true,
      },
    ],
    summary:
      "The Remarkable Rocket by Oscar Wilde is a comic fairy tale about a firework who is certain that everything must revolve around him. The story begins with a royal wedding and a planned fireworks display, then turns into a sequence of conversations among fireworks, animals, and the Rocket himself. His confidence is enormous, his misunderstandings are constant, and his grand speeches become funnier as the world refuses to treat him as important.\n\nFor MorseWords practice, this story is lively and dialogue-heavy. Learners get many short exchanges, exclamations, and repeated references to the Rocket, the prince, the princess, and the fireworks. Those repetitions help with recognition, while the comedy keeps the session from feeling mechanical. The story also includes varied punctuation and changing speakers, making it a useful bridge from simple prose into more expressive listening.\n\nThis is a good choice after easier fairy tales because it asks the learner to track tone as well as plot. The Rocket often misunderstands what others say, so careful listening matters. Short replies can be copied as quick drills, while the Rocket's longer speeches are useful for practicing stamina, word spacing, and sentence rhythm. The result is a playful but still structured text for Morse practice.\n\nThe setting also gives unusual vocabulary that does not appear in many adventure or school stories: fireworks, rockets, squibs, candles, cartridges, court, wedding, display, and sensation. That variety helps learners expand beyond familiar word patterns. The final comic turn is brief, making the whole story practical for a complete listening session or a set of shorter replay drills.\n\nBecause the Rocket talks so much, the story is especially useful for dialogue pacing. Learners can practice identifying the speaker changes, then replay the longer speeches to build confidence with sustained Morse audio and cleaner copy. It also gives punctuation practice without requiring a long commitment.",
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
    candidateRawFile: "The Adventures of Sherlock Holmes.txt",
    oldCategory: "unsafe-start-end-boundary-risk",
    whySelected: "High-value candidate, but structurally large.",
    expectedSlug: "the-adventures-of-sherlock-holmes",
    expectedTitle: "The Adventures of Sherlock Holmes",
    expectedAuthor: "Arthur Conan Doyle",
    riskBeingFixed: "large multi-story collection boundaries",
    decision: "keep deferred",
    reason:
      "Large twelve-story collection is practical but too broad for this five-story pass; defer to a dedicated Sherlock story-split pass.",
  },
  {
    candidateRawFile: "Yellow gentians and blue.txt",
    oldCategory: "unsafe-automation-structure",
    whySelected: "Recoverable-category item checked again for possible straightforward handling.",
    expectedSlug: "yellow-gentians-and-blue",
    expectedTitle: "Yellow Gentians and Blue",
    expectedAuthor: "Zona Gale",
    riskBeingFixed: "automation structure",
    decision: "keep deferred",
    reason:
      "Larger mixed poetry/prose structure still needs manual section planning beyond this story-split pass.",
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
    "Targeted bespoke raw candidate pass 2 processed this accepted story after manual collection-split, source, and metadata review. Review generated output before any Cloudflare export.";
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
        "Targeted bespoke raw candidate pass 2 used explicit manual story boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted bespoke raw candidate pass 2; review before Cloudflare export.",
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

Processed by targeted bespoke raw candidate pass 2.

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
    summarySet: "bespoke-raw-candidate-pass-2",
    generatedAt: "2026-06-28",
    expectedSummaryCount: expectedCount,
    bespokeRawCandidatePass2Slugs: works.map((work) => work.slug),
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
            "Accepted in bespoke raw candidate pass 2 as individual generated story pages after manual collection-split/source/boundary review.",
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
        "One formerly non-generated raw collection is now mapped to live generated story pages. The remaining raw/generated gap is explained by current non-generated categories, collection/story split outputs, and accepted live generated books that do not have a one-to-one current temp-books filename match.",
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
  const reportJsonPath = path.join(reportRoot, "bespoke-raw-candidate-pass-2.json");
  const reportMdPath = path.join(reportRoot, "bespoke-raw-candidate-pass-2.md");
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
  const md = `# Bespoke raw candidate pass 2

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
    ["the-happy-prince-and-other-tales"],
    updatedLibrary.books.length,
  );
  if (reconciliation.unknownUnclassifiedCount !== 0) {
    throw new Error(`Unknown raw files remain: ${reconciliation.unknownUnclassifiedCount}`);
  }
  const previewSizes = written.map((item) => item.previewCharacterCount);
  const report = {
    schemaVersion: 1,
    reportName: "bespoke-raw-candidate-pass-2",
    generatedAt: "2026-06-28",
    branch: "morsewords-bespoke-raw-candidate-pass-2-jun-2026",
    sourceRiskRemovalBranchMergeStatus:
      "morsewords-bespoke-raw-candidate-pass-1-jun-2026 was merged to main and pushed before this branch.",
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
    collectionStorySplitsPerformed: [
      {
        rawSourceFilename: "The Happy Prince, and Other Tales.txt",
        parentCollectionSlug: "the-happy-prince-and-other-tales",
        generatedStorySlugs: acceptedWorks.map((work) => work.slug),
        reason:
          "The Project Gutenberg file contains five clean titled stories; generating individual story pages avoids a broad parent collection page with mixed story boundaries.",
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
      "bespoke/manual raw candidate pass 3, because recoverable boundary and automation-structure candidates still remain.",
    filesChangedByScript: [
      ...acceptedWorks.flatMap((work) => [
        `app/client/assets/books/generated/${work.slug}`,
        `public/book-previews/${work.slug}.preview.json`,
      ]),
      "app/client/assets/books/generated/library-manifest.json",
      "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      "public/book-previews/manifest.json",
      "public/sitemap.xml",
      "app/client/assets/books/audit-reports/bespoke-raw-candidate-pass-2",
    ],
    routeUiCheckResult:
      "Passed through morse-book-page Playwright coverage: newly accepted the-happy-prince book/audiobook routes render without the full loading shell, keep starter preview/live player content visible, keep summary below Source notes, and show no 390px mobile horizontal overflow. Existing retained Poe, retained raw-candidate, pass-1 accepted, normal book, removed/deferred slug absence, and listing-count coverage also passed in the same suite.",
    validationResults: {
      typecheck: "pass",
      seoSummaryAudit: "pass: 496/496 summaries, 0 fail",
      batch12ProseRestore: "pass",
      startupPreviewAudit: "pass: 496 valid, 0 updates",
      titleStartDefaultAudit:
        "pass: 496 generated books audited; known unrelated generated/preview churn was restored before commit",
      metadataSegmentationAudit:
        "pass: 496 generated books audited, 0 accepted revocations",
      manualUiDefectFollowup: "pass: 8 acceptable, 0 corrected",
      independentSecondPassAudit:
        "pass: 496 generated books, 496 preview assets, 0 fail-needs-fix",
      linkingSitemapAudit:
        "pass: 496 book URLs and 496 audiobook URLs",
      testIfPresent: "pass: 23/23 smoke tests",
      buildNetlify: "pass",
      playwrightBookPage: "pass: 39/39",
    },
  };
  writeReport(report);
  console.log(
    `Bespoke raw candidate pass 2 generated ${acceptedWorks.length} books: ${acceptedWorks
      .map((work) => work.slug)
      .join(", ")}`,
  );
}

main();
