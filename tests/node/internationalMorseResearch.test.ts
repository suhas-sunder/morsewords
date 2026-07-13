// Test-only fictional evidence. None of these claims describe a real Morse system.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  analyzeInternationalMorseResearch,
  assertResearchReadyForPromotion,
  inspectUnicode,
  validateInternationalMorseResearch,
  type CandidateMapping,
  type CandidateSystem,
  type InternationalMorseResearchDataset,
  type MappingClaim,
  type ResearchSource,
  type ReviewDecision,
  type UnicodeIdentity,
} from "../../scripts/morse/internationalMorseResearch.ts";
import { CURRENT_PRODUCTION_COLLISION_BASELINE, INTERNATIONAL_MORSE_RESEARCH_IMPORT } from "../../scripts/morse/internationalMorseResearchData.ts";
import { DEFAULT_GLOBAL_FORWARD_MAP, MORSE_COLLISION_GROUPS, MORSE_REGISTRY_ENTRIES } from "../../app/client/components/shared/morseRegistry.ts";

const identity: UnicodeIdentity = { canonical: "¤", acceptedForms: ["¤"], script: "Test", direction: "ltr", caseBehavior: "caseless", normalization: "NFC" };
const system: CandidateSystem = { id: "test-system", displayName: "Test-only system", classification: "national-adaptation", relationshipToInternational: "adaptation", languageIds: ["x-test"], script: "Test", direction: "ltr", completeCoverage: "documented-subset", inheritedPunctuation: "unknown", inheritedDigits: "unknown", inheritedProsigns: "unknown", spacingConvention: "standard", mixedSystemSafe: false, sourceIds: ["source-primary", "source-independent"] };
const primary: ResearchSource = { id: "source-primary", title: "Test primary", locator: "Table 1", language: "en", category: "international-standard", authorityTier: "primary-authority", primaryOrSecondary: "primary", temporalStatus: "current", directlyDefinesMapping: true, independenceGroupId: "primary", citationNote: "Test-only citation.", verificationStatus: "checked", url: "https://example.test/primary" };
const independent: ResearchSource = { id: "source-independent", title: "Test independent", locator: "Section 2", language: "en", category: "recognized-technical-reference", authorityTier: "independent-secondary", primaryOrSecondary: "secondary", temporalStatus: "current", directlyDefinesMapping: true, independenceGroupId: "independent", citationNote: "Test-only citation.", verificationStatus: "checked", url: "https://example.test/secondary" };
const candidate: CandidateMapping = { id: "candidate-one", systemId: system.id, languageId: "x-test", category: "letter", unicode: identity, claimIds: ["claim-primary", "claim-independent"], requestedReverseEligibility: "selected-system" };
const directClaim = (id: string, sourceId: string, pattern = ".-"): MappingClaim => ({ id, sourceId, candidateId: candidate.id, systemId: system.id, unicode: identity, characterOrToken: "¤", pattern, mappingKind: "direct", temporalStatus: "current", confidence: "high", extractionStatus: "verified-transcription" });
const decision: ReviewDecision = { id: "decision-one", candidateId: candidate.id, decision: "approved-for-system-scoped-reverse", evidenceState: "independently-corroborated", approvedCharacter: "¤", approvedPattern: ".-", approvedSystemId: system.id, approvedNormalization: "NFC", reverseEligibility: "selected-system", reviewerId: "test-reviewer", decidedOn: "2026-07-12", sourceSummary: "Test-only independent corroboration.", origin: "human-product-decision", method: "test-only independent review", supportingClaimIds: ["claim-primary", "claim-independent"], supportingSourceIds: [primary.id, independent.id], decisionActor: "test-reviewer", decisionDate: "2026-07-12", productApprovalRequired: false };
const dataset = (overrides: Partial<InternationalMorseResearchDataset> = {}): InternationalMorseResearchDataset => ({ systems: [system], sources: [primary, independent], candidates: [candidate], claims: [directClaim("claim-primary", primary.id), directClaim("claim-independent", independent.id)], recommendations: [], decisions: [decision], ...overrides });

test("independently corroborated fictional evidence produces one deterministic system-scoped vector", () => {
  const analysis = assertResearchReadyForPromotion(dataset());
  assert.equal(analysis.issues.filter((issue) => issue.severity === "error").length, 0);
  assert.deepEqual(analysis.testVectors, [{ decisionId: "decision-one", systemId: "test-system", languageId: "x-test", input: "¤", aliases: [], expectedMorse: ".-", expectedReverse: "¤", reverseEligibility: "selected-system" }]);
});

