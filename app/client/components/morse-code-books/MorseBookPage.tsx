import * as React from "react";
import { Link } from "react-router";

import {
  DownloadIcon,
  EqualizerIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
  StopIcon,
} from "~/client/assets/svg/Icons";
import {
  downloadBlobFile,
} from "~/client/components/shared/actionOutputUtils";
import AudioSettingsPanel from "~/client/components/shared/AudioSettingsPanel";
import {
  getAudioPresetDefaults,
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
import {
  safeReadStorage,
  safeRemoveStorage,
  safeWriteStorage,
} from "~/client/components/shared/settingsStorage";
import useMorseAudio from "~/client/components/shared/useMorseAudio";
import { textToMorse } from "~/client/components/shared/morseUtils";
import type { ResolvedMorseVideoBackgroundStyle } from "~/client/components/shared/video/morseVideoRenderer";
import type { MorseVideoPreview } from "~/client/components/shared/video/morseVideoPreview";
import {
  MorseAudioTimingStrip,
  MorseLivePreviewFullscreenControl,
  MorseVideoPreviewPanel,
  MorseVideoPreviewTimeline,
} from "~/client/components/shared/video/MorseVideoPreviewControls";
import { getLivePreviewStartDelayMs } from "~/client/components/shared/video/livePreviewPlayback";
import {
  DEFAULT_MORSE_VIDEO_SETTINGS,
  MORSE_LIVE_PLAYER_VISUAL_STYLES,
  MORSE_VIDEO_INTENSITIES,
  sanitizeMorseLivePlayerSettings,
} from "~/client/components/shared/video/morseVideoTypes";
import type {
  MorseVideoIntensity,
  MorseVideoSettings,
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
  BOOK_LONG_EXPORT_KEEP_OPEN_MESSAGE,
  BOOK_LONG_EXPORT_MESSAGE,
  BOOK_OVERSIZED_EXPORT_MESSAGE,
  friendlyBookExportErrorMessage,
} from "~/client/components/morse-code-book-translator/bookExportSafety";
import {
  bookExportProgressDetail as exportProgressDetail,
  bookExportProgressPercent as exportProgressPercent,
} from "~/client/components/morse-code-book-translator/bookExportProgressCopy";
import {
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "~/client/components/morse-code-book-translator/bookExportPresets";
import { buildBookExportPlan } from "~/client/components/morse-code-book-translator/bookExportPlan";
import type {
  BookBundleMetadata,
  BookDownloadKind,
  BookExportPart,
  BookExportProgress,
  BookExportSettings,
  BookSplitMode,
} from "~/client/components/morse-code-book-translator/bookExportTypes";
import {
  buildBookAudioPreview,
  type BookAudioPreview,
} from "~/client/components/morse-code-book-translator/bookPreviewAudio";
import {
  buildLiveMorseVideoPreview,
  buildLivePreviewSegments,
} from "~/client/components/morse-code-book-translator/bookLivePreview";
import {
  buildLivePreviewProgressState,
  clearLivePreviewProgress,
  hashLivePreviewProgressSignature,
  readLivePreviewProgress,
  writeLivePreviewProgress,
} from "~/client/components/morse-code-book-translator/bookLivePreviewProgress";
import type { BookSourceSection } from "~/client/components/morse-code-book-translator/bookSourceTypes";
import {
  getDefaultMorseBookSectionId,
  getMorseBookPublicContent,
  getMorseBookSections,
  isMorseBookPublishReady,
  morseAudiobookPath,
  morseBookPath,
  morseBookPrintPath,
} from "~/client/data/morseBooks";
import { getMorseBookPreviewRuntimeContent } from "~/client/data/morseBookPreviews";
import {
  defaultReadableExcludedMorseBookSectionKinds,
  getDefaultMorseBookLiveSectionId,
  getDefaultMorseBookSectionIds,
  getMorseBookAsideSectionDisplayLabel,
  mainMorseBookStructureLabelPattern,
} from "~/client/data/morseBookSectionDefaults";
import {
  formatMorseBookAuthors,
  getMorseBookAuthorDisplay,
} from "~/client/data/morseBookDisplay";
import type {
  MorseBookLibrarySummary,
  MorseBookManifest,
  MorseBookSectionKind,
  MorseBookSectionJson,
  MorseBookSectionSummary,
} from "~/client/data/morseBookTypes";
import { ROUTES } from "~/client/data/routes";

import { createBookTranslatorSourceFromSections } from "./bookTranslatorSource";

const DISPLAY_TEXT_PREVIEW_LIMIT = 3600;
const MORSE_SOURCE_PREVIEW_LIMIT = 1200;
const MORSE_OUTPUT_PREVIEW_LIMIT = 2600;
const MIN_PREVIEW_RESTART_REMAINING_MS = 750;
const AUDIOBOOK_LIVE_PLAYER_SEGMENT_TARGET_MINUTES = 15;

const IDLE_EXPORT_PROGRESS: BookExportProgress = {
  phase: "idle",
  message: "",
  currentPart: 0,
  totalParts: 0,
};

const splitModeLabels: Record<BookSplitMode, string> = {
  none: "No split",
  duration: "By duration",
};
const visualStyleLabels: Record<
  (typeof MORSE_LIVE_PLAYER_VISUAL_STYLES)[number],
  string
> = {
  lightbulb: "Lightbulb signal",
  dot: "Dot signal",
};

const intensityLabels: Record<MorseVideoIntensity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const metadataLinkClass =
  "font-semibold text-sky-900 underline decoration-sky-900/45 underline-offset-4 hover:decoration-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

type DownloadStatus =
  | { kind: "idle"; message: string }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type MorseBookPageProps = {
  book: MorseBookManifest | null;
  bookSummary: MorseBookLibrarySummary | null;
  initialSection: MorseBookSectionJson | null;
  mode?: "book" | "audiobook";
  previewMode: "unpublished" | "test-published" | null;
};

type MorseBookRuntimeState =
  | {
      book: MorseBookManifest;
      fullBookLoading: boolean;
      initialSection: MorseBookSectionJson;
      status: "ready" | "preview";
      message: "";
    }
  | {
      book: null;
      fullBookLoading: false;
      initialSection: null;
      status: "loading" | "error";
      message: string;
    };

type SavedMorseBookRuntimeSettings = {
  schemaVersion: 1;
  slug: string;
  contentVersion: string;
  contentHash: string;
  selectedSectionIds: string[];
  exportSettings: BookExportSettings;
  videoSettings: MorseVideoSettings;
  livePlayer?: {
    activeSectionId: string;
    activeSegmentIndex: number;
    elapsedMs: number;
    completedSectionIds: string[];
  };
};

const BOOK_RUNTIME_SETTINGS_KEY_PREFIX =
  "morsewords:book-runtime:settings:v1:";
const BOOK_LIVE_PREVIEW_PROGRESS_KEY_PREFIX =
  "morsewords:book-live-preview-progress:v1:";

const LOADING_STATUS_MESSAGES = [
  "Loading book text...",
  "Fetching book data...",
  "Preparing chapters...",
  "Restoring saved settings...",
] as const;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function bookSourceMetadataLabel(source: MorseBookManifest["source"]) {
  return `${source.provider}${source.gutenbergId ? ` ID ${source.gutenbergId}` : ""}`;
}

function bookSourceMetadataHref(source: MorseBookManifest["source"]) {
  const gutenbergId = source.gutenbergId?.trim();
  if (gutenbergId) return `https://www.gutenberg.org/ebooks/${gutenbergId}`;
  return source.sourceUrl?.trim() || "";
}

function clippedText(text: string, limit: number) {
  if (text.length <= limit) return { text, truncated: false };
  return { text: `${text.slice(0, limit).trimEnd()}\n...`, truncated: true };
}

const sectionKindLabels: Record<MorseBookSectionKind, string> = {
  "title-page": "Opening",
  dedication: "Dedication",
  epigraph: "Epigraph",
  preface: "Preface",
  introduction: "Introduction",
  prologue: "Prologue",
  epilogue: "Epilogue",
  part: "Part",
  book: "Book",
  chapter: "Chapter",
  scene: "Scene",
  poem: "Poem",
  letter: "Letter",
  appendix: "Appendix",
  notes: "Notes",
  glossary: "Glossary",
  index: "Index",
  "transcriber-note": "Transcriber note",
  "source-license": "Source note",
  advertisement: "Advertisement",
  unknown: "Part",
};

function sectionDisplayName(section: MorseBookSectionSummary) {
  const asideLabel = getMorseBookAsideSectionDisplayLabel(section);
  if (asideLabel && mainMorseBookStructureLabelPattern.test(section.label)) {
    return asideLabel;
  }
  if (
    asideLabel &&
    defaultReadableExcludedMorseBookSectionKinds.has(section.kind)
  ) {
    return asideLabel;
  }
  return section.title ? `${section.label}: ${section.title}` : section.label;
}

function sectionStateLabel(
  section: MorseBookSectionSummary,
  selected: boolean,
) {
  if (selected) return "Included";
  return section.includeByDefault ? "Not selected" : "Available section";
}

function bookRuntimeSettingsKey(book: MorseBookManifest) {
  return `${BOOK_RUNTIME_SETTINGS_KEY_PREFIX}${book.slug}:${book.contentVersion}:${book.contentHash}`;
}

function bookLivePreviewProgressKey(book: MorseBookManifest) {
  return `${BOOK_LIVE_PREVIEW_PROGRESS_KEY_PREFIX}${book.slug}`;
}

function livePreviewSegmentDurationMs(segment: BookExportPart | null | undefined) {
  return Math.max(1_200, segment?.morseDurationMs ?? 0);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function loadSavedMorseBookRuntimeSettings(
  book: MorseBookManifest,
  defaultSectionIds: string[],
): SavedMorseBookRuntimeSettings | null {
  const raw = safeReadStorage(bookRuntimeSettingsKey(book));
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed) || parsed.schemaVersion !== 1) return null;
    if (
      parsed.slug !== book.slug ||
      parsed.contentVersion !== book.contentVersion ||
      parsed.contentHash !== book.contentHash
    ) {
      return null;
    }

    const validSectionIds = new Set(book.sections.map((section) => section.id));
    const savedSectionIds = Array.isArray(parsed.selectedSectionIds)
      ? parsed.selectedSectionIds.filter(
          (sectionId): sectionId is string =>
            typeof sectionId === "string" && validSectionIds.has(sectionId),
        )
      : defaultSectionIds;
    const hadSavedSections =
      Array.isArray(parsed.selectedSectionIds) &&
      parsed.selectedSectionIds.length > 0;
    const selectedSectionIds =
      hadSavedSections && savedSectionIds.length === 0
        ? defaultSectionIds
        : savedSectionIds;

    return {
      schemaVersion: 1,
      slug: book.slug,
      contentVersion: book.contentVersion,
      contentHash: book.contentHash,
      selectedSectionIds,
      exportSettings: sanitizeBookExportSettings(
        isPlainObject(parsed.exportSettings) ? parsed.exportSettings : {},
      ),
      videoSettings: sanitizeMorseLivePlayerSettings(
        isPlainObject(parsed.videoSettings) ? parsed.videoSettings : {},
      ),
      livePlayer: parseSavedLivePlayer(parsed.livePlayer, validSectionIds),
    };
  } catch {
    return null;
  }
}

function parseSavedLivePlayer(
  value: unknown,
  validSectionIds: Set<string>,
): SavedMorseBookRuntimeSettings["livePlayer"] {
  if (!isPlainObject(value)) return undefined;
  const activeSectionId =
    typeof value.activeSectionId === "string" &&
    validSectionIds.has(value.activeSectionId)
      ? value.activeSectionId
      : "";
  if (!activeSectionId) return undefined;
  const completedSectionIds = Array.isArray(value.completedSectionIds)
    ? value.completedSectionIds.filter(
        (sectionId): sectionId is string =>
          typeof sectionId === "string" && validSectionIds.has(sectionId),
      )
    : [];
  return {
    activeSectionId,
    activeSegmentIndex:
      typeof value.activeSegmentIndex === "number" &&
      Number.isFinite(value.activeSegmentIndex)
        ? Math.max(0, Math.floor(value.activeSegmentIndex))
        : 0,
    elapsedMs:
      typeof value.elapsedMs === "number" && Number.isFinite(value.elapsedMs)
        ? Math.max(0, value.elapsedMs)
        : 0,
    completedSectionIds,
  };
}

