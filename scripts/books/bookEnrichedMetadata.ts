import fs from "node:fs";

import type {
  ApprovedPersonRole,
  EnrichedAuthorityMetadata,
  EnrichedPersonMetadata,
  EnrichedWorkMetadata,
} from "./bookManifestTypes.ts";
import {
  APPROVED_PERSON_ROLES,
  AUTHORITY_EVIDENCE_CONFIDENCE_VALUES,
  AUTHORITY_EVIDENCE_SOURCE_TYPES,
} from "./bookManifestTypes.ts";

export type EnrichedMetadataLoadResult = {
  metadata: EnrichedAuthorityMetadata;
  errors: string[];
  warnings: string[];
};

export type EnrichedPersonFact = {
  person: EnrichedPersonMetadata;
  deathYear: number;
  sourceSummary: string;
};

export type EnrichedWorkFact = {
  work: EnrichedWorkMetadata;
  originalPublicationYear: number;
  sourceSummary: string;
};

const EMPTY_ENRICHED_METADATA: EnrichedAuthorityMetadata = {
  schemaVersion: 1,
  generatedAt: "",
  people: [],
  works: [],
};

const ROLE_SET = new Set<string>(APPROVED_PERSON_ROLES);
const SOURCE_TYPE_SET = new Set<string>(AUTHORITY_EVIDENCE_SOURCE_TYPES);
const CONFIDENCE_SET = new Set<string>(AUTHORITY_EVIDENCE_CONFIDENCE_VALUES);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeAuthorityName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugifyAuthorityName(input: string): string {
  return normalizeAuthorityName(input).replace(/\s+/g, "-");
}

function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isYear(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1000 &&
    value <= 2100
  );
}

function hasHighConfidenceEvidence(
  item: { evidence: Array<Record<string, unknown>> },
  field: "deathYear" | "originalPublicationYear",
  value: number,
): boolean {
  return item.evidence.some(
    (evidence) =>
      evidence.field === field &&
      evidence.value === value &&
      typeof evidence.sourceId === "string" &&
      evidence.sourceId.trim() !== "" &&
      typeof evidence.sourceUrl === "string" &&
      /^https?:\/\//i.test(evidence.sourceUrl) &&
      SOURCE_TYPE_SET.has(String(evidence.sourceType)) &&
      evidence.confidence === "high",
  );
}

function evidenceSummary(
  item: { evidence: Array<Record<string, unknown>> },
  field: "deathYear" | "originalPublicationYear",
  value: number,
): string {
  const evidence = item.evidence.find(
    (entry) =>
      entry.field === field &&
      entry.value === value &&
      entry.confidence === "high",
  );
  if (!evidence) return "external authority evidence";
  return [
    String(evidence.sourceType ?? "external-authority"),
    String(evidence.sourceId ?? ""),
    String(evidence.sourceUrl ?? ""),
  ]
    .filter(Boolean)
    .join(" ");
}

function validateEvidence(
  raw: unknown,
  label: string,
  errors: string[],
): Array<Record<string, unknown>> {
  if (!Array.isArray(raw)) {
    errors.push(`${label}.evidence must be an array.`);
    return [];
  }
  const entries: Array<Record<string, unknown>> = [];
  raw.forEach((value, index) => {
    const entryLabel = `${label}.evidence[${index}]`;
    if (!isPlainObject(value)) {
      errors.push(`${entryLabel} must be an object.`);
      return;
    }
    if (typeof value.field !== "string" || value.field.trim() === "") {
      errors.push(`${entryLabel}.field must be a non-empty string.`);
    }
    if (
      typeof value.sourceType !== "string" ||
      !SOURCE_TYPE_SET.has(value.sourceType)
    ) {
      errors.push(`${entryLabel}.sourceType must be an approved authority source.`);
    }
    if (typeof value.sourceId !== "string" || value.sourceId.trim() === "") {
      errors.push(`${entryLabel}.sourceId must be a non-empty string.`);
    }
    if (
      typeof value.sourceUrl !== "string" ||
      !/^https?:\/\//i.test(value.sourceUrl)
    ) {
      errors.push(`${entryLabel}.sourceUrl must be an absolute URL.`);
    }
    if (
      typeof value.confidence !== "string" ||
      !CONFIDENCE_SET.has(value.confidence)
    ) {
      errors.push(`${entryLabel}.confidence must be high, medium, or low.`);
    }
    if (
      value.matchedBy !== undefined &&
      typeof value.matchedBy !== "string"
    ) {
      errors.push(`${entryLabel}.matchedBy must be a string when present.`);
    }
    if (value.notes !== undefined && typeof value.notes !== "string") {
      errors.push(`${entryLabel}.notes must be a string when present.`);
    }
    entries.push(value);
  });
  return entries;
}

