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

  /**
   * Deprecated: vibration is intentionally ignored (removed from UI).
   * Kept only so older callers don't break.
   */
  vibrate?: boolean;

  /**
   * If false, playback is silent but timing/flash still runs.
   * Defaults to true.
   */
  soundEnabled?: boolean;
};

export type RenderWavOptions = Omit<
  PlayOptions,
  "repeat" | "flash" | "vibrate"
> & {
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

function hasAudibleOutput(opts: PlayOptions) {
  return opts.soundEnabled !== false && clamp(opts.volume, 0, 1) > 0.000001;
}

/**
 * Morse audio engine focused on playback quality and export.
 * - Real-time playback uses AudioContext and a click-safe envelope.
 * - Export uses OfflineAudioContext for consistent timing.
 *
 * Fixes:
 * - true mute via master gain (no "minimum gain" bleed-through)
 * - live updates while playing/paused via setLiveOptions()
 * - vibration removed (ignored)
 */
export default function useMorseAudio() {
  const ctxRef = React.useRef<AudioContext | null>(null);
  const masterGainRef = React.useRef<GainNode | null>(null);

  const stopRef = React.useRef(false);
  const pausedRef = React.useRef(false);
  const playingRef = React.useRef(false);
  const repeatRef = React.useRef(false);

  const posRef = React.useRef<InternalPosition>({
    tokenIndex: 0,
    symbolIndex: 0,
  });

  const liveOptsRef = React.useRef<PlayOptions | null>(null);

  const [state, setState] = React.useState<MorsePlayerState>("idle");
  const [isSupported, setIsSupported] = React.useState(false);

  React.useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      (!!(
        window.AudioContext || (window as any).webkitAudioContext
      ) as boolean);
    setIsSupported(!!supported);
  }, []);

  function ensureCtx() {
    if (typeof window === "undefined") return null;

    if (!ctxRef.current) {
      const Ctx = (window.AudioContext ||
        (window as any).webkitAudioContext) as typeof AudioContext | undefined;
      if (!Ctx) return null;
      ctxRef.current = new Ctx();
    }

    const ctx = ctxRef.current;
    if (!ctx) return null;

    if (!masterGainRef.current) {
      const g = ctx.createGain();
      g.gain.value = 0; // set by applyMasterFromLive()
      g.connect(ctx.destination);
      masterGainRef.current = g;
    }

    return ctx;
  }

  function sanitizeOpts(opts: PlayOptions): PlayOptions {
    const safePreset: SoundPreset = (opts.preset ?? "cw_radio") as SoundPreset;

    return {
      ...opts,
      preset: safePreset,
      wpm: clamp(opts.wpm, 5, 60),
      farnsworthWpm: opts.farnsworthWpm
        ? clamp(opts.farnsworthWpm, 5, 60)
        : undefined,
      hz: clamp(opts.hz, 200, 1600),
      volume: clamp(opts.volume, 0, 1),
      repeat: !!opts.repeat,
      flash: !!opts.flash,
      vibrate: false,
      soundEnabled: opts.soundEnabled !== false,
      attackMs: clamp(opts.attackMs ?? defaultAttackMs(safePreset), 0, 200),
      releaseMs: clamp(opts.releaseMs ?? defaultReleaseMs(safePreset), 0, 400),
    };
  }

  function getLiveOpts(fallback: PlayOptions) {
    return sanitizeOpts(liveOptsRef.current ?? fallback);
  }

  async function waitWhilePaused() {
    while (pausedRef.current && !stopRef.current) {
      await sleep(40);
    }
  }

  function triggerFlash(ms: number) {
    window.dispatchEvent(
      new CustomEvent("morsewords:flash", { detail: { ms } }),
    );
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

  function applyMasterFromLive(opts: PlayOptions) {
    const ctx = ensureCtx();
    if (!ctx) return;
    const master = masterGainRef.current;
    if (!master) return;

    const safe = sanitizeOpts(opts);
    const effective =
      safe.soundEnabled === false ? 0 : clamp(safe.volume, 0, 1) * 0.38;

    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(effective, now, 0.02);
  }

  async function playTone(params: {
    ms: number;
    hz: number;
    preset: SoundPreset;
    attackMs: number;
    releaseMs: number;
    audible: boolean;
  }) {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const master = masterGainRef.current;
    if (!master) return;

    // If muted, preserve timing without scheduling audio nodes.
    if (!params.audible) {
      await sleep(params.ms);
      return;
    }

    const osc = ctx.createOscillator();
    osc.type = presetToOscType(params.preset);
    osc.frequency.value = params.hz;

    // Per-tone envelope so master gain can truly hit 0 with no bleed.
    const env = ctx.createGain();
    env.gain.value = 0;

    osc.connect(env).connect(master);

    const now = ctx.currentTime;
    const attackS = clamp(params.attackMs, 0, 200) / 1000;
    const releaseS = clamp(params.releaseMs, 0, 400) / 1000;

    env.gain.cancelScheduledValues(now);
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(1, now + Math.max(0.001, attackS));

    osc.start();

    await sleep(params.ms);

    const t2 = ctx.currentTime;
    env.gain.cancelScheduledValues(t2);
    env.gain.setValueAtTime(env.gain.value, t2);
    env.gain.linearRampToValueAtTime(0, t2 + Math.max(0.001, releaseS));

    await sleep(Math.max(0, params.releaseMs) + 10);
    try {
      osc.stop();
    } catch {
      // ignore
    }
  }

  async function playSounder(ms: number, audible: boolean) {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const master = masterGainRef.current;
    if (!master) return;

    if (!audible) {
      await sleep(ms);
      return;
    }

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

      const opts = getLiveOpts(baseOpts);

      const unit = ditMs(opts.wpm);
      const mult = farnsworthMultiplier(opts.wpm, opts.farnsworthWpm);
      const letterGapUnits = Math.round(3 * mult);
      const wordGapUnits = Math.round(7 * mult);

      const preset = opts.preset ?? "cw_radio";
      const attackMs = opts.attackMs ?? defaultAttackMs(preset);
      const releaseMs = opts.releaseMs ?? defaultReleaseMs(preset);

      const token = parts[i];
      posRef.current.tokenIndex = i;

      if (!token) continue;

      if (/^\s+$/.test(token)) {
        const spaces = token.length;
        const units =
          spaces >= 7 ? wordGapUnits : spaces >= 3 ? letterGapUnits : 1;
        posRef.current.symbolIndex = 0;
        await sleep(units * unit);
        continue;
      }

      for (let s = posRef.current.symbolIndex; s < token.length; s++) {
        if (stopRef.current) break;
        await waitWhilePaused();

        const live = getLiveOpts(baseOpts);
        applyMasterFromLive(live);

        const liveUnit = ditMs(live.wpm);

        posRef.current.symbolIndex = s;

        const ch = token[s];
        if (ch !== "." && ch !== "-") continue;

        const dur = ch === "." ? liveUnit : 3 * liveUnit;
        if (live.flash) triggerFlash(dur);

        const audible = hasAudibleOutput(live);

        if (live.preset === "sounder") {
          await playSounder(dur, audible);
        } else {
          await playTone({
            ms: dur,
            hz: live.hz,
            preset: live.preset ?? "cw_radio",
            attackMs:
              live.attackMs ?? defaultAttackMs(live.preset ?? "cw_radio"),
            releaseMs:
              live.releaseMs ?? defaultReleaseMs(live.preset ?? "cw_radio"),
            audible,
          });
        }

        if (s < token.length - 1) await sleep(liveUnit);
      }

      posRef.current.symbolIndex = 0;
    }
  }

  async function play(opts: PlayOptions) {
    const safeOpts = sanitizeOpts(opts);

    liveOptsRef.current = safeOpts;

    stopRef.current = false;
    pausedRef.current = false;
    playingRef.current = true;
    repeatRef.current = !!safeOpts.repeat;
    posRef.current = { tokenIndex: 0, symbolIndex: 0 };

    setState("playing");

    applyMasterFromLive(safeOpts);

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

    const live = liveOptsRef.current;
    if (live) applyMasterFromLive(live);

    setState("playing");
  }

  function stop() {
    stopRef.current = true;
    pausedRef.current = false;
    repeatRef.current = false;
    setState("idle");
  }

  function setLiveOptions(partial: Partial<PlayOptions>) {
    if (!liveOptsRef.current) return;
    liveOptsRef.current = { ...liveOptsRef.current, ...partial };
    if (playingRef.current) applyMasterFromLive(liveOptsRef.current);
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
        const units =
          spaces >= 7 ? wordGapUnits : spaces >= 3 ? letterGapUnits : 1;
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
    return totalMs;
  }

  async function renderWav(opts: RenderWavOptions): Promise<Blob> {
    const safePreset: SoundPreset = (opts.preset ?? "cw_radio") as SoundPreset;

    const safe: RenderWavOptions = {
      ...opts,
      preset: safePreset,
      wpm: clamp(opts.wpm, 5, 60),
      farnsworthWpm: opts.farnsworthWpm
        ? clamp(opts.farnsworthWpm, 5, 60)
        : undefined,
      hz: clamp(opts.hz, 200, 1600),
      volume: clamp(opts.volume, 0, 1),
      soundEnabled: opts.soundEnabled !== false,
      attackMs: clamp(opts.attackMs ?? defaultAttackMs(safePreset), 0, 200),
      releaseMs: clamp(opts.releaseMs ?? defaultReleaseMs(safePreset), 0, 400),
      sampleRate: opts.sampleRate ?? 44100,
      tailMs: opts.tailMs ?? 120,
    };

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
        const units =
          spaces >= 7 ? wordGapUnits : spaces >= 3 ? letterGapUnits : 1;
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
    totalMs += clamp(safe.tailMs ?? 120, 0, 2000);

    const sr = safe.sampleRate ?? 44100;
    const length = Math.ceil((totalMs / 1000) * sr);

    const offline = new OfflineAudioContext(1, Math.max(1, length), sr);
    const master = offline.createGain();

    const effective =
      safe.soundEnabled === false ? 0 : clamp(safe.volume, 0, 1) * 0.38;

    master.gain.value = effective;
    master.connect(offline.destination);

    let t = 0;
    const unitS = unit / 1000;

    function addTone(durS: number) {
      if (effective <= 0.000001) return;

      if (safe.preset === "sounder") {
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
      osc.type = presetToOscType(safe.preset ?? "cw_radio");
      osc.frequency.value = clamp(safe.hz, 200, 1600);

      const env = offline.createGain();
      const attackS =
        clamp(safe.attackMs ?? defaultAttackMs(safePreset), 0, 200) / 1000;
      const releaseS =
        clamp(safe.releaseMs ?? defaultReleaseMs(safePreset), 0, 400) / 1000;

      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(1, t + Math.max(0.001, attackS));
      env.gain.linearRampToValueAtTime(
        0,
        t + Math.max(0.002, durS - Math.max(0.001, releaseS)),
      );

      osc.connect(env).connect(master);
      osc.start(t);
      osc.stop(t + durS);
    }

    for (const token of parts) {
      if (!token) continue;
      if (/^\s+$/.test(token)) {
        const spaces = token.length;
        const units =
          spaces >= 7 ? wordGapUnits : spaces >= 3 ? letterGapUnits : 1;
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
    setLiveOptions,
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
