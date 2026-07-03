import type { ReactNode } from "react";
import type { Route } from "./+types/farnsworth-timing";

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

const CANONICAL_PATH = ROUTES.farnsworth;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Farnsworth Timing for Morse Code Practice | MorseWords",
    description:
      "Learn how Farnsworth timing keeps Morse character sounds crisp while widening gaps for easier listening practice.",
    path: CANONICAL_PATH,
    keywords:
      "Farnsworth timing, Morse code Farnsworth, character speed, effective WPM, Morse audio practice",
  });
}

const faqItems = [
  {
    q: "What is Farnsworth timing?",
    a: "Farnsworth timing sends each character at a chosen character speed, then adds extra spacing between characters and words so the overall message feels slower.",
  },
  {
    q: "Is Farnsworth timing required for beginners?",
    a: "No. It is a useful option when normal timing feels crowded, but some learners prefer slower standard timing or a different practice method.",
  },
  {
    q: "What is character speed?",
    a: "Character speed controls the rhythm inside each letter: dots, dashes, and the small gaps inside one character.",
  },
  {
    q: "What is effective speed?",
    a: "Effective speed describes the pace of the whole message after extra Farnsworth spacing is added between characters and words.",
  },
  {
    q: "Does Farnsworth change the dot-dash pattern?",
    a: "No. The character pattern stays the same. Farnsworth changes the silence between complete characters and words.",
  },
  {
    q: "When should I reduce Farnsworth spacing?",
    a: "Reduce the extra spacing gradually when you can recognize characters without counting and can copy short groups without losing the next letter.",
  },
  {
    q: "How is Farnsworth different from Koch practice?",
    a: "Koch-style practice adds characters gradually. Farnsworth changes spacing. They can be used together, but they solve different practice problems.",
  },
  {
    q: "Does lower effective WPM make audio longer?",
    a: "Yes. Extra silence is part of the timed signal, so lower effective WPM makes playback and exports longer.",
  },
];

const shortVersionItems = [
  {
    title: "Standard timing",
    text: "Character speed and overall message speed match. Slowing the message also slows the character shapes.",
    badge: "Normal",
  },
  {
    title: "Farnsworth timing",
    text: "Character sounds stay crisp, while letter and word gaps are stretched to lower the full-message pace.",
    badge: "Practice",
  },
  {
    title: "Best use case",
    text: "Helpful when you can identify some characters by sound but still need more room to copy the next one.",
    badge: "Learner",
  },
];

const timingComparisonRows = [
  {
    title: "Standard slower Morse",
    note: "Everything slows down together. The character sound itself becomes longer.",
    segments: [
      { label: "character sound", units: 5, tone: "bg-slate-950" },
      { label: "letter gap", units: 3, tone: "bg-sky-800" },
      { label: "character sound", units: 5, tone: "bg-slate-950" },
      { label: "word gap", units: 7, tone: "bg-sky-800" },
    ],
  },
  {
    title: "Farnsworth-style practice",
    note: "Characters stay tighter, but the gaps give you more time before the next character or word.",
    segments: [
      { label: "character sound", units: 3, tone: "bg-slate-950" },
      { label: "letter gap", units: 6, tone: "bg-sky-800" },
      { label: "character sound", units: 3, tone: "bg-slate-950" },
      { label: "word gap", units: 10, tone: "bg-sky-800" },
    ],
  },
] as const;

const benefitItems = [
  {
    title: "It discourages counting",
    text: "Crisper character sounds make it easier to hear a letter as one rhythm instead of counting each dot and dash.",
  },
  {
    title: "It keeps the target sound familiar",
    text: "The character shape stays closer to the sound you want to recognize later at a steadier pace.",
  },
  {
    title: "It gives copy time",
    text: "The longer gaps leave room to write or type what you heard before the next character arrives.",
  },
  {
    title: "It can lower early pressure",
    text: "For short beginner sessions, wider gaps can make practice feel less rushed while recognition is still forming.",
  },
];

