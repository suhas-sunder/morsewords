import type { Route } from "./+types/morse-code-punctuation";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  ReferenceTable,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
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
    title: "Morse Code Punctuation Chart | Symbols, Slash & Question Mark",
    description:
      "Find Morse code punctuation for period, comma, question mark, slash, hyphen, apostrophe, parentheses, colon, semicolon, and common symbols.",
    path: CANONICAL_PATH,
    keywords:
      "morse code punctuation, period in morse code, comma morse code, question mark morse, slash morse code, hyphen morse",
  });
}

export default function MorseCodePunctuation() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Punctuation",
    url: canonicalUrl(CANONICAL_PATH),
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Symbol lookup"
          title="Morse code punctuation and symbols"
          description="Find the Morse patterns for common punctuation marks and symbols, then play them, copy them into the translator, or use them in worksheet examples."
          aside={
            <DarkNote label="Common search" value="..--..">
              The question mark is one of the most-searched punctuation marks
              because it appears in puzzles, Q-code examples, and copied text.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-encoder", label: "Encode text", primary: true },
              { href: "/morse-code-decoder", label: "Decode Morse" },
              { href: "/morse-code-word-separator", label: "Spacing guide" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Lookup table"
          title="Morse punctuation chart"
          description="MorseWords supports these punctuation marks in the translator, audio generator, and worksheet tools."
        >
          <ReferenceTable items={PUNCTUATION} onPlay={(morse) => playMorsePattern(morse)} />
        </SectionCard>

        <SectionCard
          eyebrow="Formatting"
          title="Slash, spaces, and punctuation are not the same thing"
          description="A slash can be encoded as punctuation, but MorseWords also accepts / as a word separator when decoding pasted Morse."
        >
          <p className="max-w-[74ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            If you type text that includes a slash, the encoder can convert that
            slash into its Morse punctuation pattern. If you paste Morse into the
            decoder, a slash is treated as a word break because that is a common
            written convention for separating Morse words. The{" "}
            <a
              href="/morse-code-word-separator"
              className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
            >
              word separator guide
            </a>{" "}
            explains that input behavior in more detail.
          </p>
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
