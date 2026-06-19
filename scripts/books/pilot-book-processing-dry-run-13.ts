import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { cleanGutenbergText } from "./clean-gutenberg.ts";
import { countBookWords } from "./bookTextNormalization.ts";
import { analyzeBookStructure } from "./lib/book-structure-detection.ts";

type PriorPassBook = {
  slug: string;
  sourceFilename: string;
  sourcePath: string;
  pass2Risk?: string;
  pass2RiskReasons?: string[];
  candidateStart?: {
    line: number;
    index: number;
    confidence: string;
    candidateSnippet: string;
  };
  candidateEnd?: {
    line: number;
    index: number;
    confidence: string;
    candidateSnippet: string;
  };
};

type StructureAuditBook = {
  slug: string;
  sourceFilename: string;
  sourcePath: string;
  rawWordCount: number;
  cleanedWordCount: number;
  likelyTitle: string;
  likelyAuthor: string | string[];
  detectedStructuralConvention: string;
  confidenceLevel: string;
  confidenceScore: number;
  estimatedSectionCount: number;
  fallbackRequired: boolean;
  fallbackLegitimacy: string;
  likelyTocHeadingsDetected: boolean;
  likelyBodyHeadingsDetected: boolean;
  examplesOfDetectedBodyHeadings: string[];
  examplesOfRejectedTocLikeHeadings: string[];
  startBoundaryConfidence: string;
  endBoundaryConfidence: string;
  cleaningWarnings: string[];
  redFlags: string[];
  recommendedHandling: string;
};

type GeneratedLibraryManifest = {
  books: Array<{
    slug: string;
    title: string;
    stats: {
      sectionCount: number;
    };
  }>;
};

type Evidence = {
  source: string;
  text: string;
  lineNumber: number | null;
};

type CandidateRecommendation =
  | "controlled first-time processing"
  | "manual review"
  | "blocked"
  | "skip for now";

type CandidateStatus =
  | "needs first-time controlled processing"
  | "manual review"
  | "blocked";

type BookDryRunResult = {
  slug: string;
  candidateType: "raw-only";
  sourceFileUsed: string;
  sourceFolder: string;
  publicRestrictedStatus: string;
  expectedGeneratedTitle: string;
  titleEvidence: Evidence;
  expectedAuthor: string[];
  authorEvidence: Evidence;
  apparentWorkType:
    | "standalone book"
    | "individual story"
    | "story collection"
    | "play"
    | "poem/anthology"
    | "essay/nonfiction"
    | "other";
  detectedStructuralConvention: string;
  structureConfidence: string;
  meaningfulHeadingsExist: boolean;
  meaningfulHeadingExamples: string[];
  realReadableStart: string;
  realReadableEnd: string;
  frontMatterDefaultPolicy: string;
  sourceNoisePresent: {
    titlePageOrByline: boolean;
    contentsOrToc: boolean;
    sourceOrLicense: boolean;
    contributorOrTranscriberNotes: boolean;
    illustrationCaptions: boolean;
    footnotesOrPageMarkers: boolean;
  };
  expectedFirstDefaultSection: string;
  expectedDefaultReadableSections: string;
  likelySectionCount: number;
  likelyPreviewStart: string;
  frontMatterToExcludeOrPreserveNonDefault: string;
  endMatterToExclude: string;
  expectedStartBoundary: string;
  expectedEndBoundary: string;
  expectedSectioningStrategy: string;
  segmentationRisks: string[];
  cleanupRisks: string[];
  titleDefaultStartRisks: string[];
  authorMetadataRisks: string[];
  collectionTitleLeakageRisks: string[];
  illustrationPageMarkerFootnoteRisks: string[];
  duplicateNearDuplicateSlugCheck: string;
  selectedSourceOrderingRisk: string;
  currentStatus: CandidateStatus;
  recommendationForNextPass: CandidateRecommendation;
  priorAuditSignals: {
    pass2Risk: string | null;
    pass2Reasons: string[];
    structureRecommendedHandling: string;
    structureRedFlags: string[];
    startBoundaryConfidence: string;
    endBoundaryConfidence: string;
  };
  snippets: {
    title: string;
    author: string;
    start: string;
    end: string;
  };
};

