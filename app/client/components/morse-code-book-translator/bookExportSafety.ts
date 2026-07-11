import {
  formatBytes,
  formatDuration,
  getBookPartAudioDurationMs,
} from "./bookDurationEstimate";
import type {
  BookExportPart,
  BookExportSettings,
  BookOutputType,
} from "./bookExportTypes";
import type { MorseVideoFormat } from "~/client/components/shared/video/morseVideoSupport";
import type { BookVideoSettings } from "./bookVideoTypes";
import type { BookVideoResolution } from "./bookVideoTypes";
import {
  estimateExportBytes,
  MORSE_EXPORT_THRESHOLDS,
} from "~/client/components/shared/export/morseExportPlan";
import { getMorseVideoExportProfile } from "~/client/components/shared/video/morseVideoRenderer";

export const BOOK_OVERSIZED_EXPORT_MESSAGE =
  "A download part is still too large to render reliably. MorseWords could not split it smaller automatically.";

export const BOOK_LONG_EXPORT_MESSAGE =
  "This selection has a lot of text, so the download may take a while. MorseWords will prepare it in smaller parts to keep the export reliable.";

export const BOOK_LONG_EXPORT_KEEP_OPEN_MESSAGE =
  "Keep this tab open while the files are being prepared. Your browser may ask you to allow multiple downloads; each file is requested when it is ready.";

export const BOOK_DIRECT_FILE_RUNTIME_LIMIT_MS = 60 * 60 * 1000;
export const BOOK_DEFAULT_PART_TARGET_MINUTES = 30;
export const BOOK_DEFAULT_PART_TARGET_MS =
  BOOK_DEFAULT_PART_TARGET_MINUTES * 60 * 1000;
export const BOOK_ZIP_BATCH_TARGET_MS = 2 * 60 * 60 * 1000;
export const BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS =
  MORSE_EXPORT_THRESHOLDS.mp3.maxDurationMs;
export const BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES =
  MORSE_EXPORT_THRESHOLDS.wav.maxEstimatedBytes;
export const BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS: Record<
  BookVideoResolution,
  number
> = {
  "720p": getMorseVideoExportProfile("720p").threshold.maxDurationMs,
  "1080p": getMorseVideoExportProfile("1080p").threshold.maxDurationMs,
  "1440p": getMorseVideoExportProfile("1440p").threshold.maxDurationMs,
  "4k": getMorseVideoExportProfile("4k").threshold.maxDurationMs,
};

export type OversizedBookExportPart = {
  part: BookExportPart;
  runtimeMs: number;
  estimatedBytes: number;
  limitMs: number;
};

export type BookVideoExportEstimate = {
  estimatedBytes: number;
  sizeLabel: string;
  renderTimeLabel: string;
};

export function estimateAudioPcmBytes(runtimeMs: number, sampleRate: number) {
  if (!Number.isFinite(runtimeMs) || runtimeMs <= 0) return 0;
  return Math.ceil((runtimeMs / 1000) * sampleRate * Float32Array.BYTES_PER_ELEMENT);
}

export function findOversizedAudioExportPart(
  parts: BookExportPart[],
  settings: BookExportSettings,
): OversizedBookExportPart | null {
  for (const part of parts) {
    const runtimeMs = getBookPartAudioDurationMs(part, settings);
    const threshold = MORSE_EXPORT_THRESHOLDS[settings.outputFormat];
    const estimatedBytes = estimateExportBytes({
      durationMs: runtimeMs,
      format: settings.outputFormat,
      mp3Kbps: settings.mp3Bitrate,
      sampleRate: settings.sampleRate,
    });
    const pcmBytes = estimateAudioPcmBytes(runtimeMs, settings.sampleRate);
    if (
      runtimeMs > threshold.maxDurationMs ||
      estimatedBytes > threshold.maxEstimatedBytes ||
      pcmBytes > BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES
    ) {
      return {
        part,
        runtimeMs,
        estimatedBytes: Math.max(estimatedBytes, pcmBytes),
        limitMs: threshold.maxDurationMs,
      };
    }
  }
  return null;
}

export function assertBookAudioPartsWithinBrowserLimit(
  parts: BookExportPart[],
  settings: BookExportSettings,
) {
  if (findOversizedAudioExportPart(parts, settings)) {
    throw new Error(BOOK_OVERSIZED_EXPORT_MESSAGE);
  }
}

export function assertAudioRenderWithinBrowserLimit(
  runtimeMs: number,
  sampleRate: number,
  format: "mp3" | "wav" = "wav",
  mp3Kbps = 128,
) {
  const threshold = MORSE_EXPORT_THRESHOLDS[format];
  const estimatedBytes = estimateExportBytes({
    durationMs: runtimeMs,
    format,
    mp3Kbps,
    sampleRate,
  });
  const pcmBytes = estimateAudioPcmBytes(runtimeMs, sampleRate);
  if (
    runtimeMs > threshold.maxDurationMs ||
    estimatedBytes > threshold.maxEstimatedBytes ||
    pcmBytes > BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES
  ) {
    throw new Error(BOOK_OVERSIZED_EXPORT_MESSAGE);
  }
}

