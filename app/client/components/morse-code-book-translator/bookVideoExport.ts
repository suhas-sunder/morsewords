import { sanitizeDownloadFilename } from "~/client/components/shared/actionOutputUtils";

import { hasBookDownloadSidecars } from "./bookBundleExport";
import {
  buildMorseTranscript,
  formatBytes,
  formatDuration,
} from "./bookDurationEstimate";
import type {
  BookBundleMetadata,
  BookDownloadKind,
  BookExportPart,
  BookExportProgress,
  BookExportSettings,
} from "./bookExportTypes";
import {
  buildBookVideoTimeline,
  getBookVideoFrameRate,
  getBookVideoFrameSize,
  recordBookVideoCanvas,
  type ResolvedBookVideoBackgroundStyle,
} from "./bookVideoRenderer";
import { describeBookVideoSettings } from "./bookVideoPresets";
import type { BookVideoSupport } from "./bookVideoSupport";
import type { BookVideoSettings } from "./bookVideoTypes";

type ExportVideoOptions = {
  exportSettings: BookExportSettings;
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  resolvedBackgroundStyle: ResolvedBookVideoBackgroundStyle;
  signal: AbortSignal;
  support: BookVideoSupport;
  videoSettings: BookVideoSettings;
  onProgress?: (progress: BookExportProgress) => void;
};

export type BookVideoDownloadPackage = {
  blob: Blob;
  filename: string;
  downloadKind: BookDownloadKind;
  contents: string[];
  outputFormat: "webm";
};

const MAX_FILENAME_BASE_LENGTH = 72;

export function getBookVideoDownloadKind(
  parts: BookExportPart[],
  settings: BookExportSettings,
): BookDownloadKind {
  return parts.length === 1 && !hasBookDownloadSidecars(settings)
    ? "video"
    : "zip";
}

export function describeBookVideoDownloadContents(
  parts: BookExportPart[],
  settings: BookExportSettings,
  downloadKind = getBookVideoDownloadKind(parts, settings),
) {
  if (downloadKind === "video") return ["WebM video file"];
  return [
    `WebM video ${parts.length === 1 ? "file" : "parts"}`,
    "playlist.m3u",
    settings.includeCleanedText ? "cleaned-text.txt" : "",
    settings.includeMorseTranscript ? "morse-transcript.txt" : "",
    settings.includeManifest ? "manifest.json" : "",
    settings.includeSettings ? "settings.json" : "",
    settings.includeReadme ? "README.txt" : "",
  ].filter(Boolean);
}

export function buildBookVideoWarnings({
  downloadKind,
  partCount,
  support,
  totalRuntimeMs,
  videoSettings,
}: {
  downloadKind?: BookDownloadKind;
  partCount: number;
  support: BookVideoSupport | null;
  totalRuntimeMs: number;
  videoSettings: BookVideoSettings;
}) {
  const warnings: string[] = [];
  if (support && !support.supported) {
    warnings.push(support.reason);
  } else {
    warnings.push("Browser video export support varies; WebM is used when available.");
  }
  if (totalRuntimeMs > 90_000 || partCount > 1) {
    if (partCount > 1) {
      warnings.push(
        "Long videos may take time to render. Split video downloads are packaged in ZIP files.",
      );
    } else if (downloadKind === "zip") {
      warnings.push(
        "Long videos may take time to render. Selected extras are packaged with the WebM in a ZIP download.",
      );
    } else {
      warnings.push(
        "Long videos may take time to render. Keep this tab open until the WebM is ready.",
      );
    }
  }
  if (videoSettings.resolution === "1080p") {
    warnings.push("1080p video may render more slowly than 720p.");
  }
  if (support && videoSettings.includeAudioTrack && !support.audioTrackSupported) {
    warnings.push(support.audioTrackReason);
  }
  if (videoSettings.showVisualSignal && videoSettings.visualStyle === "full-frame") {
    warnings.push("Full-frame flash mode can create strobe-like video output.");
  }
  warnings.push("MP4 is not guaranteed in-browser; WebM is the default format.");
  return [...new Set(warnings)];
}

