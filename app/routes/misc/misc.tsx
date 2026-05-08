import { Link, Outlet, useLocation } from "react-router";

import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta } from "~/client/seo";

const CANONICAL_PATH = "/misc";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "MorseWords Site Information",
    description:
      "Find MorseWords privacy, terms, cookies, and social/support information.",
    path: CANONICAL_PATH,
    robots: "noindex,follow",
  });
}

export default function Misc() {
  const location = useLocation();

  if (location.pathname !== CANONICAL_PATH) {
    return (
      <div className="mw-non-home-page min-h-screen bg-transparent">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="MorseWords support"
          title="Site information"
          description="Use these support pages for MorseWords policies, social links, and basic site information. This hub is available for users who land on the support section directly."
        >
          <ActionLinks
            links={[
              { href: "/misc/privacy-policy", label: "Privacy policy", primary: true },
              { href: "/misc/terms-of-service", label: "Terms" },
              { href: "/misc/cookies-policy", label: "Cookies" },
              { href: "/misc/socials", label: "Social links" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Support pages"
          title="Choose a site information page"
          description="These pages support trust and navigation, but they are not intended as search landing pages."
        >
          <SimpleGrid
            items={[
              {
                title: "Privacy policy",
                text: "Review how MorseWords handles local tool input, analytics, cookies, and related privacy notes.",
                href: "/misc/privacy-policy",
              },
              {
                title: "Terms of service",
                text: "Review the terms for using MorseWords tools, practice pages, references, and printable resources.",
                href: "/misc/terms-of-service",
              },
              {
                title: "Cookies policy",
                text: "See how cookies and similar technologies are used for essential behavior and privacy-conscious analytics.",
                href: "/misc/cookies-policy",
              },
              {
                title: "Social links",
                text: "Find MorseWords-related profile and follow links without making social content part of the indexed site surface.",
                href: "/misc/socials",
              },
            ]}
          />
        </SectionCard>

        <nav aria-label="Breadcrumb" className="mb-12 mt-10 text-sm text-slate-600">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                to="/"
                className="cursor-pointer underline hover:no-underline"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-sky-950">Site information</li>
          </ol>
        </nav>
      </main>
    </div>
  );
}
