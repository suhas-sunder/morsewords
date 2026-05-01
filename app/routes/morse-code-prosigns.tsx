import type { Route } from "./+types/morse-code-prosigns";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  ReferenceTable,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
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
    title: "Morse Code Prosigns with Meanings and Audio | MorseWords",
    description:
      "Look up common Morse code prosigns like SOS, AR, SK, BT, KN, AS, HH, and CT with meanings, examples, and play buttons.",
    path: CANONICAL_PATH,
    keywords:
      "morse code prosigns, SOS prosign, AR prosign, SK morse, BT morse, Morse code operating signs",
  });
}

export default function MorseCodeProsigns() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Prosigns",
    url: canonicalUrl(CANONICAL_PATH),
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Reference"
          title="Morse code prosigns"
          description="Prosigns are procedural Morse signals sent as a continuous pattern. They are not ordinary words with normal letter spacing, so they deserve their own lookup page."
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
              { href: "/morse-code-worksheet-generator", label: "Make worksheet" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Lookup table"
          title="Common prosigns and operating signs"
          description="Use the play buttons to hear each signal, then send difficult ones into audio practice or worksheets."
        >
          <ReferenceTable items={PROSIGNS} onPlay={(morse) => playMorsePattern(morse)} />
        </SectionCard>

        <SectionCard
          eyebrow="How to read them"
          title="Why prosigns are different from abbreviations"
          description="Abbreviations like QTH or QSL are sent as normal letters. Prosigns are procedural signals where the letters are written as a label, but the Morse is sent without normal character spacing."
        >
          <div className="max-w-[74ch] space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              For example, AR is often written as two letters, but the signal is
              sent as .-.-. with no letter gap between A and R. That continuous
              sound marks the end of a message.
            </p>
            <p>
              If you are practicing for puzzles or classroom use, the exact
              labels matter less than the rule: when a signal is a prosign, send
              the marks continuously.
            </p>
          </div>
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

