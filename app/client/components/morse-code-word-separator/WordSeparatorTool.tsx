import * as React from "react";
import { textToMorse } from "~/client/components/shared/morseUtils";

type OutputSep = "standard" | "slash" | "pipe" | "newline";
type Mode = "normalizeMorse" | "englishToMorse";

function onlyMorseChars(input: string) {
  return input.replace(/[^\n.\-\/|\s]/g, "");
}

function splitWordsFromMorse(raw: string): string[] {
  const s = raw
    .replace(/\r/g, "")
    .replace(/\n+/g, " WORD_BREAK ")
    .replace(/\s*\/\s*/g, " WORD_BREAK ")
    .replace(/\s*\|\s*/g, " WORD_BREAK ")
    .replace(/\s{7,}/g, " WORD_BREAK ");
  return s
    .split("WORD_BREAK")
    .map((w) => w.trim())
    .filter(Boolean);
}

function splitLettersFromMorse(word: string): string[] {
  const normalized = word.trim().replace(/\s{2,}/g, " ");
  return normalized
    .split(" ")
    .map((x) => x.trim())
    .filter(Boolean);
}

function formatMorse(words: string[][], sep: OutputSep): string {
  if (sep === "standard") {
    return words.map((letters) => letters.join(" ")).join("       ");
  }
  if (sep === "slash") {
    return words.map((letters) => letters.join(" ")).join(" / ");
  }
  if (sep === "pipe") {
    return words.map((letters) => letters.join(" ")).join(" | ");
  }
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
  const [sep, setSep] = React.useState<OutputSep>("standard");
  const [morseInput, setMorseInput] = React.useState<string>(
    "... --- ... / .-.-.-  .- -... -.-",
  );
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
    const words = englishInput.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "";

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
    <section className="mw-tool-section overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="tool-header flex flex-col gap-3 text-center sm:text-left">
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <span className="h-px w-8 bg-sky-800" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
            Separator tool
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl">
          Morse code word separator
        </h1>
        <p className="hidden text-base leading-relaxed text-slate-700 sm:block sm:text-lg">
          Normalize Morse word breaks and format English to Morse separators
          using <strong>7 spaces</strong>, <strong>/</strong>,{" "}
          <strong>|</strong>, or <strong>new lines</strong>.
        </p>
      </div>

      <div className="mt-5 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setMode("normalizeMorse")}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "normalizeMorse"
                ? "bg-white text-sky-950 shadow-sm"
                : "text-slate-700 hover:bg-white"
            }`}
            aria-pressed={mode === "normalizeMorse"}
          >
            Normalize Morse
          </button>
          <button
            onClick={() => setMode("englishToMorse")}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "englishToMorse"
                ? "bg-white text-sky-950 shadow-sm"
                : "text-slate-700 hover:bg-white"
            }`}
            aria-pressed={mode === "englishToMorse"}
          >
            English to Morse
          </button>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {sepOptions.map(([label, v]) => (
            <button
              key={v}
              onClick={() => setSep(v)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition ${
                sep === v
                  ? "border border-sky-200 bg-sky-50 text-sky-950"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              aria-pressed={sep === v}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-[#f7f4ee] p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-extrabold text-sky-950">
              {mode === "normalizeMorse" ? "Paste Morse" : "English input"}
            </h2>

            {mode === "normalizeMorse" ? (
              <span className="text-xs text-slate-600">
                Words: {wordCount} | Letters: {letterCount}
              </span>
            ) : (
              <span className="text-xs text-slate-600">Words: {wordCount}</span>
            )}
          </div>

          {mode === "normalizeMorse" ? (
            <>
              <textarea
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                className="mt-3 min-h-[180px] w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 sm:text-base"
                spellCheck={false}
              />
              <p className="mt-2 text-xs text-slate-600">
                Kept characters: dots, dashes, spaces, slashes, pipes, and new
                lines.
              </p>
            </>
          ) : (
            <>
              <textarea
                value={englishInput}
                onChange={(e) => setEnglishInput(e.target.value)}
                className="mt-3 min-h-[180px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 sm:text-base"
                spellCheck={false}
              />
              <p className="mt-2 text-xs text-slate-600">
                Encodes each word independently so the chosen word separator is
                always respected.
              </p>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-sky-50/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-extrabold text-sky-950">Output</h2>
          </div>

          <pre className="mt-3 min-h-[180px] w-full whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm sm:text-base">
            {out || "-"}
          </pre>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                const ok = await copyToClipboard(out);
                setCopied(ok);
                window.setTimeout(() => setCopied(false), 900);
              }}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-sky-300 hover:bg-sky-50 active:scale-95"
            >
              Copy output
            </button>
            {copied && (
              <span className="text-sm font-semibold text-emerald-700">
                Copied
              </span>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
            <strong className="text-sky-950">Note:</strong>{" "}
            {mode === "normalizeMorse" ? (
              <>
                This page only rewrites separators and spacing. If your letter
                groups are wrong, the output will still be wrong, just
                consistently formatted.
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
        {[
          [
            "Standard spacing",
            "Letters are separated by a single space. Words are separated by 7 spaces.",
          ],
          [
            "Slash separator",
            "A / is often used as a visible word break in puzzles and copied strings.",
          ],
          [
            "Pipe separator",
            "A | is another common word divider when people want something easy to spot.",
          ],
        ].map(([title, body]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="font-extrabold text-sky-950">{title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
