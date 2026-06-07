import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ApprovedPeopleMetadata,
  ApprovedPersonRole,
  AuthorityMetadataEvidence,
  BookMetadata,
  EnrichedAuthorityMetadata,
  EnrichedPersonMetadata,
  EnrichedWorkMetadata,
  OwnerBookApproval,
} from "./bookManifestTypes.ts";
import { BOOK_SCHEMA_VERSION } from "./bookManifestTypes.ts";
import {
  loadOwnerBookApprovals,
  ownerBookApprovalMap,
} from "./bookApprovalFiles.ts";
import {
  loadEnrichedAuthorityMetadata,
  normalizeAuthorityName,
  slugifyAuthorityName,
} from "./bookEnrichedMetadata.ts";
import { loadApprovedPeopleMetadata } from "./bookRightsValidation.ts";

type MetadataEntry = {
  filePath: string;
  metadata: BookMetadata;
  rawPath: string | null;
  rawText: string;
};

export type AuthorityResolverRequest = {
  slug: string;
  title: string;
  authorName: string;
  translatorName: string;
  gutenbergId: string | null;
  sourceUrl: string | null;
  needs: {
    authorDeathYear: boolean;
    translatorDeathYear: boolean;
    originalPublicationYear: boolean;
  };
};

export type AuthorityResolverResult = {
  people?: EnrichedPersonMetadata[];
  works?: EnrichedWorkMetadata[];
  unresolved?: string[];
  ambiguities?: string[];
  sourcesAttempted?: string[];
  liveFetchAvailable?: boolean;
};

export type MetadataEnrichmentBookReport = {
  slug: string;
  title: string;
  author: string;
  translator: string;
  gutenbergId: string | null;
  sourceUrl: string | null;
  needs: string[];
  enrichedFacts: string[];
  unresolved: string[];
  ambiguities: string[];
  sourcesAttempted: string[];
  nextAction: string;
};

export type MetadataEnrichmentReport = {
  schemaVersion: 1;
  generatedAt: string;
  summary: {
    totalBooks: number;
    booksNeedingEnrichment: number;
    peopleEnriched: number;
    worksEnriched: number;
    unresolvedBooks: number;
    liveFetchAttempted: boolean;
    liveFetchAvailable: boolean;
    sourceCounts: Record<string, number>;
  };
  output: {
    enrichedMetadataPath: string;
  };
  books: MetadataEnrichmentBookReport[];
};

export type EnrichBookMetadataOptions = {
  repoRoot?: string;
  textRoot?: string;
  metadataRoot?: string;
  approvedPeoplePath?: string;
  bookApprovalsPath?: string;
  enrichedMetadataPath?: string;
  generatedReviewRoot?: string;
  fetchLive?: boolean;
  authorityResolver?: (
    request: AuthorityResolverRequest,
  ) => Promise<AuthorityResolverResult>;
  quiet?: boolean;
};

export type EnrichBookMetadataResult = {
  enrichedMetadata: EnrichedAuthorityMetadata;
  report: MetadataEnrichmentReport;
  enrichedMetadataPath: string;
  reportJsonPath: string;
  reportMarkdownPath: string;
  warnings: string[];
  fatalErrors: string[];
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_TEXT_ROOT = path.join(DEFAULT_REPO_ROOT, "app/client/assets/text");
const DEFAULT_METADATA_ROOT = path.join(DEFAULT_TEXT_ROOT, "meta");
const DEFAULT_APPROVED_METADATA_ROOT = path.join(
  DEFAULT_TEXT_ROOT,
  "approved-metadata",
);
const DEFAULT_APPROVED_PEOPLE_PATH = path.join(
  DEFAULT_APPROVED_METADATA_ROOT,
  "authors.json",
);
const DEFAULT_BOOK_APPROVALS_PATH = path.join(
  DEFAULT_APPROVED_METADATA_ROOT,
  "book-approvals.json",
);
const DEFAULT_ENRICHED_METADATA_PATH = path.join(
  DEFAULT_APPROVED_METADATA_ROOT,
  "enriched-metadata.json",
);
const DEFAULT_REVIEW_ROOT = path.join(
  DEFAULT_REPO_ROOT,
  "app/client/assets/books/generated/review",
);

const CANADA_SAFE_DEATH_YEAR = 1971;
const US_PUBLIC_DOMAIN_PUBLICATION_YEAR = 1930;

function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isYear(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1000 &&
    value <= 2100
  );
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonIfChanged(filePath: string, value: unknown): void {
  const next = `${JSON.stringify(value, null, 2)}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === next) {
    return;
  }
  fs.writeFileSync(filePath, next, "utf8");
}

function writeTextIfChanged(filePath: string, value: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8") === value) {
    return;
  }
  fs.writeFileSync(filePath, value, "utf8");
}

function findFiles(root: string, extension: string): string[] {
  if (!fs.existsSync(root)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const filePath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...findFiles(filePath, extension));
    if (entry.isFile() && entry.name.endsWith(extension)) files.push(filePath);
  }
  return files.sort((left, right) => left.localeCompare(right));
}

function minimalBookMetadata(value: unknown, filePath: string): BookMetadata | null {
  if (!isPlainObject(value)) {
    throw new Error(`${filePath} must be an object.`);
  }
  if (typeof value.slug !== "string" || value.slug.trim() === "") {
    throw new Error(`${filePath}.slug must be a non-empty string.`);
  }
  if (typeof value.title !== "string" || value.title.trim() === "") {
    throw new Error(`${filePath}.title must be a non-empty string.`);
  }
  if (
    !Array.isArray(value.author) ||
    value.author.some((author) => typeof author !== "string")
  ) {
    throw new Error(`${filePath}.author must be an array of strings.`);
  }
  if (!isPlainObject(value.source)) {
    throw new Error(`${filePath}.source must be an object.`);
  }
  if (typeof value.source.rawTextFile !== "string") {
    throw new Error(`${filePath}.source.rawTextFile must be a string.`);
  }
  return value as BookMetadata;
}

function loadMetadataEntries(
  textRoot: string,
  metadataRoot: string,
): { entries: MetadataEntry[]; errors: string[] } {
  const entries: MetadataEntry[] = [];
  const errors: string[] = [];
  for (const filePath of findFiles(metadataRoot, ".json")) {
    try {
      const metadata = minimalBookMetadata(readJson(filePath), filePath);
      if (!metadata) continue;
      const rawPath = path.resolve(path.dirname(filePath), metadata.source.rawTextFile);
      const fallbackRawPath = path.resolve(textRoot, metadata.source.rawTextFile);
      const resolvedRawPath = fs.existsSync(rawPath)
        ? rawPath
        : fs.existsSync(fallbackRawPath)
          ? fallbackRawPath
          : null;
      entries.push({
        filePath,
        metadata,
        rawPath: resolvedRawPath,
        rawText: resolvedRawPath
          ? fs.readFileSync(resolvedRawPath, "utf8")
          : "",
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return { entries, errors };
}

function firstLineField(text: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escaped}:\\s*(.+?)\\s*$`, "im"));
  return match?.[1]?.trim() ?? "";
}

