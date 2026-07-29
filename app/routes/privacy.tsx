import type { Route } from "./+types/privacy";

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

const CANONICAL_PATH = "/privacy";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "Privacy", item: CANONICAL_URL },
  ],
};

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Privacy Policy | MorseWords",
    description:
      "Read the MorseWords Privacy Policy for plain-language notes about tool input, browser storage, preferences, analytics, ads, and third-party services.",
    path: CANONICAL_PATH,
  });
}

export default function PrivacyPolicyRoute() {
  return (
    <>
      <UtilityPageShell>
        <UtilityPageHeader
          eyebrow="MorseWords privacy"
          title="Privacy Policy"
          updated="Last updated July 29, 2026"
        >
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            MorseWords provides Morse code tools, book and audio tools, and
            learning/practice experiences. This policy describes the current app
            in plain language and may be updated as features change.
          </p>
        </UtilityPageHeader>

        <UtilityContentPanel>
          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            What MorseWords does
          </h2>
          <p>
            MorseWords lets users type, paste, upload, listen to, print, and
            practice Morse-related content depending on the tool. Tool input is
            processed in your browser where the tool supports a local workflow.
            Raw text, Morse, learner answers, worksheet text, imported files,
            filenames, and generated media are not sent to MorseWords analytics.
          </p>
          <p>
            MorseWords does not currently provide user accounts, login, or a
            user profile database.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Information you provide
          </h2>
          <p>
            You may enter Morse messages, plain text, book text, worksheet
            text, or practice answers into the tools. You are responsible for
            the text you choose to paste or upload.
          </p>
          <p>
            When you use the contact form, your name, email address, category,
            subject, and message are transmitted to the server only to deliver
            the message through Resend to the MorseWords support inbox. Contact
            messages are not sent to analytics.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Browser storage, preferences, and progress
          </h2>
          <p>
            MorseWords uses cookies and localStorage for display preferences,
            saved settings, selected source text where a tool offers local
            saving, book-cache data, and local playback/progress state. It does
            not currently use IndexedDB. Clearing site data in your browser can
            reset these local preferences and cached content.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Analytics, ads, and third-party services
          </h2>
          <p>
            MorseWords uses PostHog for cookieless page-view analytics.
            PostHog does not store cookies, localStorage, sessionStorage, or
            IndexedDB data on this site. Automatic interaction capture, session
            recording, surveys, feature flags, experiments, and person profiles
            are disabled. Page-view payloads use the route path only and exclude
            query strings, fragments, and text entered into MorseWords tools.
          </p>
          <p>
            MorseWords also uses Google AdSense for advertising. Advertising
            providers may set or receive cookies according to their own
            policies and consent requirements. MorseWords has no accounts,
            payments, or affiliate-link program.
          </p>
          <p>
            Current relevant third parties are hosting providers, PostHog,
            Google AdSense, Project Gutenberg for linked public-domain sources,
            and Resend for contact delivery. Their policies apply to their own
            services.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Your choices
          </h2>
          <p>
            You can avoid entering sensitive text into the tools. You can also
            manage cookies and browser storage through your browser settings.
            Some preferences or progress may stop working or reset if storage
            is blocked or cleared.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
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
      <BreadcrumbTrail current="Privacy" placement="pageBottom" />
      <JsonLdScript jsonLd={breadcrumbJsonLd} />
    </>
  );
}
