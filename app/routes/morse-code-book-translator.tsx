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
const TITLE = "Book to Morse Code Translator and Audio Download Tool";
const DESCRIPTION =
  "Paste or upload TXT, MD, EPUB, or text-native PDF, estimate Morse runtime, split safe parts, and download local MP3 or WAV ZIP bundles.";

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
    text: "Paste directly, upload TXT or MD, or extract readable text from unprotected EPUB and text-native PDF files in your browser.",
  },
  {
    title: "Clean before converting",
    text: "Preview smart punctuation normalization, zero-width cleanup, Gutenberg stripping, and practice-friendly punctuation simplification.",
  },
  {
    title: "Estimate and split",
    text: "Estimate Morse runtime, then split long sources at safe section, paragraph, sentence, or word boundaries rather than assuming original chapters.",
  },
  {
    title: "Download the audio",
    text: "Download one MP3 or WAV when the source fits, or a sorted ZIP bundle with transcripts, manifest, settings, playlist, and README files when extras are selected.",
  },
];

const formatItems = [
  {
    title: "Best sources",
    text: "TXT and EPUB usually produce the cleanest long-form Morse text. Markdown also works well when headings and paragraphs are simple.",
  },
  {
    title: "EPUB",
    text: "Unprotected EPUB files are read from their declared spine order. DRM-protected books are rejected.",
  },
  {
    title: "PDF limits",
    text: "PDF support is text-native and best effort. Scanned or image-only PDFs are not supported because OCR is not included.",
  },
  {
    title: "MP3 or WAV",
    text: "MP3 is recommended for long downloads because it stays smaller. WAV is available for short or uncompressed downloads, but can get large quickly.",
  },
  {
    title: "Local processing",
    text: "Source files are handled locally in your browser. MorseWords does not upload book text, cleaned text, transcripts, or download results.",
  },
  {
    title: "Rights and privacy",
    text: "Use source text you have the right to convert and use. You are responsible for the content you choose, including copyright or other usage limits.",
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
        eyebrow="Book download"
        title={TITLE}
        description="Prepare long-form source text for Morse code conversion, estimate listening time, split it into safe parts, and download an MP3 or WAV bundle."
        aside={
          <DarkNote label="Supported sources" value="TXT MD EPUB PDF">
            TXT and EPUB are best for long downloads. PDF must contain selectable
            text; scanned PDFs are not OCR'd here.
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
        title="How book downloads work"
        description="The page extracts readable text locally, estimates Morse timing, and renders audio part by part instead of one huge book-length file."
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
