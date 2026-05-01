function patternToEvents(pattern: string, unitMs: number) {
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
      if (symbolIndex < symbols.length - 1) events.push({ on: false, ms: unitMs * 3 });
    });
    if (wordIndex < words.length - 1) events.push({ on: false, ms: unitMs * 7 });
  });

  return events;
}

export function playMorsePattern(pattern: string, options?: { wpm?: number; frequency?: number }) {
  if (typeof window === "undefined") return;

  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;

  const wpm = Math.max(5, Math.min(35, options?.wpm ?? 18));
  const unitMs = 1200 / wpm;
  const frequency = Math.max(220, Math.min(1000, options?.frequency ?? 560));
  const ctx = new AudioContextCtor();
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  let cursor = ctx.currentTime + 0.04;
  for (const event of patternToEvents(pattern, unitMs)) {
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

export function morseDurationMs(pattern: string, wpm = 18) {
  const unitMs = 1200 / Math.max(5, Math.min(35, wpm));
  return patternToEvents(pattern, unitMs).reduce((sum, event) => sum + event.ms, 0);
}

export function morseVisualEvents(pattern: string, wpm = 18) {
  const unitMs = 1200 / Math.max(5, Math.min(35, wpm));
  return patternToEvents(pattern, unitMs);
}