function firstPattern(text: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function parseDeathYearFromLifespan(input: string): number | null {
  const match = input
    .replace(/[\u2013\u2014]/g, "-")
    .match(/\b(?:1[4-9]\d{2}|20\d{2})\s*(?:--|-|to)\s*((?:1[4-9]\d{2}|20\d{2}))\b/i);
  return match?.[1] ? Number.parseInt(match[1], 10) : null;
}

function cleanPersonNameFromField(input: string): string {
  return input
    .replace(/\s*(?:\(|\[)[^)\]]*\b(?:1[4-9]\d{2}|20\d{2})\s*(?:--|-|\u2013|\u2014|to)\s*(?:1[4-9]\d{2}|20\d{2})[^)\]]*(?:\)|\])\.?\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function authorNameFor(entry: MetadataEntry): string {
  const rawAuthor =
    firstLineField(entry.rawText, "Author") ||
    entry.metadata.scaffold?.extracted.author ||
    entry.metadata.author.join(", ");
  return cleanPersonNameFromField(rawAuthor);
}

function translatorNameFor(entry: MetadataEntry): string {
  const rawTranslator =
    firstLineField(entry.rawText, "Translator") ||
    entry.metadata.scaffold?.extracted.translator ||
    firstPattern(entry.rawText, [/Translated by\s+([^\n.]+)/i]);
  return cleanPersonNameFromField(rawTranslator);
}

function titleFor(entry: MetadataEntry): string {
  return (
    firstLineField(entry.rawText, "Title") ||
    entry.metadata.scaffold?.extracted.title ||
    entry.metadata.title
  ).trim();
}

