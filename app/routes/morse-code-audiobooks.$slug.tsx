import type { Route } from "./+types/morse-code-audiobooks.$slug";

import MorseBookPage from "~/client/components/morse-code-books/MorseBookPage";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  getDiscoverableMorseBookSummary,
  isMorseBookPublishReady,
  morseAudiobookPath,
  morseBookPath,
} from "~/client/data/morseBooks";
import { morseBookAuthorSchemaPeople } from "~/client/data/morseBookDisplay";
import { absoluteUrl } from "~/client/data/routes";
import { SITE_URL } from "~/client/seo";

async function loadMorseBookSeoSummary(slug: string) {
  const { getMorseBookSeoSummary } = await import(
    "~/client/data/morseBookSeoSummaries.server"
  );
  return getMorseBookSeoSummary(slug);
}

export async function loader({ params }: Route.LoaderArgs) {
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
  return [
    { title: `${book.title} Live Morse Player | MorseWords` },
    {
      name: "description",
      content:
        seoSummary?.description ??
        `Watch and listen to ${book.title} as live browser-generated Morse code with chapter selection, scrubbing, and saved progress.`,
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
  const detailJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${book.title} live Morse player`,
      url: audiobookUrl,
      description:
        seoSummary?.description ??
        `Live browser-generated Morse player controls for ${book.title}.`,
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
        mode="audiobook"
        previewMode={loaderData.previewMode}
        seoSummary={seoSummary}
      />
    </>
  );
}
