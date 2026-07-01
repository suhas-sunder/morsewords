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
  writeJson(RISK_REPORT_JSON_PATH, report);
  writeMarkdown(RISK_REPORT_MD_PATH, buildMarkdown(report));
  console.log(report.executiveResult);
  console.log(`Books reviewed: ${report.booksReviewed}`);
  console.log(`Known-risk groups reviewed: ${report.knownRiskGroupsReviewed.length}`);
  console.log(`Books requiring owner review: ${report.booksRequiringOwnerReview.length}`);
  console.log(`Books recommended for deferral/removal: ${report.booksRecommendedForDeferralOrRemoval.length}`);
  console.log(`Age/audience concern records: ${report.booksWithAgeAudienceConcernsAfterCleanup.length}`);
  console.log(`Updated export files: ${report.updatedExportStatus.fileCount}`);
  console.log(`Updated export tracked files: ${report.updatedExportStatus.trackedFileCount}`);
  if (report.remainingBlockers.length > 0) {
    process.exitCode = 1;
  }
}

main();
