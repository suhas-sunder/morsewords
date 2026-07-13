import * as React from "react";

import AudioPresetPicker from "~/client/components/shared/AudioPresetPicker";
import {
  type AudioPresetAvailabilityFlag,
  type AudioTonePresetId,
} from "~/client/components/shared/audioPresetRegistry";
import { presetSupportsPitchControl } from "~/client/components/shared/audioToneSynthesis";
import {
  AUDIO_ATTACK_RANGE,
  AUDIO_PITCH_RANGE,
  AUDIO_RELEASE_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  AUDIO_TAIL_RANGE,
  MP3_BITRATE_LABELS,
  MP3_BITRATES,
  VOLUME_RANGE,
  type AudioSampleRate,
  type Mp3Bitrate,
} from "~/client/components/shared/morseSettings";
import SliderRow from "~/client/components/shared/ui/SliderRow";

type AudioExportFormat = "mp3" | "wav";

export default function AudioSettingsPanel({
  attackMs,
  charWpm,
  className = "",
  context,
  disabledSound = false,
  farnsworthWpm,
  idPrefix,
  includeCreativePresets = true,
  mp3Bitrate,
  onAttackMsChange,
  onCharWpmChange,
  onFarnsworthWpmChange,
  onMp3BitrateChange,
  onPitchChange,
  onPresetChange,
  onReleaseMsChange,
  onSampleRateChange,
  onTailMsChange,
  onTargetPartMinutesChange,
  onVolumeChange,
  outputFormat,
  pitch,
  preset,
  releaseMs,
  sampleRate,
  showEnvelope = false,
  tailMs,
  targetPartMinutes,
  volume,
}: {
  attackMs?: number;
  charWpm: number;
  className?: string;
  context: AudioPresetAvailabilityFlag;
  disabledSound?: boolean;
  farnsworthWpm: number;
  idPrefix: string;
  includeCreativePresets?: boolean;
  mp3Bitrate?: Mp3Bitrate;
  onAttackMsChange?: (value: number) => void;
  onCharWpmChange: (value: number) => void;
  onFarnsworthWpmChange: (value: number) => void;
  onMp3BitrateChange?: (value: Mp3Bitrate) => void;
  onPitchChange: (value: number) => void;
  onPresetChange: (value: AudioTonePresetId) => void;
  onReleaseMsChange?: (value: number) => void;
  onSampleRateChange?: (value: AudioSampleRate) => void;
  onTailMsChange?: (value: number) => void;
  onTargetPartMinutesChange?: (value: number) => void;
  onVolumeChange: (value: number) => void;
  outputFormat?: AudioExportFormat;
  pitch: number;
  preset: AudioTonePresetId;
  releaseMs?: number;
  sampleRate?: AudioSampleRate;
  showEnvelope?: boolean;
  tailMs?: number;
  targetPartMinutes?: number;
  volume: number;
}) {
  const pitchEditable = !disabledSound && presetSupportsPitchControl(preset);

  return (
    <div className={["grid gap-5 lg:grid-cols-2", className].filter(Boolean).join(" ")}>
      <AudioPresetPicker
        id={`${idPrefix}-tone-preset`}
        context={context}
        value={preset}
        onChange={onPresetChange}
        includeCreative={includeCreativePresets}
        disabled={disabledSound}
      />
      <SliderRow
        label="Character speed"
        value={charWpm}
        min={AUDIO_SPEED_RANGE.min}
        max={AUDIO_SPEED_RANGE.max}
        step={1}
        unit="WPM"
        onChange={onCharWpmChange}
      />
      <SliderRow
        label="Farnsworth spacing"
        value={farnsworthWpm}
        min={AUDIO_SPEED_RANGE.min}
        max={Math.max(AUDIO_SPEED_RANGE.min, charWpm)}
        step={1}
        unit="WPM"
        onChange={onFarnsworthWpmChange}
      />
      <SliderRow
        label="Pitch"
        value={pitch}
        min={AUDIO_PITCH_RANGE.min}
        max={AUDIO_PITCH_RANGE.max}
        step={10}
        unit="Hz"
        onChange={onPitchChange}
        disabled={!pitchEditable}
        help={
          pitchEditable
            ? undefined
            : "This preset uses a click or sounder texture instead of pitch."
        }
      />
      <SliderRow
        label="Volume"
        value={Math.round(volume * 100)}
        min={VOLUME_RANGE.min * 100}
        max={VOLUME_RANGE.max * 100}
        step={1}
        unit="%"
        onChange={(value) => onVolumeChange(value / 100)}
        disabled={disabledSound}
      />
      {typeof targetPartMinutes === "number" &&
      onTargetPartMinutesChange ? (
        <SliderRow
          label="Target part length"
          value={targetPartMinutes}
          min={1}
          max={30}
          step={1}
          unit="min"
          onChange={onTargetPartMinutesChange}
        />
      ) : null}
      {outputFormat === "mp3" && mp3Bitrate && onMp3BitrateChange ? (
        <LabeledSelect
          id={`${idPrefix}-mp3-bitrate`}
          label="MP3 bitrate"
          value={String(mp3Bitrate)}
          onChange={(value) => onMp3BitrateChange(Number(value) as Mp3Bitrate)}
        >
          {MP3_BITRATES.map((bitrate) => (
            <option key={bitrate} value={bitrate}>
              {MP3_BITRATE_LABELS[bitrate]}
            </option>
          ))}
        </LabeledSelect>
      ) : null}
      {sampleRate && onSampleRateChange ? (
        <LabeledSelect
          id={`${idPrefix}-sample-rate`}
          label="Sample rate"
          value={String(sampleRate)}
          onChange={(value) => onSampleRateChange(Number(value) as AudioSampleRate)}
        >
          {AUDIO_SAMPLE_RATES.map((rate) => (
            <option key={rate} value={rate}>
              {rate} Hz
            </option>
          ))}
        </LabeledSelect>
      ) : null}
      {typeof tailMs === "number" && onTailMsChange ? (
        <SliderRow
          label="Tail padding"
          value={tailMs}
          min={AUDIO_TAIL_RANGE.min}
          max={AUDIO_TAIL_RANGE.max}
          step={10}
          unit="ms"
          onChange={onTailMsChange}
        />
      ) : null}
      {showEnvelope &&
      typeof attackMs === "number" &&
      onAttackMsChange &&
      typeof releaseMs === "number" &&
      onReleaseMsChange ? (
        <>
          <SliderRow
            label="Attack"
            value={attackMs}
            min={AUDIO_ATTACK_RANGE.min}
            max={AUDIO_ATTACK_RANGE.max}
            step={1}
            unit="ms"
            onChange={onAttackMsChange}
            disabled={!pitchEditable}
          />
          <SliderRow
            label="Release"
            value={releaseMs}
            min={AUDIO_RELEASE_RANGE.min}
            max={AUDIO_RELEASE_RANGE.max}
            step={1}
            unit="ms"
            onChange={onReleaseMsChange}
            disabled={!pitchEditable}
          />
        </>
      ) : null}
    </div>
  );
}

function LabeledSelect({
  children,
  id,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#fffaf2] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      >
        {children}
      </select>
    </div>
  );
}
