import type { Route } from "./+types/international-morse-code-reference";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  ReferenceTable,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import { DIGITS, LETTERS, PROSIGNS, PUNCTUATION, Q_CODES } from "~/client/data/morseLearning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/international-morse-code-reference";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "International Morse Code Reference | Letters, Numbers, Symbols, and Signals | MorseWords",
    description:
      "Review the supported International Morse code reference for letters, numbers, symbols, prosigns, Q-codes, timing context, and related lookup pages.",
    path: CANONICAL_PATH,
    keywords:
      "International Morse code reference, Morse code letters, Morse code numbers, Morse prosigns, Morse Q-codes",
  });
}

const faqItems = [
  {
    q: "Is this the same as the Morse alphabet?",
    a: "No. The alphabet page focuses on A-Z letters. This international reference includes the broader supported set, including letters, digits, punctuation, prosigns, Q-codes, and timing links.",
  },
  {
    q: "Does International Morse include punctuation?",
    a: "Yes. International Morse includes common punctuation marks, though they are less frequently practiced than letters and numbers.",
  },
  {
    q: "Are Q-codes the same as Morse code?",
    a: "Q-codes are shorthand groups that can be sent in Morse, but each Q-code is made from normal letters rather than being a single Morse character.",
  },
  {
    q: "What is the difference between a code pattern and a word separator?",
    a: "A code pattern is the dots and dashes for a character or signal. A word separator is spacing between words, often written as / when Morse is typed out.",
  },
  {
    q: "Which page should I use for quick lookup?",
    a: "Use the dictionary when you need to search for one entry quickly. Use this page when you want the broader supported reference set in one place.",
  },
];

