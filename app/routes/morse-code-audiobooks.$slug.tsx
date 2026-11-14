import { getDiscoverableMorseBookSummary, getMorseBookDetailContext } from "~/client/data/morseBookDetail.server";
import type { Route } from "./+types/morse-code-audiobooks.$slug";

import MorseBookPage from "~/client/components/morse-code-books/MorseBookPage";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  getMorseBookPreviewRuntimeContentFromUrl,
} from "~/client/data/morseBookPreviews";
import { getMorseBookPreviewAssetRequestUrl } from "~/client/data/morseBookPreviewUrl.server";
import {
  isMorseBookPublishReady,
  morseAudiobookPath,
  morseBookPath,
} from "~/client/data/morseBookRuntime";
import { getMorseBookContextTitle } from "~/client/data/morseBookCollectionContext";
import { morseBookAuthorSchemaPeople } from "~/client/data/morseBookDisplay";
import { absoluteUrl } from "~/client/data/routes";
import { SITE_URL } from "~/client/seo";
import { morseAudiobookDescription } from "~/client/data/morseAudiobookMetadata";

function audiobookMetaTitle(book: { slug: string; title: string }, variant: string) {
  return `${getMorseBookContextTitle(book)}${variant} Live Morse Player | MorseWords`;
}

function audiobookMetaDescription(book: { slug: string; title: string }, reviewedDescription?: string | null, titleVariant = "") {
  const variant = titleVariant.replace(/[()]/g, "").trim();
  const contextTitle = getMorseBookContextTitle(book);
  const title = variant ? `${contextTitle} ${variant}` : contextTitle;
  return morseAudiobookDescription(title, reviewedDescription);
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
  const previewUrl = getMorseBookPreviewAssetRequestUrl(
    summary.slug,
    request.url,
  );
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
    ...getMorseBookDetailContext(summary),
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
  const description = audiobookMetaDescription(book, seoSummary?.description, data.titleVariant);
  return [
    { title: audiobookMetaTitle(book, data.titleVariant) },
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
  const contextTitle = getMorseBookContextTitle(book);
  const author = morseBookAuthorSchemaPeople(book.author);
  const seoSummary = loaderData.seoSummary;
  const description = audiobookMetaDescription(book, seoSummary?.description, loaderData.titleVariant);
  const detailJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${contextTitle} live Morse player`,
      url: audiobookUrl,
      description,
      isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
      about: {
        "@type": "Book",
        name: contextTitle,
        ...(author.length > 0 ? { author } : {}),
        url: bookUrl,
        inLanguage: book.language,
        isAccessibleForFree: true,
        ...(book.source.sourceUrl ? { sameAs: book.source.sourceUrl } : {}),
      },
      mainEntity: {
        "@type": "Book",
        name: contextTitle,
        ...(author.length > 0 ? { author } : {}),
        url: bookUrl,
        inLanguage: book.language,
        isAccessibleForFree: true,
        ...(book.source.sourceUrl ? { sameAs: book.source.sourceUrl } : {}),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Morse Audiobook Library",
          item: absoluteUrl("/morse-code-audiobooks"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: contextTitle,
          item: audiobookUrl,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLdScript jsonLd={detailJsonLd} />
      <MorseBookPage
        relatedBooks={loaderData.relatedBooks}
        suitabilityProfile={loaderData.suitabilityProfile}
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