function gutenbergIdFor(entry: MetadataEntry): string | null {
  return (
    entry.metadata.source.gutenbergId ||
    entry.metadata.scaffold?.extracted.gutenbergEbookNumber ||
    firstPattern(entry.rawText, [
      /\[(?:eBook|EBook)\s+#(\d+)\]/i,
      /Project Gutenberg (?:eBook|EBook).*?#(\d+)/i,
      /(?:www\.)?gutenberg\.org\/ebooks\/(\d+)/i,
    ]) ||
    null
  );
}

function originalPublicationYearFromFile(entry: MetadataEntry): number | null {
  const line =
    firstPattern(entry.rawText, [
      /^\s*Original publication:\s*(.+?)\s*$/im,
      /^\s*First published:\s*(.+?)\s*$/im,
      /^\s*Published:\s*(.+?)\s*$/im,
    ]) || entry.metadata.scaffold?.extracted.originalPublication || "";
  const match = line.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function ownerPersonHasDeathYear(
  people: ApprovedPeopleMetadata,
  name: string,
): boolean {
  const wanted = normalizeAuthorityName(name);
  const wantedSlug = slugifyAuthorityName(name);
  return Object.entries(people).some(
    ([slug, person]) =>
      (slug === wantedSlug || normalizeAuthorityName(person.name) === wanted) &&
      typeof person.deathYear === "number",
  );
}

function existingPersonHasDeathYear(
  enriched: EnrichedAuthorityMetadata,
  name: string,
  role: ApprovedPersonRole,
): boolean {
  const wanted = normalizeAuthorityName(name);
  const wantedSlug = slugifyAuthorityName(name);
  return enriched.people.some(
    (person) =>
      person.roles.includes(role) &&
      (person.slug === wantedSlug ||
        normalizeAuthorityName(person.name) === wanted) &&
      typeof person.deathYear === "number",
  );
}

function existingWorkHasPublicationYear(
  enriched: EnrichedAuthorityMetadata,
  slug: string,
): boolean {
  return enriched.works.some(
    (work) =>
      work.bookSlug === slug &&
      typeof work.originalPublicationYear === "number",
  );
}

function ownerBookHasPublicationYear(
  ownerBookApproval: OwnerBookApproval | null,
): boolean {
  return (
    ownerBookApproval?.ownerReviewed === true &&
    typeof ownerBookApproval.originalPublicationYear === "number"
  );
}

function sourceUrlFromGutenbergId(gutenbergId: string | null): string | null {
  return gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null;
}

function personEvidence(
  field: "birthYear" | "deathYear",
  value: number,
  sourceType: AuthorityMetadataEvidence["sourceType"],
  sourceId: string,
  sourceUrl: string,
  matchedBy: string,
): AuthorityMetadataEvidence {
  return {
    field,
    value,
    sourceType,
    sourceId,
    sourceUrl,
    matchedBy,
    confidence: "high",
  };
}

function workEvidence(
  value: number,
  sourceType: AuthorityMetadataEvidence["sourceType"],
  sourceId: string,
  sourceUrl: string,
  matchedBy: string,
): AuthorityMetadataEvidence {
  return {
    field: "originalPublicationYear",
    value,
    sourceType,
    sourceId,
    sourceUrl,
    matchedBy,
    confidence: "high",
  };
}

const fetchCache = new Map<string, Promise<unknown>>();
let lastAuthorityFetchAt = 0;

async function authorityFetch(url: string): Promise<Response> {
  const elapsed = Date.now() - lastAuthorityFetchAt;
  if (elapsed < 300) {
    await new Promise((resolve) => setTimeout(resolve, 300 - elapsed));
  }
  lastAuthorityFetchAt = Date.now();
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "MorseWords metadata enrichment (https://morsewords.com; rights evidence bot)",
      Accept: "application/json, application/rdf+xml, text/plain;q=0.8",
    },
  });
  if (response.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 1_500));
    lastAuthorityFetchAt = Date.now();
    return fetch(url, {
      headers: {
        "User-Agent":
          "MorseWords metadata enrichment (https://morsewords.com; rights evidence bot)",
        Accept: "application/json, application/rdf+xml, text/plain;q=0.8",
      },
    });
  }
  return response;
}

async function fetchText(url: string): Promise<string> {
  const cached = fetchCache.get(`text:${url}`) as Promise<string> | undefined;
  if (cached) return cached;
  const promise = (async () => {
    const response = await authorityFetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response.text();
  })();
  fetchCache.set(`text:${url}`, promise);
  return promise;
}

async function fetchJson(url: string): Promise<unknown> {
  const cached = fetchCache.get(`json:${url}`);
  if (cached) return cached;
  const promise = (async () => {
    const response = await authorityFetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return response.json();
  })();
  fetchCache.set(`json:${url}`, promise);
  return promise;
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

type GutenbergRdfAgent = {
  name: string;
  aliases: string[];
  birthYear: number | null;
  deathYear: number | null;
  roles: ApprovedPersonRole[];
};

function roleFromRdfTag(tag: string): ApprovedPersonRole | null {
  if (tag === "dcterms:creator" || tag === "marcrel:aut") return "author";
  if (tag === "marcrel:trl") return "translator";
  if (tag === "marcrel:edt") return "editor";
  if (tag === "marcrel:ill") return "illustrator";
  return null;
}

function rdfNameVariants(name: string, aliases: string[]): string[] {
  const names = new Set([name, ...aliases].map((value) => value.trim()).filter(Boolean));
  for (const candidate of [...names]) {
    if (!candidate.includes(",")) continue;
    const parts = candidate
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 2) {
      names.add(`${parts[1]} ${parts[0]}`);
    }
    if (parts.length >= 3) {
      names.add(`${parts[1]} ${parts[2]} ${parts[0]}`);
      names.add(`${parts[2]} ${parts[1]} ${parts[0]}`);
    }
  }
  return [...names];
}

function parseGutenbergRdfAgents(rdf: string): GutenbergRdfAgent[] {
  const agents: GutenbergRdfAgent[] = [];
  const roleAgentPattern =
    /<(dcterms:creator|marcrel:aut|marcrel:trl|marcrel:edt|marcrel:ill)>[\s\S]*?(<pgterms:agent[\s\S]*?<\/pgterms:agent>)[\s\S]*?<\/\1>/g;
  for (const match of rdf.matchAll(roleAgentPattern)) {
    const role = roleFromRdfTag(match[1]);
    if (!role) continue;
    const block = match[2];
    const name = block.match(/<pgterms:name>([\s\S]*?)<\/pgterms:name>/)?.[1];
    if (!name) continue;
    const birth = block.match(/<pgterms:birthdate[^>]*>(-?\d+)<\/pgterms:birthdate>/)?.[1];
    const death = block.match(/<pgterms:deathdate[^>]*>(-?\d+)<\/pgterms:deathdate>/)?.[1];
    const aliases = [...block.matchAll(/<pgterms:alias>([\s\S]*?)<\/pgterms:alias>/g)]
      .map((alias) => decodeXml(alias[1]).trim())
      .filter(Boolean);
    agents.push({
      name: decodeXml(name).trim(),
      aliases,
      birthYear: birth ? Number.parseInt(birth, 10) : null,
      deathYear: death ? Number.parseInt(death, 10) : null,
      roles: [role],
    });
  }
  return agents;
}

