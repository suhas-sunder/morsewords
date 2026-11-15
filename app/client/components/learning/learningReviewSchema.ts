export const REVIEW_STORAGE_KEY = "mw_learning_review_v1";
export const REVIEW_LIMIT = 100;
// Matches the existing custom-word source capacity; review must not silently
// exclude a word that the trainer already accepts.
export const REVIEW_TARGET_LIMIT = 4_000;
// JSON can double a target's length when quotes are escaped.
export const REVIEW_JSON_LIMIT = REVIEW_LIMIT * (REVIEW_TARGET_LIMIT * 2 + 256);
export const REVIEW_SOURCES = ["practice", "sentence", "audio-practice", "audio-quiz", "visual-quiz", "word-trainer"] as const;
export type ReviewSource = typeof REVIEW_SOURCES[number];
export type ReviewItem = {
  source: ReviewSource;
  mode: "text_to_morse" | "morse_to_text";
  target: string;
  misses: number;
  private: boolean;
};
export type MissedTarget = Omit<ReviewItem, "misses">;
export const reviewItemKey = (item: MissedTarget) => `${item.source}:${item.mode}:${item.target}`;
const fields = ["source", "mode", "target", "misses", "private"];
export function validReviewItem(value: unknown): value is ReviewItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as ReviewItem;
  return Object.keys(item).length === fields.length && Object.keys(item).every(key => fields.includes(key)) &&
    REVIEW_SOURCES.includes(item.source) && ["text_to_morse", "morse_to_text"].includes(item.mode) &&
    (!["audio-practice", "audio-quiz", "visual-quiz"].includes(item.source) || item.mode === "morse_to_text") &&
    typeof item.target === "string" && item.target.length > 0 && item.target.length <= REVIEW_TARGET_LIMIT &&
    item.target === item.target.trim() && item.target === item.target.toUpperCase() &&
    /^[A-Z0-9 .,?'!\/():;=+\-_"@$&]+$/.test(item.target) &&
    Number.isInteger(item.misses) && item.misses >= 1 && item.misses <= 9999 && typeof item.private === "boolean";
}
export function validateReviewItems(value: unknown): value is ReviewItem[] {
  return Array.isArray(value) && value.length <= REVIEW_LIMIT && value.every(validReviewItem) &&
    new Set(value.map(reviewItemKey)).size === value.length;
}
export function parseReviewQueue(raw: string | null): ReviewItem[] | null {
  if (raw === null) return [];
  if (raw.length > REVIEW_JSON_LIMIT) return null;
  try {
    const value = JSON.parse(raw);
    return value && Object.keys(value).length === 2 && value.version === 1 && validateReviewItems(value.items)
      ? value.items : null;
  } catch { return null; }
}
export function serializeReviewQueue(items: ReviewItem[]) {
  return JSON.stringify({ version: 1, items });
}
export function addMissedTarget(items: ReviewItem[], target: MissedTarget): ReviewItem[] {
  const candidate = { ...target, misses: 1 };
  if (!validReviewItem(candidate)) return items;
  const key = reviewItemKey(candidate);
  const previous = items.find(item => reviewItemKey(item) === key);
  return [{ ...candidate, misses: Math.min(9999, (previous?.misses ?? 0) + 1), private: candidate.private || Boolean(previous?.private) },
    ...items.filter(item => reviewItemKey(item) !== key)].slice(0, REVIEW_LIMIT);
}
export const REVIEW_SOURCE_LABELS: Record<ReviewSource, string> = {
  practice: "Practice", sentence: "Sentence practice", "audio-practice": "Listening practice",
  "audio-quiz": "Audio quiz", "visual-quiz": "Visual quiz", "word-trainer": "Word trainer",
};
