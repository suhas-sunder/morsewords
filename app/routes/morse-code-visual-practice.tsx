import * as React from "react";
import type { Route } from "./+types/morse-code-visual-practice";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import FaqSectionGeneric from "~/client/components/shared/FaqSectionGeneric";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import ToolHowItWorks from "~/client/components/shared/ToolHowItWorks";
import { morseVisualEvents } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  LightBulbIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "~/client/assets/svg/Icons";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-visual-practice";
const STROBE_WARNING_ID = "visual-practice-strobe-warning";

const faqItems = [
  {
    q: "What is visual Morse practice?",
    a: "Visual practice shows Morse as flashes instead of tones. It is useful for learning light signals, checking spacing, and practicing without audio.",
  },
  {
    q: "Why does visual practice include Farnsworth spacing?",
    a: "Farnsworth spacing slows the gaps between flashed characters and words while keeping each character shape crisp. It slows spacing only.",
  },
  {
    q: "Should I use short messages?",
    a: "Yes. Visual Morse is easiest with short prompts because long flashing sequences are harder to hold in memory.",
  },
  {
    q: "Is flashing light safe for everyone?",
    a: "Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Visual Morse Code Practice | Flashing Light Trainer",
    description:
      "Practice Morse code visually with a flashing-light trainer. Set speed, watch the signal, reveal the answer, and move into the scored visual quiz.",
    path: CANONICAL_PATH,
    keywords:
      "visual morse code practice, flashing morse code, morse code light practice, morse code visual trainer",
  });
}

function useVisualPlayback(pattern: string, wpm: number, farnsworthWpm: number) {
  const [active, setActive] = React.useState(false);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function play() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    let cursor = 0;
    for (const event of morseVisualEvents(pattern, wpm, farnsworthWpm)) {
      timers.current.push(window.setTimeout(() => setActive(event.on), cursor));
      cursor += event.ms;
    }
    timers.current.push(window.setTimeout(() => setActive(false), cursor + 80));
  }

  return { active, play };
}

export default function MorseCodeVisualPractice() {
  const [message, setMessage] = React.useState("sos");
  const [wpm, setWpm] = React.useState(14);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(10);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const morse = React.useMemo(() => textToMorse(message), [message]);
  const { active, play } = useVisualPlayback(morse, wpm, farnsworthWpm);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Visual Morse Code Practice",
    url: canonicalUrl(CANONICAL_PATH),
    applicationCategory: "EducationalApplication",
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

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <PageHero
          eyebrow="Visual practice"
          title="Visual Morse code practice"
          description="Practice reading Morse as flashes instead of tones. Choose a short message, watch the bulb, then reveal the text and Morse when you are ready."
          aside={
            <DarkNote label="Flash mode" value={active ? "ON" : "READY"}>
              Use short messages at first. Visual Morse is easiest when the
              spacing is clean and the message is not too long.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-visual-quiz", label: "Take visual quiz", primary: true },
              { href: "/morse-code-audio-practice", label: "Audio practice" },
              { href: "/morse-code-sos", label: "SOS signal" },
            ]}
          />
        </PageHero>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-[#fffdf8] p-8">
              <StrobeWarning id={STROBE_WARNING_ID} className="mb-5 w-full" />
              <div
                className={
                  "h-44 w-44 rounded-full border transition-all duration-75 " +
                  (active
                    ? "border-sky-300 bg-sky-200 shadow-[0_0_60px_rgba(56,189,248,0.95)]"
                    : "border-slate-200 bg-slate-100 shadow-inner")
                }
                aria-label={active ? "Morse light on" : "Morse light off"}
              />
              <button
                type="button"
                onClick={play}
                aria-describedby={STROBE_WARNING_ID}
                className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-950 bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
              >
                <LightBulbIcon size={20} title="Flash message" />
                Flash message
              </button>
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-extrabold text-sky-950">Message</span>
                <input
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setShowAnswer(false);
                  }}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 font-mono text-lg outline-none focus:border-sky-400"
                />
              </label>
              <div className="mt-5 grid gap-5">
                <SliderRow
                  label="Character speed"
                  value={wpm}
                  min={6}
                  max={30}
                  step={1}
                  unit="WPM"
                  onChange={setWpm}
                />
                <SliderRow
                  label="Farnsworth spacing"
                  value={farnsworthWpm}
                  min={5}
                  max={30}
                  step={1}
                  unit="WPM"
                  onChange={setFarnsworthWpm}
                  help="Slows spacing only."
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAnswer((value) => !value)}
                className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
              >
                {showAnswer ? (
                  <VisibilityOffIcon size={18} title="Hide answer" />
                ) : (
                  <VisibilityIcon size={18} title="Reveal answer" />
                )}
                {showAnswer ? "Hide answer" : "Reveal answer"}
              </button>
              {showAnswer ? (
                <p className="mt-4 font-mono text-lg font-bold tracking-[0.16em] text-slate-950">
                  {message.toUpperCase()} / {morse}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <ToolHowItWorks
          eyebrow="Visual practice spec"
          title="How this visual Morse practice tool works"
          description="Visual practice turns the Morse message into timed flashes. Character speed controls the flash lengths, and Farnsworth spacing stretches only the gaps so you have more time to recognize the next character."
          referenceLabel="Flash signal"
          referenceValue={active ? "ON" : "... --- ..."}
          referenceText="Use short messages first. Clean spacing matters as much as the flashes."
          chips={[
            { label: "Message", href: "#visual-practice-message" },
            { label: "Speed", href: "#visual-practice-speed" },
            { label: "Farnsworth", href: "#visual-practice-farnsworth" },
            { label: "Quiz next", href: "#visual-practice-quiz" },
          ]}
          summary={[
            {
              title: "Light-based copy",
              text: "The page uses the same dots, dashes, and gaps, but renders them as flashes.",
            },
            {
              title: "Stacked controls",
              text: "Speed and Farnsworth settings are kept vertical so each slider is easy to read.",
            },
            {
              title: "Answer reveal",
              text: "Reveal the message only after watching the full flash sequence.",
            },
          ]}
          details={[
            {
              kicker: "Prompt setup",
              title: "Message",
              text: "Type a short word, Q-code, or phrase. The tool converts it to Morse and flashes the signal with standard dot, dash, letter-gap, and word-gap timing.",
            },
            {
              kicker: "Flash length",
              title: "Speed",
              text: "Character speed controls how long each dit and dah stays on. Higher WPM means shorter flashes and a faster signal.",
            },
            {
              kicker: "Learner gaps",
              title: "Farnsworth",
              text: "Farnsworth spacing gives you more time between characters and words without changing the shape of each flashed character.",
              bullets: [
                "Use lower Farnsworth spacing for early practice.",
                "Raise it as visual recall improves.",
                "Keep messages short to avoid memory overload.",
              ],
            },
            {
              kicker: "Test mode",
              title: "Quiz next",
              text: "The visual quiz uses the same speed and Farnsworth controls, but hides the prompt and tracks score, attempts, accuracy, and streaks.",
            },
          ]}
        />

        <SectionCard eyebrow="Visual flow" title="Practice flashes, then test recall">
          <ActionLinks
            links={[
              { href: "/morse-code-visual-quiz", label: "Visual quiz", primary: true },
              { href: "/morse-code-timing", label: "Timing guide" },
              { href: "/morse-code-printable-chart", label: "Print review" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Visual practice FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
      </main>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  help,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  help?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-extrabold text-sky-950">{label}</label>
        <span className="text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>
      {help ? <p className="mt-1 text-xs text-slate-500">{help}</p> : null}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ accentColor: "#38bdf8" }}
        className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
    </div>
  );
}