function validatePerson(
  value: unknown,
  label: string,
  errors: string[],
): EnrichedPersonMetadata | null {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return null;
  }
  if (typeof value.slug !== "string" || !isSlug(value.slug)) {
    errors.push(`${label}.slug must be lowercase kebab-case.`);
  }
  if (typeof value.name !== "string" || value.name.trim() === "") {
    errors.push(`${label}.name must be a non-empty string.`);
  }
  if (
    !Array.isArray(value.roles) ||
    value.roles.length === 0 ||
    value.roles.some((role) => typeof role !== "string" || !ROLE_SET.has(role))
  ) {
    errors.push(`${label}.roles must contain approved person roles.`);
  }
  if (value.birthYear !== undefined && value.birthYear !== null && !isYear(value.birthYear)) {
    errors.push(`${label}.birthYear must be an integer year or null.`);
  }
  if (value.deathYear !== null && !isYear(value.deathYear)) {
    errors.push(`${label}.deathYear must be an integer year or null.`);
  }
  if (typeof value.canadaLifePlus70Safe !== "boolean") {
    errors.push(`${label}.canadaLifePlus70Safe must be a boolean.`);
  }
  if (value.approvalSource !== "external-authority") {
    errors.push(`${label}.approvalSource must be external-authority.`);
  }
  if (value.reviewedByOwner !== false) {
    errors.push(`${label}.reviewedByOwner must remain false.`);
  }
  const evidence = validateEvidence(value.evidence, label, errors);
  if (typeof value.deathYear === "number") {
    if (
      value.canadaLifePlus70Safe !== true ||
      !hasHighConfidenceEvidence(
        { evidence },
        "deathYear",
        value.deathYear,
      )
    ) {
      errors.push(
        `${label}.deathYear requires high-confidence deathYear evidence and canadaLifePlus70Safe true.`,
      );
    }
  }

  if (errors.some((error) => error.startsWith(label))) return null;

  return {
    slug: String(value.slug),
    name: String(value.name),
    roles: value.roles as ApprovedPersonRole[],
    birthYear:
      typeof value.birthYear === "number" ? value.birthYear : null,
    deathYear:
      typeof value.deathYear === "number" ? value.deathYear : null,
    canadaLifePlus70Safe: value.canadaLifePlus70Safe === true,
    evidence: evidence as EnrichedPersonMetadata["evidence"],
    approvalSource: "external-authority",
    reviewedByOwner: false,
  };
}

function validateWork(
  value: unknown,
  label: string,
  errors: string[],
): EnrichedWorkMetadata | null {
  if (!isPlainObject(value)) {
    errors.push(`${label} must be an object.`);
    return null;
  }
  if (typeof value.bookSlug !== "string" || !isSlug(value.bookSlug)) {
    errors.push(`${label}.bookSlug must be lowercase kebab-case.`);
  }
  if (typeof value.title !== "string" || value.title.trim() === "") {
    errors.push(`${label}.title must be a non-empty string.`);
  }
  if (
    value.originalPublicationYear !== null &&
    !isYear(value.originalPublicationYear)
  ) {
    errors.push(`${label}.originalPublicationYear must be an integer year or null.`);
  }
  if (value.approvalSource !== "external-authority") {
    errors.push(`${label}.approvalSource must be external-authority.`);
  }
  const evidence = validateEvidence(value.evidence, label, errors);
  if (typeof value.originalPublicationYear === "number") {
    if (
      !hasHighConfidenceEvidence(
        { evidence },
        "originalPublicationYear",
        value.originalPublicationYear,
      )
    ) {
      errors.push(
        `${label}.originalPublicationYear requires high-confidence originalPublicationYear evidence.`,
      );
    }
  }

  if (errors.some((error) => error.startsWith(label))) return null;

  return {
    bookSlug: String(value.bookSlug),
    title: String(value.title),
    originalPublicationYear:
      typeof value.originalPublicationYear === "number"
        ? value.originalPublicationYear
        : null,
    evidence: evidence as EnrichedWorkMetadata["evidence"],
    approvalSource: "external-authority",
  };
}

