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
import TogglePill from "~/client/components/shared/ui/TogglePill";
import {
  ActionButton,
  ActionRow,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
import {
  downloadBlobFile,
  sanitizeDownloadFilename,
} from "~/client/components/shared/actionOutputUtils";
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
} from "~/client/components/shared/settingsStorage";

import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  LightBulbIcon,
  VolumeIcon,
  VolumeOffIcon,
} from "~/client/assets/svg/Icons";

type SourceMode = "text" | "morse";
const SOURCE_MODES = ["text", "morse"] as const;
const STROBE_WARNING_ID = "audio-translator-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "audio-translator-flash-disabled";
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
  const [exportOpen, setExportOpen] = React.useState<boolean>(true);
  const [fileName, setFileName] = React.useState("morse-audio");
  const [sampleRate, setSampleRate] =
    React.useState<22050 | 44100 | 48000>(44100);
  const [tailMs, setTailMs] = React.useState<number>(120);

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
      readStoredEnum("mw_audio_preset", AUDIO_GENERATOR_PRESETS, "cw_radio"),
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
    setExportOpen(readStoredBoolean("mw_audio_export_open", true));
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
    writeStr("mw_audio_text", text);
    writeStr("mw_audio_morse", morse);

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
    writeBool("mw_audio_export_open", exportOpen);
    writeStr("mw_audio_filename", fileName);
    writeNum("mw_audio_sr", sampleRate);
    writeNum("mw_audio_tail", tailMs);
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
    exportOpen,
    fileName,
    sampleRate,
    tailMs,
  ]);

  const canPlay = React.useMemo(
    () => hasPlayableMorse(activeCode),
    [activeCode],
  );
  const durationMs = React.useMemo(() => {
    if (!canPlay) return 0;
    return player.estimateDurationMs({
      code: activeCode,
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
    });
  }, [player, activeCode, canPlay, charWpm, farnsworthWpm]);

  const renderedSoundOn = hydrated ? soundOn : true;
  const renderedRepeat = hydrated ? repeat : false;
  const renderedFlash = hydrated ? effectiveFlash : false;

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

  const handleExportWav = async () => {
    if (!canPlay) return;
    if (!soundOn) return;
    player.stop();

    const safeBase = sanitizeFileBase(fileName || "morse-audio");
    try {
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

      downloadBlobFile({
        blob,
        filename: sanitizeDownloadFilename(`${safeBase}.wav`, "morse-audio.wav"),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div style={styles.page}>
      <section className="mw-tool-section mt-0">
            <div>
              <ToolHero
                eyebrow="Audio tool"
                title="Morse Code Audio Generator"
                lead="Convert text or pasted Morse into playable audio. Adjust listening settings, then export a WAV file from your browser."
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
                      {TOOL_SPACING_HELPER}
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
                  onClick={handleExportWav}
                  disabled={!canPlay || !renderedSoundOn}
                  tone="light"
                  className="flex justify-center items-center gap-2 rounded-xl py-2.5"
                >
                  <DownloadIcon size={22} title={undefined} aria-hidden="true" />
                  <span>Export WAV</span>
                </ToolButton>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-extrabold text-sky-950">
                  Audio controls
                </h2>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <TogglePill
                    label="Sound"
                    checked={renderedSoundOn}
                    onChange={(v) => setFeedback("sound", v)}
                    icon={
                      renderedSoundOn ? (
                        <VolumeIcon size={16} title={undefined} aria-hidden="true" />
                      ) : (
                        <VolumeOffIcon size={16} title={undefined} aria-hidden="true" />
                      )
                    }
                  />
                  <TogglePill
                    label="Repeat"
                    checked={renderedRepeat}
                    onChange={(v) => setFeedback("repeat", v)}
                    icon={<LoopIcon size={16} title="Repeat" />}
                  />
                  <TogglePill
                    label="Flash"
                    checked={renderedFlash}
                    onChange={(v) => setFeedback("flash", v)}
                    icon={<LightBulbIcon size={16} title="Flash" />}
                    describedBy={
                      disableFlashEffects
                        ? FLASH_DISABLED_NOTICE_ID
                        : renderedFlash
                          ? STROBE_WARNING_ID
                          : undefined
                    }
                    disabled={!flashAllowed}
                  />
                  {hydrated && flash ? (
                    <FlashLamp
                      active={flashLamp.active}
                      disabled={!renderedFlash}
                      label="Morse audio flash lamp"
                      size="sm"
                    />
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <SliderRow
                  label="Character speed"
                  value={charWpm}
                  min={5}
                  max={60}
                  step={1}
                  unit="WPM"
                  onChange={handleCharWpmChange}
                />
                <SliderRow
                  label="Farnsworth spacing"
                  value={farnsworthWpm}
                  min={5}
                  max={Math.max(5, charWpm)}
                  step={1}
                  unit="WPM"
                  onChange={handleFarnsworthWpmChange}
                />
                <SliderRow
                  label="Pitch"
                  value={toneHz}
                  min={200}
                  max={1600}
                  step={10}
                  unit="Hz"
                  onChange={setToneHz}
                    disabled={!renderedSoundOn || preset === "sounder"}
                />
                <SliderRow
                  label="Volume"
                  value={Math.round(volume * 100)}
                  min={0}
                  max={100}
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
              ) : renderedFlash ? (
                <StrobeWarning id={STROBE_WARNING_ID} className="mt-3" />
              ) : null}

              {advancedOpen && (
                <div className="mt-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <LabeledAudioSelect
                      label="Preset"
                      value={preset}
                      onChange={(e) =>
                        setPreset(sanitizeAudioGeneratorPreset(e.target.value))
                      }
                    >
                        <option value="cw_radio">CW (Radio)</option>
                        <option value="sine">Sine</option>
                        <option value="square">Square</option>
                        <option value="triangle">Triangle</option>
                        <option value="sawtooth">Sawtooth</option>
                        <option value="sounder">Telegraph sounder</option>
                    </LabeledAudioSelect>

                    <div className="grid grid-cols-2 gap-3">
                      <SliderRow
                        label="Attack"
                        value={attackMs}
                        min={0}
                        max={40}
                        step={1}
                        unit="ms"
                        onChange={setAttackMs}
                        disabled={!renderedSoundOn || preset === "sounder"}
                        help="Softens clicks at the start."
                      />
                      <SliderRow
                        label="Release"
                        value={releaseMs}
                        min={0}
                        max={80}
                        step={1}
                        unit="ms"
                        onChange={setReleaseMs}
                        disabled={!renderedSoundOn || preset === "sounder"}
                        help="Softens clicks at the end."
                      />
                    </div>
                  </div>

                </div>
              )}

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

              {exportOpen && (
                <div className="mt-4 pt-4">
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
                        min={0}
                        max={400}
                        step={10}
                        unit="ms"
                        onChange={setTailMs}
                        help="Extra silence to avoid clipped tails."
                        disabled={!renderedSoundOn}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton
                      unstyled
                      onClick={handleExportWav}
                      disabled={!canPlay || !renderedSoundOn}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition ${
                        canPlay && renderedSoundOn
                          ? "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                          : "cursor-not-allowed bg-[#fffaf2] text-slate-400"
                      }`}
                      leadingIcon={
                        <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                      }
                    >
                      <span>Download WAV</span>
                    </ActionButton>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <ActionButton
                  unstyled
                  onClick={() => setExportOpen((v) => !v)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none active:scale-95"
                  leadingIcon={
                    <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                  }
                >
                  {exportOpen ? "Hide export" : "Show export"}
                </ActionButton>
              </div>

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

function sanitizeFileBase(name: string) {
  return (
    name
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "morse-audio"
  );
}
