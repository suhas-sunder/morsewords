import type { Route } from "./+types/contact";

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

const CANONICAL_PATH = "/contact";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "Contact", item: CANONICAL_URL },
  ],
};

const supportTopics = [
  "Bug reports with the page URL, browser or device, and steps to reproduce.",
  "Feature requests that explain the learning or tool workflow you need.",
  "Accessibility issues, including keyboard, screen reader, contrast, or motion concerns.",
  "Copyright, public-domain, or source concerns about book and reference material.",
  "General questions about MorseWords tools, practice pages, and public resources.",
] as const;

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Contact MorseWords | Support and Site Questions",
    description:
      "Contact MorseWords for bug reports, feature requests, accessibility issues, copyright or public-domain concerns, and general questions.",
    path: CANONICAL_PATH,
  });
}

export default function ContactRoute() {
  return (
    <>
      <UtilityPageShell>
        <UtilityPageHeader
          eyebrow="Contact"
          title="Contact MorseWords"
        >
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            MorseWords is the friendly way to learn and use Morse code. For
            support, corrections, and site questions, email{" "}
            <a
              href={MORSEWORDS_SUPPORT_EMAIL_HREF}
              className="font-semibold text-sky-900 underline-offset-4 hover:underline"
            >
              {MORSEWORDS_SUPPORT_EMAIL}
            </a>
            .
          </p>
        </UtilityPageHeader>

        <UtilityContentPanel>
          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-sky-950">
              Support email
            </h2>
            <p>
              Use{" "}
              <a
                href={MORSEWORDS_SUPPORT_EMAIL_HREF}
                className="font-semibold text-sky-900 underline-offset-4 hover:underline"
              >
                {MORSEWORDS_SUPPORT_EMAIL}
              </a>{" "}
              for messages that need a human review. MorseWords does not provide
              phone support, live chat, or an emergency communication service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold text-sky-950">
              What to send
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              {supportTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-extrabold text-sky-950">
              No contact form yet
            </h2>
            <p>
              This page is intentionally static. MorseWords has not added a
              contact form, email-sending integration, backend submission endpoint,
              account system, authentication, or database-backed support queue.
            </p>
          </section>
        </UtilityContentPanel>
      </UtilityPageShell>
      <BreadcrumbTrail current="Contact" placement="pageBottom" />
      <JsonLdScript jsonLd={breadcrumbJsonLd} />
    </>
  );
}
