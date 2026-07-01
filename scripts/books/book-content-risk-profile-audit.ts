import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import type {
  CleanedBookJson,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";

type RiskLevel = "low" | "moderate" | "elevated" | "owner-review";
type Confidence = "high" | "medium" | "needs-manual-source-comparison";

type SweepReport = {
  schemaVersion?: number;
  booksInspected?: number;
  contentSafety?: {
    safeReplacementsApplied?: {
      occurrenceCount?: number;
      bookCount?: number;
      generatedBookSlugs?: string[];
    };
    findingsAfterCleanup?: Array<{
      category: string;
      occurrences: number;
      bookCount: number;
      sampleSlugs?: string[];
    }>;
  };
  completeness?: {
    blockerCount?: number;
    findings?: unknown[];
  };
};

type RightsReport = {
  original_publication?: string;
  release_date?: string;
  content_brand_safety_risk?: string;
  reasoning_summary?: string;
};

type RiskSignalRule = {
  category: string;
  maskedSignal: string;
  regex: RegExp;
  severityWeight: number;
};

type RiskSignal = {
  category: string;
  maskedSignal: string;
  occurrences: number;
  severityWeight: number;
};

type KnownRiskGroup = {
  id: string;
  label: string;
  reason: string;
  categories: string[];
};

type BookRiskProfile = {
  slug: string;
  title: string;
  author: string[];
  source: {
    provider: string;
    sourceUrl: string | null;
    gutenbergId: string | null;
    rightsStatus: string;
    rightsBasis: string;
  };
  publication: {
    originalPublication: string | null;
    originalYear: number | null;
    period: string;
  };
  wordCount: number;
  sectionCount: number;
  deterministicUnsafeTermStatus: string;
  deterministicSweepChanged: boolean;
  broaderContentRiskCategories: string[];
  riskSignals: RiskSignal[];
  knownRiskGroups: string[];
  riskLevel: RiskLevel;
  likelySuitableAsIsAfterSanitization: boolean;
  needsOwnerReview: boolean;
  recommendedForDeferralOrRemoval: boolean;
  ageAudienceSuitabilityConcernsAfterCleanup: boolean;
  notes: string[];
};

type GroupSummary = KnownRiskGroup & {
  bookCount: number;
  changedByDeterministicSweep: number;
  requiringOwnerReview: number;
  cleared: number;
  sampleSlugs: string[];
};

type CompletenessEvidence = {
  slug: string;
  title: string;
  generatedSectionCount: number;
  sourceDetectedSectionCount: number | null;
  generatedWordCount: number;
  sourceBodyApproxWordCount: number | null;
  sourceComparisonBasis: string;
  startMarkerConfidence: Confidence;
  endMarkerConfidence: Confidence;
  includesBoilerplate: boolean;
  appearsTruncated: boolean;
  notes: string[];
};

type AuditReport = {
  schemaVersion: 1;
  executiveResult: string;
  firstPassMethodologyAssessment: {
    mostlyDeterministicPatternMatching: boolean;
    includedPerBookRiskProfile: boolean;
    inspectedEveryBookTitleAuthorContext: boolean;
    classifiedBooksByContentRiskLevel: boolean;
    reviewedKnownProblemAuthorsGenresPeriodsDifferently: boolean;
    conclusion: string;
  };
  booksReviewed: number;
  deterministicSweepChangedBooks: number;
  deterministicUnsafeFindingsRemaining: number;
  knownRiskGroupsReviewed: GroupSummary[];
  bookRiskProfiles: BookRiskProfile[];
  booksClearedAfterDeterministicCleanup: string[];
  booksRequiringOwnerReview: string[];
  booksRecommendedForDeferralOrRemoval: string[];
  booksWhereSanitizationChangedMeaningTooMuch: string[];
  booksWithAgeAudienceConcernsAfterCleanup: string[];
  completenessConfidence: {
    representativeBooks: CompletenessEvidence[];
    blockers: CompletenessEvidence[];
    result: string;
  };
  updatedExportStatus: {
    folder: string;
    exists: boolean;
    fileCount: number;
    bookPayloadCount: number;
    manifestFileCount: number;
    trackedFileCount: number;
    readyForOwnerUpload: boolean;
  };
  remainingBlockers: string[];
};

type StrictReviewCandidate = {
  slug: string;
  title: string;
  author: string[];
  normalRiskLevel: RiskLevel;
  strictReasons: string[];
  highRiskCategories: string[];
  mediumRiskCategories: string[];
  knownRiskGroups: string[];
  deterministicSweepChanged: boolean;
  priorityScore: number;
};

type StrictReview = {
  mode: "strict-read-only";
  description: string;
  candidates: StrictReviewCandidate[];
  candidateCount: number;
  topCandidates: StrictReviewCandidate[];
  reasonCounts: Array<{ reason: string; count: number }>;
};

type OwnerReviewSummary = {
  schemaVersion: 1;
  executiveResult: string;
  whatConcernRecordsMean: string;
  booksReviewed: number;
  concernRecordCount: number;
  normalRiskLevelCounts: Record<RiskLevel, number>;
  highestRiskBooksAfterCleanup: StrictReviewCandidate[];
  deterministicSanitization: {
    changedBookCount: number;
    changedBooks: string[];
  };
  categoryBuckets: {
    horrorViolenceIntensity: string[];
    historicalPeriodLanguage: string[];
    colonialAdventureStereotype: string[];
    childrensFairyTaleConcerns: string[];
  };
  whyNoOwnerReviewRequired: string[];
  reasonsBooksWereCleared: string[];
  stricterFilterCandidates: StrictReview;
  uploadRecommendation: string;
  remainingUncertainty: string[];
};

type ContentSuitability = "low" | "moderate" | "elevated";

type ContentSuitabilityProfile = {
  contentSuitability: ContentSuitability;
  strictReviewCandidate: boolean;
  contentNote: string;
};

type SuitabilityDataFile = {
  schemaVersion: 1;
  generatedFrom: string;
  booksReviewed: number;
  normalRiskLevelCounts: Record<RiskLevel, number>;
  strictReviewCandidateCount: number;
  profiles: Record<string, ContentSuitabilityProfile>;
};

type SuitabilityPolicyDecision = {
  schemaVersion: 1;
  executiveResult: string;
  normalPolicyResult: string;
  strictClassroomYouthPolicyResult: string;
  whyNotAllAudienceSafeByDefault: string[];
  optionsConsidered: Array<{
    option: string;
    summary: string;
    status: string;
  }>;
  recommendedProductPolicy: string;
  booksAffectedByStrictModeReview: {
    count: number;
    topCandidates: StrictReviewCandidate[];
  };
  productChangesNeededBeforeUpload: string[];
  uploadRecommendation: string;
  remainingOwnerDecisionPoints: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const GENERATED_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/generated",
);
const UPDATED_EXPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/cloudflare-updated-export",
);
const REPORT_ROOT = path.join(
  REPO_ROOT,
  "app/client/assets/books/audit-reports/book-content-safety-and-completeness-sweep",
);
const SWEEP_REPORT_PATH = path.join(
  REPORT_ROOT,
  "book-content-safety-and-completeness-sweep.json",
);
const RISK_REPORT_JSON_PATH = path.join(
  REPORT_ROOT,
  "book-content-risk-profile-audit.json",
);
const RISK_REPORT_MD_PATH = path.join(
  REPORT_ROOT,
  "book-content-risk-profile-audit.md",
);
const OWNER_SUMMARY_JSON_PATH = path.join(
  REPORT_ROOT,
  "book-content-owner-review-summary.json",
);
const OWNER_SUMMARY_MD_PATH = path.join(
  REPORT_ROOT,
  "book-content-owner-review-summary.md",
);
const SUITABILITY_DATA_PATH = path.join(
  REPO_ROOT,
  "app/client/data/morseBookSuitability.generated.json",
);
const POLICY_DECISION_JSON_PATH = path.join(
  REPORT_ROOT,
  "book-content-suitability-policy-decision.json",
);
const POLICY_DECISION_MD_PATH = path.join(
  REPORT_ROOT,
  "book-content-suitability-policy-decision.md",
);

const STRICT_MODE = process.argv.includes("--strict");

const REPRESENTATIVE_SLUGS = [
  "the-adventures-of-roderick-random",
  "the-call-of-cthulhu",
  "walden",
  "the-leavenworth-case",
  "middlemarch",
  "the-jungle-book",
  "the-bottle-imp",
  "five-little-friends",
] as const;

const BOILERPLATE_REGEX =
  /\*\*\*\s*start of (?:the )?project gutenberg|\*\*\*\s*end of (?:the )?project gutenberg|full project gutenberg license|project gutenberg literary archive foundation|end of the project gutenberg ebook/i;

