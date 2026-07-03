import type { ReactNode } from "react";
import type { Route } from "./+types/morse-code-emergency-signals";

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

const CANONICAL_PATH = ROUTES.emergencySignals;
const CANONICAL_URL = canonicalUrl(CANONICAL_PATH);

export function links() {
  return [{ rel: "canonical", href: CANONICAL_URL }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Emergency Signals | SOS and Backup Signaling | MorseWords",
    description:
      "Learn how SOS and simple Morse signals can work as backup communication, what they can and cannot do, and how to practice safely.",
    path: CANONICAL_PATH,
    keywords:
      "morse code emergency signals, sos morse code, morse distress signal, emergency morse code, backup signaling",
  });
}

const shortAnswerItems = [
  {
    title: "SOS is ... --- ...",
    text: "The familiar pattern is three short signals, three long signals, and three short signals.",
    badge: "Pattern",
  },
  {
    title: "It can be sent by timing",
    text: "Sound, light, tapping, or another clear on/off signal can carry the pattern when someone nearby can notice it.",
    badge: "Signal",
  },
  {
    title: "It is only a backup",
    text: "Use official emergency contact methods first whenever they are available. Morse is not a full emergency plan.",
    badge: "Safety",
  },
];

const sosPulses = [
  { label: "short", widthClass: "w-5" },
  { label: "short", widthClass: "w-5" },
  { label: "short", widthClass: "w-5" },
  { label: "long", widthClass: "w-16" },
  { label: "long", widthClass: "w-16" },
  { label: "long", widthClass: "w-16" },
  { label: "short", widthClass: "w-5" },
  { label: "short", widthClass: "w-5" },
  { label: "short", widthClass: "w-5" },
];

const signalMethods = [
  {
    title: "Sound or tapping",
    text: "Use a clear short-long rhythm only as a backup signal, and only when it does not delay official contact.",
  },
  {
    title: "Flashlight or lamp",
    text: "A visible on/off light can carry SOS, but it still depends on someone noticing and understanding the pattern.",
  },
  {
    title: "Whistle or horn",
    text: "Short and long blasts can be recognizable in some settings, but do not rely on them as the only plan.",
  },
  {
    title: "Radio/CW context",
    text: "CW belongs in a proper radio operating or training context. This page is not a radio distress-procedure guide.",
  },
  {
    title: "Written Morse",
    text: "Writing SOS or ... --- ... can help when someone is already reading the message or sign.",
  },
];

const canItems = [
  "Send a short recognizable distress pattern.",
  "Communicate when speech is hard to hear.",
  "Mark a simple message with limited tools.",
];

const cannotItems = [
  "Guarantee that someone will see or hear it.",
  "Guarantee that the receiver understands Morse.",
  "Replace calling emergency services or using official distress equipment.",
];

const mythItems = [
  {
    title: "SOS is not literally an abbreviation",
    text: "Save Our Ship and Save Our Souls are common memory aids. The signal is best treated as a clear distress pattern.",
    href: ROUTES.sos,
  },
  {
    title: "SOS is not the only Morse message",
    text: "It is the best-known distress pattern, but short plain words such as HELP can also be written or translated.",
    href: ROUTES.help,
  },
  {
    title: "Morse is not only a chart",
    text: "The same short and long marks can be heard, seen, tapped, written, or practiced by timing.",
    href: ROUTES.timing,
  },
];

const practiceItems = [
  {
    title: "Learn the SOS pattern",
    text: "Use the focused SOS page for the written pattern, continuous signal form, and common meaning notes.",
    href: ROUTES.sos,
    badge: "SOS",
  },
  {
    title: "Practice by sound",
    text: "Use listening practice to recognize short and long signals without pretending the drill is an emergency.",
    href: ROUTES.audioPractice,
    badge: "Listen",
  },
  {
    title: "Review spacing",
    text: "Use the timing guide to understand dot length, dash length, letter gaps, and word gaps.",
    href: ROUTES.timing,
    badge: "Timing",
  },
  {
    title: "Learn the basics",
    text: "Use the beginner guide when you want a calmer path from first characters into practice tools.",
    href: ROUTES.learn,
    badge: "Guide",
  },
];

