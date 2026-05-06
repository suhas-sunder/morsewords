import type { Route } from "./+types/international-morse-code-reference";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  ReferenceTable,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
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
    title: "International Morse Code Reference | Complete MorseWords Guide",
    description:
      "Browse International Morse letters, numbers, punctuation, prosigns, Q-codes, timing notes, audio examples, and standards-backed reference links.",
    path: CANONICAL_PATH,
    keywords:
      "International Morse code reference, Morse code letters, Morse code numbers, Morse prosigns, Morse Q-codes",
  });
}

export default function InternationalMorseCodeReference() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "International Morse Code Reference",
    url: canonicalUrl(CANONICAL_PATH),
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Reference hub"
          title="International Morse code reference"
          description="A practical reference hub for letters, numbers, punctuation, prosigns, Q-codes, timing notes, and the standards pages behind the MorseWords tools."
          aside={
            <DarkNote label="Source" value="ITU-R M.1677-1">
              International Morse is the base map for the translator, decoder,
              audio tools, practice pages, and printable worksheets.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-alphabet", label: "Alphabet chart", primary: true },
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

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