export default function InternationalMorseCodeReference() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "International Morse Code Reference",
        item: canonicalUrl(CANONICAL_PATH),
      },
    ],
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "International Morse Code Reference",
    url: canonicalUrl(CANONICAL_PATH),
    description:
      "A broad International Morse code reference covering letters, numbers, punctuation, prosigns, Q-codes, and timing context.",
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
          eyebrow="Reference hub"
          title="International Morse Code Reference"
          description="Use this as the broad MorseWords reference for the supported International Morse set: letters, numbers, punctuation, prosigns, Q-codes, timing context, and focused lookup pages."
          aside={
            <DarkNote label="Source" value="ITU-R M.1677-1">
              International Morse is the base map for the translator, decoder,
              audio tools, practice pages, and printable worksheets.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/dictionary", label: "Dictionary", primary: true },
              { href: "/morse-code-alphabet", label: "Alphabet chart" },
              { href: "/morse-code-timing", label: "Timing guide" },
              { href: "/sources", label: "Sources" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Browse"
          title="Reference sections"
          description="Use these focused pages when you need one category instead of the full reference hub."
        >
          <SimpleGrid
            items={[
              { title: "Punctuation", text: "Period, comma, question mark, slash, hyphen, apostrophe, parentheses, and symbols.", href: "/morse-code-punctuation" },
              { title: "Prosigns", text: "Procedural signs like SOS, AR, SK, BT, KN, AS, HH, and CT.", href: "/morse-code-prosigns" },
              { title: "Q-codes", text: "Short radio-style codes like QTH, QSL, QSO, QRS, QRV, and QRZ.", href: "/morse-code-q-codes" },
              { title: "Timing", text: "Dot, dash, letter gap, word gap, WPM, PARIS, and Farnsworth notes.", href: "/morse-code-timing" },
            ]}
          />
        </SectionCard>

        <SectionCard eyebrow="Letters" title="A-Z Morse code letters">
          <ReferenceTable items={LETTERS} onPlay={(morse) => playMorsePattern(morse)} />
        </SectionCard>

        <SectionCard eyebrow="Digits" title="0-9 Morse code numbers">
          <ReferenceTable items={DIGITS} onPlay={(morse) => playMorsePattern(morse)} />
        </SectionCard>

        <SectionCard eyebrow="Symbols" title="Punctuation, prosigns, and Q-codes">
          <div className="space-y-6">
            <ReferenceTable items={PUNCTUATION.slice(0, 8)} onPlay={(morse) => playMorsePattern(morse)} />
            <ReferenceTable items={PROSIGNS.slice(0, 6)} onPlay={(morse) => playMorsePattern(morse)} />
            <ReferenceTable items={Q_CODES.slice(0, 6)} onPlay={(morse) => playMorsePattern(morse)} />
          </div>
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Reference guide",
            title: "How to use the international reference",
            description:
              "This page is the broad reference pillar. It is useful when you want the supported International Morse set and related timing context in one place.",
            items: [
              {
                title: "Who it is for",
                text: "Use this page when you need more than A-Z letters or a single lookup result, especially when comparing categories.",
              },
              {
                title: "What it covers",
                text: "The page covers letters, digits, punctuation, prosigns, Q-codes, focused reference pages, and timing resources.",
              },
              {
                title: "How to read it",
                text: "Start with the category you need, play patterns when helpful, then move to a focused page for deeper examples.",
              },
            ],
          }}
          examples={{
            title: "Worked reference examples",
            description:
              "These examples show how the broad reference differs from a simple alphabet chart or quick dictionary lookup.",
            items: [
              {
                title: "Letter reference",
                morse: ".-",
                children: (
                  <p>
                    A appears in the full reference, but the{" "}
                    <a
                      href="/morse-code-alphabet"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      alphabet page
                    </a>{" "}
                    is better when your goal is A-Z memorization.
                  </p>
                ),
              },
              {
                title: "Number reference",
                morse: ".....",
                children: (
                  <p>
                    The digit 5 is longer than most letters. Use the full set
                    when comparing digits against letters or punctuation.
                  </p>
                ),
              },
              {
                title: "Signal reference",
                morse: "...-.-",
                children: (
                  <p>
                    SK is a prosign sent as a continuous signal. Use the{" "}
                    <a
                      href="/morse-code-prosigns"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      prosigns page
                    </a>{" "}
                    when spacing rules matter.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common reference mistakes",
            description:
              "The full reference is broad, so the main risk is mixing different kinds of Morse entries.",
            items: [
              {
                title: "Treating all labels as characters",
                children: (
                  <p>
                    Letters and digits are characters. Q-codes and prosigns are
                    operating signals or shorthand built from Morse patterns.
                  </p>
                ),
              },
              {
                title: "Ignoring spacing context",
                children: (
                  <p>
                    A written pattern alone does not explain word spacing,
                    prosign continuity, or Farnsworth timing.
                  </p>
                ),
              },
              {
                title: "Using the broad page for quick search",
                children: (
                  <p>
                    If you already know the label you need, the dictionary is
                    faster because it filters across entries.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            title: "Which Morse reference should I use?",
            description:
              "The international reference is the broad table. Use focused pages when your task is narrower.",
            items: [
              {
                title: "International reference",
                text: "Use this page when you want the broad supported Morse set and links to timing/source context.",
                href: "/international-morse-code-reference",
                badge: "Full set",
              },
              {
                title: "Dictionary",
                text: "Use the dictionary when you need to search for one character, symbol, signal, or phrase quickly.",
                href: "/dictionary",
                badge: "Lookup",
              },
              {
                title: "Alphabet",
                text: "Use the alphabet page when you only want to learn the A-Z letter patterns.",
                href: "/morse-code-alphabet",
                badge: "A-Z",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after using the reference",
            description:
              "Move into a focused page when you know which part of the reference you need.",
            links: [
              { href: "/dictionary", label: "Search dictionary", primary: true },
              { href: "/morse-code-punctuation", label: "Punctuation" },
              { href: "/morse-code-prosigns", label: "Prosigns" },
              { href: "/morse-code-q-codes", label: "Q-codes" },
              { href: "/morse-code-timing", label: "Timing guide" },
              { href: "/farnsworth-timing", label: "Farnsworth timing" },
            ],
          }}
        />

        <FaqSectionGeneric
          title="International reference FAQ"
          items={faqItems}
        />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
