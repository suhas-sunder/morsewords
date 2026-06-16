import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const tempRoot = path.join(repoRoot, "app/client/assets/temp-books");
const previewRoot = path.join(repoRoot, "public/book-previews");
const reportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/startup-generated-content-fixes-1",
);
const startupAuditPath = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/book-startup-preview-audit-1/book-startup-preview-audit-1.json",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const targetRuntimeSeconds = 3_600;

const targetSlugs = new Set([
  "don-quixote",
  "les-miserables",
  "sun-tzu-on-the-art-of-war",
  "the-count-of-monte-cristo",
  "the-count-of-monte-cristo-gutenberg-1184",
  "the-happy-family",
]);

const priorStartupFailures: Record<
  string,
  {
    issue: string;
    firstDefaultBefore: {
      id: string;
      label: string;
      title: string | null;
      kind: string;
      wordCount: number;
      includeByDefault: boolean;
      snippet: string | null;
    };
  }
> = {
  "don-quixote": {
    issue:
      "recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 3 (80 words) | warnings: Preview asset content hash/version is stale.; chapter-001 is labeled Chapter 3, which suggests chapter order damage.",
    firstDefaultBefore: {
      id: "chapter-001",
      label: "Chapter 3",
      title: null,
      kind: "chapter",
      wordCount: 80,
      includeByDefault: true,
      snippet: null,
    },
  },
  "les-miserables": {
    issue:
      "recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 4 (20954 words) | warnings: Preview asset content hash/version is stale.; chapter-001 is labeled Chapter 4, which suggests chapter order damage.",
    firstDefaultBefore: {
      id: "chapter-001",
      label: "Chapter 4",
      title: null,
      kind: "chapter",
      wordCount: 20_954,
      includeByDefault: true,
      snippet: null,
    },
  },
  "sun-tzu-on-the-art-of-war": {
    issue:
      "recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 28 (4623 words) | warnings: Preview asset content hash/version is stale.; chapter-001 is labeled Chapter 28, which suggests chapter order damage.",
    firstDefaultBefore: {
      id: "chapter-001",
      label: "Chapter 28",
      title: null,
      kind: "chapter",
      wordCount: 4_623,
      includeByDefault: true,
      snippet: null,
    },
  },
  "the-count-of-monte-cristo": {
    issue:
      "recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 116 - The Pardon (4 words) | warnings: Preview asset content hash/version is stale.; First default section does not look like readable book content.; chapter-001 is labeled Chapter 116, which suggests chapter order damage.",
    firstDefaultBefore: {
      id: "chapter-001",
      label: "Chapter 116",
      title: "The Pardon",
      kind: "chapter",
      wordCount: 4,
      includeByDefault: true,
      snippet: "Chapter 116. The Pardon",
    },
  },
  "the-count-of-monte-cristo-gutenberg-1184": {
    issue:
      "recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 116 - The Pardon (4 words) | warnings: Preview asset content hash/version is stale.; First default section does not look like readable book content.; chapter-001 is labeled Chapter 116, which suggests chapter order damage.",
    firstDefaultBefore: {
      id: "chapter-001",
      label: "Chapter 116",
      title: "The Pardon",
      kind: "chapter",
      wordCount: 4,
      includeByDefault: true,
      snippet: "Chapter 116. The Pardon",
    },
  },
  "the-happy-family": {
    issue:
      "recommendation: generated book needs processing correction later | first generated section: part-001 Part 1 (29 words) | warnings: Preview asset content hash/version is stale.; No main readable sections are included by default.; Generated content is a placeholder rather than source body text.",
    firstDefaultBefore: {
      id: "part-001",
      label: "Part 1",
      title: null,
      kind: "part",
      wordCount: 29,
      includeByDefault: false,
      snippet:
        "This MorseWords reference file does not include body text yet. The book route is available...",
    },
  },
};

