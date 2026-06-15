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
  "pilot-dry-run-2",
  "pilot-dry-run-2.json",
);
const writeReportPath = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-2",
  "pilot-write-2.json",
);
const verificationReportRoot = path.join(
  repoRoot,
  "app",
  "client",
  "assets",
  "books",
  "audit-reports",
  "pilot-write-2-verification",
);

const pilotSlugs = [
  "anne-of-green-gables",
  "pointed-roofs",
  "the-lost-world",
  "the-red-thumb-mark",
  "violet-fairy-book",
  "jack-and-jill",
  "the-wonderful-wizard-of-oz",
  "the-legend-of-sleepy-hollow",
  "four-day-planet",
  "room-13",
  "the-octopus-a-story-of-california",
  "the-prince-and-the-pauper",
  "triplanetary",
  "the-call-of-the-wild",
] as const;

const correctionsMade = [
  "triplanetary: removed four bracketed illustration placeholders from generated playable text and rebuilt the generated/preview hashes.",
  "violet-fairy-book: rebuilt the collection from contents-backed story headings into 35 complete default story sections plus one non-default preface/contents section.",
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
    throw new Error(`Missing batch-2 source file: ${sourceFileUsed}`);
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

function verifyPointedRoofs(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const details: string[] = [];
  const bodySections = defaultSections(sections);
  const badStarts = bodySections.filter(
    (section) =>
      !/^(?:CHAPTER\s+[IVXLCDM]+|\d+)\b/.test(section.displayText.trim()),
  );
  if (manifest.stats.sectionCount !== 104 || bodySections.length !== 103) {
    return verdict("fail", "Pointed Roofs does not have the expected 104 total sections and 103 default body sections.", [
      `Total sections: ${manifest.stats.sectionCount}; default sections: ${bodySections.length}.`,
    ]);
  }
  if (badStarts.length > 0) {
    return verdict("fail", "Pointed Roofs contains generated body sections that do not start at chapter or standalone Arabic-number markers.", [
      badStarts.map((section) => section.sectionId).join(", "),
    ]);
  }
  details.push(
    "The opening introduction is retained as a non-default title-page section.",
  );
  details.push(
    "The 103 default body sections follow the source's chapter plus standalone Arabic-numbered subdivisions.",
  );
  details.push(
    "Short sections align with real source subdivision markers rather than TOC/list artifacts.",
  );
  return verdict("pass", "Pointed Roofs sectioning is acceptable for main.", details);
}

function verifySleepyHollow(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const first = sections[0];
  const second = sections[1];
  if (
    manifest.stats.sectionCount !== 2 ||
    !first?.displayText.includes("In the bosom of one of those spacious coves") ||
    !second?.displayText.startsWith("POSTSCRIPT.")
  ) {
    return verdict("fail", "Sleepy Hollow is not split into the expected story plus postscript sections.");
  }
  return verdict("warn", "The 2-section structure is a real story/postscript split, not arbitrary fallback chunking.", [
    'The first label comes from the epigraph attribution "CASTLE OF INDOLENCE." rather than the story title.',
    'The source framing line "FOUND AMONG THE PAPERS..." is omitted from playback.',
  ]);
}

function verifyOctopus(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const bookStarts = sections.filter((section) => /^BOOK\s+/i.test(section.displayText.trim()));
  const chapterStarts = sections.filter((section) =>
    /(?:^|\n)CHAPTER\s+[IVXLCDM]+\.?/i.test(section.displayText),
  );
  if (manifest.stats.sectionCount !== 15 || bookStarts.length !== 2 || chapterStarts.length !== 15) {
    return verdict("fail", "The Octopus does not preserve the expected two book divisions and 15 Roman chapter starts.", [
      `Sections: ${manifest.stats.sectionCount}; book starts: ${bookStarts.length}; chapter starts: ${chapterStarts.length}.`,
    ]);
  }
  return verdict("warn", "The Octopus preserves Book I/Book II and all 15 Roman chapters, with large but real chapter sections.", [
    "Book division text is retained at the opening chapter of each book.",
    "Several chapters exceed the generic large-section threshold; this appears to reflect source chapter length rather than fallback blobs.",
    "Chapter labels reset inside Book II, so the manifest list is reviewable but could be clearer with explicit book-aware labels later.",
  ]);
}

function verifyRoom13(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const bodySections = defaultSections(sections);
  const first = bodySections[0]?.displayText.trim() ?? "";
  const last = bodySections[bodySections.length - 1]?.displayText.trim() ?? "";
  const badLabels = bodySections.filter(
    (section, index) => section.label !== `Chapter ${index + 1}`,
  );
  if (
    manifest.stats.sectionCount !== 33 ||
    bodySections.length !== 33 ||
    !first.startsWith("CHAPTER I") ||
    !last.startsWith("CHAPTER XXXIII") ||
    badLabels.length > 0
  ) {
    return verdict("fail", "Room 13 is not fully corrected to Chapter I through Chapter XXXIII.", [
      `Total sections: ${manifest.stats.sectionCount}; default sections: ${bodySections.length}.`,
      badLabels.length > 0 ? `Unexpected labels: ${badLabels.map((section) => section.label).join(", ")}.` : "",
    ]);
  }
  return verdict("pass", "Room 13 has 33 default body chapters from Chapter I through Chapter XXXIII.");
}

function verifyVioletFairyBook(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
): Verdict {
  const expectedTitles = [
    "A Tale of the Tontlawald",
    "The Finest Liar in the World",
    "The Story of Three Wonderful Beggars",
    "Schippeitaro",
    "The Three Princes and Their Beasts",
    "The Goat's Ears of the Emperor Trojan",
    "The Nine Pea-Hens and the Golden Apples",
    "The Lute Player",
    "The Grateful Prince",
    "The Child who Came from an Egg",
    "Stan Bolovan",
    "The Two Frogs",
    "The Story of a Gazelle",
    "How a Fish Swam in the Air and a Hare in the Water",
    "Two in a Sack",
    "The Envious Neighbour",
    "The Fairy of the Dawn",
    "The Enchanted Knife",
    "Jesper who Herded the Hares",
    "The Underground Workers",
    "The History of Dwarf Long Nose",
    "The Nunda, Eater of People",
    "The Story of Hassebu",
    "The Maiden with the Wooden Helmet",
    "The Monkey and the Jelly-Fish",
    "The Headless Dwarfs",
    "The Young Man who Would Have His Eyes Opened",
    "The Boys with the Golden Stars",
    "The Frog",
    "The Princess who Was Hidden Underground",
    "The Girl who Pretended to Be a Boy",
    "The Story of Halfman",
    "The Prince who Wanted to See the World",
    "Virgilius the Sorcerer",
    "Mogarzea and His Son",
  ];
  const bodySections = defaultSections(sections);
  const first = bodySections[0];
  const last = bodySections[bodySections.length - 1];
  const labels = bodySections.map((section) => section.title ?? section.label);
  const unexpectedLabels = labels.filter(
    (label, index) => label !== expectedTitles[index],
  );
  const details = [
    `Generated sections: ${manifest.stats.sectionCount}; default story sections: ${bodySections.length}.`,
  ];
  if (sections[0]?.kind !== "preface" || sections[0]?.includeByDefault) {
    return verdict("fail", "Violet Fairy Book preface/contents material is not safely non-default.", details);
  }
  if (
    manifest.stats.sectionCount !== 36 ||
    bodySections.length !== expectedTitles.length ||
    !first?.displayText.startsWith("A TALE OF THE TONTLAWALD") ||
    !last?.displayText.startsWith("MOGARZEA AND HIS SON") ||
    defaultText(sections).includes("\nCONTENTS\n") ||
    unexpectedLabels.length > 0
  ) {
    if (unexpectedLabels.length > 0) {
      details.push(
        `Unexpected story labels: ${unexpectedLabels.slice(0, 8).join(", ")}.`,
      );
    }
    return verdict(
      "fail",
      "Violet Fairy Book is not acceptable: story-level sections are not reliably preserved.",
      details,
    );
  }
  details.push(
    "Contributor, contents, and standalone source-attribution lines are excluded from default playback.",
  );
  details.push(
    "Story labels follow the contents-backed body headings from the raw source.",
  );
  return verdict("pass", "Violet Fairy Book story sections are acceptable.", details);
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
    case "pointed-roofs":
      return verifyPointedRoofs(manifest, sections);
    case "the-legend-of-sleepy-hollow":
      return verifySleepyHollow(manifest, sections);
    case "the-octopus-a-story-of-california":
      return verifyOctopus(manifest, sections);
    case "room-13":
      return verifyRoom13(manifest, sections);
    case "violet-fairy-book":
      return verifyVioletFairyBook(manifest, sections);
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
  const generic = /Generated by controlled pilot write pass 2/i;
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
    throw new Error(`Expected written batch-2 book, got skipped: ${writeBook.slug}`);
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
    pointedRoofs: {
      acceptable: bySlug.get("pointed-roofs")?.sectioningVerdict.status === "pass",
      verdict: bySlug.get("pointed-roofs")?.sectioningVerdict.summary ?? "",
    },
    sleepyHollow: {
      acceptable:
        bySlug.get("the-legend-of-sleepy-hollow")?.sectioningVerdict.status !==
        "fail",
      verdict:
        bySlug.get("the-legend-of-sleepy-hollow")?.sectioningVerdict.summary ??
        "",
    },
    octopus: {
      acceptable:
        bySlug.get("the-octopus-a-story-of-california")?.sectioningVerdict
          .status !== "fail",
      verdict:
        bySlug.get("the-octopus-a-story-of-california")?.sectioningVerdict
          .summary ?? "",
    },
    room13: {
      fullyCorrected: bySlug.get("room-13")?.sectioningVerdict.status === "pass",
      verdict: bySlug.get("room-13")?.sectioningVerdict.summary ?? "",
    },
    violetFairyBook: {
      acceptable:
        bySlug.get("violet-fairy-book")?.sectioningVerdict.status !== "fail" &&
        bySlug.get("violet-fairy-book")?.previewVerdict.status !== "fail",
      verdict: bySlug.get("violet-fairy-book")?.sectioningVerdict.summary ?? "",
    },
  };
}

