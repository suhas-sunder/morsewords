import { createHash } from "node:crypto";

type RecordEvidence = {
  slug: string;
  findings: string[];
  payload: { state: string };
  pages: { mode: string; ssr: { state: string } }[];
};
type CompactRecord = { slug: string; sha256: string; findings: string[]; payload: string; ssr: Record<string, string> };
export type EvidenceBaseline = { records: (RecordEvidence | CompactRecord)[] };

/** Stable key order gives the same artifact/hash for the same evidence object. */
export function canonicalEvidenceJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalEvidenceJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => a.localeCompare(b, "en")).map(([key, item]) => `${JSON.stringify(key)}:${canonicalEvidenceJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function compactLibraryEvidence<T extends { records: RecordEvidence[]; totals: Record<string, number>; scope: unknown; limitations: string[] }>(report: T, baseline?: EvidenceBaseline) {
  const fullJson = canonicalEvidenceJson(report) + "\n";
  const inventory = (records: (RecordEvidence | CompactRecord)[]): CompactRecord[] => records.map(record => "sha256" in record ? record : ({
    slug: record.slug,
    sha256: sha256(canonicalEvidenceJson(record)),
    findings: [...record.findings].sort(),
    payload: record.payload.state,
    ssr: Object.fromEntries(record.pages.map(page => [page.mode, page.ssr.state])),
  })).sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  const records = inventory(report.records);
  const previous = baseline ? new Map(inventory(baseline.records).map(record => [record.slug, record])) : null;
  const current = new Set(records.map(record => record.slug));
  const findingInventory: Record<string, string[]> = {};
  for (const record of records) for (const finding of record.findings) (findingInventory[finding] ??= []).push(record.slug);
  const { records: _records, ...metadata } = report;
  const compact = {
    ...metadata,
    schemaVersion: 2,
    artifactKind: "compact-library-evidence",
    fullReport: { algorithm: "sha256", serialization: "canonicalEvidenceJson + LF", sha256: sha256(fullJson), bytes: Buffer.byteLength(fullJson) },
    evidenceDigest: sha256(canonicalEvidenceJson(records)),
    findingInventory,
    records,
    delta: previous ? {
      note: "Changed evidence includes probe scope changes. Not-probed or unavailable is never a resolved finding or a pass.",
      added: records.filter(record => !previous.has(record.slug)).map(record => record.slug),
      removed: [...previous.keys()].filter(slug => !current.has(slug)),
      changed: records.filter(record => previous.has(record.slug) && previous.get(record.slug)!.sha256 !== record.sha256).map(record => ({ slug: record.slug, before: previous.get(record.slug), after: record })),
    } : null,
  };
  const markdown = ["# Library evidence summary", "", "Evidence only; no automatic indexing or rights decision.", "", ...Object.entries(report.totals).map(([key, value]) => `- ${key}: ${value}`), "", `Full report SHA-256: \`${compact.fullReport.sha256}\` (${compact.fullReport.bytes} canonical bytes).`, "", "## Finding queues", "", ...Object.entries(findingInventory).map(([finding, slugs]) => `- ${finding}: ${slugs.length} titles; inspect the compact JSON inventory.`), "", "## Limits", "", ...report.limitations.map(limit => `- ${limit}`), "", "Probe states remain explicit per title and mode. Scope changes are not improvements.", ""].join("\n");
  return { compact, fullJson, markdown };
}