test("dependent secondary sources and incomplete exceptions cannot silently approve a mapping", () => {
  const dependent = { ...independent, id: "source-dependent", authorityTier: "dependent-secondary" as const, independenceGroupId: "primary", reproducesSourceIds: [primary.id] };
  const weak = dataset({ systems: [{ ...system, sourceIds: [primary.id, dependent.id] }], sources: [primary, dependent], candidates: [{ ...candidate, claimIds: ["claim-primary", "claim-dependent"] }], claims: [directClaim("claim-primary", primary.id), directClaim("claim-dependent", dependent.id)] });
  const codes = analyzeInternationalMorseResearch(weak).issues.map((issue) => issue.code);
  assert.ok(codes.includes("approval-insufficient-corroboration"));
  assert.throws(() => assertResearchReadyForPromotion(weak));
  const exception = dataset({ systems: [{ ...system, sourceIds: [primary.id] }], sources: [primary], candidates: [{ ...candidate, claimIds: ["claim-primary"] }], claims: [directClaim("claim-primary", primary.id)], decisions: [{ ...decision, supportingClaimIds: ["claim-primary"], supportingSourceIds: [primary.id], exception: { reason: "Test-only surviving source", reviewerId: "test-reviewer", decidedOn: "2026-07-12", evidenceSummary: "Test-only review", approvedScope: "forward-only" }, reverseEligibility: "forward-only" }] });
  assert.equal(assertResearchReadyForPromotion(exception).testVectors[0].expectedReverse, undefined);
});

test("conflicts preserve claims and block unqualified default reverse approval", () => {
  const conflicting = { ...candidate, id: "candidate-two", claimIds: ["claim-two"] };
  const characterConflict = directClaim("claim-character-conflict", independent.id, "-..");
  const conflictClaim = { ...directClaim("claim-two", independent.id, ".-"), candidateId: conflicting.id, characterOrToken: "¥", unicode: { ...identity, canonical: "¥", acceptedForms: ["¥"] } };
  const unsafe = dataset({ candidates: [{ ...candidate, claimIds: ["claim-primary", "claim-independent", "claim-character-conflict"] }, conflicting], claims: [directClaim("claim-primary", primary.id), directClaim("claim-independent", independent.id), characterConflict, conflictClaim], decisions: [{ ...decision, reverseEligibility: "default-global", decision: "approved-for-registry" }] });
  const analysis = analyzeInternationalMorseResearch(unsafe);
  assert.ok(analysis.conflicts.some((conflict) => conflict.kind === "same-system-character-pattern-conflict"));
  assert.ok(analysis.conflicts.some((conflict) => conflict.kind === "same-system-reverse-ambiguity"));
  assert.ok(analysis.issues.some((issue) => issue.code === "approval-unresolved-conflict"));
});

test("source, claim, Unicode, and review validation rejects malformed research records", () => {
  const malformed = dataset({ sources: [{ ...primary, locator: "", url: "not-a-url" }], claims: [{ ...directClaim("claim-primary", primary.id), pattern: "x", sourceId: "missing" }], decisions: [{ ...decision, reviewerId: undefined, decidedOn: undefined }] });
  const codes = analyzeInternationalMorseResearch(malformed).issues.map((issue) => issue.code);
  for (const code of ["missing-citation-locator", "invalid-source-url", "broken-claim-reference", "malformed-morse-pattern", "approval-missing-reviewer"]) assert.ok(codes.includes(code));
  assert.ok(inspectUnicode({ ...identity, canonical: "\ud800", acceptedForms: ["\ud800"] }).some((issue) => issue.code === "malformed-unicode"));
  assert.equal(inspectUnicode({ canonical: "e\u0301", acceptedForms: ["é", "e\u0301"], script: "Latin", direction: "ltr", caseBehavior: "bicameral", normalization: "NFC" }).length, 0);
  assert.equal(inspectUnicode({ canonical: "א", acceptedForms: ["א"], script: "Hebrew", direction: "rtl", caseBehavior: "caseless", normalization: "NFC" }).length, 0);
});

test("unapproved, transliteration-only, and historical candidates cannot become production vectors", () => {
  const transliteration = dataset({ claims: [{ ...directClaim("claim-primary", primary.id), mappingKind: "transliteration", characterOrToken: "¤" }], decisions: [{ ...decision, decision: "blocked-pending-review", evidenceState: "practical-transliteration-only" }] });
  const analysis = analyzeInternationalMorseResearch(transliteration);
  assert.equal(analysis.approvedCandidates.length, 0);
  assert.equal(analysis.testVectors.length, 0);
  assert.ok(analysis.issues.some((issue) => issue.code === "direct-transliteration-confusion"));
});

test("research validation accepts structurally valid pending evidence while strict promotion requires human decisions", () => {
  const pending = dataset({
    recommendations: [{ id: "recommendation-one", candidateId: candidate.id, evidenceState: "singly-attested", recommendedImplementationState: "approved-for-registry", recommendedReverseEligibility: "selected-system", sourceSummary: "Test-only source review.", unresolvedQuestions: ["A human reviewer must make the final decision."] }],
    decisions: [],
  });
  assert.equal(validateInternationalMorseResearch(pending).summary.approved, 0);
  assert.throws(() => assertResearchReadyForPromotion(pending), /promotion-unresolved-final-outcome/);
});

