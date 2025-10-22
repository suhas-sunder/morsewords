import * as React from "react";
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    {
      title:
        "Free Online Translator & Audio Tool | Learn and Practice Morse Code ~ MorseWords",
    },
    {
      name: "description",
      content:
        "Convert text to Morse or decode back instantly, adjust speed (WPM) and tone, and practice real listening skills through an educational interface. Learn Morse code online with this free interactive translator and audio trainer.",
    },
    {
      name: "keywords",
      content:
        "morse code translator, learn morse code, morse code practice, text to morse, morse to text, morse audio, morse code converter, cw training, wpm, tone, online morse learning tool",
    },
    { name: "robots", content: "index,follow" },
    { name: "theme-color", content: "#0b2447" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_EXPRESS };
}

// ITU-ish core map
const TEXT_TO_MORSE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "/": "-..-.",
  "'": ".----.",
  "!": "-.-.--",
  "-": "-....-",
  "@": ".--.-.",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  '"': ".-..-.",
  "(": "-.--.",
  ")": "-.--.-",
};
const MORSE_TO_TEXT = Object.fromEntries(
  Object.entries(TEXT_TO_MORSE).map(([k, v]) => [v, k])
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#f7f8fb",
    color: "#111317",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    margin: 0,
  },
  wrap: { maxWidth: 1120, margin: "0 auto", padding: 24 },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #e6e8ef",
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: {
    width: 44,
    height: 44,
    border: "2px solid #0b2447",
    borderRadius: 10,
    background: "#fff",
    position: "relative",
  },
  siteTitle: { fontWeight: 800, letterSpacing: 0.3, fontSize: "1.15rem" },
  tagline: { color: "#5a616c", fontSize: ".95rem" },

  h1: {
    fontSize: "clamp(1.8rem, 2.6vw + 1rem, 3rem)",
    lineHeight: 1.15,
    margin: 0,
  },
  lead: { marginTop: 8, color: "#5a616c", fontSize: "1.05rem" },
  card: {
    background: "#fff",
    border: "1px solid #e6e8ef",
    borderRadius: 16,
    boxShadow: "0 1px 0 rgba(11,36,71,0.14)",
  },
  cardPad: { padding: 16 },
  section: { padding: "8px 0 24px" },
  sectionTitle: { fontSize: "1.35rem", margin: "0 0 12px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  label: { fontSize: ".9rem", color: "#5a616c" },
  textarea: {
    width: "100%",
    minHeight: 140,
    padding: 12,
    border: "1px solid #e6e8ef",
    borderRadius: 10,
    background: "#fff",
    color: "#111317",
    font: '500 0.98rem/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
  },
  input: {
    width: "100%",
    minHeight: 40,
    padding: 10,
    border: "1px solid #e6e8ef",
    borderRadius: 10,
    background: "#fff",
    color: "#111317",
    font: '600 0.98rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
  },
  controls: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 10,
  },
  btnPrimary: {
    border: "1px solid #0b2447",
    background: "#0b2447",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  btnSecondary: {
    border: "1px solid #0b2447",
    background: "#fff",
    color: "#0b2447",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  btnGhost: {
    border: "1px solid #e6e8ef",
    background: "#fff",
    color: "#111317",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",
  },
  note: { color: "#5a616c", fontSize: ".9rem" },
  footer: {
    color: "#5a616c",
    fontSize: ".9rem",
    textAlign: "center",
    padding: "28px 0",
  },
};

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  plainA: string;
  setPlainA: (v: string) => void;
  morseA: string;
  morseB: string;
  textB: string;
  setMorseB: (v: string) => void;
  wpm: number;
  freq: number;
  playMorse: (code: string, wpm: number, freq: number) => void;
  stop: () => void;
}