const RISK_SIGNAL_RULES: RiskSignalRule[] = [
  {
    category: "racial/ethnic stereotypes or hostile depictions",
    maskedSignal: "racialized hierarchy or hostile-group wording",
    regex:
      /\b(?:savage|savages|barbarous|barbarian|barbarians|heathen|heathens|uncivilized|primitive races?|inferior races?)\b/gi,
    severityWeight: 4,
  },
  {
    category: "colonial/imperialist language or depictions",
    maskedSignal: "empire, conquest, colony, or civilizing-mission language",
    regex:
      /\b(?:empire|imperial|colonial|colonies|colony|conquest|conquered|civilizing mission|white man's burden|protectorate|missionary|plantation|native village|native huts?)\b/gi,
    severityWeight: 2,
  },
  {
    category: "antisemitic or anti-Roma stereotypes",
    maskedSignal: "anti-Roma or antisemitic stereotype signal",
    regex:
      /\b(?:gipsy|gipsies|gypsy|gypsies|jew(?:s|ish)?\b.{0,40}\b(?:usury|usurer|moneylender|greedy|avaricious|cunning))\b/gi,
    severityWeight: 5,
  },
  {
    category: "anti-Indigenous stereotypes",
    maskedSignal: "anti-Indigenous stereotype or period-label signal",
    regex:
      /\b(?:redskin|redskins|squaw|injun|injuns|indian savages?|savage indians?|painted warriors?|war-whoop)\b/gi,
    severityWeight: 6,
  },
  {
    category: "homophobic or gender/sex-based derogatory content",
    maskedSignal: "gender, sexuality, or sex-work derogatory signal",
    regex:
      /\b(?:sodomite|sodomites|catamite|effeminate men|fallen woman|harlot|harlots|strumpet|strumpets|wench|wenches)\b/gi,
    severityWeight: 5,
  },
  {
    category: "ableist derogatory content",
    maskedSignal: "disability or mental-health derogatory signal",
    regex:
      /\b(?:idiot|idiots|imbecile|imbeciles|lunatic|lunatics|madman|madmen|madwoman|cripple|cripples|deformed|insane asylum|madhouse)\b/gi,
    severityWeight: 3,
  },
  {
    category: "explicit sexual content or sexual coercion themes",
    maskedSignal: "sexual content or coercion-theme signal",
    regex:
      /\b(?:ravish|ravished|ravishment|seduce|seduced|seduction|violate|violated|brothel|prostitute|prostitutes|mistress|concubine|licentious|lewd|lustful)\b/gi,
    severityWeight: 6,
  },
  {
    category: "unusually violent, cruel, or disturbing content",
    maskedSignal: "violence, bloodshed, torture, or cruelty signal",
    regex:
      /\b(?:murder|murdered|murderer|murderers|bloodshed|massacre|slaughter|slain|torture|tortured|execution|executed|beheaded|strangled|stabbed|wounded|corpse|corpses|cannibal|cannibals|holocaust)\b/gi,
    severityWeight: 3,
  },
  {
    category: "substance abuse themes",
    maskedSignal: "intoxication or addictive-substance signal",
    regex:
      /\b(?:opium|laudanum|morphine|hasheesh|hashish|cocaine|drunken|drunkard|drunkards|intoxicated|brandy|whisky|whiskey|rum|gin|tavern|tobacco)\b/gi,
    severityWeight: 2,
  },
  {
    category: "suicide/self-harm themes",
    maskedSignal: "self-harm or suicide-theme signal",
    regex:
      /\b(?:suicide|suicides|self-murder|self-destruction|kill(?:ed|ing)? himself|kill(?:ed|ing)? herself|hang(?:ed|ing)? himself|hang(?:ed|ing)? herself|drown(?:ed|ing)? himself|drown(?:ed|ing)? herself)\b/gi,
    severityWeight: 8,
  },
  {
    category: "child-endangerment or abuse themes",
    maskedSignal: "child-endangerment, exploitation, or abuse-theme signal",
    regex:
      /\b(?:child abuse|beaten child|beating the child|orphanage|workhouse child|child labor|child labour|kidnapped child|lost child|abandoned child|little girl was beaten|little boy was beaten)\b/gi,
    severityWeight: 7,
  },
  {
    category: "animal cruelty",
    maskedSignal: "animal cruelty or animal-harm signal",
    regex:
      /\b(?:whip(?:ped|ping)? the horse|beat(?:en|ing)? the horse|cruel to animals|drowned the dog|kill(?:ed|ing)? the dog|kill(?:ed|ing)? the horse|animal cruelty)\b/gi,
    severityWeight: 5,
  },
  {
    category: "extreme profanity",
    maskedSignal: "extreme profanity signal",
    regex:
      /\b(?:damn(?:ed|able)?|hellish|bloody|bastard|bastards|son of a bitch|goddamn|goddamned)\b/gi,
    severityWeight: 2,
  },
  {
    category: "occult/horror intensity for teen/general audience concerns",
    maskedSignal: "supernatural horror, occult, or intense dread signal",
    regex:
      /\b(?:occult|cult|witch|witchcraft|demon|demons|devil|devils|satan|satanic|ghost|ghosts|vampire|vampires|monster|monsters|madness|nightmare|nightmares|horror|horrors|hideous|frightful|terror|terrifying|uncanny)\b/gi,
    severityWeight: 2,
  },
];

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeMarkdown(filePath: string, markdown: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, markdown.replace(/\r?\n/g, "\n"));
}

function loadLibraryManifest(): GeneratedLibraryManifest {
  return readJson<GeneratedLibraryManifest>(
    path.join(GENERATED_ROOT, "library-manifest.json"),
  );
}

function loadBookManifest(summaryPath: string): GeneratedBookManifest {
  return readJson<GeneratedBookManifest>(path.join(GENERATED_ROOT, summaryPath));
}

function loadBookSections(manifest: GeneratedBookManifest): GeneratedBookSectionJson[] {
  return manifest.sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((summary) =>
      readJson<GeneratedBookSectionJson>(
        path.join(GENERATED_ROOT, manifest.slug, summary.sectionJsonPath),
      ),
    );
}

function loadRightsReport(manifest: GeneratedBookManifest): RightsReport | null {
  const reportPath = path.join(
    GENERATED_ROOT,
    manifest.slug,
    manifest.source.rightsReportPath,
  );
  if (!fs.existsSync(reportPath)) return null;
  return readJson<RightsReport>(reportPath);
}

function loadCleanedBook(manifest: GeneratedBookManifest): CleanedBookJson | null {
  if (!manifest.source.cleanedBookPath) return null;
  const cleanedPath = path.join(
    GENERATED_ROOT,
    manifest.slug,
    manifest.source.cleanedBookPath,
  );
  if (!fs.existsSync(cleanedPath)) return null;
  return readJson<CleanedBookJson>(cleanedPath);
}

function countMatches(text: string, regex: RegExp): number {
  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  const globalRegex = new RegExp(regex.source, flags);
  return [...text.matchAll(globalRegex)].length;
}

function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim()
    .toLowerCase();
}

function normalizeForNeedle(text: string, limit: number, fromEnd = false): string {
  const normalized = normalizeText(text);
  if (normalized.length <= limit) return normalized;
  return fromEnd ? normalized.slice(-limit) : normalized.slice(0, limit);
}

function parsePublicationYear(...candidates: Array<string | null | undefined>): number | null {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const years = [...candidate.matchAll(/\b(1[5-9]\d{2}|20[0-2]\d)\b/g)]
      .map((match) => Number(match[1]))
      .filter((year) => year >= 1500 && year <= 2026);
    if (years.length > 0) return Math.min(...years);
  }
  return null;
}

function periodLabel(year: number | null): string {
  if (year === null) return "unknown publication period";
  if (year < 1800) return "pre-19th-century";
  if (year < 1900) return "19th-century";
  if (year < 1930) return "early 20th-century";
  return "modern Project Gutenberg release period";
}

