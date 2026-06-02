import * as React from "react";

import {
  ChecklistIcon,
  CopyIcon,
  DownloadIcon,
  EqualizerIcon,
  LightBulbIcon,
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
  formatDuration,
} from "./bookDurationEstimate";
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
  loadBookExportPreferences,
  saveBookExportPreferences,
} from "./bookExportPreferences";
import type {
  BookExportPart,
  BookExportPresetName,
  BookExportProgress,
  BookExportResultSummary,
  BookExportSettings,
  BookOutputType,
} from "./bookExportTypes";
import { segmentBookText } from "./bookSegmentation";
import {
  DEFAULT_CLEANUP_OPTIONS,
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
import {
  buildBookVideoPreview,
  type BookVideoPreview,
} from "./bookVideoPreview";
import {
  BOOK_VIDEO_INTENSITY_LABELS,
  BOOK_VIDEO_RESOLUTION_LABELS,
  BOOK_VIDEO_VISUAL_STYLE_DETAILS,
} from "./bookVideoPresets";
import {
  BOOK_VIDEO_INTENSITIES,
  BOOK_VIDEO_RESOLUTIONS,
  BOOK_VIDEO_VISUAL_STYLES,
  DEFAULT_BOOK_VIDEO_SETTINGS,
  sanitizeBookVideoSettings,
  type BookVideoSettings,
} from "./bookVideoTypes";

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

const IDLE_EXPORT_PROGRESS: BookExportProgress = {
  phase: "idle",
  message: "Choose download settings, then download audio.",
  currentPart: 0,
  totalParts: 0,
};

const VIDEO_IDLE_EXPORT_PROGRESS: BookExportProgress = {
  phase: "idle",
  message: "",
  currentPart: 0,
  totalParts: 0,
};

const FULL_FRAME_FLASH_WARNING =
  "Full-frame flash mode can create rapid full-frame flashing in the finished video and may be uncomfortable or unsafe for some viewers. Use Lightbulb or Dot for a smaller flash area.";

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
        role="button"
        tabIndex={0}
        aria-label={hasSource ? "Replace book source file" : "Upload a book source file"}
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

export default function BookTranslatorTool() {
  const [sourceText, setSourceText] = React.useState("");
  const [parsedSource, setParsedSource] = React.useState<ParsedBookSource>(() =>
    createEmptyParsedSource(),
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
  const [outputType, setOutputType] =
    React.useState<BookOutputType>("audio");
  const [exportSettings, setExportSettings] =
    React.useState<BookExportSettings>(DEFAULT_BOOK_EXPORT_SETTINGS);
  const [videoSettings, setVideoSettings] =
    React.useState<BookVideoSettings>(DEFAULT_BOOK_VIDEO_SETTINGS);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [status, setStatus] = React.useState<ParseStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [pendingFilename, setPendingFilename] = React.useState("");
  const [sourceActionStatus, setSourceActionStatus] = React.useState<{
    kind: ExportStatusKind;
    message: string;
  } | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [exportProgress, setExportProgress] =
    React.useState<BookExportProgress>(IDLE_EXPORT_PROGRESS);
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
  const mountedRef = React.useRef(true);
  const customCleanupRuleIdRef = React.useRef(1);

  const cancelActiveExport = React.useCallback(
    (message = "Download cancelled.") => {
      exportVersionRef.current += 1;
      exportAbortRef.current?.abort();
      exportAbortRef.current = null;
      setExportProgress({
        phase: "cancelled",
        message,
        currentPart: 0,
        totalParts: 0,
      });
      setExportStatus({ kind: "info", message });
    },
    [],
  );

  React.useEffect(() => {
    const preferences = loadBookExportPreferences();
    setOutputType(preferences.outputType);
    setExportSettings(preferences.exportSettings);
    setVideoSettings(preferences.videoSettings);
    setExportProgress(
      preferences.outputType === "video"
        ? VIDEO_IDLE_EXPORT_PROGRESS
        : IDLE_EXPORT_PROGRESS,
    );
    setAdvancedOpen(preferences.advancedOpen);
    setPreferencesLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!preferencesLoaded) return;
    saveBookExportPreferences({
      outputType,
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
    return () => {
      mountedRef.current = false;
      parseVersionRef.current += 1;
      exportVersionRef.current += 1;
      exportAbortRef.current?.abort();
    };
  }, []);

  const effectiveCleanupOptions = React.useMemo<CleanupOptions>(
    () => ({
      ...cleanupOptions,
      simplifyPunctuation:
        cleanupOptions.simplifyPunctuation ||
        exportSettings.punctuationMode === "simplify",
    }),
    [cleanupOptions, exportSettings.punctuationMode],
  );

  const preflight = React.useMemo<PreflightSummary>(() => {
    return buildPreflightSummary(
      parsedSource,
      effectiveCleanupOptions,
      customCleanupRules,
    );
  }, [customCleanupRules, effectiveCleanupOptions, parsedSource]);

  const sourceSections = React.useMemo(
    () =>
      buildCleanedSourceSections(
        parsedSource,
        effectiveCleanupOptions,
        customCleanupRules,
      ),
    [customCleanupRules, effectiveCleanupOptions, parsedSource],
  );

  const activeSegmentationSettings = React.useMemo<BookExportSettings>(() => {
    if (outputType === "audio") return exportSettings;
    return sanitizeBookExportSettings({
      ...exportSettings,
      splitAudio: true,
      targetPartMinutes: videoSettings.targetPartMinutes,
    });
  }, [exportSettings, outputType, videoSettings.targetPartMinutes]);

  const exportParts = React.useMemo<BookExportPart[]>(() => {
    return segmentBookText({
      cleanedText: preflight.cleanedText,
      settings: activeSegmentationSettings,
      sourceSections,
      sourceTitle: preflight.title || preflight.filename,
    });
  }, [
    activeSegmentationSettings,
    preflight.cleanedText,
    preflight.filename,
    preflight.title,
    sourceSections,
  ]);

  const exportAnalysis = React.useMemo(
    () =>
      buildExportAnalysis({
        preflight,
        settings: activeSegmentationSettings,
        partCount: exportParts.length,
      }),
    [activeSegmentationSettings, exportParts.length, preflight],
  );

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
  const isAudioOutput = outputType === "audio";
  const isVideoOutput = outputType === "video";
  const isSegmentedOutput = isVideoOutput || exportSettings.splitAudio;
  const appliedThemeMode = useAppliedThemeMode();
  const resolvedVideoBackgroundStyle =
    resolveBookVideoBackgroundStyle(appliedThemeMode);
  const videoPreview = React.useMemo(
    () => buildBookVideoPreview(videoSettings, preflight.cleanedText),
    [preflight.cleanedText, videoSettings],
  );
  const canAudioExport = hasSource && exportParts.length > 0 && !exportRunning;
  const canExport = isAudioOutput && canAudioExport;
  const exportDisabledReason = isVideoOutput
    ? ""
    : !hasSource
      ? "Add source text or upload a source file to enable download."
      : !hasCleanedSource
        ? "Cleaned source is empty. Adjust source cleanup or add downloadable text."
        : exportParts.length === 0
          ? "Review the source text before downloading."
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
    isAudioOutput && hasSource && exportParts.length > 0
      ? getBookDownloadKind(exportParts, exportSettings)
      : "audio";
  const downloadFormatLabel = exportSettings.outputFormat.toUpperCase();
  const primaryDownloadLabel =
    isVideoOutput
      ? "Download video"
      : downloadKind === "zip"
      ? `Download ZIP bundle${
          exportParts.length > 1
            ? ` (${exportParts.length.toLocaleString()} ${downloadFormatLabel} files)`
            : ""
        }`
      : `Download ${downloadFormatLabel}`;
  const downloadBadge =
    isVideoOutput
      ? "Video"
      : downloadKind === "zip"
        ? "ZIP bundle"
        : `${downloadFormatLabel} file`;
  const customRuleMatchesById = React.useMemo(
    () =>
      new Map(preflight.customRuleMatches.map((match) => [match.id, match])),
    [preflight.customRuleMatches],
  );
  const progressPercent =
    exportProgress.totalParts > 0
      ? Math.round(
          (exportProgress.currentPart / exportProgress.totalParts) * 100,
        )
      : exportProgress.phase === "complete"
        ? 100
        : 0;

  const updatePastedText = React.useCallback(
    (value: string) => {
      if (isExportRunning(exportProgress)) {
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
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const updateUploadedText = React.useCallback(
    (value: string) => {
      if (isExportRunning(exportProgress)) {
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
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const parseSelectedFile = React.useCallback(
    async (file: File) => {
      if (isExportRunning(exportProgress)) {
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
      setExportStatus(null);
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
    [cancelActiveExport, exportProgress],
  );

  const clearSource = React.useCallback(() => {
    if (isExportRunning(exportProgress)) {
      cancelActiveExport("Source changed; download cancelled.");
    }
    parseVersionRef.current += 1;
    setSourceText("");
    setSourceEditMode("idle");
    setSourceEditDraft("");
    setSourceEntryMode("pasted");
    fileSelectionRef.current = null;
    setPendingFilename("");
    setParsedSource(createEmptyParsedSource());
    setStatus("idle");
    setErrorMessage("");
    setSourceActionStatus(null);
    setExportProgress(
      outputType === "video" ? VIDEO_IDLE_EXPORT_PROGRESS : IDLE_EXPORT_PROGRESS,
    );
    setExportStatus(null);
    setCompletedExport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [cancelActiveExport, exportProgress, outputType]);

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
    if (isExportRunning(exportProgress)) {
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
  }, [cancelActiveExport, exportProgress, sourceEditDraft]);

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
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setCleanupOptions((current) => ({
        ...current,
        [key]: !current[key],
      }));
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const addCustomCleanupRule = React.useCallback(() => {
    if (isExportRunning(exportProgress)) {
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
  }, [cancelActiveExport, exportProgress]);

  const updateCustomCleanupRule = React.useCallback(
    (id: string, patch: Partial<CustomCleanupRule>) => {
      if (isExportRunning(exportProgress)) {
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
    [cancelActiveExport, exportProgress],
  );

  const deleteCustomCleanupRule = React.useCallback(
    (id: string) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setCustomCleanupRules((current) =>
        current.filter((rule) => rule.id !== id),
      );
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const moveCustomCleanupRule = React.useCallback(
    (id: string, direction: -1 | 1) => {
      if (isExportRunning(exportProgress)) {
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
    [cancelActiveExport, exportProgress],
  );

  const clearCustomCleanupRules = React.useCallback(() => {
    if (isExportRunning(exportProgress)) {
      cancelActiveExport("Settings changed; download cancelled.");
    }
    setCustomCleanupRules([]);
    setExportStatus(null);
    setCompletedExport(null);
  }, [cancelActiveExport, exportProgress]);

  const updateExportSettings = React.useCallback(
    (patch: Partial<BookExportSettings>) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setExportSettings((current) =>
        sanitizeBookExportSettings({ ...current, ...patch }),
      );
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const updateOutputType = React.useCallback(
    (nextOutputType: BookOutputType) => {
      if (nextOutputType === outputType) return;
      const wasRunning = isExportRunning(exportProgress);
      if (wasRunning) {
        cancelActiveExport("Output type changed; download cancelled.");
      }
      setOutputType(nextOutputType);
      setExportProgress(
        nextOutputType === "video"
          ? VIDEO_IDLE_EXPORT_PROGRESS
          : IDLE_EXPORT_PROGRESS,
      );
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
    [cancelActiveExport, exportProgress, outputType],
  );

  const updateVideoSettings = React.useCallback(
    (patch: Partial<BookVideoSettings>) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Settings changed; download cancelled.");
      }
      setVideoSettings((current) =>
        sanitizeBookVideoSettings({ ...current, ...patch }),
      );
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const pickPreset = React.useCallback(
    (presetName: BookExportPresetName) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Preset changed; download cancelled.");
      }
      setExportSettings(applyBookPreset(presetName));
      setExportStatus(null);
      setCompletedExport(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const resetCurrentPreset = React.useCallback(() => {
    if (isExportRunning(exportProgress)) {
      cancelActiveExport("Preset reset; download cancelled.");
    }
    setExportSettings((current) => applyBookPreset(current.presetName));
    setExportStatus(null);
    setCompletedExport(null);
  }, [cancelActiveExport, exportProgress]);

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
    if (outputType !== "audio") {
      setCompletedExport(null);
      setExportStatus({
        kind: "info",
        message: "Video downloads are not available yet.",
      });
      setExportProgress(VIDEO_IDLE_EXPORT_PROGRESS);
      return;
    }

    if (!hasSource || exportParts.length === 0) {
      setExportStatus({
        kind: "error",
        message: "Add source text before downloading audio.",
      });
      return;
    }

    exportAbortRef.current?.abort();
    const controller = new AbortController();
    exportAbortRef.current = controller;
    const version = exportVersionRef.current + 1;
    exportVersionRef.current = version;
    setCompletedExport(null);
    setExportStatus({ kind: "working", message: "Starting book download..." });
    setExportProgress({
      phase: "analyzing",
      message: "Preparing cleaned source for download...",
      currentPart: 0,
      totalParts: exportParts.length,
    });

    try {
      const result = await createBookDownloadPackage({
        metadata: {
          title: preflight.title,
          author: preflight.author,
          filename: preflight.filename,
          sourceType: preflight.sourceType,
        },
        parts: exportParts,
        settings: exportSettings,
        signal: controller.signal,
        onProgress: (progress) => {
          if (mountedRef.current && exportVersionRef.current === version) {
            setExportProgress(progress);
          }
        },
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
          currentPart: exportParts.length,
          totalParts: exportParts.length,
        });
        setExportStatus({ kind: "error", message: download.message });
        return;
      }
      setCompletedExport({
        filename: result.filename,
        downloadKind: result.downloadKind,
        outputFormat: exportSettings.outputFormat,
        partCount: exportParts.length,
        runtimeLabel: formatDuration(exportAnalysis.totalRuntimeMs),
        sizeLabel: exportAnalysis.estimatedSizeLabel,
        contents: result.contents,
      });
      setExportProgress({
        phase: "complete",
        message:
          result.downloadKind === "zip"
            ? `ZIP download started with ${exportParts.length} part${
                exportParts.length === 1 ? "" : "s"
              }.`
            : `${downloadFormatLabel} download started.`,
        currentPart: exportParts.length,
        totalParts: exportParts.length,
      });
      setExportStatus({
        kind: "success",
        message:
          result.downloadKind === "zip"
            ? "ZIP download started."
            : `${downloadFormatLabel} download started.`,
      });
    } catch (error) {
      if (!mountedRef.current || exportVersionRef.current !== version) return;
      if (error instanceof DOMException && error.name === "AbortError") {
        setExportProgress({
          phase: "cancelled",
          message: "Download cancelled.",
          currentPart: 0,
          totalParts: exportParts.length,
        });
        setExportStatus({ kind: "info", message: "Download cancelled." });
        return;
      }
      setExportProgress({
        phase: "failed",
        message:
          "Book download failed. Try a shorter part duration or MP3 output.",
        currentPart: 0,
        totalParts: exportParts.length,
      });
      setExportStatus({
        kind: "error",
        message:
          "Book download failed. Try a shorter part duration or MP3 output.",
      });
    } finally {
      if (exportVersionRef.current === version) {
        exportAbortRef.current = null;
      }
    }
  }, [
    exportAnalysis.estimatedSizeLabel,
    exportAnalysis.totalRuntimeMs,
    exportParts,
    exportSettings,
    hasSource,
    outputType,
    preflight,
    downloadFormatLabel,
  ]);

  const uploadHelpText = hasSource
    ? "Drop a replacement TXT, MD, unprotected EPUB, or text-native PDF here, or click to choose a file."
    : "Drop TXT, MD, unprotected EPUB, or text-native PDF here, or click to choose a file.";
  const uploadTitle = hasSource
    ? "Replace source file"
    : "Drag a source file here or click to upload";
  const uploadRightsText =
    "Only use text you have the right to process. You are responsible for your source content, including copyright or other usage restrictions.";

  return (
    <section
      className="mt-6 space-y-6"
      aria-label="Book source review and download tool"
      data-mw-book-export-ready={preferencesLoaded ? "true" : "loading"}
    >
      <section className="space-y-4" aria-labelledby="book-add-source-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="book-add-source-heading"
              className="text-xl font-extrabold text-sky-950"
            >
              Add source
            </h2>
            <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
              Paste long-form text or upload a local TXT, MD, EPUB, or
              text-native PDF. The source stays in this browser session.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {hasSource ? "Source ready" : "Waiting for source"}
            </span>
          </div>
        </div>

        <div className="space-y-5">
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
                  className="min-h-[18rem]"
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
                  className="mt-3 min-h-[18rem] rounded-lg bg-[#fffaf2]/70"
                  spellCheck={false}
                />
              </div>
            ) : (
              <div
                className="px-4 pb-4"
                aria-labelledby="book-source-preview-heading"
              >
                {hasSource ? (
                  <>
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

            {showSourceState ? (
              <section
                className="border-t border-slate-200/70 px-4 py-4"
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
                      <Metric label="Filename" value={parsedSource.filename} />
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
                    <CopyIcon size={16} title={undefined} aria-hidden="true" />
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
                    <CopyIcon size={16} title={undefined} aria-hidden="true" />
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
                    <TrashIcon size={16} title={undefined} aria-hidden="true" />
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
            ) : null}

            <section
              id="book-download-controls"
              className="border-t border-slate-200/70 px-4 py-4"
              aria-labelledby="book-download-controls-heading"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3
                    id="book-download-controls-heading"
                    className="text-base font-extrabold text-sky-950"
                  >
                    {isVideoOutput ? "Download video" : "Download audio"}
                  </h3>
                  <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                    {isVideoOutput
                      ? "Choose the video options and review the frame below."
                      : downloadKind === "zip"
                        ? "A ZIP bundle is used when the source is split into parts or selected sidecar files need to travel with the audio."
                        : "This source can download as one audio file because it fits in one part and no sidecar files are selected."}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {downloadBadge}
                </span>
              </div>

              <fieldset className="mt-4">
                <legend className="text-sm font-extrabold text-sky-950">
                  Output type
                </legend>
                <div
                  className="mt-2 flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Book output type"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isAudioOutput}
                    onClick={() => updateOutputType("audio")}
                    className={toolControlButtonClass({
                      active: isAudioOutput,
                      tone: isAudioOutput ? "dark" : "light",
                      size: "sm",
                      rounded: "full",
                      hover: "dark",
                    })}
                  >
                    Audio
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isVideoOutput}
                    onClick={() => updateOutputType("video")}
                    className={toolControlButtonClass({
                      active: isVideoOutput,
                      tone: isVideoOutput ? "dark" : "light",
                      size: "sm",
                      rounded: "full",
                      hover: "dark",
                    })}
                  >
                    Video
                  </button>
                </div>
              </fieldset>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Metric label="Preset" value={exportSettings.presetName} />
                <Metric
                  label={isVideoOutput ? "Style" : "Format"}
                  value={
                    isVideoOutput
                      ? BOOK_VIDEO_VISUAL_STYLE_DETAILS[
                          videoSettings.visualStyle
                        ].label
                      : downloadFormatLabel
                  }
                />
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
                  label={
                    isVideoOutput
                      ? "Video target"
                      : exportSettings.splitAudio
                        ? "Target part"
                        : "Split"
                  }
                  value={
                    isVideoOutput || exportSettings.splitAudio
                      ? formatDuration(exportAnalysis.targetPartMs)
                      : "Off"
                  }
                />
                <Metric
                  label={isVideoOutput ? "Resolution" : "Output size"}
                  value={
                    isVideoOutput
                      ? BOOK_VIDEO_RESOLUTION_LABELS[videoSettings.resolution]
                      : `~${exportAnalysis.estimatedSizeLabel}`
                  }
                />
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

              {isVideoOutput && videoSettings.visualStyle === "full-frame" ? (
                <FullFrameFlashWarning className="mt-4" />
              ) : null}

              {isVideoOutput ? (
                <BookVideoPreviewPanel
                  preview={videoPreview}
                  resolvedBackgroundStyle={resolvedVideoBackgroundStyle}
                  settings={videoSettings}
                />
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
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
                  <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                  {primaryDownloadLabel}
                </ToolButton>
                {isAudioOutput || exportRunning ? (
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

              {isAudioOutput || exportStatus ? (
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
                    {exportStatus?.message ?? exportProgress.message}
                  </StatusMessage>
                </div>
              ) : null}

              {isAudioOutput && completedExport ? (
                <div className="mt-5 border-t border-slate-200/70 pt-5">
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
                    Download contents: {completedExport.contents.join(", ")}.
                    Use the Download button again to save another copy, change
                    settings to rebuild, or clear the source when you are done.
                  </p>
                </div>
              ) : null}

              <details
                open={advancedOpen}
                onToggle={handleAdvancedToggle}
                className="mt-5 border-t border-slate-200/70 pt-5"
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
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-extrabold text-sky-950">
                          Choose download style
                        </h4>
                        <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                          Presets adjust speed, audio format, and optional
                          sidecar files.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
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
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {BOOK_EXPORT_PRESET_NAMES.map((presetName) => {
                        const active = exportSettings.presetName === presetName;
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

                  <fieldset className="border-t border-slate-200/70 pt-5">
                    <legend className="text-base font-extrabold text-sky-950">
                      Output format
                    </legend>
                    <div
                      className="mt-3 flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Book download output format"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={exportSettings.outputFormat === "mp3"}
                        onClick={() =>
                          updateExportSettings({ outputFormat: "mp3" })
                        }
                        className={toolControlButtonClass({
                          active: exportSettings.outputFormat === "mp3",
                          tone:
                            exportSettings.outputFormat === "mp3"
                              ? "dark"
                              : "light",
                          size: "md",
                          rounded: "xl",
                          hover: "dark",
                        })}
                      >
                        <span className="font-extrabold">MP3</span>
                        <span className="text-xs font-semibold">
                          Recommended for long Morse audio
                        </span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={exportSettings.outputFormat === "wav"}
                        onClick={() =>
                          updateExportSettings({ outputFormat: "wav" })
                        }
                        className={toolControlButtonClass({
                          active: exportSettings.outputFormat === "wav",
                          tone:
                            exportSettings.outputFormat === "wav"
                              ? "dark"
                              : "light",
                          size: "md",
                          rounded: "xl",
                          hover: "dark",
                        })}
                      >
                        <span className="font-extrabold">WAV</span>
                        <span className="text-xs font-semibold">
                          Uncompressed and larger
                        </span>
                      </button>
                    </div>
                  </fieldset>

                  <div className="border-t border-slate-200/70 pt-5">
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
                    <div className="mt-4">
                      <ExportCheckbox
                        label="Split into parts"
                        checked={exportSettings.splitAudio}
                        onChange={(value) =>
                          updateExportSettings({ splitAudio: value })
                        }
                      />
                      <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-slate-600">
                        {exportSettings.splitAudio
                          ? "Downloads are split by the target part length below and saved as a ZIP bundle."
                          : "Downloads use one audio file by default."}
                      </p>
                      {exportSettings.splitAudio ? (
                        <div className="mt-3">
                          <ExportCheckbox
                            label="Prefer EPUB/PDF section hints"
                            checked={exportSettings.preferSourceSections}
                            onChange={(value) =>
                              updateExportSettings({
                                preferSourceSections: value,
                              })
                            }
                          />
                        </div>
                      ) : null}
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
                      targetPartMinutes={
                        exportSettings.splitAudio
                          ? exportSettings.targetPartMinutes
                          : undefined
                      }
                      onTargetPartMinutesChange={(value) =>
                        updateExportSettings({ targetPartMinutes: value })
                      }
                    />
                  </div>

                  <div className="border-t border-slate-200/70 pt-5">
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
                    <div className="mt-5 border-t border-slate-200/70 pt-5">
                      <h4 className="text-base font-extrabold text-sky-950">
                        Download extras
                      </h4>
                      <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                        Sidecar files are included in a ZIP bundle. Turn them
                        off for a direct one-part audio download.
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
                      videoSettings={videoSettings}
                    />
                  )}
                </div>
              </details>
            </section>
          </ToolPanel>

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

        <section className="rounded-xl bg-[#fffdf8] p-5 sm:p-6">
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
          <div className="mt-5 border-t border-slate-200/70 pt-5">
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
                      className="border-t border-slate-200/70 pt-4"
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
          className="rounded-xl bg-[#fffdf8] p-5 sm:p-6"
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
                    ? formatDuration(exportAnalysis.targetPartMs)
                    : "Off"
                }
              />
              <Metric
                label={isVideoOutput ? "Output type" : "Output size"}
                value={
                  isVideoOutput
                    ? "Video"
                    : `~${exportAnalysis.estimatedSizeLabel}`
                }
              />
              <Metric
                label={isVideoOutput ? "Video style" : "Format"}
                value={
                  isVideoOutput
                    ? BOOK_VIDEO_VISUAL_STYLE_DETAILS[videoSettings.visualStyle]
                        .label
                    : exportSettings.outputFormat.toUpperCase()
                }
              />
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
            <div className="mt-5 border-t border-slate-200/70 pt-5">
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
          <section className="rounded-xl bg-[#fffdf8] p-5">
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
            ? "Parts are based on estimated Morse runtime and safe paragraph, sentence, or word boundaries. EPUB/PDF section hints help when available, but parts are not guaranteed to match original chapters."
            : "Audio downloads stay as one file by default. Turn on Split into parts in Download settings when you want a ZIP bundle with timed parts."}
        </p>
        {isSegmentedOutput ? (
          exportParts.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {exportParts.slice(0, 6).map((part) => (
                <div
                  key={`${part.index}-${part.sourceStart}`}
                  className="rounded-xl bg-[#fffdf8] p-4"
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

function BookVideoSettingsEditor({
  exportSettings,
  onCharWpmChange,
  onFarnsworthWpmChange,
  onPitchChange,
  onTonePresetChange,
  onVideoSettingsChange,
  onVolumeChange,
  videoSettings,
}: {
  exportSettings: BookExportSettings;
  onCharWpmChange: (value: number) => void;
  onFarnsworthWpmChange: (value: number) => void;
  onPitchChange: (value: number) => void;
  onTonePresetChange: (value: AudioTonePresetId) => void;
  onVideoSettingsChange: (patch: Partial<BookVideoSettings>) => void;
  onVolumeChange: (value: number) => void;
  videoSettings: BookVideoSettings;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-base font-extrabold text-sky-950">
          Video settings
        </h4>
        <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
          Choose how the Morse signal appears in the video frame.
        </p>
      </div>

      <fieldset className="border-t border-slate-200/70 pt-5">
        <legend className="text-base font-extrabold text-sky-950">
          Visual style
        </legend>
        <div
          className="mt-3 grid gap-2 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Video visual style"
        >
          {BOOK_VIDEO_VISUAL_STYLES.map((style) => {
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

      <div className="border-t border-slate-200/70 pt-5">
        <h4 className="text-base font-extrabold text-sky-950">Video frame</h4>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-700">
              Video resolution
            </legend>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Video resolution"
            >
              {BOOK_VIDEO_RESOLUTIONS.map((resolution) => (
                <VideoSettingButton
                  key={resolution}
                  active={videoSettings.resolution === resolution}
                  label={BOOK_VIDEO_RESOLUTION_LABELS[resolution]}
                  onClick={() =>
                    onVideoSettingsChange({
                      resolution,
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

          <SliderRow
            label="Video part duration"
            value={videoSettings.targetPartMinutes}
            min={1}
            max={30}
            step={1}
            unit="min"
            onChange={(value) =>
              onVideoSettingsChange({
                targetPartMinutes: value,
              })
            }
          />
        </div>
      </div>

      <div className="border-t border-slate-200/70 pt-5">
        <h4 className="text-base font-extrabold text-sky-950">
          Video options
        </h4>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ExportCheckbox
            label="Include audio track"
            checked={videoSettings.includeAudioTrack}
            onChange={(value) =>
              onVideoSettingsChange({
                includeAudioTrack: value,
              })
            }
          />
          <ExportCheckbox
            label="Show Morse text overlay"
            checked={videoSettings.showMorseOverlay}
            onChange={(value) =>
              onVideoSettingsChange({
                showMorseOverlay: value,
              })
            }
          />
          <ExportCheckbox
            label="Show small MorseWords branding"
            checked={videoSettings.showBranding}
            onChange={(value) =>
              onVideoSettingsChange({
                showBranding: value,
              })
            }
          />
        </div>
      </div>

      <div className="border-t border-slate-200/70 pt-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h4 className="text-base font-extrabold text-sky-950">
              Timing and audio track
            </h4>
            <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
              Character speed and Farnsworth spacing use the same Morse timing
              layer as audio export. Tone controls apply only when the video
              includes an audio track.
            </p>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {videoSettings.includeAudioTrack
              ? tonePresetLabel(exportSettings.tonePreset)
              : "Silent video"}
          </span>
        </div>
        <AudioSettingsPanel
          className="mt-5"
          context="bookExport"
          disabledSound={!videoSettings.includeAudioTrack}
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

function FullFrameFlashWarning({ className = "" }: { className?: string }) {
  return (
    <div
      data-testid="book-video-full-frame-warning"
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
        <span className="font-extrabold text-sky-950">
          Full-frame flash warning:
        </span>{" "}
        {FULL_FRAME_FLASH_WARNING}
      </p>
    </div>
  );
}

function BookVideoPreviewPanel({
  preview,
  resolvedBackgroundStyle,
  settings,
}: {
  preview: BookVideoPreview;
  resolvedBackgroundStyle: "warm-morsewords" | "dark-morsewords";
  settings: BookVideoSettings;
}) {
  const darkFrame = resolvedBackgroundStyle === "dark-morsewords";
  const frameStyle = darkFrame
    ? {
        backgroundColor: "#020617",
        color: "#e0f2fe",
      }
    : {
        backgroundColor: "#fffdf8",
        color: "#08324f",
      };

  return (
    <section
      data-testid="book-video-preview"
      aria-labelledby="book-video-preview-heading"
      className="mt-4 space-y-3"
    >
      <div
        className="flex aspect-video min-h-[12rem] w-full max-w-[720px] flex-col justify-between rounded-xl p-4 sm:p-5"
        style={frameStyle}
      >
        <h3
          id="book-video-preview-heading"
          className="text-sm font-extrabold"
        >
          Video preview
        </h3>
        <div className="flex min-h-[5rem] items-center justify-center">
          <BookVideoPreviewVisual preview={preview} settings={settings} />
        </div>
        {settings.showMorseOverlay ? (
          <p
            data-testid="book-video-preview-morse-overlay"
            className="mt-3 break-words font-mono text-xs font-bold"
          >
            {preview.sampleMorse}
          </p>
        ) : null}
        {settings.showBranding ? (
          <p
            data-testid="book-video-preview-branding"
            className="mt-3 text-right font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-80"
          >
            {preview.brandLabel}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function BookVideoPreviewVisual({
  preview,
  settings,
}: {
  preview: BookVideoPreview;
  settings: BookVideoSettings;
}) {
  if (settings.visualStyle === "dot") {
    return (
      <span
        data-testid="book-video-preview-dot"
        aria-label="Dot preview"
        role="img"
        className="block h-12 w-12 rounded-full bg-sky-200"
      />
    );
  }

  if (settings.visualStyle === "full-frame") {
    return (
      <div
        data-testid="book-video-preview-full-frame"
        aria-label="Full-frame flash preview"
        role="img"
        className="h-16 w-16 rounded-full bg-sky-200/80"
      />
    );
  }

  if (settings.visualStyle === "morse-text") {
    return (
      <div
        data-testid="book-video-preview-morse-text"
        className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-lg font-bold tracking-normal"
      >
        {preview.sampleMorse}
      </div>
    );
  }

  return (
    <div
      data-testid="book-video-preview-lightbulb"
      aria-label="Lightbulb preview"
      role="img"
      className="text-sky-200"
    >
      <LightBulbIcon size={54} title={undefined} aria-hidden="true" />
    </div>
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
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold text-slate-800">
      <input
        type="checkbox"
        checked={checked}
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
