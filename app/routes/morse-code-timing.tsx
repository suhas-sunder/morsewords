import type { Route } from "./+types/morse-code-timing";

import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
  SimpleGrid,
  StaticCodeBlock,
} from "~/client/components/shared/MorseLearningLayout";
import ReferenceSupportSections from "~/client/components/shared/ReferenceSupportSections";
import { ROUTES } from "~/client/data/routes";
import styles from "~/client/components/shared/pageStyles";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";
import BreadcrumbTrail from "~/client/components/shared/BreadcrumbTrail";

const CANONICAL_PATH = ROUTES.timing;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Timing | Dots, Dashes, Spacing, and WPM | MorseWords",
    description:
      "Understand Morse code timing, including dot and dash length, letter gaps, word gaps, WPM, and common spacing mistakes.",
    path: CANONICAL_PATH,
    keywords:
      "morse code timing, morse code wpm, dot dash timing, morse code spacing, PARIS standard morse",
  });
}

const faqItems = [
  {
    q: "How long is a dash compared with a dot?",
    a: "A dash is three dot units. If the dot unit is 60 milliseconds, the dash is 180 milliseconds.",
  },
  {
    q: "How do I calculate Morse dot length from WPM?",
    a: "A common PARIS timing rule is dot length in milliseconds equals 1200 divided by WPM. At 20 WPM, one dot is about 60 milliseconds.",
  },
  {
    q: "How many spaces go between Morse letters?",
    a: "The standard letter gap is three dot units. MorseWords represents that gap with 3 spaces in copied Morse text.",
  },
  {
    q: "How many spaces go between Morse words?",
    a: "The standard word gap is seven dot units. MorseWords represents that gap with 7 spaces or, in some tools, a visible slash separator.",
  },
  {
    q: "What does the PARIS standard mean for Morse speed?",
    a: "PARIS is a standard reference word used to define Morse WPM. It keeps speed comparisons consistent because dots, dashes, letter gaps, and word gaps are counted with fixed ratios.",
  },
  {
    q: "Is timing the same as Farnsworth timing?",
    a: "No. This page explains standard timing ratios. Farnsworth timing keeps characters crisp while widening the gaps between characters and words for learners.",
  },
  {
    q: "What do character WPM and Farnsworth WPM control?",
    a: "Character WPM controls dot, dash, and inside-character timing. Farnsworth WPM, when lower than character WPM, widens the gaps between characters and words.",
  },
  {
    q: "Does pitch change Morse timing?",
    a: "No. Pitch changes how high or low the tone sounds. Timing is controlled by WPM, spacing, and Farnsworth settings.",
  },
  {
    q: "Why does lower Farnsworth spacing make exports longer?",
    a: "Lower Farnsworth WPM adds extra silence between characters and words, so the same message takes longer to play and produces a longer audio or video export.",
  },
  {
    q: "Why does incorrect spacing make decoding fail?",
    a: "Morse decoders need boundaries. If the letter or word gaps are missing, the same dot-dash stream can be split into different possible characters.",
  },
];

const timingRows = [
  {
    name: "Dot",
    units: "1 unit",
    example: "60 ms at 20 WPM",
    note: "The shortest signal and the base unit for the rest of the timing.",
  },
  {
    name: "Dash",
    units: "3 units",
    example: "180 ms at 20 WPM",
    note: "Three times as long as a dot, without changing pitch or volume.",
  },
  {
    name: "Inside a character",
    units: "1 unit gap",
    example: "60 ms at 20 WPM",
    note: "The silence between dots and dashes inside one letter.",
  },
  {
    name: "Between letters",
    units: "3 units",
    example: "180 ms at 20 WPM",
    note: "The silence after a complete character before the next one starts.",
  },
  {
    name: "Between words",
    units: "7 units",
    example: "420 ms at 20 WPM",
    note: "The longer silence that separates words in timed Morse audio.",
  },
];

const timingSettingItems = [
  {
    title: "Character WPM",
    text: "WPM changes the unit length. Faster WPM shortens dots, dashes, and standard gaps; slower WPM lengthens the whole message.",
    href: ROUTES.audio,
    badge: "Speed",
  },
  {
    title: "Farnsworth WPM",
    text: "When Farnsworth WPM is lower than character WPM, dots and dashes stay crisp while letter and word gaps get wider.",
    href: ROUTES.farnsworth,
    badge: "Spacing",
  },
  {
    title: "Duration estimates",
    text: "Playback time comes from every mark and every gap. Long text, slow speed, and extra spacing all add real runtime.",
    href: ROUTES.bookTranslator,
    badge: "Duration",
  },
  {
    title: "Pitch and tone",
    text: "Pitch, tone preset, volume, attack, and release change how the signal sounds, not the dot-dash timing rules.",
    href: ROUTES.soundGenerator,
    badge: "Tone",
  },
  {
    title: "MP3 and WAV export",
    text: "Audio downloads use the selected timing settings. Lower speed or lower Farnsworth WPM usually creates a longer file.",
    href: ROUTES.mp3Generator,
    badge: "Export",
  },
  {
    title: "Video and flash timing",
    text: "Visual exports and flash practice follow the same timing idea: character speed sets marks, spacing controls pauses.",
    href: ROUTES.videoGenerator,
    badge: "Visual",
  },
];

