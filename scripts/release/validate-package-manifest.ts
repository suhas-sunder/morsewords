import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export type PackageRecord = {
  packageId: string; theme?: string; classification?: string; userFacing?: boolean;
  standaloneProductionEligible?: boolean; status: string; dependencies: string[];
  affectedRoutes?: string[]; implementationCommits: string[]; amendmentCommits: string[];
  documentationCommits: string[]; reviewBranch?: string | null; draftPr?: string | null;
  packageSpecificGates?: string[]; commonGates?: string[]; acceptance?: string;
  rollback?: string; evidence: string[];
  productionEvidence?: { candidateSha: string; deployId: string; deployedAt: string; ownerDecision: string; liveChecks: string };
};
export type PackageManifest = {
  schemaVersion: number; packages: PackageRecord[]; internalPackages: PackageRecord[];
  commitOrder: string[];
  persistentGates: { introducedBy: string; when: string; surfaces: string[]; commands: string[] }[];
};
const sha = /^[a-f0-9]{40}$/;
const statuses = new Set(["PROPOSED", "IN_PROGRESS", "VALIDATED", "BLOCKED", "RELEASED"]);
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(v => typeof v === "string" && !!v.trim());

// Pure validation: no Git commands, network, file writes or execution of manifest commands.
export function validatePackageManifest(value: unknown): string[] {
  const errors: string[] = [];
  const fail = (message: string) => errors.push(message);
  if (!value || typeof value !== "object") return ["Manifest must be an object"];
  const m = value as PackageManifest;
  if (m.schemaVersion !== 2) fail("Unsupported schemaVersion; expected 2");
  if (!Array.isArray(m.packages) || !Array.isArray(m.internalPackages)) return [...errors, "Package arrays are required"];
  const all = [...m.packages, ...m.internalPackages];
  if (all.some(p => !p || typeof p !== "object")) return [...errors, "Invalid package record"];
  const ids = new Set<string>();
  const assignments = new Map<string, string>();
  for (const p of all) {
    const id = p.packageId;
    if (typeof id !== "string" || ids.has(id)) fail(`Invalid or duplicate packageId ${id}`);
    ids.add(id);
    if (!statuses.has(p.status)) fail(`${id}: illegal status`);
    if (!strings(p.dependencies)) fail(`${id}: dependencies must be strings`);
    if (!strings(p.evidence)) fail(`${id}: evidence must be strings`);
    for (const field of ["implementationCommits", "amendmentCommits", "documentationCommits"] as const) {
      const list = p[field];
      if (!strings(list)) { fail(`${id}: ${field} must be an array`); continue; }
      for (const commit of list) {
        if (!sha.test(commit)) fail(`${id}: invalid SHA in ${field}`);
        if (assignments.has(commit)) fail(`${id}: duplicate commit assignment ${commit} (already ${assignments.get(commit)})`);
        assignments.set(commit, `${id}.${field}`);
      }
    }
    if ((p.status === "VALIDATED" || p.status === "RELEASED") && !p.implementationCommits?.length) fail(`${id}: implemented package requires implementation commits`);
    if (p.status === "PROPOSED" && [p.implementationCommits,p.amendmentCommits,p.documentationCommits].some(a => a?.length)) fail(`${id}: proposed package cannot claim commits`);
    if (p.status === "RELEASED") {
      const e = p.productionEvidence;
      if (!e || !sha.test(e.candidateSha) || !e.deployId || !e.ownerDecision || !e.liveChecks || !Number.isFinite(Date.parse(e.deployedAt))) fail(`${id}: RELEASED requires actual production evidence`);
    } else if (p.productionEvidence) fail(`${id}: production evidence requires RELEASED status`);
  }
  const weeklyIds = m.packages.map(p => p.packageId);
  if (weeklyIds.length !== 52 || Array.from({ length: 52 }, (_, i) => `W${String(i+1).padStart(2,"0")}`).some(id => !weeklyIds.includes(id))) fail("Expected exactly W01 through W52");
  if (m.internalPackages.some(p => !/^TRANCHE-[A-Z]+-HARDENING$/.test(p.packageId))) fail("Internal dependency IDs must be explicit hardening records");
  for (const p of all) {
    if (strings(p.dependencies)) for (const dep of p.dependencies) if (!ids.has(dep) || dep === p.packageId) fail(`${p.packageId}: unknown or self dependency ${dep}`);
  }
  const visited = new Set<string>(), active = new Set<string>();
  const visit = (id: string) => {
    if (active.has(id)) { fail(`Dependency cycle at ${id}`); return; }
    if (visited.has(id)) return;
    active.add(id);
    const p = all.find(p => p.packageId === id);
    if (strings(p?.dependencies)) p.dependencies.forEach(dep => { if (ids.has(dep)) visit(dep); });
    active.delete(id); visited.add(id);
  };
  ids.forEach(visit);
  for (const p of m.packages) {
    for (const key of ["theme","classification","acceptance","rollback"] as const) if (typeof p[key] !== "string" || !p[key]?.trim()) fail(`${p.packageId}: missing ${key}`);
    for (const key of ["userFacing","standaloneProductionEligible"] as const) if (typeof p[key] !== "boolean") fail(`${p.packageId}: missing ${key}`);
    if (!strings(p.affectedRoutes) || !p.affectedRoutes.length) fail(`${p.packageId}: missing affected routes or surfaces`);
    if (!strings(p.commonGates) || !p.commonGates.length) fail(`${p.packageId}: missing common gates`);
    if (!strings(p.packageSpecificGates)) fail(`${p.packageId}: focused gates must be an array`);
    if (["VALIDATED","RELEASED"].includes(p.status)) {
      if (!p.packageSpecificGates?.length) fail(`${p.packageId}: missing focused gates`);
      if (!p.evidence?.length || !p.reviewBranch || !/^https:\/\/github.com\/[^/]+\/[^/]+\/pull\/\d+$/.test(p.draftPr ?? "")) fail(`${p.packageId}: missing review evidence/branch/PR`);
    }
    for (const key of ["reviewBranch","draftPr"] as const) if (!(key in p)) fail(`${p.packageId}: missing ${key} field`);
  }
  if (!strings(m.commitOrder) || m.commitOrder.length !== assignments.size || new Set(m.commitOrder).size !== assignments.size || m.commitOrder.some(c => !assignments.has(c))) fail("commitOrder must contain every assigned commit exactly once");
  if (!Array.isArray(m.persistentGates)) fail("Persistent gates are required");
  else for (const gate of m.persistentGates) {
    if (!gate || !ids.has(gate.introducedBy) || !["always","affected"].includes(gate.when) || !strings(gate.surfaces) || !strings(gate.commands) || !gate.commands.length || (gate.when === "affected" && !gate.surfaces.length)) fail("Invalid persistent gate");
  }
  return errors;
}

export function validateAgentAuthority(text: string): string[] {
  const errors: string[] = [];
  const files = ["2027-maturity-rebuild-release-train.md","PRODUCTION-CALENDAR.md","package-manifest.json"];
  let position = -1;
  for (const file of files) {
    const next = text.indexOf(file);
    if (next < position || next < 0 || next > 2000) errors.push(`Missing or out-of-order AGENTS authority: ${file}`);
    position = next;
  }
  if (/^#{2,4} (?:Current high-priority remaining work|Active priority:|Then:)/m.test(text) || /Final performance optimization happens after/i.test(text)) errors.push("AGENTS contains a competing legacy priority sequence");
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const manifest = JSON.parse(await fs.readFile("ai-issues/2027-release-train/package-manifest.json", "utf8"));
  const errors = [...validatePackageManifest(manifest), ...validateAgentAuthority(await fs.readFile("AGENTS.md", "utf8"))];
  errors.forEach(error => console.error(error));
  console.log(errors.length ? `${errors.length} release integrity errors` : "52 packages, explicit internal dependencies, commit assignments and AGENTS authority verified (read-only).");
  process.exitCode = errors.length ? 1 : 0;
}
