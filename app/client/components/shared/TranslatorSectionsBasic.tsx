import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { readQueryPrefillValue } from "~/client/components/shared/queryPrefill";
import {
  TOOL_SPEED_RANGE,
  TRANSLATOR_AUDIO_PRESETS,
  TRANSLATOR_PITCH_RANGE,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeTranslatorAudioPreset,
} from "~/client/components/shared/morseSettings";
import { TranslatorAudioPresetOptions } from "~/client/components/shared/AudioPresetPicker";
import {
  getAudioPresetDefaults,
  mapTranslatorAudioPreset,
} from "~/client/components/shared/audioPresetRegistry";
import { hasPlayableMorse } from "~/client/components/shared/morseTiming";
import {
  clampNumber,
  readStoredBoolean,
  readStoredEnum,
  readStoredNumber,
  readStoredNumberEnum,
  readStoredString,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";
import useAudio, { type SoundPreset } from "~/client/components/shared/useAudio";
import FlashLamp from "~/client/components/shared/FlashLamp";
import { useFlashLampState } from "~/client/components/shared/useFlashSafety";
import StrobeWarning, {
  FlashEffectsDisabledNotice,
} from "~/client/components/shared/StrobeWarning";
import {
  ActionButton,
  ActionRow,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
import { ToolOutputTextarea } from "~/client/components/shared/ToolWorkspace";
import PlaybackToggleGroup from "~/client/components/shared/PlaybackToggleGroup";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import {
  ExportJobStatus,
  ExportPlanSummary,
} from "~/client/components/shared/export/ExportPlanStatus";
import AudioExportFormatSplitControls, {
  type AudioExportFormat,
} from "~/client/components/shared/export/AudioExportFormatSplitControls";
import {
  downloadBlobFile,
  sanitizeDownloadFilename,
} from "~/client/components/shared/actionOutputUtils";
import {
  buildMorseExportPlan,
  getMorseAudioNoSplitSafetyMessage,
  getMorseAudioSplitTargetDurationMs,
  MORSE_AUDIO_SPLIT_PRESET_MINUTES,
  validateCustomMorseAudioSplitMinutes,
  type MorseAudioSplitMode,
} from "~/client/components/shared/export/morseExportPlan";
import { useMorseAudioExportJob } from "~/client/components/shared/export/useMorseAudioExportJob";

import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
  StopIcon,
  TrashIcon,
  TuneIcon,
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
  allowDecode?: boolean;
}

const STROBE_WARNING_ID = "translator-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "translator-flash-disabled";
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
  "mw-panel-dark mw-noneditable-output overflow-hidden rounded-xl bg-slate-950";
const DARK_PANEL_BUTTON =
  "mw-button-dark-panel bg-slate-700/95 text-slate-100 hover:bg-slate-800 hover:text-white";
const DARK_PANEL_DISABLED =
  "mw-button-dark-panel-disabled cursor-not-allowed bg-slate-800/60 text-slate-500";
const HOME_EXPORT_FORMATS = ["mp3", "wav"] as const satisfies readonly AudioExportFormat[];

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
  allowDecode = true,
}: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [direction, setDirection] = useState<"encode" | "decode">(
    preferredDirection === "decode" && !allowDecode ? "encode" : preferredDirection,
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
  const [exportFormat, setExportFormat] = useState<AudioExportFormat>("wav");
  const [exportSplitMode, setExportSplitMode] =
    useState<MorseAudioSplitMode>("none");
  const [exportSplitPresetMinutes, setExportSplitPresetMinutes] = useState(15);
  const [exportCustomSplitMinutes, setExportCustomSplitMinutes] = useState("");

  useEffect(() => {
    setToneHz(
      readStoredNumber("mw_hz", {
        fallback: 600,
        min: TRANSLATOR_PITCH_RANGE.min,
        max: TRANSLATOR_PITCH_RANGE.max,
        integer: true,
      }),
    );
    setVolume(
      readStoredNumber("mw_vol", {
        fallback: 0.75,
        min: VOLUME_RANGE.min,
        max: VOLUME_RANGE.max,
      }),
    );
    setSoundOn(readStoredBoolean("mw_sound", true));
    setRepeat(readStoredBoolean("mw_repeat", false));
    setFlash(readStoredBoolean("mw_flash", false));
    setPreset(
      readStoredEnum("mw_preset", TRANSLATOR_AUDIO_PRESETS, "cw_radio"),
    );

    const legacyWpm = readStoredNumber("mw_wpm", {
      fallback: 20,
      min: TOOL_SPEED_RANGE.min,
      max: TOOL_SPEED_RANGE.max,
      integer: true,
    });
    const storedCharWpm = readStoredNumber("mw_char_wpm", {
      fallback: legacyWpm,
      min: TOOL_SPEED_RANGE.min,
      max: TOOL_SPEED_RANGE.max,
      integer: true,
    });
    setCharWpm(storedCharWpm);
    setFarnsworthWpm(
      readStoredNumber("mw_fwpm", {
        fallback: 20,
        min: TOOL_SPEED_RANGE.min,
        max: storedCharWpm,
        integer: true,
      }),
    );
    setAdvancedOpen(readStoredBoolean("mw_adv_open", false));
    setExportFormat(readStoredEnum("mw_export_format", HOME_EXPORT_FORMATS, "wav"));
    setExportSplitMode(
      readStoredEnum(
        "mw_export_split_mode",
        ["none", "duration", "custom"] as const,
        "none",
      ),
    );
    setExportSplitPresetMinutes(
      readStoredNumberEnum(
        "mw_export_split_minutes",
        MORSE_AUDIO_SPLIT_PRESET_MINUTES,
        15,
      ),
    );
    setExportCustomSplitMinutes(
      readStoredString("mw_export_custom_split_minutes", "", { maxLength: 12 }),
    );
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
      if (!allowDecode) return;
      setDirection("decode");
      setMorseB(morseParam);
    }
  }, [allowDecode, enableQueryPrefill, setMorseB, setPlainA]);

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
    writeStr("mw_export_format", exportFormat);
    writeStr("mw_export_split_mode", exportSplitMode);
    writeNum("mw_export_split_minutes", exportSplitPresetMinutes);
    writeStr("mw_export_custom_split_minutes", exportCustomSplitMinutes);
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
    exportFormat,
    exportSplitMode,
    exportSplitPresetMinutes,
    exportCustomSplitMinutes,
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

  const flashLamp = useFlashLampState(flash);
  const { disableFlashEffects, flashAllowed } = flashLamp;
  const effectiveFlash = flashAllowed && flash;
  const showStrobeWarning = flashLamp.shouldShowWholePageFlashWarning;

  useEffect(() => {
    if (flashAllowed) return;
    setFlash(false);
    player.setLiveOptions({ flash: false });
  }, [flashAllowed, player]);

  const liveInputId = direction === "encode" ? "plainA" : "morseB";
  const inputLabel = direction === "encode" ? "Input (Text)" : "Input (Morse)";
  const outputLabel =
    direction === "encode" ? "Output (Morse)" : "Output (Text)";
  const inputValue = direction === "encode" ? plainA : morseB;
  const outputValue = direction === "encode" ? morseA : textB;

  const activeMorseForPlayback = useMemo(() => {
    return direction === "encode" ? morseA : morseB;
  }, [direction, morseA, morseB]);

  const handleCharWpmChange = React.useCallback((value: number) => {
    const next = Math.round(
      clampNumber(value, TOOL_SPEED_RANGE.min, TOOL_SPEED_RANGE.max),
    );
    setCharWpm(next);
    setFarnsworthWpm((current) => clampFarnsworthWpm(current, next));
  }, []);

  const handleFarnsworthWpmChange = React.useCallback(
    (value: number) => {
      setFarnsworthWpm(clampFarnsworthWpm(value, charWpm));
    },
    [charWpm],
  );

  const handlePresetChange = React.useCallback((value: string) => {
    const nextPreset = sanitizeTranslatorAudioPreset(value);
    const defaults = getAudioPresetDefaults(mapTranslatorAudioPreset(nextPreset));
    setPreset(nextPreset);
    setToneHz(
      Math.round(
        clampNumber(
          defaults.pitchHz,
          TRANSLATOR_PITCH_RANGE.min,
          TRANSLATOR_PITCH_RANGE.max,
        ),
      ),
    );
    setVolume(defaults.volume);
  }, []);

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

  const canPlay = useMemo(
    () => hasPlayableMorse(activeMorseForPlayback),
    [activeMorseForPlayback],
  );
  const translatorExportPlan = useMemo(
    () =>
      buildMorseExportPlan({
        baseFilename: "morsewords",
        charWpm: Math.round(
          clampNumber(charWpm, TOOL_SPEED_RANGE.min, TOOL_SPEED_RANGE.max),
        ),
        farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, charWpm),
        format: exportFormat,
        kind: "audio",
        leadInMs: 0,
        mp3Kbps: 128,
        sampleRate: 44_100,
        source: direction === "encode" ? plainA : morseB,
        sourceMode: direction === "encode" ? "text" : "morse",
        splitMode: exportSplitMode,
        tailPaddingMs: 120,
        targetPartDurationMs: getMorseAudioSplitTargetDurationMs({
          customMinutes: exportCustomSplitMinutes,
          mode: exportSplitMode,
          presetMinutes: exportSplitPresetMinutes,
        }),
      }),
    [
      charWpm,
      direction,
      exportCustomSplitMinutes,
      exportFormat,
      exportSplitMode,
      exportSplitPresetMinutes,
      farnsworthWpm,
      morseB,
      plainA,
    ],
  );
  const exportCustomSplitError =
    exportSplitMode === "custom"
      ? validateCustomMorseAudioSplitMinutes(exportCustomSplitMinutes)
      : "";
  const exportBlockedMessage = translatorExportPlan.singleFileUnsafe
    ? getMorseAudioNoSplitSafetyMessage(exportFormat)
    : exportCustomSplitError;
  const translatorExportKey = JSON.stringify({
    activeMorseForPlayback,
    charWpm,
    exportCustomSplitMinutes,
    exportFormat,
    exportSplitMode,
    exportSplitPresetMinutes,
    farnsworthWpm,
    preset,
    soundOn,
    toneHz,
    volume,
  });
  const translatorExport = useMorseAudioExportJob(translatorExportKey);
  const exportControlsLocked = translatorExport.isActive;
  const showTranslatorExportPlan =
    exportSplitMode !== "none" ||
    translatorExportPlan.multiPart ||
    translatorExportPlan.singleFileUnsafe ||
    translatorExport.state.status !== "idle";

  const handlePlay = async () => {
    if (!canPlay) return;

    const effectiveChar = Math.round(
      clampNumber(charWpm, TOOL_SPEED_RANGE.min, TOOL_SPEED_RANGE.max),
    );
    const effectiveF = clampFarnsworthWpm(farnsworthWpm, effectiveChar);

    await player.play({
      code: activeMorseForPlayback,
      wpm: effectiveChar,
      farnsworthWpm: effectiveF,
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash: effectiveFlash,
    });
  };

  useEffect(() => {
    player.setLiveOptions({
      code: activeMorseForPlayback,
      wpm: Math.round(
        clampNumber(charWpm, TOOL_SPEED_RANGE.min, TOOL_SPEED_RANGE.max),
      ),
      farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, charWpm),
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash: effectiveFlash,
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
    effectiveFlash,
    player,
  ]);

  const handleSaveAudio = async () => {
    if (
      !canPlay ||
      !soundOn ||
      exportControlsLocked ||
      Boolean(exportBlockedMessage)
    ) {
      return;
    }
    player.stop();
    await translatorExport.start({
      plan: translatorExportPlan,
      settings: {
        attackMs: getAudioPresetDefaults(mapTranslatorAudioPreset(preset)).attackMs,
        charWpm: Math.round(
          clampNumber(charWpm, TOOL_SPEED_RANGE.min, TOOL_SPEED_RANGE.max),
        ),
        farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, charWpm),
        format: exportFormat,
        leadInMs: 0,
        mp3Kbps: 128,
        pitch: toneHz,
        releaseMs: getAudioPresetDefaults(mapTranslatorAudioPreset(preset)).releaseMs,
        sampleRate: 44_100,
        tailPaddingMs: 120,
        tonePreset: mapTranslatorAudioPreset(preset),
        volume,
      },
    });
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
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFiles) {
        await navigator.share({
          title: "MorseWords",
          text: shareText,
          files: [file],
        });
        setCopied("share");
        setTimeout(() => setCopied(null), 1400);
        return;
      }

      downloadBlobFile({
        blob: file,
        filename: sanitizeDownloadFilename("morsewords.png", "morsewords.png"),
      });

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
                    className={`${allowDecode ? "w-1/2" : "w-full"} cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition active:scale-95 sm:w-auto ${focusOutline} ${
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
                    onClick={() => {
                      if (allowDecode) setDirection("decode");
                    }}
                    hidden={!allowDecode}
                    disabled={!allowDecode}
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

                <ToolOutputTextarea
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
                disabled={
                  !canPlay ||
                  !soundOn ||
                  exportControlsLocked ||
                  Boolean(exportBlockedMessage)
                }
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
                <span>{`Save ${exportFormat.toUpperCase()} audio`}</span>
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

                  <div className="sm:justify-end">
                    <PlaybackToggleGroup
                      sound={{ checked: soundOn, onChange: setSoundOn }}
                      repeat={{ checked: repeat, onChange: setRepeat }}
                      flash={{
                        checked: effectiveFlash,
                        onChange: (value) => setFlash(value && flashAllowed),
                        describedBy: disableFlashEffects
                          ? FLASH_DISABLED_NOTICE_ID
                          : showStrobeWarning
                            ? STROBE_WARNING_ID
                            : undefined,
                        disabled: !flashAllowed,
                      }}
                    />
                    <FlashLamp
                      active={flashLamp.active}
                      disabled={!flashAllowed}
                      label="Morse translator flash lamp"
                      size="sm"
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
                    onChange={handleCharWpmChange}
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

                {disableFlashEffects ? (
                  <FlashEffectsDisabledNotice id={FLASH_DISABLED_NOTICE_ID} />
                ) : showStrobeWarning ? (
                  <StrobeWarning id={STROBE_WARNING_ID} />
                ) : null}

                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  disabled={!isHydrated}
                  className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 transition active:scale-95 disabled:cursor-wait disabled:opacity-60 sm:w-auto ${focusOutline} ${
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
                          Tone preset
                        </label>

                        <select
                          value={preset}
                          onChange={(e) => handlePresetChange(e.target.value)}
                          disabled={!soundOn}
                          className={`mt-1 w-full rounded-xl p-2 transition hover:text-sky-950 ${inputFocusClass} ${
                            soundOn
                              ? "mw-button-home-soft cursor-pointer bg-white/85 hover:bg-slate-900 hover:text-sky-100"
                            : "cursor-not-allowed opacity-60"
                          }`}
                        >
                          <TranslatorAudioPresetOptions />
                        </select>
                      </div>

                      <SliderRow
                        label="Farnsworth"
                        value={farnsworthWpm}
                        min={5}
                        max={Math.max(5, charWpm)}
                        step={1}
                        unit="WPM"
                        onChange={handleFarnsworthWpmChange}
                        quietInputFocus={quietInputFocus}
                      />
                    </div>

                    <section
                      aria-label="Audio download settings"
                      className="grid gap-4 border-t border-slate-200/80 pt-4"
                      data-testid="translator-audio-export-settings"
                    >
                      <h4 className="mw-heading text-base font-extrabold text-sky-950">
                        Audio export
                      </h4>

                      <div className="grid gap-4">
                        <AudioExportFormatSplitControls
                          idPrefix="translator-audio-export"
                          format={exportFormat}
                          splitMode={exportSplitMode}
                          presetMinutes={exportSplitPresetMinutes}
                          customMinutes={exportCustomSplitMinutes}
                          disabled={exportControlsLocked}
                          onFormatChange={setExportFormat}
                          onSplitModeChange={setExportSplitMode}
                          onPresetMinutesChange={setExportSplitPresetMinutes}
                          onCustomMinutesChange={setExportCustomSplitMinutes}
                        />

                      {showTranslatorExportPlan ? (
                        <ExportPlanSummary plan={translatorExportPlan} />
                      ) : null}
                      {exportCustomSplitError ? (
                        <p role="alert" className="text-sm font-semibold text-slate-700">
                          {exportCustomSplitError}
                        </p>
                      ) : null}
                      <ExportJobStatus
                        state={translatorExport.state}
                        isActive={translatorExport.isActive}
                        onCancel={() => translatorExport.cancel()}
                        onReset={translatorExport.reset}
                        onRetry={() => void translatorExport.retry()}
                      />
                      </div>
                    </section>
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


function writeNum(key: string, value: number) {
  safeWriteStorage(key, String(value));
}

function writeBool(key: string, value: boolean) {
  safeWriteStorage(key, value ? "1" : "0");
}

function writeStr(key: string, value: string) {
  safeWriteStorage(key, value);
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
