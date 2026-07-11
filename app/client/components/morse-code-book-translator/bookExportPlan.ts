import type { BookSourceSection } from "./bookSourceTypes";
import {
  BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES,
  BOOK_DEFAULT_PART_TARGET_MS,
  BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
  BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS,
  BOOK_ZIP_BATCH_TARGET_MS,
  estimateAudioPcmBytes,
  findOversizedAudioExportPart,
  findOversizedVideoExportPart,
} from "./bookExportSafety";
import type {
  BookExportBatch,
  BookExportPart,
  BookExportSettings,
  BookOutputType,
} from "./bookExportTypes";
import {
  getBookAudioFilePaddingMs,
  getBookPartAudioDurationMs,
} from "./bookDurationEstimate";
import { segmentBookText } from "./bookSegmentation";
import type { BookVideoSettings } from "./bookVideoTypes";
import { MORSE_EXPORT_THRESHOLDS } from "~/client/components/shared/export/morseExportPlan";

export type BookExportPlan = {
  automaticSplit: boolean;
  batches: BookExportBatch[];
  batchTargetMs: number;
  directFileRuntimeLimitMs: number;
  maxPartMs: number;
  parts: BookExportPart[];
  requestedPartCount: number;
  requestedSplitMode: BookExportSettings["splitMode"];
  /** A No split audio request that cannot be rendered safely as one file. */
  singleFileUnsafe: boolean;
  targetPartMs: number;
  totalRuntimeMs: number;
  unresolvedOversizedPart: BookExportPart | null;
  zipWorkflow: boolean;
};

type BuildBookExportPlanOptions = {
  cleanedText: string;
  outputType: BookOutputType;
  settings: BookExportSettings;
  sourceSections?: BookSourceSection[];
  sourceTitle?: string;
  videoSettings?: BookVideoSettings;
};

const AUTO_SPLIT_TARGET_RATIO = 0.98;

export function buildBookExportPlan({
  cleanedText,
  outputType,
  settings,
  sourceSections = [],
  sourceTitle,
  videoSettings,
}: BuildBookExportPlanOptions): BookExportPlan {
  const maxPartMs =
    outputType === "video"
      ? BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS[videoSettings?.resolution ?? "1080p"]
      : audioMaxPartMs(settings);
  const requestedParts = segmentBookText({
    cleanedText,
    settings,
    sourceSections,
    sourceTitle,
  });
  const requestedOversized =
    outputType === "video"
      ? videoSettings
        ? findOversizedVideoExportPart(requestedParts, videoSettings)
        : null
      : findOversizedAudioExportPart(requestedParts, settings);
  const audioSettings = outputType === "audio" ? settings : undefined;
  const requestedRuntimeMs = totalPartRuntimeMs(requestedParts, audioSettings);
  const needsRuntimeSplit =
    requestedRuntimeMs > BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS;
  const needsAutomaticSplit = needsRuntimeSplit || Boolean(requestedOversized);

  // Audio controls have an explicit public policy. No split must stay one
  // file; callers use the unsafe flag to stop before renderer allocation.
  // Keep the established automatic protection for the separate video path.
  const explicitAudioNoSplit = outputType === "audio" && settings.splitMode === "none";
  const explicitAudioSplit = outputType === "audio" && settings.splitMode !== "none";
  if (explicitAudioNoSplit) {
    const singleFileUnsafe = needsAutomaticSplit;
    const unsafePart = requestedOversized?.part ?? requestedParts[0] ?? null;
    const batches = buildBookExportBatches(
      requestedParts,
      BOOK_ZIP_BATCH_TARGET_MS,
      audioSettings,
    );
    return {
      automaticSplit: false,
      batches,
      batchTargetMs: BOOK_ZIP_BATCH_TARGET_MS,
      directFileRuntimeLimitMs: BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
      maxPartMs,
      parts: requestedParts,
      requestedPartCount: requestedParts.length,
      requestedSplitMode: settings.splitMode,
      singleFileUnsafe,
      targetPartMs: settings.targetPartMinutes * 60_000,
      totalRuntimeMs: requestedRuntimeMs,
      unresolvedOversizedPart: singleFileUnsafe ? unsafePart : null,
      zipWorkflow: requestedParts.length > 1 && hasBookSidecars(settings),
    };
  }

  if (!needsAutomaticSplit) {
    const batches = buildBookExportBatches(
      requestedParts,
      BOOK_ZIP_BATCH_TARGET_MS,
      audioSettings,
    );
    return {
      automaticSplit: false,
      batches,
      batchTargetMs: BOOK_ZIP_BATCH_TARGET_MS,
      directFileRuntimeLimitMs: BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
      maxPartMs,
      parts: requestedParts,
      requestedPartCount: requestedParts.length,
      requestedSplitMode: settings.splitMode,
      singleFileUnsafe: false,
      targetPartMs: settings.targetPartMinutes * 60_000,
      totalRuntimeMs: requestedRuntimeMs,
      unresolvedOversizedPart: requestedOversized?.part ?? null,
      zipWorkflow: requestedParts.length > 1 && hasBookSidecars(settings),
    };
  }

  const audioFilePaddingMs = audioSettings
    ? getBookAudioFilePaddingMs(audioSettings)
    : 0;
  const requestedTargetPartMs =
    settings.targetPartMinutes * 60_000 || BOOK_DEFAULT_PART_TARGET_MS;
  // The picker describes the eventual file duration. Segment the source a
  // little below that number so the optional lead-in and trailing silence do
  // not make every generated part exceed its displayed target.
  const contentTargetPartMs = Math.max(
    1_000,
    Math.min(
      Math.max(1_000, requestedTargetPartMs - audioFilePaddingMs),
      maxPartMs * AUTO_SPLIT_TARGET_RATIO,
    ),
  );
  const targetPartMs = contentTargetPartMs + audioFilePaddingMs;
  const automaticSettings = {
    ...settings,
    splitMode: "duration",
    splitAudio: true,
    preferSourceSections: sourceSections.length > 1,
    targetPartMinutes: contentTargetPartMs / 60_000,
  } satisfies BookExportSettings;
  const parts = segmentBookText({
    cleanedText,
    maxPartMs,
    settings: automaticSettings,
    sourceSections,
    sourceTitle,
  });
  const unresolved =
    outputType === "video"
      ? videoSettings
        ? findOversizedVideoExportPart(parts, videoSettings)
        : null
      : findOversizedAudioExportPart(parts, settings);

  return {
    automaticSplit: !explicitAudioSplit,
    batches: buildBookExportBatches(
      parts,
      BOOK_ZIP_BATCH_TARGET_MS,
      audioSettings,
    ),
    batchTargetMs: BOOK_ZIP_BATCH_TARGET_MS,
    directFileRuntimeLimitMs: BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
    maxPartMs,
    parts,
    requestedPartCount: requestedParts.length,
    requestedSplitMode: settings.splitMode,
    singleFileUnsafe: false,
    targetPartMs,
    totalRuntimeMs: totalPartRuntimeMs(parts, audioSettings),
    unresolvedOversizedPart: unresolved?.part ?? null,
    zipWorkflow: parts.length > 1 && hasBookSidecars(settings),
  };
}

