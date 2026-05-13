import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { readQueryPrefillValue } from "~/client/components/shared/queryPrefill";
import useAudio, { type SoundPreset } from "~/client/components/shared/useAudio";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import {
  ActionButton,
  ActionRow,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";

import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  LightBulbIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
  StopIcon,
  TrashIcon,
  TuneIcon,
  VolumeIcon,
  VolumeOffIcon,
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
  variant?: "default" | "home";
  quietInputFocus?: boolean;
  enableQueryPrefill?: boolean;
  preferredDirection?: "encode" | "decode";
}

const STROBE_WARNING_ID = "translator-strobe-warning";
const HOME_SOFT_CONTROL =
  "mw-button-home-soft bg-white/85 text-slate-800 hover:bg-slate-900 hover:text-sky-100";
const HOME_SOFT_CONTROL_DARK =
  "mw-button-home-soft-strong bg-white/88 text-slate-900 hover:bg-slate-900 hover:text-sky-100";
const HOME_DISABLED_CONTROL =
  "mw-button-disabled-light cursor-not-allowed bg-white/55 text-slate-400";
const SOFT_CONTROL = HOME_SOFT_CONTROL;
const SOFT_CONTROL_DARK = HOME_SOFT_CONTROL_DARK;
const DISABLED_CONTROL = HOME_DISABLED_CONTROL;
const ACTIVE_CONTROL =
  "mw-button-primary bg-slate-950 text-sky-100";
const SOFT_PANEL =
  "mw-input-panel overflow-hidden rounded-xl bg-white/88";
const DARK_PANEL =
  "mw-panel-dark overflow-hidden rounded-xl bg-slate-950";
const DARK_PANEL_BUTTON =
  "mw-button-dark-panel bg-slate-700/95 text-slate-100 hover:bg-slate-800 hover:text-white";
