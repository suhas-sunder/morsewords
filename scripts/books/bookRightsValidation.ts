import fs from "node:fs";

import type {
  ApprovedPeopleMetadata,
  ApprovedPersonMetadata,
  ApprovedPersonRole,
  BookApprovalSource,
  BookMetadata,
  BookRightsReport,
  BookRightsRiskLevel,
  DuplicateResolutionSource,
  EnrichedAuthorityMetadata,
  GutenbergCleaningReport,
  OwnerBookApproval,
} from "./bookManifestTypes.ts";
import { APPROVED_PERSON_ROLES } from "./bookManifestTypes.ts";
import {
  enrichedOriginalPublicationYearFor,
  enrichedPersonDeathYearFor,
} from "./bookEnrichedMetadata.ts";

const PUBLISH_READY_RIGHTS = new Set([
  "public-domain-us",
  "public-domain",
  "licensed",
  "permission-granted",
]);

const CANADA_SAFE_DEATH_YEAR = 1971;
const US_PUBLIC_DOMAIN_PUBLICATION_YEAR = 1930;
const APPROVED_PERSON_ROLE_SET = new Set<string>(APPROVED_PERSON_ROLES);

export type ApprovedPeopleLoadResult = {
  people: ApprovedPeopleMetadata;
  errors: string[];
};

export type RightsValidationResult = {
  publishReady: boolean;
  warnings: string[];
};

