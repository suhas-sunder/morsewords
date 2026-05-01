function patternToEvents(pattern: string, unitMs: number, spacingUnitMs = unitMs) {
  const events: Array<{ on: boolean; ms: number }> = [];
  const words = pattern.trim().split(/\s{7,}|\s*\/\s*/).filter(Boolean);

  words.forEach((word, wordIndex) => {
    const symbols = word.split(/\s+/).filter(Boolean);
    symbols.forEach((symbol, symbolIndex) => {
      [...symbol].forEach((part, partIndex) => {
        if (part === "." || part === "-") {
          events.push({ on: true, ms: part === "." ? unitMs : unitMs * 3 });
          if (partIndex < symbol.length - 1) events.push({ on: false, ms: unitMs });
        }
      });
      if (symbolIndex < symbols.length - 1) {
        events.push({ on: false, ms: spacingUnitMs * 3 });
      }
    });
    if (wordIndex < words.length - 1) {
      events.push({ on: false, ms: spacingUnitMs * 7 });
    }
  });

  return events;
}

function spacingMs(wpm: number, farnsworthWpm?: number) {
  const charWpm = Math.max(5, Math.min(35, wpm));
  const fwpm = farnsworthWpm
    ? Math.max(5, Math.min(35, farnsworthWpm))
    : charWpm;
  return fwpm < charWpm ? 1200 / fwpm : 1200 / charWpm;
}

export function playMorsePattern(
  pattern: string,
  options?: { wpm?: number; frequency?: number; farnsworthWpm?: number },
) {
  if (typeof window === "undefined") return;

  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;

  const wpm = Math.max(5, Math.min(35, options?.wpm ?? 18));
  const unitMs = 1200 / wpm;
  const gapMs = spacingMs(wpm, options?.farnsworthWpm);
  const frequency = Math.max(220, Math.min(1000, options?.frequency ?? 560));
  const ctx = new AudioContextCtor();
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  let cursor = ctx.currentTime + 0.04;
  for (const event of patternToEvents(pattern, unitMs, gapMs)) {
    const seconds = event.ms / 1000;
    if (event.on) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = frequency;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, cursor);
      gain.gain.linearRampToValueAtTime(1, cursor + 0.006);
      gain.gain.setValueAtTime(1, Math.max(cursor + 0.006, cursor + seconds - 0.008));
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

export function morseDurationMs(pattern: string, wpm = 18, farnsworthWpm?: number) {
  const unitMs = 1200 / Math.max(5, Math.min(35, wpm));
  const gapMs = spacingMs(wpm, farnsworthWpm);
  return patternToEvents(pattern, unitMs, gapMs).reduce((sum, event) => sum + event.ms, 0);
}

export function morseVisualEvents(pattern: string, wpm = 18, farnsworthWpm?: number) {
  const unitMs = 1200 / Math.max(5, Math.min(35, wpm));
  const gapMs = spacingMs(wpm, farnsworthWpm);
  return patternToEvents(pattern, unitMs, gapMs);
}
