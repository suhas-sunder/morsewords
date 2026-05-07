import type { Route } from "./+types/morse-code-word-separator";

import WordSeparatorTool from "~/client/components/morse-code-word-separator/WordSeparatorTool";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-word-separator";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "Morse Code Word Separator | Fix Spaces, Slashes, and Letter Gaps | MorseWords",
    description:
      "Learn how Morse code words are separated, fix spacing problems, compare slashes and spaces, and prepare Morse text for decoding.",
    path: CANONICAL_PATH,
    keywords:
      "morse code word separator, morse code slash separator, morse code spacing, morse letter gaps, morse word gaps",
  });
}

const faqItems = [
  {
    q: "What separates words in Morse code?",
    a: "In timing, a word gap is a longer pause than a letter gap. In copied text, MorseWords can represent that word gap with 7 spaces, a slash, a pipe, or a new line.",
  },
  {
    q: "Is a slash the same as a space in Morse?",
    a: "A slash is not a timed sound. It is a visible text convention that often means a Morse word break when dots and dashes are copied into plain text.",
  },
  {
    q: "Can Morse code be decoded without spaces?",
    a: "Not reliably. Without letter and word separators, the same continuous dot-dash stream can often be split into different possible messages.",
  },
  {
    q: "Why does spacing change the decoded message?",
    a: "Morse letters are built from groups of dots and dashes. Moving a boundary changes which group is decoded, so the resulting text can change.",
  },
  {
    q: "Should I use the word separator or the decoder?",
    a: "Use the word separator when your Morse needs cleaner spaces, slashes, pipes, or line breaks. Use the decoder once the Morse is separated enough to read.",
  },
];

export default function MorseCodeWordSeparator() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Word Separator",
        item: CANONICAL_URL,
      },
    ],
  };
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Word Separator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "Tool for normalizing Morse code letter and word separators with 7 spaces, slashes, pipes, or new lines.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
  const jsonLd = [breadcrumbJsonLd, webAppJsonLd, faqJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <WordSeparatorTool />

        <ReferenceSupportSections
          guide={{
            eyebrow: "Spacing cleanup",
            title: "How to use the Morse code word separator",
            description:
              "Use this page when the Morse pattern is present but the spacing or visible word breaks need repair.",
            items: [
              {
                title: "Who it is for",
                text: "Learners, puzzle solvers, and teachers working with copied Morse that has inconsistent spaces, slashes, pipes, or line breaks.",
              },
              {
                title: "What it does",
                text: "The tool normalizes Morse word breaks or converts English into Morse with your chosen separator format.",
              },
              {
                title: "How to use it",
                text: "Paste the Morse, choose the separator style, then copy the cleaned output before decoding or sharing it.",
              },
            ],
          }}
          examples={{
            title: "Worked spacing examples",
            description:
              "These examples show why the separator choice matters before decoding.",
            items: [
              {
                title: "SOS HELP",
                morse: "... --- ... / .... . .-.. .--.",
                children: (
                  <p>
                    The slash marks the word break. Without that break, the
                    decoder would see one continuous word of Morse groups.
                  </p>
                ),
              },
              {
                title: "7-space word gap",
                morse: "... --- ...       .... . .-.. .--.",
                children: (
                  <p>
                    Seven spaces are the text version of a Morse word gap. This
                    is useful when you want timing-style spacing instead of a
                    slash.
                  </p>
                ),
              },
              {
                title: "Unspaced Morse",
                morse: "...---...",
                children: (
                  <p>
                    A continuous stream is ambiguous. Add letter and word
                    separators before expecting a reliable{" "}
                    <a
                      href="/morse-code-decoder"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      decoder
                    </a>{" "}
                    result.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common spacing mistakes",
            description:
              "Spacing errors are easy to miss because the dots and dashes may still look valid.",
            items: [
              {
                title: "Using slash two ways",
                children: (
                  <p>
                    In copied Morse, / usually means a word break. In plain text
                    before encoding, slash can also be punctuation, so check the{" "}
                    <a
                      href="/morse-code-punctuation"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      punctuation reference
                    </a>{" "}
                    when the slash is part of the message.
                  </p>
                ),
              },
              {
                title: "Treating every space as a word",
                children: (
                  <p>
                    A single visible gap separates letters. A word gap needs a
                    longer pause or a visible separator such as /.
                  </p>
                ),
              },
              {
                title: "Decoding before cleanup",
                children: (
                  <p>
                    If the pasted Morse mixes multiple separator styles, clean
                    it here before using the{" "}
                    <a
                      href="/morse-code-decoder"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse decoder
                    </a>
                    .
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            title: "Word separator vs encoder vs decoder",
            description:
              "This page is for spacing problems, not for normal text conversion.",
            items: [
              {
                title: "Word separator",
                text: "Use this page when the Morse pattern exists but the spaces, slashes, pipes, or line breaks need cleanup.",
                href: "/morse-code-word-separator",
                badge: "Spacing",
              },
              {
                title: "Encoder",
                text: "Use the encoder to create Morse from normal text.",
                href: "/morse-code-encoder",
                badge: "Text to Morse",
              },
              {
                title: "Decoder",
                text: "Use the decoder to read properly separated Morse as text.",
                href: "/morse-code-decoder",
                badge: "Morse to text",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after fixing spacing",
            description:
              "Once the Morse is separated cleanly, decode it, compare symbols, or learn the timing rules behind the gaps.",
            links: [
              { href: "/morse-code-decoder", label: "Decode cleaned Morse", primary: true },
              { href: "/morse-code-encoder", label: "Encode from text" },
              { href: "/dictionary", label: "Look up a symbol" },
              { href: "/morse-code-timing", label: "Review timing gaps" },
              { href: "/farnsworth-timing", label: "Learn Farnsworth timing" },
            ],
          }}
        />

        <FaqSectionGeneric title="Word Separator FAQ" items={faqItems} />
      </div>

      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
