/**
 * Node-only research verification. Candidate evidence never flows into the
 * client registry without an explicit approved decision.
 */

export type SourceCategory =
  | "international-standard" | "national-telecommunications-authority"
  | "government-or-military-manual" | "national-amateur-radio-organization"
  | "academic-publication" | "historical-telegraph-standard"
  | "recognized-technical-reference" | "secondary-compilation" | "unsourced-web-table";
export type AuthorityTier = "primary-authority" | "primary-historical" | "independent-secondary" | "dependent-secondary" | "unverified";
export type EvidenceState = "discovered" | "source-located" | "singly-attested" | "independently-corroborated" | "conflicting" | "historically-attested" | "current-standard" | "practical-transliteration-only" | "rejected" | "blocked-pending-review";
export type ImplementationState = "not-reviewed" | "approved-for-registry" | "approved-for-forward-only" | "approved-for-system-scoped-reverse" | "approved-display-only" | "rejected" | "rejected-as-unsupported" | "rejected-as-conflicting" | "rejected-as-mistranscribed" | "rejected-as-obsolete" | "product-policy-decision-required" | "blocked-pending-review";
export type SystemClassification = "core-international" | "international-extension" | "national-adaptation" | "related-separate-system" | "historical-telegraph-alphabet" | "transliteration-method" | "romanization-only" | "unsupported-or-speculative";
export type ReverseEligibility = "default-global" | "selected-system" | "forward-only" | "ambiguous-candidate" | "display-only" | "transliteration-only" | "historical-only";
export type WritingDirection = "ltr" | "rtl" | "neutral";

export type ResearchSource = {
  id: string; title: string; issuingOrganization?: string; authorOrEditor?: string;
  documentIdentifier?: string; editionOrRevision?: string; publicationDate?: string; accessedDate?: string;
  url?: string; archivedUrl?: string; locator: string; language: string; jurisdiction?: string;
  category: SourceCategory; authorityTier: AuthorityTier; primaryOrSecondary: "primary" | "secondary";
  temporalStatus: "current" | "historical" | "uncertain"; directlyDefinesMapping: boolean;
  reproducesSourceIds?: readonly string[]; independenceGroupId: string; reliabilityNotes?: string;
  limitations?: string; citationNote: string; verificationStatus: "unreviewed" | "checked" | "rejected";
};

export type UnicodeIdentity = {
  canonical: string; acceptedForms: readonly string[]; script: string; direction: WritingDirection;
  caseBehavior: "uppercase" | "lowercase" | "bicameral" | "caseless";
  normalization: "none" | "NFC" | "NFD" | "NFKC"; compatibilityChangesMeaning?: boolean;
  codePoints?: readonly string[]; unicodeName?: string; unicodeNameStatus?: "verified" | "pending-review";
  sourceIds?: readonly string[];
  uppercaseForm?: string; lowercaseForm?: string; nfc?: string; nfd?: string; nfkcPolicy?: "accept" | "reject" | "review";
  visuallySimilarButDistinct?: readonly string[];
};

export type CandidateSystem = {
  id: string; displayName: string; classification: SystemClassification; relationshipToInternational: "base" | "extension" | "adaptation" | "related" | "none";
  languageIds: readonly string[]; script: string; direction: WritingDirection; completeCoverage: "complete" | "documented-subset" | "unknown";
  inheritedPunctuation: "inherits" | "redefines" | "unknown"; inheritedDigits: "inherits" | "redefines" | "unknown";
  inheritedProsigns: "inherits" | "redefines" | "unknown"; spacingConvention: "standard" | "system-specific" | "unknown";
  mixedSystemSafe: boolean; sourceIds: readonly string[];
};

