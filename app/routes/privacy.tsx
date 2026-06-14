import type { Route } from "./+types/privacy";

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
    <UtilityPageShell>
      <UtilityPageHeader
        eyebrow="MorseWords privacy"
        title="Privacy Policy"
        updated="Last updated June 14, 2026"
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
            practice Morse-related content depending on the tool. Tool input may
            be processed locally in your browser and may be held temporarily in
            browser memory or browser storage so the feature can work.
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
            If you email MorseWords, we may receive your email address and the
            information you choose to include in the message.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Browser storage, preferences, and progress
          </h2>
          <p>
            MorseWords may use cookies, localStorage, sessionStorage, IndexedDB,
            or similar browser storage for preferences, saved settings,
            playback/progress state, and tool behavior. Clearing browser storage
            may reset those preferences or progress.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-sky-950">
            Analytics, ads, and third-party services
          </h2>
          <p>
            MorseWords may use analytics to understand site usage and improve
            the tools. MorseWords may also show ads. Analytics and advertising
            providers may use cookies or similar technologies according to their
            own policies and settings.
          </p>
          <p>
            Third-party services may also be used for hosting, analytics, ads,
            security, and email/contact handling later. This policy does not
            replace the terms or privacy policies of those third parties.
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
  );
}