function rdfPerson(
  agents: GutenbergRdfAgent[],
  name: string,
  role: ApprovedPersonRole,
  gutenbergId: string,
): EnrichedPersonMetadata | null {
  const matches = agents.filter(
    (agent) =>
      rdfNameVariants(agent.name, agent.aliases).some(
        (candidate) =>
          normalizeAuthorityName(candidate) === normalizeAuthorityName(name),
      ) &&
      agent.roles.includes(role) &&
      typeof agent.deathYear === "number",
  );
  if (matches.length !== 1) return null;
  const agent = matches[0];
  if (agent.deathYear === null || agent.deathYear > CANADA_SAFE_DEATH_YEAR) {
    return null;
  }
  const sourceUrl = `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.rdf`;
  const evidence: AuthorityMetadataEvidence[] = [
    personEvidence(
      "deathYear",
      agent.deathYear,
      "project-gutenberg-rdf",
      gutenbergId,
      sourceUrl,
      `exact-name-and-gutenberg-${role}`,
    ),
  ];
  if (typeof agent.birthYear === "number") {
    evidence.push(
      personEvidence(
        "birthYear",
        agent.birthYear,
        "project-gutenberg-rdf",
        gutenbergId,
        sourceUrl,
        `exact-name-and-gutenberg-${role}`,
      ),
    );
  }
  return {
    slug: slugifyAuthorityName(name),
    name,
    roles: [role],
    birthYear: agent.birthYear,
    deathYear: agent.deathYear,
    canadaLifePlus70Safe: true,
    evidence,
    approvalSource: "external-authority",
    reviewedByOwner: false,
  };
}

type WikidataEntity = {
  id: string;
  labels?: Record<string, { value?: string }>;
  aliases?: Record<string, Array<{ value?: string }>>;
  claims?: Record<string, Array<Record<string, unknown>>>;
};

function wikidataClaimValue(claim: Record<string, unknown>): unknown {
  const mainsnak = claim.mainsnak;
  if (!isPlainObject(mainsnak)) return null;
  const datavalue = mainsnak.datavalue;
  if (!isPlainObject(datavalue)) return null;
  return datavalue.value ?? null;
}

function wikidataEntityIds(entity: WikidataEntity, property: string): string[] {
  const claims = entity.claims?.[property] ?? [];
  return claims
    .map((claim) => wikidataClaimValue(claim))
    .filter(isPlainObject)
    .map((value) => {
      const id = value.id;
      const numericId = value["numeric-id"];
      if (typeof id === "string") return id;
      if (typeof numericId === "number") return `Q${numericId}`;
      return "";
    })
    .filter(Boolean);
}

function wikidataYear(entity: WikidataEntity, property: string): number | null {
  const claims = entity.claims?.[property] ?? [];
  for (const claim of claims) {
    const value = wikidataClaimValue(claim);
    if (!isPlainObject(value) || typeof value.time !== "string") continue;
    const match = value.time.match(/[+-](\d{4})-/);
    if (match?.[1]) return Number.parseInt(match[1], 10);
  }
  return null;
}

function isWikidataEditionEntity(entity: WikidataEntity): boolean {
  return (
    wikidataEntityIds(entity, "P31").includes("Q3331189") ||
    wikidataEntityIds(entity, "P629").length > 0
  );
}

function wikidataNames(entity: WikidataEntity): string[] {
  const names = new Set<string>();
  const label = entity.labels?.en?.value;
  if (label) names.add(label);
  for (const alias of entity.aliases?.en ?? []) {
    if (alias.value) names.add(alias.value);
  }
  return [...names];
}

async function fetchWikidataEntity(id: string): Promise<WikidataEntity | null> {
  const json = await fetchJson(
    `https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(id)}.json`,
  );
  if (!isPlainObject(json) || !isPlainObject(json.entities)) return null;
  const entity = json.entities[id];
  return isPlainObject(entity) ? (entity as WikidataEntity) : null;
}

async function searchWikidata(query: string): Promise<string[]> {
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.searchParams.set("action", "wbsearchentities");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "8");
  url.searchParams.set("type", "item");
  url.searchParams.set("search", query);
  const json = await fetchJson(url.toString());
  if (!isPlainObject(json) || !Array.isArray(json.search)) return [];
  return json.search
    .map((entry) =>
      isPlainObject(entry) && typeof entry.id === "string" ? entry.id : "",
    )
    .filter(Boolean);
}

