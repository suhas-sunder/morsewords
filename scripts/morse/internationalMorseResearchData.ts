/**
 * Current production-baseline research only. This Node-only dataset is not a
 * source of production mappings and contains no human approvals.
 */
import { MORSE_COLLISION_GROUPS, MORSE_REGISTRY_ENTRIES, MORSE_SYSTEMS, type MorseRegistryEntry } from "../../app/client/components/shared/morseRegistry.ts";
import type {
  CandidateMapping,
  CandidateSystem,
  InternationalMorseResearchDataset,
  MappingClaim,
  ResearchRecommendation,
  ReviewDecision,
  UnicodeIdentity,
} from "./internationalMorseResearch.ts";

const ITU_SOURCE_ID = "itu-r-m1677-1";
const JARL_SOURCE_ID = "jarl-wabun-morse-table";
const E_GOV_SOURCE_ID = "japan-e-gov-radio-station-operation-rules";
const UNICODE_SOURCE_ID = "unicode-ucd-unicode-data";
const RUSSIAN_SOURCE_ID = "russian-minpromtorg-order-4682-2023";
const GREEK_SOURCE_ID = "raag-gtc-club-statement";
const ITU_WRITTEN_CHARACTERS = new Set([".", ",", ":", "?", "'", "-", "/", "(", ")", '"', "=", "+", "@"]);
const ASCII_SYMBOL_NAMES: Record<string, string> = { ".": "FULL STOP", ",": "COMMA", "?": "QUESTION MARK", "/": "SOLIDUS", "'": "APOSTROPHE", "!": "EXCLAMATION MARK", "-": "HYPHEN-MINUS", "@": "COMMERCIAL AT", ":": "COLON", ";": "SEMICOLON", "=": "EQUALS SIGN", "+": "PLUS SIGN", '"': "QUOTATION MARK", "(": "LEFT PARENTHESIS", ")": "RIGHT PARENTHESIS", "&": "AMPERSAND", "_": "LOW LINE" };
const CYRILLIC_NAMES: Record<string, string> = { "А": "A", "Б": "BE", "В": "VE", "Г": "GHE", "Д": "DE", "Е": "IE", "Ё": "IO", "Ж": "ZHE", "З": "ZE", "И": "I", "Й": "SHORT I", "К": "KA", "Л": "EL", "М": "EM", "Н": "EN", "О": "O", "П": "PE", "Р": "ER", "С": "ES", "Т": "TE", "У": "U", "Ф": "EF", "Х": "HA", "Ц": "TSE", "Ч": "CHE", "Ш": "SHA", "Щ": "SHCHA", "Ъ": "HARD SIGN", "Ы": "YERU", "Ь": "SOFT SIGN", "Э": "E", "Ю": "YU", "Я": "YA" };
const GREEK_NAMES: Record<string, string> = { "Α": "ALPHA", "Β": "BETA", "Γ": "GAMMA", "Δ": "DELTA", "Ε": "EPSILON", "Ζ": "ZETA", "Η": "ETA", "Θ": "THETA", "Ι": "IOTA", "Κ": "KAPPA", "Λ": "LAMDA", "Μ": "MU", "Ν": "NU", "Ξ": "XI", "Ο": "OMICRON", "Π": "PI", "Ρ": "RHO", "Σ": "SIGMA", "Τ": "TAU", "Υ": "UPSILON", "Φ": "PHI", "Χ": "CHI", "Ψ": "PSI", "Ω": "OMEGA" };

