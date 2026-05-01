import type { Route } from "./+types/learn-morse-code";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
} from "~/client/components/shared/MorseLearningLayout";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/learn-morse-code";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Learn Morse Code with Practice, Audio, and Worksheets | MorseWords",
    description:
      "Start learning Morse code with a practical path from alphabet recognition to words, sentences, audio copy, typing practice, and printable worksheets.",
    path: CANONICAL_PATH,
    keywords:
      "learn morse code, morse code practice plan, morse code lessons, morse code worksheets, morse code audio practice",
  });
}

export default function LearnMorseCode() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Learn Morse Code",
    url: canonicalUrl(CANONICAL_PATH),
    description:
      "A practical MorseWords learning hub connecting alphabet reference, practice drills, audio, typing, words, sentences, and worksheets.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Learning path"
          title="Learn Morse code with tools that work together"
          description="Start with characters, move into short words, then train sentences, typing, audio copy, and printable worksheets. The goal is simple: fewer disconnected pages, more useful repetition."
          aside={
            <DarkNote label="Progression" value="A-Z  0-9  WORDS">
              Use the translator when you need instant feedback, then move into
              practice when you are ready to recall patterns without looking.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/practice", label: "Start drills", primary: true },
              { href: "/morse-code-alphabet", label: "Open alphabet" },
              { href: "/morse-code-practice-plan", label: "View practice plan" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Study order"
          title="A practical Morse code progression"
          description="MorseWords is still a toolkit, not a locked course, but these steps give the existing pages a clear order."
        >
          <SimpleGrid
            items={[
              {
                title: "1. Learn the character shapes",
                text: "Use the alphabet and punctuation references to connect each letter, digit, and symbol with its Morse pattern.",
                href: "/morse-code-alphabet",
                badge: "Reference",
              },
              {
                title: "2. Practice recall",
                text: "Run quick drills until you can recognize common letters and numbers without translating them one mark at a time.",
                href: "/practice",
                badge: "Drills",
              },
              {
                title: "3. Move into words",
                text: "Train short words and radio terms so Morse starts feeling like useful chunks, not isolated letters.",
                href: "/morse-code-word-trainer",
                badge: "Words",
              },
              {
                title: "4. Copy by ear",
                text: "Use audio practice, Farnsworth spacing, and repeat loops when you want to hear the rhythm instead of reading dots and dashes.",
                href: "/morse-code-audio-practice",
                badge: "Audio",
              },
              {
                title: "5. Decode sentences",
                text: "Sentence practice adds spacing, punctuation, and longer context so you can test real copy instead of single prompts.",
                href: "/morse-code-sentence-practice",
                badge: "Sentences",
              },
              {
                title: "6. Print review sheets",
                text: "Turn weak words, classroom lists, and practice sets into printable worksheets with answer keys.",
                href: "/morse-code-worksheet-generator",
                badge: "Print",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Next tools"
          title="Use the page that matches the job"
          description="Each page below keeps the same spacing rules and conversion behavior, so you can move between tools without relearning the format."
        >
          <SimpleGrid
            items={[
              {
                title: "Timing and WPM",
                text: "Understand dot length, dash length, letter gaps, word gaps, and the PARIS speed standard.",
                href: "/morse-code-timing",
              },
              {
                title: "Farnsworth timing",
                text: "Learn why character speed and effective speed are separated for listening practice.",
                href: "/farnsworth-timing",
              },
              {
                title: "Visual practice",
                text: "Read flashing Morse signals from a bulb-style trainer instead of audio tones.",
                href: "/morse-code-visual-practice",
              },
              {
                title: "Worksheet generator",
                text: "Build learner handouts, answer keys, and printable classroom practice.",
                href: "/morse-code-worksheet-generator",
              },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric
          title="Learning FAQ"
          items={[
            {
              q: "What should I learn first?",
              a: "Start with the alphabet and digits, then practice short words. Once the symbols feel familiar, move into audio and sentences so you learn rhythm and spacing.",
            },
            {
              q: "Should I read dots and dashes or listen to sound?",
              a: "Both are useful, but listening matters if your goal is real Morse copy. Use visual references to understand the map, then use audio practice to learn the sound patterns.",
            },
            {
              q: "Do I need an account?",
              a: "No. MorseWords keeps the workflow browser-based and practical. Use the tools directly, then print or copy the material you need.",
            },
          ]}
        />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