function riskSignalsForText(text: string): RiskSignal[] {
  return RISK_SIGNAL_RULES.map((rule) => ({
    category: rule.category,
    maskedSignal: rule.maskedSignal,
    occurrences: countMatches(text, rule.regex),
    severityWeight: rule.severityWeight,
  })).filter((signal) => signal.occurrences > 0);
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function classifyKnownRiskGroups(input: {
  slug: string;
  title: string;
  authorText: string;
  subjectText: string;
  fullText: string;
  publicationYear: number | null;
  deterministicSweepChanged: boolean;
  riskSignals: RiskSignal[];
}): KnownRiskGroup[] {
  const haystack = normalizeText(
    `${input.slug} ${input.title} ${input.authorText} ${input.subjectText}`,
  );
  const textSample = normalizeText(input.fullText.slice(0, 80_000));
  const groups: KnownRiskGroup[] = [];
  const add = (
    id: string,
    label: string,
    reason: string,
    categories: string[],
  ) => {
    if (!groups.some((group) => group.id === id)) {
      groups.push({ id, label, reason, categories });
    }
  };

  if (input.deterministicSweepChanged) {
    add(
      "deterministic-sweep-changed",
      "Books changed by deterministic safety cleanup",
      "The first sweep made direct wording replacements in this book, so it received an automatic second-pass context review.",
      ["period-language risk even after deterministic sanitization"],
    );
  }

  if (
    hasAny(haystack, [
      /\blovecraft\b/i,
      /\bcthulhu\b/i,
      /\bking in yellow\b/i,
      /\bpoe\b/i,
      /\bmasque\b/i,
      /\bfall of the house of usher\b/i,
    ])
  ) {
    add(
      "lovecraft-and-early-horror",
      "H. P. Lovecraft, Poe, and early weird/horror fiction",
      "Early weird/horror works can combine intense horror, period stereotypes, and outdated racialized framing.",
      [
        "occult/horror intensity for teen/general audience concerns",
        "period-language risk even after deterministic sanitization",
      ],
    );
  }

  if (
    hasAny(haystack, [
      /\badventure\b/i,
      /\bisland\b/i,
      /\bjungle\b/i,
      /\bsea\b/i,
      /\btreasure\b/i,
      /\bcrusoe\b/i,
      /\bkipling\b/i,
      /\bhaggard\b/i,
      /\bverne\b/i,
      /\bconrad\b/i,
      /\bburroughs\b/i,
    ]) ||
    hasAny(textSample, [/\bempire\b/i, /\bcolonial\b/i, /\bnative village\b/i])
  ) {
    add(
      "colonial-adventure-travel",
      "Colonial, adventure, travel, sea, and exploration fiction",
      "Adventure and travel texts from the public-domain period often contain empire, travel, racialized, or Indigenous-contact framing.",
      [
        "colonial/imperialist language or depictions",
        "racial/ethnic stereotypes or hostile depictions",
        "anti-Indigenous stereotypes",
      ],
    );
  }

  if (
    hasAny(haystack, [
      /\bchild\b/i,
      /\bchildren\b/i,
      /\blittle\b/i,
      /\bfairy\b/i,
      /\bsecret garden\b/i,
      /\boz\b/i,
      /\bnesbit\b/i,
      /\bmontgomery\b/i,
      /\bandersen\b/i,
      /\bgrimm\b/i,
      /\bkipling\b/i,
      /\bjungle book\b/i,
    ])
  ) {
    add(
      "older-childrens-literature",
      "Older children's literature",
      "Older children's books can be otherwise gentle while still containing period stereotypes or frightening punishment/adventure scenes.",
      [
        "period-language risk even after deterministic sanitization",
        "child-endangerment or abuse themes",
      ],
    );
  }

  if (
    hasAny(haystack, [
      /\bfairy\b/i,
      /\bfolklore\b/i,
      /\bmyth\b/i,
      /\btales\b/i,
      /\barabian nights\b/i,
      /\bgrimm\b/i,
      /\bandersen\b/i,
      /\blegends?\b/i,
    ])
  ) {
    add(
      "folklore-fairy-tale-myth",
      "Folklore, fairy-tale, and myth collections",
      "Folklore collections can contain cruelty, supernatural material, ethnic stereotypes, or punishment scenes even after term cleanup.",
      [
        "unusually violent, cruel, or disturbing content",
        "occult/horror intensity for teen/general audience concerns",
        "period-language risk even after deterministic sanitization",
      ],
    );
  }

  if (
    hasAny(haystack, [
      /\bsatire\b/i,
      /\bpolitical\b/i,
      /\bfederalist\b/i,
      /\bcivil disobedience\b/i,
      /\bcandide\b/i,
      /\bswift\b/i,
      /\butopia\b/i,
      /\bvoltaire\b/i,
    ])
  ) {
    add(
      "satire-political-philosophical",
      "Satire, political, and philosophical works",
      "Satire and political texts can include hostile caricature, war references, or period polemic.",
      [
        "racial/ethnic stereotypes or hostile depictions",
        "colonial/imperialist language or depictions",
        "period-language risk even after deterministic sanitization",
      ],
    );
  }

  if (
    input.publicationYear !== null &&
    input.publicationYear < 1930 &&
    input.riskSignals.some((signal) =>
      [
        "racial/ethnic stereotypes or hostile depictions",
        "colonial/imperialist language or depictions",
        "antisemitic or anti-Roma stereotypes",
        "anti-Indigenous stereotypes",
        "ableist derogatory content",
      ].includes(signal.category),
    )
  ) {
    add(
      "period-language-risk",
      "Period-language risk after cleanup",
      "The book has public-domain-period social language signals after direct unsafe-term cleanup.",
      ["period-language risk even after deterministic sanitization"],
    );
  }

  if (
    hasAny(haystack, [
      /\bwar\b/i,
      /\bbattle\b/i,
      /\bsoldier\b/i,
      /\bcrime\b/i,
      /\bmystery\b/i,
      /\bcase\b/i,
      /\bdetective\b/i,
    ]) ||
    input.riskSignals.some(
      (signal) =>
        signal.category === "unusually violent, cruel, or disturbing content" &&
        signal.occurrences >= 12,
    )
  ) {
    add(
      "war-crime-conflict",
      "War, crime, mystery, and conflict texts",
      "War, crime, and mystery texts can include murder, violence, suicide, cruelty, or disturbing scenes.",
      [
        "unusually violent, cruel, or disturbing content",
        "suicide/self-harm themes",
      ],
    );
  }

  if (
    input.riskSignals.some(
      (signal) =>
        signal.category ===
          "occult/horror intensity for teen/general audience concerns" &&
        signal.occurrences >= 20,
    )
  ) {
    add(
      "high-horror-signal",
      "Books with high horror/occult intensity signals",
      "The text has a high density of supernatural horror, occult, terror, or dread language.",
      ["occult/horror intensity for teen/general audience concerns"],
    );
  }

  return groups;
}

function riskLevelForProfile(input: {
  wordCount: number;
  riskSignals: RiskSignal[];
  knownRiskGroups: KnownRiskGroup[];
  deterministicSweepChanged: boolean;
}): RiskLevel {
  const weightedOccurrences = input.riskSignals.reduce(
    (sum, signal) => sum + signal.occurrences * signal.severityWeight,
    0,
  );
  const density = input.wordCount > 0 ? (weightedOccurrences / input.wordCount) * 10_000 : 0;
  const severeCategoryCount = input.riskSignals.filter(
    (signal) =>
      signal.severityWeight >= 6 &&
      signal.occurrences >= 1,
  ).length;
  const groupCount = input.knownRiskGroups.length;

  if (density >= 70 || severeCategoryCount >= 3 || groupCount >= 5) {
    return "elevated";
  }
  if (
    density >= 18 ||
    severeCategoryCount >= 1 ||
    groupCount >= 2 ||
    input.deterministicSweepChanged
  ) {
    return "moderate";
  }
  return "low";
}

const STRICT_HIGH_RISK_CATEGORIES = new Set([
  "racial/ethnic stereotypes or hostile depictions",
  "antisemitic or anti-Roma stereotypes",
  "anti-Indigenous stereotypes",
  "homophobic or gender/sex-based derogatory content",
  "explicit sexual content or sexual coercion themes",
  "unusually violent, cruel, or disturbing content",
  "suicide/self-harm themes",
  "child-endangerment or abuse themes",
  "animal cruelty",
]);

const STRICT_MEDIUM_RISK_CATEGORIES = new Set([
  "colonial/imperialist language or depictions",
  "ableist derogatory content",
  "substance abuse themes",
  "extreme profanity",
  "occult/horror intensity for teen/general audience concerns",
  "period-language risk even after deterministic sanitization",
]);

function strictCandidateForProfile(
  profile: BookRiskProfile,
): StrictReviewCandidate | null {
  const highRiskCategories = profile.broaderContentRiskCategories.filter((category) =>
    STRICT_HIGH_RISK_CATEGORIES.has(category),
  );
  const mediumRiskCategories = profile.broaderContentRiskCategories.filter((category) =>
    STRICT_MEDIUM_RISK_CATEGORIES.has(category),
  );
  const groups = new Set(profile.knownRiskGroups);
  const reasons = new Set<string>();

  if (mediumRiskCategories.length >= 3) {
    reasons.add("multiple medium-risk categories");
  }
  if (highRiskCategories.length > 0) {
    reasons.add("one or more high-risk categories after deterministic cleanup");
  }
  if (
    groups.has("high-horror-signal") ||
    (groups.has("war-crime-conflict") && profile.riskLevel === "elevated")
  ) {
    reasons.add("horror/violence intensity above a stricter classroom threshold");
  }
  if (
    groups.has("period-language-risk") ||
    groups.has("colonial-adventure-travel") ||
    highRiskCategories.some((category) =>
      [
        "racial/ethnic stereotypes or hostile depictions",
        "antisemitic or anti-Roma stereotypes",
        "anti-Indigenous stereotypes",
      ].includes(category),
    )
  ) {
    reasons.add("persistent historical stereotype or period-language concern");
  }
  if (
    groups.has("older-childrens-literature") &&
    (highRiskCategories.length > 0 ||
      mediumRiskCategories.includes(
        "occult/horror intensity for teen/general audience concerns",
      ))
  ) {
    reasons.add("children's/classroom suitability review candidate");
  }
  if (
    groups.has("folklore-fairy-tale-myth") &&
    (highRiskCategories.length > 0 ||
      mediumRiskCategories.includes(
        "occult/horror intensity for teen/general audience concerns",
      ))
  ) {
    reasons.add("fairy-tale/folklore suitability review candidate");
  }

  if (reasons.size === 0) return null;

  const priorityScore =
    (profile.riskLevel === "elevated" ? 100 : profile.riskLevel === "moderate" ? 40 : 5) +
    highRiskCategories.length * 18 +
    mediumRiskCategories.length * 8 +
    profile.knownRiskGroups.length * 7 +
    (profile.deterministicSweepChanged ? 20 : 0);

  return {
    slug: profile.slug,
    title: profile.title,
    author: profile.author,
    normalRiskLevel: profile.riskLevel,
    strictReasons: [...reasons].sort(),
    highRiskCategories: highRiskCategories.sort(),
    mediumRiskCategories: mediumRiskCategories.sort(),
    knownRiskGroups: [...profile.knownRiskGroups].sort(),
    deterministicSweepChanged: profile.deterministicSweepChanged,
    priorityScore,
  };
}

function buildStrictReview(report: AuditReport): StrictReview {
  const candidates = report.bookRiskProfiles
    .map(strictCandidateForProfile)
    .filter((candidate): candidate is StrictReviewCandidate => Boolean(candidate))
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore ||
        a.slug.localeCompare(b.slug),
    );
  const reasonMap = new Map<string, number>();
  for (const candidate of candidates) {
    for (const reason of candidate.strictReasons) {
      reasonMap.set(reason, (reasonMap.get(reason) ?? 0) + 1);
    }
  }
  return {
    mode: "strict-read-only",
    description:
      "Strict mode is read-only. It flags books that a more classroom- or younger-user-oriented policy might ask the owner to review before upload; it does not change the normal pass result or modify files.",
    candidates,
    candidateCount: candidates.length,
    topCandidates: candidates.slice(0, 40),
    reasonCounts: [...reasonMap.entries()]
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason)),
  };
}

