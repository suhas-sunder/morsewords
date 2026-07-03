import type { ReactNode } from "react";
import type { Route } from "./+types/morse-code-amateur-radio-cw";

import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
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

const CANONICAL_PATH = ROUTES.amateurRadioCw;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code, CW, and Amateur Radio | Learner Guide | MorseWords",
    description:
      "Learn what CW means in amateur radio, why some operators still practice Morse code, and how to connect MorseWords audio practice to radio-style listening without treating this as legal operating advice.",
    path: CANONICAL_PATH,
    keywords:
      "morse code amateur radio cw, cw morse code, ham radio morse code, morse code radio practice",
  });
}

const shortAnswerItems = [
  {
    title: "CW means continuous wave",
    text: "In amateur-radio contexts, CW commonly refers to Morse code sent as a keyed radio signal.",
    badge: "Term",
  },
  {
    title: "MorseWords is practice",
    text: "The tools here help with listening, recognition, timing, and copying. They are not radio operation.",
    badge: "Boundary",
  },
  {
    title: "Radio rules are separate",
    text: "Treat licensing, band rules, and operating procedure as official-source topics, not as advice from this page.",
    badge: "Safety",
  },
];

const cwPulses = [
  { label: "on", widthClass: "w-5" },
  { label: "off", widthClass: "w-3", muted: true },
  { label: "on", widthClass: "w-14" },
  { label: "off", widthClass: "w-5", muted: true },
  { label: "on", widthClass: "w-5" },
  { label: "off", widthClass: "w-10", muted: true },
  { label: "on", widthClass: "w-14" },
];

const whyPracticeItems = [
  {
    title: "Tradition and skill",
    text: "Some operators enjoy CW because it is a hands-on listening skill with a long amateur-radio history.",
  },
  {
    title: "Compact patterns",
    text: "Morse characters are short timed signals, so practice often focuses on recognizing rhythm and spacing.",
  },
  {
    title: "Practice culture",
    text: "ARRL resources still publish code-practice material, schedules, and learning references.",
  },
  {
    title: "Personal challenge",
    text: "For many learners, the appeal is steady improvement: hearing a character, copying it, and recovering after a miss.",
  },
];

const boundaryItems = [
  "MorseWords can help you recognize characters by sound.",
  "MorseWords can help you practice timing, copying, and review habits.",
  "MorseWords does not teach legal operating procedure.",
  "MorseWords does not replace official licensing, band-plan, or operating guidance.",
];

const comparisonRows = [
  {
    label: "Practice setting",
    morsewords: "Controlled audio you can replay, slow down, and review.",
    radio: "Live signals can vary with operator style, conditions, and procedure.",
  },
  {
    label: "Main skill",
    morsewords: "Recognize characters, spacing, words, and mistakes in a repeatable drill.",
    radio: "Apply recognition while following radio-specific conventions and rules.",
  },
  {
    label: "Best beginner use",
    morsewords: "Build a stable listening habit before worrying about radio context.",
    radio: "Study through official amateur-radio sources after the basics are familiar.",
  },
];

const practicePathLinks = [
  {
    title: "Learn Morse Code",
    text: "Start with dits, dahs, spacing, a starter chart, and a first short practice session.",
    href: ROUTES.learn,
    badge: "Start",
  },
  {
    title: "Morse Code Audio Practice",
    text: "Train character recognition by sound before connecting the skill to radio-style listening.",
    href: ROUTES.audioPractice,
    badge: "Listen",
  },
  {
    title: "Morse Code Practice Plan",
    text: "Use a routine that separates recognition, spacing, copying, and review.",
    href: ROUTES.practicePlan,
    badge: "Plan",
  },
  {
    title: "Farnsworth Timing",
    text: "Keep character sounds crisp while adding room between letters and words.",
    href: ROUTES.farnsworth,
    badge: "Timing",
  },
  {
    title: "Morse Code Chart",
    text: "Check the International Morse patterns used by this site and modern learning tools.",
    href: ROUTES.chart,
    badge: "Chart",
  },
  {
    title: "International Morse Code Reference",
    text: "Use the formal reference when you want source-backed timing and signal context.",
    href: ROUTES.internationalReference,
    badge: "Reference",
  },
  {
    title: "Morse Code Q Codes",
    text: "Read common Q-code meanings as reference material, not as operating instruction.",
    href: ROUTES.qCodes,
    badge: "Reference",
  },
  {
    title: "Morse Code Prosigns",
    text: "Review procedural signs as learning context before treating them as radio practice.",
    href: ROUTES.prosigns,
    badge: "Reference",
  },
];

