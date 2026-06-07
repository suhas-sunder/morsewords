import fs from "node:fs";

import type {
  ApprovedPersonRole,
  OwnerApprovedRegion,
  OwnerBookApproval,
} from "./bookManifestTypes.ts";
import { APPROVED_PERSON_ROLES } from "./bookManifestTypes.ts";

export const OWNER_APPROVAL_SCHEMA_VERSION = 1;

export const DUPLICATE_RESOLUTION_VALUES = [
  "keep-one",
  "allow-multiple",
  "ignore-until-reviewed",
] as const;

export type OwnerDuplicateResolutionValue =
  (typeof DUPLICATE_RESOLUTION_VALUES)[number];

export type OwnerPersonApproval = {
  slug: string;
  name: string;
  roles: ApprovedPersonRole[];
  deathYear: number | null;
  canadaLifePlus70Safe: boolean;
  notes: string;
  reviewedByOwner: boolean;
  reviewDate?: string;
  sourceNotes?: string;
};

export type OwnerDuplicateResolution = {
  gutenbergId: string;
  keepSlug: string | null;
  duplicateSlugs: string[];
  resolution: OwnerDuplicateResolutionValue;
  reason: string;
  ownerReviewed: boolean;
};

export type ApprovalFileLoadResult<T> = {
  entries: T[];
  errors: string[];
  warnings: string[];
};

const APPROVED_PERSON_ROLE_SET = new Set<string>(APPROVED_PERSON_ROLES);
const APPROVED_REGION_SET = new Set<string>(["US", "CA"]);
const DUPLICATE_RESOLUTION_SET = new Set<string>(DUPLICATE_RESOLUTION_VALUES);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readJson(filePath: string): { value: unknown | null; errors: string[] } {
  if (!fs.existsSync(filePath)) return { value: null, errors: [] };
  try {
    return { value: JSON.parse(fs.readFileSync(filePath, "utf8")), errors: [] };
  } catch (error) {
    return {
      value: null,
      errors: [
        `${filePath} could not be parsed: ${
          error instanceof Error ? error.message : "unknown JSON error"
        }`,
      ],
    };
  }
}

function arrayFromContainer(
  value: unknown,
  key: "people" | "books" | "duplicates",
  filePath: string,
): { values: unknown[]; errors: string[] } {
  if (value === null) return { values: [], errors: [] };
  if (Array.isArray(value)) return { values: value, errors: [] };
  if (!isPlainObject(value)) {
    return { values: [], errors: [`${filePath} must be an object or array.`] };
  }
  if (
    value.schemaVersion !== undefined &&
    value.schemaVersion !== OWNER_APPROVAL_SCHEMA_VERSION
  ) {
    return {
      values: [],
      errors: [
        `${filePath}.schemaVersion must be ${OWNER_APPROVAL_SCHEMA_VERSION}.`,
      ],
    };
  }
  const entries = value[key];
  if (entries === undefined) return { values: [], errors: [] };
  if (!Array.isArray(entries)) {
    return { values: [], errors: [`${filePath}.${key} must be an array.`] };
  }
  return { values: entries, errors: [] };
}

function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isYear(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1400 &&
    value <= 2100
  );
}

function optionalString(
  value: unknown,
  label: string,
  errors: string[],
): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    errors.push(`${label} must be a string when present.`);
    return undefined;
  }
  return value;
}

