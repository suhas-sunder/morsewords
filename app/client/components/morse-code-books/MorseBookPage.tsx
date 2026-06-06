import * as React from "react";

import {
  DownloadIcon,
  LightBulbIcon,
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
import {
  getMorseVideoFrameTextState,
  type ResolvedMorseVideoBackgroundStyle,
} from "~/client/components/shared/video/morseVideoRenderer";
import { getMorseVideoPreviewFrame } from "~/client/components/shared/video/morseVideoPreview";
import type { MorseVideoPreview } from "~/client/components/shared/video/morseVideoPreview";
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
  outputType,
}: {
  downloadKind: BookDownloadKind;
  exportSettings: BookExportSettings;
  outputType: BookOutputType;
}) {
  if (downloadKind === "zip") return "Download ZIP bundle";
  if (outputType === "video") return "Download WebM";
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
  const downloadLabel = buildDownloadLabel({
    downloadKind,
    exportSettings,
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
    outputType === "video" && (!videoSupport || !videoSupport.supported);
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

  const startVideoPreview = React.useCallback(() => {
    if (!videoPreview) return;
    stopAudioPreview();
    clearVideoPreviewTimer();
    const currentElapsed = Math.max(
      0,
      Math.min(videoPreview.durationMs, videoPreviewElapsedMs),
    );
    const startElapsed = currentElapsed >= videoPreview.durationMs ? 0 : currentElapsed;
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
            ? videoSupport?.reason ?? "Video export is unavailable."
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
              support: videoSupport as BookVideoSupport,
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
              ? "WebM download started."
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
                      ? "WebM ZIP"
                      : "WebM"
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
                {videoSupport?.reason}
              </p>
            ) : null}

            <button
              type="button"
              disabled={downloadDisabled}
              onClick={handleDownload}
              data-mw-morse-book-download-label={downloadLabel}
              className={toolControlButtonClass({
                disabled: downloadDisabled,
                full: true,
                tone: downloadDisabled ? "light" : "dark",
              })}
            >
              <DownloadIcon size={18} title={undefined} aria-hidden="true" />
              {activeDownloadLabel}
            </button>
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
                    audioPreview && audioPreviewElapsedMs < audioPreview.durationMs
                      ? audioPreviewElapsedMs
                      : 0;
                  startAudioPreviewFrom(startElapsed);
                }}
                onSeek={handleSeekAudioPreview}
                onStop={() => stopAudioPreview()}
                playing={audioPreviewPlaying}
              />
            ) : (
              <VideoPreviewControls
                elapsedMs={videoPreviewElapsedMs}
                onPlay={startVideoPreview}
                onSeek={handleSeekVideoPreview}
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
  onSeek,
  onStop,
  playing,
}: {
  audioPreview: BookAudioPreview | null;
  disabled: boolean;
  elapsedMs: number;
  onPlay: () => void;
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
          <AudioPreviewTimeline
            disabled={disabled && !playing}
            elapsedMs={elapsedMs}
            onSeek={onSeek}
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

function AudioPreviewTimeline({
  disabled,
  elapsedMs,
  onSeek,
  preview,
}: {
  disabled: boolean;
  elapsedMs: number;
  onSeek: (elapsedMs: number) => void;
  preview: BookAudioPreview;
}) {
  const stripRef = React.useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const durationMs = Math.max(1, preview.durationMs);
  const playheadPercent = Math.max(
    0,
    Math.min(100, (elapsedMs / durationMs) * 100),
  );

  const seekFromClientX = React.useCallback(
    (clientX: number) => {
      const strip = stripRef.current;
      if (!strip) return;
      const rect = strip.getBoundingClientRect();
      const progress = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
      onSeek(Math.max(0, Math.min(1, progress)) * durationMs);
    },
    [durationMs, onSeek],
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      seekFromClientX(event.clientX);
    },
    [disabled, seekFromClientX],
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || disabled) return;
      seekFromClientX(event.clientX);
    },
    [disabled, dragging, seekFromClientX],
  );

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setDragging(false);
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture can already be released by the browser.
      }
    },
    [dragging],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const step = event.shiftKey ? 2_000 : 500;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onSeek(Math.max(0, elapsedMs - step));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onSeek(Math.min(durationMs, elapsedMs + step));
      } else if (event.key === "Home") {
        event.preventDefault();
        onSeek(0);
      } else if (event.key === "End") {
        event.preventDefault();
        onSeek(durationMs);
      }
    },
    [disabled, durationMs, elapsedMs, onSeek],
  );

  return (
    <div className="mt-4 max-w-[900px]" data-testid="book-audio-preview-timeline">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Morse timing strip
        </span>
        <span className="text-xs font-semibold text-slate-600">
          Click or drag to preview another segment
        </span>
      </div>
      <div
        ref={stripRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Audio preview timeline"
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs)}
        aria-valuenow={Math.round(elapsedMs)}
        aria-valuetext={`${formatDuration(elapsedMs)} of ${formatDuration(
          durationMs,
        )}`}
        aria-disabled={disabled ? "true" : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className={[
          "relative mt-2 h-10 w-full overflow-hidden rounded-full bg-slate-950/90",
          disabled
            ? "cursor-not-allowed opacity-65"
            : "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
        ].join(" ")}
      >
        {preview.timeline.events.map((event, index) => {
          const left = (event.startMs / durationMs) * 100;
          const width = Math.max(
            0.16,
            ((event.endMs - event.startMs) / durationMs) * 100,
          );
          const isMark = event.type === "mark";
          const isDash = event.symbol === "-";
          return (
            <span
              key={`${event.startMs}-${event.endMs}-${index}`}
              data-testid={
                isMark
                  ? `book-audio-preview-${isDash ? "dash" : "dit"}`
                  : "book-audio-preview-gap"
              }
              aria-hidden="true"
              className={[
                "absolute top-1/2 block -translate-y-1/2 rounded-full",
                isMark
                  ? isDash
                    ? "h-5 bg-sky-300"
                    : "h-3 bg-sky-200"
                  : "h-1 bg-slate-500/55",
              ].join(" ")}
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-white"
          style={{ left: `calc(${playheadPercent}% - 2px)` }}
        />
      </div>
    </div>
  );
}

function VideoPreviewControls({
  elapsedMs,
  onPlay,
  onSeek,
  onStop,
  playing,
  preview,
  resolvedBackgroundStyle,
  settings,
}: {
  elapsedMs: number;
  onPlay: () => void;
  onSeek: (elapsedMs: number) => void;
  onStop: () => void;
  playing: boolean;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
}) {
  const durationMs = Math.max(1, preview.durationMs);
  const safeElapsed = Math.max(0, Math.min(durationMs, elapsedMs));

  return (
    <section data-testid="book-video-preview-workflow">
      <BookVideoPreviewPanel
        className="mt-4"
        isPlaying={playing}
        preview={preview}
        resolvedBackgroundStyle={resolvedBackgroundStyle}
        settings={settings}
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
      <div className="mt-4 max-w-[900px]" data-testid="book-video-preview-timeline">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Preview time
          </span>
          <span
            className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
            data-testid="book-video-preview-time"
          >
            {formatDuration(safeElapsed)} / {formatDuration(durationMs)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={durationMs}
          step={100}
          value={Math.round(safeElapsed)}
          onInput={(event) => onSeek(Number(event.currentTarget.value))}
          onChange={(event) => onSeek(Number(event.currentTarget.value))}
          aria-label="Video preview timeline"
          className="mt-2 w-full cursor-pointer rounded-full focus:outline-none focus:ring-0"
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        Visual signal: {settings.showVisualSignal ? "on" : "off"} - Morse
        symbols: {settings.showMorseSymbols ? "on" : "off"} - Plain text:{" "}
        {settings.showPlainText ? "on" : "off"} -{" "}
        {settings.includeAudioTrack ? "Audio track on" : "Audio track off"}.
      </p>
    </section>
  );
}

function BookVideoPreviewPanel({
  className = "",
  isPlaying = false,
  preview,
  resolvedBackgroundStyle,
  settings,
  visualElapsedMs = 0,
}: {
  className?: string;
  isPlaying?: boolean;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
  visualElapsedMs?: number;
}) {
  const darkFrame = resolvedBackgroundStyle === "dark-morsewords";
  const frameStyle = darkFrame
    ? { backgroundColor: "#020617", color: "#e0f2fe" }
    : { backgroundColor: "#fffdf8", color: "#08324f" };
  const previewFrame = getMorseVideoPreviewFrame(preview, visualElapsedMs);
  const textState = getMorseVideoFrameTextState(preview.timeline, visualElapsedMs);
  const showTextLayers = settings.showMorseSymbols || settings.showPlainText;
  const textLayerCount =
    (settings.showMorseSymbols ? 1 : 0) + (settings.showPlainText ? 1 : 0);
  const signalVisible = settings.showVisualSignal;
  const textStackClass = signalVisible
    ? "w-full max-w-[48rem] space-y-1 sm:space-y-2"
    : "w-full max-w-[52rem] space-y-3 sm:space-y-4";
  const morseTextClass = signalVisible
    ? "mx-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-base font-bold leading-snug sm:break-words sm:text-2xl sm:whitespace-normal lg:text-3xl"
    : textLayerCount === 1
      ? "mx-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-4xl font-bold leading-tight sm:break-words sm:text-6xl sm:whitespace-normal"
      : "mx-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-3xl font-bold leading-tight sm:break-words sm:text-5xl sm:whitespace-normal";
  const plainTextClass = signalVisible
    ? "mx-auto max-w-[44rem] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-extrabold leading-snug sm:break-words sm:text-xl sm:whitespace-normal lg:text-2xl"
    : textLayerCount === 1
      ? "mx-auto max-w-[52rem] overflow-hidden text-ellipsis whitespace-nowrap text-4xl font-extrabold leading-tight sm:break-words sm:text-6xl sm:whitespace-normal"
      : "mx-auto max-w-[52rem] overflow-hidden text-ellipsis whitespace-nowrap text-3xl font-extrabold leading-tight sm:break-words sm:text-5xl sm:whitespace-normal";

  return (
    <section
      data-testid="book-video-preview"
      data-preview-playing={isPlaying ? "true" : "false"}
      aria-labelledby="book-video-preview-heading"
      className={["space-y-3", className].filter(Boolean).join(" ")}
    >
      <div
        className="flex aspect-video min-h-[13rem] w-full max-w-[900px] flex-col overflow-hidden rounded-xl p-4 sm:min-h-[18rem] sm:p-6"
        style={frameStyle}
        data-testid="book-video-preview-frame"
        data-preview-playing={isPlaying ? "true" : "false"}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 id="book-video-preview-heading" className="text-sm font-extrabold">
            Preview video
          </h3>
          <div className="text-right">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">
              Timed excerpt
            </span>
            {settings.showBranding ? (
              <p
                data-testid="book-video-preview-branding"
                className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] opacity-75 sm:text-[11px]"
              >
                {preview.brandLabel}
              </p>
            ) : null}
          </div>
        </div>
        <div
          className={[
            "flex min-h-0 flex-1 flex-col items-center justify-center py-2 text-center sm:py-5",
            signalVisible ? "gap-2 sm:gap-5" : "gap-3 sm:gap-6",
          ].join(" ")}
        >
          {signalVisible ? (
            <BookVideoPreviewVisual
              preview={preview}
              settings={settings}
              visualElapsedMs={visualElapsedMs}
            />
          ) : null}
          {showTextLayers ? (
            <div
              className={textStackClass}
              data-testid="book-video-preview-text-layers"
              data-active-character={textState.activeCharacter}
              data-active-morse={textState.activeCharacterMorse}
              data-active-word={textState.plainText}
            >
              {settings.showMorseSymbols ? (
                <p
                  data-testid="book-video-preview-morse-overlay"
                  className={morseTextClass}
                >
                  {previewFrame.morseExcerpt}
                </p>
              ) : null}
              {settings.showPlainText ? (
                <p
                  data-testid="book-video-preview-text-overlay"
                  className={plainTextClass}
                >
                  {previewFrame.textExcerpt}
                </p>
              ) : null}
              {textState.activeCharacter ? (
                <p
                  data-testid="book-video-preview-active-token"
                  className="mx-auto max-w-full font-mono text-[11px] font-bold uppercase tracking-[0.14em] opacity-75 sm:text-xs"
                >
                  Current {textState.activeCharacter}{" "}
                  {textState.activeCharacterMorse}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function BookVideoPreviewVisual({
  preview,
  settings,
  visualElapsedMs,
}: {
  preview: MorseVideoPreview;
  settings: MorseVideoSettings;
  visualElapsedMs: number;
}) {
  const frame = getMorseVideoPreviewFrame(preview, visualElapsedMs);
  const markActive = frame.active;
  const intensityClass =
    settings.intensity === "high"
      ? "opacity-100"
      : settings.intensity === "low"
        ? "opacity-60"
        : "opacity-80";

  if (settings.visualStyle === "dot") {
    return (
      <span
        data-testid="book-video-preview-dot"
        data-preview-active={markActive ? "true" : "false"}
        aria-label="Dot preview"
        role="img"
        className={[
          "block h-16 w-16 rounded-full sm:h-36 sm:w-36",
          markActive ? "bg-sky-300" : "bg-slate-400",
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
        data-testid="book-video-preview-full-frame"
        data-preview-active={markActive ? "true" : "false"}
        aria-label="Subdued full-frame flash preview"
        role="img"
        className={[
          "h-16 w-16 rounded-full bg-sky-300/80 sm:h-36 sm:w-36",
          intensityClass,
          markActive ? "ring-4 ring-sky-200/50" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  if (settings.visualStyle === "morse-text") {
    return (
      <div
        data-testid="book-video-preview-morse-text"
        data-preview-active={markActive ? "true" : "false"}
        className={[
          "max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-4xl font-bold tracking-normal sm:text-6xl",
          markActive ? "text-sky-300" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {frame.symbols || preview.sampleMorse}
      </div>
    );
  }

  return (
    <div
      data-testid="book-video-preview-lightbulb"
      data-preview-active={markActive ? "true" : "false"}
      aria-label="Lightbulb preview"
      role="img"
      className={[
        "text-slate-400",
        intensityClass,
        markActive ? "text-sky-300" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <LightBulbIcon
        size="clamp(3.5rem, 17vw, 8.25rem)"
        title={undefined}
        aria-hidden="true"
      />
    </div>
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