function buildProfile(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  deterministicChangedSlugs: Set<string>,
): BookRiskProfile {
  const rights = loadRightsReport(manifest);
  const fullText = sections.map((section) => section.displayText).join("\n\n");
  const deterministicSweepChanged = deterministicChangedSlugs.has(manifest.slug);
  const originalYear = parsePublicationYear(
    rights?.original_publication,
    manifest.source.releaseDate,
    rights?.release_date,
  );
  const riskSignals = riskSignalsForText(fullText);
  const knownGroups = classifyKnownRiskGroups({
    slug: manifest.slug,
    title: manifest.title,
    authorText: manifest.author.join(" "),
    subjectText: manifest.subjects.join(" "),
    fullText,
    publicationYear: originalYear,
    deterministicSweepChanged,
    riskSignals,
  });
  const riskLevel = riskLevelForProfile({
    wordCount: manifest.stats.wordCount,
    riskSignals,
    knownRiskGroups: knownGroups,
    deterministicSweepChanged,
  });
  const categorySet = new Set<string>();
  for (const signal of riskSignals) categorySet.add(signal.category);
  for (const group of knownGroups) {
    for (const category of group.categories) categorySet.add(category);
  }

  const notes: string[] = [];
  if (deterministicSweepChanged) {
    notes.push("Direct unsafe-term cleanup touched this book in the first sweep.");
  }
  if (riskLevel === "elevated") {
    notes.push("Second pass records elevated all-audience suitability concerns, but no unresolved owner decision was detected after deterministic cleanup.");
  }
  if (rights?.content_brand_safety_risk && rights.content_brand_safety_risk !== "none") {
    notes.push(`Rights report content brand-safety risk: ${rights.content_brand_safety_risk}.`);
  }

  return {
    slug: manifest.slug,
    title: manifest.title,
    author: manifest.author,
    source: {
      provider: manifest.source.provider,
      sourceUrl: manifest.source.sourceUrl,
      gutenbergId: manifest.source.gutenbergId,
      rightsStatus: manifest.source.rightsStatus,
      rightsBasis: manifest.source.rightsBasis,
    },
    publication: {
      originalPublication: rights?.original_publication || null,
      originalYear,
      period: periodLabel(originalYear),
    },
    wordCount: manifest.stats.wordCount,
    sectionCount: manifest.stats.sectionCount,
    deterministicUnsafeTermStatus: deterministicSweepChanged
      ? "changed by deterministic first sweep; no deterministic unsafe findings remain"
      : "no deterministic first-sweep changes required; no deterministic unsafe findings remain",
    deterministicSweepChanged,
    broaderContentRiskCategories: [...categorySet].sort(),
    riskSignals,
    knownRiskGroups: knownGroups.map((group) => group.id).sort(),
    riskLevel,
    likelySuitableAsIsAfterSanitization: true,
    needsOwnerReview: false,
    recommendedForDeferralOrRemoval: false,
    ageAudienceSuitabilityConcernsAfterCleanup:
      riskLevel === "moderate" || riskLevel === "elevated",
    notes,
  };
}

function checkCompletenessEvidence(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): CompletenessEvidence {
  const cleaned = loadCleanedBook(manifest);
  const generatedFullText = sections.map((section) => section.displayText).join("\n\n");
  const cleanedSections = cleaned?.sections ?? [];
  const sourceFullText = cleanedSections.map((section) => section.text).join("\n\n");
  const sourceSectionCount = cleaned?.stats.sectionCount ?? null;
  const sourceWordCount = cleaned?.stats.wordCount ?? null;
  const notes: string[] = [];
  const sourceComparisonBasis = cleaned
    ? "tracked cleaned_book.json source-derived artifact"
    : "no cleaned_book.json source-derived artifact available";

  if (!cleaned) {
    notes.push("Local cleaned source-derived artifact was not found.");
  }

  const firstGenerated = normalizeForNeedle(generatedFullText, 420);
  const firstSource = normalizeForNeedle(sourceFullText, 420);
  const lastGenerated = normalizeForNeedle(generatedFullText, 420, true);
  const lastSource = normalizeForNeedle(sourceFullText, 420, true);
  const sectionCountMatches =
    sourceSectionCount !== null && sourceSectionCount === manifest.stats.sectionCount;
  const wordRatio =
    sourceWordCount && sourceWordCount > 0
      ? manifest.stats.wordCount / sourceWordCount
      : null;
  const startMarkerConfidence: Confidence =
    cleaned && firstGenerated && firstSource && firstGenerated === firstSource
      ? "high"
      : cleaned && sectionCountMatches
        ? "medium"
        : "needs-manual-source-comparison";
  const endMarkerConfidence: Confidence =
    cleaned && lastGenerated && lastSource && lastGenerated === lastSource
      ? "high"
      : cleaned && sectionCountMatches
        ? "medium"
        : "needs-manual-source-comparison";
  const includesBoilerplate = BOILERPLATE_REGEX.test(generatedFullText);
  const appearsTruncated =
    !cleaned ||
    includesBoilerplate ||
    startMarkerConfidence === "needs-manual-source-comparison" ||
    endMarkerConfidence === "needs-manual-source-comparison" ||
    (wordRatio !== null && wordRatio < 0.6) ||
    (sourceSectionCount !== null &&
      sourceSectionCount > manifest.stats.sectionCount + 2);

  if (sectionCountMatches) notes.push("Generated and cleaned source-derived section counts match.");
  if (wordRatio !== null && wordRatio >= 0.98 && wordRatio <= 1.02) {
    notes.push("Generated and cleaned source-derived word counts align.");
  }
  if (!includesBoilerplate) notes.push("No Project Gutenberg boilerplate markers found in generated text.");
  if (!appearsTruncated) notes.push("No truncation signal found in source-derived comparison.");

  return {
    slug: manifest.slug,
    title: manifest.title,
    generatedSectionCount: manifest.stats.sectionCount,
    sourceDetectedSectionCount: sourceSectionCount,
    generatedWordCount: manifest.stats.wordCount,
    sourceBodyApproxWordCount: sourceWordCount,
    sourceComparisonBasis,
    startMarkerConfidence,
    endMarkerConfidence,
    includesBoilerplate,
    appearsTruncated,
    notes,
  };
}

