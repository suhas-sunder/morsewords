import type {
  MorseBookManifest,
  MorseBookSectionJson,
} from "~/client/data/morseBookTypes";

export type MorseBookTranslatorSource = {
  bookSlug: string;
  title: string;
  author: string[];
  sourceLabel: string;
  sectionIds: string[];
  sourceText: string;
  displayText: string;
};

export function createBookTranslatorSourceFromSections(
  book: MorseBookManifest,
  sections: MorseBookSectionJson[],
): MorseBookTranslatorSource {
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);

  return {
    bookSlug: book.slug,
    title: book.title,
    author: book.author,
    sourceLabel: `${book.title} - ${orderedSections
      .map((section) => section.label)
      .join(", ")}`,
    sectionIds: orderedSections.map((section) => section.sectionId),
    sourceText: orderedSections
      .map((section) => section.morseSourceText.trim())
      .filter(Boolean)
      .join("\n\n"),
    displayText: orderedSections
      .map((section) => section.displayText.trim())
      .filter(Boolean)
      .join("\n\n"),
  };
}
