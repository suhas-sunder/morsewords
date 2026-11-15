import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { validatePackageManifest, validateAgentAuthority } from "../../scripts/release/validate-package-manifest.ts";
import type { PackageManifest } from "../../scripts/release/validate-package-manifest.ts";
import { selectPackageGates } from "../../scripts/release/select-package-gates.ts";
const current: PackageManifest = JSON.parse(await fs.readFile("ai-issues/2027-release-train/package-manifest.json","utf8"));
test("current release records and durable authority agree", async () => {
  assert.deepEqual(validatePackageManifest(current), []);
  assert.deepEqual(validateAgentAuthority(await fs.readFile("AGENTS.md","utf8")), []);
});
const defects: [string, (m: PackageManifest) => void, RegExp][] = [
  ["schema", m => { m.schemaVersion = 999; }, /schemaVersion/],
  ["coverage", m => { m.packages.pop(); }, /W01 through W52/],
  ["duplicate ID", m => { m.packages[1].packageId = "W01"; }, /duplicate packageId/],
  ["status", m => { m.packages[0].status = "DONE"; }, /illegal status/],
  ["missing implementation", m => { m.packages[0].implementationCommits = []; }, /requires implementation/],
  ["malformed amendment", m => { m.packages[0].amendmentCommits = ["123"]; }, /invalid SHA/],
  ["duplicate assignment", m => { m.packages[1].amendmentCommits = m.packages[0].implementationCommits; }, /duplicate commit/],
  ["dependency", m => { m.packages[0].dependencies = ["TRANCHE-Z-HARDENING"]; }, /unknown/],
  ["cycle", m => { m.packages[0].dependencies = ["W02"]; }, /cycle/],
  ["focused gates", m => { m.packages[8].packageSpecificGates = []; }, /focused gates/],
  ["surfaces", m => { m.packages[0].affectedRoutes = []; }, /affected routes/],
  ["rollback", m => { m.packages[0].rollback = ""; }, /rollback/],
  ["proposed commits", m => { m.packages[51].implementationCommits = ["a".repeat(40)]; }, /proposed package/],
  ["false release", m => { m.packages[0].status = "RELEASED"; }, /actual production evidence/],
  ["missing commit order", m => { m.commitOrder.pop(); }, /commitOrder/],
];
for (const [name, mutate, expected] of defects) test(`rejects ${name}`, () => {
  const m = structuredClone(current); mutate(m);
  assert.match(validatePackageManifest(m).join("\n"), expected);
});
test("legacy priority lists fail the authority guard", async () => {
  const text = await fs.readFile("AGENTS.md","utf8");
  assert.match(validateAgentAuthority(text + "\n### Then: final optimization sweep\n").join(), /competing/);
});
test("persistent gates depend on included packages and affected surfaces", () => {
  const included = current.packages.slice(0,15).map(p => p.packageId);
  const base = selectPackageGates(current,["W16"],included,[]);
  assert.ok(base.includes("npm run books:navigation-index:check"));
  assert.ok(!base.some(c => c.includes("playback-ownership")));
  assert.ok(selectPackageGates(current,["W16"],included,["shared-audio"]).some(c => c.includes("playback-ownership")));
  assert.throws(() => selectPackageGates(current,["W16"],[],[]), /requires/);
  assert.throws(() => selectPackageGates(current,["W52"],included,[]), /not validated/);
  assert.throws(() => selectPackageGates(current,["W99"],included,[]), /Unknown/);
});
