import * as React from "react";

import styles from "~/client/components/shared/audioStyles";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";

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
const STROBE_WARNING_ID = "audio-translator-strobe-warning";

export default function MorseAudioTranslator() {
  const player = useMorseAudio();

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
  const [sampleRate, setSampleRate] = React.useState<22050 | 44100 | 48000>(
    44100,
  );
  const [tailMs, setTailMs] = React.useState<number>(120);

  const [hydrated, setHydrated] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Load persisted settings
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
    setSampleRate((readNum("mw_audio_sr", 44100) as any) || 44100);
    setTailMs(readNum("mw_audio_tail", 120));

    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    const mq = window.matchMedia?.("(max-width: 640px)");
    const apply = () => setIsMobile(!!mq?.matches);
    apply();
    if (!mq) return;
    try {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    } catch {
      mq.addListener?.(apply as any);
      return () => mq.removeListener?.(apply as any);
    }
  }, [hydrated]);

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
    try {
      await navigator.clipboard.writeText(s);
      setCopied("morse");
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // ignore
    }
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
      {flash && (
        <div
          id="mw_flash_overlay"
          className="fixed inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-75"
        />
      )}

      <section className="pb-7">
            <div className="mw-tool-section mt-0">
              <div className="tool-header pb-1 pt-2 sm:pt-3">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-sky-800" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                    Audio tool
                  </span>
                </div>
                <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl">
                  Morse Audio Generator
                </h1>
                <p className="mt-3 max-w-none text-base leading-relaxed text-slate-700 sm:text-lg">
                  Convert text or Morse into audio. Adjust speed, pitch, waveform, and export a WAV file.
                </p>
              </div>
              <div className="pb-6 pt-4 sm:pb-7 sm:pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSourceMode("text")}
                  className={`px-3 py-2 rounded-md font-semibold cursor-pointer active:scale-95 transition ${
                    sourceMode === "text"
                      ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                      : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                  }`}
                >
                  Text to Morse audio
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode("morse")}
                  className={`px-3 py-2 rounded-md font-semibold cursor-pointer active:scale-95 transition ${
                    sourceMode === "morse"
                      ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                      : "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                  }`}
                >
                  Morse to audio
                </button>

                </div>
                <p className="text-right text-sm leading-relaxed text-slate-600 sm:ml-auto">
                  {player.isSupported ? (
                    <>Est. time: {formatMs(durationMs).toString()}</>
                  ) : (
                    <span className="text-slate-500">
                      Audio unavailable in this browser
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-xl bg-[#fffdf8]/85">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <label
                      htmlFor="mw_audio_source"
                      className="text-sm font-extrabold text-sky-950"
                    >
                      {sourceMode === "text" ? "Input (Text)" : "Input (Morse)"}
                    </label>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Source
                    </span>
                  </div>

                  {sourceMode === "text" ? (
                    <>
                      <textarea
                        id="mw_audio_source"
                        className="min-h-[11rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Example: Hello world"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setText(isMobile ? "I love Morse code" : "sos help")
                          }
                          className="cursor-pointer rounded-md bg-[#fffdf8] px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 active:scale-95"
                        >
                          Use example
                        </button>
                        {!isMobile && (
                          <button
                            type="button"
                            onClick={() => setText("I love Morse code")}
                            className="cursor-pointer rounded-md bg-[#fffdf8] px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 active:scale-95"
                          >
                            I love Morse code
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setText("")}
                          className="ml-auto cursor-pointer rounded-md bg-[#fffdf8] px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 active:scale-95"
                        >
                          Clear input
                        </button>
                      </div>

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
                      <textarea
                        id="mw_audio_source"
                        className="min-h-[11rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0"
                        value={morse}
                        onChange={(e) => setMorse(e.target.value)}
                        placeholder="Example: ... --- ..."
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setMorse("... --- ...")}
                          className="cursor-pointer rounded-md bg-[#fffdf8] px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 active:scale-95"
                        >
                          Use example
                        </button>
                        <button
                          type="button"
                          onClick={() => setMorse("")}
                          className="ml-auto cursor-pointer rounded-md bg-[#fffdf8] px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-sky-100 active:scale-95"
                        >
                          Clear input
                        </button>
                      </div>

                      {morseIssues.length > 0 && (
                        <p className="px-4 pb-3 text-xs font-medium text-slate-600">
                          {morseIssues.join(" ")}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="overflow-hidden rounded-xl bg-slate-950 text-slate-200">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <h2 className="text-sm font-extrabold text-slate-200">
                      Output (Morse)
                    </h2>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">
                      Result
                    </span>
                  </div>

                  <pre className="min-h-[11rem] max-h-[18rem] overflow-auto whitespace-pre-wrap break-words bg-transparent p-4 font-mono text-sm leading-relaxed text-sky-100 sm:text-base">
                    {activeCode.trim() || "Your Morse output will appear here."}
                  </pre>

                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#fffdf8]/75 px-4 py-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyMorse}
                  disabled={!canPlay}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 font-semibold transition active:scale-95 ${
                    canPlay
                      ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                      : "cursor-not-allowed bg-[#fffaf2] text-slate-400"
                  }`}
                >
                  <CopyIcon size={18} title="Copy Morse" />
                  <span>Copy Morse</span>
                </button>
                {copied === "morse" && (
                  <span className="text-sm font-semibold text-sky-800">
                    Copied
                  </span>
                )}
                </div>
                <p className="text-right text-sm leading-relaxed text-slate-600 sm:ml-auto">
                  3 spaces = letters; 7 = words; / = word break
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
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
                  className={`flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition ${
                    player.state === "playing"
                      ? player.isSupported
                        ? "bg-[#fffdf8] text-slate-900 hover:bg-slate-900 hover:text-sky-100"
                        : "cursor-not-allowed bg-[#fffaf2] text-slate-400"
                      : canPlay && player.isSupported
                        ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white"
                        : "cursor-not-allowed bg-[#fffaf2] text-slate-400"
                  }`}
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
                </button>

                <button
                  onClick={player.stop}
                  disabled={!player.isSupported || player.state === "idle"}
                  className={`flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition ${
                    player.isSupported && player.state !== "idle"
                      ? "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                      : "cursor-not-allowed bg-[#fffaf2] text-slate-400"
                  }`}
                >
                  <StopIcon size={22} title="Stop audio" />
                  <span>Stop</span>
                </button>

                <button
                  onClick={handleExportWav}
                  disabled={!canPlay || !soundOn}
                  className={`flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl font-semibold cursor-pointer active:scale-95 transition ${
                    canPlay && soundOn
                      ? "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                      : "cursor-not-allowed bg-[#fffaf2] text-slate-400"
                  }`}
                >
                  <SaveIcon size={22} title="Export WAV" />
                  <span>Export WAV</span>
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#fffaf2]/45 p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-sky-950">
                  Audio controls
                </h2>
                <span className="text-sm text-slate-600">
                  {player.isSupported
                    ? player.state === "idle"
                      ? "Ready"
                      : player.state === "playing"
                        ? "Playing"
                        : "Paused"
                    : "Unavailable"}
                </span>
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
                  help="Slower spacing, same character speed"
                />
                <SliderRow
                  label="Pitch"
                  value={toneHz}
                  min={200}
                  max={1600}
                  step={10}
                  unit="Hz"
                  onChange={setToneHz}
                  disabled={!soundOn || preset === "sounder"}
                />
                <SliderRow
                  label="Volume"
                  value={Math.round(volume * 100)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  onChange={(v) => setVolume(v / 100)}
                  disabled={!soundOn}
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
                        disabled={!soundOn || preset === "sounder"}
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
                        disabled={!soundOn || preset === "sounder"}
                        help="Softens clicks at the end."
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
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
                      label="Flash"
                      checked={flash}
                      onChange={(v) => setFeedback("flash", v)}
                      icon={<LightBulbIcon size={16} title="Flash" />}
                      describedBy={flash ? STROBE_WARNING_ID : undefined}
                    />
                  </div>

                  {flash ? (
                    <StrobeWarning id={STROBE_WARNING_ID} className="mt-3" />
                  ) : null}
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none active:scale-95 sm:w-auto"
                >
                  {advancedOpen ? "Hide advanced" : "Show advanced"}
                </button>
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
                        className="mt-2 w-full cursor-pointer rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold hover:bg-white focus:outline-none"
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
                        disabled={!soundOn}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleExportWav}
                      disabled={!canPlay || !soundOn}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition ${
                        canPlay && soundOn
                          ? "bg-[#fffdf8] text-slate-700 hover:bg-slate-900 hover:text-sky-100"
                          : "cursor-not-allowed bg-[#fffaf2] text-slate-400"
                      }`}
                    >
                      <SaveIcon size={18} title="Export WAV" />
                      <span>Download WAV</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => setExportOpen((v) => !v)}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-slate-900 hover:text-sky-100 focus:outline-none active:scale-95 sm:w-auto"
                >
                  {exportOpen ? "Hide export" : "Show export"}
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Audio is generated in your browser. Nothing is uploaded.
              </p>
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
        } focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-full`}
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
          "mt-2 w-full cursor-pointer rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold transition hover:bg-white focus:outline-none"
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
        className="mt-2 w-full rounded-xl bg-[#fffdf8] px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-300"
        placeholder={placeholder}
      />
    </div>
  );
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
