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
              { href: "/morse-code-worksheet-generator", label: "Print review" },
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

        <FaqSectionGeneric
          title="Practice plan FAQ"
          items={[
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
          ]}
        />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}
