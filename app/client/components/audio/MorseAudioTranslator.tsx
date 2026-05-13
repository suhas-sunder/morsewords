import * as React from "react";

import styles from "~/client/components/shared/audioStyles";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import {
  HOME_TOOL_EXAMPLES,
  TOOL_SPACING_HELPER,
  ToolButton,
  ToolHero,
  ToolOutputPanel,
  ToolPanel,
  ToolTextarea,
} from "~/client/components/shared/ToolWorkspace";
import {
  ActionButton,
  ActionRow,
  copyTextToClipboard,
} from "~/client/components/shared/ActionControls";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import { readQueryPrefillValue } from "~/client/components/shared/queryPrefill";

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
const STROBE_WARNING_ID = "audio-translator-strobe-warning";
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

  React.useEffect(() => {
    setSourceMode((readStr("mw_audio_source", "text") as SourceMode) || "text");
    setText(readStr("mw_audio_text", "sos help"));
    setMorse(readStr("mw_audio_morse", "... --- ..."));
    setCharWpm(readNum("mw_audio_wpm", 18));
    setFarnsworthWpm(readNum("mw_audio_fwpm", 12));
    setToneHz(readNum("mw_audio_hz", 650));
    setVolume(readNum("mw_audio_vol", 0.75));
    setPreset(
      (readStr("mw_audio_preset", "cw_radio") as SoundPreset) || "cw_radio",
    );
    setAttackMs(readNum("mw_audio_attack", 8));
    setReleaseMs(readNum("mw_audio_release", 12));
    setRepeat(readBool("mw_audio_repeat", false));
    setSoundOn(readBool("mw_audio_sound", true));
    setFlash(readBool("mw_audio_flash", false));
    setAdvancedOpen(readBool("mw_audio_adv_open", true));
    setExportOpen(readBool("mw_audio_export_open", true));
    setFileName(readStr("mw_audio_filename", "morse-audio"));
    setSampleRate(validateSampleRate(readNum("mw_audio_sr", 44100)));
    setTailMs(readNum("mw_audio_tail", 120));
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
    const anyPlayer: any = player as any;
    if (!anyPlayer.setLiveOptions) return;

    anyPlayer.setLiveOptions({
      wpm: clampNum(charWpm, 5, 60),
      farnsworthWpm: clampNum(farnsworthWpm, 5, 60),
      hz: toneHz,
      volume,
      soundEnabled: soundOn,
      preset,
      repeat,
      flash,
      attackMs,
      releaseMs,
    });
  }, [
    hydrated,
    player,
    charWpm,
    farnsworthWpm,
    toneHz,
    volume,
    soundOn,
    preset,
    repeat,
    flash,
    attackMs,
    releaseMs,
  ]);

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

  // Flash overlay (listens to morsewords:flash)
  React.useEffect(() => {
    if (!flash) return;

    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { ms?: number } | undefined;
      const ms = detail?.ms ?? 0;
      if (!ms) return;

      const el = document.getElementById("mw_flash_overlay");
      if (!el) return;

      el.classList.remove("opacity-0");
      el.classList.add("opacity-100");

      window.setTimeout(() => {
        el.classList.remove("opacity-100");
        el.classList.add("opacity-0");
      }, ms);
    };

    window.addEventListener("morsewords:flash", handler as any);
    return () => window.removeEventListener("morsewords:flash", handler as any);
  }, [flash]);

  const canPlay = !!activeCode.trim();
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
  const renderedFlash = hydrated ? flash : false;

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
      const current = { sound: soundOn, repeat, flash };
      const updated = { ...current, [key]: next };

      if (key === "sound") setSoundOn(next);
      if (key === "repeat") setRepeat(next);
      if (key === "flash") setFlash(next);

      // If sound is turned off while playing, mute instantly via live options
      const anyPlayer: any = player as any;
      if (anyPlayer.setLiveOptions) {
        anyPlayer.setLiveOptions({ soundEnabled: updated.sound });
      }
    },
    [soundOn, repeat, flash, player],
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
      flash,
      attackMs,
      releaseMs,
    });
  };

  const handleExportWav = async () => {
    if (!canPlay) return;
    if (!soundOn) return;

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

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeBase}.wav`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div style={styles.page}>
      {renderedFlash && (
        <div
          id="mw_flash_overlay"
          className="mw-strobe-flash fixed inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-75"
        />
      )}

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
                    describedBy={renderedFlash ? STROBE_WARNING_ID : undefined}
                  />
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
                  onChange={setCharWpm}
                />
                <SliderRow
                  label="Farnsworth spacing"
                  value={farnsworthWpm}
                  min={5}
                  max={60}
                  step={1}
                  unit="WPM"
                  onChange={setFarnsworthWpm}
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

              {advancedOpen && (
                <div className="mt-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <LabeledAudioSelect
                      label="Preset"
                      value={preset}
                      onChange={(e) => setPreset(e.target.value as SoundPreset)}
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

                  {renderedFlash ? (
                    <StrobeWarning id={STROBE_WARNING_ID} className="mt-3" />
                  ) : null}
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
                        onChange={(e) => setSampleRate(Number(e.target.value) as any)}
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

function TogglePill({
  label,
  checked,
  onChange,
  icon,
  describedBy,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold cursor-pointer active:scale-95 transition focus:outline-none ${
        checked
          ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
          : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
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
  const id = React.useId();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
        <span className="text-sm text-slate-600">
          {value} {unit}
        </span>
      </div>
      {help && <p className="mt-0.5 text-xs text-slate-500">{help}</p>}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{ accentColor: "#38bdf8" }}
        className={`w-full mt-2 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        } focus:outline-none focus:ring-0 focus-visible:outline-none rounded-full`}
      />
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

function clampNum(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function validateSampleRate(value: number): 22050 | 44100 | 48000 {
  return value === 22050 || value === 44100 || value === 48000 ? value : 44100;
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
