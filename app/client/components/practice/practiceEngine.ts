import { morseToText, normalizeMorseForDecoding, normalizeTextForEncoding, textToMorse } from "~/client/components/shared/practiceMorseUtils";
import { LETTERS, NUMBERS, SIGNALS, WORDS, SENTENCES } from "./practiceBank";
import type { DrillMode, Pool } from "~/client/components/practice/PracticeControls";
import type { Prompt, PromptKind } from "~/client/components/practice/PromptCard";

export function randomPrompt(mode: DrillMode, pool: Pool): Prompt {
  const kind: PromptKind =
    mode === "mixed"
      ? Math.random() < 0.5
        ? "text_to_morse"
        : "morse_to_text"
      : mode === "text_to_morse" || mode === "morse_to_text"
        ? mode
        : Math.random() < 0.5
          ? "text_to_morse"
          : "morse_to_text";

  const plain = pickPlain(pool);
  const morse = textToMorse(plain);

  const label = labelFor(pool, plain);

  return { kind, plain, morse, label };
}

export function deterministicPrompt(mode: DrillMode, pool: Pool): Prompt {
  const kind: PromptKind =
    mode === "text_to_morse" || mode === "morse_to_text"
      ? mode
      : "morse_to_text";
  const plain = firstPlain(pool);
  const morse = textToMorse(plain);
  const label = labelFor(pool, plain);

  return { kind, plain, morse, label };
}

function pickPlain(pool: Pool): string {
  const bank =
    pool === "letters"
      ? LETTERS
      : pool === "numbers"
        ? NUMBERS
        : pool === "signals"
          ? SIGNALS
          : pool === "words"
            ? WORDS
            : pool === "sentences"
              ? SENTENCES
              : [...LETTERS, ...NUMBERS, ...SIGNALS, ...WORDS, ...SENTENCES];
  return bank[Math.floor(Math.random() * bank.length)] ?? "SOS";
}

function firstPlain(pool: Pool): string {
  const bank =
    pool === "letters"
      ? LETTERS
      : pool === "numbers"
        ? NUMBERS
        : pool === "signals"
          ? SIGNALS
          : pool === "words"
            ? WORDS
            : pool === "sentences"
              ? SENTENCES
              : [...LETTERS, ...NUMBERS, ...SIGNALS, ...WORDS, ...SENTENCES];
  return bank[0] ?? "SOS";
}

function labelFor(pool: Pool, plain: string): string {
  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

  if (pool === "all") {
    if (LETTERS.includes(plain)) return "Single letter";
    if (NUMBERS.includes(plain)) return "Single number";
    if (SIGNALS.includes(plain)) return "Common signal";
    if (SENTENCES.includes(plain)) return `Short sentence (${wordCount(plain)} words)`;
    return `Short word (${plain.length} chars)`;
  }
  if (pool === "letters") return "Single letter";
  if (pool === "numbers") return "Single number";
  if (pool === "signals") return "Common signal";
  if (pool === "sentences") return `Short sentence (${wordCount(plain)} words)`;
  // words
  return `Short word (${plain.length} chars)`;
}

export type CheckResult = {
  ok: boolean;
  msg: string;
  expected: string;
  got: string;
  normalizedExpected: string;
  normalizedGot: string;
};

export function checkAnswer(prompt: Prompt, answer: string): CheckResult {
  const raw = answer ?? "";

  if (prompt.kind === "text_to_morse") {
    const expected = prompt.morse;
    const normalizedExpected = canonicalizeMorse(expected);
    const normalizedGot = canonicalizeMorse(raw);
    const ok = normalizedExpected.length > 0 && normalizedExpected === normalizedGot;

    return {
      ok,
      // Never leak the expected answer in the UI (users may want multiple attempts).
      msg: ok ? "Correct" : "Not quite. Try again.",
      expected,
      got: raw,
      normalizedExpected,
      normalizedGot,
    };
  }

  // morse_to_text
  const expected = prompt.plain;
  const normalizedExpected = normalizeTextForEncoding(expected);

  // Allow either typed text, or pasted Morse that decodes to the expected text.
  const trimmed = raw.trim();
  const decodedIfMorse = looksLikeMorse(trimmed)
    ? normalizeTextForEncoding(morseToText(trimmed))
    : "";
  const normalizedGot = normalizeTextForEncoding(decodedIfMorse || trimmed);

  const ok = normalizedExpected.length > 0 && normalizedExpected === normalizedGot;

  return {
    ok,
    // Never leak the expected answer in the UI (users may want multiple attempts).
    msg: ok ? "Correct" : "Not quite. Try again.",
    expected,
    got: raw,
    normalizedExpected,
    normalizedGot,
  };
}

function looksLikeMorse(s: string): boolean {
  const { normalized, invalidChars } = normalizeMorseForDecoding(s);
  if (invalidChars.length > 0) return false;
  return normalized.length > 0;
}

export function canonicalizeMorse(input: string): string {
  const { normalized } = normalizeMorseForDecoding(input);
  if (!normalized) return "";

  // Convert to a deterministic spacing style:
  // - 1..6 spaces -> 3 (letter gap)
  // - 7+ spaces -> 7 (word gap)
  let out = "";
  let run = 0;

  const flushSpaces = () => {
    if (run <= 0) return;
    out += run >= 7 ? "       " : "   ";
    run = 0;
  };

  for (const ch of normalized) {
    if (ch === "." || ch === "-") {
      flushSpaces();
      out += ch;
      continue;
    }
    if (ch === " ") {
      run += 1;
    }
  }

  flushSpaces();

  return out.trim();
}