async function wikidataPerson(
  name: string,
  role: ApprovedPersonRole,
): Promise<{
  person: EnrichedPersonMetadata | null;
  ambiguity: string | null;
}> {
  const ids = await searchWikidata(name);
  const candidates: Array<{ entity: WikidataEntity; deathYear: number; birthYear: number | null }> = [];
  for (const id of ids) {
    const entity = await fetchWikidataEntity(id);
    if (!entity) continue;
    if (!wikidataEntityIds(entity, "P31").includes("Q5")) continue;
    const exactName = wikidataNames(entity).some(
      (candidateName) =>
        normalizeAuthorityName(candidateName) === normalizeAuthorityName(name),
    );
    if (!exactName) continue;
    const deathYear = wikidataYear(entity, "P570");
    if (!deathYear || deathYear > CANADA_SAFE_DEATH_YEAR) continue;
    candidates.push({
      entity,
      deathYear,
      birthYear: wikidataYear(entity, "P569"),
    });
  }
  if (candidates.length > 1) {
    return {
      person: null,
      ambiguity: `Ambiguous Wikidata person match for ${name}: ${candidates
        .map((candidate) => candidate.entity.id)
        .join(", ")}`,
    };
  }
  if (candidates.length !== 1) return { person: null, ambiguity: null };
  const candidate = candidates[0];
  const sourceUrl = `https://www.wikidata.org/wiki/${candidate.entity.id}`;
  const evidence = [
    personEvidence(
      "deathYear",
      candidate.deathYear,
      "wikidata",
      candidate.entity.id,
      sourceUrl,
      `exact-name-and-gutenberg-${role}`,
    ),
  ];
  if (candidate.birthYear !== null) {
    evidence.push(
      personEvidence(
        "birthYear",
        candidate.birthYear,
        "wikidata",
        candidate.entity.id,
        sourceUrl,
        `exact-name-and-gutenberg-${role}`,
      ),
    );
  }
  return {
    person: {
      slug: slugifyAuthorityName(name),
      name,
      roles: [role],
      birthYear: candidate.birthYear,
      deathYear: candidate.deathYear,
      canadaLifePlus70Safe: true,
      evidence,
      approvalSource: "external-authority",
      reviewedByOwner: false,
    },
    ambiguity: null,
  };
}

async function wikidataWork(
  slug: string,
  title: string,
  authorName: string,
): Promise<{
  work: EnrichedWorkMetadata | null;
  ambiguity: string | null;
  unresolved: string | null;
}> {
  const ids = await searchWikidata(title);
  const candidates: Array<{ entity: WikidataEntity; publicationYear: number }> = [];
  for (const id of ids) {
    const entity = await fetchWikidataEntity(id);
    if (!entity) continue;
    const exactTitle = wikidataNames(entity).some(
      (candidateTitle) =>
        normalizeAuthorityName(candidateTitle) === normalizeAuthorityName(title),
    );
    if (!exactTitle) continue;
    if (isWikidataEditionEntity(entity)) continue;
    const publicationYear = wikidataYear(entity, "P577");
    if (
      !publicationYear ||
      publicationYear > US_PUBLIC_DOMAIN_PUBLICATION_YEAR
    ) {
      continue;
    }
    const authorIds = wikidataEntityIds(entity, "P50");
    if (authorIds.length === 0) continue;
    const authorMatches = await Promise.all(
      authorIds.map(async (authorId) => {
        const author = await fetchWikidataEntity(authorId);
        if (!author) return false;
        return wikidataNames(author).some(
          (name) =>
            normalizeAuthorityName(name) === normalizeAuthorityName(authorName),
        );
      }),
    );
    if (!authorMatches.includes(true)) continue;
    candidates.push({ entity, publicationYear });
  }
  if (candidates.length > 1) {
    return {
      work: null,
      ambiguity: `Ambiguous Wikidata work match for ${title}: ${candidates
        .map((candidate) => candidate.entity.id)
        .join(", ")}`,
      unresolved: null,
    };
  }
  if (candidates.length !== 1) {
    return {
      work: null,
      ambiguity: null,
      unresolved: `No high-confidence Wikidata work publication match for ${title}.`,
    };
  }
  const candidate = candidates[0];
  return {
    work: {
      bookSlug: slug,
      title,
      originalPublicationYear: candidate.publicationYear,
      evidence: [
        workEvidence(
          candidate.publicationYear,
          "wikidata",
          candidate.entity.id,
          `https://www.wikidata.org/wiki/${candidate.entity.id}`,
          "exact-title-and-author",
        ),
      ],
      approvalSource: "external-authority",
    },
    ambiguity: null,
    unresolved: null,
  };
}

