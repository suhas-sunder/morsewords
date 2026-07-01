import * as React from "react";

import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
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
import useMorseAudio from "~/client/components/shared/useMorseAudio";
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
  MorseVideoPreviewPanel,
  MorseVideoPreviewTimeline,
} from "~/client/components/shared/video/MorseVideoPreviewControls";
import {
  createMorseVideoBlob,
} from "~/client/components/shared/video/morseVideoExport";
import type { MorseVideoAudioSettings } from "~/client/components/shared/video/morseVideoRenderer";
import {
  detectMorseVideoSupport,
  getMorseVideoFormatSupport,
  getPreferredMorseVideoFormat,
  MORSE_VIDEO_FORMATS,
  type MorseVideoFormat,
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
const MIN_PREVIEW_RESTART_REMAINING_MS = 750;
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
  const previewAnimationRef = React.useRef<number | null>(null);
  const previewStartedAtRef = React.useRef(0);
  const previewStartElapsedRef = React.useRef(0);
  const previewPlaybackSessionRef = React.useRef(0);

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
  const [previewElapsedMs, setPreviewElapsedMs] = React.useState(0);
  const [selectedVideoFormat, setSelectedVideoFormat] =
    React.useState<MorseVideoFormat>("webm");
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
  const previewAudioPlayer = useMorseAudio();
  const previewAudioPlayerRef = React.useRef(previewAudioPlayer);

  React.useEffect(() => {
    previewAudioPlayerRef.current = previewAudioPlayer;
  }, [previewAudioPlayer]);

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
    if (!videoSupport?.supported) return;
    setSelectedVideoFormat((current) => {
      const currentSupport = getMorseVideoFormatSupport(videoSupport, current);
      if (!currentSupport.supported) {
        return getPreferredMorseVideoFormat(videoSupport);
      }
      return current === "webm" ? getPreferredMorseVideoFormat(videoSupport) : current;
    });
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
    () => buildMorseVideoPreview(effectiveVideoSettings, activeText, audioSettings),
    [activeText, audioSettings, effectiveVideoSettings],
  );
  const previewDurationMs = Math.max(1, preview.durationMs);
  const resolvedBackgroundStyle =
    effectiveVideoSettings.backgroundStyle === "dark-morsewords"
      ? "dark-morsewords"
      : "warm-morsewords";
  const selectedFormatSupport = getMorseVideoFormatSupport(
    videoSupport,
    selectedVideoFormat,
  );
  const baseDownloadDisabledReason = getDownloadDisabledReason({
    canRender,
    hasSourceCode,
    support: videoSupport,
    supportReady,
    tooLong,
  });
  const downloadDisabledReason =
    baseDownloadDisabledReason ||
    (!selectedFormatSupport.supported ? selectedFormatSupport.reason : "");
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

  const clearPreviewAnimation = React.useCallback(() => {
    if (previewAnimationRef.current !== null) {
      window.cancelAnimationFrame(previewAnimationRef.current);
      previewAnimationRef.current = null;
    }
  }, []);

  const startPreviewClock = React.useCallback(
    (startElapsedMs: number, startedAtMs = performance.now()) => {
      clearPreviewAnimation();
      const safeStartElapsed = Math.max(
        0,
        Math.min(previewDurationMs, startElapsedMs),
      );
      previewStartedAtRef.current = startedAtMs;
      previewStartElapsedRef.current = safeStartElapsed;
      setPreviewElapsedMs(safeStartElapsed);

      const tick = () => {
        const nextElapsed = Math.min(
          previewDurationMs,
          previewStartElapsedRef.current +
            Math.max(0, performance.now() - previewStartedAtRef.current),
        );
        setPreviewElapsedMs(nextElapsed);
        if (nextElapsed >= previewDurationMs) {
          setPreviewPlaying(false);
          previewAnimationRef.current = null;
          return;
        }
        previewAnimationRef.current = window.requestAnimationFrame(tick);
      };

      previewAnimationRef.current = window.requestAnimationFrame(tick);
    },
    [clearPreviewAnimation, previewDurationMs],
  );

  const stopPreviewPlayback = React.useCallback(
    (reset = false) => {
      previewPlaybackSessionRef.current += 1;
      clearPreviewAnimation();
      previewAudioPlayerRef.current.stop();
      setPreviewPlaying(false);
      if (reset) {
        previewStartElapsedRef.current = 0;
        setPreviewElapsedMs(0);
      }
    },
    [clearPreviewAnimation],
  );

  const startPreviewPlayback = React.useCallback(
    (elapsedMs = previewElapsedMs) => {
      const currentElapsed = Math.max(
        0,
        Math.min(previewDurationMs, elapsedMs),
      );
      const startElapsed =
        previewDurationMs - currentElapsed <=
        MIN_PREVIEW_RESTART_REMAINING_MS
          ? 0
          : currentElapsed;
      const session = previewPlaybackSessionRef.current + 1;
      previewPlaybackSessionRef.current = session;

      clearPreviewAnimation();
      previewAudioPlayerRef.current.stop();
      setPreviewPlaying(true);
      setPreviewElapsedMs(startElapsed);

      const playWithAudio =
        effectiveVideoSettings.includeAudioTrack &&
        previewAudioPlayerRef.current.isSupported &&
        preview.sampleMorse.trim().length > 0;

      if (!playWithAudio) {
        startPreviewClock(startElapsed);
        return;
      }

      startPreviewClock(startElapsed);
      void previewAudioPlayerRef.current
        .play({
          code: preview.sampleMorse,
          wpm: charWpm,
          farnsworthWpm,
          hz: pitch,
          volume,
          preset: tonePreset,
          repeat: false,
          flash: false,
          soundEnabled: true,
          startElapsedMs: startElapsed,
          onPlaybackStart: (startedAtMs) => {
            if (previewPlaybackSessionRef.current !== session) return;
            startPreviewClock(startElapsed, startedAtMs);
          },
        })
        .then(() => {
          if (previewPlaybackSessionRef.current !== session) return;
          clearPreviewAnimation();
          setPreviewElapsedMs(previewDurationMs);
          setPreviewPlaying(false);
        })
        .catch(() => {
          if (previewPlaybackSessionRef.current !== session) return;
          clearPreviewAnimation();
          setPreviewPlaying(false);
          setDownloadStatus({
            kind: "error",
            message: "Video preview audio failed. Try playing the preview again.",
          });
        });
    },
    [
      charWpm,
      clearPreviewAnimation,
      effectiveVideoSettings.includeAudioTrack,
      farnsworthWpm,
      pitch,
      preview.sampleMorse,
      previewDurationMs,
      previewElapsedMs,
      startPreviewClock,
      tonePreset,
      volume,
    ],
  );

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
    stopPreviewPlayback(true);
  }, [settingsSignature, stopPreviewPlayback]);

  React.useEffect(() => () => stopPreviewPlayback(true), [stopPreviewPlayback]);

  const updateVideoSettings = React.useCallback(
    (patch: Partial<MorseVideoSettings>) => {
      const normalizedPatch =
        patch.textDisplayMode !== undefined
          ? {
              ...patch,
              showMorseSymbols:
                patch.textDisplayMode === "morse" ||
                patch.textDisplayMode === "both",
              showPlainText:
                patch.textDisplayMode === "text" ||
                patch.textDisplayMode === "both",
              showMorseOverlay:
                patch.textDisplayMode === "morse" ||
                patch.textDisplayMode === "both",
            }
          : patch.showMorseOverlay !== undefined
            ? {
                ...patch,
                showMorseSymbols: patch.showMorseOverlay,
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
    stopPreviewPlayback(true);
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

  const handlePreviewToggle = () => {
    if (previewPlaying) {
      stopPreviewPlayback();
      return;
    }
    startPreviewPlayback(previewElapsedMs);
  };

  const handlePreviewScrub = (elapsedMs: number) => {
    const nextElapsed = Math.max(0, Math.min(previewDurationMs, elapsedMs));
    setPreviewElapsedMs(nextElapsed);
    previewStartedAtRef.current = performance.now();
    previewStartElapsedRef.current = nextElapsed;
  };

  const handlePreviewSeek = (elapsedMs: number) => {
    const nextElapsed = Math.max(0, Math.min(previewDurationMs, elapsedMs));
    setPreviewElapsedMs(nextElapsed);
    previewStartedAtRef.current = performance.now();
    previewStartElapsedRef.current = nextElapsed;
    if (previewPlaying) startPreviewPlayback(nextElapsed);
  };

  const handleDownloadVideo = async () => {
    if (!canDownload || !selectedFormatSupport.supported) return;
    const formatLabel = selectedFormatSupport.label;
    const version = downloadVersionRef.current + 1;
    downloadVersionRef.current = version;
    const controller = new AbortController();
    downloadAbortRef.current = controller;
    setDownloadProgress({ elapsedMs: 0, durationMs });
    setDownloadStatus({
      kind: "working",
      message: `Starting ${formatLabel} video download...`,
    });

    try {
      const result = await createMorseVideoBlob({
        audioSettings,
        morse: activeMorse,
        text: activeText,
        resolvedBackgroundStyle,
        settings: effectiveVideoSettings,
        signal: controller.signal,
        support: selectedFormatSupport,
        onProgress: (elapsedMs, nextDurationMs) => {
          if (downloadVersionRef.current !== version) return;
          setDownloadProgress({ elapsedMs, durationMs: nextDurationMs });
          setDownloadStatus({
            kind: "working",
            message: `Recording ${formatLabel} video (${formatDuration(elapsedMs)} of ${formatDuration(
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
        `${sanitizeFileBase(fileName || "morse-code-video")}.${selectedFormatSupport.extension}`,
        `morse-code-video.${selectedFormatSupport.extension}`,
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
        message: `${formatLabel} download started.`,
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
            `${formatLabel} export failed. Try 720p, a shorter message, or silent video.`,
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
              <span aria-hidden="true">
                Format: {selectedFormatSupport.label}
              </span>
              <span aria-hidden="true">
                Quality:{" "}
                {MORSE_VIDEO_RESOLUTION_LABELS[effectiveVideoSettings.resolution]}
              </span>
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

      <div className="mt-6 space-y-4">
        <MorseVideoPreviewPanel
          headingId="morse-video-preview-heading"
          isPlaying={previewPlaying}
          preview={preview}
          resolvedBackgroundStyle={resolvedBackgroundStyle}
          settings={effectiveVideoSettings}
          testIdPrefix="morse-video-preview"
          visualElapsedMs={previewElapsedMs}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <VideoFormatSelect
              selectedFormat={selectedVideoFormat}
              support={videoSupport}
              onChange={setSelectedVideoFormat}
            />
            <ToolButton
              type="button"
              tone={previewPlaying ? "light" : "dark"}
              active={!previewPlaying && canRender}
              onClick={handlePreviewToggle}
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
              onClick={handleDownloadVideo}
              disabled={!canDownload}
              aria-describedby={
                downloadDisabledReason ? "video-download-disabled-reason" : undefined
              }
              className="rounded-xl"
            >
              <DownloadIcon size={20} title={undefined} aria-hidden="true" />
              Download {selectedFormatSupport.label}
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

          <MorseVideoPreviewTimeline
            disabled={!canRender}
            elapsedMs={previewElapsedMs}
            onSeek={handlePreviewScrub}
            onSeekCommit={handlePreviewSeek}
            preview={preview}
            testIdPrefix="morse-video-preview"
          />

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
              {selectedFormatSupport.label} export starts only when you click
              download. Export quality:{" "}
              <span className="font-semibold text-sky-950">
                {MORSE_VIDEO_RESOLUTION_LABELS[effectiveVideoSettings.resolution]}
              </span>
              .
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
              Export quality / resolution
            </legend>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Export quality / resolution"
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

function VideoFormatSelect({
  onChange,
  selectedFormat,
  support,
}: {
  onChange: (format: MorseVideoFormat) => void;
  selectedFormat: MorseVideoFormat;
  support: MorseVideoSupport | null;
}) {
  return (
    <label className="min-w-[12rem] text-sm font-semibold text-slate-700">
      Video format
      <select
        value={selectedFormat}
        onChange={(event) => onChange(event.target.value as MorseVideoFormat)}
        className="mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        aria-label="Video format"
      >
        {MORSE_VIDEO_FORMATS.map((format) => {
          const formatSupport = getMorseVideoFormatSupport(support, format);
          return (
            <option
              key={format}
              value={format}
              disabled={!formatSupport.supported}
            >
              {formatSupport.supported
                ? formatSupport.label
                : formatSupport.reason}
            </option>
          );
        })}
      </select>
    </label>
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