const DARK_PANEL_DISABLED =
  "mw-button-dark-panel-disabled cursor-not-allowed bg-slate-800/60 text-slate-500";

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
  variant = "default",
  quietInputFocus = false,
  enableQueryPrefill = false,
  preferredDirection = "encode",
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [direction, setDirection] = useState<"encode" | "decode">(
    preferredDirection,
  );
  const queryPrefillApplied = React.useRef(false);

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
    setToneHz(readNum("mw_hz", 600));
    setVolume(readNum("mw_vol", 0.75));
    setSoundOn(readBool("mw_sound", true));
    setRepeat(readBool("mw_repeat", false));
    setFlash(readBool("mw_flash", false));
    setPreset((readStr("mw_preset", "cw_radio") as SoundPreset) || "cw_radio");

    const legacyWpm = readNum("mw_wpm", 20);
    setCharWpm(readNum("mw_char_wpm", legacyWpm));
    setFarnsworthWpm(readNum("mw_fwpm", 20));
    setAdvancedOpen(readBool("mw_adv_open", false));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!enableQueryPrefill || queryPrefillApplied.current) return;
    queryPrefillApplied.current = true;
    if (typeof window === "undefined") return;

    const textParam = readQueryPrefillValue(window.location.search, "text");
    const morseParam = readQueryPrefillValue(window.location.search, "morse");

    if (textParam) {
      setDirection("encode");
      setPlainA(textParam);
      return;
    }

    if (morseParam) {
      setDirection("decode");
      setMorseB(morseParam);
    }
  }, [enableQueryPrefill, setMorseB, setPlainA]);

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

    const didCopy = await copyTextToClipboard(text);
    if (!didCopy) return;
    setCopied(label);
    setTimeout(() => setCopied(null), 1200);
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
        setCopied("share");
        setTimeout(() => setCopied(null), 1400);
        return;
      }

      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = "morsewords.png";
      a.click();
      URL.revokeObjectURL(url);

      const didCopy = await copyTextToClipboard(shareText);
      if (!didCopy) return;
      setCopied("share");
      setTimeout(() => setCopied(null), 1400);
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  const isHome = variant === "home";
  const focusOutline =
    "mw-focus-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";
  const inputFocusClass = quietInputFocus
    ? "focus:outline-none focus:ring-0 focus-visible:outline-none"
    : focusOutline;

  return (
    <div className={isHome ? "mb-0" : "mb-8"}>
      {flashOn && (
        <div
          className="pointer-events-none fixed inset-0 z-[999]"
          style={{ background: "var(--mw-translator-shell-bg)" }}
        />
      )}

      <section
          className={
            isHome
              ? "mw-tool-section mt-0"
              : "mw-tool-section mt-0"
          }
        >
        <div
          className={
            isHome
              ? "tool-header px-0 pb-1 pt-2 sm:pt-3"
              : "tool-header px-0 pb-1 pt-2 sm:pt-3"
          }
        >
          <div className="flex items-center gap-3">
            <span className="mw-eyebrow-line h-px w-8 bg-sky-800" />
            <span className="mw-eyebrow-text font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
              Live translator
            </span>
          </div>

          <h1
            className={
              isHome
                ? "mw-heading mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl lg:text-6xl"
                : "mw-heading mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl lg:text-6xl"
            }
          >
            {title}
          </h1>

          {subtitle ?? (
            <p className="mw-text-muted mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg">
              Encode text into Morse, decode Morse back to text, and play the signal with timing controls.
            </p>
          )}
        </div>

        <div
          className={
            isHome
              ? "pb-4 pt-4 sm:pb-5 sm:pt-4"
              : "pb-4 pt-4 sm:pb-5 sm:pt-4"
          }
        >
          <div
            className={
              isHome
                ? "flex flex-col gap-4"
                : "flex flex-col gap-4"
            }
          >
            <div className={isHome ? "pt-0" : "pt-0"}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="inline-flex w-full gap-2 rounded-lg sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setDirection("encode")}
                    className={`w-1/2 cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition active:scale-95 sm:w-auto ${focusOutline} ${
                      direction === "encode"
                        ? ACTIVE_CONTROL
                        : isHome
                          ? HOME_SOFT_CONTROL_DARK
                          : SOFT_CONTROL_DARK
                    }`}
                    aria-pressed={direction === "encode"}
                  >
                    Text → Morse
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirection("decode")}
                    className={`w-1/2 cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition active:scale-95 sm:w-auto ${focusOutline} ${
                      direction === "decode"
                        ? ACTIVE_CONTROL
                        : isHome
                          ? HOME_SOFT_CONTROL_DARK
                          : SOFT_CONTROL_DARK
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
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${focusOutline} ${
                        isHome ? "" : "min-h-10 sm:min-h-0"
                      } ${
                        isHome
                          ? HOME_SOFT_CONTROL_DARK
                          : SOFT_CONTROL_DARK
                      }`}
                    >
                      Try “{ex.label}”
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!outputValue}
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition active:scale-95 sm:w-auto lg:ml-auto ${focusOutline} ${
                    outputValue
                      ? isHome
                        ? HOME_SOFT_CONTROL_DARK
                        : SOFT_CONTROL_DARK
                      : isHome
                        ? HOME_DISABLED_CONTROL
                        : DISABLED_CONTROL
                  }`}
                  title="Share output"
                  aria-label="Share output"
                >
                  <ShareIcon size={18} title="Share output" />
                  <span>{copied === "share" ? "Shared" : "Share"}</span>
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className={SOFT_PANEL}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <label
                    htmlFor={liveInputId}
                    className="mw-heading text-sm font-extrabold text-sky-950"
                  >
                    {inputLabel}
                  </label>

                  <span className="mw-muted-label font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Source
                  </span>
                </div>

                <textarea
                  id={liveInputId}
                  className="mw-input-text mw-input-placeholder min-h-[10rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0 focus-visible:outline-none"
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

                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <p className="mw-text-soft text-sm leading-relaxed text-slate-600">
                    3 spaces = letters · 7 = words · / = word break
                  </p>

                  {direction === "encode" &&
                    Object.keys(unsupportedPlain).length > 0 && (
                      <p className="mw-warning-text text-xs font-medium text-amber-700">
                        Unsupported:{" "}
                        {Object.entries(unsupportedPlain)
                          .map(([ch, n]) => `${ch}×${n}`)
                          .join(", ")}{" "}
                        (ignored)
                      </p>
                    )}

                  {direction === "decode" && morseInputIssues.length > 0 && (
                    <p className="mw-warning-text text-xs font-medium text-amber-700">
                      {morseInputIssues.join(" ")}
                    </p>
                  )}
                </div>
              </div>

              <div className={DARK_PANEL}>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <label
                    htmlFor="mw_output"
                    className="mw-output-soft text-sm font-extrabold text-slate-200"
                  >
                    {outputLabel}
                  </label>

                  <span className="mw-output-muted font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                    Result
                  </span>
                </div>

                <textarea
                  id="mw_output"
                  className="mw-output-text mw-input-placeholder min-h-[10rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-sky-100 outline-none placeholder:text-slate-400 focus:ring-0 focus-visible:outline-none"
                  value={outputValue}
                  readOnly
                  placeholder={
                    direction === "encode" ? "... --- ..." : "Example: SOS"
                  }
                />

                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <ActionRow className="items-center">
                    <ActionButton
                      unstyled
                      onClick={() => {
                        if (direction === "encode") setPlainA("");
                        else setMorseB("");
                      }}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${focusOutline} ${
                        isHome ? "" : "min-h-10 sm:min-h-0"
                      } ${DARK_PANEL_BUTTON}`}
                      leadingIcon={
                        <TrashIcon size={16} title={undefined} aria-hidden="true" />
                      }
                    >
                      Clear output
                    </ActionButton>

                    <ActionButton
                      unstyled
                      onClick={() => handleCopy(outputValue, "output")}
                      disabled={!outputValue}
                      className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${focusOutline} ${
                        isHome ? "" : "min-h-10 sm:min-h-0"
                      } ${
                        outputValue ? DARK_PANEL_BUTTON : DARK_PANEL_DISABLED
                      }`}
                      leadingIcon={
                        copied === "output" ? (
                          <CheckCircleIcon
                            size={16}
                            title={undefined}
                            aria-hidden="true"
                          />
                        ) : (
                          <CopyIcon size={16} title={undefined} aria-hidden="true" />
                        )
                      }
                    >
                      <span>
                        {copied === "output" ? "Copied" : "Copy Output"}
                      </span>
                    </ActionButton>
                  </ActionRow>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ActionButton
                unstyled
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
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-semibold transition active:scale-95 ${focusOutline} ${
                  player.state === "playing"
                    ? player.isSupported
                      ? isHome
                        ? HOME_SOFT_CONTROL_DARK
                        : SOFT_CONTROL_DARK
                      : isHome
                        ? HOME_DISABLED_CONTROL
                        : DISABLED_CONTROL
                    : canPlay && player.isSupported
                      ? `${ACTIVE_CONTROL} mw-button-primary-global-hover hover:bg-slate-900 hover:text-white`
                      : isHome
                        ? HOME_DISABLED_CONTROL
                        : DISABLED_CONTROL
                }`}
                leadingIcon={
                  player.state === "playing" ? (
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
                  )
                }
              >
                <span>
                  {player.state === "playing"
                    ? "Pause"
                    : player.state === "paused"
                      ? "Resume"
                      : "Play"}
                </span>
              </ActionButton>

              <ActionButton
                unstyled
                onClick={player.stop}
                disabled={!player.isSupported || player.state === "idle"}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-semibold transition active:scale-95 ${focusOutline} ${
                  player.isSupported && player.state !== "idle"
                    ? isHome
                      ? HOME_SOFT_CONTROL
                      : SOFT_CONTROL
                    : isHome
                      ? HOME_DISABLED_CONTROL
                      : DISABLED_CONTROL
                }`}
                leadingIcon={<StopIcon size={22} title="Stop timer" />}
              >
                <span>Stop</span>
              </ActionButton>

              <ActionButton
                unstyled
                onClick={handleSaveAudio}
                disabled={!canPlay || !soundOn}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-semibold transition active:scale-95 ${focusOutline} ${
                  canPlay && soundOn
                    ? isHome
                      ? HOME_SOFT_CONTROL
                      : SOFT_CONTROL
                    : isHome
                      ? HOME_DISABLED_CONTROL
                      : DISABLED_CONTROL
                }`}
                leadingIcon={
                  <DownloadIcon size={22} title={undefined} aria-hidden="true" />
                }
              >
                <span>Save Audio</span>
              </ActionButton>
            </div>

            <div
              className={
                isHome
                  ? "px-1 pb-5 pt-1 sm:px-2 sm:pb-6 sm:pt-2"
                  : "px-1 pb-2 pt-1 sm:px-2 sm:pb-3 sm:pt-2"
              }
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="mw-heading text-base font-extrabold text-sky-950">
                    Playback Settings
                  </h3>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <TogglePill
                      label="Sound"
                      checked={soundOn}
                      onChange={setSoundOn}
                      icon={
                        soundOn ? (
                          <VolumeIcon size={16} title={undefined} aria-hidden="true" />
                        ) : (
                          <VolumeOffIcon size={16} title={undefined} aria-hidden="true" />
                        )
                      }
                      isHome={isHome}
                    />

                    <TogglePill
                      label="Repeat"
                      checked={repeat}
                      onChange={setRepeat}
                      icon={<LoopIcon size={16} title="Repeat" />}
                      isHome={isHome}
                    />

                    <TogglePill
                      label="Flash Light"
                      checked={flash}
                      onChange={setFlash}
                      icon={<LightBulbIcon size={16} title="Light" />}
                      describedBy={flash ? STROBE_WARNING_ID : undefined}
                      isHome={isHome}
                    />
                  </div>
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
                    quietInputFocus={quietInputFocus}
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
                    quietInputFocus={quietInputFocus}
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
                    quietInputFocus={quietInputFocus}
                  />
                </div>

                {flash ? <StrobeWarning id={STROBE_WARNING_ID} /> : null}

                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 transition active:scale-95 sm:w-auto ${focusOutline} ${
                    isHome
                      ? HOME_SOFT_CONTROL_DARK
                      : SOFT_CONTROL_DARK
                  }`}
                  aria-expanded={advancedOpen}
                >
                  <TuneIcon size={16} title={undefined} aria-hidden="true" />
                  <span className="text-sm font-semibold text-current">
                    Advanced settings
                  </span>
                  <span aria-hidden className="text-current opacity-80">
                    {advancedOpen ? "▴" : "▾"}
                  </span>
                </button>

                {advancedOpen && (
                  <div className="grid gap-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mw-text-muted text-sm font-semibold text-slate-700">
                          Sound type
                        </label>

                        <select
                          value={preset}
                          onChange={(e) =>
                            setPreset(e.target.value as SoundPreset)
                          }
                          disabled={!soundOn}
                          className={`mt-1 w-full rounded-xl p-2 transition hover:text-sky-950 ${inputFocusClass} ${
                            soundOn
                              ? "mw-button-home-soft cursor-pointer bg-white/85 hover:bg-slate-900 hover:text-sky-100"
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
                        quietInputFocus={quietInputFocus}
                      />
                    </div>

                    <p className="mw-text-soft text-xs leading-relaxed text-slate-600">
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
  describedBy,
  isHome = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
  describedBy?: string;
  isHome?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`mw-focus-ring flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
        isHome ? "" : "min-h-10 sm:min-h-0"
      } ${
        checked
          ? `${ACTIVE_CONTROL} mw-button-primary-global-hover hover:bg-slate-900 hover:text-white`
          : isHome
            ? HOME_SOFT_CONTROL
            : SOFT_CONTROL
      }`}
      aria-pressed={checked}
      aria-describedby={describedBy}
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
  quietInputFocus = false,
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
  quietInputFocus?: boolean;
}) {
  const id = React.useId();
  const inputFocusClass = quietInputFocus
    ? "focus:outline-none focus:ring-0 focus-visible:outline-none"
    : "mw-focus-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="mw-text-muted text-sm font-semibold text-slate-700">
          {label}
        </label>
        <span className="mw-text-soft text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>

      {help && <p className="mw-text-faint mt-0.5 text-xs text-slate-500">{help}</p>}

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{ accentColor: "var(--mw-accent)" }}
        className={`mt-2 w-full rounded-full ${inputFocusClass} ${
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
  const raw = readStorageValue(key);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function readBool(key: string, fallback: boolean) {
  const raw = readStorageValue(key);
  if (raw === null) return fallback;
  if (raw === "1") return true;
  if (raw === "0") return false;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return fallback;
}

function readStr(key: string, fallback: string) {
  return readStorageValue(key) ?? fallback;
}

function readStorageValue(key: string) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
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
      .h1 { font: 700 42px "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #0b2447; }
      .muted { font: 600 18px "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #64748b; }
      .label { font: 700 20px "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #334155; }
      .mono { font: 600 24px "Space Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; fill: #0f172a; }
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
