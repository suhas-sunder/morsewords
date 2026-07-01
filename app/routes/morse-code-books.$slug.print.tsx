import type { Route } from "./+types/morse-code-books.$slug.print";

import PrintableMorsePages from "~/client/components/morse-code-books/PrintableMorsePages";
import {
  getDiscoverableMorseBookSummary,
  isMorseBookPublishReady,
  morseBookPath,
  morseBookPrintPath,
} from "~/client/data/morseBooks";
import {
  formatMorseBookAuthors,
  morseBookAuthorSchemaPeople,
} from "~/client/data/morseBookDisplay";
import { absoluteUrl } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Morse book print page not found", { status: 404 });
  }

  const summary = getDiscoverableMorseBookSummary(slug);
  if (!summary || !isMorseBookPublishReady(summary)) {
    throw new Response("Morse book print page not found", { status: 404 });
  }

  return { bookSummary: summary };
}

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Morse book print page not found | MorseWords" },
      { name: "robots", content: "noindex,nofollow" },
    ];
  }

  const book = data.bookSummary;
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
  const book = loaderData.bookSummary;
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
      bookSource={{ book }}
      canonicalPath={canonicalPath}
      schema={[webpageJsonLd, breadcrumbJsonLd]}
    />
  );
}
