import * as React from "react";

import { downloadBlobFile } from "~/client/components/shared/actionOutputUtils";

import {
  renderMorseAudioBlob,
  type MorseAudioExportSettings,
} from "./morseAudioExport";
import type { MorseExportPlan } from "./morseExportPlan";
import {
  normalizeExportError,
  runSequentialExport,
  summarizeCompletedPartFiles,
  type CompletedPartFile,
  type ExportJobStage,
  type SequentialExportProgress,
} from "./sequentialExport";

export type MorseAudioExportJobState = {
  completedFiles: string[];
  completedPartIndexes: number[];
  errorMessage: string;
  failedPart: number | null;
  progress: SequentialExportProgress | null;
  status: "idle" | "running" | "complete" | "cancelled" | "failed";
  totalBytes: number;
};

type AudioExportRequest = {
  plan: MorseExportPlan;
  settings: MorseAudioExportSettings;
};

const INITIAL_STATE: MorseAudioExportJobState = {
  completedFiles: [],
  completedPartIndexes: [],
  errorMessage: "",
  failedPart: null,
  progress: null,
  status: "idle",
  totalBytes: 0,
};

export function useMorseAudioExportJob(resetKey: string) {
  const [state, setState] = React.useState<MorseAudioExportJobState>(INITIAL_STATE);
  const controllerRef = React.useRef<AbortController | null>(null);
  const mountedRef = React.useRef(false);
  const requestRef = React.useRef<AudioExportRequest | null>(null);
  const completedRef = React.useRef<number[]>([]);
  const completedFilesRef = React.useRef<Map<number, CompletedPartFile>>(new Map());
  const versionRef = React.useRef(0);

  const cancel = React.useCallback((message = "Export cancelled.") => {
    controllerRef.current?.abort();
    versionRef.current += 1;
    if (mountedRef.current) {
      const completed = summarizeCompletedPartFiles(completedFilesRef.current);
      setState((current) => ({
        ...current,
        completedFiles: completed.filenames,
        completedPartIndexes: completed.indexes,
        errorMessage: message,
        status: "cancelled",
        totalBytes: completed.totalBytes,
      }));
    }
  }, []);

  const reset = React.useCallback(() => {
    controllerRef.current?.abort();
    requestRef.current = null;
    completedRef.current = [];
    completedFilesRef.current.clear();
    versionRef.current += 1;
    if (mountedRef.current) setState(INITIAL_STATE);
  }, []);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
      versionRef.current += 1;
    };
  }, []);

  React.useEffect(() => {
    reset();
  }, [reset, resetKey]);

  const execute = React.useCallback(async (request: AudioExportRequest) => {
    if (controllerRef.current) return;
    if (request.plan.parts.length === 0) {
      setState((current) => ({
        ...current,
        errorMessage:
          "Enter text or valid dots and dashes before exporting audio.",
        status: "failed",
      }));
      return;
    }

    requestRef.current = request;
    const controller = new AbortController();
    controllerRef.current = controller;
    const version = versionRef.current + 1;
    versionRef.current = version;
    let currentPart = request.plan.parts.find(
      (part) => !completedRef.current.includes(part.index),
    )?.index ?? 1;
    setState((current) => ({
      ...current,
      errorMessage: "",
      failedPart: null,
      status: "running",
    }));

    try {
      const result = await runSequentialExport({
        completedPartIndexes: completedRef.current,
        parts: request.plan.parts,
        signal: controller.signal,
        generatePart: async (part, signal, onPartProgress) => {
          currentPart = part.index;
          return renderMorseAudioBlob({
            morse: part.morse,
            settings: request.settings,
            signal,
            onProgress: ({ renderedMs, stage, totalMs }) => {
              const jobStage: ExportJobStage =
                stage === "encoding" ? "encoding" : stage === "finalizing" ? "finalizing" : "rendering";
              onPartProgress(totalMs > 0 ? renderedMs / totalMs : 0, jobStage);
            },
          });
        },
        finalizePart: (part, blob) => {
          const download = downloadBlobFile({ blob, filename: part.filename });
          if (!download.ok) throw new Error(download.message);
          completedFilesRef.current.set(part.index, {
            bytes: blob.size,
            filename: part.filename,
          });
          completedRef.current = [
            ...new Set([...completedRef.current, part.index]),
          ].sort((left, right) => left - right);
        },
        onProgress: (progress) => {
          if (!mountedRef.current || versionRef.current !== version) return;
          if (progress.completedParts > completedRef.current.length) {
            completedRef.current = request.plan.parts
              .slice(0, progress.completedParts)
              .map((part) => part.index);
          }
          setState((current) => ({ ...current, progress }));
        },
      });
      if (!mountedRef.current || versionRef.current !== version) return;
      completedRef.current = result.completedPartIndexes;
      const completed = summarizeCompletedPartFiles(completedFilesRef.current);
      setState((current) => ({
        ...current,
        completedFiles: completed.filenames,
        completedPartIndexes: completed.indexes,
        errorMessage: "",
        failedPart: null,
        status: "complete",
        totalBytes: completed.totalBytes,
      }));
    } catch (error) {
      if (!mountedRef.current || versionRef.current !== version) return;
      const cancelled =
        error instanceof DOMException && error.name === "AbortError";
      if (!cancelled && import.meta.env.DEV) {
        console.error("Morse audio export failed", error);
      }
      const completed = summarizeCompletedPartFiles(completedFilesRef.current);
      setState((current) => ({
        ...current,
        completedFiles: completed.filenames,
        completedPartIndexes: completed.indexes,
        errorMessage: cancelled
          ? "Export cancelled."
          : normalizeExportError(error, "audio export"),
        failedPart: cancelled ? null : currentPart,
        status: cancelled ? "cancelled" : "failed",
        totalBytes: completed.totalBytes,
      }));
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, []);

  const start = React.useCallback(
    async (request: AudioExportRequest) => {
      if (controllerRef.current) return;
      completedRef.current = [];
      completedFilesRef.current.clear();
      setState(INITIAL_STATE);
      await execute(request);
    },
    [execute],
  );

  const retry = React.useCallback(async () => {
    if (!requestRef.current || controllerRef.current) return;
    await execute(requestRef.current);
  }, [execute]);

  return { cancel, reset, retry, start, state };
}
