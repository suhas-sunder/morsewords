import * as React from "react";
import {
  buildMorseEvents,
  estimateMorseDurationMs,
  getMorseEventDurationMs,
  type MorseTimingEvent,
} from "~/client/components/shared/morseTiming";
import {
  AUDIO_ATTACK_RANGE,
  AUDIO_PITCH_RANGE,
  AUDIO_RELEASE_RANGE,
  AUDIO_SPEED_RANGE,
  AUDIO_TAIL_RANGE,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
} from "~/client/components/shared/morseSettings";
import type { AudioTonePresetId } from "~/client/components/shared/audioPresetRegistry";
import {
  defaultAttackMs,
  defaultReleaseMs,
  isNoiseLikePreset,
  oscillatorLayers,
  renderPresetPcmTone,
} from "~/client/components/shared/audioToneSynthesis";
import { renderMorseAudioBlob } from "~/client/components/shared/export/morseAudioExport";
import {
  dispatchMorseFlash,
  dispatchFlashClear,
  isFlashAllowedNow,
} from "~/client/components/shared/useFlashSafety";

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

  /**
   * Starts playback from an elapsed offset into the generated Morse event list.
   * Used by preview timelines so audio and visual seeking share one clock.
   */
  startElapsedMs?: number;

  /**
   * Fired after the AudioContext is resumed and immediately before event timing
   * begins. The timestamp uses performance.now() so visual previews can sync
   * their clock to the audible tone scheduler.
   */
  onPlaybackStart?: (startedAtMs: number) => void;

  /**
   * Fired at each Morse timing event boundary with the elapsed Morse timeline
   * position and a performance.now() anchor. Live visual previews use this to
   * prevent timer drift from separating the bulb from the audible tone.
   */
  onPlaybackProgress?: (elapsedMs: number, startedAtMs: number) => void;
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
  eventOffsetMs: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function setAudioParamValue(param: AudioParam, value: number, time: number) {
  if (typeof param.setValueAtTime === "function") {
    param.setValueAtTime(value, time);
    return;
  }
  param.value = value;
}

function rampAudioParamValue(param: AudioParam, value: number, time: number) {
  if (typeof param.exponentialRampToValueAtTime === "function") {
    param.exponentialRampToValueAtTime(value, time);
    return;
  }
  param.value = value;
}

type WebkitAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function getAudioContextCtor() {
  if (typeof window === "undefined") return undefined;
  const audioWindow = window as WebkitAudioWindow;
  return audioWindow.AudioContext || audioWindow.webkitAudioContext;
}

