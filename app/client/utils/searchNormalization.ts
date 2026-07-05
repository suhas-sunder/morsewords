const COMBINING_MARKS = /[\u0300-\u036f]/g;
const DASHES =
  /[\u002d\u058a\u05be\u1400\u1806\u2010-\u2015\u2e17\u2e1a\u2e3a-\u2e3b\u2e40\u301c\u3030\ufe58\ufe63\uff0d]+/g;
const APOSTROPHES = /['\u2018\u2019\u201a\u201b\u2032\u2035`\u00b4]+/g;
const QUOTES = /["\u00ab\u00bb\u201c\u201d\u201e\u201f\u2033\u2036]+/g;
const AMPERSANDS = /&/g;
const NON_SEARCH_CHARACTERS = /[^\p{L}\p{N}\s]+/gu;
const WHITESPACE = /\s+/g;
const NUMBER_TOKEN = /^\d+$/;

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(DASHES, " ")
    .replace(APOSTROPHES, " ")
    .replace(QUOTES, " ")
    .replace(AMPERSANDS, " and ")
    .replace(NON_SEARCH_CHARACTERS, " ")
    .toLowerCase()
    .trim()
    .replace(WHITESPACE, " ");
}

export function tokenizeSearchText(value: string): string[] {
  const normalized = normalizeSearchText(value);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

function fallbackQueryTokens(value: string) {
  const tokens = tokenizeSearchText(value);
  if (tokens.some((token) => token.length === 1 && !NUMBER_TOKEN.test(token))) {
    return [];
  }

  return tokens.filter((token) => token.length > 1 || NUMBER_TOKEN.test(token));
}

export function matchesNormalizedSearch(haystack: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const normalizedHaystack = normalizeSearchText(haystack);
  if (!normalizedHaystack) return false;
  if (normalizedHaystack.includes(normalizedQuery)) return true;

  const queryTokens = fallbackQueryTokens(normalizedQuery);
  if (queryTokens.length === 0) return false;

  const haystackTokens = new Set(tokenizeSearchText(normalizedHaystack));
  return queryTokens.every((token) => haystackTokens.has(token));
}
