import * as React from "react";
import { PlayIcon, StopIcon } from "~/client/assets/svg/Icons";
import AudioPresetPicker from "./AudioPresetPicker";
import { AUDIO_TONE_PRESET_REGISTRY, type AudioTonePresetId } from "./audioPresetRegistry";
import { ToolButton } from "./ToolWorkspace";
import type { usePresetComparison } from "./usePresetComparison";

export default function TonePresetComparison({ comparison, disabled, soundOn }: {
  comparison: ReturnType<typeof usePresetComparison>;
  disabled: boolean;
  soundOn: boolean;
}) {
  const id = React.useId();
  const [a, setA] = React.useState<AudioTonePresetId>("cw_radio");
  const [b, setB] = React.useState<AudioTonePresetId>("sine");
  const stop = comparison.stop;
  React.useEffect(() => () => stop(), [stop]);
  return (
    <details className="mt-5" data-testid="tone-comparison" onToggle={event => { if (!event.currentTarget.open) stop(); }}>
      <summary className="cursor-pointer rounded-lg bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-sky-950 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        Compare two tones
      </summary>
      <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-slate-700">
        Hear the same message with your current speed, spacing, pitch, volume and envelope.
        Each comparison plays once, with sound only. Your selected tone and saved settings stay unchanged.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {([{ side: "A" as const, value: a, set: setA }, { side: "B" as const, value: b, set: setB }]).map(({ side, value, set }) => (
          <div key={side}>
            <AudioPresetPicker id={`${id}-${side}`} context="audio" label={`Comparison ${side} tone`} value={value}
              onChange={next => { stop(); set(next); }} />
            <ToolButton className="mt-3 w-full" tone="light" disabled={disabled || !soundOn}
              onClick={() => void comparison.play(side, value)} aria-label={`Play comparison ${side}`}>
              <PlayIcon size={16} aria-hidden="true" title={undefined} /> Play {side}
            </ToolButton>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ToolButton tone="light" onClick={stop} disabled={!comparison.playing}>
          <StopIcon size={16} aria-hidden="true" title={undefined} /> Stop comparison
        </ToolButton>
        <p className="text-sm text-slate-700" role="status" aria-live="polite">
          {comparison.playing ? `${comparison.paused ? "Paused" : "Playing"} ${comparison.playing.side}: ${AUDIO_TONE_PRESET_REGISTRY[comparison.playing.preset].label}`
            : comparison.message || (!soundOn ? "Turn Sound on to compare tones." : "Choose a tone, then Play A or Play B.")}
        </p>
      </div>
    </details>
  );
}
