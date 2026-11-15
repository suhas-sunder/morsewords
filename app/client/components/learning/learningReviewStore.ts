import { useEffect, useSyncExternalStore } from "react";
import { safeWriteStorage, type StorageClearResult } from "~/client/components/shared/settingsStorage";
import { addMissedTarget, parseReviewQueue, REVIEW_STORAGE_KEY, reviewItemKey, serializeReviewQueue, validateReviewItems, type MissedTarget, type ReviewItem } from "./learningReviewSchema";

type ReviewSnapshot = { items: ReviewItem[]; notice: string };
const EMPTY: ReviewSnapshot = { items: [], notice: "" };
let current = EMPTY;
let initialized = false;
let listening = false;
let unreadableSavedQueue = false;
const listeners = new Set<() => void>();
function publish(items: ReviewItem[], notice = "") {
  current = { items, notice };
  for (const listener of listeners) listener();
}

export function reloadReviewQueue() {
  if (typeof window === "undefined") return;
  initialized = true;
  try {
    const parsed = parseReviewQueue(window.localStorage.getItem(REVIEW_STORAGE_KEY));
    unreadableSavedQueue = parsed === null;
    publish(parsed ?? [], parsed === null ? "Saved review data could not be read. It has not been changed. Clear the queue explicitly to start fresh." : "");
  } catch {
    publish(current.items, "Browser storage is unavailable. Review changes are kept only in this tab.");
  }
}

function ensure() {
  if (typeof window === "undefined") return;
  if (!initialized) reloadReviewQueue();
  // One bounded listener pair for this browser module, independent of mounted views.
  if (!listening) {
    listening = true;
    window.addEventListener("storage", event => {
      if (event.key === REVIEW_STORAGE_KEY || event.key === null) reloadReviewQueue();
    });
    window.addEventListener("morsewords:storage-clear", event => {
      if ((event as CustomEvent<StorageClearResult>).detail?.removedKeys.includes(REVIEW_STORAGE_KEY)) {
        unreadableSavedQueue = false;
        publish([]);
      }
    });
  }
}

export function replaceReviewItems(items: ReviewItem[], { explicitClear = false } = {}) {
  if (typeof window === "undefined" || !validateReviewItems(items)) return false;
  ensure();
  if (explicitClear) unreadableSavedQueue = false;
  if (unreadableSavedQueue) {
    publish(items, "Saved review data could not be read. New review marks stay in this tab until you explicitly clear the saved queue.");
    return false;
  }
  const saved = safeWriteStorage(REVIEW_STORAGE_KEY, serializeReviewQueue(items));
  publish(items, saved ? "" : "Review changes are kept only in this tab because browser storage could not save them. Older saved items may return after reloading.");
  return saved;
}

export function recordMissedTarget(target: MissedTarget) {
  if (typeof window === "undefined") return false;
  ensure();
  const next = addMissedTarget(current.items, target);
  if (next === current.items) return false;
  replaceReviewItems(next);
  return true; // Added to this tab even if persistence is unavailable.
}
export function removeReviewItem(key: string) {
  ensure();
  return replaceReviewItems(current.items.filter(item => reviewItemKey(item) !== key));
}
export function clearReviewQueue() { return replaceReviewItems([], { explicitClear: true }); }
export function removeReviewSource(source: ReviewItem["source"]) {
  ensure();
  return replaceReviewItems(current.items.filter(item => item.source !== source));
}
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useReviewQueue() {
  const snapshot = useSyncExternalStore(subscribe, () => current, () => EMPTY);
  useEffect(ensure, []);
  return snapshot;
}
