import type { BookSourceSection } from "./bookSourceTypes";
import {
  BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS,
  BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES,
  BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS,
  estimateAudioPcmBytes,
  findOversizedAudioExportPart,
  findOversizedVideoExportPart,
} from "./bookExportSafety";
import type {
  BookExportPart,
  BookExportSettings,
  BookOutputType,
} from "./bookExportTypes";
import { segmentBookText } from "./bookSegmentation";
import type { BookVideoSettings } from "./bookVideoTypes";

export type BookExportPlan = {
  automaticSplit: boolean;
  maxPartMs: number;
  parts: BookExportPart[];
  requestedPartCount: number;
  requestedSplitMode: BookExportSettings["splitMode"];
  targetPartMs: number;
  unresolvedOversizedPart: BookExportPart | null;
};

type BuildBookExportPlanOptions = {
  cleanedText: string;
  outputType: BookOutputType;
  settings: BookExportSettings;
  sourceSections?: BookSourceSection[];
  sourceTitle?: string;
  videoSettings?: BookVideoSettings;
};

const AUTO_SPLIT_TARGET_RATIO = 0.86;

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
  const needsAutomaticSplit = Boolean(requestedOversized);

  if (!needsAutomaticSplit) {
    return {
      automaticSplit: false,
      maxPartMs,
      parts: requestedParts,
      requestedPartCount: requestedParts.length,
      requestedSplitMode: settings.splitMode,
      targetPartMs: settings.targetPartMinutes * 60_000,
      unresolvedOversizedPart: requestedOversized?.part ?? null,
    };
  }

  const targetPartMs = Math.max(
    60_000,
    Math.min(settings.targetPartMinutes * 60_000, maxPartMs * AUTO_SPLIT_TARGET_RATIO),
  );
  const automaticSettings = {
    ...settings,
    splitMode: sourceSections.length > 1 ? "source-sections" : "duration",
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
    maxPartMs,
    parts,
    requestedPartCount: requestedParts.length,
    requestedSplitMode: settings.splitMode,
    targetPartMs,
    unresolvedOversizedPart: unresolved?.part ?? null,
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
