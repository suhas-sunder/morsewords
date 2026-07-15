import {
  buildMorseEvents,
  estimateMorseDurationMs,
} from "~/client/components/shared/morseTiming";
import { CHARACTER_SPEED_RANGE } from "~/client/components/shared/morseSettings";

type PlayPatternOptions = {
  wpm?: number;
  frequency?: number;
  farnsworthWpm?: number;
};

let patternAudioContext: AudioContext | null = null;
let patternResumePromise: Promise<boolean> | null = null;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function timingOptions(wpm = 18, farnsworthWpm?: number) {
  const charWpm = clamp(
    wpm,
    CHARACTER_SPEED_RANGE.min,
    CHARACTER_SPEED_RANGE.max,
  );

  return {
    charWpm,
    farnsworthWpm:
      farnsworthWpm === undefined
        ? undefined
        : clamp(
            farnsworthWpm,
            CHARACTER_SPEED_RANGE.min,
            charWpm,
          ),
  };
}

function getPatternAudioContext() {
  if (typeof window === "undefined") return null;

  if (patternAudioContext?.state === "closed") {
    patternAudioContext = null;
    patternResumePromise = null;
  }

  if (!patternAudioContext) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return null;
    patternAudioContext = new AudioContextCtor();
  }

  return patternAudioContext;
}

function ensurePatternContextRunning(ctx: AudioContext) {
  if (ctx.state === "running") return Promise.resolve(true);
  if (ctx.state === "closed") return Promise.resolve(false);
  if (patternResumePromise) return patternResumePromise;

  patternResumePromise = ctx
    .resume()
    .then(() => ctx.state === "running")
    .catch(() => false)
    .finally(() => {
      patternResumePromise = null;
    });
  return patternResumePromise;
}

function scheduleMorsePattern(
  ctx: AudioContext,
  events: ReturnType<typeof buildMorseEvents>,
  frequency: number,
) {
  if (ctx.state !== "running") return;

  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  let cursor = ctx.currentTime + 0.04;
  for (const event of events) {
    const seconds = event.ms / 1000;
    if (event.type === "mark") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = frequency;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, cursor);
      gain.gain.linearRampToValueAtTime(1, cursor + 0.006);
      gain.gain.setValueAtTime(
        1,
        Math.max(cursor + 0.006, cursor + seconds - 0.008),
      );
      gain.gain.linearRampToValueAtTime(0, cursor + seconds);
      osc.connect(gain);
      gain.connect(master);
      osc.start(cursor);
      osc.stop(cursor + seconds + 0.02);
    }
    cursor += seconds;
  }

  window.setTimeout(() => {
    master.disconnect?.();
  }, Math.max(250, (cursor - ctx.currentTime + 0.2) * 1000));
}

export function playMorsePattern(
  pattern: string,
  options?: PlayPatternOptions,
) {
  const ctx = getPatternAudioContext();
  if (!ctx) return;

  // Calling this helper starts resume() synchronously while the click/tap still
  // owns transient user activation. Event construction remains unchanged and
  // scheduling waits for the context only when the browser suspended it.
  const runningContext = ensurePatternContextRunning(ctx);

  const events = buildMorseEvents(
    pattern,
    timingOptions(options?.wpm, options?.farnsworthWpm),
  );
  const frequency = clamp(options?.frequency ?? 560, 220, 1000);

  if (ctx.state === "running") {
    scheduleMorsePattern(ctx, events, frequency);
    return;
  }

  void runningContext.then((running) => {
    if (running) scheduleMorsePattern(ctx, events, frequency);
  });
}

export function morseDurationMs(
  pattern: string,
  wpm = 18,
  farnsworthWpm?: number,
) {
  return estimateMorseDurationMs(pattern, timingOptions(wpm, farnsworthWpm));
}

export function morseVisualEvents(
  pattern: string,
  wpm = 18,
  farnsworthWpm?: number,
) {
  return buildMorseEvents(pattern, timingOptions(wpm, farnsworthWpm)).map(
    (event) => ({
      on: event.on,
      ms: event.ms,
    }),
  );
}
