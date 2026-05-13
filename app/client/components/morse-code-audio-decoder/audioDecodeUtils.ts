import { morseToText } from "~/client/components/shared/morseUtils";

export type AudioDecodeStatus =
  | "success"
  | "low-confidence"
  | "no-tones"
  | "empty-audio";

export type GapClassification = "symbol" | "letter" | "word";
export type GapMode = "auto" | "standard" | "farnsworth";
export type TextSpacingMode = "smart" | "exact";

export type AudioDecoderOptions = {
  expectedWpm?: number;
  gapMode?: GapMode;
  maxToneGapMs?: number;
  minToneMs?: number;
  sensitivity?: number;
  textSpacing?: TextSpacingMode;
  windowMs?: number;
  wordGapScale?: number;
};

export type AudioTimingSummary = {
  durationSeconds: number;
  estimatedUnitMs: number;
  estimatedWpm: number;
  gapCount: number;
  noiseFloor: number;
  peakLevel: number;
  threshold: number;
  toneCount: number;
};

export type AudioDecodeResult = {
  confidence: number;
  decodedText: string;
  messages: string[];
  rawMorse: string;
  status: AudioDecodeStatus;
  timing: AudioTimingSummary;
};

type SegmentKind = "tone" | "silence";

type Segment = {
  durationMs: number;
  endMs: number;
  kind: SegmentKind;
  startMs: number;
};

const DEFAULT_OPTIONS: Required<AudioDecoderOptions> = {
  expectedWpm: 0,
  gapMode: "auto",
  maxToneGapMs: 14,
  minToneMs: 22,
  sensitivity: 0.62,
  textSpacing: "smart",
  windowMs: 8,
  wordGapScale: 1,
};

const SMART_SPACING_WORDS = new Set([
  "A",
  "ABOUT",
  "AFTER",
  "AGAIN",
  "ALL",
  "ALLOW",
  "ALONG",
  "AND",
  "AUDIO",
  "BACK",
  "BROWSER",
  "CALL",
  "CHECK",
  "CODE",
  "CONVERT",
  "CONVERTS",
  "COPY",
  "CQ",
  "DASHES",
  "DAHS",
  "DECODE",
  "DECODER",
  "DISPLAYING",
  "DITS",
  "DOTS",
  "DOWNLOAD",
  "DOWNLOADABLE",
  "FILE",
  "FORMAT",
  "GENERATE",
  "HELLO",
  "HEAR",
  "HELP",
  "IN",
  "INSTRUCTIONS",
  "INTO",
  "IT",
  "LOVE",
  "MORSE",
  "NOTES",
  "OF",
  "OR",
  "RESULT",
  "SOS",
  "TEXT",
  "THE",
  "THIS",
  "TO",
  "TOOL",
  "TYPED",
  "WAV",
  "WILL",
  "WITH",
  "WORDS",
  "WORLD",
  "YOU",
  "YOUR",
]);

type GapTimingModel = {
  letterThresholdMs: number;
  symbolGapMs: number;
  letterGapMs: number;
  wordGapMs: number;
  wordThresholdMs: number;
};

export function mixAudioBufferToMono(audioBuffer: AudioBuffer) {
  const { length, numberOfChannels } = audioBuffer;
  const mono = new Float32Array(length);

  if (numberOfChannels <= 0) return mono;

  for (let channel = 0; channel < numberOfChannels; channel += 1) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let index = 0; index < length; index += 1) {
      mono[index] += channelData[index] / numberOfChannels;
    }
  }

  return mono;
}

export function classifyToneDuration(durationMs: number, unitMs: number) {
  if (!Number.isFinite(durationMs) || !Number.isFinite(unitMs) || unitMs <= 0) {
    return ".";
  }

  return durationMs / unitMs >= 2 ? "-" : ".";
}

export function classifySilenceGap(
  durationMs: number,
  unitMs: number,
  wordGapScale = 1,
): GapClassification {
  if (!Number.isFinite(durationMs) || !Number.isFinite(unitMs) || unitMs <= 0) {
    return "symbol";
  }

  const ratio = durationMs / unitMs;
  const wordThreshold = 5.8 * clamp(wordGapScale, 0.72, 1.35);

  if (ratio >= wordThreshold) return "word";
  if (ratio >= 2.25) return "letter";
  return "symbol";
}

