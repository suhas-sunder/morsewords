import type { Route } from "./+types/morse-code-books.$slug.print";

import PrintableMorsePages from "~/client/components/morse-code-books/PrintableMorsePages";
import {
  getMorseBookPublicContentUrls,
  getPublishedMorseBookSummariesRuntime,
  isMorseBookPublishReady,
  morseBookPath,
  morseBookPrintPath,
} from "~/client/data/morseBooks";
import {
  formatMorseBookAuthors,
  morseBookAuthorSchemaPeople,
} from "~/client/data/morseBookDisplay";
import type { MorseBookPublicContentJson } from "~/client/data/morseBookTypes";
import { absoluteUrl } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

function isPublicBookContent(value: unknown): value is MorseBookPublicContentJson {
  const candidate = value as Partial<MorseBookPublicContentJson>;
  return (
    Boolean(candidate) &&
    typeof candidate === "object" &&
    candidate.schemaVersion === 1 &&
    typeof candidate.slug === "string" &&
    Boolean(candidate.manifest) &&
    Array.isArray(candidate.sections)
  );
}

async function fetchApprovedPublicBookContent({
  bookPath,
  request,
}: {
  bookPath: string;
  request: Request;
}) {
  const configured = getMorseBookPublicContentUrls(bookPath).bookUrl;
  const url = configured.startsWith("http")
    ? configured
    : new URL(`/morse-book-content/${bookPath.replace(/^\/+/, "")}`, request.url)
        .href;
  const response = await fetch(url);
  if (!response.ok) return null;
  const value: unknown = await response.json();
  return isPublicBookContent(value) ? value : null;
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Morse book print page not found", { status: 404 });
  }

  const summary =
    (await getPublishedMorseBookSummariesRuntime()).find(
      (book) => book.slug === slug,
    ) ?? null;
  if (!summary || !isMorseBookPublishReady(summary)) {
    throw new Response("Morse book print page not found", { status: 404 });
  }

  const content = await fetchApprovedPublicBookContent({
    bookPath: summary.manifestPath,
    request,
  });
  if (!content || !isMorseBookPublishReady(content.manifest)) {
    throw new Response("Morse book print page not found", { status: 404 });
  }

  return { content };
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Morse book print page not found | MorseWords" },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  const book = data.content.manifest;
  const author = formatMorseBookAuthors(book.author);
  const path = morseBookPrintPath(book.slug);
  return [
    ...seoMeta({
    title: `${book.title} Printable Morse Pages | MorseWords`,
    description: `Print ${book.title} by ${author} as Morse code study pages with original text, Morse code, site URL, QR code, and browser PDF support.`,
    path,
    keywords: `${book.title} Morse code print, printable Morse book pages, Morse code study sheet`,
    }),
    { tagName: "link", rel: "canonical", href: canonicalUrl(path) },
  ];
};

export default function MorseBookPrintRoute({
  loaderData,
}: Route.ComponentProps) {
  const { content } = loaderData;
  const book = content.manifest;
  const canonicalPath = morseBookPrintPath(book.slug);
  const canonical = canonicalUrl(canonicalPath);
  const bookUrl = absoluteUrl(morseBookPath(book.slug));
  const author = formatMorseBookAuthors(book.author);
  const schemaAuthors = morseBookAuthorSchemaPeople(book.author);
  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${book.title} Printable Morse Pages`,
    url: canonical,
    description: `Printable Morse code pages for ${book.title} by ${author}.`,
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    about: {
      "@type": "Book",
      name: book.title,
      ...(schemaAuthors.length > 0 ? { author: schemaAuthors } : {}),
      url: bookUrl,
      isAccessibleForFree: true,
      inLanguage: book.language,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Books",
        item: absoluteUrl("/morse-code-books"),
      },
      { "@type": "ListItem", position: 3, name: book.title, item: bookUrl },
      { "@type": "ListItem", position: 4, name: "Print", item: canonical },
    ],
  };

  return (
    <PrintableMorsePages
      kind="book"
      bookSource={{ book, sections: content.sections }}
      canonicalPath={canonicalPath}
      schema={[webpageJsonLd, breadcrumbJsonLd]}
    />
  );
}
