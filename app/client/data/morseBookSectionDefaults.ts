import type {
  MorseBookManifest,
  MorseBookSectionKind,
  MorseBookSectionSummary,
} from "./morseBookTypes";

export const defaultReadableExcludedMorseBookSectionKinds =
  new Set<MorseBookSectionKind>([
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

export const mainMorseBookStructureLabelPattern =
  /^(chapter|part|book|volume|section)\b/i;

const asideDefaultNameExclusionPattern =
  /\b(table of contents|contents|list of illustrations|illustrations?|title page|copyright|license|source|publisher|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter)\b/;

const asideDefaultEvidenceExclusionPattern =
  /\b(project gutenberg|gutenberg|transcriber|produced by|production note|copyright|license|preface|introduction|footnotes?|notes?|appendix|bibliography|index|end matter)\b/;

function normalizedSectionText(
  ...parts: Array<string | null | undefined>
) {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function sectionEvidenceText(section: MorseBookSectionSummary) {
  return normalizedSectionText(
    section.label,
    section.title,
    section.textPreview,
  );
}

function sectionNameText(section: MorseBookSectionSummary) {
  return normalizedSectionText(section.label, section.title);
}

export function getMorseBookAsideSectionDisplayLabel(
  section: MorseBookSectionSummary,
) {
  const nameText = sectionNameText(section);
  const evidenceText = sectionEvidenceText(section);

  if (section.kind === "source-license") {
    return /\b(project gutenberg|gutenberg|license|copyright)\b/.test(
      evidenceText,
    )
      ? "License"
      : "Source note";
  }
  if (section.kind === "transcriber-note") return "Transcriber note";
  if (section.kind === "preface") return "Preface";
  if (section.kind === "introduction") return "Introduction";
  if (section.kind === "appendix") return "Appendix";
  if (section.kind === "notes") return "Notes";
  if (section.kind === "glossary") return "Glossary";
  if (section.kind === "index") return "Index";
  if (section.kind === "epilogue") return "End matter";

  if (/\b(project gutenberg|gutenberg license|license|copyright)\b/.test(evidenceText)) {
    return "License";
  }
  if (/\btranscriber\b/.test(evidenceText)) return "Transcriber note";
  if (/\bpublisher\b/.test(evidenceText)) return "Publisher note";
  if (/\bsource\b/.test(nameText)) return "Source note";
  if (/\b(table of contents|contents)\b/.test(nameText)) return "Contents";
  if (/\bpreface\b/.test(nameText)) return "Preface";
  if (/\bintroduction\b/.test(nameText)) return "Introduction";
  if (/\bappendix\b/.test(nameText)) return "Appendix";
  if (/\bfootnotes?\b/.test(nameText)) return "Footnotes";
  if (/\bnotes?\b/.test(nameText)) return "Notes";
  if (/\bbibliography\b/.test(nameText)) return "Bibliography";
  if (/\bindex\b/.test(nameText)) return "Index";
  if (/\bend matter\b/.test(nameText)) return "End matter";

  return null;
}

export function isDefaultReadableMorseBookSection(
  section: MorseBookSectionSummary,
) {
  if (defaultReadableExcludedMorseBookSectionKinds.has(section.kind)) {
    return false;
  }

  const nameText = sectionNameText(section);
  if (asideDefaultNameExclusionPattern.test(nameText)) return false;

  const labelText = sectionEvidenceText(section);
  if (asideDefaultEvidenceExclusionPattern.test(labelText)) return false;

  const earlySection = section.order <= 4;
  if (earlySection && section.wordCount < 35) return false;
  if (
    earlySection &&
    section.wordCount < 90 &&
    /\b(cover|frontispiece|by\s+[a-z]|published|copyright|all rights reserved)\b/.test(
      labelText,
    )
  ) {
    return false;
  }

  return section.wordCount > 0;
}

export function getDefaultMorseBookSectionIds(
  book: MorseBookManifest,
  fallbackSectionId: string,
) {
  const readable = book.sections
    .filter((section) => isDefaultReadableMorseBookSection(section))
    .map((section) => section.id);
  if (readable.length > 0) return readable;

  const included = book.sections
    .filter((section) => section.includeByDefault)
    .map((section) => section.id);
  return included.length > 0 ? included : [fallbackSectionId];
}

export function getDefaultMorseBookLiveSectionId(
  book: MorseBookManifest,
  fallbackSectionId: string,
) {
  return getDefaultMorseBookSectionIds(book, fallbackSectionId)[0] ?? fallbackSectionId;
}
