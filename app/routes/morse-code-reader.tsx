import type { Route } from "./+types/morse-code-reader";

import MorseCodeReaderTool from "~/client/components/morse-code-reader/MorseCodeReaderTool";
import { SeoSectionInlineAd } from "~/client/components/ads/AdSenseAds";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import { ROUTES } from "~/client/data/routes";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.reader;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const readerExamples = [
  {
    title: "SOS",
    morse: "... --- ...",
    text: "SOS",
    note: "Three separated letters. Without the spaces, the run becomes less reliable as a general rule.",
  },
  {
    title: "HELLO WORLD",
    morse: ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
    text: "HELLO WORLD",
    note: "The slash keeps the word break visible between HELLO and WORLD.",
  },
  {
    title: "HELP ME",
    morse: ".... . .-.. .--. / -- .",
    text: "HELP ME",
    note: "Letter spaces stay inside each word, and the slash separates the two words.",
  },
  {
    title: "I LOVE YOU",
    morse: ".. / .-.. --- ...- . / -.-- --- ..-",
    text: "I LOVE YOU",
    note: "Short words make the slash separators easy to check before sharing.",
  },
  {
    title: "TEST",
    morse: "- . ... -",
    text: "TEST",
    note: "A compact check word for confirming that each Morse group reads as one letter.",
  },
];

const howToItems = [
  {
    title: "Paste Morse",
    text: "Use typed dots and dashes from a puzzle, worksheet, message, or copied text block.",
  },
  {
    title: "Keep letter spaces",
    text: "A separated group such as .... is one character. Spaces between groups tell the reader where letters end.",
  },
  {
    title: "Use / between words",
    text: "Slash separators are easier to preserve than repeated spaces when Morse is copied through apps.",
    href: ROUTES.slash,
    badge: "Slash",
  },
  {
    title: "Read the result",
    text: "Check the decoded text, then fix spacing or unknown groups if the output includes ? or looks joined together.",
    href: ROUTES.wordSeparator,
    badge: "Spacing",
  },
];

const spacingItems = [
  {
    title: "One visible gap between letters",
    text: "Typed Morse needs a visible separator between character groups so .... . reads as H E, not one long unknown group.",
    href: ROUTES.space,
    badge: "Spaces",
  },
  {
    title: "Slash between words",
    text: "Use / for word breaks when a normal word gap might be collapsed by a text field, chat app, or note.",
    href: ROUTES.slash,
    badge: "Words",
  },
  {
    title: "Audio timing is different",
    text: "Real Morse uses pauses for letter and word gaps. Typed Morse uses visible spacing so a reader can keep the same boundaries.",
    href: ROUTES.wordSeparator,
    badge: "Timing",
  },
  {
    title: "No-space Morse is ambiguous",
    text: "A continuous run can often be split more than one way. Add separators before trusting the decoded result.",
    href: ROUTES.withoutSpaces,
    badge: "Ambiguous",
  },
];

const comparisonItems = [
  {
    title: "Reader",
    text: "Use this page when you want the simplest paste-and-read flow for typed dots, dashes, spaces, and slashes.",
    href: ROUTES.reader,
    badge: "Simple",
  },
  {
    title: "Decoder",
    text: "Use the technical decoder when you want the standard conversion tool for checking unknown groups and spacing details.",
    href: ROUTES.decoder,
    badge: "Advanced",
  },
  {
    title: "Audio decoder",
    text: "Use the audio decoder when your input is a sound file rather than pasted text symbols.",
    href: ROUTES.audioDecoder,
    badge: "Audio",
  },
  {
    title: "Encoder",
    text: "Use the encoder when you are starting with normal text and need clean Morse output.",
    href: ROUTES.encoder,
    badge: "Encode",
  },
  {
    title: "Book translator",
    text: "Use the book translator when the readable text is long enough to become a chapter, article, or book-length audio export.",
    href: ROUTES.bookTranslator,
    badge: "Long text",
  },
];

const mistakeItems = [
  {
    title: "Pasting Morse with no spaces",
    text: "The reader needs boundaries. Add spaces between letters before treating the decoded text as reliable.",
  },
  {
    title: "Using long dashes",
    text: "Hyphen-minus is safest for typed dashes. Rich text can replace it with dash characters that are harder to share.",
    href: ROUTES.copyAndPaste,
    badge: "Copy",
  },
  {
    title: "Mixing punctuation dots",
    text: "A period in normal writing is not the same job as a Morse dot inside a separated Morse group.",
    href: ROUTES.chart,
    badge: "Chart",
  },
  {
    title: "Losing slashes",
    text: "If word separators disappear, decoded words can run together or become harder to check.",
    href: ROUTES.wordSeparator,
    badge: "Fix",
  },
  {
    title: "Expecting audio files to work here",
    text: "This reader handles typed symbols. Use the audio decoder for uploaded recordings.",
    href: ROUTES.audioDecoder,
    badge: "Audio",
  },
  {
    title: "Copying stylized symbols",
    text: "Decorative dots, bullets, and styled dash characters can change how pasted Morse behaves.",
    href: ROUTES.copyAndPaste,
    badge: "Plain text",
  },
];