function hasAudibleOutput(opts: PlayOptions) {
  return (
    opts.soundEnabled !== false &&
    clamp(opts.volume, VOLUME_RANGE.min, VOLUME_RANGE.max) > 0.000001
  );
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
    eventOffsetMs: 0,
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
    setIsSupported(!!getAudioContextCtor());
  }, []);

  function ensureCtx() {
    if (typeof window === "undefined") return null;

    if (!ctxRef.current) {
      const Ctx = getAudioContextCtor();
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
    const safeWpm = clamp(opts.wpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max);

    return {
      ...opts,
      preset: safePreset,
      wpm: safeWpm,
      farnsworthWpm:
        opts.farnsworthWpm === undefined
          ? undefined
          : clampFarnsworthWpm(opts.farnsworthWpm, safeWpm),
      hz: clamp(opts.hz, AUDIO_PITCH_RANGE.min, AUDIO_PITCH_RANGE.max),
      volume: clamp(opts.volume, VOLUME_RANGE.min, VOLUME_RANGE.max),
      repeat: !!opts.repeat,
      flash: !!opts.flash && isFlashAllowedNow(),
      vibrate: false,
      soundEnabled: opts.soundEnabled !== false,
      attackMs: clamp(
        opts.attackMs ?? defaultAttackMs(safePreset),
        AUDIO_ATTACK_RANGE.min,
        AUDIO_ATTACK_RANGE.max,
      ),
      releaseMs: clamp(
        opts.releaseMs ?? defaultReleaseMs(safePreset),
        AUDIO_RELEASE_RANGE.min,
        AUDIO_RELEASE_RANGE.max,
      ),
    };
  }

  function getLiveOpts(fallback: PlayOptions) {
    return sanitizeOpts(liveOptsRef.current ?? fallback);
  }

  function startPositionFromElapsed(
    events: MorseTimingEvent[],
    elapsedMs: number,
  ): InternalPosition {
    const safeElapsed = Math.max(0, Number.isFinite(elapsedMs) ? elapsedMs : 0);
    let cursorMs = 0;

    for (let index = 0; index < events.length; index += 1) {
      const eventDurationMs = Math.max(0, events[index].ms);
      const eventEndMs = cursorMs + eventDurationMs;
      if (safeElapsed < eventEndMs) {
        return {
          eventIndex: index,
          eventOffsetMs: Math.max(0, safeElapsed - cursorMs),
        };
      }
      cursorMs = eventEndMs;
    }

    return {
      eventIndex: events.length,
      eventOffsetMs: 0,
    };
  }

  async function waitWhilePaused(sessionId: number) {
    while (pausedRef.current && isActiveSession(sessionId)) {
      await sleep(40);
    }
  }

  function triggerFlash(ms: number) {
    dispatchMorseFlash(ms);
  }

  async function ensureRunning() {
    const ctx = ensureCtx();
    if (!ctx) return null;
    const state = ctx.state as AudioContextState | "interrupted";
    if (state !== "running" && state !== "closed") {
      try {
        await ctx.resume();
      } catch {
        return null;
      }
    }
    return ctx.state === "running" ? ctx : null;
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

    const env = ctx.createGain();
    env.gain.value = 0;
    env.connect(master);

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

    const nodes: OscillatorNode[] = [];
    for (const layer of oscillatorLayers({
      preset: params.preset,
      hz: params.hz,
    })) {
      const osc = trackNode(ctx.createOscillator());
      const layerGain = ctx.createGain();
      layerGain.gain.value = layer.gain;
      osc.type = layer.type;
      setAudioParamValue(osc.frequency, layer.startHz, now);
      if (layer.endHz) {
        rampAudioParamValue(osc.frequency, Math.max(1, layer.endHz), now + durationS);
      }
      osc.connect(layerGain).connect(env);
      nodes.push(osc);
    }

    if (!isActiveSession(params.sessionId)) {
      for (const node of nodes) {
        try {
          node.stop(0);
        } catch {
          // already stopped
        }
      }
      return;
    }

    for (const node of nodes) {
      node.start();
      node.stop(now + durationS);
    }

    await sleep(params.ms);
  }

  async function playNoiseTexture({
    audible,
    ms,
    preset,
    sessionId,
  }: {
    audible: boolean;
    ms: number;
    preset: SoundPreset;
    sessionId: number;
  }) {
    if (!isActiveSession(sessionId)) return;
    const ctx = await ensureRunning();
    if (!ctx || !isActiveSession(sessionId)) return;

    const master = masterGainRef.current;
    if (!master) return;

    if (!audible) {
      await sleep(ms);
      return;
    }

    // Telegraph sounder and soft-click presets are synthesized noise textures.
    const bufferSize = Math.max(256, Math.floor((ctx.sampleRate * ms) / 1000));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const progress = bufferSize > 1 ? i / (bufferSize - 1) : 0;
      const env =
        preset === "soft_click" ? Math.exp(-progress * 10) : 1 - progress;
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const src = trackNode(ctx.createBufferSource());
    src.buffer = buffer;

    const biquad = ctx.createBiquadFilter();
    biquad.type = "bandpass";
    biquad.frequency.value = preset === "soft_click" ? 1800 : 1100;
    biquad.Q.value = preset === "soft_click" ? 0.8 : 1.5;

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
    let cursorElapsedMs = 0;
    for (let index = 0; index < posRef.current.eventIndex; index += 1) {
      cursorElapsedMs += playbackEventMs(events[index], baseOpts);
    }

    for (let i = posRef.current.eventIndex; i < events.length; i++) {
      if (!isActiveSession(sessionId)) break;
      await waitWhilePaused(sessionId);
      if (!isActiveSession(sessionId)) break;

      const event = events[i];
      posRef.current.eventIndex = i;
      const eventOffsetMs = Math.max(0, posRef.current.eventOffsetMs);
      posRef.current.eventOffsetMs = 0;

      if (event.type === "gap") {
        const live = getLiveOpts(baseOpts);
        const dur = Math.max(0, playbackEventMs(event, live) - eventOffsetMs);
        baseOpts.onPlaybackProgress?.(
          cursorElapsedMs + eventOffsetMs,
          performance.now(),
        );
        await sleep(dur);
        if (!isActiveSession(sessionId)) break;
        cursorElapsedMs += eventOffsetMs + dur;
        posRef.current = { eventIndex: i + 1, eventOffsetMs: 0 };
        continue;
      }

      const live = getLiveOpts(baseOpts);
      applyMasterFromLive(live);

      const dur = Math.max(0, playbackEventMs(event, live) - eventOffsetMs);
      baseOpts.onPlaybackProgress?.(
        cursorElapsedMs + eventOffsetMs,
        performance.now(),
      );
      if (live.flash && isActiveSession(sessionId)) triggerFlash(dur);

      const audible = hasAudibleOutput(live);

      if (isNoiseLikePreset(live.preset)) {
        await playNoiseTexture({
          sessionId,
          ms: dur,
          audible,
          preset: live.preset ?? "cw_radio",
        });
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
      cursorElapsedMs += eventOffsetMs + dur;
      posRef.current = { eventIndex: i + 1, eventOffsetMs: 0 };
    }
  }

  async function play(opts: PlayOptions) {
    // Initiate AudioContext activation before playback setup can consume the
    // transient user gesture required by mobile Safari and other mobile
    // browsers. Await it only after the synchronous session state is ready.
    const runningContext = ensureRunning();
    cancelCurrentPlayback();
    const sessionId = sessionRef.current;
    const safeOpts = sanitizeOpts(opts);

    liveOptsRef.current = safeOpts;

    stopRef.current = false;
    pausedRef.current = false;
    playingRef.current = true;
    repeatRef.current = !!safeOpts.repeat;
    posRef.current = startPositionFromElapsed(
      buildMorseEvents(safeOpts.code, {
        charWpm: safeOpts.wpm,
        farnsworthWpm: safeOpts.farnsworthWpm,
      }),
      safeOpts.startElapsedMs ?? 0,
    );

    setPlayerState("playing");

    const ctx = await runningContext;
    if (!ctx || !isActiveSession(sessionId)) {
      if (sessionRef.current === sessionId) {
        playingRef.current = false;
        pausedRef.current = false;
        stopRef.current = false;
        repeatRef.current = false;
        setPlayerState("idle");
      }
      return;
    }
    applyMasterFromLive(safeOpts);
    safeOpts.onPlaybackStart?.(performance.now());

    do {
      await runOnce(sessionId, safeOpts);
      if (!isActiveSession(sessionId)) break;
      posRef.current = { eventIndex: 0, eventOffsetMs: 0 };
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
    void ensureRunning();
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
    const safeWpm = clamp(opts.wpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max);

    const safe: RenderAudioOptions = {
      ...opts,
      preset: safePreset,
      wpm: safeWpm,
      farnsworthWpm: opts.farnsworthWpm
        ? clampFarnsworthWpm(opts.farnsworthWpm, safeWpm)
        : undefined,
      hz: clamp(opts.hz, AUDIO_PITCH_RANGE.min, AUDIO_PITCH_RANGE.max),
      volume: clamp(opts.volume, VOLUME_RANGE.min, VOLUME_RANGE.max),
      soundEnabled: opts.soundEnabled !== false,
      attackMs: clamp(
        opts.attackMs ?? defaultAttackMs(safePreset),
        AUDIO_ATTACK_RANGE.min,
        AUDIO_ATTACK_RANGE.max,
      ),
      releaseMs: clamp(
        opts.releaseMs ?? defaultReleaseMs(safePreset),
        AUDIO_RELEASE_RANGE.min,
        AUDIO_RELEASE_RANGE.max,
      ),
      sampleRate: sanitizeAudioSampleRate(opts.sampleRate),
      tailMs: clamp(opts.tailMs ?? 120, AUDIO_TAIL_RANGE.min, AUDIO_TAIL_RANGE.max),
    };

    const events = buildMorseEvents(safe.code, {
      charWpm: safe.wpm,
      farnsworthWpm: safe.farnsworthWpm,
    });
    const totalMs =
      events.reduce((total, event) => total + event.ms, 0) +
      clamp(safe.tailMs ?? 120, AUDIO_TAIL_RANGE.min, AUDIO_TAIL_RANGE.max);

    const sr = safe.sampleRate ?? 44100;
    const length = Math.ceil((totalMs / 1000) * sr);

    const offline = new OfflineAudioContext(1, Math.max(1, length), sr);
    const master = offline.createGain();

    const effective =
      safe.soundEnabled === false
        ? 0
        : clamp(safe.volume, VOLUME_RANGE.min, VOLUME_RANGE.max) * 0.38;

    master.gain.value = effective;
    master.connect(offline.destination);

    let t = 0;
    function addTone(durS: number) {
      if (effective <= 0.000001) return;

      const samples = Math.max(1, Math.ceil(durS * offline.sampleRate));
      const pcm = renderPresetPcmTone({
        amplitude: 1,
        attackMs: clamp(
          safe.attackMs ?? defaultAttackMs(safePreset),
          AUDIO_ATTACK_RANGE.min,
          AUDIO_ATTACK_RANGE.max,
        ),
        releaseMs: clamp(
          safe.releaseMs ?? defaultReleaseMs(safePreset),
          AUDIO_RELEASE_RANGE.min,
          AUDIO_RELEASE_RANGE.max,
        ),
        hz: clamp(safe.hz, AUDIO_PITCH_RANGE.min, AUDIO_PITCH_RANGE.max),
        preset: safe.preset ?? "cw_radio",
        sampleRate: offline.sampleRate,
        samples,
      });
      const buffer = offline.createBuffer(1, samples, offline.sampleRate);
      buffer.copyToChannel(pcm, 0);
      const src = offline.createBufferSource();
      src.buffer = buffer;
      src.connect(master);
      src.start(t);
      src.stop(t + durS);
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
    const safePreset = sanitizeAudioGeneratorPreset(opts.preset);
    const safeWpm = clamp(opts.wpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max);
    return renderMorseAudioBlob({
      morse: opts.code,
      settings: {
        attackMs: clamp(
          opts.attackMs ?? defaultAttackMs(safePreset),
          AUDIO_ATTACK_RANGE.min,
          AUDIO_ATTACK_RANGE.max,
        ),
        charWpm: safeWpm,
        farnsworthWpm: opts.farnsworthWpm
          ? clampFarnsworthWpm(opts.farnsworthWpm, safeWpm)
          : undefined,
        format: "wav",
        pitch: clamp(opts.hz, AUDIO_PITCH_RANGE.min, AUDIO_PITCH_RANGE.max),
        releaseMs: clamp(
          opts.releaseMs ?? defaultReleaseMs(safePreset),
          AUDIO_RELEASE_RANGE.min,
          AUDIO_RELEASE_RANGE.max,
        ),
        sampleRate: sanitizeAudioSampleRate(opts.sampleRate),
        tailPaddingMs: clamp(
          opts.tailMs ?? 120,
          AUDIO_TAIL_RANGE.min,
          AUDIO_TAIL_RANGE.max,
        ),
        tonePreset: safePreset,
        volume:
          opts.soundEnabled === false
            ? 0
            : clamp(opts.volume, VOLUME_RANGE.min, VOLUME_RANGE.max),
      },
      signal: new AbortController().signal,
    });
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
