import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import useAudio, { type SoundPreset } from "~/client/components/shared/useAudio";

import styles from "~/client/components/shared/pageStyles";
import {
  CopyIcon,
  LightBulbIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  SaveIcon,
  ShareIcon,
  SoundIcon,
  StopIcon,
} from "../../assets/svg/Icons";

interface Props {
  plainA: string;
  setPlainA: (v: string) => void;
  morseA: string;
  morseB: string;
  textB: string;
  setMorseB: (v: string) => void;
  title?: string;
  subtitle?: React.ReactNode;
  examples?: string[];
  plainValidationValue?: string;
}

export default function TranslatorSectionsBasic({
  plainA,
  setPlainA,
  morseA,
  morseB,
  textB,
  setMorseB,
  title = "Morse Code Translator",
  subtitle,
  examples: exampleValues,
  plainValidationValue,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [direction, setDirection] = useState<"encode" | "decode">("encode");

  const player = useAudio();

  const [isHydrated, setIsHydrated] = useState(false);

  const [toneHz, setToneHz] = useState<number>(600);
  const [volume, setVolume] = useState<number>(0.75);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [preset, setPreset] = useState<SoundPreset>("cw_radio");
  const [charWpm, setCharWpm] = useState<number>(20);
  const [farnsworthWpm, setFarnsworthWpm] = useState<number>(20);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  useEffect(() => {
    const nextTone = readNum("mw_hz", 600);
    const nextVol = readNum("mw_vol", 0.75);
    const nextSound = readBool("mw_sound", true);
    const nextRepeat = readBool("mw_repeat", false);
    const nextFlash = readBool("mw_flash", false);
    const nextPreset =
      (readStr("mw_preset", "cw_radio") as SoundPreset) || "cw_radio";

    const legacyWpm = readNum("mw_wpm", 20);
    const nextChar = readNum("mw_char_wpm", legacyWpm);
    const nextFwpm = readNum("mw_fwpm", 20);
    const nextAdv = readBool("mw_adv_open", false);

    setToneHz(nextTone);
    setVolume(nextVol);
    setPreset(nextPreset);
    setCharWpm(nextChar);
    setFarnsworthWpm(nextFwpm);
    setAdvancedOpen(nextAdv);

    setSoundOn(nextSound);
    setRepeat(nextRepeat);
    setFlash(nextFlash);

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    writeNum("mw_wpm", charWpm);
    writeNum("mw_hz", toneHz);
    writeNum("mw_vol", volume);
    writeBool("mw_sound", soundOn);
    writeBool("mw_repeat", repeat);
    writeBool("mw_flash", flash);
    writeStr("mw_preset", preset);
    writeNum("mw_char_wpm", charWpm);
    writeNum("mw_fwpm", farnsworthWpm);
    writeBool("mw_adv_open", advancedOpen);
  }, [
    isHydrated,
    toneHz,
    volume,
    soundOn,
    repeat,
    flash,
    preset,
    charWpm,
    farnsworthWpm,
    advancedOpen,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(max-width: 1100px)");
    const update = () => setIsMobile(!!mq?.matches);
    update();

    if (!mq) return;

    try {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    } catch {
      mq.addListener?.(update);
      return () => mq.removeListener?.(update);
    }
  }, []);

  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      if (!flash) return;
      const ms = (e as CustomEvent).detail?.ms ?? 80;
      setFlashOn(true);
      window.setTimeout(() => setFlashOn(false), Math.max(30, ms));
    };

    window.addEventListener("morsewords:flash", handler as any);
    return () => window.removeEventListener("morsewords:flash", handler as any);
  }, [flash]);

  const liveInputId = direction === "encode" ? "plainA" : "morseB";
  const inputLabel = direction === "encode" ? "Input (Text)" : "Input (Morse)";
  const outputLabel =
    direction === "encode" ? "Output (Morse)" : "Output (Text)";
  const inputValue = direction === "encode" ? plainA : morseB;
  const outputValue = direction === "encode" ? morseA : textB;

  const activeMorseForPlayback = useMemo(() => {
    return direction === "encode" ? morseA : morseB;
  }, [direction, morseA, morseB]);

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

  const unsupportedPlain = useMemo(() => {
    return getUnsupportedTextCharacters(plainValidationValue ?? plainA);
  }, [plainA, plainValidationValue]);

  const morseInputIssues = useMemo(() => {
    const issues: string[] = [];
    if (!morseB) return issues;

    const { invalidChars } = normalizeMorseForDecoding(morseB);
    if (invalidChars.length) {
      issues.push(
        `Invalid character${invalidChars.length > 1 ? "s" : ""}: ${invalidChars.join(" ")}`,
      );
    }

    return issues;
  }, [morseB]);

  const applyExampleText = (text: string) => {
    if (direction === "encode") {
      setPlainA(text);
      return;
    }

    setMorseB(textToMorse(text));
  };

  const examples = (
    exampleValues ?? ["I love Morse code", "HELLO WORLD", "CQ", "SOS", "TEST 123"]
  ).map((text) => ({
    label: text,
    set: () => applyExampleText(text),
  }));

  const canPlay = !!activeMorseForPlayback.trim();

  const handlePlay = async () => {
    if (!canPlay) return;

    const effectiveChar = clampNum(charWpm, 5, 60);
    const effectiveF = clampNum(farnsworthWpm, 5, 60);

    await player.play({
      code: activeMorseForPlayback,
      wpm: effectiveChar,
      farnsworthWpm: effectiveF,
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash,
    });
  };

  useEffect(() => {
    (player as any)?.setLiveOptions?.({
      code: activeMorseForPlayback,
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash,
      vibrate: false,
    });
  }, [
    activeMorseForPlayback,
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    soundOn,
    preset,
    repeat,
    flash,
    player,
  ]);

  const handleSaveAudio = async () => {
    if (!canPlay || !soundOn) return;

    try {
      const blob = await player.renderWav({
        code: activeMorseForPlayback,
        wpm: clampNum(charWpm, 5, 60),
        farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
        hz: toneHz,
        volume,
        soundEnabled: true,
        preset,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "morsewords.wav";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Save audio failed", e);
    }
  };

  const handleShare = async () => {
    try {
      const png = await makeShareImagePng({
        direction,
        input: inputValue,
        output: outputValue,
      });

      const file = new File([png], "morsewords.png", { type: "image/png" });
      const shareText =
        direction === "encode"
          ? `Text → Morse\n\n${inputValue}\n\n${outputValue}`
          : `Morse → Text\n\n${inputValue}\n\n${outputValue}`;

      const canShareFiles =
        typeof navigator !== "undefined" &&
        !!(navigator as any).share &&
        !!(navigator as any).canShare &&
        (navigator as any).canShare({ files: [file] });

      if (canShareFiles) {
        await (navigator as any).share({
          title: "MorseWords",
          text: shareText,
          files: [file],
        });
        return;
      }

      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = "morsewords.png";
      a.click();
      URL.revokeObjectURL(url);

      await navigator.clipboard.writeText(shareText);
      setCopied("share");
      setTimeout(() => setCopied(null), 1400);
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  const handleSwap = () => {
    setDirection((d) => (d === "encode" ? "decode" : "encode"));
  };

  const playbackStatus = player.isSupported
    ? player.state === "idle"
      ? "Ready"
      : player.state
    : "Audio unavailable";

  return (
    <div className="mb-8">
      {flashOn && (
        <div
          className="pointer-events-none fixed inset-0 z-[999]"
          style={{ background: "rgba(255,255,255,0.65)" }}
        />
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-sky-800" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-sky-900">
              Live translator
            </span>
          </div>

          <h1
            style={styles.h1}
            className="mt-2 !text-[2.2rem] font-extrabold leading-[1.05] tracking-tight text-sky-950 sm:!text-[3rem]"
          >
            {title}
          </h1>

          {subtitle ?? (
            <p className="mt-2 max-w-none text-base leading-7 text-slate-700 sm:text-[1.08rem] xl:whitespace-nowrap">
              Encode text into Morse, decode Morse back to text, and play the signal with timing controls.
            </p>
          )}
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-4">
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="inline-flex w-full rounded-lg border border-slate-200 bg-white p-1 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setDirection("encode")}
                    className={`w-1/2 cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition sm:w-auto ${
                      direction === "encode"
                        ? "bg-sky-50 text-sky-950 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                    aria-pressed={direction === "encode"}
                  >
                    Text → Morse
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirection("decode")}
                    className={`w-1/2 cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition sm:w-auto ${
                      direction === "decode"
                        ? "bg-sky-50 text-sky-950 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                    aria-pressed={direction === "decode"}
                  >
                    Morse → Text
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(isMobile ? examples.slice(0, 1) : examples).map((ex) => (
                    <button
                      type="button"
                      key={ex.label}
                      onClick={ex.set}
                      className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-950 active:scale-95"
                    >
                      Try “{ex.label}”
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSwap}
                  className="hidden cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 active:scale-95 md:flex lg:ml-auto"
                  title="Swap direction"
                >
                  <span>Swap</span>
                  <span aria-hidden className="text-slate-500">
                    ⇄
                  </span>
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <label
                    htmlFor={liveInputId}
                    className="text-sm font-extrabold text-sky-950"
                  >
                    {inputLabel}
                  </label>

                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Source
                  </span>
                </div>

                <textarea
                  id={liveInputId}
                  className="min-h-[10rem] w-full resize-y border-0 bg-white p-4 font-mono text-slate-950 outline-none focus:ring-0"
                  value={inputValue}
                  onChange={(e) =>
                    direction === "encode"
                      ? setPlainA(e.target.value)
                      : setMorseB(e.target.value)
                  }
                  placeholder={
                    direction === "encode"
                      ? "Example: Hello World"
                      : "Example: ... --- ..."
                  }
                  autoCapitalize={
                    direction === "encode" ? "characters" : "off"
                  }
                  autoCorrect="off"
                  spellCheck={false}
                />

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (direction === "encode") setPlainA("");
                      else setMorseB("");
                    }}
                    className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                  >
                    Clear input
                  </button>

                  {direction === "encode" &&
                    Object.keys(unsupportedPlain).length > 0 && (
                      <p className="text-xs font-medium text-amber-700">
                        Unsupported:{" "}
                        {Object.entries(unsupportedPlain)
                          .map(([ch, n]) => `${ch}×${n}`)
                          .join(", ")}{" "}
                        (ignored)
                      </p>
                    )}

                  {direction === "decode" && morseInputIssues.length > 0 && (
                    <p className="text-xs font-medium text-amber-700">
                      {morseInputIssues.join(" ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-sky-100 bg-sky-50/70">
                <div className="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50 px-4 py-3">
                  <label
                    htmlFor="mw_output"
                    className="text-sm font-extrabold text-sky-950"
                  >
                    {outputLabel}
                  </label>

                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-sky-800">
                    Result
                  </span>
                </div>

                <textarea
                  id="mw_output"
                  className="min-h-[10rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0"
                  value={outputValue}
                  readOnly
                  placeholder={
                    direction === "encode" ? "... --- ..." : "Example: SOS"
                  }
                />

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sky-100 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (direction === "encode") setPlainA("");
                      else setMorseB("");
                    }}
                    className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                  >
                    Clear output
                  </button>

                  <span className="text-sm text-slate-500">
                    3 spaces = letters. 7 spaces = words.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(outputValue, "output")}
                  disabled={!outputValue}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-semibold transition active:scale-95 ${
                    outputValue
                      ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
                >
                  <CopyIcon size={18} title="Copy output" />
                  <span>Copy Output</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!outputValue}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 font-semibold transition active:scale-95 ${
                    outputValue
                      ? "border-slate-300 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50"
                      : "cursor-not-allowed border-slate-200 text-slate-400"
                  }`}
                >
                  <ShareIcon size={18} title="Share output" />
                  <span>Share</span>
                </button>

                {copied === "output" && (
                  <p className="text-sm font-semibold text-green-700">Copied</p>
                )}

                {copied === "share" && (
                  <p className="text-sm font-semibold text-green-700">
                    Saved image and copied text
                  </p>
                )}
              </div>

              <span className="text-sm leading-relaxed text-slate-500 sm:ml-auto">
                “/” also works as a word separator.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  if (player.state === "idle") {
                    handlePlay();
                  } else if (player.state === "playing") {
                    player.pause();
                  } else if (player.state === "paused") {
                    player.resume();
                  }
                }}
                disabled={
                  player.state === "playing"
                    ? !player.isSupported
                    : !canPlay || !player.isSupported
                }
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-semibold transition active:scale-95 ${
                  player.state === "playing"
                    ? player.isSupported
                      ? "border border-slate-900 bg-white text-slate-950 hover:bg-slate-50"
                      : "cursor-not-allowed border border-slate-200 text-slate-400"
                    : canPlay && player.isSupported
                      ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
              >
                {player.state === "playing" ? (
                  <PauseIcon size={22} title="Pause timer" />
                ) : (
                  <PlayIcon
                    size={22}
                    title={
                      player.state === "paused"
                        ? "Resume timer"
                        : "Start timer"
                    }
                  />
                )}

                <span>
                  {player.state === "playing"
                    ? "Pause"
                    : player.state === "paused"
                      ? "Resume"
                      : "Play"}
                </span>
              </button>

              <button
                type="button"
                onClick={player.stop}
                disabled={!player.isSupported || player.state === "idle"}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 font-semibold transition active:scale-95 ${
                  player.isSupported && player.state !== "idle"
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "cursor-not-allowed border-slate-200 text-slate-400"
                }`}
              >
                <StopIcon size={22} title="Stop timer" />
                <span>Stop</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAudio}
                disabled={!canPlay || !soundOn}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 font-semibold transition active:scale-95 ${
                  canPlay && soundOn
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "cursor-not-allowed border-slate-200 text-slate-400"
                }`}
              >
                <SaveIcon size={22} title="Save audio" />
                <span>Save Audio</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-extrabold text-sky-950">
                    Playback Settings
                  </h3>

                  <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    {playbackStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <SliderRow
                    label="Speed"
                    value={charWpm}
                    min={5}
                    max={40}
                    step={1}
                    unit="WPM"
                    onChange={setCharWpm}
                  />
                  <SliderRow
                    label="Pitch"
                    value={toneHz}
                    min={300}
                    max={900}
                    step={10}
                    unit="Hz"
                    onChange={setToneHz}
                    disabled={!soundOn}
                  />
                  <SliderRow
                    label="Volume"
                    value={Math.round(volume * 100)}
                    min={0}
                    max={100}
                    step={5}
                    unit="%"
                    onChange={(v) => setVolume(v / 100)}
                    disabled={!soundOn}
                  />
                </div>

                <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                  <TogglePill
                    label="Sound"
                    checked={soundOn}
                    onChange={setSoundOn}
                    icon={<SoundIcon size={16} title="Sound" />}
                  />

                  <TogglePill
                    label="Repeat"
                    checked={repeat}
                    onChange={setRepeat}
                    icon={<LoopIcon size={16} title="Repeat" />}
                  />

                  <TogglePill
                    label="Flash Light"
                    checked={flash}
                    onChange={setFlash}
                    icon={<LightBulbIcon size={16} title="Light" />}
                  />
                </div>

                {flash && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <div className="font-bold">Strobe warning</div>
                    <div className="mt-1">
                      Flashing light may trigger seizures for people with
                      photosensitive epilepsy. Use with caution.
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-sky-300 hover:bg-sky-50 active:scale-95 sm:w-auto"
                  aria-expanded={advancedOpen}
                >
                  <span className="text-sm font-semibold text-slate-900">
                    Advanced settings
                  </span>
                  <span aria-hidden className="text-slate-500">
                    {advancedOpen ? "▴" : "▾"}
                  </span>
                </button>

                {advancedOpen && (
                  <div className="grid gap-4 border-t border-slate-200 pt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-700">
                          Sound type
                        </label>

                        <select
                          value={preset}
                          onChange={(e) =>
                            setPreset(e.target.value as SoundPreset)
                          }
                          disabled={!soundOn}
                          className={`mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 transition hover:bg-slate-50 ${
                            soundOn
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          }`}
                        >
                          <option value="cw_radio">CW radio tone</option>
                          <option value="smooth_sine">Smooth sine</option>
                          <option value="bright_square">Bright square</option>
                          <option value="telegraph_sounder">
                            Telegraph sounder
                          </option>
                        </select>
                      </div>

                      <SliderRow
                        label="Farnsworth"
                        value={farnsworthWpm}
                        min={5}
                        max={50}
                        step={1}
                        unit="WPM"
                        onChange={setFarnsworthWpm}
                        help="Slows spacing only."
                      />
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600">
                      Tip: set a higher <strong>Character speed</strong> and a
                      lower <strong>Farnsworth</strong> to keep dits and dahs
                      crisp while adding extra spacing between characters and
                      words.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TogglePill({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${
        checked
          ? "border-slate-950 bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-950"
      }`}
      aria-pressed={checked}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  help,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  help?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>

      {help && <p className="mt-0.5 text-xs text-slate-500">{help}</p>}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{ accentColor: "#38bdf8" }}
        className={`mt-2 w-full rounded-full focus:outline-none focus:ring-2 focus:ring-sky-300 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      />
    </div>
  );
}

function clampNum(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function readNum(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function readBool(key: string, fallback: boolean) {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  if (raw === "1") return true;
  if (raw === "0") return false;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return fallback;
}

function readStr(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

function writeNum(key: string, value: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

function writeBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // ignore
  }
}

function writeStr(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

async function makeShareImagePng({
  direction,
  input,
  output,
}: {
  direction: "encode" | "decode";
  input: string;
  output: string;
}): Promise<Blob> {
  const title = direction === "encode" ? "Text → Morse" : "Morse → Text";

  const escapeXml = (s: string) =>
    (s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const normalizeForCard = (s: string) =>
    (s || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, " / ")
      .replace(/\s+/g, " ")
      .trim();

  const normalizeMorseForCard = (s: string) =>
    (s || "")
      .replace(/[·•∙]/g, ".")
      .replace(/[–—−]/g, "-")
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, "       ")
      .replace(/\s*\/\s*/g, "       ")
      .replace(/\s{7,}/g, " / ")
      .replace(/\s{3,}/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const wrapLines = (
    s: string,
    maxChars: number,
    maxLines: number,
    mode: "text" | "morse" = "text",
  ) => {
    const text =
      mode === "morse" ? normalizeMorseForCard(s) : normalizeForCard(s);
    if (!text) return ["—"];

    const tokens = text.split(" ");
    const lines: string[] = [];
    let current = "";

    const pushCurrent = () => {
      if (current) lines.push(current);
      current = "";
    };

    for (const tok of tokens) {
      if (!tok) continue;

      const candidate = current ? `${current} ${tok}` : tok;

      if (candidate.length <= maxChars) {
        current = candidate;
        continue;
      }

      if (!current && tok.length > maxChars) {
        let t = tok;
        while (t.length > maxChars && lines.length < maxLines) {
          lines.push(t.slice(0, maxChars));
          t = t.slice(maxChars);
        }
        current = t;
        continue;
      }

      pushCurrent();
      current = tok;

      if (lines.length >= maxLines) break;
    }

    if (lines.length < maxLines) pushCurrent();

    const capped = lines.slice(0, maxLines);
    const wasTruncated =
      tokens.join(" ").length > capped.join(" ").length + 3 ||
      lines.length > maxLines;

    if (wasTruncated && capped.length) {
      const last = capped[capped.length - 1];
      capped[capped.length - 1] =
        last.length >= maxChars
          ? `${last.slice(0, Math.max(0, maxChars - 1))}…`
          : `${last}…`;
    }

    return capped.length ? capped : ["—"];
  };

  const maxLen = 25000;
  const inLines = wrapLines(input.slice(0, maxLen), 68, 18, "text");
  const outLines = wrapLines(
    output.slice(0, maxLen),
    68,
    20,
    direction === "encode" ? "morse" : "text",
  );

  const lineHeight = 30;
  const cardPaddingBottom = 60;
  const cardX = 60;
  const cardY = 60;
  const cardWidth = 1080;

  const inputTextY = 285;
  const outputLabelY = inputTextY + inLines.length * lineHeight + 70;
  const outputTextY = outputLabelY + 40;
  const outputBlockBottom =
    outputTextY + Math.max(0, outLines.length - 1) * lineHeight;

  const footerY = outputBlockBottom + 70;
  const desiredHeight = footerY + cardPaddingBottom;
  const svgHeight = Math.min(2000, Math.max(630, desiredHeight));
  const cardHeight = svgHeight - cardY * 2;
  const footerTextY = cardY + cardHeight - 50;

  const inTspans = inLines
    .map(
      (l, i) =>
        `<tspan x="100" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`,
    )
    .join("");

  const outTspans = outLines
    .map(
      (l, i) =>
        `<tspan x="100" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`,
    )
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${svgHeight}">
  <defs>
    <style>
      .bg { fill: #f8fafc; }
      .card { fill: #ffffff; stroke: #e5e7eb; stroke-width: 2; }
      .h1 { font: 700 42px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif; fill: #0b2447; }
      .muted { font: 600 18px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif; fill: #64748b; }
      .label { font: 700 20px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial,sans-serif; fill: #334155; }
      .mono { font: 600 24px ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; fill: #0f172a; }
    </style>
  </defs>
  <rect class="bg" x="0" y="0" width="1200" height="${svgHeight}"/>
  <rect class="card" x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="28"/>
  <text class="h1" x="100" y="140">MorseWords</text>
  <text class="muted" x="100" y="185">${escapeXml(title)}</text>

  <text class="label" x="100" y="245">Input</text>
  <text class="mono" x="100" y="${inputTextY}">${inTspans}</text>

  <text class="label" x="100" y="${outputLabelY}">Output</text>
  <text class="mono" x="100" y="${outputTextY}">${outTspans}</text>

  <text class="muted" x="100" y="${footerTextY}">morsewords.com</text>
</svg>`;

  const svgBlob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = svgHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0);

  const png: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))),
      "image/png",
    );
  });

  URL.revokeObjectURL(url);
  return png;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export type { Props };