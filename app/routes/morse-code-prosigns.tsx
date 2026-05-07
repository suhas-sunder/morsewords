import type { Route } from "./+types/morse-code-prosigns";

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
import { PROSIGNS } from "~/client/data/morseLearning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-prosigns";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "Morse Code Prosigns | Procedural Signals and Operating Guide | MorseWords",
    description:
      "Learn common Morse code prosigns, what they mean, how they differ from normal letters, and when operators use them.",
    path: CANONICAL_PATH,
    keywords:
      "morse code prosigns, SOS prosign, AR prosign, SK morse, BT morse, Morse code operating signs",
  });
}

const faqItems = [
  {
    q: "What is a Morse code prosign?",
    a: "A prosign is a procedural Morse signal used to manage operating flow, such as starting traffic, ending a message, waiting, correcting an error, or closing a contact.",
  },
  {
    q: "Are prosigns sent with spaces between letters?",
    a: "No. A prosign may be written with letter labels, but the Morse is sent as one continuous signal without the normal gap between those letters.",
  },
  {
    q: "Are prosigns the same as abbreviations?",
    a: "No. Abbreviations and Q-codes are sent as normal letters. Prosigns are operating signals with special continuous spacing.",
  },
  {
    q: "How are prosigns different from Q-codes?",
    a: "Prosigns control message flow, while Q-codes are radio shorthand phrases such as QTH, QSL, QRS, and QRZ.",
  },
  {
    q: "Should beginners learn prosigns right away?",
    a: "Beginners can start with SOS and a few common signals, but letter and number recognition should usually come first.",
  },
];

export default function MorseCodeProsigns() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Prosigns",
        item: canonicalUrl(CANONICAL_PATH),
      },
    ],
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Prosigns",
    url: canonicalUrl(CANONICAL_PATH),
    description:
      "A focused reference for Morse code prosigns and procedural operating signals such as SOS, AR, SK, BT, KN, AS, HH, and CT.",
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
          eyebrow="Operating signals"
          title="Morse Code Prosigns"
          description="Learn procedural Morse signals used to control operating flow: distress, end of message, end of contact, wait, correction, break, and directed reply."
          aside={
            <DarkNote label="Spacing note" value="NO LETTER GAP">
              A prosign is sent run together. That is why SOS appears as
              ...---... when written as the continuous distress signal.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-sos", label: "Open SOS page", primary: true },
              { href: "/morse-code-audio-practice", label: "Practice by audio" },
              { href: "/practice", label: "Practice drills" },
              { href: "/morse-code-q-codes", label: "Q-codes" },
              { href: "/morse-code-punctuation", label: "Punctuation" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Lookup table"
          title="Common prosigns and operating signs"
          description="Use the play buttons to hear each signal, then send difficult ones into audio practice or worksheets."
        >
          <ReferenceTable
            items={PROSIGNS}
            onPlay={(morse) => playMorsePattern(morse)}
          />
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Operating guide",
            title: "How to read and use prosigns",
            description:
              "Use this page when the entry is a procedural signal, not a written punctuation mark or a three-letter radio abbreviation.",
            items: [
              {
                title: "Who it is for",
                text: "Use prosigns when you are learning how Morse operators start, pause, correct, end, or close message traffic.",
              },
              {
                title: "What it includes",
                text: "The chart covers common procedural signs in the MorseWords reference set, including SOS, AR, SK, BT, KN, AS, HH, and CT.",
              },
              {
                title: "How to apply it",
                text: "Read the label as a name for the signal, but listen for the continuous Morse pattern without normal letter spacing.",
              },
            ],
          }}
          examples={{
            title: "Worked prosign examples",
            description:
              "These examples show the operating role of each signal instead of treating the label as an ordinary word.",
            items: [
              {
                title: "SOS distress signal",
                morse: "...---...",
                children: (
                  <p>
                    SOS is sent as one continuous distress signal. For a focused
                    explanation, use the{" "}
                    <a
                      href="/morse-code-sos"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      SOS Morse code page
                    </a>
                    .
                  </p>
                ),
              },
              {
                title: "AR and SK endings",
                morse: ".-.-. / ...-.-",
                children: (
                  <p>
                    AR marks the end of a message, while SK marks the end of a
                    contact. Both are operating-flow signals, not punctuation.
                  </p>
                ),
              },
              {
                title: "AS and HH control signals",
                morse: ".-... / ........",
                children: (
                  <p>
                    AS asks the other station to wait. HH is an error
                    correction signal used before sending the corrected copy.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common prosign mistakes",
            description:
              "The biggest prosign mistakes come from adding letter spacing or mixing procedure with abbreviations.",
            items: [
              {
                title: "Adding normal letter gaps",
                children: (
                  <p>
                    AR is written with two letters, but it is sent continuously
                    as .-.-. rather than as A followed by R.
                  </p>
                ),
              },
              {
                title: "Calling every shorthand a prosign",
                children: (
                  <p>
                    QTH, QSL, and QRZ are Q-codes. They are sent as ordinary
                    letters with their own radio shorthand meanings.
                  </p>
                ),
              },
              {
                title: "Using prosigns as sentence punctuation",
                children: (
                  <p>
                    Prosigns manage operating flow. For written symbols like
                    period, slash, and question mark, use punctuation.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            title: "Prosigns vs punctuation vs Q-codes",
            description:
              "Use prosigns for operating flow, punctuation for written marks, and Q-codes for radio shorthand meanings.",
            items: [
              {
                title: "Prosigns",
                text: "Use prosigns when you need procedural signals for starting, pausing, correcting, ending, or closing traffic.",
                href: "/morse-code-prosigns",
                badge: "Procedure",
              },
              {
                title: "Punctuation",
                text: "Use punctuation for normal written symbols inside translated text.",
                href: "/morse-code-punctuation",
                badge: "Symbols",
              },
              {
                title: "Q-codes",
                text: "Use Q-codes for radio shorthand phrases sent as normal letter groups.",
                href: "/morse-code-q-codes",
                badge: "Radio",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after reviewing prosigns",
            description:
              "Practice the sound of continuous signals, then compare them with normal letter groups so the spacing difference is clear.",
            links: [
              { href: "/morse-code-audio-practice", label: "Audio practice", primary: true },
              { href: "/practice", label: "Practice drills" },
              { href: "/morse-code-sos", label: "SOS page" },
              { href: "/morse-code-q-codes", label: "Q-codes" },
              { href: "/international-morse-code-reference", label: "Full reference" },
            ],
          }}
        />

        <FaqSectionGeneric
          title="Morse prosigns FAQ"
          items={faqItems}
        />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
