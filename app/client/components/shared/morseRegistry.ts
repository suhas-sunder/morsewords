/**
 * Internal Morse registry. It records only mappings already used by MorseWords.
 * Future source-vetted systems belong here; do not treat migration provenance as
 * external standards verification.
 */

export const DEFAULT_MORSE_SYSTEM_ID = "international" as const;

export type MorseSystemId =
  | "international"
  | "japanese-wabun-starter"
  | "russian-cyrillic-reference"
  | "greek-reference";

export type MorseEntryCategory =
  | "letter"
  | "digit"
  | "punctuation"
  | "language-letter"
  | "prosign"
  | "control-token"
  | "input-alias"
  | "transliteration-alias";

export type MorseCaseBehavior = "uppercase" | "preserve" | "none";
export type MorseNormalizationPolicy = "none" | "NFC" | "NFKC";
export type MorseCollisionPolicy =
  | "reject"
  | "allow-cross-system"
  | "allow-same-system";
export type MorseStandardizationStatus =
  | "legacy-repository"
  | "unverified-reference"
  | "pending-external-verification";

export type MorseProvenance = {
  kind: "repository-legacy-map" | "repository-language-reference";
  verificationStatus: "repository-migrated" | "pending-external-verification";
  sourceTitle?: string;
  issuingOrganization?: string;
  documentIdentifier?: string;
  url?: string;
  publicationDate?: string;
  accessedDate?: string;
  authorityLevel?: string;
  classification?: "primary" | "secondary";
  conflictingSourceNotes?: string;
};

export type MorseLanguagePresentation = {
  reference: string;
  reading?: string;
  label: string;
  notes?: string;
};

type MorseEntryBase = {
  id: string;
  character: string;
  codePoints: readonly string[];
  displayLabel: string;
  normalizedInputs: readonly string[];
  pattern: string;
  category: MorseEntryCategory;
  systemId: MorseSystemId;
  languageIds: readonly string[];
  script: string;
  forwardEncoding: boolean;
  reverseDecoding: boolean;
  defaultGlobal: boolean;
  caseBehavior: MorseCaseBehavior;
  normalization: MorseNormalizationPolicy;
  collisionPolicy: MorseCollisionPolicy;
  standardizationStatus: MorseStandardizationStatus;
  provenance: MorseProvenance;
  notes?: string;
  deprecated?: boolean;
  presentation?: MorseLanguagePresentation;
};

export type MorseDirectEntry = MorseEntryBase & {
  kind: "canonical";
  aliasOf?: never;
};

export type MorseAliasEntry = MorseEntryBase & {
  kind: "alias";
  aliasOf: string;
};

export type MorseRegistryEntry = MorseDirectEntry | MorseAliasEntry;

export type MorseSystem = {
  id: MorseSystemId;
  displayName: string;
  script: string;
  languageIds: readonly string[];
  relationship: "default-international" | "language-reference";
  globallySelectable: boolean;
  reverseDecodingDeterministic: boolean;
  mixedSystemDecodingPermitted: boolean;
  defaultNormalization: MorseNormalizationPolicy;
  provenance: MorseProvenance;
  implementationStatus: "active-compatibility" | "reference-only";
};

export type LanguageReferenceCharacter = {
  id: string;
  reference: string;
  target: string;
  reading?: string;
  morse: string;
  label: string;
  notes?: string;
};

type EntrySeed = Omit<MorseDirectEntry, "codePoints" | "kind">;

const legacyMapProvenance: MorseProvenance = {
  kind: "repository-legacy-map",
  verificationStatus: "repository-migrated",
};

const languageReferenceProvenance: MorseProvenance = {
  kind: "repository-language-reference",
  verificationStatus: "repository-migrated",
};

