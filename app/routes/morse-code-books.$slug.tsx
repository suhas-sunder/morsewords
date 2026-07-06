import type { Route } from "./+types/morse-code-books.$slug";

import MorseBookPage from "~/client/components/morse-code-books/MorseBookPage";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  getMorseBookPreviewAssetUrl,
  getMorseBookPreviewRuntimeContentFromUrl,
} from "~/client/data/morseBookPreviews";
import {
  TEST_PUBLISHED_BOOK_PREVIEW_VALUE,
  TEST_PUBLISHED_BOOK_SLUG,
  UNPUBLISHED_BOOK_PREVIEW_PARAM,
  UNPUBLISHED_BOOK_PREVIEW_VALUE,
  getDefaultMorseBookSectionId,
  getDiscoverableMorseBookSummaries,
  getDiscoverableMorseBookSummary,
  getMorseBookManifest,
  getMorseBookSection,
  isMorseBookPublishReady,
  morseBookPath,
} from "~/client/data/morseBooks";
import { getMorseBookContextTitle } from "~/client/data/morseBookCollectionContext";
import { absoluteUrl } from "~/client/data/routes";
import { SITE_URL } from "~/client/seo";

const DUPLICATE_DISCOVERABLE_BOOK_TITLES = new Set(
  [...getDiscoverableMorseBookSummaries().reduce((counts, book) => {
    const key = book.title.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>())]
    .filter(([, count]) => count > 1)
    .map(([title]) => title),
);

function duplicateTitleVariant(book: { slug: string; title: string }) {
  if (!DUPLICATE_DISCOVERABLE_BOOK_TITLES.has(book.title.trim().toLowerCase())) {
    return "";
  }
  return book.slug.includes("-gutenberg-")
    ? " (Gutenberg source)"
    : " (MorseWords source)";
}

function bookMetaTitle(book: { slug: string; title: string }) {
  return `${getMorseBookContextTitle(book)}${duplicateTitleVariant(book)} in Morse Code | MorseWords`;
}

async function loadMorseBookSeoSummary(slug: string) {
  const { getMorseBookSeoSummary } = await import(
    "~/client/data/morseBookSeoSummaries.server"
  );
  return getMorseBookSeoSummary(slug);
}

async function loadInitialPreviewContent(
  request: Request,
  summary: NonNullable<ReturnType<typeof getDiscoverableMorseBookSummary>>,
) {
  const previewUrl = new URL(
    getMorseBookPreviewAssetUrl(summary.slug),
    request.url,
  ).toString();
  return getMorseBookPreviewRuntimeContentFromUrl(summary, previewUrl);
}

function isUnpublishedPreviewRequest(request: Request) {
  const url = new URL(request.url);
  return (
    import.meta.env.DEV &&
    url.searchParams.get(UNPUBLISHED_BOOK_PREVIEW_PARAM) ===
      UNPUBLISHED_BOOK_PREVIEW_VALUE
  );
}

function isTestPublishedPreviewRequest(request: Request, slug: string) {
  const url = new URL(request.url);
  return (
    import.meta.env.DEV &&
    slug === TEST_PUBLISHED_BOOK_SLUG &&
    url.searchParams.get(UNPUBLISHED_BOOK_PREVIEW_PARAM) ===
      TEST_PUBLISHED_BOOK_PREVIEW_VALUE
  );
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Morse book not found", { status: 404 });
  }

  const previewMode = isUnpublishedPreviewRequest(request);
  const testPreviewMode = isTestPublishedPreviewRequest(request, slug);

  if (!previewMode && !testPreviewMode) {
    const summary = getDiscoverableMorseBookSummary(slug);
    if (!summary || !isMorseBookPublishReady(summary)) {
      throw new Response("Morse book not found", { status: 404 });
    }

    return {
      bookSummary: summary,
      book: null,
      initialSection: null,
      initialPreviewContent: await loadInitialPreviewContent(request, summary),
      previewMode: null,
      seoSummary: await loadMorseBookSeoSummary(slug),
    };
  }

  const book = await getMorseBookManifest(slug, {
    includeUnpublished: previewMode,
    includeTestFixture: testPreviewMode,
  });
  if (!book) {
    throw new Response("Morse book not found", { status: 404 });
  }

  if (!isMorseBookPublishReady(book) && !previewMode && !testPreviewMode) {
    throw new Response("Morse book not found", { status: 404 });
  }

  const defaultSectionId = getDefaultMorseBookSectionId(book);
  if (!defaultSectionId) {
    throw new Response("Morse book section not found", { status: 404 });
  }

  const initialSection = await getMorseBookSection(book, defaultSectionId);
  if (!initialSection) {
    throw new Response("Morse book section not found", { status: 404 });
  }

  const previewState: "unpublished" | "test-published" | null = testPreviewMode
    ? "test-published"
    : previewMode && !isMorseBookPublishReady(book)
      ? "unpublished"
      : null;

  return {
    bookSummary: null,
    book,
    initialSection,
    initialPreviewContent: null,
    previewMode: previewState,
    seoSummary: await loadMorseBookSeoSummary(slug),
  };
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Morse book not found | MorseWords" },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  if (data.previewMode === "unpublished" || data.previewMode === "test-published") {
    return [
      {
        title: `${
          data.previewMode === "test-published"
            ? "Test Morse book preview"
            : "Unpublished Morse book preview"
        }: ${data.book.title} | MorseWords`,
      },
      {
        name: "description",
        content:
          "Development-only noindex preview for a generated Morse book artifact.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  const book = data.book ?? data.bookSummary;
  if (!book) {
    return [
      { title: "Morse book not found | MorseWords" },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  const path = morseBookPath(book.slug);
  const canonical = absoluteUrl(path);
  const seoSummary = data.seoSummary;
  return [
    { title: bookMetaTitle(book) },
    {
      name: "description",
      content:
        seoSummary?.description ??
        `Read ${getMorseBookContextTitle(book)} as cleaned book text, preview Morse code, download MP3, or open the live Morse player.`,
    },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:url", content: canonical },
    { name: "robots", content: "index,follow" },
  ];
};

export default function MorseBookRoute({ loaderData }: Route.ComponentProps) {
  const book = loaderData.bookSummary ?? loaderData.book;
  const detailJsonLd =
    book && loaderData.previewMode === null
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Morse Book Library",
              item: absoluteUrl("/morse-code-books"),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: getMorseBookContextTitle(book),
              item: absoluteUrl(morseBookPath(book.slug)),
            },
          ],
        }
      : null;

  return (
    <>
      {detailJsonLd ? <JsonLdScript jsonLd={detailJsonLd} /> : null}
      <MorseBookPage
        book={loaderData.book}
        bookSummary={loaderData.bookSummary}
        initialSection={loaderData.initialSection}
        initialPreviewContent={loaderData.initialPreviewContent}
        previewMode={loaderData.previewMode}
        seoSummary={loaderData.seoSummary}
      />
    </>
  );
}
