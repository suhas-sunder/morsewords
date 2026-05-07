import type { Route } from "./+types/morse-code-punctuation";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  ReferenceTable,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import { PUNCTUATION } from "~/client/data/morseLearning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-punctuation";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "Morse Code Punctuation | Symbols, Marks, and Formatting Guide | MorseWords",
    description:
      "Look up Morse code punctuation marks with examples, formatting tips, common mistakes, and links to related symbol and translation tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code punctuation, period in morse code, comma morse code, question mark morse, slash morse code, at sign morse code",
  });
}

const faqItems = [
  {
    q: "Does Morse code include punctuation?",
    a: "Yes. International Morse includes common punctuation marks such as period, comma, question mark, slash, apostrophe, parentheses, colon, semicolon, equals, plus, at sign, and quotation mark.",
  },
  {
    q: "Why are punctuation patterns longer than letters?",
    a: "Punctuation marks are less common than letters, so their Morse patterns are usually longer and easier to confuse if you do not practice them separately.",
  },
  {
    q: "Should I use punctuation when practicing Morse?",
    a: "Start with letters and numbers first, then add punctuation once you are translating real sentences or copied text that includes marks such as question marks or commas.",
  },
  {
    q: "Is a slash the same as a word separator?",
    a: "No. A slash can be encoded as punctuation in plain text, but typed Morse often uses / as a written word break. The word separator guide explains that spacing convention.",
  },
  {
    q: "How is punctuation different from prosigns?",
    a: "Punctuation represents written symbols inside a message. Prosigns are procedural operating signals, and Q-codes are radio shorthand groups.",
  },
];

export default function MorseCodePunctuation() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Punctuation",
        item: canonicalUrl(CANONICAL_PATH),
      },
    ],
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Punctuation",
    url: canonicalUrl(CANONICAL_PATH),
    description:
      "A focused reference for punctuation marks and symbols supported by the MorseWords translator, decoder, audio tools, and worksheets.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
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
  const jsonLd = [breadcrumbJsonLd, pageJsonLd, faqJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Symbol lookup"
          title="Morse Code Punctuation"
          description="Look up the Morse patterns for written symbols used in real messages: question marks, periods, commas, slashes, apostrophes, parentheses, and other punctuation marks."
          aside={
            <DarkNote label="Common search" value="..--..">
              The question mark is one of the most-searched punctuation marks
              because it appears in copied text, practice questions, and Q-code
              examples.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-encoder", label: "Encode text", primary: true },
              { href: "/morse-code-decoder", label: "Decode Morse" },
              { href: "/morse-code-word-separator", label: "Spacing guide" },
              { href: "/morse-code-prosigns", label: "Prosigns" },
              { href: "/morse-code-q-codes", label: "Q-codes" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Lookup table"
          title="Morse punctuation chart"
          description="MorseWords supports these punctuation marks in the translator, decoder, audio generator, and worksheet tools."
        >
          <ReferenceTable
            items={PUNCTUATION}
            onPlay={(morse) => playMorsePattern(morse)}
          />
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Formatting guide",
            title: "How to use Morse punctuation",
            description:
              "Use this page when you are translating normal written symbols inside a sentence, not procedural signals or radio shorthand.",
            items: [
              {
                title: "Who it is for",
                text: "Use this reference when pasted text includes marks like ?, ., comma, slash, apostrophe, parentheses, colon, or @.",
              },
              {
                title: "What it includes",
                text: "The chart covers common punctuation marks and symbols supported by the MorseWords translator and decoder.",
              },
              {
                title: "How to apply it",
                text: "Find the written mark, copy or play its Morse pattern, then test the full sentence in the encoder or decoder.",
              },
            ],
          }}
          examples={{
            title: "Worked punctuation examples",
            description:
              "These examples show why punctuation needs its own lookup page instead of being treated like letters.",
            items: [
              {
                title: "Question mark",
                morse: "..--..",
                children: (
                  <p>
                    Use the question mark pattern when translated text contains
                    a real written question, such as QTH? or COPY?
                  </p>
                ),
              },
              {
                title: "Period and comma",
                morse: ".-.-.- / --..--",
                children: (
                  <p>
                    Sentence punctuation is longer than most letters, so it is
                    worth checking before copying a full message into the{" "}
                    <a
                      href="/morse-code-encoder"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      encoder
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "Slash and at sign",
                morse: "-..-. / .--.-.",
                children: (
                  <p>
                    Slash and @ are useful for address-style text. If slash is
                    being used as Morse spacing, compare it with the{" "}
                    <a
                      href="/morse-code-word-separator"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      word separator guide
                    </a>
                    .
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common punctuation mistakes",
            description:
              "Most punctuation errors come from mixing typed text marks with Morse spacing or procedural signals.",
            items: [
              {
                title: "Using slash for two jobs",
                children: (
                  <p>
                    In plain text, slash is punctuation. In written Morse, /
                    often marks a word break. Keep those input modes separate.
                  </p>
                ),
              },
              {
                title: "Skipping punctuation in copied text",
                children: (
                  <p>
                    If a sentence includes a question mark or comma, the mark
                    changes the Morse output and should not be ignored.
                  </p>
                ),
              },
              {
                title: "Confusing plus with AR",
                children: (
                  <p>
                    The plus sign shares the .-.-. pattern with the AR prosign,
                    but punctuation and prosigns have different purposes.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            title: "Punctuation vs prosigns vs Q-codes",
            description:
              "These pages all help with non-letter Morse, but each page has a different job.",
            items: [
              {
                title: "Punctuation",
                text: "Use punctuation when you want to translate normal written symbols in a message.",
                href: "/morse-code-punctuation",
                badge: "Symbols",
              },
              {
                title: "Prosigns",
                text: "Use prosigns when you are learning procedural operating signals such as start, end, wait, or correction.",
                href: "/morse-code-prosigns",
                badge: "Signals",
              },
              {
                title: "Q-codes",
                text: "Use Q-codes when you are learning radio shorthand meanings such as QTH, QSL, QRS, or QRZ.",
                href: "/morse-code-q-codes",
                badge: "Radio",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after checking punctuation",
            description:
              "Once the punctuation pattern is clear, test the surrounding message in a tool that handles full text or pasted Morse.",
            links: [
              { href: "/morse-code-encoder", label: "Encode text", primary: true },
              { href: "/morse-code-decoder", label: "Decode Morse" },
              { href: "/dictionary", label: "Search dictionary" },
              { href: "/international-morse-code-reference", label: "Full reference" },
              { href: "/morse-code-word-separator", label: "Spacing guide" },
            ],
          }}
        />

        <FaqSectionGeneric
          title="Morse punctuation FAQ"
          items={faqItems}
        />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
