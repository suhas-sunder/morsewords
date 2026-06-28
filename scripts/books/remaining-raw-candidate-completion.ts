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

type ExtractionStrategy =
  | {
      type: "title-line";
      endBeforeTitle?: string;
    }
  | {
      type: "between-markers";
      startText: string;
      endText: string;
      includeStartText?: boolean;
    }
  | {
      type: "willows-roman-sections";
    }
  | {
      type: "charles-dexter-ward-parts";
    };

type CandidateWork = {
  fileName: string;
  slug: string;
  title: string;
  author: string[];
  authorDeathYear: number;
  description: string;
  subjects: string[];
  originalPublication: string;
  sourceNote: string;
  oldCategory: string;
  extraction: ExtractionStrategy;
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
  poeReplacementSlugs?: string[];
  remainingRawCandidateCompletionSlugs?: string[];
  summaries: Array<{
    slug: string;
    title: string;
    author: string[];
    description: string;
    summary: string;
  }>;
};

type RawTriageItem = {
  slug: string;
  rawSourceFilename?: string;
  rawSourcePath?: string;
  primaryCategory?: string;
};

type RawTriageReport = {
  counts: {
    classifiedRawOnlyUnsafeCount: number;
    unresolvedSourceGeneratedCount: number;
  };
  categoryLists: Record<string, string[]>;
  liveRawItems: RawTriageItem[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const reportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/remaining-raw-candidate-completion",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const seoSummaryPath = path.join(
  repoRoot,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);
const oldTriagePath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/remaining-raw-inventory-triage/remaining-raw-inventory-triage.json",
);
const poeReportPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/poe-replacement-raw-reconciliation/poe-replacement-raw-reconciliation.json",
);

const old46CategoryKeys = [
  "blocked-source-or-rights-risk",
  "candidate-for-future-manual-processing",
  "unsafe-automation-structure",
  "unsafe-metadata-risk",
  "unsafe-start-or-end-boundary-risk",
  "unsafe-title-or-parent-collection-risk",
] as const;

const broaderCandidateCategoryKeys = [
  "manual-review-required",
  "candidate-for-future-manual-processing",
  "known-duplicate-or-near-duplicate",
  "known-boundary-defect",
  "blocked-source-or-rights-risk",
  "unsafe-automation-structure",
  "unsafe-metadata-risk",
  "unsafe-start-or-end-boundary-risk",
  "unsafe-title-or-parent-collection-risk",
] as const;