export function analyzeSamplesToMorse(
  samples: Float32Array,
  sampleRate: number,
  options: AudioDecoderOptions = {},
): AudioDecodeResult {
  const resolved = { ...DEFAULT_OPTIONS, ...options };
  const durationSeconds =
    sampleRate > 0 && samples.length > 0 ? samples.length / sampleRate : 0;
  const emptyTiming = createEmptyTiming(durationSeconds);

  if (!samples.length || sampleRate <= 0) {
    return {
      confidence: 0,
      decodedText: "",
      messages: ["No audio samples were available to analyze."],
      rawMorse: "",
      status: "empty-audio",
      timing: emptyTiming,
    };
  }

  const envelope = buildEnvelope(samples, sampleRate, resolved.windowMs);
  const peakLevel = Math.max(...envelope, 0);
  const noiseFloor = percentile(envelope, 0.2);

  if (peakLevel < 0.0005) {
    return {
      confidence: 0,
      decodedText: "",
      messages: ["No Morse-like tones detected. Try a cleaner recording or a lower threshold."],
      rawMorse: "",
      status: "no-tones",
      timing: { ...emptyTiming, noiseFloor, peakLevel },
    };
  }

  const threshold = chooseThreshold(peakLevel, noiseFloor, resolved.sensitivity);
  const rawSegments = buildSegments(envelope, threshold, resolved.windowMs);
  const segments = cleanSegments(
    rawSegments,
    resolved.minToneMs,
    resolved.maxToneGapMs,
  );
  const contentSegments = trimOuterSilence(segments);
  const toneCount = contentSegments.filter((segment) => segment.kind === "tone").length;
  const gapCount = contentSegments.filter((segment) => segment.kind === "silence").length;

  if (toneCount === 0) {
    return {
      confidence: 0,
      decodedText: "",
      messages: ["No Morse-like tones detected. Try a cleaner recording or a lower threshold."],
      rawMorse: "",
      status: "no-tones",
      timing: {
        durationSeconds,
        estimatedUnitMs: 0,
        estimatedWpm: 0,
        gapCount,
        noiseFloor,
        peakLevel,
        threshold,
        toneCount,
      },
    };
  }

  const estimatedUnitMs =
    resolved.expectedWpm > 0
      ? 1200 / resolved.expectedWpm
      : estimateToneTimingUnit(contentSegments);
  const gapTimingModel = estimateGapTimingModel(
    contentSegments,
    estimatedUnitMs,
    resolved.wordGapScale,
    resolved.gapMode,
  );
  const rawMorse = segmentsToRawMorse(
    contentSegments,
    estimatedUnitMs,
    gapTimingModel,
  );
  const exactDecodedText = morseToText(rawMorse);
  const decodedText =
    resolved.textSpacing === "exact"
      ? exactDecodedText
      : improveDecodedTextSpacing(exactDecodedText);
  const confidence = estimateConfidence(
    contentSegments,
    estimatedUnitMs,
    gapTimingModel,
    peakLevel,
    noiseFloor,
  );
  const status: AudioDecodeStatus = confidence < 0.58 ? "low-confidence" : "success";
  const messages =
    status === "success"
      ? ["Decoded successfully."]
      : [
          "Decoded with low confidence. The recording may be noisy, clipped, or inconsistently spaced.",
        ];

  return {
    confidence,
    decodedText,
    messages,
    rawMorse,
    status,
    timing: {
      durationSeconds,
      estimatedUnitMs,
      estimatedWpm: estimatedUnitMs > 0 ? 1200 / estimatedUnitMs : 0,
      gapCount,
      noiseFloor,
      peakLevel,
      threshold,
      toneCount,
    },
  };
}

function buildEnvelope(samples: Float32Array, sampleRate: number, windowMs: number) {
  const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const envelope: number[] = [];

  for (let start = 0; start < samples.length; start += windowSize) {
    const end = Math.min(samples.length, start + windowSize);
    let sumSquares = 0;
    for (let index = start; index < end; index += 1) {
      const sample = samples[index] ?? 0;
      sumSquares += sample * sample;
    }
    envelope.push(Math.sqrt(sumSquares / Math.max(1, end - start)));
  }

  return envelope;
}