const notCoveredItems = [
  "Licensing requirements or country-specific legal rules.",
  "How to transmit on amateur-radio bands.",
  "Frequency, band-plan, or station-operation advice.",
  "Emergency operating procedure.",
  "Equipment purchasing advice.",
];

const localSourceTitles = new Set([
  "ARRL Learning Morse Code",
  "ARRL Tips for Learning Morse Code",
  "ARRL Morse timing standard",
  "ITU-R Recommendation M.1677-1",
]);

const localSources = SOURCE_LINKS.filter((source) =>
  localSourceTitles.has(source.title),
);

const additionalSources = [
  {
    title: "ARRL CW Mode",
    href: "https://www.arrl.org/cw-mode",
    description:
      "ARRL overview of CW as Morse-code radio communication in amateur-radio context.",
  },
  {
    title: "ARRL W1AW Code Practice MP3 Files",
    href: "https://www.arrl.org/code-practice-files",
    description:
      "ARRL page for W1AW code-practice audio files and practice speeds.",
  },
  {
    title: "ARRL W1AW Operating Schedule",
    href: "https://www.arrl.org/w1aw-operating-schedule",
    description:
      "ARRL schedule page showing W1AW code practice and bulletin context. This page does not use it as operating instruction.",
  },
  {
    title: "FCC Report and Order 06-178",
    href: "https://docs.fcc.gov/public/attachments/FCC-06-178A1.pdf",
    description:
      "FCC source for the historical U.S. amateur-radio Morse examination change. Use official sources for current licensing rules.",
  },
];

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

function CwConceptCard() {
  return (
    <StaticTile as="section" aria-labelledby="cw-concept-heading">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.68fr)_minmax(240px,0.32fr)] lg:items-center">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Keyed signal idea
          </p>
          <h3
            id="cw-concept-heading"
            className="mw-heading mt-2 text-2xl font-extrabold text-sky-950"
          >
            On, off, on, off
          </h3>
          <p className="mw-text-muted mt-3 max-w-[62ch] text-base leading-relaxed text-slate-700">
            For learners, the useful idea is simple: Morse characters can be
            heard as timed sound patterns. A keyed signal is either present or
            silent, and the timing creates the character.
          </p>
        </div>
        <div aria-label="Simplified CW keyed timing strip">
          <div className="flex flex-wrap items-end gap-2" aria-hidden="true">
            {cwPulses.map((pulse, index) => (
              <span
                key={`${pulse.label}-${index}`}
                className={`${pulse.widthClass} block h-4 rounded-full ${
                  pulse.muted ? "bg-sky-800/25" : "bg-slate-950"
                }`}
              />
            ))}
          </div>
          <p className="mw-muted-label mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            signal on / silence / signal on
          </p>
        </div>
      </div>
    </StaticTile>
  );
}

function ComparisonTable() {
  return (
    <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft hidden grid-cols-[170px_minmax(0,1fr)_minmax(0,1fr)] gap-4 bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:grid">
        <span>Topic</span>
        <span>MorseWords audio practice</span>
        <span>CW/radio context</span>
      </div>
      {comparisonRows.map((row) => (
        <div
          key={row.label}
          className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[170px_minmax(0,1fr)_minmax(0,1fr)] md:gap-4"
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {row.label}
          </p>
          <p className="mw-text-muted text-base leading-relaxed text-slate-700">
            <span className="mb-1 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 md:hidden">
              MorseWords audio practice
            </span>
            {row.morsewords}
          </p>
          <p className="mw-text-muted text-base leading-relaxed text-slate-700">
            <span className="mb-1 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 md:hidden">
              CW/radio context
            </span>
            {row.radio}
          </p>
        </div>
      ))}
    </div>
  );
}

function SourceTile({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <StaticTile>
      <h3 className="mw-heading text-lg font-extrabold leading-snug text-sky-950">
        <a
          href={href}
          target="_blank"
          rel="nofollow noreferrer noopener"
          className="cursor-pointer text-sky-900 underline underline-offset-4 hover:no-underline"
        >
          {title}
        </a>
      </h3>
      <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
        {description}
      </p>
    </StaticTile>
  );
}