test("research validation rejects unsafe leads without treating recommendations as approvals", () => {
  const noEvidence = { ...candidate, claimIds: [] };
  const hypothetical = { ...primary, id: "hypothetical-standard", title: "Hypothetical standard", independenceGroupId: "" };
  const unsafe = dataset({
    sources: [hypothetical, independent],
    candidates: [noEvidence],
    claims: [{ ...directClaim("claim-primary", hypothetical.id), sourceId: hypothetical.id, assertsGlobalReverseSafety: true, notes: "approximate mapping" }],
    recommendations: [{ id: "recommendation-one", candidateId: noEvidence.id, evidenceState: "singly-attested", recommendedImplementationState: "approved-for-registry", recommendedReverseEligibility: "default-global", sourceSummary: "Test-only lead.", unresolvedQuestions: ["Needs review."] }],
    decisions: [],
  });
  const codes = analyzeInternationalMorseResearch(unsafe).issues.map((issue) => issue.code);
  for (const code of ["hypothetical-source", "missing-source-independence-group", "candidate-missing-evidence", "approximate-pattern"]) assert.ok(codes.includes(code));
});

test("a claim cannot call a cross-system Morse pattern globally reverse-safe", () => {
  const otherSystem = { ...system, id: "test-system-two", sourceIds: [primary.id, independent.id] };
  const otherCandidate = { ...candidate, id: "candidate-two", systemId: otherSystem.id, claimIds: ["claim-two"], unicode: { ...identity, canonical: "X", acceptedForms: ["X"] } };
  const analysis = analyzeInternationalMorseResearch(dataset({
    systems: [system, otherSystem],
    candidates: [candidate, otherCandidate],
    claims: [
      { ...directClaim("claim-primary", primary.id), assertsGlobalReverseSafety: true },
      { ...directClaim("claim-independent", independent.id) },
      { ...directClaim("claim-two", independent.id), candidateId: otherCandidate.id, systemId: otherSystem.id, unicode: otherCandidate.unicode, characterOrToken: "X" },
    ],
    recommendations: [],
    decisions: [],
  }));
  assert.ok(analysis.conflicts.some((conflict) => conflict.kind === "cross-system-reverse-ambiguity"));
  assert.ok(analysis.issues.some((issue) => issue.code === "unsafe-global-reverse-assertion"));
});

test("research validation flags aliases and unsupported status claims without changing production data", () => {
  const alias = { ...candidate, id: "alias-one", category: "alias" as const, aliasOfCandidateId: "alias-two" };
  const aliasTwo = { ...candidate, id: "alias-two", category: "alias" as const, aliasOfCandidateId: "alias-one" };
  const invalid = dataset({ candidates: [candidate, alias, aliasTwo], claims: [{ ...directClaim("claim-primary", primary.id), claimsCompleteAlphabet: true, temporalStatus: "current" }], sources: [{ ...primary, temporalStatus: "historical" }] });
  const codes = analyzeInternationalMorseResearch(invalid).issues.map((issue) => issue.code);
  assert.ok(codes.includes("circular-or-broken-alias"));
  assert.ok(codes.includes("incomplete-source-claimed-complete"));
  assert.ok(codes.includes("current-claim-historical-source-only"));
  assert.equal(INTERNATIONAL_MORSE_RESEARCH_IMPORT.systems.length, 4);
  assert.equal(INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.length, 175);
  assert.deepEqual(INTERNATIONAL_MORSE_RESEARCH_IMPORT.systems.map((item) => INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.filter((candidate) => candidate.systemId === item.id).length), [53, 65, 33, 24]);
  assert.equal(INTERNATIONAL_MORSE_RESEARCH_IMPORT.claims.length, 164);
  assert.equal(INTERNATIONAL_MORSE_RESEARCH_IMPORT.recommendations.length, 175);
  assert.equal(INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.length, 175);
  assert.equal(validateInternationalMorseResearch(INTERNATIONAL_MORSE_RESEARCH_IMPORT).issues.filter((issue) => issue.severity === "error").length, 0);
  assert.ok(INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.every((candidate) => candidate.claimIds.length > 0 || candidate.unresolvedEvidence));
  assert.ok(INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.filter((candidate) => candidate.requestedReverseEligibility !== "display-only").every((candidate) => candidate.unicode.unicodeNameStatus === "verified" && candidate.unicode.unicodeName && candidate.unicode.codePoints?.every((codePoint) => /^U\+[0-9A-F]{4,6}$/.test(codePoint))));
  assert.ok(INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.every((candidate) => candidate.unicode.nfc === candidate.unicode.canonical.normalize("NFC") && candidate.unicode.nfd === candidate.unicode.canonical.normalize("NFD")));
  const latinA = INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.find((candidate) => candidate.unicode.canonical === "A")!;
  const greekAlpha = INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.find((candidate) => candidate.unicode.canonical === "Α")!;
  const cyrillicA = INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.find((candidate) => candidate.unicode.canonical === "А")!;
  assert.notEqual(latinA.unicode.codePoints?.[0], greekAlpha.unicode.codePoints?.[0]);
  assert.notEqual(latinA.unicode.codePoints?.[0], cyrillicA.unicode.codePoints?.[0]);
  assert.equal(MORSE_REGISTRY_ENTRIES.length, 172);
  assert.equal(Object.keys(DEFAULT_GLOBAL_FORWARD_MAP).length, 53);
  assert.equal(MORSE_COLLISION_GROUPS.length, 48);
  assert.equal(CURRENT_PRODUCTION_COLLISION_BASELINE.length, 48);
  assert.equal(CURRENT_PRODUCTION_COLLISION_BASELINE.filter((group) => group.sameSystemCollisionSystemIds.length > 0).length, 1);
  assert.ok(CURRENT_PRODUCTION_COLLISION_BASELINE.every((group) => group.defaultGlobalReverseSafe));
  assert.equal(MORSE_REGISTRY_ENTRIES.filter((entry) => entry.provenance.verificationStatus === "objectively-source-verified").length, 111);
  assert.equal(MORSE_REGISTRY_ENTRIES.filter((entry) => entry.provenance.verificationStatus === "objectively-unsupported").length, 61);
  assert.ok(MORSE_REGISTRY_ENTRIES.every((entry) => entry.provenance.verificationDecisionId === `objective-${entry.id}`));
});

