import type { Route } from "./+types/contact";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/contact";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);
const CONTACT_EMAIL = "admin@morsewords.com";
const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

const faqItems = [
  {
    q: "How can I contact MorseWords?",
    a: `Use ${CONTACT_EMAIL} for MorseWords feedback, bug reports, Morse correction requests, or practical learning suggestions.`,
  },
  {
    q: "What should I include in a Morse correction request?",
    a: "Include the page URL, the text or Morse pattern you checked, and what you expected to see.",
  },
  {
    q: "Can I request a new MorseWords feature?",
    a: "Yes. Feature ideas are useful when they describe the tool, classroom need, or learning problem you are trying to solve.",
  },
  {
    q: "Does MorseWords offer emergency communication support?",
    a: "No. MorseWords is a learning and utility site, not an emergency service or official communications channel.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Contact MorseWords | Feedback, Corrections, and Questions",
    description:
      "Contact MorseWords with bug reports, Morse correction requests, feature ideas, classroom feedback, or questions about the site's Morse tools.",
    path: CANONICAL_PATH,
    keywords:
      "contact MorseWords, MorseWords feedback, Morse code correction request, MorseWords support",
  });
}

export default function ContactRoute() {
  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact MorseWords",
    url: CANONICAL_URL,
    description:
      "Contact page for MorseWords feedback, correction requests, bug reports, and learning suggestions.",
    email: CONTACT_EMAIL,
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact MorseWords",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Contact"
          title="Contact MorseWords"
          description="Send MorseWords feedback, correction requests, bug reports, feature ideas, or classroom learning notes using the public contact path already used by the site."
        >
          <ActionLinks
            links={[
              { href: CONTACT_EMAIL_HREF, label: "Email MorseWords", primary: true },
              { href: "/about", label: "About" },
              { href: "/sources", label: "Sources" },
              { href: "/misc/socials", label: "Social links" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Contact method"
          title="Use the public MorseWords email"
          description="MorseWords does not publish a phone number, address, or response-time promise. Use the existing email contact when the issue needs a human review."
          layout="stacked"
        >
          <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              Email{" "}
              <a
                href={CONTACT_EMAIL_HREF}
                className="cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              with the page URL and a short description of what you found.
            </p>
            <p>
              For reference issues, include the text you entered, the Morse
              pattern you expected, and whether the issue happened in the
              translator, audio tool, decoder, reference page, or practice flow.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Useful requests"
          title="What to send"
          description="Clear context makes feedback easier to check without guessing what page or tool was involved."
        >
          <SimpleGrid
            linkedItemStyle="inline"
            items={[
              {
                title: "Bug reports",
                text: "Send the page URL, browser or device, and the steps that produced the issue.",
              },
              {
                title: "Morse corrections",
                text: "Send the character, phrase, or punctuation mark, plus the Morse pattern you believe should be checked.",
              },
              {
                title: "Feature requests",
                text: "Describe the learning or classroom job the feature would help with, not just the button name.",
              },
              {
                title: "Classroom feedback",
                text: "Share which tools or printable pages worked well for learners and what got in the way.",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Before emailing"
          title="Pages that may answer the question faster"
          description="If you only need to check a code, symbol, or spacing rule, these pages may solve it immediately."
        >
          <SimpleGrid
            items={[
              {
                title: "Translator",
                text: "Convert text to Morse or decode Morse back to text.",
                href: "/",
                badge: "Tool",
              },
              {
                title: "Audio",
                text: "Hear a text or Morse message as rhythm before reporting a sound issue.",
                href: "/audio",
                badge: "Listen",
              },
              {
                title: "Practice",
                text: "Check whether a learning issue belongs in drill, typing, or audio practice.",
                href: "/practice",
                badge: "Drill",
              },
              {
                title: "Alphabet",
                text: "Verify A-Z letter patterns before sending a correction request.",
                href: "/morse-code-alphabet",
                badge: "A-Z",
              },
              {
                title: "Punctuation",
                text: "Check supported punctuation marks before reporting a symbol issue.",
                href: "/morse-code-punctuation",
                badge: "Symbols",
              },
              {
                title: "Sources",
                text: "Review the reference approach used for MorseWords pages.",
                href: "/sources",
                badge: "Trust",
              },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric
          title="Contact MorseWords FAQ"
          items={faqItems}
          variant="home"
        />
        <JsonLdScript jsonLd={[contactPageJsonLd, breadcrumbJsonLd, faqJsonLd]} />
      </main>
      <BreadcrumbTrail current="Contact MorseWords" />
    </div>
  );
}
