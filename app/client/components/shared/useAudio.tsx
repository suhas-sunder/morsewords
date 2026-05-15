import * as React from "react";
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
  tokenIndex: number;
  symbolIndex: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function ditMs(wpm: number) {
  return 1200 / clamp(wpm, 1, 80);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function farnsworthMultiplier(charWpm: number, fwpm?: number) {
  if (!fwpm) return 1;
  const c = clamp(charWpm, 1, 80);
  const f = clamp(fwpm, 1, 80);
  return f < c ? c / f : 1;
}

function normalizeMorseInput(code: string) {
  return (code || "")
    .replace(/[·•]/g, ".")
    .replace(/[–—−]/g, "-")
    .replace(/\s*\/\s*/g, "       ") // treat slash as word gap
    .replace(/\t/g, " ")
    .replace(/\r\n|\r/g, "\n")
    .trim();
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

  const posRef = React.useRef<InternalPosition>({ tokenIndex: 0, symbolIndex: 0 });
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
    const code = normalizeMorseInput(baseOpts.code);
    const parts = code.split(/(\s+)/);

    for (let i = posRef.current.tokenIndex; i < parts.length; i++) {
      if (stopRef.current) break;
      await waitWhilePaused();

      const token = parts[i];
      posRef.current.tokenIndex = i;
      if (!token) continue;

      // Always read live opts before timing decisions.
      const opts = getLive(baseOpts);
      const unit = ditMs(opts.wpm);
      const mult = farnsworthMultiplier(opts.wpm, opts.farnsworthWpm);
      const letterGapUnits = Math.round(3 * mult);
      const wordGapUnits = Math.round(7 * mult);

      const preset = opts.preset ?? "cw_radio";
      const oscType: OscillatorType = preset === "bright_square" ? "square" : "sine";

      if (/^\s+$/.test(token)) {
        const spaces = token.length;
        const units = spaces >= 7 ? wordGapUnits : spaces >= 3 ? letterGapUnits : 1;
        posRef.current.symbolIndex = 0;
        await sleep(units * unit);
        continue;
      }

      for (let s = posRef.current.symbolIndex; s < token.length; s++) {
        if (stopRef.current) break;
        await waitWhilePaused();
        posRef.current.symbolIndex = s;

        // Pull latest settings each symbol.
        const live = getLive(baseOpts);
        applyMasterFromOpts(live);

        const liveUnit = ditMs(live.wpm);
        const livePreset = live.preset ?? "cw_radio";
        const liveOscType: OscillatorType =
          livePreset === "bright_square" ? "square" : "sine";

        const ch = token[s];
        if (ch !== "." && ch !== "-") continue;

        const dur = ch === "." ? liveUnit : 3 * liveUnit;
        if (live.flash) triggerFlash(dur);

        if (livePreset === "telegraph_sounder") await playSounder(dur);
        else await playTone(dur, live.hz, liveOscType);

        if (s < token.length - 1) await sleep(liveUnit);
      }

      posRef.current.symbolIndex = 0;
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
    posRef.current = { tokenIndex: 0, symbolIndex: 0 };

    setState("playing");
    applyMasterFromOpts(safe);

    do {
      await runOnce(safe);
      if (stopRef.current) break;
      posRef.current = { tokenIndex: 0, symbolIndex: 0 };
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
    const code = normalizeMorseInput(safe.code);
    const unit = ditMs(safe.wpm);
    const mult = farnsworthMultiplier(safe.wpm, safe.farnsworthWpm);
    const letterGapUnits = Math.round(3 * mult);
    const wordGapUnits = Math.round(7 * mult);

    const parts = code.split(/(\s+)/);
    let totalMs = 0;
    for (const token of parts) {
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        const spaces = token.length;
        const units = spaces >= 7 ? wordGapUnits : spaces >= 3 ? letterGapUnits : 1;
        totalMs += units * unit;
        continue;
      }
      for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        if (ch !== "." && ch !== "-") continue;
        totalMs += ch === "." ? unit : 3 * unit;
        if (i < token.length - 1) totalMs += unit;
      }
    }

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
    const unitS = unit / 1000;

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

    for (const token of parts) {
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        const spaces = token.length;
        const units = spaces >= 7 ? wordGapUnits : spaces >= 3 ? letterGapUnits : 1;
        t += units * unitS;
        continue;
      }
      for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        if (ch !== "." && ch !== "-") continue;
        const durS = ch === "." ? unitS : 3 * unitS;
        addTone(durS);
        t += durS;
        if (i < token.length - 1) t += unitS;
      }
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