export function loadOwnerPeopleApprovals(
  filePath: string,
): ApprovalFileLoadResult<OwnerPersonApproval> {
  const parsed = readJson(filePath);
  const container = arrayFromContainer(parsed.value, "people", filePath);
  const errors = [...parsed.errors, ...container.errors];
  const warnings: string[] = [];
  const entries: OwnerPersonApproval[] = [];

  container.values.forEach((value, index) => {
    const label = `${filePath}.people[${index}]`;
    const entryErrors: string[] = [];
    if (!isPlainObject(value)) {
      errors.push(`${label} must be an object.`);
      return;
    }
    if (typeof value.slug !== "string" || !isSlug(value.slug)) {
      entryErrors.push(`${label}.slug must be lowercase kebab-case.`);
    }
    if (typeof value.name !== "string" || value.name.trim() === "") {
      entryErrors.push(`${label}.name must be a non-empty string.`);
    }
    if (
      !Array.isArray(value.roles) ||
      value.roles.length === 0 ||
      value.roles.some(
        (role) =>
          typeof role !== "string" || !APPROVED_PERSON_ROLE_SET.has(role),
      )
    ) {
      entryErrors.push(`${label}.roles must contain approved person roles.`);
    }
    if (!isYear(value.deathYear)) {
      entryErrors.push(`${label}.deathYear must be a verified integer year.`);
    }
    if (value.canadaLifePlus70Safe !== true) {
      entryErrors.push(`${label}.canadaLifePlus70Safe must be true.`);
    }
    if (value.reviewedByOwner !== true) {
      entryErrors.push(`${label}.reviewedByOwner must be true.`);
    }
    if (typeof value.notes !== "string") {
      entryErrors.push(`${label}.notes must be a string.`);
    }

    const reviewDate = optionalString(value.reviewDate, `${label}.reviewDate`, entryErrors);
    const sourceNotes = optionalString(
      value.sourceNotes,
      `${label}.sourceNotes`,
      entryErrors,
    );

    if (entryErrors.length > 0) {
      errors.push(...entryErrors);
      return;
    }

    const slug = typeof value.slug === "string" ? value.slug : "";
    const name = typeof value.name === "string" ? value.name.trim() : "";
    const roles = Array.isArray(value.roles)
      ? (value.roles as ApprovedPersonRole[])
      : [];
    const deathYear = isYear(value.deathYear) ? value.deathYear : null;
    const notes = typeof value.notes === "string" ? value.notes : "";

    entries.push({
      slug,
      name,
      roles,
      deathYear,
      canadaLifePlus70Safe: true,
      notes,
      reviewedByOwner: true,
      ...(reviewDate !== undefined ? { reviewDate } : {}),
      ...(sourceNotes !== undefined ? { sourceNotes } : {}),
    });
  });

  return { entries, errors, warnings };
}

export function loadOwnerBookApprovals(
  filePath: string,
): ApprovalFileLoadResult<OwnerBookApproval> {
  const parsed = readJson(filePath);
  const container = arrayFromContainer(parsed.value, "books", filePath);
  const errors = [...parsed.errors, ...container.errors];
  const warnings: string[] = [];
  const entries: OwnerBookApproval[] = [];

  container.values.forEach((value, index) => {
    const label = `${filePath}.books[${index}]`;
    const entryErrors: string[] = [];
    if (!isPlainObject(value)) {
      errors.push(`${label} must be an object.`);
      return;
    }
    if (typeof value.bookSlug !== "string" || !isSlug(value.bookSlug)) {
      entryErrors.push(`${label}.bookSlug must be lowercase kebab-case.`);
    }
    if (value.ownerReviewed !== true) {
      entryErrors.push(`${label}.ownerReviewed must be true.`);
    }
    if (typeof value.approvedForWebsite !== "boolean") {
      entryErrors.push(`${label}.approvedForWebsite must be a boolean.`);
    }
    if (typeof value.approvedForYoutubeNarration !== "boolean") {
      entryErrors.push(`${label}.approvedForYoutubeNarration must be a boolean.`);
    }
    if (
      !Array.isArray(value.approvedRegions) ||
      value.approvedRegions.some(
        (region) => typeof region !== "string" || !APPROVED_REGION_SET.has(region),
      )
    ) {
      entryErrors.push(`${label}.approvedRegions must contain only US and CA.`);
    }
    if (
      value.approvedForWebsite === true &&
      (!Array.isArray(value.approvedRegions) ||
        !value.approvedRegions.includes("US") ||
        !value.approvedRegions.includes("CA"))
    ) {
      entryErrors.push(
        `${label}.approvedRegions must include US and CA for website approval.`,
      );
    }
    if (value.approvedForWebsite === true && !isYear(value.originalPublicationYear)) {
      entryErrors.push(
        `${label}.originalPublicationYear must be a verified integer year for website approval.`,
      );
    } else if (
      value.originalPublicationYear !== null &&
      value.originalPublicationYear !== undefined &&
      !isYear(value.originalPublicationYear)
    ) {
      entryErrors.push(`${label}.originalPublicationYear must be an integer year or null.`);
    }
    if (typeof value.editionNotes !== "string") {
      entryErrors.push(`${label}.editionNotes must be a string.`);
    }
    if (typeof value.translationNotes !== "string") {
      entryErrors.push(`${label}.translationNotes must be a string.`);
    }
    if (typeof value.excludeModernAdditions !== "boolean") {
      entryErrors.push(`${label}.excludeModernAdditions must be a boolean.`);
    }
    if (typeof value.notes !== "string") {
      entryErrors.push(`${label}.notes must be a string.`);
    }

    if (entryErrors.length > 0) {
      errors.push(...entryErrors);
      return;
    }

    const bookSlug = typeof value.bookSlug === "string" ? value.bookSlug : "";
    const approvedForWebsite =
      typeof value.approvedForWebsite === "boolean"
        ? value.approvedForWebsite
        : false;
    const approvedForYoutubeNarration =
      typeof value.approvedForYoutubeNarration === "boolean"
        ? value.approvedForYoutubeNarration
        : false;
    const approvedRegions = Array.isArray(value.approvedRegions)
      ? (value.approvedRegions as OwnerApprovedRegion[])
      : [];
    const originalPublicationYear =
      typeof value.originalPublicationYear === "number"
        ? value.originalPublicationYear
        : null;
    const editionNotes =
      typeof value.editionNotes === "string" ? value.editionNotes : "";
    const translationNotes =
      typeof value.translationNotes === "string"
        ? value.translationNotes
        : "";
    const excludeModernAdditions =
      typeof value.excludeModernAdditions === "boolean"
        ? value.excludeModernAdditions
        : false;
    const notes = typeof value.notes === "string" ? value.notes : "";

    entries.push({
      bookSlug,
      approvedForWebsite,
      approvedForYoutubeNarration,
      approvedRegions,
      originalPublicationYear:
        originalPublicationYear,
      editionNotes,
      translationNotes,
      excludeModernAdditions,
      ownerReviewed: true,
      notes,
    });
  });

  return { entries, errors, warnings };
}

