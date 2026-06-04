import type { Route } from "./+types/morse-code-word-separator";

import WordSeparatorTool from "~/client/components/morse-code-word-separator/WordSeparatorTool";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import {
  SectionCard,
  StaticCodeBlock,
} from "~/client/components/shared/MorseLearningLayout";
import { ROUTES } from "~/client/data/routes";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.wordSeparator;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "Morse Code Word Separator | Spaces, Slash & Word Gaps | MorseWords",
    description:
      "Learn how to separate Morse code letters and words, when to use slash notation, and how written spaces differ from timed audio word gaps.",
    path: CANONICAL_PATH,
    keywords:
      "morse code word separator, morse code slash separator, what does slash mean in Morse code, how to separate words in Morse code, Morse code spaces, space in Morse code, Morse code spacing, written Morse code slash, Morse code letters separated by spaces",
  });
}

const faqItems = [
  {
    q: "What is the word separator in Morse code?",
    a: "In written Morse, a slash / is commonly used to show a word break. In timed Morse audio, the word separator is a longer silence between words.",
  },
  {
    q: "Why is a slash used between Morse code words?",
    a: "The slash makes word boundaries visible when dots and dashes are copied as text. It is easier to read than counting a long run of spaces.",
  },
  {
    q: "Do you put spaces between Morse code letters?",
    a: "Yes. Written Morse usually uses one space between letter groups, such as .... . for HE. Without letter spaces, the same marks can become ambiguous.",
  },
  {
    q: "Do you put a slash between every letter?",
    a: "No. Use spaces between letters and use a slash only between words. H/E/L/L/O with slashes between every letter is harder to copy and not the usual word-separator convention.",
  },
  {
    q: "Is the slash actually sent in Morse audio?",
    a: "No. Audio Morse sends silence between letters and a longer silence between words. The slash is a written notation convenience, not a sound you insert between words.",
  },
  {
    q: "What is the difference between a word gap and a slash?",
    a: "A word gap is timing: a longer pause in the signal. A slash is text notation: a visible mark that represents that word boundary after the Morse has been written down.",
  },
  {
    q: "How do I write a space in Morse code?",
    a: "Write each Morse letter with spaces between letter groups, then put a slash or a wider gap between words. For example, HELLO WORLD is .... . .-.. .-.. --- / .-- --- .-. .-.. -...",
  },
  {
    q: "What does / mean in written Morse code?",
    a: "/ usually means word break in copied Morse. The same keyboard character can also be the slash punctuation mark when you are encoding normal text, so context matters.",
  },
  {
    q: "How do I separate sentences in Morse code?",
    a: "Keep normal letter spaces inside each word, use slashes between words, and include punctuation marks such as a period when the punctuation is part of the message.",
  },
  {
    q: "Why does Morse code without spaces become hard to read?",
    a: "Morse letters are groups of dots and dashes. If all spaces disappear, readers cannot reliably tell where one letter ends and the next begins.",
  },
  {
    q: "Does slash also have its own Morse code character?",
    a: "Yes. The slash punctuation character is -..-. in International Morse. That is different from using / as a visible word separator in copied text.",
  },
  {
    q: "What spacing should I use for copy and paste?",
    a: "Use one space between Morse letters and a slash with spaces around it between words, such as .... .. / - .... . .-. . . This format is readable and decoder-friendly.",
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
    "@id": `${CANONICAL_URL}#webapp`,
    url: CANONICAL_URL,
    description:
      "Tool and guide for normalizing Morse code letter spaces, slash word separators, timing-style word gaps, pipes, and new lines.",
    featureList: [
      "Normalize written Morse letter and word separators",
      "Convert English text to Morse with slash, pipe, or timing-style spacing",
      "Explain slash word separators versus timed audio word gaps",
      "Show copy-ready Morse examples with spaces and slash notation",
    ],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${CANONICAL_URL}#faq`,
    url: CANONICAL_URL,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const jsonLd = [breadcrumbJsonLd, webAppJsonLd, faqJsonLd];

  return (
    <main className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <WordSeparatorTool />

        <SectionCard
          eyebrow="Quick answer"
          title="Use spaces for letters and / for words"
          description="Written Morse uses visible separators so people and decoders can see where each letter and word begins."
          layout="stacked"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(280px,0.42fr)] lg:items-start">
            <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p className="mw-text-muted">
                In written Morse code, letters are usually separated by spaces.
                Words are often separated by a slash <strong>/</strong>.
              </p>
              <p className="mw-text-muted">
                In actual timed Morse audio, the slash is not sent as a symbol
                between words. A longer word gap is used instead. The slash is a
                text notation convenience for readability.
              </p>
              <p className="mw-text-muted">
                If you are checking timing rather than written notation, use the{" "}
                <a
                  href={ROUTES.timing}
                  className="cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  Morse timing guide
                </a>{" "}
                or the{" "}
                <a
                  href={ROUTES.farnsworth}
                  className="cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  Farnsworth timing guide
                </a>
                .
              </p>
            </div>
            <StaticCodeBlock aria-label="HELLO WORLD written Morse example">
              {"HELLO WORLD\n.... . .-.. .-.. --- / .-- --- .-. .-.. -.."}
            </StaticCodeBlock>
          </div>
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Spacing notation",
            title: "How written Morse spacing works",
            description:
              "Use this page when the Morse pattern is present but letter spaces, word slashes, or visible word breaks need repair.",
            items: [
              {
                title: "Letter spacing",
                text: "Keep one visible space between Morse letters. That makes .... . read as H E instead of one unclear mark stream.",
              },
              {
                title: "Word spacing",
                text: "Put a larger break between words. In written Morse, / is the clearest common word separator for copy and paste.",
              },
              {
                title: "Spaces versus slashes",
                text: "Spaces separate letters. A slash separates words. Seven spaces can also show a timing-style word gap, but slashes are easier to see.",
              },
              {
                title: "Pipes and line breaks",
                text: "You may see | or new lines in puzzles, worksheets, and old copied notes. They usually play the same role as a visible word divider.",
              },
              {
                title: "Timed audio gaps",
                text: "Audio Morse uses silence: short gaps inside a letter, longer gaps between letters, and the longest gaps between words.",
                href: ROUTES.timing,
                badge: "Timing",
              },
              {
                title: "Slash punctuation",
                text: "The slash punctuation character has its own Morse pattern, -..-. That is different from a plain / used as a word separator.",
                href: ROUTES.slash,
                badge: "Slash",
              },
            ],
          }}
          examples={{
            title: "Written Morse spacing examples",
            description:
              "Each example shows plain text, written Morse with letter spaces and / word breaks, and a note about the separator.",
            items: [
              {
                title: "SOS HELP",
                morse: "... --- ... / .... . .-.. .--.",
                children: (
                  <p>
                    <strong>Plain text:</strong> SOS HELP. The slash marks the
                    word break between SOS and HELP. The{" "}
                    <a
                      href={ROUTES.slash}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      slash guide
                    </a>{" "}
                    explains when / is a separator and when it is punctuation.
                  </p>
                ),
              },
              {
                title: "HELLO WORLD",
                morse: ".... . .-.. .-.. --- / .-- --- .-. .-.. -..",
                children: (
                  <p>
                    <strong>Plain text:</strong> HELLO WORLD. Letters stay
                    separated by spaces, while / marks the word break. The{" "}
                    <a
                      href={ROUTES.space}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      space guide
                    </a>{" "}
                    compares letter gaps and word gaps.
                  </p>
                ),
              },
              {
                title: "I LOVE YOU",
                morse: ".. / .-.. --- ...- . / -.-- --- ..-",
                children: (
                  <p>
                    <strong>Plain text:</strong> I LOVE YOU. The slash keeps the
                    three words visible for copy, cards, practice notes, and
                    decoding.
                  </p>
                ),
              },
              {
                title: "CQ CQ",
                morse: "-.-. --.- / -.-. --.-",
                children: (
                  <p>
                    <strong>Plain text:</strong> CQ CQ. Repeated short words
                    need a word separator so they do not collapse into one
                    longer Morse string.
                  </p>
                ),
              },
              {
                title: "HELLO, WORLD",
                morse: ".... . .-.. .-.. --- --..-- / .-- --- .-. .-.. -..",
                children: (
                  <p>
                    <strong>Plain text:</strong> HELLO, WORLD. The comma uses
                    its own Morse pattern before the word slash. Check the{" "}
                    <a
                      href={ROUTES.punctuation}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      punctuation reference
                    </a>{" "}
                    when a slash or comma is part of the message itself.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common spacing mistakes",
            description:
              "Spacing errors are easy to miss because the dots and dashes may still look valid while the message becomes harder to read.",
            items: [
              {
                title: "Removing all spaces",
                children: (
                  <p>
                    A stream such as <code>.......</code> is not a safe written
                    message. Add letter spaces before using the{" "}
                    <a
                      href={ROUTES.reader}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse reader
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "Using slash between letters",
                children: (
                  <p>
                    Do not write H/E/L/L/O when you mean HELLO. Use spaces
                    inside a word and reserve / for word breaks.
                  </p>
                ),
              },
              {
                title: "Confusing slash roles",
                children: (
                  <p>
                    In copied Morse, / usually means a word break. In plain text
                    before encoding, slash can also be punctuation, so check the{" "}
                    <a
                      href={ROUTES.punctuation}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      punctuation reference
                    </a>{" "}
                    when the slash is part of the message.
                  </p>
                ),
              },
              {
                title: "Expecting audio to play /",
                children: (
                  <p>
                    Morse audio uses silence for word gaps. The slash is a
                    readable text mark, not an extra tone or spoken symbol.
                  </p>
                ),
              },
              {
                title: "Mixing separators carelessly",
                children: (
                  <p>
                    A pasted message may use /, |, extra spaces, and line
                    breaks. Normalize it here before using the{" "}
                    <a
                      href={ROUTES.reader}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse reader
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "Ignoring timing guides",
                children: (
                  <p>
                    Written separators are only notation. For actual pause
                    lengths, review{" "}
                    <a
                      href={ROUTES.timing}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse timing
                    </a>{" "}
                    and{" "}
                    <a
                      href={ROUTES.farnsworth}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Farnsworth spacing
                    </a>
                    .
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Reference paths",
            title: "Where to check spacing, symbols, and timing",
            description:
              "Use these references when you need the alphabet, punctuation, slash, space, reader, or timing side of a separator question.",
            items: [
              {
                title: "Morse code chart",
                text: "Check the full A-Z, number, punctuation, and spacing reference before copying a long message.",
                href: ROUTES.chart,
                badge: "Chart",
              },
              {
                title: "Morse code alphabet",
                text: "Review letter patterns so you can spot where spaces between letters belong.",
                href: ROUTES.alphabet,
                badge: "A-Z",
              },
              {
                title: "Morse punctuation",
                text: "Confirm when slash, comma, period, and other punctuation are real characters in the message.",
                href: ROUTES.punctuation,
                badge: "Symbols",
              },
              {
                title: "Morse reader",
                text: "Read properly separated dots and dashes after you clean spaces, slashes, pipes, or line breaks.",
                href: ROUTES.reader,
                badge: "Read",
              },
            ],
          }}
          nextStep={{
            title: "Related spacing, reference, and audio tools",
            description:
              "Once the written Morse is separated cleanly, move to the chart, reader, timing, or audio tools that match the next job.",
            links: [
              { href: ROUTES.reader, label: "Read cleaned Morse", primary: true },
              { href: ROUTES.chart, label: "Morse code chart" },
              { href: ROUTES.alphabet, label: "Alphabet" },
              { href: ROUTES.punctuation, label: "Punctuation" },
              { href: ROUTES.slash, label: "Slash guide" },
              { href: ROUTES.space, label: "Space guide" },
              { href: ROUTES.timing, label: "Timing gaps" },
              { href: ROUTES.farnsworth, label: "Farnsworth" },
              { href: ROUTES.audio, label: "Audio hub" },
              { href: ROUTES.soundGenerator, label: "Sound generator" },
              { href: ROUTES.mp3Generator, label: "MP3 generator" },
              { href: ROUTES.bookTranslator, label: "Book translator" },
            ],
          }}
        />

        <div id="faq">
          <FaqSectionGeneric
            title="Morse code word separator FAQ"
            description="Quick answers for spaces, slash notation, written Morse, and timed word gaps."
            items={faqItems}
          />
        </div>
      </div>

      <BreadcrumbTrail current="Morse Code Word Separator" />
      <JsonLdScript jsonLd={jsonLd} />
    </main>
  );
}