export function loadEnrichedAuthorityMetadata(
  filePath: string,
): EnrichedMetadataLoadResult {
  if (!fs.existsSync(filePath)) {
    return {
      metadata: { ...EMPTY_ENRICHED_METADATA },
      errors: [],
      warnings: [],
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return {
      metadata: { ...EMPTY_ENRICHED_METADATA },
      errors: [
        `${filePath} could not be parsed: ${
          error instanceof Error ? error.message : "unknown JSON error"
        }`,
      ],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isPlainObject(parsed)) {
    return {
      metadata: { ...EMPTY_ENRICHED_METADATA },
      errors: [`${filePath} must be an object.`],
      warnings,
    };
  }
  if (parsed.schemaVersion !== 1) {
    errors.push(`${filePath}.schemaVersion must be 1.`);
  }
  if (typeof parsed.generatedAt !== "string") {
    errors.push(`${filePath}.generatedAt must be a string.`);
  }
  if (!Array.isArray(parsed.people)) {
    errors.push(`${filePath}.people must be an array.`);
  }
  if (!Array.isArray(parsed.works)) {
    errors.push(`${filePath}.works must be an array.`);
  }

  const people = Array.isArray(parsed.people)
    ? parsed.people
        .map((value, index) =>
          validatePerson(value, `${filePath}.people[${index}]`, errors),
        )
        .filter((person): person is EnrichedPersonMetadata => person !== null)
    : [];
  const works = Array.isArray(parsed.works)
    ? parsed.works
        .map((value, index) =>
          validateWork(value, `${filePath}.works[${index}]`, errors),
        )
        .filter((work): work is EnrichedWorkMetadata => work !== null)
    : [];

  const personKeys = new Set<string>();
  for (const person of people) {
    const key = `${normalizeAuthorityName(person.name)}:${person.roles.join(",")}`;
    if (personKeys.has(key)) {
      warnings.push(`${filePath}: duplicate enriched person match for ${person.name}.`);
    }
    personKeys.add(key);
  }

  return {
    metadata: {
      schemaVersion: 1,
      generatedAt: typeof parsed.generatedAt === "string" ? parsed.generatedAt : "",
      people,
      works,
    },
    errors,
    warnings,
  };
}

export function enrichedPersonDeathYearFor(
  name: string,
  role: ApprovedPersonRole,
  metadata: EnrichedAuthorityMetadata,
): EnrichedPersonFact | null {
  const wantedName = normalizeAuthorityName(name);
  const wantedSlug = slugifyAuthorityName(name);
  const matches = metadata.people.filter(
    (person) =>
      person.roles.includes(role) &&
      (person.slug === wantedSlug ||
        normalizeAuthorityName(person.name) === wantedName),
  );
  if (matches.length !== 1) return null;
  const person = matches[0];
  if (
    typeof person.deathYear !== "number" ||
    person.canadaLifePlus70Safe !== true ||
    !hasHighConfidenceEvidence(person, "deathYear", person.deathYear)
  ) {
    return null;
  }
  return {
    person,
    deathYear: person.deathYear,
    sourceSummary: evidenceSummary(person, "deathYear", person.deathYear),
  };
}

export function enrichedOriginalPublicationYearFor(
  bookSlug: string,
  title: string,
  metadata: EnrichedAuthorityMetadata,
): EnrichedWorkFact | null {
  const matches = metadata.works.filter((work) => work.bookSlug === bookSlug);
  if (matches.length !== 1) return null;
  const work = matches[0];
  if (
    normalizeAuthorityName(work.title) !== normalizeAuthorityName(title) ||
    typeof work.originalPublicationYear !== "number" ||
    !hasHighConfidenceEvidence(
      work,
      "originalPublicationYear",
      work.originalPublicationYear,
    )
  ) {
    return null;
  }
  return {
    work,
    originalPublicationYear: work.originalPublicationYear,
    sourceSummary: evidenceSummary(
      work,
      "originalPublicationYear",
      work.originalPublicationYear,
    ),
  };
}