const unicodeNameFor = (entry: MorseRegistryEntry) => {
  const character = entry.character;
  if (/^[A-Z]$/.test(character)) return `LATIN CAPITAL LETTER ${character}`;
  if (/^[0-9]$/.test(character)) return `DIGIT ${["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"][Number(character)]}`;
  if (ASCII_SYMBOL_NAMES[character]) return ASCII_SYMBOL_NAMES[character];
  if (CYRILLIC_NAMES[character]) return `CYRILLIC CAPITAL LETTER ${CYRILLIC_NAMES[character]}`;
  if (GREEK_NAMES[character]) return `GREEK CAPITAL LETTER ${GREEK_NAMES[character]}`;
  const reading = entry.presentation?.reading;
  if (entry.systemId === "japanese-wabun" && reading) return `KATAKANA LETTER ${reading.toUpperCase()}`;
  if (entry.systemId === "japanese-wabun" && entry.character === "゛") return "KATAKANA-HIRAGANA VOICED SOUND MARK";
  if (entry.systemId === "japanese-wabun" && entry.character === "゜") return "KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK";
  if (entry.systemId === "japanese-wabun" && entry.character === "ー") return "KATAKANA-HIRAGANA PROLONGED SOUND MARK";
  if (entry.systemId === "japanese-wabun" && entry.character === "、") return "IDEOGRAPHIC COMMA";
  throw new Error(`Missing Unicode name for current production entry ${entry.id}`);
};

const categoryFor = (entry: MorseRegistryEntry): CandidateMapping["category"] =>
  entry.category === "digit"
    ? "digit"
    : entry.category === "punctuation"
      ? "punctuation"
      : entry.category === "control-token"
        ? "control-token"
        : entry.category === "prosign"
          ? "prosign"
          : entry.category === "input-alias" || entry.category === "transliteration-alias"
            ? "alias"
            : "letter";

const unicodeFor = (entry: MorseRegistryEntry): UnicodeIdentity => ({
  canonical: entry.character,
  acceptedForms: [...new Set(entry.normalizedInputs)],
  script: entry.script,
  direction: "ltr",
  caseBehavior: entry.caseBehavior === "uppercase" ? "uppercase" : entry.caseBehavior === "preserve" ? "bicameral" : "caseless",
  normalization: entry.normalization,
  codePoints: entry.codePoints,
  unicodeName: unicodeNameFor(entry),
  unicodeNameStatus: "verified",
  sourceIds: [UNICODE_SOURCE_ID],
  nfc: entry.character.normalize("NFC"),
  nfd: entry.character.normalize("NFD"),
  nfkcPolicy: "review",
});

const systemFor = (id: CandidateSystem["id"]): CandidateSystem => {
  const system = MORSE_SYSTEMS.find((item) => item.id === id)!;
  const classification = id === "international" ? "core-international" : id === "japanese-wabun" ? "related-separate-system" : "national-adaptation";
  return {
    id: system.id,
    displayName: system.displayName,
    classification,
    relationshipToInternational: id === "international" ? "base" : id === "japanese-wabun" ? "related" : "adaptation",
    languageIds: system.languageIds,
    script: system.script,
    direction: "ltr",
    completeCoverage: id === "japanese-wabun" ? "complete" : "documented-subset",
    inheritedPunctuation: id === "japanese-wabun" ? "redefines" : "unknown",
    inheritedDigits: id === "japanese-wabun" ? "inherits" : "unknown",
    inheritedProsigns: "unknown",
    spacingConvention: id === "japanese-wabun" ? "system-specific" : "unknown",
    mixedSystemSafe: false,
    sourceIds: id === "international" ? [ITU_SOURCE_ID] : id === "japanese-wabun" ? [JARL_SOURCE_ID, E_GOV_SOURCE_ID] : [],
  };
};

const isWrittenItuCharacter = (entry: MorseRegistryEntry) =>
  entry.systemId === "international" && (entry.category === "letter" || entry.category === "digit" || ITU_WRITTEN_CHARACTERS.has(entry.character));

const isDirectlyAttested = (entry: MorseRegistryEntry) =>
  isWrittenItuCharacter(entry) || entry.systemId === "japanese-wabun";

const directSourceIdsFor = (entry: MorseRegistryEntry) => {
  if (entry.systemId !== "japanese-wabun") return [ITU_SOURCE_ID];
  return entry.category === "language-letter" || entry.category === "control-token"
    ? [JARL_SOURCE_ID, E_GOV_SOURCE_ID]
    : [JARL_SOURCE_ID];
};

const directClaimIdsFor = (entry: MorseRegistryEntry) =>
  directSourceIdsFor(entry).map((sourceId) => `claim-${entry.id}-${sourceId}`);

