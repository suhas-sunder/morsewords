import fs from "node:fs";

import type {
  ApprovedPeopleMetadata,
  ApprovedPersonMetadata,
  ApprovedPersonRole,
  BookMetadata,
  BookRightsReport,
  BookRightsRiskLevel,
  GutenbergCleaningReport,
  OwnerBookApproval,
} from "./bookManifestTypes.ts";
import { APPROVED_PERSON_ROLES } from "./bookManifestTypes.ts";

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
  const pattern = new RegExp(`^${label}:\\s*(.+?)\\s*$`, "im");
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
    new RegExp(`(?:death year|died)\\s*:?\\s*(\\d{4})`, "i"),
    new RegExp(`${normalizedName}[^\\n]{0,80}\\((?:[^\\d)]*)-(\\d{4})\\)`, "i"),
    new RegExp(`${normalizedName}[^\\n]{0,80}\\b\\d{4}\\s*[-–]\\s*(\\d{4})`, "i"),
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
): number | null {
  const approved = approvedPersonFor(name, approvedPeople);
  if (typeof approved?.deathYear === "number") return approved.deathYear;
  return deathYearFromSource(rawText.slice(0, 12_000), name);
}

function isCanadaLifePlus70Safe(
  name: string,
  deathYear: number | null,
  approvedPeople: ApprovedPeopleMetadata,
): boolean {
  const approved = approvedPersonFor(name, approvedPeople);
  if (approved?.canadaLifePlus70Safe === true) return true;
  return typeof deathYear === "number" && deathYear <= CANADA_SAFE_DEATH_YEAR;
}

