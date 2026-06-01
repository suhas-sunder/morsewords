import * as React from "react";

import {
  ChecklistIcon,
  ClockIcon,
  DownloadIcon,
  EqualizerIcon,
  SparklesIcon,
  StopIcon,
  TrashIcon,
  UploadIcon,
  WarningBadgeIcon,
} from "~/client/assets/svg/Icons";
import { downloadBlobFile } from "~/client/components/shared/actionOutputUtils";
import {
  AUDIO_GENERATOR_PRESETS,
  AUDIO_PITCH_RANGE,
  AUDIO_SAMPLE_RATES,
  AUDIO_SPEED_RANGE,
  MP3_BITRATES,
  sanitizeAudioGeneratorPreset,
  sanitizeAudioSampleRate,
  sanitizeMp3Bitrate,
} from "~/client/components/shared/morseSettings";
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

import { createBookExportZip, renderBookPartAudio } from "./bookBundleExport";
import {
  applyExportPunctuationMode,
  buildExportAnalysis,
  formatDuration,
  SAMPLE_EXPORT_CHARACTER_LIMIT,
} from "./bookDurationEstimate";
import {
  applyBookPreset,
  BOOK_EXPORT_PRESET_NAMES,
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "./bookExportPresets";
import type {
  BookExportPart,
  BookExportPresetName,
  BookExportProgress,
  BookExportSettings,
} from "./bookExportTypes";
import { segmentBookText } from "./bookSegmentation";
import {
  DEFAULT_CLEANUP_OPTIONS,
  type CleanupOptions,
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

type ParseStatus = "idle" | "parsing" | "ready" | "error";
type ExportStatusKind = "info" | "success" | "error" | "working";

const IDLE_EXPORT_PROGRESS: BookExportProgress = {
  phase: "idle",
  message: "Choose a preset, review the split, then export a ZIP bundle.",
  currentPart: 0,
  totalParts: 0,
};

function formatNumber(value: number | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "0";
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

function Metric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
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
    <section className="rounded-xl bg-[#fffdf8] p-4">
      <h3 className="flex items-center gap-2 text-sm font-extrabold text-sky-950">
        <WarningBadgeIcon size={16} title={undefined} aria-hidden="true" />
        {title}
      </h3>
      <ul className={`mt-2 space-y-1 text-sm leading-relaxed ${toneClass}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function EmptyPreview({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-slate-600">
      {children}
    </p>
  );
}

async function parseFileSource(file: File) {
  const sourceType = detectFileSourceType(file);
  if (sourceType === "txt" || sourceType === "md") return parseTextFileSource(file);
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
  const [parsedSource, setParsedSource] = React.useState<ParsedBookSource>(
    () => parsePastedSource(""),
  );
  const [cleanupOptions, setCleanupOptions] =
    React.useState<CleanupOptions>(DEFAULT_CLEANUP_OPTIONS);
  const [exportSettings, setExportSettings] =
    React.useState<BookExportSettings>(DEFAULT_BOOK_EXPORT_SETTINGS);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [status, setStatus] = React.useState<ParseStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [dragActive, setDragActive] = React.useState(false);
  const [exportProgress, setExportProgress] =
    React.useState<BookExportProgress>(IDLE_EXPORT_PROGRESS);
  const [exportStatus, setExportStatus] = React.useState<{
    kind: ExportStatusKind;
    message: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const parseVersionRef = React.useRef(0);
  const fileSelectionRef = React.useRef<{
    selectedAt: number;
    lastModified: number;
  } | null>(null);
  const exportVersionRef = React.useRef(0);
  const exportAbortRef = React.useRef<AbortController | null>(null);
  const mountedRef = React.useRef(true);

  const cancelActiveExport = React.useCallback((message = "Export cancelled.") => {
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
  }, []);

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
    return buildPreflightSummary(parsedSource, effectiveCleanupOptions);
  }, [effectiveCleanupOptions, parsedSource]);

  const sourceSections = React.useMemo(
    () => buildCleanedSourceSections(parsedSource, effectiveCleanupOptions),
    [effectiveCleanupOptions, parsedSource],
  );

  const exportParts = React.useMemo<BookExportPart[]>(() => {
    return segmentBookText({
      cleanedText: preflight.cleanedText,
      settings: exportSettings,
      sourceSections,
      sourceTitle: preflight.title || preflight.filename,
    });
  }, [exportSettings, preflight.cleanedText, preflight.filename, preflight.title, sourceSections]);

  const exportAnalysis = React.useMemo(
    () =>
      buildExportAnalysis({
        preflight,
        settings: exportSettings,
        partCount: exportParts.length,
      }),
    [exportParts.length, exportSettings, preflight],
  );

  const hasSource = sourceText.trim().length > 0;
  const isUploaded = parsedSource.sourceType !== "pasted";
  const allWarnings = [
    ...preflight.extractionWarnings,
    ...preflight.cleanupWarnings,
    ...exportAnalysis.warnings,
  ];
  const canExport = hasSource && exportParts.length > 0 && !isExportRunning(exportProgress);
  const progressPercent =
    exportProgress.totalParts > 0
      ? Math.round((exportProgress.currentPart / exportProgress.totalParts) * 100)
      : exportProgress.phase === "complete"
        ? 100
        : 0;

  const updatePastedText = React.useCallback(
    (value: string) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Source changed; export cancelled.");
      }
      parseVersionRef.current += 1;
      fileSelectionRef.current = null;
      setSourceText(value);
      setParsedSource(parsePastedSource(value));
      setStatus(value.trim() ? "ready" : "idle");
      setErrorMessage("");
      setExportStatus(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const parseSelectedFile = React.useCallback(
    async (file: File) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Source changed; export cancelled.");
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
      setDragActive(false);
      setExportStatus(null);

      try {
        const parsed = await parseFileSource(file);
        if (!mountedRef.current || parseVersionRef.current !== version) return;
        setParsedSource(parsed);
        setSourceText(parsed.rawText);
        setStatus("ready");
      } catch (error) {
        if (!mountedRef.current || parseVersionRef.current !== version) return;
        const message =
          error instanceof BookSourceError || error instanceof Error
            ? error.message
            : "This source could not be parsed.";
        setStatus("error");
        setErrorMessage(message);
      }
    },
    [cancelActiveExport, exportProgress],
  );

  const clearSource = React.useCallback(() => {
    if (isExportRunning(exportProgress)) {
      cancelActiveExport("Source changed; export cancelled.");
    }
    parseVersionRef.current += 1;
    setSourceText("");
    fileSelectionRef.current = null;
    setParsedSource(parsePastedSource(""));
    setStatus("idle");
    setErrorMessage("");
    setExportStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [cancelActiveExport, exportProgress]);

  const removeUploadedFile = React.useCallback(() => {
    if (!isUploaded) return;
    clearSource();
  }, [clearSource, isUploaded]);

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
        cancelActiveExport("Settings changed; export cancelled.");
      }
      setCleanupOptions((current) => ({
        ...current,
        [key]: !current[key],
      }));
      setExportStatus(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const updateExportSettings = React.useCallback(
    (patch: Partial<BookExportSettings>) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Settings changed; export cancelled.");
      }
      setExportSettings((current) =>
        sanitizeBookExportSettings({ ...current, ...patch }),
      );
      setExportStatus(null);
    },
    [cancelActiveExport, exportProgress],
  );

  const pickPreset = React.useCallback(
    (presetName: BookExportPresetName) => {
      if (isExportRunning(exportProgress)) {
        cancelActiveExport("Preset changed; export cancelled.");
      }
      setExportSettings(applyBookPreset(presetName));
      setExportStatus(null);
    },
    [cancelActiveExport, exportProgress],
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

  const handleExportBundle = React.useCallback(async () => {
    if (!hasSource || exportParts.length === 0) {
      setExportStatus({
        kind: "error",
        message: "Add source text before exporting a bundle.",
      });
      return;
    }

    exportAbortRef.current?.abort();
    const controller = new AbortController();
    exportAbortRef.current = controller;
    const version = exportVersionRef.current + 1;
    exportVersionRef.current = version;
    setExportStatus({ kind: "working", message: "Starting book export..." });
    setExportProgress({
      phase: "splitting",
      message: "Splitting source into export parts...",
      currentPart: 0,
      totalParts: exportParts.length,
    });

    try {
      const result = await createBookExportZip({
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
      setExportProgress({
        phase: "complete",
        message: `Bundle download started with ${exportParts.length} part${
          exportParts.length === 1 ? "" : "s"
        }.`,
        currentPart: exportParts.length,
        totalParts: exportParts.length,
      });
      setExportStatus({
        kind: "success",
        message: "ZIP bundle download started.",
      });
    } catch (error) {
      if (!mountedRef.current || exportVersionRef.current !== version) return;
      if (error instanceof DOMException && error.name === "AbortError") {
        setExportProgress({
          phase: "cancelled",
          message: "Export cancelled.",
          currentPart: 0,
          totalParts: exportParts.length,
        });
        setExportStatus({ kind: "info", message: "Export cancelled." });
        return;
      }
      setExportProgress({
        phase: "failed",
        message: "Book export failed. Try a shorter part duration or MP3 output.",
        currentPart: 0,
        totalParts: exportParts.length,
      });
      setExportStatus({
        kind: "error",
        message: "Book export failed. Try a shorter part duration or MP3 output.",
      });
    } finally {
      if (exportVersionRef.current === version) {
        exportAbortRef.current = null;
      }
    }
  }, [exportParts, exportSettings, hasSource, preflight]);

  const handleDownloadSample = React.useCallback(async () => {
    if (!hasSource || !exportAnalysis.cleanedText.trim()) {
      setExportStatus({
        kind: "error",
        message: "Add source text before exporting a sample.",
      });
      return;
    }
    const sampleText = sampleExcerpt(exportAnalysis.cleanedText);
    const samplePart: BookExportPart = {
      index: 1,
      title: "Sample",
      sourceStart: 0,
      sourceEnd: sampleText.length,
      cleanedText: sampleText,
      cleanedExcerpt: sampleText,
      morseDurationMs: exportParts[0]?.morseDurationMs ?? 0,
      estimatedFilename: `morse-book-sample.${exportSettings.outputFormat}`,
    };
    const controller = new AbortController();
    setExportStatus({ kind: "working", message: "Preparing sample audio..." });
    try {
      const blob = await renderBookPartAudio(samplePart, exportSettings, controller.signal);
      const download = downloadBlobFile({
        blob,
        filename: samplePart.estimatedFilename,
      });
      setExportStatus({
        kind: download.ok ? "success" : "error",
        message: download.ok ? "Sample download started." : download.message,
      });
    } catch {
      setExportStatus({
        kind: "error",
        message: "Sample export failed. Try a shorter source excerpt.",
      });
    }
  }, [exportAnalysis.cleanedText, exportParts, exportSettings, hasSource]);

  const uploadHelpText =
    "Drop TXT, MD, unprotected EPUB, or text-native PDF here, or click to choose a file.";
  const uploadRightsText =
    "Only use text you have the right to process. You are responsible for your source content, including copyright or other usage restrictions.";

  return (
    <section
      className="mt-6 space-y-6"
      aria-label="Book source preflight and export tool"
      data-mw-book-export-ready="true"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ToolPanel
          label="Source text"
          badge={isUploaded ? sourceTypeLabel(parsedSource.sourceType) : "Paste"}
        >
          <label htmlFor="book-source-text" className="sr-only">
            Paste long-form source text
          </label>
          <ToolTextarea
            id="book-source-text"
            value={sourceText}
            onChange={(event) => updatePastedText(event.target.value)}
            placeholder="Paste a chapter, public-domain excerpt, notes, or any long-form text here..."
            className="min-h-[18rem]"
            spellCheck={false}
          />
        </ToolPanel>

        <div className="space-y-4">
          <label
            htmlFor="book-source-file"
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={[
              "flex min-h-[14rem] cursor-pointer flex-col justify-center rounded-xl border border-dashed border-slate-300/80 bg-white/88 p-5 text-center transition-[background-color,border-color,color] duration-100 ease-out hover:bg-[#fffaf2] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-500",
              dragActive
                ? "border-sky-500 bg-[#fffaf2] outline outline-2 outline-offset-2 outline-sky-500"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <input
              ref={fileInputRef}
              id="book-source-file"
              type="file"
              accept=".txt,.md,.markdown,.epub,.pdf,text/plain,text/markdown,application/epub+zip,application/pdf"
              onChange={handleFileInputChange}
              className="sr-only"
              aria-describedby="book-source-file-help"
            />
            <UploadIcon
              size={28}
              title={undefined}
              aria-hidden="true"
              className="mx-auto text-sky-950"
            />
            <span className="mt-3 block text-base font-extrabold text-sky-950">
              Drag a source file here or click to upload
            </span>
            <span
              id="book-source-file-help"
              className="mx-auto mt-2 block max-w-[34ch] text-sm leading-relaxed text-slate-600"
            >
              {uploadHelpText}
            </span>
            {parsedSource.filename ? (
              <span className="mt-3 block break-words text-sm font-semibold text-slate-700">
                Current file: {parsedSource.filename}
              </span>
            ) : null}
            <span className="mx-auto mt-3 block max-w-[38ch] text-xs leading-relaxed text-slate-500">
              {uploadRightsText}
            </span>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearSource}
              disabled={!hasSource && status !== "error"}
              className={toolControlButtonClass({
                size: "sm",
                disabled: !hasSource && status !== "error",
              })}
            >
              <TrashIcon size={16} title={undefined} aria-hidden="true" />
              Clear source
            </button>
            {isUploaded ? (
              <button
                type="button"
                onClick={removeUploadedFile}
                className={toolControlButtonClass({ size: "sm" })}
              >
                Remove uploaded file
              </button>
            ) : null}
          </div>

          <div className="rounded-xl bg-[#fffdf8] p-5">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-sky-950">
              <SparklesIcon size={18} title={undefined} aria-hidden="true" />
              Source cleanup
            </h2>
            <div className="mt-4 space-y-3">
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
          </div>
        </div>
      </div>

      <section className="rounded-xl bg-[#fffdf8] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-sky-950">
            <ClockIcon size={20} title={undefined} aria-hidden="true" />
            Export presets
          </h2>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {exportSettings.presetName}
          </span>
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
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {exportSettings.charWpm}/{exportSettings.farnsworthWpm} WPM,{" "}
          {exportSettings.outputFormat.toUpperCase()} at{" "}
          {exportSettings.outputFormat === "mp3"
            ? `${exportSettings.mp3Bitrate} kbps`
            : `${exportSettings.sampleRate} Hz`}
          , {exportSettings.targetPartMinutes} minute target parts.
        </p>
      </section>

      <details open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}>
        <summary className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-extrabold text-sky-950 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
          <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
          Advanced export settings
        </summary>
        <div className="mt-4 rounded-xl bg-[#fffdf8] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <SliderRow
              label="Character speed"
              value={exportSettings.charWpm}
              min={5}
              max={60}
              step={1}
              unit="WPM"
              onChange={handleCharWpmChange}
            />
            <SliderRow
              label="Farnsworth spacing"
              value={exportSettings.farnsworthWpm}
              min={5}
              max={Math.max(5, exportSettings.charWpm)}
              step={1}
              unit="WPM"
              onChange={(value) => updateExportSettings({ farnsworthWpm: value })}
            />
            <SliderRow
              label="Pitch"
              value={exportSettings.pitch}
              min={AUDIO_PITCH_RANGE.min}
              max={AUDIO_PITCH_RANGE.max}
              step={10}
              unit="Hz"
              onChange={(value) => updateExportSettings({ pitch: value })}
              disabled={exportSettings.tonePreset === "sounder"}
            />
            <SliderRow
              label="Volume"
              value={Math.round(exportSettings.volume * 100)}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(value) => updateExportSettings({ volume: value / 100 })}
            />
            <LabeledSelect
              label="Tone preset"
              value={exportSettings.tonePreset}
              onChange={(value) =>
                updateExportSettings({
                  tonePreset: sanitizeAudioGeneratorPreset(value),
                })
              }
            >
              {AUDIO_GENERATOR_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {tonePresetLabel(preset)}
                </option>
              ))}
            </LabeledSelect>
            <LabeledSelect
              label="Output format"
              value={exportSettings.outputFormat}
              onChange={(value) =>
                updateExportSettings({ outputFormat: value === "wav" ? "wav" : "mp3" })
              }
            >
              <option value="mp3">MP3 bundle</option>
              <option value="wav">WAV bundle</option>
            </LabeledSelect>
            <LabeledSelect
              label="MP3 bitrate"
              value={String(exportSettings.mp3Bitrate)}
              onChange={(value) =>
                updateExportSettings({ mp3Bitrate: sanitizeMp3Bitrate(Number(value)) })
              }
              disabled={exportSettings.outputFormat !== "mp3"}
            >
              {MP3_BITRATES.map((bitrate) => (
                <option key={bitrate} value={bitrate}>
                  {bitrate} kbps
                </option>
              ))}
            </LabeledSelect>
            <LabeledSelect
              label="Sample rate"
              value={String(exportSettings.sampleRate)}
              onChange={(value) =>
                updateExportSettings({ sampleRate: sanitizeAudioSampleRate(Number(value)) })
              }
            >
              {AUDIO_SAMPLE_RATES.map((sampleRate) => (
                <option key={sampleRate} value={sampleRate}>
                  {sampleRate} Hz
                </option>
              ))}
            </LabeledSelect>
            <SliderRow
              label="Target part length"
              value={exportSettings.targetPartMinutes}
              min={1}
              max={30}
              step={1}
              unit="min"
              onChange={(value) => updateExportSettings({ targetPartMinutes: value })}
            />
            <SliderRow
              label="Paragraph pause"
              value={exportSettings.paragraphPauseMultiplier}
              min={1}
              max={6}
              step={0.1}
              unit="x"
              onChange={(value) =>
                updateExportSettings({ paragraphPauseMultiplier: value })
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
                updateExportSettings({ sentencePauseMultiplier: value })
              }
            />
            <LabeledSelect
              label="Punctuation"
              value={exportSettings.punctuationMode}
              onChange={(value) =>
                updateExportSettings({
                  punctuationMode: value === "preserve" ? "preserve" : "simplify",
                })
              }
            >
              <option value="preserve">Preserve supported punctuation</option>
              <option value="simplify">Simplify punctuation for practice</option>
            </LabeledSelect>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ExportCheckbox
              label="Prefer EPUB/PDF section hints"
              checked={exportSettings.preferSourceSections}
              onChange={(value) => updateExportSettings({ preferSourceSections: value })}
            />
            <ExportCheckbox
              label="Include cleaned text"
              checked={exportSettings.includeCleanedText}
              onChange={(value) => updateExportSettings({ includeCleanedText: value })}
            />
            <ExportCheckbox
              label="Include Morse transcript"
              checked={exportSettings.includeMorseTranscript}
              onChange={(value) => updateExportSettings({ includeMorseTranscript: value })}
            />
            <ExportCheckbox
              label="Include manifest"
              checked={exportSettings.includeManifest}
              onChange={(value) => updateExportSettings({ includeManifest: value })}
            />
            <ExportCheckbox
              label="Include settings"
              checked={exportSettings.includeSettings}
              onChange={(value) => updateExportSettings({ includeSettings: value })}
            />
            <ExportCheckbox
              label="Include README"
              checked={exportSettings.includeReadme}
              onChange={(value) => updateExportSettings({ includeReadme: value })}
            />
          </div>
        </div>
      </details>

      {status === "parsing" ? (
        <div
          role="status"
          className="rounded-xl bg-[#fffdf8] p-4 text-sm font-semibold text-slate-700"
        >
          Parsing source locally in your browser...
        </div>
      ) : null}
      {status === "error" ? (
        <MessageList title="Extraction error" items={[errorMessage]} tone="error" />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.65fr)]">
        <section className="rounded-xl bg-[#fffdf8] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-sky-950">
              <ChecklistIcon size={20} title={undefined} aria-hidden="true" />
              Export preflight summary
            </h2>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {status === "ready" ? "Ready" : status === "parsing" ? "Parsing" : "Preview"}
            </span>
          </div>

          {hasSource ? (
            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label="Source type" value={sourceTypeLabel(preflight.sourceType)} />
              <Metric label="Words" value={formatNumber(preflight.wordCount)} />
              <Metric
                label="Characters"
                value={formatNumber(preflight.characterCount)}
              />
              <Metric label="Runtime" value={formatDuration(exportAnalysis.totalRuntimeMs)} />
              <Metric label="Parts" value={formatNumber(exportParts.length)} />
              <Metric
                label="Target part"
                value={formatDuration(exportAnalysis.targetPartMs)}
              />
              <Metric
                label="Output size"
                value={`~${exportAnalysis.estimatedSizeLabel}`}
              />
              <Metric
                label="Format"
                value={exportSettings.outputFormat.toUpperCase()}
              />
              <Metric label="Preset" value={exportSettings.presetName} />
              <Metric
                label="Unsupported"
                value={formatNumber(preflight.unsupportedCount)}
              />
              {preflight.pageCount ? (
                <Metric label="PDF pages" value={formatNumber(preflight.pageCount)} />
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
              {preflight.title ? <Metric label="Title" value={preflight.title} /> : null}
              {preflight.author ? <Metric label="Author" value={preflight.author} /> : null}
            </dl>
          ) : (
            <EmptyPreview>
              Paste text or upload TXT, MD, EPUB, or text-native PDF to see word
              counts, runtime, part splitting, unsupported characters, and Morse
              previews before export.
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
          <MessageList title="Warnings" items={allWarnings} tone="warning" />
          <section className="rounded-xl bg-[#fffdf8] p-5">
            <h2 className="text-base font-extrabold text-sky-950">
              Bundle export
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Export runs one part at a time in this browser. Long sources are
              packaged as sorted part files, transcripts, manifest, settings,
              playlist, and README.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ToolButton
                type="button"
                tone="dark"
                onClick={handleExportBundle}
                disabled={!canExport}
                className="rounded-xl"
              >
                <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                Export ZIP bundle
              </ToolButton>
              <ToolButton
                type="button"
                tone="light"
                hover="dark"
                onClick={handleDownloadSample}
                disabled={!hasSource || isExportRunning(exportProgress)}
                className="rounded-xl"
              >
                <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                Download sample
              </ToolButton>
              <ToolButton
                type="button"
                tone="light"
                hover="dark"
                onClick={() => cancelActiveExport()}
                disabled={!isExportRunning(exportProgress)}
                className="rounded-xl"
              >
                <StopIcon size={18} title={undefined} aria-hidden="true" />
                Cancel export
              </ToolButton>
            </div>
            <div className="mt-4">
              <progress
                value={progressPercent}
                max={100}
                className="h-2 w-full overflow-hidden rounded-full"
                aria-label="Book export progress"
              />
              <StatusMessage
                kind={exportStatus?.kind ?? (isExportRunning(exportProgress) ? "working" : "info")}
                live
                className="mt-3"
              >
                {exportStatus?.message ?? exportProgress.message}
              </StatusMessage>
            </div>
          </section>
        </div>
      </div>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-sky-950">Part split</h2>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {exportParts.length} part{exportParts.length === 1 ? "" : "s"}
          </span>
        </div>
        {exportParts.length > 0 ? (
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
                Showing first 6 parts. The ZIP manifest includes all{" "}
                {exportParts.length.toLocaleString()} parts.
              </p>
            ) : null}
          </div>
          ) : (
          <div className="mt-3">
            <EmptyPreview>Part splitting appears after source text is available.</EmptyPreview>
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <ToolPanel label="Cleaned text preview" badge="Excerpt">
          {preflight.cleanedPreview ? (
            <pre className="max-h-80 min-h-[12rem] overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-slate-900">
              {preflight.cleanedPreview}
            </pre>
          ) : (
            <div className="p-4">
              <EmptyPreview>Cleaned text will appear here after input.</EmptyPreview>
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
                Morse preview appears here after cleaned source text is available.
              </p>
            </div>
          )}
        </ToolOutputPanel>
      </div>
    </section>
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
        className={`mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline-none ${
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
  switch (value) {
    case "cw_radio":
      return "CW radio tone";
    case "sine":
      return "Sine";
    case "square":
      return "Square";
    case "triangle":
      return "Triangle";
    case "sawtooth":
      return "Sawtooth";
    case "sounder":
      return "Telegraph sounder";
    default:
      return value;
  }
}

function sampleExcerpt(text: string) {
  const truncated = applyExportPunctuationMode(
    text.slice(0, SAMPLE_EXPORT_CHARACTER_LIMIT),
    DEFAULT_BOOK_EXPORT_SETTINGS,
  );
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 160 ? truncated.slice(0, lastSpace) : truncated).trim();
}
