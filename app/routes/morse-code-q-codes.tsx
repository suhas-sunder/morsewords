import type { Route } from "./+types/morse-code-q-codes";

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
import { Q_CODES } from "~/client/data/morseLearning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/morse-code-q-codes";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title:
      "Morse Code Q-Codes | Radio Shorthand Reference and Examples | MorseWords",
    description:
      "Review Morse code Q-codes used in radio communication, with examples, common mistakes, and links to practice and reference tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code q codes, qth meaning, qsl meaning, qso morse, qrs morse, qrz morse",
  });
}

const faqItems = [
  {
    q: "Are Q-codes part of Morse code?",
    a: "Q-codes are radio shorthand groups that can be sent in Morse, but their meaning comes from operating convention rather than from a special single-character Morse pattern.",
  },
  {
    q: "Do Q-codes have special dot-dash patterns?",
    a: "No. A Q-code is sent as ordinary letters. For example, QTH is sent as Q, T, and H with normal character spacing.",
  },
  {
    q: "What is the difference between CQ and Q-codes?",
    a: "CQ is a general calling signal. Q-codes are three-letter shorthand groups such as QTH, QSL, QRS, and QRZ.",
  },
  {
    q: "Should beginners memorize Q-codes?",
    a: "Beginners can recognize a few common Q-codes, but letters, numbers, timing, and basic listening practice are usually higher priority.",
  },
  {
    q: "How are Q-codes different from prosigns?",
    a: "Q-codes are sent as normal letters and carry shorthand meanings. Prosigns are procedural signals sent as continuous Morse patterns.",
  },
];

export default function MorseCodeQCodes() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Q-Codes",
        item: canonicalUrl(CANONICAL_PATH),
      },
    ],
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Q-Codes",
    url: canonicalUrl(CANONICAL_PATH),
    description:
      "A focused reference for common Q-code shorthand groups used in radio and Morse practice, including QTH, QRS, QSL, QSO, QRV, and QRZ.",
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
          eyebrow="Radio shorthand"
          title="Morse Code Q-Codes"
          description="Review common Q-code shorthand used in radio and Morse communication. Each code is sent as normal letters, while the meaning comes from operating convention."
          aside={
            <DarkNote label="Example" value="QRS?">
              As a question, QRS? means "shall I send more slowly?" As a
              request, PSE QRS means "please send more slowly."
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-word-trainer", label: "Train Q-codes", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/practice", label: "Practice drills" },
              { href: "/morse-code-prosigns", label: "Prosigns" },
              { href: "/morse-code-punctuation", label: "Punctuation" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Lookup table"
          title="Common Q-codes used in Morse practice"
          description="These examples focus on codes learners are likely to see in practice copy, radio examples, and Morse shorthand pages."
        >
          <ReferenceTable
            items={Q_CODES}
            onPlay={(morse) => playMorsePattern(morse)}
          />
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Radio shorthand guide",
            title: "How to read Q-codes in Morse",
            description:
              "Use this page when the entry is a radio shorthand group, not a punctuation mark or a continuous procedural signal.",
            items: [
              {
                title: "Who it is for",
                text: "Use Q-codes when you are reading radio-style practice copy or learning short operating phrases.",
              },
              {
                title: "What it includes",
                text: "The chart covers common Q-code entries in the MorseWords reference set, including QTH, QRS, QSL, QSO, QRV, and QRZ.",
              },
              {
                title: "How to apply it",
                text: "Send the code as ordinary letters, then read the shorthand meaning from the operating context.",
              },
            ],
          }}
          examples={{
            title: "Worked Q-code examples",
            description:
              "These examples show the difference between a Morse pattern and the shorthand meaning attached to the letters.",
            items: [
              {
                title: "QTH location",
                morse: "--.-   -   ....",
                children: (
                  <p>
                    QTH can ask for or state a location. The Morse pattern is
                    simply Q, T, and H sent as letters.
                  </p>
                ),
              },
              {
                title: "QSL acknowledgement",
                morse: "--.-   ...   .-..",
                children: (
                  <p>
                    QSL is used for acknowledgement. The meaning comes from
                    radio shorthand, not from a special symbol pattern.
                  </p>
                ),
              },
              {
                title: "QRS speed request",
                morse: "--.-   .-.   ...",
                children: (
                  <p>
                    QRS asks for slower sending. Use{" "}
                    <a
                      href="/morse-code-audio-practice"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      audio practice
                    </a>{" "}
                    when you want to hear speed changes.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common Q-code mistakes",
            description:
              "Q-codes are easy to misread when the shorthand meaning gets confused with Morse character mapping.",
            items: [
              {
                title: "Looking for one special pattern",
                children: (
                  <p>
                    QTH is not a single Morse character. It is sent as Q, T, and
                    H with normal spacing between letters.
                  </p>
                ),
              },
              {
                title: "Mixing CQ with Q-codes",
                children: (
                  <p>
                    CQ is a general calling signal. Q-codes are shorthand groups
                    that start with Q and usually have three letters.
                  </p>
                ),
              },
              {
                title: "Treating Q-codes like prosigns",
                children: (
                  <p>
                    Q-codes keep normal letter spacing. Prosigns are continuous
                    operating signals and follow different spacing rules.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            title: "Q-codes vs prosigns vs punctuation",
            description:
              "Use Q-codes for shorthand meanings, prosigns for procedural flow, and punctuation for written symbols.",
            items: [
              {
                title: "Q-codes",
                text: "Use Q-codes when you want radio shorthand meanings sent as ordinary letters.",
                href: "/morse-code-q-codes",
                badge: "Radio",
              },
              {
                title: "Prosigns",
                text: "Use prosigns for continuous procedural signals such as SOS, AR, SK, AS, or HH.",
                href: "/morse-code-prosigns",
                badge: "Procedure",
              },
              {
                title: "Punctuation",
                text: "Use punctuation for written symbols inside translated text, such as ?, /, comma, period, or @.",
                href: "/morse-code-punctuation",
                badge: "Symbols",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after reviewing Q-codes",
            description:
              "Practice common Q-code groups as sound and recall, then compare them with prosigns so the spacing difference stays clear.",
            links: [
              { href: "/morse-code-word-trainer", label: "Train Q-codes", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/practice", label: "Practice drills" },
              { href: "/morse-code-prosigns", label: "Prosigns" },
              { href: "/international-morse-code-reference", label: "Full reference" },
            ],
          }}
        />

        <FaqSectionGeneric
          title="Morse Q-codes FAQ"
          items={faqItems}
        />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code Q-Codes" />
    </div>
  );
}