function sourceUrlFromGutenbergId(gutenbergId: string | null | undefined) {
  return gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null;
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
    firstPattern(rawText, [
      /^Release date:\s*(.+?)(?:\s*\[(?:eBook|EBook)\s+#\d+\])?\s*$/im,
      /^Release Date:\s*(.+?)(?:\s*\[(?:eBook|EBook)\s+#\d+\])?\s*$/im,
    ])
  );
}

function getLastUpdated(rawText: string): string {
  return firstPattern(rawText, [
    /^Most recently updated:\s*(.+?)\s*$/im,
    /^Last updated:\s*(.+?)\s*$/im,
    /^Updated:\s*(.+?)\s*$/im,
  ]);
}

function getOriginalPublication(rawText: string, metadata: BookMetadata): string {
  return (
    firstPattern(rawText, [
      /^Original publication:\s*(.+?)\s*$/im,
      /^First published:\s*(.+?)\s*$/im,
      /^Published:\s*(.+?)\s*$/im,
    ]) || (metadata.originalPublicationYear ? String(metadata.originalPublicationYear) : "")
  );
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
}: RightsReportInput): BookRightsReport {
  const evidence: string[] = [];
  const title = firstLineField(rawText, "Title") || metadata.title;
  const author = firstLineField(rawText, "Author") || metadata.author.join(", ");
  const language = firstLineField(rawText, "Language") || metadata.language;
  const releaseDate = getReleaseDate(rawText, metadata);
  const lastUpdated = getLastUpdated(rawText);
  const originalPublication = getOriginalPublication(rawText, metadata);
  const gutenbergId = metadata.source.gutenbergId ?? "";
  const sourceUrl = sourceUrlFromGutenbergId(metadata.source.gutenbergId);
  const rawTextUrl = metadata.source.rawTextUrl ?? null;
  const credits = firstLineField(rawText, "Credits");
  const translator =
    firstLineField(rawText, "Translator") ||
    firstPattern(rawText, [/Translated by\s+([^\n.]+)/i]);
  const illustrator = firstLineField(rawText, "Illustrator");
  const editor =
    firstLineField(rawText, "Editor") ||
    firstPattern(rawText, [/Edited by\s+([^\n.]+)/i]);
  const introductionAuthor = firstPattern(rawText, [
    /Introduction by\s+([^\n.]+)/i,
    /Introductory note by\s+([^\n.]+)/i,
  ]);
  const authorDeathYear = resolveDeathYear(author, rawText, approvedPeople);
  const translatorDeathYear = translator
    ? resolveDeathYear(translator, rawText, approvedPeople)
    : null;

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
    /copyright(?:ed)?\s*(?:©|\(c\))?\s*(?:19[3-9]\d|20\d{2})|all rights reserved/i,
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
    ? translator && isCanadaLifePlus70Safe(translator, translatorDeathYear, approvedPeople)
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

  const reasons: string[] = [];
  const blockers: string[] = [];
  const sourceIsGutenberg = metadata.source.provider === "Project Gutenberg";
  const authorCanadaSafe = isCanadaLifePlus70Safe(
    author,
    authorDeathYear,
    approvedPeople,
  );
  const publicationYear = originalPublicationYear(originalPublication);
  const usPublicationSafe =
    typeof publicationYear === "number" &&
    publicationYear <= US_PUBLIC_DOMAIN_PUBLICATION_YEAR;

  if (!sourceIsGutenberg) blockers.push("Source provider is not Project Gutenberg.");
  if (!metadata.source.gutenbergId) reasons.push("Missing metadata Gutenberg ID.");
  if (!gutenbergHeaderPresent) reasons.push("Project Gutenberg start marker was not found.");
  if (!projectGutenbergLicensePresent) {
    reasons.push("Project Gutenberg license/reuse language was not detected.");
  }
  if (!usReuseLanguageFound) reasons.push("U.S. reuse language was not detected.");
  if (!nonUsWarningFound) reasons.push("Non-U.S. rights warning was not detected.");
  if (!title) reasons.push("Title was not found.");
  if (!author) reasons.push("Author was not found.");
  if (!language) reasons.push("Language was not found.");
  if (!releaseDate) reasons.push("Release date was not found.");
  if (!originalPublication) reasons.push("Original publication metadata was not found.");
  if (!usPublicationSafe) {
    reasons.push("Original publication year is missing or not before 1931.");
  }
  if (authorDeathYear === null) {
    reasons.push("Author death year is missing from approved metadata or clear source metadata.");
  } else if (!authorCanadaSafe) {
    reasons.push("Author death year is not Canada life-plus-70 safe under the project rule.");
  }
  if (!metadata.source.rightsReviewed) reasons.push("Metadata rightsReviewed is false.");
  if (!ownerBookApproval || ownerBookApproval.ownerReviewed !== true) {
    reasons.push("Owner-reviewed book approval is missing.");
  } else {
    if (!ownerBookApproval.approvedForWebsite) {
      reasons.push("Owner-reviewed book approval does not allow website use.");
    }
    if (
      !ownerBookApproval.approvedRegions.includes("US") ||
      !ownerBookApproval.approvedRegions.includes("CA")
    ) {
      reasons.push("Owner-reviewed book approval must include US and CA regions.");
    }
  }
  if (!PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis)) {
    reasons.push(`Rights basis "${metadata.source.rightsBasis}" is not publish-ready.`);
  }
  if (containsLaterCopyrightNotice) blockers.push("Later copyright notice was detected.");
  if (containsCreativeCommonsLicense) blockers.push("Creative Commons notice was detected.");
  if (containsPermissionBasedLanguage) {
    blockers.push("Permission-based reuse language was detected.");
  }
  if (containsModernIntroOrNotes) {
    reasons.push("Modern introduction, notes, or editorial material may be present.");
  }
  if (transcriberNotesInCleanedText) {
    reasons.push("Transcriber notes remain in cleaned story text.");
  }
  if (containsIllustrationsOrImageReferences) {
    reasons.push("Illustrations or image references need manual handling.");
  }
  if (riskAtLeastMedium(translationRisk)) {
    reasons.push("Translation status or translator death year needs manual review.");
  }
  if (riskAtLeastMedium(editionRisk)) {
    reasons.push("Edition or editorial status needs manual review.");
  }
  if (riskAtLeastMedium(trademarkRisk)) {
    reasons.push("Trademark or character brand risk needs manual review.");
  }
  if (riskAtLeastMedium(contentRisk)) {
    reasons.push("Content brand-safety risk needs manual review.");
  }

  const status =
    blockers.length > 0 || !sourceIsGutenberg
      ? "reject"
      : reasons.length > 0
        ? "needs_manual_review"
        : "approved";

  const reasoningSummary =
    status === "approved"
      ? "Project Gutenberg source, approved metadata, and conservative rights checks passed."
      : [...blockers, ...reasons].join(" ");

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
    owner_reviewed_approval_present:
      ownerBookApproval?.ownerReviewed === true &&
      ownerBookApproval.approvedForWebsite === true,
    approved_for_website: ownerBookApproval?.approvedForWebsite === true,
    approved_for_youtube_narration:
      ownerBookApproval?.approvedForYoutubeNarration === true,
    approved_regions: ownerBookApproval?.approvedRegions ?? [],
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

  if (!metadata.source.gutenbergId) {
    warnings.push("Missing Project Gutenberg ID.");
  }

  if (!metadata.source.rightsReviewed) {
    warnings.push("Rights have not been reviewed; generated book is not publish-ready.");
  }

  if (!PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis)) {
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

  if (!rightsReport.owner_reviewed_approval_present) {
    warnings.push("Owner-reviewed website approval is missing.");
  }

  if (!rightsReport.approved_for_website) {
    warnings.push("Owner approval does not allow website use.");
  }

  return {
    publishReady:
      metadata.source.rightsReviewed &&
      PUBLISH_READY_RIGHTS.has(metadata.source.rightsBasis) &&
      rightsReport.canada_us_v1_status === "approved" &&
      rightsReport.processing_allowed &&
      rightsReport.owner_reviewed_approval_present &&
      rightsReport.approved_for_website,
    warnings,
  };
}
