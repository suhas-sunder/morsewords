import type {
  MorseBookSectionKind,
  MorseBookSectionSummary,
} from "~/client/data/morseBookTypes";

export function countAvailableChapterSections(
  sections: readonly Pick<MorseBookSectionSummary, "kind">[],
) {
  return sections.filter((section) => section.kind === "chapter").length;
}

export function shouldShowSectionKindMetadataLabel(
  sectionKind: MorseBookSectionKind,
  availableChapterCount: number,
) {
  return !(sectionKind === "chapter" && availableChapterCount === 1);
}