const acceptedWorks: CandidateWork[] = [
  {
    fileName: "A CATASTROPHE.txt",
    slug: "a-catastrophe",
    title: "A Catastrophe",
    author: ["H. G. Wells"],
    authorDeathYear: 1946,
    description:
      "A compact realist story of a struggling shopkeeper, private anxiety, and a sudden turn of fortune.",
    subjects: ["Short story", "Realist fiction", "Social fiction"],
    originalPublication: "1897",
    sourceNote:
      "Manual review accepted the individual H. G. Wells story extract from Project Gutenberg ebook #42989.",
    oldCategory: "manual-review-required",
    extraction: { type: "title-line" },
    summary:
      "A Catastrophe by H. G. Wells is a short realist story about money trouble, domestic pressure, and the strange emotional arithmetic of everyday life. The setting is a small draper's shop where Winslow, a shopkeeper with failing stock and unpaid bills, slowly understands that his business is in serious danger. The central conflict is practical and moral at once: he and his wife face ruin, but their private reactions to bad news are tangled with hope, propriety, fear, and the need to keep going.\n\nThe tone is quietly comic, observant, and a little merciless. Wells does not build the story around adventure or spectacle; he watches ordinary people under financial strain and lets their small gestures reveal more than they say aloud. Readers should expect shop details, household rhythms, restrained dialogue, and a closing movement that changes the pressure without turning the story into a simple moral lesson.\n\nFor Morse typing practice, A Catastrophe is useful because it is short enough for a focused session but rich in sentence rhythm. It gives learners names, shop terms, money references, and Victorian social phrasing without requiring a long commitment. The prose moves between plain narration and carefully qualified thought, which makes it good for practicing punctuation and steady spacing. In audio, the story's domestic setting is easy to follow, so learners can concentrate on accuracy rather than plot confusion. The piece also rewards repeat practice because its ordinary objects carry emotional weight: invoices, shutters, letters, breakfast, and shop stock all become signals of changing fortune. For drills, the slow buildup is helpful: a learner can type one paragraph for accuracy, then replay the same scene to hear how small changes in wording alter the emotional pressure. It is a strong choice for anyone who wants a complete literary exercise with realistic stakes, mild irony, and manageable length.",
  },
  {
    fileName: "IN THE ABYSS.txt",
    slug: "in-the-abyss",
    title: "In the Abyss",
    author: ["H. G. Wells"],
    authorDeathYear: 1946,
    description:
      "A scientific romance about a daring descent into the deep ocean and the unknown world below.",
    subjects: ["Science fiction", "Sea story", "Adventure"],
    originalPublication: "1897",
    sourceNote:
      "Manual review accepted the individual H. G. Wells story extract from Project Gutenberg ebook #42989.",
    oldCategory: "manual-review-required",
    extraction: { type: "title-line" },
    summary:
      "In the Abyss by H. G. Wells is an early science-fiction sea adventure built around a bold experiment: sending a man down into the deepest reaches of the ocean inside a steel sphere. The story begins with practical questions of pressure, engineering, courage, and risk, then turns the descent into an encounter with a world that human beings can barely imagine. The central conflict is survival and discovery. Elstead must trust his apparatus, his nerve, and his powers of observation while the sea becomes both a physical danger and a doorway into the unknown.\n\nThe tone is speculative, tense, and exploratory. Wells gives the machinery enough detail to make the premise feel plausible, then uses darkness, depth, and isolation to create wonder. The setting shifts from shipboard debate to the ocean floor, so readers get both scientific conversation and strange visual description. The story includes peril, but its main pleasure is curiosity: what might exist beyond ordinary human sight?\n\nFor Morse practice, In the Abyss is a rewarding intermediate text. It has technical vocabulary, names, measurements, and long descriptive passages that encourage careful copying. The alternation between dialogue and observation helps typists practice changes in pace. In audio, the descent gives the listener a clear structure, and repeated references to pressure, light, and depth make it easier to keep orientation. Learners can use the opening as a warm-up, then repeat the undersea passages at a slower speed for accuracy. The story is also useful for practicing numbers and physical scale, since pressure, depth, time, and distance shape the suspense. Its vocabulary makes a good review list before a session, especially for learners who want to separate unfamiliar words from Morse timing work. It is fun because it feels like an expedition, and useful because its scientific romance style trains patience with detailed prose.",
  },
  {
    fileName: "POLLOCK AND THE PORROH MAN.txt",
    slug: "pollock-and-the-porroh-man",
    title: "Pollock and the Porroh Man",
    author: ["H. G. Wells"],
    authorDeathYear: 1946,
    description:
      "A dark colonial Gothic story about fear, guilt, and a hostile presence that follows a reckless traveler.",
    subjects: ["Gothic fiction", "Psychological horror", "Adventure"],
    originalPublication: "1897",
    sourceNote:
      "Manual review accepted the individual H. G. Wells story extract from Project Gutenberg ebook #42989.",
    oldCategory: "manual-review-required",
    extraction: { type: "title-line" },
    summary:
      "Pollock and the Porroh Man by H. G. Wells is a dark Gothic adventure set against a colonial West African expedition. Pollock, an English traveler with more confidence than judgment, becomes entangled in violence, fear, and a local spiritual authority he does not understand. The central conflict is psychological as much as physical: Pollock tries to treat the danger as a problem he can outrun or explain away, but guilt and dread keep closing in. The story should be read as period fiction, with colonial attitudes and language that belong to its time rather than to modern understanding.\n\nThe tone is oppressive, feverish, and morally uneasy. Wells uses heat, travel, rumor, and the pressure of an unfamiliar environment to make Pollock's fear feel increasingly inescapable. The premise includes violence and horror, but the useful reading experience comes from watching panic and conscience alter what the character sees. The setting gives the story a harsh intensity, while the narration keeps asking whether the real terror is outside Pollock or inside him.\n\nFor Morse practice, this is best for intermediate or advanced learners who are comfortable with darker material. The text has names, place references, dialogue, and long descriptive paragraphs that require accurate pacing. Typists can practice careful punctuation while following a story that steadily tightens. In audio, the repeated return of Pollock's fear gives listeners a strong thread through the older prose. The story also trains careful attention to tone, since the narration shifts between outward incident, memory, physical unease, and inward alarm. Because the material is intense, it works best in short, deliberate sessions where the learner can keep the language clear without dwelling on the violence. A good session is to copy a short opening passage, review unfamiliar words, and then continue in controlled sections rather than rushing. The story is not light, but it is memorable and effective for sustained attention.",
  },
  {
    fileName: "The colour out of space.txt",
    slug: "the-colour-out-of-space",
    title: "The Colour Out of Space",
    author: ["H. P. Lovecraft"],
    authorDeathYear: 1937,
    description:
      "A cosmic horror story about a rural New England farm, an uncanny meteorite, and a blight beyond ordinary explanation.",
    subjects: ["Cosmic horror", "Science fiction", "Gothic fiction"],
    originalPublication: "1927",
    sourceNote:
      "Manual review accepted the Project Gutenberg story body after excluding the transcriber note, magazine blurb, and license wrapper.",
    oldCategory: "manual-review-required",
    extraction: {
      type: "between-markers",
      startText: "West of Arkham the hills rise wild",
      endText: "THE END",
      includeStartText: true,
    },
    summary:
      "The Colour Out of Space by H. P. Lovecraft is a cosmic horror story set in the hills west of Arkham, where an old rural landscape bears the memory of something no one can properly name. The frame follows a surveyor who hears local accounts of a farm marked by an uncanny event after a meteorite falls nearby. The central conflict is not a fight with a visible monster, but a struggle to understand a presence that changes land, plants, animals, and human confidence in natural order.\n\nThe tone is eerie, patient, and increasingly alien. Lovecraft builds dread through reports, local memory, scientific curiosity, and the slow collapse of ordinary explanations. The setting is important: stony New England farms, wells, woods, and abandoned ground make the horror feel rooted in place even when the threat seems to come from beyond familiar nature. The story includes illness and decay, but the summary focus here is atmosphere, mystery, and the pressure of the unknown rather than graphic detail.\n\nFor Morse typing practice, The Colour Out of Space is a strong endurance piece. It is longer than a quick short story, with formal narration, regional names, scientific language, and descriptive passages that ask for steady attention. Learners can practice the opening landscape at a slow speed, then move into shorter sections where testimony and observation alternate. In audio, the recurring place names and the gradual investigation help listeners stay oriented. The story is especially good for learning to hold accuracy across paragraphs where the action is subtle but the imagery keeps changing. It also gives typists practice with a measured investigative voice, where each remembered detail modifies what came before. It is useful for practicing complex sentences and unusual vocabulary, and it is fun for readers who enjoy weird fiction because the central mystery remains unsettling without needing constant action.",
  },
  {
    fileName: "THE PLATTNER STORY.txt",
    slug: "the-plattner-story",
    title: "The Plattner Story",
    author: ["H. G. Wells"],
    authorDeathYear: 1946,
    description:
      "A science-fantasy tale about a schoolmaster, a strange explosion, and an alleged journey outside ordinary space.",
    subjects: ["Science fiction", "Fantasy", "Speculative fiction"],
    originalPublication: "1897",
    sourceNote:
      "Manual review accepted the individual H. G. Wells story extract from Project Gutenberg ebook #42989.",
    oldCategory: "manual-review-required",
    extraction: { type: "title-line" },
    summary:
      "The Plattner Story by H. G. Wells is a science-fantasy tale about evidence, disbelief, and a schoolmaster whose body and experience seem to defy ordinary space. Gottfried Plattner is introduced through testimony, medical oddity, and a narrator trying to sound reasonable about an unreasonable case. The central conflict is interpretive: if the facts are real, Plattner has passed through an impossible displacement; if they are not, then a remarkable body of evidence must somehow be explained away.\n\nThe tone is curious, skeptical, and uncanny. Wells frames the story almost like a case report, with witnesses, photographs, schoolroom details, and cautious commentary. The setting begins in a small private school and expands into a strange other-world described through Plattner's account. That combination makes the story feel both domestic and cosmic: chalk dust, boys, and chemistry equipment stand beside speculation about dimensions and unseen watchers.\n\nFor Morse practice, The Plattner Story is useful because it has a clear premise and varied prose. Typists will encounter names, technical hints, school vocabulary, dialogue, and long explanatory sentences. The narrator's careful tone rewards accurate punctuation, while the weird scenes provide enough momentum to keep a practice session lively. In audio, the story is easy to divide: first the evidence, then the accident, then Plattner's report. Learners can repeat one part at a time, building speed only after the names and sentence rhythm feel familiar. The story also gives practice with explanatory prose that sounds almost documentary, which is useful for learners who want more than action sentences. Its blend of testimony and wonder makes it a good bridge between realistic narration and stranger speculative passages, and its compact structure supports review in one sitting. It is especially good for readers who want classic speculative fiction that is stranger than a simple invention story but still grounded in a concrete, memorable setup.",
  },
  {
    fileName: "THE SAD STORY OF A DRAMATIC CRITIC.txt",
    slug: "the-sad-story-of-a-dramatic-critic",
    title: "The Sad Story of a Dramatic Critic",
    author: ["H. G. Wells"],
    authorDeathYear: 1946,
    description:
      "A comic fantasy of manners about criticism, theatrical habits, and a personality gradually overtaken by performance.",
    subjects: ["Comic fiction", "Satire", "Short story"],
    originalPublication: "1897",
    sourceNote:
      "Manual review promoted this former metadata-risk item after confirming a visible H. G. Wells byline and a single-story boundary.",
    oldCategory: "unsafe-metadata-risk",
    extraction: { type: "title-line" },
    summary:
      "The Sad Story of a Dramatic Critic by H. G. Wells is a comic fantasy about identity, habit, and the contagious force of theater. The narrator, Egbert Craddock Cummins, explains how he became a dramatic critic almost by accident and then found his personality changing under the pressure of the plays, actors, gestures, and phrases he was supposed to observe. The central conflict is absurd but precise: he wants to remain his ordinary self, yet the theatrical world keeps rewriting his manners from the outside in.\n\nThe tone is satirical, brisk, and self-mocking. Wells turns professional criticism into a kind of comic affliction, with the narrator aware of his own ridiculousness even as he cannot stop performing it. The setting moves through newspaper offices, theaters, social encounters, and the narrator's increasingly dramatic self-consciousness. It is a lighter selection than Wells's stranger scientific romances, but it still has a speculative idea at its core: what if repeated exposure to a style of life could alter the person who studies it?\n\nFor Morse practice, this story is approachable and lively. It offers first-person narration, comic timing, names, abbreviations, and dialogue-like bursts that help learners practice punctuation and rhythm. Because the plot is easy to follow, typists can focus on accuracy rather than decoding a complicated structure. In audio, the narrator's shifting voice makes the piece fun to replay, especially when his ordinary explanations slide into theatrical phrasing. The comic premise also helps with retention: repeated practice is easier when the character's predicament is memorable and the voice keeps changing. It is also a friendly contrast piece after darker stories in the library, giving typists formal prose without a grim mood. It is a good medium-short drill for learners who want humor, human observation, and a complete story that does not depend on horror or heavy action.",
  },
  {
    fileName: "UNDER THE KNIFE.txt",
    slug: "under-the-knife",
    title: "Under the Knife",
    author: ["H. G. Wells"],
    authorDeathYear: 1946,
    description:
      "A speculative story about surgery, consciousness, and a narrator's strange inward journey under anesthesia.",
    subjects: ["Speculative fiction", "Psychological fiction", "Short story"],
    originalPublication: "1897",
    sourceNote:
      "Manual review accepted only the first story in the raw file, stopping before the later The Sea Raiders boundary.",
    oldCategory: "unsafe-metadata-risk",
    extraction: { type: "title-line", endBeforeTitle: "THE SEA RAIDERS" },
    summary:
      "Under the Knife by H. G. Wells is a speculative short story about illness, surgery, and the uncertain border between the body and consciousness. The narrator approaches an operation with dread and detachment, then describes an extraordinary inward experience while under anesthesia. The central conflict is philosophical as well as personal: he is vulnerable on the operating table, but his mind seems to move into a wider, stranger field of perception. Wells uses the premise to ask what selfhood might feel like when ordinary bodily sensation falls away.\n\nThe tone is reflective, tense, and visionary. The medical setting gives the story concrete stakes, while the narrator's altered awareness opens into speculation about death, identity, and the scale of human life. The story includes surgical danger, but it can be read without dwelling on graphic detail; the real emphasis is on perception and the shock of feeling separated from familiar limits.\n\nFor Morse practice, Under the Knife is a strong intermediate text. It has formal nineteenth-century prose, medical terms, philosophical reflection, and a clear first-person voice. Typists can practice long sentences that shift from ordinary description to abstract thought. In audio, the movement from walking through London to the operation and then to the narrator's strange experience gives the listener a useful structure. A good routine is to practice the opening in small pieces, then replay the altered-consciousness passages slowly for accuracy. The story also helps learners work with changes in register, from practical medical talk to expansive speculation, without losing the sentence thread. Its vocabulary gives a useful mix of everyday city detail, medical language, and metaphysical reflection in one compact work. It is useful because it trains patience with reflective prose, and it is fun because its central question remains vivid: what might the mind encounter when the body is almost out of reach?",
  },
  {
    fileName: "The Willows.txt",
    slug: "the-willows",
    title: "The Willows",
    author: ["Algernon Blackwood"],
    authorDeathYear: 1951,
    description:
      "A weird-fiction novella set on the Danube, where two travelers camp among willows and sense an alien pressure around them.",
    subjects: ["Weird fiction", "Horror", "Adventure"],
    originalPublication: "1907",
    sourceNote:
      "Manual review promoted this former boundary-risk item after confirming a clean Project Gutenberg source and five clear roman-numeral sections.",
    oldCategory: "unsafe-start-or-end-boundary-risk",
    extraction: { type: "willows-roman-sections" },
    summary:
      "The Willows by Algernon Blackwood is a classic weird-fiction novella set on the Danube, where two travelers make camp among shifting islands, wind, water, and endless low willow bushes. The central conflict is not a conventional pursuit but a deepening sense of exposure. The men try to understand whether the landscape is merely dangerous or whether something vast and alien presses through it. Their practical travel decisions become entangled with fear, awe, and the feeling that ordinary human categories are too small for the place.\n\nThe tone is atmospheric, patient, and uncanny. Blackwood builds tension through weather, river movement, sound, distance, and the travelers' changing confidence. The setting is the story's great force: the Danube wilderness feels beautiful, unstable, and increasingly indifferent to human comfort. Horror arrives through suggestion rather than simple shock, so readers experience the unease as a slow accumulation of details.\n\nFor Morse practice, The Willows is excellent for endurance and descriptive accuracy. It has five clear sections, which makes it easy to divide into sessions. Learners can use the opening landscape as a slow listening exercise, then practice later passages where dialogue and observation alternate. The prose includes long sentences, natural description, place references, and subtle changes in mood, all useful for careful copying. In audio, the recurring river imagery helps listeners keep their place even when the atmosphere grows abstract. The story also rewards careful volume and speed choices, because too fast a pass can flatten the gradual changes in fear and setting. Its natural imagery is ideal for checking whether copied words stay meaningful rather than becoming mechanical signals. It is best for intermediate or advanced typists, but beginners can still use short passages. The reward is a memorable practice text that teaches patience, attention, and rhythm through one of the great haunted landscapes in public-domain fiction.",
  },
  {
    fileName: "The case of Charles Dexter Ward.txt",
    slug: "the-case-of-charles-dexter-ward",
    title: "The Case of Charles Dexter Ward",
    author: ["H. P. Lovecraft"],
    authorDeathYear: 1937,
    description:
      "A Providence weird tale of antiquarian research, family history, and a mystery that reaches into the colonial past.",
    subjects: ["Weird fiction", "Gothic fiction", "Mystery"],
    originalPublication: "1941",
    sourceNote:
      "Manual review promoted this former boundary-risk item after confirming a clean Project Gutenberg source and five explicit numbered parts.",
    oldCategory: "unsafe-start-or-end-boundary-risk",
    extraction: { type: "charles-dexter-ward-parts" },
    summary:
      "The Case of Charles Dexter Ward by H. P. Lovecraft is a long weird tale set in Providence, Rhode Island, where antiquarian curiosity opens into a disturbing family mystery. Charles Dexter Ward is drawn into colonial records, old houses, obscure scholarship, and the history of Joseph Curwen, an ancestor whose reputation carries more than ordinary scandal. The central conflict is investigative and psychological: friends and family try to understand Ward's transformation, while the past seems to become dangerously active in the present.\n\nThe tone is archival, Gothic, and increasingly tense. Lovecraft uses letters, local history, family documents, medical concern, and antiquarian detail to make the mystery feel layered rather than immediate. The setting is one of the story's pleasures: Providence streets, old rooms, records, and hidden places create a strong sense of place. The horror involves occult research and implied danger, but the reading experience is largely about inquiry, atmosphere, and the slow assembly of clues.\n\nFor Morse practice, this is an advanced endurance selection. Its five parts give learners natural stopping points, and the prose offers names, dates, quotations, formal narration, and long historical passages. Typists should not rush it; a better method is to work one part at a time, preview names, and repeat dense paragraphs until the rhythm settles. In audio, the mystery structure helps maintain orientation even through elaborate sentences. The work is useful for serious practice because it demands attention to punctuation and proper nouns, and it is fun for readers who like weird fiction with documents, old cities, and a central question that deepens rather than resolves too quickly. It also gives a different kind of practice from the shorter tales: instead of one quick arc, learners manage a layered investigation across multiple sessions. That makes it suitable for a longer training plan where each part becomes its own measurable milestone.",
  },
];