export type MappingClaim = {
  id: string; sourceId: string; candidateId: string; systemId: string; unicode: UnicodeIdentity;
  characterOrToken: string; pattern: string; context?: string; sourceTerminology?: string;
  mappingKind: "direct" | "transliteration" | "romanization" | "sending-convention" | "receiving-convention";
  temporalStatus: "current" | "historical" | "uncertain"; spacingSensitive?: boolean; confidence: "high" | "medium" | "low";
  extractionStatus: "verified-transcription" | "needs-review" | "machine-extracted"; claimsCompleteAlphabet?: boolean; notes?: string;
  assertsGlobalReverseSafety?: boolean;
};

export type UnresolvedEvidence = {
  reason: string; requiredEvidence: readonly string[]; leadSourceIds?: readonly string[];
};

export type SurfaceEligibility = {
  translator: "existing" | "not-applicable" | "requires-review";
  audio: "existing" | "not-applicable" | "requires-review";
  practice: "existing" | "not-applicable" | "requires-review";
  examples: "existing" | "not-applicable" | "requires-review";
  studySheet: "existing" | "not-applicable" | "requires-review";
  route: "existing" | "not-applicable" | "requires-review";
};

export type CandidateMapping = {
  id: string; systemId: string; languageId?: string; category: "letter" | "digit" | "punctuation" | "prosign" | "control-token" | "alias";
  unicode: UnicodeIdentity; claimIds: readonly string[]; requestedReverseEligibility: ReverseEligibility; aliasOfCandidateId?: string;
  unresolvedEvidence?: UnresolvedEvidence; existingSurfaceEligibility?: SurfaceEligibility;
};

export type ResearchRecommendation = {
  id: string; candidateId: string; evidenceState: EvidenceState;
  recommendedImplementationState: ImplementationState; recommendedReverseEligibility: ReverseEligibility;
  sourceSummary: string; unresolvedQuestions: readonly string[]; conflictDispositionRecommendation?: string;
};

export type RejectedResearchClaim = {
  id: string; candidateId?: string; reason: string; sourceReference?: string;
};

export type ReviewDecision = {
  id: string; candidateId: string; decision: ImplementationState; evidenceState: EvidenceState;
  approvedCharacter?: string; approvedPattern?: string; approvedSystemId?: string; approvedNormalization?: UnicodeIdentity["normalization"];
  reverseEligibility?: ReverseEligibility; sourceSummary?: string; conflictDisposition?: string; caveats?: string;
  reviewerId?: string; decidedOn?: string; exception?: { reason: string; reviewerId: string; decidedOn: string; evidenceSummary: string; approvedScope: ReverseEligibility };
  supersedesDecisionId?: string; implementationNotes?: string;
  origin: "objective-source-adjudication" | "human-product-decision" | "documented-policy-exception";
  method: string; supportingClaimIds: readonly string[]; supportingSourceIds: readonly string[];
  decisionActor: string; decisionDate: string; productApprovalRequired: boolean;
  evidenceException?: { kind: "single-controlling-source"; justification: string; limitation: string };
};

export type InternationalMorseResearchDataset = {
  systems: readonly CandidateSystem[]; sources: readonly ResearchSource[]; candidates: readonly CandidateMapping[];
  claims: readonly MappingClaim[]; recommendations: readonly ResearchRecommendation[]; decisions: readonly ReviewDecision[];
  rejectedClaims?: readonly RejectedResearchClaim[];
};

export type ResearchIssue = { code: string; message: string; ids?: readonly string[]; severity: "error" | "warning" };
export type ResearchConflict = { kind: string; candidateIds: readonly string[]; claimIds: readonly string[]; message: string };
export type GeneratedTestVector = { decisionId: string; systemId: string; languageId?: string; input: string; aliases: readonly string[]; expectedMorse: string; expectedReverse?: string; reverseEligibility: ReverseEligibility };
export type ResearchAnalysis = { issues: readonly ResearchIssue[]; conflicts: readonly ResearchConflict[]; approvedCandidates: readonly CandidateMapping[]; testVectors: readonly GeneratedTestVector[]; summary: Record<string, number> };

