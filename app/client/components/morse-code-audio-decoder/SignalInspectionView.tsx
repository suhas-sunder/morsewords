import { useId } from "react";
import type { AudioDecodeResult } from "./audioDecodeUtils";

export function signalCheckLabel(result: AudioDecodeResult) {
  if (!result.inspection) return "Not analyzed";
  if (!result.timing.toneCount) return "No clear tones";
  return result.status === "success" ? "Consistent timing" : "Needs review";
}

export function SignalInspectionView({ result }: { result: AudioDecodeResult }) {
  const descriptionId = useId();
  const inspection = result.inspection;
  if (!inspection) return null;
  const { envelope, toneCoverage, offThreshold } = inspection;
  const { durationSeconds, peakLevel, noiseFloor, threshold, toneCount, gapCount, estimatedUnitMs } = result.timing;
  const scale = Math.max(0.0005, peakLevel);
  const y = (level: number) => 142 - Math.min(1, Math.max(0, level / scale)) * 126;
  const x = (index: number) => 8 + index * 984 / Math.max(1, envelope.length - 1);
  const path = envelope.map((level, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(level).toFixed(1)}`).join(" ");
  const tonePath = toneCoverage.map((coverage, index) => coverage > 0
    ? `M${x(index).toFixed(1)},176v${(-coverage * 20).toFixed(1)}` : "").join(" ");
  return <details className="mt-4 text-slate-700">
    <summary className="mw-button-home-soft-strong cursor-pointer rounded-lg bg-white/88 px-4 py-3 font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Inspect detected signal</summary>
    <div className="space-y-4 pt-4">
      <p id={descriptionId} className="max-w-[80ch] text-sm leading-relaxed">
        {durationSeconds.toFixed(2)} seconds analyzed: {toneCount} tone regions and {gapCount} internal silence gaps.
        {estimatedUnitMs > 0 ? ` The decoder used a ${Math.round(estimatedUnitMs)} ms dot duration (${inspection.timingSource} timing).` : " No dot duration could be established."}
        {" "}The signal check describes timing consistency and noise separation; it is not a probability that the text is correct. Listen and compare the raw Morse.
      </p>
      <figure className="m-0">
        <svg viewBox="0 0 1000 184" className="w-full text-sky-900" role="img" aria-label="Amplitude envelope and detected tone overview" aria-describedby={descriptionId}>
          <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d={`M8,${y(threshold)}H992`} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 5" vectorEffect="non-scaling-stroke" />
          <path d={`M8,${y(offThreshold)}H992`} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
          <path d={tonePath} fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="flex justify-between font-mono text-xs"><span>0 s</span><span>{durationSeconds.toFixed(2)} s</span></div>
        <figcaption className="mt-3 max-w-[80ch] text-sm leading-relaxed">
          Solid line: peak amplitude in each of {envelope.length} equal time bins. Long dashes: tone-on threshold. Short dashes: tone-off threshold. Bottom marks: proportion of each bin classified as tone after noise filtering. Empty parts of that strip are gaps. This whole-recording overview preserves peaks; long recordings can contain several dots or dashes within a bin.
        </figcaption>
      </figure>
      <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="font-semibold">Peak / noise floor</dt><dd>{peakLevel.toFixed(4)} / {noiseFloor.toFixed(4)} RMS</dd></div>
        <div><dt className="font-semibold">Tone on / off</dt><dd>{threshold.toFixed(4)} / {offThreshold.toFixed(4)} RMS</dd></div>
        <div><dt className="font-semibold">Letter-gap boundary</dt><dd>{inspection.letterThresholdMs ? `${Math.round(inspection.letterThresholdMs)} ms` : "Not established"}</dd></div>
        <div><dt className="font-semibold">Word-gap boundary</dt><dd>{inspection.wordThresholdMs ? `${Math.round(inspection.wordThresholdMs)} ms` : "Not established"}</dd></div>
      </dl>
      <p className="max-w-[80ch] text-sm leading-relaxed">These are the boundaries used for this result. Change sensitivity or timing in Advanced settings, then decode again to compare. Audio and inspection data stay in this tab.</p>
    </div>
  </details>;
}