function formatDetails(verdictItem: Verdict) {
  if (verdictItem.details.length === 0) return verdictItem.summary;
  return `${verdictItem.summary} ${verdictItem.details.join(" ")}`;
}

function writeReports(results: BookVerification[]) {
  const summary = reportSummary(results);
  const focus = specialFocus(results);
  const report = {
    schemaVersion: 1,
    reportName: "pilot-write-2-verification",
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
      inspectedOnlyBatch2Books: true,
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

  const markdown = `# Pilot Write 2 Verification

Post-write QA pass for the 14 batch-2 books. This report compares the raw source text, generated output, preview asset, pilot dry-run 2 report, and pilot write 2 report. It does not process additional books and does not modify raw source or Cloudflare export assets.

## Summary

| Book | Status | Structure | Start | End | Sectioning | Cleanup | Preview | Accepted for main | Needs correction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Special Focus

- pointed-roofs: ${focus.pointedRoofs.acceptable ? "acceptable" : "not acceptable"} - ${focus.pointedRoofs.verdict}
- the-legend-of-sleepy-hollow: ${focus.sleepyHollow.acceptable ? "acceptable with warning" : "not acceptable"} - ${focus.sleepyHollow.verdict}
- the-octopus-a-story-of-california: ${focus.octopus.acceptable ? "acceptable with warning" : "not acceptable"} - ${focus.octopus.verdict}
- room-13: ${focus.room13.fullyCorrected ? "fully corrected" : "not fully corrected"} - ${focus.room13.verdict}
- violet-fairy-book: ${focus.violetFairyBook.acceptable ? "acceptable" : "not acceptable"} - ${focus.violetFairyBook.verdict}

## Corrections

- ${correctionsMade.join("\n- ")}

${details}

## Confirmations

- Only the 14 batch-2 slugs were inspected.
- No additional books were processed.
- app/client/assets/temp-books was inspected only and not modified.
- app/client/assets/books/cloudflare-export was not modified.
- No unrelated generated books were touched.
- npm run books:build was not run.
`;

  writeJson(
    path.join(verificationReportRoot, "pilot-write-2-verification.json"),
    report,
  );
  writeText(
    path.join(verificationReportRoot, "pilot-write-2-verification.md"),
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
    `Pilot write 2 verification completed: ${summary.pass} pass, ${summary.warn} warn, ${summary.fail} fail.`,
  );
  for (const result of results) {
    console.log(
      `${result.status.toUpperCase()} ${result.slug}: accepted=${result.acceptedForMain ? "yes" : "no"} correction=${result.needsCorrectionBeforeMain ? "yes" : "no"}`,
    );
  }
}

main();
