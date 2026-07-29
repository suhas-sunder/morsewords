import type { Route } from "./+types/cookies";

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

const CANONICAL_PATH = "/cookies";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
    { "@type": "ListItem", position: 2, name: "Cookies", item: CANONICAL_URL },
  ],
};

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Cookie Policy | MorseWords",
    description:
      "Read the MorseWords Cookie Policy for notes about cookies, localStorage, saved settings, progress, analytics, and ads.",
    path: CANONICAL_PATH,
  });
}

export default function CookiePolicyRoute() {
  return (
    <>
      <UtilityPageShell>
        <UtilityPageHeader
          eyebrow="MorseWords cookies"
          title="Cookie Policy"
          updated="Last updated July 29, 2026"
        >
          <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            This page explains how MorseWords may use cookies, localStorage, and
            similar browser technologies. It does not add a cookie banner or
            consent workflow.
          </p>
        </UtilityPageHeader>

        <UtilityContentPanel>
          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Cookies and similar technologies
          </h2>
          <p>
            Cookies are small files stored by your browser. MorseWords may also
            use localStorage, sessionStorage, IndexedDB, or similar technologies
            that store data in your browser.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Preferences, settings, and progress
          </h2>
          <p>
            MorseWords may save preferences, audio settings, live preview
            settings, selected sections, practice progress, and other tool
            state in your browser so the app feels consistent when you return.
          </p>
          <p>
            Clearing browser storage may reset these preferences, settings, and
            progress.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Analytics and ads
          </h2>
          <p>
            MorseWords configures PostHog in always-cookieless mode for
            page-view analytics. PostHog does not create cookies, localStorage,
            sessionStorage, or IndexedDB entries on this site, and MorseWords
            does not show an analytics opt-in banner.
          </p>
          <p>
            Advertising services such as Google AdSense may use cookies or
            similar technologies to show ads, measure performance, or limit
            repeated ads. Those providers may process information under their
            own policies and consent requirements.
          </p>
          </section>

          <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Managing cookies
          </h2>
          <p>
            You can manage or block cookies through your browser settings.
            Browser settings also usually let you clear localStorage and other
            site data. Some MorseWords features may lose saved preferences or
            progress if storage is disabled or cleared.
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
      <BreadcrumbTrail current="Cookies" placement="pageBottom" />
      <JsonLdScript jsonLd={breadcrumbJsonLd} />
    </>
  );
}
