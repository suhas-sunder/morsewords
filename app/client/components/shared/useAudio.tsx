import * as React from "react";

import useMorseAudio, {
  type PlayOptions as MorsePlayOptions,
  type RenderWavOptions as MorseRenderWavOptions,
  type SoundPreset as MorseSoundPreset,
} from "~/client/components/shared/useMorseAudio";
import {
  sanitizeAudioGeneratorPreset,
} from "~/client/components/shared/morseSettings";
import type { AudioTonePresetId } from "~/client/components/shared/audioPresetRegistry";

export type SoundPreset = AudioTonePresetId;

export type MorsePlayerState = "idle" | "playing" | "paused";

export type PlayOptions = {
  code: string;
  /** Character speed in WPM. Determines dit length. */
  wpm: number;
  /** Farnsworth speed in WPM. Slows spacing only. If omitted, equals wpm. */
  farnsworthWpm?: number;
  /** Tone frequency (Hz) for oscillator-based presets. */
  hz: number;
  /** 0..1 */
  volume: number;
  preset?: SoundPreset;
  repeat?: boolean;
  attackMs?: number;
  releaseMs?: number;
  /** Flash the screen on dits/dahs (mobile-friendly). */
  flash?: boolean;

  /**
   * Deprecated. Vibration support intentionally removed.
   * Kept only so existing callers don't break.
   */
  vibrate?: boolean;

  /**
   * If false, playback is silent but timing/flash still runs.
   * Defaults to true.
   */
  soundEnabled?: boolean;
};

function mapPreset(preset: unknown): MorseSoundPreset {
  return sanitizeAudioGeneratorPreset(preset) as MorseSoundPreset;
}

function toMorseOptions(opts: PlayOptions): MorsePlayOptions {
  return {
    ...opts,
    preset: mapPreset(opts.preset),
    vibrate: false,
  };
}

function toMorsePartialOptions(
  partial: Partial<PlayOptions>,
): Partial<MorsePlayOptions> {
  const { preset, ...rest } = partial;
  const next: Partial<MorsePlayOptions> = {
    ...rest,
    vibrate: false,
  };

  if ("preset" in partial) {
    next.preset = mapPreset(preset);
  }

  return next;
}

/**
 * Compatibility wrapper for the original translator audio API.
 *
 * `useMorseAudio` is the single playback/export engine. This compatibility
 * wrapper preserves the original translator API while accepting the canonical
 * preset registry, including legacy preset aliases stored by older pages.
 */
export default function useAudio() {
  const player = useMorseAudio();

  const play = React.useCallback(
    (opts: PlayOptions) => player.play(toMorseOptions(opts)),
    [player],
  );

  const playMorse = React.useCallback(
    (code: string, wpm: number, hz: number, _wordGapUnits = 7) =>
      play({
        code,
        wpm,
        hz,
        volume: 0.75,
        preset: "cw_radio",
        soundEnabled: true,
      }),
    [play],
  );

  const renderWav = React.useCallback(
    (opts: PlayOptions): Promise<Blob> =>
      player.renderWav(toMorseOptions(opts) as MorseRenderWavOptions),
    [player],
  );

  const setLiveOptions = React.useCallback(
    (partial: Partial<PlayOptions>) => {
      player.setLiveOptions(toMorsePartialOptions(partial));
    },
    [player],
  );

  return React.useMemo(
    () => ({
      state: player.state as MorsePlayerState,
      isSupported: player.isSupported,
      play,
      pause: player.pause,
      resume: player.resume,
      stop: player.stop,
      playMorse,
      renderWav,
      setLiveOptions,
    }),
    [
      player.state,
      player.isSupported,
      play,
      player.pause,
      player.resume,
      player.stop,
      playMorse,
      renderWav,
      setLiveOptions,
    ],
  );
}
