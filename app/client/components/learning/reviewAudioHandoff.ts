import { useCallback, useRef } from "react";
import { validReviewItem, type ReviewItem } from "./learningReviewSchema";

// A single bounded, one-use same-tab handoff. No target in URLs or history.
let pending: { item: ReviewItem; expires: number } | null = null;
export function stageReviewAudio(item: ReviewItem) {
  if (!validReviewItem(item) || !["audio-practice", "audio-quiz"].includes(item.source)) return false;
  pending = { item: { ...item }, expires: Date.now() + 300_000 };
  return true;
}
export function takeReviewAudio() {
  const draft = pending;
  pending = null;
  return draft && draft.expires > Date.now() ? draft.item : null;
}
export function useReviewAudioIntent() {
  const consumed = useRef<{ item: ReviewItem | null } | null>(null);
  return useCallback(() => {
    if (!consumed.current) consumed.current = { item: takeReviewAudio() };
    return consumed.current.item;
  }, []);
}
