import type { ReactNode } from "react";
import type { Route } from "./+types/morse-code-history";

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

const CANONICAL_PATH = ROUTES.history;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code History | Telegraph, Radio, and Modern CW | MorseWords",
    description:
      "Learn how Morse code grew from electric telegraphy into International Morse, radio/CW practice, and modern learning tools.",
    path: CANONICAL_PATH,
    keywords:
      "morse code history, history of morse code, telegraph morse code, international morse code history, cw radio history",
  });
}

const timelineEvents = [
  {
    date: "1832",
    title: "The telegraph idea takes shape",
    text: "Samuel F. B. Morse began thinking seriously about electric telegraphy after discussions about electromagnetism during an Atlantic crossing.",
  },
  {
    date: "1837-1838",
    title: "Working demonstrations",
    text: "Morse, Leonard Gale, and Alfred Vail refined the instrument and code enough for public demonstrations.",
  },
  {
    date: "1844",
    title: "Washington to Baltimore",
    text: "Morse sent the famous public message from the U.S. Capitol to Alfred Vail in Baltimore.",
  },
  {
    date: "Telegraph era",
    title: "Different code families",
    text: "Historical landline Morse and the International Morse Code most learners use now are not the same system.",
  },
  {
    date: "Radio era",
    title: "Copying by sound",
    text: "Operators learned to read Morse by ear on telegraph sounders, and radio/CW practice later made the signal a tone.",
  },
  {
    date: "2007",
    title: "Morse testing becomes optional in the U.S.",
    text: "The FCC removed the Morse code exam requirement for U.S. amateur radio licenses, while operators could still use and practice CW.",
  },
] as const;

const myths = [
  {
    title: "SOS does not officially stand for a phrase",
    text: "Save Our Ship and Save Our Souls are common memory aids. The useful point is the clear, recognizable SOS signal pattern.",
    href: ROUTES.sos,
  },
  {
    title: "Morse is not only a printed dot-dash chart",
    text: "Charts are good references, but much Morse practice is about hearing short and long signals as rhythm.",
    href: ROUTES.audioPractice,
  },
  {
    title: "Modern learners usually use International Morse",
    text: "Early landline systems were not identical to the International Morse reference used for current learning and tools.",
    href: ROUTES.internationalReference,
  },
] as const;

const tryLinks = [
  {
    title: "Morse code alphabet",
    text: "Start with A-Z letters after reading the historical overview.",
    href: ROUTES.alphabet,
    badge: "Letters",
  },
  {
    title: "Morse code chart",
    text: "Compare letters, numbers, punctuation, and spacing in one reference.",
    href: ROUTES.chart,
    badge: "Reference",
  },
  {
    title: "Learn Morse Code",
    text: "Move from history into a practical beginner path with sound and short drills.",
    href: ROUTES.learn,
    badge: "Guide",
  },
  {
    title: "Morse code encoder",
    text: "Turn a word into International Morse and see the code pattern immediately.",
    href: ROUTES.encoder,
    badge: "Try",
  },
  {
    title: "Morse code decoder",
    text: "Paste dots, dashes, spaces, or slashes and check the text behind them.",
    href: ROUTES.decoder,
    badge: "Check",
  },
];

const historySources = [
  {
    title: "Library of Congress: Invention of the Telegraph",
    href: "https://www.loc.gov/collections/samuel-morse-papers/articles-and-essays/invention-of-the-telegraph/",
    description:
      "Background on Morse, electric telegraph development, and the 1844 Washington-to-Baltimore demonstration.",
  },
  {
    title: "Smithsonian: Morse-Vail Telegraph Key",
    href: "https://www.si.edu/object/nmah_1096762",
    description:
      "Object notes on Alfred Vail's role in developing practical coded electrical signaling equipment with Morse.",
  },
  {
    title: "U.S. Senate: First Telegraph Message",
    href: "https://www.senate.gov/about/images/documents/telegraph-message-1844-loc.htm",
    description:
      "Historical note on the first public telegraph message sent from the Capitol to Baltimore.",
  },
  {
    title: "FCC Report and Order 06-178",
    href: "https://docs.fcc.gov/public/attachments/FCC-06-178A1.pdf",
    description:
      "FCC order eliminating the Morse telegraphy examination requirement for certain U.S. amateur radio licenses.",
  },
  {
    title: "ARRL Letter, February 23, 2007",
    href: "https://www.arrl.org/arrlletterissue?issue=2007-02-23",
    description:
      "ARRL report on the date Morse proficiency disappeared from FCC Part 97 amateur radio rules.",
  },
  ...SOURCE_LINKS.filter((source) => source.title === "ITU-R Recommendation M.1677-1"),
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

function TimelineCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {timelineEvents.map((event) => (
        <StaticTile key={event.date}>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {event.date}
          </p>
          <h3 className="mw-heading mt-2 text-lg font-extrabold leading-snug text-sky-950">
            {event.title}
          </h3>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
            {event.text}
          </p>
        </StaticTile>
      ))}
    </div>
  );
}

function ComparisonCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <StaticTile>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Earlier landline use
        </p>
        <h3 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
          American Morse
        </h3>
        <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
          Early U.S. telegraphy used landline forms that are part of Morse code
          history, but they are not the main system a beginner normally studies
          today.
        </p>
      </StaticTile>
      <StaticTile>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Current learning target
        </p>
        <h3 className="mw-heading mt-2 text-xl font-extrabold text-sky-950">
          International Morse
        </h3>
        <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
          MorseWords tools and reference pages use International Morse Code,
          the reference set used for modern learning, audio practice, and typed
          dot-dash lookup on this site.
        </p>
      </StaticTile>
    </div>
  );
}

