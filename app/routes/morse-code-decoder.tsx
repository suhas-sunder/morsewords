import * as React from "react";
import type { Route } from "./+types/morse-code-decoder";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import styles from "~/client/components/shared/pageStyles";
import TranslatorSectionsBasic from "~/client/components/shared/TranslatorSectionsBasic";
import {
  morseToText,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-decoder";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Decoder | Convert Dots and Dashes to Text | MorseWords",
    description:
      "Paste Morse code dots and dashes into the decoder for Morse to English/text conversion, spacing troubleshooting, and unknown sequence checks.",
    path: CANONICAL_PATH,
    keywords:
      "morse code decoder, morse to text, morse to english, morse code to text, decode morse code, convert dots and dashes to text",
  });
}

const faqItems = [
  {
    q: "What is a Morse code decoder?",
    a: "A Morse code decoder converts dots and dashes into readable text using International Morse patterns.",
  },
  {
    q: "Why did my decoded text show a question mark?",
    a: "A question mark appears when a dot-dash group does not match a supported Morse character. The decoder keeps the uncertainty visible instead of guessing silently.",
  },
  {
    q: "How many spaces should I use between Morse letters?",
    a: "Use a visible gap between letter patterns. MorseWords treats 1 to 6 spaces as letter boundaries and 7 or more spaces as a word boundary.",
  },
  {
    q: "Can I decode Morse without spaces?",
    a: "No decoder can reliably split unspaced Morse into the intended letters because many different words can share the same run of dots and dashes.",
  },
  {
    q: "Should I use the decoder or word separator page?",
    a: "Use the decoder when your Morse is already separated enough to read. Use the word separator page when the main problem is fixing slashes, line breaks, or word gaps.",
  },
];

export default function MorseCodeDecoder() {
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Decoder",
        item: CANONICAL_URL,
      },
    ],
  };
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MorseWords Morse Code Decoder",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: CANONICAL_URL,
    description:
      "Morse-to-text decoder for converting separated dots and dashes into readable text while keeping unknown sequences visible.",
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
    <main className="mw-non-home-page" style={styles.page}>
      <div style={styles.wrap}>
        <TranslatorSectionsBasic
          title="Morse Code Decoder"
          subtitle={
            <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Paste Morse code dots and dashes, then convert them into readable
              text. Use this page when you already have Morse and need to
              interpret the message, check spacing, or run a more technical
              Morse to English/text check.
            </p>
          }
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          enableQueryPrefill
          preferredDirection="decode"
          quietInputFocus
        />

        <ReferenceSupportSections
          guide={{
            eyebrow: "Morse to text",
            title: "How to use the Morse code decoder",
            description:
              "Use this page when the input already contains Morse symbols and you need readable text back.",
            items: [
              {
                title: "Who it is for",
                text: "Puzzle solvers, learners, and operators checking copied dots and dashes from a message, worksheet, screenshot, or practice drill.",
              },
              {
                title: "What it accepts",
                text: "The decoder accepts dots, dashes, spaces, slashes, and new lines. Slashes and new lines are treated as word boundaries.",
              },
              {
                title: "How to use it",
                text: "Paste Morse into the Morse-to-text side, preserve letter gaps, then review the decoded text and any unknown groups.",
              },
            ],
          }}
          examples={{
            title: "Worked decoding examples",
            description:
              "These examples show how separators change the decoded result.",
            items: [
              {
                title: "SOS",
                morse: "... --- ...",
                children: (
                  <p>
                    With spaces between the three letter patterns, the decoder
                    reads this as SOS. See the{" "}
                    <a
                      href="/morse-code-sos"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      SOS guide
                    </a>{" "}
                    for the signal meaning.
                  </p>
                ),
              },
              {
                title: "HELLO",
                morse: ".... . .-.. .-.. ---",
                children: (
                  <p>
                    Each separated group maps to one letter. If those spaces are
                    removed, the message becomes ambiguous.
                  </p>
                ),
              },
              {
                title: "Slash word break",
                morse: "... --- ... / .... . .-.. .--.",
                children: (
                  <p>
                    The slash becomes a word boundary, so the decoder reads two
                    words instead of one continuous stream.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common decoding mistakes",
            description:
              "Decoding is usually wrong when separators are missing, symbols are invalid, or the wrong tool is used.",
            items: [
              {
                title: "No letter gaps",
                children: (
                  <p>
                    Morse without spaces can often be split more than one way.
                    Add letter gaps before expecting a reliable decode.
                  </p>
                ),
              },
              {
                title: "Unknown groups",
                children: (
                  <p>
                    A question mark means one group is not a supported Morse
                    pattern. Compare it with the{" "}
                    <a
                      href="/dictionary"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Morse code dictionary
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "Spacing cleanup first",
                children: (
                  <p>
                    If pasted Morse mixes slashes, pipes, and line breaks, clean
                    it with the{" "}
                    <a
                      href="/morse-code-word-separator"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      word separator
                    </a>{" "}
                    before decoding.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            title: "Decoder vs encoder vs word separator",
            description:
              "Start with the page that matches your current input format.",
            items: [
              {
                title: "Decoder",
                text: "Use this page when you already have Morse code and want readable text.",
                href: "/morse-code-decoder",
                badge: "Morse to text",
              },
              {
                title: "Reader",
                text: "Use the reader when you want a simpler paste-and-read flow for typed Morse.",
                href: "/morse-code-reader",
                badge: "Beginner",
              },
              {
                title: "Audio decoder",
                text: "Use the audio decoder when your input is a clean recording of Morse beeps rather than typed dots and dashes.",
                href: "/morse-code-audio-decoder",
                badge: "Audio file",
              },
              {
                title: "Encoder",
                text: "Use the encoder when you are starting with normal text.",
                href: "/morse-code-encoder",
                badge: "Text to Morse",
              },
              {
                title: "Word separator",
                text: "Use the separator page when pasted Morse needs cleaner spaces or visible word breaks.",
                href: "/morse-code-word-separator",
                badge: "Spacing",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after decoding",
            description:
              "After you have readable text, fix any spacing problems, then use the message for a short recall or typing session.",
            links: [
              { href: "/", label: "Open the main translator", primary: true },
              { href: "/morse-code-reader", label: "Simple reader" },
              { href: "/morse-code-without-spaces", label: "Unspaced Morse" },
              { href: "/copy-and-paste-morse-code", label: "Copy-paste guide" },
              { href: "/morse-code-word-separator", label: "Clean up spacing" },
              { href: "/morse-code-audio-decoder", label: "Decode audio file" },
              { href: "/typing", label: "Practice typed recall" },
              { href: "/morse-code-encoder", label: "Encode a reply" },
            ],
          }}
        />

        <FaqSectionGeneric title="Decoder FAQ" items={faqItems} />
      </div>

      <BreadcrumbTrail current="Morse Code Decoder" />
      <JsonLdScript jsonLd={jsonLd} />
    </main>
  );
}