function TranslatorSections({ wpm, freq, playMorse, stop }: Props) {
  const [plainA, setPlainA] = useState("");
  const [morseA, setMorseA] = useState("");
  const [morseB, setMorseB] = useState("");
  const [textB, setTextB] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const isPlayingRef = useRef(false);

  // ---------- Unlock AudioContext on Mobile ----------
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const ctx =
          (window as any).audioContext ||
          new (window.AudioContext || (window as any).webkitAudioContext)();
        ctx.resume?.();
        (window as any).audioContext = ctx;
      } catch (err) {
        console.warn("AudioContext unlock failed:", err);
      }
    };
    document.addEventListener("touchstart", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
    return () => {
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("click", unlockAudio);
    };
  }, []);

  // ---------- Internal Morse map ----------
  const MORSE: Record<string, string> = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    _: "..--.-",
    '"': ".-..-.",
    "@": ".--.-.",
  };
  const REVERSE: Record<string, string> = {};
  for (const [k, v] of Object.entries(MORSE)) REVERSE[v] = k;

  // ---------- Encode / Decode ----------
  const encode = (text: string) =>
    text
      .toUpperCase()
      .split(/\s+/)
      .map((word) =>
        [...word]
          .map((ch) => MORSE[ch] || "")
          .filter(Boolean)
          .join("   ")
      )
      .join("       "); // 7 spaces between words

  const decode = (morse: string) =>
    morse
      .trim()
      .split(/(?:\s{7,}|\/+)/)
      .map((word) =>
        word
          .trim()
          .split(/\s{1,6}/)
          .map((c) => REVERSE[c.trim()] || "")
          .join("")
      )
      .join(" ");

  // ---------- Effects ----------
  useEffect(() => setMorseA(encode(plainA)), [plainA]);
  useEffect(() => setTextB(decode(morseB)), [morseB]);

  // ---------- Copy helper ----------
  const handleCopy = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1200);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  // ---------- Validation ----------
  const ALLOWED = useMemo(() => new Set(Object.keys(MORSE)), []);
  const unsupportedPlain = useMemo(() => {
    const u: Record<string, number> = {};
    for (const ch of plainA.toUpperCase()) {
      if (!ch.trim()) continue;
      if (!ALLOWED.has(ch)) u[ch] = (u[ch] || 0) + 1;
    }
    return u;
  }, [plainA]);

  const morseInputIssues = useMemo(() => {
    const issues: string[] = [];
    if (morseB) {
      const bad = morseB.replace(/[.\-\s/]/g, "");
      if (bad.length)
        issues.push(
          `Invalid char${bad.length > 1 ? "s" : ""}: ${[...new Set(bad)].join(" ")}`
        );
      if (/\s{2,}/.test(morseB) && !/\s{3,}/.test(morseB))
        issues.push("Tip: use 3 spaces between letters, 7 between words.");
    }
    return issues;
  }, [morseB]);

  const examples = [
    {
      label: "HELLO_WORLD",
      morse: ".... . .-.. .-.. ---   ..--.-   .-- --- .-. .-.. -..",
    },
    { label: "CQ", morse: "-.-. --.-" },
    { label: "SOS", morse: "... --- ..." },
  ];

  const morseExamplesB = [
    { label: "HI", morse: "....   .." },
    { label: "OK", morse: "---   -.-" },
    { label: "FUN", morse: "..-.   ..-   -." },
  ];

  // ---------- Safe Play Wrapper ----------
  const handlePlay = async (code: string) => {
    if (!code || isPlayingRef.current) return;
    try {
      isPlayingRef.current = true;
      stop();
      await playMorse(code, wpm, freq);
    } finally {
      isPlayingRef.current = false;
    }
  };

  // ---------- UI ----------
  return (
    <div className="flex flex-col gap-10 my-8">
      {/* TEXT → MORSE */}
      <section className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0b2447]">Text → Morse</h2>

        <div className="flex flex-wrap gap-2 mt-2">
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setPlainA(ex.label)}
              className="border cursor-pointer border-[#e6e8ef] px-3 py-1 rounded-full text-sm hover:bg-gray-50 active:scale-95 transition"
            >
              Try “{ex.label}”
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="plainA" className="font-semibold">
              Plain Text
            </label>
            <textarea
              id="plainA"
              className="w-full border rounded-md p-3 font-mono h-40 focus:ring-2 focus:ring-[#0b2447]"
              value={plainA}
              onChange={(e) => setPlainA(e.target.value)}
              placeholder="Example: Hello World"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
            {Object.keys(unsupportedPlain).length > 0 && (
              <p className="mt-2 text-xs text-amber-600">
                Unsupported:{" "}
                {Object.entries(unsupportedPlain)
                  .map(([ch, n]) => `${ch}×${n}`)
                  .join(", ")}{" "}
                (ignored)
              </p>
            )}
          </div>

          <div>
            <label htmlFor="morseA" className="font-semibold">
              Morse Output
            </label>
            <textarea
              id="morseA"
              className="w-full border rounded-md p-3 font-mono h-40 bg-gray-50"
              value={morseA}
              readOnly
              placeholder=".... . .-.. .-.. ---   .-- --- .-. .-.. -.."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 relative">
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(morseA, "morseA")}
              disabled={!morseA}
              className={`px-4 py-2 cursor-pointer rounded-md font-semibold active:scale-95 transition text-white ${
                morseA
                  ? "bg-[#0b2447] hover:bg-[#09203d]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              📋 Copy Morse
            </button>
            <button
              onClick={() => morseA && handlePlay(morseA)}
              disabled={!morseA}
              className={`px-4 py-2 cursor-pointer rounded-md font-semibold active:scale-95 transition text-white ${
                morseA
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              ▶ Play Audio
            </button>
            <button
              onClick={stop}
              className="bg-gray-200 cursor-pointer text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 active:scale-95 transition"
            >
              ⏹ Stop
            </button>
          </div>
          {copied === "morseA" && (
            <span className="absolute left-0 bottom-[-1.5rem] text-sm text-green-600 animate-fade">
              ✓ Copied!
            </span>
          )}
          <span className="ml-auto text-sm text-gray-500">
            3 spaces = letters, 7 spaces = words.
          </span>
        </div>
      </section>

      {/* MORSE → TEXT */}
      <section className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0b2447]">Morse → Text</h2>

        <div className="flex flex-wrap gap-2 mt-2">
          {morseExamplesB.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setMorseB(ex.morse)}
              className="border border-[#e6e8ef] px-3 py-1 rounded-full text-sm hover:bg-gray-50 active:scale-95 transition"
            >
              Try “{ex.label}”
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="morseB" className="font-semibold">
              Morse Input
            </label>
            <textarea
              id="morseB"
              className="w-full border rounded-md p-3 font-mono h-40 focus:ring-2 focus:ring-[#0b2447]"
              value={morseB}
              onChange={(e) => setMorseB(e.target.value)}
              placeholder=".... . .-.. .-.. ---   .-- --- .-. .-.. -.."
              spellCheck={false}
            />
            {morseInputIssues.length > 0 && (
              <p className="mt-2 text-xs text-amber-600">
                {morseInputIssues.join(" ")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="textB" className="font-semibold">
              Text Output
            </label>
            <textarea
              id="textB"
              className="w-full border rounded-md p-3 font-mono h-40 bg-gray-50"
              value={textB}
              readOnly
              placeholder="Example: Hello World"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 relative">
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(textB, "textB")}
              disabled={!textB}
              className={`px-4 py-2 rounded-md cursor-pointer font-semibold active:scale-95 transition text-white ${
                textB
                  ? "bg-[#0b2447] hover:bg-[#09203d]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              📋 Copy Text
            </button>
            <button
              onClick={() => morseB && handlePlay(morseB)}
              disabled={!morseB}
              className={`px-4 py-2 rounded-md cursor-pointer font-semibold active:scale-95 transition text-white ${
                morseB
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              ▶ Play Audio
            </button>
            <button
              onClick={stop}
              className="bg-gray-200 text-gray-800 cursor-pointer font-semibold px-4 py-2 rounded-md hover:bg-gray-300 active:scale-95 transition"
            >
              ⏹ Stop
            </button>
          </div>
          {copied === "textB" && (
            <span className="absolute left-0 bottom-[-1.5rem] text-sm text-green-600 animate-fade">
              ✓ Copied!
            </span>
          )}
          <span className="ml-auto text-sm text-gray-500">
            3 spaces = letters, 7 spaces = words.
          </span>
        </div>
      </section>
    </div>
  );
}

function LogoBars() {
  return (
    <>
      <span
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          top: 12,
          height: 3,
          background: "#0b2447",
          borderRadius: 2,
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 8,
          width: "50%",
          bottom: 12,
          height: 3,
          background: "#0b2447",
          borderRadius: 2,
        }}
      />
    </>
  );
}

function useAudio() {
  const ctxRef = React.useRef<AudioContext | null>(null);
  const stopRef = React.useRef(false);

  function ditMs(wpm: number) {
    return 1200 / wpm;
  }
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function tone(ms: number, hz: number) {
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    const ctx = ctxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = hz;
    gain.gain.value = 0.001;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
    await sleep(ms);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.01);
    await sleep(14);
    osc.stop();
  }

  async function playMorse(
    code: string,
    wpm: number,
    hz: number,
    wordGapUnits = 7
  ) {
    stopRef.current = false;
    const unit = ditMs(wpm);
    const parts = code.trim().split(/(\s+)/);
    for (let i = 0; i < parts.length; i++) {
      if (stopRef.current) break;
      const token = parts[i];
      if (/^\s+$/.test(token)) {
        const spaces = token.length;
        const units = spaces >= 7 ? wordGapUnits : spaces >= 3 ? 3 : 1;
        await sleep(units * unit);
        continue;
      }
      for (let s = 0; s < token.length; s++) {
        if (stopRef.current) break;
        const ch = token[s];
        if (ch === ".") await tone(unit, hz);
        else if (ch === "-") await tone(3 * unit, hz);
        if (s < token.length - 1) await sleep(unit);
      }
    }
  }

  function stop() {
    stopRef.current = true;
  }
  return { playMorse, stop };
}

function textToMorse(text: string): string {
  return text
    .normalize("NFKC")
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      word
        .split("")
        .map((c) => TEXT_TO_MORSE[c] || "")
        .filter(Boolean)
        .join(" ")
    )
    .join("   ");
}
function morseToText(code: string): string {
  return code
    .trim()
    .replace(/\s{7,}/g, "       ")
    .split(/\s{3,}/)
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((sym) => MORSE_TO_TEXT[sym] || "")
        .join("")
    )
    .join(" ");
}

function MorseStats({ morse, wpm }: { morse: string; wpm: number }) {
  // --- calculate Morse timing units and estimated duration ---
  const calculateMorseUnits = (morse: string) => {
    let units = 0;
    let symbols = 0;
    const chars = morse.trim().split("");

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (c === ".") {
        units += 1;
        symbols++;
      } else if (c === "-") {
        units += 3;
        symbols++;
      } else if (c === " ") {
        // detect multiple spaces (letter/word gap)
        const spaceCount = morse.slice(i).match(/^ +/)?.[0].length || 1;
        if (spaceCount >= 7) units += 7;
        else if (spaceCount >= 3) units += 3;
        else units += 1;
        i += spaceCount - 1;
      }
    }

    return { units, symbols };
  };

  const { units, symbols } = calculateMorseUnits(morse);
  const dotDuration = 1200 / wpm; // ms per dot
  const totalMs = Math.round(units * dotDuration);
  const seconds = (totalMs / 1000).toFixed(2);

  // --- render UI ---
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm bg-gray-50 px-3 py-2 rounded-md border border-gray-200 mt-3">
      <span className="font-semibold text-[#0b2447]">{symbols}</span> symbols •
      <span className="font-semibold text-[#0b2447]">{units}</span> units • ≈{" "}
      <span className="font-semibold text-[#0b2447]">{seconds}</span> s @ {wpm}{" "}
      WPM
    </div>
  );
}

