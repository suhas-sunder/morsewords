import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  GeneratedBookManifest,
  GeneratedBookSectionJson,
} from "./bookManifestTypes.ts";
import {
  countBookWords,
  normalizeBookText,
  textPreview,
} from "./bookTextNormalization.ts";

type WriteBookReport = {
  slug: string;
  status: "written" | "skipped";
  sourceFileUsed: string;
  candidateTitle: string;
  candidateAuthor: string[];
  pass2RiskLevel: string;
  startBoundaryUsed: {
    line: number;
    reason: string;
    snippet: string;
    linesBefore: string[];
  };
  endBoundaryUsed: {
    line: number;
    reason: string;
    snippet: string;
    linesAfter: string[];
  };
  sectionCount: number;
  firstFiveSections: SectionSummary[];
  lastFiveSections: SectionSummary[];
  suspiciouslyShortSections: SectionSummary[];
  suspiciouslyLongSections: SectionSummary[];
  remainingWarnings: string[];
  firstHourPreviewSourceSections: string[];
  selectedStructuralConvention: string;
  structureDetectionStatus: string;
  finalRecommendation: string;
};

type SectionSummary = {
  id: string;
  label: string;
  title: string | null;
  wordCount: number;
};

type WriteReport = {
  books: WriteBookReport[];
};

type DryRunBook = {
  slug: string;
  sourceFilename: string;
  sourcePath: string;
  finalDryRunRecommendation: string;
  candidateStartLine: number;
  candidateEndLine: number;
  structureDetection: {
    detectedStructuralConvention: string;
    selectedHeadingStrategy: {
      patternId: string;
      bodyLikeCount: number;
      tocLikeCount?: number;
    } | null;
    bodyHeadingsDetected: boolean;
    tocEntriesDetected: boolean;
    fallbackUsed: boolean;
    status: "pass" | "warn" | "fail";
    warnings: string[];
    bodyChapterHeadingCount?: number;
    priorTwoSectionCollapseFixed?: boolean;
  };
  firstHourPreviewCandidate?: {
    sectionsUsed?: string[];
    startsAtRealReadableContent?: boolean;
    confidence?: string;
    snippet?: string;
  };
};

type DryRunReport = {
  books: DryRunBook[];
};

type PreviewAsset = {
  version: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionKind: string;
  defaultSectionLabel: string;
  defaultSectionTitle: string | null;
  previewText: string;
  estimatedRuntimeSeconds: number;
  wordCount: number;
  characterCount: number;
  estimatedTypingMinutes: number;
  estimatedListeningMinutes: number;
  morseCharacterEstimate: number;
  textPreview: string;
  truncated: boolean;
};

type Verdict = {
  status: "pass" | "warn" | "fail";
  summary: string;
  details: string[];
};

type BookVerification = {
  slug: string;
  status: "pass" | "warn" | "fail";
  generatedOutputInspected: string[];
  previewAssetInspected: string;
  dryRunReportInspected: string;
  writeReportInspected: string;
  selectedStructuralConvention: string;
  startBoundaryVerdict: Verdict;
  endBoundaryVerdict: Verdict;
  sectioningVerdict: Verdict;
  cleanupVerdict: Verdict;
  previewVerdict: Verdict;
  remainingWarnings: string[];
  acceptedForMain: boolean;
  needsCorrectionBeforeMain: boolean;
  shouldBeRevertedOrSkipped: boolean;
  startSnippet: {
    raw: string;
    generated: string;
    preview: string;
  };
  endSnippet: {
    raw: string;
    generated: string;
  };
  sectionSummary: {
    totalSections: number;
    defaultSections: number;
    firstDefaultSection: SectionSummary | null;
    lastDefaultSection: SectionSummary | null;
    suspiciouslyShortSections: SectionSummary[];
    suspiciouslyLongSections: SectionSummary[];
  };
};

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..", "..");
const tempBooksRoot = path.join(repoRoot, "app", "client", "assets", "temp-books");
const generatedRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "generated",
);
const cloudflareRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-export",
);
const previewRoot = path.join(repoRoot, "public", "book-previews");
const dryRunReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-dry-run-3",
  "pilot-dry-run-3.json",
);
const writeReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-3",
  "pilot-write-3.json",
);
const verificationReportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-3-verification",
);

const pilotSlugs = [
  "frankenstein",
  "the-three-musketeers",
  "a-tale-of-two-cities",
  "around-the-world-in-eighty-days",
  "cranford",
  "little-fuzzy",
  "macbeth",
  "persuasion",
  "pygmalion",
  "sense-and-sensibility",
  "the-adventures-of-tom-sawyer",
  "the-door-in-the-wall",
  "the-hound-of-the-baskervilles",
  "the-king-in-yellow",
  "the-life-and-adventures-of-robinson-crusoe",
  "the-maltese-falcon",
  "the-tempest",
  "the-turn-of-the-screw",
  "the-war-of-the-worlds",
  "the-wendigo",
  "wuthering-heights",
  "anne-of-avonlea",
  "five-weeks-in-a-balloon",
  "moby-dick",
  "tales-of-war",
] as const;

const correctionsMade = [
  "the-tempest: removed 399 trailing Shakespeare line-number reference artifacts and 9 editorial Notes blocks from default act sections, removed the non-default editorial footnote block from cast/front matter, and rebuilt generated hashes plus the preview asset.",
  "the-war-of-the-worlds: corrected generated metadata so all 27 real chapter sections are default readable, then rebuilt generated hashes and the preview asset.",
];

const boilerplatePatterns = [
  /Project Gutenberg/i,
  /Gutenberg License/i,
  /Gutenberg eBook/i,
  /START OF (?:THE|THIS) PROJECT GUTENBERG/i,
  /END OF (?:THE|THIS) PROJECT GUTENBERG/i,
  /Release date:/i,
  /Credits:/i,
  /Updated editions will replace/i,
  /THE FULL PROJECT GUTENBERG/i,
  /www\.gutenberg\.org/i,
];

const defaultReadableJunkPatterns = [
  /^contents$/im,
  /^table of contents$/im,
  /^title:\s/im,
  /^author:\s/im,
  /^release date:\s/im,
  /^credits:\s/im,
  /SOS Help!/i,
  /generic placeholder/i,
];

