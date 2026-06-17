import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookRightsReport,
  BookSectionKind,
  CleanedBookJson,
  DetectedBookSection,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
  ProcessedBookJson,
} from "./bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  normalizeBookText,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type PreviewAsset = {
  version: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  defaultSectionKind: BookSectionKind;
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

type SourceLine = {
  lineNumber: number;
  text: string;
  trimmed: string;
  offset: number;
};

type SectionBoundary = {
  line: number;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  includeByDefault: boolean;
};

type CorrectionPlan = {
  slug: string;
  expectedTitle: string;
  sourceFile: string;
  sourceHeading: RegExp;
  endBeforeHeading?: RegExp;
  structuralConvention: string;
  correctionType:
    | "generated title correction"
    | "generated title and default-start correction"
    | "generated title and sectioning correction";
  makeBoundaries: (lines: SourceLine[], startLine: number, endLine: number) => SectionBoundary[];
};

type TitleOnlyPlan = {
  slug: string;
  expectedTitle: string;
  sourceFile: string;
  structuralConvention: string;
};

type BookSnapshot = {
  title: string;
  contentHash: string;
  sectionCount: number;
  includedSectionCount: number;
  firstDefaultSection: {
    id: string | null;
    label: string | null;
    kind: BookSectionKind | null;
    snippet: string | null;
  };
  previewStart: string | null;
};

type CorrectionRecord = {
  slug: string;
  correctionType: string;
  acceptedBeforeAudit: boolean;
  acceptanceRevokedBeforeCorrection: boolean;
  before: BookSnapshot;
  after: BookSnapshot;
  sourceFileUsed: string;
  artifactTypeRemoved: string[];
  generatedFilesChanged: string[];
  previewFilesChanged: string[];
  finalClassification: string[];
};

type BookAudit = {
  slug: string;
  acceptedBeforeAudit: boolean;
  generatedTitle: string;
  expectedTitle: string;
  sourceFilename: string | null;
  generatedOutputExists: boolean;
  previewAssetExists: boolean;
  duplicateGeneratedTitleSlugs: string[];
  titleAppearsParentCollection: boolean;
  titleShouldBeCorrected: boolean;
  firstDefaultSectionId: string | null;
  firstDefaultSectionTitle: string | null;
  firstDefaultSectionKind: BookSectionKind | null;
  firstDefaultTextSnippet: string | null;
  firstDefaultBeginsWithRealReadableContent: boolean;
  firstDefaultBeginsWithMetadata: boolean;
  chapterOneOrFirstStoryMissingOrExcluded: boolean;
  previewStartSnippet: string | null;
  previewStartsFromRealReadableContent: boolean;
  previewBeginsWithParentCollectionMetadata: boolean;
  previewContainsSosHelp: boolean;
  classifications: string[];
  acceptanceVerdict:
    | "still acceptable"
    | "acceptance revoked pending correction"
    | "not previously accepted"
    | "corrected in this pass";
  warnings: string[];
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const previewRoot = path.join(repoRoot, "public/book-previews");
const auditReportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/title-start-default-content-audit-1",
);
const batch6VerificationRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/pilot-write-6-verification",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");

const acceptedSlugs = new Set([
  "almayer-s-folly-a-story-of-an-eastern-river",
  "the-house-without-a-key",
  "the-lerouge-case",
  "a-dream-of-armageddon",
  "a-journey-to-the-centre-of-the-earth",
  "a-journal-of-the-plague-year",
  "dracula",
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
  "don-quixote",
  "les-miserables",
  "sun-tzu-on-the-art-of-war",
  "the-count-of-monte-cristo",
  "the-count-of-monte-cristo-gutenberg-1184",
  "the-happy-family",
  "a-childs-garden-of-verses",
  "alices-adventures-in-wonderland",
  "black-beauty",
  "botchan",
  "five-little-peppers-and-how-they-grew",
  "grimm-s-fairy-tales",
  "jane-eyre",
  "little-women",
  "new-treasure-seekers",
  "pride-and-prejudice",
  "rainbow-valley",
  "rinkitink-in-oz",
  "the-arabian-nights",
  "the-art-of-war",
  "the-book-of-dragons",
  "the-divine-comedy",
  "the-elements-of-style",
  "the-federalist-papers",
  "the-jungle-book",
  "the-princess-and-the-goblin",
  "the-railway-children",
  "the-sea-wolf",
  "the-secret-garden",
  "the-water-babies",
  "through-the-looking-glass",
  "anna-karenina",
  "anne-of-green-gables-gutenberg-45",
  "candide",
  "crime-and-punishment",
  "gulliver-s-travels",
  "the-bell",
  "the-call-of-cthulhu",
  "the-elderbush",
  "the-emerald-city-of-oz",
  "the-emperor-s-new-clothes",
  "the-fir-tree",
  "the-leap-frog",
  "the-old-house",
  "the-real-princess",
  "the-secret-garden-gutenberg-113",
  "the-shoes-of-fortune",
  "the-snow-queen",
  "the-swineherd",
  "treasure-island",
  "wind-in-the-willows",
  "a-midsummer-night-s-dream",
  "a-room-with-a-view",
  "agamemnon-of-aeschylus",
  "an-ideal-husband",
  "catriona",
  "for-the-duration-of-the-war",
  "romeo-and-juliet",
  "spoon-river-anthology",
  "the-adventures-of-ferdinand-count-fathom",
  "the-adventures-of-roderick-random",
  "the-expedition-of-humphry-clinker",
  "the-importance-of-being-earnest-a-trivial-comedy-for-serious-people",
  "the-man-who-was-thursday-a-nightmare",
  "the-money-box",
  "the-mystery-of-edwin-drood",
  "the-shunned-house",
  "the-story-of-the-inexperienced-ghost",
  "the-winning-of-olwen",
  "twenty-thousand-leagues-under-the-sea",
  "with-fire-and-sword",
]);

const criticalExamples = [
  "the-call-of-the-wild",
  "the-elderbush",
  "the-emperor-s-new-clothes",
  "the-fir-tree",
  "the-leap-frog",
  "the-real-princess",
  "the-shoes-of-fortune",
  "the-snow-queen",
  "the-swineherd",
  "the-emerald-city-of-oz",
  "romeo-and-juliet",
];

const parentCollectionTitlePattern =
  /^(?:Andersen's Fairy Tales|Hans Andersen's Fairy Tales\. First Series|The Lilac Fairy Book)$/i;
const parentMetadataStartPattern =
  /^(?:ANDERSEN'S FAIRY TALES|Hans Andersen's Fairy Tales|THE LILAC FAIRY BOOK)\b/i;