export const MORSE_SYSTEMS: readonly MorseSystem[] = Object.freeze([
  {
    id: "international",
    displayName: "International Morse compatibility map",
    script: "Latin",
    languageIds: ["en"],
    relationship: "default-international",
    globallySelectable: true,
    reverseDecodingDeterministic: true,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFKC",
    provenance: legacyMapProvenance,
    implementationStatus: "active-compatibility",
  },
  {
    id: "japanese-wabun-starter",
    displayName: "Japanese Wabun starter reference",
    script: "Kana",
    languageIds: ["ja"],
    relationship: "language-reference",
    globallySelectable: false,
    reverseDecodingDeterministic: true,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFC",
    provenance: languageReferenceProvenance,
    implementationStatus: "reference-only",
  },
  {
    id: "russian-cyrillic-reference",
    displayName: "Russian Cyrillic reference",
    script: "Cyrillic",
    languageIds: ["ru"],
    relationship: "language-reference",
    globallySelectable: false,
    reverseDecodingDeterministic: false,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFC",
    provenance: languageReferenceProvenance,
    implementationStatus: "reference-only",
  },
  {
    id: "greek-reference",
    displayName: "Greek reference",
    script: "Greek",
    languageIds: ["el"],
    relationship: "language-reference",
    globallySelectable: false,
    reverseDecodingDeterministic: true,
    mixedSystemDecodingPermitted: false,
    defaultNormalization: "NFC",
    provenance: languageReferenceProvenance,
    implementationStatus: "reference-only",
  },
]);

function codePointsFor(character: string): string[] {
  return Array.from(character, (value) =>
    `U+${value.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`,
  );
}

function canonicalEntry(seed: EntrySeed): MorseDirectEntry {
  return Object.freeze({ ...seed, kind: "canonical", codePoints: codePointsFor(seed.character) });
}

function globalEntry(
  character: string,
  pattern: string,
  category: "letter" | "digit" | "punctuation",
): MorseDirectEntry {
  const descriptor =
    category === "letter"
      ? `latin-${character.toLowerCase()}`
      : category === "digit"
        ? `digit-${character}`
        : `punctuation-${character.codePointAt(0)!.toString(16)}`;
  return canonicalEntry({
    id: `international-${descriptor}`,
    character,
    displayLabel: character,
    normalizedInputs: [character],
    pattern,
    category,
    systemId: "international",
    languageIds: ["en"],
    script: "Latin",
    forwardEncoding: true,
    reverseDecoding: true,
    defaultGlobal: true,
    caseBehavior: category === "letter" ? "uppercase" : "none",
    normalization: "NFKC",
    collisionPolicy: "allow-cross-system",
    standardizationStatus: "legacy-repository",
    provenance: legacyMapProvenance,
  });
}

const GLOBAL_MORSE_DATA: ReadonlyArray<
  readonly [string, string, "letter" | "digit" | "punctuation"]
> = [
  ["A", ".-", "letter"], ["B", "-...", "letter"], ["C", "-.-.", "letter"],
  ["D", "-..", "letter"], ["E", ".", "letter"], ["F", "..-.", "letter"],
  ["G", "--.", "letter"], ["H", "....", "letter"], ["I", "..", "letter"],
  ["J", ".---", "letter"], ["K", "-.-", "letter"], ["L", ".-..", "letter"],
  ["M", "--", "letter"], ["N", "-.", "letter"], ["O", "---", "letter"],
  ["P", ".--.", "letter"], ["Q", "--.-", "letter"], ["R", ".-.", "letter"],
  ["S", "...", "letter"], ["T", "-", "letter"], ["U", "..-", "letter"],
  ["V", "...-", "letter"], ["W", ".--", "letter"], ["X", "-..-", "letter"],
  ["Y", "-.--", "letter"], ["Z", "--..", "letter"], ["0", "-----", "digit"],
  ["1", ".----", "digit"], ["2", "..---", "digit"], ["3", "...--", "digit"],
  ["4", "....-", "digit"], ["5", ".....", "digit"], ["6", "-....", "digit"],
  ["7", "--...", "digit"], ["8", "---..", "digit"], ["9", "----.", "digit"],
  [".", ".-.-.-", "punctuation"], [",", "--..--", "punctuation"], ["?", "..--..", "punctuation"],
  ["/", "-..-.", "punctuation"], ["'", ".----.", "punctuation"], ["!", "-.-.--", "punctuation"],
  ["-", "-....-", "punctuation"], ["@", ".--.-.", "punctuation"], [":", "---...", "punctuation"],
  [";", "-.-.-.", "punctuation"], ["=", "-...-", "punctuation"], ["+", ".-.-.", "punctuation"],
  ['"', ".-..-.", "punctuation"], ["(", "-.--.", "punctuation"], [")", "-.--.-", "punctuation"],
  ["&", ".-...", "punctuation"], ["_", "..--.-", "punctuation"],
];