export function loadOwnerDuplicateResolutions(
  filePath: string,
): ApprovalFileLoadResult<OwnerDuplicateResolution> {
  const parsed = readJson(filePath);
  const container = arrayFromContainer(parsed.value, "duplicates", filePath);
  const errors = [...parsed.errors, ...container.errors];
  const warnings: string[] = [];
  const entries: OwnerDuplicateResolution[] = [];

  container.values.forEach((value, index) => {
    const label = `${filePath}.duplicates[${index}]`;
    const entryErrors: string[] = [];
    if (!isPlainObject(value)) {
      errors.push(`${label} must be an object.`);
      return;
    }
    if (typeof value.gutenbergId !== "string" || !/^\d+$/.test(value.gutenbergId)) {
      entryErrors.push(`${label}.gutenbergId must be a string of digits.`);
    }
    if (
      value.keepSlug !== null &&
      value.keepSlug !== undefined &&
      (typeof value.keepSlug !== "string" || !isSlug(value.keepSlug))
    ) {
      entryErrors.push(`${label}.keepSlug must be lowercase kebab-case or null.`);
    }
    if (
      !Array.isArray(value.duplicateSlugs) ||
      value.duplicateSlugs.some((slug) => typeof slug !== "string" || !isSlug(slug))
    ) {
      entryErrors.push(`${label}.duplicateSlugs must be lowercase kebab-case strings.`);
    }
    if (typeof value.resolution !== "string" || !DUPLICATE_RESOLUTION_SET.has(value.resolution)) {
      entryErrors.push(`${label}.resolution must be a supported duplicate resolution.`);
    }
    if (value.ownerReviewed !== true) {
      entryErrors.push(`${label}.ownerReviewed must be true.`);
    }
    if (
      typeof value.reason !== "string" ||
      (value.resolution !== "ignore-until-reviewed" && value.reason.trim() === "")
    ) {
      entryErrors.push(`${label}.reason is required for resolved duplicate groups.`);
    }
    if (value.resolution === "keep-one" && !value.keepSlug) {
      entryErrors.push(`${label}.keepSlug is required when resolution is keep-one.`);
    }

    if (entryErrors.length > 0) {
      errors.push(...entryErrors);
      return;
    }

    const gutenbergId =
      typeof value.gutenbergId === "string" ? value.gutenbergId : "";
    const keepSlug = typeof value.keepSlug === "string" ? value.keepSlug : null;
    const duplicateSlugs = Array.isArray(value.duplicateSlugs)
      ? (value.duplicateSlugs as string[])
      : [];
    const resolution =
      typeof value.resolution === "string" &&
      DUPLICATE_RESOLUTION_SET.has(value.resolution)
        ? (value.resolution as OwnerDuplicateResolutionValue)
        : "ignore-until-reviewed";
    const reason = typeof value.reason === "string" ? value.reason : "";

    entries.push({
      gutenbergId,
      keepSlug,
      duplicateSlugs,
      resolution,
      reason,
      ownerReviewed: true,
    });
  });

  return { entries, errors, warnings };
}

export function ownerBookApprovalMap(
  approvals: OwnerBookApproval[],
): Map<string, OwnerBookApproval> {
  const map = new Map<string, OwnerBookApproval>();
  for (const approval of approvals) {
    map.set(approval.bookSlug, approval);
  }
  return map;
}
