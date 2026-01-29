import * as React from "react";

import styles from "~/client/components/audio/styles";
import useMorseAudio, {
  type SoundPreset,
} from "~/client/components/audio/useMorseAudio";
import {
  getUnsupportedTextCharacters,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/audio/morseUtils";

import {
  CopyIcon,
  LoopIcon,
  PauseIcon,
  PlayIcon,
  SaveIcon,
  SoundIcon,
  StopIcon,
  VibrateIcon,
  LightBulbIcon,
} from "~/client/assets/svg/Icons";

type SourceMode = "text" | "morse";

export default function MorseAudioTranslator() {
  const player = useMorseAudio();

  const [sourceMode, setSourceMode] = React.useState<SourceMode>(
    () => (readStr("mw_audio_source", "text") as SourceMode) || "text",
  );

  const [text, setText] = React.useState(() =>
    readStr("mw_audio_text", "sos help"),
  );
  const [morse, setMorse] = React.useState(() =>
    readStr("mw_audio_morse", "... --- ..."),
  );

  const computedMorse = React.useMemo(() => textToMorse(text), [text]);

  const activeCode = React.useMemo(() => {
    return sourceMode === "text" ? computedMorse : morse;
  }, [sourceMode, computedMorse, morse]);

  const [copied, setCopied] = React.useState<string | null>(null);

  const [toneHz, setToneHz] = React.useState<number>(() =>
    readNum("mw_audio_hz", 650),
  );
  const [volume, setVolume] = React.useState<number>(() =>
    readNum("mw_audio_vol", 0.75),
  );
  const [preset, setPreset] = React.useState<SoundPreset>(
    () => (readStr("mw_audio_preset", "cw_radio") as SoundPreset) || "cw_radio",
  );
  const [charWpm, setCharWpm] = React.useState<number>(() =>
    readNum("mw_audio_char_wpm", 20),
  );
  const [farnsworthWpm, setFarnsworthWpm] = React.useState<number>(() =>
    readNum("mw_audio_fwpm", 20),
  );
  const [attackMs, setAttackMs] = React.useState<number>(() =>
    readNum("mw_audio_attack", 8),
  );
  const [releaseMs, setReleaseMs] = React.useState<number>(() =>
    readNum("mw_audio_release", 12),
  );

  const [repeat, setRepeat] = React.useState<boolean>(() =>
    readBool("mw_audio_repeat", false),
  );
  const [soundOn, setSoundOn] = React.useState<boolean>(() =>
    readBool("mw_audio_sound", true),
  );
  const [flash, setFlash] = React.useState<boolean>(() =>
    readBool("mw_audio_flash", false),
  );
  const [vibrate, setVibrate] = React.useState<boolean>(() =>
    readBool("mw_audio_vibrate", false),
  );

  const [advancedOpen, setAdvancedOpen] = React.useState<boolean>(() =>
    readBool("mw_audio_adv_open", true),
  );
  const [exportOpen, setExportOpen] = React.useState<boolean>(() =>
    readBool("mw_audio_export_open", true),
  );

  const [fileName, setFileName] = React.useState(() =>
    readStr("mw_audio_filename", "morse-audio"),
  );
  const [sampleRate, setSampleRate] = React.useState<22050 | 44100 | 48000>(
    () => (readNum("mw_audio_sr", 44100) as 22050 | 44100 | 48000) || 44100,
  );
  const [tailMs, setTailMs] = React.useState<number>(() =>
    readNum("mw_audio_tail", 120),
  );

  React.useEffect(() => {
    writeStr("mw_audio_source", sourceMode);
    writeStr("mw_audio_text", text);
    writeStr("mw_audio_morse", morse);

    writeNum("mw_audio_hz", toneHz);
    writeNum("mw_audio_vol", volume);
    writeStr("mw_audio_preset", preset);
    writeNum("mw_audio_char_wpm", charWpm);
    writeNum("mw_audio_fwpm", farnsworthWpm);
    writeNum("mw_audio_attack", attackMs);
    writeNum("mw_audio_release", releaseMs);

    writeBool("mw_audio_repeat", repeat);
    writeBool("mw_audio_sound", soundOn);
    writeBool("mw_audio_flash", flash);
    writeBool("mw_audio_vibrate", vibrate);

    writeBool("mw_audio_adv_open", advancedOpen);
    writeBool("mw_audio_export_open", exportOpen);

    writeStr("mw_audio_filename", fileName);
    writeNum("mw_audio_sr", sampleRate);
    writeNum("mw_audio_tail", tailMs);
  }, [
    sourceMode,
    text,
    morse,
    toneHz,
    volume,
    preset,
    charWpm,
    farnsworthWpm,
    attackMs,
    releaseMs,
    repeat,
    soundOn,
    flash,
    vibrate,
    advancedOpen,
    exportOpen,
    fileName,
    sampleRate,
    tailMs,
  ]);

  // Flash overlay
  const [flashOn, setFlashOn] = React.useState(false);
  React.useEffect(() => {
    const handler = (e: Event) => {
      if (!flash) return;
      const ms = (e as CustomEvent).detail?.ms ?? 80;
      setFlashOn(true);
      window.setTimeout(() => setFlashOn(false), Math.max(30, ms));
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
    (key: "sound" | "repeat" | "flash" | "vibrate", next: boolean) => {
      const current = { sound: soundOn, repeat, flash, vibrate };
      const updated = { ...current, [key]: next };
      const anyOn =
        updated.sound || updated.repeat || updated.flash || updated.vibrate;

      if (!anyOn) {
        // Keep at least one mode enabled so the page still does something.
        setSoundOn(true);
        setRepeat(false);
        setFlash(false);
        setVibrate(false);
        return;
      }

      if (key === "sound") setSoundOn(next);
      if (key === "repeat") setRepeat(next);
      if (key === "flash") setFlash(next);
      if (key === "vibrate") setVibrate(next);
    },
    [soundOn, repeat, flash, vibrate],
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
      volume: soundOn ? volume : 0,
      preset,
      repeat,
      flash,
      vibrate,
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
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <div className="mb-8 mt-4">
      {flashOn && (
        <div
          className="fixed inset-0 z-[999] pointer-events-none"
          style={{ background: "rgba(255,255,255,0.65)" }}
        />
      )}

      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex flex-col justify-center items-center text-center">
          <h1 style={styles.h1} className="font-bold !text-2xl sm:!text-4xl">
            Morse Code Audio Translator
          </h1>
          <p className="mt-2 text-sm sm:text-lg text-gray-700">
            Generate clean Morse audio from your message. Tune speed, spacing,
            and sound, then export a WAV.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 w-full sm:w-auto">
              <button
                onClick={() => setSourceMode("text")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/2 sm:w-auto ${
                  sourceMode === "text"
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-gray-600 hover:bg-white"
                }`}
                aria-pressed={sourceMode === "text"}
              >
                Text → Audio
              </button>
              <button
                onClick={() => setSourceMode("morse")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition w-1/2 sm:w-auto ${
                  sourceMode === "morse"
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-gray-600 hover:bg-white"
                }`}
                aria-pressed={sourceMode === "morse"}
              >
                Morse → Audio
              </button>
            </div>

            <div className="sm:ml-auto text-sm text-gray-600">
              {player.isSupported ? (
                <>
                  <span className="font-semibold text-neutral-900">
                    Duration:
                  </span>{" "}
                  {formatMs(durationMs)}
                </>
              ) : (
                <span className="text-gray-500">
                  Audio unavailable in this browser
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4 ">
            <div>
              <label htmlFor="mw_audio_source" className="font-semibold">
                {sourceMode === "text" ? "Message (Text)" : "Morse input"}
              </label>

              {sourceMode === "text" ? (
                <>
                  <textarea
                    id="mw_audio_source"
                    className="w-full mt-2 border rounded-md p-3 font-mono h-44 focus:ring-2 focus:ring-neutral-900"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Example: Hello world"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  {Object.keys(unsupportedPlain).length > 0 && (
                    <p className="mt-2 text-xs text-amber-600">
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
                    className="w-full mt-2 border rounded-md p-3 font-mono h-44 focus:ring-2 focus:ring-neutral-900"
                    value={morse}
                    onChange={(e) => setMorse(e.target.value)}
                    placeholder="Example: ... --- ..."
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  {morseIssues.length > 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      {morseIssues.join(" ")}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className=" flex items-center gap-2">
            <button
              onClick={handleCopyMorse}
              disabled={!canPlay}
              className={`inline-flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl font-semibold active:scale-95 transition border ${
                canPlay
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <CopyIcon size={18} title="Copy Morse" />
              <span>Copy Morse</span>
            </button>
            {copied === "morse" && (
              <span className="text-sm text-green-600">Copied</span>
            )}
            <span className="ml-auto text-xs text-gray-500">
              3 spaces = letters, 7 spaces = words, “/” = word break
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
              className={`flex justify-center items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition ${
                player.state === "playing"
                  ? player.isSupported
                    ? "border border-neutral-900 text-neutral-900 hover:bg-gray-50"
                    : "border border-gray-200 text-gray-400 cursor-not-allowed"
                  : canPlay && player.isSupported
                    ? "bg-neutral-900 text-sky-200 hover:bg-neutral-800 hover:text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {player.state === "playing" ? (
                <PauseIcon size={22} title="Pause audio" />
              ) : (
                <PlayIcon
                  size={22}
                  title={
                    player.state === "paused" ? "Resume audio" : "Play audio"
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
              className={`flex justify-center items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition border ${
                player.isSupported && player.state !== "idle"
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <StopIcon size={22} title="Stop audio" />
              <span>Stop</span>
            </button>

            <button
              onClick={handleExportWav}
              disabled={!canPlay || !soundOn}
              className={`flex justify-center items-center gap-2 px-3 py-2 rounded-xl font-semibold cursor-pointer active:scale-95 transition border ${
                canPlay && soundOn
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <SaveIcon size={22} title="Export WAV" />
              <span>Export WAV</span>
            </button>
          </div>

          <div className="border border-gray-200 rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-neutral-900">
                Audio controls
              </h2>
              <span className="text-sm text-gray-600">
                {player.isSupported
                  ? player.state === "idle"
                    ? "Ready"
                    : player.state
                  : "Unsupported"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SliderRow
                label="Character speed"
                value={charWpm}
                min={5}
                max={50}
                step={1}
                unit="WPM"
                onChange={setCharWpm}
                help="Controls dit and dah timing."
              />
              <SliderRow
                label="Farnsworth spacing"
                value={farnsworthWpm}
                min={5}
                max={50}
                step={1}
                unit="WPM"
                onChange={setFarnsworthWpm}
                help="Slows spacing without changing dit length."
              />
              <SliderRow
                label="Pitch"
                value={toneHz}
                min={250}
                max={1200}
                step={10}
                unit="Hz"
                onChange={setToneHz}
                disabled={!soundOn || preset === "sounder"}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SliderRow
                label="Volume"
                value={Math.round(volume * 100)}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={(v) => setVolume(v / 100)}
                disabled={!soundOn}
              />
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
              />
              <TogglePill
                label="Vibrate"
                checked={vibrate}
                onChange={(v) => setFeedback("vibrate", v)}
                icon={<VibrateIcon size={16} title="Vibrate" />}
              />
            </div>

            <div className="mt-4">
              <button
                onClick={() => setAdvancedOpen((v) => !v)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer active:scale-95 transition"
                aria-expanded={advancedOpen}
              >
                <span className="text-sm font-semibold text-neutral-900">
                  Sound options
                </span>
                <span aria-hidden className="text-gray-500">
                  {advancedOpen ? "▴" : "▾"}
                </span>
              </button>

              {advancedOpen && (
                <div className="mt-3 grid gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Sound type
                      </label>
                      <select
                        value={preset}
                        onChange={(e) =>
                          setPreset(e.target.value as SoundPreset)
                        }
                        disabled={!soundOn}
                        className={`mt-1 w-full border rounded-xl p-2 bg-white hover:bg-gray-50 ${
                          soundOn
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-60"
                        }`}
                      >
                        <option value="cw_radio">CW radio (sine)</option>
                        <option value="sine">Sine</option>
                        <option value="square">Square</option>
                        <option value="triangle">Triangle</option>
                        <option value="sawtooth">Sawtooth</option>
                        <option value="sounder">Telegraph sounder</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Tip: Square is bright and edgy. Triangle is softer.
                        Sounder is percussive.
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div className="text-sm font-semibold text-neutral-900">
                        Timing summary
                      </div>
                      <div className="mt-1 text-xs text-gray-600 leading-5">
                        <div>
                          <span className="font-semibold">dit</span> ={" "}
                          {Math.round(1200 / clampNum(charWpm, 1, 80))} ms
                        </div>
                        <div>
                          <span className="font-semibold">dah</span> = 3 dits
                        </div>
                        <div>
                          <span className="font-semibold">gap</span> inside a
                          letter = 1 dit
                        </div>
                        <div>
                          <span className="font-semibold">letter gap</span> = 3
                          units (scaled by Farnsworth)
                        </div>
                        <div>
                          <span className="font-semibold">word gap</span> = 7
                          units (scaled by Farnsworth)
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">
                    For learning, a common setup is a faster{" "}
                    <strong>Character speed</strong> with a lower{" "}
                    <strong>Farnsworth spacing</strong>. That keeps dits and
                    dahs crisp but gives your brain extra time between
                    characters.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer active:scale-95 transition"
                aria-expanded={exportOpen}
              >
                <span className="text-sm font-semibold text-neutral-900">
                  Export settings
                </span>
                <span aria-hidden className="text-gray-500">
                  {exportOpen ? "▴" : "▾"}
                </span>
              </button>

              {exportOpen && (
                <div className="mt-3 grid gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Filename
                      </label>
                      <input
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="mt-1 w-full border rounded-xl p-2 bg-white focus:ring-2 focus:ring-neutral-900"
                        placeholder="morse-audio"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Exports as .wav
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        Sample rate
                      </label>
                      <select
                        value={sampleRate}
                        onChange={(e) =>
                          setSampleRate(Number(e.target.value) as any)
                        }
                        className="mt-1 w-full border rounded-xl p-2 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <option value={22050}>22050 Hz</option>
                        <option value={44100}>44100 Hz</option>
                        <option value={48000}>48000 Hz</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        44100 Hz is the safest default.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <SliderRow
                      label="Tail padding"
                      value={tailMs}
                      min={0}
                      max={500}
                      step={10}
                      unit="ms"
                      onChange={setTailMs}
                      help="Adds silence after the last symbol."
                      disabled={!soundOn}
                    />

                    <div className="sm:col-span-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div className="text-sm font-semibold text-neutral-900">
                        What export does
                      </div>
                      <p className="mt-1 text-xs text-gray-600 leading-5">
                        Export uses an offline audio render so timing stays
                        consistent even if your device stutters. The download is
                        a standard PCM WAV file.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleExportWav}
                      disabled={!canPlay || !soundOn}
                      className={`inline-flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl font-semibold active:scale-95 transition ${
                        canPlay && soundOn
                          ? "bg-neutral-900 hover:bg-neutral-800 text-sky-200 hover:text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <SaveIcon size={18} title="Export WAV" />
                      <span>Download WAV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Audio is generated in your browser. Nothing is uploaded.
          </p>
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
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border cursor-pointer active:scale-95 transition ${
        checked
          ? "border-neutral-900 bg-neutral-900 text-sky-200 hover:bg-neutral-800 hover:text-white"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
      aria-pressed={checked}
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
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-sm text-gray-600">
          {value} {unit}
        </span>
      </div>
      {help && <p className="text-xs text-gray-500 mt-0.5">{help}</p>}
      <input
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
  if (!ms || ms <= 0) return "0:00";
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function sanitizeFileBase(name: string) {
  const trimmed = (name || "").trim();
  const safe = trimmed
    .replace(/[^\w\- ]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return safe || "morse-audio";
}