function saveMorseBookRuntimeSettings(
  book: MorseBookManifest,
  settings: SavedMorseBookRuntimeSettings,
) {
  return safeWriteStorage(bookRuntimeSettingsKey(book), JSON.stringify(settings));
}

function clearSavedMorseBookRuntimeSettings(book: MorseBookManifest) {
  return safeRemoveStorage(bookRuntimeSettingsKey(book));
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
          {formatMorseBookAuthors(book.author)}
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

function defaultSectionIdsForBook(
  book: MorseBookManifest,
  fallbackSectionId: string,
) {
  return getDefaultMorseBookSectionIds(book, fallbackSectionId);
}

function defaultLiveSectionIdForBook(
  book: MorseBookManifest,
  fallbackSectionId: string,
) {
  return getDefaultMorseBookLiveSectionId(book, fallbackSectionId);
}

function allSectionIdsForBook(book: MorseBookManifest) {
  return book.sections.map((section) => section.id);
}

function selectedSectionIdsForBook(
  book: MorseBookManifest,
  selectedSectionIds: Set<string>,
) {
  return book.sections
    .filter((section) => selectedSectionIds.has(section.id))
    .map((section) => section.id);
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
    author: formatMorseBookAuthors(book.author),
    filename: `${book.slug}.txt`,
    sourceType: "txt",
  };
}

function buildDownloadLabel({
  batchNumber,
  downloadKind,
  exportSettings,
}: {
  batchNumber?: number;
  downloadKind: BookDownloadKind;
  exportSettings: BookExportSettings;
}) {
  if (downloadKind === "zip" && batchNumber) {
    return `Download ZIP batch ${batchNumber}`;
  }
  if (downloadKind === "zip") {
    return "Download MP3 ZIP";
  }
  if (downloadKind === "parts") {
    return "Download MP3 parts";
  }
  return "Download MP3";
}

function runningDownloadLabel(
  progress: BookExportProgress,
  downloadKind: BookDownloadKind,
) {
  if (progress.phase === "analyzing" || progress.phase === "splitting") {
    return "Preparing export...";
  }
  if (progress.phase === "bundling") return "Finalizing download...";
  if (progress.phase === "encoding") return "Rendering audio...";
  return downloadKind === "zip" ? "Preparing ZIP..." : "Preparing export...";
}

