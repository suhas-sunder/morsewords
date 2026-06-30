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
  const readableSections = sections
    .map((section) => {
      const displayText =
        typeof section.displayText === "string" ? section.displayText.trim() : "";
      const sourceText =
        typeof section.morseSourceText === "string"
          ? section.morseSourceText.trim()
          : displayText;
      return {
        section,
        displayText,
        sourceText,
      };
    })
    .filter((entry) => entry.displayText && entry.sourceText);

  return {
    bookSlug: book.slug,
    title: book.title,
    author: book.author,
    sourceLabel: `${book.title} - ${readableSections
      .map((entry) => entry.section.label)
      .join(", ")}`,
    sectionIds: readableSections.map((entry) => entry.section.sectionId),
    sourceText: readableSections
      .map((entry) => entry.sourceText)
      .filter(Boolean)
      .join("\n\n"),
    displayText: readableSections
      .map((entry) => entry.displayText)
      .filter(Boolean)
      .join("\n\n"),
  };
}
