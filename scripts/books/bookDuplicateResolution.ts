import type {
  DuplicateResolutionSource,
} from "./bookManifestTypes.ts";

export type DuplicateResolutionParticipant = {
  slug: string;
  title: string;
  author: string[];
  gutenbergId: string | null;
  rawTextFile: string;
  metadataFile: string;
  allowDuplicateGutenbergId?: boolean;
  duplicateReason?: string | null;
};

export type DuplicateSlugResolution = {
  gutenbergId: string;
  affectedSlugs: string[];
  canonicalSlug: string | null;
  isEligible: boolean;
  duplicateResolutionSource: DuplicateResolutionSource;
  reason: string;
};

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugifyTitle(input: string): string {
  return normalizeText(input).replace(/\s+/g, "-");
}

function groupByGutenbergId(
  participants: DuplicateResolutionParticipant[],
): Map<string, DuplicateResolutionParticipant[]> {
  const groups = new Map<string, DuplicateResolutionParticipant[]>();
  for (const participant of participants) {
    if (!participant.gutenbergId) continue;
    const group = groups.get(participant.gutenbergId) ?? [];
    group.push(participant);
    groups.set(participant.gutenbergId, group);
  }
  return groups;
}

function allOwnerReviewedDuplicatesAllowed(
  participants: DuplicateResolutionParticipant[],
): boolean {
  return participants.every(
    (participant) =>
      participant.allowDuplicateGutenbergId === true &&
      typeof participant.duplicateReason === "string" &&
      participant.duplicateReason.trim() !== "",
  );
}

function deterministicCanonicalSlug(
  participants: DuplicateResolutionParticipant[],
): string | null {
  const titles = new Set(participants.map((participant) => normalizeText(participant.title)));
  const authors = new Set(
    participants.map((participant) => normalizeText(participant.author.join(", "))),
  );
  if (titles.size !== 1 || authors.size !== 1) return null;

  const expectedSlug = slugifyTitle(participants[0]?.title ?? "");
  const canonicalCandidates = participants.filter(
    (participant) => participant.slug === expectedSlug,
  );
  return canonicalCandidates.length === 1 ? canonicalCandidates[0].slug : null;
}

export function buildDuplicateSlugResolutionMap(
  participants: DuplicateResolutionParticipant[],
): Map<string, DuplicateSlugResolution> {
  const result = new Map<string, DuplicateSlugResolution>();
  for (const [gutenbergId, group] of groupByGutenbergId(participants).entries()) {
    if (group.length < 2) continue;
    const affectedSlugs = group.map((participant) => participant.slug).sort();

    if (allOwnerReviewedDuplicatesAllowed(group)) {
      for (const participant of group) {
        result.set(participant.slug, {
          gutenbergId,
          affectedSlugs,
          canonicalSlug: null,
          isEligible: true,
          duplicateResolutionSource: "owner-reviewed",
          reason: "Owner-reviewed metadata explicitly allows this duplicate Gutenberg ID.",
        });
      }
      continue;
    }

    const canonicalSlug = deterministicCanonicalSlug(group);
    if (canonicalSlug) {
      for (const participant of group) {
        const isEligible = participant.slug === canonicalSlug;
        result.set(participant.slug, {
          gutenbergId,
          affectedSlugs,
          canonicalSlug,
          isEligible,
          duplicateResolutionSource: "deterministic-file-match",
          reason: isEligible
            ? "Same Gutenberg ID, same normalized title and author, and this slug is the only normalized title slug."
            : "Duplicate Gutenberg ID alternate blocked; deterministic file match selected the normalized title slug.",
        });
      }
      continue;
    }

    for (const participant of group) {
      result.set(participant.slug, {
        gutenbergId,
        affectedSlugs,
        canonicalSlug: null,
        isEligible: false,
        duplicateResolutionSource: "manual-review",
        reason: "Duplicate Gutenberg ID requires explicit review before processing or publishing.",
      });
    }
  }
  return result;
}
