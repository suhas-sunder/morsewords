import type { Route } from "./+types/farnsworth-timing";

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

const CANONICAL_PATH = ROUTES.farnsworth;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Farnsworth Timing | Character Speed vs Effective WPM | MorseWords",
    description:
      "Learn how Farnsworth timing separates character speed from effective speed and why wider spacing can help Morse learners.",
    path: CANONICAL_PATH,
    keywords:
      "Farnsworth timing, Morse code Farnsworth, character speed, effective WPM, Morse audio practice",
  });
}

const faqItems = [
  {
    q: "What is Farnsworth timing?",
    a: "Farnsworth timing sends each character at a set character speed, then adds extra spacing between characters and words to lower the effective message speed.",
  },
  {
    q: "Is Farnsworth timing easier for beginners?",
    a: "It can be. Learners hear realistic character shapes while the wider gaps give more time to recognize each character.",
  },
  {
    q: "What is the difference between character speed and effective speed?",
    a: "Character speed controls the internal rhythm of each letter. Effective speed describes how fast the full message feels after extra spacing is added.",
  },
  {
    q: "Should effective WPM be lower than character WPM?",
    a: "For Farnsworth practice, yes. Effective WPM is usually lower than character WPM so the characters keep their shape while the gaps give you more thinking time.",
  },
  {
    q: "What happens if effective WPM equals character WPM?",
    a: "Then there is no extra Farnsworth spacing. The message uses normal timing for that character speed.",
  },
  {
    q: "When should I stop using Farnsworth spacing?",
    a: "Reduce the extra spacing gradually when recognition improves. Keep the character speed stable while raising the effective speed.",
  },
  {
    q: "Does Farnsworth change the actual dot-dash pattern?",
    a: "No. The dots, dashes, and character patterns stay the same. Farnsworth changes only the gaps between characters and words.",
  },
  {
    q: "Does lower Farnsworth WPM make audio exports longer?",
    a: "Yes. Lower effective WPM adds more silence between characters and words, so the same text takes longer to play and creates a longer export.",
  },
  {
    q: "Does pitch affect Farnsworth timing?",
    a: "No. Pitch changes the tone frequency you hear. Farnsworth timing is about character speed and spacing.",
  },
  {
    q: "Can an audio decoder read Farnsworth-style Morse?",
    a: "A decoder can work better when the signal has clean tones and clear gaps, but noisy recordings and inconsistent spacing can still make automatic decoding unreliable.",
  },
];

const farnsworthSettingItems = [
  {
    title: "Character speed",
    text: "Character speed sets dot length, dash length, and the gaps inside each character. It keeps the letter sound realistic.",
    href: ROUTES.timing,
    badge: "Timing",
  },
  {
    title: "Effective speed",
    text: "Effective speed describes the whole message after extra letter and word spacing is included.",
    href: ROUTES.audio,
    badge: "Audio",
  },
  {
    title: "Export duration",
    text: "Lower effective WPM creates more silence, so MP3, WAV, book audio, and video exports get longer.",
    href: ROUTES.mp3Generator,
    badge: "Export",
  },
  {
    title: "Tone controls",
    text: "Pitch, tone preset, volume, attack, and release change listening comfort. They do not change Farnsworth spacing.",
    href: ROUTES.soundGenerator,
    badge: "Tone",
  },
  {
    title: "Practice pressure",
    text: "Use wider gaps when recognition is new, then raise effective speed as copying becomes more automatic.",
    href: ROUTES.audioPractice,
    badge: "Practice",
  },
  {
    title: "Decoder expectations",
    text: "Clear Farnsworth gaps can help boundaries, but an uploaded recording still needs clean audio for reliable decoding.",
    href: ROUTES.audioDecoder,
    badge: "Decode",
  },
];