function MessageCard() {
  return (
    <StaticTile className="mt-5">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        1844 public message
      </p>
      <p className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
        What hath God wrought?
      </p>
      <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
        The message is memorable because it shows what the telegraph was built
        to do: move words over distance faster than physical delivery.
      </p>
    </StaticTile>
  );
}

export default function MorseCodeHistory() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code History",
        item: CANONICAL_URL,
      },
    ],
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Morse Code History",
    url: CANONICAL_URL,
    description:
      "A beginner-friendly history of Morse code from electric telegraphy through International Morse, radio/CW practice, and modern learning.",
    educationalLevel: "Beginner",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const jsonLd = [breadcrumbJsonLd, pageJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Morse history"
          title="Morse Code History"
          description="Morse code began as a practical telegraph system, not as a puzzle or novelty. The code people usually learn now is International Morse Code, while early landline telegraphy used different forms."
          aside={
            <DarkNote label="Historical anchor" value="1844">
              A public telegraph message traveled from Washington to Baltimore,
              showing how quickly words could move over an electric line.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: ROUTES.learn, label: "Learn the code", primary: true },
              { href: ROUTES.internationalReference, label: "International reference" },
              { href: ROUTES.sos, label: "SOS history note" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Why it existed"
          title="Why Morse code was invented"
          description="The first problem was speed: moving messages farther and faster than letters, messengers, or visual signals could manage."
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]">
            <div className="mw-text-muted space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p>
                Electric telegraphy gave operators a way to send information
                over a wire. The signal needed a compact code, because the line
                could carry pulses more naturally than handwriting or speech.
              </p>
              <p>
                Samuel F. B. Morse is the name most people remember, but the
                early system was not a one-person invention. Leonard Gale and
                Alfred Vail helped turn the idea into a working instrument and
                practical signaling system.
              </p>
              <p>
                The 1844 public message, sent from the U.S. Capitol to
                Baltimore, was "What hath God wrought?" It was a demonstration
                that text could move over distance far faster than physical
                delivery.
              </p>
            </div>
            <MessageCard />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Timeline"
          title="Key moments in Morse code history"
          description="This is a compact timeline, not a full telegraph history. It focuses on the moments that help a learner understand why the code changed shape."
          layout="stacked"
        >
          <TimelineCards />
        </SectionCard>

        <SectionCard
          eyebrow="Code families"
          title="American Morse vs International Morse"
          description="A useful history page has to separate early landline Morse from the International Morse Code used by modern learners."
        >
          <div className="space-y-5">
            <ComparisonCards />
            <p className="mw-text-muted max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              If you are learning on MorseWords, use the{" "}
              <InlineTextLink href={ROUTES.internationalReference}>
                International Morse Code reference
              </InlineTextLink>
              . It is the practical map for the translator, decoder, audio
              tools, practice pages, and printable references here.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Radio"
          title="From telegraph sounders to radio"
          description="Morse was not only a set of marks on paper. Operators also learned to copy it by sound."
        >
          <div className="mw-text-muted space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
            <p>
              On telegraph lines, an operator could read the clicks of a
              sounder or use printed marks. In radio and CW practice, the same
              short-and-long pattern is usually heard as a tone separated by
              careful spacing.
            </p>
            <p>
              That shift is why modern practice is often audio-first. You can
              study a chart, but useful recognition comes from hearing whole
              character rhythms without counting every mark.
            </p>
            <p>
              To try that side of the history, use{" "}
              <InlineTextLink href={ROUTES.audioPractice}>
                Morse code audio practice
              </InlineTextLink>{" "}
              after you know the first few letters.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Still useful"
          title="Why Morse code is still around"
          description="Morse is no longer how most people send everyday messages, but it still has practical and educational uses."
          layout="stacked"
        >
          <SimpleGrid
            variant="cards"
            items={[
              {
                title: "CW and amateur radio practice",
                text: "CW remains a skill-based radio practice even though Morse testing is no longer required for U.S. amateur licenses.",
                badge: "Radio",
              },
              {
                title: "Listening and recognition training",
                text: "Morse is a good example of how rhythm, spacing, and repeated short sessions can build recall.",
                badge: "Practice",
              },
              {
                title: "Education and history",
                text: "The code connects communication history to hands-on lessons about signals, timing, and translation.",
                badge: "Learn",
              },
              {
                title: "Simple identifiers and signals",
                text: "Short Morse patterns still appear in identifiers, teaching examples, and recognizable signals such as SOS.",
                badge: "Signals",
              },
            ]}
          />
          <p className="mw-text-muted mt-5 max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
            For a practical next step, start with{" "}
            <InlineTextLink href={ROUTES.learn}>Learn Morse Code</InlineTextLink>
            , review{" "}
            <InlineTextLink href={ROUTES.sos}>SOS in Morse code</InlineTextLink>
            , or study the{" "}
            <InlineTextLink href={ROUTES.timing}>
              Morse code timing guide
            </InlineTextLink>
            .
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Myths"
          title="Common myths"
          description="These are small distinctions, but they save beginners from learning the wrong story."
        >
          <SimpleGrid
            linkedItemStyle="inline"
            items={myths.map((myth) => ({
              title: myth.title,
              text: myth.text,
              href: myth.href,
            }))}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Try it"
          title="Try the history, then try the code"
          description="A history page is more useful when it points back to real practice and reference tools."
          layout="stacked"
        >
          <SimpleGrid items={tryLinks} />
        </SectionCard>

        <SectionCard
          eyebrow="Sources"
          title="Sources and further reading"
          description="These are the sources used for the historical claims on this page. External links open the official source or source organization."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {historySources.map((source) => (
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
        </SectionCard>

        <BreadcrumbTrail current="Morse Code History" />
      </main>
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