export function audioMaxPartMs(settings: BookExportSettings) {
  const threshold = MORSE_EXPORT_THRESHOLDS[settings.outputFormat];
  const audioFilePaddingMs = getBookAudioFilePaddingMs(settings);
  const byteLimitedMs =
    settings.outputFormat === "wav"
      ? Math.floor(
          ((threshold.maxEstimatedBytes - 44) /
            Math.max(1, settings.sampleRate * 2)) *
            1000,
        )
      : Math.floor(
          (((threshold.maxEstimatedBytes - 4096) * 8) /
            Math.max(1, settings.mp3Bitrate * 1000)) *
          1000,
        );
  // Some book helpers still need a PCM representation (for example, local
  // preview/analysis). Keep every planned part within that conservative
  // Float32 buffer ceiling as well as its encoded-output ceiling.
  const pcmByteLimitedMs = Math.floor(
    (BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES /
      Math.max(1, settings.sampleRate * Float32Array.BYTES_PER_ELEMENT)) *
      1000,
  );
  const renderedLimitMs = Math.min(
    threshold.maxDurationMs,
    byteLimitedMs,
    pcmByteLimitedMs,
  );
  return Math.max(
    1_000,
    renderedLimitMs - audioFilePaddingMs,
  );
}

export function estimateLargestAudioPartPcmBytes(
  parts: BookExportPart[],
  settings: BookExportSettings,
) {
  return parts.reduce(
    (max, part) =>
      Math.max(
        max,
        estimateAudioPcmBytes(
          getBookPartAudioDurationMs(part, settings),
          settings.sampleRate,
        ),
      ),
    0,
  );
}

export function buildBookExportBatches(
  parts: BookExportPart[],
  targetRuntimeMs = BOOK_ZIP_BATCH_TARGET_MS,
  audioSettings?: BookExportSettings,
): BookExportBatch[] {
  if (parts.length === 0) return [];
  const batches: Array<Omit<BookExportBatch, "batchNumber" | "totalBatches">> = [];
  let currentParts: BookExportPart[] = [];
  let currentRuntimeMs = 0;
  const safeTargetMs = Math.max(1, targetRuntimeMs);

  for (const part of parts) {
    const partRuntimeMs = audioSettings
      ? getBookPartAudioDurationMs(part, audioSettings)
      : Math.max(0, part.morseDurationMs);
    if (
      currentParts.length > 0 &&
      currentRuntimeMs + partRuntimeMs > safeTargetMs
    ) {
      batches.push({
        parts: currentParts,
        runtimeMs: currentRuntimeMs,
        targetRuntimeMs: safeTargetMs,
      });
      currentParts = [];
      currentRuntimeMs = 0;
    }

    currentParts.push(part);
    currentRuntimeMs += partRuntimeMs;
  }

  if (currentParts.length > 0) {
    batches.push({
      parts: currentParts,
      runtimeMs: currentRuntimeMs,
      targetRuntimeMs: safeTargetMs,
    });
  }

  return batches.map((batch, index) => ({
    ...batch,
    batchNumber: index + 1,
    totalBatches: batches.length,
  }));
}

function totalPartRuntimeMs(
  parts: BookExportPart[],
  audioSettings?: BookExportSettings,
) {
  return parts.reduce(
    (total, part) =>
      total +
      (audioSettings
        ? getBookPartAudioDurationMs(part, audioSettings)
        : Math.max(0, part.morseDurationMs)),
    0,
  );
}

function hasBookSidecars(settings: BookExportSettings) {
  return (
    settings.includeCleanedText ||
    settings.includeMorseTranscript ||
    settings.includeManifest ||
    settings.includeSettings ||
    settings.includeReadme
  );
}
