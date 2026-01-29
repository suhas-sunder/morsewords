import * as React from "react";
import { useMemo, useState } from "react";

type SetMode = "letters" | "letters_numbers" | "letters_numbers_punct";
type PromptMode = "visual" | "audio" | "both";

type Pair = {
  label: string;
  morse: string;
  kind: "letter" | "number" | "punct";
};

const basePairs: Pair[] = [
  // Letters
  { label: "A", morse: ".-", kind: "letter" },
  { label: "B", morse: "-...", kind: "letter" },
  { label: "C", morse: "-.-.", kind: "letter" },
  { label: "D", morse: "-..", kind: "letter" },
  { label: "E", morse: ".", kind: "letter" },
  { label: "F", morse: "..-.", kind: "letter" },
  { label: "G", morse: "--.", kind: "letter" },
  { label: "H", morse: "....", kind: "letter" },
  { label: "I", morse: "..", kind: "letter" },
  { label: "J", morse: ".---", kind: "letter" },
  { label: "K", morse: "-.-", kind: "letter" },
  { label: "L", morse: ".-..", kind: "letter" },
  { label: "M", morse: "--", kind: "letter" },
  { label: "N", morse: "-.", kind: "letter" },
  { label: "O", morse: "---", kind: "letter" },
  { label: "P", morse: ".--.", kind: "letter" },
  { label: "Q", morse: "--.-", kind: "letter" },
  { label: "R", morse: ".-.", kind: "letter" },
  { label: "S", morse: "...", kind: "letter" },
  { label: "T", morse: "-", kind: "letter" },
  { label: "U", morse: "..-", kind: "letter" },
  { label: "V", morse: "...-", kind: "letter" },
  { label: "W", morse: ".--", kind: "letter" },
  { label: "X", morse: "-..-", kind: "letter" },
  { label: "Y", morse: "-.--", kind: "letter" },
  { label: "Z", morse: "--..", kind: "letter" },

  // Numbers
  { label: "0", morse: "-----", kind: "number" },
  { label: "1", morse: ".----", kind: "number" },
  { label: "2", morse: "..---", kind: "number" },
  { label: "3", morse: "...--", kind: "number" },
  { label: "4", morse: "....-", kind: "number" },
  { label: "5", morse: ".....", kind: "number" },
  { label: "6", morse: "-....", kind: "number" },
  { label: "7", morse: "--...", kind: "number" },
  { label: "8", morse: "---..", kind: "number" },
  { label: "9", morse: "----.", kind: "number" },

  // Punctuation (common)
  { label: ".", morse: ".-.-.-", kind: "punct" },
  { label: ",", morse: "--..--", kind: "punct" },
  { label: "?", morse: "..--..", kind: "punct" },
  { label: "/", morse: "-..-.", kind: "punct" },
  { label: "-", morse: "-....-", kind: "punct" },
  { label: "=", morse: "-...-", kind: "punct" },
  { label: "+", morse: ".-.-.", kind: "punct" },
  { label: "(", morse: "-.--.", kind: "punct" },
  { label: ")", morse: "-.--.-", kind: "punct" },
  { label: "@", morse: ".--.-.", kind: "punct" },
];

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function MorsePractice({
  wpm,
  freq,
  playMorse,
  stop,
}: {
  wpm: number;
  freq: number;
  playMorse: (code: string, wpm: number, freq: number) => Promise<void> | void;
  stop: () => void;
}) {
  const [setMode, setSetMode] = useState<SetMode>("letters");
  const [promptMode, setPromptMode] = useState<PromptMode>("visual");
  const [current, setCurrent] = useState<Pair>(() => basePairs[0]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | {
    ok: boolean;
    expected: string;
  }>(null);

  const pool = useMemo(() => {
    if (setMode === "letters")
      return basePairs.filter((p) => p.kind === "letter");
    if (setMode === "letters_numbers")
      return basePairs.filter((p) => p.kind !== "punct");
    return basePairs;
  }, [setMode]);

  const newPrompt = () => {
    const next = pickRandom(pool);
    setCurrent(next);
    setAnswer("");
    setFeedback(null);
    stop();
    if (promptMode === "audio" || promptMode === "both") {
      void playMorse(next.morse, wpm, freq);
    }
  };

  React.useEffect(() => {
    // Initialize first prompt for selected pool/mode
    const next = pickRandom(pool);
    setCurrent(next);
    setAnswer("");
    setFeedback(null);
    stop();
  }, [setMode, promptMode]);

  const check = () => {
    const cleaned = answer.trim().toUpperCase();
    const ok = cleaned === current.label.toUpperCase();
    setFeedback({ ok, expected: current.label });
    if (ok) {
      // auto-advance after a short pause
      setTimeout(() => newPrompt(), 650);
    }
  };

  return (
    <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h1 className="text-3xl font-extrabold text-neutral-900">
        Morse Code Practice
      </h1>
      <p className="mt-3 text-gray-700 leading-relaxed">
        Practice decoding one prompt at a time. Choose the character set and
        whether you want visual prompts, audio prompts, or both.
      </p>

      <div className="mt-5 grid md:grid-cols-3 gap-4">
        <div>
          <label className="font-semibold">Mode</label>
          <select
            className="w-full mt-1 border rounded-md p-2 cursor-pointer hover:bg-gray-50"
            value={promptMode}
            onChange={(e) => setPromptMode(e.target.value as PromptMode)}
          >
            <option value="visual">Visual</option>
            <option value="audio">Audio</option>
            <option value="both">Visual + audio</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Character set</label>
          <select
            className="w-full mt-1 border rounded-md p-2 cursor-pointer hover:bg-gray-50"
            value={setMode}
            onChange={(e) => setSetMode(e.target.value as SetMode)}
          >
            <option value="letters">Letters</option>
            <option value="letters_numbers">Letters + numbers</option>
            <option value="letters_numbers_punct">
              Letters + numbers + punctuation
            </option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={newPrompt}
            className="px-4 py-2 rounded-md cursor-pointer font-semibold text-white bg-neutral-900 hover:bg-neutral-800 hover:text-white active:scale-95 transition"
          >
            New prompt
          </button>
          {(promptMode === "audio" || promptMode === "both") && (
            <>
              <button
                onClick={() => void playMorse(current.morse, wpm, freq)}
                className="px-4 py-2 rounded-md cursor-pointer font-semibold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition"
              >
                Play
              </button>
              <button
                onClick={stop}
                className="px-4 py-2 rounded-md cursor-pointer font-semibold bg-gray-200 hover:bg-gray-300 active:scale-95 transition"
              >
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 border border-gray-200 rounded-xl p-5 bg-gray-50">
        {(promptMode === "visual" || promptMode === "both") && (
          <div className="font-mono text-3xl tracking-widest text-neutral-900">
            {current.morse}
          </div>
        )}
        <div className="mt-4">
          <label className="font-semibold">Your answer</label>
          <div className="flex gap-2 mt-1">
            <input
              className="flex-1 border rounded-md p-3 font-mono"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type the character"
              onKeyDown={(e) => {
                if (e.key === "Enter") check();
              }}
              spellCheck={false}
            />
            <button
              onClick={check}
              className="px-4 py-2 rounded-md cursor-pointer font-semibold text-white bg-neutral-900 hover:bg-neutral-800 hover:text-white active:scale-95 transition"
            >
              Check
            </button>
          </div>

          {feedback && (
            <p
              className={`mt-3 font-semibold ${
                feedback.ok ? "text-green-700" : "text-red-700"
              }`}
            >
              {feedback.ok
                ? "Correct."
                : `Not quite. Expected: ${feedback.expected}`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
