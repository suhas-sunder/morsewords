import type { DrillMode, Pool } from "~/client/components/practice/PracticeControls";

// The existing beginner guide's sequence; no named-method or mastery claim.
export const STARTER_CHARACTERS = [
  { letter: "E", morse: ".", reason: "One short signal." },
  { letter: "T", morse: "-", reason: "One long signal." },
  { letter: "A", morse: ".-", reason: "Short then long." },
  { letter: "N", morse: "-.", reason: "Long then short." },
  { letter: "I", morse: "..", reason: "Two short signals." },
  { letter: "M", morse: "--", reason: "Two long signals." },
  { letter: "S", morse: "...", reason: "Three short signals." },
  { letter: "O", morse: "---", reason: "Three long signals." },
] as const;

export type LearningSession = {
  id: string;
  label: string;
  description: string;
  href: string;
  practice?: { pool: Pool; mode: DrillMode };
};
export const LEARNING_SESSIONS: readonly LearningSession[] = [
  { id: "first", label: "Learn first characters", description: "Try 10 static recognition prompts using E, T, A, N, I, M, S and O. No timer or flashing.", href: "/practice#practice-workspace", practice: { pool: "starter", mode: "morse_to_text" } },
  { id: "listening", label: "Practice listening", description: "Start with beginner audio prompts. Press Play when you are ready, then type what you hear.", href: "/morse-code-audio-practice" },
  { id: "visual", label: "Recognize written Morse", description: "Read 10 letter patterns and type their letters. The patterns stay still while you work.", href: "/practice#practice-workspace", practice: { pool: "letters", mode: "morse_to_text" } },
  { id: "words", label: "Practice words", description: "Encode 10 short words. Keep dots and dashes together within each letter and separate the letters with spaces.", href: "/practice#practice-workspace", practice: { pool: "words", mode: "text_to_morse" } },
  { id: "typing", label: "Improve typing and copying", description: "Open a 30-second typing session. The timer starts with your first input; review the decoded text as you go.", href: "/typing" },
];

// A single explicit navigation intent. No learner text, URL payload or account.
let pendingSession: { id: string; requestedAt: number } | null = null;
export function requestLearningSession(id: string) {
  pendingSession = LEARNING_SESSIONS.some(session => session.id === id)
    ? { id, requestedAt: Date.now() } : null;
}
export function takeLearningSession(destination: string) {
  const pending = pendingSession;
  pendingSession = null;
  if (!pending || Date.now() - pending.requestedAt > 300_000) return null;
  const session = LEARNING_SESSIONS.find(item => item.id === pending.id);
  return session?.href.split("#")[0] === destination ? session : null;
}
