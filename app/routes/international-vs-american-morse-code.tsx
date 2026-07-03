import type { ReactNode } from "react";
import type { Route } from "./+types/international-vs-american-morse-code";

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

const CANONICAL_PATH = ROUTES.internationalVsAmerican;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "International vs American Morse Code | Practical Comparison | MorseWords",
    description:
      "Compare International Morse Code and American Morse Code, with practical guidance on which code modern learners should use.",
    path: CANONICAL_PATH,
    keywords:
      "International vs American Morse code, American Morse code, International Morse code, landline Morse, Morse code comparison",
  });
}

const comparisonRows = [
  {
    label: "Main setting",
    international:
      "Modern references, learning tools, radio-style CW practice, and the MorseWords translator and decoder.",
    american:
      "Earlier landline telegraphy, especially the U.S. telegraph tradition connected with Morse and Vail.",
  },
  {
    label: "Common modern use",
    international:
      "The practical reference for this site, many learning resources, and radio-style practice.",
    american:
      "Historical or specialist context for most learners, including telegraph history study and some demonstrations.",
  },
  {
    label: "Sound and timing",
    international:
      "Practiced here as short and long tones with defined dot, dash, letter, and word spacing.",
    american:
      "Connected with landline equipment and operator practice; older references may not match this site's chart.",
  },
  {
    label: "Learner relevance",
    international:
      "Best first choice for beginners using audio practice, charts, typed lookup, and MorseWords tools.",
    american:
      "Useful to know about when reading older telegraph material, but not the first code to learn here.",
  },
  {
    label: "MorseWords tools",
    international:
      "The alphabet, chart, encoder, decoder, audio practice, and timing pages all use International Morse.",
    american:
      "MorseWords does not currently translate American Morse as a separate code family.",
  },
] as const;

const confusionItems = [
  {
    title: "Is American Morse the same as International Morse?",
    text: "No. They are related historically, but they are not interchangeable references. A pattern from one system should not be assumed to mean the same thing in the other.",
  },
  {
    title: "Will this site translate American Morse?",
    text: "No. MorseWords tools are built around International Morse Code. That keeps the translator, decoder, chart, and audio practice consistent.",
  },
  {
    title: "Which code should I learn first?",
    text: "Learn International Morse first unless you have a specific historical landline telegraph reason to study American Morse.",
  },
  {
    title: "Why do old telegraph references look different?",
    text: "Older references may be describing landline equipment, paper tape, sounders, or American Morse conventions rather than the modern International Morse chart.",
  },
] satisfies Array<{ title: string; text: string }>;

const tryLinks = [
  {
    title: "Morse code encoder",
    text: "Type plain text and see the International Morse pattern used by this site.",
    href: ROUTES.encoder,
    badge: "Text to Morse",
  },
  {
    title: "Morse code decoder",
    text: "Paste International Morse dots, dashes, slashes, and spaces to check the readable text.",
    href: ROUTES.decoder,
    badge: "Morse to text",
  },
  {
    title: "Morse code chart",
    text: "Use one reference for letters, numbers, punctuation, spacing, and source notes.",
    href: ROUTES.chart,
    badge: "Reference",
  },
  {
    title: "Morse code audio practice",
    text: "Practice International Morse by sound instead of memorizing marks only by sight.",
    href: ROUTES.audioPractice,
    badge: "Listen",
  },
] satisfies Array<{ title: string; text: string; href: string; badge: string }>;

const comparisonSources = [
  ...SOURCE_LINKS.filter((source) => source.title === "ITU-R Recommendation M.1677-1"),
  {
    title: "Library of Congress: Invention of the Telegraph, collection highlights",
    href: "https://www.loc.gov/static/collections/samuel-morse-papers/articles-and-essays/collection-highlights/invention-of-the-telegraph.html",
    description:
      "Source notes on early Morse code forms, American Morse, International Morse, and the move from paper records to acoustic sounders.",
  },
  {
    title: "Smithsonian: Morse-Vail Telegraph Key",
    href: "https://www.si.edu/object/nmah_1096762",
    description:
      "Object notes on Alfred Vail, Samuel Morse, and the practical coded electrical signaling system demonstrated in 1844.",
  },
  ...SOURCE_LINKS.filter((source) => source.title === "ARRL Learning Morse Code"),
] as const;

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