const JAPANESE_REFERENCE_DATA = [
  ["ja-a", "Romaji a", "ア", "a", "--.--", "Katakana ア in Wabun code"],
  ["ja-i", "Romaji i", "イ", "i", ".-", "Katakana イ in Wabun code"],
  ["ja-u", "Romaji u", "ウ", "u", "..-", "Katakana ウ in Wabun code"],
  ["ja-e", "Romaji e", "エ", "e", "-.---", "Katakana エ in Wabun code"],
  ["ja-o", "Romaji o", "オ", "o", ".-...", "Katakana オ in Wabun code"],
  ["ja-ka", "Romaji ka", "カ", "ka", ".-..", "Katakana カ in Wabun code"],
  ["ja-ki", "Romaji ki", "キ", "ki", "-.-..", "Katakana キ in Wabun code"],
  ["ja-ku", "Romaji ku", "ク", "ku", "...-", "Katakana ク in Wabun code"],
  ["ja-ke", "Romaji ke", "ケ", "ke", "-.--", "Katakana ケ in Wabun code"],
  ["ja-ko", "Romaji ko", "コ", "ko", "----", "Katakana コ in Wabun code"],
  ["ja-n", "Romaji n", "ン", "n", ".-.-.", "Katakana ン in Wabun code"],
] as const;

const RUSSIAN_REFERENCE_DATA = [
  ["А", "A", ".-"], ["Б", "B", "-..."], ["В", "V", ".--"], ["Г", "G", "--."],
  ["Д", "D", "-.."], ["Е", "E", "."], ["Ё", "Yo", ".", "Often sent with the same Morse pattern as Е in practical tables."],
  ["Ж", "Zh", "...-"], ["З", "Z", "--.."], ["И", "I", ".."], ["Й", "J", ".---"],
  ["К", "K", "-.-"], ["Л", "L", ".-.."], ["М", "M", "--"], ["Н", "N", "-."],
  ["О", "O", "---"], ["П", "P", ".--."], ["Р", "R", ".-."], ["С", "S", "..."],
  ["Т", "T", "-"], ["У", "U", "..-"], ["Ф", "F", "..-."], ["Х", "Kh", "...."],
  ["Ц", "Ts", "-.-."], ["Ч", "Ch", "---."], ["Ш", "Sh", "----"], ["Щ", "Shch", "--.-"],
  ["Ъ", "Hard sign", "--.--"], ["Ы", "Y", "-.--"], ["Ь", "Soft sign", "-..-"],
  ["Э", "E", "..-.."], ["Ю", "Yu", "..--"], ["Я", "Ya", ".-.-"],
] as const;

