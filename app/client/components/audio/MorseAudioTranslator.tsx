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
  ToolOutputPanel,
  ToolPanel,
  ToolTextarea,
} from "~/client/components/shared/ToolWorkspace";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import PlaybackToggleGroup from "~/client/components/shared/PlaybackToggleGroup";
import { AudioPresetOptions } from "~/client/components/shared/AudioPresetPicker";
import { getAudioPresetDefaults } from "~/client/components/shared/audioPresetRegistry";
import { presetSupportsPitchControl } from "~/client/components/shared/audioToneSynthesis";
import {
  ActionButton,
  ActionRow,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
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
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { hasPlayableMorse } from "~/client/components/shared/morseTiming";
import {
  AUDIO_ATTACK_RANGE,
  AUDIO_PITCH_RANGE,
  AUDIO_RELEASE_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  AUDIO_TAIL_RANGE,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
} from "~/client/components/shared/morseSettings";
import { readQueryPrefillValue } from "~/client/components/shared/queryPrefill";
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
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
} from "~/client/assets/svg/Icons";

type SourceMode = "text" | "morse";
const SOURCE_MODES = ["text", "morse"] as const;
const STROBE_WARNING_ID = "audio-translator-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "audio-translator-flash-disabled";
const AUDIO_SPLIT_MODES = ["none", "duration", "custom"] as const;
const AUDIO_TOOL_EXAMPLES = HOME_TOOL_EXAMPLES.filter(
  (example) => example !== "I love Morse code",
);
const focusOutline =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";
const ACTIVE_CONTROL = "bg-slate-950 text-sky-100";
const HOME_SOFT_CONTROL_DARK =
  "bg-white/88 text-slate-900 hover:bg-slate-900 hover:text-sky-100";
const DARK_PANEL_BUTTON =
  "bg-slate-700/95 text-slate-100 hover:bg-slate-800 hover:text-white";
const DARK_PANEL_DISABLED =
  "cursor-not-allowed bg-slate-800/60 text-slate-500";

