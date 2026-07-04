import type { Route } from "./+types/terms";

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

const CANONICAL_PATH = "/terms";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "Terms", item: CANONICAL_URL },
  ],
};

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Terms of Use | MorseWords",
    description:
      "Read the MorseWords Terms of Use for basic rules about using the site's Morse tools, book/audio features, references, and learning pages.",
    path: CANONICAL_PATH,
  });
}

export default function TermsRoute() {
  return (
    <>
      <UtilityPageShell>
        <UtilityPageHeader
          eyebrow="MorseWords terms"
          title="Terms of Use"
          updated="Last updated June 14, 2026"
        >
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            These terms apply when you use MorseWords tools, learning pages,
            book/audio features, printable pages, and reference content.
          </p>
        </UtilityPageHeader>

        <UtilityContentPanel>
          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Educational and tooling purpose
          </h2>
          <p>
            MorseWords is intended as an educational and practical Morse code
            toolkit. It is not an official standards body, emergency
            communication service, certification provider, or legal authority.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Acceptable use
          </h2>
          <p>
            Use MorseWords lawfully and respectfully. Do not try to disrupt the
            service, misuse automated access, probe systems without permission,
            or use the tools in a way that harms others or violates applicable
            law.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Your text and uploads
          </h2>
          <p>
            You are responsible for the text, files, and other material you
            paste, type, or upload. Do not enter content you do not have the
            right to use, and avoid entering sensitive personal information if
            the tool does not require it.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Accuracy and public-domain limits
          </h2>
          <p>
            Morse translations, decoding, timing, audio, highlighting, and
            exported files are provided as helpful tool output. MorseWords does
            not guarantee every translation, source note, timing estimate, or
            audio result will be error-free.
          </p>
          <p>
            Book and source pages may include public-domain or otherwise
            permitted material. Source metadata can be incomplete, and public
            domain status can vary by jurisdiction. Review source links and
            use your own judgment for your intended use.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            No warranties
          </h2>
          <p>
            MorseWords is provided as is and as available. The site may change,
            break, be unavailable, or contain mistakes. We do not make promises
            that the service will always be available or fit every use case.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Limitation of liability
          </h2>
          <p>
            To the extent allowed by law, MorseWords and its operators are not
            responsible for indirect, incidental, special, consequential, or
            punitive damages that may result from using or being unable to use
            the site.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">Contact</h2>
          <p>
            Concerns about these terms can be sent to{" "}
            <a
              href={MORSEWORDS_SUPPORT_EMAIL_HREF}
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              {MORSEWORDS_SUPPORT_EMAIL}
            </a>
            .
          </p>
          </section>
        </UtilityContentPanel>
      </UtilityPageShell>
      <BreadcrumbTrail current="Terms" placement="pageBottom" />
      <JsonLdScript jsonLd={breadcrumbJsonLd} />
    </>
  );
}
