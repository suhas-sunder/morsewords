import { parseReviewQueue, REVIEW_LIMIT, REVIEW_STORAGE_KEY, reviewItemKey, serializeReviewQueue, validateReviewItems, type ReviewItem } from "./learningReviewSchema";
import { parseSoundFirstProgress, SOUND_FIRST_STORAGE_KEY, type SoundFirstProgress } from "./soundFirstSchema";

export const LEARNING_FILE_LIMIT = 1_048_576;
export const CUSTOM_WORDS_KEY = "mw_word_trainer_custom_words";
export const BEST_KEYS = [
  ...["starter", "all", "letters", "numbers", "signals", "words", "sentences"].map(pool => `mw_practice_best_streak_${pool}`),
  "mw_sentence_practice_best_streak", "mw_audio_practice_best_streak", "mw_audio_quiz_best_streak", "mw_visual_quiz_best_streak", "mw_word_trainer_best_streak",
];
export const PORTABLE_KEYS = [...BEST_KEYS, REVIEW_STORAGE_KEY, SOUND_FIRST_STORAGE_KEY, CUSTOM_WORDS_KEY];
export type LearningFile = {
  format: "morsewords-learning"; version: 1; includesPrivate: boolean;
  data: { bestStreaks?: Record<string, number | null>; reviewQueue?: ReviewItem[] | null; soundFirstProgress?: SoundFirstProgress | null; customWords?: string | null };
};
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type Snapshot = Record<string, string | null>;
export type ImportPlan = { before: Snapshot; after: Snapshot; backup: LearningFile; file: LearningFile; preservedPrivate: number };
export class LearningDataError extends Error {}
function fail(message: string): never { throw new LearningDataError(message); }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const exact = (value: Record<string, unknown>, keys: string[]) => Object.keys(value).length === keys.length && Object.keys(value).every(key => keys.includes(key));
const count = (value: unknown) => Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 9999;
const validWords = (value: unknown) => typeof value === "string" && value.length <= 4000 && /^[A-Za-z0-9 .,?'!\/():;=+\-_"@$&\r\n]*$/.test(value);
export function validateLearningFile(value: unknown): LearningFile {
  if (!object(value) || !exact(value, ["format", "version", "includesPrivate", "data"]) || value.format !== "morsewords-learning" || value.version !== 1 || typeof value.includesPrivate !== "boolean" || !object(value.data)) fail("This is not a supported MorseWords learning file (version 1).");
  const file = value as unknown as LearningFile;
  const data = file.data;
  if (!Object.keys(data).length || !Object.keys(data).every(key => ["bestStreaks", "reviewQueue", "soundFirstProgress", "customWords"].includes(key))) fail("The file contains unsupported learning sections.");
  if (data.bestStreaks !== undefined && (!object(data.bestStreaks) || !Object.keys(data.bestStreaks).every(key => BEST_KEYS.includes(key) && (data.bestStreaks![key] === null || count(data.bestStreaks![key]))))) fail("The file contains invalid best-streak data.");
  if (data.reviewQueue !== undefined && data.reviewQueue !== null && !validateReviewItems(data.reviewQueue)) fail("The file contains invalid review targets.");
  if (data.soundFirstProgress !== undefined && data.soundFirstProgress !== null && !parseSoundFirstProgress(JSON.stringify(data.soundFirstProgress))) fail("The file contains invalid sound-first progress.");
  if (data.customWords !== undefined && data.customWords !== null && !validWords(data.customWords)) fail("Custom words must contain supported Morse text, at most 4,000 characters, without HTML.");
  if (!file.includesPrivate && (Object.hasOwn(data, "customWords") || data.reviewQueue?.some(item => item.private))) fail("The file contains private data without declaring it.");
  return file;
}
export function parseLearningFile(raw: string): LearningFile {
  if (new TextEncoder().encode(raw).byteLength > LEARNING_FILE_LIMIT) fail("Choose a learning file no larger than 1 MiB.");
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return fail("The selected file is not valid JSON. Nothing was changed."); }
  return validateLearningFile(value);
}
export async function readLearningFile(file: Pick<File, "size" | "text">): Promise<LearningFile> {
  if (file.size > LEARNING_FILE_LIMIT) fail("Choose a learning file no larger than 1 MiB.");
  return parseLearningFile(await file.text());
}
function snapshot(store: Store, keys: string[]): Snapshot {
  try { return Object.fromEntries(keys.map(key => [key, store.getItem(key)])); }
  catch { return fail("Browser storage could not be read. Nothing was changed."); }
}
function fromSnapshot(values: Snapshot, includePrivate: boolean): LearningFile {
  const data: LearningFile["data"] = {};
  const bestStreaks: Record<string, number | null> = {};
  for (const key of BEST_KEYS) if (Object.hasOwn(values, key)) {
    const raw = values[key];
    if (raw !== null && (!/^\d{1,4}$/.test(raw) || !count(Number(raw)))) fail("Some saved best-streak data is unreadable. It has not been changed.");
    bestStreaks[key] = raw === null ? null : Number(raw);
  }
  if (Object.keys(bestStreaks).length) data.bestStreaks = bestStreaks;
  if (Object.hasOwn(values, REVIEW_STORAGE_KEY)) {
    const queue = parseReviewQueue(values[REVIEW_STORAGE_KEY]);
    if (!queue) fail("Saved review data is unreadable. Clear it explicitly in practice before importing or exporting this section.");
    data.reviewQueue = values[REVIEW_STORAGE_KEY] === null ? null : queue.filter(item => includePrivate || !item.private);
  }
  if (Object.hasOwn(values, SOUND_FIRST_STORAGE_KEY)) {
    const progress = parseSoundFirstProgress(values[SOUND_FIRST_STORAGE_KEY]);
    if (!progress) fail("Saved sound-first progress is unreadable. Clear it explicitly in audio practice before importing or exporting this section.");
    data.soundFirstProgress = values[SOUND_FIRST_STORAGE_KEY] === null ? null : progress;
  }
  if (includePrivate && Object.hasOwn(values, CUSTOM_WORDS_KEY)) {
    const words = values[CUSTOM_WORDS_KEY];
    if (words !== null && !validWords(words)) fail("Saved custom words contain unsupported text. Export without private data, or review the custom list first.");
    data.customWords = words;
  }
  return validateLearningFile({ format: "morsewords-learning", version: 1, includesPrivate: includePrivate, data });
}
export function exportLearningData(store: Store, includePrivate: boolean): LearningFile {
  return fromSnapshot(snapshot(store, PORTABLE_KEYS.filter(key => includePrivate || key !== CUSTOM_WORDS_KEY)), includePrivate);
}
export function planLearningImport(store: Store, input: LearningFile): ImportPlan {
  // Revalidate at the transaction boundary, not just at file selection.
  const file = validateLearningFile(input);
  const after: Snapshot = {};
  for (const [key, value] of Object.entries(file.data.bestStreaks ?? {})) after[key] = value === null ? null : String(value);
  if (Object.hasOwn(file.data, "reviewQueue")) after[REVIEW_STORAGE_KEY] = file.data.reviewQueue === null ? null : serializeReviewQueue(file.data.reviewQueue!);
  if (Object.hasOwn(file.data, "soundFirstProgress")) after[SOUND_FIRST_STORAGE_KEY] = file.data.soundFirstProgress === null ? null : JSON.stringify(file.data.soundFirstProgress);
  if (Object.hasOwn(file.data, "customWords")) after[CUSTOM_WORDS_KEY] = file.data.customWords!;
  if (!Object.keys(after).length) fail("This file has no learning values to import.");
  const before = snapshot(store, Object.keys(after));
  // An exact in-memory snapshot supports undo; a validated portable backup supports recovery after leaving.
  const backup = fromSnapshot(before, true);
  let preservedPrivate = 0;
  if (!file.includesPrivate && Object.hasOwn(after, REVIEW_STORAGE_KEY)) {
    const privateItems = parseReviewQueue(before[REVIEW_STORAGE_KEY])!.filter(item => item.private);
    preservedPrivate = privateItems.length;
    const privateKeys = new Set(privateItems.map(reviewItemKey));
    const combined = [...privateItems, ...(file.data.reviewQueue ?? []).filter(item => !privateKeys.has(reviewItemKey(item)))];
    if (combined.length > REVIEW_LIMIT) fail("This import plus your private targets exceeds 100 review items. Remove unneeded targets in practice or use a smaller file; private targets have not been removed.");
    after[REVIEW_STORAGE_KEY] = file.data.reviewQueue === null && !combined.length ? null : serializeReviewQueue(combined);
  }
  return { before, after, backup, file, preservedPrivate };
}
function set(store: Store, key: string, value: string | null) { if (value === null) store.removeItem(key); else store.setItem(key, value); }
export function applyLearningSnapshot(store: Store, expected: Snapshot, next: Snapshot) {
  const keys = Object.keys(next);
  if (keys.some(key => !PORTABLE_KEYS.includes(key)) || keys.length !== Object.keys(expected).length) fail("Unsupported learning transaction.");
  const current = snapshot(store, keys);
  if (keys.some(key => current[key] !== expected[key])) fail("Learning data changed since the preview. Choose the file again to review the latest state. Nothing was changed.");
  try { for (const key of keys) set(store, key, next[key]); }
  catch {
    let restored = true;
    // Best effort every key, even if restoring one key fails.
    for (const key of keys) try { if (store.getItem(key) !== expected[key]) set(store, key, expected[key]); } catch { restored = false; }
    fail(restored ? "Browser storage could not save the import. Previous values were restored." : "Browser storage failed during recovery. Keep this page open and download the backup before trying again.");
  }
}
export function notifyLearningDataChanged(keys: string[]) {
  for (const key of keys) window.dispatchEvent(new StorageEvent("storage", { key }));
}
export function learningKeyLabel(key: string) {
  if (key === REVIEW_STORAGE_KEY) return "Review targets";
  if (key === SOUND_FIRST_STORAGE_KEY) return "Sound-first set and round counts";
  if (key === CUSTOM_WORDS_KEY) return "Private custom word list";
  return key.replace(/^mw_/, "").replaceAll("_", " ");
}

export function learningValueSummary(key: string, value: string | null) {
  if (value === null) return "not saved";
  if (key === REVIEW_STORAGE_KEY) return `${parseReviewQueue(value)!.length} review targets`;
  if (key === SOUND_FIRST_STORAGE_KEY) {
    const progress = parseSoundFirstProgress(value)!;
    return `set ${progress.selectedSet + 1}, ${progress.completedRounds.reduce((sum, n) => sum + n, 0)} completed rounds`;
  }
  if (key === CUSTOM_WORDS_KEY) return `${value.length} characters of private text`;
  return value;
}
