import type { Route } from "./+types/morse-code-timing";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/morse-code-timing";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Timing | Dots, Dashes, Spacing, and WPM | MorseWords",
    description:
      "Understand Morse code timing, including dot and dash length, letter gaps, word gaps, WPM, and common spacing mistakes.",
    path: CANONICAL_PATH,
    keywords:
      "morse code timing, morse code wpm, dot dash timing, morse code spacing, PARIS standard morse",
  });
}

const faqItems = [
  {
    q: "How long is a dash compared with a dot?",
    a: "A dash is three dot units. If the dot unit is 60 milliseconds, the dash is 180 milliseconds.",
  },
  {
    q: "How many spaces go between Morse letters?",
    a: "The standard letter gap is three dot units. MorseWords represents that gap with 3 spaces in copied Morse text.",
  },
  {
    q: "How many spaces go between Morse words?",
    a: "The standard word gap is seven dot units. MorseWords represents that gap with 7 spaces or, in some tools, a visible slash separator.",
  },
  {
    q: "Is timing the same as Farnsworth timing?",
    a: "No. This page explains standard timing ratios. Farnsworth timing keeps characters crisp while widening the gaps between characters and words for learners.",
  },
  {
    q: "Why does incorrect spacing make decoding fail?",
    a: "Morse decoders need boundaries. If the letter or word gaps are missing, the same dot-dash stream can be split into different possible characters.",
  },
];

export default function MorseCodeTiming() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Timing",
        item: CANONICAL_URL,
      },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    name: "Morse Code Timing",
    url: CANONICAL_URL,
    description:
      "Technical guide to Morse code timing units, dots, dashes, element gaps, letter gaps, word gaps, WPM, and spacing mistakes.",
    about: ["Morse code", "WPM", "PARIS standard", "letter gaps", "word gaps"],
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
          eyebrow="Timing reference"
          title="Morse Code Timing"
          description="Understand the standard Morse timing ratios behind dots, dashes, letter gaps, word gaps, and WPM. Use this page when spacing or speed is the problem."
          aside={
            <DarkNote label="Standard rhythm" value="1 : 3 : 7">
              A dot is 1 unit, a dash is 3 units, and a word gap is 7
              units. Speed changes the unit length, not the ratio.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/farnsworth-timing", label: "Farnsworth timing", primary: true },
              { href: "/morse-code-word-separator", label: "Spacing guide" },
              { href: "/audio", label: "Try audio timing" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Unit rules"
          title="The basic Morse timing ratios"
          description="International Morse timing uses fixed proportions. WPM changes how long one unit lasts, but these relationships stay the same."
        >
          <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
            {[
              ["Dot", "1 unit", "The shortest signal."],
              ["Dash", "3 units", "Three times as long as a dot."],
              ["Inside a character", "1 unit gap", "Gap between dots and dashes within one letter."],
              ["Between letters", "3 units", "Gap after a completed character."],
              ["Between words", "7 units", "Gap between words."],
            ].map(([name, units, note]) => (
              <div
                key={name}
                className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[180px_160px_1fr]"
              >
                <p className="font-extrabold text-sky-950">{name}</p>
                <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  {units}
                </p>
                <p className="text-base leading-relaxed text-slate-700">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Timing guide",
            title: "How to apply Morse timing",
            description:
              "Use standard timing when you need to understand speed, spacing, decoding errors, or audio settings.",
            items: [
              {
                title: "Who it is for",
                text: "Learners, teachers, and tool users who need to understand why Morse spacing and WPM change the result.",
              },
              {
                title: "What it helps you do",
                text: "Connect dots, dashes, letter gaps, word gaps, and WPM to the visible Morse text used across the site.",
              },
              {
                title: "How to use it",
                text: "Check the ratio table, then test the same message in the audio tools or word separator page.",
              },
            ],
          }}
          examples={{
            title: "Worked timing examples",
            description:
              "These examples show how the unit rules explain real output.",
            items: [
              {
                title: "Dot vs dash",
                morse: ". = 1 unit     - = 3 units",
                children: (
                  <p>
                    A dash lasts three times as long as a dot. The character
                    pattern changes if you shorten a dash into a dot-length
                    signal.
                  </p>
                ),
              },
              {
                title: "Letter and word gaps",
                morse: "A Z     .-   --..",
                children: (
                  <p>
                    A letter gap separates completed characters. A word gap is
                    longer, which is why copied Morse needs clear spacing.
                  </p>
                ),
              },
              {
                title: "WPM effect",
                morse: "10 WPM -> slower units",
                children: (
                  <p>
                    Higher WPM shortens every timing unit. It does not change
                    the dot-dash pattern, only how quickly the pattern is sent.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common timing mistakes",
            description:
              "Timing mistakes usually look like spacing or decoding mistakes once Morse is copied as text.",
            items: [
              {
                title: "Counting one space as a word",
                children: (
                  <p>
                    A letter gap and a word gap are different. Use the{" "}
                    <a
                      href="/morse-code-word-separator"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      word separator
                    </a>{" "}
                    if copied text collapses the gap.
                  </p>
                ),
              },
              {
                title: "Changing pitch for speed",
                children: (
                  <p>
                    Pitch changes the tone you hear. WPM changes how long each
                    timing unit lasts.
                  </p>
                ),
              },
              {
                title: "Using Farnsworth by accident",
                children: (
                  <p>
                    Farnsworth timing intentionally widens gaps. Use the{" "}
                    <a
                      href="/farnsworth-timing"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Farnsworth guide
                    </a>{" "}
                    when character speed and effective speed differ.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a timing page",
            title: "Timing vs Farnsworth timing",
            description:
              "Use the standard timing page for baseline rules and Farnsworth when learner spacing is intentional.",
            items: [
              {
                title: "Morse Code Timing",
                text: "Use this page for dot, dash, letter gap, word gap, and WPM rules.",
                href: "/morse-code-timing",
                badge: "Standard",
              },
              {
                title: "Farnsworth timing",
                text: "Use Farnsworth when characters stay fast but the spaces are widened for learning.",
                href: "/farnsworth-timing",
                badge: "Learner",
              },
              {
                title: "Word separator",
                text: "Use the separator page when timing gaps need to become clean copied text.",
                href: "/morse-code-word-separator",
                badge: "Spacing",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after timing",
            description:
              "Apply the timing rules in a tool where you can hear or clean up the result.",
            links: [
              { href: "/audio", label: "Try audio timing", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/morse-code-decoder", label: "Decode spaced Morse" },
              { href: "/farnsworth-timing", label: "Learn Farnsworth" },
            ],
          }}
        />

        <FaqSectionGeneric title="Timing FAQ" items={faqItems} />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code Timing" />
    </div>
  );
}
