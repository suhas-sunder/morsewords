import type { ReactNode } from "react";
import type { Route } from "./+types/morse-code-practice-plan";

import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
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
import { SOURCE_LINKS } from "~/client/data/morseLearning";
import { ROUTES } from "~/client/data/routes";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = ROUTES.practicePlan;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const faqItems = [
  {
    q: "How long should a Morse code practice session be?",
    a: "A short, focused session is enough for a useful practice block. This plan uses 15 minutes because it gives room for review, new work, mixed copying, and mistake notes without making the session hard to repeat.",
  },
  {
    q: "Should I practice letters, words, or audio first?",
    a: "Start with character recognition, move into short groups and words, then add listening practice early. If a word keeps failing, use a smaller word-trainer round before testing again.",
  },
  {
    q: "When should I use Farnsworth timing?",
    a: "Use Farnsworth timing when the character sounds are recognizable but the next character arrives too soon. It keeps the character rhythm crisp while widening the gaps between characters and words.",
  },
  {
    q: "How do I know when to move on?",
    a: "Move on when you recognize the small set without counting marks, copy short groups with cleaner spacing, and recover after a missed character instead of restarting the whole prompt.",
  },
  {
    q: "Should I test every day?",
    a: "Use tests lightly. Practice should take most of the session; a short quiz or review task at the end is usually enough to show what tomorrow should target.",
  },
];

const weeklyPracticeRows = [
  {
    day: "Days 1-2",
    focus: "Character recognition",
    action:
      "Review a small character set by sound. Keep the set narrow enough that repeated mistakes are easy to spot.",
    href: ROUTES.audioPractice,
  },
  {
    day: "Days 3-4",
    focus: "Short groups and words",
    action:
      "Move known characters into tiny words or groups. Do not jump into long sentences before recognition is steady.",
    href: ROUTES.wordTrainer,
  },
  {
    day: "Day 5",
    focus: "Mixed review",
    action:
      "Mix old and new characters. Pull repeated misses into a short focused drill instead of repeating everything.",
    href: ROUTES.practice,
  },
  {
    day: "Day 6",
    focus: "Audio practice",
    action:
      "Listen with comfortable spacing. Use Farnsworth spacing if the characters sound clear but the gaps feel rushed.",
    href: ROUTES.audioPractice,
  },
  {
    day: "Day 7",
    focus: "Light test and review",
    action:
      "Run one short check, then write down the two or three items that should start the next week.",
    href: ROUTES.test,
  },
] as const;

const dailyRoutineRows = [
  {
    time: "3 min",
    focus: "Warm up with known characters",
    action:
      "Start with characters you already know so the session begins with clean recognition instead of guessing.",
  },
  {
    time: "5 min",
    focus: "Learn or review one small group",
    action:
      "Use a small set: one pair, one word list, or one repeated mistake pattern.",
  },
  {
    time: "5 min",
    focus: "Mixed listening or copying",
    action:
      "Add variation with audio practice, word training, or short groups. Keep the settings stable for the session.",
  },
  {
    time: "2 min",
    focus: "Note mistakes",
    action:
      "Write down the miss, not just the score. That note becomes the first drill tomorrow.",
  },
] as const;

const progressCriteria = [
  {
    title: "You recognize without counting",
    text: "The character arrives as a sound shape, not a dot-by-dot count.",
  },
  {
    title: "Mistakes repeat less often",
    text: "A weak character may still miss, but it no longer breaks every round.",
  },
  {
    title: "Short groups stay readable",
    text: "Two- and three-letter groups keep their spacing instead of turning into one run-on signal.",
  },
  {
    title: "You recover after a miss",
    text: "A missed character does not force you to abandon the whole prompt.",
  },
] as const;

const practiceMistakes = [
  {
    title: "Only reading charts",
    text: "Charts are useful references, but a practice plan needs listening time so characters become recognizable by rhythm.",
  },
  {
    title: "Practicing too long while tired",
    text: "Long sessions when you are tired can turn into guessing. Stop while the set is still clear and repeat the next day.",
  },
  {
    title: "Changing settings constantly",
    text: "If speed, spacing, pitch, and prompt type all change at once, it is hard to tell what improved.",
  },
  {
    title: "Ignoring spacing",
    text: "Correct symbols can still be hard to read when letter and word gaps are crowded.",
  },
  {
    title: "Testing more than practicing",
    text: "A quiz shows what happened. Practice is where the repeated misses get fixed.",
  },
  {
    title: "Full sentences too early",
    text: "Sentences are better after basic recognition is steady. Start with small groups first.",
  },
] as const;

const toolFlowItems = [
  {
    title: "Reference",
    text: "Use the alphabet or chart when you need to check a character before practicing it.",
    href: ROUTES.chart,
    badge: "Chart",
  },
  {
    title: "Listen",
    text: "Use audio practice for sound recognition with WPM and Farnsworth controls.",
    href: ROUTES.audioPractice,
    badge: "Audio",
  },
  {
    title: "Short words",
    text: "Use the word trainer when characters are familiar but words still break your flow.",
    href: ROUTES.wordTrainer,
    badge: "Words",
  },
  {
    title: "Longer prompts",
    text: "Use sentence practice after short groups feel readable and spacing is steadier.",
    href: ROUTES.sentencePractice,
    badge: "Sentences",
  },
  {
    title: "Check accuracy",
    text: "Use the test hub when you want a light check, then turn misses back into drills.",
    href: ROUTES.test,
    badge: "Test",
  },
] satisfies Array<{ title: string; text: string; href: string; badge: string }>;

