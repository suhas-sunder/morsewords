import {
  safeReadStorage,
  safeRemoveStorage,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";

export const LIVE_PREVIEW_PROGRESS_VERSION = 1;

export type LivePreviewProgressState = {
  version: typeof LIVE_PREVIEW_PROGRESS_VERSION;
  contentHash: string;
  segmentIndex: number;
  timeSeconds: number;
  updatedAt: number;
};

export type RestoredLivePreviewProgress = {
  elapsedMs: number;
  segmentIndex: number;
};

type ProgressRestoreOptions = {
  contentHash: string;
  getSegmentDurationMs: (segmentIndex: number) => number;
  segmentCount: number;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function hashLivePreviewProgressSignature(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${value.length}:${(hash >>> 0).toString(36)}`;
}

export function buildLivePreviewProgressState({
  contentHash,
  elapsedMs,
  segmentIndex,
  updatedAt = Date.now(),
}: {
  contentHash: string;
  elapsedMs: number;
  segmentIndex: number;
  updatedAt?: number;
}): LivePreviewProgressState {
  return {
    version: LIVE_PREVIEW_PROGRESS_VERSION,
    contentHash,
    segmentIndex: Math.max(0, Math.floor(segmentIndex)),
    timeSeconds: Math.max(0, Math.round(elapsedMs / 100) / 10),
    updatedAt,
  };
}

export function restoreLivePreviewProgress(
  value: unknown,
  { contentHash, getSegmentDurationMs, segmentCount }: ProgressRestoreOptions,
): RestoredLivePreviewProgress | null {
  if (segmentCount <= 0 || !isPlainObject(value)) return null;
  if (
    value.version !== LIVE_PREVIEW_PROGRESS_VERSION ||
    value.contentHash !== contentHash
  ) {
    return null;
  }

  const rawSegmentIndex =
    typeof value.segmentIndex === "number" && Number.isFinite(value.segmentIndex)
      ? Math.floor(value.segmentIndex)
      : 0;
  const segmentIndex =
    rawSegmentIndex >= 0 && rawSegmentIndex < segmentCount ? rawSegmentIndex : 0;
  const rawTimeSeconds =
    typeof value.timeSeconds === "number" && Number.isFinite(value.timeSeconds)
      ? value.timeSeconds
      : 0;
  const durationMs = Math.max(1, getSegmentDurationMs(segmentIndex));
  const elapsedMs = Math.max(
    0,
    Math.min(durationMs, Math.max(0, rawTimeSeconds) * 1000),
  );

  return {
    elapsedMs,
    segmentIndex,
  };
}

export function readLivePreviewProgress(
  storageKey: string,
  options: ProgressRestoreOptions,
) {
  const raw = safeReadStorage(storageKey);
  if (!raw) return null;

  try {
    return restoreLivePreviewProgress(JSON.parse(raw), options);
  } catch {
    return null;
  }
}

export function writeLivePreviewProgress(
  storageKey: string,
  state: LivePreviewProgressState,
) {
  return safeWriteStorage(storageKey, JSON.stringify(state));
}

export function clearLivePreviewProgress(storageKey: string) {
  return safeRemoveStorage(storageKey);
}
