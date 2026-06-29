import type { MorseBookPublicManifest } from "~/client/data/morseBookTypes";

import type { Route } from "./+types/morse-book-content.books.$slug";

const localExportPathSegments = [
  "app",
  "client",
  "assets",
  "books",
  "cloudflare-export",
] as const;

function canServeLocalBookContent() {
  return (
    import.meta.env.DEV ||
    process.env.MORSEWORDS_ENABLE_LOCAL_BOOK_CONTENT_ROUTE === "1"
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  if (!canServeLocalBookContent()) {
    throw new Response("Morse book content not found", { status: 404 });
  }

  const slugParam = params.slug;
  if (!slugParam || !slugParam.endsWith(".json")) {
    throw new Response("Morse book content not found", { status: 404 });
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const exportRoot = path.join(process.cwd(), ...localExportPathSegments);
  const publicManifestPath = path.join(exportRoot, "public-manifest.json");
  const publicManifest = JSON.parse(
    await fs.readFile(publicManifestPath, "utf8"),
  ) as MorseBookPublicManifest;

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
