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

// Read-only invariant shared by typecheck and the normal release gate.
// Generation is deliberately a separate, explicit command.
export async function checkNavigationBookIndex(root = process.cwd()) {
  const source = JSON.parse(await fs.readFile(path.join(root, "app/client/assets/books/generated/library-manifest.json"), "utf8")) as MorseBookLibraryManifest;
  const expected = JSON.stringify(buildNavigationBookIndex(source.books)) + "\n";
  let actual: string;
  try { actual = await fs.readFile(path.join(root, "public/navigation-books.json"), "utf8"); }
  catch { throw new Error("Navigation index is missing. Run npm run books:navigation-index and review the generated diff."); }
  // Git's Windows checkout can use CRLF. JSON string escapes stay untouched.
  if (actual.replace(/\r\n/g, "\n") !== expected) throw new Error("Navigation index is stale. Run npm run books:navigation-index and review the generated diff.");
  return Buffer.byteLength(expected);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const source = JSON.parse(await fs.readFile("app/client/assets/books/generated/library-manifest.json", "utf8")) as MorseBookLibraryManifest;
  const output = JSON.stringify(buildNavigationBookIndex(source.books)) + "\n";
  const target = "public/navigation-books.json";
  if (process.argv.includes("--check")) {
    await checkNavigationBookIndex();
  } else await fs.writeFile(target, output);
  console.log(`${process.argv.includes("--check") ? "Verified" : "Generated"} navigation index: ${Buffer.byteLength(output)} bytes`);
}
