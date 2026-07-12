import type { Route } from "./+types/sources";

import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  UtilityContentPanel,
  UtilityPageHeader,
  UtilityPageShell,
} from "~/client/components/shared/UtilityPageLayout";
import {
  MORSEWORDS_SUPPORT_EMAIL,
  MORSEWORDS_SUPPORT_EMAIL_HREF,
} from "~/client/data/siteTrust";
import { canonicalUrl, seoMeta } from "~/client/seo";

const CANONICAL_PATH = "/sources";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "Sources", item: CANONICAL_URL },
  ],
};

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Sources and Public Domain Notes | MorseWords",
    description:
      "Learn how MorseWords treats public-domain book texts, source links, Project Gutenberg material, and source or copyright concerns.",
    path: CANONICAL_PATH,
  });
}

export default function SourcesRoute() {
  return (
    <>
      <UtilityPageShell>
        <UtilityPageHeader
          eyebrow="Sources"
          title="Sources and public domain notes"
        >
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            MorseWords includes source-based reference content and public-domain
            book texts for Morse reading, listening, and learning workflows.
            This page explains the current source approach at a high level.
          </p>
        </UtilityPageHeader>

        <UtilityContentPanel>
          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Public-domain book texts
          </h2>
          <p>
            MorseWords selects book texts and related source material from
            public-domain collections or other sources that are permitted for
            the intended reading, listening, print, and MP3 practice workflows.
          </p>
          <p>
            Project Gutenberg and other public-domain or source-based
            collections may be used. Entries are reviewed before inclusion, and
            source links are provided on book or reference pages where they are
            available.
          </p>
          <p>
            Some public-domain texts may be lightly edited for formatting,
            readability, or content safety. Source links are provided where
            available, and correction or takedown concerns can be reported.
          </p>
          <p>
            MorseWords includes historical public-domain texts. Some may
            include period language, mature themes, or content that is not
            appropriate for every classroom or younger reader. We review and
            sanitize selected wording for content safety, but older works may
            still need reader discretion.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Source metadata
          </h2>
          <p>
            Metadata and source details are corrected when better information
            is found. A source link or source note is meant to help users
            inspect the material; it is not a guarantee that a text is
            available for every use in every jurisdiction.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Morse reference content
          </h2>
          <p>
            MorseWords also includes reference pages for International Morse
            code patterns, spacing, timing, punctuation, prosigns, Q-codes, and
            related learning guidance. Tool output is practical guidance and
            should be checked against the relevant reference page when accuracy
            matters.
          </p>
          <p>
            The International Morse mapping used by the core tools is checked
            against{" "}
            <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/en" className="font-semibold text-sky-900 underline-offset-4 hover:underline">
              ITU-R Recommendation M.1677-1
            </a>
            . MorseWords is not an
            official standards organization; written slash notation and some
            training conventions are identified as conventions rather than
            standards rules.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            How MorseWords applies sources
          </h2>
          <p>
            International Morse mappings, supported punctuation, and the 1–3–7
            timing model are implemented through shared Morse utilities.
            Farnsworth is a training option that lengthens gaps without changing
            the dot-and-dash shape of a character. A slash is readable written
            notation for a word break, not an extra sound in timed Morse.
          </p>
          <p>
            Generated Morse, audio, video, and printables are MorseWords
            software outputs. They do not change the original authorship of a
            source work. Unsupported characters and ambiguous unspaced Morse
            are kept visible rather than silently guessed.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Copyright or source concerns
          </h2>
          <p>
            If you believe a source note is incomplete, a public-domain
            source status should be reviewed, a book/source page needs a better
            attribution link, or a takedown request should be considered,
            email{" "}
            <a
              href={MORSEWORDS_SUPPORT_EMAIL_HREF}
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              {MORSEWORDS_SUPPORT_EMAIL}
            </a>{" "}
            with the page URL and a short explanation.
          </p>
          </section>
        </UtilityContentPanel>
      </UtilityPageShell>
      <BreadcrumbTrail current="Sources" placement="pageBottom" />
      <JsonLdScript jsonLd={breadcrumbJsonLd} />
    </>
  );
}
