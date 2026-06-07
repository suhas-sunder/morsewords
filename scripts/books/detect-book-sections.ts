import type {
  BookMetadata,
  BookSectionKind,
  BookSectionOverride,
  DetectedBookSection,
} from "./bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type SectionBoundary = {
  offset: number;
  kind: BookSectionKind;
  label: string;
  title: string | null;
  confidence: "high" | "medium" | "low";
  source: "detected" | "override" | "fallback";
};

export type DetectBookSectionsResult = {
  sections: DetectedBookSection[];
  warnings: string[];
};

const MAX_FALLBACK_SECTION_CHARS = 30_000;

const WORD_NUMBERS: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  ELEVEN: 11,
  TWELVE: 12,
  THIRTEEN: 13,
  FOURTEEN: 14,
  FIFTEEN: 15,
  SIXTEEN: 16,
  SEVENTEEN: 17,
  EIGHTEEN: 18,
  NINETEEN: 19,
  TWENTY: 20,
};

const CHAPTER_ORDINAL_PATTERN =
  "(?:[ivxlcdm]+|\\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)";
const DIVISION_ORDINAL_PATTERN = "(?:[ivxlcdm]+|\\d+)";

const SPECIAL_HEADINGS: Array<[RegExp, BookSectionKind, string]> = [
  [/^preface$/i, "preface", "Preface"],
  [/^introduction$/i, "introduction", "Introduction"],
  [/^prologue$/i, "prologue", "Prologue"],
  [/^epilogue$/i, "epilogue", "Epilogue"],
  [/^appendix\b/i, "appendix", "Appendix"],
  [/^notes?$/i, "notes", "Notes"],
  [/^transcriber(?:'|’)?s note/i, "transcriber-note", "Transcriber's Note"],
  [/^project gutenberg license/i, "source-license", "Project Gutenberg License"],
  [/^contents$/i, "title-page", "Contents"],
];

function parseRomanNumeral(input: string): number | null {
  const roman = input.toUpperCase();
  if (!/^[IVXLCDM]+$/.test(roman)) return null;
  if (
    !/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(
      roman,
    )
  ) {
    return null;
  }

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

  for (let index = roman.length - 1; index >= 0; index -= 1) {
    const value = values[roman[index]] ?? 0;
    if (value < previous) total -= value;
    else total += value;
    previous = value;
  }

  return total > 0 ? total : null;
}

function parseOrdinal(raw: string): number | null {
  const clean = raw.replace(/[.:-]/g, "").trim().toUpperCase();
  if (/^\d+$/.test(clean)) return Number.parseInt(clean, 10);
  if (WORD_NUMBERS[clean]) return WORD_NUMBERS[clean];
  return parseRomanNumeral(clean);
}

function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function classifyHeading(line: string): Omit<SectionBoundary, "offset"> | null {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (!normalized || normalized.length > 96) return null;

  const chapterMatch = normalized.match(
    new RegExp(
      `^chapter\\s+(${CHAPTER_ORDINAL_PATTERN})(?:\\s*(?::|--|-|\\.)\\s*(.*)|\\s*)$`,
      "i",
    ),
  );
  if (chapterMatch) {
    const ordinal = parseOrdinal(chapterMatch[1]) ?? 0;
    const title = chapterMatch[2]?.trim() || null;
    return {
      kind: "chapter",
      label: ordinal > 0 ? `Chapter ${ordinal}` : toTitleCase(normalized),
      title,
      confidence: "high",
      source: "detected",
    };
  }

  const partMatch = normalized.match(
    new RegExp(
      `^part\\s+(${DIVISION_ORDINAL_PATTERN})(?:\\s*(?::|--|-|\\.)\\s*(.*)|\\s*)$`,
      "i",
    ),
  );
  if (partMatch) {
    const ordinal = parseOrdinal(partMatch[1]) ?? 0;
    return {
      kind: "part",
      label: ordinal > 0 ? `Part ${ordinal}` : toTitleCase(normalized),
      title: partMatch[2]?.trim() || null,
      confidence: "high",
      source: "detected",
    };
  }

  const bookMatch = normalized.match(
    new RegExp(
      `^book\\s+(${DIVISION_ORDINAL_PATTERN})(?:\\s*(?::|--|-|\\.)\\s*(.*)|\\s*)$`,
      "i",
    ),
  );
  if (bookMatch) {
    const ordinal = parseOrdinal(bookMatch[1]) ?? 0;
    return {
      kind: "book",
      label: ordinal > 0 ? `Book ${ordinal}` : toTitleCase(normalized),
      title: bookMatch[2]?.trim() || null,
      confidence: "high",
      source: "detected",
    };
  }

  const romanOnly = normalized.match(/^([ivxlcdm]+)\.$/i);
  if (romanOnly) {
    const ordinal = parseRomanNumeral(romanOnly[1]) ?? 0;
    return {
      kind: "chapter",
      label: ordinal > 0 ? `Chapter ${ordinal}` : normalized,
      title: null,
      confidence: "low",
      source: "detected",
    };
  }

  for (const [pattern, kind, label] of SPECIAL_HEADINGS) {
    if (pattern.test(normalized)) {
      return {
        kind,
        label,
        title: null,
        confidence: "medium",
        source: "detected",
      };
    }
  }

  return null;
}

function getLineStarts(text: string): Array<{ line: string; offset: number }> {
  const lines: Array<{ line: string; offset: number }> = [];
  let offset = 0;

  for (const line of text.split("\n")) {
    lines.push({ line, offset });
    offset += line.length + 1;
  }

  return lines;
}

function isLikelyContentsEntry(
  lines: Array<{ line: string; offset: number }>,
  index: number,
): boolean {
  const nextHeadings = lines
    .slice(index + 1, index + 5)
    .filter(({ line }) => classifyHeading(line.trim())?.kind === "chapter");

  return nextHeadings.length >= 2;
}

function discoverBoundaries(text: string): SectionBoundary[] {
  const lines = getLineStarts(text);
  const boundaries: SectionBoundary[] = [];
  let inContents = false;
  let blankStreak = 0;

  lines.forEach(({ line, offset }, index) => {
    if (line.trim() === "") {
      blankStreak += 1;
      if (blankStreak >= 2) inContents = false;
      return;
    }
    blankStreak = 0;

    const trimmed = line.trim();
    const heading = classifyHeading(trimmed);
    if (!heading) return;
    if (inContents && heading.kind === "chapter") return;
    if (heading.kind === "chapter" && line !== line.trimStart()) return;
    if (heading.kind === "chapter" && isLikelyContentsEntry(lines, index)) return;
    if (heading.kind === "title-page" && heading.label === "Contents") {
      inContents = true;
    }

    boundaries.push({ offset, ...heading });
  });

  return boundaries;
}

function applyForceBoundaries(
  text: string,
  boundaries: SectionBoundary[],
  overrides: BookSectionOverride[],
  warnings: string[],
): SectionBoundary[] {
  const forced = [...boundaries];

  for (const override of overrides) {
    if (override.type !== "force-boundary") continue;
    const offset =
      typeof override.offset === "number"
        ? override.offset
        : override.markerText
          ? text.indexOf(override.markerText)
          : -1;

    if (offset < 0 || offset >= text.length) {
      warnings.push("Section override force-boundary did not match the source text.");
      continue;
    }

    forced.push({
      offset,
      kind: override.kind ?? "unknown",
      label: override.label ?? "Manual section",
      title: override.title ?? null,
      confidence: "high",
      source: "override",
    });
  }

  return forced.sort((a, b) => a.offset - b.offset);
}

function includeByDefault(kind: BookSectionKind, metadata: BookMetadata): boolean {
  if (metadata.defaults.excludeKinds.includes(kind)) return false;
  if (metadata.defaults.includeKinds.length === 0) return true;
  return metadata.defaults.includeKinds.includes(kind);
}

function sectionIdFor(
  kind: BookSectionKind,
  counters: Map<BookSectionKind, number>,
): string {
  const next = (counters.get(kind) ?? 0) + 1;
  counters.set(kind, next);
  return `${kind}-${String(next).padStart(3, "0")}`;
}

function buildSection(
  text: string,
  boundary: SectionBoundary,
  endOffset: number,
  order: number,
  counters: Map<BookSectionKind, number>,
  metadata: BookMetadata,
): DetectedBookSection | null {
  const rawText = text.slice(boundary.offset, endOffset);
  const sectionText = trimBookText(rawText);
  if (!sectionText) return null;

  return {
    id: sectionIdFor(boundary.kind, counters),
    kind: boundary.kind,
    label: boundary.label,
    title: boundary.title,
    order,
    includeByDefault: includeByDefault(boundary.kind, metadata),
    sourceStartOffset: boundary.offset,
    sourceEndOffset: endOffset,
    characterCount: sectionText.length,
    wordCount: countBookWords(sectionText),
    morseCharacterEstimate: estimateMorseCharacters(sectionText),
    textPreview: textPreview(sectionText),
    text: sectionText,
  };
}

function chunkFallbackSections(
  text: string,
  metadata: BookMetadata,
): DetectedBookSection[] {
  const sections: DetectedBookSection[] = [];
  const counters = new Map<BookSectionKind, number>();
  let start = 0;
  let order = 1;

  while (start < text.length) {
    const desiredEnd = Math.min(text.length, start + MAX_FALLBACK_SECTION_CHARS);
    const paragraphBreak = text.lastIndexOf("\n\n", desiredEnd);
    const end =
      paragraphBreak > start + 1_000 && paragraphBreak < text.length
        ? paragraphBreak
        : desiredEnd;

    const section = buildSection(
      text,
      {
        offset: start,
        kind: "unknown",
        label: `Part ${order}`,
        title: null,
        confidence: "low",
        source: "fallback",
      },
      end,
      order,
      counters,
      metadata,
    );
    if (section) sections.push({ ...section, id: `part-${String(order).padStart(3, "0")}` });

    start = end;
    while (text[start] === "\n") start += 1;
    order += 1;
  }

  return sections;
}

function applyPostOverrides(
  sections: DetectedBookSection[],
  overrides: BookSectionOverride[],
  warnings: string[],
): DetectedBookSection[] {
  let nextSections = [...sections];

  for (const override of overrides) {
    if (override.type === "rename-section") {
      nextSections = nextSections.map((section) =>
        section.id === override.sectionId
          ? {
              ...section,
              label: override.label ?? section.label,
              title:
                Object.prototype.hasOwnProperty.call(override, "title")
                  ? (override.title ?? null)
                  : section.title,
            }
          : section,
      );
    }

    if (override.type === "change-kind") {
      nextSections = nextSections.map((section) =>
        section.id === override.sectionId
          ? {
              ...section,
              kind: override.kind,
              includeByDefault:
                override.includeByDefault ?? section.includeByDefault,
            }
          : section,
      );
    }

    if (override.type === "set-include") {
      nextSections = nextSections.map((section) =>
        section.id === override.sectionId
          ? { ...section, includeByDefault: override.includeByDefault }
          : section,
      );
    }

    if (override.type === "merge-sections") {
      const selected = nextSections.filter((section) =>
        override.sectionIds.includes(section.id),
      );
      if (selected.length < 2) {
        warnings.push("Section override merge-sections needs at least two matching sections.");
        continue;
      }

      const first = selected[0];
      const mergedText = selected.map((section) => section.text).join("\n\n");
      const merged: DetectedBookSection = {
        ...first,
        id: override.id ?? first.id,
        kind: override.kind ?? first.kind,
        label: override.label ?? first.label,
        title: override.title ?? first.title,
        sourceEndOffset: selected[selected.length - 1].sourceEndOffset,
        characterCount: mergedText.length,
        wordCount: countBookWords(mergedText),
        morseCharacterEstimate: estimateMorseCharacters(mergedText),
        textPreview: textPreview(mergedText),
        text: mergedText,
      };
      const selectedIds = new Set(override.sectionIds);
      nextSections = nextSections.flatMap((section) =>
        section.id === first.id
          ? [merged]
          : selectedIds.has(section.id)
            ? []
            : [section],
      );
    }

    if (override.type === "split-section") {
      const index = nextSections.findIndex(
        (section) => section.id === override.sectionId,
      );
      if (index < 0) {
        warnings.push("Section override split-section did not match a section.");
        continue;
      }

      const section = nextSections[index];
      const splitOffset =
        typeof override.offset === "number"
          ? override.offset - section.sourceStartOffset
          : override.markerText
            ? section.text.indexOf(override.markerText)
            : -1;

      if (splitOffset <= 0 || splitOffset >= section.text.length) {
        warnings.push("Section override split-section did not find a safe split point.");
        continue;
      }

      const firstText = trimBookText(section.text.slice(0, splitOffset));
      const secondText = trimBookText(section.text.slice(splitOffset));
      const second: DetectedBookSection = {
        ...section,
        id: override.newSectionId ?? `${section.id}-split`,
        kind: override.kind ?? section.kind,
        label: override.label ?? `${section.label} continued`,
        title: override.title ?? section.title,
        sourceStartOffset: section.sourceStartOffset + splitOffset,
        characterCount: secondText.length,
        wordCount: countBookWords(secondText),
        morseCharacterEstimate: estimateMorseCharacters(secondText),
        textPreview: textPreview(secondText),
        text: secondText,
      };
      nextSections.splice(
        index,
        1,
        {
          ...section,
          sourceEndOffset: section.sourceStartOffset + splitOffset,
          characterCount: firstText.length,
          wordCount: countBookWords(firstText),
          morseCharacterEstimate: estimateMorseCharacters(firstText),
          textPreview: textPreview(firstText),
          text: firstText,
        },
        second,
      );
    }
  }

  return nextSections.map((section, index) => ({ ...section, order: index + 1 }));
}

export function detectBookSections(
  cleanedText: string,
  metadata: BookMetadata,
): DetectBookSectionsResult {
  const text = trimBookText(cleanedText);
  const warnings: string[] = [];
  let boundaries = discoverBoundaries(text);
  boundaries = applyForceBoundaries(
    text,
    boundaries,
    metadata.sectionOverrides,
    warnings,
  );

  const hasBodyStartAtZero = boundaries.some((boundary) => boundary.offset === 0);
  if (boundaries.length > 0 && boundaries[0].offset > 0 && !hasBodyStartAtZero) {
    boundaries.unshift({
      offset: 0,
      kind: "title-page",
      label: "Opening section",
      title: null,
      confidence: "medium",
      source: "detected",
    });
  }

  if (!boundaries.some((boundary) => boundary.kind === "chapter")) {
    warnings.push("No chapter headings were detected; generated fallback parts instead.");
    return {
      sections: chunkFallbackSections(text, metadata),
      warnings,
    };
  }

  const counters = new Map<BookSectionKind, number>();
  const sections: DetectedBookSection[] = [];

  boundaries.forEach((boundary, index) => {
    const endOffset = boundaries[index + 1]?.offset ?? text.length;
    const section = buildSection(
      text,
      boundary,
      endOffset,
      sections.length + 1,
      counters,
      metadata,
    );
    if (section) sections.push(section);
  });

  const nonEmptySections = applyPostOverrides(
    sections.filter((section) => section.characterCount > 0),
    metadata.sectionOverrides,
    warnings,
  );
  const ids = new Set<string>();
  for (const section of nonEmptySections) {
    if (ids.has(section.id)) {
      warnings.push(`Duplicate section id detected after overrides: ${section.id}.`);
    }
    ids.add(section.id);
  }

  return { sections: nonEmptySections, warnings };
}
