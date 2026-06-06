import * as React from "react";

import {
  DownloadIcon,
  PlayIcon,
  StopIcon,
  WarningBadgeIcon,
} from "~/client/assets/svg/Icons";
import {
  copyTextToClipboard,
  downloadBlobFile,
} from "~/client/components/shared/actionOutputUtils";
import {
  getAudioPresetLabel,
  getAudioPresetsForContext,
  type AudioTonePresetId,
} from "~/client/components/shared/audioPresetRegistry";
import {
  ToolButton,
  ToolHero,
  ToolOutputPanel,
  ToolPanel,
  toolControlButtonClass,
} from "~/client/components/shared/ToolWorkspace";
import useMorseAudio from "~/client/components/shared/useMorseAudio";
import { textToMorse } from "~/client/components/shared/morseUtils";
import type { ResolvedMorseVideoBackgroundStyle } from "~/client/components/shared/video/morseVideoRenderer";
import type { MorseVideoPreview } from "~/client/components/shared/video/morseVideoPreview";
import {
  MorseAudioTimingStrip,
  MorseVideoPreviewPanel,
  MorseVideoPreviewTimeline,
} from "~/client/components/shared/video/MorseVideoPreviewControls";
import {
  DEFAULT_MORSE_VIDEO_SETTINGS,
  MORSE_VIDEO_INTENSITIES,
  sanitizeMorseVideoSettings,
} from "~/client/components/shared/video/morseVideoTypes";
import type {
  MorseVideoIntensity,
  MorseVideoSettings,
  MorseVideoVisualStyle,
} from "~/client/components/shared/video/morseVideoTypes";
import {
  getMorseVideoFormatSupport,
  MORSE_VIDEO_FORMATS,
  type MorseVideoFormat,
} from "~/client/components/shared/video/morseVideoSupport";
import { getAppliedThemeMode, type ThemeMode } from "~/client/theme/themeStorage";
import {
  createBookDownloadPackage,
  getBookDownloadKind,
} from "~/client/components/morse-code-book-translator/bookBundleExport";
import {
  applyExportPunctuationMode,
  estimateBundleBytes,
  formatBytes,
  formatDuration,
} from "~/client/components/morse-code-book-translator/bookDurationEstimate";
import {
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "~/client/components/morse-code-book-translator/bookExportPresets";
import type {
  BookBundleMetadata,
  BookDownloadKind,
  BookExportPart,
  BookExportProgress,
  BookExportSettings,
  BookOutputType,
  BookSplitMode,
} from "~/client/components/morse-code-book-translator/bookExportTypes";
import {
  buildBookAudioPreview,
  morseFromPreviewOffset,
  type BookAudioPreview,
} from "~/client/components/morse-code-book-translator/bookPreviewAudio";
import { segmentBookText } from "~/client/components/morse-code-book-translator/bookSegmentation";
import type { BookSourceSection } from "~/client/components/morse-code-book-translator/bookSourceTypes";
import { buildBookVideoPreview } from "~/client/components/morse-code-book-translator/bookVideoPreview";
import {
  createBookVideoDownloadPackage,
  getBookVideoDownloadKind,
} from "~/client/components/morse-code-book-translator/bookVideoExport";
import {
  detectBookVideoSupport,
  type BookVideoSupport,
} from "~/client/components/morse-code-book-translator/bookVideoSupport";
import {
  getMorseBookSection,
  isMorseBookPublishReady,
} from "~/client/data/morseBooks";
import type {
  MorseBookManifest,
  MorseBookSectionJson,
  MorseBookSectionSummary,
} from "~/client/data/morseBookTypes";

import { createBookTranslatorSourceFromSections } from "./bookTranslatorSource";

const DISPLAY_TEXT_PREVIEW_LIMIT = 3600;
const MORSE_SOURCE_PREVIEW_LIMIT = 1200;
const MORSE_OUTPUT_PREVIEW_LIMIT = 2600;
const MIN_PREVIEW_RESTART_REMAINING_MS = 750;

const IDLE_EXPORT_PROGRESS: BookExportProgress = {
  phase: "idle",
  message: "",
  currentPart: 0,
  totalParts: 0,
};

const splitModeLabels: Record<BookSplitMode, string> = {
  none: "No split",
  duration: "By duration",
  "source-sections": "By source sections",
};

const visualStyleLabels: Record<MorseVideoVisualStyle, string> = {
  lightbulb: "Lightbulb signal",
  dot: "Dot signal",
  "full-frame": "Full-frame flash",
  "morse-text": "Animated Morse signal",
};

const intensityLabels: Record<MorseVideoIntensity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

type SelectionScope = "current" | "selected" | "full";
type DownloadStatus =
  | { kind: "idle"; message: string }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type MorseBookPageProps = {
  book: MorseBookManifest;
  initialSection: MorseBookSectionJson;
  previewMode: "unpublished" | "test-published" | null;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function clippedText(text: string, limit: number) {
  if (text.length <= limit) return { text, truncated: false };
  return { text: `${text.slice(0, limit).trimEnd()}\n...`, truncated: true };
}

function sectionDisplayName(section: MorseBookSectionSummary) {
  return section.title ? `${section.label}: ${section.title}` : section.label;
}

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

function resolveBookVideoBackgroundStyle(
  themeMode: ThemeMode,
): ResolvedMorseVideoBackgroundStyle {
  return themeMode === "dark" ? "dark-morsewords" : "warm-morsewords";
}

function BookCover({ book }: { book: MorseBookManifest }) {
  if (book.cover.src) {
    return (
      <img
        src={book.cover.src}
        alt={book.cover.alt}
        className="aspect-[3/4] w-full max-w-52 rounded-xl object-cover"
      />
    );
  }

  return (
    <div
      aria-label={book.cover.alt}
      data-mw-morse-book-cover-placeholder="true"
      className="mw-static-tile flex aspect-[3/4] w-full max-w-52 flex-col justify-between rounded-xl p-5"
    >
      <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        MorseWords book
      </span>
      <div>
        <p className="mw-heading text-xl font-extrabold leading-tight text-sky-950">
          {book.title}
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-600">
          {book.author.join(", ")}
        </p>
      </div>
    </div>
  );
}

function LayerCheckbox({
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
      className={[
        "flex items-center gap-2 text-sm font-semibold",
        disabled ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-700",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-sky-500"
      />
      <span>{label}</span>
    </label>
  );
}

function sectionIdsForScope({
  activeSectionId,
  book,
  scope,
  selectedSectionIds,
}: {
  activeSectionId: string;
  book: MorseBookManifest;
  scope: SelectionScope;
  selectedSectionIds: Set<string>;
}) {
  if (scope === "current") return [activeSectionId];
  if (scope === "full") {
    const included = book.sections
      .filter((section) => section.includeByDefault)
      .map((section) => section.id);
    return included.length > 0 ? included : [activeSectionId];
  }

  const selected = book.sections
    .filter((section) => selectedSectionIds.has(section.id))
    .map((section) => section.id);
  return selected.length > 0 ? selected : [activeSectionId];
}

function createSourceSectionsForExport(
  sections: MorseBookSectionJson[],
  settings: BookExportSettings,
): BookSourceSection[] {
  let offset = 0;
  return [...sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      const rawText = applyExportPunctuationMode(section.morseSourceText, settings);
      const startOffset = offset;
      const endOffset = startOffset + rawText.length;
      offset = endOffset + 2;
      return {
        title: section.title ?? section.label,
        rawText,
        sourceLabel: section.label,
        startOffset,
        endOffset,
      };
    })
    .filter((section) => section.rawText.trim());
}

function buildBookMetadata(book: MorseBookManifest): BookBundleMetadata {
  return {
    title: book.title,
    author: book.author.join(", "),
    filename: `${book.slug}.txt`,
    sourceType: "txt",
  };
}

function buildDownloadLabel({
  downloadKind,
  exportSettings,
  formatLabel = "WebM",
  outputType,
}: {
  downloadKind: BookDownloadKind;
  exportSettings: BookExportSettings;
  formatLabel?: string;
  outputType: BookOutputType;
}) {
  if (downloadKind === "zip") return "Download ZIP bundle";
  if (outputType === "video") return `Download ${formatLabel}`;
  return `Download ${exportSettings.outputFormat.toUpperCase()}`;
}

function runningDownloadLabel(
  progress: BookExportProgress,
  downloadKind: BookDownloadKind,
  outputType: BookOutputType,
) {
  if (progress.phase === "bundling" || downloadKind === "zip") {
    return "Building ZIP...";
  }
  if (outputType === "video") return "Rendering...";
  if (progress.phase === "encoding") return "Downloading...";
  return "Preparing...";
}

function getSelectedPartSummary(parts: BookExportPart[]) {
  const totalRuntimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  const totalCharacters = parts.reduce(
    (sum, part) => sum + part.cleanedText.length,
    0,
  );
  return { totalRuntimeMs, totalCharacters };
}

export default function MorseBookPage({
  book,
  initialSection,
  previewMode,
}: MorseBookPageProps) {
  const themeMode = useAppliedThemeMode();
  const resolvedVideoBackgroundStyle =
    resolveBookVideoBackgroundStyle(themeMode);
  const previewAudioPlayer = useMorseAudio();
  const previewAudioPlayerRef = React.useRef(previewAudioPlayer);
  const [loadedSections, setLoadedSections] = React.useState(
    () => new Map<string, MorseBookSectionJson>([[initialSection.sectionId, initialSection]]),
  );
  const [activeSectionId, setActiveSectionId] = React.useState(
    initialSection.sectionId,
  );
  const [selectionScope, setSelectionScope] =
    React.useState<SelectionScope>("current");
  const [selectedSectionIds, setSelectedSectionIds] = React.useState(
    () => new Set<string>([initialSection.sectionId]),
  );
  const [sectionStatus, setSectionStatus] = React.useState<"idle" | "loading">(
    "idle",
  );
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [outputType, setOutputType] = React.useState<BookOutputType>("audio");
  const [exportSettings, setExportSettings] = React.useState<BookExportSettings>(
    () => sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS),
  );
  const [videoSettings, setVideoSettings] = React.useState<MorseVideoSettings>(
    () => sanitizeMorseVideoSettings(DEFAULT_MORSE_VIDEO_SETTINGS),
  );
  const [videoSupport, setVideoSupport] =
    React.useState<BookVideoSupport | null>(null);
  const [selectedVideoFormat, setSelectedVideoFormat] =
    React.useState<MorseVideoFormat>("webm");
  const [downloadStatus, setDownloadStatus] = React.useState<DownloadStatus>({
    kind: "idle",
    message: "",
  });
  const [exportProgress, setExportProgress] =
    React.useState<BookExportProgress>(IDLE_EXPORT_PROGRESS);
  const [audioPreviewElapsedMs, setAudioPreviewElapsedMs] = React.useState(0);
  const [audioPreviewPlaying, setAudioPreviewPlaying] = React.useState(false);
  const [videoPreviewElapsedMs, setVideoPreviewElapsedMs] = React.useState(0);
  const [videoPreviewPlaying, setVideoPreviewPlaying] = React.useState(false);

  const audioPreviewIntervalRef = React.useRef<number | null>(null);
  const audioPreviewTimeoutRef = React.useRef<number | null>(null);
  const audioPreviewSessionRef = React.useRef(0);
  const audioPreviewBaseElapsedRef = React.useRef(0);
  const audioPreviewStartedAtRef = React.useRef(0);
  const videoPreviewIntervalRef = React.useRef<number | null>(null);
  const videoPreviewBaseElapsedRef = React.useRef(0);
  const videoPreviewStartedAtRef = React.useRef(0);
  const exportAbortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    previewAudioPlayerRef.current = previewAudioPlayer;
  }, [previewAudioPlayer]);

  React.useEffect(() => {
    setLoadedSections(new Map([[initialSection.sectionId, initialSection]]));
    setActiveSectionId(initialSection.sectionId);
    setSelectedSectionIds(new Set([initialSection.sectionId]));
    setSelectionScope("current");
  }, [book.slug, initialSection]);

  React.useEffect(() => {
    setVideoSupport(detectBookVideoSupport());
  }, []);

  const scopeSectionIds = React.useMemo(
    () =>
      sectionIdsForScope({
        activeSectionId,
        book,
        scope: selectionScope,
        selectedSectionIds,
      }),
    [activeSectionId, book, selectionScope, selectedSectionIds],
  );

  React.useEffect(() => {
    let cancelled = false;
    const missingIds = scopeSectionIds.filter((id) => !loadedSections.has(id));
    if (missingIds.length === 0) {
      setSectionStatus("idle");
      return () => {
        cancelled = true;
      };
    }

    setSectionStatus("loading");
    Promise.all(missingIds.map((id) => getMorseBookSection(book, id)))
      .then((sections) => {
        if (cancelled) return;
        setLoadedSections((current) => {
          const next = new Map(current);
          sections.forEach((section) => {
            if (section) next.set(section.sectionId, section);
          });
          return next;
        });
      })
      .finally(() => {
        if (!cancelled) setSectionStatus("idle");
      });

    return () => {
      cancelled = true;
    };
  }, [book, loadedSections, scopeSectionIds]);

  const publishReady = isMorseBookPublishReady(book);
  const activeSection = loadedSections.get(activeSectionId) ?? initialSection;
  const selectedScopeSections = React.useMemo(
    () =>
      scopeSectionIds
        .map((id) => loadedSections.get(id))
        .filter((section): section is MorseBookSectionJson => Boolean(section))
        .sort((a, b) => a.order - b.order),
    [loadedSections, scopeSectionIds],
  );
  const scopeReady = selectedScopeSections.length === scopeSectionIds.length;
  const translatorSource = React.useMemo(
    () => createBookTranslatorSourceFromSections(book, selectedScopeSections),
    [book, selectedScopeSections],
  );
  const cleanedExportText = React.useMemo(
    () => applyExportPunctuationMode(translatorSource.sourceText, exportSettings),
    [exportSettings, translatorSource.sourceText],
  );
  const exportSourceSections = React.useMemo(
    () => createSourceSectionsForExport(selectedScopeSections, exportSettings),
    [exportSettings, selectedScopeSections],
  );
  const exportParts = React.useMemo(
    () =>
      segmentBookText({
        cleanedText: cleanedExportText,
        settings: exportSettings,
        sourceSections: exportSourceSections,
        sourceTitle: book.title,
      }),
    [book.title, cleanedExportText, exportSettings, exportSourceSections],
  );
  const downloadKind =
    outputType === "video"
      ? getBookVideoDownloadKind(exportParts, exportSettings)
      : getBookDownloadKind(exportParts, exportSettings);
  const selectedVideoFormatSupport = React.useMemo(
    () => getMorseVideoFormatSupport(videoSupport, selectedVideoFormat),
    [selectedVideoFormat, videoSupport],
  );
  const effectiveVideoSupport = React.useMemo(
    () =>
      videoSupport && selectedVideoFormatSupport.supported
        ? {
            ...videoSupport,
            mimeType: selectedVideoFormatSupport.mimeType,
            extension: selectedVideoFormatSupport.extension,
            reason: selectedVideoFormatSupport.reason,
          }
        : videoSupport,
    [selectedVideoFormatSupport, videoSupport],
  );
  const downloadLabel = buildDownloadLabel({
    downloadKind,
    exportSettings,
    formatLabel: selectedVideoFormatSupport.label,
    outputType,
  });
  const partSummary = getSelectedPartSummary(exportParts);
  const estimatedBytes =
    outputType === "video"
      ? 0
      : estimateBundleBytes(
          partSummary.totalRuntimeMs,
          exportSettings,
          exportParts.length,
        );
  const displayPreview = clippedText(
    translatorSource.displayText || activeSection.displayText,
    DISPLAY_TEXT_PREVIEW_LIMIT,
  );
  const morseSourcePreview = clippedText(
    translatorSource.sourceText || activeSection.morseSourceText,
    MORSE_SOURCE_PREVIEW_LIMIT,
  );
  const morseResult = textToMorse(morseSourcePreview.text, {
    returnResult: true,
    unsupportedText: "omit",
  });
  const morseOutputPreview = clippedText(
    morseResult.value,
    MORSE_OUTPUT_PREVIEW_LIMIT,
  );
  const audioPreview = React.useMemo(
    () => buildBookAudioPreview(cleanedExportText, exportSettings),
    [cleanedExportText, exportSettings],
  );
  const videoPreview = React.useMemo(
    () =>
      buildBookVideoPreview(
        videoSettings,
        audioPreview?.sampleText || cleanedExportText,
        {
          charWpm: exportSettings.charWpm,
          farnsworthWpm: exportSettings.farnsworthWpm,
        },
      ),
    [
      audioPreview?.sampleText,
      cleanedExportText,
      exportSettings.charWpm,
      exportSettings.farnsworthWpm,
      videoSettings,
    ],
  );
  const visibleLayerCount =
    (videoSettings.showVisualSignal ? 1 : 0) +
    (videoSettings.showMorseSymbols ? 1 : 0) +
    (videoSettings.showPlainText ? 1 : 0);
  const exportRunning = downloadStatus.kind === "working";
  const activeDownloadLabel = exportRunning
    ? runningDownloadLabel(exportProgress, downloadKind, outputType)
    : downloadLabel;
  const downloadBlockedMessage = publishReady
    ? ""
    : "Downloads are disabled until this book is publish-ready.";
  const videoUnavailable =
    outputType === "video" &&
    (!videoSupport ||
      !videoSupport.supported ||
      !selectedVideoFormatSupport.supported);
  const videoUnavailableMessage = !videoSupport
    ? "Checking video export support."
    : !videoSupport.supported
      ? videoSupport.reason
      : !selectedVideoFormatSupport.supported
        ? selectedVideoFormatSupport.reason
        : "";
  const downloadDisabled =
    !publishReady ||
    !scopeReady ||
    exportParts.length === 0 ||
    exportRunning ||
    videoUnavailable;
  const canShowZipCopy = downloadKind === "zip";
  const selectionLabel =
    selectionScope === "current"
      ? activeSection.label
      : selectionScope === "full"
        ? "Full book default sections"
        : `${scopeSectionIds.length} selected sections`;

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

  const clearVideoPreviewTimer = React.useCallback(() => {
    if (videoPreviewIntervalRef.current !== null) {
      window.clearInterval(videoPreviewIntervalRef.current);
      videoPreviewIntervalRef.current = null;
    }
  }, []);

  const stopAudioPreview = React.useCallback(
    (reset = false) => {
      audioPreviewSessionRef.current += 1;
      clearAudioPreviewTimers();
      previewAudioPlayerRef.current.stop();
      setAudioPreviewPlaying(false);
      if (reset) {
        audioPreviewBaseElapsedRef.current = 0;
        setAudioPreviewElapsedMs(0);
      }
    },
    [clearAudioPreviewTimers],
  );

  const stopVideoPreview = React.useCallback(
    (reset = false) => {
      clearVideoPreviewTimer();
      setVideoPreviewPlaying(false);
      if (reset) {
        videoPreviewBaseElapsedRef.current = 0;
        setVideoPreviewElapsedMs(0);
      }
    },
    [clearVideoPreviewTimer],
  );

  const stopAllPreviews = React.useCallback(
    (reset = false) => {
      stopAudioPreview(reset);
      stopVideoPreview(reset);
    },
    [stopAudioPreview, stopVideoPreview],
  );

  const previewSignature = [
    scopeSectionIds.join(","),
    cleanedExportText.length,
    exportSettings.charWpm,
    exportSettings.farnsworthWpm,
    exportSettings.pitch,
    exportSettings.volume,
    exportSettings.tonePreset,
    outputType,
    videoSettings.visualStyle,
    videoSettings.showVisualSignal,
    videoSettings.showMorseSymbols,
    videoSettings.showPlainText,
  ].join("|");

  React.useEffect(() => {
    stopAllPreviews(true);
  }, [previewSignature, stopAllPreviews]);

  React.useEffect(
    () => () => {
      stopAllPreviews(true);
      exportAbortRef.current?.abort();
    },
    [stopAllPreviews],
  );

  const updateExportSettings = (patch: Partial<BookExportSettings>) => {
    setExportSettings((current) =>
      sanitizeBookExportSettings({
        ...current,
        ...patch,
      }),
    );
  };

  const updateVideoSettings = (patch: Partial<MorseVideoSettings>) => {
    setVideoSettings((current) => {
      const next = sanitizeMorseVideoSettings({ ...current, ...patch });
      if (!next.showVisualSignal && !next.showMorseSymbols && !next.showPlainText) {
        return current;
      }
      return next;
    });
  };

  const handleCopy = async () => {
    setCopyState("idle");
    const result = await copyTextToClipboard(translatorSource.displayText);
    setCopyState(result.ok ? "copied" : "failed");
  };

  const startAudioPreviewFrom = React.useCallback(
    (startElapsedMs = 0) => {
      if (!audioPreview || !previewAudioPlayerRef.current.isSupported) return;
      stopVideoPreview();
      clearAudioPreviewTimers();
      previewAudioPlayerRef.current.stop();
      const safeStartElapsed = Math.max(
        0,
        Math.min(audioPreview.durationMs, startElapsedMs),
      );
      const previewMorse = morseFromPreviewOffset(audioPreview, safeStartElapsed);
      if (!previewMorse.trim()) {
        setAudioPreviewElapsedMs(audioPreview.durationMs);
        setAudioPreviewPlaying(false);
        return;
      }

      const timerSession = audioPreviewSessionRef.current + 1;
      audioPreviewSessionRef.current = timerSession;
      audioPreviewBaseElapsedRef.current = safeStartElapsed;
      audioPreviewStartedAtRef.current = performance.now();
      setAudioPreviewElapsedMs(safeStartElapsed);
      setAudioPreviewPlaying(true);
      audioPreviewIntervalRef.current = window.setInterval(() => {
        if (audioPreviewSessionRef.current !== timerSession) return;
        const nextElapsed =
          audioPreviewBaseElapsedRef.current +
          Math.max(0, performance.now() - audioPreviewStartedAtRef.current);
        setAudioPreviewElapsedMs(Math.min(audioPreview.durationMs, nextElapsed));
      }, 100);
      audioPreviewTimeoutRef.current = window.setTimeout(() => {
        if (audioPreviewSessionRef.current !== timerSession) return;
        clearAudioPreviewTimers();
        setAudioPreviewElapsedMs(audioPreview.durationMs);
        setAudioPreviewPlaying(false);
      }, Math.max(0, audioPreview.durationMs - safeStartElapsed));

      void previewAudioPlayerRef.current
        .play({
          code: previewMorse,
          wpm: exportSettings.charWpm,
          farnsworthWpm: exportSettings.farnsworthWpm,
          hz: exportSettings.pitch,
          volume: exportSettings.volume,
          preset: exportSettings.tonePreset,
          repeat: false,
          flash: false,
          soundEnabled: true,
        })
        .then(() => {
          if (audioPreviewSessionRef.current !== timerSession) return;
          clearAudioPreviewTimers();
          setAudioPreviewElapsedMs(audioPreview.durationMs);
          setAudioPreviewPlaying(false);
        })
        .catch(() => {
          if (audioPreviewSessionRef.current !== timerSession) return;
          clearAudioPreviewTimers();
          setAudioPreviewPlaying(false);
        });
    },
    [
      audioPreview,
      clearAudioPreviewTimers,
      exportSettings.charWpm,
      exportSettings.farnsworthWpm,
      exportSettings.pitch,
      exportSettings.tonePreset,
      exportSettings.volume,
      stopVideoPreview,
    ],
  );

  const handleSeekAudioPreview = React.useCallback(
    (elapsedMs: number) => {
      if (!audioPreview) return;
      const nextElapsed = Math.max(0, Math.min(audioPreview.durationMs, elapsedMs));
      setAudioPreviewElapsedMs(nextElapsed);
      audioPreviewBaseElapsedRef.current = nextElapsed;
      audioPreviewStartedAtRef.current = performance.now();
      if (audioPreviewPlaying) {
        startAudioPreviewFrom(nextElapsed);
      }
    },
    [audioPreview, audioPreviewPlaying, startAudioPreviewFrom],
  );

  const handleScrubAudioPreview = React.useCallback(
    (elapsedMs: number) => {
      if (!audioPreview) return;
      const nextElapsed = Math.max(0, Math.min(audioPreview.durationMs, elapsedMs));
      setAudioPreviewElapsedMs(nextElapsed);
      audioPreviewBaseElapsedRef.current = nextElapsed;
      audioPreviewStartedAtRef.current = performance.now();
    },
    [audioPreview],
  );

  const startVideoPreview = React.useCallback(() => {
    if (!videoPreview) return;
    stopAudioPreview();
    clearVideoPreviewTimer();
    const currentElapsed = Math.max(
      0,
      Math.min(videoPreview.durationMs, videoPreviewElapsedMs),
    );
    const startElapsed =
      videoPreview.durationMs - currentElapsed <=
      MIN_PREVIEW_RESTART_REMAINING_MS
        ? 0
        : currentElapsed;
    videoPreviewBaseElapsedRef.current = startElapsed;
    videoPreviewStartedAtRef.current = performance.now();
    setVideoPreviewElapsedMs(startElapsed);
    setVideoPreviewPlaying(true);
    videoPreviewIntervalRef.current = window.setInterval(() => {
      const nextElapsed =
        videoPreviewBaseElapsedRef.current +
        Math.max(0, performance.now() - videoPreviewStartedAtRef.current);
      if (nextElapsed >= videoPreview.durationMs) {
        setVideoPreviewElapsedMs(videoPreview.durationMs);
        setVideoPreviewPlaying(false);
        clearVideoPreviewTimer();
        return;
      }
      setVideoPreviewElapsedMs(nextElapsed);
    }, 80);
  }, [
    clearVideoPreviewTimer,
    stopAudioPreview,
    videoPreview,
    videoPreviewElapsedMs,
  ]);

  const handleSeekVideoPreview = React.useCallback(
    (elapsedMs: number) => {
      const durationMs = Math.max(1, videoPreview.durationMs);
      const nextElapsed = Math.max(0, Math.min(durationMs, elapsedMs));
      setVideoPreviewElapsedMs(nextElapsed);
      videoPreviewBaseElapsedRef.current = nextElapsed;
      videoPreviewStartedAtRef.current = performance.now();
    },
    [videoPreview.durationMs],
  );

  const handleDownload = async () => {
    if (downloadDisabled) {
      setDownloadStatus({
        kind: "error",
        message:
          downloadBlockedMessage ||
          (videoUnavailable
            ? videoUnavailableMessage || "Video export is unavailable."
            : "Select previewable text before downloading."),
      });
      return;
    }

    exportAbortRef.current?.abort();
    const controller = new AbortController();
    exportAbortRef.current = controller;
    setDownloadStatus({
      kind: "working",
      message: outputType === "video" ? "Starting video download..." : "Starting audio download...",
    });
    setExportProgress({
      phase: "analyzing",
      message: "Preparing selected book text...",
      currentPart: 0,
      totalParts: exportParts.length,
    });

    try {
      const progressHandler = (progress: BookExportProgress) => {
        setExportProgress(progress);
      };
      const metadata = buildBookMetadata(book);
      const result =
        outputType === "video"
          ? await createBookVideoDownloadPackage({
              metadata,
              parts: exportParts,
              exportSettings,
              videoSettings,
              resolvedBackgroundStyle: resolvedVideoBackgroundStyle,
              support: effectiveVideoSupport as BookVideoSupport,
              signal: controller.signal,
              onProgress: progressHandler,
            })
          : await createBookDownloadPackage({
              metadata,
              parts: exportParts,
              settings: exportSettings,
              signal: controller.signal,
              onProgress: progressHandler,
            });
      const download = downloadBlobFile({
        blob: result.blob,
        filename: result.filename,
      });
      if (!download.ok) {
        setDownloadStatus({ kind: "error", message: download.message });
        setExportProgress({
          phase: "failed",
          message: download.message,
          currentPart: exportParts.length,
          totalParts: exportParts.length,
        });
        return;
      }
      setDownloadStatus({
        kind: "success",
        message:
          result.downloadKind === "zip"
            ? "ZIP download started."
            : outputType === "video"
              ? `${selectedVideoFormatSupport.label} download started.`
              : `${exportSettings.outputFormat.toUpperCase()} download started.`,
      });
      setExportProgress({
        phase: "complete",
        message: "Download started.",
        currentPart: exportParts.length,
        totalParts: exportParts.length,
      });
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "Download cancelled."
          : error instanceof Error
            ? error.message
            : "Download failed. Try a shorter section or different settings.";
      setDownloadStatus({ kind: "error", message });
      setExportProgress({
        phase: "failed",
        message,
        currentPart: 0,
        totalParts: exportParts.length,
      });
    } finally {
      exportAbortRef.current = null;
    }
  };

  return (
    <main
      className="mx-auto w-full max-w-[1120px] px-4 pb-14 pt-2 sm:px-6 sm:pt-4 lg:px-8"
      data-mw-morse-book-page="true"
      data-mw-morse-book-publish-ready={publishReady ? "true" : "false"}
      data-mw-morse-book-preview-mode={previewMode ?? "public"}
    >
      <ToolHero
        eyebrow="Morse book foundation"
        title={book.title}
        lead={
          <>
            Choose a generated section, preview cleaned book text as Morse, and
            prepare browser-local Morse audio or video without publishing
            unreviewed source material.
          </>
        }
      />

      <section className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <BookCover book={book} />
        <div className="space-y-5">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {book.source.provider}
              {book.source.gutenbergId ? ` ID ${book.source.gutenbergId}` : ""}
            </p>
            <h2 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
              {book.author.join(", ")}
            </h2>
            {book.description ? (
              <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700">
                {book.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
            <Metric label="Sections" value={formatNumber(book.stats.sectionCount)} />
            <Metric label="Words" value={formatNumber(book.stats.wordCount)} />
            <Metric
              label="Status"
              value={publishReady ? "Publish-ready" : "Not public yet"}
            />
          </div>

          {!publishReady ? (
            <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600">
              Rights review is not complete for this generated artifact. This
              preview is noindex in development/test mode, is not added to
              public navigation or the sitemap, and cannot generate downloads.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
        <ToolPanel label="Choose sections" badge="Lazy JSON">
          <div className="space-y-4 px-3 pb-3">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Scope
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Book scope">
                {([
                  ["current", "Current section"],
                  ["selected", "Selected sections"],
                  ["full", "Full book"],
                ] as const).map(([scope, label]) => (
                  <button
                    key={scope}
                    type="button"
                    className={toolControlButtonClass({
                      active: selectionScope === scope,
                      size: "sm",
                    })}
                    onClick={() => setSelectionScope(scope)}
                    data-mw-morse-book-scope={scope}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {selectionScope === "full" ? (
                <p
                  className="mt-3 text-sm leading-relaxed text-slate-600"
                  data-mw-morse-book-full-warning="true"
                >
                  Full book scope uses default-included sections only. Long
                  exports can take time and may be easier to split after review.
                </p>
              ) : null}
            </div>

            <div className="max-h-[36rem] overflow-y-auto">
              <div className="space-y-2" role="list" aria-label="Book sections">
                {book.sections.map((section) => {
                  const active = activeSectionId === section.id;
                  const selected = selectedSectionIds.has(section.id);
                  return (
                    <div
                      key={section.id}
                      role="listitem"
                      className="grid gap-2 p-1"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSectionId(section.id);
                          setSelectionScope("current");
                        }}
                        className={toolControlButtonClass({
                          active,
                          full: true,
                          size: "sm",
                          hover: "soft",
                        })}
                        data-mw-morse-book-section-id={section.id}
                      >
                        <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                          <span className="truncate">{sectionDisplayName(section)}</span>
                          <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] opacity-75">
                            {section.kind} - {formatNumber(section.wordCount)} words
                            {section.includeByDefault ? " - included" : " - optional"}
                          </span>
                        </span>
                      </button>
                      <label className="flex cursor-pointer items-center gap-2 px-1 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            setSelectedSectionIds((current) => {
                              const next = new Set(current);
                              if (checked) next.add(section.id);
                              else next.delete(section.id);
                              if (next.size === 0) next.add(activeSectionId);
                              return next;
                            });
                            setSelectionScope("selected");
                          }}
                          className="h-4 w-4 accent-sky-500"
                          data-mw-morse-book-section-select={section.id}
                        />
                        <span>Select for multi-section output</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ToolPanel>

        <div className="grid gap-7">
          <ToolPanel
            label="Cleaned reading preview"
            badge={sectionStatus === "loading" ? "Loading" : selectionLabel}
            footer={
              <>
                <ToolButton onClick={handleCopy} className="min-h-10 px-3 py-1.5 text-sm">
                  Copy selected text
                </ToolButton>
                <span className="text-sm text-slate-600">
                  {copyState === "copied"
                    ? "Copied."
                    : copyState === "failed"
                      ? "Copy unavailable in this browser."
                      : "Source and rights notes stay separate from Morse text."}
                </span>
              </>
            }
          >
            <div className="px-4 pb-4">
              <div className="mb-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                <span>{formatNumber(selectedScopeSections.length)} section(s)</span>
                <span>{formatNumber(translatorSource.sourceText.length)} source characters</span>
                <span>{scopeReady ? "Ready" : "Loading sections"}</span>
              </div>
              <pre
                className="max-h-[24rem] overflow-auto whitespace-pre-wrap rounded-xl bg-white/90 p-4 font-mono text-sm leading-relaxed text-slate-950"
                data-mw-morse-book-source-preview="true"
                tabIndex={0}
                aria-label="Cleaned reading preview text"
              >
                {displayPreview.text || "Select a section with readable text."}
              </pre>
              {displayPreview.truncated ? (
                <p className="mt-3 text-sm text-slate-600">
                  Preview is capped for page performance. Downloads use lazy
                  section data for the selected scope.
                </p>
              ) : null}
            </div>
          </ToolPanel>

          <ToolOutputPanel label="Morse preview" badge="Capped">
            <div className="px-4 pb-4">
              <pre
                className="mw-output-soft max-h-[18rem] overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-sky-100"
                data-mw-morse-book-morse-preview="true"
                tabIndex={0}
                aria-label="Morse preview text"
              >
                {morseOutputPreview.text || "Select a section with translatable text."}
              </pre>
              <p className="mw-output-muted mt-3 text-sm text-slate-300">
                Morse preview uses the selected scope and is capped to avoid
                rendering a whole book into the DOM.
                {morseSourcePreview.truncated || morseOutputPreview.truncated
                  ? " The export flow uses the full selected section text."
                  : ""}
              </p>
            </div>
          </ToolOutputPanel>
        </div>
      </section>

      <section
        className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
        data-mw-morse-book-output-foundation="true"
      >
        <ToolPanel label="Preview and download" badge={publishReady ? "Ready" : "Gated"}>
          <div className="space-y-5 px-4 pb-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Output type">
              {(["audio", "video"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={toolControlButtonClass({
                    active: outputType === value,
                    size: "sm",
                  })}
                  onClick={() => setOutputType(value)}
                >
                  {value === "audio" ? "Audio" : "Video"}
                </button>
              ))}
            </div>

            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <Metric label="Parts" value={formatNumber(exportParts.length)} />
              <Metric label="Runtime" value={formatDuration(partSummary.totalRuntimeMs)} />
              <Metric
                label="Estimate"
                value={
                  outputType === "video"
                    ? downloadKind === "zip"
                      ? `${selectedVideoFormatSupport.label} ZIP`
                      : selectedVideoFormatSupport.label
                    : formatBytes(estimatedBytes)
                }
              />
            </div>

            {exportSettings.splitMode !== "none" ? (
              <p
                className="text-sm leading-relaxed text-slate-600"
                data-mw-morse-book-split-warning="true"
              >
                Split mode is active. Direct files are still used when the
                selected scope produces one part and no extras.
              </p>
            ) : null}
            {canShowZipCopy ? (
              <p
                className="text-sm leading-relaxed text-slate-600"
                data-mw-morse-book-zip-warning="true"
              >
                ZIP is shown because the current settings produce multiple
                files or bundled extras.
              </p>
            ) : null}
            {downloadBlockedMessage ? (
              <p
                className="text-sm font-semibold leading-relaxed text-slate-600"
                data-mw-morse-book-download-blocked="true"
              >
                {downloadBlockedMessage}
              </p>
            ) : null}
            {videoUnavailable ? (
              <p className="text-sm leading-relaxed text-slate-600">
                {videoUnavailableMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              {outputType === "video" ? (
                <BookVideoFormatSelect
                  selectedFormat={selectedVideoFormat}
                  support={videoSupport}
                  onChange={setSelectedVideoFormat}
                />
              ) : null}
              <button
                type="button"
                disabled={downloadDisabled}
                onClick={handleDownload}
                data-mw-morse-book-download-label={downloadLabel}
                className={toolControlButtonClass({
                  disabled: downloadDisabled,
                  full: outputType !== "video",
                  tone: downloadDisabled ? "light" : "dark",
                })}
              >
                <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                {activeDownloadLabel}
              </button>
            </div>
            {downloadStatus.message ? (
              <p
                className={[
                  "text-sm leading-relaxed",
                  downloadStatus.kind === "error"
                    ? "font-semibold text-slate-700"
                    : "text-slate-600",
                ].join(" ")}
                role={downloadStatus.kind === "error" ? "alert" : "status"}
                data-mw-morse-book-download-status={downloadStatus.kind}
              >
                {downloadStatus.message}
              </p>
            ) : null}

            {outputType === "audio" ? (
              <AudioPreviewControls
                audioPreview={audioPreview}
                disabled={!audioPreview || !previewAudioPlayer.isSupported}
                elapsedMs={audioPreviewElapsedMs}
                onPlay={() => {
                  const startElapsed =
                    audioPreview &&
                    audioPreviewElapsedMs <
                      audioPreview.durationMs - MIN_PREVIEW_RESTART_REMAINING_MS
                      ? audioPreviewElapsedMs
                      : 0;
                  startAudioPreviewFrom(startElapsed);
                }}
                onScrub={handleScrubAudioPreview}
                onSeek={handleSeekAudioPreview}
                onStop={() => stopAudioPreview()}
                playing={audioPreviewPlaying}
              />
            ) : (
              <VideoPreviewControls
                elapsedMs={videoPreviewElapsedMs}
                onPlay={startVideoPreview}
                onSeek={handleSeekVideoPreview}
                onSeekCommit={handleSeekVideoPreview}
                onStop={() => stopVideoPreview()}
                playing={videoPreviewPlaying}
                preview={videoPreview}
                resolvedBackgroundStyle={resolvedVideoBackgroundStyle}
                settings={videoSettings}
              />
            )}
          </div>
        </ToolPanel>

        <ToolPanel label="Settings" badge="No split default">
          <div className="space-y-6 px-4 pb-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Speed WPM
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={exportSettings.charWpm}
                  onChange={(event) =>
                    updateExportSettings({ charWpm: Number(event.target.value) })
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Farnsworth WPM
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={exportSettings.farnsworthWpm}
                  onChange={(event) =>
                    updateExportSettings({
                      farnsworthWpm: Number(event.target.value),
                    })
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Pitch Hz
                <input
                  type="number"
                  min={120}
                  max={1200}
                  value={exportSettings.pitch}
                  onChange={(event) =>
                    updateExportSettings({ pitch: Number(event.target.value) })
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Volume
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={exportSettings.volume}
                  onChange={(event) =>
                    updateExportSettings({ volume: Number(event.target.value) })
                  }
                  className="mt-1 w-full rounded-lg bg-white px-3 py-2 text-slate-950"
                />
              </label>
            </div>

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Tone preset
              </p>
              <select
                aria-label="Tone preset"
                value={exportSettings.tonePreset}
                onChange={(event) =>
                  updateExportSettings({
                    tonePreset: event.target.value as AudioTonePresetId,
                  })
                }
                className="mt-2 w-full rounded-lg bg-white px-3 py-2 font-semibold text-slate-950"
              >
                {getAudioPresetsForContext("bookExport", {
                  includeCreative: false,
                }).map((preset) => (
                  <option key={preset} value={preset}>
                    {getAudioPresetLabel(preset)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Audio format
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Audio format">
                {(["mp3", "wav"] as const).map((format) => (
                  <button
                    key={format}
                    type="button"
                    className={toolControlButtonClass({
                      active: exportSettings.outputFormat === format,
                      size: "sm",
                    })}
                    onClick={() => updateExportSettings({ outputFormat: format })}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Split mode
              </p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Split mode">
                {(["none", "duration", "source-sections"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={toolControlButtonClass({
                      active: exportSettings.splitMode === mode,
                      size: "sm",
                    })}
                    onClick={() =>
                      updateExportSettings({
                        splitMode: mode,
                        splitAudio: mode !== "none",
                        preferSourceSections: mode === "source-sections",
                      })
                    }
                  >
                    {splitModeLabels[mode]}
                  </button>
                ))}
              </div>
              {exportSettings.splitMode !== "none" ? (
                <label className="mt-3 block text-sm font-semibold text-slate-700">
                  {exportSettings.splitMode === "source-sections"
                    ? "Fallback part length"
                    : "Target part length"}
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={exportSettings.targetPartMinutes}
                    onChange={(event) =>
                      updateExportSettings({
                        targetPartMinutes: Number(event.target.value),
                      })
                    }
                    className="ml-0 mt-1 w-32 rounded-lg bg-white px-3 py-2 text-slate-950 sm:ml-2"
                  />
                  <span className="ml-2 text-sm font-normal text-slate-600">
                    minutes
                  </span>
                </label>
              ) : null}
              {exportSettings.splitMode === "source-sections" ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Source-section splitting uses the selected generated section
                  order. Excluded sections stay out unless you select them.
                </p>
              ) : null}
            </div>

            <VideoSettings
              settings={videoSettings}
              visibleLayerCount={visibleLayerCount}
              onChange={updateVideoSettings}
            />
          </div>
        </ToolPanel>
      </section>

      <section className="mt-10 mw-static-surface rounded-xl p-5">
        <h2 className="mw-heading text-2xl font-extrabold text-sky-950">
          Source and rights notes
        </h2>
        <div className="mt-3 grid gap-4 text-sm leading-relaxed text-slate-700 lg:grid-cols-2">
          <div>
            <p>
              Source material is generated from curated local artifacts, not user
              uploads. Project Gutenberg boilerplate is kept out of the Morse
              source text and rights/source notes are shown separately here.
            </p>
            {book.source.sourceUrl ? (
              <p className="mt-3">
                <a
                  className="font-semibold text-sky-900 underline-offset-4 hover:underline"
                  href={book.source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.source.gutenbergId
                    ? `Original source: Project Gutenberg ebook #${book.source.gutenbergId}`
                    : "View the source text on Project Gutenberg"}
                </a>
              </p>
            ) : null}
          </div>
          <p>
            {book.source.rightsNotes ||
              "No additional rights notes are recorded for this generated book."}
          </p>
        </div>
      </section>

      <div
        hidden
        data-mw-morse-book-translator-source-label={translatorSource.sourceLabel}
        data-mw-morse-book-translator-source-sections={translatorSource.sectionIds.join(
          ",",
        )}
        data-mw-morse-book-translator-source-length={String(
          translatorSource.sourceText.length,
        )}
      />
    </main>
  );
}

function BookVideoFormatSelect({
  onChange,
  selectedFormat,
  support,
}: {
  onChange: (format: MorseVideoFormat) => void;
  selectedFormat: MorseVideoFormat;
  support: BookVideoSupport | null;
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function AudioPreviewControls({
  audioPreview,
  disabled,
  elapsedMs,
  onPlay,
  onScrub,
  onSeek,
  onStop,
  playing,
}: {
  audioPreview: BookAudioPreview | null;
  disabled: boolean;
  elapsedMs: number;
  onPlay: () => void;
  onScrub: (elapsedMs: number) => void;
  onSeek: (elapsedMs: number) => void;
  onStop: () => void;
  playing: boolean;
}) {
  return (
    <section data-testid="book-audio-preview">
      <div>
        <h3 className="text-base font-extrabold text-sky-950">Preview audio</h3>
        <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
          {audioPreview?.label ?? "Select text to preview a capped audio excerpt."}
        </p>
      </div>
      {audioPreview ? (
        <p
          data-testid="book-preview-sample"
          className="mt-3 max-w-[68ch] break-words font-mono text-sm leading-relaxed text-slate-700"
        >
          {audioPreview.sampleText}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <ToolButton
          type="button"
          tone={playing ? "light" : "dark"}
          hover={playing ? "dark" : undefined}
          onClick={playing ? onStop : onPlay}
          disabled={disabled && !playing}
          className="rounded-xl"
        >
          {playing ? (
            <StopIcon size={18} title={undefined} aria-hidden="true" />
          ) : (
            <PlayIcon size={18} title={undefined} aria-hidden="true" />
          )}
          {playing ? "Stop preview" : "Play preview"}
        </ToolButton>
      </div>
      {audioPreview ? (
        <>
          <MorseAudioTimingStrip
            disabled={disabled && !playing}
            elapsedMs={elapsedMs}
            formatTime={formatDuration}
            onSeek={onScrub}
            onSeekCommit={onSeek}
            preview={audioPreview}
          />
          <p
            className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
            data-testid="book-audio-preview-time"
          >
            Preview time {formatDuration(elapsedMs)} /{" "}
            {formatDuration(audioPreview.durationMs)}
          </p>
        </>
      ) : null}
    </section>
  );
}

function VideoPreviewControls({
  elapsedMs,
  onPlay,
  onSeek,
  onSeekCommit,
  onStop,
  playing,
  preview,
  resolvedBackgroundStyle,
  settings,
}: {
  elapsedMs: number;
  onPlay: () => void;
  onSeek: (elapsedMs: number) => void;
  onSeekCommit?: (elapsedMs: number) => void;
  onStop: () => void;
  playing: boolean;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
}) {
  const safeElapsed = Math.max(0, Math.min(Math.max(1, preview.durationMs), elapsedMs));

  return (
    <section data-testid="book-video-preview-workflow">
      <MorseVideoPreviewPanel
        className="mt-4"
        headingId="book-video-preview-heading"
        headingText="Preview video"
        isPlaying={playing}
        preview={preview}
        resolvedBackgroundStyle={resolvedBackgroundStyle}
        settings={settings}
        testIdPrefix="book-video-preview"
        visualElapsedMs={safeElapsed}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <ToolButton
          type="button"
          tone={playing ? "light" : "dark"}
          hover={playing ? "dark" : undefined}
          onClick={playing ? onStop : onPlay}
          className="rounded-xl"
        >
          {playing ? (
            <StopIcon size={18} title={undefined} aria-hidden="true" />
          ) : (
            <PlayIcon size={18} title={undefined} aria-hidden="true" />
          )}
          {playing ? "Stop visual preview" : "Play visual preview"}
        </ToolButton>
      </div>
      <MorseVideoPreviewTimeline
        elapsedMs={safeElapsed}
        onSeek={onSeek}
        onSeekCommit={onSeekCommit}
        preview={preview}
        testIdPrefix="book-video-preview"
      />
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        Visual signal: {settings.showVisualSignal ? "on" : "off"} - Morse
        symbols: {settings.showMorseSymbols ? "on" : "off"} - Plain text:{" "}
        {settings.showPlainText ? "on" : "off"} -{" "}
        {settings.includeAudioTrack ? "Audio track on" : "Audio track off"}.
      </p>
    </section>
  );
}

function VideoSettings({
  onChange,
  settings,
  visibleLayerCount,
}: {
  onChange: (patch: Partial<MorseVideoSettings>) => void;
  settings: MorseVideoSettings;
  visibleLayerCount: number;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Visual style
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">
          Visual style controls the signal or flashing animation. Text shown in
          video controls overlays only.
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Visual style">
          {Object.entries(visualStyleLabels).map(([style, label]) => (
            <button
              key={style}
              type="button"
              className={toolControlButtonClass({
                active: settings.visualStyle === style,
                size: "sm",
              })}
              onClick={() =>
                onChange({
                  visualStyle: style as MorseVideoVisualStyle,
                })
              }
            >
              {label}
            </button>
          ))}
        </div>
        {settings.visualStyle === "full-frame" ? (
          <div
            className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-slate-700"
            data-testid="book-video-full-frame-warning"
          >
            <WarningBadgeIcon
              size={16}
              title={undefined}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-sky-950"
            />
            <p>
              <span className="font-extrabold text-sky-950">Strobe warning:</span>{" "}
              flashing light may be uncomfortable or unsafe for people with
              photosensitive epilepsy or light sensitivity. Turn off Flash or
              use audio-only practice if you are sensitive to strobing.
            </p>
          </div>
        ) : null}
      </div>

      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Text shown in video
        </p>
        <div
          className="mt-3 grid gap-3 sm:grid-cols-2"
          data-mw-morse-book-video-layer-defaults={`${settings.showVisualSignal}:${settings.showMorseSymbols}:${settings.showPlainText}`}
        >
          <LayerCheckbox
            checked={settings.showVisualSignal}
            disabled={settings.showVisualSignal && visibleLayerCount <= 1}
            label="Visual signal"
            onChange={(checked) => onChange({ showVisualSignal: checked })}
          />
          <LayerCheckbox
            checked={settings.showMorseSymbols}
            disabled={settings.showMorseSymbols && visibleLayerCount <= 1}
            label="Morse symbols"
            onChange={(checked) => onChange({ showMorseSymbols: checked })}
          />
          <LayerCheckbox
            checked={settings.showPlainText}
            disabled={settings.showPlainText && visibleLayerCount <= 1}
            label="Plain text"
            onChange={(checked) => onChange({ showPlainText: checked })}
          />
          <LayerCheckbox
            checked={settings.showBranding}
            label="Minimal branding"
            onChange={(checked) => onChange({ showBranding: checked })}
          />
          <LayerCheckbox
            checked={settings.includeAudioTrack}
            label="Audio track"
            onChange={(checked) => onChange({ includeAudioTrack: checked })}
          />
        </div>
      </div>

      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Visual intensity
        </p>
        <div
          className="mt-2 flex flex-wrap gap-2"
          role="group"
          aria-label="Video visual intensity"
        >
          {MORSE_VIDEO_INTENSITIES.map((intensity) => (
            <button
              key={intensity}
              type="button"
              className={toolControlButtonClass({
                active: settings.intensity === intensity,
                size: "sm",
              })}
              onClick={() => onChange({ intensity })}
            >
              {intensityLabels[intensity]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