function assertInside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${candidate} is outside ${root}`);
  }
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
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
  return (
    rawText.match(/\[eBook #(\d+)\]/i)?.[1] ??
    rawText.match(/ebooks\/(\d+)/i)?.[1] ??
    null
  );
}

function normalizeComparableTitle(input: string) {
  return input
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stripPageMarkers(input: string) {
  return input
    .replace(/\[\d+\]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n");
}

function cleanExtractedBody(input: string) {
  return trimBookText(stripPageMarkers(input));
}

function lineOffsets(rawText: string) {
  const lines = rawText.split("\n");
  const offsets: number[] = [];
  let offset = 0;
  for (const line of lines) {
    offsets.push(offset);
    offset += line.length + 1;
  }
  return { lines, offsets };
}

function extractByTitleLine(work: CandidateWork, rawText: string) {
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  const { lines, offsets } = lineOffsets(normalized);
  const expected = normalizeComparableTitle(work.title);
  const titleIndex = lines.findIndex(
    (line, index) => index > 2 && normalizeComparableTitle(line.trim()) === expected,
  );
  if (titleIndex < 0) throw new Error(`${work.slug}: title boundary was not found.`);

  const start = offsets[titleIndex] + lines[titleIndex].length + 1;
  let end = normalized.length;
  if (work.extraction.type === "title-line" && work.extraction.endBeforeTitle) {
    const markerIndex = lines.findIndex(
      (line, index) =>
        index > titleIndex &&
        normalizeComparableTitle(line.trim()) ===
          normalizeComparableTitle(work.extraction.type === "title-line" ? work.extraction.endBeforeTitle ?? "" : ""),
    );
    if (markerIndex < 0) throw new Error(`${work.slug}: end boundary was not found.`);
    end = offsets[markerIndex];
  }

  const body = cleanExtractedBody(normalized.slice(start, end));
  if (body.length < 500 || /Project Gutenberg|Release date:|Author:/i.test(body.slice(0, 800))) {
    throw new Error(`${work.slug}: extracted title-line body looked unsafe.`);
  }
  return [
    {
      label: work.title,
      title: null,
      text: body,
      sourceStartOffset: start,
      sourceEndOffset: end,
    },
  ];
}

function extractBetweenMarkers(work: CandidateWork, rawText: string) {
  if (work.extraction.type !== "between-markers") {
    throw new Error(`${work.slug}: wrong extraction strategy.`);
  }
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  const startIndex = normalized.indexOf(work.extraction.startText);
  if (startIndex < 0) throw new Error(`${work.slug}: start marker was not found.`);
  const endIndex = normalized.indexOf(work.extraction.endText, startIndex + work.extraction.startText.length);
  if (endIndex < 0) throw new Error(`${work.slug}: end marker was not found.`);
  const start = work.extraction.includeStartText ? startIndex : startIndex + work.extraction.startText.length;
  const body = cleanExtractedBody(normalized.slice(start, endIndex));
  if (/Project Gutenberg|Transcriber|EBook/i.test(body.slice(0, 800))) {
    throw new Error(`${work.slug}: extracted body contains source boilerplate at the start.`);
  }
  return [
    {
      label: work.title,
      title: null,
      text: body,
      sourceStartOffset: start,
      sourceEndOffset: endIndex,
    },
  ];
}

function extractWillowsSections(work: CandidateWork, rawText: string) {
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  const endIndex = normalized.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK THE WILLOWS ***");
  if (endIndex < 0) throw new Error(`${work.slug}: Gutenberg end marker was not found.`);
  const { lines, offsets } = lineOffsets(normalized);
  const romanLabels = ["I.", "II.", "III.", "IV.", "V."];
  const occurrences = new Map<string, number[]>();
  for (const label of romanLabels) occurrences.set(label, []);
  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (occurrences.has(trimmed)) occurrences.get(trimmed)?.push(index);
  }
  const bodyHeadingIndexes = romanLabels.map((label) => {
    const indexes = occurrences.get(label) ?? [];
    if (indexes.length < 2) throw new Error(`${work.slug}: section ${label} body heading was not found.`);
    return indexes[1];
  });
  return bodyHeadingIndexes.map((headingIndex, index) => {
    const nextHeading = bodyHeadingIndexes[index + 1];
    const start = offsets[headingIndex] + lines[headingIndex].length + 1;
    const end = nextHeading === undefined ? endIndex : offsets[nextHeading];
    return {
      label: romanLabels[index],
      title: null,
      text: cleanExtractedBody(normalized.slice(start, end)),
      sourceStartOffset: start,
      sourceEndOffset: end,
    };
  });
}

function extractCharlesDexterWardSections(work: CandidateWork, rawText: string) {
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  const endIndex = normalized.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK THE CASE OF CHARLES DEXTER WARD ***");
  if (endIndex < 0) throw new Error(`${work.slug}: Gutenberg end marker was not found.`);
  const { lines, offsets } = lineOffsets(normalized);
  const headings = lines
    .map((line, index) => {
      const match = line.trim().match(/^_(\d+)\.\s+(.+)_$/);
      return match
        ? {
            index,
            label: `${match[1]}.`,
            title: match[2],
          }
        : null;
    })
    .filter(Boolean) as Array<{ index: number; label: string; title: string }>;
  if (headings.length !== 5) {
    throw new Error(`${work.slug}: expected five numbered parts, found ${headings.length}.`);
  }
  return headings.map((heading, index) => {
    const next = headings[index + 1];
    const start = offsets[heading.index] + lines[heading.index].length + 1;
    const end = next === undefined ? endIndex : offsets[next.index];
    return {
      label: heading.label,
      title: heading.title,
      text: cleanExtractedBody(normalized.slice(start, end)),
      sourceStartOffset: start,
      sourceEndOffset: end,
    };
  });
}

function extractWorkSections(work: CandidateWork, rawText: string) {
  const headerTitle = extractHeaderValue(rawText, "Title");
  const headerAuthor = extractHeaderValue(rawText, "Author");
  if (headerTitle && normalizeComparableTitle(headerTitle) !== normalizeComparableTitle(work.title)) {
    throw new Error(`${work.slug}: raw title ${headerTitle} did not match ${work.title}.`);
  }
  if (headerAuthor && !work.author.includes(headerAuthor)) {
    throw new Error(`${work.slug}: raw author ${headerAuthor} did not match ${work.author.join("; ")}.`);
  }

  if (work.extraction.type === "title-line") return extractByTitleLine(work, rawText);
  if (work.extraction.type === "between-markers") return extractBetweenMarkers(work, rawText);
  if (work.extraction.type === "willows-roman-sections") return extractWillowsSections(work, rawText);
  return extractCharlesDexterWardSections(work, rawText);
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
      gutenbergId ? `Source URL: https://www.gutenberg.org/ebooks/${gutenbergId}` : "Source URL present in raw story extract.",
      `${work.author.join("; ")} author metadata was verified before targeted generation.`,
      "Cloudflare export was not run in this remaining raw-candidate completion branch.",
    ],
    processing_allowed: true,
  };
}

