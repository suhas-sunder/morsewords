export type MorseBookStartupPreviewSectionEvidence = {
  kind: string;
  label?: string | null;
  title?: string | null;
  order: number;
  wordCount: number;
  textPreview?: string | null;
};

const excludedSectionKinds = new Set([
  "title-page",
  "dedication",
  "epigraph",
  "preface",
  "introduction",
  "epilogue",
  "appendix",
  "notes",
  "glossary",
  "index",
  "transcriber-note",
  "source-license",
  "advertisement",
]);

const excludedSectionNamePattern =
  /\b(table of contents|contents|list of illustrations|title page|copyright|license|source note|publisher|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter)\b/i;

const placeholderPattern =
  /\b(SOS\s+Help!?|type text here|reference file does not include body text|book route is available|missing source content|generic placeholder|placeholder content)\b/i;

const sourceBoilerplatePattern =
  /(?:\*{3}\s*)?(?:start|end) of (?:this|the) project gutenberg|project gutenberg(?:'s)? (?:ebook|license)|(?:^|\n)\s*(?:produced by|production notes?|source notes?|transcriber(?:'s)? notes?|release date\s*:|distributed proofreading)/i;

const anchoredFrontMatterPattern =
  /(?:^|\n)\s*(?:title page|copyright|all rights reserved|list of illustrations)\b/i;

const narrativeStartMarkers: Readonly<Record<string, string>> = {
  "a-christmas-carol": "Marley was dead: to begin with.",
  "dr-jekyll-and-mr-hyde": "Mr. Utterson the lawyer was a man",
  "the-great-gatsby": "In my younger and more vulnerable years",
  "the-leavenworth-case": "I had been a junior partner",
};

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function normalizedSectionName(
  section: MorseBookStartupPreviewSectionEvidence,
) {
  return [section.label, section.title]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function looksLikeMorseBookContentsListing(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const match = /\b(?:table of )?contents\b/i.exec(normalized);
  if (!match) return false;
  if (countWords(normalized.slice(0, match.index)) > 24) return false;

  const sample = normalized.slice(
    match.index + match[0].length,
    match.index + match[0].length + 260,
  );
  return (
    /\b(?:chapter|stave|story|search|incident|case|letter|narrative|statement|book|part|volume)\b/i.test(
      sample,
    ) ||
    /(?:\b[IVXLCDM]{1,6}\b[\s,.;:-]*){3,}/.test(sample)
  );
}

export function isValidMorseBookStartupPreviewText(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (placeholderPattern.test(trimmed)) return false;

  const start = trimmed.slice(0, 900);
  if (sourceBoilerplatePattern.test(start)) return false;
  if (anchoredFrontMatterPattern.test(start)) return false;
  if (looksLikeMorseBookContentsListing(start)) return false;

  const preface = /(?:^|\n)\s*PREFACE(?:\s|$)/.exec(start);
  if (preface && countWords(start.slice(0, preface.index)) <= 20) return false;

  return true;
}

export function isStructurallyReadableMorseBookStartupSection(
  section: MorseBookStartupPreviewSectionEvidence,
) {
  if (excludedSectionKinds.has(section.kind)) return false;
  if (excludedSectionNamePattern.test(normalizedSectionName(section))) {
    return false;
  }
  if (section.wordCount <= 0) return false;
  if (section.order <= 4 && section.wordCount < 35) return false;

  const evidence = section.textPreview ?? "";
  if (placeholderPattern.test(evidence) || sourceBoilerplatePattern.test(evidence)) {
    return false;
  }
  if (
    section.order <= 4 &&
    section.wordCount < 90 &&
    /\b(cover|frontispiece|by\s+[a-z]|published|copyright|all rights reserved)\b/i.test(
      `${normalizedSectionName(section)} ${evidence}`,
    )
  ) {
    return false;
  }
  return true;
}

export function getMorseBookStartupPreviewSourceText(
  slug: string,
  sourceText: string,
) {
  const text = sourceText.trim();
  const marker = narrativeStartMarkers[slug];
  if (!marker) return text;
  const start = text.toLowerCase().indexOf(marker.toLowerCase());
  return start >= 0 ? text.slice(start).trim() : text;
}