type RightsReportInput = {
  metadata: BookMetadata;
  rawText: string;
  cleanedText: string;
  cleaning: GutenbergCleaningReport;
  approvedPeople?: ApprovedPeopleMetadata;
  ownerBookApproval?: OwnerBookApproval | null;
  enrichedMetadata?: EnrichedAuthorityMetadata;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugifyName(input: string): string {
  return normalizeName(input).replace(/\s+/g, "-");
}

function firstLineField(text: string, label: string): string {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^\\s*${escapedLabel}:\\s*(.+?)\\s*$`, "im");
  const match = text.match(pattern);
  return match?.[1]?.trim() ?? "";
}

function firstPattern(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
    if (match?.[0]) return match[0].trim();
  }
  return "";
}

function evidenceFor(text: string, pattern: RegExp, label: string): string | null {
  const match = pattern.exec(text);
  if (!match) return null;
  const start = Math.max(0, match.index - 80);
  const end = Math.min(text.length, match.index + match[0].length + 140);
  const snippet = text
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim();
  return `${label}: ${snippet.slice(0, 260)}`;
}

function addEvidence(
  snippets: string[],
  text: string,
  pattern: RegExp,
  label: string,
): boolean {
  const snippet = evidenceFor(text, pattern, label);
  if (!snippet) return false;
  if (!snippets.includes(snippet)) snippets.push(snippet);
  return true;
}

function parseYear(input: string): number | null {
  const match = input.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function cleanMetadataLine(input: string): string {
  return input
    .replace(/^\s*[\[_]+/, "")
    .replace(/[\]_]+\s*$/g, "")
    .replace(/_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDeathYearFromLifespan(input: string): number | null {
  const normalized = input.replace(/[\u2013\u2014]/g, "-");
  const patterns = [
    /\b(?:1[4-9]\d{2}|20\d{2})\s*(?:--|-|\u2013|\u2014|to)\s*((?:1[4-9]\d{2}|20\d{2}))\b/i,
    /\b(?:died|death year|d\.)\s*:?\s*((?:1[4-9]\d{2}|20\d{2}))\b/i,
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) return Number.parseInt(match[1], 10);
  }
  return null;
}

function cleanPersonNameFromField(input: string): string {
  return input
    .replace(/\s*(?:\(|\[)[^)\]]*\b(?:1[4-9]\d{2}|20\d{2})\s*(?:--|-|\u2013|\u2014|to)\s*(?:1[4-9]\d{2}|20\d{2})[^)\]]*(?:\)|\])\.?\s*$/i, "")
    .replace(/\s*\[[^\]]*\b(?:died|death year|d\.)\s*:?\s*(?:1[4-9]\d{2}|20\d{2})[^\]]*\]\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePersonField(rawValue: string): {
  name: string;
  deathYear: number | null;
} {
  const value = cleanMetadataLine(rawValue);
  return {
    name: cleanPersonNameFromField(value),
    deathYear: parseDeathYearFromLifespan(value),
  };
}

function approvedPersonFor(
  name: string,
  approvedPeople: ApprovedPeopleMetadata,
): ApprovedPersonMetadata | null {
  const wanted = normalizeName(name);
  const wantedSlug = slugifyName(name);
  for (const [slug, person] of Object.entries(approvedPeople)) {
    if (slug === wantedSlug || normalizeName(person.name) === wanted) {
      return person;
    }
  }
  return null;
}

function deathYearFromSource(text: string, name: string): number | null {
  const normalizedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const explicitPatterns = [
    new RegExp(
      `(?:death year|died|d\\.)\\s*:?\\s*((?:1[4-9]\\d{2}|20\\d{2}))`,
      "i",
    ),
    new RegExp(
      `${normalizedName}[^\\n]{0,120}\\((?:[^\\d)]*)(?:1[4-9]\\d{2}|20\\d{2})\\s*(?:--|-|\\u2013|\\u2014|to)\\s*((?:1[4-9]\\d{2}|20\\d{2}))\\)`,
      "i",
    ),
    new RegExp(
      `${normalizedName}[^\\n]{0,120}\\[(?:[^\\d\\]]*)(?:1[4-9]\\d{2}|20\\d{2})\\s*(?:--|-|\\u2013|\\u2014|to)\\s*((?:1[4-9]\\d{2}|20\\d{2}))[^\\]]*\\]`,
      "i",
    ),
    new RegExp(
      `${normalizedName}[^\\n]{0,120}\\b(?:1[4-9]\\d{2}|20\\d{2})\\s*(?:--|-|\\u2013|\\u2014|to)\\s*((?:1[4-9]\\d{2}|20\\d{2}))`,
      "i",
    ),
    new RegExp(`(?:death year|died)\\s*:?\\s*(\\d{4})`, "i"),
    new RegExp(`${normalizedName}[^\\n]{0,80}\\((?:[^\\d)]*)-(\\d{4})\\)`, "i"),
    new RegExp(`${normalizedName}[^\\n]{0,80}\\b\\d{4}\\s*[-\\u2013]\\s*(\\d{4})`, "i"),
  ];
  for (const pattern of explicitPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) return Number.parseInt(match[1], 10);
  }
  return null;
}

function resolveDeathYear(
  name: string,
  rawText: string,
  approvedPeople: ApprovedPeopleMetadata,
  sourceFieldValue = "",
  enrichedMetadata?: EnrichedAuthorityMetadata,
  role: ApprovedPersonRole = "author",
): number | null {
  const approved = approvedPersonFor(name, approvedPeople);
  if (typeof approved?.deathYear === "number") return approved.deathYear;
  const fieldDeathYear = parseDeathYearFromLifespan(sourceFieldValue);
  if (fieldDeathYear !== null) return fieldDeathYear;
  const sourceDeathYear = deathYearFromSource(rawText.slice(0, 12_000), name);
  if (sourceDeathYear !== null) return sourceDeathYear;
  return enrichedMetadata
    ? enrichedPersonDeathYearFor(name, role, enrichedMetadata)?.deathYear ?? null
    : null;
}

function isCanadaLifePlus70Safe(
  name: string,
  deathYear: number | null,
  approvedPeople: ApprovedPeopleMetadata,
  enrichedMetadata?: EnrichedAuthorityMetadata,
  role: ApprovedPersonRole = "author",
): boolean {
  const approved = approvedPersonFor(name, approvedPeople);
  if (approved?.canadaLifePlus70Safe === true) return true;
  if (
    enrichedMetadata &&
    enrichedPersonDeathYearFor(name, role, enrichedMetadata)?.deathYear ===
      deathYear
  ) {
    return true;
  }
  return typeof deathYear === "number" && deathYear <= CANADA_SAFE_DEATH_YEAR;
}

function sourceUrlFromGutenbergId(gutenbergId: string | null | undefined) {
  return gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null;
}

function getGutenbergId(rawText: string, metadata: BookMetadata): string {
  if (metadata.source.gutenbergId) return metadata.source.gutenbergId;
  return firstPattern(rawText, [
    /\[(?:eBook|EBook)\s+#(\d+)\]/i,
    /Project Gutenberg (?:eBook|EBook).*?#(\d+)/i,
    /(?:www\.)?gutenberg\.org\/ebooks\/(\d+)/i,
  ]);
}

function sourceProviderIsProjectGutenberg(
  rawText: string,
  metadata: BookMetadata,
): boolean {
  return (
    metadata.source.provider === "Project Gutenberg" ||
    /Project Gutenberg eBook|Project Gutenberg EBook|gutenberg\.org\/ebooks\//i.test(
      rawText.slice(0, 20_000),
    )
  );
}

export function getProjectGutenbergSourceUrl(
  gutenbergId: string | null | undefined,
) {
  return sourceUrlFromGutenbergId(gutenbergId);
}

export function loadApprovedPeopleMetadata(
  filePath: string,
): ApprovedPeopleLoadResult {
  if (!fs.existsSync(filePath)) {
    return { people: {}, errors: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return {
      people: {},
      errors: [
        `Approved metadata could not be parsed: ${
          error instanceof Error ? error.message : "unknown JSON error"
        }`,
      ],
    };
  }

  if (!isPlainObject(parsed)) {
    return { people: {}, errors: ["Approved metadata must be an object."] };
  }

  const people: ApprovedPeopleMetadata = {};
  const errors: string[] = [];
  for (const [slug, value] of Object.entries(parsed)) {
    const label = `approved-metadata.${slug}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.push(`${label} key must be lowercase kebab-case.`);
    }
    if (!isPlainObject(value)) {
      errors.push(`${label} must be an object.`);
      continue;
    }
    if (typeof value.name !== "string" || value.name.trim() === "") {
      errors.push(`${label}.name must be a non-empty string.`);
    }
    if (
      value.deathYear !== null &&
      (typeof value.deathYear !== "number" ||
        !Number.isInteger(value.deathYear) ||
        value.deathYear < 1400 ||
        value.deathYear > 2100)
    ) {
      errors.push(`${label}.deathYear must be an integer year or null.`);
    }
    if (
      value.canadaLifePlus70Safe !== undefined &&
      typeof value.canadaLifePlus70Safe !== "boolean"
    ) {
      errors.push(`${label}.canadaLifePlus70Safe must be a boolean when present.`);
    }
    if (
      value.roles !== undefined &&
      (!Array.isArray(value.roles) ||
        value.roles.some((role) => typeof role !== "string" || !APPROVED_PERSON_ROLE_SET.has(role)))
    ) {
      errors.push(
        `${label}.roles must be an array of approved person roles when present.`,
      );
    }
    if (
      value.sources !== undefined &&
      (!Array.isArray(value.sources) ||
        value.sources.some((source) => typeof source !== "string"))
    ) {
      errors.push(`${label}.sources must be an array of strings when present.`);
    }
    if (typeof value.notes !== "string") {
      errors.push(`${label}.notes must be a string.`);
    }
    if (errors.length === 0 || !errors.some((error) => error.startsWith(label))) {
      people[slug] = {
        name: String(value.name),
        deathYear:
          typeof value.deathYear === "number" ? value.deathYear : null,
        canadaLifePlus70Safe:
          typeof value.canadaLifePlus70Safe === "boolean"
            ? value.canadaLifePlus70Safe
            : undefined,
        roles: Array.isArray(value.roles)
          ? value.roles.filter(
              (role): role is ApprovedPersonRole =>
                typeof role === "string" && APPROVED_PERSON_ROLE_SET.has(role),
            )
          : undefined,
        sources: Array.isArray(value.sources)
          ? value.sources.filter(
              (source): source is string => typeof source === "string",
            )
          : undefined,
        notes: typeof value.notes === "string" ? value.notes : "",
      };
    }
  }

  return { people, errors };
}