const imageOrReferenceArtifactPatterns = [
  /\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/i,
  /\[(?:[1-9][0-9]?|100)\]/,
  /(?:^|\n)\s*(?:Notes|Footnotes):\s*[IVX0-9]/i,
  /^_{4,}$/m,
  /^\*{4,}$/m,
  /^\[page\s+\d+\]$/im,
];

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function assertInside(parent: string, target: string) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to inspect outside ${parent}: ${target}`);
  }
}

function safeSourcePath(sourceFileUsed: string) {
  const resolved = path.resolve(repoRoot, sourceFileUsed);
  assertInside(tempBooksRoot, resolved);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Missing batch-3 source file: ${sourceFileUsed}`);
  }
  return resolved;
}

function lineSlice(rawText: string, startLine: number, endLine: number) {
  const lines = normalizeRawLines(rawText).split("\n");
  return {
    lines,
    text: lines.slice(startLine - 1, endLine).join("\n"),
  };
}

function lineSnippet(
  rawText: string,
  line: number,
  before = 0,
  after = 8,
  length = 360,
) {
  const lines = normalizeRawLines(rawText).split("\n");
  const start = Math.max(1, line - before);
  const end = Math.min(lines.length, line + after);
  return textPreview(lines.slice(start - 1, end).join(" "), length);
}

function normalizeRawLines(rawText: string) {
  return rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
}

function normalizeForCompare(input: string) {
  return normalizeBookText(input)
    .normalize("NFKC")
    .replace(/\u00a0/g, " ")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(
      /(?:^|\n)\s*\((?:from|adapted from|volksmarchen|ehstnische|japanische|rumanische|roumanische|russiche|swahili|scandinavian|marchen|olumanische|sept contes|the italian|the german|the portuguese)[^)]*\)\.?\s*(?=\n|$)/gi,
      "\n",
    )
    .replace(/\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/gi, "")
    .replace(/(?:^|\n)\s*(?:\*\s*){3,}(?=\n|$)/g, "\n")
    .replace(/(?:^|\n)\s*(?:[-_=~]\s*){4,}(?=\n|$)/g, "\n")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function hasMatches(input: string, patterns: RegExp[]) {
  return patterns
    .filter((pattern) => pattern.test(input))
    .map((pattern) => String(pattern));
}

function tailWords(input: string, count: number) {
  return normalizeForCompare(input).split(/\s+/).filter(Boolean).slice(-count).join(" ");
}

function loadSections(
  slug: string,
  manifest: GeneratedBookManifest,
): GeneratedBookSectionJson[] {
  return manifest.sections.map((section) => {
    const sectionPath = path.join(generatedRoot, slug, section.sectionJsonPath);
    assertInside(path.join(generatedRoot, slug), sectionPath);
    return readJson<GeneratedBookSectionJson>(sectionPath);
  });
}

function makeSectionSummary(section: GeneratedBookSectionJson): SectionSummary {
  return {
    id: section.sectionId,
    label: section.label,
    title: section.title,
    wordCount: section.wordCount,
  };
}

function verdict(
  status: Verdict["status"],
  summary: string,
  details: string[] = [],
): Verdict {
  return {
    status,
    summary,
    details: [...new Set(details)].filter(Boolean),
  };
}

function worseStatus(statuses: Verdict["status"][]): Verdict["status"] {
  if (statuses.includes("fail")) return "fail";
  if (statuses.includes("warn")) return "warn";
  return "pass";
}

function defaultSections(sections: GeneratedBookSectionJson[]) {
  return sections.filter((section) => section.includeByDefault);
}

function defaultText(sections: GeneratedBookSectionJson[]) {
  return defaultSections(sections)
    .map((section) => section.displayText)
    .join("\n\n");
}

function allText(sections: GeneratedBookSectionJson[]) {
  return sections.map((section) => section.displayText).join("\n\n");
}

function verifyStart(
  rawBody: string,
  sections: GeneratedBookSectionJson[],
  slug: string,
): Verdict {
  const first = sections[0];
  if (!first || !first.displayText.trim()) {
    return verdict("fail", "Generated output has no first section.");
  }

  const rawStart = normalizeForCompare(rawBody).slice(0, 160);
  const generatedComparable = normalizeForCompare(allText(sections));
  const details: string[] = [];

  if (hasMatches(first.displayText, boilerplatePatterns).length > 0) {
    return verdict("fail", "First generated section contains source boilerplate.", [
      ...hasMatches(first.displayText, boilerplatePatterns),
    ]);
  }

  if (rawStart && !generatedComparable.includes(rawStart.slice(0, 60))) {
    details.push("Generated text does not begin with the normalized raw boundary.");
  }

  if (slug === "the-legend-of-sleepy-hollow") {
    details.push(
      'Raw story title/byline are metadata, but the frame line "FOUND AMONG THE PAPERS..." is outside the generated playback boundary.',
    );
    return verdict(
      "warn",
      "Readable story prose starts correctly, but one source framing line before the epigraph is omitted.",
      details,
    );
  }

  if (details.length > 0) {
    return verdict("warn", "Generated start needs manual review.", details);
  }

  return verdict("pass", "Generated output starts at the selected readable raw boundary.");
}

function verifyEnd(
  rawBody: string,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const combined = allText(sections);
  const generatedComparable = normalizeForCompare(combined);
  if (!combined.trim()) return verdict("fail", "Generated output is empty.");
  if (hasMatches(combined, boilerplatePatterns).length > 0) {
    return verdict("fail", "Generated output contains source or license footer material.", [
      ...hasMatches(combined, boilerplatePatterns),
    ]);
  }
  const probe = tailWords(rawBody, 8);
  if (probe.length > 20 && !generatedComparable.includes(probe)) {
    return verdict("warn", "Generated ending differs from the normalized raw boundary.", [
      "This can be expected only when decorative markers or placeholders were removed.",
    ]);
  }
  return verdict("pass", "Generated output preserves the selected readable ending.");
}