export async function createBookVideoDownloadPackage({
  exportSettings,
  metadata,
  onProgress,
  parts,
  resolvedBackgroundStyle,
  signal,
  support,
  videoSettings,
}: ExportVideoOptions): Promise<BookVideoDownloadPackage> {
  throwIfAborted(signal);
  if (!support.supported || !support.mimeType) {
    throw new Error(support.reason);
  }
  if (parts.length === 0) {
    throw new Error("No book parts are available for video download.");
  }

  const effectiveVideoSettings = {
    ...videoSettings,
    includeAudioTrack:
      videoSettings.includeAudioTrack && support.audioTrackSupported,
  };
  const downloadKind = getBookVideoDownloadKind(parts, exportSettings);

  if (downloadKind === "zip") {
    const zip = await createBookVideoZip({
      exportSettings,
      metadata,
      onProgress,
      parts,
      resolvedBackgroundStyle,
      signal,
      support,
      videoSettings: effectiveVideoSettings,
    });
    return {
      ...zip,
      downloadKind,
      outputFormat: "webm",
      contents: describeBookVideoDownloadContents(
        parts,
        exportSettings,
        downloadKind,
      ),
    };
  }

  const [part] = parts;
  onProgress?.({
    phase: "encoding",
    message: "Recording WebM video...",
    currentPart: 0,
    totalParts: 1,
  });
  const blob = await renderBookPartVideo({
    exportSettings,
    onProgress: (elapsedMs, durationMs) => {
      onProgress?.({
        phase: "encoding",
        message: `Recording WebM video (${formatDuration(elapsedMs)} of ${formatDuration(
          durationMs,
        )})...`,
        currentPart: Math.max(0, Math.round(elapsedMs)),
        totalParts: Math.max(1, Math.round(durationMs)),
      });
    },
    part,
    resolvedBackgroundStyle,
    signal,
    support,
    videoSettings: effectiveVideoSettings,
  });
  onProgress?.({
    phase: "complete",
    message: "WebM video ready.",
    currentPart: 1,
    totalParts: 1,
  });
  return {
    blob,
    filename: buildSingleVideoFilename({
      sourceTitle: metadata.title || metadata.filename,
    }),
    downloadKind,
    outputFormat: "webm",
    contents: describeBookVideoDownloadContents(parts, exportSettings, downloadKind),
  };
}

export async function renderBookPartVideo({
  exportSettings,
  onProgress,
  part,
  resolvedBackgroundStyle,
  signal,
  support,
  videoSettings,
}: {
  exportSettings: BookExportSettings;
  part: BookExportPart;
  resolvedBackgroundStyle: ResolvedBookVideoBackgroundStyle;
  signal: AbortSignal;
  support: BookVideoSupport;
  videoSettings: BookVideoSettings;
  onProgress?: (elapsedMs: number, durationMs: number) => void;
}) {
  throwIfAborted(signal);
  if (typeof document === "undefined") {
    throw new Error("Video export runs in a browser window.");
  }
  const frame = getBookVideoFrameSize(videoSettings.resolution);
  const canvas = document.createElement("canvas");
  canvas.width = frame.width;
  canvas.height = frame.height;
  const timeline = buildBookVideoTimeline(part.cleanedText, exportSettings);
  return recordBookVideoCanvas({
    canvas,
    exportSettings,
    mimeType: support.mimeType,
    resolvedBackgroundStyle,
    settings: videoSettings,
    signal,
    timeline,
    onProgress,
  });
}

