import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { validatePackageManifest } from "./validate-package-manifest.ts";
import type { PackageManifest } from "./validate-package-manifest.ts";

// Read-only command listing. Released packages are recognized from validated
// manifest evidence; the operator supplies same-candidate prerequisites and
// affected surfaces after reviewing the actual candidate diff.
export function selectPackageGates(m: PackageManifest, selected: string[], included: string[], surfaces: string[]) {
  const errors = validatePackageManifest(m);
  if (errors.length) throw new Error(errors.join("\n"));
  const all = [...m.packages, ...m.internalPackages];
  const byId = new Map(all.map(p => [p.packageId, p]));
  const explicit = new Set([...selected, ...included]);
  for (const id of explicit) {
    const p = byId.get(id);
    if (!p) throw new Error(`Unknown package ${id}`);
    if (!["VALIDATED", "RELEASED"].includes(p.status)) throw new Error(`${id} is not validated`);
  }
  const available = new Set([
    ...explicit,
    ...all.filter(p => p.status === "RELEASED").map(p => p.packageId),
  ]);
  const checked = new Set<string>();
  // The manifest validator rejects cycles before this recursive closure check.
  function checkDependencies(id: string, chain: string[]) {
    if (checked.has(id)) return;
    for (const dep of byId.get(id)!.dependencies) {
      const next = [...chain, dep];
      if (!available.has(dep)) throw new Error(`${next[0]} requires ${next.slice(1).join(" -> ")}; ${dep} is neither released nor selected/included.`);
      checkDependencies(dep, next);
    }
    checked.add(id);
  }
  for (const id of explicit) checkDependencies(id, [id]);
  const commands = new Set<string>(["npm run release:validate-package-manifest"]);
  for (const id of selected) {
    const p = byId.get(id)!;
    [...p.commonGates ?? [], ...p.packageSpecificGates ?? []].forEach(c => commands.add(c));
  }
  for (const gate of m.persistentGates) if (available.has(gate.introducedBy) && (gate.when === "always" || gate.surfaces.some(s => surfaces.includes(s)))) gate.commands.forEach(c => commands.add(c));
  return [...commands];
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const arg = (name: string) => (process.argv.find(v => v.startsWith(`--${name}=`))?.split("=")[1] ?? "").split(",").filter(Boolean);
  const selected = arg("packages");
  if (!selected.length) throw new Error("Specify --packages=Wxx --included=validated-same-candidate-IDs --surfaces=shared-audio,library-runtime; this only lists commands.");
  const m = JSON.parse(await fs.readFile("ai-issues/2027-release-train/package-manifest.json", "utf8"));
  console.log(selectPackageGates(m, selected, arg("included"), arg("surfaces")).join("\n"));
}
