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

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact MorseWords",
  url: CANONICAL_URL,
  inLanguage: "en",
  description:
    "Contact MorseWords for bug reports, feature requests, accessibility issues, source concerns, and general site questions.",
  isPartOf: {
    "@type": "WebSite",
    name: "MorseWords",
    url: canonicalUrl("/"),
  },
  about: {
    "@type": "WebApplication",
    name: "MorseWords",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    url: canonicalUrl("/"),
  },
  email: MORSEWORDS_SUPPORT_EMAIL,
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
              What happens next
            </h2>
            <p>
              Email is the clearest way to reach MorseWords right now. Messages
              are reviewed as time allows, so include enough detail to make the
              first reply useful.
            </p>
            <p>
              For bug reports, include the page URL, what you expected, what
              happened, and the browser or device you used. For source or
              public-domain concerns, include the book or reference page and the
              source note you want reviewed.
            </p>
          </section>
        </UtilityContentPanel>
      </UtilityPageShell>
      <BreadcrumbTrail current="Contact" placement="pageBottom" />
      <JsonLdScript jsonLd={[contactPageJsonLd, breadcrumbJsonLd]} />
    </>
  );
}
