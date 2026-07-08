import * as React from "react";

import {
  CodeIcon,
  HeadphonesIcon,
  ListIcon,
  PlayIcon,
  PrintIcon,
  RulerIcon,
} from "~/client/assets/svg/Icons";
import { SeoSectionRailAd } from "~/client/components/ads/AdSenseAds";
import {
  ActionButton,
  ActionLinkButton,
  CopyActionButton,
} from "~/client/components/shared/ActionControls";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  PageHero,
  SectionCard,
  SimpleGrid,
  StaticPanel,
  WAVE_PAGE_MAIN_CLASS,
} from "~/client/components/shared/MorseLearningLayout";
import { TEXT_TO_MORSE } from "~/client/components/shared/morseUtils";
import { playMorsePattern } from "~/client/components/shared/playMorsePattern";
import { encodeToolQueryValue } from "~/client/components/shared/queryPrefill";
import styles from "~/client/components/shared/pageStyles";
import {
  LETTER_ITEMS,
  NUMBER_ITEMS,
  SYMBOL_PAGES,
} from "~/client/data/morseContent";
import { PROSIGNS } from "~/client/data/morseLearning";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-chart";
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

const punctuationNames: Record<string, string> = {
  ".": "Period",
  ",": "Comma",
  "?": "Question mark",
  "/": "Slash",
  "'": "Apostrophe",
  "!": "Exclamation mark",
  "-": "Hyphen",
  "@": "At sign",
  ":": "Colon",
  ";": "Semicolon",
  "=": "Equals sign",
  "+": "Plus sign",
  '"': "Quotation mark",
  "(": "Open parenthesis",
  ")": "Close parenthesis",
  "&": "Ampersand",
  "_": "Underscore",
};

const punctuationOrder = Object.keys(TEXT_TO_MORSE).filter(
  (character) => !/^[A-Z0-9]$/.test(character),
);

const punctuationNotes: Record<string, string> = {
  ".": "Sentence ending mark. Keep it separated from the previous letter group.",
  ",": "Sentence separator. It uses a longer six-mark pattern.",
  "?": "Question ending mark for copied questions such as COPY?",
  "/": "A typed slash can be punctuation, while / is also used as a written word break.",
  "'": "Apostrophe for names and contractions such as DON'T.",
  "!": "Exclamation mark for written emphasis in supported text.",
  "-": "Hyphen or dash inside supported written text.",
  "@": "At sign for email-like or handle-style text.",
  ":": "Colon punctuation for labels and times.",
  ";": "Semicolon punctuation inside longer copied text.",
  "=": "Equals sign in written text. It also shares a pattern with the BT prosign.",
  "+": "Plus sign in written text. It also shares a pattern with the AR prosign.",
  '"': "Straight quotation mark. Curly quotes are not the same typed character.",
  "(": "Opening parenthesis. It has its own pattern.",
  ")": "Closing parenthesis. It differs from the opening parenthesis.",
  "&": "Ampersand symbol in supported copied text.",
  "_": "Underscore for filenames, handles, and code-like text.",
};

const symbolPathByCharacter = Object.values(SYMBOL_PAGES).reduce<
  Record<string, string>
>((paths, item) => {
  for (const character of item.plainTextValue) {
    if (TEXT_TO_MORSE[character]) paths[character] = item.path;
  }
  return paths;
}, {});

type ChartEntry = {
  actionName: string;
  cue: string;
  detailHref?: string;
  detailLabel: string;
  label: string;
  morse: string;
  rowId: string;
  sublabel: string;
};

function rhythmForPattern(pattern: string) {
  return pattern
    .split("")
    .map((mark, index, marks) => {
      if (mark === "-") return "dah";
      return index === marks.length - 1 ? "dit" : "di";
    })
    .join("-");
}

function queryHref(path: string, value: string) {
  return `${path}?text=${encodeToolQueryValue(value)}`;
}

const letterEntries: ChartEntry[] = LETTER_ITEMS.filter(
  (item) => item.isPublicLetter,
).map((item) => ({
  actionName: `letter ${item.letter}`,
  cue: item.spokenRhythm,
  detailHref: item.path,
  detailLabel: `Study ${item.letter}`,
  label: item.letter,
  morse: TEXT_TO_MORSE[item.letter] ?? item.morseValue,
  rowId: `letter-${item.letter}`,
  sublabel: `Letter ${item.letter}`,
}));