const GREEK_REFERENCE_DATA = [
  ["Α", "Alpha", "A", ".-"], ["Β", "Beta", "B", "-..."], ["Γ", "Gamma", "G", "--."],
  ["Δ", "Delta", "D", "-.."], ["Ε", "Epsilon", "E", "."], ["Ζ", "Zeta", "Z", "--.."],
  ["Η", "Eta", "H", "...."], ["Θ", "Theta", "Th", "-.-."], ["Ι", "Iota", "I", ".."],
  ["Κ", "Kappa", "K", "-.-"], ["Λ", "Lambda", "L", ".-.."], ["Μ", "Mu", "M", "--"],
  ["Ν", "Nu", "N", "-."], ["Ξ", "Xi", "X", "-..-"], ["Ο", "Omicron", "O", "---"],
  ["Π", "Pi", "P", ".--."], ["Ρ", "Rho", "R", ".-."], ["Σ", "Sigma", "S", "..."],
  ["Τ", "Tau", "T", "-"], ["Υ", "Upsilon", "Y", "-.--"], ["Φ", "Phi", "F", "..-."],
  ["Χ", "Chi", "Ch", "----"], ["Ψ", "Psi", "Ps", "--.-"], ["Ω", "Omega", "O", ".--"],
] as const;

const japaneseEntries = JAPANESE_REFERENCE_DATA.map(
  ([id, reference, target, reading, pattern, label]) =>
    canonicalEntry({
      id,
      character: target,
      displayLabel: label,
      normalizedInputs: [target],
      pattern,
      category: "language-letter",
      systemId: "japanese-wabun-starter",
      languageIds: ["ja"],
      script: "Kana",
      forwardEncoding: true,
      reverseDecoding: true,
      defaultGlobal: false,
      caseBehavior: "none",
      normalization: "NFC",
      collisionPolicy: "allow-cross-system",
      standardizationStatus: "unverified-reference",
      provenance: languageReferenceProvenance,
      presentation: { reference, reading, label },
    }),
);

const russianEntries = RUSSIAN_REFERENCE_DATA.map(
  ([target, reading, pattern, notes]) =>
    canonicalEntry({
      id: `ru-${target}`,
      character: target,
      displayLabel: `Cyrillic ${target}`,
      normalizedInputs: [target],
      pattern,
      category: "language-letter",
      systemId: "russian-cyrillic-reference",
      languageIds: ["ru"],
      script: "Cyrillic",
      forwardEncoding: true,
      reverseDecoding: true,
      defaultGlobal: false,
      caseBehavior: "none",
      normalization: "NFC",
      // The legacy Russian reference intentionally shows Е and Ё with the same
      // pattern. Keep both candidates visible to a system-aware decoder.
      collisionPolicy:
        target === "Е" || target === "Ё"
          ? "allow-same-system"
          : "allow-cross-system",
      standardizationStatus: "unverified-reference",
      provenance: languageReferenceProvenance,
      presentation: {
        reference: `Latin reading ${reading}`,
        reading,
        label: `Cyrillic ${target}`,
        ...(notes ? { notes } : {}),
      },
    }),
);

const greekEntries = GREEK_REFERENCE_DATA.map(
  ([target, name, reading, pattern]) =>
    canonicalEntry({
      id: `el-${target}`,
      character: target,
      displayLabel: `Greek ${name}`,
      normalizedInputs: [target],
      pattern,
      category: "language-letter",
      systemId: "greek-reference",
      languageIds: ["el"],
      script: "Greek",
      forwardEncoding: true,
      reverseDecoding: true,
      defaultGlobal: false,
      caseBehavior: "none",
      normalization: "NFC",
      collisionPolicy: "allow-cross-system",
      standardizationStatus: "unverified-reference",
      provenance: languageReferenceProvenance,
      presentation: { reference: `${name} / ${reading}`, reading, label: `Greek ${name}` },
    }),
);

export const MORSE_REGISTRY_ENTRIES: readonly MorseRegistryEntry[] = Object.freeze([
  ...GLOBAL_MORSE_DATA.map(([character, pattern, category]) => globalEntry(character, pattern, category)),
  ...japaneseEntries,
  ...russianEntries,
  ...greekEntries,
]);

export type MorseCollisionGroup = {
  pattern: string;
  candidates: readonly MorseRegistryEntry[];
  systemIds: readonly MorseSystemId[];
  defaultGlobalCandidates: readonly MorseRegistryEntry[];
  sameSystemCollisionSystemIds: readonly MorseSystemId[];
};

