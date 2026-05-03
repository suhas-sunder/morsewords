import * as React from "react";
import type { Route } from "./+types/morse-code-audio-practice";

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
import useMorseAudio, { type SoundPreset } from "~/client/components/shared/useMorseAudio";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  LightBulbIcon,
  LoopIcon,
  PlayIcon,
  SoundIcon,
  StopIcon,
} from "~/client/assets/svg/Icons";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-practice";
const STROBE_WARNING_ID = "audio-practice-strobe-warning";

const faqItems = [
  {
    q: "What is audio practice for?",
    a: "Audio practice lets you hear a visible prompt first, tune the timing, and repeat the sound until the rhythm is familiar before switching to a hidden-answer quiz.",
  },
  {
    q: "What does Farnsworth spacing do?",
    a: "Farnsworth keeps the character speed crisp but stretches the gaps between letters and words. It slows spacing only, which helps learners hear the shapes without rushing the copy.",
  },
  {
    q: "Should I use repeat?",
    a: "Use repeat for short words, Q-codes, and weak prompts. Turn it off for longer messages so you do not train yourself to wait for a second pass.",
  },
  {
    q: "Does the audio upload my text?",
    a: "No. The practice audio is generated in your browser with the same local audio engine used by the MorseWords audio tools.",
  },
];

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Practice | Listen, Repeat, and Build Speed",
    description:
      "Practice Morse by ear with repeat playback, WPM, Farnsworth spacing, pitch, waveform, volume, flash, and focused prompts before taking a quiz.",
    path: CANONICAL_PATH,
    keywords:
      "morse code audio practice, listen to morse code, morse code by ear, morse audio drills, morse code listening practice",
  });
}

