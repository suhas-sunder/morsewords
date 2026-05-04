import * as React from "react";

import styles from "~/client/components/shared/audioStyles";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/shared/useMorseAudio";
import StrobeWarning from "~/client/components/shared/StrobeWarning";
import { audioBufferToMp3Blob, type ExportFormat } from "~/client/components/morse-code-sound-generator/audioExport";
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
type PageIntent = "audio" | "sound";
const STROBE_WARNING_ID = "sound-generator-strobe-warning";

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
  primaryExampleText = "sos help",
  secondaryExampleText = "I love Morse code",
  morseExample = "... --- ...",
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
  const [sampleRate, setSampleRate] = React.useState<22050 | 44100 | 48000>(44100);
  const [tailMs, setTailMs] = React.useState<number>(120);
  const [mp3Kbps, setMp3Kbps] = React.useState<number>(128);
  const [exportStatus, setExportStatus] = React.useState<null | { kind: "ok" | "error" | "working"; message: string }>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setSourceMode((readStr(storageKey("source"), "text") as SourceMode) || "text");
    setText(readStr(storageKey("text"), defaultText));
    setMorse(readStr(storageKey("morse"), defaultMorse));
    setCharWpm(readNum(storageKey("wpm"), 18));
    setFarnsworthWpm(readNum(storageKey("fwpm"), 12));
    setToneHz(readNum(storageKey("hz"), 650));
    setVolume(readNum(storageKey("vol"), 0.75));
    setPreset((readStr(storageKey("preset"), "cw_radio") as SoundPreset) || "cw_radio");
    setAttackMs(readNum(storageKey("attack"), 8));
    setReleaseMs(readNum(storageKey("release"), 12));
    setRepeat(readBool(storageKey("repeat"), false));
    setSoundOn(readBool(storageKey("sound"), true));
    setFlash(readBool(storageKey("flash"), false));
    setAdvancedOpen(readBool(storageKey("adv_open"), true));
    setExportOpen(readBool(storageKey("export_open"), true));
    setFileName(readStr(storageKey("filename"), defaultFileName));
    setSampleRate(validateSampleRate(readNum(storageKey("sr"), 44100)));
    setTailMs(readNum(storageKey("tail"), 120));
    setMp3Kbps(readNum(storageKey("mp3_kbps"), 128));
    setHydrated(true);
  }, [defaultFileName, defaultMorse, defaultText, storageKey]);

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

  React.useEffect(() => {
    if (!hydrated) return;
    const anyPlayer: any = player as any;
    anyPlayer.setLiveOptions?.({
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
  }, [hydrated, player, charWpm, farnsworthWpm, toneHz, volume, soundOn, preset, repeat, flash, attackMs, releaseMs]);

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
    try {
      await navigator.clipboard.writeText(s);
      setCopied("morse");
      setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
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

  const handleExport = async (format: ExportFormat) => {
    if (!canPlay || !soundOn) return;
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
      const current = { sound: soundOn, repeat, flash };
      const updated = { ...current, [key]: next };
      if (key === "sound") setSoundOn(next);
      if (key === "repeat") setRepeat(next);
      if (key === "flash") setFlash(next);
      const anyPlayer: any = player as any;
      anyPlayer.setLiveOptions?.({ soundEnabled: updated.sound });
    },
    [soundOn, repeat, flash, player],
  );

  const heroStats = [
    ["Output", exportFormats.includes("mp3") ? "WAV + MP3" : "WAV"],
    ["Tone", presetLabel(preset)],
    ["Pitch", preset === "sounder" ? "Sounder" : `${toneHz} Hz`],
    ["Speed", `${charWpm} WPM`],
  ];

  return (
    <div style={styles.page}>
      {flash && <div id="mw_flash_overlay" className="fixed inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-75" />}

      <section className="pb-7">
            <div className="mw-tool-section mt-6 overflow-hidden rounded-2xl bg-white">
              <div className="tool-header px-5 pb-0 pt-6 sm:px-8 sm:pt-7">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-sky-800" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
                    {introEyebrow}
                  </span>
                </div>
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl">
                {heading}
              </h1>
              
              <p className="mt-3 max-w-none text-base leading-relaxed text-slate-700 sm:text-lg">{lead}</p>
                </div>
              <div className="px-5 pb-6 pt-4 sm:px-8 sm:pb-7 sm:pt-5">

              <div className="flex flex-wrap items-center gap-2">
                <ModeButton active={sourceMode === "text"} onClick={() => setSourceMode("text")}>{textModeLabel}</ModeButton>
                <ModeButton active={sourceMode === "morse"} onClick={() => setSourceMode("morse")}>{morseModeLabel}</ModeButton>
                <span className="ml-auto text-xs text-slate-500">
                  {player.isSupported ? <>Est. time: {formatMs(durationMs)}</> : <span>Audio unavailable in this browser</span>}
                </span>
              </div>

              <div className="grid gap-4 mt-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <label htmlFor={sourceInputId} className="font-semibold text-sky-950">
                    {sourceMode === "text" ? textInputLabel : morseInputLabel}
                  </label>
                  {sourceMode === "text" ? (
                    <>
                      <textarea
                        id={sourceInputId}
                        className="w-full mt-2 min-h-[12rem] resize-y rounded-xl bg-slate-100 p-4 font-mono outline-none focus:ring-2 focus:ring-sky-300"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Example: Hello world"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      <InputButtons
                        onUseExample={() => setText(isMobile ? secondaryExampleText : primaryExampleText)}
                        onUseSecond={!isMobile ? () => setText(secondaryExampleText) : undefined}
                        secondLabel={secondaryExampleText}
                        onClear={() => setText("")}
                      />
                      {Object.keys(unsupportedPlain).length > 0 && (
                        <p className="mt-2 text-xs font-medium text-slate-600">
                          Unsupported characters are ignored: {Object.entries(unsupportedPlain).map(([ch, n]) => `${ch}×${n}`).join(", ")}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <textarea
                        id={sourceInputId}
                        className="w-full mt-2 min-h-[12rem] resize-y rounded-xl bg-slate-100 p-4 font-mono outline-none focus:ring-2 focus:ring-sky-300"
                        value={morse}
                        onChange={(e) => setMorse(e.target.value)}
                        placeholder="Example: ... --- ..."
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      <InputButtons onUseExample={() => setMorse(morseExample)} onClear={() => setMorse("")} />
                      {morseIssues.length > 0 && <p className="mt-2 text-xs font-medium text-slate-600">{morseIssues.join(" ")}</p>}
                    </>
                  )}
                </div>

                <div className="overflow-hidden rounded-xl bg-[#202020] p-4 text-slate-200">
                  <h2 className="text-lg font-extrabold text-slate-200">Output (Morse)</h2>
                  <p className="mt-1 text-sm text-slate-300">This is the exact dot-dash pattern used for playback and downloads.</p>
                  <code className="mt-3 block max-h-44 overflow-auto whitespace-pre-wrap break-words bg-transparent font-mono text-sm text-sky-100">
                    {activeCode.trim() || "Your Morse output will appear here."}
                  </code>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCopyMorse}
                      disabled={!canPlay}
                      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition active:scale-95 ${canPlay ? "cursor-pointer bg-slate-700 text-slate-200 hover:bg-slate-600" : "cursor-not-allowed bg-slate-800 text-slate-500"}`}
                    >
                      <CopyIcon size={18} title="Copy Morse" />
                      <span>{copied === "morse" ? "Copied" : "Copy Morse"}</span>
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-300">3 spaces = letters, 7 spaces = words, "/" = word break.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">
                <button
                  onClick={() => {
                    if (player.state === "idle") handlePlay();
                    else if (player.state === "playing") player.pause();
                    else if (player.state === "paused") player.resume();
                  }}
                  disabled={player.state === "playing" ? !player.isSupported : !canPlay || !player.isSupported}
                  className={`flex justify-center items-center gap-2 rounded-lg px-3 py-2 font-semibold cursor-pointer active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 ${player.state === "playing" ? player.isSupported ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : "bg-slate-100 text-slate-400 cursor-not-allowed" : canPlay && player.isSupported ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                >
                  {player.state === "playing" ? <PauseIcon size={22} title="Pause audio" /> : <PlayIcon size={22} title={player.state === "paused" ? "Resume audio" : "Play audio"} />}
                  <span>{player.state === "playing" ? "Pause" : player.state === "paused" ? "Resume" : isSoundPage ? "Play sound" : "Play"}</span>
                </button>

                <button
                  onClick={player.stop}
                  disabled={!player.isSupported || player.state === "idle"}
                  className={`flex justify-center items-center gap-2 rounded-lg px-3 py-2 font-semibold cursor-pointer active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 ${player.isSupported && player.state !== "idle" ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-sky-950" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                >
                  <StopIcon size={22} title="Stop audio" />
                  <span>Stop</span>
                </button>

                <button
                  onClick={() => handleExport(exportFormats.includes("mp3") ? "mp3" : "wav")}
                  disabled={!canPlay || !soundOn}
                  className={`flex justify-center items-center gap-2 rounded-lg px-3 py-2 font-semibold cursor-pointer active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 ${canPlay && soundOn ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-sky-950" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                >
                  <SaveIcon size={22} title="Export audio" />
                  <span>{exportFormats.includes("mp3") ? "Download MP3" : "Export WAV"}</span>
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-extrabold text-sky-950">Sound controls</h2>
                <span className="text-sm text-slate-600">{player.isSupported ? player.state === "idle" ? "Ready" : player.state === "playing" ? "Playing" : "Paused" : "Unavailable"}</span>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <SliderRow label="Character speed" value={charWpm} min={5} max={60} step={1} unit="WPM" onChange={setCharWpm} />
                <SliderRow label="Farnsworth spacing" value={farnsworthWpm} min={5} max={60} step={1} unit="WPM" onChange={setFarnsworthWpm} help="Slower spacing, same character speed" />
                <SliderRow label="Pitch" value={toneHz} min={200} max={1600} step={10} unit="Hz" onChange={setToneHz} disabled={!soundOn || preset === "sounder"} />
                <SliderRow label="Volume" value={Math.round(volume * 100)} min={0} max={100} step={1} unit="%" onChange={(v) => setVolume(v / 100)} disabled={!soundOn} />
              </div>

              {advancedOpen ? (
                <div className="mt-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Tone preset</label>
                      <select value={preset} onChange={(e) => setPreset(e.target.value as SoundPreset)} className="mt-2 w-full rounded-xl bg-slate-100 px-3 py-2 font-semibold cursor-pointer hover:bg-slate-200">
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
                    <TogglePill label="Flash" checked={flash} onChange={(v) => updateFeedbackToggle("flash", v)} icon={<LightBulbIcon size={16} title="Flash" />} describedBy={flash ? STROBE_WARNING_ID : undefined} />
                  </div>

                  {flash ? <StrobeWarning id={STROBE_WARNING_ID} className="mt-3" /> : null}
                </div>
              ) : null}

              <div className="mt-4">
                  <button onClick={() => setAdvancedOpen((v) => !v)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-semibold cursor-pointer active:scale-95 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2">
                  {advancedOpen ? "Hide advanced" : "Show advanced"}
                </button>
              </div>

              

              {exportOpen ? (
                <div className="mt-4 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">File name</label>
                      <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-100 px-3 py-2 font-semibold" placeholder={defaultFileName} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Sample rate</label>
                        <select value={sampleRate} onChange={(e) => setSampleRate(validateSampleRate(Number(e.target.value)))} className="mt-2 w-full rounded-xl bg-slate-100 px-3 py-2 font-semibold cursor-pointer hover:bg-slate-200">
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
                          <select id={`${safePrefix}_mp3_kbps`} value={mp3Kbps} onChange={(e) => setMp3Kbps(Number(e.target.value))} className="rounded-xl bg-slate-100 px-3 py-2 font-semibold cursor-pointer hover:bg-slate-200">
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
                    {exportFormats.includes("wav") ? <ExportButton label="Download WAV" onClick={() => handleExport("wav")} disabled={!canPlay || !soundOn} /> : null}
                    {exportFormats.includes("mp3") ? <ExportButton label="Download MP3" onClick={() => handleExport("mp3")} disabled={!canPlay || !soundOn} /> : null}
                  </div>

                  {exportStatus ? (
                    <p className={`mt-3 text-sm font-semibold ${exportStatus.kind === "error" ? "text-slate-700" : "text-sky-900"}`}>
                      {exportStatus.message}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4">
                  <button onClick={() => setExportOpen((v) => !v)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-semibold cursor-pointer active:scale-95 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2">
                  {exportOpen ? "Hide export" : "Show export"}
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-500">Audio is generated in your browser. WAV rendering is local. MP3 download is encoded in the browser when selected.</p>
              </div>
            </div>
      </section>

        <div className={isSoundPage ? "rounded-2xl bg-white p-5 sm:p-7" : ""}>
             
              {isSoundPage ? (
                <>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["sound generator", "audio generator", "sound maker", "MP3 generator", "beep generator", "tone generator"].map((label) => (
                      <span key={label} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900">
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    {heroStats.map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-slate-100 p-4">
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

function ModeButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-lg px-3 py-2 font-semibold cursor-pointer active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 ${active ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-sky-950"}`}>
      {children}
    </button>
  );
}

function InputButtons({ onUseExample, onUseSecond, secondLabel, onClear }: { onUseExample: () => void; onUseSecond?: () => void; secondLabel?: string; onClear: () => void }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button type="button" onClick={onUseExample} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-sm cursor-pointer active:scale-95 transition">Use example</button>
      {onUseSecond && secondLabel ? <button type="button" onClick={onUseSecond} className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-sm cursor-pointer active:scale-95 transition">{secondLabel}</button> : null}
      <button type="button" onClick={onClear} className="ml-auto px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-sm cursor-pointer active:scale-95 transition">Clear input</button>
    </div>
  );
}

function ExportButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold cursor-pointer active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 ${!disabled ? "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-sky-950" : "text-slate-400 cursor-not-allowed"}`}>
      <SaveIcon size={18} title={label} />
      <span>{label}</span>
    </button>
  );
}

function TogglePill({ label, checked, onChange, icon, describedBy }: { label: string; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode; describedBy?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold cursor-pointer active:scale-95 transition focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 ${checked ? "bg-slate-950 text-sky-100 hover:bg-slate-800 hover:text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-sky-950"}`} aria-pressed={checked} aria-describedby={describedBy}>
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
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} disabled={disabled} style={{ accentColor: "#38bdf8" }} className={`w-full mt-2 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} focus:outline-none focus:ring-2 focus:ring-sky-300 rounded-full`} />
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
  if (raw === "1" || raw === "true") return true;
  if (raw === "0" || raw === "false") return false;
  return fallback;
}

function readStr(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

function writeNum(key: string, value: number) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, String(value)); } catch { /* ignore */ }
}

function writeBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, value ? "1" : "0"); } catch { /* ignore */ }
}

function writeStr(key: string, value: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
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

function validateSampleRate(value: number): 22050 | 44100 | 48000 {
  if (value === 22050 || value === 44100 || value === 48000) return value;
  return 44100;
}

function presetLabel(preset: SoundPreset) {
  if (preset === "cw_radio") return "CW radio";
  if (preset === "sine") return "Sine";
  if (preset === "square") return "Square beep";
  if (preset === "triangle") return "Triangle";
  if (preset === "sawtooth") return "Sawtooth";
  return "Sounder";
}