export type MorseRegistryValidationIssue = {
  code:
    | "duplicate-entry-id"
    | "malformed-pattern"
    | "empty-character"
    | "malformed-code-points"
    | "invalid-system-id"
    | "missing-alias-target"
    | "duplicate-canonical-character"
    | "unsafe-same-system-collision"
    | "duplicate-default-global-reverse"
    | "unsupported-category-system";
  message: string;
  entryIds?: string[];
};

export function validateMorseRegistry(
  entries: readonly MorseRegistryEntry[] = MORSE_REGISTRY_ENTRIES,
  systems: readonly MorseSystem[] = MORSE_SYSTEMS,
): MorseRegistryValidationIssue[] {
  const issues: MorseRegistryValidationIssue[] = [];
  const systemIds = new Set(systems.map((system) => system.id));
  const byId = new Map<string, MorseRegistryEntry>();
  const bySystemCharacter = new Map<string, MorseRegistryEntry>();
  const bySystemPattern = new Map<string, MorseRegistryEntry[]>();
  const defaultPatterns = new Map<string, MorseRegistryEntry[]>();

  for (const entry of entries) {
    if (byId.has(entry.id)) {
      issues.push({ code: "duplicate-entry-id", message: `Duplicate entry id: ${entry.id}`, entryIds: [entry.id] });
    }
    byId.set(entry.id, entry);
    if (!entry.character) issues.push({ code: "empty-character", message: `Entry ${entry.id} has no character`, entryIds: [entry.id] });
    if (!/^[.-]+$/.test(entry.pattern)) issues.push({ code: "malformed-pattern", message: `Entry ${entry.id} has malformed Morse pattern`, entryIds: [entry.id] });
    if (!systemIds.has(entry.systemId)) issues.push({ code: "invalid-system-id", message: `Entry ${entry.id} uses unknown system ${entry.systemId}`, entryIds: [entry.id] });
    if (entry.codePoints.join("|") !== codePointsFor(entry.character).join("|")) {
      issues.push({ code: "malformed-code-points", message: `Entry ${entry.id} has incorrect Unicode metadata`, entryIds: [entry.id] });
    }
    if (entry.category === "language-letter" && !entry.presentation) {
      issues.push({ code: "unsupported-category-system", message: `Language entry ${entry.id} lacks presentation data`, entryIds: [entry.id] });
    }
    if (entry.systemId === "international" && entry.category === "language-letter") {
      issues.push({ code: "unsupported-category-system", message: `International entry ${entry.id} cannot be language-only`, entryIds: [entry.id] });
    }
    if (entry.kind === "canonical") {
      const key = `${entry.systemId}\u0000${entry.character}`;
      const previous = bySystemCharacter.get(key);
      if (previous) issues.push({ code: "duplicate-canonical-character", message: `Duplicate canonical character ${entry.character} in ${entry.systemId}`, entryIds: [previous.id, entry.id] });
      bySystemCharacter.set(key, entry);
    }
    if (entry.reverseDecoding) {
      const key = `${entry.systemId}\u0000${entry.pattern}`;
      bySystemPattern.set(key, [...(bySystemPattern.get(key) ?? []), entry]);
      if (entry.defaultGlobal) defaultPatterns.set(entry.pattern, [...(defaultPatterns.get(entry.pattern) ?? []), entry]);
    }
  }

  for (const entry of entries) {
    if (entry.kind === "alias" && !byId.has(entry.aliasOf)) {
      issues.push({ code: "missing-alias-target", message: `Alias ${entry.id} points to missing ${entry.aliasOf}`, entryIds: [entry.id] });
    }
  }
  for (const candidates of bySystemPattern.values()) {
    if (candidates.length > 1 && candidates.some((entry) => entry.collisionPolicy !== "allow-same-system")) {
      issues.push({ code: "unsafe-same-system-collision", message: `Unsafe reverse collision for ${candidates[0].pattern} in ${candidates[0].systemId}`, entryIds: candidates.map((entry) => entry.id) });
    }
  }
  for (const candidates of defaultPatterns.values()) {
    if (candidates.length > 1) issues.push({ code: "duplicate-default-global-reverse", message: `Duplicate default-global reverse pattern ${candidates[0].pattern}`, entryIds: candidates.map((entry) => entry.id) });
  }
  return issues;
}