test("objective source adjudication resolves current evidence without impersonating a human reviewer", () => {
  const analysis = assertResearchReadyForPromotion(INTERNATIONAL_MORSE_RESEARCH_IMPORT);
  assert.equal(analysis.approvedCandidates.length, 111);
  assert.equal(analysis.testVectors.length, 111);
  assert.equal(INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.filter((decision) => decision.decision === "rejected-as-unsupported").length, 61);
  assert.equal(INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.filter((decision) => decision.decision === "approved-display-only").length, 3);
  assert.ok(INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.every((decision) => decision.origin === "objective-source-adjudication" && decision.decisionActor === "codex-source-verification"));
  assert.ok(INTERNATIONAL_MORSE_RESEARCH_IMPORT.decisions.every((decision) => decision.decision !== "blocked-pending-review" && decision.decision !== "product-policy-decision-required"));
});

test("complete Wabun evidence keeps JARL as the controlling table and procedural rows out of production vectors", () => {
  const jarl = INTERNATIONAL_MORSE_RESEARCH_IMPORT.sources.find((source) => source.id === "jarl-wabun-morse-table");
  const egov = INTERNATIONAL_MORSE_RESEARCH_IMPORT.sources.find((source) => source.id === "japan-e-gov-radio-station-operation-rules");
  assert.ok(jarl);
  assert.equal(jarl.issuingOrganization, "Japan Amateur Radio League, Inc.");
  assert.equal(jarl.locator, "モールス符号 page, 和文 table: all 48 kana, 濁点, 半濁点, 数字（欧文も同じ）, and 記号 rows");
  assert.equal(jarl.independenceGroupId, "jarl-wabun-morse-table");
  assert.ok(egov && egov.independenceGroupId !== jarl.independenceGroupId);

  const wabun = INTERNATIONAL_MORSE_RESEARCH_IMPORT.candidates.filter((candidate) => candidate.systemId === "japanese-wabun");
  assert.equal(wabun.filter((candidate) => candidate.category === "letter").length, 48);
  assert.equal(wabun.filter((candidate) => candidate.category === "digit").length, 10);
  assert.equal(wabun.filter((candidate) => candidate.category === "punctuation").length, 2);
  assert.equal(wabun.filter((candidate) => candidate.category === "control-token").length, 5);
  assert.equal(wabun.filter((candidate) => candidate.requestedReverseEligibility === "display-only").length, 3);
  assert.equal(assertResearchReadyForPromotion(INTERNATIONAL_MORSE_RESEARCH_IMPORT).testVectors.filter((vector) => vector.systemId === "japanese-wabun").length, 62);
});

test("research records stay Node-only and the saved report is never imported", () => {
  const files = readdirSync("app", { recursive: true }).filter((item) => String(item).endsWith(".ts") || String(item).endsWith(".tsx"));
  for (const file of files) {
    const source = readFileSync(join("app", String(file)), "utf8");
    assert.ok(!source.includes("internationalMorseResearch"));
    assert.ok(!source.includes("deep-research-report"));
  }
});
