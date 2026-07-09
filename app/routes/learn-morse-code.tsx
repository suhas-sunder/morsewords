import type { ReactNode } from "react";
import type { Route } from "./+types/learn-morse-code";

import {
  OptionalSquareAd,
} from "~/client/components/ads/AdSenseAds";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
  StaticTile,
} from "~/client/components/shared/MorseLearningLayout";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import { SOURCE_LINKS } from "~/client/data/morseLearning";

const CANONICAL_PATH = "/learn-morse-code";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Learn Morse Code | Beginner Guide and Practice Path | MorseWords",
    description:
      "Learn Morse code with a practical beginner guide to dits, dahs, timing, first characters, audio practice, and common mistakes.",
    path: CANONICAL_PATH,
    keywords:
      "learn morse code, morse code beginner guide, morse code practice path, learn morse alphabet, morse code lessons",
  });
}

const faqItems = [
  {
    q: "What is Morse code?",
    a: "Morse code is a system of short and long signals used to represent letters, numbers, punctuation, and operating signals. Modern learners usually study International Morse Code.",
  },
  {
    q: "What should I learn first in Morse code?",
    a: "Start with the simplest character sounds: E as a short signal, T as a long signal, then A, N, I, M, S, and O before moving into the full A-Z alphabet.",
  },
  {
    q: "Should I learn Morse by sight or sound?",
    a: "Use visual charts to understand the map, but add sound early. Listening helps you recognize whole character rhythms instead of counting printed marks.",
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
    q: "When should I use Farnsworth timing?",
    a: "Use Farnsworth timing when character sounds are clear but the message feels too crowded. It keeps the character rhythm crisp while widening the gaps between characters and words.",
  },
  {
    q: "Which MorseWords tool should I use after this page?",
    a: "Open the alphabet chart for A-Z review, then use audio practice or the word trainer so the letters become sounds and short groups.",
  },
];

const timingUnits = [
  {
    label: "Dot / dit",
    value: ".",
    units: 1,
    tone: "bg-slate-950",
    note: "The shortest signal.",
  },
  {
    label: "Dash / dah",
    value: "-",
    units: 3,
    tone: "bg-slate-950",
    note: "Three dot units long.",
  },
  {
    label: "Letter gap",
    value: "space",
    units: 3,
    tone: "bg-sky-800",
    note: "The pause between letters.",
  },
  {
    label: "Word gap",
    value: "/",
    units: 7,
    tone: "bg-sky-800",
    note: "The pause between words.",
  },
] as const;

const starterCharacters = [
  { letter: "E", morse: ".", reason: "One short signal." },
  { letter: "T", morse: "-", reason: "One long signal." },
  { letter: "A", morse: ".-", reason: "Short then long." },
  { letter: "N", morse: "-.", reason: "Long then short." },
  { letter: "I", morse: "..", reason: "Two short signals." },
  { letter: "M", morse: "--", reason: "Two long signals." },
  { letter: "S", morse: "...", reason: "Three short signals." },
  { letter: "O", morse: "---", reason: "Three long signals." },
] as const;

const firstSessionSteps = [
  {
    time: "3 min",
    focus: "Listen to E and T",
    action:
      "Play a short E, then a T. Say short and long if dit and dah still feel abstract.",
  },
  {
    time: "5 min",
    focus: "Add A and N",
    action:
      "Practice the mirror pair: A is short-long, N is long-short.",
  },
  {
    time: "5 min",
    focus: "Mix I and M",
    action:
      "Listen for the difference between two shorts and two longs without stopping to count every mark.",
  },
  {
    time: "5 min",
    focus: "Try short groups",
    action:
      "Use TEN, TEAM, ME, AN, and IN so the characters start to feel like usable words.",
  },
  {
    time: "2 min",
    focus: "Review mistakes",
    action:
      "Write down the pair that slowed you down. That pair becomes tomorrow's warm-up.",
  },
] as const;

const beginnerMistakes = [
  {
    title: "Counting every dot and dash",
    text: "Counting is useful for checking a chart, but it is slow during practice. Try to hear E, T, A, and N as whole shapes.",
  },
  {
    title: "Practicing too long",
    text: "Long sessions can turn accurate practice into tired guessing. Stop while the set is still clear and repeat tomorrow.",
  },
  {
    title: "Full sentences too early",
    text: "Sentences are useful later. Start with tiny groups so mistakes point to a specific character, not a whole paragraph.",
  },
  {
    title: "Ignoring spacing",
    text: "A correct character can still be hard to read if gaps are unclear. Use the timing guide when words run together.",
  },
  {
    title: "Only using visual charts",
    text: "Printed charts are good references, but Morse becomes more useful when you can recognize the sound without looking.",
  },
] as const;

const beginnerSourceTitles = new Set([
  "ARRL Learning Morse Code",
  "ARRL Tips for Learning Morse Code",
  "ARRL Morse timing standard",
  "ITU-R Recommendation M.1677-1",
]);

const beginnerSourceLinks = SOURCE_LINKS.filter((source) =>
  beginnerSourceTitles.has(source.title),
);

function InlineTextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="cursor-pointer font-semibold text-sky-900 underline underline-offset-4 hover:no-underline"
    >
      {children}
    </a>
  );
}

function TimingStrip() {
  return (
    <StaticTile className="mt-5">
      <p className="mw-heading text-lg font-extrabold text-sky-950">
        Basic timing units
      </p>
      <p className="mw-text-muted mt-2 text-sm leading-relaxed text-slate-700">
        Start with these ratios. The detailed timing guide covers WPM and
        Farnsworth spacing.
      </p>

      <div className="mt-5 grid gap-4" aria-label="Morse timing unit visual">
        {timingUnits.map((item) => (
          <div
            key={item.label}
            className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)_92px] sm:items-center"
          >
            <div>
              <p className="mw-heading font-bold text-sky-950">{item.label}</p>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {item.value}
              </p>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-[#fffdf8]">
              <div
                className={`h-full rounded-full ${item.tone}`}
                style={{ width: `${(item.units / 7) * 100}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              {item.units} unit{item.units === 1 ? "" : "s"}
            </p>
            <p className="mw-text-muted text-sm leading-relaxed text-slate-700 sm:col-start-2">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </StaticTile>
  );
}

function StarterMiniChart() {
  return (
    <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft grid grid-cols-[80px_110px_1fr] gap-3 bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        <span>Letter</span>
        <span>Morse</span>
        <span>Why first</span>
      </div>
      {starterCharacters.map((item) => (
        <div
          key={item.letter}
          className="grid grid-cols-[80px_110px_1fr] gap-3 px-4 py-4 even:bg-[#fffaf2]"
        >
          <span className="mw-heading text-xl font-extrabold text-sky-950">
            {item.letter}
          </span>
          <span className="font-mono text-lg font-bold tracking-[0.18em] text-slate-950">
            {item.morse}
          </span>
          <span className="mw-text-muted text-sm leading-relaxed text-slate-700">
            {item.reason}
          </span>
        </div>
      ))}
    </div>
  );
}

function FirstSessionPlan() {
  return (
    <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft hidden grid-cols-[100px_180px_1fr] gap-3 bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 sm:grid">
        <span>Time</span>
        <span>Focus</span>
        <span>What to do</span>
      </div>
      <div className="divide-y divide-transparent">
        {firstSessionSteps.map((step) => (
          <div
            key={step.focus}
            className="grid gap-2 px-4 py-4 even:bg-[#fffaf2] sm:grid-cols-[100px_180px_1fr] sm:gap-3"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {step.time}
            </p>
            <h3 className="mw-heading font-extrabold text-sky-950">
              {step.focus}
            </h3>
            <p className="mw-text-muted text-base leading-relaxed text-slate-700">
              {step.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      "Beginner guide for dits and dahs, starter characters, timing basics, audio-first practice, and next-step tools.",
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
          description="Morse code is a system of short and long signals used to represent letters, numbers, punctuation, and operating signals. Modern learners usually start with International Morse Code, then build recognition through short listening and recall practice."
          aside={
            <DarkNote label="Start small" value="DIT / DAH">
              A dit is the short signal. A dah is the long signal. Learn their
              sound first, then add a few letters at a time.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-practice", label: "Start with sound", primary: true },
              { href: "/morse-code-alphabet", label: "Open alphabet" },
              { href: "/morse-code-practice-plan", label: "Practice plan" },
              { href: "/morse-code-timing", label: "Timing basics" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="First concepts"
          title="What you actually need to learn first"
          description="Start with the sound and spacing of Morse before trying to memorize the whole chart."
        >
          <div className="mw-support-ad-grid">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]">
              <div className="mw-text-muted space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
                <p>
                  Morse code can look like punctuation on the page, but it is a
                  signal system. The written dot and dash are useful labels, but
                  the practice goal is to recognize the rhythm of a whole
                  character.
                </p>
                <p>
                  A dot is usually called a dit. A dash is usually called a dah.
                  The dash lasts longer, and the spaces matter because they tell
                  you when one character or word has ended.
                </p>
                <p>
                  Keep this page simple: learn the short and long sounds, learn a
                  few letters, then practice tiny groups. For the full rules about
                  dot length, dash length, WPM, and word spacing, use the{" "}
                  <InlineTextLink href="/morse-code-timing">
                    Morse code timing guide
                  </InlineTextLink>
                  .
                </p>
              </div>
              <TimingStrip />
            </div>

            <OptionalSquareAd className="mw-signal-learn-seo" />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Starter chart"
          title="Start with eight easy-to-compare characters"
          description="This is not the full alphabet. It is a small first set that makes short, long, mirrored, doubled, and tripled sounds easy to compare."
          layout="stacked"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(280px,0.55fr)] lg:items-start">
            <StarterMiniChart />
            <div className="mw-text-muted space-y-4 text-base leading-relaxed text-slate-700">
              <p>
                E and T teach the basic contrast. A and N teach order. I and M
                teach repeated sounds. S and O give you the first recognizable
                three-signal shapes, including the pieces used in{" "}
                <InlineTextLink href="/morse-code-sos">SOS</InlineTextLink>.
              </p>
              <p>
                When this set feels familiar, move to the{" "}
                <InlineTextLink href="/morse-code-alphabet">
                  full Morse code alphabet
                </InlineTextLink>{" "}
                or the broader{" "}
                <InlineTextLink href="/morse-code-chart">
                  Morse code chart
                </InlineTextLink>{" "}
                for numbers, punctuation, and spacing notes.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="First session"
          title="Your first 20-minute practice session"
          description="Keep the first session small enough that every mistake tells you something useful."
          layout="stacked"
        >
          <FirstSessionPlan />
          <p className="mw-text-muted mt-5 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            Use{" "}
            <InlineTextLink href="/morse-code-audio-practice">
              audio practice
            </InlineTextLink>{" "}
            for the listening parts. When you are ready to make short groups
            feel like words, move the same set into the{" "}
            <InlineTextLink href="/morse-code-word-trainer">
              word trainer
            </InlineTextLink>
            .
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Learning method"
          title="Listen first, read second"
          description="Printed dots and dashes help you check a pattern. Listening helps you recognize the pattern without translating it piece by piece."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <StaticTile>
              <h3 className="mw-heading text-xl font-extrabold text-sky-950">
                What charts do well
              </h3>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                A chart is good for checking a letter, comparing pairs, and
                seeing the whole system at once. Keep one nearby, especially
                when you are learning new characters.
              </p>
            </StaticTile>
            <StaticTile>
              <h3 className="mw-heading text-xl font-extrabold text-sky-950">
                What listening does better
              </h3>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Listening makes each character feel like a rhythm. That matters
                because real practice is about hearing the shape quickly, not
                stopping to count every mark on a page.
              </p>
            </StaticTile>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Use it well"
          title="Common beginner mistakes"
          description="Most early problems are not about talent. They come from practicing too much at once or practicing in only one mode."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {beginnerMistakes.map((mistake) => (
              <StaticTile key={mistake.title}>
                <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                  {mistake.title}
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {mistake.text}
                </p>
              </StaticTile>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Next level"
          title="When to use Farnsworth or a practice plan"
          description="Use these pages when the question moves from first characters into spacing, routine, or testing."
        >
          <SimpleGrid
            linkedItemStyle="inline"
            items={[
              {
                title: "Farnsworth timing",
                text: "Use this when the character sounds are clear but the gaps need to be wider. It keeps character shapes crisp while slowing the overall message pace.",
                href: "/farnsworth-timing",
                badge: "Spacing",
              },
              {
                title: "Practice plan",
                text: "Use this when you want a 10-minute or multi-week routine instead of deciding what to practice from scratch.",
                href: "/morse-code-practice-plan",
                badge: "Routine",
              },
              {
                title: "Timing guide",
                text: "Use this when dots, dashes, letter gaps, word gaps, or WPM are the confusing part.",
                href: "/morse-code-timing",
                badge: "Rules",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Try it here"
          title="Try it on this site"
          description="A beginner session works best when each tool has one job. Pick one next action instead of opening every page at once."
          layout="stacked"
        >
          <SimpleGrid
            items={[
              {
                title: "Encoder",
                text: "Turn a word like TEAM or SOS into Morse so you can check the written pattern before listening.",
                href: "/morse-code-encoder",
                badge: "Text to Morse",
              },
              {
                title: "Decoder",
                text: "Paste Morse back into text to check whether your spacing and copied characters are readable.",
                href: "/morse-code-decoder",
                badge: "Morse to text",
              },
              {
                title: "Audio practice",
                text: "Train the same starter set by sound with WPM and Farnsworth controls.",
                href: "/morse-code-audio-practice",
                badge: "Listen",
              },
              {
                title: "Morse code test",
                text: "Use the test hub after a few short sessions, when you want to check accuracy across practice modes.",
                href: "/morse-code-test",
                badge: "Check",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Sources"
          title="Sources and further reading"
          description="These references support the International Morse code, learning, and timing notes on this page."
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)]">
            <ul className="mw-text-muted grid gap-4 text-base leading-relaxed text-slate-700">
              {beginnerSourceLinks.map((source) => (
                <li key={source.href} className="flex gap-3">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-800"
                    aria-hidden="true"
                  />
                  <span>
                    <a
                      href={source.href}
                      target="_blank"
                      rel="nofollow noreferrer noopener"
                      className="cursor-pointer font-semibold text-sky-900 underline underline-offset-4 hover:no-underline"
                    >
                      {source.title}
                    </a>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                      {source.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <StaticTile>
              <h3 className="mw-heading text-lg font-extrabold text-sky-950">
                Source policy
              </h3>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                For source corrections, attribution concerns, or public-domain
                notes, see the{" "}
                <InlineTextLink href="/sources">sources page</InlineTextLink>{" "}
                and include the page URL when reporting an issue.
              </p>
            </StaticTile>
          </div>
        </SectionCard>

        <FaqSectionGeneric title="Learn Morse Code FAQ" items={faqItems} />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Learn Morse Code" />
    </div>
  );
}