export default function MorseCodeTiming() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Timing",
        item: CANONICAL_URL,
      },
    ],
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${CANONICAL_URL}#article`,
    name: "Morse Code Timing",
    headline: "Morse Code Timing",
    url: CANONICAL_URL,
    mainEntityOfPage: CANONICAL_URL,
    description:
      "Technical guide to Morse code timing units, dots, dashes, element gaps, letter gaps, word gaps, WPM, Farnsworth spacing, duration, and export settings.",
    about: ["Morse code", "WPM", "PARIS standard", "letter gaps", "word gaps"],
    mentions: [
      "Farnsworth timing",
      "Morse code duration",
      "Morse audio export",
      "MP3 Morse audio",
      "Morse video timing",
    ],
    educationalUse: "Morse code learning and audio timing reference",
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
          eyebrow="Timing reference"
          title="Morse Code Timing"
          description="Understand the standard Morse timing ratios behind dots, dashes, letter gaps, word gaps, and WPM. Use this page when spacing or speed is the problem."
          aside={
            <DarkNote label="Standard rhythm" value="1 : 3 : 7">
              A dot is 1 unit, a dash is 3 units, and a word gap is 7
              units. Speed changes the unit length, not the ratio.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: ROUTES.farnsworth, label: "Farnsworth timing", primary: true },
              { href: ROUTES.wordSeparator, label: "Spacing guide" },
              { href: ROUTES.audio, label: "Try audio timing" },
              { href: ROUTES.soundGenerator, label: "Shape a tone" },
              { href: ROUTES.mp3Generator, label: "Export audio" },
              { href: ROUTES.bookTranslator, label: "Long text timing" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Quick answer"
          title="Morse timing is measured in units"
          description="The message speed changes how long one unit lasts. The ratios stay the same unless you intentionally add Farnsworth spacing."
          layout="stacked"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(280px,0.42fr)] lg:items-start">
            <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p className="mw-text-muted">
                Standard International Morse timing uses one dot as the base
                unit. A dash lasts three units, a letter gap lasts three units,
                and a word gap lasts seven units.
              </p>
              <p className="mw-text-muted">
                In the audio tools, WPM changes the unit length. Farnsworth
                spacing can then widen the gaps between characters and words
                without changing the shape of each character.
              </p>
              <p className="mw-text-muted">
                For written Morse, the same idea becomes visible spacing. Use
                the{" "}
                <a
                  href={ROUTES.wordSeparator}
                  className="cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  word separator guide
                </a>{" "}
                when a timed word gap needs to become a readable slash or wider
                copied space.
              </p>
            </div>
            <StaticCodeBlock aria-label="Morse timing quick formula">
              {"Dot unit = 1200 / WPM\n20 WPM dot = 60 ms\nDash = 3 dot units\nLetter gap = 3 dot units\nWord gap = 7 dot units"}
            </StaticCodeBlock>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Unit rules"
          title="The basic Morse timing ratios"
          description="International Morse timing uses fixed proportions. WPM changes how long one unit lasts, but these relationships stay the same."
        >
          <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
            {timingRows.map(({ name, units, example, note }) => (
              <div
                key={name}
                className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[160px_140px_160px_1fr]"
              >
                <p className="font-extrabold text-sky-950">{name}</p>
                <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  {units}
                </p>
                <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  {example}
                </p>
                <p className="text-base leading-relaxed text-slate-700">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Settings"
          title="Speed, duration, and export settings"
          description="Use timing settings for pace and spacing. Use tone settings for sound color. Use export settings for the downloaded file."
        >
          <SimpleGrid items={timingSettingItems} linkedItemStyle="inline" />
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Timing guide",
            title: "How to apply Morse timing",
            description:
              "Use standard timing when you need to understand speed, spacing, decoding errors, or audio settings.",
            items: [
              {
                title: "Who it is for",
                text: "Learners, teachers, and tool users who need to understand why Morse spacing, WPM, and export duration change the result.",
              },
              {
                title: "What it helps you do",
                text: "Connect dots, dashes, letter gaps, word gaps, and WPM to the visible Morse text used across the site.",
              },
              {
                title: "How to use it",
                text: "Check the ratio table, then test the same message in the audio tools, export tools, or word separator page.",
              },
              {
                title: "When audio sounds cramped",
                text: "Keep the character speed readable, then add Farnsworth spacing if the next character arrives before you can copy it.",
                href: ROUTES.farnsworth,
                badge: "Farnsworth",
              },
              {
                title: "When text spacing breaks",
                text: "Normalize copied Morse with visible letter spaces and word separators before trying to decode it as text.",
                href: ROUTES.wordSeparator,
                badge: "Text",
              },
              {
                title: "When exports feel too long",
                text: "Check speed, Farnsworth spacing, and message length. Timing changes runtime before bitrate or format changes file size.",
                href: ROUTES.mp3Generator,
                badge: "Export",
              },
            ],
          }}
          examples={{
            title: "Worked timing examples",
            description:
              "These examples show how the unit rules explain real output.",
            items: [
              {
                title: "Dot vs dash",
                morse: ". = 1 unit     - = 3 units",
                children: (
                  <p>
                    A dash lasts three times as long as a dot. The character
                    pattern changes if you shorten a dash into a dot-length
                    signal.
                  </p>
                ),
              },
              {
                title: "Letter and word gaps",
                morse: "A Z     .-   --..",
                children: (
                  <p>
                    A letter gap separates completed characters. A word gap is
                    longer, which is why copied Morse needs clear spacing.
                  </p>
                ),
              },
              {
                title: "WPM effect",
                morse: "10 WPM -> slower units",
                children: (
                  <p>
                    Higher WPM shortens every timing unit. It does not change
                    the dot-dash pattern, only how quickly the pattern is sent.
                  </p>
                ),
              },
              {
                title: "Export duration",
                morse: "18/12 WPM -> longer gaps",
                children: (
                  <p>
                    Lower Farnsworth spacing adds silence between characters
                    and words, so the same message creates a longer audio or
                    video export.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common timing mistakes",
            description:
              "Timing mistakes usually look like spacing or decoding mistakes once Morse is copied as text.",
            items: [
              {
                title: "Counting one space as a word",
                children: (
                  <p>
                    A letter gap and a word gap are different. Use the{" "}
                    <a
                      href={ROUTES.wordSeparator}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      word separator
                    </a>{" "}
                    if copied text collapses the gap.
                  </p>
                ),
              },
              {
                title: "Changing pitch for speed",
                children: (
                  <p>
                    Pitch changes the tone you hear. WPM changes how long each
                    timing unit lasts.
                  </p>
                ),
              },
              {
                title: "Blaming bitrate for runtime",
                children: (
                  <p>
                    Bitrate changes MP3 size and quality. It does not shorten
                    the Morse message. Adjust WPM or spacing when runtime is
                    the issue.
                  </p>
                ),
              },
              {
                title: "Using Farnsworth by accident",
                children: (
                  <p>
                    Farnsworth timing intentionally widens gaps. Use the{" "}
                    <a
                      href={ROUTES.farnsworth}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      Farnsworth guide
                    </a>{" "}
                    when character speed and effective speed differ.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a timing page",
            title: "Timing vs Farnsworth timing",
            description:
              "Use the standard timing page for baseline rules and Farnsworth when learner spacing is intentional.",
            items: [
              {
                title: "Morse Code Timing",
                text: "Use this page for dot, dash, letter gap, word gap, and WPM rules.",
                href: ROUTES.timing,
                badge: "Standard",
              },
              {
                title: "Farnsworth timing",
                text: "Use Farnsworth when characters stay fast but the spaces are widened for learning.",
                href: ROUTES.farnsworth,
                badge: "Learner",
              },
              {
                title: "Word separator",
                text: "Use the separator page when timing gaps need to become clean copied text.",
                href: ROUTES.wordSeparator,
                badge: "Spacing",
              },
              {
                title: "MP3 generator",
                text: "Use the MP3 generator when timing choices need to become a downloadable audio file.",
                href: ROUTES.mp3Generator,
                badge: "Export",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after timing",
            description:
              "Apply the timing rules in a tool where you can hear or clean up the result.",
            links: [
              { href: ROUTES.audio, label: "Try audio timing", primary: true },
              { href: ROUTES.soundGenerator, label: "Shape sound timing" },
              { href: ROUTES.mp3Generator, label: "Export MP3/WAV" },
              { href: ROUTES.bookTranslator, label: "Long text export" },
              { href: ROUTES.videoGenerator, label: "Video timing" },
              { href: ROUTES.audioPractice, label: "Audio practice" },
              { href: ROUTES.audioDecoder, label: "Decode audio" },
              { href: ROUTES.decoder, label: "Decode spaced Morse" },
              { href: ROUTES.farnsworth, label: "Learn Farnsworth" },
            ],
          }}
        />

        <div id="faq">
          <FaqSectionGeneric
            title="Timing FAQ"
            description="Quick answers for Morse speed, spacing, Farnsworth WPM, duration, and audio export settings."
            items={faqItems}
          />
        </div>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Morse Code Timing" />
    </div>
  );
}