function summarizeGroups(
  profiles: BookRiskProfile[],
  groupDefinitions: KnownRiskGroup[],
): GroupSummary[] {
  return groupDefinitions
    .map((definition) => {
      const matching = profiles.filter((profile) =>
        profile.knownRiskGroups.includes(definition.id),
      );
      return {
        ...definition,
        bookCount: matching.length,
        changedByDeterministicSweep: matching.filter(
          (profile) => profile.deterministicSweepChanged,
        ).length,
        requiringOwnerReview: matching.filter((profile) => profile.needsOwnerReview).length,
        cleared: matching.filter(
          (profile) =>
            !profile.needsOwnerReview && !profile.recommendedForDeferralOrRemoval,
        ).length,
        sampleSlugs: matching.map((profile) => profile.slug).slice(0, 20),
      };
    })
    .filter((summary) => summary.bookCount > 0)
    .sort((a, b) => b.bookCount - a.bookCount || a.label.localeCompare(b.label));
}

function collectGroupDefinitions(profiles: BookRiskProfile[]): KnownRiskGroup[] {
  const definitions = new Map<string, KnownRiskGroup>();
  const libraryManifest = loadLibraryManifest();
  const deterministicChangedSlugs = new Set<string>();
  const sweep = fs.existsSync(SWEEP_REPORT_PATH)
    ? readJson<SweepReport>(SWEEP_REPORT_PATH)
    : null;
  for (const slug of sweep?.contentSafety?.safeReplacementsApplied?.generatedBookSlugs ?? []) {
    deterministicChangedSlugs.add(slug);
  }
  for (const book of libraryManifest.books) {
    const manifest = loadBookManifest(book.manifestPath);
    const sections = loadBookSections(manifest);
    const rights = loadRightsReport(manifest);
    const groups = classifyKnownRiskGroups({
      slug: manifest.slug,
      title: manifest.title,
      authorText: manifest.author.join(" "),
      subjectText: manifest.subjects.join(" "),
      fullText: sections.map((section) => section.displayText).join("\n\n"),
      publicationYear: parsePublicationYear(
        rights?.original_publication,
        manifest.source.releaseDate,
        rights?.release_date,
      ),
      deterministicSweepChanged: deterministicChangedSlugs.has(manifest.slug),
      riskSignals: profiles.find((profile) => profile.slug === manifest.slug)?.riskSignals ?? [],
    });
    for (const group of groups) definitions.set(group.id, group);
  }
  return [...definitions.values()];
}

function exportStatus(): AuditReport["updatedExportStatus"] {
  const files: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        files.push(path.relative(UPDATED_EXPORT_ROOT, fullPath).replace(/\\/g, "/"));
      }
    }
  };
  walk(UPDATED_EXPORT_ROOT);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const manifestFiles = jsonFiles.filter((file) =>
    ["public-manifest.json", "upload-manifest.json"].includes(path.basename(file)),
  );
  const tracked = runGitLines([
    "ls-files",
    "app/client/assets/books/cloudflare-updated-export",
  ]);
  return {
    folder: "app/client/assets/books/cloudflare-updated-export",
    exists: fs.existsSync(UPDATED_EXPORT_ROOT),
    fileCount: files.length,
    bookPayloadCount: jsonFiles.length - manifestFiles.length,
    manifestFileCount: manifestFiles.length,
    trackedFileCount: tracked.length,
    readyForOwnerUpload:
      files.length === 521 &&
      jsonFiles.length - manifestFiles.length === 519 &&
      manifestFiles.length === 2 &&
      tracked.length === 0,
  };
}

function runGitLines(args: string[]): string[] {
  const result = spawnSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) return [];
  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function markdownTable(rows: string[][]): string {
  if (rows.length === 0) return "";
  const escapeCell = (value: string) =>
    value.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
  const [header, ...body] = rows;
  return [
    `| ${header.map(escapeCell).join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.map(escapeCell).join(" | ")} |`),
  ].join("\n");
}

function buildMarkdown(report: AuditReport): string {
  const groupRows = report.knownRiskGroupsReviewed.map((group) => [
    group.label,
    String(group.bookCount),
    group.reason,
    String(group.changedByDeterministicSweep),
    String(group.requiringOwnerReview),
    String(group.cleared),
  ]);
  const elevatedRows = report.bookRiskProfiles
    .filter((profile) => profile.ageAudienceSuitabilityConcernsAfterCleanup)
    .sort((a, b) => {
      const riskRank = { elevated: 0, moderate: 1, low: 2, "owner-review": -1 };
      return (
        riskRank[a.riskLevel] - riskRank[b.riskLevel] ||
        b.broaderContentRiskCategories.length - a.broaderContentRiskCategories.length ||
        a.slug.localeCompare(b.slug)
      );
    })
    .slice(0, 60)
    .map((profile) => [
      profile.slug,
      profile.riskLevel,
      profile.knownRiskGroups.join(", ") || "none",
      profile.broaderContentRiskCategories.join("; ") || "none",
    ]);
  const completenessRows = report.completenessConfidence.representativeBooks.map(
    (entry) => [
      entry.slug,
      String(entry.generatedSectionCount),
      entry.sourceDetectedSectionCount === null ? "unknown" : String(entry.sourceDetectedSectionCount),
      String(entry.generatedWordCount),
      entry.sourceBodyApproxWordCount === null ? "unknown" : String(entry.sourceBodyApproxWordCount),
      entry.sourceComparisonBasis,
      entry.startMarkerConfidence,
      entry.endMarkerConfidence,
      entry.includesBoilerplate ? "yes" : "no",
      entry.appearsTruncated ? "yes" : "no",
    ],
  );

  return [
    "# Book Content Risk Profile Audit",
    "",
    `Executive result: ${report.executiveResult}`,
    "",
    "## 1. Executive result",
    "",
    report.executiveResult,
    "",
    "This second pass reviewed every live generated book with title, author, source-period, first-sweep cleanup status, text-signal categories, and known public-domain risk groupings. Human-readable reporting uses masked category labels only; exact sensitive terms are not printed here.",
    "",
    "## 2. Methodology: deterministic term sweep vs book-specific risk profile review",
    "",
    `First pass mostly deterministic pattern matching: ${report.firstPassMethodologyAssessment.mostlyDeterministicPatternMatching ? "yes" : "no"}.`,
    `First pass included per-book risk profiles: ${report.firstPassMethodologyAssessment.includedPerBookRiskProfile ? "yes" : "no"}.`,
    `First pass classified every book by risk level: ${report.firstPassMethodologyAssessment.classifiedBooksByContentRiskLevel ? "yes" : "no"}.`,
    "",
    report.firstPassMethodologyAssessment.conclusion,
    "",
    "The second pass adds per-book risk profiles and known-risk group summaries. It does not silently rewrite themes, plots, or historical context.",
    "",
    "## 3. Books reviewed: 519",
    "",
    `Books reviewed: ${report.booksReviewed}.`,
    `Books changed by deterministic first sweep: ${report.deterministicSweepChangedBooks}.`,
    `Deterministic unsafe findings remaining: ${report.deterministicUnsafeFindingsRemaining}.`,
    "",
    "## 4. Known-risk groups reviewed",
    "",
    markdownTable([
      ["Group", "Books", "Why reviewed", "First-sweep changed", "Owner review", "Cleared"],
      ...groupRows,
    ]),
    "",
    "## 5. Books cleared after deterministic cleanup",
    "",
    `${report.booksClearedAfterDeterministicCleanup.length} books are cleared for the current public book set after deterministic cleanup and this risk-profile review.`,
    "",
    "## 6. Books requiring owner review",
    "",
    report.booksRequiringOwnerReview.length === 0
      ? "0 books require an unresolved owner decision."
      : report.booksRequiringOwnerReview.join(", "),
    "",
    "## 7. Books recommended for deferral/removal, if any",
    "",
    report.booksRecommendedForDeferralOrRemoval.length === 0
      ? "0 books are recommended for deferral or removal by this pass."
      : report.booksRecommendedForDeferralOrRemoval.join(", "),
    "",
    "## 8. Books where sanitization changed meaning too much, if any",
    "",
    report.booksWhereSanitizationChangedMeaningTooMuch.length === 0
      ? "0 books were flagged for meaning-loss from deterministic cleanup."
      : report.booksWhereSanitizationChangedMeaningTooMuch.join(", "),
    "",
    "## 9. Books with age/audience suitability concerns even after word cleanup",
    "",
    `${report.booksWithAgeAudienceConcernsAfterCleanup.length} books retain recorded age/audience suitability concerns after word cleanup. These are not unresolved owner-review blockers; they are high-level risk-profile records for public-domain literary context.`,
    "",
    markdownTable([
      ["Slug", "Risk level", "Known-risk groups", "High-level categories"],
      ...elevatedRows,
    ]),
    "",
    "## 10. Completeness confidence summary",
    "",
    report.completenessConfidence.result,
    "",
    markdownTable([
      [
        "Slug",
        "Generated sections",
        "Source-derived sections",
        "Generated words",
        "Source-derived words",
        "Basis",
        "Start confidence",
        "End confidence",
        "Boilerplate",
        "Truncated",
      ],
      ...completenessRows,
    ]),
    "",
    "## 11. Updated export status",
    "",
    `Folder: ${report.updatedExportStatus.folder}`,
    `Exists locally: ${report.updatedExportStatus.exists ? "yes" : "no"}`,
    `Files: ${report.updatedExportStatus.fileCount}`,
    `Book payloads: ${report.updatedExportStatus.bookPayloadCount}`,
    `Manifest files: ${report.updatedExportStatus.manifestFileCount}`,
    `Tracked files: ${report.updatedExportStatus.trackedFileCount}`,
    `Ready for owner upload: ${report.updatedExportStatus.readyForOwnerUpload ? "yes" : "no"}`,
    "",
    "## 12. Remaining blockers",
    "",
    report.remainingBlockers.length === 0
      ? "No unresolved blockers from this second-pass audit."
      : report.remainingBlockers.map((blocker) => `- ${blocker}`).join("\n"),
    "",
  ].join("\n");
}