const cautionItems = [
  {
    title: "Spacing can become a crutch",
    text: "If the gaps never get shorter, real words can keep feeling disconnected.",
  },
  {
    title: "Too much gap breaks flow",
    text: "Very wide spacing may make letters feel isolated instead of part of a word.",
  },
  {
    title: "Constant changes hide progress",
    text: "Changing character speed, effective speed, prompt type, and tone at once makes results hard to read.",
  },
  {
    title: "It does not replace listening",
    text: "Farnsworth changes timing, but recognition still comes from repeated listening and review.",
  },
];

const methodRows = [
  {
    label: "Koch-style practice",
    text: "Add characters gradually while keeping the character sound clear.",
  },
  {
    label: "Farnsworth timing",
    text: "Keep character sounds recognizable while stretching letter and word gaps.",
  },
  {
    label: "Together",
    text: "Practice a small character set with crisp characters and comfortable spacing, then tighten the gaps as copying improves.",
  },
] as const;

const settingRows = [
  {
    setting: "Character speed",
    guidance:
      "Choose a speed where the character has a clean rhythm, not one where every mark feels dragged out.",
  },
  {
    setting: "Effective speed",
    guidance:
      "Choose enough spacing that you can copy without rushing, then keep it stable for a session.",
  },
  {
    setting: "Adjustment",
    guidance:
      "Reduce extra spacing gradually. Change one timing control at a time so you know what helped.",
  },
] as const;

const practiceLinks = [
  {
    title: "Morse code audio practice",
    text: "Use Farnsworth spacing while you listen and type what you copied.",
    href: ROUTES.audioPractice,
    badge: "Listen",
  },
  {
    title: "Morse code word trainer",
    text: "Use short words when characters are familiar but word rhythm still breaks down.",
    href: ROUTES.wordTrainer,
    badge: "Words",
  },
  {
    title: "Morse code test",
    text: "Check accuracy after practice, then return to the settings that caused misses.",
    href: ROUTES.test,
    badge: "Check",
  },
  {
    title: "Morse code timing",
    text: "Review the standard dot, dash, letter-gap, and word-gap rules behind the timing controls.",
    href: ROUTES.timing,
    badge: "Rules",
  },
];

const sourceTitles = new Set([
  "ARRL Learning Morse Code",
  "ARRL Tips for Learning Morse Code",
  "ARRL Morse timing standard",
  "ITU-R Recommendation M.1677-1",
]);

