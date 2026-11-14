import { getMorseBookSuitability } from "./morseBookSuitability";
export { getMorseBookSuitability } from "./morseBookSuitability";
import { getDiscoverableMorseBookSummaries, getRelatedMorseBooksByAuthor } from "./morseBooks";
export { getDiscoverableMorseBookSummary, getMorseBookManifest, getMorseBookSection } from "./morseBooks";

const duplicateTitles = new Set(
  [...getDiscoverableMorseBookSummaries().reduce((counts, book) => {
    const key = book.title.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>())].filter(([, count]) => count > 1).map(([title]) => title),
);

export function getMorseBookDetailContext(book: { slug: string; title: string; author: readonly string[] }) {
  return {
    suitabilityProfile: getMorseBookSuitability(book.slug),
    titleVariant: duplicateTitles.has(book.title.trim().toLowerCase())
      ? book.slug.includes("-gutenberg-") ? " (Gutenberg source)" : " (MorseWords source)"
      : "",
    // Same canonical eligibility, author match, ordering and four-item bound as before.
    relatedBooks: getRelatedMorseBooksByAuthor(book.slug, book.author).map(({ slug, title }) => ({ slug, title })),
  };
}
