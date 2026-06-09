export type MorseBookAuthorDisplay = {
  contextText: string;
  names: string[];
  text: string;
};

const ACTIVE_PREFIX_PATTERN = /^active\s+/i;
const ACTIVE_AUTHOR_WITH_ERA_PATTERN =
  /^(.+\b(?:B\.C\.|A\.D\.|BCE|CE))\s+(.+)$/;
const ACTIVE_AUTHOR_PATTERN =
  /^(.+?)\s+([\p{Lu}][\p{L}.'-]*(?:\s+[\p{Lu}][\p{L}.'-]*){0,3})$/u;

function cleanAuthorText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function parseAuthorEntry(value: string) {
  const cleaned = cleanAuthorText(value);
  if (!ACTIVE_PREFIX_PATTERN.test(cleaned)) {
    return { context: "", name: cleaned };
  }

  const activeBody = cleaned.replace(ACTIVE_PREFIX_PATTERN, "");
  const activeMatch =
    activeBody.match(ACTIVE_AUTHOR_WITH_ERA_PATTERN) ??
    activeBody.match(ACTIVE_AUTHOR_PATTERN);
  if (!activeMatch) {
    return { context: "", name: cleaned };
  }

  return {
    context: `Active ${cleanAuthorText(activeMatch[1])}`,
    name: cleanAuthorText(activeMatch[2]),
  };
}

export function getMorseBookAuthorDisplay(
  author: readonly string[] | null | undefined,
): MorseBookAuthorDisplay {
  const names: string[] = [];
  const contexts: string[] = [];

  for (const entry of author ?? []) {
    const parsed = parseAuthorEntry(entry);
    if (parsed.name) names.push(parsed.name);
    if (parsed.context) contexts.push(parsed.context);
  }

  return {
    contextText: [...new Set(contexts)].join(", "),
    names,
    text: names.length > 0 ? names.join(", ") : "Unknown author",
  };
}

export function formatMorseBookAuthors(
  author: readonly string[] | null | undefined,
) {
  return getMorseBookAuthorDisplay(author).text;
}

export function morseBookAuthorSchemaPeople(
  author: readonly string[] | null | undefined,
) {
  return getMorseBookAuthorDisplay(author).names.map((name) => ({
    "@type": "Person",
    name,
  }));
}