const numberEntries: ChartEntry[] = NUMBER_ITEMS.map((item) => ({
  actionName: `number ${item.digit}`,
  cue: item.spokenRhythm,
  detailHref: item.path,
  detailLabel: `Study ${item.digit}`,
  label: item.digit,
  morse: TEXT_TO_MORSE[item.digit] ?? item.morseValue,
  rowId: `number-${item.digit}`,
  sublabel: `Number ${item.digit}`,
}));

const punctuationEntries: ChartEntry[] = punctuationOrder.map((character) => ({
  actionName: punctuationNames[character].toLowerCase(),
  cue: punctuationNotes[character],
  detailHref: symbolPathByCharacter[character],
  detailLabel: `${punctuationNames[character]} details`,
  label: character,
  morse: TEXT_TO_MORSE[character],
  rowId: `punctuation-${punctuationNames[character]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`,
  sublabel: punctuationNames[character],
}));

const faqItems = [
  {
    q: "What does this Morse code chart include?",
    a: "This chart includes A-Z letters, 0-9 digits, supported punctuation and symbols, spacing guidance, and short notes about reference signals such as SOS, AR, SK, and BT.",
  },
  {
    q: "Is this different from the Morse code alphabet page?",
    a: "Yes. The alphabet page focuses on learning A-Z letters. This chart is a broader quick-reference hub for letters, numbers, punctuation, spacing, audio checks, and printable study.",
  },
  {
    q: "Can I copy and hear each chart entry?",
    a: "Yes. Each chart row has a copy action for the Morse pattern and a play action so you can check the rhythm before using the pattern elsewhere.",
  },
  {
    q: "Does the chart include every possible prosign?",
    a: "No. The prosign section is a short educational reference based on the existing MorseWords prosign data. It does not claim that the translator treats every prosign as a separate typed character.",
  },
  {
    q: "Should I use the printable chart instead?",
    a: "Use this page for quick on-screen lookup, copying, and listening. Use the printable chart when you need a worksheet, classroom handout, PDF, or image export.",
  },
  {
    q: "What should I do after using the chart?",
    a: "Use the audio tool to hear patterns, the encoder or decoder to check full messages, then move into practice or typing drills so the chart becomes recall.",
  },
];

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta() {
  return seoMeta({
    title: "Morse Code Chart | A-Z, Numbers, Punctuation, and Audio | MorseWords",
    description:
      "Use a complete International Morse code chart for A-Z letters, numbers, punctuation, copy and audio actions, and a printable chart reference.",
    path: CANONICAL_PATH,
    keywords:
      "morse code chart, morse code alphabet chart, morse code chart A-Z 0-9, international morse code chart",
  });
}

function ChartActions({ entry }: { entry: ChartEntry }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap md:justify-end">
      <CopyActionButton
        aria-label={`Copy Morse for ${entry.actionName}`}
        value={entry.morse}
        label="Copy"
        size="sm"
        resetDelayMs={900}
      />
      <ActionButton
        aria-label={`Play Morse for ${entry.actionName}`}
        size="sm"
        onClick={() => playMorsePattern(entry.morse)}
        leadingIcon={<PlayIcon size={16} title={undefined} aria-hidden="true" />}
      >
        Hear
      </ActionButton>
      {entry.detailHref ? (
        <ActionLinkButton
          href={entry.detailHref}
          size="sm"
          full
          className="col-span-2 sm:w-auto"
        >
          {entry.detailLabel}
        </ActionLinkButton>
      ) : null}
    </div>
  );
}