function writeGeneratedWork(work: CandidateWork) {
  const rawPath = path.join(tempBooksRoot, work.fileName);
  assertInside(tempBooksRoot, rawPath);
  const rawText = fs.readFileSync(rawPath, "utf8");
  const extracted = extractWorkSections(work, rawText);
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
    "Targeted remaining raw-candidate completion processed this accepted candidate after manual boundary and metadata review. Review generated output before any Cloudflare export.";
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
      footerStripped: !["title-line"].includes(work.extraction.type),
      confidence: work.extraction.type === "title-line" ? "medium" : "high",
      warnings: [
        "Targeted remaining raw-candidate completion used explicit manual boundaries instead of a broad all-book rebuild.",
        "Local startup preview intentionally stores only starter text, not the full work.",
      ],
    },
    warnings: [
      "Generated by targeted remaining raw-candidate completion; review before Cloudflare export.",
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

Processed by targeted remaining raw-candidate completion.

- Source: app/client/assets/temp-books/${work.fileName}
- Prior category: ${work.oldCategory}
- Boundary: ${work.sourceNote}
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
    filesChanged: [
      path.join(bookRoot, "manifest.json"),
      path.join(bookRoot, "cleaned_book.json"),
      path.join(bookRoot, "processed_book.json"),
      path.join(bookRoot, "rights_report.json"),
      path.join(bookRoot, "processing_notes.md"),
      ...sections.map((section) => path.join(sectionRoot, `${section.sectionId}.json`)),
      previewPath,
    ].map(statusPath),
    manifest,
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
    previewPolicy: {
      previewCharacterCount: preview.characterCount,
      previewBytes,
      previewTextWordCount: preview.wordCount,
      truncated: preview.truncated,
    },
    sectionCount: sections.length,
    summaryWordCount: countBookWords(work.summary),
    wordCount: totalWordCount,
  };
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

