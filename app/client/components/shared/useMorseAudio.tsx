import * as React from "react";
import {
  buildMorseEvents,
  estimateMorseDurationMs,
  getMorseEventDurationMs,
  type MorseTimingEvent,
} from "~/client/components/shared/morseTiming";
import {
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
} from "~/client/components/shared/morseSettings";
import {
  dispatchFlashClear,
  isFlashAllowedNow,
} from "~/client/components/shared/useFlashSafety";

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

export type RenderAudioOptions = Omit<
  PlayOptions,
  "repeat" | "flash" | "vibrate"
> & {
  /** Output sample rate (Hz). Default 44100. */
  sampleRate?: 22050 | 44100 | 48000;
  /** Add silence at the end to avoid clipped tails. Default 120ms. */
  tailMs?: number;
};

export type RenderWavOptions = RenderAudioOptions;

type InternalPosition = {
  eventIndex: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

function playbackEventMs(event: MorseTimingEvent, opts: PlayOptions) {
  return getMorseEventDurationMs(event, {
    charWpm: opts.wpm,
    farnsworthWpm: opts.farnsworthWpm,
  });
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
    eventIndex: 0,
  });

  const liveOptsRef = React.useRef<PlayOptions | null>(null);
  const mountedRef = React.useRef(false);
  const sessionRef = React.useRef(0);
  const activeNodesRef = React.useRef<Set<AudioScheduledSourceNode>>(new Set());

  const [state, setState] = React.useState<MorsePlayerState>("idle");
  const [isSupported, setIsSupported] = React.useState(false);

  function setPlayerState(nextState: MorsePlayerState) {
    if (mountedRef.current) setState(nextState);
  }

  function isActiveSession(sessionId: number) {
    return (
      mountedRef.current &&
      sessionRef.current === sessionId &&
      !stopRef.current
    );
  }

  function trackNode<T extends AudioScheduledSourceNode>(node: T): T {
    activeNodesRef.current.add(node);
    const cleanup = () => activeNodesRef.current.delete(node);
    node.addEventListener?.("ended", cleanup, { once: true });
    const previousOnEnded = node.onended;
    node.onended = (event) => {
      cleanup();
      previousOnEnded?.call(node, event);
    };
    return node;
  }

  function silenceActiveNodes() {
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    if (ctx && master) {
      try {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(0, ctx.currentTime);
      } catch {
        // ignore stop races
      }
    }

    for (const node of activeNodesRef.current) {
      try {
        node.stop(0);
      } catch {
        // already stopped
      }
    }
    activeNodesRef.current.clear();
    dispatchFlashClear();
  }

  function cancelCurrentPlayback() {
    sessionRef.current += 1;
    stopRef.current = true;
    pausedRef.current = false;
    repeatRef.current = false;
    playingRef.current = false;
    silenceActiveNodes();
  }

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelCurrentPlayback();

      const ctx = ctxRef.current;
      if (ctx) {
        const closePromise = ctx.close?.();
        closePromise?.catch(() => {
          // ignore teardown races
        });
      }
      ctxRef.current = null;
      masterGainRef.current = null;
    };
  }, []);

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
    const safePreset: SoundPreset = sanitizeAudioGeneratorPreset(opts.preset);
    const safeWpm = clamp(opts.wpm, 5, 60);

    return {
      ...opts,
      preset: safePreset,
      wpm: safeWpm,
      farnsworthWpm:
        opts.farnsworthWpm === undefined
          ? undefined
          : clampFarnsworthWpm(opts.farnsworthWpm, safeWpm),
      hz: clamp(opts.hz, 200, 1600),
      volume: clamp(opts.volume, 0, 1),
      repeat: !!opts.repeat,
      flash: !!opts.flash && isFlashAllowedNow(),
      vibrate: false,
      soundEnabled: opts.soundEnabled !== false,
      attackMs: clamp(opts.attackMs ?? defaultAttackMs(safePreset), 0, 200),
      releaseMs: clamp(opts.releaseMs ?? defaultReleaseMs(safePreset), 0, 400),
    };
  }

  function getLiveOpts(fallback: PlayOptions) {
    return sanitizeOpts(liveOptsRef.current ?? fallback);
  }

  async function waitWhilePaused(sessionId: number) {
    while (pausedRef.current && isActiveSession(sessionId)) {
      await sleep(40);
    }
  }

  function triggerFlash(ms: number) {
    if (!isFlashAllowedNow()) return;
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
    sessionId: number;
    ms: number;
    hz: number;
    preset: SoundPreset;
    attackMs: number;
    releaseMs: number;
    audible: boolean;
  }) {
    if (!isActiveSession(params.sessionId)) return;
    const ctx = await ensureRunning();
    if (!ctx || !isActiveSession(params.sessionId)) return;

    const master = masterGainRef.current;
    if (!master) return;

    // If muted, preserve timing without scheduling audio nodes.
    if (!params.audible) {
      await sleep(params.ms);
      return;
    }

    const osc = ctx.createOscillator();
    trackNode(osc);
    osc.type = presetToOscType(params.preset);
    osc.frequency.value = params.hz;

    // Per-tone envelope so master gain can truly hit 0 with no bleed.
    const env = ctx.createGain();
    env.gain.value = 0;

    osc.connect(env).connect(master);

    const now = ctx.currentTime;
    const durationS = Math.max(0.001, params.ms / 1000);
    const attackS = Math.min(clamp(params.attackMs, 0, 200) / 1000, durationS / 2);
    const releaseS = Math.min(
      clamp(params.releaseMs, 0, 400) / 1000,
      durationS / 2,
    );
    const attackEnd = now + Math.max(0.001, attackS);
    const releaseStart = now + Math.max(0.001, durationS - Math.max(0.001, releaseS));

    env.gain.cancelScheduledValues(now);
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(1, attackEnd);
    env.gain.setValueAtTime(1, Math.max(attackEnd, releaseStart));
    env.gain.linearRampToValueAtTime(0, now + durationS);

    if (!isActiveSession(params.sessionId)) {
      try {
        osc.stop(0);
      } catch {
        // already stopped
      }
      return;
    }

    osc.start();
    osc.stop(now + durationS);

    await sleep(params.ms);
  }

  async function playSounder(sessionId: number, ms: number, audible: boolean) {
    if (!isActiveSession(sessionId)) return;
    const ctx = await ensureRunning();
    if (!ctx || !isActiveSession(sessionId)) return;

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

    const src = trackNode(ctx.createBufferSource());
    src.buffer = buffer;

    const biquad = ctx.createBiquadFilter();
    biquad.type = "bandpass";
    biquad.frequency.value = 1100;
    biquad.Q.value = 1.5;

    const localGain = ctx.createGain();
    localGain.gain.value = 1;

    src.connect(biquad).connect(localGain).connect(master);
    if (!isActiveSession(sessionId)) {
      try {
        src.stop(0);
      } catch {
        // already stopped
      }
      return;
    }
    src.start();
    await sleep(ms);
    try {
      src.stop();
    } catch {
      // ignore
    }
  }

  async function runOnce(sessionId: number, baseOpts: PlayOptions) {
    const events = buildMorseEvents(baseOpts.code, {
      charWpm: baseOpts.wpm,
      farnsworthWpm: baseOpts.farnsworthWpm,
    });

    for (let i = posRef.current.eventIndex; i < events.length; i++) {
      if (!isActiveSession(sessionId)) break;
      await waitWhilePaused(sessionId);
      if (!isActiveSession(sessionId)) break;

      const event = events[i];
      posRef.current.eventIndex = i;

      if (event.type === "gap") {
        const live = getLiveOpts(baseOpts);
        await sleep(playbackEventMs(event, live));
        if (!isActiveSession(sessionId)) break;
        posRef.current.eventIndex = i + 1;
        continue;
      }

      const live = getLiveOpts(baseOpts);
      applyMasterFromLive(live);

      const dur = playbackEventMs(event, live);
      if (live.flash && isActiveSession(sessionId)) triggerFlash(dur);

      const audible = hasAudibleOutput(live);

      if (live.preset === "sounder") {
        await playSounder(sessionId, dur, audible);
      } else {
        await playTone({
          sessionId,
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

      if (!isActiveSession(sessionId)) break;
      posRef.current.eventIndex = i + 1;
    }
  }

  async function play(opts: PlayOptions) {
    cancelCurrentPlayback();
    const sessionId = sessionRef.current;
    const safeOpts = sanitizeOpts(opts);

    liveOptsRef.current = safeOpts;

    stopRef.current = false;
    pausedRef.current = false;
    playingRef.current = true;
    repeatRef.current = !!safeOpts.repeat;
    posRef.current = { eventIndex: 0 };

    setPlayerState("playing");

    applyMasterFromLive(safeOpts);

    do {
      await runOnce(sessionId, safeOpts);
      if (!isActiveSession(sessionId)) break;
      posRef.current = { eventIndex: 0 };
      if (repeatRef.current) await sleep(160);
    } while (repeatRef.current && isActiveSession(sessionId));

    if (sessionRef.current !== sessionId) return;

    playingRef.current = false;
    pausedRef.current = false;
    stopRef.current = false;
    repeatRef.current = false;
    setPlayerState("idle");
  }

  function pause() {
    if (!playingRef.current) return;
    pausedRef.current = true;
    setPlayerState("paused");
  }

  function resume() {
    if (!playingRef.current) return;
    pausedRef.current = false;

    const live = liveOptsRef.current;
    if (live) applyMasterFromLive(live);

    setPlayerState("playing");
  }

  function stop() {
    cancelCurrentPlayback();
    setPlayerState("idle");
  }

  function setLiveOptions(partial: Partial<PlayOptions>) {
    if (!liveOptsRef.current) return;
    const previousCode = liveOptsRef.current.code;
    liveOptsRef.current = { ...liveOptsRef.current, ...partial };
    if (
      playingRef.current &&
      partial.code !== undefined &&
      partial.code !== previousCode
    ) {
      stop();
      return;
    }
    if (playingRef.current) applyMasterFromLive(liveOptsRef.current);
  }

  function estimateDurationMs(opts: {
    code: string;
    wpm: number;
    farnsworthWpm?: number;
  }) {
    return estimateMorseDurationMs(opts.code, {
      charWpm: opts.wpm,
      farnsworthWpm: opts.farnsworthWpm,
    });
  }

  async function renderAudioBuffer(opts: RenderAudioOptions): Promise<AudioBuffer> {
    const safePreset: SoundPreset = sanitizeAudioGeneratorPreset(opts.preset);
    const safeWpm = clamp(opts.wpm, 5, 60);

    const safe: RenderAudioOptions = {
      ...opts,
      preset: safePreset,
      wpm: safeWpm,
      farnsworthWpm: opts.farnsworthWpm
        ? clampFarnsworthWpm(opts.farnsworthWpm, safeWpm)
        : undefined,
      hz: clamp(opts.hz, 200, 1600),
      volume: clamp(opts.volume, 0, 1),
      soundEnabled: opts.soundEnabled !== false,
      attackMs: clamp(opts.attackMs ?? defaultAttackMs(safePreset), 0, 200),
      releaseMs: clamp(opts.releaseMs ?? defaultReleaseMs(safePreset), 0, 400),
      sampleRate: sanitizeAudioSampleRate(opts.sampleRate),
      tailMs: clamp(opts.tailMs ?? 120, 0, 400),
    };

    const events = buildMorseEvents(safe.code, {
      charWpm: safe.wpm,
      farnsworthWpm: safe.farnsworthWpm,
    });
    const totalMs =
      events.reduce((total, event) => total + event.ms, 0) +
      clamp(safe.tailMs ?? 120, 0, 2000);

    const sr = safe.sampleRate ?? 44100;
    const length = Math.ceil((totalMs / 1000) * sr);

    const offline = new OfflineAudioContext(1, Math.max(1, length), sr);
    const master = offline.createGain();

    const effective =
      safe.soundEnabled === false ? 0 : clamp(safe.volume, 0, 1) * 0.38;

    master.gain.value = effective;
    master.connect(offline.destination);

    let t = 0;
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
      const attackS = Math.min(
        clamp(safe.attackMs ?? defaultAttackMs(safePreset), 0, 200) / 1000,
        durS / 2,
      );
      const releaseS = Math.min(
        clamp(safe.releaseMs ?? defaultReleaseMs(safePreset), 0, 400) / 1000,
        durS / 2,
      );
      const attackEnd = t + Math.max(0.001, attackS);
      const releaseStart =
        t + Math.max(0.001, durS - Math.max(0.001, releaseS));

      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(1, attackEnd);
      env.gain.setValueAtTime(1, Math.max(attackEnd, releaseStart));
      env.gain.linearRampToValueAtTime(0, t + durS);

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

    return offline.startRendering();
  }

  async function renderWav(opts: RenderWavOptions): Promise<Blob> {
    const rendered = await renderAudioBuffer(opts);
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
    renderAudioBuffer,
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