const sourceTitles = new Set([
  "ARRL Learning Morse Code",
  "ARRL Tips for Learning Morse Code",
  "ARRL Morse timing standard",
  "ITU-R Recommendation M.1677-1",
]);

const practiceSourceLinks = [
  ...SOURCE_LINKS.filter((source) => sourceTitles.has(source.title)),
  {
    title: "ARRL W1AW Code Practice MP3 Files",
    href: "https://www.arrl.org/code-practice-files",
    description:
      "W1AW practice transmissions in MP3 format, useful as outside listening material once beginner copy is steadier.",
  },
] as const;

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Practice Plan | Daily Routine and Weekly Guide | MorseWords",
    description:
      "Use a practical Morse code practice plan for character recognition, spacing, short words, listening drills, and mistake review.",
    path: CANONICAL_PATH,
    keywords:
      "morse code practice plan, morse code routine, morse code drills, morse code audio practice",
  });
}

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

function WeeklyPracticeTable() {
  return (
    <div
      className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]"
      aria-label="Simple weekly Morse practice structure"
    >
      <div className="mw-static-surface-soft hidden grid-cols-[120px_220px_1fr] gap-4 bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:grid">
        <span>When</span>
        <span>Focus</span>
        <span>What to do</span>
      </div>
      {weeklyPracticeRows.map((row) => (
        <div
          key={row.day}
          className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[120px_220px_1fr] md:gap-4"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {row.day}
          </p>
          <h3 className="mw-heading text-lg font-extrabold text-sky-950">
            <a
              href={row.href}
              className="cursor-pointer text-sky-900 underline decoration-sky-900/40 underline-offset-4 hover:decoration-sky-950"
            >
              {row.focus}
            </a>
          </h3>
          <p className="mw-text-muted text-base leading-relaxed text-slate-700">
            {row.action}
          </p>
        </div>
      ))}
    </div>
  );
}

