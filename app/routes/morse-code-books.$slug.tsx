import type { Route } from "./+types/morse-code-books.$slug";

import MorseBookPage from "~/client/components/morse-code-books/MorseBookPage";
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
  getDiscoverableMorseBookSummary,
  getMorseBookManifest,
  getMorseBookSection,
  isMorseBookPublishReady,
  morseBookPath,
} from "~/client/data/morseBooks";
import { absoluteUrl } from "~/client/data/routes";

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
    { title: `${book.title} in Morse Code | MorseWords` },
    {
      name: "description",
      content:
        seoSummary?.description ??
        `Read ${book.title} as cleaned book text, preview Morse code, download MP3, or open the live Morse player.`,
    },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:url", content: canonical },
    { name: "robots", content: "index,follow" },
  ];
};

export default function MorseBookRoute({ loaderData }: Route.ComponentProps) {
  return (
    <MorseBookPage
      book={loaderData.book}
      bookSummary={loaderData.bookSummary}
      initialSection={loaderData.initialSection}
      initialPreviewContent={loaderData.initialPreviewContent}
      previewMode={loaderData.previewMode}
      seoSummary={loaderData.seoSummary}
    />
  );
}
