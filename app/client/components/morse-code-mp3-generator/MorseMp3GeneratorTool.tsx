import * as React from "react";

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
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { hasPlayableMorse } from "~/client/components/shared/morseTiming";
import {
  AUDIO_ATTACK_RANGE,
  AUDIO_LEAD_IN_RANGE,
  AUDIO_PITCH_RANGE,
  AUDIO_RELEASE_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  AUDIO_TAIL_RANGE,
  MP3_BITRATE_LABELS,
  MP3_BITRATES,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
  sanitizeMp3Bitrate,
} from "~/client/components/shared/morseSettings";
import { AudioPresetOptions } from "~/client/components/shared/AudioPresetPicker";
import { getAudioPresetDefaults } from "~/client/components/shared/audioPresetRegistry";
import { presetSupportsPitchControl } from "~/client/components/shared/audioToneSynthesis";
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
import StrobeWarning, {
  FlashEffectsDisabledNotice,
} from "~/client/components/shared/StrobeWarning";
import FlashLamp from "~/client/components/shared/FlashLamp";
import { useFlashLampState } from "~/client/components/shared/useFlashSafety";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import {
  ToolButton,
  ToolModeButton,
  ToolOutputTextarea,
  ToolOutputPanel,
  ToolPanel,
  ToolSampleButtons,
  ToolTextarea,
} from "~/client/components/shared/ToolWorkspace";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import StatusMessage from "~/client/components/shared/ui/StatusMessage";
import PlaybackToggleGroup from "~/client/components/shared/PlaybackToggleGroup";
import AdvancedSettingsToggle from "~/client/components/shared/AdvancedSettingsToggle";
import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  VolumeIcon,
} from "~/client/assets/svg/Icons";

type SourceMode = "text" | "morse";
const SOURCE_MODES = ["text", "morse"] as const;

const EXAMPLES = ["SOS", "HELLO WORLD", "HELP ME", "I LOVE YOU", "TEST"];
const DEFAULT_TEXT = "sos help";
const DEFAULT_MORSE = "... --- ...";
const STROBE_WARNING_ID = "mp3-generator-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "mp3-generator-flash-disabled";
const AUDIO_SPLIT_MODES = ["none", "duration", "custom"] as const;