const faqItems = [
  {
    q: "Can I use this as a Morse to English reader?",
    a: "Yes. Paste Morse with spaces between letters or / between words, and the reader will show readable English/text where the Morse groups are supported.",
  },
  {
    q: "What does a Morse code reader do?",
    a: "A Morse code reader lets you paste typed dots, dashes, spaces, and slash-separated words, then shows the decoded text.",
  },
  {
    q: "Can I paste Morse code with slashes between words?",
    a: "Yes. This reader treats / as a word break when it appears between Morse groups.",
  },
  {
    q: "Why did the reader show a question mark?",
    a: "A question mark means one separated dot-dash group does not match a supported Morse character.",
  },
  {
    q: "Can this reader decode Morse without spaces?",
    a: "Not reliably. Unspaced Morse can often be split into different valid letters, so add spaces between letter groups first.",
  },
  {
    q: "Should I use the reader or the decoder?",
    a: "Use the reader for a simple paste-and-read result. Use the decoder when you want the more technical Morse-to-text tool.",
  },
  {
    q: "Can this page read Morse from an audio file?",
    a: "No. Use the Morse code audio decoder when your input is a recording or uploaded sound file.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Reader | Paste Morse and Read Text | MorseWords",
    description:
      "Use this Morse to English/text reader by pasting Morse code dots and dashes, then read decoded text, try examples, get spacing help, and open decoder or audio tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code reader, morse reader, read morse code, paste morse code, morse to english, morse code to text reader",
  });
}

export default function MorseCodeReaderRoute() {
  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Reader",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "A beginner-facing pasted-Morse reader for typed dots, dashes, spaces, and slash-separated words.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
        name: "Morse Code Reader",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Paste and read"
          title="Morse Code Reader"
          description="Paste typed Morse and read the English/text result."
        />

        <div id="reader">
          <MorseCodeReaderTool />
        </div>

        <SectionCard
          eyebrow="How it works"
          title="How to read Morse code with this tool"
          description="Keep the typed Morse simple, preserve the boundaries, and use the decoded text as a quick reading check."
        >
          <SimpleGrid items={howToItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Examples"
          title="Morse reader examples"
          description="These examples match the buttons in the reader, so you can compare the pasted Morse with the readable text."
          layout="stacked"
        >
          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2 xl:grid-cols-5">
            {readerExamples.map((example) => (
              <article key={example.title} className="min-w-0 py-1">
                <p className="mw-muted-label font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {example.title}
                </p>
                <p className="mw-input-text mt-3 break-words font-mono text-base font-bold tracking-[0.12em] text-slate-950">
                  {example.morse}
                </p>
                <h3 className="mw-heading mt-3 text-xl font-extrabold text-sky-950">
                  {example.text}
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {example.note}
                </p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Spacing"
          title="Why spacing matters"
          description="Morse is readable only when letters and words have visible boundaries."
        >
          <SimpleGrid items={spacingItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Choose the right tool"
          title="Reader vs decoder"
          description="Start with the page that matches the input you actually have."
        >
          <SimpleGrid items={comparisonItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Use it well"
          title="Common Morse reader mistakes"
          description="Most reader problems come from spacing changes, copied symbols, or using a text reader for audio input."
        >
          <SimpleGrid items={mistakeItems} linkedItemStyle="inline" />
        </SectionCard>

        <SeoSectionInlineAd />

        <SectionCard
          eyebrow="Reference"
          title="Check the Morse pattern"
          description="Use a reference when the decoded result includes an unknown group or when a symbol does not look familiar."
        >
          <ActionLinks
            links={[
              {
                href: ROUTES.alphabet,
                label: "Morse alphabet",
                primary: true,
              },
              { href: ROUTES.chart, label: "Complete chart" },
              { href: ROUTES.encoder, label: "Encode text" },
              { href: ROUTES.bookTranslator, label: "Long text to audio" },
              { href: ROUTES.howToRead, label: "How to read Morse" },
            ]}
          />
        </SectionCard>

        <div id="faq">
          <FaqSectionGeneric
            title="Morse code reader FAQ"
            description="Use these answers when pasted Morse does not read the way you expected."
            items={faqItems}
            variant="home"
          />
        </div>

        <JsonLdScript
          jsonLd={[webApplicationJsonLd, breadcrumbJsonLd, faqJsonLd]}
        />
      </main>
      <BreadcrumbTrail current="Morse Code Reader" placement="pageBottom" />
    </div>
  );
}
