import * as React from "react";

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
  /** Vibrate on dits/dahs (mobile-friendly). */
  vibrate?: boolean;
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
  const [isSupported, setIsSupported] = React.useState(false);

  React.useEffect(() => {
    // Hydration-safe: detect support after mount.
    setIsSupported(!!(window.AudioContext || (window as any).webkitAudioContext));
  }, []);

  const ctxRef = React.useRef<AudioContext | null>(null);
  const gainRef = React.useRef<GainNode | null>(null);

  const stopRef = React.useRef(false);
  const pausedRef = React.useRef(false);
  const playingRef = React.useRef(false);
  const repeatRef = React.useRef(false);

  const posRef = React.useRef<InternalPosition>({ tokenIndex: 0, symbolIndex: 0 });
  const lastCodeRef = React.useRef<string>("");
  const lastOptsRef = React.useRef<PlayOptions | null>(null);

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
    if (!gainRef.current) {
      gainRef.current = ctx.createGain();
      gainRef.current.gain.value = 0.25;
      gainRef.current.connect(ctx.destination);
    }
    return ctx;
  }

  async function waitWhilePaused() {
    while (pausedRef.current && !stopRef.current) {
      await sleep(40);
    }
  }

  async function playTone(ms: number, hz: number, oscType: OscillatorType, volume: number) {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }
    const gain = gainRef.current;
    if (!gain) return;

    const osc = ctx.createOscillator();
    osc.type = oscType;
    osc.frequency.value = hz;
    osc.connect(gain);

    // Envelope (quick attack/release avoids clicks and feels cleaner)
    const now = ctx.currentTime;
    const target = clamp(volume, 0, 1) * 0.35;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0005, gain.gain.value), now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, target), now + 0.008);

    osc.start();
    await sleep(ms);

    const t2 = ctx.currentTime;
    gain.gain.cancelScheduledValues(t2);
    gain.gain.setValueAtTime(Math.max(0.001, target), t2);
    gain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.012);
    await sleep(18);
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
    const gain = gainRef.current;
    if (!gain) return;

    // Telegraph sounder-like click using filtered noise burst
    const bufferSize = Math.max(256, Math.floor((ctx.sampleRate * ms) / 1000));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Decaying noise
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
    const target = clamp(volume, 0, 1) * 0.45;
    localGain.gain.value = target;

    src.connect(biquad).connect(localGain).connect(gain);
    src.start();
    await sleep(ms);
    try {
      src.stop();
    } catch {
      // ignore
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

  async function runOnce(opts: PlayOptions) {
    const unit = ditMs(opts.wpm);
    const mult = farnsworthMultiplier(opts.wpm, opts.farnsworthWpm);
    const letterGapUnits = Math.round(3 * mult);
    const wordGapUnits = Math.round(7 * mult);

    const preset = opts.preset ?? "cw_radio";
    const oscType: OscillatorType =
      preset === "bright_square" ? "square" : preset === "cw_radio" ? "sine" : "sine";

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

        if (preset === "telegraph_sounder") await playSounder(dur, opts.volume);
        else await playTone(dur, opts.hz, oscType, opts.volume);

        // intra-character gap
        if (s < token.length - 1) await sleep(unit);
      }

      // reset symbol position when moving to next token
      posRef.current.symbolIndex = 0;
    }
  }

  async function play(opts: PlayOptions) {
    const safeOpts: PlayOptions = {
      ...opts,
      wpm: clamp(opts.wpm, 5, 60),
      farnsworthWpm: opts.farnsworthWpm ? clamp(opts.farnsworthWpm, 5, 60) : undefined,
      hz: clamp(opts.hz, 200, 1200),
      volume: clamp(opts.volume, 0, 1),
      repeat: !!opts.repeat,
      flash: !!opts.flash,
      vibrate: !!opts.vibrate,
    };

    lastCodeRef.current = safeOpts.code;
    lastOptsRef.current = safeOpts;

    // If already playing, restart from the top.
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
      // small gap between repeats
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
    return play({ code, wpm, hz, volume: 0.75, preset: "cw_radio" });
  }

  /** Render a WAV file for sharing/downloading without realtime playback jitter. */
  async function renderWav(opts: PlayOptions): Promise<Blob> {
    const code = normalizeMorseInput(opts.code);
    const unit = ditMs(opts.wpm);
    const mult = farnsworthMultiplier(opts.wpm, opts.farnsworthWpm);
    const letterGapUnits = Math.round(3 * mult);
    const wordGapUnits = Math.round(7 * mult);

    // Estimate total duration
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
    const gain = offline.createGain();
    gain.gain.value = clamp(opts.volume, 0, 1) * 0.35;
    gain.connect(offline.destination);

    const preset = opts.preset ?? "cw_radio";
    const oscType: OscillatorType = preset === "bright_square" ? "square" : "sine";

    let t = 0;
    const unitS = unit / 1000;

    function addTone(durS: number) {
      if (preset === "telegraph_sounder") {
        // very short noise click
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
        src.connect(biquad).connect(gain);
        src.start(t);
        src.stop(t + durS);
        return;
      }

      const osc = offline.createOscillator();
      osc.type = oscType;
      osc.frequency.value = clamp(opts.hz, 200, 1200);
      osc.connect(gain);
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

  return {
    state,
    isSupported,
    play,
    pause,
    resume,
    stop,
    playMorse,
    renderWav,
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

  // interleave channels
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
