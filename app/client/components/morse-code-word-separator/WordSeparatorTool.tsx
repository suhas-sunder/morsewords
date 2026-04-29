import * as React from "react";
import { textToMorse } from "~/client/components/shared/morseUtils";

type OutputSep = "standard" | "slash" | "pipe" | "newline";
type Mode = "normalizeMorse" | "englishToMorse";

function onlyMorseChars(input: string) {
  // Keep dots, dashes, spaces, slashes, pipes, and newlines.
  return input.replace(/[^\n.\-\/|\s]/g, "");
}

function splitWordsFromMorse(raw: string): string[] {
  // Normalize all common word breaks to a sentinel.
  const s = raw
    .replace(/\r/g, "")
    .replace(/\n+/g, " ␟ ")
    .replace(/\s*\/\s*/g, " ␟ ")
    .replace(/\s*\|\s*/g, " ␟ ")
    .replace(/\s{7,}/g, " ␟ ");
  return s
    .split("␟")
    .map((w) => w.trim())
    .filter(Boolean);
}

function splitLettersFromMorse(word: string): string[] {
  // 1–6 spaces => letter gap (normalize to single spaces).
  const normalized = word.trim().replace(/\s{2,}/g, " ");
  return normalized
    .split(" ")
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatMorse(words: string[][], sep: OutputSep): string {
  if (sep === "standard") {
    // Letters: single space, words: 7 spaces
    return words.map((letters) => letters.join(" ")).join("       ");
  }
  if (sep === "slash") {
    return words.map((letters) => letters.join(" ")).join(" / ");
  }
  if (sep === "pipe") {
    return words.map((letters) => letters.join(" ")).join(" | ");
  }
  // newline
  return words.map((letters) => letters.join(" ")).join("\n");
}

function countEnglishWords(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function WordSeparatorTool() {
  const [mode, setMode] = React.useState<Mode>("normalizeMorse");

  // Shared separator choice (UI will hide newline when in English mode).
  const [sep, setSep] = React.useState<OutputSep>("standard");

  // Morse normalization input
  const [morseInput, setMorseInput] = React.useState<string>(
    "... --- ... / .-.-.-  .- -... -.-",
  );

  // English → Morse input (separator-focused)
  const [englishInput, setEnglishInput] = React.useState<string>(
    "the quick brown fox jumps over the lazy dog",
  );

  const [copied, setCopied] = React.useState(false);

  const cleanedMorse = React.useMemo(
    () => onlyMorseChars(morseInput),
    [morseInput],
  );

  const morseWords = React.useMemo(() => {
    const ws = splitWordsFromMorse(cleanedMorse);
    return ws.map((w) => splitLettersFromMorse(w));
  }, [cleanedMorse]);

  const morseOut = React.useMemo(
    () => formatMorse(morseWords, sep),
    [morseWords, sep],
  );

  const englishOut = React.useMemo(() => {
    // Encode each English word independently so the separator is always controlled here.
    const words = englishInput.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "";

    // In English mode, "newline" doesn't make sense for word separators.
    const effectiveSep: Exclude<OutputSep, "newline"> =
      sep === "newline" ? "standard" : sep;

    const encodedWords = words.map((w) => textToMorse(w).trim());

    if (effectiveSep === "standard") return encodedWords.join("       ");
    if (effectiveSep === "pipe") return encodedWords.join(" | ");
    return encodedWords.join(" / ");
  }, [englishInput, sep]);

  const out = mode === "normalizeMorse" ? morseOut : englishOut;

  const wordCount =
    mode === "normalizeMorse"
      ? morseWords.length
      : countEnglishWords(englishInput);

  const letterCount =
    mode === "normalizeMorse"
      ? morseWords.reduce((acc, w) => acc + w.length, 0)
      : 0;

  const sepOptions: Array<[string, OutputSep]> =
    mode === "normalizeMorse"
      ? [
          ["7 spaces", "standard"],
          ["/", "slash"],
          ["|", "pipe"],
          ["new lines", "newline"],
        ]
      : [
          ["7 spaces", "standard"],
          ["/", "slash"],
          ["|", "pipe"],
        ];

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:px-6 shadow-sm">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-extrabold text-2xl sm:text-4xl text-sky-800 tracking-tight">
          Morse code word separator
        </h1>
        <p className="text-sm sm:text-lg text-gray-700 hidden sm:block">
          Normalize Morse word breaks and format English → Morse separators
          using <strong>7 spaces</strong>, <strong>/</strong>,{" "}
          <strong>|</strong>, or <strong>new lines</strong>.
        </p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
        <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setMode("normalizeMorse")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition ${
              mode === "normalizeMorse"
                ? "bg-white shadow-sm text-neutral-900"
                : "text-gray-700 hover:bg-white"
            }`}
            aria-pressed={mode === "normalizeMorse"}
          >
            Normalize Morse
          </button>
          <button
            onClick={() => setMode("englishToMorse")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition ${
              mode === "englishToMorse"
                ? "bg-white shadow-sm text-neutral-900"
                : "text-gray-700 hover:bg-white"
            }`}
            aria-pressed={mode === "englishToMorse"}
          >
            English → Morse
          </button>
        </div>

        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
          {sepOptions.map(([label, v]) => (
            <button
              key={v}
              onClick={() => setSep(v)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition ${
                sep === v
                  ? "bg-sky-50 border border-sky-200 text-sky-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              aria-pressed={sep === v}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-neutral-900">
              {mode === "normalizeMorse" ? "Paste Morse" : "English input"}
            </h2>

            {mode === "normalizeMorse" ? (
              <span className="text-xs text-gray-600">
                Words: {wordCount} · Letters: {letterCount}
              </span>
            ) : (
              <span className="text-xs text-gray-600">Words: {wordCount}</span>
            )}
          </div>

          {mode === "normalizeMorse" ? (
            <>
              <textarea
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                className="mt-3 w-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-3 text-sm sm:text-base font-mono focus:outline-none focus:ring-2 focus:ring-sky-200"
                spellCheck={false}
              />
              <p className="mt-2 text-xs text-gray-600">
                Kept characters: dots, dashes, spaces, slashes, pipes, and new
                lines.
              </p>
            </>
          ) : (
            <>
              <textarea
                value={englishInput}
                onChange={(e) => setEnglishInput(e.target.value)}
                className="mt-3 w-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-200"
                spellCheck={false}
              />
              <p className="mt-2 text-xs text-gray-600">
                Encodes each word independently so the chosen word separator is
                always respected.
              </p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-neutral-900">Output</h2>
          </div>

          <pre className="mt-3 w-full min-h-[180px] whitespace-pre-wrap rounded-xl border border-gray-200 bg-white p-3 text-sm sm:text-base font-mono">
            {out || "—"}
          </pre>

          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <button
              onClick={async () => {
                const ok = await copyToClipboard(out);
                setCopied(ok);
                window.setTimeout(() => setCopied(false), 900);
              }}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer active:scale-95 transition"
            >
              Copy output
            </button>
            {copied && (
              <span className="text-sm font-semibold text-green-700">
                Copied
              </span>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Note:</strong>{" "}
            {mode === "normalizeMorse" ? (
              <>
                This page does not “guess” letters. It only rewrites separators
                and spacing. If your letter groups are wrong, the output will
                still be wrong, just consistently formatted.
              </>
            ) : (
              <>
                This is separator-focused formatting. If you need full encoding
                options or audio playback, use the main encoder page.
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="font-extrabold text-neutral-900">Standard spacing</p>
          <p className="mt-2 text-sm text-gray-700">
            Letters are separated by a single space. Words are separated by{" "}
            <strong>7 spaces</strong>.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="font-extrabold text-neutral-900">Slash separator</p>
          <p className="mt-2 text-sm text-gray-700">
            A <strong>/</strong> is often used as a visible word break in
            puzzles and copied strings.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="font-extrabold text-neutral-900">Pipe separator</p>
          <p className="mt-2 text-sm text-gray-700">
            A <strong>|</strong> is another common “word divider” when people
            want something easy to spot.
          </p>
        </div>
      </div>
    </section>
  );
}
