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
  return {
    bookSlug: book.slug,
    title: book.title,
    author: book.author,
    sourceLabel: `${book.title} - ${sections
      .map((section) => section.label)
      .join(", ")}`,
    sectionIds: sections.map((section) => section.sectionId),
    sourceText: sections
      .map((section) => section.morseSourceText.trim())
      .filter(Boolean)
      .join("\n\n"),
    displayText: sections
      .map((section) => section.displayText.trim())
      .filter(Boolean)
      .join("\n\n"),
  };
}