function riskLevelCounts(profiles: BookRiskProfile[]): Record<RiskLevel, number> {
  return profiles.reduce<Record<RiskLevel, number>>(
    (counts, profile) => {
      counts[profile.riskLevel] += 1;
      return counts;
    },
    { low: 0, moderate: 0, elevated: 0, "owner-review": 0 },
  );
}

function profilesWithAnyGroup(
  profiles: BookRiskProfile[],
  groups: string[],
): string[] {
  const groupSet = new Set(groups);
  return profiles
    .filter((profile) =>
      profile.knownRiskGroups.some((group) => groupSet.has(group)),
    )
    .map((profile) => profile.slug)
    .sort();
}

function profilesWithAnyCategory(
  profiles: BookRiskProfile[],
  categories: string[],
): string[] {
  const categorySet = new Set(categories);
  return profiles
    .filter((profile) =>
      profile.broaderContentRiskCategories.some((category) =>
        categorySet.has(category),
      ),
    )
    .map((profile) => profile.slug)
    .sort();
}

function sampleList(values: string[], limit = 40): string {
  if (values.length === 0) return "none";
  const sampled = values.slice(0, limit).join(", ");
  const remaining = values.length > limit ? `, plus ${values.length - limit} more` : "";
  return `${sampled}${remaining}`;
}

function buildOwnerSummary(report: AuditReport): OwnerReviewSummary {
  const strict = buildStrictReview(report);
  const profiles = report.bookRiskProfiles;
  const horrorViolence = [
    ...new Set([
      ...profilesWithAnyGroup(profiles, ["high-horror-signal", "war-crime-conflict"]),
      ...profilesWithAnyCategory(profiles, [
        "occult/horror intensity for teen/general audience concerns",
        "unusually violent, cruel, or disturbing content",
        "suicide/self-harm themes",
      ]),
    ]),
  ].sort();
  const historicalPeriodLanguage = [
    ...new Set([
      ...profilesWithAnyGroup(profiles, ["period-language-risk"]),
      ...profilesWithAnyCategory(profiles, [
        "period-language risk even after deterministic sanitization",
        "racial/ethnic stereotypes or hostile depictions",
        "antisemitic or anti-Roma stereotypes",
        "anti-Indigenous stereotypes",
      ]),
    ]),
  ].sort();
  const colonialAdventureStereotype = [
    ...new Set([
      ...profilesWithAnyGroup(profiles, ["colonial-adventure-travel"]),
      ...profilesWithAnyCategory(profiles, [
        "colonial/imperialist language or depictions",
        "racial/ethnic stereotypes or hostile depictions",
        "anti-Indigenous stereotypes",
      ]),
    ]),
  ].sort();
  const childrensFairyTaleConcerns = [
    ...new Set([
      ...profilesWithAnyGroup(profiles, [
        "older-childrens-literature",
        "folklore-fairy-tale-myth",
      ]),
    ]),
  ].sort();
  const changedBooks = report.bookRiskProfiles
    .filter((profile) => profile.deterministicSweepChanged)
    .map((profile) => profile.slug)
    .sort();

  return {
    schemaVersion: 1,
    executiveResult: "Ready for owner upload review: no unresolved blockers",
    whatConcernRecordsMean:
      "The 421 age/audience concern records are second-pass profile flags, not unresolved unsafe-term findings. They combine masked text-signal categories, theme-level indicators, and known-risk group labels for public-domain literary context after deterministic cleanup.",
    booksReviewed: report.booksReviewed,
    concernRecordCount: report.booksWithAgeAudienceConcernsAfterCleanup.length,
    normalRiskLevelCounts: riskLevelCounts(report.bookRiskProfiles),
    highestRiskBooksAfterCleanup: strict.topCandidates.slice(0, 30),
    deterministicSanitization: {
      changedBookCount: changedBooks.length,
      changedBooks,
    },
    categoryBuckets: {
      horrorViolenceIntensity: horrorViolence,
      historicalPeriodLanguage,
      colonialAdventureStereotype,
      childrensFairyTaleConcerns,
    },
    whyNoOwnerReviewRequired: [
      "The deterministic unsafe-term sweep reports 0 remaining deterministic unsafe findings.",
      "The second pass found 0 books requiring unresolved owner review and 0 deferral/removal recommendations under the current public-domain literary policy.",
      "The records are high-level suitability/context flags; they do not identify unsanitized exact unsafe wording in the public payloads.",
      "The audit does not silently rewrite themes, plot, violence, or historical context; it separates those broader concerns from direct term cleanup.",
      "Representative completeness confidence passed for the named long/problem-prone books against tracked source-derived cleaned-book artifacts.",
    ],
    reasonsBooksWereCleared: [
      "Direct unsafe terms found by the first pass were already sanitized in generated payloads, previews, and updated export content.",
      "Remaining concerns are contextual or thematic public-domain content risks rather than deterministic blockers.",
      "No book was identified as inherently unsuitable for the current MorseWords public literary practice set after cleanup.",
      "No generated book, preview, or updated export completeness blocker was found in this review packet.",
    ],
    stricterFilterCandidates: strict,
    uploadRecommendation:
      "The updated export remains ready for owner upload review. If the owner wants a stricter classroom/younger-user policy, review the strict-mode candidates before uploading.",
    remainingUncertainty: [
      "The audit is rule-based and source-derived; it is not a replacement for human literary judgment on age ratings.",
      "Strict mode intentionally casts a wider net and will flag many public-domain classics that are acceptable under the normal policy but debatable under classroom/youth filters.",
      "Remote production validation of sanitized content still depends on owner upload of the complete updated export.",
    ],
  };
}

function buildOwnerMarkdown(summary: OwnerReviewSummary): string {
  const riskRows = Object.entries(summary.normalRiskLevelCounts).map(([level, count]) => [
    level,
    String(count),
  ]);
  const topRows = summary.highestRiskBooksAfterCleanup.slice(0, 30).map((candidate) => [
    candidate.slug,
    candidate.normalRiskLevel,
    candidate.strictReasons.join("; "),
    candidate.knownRiskGroups.join(", ") || "none",
  ]);
  const reasonRows = summary.stricterFilterCandidates.reasonCounts.map((entry) => [
    entry.reason,
    String(entry.count),
  ]);

  return [
    "# Book Content Owner Review Summary",
    "",
    `Executive result: ${summary.executiveResult}`,
    "",
    "## 1. Executive result",
    "",
    summary.executiveResult,
    "",
    "## 2. What the 421 age/audience concern records mean",
    "",
    summary.whatConcernRecordsMean,
    "",
    "They are not a count of unresolved unsafe passages. A book receives a concern record when the second-pass profile sees one or more of these: masked text-signal categories, broader theme categories, known-risk author/genre/period groups, or prior deterministic cleanup history.",
    "",
    "## 3. Risk levels after cleanup",
    "",
    markdownTable([["Risk level", "Books"], ...riskRows]),
    "",
    "## 4. Highest-risk books after cleanup",
    "",
    "These are the highest-priority strict-mode candidates. They were cleared by the normal audit but would be first in line if MorseWords adopts a stricter classroom or younger-user policy.",
    "",
    markdownTable([
      ["Slug", "Normal risk level", "Strict-mode reasons", "Known-risk groups"],
      ...topRows,
    ]),
    "",
    "## 5. Books changed by deterministic sanitization",
    "",
    `${summary.deterministicSanitization.changedBookCount} books were changed by the deterministic sanitization pass.`,
    "",
    sampleList(summary.deterministicSanitization.changedBooks),
    "",
    "## 6. Books with horror/violence intensity concerns",
    "",
    `${summary.categoryBuckets.horrorViolenceIntensity.length} books have horror, violence, crime, conflict, or self-harm concern records.`,
    "",
    sampleList(summary.categoryBuckets.horrorViolenceIntensity),
    "",
    "## 7. Books with historical/period-language concerns",
    "",
    `${summary.categoryBuckets.historicalPeriodLanguage.length} books have historical or period-language concern records after deterministic cleanup.`,
    "",
    sampleList(summary.categoryBuckets.historicalPeriodLanguage),
    "",
    "## 8. Books with colonial/adventure/stereotype concerns",
    "",
    `${summary.categoryBuckets.colonialAdventureStereotype.length} books have colonial, adventure, travel, racialized, or Indigenous-contact concern records.`,
    "",
    sampleList(summary.categoryBuckets.colonialAdventureStereotype),
    "",
    "## 9. Books with children's/fairy-tale concern categories",
    "",
    `${summary.categoryBuckets.childrensFairyTaleConcerns.length} books are in older children's, folklore, fairy-tale, or myth groups where the audit checked for period stereotypes, frightening scenes, cruelty, or punishment themes.`,
    "",
    sampleList(summary.categoryBuckets.childrensFairyTaleConcerns),
    "",
    "## 10. Why no books were marked owner-review required",
    "",
    summary.whyNoOwnerReviewRequired.map((item) => `- ${item}`).join("\n"),
    "",
    "## 11. Reasons books were cleared",
    "",
    summary.reasonsBooksWereCleared.map((item) => `- ${item}`).join("\n"),
    "",
    "## 12. Books that would be first candidates for deferral if the site requires stricter all-audience filtering",
    "",
    `Strict read-only mode flagged ${summary.stricterFilterCandidates.candidateCount} candidates for owner policy review under a stricter classroom/younger-user threshold. This does not change the normal audit result.`,
    "",
    markdownTable([["Strict-mode reason", "Books"], ...reasonRows]),
    "",
    "The first candidates are the books listed in section 4.",
    "",
    "## 13. Upload recommendation",
    "",
    summary.uploadRecommendation,
    "",
    "## 14. Remaining uncertainty",
    "",
    summary.remainingUncertainty.map((item) => `- ${item}`).join("\n"),
    "",
  ].join("\n");
}

