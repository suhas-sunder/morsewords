import * as React from "react";

import {
  MORSE_AUDIO_SPLIT_PRESET_MINUTES,
  validateCustomMorseAudioSplitMinutes,
  type MorseAudioSplitMode,
} from "./morseExportPlan";

export type AudioExportFormat = "mp3" | "wav";

const splitModeLabels: Record<MorseAudioSplitMode, string> = {
  none: "No split",
  duration: "Split by duration",
  custom: "Custom split time",
};

/**
 * Shared, deliberately small format/split policy control. Individual tools
 * retain their own audio settings, preview, and download button while this
 * keeps exported-file semantics identical across route families.
 */
export default function AudioExportFormatSplitControls({
  customMinutes,
  disabled = false,
  format,
  idPrefix,
  onCustomMinutesChange,
  onFormatChange,
  onPresetMinutesChange,
  onSplitModeChange,
  presetMinutes,
  splitMode,
}: {
  customMinutes: string;
  disabled?: boolean;
  format: AudioExportFormat;
  idPrefix: string;
  onCustomMinutesChange: (value: string) => void;
  onFormatChange: (value: AudioExportFormat) => void;
  onPresetMinutesChange: (value: number) => void;
  onSplitModeChange: (value: MorseAudioSplitMode) => void;
  presetMinutes: number;
  splitMode: MorseAudioSplitMode;
}) {
  const customError =
    splitMode === "custom"
      ? validateCustomMorseAudioSplitMinutes(customMinutes)
      : "";
  const canUseCustom = !customError;
  const formatId = `${idPrefix}-output-format`;
  const durationId = `${idPrefix}-split-duration`;
  const customId = `${idPrefix}-custom-split-duration`;
  const customErrorId = `${customId}-error`;

  return (
    <div className="grid gap-4" data-testid="audio-export-format-split-controls">
      <div>
        <label htmlFor={formatId} className="text-sm font-semibold text-slate-700">
          Output format
        </label>
        <select
          id={formatId}
          value={format}
          disabled={disabled}
          onChange={(event) => onFormatChange(event.target.value as AudioExportFormat)}
          className="mt-2 w-full cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#fffaf2] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>
      </div>

      <fieldset disabled={disabled}>
        <legend className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Split mode
        </legend>
        <div
          className="mt-2 flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Split mode"
        >
          {(Object.keys(splitModeLabels) as MorseAudioSplitMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={splitMode === mode}
              disabled={disabled}
              onClick={() => onSplitModeChange(mode)}
              className={`min-h-10 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                splitMode === mode
                  ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                  : "bg-[#fffdf8] text-slate-900 hover:bg-[#fffaf2] hover:text-sky-950"
              }`}
            >
              {splitModeLabels[mode]}
              {mode === "custom" ? (
                <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">
                  Experimental
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </fieldset>

      {splitMode === "duration" ? (
        <div>
          <label htmlFor={durationId} className="text-sm font-semibold text-slate-700">
            Part duration
          </label>
          <select
            id={durationId}
            value={String(presetMinutes)}
            disabled={disabled}
            onChange={(event) => onPresetMinutesChange(Number(event.target.value))}
            className="mt-2 w-full cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#fffaf2] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {MORSE_AUDIO_SPLIT_PRESET_MINUTES.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {splitMode === "custom" ? (
        <div>
          <label htmlFor={customId} className="text-sm font-semibold text-slate-700">
            Custom part duration
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              id={customId}
              inputMode="decimal"
              type="number"
              min="1"
              max="240"
              step="1"
              value={customMinutes}
              disabled={disabled}
              aria-invalid={!canUseCustom}
              aria-describedby={customError ? customErrorId : undefined}
              onChange={(event) => onCustomMinutesChange(event.target.value)}
              className="min-w-0 flex-1 rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span className="text-sm font-semibold text-slate-600">minutes</span>
          </div>
          {customError ? (
            <p id={customErrorId} role="alert" className="mt-2 text-sm font-semibold text-slate-700">
              {customError}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Experimental targets still keep Morse, word, paragraph, and safe
              encoder boundaries intact.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