export function assertValidMorseRegistry(
  entries: readonly MorseRegistryEntry[] = MORSE_REGISTRY_ENTRIES,
  systems: readonly MorseSystem[] = MORSE_SYSTEMS,
): void {
  const issues = validateMorseRegistry(entries, systems);
  if (issues.length) throw new Error(`Invalid Morse registry: ${issues.map((issue) => issue.message).join("; ")}`);
}

assertValidMorseRegistry();

function mapEntries<T>(
  entries: readonly MorseRegistryEntry[],
  key: (entry: MorseRegistryEntry) => string,
  value: (entry: MorseRegistryEntry) => T,
): Record<string, T> {
  return Object.fromEntries(entries.map((entry) => [key(entry), value(entry)]));
}

export const DEFAULT_GLOBAL_FORWARD_MAP: Record<string, string> = mapEntries(
  MORSE_REGISTRY_ENTRIES.filter((entry) => entry.defaultGlobal && entry.forwardEncoding && entry.kind === "canonical"),
  (entry) => entry.character,
  (entry) => entry.pattern,
);

export const DEFAULT_GLOBAL_REVERSE_MAP: Record<string, string> = mapEntries(
  MORSE_REGISTRY_ENTRIES.filter((entry) => entry.defaultGlobal && entry.reverseDecoding && entry.kind === "canonical"),
  (entry) => entry.pattern,
  (entry) => entry.character,
);

const entriesBySystem = new Map<MorseSystemId, readonly MorseRegistryEntry[]>(
  MORSE_SYSTEMS.map((system) => [system.id, Object.freeze(MORSE_REGISTRY_ENTRIES.filter((entry) => entry.systemId === system.id))]),
);
const entriesById = new Map(MORSE_REGISTRY_ENTRIES.map((entry) => [entry.id, entry]));
const entriesByPattern = new Map<string, readonly MorseRegistryEntry[]>();
for (const entry of MORSE_REGISTRY_ENTRIES.filter((entry) => entry.reverseDecoding)) {
  entriesByPattern.set(entry.pattern, Object.freeze([...(entriesByPattern.get(entry.pattern) ?? []), entry]));
}

export const MORSE_COLLISION_GROUPS: readonly MorseCollisionGroup[] = Object.freeze(
  [...entriesByPattern.entries()]
    .filter(([, candidates]) => candidates.length > 1)
    .map(([pattern, candidates]) => {
      const systemIds = [...new Set(candidates.map((entry) => entry.systemId))];
      const sameSystemCollisionSystemIds = systemIds.filter(
        (systemId) => candidates.filter((entry) => entry.systemId === systemId).length > 1,
      );
      return Object.freeze({
        pattern,
        candidates,
        systemIds,
        defaultGlobalCandidates: candidates.filter((entry) => entry.defaultGlobal),
        sameSystemCollisionSystemIds,
      });
    }),
);

export function getMorseSystem(systemId: MorseSystemId): MorseSystem {
  const system = MORSE_SYSTEMS.find((candidate) => candidate.id === systemId);
  if (!system) throw new Error(`Unknown Morse system: ${systemId}`);
  return system;
}

export function getMorseRegistryEntry(entryId: string): MorseRegistryEntry | null {
  return entriesById.get(entryId) ?? null;
}