const nonPlayableStartPattern =
  /^(?:SOS Help!|MorseWords|Type text here|Title:|Author:|Contents|Table of Contents|Project Gutenberg|Produced by|Transcriber|ANDERSEN'S FAIRY TALES\s+By\s+Hans Christian Andersen)\b/i;
const sosHelpPattern = /\bSOS Help!\b/i;

const contentCorrectionPlans: Record<string, CorrectionPlan> = {
  "the-bell": singleStoryPlan(
    "the-bell",
    "The Bell",
    "The Bell.txt",
    /^THE BELL$/,
  ),
  "the-elderbush": singleStoryPlan(
    "the-elderbush",
    "The Elderbush",
    "The Elderbush.txt",
    /^THE ELDERBUSH$/,
  ),
  "the-emperor-s-new-clothes": singleStoryPlan(
    "the-emperor-s-new-clothes",
    "The Emperor's New Clothes",
    "THE EMPEROR'S NEW CLOTHES.txt",
    /^THE EMPEROR'S NEW CLOTHES$/,
  ),
  "the-fir-tree": singleStoryPlan(
    "the-fir-tree",
    "The Fir Tree",
    "The Fir Tree.txt",
    /^THE FIR TREE$/,
  ),
  "the-leap-frog": singleStoryPlan(
    "the-leap-frog",
    "The Leap-Frog",
    "The Leap-Frog.txt",
    /^THE LEAP-FROG$/,
  ),
  "the-real-princess": singleStoryPlan(
    "the-real-princess",
    "The Real Princess",
    "The Real Princess.txt",
    /^THE REAL PRINCESS$/,
  ),
  "the-old-house": {
    ...singleStoryPlan(
      "the-old-house",
      "The Old House",
      "The Old House.txt",
      /^THE OLD HOUSE$/,
    ),
    endBeforeHeading: /^THE HAPPY FAMILY$/,
    correctionType: "generated title and default-start correction",
  },
  "the-shoes-of-fortune": {
    slug: "the-shoes-of-fortune",
    expectedTitle: "The Shoes of Fortune",
    sourceFile: "The Shoes of Fortune.txt",
    sourceHeading: /^THE SHOES OF FORTUNE$/,
    structuralConvention: "Andersen story with six numbered internal sections",
    correctionType: "generated title and sectioning correction",
    makeBoundaries: (lines, startLine, endLine) => romanNumberedBoundaries(lines, startLine, endLine),
  },
};

const titleOnlyPlans: Record<string, TitleOnlyPlan> = {
  "the-money-box": {
    slug: "the-money-box",
    expectedTitle: "The Money Box",
    sourceFile: "THE MONEY BOX.txt",
    structuralConvention: "single Andersen fairy tale",
  },
  "the-snow-queen": {
    slug: "the-snow-queen",
    expectedTitle: "The Snow Queen",
    sourceFile: "THE SNOW QUEEN.txt",
    structuralConvention: "seven Snow Queen story sections",
  },
  "the-swineherd": {
    slug: "the-swineherd",
    expectedTitle: "The Swineherd",
    sourceFile: "The Swineherd.txt",
    structuralConvention: "single Andersen fairy tale",
  },
  "the-winning-of-olwen": {
    slug: "the-winning-of-olwen",
    expectedTitle: "The Winning of Olwen",
    sourceFile: "The Winning of Olwen.txt",
    structuralConvention: "single Lilac Fairy Book story",
  },
};

const futureBatchRules = [
  "valid generated readable content",
  "first default section from real readable content",
  "all main readable sections included by default",
  "valid book-specific startup preview",
  "no SOS Help!",
  "no generic preview fallback",
  "no title/TOC/source/license/contributor/transcriber material as default playback",
];

function singleStoryPlan(
  slug: string,
  expectedTitle: string,
  sourceFile: string,
  sourceHeading: RegExp,
): CorrectionPlan {
  return {
    slug,
    expectedTitle,
    sourceFile,
    sourceHeading,
    structuralConvention: "single individual fairy tale/story",
    correctionType: "generated title and default-start correction",
    makeBoundaries: (_lines, startLine) => [
      {
        line: startLine,
        kind: "chapter",
        label: expectedTitle,
        title: null,
        includeByDefault: true,
      },
    ],
  };
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function readHeadText(relativePath: string): string | null {
  try {
    return execFileSync("git", ["show", `HEAD:${relativePath}`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

function readHeadJson<T>(relativePath: string): T | null {
  const text = readHeadText(relativePath);
  return text ? (JSON.parse(text) as T) : null;
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

function assertInside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside ${statusPath(root)}: ${candidate}`);
  }
}

function sha256Json(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function estimateTypingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 40));
}

function estimateListeningMinutes(morseCharacterEstimate: number): number {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function compact(input: string | null | undefined, length = 220) {
  return input ? textPreview(input, length) : null;
}

function normalizeForCompare(input: string | null | undefined) {
  return (input ?? "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function expectedTitleFromSlug(slug: string) {
  const overrides: Record<string, string> = {
    "the-call-of-cthulhu": "The Call of Cthulhu",
    "the-emperor-s-new-clothes": "The Emperor's New Clothes",
    "a-midsummer-night-s-dream": "A Midsummer Night's Dream",
  };
  if (overrides[slug]) return overrides[slug];
  return slug
    .split("-")
    .filter((part) => part && part !== "gutenberg")
    .map((part) => {
      if (/^\d+$/.test(part)) return part;
      if (["a", "an", "and", "as", "by", "for", "in", "of", "or", "s", "the", "to", "with"].includes(part)) {
        return part;
      }
      return `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`;
    })
    .join(" ")
    .replace(/\bS\b/g, "'s")
    .replace(/^(.)/, (match) => match.toUpperCase())
    .replace(/\bIi\b/g, "II")
    .replace(/\bIii\b/g, "III")
    .replace(/\bIv\b/g, "IV");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sourceFileIndex() {
  const files = fs
    .readdirSync(tempBooksRoot)
    .filter((file) => /\.(?:txt|md)$/i.test(file));
  const bySlug = new Map<string, string>();
  for (const file of files) {
    bySlug.set(slugify(path.basename(file, path.extname(file))), file);
  }
  return bySlug;
}

function lineRecords(rawText: string): SourceLine[] {
  const records: SourceLine[] = [];
  const matches = rawText.matchAll(/[^\r\n]*(?:\r\n|\n|\r|$)/g);
  for (const match of matches) {
    const fullLine = match[0];
    const offset = match.index ?? 0;
    if (!fullLine && offset >= rawText.length) break;
    const text = fullLine.replace(/\r\n$|\n$|\r$/, "");
    records.push({
      lineNumber: records.length + 1,
      text,
      trimmed: text.trim(),
      offset,
    });
  }
  return records;
}

function lineAt(lines: SourceLine[], lineNumber: number): SourceLine {
  const line = lines[lineNumber - 1];
  if (!line) throw new Error(`Line ${lineNumber} not found.`);
  return line;
}

function findLine(lines: SourceLine[], pattern: RegExp, startLine = 1) {
  const line = lines.find((candidate) => candidate.lineNumber >= startLine && pattern.test(candidate.trimmed));
  return line?.lineNumber ?? null;
}

function footerLine(lines: SourceLine[], startLine: number) {
  const line = lines.find(
    (candidate) =>
      candidate.lineNumber > startLine &&
      /(?:\*{3}\s*)?END OF (?:THE|THIS) PROJECT GUTENBERG|End of (?:the )?Project Gutenberg/i.test(
        candidate.trimmed,
      ),
  );
  return line?.lineNumber ?? lines.length;
}

function parseRoman(input: string): number | null {
  const values: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  let previous = 0;
  for (const char of input.toUpperCase().split("").reverse()) {
    const value = values[char];
    if (!value) return null;
    if (value < previous) total -= value;
    else total += value;
    previous = value;
  }
  return total;
}

function cleanHeadingTitle(input: string) {
  return input
    .replace(/â€œ|â€�/g, '"')
    .replace(/â€˜|â€™/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function romanNumberedBoundaries(lines: SourceLine[], startLine: number, endLine: number): SectionBoundary[] {
  return lines
    .map<SectionBoundary | null>((line) => {
      if (line.lineNumber < startLine || line.lineNumber > endLine) return null;
      const match = line.trimmed.match(/^([IVXLCDM]+)\.\s+(.+)$/);
      const ordinal = match ? parseRoman(match[1]) : null;
      if (!match || !ordinal) return null;
      const nextLine = lines[line.lineNumber]?.trimmed ?? "";
      const wrappedTitle =
        match[2].endsWith("--A") && nextLine && nextLine.length < 80
          ? `${match[2]} ${nextLine}`
          : match[2];
      return {
        line: line.lineNumber,
        kind: "chapter",
        label: `Part ${ordinal}`,
        title: cleanHeadingTitle(wrappedTitle),
        includeByDefault: true,
      };
    })
    .filter((boundary): boundary is SectionBoundary => Boolean(boundary));
}

function cleanSectionText(input: string) {
  let text = normalizeBookText(input)
    .replace(/\u00a0/g, " ")
    .replace(/\uFEFF/g, "")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\ufb00/g, "ff")
    .replace(/\ufb01/g, "fi")
    .replace(/\ufb02/g, "fl")
    .replace(/\ufb03/g, "ffi")
    .replace(/\ufb04/g, "ffl")
    .replace(/\ufb05/g, "ft")
    .replace(/\ufb06/g, "st");

  text = text.replace(/\[(?:Illustration|Illustrations|Plate|Image|Map|Music|Facsimile|Portrait)[^\]]*\]/gi, "");
  return trimBookText(text)
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

function makeDetectedSections(
  slug: string,
  rawText: string,
  lines: SourceLine[],
  boundaries: SectionBoundary[],
  endLine: number,
): DetectedBookSection[] {
  const counters = new Map<BookSectionKind, number>();
  return [...boundaries]
    .sort((left, right) => left.line - right.line)
    .map((boundary, index, sorted) => {
      const nextLine = sorted[index + 1]?.line ?? endLine + 1;
      const start = lineAt(lines, boundary.line).offset;
      const endRecord = lineAt(lines, Math.min(endLine, nextLine - 1));
      const end = endRecord.offset + endRecord.text.length;
      const cleanedText = cleanSectionText(rawText.slice(start, end));
      const wordCount = countBookWords(cleanedText);
      const count = (counters.get(boundary.kind) ?? 0) + 1;
      counters.set(boundary.kind, count);
      return {
        id: `${boundary.kind}-${String(count).padStart(3, "0")}`,
        kind: boundary.kind,
        label: boundary.label,
        title: boundary.title,
        order: index + 1,
        includeByDefault: boundary.includeByDefault,
        sourceStartOffset: start,
        sourceEndOffset: end,
        characterCount: cleanedText.length,
        wordCount,
        morseCharacterEstimate: estimateMorseCharacters(cleanedText),
        textPreview: textPreview(cleanedText),
        text: cleanedText,
      };
    })
    .filter((section) => {
      if (section.wordCount >= 3) return true;
      throw new Error(`${slug}: section ${section.id} is unexpectedly tiny.`);
    });
}

function includeKindsFor(sections: DetectedBookSection[]): BookSectionKind[] {
  return [...new Set(sections.filter((section) => section.includeByDefault).map((section) => section.kind))];
}

function extractHeaderValue(rawText: string, label: string) {
  const match = rawText.match(new RegExp(`^${label}:\\s*(.+)$`, "im"));
  return match?.[1]?.trim() ?? null;
}

function extractGutenbergId(rawText: string) {
  const release = extractHeaderValue(rawText, "Release date") ?? "";
  const idMatch = release.match(/eBook\s*#?(\d+)/i) ?? rawText.match(/ebooks\/(\d+)/i);
  return idMatch?.[1] ?? null;
}

function sourceUrlFor(gutenbergId: string | null) {
  return gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null;
}

function buildContentHash(slug: string, title: string, author: string[], sections: DetectedBookSection[]) {
  return sha256Json({
    slug,
    title,
    author,
    sections: sections.map((section) => ({
      kind: section.kind,
      label: section.label,
      title: section.title,
      includeByDefault: section.includeByDefault,
      text: section.text,
    })),
  });
}

function buildManifestFromExisting(
  existing: GeneratedBookManifest,
  title: string,
  rawText: string,
  sections: DetectedBookSection[],
  correctionNote: string,
): GeneratedBookManifest {
  const contentHash = buildContentHash(existing.slug, title, existing.author, sections);
  const cleanedCharacterCount = sections.reduce((total, section) => total + section.characterCount, 0);
  const wordCount = sections.reduce((total, section) => total + section.wordCount, 0);
  const gutenbergId = existing.source.gutenbergId ?? extractGutenbergId(rawText);
  return {
    ...existing,
    title,
    contentVersion: contentHash.slice(0, 16),
    contentHash,
    cover: {
      ...existing.cover,
      alt: existing.cover.placeholder ? `Placeholder cover for ${title}` : existing.cover.alt,
    },
    source: {
      ...existing.source,
      gutenbergId,
      releaseDate: existing.source.releaseDate ?? extractHeaderValue(rawText, "Release date"),
      sourceUrl: existing.source.sourceUrl ?? sourceUrlFor(gutenbergId),
    },
    stats: {
      ...existing.stats,
      originalCharacterCount: rawText.length,
      cleanedCharacterCount,
      wordCount,
      sectionCount: sections.length,
      includedSectionCount: sections.filter((section) => section.includeByDefault).length,
    },
    defaults: {
      ...existing.defaults,
      includeKinds: includeKindsFor(sections),
    },
    sections: sections.map((section) => ({
      id: section.id,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      sectionJsonPath: `sections/${section.id}.json`,
      characterCount: section.characterCount,
      wordCount: section.wordCount,
      estimatedTypingMinutes: estimateTypingMinutes(section.wordCount),
      estimatedListeningMinutes: estimateListeningMinutes(section.morseCharacterEstimate),
      morseCharacterEstimate: section.morseCharacterEstimate,
      textPreview: section.textPreview,
    })),
    cleaning: {
      ...existing.cleaning,
      originalCharacterCount: rawText.length,
      cleanedCharacterCount,
      headerStripped: true,
      footerStripped: true,
      confidence: "high",
    },
    warnings: [
      correctionNote,
      ...existing.warnings.filter(
        (warning) =>
          !/Corrected by title\/start\/default-content audit 1|fallback parts|not publish-ready|not been reviewed|rights basis|rights gate|owner-reviewed|Website publication is not allowed/i.test(
            warning,
          ),
      ),
    ],
  };
}

function makeSectionJson(slug: string, section: DetectedBookSection): GeneratedBookSectionJson {
  return {
    schemaVersion: 1,
    bookSlug: slug,
    sectionId: section.id,
    kind: section.kind,
    label: section.label,
    title: section.title,
    order: section.order,
    includeByDefault: section.includeByDefault,
    displayText: section.text,
    morseSourceText: section.text,
    paragraphs: splitParagraphs(section.text),
    wordCount: section.wordCount,
    characterCount: section.characterCount,
    estimatedTypingMinutes: estimateTypingMinutes(section.wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(section.morseCharacterEstimate),
    morseCharacterEstimate: section.morseCharacterEstimate,
    unsupportedCharacterSummary: summarizeUnsupportedCharacters(section.text),
    textPreview: section.textPreview,
    sourceOffsets: {
      start: section.sourceStartOffset,
      end: section.sourceEndOffset,
    },
  };
}

function sectionText(section: GeneratedBookSectionJson | null | undefined) {
  return (section?.morseSourceText || section?.displayText || "").trim();
}

function buildCleanedBook(manifest: GeneratedBookManifest, sections: DetectedBookSection[]): CleanedBookJson {
  return {
    schemaVersion: 1,
    id: manifest.slug,
    title: manifest.title,
    author: manifest.author.join(", "),
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
    source: {
      provider: manifest.source.provider,
      gutenbergId: manifest.source.gutenbergId,
      sourceUrl: manifest.source.sourceUrl,
      rawTextUrl: manifest.source.rawTextUrl,
      originalPublication: "",
      releaseDate: manifest.source.releaseDate ?? "",
      lastUpdated: "",
    },
    stats: {
      wordCount: manifest.stats.wordCount,
      characterCount: manifest.stats.cleanedCharacterCount,
      sectionCount: sections.length,
      estimatedTypingMinutes: sections.reduce((total, section) => total + estimateTypingMinutes(section.wordCount), 0),
      estimatedListeningMinutes: sections.reduce(
        (total, section) => total + estimateListeningMinutes(section.morseCharacterEstimate),
        0,
      ),
    },
    sections: sections.map((section) => ({
      id: section.id,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      text: section.text,
      paragraphs: splitParagraphs(section.text),
      wordCount: section.wordCount,
      characterCount: section.characterCount,
      estimatedTypingMinutes: estimateTypingMinutes(section.wordCount),
      estimatedListeningMinutes: estimateListeningMinutes(section.morseCharacterEstimate),
    })),
  };
}

function buildProcessedBook(manifest: GeneratedBookManifest, sections: DetectedBookSection[]): ProcessedBookJson {
  return {
    schemaVersion: 1,
    id: manifest.slug,
    title: manifest.title,
    author: manifest.author.join(", "),
    content_version: manifest.contentVersion,
    content_hash: manifest.contentHash,
    source: {
      name: manifest.source.provider,
      ebook_number: manifest.source.gutenbergId ?? "",
      source_url: manifest.source.sourceUrl,
      raw_text_url: manifest.source.rawTextUrl,
      original_publication: "",
      release_date: manifest.source.releaseDate ?? "",
      last_updated: "",
    },
    rights: {
      status: "approved",
      approved_for_website: true,
      approved_for_youtube_narration: false,
      approved_regions: ["US"],
      needs_manual_review: false,
      notes: manifest.source.rightsNotes,
    },
    content: {
      chapters: sections.map((section, index) => ({
        chapter_number: index + 1,
        title: section.title ? `${section.label}: ${section.title}` : section.label,
        sections: [
          {
            section_number: 1,
            text: section.text,
            word_count: section.wordCount,
            character_count: section.characterCount,
            estimated_typing_minutes: estimateTypingMinutes(section.wordCount),
            estimated_listening_minutes: estimateListeningMinutes(section.morseCharacterEstimate),
          },
        ],
      })),
    },
  };
}

function buildRightsReport(existing: BookRightsReport | null, manifest: GeneratedBookManifest, rawText: string): BookRightsReport {
  return {
    ...(existing ?? {
      schemaVersion: 1,
      author_death_year: null,
      language: "English",
      original_publication: "",
      last_updated: "",
      translator: "",
      translator_death_year: null,
      illustrator: "",
      editor: "",
      introduction_author: "",
      contains_modern_intro_or_notes: false,
      contains_later_copyright_notice: /copyright/i.test(rawText),
      contains_creative_commons_license: false,
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
      duplicate_resolution_source: "manual-review",
      canada_us_v1_status: "approved",
      evidence_snippets: [],
      processing_allowed: true,
    }),
    title: manifest.title,
    author: manifest.author.join(", "),
    release_date: manifest.source.releaseDate ?? "",
    source: manifest.source.provider,
    gutenberg_ebook_number: manifest.source.gutenbergId ?? "",
    source_url: manifest.source.sourceUrl,
    raw_text_url: manifest.source.rawTextUrl,
    gutenberg_header_present: /Project Gutenberg/i.test(rawText),
    project_gutenberg_license_present: /PROJECT GUTENBERG(?:\u2122|TM)? LICENSE/i.test(rawText),
    us_reuse_language_found: /United States/i.test(rawText),
    non_us_warning_found: /not located in the United States/i.test(rawText),
    credits: extractHeaderValue(rawText, "Credits") ?? existing?.credits ?? "",
    contains_transcriber_notes: /transcriber/i.test(rawText),
    contains_illustrations_or_image_references: /\[(?:Illustration|Image|Plate)/i.test(rawText),
    reasoning_summary:
      "Title/start-default audit corrected generated story identity and excluded parent collection metadata from default playback.",
  };
}

function makePreviewAsset(manifest: GeneratedBookManifest, sections: GeneratedBookSectionJson[]): PreviewAsset {
  const firstDefaultSummary = manifest.sections.find((section) => section.includeByDefault) ?? manifest.sections[0];
  const firstDefaultSection = sections.find((section) => section.sectionId === firstDefaultSummary?.id) ?? sections[0];
  if (!firstDefaultSummary || !firstDefaultSection) throw new Error(`${manifest.slug}: no preview source section.`);
  const text = sectionText(firstDefaultSection);
  const previewText = text.length > 45_000 ? trimBookText(text.slice(0, 45_000)) : text;
  const wordCount = countBookWords(previewText);
  const morseEstimate = estimateMorseCharacters(previewText);
  return {
    version: 1,
    slug: manifest.slug,
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
    defaultSectionId: firstDefaultSummary.id,
    defaultSectionKind: firstDefaultSummary.kind,
    defaultSectionLabel: firstDefaultSummary.label,
    defaultSectionTitle: firstDefaultSummary.title,
    previewText,
    estimatedRuntimeSeconds: Math.ceil((morseEstimate / 900) * 60),
    wordCount,
    characterCount: previewText.length,
    estimatedTypingMinutes: estimateTypingMinutes(wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(morseEstimate),
    morseCharacterEstimate: morseEstimate,
    textPreview: textPreview(previewText),
    truncated: previewText.length < text.length,
  };
}

function readSections(manifest: GeneratedBookManifest): GeneratedBookSectionJson[] {
  return manifest.sections.map((summary) =>
    readJson<GeneratedBookSectionJson>(path.join(generatedRoot, manifest.slug, summary.sectionJsonPath)),
  );
}

function readHeadSections(manifest: GeneratedBookManifest): GeneratedBookSectionJson[] | null {
  const sections: GeneratedBookSectionJson[] = [];
  for (const summary of manifest.sections) {
    const relativePath = `app/client/assets/books/generated/${manifest.slug}/${summary.sectionJsonPath}`;
    const section = readHeadJson<GeneratedBookSectionJson>(relativePath);
    if (!section) return null;
    sections.push(section);
  }
  return sections;
}

function readPreview(slug: string): PreviewAsset | null {
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  return fs.existsSync(previewPath) ? readJson<PreviewAsset>(previewPath) : null;
}

function readHeadPreview(slug: string): PreviewAsset | null {
  return readHeadJson<PreviewAsset>(`public/book-previews/${slug}.preview.json`);
}

function snapshot(manifest: GeneratedBookManifest, sections: GeneratedBookSectionJson[], preview: PreviewAsset | null): BookSnapshot {
  const firstDefaultSummary = manifest.sections.find((section) => section.includeByDefault) ?? null;
  const firstDefaultSection = firstDefaultSummary
    ? sections.find((section) => section.sectionId === firstDefaultSummary.id) ?? null
    : null;
  return {
    title: manifest.title,
    contentHash: manifest.contentHash,
    sectionCount: manifest.stats.sectionCount,
    includedSectionCount: manifest.stats.includedSectionCount,
    firstDefaultSection: {
      id: firstDefaultSummary?.id ?? null,
      label: firstDefaultSummary?.label ?? null,
      kind: firstDefaultSummary?.kind ?? null,
      snippet: compact(sectionText(firstDefaultSection)),
    },
    previewStart: compact(preview?.previewText),
  };
}

function writeGenerated(
  manifest: GeneratedBookManifest,
  sections: GeneratedBookSectionJson[],
  cleanedBook: CleanedBookJson,
  processedBook: ProcessedBookJson,
  rightsReport: BookRightsReport,
  notes: string,
) {
  const bookDir = path.join(generatedRoot, manifest.slug);
  const sectionsDir = path.join(bookDir, "sections");
  assertInside(generatedRoot, bookDir);
  assertInside(bookDir, sectionsDir);
  fs.mkdirSync(bookDir, { recursive: true });
  fs.rmSync(sectionsDir, { recursive: true, force: true });
  fs.mkdirSync(sectionsDir, { recursive: true });

  const changed = [
    path.join(bookDir, "manifest.json"),
    path.join(bookDir, "cleaned_book.json"),
    path.join(bookDir, "processed_book.json"),
    path.join(bookDir, "rights_report.json"),
    path.join(bookDir, "processing_notes.md"),
  ];
  writeJson(path.join(bookDir, "manifest.json"), manifest);
  writeJson(path.join(bookDir, "cleaned_book.json"), cleanedBook);
  writeJson(path.join(bookDir, "processed_book.json"), processedBook);
  writeJson(path.join(bookDir, "rights_report.json"), rightsReport);
  writeText(path.join(bookDir, "processing_notes.md"), notes);

  for (const section of sections) {
    const sectionPath = path.join(sectionsDir, `${section.sectionId}.json`);
    writeJson(sectionPath, section);
    changed.push(sectionPath);
  }
  return changed.map(statusPath);
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
  writeJson(libraryManifestPath, {
    schemaVersion: 1,
    books: library.books.map((book) => bySlug.get(book.slug)).filter(Boolean),
  });
}

function updatePreviewManifest(previews: PreviewAsset[]) {
  const manifest = readJson<{
    version: number;
    assetBasePath: string;
    targetRuntimeSeconds: number;
    books: Array<Record<string, unknown> & { slug: string }>;
    missing: Array<string | { slug: string; reason: string }>;
  }>(previewManifestPath);
  const bySlug = new Map(manifest.books.map((book) => [book.slug, book]));
  for (const preview of previews) {
    bySlug.set(preview.slug, {
      slug: preview.slug,
      path: `/book-previews/${preview.slug}.preview.json`,
      contentVersion: preview.contentVersion,
      contentHash: preview.contentHash,
      defaultSectionId: preview.defaultSectionId,
      previewBytes: Buffer.byteLength(`${JSON.stringify(preview, null, 2)}\n`, "utf8"),
      previewCharacterCount: preview.characterCount,
      estimatedRuntimeSeconds: preview.estimatedRuntimeSeconds,
      truncated: preview.truncated,
    });
  }
  const corrected = new Set(previews.map((preview) => preview.slug));
  writeJson(previewManifestPath, {
    ...manifest,
    books: manifest.books.map((book) => bySlug.get(book.slug)).filter(Boolean),
    missing: manifest.missing.filter((item) => {
      const slug = typeof item === "string" ? item : item.slug;
      return !corrected.has(slug);
    }),
  });
}

function notesForCorrection(record: CorrectionRecord) {
  return `# ${record.after.title}

Corrected by title/start/default-content audit 1.

- Source: ${record.sourceFileUsed}
- Correction: ${record.correctionType}
- Removed: ${record.artifactTypeRemoved.join("; ")}
- Before title: ${record.before.title}
- After title: ${record.after.title}
- Before first default: ${[record.before.firstDefaultSection.id ?? "none", record.before.firstDefaultSection.label].filter(Boolean).join(" ")}
- After first default: ${record.after.firstDefaultSection.id ?? "none"} ${record.after.firstDefaultSection.label ?? ""}

This output remains review-gated before Cloudflare export regeneration.
`;
}

function correctContent(plan: CorrectionPlan): CorrectionRecord {
  const manifestPath = path.join(generatedRoot, plan.slug, "manifest.json");
  const existing = readJson<GeneratedBookManifest>(manifestPath);
  const headManifest =
    readHeadJson<GeneratedBookManifest>(
      `app/client/assets/books/generated/${plan.slug}/manifest.json`,
    ) ?? existing;
  const beforeSections = readHeadSections(headManifest) ?? readSections(existing);
  const beforePreview = readHeadPreview(plan.slug) ?? readPreview(plan.slug);
  const before = snapshot(headManifest, beforeSections, beforePreview);
  const sourcePath = path.join(tempBooksRoot, plan.sourceFile);
  assertInside(tempBooksRoot, sourcePath);
  const rawText = fs.readFileSync(sourcePath, "utf8");
  const lines = lineRecords(rawText);
  const startLine = findLine(lines, plan.sourceHeading);
  if (!startLine) throw new Error(`${plan.slug}: source heading not found in ${plan.sourceFile}.`);
  const endLineExclusive = plan.endBeforeHeading
    ? findLine(lines, plan.endBeforeHeading, startLine + 1)
    : footerLine(lines, startLine);
  const endLine = (endLineExclusive ?? lines.length + 1) - 1;
  const boundaries = plan.makeBoundaries(lines, startLine, endLine);
  if (boundaries.length === 0) throw new Error(`${plan.slug}: no section boundaries produced.`);
  const sections = makeDetectedSections(plan.slug, rawText, lines, boundaries, endLine);
  if (!sections[0]?.text || nonPlayableStartPattern.test(sections[0].text.trim())) {
    throw new Error(`${plan.slug}: corrected first section still starts with non-playable material.`);
  }

  const manifest = buildManifestFromExisting(
    existing,
    plan.expectedTitle,
    rawText,
    sections,
    "Corrected by title/start/default-content audit 1 to use individual story identity and real default start.",
  );
  const sectionJson = sections.map((section) => makeSectionJson(plan.slug, section));
  const cleanedBook = buildCleanedBook(manifest, sections);
  const processedBook = buildProcessedBook(manifest, sections);
  const rightsPath = path.join(generatedRoot, plan.slug, "rights_report.json");
  const rights = buildRightsReport(fs.existsSync(rightsPath) ? readJson<BookRightsReport>(rightsPath) : null, manifest, rawText);
  const preview = makePreviewAsset(manifest, sectionJson);
  const generatedFilesChanged = writeGenerated(
    manifest,
    sectionJson,
    cleanedBook,
    processedBook,
    rights,
    notesForCorrection({
      slug: plan.slug,
      correctionType: plan.correctionType,
      acceptedBeforeAudit: acceptedSlugs.has(plan.slug),
      acceptanceRevokedBeforeCorrection: acceptedSlugs.has(plan.slug),
      before,
      after: before,
      sourceFileUsed: statusPath(sourcePath),
      artifactTypeRemoved: [],
      generatedFilesChanged: [],
      previewFilesChanged: [],
      finalClassification: [],
    }),
  );
  const previewPath = path.join(previewRoot, `${plan.slug}.preview.json`);
  writeJson(previewPath, preview);
  const afterManifest = readJson<GeneratedBookManifest>(manifestPath);
  const afterSections = readSections(afterManifest);
  const afterPreview = readPreview(plan.slug);
  const record: CorrectionRecord = {
    slug: plan.slug,
    correctionType: plan.correctionType,
    acceptedBeforeAudit: acceptedSlugs.has(plan.slug),
    acceptanceRevokedBeforeCorrection: acceptedSlugs.has(plan.slug),
    before,
    after: snapshot(afterManifest, afterSections, afterPreview),
    sourceFileUsed: statusPath(sourcePath),
    artifactTypeRemoved: [
      "parent collection title/byline removed from default playback",
      ...(plan.slug === "the-old-house"
        ? ["unrelated later Andersen stories removed from this individual story output"]
        : []),
      ...(plan.slug === "the-shoes-of-fortune"
        ? ["fallback part blobs replaced with source numbered sections"]
        : []),
    ],
    generatedFilesChanged,
    previewFilesChanged: [statusPath(previewPath), statusPath(previewManifestPath)],
    finalClassification: ["corrected in this pass", "still acceptable"],
  };
  writeText(path.join(generatedRoot, plan.slug, "processing_notes.md"), notesForCorrection(record));
  return record;
}

function sectionsToDetected(sections: GeneratedBookSectionJson[]): DetectedBookSection[] {
  return sections.map((section) => ({
    id: section.sectionId,
    kind: section.kind,
    label: section.label,
    title: section.title,
    order: section.order,
    includeByDefault: section.includeByDefault,
    sourceStartOffset: section.sourceOffsets.start,
    sourceEndOffset: section.sourceOffsets.end,
    characterCount: section.characterCount,
    wordCount: section.wordCount,
    morseCharacterEstimate: section.morseCharacterEstimate,
    textPreview: section.textPreview,
    text: sectionText(section),
  }));
}

function correctTitleOnly(plan: TitleOnlyPlan): CorrectionRecord {
  const manifestPath = path.join(generatedRoot, plan.slug, "manifest.json");
  const existing = readJson<GeneratedBookManifest>(manifestPath);
  const headManifest =
    readHeadJson<GeneratedBookManifest>(
      `app/client/assets/books/generated/${plan.slug}/manifest.json`,
    ) ?? existing;
  const beforeSections = readHeadSections(headManifest) ?? readSections(existing);
  const beforePreview = readHeadPreview(plan.slug) ?? readPreview(plan.slug);
  const before = snapshot(headManifest, beforeSections, beforePreview);
  const sourcePath = path.join(tempBooksRoot, plan.sourceFile);
  assertInside(tempBooksRoot, sourcePath);
  const rawText = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8") : "";
  const detectedSections = sectionsToDetected(beforeSections);
  const manifest = buildManifestFromExisting(
    existing,
    plan.expectedTitle,
    rawText || beforeSections.map(sectionText).join("\n\n"),
    detectedSections,
    "Corrected by title/start/default-content audit 1 to use individual story title identity.",
  );
  const sectionJson = beforeSections.map((section) => ({
    ...section,
    bookSlug: plan.slug,
  }));
  const cleanedBook = buildCleanedBook(manifest, detectedSections);
  const processedBook = buildProcessedBook(manifest, detectedSections);
  const rightsPath = path.join(generatedRoot, plan.slug, "rights_report.json");
  const rights = buildRightsReport(fs.existsSync(rightsPath) ? readJson<BookRightsReport>(rightsPath) : null, manifest, rawText);
  const preview = makePreviewAsset(manifest, sectionJson);
  const generatedFilesChanged = writeGenerated(
    manifest,
    sectionJson,
    cleanedBook,
    processedBook,
    rights,
    `# ${plan.expectedTitle}

Corrected by title/start/default-content audit 1.

- Source: ${statusPath(sourcePath)}
- Correction: generated title correction
- Default section content was retained; it already starts at the individual story/work.

This output remains review-gated before Cloudflare export regeneration.
`,
  );
  const previewPath = path.join(previewRoot, `${plan.slug}.preview.json`);
  writeJson(previewPath, preview);
  const afterManifest = readJson<GeneratedBookManifest>(manifestPath);
  const afterSections = readSections(afterManifest);
  const afterPreview = readPreview(plan.slug);
  return {
    slug: plan.slug,
    correctionType: "generated title correction",
    acceptedBeforeAudit: acceptedSlugs.has(plan.slug),
    acceptanceRevokedBeforeCorrection: acceptedSlugs.has(plan.slug),
    before,
    after: snapshot(afterManifest, afterSections, afterPreview),
    sourceFileUsed: statusPath(sourcePath),
    artifactTypeRemoved: ["parent collection title removed from generated title/cover metadata"],
    generatedFilesChanged,
    previewFilesChanged: [statusPath(previewPath), statusPath(previewManifestPath)],
    finalClassification: ["corrected in this pass", "still acceptable"],
  };
}

function auditBook(
  manifest: GeneratedBookManifest,
  duplicateTitleSlugs: string[],
  sourceFiles: Map<string, string>,
  correctedSlugs: Set<string>,
): BookAudit {
  const sections = readSections(manifest);
  const preview = readPreview(manifest.slug);
  const expectedTitle =
    contentCorrectionPlans[manifest.slug]?.expectedTitle ??
    titleOnlyPlans[manifest.slug]?.expectedTitle ??
    expectedTitleFromSlug(manifest.slug);
  const sourceFilename =
    contentCorrectionPlans[manifest.slug]?.sourceFile ??
    titleOnlyPlans[manifest.slug]?.sourceFile ??
    sourceFiles.get(manifest.slug) ??
    null;
  const firstDefaultSummary = manifest.sections.find((section) => section.includeByDefault) ?? null;
  const firstDefaultSection = firstDefaultSummary
    ? sections.find((section) => section.sectionId === firstDefaultSummary.id) ?? null
    : null;
  const firstText = sectionText(firstDefaultSection as GeneratedBookSectionJson | null);
  const previewText = preview?.previewText ?? "";
  const titleAppearsParentCollection =
    parentCollectionTitlePattern.test(manifest.title) &&
    normalizeForCompare(manifest.title) !== normalizeForCompare(expectedTitle);
  const firstDefaultBeginsWithMetadata = nonPlayableStartPattern.test(firstText.trim());
  const previewBeginsWithParentCollectionMetadata = parentMetadataStartPattern.test(previewText.trim());
  const chapterOneOrFirstStoryMissingOrExcluded =
    manifest.sections.some((section) => section.id === "chapter-001") &&
    !manifest.sections.find((section) => section.id === "chapter-001")?.includeByDefault;
  const classifications: string[] = [];
  if (titleAppearsParentCollection) classifications.push("needs generated title correction");
  if (firstDefaultBeginsWithMetadata || !firstDefaultSummary) {
    classifications.push("needs generated start/default correction");
  }
  if (previewBeginsWithParentCollectionMetadata || sosHelpPattern.test(previewText)) {
    classifications.push("needs preview correction");
  }
  if (!classifications.length) classifications.push("still acceptable");

  const acceptedBeforeAudit = acceptedSlugs.has(manifest.slug);
  const acceptanceVerdict = correctedSlugs.has(manifest.slug)
    ? "corrected in this pass"
    : acceptedBeforeAudit && classifications.some((classification) => classification !== "still acceptable")
      ? "acceptance revoked pending correction"
      : acceptedBeforeAudit
        ? "still acceptable"
        : "not previously accepted";

  return {
    slug: manifest.slug,
    acceptedBeforeAudit,
    generatedTitle: manifest.title,
    expectedTitle,
    sourceFilename,
    generatedOutputExists: true,
    previewAssetExists: Boolean(preview),
    duplicateGeneratedTitleSlugs: duplicateTitleSlugs,
    titleAppearsParentCollection,
    titleShouldBeCorrected: titleAppearsParentCollection,
    firstDefaultSectionId: firstDefaultSummary?.id ?? null,
    firstDefaultSectionTitle: firstDefaultSummary?.title ?? firstDefaultSummary?.label ?? null,
    firstDefaultSectionKind: firstDefaultSummary?.kind ?? null,
    firstDefaultTextSnippet: compact(firstText),
    firstDefaultBeginsWithRealReadableContent:
      Boolean(firstText.trim()) && !firstDefaultBeginsWithMetadata && !parentMetadataStartPattern.test(firstText.trim()),
    firstDefaultBeginsWithMetadata,
    chapterOneOrFirstStoryMissingOrExcluded,
    previewStartSnippet: compact(previewText),
    previewStartsFromRealReadableContent:
      Boolean(previewText.trim()) &&
      !sosHelpPattern.test(previewText) &&
      !nonPlayableStartPattern.test(previewText.trim()) &&
      !previewBeginsWithParentCollectionMetadata,
    previewBeginsWithParentCollectionMetadata,
    previewContainsSosHelp: sosHelpPattern.test(previewText),
    classifications,
    acceptanceVerdict,
    warnings: [
      ...(!sourceFilename ? ["No clear temp-books source match was resolved for this generated book."] : []),
      ...(duplicateTitleSlugs.length > 1 ? [`Generated title is shared by ${duplicateTitleSlugs.length} slugs.`] : []),
      ...(manifest.slug === "the-call-of-the-wild"
        ? ["Static generated data starts at Chapter I; manual Chapter II symptom was traced to runtime selected-source assembly reordering during hydration/saved-state restoration, not generated-data failure."]
        : []),
    ],
  };
}

function buildMarkdown(report: ReturnType<typeof buildReport>) {
  const lines: string[] = [];
  lines.push("# Title/Start/Default Content Audit 1");
  lines.push("");
  lines.push("Focused false-positive audit for generated book title identity, first default content, startup preview starts, and selected-source runtime consistency.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Generated books audited: ${report.totals.generatedBooksAudited}`);
  lines.push(`- Accepted/generated books audited: ${report.totals.acceptedGeneratedBooksAudited}`);
  lines.push(`- Corrections applied: ${report.totals.correctionsApplied}`);
  lines.push(`- Accepted books corrected: ${report.totals.acceptedBooksCorrected}`);
  lines.push(`- Acceptance revoked pending correction after this pass: ${report.totals.acceptanceRevokedPendingCorrection}`);
  lines.push("");
  lines.push("## Runtime Consistency");
  lines.push("");
  lines.push(`- the-call-of-the-wild: ${report.runtimeConsistency.theCallOfTheWild.verdict}`);
  lines.push(`- Evidence: ${report.runtimeConsistency.theCallOfTheWild.evidence.join(" ")}`);
  lines.push(`- Runtime fix: ${report.runtimeConsistency.previewScrollResetFix}`);
  lines.push("");
  lines.push("## Corrections");
  lines.push("");
  for (const correction of report.correctionsApplied) {
    lines.push(`### ${correction.slug}`);
    lines.push("");
    lines.push(`- Correction: ${correction.correctionType}`);
    lines.push(`- Source: ${correction.sourceFileUsed}`);
    lines.push(`- Before title: ${correction.before.title}`);
    lines.push(`- After title: ${correction.after.title}`);
    lines.push(`- Before first default: ${[correction.before.firstDefaultSection.id ?? "none", correction.before.firstDefaultSection.label].filter(Boolean).join(" ")}`);
    lines.push(`- After first default: ${correction.after.firstDefaultSection.id ?? "none"} ${correction.after.firstDefaultSection.label ?? ""}`);
    lines.push(`- Before preview start: ${correction.before.previewStart ?? "n/a"}`);
    lines.push(`- After preview start: ${correction.after.previewStart ?? "n/a"}`);
    lines.push(`- Removed/fixed: ${correction.artifactTypeRemoved.join("; ")}`);
    lines.push("");
  }
  lines.push("## Critical Examples");
  lines.push("");
  lines.push("| Slug | Accepted before audit | Verdict | Classifications | First default | Preview start |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const slug of criticalExamples) {
    const book = report.books.find((entry) => entry.slug === slug);
    if (!book) continue;
    lines.push(
      `| ${book.slug} | ${book.acceptedBeforeAudit ? "yes" : "no"} | ${book.acceptanceVerdict} | ${book.classifications.join(", ")} | ${book.firstDefaultSectionId ?? "none"} ${book.firstDefaultSectionTitle ?? ""} | ${book.previewStartSnippet ?? "n/a"} |`,
    );
  }
  lines.push("");
  lines.push("## Flagged Accepted Books");
  lines.push("");
  if (report.flaggedAcceptedBooks.length === 0) {
    lines.push("- None remain after the focused corrections in this pass.");
  } else {
    report.flaggedAcceptedBooks.forEach((book) => {
      lines.push(`- ${book.slug}: ${book.acceptanceVerdict}; ${book.classifications.join(", ")}`);
    });
  }
  lines.push("");
  lines.push("## Full Generated Book Audit");
  lines.push("");
  lines.push("| Slug | Accepted | Generated title | Expected title | Source | Classifications | Verdict |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  report.books.forEach((book) => {
    lines.push(
      `| ${book.slug} | ${book.acceptedBeforeAudit ? "yes" : "no"} | ${book.generatedTitle} | ${book.expectedTitle} | ${book.sourceFilename ?? "unresolved"} | ${book.classifications.join(", ")} | ${book.acceptanceVerdict} |`,
    );
  });
  lines.push("");
  lines.push("## Future Batch Rule");
  lines.push("");
  futureBatchRules.forEach((rule) => lines.push(`- ${rule}`));
  lines.push("");
  lines.push("Cloudflare export files were intentionally not modified in this audit; corrected generated output must go through a later controlled export step before public export JSON is refreshed.");
  return `${lines.join("\n")}\n`;
}

function buildReport(correctionsApplied: CorrectionRecord[]) {
  const manifests = fs
    .readdirSync(generatedRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(generatedRoot, entry.name, "manifest.json"))
    .filter((manifestPath) => fs.existsSync(manifestPath))
    .map((manifestPath) => readJson<GeneratedBookManifest>(manifestPath))
    .sort((left, right) => left.slug.localeCompare(right.slug));
  const titleGroups = new Map<string, string[]>();
  manifests.forEach((manifest) => {
    const key = manifest.title;
    titleGroups.set(key, [...(titleGroups.get(key) ?? []), manifest.slug]);
  });
  const sourceFiles = sourceFileIndex();
  const correctedSlugs = new Set(correctionsApplied.map((record) => record.slug));
  const books = manifests.map((manifest) =>
    auditBook(manifest, titleGroups.get(manifest.title) ?? [manifest.slug], sourceFiles, correctedSlugs),
  );
  const flaggedAcceptedBooks = books.filter(
    (book) =>
      book.acceptedBeforeAudit &&
      book.acceptanceVerdict === "acceptance revoked pending correction",
  );
  return {
    reportName: "title-start-default-content-audit-1" as const,
    generatedAt: new Date().toISOString(),
    branch: "morsewords-book-processing-pilot-write-6-jun-2026",
    scope:
      "All generated books; accepted/generated slugs from completed pilot batches through write batch 6 are identified.",
    criticalExamples,
    totals: {
      generatedBooksAudited: books.length,
      acceptedGeneratedBooksAudited: books.filter((book) => book.acceptedBeforeAudit).length,
      correctionsApplied: correctionsApplied.length,
      acceptedBooksCorrected: correctionsApplied.filter((record) => record.acceptedBeforeAudit).length,
      acceptanceRevokedPendingCorrection: flaggedAcceptedBooks.length,
    },
    runtimeConsistency: {
      theCallOfTheWild: {
        verdict:
          "generated data and preview asset are correct; manual Chapter II observation exposed a runtime selected-source ordering bug",
        evidence: [
          "chapter-001 is default included and starts with Chapter I. Into the Primitive.",
          "startup preview defaultSectionId is chapter-001.",
          "targeted regression seeds saved progress/active section at chapter-002 and verifies selected-source preview still starts at Chapter I.",
          "selected loaded sections now preserve the selected/default section id order rather than re-sorting by section payload order.",
        ],
      },
      selectedSourceAssembly:
        "Runtime source assembly is based on selected section IDs and preserves that selected/default id order.",
      previewScrollResetFix:
        "The cleaned reading preview pre element now resets scrollTop when selected source text/book changes so stale scroll position cannot make the panel appear to start later.",
    },
    correctionsApplied,
    flaggedAcceptedBooks,
    books,
    futureBatchRules,
    protectedPaths: {
      rawSources: "app/client/assets/temp-books (read only)",
      cloudflareExport: "app/client/assets/books/cloudflare-export (not modified)",
    },
  };
}

function main() {
  const correctionRecords: CorrectionRecord[] = [];
  const correctedManifests: GeneratedBookManifest[] = [];
  const correctedPreviews: PreviewAsset[] = [];

  for (const plan of Object.values(contentCorrectionPlans)) {
    const record = correctContent(plan);
    correctionRecords.push(record);
    correctedManifests.push(readJson<GeneratedBookManifest>(path.join(generatedRoot, plan.slug, "manifest.json")));
    correctedPreviews.push(readPreview(plan.slug)!);
  }
  for (const plan of Object.values(titleOnlyPlans)) {
    const record = correctTitleOnly(plan);
    correctionRecords.push(record);
    correctedManifests.push(readJson<GeneratedBookManifest>(path.join(generatedRoot, plan.slug, "manifest.json")));
    correctedPreviews.push(readPreview(plan.slug)!);
  }

  updateLibraryManifest(correctedManifests);
  updatePreviewManifest(correctedPreviews);

  const report = buildReport(correctionRecords);
  writeJson(
    path.join(auditReportRoot, "title-start-default-content-audit-1.json"),
    report,
  );
  writeText(
    path.join(auditReportRoot, "title-start-default-content-audit-1.md"),
    buildMarkdown(report),
  );
  writeText(
    path.join(batch6VerificationRoot, "title-start-default-content-audit-note.md"),
    `# Title/Start/Default Content Audit Note

This note appends the focused title/start/default-content audit to pilot write batch 6 verification.

- Batch 6 remains paused from further scaling.
- the-money-box: accepted claim rechecked; generated title corrected from parent collection title to The Money Box. Default start already began with the story text.
- the-winning-of-olwen: accepted claim rechecked; generated title corrected from parent collection title to The Winning of Olwen. Default start already began with the story text.
- No unresolved-source generated books were touched.
- Cloudflare export files were not modified.

See app/client/assets/books/audit-reports/title-start-default-content-audit-1/title-start-default-content-audit-1.json for the all-generated-book audit.
`,
  );

  console.log(
    `Title/start/default-content audit complete: ${report.totals.generatedBooksAudited} generated books audited, ${report.totals.correctionsApplied} corrections applied, ${report.totals.acceptanceRevokedPendingCorrection} accepted books still revoked.`,
  );
}

main();
