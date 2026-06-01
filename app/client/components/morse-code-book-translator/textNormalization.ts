import {
  getUnsupportedTextCharacters,
  textToMorse,
} from "~/client/components/shared/morseUtils";

import {
  CLEANED_PREVIEW_LIMIT,
  type CleanupOptions,
  type CustomCleanupRule,
  type CustomCleanupRuleMatch,
  ensureTextLength,
  MORSE_PREVIEW_INPUT_LIMIT,
  type BookSourceSection,
  type ParsedBookSource,
  type PreflightSummary,
} from "./bookSourceTypes";

const UTF8_BOM = /^\uFEFF/;
const ZERO_WIDTH_AND_SOFT_HYPHEN = /[\u00AD\u200B-\u200D\u2060\uFEFF]/g;
const REPEATED_BLANK_LINES = /\n{3,}/g;
const SMART_PUNCTUATION: Array<[RegExp, string]> = [
  [/[\u2018\u2019\u201A\u201B]/g, "'"],
  [/[\u201C\u201D\u201E\u201F]/g, '"'],
  [/[\u2010-\u2015\u2212]/g, "-"],
  [/\u2026/g, "..."],
];
const SIMPLIFY_PUNCTUATION: Array<[RegExp, string]> = [
  [/[\[\{]/g, "("],
  [/[\]\}]/g, ")"],
  [/[\u2022\u2043\u2219]/g, "-"],
  [/[\\|]/g, "/"],
  [/[~`^]/g, ""],
  [/[#$%*<>]/g, ""],
];
const WORD_BOUNDARY_CHARACTER = /[\p{L}\p{N}_]/u;

export function decodeUtf8(bytes: ArrayBuffer) {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

export function normalizePlainText(input: string) {
  return input
    .replace(UTF8_BOM, "")
    .replace(/\u00A0/g, " ")
    .replace(/\t/g, "  ")
    .replace(ZERO_WIDTH_AND_SOFT_HYPHEN, "")
    .replace(/\r\n|\r/g, "\n")
    .replace(/[ \f\v]+$/gm, "")
    .replace(REPEATED_BLANK_LINES, "\n\n")
    .trim();
}

function applyReplacementList(
  text: string,
  replacements: Array<[RegExp, string]>,
) {
  return replacements.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    text,
  );
}

function stripGutenbergBounds(text: string) {
  const startPattern =
    /\*\*\*\s*START OF (?:THIS|THE) PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i;
  const endPattern =
    /\*\*\*\s*END OF (?:THIS|THE) PROJECT GUTENBERG EBOOK[\s\S]*$/i;
  let next = text;
  let removed = 0;

  const startMatch = next.match(startPattern);
  if (startMatch?.index !== undefined) {
    const cutEnd = startMatch.index + startMatch[0].length;
    removed += cutEnd;
    next = next.slice(cutEnd);
  }

  const endMatch = next.match(endPattern);
  if (endMatch?.index !== undefined) {
    removed += next.length - endMatch.index;
    next = next.slice(0, endMatch.index);
  }

  return {
    text: normalizePlainText(next),
    removed,
  };
}

export function applyCleanupOptions(
  sourceText: string,
  options: CleanupOptions,
  customRules: CustomCleanupRule[] = [],
) {
  const warnings: string[] = [];
  let cleaned = normalizePlainText(sourceText);

  if (options.normalizeSmartPunctuation) {
    cleaned = applyReplacementList(cleaned, SMART_PUNCTUATION);
  }

  if (options.stripZeroWidthAndSoftHyphen) {
    const before = cleaned.length;
    cleaned = cleaned.replace(ZERO_WIDTH_AND_SOFT_HYPHEN, "");
    const removed = before - cleaned.length;
    if (removed > 0) {
      warnings.push(
        `Removed ${removed.toLocaleString()} zero-width or soft-hyphen character${
          removed === 1 ? "" : "s"
        }.`,
      );
    }
  }

  if (options.stripGutenbergHeaderFooter) {
    const result = stripGutenbergBounds(cleaned);
    cleaned = result.text;
    if (result.removed > 0) {
      warnings.push(
        `Removed about ${result.removed.toLocaleString()} Project Gutenberg header/footer character${
          result.removed === 1 ? "" : "s"
        }.`,
      );
    } else {
      warnings.push(
        "No Project Gutenberg header or footer markers were found.",
      );
    }
  }

  if (options.simplifyPunctuation) {
    const before = cleaned;
    cleaned = applyReplacementList(cleaned, SIMPLIFY_PUNCTUATION);
    const removed = before.length - cleaned.length;
    if (removed > 0) {
      warnings.push(
        `Simplified punctuation removed ${removed.toLocaleString()} unsupported symbol${
          removed === 1 ? "" : "s"
        }.`,
      );
    }
  }

  const customResult = applyCustomCleanupRules(cleaned, customRules);
  cleaned = customResult.text;

  cleaned = normalizePlainText(cleaned);
  ensureTextLength(cleaned);

  return {
    cleanedText: cleaned,
    cleanupWarnings: warnings,
    customRuleMatches: customResult.matches,
  };
}

export function buildCleanedSourceSections(
  parsed: ParsedBookSource,
  options: CleanupOptions,
  customRules: CustomCleanupRule[] = [],
): BookSourceSection[] {
  const sections = parsed.sections ?? [];
  if (sections.length === 0) return [];

  let cursor = 0;
  const cleanedSections: BookSourceSection[] = [];

  sections.forEach((section) => {
    const cleaned = applyCleanupOptions(
      section.rawText,
      options,
      customRules,
    ).cleanedText;
    if (!cleaned) return;
    const startOffset = cursor;
    cursor += cleaned.length;
    const endOffset = cursor;
    cursor += 2;
    cleanedSections.push({
      title: section.title,
      sourceLabel: section.sourceLabel,
      rawText: cleaned,
      startOffset,
      endOffset,
    });
  });

  return cleanedSections;
}

function countWords(text: string) {
  const matches = text.trim().match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu);
  return matches?.length ?? 0;
}

function excerpt(text: string, limit: number) {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}...` : text;
}

export function buildPreflightSummary(
  parsed: ParsedBookSource,
  options: CleanupOptions,
  customRules: CustomCleanupRule[] = [],
): PreflightSummary {
  const { cleanedText, cleanupWarnings, customRuleMatches } =
    applyCleanupOptions(parsed.rawText, options, customRules);
  const unsupportedCounts = getUnsupportedTextCharacters(cleanedText);
  const unsupportedCharacters = Object.entries(unsupportedCounts)
    .map(([character, count]) => ({ character, count }))
    .sort((a, b) => b.count - a.count || a.character.localeCompare(b.character))
    .slice(0, 8);
  const unsupportedCount = Object.values(unsupportedCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  const morsePreviewResult = textToMorse(
    cleanedText.slice(0, MORSE_PREVIEW_INPUT_LIMIT),
    {
      wordSeparator: "slash",
      returnResult: true,
    },
  );

  return {
    sourceType: parsed.sourceType,
    filename: parsed.filename,
    title: parsed.title,
    author: parsed.author,
    pageCount: parsed.pageCount,
    sectionCount: parsed.sectionCount,
    cleanedText,
    cleanedPreview: excerpt(cleanedText, CLEANED_PREVIEW_LIMIT),
    morsePreview: excerpt(morsePreviewResult.value, CLEANED_PREVIEW_LIMIT),
    wordCount: countWords(cleanedText),
    characterCount: cleanedText.length,
    unsupportedCount,
    unsupportedCharacters,
    extractionWarnings: parsed.warnings,
    cleanupWarnings,
    customRuleMatches,
  };
}

export function applyCustomCleanupRules(
  sourceText: string,
  rules: CustomCleanupRule[],
): { text: string; matches: CustomCleanupRuleMatch[] } {
  let next = sourceText;
  const matches: CustomCleanupRuleMatch[] = [];

  rules.forEach((rule) => {
    const find = rule.find;
    const active = rule.enabled && find.trim().length > 0;
    if (!active) {
      matches.push({ id: rule.id, count: 0, active: false });
      return;
    }

    const result = replacePlainText(next, {
      find,
      replacement: rule.replacement,
      caseSensitive: rule.caseSensitive,
      wholeWord: rule.wholeWord,
    });
    next = result.text;
    matches.push({ id: rule.id, count: result.count, active: true });
  });

  return { text: next, matches };
}

function replacePlainText(
  text: string,
  options: {
    find: string;
    replacement: string;
    caseSensitive: boolean;
    wholeWord: boolean;
  },
) {
  const needle = options.find;
  if (!needle) return { text, count: 0 };

  const haystack = options.caseSensitive ? text : text.toLocaleLowerCase();
  const searchNeedle = options.caseSensitive
    ? needle
    : needle.toLocaleLowerCase();
  const chunks: string[] = [];
  let searchFrom = 0;
  let appendFrom = 0;
  let count = 0;

  while (searchFrom < text.length) {
    const index = haystack.indexOf(searchNeedle, searchFrom);
    if (index === -1) break;
    const end = index + needle.length;

    if (options.wholeWord && !hasWordBoundaries(text, index, end)) {
      searchFrom = index + Math.max(needle.length, 1);
      continue;
    }

    chunks.push(text.slice(appendFrom, index), options.replacement);
    appendFrom = end;
    searchFrom = end;
    count += 1;
  }

  if (count === 0) return { text, count };
  chunks.push(text.slice(appendFrom));
  return { text: chunks.join(""), count };
}

function hasWordBoundaries(text: string, start: number, end: number) {
  const before = start > 0 ? text[start - 1] : "";
  const after = end < text.length ? text[end] : "";
  return !isWordCharacter(before) && !isWordCharacter(after);
}

function isWordCharacter(value: string) {
  return value ? WORD_BOUNDARY_CHARACTER.test(value) : false;
}
