import * as React from "react";

import styles from "~/client/components/shared/audioStyles";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import FlashLamp from "~/client/components/shared/FlashLamp";
import { useFlashLampState } from "~/client/components/shared/useFlashSafety";
import StrobeWarning, {
  FlashEffectsDisabledNotice,
} from "~/client/components/shared/StrobeWarning";
import {
  HOME_TOOL_EXAMPLES,
  TOOL_SPACING_HELPER,
  ToolButton,
  ToolHero,
  ToolModeButton,
  ToolOutputPanel,
  ToolPanel,
  ToolSampleButtons,
  ToolTextarea,
} from "~/client/components/shared/ToolWorkspace";
import type { ExportFormat } from "~/client/components/morse-code-sound-generator/audioExport";
import { copyTextToClipboard } from "~/client/components/shared/ActionControls";
import {
  ExportJobStatus,
  ExportPlanSummary,
} from "~/client/components/shared/export/ExportPlanStatus";
import AudioExportFormatSplitControls from "~/client/components/shared/export/AudioExportFormatSplitControls";
import {
  buildMorseExportPlan,
  getMorseAudioNoSplitSafetyMessage,
  getMorseAudioSplitTargetDurationMs,
  MORSE_AUDIO_SPLIT_PRESET_MINUTES,
  validateCustomMorseAudioSplitMinutes,
  type MorseAudioSplitMode,
} from "~/client/components/shared/export/morseExportPlan";
import { useMorseAudioExportJob } from "~/client/components/shared/export/useMorseAudioExportJob";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import PlaybackToggleGroup from "~/client/components/shared/PlaybackToggleGroup";
import AdvancedSettingsToggle from "~/client/components/shared/AdvancedSettingsToggle";
import { AudioPresetOptions } from "~/client/components/shared/AudioPresetPicker";
import {
  getAudioPresetDefaults,
  getAudioPresetShortLabel,
} from "~/client/components/shared/audioPresetRegistry";
import { presetSupportsPitchControl } from "~/client/components/shared/audioToneSynthesis";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { readQueryPrefillValue } from "~/client/components/shared/queryPrefill";
import { hasPlayableMorse } from "~/client/components/shared/morseTiming";
import {
  AUDIO_ATTACK_RANGE,
  AUDIO_LEAD_IN_RANGE,
  AUDIO_PITCH_RANGE,
  AUDIO_RELEASE_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  AUDIO_TAIL_RANGE,
  MP3_BITRATES,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
  sanitizeMp3Bitrate,
} from "~/client/components/shared/morseSettings";
import {
  clampNumber,
  readStoredBoolean,
  readStoredEnum,
  readStoredNumber,
  readStoredNumberEnum,
  readStoredString,
  safeWriteStorage,
  safeWriteStorageResult,
  sourceStorageWriteMessage,
} from "~/client/components/shared/settingsStorage";

import {
  CopyIcon,
  PauseIcon,
  PlayIcon,
  SaveIcon,
  StopIcon,
} from "~/client/assets/svg/Icons";

type SourceMode = "text" | "morse";
type PageIntent = "audio" | "sound";
const SOURCE_MODES = ["text", "morse"] as const;
const STROBE_WARNING_ID = "sound-generator-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "sound-generator-flash-disabled";
const AUDIO_SPLIT_MODES = ["none", "duration", "custom"] as const;
const DEFAULT_EXPORT_FORMATS: readonly ExportFormat[] = ["mp3", "wav"];

type MorseAudioTranslatorProps = {
  heading?: string;
  lead?: string;
  defaultText?: string;
  /** Preserve `/audio?text=` and `/audio?morse=` links from content routes. */
  enableQueryPrefill?: boolean;
  defaultMorse?: string;
  defaultFileName?: string;
  storagePrefix?: string;
  textModeLabel?: string;
  morseModeLabel?: string;
  textInputLabel?: string;
  morseInputLabel?: string;
  primaryExampleText?: string;
  secondaryExampleText?: string;
  morseExample?: string;
  pageIntent?: PageIntent;
  exportFormats?: readonly ExportFormat[];
  introEyebrow?: string;
};

