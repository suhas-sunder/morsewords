import * as React from "react";
import { textToMorse } from "~/client/components/shared/morseUtils";
import {
  HERO_EYEBROW_LINE_CLASS,
  HERO_EYEBROW_ROW_CLASS,
  HERO_EYEBROW_TEXT_CLASS,
  HERO_HEADER_CLASS,
  HERO_LEAD_CLASS,
  HERO_SECTION_CLASS,
  HERO_TITLE_CLASS,
} from "~/client/components/shared/heroStyles";
import {
  ToolOutputPanel,
  ToolPanel,
  ToolTextarea,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import {
  CopyActionButton,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";

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
    <section className={HERO_SECTION_CLASS}>
      <div className={HERO_HEADER_CLASS}>
        <div className={HERO_EYEBROW_ROW_CLASS}>
          <span className={HERO_EYEBROW_LINE_CLASS} />
          <span className={HERO_EYEBROW_TEXT_CLASS}>
            Separator tool
          </span>
        </div>
        <h1 className={HERO_TITLE_CLASS}>
          Morse code word separator
        </h1>
        <p className={HERO_LEAD_CLASS}>
          Normalize Morse word breaks and format English to Morse separators
          using <strong>7 spaces</strong>, <strong>/</strong>,{" "}
          <strong>|</strong>, or <strong>new lines</strong>.
        </p>
      </div>

      <div className="pb-4 pt-4 sm:pb-5 sm:pt-4">
      <div className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
        <div className="inline-flex gap-2 rounded-lg">
          <button
            type="button"
            onClick={() => setMode("normalizeMorse")}
            className={`${toolControlButtonClass({
              active: mode === "normalizeMorse",
              size: "sm",
            })} active:scale-95`}
            aria-pressed={mode === "normalizeMorse"}
          >
            Normalize Morse
          </button>
          <button
            type="button"
            onClick={() => setMode("englishToMorse")}
            className={`${toolControlButtonClass({
              active: mode === "englishToMorse",
              size: "sm",
            })} active:scale-95`}
            aria-pressed={mode === "englishToMorse"}
          >
            English to Morse
          </button>
        </div>

        <div className="inline-flex flex-wrap gap-2 rounded-lg">
          {sepOptions.map(([label, v]) => (
            <button
              type="button"
              key={v}
              onClick={() => setSep(v)}
              className={`${toolControlButtonClass({
                active: sep === v,
                size: "sm",
              })} active:scale-95`}
              aria-pressed={sep === v}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ToolPanel
          label={mode === "normalizeMorse" ? "Paste Morse" : "English input"}
          badge={
            mode === "normalizeMorse"
              ? `Words: ${wordCount} | Letters: ${letterCount}`
              : `Words: ${wordCount}`
          }
        >

          {mode === "normalizeMorse" ? (
            <>
              <ToolTextarea
                aria-label="Paste Morse"
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                className="text-sm sm:text-base"
                spellCheck={false}
              />
              <p className="mw-text-soft px-4 pb-4 text-xs text-slate-600">
                Kept characters: dots, dashes, spaces, slashes, pipes, and new
                lines.
              </p>
            </>
          ) : (
            <>
              <ToolTextarea
                aria-label="English input"
                value={englishInput}
                onChange={(e) => setEnglishInput(e.target.value)}
                className="font-sans text-sm sm:text-base"
                spellCheck={false}
              />
              <p className="mw-text-soft px-4 pb-4 text-xs text-slate-600">
                Encodes each word independently so the chosen word separator is
                always respected.
              </p>
            </>
          )}
        </ToolPanel>

        <ToolOutputPanel
          label="Output"
          footer={
            <>
              <CopyActionButton
                value={out}
                label="Copy output"
                copiedLabel={null}
                onCopy={copyTextToClipboard}
                onCopiedChange={setCopied}
                tone="darkPanel"
                size="sm"
                className="active:scale-95"
              />
              {copied && (
                <span className="text-sm font-semibold text-emerald-300">
                  Copied
                </span>
              )}
            </>
          }
        >
          <pre className="mw-output-text min-h-[10rem] w-full whitespace-pre-wrap bg-transparent p-4 font-mono text-sm text-sky-100 sm:text-base">
            {out || "-"}
          </pre>

          <div className="mw-panel-dark-subtle mw-output-soft mx-4 mb-4 rounded-xl bg-slate-800/70 p-3 text-sm text-slate-200">
            <strong className="mw-output-text text-sky-100">Note:</strong>{" "}
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
        </ToolOutputPanel>
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
            className="mw-surface-card-soft rounded-xl bg-[#fffdf8]/85 p-4"
          >
            <p className="mw-heading font-extrabold text-sky-950">{title}</p>
            <p className="mw-text-muted mt-2 text-sm leading-relaxed text-slate-700">
              {body}
            </p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