const exampleSignals = [
  {
    title: "SOS",
    morse: "... --- ...",
    text: "The familiar distress pattern: three short, three long, three short.",
    href: ROUTES.sos,
  },
  {
    title: "HELP",
    morse: ".... . .-.. .--.",
    text: "A plain word example. Use it only as practice or where a reader already understands the message.",
    href: ROUTES.help,
  },
  {
    title: "CQ",
    morse: "-.-. --.-",
    text: "A general call in radio contexts, not a distress signal. It is useful to know the difference.",
    href: ROUTES.cq,
  },
];

const nextStepLinks = [
  {
    title: "Learn Morse Code",
    text: "Start with a practical beginner path before treating signals as useful backup knowledge.",
    href: ROUTES.learn,
    badge: "Start",
  },
  {
    title: "Morse Code SOS",
    text: "Open the focused SOS reference for the signal pattern, sound, and spacing examples.",
    href: ROUTES.sos,
    badge: "Signal",
  },
  {
    title: "Morse Code Chart",
    text: "Use a full chart when you need letters, numbers, punctuation, and spacing in one place.",
    href: ROUTES.chart,
    badge: "Chart",
  },
  {
    title: "Morse Code Audio Practice",
    text: "Practice recognizing short and long signals in normal learning sessions.",
    href: ROUTES.audioPractice,
    badge: "Audio",
  },
];

const sourceTitles = new Set([
  "ITU-R Recommendation M.1677-1",
  "ARRL Learning Morse Code",
]);

const emergencySources = SOURCE_LINKS.filter((source) =>
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

function SosSignalCard() {
  return (
    <StaticTile as="section" aria-labelledby="sos-card-heading">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.68fr)_minmax(240px,0.32fr)] lg:items-center">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Recognizable pattern
          </p>
          <h3
            id="sos-card-heading"
            className="mw-heading mt-2 text-2xl font-extrabold text-sky-950"
          >
            SOS
          </h3>
          <p className="mt-3 font-mono text-xl font-bold tracking-[0.2em] text-slate-950">
            ... --- ...
          </p>
          <p className="mw-text-muted mt-3 max-w-[58ch] text-base leading-relaxed text-slate-700">
            Three short, three long, three short. The spacing and repetition
            make the pattern easier to notice than a random set of pulses.
          </p>
        </div>
        <div aria-label="SOS pulse pattern: three short, three long, three short">
          <div className="flex flex-wrap items-end gap-2" aria-hidden="true">
            {sosPulses.map((pulse, index) => (
              <span
                key={`${pulse.label}-${index}`}
                className={`${pulse.widthClass} block h-4 rounded-full bg-slate-950`}
              />
            ))}
          </div>
          <p className="mw-muted-label mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            short short short / long long long / short short short
          </p>
        </div>
      </div>
    </StaticTile>
  );
}