function estimatedRenderTimeLabel(
  totalRuntimeMs: number,
  format: BookExportSettings["outputFormat"],
) {
  if (!Number.isFinite(totalRuntimeMs) || totalRuntimeMs <= 0) return "~0s";
  const factor = format === "wav" ? [0.08, 0.18] : [0.12, 0.32];
  const minMs = Math.max(1_000, totalRuntimeMs * factor[0]);
  const maxMs = Math.max(minMs, totalRuntimeMs * factor[1]);
  return `~${formatDuration(minMs)}-${formatDuration(maxMs)}`;
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
  bookSummary,
  initialSection,
  mode = "book",
  previewMode,
}: MorseBookPageProps) {
  const initialRuntimeState = React.useMemo<MorseBookRuntimeState>(() => {
    if (book && initialSection) {
      return {
        book,
        fullBookLoading: false,
        initialSection,
        status: "ready",
        message: "",
      };
    }
    return {
      book: null,
      fullBookLoading: false,
      initialSection: null,
      status: "loading",
      message: "",
    };
  }, [book, initialSection]);
  const [runtimeState, setRuntimeState] =
    React.useState<MorseBookRuntimeState>(initialRuntimeState);
  const [retryKey, setRetryKey] = React.useState(0);

  React.useEffect(() => {
    if (book && initialSection) {
      setRuntimeState({
        book,
        fullBookLoading: false,
        initialSection,
        status: "ready",
        message: "",
      });
      return;
    }
    if (!bookSummary) {
      setRuntimeState({
        book: null,
        fullBookLoading: false,
        initialSection: null,
        status: "error",
        message: "This Morse book could not be found.",
      });
      return;
    }

    let cancelled = false;
    let fullContentReady = false;
    setRuntimeState({
      book: null,
      fullBookLoading: false,
      initialSection: null,
      status: "loading",
      message: "",
    });

    if (mode === "book") {
      getMorseBookPreviewRuntimeContent(bookSummary).then((previewContent) => {
        if (cancelled || fullContentReady || !previewContent) return;
        setRuntimeState({
          book: previewContent.book,
          fullBookLoading: true,
          initialSection: previewContent.initialSection,
          status: "preview",
          message: "",
        });
      });
    }

    getMorseBookPublicContent(bookSummary.slug)
      .then((content) => {
        if (cancelled) return;
        fullContentReady = true;
        if (!content) {
          setRuntimeState({
            book: null,
            fullBookLoading: false,
            initialSection: null,
            status: "error",
            message:
              mode === "audiobook"
                ? "This Morse audiobook is not available right now."
                : "This Morse book is not available right now.",
          });
          return;
        }
        const sectionId = getDefaultMorseBookSectionId(content.manifest);
        const firstSection =
          content.sections.find((section) => section.sectionId === sectionId) ??
          content.sections[0] ??
          null;
        if (!sectionId || !firstSection) {
          setRuntimeState({
            book: null,
            fullBookLoading: false,
            initialSection: null,
            status: "error",
            message:
              mode === "audiobook"
                ? "This Morse audiobook is missing readable sections."
                : "This Morse book is missing readable sections.",
          });
          return;
        }
        setRuntimeState({
          book: content.manifest,
          fullBookLoading: false,
          initialSection: firstSection,
          status: "ready",
          message: "",
        });
      })
      .catch(() => {
        if (cancelled) return;
        fullContentReady = true;
        setRuntimeState({
          book: null,
          fullBookLoading: false,
          initialSection: null,
          status: "error",
          message:
            mode === "audiobook"
              ? "We could not load this Morse audiobook. Check your connection and try again."
              : "We could not load this Morse book. Check your connection and try again.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [book, bookSummary, initialSection, mode, retryKey]);

  if (runtimeState.status !== "ready" && runtimeState.status !== "preview") {
    return (
      <MorseBookRuntimeState
        message={runtimeState.message}
        mode={mode}
        status={runtimeState.status}
        summary={bookSummary}
        onRetry={() => setRetryKey((value) => value + 1)}
      />
    );
  }

  return (
    <MorseBookWorkspace
      book={runtimeState.book}
      fullBookLoading={runtimeState.fullBookLoading}
      initialSection={runtimeState.initialSection}
      mode={mode}
      previewMode={previewMode}
    />
  );
}

function MorseBookRuntimeState({
  message,
  mode,
  onRetry,
  status,
  summary,
}: {
  message: string;
  mode: "book" | "audiobook";
  onRetry: () => void;
  status: "loading" | "error";
  summary: MorseBookLibrarySummary | null;
}) {
  const isAudiobook = mode === "audiobook";
  const title = summary?.title ?? (isAudiobook ? "Morse audiobook" : "Morse book");
  const [loadingStep, setLoadingStep] = React.useState(0);

  React.useEffect(() => {
    if (status !== "loading") return undefined;
    const timer = window.setInterval(() => {
      setLoadingStep((current) => (current + 1) % LOADING_STATUS_MESSAGES.length);
    }, 1_200);
    return () => window.clearInterval(timer);
  }, [status]);

  const loadingMessage = LOADING_STATUS_MESSAGES[loadingStep];

  return (
    <main className="mx-auto w-full max-w-[1120px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <ToolHero
        eyebrow={isAudiobook ? "Morse audiobook" : "Morse book"}
        title={title}
        lead={
          status === "loading"
            ? isAudiobook
              ? "Loading this Morse audiobook and preparing chapter controls."
              : "Loading this Morse book and preparing chapter controls."
            : message
        }
      />
      <section
        className="mw-static-surface mt-6 rounded-xl p-5"
        aria-live="polite"
        data-testid={
          status === "loading" ? "morse-book-loading" : "morse-book-load-error"
        }
      >
        <h2 className="mw-heading text-2xl font-extrabold text-sky-950">
          {status === "loading"
            ? isAudiobook
              ? "Loading audiobook"
              : "Loading book text"
            : isAudiobook
              ? "Audiobook unavailable"
              : "Book text unavailable"}
        </h2>
        <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-slate-700">
          {status === "loading"
            ? "Fetching book data, preparing chapters, and checking saved browser settings."
            : message}
        </p>
        {status === "loading" ? (
          <div
            className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700"
            role="status"
            data-testid="morse-book-loading-status"
          >
            <span
              className="h-2.5 w-2.5 animate-pulse rounded-full bg-sky-950"
              aria-hidden="true"
            />
            <span>{loadingMessage}</span>
          </div>
        ) : null}
        {status === "error" ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <ToolButton
              type="button"
              tone="dark"
              className="rounded-xl"
              onClick={onRetry}
            >
              Retry
            </ToolButton>
            <Link
              to={isAudiobook ? ROUTES.morseAudiobooks : ROUTES.morseBooks}
              className={toolControlButtonClass({ rounded: "xl" })}
            >
              {isAudiobook ? "Back to audiobooks" : "Back to books"}
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function MorseBookWorkspace({
  book,
  fullBookLoading,
  initialSection,
  mode,
  previewMode,
}: {
  book: MorseBookManifest;
  fullBookLoading: boolean;
  initialSection: MorseBookSectionJson;
  mode: "book" | "audiobook";
  previewMode: "unpublished" | "test-published" | null;
}) {
  const isAudiobook = mode === "audiobook";
  const authorDisplay = React.useMemo(
    () => getMorseBookAuthorDisplay(book.author),
    [book.author],
  );
  const sourceMetadataLabel = bookSourceMetadataLabel(book.source);
  const sourceMetadataHref = bookSourceMetadataHref(book.source);
  const themeMode = useAppliedThemeMode();
  const resolvedVideoBackgroundStyle =
    resolveBookVideoBackgroundStyle(themeMode);
  const initialDefaultLiveSectionId = defaultLiveSectionIdForBook(
    book,
    initialSection.sectionId,
  );
  const previewAudioPlayer = useMorseAudio();
  const previewAudioPlayerRef = React.useRef(previewAudioPlayer);
  const [loadedSections, setLoadedSections] = React.useState(
    () => new Map<string, MorseBookSectionJson>([[initialSection.sectionId, initialSection]]),
  );
  const [selectedSectionIds, setSelectedSectionIds] = React.useState(
    () =>
      new Set<string>(
        mode === "audiobook"
          ? [initialSection.sectionId]
          : defaultSectionIdsForBook(book, initialSection.sectionId),
      ),
  );
  const [activeLiveSectionId, setActiveLiveSectionId] = React.useState(
    () => (isAudiobook ? initialSection.sectionId : initialDefaultLiveSectionId),
  );
  const [activeLiveSegmentIndex, setActiveLiveSegmentIndex] = React.useState(0);
  const [completedLiveSectionIds, setCompletedLiveSectionIds] = React.useState(
    () => new Set<string>(),
  );
  const [sectionStatus, setSectionStatus] = React.useState<"idle" | "loading">(
    "idle",
  );
  const [exportSettings, setExportSettings] = React.useState<BookExportSettings>(
    () => sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS),
  );
  const [videoSettings, setVideoSettings] = React.useState<MorseVideoSettings>(
    () => sanitizeMorseLivePlayerSettings(DEFAULT_MORSE_VIDEO_SETTINGS),
  );
  const [downloadStatus, setDownloadStatus] = React.useState<DownloadStatus>({
    kind: "idle",
    message: "",
  });
  const [exportProgress, setExportProgress] =
    React.useState<BookExportProgress>(IDLE_EXPORT_PROGRESS);
  const [exportStartedAtMs, setExportStartedAtMs] = React.useState<number | null>(
    null,
  );
  const [exportElapsedMs, setExportElapsedMs] = React.useState(0);
  const [selectedBatchNumber, setSelectedBatchNumber] = React.useState(1);
  const [audioPreviewElapsedMs, setAudioPreviewElapsedMs] = React.useState(0);
  const [audioPreviewPlaying, setAudioPreviewPlaying] = React.useState(false);
  const [videoPreviewElapsedMs, setVideoPreviewElapsedMs] = React.useState(0);
  const [videoPreviewPlaying, setVideoPreviewPlaying] = React.useState(false);
  const [settingsRestored, setSettingsRestored] = React.useState(false);
  const [savedSettingsStatus, setSavedSettingsStatus] = React.useState("");
  const [runtimeSettingsResetVersion, setRuntimeSettingsResetVersion] =
    React.useState(0);

  const audioPreviewIntervalRef = React.useRef<number | null>(null);
  const audioPreviewTimeoutRef = React.useRef<number | null>(null);
  const audioPreviewSessionRef = React.useRef(0);
  const audioPreviewBaseElapsedRef = React.useRef(0);
  const audioPreviewStartedAtRef = React.useRef(0);
  const videoPreviewIntervalRef = React.useRef<number | null>(null);
  const videoPreviewStartDelayTimeoutRef = React.useRef<number | null>(null);
  const videoPreviewBaseElapsedRef = React.useRef(0);
  const videoPreviewStartedAtRef = React.useRef(0);
  const videoPreviewSessionRef = React.useRef(0);
  const exportAbortRef = React.useRef<AbortController | null>(null);
  const restoredRuntimeSignatureRef = React.useRef<string | null>(null);
  const skipNextRuntimeSettingsSaveRef = React.useRef(false);
  const restoredBookLivePreviewProgressHashRef = React.useRef<string | null>(
    null,
  );
  const skipNextBookLivePreviewProgressSaveRef = React.useRef(false);
  const pendingRestoredLiveElapsedRef = React.useRef<number | null>(null);
  const selectAllDefaultRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    previewAudioPlayerRef.current = previewAudioPlayer;
  }, [previewAudioPlayer]);

  const bookRuntimeSignature = `${book.slug}:${book.contentVersion}:${book.contentHash}:${
    fullBookLoading ? "preview" : "full"
  }:${book.sections.length}`;
  const defaultSectionIds = React.useMemo(
    () => defaultSectionIdsForBook(book, initialSection.sectionId),
    [bookRuntimeSignature, initialSection.sectionId],
  );
  const defaultLiveSectionId = defaultSectionIds[0] ?? initialSection.sectionId;
  const allSectionIds = React.useMemo(
    () => allSectionIdsForBook(book),
    [bookRuntimeSignature],
  );

  React.useEffect(() => {
    if (restoredRuntimeSignatureRef.current === bookRuntimeSignature) return;
    restoredRuntimeSignatureRef.current = bookRuntimeSignature;
    setSettingsRestored(false);
    setLoadedSections(new Map([[initialSection.sectionId, initialSection]]));
    const saved = fullBookLoading
      ? null
      : loadSavedMorseBookRuntimeSettings(book, defaultSectionIds);
    if (saved) {
      const shouldRestoreRuntimeLivePlayer = isAudiobook;
      const savedLiveElapsedMs = shouldRestoreRuntimeLivePlayer
        ? saved.livePlayer?.elapsedMs ?? 0
        : 0;
      pendingRestoredLiveElapsedRef.current =
        isAudiobook && savedLiveElapsedMs > 0 ? savedLiveElapsedMs : null;
      const restoredLiveSectionId = isAudiobook
        ? saved.livePlayer?.activeSectionId ?? initialSection.sectionId
        : saved.selectedSectionIds[0] ?? defaultLiveSectionId;
      setSelectedSectionIds(
        new Set(isAudiobook ? [restoredLiveSectionId] : saved.selectedSectionIds),
      );
      setExportSettings(saved.exportSettings);
      setVideoSettings(saved.videoSettings);
      setActiveLiveSectionId(restoredLiveSectionId);
      setActiveLiveSegmentIndex(
        shouldRestoreRuntimeLivePlayer
          ? saved.livePlayer?.activeSegmentIndex ?? 0
          : 0,
      );
      videoPreviewBaseElapsedRef.current = savedLiveElapsedMs;
      setVideoPreviewElapsedMs(savedLiveElapsedMs);
      setCompletedLiveSectionIds(
        new Set(saved.livePlayer?.completedSectionIds ?? []),
      );
      setSavedSettingsStatus("Restored saved settings for this book.");
    } else {
      pendingRestoredLiveElapsedRef.current = null;
      setSelectedSectionIds(
        new Set(isAudiobook ? [initialSection.sectionId] : defaultSectionIds),
      );
      setExportSettings(sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS));
      setVideoSettings(sanitizeMorseLivePlayerSettings(DEFAULT_MORSE_VIDEO_SETTINGS));
      setActiveLiveSectionId(
        isAudiobook ? initialSection.sectionId : defaultLiveSectionId,
      );
      setActiveLiveSegmentIndex(0);
      setCompletedLiveSectionIds(new Set());
      videoPreviewBaseElapsedRef.current = 0;
      setVideoPreviewElapsedMs(0);
      setSavedSettingsStatus("");
    }
    setDownloadStatus({ kind: "idle", message: "" });
    setExportProgress(IDLE_EXPORT_PROGRESS);
    setSettingsRestored(true);
  }, [
    bookRuntimeSignature,
    defaultLiveSectionId,
    defaultSectionIds,
    fullBookLoading,
    initialSection.sectionId,
    isAudiobook,
  ]);

  const scopeSectionIds = React.useMemo(
    () => selectedSectionIdsForBook(book, selectedSectionIds),
    [book, selectedSectionIds],
  );
  const allSectionsSelected =
    allSectionIds.length > 0 &&
    allSectionIds.every((id) => selectedSectionIds.has(id));
  const allDefaultSectionsSelected =
    defaultSectionIds.length > 0 &&
    defaultSectionIds.every((id) => selectedSectionIds.has(id));
  const someDefaultSectionsSelected = defaultSectionIds.some((id) =>
    selectedSectionIds.has(id),
  );

  React.useEffect(() => {
    if (!selectAllDefaultRef.current) return;
    selectAllDefaultRef.current.indeterminate =
      someDefaultSectionsSelected && !allDefaultSectionsSelected;
  }, [allDefaultSectionsSelected, someDefaultSectionsSelected]);

  const persistedLiveElapsedMs = isAudiobook
    ? Math.floor(videoPreviewElapsedMs / 5_000) * 5_000
    : 0;

  React.useEffect(() => {
    if (!settingsRestored) return;
    if (fullBookLoading) return;
    if (skipNextRuntimeSettingsSaveRef.current) {
      skipNextRuntimeSettingsSaveRef.current = false;
      return;
    }
    const savedForMerge =
      isAudiobook && persistedLiveElapsedMs === 0
        ? loadSavedMorseBookRuntimeSettings(book, defaultSectionIds)?.livePlayer
        : undefined;
    const elapsedMsToSave =
      savedForMerge?.activeSectionId === activeLiveSectionId &&
      (savedForMerge.elapsedMs ?? 0) > 0
        ? savedForMerge.elapsedMs
        : persistedLiveElapsedMs;
    saveMorseBookRuntimeSettings(book, {
      schemaVersion: 1,
      slug: book.slug,
      contentVersion: book.contentVersion,
      contentHash: book.contentHash,
      selectedSectionIds: scopeSectionIds,
      exportSettings,
      videoSettings,
      livePlayer: {
        activeSectionId: activeLiveSectionId,
        activeSegmentIndex: activeLiveSegmentIndex,
        elapsedMs: elapsedMsToSave,
        completedSectionIds: Array.from(completedLiveSectionIds),
      },
    });
  }, [
    activeLiveSectionId,
    activeLiveSegmentIndex,
    book,
    completedLiveSectionIds,
    defaultSectionIds,
    exportSettings,
    fullBookLoading,
    isAudiobook,
    persistedLiveElapsedMs,
    runtimeSettingsResetVersion,
    scopeSectionIds,
    settingsRestored,
    videoSettings,
    videoPreviewElapsedMs,
  ]);

  React.useEffect(() => {
    let cancelled = false;
    if (fullBookLoading) {
      setSectionStatus("idle");
      return () => {
        cancelled = true;
      };
    }
    const sectionIdsToLoad = isAudiobook
      ? [activeLiveSectionId]
      : Array.from(new Set([...scopeSectionIds, activeLiveSectionId]));
    const missingIds = sectionIdsToLoad.filter((id) => !loadedSections.has(id));
    if (missingIds.length === 0) {
      setSectionStatus("idle");
      return () => {
        cancelled = true;
      };
    }

    setSectionStatus("loading");
    getMorseBookSections(book, missingIds)
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
  }, [
    activeLiveSectionId,
    book,
    fullBookLoading,
    isAudiobook,
    loadedSections,
    scopeSectionIds,
  ]);

  const publishReady = isMorseBookPublishReady(book);
  const selectedScopeSections = React.useMemo(
    () =>
      scopeSectionIds
        .map((id) => loadedSections.get(id))
        .filter((section): section is MorseBookSectionJson => Boolean(section))
        .sort((a, b) => a.order - b.order),
    [loadedSections, scopeSectionIds],
  );
  const deferredSelectedScopeSections = React.useDeferredValue(selectedScopeSections);
  const selectionUpdating = deferredSelectedScopeSections !== selectedScopeSections;
  const scopeReady =
    scopeSectionIds.length > 0 &&
    selectedScopeSections.length === scopeSectionIds.length &&
    !selectionUpdating;
  const translatorSource = React.useMemo(
    () => createBookTranslatorSourceFromSections(book, deferredSelectedScopeSections),
    [book, deferredSelectedScopeSections],
  );
  const cleanedExportText = React.useMemo(
    () => applyExportPunctuationMode(translatorSource.sourceText, exportSettings),
    [exportSettings, translatorSource.sourceText],
  );
  const exportSourceSections = React.useMemo(
    () => createSourceSectionsForExport(selectedScopeSections, exportSettings),
    [exportSettings, selectedScopeSections],
  );
  const exportPlan = React.useMemo(
    () =>
      buildBookExportPlan({
        cleanedText: cleanedExportText,
        outputType: "audio",
        settings: exportSettings,
        sourceSections: exportSourceSections,
        sourceTitle: book.title,
        videoSettings,
      }),
    [book.title, cleanedExportText, exportSettings, exportSourceSections, videoSettings],
  );
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
  const downloadKind =
    zipBatchWorkflow
      ? "zip"
      : getBookDownloadKind(exportParts, exportSettings);
  const downloadLabel = buildDownloadLabel({
    batchNumber: zipBatchWorkflow ? selectedExportBatch?.batchNumber : undefined,
    downloadKind,
    exportSettings,
  });
  const partSummary = getSelectedPartSummary(exportParts);
  const estimatedBytes = estimateBundleBytes(
    partSummary.totalRuntimeMs,
    exportSettings,
    exportParts.length,
  );
  const displayPreview = clippedText(
    translatorSource.displayText,
    DISPLAY_TEXT_PREVIEW_LIMIT,
  );
  const morseSourcePreview = clippedText(
    translatorSource.sourceText,
    MORSE_SOURCE_PREVIEW_LIMIT,
  );
  const morseResult = textToMorse(morseSourcePreview.text, {
    returnResult: true,
    unsupportedText: "omit",
    wordSeparator: "slash",
  });
  const morseOutputPreview = clippedText(
    morseResult.value,
    MORSE_OUTPUT_PREVIEW_LIMIT,
  );
  const audioPreview = React.useMemo(
    () => buildBookAudioPreview(cleanedExportText, exportSettings),
    [cleanedExportText, exportSettings],
  );
  const activeLiveSection =
    loadedSections.get(activeLiveSectionId) ??
    (initialSection.sectionId === activeLiveSectionId ? initialSection : null);
  const liveSectionText = React.useMemo(
    () =>
      activeLiveSection
        ? applyExportPunctuationMode(
            activeLiveSection.morseSourceText,
            exportSettings,
          )
        : "",
    [activeLiveSection, exportSettings],
  );
  const livePlayerSettings = React.useMemo(
    () =>
      sanitizeBookExportSettings({
        ...exportSettings,
        outputFormat: "mp3",
        splitMode: "duration",
        splitAudio: true,
        targetPartMinutes: AUDIOBOOK_LIVE_PLAYER_SEGMENT_TARGET_MINUTES,
        includeCleanedText: false,
        includeMorseTranscript: false,
        includeManifest: false,
        includeSettings: false,
        includeReadme: false,
      }),
    [exportSettings],
  );
  const livePlayerPlan = React.useMemo(
    () =>
      buildBookExportPlan({
        cleanedText: liveSectionText,
        outputType: "audio",
        settings: livePlayerSettings,
        sourceSections:
          activeLiveSection && liveSectionText.trim()
            ? createSourceSectionsForExport([activeLiveSection], livePlayerSettings)
            : [],
        sourceTitle: activeLiveSection
          ? activeLiveSection.title
            ? `${activeLiveSection.label}: ${activeLiveSection.title}`
            : activeLiveSection.label
          : book.title,
      }),
    [activeLiveSection, book.sections, book.title, livePlayerSettings, liveSectionText],
  );
  const bookLiveSegments = React.useMemo(
    () =>
      buildLivePreviewSegments({
        cleanedText: cleanedExportText,
        settings: exportSettings,
        sourceSections: exportSourceSections,
        sourceTitle: book.title,
      }),
    [book.title, cleanedExportText, exportSettings, exportSourceSections],
  );
  const liveSegments = isAudiobook ? livePlayerPlan.parts : bookLiveSegments;
  const livePreviewProgressContentHash = React.useMemo(
    () =>
      hashLivePreviewProgressSignature(
        JSON.stringify({
          book: {
            contentHash: book.contentHash,
            contentVersion: book.contentVersion,
            slug: book.slug,
          },
          mode: isAudiobook ? "audiobook" : "book",
          selectedSectionIds: isAudiobook
            ? [activeLiveSectionId]
            : scopeSectionIds,
          sourceHash: hashLivePreviewProgressSignature(
            isAudiobook ? liveSectionText : cleanedExportText,
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
      activeLiveSectionId,
      book.contentHash,
      book.contentVersion,
      book.slug,
      cleanedExportText,
      exportSettings.charWpm,
      exportSettings.farnsworthWpm,
      exportSettings.paragraphPauseMultiplier,
      exportSettings.punctuationMode,
      exportSettings.sentencePauseMultiplier,
      isAudiobook,
      liveSectionText,
      scopeSectionIds,
    ],
  );
  const activeLiveSegment =
    liveSegments[Math.min(activeLiveSegmentIndex, Math.max(0, liveSegments.length - 1))] ??
    null;
  const livePreview = React.useMemo(
    () =>
      buildLiveMorseVideoPreview({
        audioSettings: {
          charWpm: exportSettings.charWpm,
          farnsworthWpm: exportSettings.farnsworthWpm,
        },
        fallbackText: isAudiobook ? liveSectionText : cleanedExportText,
        segment: activeLiveSegment,
        settings: videoSettings,
      }),
    [
      activeLiveSegment,
      cleanedExportText,
      exportSettings.charWpm,
      exportSettings.farnsworthWpm,
      isAudiobook,
      liveSectionText,
      videoSettings,
    ],
  );
  const persistedVideoPreviewProgressMs = React.useMemo(
    () =>
      Math.round(
        Math.max(0, Math.min(livePreview.durationMs, videoPreviewElapsedMs)) /
          1000,
      ) * 1000,
    [livePreview.durationMs, videoPreviewElapsedMs],
  );
  React.useEffect(() => {
    if (liveSegments.length === 0) return;
    if (activeLiveSegmentIndex < liveSegments.length) return;
    setActiveLiveSegmentIndex(0);
    setVideoPreviewElapsedMs(0);
    videoPreviewBaseElapsedRef.current = 0;
  }, [activeLiveSegmentIndex, liveSegments.length]);
  React.useEffect(() => {
    if (isAudiobook || fullBookLoading || !settingsRestored) return;
    if (
      restoredBookLivePreviewProgressHashRef.current ===
      livePreviewProgressContentHash
    ) {
      return;
    }
    restoredBookLivePreviewProgressHashRef.current =
      livePreviewProgressContentHash;
    skipNextBookLivePreviewProgressSaveRef.current = true;

    if (liveSegments.length === 0) {
      setActiveLiveSegmentIndex(0);
      setVideoPreviewElapsedMs(0);
      videoPreviewBaseElapsedRef.current = 0;
      return;
    }

    const restored = readLivePreviewProgress(bookLivePreviewProgressKey(book), {
      contentHash: livePreviewProgressContentHash,
      getSegmentDurationMs: (segmentIndex) =>
        livePreviewSegmentDurationMs(liveSegments[segmentIndex]),
      segmentCount: liveSegments.length,
    });
    const restoredSegmentIndex = restored?.segmentIndex ?? 0;
    const restoredElapsedMs = restored?.elapsedMs ?? 0;
    setActiveLiveSegmentIndex(restoredSegmentIndex);
    setVideoPreviewElapsedMs(restoredElapsedMs);
    videoPreviewBaseElapsedRef.current = restoredElapsedMs;
  }, [
    book,
    fullBookLoading,
    isAudiobook,
    livePreviewProgressContentHash,
    liveSegments,
    settingsRestored,
  ]);
  React.useEffect(() => {
    if (
      isAudiobook ||
      fullBookLoading ||
      !settingsRestored ||
      liveSegments.length === 0 ||
      restoredBookLivePreviewProgressHashRef.current !==
        livePreviewProgressContentHash
    ) {
      return;
    }
    if (skipNextBookLivePreviewProgressSaveRef.current) {
      skipNextBookLivePreviewProgressSaveRef.current = false;
      return;
    }
    const safeSegmentIndex = Math.min(
      activeLiveSegmentIndex,
      Math.max(0, liveSegments.length - 1),
    );
    if (safeSegmentIndex === 0 && persistedVideoPreviewProgressMs === 0) {
      return;
    }
    writeLivePreviewProgress(
      bookLivePreviewProgressKey(book),
      buildLivePreviewProgressState({
        contentHash: livePreviewProgressContentHash,
        elapsedMs: persistedVideoPreviewProgressMs,
        segmentIndex: safeSegmentIndex,
      }),
    );
  }, [
    activeLiveSegmentIndex,
    book,
    fullBookLoading,
    isAudiobook,
    livePreviewProgressContentHash,
    liveSegments.length,
    persistedVideoPreviewProgressMs,
    settingsRestored,
  ]);
  React.useEffect(() => {
    if (!isAudiobook || liveSegments.length === 0) return;
    const restoredElapsedMs = pendingRestoredLiveElapsedRef.current;
    if (restoredElapsedMs === null) return;
    const clampedElapsedMs = Math.max(
      0,
      Math.min(restoredElapsedMs, Math.max(1, livePreview.durationMs)),
    );
    videoPreviewBaseElapsedRef.current = clampedElapsedMs;
    setVideoPreviewElapsedMs(clampedElapsedMs);
    pendingRestoredLiveElapsedRef.current = null;
  }, [activeLiveSectionId, isAudiobook, livePreview.durationMs, liveSegments.length]);
  React.useEffect(() => {
    if (
      !settingsRestored ||
      !isAudiobook ||
      liveSegments.length === 0 ||
      videoPreviewElapsedMs > 0
    ) {
      return;
    }
    const saved = loadSavedMorseBookRuntimeSettings(book, defaultSectionIds)?.livePlayer;
    if (
      saved?.activeSectionId !== activeLiveSectionId ||
      !saved.elapsedMs ||
      saved.elapsedMs <= 0
    ) {
      return;
    }
    const restoredElapsedMs = Math.max(
      0,
      Math.min(saved.elapsedMs, Math.max(1, livePreview.durationMs)),
    );
    videoPreviewBaseElapsedRef.current = restoredElapsedMs;
    setVideoPreviewElapsedMs(restoredElapsedMs);
  }, [
    activeLiveSectionId,
    book,
    defaultSectionIds,
    isAudiobook,
    livePreview.durationMs,
    liveSegments.length,
    settingsRestored,
    videoPreviewElapsedMs,
  ]);
  const activeVisualPreview = livePreview;
  const visibleLayerCount =
    (videoSettings.showVisualSignal ? 1 : 0) +
    (videoSettings.showMorseSymbols ? 1 : 0) +
    (videoSettings.showPlainText ? 1 : 0);
  const exportRunning = downloadStatus.kind === "working";
  const unresolvedOversizedExportPart = exportPlan.unresolvedOversizedPart;
  const oversizedExportMessage = unresolvedOversizedExportPart
    ? BOOK_OVERSIZED_EXPORT_MESSAGE
    : "";
  const totalBatches = exportBatches.length;
  const longExportMessages =
    zipBatchWorkflow
      ? [BOOK_LONG_EXPORT_MESSAGE, BOOK_LONG_EXPORT_KEEP_OPEN_MESSAGE]
      : [];
  const activeDownloadLabel = exportRunning
    ? zipBatchWorkflow && selectedExportBatch
      ? `Rendering ZIP batch ${selectedExportBatch.batchNumber} of ${totalBatches}`
      : runningDownloadLabel(exportProgress, downloadKind)
    : downloadLabel;
  const progressPercent = exportProgressPercent(exportProgress);
  const downloadBlockedMessage = fullBookLoading
    ? "Full book sections are still loading."
    : publishReady
    ? oversizedExportMessage
    : "Downloads are unavailable for this book.";
  const renderEstimateLabel = estimatedRenderTimeLabel(
    partSummary.totalRuntimeMs,
    exportSettings.outputFormat,
  );
  const downloadDisabled =
    !publishReady ||
    fullBookLoading ||
    !scopeReady ||
    exportParts.length === 0 ||
    exportRunning ||
    Boolean(unresolvedOversizedExportPart);
  const canShowZipCopy = downloadKind === "zip";
  const selectionLabel =
    scopeSectionIds.length === 0
      ? "No sections selected"
      : allDefaultSectionsSelected &&
          selectedSectionIds.size === defaultSectionIds.length
        ? "Readable defaults selected"
        : `${formatNumber(scopeSectionIds.length)} selected chapters`;
  const loadingSelectedSections =
    fullBookLoading ||
    scopeSectionIds.length > 0 &&
    (!scopeReady || sectionStatus === "loading" || selectionUpdating);
  const sectionControlsDisabled = fullBookLoading;

  React.useEffect(() => {
    if (!exportRunning || exportStartedAtMs === null) return undefined;
    const updateElapsed = () => {
      setExportElapsedMs(Math.max(0, performance.now() - exportStartedAtMs));
    };
    updateElapsed();
    const timer = window.setInterval(updateElapsed, 500);
    return () => window.clearInterval(timer);
  }, [exportRunning, exportStartedAtMs]);

  const handleSectionSelectionChange = React.useCallback(
    (sectionId: string, checked: boolean) => {
      setSelectedSectionIds((current) => {
        const next = new Set(current);
        if (checked) next.add(sectionId);
        else next.delete(sectionId);
        return next;
      });
    },
    [],
  );

  const handleSelectAllDefaultSections = React.useCallback(
    (checked: boolean) => {
      setSelectedSectionIds((current) => {
        const next = new Set(current);
        if (checked) {
          defaultSectionIds.forEach((id) => next.add(id));
        } else {
          defaultSectionIds.forEach((id) => next.delete(id));
        }
        return next;
      });
    },
    [defaultSectionIds],
  );

  const handleSelectAllSections = React.useCallback(() => {
    setSelectedSectionIds(new Set(allSectionIds));
  }, [allSectionIds]);

  const handleClearSelection = React.useCallback(() => {
    setSelectedSectionIds(new Set());
  }, []);

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
    if (videoPreviewStartDelayTimeoutRef.current !== null) {
      window.clearTimeout(videoPreviewStartDelayTimeoutRef.current);
      videoPreviewStartDelayTimeoutRef.current = null;
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
      videoPreviewSessionRef.current += 1;
      clearVideoPreviewTimer();
      previewAudioPlayerRef.current.stop();
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

  const activeLiveSectionListIndex = book.sections.findIndex(
    (section) => section.id === activeLiveSectionId,
  );

  const activateLiveSection = React.useCallback(
    (sectionId: string) => {
      pendingRestoredLiveElapsedRef.current = null;
      stopVideoPreview(true);
      setActiveLiveSectionId(sectionId);
      setSelectedSectionIds(new Set([sectionId]));
      setActiveLiveSegmentIndex(0);
      setVideoPreviewElapsedMs(0);
      videoPreviewBaseElapsedRef.current = 0;
    },
    [stopVideoPreview],
  );

  const goToPreviousLiveSection = React.useCallback(() => {
    const previous = book.sections[Math.max(0, activeLiveSectionListIndex - 1)];
    if (previous) activateLiveSection(previous.id);
  }, [
    activeLiveSectionListIndex,
    activateLiveSection,
    book.sections,
  ]);

  const goToNextLiveSection = React.useCallback(() => {
    setCompletedLiveSectionIds((current) => {
      const next = new Set(current);
      next.add(activeLiveSectionId);
      return next;
    });
    const nextSection = book.sections[activeLiveSectionListIndex + 1];
    if (nextSection) activateLiveSection(nextSection.id);
  }, [
    activeLiveSectionId,
    activeLiveSectionListIndex,
    activateLiveSection,
    book.sections,
  ]);

  const advanceLivePlayback = React.useCallback(() => {
    if (activeLiveSegmentIndex + 1 < liveSegments.length) {
      stopVideoPreview(true);
      setActiveLiveSegmentIndex((index) => index + 1);
      setVideoPreviewElapsedMs(0);
      videoPreviewBaseElapsedRef.current = 0;
      return;
    }
    if (isAudiobook) goToNextLiveSection();
  }, [
    activeLiveSegmentIndex,
    goToNextLiveSection,
    isAudiobook,
    liveSegments.length,
    stopVideoPreview,
  ]);

  const handleLiveSegmentChange = React.useCallback(
    (segmentIndex: number) => {
      const safeIndex = Math.max(
        0,
        Math.min(segmentIndex, Math.max(0, liveSegments.length - 1)),
      );
      pendingRestoredLiveElapsedRef.current = null;
      stopVideoPreview(true);
      setActiveLiveSegmentIndex(safeIndex);
      setVideoPreviewElapsedMs(0);
      videoPreviewBaseElapsedRef.current = 0;
    },
    [liveSegments.length, stopVideoPreview],
  );

  React.useEffect(() => {
    if (
      isAudiobook ||
      scopeSectionIds.length === 0 ||
      scopeSectionIds.includes(activeLiveSectionId)
    ) {
      return;
    }
    const nextLiveSectionId = scopeSectionIds[0];
    pendingRestoredLiveElapsedRef.current = null;
    stopVideoPreview(true);
    setActiveLiveSectionId(nextLiveSectionId);
    setActiveLiveSegmentIndex(0);
  }, [activeLiveSectionId, isAudiobook, scopeSectionIds, stopVideoPreview]);

  const previewSignature = [
    scopeSectionIds.join(","),
    cleanedExportText.length,
    exportSettings.charWpm,
    exportSettings.farnsworthWpm,
    exportSettings.pitch,
    exportSettings.volume,
    exportSettings.tonePreset,
    videoSettings.visualStyle,
    videoSettings.showVisualSignal,
    videoSettings.showMorseSymbols,
    videoSettings.showPlainText,
  ].join("|");

  React.useEffect(() => {
    stopAudioPreview(true);
    stopVideoPreview(false);
  }, [
    previewSignature,
    stopAudioPreview,
    stopVideoPreview,
  ]);

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

  const handleTonePresetChange = (tonePreset: AudioTonePresetId) => {
    const defaults = getAudioPresetDefaults(tonePreset);
    updateExportSettings({
      tonePreset,
      pitch: defaults.pitchHz,
      volume: defaults.volume,
    });
  };

  const updateVideoSettings = (patch: Partial<MorseVideoSettings>) => {
    setVideoSettings((current) => {
      const next = sanitizeMorseLivePlayerSettings({ ...current, ...patch });
      if (!next.showVisualSignal && !next.showMorseSymbols && !next.showPlainText) {
        return current;
      }
      return next;
    });
  };

  const resetSavedSettings = React.useCallback(() => {
    clearSavedMorseBookRuntimeSettings(book);
    clearLivePreviewProgress(bookLivePreviewProgressKey(book));
    pendingRestoredLiveElapsedRef.current = null;
    restoredBookLivePreviewProgressHashRef.current = null;
    restoredRuntimeSignatureRef.current = bookRuntimeSignature;
    skipNextRuntimeSettingsSaveRef.current = true;
    skipNextBookLivePreviewProgressSaveRef.current = true;
    setRuntimeSettingsResetVersion((version) => version + 1);
    const resetLiveSectionId = isAudiobook
      ? initialSection.sectionId
      : defaultLiveSectionId;
    setSelectedSectionIds(new Set(isAudiobook ? [resetLiveSectionId] : defaultSectionIds));
    setExportSettings(sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS));
    setVideoSettings(sanitizeMorseLivePlayerSettings(DEFAULT_MORSE_VIDEO_SETTINGS));
    setActiveLiveSectionId(resetLiveSectionId);
    setActiveLiveSegmentIndex(0);
    setCompletedLiveSectionIds(new Set());
    setVideoPreviewElapsedMs(0);
    videoPreviewBaseElapsedRef.current = 0;
    setDownloadStatus({ kind: "idle", message: "" });
    setExportProgress(IDLE_EXPORT_PROGRESS);
    setSavedSettingsStatus(
      isAudiobook ? "Saved player progress reset." : "Saved book settings reset.",
    );
  }, [
    book,
    bookRuntimeSignature,
    defaultLiveSectionId,
    defaultSectionIds,
    initialSection.sectionId,
    isAudiobook,
  ]);

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
      if (!audioPreview.sampleMorse.trim()) {
        setAudioPreviewElapsedMs(audioPreview.durationMs);
        setAudioPreviewPlaying(false);
        return;
      }

      const timerSession = audioPreviewSessionRef.current + 1;
      audioPreviewSessionRef.current = timerSession;
      audioPreviewBaseElapsedRef.current = safeStartElapsed;
      setAudioPreviewElapsedMs(safeStartElapsed);
      setAudioPreviewPlaying(true);

      const startAudioClock = (startedAtMs = performance.now()) => {
        if (audioPreviewSessionRef.current !== timerSession) return;
        clearAudioPreviewTimers();
        audioPreviewBaseElapsedRef.current = safeStartElapsed;
        audioPreviewStartedAtRef.current = startedAtMs;
        setAudioPreviewElapsedMs(safeStartElapsed);
        audioPreviewIntervalRef.current = window.setInterval(() => {
          if (audioPreviewSessionRef.current !== timerSession) return;
          const nextElapsed =
            audioPreviewBaseElapsedRef.current +
            Math.max(0, performance.now() - audioPreviewStartedAtRef.current);
          setAudioPreviewElapsedMs(Math.min(audioPreview.durationMs, nextElapsed));
        }, 80);
        audioPreviewTimeoutRef.current = window.setTimeout(() => {
          if (audioPreviewSessionRef.current !== timerSession) return;
          clearAudioPreviewTimers();
          setAudioPreviewElapsedMs(audioPreview.durationMs);
          setAudioPreviewPlaying(false);
        }, Math.max(0, audioPreview.durationMs - safeStartElapsed));
      };

      startAudioClock();
      void previewAudioPlayerRef.current
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

  const startVideoPreview = React.useCallback((requestedElapsedMs?: number) => {
    if (!activeVisualPreview) return;
    stopAudioPreview();
    clearVideoPreviewTimer();
    const requestedElapsed =
      typeof requestedElapsedMs === "number"
        ? requestedElapsedMs
        : videoPreviewElapsedMs;
    const currentElapsed = Math.max(
      0,
      Math.min(activeVisualPreview.durationMs, requestedElapsed),
    );
    const startElapsed =
      activeVisualPreview.durationMs - currentElapsed <=
      MIN_PREVIEW_RESTART_REMAINING_MS
        ? 0
        : currentElapsed;
    const timerSession = videoPreviewSessionRef.current + 1;
    videoPreviewSessionRef.current = timerSession;
    videoPreviewBaseElapsedRef.current = startElapsed;
    setVideoPreviewElapsedMs(startElapsed);
    setVideoPreviewPlaying(true);

    const startVideoClock = (startedAtMs = performance.now()) => {
      if (videoPreviewSessionRef.current !== timerSession) return;
      clearVideoPreviewTimer();
      videoPreviewBaseElapsedRef.current = startElapsed;
      videoPreviewStartedAtRef.current = startedAtMs;
      setVideoPreviewElapsedMs(startElapsed);
      videoPreviewIntervalRef.current = window.setInterval(() => {
        if (videoPreviewSessionRef.current !== timerSession) return;
        const nextElapsed =
          videoPreviewBaseElapsedRef.current +
          Math.max(0, performance.now() - videoPreviewStartedAtRef.current);
        if (nextElapsed >= activeVisualPreview.durationMs) {
          setVideoPreviewElapsedMs(activeVisualPreview.durationMs);
          setVideoPreviewPlaying(false);
          clearVideoPreviewTimer();
          window.setTimeout(advanceLivePlayback, 0);
          return;
        }
        setVideoPreviewElapsedMs(nextElapsed);
      }, 40);
    };

    const playWithAudio =
      videoSettings.includeAudioTrack &&
      previewAudioPlayerRef.current.isSupported &&
      activeVisualPreview.sampleMorse.trim().length > 0;

    const beginPlayback = () => {
      if (videoPreviewSessionRef.current !== timerSession) return;

      if (!playWithAudio) {
        startVideoClock();
        return;
      }

      void previewAudioPlayerRef.current
        .play({
          code: activeVisualPreview.sampleMorse,
          wpm: exportSettings.charWpm,
          farnsworthWpm: exportSettings.farnsworthWpm,
          hz: exportSettings.pitch,
          volume: exportSettings.volume,
          preset: exportSettings.tonePreset,
          repeat: false,
          flash: false,
          soundEnabled: true,
          startElapsedMs: startElapsed,
          onPlaybackStart: startVideoClock,
        })
        .then(() => {
          if (videoPreviewSessionRef.current !== timerSession) return;
          clearVideoPreviewTimer();
          setVideoPreviewElapsedMs(activeVisualPreview.durationMs);
          setVideoPreviewPlaying(false);
          advanceLivePlayback();
        })
        .catch(() => {
          if (videoPreviewSessionRef.current !== timerSession) return;
          clearVideoPreviewTimer();
          setVideoPreviewPlaying(false);
        });
    };

    const startDelayMs = getLivePreviewStartDelayMs(
      startElapsed,
      activeVisualPreview.durationMs,
    );
    if (startDelayMs > 0) {
      videoPreviewStartDelayTimeoutRef.current = window.setTimeout(() => {
        videoPreviewStartDelayTimeoutRef.current = null;
        beginPlayback();
      }, startDelayMs);
      return;
    }

    beginPlayback();
  }, [
    activeVisualPreview,
    clearVideoPreviewTimer,
    exportSettings.charWpm,
    exportSettings.farnsworthWpm,
    exportSettings.pitch,
    exportSettings.tonePreset,
    exportSettings.volume,
    advanceLivePlayback,
    stopAudioPreview,
    videoPreviewElapsedMs,
    videoSettings.includeAudioTrack,
  ]);

  const handleScrubVideoPreview = React.useCallback(
    (elapsedMs: number) => {
      pendingRestoredLiveElapsedRef.current = null;
      const durationMs = Math.max(1, activeVisualPreview.durationMs);
      const nextElapsed = Math.max(0, Math.min(durationMs, elapsedMs));
      setVideoPreviewElapsedMs(nextElapsed);
      videoPreviewBaseElapsedRef.current = nextElapsed;
      videoPreviewStartedAtRef.current = performance.now();
    },
    [activeVisualPreview.durationMs],
  );

  const handleSeekVideoPreview = React.useCallback(
    (elapsedMs: number) => {
      pendingRestoredLiveElapsedRef.current = null;
      const durationMs = Math.max(1, activeVisualPreview.durationMs);
      const nextElapsed = Math.max(0, Math.min(durationMs, elapsedMs));
      setVideoPreviewElapsedMs(nextElapsed);
      videoPreviewBaseElapsedRef.current = nextElapsed;
      videoPreviewStartedAtRef.current = performance.now();
      if (videoPreviewPlaying) {
        startVideoPreview(nextElapsed);
      }
    },
    [activeVisualPreview.durationMs, startVideoPreview, videoPreviewPlaying],
  );

  const cancelDownload = React.useCallback(() => {
    exportAbortRef.current?.abort();
    exportAbortRef.current = null;
    setExportStartedAtMs(null);
    setDownloadStatus({ kind: "error", message: "Download cancelled." });
    setExportProgress({
      phase: "cancelled",
      message: "Download cancelled.",
      currentPart: 0,
      batchNumber: selectedExportBatch?.batchNumber,
      batchPartCount: activeDownloadParts.length,
      batchPartIndex: 0,
      totalBatches,
      totalParts: activeDownloadParts.length,
    });
  }, [activeDownloadParts.length, selectedExportBatch?.batchNumber, totalBatches]);

  const handleDownload = async () => {
    if (downloadDisabled) {
      setDownloadStatus({
        kind: "error",
        message:
          downloadBlockedMessage ||
          "Select previewable text before downloading.",
      });
      return;
    }

    exportAbortRef.current?.abort();
    const controller = new AbortController();
    exportAbortRef.current = controller;
    const startedAtMs = performance.now();
    setExportStartedAtMs(startedAtMs);
    setExportElapsedMs(0);
    setDownloadStatus({
      kind: "working",
      message: "Preparing export...",
    });
    setExportProgress({
      phase: "analyzing",
      message: "Preparing selected book text...",
      batchNumber: selectedExportBatch?.batchNumber,
      batchPartCount: activeDownloadParts.length,
      batchPartIndex: 0,
      currentPart: 0,
      totalBatches,
      totalParts: activeDownloadParts.length,
    });

    try {
      const progressHandler = (progress: BookExportProgress) => {
        setExportProgress(progress);
      };
      const metadata = buildBookMetadata(book);
      const result = await createBookDownloadPackage({
        allParts: exportParts,
        batch: selectedExportBatch ?? undefined,
        metadata,
        parts: activeDownloadParts,
        settings: exportSettings,
        signal: controller.signal,
        totalSelectedRuntimeMs: partSummary.totalRuntimeMs,
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
          currentPart: activeDownloadParts.length,
          totalBatches,
          totalParts: activeDownloadParts.length,
        });
        return;
      }
      setDownloadStatus({
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
      setExportProgress({
        phase: "complete",
        message: "Download started.",
        batchNumber: selectedExportBatch?.batchNumber,
        batchPartCount: activeDownloadParts.length,
        batchPartIndex: activeDownloadParts.length,
        currentPart: activeDownloadParts.length,
        totalBatches,
        totalParts: activeDownloadParts.length,
      });
      if (
        zipBatchWorkflow &&
        selectedExportBatch &&
        selectedExportBatch.batchNumber < totalBatches
      ) {
        setSelectedBatchNumber(selectedExportBatch.batchNumber + 1);
      }
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "Download cancelled."
          : friendlyBookExportErrorMessage(error, "audio");
      setDownloadStatus({ kind: "error", message });
      setExportProgress({
        phase:
          error instanceof DOMException && error.name === "AbortError"
            ? "cancelled"
            : "failed",
        message,
        currentPart: 0,
        totalBatches,
        totalParts: activeDownloadParts.length,
      });
    } finally {
      exportAbortRef.current = null;
      setExportStartedAtMs(null);
    }
  };

  const livePlayerSection = (
    <section
      id="book-live-morse-player"
      className="mt-10 grid scroll-mt-24 gap-7"
      data-testid="morse-book-live-player"
    >
      <ToolPanel label="Live Morse player" badge="Browser playback">
        <div className="space-y-5 px-4 pb-4">
          <VideoPreviewControls
            action={
              <a
                href="#book-mp3-download"
                className={toolControlButtonClass({
                  tone: "light",
                  hover: "dark",
                  rounded: "xl",
                })}
                data-testid="morse-book-live-download-link"
              >
                <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                Download Audiobook MP3
              </a>
            }
            elapsedMs={videoPreviewElapsedMs}
            enableFullscreen
            fullscreenSegmentControl={
              liveSegments.length > 1 ? (
                <label className="min-w-[12rem] text-sm font-semibold text-slate-100">
                  Segment
                  <select
                    value={activeLiveSegmentIndex}
                    onChange={(event) =>
                      handleLiveSegmentChange(Number(event.target.value))
                    }
                    className="ml-0 mt-2 w-full rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-950 hover:bg-white focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:ml-2 sm:mt-0 sm:w-auto"
                    data-testid="morse-book-live-fullscreen-segment-select"
                  >
                    {liveSegments.map((segment, index) => (
                      <option key={segment.index} value={index}>
                        Segment {index + 1} of {liveSegments.length}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null
            }
            headingText="Live Morse player"
            onPlay={startVideoPreview}
            onRestart={() => startVideoPreview(0)}
            onSeek={handleScrubVideoPreview}
            onSeekCommit={handleSeekVideoPreview}
            onStop={() => stopVideoPreview()}
            playLabel="Play live player"
            playing={videoPreviewPlaying}
            preview={livePreview}
            resolvedBackgroundStyle={resolvedVideoBackgroundStyle}
            settings={videoSettings}
            stopLabel="Pause live player"
            timelineAriaLabel="Live player timeline"
          />
          {liveSegments.length > 1 ? (
            <label className="block text-sm font-semibold text-slate-700">
              Segment
              <select
                value={activeLiveSegmentIndex}
                onChange={(event) =>
                  handleLiveSegmentChange(Number(event.target.value))
                }
                className="ml-0 mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:ml-2 sm:mt-0 sm:w-auto"
                data-testid="morse-book-live-segment-select"
              >
                {liveSegments.map((segment, index) => (
                  <option key={segment.index} value={index}>
                    Segment {index + 1} of {liveSegments.length}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </ToolPanel>

      <details className="mt-1">
        <summary className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#fffdf8] px-4 py-2 text-sm font-extrabold text-sky-950 hover:bg-[#fffaf2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
          <EqualizerIcon size={18} title={undefined} aria-hidden="true" />
          Player settings
        </summary>
        <ToolPanel label="Player settings" badge="Saved locally">
          <div className="space-y-6 px-4 pb-4">
            <BookLiveProgressSettingsSummary
              completedValue={formatNumber(completedLiveSectionIds.size)}
              currentValue={
                activeLiveSegment?.title ||
                `${formatNumber(scopeSectionIds.length)} selected section(s)`
              }
              onReset={resetSavedSettings}
              progressValue={`${formatDuration(videoPreviewElapsedMs)} / ${formatDuration(
                livePreview.durationMs,
              )}`}
              savedSettingsStatus={savedSettingsStatus}
              segmentValue={`${Math.min(
                activeLiveSegmentIndex + 1,
                Math.max(1, liveSegments.length),
              )} of ${Math.max(1, liveSegments.length)}`}
            />
            <VideoSettings
              settings={videoSettings}
              visibleLayerCount={visibleLayerCount}
              onChange={updateVideoSettings}
            />
            <BookLiveAudioSettings
              audioSupported={previewAudioPlayer.isSupported}
              exportSettings={exportSettings}
              idPrefix="morse-book-live-player-audio"
              onCharWpmChange={(value) =>
                updateExportSettings({ charWpm: value })
              }
              onFarnsworthWpmChange={(value) =>
                updateExportSettings({ farnsworthWpm: value })
              }
              onPitchChange={(value) => updateExportSettings({ pitch: value })}
              onTonePresetChange={handleTonePresetChange}
              onVolumeChange={(value) => updateExportSettings({ volume: value })}
              videoSettings={videoSettings}
            />
          </div>
        </ToolPanel>
      </details>
    </section>
  );

  return (
    <main
      className="mx-auto w-full max-w-[1120px] px-4 pb-14 pt-2 sm:px-6 sm:pt-4 lg:px-8"
      data-mw-morse-book-page="true"
      data-mw-morse-book-page-mode={mode}
      data-mw-morse-book-available={publishReady ? "true" : "false"}
      data-mw-morse-book-full-loading={fullBookLoading ? "true" : "false"}
      data-mw-morse-book-preview-mode={previewMode ?? "public"}
      data-mw-morse-book-preview-state={fullBookLoading ? "preview" : "ready"}
      data-mw-morse-book-settings-restored={settingsRestored ? "true" : "loading"}
    >
      <ToolHero
        eyebrow={isAudiobook ? "Morse audiobook" : "Morse book"}
        title={book.title}
        lead={
          isAudiobook ? (
            <>
              Watch and listen to this book in Morse code directly in your
              browser. Choose a chapter, scrub within the current segment, and
              continue where you left off.
            </>
          ) : (
            <>
              Export readable book sections by default, choose chapters when you
              need a different scope, preview the Morse text, and download MP3
              audio for offline listening.
            </>
          )
        }
      />

      <section className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        <BookCover book={book} />
        <div
          className={
            !isAudiobook && publishReady
              ? "flex self-stretch flex-col gap-5"
              : "space-y-5"
          }
        >
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              {sourceMetadataHref ? (
                <a
                  href={sourceMetadataHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={metadataLinkClass}
                  data-testid="morse-book-source-metadata-link"
                >
                  {sourceMetadataLabel}
                </a>
              ) : (
                <span data-testid="morse-book-source-metadata-text">
                  {sourceMetadataLabel}
                </span>
              )}
              <span className="mx-2 text-slate-400" aria-hidden="true">
                /
              </span>
              <Link
                to={ROUTES.bookTranslator}
                className="font-semibold text-sky-900 underline decoration-sky-900/45 underline-offset-4 hover:decoration-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              >
                Translate your own text
              </Link>
              {publishReady ? (
                <>
                  <span className="mx-2 text-slate-400" aria-hidden="true">
                    /
                  </span>
                  <Link
                    to={
                      isAudiobook
                        ? morseBookPath(book.slug)
                        : morseAudiobookPath(book.slug)
                    }
                    className="font-semibold text-sky-900 underline decoration-sky-900/45 underline-offset-4 hover:decoration-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    data-testid={
                      isAudiobook
                        ? "morse-book-mp3-download-link"
                        : "morse-book-live-player-link"
                    }
                  >
                    {isAudiobook
                      ? "Open MP3 download page"
                      : "Open live Morse player"}
                  </Link>
                  <span className="mx-2 text-slate-400" aria-hidden="true">
                    /
                  </span>
                  <Link
                    to={morseBookPrintPath(book.slug)}
                    className="font-semibold text-sky-900 underline decoration-sky-900/45 underline-offset-4 hover:decoration-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    data-testid="morse-book-print-link"
                  >
                    Print Morse pages
                  </Link>
                </>
              ) : null}
            </p>
            <h2 className="mw-heading mt-2 text-2xl font-extrabold text-sky-950">
              {authorDisplay.text}
            </h2>
            {authorDisplay.contextText ? (
              <p
                className="mt-1 text-sm font-semibold text-slate-600"
                data-testid="morse-book-author-context"
              >
                {authorDisplay.contextText}
              </p>
            ) : null}
            {book.description ? (
              <p className="mt-3 max-w-[68ch] text-base leading-relaxed text-slate-700">
                {book.description}
              </p>
            ) : null}
          </div>

          {isAudiobook ? (
            <div
              className="mw-static-panel rounded-xl p-4"
              data-testid="morse-audiobook-audio-first-panel"
            >
              <h2 className="mw-heading text-xl font-extrabold text-sky-950">
                Live browser playback
              </h2>
              <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-slate-700">
                Audio and visuals are generated in this browser from the
                approved cleaned book text. This page plays in the browser
                without preparing an offline media file.
              </p>
            </div>
          ) : null}

          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
            <Metric label="Sections" value={formatNumber(book.stats.sectionCount)} />
            <Metric label="Words" value={formatNumber(book.stats.wordCount)} />
            <Metric
              label="Availability"
              value={publishReady ? "Available" : "Unavailable"}
            />
          </div>

          {!isAudiobook && publishReady ? (
            <div className="flex flex-wrap gap-3 lg:mt-auto">
              <a
                href="#book-live-morse-player"
                className={toolControlButtonClass({
                  tone: "dark",
                  rounded: "xl",
                })}
                data-testid="morse-book-view-live-translation-link"
              >
                <PlayIcon size={18} title={undefined} aria-hidden="true" />
                View Live Translation
              </a>
              <a
                href="#book-mp3-download"
                className={toolControlButtonClass({
                  tone: "light",
                  hover: "dark",
                  rounded: "xl",
                })}
                data-testid="morse-book-download-audiobook-link"
              >
                <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                Download Audiobook MP3
              </a>
            </div>
          ) : null}

          {!publishReady ? (
            <p className="max-w-[68ch] text-sm leading-relaxed text-slate-600">
              This book is not available for public downloads.
            </p>
          ) : null}

        </div>
      </section>

      {!isAudiobook ? livePlayerSection : null}

      {!isAudiobook ? (
      <section
        id="book-section-chooser"
        className="mt-10 grid scroll-mt-24 gap-7 lg:grid-cols-[minmax(360px,420px)_minmax(0,1fr)] lg:items-start"
      >
        <ToolPanel
          label={isAudiobook ? "Choose audiobook scope" : "Choose sections"}
          badge={isAudiobook ? "Chapter audio" : "Book sections"}
        >
          <div className="space-y-4 px-3 pb-3">
            <label
              className={[
                "flex items-start gap-3 rounded-lg bg-[#fffdf8]/82 px-3 py-3 text-sm font-semibold text-slate-700",
                sectionControlsDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
              ].join(" ")}
            >
              <input
                ref={selectAllDefaultRef}
                type="checkbox"
                checked={allDefaultSectionsSelected}
                disabled={sectionControlsDisabled}
                onChange={(event) =>
                  handleSelectAllDefaultSections(event.target.checked)
                }
                className="mt-0.5 h-4 w-4 accent-sky-500"
                data-mw-morse-book-select-all-default="true"
              />
              <span className="grid min-w-0 gap-1">
                <span className="text-sky-950">
                  {isAudiobook ? "Use readable defaults" : "Select readable chapters"}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  {formatNumber(defaultSectionIds.length)} default sections
                </span>
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              <ToolButton
                type="button"
                tone="light"
                hover="dark"
                onClick={handleSelectAllSections}
                disabled={sectionControlsDisabled || allSectionsSelected}
                className="min-h-10 rounded-lg px-3 py-1.5 text-sm"
              >
                Select all
              </ToolButton>
              <ToolButton
                type="button"
                tone="light"
                hover="dark"
                onClick={handleClearSelection}
                disabled={sectionControlsDisabled || selectedSectionIds.size === 0}
                className="min-h-10 rounded-lg px-3 py-1.5 text-sm"
              >
                Clear selection
              </ToolButton>
            </div>

            {fullBookLoading ? (
              <div
                className="rounded-lg bg-[#fffdf8]/82 px-3 py-2 text-sm font-semibold text-slate-600"
                role="status"
                data-mw-morse-book-full-loading-status="true"
              >
                Loading full book sections...
              </div>
            ) : null}

            <div className="max-h-[42rem] overflow-y-auto pr-1 lg:max-h-[calc(100vh-10rem)]">
              <div className="space-y-2" role="list" aria-label="Book sections">
                {book.sections.map((section) => {
                  const selected = selectedSectionIds.has(section.id);
                  return (
                    <label
                      key={section.id}
                      role="listitem"
                      className={[
                        "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold",
                        sectionControlsDisabled
                          ? "cursor-not-allowed opacity-70"
                          : "cursor-pointer",
                        selected
                          ? "bg-slate-950 text-sky-100"
                          : "bg-[#fffdf8]/78 text-slate-700 hover:bg-[#fffaf2]",
                      ].join(" ")}
                      data-mw-morse-book-section-id={section.id}
                      data-mw-morse-book-section-row="true"
                      data-mw-morse-book-section-state={sectionStateLabel(
                        section,
                        selected,
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={sectionControlsDisabled}
                        onChange={(event) =>
                          handleSectionSelectionChange(
                            section.id,
                            event.target.checked,
                          )
                        }
                        className="mt-0.5 h-4 w-4 accent-sky-500"
                        data-mw-morse-book-section-select={section.id}
                      />
                      <span className="grid min-w-0 gap-1.5">
                        <span
                          className="break-words text-base leading-snug"
                          data-mw-morse-book-section-label="true"
                        >
                          {sectionDisplayName(section)}
                        </span>
                        <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] opacity-75">
                          <span data-mw-morse-book-section-kind="true">
                            {sectionKindLabels[section.kind]}
                          </span>
                          <span>{formatNumber(section.wordCount)} words</span>
                          <span data-mw-morse-book-section-selection-state="true">
                            {sectionStateLabel(section, selected)}
                          </span>
                        </span>
                      </span>
                    </label>
                  );
                })}
                {fullBookLoading
                  ? Array.from({ length: 4 }, (_, index) => (
                      <div
                        key={`book-section-skeleton-${index}`}
                        role="listitem"
                        className="flex items-start gap-3 rounded-lg bg-[#fffdf8]/62 px-3 py-2.5 text-sm font-semibold text-slate-400"
                        data-mw-morse-book-section-skeleton="true"
                      >
                        <span className="mt-0.5 h-4 w-4 rounded border border-slate-300 bg-white/70" />
                        <span className="grid min-w-0 flex-1 gap-2">
                          <span className="h-4 w-3/4 rounded bg-slate-200/80" />
                          <span className="h-3 w-1/2 rounded bg-slate-200/70" />
                        </span>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </ToolPanel>

        <div className="grid gap-7">
          <ToolPanel
            label={isAudiobook ? "Text preview" : "Cleaned reading preview"}
            badge={loadingSelectedSections ? "Loading" : selectionLabel}
          >
            <div className="px-4 pb-4">
              <div className="mb-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                <span>
                  {formatNumber(scopeSectionIds.length)} selected chapter(s)
                </span>
                <span>{formatNumber(translatorSource.sourceText.length)} source characters</span>
                <span>{scopeReady ? "Ready" : "Loading sections"}</span>
              </div>
              {loadingSelectedSections ? (
                <div
                  className="mb-3 rounded-lg bg-[#fffdf8]/82 px-3 py-2 text-sm font-semibold text-slate-700"
                  role="status"
                  data-mw-morse-book-loading-sections="true"
                >
                  Loading selected book sections...
                </div>
              ) : null}
              <pre
                className="max-h-[24rem] overflow-auto whitespace-pre-wrap rounded-xl bg-white/90 p-4 font-mono text-sm leading-relaxed text-slate-950"
                data-mw-morse-book-source-preview="true"
                tabIndex={0}
                aria-label="Cleaned reading preview text"
              >
                {displayPreview.text || "Select a section with readable text."}
              </pre>
            </div>
          </ToolPanel>

          <ToolOutputPanel
            label={isAudiobook ? "Morse transcript preview" : "Morse preview"}
            badge="Capped"
          >
            <div className="px-4 pb-4">
              <pre
                className="mw-output-soft max-h-[18rem] overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-sky-100"
                data-mw-morse-book-morse-preview="true"
                tabIndex={0}
                aria-label="Morse preview text"
              >
                {morseOutputPreview.text || "Select a section with translatable text."}
              </pre>
            </div>
          </ToolOutputPanel>
        </div>
      </section>
      ) : null}

      {isAudiobook ? (
        <section
          className="mt-10 grid gap-7"
          data-testid="morse-book-live-player"
        >
          <ToolPanel label="Live Morse player" badge="Browser playback">
            <div className="space-y-5 px-4 pb-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <label className="block text-sm font-semibold text-slate-700">
                  Chapter or section
                  <select
                    value={activeLiveSectionId}
                    onChange={(event) => activateLiveSection(event.target.value)}
                    className="mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    data-testid="morse-book-live-section-select"
                  >
                    {book.sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {sectionDisplayName(section)}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-wrap gap-2">
                  <ToolButton
                    type="button"
                    tone="light"
                    hover="dark"
                    onClick={goToPreviousLiveSection}
                    disabled={
                      activeLiveSectionListIndex <= 0 &&
                      activeLiveSegmentIndex === 0
                    }
                    className="rounded-xl"
                  >
                    Previous section
                  </ToolButton>
                  <ToolButton
                    type="button"
                    tone="light"
                    hover="dark"
                    onClick={goToNextLiveSection}
                    disabled={
                      activeLiveSectionListIndex >= book.sections.length - 1 &&
                      activeLiveSegmentIndex >= Math.max(0, liveSegments.length - 1)
                    }
                    className="rounded-xl"
                  >
                    Next section
                  </ToolButton>
                </div>
              </div>
              <VideoPreviewControls
                elapsedMs={videoPreviewElapsedMs}
                headingText="Live Morse player"
                onPlay={startVideoPreview}
                onRestart={() => startVideoPreview(0)}
                onSeek={handleScrubVideoPreview}
                onSeekCommit={handleSeekVideoPreview}
                onStop={() => stopVideoPreview()}
                playLabel="Play live player"
                playing={videoPreviewPlaying}
                preview={livePreview}
                resolvedBackgroundStyle={resolvedVideoBackgroundStyle}
                settings={videoSettings}
                stopLabel="Pause live player"
                timelineAriaLabel="Live player timeline"
              />
              <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
                <Metric
                  label="Current"
                  value={
                    activeLiveSection
                      ? sectionDisplayName({
                          id: activeLiveSection.sectionId,
                          kind: activeLiveSection.kind,
                          label: activeLiveSection.label,
                          title: activeLiveSection.title,
                          order: activeLiveSection.order,
                          includeByDefault: true,
                          characterCount: activeLiveSection.characterCount,
                          wordCount: activeLiveSection.wordCount,
                          estimatedTypingMinutes:
                            activeLiveSection.estimatedTypingMinutes,
                          estimatedListeningMinutes:
                            activeLiveSection.estimatedListeningMinutes,
                          morseCharacterEstimate:
                            activeLiveSection.morseCharacterEstimate,
                          textPreview: activeLiveSection.textPreview,
                          sectionJsonPath: "",
                        })
                      : "Loading"
                  }
                />
                <Metric
                  label="Progress"
                  value={`${formatDuration(videoPreviewElapsedMs)} / ${formatDuration(
                    livePreview.durationMs,
                  )}`}
                />
                <Metric
                  label="Segment"
                  value={`${Math.min(
                    activeLiveSegmentIndex + 1,
                    Math.max(1, liveSegments.length),
                  )} of ${Math.max(1, liveSegments.length)}`}
                />
                <Metric
                  label="Completed"
                  value={formatNumber(completedLiveSectionIds.size)}
                />
              </dl>
              {liveSegments.length > 1 ? (
                <p className="text-sm leading-relaxed text-slate-600">
                  This long section is split into browser-safe live playback
                  segments. The segment changes automatically when playback
                  reaches the end.
                </p>
              ) : null}
            </div>
          </ToolPanel>

          <ToolPanel label="Player settings" badge="Saved locally">
            <div className="space-y-6 px-4 pb-4">
              <BookLiveProgressSettingsSummary
                completedValue={formatNumber(completedLiveSectionIds.size)}
                currentValue={
                  activeLiveSection
                    ? sectionDisplayName({
                        id: activeLiveSection.sectionId,
                        kind: activeLiveSection.kind,
                        label: activeLiveSection.label,
                        title: activeLiveSection.title,
                        order: activeLiveSection.order,
                        includeByDefault: true,
                        characterCount: activeLiveSection.characterCount,
                        wordCount: activeLiveSection.wordCount,
                        estimatedTypingMinutes:
                          activeLiveSection.estimatedTypingMinutes,
                        estimatedListeningMinutes:
                          activeLiveSection.estimatedListeningMinutes,
                        morseCharacterEstimate:
                          activeLiveSection.morseCharacterEstimate,
                        textPreview: activeLiveSection.textPreview,
                        sectionJsonPath: "",
                      })
                    : "Loading"
                }
                onReset={resetSavedSettings}
                progressValue={`${formatDuration(videoPreviewElapsedMs)} / ${formatDuration(
                  livePreview.durationMs,
                )}`}
                savedSettingsStatus={savedSettingsStatus}
                segmentValue={`${Math.min(
                  activeLiveSegmentIndex + 1,
                  Math.max(1, liveSegments.length),
                )} of ${Math.max(1, liveSegments.length)}`}
              />
              <VideoSettings
                settings={videoSettings}
                visibleLayerCount={visibleLayerCount}
                onChange={updateVideoSettings}
              />
              <BookLiveAudioSettings
                audioSupported={previewAudioPlayer.isSupported}
                exportSettings={exportSettings}
                idPrefix="morse-audiobook-live-player-audio"
                onCharWpmChange={(value) =>
                  updateExportSettings({ charWpm: value })
                }
                onFarnsworthWpmChange={(value) =>
                  updateExportSettings({ farnsworthWpm: value })
                }
                onPitchChange={(value) => updateExportSettings({ pitch: value })}
                onTonePresetChange={handleTonePresetChange}
                onVolumeChange={(value) =>
                  updateExportSettings({ volume: value })
                }
                videoSettings={videoSettings}
              />
              <Link
                to={morseBookPath(book.slug)}
                className={toolControlButtonClass({
                  tone: "dark",
                  rounded: "xl",
                })}
                data-testid="morse-book-live-download-link"
              >
                <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                Download MP3
              </Link>
            </div>
          </ToolPanel>
        </section>
      ) : (
      <section
        id="book-mp3-download"
        className="mt-10 grid scroll-mt-24 gap-7"
        data-mw-morse-book-output-foundation="true"
      >
        <ToolPanel
          label="Preview and download"
          badge={publishReady ? "Ready" : "Unavailable"}
        >
          <div className="space-y-5 px-4 pb-4">
            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <Metric label="Parts" value={formatNumber(exportParts.length)} />
              <Metric label="Runtime" value={formatDuration(partSummary.totalRuntimeMs)} />
              <Metric
                label="Estimate"
                value={formatBytes(estimatedBytes)}
                testId="morse-book-output-estimate"
              />
            </div>

            {renderEstimateLabel ? (
              <p
                className="text-sm leading-relaxed text-slate-600"
                data-mw-morse-book-render-estimate="true"
              >
                Estimated render time: {renderEstimateLabel}
              </p>
            ) : null}

            {exportSettings.splitMode !== "none" ? (
              <p
                className="text-sm leading-relaxed text-slate-600"
                data-mw-morse-book-split-warning="true"
              >
                Split mode is active. Direct files are still used when the
                selected chapters produce one part and no extras.
                </p>
              ) : null}
            {longExportMessages.map((message) => (
              <p
                key={message}
                className="text-sm font-semibold leading-relaxed text-slate-600"
                data-mw-morse-book-long-export-note="true"
              >
                {message}
              </p>
            ))}
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

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Split mode
              </p>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="group"
                aria-label="Split mode"
              >
                {(["none", "duration"] as const).map((mode) => (
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
                        preferSourceSections: true,
                      })
                    }
                  >
                    {splitModeLabels[mode]}
                  </button>
                ))}
              </div>
              {exportSettings.splitMode !== "none" ? (
                <label className="mt-3 block text-sm font-semibold text-slate-700">
                  Target part length
                  <select
                    value={exportSettings.targetPartMinutes}
                    onChange={(event) =>
                      updateExportSettings({
                        targetPartMinutes: Number(event.target.value),
                      })
                    }
                    className="ml-0 mt-1 w-32 rounded-lg bg-white px-3 py-2 text-slate-950 sm:ml-2"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min recommended</option>
                    <option value={45}>45 min</option>
                    <option value={60}>60 min experimental</option>
                  </select>
                </label>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              {zipBatchWorkflow && totalBatches > 0 ? (
                <label className="min-w-[12rem] text-sm font-semibold text-slate-700">
                  ZIP batch
                  <select
                    value={selectedExportBatch?.batchNumber ?? 1}
                    disabled={exportRunning}
                    onChange={(event) =>
                      setSelectedBatchNumber(Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-lg bg-[#fffdf8] px-3 py-2 font-semibold text-slate-900 hover:bg-[#f7f4ee] focus:outline-none focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    aria-label="ZIP batch"
                  >
                    {exportBatches.map((batch) => (
                      <option key={batch.batchNumber} value={batch.batchNumber}>
                        Batch {batch.batchNumber} of {batch.totalBatches} -{" "}
                        {formatDuration(batch.runtimeMs)}
                      </option>
                    ))}
                  </select>
                </label>
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
                {exportRunning ? (
                  <span
                    className="h-2.5 w-2.5 animate-pulse rounded-full bg-current"
                    aria-hidden="true"
                  />
                ) : (
                  <DownloadIcon size={18} title={undefined} aria-hidden="true" />
                )}
                {activeDownloadLabel}
              </button>
              {exportRunning ? (
                <ToolButton
                  type="button"
                  tone="light"
                  hover="dark"
                  onClick={cancelDownload}
                  className="rounded-xl"
                >
                  <StopIcon size={18} title={undefined} aria-hidden="true" />
                  Cancel download
                </ToolButton>
              ) : null}
            </div>
            {exportRunning ? (
              <div className="space-y-2">
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
                <p
                  className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                  data-mw-morse-book-download-progress-detail="true"
                >
                  {progressPercent > 0 ? `${progressPercent}%` : "Working"} /{" "}
                  {exportProgressDetail(exportProgress, exportElapsedMs)}
                </p>
              </div>
            ) : null}
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
                {exportRunning
                  ? exportProgress.message || downloadStatus.message
                  : downloadStatus.message}
              </p>
            ) : null}

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
          </div>
        </ToolPanel>

        <ToolPanel label="Settings" badge="No split default">
          <div className="space-y-6 px-4 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-[58ch] text-sm leading-relaxed text-slate-700">
                This book remembers selected sections and export settings in
                this browser.
              </p>
              <ToolButton
                type="button"
                tone="light"
                hover="dark"
                onClick={resetSavedSettings}
                className="rounded-xl"
                data-mw-morse-book-reset-settings="true"
              >
                <RefreshIcon size={18} title={undefined} aria-hidden="true" />
                Reset saved settings
              </ToolButton>
            </div>
            {savedSettingsStatus ? (
              <p
                className="text-sm font-semibold text-slate-600"
                data-mw-morse-book-saved-settings-status="true"
              >
                {savedSettingsStatus}
              </p>
            ) : null}

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
                  handleTonePresetChange(event.target.value as AudioTonePresetId)
                }
                className="mt-2 w-full rounded-lg bg-white px-3 py-2 font-semibold text-slate-950"
              >
                {getAudioPresetsForContext("bookExport").map((preset) => (
                  <option key={preset} value={preset}>
                    {getAudioPresetLabel(preset)}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </ToolPanel>
      </section>
      )}

      <section className="mt-10 mw-static-surface rounded-xl p-5">
        <h2 className="mw-heading text-2xl font-extrabold text-sky-950">
          Source notes
        </h2>
        <div className="mt-3 grid gap-4 text-sm leading-relaxed text-slate-700 lg:grid-cols-2">
          <div>
            <p>
              Source material is prepared from public reference text, not user
              uploads. Project Gutenberg boilerplate is kept out of the Morse
              source text so the preview focuses on readable book content.
            </p>
            {book.source.sourceUrl ? (
              <p className="mt-3">
                <a
                  className="font-semibold text-sky-900 underline decoration-sky-900/45 underline-offset-4 hover:decoration-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
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
            Use the book page for text-first study, the audiobook page for
            listening, or the printable page when you want a browser printout or
            saved PDF.
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

function Metric({
  label,
  testId,
  value,
}: {
  label: string;
  testId?: string;
  value: string;
}) {
  return (
    <div data-testid={testId}>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function BookLiveProgressSettingsSummary({
  completedValue,
  currentValue,
  onReset,
  progressValue,
  savedSettingsStatus,
  segmentValue,
}: {
  completedValue: string;
  currentValue: string;
  onReset: () => void;
  progressValue: string;
  savedSettingsStatus: string;
  segmentValue: string;
}) {
  return (
    <div
      className="grid gap-4 border-b border-slate-200/70 pb-5"
      data-testid="morse-book-live-progress-settings"
    >
      <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Current" value={currentValue} />
        <Metric label="Progress" value={progressValue} />
        <Metric label="Segment" value={segmentValue} />
        <Metric label="Completed" value={completedValue} />
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <ToolButton
          type="button"
          tone="light"
          hover="dark"
          onClick={onReset}
          className="rounded-xl"
          data-testid="morse-book-live-reset-progress"
        >
          <RefreshIcon size={18} title={undefined} aria-hidden="true" />
          Reset progress
        </ToolButton>
        <div className="grid min-w-0 gap-1">
          <p className="max-w-[58ch] text-sm leading-relaxed text-slate-700">
            This player remembers the active section, segment, playback
            position, audio settings, and visual settings in this browser.
          </p>
          {savedSettingsStatus ? (
            <p
              className="text-sm font-semibold text-slate-600"
              data-mw-morse-book-saved-settings-status="true"
            >
              {savedSettingsStatus}
            </p>
          ) : null}
        </div>
      </div>
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
        </>
      ) : null}
    </section>
  );
}

function VideoPreviewControls({
  action,
  elapsedMs,
  enableFullscreen = false,
  fullscreenSegmentControl,
  headingText = "Live visual player",
  onPlay,
  onRestart,
  onSeek,
  onSeekCommit,
  onStop,
  playLabel = "Play live player",
  playing,
  preview,
  resolvedBackgroundStyle,
  settings,
  stopLabel = "Stop live player",
  timelineAriaLabel = "Video preview timeline",
}: {
  action?: React.ReactNode;
  elapsedMs: number;
  enableFullscreen?: boolean;
  fullscreenSegmentControl?: React.ReactNode;
  headingText?: string;
  onPlay: () => void;
  onRestart?: () => void;
  onSeek: (elapsedMs: number) => void;
  onSeekCommit?: (elapsedMs: number) => void;
  onStop: () => void;
  playLabel?: string;
  playing: boolean;
  preview: MorseVideoPreview;
  resolvedBackgroundStyle: ResolvedMorseVideoBackgroundStyle;
  settings: MorseVideoSettings;
  stopLabel?: string;
  timelineAriaLabel?: string;
}) {
  const safeElapsed = Math.max(0, Math.min(Math.max(1, preview.durationMs), elapsedMs));
  const pauseAction = stopLabel.toLowerCase().startsWith("pause");

  return (
    <section data-testid="book-video-preview-workflow">
      <MorseVideoPreviewPanel
        className="mt-4"
        headingId="book-video-preview-heading"
        headingText={headingText}
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
            pauseAction ? (
              <PauseIcon size={18} title={undefined} aria-hidden="true" />
            ) : (
              <StopIcon size={18} title={undefined} aria-hidden="true" />
            )
          ) : (
            <PlayIcon size={18} title={undefined} aria-hidden="true" />
          )}
          {playing ? stopLabel : playLabel}
        </ToolButton>
        {playing && onRestart ? (
          <ToolButton
            type="button"
            tone="light"
            hover="dark"
            onClick={onRestart}
            className="rounded-xl"
          >
            <RefreshIcon size={18} title={undefined} aria-hidden="true" />
            Restart live player
          </ToolButton>
        ) : null}
        {action}
        {enableFullscreen ? (
          <MorseLivePreviewFullscreenControl
            elapsedMs={safeElapsed}
            headingText="Fullscreen live Morse preview"
            isPlaying={playing}
            onPlay={onPlay}
            onRestart={onRestart}
            onSeek={onSeek}
            onSeekCommit={onSeekCommit}
            onStop={onStop}
            preview={preview}
            resolvedBackgroundStyle={resolvedBackgroundStyle}
            segmentControl={fullscreenSegmentControl}
            settings={settings}
            testIdPrefix="book-video-preview"
            timelineAriaLabel="Fullscreen live player timeline"
          />
        ) : null}
      </div>
      <MorseVideoPreviewTimeline
        ariaLabel={timelineAriaLabel}
        elapsedMs={safeElapsed}
        onSeek={onSeek}
        onSeekCommit={onSeekCommit}
        preview={preview}
        testIdPrefix="book-video-preview"
      />
    </section>
  );
}

function BookLiveAudioSettings({
  audioSupported,
  exportSettings,
  idPrefix,
  onCharWpmChange,
  onFarnsworthWpmChange,
  onPitchChange,
  onTonePresetChange,
  onVolumeChange,
  videoSettings,
}: {
  audioSupported: boolean;
  exportSettings: BookExportSettings;
  idPrefix: string;
  onCharWpmChange: (value: number) => void;
  onFarnsworthWpmChange: (value: number) => void;
  onPitchChange: (value: number) => void;
  onTonePresetChange: (value: AudioTonePresetId) => void;
  onVolumeChange: (value: number) => void;
  videoSettings: MorseVideoSettings;
}) {
  const liveAudioEnabled = videoSettings.includeAudioTrack && audioSupported;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-sky-950">
            Timing and audio track
          </h3>
          <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-slate-700">
            Character speed and Farnsworth spacing use the same Morse timing
            layer as MP3 export. Tone controls apply when live audio is on.
          </p>
        </div>
        <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {liveAudioEnabled
            ? getAudioPresetLabel(exportSettings.tonePreset)
            : "Silent live player"}
        </span>
      </div>
      <AudioSettingsPanel
        className="mt-5"
        context="bookExport"
        disabledSound={!liveAudioEnabled}
        idPrefix={idPrefix}
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
          Visual style controls the live signal or flashing animation. Text
          layers control the live player overlays only.
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Visual style">
          {MORSE_LIVE_PLAYER_VISUAL_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              className={toolControlButtonClass({
                active: settings.visualStyle === style,
                size: "sm",
              })}
              onClick={() =>
                onChange({
                  visualStyle: style,
                })
              }
            >
              {visualStyleLabels[style]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          Live player layers
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
            checked={settings.includeAudioTrack}
            label="Audio"
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
          aria-label="Live player visual intensity"
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