type DryRunReport = {
  schemaVersion: 1;
  reportName: "pilot-dry-run-13" | "pilot-dry-run-14";
  generatedAt: string;
  branch: string;
  baseMainCommit: string;
  mode: "dry-run/report-only";
  selectedBooks: string[];
  selectedCount: number;
  candidateTypeCounts: {
    rawOnly: number;
    unresolvedSourceGeneratedReportOnly: number;
  };
  counts: {
    controlledFirstTimeProcessing: number;
    manualReview: number;
    blocked: number;
    skippedUnsafe: number;
  };
  acceptedExclusion: {
    count: number;
    reportInputs: string[];
    ambiguities: string[];
  };
  candidatePool: {
    rawOnlyCandidatesConsidered: number;
    knownManualBlockedSuspiciousExcludedCount: number;
    selectedRawOnlyCount: number;
    rejectedBySafetyGatesCount: number;
  };
  unresolvedSourceGeneratedBooksLeftUntouched: Array<{
    slug: string;
    title: string;
    candidateType: "unresolved-source generated, report-only";
    generatedSectionCount: number;
    reason: string;
  }>;
  duplicateNearDuplicateCandidatesSkipped: Array<{
    slug: string;
    reason: string;
  }>;
  boundaryDefectCandidatesSkipped: Array<{
    slug: string;
    reason: string;
  }>;
  inputReports: string[];
  sourceDetectorUsed: string;
  protectedPaths: {
    rawSourceInput: string;
    generatedBooks: string;
    cloudflareExport: string;
    previewAssets: string;
  };
  futureBatchRules: string[];
  laterPhaseRequirements: string[];
  books: BookDryRunResult[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const dryRunBatch = process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "14" ? 14 : 13;
const dryRunReportName = `pilot-dry-run-${dryRunBatch}` as const;
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const cloudflareRoot = path.join(
  repoRoot,
  "app/client/assets/books/cloudflare-export",
);
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditRoot = path.join(repoRoot, "app/client/assets/books/audit-reports");
const reportRoot = path.join(auditRoot, dryRunReportName);
const reportBooksRoot = path.join(reportRoot, "books");
const mainJsonPath = path.join(reportRoot, `${dryRunReportName}.json`);
const mainMarkdownPath = path.join(reportRoot, `${dryRunReportName}.md`);

const acceptedReportPaths = [
  "app/client/assets/books/audit-reports/pilot-write-1/pilot-write-1.json",
  "app/client/assets/books/audit-reports/pilot-write-2/pilot-write-2.json",
  "app/client/assets/books/audit-reports/pilot-write-3/pilot-write-3.json",
  "app/client/assets/books/audit-reports/pilot-write-4/pilot-write-4.json",
  "app/client/assets/books/audit-reports/pilot-write-5/pilot-write-5.json",
  "app/client/assets/books/audit-reports/pilot-write-6/pilot-write-6.json",
  "app/client/assets/books/audit-reports/pilot-write-6-verification/pilot-write-6-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-7/pilot-write-7.json",
  "app/client/assets/books/audit-reports/pilot-write-7-verification/pilot-write-7-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-8/pilot-write-8.json",
  "app/client/assets/books/audit-reports/pilot-write-8-verification/pilot-write-8-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-9/pilot-write-9.json",
  "app/client/assets/books/audit-reports/pilot-write-9-verification/pilot-write-9-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-10/pilot-write-10.json",
  "app/client/assets/books/audit-reports/pilot-write-10-verification/pilot-write-10-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-11/pilot-write-11.json",
  "app/client/assets/books/audit-reports/pilot-write-11-verification/pilot-write-11-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-12/pilot-write-12.json",
  "app/client/assets/books/audit-reports/pilot-write-12-verification/pilot-write-12-verification.json",
  ...(dryRunBatch >= 14
    ? [
        "app/client/assets/books/audit-reports/pilot-write-13/pilot-write-13.json",
        "app/client/assets/books/audit-reports/pilot-write-13-verification/pilot-write-13-verification.json",
      ]
    : []),
  "app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json",
  "app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json",
  "app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json",
] as const;

const inputReportPaths = [
  "app/client/assets/books/audit-reports/book-processing-audit-pass-1.json",
  "app/client/assets/books/audit-reports/book-processing-audit-pass-2.json",
  "app/client/assets/books/audit-reports/book-structure-audit-1/book-structure-audit-1.json",
  "app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json",
  "app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json",
  "app/client/assets/books/audit-reports/metadata-segmentation-correctness-audit-1/metadata-segmentation-correctness-audit-1.json",
  "app/client/assets/books/audit-reports/manual-ui-defect-followup-1/manual-ui-defect-followup-1.json",
  "app/client/assets/books/audit-reports/pilot-write-12-verification/pilot-write-12-verification.json",
  ...(dryRunBatch >= 14
    ? [
        "app/client/assets/books/audit-reports/pilot-write-13-verification/pilot-write-13-verification.json",
      ]
    : []),
] as const;

const structureJsonPath = path.join(
  auditRoot,
  "book-structure-audit-1/book-structure-audit-1.json",
);
const pass2JsonPath = path.join(auditRoot, "book-processing-audit-pass-2.json");
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");

const selectedBatch: readonly string[] = dryRunBatch === 14
  ? [
      "briar-rose",
      "the-blue-light",
      "the-elves-and-the-shoemaker",
      "the-four-clever-brothers",
      "the-fox-and-the-cat",
      "the-fox-and-the-horse",
      "the-frog-prince",
      "the-golden-bird",
      "the-goose-girl",
      "the-king-of-the-golden-mountain",
      "the-little-peasant",
      "the-miser-in-the-bush",
      "the-mouse-the-bird-and-the-sausage",
      "the-old-man-and-his-grandson",
      "the-pink",
      "the-queen-bee",
      "the-raven",
      "the-robber-bridegroom",
      "the-salad",
      "the-story-of-the-youth-who-went-forth-to-learn-what-fear-was",
      "the-straw-the-coal-and-the-bean",
      "the-three-languages",
      "the-travelling-musicians",
    ]
  : [
      "ashputtel",
      "cat-and-mouse-in-partnership",
      "cat-skin",
      "clever-elsie",
      "clever-gretel",
      "doctor-knowall",
      "frederick-and-catherine",
      "fundevogel",
      "hans-in-luck",
      "hansel-and-gretel",
      "iron-hans",
      "king-grisly-beard",
      "lily-and-the-lion",
      "little-red-riding-hood",
      "old-sultan",
      "rumpelstiltskin",
      "snowdrop",
      "sweetheart-roland",
      "the-dog-and-the-sparrow",
      "the-valiant-little-tailor",
    ];

const knownManualBlockedSuspicious = new Set([
  "a-christmas-carol",
  "dr-jekyll-and-mr-hyde",
  "a-catastrophe",
  "new-text-document",
  "screenshot-2026-06-13-014010",
  "in-the-abyss",
  "pollock-and-the-porroh-man",
  "the-colour-out-of-space",
  "the-plattner-story",
  "the-wind-in-the-willows",
  "the-two-magics-the-turn-of-the-screw-covering-end",
  "the-works-of-edgar-allan-poe",
]);

const duplicateNearDuplicateCandidatesSkipped = [
  {
    slug: "the-wind-in-the-willows",
    reason:
      "Skipped as a known duplicate of existing generated wind-in-the-willows; write batch 8 accepted the skip and no distinct-version policy exists.",
  },
  {
    slug: "the-two-magics-the-turn-of-the-screw-covering-end",
    reason:
      "Skipped as a known duplicate/boundary-risk case; write batch 9 found this raw file contains a full The Turn of the Screw while generated the-turn-of-the-screw already exists and no distinct-version policy exists.",
  },
] as const;

const boundaryDefectCandidatesSkipped = [
  {
    slug: "the-works-of-edgar-allan-poe",
    reason:
      "Skipped as a known boundary-defect case; write batch 9 found raw Volume 2 begins with THE PURLOINED LETTER while the dry-run boundary would have dropped that opening collection content.",
  },
] as const;

const titleOverrides: Record<string, string> = {
  "ole-luk-oie-the-dream-god": "Ole-Luk-Oie, the Dream-God",
  "clever-hans": "Clever Hans",
  "the-fisherman-and-his-wife": "The Fisherman and His Wife",
  "the-story-of-the-old-man-who-made-withered-trees-to-flower":
    "The Story of the Old Man Who Made Withered Trees to Flower",
  "the-story-of-urashima-taro-the-fisher-lad":
    "The Story of Urashima Taro, the Fisher Lad",
  "the-story-of-the-man-who-did-not-wish-to-die":
    "The Story of the Man Who Did Not Wish to Die",
  "the-happy-hunter-and-the-skillful-fisher":
    "The Happy Hunter and the Skillful Fisher",
  "the-conceited-apple-branch": "The Conceited Apple Branch",
  "the-darning-needle": "The Darning-Needle",
  "the-greenies": "The Greenies",
  "the-loving-pair": "The Loving Pair",
  "little-ida-s-flowers": "Little Ida's Flowers",
  "the-roses-and-the-sparrows": "The Roses and the Sparrows",
  "the-steadfast-tin-soldier": "The Steadfast Tin Soldier",
  "shock-tactics": "Shock Tactics",
  "canossa": "Canossa",
  "the-oversight": "The Oversight",
  "the-penance": "The Penance",
  mark: "Mark",
  "quail-seed": "Quail Seed",
  ashputtel: "Ashputtel",
  "cat-and-mouse-in-partnership": "Cat and Mouse in Partnership",
  "cat-skin": "Cat-Skin",
  "clever-elsie": "Clever Elsie",
  "clever-gretel": "Clever Gretel",
  "doctor-knowall": "Doctor Knowall",
  "frederick-and-catherine": "Frederick and Catherine",
  fundevogel: "Fundevogel",
  "hans-in-luck": "Hans in Luck",
  "hansel-and-gretel": "Hansel and Gretel",
  "iron-hans": "Iron Hans",
  "king-grisly-beard": "King Grisly-Beard",
  "lily-and-the-lion": "Lily and the Lion",
  "little-red-riding-hood": "Little Red Riding Hood",
  "old-sultan": "Old Sultan",
  rumpelstiltskin: "Rumpelstiltskin",
  snowdrop: "Snowdrop",
  "sweetheart-roland": "Sweetheart Roland",
  "the-dog-and-the-sparrow": "The Dog and the Sparrow",
  "the-valiant-little-tailor": "The Valiant Little Tailor",
  "briar-rose": "Briar Rose",
  "the-blue-light": "The Blue Light",
  "the-elves-and-the-shoemaker": "The Elves and the Shoemaker",
  "the-four-clever-brothers": "The Four Clever Brothers",
  "the-fox-and-the-cat": "The Fox and the Cat",
  "the-fox-and-the-horse": "The Fox and the Horse",
  "the-frog-prince": "The Frog-Prince",
  "the-golden-bird": "The Golden Bird",
  "the-goose-girl": "The Goose-Girl",
  "the-king-of-the-golden-mountain": "The King of the Golden Mountain",
  "the-little-peasant": "The Little Peasant",
  "the-miser-in-the-bush": "The Miser in the Bush",
  "the-mouse-the-bird-and-the-sausage": "The Mouse, the Bird, and the Sausage",
  "the-old-man-and-his-grandson": "The Old Man and His Grandson",
  "the-pink": "The Pink",
  "the-queen-bee": "The Queen Bee",
  "the-raven": "The Raven",
  "the-robber-bridegroom": "The Robber Bridegroom",
  "the-salad": "The Salad",
  "the-story-of-the-youth-who-went-forth-to-learn-what-fear-was":
    "The Story of the Youth Who Went Forth to Learn What Fear Was",
  "the-straw-the-coal-and-the-bean": "The Straw, the Coal, and the Bean",
  "the-three-languages": "The Three Languages",
  "the-travelling-musicians": "The Travelling Musicians",
};

const singleStoryStartPhrases: Record<string, string> = {
  "ole-luk-oie-the-dream-god": "THERE is nobody in the whole world who knows so many stories as",
  "clever-hans": "The mother of Hans said",
  "the-fisherman-and-his-wife": "There was once a fisherman who lived with his wife in a pigsty",
  "the-story-of-the-old-man-who-made-withered-trees-to-flower":
    "Long, long ago there lived an old man and his wife",
  "the-story-of-urashima-taro-the-fisher-lad":
    "Long, long ago in the province of Tango",
  "the-story-of-the-man-who-did-not-wish-to-die":
    "Long, long ago there lived a man called Sentaro",
  "the-happy-hunter-and-the-skillful-fisher":
    "Long, long ago Japan was governed by Hohodemi",
  "the-conceited-apple-branch": "IT WAS the month of May",
  "the-darning-needle": "THERE was once a Darning-needle",
  "the-greenies": "A ROSE TREE stood in the window",
  "the-loving-pair": "A WHIPPING Top and a Ball lay close together",
  "little-ida-s-flowers": "\"MY POOR flowers are quite faded",
  "the-roses-and-the-sparrows":
    "IT really appeared as if something very important were going on by the",
  "the-steadfast-tin-soldier": "THERE were once five and twenty tin soldiers",
  "shock-tactics": "On a late spring afternoon Ella McCarthy",
  "canossa": "Demosthenes Platterbaff",
  "the-oversight": "“It’s like a Chinese puzzle",
  "the-penance": "Octavian Ruttle",
  ashputtel: "The wife of a rich man fell sick; and when she felt that her end drew",
  "cat-and-mouse-in-partnership":
    "A certain cat had made the acquaintance of a mouse, and had said so much",
  "cat-skin": "There was once a king, whose queen had hair of the purest gold, and was",
  "clever-elsie": "There was once a man who had a daughter who was called Clever Elsie. And",
  "clever-gretel": "There was once a cook named Gretel, who wore shoes with red heels, and",
  "doctor-knowall": "There was once upon a time a poor peasant called Crabb, who drove with",
  "frederick-and-catherine":
    "There was once a man called Frederick: he had a wife whose name was",
  fundevogel: "There was once a forester who went into the forest to hunt, and as",
  "hans-in-luck": "Some men are born to good luck: all they do or try to do comes",
  "hansel-and-gretel": "Hard by a great forest dwelt a poor wood-cutter with his wife and his",
  "iron-hans": "There was once upon a time a king who had a great forest near his",
  "king-grisly-beard":
    "A great king of a land far away in the East had a daughter who was very",
  "lily-and-the-lion":
    "A merchant, who had three daughters, was once setting out upon a",
  "little-red-riding-hood":
    "Once upon a time there was a dear little girl who was loved by everyone",
  "old-sultan": "A shepherd had a faithful dog, called Sultan, who was grown very old,",
  rumpelstiltskin:
    "By the side of a wood, in a country a long way off, ran a fine stream",
  snowdrop: "It was the middle of winter, when the broad flakes of snow were falling",
  "sweetheart-roland":
    "There was once upon a time a woman who was a real witch and had two",
  "the-dog-and-the-sparrow":
    "A shepherd’s dog had a master who took no care of him, but often let him",
  "the-valiant-little-tailor":
    "One summer’s morning a little tailor was sitting on his table by the",
  "briar-rose":
    "A king and queen once upon a time reigned in a country a great way off,",
  "the-blue-light":
    "There was once upon a time a soldier who for many years had served the",
  "the-elves-and-the-shoemaker":
    "There was once a shoemaker, who worked very hard and was very honest:",
  "the-four-clever-brothers":
    "\u2018Dear children,\u2019 said a poor man to his four sons, \u2018I have nothing to",
  "the-fox-and-the-cat":
    "It happened that the cat met the fox in a forest, and as she thought to",
  "the-fox-and-the-horse":
    "A farmer had a horse that had been an excellent faithful servant to",
  "the-frog-prince":
    "One fine evening a young princess put on her bonnet and clogs, and went",
  "the-golden-bird":
    "A certain king had a beautiful garden, and in the garden stood a tree",
  "the-goose-girl":
    "The king of a great land died, and left his queen to take care of their",
  "the-king-of-the-golden-mountain":
    "There was once a merchant who had only one child, a son, that was very",
  "the-little-peasant":
    "There was a certain village wherein no one lived but really rich",
  "the-miser-in-the-bush":
    "A farmer had a faithful and diligent servant, who had worked hard for",
  "the-mouse-the-bird-and-the-sausage":
    "Once upon a time, a mouse, a bird, and a sausage, entered into",
  "the-old-man-and-his-grandson":
    "There was once a very old man, whose eyes had become dim, his ears dull",
  "the-pink":
    "There was once upon a time a queen to whom God had given no children.",
  "the-queen-bee":
    "Two kings\u2019 sons once upon a time went into the world to seek their",
  "the-raven":
    "There was once a queen who had a little daughter, still too young to run",
  "the-robber-bridegroom":
    "There was once a miller who had one beautiful daughter, and as she was",
  "the-salad":
    "As a merry young huntsman was once going briskly along through a wood,",
  "the-story-of-the-youth-who-went-forth-to-learn-what-fear-was":
    "A certain father had two sons, the elder of who was smart and sensible,",
  "the-straw-the-coal-and-the-bean":
    "In a village dwelt a poor old woman, who had gathered together a dish",
  "the-three-languages":
    "An aged count once lived in Switzerland, who had an only son, but he",
  "the-travelling-musicians":
    "An honest farmer had once an ass that had been a faithful servant to him",
  mark: "Augustus Mellowkent was a novelist",
  "quail-seed": "“The outlook is not encouraging for us smaller businesses",
};

const sectioningStartOverrides: Record<
  string,
  {
    label: string;
    startPhrase: string;
    convention: string;
    likelySectionCount: number;
    strategyNote: string;
    examples: string[];
  }
> = {
  "the-adventures-of-chanticleer-and-partlet": {
    label: "1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS",
    startPhrase: "The nuts are quite ripe now",
    convention: "arabic-numbered titled story sections after parent collection wrapper",
    likelySectionCount: 3,
    strategyNote:
      "the three numbered story sections beginning with 1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS; exclude parent Grimm title/byline/source wrapper",
    examples: [
      "1. HOW THEY WENT TO THE MOUNTAINS TO EAT NUTS",
      "2. HOW CHANTICLEER AND PARTLET WENT TO VISIT MR KORBES",
      "3. HOW PARTLET DIED AND WAS BURIED, AND HOW CHANTICLEER DIED OF GRIEF",
    ],
  },
};

const unresolvedGeneratedSlugs = [
  "a-princess-of-mars",
  "doctor-dolittle",
  "heidi",
  "jabberwocky",
  "nights-with-uncle-remus",
  "peter-pan",
  "tarzan-of-the-apes",
  "the-great-gatsby",
  "the-picture-of-dorian-gray",
  "the-thirty-nine-steps",
  "wood-folk-at-school",
] as const;

const sourceNoisePatterns = {
  contentsOrToc: /\b(contents|table of contents|list of illustrations)\b/i,
  sourceOrLicense:
    /\b(project gutenberg|gutenberg-tm|full license|terms of use|release date|ebook|e-book|copyright laws)\b/i,
  contributorOrTranscriberNotes:
    /\b(produced by|distributed proofreading|pgdp|transcriber|transcriber's notes?|credits:)\b/i,
  illustrationCaptions: /\[\s*illustration\b|frontispiece|illustrated by/i,
  footnotesOrPageMarkers: /\bfootnote\b|\[Pg\.?\s*\d+\]|\[Page\s+\d+\]/i,
};

const individualStorySlugs = new Set([
  "cool-air",
  "the-dream-of-little-tuk",
  "the-false-collar",
  "the-naughty-boy",
  "the-red-shoes",
  "the-shadow",
  "the-story-of-a-mother",
  "the-ugly-duckling",
  "the-adventures-of-chanticleer-and-partlet",
  "jorinda-and-jorindel",
  "mother-holle",
  "rapunzel",
  "the-juniper-tree",
  "the-seven-ravens",
  "the-wedding-of-mrs-fox",
  "the-adventures-of-kintaro-the-golden-boy",
  "the-bamboo-cutter-and-the-moon-child",
  "the-goblin-of-adachigahara",
  "the-jelly-fish-and-the-monkey",
  "the-tongue-cut-sparrow",
]);

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeText(filePath: string, text: string) {
  assertSafeReportPath(filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}

function writeJson(filePath: string, value: unknown) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function relativeToRepo(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertSafeReportPath(filePath: string) {
  const resolved = path.resolve(filePath);
  const expectedRoot = path.resolve(reportRoot);
  if (resolved !== expectedRoot && !resolved.startsWith(`${expectedRoot}${path.sep}`)) {
    throw new Error(`Unsafe report output path: ${resolved}`);
  }
}

function assertReadableInput(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required input is missing: ${relativeToRepo(filePath)}`);
  }
}

function toAscii(input: string) {
  return input.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
}

function compactText(input: string | null | undefined, maxLength = 260) {
  if (!input) return "";
  const compact = toAscii(input).replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 3).trimEnd()}...`;
}

function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function gitOutput(args: string[]) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
}

function authorList(value: unknown) {
  const values = Array.isArray(value) ? value : [value];
  return values
    .map((item) => String(item ?? "").trim())
    .filter((item) => item.length > 0 && !/^null$/i.test(item));
}

function findHeaderEvidence(
  rawText: string,
  pattern: RegExp,
  source: string,
): Evidence | null {
  const lines = rawText.split("\n").slice(0, 220);
  for (const [index, line] of lines.entries()) {
    const trimmed = line.replace(/\s+/g, " ").trim();
    if (pattern.test(trimmed)) {
      return {
        source,
        text: compactText(trimmed),
        lineNumber: index + 1,
      };
    }
  }
  return null;
}

function findTitleHeadingEvidence(rawText: string, expectedTitle: string): Evidence | null {
  const expectedSlug = slugify(expectedTitle);
  const lines = rawText.split("\n").slice(0, 260);
  for (const [index, line] of lines.entries()) {
    const trimmed = line.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    if (slugify(trimmed) === expectedSlug) {
      return {
        source: "source body heading",
        text: compactText(trimmed),
        lineNumber: index + 1,
      };
    }
  }
  return null;
}

function findAuthorEvidence(rawText: string): Evidence | null {
  const lines = rawText.split("\n").slice(0, 220);
  for (const [index, line] of lines.entries()) {
    const trimmed = line.replace(/\s+/g, " ").trim();
    if (!/^Author:\s+/i.test(trimmed)) continue;
    const authorLines = [trimmed.replace(/^Author:\s*/i, "").trim()];
    for (const nextLine of lines.slice(index + 1, index + 8)) {
      if (!/^\s+\S/.test(nextLine)) break;
      const next = nextLine.replace(/\s+/g, " ").trim();
      if (/^(release date|language|credits|illustrator|translator):/i.test(next)) break;
      authorLines.push(next);
    }
    return {
      source: "Gutenberg Author line",
      text: compactText(`Author: ${authorLines.join("; ")}`),
      lineNumber: index + 1,
    };
  }
  return null;
}

function evidenceValue(evidence: Evidence | null, label: string) {
  if (!evidence) return "";
  return evidence.text.replace(new RegExp(`^${label}:\\s*`, "i"), "").trim();
}

function deriveAcceptedSlugs() {
  const accepted = new Set<string>();
  const ambiguities: string[] = [];

  for (const relativePath of acceptedReportPaths) {
    const fullPath = path.join(repoRoot, relativePath);
    assertReadableInput(fullPath);
    const report = readJson<Record<string, unknown>>(fullPath);
    const books = Array.isArray(report.books)
      ? (report.books as Array<Record<string, unknown>>)
      : [];

    if (relativePath.includes("title-start-default-content-audit-1")) {
      for (const book of books) {
        if (book.acceptedBeforeAudit === true && typeof book.slug === "string") {
          accepted.add(book.slug);
        }
      }
      continue;
    }

    if (relativePath.includes("metadata-segmentation-correctness-audit-1")) {
      for (const book of books) {
        if (book.acceptedBeforeAudit === true && typeof book.slug === "string") {
          accepted.add(book.slug);
        }
      }
      continue;
    }

    if (relativePath.includes("manual-ui-defect-followup-1")) {
      for (const book of books) {
        const verdict = String(book.verdict ?? "").toLowerCase();
        if (verdict.includes("acceptable") && typeof book.slug === "string") {
          accepted.add(book.slug);
        }
      }
      continue;
    }

    if (
      relativePath.includes("pilot-write-6-verification") ||
      relativePath.includes("pilot-write-7-verification") ||
      relativePath.includes("pilot-write-8-verification") ||
      relativePath.includes("pilot-write-9-verification") ||
      relativePath.includes("pilot-write-10-verification") ||
      relativePath.includes("pilot-write-11-verification") ||
      relativePath.includes("pilot-write-12-verification") ||
      relativePath.includes("pilot-write-13-verification")
    ) {
      for (const book of books) {
        if (book.acceptedForMain === true && typeof book.slug === "string") {
          accepted.add(book.slug);
        }
      }
      const skippedDuplicate = report.skippedDuplicate as
        | { acceptedForSkip?: boolean; slug?: unknown }
        | undefined;
      if (skippedDuplicate?.acceptedForSkip === true && typeof skippedDuplicate.slug === "string") {
        accepted.add(skippedDuplicate.slug);
      }
      const skippedBooks = report.skippedBooks as
        | Array<{ acceptedForSkip?: boolean; slug?: unknown }>
        | undefined;
      if (Array.isArray(skippedBooks)) {
        for (const skipped of skippedBooks) {
          if (skipped.acceptedForSkip === true && typeof skipped.slug === "string") {
            accepted.add(skipped.slug);
          }
        }
      }
      const duplicateBoundaryExclusions = report.knownDuplicateBoundaryExclusions as
        | Array<{ untouched?: boolean; slug?: unknown }>
        | undefined;
      if (Array.isArray(duplicateBoundaryExclusions)) {
        for (const skipped of duplicateBoundaryExclusions) {
          if (skipped.untouched === true && typeof skipped.slug === "string") {
            accepted.add(skipped.slug);
          }
        }
      }
      continue;
    }

    for (const listName of [
      "approvedPilotSlugs",
      "dryRunAcceptedNoRewrite",
      "correctedBooks",
      "processedBooks",
    ]) {
      const list = report[listName];
      if (Array.isArray(list)) {
        for (const slug of list) {
          if (typeof slug === "string") accepted.add(slug);
        }
      }
    }

    for (const book of books) {
      const slug = typeof book.slug === "string" ? book.slug : null;
      if (!slug) continue;
      const statusText = [
        book.status,
        book.finalAction,
        book.verificationStatus,
        book.dryRunStatus,
      ]
        .map((value) => String(value ?? "").toLowerCase())
        .join(" ");
      if (
        statusText.includes("written") ||
        statusText.includes("first-time processed") ||
        statusText.includes("corrected") ||
        statusText.includes("accepted without rewrite") ||
        statusText.includes("pass")
      ) {
        accepted.add(slug);
      } else if (
        !statusText.includes("skipped") &&
        !unresolvedGeneratedSlugs.includes(slug as (typeof unresolvedGeneratedSlugs)[number])
      ) {
        ambiguities.push(`${relativePath}: ${slug}`);
      }
    }
  }

  return { accepted, ambiguities: [...new Set(ambiguities)].sort() };
}

function sourcePathFor(book: StructureAuditBook) {
  const resolved = path.resolve(repoRoot, book.sourcePath);
  const tempRoot = path.resolve(tempBooksRoot);
  if (!resolved.startsWith(`${tempRoot}${path.sep}`)) {
    throw new Error(`Candidate source is outside temp-books: ${book.slug}`);
  }
  assertReadableInput(resolved);
  return resolved;
}

function firstReadableBoundary(analysis: ReturnType<typeof analyzeBookStructure>) {
  return analysis.selectedBodyHeadings[0] ?? null;
}

function firstSectionLabel(first: NonNullable<ReturnType<typeof firstReadableBoundary>>) {
  const title = first.title ? `: ${first.title}` : "";
  if (first.kind === "chapter" && first.ordinal) return `Chapter ${first.ordinal}${title}`;
  if (first.kind === "section" && first.ordinal) return `Section ${first.ordinal}${title}`;
  if (first.kind === "book" && first.ordinal) return `Book ${first.ordinal}${title}`;
  if (first.kind === "part" && first.ordinal) return `Part ${first.ordinal}${title}`;
  if (first.kind === "volume" && first.ordinal) return `Volume ${first.ordinal}${title}`;
  if (first.kind === "act" && first.ordinal) return `Act ${first.ordinal}${title}`;
  if (first.kind === "scene" && first.ordinal) return `Scene ${first.ordinal}${title}`;
  if (first.kind === "canto" && first.ordinal) return `Canto ${first.ordinal}${title}`;
  if (first.kind === "story-title" || first.kind === "titled-section") {
    return first.normalized;
  }
  return first.normalized;
}

function normalizedLoose(input: string) {
  return input
    .toLowerCase()
    .replace(/[_*"'“”‘’.,:;()[\]\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lineLooksLikeNonDefaultOpening(
  line: string,
  first: NonNullable<ReturnType<typeof firstReadableBoundary>>,
  title: string,
) {
  const normalized = normalizedLoose(line);
  if (!normalized) return true;
  if (normalized === normalizedLoose(first.normalized)) return true;
  if (normalized === normalizedLoose(firstSectionLabel(first))) return true;
  if (normalized === normalizedLoose(title)) return true;
  if (/^by\s+[a-z]/i.test(line)) return true;
  if (/^author of\b/i.test(line)) return true;
  if (/^\[?\s*(source|transcriber|illustration|frontispiece)\b/i.test(line)) return true;
  if (/^(home|his life|his writings|popular culture|about this site)\b/i.test(normalized)) {
    return true;
  }
  if (/^[•\s]*(home|his life|his writings|his creations|his study)\b/i.test(line)) {
    return true;
  }
  if (/^(title|author|release date|language|credits):/i.test(line)) return true;
  return false;
}

function firstReadableSnippetAfterHeading(
  cleanedText: string,
  first: NonNullable<ReturnType<typeof firstReadableBoundary>>,
  title: string,
) {
  const segment = cleanedText.slice(first.offset, first.offset + 3200);
  const lines = segment.split(/\r?\n/);
  const readableLines: string[] = [];
  let inBracketedNote = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (!line) continue;

    if (inBracketedNote) {
      if (/\]/.test(line)) inBracketedNote = false;
      continue;
    }

    if (/^\[\s*Transcriber's Note:/i.test(line)) {
      if (!/\]/.test(line)) inBracketedNote = true;
      continue;
    }

    if (readableLines.length === 0 && lineLooksLikeNonDefaultOpening(line, first, title)) {
      continue;
    }

    readableLines.push(line);
    if (readableLines.join(" ").length >= 520) break;
  }

  return compactText(
    readableLines.join(" ") || first.nextProsePreview || first.normalized,
    320,
  );
}

function headingLooksLikeSourceWrapperJunk(
  heading: NonNullable<ReturnType<typeof firstReadableBoundary>>,
  first: NonNullable<ReturnType<typeof firstReadableBoundary>>,
  title: string,
) {
  const normalized = normalizedLoose(heading.normalized);
  if (!normalized) return true;
  if (heading === first) return false;
  if (lineLooksLikeNonDefaultOpening(heading.normalized, first, title)) return true;
  if (/\b(contact us|site map|search|donate|copyright|all rights reserved)\b/i.test(normalized)) {
    return true;
  }
  if (/copyright.*all rights reserved/i.test(heading.normalized)) return true;
  return false;
}

function plannedHeadingStrategy(
  slug: string,
  title: string,
  analysis: ReturnType<typeof analyzeBookStructure>,
  first: NonNullable<ReturnType<typeof firstReadableBoundary>>,
) {
  let meaningfulHeadings = analysis.selectedBodyHeadings.filter(
    (heading) => !headingLooksLikeSourceWrapperJunk(heading, first, title),
  );
  let strategyNote = `${analysis.selectedHeadingStrategy?.label ?? analysis.detectedStructuralConvention} boundaries`;
  let convention = analysis.detectedStructuralConvention;

  if (slug === "the-lurking-fear") {
    meaningfulHeadings = analysis.selectedBodyHeadings.filter((heading) =>
      /^_?\d+\./.test(heading.normalized.trim()),
    );
    strategyNote =
      "the four numbered story sections; ignore the sentence-fragment false positive inside section 2";
    convention = `${analysis.detectedStructuralConvention}; dry-run filters one false sentence-fragment heading`;
  }

  if (meaningfulHeadings.length === 0) {
    meaningfulHeadings = [first];
  }

  const selectedNonBodyCount = analysis.selectedBodyHeadings.length - meaningfulHeadings.length;
  if (
    meaningfulHeadings.length === 1 &&
    selectedNonBodyCount > 0 &&
    /story|titled/i.test(analysis.detectedStructuralConvention)
  ) {
    strategyNote =
      "one contiguous story section after excluding title/byline/source-site/transcriber/footer wrapper lines";
    convention = `${analysis.detectedStructuralConvention}; dry-run treats non-body wrapper headings as cleanup artifacts`;
  }

  return {
    convention,
    meaningfulHeadings,
    likelySectionCount: meaningfulHeadings.length,
    strategyNote,
  };
}

function detectSourceNoise(rawText: string, cleanedText: string, firstOffset: number) {
  const leadingText = cleanedText.slice(0, Math.max(0, firstOffset));
  const wholeEvidence = `${leadingText}\n${cleanedText.slice(-2500)}\n${rawText.slice(0, 5000)}`;
  return {
    titlePageOrByline: /\b(title:|author:|\bby\b|published by|copyright)\b/i.test(
      wholeEvidence,
    ),
    contentsOrToc: sourceNoisePatterns.contentsOrToc.test(wholeEvidence),
    sourceOrLicense: sourceNoisePatterns.sourceOrLicense.test(wholeEvidence),
    contributorOrTranscriberNotes:
      sourceNoisePatterns.contributorOrTranscriberNotes.test(wholeEvidence),
    illustrationCaptions: sourceNoisePatterns.illustrationCaptions.test(wholeEvidence),
    footnotesOrPageMarkers: sourceNoisePatterns.footnotesOrPageMarkers.test(wholeEvidence),
  };
}

function classifyWork(book: StructureAuditBook, analysis: ReturnType<typeof analyzeBookStructure>) {
  const title = book.likelyTitle.toLowerCase();
  const convention = analysis.detectedStructuralConvention.toLowerCase();
  if (individualStorySlugs.has(book.slug)) return "individual story";
  if (book.slug === "the-innocence-of-father-brown") return "story collection";
  if (book.slug === "astounding-stories-of-super-science") return "story collection";
  if (convention.includes("play") || convention.includes("act")) return "play";
  if (convention.includes("canto") || convention.includes("poem")) return "poem/anthology";
  if (
    title.includes("hero-myths") ||
    title.includes("deep-sea") ||
    title.includes("unicorns")
  ) {
    return "essay/nonfiction";
  }
  if (convention.includes("story") && analysis.estimatedSectionCount > 1) {
    return "story collection";
  }
  if (analysis.estimatedSectionCount === 1 && convention.includes("story")) {
    return "individual story";
  }
  return "standalone book";
}

function cleanupRisksFromNoise(noise: BookDryRunResult["sourceNoisePresent"]) {
  const risks: string[] = [];
  if (noise.titlePageOrByline) {
    risks.push("title page, byline, publication, or copyright material appears before body content");
  }
  if (noise.contentsOrToc) risks.push("contents or list material must not enter default playback");
  if (noise.sourceOrLicense) risks.push("Project Gutenberg/source/license material must be removed");
  if (noise.contributorOrTranscriberNotes) {
    risks.push("contributor or transcriber notes must be removed or preserved only as non-default");
  }
  if (noise.illustrationCaptions) {
    risks.push("illustration captions/placeholders must be removed from default playback");
  }
  if (noise.footnotesOrPageMarkers) {
    risks.push("footnotes or page markers may need cleanup before default playback");
  }
  return risks.length > 0 ? risks : ["no obvious cleanup blocker found in dry-run snippets"];
}

function readableEndSnippet(cleanedText: string) {
  let body = cleanedText;
  const trailingPatterns = [
    /\n\s*Transcriber(?:'s)? Notes?:/i,
    /\n\s*\[The other stories included in this volume/i,
    /\n\s*End of Project Gutenberg/i,
  ];
  for (const pattern of trailingPatterns) {
    const match = pattern.exec(body.slice(Math.floor(body.length * 0.65)));
    if (match) {
      body = body.slice(0, Math.floor(body.length * 0.65) + match.index);
    }
  }
  const theEndMatches = [...body.matchAll(/\bTHE END\b/gi)];
  const lastTheEnd = theEndMatches[theEndMatches.length - 1];
  if (lastTheEnd && lastTheEnd.index && lastTheEnd.index > body.length * 0.65) {
    body = body.slice(0, lastTheEnd.index + lastTheEnd[0].length);
  }
  const tail = body
    .slice(Math.max(0, body.length - 520))
    .replace(/\s+/g, " ")
    .trim();
  return tail.length <= 320 ? tail : `...${tail.slice(-317)}`;
}

function titleLooksLikeParentCollection(book: StructureAuditBook, title: string) {
  const sourceBase = path.basename(book.sourceFilename, path.extname(book.sourceFilename));
  const titleSlug = slugify(title);
  const sourceBaseSlug = slugify(sourceBase);
  if (titleSlug === book.slug) return false;
  if (sourceBaseSlug !== book.slug) return false;

  // Subtitle variants are acceptable; unrelated collection titles are not.
  if (titleSlug.startsWith(`${book.slug}-`) || book.slug.startsWith(`${titleSlug}-`)) {
    return false;
  }

  return true;
}

function nearDuplicateGeneratedSlugCheck(
  book: StructureAuditBook,
  title: string,
  generatedSlugs: Set<string>,
) {
  const titleSlug = slugify(title);
  const probes = [...new Set([book.slug, titleSlug].filter(Boolean))];
  const matches = [...generatedSlugs]
    .filter((slug) =>
      probes.some(
        (probe) =>
          slug === probe ||
          slug.startsWith(`${probe}-`) ||
          probe.startsWith(`${slug}-`),
      ),
    )
    .sort();

  if (matches.length === 0) {
    return "No exact or close generated slug match detected among current generated books.";
  }

  return `Review required if selected: possible generated slug overlap with ${matches.join(", ")}.`;
}

function selectedHardFailures(
  book: StructureAuditBook,
  analysis: ReturnType<typeof analyzeBookStructure>,
  title: string,
  author: string[],
  generatedSlugs: Set<string>,
  acceptedSlugs: Set<string>,
) {
  const failures: string[] = [];
  const first = firstReadableBoundary(analysis);
  const startOverride = sectioningStartOverrides[book.slug];
  if (generatedSlugs.has(book.slug)) failures.push("generated output already exists");
  if (acceptedSlugs.has(book.slug)) failures.push("book is already accepted/corrected/verified");
  if (knownManualBlockedSuspicious.has(book.slug)) failures.push("book is in known manual/blocked/suspicious list");
  if (analysis.fallbackRequired) failures.push("structure detector would use fallback chunks");
  if (first?.ordinal && first.ordinal > 1 && !startOverride) {
    failures.push(`first selected heading is ordinal ${first.ordinal}, not the true beginning`);
  }
  if (titleLooksLikeParentCollection(book, title)) {
    failures.push("expected title appears inherited from a parent collection");
  }
  if (author.length === 0 || author.some((item) => /^unknown author$/i.test(item))) {
    failures.push("author would be Unknown Author or missing despite raw-source review");
  }
  if (analysis.redFlags.some((flag) => /fallback|TOC\/body|huge sections/i.test(flag))) {
    failures.push("structure detector raised a hard false-positive red flag");
  }
  return failures;
}

function inspectBook(
  slug: string,
  structureBook: StructureAuditBook,
  pass2Book: PriorPassBook | undefined,
  generatedSlugs: Set<string>,
  acceptedSlugs: Set<string>,
): BookDryRunResult {
  const sourcePath = sourcePathFor(structureBook);
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const cleaned = cleanGutenbergText(rawText);
  const analysis = analyzeBookStructure(cleaned.cleanedText, {
    rawWordCount: countBookWords(cleaned.cleanedText),
  });
  const first = firstReadableBoundary(analysis);
  if (!first) throw new Error(`Selected book has no first readable heading: ${slug}`);

  let titleEvidence =
    findHeaderEvidence(rawText, /^Title:\s+/i, "Gutenberg Title line") ?? {
      source: "source filename / structure audit",
      text: structureBook.likelyTitle,
      lineNumber: null,
    };
  const titleFromEvidence = evidenceValue(titleEvidence, "Title");
  const expectedTitle = titleOverrides[slug] ?? titleFromEvidence ?? structureBook.likelyTitle;
  const bodyTitleEvidence = findTitleHeadingEvidence(rawText, expectedTitle);
  if (titleOverrides[slug] && bodyTitleEvidence) {
    titleEvidence = bodyTitleEvidence;
  }

  const authorEvidence =
    findAuthorEvidence(rawText) ??
    findHeaderEvidence(rawText, /^by\s+(.{2,120})$/i, "visible byline") ?? {
      source: "structure audit fallback",
      text: authorList(structureBook.likelyAuthor).join(", "),
      lineNumber: null,
    };
  const authorFromEvidence = authorEvidence.text
    .replace(/^Author:\s*/i, "")
    .replace(/^by\s+/i, "")
    .trim();
  const expectedAuthor = authorList(authorFromEvidence || structureBook.likelyAuthor);

  const hardFailures = selectedHardFailures(
    structureBook,
    analysis,
    expectedTitle,
    expectedAuthor,
    generatedSlugs,
    acceptedSlugs,
  );
  if (hardFailures.length > 0) {
    throw new Error(`${slug} failed selection gates: ${hardFailures.join("; ")}`);
  }

  const noise = detectSourceNoise(rawText, cleaned.cleanedText, first.offset);
  const cleanupRisks = cleanupRisksFromNoise(noise);
  const sectioningStartOverride = sectioningStartOverrides[slug];
  const sectioningStartOffset = sectioningStartOverride
    ? cleaned.cleanedText.indexOf(sectioningStartOverride.startPhrase)
    : -1;
  if (sectioningStartOverride && sectioningStartOffset < 0) {
    throw new Error(`${slug} sectioning start phrase was not found in cleaned source`);
  }
  const singleStoryStartPhrase = singleStoryStartPhrases[slug];
  const singleStoryStartOffset = singleStoryStartPhrase
    ? cleaned.cleanedText.indexOf(singleStoryStartPhrase)
    : -1;
  if (singleStoryStartPhrase && singleStoryStartOffset < 0) {
    throw new Error(`${slug} single-story start phrase was not found in cleaned source`);
  }
  const sectioningOverride = sectioningStartOffset >= 0 ? sectioningStartOverride : null;
  const singleStory = singleStoryStartOffset >= 0;
  const firstLabel = sectioningOverride?.label ?? (singleStory ? expectedTitle : firstSectionLabel(first));
  const firstPreview = sectioningOverride
    ? compactText(cleaned.cleanedText.slice(sectioningStartOffset, sectioningStartOffset + 720), 320)
    : singleStory
    ? compactText(cleaned.cleanedText.slice(singleStoryStartOffset, singleStoryStartOffset + 720), 320)
    : firstReadableSnippetAfterHeading(cleaned.cleanedText, first, expectedTitle);
  const headingPlan = sectioningOverride
    ? {
        convention: sectioningOverride.convention,
        meaningfulHeadings: [first],
        likelySectionCount: sectioningOverride.likelySectionCount,
        strategyNote: sectioningOverride.strategyNote,
      }
    : singleStory
    ? {
        convention: "single contiguous story section",
        meaningfulHeadings: [first],
        likelySectionCount: 1,
        strategyNote:
          "one contiguous story section after excluding source, title, byline, publication, and transcriber wrapper lines",
      }
    : plannedHeadingStrategy(slug, expectedTitle, analysis, first);
  const apparentWorkType = singleStory ? "individual story" : classifyWork(structureBook, analysis);
  const sectionExamples = sectioningOverride
    ? sectioningOverride.examples
    : singleStory
    ? [
        `Source tale heading: ${titleEvidence.text}`,
        `First readable prose: ${compactText(singleStoryStartPhrase, 180)}`,
      ]
    : headingPlan.meaningfulHeadings
        .slice(0, 6)
        .map((heading) => compactText(`L${heading.lineNumber}: ${heading.normalized}`, 180));
  const titleRisks: string[] = [];
  if (noise.titlePageOrByline) {
    titleRisks.push("write pass must keep title/byline material out of default playback");
  }
  if (
    !sectioningOverride &&
    !singleStory &&
    !/^chapter 1|^chapter i|^section 1|^i\b|^book i|^part i/i.test(first.normalized)
  ) {
    titleRisks.push("first default section is meaningful but should be verified manually in write pass");
  }
  const authorRisks =
    authorEvidence.source === "Gutenberg Author line"
      ? []
      : ["author did not come from a Gutenberg Author line; verify byline directly"];
  const collectionRisks = singleStory
    ? [
        "ensure the generated title stays the individual story title and parent collection title/byline/source wrapper stays out of default playback",
      ]
    : apparentWorkType === "story collection"
      ? ["ensure the generated title stays the collection title and individual story titles become sections"]
      : [];
  const segmentationRisks = [
    structureBook.recommendedHandling === "process with warnings"
      ? "structure audit recommends processing with warnings; write pass must verify boundaries directly from raw source"
      : "",
    analysis.selectedBodyHeadings.some((heading) => heading.ordinal && heading.ordinal > 1)
      ? "later ordinal headings are present; verify Chapter/Part/Book 1 remains included and selected first"
      : "",
    headingPlan.meaningfulHeadings.length !== analysis.selectedBodyHeadings.length
      ? "dry-run filtered at least one detector-selected wrapper heading; write pass must keep wrapper/source material out of playable sections"
      : "",
  ].filter(Boolean);
  const artifactRisks = [
    noise.illustrationCaptions ? "illustration captions/placeholders detected" : "",
    noise.footnotesOrPageMarkers ? "footnotes or page markers detected" : "",
  ].filter(Boolean);
  const frontMatterPolicy =
    first.offset > 0
      ? "Remove title page, contents, illustrations, source notes, and bylines from default playback; preserve only useful author/editor notes as non-default sections when intentional."
      : "No leading front matter detected before the first selected body section.";
  const endMatterPolicy =
    "Exclude Project Gutenberg footer/license and trailing transcriber, catalog, source, or publisher-ad material from default playback.";

  return {
    slug,
    candidateType: "raw-only",
    sourceFileUsed: relativeToRepo(sourcePath),
    sourceFolder: relativeToRepo(path.dirname(sourcePath)),
    publicRestrictedStatus:
      "review-only raw source; no generated publish/restricted status exists yet",
    expectedGeneratedTitle: expectedTitle,
    titleEvidence,
    expectedAuthor,
    authorEvidence,
    apparentWorkType,
    detectedStructuralConvention: headingPlan.convention,
    structureConfidence: analysis.confidenceLevel,
    meaningfulHeadingsExist: headingPlan.meaningfulHeadings.length > 0,
    meaningfulHeadingExamples: sectionExamples,
    realReadableStart: `${firstLabel}: ${firstPreview}`,
    realReadableEnd: readableEndSnippet(cleaned.cleanedText),
    frontMatterDefaultPolicy: frontMatterPolicy,
    sourceNoisePresent: noise,
    expectedFirstDefaultSection: firstLabel,
    expectedDefaultReadableSections: `all ${headingPlan.likelySectionCount} planned ${headingPlan.convention} sections unless a future write inspection demotes true front/back matter`,
    likelySectionCount: headingPlan.likelySectionCount,
    likelyPreviewStart: firstPreview,
    frontMatterToExcludeOrPreserveNonDefault: frontMatterPolicy,
    endMatterToExclude: endMatterPolicy,
    expectedStartBoundary: singleStory
      ? `start at first readable prose after source/title/byline wrapper: ${singleStoryStartPhrase}`
      : sectioningOverride
      ? `start at ${sectioningOverride.label}: ${sectioningOverride.startPhrase}`
      : `start at cleaned-body line ${first.lineNumber}: ${first.normalized}`,
    expectedEndBoundary: "end before Project Gutenberg footer/license and before trailing transcriber, catalog, or source notes",
    expectedSectioningStrategy: `use ${headingPlan.strategyNote}; never replace meaningful headings with vague Part 1 / Part 2 chunks`,
    segmentationRisks:
      segmentationRisks.length > 0
        ? segmentationRisks
        : ["no structure red flags; preserve the detected source-based headings"],
    cleanupRisks,
    titleDefaultStartRisks: titleRisks,
    authorMetadataRisks: authorRisks,
    collectionTitleLeakageRisks: collectionRisks,
    illustrationPageMarkerFootnoteRisks:
      artifactRisks.length > 0 ? artifactRisks : ["no obvious illustration/page-marker/footnote risk in snippets"],
    duplicateNearDuplicateSlugCheck: nearDuplicateGeneratedSlugCheck(
      structureBook,
      expectedTitle,
      generatedSlugs,
    ),
    selectedSourceOrderingRisk:
    "no generated selected-source exists yet; future write must make selected-source text begin with this first selected/default section",
    currentStatus: "needs first-time controlled processing",
    recommendationForNextPass: "controlled first-time processing",
    priorAuditSignals: {
      pass2Risk: pass2Book?.pass2Risk ?? null,
      pass2Reasons: pass2Book?.pass2RiskReasons ?? [],
      structureRecommendedHandling: structureBook.recommendedHandling,
      structureRedFlags: structureBook.redFlags,
      startBoundaryConfidence: structureBook.startBoundaryConfidence,
      endBoundaryConfidence: structureBook.endBoundaryConfidence,
    },
    snippets: {
      title: titleEvidence.text,
      author: authorEvidence.text,
      start: `${firstLabel} ${firstPreview}`,
      end: readableEndSnippet(cleaned.cleanedText),
    },
  };
}

function statusCounts(books: BookDryRunResult[]) {
  return {
    controlledFirstTimeProcessing: books.filter(
      (book) => book.recommendationForNextPass === "controlled first-time processing",
    ).length,
    manualReview: books.filter((book) => book.currentStatus === "manual review").length,
    blocked: books.filter((book) => book.currentStatus === "blocked").length,
  };
}

function bookMarkdown(book: BookDryRunResult) {
  return [
    `# Pilot Dry Run ${dryRunBatch}: ${book.slug}`,
    "",
    `- Candidate type: ${book.candidateType}`,
    `- Source file used: \`${book.sourceFileUsed}\``,
    `- Source folder: \`${book.sourceFolder}\``,
    `- Public/restricted status: ${book.publicRestrictedStatus}`,
    `- Expected title: ${escapeMarkdown(book.expectedGeneratedTitle)}`,
    `- Title evidence: ${escapeMarkdown(book.titleEvidence.source)}${
      book.titleEvidence.lineNumber ? ` line ${book.titleEvidence.lineNumber}` : ""
    } - ${escapeMarkdown(book.titleEvidence.text)}`,
    `- Expected author: ${escapeMarkdown(book.expectedAuthor.join(", "))}`,
    `- Author evidence: ${escapeMarkdown(book.authorEvidence.source)}${
      book.authorEvidence.lineNumber ? ` line ${book.authorEvidence.lineNumber}` : ""
    } - ${escapeMarkdown(book.authorEvidence.text)}`,
    `- Apparent work type: ${book.apparentWorkType}`,
    `- Detected structural convention: ${escapeMarkdown(book.detectedStructuralConvention)}`,
    `- Structure confidence: ${book.structureConfidence}`,
    `- Meaningful headings exist: ${book.meaningfulHeadingsExist ? "yes" : "no"}`,
    `- Expected first default section: ${escapeMarkdown(book.expectedFirstDefaultSection)}`,
    `- Front matter to exclude/preserve non-default: ${escapeMarkdown(book.frontMatterToExcludeOrPreserveNonDefault)}`,
    `- End matter to exclude: ${escapeMarkdown(book.endMatterToExclude)}`,
    `- Expected start boundary: ${escapeMarkdown(book.expectedStartBoundary)}`,
    `- Expected end boundary: ${escapeMarkdown(book.expectedEndBoundary)}`,
    `- Expected sectioning strategy: ${escapeMarkdown(book.expectedSectioningStrategy)}`,
    `- Expected default-readable sections: ${escapeMarkdown(book.expectedDefaultReadableSections)}`,
    `- Likely section count: ${book.likelySectionCount}`,
    `- Expected preview start: ${escapeMarkdown(book.likelyPreviewStart)}`,
    `- Duplicate/near-duplicate slug check: ${escapeMarkdown(book.duplicateNearDuplicateSlugCheck)}`,
    `- Current status: ${book.currentStatus}`,
    `- Recommendation for next pass: ${book.recommendationForNextPass}`,
    "",
    "## Cleanup Risks",
    "",
    bulletList(book.cleanupRisks),
    "",
    "## Title/Default-Start Risks",
    "",
    bulletList(book.titleDefaultStartRisks),
    "",
    "## Segmentation Risks",
    "",
    bulletList(book.segmentationRisks),
    "",
    "## Author Metadata Risks",
    "",
    bulletList(book.authorMetadataRisks),
    "",
    "## Collection-Title Leakage Risks",
    "",
    bulletList(book.collectionTitleLeakageRisks),
    "",
    "## Illustration/Page/Footnote Risks",
    "",
    bulletList(book.illustrationPageMarkerFootnoteRisks),
    "",
    "## Supporting Snippets",
    "",
    `- Title: ${escapeMarkdown(book.snippets.title)}`,
    `- Author: ${escapeMarkdown(book.snippets.author)}`,
    `- Start: ${escapeMarkdown(book.snippets.start)}`,
    `- End: ${escapeMarkdown(book.snippets.end)}`,
    "",
    "## Heading Examples",
    "",
    bulletList(book.meaningfulHeadingExamples),
    "",
  ].join("\n");
}

function escapeMarkdown(input: string) {
  return input.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function bulletList(items: string[]) {
  return items.length > 0
    ? items.map((item) => `- ${escapeMarkdown(item)}`).join("\n")
    : "- None.";
}

function mainMarkdown(report: DryRunReport) {
  const rows = report.books
    .map(
      (book) =>
        `| ${book.slug} | ${book.apparentWorkType} | ${escapeMarkdown(
          book.expectedGeneratedTitle,
        )} | ${escapeMarkdown(book.expectedAuthor.join(", "))} | ${escapeMarkdown(
          book.detectedStructuralConvention,
        )} | ${book.likelySectionCount} | ${book.currentStatus} |`,
    )
    .join("\n");

  return [
    `# Pilot Book Processing Dry Run ${dryRunBatch}`,
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a dry-run/report-only pass. It does not write generated books, create preview assets, modify raw sources, modify Cloudflare exports, or run all-book processing.",
    "",
    "## Inputs",
    "",
    report.inputReports.map((input) => `- \`${input}\``).join("\n"),
    `- \`${report.sourceDetectorUsed}\``,
    "",
    "## Selected Books",
    "",
    report.selectedBooks.map((slug) => `- ${slug}`).join("\n"),
    "",
    "## Counts",
    "",
    `- Selected books: ${report.selectedCount}`,
    `- Raw-only selected: ${report.candidateTypeCounts.rawOnly}`,
    `- Unresolved-source generated report-only: ${report.candidateTypeCounts.unresolvedSourceGeneratedReportOnly}`,
    `- Needs first-time controlled processing: ${report.counts.controlledFirstTimeProcessing}`,
    `- Manual review: ${report.counts.manualReview}`,
    `- Blocked: ${report.counts.blocked}`,
    `- Skipped/unsafe raw-only candidates: ${report.counts.skippedUnsafe}`,
    `- Accepted/corrected/verified exclusion count: ${report.acceptedExclusion.count}`,
    "",
    "## Duplicate/Near-Duplicate Candidates Skipped",
    "",
    report.duplicateNearDuplicateCandidatesSkipped
      .map((book) => `- ${book.slug}: ${escapeMarkdown(book.reason)}`)
      .join("\n"),
    "",
    "## Boundary-Defect Candidates Skipped",
    "",
    report.boundaryDefectCandidatesSkipped
      .map((book) => `- ${book.slug}: ${escapeMarkdown(book.reason)}`)
      .join("\n"),
    "",
    "## Unresolved-Source Generated Books Left Untouched",
    "",
    report.unresolvedSourceGeneratedBooksLeftUntouched
      .map(
        (book) =>
          `- ${book.slug}: ${escapeMarkdown(book.title)}; ${book.generatedSectionCount} generated sections; ${book.reason}`,
      )
      .join("\n"),
    "",
    "## Recommendation Table",
    "",
    "| Slug | Type | Expected title | Expected author | Structure | Sections | Status |",
    "| --- | --- | --- | --- | --- | ---: | --- |",
    rows,
    "",
    "## Accepted Status Ambiguities",
    "",
    report.acceptedExclusion.ambiguities.length > 0
      ? bulletList(report.acceptedExclusion.ambiguities)
      : "- None.",
    "",
    "## Future Batch Rules",
    "",
    bulletList(report.futureBatchRules),
    "",
    "## Later-Phase Requirements",
    "",
    bulletList(report.laterPhaseRequirements),
    "",
    "## Protected Folder Confirmation",
    "",
    "- `app/client/assets/temp-books` was read but not modified.",
    "- `app/client/assets/books/generated` was read for exclusion checks but not modified.",
    "- `app/client/assets/books/cloudflare-export` was not modified.",
    "- `public/book-previews` was not modified.",
    "",
  ].join("\n");
}

function assertInputs() {
  for (const relativePath of [...inputReportPaths, ...acceptedReportPaths]) {
    assertReadableInput(path.join(repoRoot, relativePath));
  }
  assertReadableInput(structureJsonPath);
  assertReadableInput(pass2JsonPath);
  assertReadableInput(libraryManifestPath);
  assertReadableInput(path.join(repoRoot, "scripts/books/lib/book-structure-detection.ts"));
}

function buildReport() {
  assertInputs();
  const branch = gitOutput(["branch", "--show-current"]);
  const allowedBranches = new Set([
    "main",
    `morsewords-book-processing-pilot-dry-run-${dryRunBatch}-jun-2026`,
  ]);
  if (!allowedBranches.has(branch)) {
    throw new Error(`Expected dry-run ${dryRunBatch} validation branch, got ${branch}`);
  }

  const { accepted, ambiguities } = deriveAcceptedSlugs();
  const structure = readJson<{ books: StructureAuditBook[] }>(structureJsonPath);
  const pass2 = readJson<{ books: PriorPassBook[] }>(pass2JsonPath);
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const pass2BySlug = new Map(pass2.books.map((book) => [book.slug, book]));
  const structureBySlug = new Map(structure.books.map((book) => [book.slug, book]));
  const generatedSlugs = new Set(library.books.map((book) => book.slug));

  const rawOnlyCandidatePool = structure.books.filter(
    (book) =>
      !generatedSlugs.has(book.slug) &&
      !accepted.has(book.slug) &&
      !knownManualBlockedSuspicious.has(book.slug),
  );

  const books = selectedBatch.map((slug) => {
    const structureBook = structureBySlug.get(slug);
    if (!structureBook) throw new Error(`Selected slug missing from structure audit: ${slug}`);
    const result = inspectBook(
      slug,
      structureBook,
      pass2BySlug.get(slug),
      generatedSlugs,
      accepted,
    );
    writeJson(path.join(reportBooksRoot, `${slug}.json`), result);
    writeText(path.join(reportBooksRoot, `${slug}.md`), bookMarkdown(result));
    return result;
  });

  const selectedSet = new Set(selectedBatch);
  const unresolvedGenerated = unresolvedGeneratedSlugs.map((slug) => {
    const book = library.books.find((candidate) => candidate.slug === slug);
    if (!book) throw new Error(`Expected unresolved generated slug missing: ${slug}`);
    return {
      slug,
      title: book.title,
      candidateType: "unresolved-source generated, report-only" as const,
      generatedSectionCount: book.stats.sectionCount,
      reason:
        "Left untouched because no exact raw source was safely resolved from temp-books for this dry-run.",
    };
  });
  const counts = statusCounts(books);
  const rejectedBySafetyGates = rawOnlyCandidatePool.filter(
    (book) => !selectedSet.has(book.slug),
  ).length;

  const report: DryRunReport = {
    schemaVersion: 1,
    reportName: dryRunReportName,
    generatedAt: new Date().toISOString(),
    branch,
    baseMainCommit: gitOutput(["rev-parse", "main"]),
    mode: "dry-run/report-only",
    selectedBooks: [...selectedBatch],
    selectedCount: selectedBatch.length,
    candidateTypeCounts: {
      rawOnly: books.length,
      unresolvedSourceGeneratedReportOnly: unresolvedGenerated.length,
    },
    counts: {
      ...counts,
      skippedUnsafe: rejectedBySafetyGates,
    },
    acceptedExclusion: {
      count: accepted.size,
      reportInputs: [...acceptedReportPaths],
      ambiguities,
    },
    candidatePool: {
      rawOnlyCandidatesConsidered: rawOnlyCandidatePool.length,
      knownManualBlockedSuspiciousExcludedCount: knownManualBlockedSuspicious.size,
      selectedRawOnlyCount: books.length,
      rejectedBySafetyGatesCount: rejectedBySafetyGates,
    },
    unresolvedSourceGeneratedBooksLeftUntouched: unresolvedGenerated,
    duplicateNearDuplicateCandidatesSkipped: [...duplicateNearDuplicateCandidatesSkipped],
    boundaryDefectCandidatesSkipped: [...boundaryDefectCandidatesSkipped],
    inputReports: [...inputReportPaths],
    sourceDetectorUsed: "scripts/books/lib/book-structure-detection.ts",
    protectedPaths: {
      rawSourceInput: relativeToRepo(tempBooksRoot),
      generatedBooks: relativeToRepo(generatedRoot),
      cloudflareExport: relativeToRepo(cloudflareRoot),
      previewAssets: relativeToRepo(previewRoot),
    },
    futureBatchRules: [
      "Future book batches fail unless each processed book has valid generated readable content.",
      "Future book batches fail unless each processed book has the correct generated title.",
      "Future book batches fail unless each processed book has correct author/compiler/collector/translator metadata or a documented unresolved-author policy.",
      "Future book batches fail if duplicate generated work appears under a slightly different slug without intentional documentation.",
      "Future book batches fail unless the first default section begins with real readable content.",
      "Future book batches fail unless all main readable sections are included by default.",
      "Future book batches fail unless segmentation is meaningful and source-based.",
      "Future book batches fail unless startup preview is valid, book-specific, and starts from real readable generated content.",
      "Future book batches fail if preview contains SOS Help! or generic preview fallback text.",
      "Future book batches fail if title/TOC/source/license/contributor/transcriber/byline/parent-collection material enters default playback.",
      "Future book batches fail unless selected/default source order begins from the first selected/default section.",
      "Do not mark a book safe when meaningful headings exist but proposed output would become vague Part 1 / Part 2 chunks.",
      "Do not mark a book safe when the expected generated title would be inherited from a parent collection instead of the actual book or story identity.",
      "Do not mark a book safe when the author would be Unknown Author even though the source clearly identifies an author.",
      "Do not mark a book safe when the first default content would not be the real readable opening.",
      "Do not mark a book safe when Chapter 1, Part 1, first story, or prologue would be missing or excluded incorrectly.",
      "Do not allow title page, parent collection title, byline, contents, source notes, illustration captions, contributor notes, transcriber notes, or license material into default playback.",
      "Do not allow previews to start after the true beginning.",
      "Do not allow selected/default source order to begin anywhere other than the first selected/default section.",
      "Do not ignore meaningful story, play, poem, letter, chapter, part, or section structure.",
      "Do not rely only on literal words like chapter, volume, or part; use repeated heading patterns, body/TOC matches, paragraph shape, spacing, and section length distribution.",
      "Do not accept a future write unless generated readable content is valid, the title is correct, the author/compiler/collector/translator metadata is correct or has a documented unresolved-author policy, all main readable sections are selected by default, and the startup preview is book-specific.",
      "Do not accept SOS Help!, generic preview fallback, or title/TOC/source/license/contributor/transcriber/byline/parent-collection material as default playback.",
    ],
    laterPhaseRequirements: [
      "After all books are processed, run an independent second-pass audit using a different strategy.",
      "After books and the second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page.",
      "After summaries, perform full site SEO/meta review using GSC data and route-level intent.",
      "After books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages.",
      "Investigate the SSR heap OOM separately if it keeps appearing during plain npm run build.",
      "Final cleanup should remove temporary audit scripts/reports and code bloat only after everything is stable.",
    ],
    books,
  };

  writeJson(mainJsonPath, report);
  writeText(mainMarkdownPath, mainMarkdown(report));

  console.log(`Pilot dry-run ${dryRunBatch} selected: ${report.selectedCount}`);
  console.log(
    `First-time processing: ${report.counts.controlledFirstTimeProcessing}; manual review: ${report.counts.manualReview}; blocked: ${report.counts.blocked}; skipped/unsafe: ${report.counts.skippedUnsafe}`,
  );
  console.log(`Accepted/corrected/verified exclusions: ${report.acceptedExclusion.count}`);
  console.log(`Report written to ${relativeToRepo(mainJsonPath)}`);
}

buildReport();
