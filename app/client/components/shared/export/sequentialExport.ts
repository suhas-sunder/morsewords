import { cooperativeYield, throwIfAborted } from "./morseAudioExport";

export type ExportJobStage =
  | "preparing"
  | "rendering"
  | "encoding"
  | "finalizing"
  | "requesting"
  | "complete";

export type SequentialExportProgress = {
  completedParts: number;
  currentPart: number;
  elapsedMs: number;
  overallProgress: number;
  partProgress: number;
  remainingMs?: number;
  stage: ExportJobStage;
  totalParts: number;
};

export type SequentialExportResult = {
  completedPartIndexes: number[];
  filenames: string[];
  totalBytes: number;
};

export type CompletedPartFile = {
  bytes: number;
  filename: string;
};

export function summarizeCompletedPartFiles(
  completed: ReadonlyMap<number, CompletedPartFile>,
) {
  const entries = [...completed.entries()].sort(
    ([left], [right]) => left - right,
  );
  return {
    filenames: entries.map(([, file]) => file.filename),
    indexes: entries.map(([index]) => index),
    totalBytes: entries.reduce((total, [, file]) => total + file.bytes, 0),
  };
}

export async function runSequentialExport<
  TPart extends { durationMs: number; filename: string; index: number },
>({
  completedPartIndexes = [],
  finalizePart,
  generatePart,
  onProgress,
  parts,
  signal,
}: {
  completedPartIndexes?: number[];
  finalizePart: (part: TPart, blob: Blob) => Promise<void> | void;
  generatePart: (
    part: TPart,
    signal: AbortSignal,
    onPartProgress: (progress: number, stage: ExportJobStage) => void,
  ) => Promise<Blob>;
  onProgress?: (progress: SequentialExportProgress) => void;
  parts: TPart[];
  signal: AbortSignal;
}): Promise<SequentialExportResult> {
  const completed = new Set(completedPartIndexes);
  const filenames: string[] = [];
  let totalBytes = 0;
  const startedAt = performanceNow();
  const totalWeight = Math.max(
    1,
    parts.reduce((sum, part) => sum + Math.max(1, part.durationMs), 0),
  );
  let completedWeight = parts
    .filter((part) => completed.has(part.index))
    .reduce((sum, part) => sum + Math.max(1, part.durationMs), 0);

  const emit = (
    part: TPart,
    partProgress: number,
    stage: ExportJobStage,
  ) => {
    const elapsedMs = Math.max(0, performanceNow() - startedAt);
    const weightedProgress = Math.max(
      0,
      Math.min(
        1,
        (completedWeight + Math.max(1, part.durationMs) * partProgress) /
          totalWeight,
      ),
    );
    const remainingMs =
      weightedProgress >= 0.08 && elapsedMs >= 2_000
        ? Math.max(0, elapsedMs * (1 / weightedProgress - 1))
        : undefined;
    onProgress?.({
      completedParts: completed.size,
      currentPart: part.index,
      elapsedMs,
      overallProgress: weightedProgress,
      partProgress,
      remainingMs,
      stage,
      totalParts: parts.length,
    });
  };

  for (const part of parts) {
    if (completed.has(part.index)) continue;
    throwIfAborted(signal);
    emit(part, 0, "preparing");
    let blob: Blob | null = null;
    try {
      blob = await generatePart(part, signal, (progress, stage) => {
        emit(part, Math.max(0, Math.min(0.99, progress)), stage);
      });
      throwIfAborted(signal);
      // Keep aggregate progress below 100% until the finalizer has actually
      // returned. For browser downloads, finalization means the request was
      // handed to the browser; it does not imply that the browser accepted it.
      emit(part, 0.999, "finalizing");
      emit(part, 0.999, "requesting");
      await finalizePart(part, blob);
      filenames.push(part.filename);
      totalBytes += blob.size;
      completed.add(part.index);
      completedWeight += Math.max(1, part.durationMs);
      // Publish the completed index before yielding so a retry cannot
      // download this part twice if a later part fails or the job is stopped.
      emit(part, 0, "requesting");
    } finally {
      // Dropping the only heavy reference here lets each part be reclaimed
      // before the next encoder/canvas is created.
      blob = null;
    }
    await cooperativeYield(signal);
  }

  const lastPart = parts.at(-1);
  if (lastPart) emit(lastPart, 0, "complete");
  return {
    completedPartIndexes: [...completed].sort((a, b) => a - b),
    filenames,
    totalBytes,
  };
}

export function normalizeExportError(error: unknown, label = "export") {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Export cancelled.";
  }
  if (/part\s+\d+/i.test(raw)) {
    return `A ${label} part could not be completed. Retry that part to continue.`;
  }
  if (/required fonts|prepare (its )?required fonts|font readiness/i.test(raw)) {
    return `This ${label} could not prepare its required fonts. Refresh the page and try again.`;
  }
  if (
    /allocation|array buffer|typed array|out of memory|memory|encoder|mediarecorder|quota/i.test(
      raw,
    )
  ) {
    return `This ${label} part could not be generated in the browser. Retry it, or use a smaller quality setting.`;
  }
  return `The ${label} could not be completed. Retry from the current part.`;
}

export function aggregateExportProgress({
  completedDurationMs,
  currentPartDurationMs,
  partProgress,
  totalDurationMs,
}: {
  completedDurationMs: number;
  currentPartDurationMs: number;
  partProgress: number;
  totalDurationMs: number;
}) {
  if (totalDurationMs <= 0) return 0;
  return Math.max(
    0,
    Math.min(
      1,
      (completedDurationMs + currentPartDurationMs * partProgress) /
        totalDurationMs,
    ),
  );
}

function performanceNow() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}
