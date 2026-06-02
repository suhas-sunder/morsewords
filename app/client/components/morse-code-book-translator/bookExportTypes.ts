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

export type BookDownloadKind = "audio" | "zip";

export type BookPunctuationMode = "preserve" | "simplify";

export type BookExportSettings = {
  presetName: BookExportPresetName;
  charWpm: number;
  farnsworthWpm: number;
  tonePreset: AudioGeneratorPreset;
  pitch: number;
  volume: number;
  outputFormat: BookExportFormat;
  mp3Bitrate: Mp3Bitrate;
  sampleRate: AudioSampleRate;
  tailPaddingMs: number;
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
  phase: BookExportPhase;
  message: string;
  currentPart: number;
  totalParts: number;
};

export type BookExportResultSummary = {
  filename: string;
  downloadKind: BookDownloadKind;
  outputFormat: BookExportFormat;
  partCount: number;
  runtimeLabel: string;
  sizeLabel: string;
  contents: string[];
};