const unresolvedFor = (entry: MorseRegistryEntry) => ({
  reason: entry.systemId === "international"
    ? "This existing compatibility punctuation symbol is not a literal written character in the verified ITU-R M.1677-1 Annex 1 table."
    : "No exact primary or official source and locator has been independently verified for this existing repository reference entry.",
  requiredEvidence: entry.systemId === "international"
    ? ["An exact primary standard locator defining this written symbol and Morse pattern, or a documented decision to keep it as repository compatibility behavior."]
    : ["An official or primary system table with an exact page, table, or appendix locator.", "A human review of reverse-decoding scope and any same-system ambiguity."],
});

// JARL includes these procedural table rows, but does not define them as
// ordinary Unicode characters for converter input. Keep their evidence in the
// Node-only dataset so table completeness never turns into a speculative map.
const WABUN_DISPLAY_ONLY_SOURCE_ROWS = [
  { id: "ja-display-paragraph", token: "段落", pattern: ".-.-..", label: "Wabun paragraph procedure" },
  { id: "ja-display-lower-bracket", token: "下向括弧", pattern: "-.--.-", label: "Wabun lower bracket procedure" },
  { id: "ja-display-upper-bracket", token: "上向括弧", pattern: ".-..-.", label: "Wabun upper bracket procedure" },
] as const;

const displayOnlyUnicode = (token: string): UnicodeIdentity => ({
  canonical: token,
  acceptedForms: [token],
  script: "Source table label",
  direction: "ltr",
  caseBehavior: "caseless",
  normalization: "NFC",
  codePoints: Array.from(token, (value) => `U+${value.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`),
  unicodeNameStatus: "pending-review",
  sourceIds: [UNICODE_SOURCE_ID, JARL_SOURCE_ID],
  nfc: token.normalize("NFC"),
  nfd: token.normalize("NFD"),
  nfkcPolicy: "reject",
});

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_SYSTEMS = MORSE_SYSTEMS.map((system) => systemFor(system.id));

const registryCandidates: readonly CandidateMapping[] = MORSE_REGISTRY_ENTRIES.map((entry) => ({
  id: entry.id,
  systemId: entry.systemId,
  ...(entry.languageIds[0] === "en" ? {} : { languageId: entry.languageIds[0] }),
  category: categoryFor(entry),
  unicode: unicodeFor(entry),
  claimIds: isDirectlyAttested(entry) ? directClaimIdsFor(entry) : [],
  requestedReverseEligibility: entry.defaultGlobal ? "default-global" : "selected-system",
  ...(isDirectlyAttested(entry) ? {} : { unresolvedEvidence: unresolvedFor(entry) }),
  existingSurfaceEligibility: {
    translator: entry.systemId === "international" ? "existing" : "requires-review",
    audio: "requires-review",
    practice: "requires-review",
    examples: "requires-review",
    studySheet: entry.systemId === "international" ? "not-applicable" : "existing",
    route: entry.systemId === "international" ? "not-applicable" : "existing",
  },
}));

const wabunDisplayOnlyCandidates: readonly CandidateMapping[] = WABUN_DISPLAY_ONLY_SOURCE_ROWS.map((row) => ({
  id: row.id,
  systemId: "japanese-wabun",
  languageId: "ja",
  category: "control-token",
  unicode: displayOnlyUnicode(row.token),
  claimIds: [`claim-${row.id}-${JARL_SOURCE_ID}`],
  requestedReverseEligibility: "display-only",
  existingSurfaceEligibility: {
    translator: "requires-review",
    audio: "requires-review",
    practice: "requires-review",
    examples: "requires-review",
    studySheet: "requires-review",
    route: "requires-review",
  },
}));

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_CANDIDATES: readonly CandidateMapping[] = [
  ...registryCandidates,
  ...wabunDisplayOnlyCandidates,
];

const registryClaims: readonly MappingClaim[] = MORSE_REGISTRY_ENTRIES
  .filter(isDirectlyAttested)
  .flatMap((entry) => directSourceIdsFor(entry).map((sourceId) => ({
    id: `claim-${entry.id}-${sourceId}`,
    sourceId,
    candidateId: entry.id,
    systemId: entry.systemId,
    unicode: unicodeFor(entry),
    characterOrToken: entry.character,
    pattern: entry.pattern,
    mappingKind: "direct",
    temporalStatus: "current",
    confidence: "high",
    extractionStatus: "verified-transcription",
    notes: entry.systemId === "international"
      ? "Verified against the ITU written-character table only; this is not a global reverse-decoding claim."
      : sourceId === E_GOV_SOURCE_ID
        ? "Verified against Japan's Radio Station Operation Rules Appendix 1; this is selected-system Wabun evidence only."
        : "Verified against JARL's Wabun table; this is selected-system Wabun evidence only.",
  })));

