import {
  buildMorseEvents,
  estimateMorseDurationMs,
} from "~/client/components/shared/morseTiming";

type PlayPatternOptions = {
  wpm?: number;
  frequency?: number;
  farnsworthWpm?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function timingOptions(wpm = 18, farnsworthWpm?: number) {
  const charWpm = clamp(wpm, 5, 35);

  return {
    charWpm,
    farnsworthWpm:
      farnsworthWpm === undefined ? undefined : clamp(farnsworthWpm, 5, 35),
  };
}

export function playMorsePattern(
  pattern: string,
  options?: PlayPatternOptions,
) {
  if (typeof window === "undefined") return;

  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) return;

  const events = buildMorseEvents(
    pattern,
    timingOptions(options?.wpm, options?.farnsworthWpm),
  );
  const frequency = clamp(options?.frequency ?? 560, 220, 1000);
  const ctx = new AudioContextCtor();
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
    void ctx.close();
  }, Math.max(250, (cursor - ctx.currentTime + 0.2) * 1000));
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
