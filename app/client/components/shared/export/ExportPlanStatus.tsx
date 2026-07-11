import * as React from "react";

import { DownloadIcon, RefreshIcon, StopIcon } from "~/client/assets/svg/Icons";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";

import type { MorseExportPlan } from "./morseExportPlan";
import type { MorseAudioExportJobState } from "./useMorseAudioExportJob";

export function ExportPlanSummary({ plan }: { plan: MorseExportPlan }) {
  if (plan.parts.length === 0) return null;
  const averagePartMs = plan.totalDurationMs / plan.parts.length;
  return (
    <div
      className="mt-4 grid gap-2 text-sm leading-relaxed text-slate-700 sm:grid-cols-2 lg:grid-cols-4"
      data-testid="morse-export-plan"
      data-export-format={plan.format}
      data-export-part-count={plan.parts.length}
    >
      <PlanValue label="Runtime" value={formatDuration(plan.totalDurationMs)} />
      <PlanValue label="Format" value={plan.format.toUpperCase()} />
      <PlanValue
        label="Files"
        value={`${plan.parts.length} ${plan.parts.length === 1 ? "file" : "ordered parts"}`}
      />
      <PlanValue
        label="Estimate"
        value={`~${formatBytes(plan.estimatedBytes)}${
          plan.parts.length > 1
            ? `, ~${formatDuration(averagePartMs)} each`
            : ""
        }`}
      />
      {plan.multiPart ? (
        <p className="sm:col-span-2 lg:col-span-4" data-testid="morse-export-split-note">
          This selection has a lot of text, so the download may take a while.
          MorseWords will prepare it in smaller parts to keep the export reliable.
          Keep this tab open while the files are being prepared. Your browser may
          ask you to allow multiple downloads; each file is requested when it is
          ready.
        </p>
      ) : null}
    </div>
  );
}

export function ExportJobStatus({
  onCancel,
  onReset,
  onRetry,
  state,
}: {
  onCancel: () => void;
  onReset: () => void;
  onRetry: () => void;
  state: MorseAudioExportJobState;
}) {
  if (state.status === "idle") return null;
  const progress = state.progress;
  const percent = Math.round((progress?.overallProgress ?? 0) * 100);
  const statusText =
    state.status === "running" && progress
      ? `${capitalize(progress.stage)} part ${progress.currentPart} of ${progress.totalParts}`
      : state.status === "complete"
        ? `${state.completedPartIndexes.length} file${state.completedPartIndexes.length === 1 ? "" : "s"} generated; download request${state.completedPartIndexes.length === 1 ? "" : "s"} sent.`
        : state.errorMessage;

  return (
    <div className="mt-4" data-testid="morse-export-job" data-export-status={state.status}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700" role="status" aria-live="polite">
          {statusText}
          {progress ? ` · ${formatDuration(progress.elapsedMs)} elapsed` : ""}
          {progress?.remainingMs !== undefined
            ? ` · about ${formatDuration(progress.remainingMs)} remaining`
            : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          {state.status === "running" ? (
            <ToolButton className="min-h-10 px-3 py-1.5 text-sm" tone="light" onClick={onCancel}>
              <StopIcon size={16} title={undefined} aria-hidden="true" />
              Cancel export
            </ToolButton>
          ) : null}
          {state.status === "failed" && state.failedPart !== null ? (
            <ToolButton className="min-h-10 px-3 py-1.5 text-sm" tone="dark" onClick={onRetry}>
              <RefreshIcon size={16} title={undefined} aria-hidden="true" />
              Retry part {state.failedPart}
            </ToolButton>
          ) : null}
          {state.status === "complete" || state.status === "cancelled" ? (
            <ToolButton className="min-h-10 px-3 py-1.5 text-sm" tone="light" onClick={onReset}>
              <DownloadIcon size={16} title={undefined} aria-hidden="true" />
              Start new export
            </ToolButton>
          ) : null}
        </div>
      </div>
      {state.status === "running" ? (
        <progress
          className="mt-3 h-2 w-full accent-sky-500"
          aria-label="Export progress"
          max={100}
          value={percent}
        />
      ) : null}
      {state.status === "complete" && state.completedFiles.length > 0 ? (
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          {state.completedFiles.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

function PlanValue({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <br />
      <span className="font-semibold text-sky-950">{value}</span>
    </p>
  );
}

export function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
}

function capitalize(value: string) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}
