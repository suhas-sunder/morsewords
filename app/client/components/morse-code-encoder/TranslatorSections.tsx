import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TEXT_TO_MORSE } from "./morseMaps";

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

export default function TranslatorSections({
  plainA,
  setPlainA,
  morseA,
  morseB,
  textB,
  setMorseB,
  wpm,
  freq,
  playMorse,
  stop,
}: Props) {
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

  // (Conversion is handled upstream; this component is UI-only.)

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
  const ALLOWED = useMemo(() => new Set(Object.keys(TEXT_TO_MORSE)), []);
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
          `Invalid char${bad.length > 1 ? "s" : ""}: ${[...new Set(bad)].join(" ")}`,
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
        <h2 className="text-2xl font-bold text-neutral-900">Text → Morse</h2>

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
              className="w-full border rounded-md p-3 font-mono h-40 focus:ring-2 focus:ring-neutral-900"
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
                  ? "bg-neutral-900 hover:bg-neutral-800 hover:text-white"
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
        <h2 className="text-2xl font-bold text-neutral-900">Morse → Text</h2>

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
              className="w-full border rounded-md p-3 font-mono h-40 focus:ring-2 focus:ring-neutral-900"
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
                  ? "bg-neutral-900 hover:bg-neutral-800 hover:text-white"
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

export type { Props };