async function createBookVideoZip({
  exportSettings,
  metadata,
  onProgress,
  parts,
  resolvedBackgroundStyle,
  signal,
  support,
  videoSettings,
}: ExportVideoOptions): Promise<{ blob: Blob; filename: string }> {
  throwIfAborted(signal);
  onProgress?.({
    phase: "analyzing",
    message: "Preparing video download details...",
    currentPart: 0,
    totalParts: parts.length,
  });
  await cooperativeYield(signal);

  const { strToU8, zipSync } = await import("fflate");
  const files: Record<string, Uint8Array> = {};
  const generatedVideoFiles: string[] = [];
  const generatedAt = new Date().toISOString();

  for (const part of parts) {
    throwIfAborted(signal);
    const filename = buildPartVideoFilename({
      sourceTitle: metadata.title || metadata.filename,
      partIndex: part.index,
    });
    onProgress?.({
      phase: "encoding",
      message: `Rendering video part ${part.index} of ${parts.length}...`,
      currentPart: part.index,
      totalParts: parts.length,
    });
    const videoBlob = await renderBookPartVideo({
      exportSettings,
      onProgress: (elapsedMs, durationMs) => {
        onProgress?.({
          phase: "encoding",
          message: `Recording video part ${part.index} of ${parts.length} (${formatDuration(
            elapsedMs,
          )} of ${formatDuration(durationMs)})...`,
          currentPart: part.index,
          totalParts: parts.length,
        });
      },
      part,
      resolvedBackgroundStyle,
      signal,
      support,
      videoSettings,
    });
    files[filename] = new Uint8Array(await videoBlob.arrayBuffer());
    generatedVideoFiles.push(filename);
    await cooperativeYield(signal);
  }

  throwIfAborted(signal);
  onProgress?.({
    phase: "bundling",
    message: "Bundling video and selected files...",
    currentPart: parts.length,
    totalParts: parts.length,
  });

  if (exportSettings.includeCleanedText) {
    files["cleaned-text.txt"] = strToU8(
      parts.map((part) => part.cleanedText).join("\n\n"),
    );
  }

  if (exportSettings.includeMorseTranscript) {
    files["morse-transcript.txt"] = strToU8(buildMorseTranscriptFile(parts));
  }

  if (exportSettings.includeManifest) {
    files["manifest.json"] = strToU8(
      JSON.stringify(
        buildVideoManifest({
          generatedAt,
          generatedVideoFiles,
          metadata,
          parts,
          support,
          exportSettings,
          videoSettings,
        }),
        null,
        2,
      ),
    );
  }

  if (exportSettings.includeSettings) {
    files["settings.json"] = strToU8(
      JSON.stringify(
        buildVideoSettingsFile({
          generatedAt,
          support,
          exportSettings,
          videoSettings,
        }),
        null,
        2,
      ),
    );
  }

  files["playlist.m3u"] = strToU8(buildPlaylist(generatedVideoFiles));

  if (exportSettings.includeReadme) {
    files["README.txt"] = strToU8(
      buildVideoReadme({
        generatedAt,
        generatedVideoFiles,
        metadata,
        parts,
        support,
        exportSettings,
        videoSettings,
      }),
    );
  }

  const zipped = zipSync(files, { level: 6 });
  return {
    blob: new Blob([zipped], { type: "application/zip" }),
    filename: buildVideoBundleFilename(metadata.title || metadata.filename),
  };
}

function buildMorseTranscriptFile(parts: BookExportPart[]) {
  return parts
    .map(
      (part) =>
        `# ${part.title}\n# ${formatDuration(part.morseDurationMs)}\n\n${buildMorseTranscript(
          part.cleanedText,
        )}`,
    )
    .join("\n\n");
}

function buildVideoManifest({
  generatedAt,
  generatedVideoFiles,
  metadata,
  parts,
  support,
  exportSettings,
  videoSettings,
}: {
  generatedAt: string;
  generatedVideoFiles: string[];
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  support: BookVideoSupport;
  exportSettings: BookExportSettings;
  videoSettings: BookVideoSettings;
}) {
  const runtimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  return {
    generatedAt,
    outputType: "video",
    outputFormat: "webm",
    mimeType: support.mimeType,
    sourceKind: metadata.sourceType,
    title: metadata.title,
    author: metadata.author,
    filename: metadata.filename,
    sourceType: metadata.sourceType,
    source: {
      kind: metadata.sourceType,
      title: metadata.title,
      author: metadata.author,
      filename: metadata.filename,
    },
    partCount: parts.length,
    runtimeEstimate: formatDuration(runtimeMs),
    runtimeMs,
    settingsSummary: buildVideoSettingsSummary(exportSettings, videoSettings),
    files: {
      video: generatedVideoFiles,
      cleanedText: exportSettings.includeCleanedText
        ? "cleaned-text.txt"
        : undefined,
      morseTranscript: exportSettings.includeMorseTranscript
        ? "morse-transcript.txt"
        : undefined,
      settings: exportSettings.includeSettings ? "settings.json" : undefined,
      playlist: "playlist.m3u",
      readme: exportSettings.includeReadme ? "README.txt" : undefined,
    },
    parts: parts.map((part, index) => ({
      index: part.index,
      title: part.title,
      filename: generatedVideoFiles[index],
      sourceStart: part.sourceStart,
      sourceEnd: part.sourceEnd,
      runtimeEstimate: formatDuration(part.morseDurationMs),
      runtimeMs: part.morseDurationMs,
      excerpt: part.cleanedExcerpt,
    })),
  };
}

function buildVideoSettingsFile({
  generatedAt,
  support,
  exportSettings,
  videoSettings,
}: {
  generatedAt: string;
  support: BookVideoSupport;
  exportSettings: BookExportSettings;
  videoSettings: BookVideoSettings;
}) {
  return {
    generatedAt,
    outputType: "video",
    outputFormat: "webm",
    mimeType: support.mimeType,
    frameRate: getBookVideoFrameRate(),
    ...buildVideoSettingsSummary(exportSettings, videoSettings),
  };
}

