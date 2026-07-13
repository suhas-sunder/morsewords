import {
  normalizeMorseForDecode,
  splitMorseWords,
} from "./morseUtils";

export type MorseTimingEvent =
  | {
      type: "mark";
      on: true;
      symbol: "." | "-";
      units: number;
      ms: number;
      startMs: number;
      endMs: number;
      eventIndex: number;
      letterIndex: number;
      wordIndex: number;
    }
  | {
      type: "gap";
      on: false;
      gap: "intra-symbol" | "letter" | "word";
      units: number;
      ms: number;
      startMs: number;
      endMs: number;
      eventIndex: number;
      letterIndex: number;
      wordIndex: number;
    };

export type MorseTimeline = {
  code: string;
  durationMs: number;
  events: MorseTimingEvent[];
  markDurationMs: number;
  tailPaddingMs: number;
};

type UntimedMorseEvent =
  | Omit<
      Extract<MorseTimingEvent, { type: "mark" }>,
      "startMs" | "endMs" | "eventIndex" | "letterIndex" | "wordIndex"
    >
  | Omit<
      Extract<MorseTimingEvent, { type: "gap" }>,
      "startMs" | "endMs" | "eventIndex" | "letterIndex" | "wordIndex"
    >;

type MorseTimingOptions = {
  charWpm: number;
  farnsworthWpm?: number;
};

export function clampMorseWpm(value: number, min = 1, max = 100): number {
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
  return normalizeMorseForDecode(code);
}

export function buildMorseEvents(
  code: string,
  options: MorseTimingOptions,
): MorseTimingEvent[] {
  return buildMorseTimeline(code, options).events;
}

/**
 * Canonical timing schedule shared by playback, flash state, estimates, audio
 * export, video export, and split planning. Event timestamps are computed once
 * so every consumer observes the same mark and gap boundaries.
 */
export function buildMorseTimeline(
  code: string,
  options: MorseTimingOptions & { tailPaddingMs?: number },
): MorseTimeline {
  const normalizedCode = normalizePlayableMorse(code);
  const words = parsePlayableMorse(code);
  const events: MorseTimingEvent[] = [];
  const dotMs = getDotMs(options.charWpm);
  const gapScale = farnsworthGapScale(options.charWpm, options.farnsworthWpm);
  let cursorMs = 0;
  let globalLetterIndex = 0;

  const appendEvent = (
    event: UntimedMorseEvent,
    wordIndex: number,
    letterIndex: number,
  ) => {
    const startMs = cursorMs;
    cursorMs += Math.max(0, event.ms);
    events.push({
      ...event,
      startMs,
      endMs: cursorMs,
      eventIndex: events.length,
      letterIndex,
      wordIndex,
    } as MorseTimingEvent);
  };

  words.forEach((word, wordIndex) => {
    word.forEach((letter, letterIndex) => {
      const currentLetterIndex = globalLetterIndex;
      [...letter].forEach((rawSymbol, symbolIndex) => {
        const symbol: "." | "-" = rawSymbol === "-" ? "-" : ".";
        const units = symbol === "-" ? 3 : 1;
        appendEvent({
          type: "mark",
          on: true,
          symbol,
          units,
          ms: units * dotMs,
        }, wordIndex, currentLetterIndex);

        if (symbolIndex < letter.length - 1) {
          appendEvent({
            type: "gap",
            on: false,
            gap: "intra-symbol",
            units: 1,
            ms: dotMs,
          }, wordIndex, currentLetterIndex);
        }
      });

      if (letterIndex < word.length - 1) {
        const units = 3 * gapScale;
        appendEvent({
          type: "gap",
          on: false,
          gap: "letter",
          units,
          ms: units * dotMs,
        }, wordIndex, currentLetterIndex);
      }
      globalLetterIndex += 1;
    });

    if (wordIndex < words.length - 1) {
      const units = 7 * gapScale;
      appendEvent({
        type: "gap",
        on: false,
        gap: "word",
        units,
        ms: units * dotMs,
      }, wordIndex, Math.max(0, globalLetterIndex - 1));
    }
  });

  const tailPaddingMs = Math.max(0, options.tailPaddingMs ?? 0);
  return {
    code: normalizedCode,
    durationMs: cursorMs + tailPaddingMs,
    events,
    markDurationMs: cursorMs,
    tailPaddingMs,
  };
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
  return buildMorseTimeline(code, options).markDurationMs;
}

export function hasPlayableMorse(code: string): boolean {
  return buildMorseEvents(code, { charWpm: 20 }).some(
    (event) => event.type === "mark",
  );
}

function parsePlayableMorse(code: string): string[][] {
  return splitMorseWords(code);
}
