import type { Route } from "./+types/morse-code-book-translator";

import BookTranslatorTool from "~/client/components/morse-code-book-translator/BookTranslatorTool";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.bookTranslator;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const TITLE = "Book to Morse Code Translator and Audio Exporter";
const DESCRIPTION =
  "Paste or upload long-form text, TXT, MD, EPUB, or text-native PDF, estimate Morse runtime, split parts, and download MP3 or WAV ZIP bundles.";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: TITLE,
    url: CANONICAL_URL,
    description: DESCRIPTION,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Book to Morse Code Translator",
        item: CANONICAL_URL,
      },
    ],
  },
];

const howItWorksItems = [
  {
    title: "Load source text",
    text: "Paste directly, upload TXT or MD, or extract readable text from unprotected EPUB and text-native PDF files.",
  },
  {
    title: "Clean before converting",
    text: "Preview smart punctuation normalization, zero-width cleanup, Gutenberg stripping, and practice-friendly punctuation simplification.",
  },
  {
    title: "Estimate and split",
    text: "Use shared Morse timing to estimate runtime, then split long sources into stable parts by section, paragraph, sentence, or word boundaries.",
  },
  {
    title: "Export a bundle",
    text: "Download sorted MP3 or WAV parts with cleaned text, Morse transcript, manifest, settings, playlist, and README files.",
  },
];

const formatItems = [
  {
    title: "TXT and MD",
    text: "Plain text and Markdown are the best sources because paragraph breaks and punctuation are easy to preserve.",
  },
  {
    title: "EPUB",
    text: "Unprotected EPUB files are read from their declared spine order. DRM-protected books are rejected.",
  },
  {
    title: "PDF",
    text: "PDF extraction is best effort and only supports selectable text. Scanned image-only PDFs need OCR, which is intentionally out of scope.",
  },
  {
    title: "Rights and privacy",
    text: "Only use source text you have the right to process. You are responsible for the content you choose, including copyright or other usage limits; MorseWords does not host or authorize uploaded material.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export const meta: Route.MetaFunction = () =>
  seoMeta({
    title: `${TITLE} | MorseWords`,
    description: DESCRIPTION,
    path: CANONICAL_PATH,
    keywords:
      "book to morse code, ebook to morse code, morse code book translator, epub to morse code, pdf to morse code",
  });

export default function MorseCodeBookTranslatorRoute() {
  return (
    <main className={WAVE_PAGE_MAIN_CLASS}>
      <JsonLdScript jsonLd={jsonLd} />
      <PageHero
        eyebrow="Book export"
        title={TITLE}
        description="Prepare long-form source text for Morse code conversion, estimate listening time, split it into parts, and download a local MP3 or WAV bundle."
        aside={
          <DarkNote label="Supported sources" value="TXT MD EPUB PDF">
            TXT and MD are preferred. EPUB must be unprotected. PDF must contain
            selectable text; scanned PDFs are not OCR'd here.
          </DarkNote>
        }
      >
        <ActionLinks
          links={[
            { href: ROUTES.audio, label: "Open audio tool", primary: true },
            { href: ROUTES.encoder, label: "Use encoder" },
            { href: ROUTES.howToUse, label: "How to use MorseWords" },
          ]}
        />
      </PageHero>

      <BookTranslatorTool />

      <SectionCard
        eyebrow="Long-form workflow"
        title="How book export works"
        description="The page keeps the source local, extracts readable text, estimates Morse timing, and renders audio part by part instead of one huge book-length file."
        layout="stacked"
      >
        <SimpleGrid items={howItWorksItems} variant="plain" />
      </SectionCard>

      <SectionCard
        eyebrow="Source formats"
        title="Choose the cleanest source"
        description="Morse conversion is only as clean as the text source. EPUB and TXT usually beat PDF for long-form practice."
        layout="stacked"
      >
        <SimpleGrid items={formatItems} variant="plain" />
      </SectionCard>

      <BreadcrumbTrail
        current="Book to Morse Code Translator"
        placement="contentFooter"
      />
    </main>
  );
}
