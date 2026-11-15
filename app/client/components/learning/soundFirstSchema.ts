import { STARTER_CHARACTERS } from "./learningSessions";
import type { AudioPrompt } from "~/client/components/audioPractice/audioPromptBank";

// Existing guide order first; remaining letters in ordinary alphabetic order.
// This is a transparent product sequence, not a named teaching method.
const starter = STARTER_CHARACTERS.map(item => item.letter).join("");
export const SOUND_FIRST_ORDER = starter + [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].filter(letter => !starter.includes(letter)).join("");
export const SOUND_FIRST_SETS = [2, 4, 6, 8, 12, 18, 26].map((size, index) => ({
  id: index, letters: SOUND_FIRST_ORDER.slice(0, size), label: `Set ${index + 1}: ${size} letters`,
}));
export const SOUND_FIRST_STORAGE_KEY = "mw_sound_first_progress_v1";
export const SOUND_FIRST_JSON_LIMIT = 512;
export type SoundFirstProgress = { version: 1; selectedSet: number; completedRounds: number[] };
export function emptySoundFirstProgress(): SoundFirstProgress {
  return { version: 1, selectedSet: 0, completedRounds: SOUND_FIRST_SETS.map(() => 0) };
}
export function validSoundFirstSet(index: unknown): index is number {
  return Number.isInteger(index) && (index as number) >= 0 && (index as number) < SOUND_FIRST_SETS.length;
}
export function parseSoundFirstProgress(raw: string | null): SoundFirstProgress | null {
  if (raw === null) return emptySoundFirstProgress();
  if (raw.length > SOUND_FIRST_JSON_LIMIT) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || Array.isArray(value) || Object.keys(value).sort().join(",") !== "completedRounds,selectedSet,version" || value.version !== 1 || !validSoundFirstSet(value.selectedSet)) return null;
    if (!Array.isArray(value.completedRounds) || value.completedRounds.length !== SOUND_FIRST_SETS.length || !value.completedRounds.every((count: unknown) => Number.isInteger(count) && (count as number) >= 0 && (count as number) <= 9999)) return null;
    return { version: 1, selectedSet: value.selectedSet, completedRounds: [...value.completedRounds] };
  } catch { return null; }
}
export function soundFirstPrompts(index: number): AudioPrompt[] {
  return [...SOUND_FIRST_SETS[validSoundFirstSet(index) ? index : 0].letters].map(text => ({ text, type: "letter", difficulty: "beginner" }));
}
