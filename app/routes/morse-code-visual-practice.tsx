import * as React from "react";
import type { Route } from "./+types/morse-code-visual-practice";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import { morseVisualEvents } from "~/client/components/shared/playMorsePattern";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { LightBulbIcon } from "~/client/assets/svg/Icons";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-visual-practice";

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
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100"
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
              <div className="mt-5 grid gap-5 md:grid-cols-2">
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
                className="mt-5 min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold"
              >
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

        <SectionCard eyebrow="Visual flow" title="Practice flashes, then test recall">
          <ActionLinks
            links={[
              { href: "/morse-code-visual-quiz", label: "Visual quiz", primary: true },
              { href: "/morse-code-timing", label: "Timing guide" },
              { href: "/morse-code-worksheet-generator", label: "Print review" },
            ]}
          />
        </SectionCard>

        <JsonLdScript jsonLd={jsonLd} />
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
