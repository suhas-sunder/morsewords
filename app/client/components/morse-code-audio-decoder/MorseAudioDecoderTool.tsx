import * as React from "react";

import {
  CodeIcon,
  DownloadIcon,
  RadioTowerIcon,
  TrashIcon,
  TuneIcon,
  UploadIcon,
} from "~/client/assets/svg/Icons";
import {
  ActionButton,
  ActionLinkButton,
  ActionRow,
  CopyActionButton,
} from "~/client/components/shared/ActionControls";
import { downloadTextFile } from "~/client/components/shared/actionOutputUtils";
import {
  ToolOutputPanel,
  ToolPanel,
} from "~/client/components/shared/ToolWorkspace";
import { clampNumber } from "~/client/components/shared/settingsStorage";
import {
  analyzeSamplesToMorse,
  AUDIO_DECODER_LIMITS,
  createAudioDecodeResult,
  mixAudioBufferToMono,
  type AudioDecodeResult,
  type GapMode,
  type TextSpacingMode,
  validateAudioDecoderFile,
  validateDecodedAudioBuffer,
} from "./audioDecodeUtils";

const HOME_SOFT_CONTROL =
  "mw-button-home-soft bg-white/85 text-slate-800 hover:bg-slate-900 hover:text-sky-100";
const HOME_SOFT_CONTROL_DARK =
  "mw-button-home-soft-strong bg-white/88 text-slate-900 hover:bg-slate-900 hover:text-sky-100";

const EMPTY_RESULT: AudioDecodeResult = {
  confidence: 0,
  decodedText: "",
  messages: ["Choose a file to start."],
  rawMorse: "",
  status: "empty-audio",
  timing: {
    durationSeconds: 0,
    estimatedUnitMs: 0,
    estimatedWpm: 0,
    gapCount: 0,
    noiseFloor: 0,
    peakLevel: 0,
    threshold: 0,
    toneCount: 0,
  },
};

type DecodePhase = "idle" | "ready" | "processing" | "done" | "error";

