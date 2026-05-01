import * as React from "react";
import type { Route } from "./+types/morse-code-audio-practice";

import JsonLdScript from "~/client/components/shared/JsonLdScript";
import {
  ActionLinks,
  DarkNote,
  PageHero,
  SectionCard,
} from "~/client/components/shared/MorseLearningLayout";
import useMorseAudio, { type SoundPreset } from "~/client/components/shared/useMorseAudio";
import styles from "~/client/components/shared/pageStyles";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { canonicalUrl, seoMeta, SITE_URL } from "~/client/seo";

const CANONICAL_PATH = "/morse-code-audio-practice";

export function links() {
  return [{ rel: "canonical", href: canonicalUrl(CANONICAL_PATH) }];
}

export function meta({}: Route.MetaArgs) {
  return seoMeta({
    title: "Morse Code Audio Practice with WPM and Repeat | MorseWords",
    description:
      "Practice Morse by ear with audio-only prompts, WPM, Farnsworth spacing, pitch, waveform, repeat, flash, and built-in examples.",
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
                  className="mt-4 min-h-12 w-full rounded-xl border border-neutral-950 bg-neutral-950 px-4 py-2 font-extrabold text-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {player.state === "playing" ? "Restart audio" : "Play audio"}
                </button>
                <button
                  type="button"
                  onClick={player.stop}
                  disabled={player.state === "idle"}
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
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
                    <TogglePill label="Sound" checked={soundOn} onChange={setSoundOn} />
                    <TogglePill label="Repeat" checked={repeat} onChange={setRepeat} />
                    <TogglePill label="Flash" checked={flash} onChange={setFlash} />
                  </div>
                </div>
                {flash ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-[#fffdf8] p-3 text-sm leading-relaxed text-slate-700">
                    Flash uses the same screen-flash behavior as the audio
                    generator. Disable it if flashing light is uncomfortable.
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setAdvancedOpen((value) => !value)}
              className="mt-5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 font-extrabold text-slate-900"
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

        <JsonLdScript jsonLd={jsonLd} />
      </main>
    </div>
  );
}

function TogglePill({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        "rounded-full border px-3 py-1.5 text-sm font-extrabold transition " +
        (checked
          ? "border-neutral-950 bg-neutral-950 text-sky-100"
          : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50")
      }
      aria-pressed={checked}
    >
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

