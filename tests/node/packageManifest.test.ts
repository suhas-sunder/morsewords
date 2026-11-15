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
  const included = [...current.packages.slice(0,15).map(p => p.packageId), "TRANCHE-A-HARDENING"];
  const base = selectPackageGates(current,["W16"],included,[]);
  assert.ok(base.includes("npm run books:navigation-index:check"));
  assert.ok(!base.some(c => c.includes("playback-ownership")));
  assert.ok(selectPackageGates(current,["W16"],included,["shared-audio"]).some(c => c.includes("playback-ownership")));
  assert.throws(() => selectPackageGates(current,["W16"],[],[]), /requires/);
  assert.throws(() => selectPackageGates(current,["W52"],included,[]), /not validated/);
  assert.throws(() => selectPackageGates(current,["W99"],included,[]), /Unknown/);
});

const throughW16 = [
  ...current.packages.slice(0, 16).map(p => p.packageId),
  ...current.internalPackages.map(p => p.packageId),
];
const throughW18 = [...throughW16, "W17", "W18"];
function releasedClone(...ids: string[]): PackageManifest {
  const m = structuredClone(current);
  for (const id of ids) {
    const p = [...m.packages, ...m.internalPackages].find(p => p.packageId === id)!;
    p.status = "RELEASED";
    p.productionEvidence = {
      candidateSha: "a".repeat(40), deployId: `synthetic-test-${id}`,
      deployedAt: "2027-01-01T12:00:00Z", ownerDecision: "Synthetic test approval only",
      liveChecks: "Synthetic test checks only",
    };
  }
  assert.deepEqual(validatePackageManifest(m), []);
  return m;
}

test("rejects W19 with W18 alone and reports the missing transitive chain", () => {
  assert.throws(() => selectPackageGates(current, ["W19"], ["W18"], []), /W19 requires W18 -> W17; W17 is neither released nor selected\/included/);
});
test("accepts W19 with W17 and W18 plus their full current prerequisites", () => {
  // W17 itself requires W16 and Tranche B: none of the current records is released.
  assert.throws(() => selectPackageGates(current, ["W19"], ["W17", "W18"], []), /W19 requires W18 -> W17 -> W16/);
  assert.ok(selectPackageGates(current, ["W19"], throughW18, []).some(c => c.includes("answer-feedback.spec.ts")));
});
test("checks an explicitly included package even outside the selected dependency chain", () => {
  assert.throws(() => selectPackageGates(current, ["W19"], [...throughW18, "W23"], []), /W23 requires W22/);
});
test("released prerequisites satisfy availability without explicit inclusion", () => {
  const m = releasedClone("W18");
  assert.ok(selectPackageGates(m, ["W19"], [...throughW16, "W17"], []).some(c => c.includes("answer-feedback.spec.ts")));
  assert.throws(() => selectPackageGates(m, ["W19"], [], []), /W19 requires W18 -> W17/);
});
test("released W09 activates its persistent gate without explicit inclusion", () => {
  const m = releasedClone("W09");
  const command = "npm run books:navigation-index:check";
  // Avoid a false positive from the same command already present in common gates.
  for (const p of m.packages) {
    p.commonGates = p.commonGates!.filter(c => c !== command);
    p.packageSpecificGates = p.packageSpecificGates!.filter(c => c !== command);
  }
  assert.deepEqual(validatePackageManifest(m), []);
  assert.ok(selectPackageGates(m, ["W19"], throughW18.filter(id => id !== "W09"), []).includes(command));
  const unreleased = structuredClone(m);
  unreleased.packages.find(p => p.packageId === "W09")!.status = "VALIDATED";
  delete unreleased.packages.find(p => p.packageId === "W09")!.productionEvidence;
  assert.ok(!selectPackageGates(unreleased, ["W01"], [], []).includes(command));
});
test("released W12 affected gate still requires the manually reviewed surface", () => {
  const m = releasedClone("W12");
  const included = throughW18.filter(id => id !== "W12");
  const command = m.persistentGates.find(g => g.introducedBy === "W12")!.commands[0];
  assert.ok(!selectPackageGates(m, ["W19"], included, []).includes(command));
  assert.ok(!selectPackageGates(m, ["W19"], included, ["library-runtime"]).includes(command));
  assert.ok(selectPackageGates(m, ["W19"], included, ["shared-audio"]).includes(command));
});
test("selected proposed packages and unknown selected or included IDs remain rejected", () => {
  assert.throws(() => selectPackageGates(current, ["W25"], throughW18, []), /W25 is not validated/);
  assert.throws(() => selectPackageGates(current, ["W99"], [], []), /Unknown package W99/);
  assert.throws(() => selectPackageGates(current, ["W01"], ["W99"], []), /Unknown package W99/);
});
for (const status of ["PROPOSED", "BLOCKED", "IN_PROGRESS"]) test(`included ${status} packages cannot enter the candidate`, () => {
  const m = structuredClone(current);
  m.packages.find(p => p.packageId === "W25")!.status = status;
  assert.deepEqual(validatePackageManifest(m), []);
  assert.throws(() => selectPackageGates(m, ["W19"], [...throughW18, "W25"], []), /W25 is not validated/);
});
test("selection remains read-only and emitted commands stay deduplicated", () => {
  const m = releasedClone("W09", "W12");
  const before = structuredClone(m);
  const selected = ["W19", "W19"], included = throughW18.filter(id => !["W09", "W12"].includes(id)), surfaces = ["shared-audio"];
  const inputs = structuredClone({ selected, included, surfaces });
  const commands = selectPackageGates(m, selected, included, surfaces);
  assert.deepEqual(m, before);
  assert.deepEqual({ selected, included, surfaces }, inputs);
  assert.equal(commands.length, new Set(commands).size);
});
