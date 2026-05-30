export type MorseTimingEvent =
  | {
      type: "mark";
      on: true;
      symbol: "." | "-";
      units: number;
      ms: number;
    }
  | {
      type: "gap";
      on: false;
      gap: "intra-symbol" | "letter" | "word";
      units: number;
      ms: number;
    };

type MorseTimingOptions = {
  charWpm: number;
  farnsworthWpm?: number;
};

const WORD_GAP = "       ";

export function clampMorseWpm(value: number, min = 1, max = 80): number {
  const safeMin = Number.isFinite(min) ? min : 1;
  const safeMax = Number.isFinite(max) ? max : 80;
  const low = Math.min(safeMin, safeMax);
  const high = Math.max(safeMin, safeMax);
  const safeValue = Number.isFinite(value) ? value : low;

  return Math.min(high, Math.max(low, safeValue));
}

export function getDotMs(charWpm: number): number {
  return 1200 / clampMorseWpm(charWpm);
}

export function farnsworthGapScale(
  charWpm: number,
  effectiveWpm?: number,
): number {
  const c = clampMorseWpm(charWpm);
  const f = clampMorseWpm(effectiveWpm ?? c);

  if (f >= c) return 1;

  return Math.max(1, (50 * c / f - 31) / 19);
}

export function normalizePlayableMorse(code: string): string {
  const raw = (code ?? "")
    .replace(/\u00c2\u00b7|\u00e2\u20ac\u00a2/g, ".")
    .replace(/[\u00b7\u2022\u2219\u22c5]/g, ".")
    .replace(/\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u00e2\u02c6\u2019/g, "-")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/\r\n|\r/g, "\n");

  let normalized = "";
  let pendingSpaces = 0;

  const flushPendingSpaces = () => {
    if (pendingSpaces <= 0) return;
    if (normalized) normalized += pendingSpaces >= 7 ? WORD_GAP : " ";
    pendingSpaces = 0;
  };

  for (const ch of raw) {
    if (ch === "." || ch === "-") {
      flushPendingSpaces();
      normalized += ch;
      continue;
    }

    if (ch === "/" || ch === "\n") {
      if (normalized) pendingSpaces = Math.max(pendingSpaces, 7);
      continue;
    }

    if (/\s/.test(ch)) {
      if (normalized) pendingSpaces += 1;
      continue;
    }
  }

  return normalized.trim();
}

export function buildMorseEvents(
  code: string,
  options: MorseTimingOptions,
): MorseTimingEvent[] {
  const words = parsePlayableMorse(code);
  const events: MorseTimingEvent[] = [];
  const dotMs = getDotMs(options.charWpm);
  const gapScale = farnsworthGapScale(options.charWpm, options.farnsworthWpm);

  words.forEach((word, wordIndex) => {
    word.forEach((letter, letterIndex) => {
      [...letter].forEach((rawSymbol, symbolIndex) => {
        const symbol: "." | "-" = rawSymbol === "-" ? "-" : ".";
        const units = symbol === "-" ? 3 : 1;
        events.push({
          type: "mark",
          on: true,
          symbol,
          units,
          ms: units * dotMs,
        });

        if (symbolIndex < letter.length - 1) {
          events.push({
            type: "gap",
            on: false,
            gap: "intra-symbol",
            units: 1,
            ms: dotMs,
          });
        }
      });

      if (letterIndex < word.length - 1) {
        const units = 3 * gapScale;
        events.push({
          type: "gap",
          on: false,
          gap: "letter",
          units,
          ms: units * dotMs,
        });
      }
    });

    if (wordIndex < words.length - 1) {
      const units = 7 * gapScale;
      events.push({
        type: "gap",
        on: false,
        gap: "word",
        units,
        ms: units * dotMs,
      });
    }
  });

  return events;
}

export function getMorseEventDurationMs(
  event: MorseTimingEvent,
  options: MorseTimingOptions,
): number {
  const dotMs = getDotMs(options.charWpm);

  if (event.type === "mark") {
    return event.units * dotMs;
  }

  if (event.gap === "intra-symbol") {
    return event.units * dotMs;
  }

  const gapScale = farnsworthGapScale(options.charWpm, options.farnsworthWpm);
  const baseUnits = event.gap === "letter" ? 3 : 7;

  return baseUnits * gapScale * dotMs;
}

export function estimateMorseDurationMs(
  code: string,
  options: MorseTimingOptions,
): number {
  return buildMorseEvents(code, options).reduce(
    (total, event) => total + event.ms,
    0,
  );
}

function parsePlayableMorse(code: string): string[][] {
  const normalized = normalizePlayableMorse(code);
  if (!normalized) return [];

  return normalized
    .split(WORD_GAP)
    .map((word) => word.split(/\s+/).filter(Boolean))
    .filter((word) => word.length > 0);
}