const PATTERN = /^[.-]+$/;
const APPROVALS = new Set<ImplementationState>(["approved-for-registry", "approved-for-forward-only", "approved-for-system-scoped-reverse"]);
const FINAL_OUTCOMES = new Set<ImplementationState>([...APPROVALS, "approved-display-only", "rejected", "rejected-as-unsupported", "rejected-as-conflicting", "rejected-as-mistranscribed", "rejected-as-obsolete"]);
const isUrl = (value: string) => { try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; } };
const unique = <T>(values: readonly T[]) => [...new Set(values)];

export function inspectUnicode(identity: UnicodeIdentity): ResearchIssue[] {
  const issues: ResearchIssue[] = [];
  const values = [identity.canonical, ...identity.acceptedForms];
  for (const value of values) {
    if (!value || hasInvalidSurrogate(value)) issues.push({ code: "malformed-unicode", message: "Unicode identity contains an empty or invalid scalar sequence", severity: "error" });
  }
  if (identity.normalization === "NFKC" && identity.compatibilityChangesMeaning) issues.push({ code: "unsafe-compatibility-normalization", message: "NFKC is marked as meaning-changing and requires review", severity: "warning" });
  return issues;
}

function hasInvalidSurrogate(value: string) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) { const next = value.charCodeAt(index + 1); if (!(next >= 0xdc00 && next <= 0xdfff)) return true; index += 1; }
    else if (code >= 0xdc00 && code <= 0xdfff) return true;
  }
  return false;
}