export default function MorseCodeAudioPractice() {
  const player = useMorseAudio();
  const [message, setMessage] = React.useState("sos help");
  const [charWpm, setCharWpm] = React.useState(18);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(12);
  const [toneHz, setToneHz] = React.useState(650);
  const [volume, setVolume] = React.useState(0.75);
  const [preset, setPreset] = React.useState<SoundPreset>("cw_radio");
  const [attackMs, setAttackMs] = React.useState(8);
  const [releaseMs, setReleaseMs] = React.useState(12);
  const [repeat, setRepeat] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(true);
  const [flash, setFlash] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(true);
  const morse = React.useMemo(() => textToMorse(message), [message]);
  const canPlay = !!morse.trim();

  React.useEffect(() => {
    const anyPlayer = player as typeof player & {
      setLiveOptions?: (options: unknown) => void;
    };
    anyPlayer.setLiveOptions?.({
      code: morse,
      wpm: charWpm,
      farnsworthWpm,
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash,
      attackMs,
      releaseMs,
    });
  }, [
    player,
    morse,
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    soundOn,
    preset,
    repeat,
    flash,
    attackMs,
    releaseMs,
  ]);

  React.useEffect(() => {
    if (!flash) return;
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { ms?: number } | undefined;
      const ms = detail?.ms ?? 0;
      const el = document.getElementById("mw_audio_practice_flash");
      if (!el || !ms) return;
      el.classList.remove("opacity-0");
      el.classList.add("opacity-100");
      window.setTimeout(() => {
        el.classList.remove("opacity-100");
        el.classList.add("opacity-0");
      }, ms);
    };
    window.addEventListener("morsewords:flash", handler as EventListener);
    return () => window.removeEventListener("morsewords:flash", handler as EventListener);
  }, [flash]);

  async function play() {
    if (!canPlay) return;
    await player.play({
      code: morse,
      wpm: charWpm,
      farnsworthWpm,
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash,
      attackMs,
      releaseMs,
    });
  }

  const durationMs = canPlay
    ? player.estimateDurationMs({ code: morse, wpm: charWpm, farnsworthWpm })
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Morse Code Audio Practice",
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
      {flash ? (
        <div
          id="mw_audio_practice_flash"
          className="pointer-events-none fixed inset-0 z-50 bg-white opacity-0 transition-opacity duration-75"
        />
      ) : null}

      <main style={styles.wrap}>
        <PageHero
          eyebrow="Audio practice"
          title="Morse code audio practice"
          description="Practice Morse by ear with the same timing controls used by the audio generator. Use repeat and Farnsworth spacing for listening drills, then move into the audio quiz when you are ready to test recall."
          aside={
            <DarkNote label="Current signal" value={morse || "... --- ..."}>
              Estimated time: {formatMs(durationMs)}. Audio runs locally in your
              browser; nothing is uploaded.
            </DarkNote>
          }
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-quiz", label: "Take audio quiz", primary: true },
              { href: "/audio", label: "Full audio generator" },
              { href: "/farnsworth-timing", label: "Farnsworth guide" },
            ]}
          />
        </PageHero>

        <section className="mw-tool-section mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-6 sm:px-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <label className="block">
                <span className="text-sm font-extrabold text-sky-950">
                  Practice message
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="mt-2 min-h-40 w-full rounded-xl border border-slate-200 p-4 font-mono text-base outline-none focus:border-sky-400"
                />
              </label>
              <div className="rounded-xl border border-slate-200 bg-[#fffdf8] p-5">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Playback
                </p>
                <button
                  type="button"
                  onClick={play}
                  disabled={!canPlay}
                  className="mt-4 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-950 bg-slate-950 px-4 py-2 font-semibold text-sky-100 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PlayIcon size={20} title="Play audio" />
                  {player.state === "playing" ? "Restart audio" : "Play audio"}
                </button>
                <button
                  type="button"
                  onClick={player.stop}
                  disabled={player.state === "idle"}
                  className="mt-2 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <StopIcon size={20} title="Stop audio" />
                  Stop
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8">
            <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
              <p className="font-mono text-base font-bold tracking-[0.16em] text-slate-950">
                {morse}
              </p>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <SliderRow label="Character speed" value={charWpm} min={5} max={40} step={1} unit="WPM" onChange={setCharWpm} />
              <SliderRow label="Farnsworth spacing" value={farnsworthWpm} min={5} max={40} step={1} unit="WPM" onChange={setFarnsworthWpm} help="Slower spacing, same character speed." />
              <SliderRow label="Pitch" value={toneHz} min={300} max={1000} step={10} unit="Hz" onChange={setToneHz} disabled={!soundOn || preset === "sounder"} />
              <SliderRow label="Volume" value={Math.round(volume * 100)} min={0} max={100} step={1} unit="%" onChange={(value) => setVolume(value / 100)} disabled={!soundOn} />
              <SliderRow label="Attack" value={attackMs} min={0} max={40} step={1} unit="ms" onChange={setAttackMs} disabled={!soundOn || preset === "sounder"} />
              <SliderRow label="Release" value={releaseMs} min={0} max={80} step={1} unit="ms" onChange={setReleaseMs} disabled={!soundOn || preset === "sounder"} />
            </div>

            {advancedOpen ? (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_2fr] md:items-end">
                  <label className="block">
                    <span className="text-sm font-extrabold text-sky-950">
                      Sound preset
                    </span>
                    <select
                      value={preset}
                      onChange={(event) => setPreset(event.target.value as SoundPreset)}
                      className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 font-semibold"
                    >
                      <option value="cw_radio">CW (Radio)</option>
                      <option value="sine">Sine</option>
                      <option value="square">Square</option>
                      <option value="triangle">Triangle</option>
                      <option value="sawtooth">Sawtooth</option>
                      <option value="sounder">Telegraph sounder</option>
                    </select>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <TogglePill
                      label="Sound"
                      checked={soundOn}
                      onChange={setSoundOn}
                      icon={<SoundIcon size={16} title="Sound" />}
                    />
                    <TogglePill
                      label="Repeat"
                      checked={repeat}
                      onChange={setRepeat}
                      icon={<LoopIcon size={16} title="Repeat" />}
                    />
                    <TogglePill
                      label="Flash"
                      checked={flash}
                      onChange={setFlash}
                      icon={<LightBulbIcon size={16} title="Flash" />}
                      describedBy={flash ? STROBE_WARNING_ID : undefined}
                    />
                  </div>
                </div>
                {flash ? (
                  <StrobeWarning id={STROBE_WARNING_ID} className="mt-4" />
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setAdvancedOpen((value) => !value)}
              className="mt-5 min-h-11 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
            >
              {advancedOpen ? "Hide advanced settings" : "Show advanced settings"}
            </button>

            <div className="mt-5 flex flex-wrap gap-2">
              {["CQ CQ", "TEST 123", "HELLO WORLD", "QTH HOME", "SOS"].map((presetText) => (
                <button
                  key={presetText}
                  type="button"
                  onClick={() => setMessage(presetText)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-sky-300 hover:bg-sky-50"
                >
                  Try {presetText}
                </button>
              ))}
            </div>
          </div>
        </section>

        <ToolHowItWorks
          eyebrow="Audio practice spec"
          title="How this Morse code audio practice tool works"
          description="Audio practice uses the same Morse timing model as the audio generator, but keeps the workflow focused on listening. You choose the message, set character speed, add Farnsworth spacing if needed, then play, repeat, or flash the signal."
          referenceLabel="Listening signal"
          referenceValue="... --- ..."
          referenceText="Character speed controls dits and dahs. Farnsworth changes the gaps only."
          chips={[
            { label: "Timing", href: "#audio-practice-timing" },
            { label: "Farnsworth", href: "#audio-practice-farnsworth" },
            { label: "Repeat", href: "#audio-practice-repeat" },
            { label: "Quiz next", href: "#audio-practice-quiz" },
          ]}
          summary={[
            {
              title: "Local playback",
              text: "The signal is generated in your browser, so practice text is not uploaded.",
            },
            {
              title: "Farnsworth spacing",
              text: "Character speed stays sharp while letter and word gaps can slow down.",
            },
            {
              title: "Practice before testing",
              text: "Use visible prompts first, then switch to the audio quiz when recall feels steady.",
            },
          ]}
          details={[
            {
              kicker: "Playback controls",
              title: "Timing",
              text: "Character speed sets the length of dits and dahs. Pitch, volume, attack, and release change how the sound feels without changing the Morse message.",
              bullets: [
                "Raise WPM when the shapes sound too slow.",
                "Lower pitch if high tones feel tiring.",
                "Use attack and release to soften clicks.",
              ],
            },
            {
              kicker: "Learner spacing",
              title: "Farnsworth",
              text: "Farnsworth spacing is useful when you can recognize characters but need more time between them. The character rhythm stays intact while the spaces stretch.",
              bullets: [
                "Set character speed higher than spacing speed.",
                "Increase spacing speed as copy improves.",
                "Avoid slowing character shapes so much that they stop sounding like Morse.",
              ],
            },
            {
              kicker: "Short loops",
              title: "Repeat",
              text: "Repeat mode is best for short words, Q-codes, prosigns, and weak prompts. It turns the page into a focused listening loop without leaving the practice screen.",
            },
            {
              kicker: "Next step",
              title: "Quiz next",
              text: "Once a prompt is familiar, move to the audio quiz. The quiz hides the answer and scores attempts, accuracy, and streaks using the same timing controls.",
            },
          ]}
        />

        <SectionCard
          eyebrow="Listening flow"
          title="Use audio practice before tests"
          description="Listen with the answer visible first, then hide the text and move into the audio quiz when the rhythm feels familiar. For downloadable practice files, use the full audio generator."
        >
          <ActionLinks
            links={[
              { href: "/morse-code-audio-quiz", label: "Audio quiz", primary: true },
              { href: "/morse-code-word-trainer", label: "Word trainer" },
              { href: "/morse-code-sentence-practice", label: "Sentence practice" },
              { href: "/audio", label: "Export practice audio" },
            ]}
          />
        </SectionCard>

        <FaqSectionGeneric title="Audio practice FAQ" items={faqItems} />

        <JsonLdScript jsonLd={[jsonLd, faqJsonLd]} />
      </main>
    </div>
  );
}

function TogglePill({
  label,
  checked,
  onChange,
  icon,
  describedBy,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ReactNode;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 " +
        (checked
          ? "border-slate-950 bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
          : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50")
      }
      aria-pressed={checked}
      aria-describedby={describedBy}
    >
      {icon}
      {label}
    </button>
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
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  help?: string;
  disabled?: boolean;
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
        disabled={disabled}
        style={{ accentColor: "#38bdf8" }}
        className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function formatMs(ms: number) {
  if (!ms || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}