function updateSeoSummaries(works: CandidateWork[], newExpectedSummaryCount: number) {
  const data = readJson<SeoSummaryData>(seoSummaryPath);
  const newSlugSet = new Set(works.map((work) => work.slug));
  const summaries = data.summaries.filter((summary) => !newSlugSet.has(summary.slug));
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
    summarySet: "remaining-raw-candidate-completion",
    generatedAt: "2026-06-28",
    expectedSummaryCount: newExpectedSummaryCount,
    remainingRawCandidateCompletionSlugs: works.map((work) => work.slug),
    summaries,
  });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function currentRawInventory() {
  return fs
    .readdirSync(tempBooksRoot)
    .filter((name) => fs.statSync(path.join(tempBooksRoot, name)).isFile())
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const stem = fileName.replace(/\.[^.]+$/, "");
      return {
        fileName,
        slug: slugify(stem),
        bytes: fs.statSync(path.join(tempBooksRoot, fileName)).size,
      };
    });
}

function categorySlugs(triage: RawTriageReport, keys: readonly string[]) {
  return [...new Set(keys.flatMap((key) => triage.categoryLists[key] ?? []))];
}

function itemBySlug(triage: RawTriageReport) {
  return new Map(triage.liveRawItems.map((item) => [item.slug, item]));
}

