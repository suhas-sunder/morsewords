import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "./morseUtils";
import useAudio, { type SoundPreset } from "./useAudio";

import styles from "~/client/components/the-quick-brown-fox-morse-code/styles";
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
  VibrateIcon,
} from "../../assets/svg/Icons";

interface Props {
  plainA: string;
  setPlainA: (v: string) => void;
  morseA: string;
  morseB: string;
  textB: string;
  setMorseB: (v: string) => void;
}

export default function TranslatorSectionsBasic({
  plainA,
  setPlainA,
  morseA,
  morseB,
  textB,
  setMorseB,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  // Unified tool direction
  const [direction, setDirection] = useState<"encode" | "decode">("encode");

  // Audio + mobile feedback settings (persisted)
  const player = useAudio();

  // Speed slider controls character speed directly.
  const [toneHz, setToneHz] = useState<number>(() => readNum("mw_hz", 600));
  const [volume, setVolume] = useState<number>(() => readNum("mw_vol", 0.75));
  const [soundOn, setSoundOn] = useState<boolean>(() =>
    readBool("mw_sound", true),
  );
  const [repeat, setRepeat] = useState<boolean>(() =>
    readBool("mw_repeat", false),
  );
  const [flash, setFlash] = useState<boolean>(() =>
    readBool("mw_flash", false),
  );
  const [vibrate, setVibrate] = useState<boolean>(() =>
    readBool("mw_vibrate", false),
  );

  // Ensure at least one feedback mode stays enabled.
  const setFeedback = React.useCallback(
    (key: "sound" | "repeat" | "flash" | "vibrate", next: boolean) => {
      const current = {
        sound: soundOn,
        repeat,
        flash,
        vibrate,
      };
      const updated = { ...current, [key]: next };
      const anyOn =
        updated.sound || updated.repeat || updated.flash || updated.vibrate;

      if (!anyOn) {
        // Refuse turning off the last enabled option. Default back to Sound.
        setSoundOn(true);
        setRepeat(false);
        setFlash(false);
        setVibrate(false);
        return;
      }

      if (key === "sound") setSoundOn(next);
      if (key === "repeat") setRepeat(next);
      if (key === "flash") setFlash(next);
      if (key === "vibrate") setVibrate(next);
    },
    [soundOn, repeat, flash, vibrate],
  );

  const [preset, setPreset] = useState<SoundPreset>(
    () => (readStr("mw_preset", "cw_radio") as SoundPreset) || "cw_radio",
  );
  const [charWpm, setCharWpm] = useState<number>(() =>
    readNum("mw_char_wpm", readNum("mw_wpm", 20)),
  );
  const [farnsworthWpm, setFarnsworthWpm] = useState<number>(() =>
    readNum("mw_fwpm", 20),
  );
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(() =>
    readBool("mw_adv_open", false),
  );

  useEffect(() => {
    writeNum("mw_wpm", charWpm);
    writeNum("mw_hz", toneHz);
    writeNum("mw_vol", volume);
    writeBool("mw_sound", soundOn);
    writeBool("mw_repeat", repeat);
    writeBool("mw_flash", flash);
    writeBool("mw_vibrate", vibrate);
    writeStr("mw_preset", preset);
    writeNum("mw_char_wpm", charWpm);
    writeNum("mw_fwpm", farnsworthWpm);
    writeBool("mw_adv_open", advancedOpen);
  }, [
    toneHz,
    volume,
    soundOn,
    repeat,
    flash,
    vibrate,
    preset,
    charWpm,
    farnsworthWpm,
    advancedOpen,
  ]);

  // Screen flash overlay (light feedback)
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
    // Always play Morse. If direction is decode, play the user's morse input.
    return direction === "encode" ? morseA : morseB;
  }, [direction, morseA, morseB]);

  // Copy helper
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

  // Validation
  const unsupportedPlain = useMemo(() => {
    return getUnsupportedTextCharacters(plainA);
  }, [plainA]);

  const morseInputIssues = useMemo(() => {
    const issues: string[] = [];
    if (!morseB) return issues;

    const { invalidChars, normalized } = normalizeMorseForDecoding(morseB);
    if (invalidChars.length) {
      issues.push(
        `Invalid character${invalidChars.length > 1 ? "s" : ""}: ${invalidChars.join(" ")}`,
      );
    }

    return issues;
  }, [morseB]);

  const applyExampleText = (text: string) => {
    // Examples should work from either direction without feeling like the UI "jumped".
    if (direction === "encode") {
      setPlainA(text);
      return;
    }
    // If the user is in Morse → Text, insert the Morse version into the Morse input.
    // This preserves intent (decode) while still making the chips useful.
    setMorseB(textToMorse(text));
  };

  const examples = [
    { label: "HELLO WORLD", set: () => applyExampleText("HELLO WORLD") },
    { label: "CQ", set: () => applyExampleText("CQ") },
    { label: "SOS", set: () => applyExampleText("SOS") },
    { label: "TEST 123", set: () => applyExampleText("TEST 123") },
  ];

  const canPlay = !!activeMorseForPlayback.trim();

  const handlePlay = async () => {
    if (!canPlay) return;
    // Prefer advanced character speed controls if set
    const effectiveChar = clampNum(charWpm, 5, 60);
    const effectiveF = clampNum(farnsworthWpm, 5, 60);

    await player.play({
      code: activeMorseForPlayback,
      wpm: effectiveChar,
      farnsworthWpm: effectiveF,
      hz: toneHz,
      volume: soundOn ? volume : 0,
      preset,
      repeat,
      flash,
      vibrate,
    });
  };

  const handleSaveAudio = async () => {
    if (!canPlay || !soundOn) return;
    try {
      const blob = await player.renderWav({
        code: activeMorseForPlayback,
        wpm: clampNum(charWpm, 5, 60),
        farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
        hz: toneHz,
        volume,
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

      // Fallback: download image + copy text
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

  return (
    <div className="mb-8 mt-4">
      {/* Light feedback overlay */}
      {flashOn && (
        <div
          className="fixed inset-0 z-[999] pointer-events-none"
          style={{ background: "rgba(255,255,255,0.65)" }}
        />
      )}

      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex flex-col justify-center items-center text-center">
          <h1 style={styles.h1} className="font-bold !text-2xl sm:!text-4xl">
            The Quick Brown Fox in Morse Code
          </h1>
          <p className="mt-2 text-sm sm:text-lg">
            Copy, play, and practice the classic pangram in International Morse.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 w-full sm:w-auto">
              <button
                onClick={() => setDirection("encode")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/2 sm:w-auto ${
                  direction === "encode"
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-gray-600 hover:bg-white"
                }`}
                aria-pressed={direction === "encode"}
              >
                Text → Morse
              </button>
              <button
                onClick={() => setDirection("decode")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/2 sm:w-auto ${
                  direction === "decode"
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-gray-600 hover:bg-white"
                }`}
                aria-pressed={direction === "decode"}
              >
                Morse → Text
              </button>
            </div>
            {examples.map((ex) => (
              <button
                key={ex.label}
                onClick={ex.set}
                className="border cursor-pointer border-[#e6e8ef] px-3 py-1.5 rounded-full text-sm hover:bg-gray-50 active:scale-95 transition"
              >
                Try “{ex.label}”
              </button>
            ))}
            <button
              onClick={handleSwap}
              className="sm:ml-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer active:scale-95 transition"
              title="Swap direction"
            >
              <span className="text-sm font-semibold text-neutral-900">
                Swap
              </span>
              <span aria-hidden className="text-gray-500">
                ⇄
              </span>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor={liveInputId} className="font-semibold">
                {inputLabel}
              </label>
              <textarea
                id={liveInputId}
                className="w-full mt-2 border rounded-md p-3 font-mono h-44 outline-sky-500 border-sky-500"
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
                autoCapitalize={direction === "encode" ? "characters" : "off"}
                autoCorrect="off"
                spellCheck={false}
              />
              {direction === "encode" &&
                Object.keys(unsupportedPlain).length > 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    Unsupported:{" "}
                    {Object.entries(unsupportedPlain)
                      .map(([ch, n]) => `${ch}×${n}`)
                      .join(", ")}{" "}
                    (ignored)
                  </p>
                )}
              {direction === "decode" && morseInputIssues.length > 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  {morseInputIssues.join(" ")}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="mw_output" className="font-semibold">
                {outputLabel}
              </label>
              <textarea
                id="mw_output"
                className="w-full mt-2 rounded-md p-3 font-mono h-44 bg-sky-50 outline-sky-500 border-sky-500"
                value={outputValue}
                readOnly
                placeholder={
                  direction === "encode" ? "... --- ..." : "Example: SOS"
                }
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center  gap-2">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => handleCopy(outputValue, "output")}
                disabled={!outputValue}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md font-semibold active:scale-95 transition ${
                  outputValue
                    ? "bg-neutral-900 hover:bg-neutral-800 text-sky-200 hover:text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                <CopyIcon size={18} title="Copy output" />
                <span>Copy Output</span>
              </button>

              <button
                onClick={handleShare}
                disabled={!outputValue}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-md font-semibold active:scale-95 transition border ${
                  outputValue
                    ? "border-neutral-900 text-neutral-900 hover:bg-gray-50"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShareIcon size={18} title="Share output" />
                <span>Share</span>
              </button>

              {copied === "output" && (
                <p className="text-sm text-green-600">Copied</p>
              )}
              {copied === "share" && (
                <p className="text-sm text-green-600">
                  Saved image and copied text
                </p>
              )}
            </div>

            <span className="sm:ml-auto text-sm text-gray-500">
              3 spaces = letters, 7 spaces = words. “/” also works for words.
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
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
              className={`flex justify-center items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition ${
                player.state === "playing"
                  ? player.isSupported
                    ? "border border-neutral-900 text-neutral-900 hover:bg-gray-50"
                    : "border border-gray-200 text-gray-400 cursor-not-allowed"
                  : canPlay && player.isSupported
                    ? "bg-neutral-900 text-sky-200 hover:bg-neutral-800 hover:text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {player.state === "playing" ? (
                <PauseIcon size={22} title="Pause timer" />
              ) : (
                <PlayIcon
                  size={22}
                  title={
                    player.state === "paused" ? "Resume timer" : "Start timer"
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
              onClick={player.stop}
              disabled={!player.isSupported || player.state === "idle"}
              className={`flex justify-center items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition border ${
                player.isSupported && player.state !== "idle"
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <StopIcon size={22} title="Stop timer" />
              <span>Stop</span>
            </button>
            <button
              onClick={handleSaveAudio}
              disabled={!canPlay || !soundOn}
              className={`flex justify-center items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition border ${
                canPlay && soundOn
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <SaveIcon size={22} title="Save audio" />
              <span>Save Audio</span>
            </button>
          </div>

          {/* Primary actions */}
          <div className="flex flex-col gap-3">
            {/* Audio controls */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900">
                    Playback Settings
                  </h3>
                  <span className="text-sm text-gray-600">
                    {player.isSupported
                      ? player.state === "idle"
                        ? "Ready"
                        : player.state
                      : "Audio unavailable"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                <div className="flex flex-wrap gap-2">
                  <TogglePill
                    label="Sound"
                    checked={soundOn}
                    onChange={(v) => setFeedback("sound", v)}
                    icon={<SoundIcon size={16} title="Sound" />}
                  />

                  <TogglePill
                    label="Repeat"
                    checked={repeat}
                    onChange={(v) => setFeedback("repeat", v)}
                    icon={<LoopIcon size={16} title="Repeat" />}
                  />

                  <TogglePill
                    label="Flash Light"
                    checked={flash}
                    onChange={(v) => setFeedback("flash", v)}
                    icon={<LightBulbIcon size={16} title="Light" />}
                  />

                  <TogglePill
                    label="Vibrate"
                    checked={vibrate}
                    onChange={(v) => setFeedback("vibrate", v)}
                    icon={<VibrateIcon size={16} title="Vibrate" />}
                  />
                </div>

                <button
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer active:scale-95 transition"
                  aria-expanded={advancedOpen}
                >
                  <span className="text-sm font-semibold text-neutral-900">
                    Advanced settings
                  </span>
                  <span aria-hidden className="text-gray-500">
                    {advancedOpen ? "▴" : "▾"}
                  </span>
                </button>

                {advancedOpen && (
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">
                          Sound type
                        </label>
                        <select
                          value={preset}
                          onChange={(e) =>
                            setPreset(e.target.value as SoundPreset)
                          }
                          disabled={!soundOn}
                          className={`mt-1 w-full border rounded-xl p-2 bg-white hover:bg-gray-50 ${
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

                    <p className="text-xs text-gray-600">
                      Tip: set a higher <strong>Character speed</strong> and a
                      lower <strong>Farnsworth</strong> to keep dits/dahs crisp
                      while adding extra spacing between characters and words.
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border cursor-pointer active:scale-95 transition ${
        checked
          ? "border-neutral-900 bg-neutral-900 text-sky-200 hover:bg-neutral-800 hover:text-white"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
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
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-sm text-gray-600">
          {value} {unit}
        </span>
      </div>
      {help && <p className="text-xs text-gray-500 mt-0.5">{help}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{ accentColor: "#38bdf8" }}
        className={`w-full mt-2 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-full`}
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
      // Keep the card clean and predictable.
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
      // Make word gaps readable in a share card
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

      // If the token itself is too long, hard-wrap it.
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
  const cardPaddingTop = 60;
  const cardPaddingBottom = 60;
  const cardX = 60;
  const cardY = 60;
  const cardWidth = 1080;

  const inputLabelY = 245;
  const inputTextY = 285;
  const outputLabelY = inputTextY + inLines.length * lineHeight + 70;
  const outputTextY = outputLabelY + 40;
  const outputBlockBottom =
    outputTextY + Math.max(0, outLines.length - 1) * lineHeight;

  // Place footer below content, then grow the SVG if needed.
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