function ChartTable({
  entries,
  id,
  section,
  title,
}: {
  entries: ChartEntry[];
  id: string;
  section: "letters" | "numbers" | "punctuation";
  title: string;
}) {
  return (
    <div
      id={id}
      data-chart-section={section}
      className="mw-static-panel mw-reference-table overflow-hidden rounded-xl bg-[#fffdf8]"
    >
      <div className="mw-static-surface-soft mw-muted-label hidden bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 md:grid md:grid-cols-[minmax(110px,0.72fr)_minmax(110px,0.72fr)_minmax(0,1.4fr)_minmax(220px,1fr)]">
        <span>{title}</span>
        <span>Morse</span>
        <span>{section === "punctuation" ? "Use note" : "Spoken rhythm"}</span>
        <span className="text-right">Actions</span>
      </div>
      {entries.map((entry) => (
        <div
          key={entry.rowId}
          data-chart-row={entry.rowId}
          className="mw-reference-row grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[minmax(110px,0.72fr)_minmax(110px,0.72fr)_minmax(0,1.4fr)_minmax(220px,1fr)] md:items-center"
        >
          <div className="min-w-0">
            <p className="mw-heading text-2xl font-black leading-none text-sky-950">
              {entry.label}
            </p>
            <p className="mw-muted-label mt-1 font-mono text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
              {entry.sublabel}
            </p>
          </div>
          <p className="mw-input-text min-w-0 break-words font-mono text-lg font-bold tracking-[0.14em] text-slate-950">
            {entry.morse}
          </p>
          <p className="mw-text-muted max-w-[58ch] text-sm leading-relaxed text-slate-700">
            {entry.cue}
          </p>
          <ChartActions entry={entry} />
        </div>
      ))}
    </div>
  );
}

function TimingReference() {
  return (
    <SectionCard
      eyebrow="Spacing"
      title="Timing and spacing mini-reference"
      description="Morse is made from marks and gaps. The chart helps with patterns, but spacing is what keeps characters and words readable."
      layout="stacked"
    >
      <div className="mw-seo-section-with-rail">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Dot / dit",
              text: "The shortest sounded mark. It is one timing unit in standard explanations.",
            },
            {
              title: "Dash / dah",
              text: "A longer sounded mark, usually three dot units.",
            },
            {
              title: "Inside a character",
              text: "Dots and dashes inside one character are separated by a short one-unit gap.",
            },
            {
              title: "Between letters",
              text: "Letters need a longer gap so patterns do not merge into a different character.",
            },
            {
              title: "Between words",
              text: "Word gaps are longer again. In typed Morse, a slash often marks that word break.",
            },
            {
              title: "Slash convention",
              text: "Use / as a visible word separator when repeated spaces may be trimmed by apps.",
            },
          ].map((item) => (
            <StaticPanel as="article" key={item.title}>
              <h3 className="mw-heading text-lg font-extrabold text-sky-950">
                {item.title}
              </h3>
              <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                {item.text}
              </p>
            </StaticPanel>
          ))}
        </div>
        <SeoSectionRailAd />
      </div>
      <div className="mt-5">
        <ActionLinks
          links={[
            {
              href: "/morse-code-word-separator",
              label: "Word separator",
              primary: true,
              icon: <RulerIcon size={16} title={undefined} aria-hidden="true" />,
            },
            { href: "/space-in-morse-code", label: "Space guide" },
            { href: "/slash-in-morse-code", label: "Slash guide" },
            {
              href: "/how-to-separate-words-in-morse-code",
              label: "How to separate words",
            },
          ]}
        />
      </div>
    </SectionCard>
  );
}