function DailyRoutineTable() {
  return (
    <div
      className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]"
      aria-label="Daily 15 minute Morse practice routine"
    >
      <div className="mw-static-surface-soft hidden grid-cols-[90px_230px_1fr] gap-4 bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:grid">
        <span>Time</span>
        <span>Block</span>
        <span>Practice note</span>
      </div>
      {dailyRoutineRows.map((row) => (
        <div
          key={row.focus}
          className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[90px_230px_1fr] md:gap-4"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {row.time}
          </p>
          <h3 className="mw-heading text-lg font-extrabold text-sky-950">
            {row.focus}
          </h3>
          <p className="mw-text-muted text-base leading-relaxed text-slate-700">
            {row.action}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function MorseCodePracticePlan() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Practice Plan",
        item: CANONICAL_URL,
      },
    ],
  };
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Morse Code Practice Plan",
    url: CANONICAL_URL,
    description:
      "A practical Morse code practice routine for recognition, spacing, short words, listening, and mistake review.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    step: [
      {
        "@type": "HowToStep",
        name: "Warm up with known characters",
        text: "Start with a few characters you already recognize so the session begins cleanly.",
      },
      {
        "@type": "HowToStep",
        name: "Review one small group",
        text: "Focus on one small character group, word list, or repeated mistake pattern.",
      },
      {
        "@type": "HowToStep",
        name: "Mix listening or copying",
        text: "Use audio practice, word training, or short groups without changing settings constantly.",
      },
      {
        "@type": "HowToStep",
        name: "Record the misses",
        text: "End by noting the misses that should start the next practice session.",
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
  const jsonLd = [breadcrumbJsonLd, howToJsonLd, faqJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Practice routine"
          title="Morse code practice plan"
          description="Use this page to build a repeatable Morse practice routine for sound recognition, cleaner spacing, and short-word copy. It gives you a useful next session without claiming a fixed timeline."
          aside={
            <DarkNote label="Best habit" value="SMALL + OFTEN">
              Short, consistent sessions are easier to repeat than occasional
              long sessions. Keep the target narrow enough that mistakes point
              to tomorrow's warm-up.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: ROUTES.audioPractice, label: "Start audio practice", primary: true },
              { href: ROUTES.wordTrainer, label: "Train short words" },
              { href: ROUTES.timing, label: "Check timing" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Practice goal"
          title="The goal of practice"
          description="A beginner is not training one skill. A useful routine separates recognition, spacing, and short copy so each session has a clear job."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <StaticTile>
              <h2 className="mw-heading text-xl font-extrabold text-sky-950">
                Recognize by sound
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Learn characters as sound shapes instead of counting every dot
                and dash. Use the{" "}
                <InlineTextLink href={ROUTES.learn}>learning guide</InlineTextLink>{" "}
                if the basics still feel new.
              </p>
            </StaticTile>
            <StaticTile>
              <h2 className="mw-heading text-xl font-extrabold text-sky-950">
                Keep spacing clean
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Letter and word gaps carry meaning. When copied Morse starts
                running together, review the{" "}
                <InlineTextLink href={ROUTES.timing}>timing guide</InlineTextLink>
                .
              </p>
            </StaticTile>
            <StaticTile>
              <h2 className="mw-heading text-xl font-extrabold text-sky-950">
                Copy short words
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Move from single characters into small groups so you do not
                pause after every symbol. Short words reveal weak letters
                quickly.
              </p>
            </StaticTile>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Weekly structure"
          title="A simple weekly practice structure"
          description="Use this as a flexible loop. Repeat any day that still feels shaky; the schedule is a way to organize practice, not a promise about speed."
          layout="stacked"
        >
          <WeeklyPracticeTable />
        </SectionCard>

        <SectionCard
          eyebrow="Daily routine"
          title="Daily 15-minute routine"
          description="A short routine works best when each block has one job and the settings stay stable enough for mistakes to be meaningful."
          layout="stacked"
        >
          <DailyRoutineTable />
          <p className="mw-text-muted mt-5 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            Use{" "}
            <InlineTextLink href={ROUTES.audioPractice}>
              Morse code audio practice
            </InlineTextLink>{" "}
            for the listening block and the{" "}
            <InlineTextLink href={ROUTES.wordTrainer}>
              Morse code word trainer
            </InlineTextLink>{" "}
            when the same short words or letter groups keep slowing you down.
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Methods"
          title="When to use Koch and Farnsworth"
          description="Both are useful learning ideas, but they solve different problems. Use one method at a time so you can tell what helped."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <StaticTile>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Character set
              </p>
              <h2 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
                Koch-style practice
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Add characters gradually instead of practicing the whole chart
                at once. If a new pair causes misses, keep the set small before
                adding more.
              </p>
            </StaticTile>
            <StaticTile>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Spacing
              </p>
              <h2 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
                Farnsworth spacing
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Keep the character rhythm recognizable while giving more room
                between letters and words. Use the{" "}
                <InlineTextLink href={ROUTES.farnsworth}>
                  Farnsworth timing guide
                </InlineTextLink>{" "}
                when character speed and message speed feel confusing.
              </p>
            </StaticTile>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Progress"
          title="How to know when to move on"
          description="Do not move forward because the calendar says so. Move forward when the small set is becoming more reliable."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {progressCriteria.map((item) => (
              <StaticTile key={item.title}>
                <h3 className="mw-heading text-lg font-extrabold text-sky-950">
                  {item.title}
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {item.text}
                </p>
              </StaticTile>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Mistakes"
          title="Common practice mistakes"
          description="These are the habits that make practice hard to read, hard to repeat, or hard to learn from."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {practiceMistakes.map((mistake) => (
              <StaticTile key={mistake.title}>
                <h3 className="mw-heading text-lg font-extrabold text-sky-950">
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
          eyebrow="Tool order"
          title="Use the tools in order"
          description="Pick one next action. A practice plan is easier to follow when each page has a clear role."
          layout="stacked"
        >
          <SimpleGrid items={toolFlowItems} />
        </SectionCard>

        <SectionCard
          eyebrow="Offline practice"
          title="Printable or offline practice"
          description="Paper is useful when you want a quiet review block, a classroom handout, or a short list of weak spots away from the screen."
        >
          <SimpleGrid
            linkedItemStyle="inline"
            items={[
              {
                title: "Printable chart",
                text: "Use this for a compact reference sheet when you are checking letters, numbers, punctuation, or spacing.",
                href: ROUTES.printableChart,
                badge: "Reference",
              },
              {
                title: "Printable pages",
                text: "Use this for practice sheets, short review pages, or a small worksheet packet built around the current weak set.",
                href: ROUTES.printablePages,
                badge: "Sheets",
              },
            ]}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Sources"
          title="Sources and further reading"
          description="These references support the learning, timing, and audio-practice notes on this page."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {practiceSourceLinks.map((source) => (
              <StaticTile key={source.href}>
                <h3 className="mw-heading text-lg font-extrabold text-sky-950">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="cursor-pointer text-sky-900 underline decoration-sky-900/40 underline-offset-4 hover:decoration-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  >
                    {source.title}
                  </a>
                </h3>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {source.description}
                </p>
              </StaticTile>
            ))}
          </div>
          <StaticTile className="mt-5">
            <h3 className="mw-heading text-lg font-extrabold text-sky-950">
              Source and correction notes
            </h3>
            <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
              MorseWords uses International Morse for its learning and practice
              tools. For source corrections or attribution concerns, see the{" "}
              <InlineTextLink href={ROUTES.sources}>sources page</InlineTextLink>
              .
            </p>
          </StaticTile>
        </SectionCard>

        <FaqSectionGeneric title="Practice plan FAQ" items={faqItems} />

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code Practice Plan" />
    </div>
  );
}