const pairs = [
  { letter: "A", morse: ".-" },
  { letter: "B", morse: "-..." },
  { letter: "C", morse: "-.-." },
  { letter: "D", morse: "-.." },
  { letter: "E", morse: "." },
  { letter: "F", morse: "..-." },
  { letter: "G", morse: "--." },
  { letter: "H", morse: "...." },
  { letter: "I", morse: ".." },
  { letter: "J", morse: ".---" },
  { letter: "K", morse: "-.-" },
  { letter: "L", morse: ".-.." },
  { letter: "M", morse: "--" },
  { letter: "N", morse: "-." },
  { letter: "O", morse: "---" },
  { letter: "P", morse: ".--." },
  { letter: "Q", morse: "--.-" },
  { letter: "R", morse: ".-." },
  { letter: "S", morse: "..." },
  { letter: "T", morse: "-" },
  { letter: "U", morse: "..-" },
  { letter: "V", morse: "...-" },
  { letter: "W", morse: ".--" },
  { letter: "X", morse: "-..-" },
  { letter: "Y", morse: "-.--" },
  { letter: "Z", morse: "--.." },

  // Digits
  { letter: "0", morse: "-----" },
  { letter: "1", morse: ".----" },
  { letter: "2", morse: "..---" },
  { letter: "3", morse: "...--" },
  { letter: "4", morse: "....-" },
  { letter: "5", morse: "....." },
  { letter: "6", morse: "-...." },
  { letter: "7", morse: "--..." },
  { letter: "8", morse: "---.." },
  { letter: "9", morse: "----." },

  // Punctuation
  { letter: ".", morse: ".-.-.-" },
  { letter: ",", morse: "--..--" },
  { letter: "?", morse: "..--.." },
  { letter: "'", morse: ".----." },
  { letter: "!", morse: "-.-.--" },
  { letter: "/", morse: "-..-." },
  { letter: "(", morse: "-.--." },
  { letter: ")", morse: "-.--.-" },
  { letter: "&", morse: ".-..." },
  { letter: ":", morse: "---..." },
  { letter: ";", morse: "-.-.-." },
  { letter: "=", morse: "-...-" },
  { letter: "+", morse: ".-.-." },
  { letter: "-", morse: "-....-" },
  { letter: "_", morse: "..--.-" },
  { letter: '"', morse: ".-..-." },
  { letter: "$", morse: "...-..-" },
  { letter: "@", morse: ".--.-." },

  // Greetings
  { text: "HELLO", morse: "....   .   .-..   .-..   ---" },
  { text: "HI", morse: "....   .." },
  { text: "HEY", morse: "....   .   -.--" },
  { text: "WELCOME", morse: ".--   .   .-..   -.-.   ---   --   ." },
  {
    text: "GOOD MORNING",
    morse: "--.   ---   ---   -..       --   ---   .-.   -.   ..   -.   --.",
  },
  {
    text: "GOOD NIGHT",
    morse: "--.   ---   ---   -..       -.   ..   --.   ....   -",
  },

  // Courtesy
  { text: "PLEASE", morse: ".--.   .-..   .   .-   ...   ." },
  {
    text: "THANK YOU",
    morse: "-   ....   .-   -.   -.-       -.--   ---   ..-",
  },
  { text: "SORRY", morse: "...   ---   .-.   .-.   -.--" },
  { text: "YES", morse: "-.--   .   ..." },
  { text: "NO", morse: "-.   ---" },
  { text: "MAYBE", morse: "--   .-   -.--   -...   ." },

  // Everyday
  {
    text: "HOW ARE YOU",
    morse: "....   ---   .--       .-   .-.   .       -.--   ---   ..-",
  },
  {
    text: "I LOVE YOU",
    morse: "..       .-..   ---   ...-   .       -.--   ---   ..-",
  },
  { text: "THANKS", morse: "-   ....   .-   -.   -.-   ..." },
  { text: "BYE", morse: "-...   -.--   ." },
  { text: "SEE YOU", morse: "...   .   .       -.--   ---   ..-" },

  // Emotions
  { text: "HAPPY", morse: "....   .-   .--.   .--.   -.--" },
  { text: "SAD", morse: "...   .-   -.." },
  { text: "LOVE", morse: ".-..   ---   ...-   ." },
  { text: "PEACE", morse: ".--.   .   .-   -.-.   ." },

  // Emergencies
  { text: "SOS", morse: "...   ---   ..." },
  { text: "HELP", morse: "....   .   .-..   .--." },
  { text: "EMERGENCY", morse: ".   --   .   .-.   --.   .   -.   -.-.   -.--" },
  { text: "STOP", morse: "...   -   ---   .--." },
  { text: "FIRE", morse: "..-.   ..   .-.   ." },
  {
    text: "CALL 911",
    morse: "-.-.   .-   .-..   .-..       ----.   .----   .----",
  },

  // Nouns
  { text: "DOG", morse: "-..   ---   --." },
  { text: "CAT", morse: "-.-.   .-   -" },
  { text: "TREE", morse: "-   .-.   .   ." },
  { text: "SUN", morse: "...   ..-   -." },
  { text: "MOON", morse: "--   ---   ---   -." },
  { text: "STAR", morse: "...   -   .-   .-." },

  // Numbers & time
  {
    text: "ONE TWO THREE",
    morse: "---   -.   .       -   .--   ---       -   ....   .-.   .   .",
  },
  { text: "123", morse: ".----   ..---   ...--" },
  { text: "2025", morse: "..---   -----   ..---   ....." },
  { text: "TIME", morse: "-   ..   --   ." },

  // Radio procedure
  { text: "CQ", morse: "-.-.   --.-" },
  { text: "OVER", morse: "---   ...-   .   .-." },
  { text: "OUT", morse: "---   ..-   -" },
  { text: "WAIT", morse: ".--   .-   ..   -" },
  { text: "READY", morse: ".-.   .   .-   -..   -.--" },
  { text: "GO", morse: "--.   ---" },

  // Learning
  { text: "CODE", morse: "-.-.   ---   -..   ." },
  { text: "MORSE", morse: "--   ---   .-.   ...   ." },
  { text: "LEARN", morse: ".-..   .   .-   .-.   -." },
  { text: "QUIZ", morse: "--.-   ..-   ..   --.." },
  { text: "PRACTICE", morse: ".--.   .-.   .-   -.-.   -   ..   -.-.   ." },

  // Emergency phrases
  { text: "MAYDAY", morse: "--   .-   -.--   -..   .-   -.--" },
  {
    text: "SOS HELP ME",
    morse: "...   ---   ...       ....   .   .-..   .--.       --   .",
  },
  { text: "FIRE HERE", morse: "..-.   ..   .-.   .       ....   .   .-.   ." },
  {
    text: "NEED ASSISTANCE",
    morse:
      "-.   .   .   -..       .-   ...   ...   ..   ...   -   .-   -.   -.-.   .",
  },

  // Love
  {
    text: "I MISS YOU",
    morse: "..       --   ..   ...   ...       -.--   ---   ..-",
  },
  { text: "BE MINE", morse: "-...   .       --   ..   -.   ." },
  { text: "LOVE YOU", morse: ".-..   ---   ...-   .       -.--   ---   ..-" },

  { text: "GOOD JOB", morse: "--.   ---   ---   -..       .---   ---   -..." },
  {
    text: "WELL DONE",
    morse: ".--   .   .-..   .-..       -..   ---   -.   .",
  },
  {
    text: "NICE WORK",
    morse: "-.   ..   -.-.   .       .--   ---   .-.   -.-",
  },
  {
    text: "KEEP GOING",
    morse: "-.-   .   .   .--.       --.   ---   ..   -.   --.",
  },
  {
    text: "STAY STRONG",
    morse: "...   -   .-   -.--       ...   -   .-.   ---   -.   --.",
  },
  { text: "TRY AGAIN", morse: "-   .-.   -.--       .-   --.   .-   ..   -." },
  { text: "YOU CAN", morse: "-.--   ---   ..-       -.-.   .-   -." },
  {
    text: "GREAT WORK",
    morse: "--.   .-.   .   .-   -       .--   ---   .-.   -.-",
  },
  {
    text: "KEEP LEARNING",
    morse: "-.-   .   .   .--.       .-..   .   .-   .-.   -.   ..   -.   --.",
  },

  {
    text: "NEVER QUIT",
    morse: "-.   .   ...-   .   .-.       --.-   ..-   ..   -",
  },
  { text: "BE STRONG", morse: "-...   .       ...   -   .-.   ---   -.   --." },
  {
    text: "KEEP TRYING",
    morse: "-.-   .   .   .--.       -   .-.   -.--   ..   -.   --.",
  },
  { text: "BELIEVE", morse: "-...   .   .-..   ..   .   ...-   ." },
  { text: "FOCUS", morse: "..-.   ---   -.-.   ..-   ..." },
  { text: "SMILE", morse: "...   --   ..   .-..   ." },
  { text: "WIN", morse: ".--   ..   -." },
  {
    text: "READY SET GO",
    morse: ".-.   .   .-   -..   -.--       ...   .   -       --.   ---",
  },

  {
    text: "HELLO THERE",
    morse: "....   .   .-..   .-..   ---       -   ....   .   .-.   .",
  },
  {
    text: "HI FRIEND",
    morse: "....   ..       ..-.   .-.   ..   .   -.   -..",
  },
  {
    text: "SECRET CODE",
    morse: "...   .   -.-.   .-.   .   -       -.-.   ---   -..   .",
  },
  {
    text: "HIDDEN MESSAGE",
    morse:
      "....   ..   -..   -..   .   -.       --   .   ...   ...   .-   --.   .",
  },
  {
    text: "RADIO SIGNAL",
    morse: ".-.   .-   -..   ..   ---       ...   ..   --.   -.   .-   .-..",
  },
  { text: "TAP TAP", morse: "-   .-   .--.       -   .-   .--." },
  { text: "FUN TIME", morse: "..-.   ..-   -.       -   ..   --   ." },
  { text: "CODE GAME", morse: "-.-.   ---   -..   .       --.   .-   --   ." },

  { text: "ALERT", morse: ".-   .-..   .   .-.   -" },
  { text: "SAFE NOW", morse: "...   .-   ..-.   .       -.   ---   .--" },
  {
    text: "HELP NEEDED",
    morse: "....   .   .-..   .--.       -.   .   .   -..   .   -..",
  },
  {
    text: "ALL CLEAR",
    morse: ".-   .-..   .-..       -.-.   .-..   .   .-   .-.",
  },
  {
    text: "CALL FOR HELP",
    morse:
      "-.-.   .-   .-..   .-..       ..-.   ---   .-.       ....   .   .-..   .--.",
  },
];

