import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isMorseBookPublishReady } from "../../app/client/data/morseBookEligibility.ts";
import { getMorseBookContextSortTitle, getMorseBookContextTitle, getMorseBookCollectionSearchText } from "../../app/client/data/morseBookCollectionContext.ts";
import { formatMorseBookAuthors } from "../../app/client/data/morseBookDisplay.ts";
import type { MorseBookLibraryManifest, MorseBookLibrarySummary } from "../../app/client/data/morseBookTypes.ts";

export function buildNavigationBookIndex(books: MorseBookLibrarySummary[]) {
  return { schemaVersion: 1, books: books.filter(isMorseBookPublishReady)
    .sort((a, b) => getMorseBookContextSortTitle(a).localeCompare(getMorseBookContextSortTitle(b), "en") || a.slug.localeCompare(b.slug, "en"))
    .map(book => [book.slug, getMorseBookContextTitle(book), formatMorseBookAuthors(book.author), getMorseBookCollectionSearchText(book)]) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const source = JSON.parse(await fs.readFile("app/client/assets/books/generated/library-manifest.json", "utf8")) as MorseBookLibraryManifest;
  const output = JSON.stringify(buildNavigationBookIndex(source.books)) + "\n";
  const target = "public/navigation-books.json";
  if (process.argv.includes("--check")) {
    if (await fs.readFile(target, "utf8") !== output) throw new Error("Navigation index is stale. Run npm run books:navigation-index and review the generated diff.");
  } else await fs.writeFile(target, output);
  console.log(`${process.argv.includes("--check") ? "Verified" : "Generated"} navigation index: ${Buffer.byteLength(output)} bytes`);
}