function chooseThreshold(peakLevel: number, noiseFloor: number, sensitivity: number) {
  const thresholdRatio = 0.38 - clamp(sensitivity, 0, 1) * 0.26;
  return noiseFloor + (peakLevel - noiseFloor) * clamp(thresholdRatio, 0.08, 0.34);
}

function buildSegments(envelope: number[], threshold: number, windowMs: number) {
  if (!envelope.length) return [];

  const segments: Segment[] = [];
  let currentKind: SegmentKind = envelope[0] >= threshold ? "tone" : "silence";
  let startIndex = 0;

  for (let index = 1; index < envelope.length; index += 1) {
    const nextKind: SegmentKind = envelope[index] >= threshold ? "tone" : "silence";
    if (nextKind === currentKind) continue;

    segments.push(createSegment(currentKind, startIndex, index, windowMs));
    currentKind = nextKind;
    startIndex = index;
  }

  segments.push(createSegment(currentKind, startIndex, envelope.length, windowMs));
  return segments;
}

function cleanSegments(
  segments: Segment[],
  minToneMs: number,
  maxToneGapMs: number,
) {
  let cleaned = segments.map((segment) => ({ ...segment }));
  const shortGapLimit = Math.max(4, maxToneGapMs);

  cleaned = cleaned.map((segment, index) => {
    const previous = cleaned[index - 1];
    const next = cleaned[index + 1];
    if (
      segment.kind === "silence" &&
      segment.durationMs <= shortGapLimit &&
      previous?.kind === "tone" &&
      next?.kind === "tone"
    ) {
      return { ...segment, kind: "tone" };
    }
    return segment;
  });
  cleaned = mergeAdjacentSegments(cleaned);

  cleaned = cleaned.map((segment, index) => {
    const previous = cleaned[index - 1];
    const next = cleaned[index + 1];
    if (
      segment.kind === "tone" &&
      segment.durationMs < minToneMs &&
      (previous?.kind === "silence" || next?.kind === "silence")
    ) {
      return { ...segment, kind: "silence" };
    }
    return segment;
  });

  return mergeAdjacentSegments(cleaned);
}

function mergeAdjacentSegments(segments: Segment[]) {
  const merged: Segment[] = [];

  for (const segment of segments) {
    const previous = merged[merged.length - 1];
    if (previous?.kind === segment.kind) {
      previous.endMs = segment.endMs;
      previous.durationMs = previous.endMs - previous.startMs;
      continue;
    }
    merged.push({ ...segment });
  }

  return merged;
}

function trimOuterSilence(segments: Segment[]) {
  let start = 0;
  let end = segments.length;

  while (segments[start]?.kind === "silence") start += 1;
  while (segments[end - 1]?.kind === "silence") end -= 1;

  return segments.slice(start, end);
}

