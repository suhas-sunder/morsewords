import type { Route } from "./+types/morse-code-audiobooks.$slug";

import MorseBookPage from "~/client/components/morse-code-books/MorseBookPage";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  getMorseBookPreviewAssetUrl,
  getMorseBookPreviewRuntimeContentFromUrl,
} from "~/client/data/morseBookPreviews";
import {
  getDiscoverableMorseBookSummaries,
  getDiscoverableMorseBookSummary,
  isMorseBookPublishReady,
  morseAudiobookPath,
  morseBookPath,
} from "~/client/data/morseBooks";
import { morseBookAuthorSchemaPeople } from "~/client/data/morseBookDisplay";
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

function audiobookMetaTitle(book: { slug: string; title: string }) {
  return `${book.title}${duplicateTitleVariant(book)} Live Morse Player | MorseWords`;
}

function audiobookMetaDescription(book: { slug: string; title: string }) {
  const variant = duplicateTitleVariant(book).replace(/[()]/g, "").trim();
  const title = variant ? `${book.title} ${variant}` : book.title;
  return `Listen to ${title} as a live Morse audiobook with chapter selection, playback controls, and MP3 download.`;
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

export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Morse audiobook not found", { status: 404 });
  }

  const summary = getDiscoverableMorseBookSummary(slug);
  if (!summary || !isMorseBookPublishReady(summary)) {
    throw new Response("Morse audiobook not found", { status: 404 });
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

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.bookSummary) {
    return [
      { title: "Morse audiobook not found | MorseWords" },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  const book = data.bookSummary;
  const path = morseAudiobookPath(book.slug);
  const canonical = absoluteUrl(path);
  const seoSummary = data.seoSummary;
  const fallbackDescription =
    seoSummary?.description ??
    `Live browser-generated Morse player controls for ${book.title}.`;
  const description = audiobookMetaDescription(book) || fallbackDescription;
  return [
    { title: audiobookMetaTitle(book) },
    {
      name: "description",
      content: description,
    },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:url", content: canonical },
    { property: "og:type", content: "website" },
    { name: "robots", content: "index,follow" },
  ];
};

export default function MorseAudiobookRoute({
  loaderData,
}: Route.ComponentProps) {
  const book = loaderData.bookSummary;
  const audiobookUrl = absoluteUrl(morseAudiobookPath(book.slug));
  const bookUrl = absoluteUrl(morseBookPath(book.slug));
  const author = morseBookAuthorSchemaPeople(book.author);
  const seoSummary = loaderData.seoSummary;
  const fallbackDescription =
    seoSummary?.description ??
    `Live browser-generated Morse player controls for ${book.title}.`;
  const description = audiobookMetaDescription(book) || fallbackDescription;
  const detailJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${book.title} live Morse player`,
      url: audiobookUrl,
      description,
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
      about: {
        "@type": "Book",
        name: book.title,
        ...(author.length > 0 ? { author } : {}),
        url: bookUrl,
        inLanguage: book.language,
        isAccessibleForFree: true,
        ...(book.source.sourceUrl ? { sameAs: book.source.sourceUrl } : {}),
      },
      mainEntity: {
        "@type": "Book",
        name: book.title,
        ...(author.length > 0 ? { author } : {}),
        url: bookUrl,
        inLanguage: book.language,
        isAccessibleForFree: true,
        ...(book.source.sourceUrl ? { sameAs: book.source.sourceUrl } : {}),
      },
    },
  ];

  return (
    <>
      <JsonLdScript jsonLd={detailJsonLd} />
      <MorseBookPage
        book={loaderData.book}
        bookSummary={book}
        initialSection={loaderData.initialSection}
        initialPreviewContent={loaderData.initialPreviewContent}
        mode="audiobook"
        previewMode={loaderData.previewMode}
        seoSummary={seoSummary}
      />
    </>
  );
}
