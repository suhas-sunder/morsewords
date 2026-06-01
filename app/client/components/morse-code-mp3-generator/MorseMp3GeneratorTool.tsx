import * as React from "react";

import { copyTextToClipboard } from "~/client/components/shared/ActionControls";
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
  ToolOutputPanel,
  ToolPanel,
  ToolSampleButtons,
  ToolTextarea,
} from "~/client/components/shared/ToolWorkspace";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import StatusMessage from "~/client/components/shared/ui/StatusMessage";
import TogglePill from "~/client/components/shared/ui/TogglePill";
import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
  LightBulbIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  VolumeIcon,
  VolumeOffIcon,
} from "~/client/assets/svg/Icons";

type SourceMode = "text" | "morse";
const SOURCE_MODES = ["text", "morse"] as const;

const EXAMPLES = ["SOS", "HELLO WORLD", "HELP ME", "I LOVE YOU", "TEST"];
const DEFAULT_TEXT = "sos help";
const DEFAULT_MORSE = "... --- ...";
const STROBE_WARNING_ID = "mp3-generator-strobe-warning";
const FLASH_DISABLED_NOTICE_ID = "mp3-generator-flash-disabled";

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
  const [tailMs, setTailMs] = React.useState(120);
  const [mp3Kbps, setMp3Kbps] = React.useState(128);
  const [copied, setCopied] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [downloadStatus, setDownloadStatus] = React.useState<null | {
    kind: "ok" | "error" | "working";
    message: string;
  }>(null);

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
    setFileName(
      readStoredString("mw_mp3_filename", "morse-code", { maxLength: 120 }),
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
    setMp3Kbps(readStoredNumberEnum("mw_mp3_kbps", MP3_BITRATES, 128));
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
  const { disableFlashEffects, flashAllowed, fullPageFlash } = flashLamp;
  const effectiveFlash = flashAllowed && flash;
  const renderedSoundOn = hydrated ? soundOn : true;
  const renderedRepeat = hydrated ? repeat : false;
  const renderedFlash = hydrated ? effectiveFlash : false;
  const showStrobeWarning =
    fullPageFlash && renderedFlash && player.state === "playing";

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
    writeNum("mw_audio_sr", sampleRate);
    writeNum("mw_audio_tail", tailMs);
    writeStr("mw_mp3_filename", fileName);
    writeNum("mw_mp3_kbps", mp3Kbps);
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
    tailMs,
    fileName,
    mp3Kbps,
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
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
    });
  }, [activeCode, canRender, charWpm, farnsworthWpm, player]);

  const previewAudioOptions = React.useMemo(
    () => ({
      code: activeCode,
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
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

  const exportAudioOptions = React.useMemo(
    () => ({
      ...previewAudioOptions,
      soundEnabled: true,
      repeat: false,
      flash: false,
      sampleRate,
      tailMs: clampNum(tailMs, 0, 400),
    }),
    [previewAudioOptions, sampleRate, tailMs],
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

  React.useEffect(() => {
    setDownloadStatus(null);
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

  const handlePickExample = (exampleText: string) => {
    if (sourceMode === "text") {
      setText(exampleText);
    } else {
      setMorse(textToMorse(exampleText));
    }
    setDownloadStatus(null);
  };

  const handleClear = () => {
    if (sourceMode === "text") {
      setText("");
    } else {
      setMorse("");
    }
    setCopied(false);
    setDownloadStatus(null);
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

  const renderAudioBuffer = () => player.renderAudioBuffer(exportAudioOptions);

  const handleDownloadMp3 = async () => {
    if (!hasSourceCode || !renderedSoundOn) return;
    if (!canRender) {
      setDownloadStatus({
        kind: "error",
        message: "Enter text or valid dots and dashes before exporting audio.",
      });
      return;
    }
    player.stop();
    setDownloadStatus({ kind: "working", message: "Preparing MP3 file..." });
    try {
      const buffer = await renderAudioBuffer();
      const { audioBufferToMp3Blob } = await import(
        "~/client/components/audio/mp3Export"
      );
      const blob = await audioBufferToMp3Blob(buffer, mp3Kbps);
      const download = downloadBlobFile({
        blob,
        filename: sanitizeDownloadFilename(
          `${sanitizeFileBase(fileName || "morse-code")}.mp3`,
          "morse-code.mp3",
        ),
      });
      if (!download.ok) {
        setDownloadStatus({ kind: "error", message: download.message });
        return;
      }
      setDownloadStatus({ kind: "ok", message: "MP3 download started." });
    } catch {
      setDownloadStatus({
        kind: "error",
        message:
          "MP3 export could not start in this browser. Try a shorter message or download WAV instead.",
      });
    }
  };

  const handleDownloadWav = async () => {
    if (!hasSourceCode || !renderedSoundOn) return;
    if (!canRender) {
      setDownloadStatus({
        kind: "error",
        message: "Enter text or valid dots and dashes before exporting audio.",
      });
      return;
    }
    player.stop();
    setDownloadStatus({ kind: "working", message: "Preparing WAV file..." });
    try {
      const blob = await player.renderWav(exportAudioOptions);
      const download = downloadBlobFile({
        blob,
        filename: sanitizeDownloadFilename(
          `${sanitizeFileBase(fileName || "morse-code")}.wav`,
          "morse-code.wav",
        ),
      });
      if (!download.ok) {
        setDownloadStatus({ kind: "error", message: download.message });
        return;
      }
      setDownloadStatus({ kind: "ok", message: "WAV download started." });
    } catch {
      setDownloadStatus({
        kind: "error",
        message: "WAV export failed. Try a shorter message or lower sample rate.",
      });
    }
  };

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
              <span>Spaces separate letters. Use / between words.</span>
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
                  setDownloadStatus(null);
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
                  setDownloadStatus(null);
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
              <ToolButton
                type="button"
                tone="darkPanel"
                onClick={handleDownloadWav}
                disabled={!hasSourceCode || !renderedSoundOn}
                className="rounded-lg"
              >
                <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                Download WAV
              </ToolButton>
            </div>
          }
        >
          <textarea
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
          onClick={handleDownloadMp3}
          disabled={!hasSourceCode || !renderedSoundOn}
          hover="dark"
          className="rounded-xl"
        >
          <DownloadIcon size={20} title={undefined} aria-hidden="true" />
          Download MP3
        </ToolButton>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="mw-heading text-base font-extrabold text-sky-950">
          Audio controls
        </h2>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <TogglePill
            label="Sound"
            checked={renderedSoundOn}
            onChange={(value) => setFeedback("sound", value)}
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
            onChange={(value) => setFeedback("repeat", value)}
            icon={<LoopIcon size={16} title={undefined} aria-hidden="true" />}
          />
          <TogglePill
            label="Flash Light"
            checked={renderedFlash}
            onChange={(value) => setFeedback("flash", value)}
            icon={<LightBulbIcon size={16} title={undefined} aria-hidden="true" />}
            describedBy={
              disableFlashEffects
                ? FLASH_DISABLED_NOTICE_ID
                : showStrobeWarning
                  ? STROBE_WARNING_ID
                  : undefined
            }
            disabled={!flashAllowed}
          />
          <FlashLamp
            active={flashLamp.active}
            disabled={!flashAllowed}
            label="Morse MP3 preview flash lamp"
            size="sm"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-4">
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

      {advancedOpen ? (
        <div className="mt-4 pt-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <LabeledSelect
              id={soundTypeId}
              label="Sound type"
              value={preset}
              onChange={(event) =>
                setPreset(sanitizeAudioGeneratorPreset(event.target.value))
              }
              disabled={!renderedSoundOn}
            >
              <option value="cw_radio">CW radio tone</option>
              <option value="sine">Sine</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="sounder">Telegraph sounder</option>
            </LabeledSelect>

            <div className="grid gap-4 sm:grid-cols-2">
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
      ) : null}

      <div className="mt-4">
        <ToolButton
          type="button"
          tone="light"
          hover="dark"
          onClick={() => setAdvancedOpen((value) => !value)}
          className="w-full rounded-lg"
          aria-expanded={advancedOpen}
        >
          <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
          {advancedOpen ? "Hide advanced settings" : "Show advanced settings"}
        </ToolButton>
      </div>

      <div className="mt-7">
        <h2 className="mw-heading text-base font-extrabold text-sky-950">
          Export settings
        </h2>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_150px_150px_220px] lg:items-end">
        <LabeledInput
          id={fileNameId}
          label="File name"
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="morse-code"
        />
        <LabeledSelect
          id={mp3KbpsId}
          label="MP3 kbps"
          value={String(mp3Kbps)}
          onChange={(event) =>
            setMp3Kbps(sanitizeMp3Bitrate(Number(event.target.value)))
          }
        >
          <option value={96}>96</option>
          <option value={128}>128</option>
          <option value={192}>192</option>
          <option value={256}>256</option>
        </LabeledSelect>
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
          label="Tail padding"
          value={tailMs}
          min={0}
          max={400}
          step={10}
          unit="ms"
          onChange={setTailMs}
          disabled={!renderedSoundOn}
          help="Extra silence to avoid clipped tails."
        />
      </div>

      <div className="mt-4">
        {downloadStatus ? (
          <StatusMessage
            kind={downloadStatus.kind === "ok" ? "success" : downloadStatus.kind}
            live
          >
            {downloadStatus.message}
          </StatusMessage>
        ) : (
          <StatusMessage>
            MP3 encoding starts when you click download. Use MP3 for compact
            clips and WAV when you need lossless audio or the most reliable
            fallback. Preview, WAV, and MP3 use the same speed, spacing, tone,
            volume, sound type, and envelope settings.
          </StatusMessage>
        )}
      </div>
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

function sanitizeFileBase(name: string) {
  return (
    name
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "morse-code"
  );
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
