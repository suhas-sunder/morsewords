import { morseToText } from "~/client/components/shared/morseUtils";

export type AudioDecodeStatus =
  | "success"
  | "low-confidence"
  | "no-tones"
  | "empty-audio"
  | "too-short"
  | "too-long"
  | "too-large"
  | "unsupported-file"
  | "analysis-too-large";

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

export type AudioDecoderValidationResult =
  | {
      ok: true;
    }
  | {
      message: string;
      ok: false;
      status: AudioDecodeStatus;
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

export const AUDIO_DECODER_LIMITS = {
  maxUploadBytes: 25 * 1024 * 1024,
  maxDecodedDurationSeconds: 180,
  minUsefulDurationSeconds: 0.25,
  maxAnalysisFrames: 60_000,
} as const;

const AUDIO_FILE_EXTENSION_RE = /\.(aac|aif|aiff|flac|m4a|mp3|oga|ogg|opus|wav|webm)$/i;

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

export function createAudioDecodeResult(
  status: AudioDecodeStatus,
  messages: string[],
  timing: Partial<AudioTimingSummary> = {},
): AudioDecodeResult {
  return {
    confidence: 0,
    decodedText: "",
    messages,
    rawMorse: "",
    status,
    timing: {
      ...createEmptyTiming(timing.durationSeconds ?? 0),
      ...timing,
    },
  };
}

export function validateAudioDecoderFile(file: {
  name?: string;
  size: number;
  type?: string;
}): AudioDecoderValidationResult {
  if (file.size > AUDIO_DECODER_LIMITS.maxUploadBytes) {
    return {
      ok: false,
      status: "too-large",
      message: `This file is too large to decode safely. Choose an audio file under ${formatBytes(AUDIO_DECODER_LIMITS.maxUploadBytes)}.`,
    };
  }

  const type = file.type?.trim().toLowerCase() ?? "";
  const name = file.name ?? "";
  const looksLikeAudio =
    type.startsWith("audio/") ||
    AUDIO_FILE_EXTENSION_RE.test(name) ||
    type === "application/octet-stream";

  if (!looksLikeAudio) {
    return {
      ok: false,
      status: "unsupported-file",
      message:
        "Choose a browser-supported audio file. WAV is safest; compressed formats depend on your browser.",
    };
  }

  return { ok: true };
}

export function validateDecodedAudioBuffer(audioBuffer: {
  duration?: number;
  length: number;
  numberOfChannels: number;
  sampleRate: number;
}): AudioDecoderValidationResult {
  const durationSeconds = getAudioBufferDurationSeconds(audioBuffer);

  if (
    audioBuffer.length <= 0 ||
    audioBuffer.numberOfChannels <= 0 ||
    audioBuffer.sampleRate <= 0 ||
    !Number.isFinite(durationSeconds)
  ) {
    return {
      ok: false,
      status: "empty-audio",
      message: "The decoded file did not contain usable audio samples.",
    };
  }
  const safeDurationSeconds = durationSeconds;

  if (safeDurationSeconds > AUDIO_DECODER_LIMITS.maxDecodedDurationSeconds) {
    return {
      ok: false,
      status: "too-long",
      message: `This audio is too long to decode safely. Keep files under ${AUDIO_DECODER_LIMITS.maxDecodedDurationSeconds} seconds.`,
    };
  }

  if (safeDurationSeconds < AUDIO_DECODER_LIMITS.minUsefulDurationSeconds) {
    return {
      ok: false,
      status: "too-short",
      message:
        "This audio is too short to decode reliably. Use at least a quarter second of clear Morse tone.",
    };
  }

  return { ok: true };
}

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
  const resolved = sanitizeAudioDecoderOptions({ ...DEFAULT_OPTIONS, ...options });
  const durationSeconds =
    sampleRate > 0 && samples.length > 0 ? samples.length / sampleRate : 0;
  const emptyTiming = createEmptyTiming(durationSeconds);

  if (!samples.length || sampleRate <= 0) {
    return createAudioDecodeResult("empty-audio", [
      "No audio samples were available to analyze.",
    ]);
  }

  if (durationSeconds < AUDIO_DECODER_LIMITS.minUsefulDurationSeconds) {
    return createAudioDecodeResult(
      "too-short",
      [
        "This audio is too short to decode reliably. Use at least a quarter second of clear Morse tone.",
      ],
      { durationSeconds },
    );
  }

  if (durationSeconds > AUDIO_DECODER_LIMITS.maxDecodedDurationSeconds) {
    return createAudioDecodeResult(
      "too-long",
      [
        `This audio is too long to decode safely. Keep files under ${AUDIO_DECODER_LIMITS.maxDecodedDurationSeconds} seconds.`,
      ],
      { durationSeconds },
    );
  }

  const estimatedFrameCount = Math.ceil(
    (durationSeconds * 1000) / Math.max(1, resolved.windowMs),
  );
  if (estimatedFrameCount > AUDIO_DECODER_LIMITS.maxAnalysisFrames) {
    return createAudioDecodeResult(
      "analysis-too-large",
      [
        "This audio would create too many analysis frames. Use a shorter file or a wider analysis window.",
      ],
      { durationSeconds },
    );
  }

  const sampleStats = calculateSampleStats(samples);
  const envelope = smoothEnvelope(
    buildEnvelope(samples, sampleRate, resolved.windowMs, sampleStats.mean),
  );
  const peakLevel = maxValue(envelope);
  const noiseFloor = percentile(envelope, 0.2);
  const signalSeparation =
    peakLevel > 0 ? (peakLevel - noiseFloor) / peakLevel : 0;

  if (peakLevel < 0.0005) {
    return createAudioDecodeResult(
      "no-tones",
      [
        "No clear tone was detected. Try a louder, cleaner single-tone recording.",
      ],
      { ...emptyTiming, noiseFloor, peakLevel },
    );
  }

  const threshold = chooseThreshold(peakLevel, noiseFloor, resolved.sensitivity);
  const offThreshold = chooseOffThreshold(threshold, noiseFloor);
  const rawSegments = buildSegments(
    envelope,
    threshold,
    offThreshold,
    resolved.windowMs,
  );
  const segments = cleanSegments(
    rawSegments,
    resolved.minToneMs,
    resolved.maxToneGapMs,
  );
  const contentSegments = trimOuterSilence(segments);
  const toneCount = contentSegments.filter((segment) => segment.kind === "tone").length;
  const gapCount = contentSegments.filter((segment) => segment.kind === "silence").length;

  if (toneCount === 0) {
    return createAudioDecodeResult(
      "no-tones",
      [
        "No clear Morse-like tones remained after filtering clicks and noise.",
      ],
      {
        durationSeconds,
        gapCount,
        noiseFloor,
        peakLevel,
        threshold,
        toneCount,
      },
    );
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
  const exactDecodeResult = morseToText(rawMorse, {
    mode: "loose",
    returnResult: true,
  });
  const unknownTokenCount = exactDecodeResult.issues.filter(
    (issue) => issue.type === "unknown-morse-token",
  ).length;
  const exactDecodedText = exactDecodeResult.value;
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
  const warnings = buildQualityWarnings({
    confidence,
    peakLevel,
    signalSeparation,
    toneCount,
    unknownTokenCount,
  });
  const status: AudioDecodeStatus =
    confidence < 0.58 || unknownTokenCount > 0 ? "low-confidence" : "success";
  const messages = [
    status === "success"
      ? "Decoded successfully."
      : "Decoded with low confidence. Check the raw Morse against the audio.",
    ...warnings,
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

function buildEnvelope(
  samples: Float32Array,
  sampleRate: number,
  windowMs: number,
  dcOffset: number,
) {
  const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const envelope: number[] = [];

  for (let start = 0; start < samples.length; start += windowSize) {
    const end = Math.min(samples.length, start + windowSize);
    let sumSquares = 0;
    for (let index = start; index < end; index += 1) {
      const sample = clamp((samples[index] ?? 0) - dcOffset, -1, 1);
      sumSquares += sample * sample;
    }
    envelope.push(Math.sqrt(sumSquares / Math.max(1, end - start)));
  }

  return envelope;
}

function smoothEnvelope(envelope: number[]) {
  if (envelope.length < 3) return envelope;

  return envelope.map((value, index) => {
    const previous = envelope[index - 1] ?? value;
    const next = envelope[index + 1] ?? value;
    return previous * 0.1 + value * 0.8 + next * 0.1;
  });
}

function chooseThreshold(peakLevel: number, noiseFloor: number, sensitivity: number) {
  const thresholdRatio = 0.38 - clamp(sensitivity, 0, 1) * 0.26;
  return noiseFloor + (peakLevel - noiseFloor) * clamp(thresholdRatio, 0.08, 0.34);
}

function chooseOffThreshold(onThreshold: number, noiseFloor: number) {
  return noiseFloor + (onThreshold - noiseFloor) * 0.58;
}

function buildSegments(
  envelope: number[],
  onThreshold: number,
  offThreshold: number,
  windowMs: number,
) {
  if (!envelope.length) return [];

  const segments: Segment[] = [];
  let currentKind: SegmentKind = envelope[0] >= onThreshold ? "tone" : "silence";
  let startIndex = 0;

  for (let index = 1; index < envelope.length; index += 1) {
    const value = envelope[index] ?? 0;
    const nextKind: SegmentKind =
      currentKind === "tone"
        ? value >= offThreshold
          ? "tone"
          : "silence"
        : value >= onThreshold
          ? "tone"
          : "silence";
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

function buildQualityWarnings({
  confidence,
  peakLevel,
  signalSeparation,
  toneCount,
  unknownTokenCount,
}: {
  confidence: number;
  peakLevel: number;
  signalSeparation: number;
  toneCount: number;
  unknownTokenCount: number;
}) {
  const warnings: string[] = [];

  if (peakLevel < 0.01) {
    warnings.push("The audio is very quiet, so the result may be unreliable.");
  }
  if (signalSeparation < 0.42) {
    warnings.push("Background noise is close to the tone level.");
  }
  if (toneCount < 3) {
    warnings.push("Very few tone regions were detected.");
  }
  if (confidence < 0.58) {
    warnings.push("Timing was inconsistent across detected marks and gaps.");
  }
  if (unknownTokenCount > 0) {
    warnings.push(
      `${unknownTokenCount} Morse group${unknownTokenCount === 1 ? "" : "s"} could not be decoded.`,
    );
  }

  return warnings;
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

function sanitizeAudioDecoderOptions(
  options: Required<AudioDecoderOptions>,
): Required<AudioDecoderOptions> {
  return {
    expectedWpm: clamp(options.expectedWpm, 0, 60),
    gapMode: options.gapMode,
    maxToneGapMs: clamp(options.maxToneGapMs, 0, 80),
    minToneMs: clamp(options.minToneMs, 8, 120),
    sensitivity: clamp(options.sensitivity, 0.2, 0.9),
    textSpacing: options.textSpacing,
    windowMs: clamp(options.windowMs, 4, 40),
    wordGapScale: clamp(options.wordGapScale, 0.6, 1.6),
  };
}

function calculateSampleStats(samples: Float32Array) {
  let sum = 0;

  for (const sample of samples) {
    const safeSample = Number.isFinite(sample) ? sample : 0;
    sum += safeSample;
  }

  return {
    mean: sum / Math.max(1, samples.length),
  };
}

function getAudioBufferDurationSeconds(audioBuffer: {
  duration?: number;
  length: number;
  sampleRate: number;
}) {
  const duration = audioBuffer.duration;
  if (typeof duration === "number" && Number.isFinite(duration) && duration > 0) {
    return duration;
  }

  return audioBuffer.sampleRate > 0 ? audioBuffer.length / audioBuffer.sampleRate : 0;
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

function maxValue(values: number[]) {
  let max = 0;
  for (const value of values) max = Math.max(max, value);
  return max;
}

function formatBytes(bytes: number) {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