export default function MorseMp3GeneratorTool() {
  const player = useMorseAudio();
  const sourceInputId = React.useId();
  const fileNameId = React.useId();
  const mp3KbpsId = React.useId();
  const sampleRateId = React.useId();
  const soundTypeId = React.useId();

  const [sourceMode, setSourceMode] = React.useState<SourceMode>("text");
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [morse, setMorse] = React.useState(DEFAULT_MORSE);
  const [charWpm, setCharWpm] = React.useState(18);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(12);
  const [toneHz, setToneHz] = React.useState(650);
  const [volume, setVolume] = React.useState(0.75);
  const [preset, setPreset] = React.useState<SoundPreset>("cw_radio");
  const [attackMs, setAttackMs] = React.useState(8);
  const [releaseMs, setReleaseMs] = React.useState(12);
  const [repeat, setRepeat] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(true);
  const [flash, setFlash] = React.useState(false);
  const [advancedOpen, setAdvancedOpen] = React.useState(true);
  const [fileName, setFileName] = React.useState("morse-code");
  const [sampleRate, setSampleRate] = React.useState<22050 | 44100 | 48000>(
    44100,
  );
  const [leadInMs, setLeadInMs] = React.useState(0);
  const [tailMs, setTailMs] = React.useState(120);
  const [mp3Kbps, setMp3Kbps] = React.useState(128);
  const [plannedFormat, setPlannedFormat] = React.useState<"mp3" | "wav">("mp3");
  const [splitMode, setSplitMode] = React.useState<MorseAudioSplitMode>("none");
  const [splitPresetMinutes, setSplitPresetMinutes] = React.useState(15);
  const [customSplitMinutes, setCustomSplitMinutes] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [sourceSaveNotice, setSourceSaveNotice] = React.useState("");

  React.useEffect(() => {
    setSourceMode(readStoredEnum("mw_audio_source", SOURCE_MODES, "text"));
    setText(readStoredString("mw_audio_text", DEFAULT_TEXT, { maxLength: 25000 }));
    setMorse(
      readStoredString("mw_audio_morse", DEFAULT_MORSE, { maxLength: 25000 }),
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
        readStoredString("mw_audio_preset", "cw_radio", { maxLength: 64 }),
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
      readStoredString("mw_mp3_filename", "morse-code", { maxLength: 120 }),
    );
    setSampleRate(readStoredNumberEnum("mw_audio_sr", AUDIO_SAMPLE_RATES, 44100));
    setLeadInMs(
      readStoredNumber("mw_audio_lead_in", {
        fallback: 0,
        min: AUDIO_LEAD_IN_RANGE.min,
        max: AUDIO_LEAD_IN_RANGE.max,
        integer: true,
      }),
    );
    setTailMs(
      readStoredNumber("mw_audio_tail", {
        fallback: 120,
        min: AUDIO_TAIL_RANGE.min,
        max: AUDIO_TAIL_RANGE.max,
        integer: true,
      }),
    );
    setMp3Kbps(readStoredNumberEnum("mw_mp3_kbps", MP3_BITRATES, 128));
    setPlannedFormat(readStoredEnum("mw_mp3_format", ["mp3", "wav"], "mp3"));
    setSplitMode(readStoredEnum("mw_mp3_split_mode", AUDIO_SPLIT_MODES, "none"));
    setSplitPresetMinutes(
      readStoredNumberEnum(
        "mw_mp3_split_minutes",
        MORSE_AUDIO_SPLIT_PRESET_MINUTES,
        15,
      ),
    );
    setCustomSplitMinutes(
      readStoredString("mw_mp3_custom_split_minutes", "", { maxLength: 12 }),
    );
    setHydrated(true);
  }, []);

  const computedMorse = React.useMemo(() => textToMorse(text), [text]);
  const activeCode = sourceMode === "text" ? computedMorse : morse;
  const hasSourceCode = activeCode.trim().length > 0;
  const canRender = React.useMemo(
    () => hasPlayableMorse(activeCode),
    [activeCode],
  );
  const flashLamp = useFlashLampState(hydrated && flash);
  const { disableFlashEffects, flashAllowed } = flashLamp;
  const effectiveFlash = flashAllowed && flash;
  const renderedSoundOn = hydrated ? soundOn : true;
  const renderedRepeat = hydrated ? repeat : false;
  const renderedFlash = hydrated ? effectiveFlash : false;
  const showStrobeWarning = flashLamp.shouldShowWholePageFlashWarning;

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
    writeNum("mw_audio_sr", sampleRate);
    writeNum("mw_audio_lead_in", leadInMs);
    writeNum("mw_audio_tail", tailMs);
    writeStr("mw_mp3_filename", fileName);
    writeNum("mw_mp3_kbps", mp3Kbps);
    writeStr("mw_mp3_format", plannedFormat);
    writeStr("mw_mp3_split_mode", splitMode);
    writeNum("mw_mp3_split_minutes", splitPresetMinutes);
    writeStr("mw_mp3_custom_split_minutes", customSplitMinutes);
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
    sampleRate,
    leadInMs,
    tailMs,
    fileName,
    mp3Kbps,
    plannedFormat,
    splitMode,
    splitPresetMinutes,
    customSplitMinutes,
  ]);

  const unsupportedPlain = React.useMemo(
    () => getUnsupportedTextCharacters(text),
    [text],
  );

  const morseIssues = React.useMemo(() => {
    if (sourceMode !== "morse" || !morse.trim()) return [];
    return normalizeMorseForDecoding(morse).invalidChars;
  }, [sourceMode, morse]);

  const durationMs = React.useMemo(() => {
    if (!canRender) return 0;
    return player.estimateDurationMs({
      code: activeCode,
      wpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max)),
    });
  }, [activeCode, canRender, charWpm, farnsworthWpm, player]);

  const previewAudioOptions = React.useMemo(
    () => ({
      code: activeCode,
      wpm: clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      farnsworthWpm: clampFarnsworthWpm(farnsworthWpm, clampNum(charWpm, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max)),
      hz: clampNum(toneHz, 200, 1600),
      volume: clampNum(volume, 0, 1),
      soundEnabled: soundOn,
      preset,
      repeat,
      flash: effectiveFlash,
      attackMs: clampNum(attackMs, 0, 200),
      releaseMs: clampNum(releaseMs, 0, 400),
    }),
    [
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
    ],
  );

  React.useEffect(() => {
    if (!hydrated) return;
    const livePlayer = player as typeof player & {
      setLiveOptions?: (options: Partial<typeof previewAudioOptions>) => void;
    };
    livePlayer.setLiveOptions?.(previewAudioOptions);
  }, [hydrated, player, previewAudioOptions]);

  React.useEffect(() => {
    if (flashAllowed) return;
    setFlash(false);
    const livePlayer = player as typeof player & {
      setLiveOptions?: (options: Partial<typeof previewAudioOptions>) => void;
    };
    livePlayer.setLiveOptions?.({ flash: false });
  }, [flashAllowed, player, previewAudioOptions]);

  const buildAudioPlan = React.useCallback(
    (format: "mp3" | "wav") =>
      buildMorseExportPlan({
        baseFilename: fileName || "morse-code",
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

  const handlePickExample = (exampleText: string) => {
    if (sourceMode === "text") {
      setText(exampleText);
    } else {
      setMorse(textToMorse(exampleText));
    }
  };

  const handleClear = () => {
    if (sourceMode === "text") {
      setText("");
    } else {
      setMorse("");
    }
    setCopied(false);
    player.stop();
  };

  const handleCopyMorse = async () => {
    const value = activeCode.trim();
    if (!value) return;
    const didCopy = await copyTextToClipboard(value);
    if (!didCopy) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1100);
  };

  const handlePlay = async () => {
    if (!canRender) return;
    await player.play(previewAudioOptions);
  };

  const handleDownload = async (format: "mp3" | "wav") => {
    const plan = buildAudioPlan(format);
    if (
      !hasSourceCode ||
      !renderedSoundOn ||
      audioExport.isActive ||
      plan.singleFileUnsafe ||
      customSplitError
    ) {
      return;
    }
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

  const handleDownloadSelected = () => handleDownload(plannedFormat);

  const restoreExportDefaults = React.useCallback(() => {
    setFileName("morse-code");
    setSampleRate(44100);
    setLeadInMs(0);
    setTailMs(120);
    setMp3Kbps(128);
    setPlannedFormat("mp3");
    setSplitMode("none");
    setSplitPresetMinutes(15);
    setCustomSplitMinutes("");
    audioExport.reset();
  }, [audioExport]);

  const setFeedback = React.useCallback(
    (key: "sound" | "repeat" | "flash", nextValue: boolean) => {
      if (key === "flash" && !flashAllowed) return;
      if (key === "sound") setSoundOn(nextValue);
      if (key === "repeat") setRepeat(nextValue);
      if (key === "flash") setFlash(nextValue && flashAllowed);
    },
    [flashAllowed],
  );

  return (
    <section
      className="mw-tool-section mt-0"
      aria-labelledby="mp3-tool-title"
      data-mw-mp3-tool-ready={hydrated ? "true" : "false"}
    >
      <h2 id="mp3-tool-title" className="sr-only">
        Generate Morse audio as an MP3 file
      </h2>

      <div className="pb-4 pt-4 sm:pb-5 sm:pt-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="inline-flex w-full gap-2 rounded-lg sm:w-auto">
            <ToolModeButton
              active={sourceMode === "text"}
              onClick={() => setSourceMode("text")}
              hover="dark"
              className="w-1/2 rounded-md px-3 py-2 sm:w-auto"
            >
              Text input
            </ToolModeButton>
            <ToolModeButton
              active={sourceMode === "morse"}
              onClick={() => setSourceMode("morse")}
              hover="dark"
              className="w-1/2 rounded-md px-3 py-2 sm:w-auto"
            >
              Morse input
            </ToolModeButton>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolSampleButtons
              examples={EXAMPLES}
              hover="dark"
              onPick={handlePickExample}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolPanel
          label={sourceMode === "text" ? "Input (Text)" : "Input (Morse)"}
          badge="Source"
          footer={
            <div className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-slate-600">
              <span>
                {sourceSaveNotice ||
                  "Spaces separate letters. Use / between words."}
              </span>
              <span aria-hidden="true">Est. time: {formatMs(durationMs)}</span>
            </div>
          }
        >
          {sourceMode === "text" ? (
            <>
              <ToolTextarea
                id={sourceInputId}
                aria-label="Message to turn into MP3 audio"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                }}
                placeholder="Type a message, for example HELLO WORLD"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
              {Object.keys(unsupportedPlain).length > 0 ? (
                <p className="px-4 pb-3 text-sm font-semibold text-slate-600">
                  Unsupported characters are ignored:{" "}
                  {Object.entries(unsupportedPlain)
                    .map(([character, count]) => `${character} x ${count}`)
                    .join(", ")}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <ToolTextarea
                id={sourceInputId}
                aria-label="Morse code to turn into MP3 audio"
                value={morse}
                onChange={(event) => {
                  setMorse(event.target.value);
                }}
                placeholder="Paste Morse, for example ... --- ..."
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {morseIssues.length > 0 ? (
                <p className="px-4 pb-3 text-sm font-semibold text-slate-600">
                  Invalid Morse input characters: {morseIssues.join(" ")}
                </p>
              ) : null}
            </>
          )}
        </ToolPanel>

        <ToolOutputPanel
          label="Output (Morse)"
          badge="Result"
          footer={
            <div className="flex flex-wrap gap-2">
              <ToolButton
                type="button"
                tone="darkPanel"
                onClick={handleClear}
                className="rounded-lg"
              >
                <TrashIcon size={18} title={undefined} aria-hidden="true" />
                Clear
              </ToolButton>
              <ToolButton
                type="button"
                tone="darkPanel"
                onClick={handleCopyMorse}
                disabled={!canRender}
                className="rounded-lg"
              >
                {copied ? (
                  <CheckCircleIcon size={18} title={undefined} aria-hidden="true" />
                ) : (
                  <CopyIcon size={18} title={undefined} aria-hidden="true" />
                )}
                {copied ? "Copied" : "Copy Morse"}
              </ToolButton>
            </div>
          }
        >
          <ToolOutputTextarea
            aria-label="Generated Morse output"
            readOnly
            value={activeCode.trim()}
            placeholder="Generated Morse appears here."
            className="mw-output-text mw-input-placeholder min-h-[10rem] max-h-[18rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm leading-relaxed tracking-[0.14em] text-sky-100 outline-none placeholder:text-slate-400 focus:ring-0 focus-visible:outline-none sm:text-base"
          />
        </ToolOutputPanel>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <ToolButton
          type="button"
          tone={player.state === "playing" ? "light" : "dark"}
          active={player.state !== "playing" && canRender && player.isSupported}
          onClick={() => {
            if (player.state === "idle") {
              handlePlay();
            } else if (player.state === "playing") {
              player.pause();
            } else {
              player.resume();
            }
          }}
          disabled={
            player.state === "playing"
              ? !player.isSupported
              : !canRender || !player.isSupported
          }
          className="rounded-xl"
        >
          {player.state === "playing" ? (
            <PauseIcon size={20} title="Pause audio" />
          ) : (
            <PlayIcon size={20} title="Play audio" />
          )}
          {player.state === "playing"
            ? "Pause"
            : player.state === "paused"
              ? "Resume audio"
              : "Play audio"}
        </ToolButton>
        <ToolButton
          type="button"
          tone="light"
          onClick={player.stop}
          disabled={!player.isSupported || player.state === "idle"}
          hover="dark"
          className="rounded-xl"
        >
          <StopIcon size={20} title="Stop audio" />
          Stop
        </ToolButton>
        <ToolButton
          type="button"
          tone="light"
          onClick={handleDownloadSelected}
          disabled={!hydrated || !hasSourceCode || !renderedSoundOn || exportControlsLocked || Boolean(exportBlockedMessage)}
          hover="dark"
          className="rounded-xl"
        >
          <DownloadIcon size={20} title={undefined} aria-hidden="true" />
          {`Download ${plannedFormat.toUpperCase()}`}
        </ToolButton>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="mw-heading text-base font-extrabold text-sky-950">
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
            trailing={
              <FlashLamp
                active={flashLamp.active}
                disabled={!flashAllowed}
                label="Morse MP3 preview flash lamp"
                size="sm"
              />
            }
          />
        </div>
      </div>

      <div className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
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
          onChange={(nextValue) => setVolume(nextValue / 100)}
          disabled={!renderedSoundOn}
          icon={<VolumeIcon size={16} title={undefined} aria-hidden="true" />}
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
        <AdvancedSettingsToggle
          onToggle={() => setAdvancedOpen((value) => !value)}
          open={advancedOpen}
        />
      </div>

      {advancedOpen ? (
        <div className="mt-4 pt-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <LabeledSelect
              id={soundTypeId}
              label="Tone preset"
              value={preset}
              onChange={(event) =>
                handlePresetChange(
                  sanitizeAudioGeneratorPreset(event.target.value),
                )
              }
              disabled={!renderedSoundOn}
            >
              <AudioPresetOptions context="mp3Generator" />
            </LabeledSelect>

            <div className="grid gap-4 sm:grid-cols-2">
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
      ) : null}

      {advancedOpen ? (
        <>
      <div className="mt-7">
        <h2 className="mw-heading text-base font-extrabold text-sky-950">
          Export settings
        </h2>
      </div>

      <div className="mt-4">
        <AudioExportFormatSplitControls
          idPrefix="mw-mp3"
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
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:items-end">
        <LabeledInput
          id={fileNameId}
          label="File name"
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="morse-code"
        />
        {plannedFormat === "mp3" ? (
          <LabeledSelect
            id={mp3KbpsId}
            label="MP3 kbps"
            value={String(mp3Kbps)}
            onChange={(event) =>
              setMp3Kbps(sanitizeMp3Bitrate(Number(event.target.value)))
            }
          >
            {MP3_BITRATES.map((bitrate) => (
              <option key={bitrate} value={bitrate}>
                {MP3_BITRATE_LABELS[bitrate]}
              </option>
            ))}
          </LabeledSelect>
        ) : null}
        <LabeledSelect
          id={sampleRateId}
          label="Sample rate"
          value={String(sampleRate)}
          onChange={(event) =>
            setSampleRate(sanitizeAudioSampleRate(Number(event.target.value)))
          }
        >
          <option value={22050}>22050</option>
          <option value={44100}>44100</option>
          <option value={48000}>48000</option>
        </LabeledSelect>
        <SliderRow
          label="Lead-in silence"
          value={leadInMs}
          min={AUDIO_LEAD_IN_RANGE.min}
          max={AUDIO_LEAD_IN_RANGE.max}
          step={50}
          unit="ms"
          onChange={setLeadInMs}
          disabled={exportControlsLocked}
        />
        <SliderRow
          label="Tail padding"
          value={tailMs}
          min={AUDIO_TAIL_RANGE.min}
          max={AUDIO_TAIL_RANGE.max}
          step={10}
          unit="ms"
          onChange={setTailMs}
          disabled={exportControlsLocked}
        />
      </div>

      {showExportPlan ? <ExportPlanSummary plan={exportPlan} /> : null}
      {exportBlockedMessage ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-slate-700">
          {exportBlockedMessage}
        </p>
      ) : null}
      <ExportJobStatus
        state={audioExport.state}
        isActive={audioExport.isActive}
        onCancel={() => audioExport.cancel()}
        onReset={audioExport.reset}
        onRetry={() => void audioExport.retry()}
      />
      <div className="mt-4">
        <StatusMessage>
          MP3 encoding starts when you click download. Use MP3 for compact
          clips and WAV when you need lossless audio. Preview, WAV, and MP3 use
          the same speed, spacing, tone, volume, tone preset, and envelope
          settings.
        </StatusMessage>
      </div>
      <div className="mt-3">
        <ToolButton
          type="button"
          tone="light"
          onClick={restoreExportDefaults}
          disabled={exportControlsLocked}
          className="rounded-lg"
        >
          Restore defaults
        </ToolButton>
      </div>
        </>
      ) : null}
    </section>
  );
}

function LabeledInput({
  id,
  label,
  onChange,
  placeholder,
  value,
}: {
  id: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  value: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-0 focus-visible:outline-none"
      />
    </div>
  );
}

function LabeledSelect({
  children,
  disabled,
  id,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  id: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  value: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        {children}
      </select>
    </div>
  );
}

function formatMs(ms: number) {
  if (!ms || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function clampNum(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function writeNum(key: string, value: number) {
  safeWriteStorage(key, String(value));
}

function writeStr(key: string, value: string) {
  safeWriteStorage(key, value);
}

function writeBool(key: string, value: boolean) {
  safeWriteStorage(key, value ? "true" : "false");
}
