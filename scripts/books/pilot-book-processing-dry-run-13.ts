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
  expectedCreatorRole: string;
  metadataEvidence: Evidence[];
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
    metadata: string;
    start: string;
    end: string;
  };
};

type DryRunReport = {
  schemaVersion: 1;
  reportName:
    | "pilot-dry-run-13"
    | "pilot-dry-run-14"
    | "pilot-dry-run-15"
    | "pilot-dry-run-16"
    | "pilot-dry-run-17"
    | "pilot-dry-run-18"
    | "pilot-dry-run-19"
    | "pilot-dry-run-20";
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
  sharedDryRunScriptScopeFinding: {
    classification: string;
    files: string[];
    resolution: string;
    unrelatedChangesFound: boolean;
  };
  inputReports: string[];
  sourceDetectorUsed: string;
  protectedPaths: {
    rawSourceInput: string;
    generatedBooks: string;
    cloudflareExport: string;
    previewAssets: string;
  };
  backlogNote: string;
  futureBatchRules: string[];
  laterPhaseRequirements: string[];
  books: BookDryRunResult[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const dryRunBatch = process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "20"
  ? 20
  : process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "19"
    ? 19
    : process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "18"
      ? 18
      : process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "17"
        ? 17
        : process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "16"
          ? 16
          : process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "15"
            ? 15
            : process.env.MORSEWORDS_PILOT_DRY_RUN_BATCH === "14"
              ? 14
              : 13;
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
  "app/client/assets/books/audit-reports/pilot-write-1-verification/pilot-write-1-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-2/pilot-write-2.json",
  "app/client/assets/books/audit-reports/pilot-write-2-verification/pilot-write-2-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-3/pilot-write-3.json",
  "app/client/assets/books/audit-reports/pilot-write-3-verification/pilot-write-3-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-4/pilot-write-4.json",
  "app/client/assets/books/audit-reports/pilot-write-4-verification/pilot-write-4-verification.json",
  "app/client/assets/books/audit-reports/pilot-write-5/pilot-write-5.json",
  "app/client/assets/books/audit-reports/pilot-write-5-verification/pilot-write-5-verification.json",
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
  ...(dryRunBatch >= 15
    ? [
        "app/client/assets/books/audit-reports/batch-12-prose-restoration/batch-12-prose-restoration.json",
      ]
    : []),
  ...(dryRunBatch >= 14
    ? [
        "app/client/assets/books/audit-reports/pilot-write-13/pilot-write-13.json",
        "app/client/assets/books/audit-reports/pilot-write-13-verification/pilot-write-13-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 15
    ? [
        "app/client/assets/books/audit-reports/pilot-write-14/pilot-write-14.json",
        "app/client/assets/books/audit-reports/pilot-write-14-verification/pilot-write-14-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 16
    ? [
        "app/client/assets/books/audit-reports/pilot-write-15/pilot-write-15.json",
        "app/client/assets/books/audit-reports/pilot-write-15-verification/pilot-write-15-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 17
    ? [
        "app/client/assets/books/audit-reports/pilot-write-16/pilot-write-16.json",
        "app/client/assets/books/audit-reports/pilot-write-16-verification/pilot-write-16-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 18
    ? [
        "app/client/assets/books/audit-reports/pilot-write-17/pilot-write-17.json",
        "app/client/assets/books/audit-reports/pilot-write-17-verification/pilot-write-17-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 19
    ? [
        "app/client/assets/books/audit-reports/pilot-write-18/pilot-write-18.json",
        "app/client/assets/books/audit-reports/pilot-write-18-verification/pilot-write-18-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 20
    ? [
        "app/client/assets/books/audit-reports/pilot-write-19/pilot-write-19.json",
        "app/client/assets/books/audit-reports/pilot-write-19-verification/pilot-write-19-verification.json",
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
  ...(dryRunBatch >= 15
    ? [
        "app/client/assets/books/audit-reports/pilot-write-14-verification/pilot-write-14-verification.json",
        "app/client/assets/books/audit-reports/batch-12-prose-restoration/batch-12-prose-restoration.json",
      ]
    : []),
  ...(dryRunBatch >= 16
    ? [
        "app/client/assets/books/audit-reports/pilot-write-15-verification/pilot-write-15-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 17
    ? [
        "app/client/assets/books/audit-reports/pilot-write-16-verification/pilot-write-16-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 18
    ? [
        "app/client/assets/books/audit-reports/pilot-write-17-verification/pilot-write-17-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 19
    ? [
        "app/client/assets/books/audit-reports/pilot-write-18-verification/pilot-write-18-verification.json",
      ]
    : []),
  ...(dryRunBatch >= 20
    ? [
        "app/client/assets/books/audit-reports/pilot-write-19-verification/pilot-write-19-verification.json",
      ]
    : []),
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

const selectedBatch: readonly string[] = dryRunBatch === 20
  ? [
      "moti",
      "the-brown-bear-of-norway",
      "the-escape-of-the-mouse",
      "the-fairy-nurse",
      "the-four-gifts",
      "the-goat-s-ears-of-the-emperor-trojan",
      "the-groac-h-of-the-isle-of-lok",
      "the-heart-of-a-monkey",
      "the-hoodie-crow",
      "the-jogi-s-punishment",
      "the-king-of-the-waterfalls",
      "the-one-handed-girl",
      "the-raspberry-worm",
      "the-rich-brother-and-the-poor-brother",
      "jimmy-goggles-the-god",
      "miss-winchelsea-s-heart",
      "mr-brisher-s-treasure",
      "mr-ledbetter-s-vacation",
      "mr-skelmersdale-in-fairyland",
      "the-new-accelerator",
    ]
  : dryRunBatch === 19
  ? [
      "the-child-who-came-from-an-egg",
      "the-finest-liar-in-the-world",
      "the-frog",
      "the-grateful-prince",
      "the-headless-dwarfs",
      "the-lute-player",
      "the-maiden-with-the-wooden-helmet",
      "the-monkey-and-the-jelly-fish",
      "the-nine-pea-hens-and-the-golden-apples",
      "the-nunda-eater-of-people",
      "the-prince-who-wanted-to-see-the-world",
      "the-princess-who-was-hidden-underground",
      "the-story-of-a-gazelle",
      "the-story-of-halfman",
      "the-story-of-hassebu",
      "the-story-of-three-wonderful-beggars",
      "the-three-princes-and-their-beasts",
      "the-two-frogs",
      "the-underground-workers",
      "the-young-man-who-would-have-his-eyes-opened",
    ]
  : dryRunBatch === 18
  ? [
      "virgilius-the-sorcerer",
      "the-fairy-of-the-dawn",
      "the-brownie-of-the-lake",
      "the-girl-who-pretended-to-be-a-boy",
      "the-lady-of-the-fountain",
      "a-tale-of-the-tontlawald",
      "how-a-fish-swam-in-the-air-and-a-hare-in-the-water",
      "jesper-who-herded-the-hares",
      "mogarzea-and-his-son",
      "schippeitaro",
      "stan-bolovan",
      "the-battle-of-the-birds",
      "the-believing-husbands",
      "the-bones-of-djulung",
      "the-boys-with-the-golden-stars",
      "the-castle-of-kerglas",
      "the-enchanted-deer",
      "the-enchanted-knife",
      "the-envious-neighbour",
      "the-false-prince-and-the-true",
    ]
  : dryRunBatch === 17
  ? [
      "the-twelve-dancing-princesses",
      "the-twelve-huntsmen",
      "the-water-of-life",
      "the-white-snake",
      "the-willow-wren-and-the-bear",
      "the-wolf-and-the-seven-little-kids",
      "tom-thumb",
      "elder-tree-mother",
      "little-thumbelina",
      "sunshine-stories",
      "the-leaping-match",
      "a-fish-story",
      "a-french-puck",
      "a-lost-paradise",
      "how-brave-walter-hunted-wolves",
      "little-lasse",
      "the-sea-king-s-gift",
      "the-story-of-a-very-bad-boy",
      "the-three-crowns",
      "the-wonderful-tune",
    ]
  : dryRunBatch === 16
    ? [
      "the-purple-of-the-balkan-kings",
      "the-seven-cream-jugs",
      "the-sheep",
      "the-threat",
      "the-toys-of-peace",
      "the-wolves-of-cernogratz",
      "how-an-old-man-lost-his-wen",
      "momotaro-or-the-story-of-the-son-of-a-peach",
      "my-lord-bag-of-rice",
      "the-mirror-of-matsuyama",
      "the-ogre-of-rashomon",
      "the-quarrel-of-the-monkey-and-the-crab",
      "the-sagacious-monkey-and-the-boar",
      "the-shinansha-or-the-south-pointing-carriage",
      "the-stones-of-five-colors-and-the-empress-jokwa",
      "the-story-of-prince-yamato-take",
      "the-story-of-princess-hase",
      "the-white-hare-and-the-crocodiles",
      "the-golden-goose",
      "the-turnip",
    ]
  : dryRunBatch === 15
  ? [
      "a-bread-and-butter-miss",
      "bertie-s-christmas-eve",
      "excepting-mrs-pentherby",
      "fate",
      "forewarned",
      "hyacinth",
      "louis",
      "louise",
      "morlvera",
      "tea",
      "the-bull",
      "the-cupboard-of-the-yesterdays",
      "the-disappearance-of-crispina-umberleigh",
      "the-guests",
      "the-hedgehog",
      "the-image-of-the-lost-soul",
      "the-interlopers",
      "the-mappined-life",
      "the-occasional-garden",
      "the-phantom-luncheon",
    ]
  : dryRunBatch === 14
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
  "japanese-fairy-tales",
  "the-works-of-edgar-allan-poe",
  "snow-white-and-rose-red",
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
  {
    slug: "japanese-fairy-tales",
    reason:
      "Skipped as a parent-collection near-duplicate: its individual Ozaki tales are already represented by accepted generated story pages, and no distinct collection-page policy has been approved.",
  },
] as const;

const boundaryDefectCandidatesSkipped = [
  {
    slug: "the-works-of-edgar-allan-poe",
    reason:
      "Skipped as a known boundary-defect case; write batch 9 found raw Volume 2 begins with THE PURLOINED LETTER while the dry-run boundary would have dropped that opening collection content.",
  },
  {
    slug: "snow-white-and-rose-red",
    reason:
      "Skipped for boundary review: the raw excerpt appends a collection-level editorial note after the tale's true ending, so generic cleaned-source end detection would include non-story material.",
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
  "a-bread-and-butter-miss": "A Bread and Butter Miss",
  "bertie-s-christmas-eve": "Bertie's Christmas Eve",
  "excepting-mrs-pentherby": "Excepting Mrs. Pentherby",
  fate: "Fate",
  forewarned: "Forewarned",
  hyacinth: "Hyacinth",
  louis: "Louis",
  louise: "Louise",
  morlvera: "Morlvera",
  tea: "Tea",
  "the-bull": "The Bull",
  "the-cupboard-of-the-yesterdays": "The Cupboard of the Yesterdays",
  "the-disappearance-of-crispina-umberleigh":
    "The Disappearance of Crispina Umberleigh",
  "the-guests": "The Guests",
  "the-hedgehog": "The Hedgehog",
  "the-image-of-the-lost-soul": "The Image of the Lost Soul",
  "the-interlopers": "The Interlopers",
  "the-mappined-life": "The Mappined Life",
  "the-occasional-garden": "The Occasional Garden",
  "the-phantom-luncheon": "The Phantom Luncheon",
  "the-purple-of-the-balkan-kings": "The Purple of the Balkan Kings",
  "the-seven-cream-jugs": "The Seven Cream Jugs",
  "the-sheep": "The Sheep",
  "the-threat": "The Threat",
  "the-toys-of-peace": "The Toys of Peace",
  "the-wolves-of-cernogratz": "The Wolves of Cernogratz",
  "how-an-old-man-lost-his-wen": "How an Old Man Lost His Wen",
  "momotaro-or-the-story-of-the-son-of-a-peach":
    "Momotaro, or the Story of the Son of a Peach",
  "my-lord-bag-of-rice": "My Lord Bag of Rice",
  "the-mirror-of-matsuyama": "The Mirror of Matsuyama",
  "the-ogre-of-rashomon": "The Ogre of Rashomon",
  "the-quarrel-of-the-monkey-and-the-crab":
    "The Quarrel of the Monkey and the Crab",
  "the-sagacious-monkey-and-the-boar": "The Sagacious Monkey and the Boar",
  "the-shinansha-or-the-south-pointing-carriage":
    "The “Shinansha,” or the South Pointing Carriage",
  "the-stones-of-five-colors-and-the-empress-jokwa":
    "The Stones of Five Colors and the Empress Jokwa",
  "the-story-of-prince-yamato-take": "The Story of Prince Yamato Take",
  "the-story-of-princess-hase": "The Story of Princess Hase",
  "the-white-hare-and-the-crocodiles": "The White Hare and the Crocodiles",
  "the-golden-goose": "The Golden Goose",
  "the-turnip": "The Turnip",
  "the-twelve-dancing-princesses": "The Twelve Dancing Princesses",
  "the-twelve-huntsmen": "The Twelve Huntsmen",
  "the-water-of-life": "The Water of Life",
  "the-white-snake": "The White Snake",
  "the-willow-wren-and-the-bear": "The Willow-Wren and the Bear",
  "the-wolf-and-the-seven-little-kids": "The Wolf and the Seven Little Kids",
  "tom-thumb": "Tom Thumb",
  "elder-tree-mother": "Elder-Tree Mother",
  "little-thumbelina": "Little Thumbelina",
  "sunshine-stories": "Sunshine Stories",
  "the-leaping-match": "The Leaping Match",
  "a-fish-story": "A Fish Story",
  "a-french-puck": "A French Puck",
  "a-lost-paradise": "A Lost Paradise",
  "how-brave-walter-hunted-wolves": "How Brave Walter Hunted Wolves",
  "little-lasse": "Little Lasse",
  "the-sea-king-s-gift": "The Sea King’s Gift",
  "the-story-of-a-very-bad-boy": "The Story of a Very Bad Boy",
  "the-three-crowns": "The Three Crowns",
  "the-wonderful-tune": "The Wonderful Tune",
  "virgilius-the-sorcerer": "Virgilius the Sorcerer",
  "the-fairy-of-the-dawn": "The Fairy of the Dawn",
  "the-brownie-of-the-lake": "The Brownie of the Lake",
  "the-girl-who-pretended-to-be-a-boy": "The Girl Who Pretended to Be a Boy",
  "the-lady-of-the-fountain": "The Lady of the Fountain",
  "a-tale-of-the-tontlawald": "A Tale of the Tontlawald",
  "how-a-fish-swam-in-the-air-and-a-hare-in-the-water":
    "How a Fish Swam in the Air and a Hare in the Water",
  "jesper-who-herded-the-hares": "Jesper Who Herded the Hares",
  "mogarzea-and-his-son": "Mogarzea and His Son",
  schippeitaro: "Schippeitaro",
  "stan-bolovan": "Stan Bolovan",
  "the-battle-of-the-birds": "The Battle of the Birds",
  "the-believing-husbands": "The Believing Husbands",
  "the-bones-of-djulung": "The Bones of Djulung",
  "the-boys-with-the-golden-stars": "The Boys with the Golden Stars",
  "the-castle-of-kerglas": "The Castle of Kerglas",
  "the-enchanted-deer": "The Enchanted Deer",
  "the-enchanted-knife": "The Enchanted Knife",
  "the-envious-neighbour": "The Envious Neighbour",
  "the-false-prince-and-the-true": "The False Prince and the True",
  "the-child-who-came-from-an-egg": "The Child Who Came from an Egg",
  "the-finest-liar-in-the-world": "The Finest Liar in the World",
  "the-frog": "The Frog",
  "the-grateful-prince": "The Grateful Prince",
  "the-headless-dwarfs": "The Headless Dwarfs",
  "the-lute-player": "The Lute Player",
  "the-maiden-with-the-wooden-helmet": "The Maiden with the Wooden Helmet",
  "the-monkey-and-the-jelly-fish": "The Monkey and the Jelly-Fish",
  "the-nine-pea-hens-and-the-golden-apples":
    "The Nine Pea-Hens and the Golden Apples",
  "the-nunda-eater-of-people": "The Nunda, Eater of People",
  "the-prince-who-wanted-to-see-the-world":
    "The Prince Who Wanted to See the World",
  "the-princess-who-was-hidden-underground":
    "The Princess Who Was Hidden Underground",
  "the-story-of-a-gazelle": "The Story of a Gazelle",
  "the-story-of-halfman": "The Story of Halfman",
  "the-story-of-hassebu": "The Story of Hassebu",
  "the-story-of-three-wonderful-beggars":
    "The Story of Three Wonderful Beggars",
  "the-three-princes-and-their-beasts": "The Three Princes and Their Beasts",
  "the-two-frogs": "The Two Frogs",
  "the-underground-workers": "The Underground Workers",
  "the-young-man-who-would-have-his-eyes-opened":
    "The Young Man Who Would Have His Eyes Opened",
  moti: "Moti",
  "the-brown-bear-of-norway": "The Brown Bear of Norway",
  "the-escape-of-the-mouse": "The Escape of the Mouse",
  "the-fairy-nurse": "The Fairy Nurse",
  "the-four-gifts": "The Four Gifts",
  "the-goat-s-ears-of-the-emperor-trojan":
    "The Goat’s Ears of the Emperor Trojan",
  "the-groac-h-of-the-isle-of-lok": "The Groac’h of the Isle of Lok",
  "the-heart-of-a-monkey": "The Heart of a Monkey",
  "the-hoodie-crow": "The Hoodie-Crow",
  "the-jogi-s-punishment": "The Jogi’s Punishment",
  "the-king-of-the-waterfalls": "The King of the Waterfalls",
  "the-one-handed-girl": "The One-Handed Girl",
  "the-raspberry-worm": "The Raspberry Worm",
  "the-rich-brother-and-the-poor-brother":
    "The Rich Brother and the Poor Brother",
  "jimmy-goggles-the-god": "Jimmy Goggles the God",
  "miss-winchelsea-s-heart": "Miss Winchelsea’s Heart",
  "mr-brisher-s-treasure": "Mr. Brisher’s Treasure",
  "mr-ledbetter-s-vacation": "Mr. Ledbetter’s Vacation",
  "mr-skelmersdale-in-fairyland": "Mr. Skelmersdale in Fairyland",
  "the-new-accelerator": "The New Accelerator",
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
  "a-bread-and-butter-miss":
    "“Starling Chatter and Oakhill have both dropped back in the betting,”",
  "bertie-s-christmas-eve":
    "It was Christmas Eve, and the family circle of Luke Steffink, Esq., was",
  "excepting-mrs-pentherby":
    "It was Reggie Bruttle’s own idea for converting what had threatened to be",
  fate: "Rex Dillot was nearly twenty-four, almost good-looking and quite",
  forewarned:
    "Alethia Debchance sat in a corner of an otherwise empty railway carriage,",
  hyacinth:
    "“The new fashion of introducing the candidate’s children into an election",
  louis: "“It would be jolly to spend Easter in Vienna this year,” said",
  louise: "“The tea will be quite cold, you’d better ring for some more,” said the",
  morlvera:
    "The Olympic Toy Emporium occupied a conspicuous frontage in an important",
  tea: "James Cushat-Prinkly was a young man who had always had a settled",
  "the-bull":
    "Tom Yorkfield had always regarded his half-brother, Laurence, with a lazy",
  "the-cupboard-of-the-yesterdays":
    "“War is a cruelly destructive thing,” said the Wanderer, dropping his",
  "the-disappearance-of-crispina-umberleigh":
    "In a first-class carriage of a train speeding Balkanward across the flat,",
  "the-guests": "“The landscape seen from our windows is certainly charming,” said",
  "the-hedgehog":
    "A “Mixed Double” of young people were contesting a game of lawn tennis at",
  "the-image-of-the-lost-soul":
    "There were a number of carved stone figures placed at intervals along the",
  "the-interlopers":
    "In a forest of mixed growth somewhere on the eastern spurs of the",
  "the-mappined-life":
    "“These Mappin Terraces at the Zoological Gardens are a great improvement",
  "the-occasional-garden":
    "“Don’t talk to me about town gardens,” said Elinor Rapsley; “which means,",
  "the-phantom-luncheon":
    "“The Smithly-Dubbs are in Town,” said Sir James.  “I wish you would show",
  "the-purple-of-the-balkan-kings":
    "Luitpold Wolkenstein, financier and diplomat on a small, obtrusive,",
  "the-seven-cream-jugs":
    "“I suppose we shall never see Wilfred Pigeoncote here now that he has",
  "the-sheep":
    "The enemy had declared “no trumps.”  Rupert played out his ace and king",
  "the-threat":
    "Sir Lulworth Quayne sat in the lounge of his favourite restaurant, the",
  "the-toys-of-peace":
    "“Harvey,” said Eleanor Bope, handing her brother a cutting from a London",
  "the-wolves-of-cernogratz":
    "“Are there any old legends attached to the castle?” asked Conrad of his",
  "how-an-old-man-lost-his-wen":
    "Many, many years ago there lived a good old man who had a wen like a",
  "momotaro-or-the-story-of-the-son-of-a-peach":
    "Long, long ago there lived, an old man and an old woman; they were",
  "my-lord-bag-of-rice":
    "Long, long ago there lived, in Japan a brave warrior known to all as",
  "the-mirror-of-matsuyama":
    "Long years ago in old Japan there lived in the Province of Echigo, a",
  "the-ogre-of-rashomon":
    "Long, long ago in Kyoto, the people of the city were terrified by",
  "the-quarrel-of-the-monkey-and-the-crab":
    "Long, long ago, one bright autumn day in Japan, it happened, that a",
  "the-sagacious-monkey-and-the-boar":
    "Long, long ago, there lived in the province of Shinshin in Japan, a",
  "the-shinansha-or-the-south-pointing-carriage":
    "The compass, with its needle always pointing to the North, is quite a",
  "the-stones-of-five-colors-and-the-empress-jokwa":
    "Long, long ago there lived a great Chinese Empress who succeeded her",
  "the-story-of-prince-yamato-take":
    "The insignia of the great Japanese Empire is composed of three",
  "the-story-of-princess-hase":
    "Many, many years ago there lived in Nara, the ancient Capital of Japan,",
  "the-white-hare-and-the-crocodiles":
    "Long, long ago, when all the animals could talk, there lived in the",
  "the-golden-goose":
    "There was a man who had three sons, the youngest of whom was called",
  "the-turnip":
    "There were two brothers who were both soldiers; the one was rich and",
  "the-twelve-dancing-princesses":
    "There was a king who had twelve beautiful daughters. They slept in",
  "the-twelve-huntsmen":
    "There was once a king’s son who had a bride whom he loved very much.",
  "the-water-of-life":
    "Long before you or I were born, there reigned, in a country a great way",
  "the-white-snake":
    "A long time ago there lived a king who was famed for his wisdom through",
  "the-willow-wren-and-the-bear":
    "Once in summer-time the bear and the wolf were walking in the forest,",
  "the-wolf-and-the-seven-little-kids":
    "There was once upon a time an old goat who had seven little kids, and",
  "tom-thumb":
    "A poor woodman sat in his cottage one night, smoking his pipe by the",
  "elder-tree-mother":
    "THERE was once a little boy who had taken cold by going out and getting",
  "little-thumbelina":
    "THERE was once a woman who wished very much to have a little child.",
  "sunshine-stories":
    "\"I AM going to tell a story,\" said the Wind.",
  "the-leaping-match":
    "THE Flea, the Grasshopper, and the Frog once wanted to see which of them",
  "a-fish-story":
    "Perhaps you think that fishes were always fishes, and never lived",
  "a-french-puck":
    "Among the mountain pastures and valleys",
  "a-lost-paradise":
    "In the middle of a great forest there lived a long time ago a",
  "how-brave-walter-hunted-wolves":
    "A little back from the high road there stands a house",
  "little-lasse":
    "There was once a little boy whose name was Lars",
  "the-sea-king-s-gift":
    "There was once a fisherman who was called Salmon",
  "the-story-of-a-very-bad-boy":
    "Once upon a time there lived in a little village",
  "the-three-crowns":
    "There was once a king who had three daughters.",
  "the-wonderful-tune":
    "Maurice Connor was the king",
  "virgilius-the-sorcerer":
    "Long, long ago there was born to a Roman knight and his wife Maja a",
  "the-fairy-of-the-dawn":
    "Once upon a time what should happen DID happen; and if it had not",
  "the-brownie-of-the-lake":
    "Once upon a time there lived in France a man whose name was Jalm Riou.",
  "the-girl-who-pretended-to-be-a-boy":
    "Once upon a time there lived an emperor who was a great conqueror, and",
  "the-lady-of-the-fountain":
    "In the centre of the great hall in the castle of Caerleon upon Usk, king",
  "a-tale-of-the-tontlawald":
    "Long, long ago there stood in the midst of a country covered with lakes",
  "how-a-fish-swam-in-the-air-and-a-hare-in-the-water":
    "Once upon a time an old man and his wife lived together in a little",
  "jesper-who-herded-the-hares":
    "There was once a king who ruled over a kingdom somewhere between sunrise",
  "mogarzea-and-his-son":
    "There was once a little boy, whose father and mother, when they were",
  schippeitaro:
    "It was the custom in old times that as soon as a Japanese boy reached",
  "stan-bolovan":
    "Once upon a time what happened did happen, and if it had not happened",
  "the-battle-of-the-birds":
    "There was to be a great battle between all the creatures of the earth",
  "the-believing-husbands":
    "Once upon a time there dwelt in the land of Erin a young man who was",
  "the-bones-of-djulung":
    "In a beautiful island that lies in the southern seas, where chains of",
  "the-boys-with-the-golden-stars":
    "Once upon a time what happened did happen: and if it had not happened,",
  "the-castle-of-kerglas":
    "Peronnik was a poor idiot who belonged to nobody, and he would have died",
  "the-enchanted-deer":
    "A young man was out walking one day in Erin, leading a stout cart-horse",
  "the-enchanted-knife":
    "Once upon a time there lived a young man who vowed that he would never",
  "the-envious-neighbour":
    "Long, long ago an old couple lived in a village, and, as they had no",
  "the-false-prince-and-the-true":
    "The king had just awakened from his midday sleep, for it was summer, and",
  "the-child-who-came-from-an-egg":
    "Once upon a time there lived a queen whose heart was sore because she",
  "the-finest-liar-in-the-world":
    "At the edge of a wood there lived an old man who had only one son, and",
  "the-frog":
    "Once upon a time there was a woman who had three sons. Though they",
  "the-grateful-prince":
    "Once upon a time the king of the Goldland lost himself in a forest, and",
  "the-headless-dwarfs":
    "There was once a minister who spent his whole time in trying to find",
  "the-lute-player":
    "Once upon a time there was a king and queen who lived happily and",
  "the-maiden-with-the-wooden-helmet":
    "In a little village in the country of Japan there lived long, long ago a",
  "the-monkey-and-the-jelly-fish":
    "Children must often have wondered why jelly-fishes have no shells, like",
  "the-nine-pea-hens-and-the-golden-apples":
    "Once upon a time there stood before the palace of an emperor a golden",
  "the-nunda-eater-of-people":
    "Once upon a time there lived a sultan who loved his garden dearly,",
  "the-prince-who-wanted-to-see-the-world":
    "There was once a king who had only one son, and this young man tormented",
  "the-princess-who-was-hidden-underground":
    "Once there was a king who had great riches, which, when he died, he",
  "the-story-of-a-gazelle":
    "Once upon a time there lived a man who wasted all his money, and grew",
  "the-story-of-halfman":
    "In a certain town there lived a judge who was married but had no",
  "the-story-of-hassebu":
    "Once upon a time there lived a poor woman who had only one child, and",
  "the-story-of-three-wonderful-beggars":
    "There once lived a merchant whose name was Mark, and whom people called",
  "the-three-princes-and-their-beasts":
    "Once on a time there were three princes, who had a step-sister. One day",
  "the-two-frogs":
    "Once upon a time in the country of Japan there lived two frogs, one of",
  "the-underground-workers":
    "On a bitter night somewhere between Christmas and the New Year, a man",
  "the-young-man-who-would-have-his-eyes-opened":
    "Once upon a time there lived a youth who was never happy unless he was",
  moti: "Once upon a time there was a youth called Moti",
  "the-brown-bear-of-norway": "There was once a king in Ireland",
  "the-escape-of-the-mouse":
    "Manawyddan the prince and his friend Pryderi were wanderers",
  "the-fairy-nurse": "There was once a little farmer and his wife living near Coolgarrow",
  "the-four-gifts": "In the old land of Brittany, once called Cornwall",
  "the-goat-s-ears-of-the-emperor-trojan":
    "Once upon a time there lived an emperor whose name was Trojan",
  "the-groac-h-of-the-isle-of-lok": "In old times, when all kinds of wonderful things happened in Brittany",
  "the-heart-of-a-monkey": "A long time ago a little town made up of a collection",
  "the-hoodie-crow": "Once there lived a farmer who had three daughters",
  "the-jogi-s-punishment": "Once upon a time there came to the ancient city of Rahmatabad",
  "the-king-of-the-waterfalls": "When the young king of Easaidh Ruadh came into his kingdom",
  "the-one-handed-girl": "An old couple once lived in a hut under a grove of palm trees",
  "the-raspberry-worm": "‘Phew!’ cried Lisa",
  "the-rich-brother-and-the-poor-brother":
    "There was once a rich old man who had two sons",
  "jimmy-goggles-the-god": "“It isn't every one who's been a god,” said the sunburnt man",
  "miss-winchelsea-s-heart": "Miss Winchelsea was going to Rome",
  "mr-brisher-s-treasure": "“You can't be TOO careful WHO you marry,” said Mr. Brisher",
  "mr-ledbetter-s-vacation":
    "My friend, Mr. Ledbetter, is a round-faced little man",
  "mr-skelmersdale-in-fairyland": "“There's a man in that shop,” said the Doctor",
  "the-new-accelerator": "Certainly, if ever a man found a guinea when he was looking for a pin",
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
  "the-purple-of-the-balkan-kings",
  "the-seven-cream-jugs",
  "the-sheep",
  "the-threat",
  "the-toys-of-peace",
  "the-wolves-of-cernogratz",
  "how-an-old-man-lost-his-wen",
  "momotaro-or-the-story-of-the-son-of-a-peach",
  "my-lord-bag-of-rice",
  "the-mirror-of-matsuyama",
  "the-ogre-of-rashomon",
  "the-quarrel-of-the-monkey-and-the-crab",
  "the-sagacious-monkey-and-the-boar",
  "the-shinansha-or-the-south-pointing-carriage",
  "the-stones-of-five-colors-and-the-empress-jokwa",
  "the-story-of-prince-yamato-take",
  "the-story-of-princess-hase",
  "the-white-hare-and-the-crocodiles",
  "the-golden-goose",
  "the-turnip",
  "the-twelve-dancing-princesses",
  "the-twelve-huntsmen",
  "the-water-of-life",
  "the-white-snake",
  "the-willow-wren-and-the-bear",
  "the-wolf-and-the-seven-little-kids",
  "tom-thumb",
  "elder-tree-mother",
  "little-thumbelina",
  "sunshine-stories",
  "the-leaping-match",
  "a-fish-story",
  "a-french-puck",
  "a-lost-paradise",
  "how-brave-walter-hunted-wolves",
  "little-lasse",
  "the-sea-king-s-gift",
  "the-story-of-a-very-bad-boy",
  "the-three-crowns",
  "the-wonderful-tune",
  "virgilius-the-sorcerer",
  "the-fairy-of-the-dawn",
  "the-brownie-of-the-lake",
  "the-girl-who-pretended-to-be-a-boy",
  "the-lady-of-the-fountain",
  "a-tale-of-the-tontlawald",
  "how-a-fish-swam-in-the-air-and-a-hare-in-the-water",
  "jesper-who-herded-the-hares",
  "mogarzea-and-his-son",
  "schippeitaro",
  "stan-bolovan",
  "the-battle-of-the-birds",
  "the-believing-husbands",
  "the-bones-of-djulung",
  "the-boys-with-the-golden-stars",
  "the-castle-of-kerglas",
  "the-enchanted-deer",
  "the-enchanted-knife",
  "the-envious-neighbour",
  "the-false-prince-and-the-true",
  "the-child-who-came-from-an-egg",
  "the-finest-liar-in-the-world",
  "the-frog",
  "the-grateful-prince",
  "the-headless-dwarfs",
  "the-lute-player",
  "the-maiden-with-the-wooden-helmet",
  "the-monkey-and-the-jelly-fish",
  "the-nine-pea-hens-and-the-golden-apples",
  "the-nunda-eater-of-people",
  "the-prince-who-wanted-to-see-the-world",
  "the-princess-who-was-hidden-underground",
  "the-story-of-a-gazelle",
  "the-story-of-halfman",
  "the-story-of-hassebu",
  "the-story-of-three-wonderful-beggars",
  "the-three-princes-and-their-beasts",
  "the-two-frogs",
  "the-underground-workers",
  "the-young-man-who-would-have-his-eyes-opened",
  "moti",
  "the-brown-bear-of-norway",
  "the-escape-of-the-mouse",
  "the-fairy-nurse",
  "the-four-gifts",
  "the-goat-s-ears-of-the-emperor-trojan",
  "the-groac-h-of-the-isle-of-lok",
  "the-heart-of-a-monkey",
  "the-hoodie-crow",
  "the-jogi-s-punishment",
  "the-king-of-the-waterfalls",
  "the-one-handed-girl",
  "the-raspberry-worm",
  "the-rich-brother-and-the-poor-brother",
  "jimmy-goggles-the-god",
  "miss-winchelsea-s-heart",
  "mr-brisher-s-treasure",
  "mr-ledbetter-s-vacation",
  "mr-skelmersdale-in-fairyland",
  "the-new-accelerator",
]);

const dryRun17GrimmSlugs = new Set([
  "the-twelve-dancing-princesses",
  "the-twelve-huntsmen",
  "the-water-of-life",
  "the-white-snake",
  "the-willow-wren-and-the-bear",
  "the-wolf-and-the-seven-little-kids",
  "tom-thumb",
]);

const dryRun17AndersenSlugs = new Set([
  "elder-tree-mother",
  "little-thumbelina",
  "sunshine-stories",
  "the-leaping-match",
]);

const dryRun17LangSlugs = new Set([
  "a-fish-story",
  "a-french-puck",
  "a-lost-paradise",
  "how-brave-walter-hunted-wolves",
  "little-lasse",
  "the-sea-king-s-gift",
  "the-story-of-a-very-bad-boy",
  "the-three-crowns",
  "the-wonderful-tune",
]);

const dryRun18LangSlugs = new Set([
  "virgilius-the-sorcerer",
  "the-fairy-of-the-dawn",
  "the-brownie-of-the-lake",
  "the-girl-who-pretended-to-be-a-boy",
  "the-lady-of-the-fountain",
  "a-tale-of-the-tontlawald",
  "how-a-fish-swam-in-the-air-and-a-hare-in-the-water",
  "jesper-who-herded-the-hares",
  "mogarzea-and-his-son",
  "schippeitaro",
  "stan-bolovan",
  "the-battle-of-the-birds",
  "the-believing-husbands",
  "the-bones-of-djulung",
  "the-boys-with-the-golden-stars",
  "the-castle-of-kerglas",
  "the-enchanted-deer",
  "the-enchanted-knife",
  "the-envious-neighbour",
  "the-false-prince-and-the-true",
]);

const dryRun19LangSlugs = new Set([
  "the-child-who-came-from-an-egg",
  "the-finest-liar-in-the-world",
  "the-frog",
  "the-grateful-prince",
  "the-headless-dwarfs",
  "the-lute-player",
  "the-maiden-with-the-wooden-helmet",
  "the-monkey-and-the-jelly-fish",
  "the-nine-pea-hens-and-the-golden-apples",
  "the-nunda-eater-of-people",
  "the-prince-who-wanted-to-see-the-world",
  "the-princess-who-was-hidden-underground",
  "the-story-of-a-gazelle",
  "the-story-of-halfman",
  "the-story-of-hassebu",
  "the-story-of-three-wonderful-beggars",
  "the-three-princes-and-their-beasts",
  "the-two-frogs",
  "the-underground-workers",
  "the-young-man-who-would-have-his-eyes-opened",
]);

const dryRun20LangSlugs = new Set([
  "moti",
  "the-brown-bear-of-norway",
  "the-escape-of-the-mouse",
  "the-fairy-nurse",
  "the-four-gifts",
  "the-goat-s-ears-of-the-emperor-trojan",
  "the-groac-h-of-the-isle-of-lok",
  "the-heart-of-a-monkey",
  "the-hoodie-crow",
  "the-jogi-s-punishment",
  "the-king-of-the-waterfalls",
  "the-one-handed-girl",
  "the-raspberry-worm",
  "the-rich-brother-and-the-poor-brother",
]);

function isLangEditorSlug(slug: string) {
  return dryRun17LangSlugs.has(slug) ||
    dryRun18LangSlugs.has(slug) ||
    dryRun19LangSlugs.has(slug) ||
    dryRun20LangSlugs.has(slug);
}

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

function compactText(input: string | null | undefined, maxLength = 260) {
  if (!input) return "";
  const compact = input.replace(/\s+/g, " ").trim();
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

function creatorRoleFor(slug: string) {
  if (dryRun17GrimmSlugs.has(slug)) {
    return "authors: Jacob Grimm and Wilhelm Grimm (raw source labels them as authors)";
  }
  if (dryRun17AndersenSlugs.has(slug)) {
    return "author: H. C. Andersen; editor: J. H. Stickney";
  }
  if (isLangEditorSlug(slug)) {
    return "editor: Andrew Lang (Project Gutenberg labels him as author; visible source byline says Edited by)";
  }
  return "author as identified by the source";
}

function metadataEvidenceFor(rawText: string, slug: string, authorEvidence: Evidence) {
  const evidence = [authorEvidence];
  const roleEvidence = dryRun17GrimmSlugs.has(slug)
    ? findHeaderEvidence(rawText, /^By Jacob Grimm and Wilhelm Grimm$/i, "visible collection byline")
    : dryRun17AndersenSlugs.has(slug)
      ? findHeaderEvidence(rawText, /^Editor:\s*J\. H\. Stickney$/i, "Gutenberg Editor line")
      : isLangEditorSlug(slug)
        ? findHeaderEvidence(rawText, /^Edited by Andrew Lang$/i, "visible editor byline")
        : null;
  if (roleEvidence && !evidence.some((item) => item.text === roleEvidence.text)) {
    evidence.push(roleEvidence);
  }
  return evidence;
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

    if (relativePath.includes("batch-12-prose-restoration")) {
      const scope = report.scope as
        | {
            authorizedTargets?: unknown[];
            originalCorrectedTargets?: unknown[];
            additionalCorrectedTargets?: unknown[];
          }
        | undefined;
      const targets = [
        ...(scope?.authorizedTargets ?? []),
        ...(scope?.originalCorrectedTargets ?? []),
        ...(scope?.additionalCorrectedTargets ?? []),
      ];
      for (const slug of targets) {
        if (typeof slug === "string") accepted.add(slug);
      }
      continue;
    }

    if (
      relativePath.includes("pilot-write-1-verification") ||
      relativePath.includes("pilot-write-2-verification") ||
      relativePath.includes("pilot-write-3-verification") ||
      relativePath.includes("pilot-write-4-verification") ||
      relativePath.includes("pilot-write-5-verification") ||
      relativePath.includes("pilot-write-6-verification") ||
      relativePath.includes("pilot-write-7-verification") ||
      relativePath.includes("pilot-write-8-verification") ||
      relativePath.includes("pilot-write-9-verification") ||
      relativePath.includes("pilot-write-10-verification") ||
      relativePath.includes("pilot-write-11-verification") ||
      relativePath.includes("pilot-write-12-verification") ||
      relativePath.includes("pilot-write-13-verification") ||
      relativePath.includes("pilot-write-14-verification") ||
      relativePath.includes("pilot-write-15-verification") ||
      relativePath.includes("pilot-write-16-verification") ||
      relativePath.includes("pilot-write-17-verification") ||
      relativePath.includes("pilot-write-18-verification") ||
      relativePath.includes("pilot-write-19-verification")
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
  const theEndMatches = [...body.matchAll(/^[ \t]*THE END[ \t]*$/gim)];
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
  if (book.slug === "the-frog") {
    return "Distinct work confirmed from source: THE FROG opens with a woman and her three sons, unlike the accepted The Frog-Prince; the individual title and body evidence justify a separate slug.";
  }
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
  const expectedCreatorRole = creatorRoleFor(slug);
  const metadataEvidence = metadataEvidenceFor(rawText, slug, authorEvidence);

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
  const authorRisks = [
    ...(authorEvidence.source === "Gutenberg Author line"
      ? []
      : ["author did not come from a Gutenberg Author line; verify byline directly"]),
    ...(isLangEditorSlug(slug)
      ? ["future write must preserve Andrew Lang's editor role rather than imply original authorship of the traditional tale"]
      : []),
    ...(dryRun17AndersenSlugs.has(slug)
      ? ["J. H. Stickney is source-backed as editor and must not replace H. C. Andersen in the author field"]
      : []),
  ];
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
    expectedCreatorRole,
    metadataEvidence,
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
      metadata: metadataEvidence.map((item) => item.text).join("; "),
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
    `- Expected author/compiler/collector/translator/reteller role: ${escapeMarkdown(book.expectedCreatorRole)}`,
    `- Metadata evidence: ${escapeMarkdown(book.metadataEvidence.map((item) => `${item.source}${item.lineNumber ? ` line ${item.lineNumber}` : ""}: ${item.text}`).join("; "))}`,
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
    `- Metadata: ${escapeMarkdown(book.snippets.metadata)}`,
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
        )} | ${escapeMarkdown(book.expectedAuthor.join(", "))} | ${escapeMarkdown(book.expectedCreatorRole)} | ${escapeMarkdown(
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
    ...(dryRunBatch >= 14
      ? [
          "## Implementation Scope Note",
          "",
          `Dry-run ${dryRunBatch} intentionally uses \`scripts/books/pilot-book-processing-dry-run-13.ts\` as the shared implementation engine. The batch-${dryRunBatch} entry point only sets \`MORSEWORDS_PILOT_DRY_RUN_BATCH=${dryRunBatch}\` and imports that engine; batch 13 remains the default when the environment flag is absent. The shared-file diff is therefore required dry-run-${dryRunBatch} implementation, not an unrelated modification.`,
          `- Classification: ${report.sharedDryRunScriptScopeFinding.classification}`,
          `- Resolution: ${report.sharedDryRunScriptScopeFinding.resolution}`,
          `- Unrelated changes found: ${report.sharedDryRunScriptScopeFinding.unrelatedChangesFound ? "yes" : "no"}`,
          "",
        ]
      : []),
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
    "| Slug | Type | Expected title | Expected author | Creator role | Structure | Sections | Status |",
    "| --- | --- | --- | --- | --- | --- | ---: | --- |",
    rows,
    "",
    "## Accepted Status Ambiguities",
    "",
    report.acceptedExclusion.ambiguities.length > 0
      ? bulletList(report.acceptedExclusion.ambiguities)
      : "- None.",
    "",
    "## Backlog Note",
    "",
    report.backlogNote,
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
    sharedDryRunScriptScopeFinding: {
      classification: `harmless shared implementation intentionally used by dry-run ${dryRunBatch}`,
      files: [
        "scripts/books/pilot-book-processing-dry-run-13.ts",
        `scripts/books/pilot-book-processing-dry-run-${dryRunBatch}.ts`,
      ],
      resolution:
        `Retain the shared-engine change: dry-run ${dryRunBatch} adds only its report inputs, selection evidence, safety skips, metadata-role reporting, and environment dispatch while preserving batch 13 as the default.`,
      unrelatedChangesFound: false,
    },
    inputReports: [...inputReportPaths],
    sourceDetectorUsed: "scripts/books/lib/book-structure-detection.ts",
    protectedPaths: {
      rawSourceInput: relativeToRepo(tempBooksRoot),
      generatedBooks: relativeToRepo(generatedRoot),
      cloudflareExport: relativeToRepo(cloudflareRoot),
      previewAssets: relativeToRepo(previewRoot),
    },
    backlogNote:
      `${rejectedBySafetyGates} remaining skipped/unsafe raw-only candidates are retained for a final remaining inventory/triage pass after safe batching slows or is exhausted; none are lost or silently accepted.`,
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
      "Future book batches fail if cleanup removes real prose, punctuation, dialogue, or the readable ending.",
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
      "After safe batching slows or is exhausted, create a remaining raw inventory/triage report classifying every unprocessed raw file.",
      "After all books are processed, run an independent second-pass audit using a different strategy.",
      "After books and the second-pass audit, add original non-spoiler 300-500+ word SEO summaries for each accepted book page.",
      "After summaries, perform full site SEO/meta review using GSC data and route-level intent.",
      "After books/SEO, run a focused rage-click UX pass for /audio, /practice, homepage, and related utility pages.",
      "Investigate the SSR heap OOM separately.",
      "Investigate the in-app Browser sandbox issue separately.",
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
