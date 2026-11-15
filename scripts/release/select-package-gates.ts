import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { validatePackageManifest } from "./validate-package-manifest.ts";
import type { PackageManifest } from "./validate-package-manifest.ts";

// Read-only command listing. The operator supplies all shipped/included packages
// and affected surfaces after reviewing the actual candidate diff.
export function selectPackageGates(m: PackageManifest, selected: string[], included: string[], surfaces: string[]) {
  const errors = validatePackageManifest(m);
  if (errors.length) throw new Error(errors.join("\n"));
  const all = [...m.packages, ...m.internalPackages];
  const available = new Set([...included, ...selected]);
  for (const id of available) if (!all.some(p => p.packageId === id)) throw new Error(`Unknown package ${id}`);
  const commands = new Set<string>(["npm run release:validate-package-manifest"]);
  for (const id of selected) {
    const p = all.find(p => p.packageId === id)!;
    if (!["VALIDATED","RELEASED"].includes(p.status)) throw new Error(`${id} is not validated`);
    for (const dep of p.dependencies) if (!available.has(dep)) throw new Error(`${id} requires shipped or included ${dep}`);
    [...p.commonGates ?? [], ...p.packageSpecificGates ?? []].forEach(c => commands.add(c));
  }
  for (const gate of m.persistentGates) if (available.has(gate.introducedBy) && (gate.when === "always" || gate.surfaces.some(s => surfaces.includes(s)))) gate.commands.forEach(c => commands.add(c));
  return [...commands];
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const arg = (name: string) => (process.argv.find(v => v.startsWith(`--${name}=`))?.split("=")[1] ?? "").split(",").filter(Boolean);
  const selected = arg("packages");
  if (!selected.length) throw new Error("Specify --packages=Wxx --included=shipped-or-included-IDs --surfaces=shared-audio,library-runtime; this only lists commands.");
  const m = JSON.parse(await fs.readFile("ai-issues/2027-release-train/package-manifest.json", "utf8"));
  console.log(selectPackageGates(m, selected, arg("included"), arg("surfaces")).join("\n"));
}
