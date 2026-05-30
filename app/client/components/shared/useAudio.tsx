import * as React from "react";
import {
  buildMorseEvents,
  getMorseEventDurationMs,
  type MorseTimingEvent,
} from "~/client/components/shared/morseTiming";
import { areFlashEffectsDisabled } from "~/client/settings/displaySettings";

export type SoundPreset =
  | "cw_radio"
  | "smooth_sine"
  | "bright_square"
  | "telegraph_sounder";

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

type InternalPosition = {
  eventIndex: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function playbackEventMs(event: MorseTimingEvent, opts: PlayOptions) {
  return getMorseEventDurationMs(event, {
    charWpm: opts.wpm,
    farnsworthWpm: opts.farnsworthWpm,
  });
}

/**
 * Mobile-first Morse audio player.
 *
 * Backwards compatible with the old API:
 * - playMorse(code, wpm, hz, wordGapUnits?)
 * - stop()
 */
export default function useAudio() {
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterGainRef = React.useRef<GainNode | null>(null);

  // Hydration-safe support detection.
  // Do not read `window` during SSR or the first client render.
  const [isSupported, setIsSupported] = React.useState(false);

  const stopRef = React.useRef(false);
  const pausedRef = React.useRef(false);
  const playingRef = React.useRef(false);
  const repeatRef = React.useRef(false);

  const posRef = React.useRef<InternalPosition>({ eventIndex: 0 });
  const lastCodeRef = React.useRef<string>("");
  const liveOptsRef = React.useRef<PlayOptions | null>(null);

  const [state, setState] = React.useState<MorsePlayerState>("idle");

  function ensureCtx() {
    if (!ctxRef.current) {
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as
        | typeof AudioContext
        | undefined;
      if (!Ctx) return null;
      ctxRef.current = new Ctx();
    }
    const ctx = ctxRef.current;
    if (!ctx) return null;

    if (!masterGainRef.current) {
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(ctx.destination);
      masterGainRef.current = g;
    }
    return ctx;
  }

  function triggerFlash(ms: number) {
    if (areFlashEffectsDisabled()) return;
    window.dispatchEvent(new CustomEvent("morsewords:flash", { detail: { ms } }));
  }

  function sanitize(opts: PlayOptions): PlayOptions {
    return {
      ...opts,
      wpm: clamp(opts.wpm, 5, 60),
      farnsworthWpm: opts.farnsworthWpm ? clamp(opts.farnsworthWpm, 5, 60) : undefined,
      hz: clamp(opts.hz, 200, 1200),
      volume: clamp(opts.volume, 0, 1),
      repeat: !!opts.repeat,
      flash: !!opts.flash && !areFlashEffectsDisabled(),
      // vibrate is intentionally ignored
      vibrate: false,
      soundEnabled: opts.soundEnabled !== false,
    };
  }

  function applyMasterFromOpts(opts: PlayOptions) {
    const ctx = ensureCtx();
    if (!ctx) return;
    const g = masterGainRef.current;
    if (!g) return;

    const safe = sanitize(opts);
    const effective = safe.soundEnabled === false ? 0 : safe.volume * 0.35;
    const now = ctx.currentTime;
    g.gain.cancelScheduledValues(now);
    g.gain.setTargetAtTime(effective, now, 0.02);
  }

  function getLive(base: PlayOptions) {
    return sanitize(liveOptsRef.current ?? base);
  }

  async function ensureRunning() {
    const ctx = ensureCtx();
    if (!ctx) return null;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }
    return ctx;
  }

  async function waitWhilePaused() {
    while (pausedRef.current && !stopRef.current) {
      await sleep(40);
    }
  }

  async function playTone(ms: number, hz: number, oscType: OscillatorType) {
    const ctx = await ensureRunning();
    if (!ctx) return;
    const master = masterGainRef.current;
    if (!master) return;

    // If muted, keep timing correct without scheduling audio.
    if (master.gain.value <= 0.000001) {
      await sleep(ms);
      return;
    }

    const osc = ctx.createOscillator();
    osc.type = oscType;
    osc.frequency.value = hz;

    // Per-tone envelope so mute is truly silent.
    const env = ctx.createGain();
    env.gain.value = 0;
    osc.connect(env).connect(master);

    const now = ctx.currentTime;
    env.gain.cancelScheduledValues(now);
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(1, now + 0.008);

    osc.start();
    await sleep(ms);

    const t2 = ctx.currentTime;
    env.gain.cancelScheduledValues(t2);
    env.gain.setValueAtTime(env.gain.value, t2);
    env.gain.linearRampToValueAtTime(0, t2 + 0.012);

    await sleep(18);
    try {
      osc.stop();
    } catch {
      // ignore
    }
  }

  async function playSounder(ms: number) {
    const ctx = await ensureRunning();
    if (!ctx) return;
    const master = masterGainRef.current;
    if (!master) return;

    if (master.gain.value <= 0.000001) {
      await sleep(ms);
      return;
    }

    const bufferSize = Math.max(256, Math.floor((ctx.sampleRate * ms) / 1000));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = 1 - i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const biquad = ctx.createBiquadFilter();
    biquad.type = "bandpass";
    biquad.frequency.value = 1100;
    biquad.Q.value = 1.5;

    const localGain = ctx.createGain();
    localGain.gain.value = 1;

    src.connect(biquad).connect(localGain).connect(master);
    src.start();
    await sleep(ms);
    try {
      src.stop();
    } catch {
      // ignore
    }
  }

  async function runOnce(baseOpts: PlayOptions) {
    const events = buildMorseEvents(baseOpts.code, {
      charWpm: baseOpts.wpm,
      farnsworthWpm: baseOpts.farnsworthWpm,
    });

    for (let i = posRef.current.eventIndex; i < events.length; i++) {
      if (stopRef.current) break;
      await waitWhilePaused();

      const event = events[i];
      posRef.current.eventIndex = i;

      if (event.type === "gap") {
        const live = getLive(baseOpts);
        await sleep(playbackEventMs(event, live));
        posRef.current.eventIndex = i + 1;
        continue;
      }

      // Pull latest settings each symbol.
      const live = getLive(baseOpts);
      applyMasterFromOpts(live);

      const livePreset = live.preset ?? "cw_radio";
      const liveOscType: OscillatorType =
        livePreset === "bright_square" ? "square" : "sine";
      const dur = playbackEventMs(event, live);
      if (live.flash) triggerFlash(dur);

      if (livePreset === "telegraph_sounder") await playSounder(dur);
      else await playTone(dur, live.hz, liveOscType);

      posRef.current.eventIndex = i + 1;
    }
  }

  async function play(opts: PlayOptions) {
    const safe = sanitize(opts);

    lastCodeRef.current = safe.code;
    liveOptsRef.current = safe;

    stopRef.current = false;
    pausedRef.current = false;
    playingRef.current = true;
    repeatRef.current = !!safe.repeat;
    posRef.current = { eventIndex: 0 };

    setState("playing");
    applyMasterFromOpts(safe);

    do {
      await runOnce(safe);
      if (stopRef.current) break;
      posRef.current = { eventIndex: 0 };
      if (repeatRef.current) await sleep(160);
    } while (repeatRef.current);

    playingRef.current = false;
    pausedRef.current = false;
    stopRef.current = false;
    repeatRef.current = false;
    setState("idle");
  }

  function pause() {
    if (!playingRef.current) return;
    pausedRef.current = true;
    setState("paused");
  }

  function resume() {
    if (!playingRef.current) return;
    pausedRef.current = false;
    setState("playing");
  }

  function stop() {
    stopRef.current = true;
    pausedRef.current = false;
    repeatRef.current = false;
    setState("idle");
  }

  // Back-compat API
  async function playMorse(code: string, wpm: number, hz: number, _wordGapUnits = 7) {
    return play({ code, wpm, hz, volume: 0.75, preset: "cw_radio", soundEnabled: true });
  }

  /** Update options live during playback (applies immediately). */
  function setLiveOptions(partial: Partial<PlayOptions>) {
    if (!liveOptsRef.current) return;
    liveOptsRef.current = { ...liveOptsRef.current, ...partial };
    if (playingRef.current) applyMasterFromOpts(liveOptsRef.current);
  }

  /** Render a WAV file for sharing/downloading without realtime playback jitter. */
  async function renderWav(opts: PlayOptions): Promise<Blob> {
    const safe = sanitize(opts);
    const events = buildMorseEvents(safe.code, {
      charWpm: safe.wpm,
      farnsworthWpm: safe.farnsworthWpm,
    });
    const totalMs = events.reduce((total, event) => total + event.ms, 0);

    const sr = 44100;
    const length = Math.ceil((totalMs / 1000) * sr);
    const offline = new OfflineAudioContext(1, Math.max(1, length), sr);

    const master = offline.createGain();
    const effective = safe.soundEnabled === false ? 0 : safe.volume * 0.35;
    master.gain.value = effective;
    master.connect(offline.destination);

    const preset = safe.preset ?? "cw_radio";
    const oscType: OscillatorType = preset === "bright_square" ? "square" : "sine";

    let t = 0;

    function addTone(durS: number) {
      if (effective <= 0.000001) return;

      if (preset === "telegraph_sounder") {
        const bufferSize = Math.max(256, Math.floor(offline.sampleRate * durS));
        const buffer = offline.createBuffer(1, bufferSize, offline.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const env = 1 - i / bufferSize;
          data[i] = (Math.random() * 2 - 1) * env;
        }
        const src = offline.createBufferSource();
        src.buffer = buffer;
        const biquad = offline.createBiquadFilter();
        biquad.type = "bandpass";
        biquad.frequency.value = 1100;
        biquad.Q.value = 1.5;
        src.connect(biquad).connect(master);
        src.start(t);
        src.stop(t + durS);
        return;
      }

      const osc = offline.createOscillator();
      osc.type = oscType;
      osc.frequency.value = clamp(safe.hz, 200, 1200);

      const env = offline.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(1, t + 0.008);
      env.gain.linearRampToValueAtTime(0, t + Math.max(0.008, durS - 0.012));

      osc.connect(env).connect(master);
      osc.start(t);
      osc.stop(t + durS);
    }

    for (const event of events) {
      const durS = event.ms / 1000;
      if (event.type === "mark") {
        addTone(durS);
      }
      t += durS;
    }

    const rendered = await offline.startRendering();
    return audioBufferToWavBlob(rendered);
  }

  React.useEffect(() => {
    // Runs only on the client after mount.
    try {
      setIsSupported(!!(window.AudioContext || (window as any).webkitAudioContext));
    } catch {
      setIsSupported(false);
    }
  }, []);

  return {
    state,
    isSupported,
    play,
    pause,
    resume,
    stop,
    playMorse,
    renderWav,
    setLiveOptions,
  };
}

function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const samples = buffer.length;
  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples * blockAlign;

  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  let offset = 0;
  function writeString(s: string) {
    for (let i = 0; i < s.length; i++) {
      view.setUint8(offset + i, s.charCodeAt(i));
    }
    offset += s.length;
  }

  writeString("RIFF");
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, format, true);
  offset += 2;
  view.setUint16(offset, numChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, byteRate, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, bitDepth, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, dataSize, true);
  offset += 4;

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let idx = 0;
  for (let i = 0; i < samples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = clamp(channels[c][i], -1, 1);
      const s = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(headerSize + idx, s, true);
      idx += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