export function analyzeInternationalMorseResearch(dataset: InternationalMorseResearchDataset): ResearchAnalysis {
  const issues: ResearchIssue[] = [];
  const conflicts: ResearchConflict[] = [];
  const sources = new Map<string, ResearchSource>(); const systems = new Map<string, CandidateSystem>();
  const candidates = new Map<string, CandidateMapping>(); const claims = new Map<string, MappingClaim>(); const recommendations = new Map<string, ResearchRecommendation>(); const decisions = new Map<string, ReviewDecision>();
  const addUnique = <T extends { id: string }>(map: Map<string, T>, value: T, kind: string) => { if (map.has(value.id)) issues.push({ code: `duplicate-${kind}-id`, message: `Duplicate ${kind} id ${value.id}`, ids: [value.id], severity: "error" }); map.set(value.id, value); };
  dataset.sources.forEach((item) => addUnique(sources, item, "source")); dataset.systems.forEach((item) => addUnique(systems, item, "system"));
  dataset.candidates.forEach((item) => addUnique(candidates, item, "candidate")); dataset.claims.forEach((item) => addUnique(claims, item, "claim")); dataset.recommendations.forEach((item) => addUnique(recommendations, item, "recommendation")); dataset.decisions.forEach((item) => addUnique(decisions, item, "decision"));

  for (const source of dataset.sources) {
    if (!source.locator.trim()) issues.push({ code: "missing-citation-locator", message: `Source ${source.id} has no locator`, ids: [source.id], severity: "error" });
    if (source.url && !isUrl(source.url)) issues.push({ code: "invalid-source-url", message: `Source ${source.id} has invalid URL`, ids: [source.id], severity: "error" });
    if (source.archivedUrl && !isUrl(source.archivedUrl)) issues.push({ code: "invalid-archive-url", message: `Source ${source.id} has invalid archive URL`, ids: [source.id], severity: "error" });
    for (const parent of source.reproducesSourceIds ?? []) if (!sources.has(parent)) issues.push({ code: "broken-source-dependency", message: `Source ${source.id} references missing source ${parent}`, ids: [source.id, parent], severity: "error" });
    if (!source.independenceGroupId.trim()) issues.push({ code: "missing-source-independence-group", message: `Source ${source.id} has no independence group`, ids: [source.id], severity: "error" });
    if (/hypothetical|placeholder/i.test(`${source.id} ${source.title} ${source.documentIdentifier ?? ""}`)) issues.push({ code: "hypothetical-source", message: `Source ${source.id} is marked as hypothetical or placeholder`, ids: [source.id], severity: "error" });
  }
  const sourceIdentity = new Set<string>();
  for (const source of dataset.sources) {
    const identity = `${source.title}\0${source.documentIdentifier ?? ""}\0${source.editionOrRevision ?? ""}`;
    if (sourceIdentity.has(identity)) issues.push({ code: "duplicate-source-identity", message: `Duplicate source identity for ${source.id}`, ids: [source.id], severity: "error" });
    sourceIdentity.add(identity);
  }
  for (const system of dataset.systems) for (const sourceId of system.sourceIds) if (!sources.has(sourceId)) issues.push({ code: "unknown-system-source", message: `System ${system.id} references missing source ${sourceId}`, ids: [system.id, sourceId], severity: "error" });
  for (const candidate of dataset.candidates) {
    if (!systems.has(candidate.systemId)) issues.push({ code: "unknown-system", message: `Candidate ${candidate.id} uses unknown system`, ids: [candidate.id], severity: "error" });
    issues.push(...inspectUnicode(candidate.unicode));
    for (const sourceId of candidate.unicode.sourceIds ?? []) if (!sources.has(sourceId)) issues.push({ code: "unknown-unicode-source", message: `Candidate ${candidate.id} references missing Unicode source ${sourceId}`, ids: [candidate.id, sourceId], severity: "error" });
    for (const claimId of candidate.claimIds) if (!claims.has(claimId)) issues.push({ code: "missing-claim", message: `Candidate ${candidate.id} references missing claim`, ids: [candidate.id, claimId], severity: "error" });
    if (!candidate.claimIds.length && !candidate.unresolvedEvidence) issues.push({ code: "candidate-missing-evidence", message: `Candidate ${candidate.id} has neither claims nor unresolved evidence`, ids: [candidate.id], severity: "error" });
    if (candidate.unresolvedEvidence && (!candidate.unresolvedEvidence.reason.trim() || !candidate.unresolvedEvidence.requiredEvidence.length)) issues.push({ code: "invalid-unresolved-evidence", message: `Candidate ${candidate.id} has incomplete unresolved evidence`, ids: [candidate.id], severity: "error" });
    for (const sourceId of candidate.unresolvedEvidence?.leadSourceIds ?? []) if (!sources.has(sourceId)) issues.push({ code: "unknown-unresolved-evidence-source", message: `Candidate ${candidate.id} references missing evidence lead ${sourceId}`, ids: [candidate.id, sourceId], severity: "error" });
    if (candidate.category === "alias" && !candidate.aliasOfCandidateId) issues.push({ code: "alias-missing-target", message: `Alias ${candidate.id} has no canonical candidate`, ids: [candidate.id], severity: "error" });
  }
  for (const candidate of dataset.candidates.filter((item) => item.category === "alias")) {
    const visited = new Set<string>(); let current: CandidateMapping | undefined = candidate;
    while (current?.aliasOfCandidateId) { if (visited.has(current.id) || !candidates.has(current.aliasOfCandidateId)) { issues.push({ code: "circular-or-broken-alias", message: `Alias ${candidate.id} does not resolve to a canonical candidate`, ids: [candidate.id], severity: "error" }); break; } visited.add(current.id); current = candidates.get(current.aliasOfCandidateId); }
  }
  for (const claim of dataset.claims) {
    if (!sources.has(claim.sourceId) || !candidates.has(claim.candidateId) || !systems.has(claim.systemId)) issues.push({ code: "broken-claim-reference", message: `Claim ${claim.id} has an unknown source, candidate, or system`, ids: [claim.id], severity: "error" });
    if (!PATTERN.test(claim.pattern)) issues.push({ code: "malformed-morse-pattern", message: `Claim ${claim.id} has malformed pattern`, ids: [claim.id], severity: "error" });
    const claimSystem = systems.get(claim.systemId); const claimSource = sources.get(claim.sourceId);
    if (claim.claimsCompleteAlphabet && claimSystem?.completeCoverage === "documented-subset") issues.push({ code: "incomplete-source-claimed-complete", message: `Claim ${claim.id} presents a documented subset as complete`, ids: [claim.id], severity: "error" });
    if (claim.temporalStatus === "current" && claimSource?.temporalStatus === "historical") issues.push({ code: "current-claim-historical-source-only", message: `Claim ${claim.id} needs current evidence`, ids: [claim.id], severity: "error" });
    if (claim.mappingKind !== "direct" && claim.mappingKind !== "receiving-convention" && claim.mappingKind !== "sending-convention" && claim.characterOrToken === claim.unicode.canonical) issues.push({ code: "direct-transliteration-confusion", message: `Claim ${claim.id} classifies a direct Unicode character as a transform`, ids: [claim.id], severity: "warning" });
    issues.push(...inspectUnicode(claim.unicode));
    if (/approx/i.test(claim.pattern) || /approx/i.test(claim.notes ?? "")) issues.push({ code: "approximate-pattern", message: `Claim ${claim.id} uses an approximate pattern`, ids: [claim.id], severity: "error" });
  }
  const claimGroups = new Map<string, MappingClaim[]>();
  for (const claim of dataset.claims) claimGroups.set(`${claim.systemId}\0${claim.unicode.canonical}`, [...(claimGroups.get(`${claim.systemId}\0${claim.unicode.canonical}`) ?? []), claim]);
  for (const group of claimGroups.values()) if (unique(group.map((claim) => claim.pattern)).length > 1) conflicts.push({ kind: "same-system-character-pattern-conflict", candidateIds: unique(group.map((claim) => claim.candidateId)).sort(), claimIds: group.map((claim) => claim.id).sort(), message: `Conflicting patterns for ${group[0].unicode.canonical} in ${group[0].systemId}` });
  const reverseGroups = new Map<string, MappingClaim[]>();
  for (const claim of dataset.claims.filter((claim) => claim.mappingKind === "direct")) reverseGroups.set(`${claim.systemId}\0${claim.pattern}`, [...(reverseGroups.get(`${claim.systemId}\0${claim.pattern}`) ?? []), claim]);
  for (const group of reverseGroups.values()) if (unique(group.map((claim) => claim.unicode.canonical)).length > 1) conflicts.push({ kind: "same-system-reverse-ambiguity", candidateIds: unique(group.map((claim) => claim.candidateId)).sort(), claimIds: group.map((claim) => claim.id).sort(), message: `Reverse ambiguity for ${group[0].pattern} in ${group[0].systemId}` });
  const globalReverseGroups = new Map<string, MappingClaim[]>();
  for (const claim of dataset.claims.filter((claim) => claim.mappingKind === "direct")) globalReverseGroups.set(claim.pattern, [...(globalReverseGroups.get(claim.pattern) ?? []), claim]);
  for (const group of globalReverseGroups.values()) {
    const systemsForPattern = unique(group.map((claim) => claim.systemId));
    if (systemsForPattern.length > 1) conflicts.push({ kind: "cross-system-reverse-ambiguity", candidateIds: unique(group.map((claim) => claim.candidateId)).sort(), claimIds: group.map((claim) => claim.id).sort(), message: `Cross-system ambiguity for ${group[0].pattern}` });
  }
  for (const claim of dataset.claims.filter((item) => item.assertsGlobalReverseSafety)) {
    const group = globalReverseGroups.get(claim.pattern) ?? [];
    if (unique(group.map((item) => item.systemId)).length > 1) issues.push({ code: "unsafe-global-reverse-assertion", message: `Claim ${claim.id} calls a cross-system pattern globally reverse-safe`, ids: [claim.id], severity: "error" });
  }
  for (const recommendation of dataset.recommendations) {
    const candidate = candidates.get(recommendation.candidateId);
    if (!candidate) issues.push({ code: "unknown-recommendation-candidate", message: `Recommendation ${recommendation.id} has an unknown candidate`, ids: [recommendation.id], severity: "error" });
    if (!recommendation.sourceSummary.trim() || !recommendation.unresolvedQuestions.length) issues.push({ code: "incomplete-recommendation", message: `Recommendation ${recommendation.id} needs a source summary and unresolved questions`, ids: [recommendation.id], severity: "error" });
    if (recommendation.recommendedImplementationState === "not-reviewed") issues.push({ code: "invalid-recommendation-state", message: `Recommendation ${recommendation.id} cannot recommend not-reviewed`, ids: [recommendation.id], severity: "error" });
  }
  for (const decision of dataset.decisions) {
    const candidate = candidates.get(decision.candidateId); const decisionClaims = candidate ? candidate.claimIds.map((id) => claims.get(id)).filter((claim): claim is MappingClaim => Boolean(claim)) : [];
    if (!candidate) issues.push({ code: "unknown-decision-candidate", message: `Decision ${decision.id} has unknown candidate`, ids: [decision.id], severity: "error" });
    if (!decision.method.trim() || !decision.decisionActor.trim() || !decision.decisionDate.trim()) issues.push({ code: "incomplete-decision-record", message: `Decision ${decision.id} lacks method, actor, or date`, ids: [decision.id], severity: "error" });
    if (!decision.supportingSourceIds.length || decision.supportingSourceIds.some((sourceId) => !sources.has(sourceId))) issues.push({ code: "invalid-decision-sources", message: `Decision ${decision.id} references no valid source`, ids: [decision.id], severity: "error" });
    if (decision.supportingClaimIds.some((claimId) => !claims.has(claimId))) issues.push({ code: "invalid-decision-claims", message: `Decision ${decision.id} references a missing claim`, ids: [decision.id], severity: "error" });
    if (decision.origin === "objective-source-adjudication" && /^suhas/i.test(decision.decisionActor)) issues.push({ code: "objective-decision-impersonates-human", message: `Decision ${decision.id} uses a human actor for objective adjudication`, ids: [decision.id], severity: "error" });
    if (decision.productApprovalRequired && decision.decision !== "product-policy-decision-required") issues.push({ code: "inconsistent-product-policy-decision", message: `Decision ${decision.id} requires product approval without the matching outcome`, ids: [decision.id], severity: "error" });
    if (APPROVALS.has(decision.decision)) {
      if (decision.origin === "human-product-decision" && (!decision.reviewerId || !decision.decidedOn)) issues.push({ code: "approval-missing-reviewer", message: `Human approval ${decision.id} requires reviewer and date`, ids: [decision.id], severity: "error" });
      const independentGroups = unique(decisionClaims.map((claim) => sources.get(claim.sourceId)?.independenceGroupId).filter(Boolean) as string[]);
      const hasPrimary = decisionClaims.some((claim) => sources.get(claim.sourceId)?.authorityTier.startsWith("primary"));
      const unresolved = conflicts.some((conflict) => conflict.candidateIds.includes(decision.candidateId));
      const hasObjectiveException = decision.origin === "objective-source-adjudication" && decision.evidenceException?.kind === "single-controlling-source" && decision.evidenceException.justification && decision.evidenceException.limitation;
      if ((!hasPrimary || independentGroups.length < 2) && !decision.exception && !hasObjectiveException) issues.push({ code: "approval-insufficient-corroboration", message: `Approval ${decision.id} needs a primary and independent corroboration or documented exception`, ids: [decision.id], severity: "error" });
      if (unresolved && !decision.conflictDisposition) issues.push({ code: "approval-unresolved-conflict", message: `Approval ${decision.id} leaves a conflict unresolved`, ids: [decision.id], severity: "error" });
      if (decision.exception && (!decision.exception.reason || !decision.exception.reviewerId || !decision.exception.decidedOn || !decision.exception.evidenceSummary)) issues.push({ code: "invalid-approval-exception", message: `Decision ${decision.id} has incomplete exception`, ids: [decision.id], severity: "error" });
      if (decision.reverseEligibility === "default-global" && unresolved) issues.push({ code: "unsafe-default-reverse", message: `Decision ${decision.id} cannot approve ambiguous default reverse decoding`, ids: [decision.id], severity: "error" });
    }
  }
  const approvedCandidates = dataset.candidates.filter((candidate) => dataset.decisions.some((decision) => decision.candidateId === candidate.id && APPROVALS.has(decision.decision)) && !issues.some((issue) => issue.ids?.some((id) => dataset.decisions.some((decision) => decision.id === id && decision.candidateId === candidate.id))));
  const testVectors = approvedCandidates.flatMap((candidate) => dataset.decisions.filter((decision) => decision.candidateId === candidate.id && APPROVALS.has(decision.decision)).map((decision) => ({ decisionId: decision.id, systemId: decision.approvedSystemId ?? candidate.systemId, ...(candidate.languageId ? { languageId: candidate.languageId } : {}), input: decision.approvedCharacter ?? candidate.unicode.canonical, aliases: candidate.unicode.acceptedForms.filter((value) => value !== candidate.unicode.canonical), expectedMorse: decision.approvedPattern ?? claims.get(candidate.claimIds[0])?.pattern ?? "", ...(decision.reverseEligibility === "forward-only" ? {} : { expectedReverse: decision.approvedCharacter ?? candidate.unicode.canonical }), reverseEligibility: decision.reverseEligibility ?? candidate.requestedReverseEligibility }))).sort((a, b) => a.decisionId.localeCompare(b.decisionId));
  return { issues, conflicts, approvedCandidates, testVectors, summary: { systems: dataset.systems.length, sources: dataset.sources.length, claims: dataset.claims.length, candidates: dataset.candidates.length, recommendations: dataset.recommendations.length, rejectedClaims: dataset.rejectedClaims?.length ?? 0, corroborated: dataset.decisions.filter((decision) => decision.evidenceState === "independently-corroborated").length, conflicting: conflicts.length, blocked: dataset.recommendations.filter((recommendation) => recommendation.recommendedImplementationState === "blocked-pending-review").length, approved: approvedCandidates.length, forwardOnly: testVectors.filter((vector) => vector.reverseEligibility === "forward-only").length, reverseApproved: testVectors.filter((vector) => vector.expectedReverse).length, unresolvedUnicodeIssues: issues.filter((issue) => issue.code.includes("unicode")).length, unresolvedSystemClassificationIssues: issues.filter((issue) => issue.code.includes("system")).length } };
}

export function validateInternationalMorseResearch(dataset: InternationalMorseResearchDataset) {
  const analysis = analyzeInternationalMorseResearch(dataset);
  const blocking = analysis.issues.filter((issue) => issue.severity === "error");
  if (blocking.length) throw new Error(`International Morse research is not ready: ${blocking.map((issue) => issue.code).join(", ")}`);
  return analysis;
}

export function assertResearchReadyForPromotion(dataset: InternationalMorseResearchDataset) {
  const analysis = validateInternationalMorseResearch(dataset);
  const finalIds = new Set(dataset.decisions.filter((decision) => FINAL_OUTCOMES.has(decision.decision) && !decision.productApprovalRequired).map((decision) => decision.candidateId));
  const pending = dataset.candidates.filter((candidate) => !finalIds.has(candidate.id));
  if (pending.length) throw new Error(`International Morse promotion is blocked: promotion-unresolved-final-outcome (${pending.length} candidate${pending.length === 1 ? "" : "s"})`);
  return analysis;
}
