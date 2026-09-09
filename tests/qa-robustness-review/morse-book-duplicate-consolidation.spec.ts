import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  REDIRECT_ALIASES,
  ROUTES,
  absoluteUrl,
} from "../../app/client/data/routes";

const ROOT = process.cwd();
const duplicateSlugs = [
  "anne-of-green-gables-gutenberg-45",
  "the-count-of-monte-cristo-gutenberg-1184",
] as const;
const canonicalSlugs = [
  "anne-of-green-gables",
  "the-count-of-monte-cristo",
] as const;
const duplicateRoutes = [
  [
    ROUTES.anneOfGreenGablesGutenberg45BookAlias,
    "/morse-code-books/anne-of-green-gables",
  ],
  [
    ROUTES.anneOfGreenGablesGutenberg45AudiobookAlias,
    "/morse-code-audiobooks/anne-of-green-gables",
  ],
  [
    ROUTES.anneOfGreenGablesGutenberg45PrintAlias,
    "/morse-code-books/anne-of-green-gables/print",
  ],
  [
    ROUTES.countOfMonteCristoGutenberg1184BookAlias,
    "/morse-code-books/the-count-of-monte-cristo",
  ],
  [
    ROUTES.countOfMonteCristoGutenberg1184AudiobookAlias,
    "/morse-code-audiobooks/the-count-of-monte-cristo",
  ],
  [
    ROUTES.countOfMonteCristoGutenberg1184PrintAlias,
    "/morse-code-books/the-count-of-monte-cristo/print",
  ],
] as const;

function readJson<T>(relativePath: string) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8")) as T;
}

function sitemapLocs(xml: string) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test.describe("exact duplicate Morse book consolidation", () => {
  test("redirects every duplicate book, audiobook, and print URL once", async ({
    request,
  }) => {
    for (const [aliasPath, canonicalPath] of duplicateRoutes) {
      expect(REDIRECT_ALIASES[aliasPath], aliasPath).toBe(canonicalPath);
      const query = "?utm_source=duplicate-recovery&chapter=1";
      const response = await request.get(`${aliasPath}${query}`, {
        maxRedirects: 0,
      });
      expect(response.status(), aliasPath).toBe(301);
      expect(response.headers().location, aliasPath).toBe(`${canonicalPath}${query}`);

      const destination = await request.get(`${canonicalPath}${query}`, {
        maxRedirects: 0,
      });
      expect(destination.status(), canonicalPath).toBe(200);
      expect(destination.headers().location, canonicalPath).toBeUndefined();
      if (canonicalPath.endsWith("/print")) {
        const html = await destination.text();
        expect(html).toContain(
          `<link rel="canonical" href="${absoluteUrl(canonicalPath)}"`,
        );
        expect(html).toMatch(
          /<meta[^>]+name="robots"[^>]+content="noindex,follow"/i,
        );
      }
    }
  });

  test("removes only duplicate slugs from public inventories", async ({ request }) => {
    const library = readJson<{
      books: Array<{ slug: string }>;
    }>("app/client/assets/books/generated/library-manifest.json");
    const previews = readJson<{
      books: Array<{ slug: string }>;
    }>("public/book-previews/manifest.json");
    const seo = readJson<{
      expectedSummaryCount: number;
      summaries: Array<{ slug: string }>;
    }>("app/client/assets/books/seo-summaries/book-seo-summaries.json");
    const sitemap = sitemapLocs(
      fs.readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8"),
    );
    const librarySlugs = library.books.map((book) => book.slug);
    const previewSlugs = previews.books.map((book) => book.slug);
    const seoSlugs = seo.summaries.map((summary) => summary.slug);

    for (const duplicateSlug of duplicateSlugs) {
      expect(librarySlugs, duplicateSlug).not.toContain(duplicateSlug);
      expect(previewSlugs, duplicateSlug).not.toContain(duplicateSlug);
      expect(seoSlugs, duplicateSlug).not.toContain(duplicateSlug);
      expect(sitemap).not.toContain(
        absoluteUrl(`/morse-code-books/${duplicateSlug}`),
      );
      expect(sitemap).not.toContain(
        absoluteUrl(`/morse-code-audiobooks/${duplicateSlug}`),
      );
    }
    for (const canonicalSlug of canonicalSlugs) {
      expect(librarySlugs, canonicalSlug).toContain(canonicalSlug);
      expect(previewSlugs, canonicalSlug).toContain(canonicalSlug);
      expect(seoSlugs, canonicalSlug).toContain(canonicalSlug);
    }

    expect(previews.books).toHaveLength(library.books.length);
    expect(seo.summaries).toHaveLength(library.books.length);
    expect(seo.expectedSummaryCount).toBe(library.books.length);
    expect(
      sitemap.filter((url) => url.includes("/morse-code-books/")).length,
    ).toBe(library.books.length);
    expect(
      sitemap.filter((url) => url.includes("/morse-code-audiobooks/")).length,
    ).toBe(library.books.length);
    expect(sitemap.filter((url) => url.includes("/print")).length).toBe(0);

    const htmlSitemap = await request.get("/sitemap");
    expect(htmlSitemap.ok()).toBe(true);
    const html = await htmlSitemap.text();
    for (const duplicateSlug of duplicateSlugs) {
      expect(html).not.toContain(duplicateSlug);
    }
    for (const canonicalSlug of canonicalSlugs) {
      expect(html).toContain(canonicalSlug);
    }
  });

  test("keeps canonical book and audiobook metadata indexable with separate Count authors", async ({
    request,
  }) => {
    const manifest = readJson<{
      author: string[];
    }>("app/client/assets/books/generated/the-count-of-monte-cristo/manifest.json");
    const seoSummary = readJson<{
      summaries: Array<{ slug: string; author: string[]; summary: string }>;
    }>("app/client/assets/books/seo-summaries/book-seo-summaries.json").summaries.find(
      (summary) => summary.slug === "the-count-of-monte-cristo",
    );
    expect(manifest.author).toEqual(["Alexandre Dumas", "Auguste Maquet"]);
    expect(seoSummary?.author).toEqual(["Alexandre Dumas", "Auguste Maquet"]);
    expect(seoSummary?.summary).toContain(
      "The Count of Monte Cristo by Alexandre Dumas and Auguste Maquet",
    );

    for (const routePath of [
      "/morse-code-books/anne-of-green-gables",
      "/morse-code-audiobooks/anne-of-green-gables",
      "/morse-code-books/the-count-of-monte-cristo",
      "/morse-code-audiobooks/the-count-of-monte-cristo",
    ]) {
      const response = await request.get(routePath, { maxRedirects: 0 });
      expect(response.status(), routePath).toBe(200);
      const html = await response.text();
      expect(html).toContain(
        `<link rel="canonical" href="${absoluteUrl(routePath)}"`,
      );
      expect(html).toMatch(/<meta[^>]+name="robots"[^>]+content="index,follow"/i);
      if (routePath.includes("the-count-of-monte-cristo")) {
        expect(html).toContain("Alexandre Dumas");
        expect(html).toContain("Auguste Maquet");
        expect(html).not.toContain("Alexandre Dumas Auguste Maquet");
      }
    }
  });
});