export default function MorseAudioDecoderTool() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [phase, setPhase] = React.useState<DecodePhase>("idle");
  const [result, setResult] = React.useState<AudioDecodeResult>(EMPTY_RESULT);
  const [sensitivity, setSensitivity] = React.useState(62);
  const [expectedWpm, setExpectedWpm] = React.useState(0);
  const [gapMode, setGapMode] = React.useState<GapMode>("auto");
  const [wordGapStrictness, setWordGapStrictness] = React.useState(100);
  const [minimumToneMs, setMinimumToneMs] = React.useState(22);
  const [maxToneGapMs, setMaxToneGapMs] = React.useState(14);
  const [analysisWindowMs, setAnalysisWindowMs] = React.useState(8);
  const [textSpacing, setTextSpacing] = React.useState<TextSpacingMode>("smart");
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const decodeJobRef = React.useRef(0);
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      decodeJobRef.current += 1;
    };
  }, []);

  const hasDecodedText = result.decodedText.trim().length > 0;
  const hasRawMorse = result.rawMorse.trim().length > 0;
  const decoderHref = hasRawMorse
    ? `/morse-code-decoder?morse=${encodeURIComponent(result.rawMorse)}`
    : "#";

  const setNextFile = React.useCallback((file: File | null) => {
    decodeJobRef.current += 1;
    setSelectedFile(file);

    if (file) {
      const validation = validateAudioDecoderFile(file);
      if (!validation.ok) {
        setPhase("error");
        setResult(
          createAudioDecodeResult(validation.status, [validation.message]),
        );
        return;
      }
    }

    setPhase(file ? "ready" : "idle");
    setResult(
      file
        ? {
            ...EMPTY_RESULT,
            messages: [`Ready to decode ${file.name}.`],
          }
        : EMPTY_RESULT,
    );
  }, []);

  const processFile = React.useCallback(async () => {
    const file = selectedFile;
    const jobId = decodeJobRef.current + 1;
    decodeJobRef.current = jobId;

    const applyIfCurrent = (apply: () => void) => {
      if (!mountedRef.current || decodeJobRef.current !== jobId) return false;
      apply();
      return true;
    };

    if (!file) {
      setPhase("error");
      setResult({
        ...EMPTY_RESULT,
        messages: ["Choose an audio file before decoding."],
      });
      return;
    }

    const fileValidation = validateAudioDecoderFile(file);
    if (!fileValidation.ok) {
      setPhase("error");
      setResult(createAudioDecodeResult(fileValidation.status, [fileValidation.message]));
      return;
    }

    const AudioContextCtor = getAudioContextConstructor();
    if (!AudioContextCtor) {
      setPhase("error");
      setResult({
        ...EMPTY_RESULT,
        messages: ["This browser does not expose the Web Audio API needed to decode files."],
      });
      return;
    }

    setPhase("processing");

    let audioContext: AudioContext | null = null;
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (!mountedRef.current || decodeJobRef.current !== jobId) return;

      audioContext = new AudioContextCtor();
      const decodedBuffer = await decodeAudioData(audioContext, arrayBuffer);
      if (!mountedRef.current || decodeJobRef.current !== jobId) return;

      const bufferValidation = validateDecodedAudioBuffer(decodedBuffer);
      if (!bufferValidation.ok) {
        applyIfCurrent(() => {
          setPhase("error");
          setResult(
            createAudioDecodeResult(bufferValidation.status, [bufferValidation.message], {
              durationSeconds: decodedBuffer.duration,
            }),
          );
        });
        return;
      }

      const monoSamples = mixAudioBufferToMono(decodedBuffer);
      const nextResult = analyzeSamplesToMorse(
        monoSamples,
        decodedBuffer.sampleRate,
        {
          expectedWpm:
            expectedWpm > 0
              ? clampNumber(expectedWpm, 5, 60)
              : 0,
          gapMode,
          maxToneGapMs: clampNumber(maxToneGapMs, 0, 80),
          minToneMs: clampNumber(minimumToneMs, 8, 120),
          sensitivity: clampNumber(sensitivity, 20, 90) / 100,
          textSpacing,
          windowMs: clampNumber(analysisWindowMs, 4, 40),
          wordGapScale: clampNumber(wordGapStrictness, 60, 160) / 100,
        },
      );

      applyIfCurrent(() => {
        setResult(nextResult);
        setPhase(nextResult.status === "success" || nextResult.status === "low-confidence" ? "done" : "error");
      });
    } catch {
      applyIfCurrent(() => {
        setPhase("error");
        setResult(
          createAudioDecodeResult("unsupported-file", [
            "The selected file could not be decoded by this browser. WAV is the safest format to try next.",
          ]),
        );
      });
    } finally {
      await audioContext?.close().catch(() => {});
    }
  }, [
    analysisWindowMs,
    expectedWpm,
    gapMode,
    maxToneGapMs,
    minimumToneMs,
    selectedFile,
    sensitivity,
    textSpacing,
    wordGapStrictness,
  ]);

  const clearAll = React.useCallback(() => {
    setNextFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [setNextFile]);

  const downloadDecodedText = React.useCallback(() => {
    if (!hasDecodedText) return;

    const body = [
      "MorseWords audio decoder result",
      "",
      `Decoded text: ${result.decodedText}`,
      `Raw Morse: ${result.rawMorse || "(none)"}`,
      "",
      `Estimated speed: ${formatWpm(result.timing.estimatedWpm)}`,
      `Estimated dot length: ${formatMs(result.timing.estimatedUnitMs)}`,
      `Confidence: ${formatPercent(result.confidence)}`,
    ].join("\n");
    downloadTextFile({
      filename: "morse-audio-decoder-result.txt",
      content: body,
    });
  }, [hasDecodedText, result]);

  const openFilePicker = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      const file = event.dataTransfer.files?.[0] ?? null;
      setNextFile(file);
    },
    [setNextFile],
  );

  const statusMessage = result.messages[0] ?? "Choose a file to start.";
  const liveStatusMessage = phase === "processing" ? "Decoding audio file." : "";
  const showErrorMessage = phase === "error" && statusMessage.trim().length > 0;

  return (
    <section className="mt-5 sm:mt-6" aria-label="Morse audio decoder tool">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.72fr)] lg:items-stretch">
        <ToolPanel label="Upload Morse audio" badge="File">
          <div className="px-4 pb-4">
            <input
              ref={inputRef}
              id="audio-decoder-file"
              aria-label="Choose Morse audio file"
              type="file"
              accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg"
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                setNextFile(file);
              }}
            />

            <div
              data-testid="audio-decoder-dropzone"
              role="group"
              aria-labelledby="audio-decoder-drop-title"
              aria-describedby="audio-decoder-drop-help"
              onClick={openFilePicker}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={[
                "mw-static-tile cursor-pointer rounded-xl p-5 text-center transition-[background-color,color] duration-100",
                "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-500",
                isDragActive ? "mw-static-surface-soft" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <UploadIcon
                size={30}
                title={undefined}
                aria-hidden="true"
                className="mx-auto mb-2"
              />
              <p
                id="audio-decoder-drop-title"
                className="mw-heading text-lg font-extrabold text-sky-950"
              >
                {selectedFile ? selectedFile.name : "Drop audio here"}
              </p>
              <p
                id="audio-decoder-drop-help"
                className="mw-text-muted mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-slate-700"
              >
                Drag in a Morse audio file, or choose one from your device. WAV
                is usually safest. MP3, M4A, AAC, or OGG may work when your
                browser can decode them. Files over{" "}
                {Math.round(AUDIO_DECODER_LIMITS.maxUploadBytes / (1024 * 1024))} MB
                are rejected before decoding.
              </p>
              <ActionButton
                onClick={(event) => {
                  event.stopPropagation();
                  openFilePicker();
                }}
                className="mt-4"
                leadingIcon={<UploadIcon size={16} title={undefined} aria-hidden="true" />}
              >
                Choose audio file
              </ActionButton>
            </div>

            <div className="mt-4">
              {liveStatusMessage && (
                <p role="status" aria-live="polite" className="sr-only">
                  {liveStatusMessage}
                </p>
              )}
              <ActionRow>
                <ActionButton
                  onClick={processFile}
                  disabled={phase === "processing"}
                  tone="dark"
                  leadingIcon={<RadioTowerIcon size={16} title={undefined} aria-hidden="true" />}
                >
                  {phase === "processing" ? "Decoding..." : "Decode audio"}
                </ActionButton>
                <ActionButton
                  onClick={clearAll}
                  disabled={phase === "processing" && !selectedFile}
                  leadingIcon={<TrashIcon size={16} title={undefined} aria-hidden="true" />}
                >
                  Clear
                </ActionButton>
              </ActionRow>
              {showErrorMessage && (
                <p
                  role="alert"
                  className="mw-text-muted mt-3 text-sm leading-relaxed text-slate-700"
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </ToolPanel>

        <ToolOutputPanel
          label="Decoded text"
          badge={phase === "processing" ? "Working" : "Text"}
          footer={
            <ActionRow>
              <CopyActionButton
                label="Copy decoded text"
                value={result.decodedText}
                disabled={!hasDecodedText}
                tone="darkPanel"
              />
              <ActionButton
                onClick={downloadDecodedText}
                disabled={!hasDecodedText}
                tone="darkPanel"
                leadingIcon={<DownloadIcon size={16} title={undefined} aria-hidden="true" />}
              >
                Download text
              </ActionButton>
            </ActionRow>
          }
        >
          <pre
            aria-label="Decoded text output"
            className="mw-output-bright min-h-[16rem] whitespace-pre-wrap px-4 py-5 font-mono text-lg font-bold tracking-[0.08em] text-sky-100"
          >
            {result.decodedText || "Decoded text will appear here."}
          </pre>
        </ToolOutputPanel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.72fr)]">
        <ToolOutputPanel
          label="Raw Morse"
          badge="Dots and dashes"
          footer={
            <ActionRow>
              <CopyActionButton
                label="Copy raw Morse"
                value={result.rawMorse}
                disabled={!hasRawMorse}
                tone="darkPanel"
              />
              <ActionLinkButton
                href={decoderHref}
                disabled={!hasRawMorse}
                tone="darkPanel"
                leadingIcon={<CodeIcon size={16} title={undefined} aria-hidden="true" />}
              >
                Open in Morse decoder
              </ActionLinkButton>
            </ActionRow>
          }
        >
          <pre
            aria-label="Raw Morse output"
            className="mw-output-bright min-h-[10rem] whitespace-pre-wrap px-4 py-5 font-mono text-sm font-bold tracking-[0.14em] text-sky-100"
          >
            {result.rawMorse || "Raw detected Morse will appear here."}
          </pre>
        </ToolOutputPanel>

        <ToolPanel label="Timing summary" badge="Detection">
          <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
            <SummaryStat label="Confidence" value={formatPercent(result.confidence)} />
            <SummaryStat label="Estimated speed" value={formatWpm(result.timing.estimatedWpm)} />
            <SummaryStat label="Estimated dot length" value={formatMs(result.timing.estimatedUnitMs)} />
            <SummaryStat label="Audio length" value={formatSeconds(result.timing.durationSeconds)} />
            <SummaryStat label="Tone regions" value={String(result.timing.toneCount)} />
            <SummaryStat label="Silence gaps" value={String(result.timing.gapCount)} />
            <SummaryStat label="Detection threshold" value={formatLevel(result.timing.threshold)} />
          </div>
        </ToolPanel>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setAdvancedOpen((value) => !value)}
          className={`inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 transition active:scale-95 ${HOME_SOFT_CONTROL_DARK}`}
          aria-expanded={advancedOpen}
        >
          <TuneIcon size={16} title={undefined} aria-hidden="true" />
          <span className="text-sm font-semibold text-current">
            Advanced settings
          </span>
          <span aria-hidden className="text-current opacity-80">
            {advancedOpen ? "^" : "v"}
          </span>
        </button>

        {advancedOpen && (
          <div className="grid gap-4 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SelectControl
                id="audio-decoder-gap-mode"
                label="Gap style"
                value={gapMode}
                onChange={(value) => setGapMode(value as GapMode)}
                options={[
                  { value: "auto", label: "Auto" },
                  { value: "standard", label: "Standard timing" },
                  { value: "farnsworth", label: "Wide/Farnsworth gaps" },
                ]}
              />
              <SelectControl
                id="audio-decoder-text-spacing"
                label="Text cleanup"
                value={textSpacing}
                onChange={(value) => setTextSpacing(value as TextSpacingMode)}
                options={[
                  { value: "smart", label: "Smart spacing" },
                  { value: "exact", label: "Exact Morse gaps" },
                ]}
              />
              <RangeControl
                id="audio-decoder-sensitivity"
                label="Sensitivity"
                value={sensitivity}
                min={20}
                max={90}
                suffix="%"
                onChange={setSensitivity}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <RangeControl
                id="audio-decoder-wpm"
                label="Character speed"
                value={expectedWpm}
                min={0}
                max={60}
                suffix={expectedWpm === 0 ? "Auto" : " WPM"}
                onChange={setExpectedWpm}
              />
              <RangeControl
                id="audio-decoder-word-gap"
                label="Word gap strictness"
                value={wordGapStrictness}
                min={60}
                max={160}
                suffix="%"
                onChange={setWordGapStrictness}
              />
              <RangeControl
                id="audio-decoder-min-tone"
                label="Minimum tone"
                value={minimumToneMs}
                min={8}
                max={120}
                suffix=" ms"
                onChange={setMinimumToneMs}
              />
              <RangeControl
                id="audio-decoder-tone-gap"
                label="Tone smoothing"
                value={maxToneGapMs}
                min={0}
                max={80}
                suffix=" ms"
                onChange={setMaxToneGapMs}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <RangeControl
                id="audio-decoder-window"
                label="Analysis window"
                value={analysisWindowMs}
                min={4}
                max={24}
                suffix=" ms"
                onChange={setAnalysisWindowMs}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mw-muted-label font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mw-heading mt-1 text-base font-extrabold text-sky-950">{value}</p>
    </div>
  );
}

function SelectControl({
  id,
  label,
  onChange,
  options,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mw-text-muted text-sm font-semibold text-slate-700">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className={`mt-1 w-full cursor-pointer rounded-xl p-2 transition hover:text-sky-950 ${HOME_SOFT_CONTROL}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RangeControl({
  id,
  label,
  max,
  min,
  onChange,
  suffix,
  value,
}: {
  id: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  suffix: string;
  value: number;
}) {
  const valueLabel = suffix === "Auto" ? "Auto" : `${value}${suffix}`;

  return (
    <label htmlFor={id} className="block">
      <span className="flex items-center justify-between gap-3">
        <span className="mw-heading inline-flex items-center gap-2 text-sm font-extrabold text-sky-950">
          <TuneIcon size={15} title={undefined} aria-hidden="true" />
          {label}
        </span>
        <span className="mw-text-muted text-sm text-slate-700">{valueLabel}</span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(clampNumber(Number(event.currentTarget.value), min, max))
        }
        className="mt-3 w-full cursor-pointer"
      />
    </label>
  );
}

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;
  const audioWindow = window as Window &
    typeof globalThis & {
      webkitAudioContext?: typeof AudioContext;
    };
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

function decodeAudioData(audioContext: AudioContext, arrayBuffer: ArrayBuffer) {
  return new Promise<AudioBuffer>((resolve, reject) => {
    const maybePromise = audioContext.decodeAudioData(
      arrayBuffer.slice(0),
      resolve,
      reject,
    );
    if (maybePromise instanceof Promise) {
      maybePromise.then(resolve).catch(reject);
    }
  });
}

function formatPercent(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0%";
  return `${Math.round(value * 100)}%`;
}

function formatMs(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "Auto";
  return `${Math.round(value)} ms`;
}

function formatWpm(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "Auto";
  return `${Math.round(value)} WPM`;
}

function formatSeconds(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0 s";
  return `${value.toFixed(value >= 10 ? 1 : 2)} s`;
}

function formatLevel(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "Auto";
  return value.toFixed(3);
}