export function findOversizedVideoExportPart(
  parts: BookExportPart[],
  settings: BookVideoSettings,
): OversizedBookExportPart | null {
  const limitMs = BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS[settings.resolution];
  for (const part of parts) {
    const runtimeMs = Math.max(0, part.morseDurationMs);
    if (runtimeMs > limitMs) {
      return {
        part,
        runtimeMs,
        estimatedBytes: estimateBookVideoExport(runtimeMs, "webm", settings)
          .estimatedBytes,
        limitMs,
      };
    }
  }
  return null;
}

export function assertBookVideoPartsWithinBrowserLimit(
  parts: BookExportPart[],
  settings: BookVideoSettings,
) {
  if (findOversizedVideoExportPart(parts, settings)) {
    throw new Error(BOOK_OVERSIZED_EXPORT_MESSAGE);
  }
}

export function assertVideoRenderWithinBrowserLimit(
  runtimeMs: number,
  settings: BookVideoSettings,
) {
  if (runtimeMs > BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS[settings.resolution]) {
    throw new Error(BOOK_OVERSIZED_EXPORT_MESSAGE);
  }
}

export function estimateBookVideoExport(
  runtimeMs: number,
  format: MorseVideoFormat,
  settings: BookVideoSettings,
): BookVideoExportEstimate {
  const seconds = Math.max(0, runtimeMs / 1000);
  if (seconds <= 0) {
    return {
      estimatedBytes: 0,
      sizeLabel: "~0 KB",
      renderTimeLabel: "~0s",
    };
  }
  // The recorder uses this same resolution profile, so the plan changes when
  // users choose a larger frame instead of reporting a 720p-sized estimate.
  const baseVideoKbps =
    getMorseVideoExportProfile(settings.resolution).videoBitsPerSecond / 1000;
  const intensityMultiplier =
    settings.intensity === "high" ? 1.08 : settings.intensity === "low" ? 0.92 : 1;
  const layerMultiplier =
    (settings.showMorseSymbols && settings.showPlainText) || settings.visualStyle === "morse-text"
      ? 1.04
      : 1;
  const audioKbps = settings.includeAudioTrack ? 128 : 0;
  const estimatedBytes = Math.ceil(
    (((baseVideoKbps * intensityMultiplier * layerMultiplier + audioKbps) *
      1000 *
      seconds) /
      8) +
      1_048_576,
  );

  return {
    estimatedBytes,
    sizeLabel: `~${formatBytes(estimatedBytes)}`,
    renderTimeLabel: estimateVideoRenderTimeLabel(runtimeMs, format, settings),
  };
}

export function friendlyBookExportErrorMessage(
  error: unknown,
  outputType: BookOutputType,
) {
  const rawMessage = error instanceof Error ? error.message : "";
  if (/^Part \d+ failed\./.test(rawMessage)) {
    return rawMessage;
  }
  if (
    rawMessage.includes(BOOK_OVERSIZED_EXPORT_MESSAGE) ||
    /Invalid typed array length|Array buffer allocation|out of memory|maximum call stack|too large/i.test(
      rawMessage,
    )
  ) {
    return outputType === "video"
      ? "Video export failed while rendering a part. Retry the download, or lower video resolution if it fails again."
      : "Audio export failed while rendering a part. Retry the download, or use shorter parts if it fails again.";
  }

  return outputType === "video"
    ? "Video export failed. Retry the download, use 720p, or try silent video."
    : "Book download failed. Retry the download or choose a shorter part duration.";
}

export function oversizedExportDetailsLabel(
  oversized: OversizedBookExportPart | null,
) {
  if (!oversized) return "";
  return `${formatDuration(oversized.runtimeMs)} planned in one part; current part limit is about ${formatDuration(
    oversized.limitMs,
  )}.`;
}

function estimateVideoRenderTimeLabel(
  runtimeMs: number,
  format: MorseVideoFormat,
  settings: BookVideoSettings,
) {
  if (!Number.isFinite(runtimeMs) || runtimeMs <= 0) return "~0s";
  const resolutionFactor: Record<BookVideoResolution, [number, number]> = {
    "720p": [1.15, 1.55],
    "1080p": [1.6, 2.3],
    "1440p": [2.4, 3.6],
    "4k": [4.6, 7.5],
  };
  const formatFactor = format === "mp4" ? 1.1 : 1;
  const audioFactor = settings.includeAudioTrack ? 1.05 : 1;
  const [minimumFactor, maximumFactor] = resolutionFactor[settings.resolution];
  const minMs = runtimeMs * minimumFactor * formatFactor * audioFactor;
  const maxMs = runtimeMs * maximumFactor * formatFactor * audioFactor;
  return `~${formatDuration(minMs)}-${formatDuration(maxMs)}`;
}