export function getMorseRegistryEntries(filters: {
  systemId?: MorseSystemId;
  script?: string;
  languageId?: string;
  category?: MorseEntryCategory;
  defaultGlobal?: boolean;
  reverseDecoding?: boolean;
  forwardEncoding?: boolean;
} = {}): readonly MorseRegistryEntry[] {
  return MORSE_REGISTRY_ENTRIES.filter((entry) =>
    (filters.systemId === undefined || entry.systemId === filters.systemId) &&
    (filters.script === undefined || entry.script === filters.script) &&
    (filters.languageId === undefined || entry.languageIds.includes(filters.languageId)) &&
    (filters.category === undefined || entry.category === filters.category) &&
    (filters.defaultGlobal === undefined || entry.defaultGlobal === filters.defaultGlobal) &&
    (filters.reverseDecoding === undefined || entry.reverseDecoding === filters.reverseDecoding) &&
    (filters.forwardEncoding === undefined || entry.forwardEncoding === filters.forwardEncoding),
  );
}

export function getLanguageReferenceCharacters(systemId: MorseSystemId): readonly LanguageReferenceCharacter[] {
  return Object.freeze(
    getMorseRegistryEntries({ systemId, category: "language-letter" }).map((entry) => {
      if (!entry.presentation) throw new Error(`Language reference entry ${entry.id} is missing presentation data`);
      return Object.freeze({
        id: entry.id,
        reference: entry.presentation.reference,
        target: entry.character,
        reading: entry.presentation.reading,
        morse: entry.pattern,
        label: entry.presentation.label,
        ...(entry.presentation.notes ? { notes: entry.presentation.notes } : {}),
      });
    }),
  );
}

export function getMorseForwardMap(systemId: MorseSystemId): Readonly<Record<string, string>> {
  return mapEntries(
    entriesBySystem.get(systemId)!.filter((entry) => entry.forwardEncoding && entry.kind === "canonical"),
    (entry) => entry.character,
    (entry) => entry.pattern,
  );
}

export function getMorseReverseCandidates(
  pattern: string,
  systemId?: MorseSystemId,
): readonly MorseRegistryEntry[] {
  const candidates = entriesByPattern.get(pattern) ?? [];
  return systemId === undefined ? candidates : candidates.filter((entry) => entry.systemId === systemId);
}

export function getMorseReverseMap(systemId: MorseSystemId): Readonly<Record<string, string>> {
  const entries = entriesBySystem.get(systemId)!.filter((entry) => entry.reverseDecoding);
  const unambiguous = new Map<string, MorseRegistryEntry[]>();
  for (const entry of entries) unambiguous.set(entry.pattern, [...(unambiguous.get(entry.pattern) ?? []), entry]);
  return Object.freeze(Object.fromEntries([...unambiguous.entries()].filter(([, candidates]) => candidates.length === 1).map(([pattern, candidates]) => [pattern, candidates[0].character])));
}

export type MorseEncodeIssue = {
  type: "unsupported-character";
  value: string;
  index: number;
};

export type MorseEncodeWithSystemResult = {
  value: string;
  systemId: MorseSystemId;
  normalizedInput: string;
  consumedCharacters: readonly string[];
  unsupportedCharacters: readonly MorseEncodeIssue[];
  aliasResolutions: readonly { input: string; entryId: string; canonicalEntryId: string }[];
  usedSystemIds: readonly MorseSystemId[];
  mixedSystem: false;
};

export type MorseDecodeTokenResult = {
  token: string;
  status: "decoded" | "ambiguous" | "unknown";
  value?: string;
  candidates: readonly MorseRegistryEntry[];
};

export type MorseDecodeWithSystemResult = {
  value: string;
  selectedSystemId?: MorseSystemId;
  usedDefaultGlobalFallback: boolean;
  normalizedInput: string;
  tokens: readonly MorseDecodeTokenResult[];
  ambiguousTokens: readonly MorseDecodeTokenResult[];
  unknownTokens: readonly string[];
};

function normalizeForSystem(input: string, system: MorseSystem): string {
  const normalized = (input ?? "").normalize(system.defaultNormalization).replace(/\s+/g, " ").trim();
  return system.id === DEFAULT_MORSE_SYSTEM_ID ? normalized.toUpperCase() : normalized;
}

