export const LIVE_PREVIEW_START_BUFFER_MS = 2_200;

export function getLivePreviewStartDelayMs(
  startElapsedMs: number,
  durationMs: number,
) {
  if (startElapsedMs > 0) return 0;
  if (durationMs <= LIVE_PREVIEW_START_BUFFER_MS) return 0;
  return LIVE_PREVIEW_START_BUFFER_MS;
}