const configs = [
  {
    slug: "don-quixote",
    rawCandidates: [path.join(tempRoot, "Don Quixote.txt")],
    parser: "don",
    minSections: 100,
    structure: "two-volume chapter sequence with roman-numeral chapter headings",
    cleanup: [
      "excluded editor notes, title material, and table of contents from playable defaults",
      "restarted generated defaults at the first real Chapter I body heading",
      "preserved sequential chapter defaults without the stale Chapter 3 startup",
      "removed illustration/image marker lines from generated playable text",
      "normalized Morse source punctuation and diacritics for playback while preserving display prose",
    ],
  },
  {
    slug: "les-miserables",
    rawCandidates: [path.join(tempRoot, "Les Misérables.txt")],
    parser: "les",
    minSections: 300,
    structure: "volume/book/chapter hierarchy with roman-numeral chapter headings",
    cleanup: [
      "excluded title pages, illustration list, and table of contents from playable defaults",
      "restarted generated defaults at Volume I, Book First, Chapter I body content",
      "kept volume and book context in section titles instead of selecting front matter",
      "removed image marker lines from generated playable text",
      "normalized Morse source punctuation and diacritics for playback while preserving display prose",
    ],
  },
  {
    slug: "sun-tzu-on-the-art-of-war",
    rawCandidates: [path.join(tempRoot, "Sun Tzŭ on the Art of War.txt")],
    parser: "sun",
    minSections: 13,
    maxSections: 13,
    structure: "thirteen numbered treatise chapters followed by concordance/index end matter",
    cleanup: [
      "excluded transcriber note, title material, contents, preface, and introduction from playable defaults",
      "restarted generated defaults at treatise chapter I, Laying Plans",
      "stopped generated playable content before Chinese concordance and index end matter",
      "normalized Morse source punctuation, diacritics, and unsupported heading glyphs for playback",
    ],
  },
  {
    slug: "the-count-of-monte-cristo",
    rawCandidates: [path.join(tempRoot, "The Count of Monte Cristo.txt")],
    parser: "monte",
    minSections: 117,
    maxSections: 117,
    structure: "117 Arabic-numbered chapters after title/contents front matter",
    cleanup: [
      "excluded title page and contents from playable defaults",
      "restarted generated defaults at Chapter 1, Marseilles-The Arrival",
      "repaired stale Chapter 116/117 boundary damage that swallowed earlier chapters",
      "normalized Morse source punctuation and diacritics for playback while preserving display prose",
    ],
  },
  {
    slug: "the-count-of-monte-cristo-gutenberg-1184",
    rawCandidates: [
      path.join(tempRoot, "the-count-of-monte-cristo.txt"),
      path.join(tempRoot, "The Count of Monte Cristo.txt"),
    ],
    parser: "monte",
    minSections: 117,
    maxSections: 117,
    structure: "duplicate Gutenberg 1184 generated route using the 117-chapter Count of Monte Cristo source",
    cleanup: [
      "used the canonical temp-books Count of Monte Cristo raw source because the duplicate metadata raw filename is absent",
      "excluded title page and contents from playable defaults",
      "restarted generated defaults at Chapter 1, Marseilles-The Arrival",
      "repaired stale Chapter 116/117 boundary damage that swallowed earlier chapters",
      "normalized Morse source punctuation and diacritics for playback while preserving display prose",
    ],
  },
  {
    slug: "the-happy-family",
    rawCandidates: [path.join(tempRoot, "The Happy Family.txt")],
    parser: "happy",
    minSections: 1,
    maxSections: 1,
    structure: "single short story bounded before Project Gutenberg footer",
    cleanup: [
      "replaced placeholder generated content with the real short-story body from the source file",
      "excluded Project Gutenberg footer/license material from playable defaults",
      "normalized Morse source punctuation and diacritics for playback while preserving display prose",
    ],
  },
];

const morseCodes: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "_": "..--.-",
  "\"": ".-..-.",
  "$": "...-..-",
  "@": ".--.-.",
};

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(filePath: string, data: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data);
}

function assertInside(childPath: string, parentPath: string) {
  const child = path.resolve(childPath);
  const parent = path.resolve(parentPath);
  if (child !== parent && !child.startsWith(`${parent}${path.sep}`)) {
    throw new Error(`Unsafe path outside ${parent}: ${child}`);
  }
  return child;
}

function normalizeLineEndings(text: string) {
  return text.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
}

function readRawSource(config: (typeof configs)[number]) {
  for (const candidate of config.rawCandidates) {
    if (!fs.existsSync(candidate)) continue;
    const absolute = path.resolve(candidate);
    assertInside(absolute, tempRoot);
    return {
      text: normalizeLineEndings(fs.readFileSync(absolute, "utf8")),
      repoPath: path.relative(repoRoot, absolute).replace(/\\/g, "/"),
      declaredCandidateMissing: candidate !== config.rawCandidates[0],
      declaredCandidate: path
        .relative(repoRoot, config.rawCandidates[0])
        .replace(/\\/g, "/"),
    };
  }
  throw new Error(`No approved raw source candidate exists for ${config.slug}`);
}

function lineStarts(text: string) {
  const starts = [0];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "\n") starts.push(index + 1);
  }
  return starts;
}

function firstLineIndex(
  lines: string[],
  predicate: (line: string, index: number) => boolean,
  start = 0,
) {
  for (let index = start; index < lines.length; index += 1) {
    if (predicate(lines[index], index)) return index;
  }
  return -1;
}

function findFooterIndex(lines: string[], start: number) {
  const index = firstLineIndex(
    lines,
    (line) => /\*\*\*\s*END OF|end of (the )?project gutenberg/i.test(line),
    start,
  );
  return index >= 0 ? index : lines.length;
}