const wabunDisplayOnlyClaims: readonly MappingClaim[] = WABUN_DISPLAY_ONLY_SOURCE_ROWS.map((row) => ({
  id: `claim-${row.id}-${JARL_SOURCE_ID}`,
  sourceId: JARL_SOURCE_ID,
  candidateId: row.id,
  systemId: "japanese-wabun",
  unicode: displayOnlyUnicode(row.token),
  characterOrToken: `JARL procedure: ${row.token}`,
  pattern: row.pattern,
  mappingKind: "sending-convention",
  temporalStatus: "current",
  confidence: "high",
  extractionStatus: "verified-transcription",
  notes: "JARL documents this as a procedural table row, not an ordinary converter character.",
}));

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_CLAIMS: readonly MappingClaim[] = [
  ...registryClaims,
  ...wabunDisplayOnlyClaims,
];

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_RECOMMENDATIONS: readonly ResearchRecommendation[] = CURRENT_INTERNATIONAL_MORSE_BASELINE_CANDIDATES.map((candidate) => {
  const displayOnly = candidate.requestedReverseEligibility === "display-only";
  const directlyAttested = candidate.claimIds.length > 0;
  return {
    id: `recommendation-${candidate.id}`,
    candidateId: candidate.id,
    evidenceState: directlyAttested ? "singly-attested" : "blocked-pending-review",
    recommendedImplementationState: displayOnly ? "approved-display-only" : directlyAttested ? "approved-for-registry" : "blocked-pending-review",
    recommendedReverseEligibility: displayOnly ? "display-only" : directlyAttested ? "selected-system" : candidate.requestedReverseEligibility,
    sourceSummary: directlyAttested ? (
      displayOnly
        ? "JARL directly documents this Wabun procedure, which remains display-only rather than an ordinary converter mapping."
        : candidate.systemId === "international"
          ? "One official ITU-R source directly defines this written character and pattern; independent corroboration and a human decision remain required."
          : candidate.claimIds.length > 1
            ? "JARL and Japan's Radio Station Operation Rules independently define this Wabun entry and pattern."
            : "JARL directly defines this Wabun punctuation entry and pattern; the documented controlling-source exception applies."
    ) : candidate.unresolvedEvidence!.reason,
    unresolvedQuestions: directlyAttested ? (
      displayOnly
        ? ["Keep this source-table procedure outside ordinary character encoding and reverse decoding."]
        : candidate.systemId === "international"
          ? ["Confirm independent corroboration or document a human-reviewed exception.", "Confirm that default compatibility decoding is not presented as globally unambiguous."]
          : candidate.claimIds.length > 1
            ? ["Keep reverse decoding selected-system only; Wabun patterns are not globally unambiguous."]
            : ["Retain the documented single-controlling-source exception and selected-system boundary."]
    ) : candidate.unresolvedEvidence!.requiredEvidence,
  };
});

export const CURRENT_PRODUCTION_COLLISION_BASELINE = MORSE_COLLISION_GROUPS.map((group) => ({
  pattern: group.pattern,
  candidateIds: group.candidates.map((entry) => entry.id),
  systemIds: group.systemIds,
  sameSystemCollisionSystemIds: group.sameSystemCollisionSystemIds,
  forwardSafe: true,
  selectedSystemReverseSafe: group.sameSystemCollisionSystemIds.length === 0,
  defaultGlobalReverseSafe: group.defaultGlobalCandidates.length <= 1,
}));

const sourceIdsForDecision = (candidate: CandidateMapping) => {
  if (candidate.claimIds.length) return [...new Set(candidate.claimIds.map((claimId) => CURRENT_INTERNATIONAL_MORSE_BASELINE_CLAIMS.find((claim) => claim.id === claimId)!.sourceId))];
  if (candidate.systemId === "international") return [ITU_SOURCE_ID];
  return [candidate.systemId === "russian-cyrillic-reference" ? RUSSIAN_SOURCE_ID : GREEK_SOURCE_ID];
};