export default function MorseCodeAmateurRadioCw() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code, CW, and Amateur Radio",
        item: CANONICAL_URL,
      },
    ],
  };
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${CANONICAL_URL}#learning-resource`,
    name: "Morse Code, CW, and Amateur Radio",
    url: CANONICAL_URL,
    description:
      "Learner-focused explanation of CW in amateur-radio contexts, Morse code listening practice, timing, and safe boundaries around legal radio operation.",
    educationalLevel: "Beginner",
    educationalUse: "Morse code listening practice and amateur-radio context",
    about: ["Morse code", "CW", "amateur radio", "listening practice"],
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbJsonLd, learningResourceJsonLd],
  };

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Radio context"
          title="Morse Code, CW, and Amateur Radio"
          description="CW is commonly associated with Morse code in amateur-radio contexts. This page explains the learning connection in plain terms; it is not a licensing guide, an operating manual, or legal advice about transmitting."
          aside={
            <DarkNote label="Plain boundary" value="Practice, not operation">
              Use MorseWords to train your ear and timing. Use official radio
              sources for rules, licensing, and operating procedure.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              {
                href: ROUTES.audioPractice,
                label: "Practice by sound",
                primary: true,
              },
              { href: ROUTES.practicePlan, label: "Use a practice plan" },
              { href: ROUTES.farnsworth, label: "Review Farnsworth" },
              { href: ROUTES.internationalReference, label: "Open reference" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Short answer"
          title="CW is radio context; MorseWords is recognition practice"
          description="The overlap is listening: both depend on hearing timed patterns clearly. The legal and operating parts of radio are separate."
          layout="stacked"
        >
          <SimpleGrid items={shortAnswerItems} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="What CW means"
          title="CW as timed on/off signaling"
          description="You do not need an electronics lesson to start learning the listening skill. Focus first on the character rhythm."
        >
          <CwConceptCard />
        </SectionCard>

        <SectionCard
          eyebrow="Why practice"
          title="Why some operators still practice Morse"
          description="Morse is no longer the only way to communicate, and not every operator uses it. Some still practice it because the skill itself is rewarding and useful in radio-learning culture."
        >
          <SimpleGrid items={whyPracticeItems} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="Boundary"
          title="CW practice is not the same as radio operation"
          description="This page deliberately stops before rules, procedures, frequencies, or transmission steps."
        >
          <div className="mw-static-panel rounded-xl bg-[#fffdf8] p-5">
            <ul className="grid gap-3 pl-5 text-base leading-relaxed text-slate-700">
              {boundaryItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Comparison"
          title="CW vs MorseWords audio practice"
          description="Use MorseWords for controlled, repeatable listening drills. Treat live radio context as a separate layer."
        >
          <ComparisonTable />
        </SectionCard>

        <SectionCard
          eyebrow="Timing"
          title="Farnsworth, timing, and copying short exchanges"
          description="Radio-style listening often includes short chunks such as call signs or brief exchanges, which can feel different from story practice."
        >
          <StaticTile>
            <p className="mw-text-muted max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Timing matters because Morse is a rhythm, not just printed marks.
              If characters feel rushed,{" "}
              <InlineTextLink href={ROUTES.farnsworth}>
                Farnsworth timing
              </InlineTextLink>{" "}
              can keep the character sounds crisp while adding more room
              between letters. For the underlying dot, dash, letter-gap, and
              word-gap rules, use the{" "}
              <InlineTextLink href={ROUTES.timing}>
                Morse code timing guide
              </InlineTextLink>
              .
            </p>
            <p className="mw-text-muted mt-4 max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              If your goal is eventual radio-style listening, keep the practice
              modest: copy short groups, review recurring mistakes, then return
              to the{" "}
              <InlineTextLink href={ROUTES.practicePlan}>
                Morse code practice plan
              </InlineTextLink>{" "}
              instead of turning every drill into a test.
            </p>
          </StaticTile>
        </SectionCard>

        <SectionCard
          eyebrow="Practice path"
          title="A safe practice path"
          description="These pages support listening and reference skills without pretending to be a radio operating course."
          layout="stacked"
        >
          <SimpleGrid items={practicePathLinks} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Not covered"
          title="What this page does not cover"
          description="This boundary is intentional. A learner page should not pretend to be a legal or operating authority."
        >
          <div className="mw-static-panel rounded-xl bg-[#fffdf8] p-5">
            <ul className="grid gap-3 pl-5 text-base leading-relaxed text-slate-700">
              {notCoveredItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Sources"
          title="Sources and further reading"
          description="These are official or locally verified sources used for the learning, timing, and historical radio context. Use current official sources for any legal or operating decision."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[...localSources, ...additionalSources].map((source) => (
              <SourceTile
                key={source.title}
                title={source.title}
                href={source.href}
                description={source.description}
              />
            ))}
          </div>
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code, CW, and Amateur Radio" />
    </div>
  );
}
