import type {
  AudioGeneratorPreset,
  AudioSampleRate,
  Mp3Bitrate,
} from "~/client/components/shared/morseSettings";

import type { BookSourceType } from "./bookSourceTypes";

export type BookExportPresetName =
  | "Reader Quick Start"
  | "Long Listen"
  | "Practice Copy"
  | "Faithful Source"
  | "Archive Export";

export type BookExportFormat = "mp3" | "wav";

export type BookOutputType = "audio" | "video";

export type BookDownloadKind = "audio" | "video" | "parts" | "zip";

export type BookPunctuationMode = "preserve" | "simplify";

/**
 * Explicit public splitting policy for book and audiobook downloads.
 *
 * `none` is intentionally a promise to request one file. Long selections
 * must be blocked before rendering rather than silently becoming parts.
 */
export type BookSplitMode = "none" | "duration" | "custom";

export type BookExportSettings = {
  presetName: BookExportPresetName;
  charWpm: number;
  farnsworthWpm: number;
  tonePreset: AudioGeneratorPreset;
  pitch: number;
  volume: number;
  attackMs: number;
  releaseMs: number;
  outputFormat: BookExportFormat;
  mp3Bitrate: Mp3Bitrate;
  sampleRate: AudioSampleRate;
  /** Silence inserted before the first Morse mark in each generated file. */
  leadInMs: number;
  tailPaddingMs: number;
  splitMode: BookSplitMode;
  splitAudio: boolean;
  targetPartMinutes: number;
  preferSourceSections: boolean;
  paragraphPauseMultiplier: number;
  sentencePauseMultiplier: number;
  punctuationMode: BookPunctuationMode;
  includeCleanedText: boolean;
  includeMorseTranscript: boolean;
  includeManifest: boolean;
  includeSettings: boolean;
  includeReadme: boolean;
};

export type BookExportAnalysis = {
  cleanedText: string;
  morseTranscriptPreview: string;
  totalRuntimeMs: number;
  partCount: number;
  targetPartMs: number;
  estimatedBytes: number;
  estimatedSizeLabel: string;
  unsupportedImpact: string;
  warnings: string[];
};

export type BookExportPart = {
  index: number;
  title: string;
  sourceStart: number;
  sourceEnd: number;
  cleanedText: string;
  cleanedExcerpt: string;
  morseDurationMs: number;
  estimatedFilename: string;
};

export type BookExportBatch = {
  batchNumber: number;
  totalBatches: number;
  parts: BookExportPart[];
  runtimeMs: number;
  targetRuntimeMs: number;
};

export type BookBundleMetadata = {
  title?: string;
  author?: string;
  filename?: string;
  sourceType: BookSourceType;
};

export type BookExportPhase =
  | "idle"
  | "analyzing"
  | "splitting"
  | "encoding"
  | "bundling"
  | "complete"
  | "cancelled"
  | "failed";

export type BookExportProgress = {
  batchNumber?: number;
  batchPartCount?: number;
  batchPartIndex?: number;
  completedParts?: number;
  currentPartIndex?: number;
  phase: BookExportPhase;
  message: string;
  currentPart: number;
  renderedDurationMs?: number;
  totalBatches?: number;
  totalDurationMs?: number;
  totalParts: number;
};

export type BookExportResultSummary = {
  batchNumber?: number;
  filename: string;
  downloadKind: BookDownloadKind;
  outputFormat: BookExportFormat | "webm" | "mp4";
  totalBatches?: number;
  partCount: number;
  runtimeLabel: string;
  sizeLabel: string;
  contents: string[];
};
