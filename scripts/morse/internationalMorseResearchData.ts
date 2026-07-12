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
  UnicodeIdentity,
} from "./internationalMorseResearch.ts";

const ITU_SOURCE_ID = "itu-r-m1677-1";
const JARL_SOURCE_ID = "jarl-wabun-morse-table";
const UNICODE_SOURCE_ID = "unicode-ucd-unicode-data";
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
  if (entry.systemId === "japanese-wabun-starter" && reading) return `KATAKANA LETTER ${reading.toUpperCase()}`;
  throw new Error(`Missing Unicode name for current production entry ${entry.id}`);
};

const categoryFor = (entry: MorseRegistryEntry): CandidateMapping["category"] =>
  entry.category === "digit" ? "digit" : entry.category === "punctuation" ? "punctuation" : "letter";

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
  const classification = id === "international" ? "core-international" : id === "japanese-wabun-starter" ? "related-separate-system" : "national-adaptation";
  return {
    id: system.id,
    displayName: system.displayName,
    classification,
    relationshipToInternational: id === "international" ? "base" : id === "japanese-wabun-starter" ? "related" : "adaptation",
    languageIds: system.languageIds,
    script: system.script,
    direction: "ltr",
    completeCoverage: "documented-subset",
    inheritedPunctuation: "unknown",
    inheritedDigits: "unknown",
    inheritedProsigns: "unknown",
    spacingConvention: "unknown",
    mixedSystemSafe: false,
    sourceIds: id === "international" ? [ITU_SOURCE_ID] : id === "japanese-wabun-starter" ? [JARL_SOURCE_ID] : [],
  };
};

const isWrittenItuCharacter = (entry: MorseRegistryEntry) =>
  entry.systemId === "international" && (entry.category === "letter" || entry.category === "digit" || ITU_WRITTEN_CHARACTERS.has(entry.character));

const isDirectlyAttested = (entry: MorseRegistryEntry) =>
  isWrittenItuCharacter(entry) || entry.systemId === "japanese-wabun-starter";

const sourceIdFor = (entry: MorseRegistryEntry) => entry.systemId === "japanese-wabun-starter" ? JARL_SOURCE_ID : ITU_SOURCE_ID;

const unresolvedFor = (entry: MorseRegistryEntry) => ({
  reason: entry.systemId === "international"
    ? "This existing compatibility punctuation symbol is not a literal written character in the verified ITU-R M.1677-1 Annex 1 table."
    : "No exact primary or official source and locator has been independently verified for this existing repository reference entry.",
  requiredEvidence: entry.systemId === "international"
    ? ["An exact primary standard locator defining this written symbol and Morse pattern, or a documented decision to keep it as repository compatibility behavior."]
    : ["An official or primary system table with an exact page, table, or appendix locator.", "A human review of reverse-decoding scope and any same-system ambiguity."],
});

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_SYSTEMS = MORSE_SYSTEMS.map((system) => systemFor(system.id));

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_CANDIDATES: readonly CandidateMapping[] = MORSE_REGISTRY_ENTRIES.map((entry) => ({
  id: entry.id,
  systemId: entry.systemId,
  ...(entry.languageIds[0] === "en" ? {} : { languageId: entry.languageIds[0] }),
  category: categoryFor(entry),
  unicode: unicodeFor(entry),
  claimIds: isDirectlyAttested(entry) ? [`claim-${entry.id}`] : [],
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

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_CLAIMS: readonly MappingClaim[] = MORSE_REGISTRY_ENTRIES
  .filter(isDirectlyAttested)
  .map((entry) => ({
    id: `claim-${entry.id}`,
    sourceId: sourceIdFor(entry),
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
      : "Verified against the JARL Wabun table only; this is not a claim of complete Wabun coverage.",
  }));

export const CURRENT_INTERNATIONAL_MORSE_BASELINE_RECOMMENDATIONS: readonly ResearchRecommendation[] = CURRENT_INTERNATIONAL_MORSE_BASELINE_CANDIDATES.map((candidate) => {
  const directlyAttested = candidate.claimIds.length > 0;
  return {
    id: `recommendation-${candidate.id}`,
    candidateId: candidate.id,
    evidenceState: directlyAttested ? "singly-attested" : "blocked-pending-review",
    recommendedImplementationState: directlyAttested ? "approved-for-registry" : "blocked-pending-review",
    recommendedReverseEligibility: directlyAttested ? "selected-system" : candidate.requestedReverseEligibility,
    sourceSummary: directlyAttested
      ? candidate.systemId === "international"
        ? "One official ITU-R source directly defines this written character and pattern; independent corroboration and a human decision remain required."
        : "One official JARL Wabun table directly defines this starter entry; an exact national-standard source and a human decision remain required."
      : candidate.unresolvedEvidence!.reason,
    unresolvedQuestions: directlyAttested
      ? candidate.systemId === "international"
        ? ["Confirm independent corroboration or document a human-reviewed exception.", "Confirm that default compatibility decoding is not presented as globally unambiguous."]
        : ["Find an exact national-standard or government source if available.", "Confirm selected-system reverse behavior and the starter-subset boundary."]
      : candidate.unresolvedEvidence!.requiredEvidence,
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
    accessedDate: "2026-07-12",
    url: "https://www.jarl.org/Japanese/A_Shiryo/A-C_Morse/morse.htm",
    locator: "Morse code page, 和文 table, entries ア, イ, ウ, エ, オ, カ, キ, ク, ケ, コ, and ン",
    language: "ja",
    jurisdiction: "Japan",
    category: "national-amateur-radio-organization",
    authorityTier: "primary-authority",
    primaryOrSecondary: "primary",
    temporalStatus: "uncertain",
    directlyDefinesMapping: true,
    independenceGroupId: "jarl-wabun-morse-table",
    reliabilityNotes: "Official JARL page directly displays the eleven current starter entries and their dot-dash patterns.",
    limitations: "This is an official national amateur-radio-organization reference, not a verified Japanese national-standard citation; it is not evidence of complete Wabun coverage.",
    citationNote: "Independently checked against the JARL page during this research pass.",
    verificationStatus: "checked",
  }],
  candidates: CURRENT_INTERNATIONAL_MORSE_BASELINE_CANDIDATES,
  claims: CURRENT_INTERNATIONAL_MORSE_BASELINE_CLAIMS,
  recommendations: CURRENT_INTERNATIONAL_MORSE_BASELINE_RECOMMENDATIONS,
  decisions: [],
  rejectedClaims: [],
};