const farnsworthSources = SOURCE_LINKS.filter((source) =>
  sourceTitles.has(source.title),
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

function TimingComparisonVisual() {
  return (
    <div className="grid gap-4" aria-label="Standard Morse compared with Farnsworth timing">
      {timingComparisonRows.map((row) => (
        <StaticTile key={row.title}>
          <h3 className="mw-heading text-lg font-extrabold text-sky-950">
            {row.title}
          </h3>
          <p className="mw-text-muted mt-2 max-w-[68ch] text-sm leading-relaxed text-slate-700">
            {row.note}
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-2" aria-hidden="true">
            {row.segments.map((segment, index) => (
              <div
                key={`${row.title}-${segment.label}-${index}`}
                className="grid min-w-[3rem] gap-1"
                style={{ width: `${segment.units * 1.5}rem` }}
              >
                <span className={`block h-3 rounded-full ${segment.tone}`} />
                <span className="font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-slate-500">
                  {segment.label}
                </span>
              </div>
            ))}
          </div>
        </StaticTile>
      ))}
    </div>
  );
}

function SettingsTable() {
  return (
    <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
      {settingRows.map((row) => (
        <div
          key={row.setting}
          className="grid gap-2 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[180px_minmax(0,1fr)] md:gap-4"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {row.setting}
          </p>
          <p className="mw-text-muted text-base leading-relaxed text-slate-700">
            {row.guidance}
          </p>
        </div>
      ))}
    </div>
  );
}

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
    "@id": `${CANONICAL_URL}#article`,
    name: "Farnsworth Timing",
    headline: "Farnsworth Timing for Morse Code Practice",
    url: CANONICAL_URL,
    mainEntityOfPage: CANONICAL_URL,
    description:
      "Guide to Farnsworth timing, character speed, effective speed, widened spacing, Morse listening practice, and learner settings.",
    about: ["Farnsworth timing", "Morse code", "character speed", "effective WPM"],
    mentions: [
      "Morse code timing",
      "Koch practice",
      "Morse audio practice",
      "Morse code word trainer",
    ],
    educationalUse: "Morse code listening practice and timing reference",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${CANONICAL_URL}#faq`,
    url: CANONICAL_URL,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbJsonLd, articleJsonLd, faqJsonLd],
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Listening practice"
          title="Farnsworth Timing"
          description="Farnsworth timing sends each Morse character at a clear character speed, then adds extra space between letters or words. It is useful when you want to hear characters as sound patterns without forcing the whole message to move too fast."
          aside={
            <DarkNote label="Plain version" value="Fast letters, wider gaps">
              Farnsworth is optional. Use it when normal spacing feels crowded,
              then reduce the extra gap as your copy gets steadier.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: ROUTES.audioPractice, label: "Practice by ear", primary: true },
              { href: ROUTES.timing, label: "Review timing rules" },
              { href: ROUTES.wordTrainer, label: "Train short words" },
              { href: ROUTES.practicePlan, label: "Use a practice plan" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Short version"
          title="Farnsworth separates character speed from message pace"
          description="The goal is to keep the character sound intact while you build recognition, then reduce extra spacing as copying feels steadier."
          layout="stacked"
        >
          <SimpleGrid items={shortVersionItems} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="Comparison"
          title="What changes when Farnsworth is on"
          description="This visual is simplified: it shows the practical difference between slowing everything down and keeping character sounds crisp while stretching the gaps."
        >
          <TimingComparisonVisual />
        </SectionCard>

        <SectionCard
          eyebrow="Why it helps"
          title="Farnsworth gives beginners room without slowing every character"
          description="Use it when the letters sound recognizable, but the next character arrives before you can copy the last one."
        >
          <SimpleGrid items={benefitItems} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="Watchouts"
          title="Where Farnsworth can go wrong"
          description="The same extra spacing that helps at first can slow progress if it never changes."
        >
          <SimpleGrid items={cautionItems} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="Learning methods"
          title="Farnsworth vs Koch"
          description="These are different knobs. One changes spacing; the other changes how many characters you practice."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {methodRows.map((row) => (
              <StaticTile key={row.label}>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {row.label}
                </p>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {row.text}
                </p>
              </StaticTile>
            ))}
          </div>
          <p className="mw-text-muted mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700">
            For a broader routine that combines character recognition, short
            words, audio practice, and review, use the{" "}
            <InlineTextLink href={ROUTES.practicePlan}>
              Morse code practice plan
            </InlineTextLink>
            .
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Settings"
          title="Suggested starting settings"
          description="Treat these as adjustment rules, not a promise about speed or progress."
        >
          <SettingsTable />
        </SectionCard>

        <SectionCard
          eyebrow="Practice path"
          title="Practice with Farnsworth"
          description="Try one short session with stable settings, then use the result to decide what to adjust next."
        >
          <SimpleGrid items={practiceLinks} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Sources"
          title="Sources and further reading"
          description="These are the verified local source links currently used by MorseWords for learning and timing references."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {farnsworthSources.map((source) => (
              <StaticTile key={source.title}>
                <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    className="cursor-pointer text-sky-900 underline underline-offset-4 hover:no-underline"
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
        </SectionCard>

        <div id="faq">
          <FaqSectionGeneric
            title="Farnsworth FAQ"
            description="Quick answers about character speed, effective speed, spacing, practice methods, and when to reduce extra gaps."
            items={faqItems}
          />
        </div>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Farnsworth Timing" />
    </div>
  );
}