function riskAtLeastMedium(risk: BookRightsRiskLevel): boolean {
  return risk === "medium" || risk === "high";
}

function getReleaseDate(rawText: string, metadata: BookMetadata): string {
  return (
    metadata.source.releaseDate ??
    metadata.scaffold?.extracted.releaseDate ??
    firstPattern(rawText, [
      /^\s*Release date:\s*(.+?)(?:\s*\[(?:eBook|EBook)\s+#\d+\])?\s*$/im,
      /^\s*Release Date:\s*(.+?)(?:\s*\[(?:eBook|EBook)\s+#\d+\])?\s*$/im,
    ])
  );
}

function getLastUpdated(rawText: string): string {
  return firstPattern(rawText, [
    /^\s*Most recently updated:\s*(.+?)\s*$/im,
    /^\s*Last updated:\s*(.+?)\s*$/im,
    /^\s*Updated:\s*(.+?)\s*$/im,
  ]);
}

function getOriginalPublicationEvidence(
  rawText: string,
  metadata: BookMetadata,
  enrichedMetadata?: EnrichedAuthorityMetadata,
): { value: string; source: "file" | "metadata" | "external-authority" | "missing" } {
  const explicitLine =
    firstPattern(rawText, [
      /^\s*Original publication:\s*(.+?)\s*$/im,
      /^\s*First published:\s*(.+?)\s*$/im,
      /^\s*Published:\s*(.+?)\s*$/im,
      /^\s*\[?_*First published(?:\s+in)?_*\s*[,.:]?\s*(.+?)\]?\s*$/im,
    ]);
  const fileValue =
    cleanMetadataLine(explicitLine) ||
    metadata.scaffold?.extracted.originalPublication ||
    "";
  if (fileValue) return { value: fileValue, source: "file" };
  if (metadata.originalPublicationYear) {
    return {
      value: String(metadata.originalPublicationYear),
      source: "metadata",
    };
  }
  const enrichedWork = enrichedOriginalPublicationYearFor(
    metadata.slug,
    metadata.title,
    enrichedMetadata ?? {
      schemaVersion: 1,
      generatedAt: "",
      people: [],
      works: [],
    },
  );
  if (enrichedWork) {
    return {
      value: String(enrichedWork.originalPublicationYear),
      source: "external-authority",
    };
  }
  return { value: "", source: "missing" };
}

function originalPublicationYear(reportValue: string): number | null {
  return parseYear(reportValue);
}

function titleHasTrademarkRisk(title: string, subjects: string[], rawText: string) {
  return /\b(tarzan|buck rogers|zorro|conan)\b/i.test(
    `${title} ${subjects.join(" ")} ${rawText.slice(0, 4_000)}`,
  );
}

function contentBrandRisk(title: string, subjects: string[], rawText: string) {
  return /\b(uncle remus|plantation|racial|racist|slavery|minstrel|negro|dialect)\b/i.test(
    `${title} ${subjects.join(" ")} ${rawText.slice(0, 8_000)}`,
  );
}

export function buildBookRightsReport({
  metadata,
  rawText,
  cleanedText,
  cleaning,
  approvedPeople = {},
  ownerBookApproval = null,
  enrichedMetadata,
}: RightsReportInput): BookRightsReport {
  const evidence: string[] = [];
  const title = cleanMetadataLine(
    firstLineField(rawText, "Title") ||
      metadata.scaffold?.extracted.title ||
      metadata.title,
  );
  const authorField =
    firstLineField(rawText, "Author") ||
    metadata.scaffold?.extracted.author ||
    metadata.author.join(", ");
  const parsedAuthor = parsePersonField(authorField);
  const author = parsedAuthor.name || metadata.author.join(", ");
  const language = cleanMetadataLine(
    firstLineField(rawText, "Language") ||
      metadata.scaffold?.extracted.language ||
      metadata.language,
  );
  const releaseDate = getReleaseDate(rawText, metadata);
  const lastUpdated =
    getLastUpdated(rawText) || metadata.scaffold?.extracted.lastUpdated || "";
  const originalPublicationEvidence = getOriginalPublicationEvidence(
    rawText,
    metadata,
    enrichedMetadata,
  );
  const originalPublication = originalPublicationEvidence.value;
  const gutenbergId = getGutenbergId(rawText, metadata);
  const sourceUrl = sourceUrlFromGutenbergId(gutenbergId);
  const rawTextUrl = metadata.source.rawTextUrl ?? null;
  const credits = firstLineField(rawText, "Credits");
  const translatorField =
    firstLineField(rawText, "Translator") ||
    metadata.scaffold?.extracted.translator ||
    firstPattern(rawText, [/Translated by\s+([^\n.]+)/i]);
  const parsedTranslator = translatorField
    ? parsePersonField(translatorField)
    : { name: "", deathYear: null };
  const translator = parsedTranslator.name;
  const illustrator = cleanMetadataLine(
    firstLineField(rawText, "Illustrator") ||
      metadata.scaffold?.extracted.illustrator ||
      "",
  );
  const editorField =
    firstLineField(rawText, "Editor") ||
    metadata.scaffold?.extracted.editor ||
    firstPattern(rawText, [/Edited by\s+([^\n.]+)/i]);
  const editor = editorField ? parsePersonField(editorField).name : "";
  const introductionAuthor = firstPattern(rawText, [
    /Introduction by\s+([^\n.]+)/i,
    /Introductory note by\s+([^\n.]+)/i,
  ]);
  const authorDeathYear =
    parsedAuthor.deathYear ??
    resolveDeathYear(
      author,
      rawText,
      approvedPeople,
      authorField,
      enrichedMetadata,
      "author",
    );
  const translatorDeathYear = translator
    ? parsedTranslator.deathYear ??
      resolveDeathYear(
        translator,
        rawText,
        approvedPeople,
        translatorField,
        enrichedMetadata,
      "translator",
    )
    : null;
  const localAuthorDeathYear =
    parsedAuthor.deathYear ??
    approvedPersonFor(author, approvedPeople)?.deathYear ??
    deathYearFromSource(rawText.slice(0, 12_000), author);
  const localTranslatorDeathYear = translator
    ? parsedTranslator.deathYear ??
      approvedPersonFor(translator, approvedPeople)?.deathYear ??
      deathYearFromSource(rawText.slice(0, 12_000), translator)
    : null;

  const authorAuthorityFact = enrichedMetadata
    ? enrichedPersonDeathYearFor(author, "author", enrichedMetadata)
    : null;
  const translatorAuthorityFact =
    translator && enrichedMetadata
      ? enrichedPersonDeathYearFor(translator, "translator", enrichedMetadata)
      : null;
  const workAuthorityFact = enrichedMetadata
    ? enrichedOriginalPublicationYearFor(metadata.slug, metadata.title, enrichedMetadata)
    : null;
  if (
    authorAuthorityFact &&
    localAuthorDeathYear === null &&
    authorDeathYear === authorAuthorityFact.deathYear
  ) {
    evidence.push(`Author death year authority: ${authorAuthorityFact.sourceSummary}`);
  }
  if (
    translatorAuthorityFact &&
    localTranslatorDeathYear === null &&
    translatorDeathYear === translatorAuthorityFact.deathYear
  ) {
    evidence.push(
      `Translator death year authority: ${translatorAuthorityFact.sourceSummary}`,
    );
  }
  if (
    workAuthorityFact &&
    originalPublicationEvidence.source === "external-authority"
  ) {
    evidence.push(
      `Original publication authority: ${workAuthorityFact.sourceSummary}`,
    );
  }

  const gutenbergHeaderPresent = cleaning.headerStripped;
  const projectGutenbergLicensePresent = addEvidence(
    evidence,
    rawText,
    /Project Gutenberg License|START: FULL LICENSE|Project Gutenberg-tm License/i,
    "Gutenberg license",
  );
  const usReuseLanguageFound = addEvidence(
    evidence,
    rawText,
    /use of anyone anywhere in the United States|copy it, give it away or re-use it|reuse it under the terms of the Project Gutenberg License/i,
    "U.S. reuse language",
  );
  const nonUsWarningFound = addEvidence(
    evidence,
    rawText,
    /If you are not located in the United States|not protected by U\.S\. copyright law|check the laws of your country/i,
    "Non-U.S. warning",
  );
  const containsTranscriberNotes = addEvidence(
    evidence,
    rawText,
    /transcriber(?:'|')?s note|transcription notes/i,
    "Transcriber note",
  );
  const transcriberNotesInCleanedText =
    /transcriber(?:'|')?s note|transcription notes/i.test(cleanedText);
  const containsIllustrationsOrImageReferences = addEvidence(
    evidence,
    rawText,
    /\[Illustration\]|\[Image|cover image|\.jpg|\.png|illustrated by/i,
    "Illustration or image reference",
  );
  const containsLaterCopyrightNotice = addEvidence(
    evidence,
    rawText,
    /copyright(?:ed)?\s*(?:\u00a9|\(c\))?\s*(?:19[3-9]\d|20\d{2})|all rights reserved/i,
    "Later copyright notice",
  );
  const containsCreativeCommonsLicense = addEvidence(
    evidence,
    rawText,
    /Creative Commons|CC BY|CC-BY/i,
    "Creative Commons notice",
  );
  const containsPermissionBasedLanguage = addEvidence(
    evidence,
    rawText,
    /used by permission|reproduced by permission|by special permission|permission granted by|with permission from/i,
    "Permission-based language",
  );
  const containsModernIntroOrNotes = addEvidence(
    evidence,
    rawText,
    /modern introduction|editorial notes?|annotated edition|introduction by|introductory note by|critical notes?/i,
    "Modern introduction or notes",
  );
  const editionRisk = /millennium fulcrum edition|annotated edition|critical edition|modern edition/i.test(
    rawText.slice(0, 20_000),
  )
    ? "medium"
    : "none";
  if (editionRisk !== "none") {
    addEvidence(
      evidence,
      rawText,
      /millennium fulcrum edition|annotated edition|critical edition|modern edition/i,
      "Edition risk",
    );
  }

  const isTranslation =
    Boolean(translator) ||
    /translated by|translation/i.test(rawText.slice(0, 20_000)) ||
    !/^(en|eng|english)$/i.test(language.trim());
  const translationRisk: BookRightsRiskLevel = isTranslation
    ? translator &&
      isCanadaLifePlus70Safe(
        translator,
        translatorDeathYear,
        approvedPeople,
        enrichedMetadata,
        "translator",
      )
      ? "low"
      : "medium"
    : "none";
  const trademarkRisk: BookRightsRiskLevel = titleHasTrademarkRisk(
    title,
    metadata.subjects,
    rawText,
  )
    ? "high"
    : "none";
  const contentRisk: BookRightsRiskLevel = contentBrandRisk(
    title,
    metadata.subjects,
    rawText,
  )
    ? "medium"
    : "none";

  if (trademarkRisk !== "none") {
    evidence.push("Trademark/character brand risk: title or source metadata matched a known brand-risk term.");
  }
  if (contentRisk !== "none") {
    evidence.push("Content brand-safety risk: title, subjects, or source text matched a review term.");
  }

  const evidenceReasons: string[] = [];
  const manualReviewReasons: string[] = [];
  const ownerPathReasons: string[] = [];
  const blockers: string[] = [];
  const sourceIsGutenberg = sourceProviderIsProjectGutenberg(rawText, metadata);
  const authorCanadaSafe = isCanadaLifePlus70Safe(
    author,
    authorDeathYear,
    approvedPeople,
    enrichedMetadata,
    "author",
  );
  const publicationYear = originalPublicationYear(originalPublication);
  const usPublicationSafe =
    typeof publicationYear === "number" &&
    publicationYear <= US_PUBLIC_DOMAIN_PUBLICATION_YEAR;
  const ownerReviewedApprovalPresent =
    ownerBookApproval?.ownerReviewed === true &&
    ownerBookApproval.approvedForWebsite === true;
  const ownerRegionsSafe =
    ownerBookApproval?.approvedRegions.includes("US") === true &&
    ownerBookApproval.approvedRegions.includes("CA") === true;

  if (!sourceIsGutenberg) blockers.push("Source provider is not Project Gutenberg.");
  if (!gutenbergId) evidenceReasons.push("Missing Project Gutenberg ID in metadata or source file.");
  if (!gutenbergHeaderPresent) evidenceReasons.push("Project Gutenberg start marker was not found.");
  if (!projectGutenbergLicensePresent) {
    evidenceReasons.push("Project Gutenberg license/reuse language was not detected.");
  }
  if (!usReuseLanguageFound) evidenceReasons.push("U.S. reuse language was not detected.");
  if (!nonUsWarningFound) evidenceReasons.push("Non-U.S. rights warning was not detected.");
  if (!title) evidenceReasons.push("Title was not found.");
  if (!author) evidenceReasons.push("Author was not found.");
  if (!language) evidenceReasons.push("Language was not found.");
  if (!releaseDate) evidenceReasons.push("Release date was not found.");
  if (!originalPublication) evidenceReasons.push("Original publication metadata was not found.");
  if (!usPublicationSafe) {
    evidenceReasons.push("Original publication year is missing or not before 1931.");
  }
  if (authorDeathYear === null) {
    evidenceReasons.push("Author death year is missing from approved metadata or clear source metadata.");
  } else if (!authorCanadaSafe) {
    evidenceReasons.push("Author death year is not Canada life-plus-70 safe under the project rule.");
  }
  if (!metadata.source.rightsReviewed) ownerPathReasons.push("Metadata rightsReviewed is false.");
  if (!ownerBookApproval || ownerBookApproval.ownerReviewed !== true) {
    ownerPathReasons.push("Owner-reviewed book approval is missing.");
  } else {
    if (!ownerBookApproval.approvedForWebsite) {
      ownerPathReasons.push("Owner-reviewed book approval does not allow website use.");
    }
    if (!ownerRegionsSafe) {
      ownerPathReasons.push("Owner-reviewed book approval must include US and CA regions.");
    }
  }
  if (!PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis)) {
    ownerPathReasons.push(`Rights basis "${metadata.source.rightsBasis}" is not publish-ready.`);
  }
  if (containsLaterCopyrightNotice) blockers.push("Later copyright notice was detected.");
  if (containsCreativeCommonsLicense) blockers.push("Creative Commons notice was detected.");
  if (containsPermissionBasedLanguage) {
    blockers.push("Permission-based reuse language was detected.");
  }
  if (containsModernIntroOrNotes) {
    manualReviewReasons.push("Modern introduction, notes, or editorial material may be present.");
  }
  if (transcriberNotesInCleanedText) {
    manualReviewReasons.push("Transcriber notes remain in cleaned story text.");
  }
  if (containsIllustrationsOrImageReferences) {
    manualReviewReasons.push("Illustrations or image references need manual handling.");
  }
  if (riskAtLeastMedium(translationRisk)) {
    manualReviewReasons.push("Translation status or translator death year needs manual review.");
  }
  if (riskAtLeastMedium(editionRisk)) {
    manualReviewReasons.push("Edition or editorial status needs manual review.");
  }
  if (riskAtLeastMedium(trademarkRisk)) {
    manualReviewReasons.push("Trademark or character brand risk needs manual review.");
  }
  if (riskAtLeastMedium(contentRisk)) {
    manualReviewReasons.push("Content brand-safety risk needs manual review.");
  }

  const commonEvidencePassed =
    blockers.length === 0 &&
    sourceIsGutenberg &&
    evidenceReasons.length === 0 &&
    manualReviewReasons.length === 0;
  const ownerReviewedPathApproved =
    commonEvidencePassed &&
    metadata.source.rightsReviewed &&
    PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis) &&
    ownerReviewedApprovalPresent &&
    ownerRegionsSafe;
  const externalAuthorityEvidenceUsed =
    (authorAuthorityFact !== null &&
      localAuthorDeathYear === null &&
      authorDeathYear === authorAuthorityFact.deathYear) ||
    (translatorAuthorityFact !== null &&
      localTranslatorDeathYear === null &&
      translatorDeathYear === translatorAuthorityFact.deathYear) ||
    originalPublicationEvidence.source === "external-authority";
  const fileEvidencePathApproved =
    commonEvidencePassed &&
    originalPublicationEvidence.source === "file" &&
    !externalAuthorityEvidenceUsed;
  const externalAuthorityPathApproved =
    commonEvidencePassed &&
    externalAuthorityEvidenceUsed &&
    (originalPublicationEvidence.source === "file" ||
      originalPublicationEvidence.source === "external-authority");
  const approvalSource: BookApprovalSource = ownerReviewedPathApproved
    ? "owner-reviewed"
    : fileEvidencePathApproved
      ? "file-evidence"
      : externalAuthorityPathApproved
        ? "external-authority"
        : "manual-review";
  const status =
    blockers.length > 0 || !sourceIsGutenberg
      ? "reject"
      : ownerReviewedPathApproved ||
          fileEvidencePathApproved ||
          externalAuthorityPathApproved
        ? "approved"
        : "needs_manual_review";
  const approvedForWebsite =
    status === "approved" &&
    (approvalSource === "file-evidence" ||
      approvalSource === "external-authority" ||
      ownerReviewedApprovalPresent);
  const approvedRegions =
    approvalSource === "file-evidence" ||
    approvalSource === "external-authority"
      ? ["US", "CA"]
      : ownerBookApproval?.approvedRegions ?? [];
  const duplicateResolutionSource: DuplicateResolutionSource = "not-needed";

  const reasoningSummary =
    status === "approved"
      ? approvalSource === "file-evidence"
        ? "Project Gutenberg source-file evidence satisfied the conservative website processing gate."
        : approvalSource === "external-authority"
          ? "Project Gutenberg source-file evidence and high-confidence external authority metadata satisfied the conservative website processing gate."
          : "Project Gutenberg source, owner-reviewed metadata, and conservative rights checks passed."
      : [
          ...blockers,
          ...evidenceReasons,
          ...manualReviewReasons,
          ...ownerPathReasons,
        ].join(" ");

  return {
    schemaVersion: 1,
    title,
    author,
    author_death_year: authorDeathYear,
    language,
    original_publication: originalPublication,
    release_date: releaseDate,
    last_updated: lastUpdated,
    source: metadata.source.provider,
    gutenberg_ebook_number: gutenbergId,
    source_url: sourceUrl,
    raw_text_url: rawTextUrl,
    gutenberg_header_present: gutenbergHeaderPresent,
    project_gutenberg_license_present: projectGutenbergLicensePresent,
    us_reuse_language_found: usReuseLanguageFound,
    non_us_warning_found: nonUsWarningFound,
    credits,
    translator,
    translator_death_year: translatorDeathYear,
    illustrator,
    editor,
    introduction_author: introductionAuthor,
    contains_modern_intro_or_notes: containsModernIntroOrNotes,
    contains_transcriber_notes: containsTranscriberNotes,
    contains_illustrations_or_image_references: containsIllustrationsOrImageReferences,
    contains_later_copyright_notice: containsLaterCopyrightNotice,
    contains_creative_commons_license: containsCreativeCommonsLicense,
    contains_permission_based_language: containsPermissionBasedLanguage,
    is_translation: isTranslation,
    translation_risk: translationRisk,
    edition_risk: editionRisk,
    trademark_or_character_brand_risk: trademarkRisk,
    content_brand_safety_risk: contentRisk,
    owner_reviewed_approval_present: ownerReviewedApprovalPresent,
    approved_for_website: approvedForWebsite,
    approved_for_youtube_narration:
      ownerBookApproval?.approvedForYoutubeNarration === true,
    approved_regions: approvedRegions,
    approval_source: approvalSource,
    duplicate_resolution_source: duplicateResolutionSource,
    canada_us_v1_status: status,
    reasoning_summary: reasoningSummary,
    evidence_snippets: evidence.slice(0, 20),
    processing_allowed: status === "approved",
  };
}

export function validateBookRights(
  metadata: BookMetadata,
  rightsReport: BookRightsReport,
): RightsValidationResult {
  const warnings: string[] = [];
  const approvalSource = rightsReport.approval_source ?? "manual-review";
  const fileEvidenceApproval = approvalSource === "file-evidence";
  const externalAuthorityApproval = approvalSource === "external-authority";
  const authorityApproval =
    fileEvidenceApproval || externalAuthorityApproval;
  const ownerReviewedApproval = approvalSource === "owner-reviewed";

  if (!metadata.source.gutenbergId && !rightsReport.gutenberg_ebook_number) {
    warnings.push("Missing Project Gutenberg ID.");
  }

  if (!authorityApproval && !metadata.source.rightsReviewed) {
    warnings.push("Rights have not been reviewed; generated book is not publish-ready.");
  }

  if (!authorityApproval && !PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis)) {
    warnings.push(`Rights basis "${metadata.source.rightsBasis}" is not publish-ready.`);
  }

  if (rightsReport.canada_us_v1_status !== "approved") {
    warnings.push(
      `Rights gate status is ${rightsReport.canada_us_v1_status}; generated book is not publish-ready.`,
    );
  }

  if (!rightsReport.processing_allowed) {
    warnings.push("Rights gate did not allow processed public story output.");
  }

  if (!authorityApproval && !rightsReport.owner_reviewed_approval_present) {
    warnings.push("Owner-reviewed website approval is missing.");
  }

  if (!rightsReport.approved_for_website) {
    warnings.push("Website publication is not allowed by the active approval path.");
  }

  const sharedGateReady =
    rightsReport.canada_us_v1_status === "approved" &&
    rightsReport.processing_allowed &&
    rightsReport.approved_for_website;
  const ownerPathReady =
    ownerReviewedApproval &&
    metadata.source.rightsReviewed &&
    PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis) &&
    rightsReport.owner_reviewed_approval_present;
  const fileEvidencePathReady = fileEvidenceApproval;
  const externalAuthorityPathReady = externalAuthorityApproval;

  return {
    publishReady:
      sharedGateReady &&
      (ownerPathReady || fileEvidencePathReady || externalAuthorityPathReady),
    warnings,
  };
}
