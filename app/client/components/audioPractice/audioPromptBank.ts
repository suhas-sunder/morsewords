import { sentenceDrills } from "~/client/components/morse-code-sentence-practice/SentencePracticeData";

export type AudioDifficulty = "beginner" | "easy" | "medium" | "hard";

export type AudioPromptType = "letter" | "number" | "word" | "sentence";

export type AudioPrompt = {
  text: string;
  type: AudioPromptType;
  difficulty: AudioDifficulty;
};

export const audioDifficultyOptions: Array<{
  value: AudioDifficulty;
  label: string;
  description: string;
}> = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Letters, numbers, and tiny groups.",
  },
  {
    value: "easy",
    label: "Easy",
    description: "Short words and common signals.",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Words plus short sentences.",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Longer words, Q-codes, and sentences.",
  },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map<AudioPrompt>((text) => ({
  text,
  type: "letter",
  difficulty: "beginner",
}));

const NUMBERS = "0123456789".split("").map<AudioPrompt>((text) => ({
  text,
  type: "number",
  difficulty: "beginner",
}));

const BEGINNER_GROUPS = [
  "AI",
  "AM",
  "AN",
  "AS",
  "AT",
  "BE",
  "BY",
  "DO",
  "GO",
  "HE",
  "HI",
  "IN",
  "IS",
  "IT",
  "ME",
  "MY",
  "NO",
  "ON",
  "OR",
  "SO",
  "TO",
  "UP",
  "US",
  "WE",
].map<AudioPrompt>((text) => ({ text, type: "word", difficulty: "beginner" }));

const EASY_WORDS = [
  "SOS",
  "CQ",
  "TEST",
  "HELP",
  "COPY",
  "CODE",
  "MORSE",
  "AUDIO",
  "TONE",
  "WORD",
  "SEND",
  "HEAR",
  "READ",
  "SPEED",
  "RADIO",
  "LIGHT",
  "SIGNAL",
  "CLEAR",
  "READY",
  "START",
  "STOP",
  "AGAIN",
  "TODAY",
  "NIGHT",
  "SOUND",
  "LEARN",
  "DRILL",
  "PRACTICE",
  "ANSWER",
  "LETTER",
  "NUMBER",
  "MESSAGE",
  "STATION",
  "WEATHER",
  "SCHOOL",
  "TEACHER",
].map<AudioPrompt>((text) => ({ text, type: "word", difficulty: "easy" }));

const MEDIUM_WORDS = [
  "FARNSWORTH",
  "TIMING",
  "DECODE",
  "ENCODE",
  "TRANSLATOR",
  "WORKSHEET",
  "SEPARATOR",
  "QUESTION",
  "ACCURACY",
  "RECEIVE",
  "REPEAT",
  "VOLUME",
  "PITCH",
  "CALLSIGN",
  "FREQUENCY",
  "PUNCTUATION",
  "PROSIGN",
  "TRAINER",
  "RESULT",
  "LISTENING",
  "CLASSROOM",
  "BEGINNER",
  "CONFIRM",
  "CONTROL",
  "CHANNEL",
  "OPERATOR",
  "PORTABLE",
  "CONTACT",
  "ANTENNA",
  "BATTERY",
].map<AudioPrompt>((text) => ({ text, type: "word", difficulty: "medium" }));

const HARD_WORDS = [
  "QTH",
  "QSL",
  "QSO",
  "QRN",
  "QRM",
  "QRZ",
  "QRP",
  "QSY",
  "QSB",
  "73",
  "88",
  "COPY THAT MESSAGE",
  "THE SIGNAL IS CLEAR",
  "SEND YOUR CALL SIGN",
  "PLEASE REPEAT THE WORD",
  "AUDIO PRACTICE BUILDS RECALL",
  "FARNSWORTH SPACING SLOWS GAPS",
  "THE QUICK BROWN FOX JUMPS",
].map<AudioPrompt>((text) => ({
  text,
  type: text.includes(" ") ? "sentence" : "word",
  difficulty: "hard",
}));

const SENTENCE_PROMPTS = sentenceDrills.map<AudioPrompt>((item) => ({
  text: item.text,
  type: "sentence",
  difficulty:
    item.difficulty === "easy"
      ? "medium"
      : item.difficulty === "medium"
        ? "medium"
        : "hard",
}));

export const audioPromptBank: AudioPrompt[] = dedupePrompts([
  ...LETTERS,
  ...NUMBERS,
  ...BEGINNER_GROUPS,
  ...EASY_WORDS,
  ...MEDIUM_WORDS,
  ...HARD_WORDS,
  ...SENTENCE_PROMPTS,
]);

export function isAudioDifficulty(value: string | null): value is AudioDifficulty {
  return value === "beginner" || value === "easy" || value === "medium" || value === "hard";
}

export function getAudioPrompts(difficulty: AudioDifficulty) {
  const order: AudioDifficulty[] = ["beginner", "easy", "medium", "hard"];
  const maxIndex = order.indexOf(difficulty);
  return audioPromptBank.filter((prompt) => order.indexOf(prompt.difficulty) <= maxIndex);
}

export function normalizeAudioAnswer(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function promptTypeLabel(type: AudioPromptType) {
  if (type === "number") return "Number";
  if (type === "letter") return "Letter";
  if (type === "sentence") return "Sentence";
  return "Word";
}

export function pickPrompt(pool: AudioPrompt[], previousText?: string) {
  if (!pool.length) return audioPromptBank[0];
  const choices =
    previousText && pool.length > 1
      ? pool.filter((prompt) => prompt.text !== previousText)
      : pool;
  return choices[Math.floor(Math.random() * choices.length)] ?? pool[0];
}

export function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function buildPromptDeck(pool: AudioPrompt[], count: number, seed: number) {
  const rng = createSeededRandom(seed);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const deck: AudioPrompt[] = [];
  for (let i = 0; i < count; i += 1) {
    deck.push(shuffled[i % shuffled.length] ?? audioPromptBank[0]);
  }
  return deck;
}

function dedupePrompts(prompts: AudioPrompt[]) {
  const seen = new Set<string>();
  const result: AudioPrompt[] = [];
  for (const prompt of prompts) {
    const key = normalizeAudioAnswer(prompt.text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push({ ...prompt, text: key });
  }
  return result;
}