export default function MorseAudioTranslator({
  heading = "Morse Audio Generator",
  lead = "Convert text or Morse into audio. Adjust speed, pitch, waveform, and download MP3 or WAV.",
  defaultText = "sos help",
  enableQueryPrefill = false,
  defaultMorse = "... --- ...",
  defaultFileName = "morse-audio",
  storagePrefix = "mw_audio",
  textModeLabel = "Text to Morse audio",
  morseModeLabel = "Morse to audio",
  textInputLabel = "Message (Text)",
  morseInputLabel = "Morse input",
  primaryExampleText,
  secondaryExampleText,
  morseExample,
  pageIntent = "audio",
  exportFormats = DEFAULT_EXPORT_FORMATS,
  introEyebrow = "Audio tool",
}: MorseAudioTranslatorProps = {}) {
  const player = useMorseAudio();
  const queryPrefillApplied = React.useRef(false);
  const storageKey = React.useCallback(
    (suffix: string) => `${storagePrefix}_${suffix}`,
    [storagePrefix],
  );
  const safePrefix = storagePrefix.replace(/[^a-zA-Z0-9_-]/g, "_");
  const sourceInputId = `${safePrefix}_source`;
  const tonePresetId = `${safePrefix}_tone_preset`;
  const fileNameId = `${safePrefix}_file_name`;
  const sampleRateId = `${safePrefix}_sample_rate`;
  const isSoundPage = pageIntent === "sound";

  const [sourceMode, setSourceMode] = React.useState<SourceMode>("text");
  const [text, setText] = React.useState(defaultText);
  const [morse, setMorse] = React.useState(defaultMorse);
  const computedMorse = React.useMemo(() => textToMorse(text), [text]);

  const activeCode = React.useMemo(
    () => (sourceMode === "text" ? computedMorse : morse),
    [sourceMode, computedMorse, morse],
  );

  const [copied, setCopied] = React.useState<null | "morse">(null);
  const [charWpm, setCharWpm] = React.useState<number>(18);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState<number>(12);
  const [toneHz, setToneHz] = React.useState<number>(650);
  const [volume, setVolume] = React.useState<number>(0.75);
  const [preset, setPreset] = React.useState<SoundPreset>("cw_radio");
  const [attackMs, setAttackMs] = React.useState<number>(8);
  const [releaseMs, setReleaseMs] = React.useState<number>(12);
  const [repeat, setRepeat] = React.useState<boolean>(false);
  const [soundOn, setSoundOn] = React.useState<boolean>(true);
  const [flash, setFlash] = React.useState<boolean>(false);
  const [advancedOpen, setAdvancedOpen] = React.useState<boolean>(true);
  const [fileName, setFileName] = React.useState(defaultFileName);
  const [sampleRate, setSampleRate] =
    React.useState<22050 | 44100 | 48000>(44100);
  const [leadInMs, setLeadInMs] = React.useState<number>(0);
  const [tailMs, setTailMs] = React.useState<number>(120);
  const [mp3Kbps, setMp3Kbps] = React.useState<number>(128);
  const [plannedFormat, setPlannedFormat] = React.useState<ExportFormat>(() =>
    exportFormats.includes("mp3") ? "mp3" : exportFormats[0] ?? "wav",
  );
  const [splitMode, setSplitMode] = React.useState<MorseAudioSplitMode>("none");
  const [splitPresetMinutes, setSplitPresetMinutes] = React.useState(15);
  const [customSplitMinutes, setCustomSplitMinutes] = React.useState("");
  const [sourceSaveNotice, setSourceSaveNotice] = React.useState("");
  const [hydrated, setHydrated] = React.useState(false);
  const flashLamp = useFlashLampState(hydrated && flash);
  const { disableFlashEffects, flashAllowed } = flashLamp;
  const effectiveFlash = flashAllowed && flash;
  const showStrobeWarning = flashLamp.shouldShowWholePageFlashWarning;

  React.useEffect(() => {
    setSourceMode(readStoredEnum(storageKey("source"), SOURCE_MODES, "text"));
    setText(readStoredString(storageKey("text"), defaultText, { maxLength: 25000 }));
    setMorse(
      readStoredString(storageKey("morse"), defaultMorse, { maxLength: 25000 }),
    );
    const storedCharWpm = readStoredNumber(storageKey("wpm"), {
      fallback: 18,
      min: AUDIO_SPEED_RANGE.min,
      max: AUDIO_SPEED_RANGE.max,
      integer: true,
    });
    setCharWpm(storedCharWpm);
    setFarnsworthWpm(
      readStoredNumber(storageKey("fwpm"), {
        fallback: 12,
        min: AUDIO_SPEED_RANGE.min,
        max: storedCharWpm,
        integer: true,
      }),
    );
    setToneHz(
      readStoredNumber(storageKey("hz"), {
        fallback: 650,
        min: AUDIO_PITCH_RANGE.min,
        max: AUDIO_PITCH_RANGE.max,
        integer: true,
      }),
    );
    setVolume(
      readStoredNumber(storageKey("vol"), {
        fallback: 0.75,
        min: VOLUME_RANGE.min,
        max: VOLUME_RANGE.max,
      }),
    );
    setPreset(
      sanitizeAudioGeneratorPreset(
        readStoredString(storageKey("preset"), "cw_radio", { maxLength: 64 }),
      ),
    );
    setAttackMs(
      readStoredNumber(storageKey("attack"), {
        fallback: 8,
        min: AUDIO_ATTACK_RANGE.min,
        max: AUDIO_ATTACK_RANGE.max,
        integer: true,
      }),
    );
    setReleaseMs(
      readStoredNumber(storageKey("release"), {
        fallback: 12,
        min: AUDIO_RELEASE_RANGE.min,
        max: AUDIO_RELEASE_RANGE.max,
        integer: true,
      }),
    );
    setRepeat(readStoredBoolean(storageKey("repeat"), false));
    setSoundOn(readStoredBoolean(storageKey("sound"), true));
    setFlash(readStoredBoolean(storageKey("flash"), false));
    setAdvancedOpen(readStoredBoolean(storageKey("adv_open"), true));
    setFileName(
      readStoredString(storageKey("filename"), defaultFileName, {
        maxLength: 120,
      }),
    );
    setSampleRate(readStoredNumberEnum(storageKey("sr"), AUDIO_SAMPLE_RATES, 44100));
    setLeadInMs(
      readStoredNumber(storageKey("lead_in"), {
        fallback: 0,
        min: AUDIO_LEAD_IN_RANGE.min,
        max: AUDIO_LEAD_IN_RANGE.max,
        integer: true,
      }),
    );
    setTailMs(
      readStoredNumber(storageKey("tail"), {
        fallback: 120,
        min: AUDIO_TAIL_RANGE.min,
        max: AUDIO_TAIL_RANGE.max,
        integer: true,
      }),
    );
    setMp3Kbps(
      readStoredNumberEnum(storageKey("mp3_kbps"), MP3_BITRATES, 128),
    );
    setPlannedFormat(
      readStoredEnum(
        storageKey("format"),
        exportFormats,
        exportFormats.includes("mp3") ? "mp3" : exportFormats[0] ?? "wav",
      ),
    );
    setSplitMode(readStoredEnum(storageKey("split_mode"), AUDIO_SPLIT_MODES, "none"));
    setSplitPresetMinutes(
      readStoredNumberEnum(
        storageKey("split_minutes"),
        MORSE_AUDIO_SPLIT_PRESET_MINUTES,
        15,
      ),
    );
    setCustomSplitMinutes(readStoredString(storageKey("custom_split_minutes"), "", { maxLength: 12 }));
    setHydrated(true);
  }, [defaultFileName, defaultMorse, defaultText, exportFormats, storageKey]);

  React.useEffect(() => {
    if (!enableQueryPrefill || queryPrefillApplied.current) return;
    queryPrefillApplied.current = true;
    if (typeof window === "undefined") return;

    const textParam = readQueryPrefillValue(window.location.search, "text");
    const morseParam = readQueryPrefillValue(window.location.search, "morse");
    if (textParam) {
      setSourceMode("text");
      setText(textParam);
      return;
    }
    if (morseParam) {
      setSourceMode("morse");
      setMorse(morseParam);
    }
  }, [enableQueryPrefill]);

  React.useEffect(() => {
    if (!hydrated) return;
    player.setLiveOptions({
      code: activeCode,
      wpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max)),
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash: effectiveFlash,
      attackMs,
      releaseMs,
    });
  }, [hydrated, player, activeCode, charWpm, farnsworthWpm, toneHz, volume, soundOn, preset, repeat, effectiveFlash, attackMs, releaseMs]);

  React.useEffect(() => {
    if (flashAllowed) return;
    setFlash(false);
    player.setLiveOptions({ flash: false });
  }, [flashAllowed, player]);

  React.useEffect(() => {
    if (!hydrated) return;
    writeStr(storageKey("source"), sourceMode);
    const textWrite = safeWriteStorageResult(storageKey("text"), text);
    const morseWrite = safeWriteStorageResult(storageKey("morse"), morse);
    setSourceSaveNotice(sourceStorageWriteMessage([textWrite, morseWrite]));
    writeNum(storageKey("wpm"), charWpm);
    writeNum(storageKey("fwpm"), farnsworthWpm);
    writeNum(storageKey("hz"), toneHz);
    writeNum(storageKey("vol"), volume);
    writeStr(storageKey("preset"), preset);
    writeNum(storageKey("attack"), attackMs);
    writeNum(storageKey("release"), releaseMs);
    writeBool(storageKey("repeat"), repeat);
    writeBool(storageKey("sound"), soundOn);
    writeBool(storageKey("flash"), flash);
    writeBool(storageKey("adv_open"), advancedOpen);
    writeStr(storageKey("filename"), fileName);
    writeNum(storageKey("sr"), sampleRate);
    writeNum(storageKey("lead_in"), leadInMs);
    writeNum(storageKey("tail"), tailMs);
    writeNum(storageKey("mp3_kbps"), mp3Kbps);
    writeStr(storageKey("format"), plannedFormat);
    writeStr(storageKey("split_mode"), splitMode);
    writeNum(storageKey("split_minutes"), splitPresetMinutes);
    writeStr(storageKey("custom_split_minutes"), customSplitMinutes);
  }, [hydrated, sourceMode, text, morse, charWpm, farnsworthWpm, toneHz, volume, preset, attackMs, releaseMs, repeat, soundOn, flash, advancedOpen, fileName, sampleRate, leadInMs, tailMs, mp3Kbps, plannedFormat, splitMode, splitPresetMinutes, customSplitMinutes, storageKey]);

  const canPlay = React.useMemo(
    () => hasPlayableMorse(activeCode),
    [activeCode],
  );
  const canAttemptExport = !!activeCode.trim() && soundOn;
  const durationMs = React.useMemo(() => {
    if (!canPlay) return 0;
    return player.estimateDurationMs({
      code: activeCode,
      wpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max)),
    });
  }, [player, activeCode, canPlay, charWpm, farnsworthWpm]);
  const buildAudioPlan = React.useCallback(
    (format: ExportFormat) =>
      buildMorseExportPlan({
        baseFilename: fileName || defaultFileName || "morse-audio",
        charWpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
        farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max)),
        format,
        kind: "audio",
        leadInMs,
        mp3Kbps,
        sampleRate,
        source: sourceMode === "text" ? text : morse,
        sourceMode,
        splitMode,
        tailPaddingMs: tailMs,
        targetPartDurationMs: getMorseAudioSplitTargetDurationMs({
          customMinutes: customSplitMinutes,
          mode: splitMode,
          presetMinutes: splitPresetMinutes,
        }),
      }),
    [
      charWpm,
      defaultFileName,
      farnsworthWpm,
      fileName,
      leadInMs,
      morse,
      mp3Kbps,
      sampleRate,
      sourceMode,
      splitMode,
      splitPresetMinutes,
      tailMs,
      text,
      customSplitMinutes,
    ],
  );
  const exportPlan = React.useMemo(
    () => buildAudioPlan(plannedFormat),
    [buildAudioPlan, plannedFormat],
  );
  const exportKey = JSON.stringify({
    activeCode,
    attackMs,
    charWpm,
    farnsworthWpm,
    fileName,
    mp3Kbps,
    preset,
    releaseMs,
    sampleRate,
    soundOn,
    leadInMs,
    tailMs,
    toneHz,
    volume,
    plannedFormat,
    splitMode,
    splitPresetMinutes,
    customSplitMinutes,
  });
  const audioExport = useMorseAudioExportJob(exportKey);
  const customSplitError =
    splitMode === "custom"
      ? validateCustomMorseAudioSplitMinutes(customSplitMinutes)
      : "";
  const exportBlockedMessage = exportPlan.singleFileUnsafe
    ? getMorseAudioNoSplitSafetyMessage(plannedFormat)
    : customSplitError;
  const exportControlsLocked = audioExport.isActive;
  const showExportPlan =
    splitMode !== "none" ||
    exportPlan.multiPart ||
    exportPlan.singleFileUnsafe ||
    audioExport.state.status !== "idle";

  const handleCharWpmChange = React.useCallback((value: number) => {
    const next = Math.round(
      clampNumber(value, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
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

  const handlePresetChange = React.useCallback((nextPreset: SoundPreset) => {
    const defaults = getAudioPresetDefaults(nextPreset);
    setPreset(nextPreset);
    setToneHz(defaults.pitchHz);
    setVolume(defaults.volume);
    setAttackMs(defaults.attackMs);
    setReleaseMs(defaults.releaseMs);
  }, []);

  const unsupportedPlain = React.useMemo(() => getUnsupportedTextCharacters(text), [text]);
  const morseIssues = React.useMemo(() => {
    const issues: string[] = [];
    if (sourceMode !== "morse" || !morse) return issues;
    const { invalidChars } = normalizeMorseForDecoding(morse);
    if (invalidChars.length) {
      issues.push(`Invalid character${invalidChars.length > 1 ? "s" : ""}: ${invalidChars.join(" ")}`);
    }
    return issues;
  }, [sourceMode, morse]);

  const handleCopyMorse = async () => {
    const s = activeCode.trim();
    if (!s) return;
    const didCopy = await copyTextToClipboard(s);
    if (!didCopy) {
      setCopied(null);
      return;
    }
    setCopied("morse");
    setTimeout(() => setCopied(null), 1200);
  };

  const handleClearOutput = () => {
    if (sourceMode === "text") setText("");
    else setMorse("");
    setCopied(null);
  };

  const handlePlay = async () => {
    if (!canPlay) return;
    await player.play({
      code: activeCode,
      wpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max)),
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash: effectiveFlash,
      attackMs,
      releaseMs,
    });
  };

  const handleExport = async (format: ExportFormat) => {
    const plan = buildAudioPlan(format);
    if (
      !activeCode.trim() ||
      !soundOn ||
      audioExport.isActive ||
      plan.singleFileUnsafe ||
      customSplitError
    ) return;
    player.stop();
    setPlannedFormat(format);
    await audioExport.start({
      plan,
      settings: {
        attackMs,
        charWpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
        farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max)),
        format,
        leadInMs,
        mp3Kbps,
        pitch: toneHz,
        releaseMs,
        sampleRate,
        tailPaddingMs: tailMs,
        tonePreset: preset,
        volume,
      },
    });
  };

  const restoreExportDefaults = React.useCallback(() => {
    setFileName(defaultFileName);
    setSampleRate(44100);
    setLeadInMs(0);
    setTailMs(120);
    setMp3Kbps(128);
    setPlannedFormat(exportFormats.includes("mp3") ? "mp3" : "wav");
    setSplitMode("none");
    setSplitPresetMinutes(15);
    setCustomSplitMinutes("");
    audioExport.reset();
  }, [audioExport, defaultFileName, exportFormats]);

  const updateFeedbackToggle = React.useCallback(
    (key: "sound" | "repeat" | "flash", next: boolean) => {
      if (key === "flash" && !flashAllowed) return;
      const current = { sound: soundOn, repeat, flash: effectiveFlash };
      const updated = { ...current, [key]: key === "flash" ? next && flashAllowed : next };
      if (key === "sound") setSoundOn(next);
      if (key === "repeat") setRepeat(next);
      if (key === "flash") setFlash(next && flashAllowed);
      player.setLiveOptions({ soundEnabled: updated.sound, flash: updated.flash });
    },
    [soundOn, repeat, effectiveFlash, flashAllowed, player],
  );

  const heroStats = [
    ["Output", exportFormats.includes("mp3") ? "WAV + MP3" : "WAV"],
    ["Tone", presetLabel(preset)],
    [
      "Pitch",
      presetSupportsPitchControl(preset)
        ? `${toneHz} Hz`
        : getAudioPresetShortLabel(preset),
    ],
    ["Speed", `${charWpm} WPM`],
  ];

  return (
    <div style={styles.page}>
      <section className="mw-tool-section mt-0">
            <div>
              <ToolHero eyebrow={introEyebrow} title={heading} lead={lead} />
              <div className="pb-4 pt-4 sm:pb-5 sm:pt-4">

              <div className="flex flex-wrap items-center gap-2">
                <ToolModeButton active={sourceMode === "text"} onClick={() => setSourceMode("text")}>{textModeLabel}</ToolModeButton>
                <ToolModeButton active={sourceMode === "morse"} onClick={() => setSourceMode("morse")}>{morseModeLabel}</ToolModeButton>
                <ToolSampleButtons
                  examples={HOME_TOOL_EXAMPLES}
                  onPick={(example) =>
                    sourceMode === "text" ? setText(example) : setMorse(textToMorse(example))
                  }
                />
                <span className="ml-auto text-xs text-slate-500">
                  {player.isSupported ? <>Est. time: {formatMs(durationMs)}</> : <span>Audio unavailable in this browser</span>}
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ToolPanel
                  label={sourceMode === "text" ? textInputLabel : morseInputLabel}
                  badge="Source"
                  footer={
                    <p className="text-sm leading-relaxed text-slate-600">
                      {sourceSaveNotice || TOOL_SPACING_HELPER}
                    </p>
                  }
                >
                  {sourceMode === "text" ? (
                    <>
                      <ToolTextarea
                        id={sourceInputId}
                        aria-label={textInputLabel}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Example: Hello world"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      {Object.keys(unsupportedPlain).length > 0 && (
                        <p className="px-4 pb-3 text-xs font-medium text-slate-600">
                          Unsupported characters are ignored: {Object.entries(unsupportedPlain).map(([ch, n]) => `${ch}×${n}`).join(", ")}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <ToolTextarea
                        id={sourceInputId}
                        aria-label={morseInputLabel}
                        value={morse}
                        onChange={(e) => setMorse(e.target.value)}
                        placeholder="Example: ... --- ..."
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      {morseIssues.length > 0 && <p className="px-4 pb-3 text-xs font-medium text-slate-600">{morseIssues.join(" ")}</p>}
                    </>
                  )}
                </ToolPanel>

                <ToolOutputPanel
                  label="Output (Morse)"
                  footer={
                    <>
                    <ToolButton
                      type="button"
                      onClick={handleClearOutput}
                      tone="darkPanel"
                      className="rounded-md px-3 py-1.5 text-sm"
                    >
                      Clear output
                    </ToolButton>

                    <ToolButton
                      type="button"
                      onClick={handleCopyMorse}
                      disabled={!canPlay}
                      tone="darkPanel"
                      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm"
                    >
                      <CopyIcon size={16} title="Copy Output" />
                      <span>{copied === "morse" ? "Copied" : "Copy Output"}</span>
                    </ToolButton>
                    </>
                  }
                >
                  <code className="block max-h-44 min-h-[10rem] overflow-auto whitespace-pre-wrap break-words bg-transparent p-4 font-mono text-sm leading-relaxed text-sky-100">
                    {activeCode.trim() || "Your Morse output will appear here."}
                  </code>
                </ToolOutputPanel>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">
                <ToolButton
                  onClick={() => {
                    if (player.state === "idle") handlePlay();
                    else if (player.state === "playing") player.pause();
                    else if (player.state === "paused") player.resume();
                  }}
                  disabled={player.state === "playing" ? !player.isSupported : !canPlay || !player.isSupported}
                  tone={player.state === "playing" ? "light" : "dark"}
                  active={player.state !== "playing" && canPlay && player.isSupported}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5"
                >
                  {player.state === "playing" ? <PauseIcon size={22} title="Pause audio" /> : <PlayIcon size={22} title={player.state === "paused" ? "Resume audio" : "Play audio"} />}
                  <span>{player.state === "playing" ? "Pause" : player.state === "paused" ? "Resume" : isSoundPage ? "Play sound" : "Play"}</span>
                </ToolButton>

                <ToolButton
                  onClick={player.stop}
                  disabled={!player.isSupported || player.state === "idle"}
                  tone="light"
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5"
                >
                  <StopIcon size={22} title="Stop audio" />
                  <span>Stop</span>
                </ToolButton>

                <ToolButton
                  onClick={() => handleExport(plannedFormat)}
                  disabled={!hydrated || !canAttemptExport || Boolean(exportBlockedMessage) || exportControlsLocked}
                  tone="light"
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5"
                >
                  <SaveIcon size={22} title="Export audio" />
                  <span>{`Download ${plannedFormat.toUpperCase()}`}</span>
                </ToolButton>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-sky-950">Sound controls</h2>
                <span className="text-sm text-slate-600">{player.isSupported ? player.state === "idle" ? "Ready" : player.state === "playing" ? "Playing" : "Paused" : "Unavailable"}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <PlaybackToggleGroup
                  sound={{ checked: soundOn, onChange: (value) => updateFeedbackToggle("sound", value) }}
                  repeat={{ checked: repeat, onChange: (value) => updateFeedbackToggle("repeat", value) }}
                  flash={{
                    checked: effectiveFlash,
                    onChange: (value) => updateFeedbackToggle("flash", value),
                    describedBy: disableFlashEffects
                      ? FLASH_DISABLED_NOTICE_ID
                      : showStrobeWarning
                        ? STROBE_WARNING_ID
                        : undefined,
                    disabled: !flashAllowed,
                  }}
                  trailing={
                    <FlashLamp
                      active={flashLamp.active}
                      disabled={!flashAllowed}
                      label="Morse audio flash lamp"
                      size="sm"
                    />
                  }
                  rounded="lg"
                />
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <SliderRow label="Character speed" value={charWpm} min={AUDIO_SPEED_RANGE.min} max={AUDIO_SPEED_RANGE.max} step={1} unit="WPM" onChange={handleCharWpmChange} />
                <SliderRow label="Farnsworth spacing" value={farnsworthWpm} min={AUDIO_SPEED_RANGE.min} max={Math.max(AUDIO_SPEED_RANGE.min, charWpm)} step={1} unit="WPM" onChange={handleFarnsworthWpmChange} />
                <SliderRow label="Pitch" value={toneHz} min={AUDIO_PITCH_RANGE.min} max={AUDIO_PITCH_RANGE.max} step={10} unit="Hz" onChange={setToneHz} disabled={!soundOn || !presetSupportsPitchControl(preset)} />
                <SliderRow label="Volume" value={Math.round(volume * 100)} min={VOLUME_RANGE.min * 100} max={VOLUME_RANGE.max * 100} step={1} unit="%" onChange={(v) => setVolume(v / 100)} disabled={!soundOn} />
              </div>

              {disableFlashEffects ? <FlashEffectsDisabledNotice id={FLASH_DISABLED_NOTICE_ID} className="mt-3" /> : showStrobeWarning ? <StrobeWarning id={STROBE_WARNING_ID} className="mt-3" /> : null}

              <div className="mt-4">
                <AdvancedSettingsToggle
                  onToggle={() => setAdvancedOpen((value) => !value)}
                  open={advancedOpen}
                />
              </div>

              {advancedOpen ? (
                <div className="mt-4 pt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={tonePresetId} className="text-sm font-semibold text-slate-700">Tone preset</label>
                      <select id={tonePresetId} value={preset} disabled={!hydrated} onChange={(e) => handlePresetChange(sanitizeAudioGeneratorPreset(e.target.value))} className="mt-2 w-full cursor-pointer rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none disabled:cursor-wait disabled:text-slate-400">
                        <AudioPresetOptions context="soundGenerator" />
                      </select>
                    </div>

                    <div className="mt-4">
                      <AudioExportFormatSplitControls
                        idPrefix={safePrefix}
                        format={plannedFormat}
                        splitMode={splitMode}
                        presetMinutes={splitPresetMinutes}
                        customMinutes={customSplitMinutes}
                        disabled={!hydrated || exportControlsLocked}
                        onFormatChange={(next) => {
                          if (exportFormats.includes(next)) setPlannedFormat(next);
                        }}
                        onSplitModeChange={setSplitMode}
                        onPresetMinutesChange={setSplitPresetMinutes}
                        onCustomMinutesChange={setCustomSplitMinutes}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <SliderRow label="Attack" value={attackMs} min={AUDIO_ATTACK_RANGE.min} max={AUDIO_ATTACK_RANGE.max} step={1} unit="ms" onChange={setAttackMs} disabled={!soundOn || !presetSupportsPitchControl(preset)} />
                      <SliderRow label="Release" value={releaseMs} min={AUDIO_RELEASE_RANGE.min} max={AUDIO_RELEASE_RANGE.max} step={1} unit="ms" onChange={setReleaseMs} disabled={!soundOn || !presetSupportsPitchControl(preset)} />
                    </div>
                  </div>

                </div>
              ) : null}

              {advancedOpen ? (
                <div className="mt-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={fileNameId} className="text-sm font-semibold text-slate-700">File name</label>
<input id={fileNameId} value={fileName} onChange={(e) => setFileName(e.target.value)} className="mt-2 w-full rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold focus:outline-none focus:ring-0 focus-visible:outline-none" placeholder={defaultFileName} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={sampleRateId} className="text-sm font-semibold text-slate-700">Sample rate</label>
                        <select id={sampleRateId} value={sampleRate} onChange={(e) => setSampleRate(sanitizeAudioSampleRate(Number(e.target.value)))} className="mt-2 w-full cursor-pointer rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none">
                          <option value={22050}>22050</option>
                          <option value={44100}>44100</option>
                          <option value={48000}>48000</option>
                        </select>
                      </div>
                      <SliderRow label="Lead-in silence" value={leadInMs} min={AUDIO_LEAD_IN_RANGE.min} max={AUDIO_LEAD_IN_RANGE.max} step={50} unit="ms" onChange={setLeadInMs} disabled={exportControlsLocked} />
                      <SliderRow label="Tail padding" value={tailMs} min={AUDIO_TAIL_RANGE.min} max={AUDIO_TAIL_RANGE.max} step={10} unit="ms" onChange={setTailMs} disabled={exportControlsLocked} />
                    </div>
                  </div>

                  {plannedFormat === "mp3" ? (
                    <div className="mt-4 rounded-2xl bg-[#fffdf8] p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-extrabold text-sky-900">Choose your audio download</h3>
                          <p className="mt-1 text-sm text-slate-700">Use WAV for lossless editing and MP3 for smaller shareable files.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-semibold text-slate-700" htmlFor={`${safePrefix}_mp3_kbps`}>MP3 kbps</label>
                          <select id={`${safePrefix}_mp3_kbps`} value={mp3Kbps} onChange={(e) => setMp3Kbps(sanitizeMp3Bitrate(Number(e.target.value)))} className="cursor-pointer rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none">
                            <option value={96}>96</option>
                            <option value={128}>128</option>
                            <option value={192}>192</option>
                            <option value={256}>256</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  

                  {showExportPlan ? <ExportPlanSummary plan={exportPlan} /> : null}
                  {exportBlockedMessage ? (
                    <p role="alert" className="mt-3 text-sm font-semibold text-slate-700">
                      {exportBlockedMessage}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={restoreExportDefaults}
                      disabled={exportControlsLocked}
                      className="min-h-10 cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-[#fffaf2] hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Restore defaults
                    </button>
                  </div>

                  <ExportJobStatus
                    state={audioExport.state}
                    isActive={audioExport.isActive}
                    onCancel={() => audioExport.cancel()}
                    onReset={audioExport.reset}
                    onRetry={() => void audioExport.retry()}
                  />
                </div>
              ) : null}

              {advancedOpen ? (
                <p className="mt-4 text-xs text-slate-500">
                  Audio is generated in your browser. WAV rendering is local.
                  MP3 download is encoded in the browser when selected.
                </p>
              ) : null}
              </div>
            </div>
      </section>

        <div className={isSoundPage ? "rounded-xl bg-[#fffaf2]/45 p-5 sm:p-7" : ""}>
             
              {isSoundPage ? (
                <>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["sound generator", "audio generator", "sound maker", "MP3 generator", "beep generator", "tone generator"].map((label) => (
                      <span key={label} className="rounded-lg bg-[#fffdf8] px-3 py-1.5 text-sm font-semibold text-slate-900">
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    {heroStats.map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-[#fffdf8] p-4">
                        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
                        <p className="mt-1 text-lg font-extrabold text-sky-950">{value}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
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

function clampNum(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatMs(ms: number) {
  if (!ms || ms <= 0) return "0s";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

function presetLabel(preset: SoundPreset) {
  return getAudioPresetShortLabel(preset);
}