function MorseQuiz() {
  // ----- helpers -----
  const getAnswerFromPair = (p: any): string =>
    (p?.letter ?? p?.text ?? p?.word ?? p?.char ?? p?.label ?? "")
      .toString()
      .trim()
      .toUpperCase();

  const getMorseFromPair = (p: any): string => (p?.morse ?? "").toString();

  const normalizeText = (s: string): string =>
    s.replace(/\s+/g, " ").trim().toUpperCase();

  // ensure we only pick items that have morse and some answer text
  const validPairs = Array.isArray(pairs)
    ? pairs.filter((p) => getMorseFromPair(p) && getAnswerFromPair(p))
    : [];

  if (validPairs.length === 0) {
    console.warn("⚠️ No valid pairs available");
    return (
      <div className="border border-gray-200 rounded-xl p-6 bg-white mt-8 text-gray-700">
        Loading quiz…
      </div>
    );
  }

  const getRandomPair = () =>
    validPairs[Math.floor(Math.random() * validPairs.length)] ?? validPairs[0];

  // ----- state -----
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const [focused, setFocused] = useState(false);
  const [locked, setLocked] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // initialize once on client
    if (!question && validPairs.length > 0) {
      setQuestion(getRandomPair());
    }
  }, [question, validPairs]);

  // ----- submit -----
  const handleSubmit = () => {
    if (locked) return;

    const user = normalizeText(answer);
    if (!user) return;

    // snapshot current question to avoid race conditions
    const current = question;
    const expected = normalizeText(getAnswerFromPair(current));

    setLocked(true);

    if (user === expected) {
      setFeedback("✅ Correct!");
      setStreak((s) => s + 1);
    } else {
      // show the *resolved* expected string (letter OR word)
      setFeedback(`❌ The correct answer was “${expected || "?"}”.`);
      setStreak(0);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = window.setTimeout(() => {
      setQuestion(getRandomPair());
      setAnswer("");
      setFeedback("");
      setLocked(false);
      inputRef.current?.focus();
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ----- render -----
  const morse = question ? getMorseFromPair(question) : "";

  return (
    <section
      className="border border-gray-200 rounded-2xl p-6 mt-8 bg-white mb-5 space-y-5 shadow-sm transition"
      aria-labelledby="morse-quiz-title"
      itemScope
      itemType="https://schema.org/Quiz"
    >
      <h2
        id="morse-quiz-title"
        itemProp="name"
        className="font-bold text-2xl text-[#0b2447]"
      >
        Morse Code Quick Quiz - Test Your Skills & Beat Your Longest Streak!
      </h2>

      <p
        itemProp="description"
        className="text-gray-700 text-base leading-relaxed"
      >
        Decode the Morse code shown below by typing the matching{" "}
        <strong>letter or word</strong>. Press <kbd>Enter</kbd> or click{" "}
        <strong>Check</strong> to submit. Build your streak!
      </p>

      <div
        className="flex flex-col items-start gap-4 mt-2"
        itemProp="hasPart"
        itemScope
        itemType="https://schema.org/Question"
      >
        <p className="text-lg text-gray-800">
          <span className="font-semibold text-[#0b2447]">Code:</span>{" "}
          <span
            itemProp="text"
            className="font-mono text-2xl tracking-wider select-none bg-gray-50 px-3 py-1 rounded"
          >
            {morse || "…"}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row w-full items-center gap-3">
          <label htmlFor="quizAnswer" className="sr-only">
            Enter your answer
          </label>

          <input
            ref={inputRef}
            id="quizAnswer"
            type="text"
            className="border border-gray-300 rounded-md w-full sm:w-2/3 px-4 py-2 text-base text-gray-900 text-left font-medium focus:ring-2 focus:ring-[#0b2447] outline-none transition"
            placeholder={focused ? "" : "Type your answer (letter or word)"}
            value={answer}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Your answer"
            disabled={locked}
            autoCapitalize="characters"
          />

          <button
            onClick={handleSubmit}
            className={`px-6 py-2 cursor-pointer rounded-md font-semibold transition text-white ${
              locked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0b2447] hover:bg-[#09203d] active:scale-95"
            }`}
            disabled={locked}
            itemProp="suggestedAnswer"
            itemScope
            itemType="https://schema.org/Answer"
          >
            {locked ? "Next…" : "Check"}
          </button>
        </div>

        {feedback && (
          <p
            className={`text-base font-semibold mt-1 ${
              feedback.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
            itemProp="acceptedAnswer"
            itemScope
            itemType="https://schema.org/Answer"
          >
            <span itemProp="text">{feedback}</span>
          </p>
        )}

        <div className="text-sm text-gray-600 flex flex-wrap gap-3 mt-2">
          <span>🔥 Streak: {streak}</span>
          <span className="hidden sm:inline">•</span>
          <span>New code appears automatically after each answer.</span>
        </div>
      </div>
    </section>
  );
}

function MorseLookupTable() {
  const morseData = [
    // Letters
    { symbol: "A", morse: ".-" },
    { symbol: "B", morse: "-..." },
    { symbol: "C", morse: "-.-." },
    { symbol: "D", morse: "-.." },
    { symbol: "E", morse: "." },
    { symbol: "F", morse: "..-." },
    { symbol: "G", morse: "--." },
    { symbol: "H", morse: "...." },
    { symbol: "I", morse: ".." },
    { symbol: "J", morse: ".---" },
    { symbol: "K", morse: "-.-" },
    { symbol: "L", morse: ".-.." },
    { symbol: "M", morse: "--" },
    { symbol: "N", morse: "-." },
    { symbol: "O", morse: "---" },
    { symbol: "P", morse: ".--." },
    { symbol: "Q", morse: "--.-" },
    { symbol: "R", morse: ".-." },
    { symbol: "S", morse: "..." },
    { symbol: "T", morse: "-" },
    { symbol: "U", morse: "..-" },
    { symbol: "V", morse: "...-" },
    { symbol: "W", morse: ".--" },
    { symbol: "X", morse: "-..-" },
    { symbol: "Y", morse: "-.--" },
    { symbol: "Z", morse: "--.." },

    // Numbers
    { symbol: "1", morse: ".----" },
    { symbol: "2", morse: "..---" },
    { symbol: "3", morse: "...--" },
    { symbol: "4", morse: "....-" },
    { symbol: "5", morse: "....." },
    { symbol: "6", morse: "-...." },
    { symbol: "7", morse: "--..." },
    { symbol: "8", morse: "---.." },
    { symbol: "9", morse: "----." },
    { symbol: "0", morse: "-----" },

    // Punctuation
    { symbol: ".", morse: ".-.-.-" },
    { symbol: ",", morse: "--..--" },
    { symbol: "?", morse: "..--.." },
    { symbol: "'", morse: ".----." },
    { symbol: "!", morse: "-.-.--" },
    { symbol: "/", morse: "-..-." },
    { symbol: "(", morse: "-.--." },
    { symbol: ")", morse: "-.--.-" },
    { symbol: "&", morse: ".-..." },
    { symbol: ":", morse: "---..." },
    { symbol: ";", morse: "-.-.-." },
    { symbol: "=", morse: "-...-" },
    { symbol: "+", morse: ".-.-." },
    { symbol: "-", morse: "-....-" },
    { symbol: "_", morse: "..--.-" },
    { symbol: '"', morse: ".-..-." },
    { symbol: "@", morse: ".--.-." },
  ];

  return (
    <section
      className="my-12 border border-gray-200 rounded-2xl bg-white shadow-sm p-6"
      aria-labelledby="morse-table-title"
      itemScope
      itemType="https://schema.org/Table"
    >
      <h2
        id="morse-table-title"
        className="text-2xl font-bold text-[#0b2447] mb-2"
        itemProp="name"
      >
        Morse Code Conversion Table (A–Z, 0–9, and Symbols)
      </h2>
      <p
        className="text-gray-700 text-base leading-relaxed mb-6"
        itemProp="description"
      >
        This complete International Morse Code chart shows letters, numbers, and
        punctuation with their corresponding dot (·) and dash (–) patterns. Use
        it as a quick reference for learning or decoding messages. Perfect for
        radio operators, students, and Morse enthusiasts.
      </p>

      <div className="overflow-x-auto">
        <table
          className="min-w-full border-collapse text-sm md:text-base text-gray-800"
          itemProp="about"
        >
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 px-3 text-left font-semibold border-r">
                Character
              </th>
              <th className="py-2 px-3 text-left font-semibold border-r">
                Morse Code
              </th>
              <th className="py-2 px-3 text-left font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            {morseData.map((item, idx) => (
              <tr
                key={idx}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="py-2 px-3 font-mono font-semibold">
                  {item.symbol}
                </td>
                <td className="py-2 px-3 font-mono text-[#0b2447] tracking-wider">
                  {item.morse}
                </td>
                <td className="py-2 px-3 text-gray-600">
                  {/[A-Z]/.test(item.symbol)
                    ? "Letter"
                    : /[0-9]/.test(item.symbol)
                      ? "Number"
                      : "Punctuation"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SEO-rich paragraph below table */}
      <div className="mt-6 text-sm text-gray-700 leading-relaxed space-y-2">
        <p>
          Each Morse symbol combines dots (·) and dashes (–) with precise
          timing. One dot equals one unit, a dash equals three units, the gap
          between elements within a letter is one unit, between letters is
          three, and between words is seven units.
        </p>
        <p>
          Learning the rhythm of Morse code is key to mastery. Start with the
          most common letters (E, T, A, I, N, O), then progress to numbers and
          punctuation. With regular practice, you’ll be able to recognize entire
          words by sound alone.
        </p>
        <p>
          This chart follows the{" "}
          <strong>ITU International Morse Standard</strong> and is suitable for{" "}
          <em>
            ham radio operators, aviation, maritime use, and educational
            learning
          </em>
          . Bookmark this page as a quick Morse reference anytime you need to
          translate between text and code.
        </p>
      </div>
    </section>
  );
}

function MorsePhraseLookupTable() {
  const phrases = [
    // Common words
    {
      phrase: "HELLO",
      morse: ".... . .-.. .-.. ---",
      meaning: "Friendly greeting",
    },
    {
      phrase: "GOOD MORNING",
      morse: "--. --- --- -..       -- --- .-. -. .. -. --.",
      meaning: "Polite day greeting",
    },
    {
      phrase: "THANK YOU",
      morse: "- .... .- -. -.-       -.-- --- ..-",
      meaning: "Expression of gratitude",
    },
    { phrase: "YES", morse: "-.-- . ...", meaning: "Affirmative / agreement" },
    { phrase: "NO", morse: "-. ---", meaning: "Negative / denial" },
    {
      phrase: "PLEASE",
      morse: ".--. .-.. . .- ... .",
      meaning: "Polite request",
    },
    {
      phrase: "LOVE",
      morse: ".-.. --- ...- .",
      meaning: "Affection / endearment",
    },
    {
      phrase: "FRIEND",
      morse: "..-. .-. .. . -. -..",
      meaning: "Companionship",
    },
    {
      phrase: "GOODBYE",
      morse: "--. --- --- -.. -... -.-- .",
      meaning: "Farewell / sign-off",
    },

    // Emergency / distress
    {
      phrase: "SOS",
      morse: "... --- ...",
      meaning: "Universal distress signal",
    },
    {
      phrase: "MAYDAY",
      morse: "-- .- -.-- -.. .- -.--",
      meaning: "Distress call (aviation/maritime)",
    },
    {
      phrase: "HELP",
      morse: ".... . .-.. .--.",
      meaning: "Request for assistance",
    },
    {
      phrase: "NEED ASSISTANCE",
      morse: "-. . . -..       .- ... ... .. ... - .- -. -.-. .",
      meaning: "Emergency request",
    },
    { phrase: "STOP", morse: "... - --- .--.", meaning: "End of transmission" },

    // Prosigns (procedure signals)
    { phrase: "AR (.-.-.)", morse: ".-.-.", meaning: "End of message" },
    { phrase: "AS (.-...)", morse: ".-...", meaning: "Wait / standby" },
    { phrase: "BT (-...-)", morse: "-...-", meaning: "Pause / new section" },
    {
      phrase: "CL (-.-..-..)",
      morse: "-.-..-..",
      meaning: "Going off air / closing station",
    },
    {
      phrase: "KN (-.-.-.)",
      morse: "-.-.-.",
      meaning: "Invitation to transmit specifically",
    },
    {
      phrase: "SK (...-.-)",
      morse: "...-.-",
      meaning: "End of contact / signing off",
    },

    // Q-codes (radio shorthand)
    {
      phrase: "QRL",
      morse: "--.- .-. .-..",
      meaning: "Is the frequency busy?",
    },
    { phrase: "QRZ", morse: "--.- .-. --..", meaning: "Who is calling me?" },
    { phrase: "QRS", morse: "--.- .-. ...", meaning: "Send more slowly" },
    { phrase: "QRQ", morse: "--.- .-. --.-", meaning: "Send faster" },
    { phrase: "QTH", morse: "--.- - ....", meaning: "My location is..." },
    {
      phrase: "QSL",
      morse: "--.- ... .-..",
      meaning: "Message received / acknowledgment",
    },
    { phrase: "QSY", morse: "--.- ... -.--", meaning: "Change frequency" },
    { phrase: "QRM", morse: "--.- .-. --", meaning: "Interference (man-made)" },
    {
      phrase: "QRN",
      morse: "--.- .-. -.",
      meaning: "Natural interference / static",
    },
    { phrase: "QRP", morse: "--.- .-. .--.", meaning: "Reduce power" },

    // Abbreviations (CW shorthand)
    {
      phrase: "73",
      morse: "--... ...--",
      meaning: "Best regards (friendly sign-off)",
    },
    {
      phrase: "88",
      morse: "---.. ---..",
      meaning: "Love and kisses (friendly end)",
    },
    {
      phrase: "OM",
      morse: "--- --",
      meaning: "Old man (friendly term for operator)",
    },
    {
      phrase: "YL",
      morse: "-.-- .-..",
      meaning: "Young lady (female operator)",
    },
    {
      phrase: "FB",
      morse: "..-. -...",
      meaning: "Fine business (good signal / message)",
    },
    { phrase: "HR", morse: ".... .-.", meaning: "Here" },
    {
      phrase: "TNX",
      morse: "- .... .- -. -..- / -....- / -..- -.",
      meaning: "Thanks",
    },
    { phrase: "CUL", morse: "-.-. ..- .-..", meaning: "See you later" },
    { phrase: "GL", morse: "--. .-..", meaning: "Good luck" },
    { phrase: "GA", morse: "--. .-", meaning: "Good afternoon" },
    { phrase: "GE", morse: "--. .", meaning: "Good evening" },
    { phrase: "GM", morse: "--. --", meaning: "Good morning" },

    // Practice phrases (balanced letter frequency)
    {
      phrase: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
      morse:
        "- .... .       --.- ..- .. -.-. -.-       -... .-. --- .-- -.       ..-. --- -..-       .--- ..- -- .--. ...       --- ...- . .-.       - .... .       .-.. .- --.. -.--       -.. --- --.",
      meaning: "Pangram (uses every letter)",
    },
    {
      phrase: "PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS",
      morse:
        ".--. .- -.-. -.-       -- -.--       -... --- -..-       .-- .. - ....       ..-. .. ...- .       -.. --- --.. . -.       .-.. .. --.- ..- --- .-.       .--- ..- --. ...",
      meaning: "Another pangram for practice",
    },
    {
      phrase: "MORSE CODE IS FUN",
      morse:
        "-- --- .-. ... .       -.-. --- -.. .       .. ...       ..-. ..- -.",
      meaning: "Motivational practice phrase",
    },
    {
      phrase: "KEEP PRACTICING",
      morse: "-.- . . .--.       .--. .-. .- -.-. - .. -.-. .. -. --.",
      meaning: "Encouragement to practice regularly",
    },
    {
      phrase: "LISTEN LEARN REPEAT",
      morse:
        ".-.. .. ... - . -.       .-.. . .- .-. -.       .-. . .--. . .- -",
      meaning: "Training advice for beginners",
    },
  ];

  return (
    <section
      className="my-12 border border-gray-200 rounded-2xl bg-white shadow-sm p-6"
      aria-labelledby="morse-phrases-title"
      itemScope
      itemType="https://schema.org/Table"
    >
      <h2
        id="morse-phrases-title"
        className="text-2xl font-bold text-[#0b2447] mb-2"
        itemProp="name"
      >
        Common Morse Code Phrases, Prosigns, and Abbreviations
      </h2>
      <p
        className="text-gray-700 text-base leading-relaxed mb-6"
        itemProp="description"
      >
        Explore a complete list of real-world Morse code phrases, radio
        shorthand, and prosigns used by amateur radio operators, maritime and
        aviation communication, and CW learners. Each entry shows the phrase,
        its Morse code pattern, and its meaning or usage context.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm md:text-base text-gray-800">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-2 px-3 text-left font-semibold border-r">
                Phrase / Abbreviation
              </th>
              <th className="py-2 px-3 text-left font-semibold border-r">
                Morse Code
              </th>
              <th className="py-2 px-3 text-left font-semibold">
                Meaning / Usage
              </th>
            </tr>
          </thead>
          <tbody>
            {phrases.map((p, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="py-2 px-3 font-semibold font-mono">
                  {p.phrase}
                </td>
                <td className="py-2 px-3 font-mono text-[#0b2447] tracking-wider">
                  {p.morse}
                </td>
                <td className="py-2 px-3 text-gray-700">{p.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm text-gray-700 leading-relaxed space-y-2">
        <p>
          These Morse code phrases include <strong>Q-codes</strong> (used in
          amateur radio),
          <strong>prosigns</strong> (procedural signals), and{" "}
          <strong>abbreviations</strong> commonly exchanged during CW
          (continuous wave) transmissions. They make communication faster and
          more standardized worldwide.
        </p>
        <p>
          Practicing with these phrases improves both <em>copy speed</em> and{" "}
          <em>transmit rhythm</em>. Focus first on SOS, QTH, QSL, and SK for
          real-world readiness, then build up to longer pangrams like{" "}
          <strong>THE QUICK BROWN FOX</strong>.
        </p>
        <p>
          This table follows the{" "}
          <strong>International Telecommunication Union (ITU)</strong> standards
          and includes terms recognized by{" "}
          <em>ham radio, aviation, and maritime</em> operators globally.
          Bookmark this chart to quickly look up any Morse prosign or radio
          abbreviation.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  // Shared controls
  const [wpm, setWpm] = React.useState(20);
  const [freq, setFreq] = React.useState(600);
  const { playMorse, stop } = useAudio();

  // Section A: Text → Morse
  const [plainA, setPlainA] = React.useState("sos help");
  const morseA = React.useMemo(() => textToMorse(plainA), [plainA]);

  // Section B: Morse → Text
  const [morseB, setMorseB] = React.useState("... --- ...");
  const textB = React.useMemo(() => morseToText(morseB), [morseB]);

  function numWithin(v: string | number, d: number, min: number, max: number) {
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(n)) return d;
    return Math.max(min, Math.min(max, n));
  }

  const baseUrl = "https://morsewords.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#org`,
        name: "MorseWords",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: "https://cdn.example.com/logo.png",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        url: baseUrl,
        name: "MorseWords",
        inLanguage: "en",
        publisher: { "@id": `${baseUrl}#org` },
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl + "/",
        name: "MorseWords – Free Online Morse Translator & Learning Tool",
        description:
          "Learn and practice Morse code online with audio playback, WPM and tone controls. Translate instantly between text and Morse, then improve skills with our interactive learning interface.",
        isPartOf: { "@id": `${baseUrl}#website` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://cdn.example.com/og/morsewords-home.jpg",
        },
        breadcrumb: { "@id": `${baseUrl}/#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${baseUrl}/`,
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        name: "MorseWords",
        applicationCategory: "EducationalApplication",
        operatingSystem: "All",
        url: baseUrl + "/",
        description:
          "Browser-based Morse translator with audio playback, timing controls, and interactive training features.",
        inLanguage: "en",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: { "@id": `${baseUrl}#org` },
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}#features`,
        name: "MorseWords Features",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Instant Text to Morse Conversion",
            url: `${baseUrl}/#t2m`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Accurate Morse to Text Translation",
            url: `${baseUrl}/#m2t`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Audio Playback with WPM and Tone Controls",
            url: `${baseUrl}/#audio`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Learning Tips and Practice Exercises",
            url: `${baseUrl}/#learn`,
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Interactive Morse Learning Interface",
            url: `${baseUrl}/#interactive-learning`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What speed should I start with?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Begin around 15 to 20 WPM, then raise speed as accuracy improves.",
            },
          },
          {
            "@type": "Question",
            name: "Does punctuation work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Period, comma, question mark, slash, quotes, hyphen, plus, equals, and more are supported.",
            },
          },
          {
            "@type": "Question",
            name: "Can I listen without converting?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Paste Morse and use audio playback at your chosen WPM and tone.",
            },
          },
          {
            "@type": "Question",
            name: "Why are spaces required?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Spacing separates symbols and words so the translator can decode correctly. Use three spaces between letters and seven between words.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need audio to practice learning Morse Code?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. You can decode by reading the code or by listening.",
            },
          },
          {
            "@type": "Question",
            name: "How long is each practice round?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Rounds are short so you can practice daily without fatigue.",
            },
          },
          {
            "@type": "Question",
            name: "What should I focus on first?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Focus on recognition and spacing. Speed will follow naturally.",
            },
          },
          {
            "@type": "Question",
            name: "Is this good for beginners?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The Interactive Learning Interface starts simple and adapts to your skill level.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#how-to-practice`,
        name: "How to Practice Morse Code with MorseWords",
        description:
          "Follow three simple steps to learn Morse code using the MorseWords translator and learning interface.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Listen or read the code",
            text: "Listen to the audio or read the Morse sequence shown on screen.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Type your translation",
            text: "Type your decoded text and compare it with the reference output.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Review and improve",
            text: "Check your accuracy, note tricky letters, and repeat to strengthen recognition.",
          },
        ],
        totalTime: "PT1M",
        tool: [
          {
            "@type": "HowToTool",
            name: "MorseWords Morse Code Audio Player",
            description:
              "For listening to Morse code audio while training recognition.",
          },
          {
            "@type": "HowToTool",
            name: "MorseWords Morse Code Translator",
            description:
              "For verifying decoded text and practicing translation accuracy.",
          },
        ],
      },
    ],
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <LogoBars />
            </div>
            <div>
              <div style={styles.siteTitle}>MorseWords</div>
              <div style={styles.tagline}>
                Translate, listen, and practice Morse code.
              </div>
            </div>
          </div>
          <span className="border border-[#e6e8ef] py-2 px-4 text-sm sm:text-base rounded-full bg-white text-[#0b2447] font-extrabold text-center">
            Instant Translator
          </span>
        </header>

        {/* Hero */}
        <section className="flex flex-col sm:flex-row gap-8 mt-6 mb-8 sm:mb-2">
          <div>
            <h1 style={styles.h1}>
              Learn and Translate Morse Code with Clean Audio
            </h1>
            <p style={styles.lead}>
              Convert words into International Morse Code and decode messages
              back to text. Adjust speed (WPM) and tone to train your ear and
              practice real Morse rhythm. Simple, accurate, and built for
              focused learning.
            </p>
          </div>

          <div className="card" style={{ ...styles.card, ...styles.cardPad }}>
            <h2 style={{ marginTop: 0, fontSize: "1.25rem" }}>
              Quick Controls
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <label style={styles.label}>Speed (WPM)</label>
                <input
                  style={styles.input}
                  inputMode="numeric"
                  value={wpm}
                  onChange={(e) => setWpm(numWithin(e.target.value, 20, 5, 60))}
                />
              </div>
              <div>
                <label style={styles.label}>Tone (Hz)</label>
                <input
                  style={styles.input}
                  inputMode="numeric"
                  value={freq}
                  onChange={(e) =>
                    setFreq(numWithin(e.target.value, 600, 200, 2000))
                  }
                />
              </div>
            </div>
            <p style={{ ...styles.note, marginTop: 8 }}>
              Standard timing: one "dit" equals one unit, one "dah" equals
              three. Letter gaps are three units, word gaps seven.
            </p>
          </div>
        </section>

        <TranslatorSections
          plainA={plainA}
          setPlainA={setPlainA}
          morseA={morseA}
          morseB={morseB}
          textB={textB}
          setMorseB={setMorseB}
          wpm={wpm}
          freq={freq}
          playMorse={playMorse}
          stop={stop}
        />

        <MorseQuiz />

        <MorseLookupTable />

        {/* Learn / SEO content */}
        <section style={styles.section} aria-labelledby="learn-title">
          <h2 id="learn-title" style={styles.sectionTitle}>
            Learn and Practice Morse Code
          </h2>
          <div style={{ ...styles.card, ...styles.cardPad }}>
            <p style={{ margin: 0, color: "#5a616c", fontSize: "1.02rem" }}>
              Begin with short phrases and listen for rhythm at 15 to 20 WPM.
              Increase speed as your recognition improves. This interactive
              learning tool provides structured daily practice to help you build
              real Morse proficiency.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Instant Text-to-Morse Conversion</h2>
          <p style={{ color: "#555" }}>
            Instantly convert any word or sentence into International Morse
            Code. Whether you’re learning the fundamentals or exploring
            historical communication, this educational translator provides fast,
            accurate results with clear audio feedback.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Accurate Morse-to-Text Translation
          </h2>
          <p style={{ color: "#555" }}>
            Paste or type Morse code to decode it back into readable text. The
            converter supports letters, numbers, and punctuation, making it
            ideal for both classroom learning and real-world radio practice.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Morse Translator with Audio Training
          </h2>
          <p style={{ color: "#555" }}>
            Learning Morse is easier when you can hear it. Use audio playback to
            listen to dits and dahs at adjustable speeds and tones. Training
            your ear through sound builds recognition, rhythm, and long-term
            memory.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Practice and Learn Anywhere</h2>
          <p style={{ color: "#555" }}>
            The MorseWords translator runs directly in your browser, no
            installation required. Translate text, practice decoding, and review
            results from desktop, tablet, or mobile. Always accessible when
            you’re ready to learn.
          </p>
        </section>
        {/* How it works */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>How the Morse Translator Works</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              The converter maps letters, numbers, and punctuation to
              International Morse Code and applies standard timing. One dit
              equals one unit, and a dah equals three. Spacing inside a letter
              is one unit, between letters is three, and between words is seven.
              This ensures both visual output and audio playback remain
              consistent and accurate.
            </p>
            <ol style={{ color: "#555", lineHeight: 1.65, paddingLeft: 18 }}>
              <li>
                Type text to create Morse instantly, or paste Morse to decode it
                back to text.
              </li>
              <li>
                Use the Convert buttons to lock in the result, then copy or
                listen with audio playback.
              </li>
              <li>
                Adjust WPM and tone to train your ear at comfortable learning
                speeds.
              </li>
            </ol>
          </div>
        </section>

        {/* Supported characters */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Supported Characters and Punctuation
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Letters A–Z and digits 0–9 are fully supported, along with the
              most common punctuation marks. Unsupported symbols are ignored to
              keep translations clean and readable.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#f7f8fb",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Letters and Numbers
                </div>
                <div
                  style={{
                    color: "#333",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                    fontSize: "0.95rem",
                  }}
                >
                  A–Z, 0–9
                </div>
              </div>
              <div
                style={{
                  background: "#f7f8fb",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Punctuation
                </div>
                <div
                  style={{
                    color: "#333",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                    fontSize: "0.95rem",
                  }}
                >
                  . , ? / ' ! - @ : ; = + ( ) "
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timing and spacing */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Timing and Spacing</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ul
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>
                Dit length equals one unit, dah length equals three units.
              </li>
              <li>The gap inside a character is one unit.</li>
              <li>The gap between letters is three units.</li>
              <li>The gap between words is seven units.</li>
            </ul>
            <p style={{ color: "#555", marginTop: 12 }}>
              For best decoding, keep three spaces between letters and seven
              between words when pasting Morse.
            </p>
          </div>
        </section>

        {/* Examples */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Examples to Try</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              {
                text: "HELLO WORLD",
                code: ".... . .-.. .-.. --- .-- --- .-. .-.. -..",
              },
              { text: "MORSE CODE", code: "-- --- .-. ... . -.-. --- -.. ." },
              { text: "GOOD LUCK", code: "--. --- --- -.. .-.. ..- -.- -.-" },
              { text: "CQ", code: "-.-. --.-" },
            ].map((ex, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  {ex.text}
                </div>
                <div
                  style={{
                    color: "#333",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                  }}
                >
                  {ex.code}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Troubleshooting</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ul
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>
                If output looks merged, add spaces: three between letters and
                seven between words.
              </li>
              <li>
                If a character does not appear, it is likely unsupported
                punctuation. Remove the symbol and try again.
              </li>
              <li>
                For clearer audio, try a tone near 600–700 Hz and start near 20
                WPM.
              </li>
            </ul>
          </div>
        </section>

        {/* History of Morse */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>A Brief History of Morse Code</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Morse code was developed in the 1830s by Samuel Morse and Alfred
              Vail as a method to transmit messages across telegraph lines. It
              soon became the backbone of long-distance communication, used in
              railroads, maritime signaling, aviation, and emergency services.
              Today, students and radio operators continue to learn and practice
              it through modern educational tools.
            </p>
          </div>
        </section>

        {/* Benefits of Learning */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Why Learn Morse Code?</h2>
          <div className="flex flex-col sm:flex-row gap-5">
            {[
              {
                title: "Emergency Use",
                desc: "SOS (... --- ...) remains a recognized international distress signal.",
              },
              {
                title: "Brain Training",
                desc: "Learning Morse strengthens memory, concentration, and auditory pattern recognition.",
              },
              {
                title: "Cultural Heritage",
                desc: "Preserve a communication system that helped shape modern technology and global contact.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  {item.title}
                </div>
                <p style={{ color: "#555", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Educational Uses */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Educational Uses of Morse Code</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Teachers often use Morse code to spark interest in history,
              physics, and language learning. From understanding sound waves to
              practicing rhythm and timing, Morse brings an interactive element
              into classrooms. Our translator and learning activities make it
              easy to introduce students to these timeless communication
              concepts.
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>MorseWords vs Other Translators</h2>
          <div className="flex flex-col gap-5 sm:flex-row">
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                MorseWords
              </div>
              <ul
                style={{
                  color: "#555",
                  margin: 0,
                  paddingLeft: 18,
                  lineHeight: 1.65,
                }}
              >
                <li>Text-to-Morse and Morse-to-text translation</li>
                <li>Audio playback for real listening practice</li>
                <li>Interactive learning modules for ongoing study</li>
              </ul>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Other Tools
              </div>
              <ul
                style={{
                  color: "#555",
                  margin: 0,
                  paddingLeft: 18,
                  lineHeight: 1.65,
                }}
              >
                <li>Basic text conversion only</li>
                <li>No structured learning or listening support</li>
                <li>Limited accuracy for punctuation and symbols</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mobile Friendly */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Mobile-Friendly Morse Learning</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              MorseWords is designed for both mobile and desktop browsers.
              Translate, listen, and practice from any device. Whether you have
              a minute on your phone or want to dedicate longer sessions on your
              computer, the same clean and accessible experience is always
              available.
            </p>
          </div>
        </section>

        {/* Advanced Practice */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Advanced Morse Practice</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Once you master basic letters and numbers, explore advanced
              practice sessions. The translator supports punctuation, symbols,
              and custom phrases, allowing you to simulate real radio messages
              and challenge your comprehension. Suitable for students,
              hobbyists, and radio operators refining their skills.
            </p>
          </div>
        </section>

        {/* Guided Learning */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Guided Morse Practice</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Learning Morse code can be engaging and goal-oriented. The
              MorseWords interactive training modules combine typing accuracy
              with listening exercises, creating a balanced way to study at your
              own pace. Track your progress, improve recognition, and build
              speed naturally through daily use.
            </p>
          </div>
        </section>

        {/* Typing & Speed Training */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Morse Typing and Speed Training</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Practice typing Morse while maintaining high accuracy. Adjustable
              WPM targets and real-time feedback help you build speed, rhythm,
              and confidence. This focused approach develops strong coordination
              between hearing and writing, leading to true Morse fluency.
            </p>
          </div>
        </section>

        {/* Real-Life Applications */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Real-World Applications of Morse Code
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Morse code continues to serve practical roles today, including
              emergency signaling, survival communication, and accessibility
              support for individuals with limited mobility or speech.
              Understanding Morse provides a versatile skill that connects
              history, technology, and communication practice.
            </p>
          </div>
        </section>
        {/* SEO Long-tail: Free & Online */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            Free Online Morse Translator and Interactive Learning Interface
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              MorseWords is completely free to use. No downloads or sign-ups are
              required. Translate text to Morse instantly, listen to clean
              audio, and practice using our structured interactive interface.
              Whether you are a beginner searching for “free Morse code
              practice” or an advanced learner seeking an accurate “online Morse
              translator,” this educational tool delivers reliable, high-quality
              results.
            </p>
          </div>
        </section>

        {/* Accessibility */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Accessible Morse Learning</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              MorseWords is designed with accessibility in mind. Clear fonts,
              high-contrast colors, and intuitive audio controls make it
              suitable for learners of all ages and abilities. The site supports
              both visual and auditory learning styles, and it is screen reader
              friendly to ensure inclusive access for all users. Following key
              WCAG principles, the interface promotes focus, simplicity, and
              comfort for every learning environment.
            </p>
          </div>
        </section>
        {/* Learning Path */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Learn Morse the Smart Way</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ol
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>Begin with the most common letters: E, T, A, I, N, and O.</li>
              <li>
                Add pairs with distinct rhythms, for example K and R, or M and
                S.
              </li>
              <li>
                Introduce numbers and punctuation once letters become automatic.
              </li>
              <li>
                Practice with short words and phrases to reinforce memory
                patterns.
              </li>
            </ol>
            <p style={{ color: "#555", marginTop: 12 }}>
              Keep character speed between 15 and 20 WPM and increase it
              gradually. Consistent pacing builds strong recognition for both
              reading and listening.
            </p>
          </div>
        </section>

        {/* Audio Training Tips */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Audio Training Tips</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ul
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>Use a tone near 600 to 700 Hz for comfortable listening.</li>
              <li>Keep practice sessions short to prevent fatigue.</li>
              <li>Focus on rhythm and timing rather than counting symbols.</li>
              <li>
                Repeat difficult letters in isolation, then embed them in words.
              </li>
            </ul>
          </div>
        </section>

        {/* About the Interactive Learning Interface */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            About the MorseWords Interactive Learning Interface
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              The MorseWords Interactive Learning Interface provides structured,
              daily practice. Decode Morse, type the correct word, and review
              feedback to improve over time. Each exercise emphasizes pattern
              recognition and speed through familiar words and short phrases.
            </p>
            <ul style={{ color: "#555", lineHeight: 1.65, paddingLeft: 18 }}>
              <li>Short daily exercises for consistent progress.</li>
              <li>Difficulty adapts naturally to your current level.</li>
              <li>Built on precise timing and spacing standards.</li>
            </ul>
          </div>
        </section>

        {/* How to Practice with the Interface */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>
            How to Practice with the MorseWords Training Interface
          </h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <ol
              style={{
                color: "#555",
                lineHeight: 1.65,
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <li>
                Listen to the audio or read the Morse sequence shown on screen.
              </li>
              <li>
                Type your answer in plain text. Use hints for assistance if
                needed.
              </li>
              <li>
                Check your results to compare your decoding accuracy and timing.
              </li>
            </ol>
            <p style={{ color: "#555", marginTop: 12 }}>
              Each round reinforces letter patterns and rhythm groups, helping
              you develop long-term recognition and fluency in Morse code.
            </p>
          </div>
        </section>

        {/* Interface Modes */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Interactive Learning Modes</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Daily Challenge
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                A focused, one-puzzle-a-day format designed to build steady
                improvement.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Practice Pack
              </div>
              <p style={{ color: "#555", margin: 0 }}>
                Unlimited drills covering letters, numbers, and commonly used
                words.
              </p>
            </div>
          </div>
        </section>

        {/* Progress and Goals */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Progress and Personal Goals</h2>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e6e8ef",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <p style={{ color: "#555", marginTop: 0 }}>
              Set small, measurable goals each week. For example, aim for two
              complete practice sessions per day, or increase your WPM while
              maintaining 95 percent accuracy. Small, consistent steps lead to
              meaningful progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 my-5">
              {[
                {
                  title: "Consistency",
                  desc: "Practice daily to strengthen recognition and retention.",
                },
                {
                  title: "Accuracy",
                  desc: "Keep error rates low before increasing speed.",
                },
                {
                  title: "Speed",
                  desc: "Gradually raise WPM once decoding feels natural.",
                },
              ].map((goal, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f7f8fb",
                    border: "1px solid #e6e8ef",
                    borderRadius: 6,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: 6,
                      color: "#0b2447",
                    }}
                  >
                    {goal.title}
                  </div>
                  <p style={{ color: "#555", margin: 0 }}>{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Puzzles */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>Sample Practice Exercises</h2>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Common Words
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                .... . .-.. .-.. --- .-- --- .-. .-.. -..
              </div>
              <p style={{ color: "#555", marginTop: 8, marginBottom: 0 }}>
                Decode this Morse sequence and check your translation accuracy.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 6,
                padding: 12,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
              >
                Numbers and Symbols
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                .---- ..--- ...-- .-.-.- --..-- ..--..
              </div>
              <p style={{ color: "#555", marginTop: 8, marginBottom: 0 }}>
                Practice decoding digits and punctuation through short,
                structured sets.
              </p>
            </div>
          </div>
        </section>

        <MorsePhraseLookupTable />

        {/* FAQ */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#0b2447" }}>MorseWords FAQ</h2>
          <div className="grid gap-5 sm:grid-cols-4 my-5">
            {[
              {
                q: "What speed should I start with?",
                a: "Begin around 15 to 20 WPM, then raise speed as accuracy improves.",
              },
              {
                q: "Does punctuation work?",
                a: "Yes. Period, comma, question mark, slash, quotes, hyphen, plus, equals, and more are supported.",
              },
              {
                q: "Can I listen without converting?",
                a: "Yes. Paste Morse and use audio playback at your chosen WPM and tone.",
              },
              {
                q: "Why are spaces required?",
                a: "Spacing separates symbols and words so the translator can decode correctly. Use three spaces between letters and seven between words.",
              },
              {
                q: "Do I need audio to practice learning Morse Code?",
                a: "No. You can decode by reading the code or by listening.",
              },
              {
                q: "How long is each round?",
                a: "Rounds are short so you can practice daily without fatigue.",
              },
              {
                q: "What should I focus on first?",
                a: "Focus on recognition and spacing. Speed will follow naturally.",
              },
              {
                q: "Is this good for beginners?",
                a: "Yes. The Interactive Learning Interface starts simple and grows with your skill.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e6e8ef",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  {faq.q}
                </div>
                <p style={{ color: "#555", margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} MorseWords. Educational Learning Tools
          for Morse code. -- .- -.. . ..--.- .-- .. - .... ..--.-💖!
        </footer>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </div>
  );
}