function ProsignReference() {
  return (
    <SectionCard
      eyebrow="Reference signals"
      title="Prosigns and reference signals"
      description="Some named Morse signals are sent as run-together patterns. They are different from ordinary typed characters with normal letter spacing."
      layout="stacked"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(260px,0.28fr)]">
        <div className="mw-static-panel mw-reference-table overflow-hidden rounded-xl bg-[#fffdf8]">
          <div className="mw-static-surface-soft mw-muted-label grid grid-cols-[1fr_1fr] bg-[#fffaf2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500 sm:grid-cols-[120px_1fr_2fr]">
            <span>Signal</span>
            <span>Pattern</span>
            <span className="hidden sm:block">Use</span>
          </div>
          {PROSIGNS.slice(0, 6).map((item) => (
            <div
              key={item.label}
              className="mw-reference-row grid gap-3 px-4 py-4 even:bg-[#fffaf2] sm:grid-cols-[120px_1fr_2fr] sm:items-center"
            >
              <div>
                <p className="mw-heading font-bold text-sky-950">{item.label}</p>
                {item.example ? (
                  <p className="mw-muted-label mt-1 font-mono text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                    {item.example}
                  </p>
                ) : null}
              </div>
              <p className="mw-input-text font-mono text-base font-bold tracking-[0.14em] text-slate-950">
                {item.morse}
              </p>
              <p className="mw-text-muted text-sm leading-relaxed text-slate-700">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <StaticPanel as="aside">
          <h3 className="mw-heading text-lg font-extrabold text-sky-950">
            Important translator note
          </h3>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
            MorseWords can show these supported reference patterns, but typed
            labels such as AR, SK, or BT may encode as ordinary letters in text
            tools. Use the prosigns page when the run-together signal matters.
          </p>
          <div className="mt-4">
            <ActionLinks
              links={[
                { href: "/morse-code-prosigns", label: "Open prosigns", primary: true },
                { href: "/morse-code-sos", label: "SOS signal" },
                { href: "/cq-in-morse-code", label: "CQ reference" },
              ]}
            />
          </div>
        </StaticPanel>
      </div>
    </SectionCard>
  );
}

export default function MorseCodeChartRoute() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Chart",
        item: CANONICAL_URL,
      },
    ],
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Morse Code Chart",
    url: CANONICAL_URL,
    description:
      "A complete Morse code chart reference hub for A-Z letters, numbers, supported punctuation, spacing guidance, copy actions, audio checks, and printable chart next steps.",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
    hasPart: [
      { "@type": "WebPageElement", name: "A-Z Morse code chart" },
      { "@type": "WebPageElement", name: "0-9 Morse number chart" },
      { "@type": "WebPageElement", name: "Punctuation and symbols chart" },
      { "@type": "WebPageElement", name: "Timing and spacing mini-reference" },
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

  const jsonLd = [breadcrumbJsonLd, pageJsonLd, faqJsonLd];

  return (
    <div className="mw-non-home-page mw-wave-content-page" style={styles.page}>
      <main className={WAVE_PAGE_MAIN_CLASS}>
        <PageHero
          eyebrow="Complete quick reference"
          title="Morse Code Chart"
          description="Use one complete International Morse chart for A-Z letters, 0-9 numbers, supported punctuation, spacing notes, quick copy actions, and audio checks before moving into practice."
        >
          <ActionLinks
            layout="grid"
            className="grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]"
            links={[
              {
                href: "/",
                label: "Open translator",
                primary: true,
                icon: <CodeIcon size={16} title={undefined} aria-hidden="true" />,
              },
              {
                href: "/audio",
                label: "Open audio tool",
                icon: <HeadphonesIcon size={16} title={undefined} aria-hidden="true" />,
              },
              {
                href: "/morse-code-printable-chart",
                label: "Print/download chart",
                icon: <PrintIcon size={16} title={undefined} aria-hidden="true" />,
              },
            ]}
          />
        </PageHero>

        <nav
          aria-label="Morse chart sections"
          className="mt-3"
        >
          <ActionLinks
            layout="grid"
            className="grid-cols-[repeat(auto-fit,minmax(10.5rem,1fr))]"
            links={[
              { href: "#letters", label: "Letters A-Z", primary: true },
              { href: "#numbers", label: "Numbers 0-9" },
              { href: "#punctuation", label: "Punctuation" },
              { href: "#reference-signals", label: "Prosigns / reference signals" },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
            ]}
          />
        </nav>

        <SectionCard
          eyebrow="Letters"
          title="A-Z Morse code chart"
          description="Scan the complete letter chart, copy any pattern, hear it, then open the individual letter page when you want examples or practice notes."
          layout="stacked"
        >
          <ChartTable
            id="letters"
            section="letters"
            title="Letter"
            entries={letterEntries}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Numbers"
          title="0-9 Morse number chart"
          description="Every Morse digit has five marks. Use the chart to compare number shape, copy patterns, and hear each digit before using it in dates, counts, and codes."
          layout="stacked"
        >
          <ChartTable
            id="numbers"
            section="numbers"
            title="Digit"
            entries={numberEntries}
          />
        </SectionCard>

        <SectionCard
          eyebrow="Symbols"
          title="Punctuation and symbols chart"
          description="These punctuation entries come from the same supported Morse map used by the translator, decoder, audio, and printable tools."
          layout="stacked"
        >
          <ChartTable
            id="punctuation"
            section="punctuation"
            title="Symbol"
            entries={punctuationEntries}
          />
        </SectionCard>

        <div id="reference-signals">
          <ProsignReference />
        </div>

        <TimingReference />

        <SectionCard
          eyebrow="Use the chart"
          title="How to use this chart"
          description="The chart is for fast lookup, but Morse becomes useful when you copy carefully, listen to rhythm, then practice recall."
          layout="stacked"
        >
          <SimpleGrid
            linkedItemStyle="inline"
            items={[
              {
                title: "Quick lookup",
                text: "Use the A-Z, 0-9, and punctuation sections when you need one broad chart instead of a focused letter, number, or symbol page.",
                href: "/morse-code-alphabet",
                badge: "Letters",
              },
              {
                title: "Learn by rhythm",
                text: "Dots and dashes are easier to remember when you also hear dit and dah rhythm, so use the hear actions before memorizing visually.",
                href: "/audio",
                badge: "Audio",
              },
              {
                title: "Copy safely",
                text: "Use plain periods, hyphens, spaces, and slashes when copying Morse into messages, worksheets, or puzzle tools.",
                href: "/copy-and-paste-morse-code",
                badge: "Copy",
              },
              {
                title: "Print when the chart leaves the screen",
                text: "Use the printable chart for class handouts, PDFs, worksheets, and offline study instead of copying this page manually.",
                href: "/morse-code-printable-chart",
                badge: "Print",
              },
              {
                title: "Check complete messages",
                text: "Use the encoder for normal text, the decoder for separated Morse, and the chart when you need to verify one character at a time.",
                href: "/morse-code-encoder",
                badge: "Tools",
              },
              {
                title: "Move into practice",
                text: "After lookup, use practice or typing mode so the chart becomes short-session recall rather than a passive table.",
                href: "/practice",
                badge: "Recall",
              },
            ]}
          />
          <div className="mt-5">
            <ActionLinks
              links={[
                { href: "/morse-code-alphabet", label: "Alphabet hub", primary: true },
                { href: "/morse-code-numbers", label: "Number hub" },
                { href: "/morse-code-punctuation", label: "Punctuation hub" },
                { href: "/morse-code-by-language", label: "Morse by language" },
                { href: "/morse-code-decoder", label: "Decoder" },
                { href: "/typing", label: "Typing practice" },
              ]}
            />
          </div>
        </SectionCard>

        <section className="mt-10 sm:mt-12">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Letters are shortest for memorizing",
                text: "Use the alphabet page when you want letter-specific learning notes and comparisons instead of one broad chart.",
                href: "/morse-code-alphabet",
                label: "Open alphabet",
              },
              {
                title: "Numbers follow a five-mark system",
                text: "Use the number page when you want the 0-9 pattern logic and number-only examples.",
                href: "/morse-code-numbers",
                label: "Open numbers",
              },
              {
                title: "Punctuation needs extra care",
                text: "Use the punctuation page when a copied sentence includes symbols or when slash may mean separator instead of punctuation.",
                href: "/morse-code-punctuation",
                label: "Open punctuation",
              },
            ].map((item) => (
              <StaticPanel as="article" key={item.title}>
                <h2 className="mw-heading text-xl font-extrabold text-sky-950">
                  {item.title}
                </h2>
                <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
                  {item.text}
                </p>
                <div className="mt-4">
                  <ActionLinkButton
                    href={item.href}
                    size="sm"
                    leadingIcon={<ListIcon size={16} title={undefined} aria-hidden="true" />}
                  >
                    {item.label}
                  </ActionLinkButton>
                </div>
              </StaticPanel>
            ))}
          </div>
        </section>

        <div id="faq">
          <FaqSectionGeneric title="Morse code chart FAQ" items={faqItems} />
        </div>

        <JsonLdScript jsonLd={jsonLd} />
        <BreadcrumbTrail current="Morse Code Chart" placement="contentFooter" />
      </main>
    </div>
  );
}