const farnsworthExamples = [
  {
    setup: "18 / 12 WPM",
    label: "Common learner split",
    note: "Characters sound crisp while the wider gaps lower the full message pace.",
  },
  {
    setup: "15 / 10 WPM",
    label: "More room to copy",
    note: "Useful when early listening practice needs clear character shapes and extra time.",
  },
  {
    setup: "20 / 15 WPM",
    label: "Tighter practice",
    note: "A smaller gap between character and effective speed keeps pressure higher.",
  },
  {
    setup: "18 / 18 WPM",
    label: "No extra spacing",
    note: "When effective speed catches character speed, Farnsworth spacing is no longer added.",
  },
];

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
    headline: "Farnsworth Timing",
    url: CANONICAL_URL,
    mainEntityOfPage: CANONICAL_URL,
    description:
      "Guide to Farnsworth timing, character speed, effective speed, widened spacing, learner audio practice, duration, and export settings.",
    about: ["Farnsworth timing", "Morse code", "character speed", "effective WPM"],
    mentions: [
      "Morse code timing",
      "Morse audio export",
      "Morse code duration",
      "MP3 Morse audio",
      "Audio decoding",
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
          description="Learn why Morse learners often keep character speed crisp while widening the spaces between characters and words. Use this page when effective speed and character speed are the confusing part."
          aside={
            <DarkNote label="Example setup" value="18 / 12 WPM">
              Characters can sound like 18 WPM while the full message feels
              closer to 12 WPM because the gaps are longer.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: ROUTES.audio, label: "Open audio generator", primary: true },
              { href: ROUTES.soundGenerator, label: "Shape a tone" },
              { href: ROUTES.mp3Generator, label: "Export audio" },
              { href: ROUTES.bookTranslator, label: "Long text audio" },
              { href: ROUTES.videoGenerator, label: "Video timing" },
              { href: ROUTES.audioPractice, label: "Audio practice" },
              { href: ROUTES.timing, label: "Standard timing" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Quick answer"
          title="Farnsworth keeps characters fast and spaces slower"
          description="Use Farnsworth when correct character shapes matter, but the full message still needs breathing room."
          layout="stacked"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(280px,0.42fr)] lg:items-start">
            <div className="space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p className="mw-text-muted">
                Character speed controls the dot, dash, and inside-character
                rhythm. Effective speed controls how fast the whole message
                feels after the gaps between characters and words are widened.
              </p>
              <p className="mw-text-muted">
                That is why an 18 / 12 WPM setup can sound like clean 18 WPM
                characters while giving the learner a slower 12 WPM message
                pace.
              </p>
              <p className="mw-text-muted">
                If you only need the base dot, dash, letter-gap, and word-gap
                ratios, start with the{" "}
                <a
                  href={ROUTES.timing}
                  className="cursor-pointer font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  standard timing guide
                </a>
                .
              </p>
            </div>
            <StaticCodeBlock aria-label="Farnsworth timing quick example">
              {"Character speed = dot/dash rhythm\nEffective speed = full message pace\n18 / 12 WPM = crisp characters, wider gaps\n18 / 18 WPM = no extra Farnsworth spacing"}
            </StaticCodeBlock>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Settings"
          title="How Farnsworth settings affect audio and exports"
          description="Character speed, effective speed, tone, and export format each answer a different question."
        >
          <SimpleGrid items={farnsworthSettingItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Examples"
          title="Example Farnsworth WPM pairs"
          description="These are practical examples, not official milestones. Adjust one value at a time so you know what changed."
        >
          <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
            {farnsworthExamples.map((item) => (
              <div
                key={item.setup}
                className="grid gap-3 px-4 py-4 even:bg-[#fffaf2] md:grid-cols-[150px_220px_1fr]"
              >
                <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  {item.setup}
                </p>
                <p className="font-extrabold text-sky-950">{item.label}</p>
                <p className="text-base leading-relaxed text-slate-700">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <ReferenceSupportSections
          guide={{
            eyebrow: "Farnsworth guide",
            title: "How Farnsworth timing helps learners",
            description:
              "Use Farnsworth timing when you want realistic character sounds without forcing the full message to arrive too quickly.",
            items: [
              {
                title: "Who it is for",
                text: "Learners practicing by ear, especially when characters sound recognizable but the full message still feels too fast.",
              },
              {
                title: "What it changes",
                text: "Farnsworth widens the spaces between characters and words. It does not change the dot-dash pattern inside each character.",
              },
              {
                title: "How to apply it",
                text: "Choose a character speed that sounds clean, lower the effective speed for wider gaps, then tighten the gaps over time.",
              },
              {
                title: "Where it appears",
                text: "MorseWords audio, MP3, book, video, visual, and practice tools use Farnsworth spacing where timing controls are available.",
                href: ROUTES.audio,
                badge: "Tools",
              },
              {
                title: "How it affects duration",
                text: "Lower effective speed means more silence between characters and words, so playback and exports take longer.",
                href: ROUTES.mp3Generator,
                badge: "Duration",
              },
              {
                title: "How to review it",
                text: "Use short listening sessions, then raise effective speed as your copy becomes cleaner.",
                href: ROUTES.practicePlan,
                badge: "Plan",
              },
            ],
          }}
          examples={{
            title: "Worked Farnsworth examples",
            description:
              "These scenarios show why character speed and effective speed are separate settings.",
            items: [
              {
                title: "Fast characters, slower spacing",
                morse: "18 WPM chars / 12 WPM effective",
                children: (
                  <p>
                    Each character keeps a crisp rhythm, but the longer gaps
                    give you more time before the next character arrives.
                  </p>
                ),
              },
              {
                title: "Effective WPM",
                morse: "Message feels slower",
                children: (
                  <p>
                    Effective speed describes the whole message pace after the
                    extra gaps are included.
                  </p>
                ),
              },
              {
                title: "Export length",
                morse: "Lower effective WPM = longer file",
                children: (
                  <p>
                    Extra silence is part of the rendered signal. Audio and
                    video exports keep that spacing, so runtime increases.
                  </p>
                ),
              },
              {
                title: "Reducing spacing",
                morse: "12 -> 15 -> 18 WPM effective",
                children: (
                  <p>
                    As recognition improves, raise the effective speed first.
                    Keep character speed stable so the sounds stay familiar.
                  </p>
                ),
              },
            ],
          }}
          mistakes={{
            title: "Common Farnsworth mistakes",
            description:
              "Farnsworth is useful when applied deliberately. It becomes confusing when speed settings are mixed up.",
            items: [
              {
                title: "Slowing characters too much",
                children: (
                  <p>
                    If characters become too slow, you may start counting dits
                    and dahs instead of hearing the pattern as one sound.
                  </p>
                ),
              },
              {
                title: "Never tightening gaps",
                children: (
                  <p>
                    Extra spacing is a bridge. Reduce it gradually as copy gets
                    more comfortable.
                  </p>
                ),
              },
              {
                title: "Using pitch as a timing fix",
                children: (
                  <p>
                    Pitch can make a tone easier to hear, but it will not slow
                    the message. Use character speed and Farnsworth spacing for
                    timing.
                  </p>
                ),
              },
              {
                title: "Confusing it with standard timing",
                children: (
                  <p>
                    Use the{" "}
                    <a
                      href={ROUTES.timing}
                      className="cursor-pointer font-semibold text-sky-900 underline hover:no-underline"
                    >
                      standard timing page
                    </a>{" "}
                    for dot, dash, and gap ratios before adding Farnsworth.
                  </p>
                ),
              },
            ],
          }}
          comparison={{
            eyebrow: "Choose a timing page",
            title: "Farnsworth vs standard timing",
            description:
              "Both pages discuss spacing, but they answer different questions.",
            items: [
              {
                title: "Farnsworth timing",
                text: "Use this page when character speed and effective speed are intentionally different.",
                href: ROUTES.farnsworth,
                badge: "Learner",
              },
              {
                title: "Morse Code Timing",
                text: "Use the standard timing page for dot, dash, letter gap, word gap, and WPM ratios.",
                href: ROUTES.timing,
                badge: "Standard",
              },
              {
                title: "Audio practice",
                text: "Use audio practice when you want answer checking with listening settings.",
                href: ROUTES.audioPractice,
                badge: "Practice",
              },
              {
                title: "MP3 generator",
                text: "Use the MP3 generator when a Farnsworth setup needs to become a downloadable practice file.",
                href: ROUTES.mp3Generator,
                badge: "Export",
              },
            ],
          }}
          nextStep={{
            title: "Best next step after Farnsworth",
            description:
              "Test the concept with a short message and adjust only one setting at a time.",
            links: [
              { href: ROUTES.audio, label: "Try audio settings", primary: true },
              { href: ROUTES.soundGenerator, label: "Shape sound timing" },
              { href: ROUTES.mp3Generator, label: "Export MP3/WAV" },
              { href: ROUTES.bookTranslator, label: "Long text export" },
              { href: ROUTES.videoGenerator, label: "Video timing" },
              { href: ROUTES.audioPractice, label: "Practice by ear" },
              { href: ROUTES.audioDecoder, label: "Decode audio" },
              { href: ROUTES.learn, label: "Learning path" },
              { href: ROUTES.practicePlan, label: "Practice routine" },
              { href: ROUTES.timing, label: "Timing ratios" },
            ],
          }}
        />

        <div id="faq">
          <FaqSectionGeneric
            title="Farnsworth FAQ"
            description="Quick answers for character speed, effective WPM, duration, audio exports, and when to tighten spacing."
            items={faqItems}
          />
        </div>

        <JsonLdScript jsonLd={jsonLd} />
      </main>
      <BreadcrumbTrail current="Farnsworth Timing" />
    </div>
  );
}