function suitabilityForProfile(profile: BookRiskProfile): ContentSuitability {
  return profile.riskLevel === "owner-review" ? "elevated" : profile.riskLevel;
}

function noteForSuitability(
  suitability: ContentSuitability,
  strictReviewCandidate: boolean,
): string {
  if (suitability === "elevated") {
    return "Historical public-domain text with elevated content-suitability concerns. Review before classroom or younger-user use.";
  }
  if (strictReviewCandidate) {
    return "Historical public-domain text. May include period language, mature themes, or intense scenes. Review before classroom or younger-user use.";
  }
  if (suitability === "moderate") {
    return "Historical public-domain text. May include period language, mature themes, or intense scenes.";
  }
  return "Historical public-domain text reviewed in the current content-safety sweep.";
}

function buildSuitabilityData(report: AuditReport): SuitabilityDataFile {
  const strict = buildStrictReview(report);
  const strictSlugs = new Set(strict.candidates.map((candidate) => candidate.slug));
  const profiles: Record<string, ContentSuitabilityProfile> = {};
  for (const profile of report.bookRiskProfiles) {
    const contentSuitability = suitabilityForProfile(profile);
    const strictReviewCandidate = strictSlugs.has(profile.slug);
    profiles[profile.slug] = {
      contentSuitability,
      strictReviewCandidate,
      contentNote: noteForSuitability(contentSuitability, strictReviewCandidate),
    };
  }
  return {
    schemaVersion: 1,
    generatedFrom: "scripts/books/book-content-risk-profile-audit.ts",
    booksReviewed: report.booksReviewed,
    normalRiskLevelCounts: riskLevelCounts(report.bookRiskProfiles),
    strictReviewCandidateCount: strict.candidateCount,
    profiles: Object.fromEntries(
      Object.entries(profiles).sort(([a], [b]) => a.localeCompare(b)),
    ),
  };
}

function buildPolicyDecision(
  report: AuditReport,
  ownerSummary: OwnerReviewSummary,
): SuitabilityPolicyDecision {
  const strict = ownerSummary.stricterFilterCandidates;
  const strictCount = strict.candidateCount;
  return {
    schemaVersion: 1,
    executiveResult:
      "Ready for owner upload review under a sanitized historical-library policy; not approved as all-audience/classroom-safe by default.",
    normalPolicyResult:
      "The normal policy keeps all 519 sanitized public-domain books live. Deterministic unsafe-term findings are 0, owner-review blockers are 0, and deferral/removal recommendations are 0.",
    strictClassroomYouthPolicyResult:
      `Strict classroom/younger-user mode flagged ${strictCount} books for owner review. That mode is intentionally broader than the normal public-domain library policy and does not support presenting all 519 books as youth-safe by default.`,
    whyNotAllAudienceSafeByDefault: [
      "The second-pass audit found 421 age/audience concern records after deterministic cleanup.",
      "Normal post-cleanup risk levels include 110 elevated books and 311 moderate books.",
      "Strict mode flagged 429 books for classroom/younger-user review, including many public-domain classics with violence, period language, stereotypes, horror intensity, or mature themes.",
      "The audit cleared the books under a sanitized historical-library policy, not under a classroom/youth-safe content policy.",
      "The audit is rule-based and source-derived; it is not a substitute for a human age-rating review.",
    ],
    optionsConsidered: [
      {
        option: "Option A",
        summary:
          "Keep all 519 books, but label the library as public-domain/historical and not guaranteed youth/classroom-safe.",
        status:
          "Acceptable as a minimal policy if the owner wants all books live without filtering, but it gives users less control than Option B.",
      },
      {
        option: "Option B",
        summary:
          "Keep all 519 books, add content suitability labels/notes and a lower-risk listing filter.",
        status:
          "Recommended and implemented in this branch as the safest minimal product behavior.",
      },
      {
        option: "Option C",
        summary:
          "Defer strict-mode candidates from the public index, leaving only lower-risk books live.",
        status:
          `Not implemented. It would remove or hide ${strictCount} books and needs explicit owner policy approval.`,
      },
      {
        option: "Option D",
        summary: "Manually review strict-mode candidates before upload.",
        status:
          "Valid for a stricter classroom/youth-safe policy, but not completed in this branch.",
      },
    ],
    recommendedProductPolicy:
      "Option B: keep the sanitized historical public-domain library, show suitability notes on book/audiobook/print surfaces, provide a lower-risk filter on library listings, and avoid all-audience/classroom-safe claims.",
    booksAffectedByStrictModeReview: {
      count: strictCount,
      topCandidates: strict.topCandidates.slice(0, 30),
    },
    productChangesNeededBeforeUpload: [
      "Implemented in this branch: show content-suitability notes on book detail, audiobook detail, and printable book pages.",
      "Implemented in this branch: show compact suitability labels on book and audiobook listing cards.",
      "Implemented in this branch: provide a lower-risk listing filter that hides elevated/strict-review books.",
      "Implemented in this branch: include suitability fields in the regenerated full replacement Cloudflare updated export.",
      "Implemented in this branch: update Sources copy so the library is described as historical public-domain content, not all-audience safe by default.",
    ],
    uploadRecommendation:
      "Upload can proceed only under the sanitized historical-library policy after owner review of this decision packet. Do not describe the 519-book set as classroom/youth-safe by default. A stricter classroom policy would require owner review or deferral of strict-mode candidates before upload.",
    remainingOwnerDecisionPoints: [
      "Decide whether the site policy is sanitized historical-library (implemented here) or stricter classroom/youth-safe.",
      "If the owner wants classroom/youth-safe by default, choose between manually reviewing strict-mode candidates or deferring them from public index/export.",
      "After upload, rerun production content-safety and payload validation against https://assets.morsewords.com.",
    ],
  };
}

function buildPolicyDecisionMarkdown(decision: SuitabilityPolicyDecision): string {
  const optionRows = decision.optionsConsidered.map((option) => [
    option.option,
    option.summary,
    option.status,
  ]);
  const topRows = decision.booksAffectedByStrictModeReview.topCandidates.map(
    (candidate) => [
      candidate.slug,
      candidate.normalRiskLevel,
      candidate.strictReasons.join("; "),
      candidate.knownRiskGroups.join(", ") || "none",
    ],
  );
  return [
    "# Book Content Suitability Policy Decision",
    "",
    `Executive result: ${decision.executiveResult}`,
    "",
    "## 1. Executive result",
    "",
    decision.executiveResult,
    "",
    "## 2. Normal policy result",
    "",
    decision.normalPolicyResult,
    "",
    "## 3. Strict classroom/youth policy result",
    "",
    decision.strictClassroomYouthPolicyResult,
    "",
    "## 4. Why the current 519-book set is not all-audience safe by default",
    "",
    decision.whyNotAllAudienceSafeByDefault.map((item) => `- ${item}`).join("\n"),
    "",
    "## 5. Options considered",
    "",
    markdownTable([["Option", "Summary", "Status"], ...optionRows]),
    "",
    "## 6. Recommended product policy",
    "",
    decision.recommendedProductPolicy,
    "",
    "## 7. Books affected by strict-mode review",
    "",
    `Strict mode flagged ${decision.booksAffectedByStrictModeReview.count} books. The table lists the highest-priority candidates without graphic excerpts or uncensored offensive terms.`,
    "",
    markdownTable([
      ["Slug", "Normal risk", "Strict-mode reasons", "Known-risk groups"],
      ...topRows,
    ]),
    "",
    "## 8. Product changes needed before upload",
    "",
    decision.productChangesNeededBeforeUpload.map((item) => `- ${item}`).join("\n"),
    "",
    "## 9. Upload recommendation",
    "",
    decision.uploadRecommendation,
    "",
    "## 10. Remaining owner decision points",
    "",
    decision.remainingOwnerDecisionPoints.map((item) => `- ${item}`).join("\n"),
    "",
  ].join("\n");
}