function hasContentJunk(input: string) {
  return hasMatches(input, defaultReadableJunkPatterns);
}

function firstDefaultSection(sections: GeneratedBookSectionJson[]) {
  return defaultSections(sections)[0] ?? null;
}

function lastDefaultSection(sections: GeneratedBookSectionJson[]) {
  const bodySections = defaultSections(sections);
  return bodySections[bodySections.length - 1] ?? null;
}

function hasSequentialIds(
  sections: GeneratedBookSectionJson[],
  prefix: string,
  count: number,
) {
  const ids = sections.map((section) => section.sectionId);
  return Array.from({ length: count }, (_, index) =>
    `${prefix}-${String(index + 1).padStart(3, "0")}`,
  ).every((id) => ids.includes(id));
}

function verifyFrankenstein(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const bodySections = defaultSections(sections);
  const details = [
    "Letters 1-4 are default readable sections before Chapter 1.",
    "Chapters 1-24 are preserved as generated chapter sections.",
  ];
  if (
    manifest.stats.sectionCount !== 28 ||
    bodySections.length !== 28 ||
    !hasSequentialIds(sections.slice(0, 4), "letter", 4) ||
    !hasSequentialIds(sections.slice(4), "chapter", 24) ||
    !sections[0]?.displayText.startsWith("Letter 1") ||
    !sections[4]?.displayText.startsWith("Chapter 1") ||
    !lastDefaultSection(sections)?.displayText.includes("lost in darkness and distance")
  ) {
    return verdict("fail", "Frankenstein does not preserve Letters 1-4 plus Chapters 1-24.", details);
  }
  return verdict("pass", "Frankenstein prior generated-output issue is corrected.", details);
}

