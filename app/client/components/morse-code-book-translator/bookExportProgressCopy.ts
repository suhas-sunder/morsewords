import { formatDuration } from "./bookDurationEstimate";
import type { BookExportProgress } from "./bookExportTypes";

export function bookExportProgressPercent(progress: BookExportProgress) {
  if (
    typeof progress.renderedDurationMs === "number" &&
    typeof progress.totalDurationMs === "number" &&
    progress.totalDurationMs > 0
  ) {
    return Math.max(
      0,
      Math.min(
        100,
        Math.round((progress.renderedDurationMs / progress.totalDurationMs) * 100),
      ),
    );
  }
  if (progress.totalParts > 0) {
    return Math.max(
      0,
      Math.min(100, Math.round((progress.currentPart / progress.totalParts) * 100)),
    );
  }
  return progress.phase === "complete" ? 100 : 0;
}

export function bookExportProgressDetail(
  progress: BookExportProgress,
  elapsedMs: number,
) {
  const partLabel =
    progress.batchPartCount && progress.batchPartCount > 1 && progress.batchPartIndex
      ? `Part ${progress.batchPartIndex} of ${progress.batchPartCount}`
      : progress.totalParts > 1 && progress.currentPartIndex
        ? `Part ${progress.currentPartIndex} of ${progress.totalParts}`
        : progress.totalParts > 1 && typeof progress.completedParts === "number"
          ? `${progress.completedParts} of ${progress.totalParts} parts`
          : "Working";
  const batchLabel =
    progress.totalBatches && progress.totalBatches > 1 && progress.batchNumber
      ? `ZIP batch ${progress.batchNumber} of ${progress.totalBatches} / `
      : "";
  return `${batchLabel}${partLabel} / ${bookExportRemainingTimeLabel(
    progress,
    elapsedMs,
  )}`;
}

export function bookExportRemainingTimeLabel(
  progress: BookExportProgress,
  elapsedMs: number,
) {
  const elapsedLabel = `${formatDuration(elapsedMs)} elapsed`;
  if (
    typeof progress.renderedDurationMs !== "number" ||
    typeof progress.totalDurationMs !== "number" ||
    progress.renderedDurationMs <= 0 ||
    progress.totalDurationMs <= 0 ||
    elapsedMs < 1_500
  ) {
    return `${elapsedLabel} / estimating time remaining...`;
  }

  const progressRatio = Math.max(
    0,
    Math.min(0.99, progress.renderedDurationMs / progress.totalDurationMs),
  );
  if (progressRatio <= 0.02) {
    return `${elapsedLabel} / estimating time remaining...`;
  }

  const estimatedTotalMs = elapsedMs / progressRatio;
  const remainingMs = Math.max(0, estimatedTotalMs - elapsedMs);
  return `about ${formatDuration(remainingMs)} left`;
}