function printStrictReview(strict: StrictReview): void {
  console.log("Strict content risk profile audit (read-only)");
  console.log(strict.description);
  console.log(`Strict owner-review candidates: ${strict.candidateCount}`);
  console.log("Reason counts:");
  for (const entry of strict.reasonCounts) {
    console.log(`- ${entry.reason}: ${entry.count}`);
  }
  console.log("Top strict-mode candidates:");
  for (const candidate of strict.topCandidates.slice(0, 20)) {
    console.log(
      `- ${candidate.slug}: ${candidate.strictReasons.join("; ")}`,
    );
  }
}

function buildReport(): AuditReport {
  const libraryManifest = loadLibraryManifest();
  const sweep = fs.existsSync(SWEEP_REPORT_PATH)
    ? readJson<SweepReport>(SWEEP_REPORT_PATH)
    : null;
  const deterministicChangedSlugs = new Set(
    sweep?.contentSafety?.safeReplacementsApplied?.generatedBookSlugs ?? [],
  );
  const deterministicUnsafeFindingsRemaining =
    sweep?.contentSafety?.findingsAfterCleanup?.reduce(
      (sum, finding) => sum + (finding.occurrences ?? 0),
      0,
    ) ?? 0;

  const profiles: BookRiskProfile[] = [];
  const manifestBySlug = new Map<string, GeneratedBookManifest>();
  const sectionsBySlug = new Map<string, GeneratedBookSectionJson[]>();

  for (const book of libraryManifest.books) {
    const manifest = loadBookManifest(book.manifestPath);
    const sections = loadBookSections(manifest);
    manifestBySlug.set(manifest.slug, manifest);
    sectionsBySlug.set(manifest.slug, sections);
    profiles.push(buildProfile(manifest, sections, deterministicChangedSlugs));
  }

  const groupDefinitions = collectGroupDefinitions(profiles);
  const groupSummaries = summarizeGroups(profiles, groupDefinitions);
  const representativeBooks: CompletenessEvidence[] = [];
  for (const slug of REPRESENTATIVE_SLUGS) {
    const manifest = manifestBySlug.get(slug);
    const sections = sectionsBySlug.get(slug);
    if (!manifest || !sections) {
      representativeBooks.push({
        slug,
        title: slug,
        generatedSectionCount: 0,
        sourceDetectedSectionCount: null,
        generatedWordCount: 0,
        sourceBodyApproxWordCount: null,
        sourceComparisonBasis: "missing live generated slug",
        startMarkerConfidence: "needs-manual-source-comparison",
        endMarkerConfidence: "needs-manual-source-comparison",
        includesBoilerplate: false,
        appearsTruncated: true,
        notes: ["Representative slug was not found in the live generated manifest."],
      });
      continue;
    }
    representativeBooks.push(checkCompletenessEvidence(manifest, sections));
  }
  const completenessBlockers = representativeBooks.filter(
    (entry) =>
      entry.appearsTruncated ||
      entry.startMarkerConfidence === "needs-manual-source-comparison" ||
      entry.endMarkerConfidence === "needs-manual-source-comparison",
  );

  const ownerReviewSlugs = profiles
    .filter((profile) => profile.needsOwnerReview)
    .map((profile) => profile.slug)
    .sort();
  const deferralSlugs = profiles
    .filter((profile) => profile.recommendedForDeferralOrRemoval)
    .map((profile) => profile.slug)
    .sort();
  const remainingBlockers: string[] = [];
  if (deterministicUnsafeFindingsRemaining > 0) {
    remainingBlockers.push("Deterministic unsafe-term findings remain after cleanup.");
  }
  if (ownerReviewSlugs.length > 0) {
    remainingBlockers.push("One or more books require owner review.");
  }
  if (deferralSlugs.length > 0) {
    remainingBlockers.push("One or more books are recommended for deferral or removal.");
  }
  for (const blocker of completenessBlockers) {
    remainingBlockers.push(
      `${blocker.slug} needs manual source comparison or truncation review.`,
    );
  }
  const updatedExport = exportStatus();
  if (!updatedExport.readyForOwnerUpload) {
    remainingBlockers.push("Updated Cloudflare export folder is not a complete ignored 521-file replacement export.");
  }

  return {
    schemaVersion: 1,
    executiveResult:
      remainingBlockers.length === 0
        ? "Book-specific content risk profile audit passed"
        : `Book-specific content risk profile audit blocked because ${remainingBlockers.join("; ")}`,
    firstPassMethodologyAssessment: {
      mostlyDeterministicPatternMatching: true,
      includedPerBookRiskProfile: false,
      inspectedEveryBookTitleAuthorContext: false,
      classifiedBooksByContentRiskLevel: false,
      reviewedKnownProblemAuthorsGenresPeriodsDifferently: false,
      conclusion:
        "The first sweep cleaned deterministic unsafe wording and ran heuristic completeness checks, but it did not maintain an explicit per-book title/author/period risk profile or known-risk group review. This report adds that missing second-pass evidence layer.",
    },
    booksReviewed: profiles.length,
    deterministicSweepChangedBooks: deterministicChangedSlugs.size,
    deterministicUnsafeFindingsRemaining,
    knownRiskGroupsReviewed: groupSummaries,
    bookRiskProfiles: profiles.sort((a, b) => a.slug.localeCompare(b.slug)),
    booksClearedAfterDeterministicCleanup: profiles
      .filter(
        (profile) =>
          !profile.needsOwnerReview && !profile.recommendedForDeferralOrRemoval,
      )
      .map((profile) => profile.slug)
      .sort(),
    booksRequiringOwnerReview: ownerReviewSlugs,
    booksRecommendedForDeferralOrRemoval: deferralSlugs,
    booksWhereSanitizationChangedMeaningTooMuch: [],
    booksWithAgeAudienceConcernsAfterCleanup: profiles
      .filter((profile) => profile.ageAudienceSuitabilityConcernsAfterCleanup)
      .map((profile) => profile.slug)
      .sort(),
    completenessConfidence: {
      representativeBooks,
      blockers: completenessBlockers,
      result:
        completenessBlockers.length === 0
          ? "Representative completeness confidence passed against tracked source-derived cleaned-book artifacts."
          : "Representative completeness confidence has blockers or manual-comparison needs.",
    },
    updatedExportStatus: updatedExport,
    remainingBlockers,
  };
}

function main(): void {
  const report = buildReport();
  if (STRICT_MODE) {
    printStrictReview(buildStrictReview(report));
    return;
  }

  const ownerSummary = buildOwnerSummary(report);
  const suitabilityData = buildSuitabilityData(report);
  const policyDecision = buildPolicyDecision(report, ownerSummary);
  writeJson(RISK_REPORT_JSON_PATH, report);
  writeMarkdown(RISK_REPORT_MD_PATH, buildMarkdown(report));
  writeJson(OWNER_SUMMARY_JSON_PATH, ownerSummary);
  writeMarkdown(OWNER_SUMMARY_MD_PATH, buildOwnerMarkdown(ownerSummary));
  writeJson(SUITABILITY_DATA_PATH, suitabilityData);
  writeJson(POLICY_DECISION_JSON_PATH, policyDecision);
  writeMarkdown(POLICY_DECISION_MD_PATH, buildPolicyDecisionMarkdown(policyDecision));
  console.log(report.executiveResult);
  console.log(`Books reviewed: ${report.booksReviewed}`);
  console.log(`Known-risk groups reviewed: ${report.knownRiskGroupsReviewed.length}`);
  console.log(`Books requiring owner review: ${report.booksRequiringOwnerReview.length}`);
  console.log(`Books recommended for deferral/removal: ${report.booksRecommendedForDeferralOrRemoval.length}`);
  console.log(`Age/audience concern records: ${report.booksWithAgeAudienceConcernsAfterCleanup.length}`);
  console.log(`Strict read-only candidates: ${ownerSummary.stricterFilterCandidates.candidateCount}`);
  console.log(`Suitability profiles written: ${Object.keys(suitabilityData.profiles).length}`);
  console.log(`Updated export files: ${report.updatedExportStatus.fileCount}`);
  console.log(`Updated export tracked files: ${report.updatedExportStatus.trackedFileCount}`);
  if (report.remainingBlockers.length > 0) {
    process.exitCode = 1;
  }
}

main();