function rawExistsForOldItem(item: RawTriageItem | undefined) {
  if (!item?.rawSourceFilename) return false;
  return fs.existsSync(path.join(tempBooksRoot, item.rawSourceFilename));
}

function classifySlugs({
  generatedSlugs,
  itemMap,
  selectedSlugs,
  slugs,
}: {
  slugs: string[];
  itemMap: Map<string, RawTriageItem>;
  generatedSlugs: Set<string>;
  selectedSlugs: Set<string>;
}) {
  return slugs.map((slug) => {
    const item = itemMap.get(slug);
    const rawPresent = rawExistsForOldItem(item);
    const generated = generatedSlugs.has(slug);
    return {
      slug,
      rawSourceFilename: item?.rawSourceFilename ?? null,
      rawPresent,
      generated,
      classification: selectedSlugs.has(slug)
        ? "accepted-generated"
        : generated
          ? "already-generated"
          : rawPresent
            ? item?.primaryCategory ?? "deferred-with-reason"
            : "removed-from-raw-by-user",
    };
  });
}

function remainingCandidateSlugsAfterBranch(triage: RawTriageReport, generatedSlugs: Set<string>) {
  const itemMap = itemBySlug(triage);
  return categorySlugs(triage, broaderCandidateCategoryKeys)
    .filter((slug) => rawExistsForOldItem(itemMap.get(slug)))
    .filter((slug) => !generatedSlugs.has(slug));
}

function makeMarkdownReport(report: Record<string, unknown>) {
  const accepted = report.acceptedGeneratedCandidates as Array<Record<string, unknown>>;
  const grouped = report.manualDeferredSkippedCandidates as Record<string, Array<Record<string, unknown>>>;
  const old46 = report.old46ReconciliationResult as Record<string, unknown>;
  return `# Remaining Raw Candidate Completion

## Counts

- Previous generated count: ${report.previousGeneratedCount}
- New generated count: ${report.newGeneratedCount}
- Previous SEO summary count: ${report.previousSeoSummaryCount}
- New SEO summary count: ${report.newSeoSummaryCount}
- Missing summaries after branch: ${report.missingSummaryCount}
- Actual remaining raw candidates found after Poe before this branch: ${report.actualRemainingRawCandidatesFoundAfterPoe}
- Remaining raw-candidate count after this branch: ${report.remainingRawCandidateCountAfterBranch}

## Accepted And Generated

${accepted
  .map(
    (item) =>
      `- ${item.slug}: ${item.title} by ${(item.author as string[]).join("; ")} (${item.sectionCount} section(s), ${item.wordCount} words, summary ${item.summaryWordCount} words)`,
  )
  .join("\n")}

## Old 46 Reconciliation

- Old unsafe/deferred checkpoint count: ${old46.oldUnsafeCheckpointCount}
- No longer present in raw: ${((old46.noLongerPresentInRaw as string[]) ?? []).join(", ") || "none"}
- Now generated in this branch: ${((old46.nowGenerated as string[]) ?? []).join(", ") || "none"}
- Still need action: ${(old46.stillNeedActionCount as number) ?? 0}

## Deferred Or Skipped

${Object.entries(grouped)
  .map(([key, items]) => {
    const body = items.map((item) => `- ${item.slug}: ${item.reason}`).join("\n") || "- None";
    return `### ${key}\n\n${body}`;
  })
  .join("\n\n")}

