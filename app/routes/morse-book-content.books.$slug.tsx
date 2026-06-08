import fs from "node:fs/promises";
import path from "node:path";

import publicManifestJson from "~/client/assets/books/cloudflare-export/public-manifest.json";
import type { MorseBookPublicManifest } from "~/client/data/morseBookTypes";

import type { Route } from "./+types/morse-book-content.books.$slug";

const publicManifest =
  publicManifestJson as unknown as MorseBookPublicManifest;
const exportRoot = path.join(
  process.cwd(),
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-export",
);

export async function loader({ params }: Route.LoaderArgs) {
  const slugParam = params.slug;
  if (!slugParam || !slugParam.endsWith(".json")) {
    throw new Response("Morse book content not found", { status: 404 });
  }

  const slug = slugParam.replace(/\.json$/, "");
  const bookPath = `books/${slug}.json`;
  const publicBook = publicManifest.books.find(
    (book) =>
      book.slug === slug &&
      book.bookPath === bookPath &&
      book.source.publishReady &&
      book.source.processingAllowed &&
      book.source.rightsStatus === "approved",
  );
  if (!publicBook) {
    throw new Response("Morse book content not found", { status: 404 });
  }

  const absolutePath = path.resolve(exportRoot, bookPath);
  const allowedRoot = path.resolve(exportRoot, "books");
  if (!absolutePath.startsWith(`${allowedRoot}${path.sep}`)) {
    throw new Response("Morse book content not found", { status: 404 });
  }

  try {
    const content = await fs.readFile(absolutePath, "utf8");
    return new Response(content, {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch {
    throw new Response("Morse book content not found", { status: 404 });
  }
}
