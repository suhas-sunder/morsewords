import { normalizeTextForEncoding } from "~/client/components/shared/morseUtils";

export function createSeededRandom(seed: number) {
  let value = Math.trunc(Number.isFinite(seed) ? seed : 1) % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function shufflePrompts<T>(items: readonly T[], seed: number) {
  const rng = createSeededRandom(seed);
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function safePromptList<T>(
  items: readonly T[],
  fallback: readonly T[],
): T[] {
  const source = Array.isArray(items) ? items : [];
  const safeItems = source.filter((item) => item !== null && item !== undefined);
  if (safeItems.length > 0) return safeItems;
  return Array.isArray(fallback)
    ? fallback.filter((item) => item !== null && item !== undefined)
    : [];
}

export function buildPromptDeck<T>(
  items: readonly T[],
  count: number,
  seed: number,
  options: {
    fallback?: readonly T[];
    getKey?: (item: T) => string;
  } = {},
) {
  const fallback = options.fallback ?? [];
  const rawSource = safePromptList(items, fallback);
  const deckSize = Math.max(0, Math.trunc(count));
  if (!rawSource.length || deckSize === 0) return [];

  const getKey =
    options.getKey ??
    ((item: T) =>
      typeof item === "string" ? item : JSON.stringify(item));
  const source = rawSource.filter((item) => getKey(item).trim().length > 0);
  if (!source.length) return [];
  const uniqueKeyCount = new Set(source.map(getKey)).size;

  const deck: T[] = [];
  let cycle = 0;

  while (deck.length < deckSize) {
    let shuffled = shufflePrompts(source, seed + cycle);

    if (deck.length > 0 && uniqueKeyCount > 1) {
      const previousKey = getKey(deck[deck.length - 1]);
      const firstDifferentIndex = shuffled.findIndex(
        (item) => getKey(item) !== previousKey,
      );
      if (firstDifferentIndex > 0) {
        shuffled = [
          ...shuffled.slice(firstDifferentIndex),
          ...shuffled.slice(0, firstDifferentIndex),
        ];
      }
    }

    for (const item of shuffled) {
      if (deck.length >= deckSize) break;
      if (
        deck.length > 0 &&
        uniqueKeyCount > 1 &&
        getKey(deck[deck.length - 1]) === getKey(item)
      ) {
        continue;
      }
      deck.push(item);
    }

    cycle += 1;
  }

  return deck;
}

export function normalizePlainAnswer(value: string) {
  return normalizeTextForEncoding(value)
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function comparePlainAnswers(answer: string, expected: string) {
  const normalizedAnswer = normalizePlainAnswer(answer);
  return (
    normalizedAnswer.length > 0 &&
    normalizedAnswer === normalizePlainAnswer(expected)
  );
}