function cleanPlayableText(input: string) {
  return normalizeLineEndings(input)
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .filter((line) => {
      const trimmed = line.trim();
      if (/^\[(illustration|image|plate|music|decorative|decorations?)\b/i.test(trimmed)) return false;
      if (/^(illustration|image|plate)\b/i.test(trimmed)) return false;
      if (/^full size$/i.test(trimmed)) return false;
      if (/^[a-z0-9_-]+\.(jpg|jpeg|png|gif|bmp)\b/i.test(trimmed)) return false;
      if (/^\[?(page\s+)?\d+\]?$/i.test(trimmed)) return false;
      if (/^\*\*\*\s*(start|end) of/i.test(trimmed)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function toMorseSourceText(input: string) {
  return cleanPlayableText(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "AE")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, "\"")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function countWords(input: string) {
  const matches = toMorseSourceText(input).match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)?/g);
  return matches?.length ?? 0;
}

function estimateMorseCharacters(input: string) {
  let units = 0;
  let previousWasSpace = false;
  for (const char of toMorseSourceText(input).toUpperCase()) {
    if (/\s/.test(char)) {
      if (!previousWasSpace) units += 3;
      previousWasSpace = true;
      continue;
    }
    previousWasSpace = false;
    const code = morseCodes[char];
    if (code) units += code.length + 1;
  }
  return units;
}

function textPreview(input: string, length = 180) {
  const compact = input.replace(/\s+/g, " ").trim();
  if (compact.length <= length) return compact;
  return `${compact.slice(0, length - 1).trimEnd()}...`;
}

function splitParagraphs(input: string) {
  return cleanPlayableText(input)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

function titleCase(input: string | null) {
  if (!input) return null;
  const cleaned = input
    .replace(/[_.]+/g, " ")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim();
  if (!cleaned) return null;
  return cleaned
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\b([ivxlcdm]+)\b/gi, (roman) => roman.toUpperCase());
}

function titleFromFollowingLines(lines: string[], headingIndex: number) {
  const pieces: string[] = [];
  for (let index = headingIndex + 1; index < Math.min(lines.length, headingIndex + 8); index += 1) {
    const line = lines[index].trim();
    if (!line) {
      if (pieces.length > 0) break;
      continue;
    }
    if (/^(CHAPTER|BOOK|VOLUME|PART)\b/i.test(line)) break;
    if (line.length > 160) break;
    pieces.push(line);
  }
  return titleCase(pieces.join(" "));
}

function contextBefore(lines: string[], headingIndex: number, previousHeadingIndex: number) {
  let volume: string | null = null;
  let book: string | null = null;
  const floor = Math.max(previousHeadingIndex + 1, headingIndex - 140, 0);
  for (let index = headingIndex - 1; index >= floor; index -= 1) {
    const line = lines[index].trim();
    if (!volume && /^VOLUME\s+[A-Z0-9IVXLCDM]+\b/i.test(line)) volume = titleCase(line);
    if (!book && /^BOOK\s+[A-Z0-9IVXLCDM]+\b/i.test(line)) book = titleCase(line);
    if (volume && book) break;
  }
  return { volume, book };
}

function parseDon(lines: string[]) {
  const bodyStart = firstLineIndex(lines, (line) => /^CHAPTER\s+I\.$/.test(line.trim()), 2_000);
  if (bodyStart < 0) throw new Error("Unable to find Don Quixote first body chapter");
  const introductionStart = firstLineIndex(lines, (line) => /^INTRODUCTION$/i.test(line.trim()), 600);
  const bodyEnd = findFooterIndex(lines, bodyStart);
  const headingIndexes: number[] = [];
  for (let index = bodyStart; index < bodyEnd; index += 1) {
    if (/^CHAPTER\s+[IVXLCDM]+\.$/.test(lines[index].trim())) headingIndexes.push(index);
  }
  return {
    specs: [
      ...(introductionStart >= 0 && introductionStart < bodyStart
        ? [
            {
              kind: "introduction",
              label: "Introduction",
              title: "Introduction Prefatory",
              includeByDefault: false,
              startIndex: introductionStart,
              endIndex: bodyStart,
            },
          ]
        : []),
      ...headingIndexes.map((startIndex, index) => {
        const context = contextBefore(lines, startIndex, headingIndexes[index - 1] ?? bodyStart);
        const title = [context.volume, titleFromFollowingLines(lines, startIndex)].filter(Boolean).join(" - ");
        return {
          startIndex,
          endIndex: headingIndexes[index + 1] ?? bodyEnd,
          title: titleCase(title),
        };
      }),
    ],
    startBoundary: `line ${bodyStart + 1}: ${lines[bodyStart].trim()}`,
    endBoundary: `line ${bodyEnd + 1}: ${lines[bodyEnd]?.trim() || "end of source"}`,
  };
}

function parseLes(lines: string[]) {
  const volumeStart = firstLineIndex(lines, (line) => /^VOLUME\s+I\b/i.test(line.trim()), 1_000);
  const prefaceStart = firstLineIndex(lines, (line) => /^PREFACE$/i.test(line.trim()), 1_000);
  const bodyStart = firstLineIndex(lines, (line) => /^CHAPTER\s+I[\u2014-]/i.test(line.trim()), volumeStart);
  if (bodyStart < 0) throw new Error("Unable to find Les Misérables first body chapter");
  const bodyEnd = findFooterIndex(lines, bodyStart);
  const headingIndexes: number[] = [];
  for (let index = bodyStart; index < bodyEnd; index += 1) {
    if (/^CHAPTER\s+[IVXLCDM]+[\u2014-]/i.test(lines[index].trim())) headingIndexes.push(index);
  }
  return {
    specs: [
      ...(prefaceStart >= 0 && prefaceStart < volumeStart
        ? [
            {
              kind: "preface",
              label: "Preface",
              title: "Preface",
              includeByDefault: false,
              startIndex: prefaceStart,
              endIndex: volumeStart,
            },
          ]
        : []),
      ...headingIndexes.map((startIndex, index) => {
        const line = lines[startIndex].trim();
        const title = line.match(/^CHAPTER\s+[IVXLCDM]+[\u2014-]\s*(.+)$/i)?.[1] ?? null;
        const context = contextBefore(lines, startIndex, headingIndexes[index - 1] ?? volumeStart);
        return {
          startIndex,
          endIndex: headingIndexes[index + 1] ?? bodyEnd,
          title: titleCase([context.volume, context.book, title].filter(Boolean).join(" - ")),
        };
      }),
    ],
    startBoundary: `line ${bodyStart + 1}: ${lines[bodyStart].trim()}`,
    endBoundary: `line ${bodyEnd + 1}: ${lines[bodyEnd]?.trim() || "end of source"}`,
  };
}

function parseMonte(lines: string[]) {
  const bodyStart = firstLineIndex(lines, (line) => /^Chapter\s+1\.\s+/i.test(line.trim()), 150);
  if (bodyStart < 0) throw new Error("Unable to find The Count of Monte Cristo Chapter 1");
  const bodyEnd = findFooterIndex(lines, bodyStart);
  const headingIndexes: number[] = [];
  for (let index = bodyStart; index < bodyEnd; index += 1) {
    if (/^Chapter\s+\d+\.\s+/.test(lines[index].trim())) headingIndexes.push(index);
  }
  return {
    specs: headingIndexes.map((startIndex, index) => ({
      startIndex,
      endIndex: headingIndexes[index + 1] ?? bodyEnd,
      title: titleCase(lines[startIndex].trim().match(/^Chapter\s+\d+\.\s+(.+)$/i)?.[1] ?? null),
    })),
    startBoundary: `line ${bodyStart + 1}: ${lines[bodyStart].trim()}`,
    endBoundary: `line ${bodyEnd + 1}: ${lines[bodyEnd]?.trim() || "end of source"}`,
  };
}

function parseSun(lines: string[]) {
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];
  const prefaceStart = firstLineIndex(lines, (line) => /^PREFACE$/i.test(line.trim()), 80);
  const introductionStart = firstLineIndex(lines, (line) => /^INTRODUCTION$/i.test(line.trim()), 150);
  const bodyStart = firstLineIndex(lines, (line) => /^I\.\s+/.test(line.trim()), 1_000);
  if (bodyStart < 0) throw new Error("Unable to find Sun Tzu chapter I");
  const concordance = firstLineIndex(lines, (line) => /^CHINESE CONCORDANCE\b/i.test(line.trim()), bodyStart);
  const bodyEnd = concordance >= 0 ? concordance : findFooterIndex(lines, bodyStart);
  const headingIndexes: number[] = [];
  for (let index = bodyStart; index < bodyEnd; index += 1) {
    const expected = roman[headingIndexes.length];
    if (expected && new RegExp(`^${expected}\\.\\s+`).test(lines[index].trim())) headingIndexes.push(index);
  }
  return {
    specs: [
      ...(prefaceStart >= 0 && prefaceStart < introductionStart
        ? [
            {
              kind: "preface",
              label: "Preface",
              title: "Preface",
              includeByDefault: false,
              startIndex: prefaceStart,
              endIndex: introductionStart,
            },
          ]
        : []),
      ...(introductionStart >= 0 && introductionStart < bodyStart
        ? [
            {
              kind: "introduction",
              label: "Introduction",
              title: "Sun Wu And His Book",
              includeByDefault: false,
              startIndex: introductionStart,
              endIndex: bodyStart,
            },
          ]
        : []),
      ...headingIndexes.map((startIndex, index) => {
        const titleLine = firstLineIndex(
          lines,
          (line) => Boolean(line.trim()) && !/^[-=]+$/.test(line.trim()),
          startIndex + 1,
        );
        const nextHeadingIndex = headingIndexes[index + 1] ?? bodyEnd;
        const firstNumberedLine = firstLineIndex(
          lines,
          (line) => /^\d+\.\s+/.test(line.trim()),
          startIndex + 1,
        );
        return {
          startIndex:
            firstNumberedLine >= 0 && firstNumberedLine < nextHeadingIndex
              ? firstNumberedLine
              : startIndex,
          endIndex: nextHeadingIndex,
          title: titleCase(titleLine >= 0 ? lines[titleLine].trim() : null),
        };
      }),
    ],
    startBoundary: `line ${bodyStart + 1}: ${lines[bodyStart].trim()}`,
    endBoundary: `line ${bodyEnd + 1}: ${lines[bodyEnd]?.trim() || "end of source"}`,
  };
}

function parseHappy(lines: string[]) {
  const titleIndex = firstLineIndex(lines, (line) => /^THE HAPPY FAMILY$/i.test(line.trim()));
  const storyIndex = firstLineIndex(
    lines,
    (line) => /^Really, the largest green leaf/i.test(line.trim()),
    titleIndex >= 0 ? titleIndex : 0,
  );
  if (titleIndex < 0 || storyIndex < 0) throw new Error("Unable to find The Happy Family story boundary");
  const bodyEnd = findFooterIndex(lines, storyIndex);
  return {
    specs: [{ startIndex: titleIndex, endIndex: bodyEnd, title: "The Happy Family" }],
    startBoundary: `line ${storyIndex + 1}: ${lines[storyIndex].trim()}`,
    endBoundary: `line ${bodyEnd + 1}: ${lines[bodyEnd]?.trim() || "end of source"}`,
  };
}

function parseRaw(config: (typeof configs)[number], rawText: string) {
  const lines = rawText.split("\n");
  if (config.parser === "don") return parseDon(lines);
  if (config.parser === "les") return parseLes(lines);
  if (config.parser === "sun") return parseSun(lines);
  if (config.parser === "monte") return parseMonte(lines);
  if (config.parser === "happy") return parseHappy(lines);
  throw new Error(`Unknown parser ${config.parser}`);
}

function makeGeneratedSection(
  slug: string,
  rawText: string,
  starts: number[],
  spec: {
    kind?: string;
    label?: string;
    includeByDefault?: boolean;
    startIndex: number;
    endIndex: number;
    title: string | null;
  },
  order: number,
  sectionNumber: number,
) {
  const kind = spec.kind ?? "chapter";
  const start = starts[spec.startIndex] ?? 0;
  const end = starts[spec.endIndex] ?? rawText.length;
  const displayText = cleanPlayableText(rawText.slice(start, end));
  const morseSourceText = toMorseSourceText(displayText);
  const wordCount = countWords(displayText);
  const morseCharacterEstimate = estimateMorseCharacters(morseSourceText);
  return {
    schemaVersion: 1,
    bookSlug: slug,
    sectionId: `${kind}-${String(sectionNumber).padStart(3, "0")}`,
    kind,
    label: spec.label ?? `Chapter ${sectionNumber}`,
    title: spec.title,
    order,
    includeByDefault: spec.includeByDefault ?? kind === "chapter",
    displayText,
    morseSourceText,
    paragraphs: splitParagraphs(displayText),
    wordCount,
    characterCount: displayText.length,
    estimatedTypingMinutes: Math.max(1, Math.ceil(wordCount / 40)),
    estimatedListeningMinutes: Math.max(1, Math.ceil(morseCharacterEstimate / 620)),
    morseCharacterEstimate,
    unsupportedCharacterSummary: {},
    textPreview: textPreview(displayText),
    sourceOffsets: { start, end },
  };
}

function firstDefaultDescription(manifest: any) {
  const section = manifest.sections.find((candidate: any) => candidate.includeByDefault) ?? manifest.sections[0] ?? null;
  if (!section) return null;
  return {
    id: section.id,
    label: section.label,
    title: section.title,
    kind: section.kind,
    wordCount: section.wordCount,
    includeByDefault: section.includeByDefault,
    snippet: section.textPreview ?? null,
  };
}

function buildContentHash(slug: string, rawText: string, sections: any[]) {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        targetedPass: "startup-generated-content-fixes-1",
        slug,
        rawHash: crypto.createHash("sha256").update(rawText).digest("hex"),
        sections: sections.map((section) => ({
          id: section.sectionId,
          text: section.displayText,
        })),
      }),
    )
    .digest("hex");
}

