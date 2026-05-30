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
import { audioBufferToMp3Blob, type ExportFormat } from "~/client/components/morse-code-sound-generator/audioExport";
import { copyTextToClipboard } from "~/client/components/shared/ActionControls";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { hasPlayableMorse } from "~/client/components/shared/morseTiming";
import {
  AUDIO_ATTACK_RANGE,
  AUDIO_GENERATOR_PRESETS,
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
} from "~/client/components/shared/settingsStorage";

import {
  CopyIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  SaveIcon,
  SoundIcon,
  StopIcon,
  LightBulbIcon,
} from "~/client/assets/svg/Icons";

type SourceMode = "text" | "morse";
type PageIntent = "audio" | "sound";
const SOURCE_MODES = ["text", "morse"] as const;
const STROBE_WARNING_ID = "sound-generator-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "sound-generator-flash-disabled";

type MorseAudioTranslatorProps = {
  heading?: string;
  lead?: string;
  defaultText?: string;
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
  exportFormats?: ExportFormat[];
  introEyebrow?: string;
};

const formatLabels: Record<ExportFormat, string> = {
  wav: "WAV",
  mp3: "MP3",
};

export default function MorseAudioTranslator({
  heading = "Morse Audio Generator",
  lead = "Convert text or Morse into audio. Adjust speed, pitch, waveform, and export a WAV file.",
  defaultText = "sos help",
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
  exportFormats = ["wav"],
  introEyebrow = "Audio tool",
}: MorseAudioTranslatorProps = {}) {
  const player = useMorseAudio();
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
  const [exportOpen, setExportOpen] = React.useState<boolean>(true);
  const [fileName, setFileName] = React.useState(defaultFileName);
  const [sampleRate, setSampleRate] =
    React.useState<22050 | 44100 | 48000>(44100);
  const [tailMs, setTailMs] = React.useState<number>(120);
  const [mp3Kbps, setMp3Kbps] = React.useState<number>(128);
  const [exportStatus, setExportStatus] = React.useState<null | { kind: "ok" | "error" | "working"; message: string }>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const flashLamp = useFlashLampState(hydrated && flash);
  const { disableFlashEffects, flashAllowed } = flashLamp;
  const effectiveFlash = flashAllowed && flash;

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
      readStoredEnum(storageKey("preset"), AUDIO_GENERATOR_PRESETS, "cw_radio"),
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
    setExportOpen(readStoredBoolean(storageKey("export_open"), true));
    setFileName(
      readStoredString(storageKey("filename"), defaultFileName, {
        maxLength: 120,
      }),
    );
    setSampleRate(readStoredNumberEnum(storageKey("sr"), AUDIO_SAMPLE_RATES, 44100));
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
    setHydrated(true);
  }, [defaultFileName, defaultMorse, defaultText, storageKey]);

  React.useEffect(() => {
    if (!hydrated) return;
    const anyPlayer: any = player as any;
    anyPlayer.setLiveOptions?.({
      code: activeCode,
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
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
    const anyPlayer: any = player as any;
    anyPlayer.setLiveOptions?.({ flash: false });
  }, [flashAllowed, player]);

  React.useEffect(() => {
    if (!hydrated) return;
    writeStr(storageKey("source"), sourceMode);
    writeStr(storageKey("text"), text);
    writeStr(storageKey("morse"), morse);
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
    writeBool(storageKey("export_open"), exportOpen);
    writeStr(storageKey("filename"), fileName);
    writeNum(storageKey("sr"), sampleRate);
    writeNum(storageKey("tail"), tailMs);
    writeNum(storageKey("mp3_kbps"), mp3Kbps);
  }, [hydrated, sourceMode, text, morse, charWpm, farnsworthWpm, toneHz, volume, preset, attackMs, releaseMs, repeat, soundOn, flash, advancedOpen, exportOpen, fileName, sampleRate, tailMs, mp3Kbps, storageKey]);

  const canPlay = React.useMemo(
    () => hasPlayableMorse(activeCode),
    [activeCode],
  );
  const canAttemptExport = !!activeCode.trim() && soundOn;
  const durationMs = React.useMemo(() => {
    if (!canPlay) return 0;
    return player.estimateDurationMs({
      code: activeCode,
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
    });
  }, [player, activeCode, canPlay, charWpm, farnsworthWpm]);

  React.useEffect(() => {
    setExportStatus(null);
  }, [
    activeCode,
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    preset,
    attackMs,
    releaseMs,
    sampleRate,
    tailMs,
    mp3Kbps,
  ]);

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
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
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
    if (!activeCode.trim() || !soundOn) return;
    if (!canPlay) {
      setExportStatus({
        kind: "error",
        message: "Enter text or valid dots and dashes before exporting audio.",
      });
      return;
    }
    player.stop();
    const safeBase = sanitizeFileBase(fileName || defaultFileName || "morse-audio");
    setExportStatus({ kind: "working", message: `Preparing ${formatLabels[format]} file...` });
    try {
      if (format === "wav") {
        const blob = await player.renderWav({
          code: activeCode,
          wpm: clampNum(charWpm, 5, 60),
          farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
          hz: toneHz,
          volume,
          soundEnabled: true,
          preset,
          attackMs,
          releaseMs,
          sampleRate,
          tailMs,
        });
        downloadBlob(blob, `${safeBase}.wav`);
        setExportStatus({ kind: "ok", message: "WAV download started." });
        return;
      }

      const buffer = await player.renderAudioBuffer({
        code: activeCode,
        wpm: clampNum(charWpm, 5, 60),
        farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
        hz: toneHz,
        volume,
        soundEnabled: true,
        preset,
        attackMs,
        releaseMs,
        sampleRate,
        tailMs,
      });
      const blob = await audioBufferToMp3Blob(buffer, mp3Kbps);
      downloadBlob(blob, `${safeBase}.mp3`);
      setExportStatus({ kind: "ok", message: "MP3 download started." });
    } catch (error) {
      setExportStatus({
        kind: "error",
        message:
          format === "mp3"
            ? "MP3 export could not start. Check your connection or browser script-blocking settings, then try WAV as a fallback."
            : "Export failed. Try a shorter message or a lower sample rate.",
      });
    }
  };

  const updateFeedbackToggle = React.useCallback(
    (key: "sound" | "repeat" | "flash", next: boolean) => {
      if (key === "flash" && !flashAllowed) return;
      const current = { sound: soundOn, repeat, flash: effectiveFlash };
      const updated = { ...current, [key]: key === "flash" ? next && flashAllowed : next };
      if (key === "sound") setSoundOn(next);
      if (key === "repeat") setRepeat(next);
      if (key === "flash") setFlash(next && flashAllowed);
      const anyPlayer: any = player as any;
      anyPlayer.setLiveOptions?.({ soundEnabled: updated.sound, flash: updated.flash });
    },
    [soundOn, repeat, effectiveFlash, flashAllowed, player],
  );

  const heroStats = [
    ["Output", exportFormats.includes("mp3") ? "WAV + MP3" : "WAV"],
    ["Tone", presetLabel(preset)],
    ["Pitch", preset === "sounder" ? "Sounder" : `${toneHz} Hz`],
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
                      {TOOL_SPACING_HELPER}
                    </p>
                  }
                >
                  {sourceMode === "text" ? (
                    <>
                      <ToolTextarea
                        id={sourceInputId}
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
                  onClick={() => handleExport(exportFormats.includes("mp3") ? "mp3" : "wav")}
                  disabled={!canAttemptExport}
                  tone="light"
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5"
                >
                  <SaveIcon size={22} title="Export audio" />
                  <span>{exportFormats.includes("mp3") ? "Download MP3" : "Export WAV"}</span>
                </ToolButton>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-sky-950">Sound controls</h2>
                <span className="text-sm text-slate-600">{player.isSupported ? player.state === "idle" ? "Ready" : player.state === "playing" ? "Playing" : "Paused" : "Unavailable"}</span>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <SliderRow label="Character speed" value={charWpm} min={5} max={60} step={1} unit="WPM" onChange={handleCharWpmChange} />
                <SliderRow label="Farnsworth spacing" value={farnsworthWpm} min={5} max={Math.max(5, charWpm)} step={1} unit="WPM" onChange={handleFarnsworthWpmChange} help="Slower spacing, same character speed" />
                <SliderRow label="Pitch" value={toneHz} min={200} max={1600} step={10} unit="Hz" onChange={setToneHz} disabled={!soundOn || preset === "sounder"} />
                <SliderRow label="Volume" value={Math.round(volume * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => setVolume(v / 100)} disabled={!soundOn} />
              </div>

              {advancedOpen ? (
                <div className="mt-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={tonePresetId} className="text-sm font-semibold text-slate-700">Tone preset</label>
                      <select id={tonePresetId} value={preset} onChange={(e) => setPreset(sanitizeAudioGeneratorPreset(e.target.value))} className="mt-2 w-full cursor-pointer rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none">
                        <option value="cw_radio">CW radio tone</option>
                        <option value="sine">Sine tone</option>
                        <option value="square">Square beep</option>
                        <option value="triangle">Soft triangle tone</option>
                        <option value="sawtooth">Sawtooth buzzer</option>
                        <option value="sounder">Telegraph sounder</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <SliderRow label="Attack" value={attackMs} min={0} max={40} step={1} unit="ms" onChange={setAttackMs} disabled={!soundOn || preset === "sounder"} help="Softens clicks at the start." />
                      <SliderRow label="Release" value={releaseMs} min={0} max={80} step={1} unit="ms" onChange={setReleaseMs} disabled={!soundOn || preset === "sounder"} help="Softens clicks at the end." />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <TogglePill label="Sound" checked={soundOn} onChange={(v) => updateFeedbackToggle("sound", v)} icon={<SoundIcon size={16} title="Sound" />} />
                    <TogglePill label="Repeat" checked={repeat} onChange={(v) => updateFeedbackToggle("repeat", v)} icon={<LoopIcon size={16} title="Repeat" />} />
                    <TogglePill label="Flash" checked={effectiveFlash} onChange={(v) => updateFeedbackToggle("flash", v)} icon={<LightBulbIcon size={16} title="Flash" />} describedBy={disableFlashEffects ? FLASH_DISABLED_NOTICE_ID : effectiveFlash ? STROBE_WARNING_ID : undefined} disabled={!flashAllowed} />
                    {hydrated && flash ? <FlashLamp active={flashLamp.active} disabled={!effectiveFlash} label="Morse audio flash lamp" size="sm" /> : null}
                  </div>

                  {disableFlashEffects ? <FlashEffectsDisabledNotice id={FLASH_DISABLED_NOTICE_ID} className="mt-3" /> : effectiveFlash ? <StrobeWarning id={STROBE_WARNING_ID} className="mt-3" /> : null}
                </div>
              ) : null}

              <div className="mt-4">
                  <button type="button" onClick={() => setAdvancedOpen((v) => !v)} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none active:scale-95">
                  {advancedOpen ? "Hide advanced" : "Show advanced"}
                </button>
              </div>

              

              {exportOpen ? (
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
                      <SliderRow label="Tail padding" value={tailMs} min={0} max={400} step={10} unit="ms" onChange={setTailMs} help="Extra silence to avoid clipped tails." disabled={!soundOn} />
                    </div>
                  </div>

                  {exportFormats.includes("mp3") ? (
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

                  

                  <div className="mt-4 flex flex-wrap gap-2">
                    {exportFormats.includes("wav") ? <ExportButton label="Download WAV" onClick={() => handleExport("wav")} disabled={!canAttemptExport} /> : null}
                    {exportFormats.includes("mp3") ? <ExportButton label="Download MP3" onClick={() => handleExport("mp3")} disabled={!canAttemptExport} /> : null}
                  </div>

                  {exportStatus ? (
                    <p className={`mt-3 text-sm font-semibold ${exportStatus.kind === "error" ? "text-slate-700" : "text-sky-900"}`}>
                      {exportStatus.message}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4">
                  <button type="button" onClick={() => setExportOpen((v) => !v)} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none active:scale-95">
                  {exportOpen ? "Hide export" : "Show export"}
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-500">Audio is generated in your browser. WAV rendering is local. MP3 download is encoded in the browser when selected.</p>
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

function ExportButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-semibold transition focus:outline-none active:scale-95 ${!disabled ? "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100" : "cursor-not-allowed text-slate-400"}`}>
      <SaveIcon size={18} title={label} />
      <span>{label}</span>
    </button>
  );
}

function TogglePill({ label, checked, onChange, icon, describedBy, disabled = false }: { label: string; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode; describedBy?: string; disabled?: boolean }) {
  return (
    <button type="button" onClick={() => { if (!disabled) onChange(!checked); }} disabled={disabled} className={`flex ${disabled ? "cursor-not-allowed bg-[#fffaf2] text-slate-400" : "cursor-pointer"} items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition focus:outline-none active:scale-95 ${disabled ? "" : checked ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white" : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"}`} aria-pressed={checked} aria-describedby={describedBy}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange, help, disabled }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void; help?: string; disabled?: boolean }) {
  const id = React.useId();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm text-slate-600">{value} {unit}</span>
      </div>
      {help ? <p className="mt-0.5 text-xs text-slate-500">{help}</p> : null}
<input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} disabled={disabled} style={{ accentColor: "#38bdf8" }} className={`w-full mt-2 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} focus:outline-none focus:ring-0 focus-visible:outline-none rounded-full`} />
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

function sanitizeFileBase(name: string) {
  return name.trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "morse-audio";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function presetLabel(preset: SoundPreset) {
  if (preset === "cw_radio") return "CW radio";
  if (preset === "sine") return "Sine";
  if (preset === "square") return "Square beep";
  if (preset === "triangle") return "Triangle";
  if (preset === "sawtooth") return "Sawtooth";
  return "Sounder";
}