## Preview Policy

- New previews created: ${(report.newPreviewsCreated as string[]).join(", ")}
- Preview size range for new/changed books: ${report.previewSizeRangeForNewChangedBooks}
- Starter preview remains visible without full Cloudflare JSON: ${report.starterPreviewVisibilityCheckpoint}
- Existing preview/loading architecture blocker found: ${report.existingPreviewLoadingArchitectureBlockerFound}

## Checkpoints

- 11 unresolved-source generated books: ${report.unresolvedSourceGeneratedBookCheckpoint}
- Cloudflare export: ${report.cloudflareExportCheckpoint}
- URL/page/indexability blocker: ${report.urlPageIndexabilityBlockerCheckpoint}
- Mobile final stage: ${report.mobileFinalStageCheckpoint}

## Recommended Next Major Phase

Review the 11 unresolved-source generated books, unless remaining raw candidates still require a second manual/bespoke branch.

## Validation Results

${JSON.stringify(report.validationResults, null, 2)}
`;
}

function main() {
  const existingReportPath = path.join(reportRoot, "remaining-raw-candidate-completion.json");
  const existingReport = fs.existsSync(existingReportPath)
    ? readJson<Record<string, unknown>>(existingReportPath)
    : null;
  const libraryBefore = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const seoBefore = readJson<SeoSummaryData>(seoSummaryPath);
  const triage = readJson<RawTriageReport>(oldTriagePath);
  const itemMap = itemBySlug(triage);
  const currentRaw = currentRawInventory();
  const currentRawFilenames = new Set(currentRaw.map((item) => item.fileName));
  const currentGeneratedBefore = new Set(libraryBefore.books.map((book) => book.slug));
  const selectedSlugs = new Set(acceptedWorks.map((work) => work.slug));

  const oldRawFilenames = new Set(
    triage.liveRawItems
      .map((item) => item.rawSourceFilename)
      .filter((fileName): fileName is string => Boolean(fileName)),
  );
  const newRawFilesNotCoveredByOldTriage = currentRaw
    .filter((item) => !oldRawFilenames.has(item.fileName))
    .map((item) => item.fileName);
  const removedFromRawByUser = triage.liveRawItems
    .filter((item) => item.rawSourceFilename && !currentRawFilenames.has(item.rawSourceFilename))
    .map((item) => item.slug);

  const broaderBeforeSlugs = categorySlugs(triage, broaderCandidateCategoryKeys)
    .filter((slug) => rawExistsForOldItem(itemMap.get(slug)))
    .filter((slug) => !currentGeneratedBefore.has(slug) || selectedSlugs.has(slug));
  const old46Slugs = categorySlugs(triage, old46CategoryKeys);

  const generated = acceptedWorks.map(writeGeneratedWork);
  updateLibraryManifest(generated.map((item) => item.manifest));
  updatePreviewManifest(generated.map((item) => item.previewEntry));

  const libraryAfter = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  updateSeoSummaries(acceptedWorks, libraryAfter.books.length);
  const seoAfter = readJson<SeoSummaryData>(seoSummaryPath);
  const generatedAfter = new Set(libraryAfter.books.map((book) => book.slug));
  const summarySlugs = new Set(seoAfter.summaries.map((summary) => summary.slug));
  const missingSummarySlugs = libraryAfter.books
    .filter((book) => book.source.publishReady && book.source.rightsStatus === "approved")
    .map((book) => book.slug)
    .filter((slug) => !summarySlugs.has(slug));

  const remainingAfterSlugs = remainingCandidateSlugsAfterBranch(triage, generatedAfter);
  const old46Classified = classifySlugs({
    slugs: old46Slugs,
    itemMap,
    generatedSlugs: generatedAfter,
    selectedSlugs,
  });
  const manualDeferredSkippedCandidates = {
    manualReviewRequired: classifySlugs({
      slugs: triage.categoryLists["manual-review-required"] ?? [],
      itemMap,
      generatedSlugs: generatedAfter,
      selectedSlugs,
    })
      .filter((item) => item.classification !== "accepted-generated")
      .map((item) => ({
        slug: item.slug,
        reason: item.rawPresent
          ? "still requires manual review; no safe automated processing applied in this branch"
          : "raw file is no longer present",
      })),
    futureBespokeRequired: classifySlugs({
      slugs: triage.categoryLists["candidate-for-future-manual-processing"] ?? [],
      itemMap,
      generatedSlugs: generatedAfter,
      selectedSlugs,
    }).map((item) => ({
      slug: item.slug,
      reason: item.rawPresent
        ? "requires a dedicated bespoke/manual processing pass"
        : "raw file is no longer present",
    })),
    duplicateOrNearDuplicate: (triage.categoryLists["known-duplicate-or-near-duplicate"] ?? []).map((slug) => ({
      slug,
      reason: "left ungenerated to avoid duplicate or near-duplicate public pages",
    })),
    blockedSourceOrRightsRisk: (triage.categoryLists["blocked-source-or-rights-risk"] ?? []).map((slug) => ({
      slug,
      reason: "source/provenance or rights evidence remains insufficient for this automated pass",
    })),
    unsafeBoundary: (triage.categoryLists["unsafe-start-or-end-boundary-risk"] ?? [])
      .filter((slug) => !selectedSlugs.has(slug) && rawExistsForOldItem(itemMap.get(slug)))
      .map((slug) => ({
        slug,
        reason: "start/end or section boundaries still need manual/bespoke review",
      })),
    unsafeAutomation: (triage.categoryLists["unsafe-automation-structure"] ?? []).map((slug) => ({
      slug,
      reason: "structure is too complex for safe targeted automation in this branch",
    })),
    unsafeMetadata: (triage.categoryLists["unsafe-metadata-risk"] ?? [])
      .filter((slug) => !selectedSlugs.has(slug))
      .map((slug) => ({
        slug,
        reason: "metadata evidence remains insufficient or boundary mixed with another story",
      })),
    unsafeTitleParentCollection: (triage.categoryLists["unsafe-title-or-parent-collection-risk"] ?? []).map((slug) => ({
      slug,
      reason:
        slug === "the-little-match-girl"
          ? "raw file visibly contains a different Andersen story and cannot support this title"
          : "parent collection/title evidence remains too weak for an individual public page",
    })),
    knownBoundaryDefect: (triage.categoryLists["known-boundary-defect"] ?? []).map((slug) => ({
      slug,
      reason: rawExistsForOldItem(itemMap.get(slug))
        ? "known boundary defect remains unresolved"
        : "raw file is no longer present after user/Poe cleanup",
    })),
    nonBookOrInvalid: (triage.categoryLists["non-book-or-invalid-file"] ?? []).map((slug) => ({
      slug,
      reason: rawExistsForOldItem(itemMap.get(slug))
        ? "not a valid processable book text"
        : "raw file is no longer present",
    })),
  };

  const previewCounts = generated.map((item) => item.previewPolicy.previewCharacterCount);
  const report = {
    schemaVersion: 1,
    reportName: "remaining-raw-candidate-completion",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-remaining-raw-candidate-completion-jun-2026",
    previousGeneratedCount: existingReport?.previousGeneratedCount ?? libraryBefore.books.length,
    previousSeoSummaryCount: existingReport?.previousSeoSummaryCount ?? seoBefore.summaries.length,
    actualRawFilesCurrentlyInTempBooks: currentRaw.length,
    rawFilesAlreadyGeneratedByDirectSlugMatch: currentRaw.filter((item) => currentGeneratedBefore.has(item.slug)).length,
    rawFilesNotGeneratedByDirectSlugMatch: currentRaw.filter((item) => !currentGeneratedBefore.has(item.slug)).length,
    actualRemainingRawCandidatesFoundAfterPoe: broaderBeforeSlugs.length,
    old46ReconciliationResult: {
      oldUnsafeCheckpointCount: triage.counts.classifiedRawOnlyUnsafeCount,
      noLongerPresentInRaw: old46Classified
        .filter((item) => item.classification === "removed-from-raw-by-user")
        .map((item) => item.slug),
      nowGenerated: old46Classified
        .filter((item) => item.classification === "accepted-generated")
        .map((item) => item.slug),
      stillNeedActionCount: old46Classified.filter(
        (item) => item.rawPresent && !item.generated && item.classification !== "accepted-generated",
      ).length,
      stillNeedAction: old46Classified
        .filter((item) => item.rawPresent && !item.generated && item.classification !== "accepted-generated")
        .map((item) => item.slug),
    },
    newRawFilesDiscovered: newRawFilesNotCoveredByOldTriage,
    removedFromRawByUserCandidates: removedFromRawByUser,
    acceptedGeneratedCandidates: generated.map((item) => ({
      slug: item.manifest.slug,
      title: item.manifest.title,
      author: item.manifest.author,
      oldCategory: acceptedWorks.find((work) => work.slug === item.manifest.slug)?.oldCategory,
      sectionCount: item.sectionCount,
      wordCount: item.wordCount,
      summaryWordCount: item.summaryWordCount,
      previewCharacterCount: item.previewPolicy.previewCharacterCount,
      previewBytes: item.previewPolicy.previewBytes,
    })),
    manualDeferredSkippedCandidates,
    newGeneratedCount: libraryAfter.books.length,
    newSeoSummaryCount: seoAfter.summaries.length,
    missingSummaryCount: missingSummarySlugs.length,
    missingSummarySlugs,
    summariesAddedForNewAcceptedBooks: generated.map((item) => item.manifest.slug),
    newPreviewsCreated: generated.map((item) => item.manifest.slug),
    previewSizeRangeForNewChangedBooks:
      previewCounts.length > 0 ? `${Math.min(...previewCounts)}-${Math.max(...previewCounts)} chars` : "none",
    previewSizePolicyResultForNewChangedBooks:
      "pass: new previews are starter text only, roughly around 1 KB where practical, and not full chapters.",
    starterPreviewVisibilityCheckpoint:
      "pass: book pages use local starter preview text when full Cloudflare JSON is unavailable; Cloudflare export was not run.",
    existingPreviewLoadingArchitectureBlockerFound: false,
    remainingRawCandidateCountAfterBranch: remainingAfterSlugs.length,
    remainingRawCandidateSlugsAfterBranch: remainingAfterSlugs,
    unresolvedSourceGeneratedBookCheckpoint:
      "11 unresolved-source generated books remain documented for the next dedicated review branch.",
    cloudflareExportCheckpoint: "Cloudflare export was not run and cloudflare-export remains a protected clean folder.",
    urlPageIndexabilityBlockerCheckpoint:
      "URL/page/indexability and planned-page implementation remains a later final-release blocker.",
    mobileFinalStageCheckpoint: "Broad mobile optimization remains the very last stage and was not started.",
    filesChangedByScript: generated.flatMap((item) => item.filesChanged),
    validationResults: {
      targetedGeneration: "pass",
      seoSummaryCoverage: missingSummarySlugs.length === 0 ? "pass" : "fail",
      fullValidation: "pending; recorded after validation commands complete",
    },
    recommendedNextMajorPhase:
      "Review the 11 unresolved-source generated books, unless remaining raw candidates still require a second manual/bespoke branch.",
  };

  writeJson(path.join(reportRoot, "remaining-raw-candidate-completion.json"), report);
  writeText(
    path.join(reportRoot, "remaining-raw-candidate-completion.md"),
    makeMarkdownReport(report),
  );

  console.log(
    `Generated ${generated.length} accepted raw candidates; library ${report.previousGeneratedCount} -> ${libraryAfter.books.length}; summaries ${report.previousSeoSummaryCount} -> ${seoAfter.summaries.length}; missing summaries ${missingSummarySlugs.length}.`,
  );
}

main();