function clampBoundary(text: string, targetLength: number) {
  if (text.length <= targetLength) return text.trim();
  const minBoundary = Math.max(0, Math.floor(targetLength * 0.72));
  const maxBoundary = Math.min(text.length, Math.floor(targetLength * 1.08));
  const searchWindow = text.slice(minBoundary, maxBoundary);
  const paragraphBreak = searchWindow.lastIndexOf("\n\n");
  if (paragraphBreak > 0) return text.slice(0, minBoundary + paragraphBreak).trim();
  const sentence = [...searchWindow.matchAll(/[.!?]["')\]]?\s+/g)].at(-1);
  if (sentence?.index !== undefined) {
    return text.slice(0, minBoundary + sentence.index + sentence[0].length).trim();
  }
  const whitespace = text.lastIndexOf(" ", targetLength);
  if (whitespace > minBoundary) return text.slice(0, whitespace).trim();
  return text.slice(0, targetLength).trim();
}

function previewTextForSection(section: any) {
  const text = (section.morseSourceText || section.displayText).trim();
  const estimatedRuntimeSeconds = Math.max(1, Math.round(section.estimatedListeningMinutes * 60));
  if (estimatedRuntimeSeconds <= targetRuntimeSeconds) return text;
  const ratio = targetRuntimeSeconds / estimatedRuntimeSeconds;
  return clampBoundary(text, Math.max(1, Math.floor(text.length * ratio)));
}

function buildPreviewAsset(slug: string, manifest: any, section: any) {
  const previewText = previewTextForSection(section);
  const morseCharacterEstimate = estimateMorseCharacters(previewText);
  const wordCount = countWords(previewText);
  return {
    version: 1,
    slug,
    contentVersion: manifest.contentVersion,
    contentHash: manifest.contentHash,
    defaultSectionId: section.sectionId,
    defaultSectionKind: section.kind,
    defaultSectionLabel: section.label,
    defaultSectionTitle: section.title,
    previewText,
    estimatedRuntimeSeconds: Math.max(
      1,
      Math.min(targetRuntimeSeconds, Math.round(section.estimatedListeningMinutes * 60)),
    ),
    wordCount,
    characterCount: previewText.length,
    estimatedTypingMinutes: Math.max(1, Math.ceil(wordCount / 40)),
    estimatedListeningMinutes: Math.max(1, Math.ceil(morseCharacterEstimate / 620)),
    morseCharacterEstimate,
    textPreview: textPreview(previewText),
    truncated: previewText.length < (section.morseSourceText || section.displayText).trim().length,
  };
}

function updateLibraryManifest(slug: string, manifest: any) {
  const library = readJson(libraryManifestPath);
  const index = library.books.findIndex((book: any) => book.slug === slug);
  if (index < 0) throw new Error(`Missing ${slug} from library manifest`);
  library.books[index] = {
    slug,
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
    manifestPath: `${slug}/manifest.json`,
  };
  writeJson(libraryManifestPath, library);
}

function updatePreviewManifest(slug: string, previewAsset: any) {
  const previewPath = path.join(previewRoot, `${slug}.preview.json`);
  writeJson(previewPath, previewAsset);
  const previewManifest = readJson(previewManifestPath);
  const entry = {
    slug,
    path: `/book-previews/${slug}.preview.json`,
    contentVersion: previewAsset.contentVersion,
    contentHash: previewAsset.contentHash,
    defaultSectionId: previewAsset.defaultSectionId,
    previewBytes: fs.statSync(previewPath).size,
    previewCharacterCount: previewAsset.characterCount,
    estimatedRuntimeSeconds: previewAsset.estimatedRuntimeSeconds,
    truncated: previewAsset.truncated,
  };
  const index = previewManifest.books.findIndex((book: any) => book.slug === slug);
  if (index >= 0) previewManifest.books[index] = entry;
  else previewManifest.books.push(entry);
  previewManifest.books.sort((a: any, b: any) => a.slug.localeCompare(b.slug));
  previewManifest.missing = (previewManifest.missing ?? []).filter((missing: any) => missing.slug !== slug);
  writeJson(previewManifestPath, previewManifest);
}

function priorIssueFor(startupAudit: any, slug: string) {
  if (priorStartupFailures[slug]) return priorStartupFailures[slug].issue;

  const book = startupAudit.books.find((candidate: any) => candidate.slug === slug);
  if (!book) return "No prior startup audit record found.";
  const parts = [`recommendation: ${book.recommendation}`];
  const first = book.firstDefaultGeneratedSection;
  if (first?.id) {
    parts.push(
      `first default: ${first.id} ${first.label ?? ""}${first.title ? ` - ${first.title}` : ""} (${first.wordCount ?? "unknown"} words)`,
    );
  }
  if (book.warnings?.length) parts.push(`warnings: ${book.warnings.join("; ")}`);
  return parts.join(" | ");
}

function summarizeSection(section: any) {
  return {
    id: section.sectionId,
    label: section.label,
    title: section.title,
    wordCount: section.wordCount,
  };
}

function writeProcessingNotes(
  filePath: string,
  slug: string,
  config: (typeof configs)[number],
  rawInfo: ReturnType<typeof readRawSource>,
  parseResult: ReturnType<typeof parseRaw>,
  sections: any[],
) {
  const firstDefault = sections.find((section) => section.includeByDefault) ?? sections[0];
  writeText(
    filePath,
    `# ${slug} startup generated-content correction\n\n` +
      "Generated by targeted pass `startup-generated-content-fixes-1`. This is not an all-book processing batch.\n\n" +
      `- Source used: \`${rawInfo.repoPath}\`\n` +
      `- Real start boundary: ${parseResult.startBoundary}\n` +
      `- Real end boundary: ${parseResult.endBoundary}\n` +
      `- Structure convention: ${config.structure}\n` +
      `- Sections written: ${sections.length}\n` +
      `- First default section: ${firstDefault?.label}${firstDefault?.title ? ` - ${firstDefault.title}` : ""}\n` +
      `- Cleanup actions:\n${config.cleanup.map((action) => `  - ${action}`).join("\n")}\n` +
      (rawInfo.declaredCandidateMissing
        ? `\nNote: the first declared source candidate \`${rawInfo.declaredCandidate}\` was missing, so this pass used the matching canonical temp-books source listed above.\n`
        : ""),
  );
}

function markdownReport(report: any) {
  const lines: string[] = [
    "# Startup Generated Content Fixes 1",
    "",
    `Generated at: ${report.generatedAt}`,
    "",
    "This targeted generated-content pass corrected only the six startup-preview audit failures. It did not process a new batch, did not touch raw source files, and did not touch Cloudflare exports.",
    "",
    "## Summary",
    "",
    `- Books reviewed: ${report.summary.booksReviewed}`,
    `- Books written: ${report.summary.booksWritten}`,
    `- Books skipped: ${report.summary.booksSkipped}`,
    `- Preview assets updated: ${report.summary.previewAssetsUpdated}`,
    "",
    "## Books",
    "",
    "| Slug | Result | Sections | First default after | Preview valid | Recommendation |",
    "| --- | --- | ---: | --- | --- | --- |",
  ];

  for (const book of report.books) {
    const first = book.firstDefaultSectionAfterCorrection;
    lines.push(
      `| ${book.slug} | ${book.written ? "written" : "skipped"} | ${book.sectionCount} | ${
        first ? `${first.label}${first.title ? ` - ${first.title}` : ""}` : "n/a"
      } | ${book.startupPreviewNowValid ? "yes" : "no"} | ${book.finalRecommendation} |`,
    );
  }

  for (const book of report.books) {
    lines.push("", `## ${book.slug}`, "");
    lines.push(`- Written or skipped: ${book.written ? "written" : "skipped"}`);
    if (book.reasonIfSkipped) lines.push(`- Reason if skipped: ${book.reasonIfSkipped}`);
    lines.push(`- Source file used: ${book.sourceFileUsed}`);
    lines.push(`- Prior startup audit issue: ${book.priorStartupAuditIssue}`);
    lines.push(`- Real start boundary used: ${book.realStartBoundaryUsed}`);
    lines.push(`- Real end boundary used: ${book.realEndBoundaryUsed}`);
    lines.push(`- Selected structural convention: ${book.selectedStructuralConvention}`);
    lines.push(
      `- First default before correction: ${
        book.firstDefaultSectionBeforeCorrection
          ? `${book.firstDefaultSectionBeforeCorrection.label}${
              book.firstDefaultSectionBeforeCorrection.title
                ? ` - ${book.firstDefaultSectionBeforeCorrection.title}`
                : ""
            } (${book.firstDefaultSectionBeforeCorrection.wordCount} words)`
          : "none"
      }`,
    );
    lines.push(
      `- First default after correction: ${
        book.firstDefaultSectionAfterCorrection
          ? `${book.firstDefaultSectionAfterCorrection.label}${
              book.firstDefaultSectionAfterCorrection.title
                ? ` - ${book.firstDefaultSectionAfterCorrection.title}`
                : ""
            } (${book.firstDefaultSectionAfterCorrection.wordCount} words)`
          : "none"
      }`,
    );
    lines.push(`- Section count: ${book.sectionCount}`);
    lines.push(`- Preview asset updated: ${book.previewAssetUpdated ? "yes" : "no"}`);
    lines.push(`- Startup preview now valid: ${book.startupPreviewNowValid ? "yes" : "no"}`);
    lines.push(`- Remaining warnings: ${book.remainingWarnings.length ? book.remainingWarnings.join("; ") : "none"}`);
    lines.push(`- Final recommendation: ${book.finalRecommendation}`);
    lines.push("", "First five sections:");
    for (const section of book.firstFiveSections) {
      lines.push(`- ${section.label}${section.title ? ` - ${section.title}` : ""}: ${section.wordCount} words`);
    }
    lines.push("", "Last five sections:");
    for (const section of book.lastFiveSections) {
      lines.push(`- ${section.label}${section.title ? ` - ${section.title}` : ""}: ${section.wordCount} words`);
    }
    lines.push("", "Cleanup actions applied:");
    for (const action of book.cleanupActionsApplied) lines.push(`- ${action}`);
  }

  return `${lines.join("\n")}\n`;
}

const startupAudit = readJson(startupAuditPath);
const reportBooks: any[] = [];

for (const config of configs) {
  if (!targetSlugs.has(config.slug)) throw new Error(`Unexpected target slug ${config.slug}`);

  const bookDir = assertInside(path.join(generatedRoot, config.slug), generatedRoot);
  const sectionsDir = assertInside(path.join(bookDir, "sections"), bookDir);
  const manifestPath = assertInside(path.join(bookDir, "manifest.json"), bookDir);
  const cleanedPath = assertInside(path.join(bookDir, "cleaned_book.json"), bookDir);
  const processedPath = assertInside(path.join(bookDir, "processed_book.json"), bookDir);
  const notesPath = assertInside(path.join(bookDir, "processing_notes.md"), bookDir);

  const previousManifest = readJson(manifestPath);
  const previousCleaned = readJson(cleanedPath);
  const previousProcessed = readJson(processedPath);
  const beforeFirstDefault =
    priorStartupFailures[config.slug]?.firstDefaultBefore ??
    firstDefaultDescription(previousManifest);
  const rawInfo = readRawSource(config);
  const rawText = rawInfo.text;
  const parseResult = parseRaw(config, rawText);
  const starts = lineStarts(rawText);
  const sectionCounters = new Map<string, number>();
  const sections = (parseResult.specs as any[]).map((spec: any, index: number) => {
    const kind = spec.kind ?? "chapter";
    const sectionNumber = (sectionCounters.get(kind) ?? 0) + 1;
    sectionCounters.set(kind, sectionNumber);
    return makeGeneratedSection(config.slug, rawText, starts, spec, index + 1, sectionNumber);
  });

  const warnings: string[] = [];
  const defaultSections = sections.filter((section) => section.includeByDefault);
  if (defaultSections.length < config.minSections) {
    warnings.push(`Parsed ${defaultSections.length} default sections, below expected minimum ${config.minSections}.`);
  }
  if (config.maxSections && defaultSections.length > config.maxSections) {
    warnings.push(`Parsed ${defaultSections.length} default sections, above expected maximum ${config.maxSections}.`);
  }
  if (sections.some((section) => section.wordCount < 2)) {
    warnings.push("One or more generated sections are extremely short and should be reviewed.");
  }
  if (rawInfo.declaredCandidateMissing) {
    warnings.push(`Declared source candidate ${rawInfo.declaredCandidate} was missing; used ${rawInfo.repoPath}.`);
  }

  const safeToWrite = warnings.every((warning) => warning.startsWith("Declared source candidate"));
  if (!safeToWrite) {
    reportBooks.push({
      slug: config.slug,
      written: false,
      reasonIfSkipped: warnings.join(" "),
      sourceFileUsed: rawInfo.repoPath,
      priorStartupAuditIssue: priorIssueFor(startupAudit, config.slug),
      realStartBoundaryUsed: parseResult.startBoundary,
      realEndBoundaryUsed: parseResult.endBoundary,
      selectedStructuralConvention: config.structure,
      firstDefaultSectionBeforeCorrection: beforeFirstDefault,
      firstDefaultSectionAfterCorrection: null,
      sectionCount: 0,
      firstFiveSections: [],
      lastFiveSections: [],
      cleanupActionsApplied: config.cleanup,
      previewAssetUpdated: false,
      startupPreviewNowValid: false,
      remainingWarnings: warnings,
      finalRecommendation: "skipped",
    });
    continue;
  }

  const contentHash = buildContentHash(config.slug, rawText, sections);
  const contentVersion = contentHash.slice(0, 16);
  const stats = {
    originalCharacterCount: rawText.length,
    cleanedCharacterCount: sections.reduce((sum, section) => sum + section.characterCount, 0),
    wordCount: sections.reduce((sum, section) => sum + section.wordCount, 0),
    sectionCount: sections.length,
    includedSectionCount: sections.filter((section) => section.includeByDefault).length,
  };

  fs.rmSync(sectionsDir, { recursive: true, force: true });
  fs.mkdirSync(sectionsDir, { recursive: true });
  for (const section of sections) {
    writeJson(path.join(sectionsDir, `${section.sectionId}.json`), section);
  }

  const sectionSummaries = sections.map((section) => ({
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
  }));

  const manifest = {
    ...previousManifest,
    contentVersion,
    contentHash,
    stats,
    sections: sectionSummaries,
    cleaning: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: stats.cleanedCharacterCount,
      headerStripped: true,
      footerStripped: true,
      confidence: "high",
      warnings,
    },
    warnings: Array.from(
      new Set([
        ...(previousManifest.warnings ?? []).filter(
          (warning: string) =>
            !/placeholder|no body text|missing source content|Reference source file produced no body text/i.test(warning),
        ),
        "Targeted startup generated-content correction pass rewrote generated sections from the inspected source boundary; raw source and Cloudflare export were not modified.",
        ...warnings,
      ]),
    ),
  };

  const cleanedBook = {
    ...previousCleaned,
    contentVersion,
    contentHash,
    stats,
    sections: sections.map((section) => ({
      id: section.sectionId,
      kind: section.kind,
      label: section.label,
      title: section.title,
      order: section.order,
      includeByDefault: section.includeByDefault,
      text: section.displayText,
      paragraphs: section.paragraphs,
      wordCount: section.wordCount,
      characterCount: section.characterCount,
      estimatedTypingMinutes: section.estimatedTypingMinutes,
      estimatedListeningMinutes: section.estimatedListeningMinutes,
    })),
  };

  const processedBook = {
    ...previousProcessed,
    content_version: contentVersion,
    content_hash: contentHash,
    content: {
      chapters: sections.filter((section) => section.includeByDefault).map((section, index) => ({
        chapter_number: index + 1,
        title: section.title ?? section.label,
        sections: [
          {
            section_number: 1,
            text: section.displayText,
            word_count: section.wordCount,
            character_count: section.characterCount,
            estimated_typing_minutes: section.estimatedTypingMinutes,
            estimated_listening_minutes: section.estimatedListeningMinutes,
          },
        ],
      })),
    },
  };

  writeJson(manifestPath, manifest);
  writeJson(cleanedPath, cleanedBook);
  writeJson(processedPath, processedBook);
  writeProcessingNotes(notesPath, config.slug, config, rawInfo, parseResult, sections);
  updateLibraryManifest(config.slug, manifest);

  const firstDefaultSection = sections.find((section) => section.includeByDefault) ?? sections[0];
  const previewAsset = buildPreviewAsset(config.slug, manifest, firstDefaultSection);
  updatePreviewManifest(config.slug, previewAsset);

  reportBooks.push({
    slug: config.slug,
    written: true,
    reasonIfSkipped: null,
    sourceFileUsed: rawInfo.declaredCandidateMissing
      ? `${rawInfo.repoPath} (declared ${rawInfo.declaredCandidate} was missing)`
      : rawInfo.repoPath,
    priorStartupAuditIssue: priorIssueFor(startupAudit, config.slug),
    realStartBoundaryUsed: parseResult.startBoundary,
    realEndBoundaryUsed: parseResult.endBoundary,
    selectedStructuralConvention: config.structure,
    firstDefaultSectionBeforeCorrection: beforeFirstDefault,
    firstDefaultSectionAfterCorrection: summarizeSection(firstDefaultSection),
    sectionCount: sections.length,
    firstFiveSections: sections.slice(0, 5).map(summarizeSection),
    lastFiveSections: sections.slice(-5).map(summarizeSection),
    cleanupActionsApplied: config.cleanup,
    previewAssetUpdated: true,
    startupPreviewNowValid:
      !/SOS Help|placeholder|reference file does not include body text|project gutenberg|contents/i.test(
        previewAsset.previewText.slice(0, 500),
      ) && previewAsset.previewText.trim().length > 40,
    remainingWarnings: warnings,
    finalRecommendation: warnings.length ? "needs manual review" : "accepted for review",
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  task: "Targeted generated-content correction for startup-preview audit failures",
  protectedPaths: {
    rawSourceInput: "app/client/assets/temp-books (read only)",
    generatedBooks: "app/client/assets/books/generated (only the six approved generated folders plus library manifest were written)",
    cloudflareExport: "app/client/assets/books/cloudflare-export (not modified)",
    previewAssets: "public/book-previews (only the six approved preview assets plus preview manifest were written)",
  },
  summary: {
    booksReviewed: reportBooks.length,
    booksWritten: reportBooks.filter((book) => book.written).length,
    booksSkipped: reportBooks.filter((book) => !book.written).length,
    previewAssetsUpdated: reportBooks.filter((book) => book.previewAssetUpdated).length,
  },
  books: reportBooks,
};

writeJson(path.join(reportRoot, "startup-generated-content-fixes-1.json"), report);
writeText(path.join(reportRoot, "startup-generated-content-fixes-1.md"), markdownReport(report));

console.log(
  JSON.stringify(
    {
      written: report.summary.booksWritten,
      skipped: report.summary.booksSkipped,
      report: path.relative(repoRoot, path.join(reportRoot, "startup-generated-content-fixes-1.json")).replace(/\\/g, "/"),
      books: reportBooks.map((book) => ({
        slug: book.slug,
        sections: book.sectionCount,
        first: book.firstDefaultSectionAfterCorrection,
        warnings: book.remainingWarnings,
      })),
    },
    null,
    2,
  ),
);