function buildVideoSettingsSummary(
  exportSettings: BookExportSettings,
  videoSettings: BookVideoSettings,
) {
  return {
    charWpm: exportSettings.charWpm,
    farnsworthWpm: exportSettings.farnsworthWpm,
    tonePreset: exportSettings.tonePreset,
    pitch: exportSettings.pitch,
    volume: exportSettings.volume,
    sampleRate: exportSettings.sampleRate,
    tailPaddingMs: exportSettings.tailPaddingMs,
    paragraphPauseMultiplier: exportSettings.paragraphPauseMultiplier,
    sentencePauseMultiplier: exportSettings.sentencePauseMultiplier,
    punctuationMode: exportSettings.punctuationMode,
    splitMode: exportSettings.splitMode,
    splitAudio: exportSettings.splitAudio,
    preferSourceSections: exportSettings.preferSourceSections,
    visualStyle: videoSettings.visualStyle,
    includeAudioTrack: videoSettings.includeAudioTrack,
    resolution: videoSettings.resolution,
    backgroundStyle: videoSettings.backgroundStyle,
    intensity: videoSettings.intensity,
    showVisualSignal: videoSettings.showVisualSignal,
    showMorseSymbols: videoSettings.showMorseSymbols,
    showPlainText: videoSettings.showPlainText,
    showMorseOverlay: videoSettings.showMorseOverlay,
    textDisplayMode: videoSettings.textDisplayMode,
    showBranding: videoSettings.showBranding,
    targetPartMinutes: videoSettings.targetPartMinutes,
    settingsDescription: describeBookVideoSettings(videoSettings),
  };
}

function buildVideoReadme({
  generatedAt,
  generatedVideoFiles,
  metadata,
  parts,
  support,
  exportSettings,
  videoSettings,
}: {
  generatedAt: string;
  generatedVideoFiles: string[];
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  support: BookVideoSupport;
  exportSettings: BookExportSettings;
  videoSettings: BookVideoSettings;
}) {
  const title = metadata.title || metadata.filename || "MorseWords book video";
  const runtimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  return [
    `${title}`,
    metadata.author ? `Author: ${metadata.author}` : "",
    `Source type: ${metadata.sourceType}`,
    `Generated: ${generatedAt}`,
    `Output: WebM video`,
    `MIME type: ${support.mimeType}`,
    `Estimated runtime: ${formatDuration(runtimeMs)}`,
    `Part count: ${parts.length}`,
    `Video settings: ${describeBookVideoSettings(videoSettings)}`,
    "",
    "Files",
    ...generatedVideoFiles.map((file) => `- ${file}`),
    "- playlist.m3u",
    exportSettings.includeCleanedText ? "- cleaned-text.txt" : "",
    exportSettings.includeMorseTranscript ? "- morse-transcript.txt" : "",
    exportSettings.includeManifest ? "- manifest.json" : "",
    exportSettings.includeSettings ? "- settings.json" : "",
    "",
    "Notes",
    "- WebM is the browser-native video format used by this export.",
    "- MP4 is not guaranteed in browser-only export.",
    "- Video parts are sorted by filename and listed in playlist.m3u.",
    "- Source files are processed in your browser. Use source text you have the right to convert and use.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildPlaylist(files: string[]) {
  return ["#EXTM3U", ...files.map((file) => `./${file}`), ""].join("\n");
}

function buildPartVideoFilename({
  sourceTitle,
  partIndex,
}: {
  sourceTitle?: string;
  partIndex: number;
}) {
  const base = filenameBase(sourceTitle);
  return `${base}-part-${String(partIndex).padStart(3, "0")}.webm`;
}

function buildSingleVideoFilename({ sourceTitle }: { sourceTitle?: string }) {
  return `${filenameBase(sourceTitle)}-morse-video.webm`;
}

function buildVideoBundleFilename(sourceTitle?: string) {
  return `${filenameBase(sourceTitle)}-morse-video-bundle.zip`;
}

function filenameBase(sourceTitle?: string) {
  return (
    sanitizeDownloadFilename(sourceTitle || "morse-book", "morse-book")
      .replace(/\.(mp3|wav|webm|zip|txt|json|m3u)$/i, "")
      .slice(0, MAX_FILENAME_BASE_LENGTH) || "morse-book"
  );
}

async function cooperativeYield(signal: AbortSignal) {
  throwIfAborted(signal);
  await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
  throwIfAborted(signal);
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new DOMException("Video download cancelled.", "AbortError");
  }
}
