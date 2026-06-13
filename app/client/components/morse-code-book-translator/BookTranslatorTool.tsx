import * as React from "react";

import {
  ChecklistIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
  PlayIcon,
  RefreshIcon,
  SparklesIcon,
  StopIcon,
  TrashIcon,
  UploadIcon,
  WarningBadgeIcon,
} from "~/client/assets/svg/Icons";
import {
  copyTextToClipboard,
  downloadBlobFile,
} from "~/client/components/shared/actionOutputUtils";
import {
  AUDIO_SPEED_RANGE,
  sanitizeAudioSampleRate,
  sanitizeMp3Bitrate,
} from "~/client/components/shared/morseSettings";
import AudioSettingsPanel from "~/client/components/shared/AudioSettingsPanel";
import {
  getAudioPresetDefaults,
  getAudioPresetLabel,
  type AudioTonePresetId,
} from "~/client/components/shared/audioPresetRegistry";
import { clampNumber } from "~/client/components/shared/settingsStorage";
import {
  ToolButton,
  ToolOutputPanel,
  ToolPanel,
  ToolTextarea,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import SliderRow from "~/client/components/shared/ui/SliderRow";
import StatusMessage from "~/client/components/shared/ui/StatusMessage";
import {
  getAppliedThemeMode,
  type ThemeMode,
} from "~/client/theme/themeStorage";

import {
  createBookDownloadPackage,
  getBookDownloadKind,
} from "./bookBundleExport";
import {
  buildExportAnalysis,
  formatBytes,
  formatDuration,
} from "./bookDurationEstimate";
import {
  bookExportProgressDetail as exportProgressDetail,
  bookExportProgressPercent as exportProgressPercent,
} from "./bookExportProgressCopy";
import {
  BOOK_LONG_EXPORT_KEEP_OPEN_MESSAGE,
  BOOK_LONG_EXPORT_MESSAGE,
  BOOK_OVERSIZED_EXPORT_MESSAGE,
  findOversizedAudioExportPart,
  friendlyBookExportErrorMessage,
  oversizedExportDetailsLabel,
} from "./bookExportSafety";
import {
  MorseAudioTimingStrip,
  MorseLivePreviewFullscreenControl,
  MorseVideoPreviewPanel,
  MorseVideoPreviewTimeline,
} from "~/client/components/shared/video/MorseVideoPreviewControls";
import { getLivePreviewStartDelayMs } from "~/client/components/shared/video/livePreviewPlayback";
import useMorseAudio, {
  type MorsePlayerState,
} from "~/client/components/shared/useMorseAudio";
import {
  applyBookPreset,
  BOOK_EXPORT_PRESET_DETAILS,
  BOOK_EXPORT_PRESET_NAMES,
  DEFAULT_BOOK_EXPORT_SETTINGS,
  describeBookExportSettings,
  sanitizeBookExportSettings,
  settingsMatchBookPreset,
} from "./bookExportPresets";
import {
  buildBookExportPlan,
  type BookExportPlan,
} from "./bookExportPlan";
import {
  loadBookExportPreferences,
  saveBookExportPreferences,
} from "./bookExportPreferences";
import type {
  BookExportPart,
  BookExportAnalysis,
  BookExportPresetName,
  BookExportProgress,
  BookExportResultSummary,
  BookExportSettings,
  BookOutputType,
} from "./bookExportTypes";
import {
  DEFAULT_CLEANUP_OPTIONS,
  type BookSourceSection,
  type CleanupOptions,
  type CustomCleanupRule,
  type ParsedBookSource,
  type PreflightSummary,
  sourceTypeLabel,
  BookSourceError,
  detectFileSourceType,
} from "./bookSourceTypes";
import { parseEpubSource } from "./sourceParsers/epubSourceParser";
import { parsePdfSource } from "./sourceParsers/pdfSourceParser";
import {
  parsePastedSource,
  parseTextFileSource,
} from "./sourceParsers/textSourceParser";
import {
  buildCleanedSourceSections,
  buildPreflightSummary,
} from "./textNormalization";
import type { BookVideoPreview } from "./bookVideoPreview";
import {
  buildLiveMorseVideoPreview,
  buildLivePreviewSegments,
} from "./bookLivePreview";
import {
  buildLivePreviewProgressState,
  hashLivePreviewProgressSignature,
  readLivePreviewProgress,
  writeLivePreviewProgress,
} from "./bookLivePreviewProgress";
import {
  buildBookAudioPreview,
  type BookAudioPreview,
} from "./bookPreviewAudio";
import {
  BOOK_VIDEO_INTENSITY_LABELS,
  BOOK_VIDEO_VISUAL_STYLE_DETAILS,
} from "./bookVideoPresets";
import {
  detectBookVideoSupport,
  type BookVideoSupport,
} from "./bookVideoSupport";
import {
  BOOK_LIVE_PLAYER_VISUAL_STYLES,
  BOOK_VIDEO_INTENSITIES,
  DEFAULT_BOOK_VIDEO_SETTINGS,
  sanitizeBookLivePlayerSettings,
  type BookVideoSettings,
} from "./bookVideoTypes";
import type { BookSplitMode } from "./bookExportTypes";

type ParseStatus = "idle" | "parsing" | "ready" | "error";
type ExportStatusKind = "info" | "success" | "error" | "working";
type SourceEntryMode = "pasted" | "uploaded-textarea" | "uploaded-preview";
type SourceEditMode = "idle" | "draft";

// Plain TXT/MD uploads under this cap stay directly editable without putting
// full book-length documents into a large textarea by default.
const INLINE_UPLOAD_TEXTAREA_LIMIT = 40_000;
// Large extracted sources stay in draft edit mode so typing does not recompute
// cleanup, Morse preview, runtime estimates, and splitting on every keystroke.
const LARGE_SOURCE_EDIT_THRESHOLD = 40_000;
const EXTRACTED_SOURCE_PREVIEW_LIMIT = 6_000;
const DEFAULT_SOURCE_TEXT = "SOS Help!";
const MIN_PREVIEW_RESTART_REMAINING_MS = 750;
const BOOK_TRANSLATOR_LIVE_PREVIEW_PROGRESS_KEY =
  "morsewords:book-translator:live-preview-progress:v1";
const IDLE_EXPORT_PROGRESS: BookExportProgress = {
  phase: "idle",
  message: "",
  currentPart: 0,
  totalParts: 0,
};

const BOOK_SPLIT_MODE_LABELS: Record<BookSplitMode, string> = {
  none: "No split",
  duration: "By duration",
};

type BookPreviewStatus =
  | "waiting"
  | "updating"
  | "ready"
  | "playing"
  | "stopped"
  | "unavailable"
  | "failed";

type CacheEntry<T> = {
  key: string;
  value: T;
};

type BookDerivedCache = {
  preflight?: CacheEntry<PreflightSummary>;
  sourceSections?: CacheEntry<BookSourceSection[]>;
  exportPlan?: CacheEntry<BookExportPlan>;
  exportAnalysis?: CacheEntry<BookExportAnalysis>;
};

function useAppliedThemeMode() {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>("light");

  React.useEffect(() => {
    setThemeMode(getAppliedThemeMode());

    if (typeof document === "undefined") return undefined;
    const observer = new MutationObserver(() => {
      setThemeMode(getAppliedThemeMode());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return themeMode;
}

function resolveBookVideoBackgroundStyle(themeMode: ThemeMode) {
  return themeMode === "dark" ? "dark-morsewords" : "warm-morsewords";
}

function formatNumber(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "0";
}

function createEmptyParsedSource(warnings: string[] = []): ParsedBookSource {
  return {
    sourceType: "pasted",
    rawText: "",
    warnings,
  };
}

function countSourceWords(text: string) {
  const matches = text.trim().match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu);
  return matches?.length ?? 0;
}

function capExtractedPreview(text: string) {
  if (text.length <= EXTRACTED_SOURCE_PREVIEW_LIMIT) return text;
  return text.slice(0, EXTRACTED_SOURCE_PREVIEW_LIMIT).trimEnd();
}

function shouldUseEditableUpload(parsed: ParsedBookSource) {
  return (
    (parsed.sourceType === "txt" || parsed.sourceType === "md") &&
    parsed.rawText.length <= INLINE_UPLOAD_TEXTAREA_LIMIT
  );
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${value.length}:${(hash >>> 0).toString(36)}`;
}

function parsedSourceSignature(parsed: ParsedBookSource) {
  const sections =
    parsed.sections?.map((section) => ({
      title: section.title ?? "",
      sourceLabel: section.sourceLabel ?? "",
      startOffset: section.startOffset ?? 0,
      endOffset: section.endOffset ?? 0,
      rawText: hashString(section.rawText),
    })) ?? [];

  return JSON.stringify({
    sourceType: parsed.sourceType,
    filename: parsed.filename ?? "",
    title: parsed.title ?? "",
    author: parsed.author ?? "",
    pageCount: parsed.pageCount ?? 0,
    sectionCount: parsed.sectionCount ?? 0,
    rawText: hashString(parsed.rawText),
    sections,
    warnings: parsed.warnings,
  });
}

function cleanupSignature(
  options: CleanupOptions,
  customRules: CustomCleanupRule[],
) {
  return JSON.stringify({ options, customRules });
}

function sourceSectionsSignature(sections: BookSourceSection[]) {
  return JSON.stringify(
    sections.map((section) => ({
      title: section.title ?? "",
      sourceLabel: section.sourceLabel ?? "",
      startOffset: section.startOffset ?? 0,
      endOffset: section.endOffset ?? 0,
      rawText: hashString(section.rawText),
    })),
  );
}

function settingsSignature(value: unknown) {
  return JSON.stringify(value);
}

function livePreviewSegmentDurationMs(segment: BookExportPart | null | undefined) {
  return Math.max(1_200, segment?.morseDurationMs ?? 0);
}

function cleanupLabel(key: keyof CleanupOptions) {
  switch (key) {
    case "normalizeSmartPunctuation":
      return "Normalize smart quotes, dashes, and ellipsis";
    case "stripZeroWidthAndSoftHyphen":
      return "Strip zero-width characters and soft hyphens";
    case "stripGutenbergHeaderFooter":
      return "Strip Project Gutenberg header/footer";
    case "simplifyPunctuation":
      return "Simplify punctuation for practice";
  }
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-base font-extrabold text-sky-950">
        {value}
      </dd>
    </div>
  );
}

function MessageList({
  title,
  items,
  tone = "info",
}: {
  title: string;
  items: string[];
  tone?: "info" | "warning" | "error";
}) {
  if (items.length === 0) return null;

  const toneClass =
    tone === "error"
      ? "text-sky-950"
      : tone === "warning"
        ? "text-sky-950"
        : "text-slate-700";

  return (
    <section
      className="flex items-start gap-2 text-sm leading-relaxed"
      role={tone === "error" ? "alert" : undefined}
    >
      <WarningBadgeIcon
        size={16}
        title={undefined}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-sky-950"
      />
      <div>
        <h3 className="text-sm font-extrabold text-sky-950">{title}</h3>
        <ul className={`mt-1 space-y-1 ${toneClass}`}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function EmptyPreview({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-slate-600">{children}</p>;
}

function SourceUploadDropzone({
  dragActive,
  fileInputRef,
  filename,
  hasSource,
  onDrop,
  onFileInputChange,
  onUploadKeyDown,
  setDragActive,
  uploadHelpText,
  uploadRightsText,
  uploadTitle,
}: {
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  filename?: string;
  hasSource: boolean;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFileInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  setDragActive: (value: boolean) => void;
  uploadHelpText: string;
  uploadRightsText: string;
  uploadTitle: string;
}) {
  return (
    <div>
      <input
        ref={fileInputRef}
        id="book-source-file"
        type="file"
        accept=".txt,.md,.markdown,.epub,.pdf,text/plain,text/markdown,application/epub+zip,application/pdf"
        onChange={onFileInputChange}
        className="sr-only"
        aria-describedby="book-source-file-help"
      />
      <div
        data-testid="book-source-upload-dropzone"
        role="button"
        tabIndex={0}
        aria-label={
          hasSource ? "Replace book source file" : "Upload a book source file"
        }
        aria-describedby="book-source-file-help"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={onUploadKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={[
          "flex cursor-pointer flex-col gap-3 rounded-xl border border-dashed border-slate-300/80 bg-white/88 p-4 transition-[background-color,border-color,color] duration-100 ease-out hover:bg-[#fffaf2] sm:flex-row sm:items-center sm:justify-between",
          dragActive ? "border-sky-500 bg-[#fffaf2] text-sky-950" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex min-w-0 items-start gap-3">
          <UploadIcon
            size={24}
            title={undefined}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-sky-950"
          />
          <div className="min-w-0">
            <span className="block text-base font-extrabold text-sky-950">
              {uploadTitle}
            </span>
            <span
              id="book-source-file-help"
              className="mt-1 block max-w-[68ch] text-sm leading-relaxed text-slate-600"
            >
              {uploadHelpText}
            </span>
            {filename ? (
              <span className="mt-2 block break-words text-sm font-semibold text-slate-700">
                Current file: {filename}
              </span>
            ) : null}
          </div>
        </div>
        <p className="max-w-[42ch] text-xs leading-relaxed text-slate-500 sm:text-right">
          {uploadRightsText}
        </p>
      </div>
    </div>
  );
}

async function parseFileSource(file: File) {
  const sourceType = detectFileSourceType(file);
  if (sourceType === "txt" || sourceType === "md")
    return parseTextFileSource(file);
  if (sourceType === "epub") return parseEpubSource(file);
  return parsePdfSource(file);
}

function isExportRunning(progress: BookExportProgress) {
  return ["analyzing", "splitting", "encoding", "bundling"].includes(
    progress.phase,
  );
}

function estimatedRenderTimeLabel(
  totalRuntimeMs: number,
  format: BookExportSettings["outputFormat"],
) {
  if (!Number.isFinite(totalRuntimeMs) || totalRuntimeMs <= 0) return "~0s";
  const formatFactor = format === "wav" ? [0.08, 0.18] : [0.12, 0.32];
  const minMs = Math.max(1_000, totalRuntimeMs * formatFactor[0]);
  const maxMs = Math.max(minMs, totalRuntimeMs * formatFactor[1]);
  return `~${formatDuration(minMs)}-${formatDuration(maxMs)}`;
}

export default function BookTranslatorTool() {
  const [sourceText, setSourceText] = React.useState(DEFAULT_SOURCE_TEXT);
  const [parsedSource, setParsedSource] = React.useState<ParsedBookSource>(() =>
    parsePastedSource(DEFAULT_SOURCE_TEXT),
  );
  const [sourceEntryMode, setSourceEntryMode] =
    React.useState<SourceEntryMode>("pasted");
  const [cleanupOptions, setCleanupOptions] = React.useState<CleanupOptions>(
    DEFAULT_CLEANUP_OPTIONS,
  );
  const [customCleanupRules, setCustomCleanupRules] = React.useState<
    CustomCleanupRule[]
  >([]);
  const [sourceEditMode, setSourceEditMode] =
    React.useState<SourceEditMode>("idle");
  const [sourceEditDraft, setSourceEditDraft] = React.useState("");
  const [outputType, setOutputType] = React.useState<BookOutputType>("audio");
  const [exportSettings, setExportSettings] =
    React.useState<BookExportSettings>(DEFAULT_BOOK_EXPORT_SETTINGS);
  const [videoSettings, setVideoSettings] = React.useState<BookVideoSettings>(
    () => sanitizeBookLivePlayerSettings(DEFAULT_BOOK_VIDEO_SETTINGS),
  );
  const [videoSupport, setVideoSupport] =
    React.useState<BookVideoSupport | null>(null);
  const [previewStatus, setPreviewStatus] =
    React.useState<BookPreviewStatus>("waiting");
  const [previewErrorMessage, setPreviewErrorMessage] = React.useState("");
  const [visualPreviewPlaying, setVisualPreviewPlaying] = React.useState(false);
  const [visualPreviewElapsedMs, setVisualPreviewElapsedMs] = React.useState(0);
  const [activePreviewSegmentIndex, setActivePreviewSegmentIndex] =
    React.useState(0);
  const [audioPreviewElapsedMs, setAudioPreviewElapsedMs] = React.useState(0);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [status, setStatus] = React.useState<ParseStatus>("ready");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [pendingFilename, setPendingFilename] = React.useState("");
  const [sourceActionStatus, setSourceActionStatus] = React.useState<{
    kind: ExportStatusKind;
    message: string;
  } | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [exportProgress, setExportProgress] =
    React.useState<BookExportProgress>(IDLE_EXPORT_PROGRESS);
  const [exportStartedAtMs, setExportStartedAtMs] = React.useState<number | null>(
    null,
  );
  const [exportElapsedMs, setExportElapsedMs] = React.useState(0);
  const [selectedBatchNumber, setSelectedBatchNumber] = React.useState(1);
  const [exportStatus, setExportStatus] = React.useState<{
    kind: ExportStatusKind;
    message: string;
  } | null>(null);
  const [completedExport, setCompletedExport] =
    React.useState<BookExportResultSummary | null>(null);
  const [preferencesLoaded, setPreferencesLoaded] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const parseVersionRef = React.useRef(0);
  const fileSelectionRef = React.useRef<{
    selectedAt: number;
    lastModified: number;
  } | null>(null);
  const exportVersionRef = React.useRef(0);
  const exportAbortRef = React.useRef<AbortController | null>(null);
  const exportProgressRef =
    React.useRef<BookExportProgress>(IDLE_EXPORT_PROGRESS);
  const visualPreviewIntervalRef = React.useRef<number | null>(null);
  const visualPreviewTimeoutRef = React.useRef<number | null>(null);
  const visualPreviewStartedAtRef = React.useRef(0);
  const visualPreviewBaseElapsedRef = React.useRef(0);
  const visualPreviewSessionRef = React.useRef(0);
  const audioPreviewIntervalRef = React.useRef<number | null>(null);
  const audioPreviewTimeoutRef = React.useRef<number | null>(null);
  const audioPreviewStartedAtRef = React.useRef(0);
  const audioPreviewBaseElapsedRef = React.useRef(0);
  const audioPreviewSessionRef = React.useRef(0);
  const mountedRef = React.useRef(true);
  const customCleanupRuleIdRef = React.useRef(1);
  const restoredLivePreviewProgressHashRef = React.useRef<string | null>(null);
  const skipNextLivePreviewProgressSaveRef = React.useRef(false);
  const previewAudioPlayer = useMorseAudio();
  const stopPreviewAudioRef = React.useRef(previewAudioPlayer.stop);
  const derivedCacheRef = React.useRef<BookDerivedCache>({});

  React.useEffect(() => {
    exportProgressRef.current = exportProgress;
  }, [exportProgress]);

  const hasActiveExport = React.useCallback(
    () =>
      exportAbortRef.current !== null ||
      isExportRunning(exportProgressRef.current),
    [],
  );

  const cancelActiveExport = React.useCallback(
    (message = "Download cancelled.") => {
      exportVersionRef.current += 1;
      exportAbortRef.current?.abort();
      exportAbortRef.current = null;
      const nextProgress: BookExportProgress = {
        phase: "cancelled",
        message,
        currentPart: 0,
        totalParts: 0,
      };
      exportProgressRef.current = nextProgress;
      setExportProgress(nextProgress);
      setExportStartedAtMs(null);
      setExportElapsedMs(0);
      setExportStatus({ kind: "info", message });
    },
    [],
  );

  React.useEffect(() => {
    stopPreviewAudioRef.current = previewAudioPlayer.stop;
  });

  const clearAudioPreviewTimers = React.useCallback(() => {
    if (audioPreviewIntervalRef.current !== null) {
      window.clearInterval(audioPreviewIntervalRef.current);
      audioPreviewIntervalRef.current = null;
    }
    if (audioPreviewTimeoutRef.current !== null) {
      window.clearTimeout(audioPreviewTimeoutRef.current);
      audioPreviewTimeoutRef.current = null;
    }
  }, []);

  const stopAudioPreviewTimer = React.useCallback(
    (resetElapsed = true) => {
      audioPreviewSessionRef.current += 1;
      clearAudioPreviewTimers();
      if (resetElapsed) {
        audioPreviewBaseElapsedRef.current = 0;
        setAudioPreviewElapsedMs(0);
      }
    },
    [clearAudioPreviewTimers],
  );

  const clearVisualPreviewTimers = React.useCallback(() => {
    if (visualPreviewIntervalRef.current !== null) {
      window.clearInterval(visualPreviewIntervalRef.current);
      visualPreviewIntervalRef.current = null;
    }
    if (visualPreviewTimeoutRef.current !== null) {
      window.clearTimeout(visualPreviewTimeoutRef.current);
      visualPreviewTimeoutRef.current = null;
    }
  }, []);

  const stopVisualPreview = React.useCallback(
    (resetElapsed = true) => {
      visualPreviewSessionRef.current += 1;
      clearVisualPreviewTimers();
      setVisualPreviewPlaying(false);
      if (resetElapsed) setVisualPreviewElapsedMs(0);
    },
    [clearVisualPreviewTimers],
  );

  const stopActivePreview = React.useCallback(() => {
    stopPreviewAudioRef.current?.();
    stopAudioPreviewTimer();
    stopVisualPreview(false);
    setPreviewStatus((current) =>
      current === "playing" ? "stopped" : current,
    );
  }, [stopAudioPreviewTimer, stopVisualPreview]);

  React.useEffect(() => {
    const preferences = loadBookExportPreferences();
    setOutputType(preferences.outputType);
    setExportSettings(preferences.exportSettings);
    setVideoSettings(sanitizeBookLivePlayerSettings(preferences.videoSettings));
    setExportProgress(
      IDLE_EXPORT_PROGRESS,
    );
    setAdvancedOpen(preferences.advancedOpen);
    setPreferencesLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!preferencesLoaded) return;
    saveBookExportPreferences({
      outputType: "audio",
      exportSettings,
      videoSettings,
      advancedOpen,
    });
  }, [
    advancedOpen,
    exportSettings,
    outputType,
    preferencesLoaded,
    videoSettings,
  ]);

  React.useEffect(() => {
    setVideoSupport(detectBookVideoSupport());
  }, []);

  React.useEffect(() => {
    if (!videoSupport || videoSupport.audioTrackSupported) return;
    setVideoSettings((current) =>
      current.includeAudioTrack
        ? sanitizeBookLivePlayerSettings({ ...current, includeAudioTrack: false })
        : current,
    );
  }, [videoSupport]);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
      parseVersionRef.current += 1;
      exportVersionRef.current += 1;
      derivedCacheRef.current = {};
      exportAbortRef.current?.abort();
      stopPreviewAudioRef.current?.();
      stopVisualPreview();
    };
  }, [stopVisualPreview]);

  const effectiveCleanupOptions = React.useMemo<CleanupOptions>(
    () => ({
      ...cleanupOptions,
      simplifyPunctuation:
        cleanupOptions.simplifyPunctuation ||
        exportSettings.punctuationMode === "simplify",
    }),
    [cleanupOptions, exportSettings.punctuationMode],
  );
  const sourceCacheSignature = React.useMemo(
    () => parsedSourceSignature(parsedSource),
    [parsedSource],
  );
  const cleanupCacheSignature = React.useMemo(
    () => cleanupSignature(effectiveCleanupOptions, customCleanupRules),
    [customCleanupRules, effectiveCleanupOptions],
  );

  const preflight = React.useMemo<PreflightSummary>(() => {
    const cacheKey = `${sourceCacheSignature}|${cleanupCacheSignature}`;
    const cached = derivedCacheRef.current.preflight;
    if (cached?.key === cacheKey) return cached.value;

    const value = buildPreflightSummary(
      parsedSource,
      effectiveCleanupOptions,
      customCleanupRules,
    );
    derivedCacheRef.current.preflight = { key: cacheKey, value };
    return value;
  }, [
    cleanupCacheSignature,
    customCleanupRules,
    effectiveCleanupOptions,
    parsedSource,
    sourceCacheSignature,
  ]);

  const sourceSections = React.useMemo(
    () => {
      const cacheKey = `${sourceCacheSignature}|${cleanupCacheSignature}`;
      const cached = derivedCacheRef.current.sourceSections;
      if (cached?.key === cacheKey) return cached.value;

      const value = buildCleanedSourceSections(
        parsedSource,
        effectiveCleanupOptions,
        customCleanupRules,
      );
      derivedCacheRef.current.sourceSections = { key: cacheKey, value };
      return value;
    },
    [
      cleanupCacheSignature,
      customCleanupRules,
      effectiveCleanupOptions,
      parsedSource,
      sourceCacheSignature,
    ],
  );

  const activeSegmentationSettings = React.useMemo<BookExportSettings>(() => {
    return sanitizeBookExportSettings({
      ...exportSettings,
      outputFormat: "mp3",
    });
  }, [exportSettings]);
  const effectiveVideoSettings = React.useMemo<BookVideoSettings>(
    () =>
      sanitizeBookLivePlayerSettings({
        ...videoSettings,
        includeAudioTrack:
          videoSettings.includeAudioTrack &&
          Boolean(videoSupport?.audioTrackSupported),
      }),
    [videoSettings, videoSupport?.audioTrackSupported],
  );
  const segmentationCacheSignature = React.useMemo(
    () =>
      settingsSignature({
        activeSegmentationSettings,
        effectiveVideoSettings,
        outputType: "audio",
      }),
    [activeSegmentationSettings, effectiveVideoSettings],
  );
  const sourceSectionsCacheSignature = React.useMemo(
    () => sourceSectionsSignature(sourceSections),
    [sourceSections],
  );

  const exportPlan = React.useMemo(() => {
    const cacheKey = [
      hashString(preflight.cleanedText),
      segmentationCacheSignature,
      sourceSectionsCacheSignature,
      preflight.title ?? "",
      preflight.filename ?? "",
    ].join("|");
    const cached = derivedCacheRef.current.exportPlan;
    if (cached?.key === cacheKey) return cached.value;

    const value = buildBookExportPlan({
      cleanedText: preflight.cleanedText,
      outputType: "audio",
      settings: activeSegmentationSettings,
      sourceSections,
      sourceTitle: preflight.title || preflight.filename,
      videoSettings: effectiveVideoSettings,
    });
    derivedCacheRef.current.exportPlan = { key: cacheKey, value };
    return value;
  }, [
    activeSegmentationSettings,
    effectiveVideoSettings,
    preflight.cleanedText,
    preflight.filename,
    preflight.title,
    segmentationCacheSignature,
    sourceSections,
    sourceSectionsCacheSignature,
  ]);
  const exportParts = exportPlan.parts;
  const exportBatches = exportPlan.batches;
  const zipBatchWorkflow = exportPlan.zipWorkflow && exportParts.length > 1;
  const selectedExportBatch = React.useMemo(() => {
    if (!zipBatchWorkflow) return null;
    return (
      exportBatches.find((batch) => batch.batchNumber === selectedBatchNumber) ??
      exportBatches[0] ??
      null
    );
  }, [exportBatches, selectedBatchNumber, zipBatchWorkflow]);
  const activeDownloadParts = selectedExportBatch?.parts ?? exportParts;

  React.useEffect(() => {
    if (!zipBatchWorkflow) {
      if (selectedBatchNumber !== 1) setSelectedBatchNumber(1);
      return;
    }
    const totalBatches = Math.max(1, exportBatches.length);
    if (selectedBatchNumber < 1 || selectedBatchNumber > totalBatches) {
      setSelectedBatchNumber(1);
    }
  }, [exportBatches.length, selectedBatchNumber, zipBatchWorkflow]);

  const exportAnalysis = React.useMemo(() => {
    const cacheKey = [
      hashString(preflight.cleanedText),
      segmentationCacheSignature,
      exportParts.length,
      preflight.unsupportedCount,
    ].join("|");
    const cached = derivedCacheRef.current.exportAnalysis;
    if (cached?.key === cacheKey) return cached.value;

    const value = buildExportAnalysis({
        preflight,
        settings: activeSegmentationSettings,
        partCount: exportParts.length,
      });
    derivedCacheRef.current.exportAnalysis = { key: cacheKey, value };
    return value;
  }, [
    activeSegmentationSettings,
    exportParts.length,
    preflight,
    preflight.cleanedText,
    preflight.unsupportedCount,
    segmentationCacheSignature,
  ]);

  const hasSource = parsedSource.rawText.trim().length > 0;
  const hasCleanedSource = preflight.cleanedText.trim().length > 0;
  const isUploaded = parsedSource.sourceType !== "pasted";
  const isUploadedPreviewMode = sourceEntryMode === "uploaded-preview";
  const isTextareaMode = sourceEntryMode !== "uploaded-preview";
  const sourceDraftActive = sourceEditMode === "draft";
  const sourceDraftIsLarge =
    sourceEditDraft.length > LARGE_SOURCE_EDIT_THRESHOLD;
  const extractedPreview = React.useMemo(
    () => capExtractedPreview(parsedSource.rawText),
    [parsedSource.rawText],
  );
  const extractedPreviewTruncated =
    parsedSource.rawText.length > EXTRACTED_SOURCE_PREVIEW_LIMIT;
  const extractedWordCount = React.useMemo(
    () => countSourceWords(parsedSource.rawText),
    [parsedSource.rawText],
  );
  const showSourceState =
    status === "parsing" ||
    status === "error" ||
    Boolean(parsedSource.filename) ||
    hasSource;
  const canClearSource =
    hasSource ||
    status === "error" ||
    Boolean(parsedSource.filename) ||
    Boolean(pendingFilename) ||
    sourceText.length > 0 ||
    sourceEditDraft.length > 0;
  const cleanedSourceEmptyWarning =
    hasSource && !hasCleanedSource
      ? "Cleanup removed all source text. Turn off the cleanup option or add text before downloading."
      : "";
  const sourceWarnings = showSourceState
    ? [
        ...preflight.extractionWarnings,
        ...preflight.cleanupWarnings,
        cleanedSourceEmptyWarning,
      ].filter(Boolean)
    : [];
  const exportWarnings = exportAnalysis.warnings.filter(Boolean);
  const exportRunning = isExportRunning(exportProgress);
  const isAudioOutput = true;
  const splitEnabled =
    activeSegmentationSettings.splitMode !== "none" || exportPlan.automaticSplit;
  const isSegmentedOutput = splitEnabled || exportParts.length > 1;
  const appliedThemeMode = useAppliedThemeMode();
  const resolvedVideoBackgroundStyle =
    resolveBookVideoBackgroundStyle(appliedThemeMode);
  const audioPreview = React.useMemo(
    () => buildBookAudioPreview(preflight.cleanedText, exportSettings),
    [exportSettings, preflight.cleanedText],
  );
  const livePreviewSegments = React.useMemo(
    () =>
      buildLivePreviewSegments({
        cleanedText: preflight.cleanedText,
        settings: exportSettings,
        sourceSections,
        sourceTitle: preflight.title || preflight.filename,
      }),
    [
      exportSettings,
      preflight.cleanedText,
      preflight.filename,
      preflight.title,
      sourceSections,
    ],
  );
  const livePreviewProgressContentHash = React.useMemo(
    () =>
      hashLivePreviewProgressSignature(
        JSON.stringify({
          sourceHash: hashLivePreviewProgressSignature(preflight.cleanedText),
          sourceSectionsHash: hashLivePreviewProgressSignature(
            sourceSectionsCacheSignature,
          ),
          timing: {
            charWpm: exportSettings.charWpm,
            farnsworthWpm: exportSettings.farnsworthWpm,
            paragraphPauseMultiplier: exportSettings.paragraphPauseMultiplier,
            punctuationMode: exportSettings.punctuationMode,
            sentencePauseMultiplier: exportSettings.sentencePauseMultiplier,
          },
        }),
      ),
    [
      exportSettings.charWpm,
      exportSettings.farnsworthWpm,
      exportSettings.paragraphPauseMultiplier,
      exportSettings.punctuationMode,
      exportSettings.sentencePauseMultiplier,
      preflight.cleanedText,
      sourceSectionsCacheSignature,
    ],
  );
  const activePreviewSegment =
    livePreviewSegments[
      Math.min(
        activePreviewSegmentIndex,
        Math.max(0, livePreviewSegments.length - 1),
      )
    ] ?? null;
  const videoPreview = React.useMemo(
    () =>
      buildLiveMorseVideoPreview({
        audioSettings: {
          charWpm: exportSettings.charWpm,
          farnsworthWpm: exportSettings.farnsworthWpm,
        },
        fallbackText: preflight.cleanedText,
        segment: activePreviewSegment,
        settings: effectiveVideoSettings,
      }),
    [
      activePreviewSegment,
      effectiveVideoSettings,
      exportSettings.charWpm,
      exportSettings.farnsworthWpm,
      preflight.cleanedText,
    ],
  );
  const visualPreviewDurationMs = React.useMemo(
    () => Math.max(1, videoPreview.durationMs),
    [videoPreview.durationMs],
  );
  const persistedVisualPreviewProgressMs = React.useMemo(
    () =>
      Math.round(
        Math.max(0, Math.min(visualPreviewDurationMs, visualPreviewElapsedMs)) /
          1000,
      ) * 1000,
    [visualPreviewDurationMs, visualPreviewElapsedMs],
  );
  React.useEffect(() => {
    if (activePreviewSegmentIndex < livePreviewSegments.length) return;
    setActivePreviewSegmentIndex(0);
    visualPreviewBaseElapsedRef.current = 0;
    setVisualPreviewElapsedMs(0);
  }, [activePreviewSegmentIndex, livePreviewSegments.length]);
  React.useEffect(() => {
    if (!preferencesLoaded) return;
    if (
      restoredLivePreviewProgressHashRef.current ===
      livePreviewProgressContentHash
    ) {
      return;
    }
    restoredLivePreviewProgressHashRef.current = livePreviewProgressContentHash;
    skipNextLivePreviewProgressSaveRef.current = true;

    if (!hasCleanedSource || livePreviewSegments.length === 0) {
      setActivePreviewSegmentIndex(0);
      visualPreviewBaseElapsedRef.current = 0;
      setVisualPreviewElapsedMs(0);
      return;
    }

    const restored = readLivePreviewProgress(
      BOOK_TRANSLATOR_LIVE_PREVIEW_PROGRESS_KEY,
      {
        contentHash: livePreviewProgressContentHash,
        getSegmentDurationMs: (segmentIndex) =>
          livePreviewSegmentDurationMs(livePreviewSegments[segmentIndex]),
        segmentCount: livePreviewSegments.length,
      },
    );
    const restoredSegmentIndex = restored?.segmentIndex ?? 0;
    const restoredElapsedMs = restored?.elapsedMs ?? 0;
    setActivePreviewSegmentIndex(restoredSegmentIndex);
    visualPreviewBaseElapsedRef.current = restoredElapsedMs;
    setVisualPreviewElapsedMs(restoredElapsedMs);
  }, [
    hasCleanedSource,
    exportSettings.charWpm,
    exportSettings.farnsworthWpm,
    exportSettings.paragraphPauseMultiplier,
    exportSettings.punctuationMode,
    exportSettings.sentencePauseMultiplier,
    livePreviewProgressContentHash,
    livePreviewSegments,
    preferencesLoaded,
  ]);
  React.useEffect(() => {
    if (
      !preferencesLoaded ||
      !hasCleanedSource ||
      livePreviewSegments.length === 0 ||
      restoredLivePreviewProgressHashRef.current !==
        livePreviewProgressContentHash
    ) {
      return;
    }
    if (skipNextLivePreviewProgressSaveRef.current) {
      skipNextLivePreviewProgressSaveRef.current = false;
      return;
    }
    const safeSegmentIndex = Math.min(
      activePreviewSegmentIndex,
      Math.max(0, livePreviewSegments.length - 1),
    );
    if (safeSegmentIndex === 0 && persistedVisualPreviewProgressMs === 0) {
      return;
    }
    writeLivePreviewProgress(
      BOOK_TRANSLATOR_LIVE_PREVIEW_PROGRESS_KEY,
      buildLivePreviewProgressState({
        contentHash: livePreviewProgressContentHash,
        elapsedMs: persistedVisualPreviewProgressMs,
        segmentIndex: safeSegmentIndex,
      }),
    );
  }, [
    activePreviewSegmentIndex,
    hasCleanedSource,
    livePreviewProgressContentHash,
    livePreviewSegments.length,
    persistedVisualPreviewProgressMs,
    preferencesLoaded,
  ]);
  const renderEstimateLabel = React.useMemo(
    () =>
      estimatedRenderTimeLabel(
        exportAnalysis.totalRuntimeMs,
        exportSettings.outputFormat,
      ),
    [
      exportAnalysis.totalRuntimeMs,
      exportSettings.outputFormat,
    ],
  );
  const previewSettingsSignature = React.useMemo(
    () =>
      [
        outputType,
        audioPreview?.sampleMorse.length ?? 0,
        audioPreview?.durationMs ?? 0,
        exportSettings.charWpm,
        exportSettings.farnsworthWpm,
        exportSettings.pitch,
        exportSettings.volume,
        exportSettings.tonePreset,
        exportSettings.outputFormat,
        effectiveVideoSettings.visualStyle,
        effectiveVideoSettings.intensity,
        effectiveVideoSettings.includeAudioTrack,
        effectiveVideoSettings.showBranding,
        effectiveVideoSettings.showVisualSignal,
        effectiveVideoSettings.showMorseSymbols,
        effectiveVideoSettings.showPlainText,
        effectiveVideoSettings.showMorseOverlay,
        effectiveVideoSettings.textDisplayMode,
        resolvedVideoBackgroundStyle,
      ].join("|"),
    [
      audioPreview?.durationMs,
      audioPreview?.sampleMorse.length,
      exportSettings.charWpm,
      exportSettings.farnsworthWpm,
      exportSettings.outputFormat,
      exportSettings.pitch,
      exportSettings.tonePreset,
      exportSettings.volume,
      outputType,
      resolvedVideoBackgroundStyle,
      effectiveVideoSettings.includeAudioTrack,
      effectiveVideoSettings.intensity,
      effectiveVideoSettings.showBranding,
      effectiveVideoSettings.showVisualSignal,
      effectiveVideoSettings.showMorseSymbols,
      effectiveVideoSettings.showPlainText,
      effectiveVideoSettings.showMorseOverlay,
      effectiveVideoSettings.textDisplayMode,
      effectiveVideoSettings.visualStyle,
    ],
  );
  const oversizedAudioExportPart = React.useMemo(
    () => findOversizedAudioExportPart(exportParts, exportSettings),
    [exportParts, exportSettings],
  );
  const activeOversizedExportPart = oversizedAudioExportPart;
  const unresolvedOversizedExportPart = exportPlan.unresolvedOversizedPart;
  const oversizedExportMessage = unresolvedOversizedExportPart
    ? `${BOOK_OVERSIZED_EXPORT_MESSAGE} ${oversizedExportDetailsLabel(
        activeOversizedExportPart,
      )}`
    : "";
  const longExportMessages =
    zipBatchWorkflow
      ? [BOOK_LONG_EXPORT_MESSAGE, BOOK_LONG_EXPORT_KEEP_OPEN_MESSAGE]
      : [];
  const canAudioExport =
    hasSource &&
    exportParts.length > 0 &&
    !exportRunning &&
    !unresolvedOversizedExportPart;
  const canExport = canAudioExport;
  const exportDisabledReason = !hasSource
    ? "Add source text or upload a source file to enable download."
    : !hasCleanedSource
      ? "Cleaned source is empty. Adjust source cleanup or add downloadable text."
      : exportParts.length === 0
        ? "Review the source text before downloading."
        : unresolvedOversizedExportPart
          ? oversizedExportMessage
          : exportRunning
            ? "Download is currently running."
            : "";
  const sourcePreviewStatus = !hasSource
    ? "No source loaded"
    : sourceDraftActive
      ? sourceDraftIsLarge
        ? "Large edit draft"
        : "Edit draft"
      : isUploadedPreviewMode
        ? extractedPreviewTruncated
          ? "Capped extracted preview"
          : "Extracted preview"
        : "Editable source";
  const presetModified = !settingsMatchBookPreset(exportSettings);
  const activePresetDetails =
    BOOK_EXPORT_PRESET_DETAILS[exportSettings.presetName];
  const activeSettingsSummary = describeBookExportSettings(exportSettings);
  const downloadKind =
    hasSource && exportParts.length > 0
      ? zipBatchWorkflow
        ? "zip"
        : getBookDownloadKind(exportParts, activeSegmentationSettings)
      : "audio";
  const downloadFormatLabel = exportSettings.outputFormat.toUpperCase();
  const totalBatches = exportBatches.length;
  const selectedBatchLabel =
    selectedExportBatch && totalBatches > 0
      ? `batch ${selectedExportBatch.batchNumber}`
      : "batch 1";
  const primaryDownloadLabel =
    zipBatchWorkflow
      ? `Download ZIP ${selectedBatchLabel}`
      : downloadKind === "zip"
      ? "Download ZIP bundle"
      : exportParts.length > 1
        ? `Download ZIP ${selectedBatchLabel}`
        : `Download ${downloadFormatLabel}`;
  const splitMode = activeSegmentationSettings.splitMode;
  const splitTargetPartMinutes = exportSettings.targetPartMinutes;
  const splitSummaryText =
    splitMode === "none"
      ? exportPlan.automaticSplit
        ? `${BOOK_LONG_EXPORT_MESSAGE} Estimated parts: ${formatNumber(
            exportParts.length,
          )}.`
        : downloadKind === "zip"
        ? "No split is selected. A ZIP is still required because selected sidecar files need to travel with the media."
        : `No split is selected. This can download as one ${downloadFormatLabel} file.`
      : `Using ${formatDuration(
          exportPlan.targetPartMs,
        )} target parts and safe text boundaries. Estimated parts: ${formatNumber(
          exportParts.length,
        )}.`;
  const customRuleMatchesById = React.useMemo(
    () =>
      new Map(preflight.customRuleMatches.map((match) => [match.id, match])),
    [preflight.customRuleMatches],
  );
  const progressPercent = exportProgressPercent(exportProgress);
  const showExportProgress = exportRunning;
  const showExportStatus = Boolean(exportStatus) && !exportRunning;
  const runningDownloadLabel =
    zipBatchWorkflow && selectedExportBatch
      ? `Rendering ZIP batch ${selectedExportBatch.batchNumber} of ${totalBatches}`
      : exportProgress.phase === "analyzing" || exportProgress.phase === "splitting"
        ? "Preparing export..."
        : exportProgress.phase === "bundling"
          ? "Finalizing download..."
          : "Rendering audio...";
  const downloadButtonLabel = exportRunning
    ? runningDownloadLabel
    : primaryDownloadLabel;

  React.useEffect(() => {
    if (!exportRunning || exportStartedAtMs === null) return undefined;
    const updateElapsed = () => {
      setExportElapsedMs(Math.max(0, performance.now() - exportStartedAtMs));
    };
    updateElapsed();
    const timer = window.setInterval(updateElapsed, 500);
    return () => window.clearInterval(timer);
  }, [exportRunning, exportStartedAtMs]);

  React.useEffect(() => {
    stopPreviewAudioRef.current?.();
    stopAudioPreviewTimer();
    stopVisualPreview(false);
    setPreviewErrorMessage("");

    if (!hasSource) {
      setPreviewStatus("waiting");
      return undefined;
    }
    if (!hasCleanedSource || !audioPreview) {
      setPreviewStatus("unavailable");
      return undefined;
    }

    setPreviewStatus("updating");
    const timer = window.setTimeout(() => {
      if (mountedRef.current) setPreviewStatus("ready");
    }, 160);
    return () => window.clearTimeout(timer);
  }, [
    audioPreview,
    hasCleanedSource,
    hasSource,
    previewSettingsSignature,
    stopAudioPreviewTimer,
    stopVisualPreview,
  ]);

  React.useEffect(() => {
    if (
      outputType === "audio" &&
      previewStatus === "playing" &&
      previewAudioPlayer.state === "idle"
    ) {
      setPreviewStatus("stopped");
    }
  }, [outputType, previewAudioPlayer.state, previewStatus]);

  const startAudioPreviewFrom = React.useCallback((startElapsedMs = 0) => {
    if (!audioPreview) {
      setPreviewStatus("unavailable");
      setPreviewErrorMessage("There is no previewable source yet.");
      return;
    }
    if (!previewAudioPlayer.isSupported) {
      setPreviewStatus("unavailable");
      setPreviewErrorMessage("Audio preview is unavailable in this browser.");
      return;
    }

    stopPreviewAudioRef.current?.();
    stopVisualPreview();
    clearAudioPreviewTimers();
    setPreviewErrorMessage("");
    const safeStartElapsed = Math.max(
      0,
      Math.min(audioPreview.durationMs, startElapsedMs),
    );
    if (!audioPreview.sampleMorse.trim()) {
      setAudioPreviewElapsedMs(audioPreview.durationMs);
      setPreviewStatus("stopped");
      return;
    }

    setPreviewStatus("playing");
    const timerSession = audioPreviewSessionRef.current + 1;
    audioPreviewSessionRef.current = timerSession;
    audioPreviewBaseElapsedRef.current = safeStartElapsed;
    setAudioPreviewElapsedMs(safeStartElapsed);

    const startAudioClock = (startedAtMs = performance.now()) => {
      if (audioPreviewSessionRef.current !== timerSession) return;
      clearAudioPreviewTimers();
      audioPreviewBaseElapsedRef.current = safeStartElapsed;
      audioPreviewStartedAtRef.current = startedAtMs;
      setAudioPreviewElapsedMs(safeStartElapsed);
      audioPreviewIntervalRef.current = window.setInterval(() => {
        if (audioPreviewSessionRef.current !== timerSession) return;
        const nextElapsed = Math.max(
          0,
          audioPreviewBaseElapsedRef.current +
            performance.now() -
            audioPreviewStartedAtRef.current,
        );
        setAudioPreviewElapsedMs(Math.min(audioPreview.durationMs, nextElapsed));
      }, 80);
      audioPreviewTimeoutRef.current = window.setTimeout(() => {
        if (audioPreviewSessionRef.current !== timerSession) return;
        clearAudioPreviewTimers();
        setAudioPreviewElapsedMs(audioPreview.durationMs);
        setPreviewStatus("stopped");
      }, Math.max(0, audioPreview.durationMs - safeStartElapsed));
    };

    startAudioClock();
    void previewAudioPlayer
      .play({
        code: audioPreview.sampleMorse,
        wpm: exportSettings.charWpm,
        farnsworthWpm: exportSettings.farnsworthWpm,
        hz: exportSettings.pitch,
        volume: exportSettings.volume,
        preset: exportSettings.tonePreset,
        repeat: false,
        flash: false,
        soundEnabled: true,
        startElapsedMs: safeStartElapsed,
        onPlaybackStart: startAudioClock,
      })
      .then(() => {
        if (
          !mountedRef.current ||
          audioPreviewSessionRef.current !== timerSession
        ) {
          return;
        }
        clearAudioPreviewTimers();
        setAudioPreviewElapsedMs(audioPreview.durationMs);
        setPreviewStatus("stopped");
      })
      .catch(() => {
        if (!mountedRef.current) return;
        clearAudioPreviewTimers();
        setPreviewStatus("failed");
        setPreviewErrorMessage(
          "Audio preview failed. Try again or adjust the source.",
        );
      });
  }, [
    audioPreview,
    clearAudioPreviewTimers,
    exportSettings.charWpm,
    exportSettings.farnsworthWpm,
    exportSettings.pitch,
    exportSettings.tonePreset,
    exportSettings.volume,
    previewAudioPlayer,
    stopVisualPreview,
  ]);

  const handlePlayAudioPreview = React.useCallback(() => {
    const currentElapsed = audioPreviewElapsedMs;
    const startElapsed =
      audioPreview &&
      currentElapsed < audioPreview.durationMs - MIN_PREVIEW_RESTART_REMAINING_MS
        ? currentElapsed
        : 0;
    startAudioPreviewFrom(startElapsed);
  }, [audioPreview, audioPreviewElapsedMs, startAudioPreviewFrom]);

  const handleScrubAudioPreview = React.useCallback(
    (elapsedMs: number) => {
      if (!audioPreview) return;
      const nextElapsed = Math.max(
        0,
        Math.min(audioPreview.durationMs, elapsedMs),
      );
      setAudioPreviewElapsedMs(nextElapsed);
      audioPreviewBaseElapsedRef.current = nextElapsed;
      audioPreviewStartedAtRef.current = performance.now();
    },
    [audioPreview],
  );

  const handleSeekAudioPreview = React.useCallback(
    (elapsedMs: number) => {
      if (!audioPreview) return;
      const nextElapsed = Math.max(
        0,
        Math.min(audioPreview.durationMs, elapsedMs),
      );
      setAudioPreviewElapsedMs(nextElapsed);
      audioPreviewBaseElapsedRef.current = nextElapsed;
      audioPreviewStartedAtRef.current = performance.now();
      if (
        previewStatus === "playing" &&
        (previewAudioPlayer.state === "playing" ||
          previewAudioPlayer.state === "paused")
      ) {
        startAudioPreviewFrom(nextElapsed);
      }
    },
    [
      audioPreview,
      previewAudioPlayer.state,
      previewStatus,
      startAudioPreviewFrom,
    ],
  );

  const handlePlayVisualPreview = React.useCallback((requestedElapsedMs?: number) => {
    if (!audioPreview) {
      setPreviewStatus("unavailable");
      setPreviewErrorMessage("There is no previewable source yet.");
      return;
    }

    stopPreviewAudioRef.current?.();
    clearVisualPreviewTimers();
    setPreviewErrorMessage("");
    setPreviewStatus("playing");
    setVisualPreviewPlaying(true);
    const requestedElapsed =
      typeof requestedElapsedMs === "number"
        ? requestedElapsedMs
        : visualPreviewElapsedMs;
    const currentElapsed = Math.max(
      0,
      Math.min(visualPreviewDurationMs, requestedElapsed),
    );
    const startElapsed =
      visualPreviewDurationMs - currentElapsed <=
      MIN_PREVIEW_RESTART_REMAINING_MS
        ? 0
        : currentElapsed;
    const timerSession = visualPreviewSessionRef.current + 1;
    visualPreviewSessionRef.current = timerSession;
    visualPreviewBaseElapsedRef.current = startElapsed;
    setVisualPreviewElapsedMs(startElapsed);

    const startVisualClock = (startedAtMs = performance.now()) => {
      if (visualPreviewSessionRef.current !== timerSession) return;
      clearVisualPreviewTimers();
      visualPreviewStartedAtRef.current = startedAtMs;
      visualPreviewBaseElapsedRef.current = startElapsed;
      setVisualPreviewElapsedMs(startElapsed);
      visualPreviewIntervalRef.current = window.setInterval(() => {
        if (visualPreviewSessionRef.current !== timerSession) return;
        const nextElapsed =
          visualPreviewBaseElapsedRef.current +
          Math.max(0, performance.now() - visualPreviewStartedAtRef.current);
        if (nextElapsed >= visualPreviewDurationMs) {
          clearVisualPreviewTimers();
          setVisualPreviewElapsedMs(visualPreviewDurationMs);
          setVisualPreviewPlaying(false);
          setPreviewStatus("stopped");
          if (activePreviewSegmentIndex + 1 < livePreviewSegments.length) {
            window.setTimeout(() => {
              setActivePreviewSegmentIndex((index) =>
                Math.min(index + 1, Math.max(0, livePreviewSegments.length - 1)),
              );
              visualPreviewBaseElapsedRef.current = 0;
              setVisualPreviewElapsedMs(0);
            }, 0);
          }
          return;
        }
        setVisualPreviewElapsedMs(nextElapsed);
      }, 40);
    };

    const playWithAudio =
      effectiveVideoSettings.includeAudioTrack &&
      previewAudioPlayer.isSupported &&
      videoPreview.sampleMorse.trim().length > 0;

    const beginPlayback = () => {
      if (visualPreviewSessionRef.current !== timerSession) return;

      if (!playWithAudio) {
        startVisualClock();
        return;
      }

      void previewAudioPlayer
        .play({
          code: videoPreview.sampleMorse,
          wpm: exportSettings.charWpm,
          farnsworthWpm: exportSettings.farnsworthWpm,
          hz: exportSettings.pitch,
          volume: exportSettings.volume,
          preset: exportSettings.tonePreset,
          repeat: false,
          flash: false,
          soundEnabled: true,
          startElapsedMs: startElapsed,
          onPlaybackStart: startVisualClock,
        })
        .then(() => {
          if (
            !mountedRef.current ||
            visualPreviewSessionRef.current !== timerSession
          ) {
            return;
          }
          clearVisualPreviewTimers();
          setVisualPreviewElapsedMs(visualPreviewDurationMs);
          setVisualPreviewPlaying(false);
          setPreviewStatus("stopped");
        })
        .catch(() => {
          if (
            !mountedRef.current ||
            visualPreviewSessionRef.current !== timerSession
          ) {
            return;
          }
          clearVisualPreviewTimers();
          setVisualPreviewPlaying(false);
          setPreviewStatus("failed");
          setPreviewErrorMessage(
            "Video preview audio failed. Try playing the preview again.",
          );
        });
    };

    const startDelayMs = getLivePreviewStartDelayMs(
      startElapsed,
      visualPreviewDurationMs,
    );
    if (startDelayMs > 0) {
      visualPreviewTimeoutRef.current = window.setTimeout(() => {
        visualPreviewTimeoutRef.current = null;
        beginPlayback();
      }, startDelayMs);
      return;
    }

    beginPlayback();
  }, [
    audioPreview,
    activePreviewSegmentIndex,
    clearVisualPreviewTimers,
    effectiveVideoSettings.includeAudioTrack,
    exportSettings.charWpm,
    exportSettings.farnsworthWpm,
    exportSettings.pitch,
    exportSettings.tonePreset,
    exportSettings.volume,
    livePreviewSegments.length,
    previewAudioPlayer,
    videoPreview.sampleMorse,
    visualPreviewDurationMs,
    visualPreviewElapsedMs,
  ]);

  const handleScrubVisualPreview = React.useCallback(
    (elapsedMs: number) => {
      const nextElapsed = Math.max(
        0,
        Math.min(visualPreviewDurationMs, elapsedMs),
      );
      setVisualPreviewElapsedMs(nextElapsed);
      visualPreviewBaseElapsedRef.current = nextElapsed;
      visualPreviewStartedAtRef.current = performance.now();
    },
    [visualPreviewDurationMs],
  );

  const handleSeekVisualPreview = React.useCallback(
    (elapsedMs: number) => {
      const nextElapsed =
        Math.max(0, Math.min(visualPreviewDurationMs, elapsedMs));
      setVisualPreviewElapsedMs(nextElapsed);
      visualPreviewBaseElapsedRef.current = nextElapsed;
      visualPreviewStartedAtRef.current = performance.now();
      if (visualPreviewPlaying) {
        handlePlayVisualPreview(nextElapsed);
      }
    },
    [handlePlayVisualPreview, visualPreviewDurationMs, visualPreviewPlaying],
  );

  const handlePreviewSegmentChange = React.useCallback(
    (segmentIndex: number) => {
      const safeIndex = Math.max(
        0,
        Math.min(segmentIndex, Math.max(0, livePreviewSegments.length - 1)),
      );
      stopPreviewAudioRef.current?.();
      stopVisualPreview(true);
      setActivePreviewSegmentIndex(safeIndex);
      visualPreviewBaseElapsedRef.current = 0;
      setVisualPreviewElapsedMs(0);
      setPreviewStatus((current) =>
        current === "playing" ? "stopped" : current,
      );
    },
    [livePreviewSegments.length, stopVisualPreview],
  );

  const updatePastedText = React.useCallback(
    (value: string) => {
      const cancelledActiveExport = hasActiveExport();
      if (cancelledActiveExport) {
        cancelActiveExport("Source changed; download cancelled.");
      }
      parseVersionRef.current += 1;
      fileSelectionRef.current = null;
      setPendingFilename("");
      setSourceEntryMode("pasted");
      setSourceEditMode("idle");
      setSourceEditDraft("");
      setSourceText(value);
      setParsedSource(parsePastedSource(value));
      setStatus(value.trim() ? "ready" : "idle");
      setErrorMessage("");
      setSourceActionStatus(null);
      if (!cancelledActiveExport) setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const updateUploadedText = React.useCallback(
    (value: string) => {
      const cancelledActiveExport = hasActiveExport();
      if (cancelledActiveExport) {
        cancelActiveExport("Source changed; download cancelled.");
      }
      parseVersionRef.current += 1;
      setSourceText(value);
      setParsedSource((current) => ({
        ...current,
        rawText: value,
        sections: undefined,
        sectionCount: undefined,
      }));
      setSourceEditMode("idle");
      setSourceEditDraft("");
      setStatus(value.trim() ? "ready" : "idle");
      setErrorMessage("");
      setSourceActionStatus(null);
      if (!cancelledActiveExport) setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const parseSelectedFile = React.useCallback(
    async (file: File) => {
      const cancelledActiveExport = hasActiveExport();
      if (cancelledActiveExport) {
        cancelActiveExport("Source changed; download cancelled.");
      }
      const selectedAt = performance.now();
      const previousSelection = fileSelectionRef.current;
      if (
        previousSelection &&
        selectedAt - previousSelection.selectedAt < 500 &&
        file.lastModified < previousSelection.lastModified
      ) {
        return;
      }
      fileSelectionRef.current = {
        selectedAt,
        lastModified: file.lastModified,
      };
      const version = parseVersionRef.current + 1;
      parseVersionRef.current = version;
      setStatus("parsing");
      setErrorMessage("");
      setPendingFilename(file.name);
      setDragActive(false);
      setSourceText("");
      setSourceEditMode("idle");
      setSourceEditDraft("");
      setSourceEntryMode("uploaded-preview");
      setParsedSource(createEmptyParsedSource());
      setSourceActionStatus(null);
      if (!cancelledActiveExport) setExportStatus(null);
      setCompletedExport(null);

      try {
        const parsed = await parseFileSource(file);
        if (!mountedRef.current || parseVersionRef.current !== version) return;
        const editableUpload = shouldUseEditableUpload(parsed);
        setParsedSource(parsed);
        setSourceText(editableUpload ? parsed.rawText : "");
        setSourceEntryMode(
          editableUpload ? "uploaded-textarea" : "uploaded-preview",
        );
        setStatus("ready");
        setPendingFilename("");
      } catch (error) {
        if (!mountedRef.current || parseVersionRef.current !== version) return;
        const message =
          error instanceof BookSourceError || error instanceof Error
            ? error.message
            : "This source could not be parsed.";
        setParsedSource(createEmptyParsedSource());
        setSourceText("");
        setSourceEntryMode("uploaded-preview");
        setStatus("error");
        setErrorMessage(message);
        setPendingFilename(file.name);
      }
    },
    [cancelActiveExport, hasActiveExport],
  );

  const clearSource = React.useCallback(() => {
    const cancelledActiveExport = hasActiveExport();
    if (cancelledActiveExport) {
      cancelActiveExport("Source changed; download cancelled.");
    }
    parseVersionRef.current += 1;
    setSourceText("");
    setSourceEditMode("idle");
    setSourceEditDraft("");
    setSourceEntryMode("pasted");
    derivedCacheRef.current = {};
    fileSelectionRef.current = null;
    setPendingFilename("");
    setParsedSource(createEmptyParsedSource());
    setStatus("idle");
    setErrorMessage("");
    setSourceActionStatus(null);
    const idleProgress = IDLE_EXPORT_PROGRESS;
    exportProgressRef.current = idleProgress;
    setExportProgress(idleProgress);
    if (!cancelledActiveExport) setExportStatus(null);
    setCompletedExport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [cancelActiveExport, hasActiveExport, outputType]);

  const copySourceValue = React.useCallback(
    async (label: string, value: string) => {
      const result = await copyTextToClipboard(value);
      setSourceActionStatus({
        kind: result.ok ? "success" : "error",
        message: result.ok ? `${label} copied.` : result.message,
      });
    },
    [],
  );

  const editExtractedText = React.useCallback(() => {
    if (!parsedSource.rawText.trim()) {
      setSourceActionStatus({
        kind: "error",
        message: "There is no extracted text to edit yet.",
      });
      return;
    }
    setSourceEditMode("draft");
    setSourceEditDraft(parsedSource.rawText);
    setSourceActionStatus({
      kind: "info",
      message:
        parsedSource.rawText.length > LARGE_SOURCE_EDIT_THRESHOLD
          ? "Large source edits are held as a draft until you apply them."
          : "Edit the extracted text, then apply or cancel your draft.",
    });
    window.requestAnimationFrame(() => {
      document.getElementById("book-source-edit-draft")?.focus();
    });
  }, [parsedSource.rawText]);

  const applyExtractedTextDraft = React.useCallback(() => {
    if (hasActiveExport()) {
      cancelActiveExport("Source changed; download cancelled.");
    }
    parseVersionRef.current += 1;
    fileSelectionRef.current = null;
    setPendingFilename("");
    setParsedSource((current) => ({
      ...current,
      rawText: sourceEditDraft,
      sections: undefined,
      sectionCount: undefined,
      warnings: current.warnings,
    }));
    setSourceText(
      sourceEditDraft.length <= LARGE_SOURCE_EDIT_THRESHOLD
        ? sourceEditDraft
        : "",
    );
    setSourceEntryMode(
      sourceEditDraft.length <= LARGE_SOURCE_EDIT_THRESHOLD
        ? "uploaded-textarea"
        : "uploaded-preview",
    );
    setSourceEditMode("idle");
    setSourceEditDraft("");
    setStatus(sourceEditDraft.trim() ? "ready" : "idle");
    setErrorMessage("");
    setSourceActionStatus({
      kind: "success",
      message: "Extracted text edits applied.",
    });
    setExportStatus(null);
    setCompletedExport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [cancelActiveExport, hasActiveExport, sourceEditDraft]);

  const cancelExtractedTextDraft = React.useCallback(() => {
    setSourceEditMode("idle");
    setSourceEditDraft("");
    setSourceActionStatus({
      kind: "info",
      message: "Draft edits cancelled; active source is unchanged.",
    });
  }, []);

  const handleFileInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void parseSelectedFile(file);
    },
    [parseSelectedFile],
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) void parseSelectedFile(file);
      setDragActive(false);
    },
    [parseSelectedFile],
  );

  const toggleCleanup = React.useCallback(
    (key: keyof CleanupOptions) => {
      if (hasActiveExport()) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setCleanupOptions((current) => ({
        ...current,
        [key]: !current[key],
      }));
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const addCustomCleanupRule = React.useCallback(() => {
    if (hasActiveExport()) {
      cancelActiveExport("Settings changed; download cancelled.");
    }
    const id = `custom-cleanup-${customCleanupRuleIdRef.current}`;
    customCleanupRuleIdRef.current += 1;
    setCustomCleanupRules((current) => [
      ...current,
      {
        id,
        enabled: true,
        find: "",
        replacement: "",
        caseSensitive: false,
        wholeWord: false,
      },
    ]);
    setExportStatus(null);
    setCompletedExport(null);
  }, [cancelActiveExport, hasActiveExport]);

  const updateCustomCleanupRule = React.useCallback(
    (id: string, patch: Partial<CustomCleanupRule>) => {
      if (hasActiveExport()) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setCustomCleanupRules((current) =>
        current.map((rule) =>
          rule.id === id ? { ...rule, ...patch, id: rule.id } : rule,
        ),
      );
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const deleteCustomCleanupRule = React.useCallback(
    (id: string) => {
      if (hasActiveExport()) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setCustomCleanupRules((current) =>
        current.filter((rule) => rule.id !== id),
      );
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const moveCustomCleanupRule = React.useCallback(
    (id: string, direction: -1 | 1) => {
      if (hasActiveExport()) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setCustomCleanupRules((current) => {
        const index = current.findIndex((rule) => rule.id === id);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
          return current;
        }
        const next = [...current];
        const [rule] = next.splice(index, 1);
        next.splice(nextIndex, 0, rule);
        return next;
      });
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const clearCustomCleanupRules = React.useCallback(() => {
    if (hasActiveExport()) {
      cancelActiveExport("Settings changed; download cancelled.");
    }
    setCustomCleanupRules([]);
    setExportStatus(null);
    setCompletedExport(null);
  }, [cancelActiveExport, hasActiveExport]);

  const updateExportSettings = React.useCallback(
    (patch: Partial<BookExportSettings>) => {
      if (hasActiveExport()) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setExportSettings((current) =>
        sanitizeBookExportSettings({ ...current, ...patch }),
      );
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const updateOutputType = React.useCallback(
    (nextOutputType: BookOutputType) => {
      if (nextOutputType !== "audio" || nextOutputType === outputType) return;
      const wasRunning = hasActiveExport();
      if (wasRunning) {
        cancelActiveExport("Output type changed; download cancelled.");
      }
      setOutputType(nextOutputType);
      setExportProgress(IDLE_EXPORT_PROGRESS);
      setExportStatus(
        wasRunning
          ? {
              kind: "info",
              message: "Output type changed; download cancelled.",
            }
          : null,
      );
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport, outputType],
  );

  const updateVideoSettings = React.useCallback(
    (patch: Partial<BookVideoSettings>) => {
      if (hasActiveExport()) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
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
        sanitizeBookLivePlayerSettings({ ...current, ...normalizedPatch }),
      );
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const pickPreset = React.useCallback(
    (presetName: BookExportPresetName) => {
      if (hasActiveExport()) {
        cancelActiveExport("Preset changed; download cancelled.");
      }
      setExportSettings(applyBookPreset(presetName));
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, hasActiveExport],
  );

  const resetCurrentPreset = React.useCallback(() => {
    if (hasActiveExport()) {
      cancelActiveExport("Preset reset; download cancelled.");
    }
    setExportSettings((current) => applyBookPreset(current.presetName));
    setExportStatus(null);
    setCompletedExport(null);
  }, [cancelActiveExport, hasActiveExport]);

  const handleUploadKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      fileInputRef.current?.click();
    },
    [],
  );

  const handleAdvancedToggle = React.useCallback(
    (event: React.SyntheticEvent<HTMLDetailsElement>) => {
      setAdvancedOpen(event.currentTarget.open);
    },
    [],
  );

  const handleCharWpmChange = React.useCallback(
    (value: number) => {
      const charWpm = Math.round(
        clampNumber(value, AUDIO_SPEED_RANGE.min, AUDIO_SPEED_RANGE.max),
      );
      updateExportSettings({
        charWpm,
        farnsworthWpm: Math.min(exportSettings.farnsworthWpm, charWpm),
      });
    },
    [exportSettings.farnsworthWpm, updateExportSettings],
  );

  const handleTonePresetChange = React.useCallback(
    (tonePreset: AudioTonePresetId) => {
      const defaults = getAudioPresetDefaults(tonePreset);
      updateExportSettings({
        tonePreset,
        pitch: defaults.pitchHz,
        volume: defaults.volume,
      });
    },
    [updateExportSettings],
  );

  const handleDownloadBook = React.useCallback(async () => {
    if (!hasSource || exportParts.length === 0) {
      setExportStatus({
        kind: "error",
        message: "Add source text before downloading MP3 audio.",
      });
      return;
    }

    if (!hasCleanedSource) {
      setExportStatus({
        kind: "error",
        message: "Cleaned source is empty. Adjust cleanup before downloading.",
      });
      return;
    }

    if (unresolvedOversizedExportPart) {
      setExportStatus({
        kind: "error",
        message: oversizedExportMessage || BOOK_OVERSIZED_EXPORT_MESSAGE,
      });
      setExportProgress({
        phase: "failed",
        message: oversizedExportMessage || BOOK_OVERSIZED_EXPORT_MESSAGE,
        currentPart: 0,
        totalParts: activeDownloadParts.length,
      });
      return;
    }

    exportAbortRef.current?.abort();
    const controller = new AbortController();
    exportAbortRef.current = controller;
    const version = exportVersionRef.current + 1;
    exportVersionRef.current = version;
    const startedAtMs = performance.now();
    setExportStartedAtMs(startedAtMs);
    setExportElapsedMs(0);
    setCompletedExport(null);
    setExportStatus({
      kind: "working",
      message: "Preparing export...",
    });
    const initialProgress: BookExportProgress = {
      phase: "analyzing",
      message: "Preparing cleaned source for MP3 download...",
      currentPart: 0,
      batchNumber: selectedExportBatch?.batchNumber,
      batchPartCount: activeDownloadParts.length,
      batchPartIndex: 0,
      totalBatches,
      totalParts: activeDownloadParts.length,
    };
    exportProgressRef.current = initialProgress;
    setExportProgress(initialProgress);

    try {
      const metadata = {
        title: preflight.title,
        author: preflight.author,
        filename: preflight.filename,
        sourceType: preflight.sourceType,
      };
      const progressHandler = (progress: BookExportProgress) => {
        if (mountedRef.current && exportVersionRef.current === version) {
          exportProgressRef.current = progress;
          setExportProgress(progress);
        }
      };
      const result = await createBookDownloadPackage({
        allParts: exportParts,
        batch: selectedExportBatch ?? undefined,
        metadata,
        parts: activeDownloadParts,
        settings: activeSegmentationSettings,
        signal: controller.signal,
        totalSelectedRuntimeMs: exportAnalysis.totalRuntimeMs,
        onProgress: progressHandler,
      });
      if (!mountedRef.current || exportVersionRef.current !== version) return;
      const download = downloadBlobFile({
        blob: result.blob,
        filename: result.filename,
      });
      if (!download.ok) {
        setExportProgress({
          phase: "failed",
          message: download.message,
          currentPart: activeDownloadParts.length,
          totalBatches,
          totalParts: activeDownloadParts.length,
        });
        setExportStatus({ kind: "error", message: download.message });
        return;
      }
      const resultOutputFormat = "mp3";
      setCompletedExport({
        batchNumber: selectedExportBatch?.batchNumber,
        filename: result.filename,
        downloadKind: result.downloadKind,
        outputFormat: resultOutputFormat,
        totalBatches,
        partCount: activeDownloadParts.length,
        runtimeLabel: formatDuration(
          selectedExportBatch?.runtimeMs ?? exportAnalysis.totalRuntimeMs,
        ),
        sizeLabel: result.downloadKind === "zip"
          ? formatBytes(result.blob.size)
          : exportAnalysis.estimatedSizeLabel,
        contents: result.contents,
      });
      setExportProgress({
        phase: "complete",
        message:
          result.downloadKind === "zip"
            ? zipBatchWorkflow && selectedExportBatch
              ? `Batch ${selectedExportBatch.batchNumber} downloaded. ${
                  selectedExportBatch.batchNumber < totalBatches
                    ? `Batch ${selectedExportBatch.batchNumber + 1} is ready when you are.`
                    : "All ZIP batches are complete."
                }`
            : `ZIP download started with ${activeDownloadParts.length} part${
                activeDownloadParts.length === 1 ? "" : "s"
              }.`
            : "MP3 download started.",
        batchNumber: selectedExportBatch?.batchNumber,
        batchPartCount: activeDownloadParts.length,
        batchPartIndex: activeDownloadParts.length,
        currentPart: activeDownloadParts.length,
        totalBatches,
        totalParts: activeDownloadParts.length,
      });
      setExportStatus({
        kind: "success",
        message:
          result.downloadKind === "zip"
            ? zipBatchWorkflow && selectedExportBatch
              ? `Batch ${selectedExportBatch.batchNumber} downloaded. ${
                  selectedExportBatch.batchNumber < totalBatches
                    ? `Batch ${selectedExportBatch.batchNumber + 1} is ready when you are.`
                    : "All ZIP batches are complete."
                }`
            : "ZIP download started."
            : "MP3 download started.",
      });
      if (
        zipBatchWorkflow &&
        selectedExportBatch &&
        selectedExportBatch.batchNumber < totalBatches
      ) {
        setSelectedBatchNumber(selectedExportBatch.batchNumber + 1);
      }
    } catch (error) {
      if (!mountedRef.current || exportVersionRef.current !== version) return;
      if (error instanceof DOMException && error.name === "AbortError") {
        setExportProgress({
          phase: "cancelled",
          message: "Download cancelled.",
          currentPart: 0,
          totalBatches,
          totalParts: activeDownloadParts.length,
        });
        setExportStatus({ kind: "info", message: "Download cancelled." });
        return;
      }
      const failedMessage = friendlyBookExportErrorMessage(error, "audio");
      setExportProgress({
        phase: "failed",
        message: failedMessage,
        currentPart: 0,
        totalBatches,
        totalParts: activeDownloadParts.length,
      });
      setExportStatus({
        kind: "error",
        message: failedMessage,
      });
    } finally {
      if (exportVersionRef.current === version) {
        exportAbortRef.current = null;
        setExportStartedAtMs(null);
      }
    }
  }, [
    activeSegmentationSettings,
    activeDownloadParts,
    downloadKind,
    exportAnalysis.estimatedSizeLabel,
    exportAnalysis.totalRuntimeMs,
    exportParts,
    exportSettings,
    hasCleanedSource,
    hasSource,
    preflight,
    selectedExportBatch,
    totalBatches,
    zipBatchWorkflow,
    downloadFormatLabel,
    oversizedExportMessage,
    unresolvedOversizedExportPart,
  ]);

  const uploadHelpText = hasSource
    ? "Drop a replacement TXT, MD, unprotected EPUB, or text-native PDF here, or click to choose a file."
    : "Drop TXT, MD, unprotected EPUB, or text-native PDF here, or click to choose a file.";
  const uploadTitle = "Replace source file";
  const uploadRightsText =
    "Only use text you have the right to process. You are responsible for your source content, including copyright or other usage restrictions.";

  return (
    <section
      className="mt-6 space-y-6"
      aria-label="Book source review and download tool"
      data-mw-book-export-ready={preferencesLoaded ? "true" : "loading"}
    >
      <section className="space-y-5" aria-labelledby="book-add-source-heading">
        <h2 id="book-add-source-heading" className="sr-only">
          Book translator source and download
        </h2>

        <div className="space-y-5" data-testid="book-source-entry">
          <section
            aria-label="Replace source file"
            data-testid="book-source-upload-row"
          >
            <SourceUploadDropzone
              dragActive={dragActive}
              fileInputRef={fileInputRef}
              filename={parsedSource.filename}
              hasSource={hasSource}
              onDrop={handleDrop}
              onFileInputChange={handleFileInputChange}
              onUploadKeyDown={handleUploadKeyDown}
              setDragActive={setDragActive}
              uploadHelpText={uploadHelpText}
              uploadRightsText={uploadRightsText}
              uploadTitle={uploadTitle}
            />
          </section>

          <section data-testid="book-source-text-row">
            <ToolPanel
              label="Source text"
              badge={
                isUploaded ? sourceTypeLabel(parsedSource.sourceType) : "Paste"
              }
            >
            {isTextareaMode ? (
              <>
                <label htmlFor="book-source-text" className="sr-only">
                  Paste long-form source text
                </label>
                <ToolTextarea
                  id="book-source-text"
                  value={sourceText}
                  onChange={(event) =>
                    isUploaded
                      ? updateUploadedText(event.target.value)
                      : updatePastedText(event.target.value)
                  }
                  placeholder="Paste a chapter, public-domain excerpt, notes, or any long-form text here..."
                  className="min-h-[7rem] sm:min-h-[8rem]"
                  spellCheck={false}
                />
              </>
            ) : sourceDraftActive ? (
              <div
                className="px-4 pb-4"
                aria-labelledby="book-source-edit-draft-heading"
              >
                <h3
                  id="book-source-edit-draft-heading"
                  className="text-base font-extrabold text-sky-950"
                >
                  Edit extracted text draft
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {sourceDraftIsLarge
                    ? "Large edits apply manually. Downloads, preview, runtime, and download details keep using the last applied source until you choose Apply edits."
                    : "Apply the draft to update cleanup, preview, runtime, and download output."}
                </p>
                <label htmlFor="book-source-edit-draft" className="sr-only">
                  Edit extracted text draft
                </label>
                <ToolTextarea
                  id="book-source-edit-draft"
                  value={sourceEditDraft}
                  onChange={(event) => setSourceEditDraft(event.target.value)}
                  className="mt-3 min-h-[9rem] rounded-lg bg-[#fffaf2]/70"
                  spellCheck={false}
                />
              </div>
            ) : (
              <div
                className="px-4 pb-4"
                aria-labelledby="book-source-large-note-heading"
              >
                {hasSource ? (
                  <>
                    <h3
                      id="book-source-large-note-heading"
                      className="text-base font-extrabold text-sky-950"
                    >
                      Extracted source loaded
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      This source is too large to keep in the top textarea.
                      Preview, copy, edit, or clear it in Source details below
                      Download settings.
                    </p>
                  </>
                ) : (
                  <EmptyPreview>
                    {status === "parsing"
                      ? `Reading ${pendingFilename || "the selected file"}...`
                      : "Upload a file to preview extracted source text here."}
                  </EmptyPreview>
                )}
              </div>
            )}
            </ToolPanel>
          </section>

          <BookPreviewSection
            audioPreviewElapsedMs={audioPreviewElapsedMs}
            audioPlayerState={previewAudioPlayer.state}
            audioPreview={audioPreview}
            audioSupported={previewAudioPlayer.isSupported}
            exportSettings={exportSettings}
            hasCleanedSource={hasCleanedSource}
            hasSource={hasSource}
            isDraftActive={sourceDraftActive}
            activeSegmentIndex={activePreviewSegmentIndex}
            livePreviewSegments={livePreviewSegments}
            onPreviewSegmentChange={handlePreviewSegmentChange}
            onPlayAudioPreview={handlePlayAudioPreview}
            onPlayVisualPreview={handlePlayVisualPreview}
            onScrubAudioPreview={handleScrubAudioPreview}
            onScrubVisualPreview={handleScrubVisualPreview}
            onSeekAudioPreview={handleSeekAudioPreview}
            onSeekVisualPreview={handleSeekVisualPreview}
            onStopPreview={stopActivePreview}
            outputType="video"
            previewErrorMessage={previewErrorMessage}
            previewStatus={previewStatus}
            resolvedVideoBackgroundStyle={resolvedVideoBackgroundStyle}
            videoPreview={videoPreview}
            videoSettings={effectiveVideoSettings}
            visualPreviewDurationMs={visualPreviewDurationMs}
            visualPreviewPlaying={visualPreviewPlaying}
            visualPreviewElapsedMs={visualPreviewElapsedMs}
          />

          <section
            className="space-y-4 pt-1"
            aria-labelledby="book-translator-settings-heading"
            data-testid="book-translator-settings-row"
          >
            <h3
              id="book-translator-settings-heading"
              className="text-base font-extrabold text-sky-950"
            >
              Settings
            </h3>

            <details className="mt-5">
              <summary className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-extrabold text-sky-950 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
                <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
                Live player settings
              </summary>
              <div className="mt-5">
                <BookVideoSettingsEditor
                  exportSettings={exportSettings}
                  onCharWpmChange={handleCharWpmChange}
                  onFarnsworthWpmChange={(value) =>
                    updateExportSettings({ farnsworthWpm: value })
                  }
                  onPitchChange={(value) =>
                    updateExportSettings({ pitch: value })
                  }
                  onTonePresetChange={handleTonePresetChange}
                  onVideoSettingsChange={updateVideoSettings}
                  onVolumeChange={(value) =>
                    updateExportSettings({ volume: value })
                  }
                  videoSupport={videoSupport}
                  videoSettings={videoSettings}
                />
              </div>
            </details>

            <details
              open={advancedOpen}
              onToggle={handleAdvancedToggle}
              className="mt-5"
            >
              <summary
                aria-expanded={advancedOpen}
                className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-extrabold text-sky-950 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
                Download settings
              </summary>
              <div className="mt-5 space-y-5">
                {isAudioOutput ? (
                  <>
                    <div>
                      <div>
                        <div>
                          <h4 className="text-base font-extrabold text-sky-950">
                            Choose download style
                          </h4>
                          <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                            Presets adjust speed, audio format, and optional
                            sidecar files.
                          </p>
                        </div>
                      </div>
                      <div
                        className="mt-4 flex flex-wrap items-center gap-2"
                        data-testid="book-preset-controls"
                      >
                        {BOOK_EXPORT_PRESET_NAMES.map((presetName) => {
                          const active =
                            exportSettings.presetName === presetName;
                          return (
                            <button
                              key={presetName}
                              type="button"
                              onClick={() => pickPreset(presetName)}
                              className={toolControlButtonClass({
                                active,
                                tone: active ? "dark" : "light",
                                size: "sm",
                                rounded: "full",
                                hover: "dark",
                              })}
                              aria-pressed={active}
                            >
                              {presetName}
                            </button>
                          );
                        })}
                        {presetModified ? (
                          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                            Modified from preset
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={resetCurrentPreset}
                          disabled={!presetModified}
                          className={toolControlButtonClass({
                            size: "sm",
                            disabled: !presetModified,
                          })}
                        >
                          <RefreshIcon
                            size={16}
                            title={undefined}
                            aria-hidden="true"
                          />
                          Reset preset
                        </button>
                      </div>
                      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,0.68fr)_minmax(260px,0.32fr)] lg:items-start">
                        <div>
                          <p className="text-base font-extrabold text-sky-950">
                            {exportSettings.presetName}
                          </p>
                          <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                            {activePresetDetails.description}
                          </p>
                        </div>
                        <div className="text-sm leading-relaxed text-slate-600">
                          <p className="font-semibold text-slate-800">
                            Best for: {activePresetDetails.bestFor}
                          </p>
                          <p className="mt-1">{activeSettingsSummary}</p>
                        </div>
                      </div>
                    </div>

                    <fieldset>
                      <legend className="text-base font-extrabold text-sky-950">
                        Output format
                      </legend>
                      <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                        Book downloads are MP3-only on this page. Long sources
                        still use 30-minute MP3 parts inside ZIP batches with a
                        manifest.
                      </p>
                    </fieldset>

                    <div>
                      <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <h4 className="text-base font-extrabold text-sky-950">
                            Audio settings
                          </h4>
                          <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                            These settings drive estimates and generated
                            downloads.
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          {tonePresetLabel(exportSettings.tonePreset)}
                        </span>
                      </div>
                      <AudioSettingsPanel
                        className="mt-5"
                        context="bookExport"
                        idPrefix="book-download-audio"
                        preset={exportSettings.tonePreset}
                        onPresetChange={handleTonePresetChange}
                        charWpm={exportSettings.charWpm}
                        onCharWpmChange={handleCharWpmChange}
                        farnsworthWpm={exportSettings.farnsworthWpm}
                        onFarnsworthWpmChange={(value) =>
                          updateExportSettings({ farnsworthWpm: value })
                        }
                        pitch={exportSettings.pitch}
                        onPitchChange={(value) =>
                          updateExportSettings({ pitch: value })
                        }
                        volume={exportSettings.volume}
                        onVolumeChange={(value) =>
                          updateExportSettings({ volume: value })
                        }
                        outputFormat={exportSettings.outputFormat}
                        mp3Bitrate={exportSettings.mp3Bitrate}
                        onMp3BitrateChange={(value) =>
                          updateExportSettings({
                            mp3Bitrate: sanitizeMp3Bitrate(value),
                          })
                        }
                        sampleRate={exportSettings.sampleRate}
                        onSampleRateChange={(value) =>
                          updateExportSettings({
                            sampleRate: sanitizeAudioSampleRate(value),
                          })
                        }
                        tailMs={exportSettings.tailPaddingMs}
                        onTailMsChange={(value) =>
                          updateExportSettings({ tailPaddingMs: value })
                        }
                      />
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-sky-950">
                        Advanced download settings
                      </h4>
                      <div className="mt-4 grid gap-5 lg:grid-cols-2">
                        <SliderRow
                          label="Paragraph pause"
                          value={exportSettings.paragraphPauseMultiplier}
                          min={1}
                          max={6}
                          step={0.1}
                          unit="x"
                          onChange={(value) =>
                            updateExportSettings({
                              paragraphPauseMultiplier: value,
                            })
                          }
                        />
                        <SliderRow
                          label="Sentence pause"
                          value={exportSettings.sentencePauseMultiplier}
                          min={1}
                          max={4}
                          step={0.1}
                          unit="x"
                          onChange={(value) =>
                            updateExportSettings({
                              sentencePauseMultiplier: value,
                            })
                          }
                        />
                        <LabeledSelect
                          label="Punctuation"
                          value={exportSettings.punctuationMode}
                          onChange={(value) =>
                            updateExportSettings({
                              punctuationMode:
                                value === "preserve" ? "preserve" : "simplify",
                            })
                          }
                        >
                          <option value="preserve">
                            Preserve supported punctuation
                          </option>
                          <option value="simplify">
                            Simplify punctuation for practice
                          </option>
                        </LabeledSelect>
                      </div>
                      <div className="mt-5">
                        <h4 className="text-base font-extrabold text-sky-950">
                          Download extras
                        </h4>
                        <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                          Turn on optional cleaned text, transcript, manifest,
                          settings, or README files only when you need them
                          beside the media.
                        </p>
                      </div>
                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <ExportCheckbox
                          label="Include cleaned text"
                          checked={exportSettings.includeCleanedText}
                          onChange={(value) =>
                            updateExportSettings({ includeCleanedText: value })
                          }
                        />
                        <ExportCheckbox
                          label="Include Morse transcript"
                          checked={exportSettings.includeMorseTranscript}
                          onChange={(value) =>
                            updateExportSettings({
                              includeMorseTranscript: value,
                            })
                          }
                        />
                        <ExportCheckbox
                          label="Include manifest"
                          checked={exportSettings.includeManifest}
                          onChange={(value) =>
                            updateExportSettings({ includeManifest: value })
                          }
                        />
                        <ExportCheckbox
                          label="Include settings"
                          checked={exportSettings.includeSettings}
                          onChange={(value) =>
                            updateExportSettings({ includeSettings: value })
                          }
                        />
                        <ExportCheckbox
                          label="Include README"
                          checked={exportSettings.includeReadme}
                          onChange={(value) =>
                            updateExportSettings({ includeReadme: value })
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <BookVideoSettingsEditor
                    exportSettings={exportSettings}
                    onCharWpmChange={handleCharWpmChange}
                    onFarnsworthWpmChange={(value) =>
                      updateExportSettings({ farnsworthWpm: value })
                    }
                    onPitchChange={(value) =>
                      updateExportSettings({ pitch: value })
                    }
                    onTonePresetChange={handleTonePresetChange}
                    onVideoSettingsChange={updateVideoSettings}
                    onVolumeChange={(value) =>
                      updateExportSettings({ volume: value })
                    }
                    videoSupport={videoSupport}
                    videoSettings={videoSettings}
                  />
                )}
              </div>
            </details>
          </section>

          <section
            id="book-download-controls"
            className="space-y-4 scroll-mt-24 pt-1"
            aria-labelledby="book-download-controls-heading"
          >
            <h3
              id="book-download-controls-heading"
              className="text-base font-extrabold text-sky-950"
            >
              Download MP3
            </h3>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label="Preset" value={exportSettings.presetName} />
              <Metric label="Format" value="MP3" />
              <Metric
                label="Runtime"
                value={
                  hasSource
                    ? formatDuration(exportAnalysis.totalRuntimeMs)
                    : "Waiting"
                }
              />
              <Metric
                label="Parts"
                value={hasSource ? formatNumber(exportParts.length) : "0"}
              />
              <Metric
                label={splitEnabled ? "Target part" : "Split"}
                value={
                  splitEnabled
                    ? formatDuration(exportPlan.targetPartMs)
                    : "Off"
                }
              />
              <Metric
                label="Output size"
                value={`~${exportAnalysis.estimatedSizeLabel}`}
              />
              <Metric label="Render time" value={renderEstimateLabel} />
            </dl>

            {sourceDraftActive ? (
              <p className="mt-4 text-sm font-semibold text-slate-600">
                Draft edits are not included until you apply them.
              </p>
            ) : null}
            {exportDisabledReason ? (
              <p
                id="book-download-disabled-reason"
                className="mt-4 text-sm font-semibold text-slate-600"
              >
                {exportDisabledReason}
              </p>
            ) : null}
            {isAudioOutput ? (
              <MessageList
                title="Download warnings"
                items={exportWarnings}
                tone="warning"
              />
            ) : null}
            {longExportMessages.length > 0 ? (
              <MessageList
                title="Download notes"
                items={longExportMessages}
                tone="info"
              />
            ) : null}

            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-slate-700">
                Split download
              </legend>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Split download"
              >
                {(["none", "duration"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    role="radio"
                    aria-checked={splitMode === mode}
                    onClick={() => updateExportSettings({ splitMode: mode })}
                    className={toolControlButtonClass({
                      active: splitMode === mode,
                      tone: splitMode === mode ? "dark" : "light",
                      size: "sm",
                      rounded: "full",
                      hover: "dark",
                    })}
                  >
                    {BOOK_SPLIT_MODE_LABELS[mode]}
                  </button>
                ))}
              </div>
              <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-slate-600">
                {splitSummaryText}
              </p>
              {splitMode !== "none" ? (
                <LabeledSelect
                  label="Target part length"
                  value={String(splitTargetPartMinutes)}
                  onChange={(value) => {
                    const targetPartMinutes = Number(value);
                    updateExportSettings({ targetPartMinutes });
                  }}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes recommended</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes experimental</option>
                </LabeledSelect>
              ) : null}
            </fieldset>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              {zipBatchWorkflow && totalBatches > 0 ? (
                <LabeledSelect
                  label="ZIP batch"
                  value={String(selectedExportBatch?.batchNumber ?? 1)}
                  disabled={exportRunning}
                  onChange={(value) => setSelectedBatchNumber(Number(value))}
                >
                  {exportBatches.map((batch) => (
                    <option key={batch.batchNumber} value={batch.batchNumber}>
                      Batch {batch.batchNumber} of {batch.totalBatches} -{" "}
                      {formatDuration(batch.runtimeMs)}
                    </option>
                  ))}
                </LabeledSelect>
              ) : null}
              <ToolButton
                type="button"
                tone="dark"
                onClick={handleDownloadBook}
                disabled={!canExport}
                aria-describedby={
                  exportDisabledReason
                    ? "book-download-disabled-reason"
                    : undefined
                }
                className="rounded-xl"
              >
                {exportRunning ? (
                  <span
                    className="h-2.5 w-2.5 animate-pulse rounded-full bg-current"
                    aria-hidden="true"
                  />
                ) : (
                  <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                )}
                {downloadButtonLabel}
              </ToolButton>
              {exportRunning ? (
                <ToolButton
                  type="button"
                  tone="light"
                  hover="dark"
                  onClick={() => cancelActiveExport()}
                  disabled={!exportRunning}
                  className="rounded-xl"
                >
                  <StopIcon size={18} title={undefined} aria-hidden="true" />
                  Cancel download
                </ToolButton>
              ) : null}
            </div>

            {showExportProgress ? (
              <div className="mt-5">
                <progress
                  value={progressPercent}
                  max={100}
                  role="progressbar"
                  aria-label="Book download progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPercent}
                  className="h-2 w-full overflow-hidden rounded-full"
                />
                <StatusMessage
                  kind={
                    exportStatus?.kind ?? (exportRunning ? "working" : "info")
                  }
                  live
                  className="mt-3"
                >
                  {exportProgress.message || exportStatus?.message}
                </StatusMessage>
                <p
                  className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                  data-testid="book-download-progress-detail"
                >
                  {progressPercent > 0 ? `${progressPercent}%` : "Working"} /{" "}
                  {exportProgressDetail(exportProgress, exportElapsedMs)}
                </p>
              </div>
            ) : null}
            {showExportStatus && exportStatus ? (
              <StatusMessage kind={exportStatus.kind} live className="mt-3">
                {exportStatus.message}
              </StatusMessage>
            ) : null}

            {completedExport ? (
              <div className="mt-5">
                <h3 className="text-base font-extrabold text-sky-950">
                  Last download
                </h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="File" value={completedExport.filename} />
                  <Metric
                    label="Format"
                    value={completedExport.outputFormat.toUpperCase()}
                  />
                  <Metric
                    label="Parts"
                    value={completedExport.partCount.toLocaleString()}
                  />
                  <Metric
                    label="Runtime"
                    value={completedExport.runtimeLabel}
                  />
                </dl>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  Download contents: {completedExport.contents.join(", ")}. Use
                  the Download button again to save another copy, change
                  settings to rebuild, or clear the source when you are done.
                </p>
              </div>
            ) : null}
          </section>

          {showSourceState ? (
            <section
              data-testid="book-source-details"
              aria-label="Source details"
            >
              <ToolPanel
                label="Source details"
                badge={sourcePreviewStatus}
              >
                {isUploadedPreviewMode && hasSource && !sourceDraftActive ? (
                  <section
                    className="px-4 pb-4"
                    aria-labelledby="book-source-preview-heading"
                  >
                    <h3
                      id="book-source-preview-heading"
                      className="text-base font-extrabold text-sky-950"
                    >
                      Extracted source preview
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                      Previewing the first{" "}
                      {Math.min(
                        parsedSource.rawText.length,
                        EXTRACTED_SOURCE_PREVIEW_LIMIT,
                      ).toLocaleString()}{" "}
                      characters from the uploaded source.
                    </p>
                    <pre
                      data-testid="book-source-preview"
                      className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-900"
                    >
                      {extractedPreview}
                    </pre>
                    {extractedPreviewTruncated ? (
                      <p className="mt-3 text-sm font-semibold text-slate-600">
                        Preview is truncated. Copy or edit the extracted text to
                        use the full source held in this browser session.
                      </p>
                    ) : null}
                  </section>
                ) : null}

                <section
                  className="px-4 py-4"
                  aria-labelledby="book-source-state-heading"
                  role={status === "error" ? "alert" : undefined}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3
                        id="book-source-state-heading"
                        className="text-base font-extrabold text-sky-950"
                      >
                        {status === "parsing"
                          ? "Reading source file"
                          : status === "error"
                            ? "Source upload failed"
                            : hasSource
                              ? "Source ready"
                              : "Source status"}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {status === "parsing"
                          ? `Extracting text from ${pendingFilename || "the selected file"}.`
                          : status === "error"
                            ? errorMessage
                            : !hasSource
                              ? "Extraction finished, but no source text was found."
                              : sourceDraftActive
                                ? "Draft edits are open. Copy, clear, and download still use the last applied source until edits are applied."
                                : isUploadedPreviewMode
                                  ? "The full extracted source is ready for review and download without rendering the entire file into the page."
                                  : isUploaded
                                    ? "This upload is small enough to edit directly in the source field."
                                    : "This text is editable and ready for review and download."}
                      </p>
                    </div>
                    {isUploaded && parsedSource.filename ? (
                      <span className="max-w-full break-words font-mono text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {parsedSource.filename}
                      </span>
                    ) : null}
                  </div>

                  {status === "ready" ? (
                    <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <Metric
                        label="Source type"
                        value={sourceTypeLabel(parsedSource.sourceType)}
                      />
                      {parsedSource.filename ? (
                        <Metric
                          label="Filename"
                          value={parsedSource.filename}
                        />
                      ) : null}
                      {parsedSource.title ? (
                        <Metric label="Title" value={parsedSource.title} />
                      ) : null}
                      {parsedSource.author ? (
                        <Metric label="Author" value={parsedSource.author} />
                      ) : null}
                      <Metric
                        label="Active chars"
                        value={formatNumber(parsedSource.rawText.length)}
                      />
                      <Metric
                        label="Active words"
                        value={formatNumber(extractedWordCount)}
                      />
                      <Metric
                        label="Preview status"
                        value={sourcePreviewStatus}
                      />
                      <Metric
                        label="Cleaned output"
                        value={`${formatNumber(preflight.characterCount)} chars`}
                      />
                    </dl>
                  ) : null}

                  {sourceEntryMode === "uploaded-textarea" && hasSource ? (
                    <p className="mt-4 text-sm leading-relaxed text-slate-700">
                      The extracted TXT/MD content is loaded into the editable
                      source field above.
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        void copySourceValue(
                          "Extracted text",
                          parsedSource.rawText,
                        )
                      }
                      disabled={!parsedSource.rawText.trim()}
                      className={toolControlButtonClass({
                        size: "sm",
                        disabled: !parsedSource.rawText.trim(),
                      })}
                    >
                      <CopyIcon
                        size={16}
                        title={undefined}
                        aria-hidden="true"
                      />
                      Copy extracted text
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void copySourceValue(
                          "Cleaned text",
                          preflight.cleanedText,
                        )
                      }
                      disabled={!preflight.cleanedText.trim()}
                      className={toolControlButtonClass({
                        size: "sm",
                        disabled: !preflight.cleanedText.trim(),
                      })}
                    >
                      <CopyIcon
                        size={16}
                        title={undefined}
                        aria-hidden="true"
                      />
                      Copy cleaned text
                    </button>
                    {sourceDraftActive ? (
                      <>
                        <button
                          type="button"
                          onClick={applyExtractedTextDraft}
                          className={toolControlButtonClass({
                            size: "sm",
                            tone: "dark",
                          })}
                        >
                          Apply edits
                        </button>
                        <button
                          type="button"
                          onClick={cancelExtractedTextDraft}
                          className={toolControlButtonClass({
                            size: "sm",
                            tone: "light",
                            hover: "dark",
                          })}
                        >
                          Cancel edits
                        </button>
                      </>
                    ) : isUploadedPreviewMode ? (
                      <button
                        type="button"
                        onClick={editExtractedText}
                        disabled={!parsedSource.rawText.trim()}
                        className={toolControlButtonClass({
                          size: "sm",
                          disabled: !parsedSource.rawText.trim(),
                        })}
                      >
                        Edit extracted text
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={clearSource}
                      disabled={!canClearSource}
                      className={toolControlButtonClass({
                        size: "sm",
                        disabled: !canClearSource,
                      })}
                    >
                      <TrashIcon
                        size={16}
                        title={undefined}
                        aria-hidden="true"
                      />
                      Clear source
                    </button>
                  </div>

                  {sourceActionStatus ? (
                    <StatusMessage
                      kind={sourceActionStatus.kind}
                      className="mt-3"
                    >
                      {sourceActionStatus.message}
                    </StatusMessage>
                  ) : null}
                </section>
              </ToolPanel>
            </section>
          ) : null}
        </div>

        {status === "parsing" ? (
          <div
            role="status"
            className="rounded-xl bg-[#fffdf8] p-4 text-sm font-semibold text-slate-700"
          >
            Parsing source locally in your browser...
          </div>
        ) : null}
        <MessageList
          title="Source warnings"
          items={sourceWarnings}
          tone="warning"
        />

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-sky-950">
              <SparklesIcon size={20} title={undefined} aria-hidden="true" />
              Source cleanup
            </h2>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Before download
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(Object.keys(cleanupOptions) as Array<keyof CleanupOptions>).map(
              (key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-slate-800"
                >
                  <input
                    type="checkbox"
                    checked={cleanupOptions[key]}
                    onChange={() => toggleCleanup(key)}
                    className="mt-1 h-4 w-4 accent-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  />
                  <span>{cleanupLabel(key)}</span>
                </label>
              ),
            )}
          </div>
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-sky-950">
                  Custom cleanup rules
                </h3>
                <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                  Plain text rules apply top to bottom before preview,
                  estimates, splitting, transcripts, and downloads.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addCustomCleanupRule}
                  className={toolControlButtonClass({
                    size: "sm",
                    tone: "dark",
                  })}
                >
                  Add cleanup rule
                </button>
                <button
                  type="button"
                  onClick={clearCustomCleanupRules}
                  disabled={customCleanupRules.length === 0}
                  className={toolControlButtonClass({
                    size: "sm",
                    disabled: customCleanupRules.length === 0,
                  })}
                >
                  Clear custom rules
                </button>
              </div>
            </div>

            {customCleanupRules.length === 0 ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Add a rule to remove boilerplate, replace recurring phrases, or
                simplify source-specific text without changing the original
                upload.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {customCleanupRules.map((rule, index) => {
                  const match = customRuleMatchesById.get(rule.id);
                  const matchLabel = !rule.enabled
                    ? "Disabled"
                    : rule.find.trim().length === 0
                      ? "Add find text"
                      : `${formatNumber(match?.count ?? 0)} match${
                          (match?.count ?? 0) === 1 ? "" : "es"
                        }`;
                  const findId = `${rule.id}-find`;
                  const replacementId = `${rule.id}-replacement`;
                  return (
                    <div
                      key={rule.id}
                      className="pt-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          Rule {index + 1} - {matchLabel}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moveCustomCleanupRule(rule.id, -1)}
                            disabled={index === 0}
                            aria-label={`Move cleanup rule ${index + 1} up`}
                            className={toolControlButtonClass({
                              size: "sm",
                              disabled: index === 0,
                            })}
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCustomCleanupRule(rule.id, 1)}
                            disabled={index === customCleanupRules.length - 1}
                            aria-label={`Move cleanup rule ${index + 1} down`}
                            className={toolControlButtonClass({
                              size: "sm",
                              disabled: index === customCleanupRules.length - 1,
                            })}
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomCleanupRule(rule.id)}
                            aria-label={`Delete cleanup rule ${index + 1}`}
                            className={toolControlButtonClass({ size: "sm" })}
                          >
                            <TrashIcon
                              size={16}
                              title={undefined}
                              aria-hidden="true"
                            />
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <div>
                          <label
                            htmlFor={findId}
                            className="text-sm font-semibold text-slate-700"
                          >
                            Find text
                          </label>
                          <input
                            id={findId}
                            value={rule.find}
                            onChange={(event) =>
                              updateCustomCleanupRule(rule.id, {
                                find: event.target.value,
                              })
                            }
                            className="mt-2 w-full rounded-lg bg-[#fffaf2] px-3 py-2 font-mono text-sm text-slate-950 focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={replacementId}
                            className="text-sm font-semibold text-slate-700"
                          >
                            Replacement text
                          </label>
                          <input
                            id={replacementId}
                            value={rule.replacement}
                            onChange={(event) =>
                              updateCustomCleanupRule(rule.id, {
                                replacement: event.target.value,
                              })
                            }
                            placeholder="Leave empty to remove matches"
                            className="mt-2 w-full rounded-lg bg-[#fffaf2] px-3 py-2 font-mono text-sm text-slate-950 focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4">
                        <label className="flex cursor-pointer items-start gap-2 text-sm font-semibold text-slate-800">
                          <input
                            type="checkbox"
                            checked={rule.enabled}
                            onChange={(event) =>
                              updateCustomCleanupRule(rule.id, {
                                enabled: event.target.checked,
                              })
                            }
                            className="mt-1 h-4 w-4 accent-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                          />
                          <span>Enabled</span>
                        </label>
                        <label className="flex cursor-pointer items-start gap-2 text-sm font-semibold text-slate-800">
                          <input
                            type="checkbox"
                            checked={rule.caseSensitive}
                            onChange={(event) =>
                              updateCustomCleanupRule(rule.id, {
                                caseSensitive: event.target.checked,
                              })
                            }
                            className="mt-1 h-4 w-4 accent-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                          />
                          <span>Case-sensitive</span>
                        </label>
                        <label className="flex cursor-pointer items-start gap-2 text-sm font-semibold text-slate-800">
                          <input
                            type="checkbox"
                            checked={rule.wholeWord}
                            onChange={(event) =>
                              updateCustomCleanupRule(rule.id, {
                                wholeWord: event.target.checked,
                              })
                            }
                            className="mt-1 h-4 w-4 accent-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                          />
                          <span>Whole word</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.65fr)]">
        <section
          className="space-y-5"
          aria-labelledby="book-details-previews-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="book-details-previews-heading"
              className="flex items-center gap-2 text-xl font-extrabold text-sky-950"
            >
              <ChecklistIcon size={20} title={undefined} aria-hidden="true" />
              Details and previews
            </h2>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {status === "ready"
                ? "Ready"
                : status === "parsing"
                  ? "Parsing"
                  : "Preview"}
            </span>
          </div>

          {hasSource ? (
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric
                label="Source type"
                value={sourceTypeLabel(preflight.sourceType)}
              />
              <Metric label="Words" value={formatNumber(preflight.wordCount)} />
              <Metric
                label="Characters"
                value={formatNumber(preflight.characterCount)}
              />
              <Metric
                label="Runtime"
                value={formatDuration(exportAnalysis.totalRuntimeMs)}
              />
              <Metric label="Parts" value={formatNumber(exportParts.length)} />
              <Metric
                label={isSegmentedOutput ? "Target part" : "Split"}
                value={
                  isSegmentedOutput
                    ? formatDuration(exportPlan.targetPartMs)
                    : "Off"
                }
              />
              <Metric
                label="Output size"
                value={`~${exportAnalysis.estimatedSizeLabel}`}
              />
              <Metric label="Format" value={exportSettings.outputFormat.toUpperCase()} />
              <Metric label="Preset" value={exportSettings.presetName} />
              <Metric
                label="Unsupported"
                value={formatNumber(preflight.unsupportedCount)}
              />
              {preflight.pageCount ? (
                <Metric
                  label="PDF pages"
                  value={formatNumber(preflight.pageCount)}
                />
              ) : null}
              {preflight.sectionCount ? (
                <Metric
                  label={
                    preflight.sourceType === "epub"
                      ? "EPUB sections"
                      : preflight.sourceType === "pdf"
                        ? "PDF sections"
                        : "Source sections"
                  }
                  value={formatNumber(preflight.sectionCount)}
                />
              ) : null}
              {preflight.title ? (
                <Metric label="Title" value={preflight.title} />
              ) : null}
              {preflight.author ? (
                <Metric label="Author" value={preflight.author} />
              ) : null}
            </dl>
          ) : (
            <EmptyPreview>
              Paste text or upload TXT, MD, EPUB, or text-native PDF to see word
              counts, runtime, download shape, unsupported characters, and Morse
              previews before download.
            </EmptyPreview>
          )}

          {preflight.unsupportedCharacters.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm font-extrabold text-sky-950">
                Top unsupported characters
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {preflight.unsupportedCharacters.map((item) => (
                  <span
                    key={item.character}
                    className="font-mono text-sm font-bold text-slate-800"
                  >
                    {item.character === " " ? "space" : item.character} x
                    {item.count}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {exportAnalysis.unsupportedImpact}
              </p>
            </div>
          ) : null}
        </section>

        <div className="space-y-4">
          <section className="space-y-2">
            <h2 className="text-base font-extrabold text-sky-950">
              Source guidance
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              TXT and EPUB usually produce the cleanest long-form Morse source.
              PDF extraction is best effort for selectable text; scanned PDFs
              are not supported because this tool does not include OCR.
            </p>
          </section>
        </div>
      </div>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-sky-950">
            {isSegmentedOutput ? "Split summary" : "Audio file summary"}
          </h2>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {isSegmentedOutput
              ? `${exportParts.length} part${exportParts.length === 1 ? "" : "s"}`
              : "Single file"}
          </span>
        </div>
        <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-slate-700">
          {isSegmentedOutput
            ? exportPlan.automaticSplit
              ? "Long selections are prepared as ordered duration-based parts, grouped into ZIP batches, using clean text boundaries where possible."
              : "Parts are based on the target part length and safe paragraph, sentence, or word boundaries."
            : "MP3 downloads stay as one file by default. Choose a split mode in the Download MP3 section when you want timed parts."}
        </p>
        {isSegmentedOutput ? (
          exportParts.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {exportParts.slice(0, 6).map((part) => (
                <div
                  key={`${part.index}-${part.sourceStart}`}
                  className="pt-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-sky-950">
                      {part.title}
                    </h3>
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      {formatDuration(part.morseDurationMs)}
                    </span>
                  </div>
                  <p className="mt-2 break-words font-mono text-xs font-bold text-slate-600">
                    {part.estimatedFilename}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {part.cleanedExcerpt}
                  </p>
                </div>
              ))}
              {exportParts.length > 6 ? (
                <p className="text-sm font-semibold text-slate-600">
                  Showing first 6 parts. The ZIP download includes all{" "}
                  {exportParts.length.toLocaleString()} parts.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-3">
              <EmptyPreview>
                Part splitting appears after source text is available.
              </EmptyPreview>
            </div>
          )
        ) : null}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <ToolPanel label="Cleaned text preview" badge="Excerpt">
          {preflight.cleanedPreview ? (
            <pre className="max-h-80 min-h-[12rem] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-slate-900">
              {preflight.cleanedPreview}
            </pre>
          ) : (
            <div className="p-4">
              <EmptyPreview>
                Cleaned text will appear here after input.
              </EmptyPreview>
            </div>
          )}
        </ToolPanel>

        <ToolOutputPanel label="Morse preview" badge="Excerpt">
          {preflight.morsePreview ? (
            <pre className="max-h-80 min-h-[12rem] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-sky-100">
              {preflight.morsePreview}
            </pre>
          ) : (
            <div className="p-4">
              <p className="text-sm leading-relaxed text-slate-300">
                Morse preview appears here after cleaned source text is
                available.
              </p>
            </div>
          )}
        </ToolOutputPanel>
      </div>
    </section>
  );
}

function BookPreviewSection({
  activeSegmentIndex,
  audioPreviewElapsedMs,
  audioPlayerState,
  audioPreview,
  audioSupported,
  exportSettings,
  hasCleanedSource,
  hasSource,
  isDraftActive,
  livePreviewSegments,
  onPreviewSegmentChange,
  onPlayAudioPreview,
  onPlayVisualPreview,
  onScrubAudioPreview,
  onScrubVisualPreview,
  onSeekAudioPreview,
  onSeekVisualPreview,
  onStopPreview,
  outputType,
  previewErrorMessage,
  previewStatus,
  resolvedVideoBackgroundStyle,
  videoPreview,
  videoSettings,
  visualPreviewDurationMs,
  visualPreviewElapsedMs,
  visualPreviewPlaying,
}: {
  activeSegmentIndex: number;
  audioPreviewElapsedMs: number;
  audioPlayerState: MorsePlayerState;
  audioPreview: BookAudioPreview | null;
  audioSupported: boolean;
  exportSettings: BookExportSettings;
  hasCleanedSource: boolean;
  hasSource: boolean;
  isDraftActive: boolean;
  livePreviewSegments: BookExportPart[];
  onPreviewSegmentChange: (segmentIndex: number) => void;
  onPlayAudioPreview: () => void;
  onPlayVisualPreview: (elapsedMs?: number) => void;
  onScrubAudioPreview: (elapsedMs: number) => void;
  onScrubVisualPreview: (elapsedMs: number) => void;
  onSeekAudioPreview: (elapsedMs: number) => void;
  onSeekVisualPreview: (elapsedMs: number) => void;
  onStopPreview: () => void;
  outputType: BookOutputType;
  previewErrorMessage: string;
  previewStatus: BookPreviewStatus;
  resolvedVideoBackgroundStyle: "warm-morsewords" | "dark-morsewords";
  videoPreview: BookVideoPreview;
  videoSettings: BookVideoSettings;
  visualPreviewDurationMs: number;
  visualPreviewElapsedMs: number;
  visualPreviewPlaying: boolean;
}) {
  const isAudioOutput = outputType === "audio";
  const canPreview = hasSource && hasCleanedSource && Boolean(audioPreview);
  const previewPlaying =
    previewStatus === "playing" &&
    (isAudioOutput
      ? audioPlayerState === "playing" || audioPlayerState === "paused"
      : visualPreviewPlaying);
  const visualPlayerPlaying = visualPreviewPlaying;
  const actionDisabled = !canPreview || (isAudioOutput && !audioSupported);
  const previewElapsedMs = Math.min(
    visualPreviewDurationMs,
    Math.max(0, visualPreviewElapsedMs),
  );
  const audioElapsedMs = Math.min(
    audioPreview?.durationMs ?? 0,
    Math.max(0, audioPreviewElapsedMs),
  );
  const statusText = previewErrorMessage
    ? previewErrorMessage
    : previewStatusText({
        audioSupported,
        canPreview,
        hasCleanedSource,
        hasSource,
        isAudioOutput,
        previewStatus,
      });

  return (
    <section
      className="mt-5"
      aria-label="Live Morse preview"
      data-testid="book-preview-section"
    >
      {isAudioOutput ? (
        <div data-testid="book-audio-preview">
          <div className="flex flex-wrap gap-2">
            <ToolButton
              type="button"
              tone={previewPlaying ? "light" : "dark"}
              hover={previewPlaying ? "dark" : undefined}
              onClick={previewPlaying ? onStopPreview : onPlayAudioPreview}
              disabled={actionDisabled && !previewPlaying}
              className="rounded-xl"
            >
              {previewPlaying ? (
                <StopIcon size={18} title={undefined} aria-hidden="true" />
              ) : (
                <PlayIcon size={18} title={undefined} aria-hidden="true" />
              )}
              {previewPlaying ? "Stop preview" : "Play preview"}
            </ToolButton>
            <a
              href="#book-download-controls"
              className={toolControlButtonClass({
                tone: "light",
                hover: "dark",
                rounded: "xl",
              })}
              data-testid="book-preview-download-mp3-link"
            >
              <DownloadIcon size={18} title={undefined} aria-hidden="true" />
              Download MP3
            </a>
          </div>
          {audioPreview ? (
            <MorseAudioTimingStrip
              disabled={actionDisabled && !previewPlaying}
              elapsedMs={audioElapsedMs}
              formatTime={formatDuration}
              onSeek={onScrubAudioPreview}
              onSeekCommit={onSeekAudioPreview}
              preview={audioPreview}
            />
          ) : null}
        </div>
      ) : (
        <div data-testid="book-live-player-workflow">
          <MorseVideoPreviewPanel
            headingId="book-video-preview-heading"
            headingText="Live Morse frame"
            isPlaying={visualPreviewPlaying}
            preview={videoPreview}
            resolvedBackgroundStyle={resolvedVideoBackgroundStyle}
            settings={videoSettings}
            testIdPrefix="book-video-preview"
            visualElapsedMs={visualPreviewElapsedMs}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <ToolButton
              type="button"
              tone={visualPlayerPlaying ? "light" : "dark"}
              hover={visualPlayerPlaying ? "dark" : undefined}
              onClick={
                visualPlayerPlaying
                  ? onStopPreview
                  : () => onPlayVisualPreview()
              }
              disabled={actionDisabled && !visualPlayerPlaying}
              className="rounded-xl"
            >
              {visualPlayerPlaying ? (
                <StopIcon size={18} title={undefined} aria-hidden="true" />
              ) : (
                <PlayIcon size={18} title={undefined} aria-hidden="true" />
              )}
              {visualPlayerPlaying ? "Stop live player" : "Play live player"}
            </ToolButton>
            {visualPlayerPlaying ? (
              <ToolButton
                type="button"
                tone="light"
                hover="dark"
                onClick={() => onPlayVisualPreview(0)}
                disabled={actionDisabled}
                className="rounded-xl"
              >
                <RefreshIcon size={18} title={undefined} aria-hidden="true" />
                Restart live player
              </ToolButton>
            ) : null}
            <a
              href="#book-download-controls"
              className={toolControlButtonClass({
                tone: "light",
                hover: "dark",
                rounded: "xl",
              })}
              data-testid="book-preview-download-mp3-link"
            >
              <DownloadIcon size={18} title={undefined} aria-hidden="true" />
              Download MP3
            </a>
            <MorseLivePreviewFullscreenControl
              disabled={actionDisabled}
              elapsedMs={previewElapsedMs}
              headingText="Fullscreen live Morse preview"
              isPlaying={visualPreviewPlaying}
              onPlay={onPlayVisualPreview}
              onRestart={() => onPlayVisualPreview(0)}
              onSeek={onScrubVisualPreview}
              onSeekCommit={onSeekVisualPreview}
              onStop={onStopPreview}
              preview={videoPreview}
              resolvedBackgroundStyle={resolvedVideoBackgroundStyle}
              segmentControl={
                livePreviewSegments.length > 1 ? (
                  <label className="min-w-[12rem] text-sm font-semibold text-slate-100">
                    Segment
                    <select
                      value={activeSegmentIndex}
                      onChange={(event) =>
                        onPreviewSegmentChange(Number(event.target.value))
                      }
                      className="ml-0 mt-2 w-full rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-950 hover:bg-white focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:ml-2 sm:mt-0 sm:w-auto"
                      data-testid="book-live-preview-fullscreen-segment-select"
                    >
                      {livePreviewSegments.map((segment, index) => (
                        <option key={segment.index} value={index}>
                          Segment {index + 1} of {livePreviewSegments.length}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null
              }
              settings={videoSettings}
              testIdPrefix="book-video-preview"
              timelineAriaLabel="Fullscreen live player timeline"
            />
            {livePreviewSegments.length > 1 ? (
              <label className="min-w-[12rem] text-sm font-semibold text-slate-700">
                Segment
                <select
                  value={activeSegmentIndex}
                  onChange={(event) =>
                    onPreviewSegmentChange(Number(event.target.value))
                  }
                  className="ml-0 mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:ml-2 sm:mt-0 sm:w-auto"
                  data-testid="book-live-preview-segment-select"
                >
                  {livePreviewSegments.map((segment, index) => (
                    <option key={segment.index} value={index}>
                      Segment {index + 1} of {livePreviewSegments.length}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
          <MorseVideoPreviewTimeline
            ariaLabel="Live player timeline"
            disabled={actionDisabled && !visualPlayerPlaying}
            elapsedMs={previewElapsedMs}
            onSeek={onScrubVisualPreview}
            onSeekCommit={onSeekVisualPreview}
            preview={videoPreview}
            testIdPrefix="book-video-preview"
          />
        </div>
      )}

      <details className="mt-4">
        <summary className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-extrabold text-sky-950 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
          <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
          Player details
        </summary>
        <div className="mt-4 space-y-4">
          {isDraftActive ? (
            <p className="text-sm font-semibold text-slate-600">
              Draft edits are not previewed until you apply them.
            </p>
          ) : null}
          <p
            data-testid="book-preview-status"
            role="status"
            aria-live="polite"
            className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
          >
            {statusText}
          </p>
          {audioPreview ? (
            <p
              data-testid="book-preview-sample"
              className="max-w-[68ch] break-words font-mono text-sm leading-relaxed text-slate-700"
            >
              {previewSampleForDisplay(audioPreview.sampleText)}
            </p>
          ) : null}
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Segment"
              value={`${Math.min(
                activeSegmentIndex + 1,
                Math.max(1, livePreviewSegments.length),
              )} of ${Math.max(1, livePreviewSegments.length)}`}
            />
            <Metric
              label="Tone"
              value={tonePresetLabel(exportSettings.tonePreset)}
            />
            <Metric
              label="Speed"
              value={`${exportSettings.charWpm}/${exportSettings.farnsworthWpm} WPM`}
            />
            <Metric label="Pitch" value={`${exportSettings.pitch} Hz`} />
            <Metric
              label="Volume"
              value={`${Math.round(exportSettings.volume * 100)}%`}
            />
            <Metric
              label="Visual signal"
              value={
                videoSettings.showVisualSignal
                  ? BOOK_VIDEO_VISUAL_STYLE_DETAILS[videoSettings.visualStyle].label
                  : "Off"
              }
            />
            <Metric
              label="Morse symbols"
              value={videoSettings.showMorseSymbols ? "On" : "Off"}
            />
            <Metric
              label="Plain text"
              value={videoSettings.showPlainText ? "On" : "Off"}
            />
            <Metric
              label="Audio"
              value={videoSettings.includeAudioTrack ? "On" : "Off"}
            />
          </dl>
        </div>
      </details>
    </section>
  );
}

function previewStatusText({
  audioSupported,
  canPreview,
  hasCleanedSource,
  hasSource,
  isAudioOutput,
  previewStatus,
}: {
  audioSupported: boolean;
  canPreview: boolean;
  hasCleanedSource: boolean;
  hasSource: boolean;
  isAudioOutput: boolean;
  previewStatus: BookPreviewStatus;
}) {
  if (!hasSource) return "Waiting for source";
  if (!hasCleanedSource) return "Unavailable";
  if (isAudioOutput && !audioSupported) return "Unavailable";
  if (!canPreview) return "Unavailable";
  if (previewStatus === "updating") return "Updating preview";
  if (previewStatus === "playing") return "Playing";
  if (previewStatus === "stopped") return "Stopped";
  if (previewStatus === "failed") return "Failed";
  return "Ready";
}

function previewSampleForDisplay(sampleText: string) {
  if (sampleText.length <= 420) return sampleText;
  return `${sampleText.slice(0, 417).trimEnd()}...`;
}

function BookVideoSettingsEditor({
  exportSettings,
  onCharWpmChange,
  onFarnsworthWpmChange,
  onPitchChange,
  onTonePresetChange,
  onVideoSettingsChange,
  onVolumeChange,
  videoSupport,
  videoSettings,
}: {
  exportSettings: BookExportSettings;
  onCharWpmChange: (value: number) => void;
  onFarnsworthWpmChange: (value: number) => void;
  onPitchChange: (value: number) => void;
  onTonePresetChange: (value: AudioTonePresetId) => void;
  onVideoSettingsChange: (patch: Partial<BookVideoSettings>) => void;
  onVolumeChange: (value: number) => void;
  videoSupport: BookVideoSupport | null;
  videoSettings: BookVideoSettings;
}) {
  const audioTrackAvailable = Boolean(videoSupport?.audioTrackSupported);
  const visibleLayerCount =
    (videoSettings.showVisualSignal ? 1 : 0) +
    (videoSettings.showMorseSymbols ? 1 : 0) +
    (videoSettings.showPlainText ? 1 : 0);

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-base font-extrabold text-sky-950">
          Live player settings
        </h4>
        <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
          Visual style controls the flashing Morse signal in the live player.
          Text layers control the on-screen overlays only.
        </p>
      </div>

      <fieldset>
        <legend className="text-base font-extrabold text-sky-950">
          Visual style
        </legend>
        <div
          className="mt-3 grid gap-2 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Live player visual style"
        >
          {BOOK_LIVE_PLAYER_VISUAL_STYLES.map((style) => {
            const details = BOOK_VIDEO_VISUAL_STYLE_DETAILS[style];
            const active = videoSettings.visualStyle === style;
            return (
              <button
                key={style}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() =>
                  onVideoSettingsChange({
                    visualStyle: style,
                  })
                }
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
      </fieldset>

      <fieldset>
        <legend className="text-base font-extrabold text-sky-950">
          Live player layers
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <ExportCheckbox
            label="Show visual signal"
            checked={videoSettings.showVisualSignal}
            disabled={videoSettings.showVisualSignal && visibleLayerCount <= 1}
            onChange={(value) =>
              onVideoSettingsChange({
                showVisualSignal: value,
              })
            }
          />
          <ExportCheckbox
            label="Show Morse symbols"
            checked={videoSettings.showMorseSymbols}
            disabled={videoSettings.showMorseSymbols && visibleLayerCount <= 1}
            onChange={(value) =>
              onVideoSettingsChange({
                showMorseSymbols: value,
              })
            }
          />
          <ExportCheckbox
            label="Show plain text"
            checked={videoSettings.showPlainText}
            disabled={videoSettings.showPlainText && visibleLayerCount <= 1}
            onChange={(value) =>
              onVideoSettingsChange({
                showPlainText: value,
              })
            }
          />
        </div>
        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-slate-600">
          Visual signal controls the flashing animation. Morse symbols and
          plain text are separate timed overlays for the same playback segment.
        </p>
      </fieldset>

      <fieldset>
        <legend className="text-base font-extrabold text-sky-950">
          Visual intensity
        </legend>
        <div
          className="mt-2 flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Live player visual intensity"
        >
          {BOOK_VIDEO_INTENSITIES.map((intensity) => (
            <VideoSettingButton
              key={intensity}
              active={videoSettings.intensity === intensity}
              label={BOOK_VIDEO_INTENSITY_LABELS[intensity]}
              onClick={() =>
                onVideoSettingsChange({
                  intensity,
                })
              }
            />
          ))}
        </div>
      </fieldset>

      <div>
        <h4 className="text-base font-extrabold text-sky-950">Player options</h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ExportCheckbox
            label="Audio"
            checked={videoSettings.includeAudioTrack && audioTrackAvailable}
            disabled={!audioTrackAvailable}
            onChange={(value) =>
              onVideoSettingsChange({
                includeAudioTrack: value,
              })
            }
          />
        </div>
        {!audioTrackAvailable ? (
          <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-slate-600">
            {videoSupport?.audioTrackReason ??
              "Checking live audio support."}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h4 className="text-base font-extrabold text-sky-950">
              Timing and audio track
            </h4>
            <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
              Character speed and Farnsworth spacing use the same Morse timing
              layer as MP3 export. Tone controls apply when live audio is on.
            </p>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {videoSettings.includeAudioTrack && audioTrackAvailable
              ? tonePresetLabel(exportSettings.tonePreset)
              : "Silent live player"}
          </span>
        </div>
        <AudioSettingsPanel
          className="mt-5"
          context="bookExport"
          disabledSound={
            !videoSettings.includeAudioTrack || !audioTrackAvailable
          }
          idPrefix="book-download-video-audio"
          preset={exportSettings.tonePreset}
          onPresetChange={onTonePresetChange}
          charWpm={exportSettings.charWpm}
          onCharWpmChange={onCharWpmChange}
          farnsworthWpm={exportSettings.farnsworthWpm}
          onFarnsworthWpmChange={onFarnsworthWpmChange}
          pitch={exportSettings.pitch}
          onPitchChange={onPitchChange}
          volume={exportSettings.volume}
          onVolumeChange={onVolumeChange}
        />
      </div>
    </div>
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

function LabeledSelect({
  children,
  disabled,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
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
        onChange={(event) => onChange(event.target.value)}
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

function ExportCheckbox({
  checked,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 text-sm font-semibold ${
        disabled
          ? "cursor-not-allowed text-slate-400"
          : "cursor-pointer text-slate-800"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      />
      <span>{label}</span>
    </label>
  );
}

function tonePresetLabel(value: string) {
  return getAudioPresetLabel(value);
}
