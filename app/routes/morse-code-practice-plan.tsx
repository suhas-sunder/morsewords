import type { Route } from "./+types/morse-code-practice-plan";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-practice-plan";

const faqItems = [
  {
    q: "How long should each session be?",
    a: "Start with 10 minutes. If your accuracy stays strong, add another short block for audio or sentences.",
  },
  {
    q: "When should I use worksheets?",
    a: "Use worksheets after practice sessions to review weak words, classroom lists, or sentence patterns away from the screen.",
  },
  {
    q: "Should I practice visually or by audio?",
    a: "Use both. Visual practice helps you understand written Morse, while audio practice builds the rhythm needed for real copy.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Practice Plan | 2-Week and 6-Week Routines",
    description:
      "Follow a structured Morse code routine using alphabet review, drills, word training, audio copy, sentence practice, typing, quizzes, and worksheets.",
    path: CANONICAL_PATH,
    keywords:
      "morse code practice plan, learn morse code schedule, morse code drills, morse code audio practice",
  });
}

function PlanList({
  title,
  items,
}: {
  title: string;
  items: Array<{ week: string; task: string; href: string }>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-2xl font-extrabold text-sky-950">{title}</h3>
      <ol className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.week} className="grid gap-2 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[120px_1fr]">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {item.week}
            </span>
            <a href={item.href} className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline">
              {item.task}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function MorseCodePracticePlan() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Morse Code Practice Plan",
    url: canonicalUrl(CANONICAL_PATH),
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

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Practice routine"
          title="Morse code practice plan"
          description="Use this plan to turn MorseWords from a set of tools into a repeatable routine. Pick the short plan for a focused reset or the longer plan for steadier progress."
          aside={
            <DarkNote label="Best habit" value="10 MINUTES">
              Short daily sessions beat rare marathon sessions. Review weak
              symbols, then end with one small success.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/practice", label: "Start practice", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/morse-code-printable-chart", label: "Print review" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Two paths"
          title="Choose a 2-week reset or 6-week build"
          description="Both plans reuse the same pages, but the 6-week path gives more room for listening and sentence work."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <PlanList
              title="2-week reset"
              items={[
                { week: "Days 1-2", task: "Review alphabet and digits", href: "/morse-code-alphabet" },
                { week: "Days 3-5", task: "Run quick recognition drills", href: "/practice" },
                { week: "Days 6-8", task: "Practice common words", href: "/morse-code-word-trainer" },
                { week: "Days 9-11", task: "Copy short audio prompts", href: "/morse-code-audio-practice" },
                { week: "Days 12-14", task: "Test sentences and print weak-word sheets", href: "/morse-code-sentence-practice" },
              ]}
            />
            <PlanList
              title="6-week build"
              items={[
                { week: "Week 1", task: "Alphabet, numbers, and spacing rules", href: "/morse-code-timing" },
                { week: "Week 2", task: "Daily practice drills with weak-symbol review", href: "/practice" },
                { week: "Week 3", task: "Word trainer and printable word sheets", href: "/morse-code-word-trainer" },
                { week: "Week 4", task: "Audio practice with Farnsworth spacing", href: "/farnsworth-timing" },
                { week: "Week 5", task: "Sentence practice and typing recall", href: "/morse-code-sentence-practice" },
                { week: "Week 6", task: "Audio quiz, visual quiz, and review worksheets", href: "/morse-code-audio-quiz" },
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Practice strategy"
          title="How to use this Morse code practice plan"
          description="A good practice plan should match how people actually learn Morse: short sessions, clear spacing, frequent recall, and enough listening work to make the symbols feel like sound instead of memorized marks."
          aside={
            <DarkNote label="Routine" value="LISTEN + RECALL">
              Start each session with one review block, then finish with a
              small test or worksheet so weak symbols do not disappear.
            </DarkNote>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p>
                This routine is built for adults, students, radio learners,
                puzzle makers, and teachers in English-speaking audiences who
                want practical progress without turning Morse into a full-time
                course. Use the{" "}
                <a
                  href="/practice"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  quick practice drills
                </a>{" "}
                for symbol recall, then move into the{" "}
                <a
                  href="/morse-code-word-trainer"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  word trainer
                </a>{" "}
                so letters become useful chunks.
              </p>
              <p>
                For listening practice, start with a comfortable character
                speed and slower spacing. The{" "}
                <a
                  href="/farnsworth-timing"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  Farnsworth timing guide
                </a>{" "}
                explains why slowing gaps can help without ruining the shape of
                each character, while the{" "}
                <a
                  href="/morse-code-timing"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  Morse timing guide
                </a>{" "}
                covers dots, dashes, letter gaps, word gaps, and WPM.
              </p>
              <p>
                Once a list feels familiar, switch to{" "}
                <a
                  href="/morse-code-audio-practice"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  audio practice
                </a>{" "}
                or the{" "}
                <a
                  href="/morse-code-audio-quiz"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  audio quiz
                </a>
                . End the week by printing review with the{" "}
                <a
                  href="/morse-code-printable-chart"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  worksheet builder
                </a>{" "}
                or by using{" "}
                <a
                  href="/morse-code-sentence-practice"
                  className="font-semibold text-sky-900 underline hover:no-underline"
                >
                  sentence practice
                </a>{" "}
                to copy longer phrases.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-xl font-extrabold text-sky-950">
                Weekly rhythm
              </h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-700">
                <li>
                  <strong className="text-sky-950">Review:</strong> 2 minutes
                  of weak letters, numbers, or words.
                </li>
                <li>
                  <strong className="text-sky-950">Recall:</strong> 5 minutes
                  with practice drills or the word trainer.
                </li>
                <li>
                  <strong className="text-sky-950">Listen:</strong> 3 minutes
                  of audio practice with Farnsworth spacing.
                </li>
                <li>
                  <strong className="text-sky-950">Prove it:</strong> one quiz,
                  worksheet, or sentence set at the end of the block.
                </li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <FaqSectionGeneric
          title="Practice plan FAQ"
          items={faqItems}
        />

        <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
      </main>
    </div>
  );
}
