import type { Route } from "./+types/sources";

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
            MorseWords may include book texts and related source material that
            are believed to be public domain or otherwise permitted for the
            intended use. These texts can be used as longer Morse reading,
            listening, print, and MP3 practice sources.
          </p>
          <p>
            Project Gutenberg and other public-domain or source-based
            collections may be used. Source links are provided where available
            on book or reference pages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Source metadata
          </h2>
          <p>
            Source metadata may be incomplete for some items and can be
            improved over time. A source link or source note is meant to help
            users inspect the material; it is not a guarantee that a text is
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
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Copyright or source concerns
          </h2>
          <p>
            If you believe a source note is incomplete, a public-domain
            assumption should be reviewed, or a book/source page needs a better
            attribution link, email{" "}
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
  );
}
