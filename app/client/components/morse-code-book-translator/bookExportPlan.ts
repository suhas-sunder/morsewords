import type { BookSourceSection } from "./bookSourceTypes";
import {
  BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS,
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
import { segmentBookText } from "./bookSegmentation";
import type { BookVideoSettings } from "./bookVideoTypes";

export type BookExportPlan = {
  automaticSplit: boolean;
  batches: BookExportBatch[];
  batchTargetMs: number;
  directFileRuntimeLimitMs: number;
  maxPartMs: number;
  parts: BookExportPart[];
  requestedPartCount: number;
  requestedSplitMode: BookExportSettings["splitMode"];
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
      ? BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS[videoSettings?.resolution ?? "720p"]
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
  const requestedRuntimeMs = totalPartRuntimeMs(requestedParts);
  const needsRuntimeSplit =
    requestedRuntimeMs > BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS;
  const needsAutomaticSplit = needsRuntimeSplit || Boolean(requestedOversized);

  if (!needsAutomaticSplit) {
    const batches = buildBookExportBatches(requestedParts);
    return {
      automaticSplit: false,
      batches,
      batchTargetMs: BOOK_ZIP_BATCH_TARGET_MS,
      directFileRuntimeLimitMs: BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
      maxPartMs,
      parts: requestedParts,
      requestedPartCount: requestedParts.length,
      requestedSplitMode: settings.splitMode,
      targetPartMs: settings.targetPartMinutes * 60_000,
      totalRuntimeMs: requestedRuntimeMs,
      unresolvedOversizedPart: requestedOversized?.part ?? null,
      zipWorkflow: requestedParts.length > 1,
    };
  }

  const targetPartMs = Math.max(
    60_000,
    Math.min(
      BOOK_DEFAULT_PART_TARGET_MS,
      settings.targetPartMinutes * 60_000 || BOOK_DEFAULT_PART_TARGET_MS,
      maxPartMs * AUTO_SPLIT_TARGET_RATIO,
    ),
  );
  const automaticSettings = {
    ...settings,
    splitMode: "duration",
    splitAudio: true,
    preferSourceSections: sourceSections.length > 1,
    targetPartMinutes: targetPartMs / 60_000,
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
    automaticSplit: true,
    batches: buildBookExportBatches(parts),
    batchTargetMs: BOOK_ZIP_BATCH_TARGET_MS,
    directFileRuntimeLimitMs: BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS,
    maxPartMs,
    parts,
    requestedPartCount: requestedParts.length,
    requestedSplitMode: settings.splitMode,
    targetPartMs,
    totalRuntimeMs: totalPartRuntimeMs(parts),
    unresolvedOversizedPart: unresolved?.part ?? null,
    zipWorkflow: parts.length > 1,
  };
}

export function audioMaxPartMs(settings: BookExportSettings) {
  const pcmLimitedMs = Math.floor(
    (BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES /
      Math.max(1, settings.sampleRate * Float32Array.BYTES_PER_ELEMENT)) *
      1000,
  );
  return Math.max(
    60_000,
    Math.min(BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS, pcmLimitedMs),
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
          part.morseDurationMs + Math.max(0, settings.tailPaddingMs),
          settings.sampleRate,
        ),
      ),
    0,
  );
}

export function buildBookExportBatches(
  parts: BookExportPart[],
  targetRuntimeMs = BOOK_ZIP_BATCH_TARGET_MS,
): BookExportBatch[] {
  if (parts.length === 0) return [];
  const batches: Array<Omit<BookExportBatch, "batchNumber" | "totalBatches">> = [];
  let currentParts: BookExportPart[] = [];
  let currentRuntimeMs = 0;
  const safeTargetMs = Math.max(1, targetRuntimeMs);

  for (const part of parts) {
    const partRuntimeMs = Math.max(0, part.morseDurationMs);
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

function totalPartRuntimeMs(parts: BookExportPart[]) {
  return parts.reduce((total, part) => total + Math.max(0, part.morseDurationMs), 0);
}
