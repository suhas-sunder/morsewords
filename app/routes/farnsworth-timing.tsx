import type { Route } from "./+types/farnsworth-timing";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/farnsworth-timing";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Farnsworth Timing | Character Speed vs Effective WPM | MorseWords",
    description:
      "Learn how Farnsworth timing separates character speed from effective speed and why wider spacing can help Morse learners.",
    path: CANONICAL_PATH,
    keywords:
      "Farnsworth timing, Morse code Farnsworth, character speed, effective WPM, Morse audio practice",
  });
}

const faqItems = [
  {
    q: "What is Farnsworth timing?",
    a: "Farnsworth timing sends each character at a set character speed, then adds extra spacing between characters and words to lower the effective message speed.",
  },
  {
    q: "Is Farnsworth timing easier for beginners?",
    a: "It can be. Learners hear realistic character shapes while the wider gaps give more time to recognize each character.",
  },
  {
    q: "What is the difference between character speed and effective speed?",
    a: "Character speed controls the internal rhythm of each letter. Effective speed describes how fast the full message feels after extra spacing is added.",
  },
  {
    q: "When should I stop using Farnsworth spacing?",
    a: "Reduce the extra spacing gradually when recognition improves. Keep the character speed stable while raising the effective speed.",
  },
  {
    q: "Does Farnsworth change the actual dot-dash pattern?",
    a: "No. The dots, dashes, and character patterns stay the same. Farnsworth changes only the gaps between characters and words.",
  },
];

export default function FarnsworthTiming() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Farnsworth Timing",
        item: CANONICAL_URL,
      },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    name: "Farnsworth Timing",
    url: CANONICAL_URL,
    description:
      "Guide to Farnsworth timing, character speed, effective speed, widened spacing, and learner audio practice.",
    about: ["Farnsworth timing", "Morse code", "character speed", "effective WPM"],
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
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
  const jsonLd = [breadcrumbJsonLd, articleJsonLd, faqJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Listening practice"
          title="Farnsworth Timing"
          description="Learn why Morse learners often keep character speed crisp while widening the spaces between characters and words. Use this page when effective speed and character speed are the confusing part."
          aside={
            <DarkNote label="Example setup" value="18 / 12 WPM">
              Characters can sound like 18 WPM while the full message feels
              closer to 12 WPM because the gaps are longer.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/audio", label: "Open audio generator", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/morse-code-timing", label: "Standard timing" },
            ]}
          />
        </PageHero>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Farnsworth guide",
            title: "How Farnsworth timing helps learners",
            description:
              "Use Farnsworth timing when you want realistic character sounds without forcing the full message to arrive too quickly.",
            items: [
              {
                title: "Who it is for",
                text: "Learners practicing by ear, especially when characters sound recognizable but the full message still feels too fast.",
              },
              {
                title: "What it changes",
                text: "Farnsworth widens the spaces between characters and words. It does not change the dot-dash pattern inside each character.",
              },
              {
                title: "How to apply it",
                text: "Choose a character speed that sounds clean, lower the effective speed for wider gaps, then tighten the gaps over time.",
              },
            ],
          }}
          examples={{
            title: "Worked Farnsworth examples",
            description:
              "These scenarios show why character speed and effective speed are separate settings.",
            items: [
              {
                title: "Fast characters, slower spacing",
                morse: "18 WPM chars / 12 WPM effective",
                children: (
                  <p>
                    Each character keeps a crisp rhythm, but the longer gaps
                    give you more time before the next character arrives.
                  </p>
                ),
              },
              {
                title: "Effective WPM",
                morse: "Message feels slower",
                children: (
                  <p>
                    Effective speed describes the whole message pace after the
                    extra gaps are included.
                  </p>
                ),
              },
              {
                title: "Reducing spacing",
                morse: "12 -> 15 -> 18 WPM effective",
                children: (
                  <p>
                    As recognition improves, raise the effective speed first.
                    Keep character speed stable so the sounds stay familiar.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common Farnsworth mistakes",
            description:
              "Farnsworth is useful when applied deliberately. It becomes confusing when speed settings are mixed up.",
            items: [
              {
                title: "Slowing characters too much",
                children: (
                  <p>
                    If characters become too slow, you may start counting dits
                    and dahs instead of hearing the pattern as one sound.
                  </p>
                ),
              },
              {
                title: "Never tightening gaps",
                children: (
                  <p>
                    Extra spacing is a bridge. Reduce it gradually as copy gets
                    more comfortable.
                  </p>
                ),
              },
              {
                title: "Confusing it with standard timing",
                children: (
                  <p>
                    Use the{" "}
                    <a
                      href="/morse-code-timing"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      standard timing page
                    </a>{" "}
                    for dot, dash, and gap ratios before adding Farnsworth.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a timing page",
            title: "Farnsworth vs standard timing",
            description:
              "Both pages discuss spacing, but they answer different questions.",
            items: [
              {
                title: "Farnsworth timing",
                text: "Use this page when character speed and effective speed are intentionally different.",
                href: "/farnsworth-timing",
                badge: "Learner",
              },
              {
                title: "Morse Code Timing",
                text: "Use the standard timing page for dot, dash, letter gap, word gap, and WPM ratios.",
                href: "/morse-code-timing",
                badge: "Standard",
              },
              {
                title: "Audio practice",
                text: "Use audio practice when you want answer checking with listening settings.",
                href: "/morse-code-audio-practice",
                badge: "Practice",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after Farnsworth",
            description:
              "Test the concept with a short message and adjust only one setting at a time.",
            links: [
              { href: "/audio", label: "Try audio settings", primary: true },
              { href: "/morse-code-audio-practice", label: "Practice by ear" },
              { href: "/learn-morse-code", label: "Learning path" },
              { href: "/morse-code-practice-plan", label: "Practice routine" },
            ],
          }}
        />

        <FaqSectionGeneric title="Farnsworth FAQ" items={faqItems} />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Farnsworth Timing" />
    </div>
  );
}