export function encodeMorseWithSystem(
  input: string,
  options: { systemId?: MorseSystemId; unsupportedText?: "omit" | "placeholder" } = {},
): MorseEncodeWithSystemResult {
  const systemId = options.systemId ?? DEFAULT_MORSE_SYSTEM_ID;
  const system = getMorseSystem(systemId);
  const normalizedInput = normalizeForSystem(input, system);
  const entries = entriesBySystem.get(systemId)!.filter((entry) => entry.forwardEncoding);
  const byInput = new Map(entries.flatMap((entry) => entry.normalizedInputs.map((value) => [value, entry] as const)));
  const unsupportedCharacters: MorseEncodeIssue[] = [];
  const consumedCharacters: string[] = [];
  const words = normalizedInput.split(/\s+/).filter(Boolean).map((word) => {
    const patterns: string[] = [];
    Array.from(word).forEach((character, index) => {
      const entry = byInput.get(character);
      if (entry) {
        patterns.push(entry.pattern);
        consumedCharacters.push(character);
      } else {
        unsupportedCharacters.push({ type: "unsupported-character", value: character, index });
        if (options.unsupportedText === "placeholder") patterns.push(DEFAULT_GLOBAL_FORWARD_MAP["?"]);
      }
    });
    return patterns.join("   ");
  }).filter(Boolean);
  return {
    value: words.join("       "),
    systemId,
    normalizedInput,
    consumedCharacters,
    unsupportedCharacters,
    aliasResolutions: [],
    usedSystemIds: consumedCharacters.length ? [systemId] : [],
    mixedSystem: false,
  };
}

function normalizeSystemMorse(input: string): string {
  let output = "";
  let pendingSpaces = 0;
  const flushSpaces = () => {
    if (pendingSpaces <= 0) return;
    if (output) output += pendingSpaces >= 7 ? "       " : " ";
    pendingSpaces = 0;
  };

  for (const character of input ?? "") {
    if (character === "." || character === "-") {
      flushSpaces();
      output += character;
    } else if (character === "/" || character === "|" || character === "\n") {
      if (output) pendingSpaces = Math.max(pendingSpaces, 7);
    } else if (/\s/.test(character)) {
      if (output) pendingSpaces += 1;
    }
  }
  return output.trim();
}

export function decodeMorseWithSystem(
  input: string,
  options: { systemId?: MorseSystemId; useDefaultGlobalFallback?: boolean; unknownToken?: "placeholder" | "omit" } = {},
): MorseDecodeWithSystemResult {
  const normalizedInput = normalizeSystemMorse(input);
  const useDefaultGlobalFallback = options.useDefaultGlobalFallback === true;
  const selectedSystemId = options.systemId ?? (useDefaultGlobalFallback ? DEFAULT_MORSE_SYSTEM_ID : undefined);
  const unknownToken = options.unknownToken ?? "placeholder";
  const tokens: MorseDecodeTokenResult[] = [];
  const decoded = normalizedInput.split("       ").filter(Boolean).map((word) =>
    word.split(" ").filter(Boolean).map((token) => {
      const candidates = getMorseReverseCandidates(token, selectedSystemId);
      if (candidates.length === 1) {
        const result: MorseDecodeTokenResult = { token, status: "decoded", value: candidates[0].character, candidates };
        tokens.push(result);
        return result.value;
      }
      if (candidates.length > 1) {
        tokens.push({ token, status: "ambiguous", candidates });
        return unknownToken === "placeholder" ? "?" : "";
      }
      tokens.push({ token, status: "unknown", candidates: [] });
      return unknownToken === "placeholder" ? "?" : "";
    }).join("")
  ).filter(Boolean).join(" ");
  return {
    value: decoded,
    selectedSystemId,
    usedDefaultGlobalFallback: useDefaultGlobalFallback,
    normalizedInput,
    tokens,
    ambiguousTokens: tokens.filter((token) => token.status === "ambiguous"),
    unknownTokens: tokens.filter((token) => token.status === "unknown").map((token) => token.token),
  };
}
