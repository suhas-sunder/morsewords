import type {
  MorseBookManifest,
  MorseBookSectionJson,
} from "./morseBookTypes";

const manifestLoaders = import.meta.glob<MorseBookManifest>(
  "../assets/books/generated/*/manifest.json",
  { import: "default" },
);

const reviewSectionLoaders = import.meta.glob<MorseBookSectionJson>(
  "../assets/books/generated/*/sections/*.json",
  { import: "default" },
);

export async function loadGeneratedMorseBookManifest(manifestPath: string) {
  const loaderKey = `../assets/books/generated/${manifestPath}`;
  const loadManifest = manifestLoaders[loaderKey];
  return loadManifest ? loadManifest() : null;
}

export async function loadGeneratedMorseBookSection(
  slug: string,
  sectionJsonPath: string,
) {
  const loaderKey = `../assets/books/generated/${slug}/${sectionJsonPath}`;
  const loadSection = reviewSectionLoaders[loaderKey];
  return loadSection ? loadSection() : null;
}