export const CURRENT_INTERNATIONAL_MORSE_FINAL_DECISIONS: readonly ReviewDecision[] = CURRENT_INTERNATIONAL_MORSE_BASELINE_CANDIDATES.map((candidate) => {
  const directlyAttested = candidate.claimIds.length > 0;
  const systemIsInternational = candidate.systemId === "international";
  const displayOnly = candidate.requestedReverseEligibility === "display-only";
  if (displayOnly) {
    return {
      id: `objective-${candidate.id}`,
      candidateId: candidate.id,
      decision: "approved-display-only",
      evidenceState: "singly-attested",
      approvedSystemId: candidate.systemId,
      approvedNormalization: candidate.unicode.normalization,
      reverseEligibility: "display-only",
      sourceSummary: "JARL directly documents this source-table procedure, but not as an ordinary Unicode character mapping.",
      caveats: "This row is deliberately excluded from production forward and reverse character vectors.",
      origin: "objective-source-adjudication",
      method: "direct controlling-source transcription with display-only classification",
      supportingClaimIds: candidate.claimIds,
      supportingSourceIds: sourceIdsForDecision(candidate),
      decisionActor: "codex-source-verification",
      decisionDate: "2026-07-13",
      productApprovalRequired: false,
      evidenceException: {
        kind: "single-controlling-source",
        justification: "JARL directly defines the procedure and no conflicting authoritative table was found during targeted research.",
        limitation: "The procedure remains display-only and cannot create a production character mapping.",
      },
    };
  }
  if (directlyAttested) {
    return {
      id: `objective-${candidate.id}`,
      candidateId: candidate.id,
      decision: systemIsInternational ? "approved-for-registry" : "approved-for-system-scoped-reverse",
      evidenceState: candidate.claimIds.length > 1 ? "independently-corroborated" : "singly-attested",
      approvedSystemId: candidate.systemId,
      approvedNormalization: candidate.unicode.normalization,
      reverseEligibility: "selected-system",
      sourceSummary: systemIsInternational
        ? "The current entry is directly transcribed from the official ITU-R written-character table."
        : candidate.claimIds.length > 1
          ? "The Wabun entry is directly corroborated by JARL and Japan's Radio Station Operation Rules."
          : "The Wabun punctuation entry is directly transcribed from JARL's official table.",
      caveats: systemIsInternational
        ? "Default-global is existing compatibility behavior, not a claim that the pattern is unambiguous across every registered system."
        : "Approved only for selected-system Wabun behavior; it is never a default-global mapping.",
      conflictDisposition: "Cross-system pattern reuse is intentional. Reverse decoding is approved only with selected-system context; the existing compatibility default is not a global-unambiguity claim.",
      origin: "objective-source-adjudication",
      method: "direct controlling-source transcription with documented single-source exception",
      supportingClaimIds: candidate.claimIds,
      supportingSourceIds: sourceIdsForDecision(candidate),
      decisionActor: "codex-source-verification",
      decisionDate: "2026-07-12",
      productApprovalRequired: false,
      ...(candidate.claimIds.length > 1 ? {} : {
        evidenceException: {
          kind: "single-controlling-source" as const,
          justification: "The identified source directly defines the mapping and no conflicting authoritative source was found during the targeted search.",
          limitation: "This factual adjudication does not expand the registered system or imply default-global reverse behavior.",
        },
      }),
    };
  }
  const subject = candidate.systemId === "international" ? "The ITU table does not define this as a written character." : candidate.systemId === "russian-cyrillic-reference" ? "Targeted Russian government and standards searches did not yield a defining character-to-pattern table with an exact authoritative locator." : "Targeted Greek government and national amateur-radio searches did not yield a defining character-to-pattern table with an exact authoritative locator.";
  return {
    id: `objective-${candidate.id}`,
    candidateId: candidate.id,
    decision: "rejected-as-unsupported",
    evidenceState: "rejected",
    reverseEligibility: "display-only",
    sourceSummary: subject,
    caveats: "The current production entry is intentionally unchanged here; a later behavior-correction branch is required before this factual outcome can alter public conversion behavior.",
    origin: "objective-source-adjudication",
    method: "targeted authoritative-source search with no qualifying defining table located",
    supportingClaimIds: [],
    supportingSourceIds: sourceIdsForDecision(candidate),
    decisionActor: "codex-source-verification",
    decisionDate: "2026-07-12",
    productApprovalRequired: false,
  };
});

