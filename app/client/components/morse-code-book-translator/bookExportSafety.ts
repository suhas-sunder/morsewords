import { formatBytes, formatDuration } from "./bookDurationEstimate";
import type {
  BookExportPart,
  BookExportSettings,
  BookOutputType,
} from "./bookExportTypes";
import type { MorseVideoFormat } from "~/client/components/shared/video/morseVideoSupport";
import type { BookVideoSettings } from "./bookVideoTypes";

export const BOOK_OVERSIZED_EXPORT_MESSAGE =
  "A download part is still too large to render reliably. MorseWords could not split it smaller automatically.";

export const BOOK_LONG_EXPORT_MESSAGE =
  "This selection has a lot of text, so the download may take a while. MorseWords will prepare it in smaller parts to keep the export reliable.";

export const BOOK_LONG_EXPORT_KEEP_OPEN_MESSAGE =
  "Keep this tab open while the files are being prepared.";

export const BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS = 20 * 60 * 1000;
export const BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES = 256 * 1024 * 1024;
export const BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS = {
  "720p": 8 * 60 * 1000,
  "1080p": 5 * 60 * 1000,
} as const;

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
    const runtimeMs = partRuntimeWithTail(part, settings.tailPaddingMs);
    const estimatedBytes = estimateAudioPcmBytes(runtimeMs, settings.sampleRate);
    if (
      runtimeMs > BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS ||
      estimatedBytes > BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES
    ) {
      return {
        part,
        runtimeMs,
        estimatedBytes,
        limitMs: BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS,
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
) {
  const estimatedBytes = estimateAudioPcmBytes(runtimeMs, sampleRate);
  if (
    runtimeMs > BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS ||
    estimatedBytes > BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES
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
  const baseVideoKbps =
    settings.resolution === "1080p"
      ? format === "mp4"
        ? 5_000
        : 4_500
      : format === "mp4"
        ? 2_400
        : 2_000;
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
    : "Book download failed. Retry the download, use MP3 output, or shorten the part length.";
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
  const resolutionFactor = settings.resolution === "1080p" ? [1.6, 2.3] : [1.15, 1.55];
  const formatFactor = format === "mp4" ? 1.1 : 1;
  const audioFactor = settings.includeAudioTrack ? 1.05 : 1;
  const minMs = runtimeMs * resolutionFactor[0] * formatFactor * audioFactor;
  const maxMs = runtimeMs * resolutionFactor[1] * formatFactor * audioFactor;
  return `~${formatDuration(minMs)}-${formatDuration(maxMs)}`;
}

function partRuntimeWithTail(part: BookExportPart, tailPaddingMs: number) {
  return Math.max(0, part.morseDurationMs) + Math.max(0, tailPaddingMs);
}
