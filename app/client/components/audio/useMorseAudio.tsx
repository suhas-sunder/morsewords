import * as React from "react";

export type SoundPreset =
  | "cw_radio"
  | "sine"
  | "square"
  | "triangle"
  | "sawtooth"
  | "sounder";

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
  /** Waveform or sound style. */
  preset?: SoundPreset;
  /** Repeat playback until stopped. */
  repeat?: boolean;

  /** Optional envelope settings (milliseconds). */
  attackMs?: number;
  releaseMs?: number;

  /** Flash the screen on dits/dahs (mobile-friendly). */
  flash?: boolean;
  /** Vibrate on dits/dahs (mobile-friendly). */
  vibrate?: boolean;
};

export type RenderWavOptions = Omit<PlayOptions, "repeat" | "flash" | "vibrate"> & {
  /** Output sample rate (Hz). Default 44100. */
  sampleRate?: 22050 | 44100 | 48000;
  /** Add silence at the end to avoid clipped tails. Default 120ms. */
  tailMs?: number;
};

type InternalPosition = {
  tokenIndex: number;
  symbolIndex: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function ditMs(wpm: number) {
  // Standard: dit length in ms is 1200 / WPM (PARIS standard word)
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

function presetToOscType(preset: SoundPreset): OscillatorType {
  if (preset === "square") return "square";
  if (preset === "triangle") return "triangle";
  if (preset === "sawtooth") return "sawtooth";
  return "sine";
}

function defaultAttackMs(preset: SoundPreset) {
  // Keep CW snappy; let musical waveforms be slightly softer
  if (preset === "cw_radio") return 8;
  if (preset === "sounder") return 0;
  return 10;
}

function defaultReleaseMs(preset: SoundPreset) {
  if (preset === "cw_radio") return 12;
  if (preset === "sounder") return 0;
  return 14;
}

/**
 * Morse audio engine focused on playback quality and export.
 * - Real-time playback uses AudioContext and a click-safe envelope.
 * - Export uses OfflineAudioContext for consistent timing.
 */
export default function useMorseAudio() {
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterGainRef = React.useRef<GainNode | null>(null);

  const stopRef = React.useRef(false);
  const pausedRef = React.useRef(false);
  const playingRef = React.useRef(false);
  const repeatRef = React.useRef(false);

  const posRef = React.useRef<InternalPosition>({ tokenIndex: 0, symbolIndex: 0 });

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
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.gain.value = 0.25;
      masterGainRef.current.connect(ctx.destination);
    }
    return ctx;
  }

  async function waitWhilePaused() {
    while (pausedRef.current && !stopRef.current) {
      await sleep(40);
    }
  }

  function triggerFlash(ms: number) {
    window.dispatchEvent(new CustomEvent("morsewords:flash", { detail: { ms } }));
  }

  function triggerVibrate(ms: number) {
    if (typeof navigator === "undefined" || !navigator.vibrate) return;
    try {
      navigator.vibrate(ms);
    } catch {
      // ignore
    }
  }

  async function playTone(params: {
    ms: number;
    hz: number;
    preset: SoundPreset;
    volume: number;
    attackMs: number;
    releaseMs: number;
  }) {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }

    const master = masterGainRef.current;
    if (!master) return;

    const osc = ctx.createOscillator();
    osc.type = presetToOscType(params.preset);
    osc.frequency.value = params.hz;

    const localGain = ctx.createGain();
    // Conservative scaling so volume feels usable across devices
    const target = clamp(params.volume, 0, 1) * 0.38;

    osc.connect(localGain).connect(master);

    const now = ctx.currentTime;
    const attackS = clamp(params.attackMs, 0, 200) / 1000;
    const releaseS = clamp(params.releaseMs, 0, 400) / 1000;

    localGain.gain.cancelScheduledValues(now);
    localGain.gain.setValueAtTime(0.0001, now);
    localGain.gain.exponentialRampToValueAtTime(Math.max(0.001, target), now + Math.max(0.001, attackS));

    osc.start();

    await sleep(params.ms);

    const t2 = ctx.currentTime;
    localGain.gain.cancelScheduledValues(t2);
    localGain.gain.setValueAtTime(Math.max(0.001, target), t2);
    localGain.gain.exponentialRampToValueAtTime(0.0001, t2 + Math.max(0.001, releaseS));

    await sleep(Math.max(0, params.releaseMs) + 10);
    osc.stop();
  }

  async function playSounder(ms: number, volume: number) {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }
    const master = masterGainRef.current;
    if (!master) return;

    // Telegraph sounder: filtered noise burst
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
    localGain.gain.value = clamp(volume, 0, 1) * 0.5;

    src.connect(biquad).connect(localGain).connect(master);
    src.start();
    await sleep(ms);
    try {
      src.stop();
    } catch {
      // ignore
    }
  }

  async function runOnce(opts: PlayOptions) {
    const unit = ditMs(opts.wpm);
    const mult = farnsworthMultiplier(opts.wpm, opts.farnsworthWpm);
    const letterGapUnits = Math.round(3 * mult);
    const wordGapUnits = Math.round(7 * mult);

    const preset = opts.preset ?? "cw_radio";
    const attackMs = opts.attackMs ?? defaultAttackMs(preset);
    const releaseMs = opts.releaseMs ?? defaultReleaseMs(preset);

    const code = normalizeMorseInput(opts.code);
    const parts = code.split(/(\s+)/);

    for (let i = posRef.current.tokenIndex; i < parts.length; i++) {
      if (stopRef.current) break;
      await waitWhilePaused();

      const token = parts[i];
      posRef.current.tokenIndex = i;

      if (!token) continue;

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

        const ch = token[s];
        if (ch !== "." && ch !== "-") continue;

        const dur = ch === "." ? unit : 3 * unit;
        if (opts.flash) triggerFlash(dur);
        if (opts.vibrate) triggerVibrate(dur);

        if (preset === "sounder") {
          await playSounder(dur, opts.volume);
        } else {
          await playTone({
            ms: dur,
            hz: opts.hz,
            preset,
            volume: opts.volume,
            attackMs,
            releaseMs,
          });
        }

        // intra-character gap
        if (s < token.length - 1) await sleep(unit);
      }

      // reset symbol position when moving to next token
      posRef.current.symbolIndex = 0;
    }
  }

  async function play(opts: PlayOptions) {
    const safePreset: SoundPreset = (opts.preset ?? "cw_radio") as SoundPreset;

    const safeOpts: PlayOptions = {
      ...opts,
      preset: safePreset,
      wpm: clamp(opts.wpm, 5, 60),
      farnsworthWpm: opts.farnsworthWpm ? clamp(opts.farnsworthWpm, 5, 60) : undefined,
      hz: clamp(opts.hz, 200, 1600),
      volume: clamp(opts.volume, 0, 1),
      repeat: !!opts.repeat,
      flash: !!opts.flash,
      vibrate: !!opts.vibrate,
      attackMs: clamp(opts.attackMs ?? defaultAttackMs(safePreset), 0, 200),
      releaseMs: clamp(opts.releaseMs ?? defaultReleaseMs(safePreset), 0, 400),
    };

    stopRef.current = false;
    pausedRef.current = false;
    playingRef.current = true;
    repeatRef.current = !!safeOpts.repeat;
    posRef.current = { tokenIndex: 0, symbolIndex: 0 };

    setState("playing");

    do {
      await runOnce(safeOpts);
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

  function estimateDurationMs(opts: {
    code: string;
    wpm: number;
    farnsworthWpm?: number;
  }) {
    const code = normalizeMorseInput(opts.code);
    const unit = ditMs(opts.wpm);
    const mult = farnsworthMultiplier(opts.wpm, opts.farnsworthWpm);
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

    return Math.max(0, Math.round(totalMs));
  }

  /** Render a WAV file for sharing/downloading without realtime playback jitter. */
  async function renderWav(opts: RenderWavOptions): Promise<Blob> {
    const preset: SoundPreset = (opts.preset ?? "cw_radio") as SoundPreset;
    const code = normalizeMorseInput(opts.code);

    const unit = ditMs(opts.wpm);
    const mult = farnsworthMultiplier(opts.wpm, opts.farnsworthWpm);
    const letterGapUnits = Math.round(3 * mult);
    const wordGapUnits = Math.round(7 * mult);

    const sr = opts.sampleRate ?? 44100;
    const tailMs = opts.tailMs ?? 120;

    const totalMs = estimateDurationMs({
      code,
      wpm: opts.wpm,
      farnsworthWpm: opts.farnsworthWpm,
    });

    const totalWithTail = totalMs + tailMs;
    const length = Math.ceil((totalWithTail / 1000) * sr);
    const offline = new OfflineAudioContext(1, Math.max(1, length), sr);

    const master = offline.createGain();
    master.gain.value = 1;
    master.connect(offline.destination);

    const parts = code.split(/(\s+)/);
    let t = 0;
    const unitS = unit / 1000;

    const attackS = (clamp(opts.attackMs ?? defaultAttackMs(preset), 0, 200) / 1000) || 0.001;
    const releaseS = (clamp(opts.releaseMs ?? defaultReleaseMs(preset), 0, 400) / 1000) || 0.001;

    const hz = clamp(opts.hz, 200, 1600);
    const amp = clamp(opts.volume, 0, 1) * 0.38;

    function addOscTone(durS: number) {
      const osc = offline.createOscillator();
      osc.type = presetToOscType(preset);
      osc.frequency.value = hz;

      const localGain = offline.createGain();
      localGain.gain.setValueAtTime(0.0001, t);

      // Attack and release envelope for click reduction
      localGain.gain.exponentialRampToValueAtTime(Math.max(0.001, amp), t + Math.max(0.001, attackS));
      localGain.gain.setValueAtTime(Math.max(0.001, amp), Math.max(t, t + durS - Math.max(0.001, releaseS)));
      localGain.gain.exponentialRampToValueAtTime(0.0001, t + durS);

      osc.connect(localGain).connect(master);
      osc.start(t);
      osc.stop(t + durS);
    }

    function addSounder(durS: number) {
      // Noise burst with fixed filtering to mimic mechanical click
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

      const localGain = offline.createGain();
      localGain.gain.value = clamp(opts.volume, 0, 1) * 0.5;

      src.connect(biquad).connect(localGain).connect(master);
      src.start(t);
      src.stop(t + durS);
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
        if (preset === "sounder") addSounder(durS);
        else addOscTone(durS);

        t += durS;
        if (i < token.length - 1) t += unitS;
      }
    }

    const rendered = await offline.startRendering();
    return audioBufferToWavBlob(rendered);
  }

  return {
    state,
    isSupported:
      typeof window !== "undefined" &&
      !!(window.AudioContext || (window as any).webkitAudioContext),
    play,
    pause,
    resume,
    stop,
    renderWav,
    estimateDurationMs,
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