export default function MorseAudioTranslator({
  enableQueryPrefill = false,
}: {
  enableQueryPrefill?: boolean;
}) {
  const player = useMorseAudio();
  const queryPrefillApplied = React.useRef(false);

  const [sourceMode, setSourceMode] = React.useState<SourceMode>("text");
  const [text, setText] = React.useState("sos help");
  const [morse, setMorse] = React.useState("... --- ...");
  const computedMorse = React.useMemo(() => textToMorse(text), [text]);

  const activeCode = React.useMemo(() => {
    return sourceMode === "text" ? computedMorse : morse;
  }, [sourceMode, computedMorse, morse]);

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
  const [fileName, setFileName] = React.useState("morse-audio");
  const [sampleRate, setSampleRate] =
    React.useState<22050 | 44100 | 48000>(44100);
  const [tailMs, setTailMs] = React.useState<number>(120);
  const [plannedFormat, setPlannedFormat] = React.useState<"mp3" | "wav">("mp3");
  const [splitMode, setSplitMode] = React.useState<MorseAudioSplitMode>("none");
  const [splitPresetMinutes, setSplitPresetMinutes] = React.useState(15);
  const [customSplitMinutes, setCustomSplitMinutes] = React.useState("");
  const [sourceSaveNotice, setSourceSaveNotice] = React.useState("");
  const [hydrated, setHydrated] = React.useState(false);
  const flashLamp = useFlashLampState(hydrated && flash);
  const { disableFlashEffects, flashAllowed } = flashLamp;
  const effectiveFlash = flashAllowed && flash;

  React.useEffect(() => {
    setSourceMode(readStoredEnum("mw_audio_source", SOURCE_MODES, "text"));
    setText(readStoredString("mw_audio_text", "sos help", { maxLength: 25000 }));
    setMorse(
      readStoredString("mw_audio_morse", "... --- ...", { maxLength: 25000 }),
    );
    const storedCharWpm = readStoredNumber("mw_audio_wpm", {
      fallback: 18,
      min: AUDIO_SPEED_RANGE.min,
      max: AUDIO_SPEED_RANGE.max,
      integer: true,
    });
    setCharWpm(storedCharWpm);
    setFarnsworthWpm(
      readStoredNumber("mw_audio_fwpm", {
        fallback: 12,
        min: AUDIO_SPEED_RANGE.min,
        max: storedCharWpm,
        integer: true,
      }),
    );
    setToneHz(
      readStoredNumber("mw_audio_hz", {
        fallback: 650,
        min: AUDIO_PITCH_RANGE.min,
        max: AUDIO_PITCH_RANGE.max,
        integer: true,
      }),
    );
    setVolume(
      readStoredNumber("mw_audio_vol", {
        fallback: 0.75,
        min: VOLUME_RANGE.min,
        max: VOLUME_RANGE.max,
      }),
    );
    setPreset(
      sanitizeAudioGeneratorPreset(
        readStoredString("mw_audio_preset", "cw_radio", {
          maxLength: 64,
        }),
      ),
    );
    setAttackMs(
      readStoredNumber("mw_audio_attack", {
        fallback: 8,
        min: AUDIO_ATTACK_RANGE.min,
        max: AUDIO_ATTACK_RANGE.max,
        integer: true,
      }),
    );
    setReleaseMs(
      readStoredNumber("mw_audio_release", {
        fallback: 12,
        min: AUDIO_RELEASE_RANGE.min,
        max: AUDIO_RELEASE_RANGE.max,
        integer: true,
      }),
    );
    setRepeat(readStoredBoolean("mw_audio_repeat", false));
    setSoundOn(readStoredBoolean("mw_audio_sound", true));
    setFlash(readStoredBoolean("mw_audio_flash", false));
    setAdvancedOpen(readStoredBoolean("mw_audio_adv_open", true));
    setFileName(
      readStoredString("mw_audio_filename", "morse-audio", { maxLength: 120 }),
    );
    setSampleRate(readStoredNumberEnum("mw_audio_sr", AUDIO_SAMPLE_RATES, 44100));
    setTailMs(
      readStoredNumber("mw_audio_tail", {
        fallback: 120,
        min: AUDIO_TAIL_RANGE.min,
        max: AUDIO_TAIL_RANGE.max,
        integer: true,
      }),
    );
    setPlannedFormat(readStoredEnum("mw_audio_format", ["mp3", "wav"] as const, "mp3"));
    setSplitMode(readStoredEnum("mw_audio_split_mode", AUDIO_SPLIT_MODES, "none"));
    setSplitPresetMinutes(
      readStoredNumberEnum(
        "mw_audio_split_minutes",
        MORSE_AUDIO_SPLIT_PRESET_MINUTES,
        15,
      ),
    );
    setCustomSplitMinutes(
      readStoredString("mw_audio_custom_split_minutes", "", { maxLength: 12 }),
    );
    setHydrated(true);
  }, []);

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

  // Live update audio settings during playback/paused
  React.useEffect(() => {
    if (!hydrated) return;

    player.setLiveOptions({
      code: activeCode,
      wpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      farnsworthWpm: clampFarnsworthWpm(
        farnsworthWpm,
        clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      ),
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash: effectiveFlash,
      attackMs,
      releaseMs,
    });
  }, [
    hydrated,
    player,
    activeCode,
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    soundOn,
    preset,
    repeat,
    effectiveFlash,
    attackMs,
    releaseMs,
  ]);

  React.useEffect(() => {
    if (flashAllowed) return;
    setFlash(false);
    player.setLiveOptions({ flash: false });
  }, [flashAllowed, player]);

  // Persist settings as they change
  React.useEffect(() => {
    if (!hydrated) return;

    writeStr("mw_audio_source", sourceMode);
    const textWrite = safeWriteStorageResult("mw_audio_text", text);
    const morseWrite = safeWriteStorageResult("mw_audio_morse", morse);
    setSourceSaveNotice(sourceStorageWriteMessage([textWrite, morseWrite]));

    writeNum("mw_audio_wpm", charWpm);
    writeNum("mw_audio_fwpm", farnsworthWpm);
    writeNum("mw_audio_hz", toneHz);
    writeNum("mw_audio_vol", volume);
    writeStr("mw_audio_preset", preset);

    writeNum("mw_audio_attack", attackMs);
    writeNum("mw_audio_release", releaseMs);
    writeBool("mw_audio_repeat", repeat);
    writeBool("mw_audio_sound", soundOn);
    writeBool("mw_audio_flash", flash);

    writeBool("mw_audio_adv_open", advancedOpen);
    writeStr("mw_audio_filename", fileName);
    writeNum("mw_audio_sr", sampleRate);
    writeNum("mw_audio_tail", tailMs);
    writeStr("mw_audio_format", plannedFormat);
    writeStr("mw_audio_split_mode", splitMode);
    writeNum("mw_audio_split_minutes", splitPresetMinutes);
    writeStr("mw_audio_custom_split_minutes", customSplitMinutes);
  }, [
    hydrated,
    sourceMode,
    text,
    morse,
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    preset,
    attackMs,
    releaseMs,
    repeat,
    soundOn,
    flash,
    advancedOpen,
    fileName,
    sampleRate,
    tailMs,
    plannedFormat,
    splitMode,
    splitPresetMinutes,
    customSplitMinutes,
  ]);

  const canPlay = React.useMemo(
    () => hasPlayableMorse(activeCode),
    [activeCode],
  );
  const durationMs = React.useMemo(() => {
    if (!canPlay) return 0;
    return player.estimateDurationMs({
      code: activeCode,
      wpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      farnsworthWpm: clampFarnsworthWpm(
        farnsworthWpm,
        clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      ),
    });
  }, [player, activeCode, canPlay, charWpm, farnsworthWpm]);

  const renderedSoundOn = hydrated ? soundOn : true;
  const renderedRepeat = hydrated ? repeat : false;
  const renderedFlash = hydrated ? effectiveFlash : false;
  const showStrobeWarning = flashLamp.shouldShowWholePageFlashWarning;
  const audioExportPlan = React.useMemo(
    () =>
      buildMorseExportPlan({
        baseFilename: fileName || "morse-audio",
        charWpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
        farnsworthWpm: clampFarnsworthWpm(
          farnsworthWpm,
          clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
        ),
        format: plannedFormat,
        kind: "audio",
        mp3Kbps: 128,
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
      customSplitMinutes,
      farnsworthWpm,
      fileName,
      morse,
      plannedFormat,
      sampleRate,
      sourceMode,
      splitMode,
      splitPresetMinutes,
      tailMs,
      text,
    ],
  );
  const audioExportKey = JSON.stringify({
    activeCode,
    attackMs,
    charWpm,
    farnsworthWpm,
    fileName,
    preset,
    releaseMs,
    sampleRate,
    soundOn,
    plannedFormat,
    splitMode,
    splitPresetMinutes,
    customSplitMinutes,
    tailMs,
    toneHz,
    volume,
  });
  const audioExport = useMorseAudioExportJob(audioExportKey);
  const exportControlsLocked = audioExport.isActive;
  const isExportingAudio = audioExport.state.status === "running";
  const customSplitError =
    splitMode === "custom"
      ? validateCustomMorseAudioSplitMinutes(customSplitMinutes)
      : "";
  const exportBlockedMessage = audioExportPlan.singleFileUnsafe
    ? getMorseAudioNoSplitSafetyMessage(plannedFormat)
    : customSplitError;
  const showExportPlan =
    splitMode !== "none" ||
    audioExportPlan.multiPart ||
    audioExportPlan.singleFileUnsafe ||
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

  const unsupportedPlain = React.useMemo(
    () => getUnsupportedTextCharacters(text),
    [text],
  );

  const morseIssues = React.useMemo(() => {
    const issues: string[] = [];
    if (sourceMode !== "morse") return issues;
    if (!morse) return issues;

    const { invalidChars } = normalizeMorseForDecoding(morse);
    if (invalidChars.length) {
      issues.push(
        `Invalid character${invalidChars.length > 1 ? "s" : ""}: ${invalidChars.join(" ")}`,
      );
    }
    return issues;
  }, [sourceMode, morse]);

  const setFeedback = React.useCallback(
    (key: "sound" | "repeat" | "flash", next: boolean) => {
      if (key === "flash" && !flashAllowed) return;

      const current = { sound: soundOn, repeat, flash: effectiveFlash };
      const updated = { ...current, [key]: key === "flash" ? next && flashAllowed : next };

      if (key === "sound") setSoundOn(next);
      if (key === "repeat") setRepeat(next);
      if (key === "flash") setFlash(next && flashAllowed);

      // If sound is turned off while playing, mute instantly via live options
      player.setLiveOptions({
        soundEnabled: updated.sound,
        flash: updated.flash,
      });
    },
    [soundOn, repeat, effectiveFlash, flashAllowed, player],
  );

  const handleCopyMorse = async () => {
    const s = activeCode.trim();
    if (!s) return;
    const didCopy = await copyTextToClipboard(s);
    if (!didCopy) return;
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
      farnsworthWpm: clampFarnsworthWpm(
        farnsworthWpm,
        clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      ),
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

  const handleExportAudio = async () => {
    if (isExportingAudio || exportControlsLocked) return;
    if (!canPlay || !soundOn || exportBlockedMessage) return;
    player.stop();
    await audioExport.start({
      plan: audioExportPlan,
      settings: {
        attackMs,
        charWpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
        farnsworthWpm: clampFarnsworthWpm(
          farnsworthWpm,
          clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
        ),
        format: plannedFormat,
        mp3Kbps: 128,
        pitch: toneHz,
        releaseMs,
        sampleRate,
        tailPaddingMs: tailMs,
        tonePreset: preset,
        volume,
      },
    });
  };

  return (
    <div style={styles.page}>
      <section className="mw-tool-section mt-0">
            <div>
              <ToolHero
                eyebrow="Audio tool"
                title="Morse Code Audio Generator"
                lead="Convert text or pasted Morse into playable audio. Adjust speed, Farnsworth spacing, tone, pitch, and volume, then save MP3 or WAV from your browser."
              />
              <div className="pb-4 pt-4 sm:pb-5 sm:pt-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex w-full gap-2 rounded-lg sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSourceMode("text")}
                    className={`w-1/2 cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition active:scale-95 sm:w-auto ${focusOutline} ${
                      sourceMode === "text"
                        ? ACTIVE_CONTROL
                        : HOME_SOFT_CONTROL_DARK
                    }`}
                    aria-pressed={sourceMode === "text"}
                  >
                    Text to Morse audio
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceMode("morse")}
                    className={`w-1/2 cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition active:scale-95 sm:w-auto ${focusOutline} ${
                      sourceMode === "morse"
                        ? ACTIVE_CONTROL
                        : HOME_SOFT_CONTROL_DARK
                    }`}
                    aria-pressed={sourceMode === "morse"}
                  >
                    Morse to audio
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {AUDIO_TOOL_EXAMPLES.map((example) => (
                    <button
                      type="button"
                      key={example}
                      onClick={() =>
                        sourceMode === "text"
                          ? setText(example)
                          : setMorse(textToMorse(example))
                      }
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${focusOutline} ${HOME_SOFT_CONTROL_DARK}`}
                    >
                      Try &ldquo;{example}&rdquo;
                    </button>
                  ))}
                </div>

                <p className="shrink-0 text-sm leading-relaxed text-slate-600 lg:ml-auto lg:text-right">
                  Est. time: {formatMs(durationMs).toString()}
                </p>
              </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ToolPanel
                  label={sourceMode === "text" ? "Input (Text)" : "Input (Morse)"}
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
                        id="mw_audio_source"
                        aria-label="Input (Text)"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Example: Hello world"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      {Object.keys(unsupportedPlain).length > 0 && (
                        <p className="px-4 pb-3 text-xs font-medium text-slate-600">
                          Unsupported characters are ignored:{" "}
                          {Object.entries(unsupportedPlain)
                            .map(([ch, n]) => `${ch}×${n}`)
                            .join(", ")}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <ToolTextarea
                        id="mw_audio_source"
                        aria-label="Input (Morse)"
                        value={morse}
                        onChange={(e) => setMorse(e.target.value)}
                        placeholder="Example: ... --- ..."
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      {morseIssues.length > 0 && (
                        <p className="px-4 pb-3 text-xs font-medium text-slate-600">
                          {morseIssues.join(" ")}
                        </p>
                      )}
                    </>
                  )}
                </ToolPanel>

                <ToolOutputPanel
                  label="Output (Morse)"
                  footer={
                    <ActionRow className="items-center">
                      <ActionButton
                        unstyled
                        onClick={handleClearOutput}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${focusOutline} ${DARK_PANEL_BUTTON}`}
                        leadingIcon={
                          <TrashIcon size={16} title={undefined} aria-hidden="true" />
                        }
                      >
                        Clear output
                      </ActionButton>

                      <ActionButton
                        unstyled
                        onClick={handleCopyMorse}
                        disabled={!canPlay}
                        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${focusOutline} ${
                          canPlay
                            ? `cursor-pointer ${DARK_PANEL_BUTTON}`
                            : DARK_PANEL_DISABLED
                        }`}
                        leadingIcon={
                          copied === "morse" ? (
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
                        <span>{copied === "morse" ? "Copied" : "Copy Output"}</span>
                      </ActionButton>
                    </ActionRow>
                  }
                >
                  <pre className="min-h-[10rem] max-h-[18rem] overflow-auto whitespace-pre-wrap break-words bg-transparent p-4 font-mono text-sm leading-relaxed text-sky-100 sm:text-base">
                    {activeCode.trim() || "Your Morse output will appear here."}
                  </pre>
                </ToolOutputPanel>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <ToolButton
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
                  active={player.state !== "playing" && canPlay && player.isSupported}
                  className="flex justify-center items-center gap-2 rounded-xl py-2.5"
                  tone={player.state === "playing" ? "light" : "dark"}
                >
                  {player.state === "playing" ? (
                    <PauseIcon size={22} title="Pause audio" />
                  ) : (
                    <PlayIcon
                      size={22}
                      title={
                        player.state === "paused"
                          ? "Resume audio"
                          : "Play audio"
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
                </ToolButton>

                <ToolButton
                  onClick={player.stop}
                  disabled={!player.isSupported || player.state === "idle"}
                  tone="light"
                  className="flex justify-center items-center gap-2 rounded-xl py-2.5"
                >
                  <StopIcon size={22} title="Stop audio" />
                  <span>Stop</span>
                </ToolButton>

                <ToolButton
                  onClick={handleExportAudio}
                  disabled={
                    !canPlay ||
                    !renderedSoundOn ||
                    exportControlsLocked ||
                    Boolean(exportBlockedMessage)
                  }
                  tone="light"
                  className="flex justify-center items-center gap-2 rounded-xl py-2.5"
                >
                  <DownloadIcon size={22} title={undefined} aria-hidden="true" />
                  <span>
                    {isExportingAudio
                      ? `Preparing ${plannedFormat.toUpperCase()} audio`
                      : `Save ${plannedFormat.toUpperCase()} audio`}
                  </span>
                </ToolButton>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-extrabold text-sky-950">
                  Audio controls
                </h2>

                <div className="sm:justify-end">
                  <PlaybackToggleGroup
                    sound={{ checked: renderedSoundOn, onChange: (value) => setFeedback("sound", value) }}
                    repeat={{ checked: renderedRepeat, onChange: (value) => setFeedback("repeat", value) }}
                    flash={{
                      checked: renderedFlash,
                      onChange: (value) => setFeedback("flash", value),
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
                    label="Morse audio flash lamp"
                    size="sm"
                  />
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <SliderRow
                  label="Character speed"
                  value={charWpm}
                  min={AUDIO_SPEED_RANGE.min}
                  max={AUDIO_SPEED_RANGE.max}
                  step={1}
                  unit="WPM"
                  onChange={handleCharWpmChange}
                />
                <SliderRow
                  label="Farnsworth spacing"
                  value={farnsworthWpm}
                  min={AUDIO_SPEED_RANGE.min}
                  max={Math.max(AUDIO_SPEED_RANGE.min, charWpm)}
                  step={1}
                  unit="WPM"
                  onChange={handleFarnsworthWpmChange}
                />
                <SliderRow
                  label="Pitch"
                  value={toneHz}
                  min={AUDIO_PITCH_RANGE.min}
                  max={AUDIO_PITCH_RANGE.max}
                  step={10}
                  unit="Hz"
                  onChange={setToneHz}
                    disabled={!renderedSoundOn || !presetSupportsPitchControl(preset)}
                />
                <SliderRow
                  label="Volume"
                  value={Math.round(volume * 100)}
                  min={VOLUME_RANGE.min * 100}
                  max={VOLUME_RANGE.max * 100}
                  step={1}
                  unit="%"
                  onChange={(v) => setVolume(v / 100)}
                  disabled={!renderedSoundOn}
                />
              </div>

              {disableFlashEffects ? (
                <FlashEffectsDisabledNotice
                  id={FLASH_DISABLED_NOTICE_ID}
                  className="mt-3"
                />
              ) : showStrobeWarning ? (
                <StrobeWarning id={STROBE_WARNING_ID} className="mt-3" />
              ) : null}

              <div className="mt-4">
                <ActionButton
                  unstyled
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none active:scale-95"
                  leadingIcon={
                    <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
                  }
                >
                  {advancedOpen ? "Hide advanced" : "Show advanced"}
                </ActionButton>
              </div>

              {advancedOpen && (
                <div className="mt-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <LabeledAudioSelect
                      label="Tone preset"
                      value={preset}
                      onChange={(e) =>
                        handlePresetChange(
                          sanitizeAudioGeneratorPreset(e.target.value),
                        )
                      }
                    >
                        <AudioPresetOptions context="audio" />
                    </LabeledAudioSelect>

                    <div className="grid grid-cols-2 gap-3">
                      <SliderRow
                        label="Attack"
                        value={attackMs}
                        min={AUDIO_ATTACK_RANGE.min}
                        max={AUDIO_ATTACK_RANGE.max}
                        step={1}
                        unit="ms"
                        onChange={setAttackMs}
                        disabled={!renderedSoundOn || !presetSupportsPitchControl(preset)}
                      />
                      <SliderRow
                        label="Release"
                        value={releaseMs}
                        min={AUDIO_RELEASE_RANGE.min}
                        max={AUDIO_RELEASE_RANGE.max}
                        step={1}
                        unit="ms"
                        onChange={setReleaseMs}
                        disabled={!renderedSoundOn || !presetSupportsPitchControl(preset)}
                      />
                    </div>
                  </div>

                </div>
              )}

              {advancedOpen && (
                <div className="mt-4 pt-4">
                  <AudioExportFormatSplitControls
                    idPrefix="mw-audio"
                    format={plannedFormat}
                    splitMode={splitMode}
                    presetMinutes={splitPresetMinutes}
                    customMinutes={customSplitMinutes}
                    disabled={!hydrated || exportControlsLocked}
                    onFormatChange={setPlannedFormat}
                    onSplitModeChange={setSplitMode}
                    onPresetMinutesChange={setSplitPresetMinutes}
                    onCustomMinutesChange={setCustomSplitMinutes}
                  />
                  {showExportPlan ? (
                    <ExportPlanSummary plan={audioExportPlan} />
                  ) : null}
                  {exportBlockedMessage ? (
                    <p role="alert" className="mt-3 text-sm font-semibold text-slate-700">
                      {exportBlockedMessage}
                    </p>
                  ) : null}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <LabeledAudioInput
                      label="File name"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="morse-audio"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <LabeledAudioSelect
                        label="Sample rate"
                        value={sampleRate}
                        onChange={(e) =>
                          setSampleRate(sanitizeAudioSampleRate(Number(e.target.value)))
                        }
                        className="mt-2 w-full cursor-pointer rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold hover:bg-slate-900 hover:text-sky-100 focus:outline-none"
                      >
                          <option value={22050}>22050</option>
                          <option value={44100}>44100</option>
                          <option value={48000}>48000</option>
                      </LabeledAudioSelect>

                      <SliderRow
                        label="Tail padding"
                        value={tailMs}
                        min={AUDIO_TAIL_RANGE.min}
                        max={AUDIO_TAIL_RANGE.max}
                        step={10}
                        unit="ms"
                        onChange={setTailMs}
                        disabled={!renderedSoundOn}
                      />
                    </div>
                  </div>

                  <ExportJobStatus
                    state={audioExport.state}
                    isActive={audioExport.isActive}
                    onCancel={() => audioExport.cancel()}
                    onReset={audioExport.reset}
                    onRetry={() => void audioExport.retry()}
                  />
                  <p className="mt-4 text-xs text-slate-500">
                    Audio is generated in your browser. WAV rendering is local.
                    MP3 download is encoded in the browser when selected.
                  </p>
                </div>
              )}

            </div>
      </section>
    </div>
  );
}
function LabeledAudioSelect({
  label,
  value,
  onChange,
  children,
  className,
}: {
  label: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  children: React.ReactNode;
  className?: string;
}) {
  const id = React.useId();

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
          className={
            className ??
          "mt-2 w-full cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none"
        }
      >
        {children}
      </select>
    </div>
  );
}

function LabeledAudioInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}) {
  const id = React.useId();

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold focus:outline-none focus:ring-0 focus-visible:outline-none"
        placeholder={placeholder}
      />
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