function CanCannotTable() {
  return (
    <div className="mw-static-panel overflow-hidden rounded-xl bg-[#fffdf8]">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-slate-200/70 p-5 md:border-b-0 md:border-r">
          <h3 className="mw-heading text-xl font-extrabold text-sky-950">
            Morse can help with
          </h3>
          <ul className="mt-4 grid gap-3 pl-5 text-base leading-relaxed text-slate-700">
            {canItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <h3 className="mw-heading text-xl font-extrabold text-sky-950">
            Morse cannot guarantee
          </h3>
          <ul className="mt-4 grid gap-3 pl-5 text-base leading-relaxed text-slate-700">
            {cannotItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ExampleSignalCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {exampleSignals.map((signal) => (
        <StaticTile key={signal.title}>
          <h3 className="mw-heading text-xl font-extrabold text-sky-950">
            <a
              href={signal.href}
              className="cursor-pointer text-sky-900 underline underline-offset-4 hover:no-underline"
            >
              {signal.title}
            </a>
          </h3>
          <p className="mt-3 break-words font-mono text-base font-bold tracking-[0.16em] text-slate-950">
            {signal.morse}
          </p>
          <p className="mw-text-muted mt-3 text-base leading-relaxed text-slate-700">
            {signal.text}
          </p>
        </StaticTile>
      ))}
    </div>
  );
}

export default function MorseCodeEmergencySignals() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Morse Code Emergency Signals",
        item: CANONICAL_URL,
      },
    ],
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Morse Code Emergency Signals",
    url: CANONICAL_URL,
    description:
      "A calm educational guide to SOS, simple Morse emergency signaling, backup communication limits, and safe practice.",
    educationalLevel: "Beginner",
    isPartOf: { "@type": "WebSite", name: "MorseWords", url: SITE_URL },
  };
  const jsonLd = [breadcrumbJsonLd, pageJsonLd];

  return (
    <div className="mw-non-home-page" style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Backup signals"
          title="Morse Code Emergency Signals"
          description="Morse emergency signals are backup communication knowledge, not a substitute for official emergency channels. If you can call emergency services or use another official emergency communication method, use that first."
          aside={
            <DarkNote label="Start here" value="Official channels first">
              SOS is the best-known Morse distress signal. Treat it as a
              backup pattern to recognize and practice, not as a rescue plan by
              itself.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: ROUTES.sos, label: "Open SOS reference", primary: true },
              { href: ROUTES.audioPractice, label: "Practice by sound" },
              { href: ROUTES.timing, label: "Review timing rules" },
              { href: ROUTES.encoder, label: "Try a message" },
            ]}
          />
        </PageHero>

        <SectionCard
          eyebrow="Short answer"
          title="SOS is simple, recognizable, and still only a backup"
          description="The useful part of Morse emergency signaling is the timed pattern. It still depends on someone noticing, understanding, and responding."
          layout="stacked"
        >
          <SimpleGrid items={shortAnswerItems} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="SOS pattern"
          title="SOS as a timed signal"
          description="The same pattern can be written as dots and dashes, heard as beeps, seen as flashes, or tapped as short and long pulses."
        >
          <SosSignalCard />
        </SectionCard>

        <SectionCard
          eyebrow="Methods"
          title="Ways Morse can be signaled"
          description="These are general signaling forms. Choose official emergency communication first whenever it is available."
        >
          <SimpleGrid items={signalMethods} variant="cards" />
        </SectionCard>

        <SectionCard
          eyebrow="Limits"
          title="What Morse can and cannot do in an emergency"
          description="A calm backup skill is useful only when its limits are clear."
        >
          <CanCannotTable />
        </SectionCard>

        <SectionCard
          eyebrow="Myths"
          title="SOS myths"
          description="A few careful distinctions keep the signal useful without turning it into folklore or hype."
        >
          <SimpleGrid items={mythItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Practice"
          title="Practice without pretending it is an emergency"
          description="Practice the timing in ordinary learning sessions. Do not create staged emergency scenarios or delay real emergency contact."
        >
          <SimpleGrid items={practiceItems} linkedItemStyle="inline" />
        </SectionCard>

        <SectionCard
          eyebrow="Examples"
          title="Emergency signal examples"
          description="These examples are for learning and recognition. Use the encoder or decoder to try plain messages safely."
        >
          <div className="space-y-5">
            <ExampleSignalCards />
            <p className="mw-text-muted max-w-[72ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              To try a non-emergency message, use the{" "}
              <InlineTextLink href={ROUTES.encoder}>
                Morse code encoder
              </InlineTextLink>{" "}
              or check a copied pattern with the{" "}
              <InlineTextLink href={ROUTES.decoder}>
                Morse code decoder
              </InlineTextLink>
              .
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Learning path"
          title="Where this fits with learning Morse"
          description="Emergency signals make more sense after the basic alphabet, timing, and listening practice are familiar."
          layout="stacked"
        >
          <SimpleGrid items={nextStepLinks} />
        </SectionCard>

        <SectionCard
          eyebrow="Sources"
          title="Sources and further reading"
          description="These verified local source links support the International Morse and learning context used here. Official emergency procedure sources should be verified separately before adding procedural guidance."
          layout="stacked"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {emergencySources.map((source) => (
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

        <BreadcrumbTrail current="Morse Code Emergency Signals" />
      </main>
      <JsonLdScript jsonLd={jsonLd} />
    </div>
  );
}