async function defaultAuthorityResolver(
  request: AuthorityResolverRequest,
): Promise<AuthorityResolverResult> {
  if (!request.gutenbergId) {
    return {
      unresolved: ["Project Gutenberg ID is missing; authority lookup skipped."],
      sourcesAttempted: [],
      liveFetchAvailable: true,
    };
  }

  const people: EnrichedPersonMetadata[] = [];
  const works: EnrichedWorkMetadata[] = [];
  const unresolved: string[] = [];
  const ambiguities: string[] = [];
  const sourcesAttempted = [
    `Project Gutenberg RDF ${request.gutenbergId}`,
    "Wikidata",
  ];

  let rdfAgents: GutenbergRdfAgent[] = [];
  try {
    const rdfUrl = `https://www.gutenberg.org/cache/epub/${request.gutenbergId}/pg${request.gutenbergId}.rdf`;
    rdfAgents = parseGutenbergRdfAgents(await fetchText(rdfUrl));
  } catch (error) {
    unresolved.push(
      `Project Gutenberg RDF unavailable for ${request.gutenbergId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  async function resolvePerson(
    name: string,
    role: ApprovedPersonRole,
  ): Promise<void> {
    if (!name) return;
    const rdfMatch = rdfPerson(rdfAgents, name, role, request.gutenbergId ?? "");
    if (rdfMatch) {
      people.push(rdfMatch);
      return;
    }
    try {
      const wikidataMatch = await wikidataPerson(name, role);
      if (wikidataMatch.person) people.push(wikidataMatch.person);
      if (wikidataMatch.ambiguity) ambiguities.push(wikidataMatch.ambiguity);
      if (!wikidataMatch.person && !wikidataMatch.ambiguity) {
        unresolved.push(`No high-confidence death-year authority match for ${name}.`);
      }
    } catch (error) {
      unresolved.push(
        `Wikidata person lookup failed for ${name}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  if (request.needs.authorDeathYear) {
    await resolvePerson(request.authorName, "author");
  }
  if (request.needs.translatorDeathYear && request.translatorName) {
    await resolvePerson(request.translatorName, "translator");
  }
  if (request.needs.originalPublicationYear) {
    try {
      const work = await wikidataWork(
        request.slug,
        request.title,
        request.authorName,
      );
      if (work.work) works.push(work.work);
      if (work.ambiguity) ambiguities.push(work.ambiguity);
      if (work.unresolved) unresolved.push(work.unresolved);
    } catch (error) {
      unresolved.push(
        `Wikidata work lookup failed for ${request.title}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  return {
    people,
    works,
    unresolved,
    ambiguities,
    sourcesAttempted,
    liveFetchAvailable: true,
  };
}

function personKey(person: EnrichedPersonMetadata): string {
  return `${person.slug}:${person.roles.slice().sort().join(",")}`;
}

function sourceCounts(metadata: EnrichedAuthorityMetadata): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const evidence of [
    ...metadata.people.flatMap((person) => person.evidence),
    ...metadata.works.flatMap((work) => work.evidence),
  ]) {
    counts[evidence.sourceType] = (counts[evidence.sourceType] ?? 0) + 1;
  }
  return counts;
}

function buildMarkdownReport(report: MetadataEnrichmentReport): string {
  const lines = [
    "# Metadata enrichment report",
    "",
    "This report records authority metadata enrichment for Morse book candidates.",
    "It does not include full story text and does not approve unresolved books.",
    "",
    "## Summary",
    "",
    `- Total books scanned: ${report.summary.totalBooks}`,
    `- Books needing enrichment: ${report.summary.booksNeedingEnrichment}`,
    `- People enriched: ${report.summary.peopleEnriched}`,
    `- Works enriched: ${report.summary.worksEnriched}`,
    `- Unresolved books: ${report.summary.unresolvedBooks}`,
    `- Live fetch attempted: ${report.summary.liveFetchAttempted ? "yes" : "no"}`,
    `- Live fetch available: ${report.summary.liveFetchAvailable ? "yes" : "no"}`,
    "",
    "## Validation workflow",
    "",
    "Run this sequence after enrichment:",
    "",
    "```bash",
    "npm run books:rights-report",
    "npm run books:review-queue",
    "npm run books:apply-review",
    "npm run books:build",
    "```",
    "",
    "Then confirm publish-ready and processing_allowed counts, public book cards, and sitemap entries.",
    "",
    "## Books",
    "",
  ];

  for (const book of report.books) {
    lines.push(
      `### ${book.title} (${book.slug})`,
      "",
      `- Author: ${book.author || "unknown"}`,
      `- Translator: ${book.translator || "none detected"}`,
      `- Gutenberg ID: ${book.gutenbergId ?? "missing"}`,
      `- Source URL: ${book.sourceUrl ?? "missing"}`,
      `- Needs: ${book.needs.length > 0 ? book.needs.join("; ") : "none"}`,
      `- Enriched facts: ${
        book.enrichedFacts.length > 0 ? book.enrichedFacts.join("; ") : "none"
      }`,
      `- Unresolved: ${
        book.unresolved.length > 0 ? book.unresolved.join("; ") : "none"
      }`,
      `- Ambiguities: ${
        book.ambiguities.length > 0 ? book.ambiguities.join("; ") : "none"
      }`,
      `- Next action: ${book.nextAction}`,
      "",
    );
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function mergeEnrichedMetadata(
  existing: EnrichedAuthorityMetadata,
  additions: {
    people: EnrichedPersonMetadata[];
    works: EnrichedWorkMetadata[];
  },
  generatedAt: string,
): EnrichedAuthorityMetadata {
  const people = new Map<string, EnrichedPersonMetadata>();
  for (const person of existing.people) people.set(personKey(person), person);
  for (const person of additions.people) {
    if (!people.has(personKey(person))) people.set(personKey(person), person);
  }

  const works = new Map<string, EnrichedWorkMetadata>();
  for (const work of existing.works) works.set(work.bookSlug, work);
  for (const work of additions.works) {
    if (!works.has(work.bookSlug)) works.set(work.bookSlug, work);
  }

  return {
    schemaVersion: 1,
    generatedAt,
    people: [...people.values()].sort((left, right) =>
      left.slug.localeCompare(right.slug),
    ),
    works: [...works.values()].sort((left, right) =>
      left.bookSlug.localeCompare(right.bookSlug),
    ),
  };
}

function factLabels(result: AuthorityResolverResult): string[] {
  return [
    ...(result.people ?? []).map((person) =>
      `${person.name} deathYear=${person.deathYear}`,
    ),
    ...(result.works ?? []).map((work) =>
      `${work.title} originalPublicationYear=${work.originalPublicationYear}`,
    ),
  ];
}

export async function enrichBookMetadata(
  options: EnrichBookMetadataOptions = {},
): Promise<EnrichBookMetadataResult> {
  const textRoot = path.resolve(options.textRoot ?? DEFAULT_TEXT_ROOT);
  const metadataRoot = path.resolve(options.metadataRoot ?? DEFAULT_METADATA_ROOT);
  const approvedPeoplePath = path.resolve(
    options.approvedPeoplePath ?? DEFAULT_APPROVED_PEOPLE_PATH,
  );
  const bookApprovalsPath = path.resolve(
    options.bookApprovalsPath ?? DEFAULT_BOOK_APPROVALS_PATH,
  );
  const enrichedMetadataPath = path.resolve(
    options.enrichedMetadataPath ?? DEFAULT_ENRICHED_METADATA_PATH,
  );
  const generatedReviewRoot = path.resolve(
    options.generatedReviewRoot ?? DEFAULT_REVIEW_ROOT,
  );
  const reportJsonPath = path.join(
    generatedReviewRoot,
    "metadata-enrichment-report.json",
  );
  const reportMarkdownPath = path.join(
    generatedReviewRoot,
    "metadata-enrichment-report.md",
  );
  const warnings: string[] = [];
  const fatalErrors: string[] = [];

  const approvedPeopleResult = loadApprovedPeopleMetadata(approvedPeoplePath);
  const bookApprovalsResult = loadOwnerBookApprovals(bookApprovalsPath);
  const existingEnrichedResult = loadEnrichedAuthorityMetadata(
    enrichedMetadataPath,
  );
  fatalErrors.push(...approvedPeopleResult.errors);
  fatalErrors.push(...bookApprovalsResult.errors);
  fatalErrors.push(...existingEnrichedResult.errors);
  warnings.push(...bookApprovalsResult.warnings, ...existingEnrichedResult.warnings);

  const { entries, errors } = loadMetadataEntries(textRoot, metadataRoot);
  fatalErrors.push(...errors);

  const generatedAt = new Date().toISOString();
  const emptyReport: MetadataEnrichmentReport = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    generatedAt,
    summary: {
      totalBooks: entries.length,
      booksNeedingEnrichment: 0,
      peopleEnriched: 0,
      worksEnriched: 0,
      unresolvedBooks: 0,
      liveFetchAttempted: false,
      liveFetchAvailable: false,
      sourceCounts: {},
    },
    output: {
      enrichedMetadataPath: toPosixPath(
        path.relative(DEFAULT_REPO_ROOT, enrichedMetadataPath),
      ),
    },
    books: [],
  };

  if (fatalErrors.length > 0) {
    writeJsonIfChanged(reportJsonPath, emptyReport);
    writeTextIfChanged(reportMarkdownPath, buildMarkdownReport(emptyReport));
    return {
      enrichedMetadata: existingEnrichedResult.metadata,
      report: emptyReport,
      enrichedMetadataPath,
      reportJsonPath,
      reportMarkdownPath,
      warnings,
      fatalErrors,
    };
  }

  const approvedPeople = approvedPeopleResult.people;
  const ownerApprovals = ownerBookApprovalMap(bookApprovalsResult.entries);
  const existingEnriched = existingEnrichedResult.metadata;
  const fetchLive =
    options.fetchLive ?? process.env.MORSE_BOOKS_ENRICH_LIVE !== "0";
  const resolver =
    options.authorityResolver ??
    (fetchLive ? defaultAuthorityResolver : async () => ({
      unresolved: ["Live authority fetch disabled; using cached enriched metadata only."],
      sourcesAttempted: [],
      liveFetchAvailable: false,
    }));

  const additions = {
    people: [] as EnrichedPersonMetadata[],
    works: [] as EnrichedWorkMetadata[],
  };
  const bookReports: MetadataEnrichmentBookReport[] = [];
  let liveFetchAvailable = false;

  for (const entry of entries) {
    const title = titleFor(entry);
    const authorName = authorNameFor(entry);
    const translatorName = translatorNameFor(entry);
    const gutenbergId = gutenbergIdFor(entry);
    const sourceUrl = sourceUrlFromGutenbergId(gutenbergId);
    const ownerApproval = ownerApprovals.get(entry.metadata.slug) ?? null;
    const fileAuthorDeathYear =
      parseDeathYearFromLifespan(firstLineField(entry.rawText, "Author")) ??
      null;
    const fileTranslatorDeathYear = translatorName
      ? parseDeathYearFromLifespan(firstLineField(entry.rawText, "Translator"))
      : null;
    const fileOriginalPublicationYear = originalPublicationYearFromFile(entry);

    const needs = {
      authorDeathYear:
        Boolean(authorName) &&
        fileAuthorDeathYear === null &&
        !ownerPersonHasDeathYear(approvedPeople, authorName) &&
        !existingPersonHasDeathYear(existingEnriched, authorName, "author"),
      translatorDeathYear:
        Boolean(translatorName) &&
        fileTranslatorDeathYear === null &&
        !ownerPersonHasDeathYear(approvedPeople, translatorName) &&
        !existingPersonHasDeathYear(
          existingEnriched,
          translatorName,
          "translator",
        ),
      originalPublicationYear:
        fileOriginalPublicationYear === null &&
        entry.metadata.originalPublicationYear === null &&
        !ownerBookHasPublicationYear(ownerApproval) &&
        !existingWorkHasPublicationYear(existingEnriched, entry.metadata.slug),
    };
    const needLabels = Object.entries(needs)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (needLabels.length === 0) continue;

    let resolverResult: AuthorityResolverResult = {
      unresolved: [],
      ambiguities: [],
      sourcesAttempted: [],
      liveFetchAvailable: !fetchLive,
    };
    try {
      resolverResult = await resolver({
        slug: entry.metadata.slug,
        title,
        authorName,
        translatorName,
        gutenbergId,
        sourceUrl,
        needs,
      });
      if (resolverResult.liveFetchAvailable === true) liveFetchAvailable = true;
    } catch (error) {
      resolverResult = {
        unresolved: [
          `Authority resolver failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        ],
        ambiguities: [],
        sourcesAttempted: [],
        liveFetchAvailable: false,
      };
    }

    additions.people.push(...(resolverResult.people ?? []));
    additions.works.push(...(resolverResult.works ?? []));
    const unresolved = resolverResult.unresolved ?? [];
    const ambiguities = resolverResult.ambiguities ?? [];
    bookReports.push({
      slug: entry.metadata.slug,
      title,
      author: authorName,
      translator: translatorName,
      gutenbergId,
      sourceUrl,
      needs: needLabels,
      enrichedFacts: factLabels(resolverResult),
      unresolved,
      ambiguities,
      sourcesAttempted: resolverResult.sourcesAttempted ?? [],
      nextAction:
        unresolved.length === 0 &&
        ambiguities.length === 0 &&
        factLabels(resolverResult).length > 0
          ? "Run books:rights-report, books:review-queue, books:apply-review, and books:build."
          : "Manual review remains required for unresolved or ambiguous metadata.",
    });
  }

  const enrichedMetadata = mergeEnrichedMetadata(
    existingEnriched,
    additions,
    generatedAt,
  );
  const report: MetadataEnrichmentReport = {
    schemaVersion: BOOK_SCHEMA_VERSION,
    generatedAt,
    summary: {
      totalBooks: entries.length,
      booksNeedingEnrichment: bookReports.length,
      peopleEnriched: additions.people.length,
      worksEnriched: additions.works.length,
      unresolvedBooks: bookReports.filter(
        (book) => book.unresolved.length > 0 || book.ambiguities.length > 0,
      ).length,
      liveFetchAttempted: fetchLive || options.authorityResolver !== undefined,
      liveFetchAvailable,
      sourceCounts: sourceCounts(enrichedMetadata),
    },
    output: {
      enrichedMetadataPath: toPosixPath(
        path.relative(DEFAULT_REPO_ROOT, enrichedMetadataPath),
      ),
    },
    books: bookReports.sort((left, right) => left.slug.localeCompare(right.slug)),
  };

  writeJsonIfChanged(enrichedMetadataPath, enrichedMetadata);
  writeJsonIfChanged(reportJsonPath, report);
  writeTextIfChanged(reportMarkdownPath, buildMarkdownReport(report));

  if (!options.quiet) {
    console.log("Metadata enrichment complete.");
    console.log(`Books scanned: ${report.summary.totalBooks}`);
    console.log(`Books needing enrichment: ${report.summary.booksNeedingEnrichment}`);
    console.log(`People enriched: ${report.summary.peopleEnriched}`);
    console.log(`Works enriched: ${report.summary.worksEnriched}`);
    console.log(`Report: ${reportJsonPath}`);
  }

  return {
    enrichedMetadata,
    report,
    enrichedMetadataPath,
    reportJsonPath,
    reportMarkdownPath,
    warnings,
    fatalErrors,
  };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
const currentPath = fileURLToPath(import.meta.url);

if (invokedPath === currentPath) {
  const result = await enrichBookMetadata();
  for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
  if (result.fatalErrors.length > 0) {
    for (const error of result.fatalErrors) console.error(`Error: ${error}`);
    process.exit(1);
  }
}