export const CURRENT_INTERNATIONAL_MORSE_REJECTED_CLAIMS = CURRENT_INTERNATIONAL_MORSE_FINAL_DECISIONS
  .filter((decision) => decision.decision === "rejected-as-unsupported")
  .map((decision) => ({ id: `rejected-claim-${decision.candidateId}`, candidateId: decision.candidateId, reason: decision.sourceSummary ?? "No qualifying source evidence.", sourceReference: decision.supportingSourceIds.join(",") }));

export const INTERNATIONAL_MORSE_RESEARCH_IMPORT: InternationalMorseResearchDataset = {
  systems: CURRENT_INTERNATIONAL_MORSE_BASELINE_SYSTEMS,
  sources: [{
    id: ITU_SOURCE_ID,
    title: "Recommendation ITU-R M.1677-1: International Morse code",
    issuingOrganization: "International Telecommunication Union Radiocommunication Sector",
    documentIdentifier: "ITU-R M.1677-1 (10/2009)",
    publicationDate: "2009-10",
    accessedDate: "2026-07-12",
    url: "https://www.itu.int/dms_pubrec/itu-r/rec/m/r-rec-m.1677-1-200910-i!!pdf-e.pdf",
    locator: "Annex 1, Part I, §1.1.1-§1.1.3, pp. 2-3 of the recommendation",
    language: "en",
    category: "international-standard",
    authorityTier: "primary-authority",
    primaryOrSecondary: "primary",
    temporalStatus: "current",
    directlyDefinesMapping: true,
    independenceGroupId: "itu-r-m1677-1",
    reliabilityNotes: "Official ITU-R recommendation. Its Annex table includes accented e and operational signs beyond the current 53-entry compatibility set.",
    limitations: "This dataset records only the 53 current production entries and does not infer support for omitted ITU characters or operational signs.",
    citationNote: "Independently checked against the official ITU PDF during this research pass.",
    verificationStatus: "checked",
  }, {
    id: UNICODE_SOURCE_ID,
    title: "Unicode Character Database: UnicodeData.txt",
    issuingOrganization: "Unicode Consortium",
    accessedDate: "2026-07-12",
    url: "https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt",
    locator: "UnicodeData.txt records for the code points recorded on each current candidate",
    language: "en",
    category: "recognized-technical-reference",
    authorityTier: "primary-authority",
    primaryOrSecondary: "primary",
    temporalStatus: "current",
    directlyDefinesMapping: false,
    independenceGroupId: "unicode-ucd",
    reliabilityNotes: "Official Unicode Character Database source for character names, code points, and normalization identity.",
    limitations: "It defines Unicode identity, not Morse mappings or system status.",
    citationNote: "Independently checked against the official Unicode Consortium resource during this research pass.",
    verificationStatus: "checked",
  }, {
    id: JARL_SOURCE_ID,
    title: "Q symbols and abbreviations: Morse code table",
    issuingOrganization: "Japan Amateur Radio League, Inc.",
    accessedDate: "2026-07-13",
    url: "https://www.jarl.org/Japanese/A_Shiryo/A-C_Morse/morse.htm",
    archivedUrl: "https://www.jarl.org/Japanese/A_Shiryo/A-C_Morse/morse_2017.pdf",
    locator: "モールス符号 page, 和文 table: all 48 kana, 濁点, 半濁点, 数字（欧文も同じ）, and 記号 rows",
    language: "ja",
    jurisdiction: "Japan",
    category: "national-amateur-radio-organization",
    authorityTier: "primary-authority",
    primaryOrSecondary: "primary",
    temporalStatus: "uncertain",
    directlyDefinesMapping: true,
    independenceGroupId: "jarl-wabun-morse-table",
    reliabilityNotes: "Official JARL page directly defines the complete current Wabun table used here, including its kana, modifier, digit, and punctuation rows.",
    limitations: "The table does not define a general mixed-system decoder or a universal Latin/Wabun mode-inference rule.",
    citationNote: "Independently checked against the JARL HTML page and its published quick-reference PDF during this research pass.",
    verificationStatus: "checked",
  }, {
    id: E_GOV_SOURCE_ID,
    title: "Radio Station Operation Rules (無線局運用規則)",
    issuingOrganization: "Government of Japan e-Gov Law Search",
    accessedDate: "2026-07-13",
    url: "https://laws.e-gov.go.jp/law/325M50080000017",
    locator: "Appendix 1, Morse code (Article 12), section 1 和文: rows イ through ン plus 濁点 and 半濁点",
    language: "ja",
    jurisdiction: "Japan",
    category: "national-telecommunications-authority",
    authorityTier: "primary-authority",
    primaryOrSecondary: "primary",
    temporalStatus: "current",
    directlyDefinesMapping: true,
    independenceGroupId: "japan-e-gov-radio-station-operation-rules",
    reliabilityNotes: "The official Japanese rule independently corroborates the Wabun kana and voiced-mark patterns used by the registry.",
    limitations: "This source is used only for the rows it directly defines. It is not used to infer Wabun punctuation or a mixed-system decoder.",
    citationNote: "Independently inspected during this research pass through the official e-Gov legal record.",
    verificationStatus: "checked",
  }, {
    id: RUSSIAN_SOURCE_ID,
    title: "Order of the Ministry of Industry and Trade of the Russian Federation No. 4682",
    issuingOrganization: "Ministry of Industry and Trade of the Russian Federation",
    documentIdentifier: "Order No. 4682 (04 December 2023)",
    publicationDate: "2023-12-04",
    accessedDate: "2026-07-12",
    url: "https://base.garant.ru/408582755/",
    locator: "Training programme bibliography and control-question list, entries 'Russian Morse alphabet' and 'International Morse code'",
    language: "ru",
    jurisdiction: "Russia",
    category: "government-or-military-manual",
    authorityTier: "dependent-secondary",
    primaryOrSecondary: "secondary",
    temporalStatus: "current",
    directlyDefinesMapping: false,
    independenceGroupId: "russian-minpromtorg-order-4682-2023",
    reliabilityNotes: "The accessible record identifies an official training programme but does not reproduce a character-to-pattern table.",
    limitations: "It cannot support any particular Russian entry; it is retained only to document the targeted search boundary.",
    citationNote: "Independently inspected during this research pass; no mapping table was present.",
    verificationStatus: "checked",
  }, {
    id: GREEK_SOURCE_ID,
    title: "Greek Telegraphy Club statement",
    issuingOrganization: "Radio Amateur Association of Greece",
    accessedDate: "2026-07-12",
    url: "https://raag.org/gtc-club-en/",
    locator: "Greek Telegraphy Club page, introductory statement and objectives",
    language: "en",
    jurisdiction: "Greece",
    category: "national-amateur-radio-organization",
    authorityTier: "independent-secondary",
    primaryOrSecondary: "secondary",
    temporalStatus: "current",
    directlyDefinesMapping: false,
    independenceGroupId: "raag-gtc-club-statement",
    reliabilityNotes: "Official national amateur-radio organization page confirms a Greek telegraphy organization but provides no Greek alphabet mapping table.",
    limitations: "It cannot support any particular Greek entry or establish a current national adaptation.",
    citationNote: "Independently inspected during this research pass; no mapping table was present.",
    verificationStatus: "checked",
  }],
  candidates: CURRENT_INTERNATIONAL_MORSE_BASELINE_CANDIDATES,
  claims: CURRENT_INTERNATIONAL_MORSE_BASELINE_CLAIMS,
  recommendations: CURRENT_INTERNATIONAL_MORSE_BASELINE_RECOMMENDATIONS,
  decisions: CURRENT_INTERNATIONAL_MORSE_FINAL_DECISIONS,
  rejectedClaims: CURRENT_INTERNATIONAL_MORSE_REJECTED_CLAIMS,
};
