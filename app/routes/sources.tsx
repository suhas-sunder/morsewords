import type { Route } from "./+types/sources";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import { SOURCE_LINKS } from "~/client/data/morseLearning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/sources";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Sources and Standards | MorseWords Morse Code References",
    description:
      "See the standards and references behind MorseWords code tables, timing, spacing, Farnsworth practice, audio behavior, and learning explanations.",
    path: CANONICAL_PATH,
    keywords:
      "morse code sources, ITU Morse code, ARRL Morse timing, MorseWords standards, International Morse code reference",
  });
}

export default function SourcesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sources and Standards",
    url: canonicalUrl(CANONICAL_PATH),
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Trust and standards"
          title="Sources and standards used by MorseWords"
          description="MorseWords keeps practical tools close to standards-backed Morse behavior. This page lists the references used for code tables, timing, spacing, training explanations, and editorial notes."
          aside={
            <DarkNote label="Editorial rule" value="TOOLS FIRST">
              Source pages should clarify the tool behavior. They should not
              bury simple conversion work under unnecessary history.
            </DarkNote>
          }
        />

        <SectionCard
          eyebrow="Primary references"
          title="Official and technical references"
          description="These links anchor the timing and reference pages. Page copy is written for learners and tool users, but the core rules stay tied to these sources."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {SOURCE_LINKS.map((source) => (
              <a
                key={source.href}
                href={source.href}
                className="mw-button-outline mw-light-interactive-link block rounded-xl bg-white p-5 no-underline hover:bg-[#fffaf2] hover:text-sky-950"
                rel="noreferrer"
                target="_blank"
              >
                <h2 className="text-lg font-extrabold text-sky-950">
                  {source.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {source.description}
                </p>
                <span className="mt-4 inline-block text-sm font-extrabold text-sky-900">
                  Open source -&gt;
                </span>
              </a>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Where used"
          title="How these references map to the site"
          description="The goal is consistency: the translator, audio tools, practice pages, worksheets, and reference pages should teach the same spacing and timing model."
        >
          <SimpleGrid
            items={[
              {
                title: "Code tables",
                text: "Alphabet, digit, punctuation, prosign, and reference pages use International Morse as the base map.",
                href: "/international-morse-code-reference",
              },
              {
                title: "Timing pages",
                text: "The timing guide uses the dot/dash/gap ratios and PARIS-style WPM explanation.",
                href: "/morse-code-timing",
              },
              {
                title: "Farnsworth practice",
                text: "The Farnsworth page explains why character speed and effective speed can be separated for learners.",
                href: "/farnsworth-timing",
              },
              {
                title: "Spacing behavior",
                text: "The separator page explains accepted input styles and MorseWords' default exported output.",
                href: "/morse-code-word-separator",
              },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