function estimateToneTimingUnit(segments: Segment[]) {
  const candidates: number[] = [];
  const contentSegments = trimOuterSilence(segments);

  contentSegments.forEach((segment) => {
    if (segment.kind !== "tone" || segment.durationMs <= 0) return;
    candidates.push(segment.durationMs, segment.durationMs / 3);
  });

  const viableCandidates = candidates.filter((candidate) => candidate >= 18 && candidate <= 600);
  if (!viableCandidates.length) {
    const shortestTone = Math.min(
      ...contentSegments
        .filter((segment) => segment.kind === "tone")
        .map((segment) => segment.durationMs),
    );
    return Number.isFinite(shortestTone) ? shortestTone : 80;
  }

  let bestCandidate = viableCandidates[0] ?? 80;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of viableCandidates) {
    const score = contentSegments.reduce((sum, segment) => {
      if (segment.kind !== "tone") return sum;
      const units = [1, 3];
      const expected = nearestExpectedDuration(segment.durationMs, candidate, units);
      const error = Math.abs(segment.durationMs - expected) / Math.max(candidate, expected);
      return sum + error * error;
    }, 0);

    if (score < bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}

function estimateGapTimingModel(
  segments: Segment[],
  unitMs: number,
  wordGapScale: number,
  gapMode: GapMode,
): GapTimingModel {
  const fallback = standardGapTimingModel(unitMs, wordGapScale);
  const gaps = segments
    .filter((segment) => segment.kind === "silence" && segment.durationMs > 0)
    .map((segment) => segment.durationMs);

  if (!gaps.length || gapMode === "standard") return fallback;

  const clusters = clusterDurationsByLog(gaps, Math.min(3, gaps.length));
  if (!clusters.length) return fallback;

  const centers = clusters.map((cluster) => cluster.centerMs).sort((a, b) => a - b);
  const symbolGapMs = centers[0] ?? fallback.symbolGapMs;
  const letterGapMs = centers[1] ?? fallback.letterGapMs;
  const wordGapMs = centers[2] ?? Math.max(fallback.wordGapMs, letterGapMs * 2.4);
  const separatedLetterGap = letterGapMs >= symbolGapMs * 1.8;

  if (gapMode === "auto" && !separatedLetterGap) return fallback;

  const letterThresholdMs = separatedLetterGap
    ? geometricMidpoint(symbolGapMs, letterGapMs)
    : fallback.letterThresholdMs;
  const wordThresholdMs =
    centers.length >= 3 && wordGapMs >= letterGapMs * 1.45
      ? geometricMidpoint(letterGapMs, wordGapMs) * clamp(wordGapScale, 0.72, 1.35)
      : Math.max(fallback.wordThresholdMs, letterGapMs * 1.75);

  return {
    letterThresholdMs,
    symbolGapMs,
    letterGapMs: separatedLetterGap ? letterGapMs : fallback.letterGapMs,
    wordGapMs,
    wordThresholdMs,
  };
}

function standardGapTimingModel(unitMs: number, wordGapScale: number): GapTimingModel {
  return {
    letterThresholdMs: unitMs * 2.25,
    symbolGapMs: unitMs,
    letterGapMs: unitMs * 3,
    wordGapMs: unitMs * 7,
    wordThresholdMs: unitMs * 5.8 * clamp(wordGapScale, 0.72, 1.35),
  };
}

function classifyGapWithTimingModel(
  durationMs: number,
  gapTimingModel: GapTimingModel,
): GapClassification {
  if (durationMs >= gapTimingModel.wordThresholdMs) return "word";
  if (durationMs >= gapTimingModel.letterThresholdMs) return "letter";
  return "symbol";
}

function segmentsToRawMorse(
  segments: Segment[],
  unitMs: number,
  gapTimingModel: GapTimingModel,
) {
  const words: string[][] = [];
  let currentWord: string[] = [];
  let currentLetter = "";

  const flushLetter = () => {
    if (!currentLetter) return;
    currentWord.push(currentLetter);
    currentLetter = "";
  };

  const flushWord = () => {
    flushLetter();
    if (currentWord.length) words.push(currentWord);
    currentWord = [];
  };

  for (const segment of segments) {
    if (segment.kind === "tone") {
      currentLetter += classifyToneDuration(segment.durationMs, unitMs);
      continue;
    }

    const gap = classifyGapWithTimingModel(segment.durationMs, gapTimingModel);
    if (gap === "letter") flushLetter();
    if (gap === "word") flushWord();
  }

  flushWord();
  return words.map((word) => word.join(" ")).join(" / ");
}

function estimateConfidence(
  segments: Segment[],
  unitMs: number,
  gapTimingModel: GapTimingModel,
  peakLevel: number,
  noiseFloor: number,
) {
  if (unitMs <= 0) return 0;

  const errors = segments.map((segment) => {
    if (segment.kind === "tone") {
      const symbol = classifyToneDuration(segment.durationMs, unitMs);
      const expected = symbol === "-" ? unitMs * 3 : unitMs;
      return Math.abs(segment.durationMs - expected) / Math.max(unitMs, expected);
    }

    const gap = classifyGapWithTimingModel(segment.durationMs, gapTimingModel);
    const expected =
      gap === "word"
        ? gapTimingModel.wordGapMs
        : gap === "letter"
          ? gapTimingModel.letterGapMs
          : gapTimingModel.symbolGapMs;
    return Math.abs(segment.durationMs - expected) / Math.max(unitMs, expected);
  });
  const averageError =
    errors.reduce((sum, error) => sum + error, 0) / Math.max(1, errors.length);
  const signalSeparation = peakLevel > 0 ? (peakLevel - noiseFloor) / peakLevel : 0;

  return clamp(1 - averageError * 0.85, 0, 1) * clamp(signalSeparation, 0.35, 1);
}

function nearestExpectedDuration(durationMs: number, unitMs: number, units: number[]) {
  return units
    .map((unit) => unit * unitMs)
    .reduce((best, value) =>
      Math.abs(value - durationMs) < Math.abs(best - durationMs) ? value : best,
    );
}

function improveDecodedTextSpacing(decodedText: string) {
  if (!decodedText) return decodedText;

  return decodedText
    .split(/(\s+)/)
    .map((part) => (/\s+/.test(part) ? part : improveDecodedToken(part)))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function improveDecodedToken(token: string) {
  return token
    .split(/([/(),.:;!?])/)
    .map((part) => {
      if (!/^[A-Z]{7,}$/.test(part)) return part;
      return splitJoinedWords(part)?.join(" ") ?? part;
    })
    .join("");
}

function splitJoinedWords(token: string) {
  if (SMART_SPACING_WORDS.has(token)) return null;

  type SplitState = {
    score: number;
    words: string[];
  };

  const states: Array<SplitState | undefined> = [{ score: 0, words: [] }];

  for (let start = 0; start < token.length; start += 1) {
    const state = states[start];
    if (!state) continue;

    for (let end = start + 1; end <= token.length; end += 1) {
      const word = token.slice(start, end);
      if (!isSmartSpacingWord(word, start, end, token.length)) continue;

      const nextScore = state.score + word.length * word.length - 8;
      const previous = states[end];
      if (!previous || nextScore > previous.score) {
        states[end] = { score: nextScore, words: [...state.words, word] };
      }
    }
  }

  const result = states[token.length];
  if (!result || result.words.length < 2) return null;
  return result.words;
}

function isSmartSpacingWord(
  word: string,
  start: number,
  end: number,
  tokenLength: number,
) {
  if (!SMART_SPACING_WORDS.has(word)) return false;
  if (word.length >= 3) return true;
  if ((word === "A" || word === "I") && (start === 0 || end === tokenLength)) {
    return true;
  }
  return false;
}

function createSegment(kind: SegmentKind, startIndex: number, endIndex: number, windowMs: number) {
  const startMs = startIndex * windowMs;
  const endMs = endIndex * windowMs;
  return {
    durationMs: endMs - startMs,
    endMs,
    kind,
    startMs,
  };
}

function createEmptyTiming(durationSeconds: number): AudioTimingSummary {
  return {
    durationSeconds,
    estimatedUnitMs: 0,
    estimatedWpm: 0,
    gapCount: 0,
    noiseFloor: 0,
    peakLevel: 0,
    threshold: 0,
    toneCount: 0,
  };
}

function clusterDurationsByLog(values: number[], clusterCount: number) {
  const positiveValues = values.filter((value) => value > 0).sort((a, b) => a - b);
  if (!positiveValues.length || clusterCount <= 0) return [];

  const grouped = [[positiveValues[0]!]];
  for (const value of positiveValues.slice(1)) {
    const currentGroup = grouped[grouped.length - 1]!;
    const previousValue = currentGroup[currentGroup.length - 1]!;
    const startsNewCluster =
      grouped.length < clusterCount && value / Math.max(1, previousValue) >= 1.65;

    if (startsNewCluster) grouped.push([value]);
    else currentGroup.push(value);
  }

  return grouped
    .filter((group) => group.length > 0)
    .map((group) => ({
      centerMs: group.reduce((sum, value) => sum + value, 0) / group.length,
      count: group.length,
    }))
    .sort((a, b) => a.centerMs - b.centerMs);
}

function geometricMidpoint(a: number, b: number) {
  if (a <= 0 || b <= 0) return (a + b) / 2;
  return Math.sqrt(a * b);
}

function percentile(values: number[], percentileValue: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor(sorted.length * percentileValue)),
  );
  return sorted[index] ?? 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