function ComparisonTable() {
  return (
    <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
      <div className="mw-static-surface-soft hidden grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)] gap-4 bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:grid">
        <span>Question</span>
        <span>International Morse</span>
        <span>American Morse</span>
      </div>
      <div className="divide-y divide-transparent">
        {comparisonRows.map((row) => (
          <div
            key={row.label}
            className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)] md:gap-4"
          >
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {row.label}
            </p>
            <div>
              <p className="md:hidden font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                International Morse
              </p>
              <p className="mw-text-muted mt-1 text-base leading-relaxed text-slate-700 md:mt-0">
                {row.international}
              </p>
            </div>
            <div>
              <p className="md:hidden font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                American Morse
              </p>
              <p className="mw-text-muted mt-1 text-base leading-relaxed text-slate-700 md:mt-0">
                {row.american}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InternationalVsAmericanMorseCode() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "International vs American Morse Code",
        item: CANONICAL_URL,
      },
    ],
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "International vs American Morse Code",
    url: CANONICAL_URL,
    description:
      "Practical beginner comparison of International Morse Code and American Morse Code, with guidance on which system to use for modern learning.",
    educationalLevel: "Beginner",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const jsonLd = [breadcrumbJsonLd, pageJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Code comparison"
          title="International vs American Morse Code"
          description="On this site and in many modern learning resources, the reference is International Morse Code. American Morse Code is an earlier landline telegraph code. This page is a practical comparison for learners, not a museum catalog."
          aside={
            <DarkNote label="Learner answer" value="START INTERNATIONAL">
              Use International Morse for modern practice, audio training, and
              every MorseWords tool. Treat American Morse as historical context
              unless you are studying landline telegraphy.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: ROUTES.chart, label: "Open chart", primary: true },
              { href: ROUTES.internationalReference, label: "International reference" },
              { href: ROUTES.history, label: "Morse history" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Short answer"
          title="Which one should you learn?"
          description="If you are learning with current charts, audio practice, or MorseWords tools, use International Morse Code."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <StaticTile>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Learn this first
              </p>
              <h2 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
                International Morse
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Choose it for modern practice, audio training, CW context,
                printed charts, and the tools on this site.
              </p>
            </StaticTile>
            <StaticTile>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Historical context
              </p>
              <h2 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
                American Morse
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                Treat it as historical or specialist context, especially when
                reading about early landline telegraphy.
              </p>
            </StaticTile>
            <StaticTile>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Avoid this trap
              </p>
              <h2 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
                Do not mix charts
              </h2>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                If an old chart looks different, check which code family it
                describes before using it for practice.
              </p>
            </StaticTile>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Comparison"
          title="Practical differences"
          description="The important learner question is not which one is more authentic. It is which reference matches your tools and practice goal."
          layout="stacked"
        >
          <ComparisonTable />
        </SectionCard>

        <SectionCard
          eyebrow="Why different"
          title="Why there were different Morse codes"
          description="Early telegraph systems grew around the equipment and operator habits of their time."
        >
          <div className="mw-text-muted space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              The first practical telegraph systems were built for wires,
              keys, registers, and sounders. In that setting, operators were
              solving a practical problem: how to send readable language as
              electrical pulses and pauses.
            </p>
            <p>
              As telegraph systems developed, code forms changed. The Library
              of Congress notes that what became known as American Morse had
              emerged by 1844, and that this system was later altered into what
              was known as International Morse.
            </p>
            <p>
              Learners do not need every historical branch before they can
              practice. They need one stable reference, clear timing, and
              enough listening practice to recognize whole character rhythms.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Learning choice"
          title="What learners should use"
          description="Use International Morse Code unless your goal is specifically historical American landline telegraphy."
        >
          <div className="space-y-5">
            <p className="mw-text-muted max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Start with the{" "}
              <InlineTextLink href={ROUTES.chart}>Morse code chart</InlineTextLink>{" "}
              or the{" "}
              <InlineTextLink href={ROUTES.alphabet}>
                Morse code alphabet
              </InlineTextLink>
              . Then practice by sound with{" "}
              <InlineTextLink href={ROUTES.audioPractice}>
                Morse code audio practice
              </InlineTextLink>
              . If spacing is the confusing part, use the{" "}
              <InlineTextLink href={ROUTES.timing}>
                Morse code timing guide
              </InlineTextLink>
              .
            </p>
            <SimpleGrid
              linkedItemStyle="inline"
              items={[
                {
                  title: "Use one reference",
                  text: "Do not jump between International and American charts while learning your first characters.",
                  href: ROUTES.internationalReference,
                  badge: "Reference",
                },
                {
                  title: "Practice by sound",
                  text: "Listening makes the International Morse characters feel like rhythms rather than marks to count.",
                  href: ROUTES.audioPractice,
                  badge: "Audio",
                },
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="History link"
          title="How this relates to Morse code history"
          description="This page separates the code families. The history page explains the wider telegraph story."
        >
          <p className="mw-text-muted max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            If you want the broader context around Morse, Vail, early public
            demonstrations, telegraph sounders, and radio practice,
            read the{" "}
            <InlineTextLink href={ROUTES.history}>
              Morse code history
            </InlineTextLink>{" "}
            page next.
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Common confusion"
          title="Questions beginners ask"
          description="These answers are intentionally narrow so the comparison stays useful."
          layout="stacked"
        >
          <SimpleGrid variant="cards" items={confusionItems} />
        </SectionCard>

        <SectionCard
          eyebrow="Try it"
          title="Try International Morse here"
          description="These tools all use the International Morse reference, so they agree with each other."
          layout="stacked"
        >
          <SimpleGrid items={tryLinks} />
        </SectionCard>

        <SectionCard
          eyebrow="Sources"
          title="Sources and further reading"
          description="These sources support the comparison and the recommendation to use International Morse for modern learning on this site."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {comparisonSources.map((source) => (
              <StaticTile key={source.title}>
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
              MorseWords uses International Morse for its tools and reference
              pages. For source corrections or attribution concerns, see the{" "}
              <InlineTextLink href={ROUTES.sources}>sources page</InlineTextLink>
              .
            </p>
          </StaticTile>
        </SectionCard>

        <BreadcrumbTrail current="International vs American Morse Code" />
      </main>
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
