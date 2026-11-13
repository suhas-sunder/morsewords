import * as React from "react";
import SliderRow from "./ui/SliderRow";
import { ActionButton, ActionLinkButton, ActionRow } from "./ActionControls";
import { DEFAULT_SHARED_AUDIO_PREFERENCES, readSharedAudioPreferences, writeSharedAudioPreferences } from "./audioPreferenceStorage";
import { CHARACTER_SPEED_RANGE, clampFarnsworthWpm, sanitizeMorseNumericSetting } from "./morseSettings";
import { buildMorseTimeline, type MorseTimingEvent } from "./morseTiming";
import { textToMorse } from "./morseUtils";
import { ROUTES } from "~/client/data/routes";

const PARIS = textToMorse("PARIS PARIS");
const format = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);

export default function MorseTimingLab() {
  const [speeds, setSpeeds] = React.useState({ charWpm: DEFAULT_SHARED_AUDIO_PREFERENCES.charWpm, farnsworthWpm: DEFAULT_SHARED_AUDIO_PREFERENCES.farnsworthWpm });
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const stored = readSharedAudioPreferences();
    setSpeeds({ charWpm: stored.charWpm, farnsworthWpm: stored.farnsworthWpm });
    setReady(true);
  }, []);

  function change(charValue: number, effectiveValue: number) {
    const charWpm = sanitizeMorseNumericSetting("characterSpeed", charValue);
    const next = { charWpm, farnsworthWpm: clampFarnsworthWpm(effectiveValue, charWpm) };
    setSpeeds(next);
    // Merge at the interaction, preserving unrelated tone/flash preferences.
    writeSharedAudioPreferences({ ...readSharedAudioPreferences(), ...next });
  }

  const timeline = buildMorseTimeline(PARIS, speeds);
  const cycle = timeline.events.filter((event) => event.wordIndex === 0);
  const standardCycle = buildMorseTimeline(PARIS, { charWpm: speeds.charWpm }).events.filter((event) => event.wordIndex === 0);
  const cycleMs = cycle.reduce((sum, event) => sum + event.ms, 0);
  const rows = [
    ["Dot", cycle.find((e) => e.type === "mark" && e.symbol === ".")!],
    ["Dash", cycle.find((e) => e.type === "mark" && e.symbol === "-")!],
    ["Inside a character", cycle.find((e) => e.type === "gap" && e.gap === "intra-symbol")!],
    ["Between letters", cycle.find((e) => e.type === "gap" && e.gap === "letter")!],
    ["Between words", cycle.find((e) => e.type === "gap" && e.gap === "word")!],
  ] as const;

  return (
    <section aria-labelledby="timing-lab-title" className="mt-8 sm:mt-10" data-mw-timing-lab-ready={ready ? "true" : "false"}>
      <h2 id="timing-lab-title" className="text-2xl font-extrabold text-sky-950">Try your own timing</h2>
      <p className="mt-3 max-w-[68ch] leading-relaxed text-slate-700">
        Change the speeds to see exactly how long each signal and silence lasts.
        Lower effective speed stretches the gaps between letters and words; the character rhythm stays the same.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:gap-12">
        <SliderRow label="Character speed" {...CHARACTER_SPEED_RANGE} id="timing-character-speed" value={speeds.charWpm} onChange={(value) => change(value, speeds.farnsworthWpm)} />
        <SliderRow label="Effective speed (Farnsworth)" {...CHARACTER_SPEED_RANGE} id="timing-effective-speed" max={speeds.charWpm} value={speeds.farnsworthWpm} onChange={(value) => change(speeds.charWpm, value)} />
      </div>
      <div className="mt-6 grid gap-7 lg:grid-cols-2 lg:gap-12">
        <div className="mw-static-surface overflow-hidden rounded-xl px-4 py-2">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Signal and gap durations at your selected speeds</caption>
            <thead><tr className="text-sky-950"><th scope="col" className="py-3 pr-2">Signal or gap</th><th scope="col" className="px-2 py-3">Dot units</th><th scope="col" className="py-3 pl-2 text-right">Time</th></tr></thead>
            <tbody>{rows.map(([label, event]) => <tr key={label} className="border-t border-slate-200 text-slate-700"><th scope="row" className="py-3 pr-2 font-semibold">{label}</th><td className="px-2 py-3 font-mono">{format(event.units)}</td><td className="py-3 pl-2 text-right font-mono whitespace-nowrap">{format(event.ms)} ms</td></tr>)}</tbody>
          </table>
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">One PARIS cycle</h3>
          <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-slate-700">Includes the word PARIS and the word gap before it repeats. Both bars use the same time scale. Solid marks are tones; the spaces are silence.</p>
          <TimingStrip label="Standard spacing" events={standardCycle} scaleMs={cycleMs} />
          <TimingStrip label="Your spacing" events={cycle} scaleMs={cycleMs} />
          <p className="mt-4 text-slate-700" role="status" aria-live="polite">One cycle: <strong data-testid="timing-cycle">{format(cycleMs)} ms</strong> at {speeds.farnsworthWpm} effective WPM.</p>
          <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-slate-700">PARIS defines the reference speed. Other words have different lengths, so a message’s actual words per minute can differ.</p>
        </div>
      </div>
      <ActionRow className="mt-5">
        <ActionButton onClick={() => change(speeds.charWpm, speeds.charWpm)}>Use standard spacing</ActionButton>
        <ActionLinkButton href={ROUTES.audio} tone="dark">Hear these settings in Audio</ActionLinkButton>
      </ActionRow>
      <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-slate-700">Speed changes are saved on this device for the audio tools. This calculator uses the same timing engine as playback and export. <a className="font-semibold text-sky-900 underline-offset-4 hover:underline" href="https://www.arrl.org/files/file/Technology/x9004008.pdf" target="_blank" rel="noreferrer">Read the ARRL timing reference (PDF).</a></p>
    </section>
  );
}

function TimingStrip({ label, events, scaleMs }: { label: string; events: MorseTimingEvent[]; scaleMs: number }) {
  return <div className="mt-4"><p className="mb-2 text-sm font-semibold text-sky-950">{label}</p><div aria-hidden="true" className="mw-static-code flex h-7 overflow-hidden rounded-lg">{events.map((event) => <span key={event.eventIndex} data-tone={event.on ? "true" : undefined} style={{ width: `${event.ms / scaleMs * 100}%`, flexShrink: 0, backgroundColor: event.on ? "var(--mw-code-text)" : undefined }} />)}</div></div>;
}
