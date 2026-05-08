import type { Route } from "./+types/learn-morse-code";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = "/learn-morse-code";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Learn Morse Code | Beginner Guide and Practice Path | MorseWords",
    description:
      "Learn Morse code with a clear beginner path, examples, common mistakes, and links to alphabet, audio, typing, and practice tools.",
    path: CANONICAL_PATH,
    keywords:
      "learn morse code, morse code beginner guide, morse code practice path, learn morse alphabet, morse code lessons",
  });
}

const faqItems = [
  {
    q: "What should I learn first in Morse code?",
    a: "Start with the simplest letter patterns, especially E as a dot and T as a dash, then build toward the full A-Z alphabet before adding numbers and punctuation.",
  },
  {
    q: "Should I learn Morse by sight or sound?",
    a: "Use visual charts to understand the map, but add sound early if you want real copy skills. Audio practice teaches the rhythm of whole characters instead of only the written marks.",
  },
  {
    q: "How long does it take to learn Morse code?",
    a: "The alphabet can become familiar quickly, but useful recognition takes repeated short practice. Ten focused minutes most days is better than rare long sessions.",
  },
  {
    q: "Should beginners memorize the full alphabet at once?",
    a: "No. Learn a small set, practice recall, then add more letters. Moving too fast usually creates avoidable confusion between similar patterns.",
  },
  {
    q: "Which MorseWords tool should I use after this page?",
    a: "Open the alphabet chart for A-Z review, then use the practice page for recall. When visual recognition feels stable, move into audio practice and typing drills.",
  },
];

export default function LearnMorseCode() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn Morse Code",
        item: CANONICAL_URL,
      },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Learn Morse Code",
    url: CANONICAL_URL,
    description:
      "Beginner learning guide for moving from Morse letters to practice, audio recognition, typing, and timing basics.",
    educationalLevel: "Beginner",
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
          eyebrow="Learning path"
          title="Learn Morse Code"
          description="A beginner path from simple letters to real practice. Use this guide when you want the learning sequence, not a timed workout schedule or a timing-rule reference."
          aside={
            <DarkNote label="Start small" value="E  T  A  N">
              Learn a small set, recall it without looking, then add the next
              group. The goal is steady recognition, not memorizing every table
              in one pass.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-alphabet", label: "Open alphabet", primary: true },
              { href: "/practice", label: "Start practice" },
              { href: "/morse-code-practice-plan", label: "Practice plan" },
              { href: "/morse-code-timing", label: "Timing basics" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Study order"
          title="A practical beginner sequence"
          description="MorseWords is a toolkit, but beginners still need order. Move from recognition to recall, then from written patterns to sound."
        >
          <SimpleGrid
            items={[
              {
                title: "1. Learn letter patterns",
                text: "Use the alphabet page to connect A-Z letters with their Morse patterns before mixing in numbers or punctuation.",
                href: "/morse-code-alphabet",
                badge: "A-Z",
              },
              {
                title: "2. Practice recall",
                text: "Use short drills so you can recognize characters without translating each dot and dash manually.",
                href: "/practice",
                badge: "Drills",
              },
              {
                title: "3. Add words",
                text: "Move into short words once individual letters feel familiar. This makes Morse feel like chunks instead of isolated marks.",
                href: "/morse-code-word-trainer",
                badge: "Words",
              },
              {
                title: "4. Listen early",
                text: "Use audio practice to learn the sound of whole characters. Listening too late can make Morse feel like a visual-only puzzle.",
                href: "/morse-code-audio-practice",
                badge: "Audio",
              },
              {
                title: "5. Type and copy",
                text: "Typing practice and sentence practice help you turn recognition into usable response speed.",
                href: "/typing",
                badge: "Recall",
              },
              {
                title: "6. Review weak spots",
                text: "Use worksheets, word trainer sessions, and quizzes to focus on the letters or words that still slow you down.",
                href: "/morse-code-printable-chart",
                badge: "Review",
              },
            ]}
          />
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Learning guide",
            title: "How to use this learning path",
            description:
              "Use this page for the overall sequence. Use the practice plan when you want a schedule, and use timing pages when speed or spacing is the question.",
            items: [
              {
                title: "Who it is for",
                text: "Beginners who need a starting order, learners returning after a break, and teachers planning a first Morse lesson.",
              },
              {
                title: "What it helps you do",
                text: "Choose what to learn first, when to add sound, and how to move from charts into practice.",
              },
              {
                title: "How to apply it",
                text: "Pick one small set of characters, practice recall, add audio, then review weak spots before adding more.",
              },
            ],
          }}
          examples={{
            title: "Worked beginner examples",
            description:
              "These examples show how to move from easy patterns into practical practice.",
            items: [
              {
                title: "Start with E and T",
                morse: "E = .     T = -",
                children: (
                  <p>
                    E and T are the shortest patterns. They make a useful first
                    pair because they teach the difference between a dot and a
                    dash without extra complexity.
                  </p>
                ),
              },
              {
                title: "Build short pairs",
                morse: "A = .-     N = -.",
                children: (
                  <p>
                    A and N are mirrored two-symbol letters. Pairing them helps
                    you notice order, not just the number of marks.
                  </p>
                ),
              },
              {
                title: "Move into practice",
                morse: "S = ...     O = ---",
                children: (
                  <p>
                    Once S and O are familiar, try{" "}
                    <a
                      href="/morse-code-sos"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      SOS
                    </a>{" "}
                    and then move into short practice prompts.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common beginner mistakes",
            description:
              "Most beginner problems come from rushing the sequence or avoiding audio for too long.",
            items: [
              {
                title: "Memorizing too much",
                children: (
                  <p>
                    A full chart is useful, but practice works better in small
                    sets. Add new letters only after the current set is stable.
                  </p>
                ),
              },
              {
                title: "Counting forever",
                children: (
                  <p>
                    Morse should become a pattern you recognize. If you count
                    every mark, slow down and repeat shorter prompts.
                  </p>
                ),
              },
              {
                title: "Skipping sound",
                children: (
                  <p>
                    If you want listening skill, add{" "}
                    <a
                      href="/morse-code-audio-practice"
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      audio practice
                    </a>{" "}
                    while the visual chart is still fresh.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a guide",
            title: "Learning guide vs practice plan vs timing pages",
            description:
              "These pages answer related but different questions.",
            items: [
              {
                title: "Learn Morse Code",
                text: "Use this page for the broad beginner path from alphabet to practice.",
                href: "/learn-morse-code",
                badge: "Path",
              },
              {
                title: "Practice plan",
                text: "Use the practice plan when you want a session routine or weekly progression.",
                href: "/morse-code-practice-plan",
                badge: "Routine",
              },
              {
                title: "Timing pages",
                text: "Use timing guides when speed, spacing, WPM, or Farnsworth settings are confusing.",
                href: "/morse-code-timing",
                badge: "Timing",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after this guide",
            description:
              "Move from reading about Morse into one short practice action.",
            links: [
              { href: "/morse-code-alphabet", label: "Review the alphabet", primary: true },
              { href: "/practice", label: "Start drills" },
              { href: "/typing", label: "Try typing practice" },
              { href: "/audio", label: "Hear a message" },
            ],
          }}
        />

        <FaqSectionGeneric title="Learn Morse Code FAQ" items={faqItems} />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Learn Morse Code" />
    </div>
  );
}