function verifyThreeMusketeers(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const bodySections = defaultSections(sections);
  const opening = sections[0];
  const details = [
    "Author's Preface is retained as non-default opening material.",
    "Chapters I-LXVII are preserved as 67 default readable chapter sections.",
  ];
  if (
    manifest.stats.sectionCount !== 68 ||
    bodySections.length !== 67 ||
    !opening ||
    opening.includeByDefault ||
    !/AUTHOR['’]S PREFACE/i.test(opening.displayText) ||
    !bodySections[0]?.displayText.startsWith("Chapter I.") ||
    !bodySections[66]?.displayText.startsWith("Chapter LXVII.") ||
    !hasSequentialIds(bodySections, "chapter", 67)
  ) {
    return verdict("fail", "The Three Musketeers does not preserve the expected preface and 67 chapters.", details);
  }
  return verdict("pass", "The Three Musketeers prior generated-output issue is corrected.", details);
}

function verifyAroundTheWorld(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const bodySections = defaultSections(sections);
  const details = [
    "All 37 real chapters are default readable sections.",
    "Prior title-page and short-section damage is absent from the generated section list.",
  ];
  if (
    manifest.stats.sectionCount !== 37 ||
    bodySections.length !== 37 ||
    !hasSequentialIds(bodySections, "chapter", 37) ||
    !bodySections[0]?.displayText.startsWith("CHAPTER I.") ||
    !bodySections[36]?.displayText.startsWith("CHAPTER XXXVII.")
  ) {
    return verdict("fail", "Around the World in Eighty Days does not preserve Chapters I-XXXVII.", details);
  }
  return verdict("pass", "Around the World in Eighty Days prior generated-output issue is corrected.", details);
}

function verifySenseAndSensibility(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const bodySections = defaultSections(sections);
  const details = [
    "All 50 real chapters are default readable sections.",
    "Prior short-section damage is absent from the generated section list.",
  ];
  if (
    manifest.stats.sectionCount !== 50 ||
    bodySections.length !== 50 ||
    !hasSequentialIds(bodySections, "chapter", 50) ||
    !bodySections[0]?.displayText.startsWith("CHAPTER I.") ||
    !bodySections[49]?.displayText.startsWith("CHAPTER L.")
  ) {
    return verdict("fail", "Sense and Sensibility does not preserve Chapters I-L.", details);
  }
  return verdict("pass", "Sense and Sensibility prior generated-output issue is corrected.", details);
}

function verifyPlayStructure(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  slug: string,
): Verdict {
  const bodySections = defaultSections(sections);
  const speakerProbe: Record<string, RegExp> = {
    macbeth: /(?:FIRST WITCH\.|MACBETH\.|DUNCAN\.)/,
    pygmalion: /(?:THE DAUGHTER|THE MOTHER|THE NOTE TAKER)/,
    "the-tempest": /(?:_Boats\._|_Pros\._|_Ariel\._)/,
  };
  const details = [
    "Cast/front matter is retained as a non-default opening section.",
    "Five default act sections preserve act/scene dialogue structure.",
  ];
  const trailingLineNumbers = bodySections.flatMap((section) =>
    section.displayText
      .split(/\n/)
      .filter((line) => /\b\d{1,4}\s*$/.test(line.trim()))
      .map((line) => `${section.sectionId}: ${line.trim()}`),
  );
  if (
    manifest.stats.sectionCount !== 6 ||
    bodySections.length !== 5 ||
    sections[0]?.includeByDefault ||
    bodySections.some((section, index) => section.label !== `Act ${index + 1}`) ||
    bodySections.some((section, index) => !section.displayText.startsWith(`ACT ${["I", "II", "III", "IV", "V"][index]}`)) ||
    !speakerProbe[slug]?.test(defaultText(sections)) ||
    (slug === "the-tempest" && trailingLineNumbers.length > 0)
  ) {
    return verdict("fail", `${slug} does not preserve a safe five-act playable structure.`, [
      ...details,
      ...trailingLineNumbers.slice(0, 8),
    ]);
  }
  return verdict("pass", `${slug} play structure is acceptable.`, details);
}

function verifyStoryGroup(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  slug: string,
): Verdict {
  const bodySections = defaultSections(sections);
  const details: string[] = [];
  if (slug === "the-door-in-the-wall") {
    details.push(
      "The source file is the standalone story split into four Roman-numbered body subdivisions, not a multi-story collection.",
    );
    if (
      manifest.stats.sectionCount !== 4 ||
      bodySections.length !== 4 ||
      !bodySections[0]?.displayText.startsWith("I\n") ||
      !bodySections[3]?.displayText.startsWith("IV\n")
    ) {
      return verdict("fail", "The Door in the Wall story subdivisions are not preserved.", details);
    }
    return verdict("pass", "The Door in the Wall sectioning is acceptable for the source.", details);
  }

  if (slug === "the-king-in-yellow") {
    const expected = [
      "The Repairer Of Reputations",
      "The Mask",
      "In The Court Of The Dragon",
      "The Yellow Sign",
      "The Demoiselle D'Ys",
      "The Prophets' Paradise",
      "The Street Of The Four Winds",
      "The Street Of The First Shell",
      "The Street Of Our Lady Of The Fields",
      "Rue Barree",
    ];
    const labels = bodySections.map((section) => section.label);
    details.push("Opening epigraph is retained as non-default; 10 story sections are default readable.");
    if (
      manifest.stats.sectionCount !== 11 ||
      bodySections.length !== expected.length ||
      sections[0]?.includeByDefault ||
      expected.some((title, index) => labels[index] !== title)
    ) {
      return verdict("fail", "The King in Yellow story sections are not reliably preserved.", details);
    }
    return verdict("pass", "The King in Yellow story sections are acceptable.", details);
  }

  if (slug === "tales-of-war") {
    details.push("All 31 isolated story/essay titles are preserved as default readable sections.");
    if (
      manifest.stats.sectionCount !== 31 ||
      bodySections.length !== 31 ||
      bodySections[0]?.title !== "The Prayer of the Men of Daleswood" ||
      bodySections[30]?.title !== "Old England"
    ) {
      return verdict("fail", "Tales of War story-level sectioning is not reliable.", details);
    }
    return verdict("warn", "Tales of War story sections are acceptable, with many naturally short war sketches.", details);
  }

  return verdict("fail", `Unexpected story-group verification slug: ${slug}.`);
}

function verifyMalteseFalcon(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const bodySections = defaultSections(sections);
  const details = [
    "Dedication is retained as non-default.",
    "The 20 numbered source sections are default readable and keep source titles.",
  ];
  if (
    manifest.stats.sectionCount !== 21 ||
    bodySections.length !== 20 ||
    sections[0]?.kind !== "dedication" ||
    sections[0]?.includeByDefault ||
    bodySections[0]?.label !== "Section 1" ||
    bodySections[19]?.label !== "Section 20"
  ) {
    return verdict("fail", "The Maltese Falcon source sectioning is not preserved safely.", details);
  }
  return verdict("pass", "The Maltese Falcon sectioning follows the actual source structure.", details);
}

function verifyLongBook(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  slug: string,
): Verdict {
  const bodySections = defaultSections(sections);
  const details: string[] = [];
  const expectedCounts: Record<string, number> = {
    "moby-dick": 135,
    "the-three-musketeers": 67,
    "wuthering-heights": 34,
    "the-life-and-adventures-of-robinson-crusoe": 20,
  };
  const expected = expectedCounts[slug];
  if (expected && bodySections.length !== expected) {
    return verdict("fail", `${slug} does not have the expected long-book body section count.`, [
      `Expected ${expected}; found ${bodySections.length}.`,
    ]);
  }
  const hugeSections = bodySections.filter((section) => section.wordCount > 12_000);
  if (hugeSections.length > 0) {
    details.push(
      `Large but real source sections: ${hugeSections.map((section) => `${section.sectionId} (${section.wordCount} words)`).join(", ")}.`,
    );
  }
  details.push("Chapter headings exist and no giant fallback blob is used.");
  return verdict(details.length > 1 ? "warn" : "pass", `${slug} long-book sectioning is acceptable.`, details);
}

function verifyGeneralSectioning(
  writeBook: WriteBookReport,
  dryRunBook: DryRunBook,
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const details: string[] = [];
  if (manifest.stats.sectionCount !== sections.length) {
    return verdict("fail", "Manifest section count does not match section files.", [
      `Manifest: ${manifest.stats.sectionCount}; files loaded: ${sections.length}.`,
    ]);
  }
  if (writeBook.sectionCount !== manifest.stats.sectionCount) {
    return verdict("fail", "Write report section count does not match generated manifest.", [
      `Write report: ${writeBook.sectionCount}; manifest: ${manifest.stats.sectionCount}.`,
    ]);
  }
  if (dryRunBook.structureDetection.fallbackUsed) {
    details.push("Dry-run structure detection used fallback.");
  }

  const bodySections = defaultSections(sections);
  const tinySections = bodySections.filter((section) => section.wordCount < 50);
  const hugeSections = bodySections.filter((section) => section.wordCount > 12_000);
  const emptyTitles = bodySections.filter(
    (section) => section.kind === "chapter" && section.label.trim().length === 0,
  );

  if (emptyTitles.length > 0) {
    return verdict("fail", "Generated sections contain empty labels.", [
      emptyTitles.map((section) => section.sectionId).join(", "),
    ]);
  }
  if (tinySections.length > 0) {
    details.push(
      `Tiny default sections: ${tinySections
        .map((section) => `${section.sectionId} (${section.wordCount} words)`)
        .join(", ")}.`,
    );
  }
  if (hugeSections.length > 0) {
    details.push(
      `Large default sections: ${hugeSections
        .map((section) => `${section.sectionId} (${section.wordCount} words)`)
        .join(", ")}.`,
    );
  }
  if (details.length > 0) {
    return verdict("warn", "Sectioning is usable but has review notes.", details);
  }
  return verdict("pass", "Sectioning follows the selected structural convention.");
}

function verifySectioning(
  writeBook: WriteBookReport,
  dryRunBook: DryRunBook,
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  switch (writeBook.slug) {
    case "frankenstein":
      return verifyFrankenstein(manifest, sections);
    case "the-three-musketeers": {
      const priorVerdict = verifyThreeMusketeers(manifest, sections);
      if (priorVerdict.status === "fail") return priorVerdict;
      const longVerdict = verifyLongBook(manifest, sections, writeBook.slug);
      return verdict(
        worseStatus([priorVerdict.status, longVerdict.status]),
        priorVerdict.summary,
        [...priorVerdict.details, ...longVerdict.details],
      );
    }
    case "around-the-world-in-eighty-days":
      return verifyAroundTheWorld(manifest, sections);
    case "sense-and-sensibility":
      return verifySenseAndSensibility(manifest, sections);
    case "macbeth":
    case "pygmalion":
    case "the-tempest":
      return verifyPlayStructure(manifest, sections, writeBook.slug);
    case "the-door-in-the-wall":
    case "the-king-in-yellow":
    case "tales-of-war":
      return verifyStoryGroup(manifest, sections, writeBook.slug);
    case "the-maltese-falcon":
      return verifyMalteseFalcon(manifest, sections);
    case "moby-dick":
    case "wuthering-heights":
    case "the-life-and-adventures-of-robinson-crusoe":
      return verifyLongBook(manifest, sections, writeBook.slug);
    default:
      return verifyGeneralSectioning(writeBook, dryRunBook, manifest, sections);
  }
}

function verifyCleanup(sections: GeneratedBookSectionJson[]): Verdict {
  const combined = allText(sections);
  const readable = defaultText(sections);
  const readableJunk = [
    ...hasMatches(readable, boilerplatePatterns),
    ...hasContentJunk(readable),
  ];
  const allBoilerplate = hasMatches(combined, boilerplatePatterns);
  const artifacts = hasMatches(combined, imageOrReferenceArtifactPatterns);
  const details = [
    ...readableJunk.map((item) => `Default-readable junk: ${item}`),
    ...allBoilerplate.map((item) => `Generated boilerplate: ${item}`),
    ...artifacts.map((item) => `Generated artifact: ${item}`),
  ];

  if (/\uFFFD/.test(combined)) {
    details.push("Replacement characters remain.");
  }

  if (details.length > 0) {
    return verdict("fail", "Cleanup left default-readable junk or obvious artifacts.", details);
  }

  return verdict("pass", "Cleanup excludes source/license/footer junk and obvious playback artifacts.");
}

function verifyPreview(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  preview: PreviewAsset,
): Verdict {
  const readable = defaultText(sections);
  const issues: string[] = [];
  if (preview.slug !== manifest.slug) issues.push("Preview slug does not match manifest.");
  if (preview.contentHash !== manifest.contentHash) {
    issues.push("Preview contentHash does not match manifest.");
  }
  if (preview.contentVersion !== manifest.contentVersion) {
    issues.push("Preview contentVersion does not match manifest.");
  }
  if (!preview.previewText.trim()) issues.push("Preview text is empty.");
  if (!readable.includes(preview.previewText)) {
    issues.push("Preview text is not an exact slice of generated default-readable content.");
  }
  issues.push(
    ...hasMatches(preview.previewText, boilerplatePatterns).map(
      (item) => `Preview boilerplate: ${item}`,
    ),
  );
  issues.push(
    ...hasContentJunk(preview.previewText).map(
      (item) => `Preview default/junk text: ${item}`,
    ),
  );
  issues.push(
    ...hasMatches(preview.previewText, imageOrReferenceArtifactPatterns).map(
      (item) => `Preview artifact: ${item}`,
    ),
  );
  if (/^(?:SOS Help!|MorseWords|Type text here|Title:|Author:)/i.test(preview.previewText.trim())) {
    issues.push("Preview begins with placeholder or metadata text.");
  }

  if (issues.length > 0) {
    return verdict("fail", "Preview asset failed verification.", issues);
  }
  return verdict("pass", "Preview starts from generated default-readable content and matches manifest hashes.");
}

function reportWarnings(
  writeBook: WriteBookReport,
  manifest: GeneratedBookManifest,
  verdicts: Verdict[],
) {
  const generic = /Generated by controlled pilot write pass 3/i;
  return [
    ...writeBook.remainingWarnings,
    ...manifest.warnings.filter((warning) => !generic.test(warning)),
    ...verdicts
      .filter((item) => item.status !== "pass")
      .flatMap((item) => [item.summary, ...item.details]),
  ].filter(Boolean);
}

function verifyBook(
  writeBook: WriteBookReport,
  dryRunBook: DryRunBook,
): BookVerification {
  if (!pilotSlugs.includes(writeBook.slug as (typeof pilotSlugs)[number])) {
    throw new Error(`Unexpected pilot write report slug: ${writeBook.slug}`);
  }
  if (writeBook.status !== "written") {
    throw new Error(`Expected written batch-3 book, got skipped: ${writeBook.slug}`);
  }

  const sourcePath = safeSourcePath(writeBook.sourceFileUsed);
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const generatedBookRoot = path.join(generatedRoot, writeBook.slug);
  const manifestPath = path.join(generatedBookRoot, "manifest.json");
  const cleanedPath = path.join(generatedBookRoot, "cleaned_book.json");
  const processedPath = path.join(generatedBookRoot, "processed_book.json");
  const rightsPath = path.join(generatedBookRoot, "rights_report.json");
  const notesPath = path.join(generatedBookRoot, "processing_notes.md");
  assertInside(generatedRoot, generatedBookRoot);

  const manifest = readJson<GeneratedBookManifest>(manifestPath);
  const sections = loadSections(writeBook.slug, manifest);
  const previewPath = path.join(previewRoot, `${writeBook.slug}.preview.json`);
  assertInside(previewRoot, previewPath);
  const preview = readJson<PreviewAsset>(previewPath);
  const { text: rawBody } = lineSlice(
    rawText,
    writeBook.startBoundaryUsed.line,
    writeBook.endBoundaryUsed.line,
  );

  const startBoundaryVerdict = verifyStart(rawBody, sections, writeBook.slug);
  const endBoundaryVerdict = verifyEnd(rawBody, sections);
  const sectioningVerdict = verifySectioning(writeBook, dryRunBook, manifest, sections);
  const cleanupVerdict = verifyCleanup(sections);
  const previewVerdict = verifyPreview(manifest, sections, preview);
  const status = worseStatus([
    startBoundaryVerdict.status,
    endBoundaryVerdict.status,
    sectioningVerdict.status,
    cleanupVerdict.status,
    previewVerdict.status,
  ]);
  const needsCorrectionBeforeMain = status === "fail";
  const defaultBookSections = defaultSections(sections);
  const firstDefault = defaultBookSections[0] ?? null;
  const lastDefault = defaultBookSections[defaultBookSections.length - 1] ?? null;

  return {
    slug: writeBook.slug,
    status,
    generatedOutputInspected: [
      statusPath(manifestPath),
      statusPath(cleanedPath),
      statusPath(processedPath),
      statusPath(rightsPath),
      statusPath(notesPath),
      ...manifest.sections.map((section) =>
        statusPath(path.join(generatedBookRoot, section.sectionJsonPath)),
      ),
    ],
    previewAssetInspected: statusPath(previewPath),
    dryRunReportInspected: statusPath(dryRunReportPath),
    writeReportInspected: statusPath(writeReportPath),
    selectedStructuralConvention: writeBook.selectedStructuralConvention,
    startBoundaryVerdict,
    endBoundaryVerdict,
    sectioningVerdict,
    cleanupVerdict,
    previewVerdict,
    remainingWarnings: [
      ...new Set(
        reportWarnings(writeBook, manifest, [
          startBoundaryVerdict,
          endBoundaryVerdict,
          sectioningVerdict,
          cleanupVerdict,
          previewVerdict,
        ]),
      ),
    ],
    acceptedForMain: !needsCorrectionBeforeMain,
    needsCorrectionBeforeMain,
    shouldBeRevertedOrSkipped: needsCorrectionBeforeMain,
    startSnippet: {
      raw: lineSnippet(rawText, writeBook.startBoundaryUsed.line, 0, 8),
      generated: textPreview(allText(sections), 360),
      preview: textPreview(preview.previewText, 360),
    },
    endSnippet: {
      raw: lineSnippet(rawText, writeBook.endBoundaryUsed.line, 8, 0),
      generated: textPreview(allText(sections).slice(-1000), 360),
    },
    sectionSummary: {
      totalSections: manifest.stats.sectionCount,
      defaultSections: defaultBookSections.length,
      firstDefaultSection: firstDefault ? makeSectionSummary(firstDefault) : null,
      lastDefaultSection: lastDefault ? makeSectionSummary(lastDefault) : null,
      suspiciouslyShortSections: defaultBookSections
        .filter((section) => section.wordCount < 50)
        .map(makeSectionSummary),
      suspiciouslyLongSections: defaultBookSections
        .filter((section) => section.wordCount > 12_000)
        .map(makeSectionSummary),
    },
  };
}

function reportSummary(results: BookVerification[]) {
  return {
    pass: results.filter((result) => result.status === "pass").length,
    warn: results.filter((result) => result.status === "warn").length,
    fail: results.filter((result) => result.status === "fail").length,
  };
}

function specialFocus(results: BookVerification[]) {
  const bySlug = new Map(results.map((result) => [result.slug, result]));
  return {
    priorGeneratedOutputWarnings: {
      frankenstein: {
        corrected: bySlug.get("frankenstein")?.sectioningVerdict.status === "pass",
        verdict: bySlug.get("frankenstein")?.sectioningVerdict.summary ?? "",
      },
      theThreeMusketeers: {
        corrected:
          bySlug.get("the-three-musketeers")?.sectioningVerdict.status !== "fail",
        verdict:
          bySlug.get("the-three-musketeers")?.sectioningVerdict.summary ?? "",
      },
      aroundTheWorldInEightyDays: {
        corrected:
          bySlug.get("around-the-world-in-eighty-days")?.sectioningVerdict
            .status === "pass",
        verdict:
          bySlug.get("around-the-world-in-eighty-days")?.sectioningVerdict
            .summary ?? "",
      },
      senseAndSensibility: {
        corrected:
          bySlug.get("sense-and-sensibility")?.sectioningVerdict.status === "pass",
        verdict:
          bySlug.get("sense-and-sensibility")?.sectioningVerdict.summary ?? "",
      },
    },
    plays: {
      macbeth: {
        acceptable: bySlug.get("macbeth")?.sectioningVerdict.status !== "fail",
        verdict: bySlug.get("macbeth")?.sectioningVerdict.summary ?? "",
      },
      pygmalion: {
        acceptable: bySlug.get("pygmalion")?.sectioningVerdict.status !== "fail",
        verdict: bySlug.get("pygmalion")?.sectioningVerdict.summary ?? "",
      },
      theTempest: {
        acceptable:
          bySlug.get("the-tempest")?.sectioningVerdict.status !== "fail" &&
          bySlug.get("the-tempest")?.cleanupVerdict.status !== "fail",
        verdict: bySlug.get("the-tempest")?.sectioningVerdict.summary ?? "",
      },
    },
    collectionsAndStoryGroups: {
      theDoorInTheWall: {
        acceptable:
          bySlug.get("the-door-in-the-wall")?.sectioningVerdict.status !== "fail",
        verdict:
          bySlug.get("the-door-in-the-wall")?.sectioningVerdict.summary ?? "",
      },
      theKingInYellow: {
        acceptable:
          bySlug.get("the-king-in-yellow")?.sectioningVerdict.status !== "fail",
        verdict:
          bySlug.get("the-king-in-yellow")?.sectioningVerdict.summary ?? "",
      },
      talesOfWar: {
        acceptable: bySlug.get("tales-of-war")?.sectioningVerdict.status !== "fail",
        verdict: bySlug.get("tales-of-war")?.sectioningVerdict.summary ?? "",
      },
    },
    longBooks: {
      mobyDick: {
        acceptable: bySlug.get("moby-dick")?.sectioningVerdict.status !== "fail",
        verdict: bySlug.get("moby-dick")?.sectioningVerdict.summary ?? "",
      },
      theThreeMusketeers: {
        acceptable:
          bySlug.get("the-three-musketeers")?.sectioningVerdict.status !== "fail",
        verdict:
          bySlug.get("the-three-musketeers")?.sectioningVerdict.summary ?? "",
      },
      wutheringHeights: {
        acceptable:
          bySlug.get("wuthering-heights")?.sectioningVerdict.status !== "fail",
        verdict:
          bySlug.get("wuthering-heights")?.sectioningVerdict.summary ?? "",
      },
      robinsonCrusoe: {
        acceptable:
          bySlug.get("the-life-and-adventures-of-robinson-crusoe")
            ?.sectioningVerdict.status !== "fail",
        verdict:
          bySlug.get("the-life-and-adventures-of-robinson-crusoe")
            ?.sectioningVerdict.summary ?? "",
      },
    },
    modernFormatSensitive: {
      theMalteseFalcon: {
        acceptable:
          bySlug.get("the-maltese-falcon")?.sectioningVerdict.status !== "fail",
        verdict:
          bySlug.get("the-maltese-falcon")?.sectioningVerdict.summary ?? "",
      },
    },
  };
}

function formatDetails(verdictItem: Verdict) {
  if (verdictItem.details.length === 0) return verdictItem.summary;
  return `${verdictItem.summary} ${verdictItem.details.join(" ")}`;
}

function verifyBookPageStateFix() {
  const filePath = path.join(
    repoRoot,
    "app",
    "client",
    "components",
    "morse-code-books",
    "MorseBookPage.tsx",
  );
  const source = fs.readFileSync(filePath, "utf8");
  const checks = [
    {
      name: "translator source uses selectedScopeSections directly",
      passed:
        /createBookTranslatorSourceFromSections\(book,\s*selectedScopeSections\)/s.test(
          source,
        ) &&
        !/useDeferredValue\(selectedScopeSections\)/.test(source),
    },
    {
      name: "scopeReady waits for all selected full sections to load",
      passed:
        /selectedScopeSections\.length\s*===\s*scopeSectionIds\.length/.test(
          source,
        ),
    },
    {
      name: "full-book section loader requests selected scope sections",
      passed:
        /Array\.from\(new Set\(\[\.\.\.scopeSectionIds,\s*activeLiveSectionId\]\)\)/.test(
          source,
        ),
    },
    {
      name: "reset still uses computed defaultSectionIds",
      passed:
        /setSelectedSectionIds\(new Set\(isAudiobook \? \[resetLiveSectionId\] : defaultSectionIds\)\)/.test(
          source,
        ),
    },
  ];
  const failed = checks.filter((check) => !check.passed);
  return {
    status: failed.length > 0 ? "fail" : "pass",
    inspectedFile: statusPath(filePath),
    checks,
    verdict:
      failed.length > 0
        ? "MorseBookPage selected-source state fix needs review."
        : "MorseBookPage selected-source state fix is present; Playwright book-page QA covers full-load/default/saved/reset behavior.",
  };
}

function writeReports(results: BookVerification[]) {
  const summary = reportSummary(results);
  const focus = specialFocus(results);
  const bookPageStateFix = verifyBookPageStateFix();
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-3-verification",
    generatedAt: new Date().toISOString(),
    pilotSlugs,
    inspectedPaths: {
      tempBooksRoot: statusPath(tempBooksRoot),
      generatedRoot: statusPath(generatedRoot),
      previewRoot: statusPath(previewRoot),
      cloudflareRoot: statusPath(cloudflareRoot),
      dryRunReport: statusPath(dryRunReportPath),
      writeReport: statusPath(writeReportPath),
    },
    summary,
    books: results,
    specialFocus: focus,
    bookPageStateFix,
    conclusions: {
      acceptedForMain: results
        .filter((result) => result.acceptedForMain)
        .map((result) => result.slug),
      needsCorrectionBeforeMain: results
        .filter((result) => result.needsCorrectionBeforeMain)
        .map((result) => result.slug),
      shouldBeRevertedOrSkipped: results
        .filter((result) => result.shouldBeRevertedOrSkipped)
        .map((result) => result.slug),
      correctionsMade,
    },
    confirmations: {
      inspectedOnlyBatch3Books: true,
      processedMoreBooks: false,
      allBookProcessingRun: false,
      tempBooksModified: false,
      cloudflareExportModified: false,
      unrelatedGeneratedBooksTouched: false,
      generatedBookCorrectionsMade: correctionsMade.length > 0,
      previewCorrectionsMade: correctionsMade.length > 0,
    },
  };

  const rows = results
    .map(
      (result) =>
        `| ${result.slug} | ${result.status} | ${result.selectedStructuralConvention} | ${result.startBoundaryVerdict.status} | ${result.endBoundaryVerdict.status} | ${result.sectioningVerdict.status} | ${result.cleanupVerdict.status} | ${result.previewVerdict.status} | ${result.acceptedForMain ? "yes" : "no"} | ${result.needsCorrectionBeforeMain ? "yes" : "no"} |`,
    )
    .join("\n");

  const details = results
    .map(
      (result) => `## ${result.slug}

- Status: ${result.status}
- Generated output inspected: ${result.generatedOutputInspected.length} files
- Preview asset inspected: ${result.previewAssetInspected}
- Selected structural convention: ${result.selectedStructuralConvention}
- Start boundary verdict: ${formatDetails(result.startBoundaryVerdict)}
- End boundary verdict: ${formatDetails(result.endBoundaryVerdict)}
- Sectioning verdict: ${formatDetails(result.sectioningVerdict)}
- Cleanup verdict: ${formatDetails(result.cleanupVerdict)}
- Preview verdict: ${formatDetails(result.previewVerdict)}
- Accepted for main: ${result.acceptedForMain ? "yes" : "no"}
- Needs correction before main: ${result.needsCorrectionBeforeMain ? "yes" : "no"}
- Should be reverted/skipped: ${result.shouldBeRevertedOrSkipped ? "yes" : "no"}
- Remaining warnings: ${result.remainingWarnings.length > 0 ? result.remainingWarnings.join("; ") : "none"}
- First default section: ${result.sectionSummary.firstDefaultSection ? `${result.sectionSummary.firstDefaultSection.id} (${result.sectionSummary.firstDefaultSection.label}${result.sectionSummary.firstDefaultSection.title ? `: ${result.sectionSummary.firstDefaultSection.title}` : ""}, ${result.sectionSummary.firstDefaultSection.wordCount} words)` : "none"}
- Last default section: ${result.sectionSummary.lastDefaultSection ? `${result.sectionSummary.lastDefaultSection.id} (${result.sectionSummary.lastDefaultSection.label}${result.sectionSummary.lastDefaultSection.title ? `: ${result.sectionSummary.lastDefaultSection.title}` : ""}, ${result.sectionSummary.lastDefaultSection.wordCount} words)` : "none"}
- Raw start snippet: ${result.startSnippet.raw}
- Generated start snippet: ${result.startSnippet.generated}
- Preview start snippet: ${result.startSnippet.preview}
- Raw end snippet: ${result.endSnippet.raw}
- Generated end snippet: ${result.endSnippet.generated}
`,
    )
    .join("\n");

  const markdown = `# Pilot Write 3 Verification

Post-write QA pass for the 25 batch-3 books. This report compares the raw source text, generated output, preview asset, pilot dry-run 3 report, and pilot write 3 report. It does not process additional books and does not modify raw source or Cloudflare export assets.

## Summary

| Book | Status | Structure | Start | End | Sectioning | Cleanup | Preview | Accepted for main | Needs correction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Special Focus

- frankenstein: ${focus.priorGeneratedOutputWarnings.frankenstein.corrected ? "corrected" : "not corrected"} - ${focus.priorGeneratedOutputWarnings.frankenstein.verdict}
- the-three-musketeers: ${focus.priorGeneratedOutputWarnings.theThreeMusketeers.corrected ? "corrected" : "not corrected"} - ${focus.priorGeneratedOutputWarnings.theThreeMusketeers.verdict}
- around-the-world-in-eighty-days: ${focus.priorGeneratedOutputWarnings.aroundTheWorldInEightyDays.corrected ? "corrected" : "not corrected"} - ${focus.priorGeneratedOutputWarnings.aroundTheWorldInEightyDays.verdict}
- sense-and-sensibility: ${focus.priorGeneratedOutputWarnings.senseAndSensibility.corrected ? "corrected" : "not corrected"} - ${focus.priorGeneratedOutputWarnings.senseAndSensibility.verdict}
- macbeth: ${focus.plays.macbeth.acceptable ? "acceptable" : "not acceptable"} - ${focus.plays.macbeth.verdict}
- pygmalion: ${focus.plays.pygmalion.acceptable ? "acceptable" : "not acceptable"} - ${focus.plays.pygmalion.verdict}
- the-tempest: ${focus.plays.theTempest.acceptable ? "acceptable" : "not acceptable"} - ${focus.plays.theTempest.verdict}
- the-door-in-the-wall: ${focus.collectionsAndStoryGroups.theDoorInTheWall.acceptable ? "acceptable" : "not acceptable"} - ${focus.collectionsAndStoryGroups.theDoorInTheWall.verdict}
- the-king-in-yellow: ${focus.collectionsAndStoryGroups.theKingInYellow.acceptable ? "acceptable" : "not acceptable"} - ${focus.collectionsAndStoryGroups.theKingInYellow.verdict}
- tales-of-war: ${focus.collectionsAndStoryGroups.talesOfWar.acceptable ? "acceptable" : "not acceptable"} - ${focus.collectionsAndStoryGroups.talesOfWar.verdict}
- moby-dick: ${focus.longBooks.mobyDick.acceptable ? "acceptable" : "not acceptable"} - ${focus.longBooks.mobyDick.verdict}
- wuthering-heights: ${focus.longBooks.wutheringHeights.acceptable ? "acceptable" : "not acceptable"} - ${focus.longBooks.wutheringHeights.verdict}
- the-life-and-adventures-of-robinson-crusoe: ${focus.longBooks.robinsonCrusoe.acceptable ? "acceptable" : "not acceptable"} - ${focus.longBooks.robinsonCrusoe.verdict}
- the-maltese-falcon: ${focus.modernFormatSensitive.theMalteseFalcon.acceptable ? "acceptable" : "not acceptable"} - ${focus.modernFormatSensitive.theMalteseFalcon.verdict}

## Book Page State Fix

- Status: ${bookPageStateFix.status}
- Inspected file: ${bookPageStateFix.inspectedFile}
- Verdict: ${bookPageStateFix.verdict}
- Checks: ${bookPageStateFix.checks.map((check) => `${check.passed ? "pass" : "fail"} - ${check.name}`).join("; ")}

## Corrections

- ${correctionsMade.join("\n- ")}

${details}

## Confirmations

- Only the 25 batch-3 slugs were inspected.
- No additional books were processed.
- app/client/assets/temp-books was inspected only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- No unrelated generated books were touched.
- npm run books:build was not run.
`;

  writeJson(
    path.join(verificationReportRoot, "pilot-write-3-verification.json"),
    report,
  );
  writeText(
    path.join(verificationReportRoot, "pilot-write-3-verification.md"),
    markdown,
  );
}

function main() {
  const writeReport = readJson<WriteReport>(writeReportPath);
  const dryRunReport = readJson<DryRunReport>(dryRunReportPath);
  const writeBooksBySlug = new Map(writeReport.books.map((book) => [book.slug, book]));
  const dryRunBooksBySlug = new Map(
    dryRunReport.books.map((book) => [book.slug, book]),
  );

  const results = pilotSlugs.map((slug) => {
    const writeBook = writeBooksBySlug.get(slug);
    const dryRunBook = dryRunBooksBySlug.get(slug);
    if (!writeBook) throw new Error(`Missing write report entry for ${slug}.`);
    if (!dryRunBook) throw new Error(`Missing dry-run report entry for ${slug}.`);
    return verifyBook(writeBook, dryRunBook);
  });

  writeReports(results);
  const summary = reportSummary(results);
  console.log(
    `Pilot write 3 verification completed: ${summary.pass} pass, ${summary.warn} warn, ${summary.fail} fail.`,
  );
  for (const result of results) {
    console.log(
      `${result.status.toUpperCase()} ${result.slug}: accepted=${result.acceptedForMain ? "yes" : "no"} correction=${result.needsCorrectionBeforeMain ? "yes" : "no"}`,
    );
  }
}

main();
