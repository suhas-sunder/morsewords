import * as React from "react";

import {
  AUDIO_TONE_PRESET_REGISTRY,
  TRANSLATOR_AUDIO_PRESET_IDS,
  getAudioPresetsForContext,
  getTranslatorAudioPresetLabel,
  type AudioPresetAvailabilityFlag,
  type AudioTonePresetId,
  type TranslatorAudioPresetId,
} from "~/client/components/shared/audioPresetRegistry";

export function AudioPresetOptions({
  context,
  includeCreative = true,
}: {
  context: AudioPresetAvailabilityFlag;
  includeCreative?: boolean;
}) {
  const presets = getAudioPresetsForContext(context, { includeCreative });
  const standard = presets.filter(
    (preset) => AUDIO_TONE_PRESET_REGISTRY[preset].category === "standard",
  );
  const creative = presets.filter(
    (preset) => AUDIO_TONE_PRESET_REGISTRY[preset].category === "creative",
  );

  return (
    <>
      <optgroup label="Standard Morse tones">
        {standard.map((preset) => (
          <option key={preset} value={preset}>
            {AUDIO_TONE_PRESET_REGISTRY[preset].label}
          </option>
        ))}
      </optgroup>
      {creative.length > 0 ? (
        <optgroup label="Creative synthesized tones">
          {creative.map((preset) => (
            <option key={preset} value={preset}>
              {AUDIO_TONE_PRESET_REGISTRY[preset].label}
            </option>
          ))}
        </optgroup>
      ) : null}
    </>
  );
}

export function TranslatorAudioPresetOptions() {
  return (
    <>
      {TRANSLATOR_AUDIO_PRESET_IDS.map((preset) => (
        <option key={preset} value={preset}>
          {getTranslatorAudioPresetLabel(preset)}
        </option>
      ))}
    </>
  );
}

export default function AudioPresetPicker({
  className = "",
  context,
  disabled = false,
  id,
  includeCreative = true,
  label = "Tone preset",
  onChange,
  value,
}: {
  className?: string;
  context: AudioPresetAvailabilityFlag;
  disabled?: boolean;
  id: string;
  includeCreative?: boolean;
  label?: string;
  onChange: (preset: AudioTonePresetId) => void;
  value: AudioTonePresetId;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as AudioTonePresetId)}
        disabled={disabled}
        className={`mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer hover:bg-[#fffaf2]"
        }`}
      >
        <AudioPresetOptions
          context={context}
          includeCreative={includeCreative}
        />
      </select>
    </div>
  );
}

export type { AudioTonePresetId, TranslatorAudioPresetId };
