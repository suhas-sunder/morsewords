import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TEXT_TO_MORSE } from "~/client/components/shared/morseMaps";

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
 const bad = morseB.replace(/[.\-\s/]/g,"");
 if (bad.length)
 issues.push(
 `Invalid char${bad.length > 1 ?"s":""}: ${[...new Set(bad)].join("")}`,
 );
 if (/\s{2,}/.test(morseB) && !/\s{3,}/.test(morseB))
 issues.push("Tip: use 3 spaces between letters, 7 between words.");
 }
 return issues;
 }, [morseB]);

 const examples = [
 {
 label:"HELLO_WORLD",
 morse:".... . .-.. .-.. --- ..--.- .-- --- .-. .-.. -..",
 },
 { label:"CQ", morse:"-.-. --.-"},
 { label:"SOS", morse:"... --- ..."},
 ];

 const morseExamplesB = [
 { label:"HI", morse:".... .."},
 { label:"OK", morse:"--- -.-"},
 { label:"FUN", morse:"..-. ..- -."},
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
 <section className="mw-static-panel space-y-4 rounded-2xl bg-[#fffdf8] p-6">
 <h2 className="text-2xl font-bold text-neutral-900">Text → Morse</h2>

 <div className="flex flex-wrap gap-2 mt-2">
 {examples.map((ex) => (
 <button
 key={ex.label}
 onClick={() => setPlainA(ex.label)}
 className="cursor-pointer rounded-full bg-white px-3 py-1 text-sm transition hover:bg-slate-900 hover:text-sky-100 active:scale-95">
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
 id="plainA" className="w-full rounded-md p-3 font-mono h-40 focus:ring-2 focus:ring-neutral-900" value={plainA}
 onChange={(e) => setPlainA(e.target.value)}
 placeholder="Example: Hello World" autoCapitalize="characters" autoCorrect="off" spellCheck={false}
 />
 {Object.keys(unsupportedPlain).length > 0 && (
 <p className="mt-2 text-xs text-amber-600">
 Unsupported:{""}
 {Object.entries(unsupportedPlain)
 .map(([ch, n]) => `${ch}×${n}`)
 .join(",")}{""}
 (ignored)
 </p>
 )}
 </div>

 <div>
 <label htmlFor="morseA" className="font-semibold">
 Morse Output
 </label>
 <textarea
 id="morseA" className="w-full rounded-md bg-[#fffdf8] p-3 font-mono h-40" value={morseA}
 readOnly
 placeholder=".... . .-.. .-.. --- .-- --- .-. .-.. -.."/>
 </div>
 </div>

 <div className="flex flex-col md:flex-row md:items-center gap-2 relative">
 <div className="flex gap-2">
 <button
 onClick={() => handleCopy(morseA,"morseA")}
 disabled={!morseA}
 className={`px-4 py-2 cursor-pointer rounded-md font-semibold active:scale-95 transition ${
 morseA
 ?"bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white":"cursor-not-allowed bg-[#fffaf2] text-slate-400"}`}
 >
 📋 Copy Morse
 </button>
 <button
 onClick={() => morseA && handlePlay(morseA)}
 disabled={!morseA}
 className={`px-4 py-2 cursor-pointer rounded-md font-semibold active:scale-95 transition ${
 morseA
 ?"bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white":"cursor-not-allowed bg-[#fffaf2] text-slate-400"}`}
 >
 ▶ Play Audio
 </button>
 <button
 onClick={stop}
 className="cursor-pointer rounded-md bg-[#fffdf8] px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 active:scale-95">
 ⏹ Stop
 </button>
 </div>
 {copied ==="morseA"&& (
 <span className="absolute left-0 bottom-[-1.5rem] text-sm text-green-600 animate-fade">
 ✓ Copied!
 </span>
 )}
 <span className="ml-auto text-sm text-slate-500">
 3 spaces = letters, 7 spaces = words.
 </span>
 </div>
 </section>

 {/* MORSE → TEXT */}
 <section className="mw-static-panel space-y-4 rounded-2xl bg-[#fffdf8] p-6">
 <h2 className="text-2xl font-bold text-neutral-900">Morse → Text</h2>

 <div className="flex flex-wrap gap-2 mt-2">
 {morseExamplesB.map((ex) => (
 <button
 key={ex.label}
 onClick={() => setMorseB(ex.morse)}
 className="cursor-pointer rounded-full bg-white px-3 py-1 text-sm transition hover:bg-slate-900 hover:text-sky-100 active:scale-95">
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
 id="morseB" className="w-full rounded-md p-3 font-mono h-40 focus:ring-2 focus:ring-neutral-900" value={morseB}
 onChange={(e) => setMorseB(e.target.value)}
 placeholder=".... . .-.. .-.. --- .-- --- .-. .-.. -.." spellCheck={false}
 />
 {morseInputIssues.length > 0 && (
 <p className="mt-2 text-xs text-amber-600">
 {morseInputIssues.join("")}
 </p>
 )}
 </div>

 <div>
 <label htmlFor="textB" className="font-semibold">
 Text Output
 </label>
 <textarea
 id="textB" className="w-full rounded-md bg-[#fffdf8] p-3 font-mono h-40" value={textB}
 readOnly
 placeholder="Example: Hello World"/>
 </div>
 </div>

 <div className="flex flex-col md:flex-row md:items-center gap-2 relative">
 <div className="flex gap-2">
 <button
 onClick={() => handleCopy(textB,"textB")}
 disabled={!textB}
 className={`px-4 py-2 rounded-md cursor-pointer font-semibold active:scale-95 transition ${
 textB
 ?"bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white":"cursor-not-allowed bg-[#fffaf2] text-slate-400"}`}
 >
 📋 Copy Text
 </button>
 <button
 onClick={() => morseB && handlePlay(morseB)}
 disabled={!morseB}
 className={`px-4 py-2 rounded-md cursor-pointer font-semibold active:scale-95 transition ${
 morseB
 ?"bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white":"cursor-not-allowed bg-[#fffaf2] text-slate-400"}`}
 >
 ▶ Play Audio
 </button>
 <button
 onClick={stop}
 className="cursor-pointer rounded-md bg-[#fffdf8] px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 active:scale-95">
 ⏹ Stop
 </button>
 </div>
 {copied ==="textB"&& (
 <span className="absolute left-0 bottom-[-1.5rem] text-sm text-green-600 animate-fade">
 ✓ Copied!
 </span>
 )}
 <span className="ml-auto text-sm text-slate-500">
 3 spaces = letters, 7 spaces = words.
 </span>
 </div>
 </section>
 </div>
 );
}

export type { Props };
