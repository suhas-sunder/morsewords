import type { Route } from "./+types/sources";

import FaqSectionGeneric, {
  type FaqItem,
} from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import { SOURCE_LINKS } from "~/client/data/morseLearning";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/sources";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const sourcesFaqItems: FaqItem[] = [
  {
    q: "What does the MorseWords sources page cover?",
    a: "It explains the references and editorial approach behind MorseWords code tables, timing pages, spacing notes, and learning guidance.",
  },
  {
    q: "Is MorseWords an official standards source?",
    a: "No. MorseWords points to standards and reference material, but the site itself is an educational tool and reference layer, not an official standards body.",
  },
  {
    q: "Why can timing guidance vary between pages or tools?",
    a: "Dot, dash, and gap ratios are standard, but practice settings such as speed, effective WPM, tone, and Farnsworth spacing can change how a learner experiences the signal.",
  },
  {
    q: "Does tool output prove a Morse pattern is correct?",
    a: "Tool output is useful for checking a message, but unusual punctuation, prosigns, Q-codes, and spacing conventions should be cross-checked against the relevant reference page.",
  },
  {
    q: "What should I do if I find a mistake?",
    a: "Check the related reference page first, then use the about page or site contact paths to report the issue with the page URL and the pattern in question.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "MorseWords Sources | Morse Code References and Site Notes",
    description:
      "Review how MorseWords treats Morse code reference information, learning guidance, tool output, and source-backed content across the site.",
    path: CANONICAL_PATH,
    keywords:
      "MorseWords sources, Morse code references, International Morse code reference, Morse code timing sources, Morse code standards notes",
  });
}

export default function SourcesPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MorseWords Sources",
    url: CANONICAL_URL,
    inLanguage: "en",
    description:
      "Source notes for MorseWords reference data, timing explanations, spacing guidance, and learning content.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL + "/" },
    about: [
      "International Morse code",
      "Morse code timing",
      "Farnsworth timing",
      "Morse code spacing",
      "Morse code learning guidance",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sources",
        item: CANONICAL_URL,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sourcesFaqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <JsonLdScript jsonLd={[collectionJsonLd, breadcrumbJsonLd, faqJsonLd]} />
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Sources"
          title="MorseWords sources"
          description="This page explains how MorseWords treats Morse reference information, learning guidance, tool output, and source-backed notes across the site."
        >
          <ActionLinks
            links={[
              {
                href: "/international-morse-code-reference",
                label: "International reference",
                primary: true,
              },
              { href: "/morse-code-timing", label: "Timing guide" },
              { href: "/about", label: "About MorseWords" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Scope"
          title="What this sources page is for"
          description="Sources help users understand where reference guidance comes from and where a tool result should be treated as a practical output rather than an official ruling."
        >
          <SimpleGrid
            items={[
              {
                title: "Reference data",
                text: "Letters, numbers, punctuation, prosigns, and related signal pages are based on International Morse reference conventions.",
                href: "/international-morse-code-reference",
              },
              {
                title: "Timing guidance",
                text: "Timing pages explain dot units, dash length, letter gaps, word gaps, WPM, PARIS timing, and learner spacing.",
                href: "/morse-code-timing",
              },
              {
                title: "Learning guidance",
                text: "Learning pages translate reference rules into beginner-friendly practice steps and next-page recommendations.",
                href: "/learn-morse-code",
              },
              {
                title: "Tool behavior",
                text: "Tool output is designed to be consistent and useful, but unusual inputs should be checked against the matching reference page.",
                href: "/dictionary",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Primary references"
          title="Official and technical references"
          description="These source links anchor MorseWords reference and timing explanations. Page copy is written for learners, but the underlying reference pages should stay tied to stable sources."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {SOURCE_LINKS.map((source) => (
              <a
                key={source.href}
                href={source.href}
                className="mw-button-outline mw-light-interactive-link block cursor-pointer rounded-xl bg-[#fffdf8] p-5 no-underline hover:bg-[#fffaf2] hover:text-sky-950"
                rel="noreferrer"
                target="_blank"
              >
                <h2 className="text-lg font-extrabold text-sky-950">
                  {source.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {source.description}
                </p>
                <span className="mt-4 inline-block text-sm font-extrabold text-sky-900">
                  Open source -&gt;
                </span>
              </a>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="How to read"
          title="Reference-backed content vs generated tool output"
          description="MorseWords combines fixed reference pages with live tools. Those two types of content are related, but they do different jobs."
        >
          <SimpleGrid
            items={[
              {
                title: "Reference pages define patterns",
                text: "Use alphabet, punctuation, prosign, Q-code, and international reference pages when you need to verify an entry.",
                href: "/morse-code-alphabet",
              },
              {
                title: "Tools apply those patterns",
                text: "Translators, audio tools, printable charts, and practice pages apply supported patterns to user-entered text or generated prompts.",
                href: "/",
              },
              {
                title: "Spacing affects results",
                text: "A correct dot-dash pattern can still decode poorly if letter gaps, word gaps, or slash separators are missing.",
                href: "/morse-code-word-separator",
              },
              {
                title: "Practice settings affect feel",
                text: "Speed, effective WPM, pitch, and Farnsworth spacing can change how a signal feels without changing the underlying code pattern.",
                href: "/farnsworth-timing",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Cross-check"
          title="When to verify a pattern"
          description="Most everyday text-to-Morse conversion is direct. Cross-check when you are working with conventions rather than ordinary letters."
        >
          <SimpleGrid
            items={[
              {
                title: "Punctuation",
                text: "Use the punctuation page for period, comma, question mark, slash, apostrophe, and other written symbols.",
                href: "/morse-code-punctuation",
              },
              {
                title: "Prosigns",
                text: "Use the prosigns page for procedural signals that control message flow rather than ordinary written punctuation.",
                href: "/morse-code-prosigns",
              },
              {
                title: "Q-codes",
                text: "Use the Q-code page for radio shorthand meanings; the Morse pattern comes from the letters, while the meaning comes from convention.",
                href: "/morse-code-q-codes",
              },
              {
                title: "Timing",
                text: "Use timing pages when a pattern is correct but the audio or spacing feels too fast, cramped, or hard to decode.",
                href: "/morse-code-timing",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Limits"
          title="What sources can and cannot prove"
          description="Good sources keep the reference pages honest, but they do not turn a learning tool into an official operating manual."
        >
          <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              MorseWords uses source-backed references for International Morse
              patterns and timing explanations, then adapts those references
              into practical learner guidance. That means the site can help you
              check a symbol, understand a spacing rule, or choose the next
              practice page.
            </p>
            <p>
              It does not claim official standards status, radio licensing
              authority, or emergency communication guidance. For formal
              operating requirements, use the relevant official organization or
              training material for your context.
            </p>
            <ActionLinks
              links={[
                { href: "/about", label: "About MorseWords" },
                {
                  href: "/international-morse-code-reference",
                  label: "Open full reference",
                },
                { href: "/morse-code-timing", label: "Open timing guide" },
              ]}
            />
          </div>
        </SectionCard>

        <FaqSectionGeneric
          title="Sources FAQ"
          description="Short answers about how MorseWords uses references and where tool output has limits."
          items={sourcesFaqItems}
        />
      </main>
    </div>
  );
}
