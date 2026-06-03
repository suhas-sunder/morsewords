import * as React from "react";

import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
  LightBulbIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  TuneIcon,
  VolumeIcon,
  VolumeOffIcon,
  WarningBadgeIcon,
} from "~/client/assets/svg/Icons";
import { AudioPresetOptions } from "~/client/components/shared/AudioPresetPicker";
import {
  audioPresetAllowsPitchControl,
  getAudioPresetDefaults,
  sanitizeAudioTonePreset,
  type AudioTonePresetId,
} from "~/client/components/shared/audioPresetRegistry";
import {
  AUDIO_PITCH_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  VOLUME_RANGE,
  clampFarnsworthWpm,
  sanitizeAudioSampleRate,
} from "~/client/components/shared/morseSettings";
import {
  getUnsupportedTextCharacters,
  morseToText,
  normalizeMorseForDecoding,
  textToMorse,
} from "~/client/components/shared/morseUtils";
import {
  estimateMorseDurationMs,
  hasPlayableMorse,
} from "~/client/components/shared/morseTiming";
import { clampNumber } from "~/client/components/shared/settingsStorage";
import {
  ToolButton,
  ToolModeButton,
  ToolOutputPanel,
  ToolPanel,
  ToolSampleButtons,
  ToolTextarea,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import StatusMessage from "~/client/components/shared/ui/StatusMessage";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import TogglePill from "~/client/components/shared/ui/TogglePill";
import {
  copyTextToClipboard,
  downloadBlobFile,
  sanitizeDownloadFilename,
} from "~/client/components/shared/actionOutputUtils";
import { ROUTES } from "~/client/data/routes";
import {
  MORSE_VIDEO_BACKGROUND_LABELS,
  MORSE_VIDEO_INTENSITY_LABELS,
  MORSE_VIDEO_RESOLUTION_LABELS,
  MORSE_VIDEO_VISUAL_STYLE_DETAILS,
} from "~/client/components/shared/video/morseVideoPresets";
import {
  buildMorseVideoPreview,
  type MorseVideoPreview,
} from "~/client/components/shared/video/morseVideoPreview";
import {
  createMorseVideoBlob,
} from "~/client/components/shared/video/morseVideoExport";
import type { MorseVideoAudioSettings } from "~/client/components/shared/video/morseVideoRenderer";
import {
  describeMorseVideoFormat,
  detectMorseVideoSupport,
  type MorseVideoSupport,
} from "~/client/components/shared/video/morseVideoSupport";
import {
  MORSE_VIDEO_INTENSITIES,
  MORSE_VIDEO_RESOLUTIONS,
  MORSE_VIDEO_STANDALONE_BACKGROUND_STYLES,
  MORSE_VIDEO_VISUAL_STYLES,
  sanitizeMorseVideoSettings,
  type MorseVideoBackgroundStyle,
  type MorseVideoSettings,
  type MorseVideoTextDisplayMode,
} from "~/client/components/shared/video/morseVideoTypes";
import {
  DEFAULT_VIDEO_GENERATOR_PREFERENCES,
  DEFAULT_STANDALONE_VIDEO_SETTINGS,
  loadVideoGeneratorPreferences,
  saveVideoGeneratorPreferences,
} from "./videoGeneratorPreferences";

type SourceMode = "text" | "morse";
type DownloadStatus = {
  kind: "working" | "success" | "error";
  message: string;
};

const SOURCE_MODES = ["text", "morse"] as const;
const EXAMPLES = ["SOS", "HELLO WORLD", "HELP ME", "CQ CQ", "TEST 123"];
const DEFAULT_TEXT = "sos help";
const DEFAULT_MORSE = "... --- ...";
const MAX_SHORT_VIDEO_MS = 180_000;
const DEFAULT_AUDIO = getAudioPresetDefaults("cw_radio");
const DEFAULT_VIDEO_SETTINGS: MorseVideoSettings =
  DEFAULT_STANDALONE_VIDEO_SETTINGS;
const FULL_FRAME_FLASH_WARNING =
  "Full-frame flash mode can create rapid full-frame flashing in the finished video and may be uncomfortable or unsafe for some viewers. Use Lightbulb or Dot for a smaller flash area.";

export default function MorseVideoGeneratorTool() {
  const inputId = React.useId();
  const fileNameId = React.useId();
  const tonePresetId = React.useId();
  const sampleRateId = React.useId();
  const downloadAbortRef = React.useRef<AbortController | null>(null);
  const downloadVersionRef = React.useRef(0);

  const [sourceMode, setSourceMode] = React.useState<SourceMode>("text");
  const [text, setText] = React.useState(DEFAULT_TEXT);
  const [morse, setMorse] = React.useState(DEFAULT_MORSE);
  const [videoSettings, setVideoSettings] =
    React.useState<MorseVideoSettings>(DEFAULT_VIDEO_SETTINGS);
  const [charWpm, setCharWpm] = React.useState(18);
  const [farnsworthWpm, setFarnsworthWpm] = React.useState(12);
  const [tonePreset, setTonePreset] =
    React.useState<AudioTonePresetId>("cw_radio");
  const [pitch, setPitch] = React.useState(DEFAULT_AUDIO.pitchHz);
  const [volume, setVolume] = React.useState(DEFAULT_AUDIO.volume);
  const [sampleRate, setSampleRate] = React.useState<22050 | 44100 | 48000>(
    44100,
  );
  const [fileName, setFileName] = React.useState("morse-code-video");
  const [videoSupport, setVideoSupport] =
    React.useState<MorseVideoSupport | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [previewPlaying, setPreviewPlaying] = React.useState(false);
  const [visualStep, setVisualStep] = React.useState(0);
  const [downloadStatus, setDownloadStatus] =
    React.useState<DownloadStatus | null>(null);
  const [downloadProgress, setDownloadProgress] = React.useState({
    elapsedMs: 0,
    durationMs: 0,
  });
  const [lastDownload, setLastDownload] = React.useState<{
    filename: string;
    durationMs: number;
    sizeBytes: number;
  } | null>(null);

  React.useEffect(() => {
    const preferences = loadVideoGeneratorPreferences();
    setSourceMode(preferences.sourceMode);
    setVideoSettings(preferences.videoSettings);
    setCharWpm(preferences.charWpm);
    setFarnsworthWpm(preferences.farnsworthWpm);
    setTonePreset(preferences.tonePreset);
    setPitch(preferences.pitch);
    setVolume(preferences.volume);
    setSampleRate(preferences.sampleRate);
    setFileName(preferences.fileName);
    setPreferencesLoaded(true);
    setVideoSupport(detectMorseVideoSupport());
    setHydrated(true);
  }, []);

  const audioTrackAvailable = videoSupport?.audioTrackSupported ?? true;

  React.useEffect(() => {
    if (!videoSupport || videoSupport.audioTrackSupported) return;
    setVideoSettings((current) =>
      current.includeAudioTrack
        ? sanitizeMorseVideoSettings({
            ...current,
            includeAudioTrack: false,
          })
        : current,
    );
  }, [videoSupport]);

  React.useEffect(() => {
    if (!preferencesLoaded) return;
    saveVideoGeneratorPreferences({
      ...DEFAULT_VIDEO_GENERATOR_PREFERENCES,
      sourceMode,
      videoSettings,
      charWpm,
      farnsworthWpm,
      tonePreset,
      pitch,
      volume,
      sampleRate,
      fileName,
    });
  }, [
    charWpm,
    farnsworthWpm,
    fileName,
    pitch,
    preferencesLoaded,
    sampleRate,
    sourceMode,
    tonePreset,
    videoSettings,
    volume,
  ]);

  React.useEffect(() => {
    if (!previewPlaying) return undefined;
    const timer = window.setInterval(() => {
      setVisualStep((step) => step + 1);
    }, 320);
    return () => window.clearInterval(timer);
  }, [previewPlaying]);

  const textResult = React.useMemo(
    () =>
      textToMorse(text, {
        returnResult: true,
        unsupportedText: "omit",
      }),
    [text],
  );
  const morseResult = React.useMemo(
    () =>
      morseToText(morse, {
        returnResult: true,
        unknownToken: "placeholder",
      }),
    [morse],
  );
  const normalizedMorseInput = React.useMemo(
    () => normalizeMorseForDecoding(morse),
    [morse],
  );
  const activeMorse =
    sourceMode === "text"
      ? textResult.value.trim()
      : normalizedMorseInput.normalized.trim();
  const activeText =
    sourceMode === "text" ? textResult.normalizedInput : morseResult.value;
  const unsupportedPlain = React.useMemo(
    () => getUnsupportedTextCharacters(text),
    [text],
  );
  const unknownMorseTokens = morseResult.issues
    .filter((issue) => issue.type === "unknown-morse-token")
    .map((issue) => issue.value);
  const hasSourceCode = activeMorse.length > 0;
  const canRender = React.useMemo(
    () => hasPlayableMorse(activeMorse),
    [activeMorse],
  );
  const durationMs = React.useMemo(() => {
    if (!canRender) return 0;
    return (
      estimateMorseDurationMs(activeMorse, {
        charWpm,
        farnsworthWpm,
      }) + 160
    );
  }, [activeMorse, canRender, charWpm, farnsworthWpm]);
  const tooLong = durationMs > MAX_SHORT_VIDEO_MS;
  const supportReady = hydrated && videoSupport !== null;
  const effectiveVideoSettings = React.useMemo(
    () =>
      sanitizeMorseVideoSettings({
        ...videoSettings,
        includeAudioTrack:
          videoSettings.includeAudioTrack && Boolean(audioTrackAvailable),
      }),
    [audioTrackAvailable, videoSettings],
  );
  const audioSettings = React.useMemo<MorseVideoAudioSettings>(
    () => ({
      charWpm,
      farnsworthWpm,
      tonePreset,
      pitch,
      volume,
      sampleRate,
      tailPaddingMs: 160,
    }),
    [charWpm, farnsworthWpm, pitch, sampleRate, tonePreset, volume],
  );
  const preview = React.useMemo(
    () => buildMorseVideoPreview(effectiveVideoSettings, activeText),
    [activeText, effectiveVideoSettings],
  );
  const resolvedBackgroundStyle =
    effectiveVideoSettings.backgroundStyle === "dark-morsewords"
      ? "dark-morsewords"
      : "warm-morsewords";
  const videoFormatLabel = describeMorseVideoFormat(videoSupport);
  const downloadDisabledReason = getDownloadDisabledReason({
    canRender,
    hasSourceCode,
    support: videoSupport,
    supportReady,
    tooLong,
  });
  const canDownload =
    !downloadDisabledReason && !downloadAbortRef.current && canRender;
  const progressPercent =
    downloadProgress.durationMs > 0
      ? Math.min(
          100,
          Math.round(
            (downloadProgress.elapsedMs / downloadProgress.durationMs) * 100,
          ),
        )
      : 0;

  const settingsSignature = JSON.stringify({
    activeMorse,
    charWpm,
    farnsworthWpm,
    pitch,
    sampleRate,
    tonePreset,
    volume,
    videoSettings: effectiveVideoSettings,
  });

  React.useEffect(() => {
    if (downloadAbortRef.current) {
      downloadAbortRef.current.abort();
      downloadAbortRef.current = null;
      downloadVersionRef.current += 1;
      setDownloadStatus({
        kind: "error",
        message: "Input or settings changed; video download cancelled.",
      });
    } else {
      setDownloadStatus(null);
    }
    setLastDownload(null);
    setDownloadProgress({ elapsedMs: 0, durationMs: 0 });
  }, [settingsSignature]);

  const updateVideoSettings = React.useCallback(
    (patch: Partial<MorseVideoSettings>) => {
      const normalizedPatch =
        patch.textDisplayMode !== undefined
          ? {
              ...patch,
              showMorseOverlay:
                patch.textDisplayMode === "morse" ||
                patch.textDisplayMode === "both",
            }
          : patch.showMorseOverlay !== undefined
            ? {
                ...patch,
                textDisplayMode: (patch.showMorseOverlay
                  ? "morse"
                  : "none") as MorseVideoTextDisplayMode,
              }
            : patch;
      setVideoSettings((current) =>
        sanitizeMorseVideoSettings({
          ...current,
          ...normalizedPatch,
        }),
      );
    },
    [],
  );

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

  const handleTonePresetChange = React.useCallback((value: string) => {
    const nextPreset = sanitizeAudioTonePreset(value, "cw_radio", "bookExport");
    const defaults = getAudioPresetDefaults(nextPreset);
    setTonePreset(nextPreset);
    setPitch(defaults.pitchHz);
    setVolume(defaults.volume);
  }, []);

  const handlePickExample = (example: string) => {
    if (sourceMode === "text") {
      setText(example);
    } else {
      setMorse(textToMorse(example));
    }
  };

  const handleClear = () => {
    if (sourceMode === "text") {
      setText("");
    } else {
      setMorse("");
    }
    setCopied(false);
    setPreviewPlaying(false);
  };

  const handleCopyMorse = async () => {
    if (!activeMorse) return;
    const result = await copyTextToClipboard(activeMorse);
    setCopied(result.ok);
    setDownloadStatus({
      kind: result.ok ? "success" : "error",
      message: result.message,
    });
    if (result.ok) {
      window.setTimeout(() => setCopied(false), 1100);
    }
  };

  const handleCancelDownload = () => {
    if (!downloadAbortRef.current) return;
    downloadAbortRef.current.abort();
  };

  const handleDownloadWebm = async () => {
    if (!canDownload || !videoSupport) return;
    const version = downloadVersionRef.current + 1;
    downloadVersionRef.current = version;
    const controller = new AbortController();
    downloadAbortRef.current = controller;
    setDownloadProgress({ elapsedMs: 0, durationMs });
    setDownloadStatus({
      kind: "working",
      message: "Starting WebM video download...",
    });

    try {
      const result = await createMorseVideoBlob({
        audioSettings,
        morse: activeMorse,
        text: activeText,
        resolvedBackgroundStyle,
        settings: effectiveVideoSettings,
        signal: controller.signal,
        support: videoSupport,
        onProgress: (elapsedMs, nextDurationMs) => {
          if (downloadVersionRef.current !== version) return;
          setDownloadProgress({ elapsedMs, durationMs: nextDurationMs });
          setDownloadStatus({
            kind: "working",
            message: `Recording WebM video (${formatDuration(elapsedMs)} of ${formatDuration(
              nextDurationMs,
            )})...`,
          });
        },
      });

      if (
        downloadVersionRef.current !== version ||
        controller.signal.aborted
      ) {
        return;
      }

      const filename = sanitizeDownloadFilename(
        `${sanitizeFileBase(fileName || "morse-code-video")}.webm`,
        "morse-code-video.webm",
      );
      const download = downloadBlobFile({
        blob: result.blob,
        filename,
      });
      if (!download.ok) {
        setDownloadStatus({ kind: "error", message: download.message });
        return;
      }
      setLastDownload({
        filename,
        durationMs: result.durationMs,
        sizeBytes: result.blob.size,
      });
      setDownloadStatus({
        kind: "success",
        message: "WebM download started.",
      });
      setDownloadProgress({
        elapsedMs: result.durationMs,
        durationMs: result.durationMs,
      });
    } catch (error) {
      if (downloadVersionRef.current !== version) return;
      if (isAbortError(error)) {
        setDownloadStatus({
          kind: "error",
          message: "Video download cancelled.",
        });
        setDownloadProgress({ elapsedMs: 0, durationMs: 0 });
      } else {
        setDownloadStatus({
          kind: "error",
          message:
            "WebM export failed. Try 720p, a shorter message, or silent video.",
        });
      }
    } finally {
      if (downloadVersionRef.current === version) {
        downloadAbortRef.current = null;
      }
    }
  };

  return (
    <section
      className="mw-tool-section mt-0"
      aria-labelledby="video-generator-tool-title"
      data-mw-video-generator-ready={supportReady ? "true" : "false"}
    >
      <h2 id="video-generator-tool-title" className="sr-only">
        Generate a short Morse code video
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
              Text to Morse video
            </ToolModeButton>
            <ToolModeButton
              active={sourceMode === "morse"}
              onClick={() => setSourceMode("morse")}
              hover="dark"
              className="w-1/2 rounded-md px-3 py-2 sm:w-auto"
            >
              Morse code to video
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
              <span>Est. video: {formatDuration(durationMs)}</span>
              <span aria-hidden="true">Format: {videoFormatLabel}</span>
            </div>
          }
        >
          {sourceMode === "text" ? (
            <>
              <ToolTextarea
                id={inputId}
                aria-label="Message to turn into a Morse code video"
                value={text}
                onChange={(event) => setText(event.target.value)}
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
                id={inputId}
                aria-label="Morse code to turn into a video"
                value={morse}
                onChange={(event) => setMorse(event.target.value)}
                placeholder="Paste Morse, for example ... --- ..."
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {normalizedMorseInput.invalidChars.length > 0 ? (
                <p className="px-4 pb-3 text-sm font-semibold text-slate-600">
                  Invalid Morse input characters:{" "}
                  {normalizedMorseInput.invalidChars.join(" ")}
                </p>
              ) : null}
              {unknownMorseTokens.length > 0 ? (
                <p className="px-4 pb-3 text-sm font-semibold text-slate-600">
                  Unknown Morse tokens: {unique(unknownMorseTokens).join(" ")}
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
                disabled={!activeMorse}
                className="rounded-lg"
              >
                {copied ? (
                  <CheckCircleIcon
                    size={18}
                    title={undefined}
                    aria-hidden="true"
                  />
                ) : (
                  <CopyIcon size={18} title={undefined} aria-hidden="true" />
                )}
                {copied ? "Copied" : "Copy Morse"}
              </ToolButton>
            </div>
          }
        >
          <textarea
            aria-label="Generated Morse output"
            readOnly
            value={activeMorse}
            placeholder="Generated Morse appears here."
            className="mw-output-text mw-input-placeholder min-h-[10rem] max-h-[18rem] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm leading-relaxed tracking-[0.14em] text-sky-100 outline-none placeholder:text-slate-400 focus:ring-0 focus-visible:outline-none sm:text-base"
          />
        </ToolOutputPanel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:items-start">
        <MorseVideoPreviewPanel
          isPlaying={previewPlaying}
          preview={preview}
          resolvedBackgroundStyle={resolvedBackgroundStyle}
          settings={effectiveVideoSettings}
          visualStep={visualStep}
        />

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ToolButton
              type="button"
              tone={previewPlaying ? "light" : "dark"}
              active={!previewPlaying && canRender}
              onClick={() => setPreviewPlaying((value) => !value)}
              disabled={!canRender}
              className="rounded-xl"
            >
              {previewPlaying ? (
                <StopIcon size={20} title="Stop visual preview" />
              ) : (
                <PlayIcon size={20} title="Play visual preview" />
              )}
              {previewPlaying ? "Stop visual preview" : "Play visual preview"}
            </ToolButton>
            <ToolButton
              type="button"
              tone="light"
              hover="dark"
              onClick={handleDownloadWebm}
              disabled={!canDownload}
              aria-describedby={
                downloadDisabledReason ? "video-download-disabled-reason" : undefined
              }
              className="rounded-xl"
            >
              <DownloadIcon size={20} title={undefined} aria-hidden="true" />
              Download WebM
            </ToolButton>
            {downloadAbortRef.current ? (
              <ToolButton
                type="button"
                tone="light"
                hover="dark"
                onClick={handleCancelDownload}
                className="rounded-xl"
              >
                <StopIcon size={20} title={undefined} aria-hidden="true" />
                Cancel download
              </ToolButton>
            ) : null}
          </div>

          {downloadDisabledReason ? (
            <p
              id="video-download-disabled-reason"
              className="text-sm font-semibold leading-relaxed text-slate-600"
            >
              {downloadDisabledReason}{" "}
              {tooLong ? (
                <a
                  href={ROUTES.bookTranslator}
                  className="font-semibold text-sky-900 underline-offset-4 hover:underline"
                >
                  Use the book translator for long-form export.
                </a>
              ) : null}
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-slate-600">
              WebM export starts only when you click download.
            </p>
          )}

          {downloadStatus ? (
            <StatusMessage
              kind={
                downloadStatus.kind === "success"
                  ? "success"
                  : downloadStatus.kind
              }
              live
            >
              {downloadStatus.message}
            </StatusMessage>
          ) : null}

          {downloadProgress.durationMs > 0 ? (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
              className="h-2 overflow-hidden rounded-full bg-slate-300/80"
            >
              <div
                className="h-full bg-sky-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          ) : null}

          {lastDownload ? (
            <div className="text-sm leading-relaxed text-slate-700">
              <p className="font-extrabold text-sky-950">Last download</p>
              <p>
                {lastDownload.filename} - {formatDuration(lastDownload.durationMs)}
                , {formatBytes(lastDownload.sizeBytes)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <VideoSettingsEditor
          audioSettings={audioSettings}
          audioTrackAvailable={audioTrackAvailable}
          fileName={fileName}
          fileNameId={fileNameId}
          onAudioSettingsChange={{
            charWpm: handleCharWpmChange,
            farnsworthWpm: handleFarnsworthWpmChange,
            pitch: setPitch,
            sampleRate: (value) =>
              setSampleRate(sanitizeAudioSampleRate(value)),
            tonePreset: handleTonePresetChange,
            volume: (value) => setVolume(value),
          }}
          onFileNameChange={setFileName}
          onVideoSettingsChange={updateVideoSettings}
          sampleRateId={sampleRateId}
          settings={videoSettings}
          support={videoSupport}
          tonePresetId={tonePresetId}
        />
      </div>
    </section>
  );
}

function VideoSettingsEditor({
  audioSettings,
  audioTrackAvailable,
  fileName,
  fileNameId,
  onAudioSettingsChange,
  onFileNameChange,
  onVideoSettingsChange,
  sampleRateId,
  settings,
  support,
  tonePresetId,
}: {
  audioSettings: MorseVideoAudioSettings;
  audioTrackAvailable: boolean;
  fileName: string;
  fileNameId: string;
  onAudioSettingsChange: {
    charWpm: (value: number) => void;
    farnsworthWpm: (value: number) => void;
    pitch: (value: number) => void;
    sampleRate: (value: number) => void;
    tonePreset: (value: string) => void;
    volume: (value: number) => void;
  };
  onFileNameChange: (value: string) => void;
  onVideoSettingsChange: (patch: Partial<MorseVideoSettings>) => void;
  sampleRateId: string;
  settings: MorseVideoSettings;
  support: MorseVideoSupport | null;
  tonePresetId: string;
}) {
  const audioControlsVisible = settings.includeAudioTrack && audioTrackAvailable;

  return (
    <details className="group" open>
      <summary className={toolControlButtonClass({ hover: "dark", full: true })}>
        <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
        Video settings
      </summary>
      <div className="mt-5 space-y-6">
        <fieldset>
          <legend className="text-base font-extrabold text-sky-950">
            Visual style
          </legend>
          <div
            className="mt-3 grid gap-2 sm:grid-cols-2"
            role="radiogroup"
            aria-label="Video visual style"
          >
            {MORSE_VIDEO_VISUAL_STYLES.map((style) => {
              const details = MORSE_VIDEO_VISUAL_STYLE_DETAILS[style];
              const active = settings.visualStyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onVideoSettingsChange({ visualStyle: style })}
                  className={toolControlButtonClass({
                    active,
                    tone: active ? "dark" : "light",
                    size: "md",
                    rounded: "xl",
                    hover: "dark",
                  })}
                >
                  <span className="font-extrabold">{details.label}</span>
                  <span className="text-xs font-semibold">
                    {details.description}
                  </span>
                </button>
              );
            })}
          </div>
          {settings.visualStyle === "full-frame" ? (
            <FullFrameFlashWarning className="mt-3" />
          ) : null}
        </fieldset>

        <div className="grid gap-5 lg:grid-cols-3">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-700">
              Video resolution
            </legend>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Video resolution"
            >
              {MORSE_VIDEO_RESOLUTIONS.map((resolution) => (
                <VideoSettingButton
                  key={resolution}
                  active={settings.resolution === resolution}
                  label={MORSE_VIDEO_RESOLUTION_LABELS[resolution]}
                  onClick={() => onVideoSettingsChange({ resolution })}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700">
              Frame background
            </legend>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Video frame background"
            >
              {MORSE_VIDEO_STANDALONE_BACKGROUND_STYLES.map((background) => (
                <VideoSettingButton
                  key={background}
                  active={settings.backgroundStyle === background}
                  label={MORSE_VIDEO_BACKGROUND_LABELS[background]}
                  onClick={() =>
                    onVideoSettingsChange({
                      backgroundStyle: background as MorseVideoBackgroundStyle,
                    })
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700">
              Visual intensity
            </legend>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Video visual intensity"
            >
              {MORSE_VIDEO_INTENSITIES.map((intensity) => (
                <VideoSettingButton
                  key={intensity}
                  active={settings.intensity === intensity}
                  label={MORSE_VIDEO_INTENSITY_LABELS[intensity]}
                  onClick={() => onVideoSettingsChange({ intensity })}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <TogglePill
            checked={settings.includeAudioTrack && audioTrackAvailable}
            disabled={!audioTrackAvailable}
            label="Include audio track"
            onChange={(value) =>
              onVideoSettingsChange({ includeAudioTrack: value })
            }
            icon={
              settings.includeAudioTrack && audioTrackAvailable ? (
                <VolumeIcon size={16} title={undefined} aria-hidden="true" />
              ) : (
                <VolumeOffIcon size={16} title={undefined} aria-hidden="true" />
              )
            }
            rounded="lg"
          />
          <TogglePill
            checked={settings.showMorseOverlay}
            label="Show Morse text overlay"
            onChange={(value) =>
              onVideoSettingsChange({
                showMorseOverlay: value,
                textDisplayMode: value ? "morse" : "none",
              })
            }
            rounded="lg"
          />
          <TogglePill
            checked={settings.showBranding}
            label="Show minimal MorseWords branding"
            onChange={(value) => onVideoSettingsChange({ showBranding: value })}
            rounded="lg"
          />
        </div>

        {!audioTrackAvailable ? (
          <p className="text-sm leading-relaxed text-slate-600">
            {support?.audioTrackReason ??
              "Checking audio-track support for video export."}
          </p>
        ) : null}

        <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          <SliderRow
            label="Character speed"
            value={audioSettings.charWpm}
            min={AUDIO_SPEED_RANGE.min}
            max={AUDIO_SPEED_RANGE.max}
            step={1}
            unit="WPM"
            onChange={onAudioSettingsChange.charWpm}
          />
          <SliderRow
            label="Farnsworth spacing"
            value={audioSettings.farnsworthWpm}
            min={AUDIO_SPEED_RANGE.min}
            max={Math.max(AUDIO_SPEED_RANGE.min, audioSettings.charWpm)}
            step={1}
            unit="WPM"
            onChange={onAudioSettingsChange.farnsworthWpm}
          />
        </div>

        {audioControlsVisible ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_150px] lg:items-end">
            <LabeledSelect
              id={tonePresetId}
              label="Tone preset"
              value={audioSettings.tonePreset}
              onChange={(event) =>
                onAudioSettingsChange.tonePreset(event.target.value)
              }
            >
              <AudioPresetOptions context="bookExport" />
            </LabeledSelect>
            <SliderRow
              label="Pitch"
              value={audioSettings.pitch}
              min={AUDIO_PITCH_RANGE.min}
              max={AUDIO_PITCH_RANGE.max}
              step={10}
              unit="Hz"
              onChange={onAudioSettingsChange.pitch}
              disabled={!audioPresetAllowsPitchControl(audioSettings.tonePreset)}
            />
            <SliderRow
              label="Volume"
              value={Math.round(audioSettings.volume * 100)}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(value) =>
                onAudioSettingsChange.volume(
                  clampNumber(value / 100, VOLUME_RANGE.min, VOLUME_RANGE.max),
                )
              }
              icon={<VolumeIcon size={16} title={undefined} aria-hidden="true" />}
            />
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-end">
          <LabeledInput
            id={fileNameId}
            label="File name"
            value={fileName}
            onChange={(event) => onFileNameChange(event.target.value)}
            placeholder="morse-code-video"
          />
          <LabeledSelect
            id={sampleRateId}
            label="Sample rate"
            value={String(audioSettings.sampleRate)}
            onChange={(event) =>
              onAudioSettingsChange.sampleRate(Number(event.target.value))
            }
            disabled={!audioControlsVisible}
          >
            {AUDIO_SAMPLE_RATES.map((rate) => (
              <option key={rate} value={rate}>
                {rate}
              </option>
            ))}
          </LabeledSelect>
        </div>
      </div>
    </details>
  );
}

function VideoSettingButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={toolControlButtonClass({
        active,
        tone: active ? "dark" : "light",
        size: "sm",
        rounded: "full",
        hover: "dark",
      })}
    >
      {label}
    </button>
  );
}

function FullFrameFlashWarning({ className = "" }: { className?: string }) {
  return (
    <div
      data-testid="morse-video-full-frame-warning"
      className={[
        "flex items-start gap-2 text-sm leading-relaxed text-slate-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <WarningBadgeIcon
        size={16}
        title={undefined}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-sky-950"
      />
      <p>
        <span className="font-extrabold text-sky-950">Strobe warning:</span>{" "}
        {FULL_FRAME_FLASH_WARNING}
      </p>
    </div>
  );
}

function MorseVideoPreviewPanel({
  isPlaying,
  preview,
  resolvedBackgroundStyle,
  settings,
  visualStep,
}: {
  isPlaying: boolean;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: "warm-morsewords" | "dark-morsewords";
  settings: MorseVideoSettings;
  visualStep: number;
}) {
  const darkFrame = resolvedBackgroundStyle === "dark-morsewords";
  const frameStyle = darkFrame
    ? { backgroundColor: "#020617", color: "#e0f2fe" }
    : { backgroundColor: "#fffdf8", color: "#08324f" };

  return (
    <section
      data-testid="morse-video-preview"
      data-preview-playing={isPlaying ? "true" : "false"}
      aria-labelledby="morse-video-preview-heading"
      className="space-y-3"
    >
      <div
        className="flex aspect-video min-h-[12rem] w-full flex-col justify-between rounded-xl p-4 sm:p-5"
        style={frameStyle}
      >
        <div className="flex items-center justify-between gap-3">
          <h3
            id="morse-video-preview-heading"
            className="text-sm font-extrabold"
          >
            Video preview
          </h3>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">
            {settings.visualStyle === "full-frame"
              ? "Subdued preview"
              : "Short clip"}
          </span>
        </div>
        <div className="flex min-h-[5rem] items-center justify-center">
          <MorseVideoPreviewVisual
            isPlaying={isPlaying}
            preview={preview}
            settings={settings}
            visualStep={visualStep}
          />
        </div>
        {settings.showMorseOverlay ? (
          <p
            data-testid="morse-video-preview-morse-overlay"
            className="mt-3 break-words font-mono text-xs font-bold"
          >
            {preview.sampleMorse}
          </p>
        ) : null}
        {settings.showBranding ? (
          <p
            data-testid="morse-video-preview-branding"
            className="mt-3 text-right font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-80"
          >
            {preview.brandLabel}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function MorseVideoPreviewVisual({
  isPlaying,
  preview,
  settings,
  visualStep,
}: {
  isPlaying: boolean;
  preview: MorseVideoPreview;
  settings: MorseVideoSettings;
  visualStep: number;
}) {
  const markActive =
    settings.visualStyle !== "full-frame" && isPlaying && visualStep % 2 === 1;
  const intensityClass =
    settings.intensity === "high"
      ? "opacity-100"
      : settings.intensity === "low"
        ? "opacity-60"
        : "opacity-80";

  if (settings.visualStyle === "dot") {
    return (
      <span
        data-testid="morse-video-preview-dot"
        aria-label="Dot preview"
        role="img"
        className={[
          "block h-12 w-12 rounded-full bg-sky-200",
          intensityClass,
          markActive ? "ring-4 ring-sky-200/50" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  if (settings.visualStyle === "full-frame") {
    return (
      <div
        data-testid="morse-video-preview-full-frame"
        aria-label="Subdued full-frame flash preview"
        role="img"
        className={["h-16 w-16 rounded-full bg-sky-200/80", intensityClass]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  if (settings.visualStyle === "morse-text") {
    return (
      <div
        data-testid="morse-video-preview-morse-text"
        className={[
          "max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-lg font-bold tracking-normal",
          markActive ? "text-sky-200" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {preview.sampleMorse}
      </div>
    );
  }

  return (
    <div
      data-testid="morse-video-preview-lightbulb"
      aria-label="Lightbulb preview"
      role="img"
      className={[
        "text-sky-200",
        intensityClass,
        markActive ? "text-sky-100" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <LightBulbIcon size={54} title={undefined} aria-hidden="true" />
    </div>
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
        className="mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      />
    </div>
  );
}

function LabeledSelect({
  children,
  disabled = false,
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
        className={`mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
      >
        {children}
      </select>
    </div>
  );
}

function getDownloadDisabledReason({
  canRender,
  hasSourceCode,
  support,
  supportReady,
  tooLong,
}: {
  canRender: boolean;
  hasSourceCode: boolean;
  support: MorseVideoSupport | null;
  supportReady: boolean;
  tooLong: boolean;
}) {
  if (!hasSourceCode) return "Add text or typed Morse before downloading.";
  if (!canRender) return "Enter text or valid dots and dashes before export.";
  if (tooLong) {
    return "This short-form video generator is capped at about 3 minutes.";
  }
  if (!supportReady) return "Checking browser video export support.";
  if (!support?.supported) return support?.reason ?? "Video export unavailable.";
  return "";
}

function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
}

function sanitizeFileBase(name: string) {
  return (
    name
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "morse-code-video"
  );
}

function isAbortError(error: unknown) {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && /cancelled|aborted/i.test(error.message);
}

function unique(values: string[]) {
  return [...new Set(values)];
}
