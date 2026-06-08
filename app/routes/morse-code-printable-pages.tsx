import type { Route } from "./+types/morse-code-printable-pages";

import PrintableMorsePages from "~/client/components/morse-code-books/PrintableMorsePages";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.printablePages;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const DESCRIPTION =
  "Create printable Morse code pages from custom text with text/Morse layouts, a site URL, QR code, and browser print or Save as PDF support.";

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: "Printable Morse Code Pages | MorseWords",
    description: DESCRIPTION,
    path: CANONICAL_PATH,
    keywords:
      "printable Morse code pages, Morse code printable, Morse code PDF, Morse code study sheet, print Morse text",
  });

export default function MorseCodePrintablePagesRoute() {
  const webpageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Printable Morse Code Pages",
    url: CANONICAL_URL,
    description: DESCRIPTION,
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Printable Morse Pages",
        item: CANONICAL_URL,
      },
    ],
  };

  return (
    <PrintableMorsePages
      kind="custom"
      canonicalPath={CANONICAL_PATH}
      schema={[webpageJsonLd, breadcrumbJsonLd]}
    />
  );
}
