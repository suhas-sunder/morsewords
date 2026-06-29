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
  const readableSections = sections.filter(
    (section) =>
      typeof section.morseSourceText === "string" &&
      typeof section.displayText === "string",
  );

  return {
    bookSlug: book.slug,
    title: book.title,
    author: book.author,
    sourceLabel: `${book.title} - ${readableSections
      .map((section) => section.label)
      .join(", ")}`,
    sectionIds: readableSections.map((section) => section.sectionId),
    sourceText: readableSections
      .map((section) => section.morseSourceText.trim())
      .filter(Boolean)
      .join("\n\n"),
    displayText: readableSections
      .map((section) => section.displayText.trim())
      .filter(Boolean)
      .join("\n\n"),
  };
}
