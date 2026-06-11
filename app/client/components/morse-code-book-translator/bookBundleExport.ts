import { buildMorseEvents } from "~/client/components/shared/morseTiming";
import {
  defaultAttackMs,
  defaultReleaseMs,
  envelopeAt,
  samplePresetWaveform,
} from "~/client/components/shared/audioToneSynthesis";

import {
  buildMorseTranscript,
  formatDuration,
  splitParagraphRanges,
  splitSentenceRanges,
} from "./bookDurationEstimate";
import type {
  BookBundleMetadata,
  BookDownloadKind,
  BookExportBatch,
  BookExportPart,
  BookExportProgress,
  BookExportSettings,
} from "./bookExportTypes";
import {
  assertAudioRenderWithinBrowserLimit,
  assertBookAudioPartsWithinBrowserLimit,
} from "./bookExportSafety";
import { buildBundleFilename, buildSingleAudioFilename } from "./bookSegmentation";

type LameModule = typeof import("@breezystack/lamejs");

type ExportBundleOptions = {
  allParts?: BookExportPart[];
  batch?: BookExportBatch;
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  settings: BookExportSettings;
  signal: AbortSignal;
  totalSelectedRuntimeMs?: number;
  onProgress?: (progress: BookExportProgress) => void;
};

type ExportPartsOptions = ExportBundleOptions & {
  onPartReady: (part: BookDownloadPackage) => Promise<void> | void;
};

type SignalEvent =
  | { type: "mark"; ms: number; symbol: "." | "-" }
  | { type: "gap"; ms: number };

type AudioRenderProgress = {
  encodedSamples?: number;
  renderedMs: number;
  totalMs: number;
};

const DEFAULT_TAIL_PADDING_MS = 180;
const YIELD_EVERY_EVENTS = 80;
const AUDIO_RENDER_CHUNK_SAMPLES = 4096;

export type BookDownloadPackage = {
  blob: Blob;
  filename: string;
  downloadKind: BookDownloadKind;
  contents: string[];
};

export function hasBookDownloadSidecars(settings: BookExportSettings) {
  return (
    settings.includeCleanedText ||
    settings.includeMorseTranscript ||
    settings.includeManifest ||
    settings.includeSettings ||
    settings.includeReadme
  );
}

export function getBookDownloadKind(
  parts: BookExportPart[],
  settings: BookExportSettings,
): BookDownloadKind {
  if (hasBookDownloadSidecars(settings)) return "zip";
  return parts.length === 1 ? "audio" : "zip";
}

export function describeBookDownloadContents(
  parts: BookExportPart[],
  settings: BookExportSettings,
  downloadKind = getBookDownloadKind(parts, settings),
) {
  const format = settings.outputFormat.toUpperCase();
  if (downloadKind === "audio") return [`${format} audio file`];
  if (downloadKind === "parts") return [`${format} audio parts`];
  return [
    `${format} audio ${parts.length === 1 ? "file" : "parts"}`,
    "playlist.m3u",
    settings.includeCleanedText ? "cleaned-text.txt" : "",
    settings.includeMorseTranscript ? "morse-transcript.txt" : "",
    "manifest.json",
    settings.includeSettings ? "settings.json" : "",
    settings.includeReadme ? "README.txt" : "",
  ].filter(Boolean);
}

export async function createBookDownloadPackage({
  allParts,
  batch,
  metadata,
  parts,
  settings,
  signal,
  totalSelectedRuntimeMs,
  onProgress,
}: ExportBundleOptions): Promise<BookDownloadPackage> {
  throwIfAborted(signal);
  if (parts.length === 0) {
    throw new Error("No book parts are available for download.");
  }
  assertBookAudioPartsWithinBrowserLimit(parts, settings);

  const downloadKind = getBookDownloadKind(parts, settings);
  if (downloadKind === "parts") {
    throw new Error("Use sequential part download for multi-part audio exports.");
  }
  if (downloadKind === "zip") {
    const zip = await createBookExportZip({
      allParts,
      batch,
      metadata,
      parts,
      settings,
      signal,
      totalSelectedRuntimeMs,
      onProgress,
    });
    return {
      ...zip,
      downloadKind,
      contents: describeBookDownloadContents(parts, settings, downloadKind),
    };
  }

  const [part] = parts;
  onProgress?.({
    phase: "encoding",
    message: `Encoding ${settings.outputFormat.toUpperCase()} audio file...`,
    currentPart: 0,
    totalParts: 1,
  });
  const blob = await renderBookPartAudio(part, settings, signal);
  await cooperativeYield(signal);
  onProgress?.({
    phase: "complete",
    message: "Audio file ready.",
    currentPart: 1,
    totalParts: 1,
  });
  return {
    blob,
    filename: buildSingleAudioFilename({
      sourceTitle: metadata.title || metadata.filename,
      format: settings.outputFormat,
    }),
    downloadKind,
    contents: describeBookDownloadContents(parts, settings, downloadKind),
  };
}

export async function createBookAudioPartDownloads({
  metadata,
  onPartReady,
  onProgress,
  parts,
  settings,
  signal,
}: ExportPartsOptions): Promise<{
  contents: string[];
  filenames: string[];
  totalBytes: number;
}> {
  throwIfAborted(signal);
  if (parts.length === 0) {
    throw new Error("No book parts are available for download.");
  }
  assertBookAudioPartsWithinBrowserLimit(parts, settings);

  const filenames: string[] = [];
  let totalBytes = 0;
  const totalDurationMs = totalRuntimeWithTail(parts, settings);
  let completedDurationMs = 0;
  const formatLabel = settings.outputFormat.toUpperCase();

  onProgress?.({
    phase: "splitting",
    message: "Preparing download parts...",
    currentPart: 0,
    currentPartIndex: 0,
    totalParts: parts.length,
    renderedDurationMs: 0,
    totalDurationMs,
  });
  await cooperativeYield(signal);

  for (const part of parts) {
    throwIfAborted(signal);
    const partRuntimeMs = partRuntimeWithTail(part, settings.tailPaddingMs);
    const progressForPart = ({
      renderedMs,
      totalMs,
    }: AudioRenderProgress) => {
      const aggregateRenderedMs =
        completedDurationMs + Math.max(0, Math.min(totalMs, renderedMs));
      const percent = percentLabel(aggregateRenderedMs, totalDurationMs);
      onProgress?.({
        phase: "encoding",
        message: `Rendering ${formatLabel} part ${part.index} of ${parts.length} - ${percent}`,
        currentPart: part.index - 1,
        completedParts: part.index - 1,
        currentPartIndex: part.index,
        totalParts: parts.length,
        renderedDurationMs: aggregateRenderedMs,
        totalDurationMs,
      });
    };

    progressForPart({ renderedMs: 0, totalMs: partRuntimeMs });
    let blob: Blob;
    try {
      blob = await renderBookPartAudio(part, settings, signal, progressForPart);
    } catch (error) {
      throw partFailure(part.index, error);
    }

    onProgress?.({
      phase: "bundling",
      message: `Finalizing part ${part.index} of ${parts.length}...`,
      currentPart: part.index - 1,
      completedParts: part.index - 1,
      currentPartIndex: part.index,
      totalParts: parts.length,
      renderedDurationMs: completedDurationMs + partRuntimeMs,
      totalDurationMs,
    });

    const filename = part.estimatedFilename;
    await onPartReady({
      blob,
      filename,
      downloadKind: "parts",
      contents: describeBookDownloadContents(parts, settings, "parts"),
    });
    filenames.push(filename);
    totalBytes += blob.size;
    completedDurationMs += partRuntimeMs;
    onProgress?.({
      phase: "encoding",
      message: `Part ${part.index} of ${parts.length} downloaded.`,
      currentPart: part.index,
      completedParts: part.index,
      currentPartIndex: part.index,
      totalParts: parts.length,
      renderedDurationMs: completedDurationMs,
      totalDurationMs,
    });
    await cooperativeYield(signal);
  }

  onProgress?.({
    phase: "complete",
    message: `${formatLabel} parts downloaded.`,
    currentPart: parts.length,
    completedParts: parts.length,
    currentPartIndex: parts.length,
    totalParts: parts.length,
    renderedDurationMs: totalDurationMs,
    totalDurationMs,
  });

  return {
    contents: describeBookDownloadContents(parts, settings, "parts"),
    filenames,
    totalBytes,
  };
}

export async function createBookExportZip({
  allParts,
  batch,
  metadata,
  parts,
  settings,
  signal,
  totalSelectedRuntimeMs,
  onProgress,
}: ExportBundleOptions): Promise<{ blob: Blob; filename: string }> {
  throwIfAborted(signal);
  const batchNumber = batch?.batchNumber ?? 1;
  const totalBatches = batch?.totalBatches ?? 1;
  const selectedParts = allParts && allParts.length > 0 ? allParts : parts;
  const selectedRuntimeMs =
    totalSelectedRuntimeMs ?? selectedParts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  const batchTotalDurationMs = totalRuntimeWithTail(parts, settings);
  let completedDurationMs = 0;
  onProgress?.({
    phase: "analyzing",
    message:
      totalBatches > 1
        ? `Preparing ZIP batch ${batchNumber} of ${totalBatches}...`
        : "Preparing download details...",
    batchNumber,
    batchPartCount: parts.length,
    batchPartIndex: 0,
    currentPart: 0,
    totalBatches,
    totalDurationMs: batchTotalDurationMs,
    totalParts: parts.length,
  });
  await cooperativeYield(signal);

  const { strToU8, zipSync } = await import("fflate");
  const files: Record<string, Uint8Array> = {};
  const generatedAudioFiles: string[] = [];
  const generatedAt = new Date().toISOString();

  for (const [batchPartOffset, part] of parts.entries()) {
    throwIfAborted(signal);
    const batchPartIndex = batchPartOffset + 1;
    const partRuntimeMs = partRuntimeWithTail(part, settings.tailPaddingMs);
    const progressForPart = ({
      renderedMs,
      totalMs,
    }: AudioRenderProgress) => {
      const aggregateRenderedMs =
        completedDurationMs + Math.max(0, Math.min(totalMs, renderedMs));
      const percent = percentLabel(aggregateRenderedMs, batchTotalDurationMs);
      onProgress?.({
        phase: "encoding",
        message:
          totalBatches > 1
            ? `Rendering ZIP batch ${batchNumber} of ${totalBatches} - Part ${batchPartIndex} of ${parts.length} - ${percent}`
            : `Rendering ZIP part ${batchPartIndex} of ${parts.length} - ${percent}`,
        batchNumber,
        batchPartCount: parts.length,
        batchPartIndex,
        completedParts: batchPartIndex - 1,
        currentPart: batchPartIndex - 1,
        currentPartIndex: batchPartIndex,
        renderedDurationMs: aggregateRenderedMs,
        totalBatches,
        totalDurationMs: batchTotalDurationMs,
        totalParts: parts.length,
      });
    };
    onProgress?.({
      phase: "encoding",
      message:
        totalBatches > 1
          ? `Rendering ZIP batch ${batchNumber} of ${totalBatches} - Part ${batchPartIndex} of ${parts.length}`
          : `Encoding ZIP part ${batchPartIndex} of ${parts.length}...`,
      batchNumber,
      batchPartCount: parts.length,
      batchPartIndex,
      completedParts: batchPartIndex - 1,
      currentPart: batchPartIndex - 1,
      currentPartIndex: batchPartIndex,
      renderedDurationMs: completedDurationMs,
      totalBatches,
      totalDurationMs: batchTotalDurationMs,
      totalParts: parts.length,
    });
    const audioBlob = await renderBookPartAudio(part, settings, signal, progressForPart);
    files[part.estimatedFilename] = new Uint8Array(await audioBlob.arrayBuffer());
    generatedAudioFiles.push(part.estimatedFilename);
    completedDurationMs += partRuntimeMs;
    await cooperativeYield(signal);
  }

  throwIfAborted(signal);
  onProgress?.({
    phase: "bundling",
    message:
      totalBatches > 1
        ? `Bundling ZIP batch ${batchNumber} of ${totalBatches}...`
        : "Bundling audio and selected files...",
    batchNumber,
    batchPartCount: parts.length,
    batchPartIndex: parts.length,
    currentPart: parts.length,
    completedParts: parts.length,
    currentPartIndex: parts.length,
    renderedDurationMs: batchTotalDurationMs,
    totalBatches,
    totalDurationMs: batchTotalDurationMs,
    totalParts: parts.length,
  });

  if (settings.includeCleanedText) {
    files["cleaned-text.txt"] = strToU8(
      parts.map((part) => part.cleanedText).join("\n\n"),
    );
  }

  if (settings.includeMorseTranscript) {
    files["morse-transcript.txt"] = strToU8(buildMorseTranscriptFile(parts));
  }

  files["manifest.json"] = strToU8(
    JSON.stringify(
      buildManifest({
        allParts: selectedParts,
        batchNumber,
        generatedAt,
        generatedAudioFiles,
        metadata,
        parts,
        selectedRuntimeMs,
        settings,
        totalBatches,
      }),
      null,
      2,
    ),
  );

  if (settings.includeSettings) {
    files["settings.json"] = strToU8(
      JSON.stringify(
        {
          generatedAt,
          presetName: settings.presetName,
          outputFormat: settings.outputFormat,
          charWpm: settings.charWpm,
          farnsworthWpm: settings.farnsworthWpm,
          tonePreset: settings.tonePreset,
          pitch: settings.pitch,
          volume: settings.volume,
          mp3Bitrate: settings.mp3Bitrate,
          sampleRate: settings.sampleRate,
          tailPaddingMs: settings.tailPaddingMs,
          splitMode: settings.splitMode,
          splitAudio: settings.splitAudio,
          targetPartMinutes: settings.targetPartMinutes,
          preferSourceSections: settings.preferSourceSections,
          paragraphPauseMultiplier: settings.paragraphPauseMultiplier,
          sentencePauseMultiplier: settings.sentencePauseMultiplier,
          punctuationMode: settings.punctuationMode,
          includeCleanedText: settings.includeCleanedText,
          includeMorseTranscript: settings.includeMorseTranscript,
          includeManifest: settings.includeManifest,
          includeSettings: settings.includeSettings,
          includeReadme: settings.includeReadme,
        },
        null,
        2,
      ),
    );
  }

  files["playlist.m3u"] = strToU8(buildPlaylist(generatedAudioFiles));

  if (settings.includeReadme) {
    files["README.txt"] = strToU8(
      buildReadme({ generatedAt, metadata, parts, settings, generatedAudioFiles }),
    );
  }

  const zipped = zipSync(files, { level: 6 });
  const blob = new Blob([zipped], { type: "application/zip" });
  return {
    blob,
    filename: buildBundleFilename(
      metadata.title || metadata.filename,
      totalBatches > 1 ? batchNumber : undefined,
    ),
  };
}

export async function renderBookPartAudio(
  part: BookExportPart,
  settings: BookExportSettings,
  signal: AbortSignal,
  onProgress?: (progress: AudioRenderProgress) => void,
): Promise<Blob> {
  if (settings.outputFormat === "wav") {
    return renderBookPartWavBlob(part.cleanedText, settings, signal, onProgress);
  }
  return renderBookPartMp3Blob(part.cleanedText, settings, signal, onProgress);
}

async function renderBookPartMp3Blob(
  text: string,
  settings: BookExportSettings,
  signal: AbortSignal,
  onProgress?: (progress: AudioRenderProgress) => void,
) {
  const lamejs = await loadLameJs();
  const encoder = new lamejs.Mp3Encoder(1, settings.sampleRate, settings.mp3Bitrate);
  const renderer = createChunkedSignalRenderer(text, settings);
  assertAudioRenderWithinBrowserLimit(renderer.totalMs, settings.sampleRate);
  const parts: Uint8Array[] = [];
  const mp3ChunkSize = 1152;
  let renderedSamples = 0;
  let progressSampleCursor = 0;

  onProgress?.({ renderedMs: 0, totalMs: renderer.totalMs });

  while (renderedSamples < renderer.totalSamples) {
    throwIfAborted(signal);
    const samples = Math.min(mp3ChunkSize, renderer.totalSamples - renderedSamples);
    const chunk = renderer.renderInt16Chunk(samples);
    const encoded = encoder.encodeBuffer(chunk);
    if (encoded.length > 0) parts.push(toUint8Array(encoded));
    renderedSamples += samples;

    if (renderedSamples - progressSampleCursor >= settings.sampleRate) {
      progressSampleCursor = renderedSamples;
      onProgress?.({
        encodedSamples: renderedSamples,
        renderedMs: (renderedSamples / settings.sampleRate) * 1000,
        totalMs: renderer.totalMs,
      });
      await cooperativeYield(signal);
    }
  }

  const flushed = encoder.flush();
  if (flushed.length > 0) parts.push(toUint8Array(flushed));
  onProgress?.({
    encodedSamples: renderer.totalSamples,
    renderedMs: renderer.totalMs,
    totalMs: renderer.totalMs,
  });
  return new Blob(parts.map((part) => part.slice()), { type: "audio/mpeg" });
}

async function renderBookPartWavBlob(
  text: string,
  settings: BookExportSettings,
  signal: AbortSignal,
  onProgress?: (progress: AudioRenderProgress) => void,
) {
  const renderer = createChunkedSignalRenderer(text, settings);
  assertAudioRenderWithinBrowserLimit(renderer.totalMs, settings.sampleRate);
  const dataSize = renderer.totalSamples * 2;
  const parts: ArrayBuffer[] = [buildWavHeader(dataSize, settings.sampleRate)];
  let renderedSamples = 0;

  onProgress?.({ renderedMs: 0, totalMs: renderer.totalMs });

  while (renderedSamples < renderer.totalSamples) {
    throwIfAborted(signal);
    const samples = Math.min(
      AUDIO_RENDER_CHUNK_SAMPLES,
      renderer.totalSamples - renderedSamples,
    );
    const chunk = renderer.renderInt16Chunk(samples);
    parts.push(chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength));
    renderedSamples += samples;

    if (renderedSamples % (AUDIO_RENDER_CHUNK_SAMPLES * 12) === 0) {
      onProgress?.({
        renderedMs: (renderedSamples / settings.sampleRate) * 1000,
        totalMs: renderer.totalMs,
      });
      await cooperativeYield(signal);
    }
  }

  onProgress?.({ renderedMs: renderer.totalMs, totalMs: renderer.totalMs });
  return new Blob(parts, { type: "audio/wav" });
}

function createChunkedSignalRenderer(
  text: string,
  settings: BookExportSettings,
) {
  const sampleRate = settings.sampleRate;
  const events = [
    ...buildBookSignalEvents(text, settings),
    { type: "gap" as const, ms: settings.tailPaddingMs ?? DEFAULT_TAIL_PADDING_MS },
  ].map((event) => ({
    ...event,
    samples: Math.max(0, Math.round((event.ms / 1000) * sampleRate)),
  }));
  const totalSamples = Math.max(
    1,
    events.reduce((total, event) => total + event.samples, 0),
  );
  const totalMs = (totalSamples / sampleRate) * 1000;
  const amplitude = clamp(settings.volume, 0, 1) * 0.38;
  const attackMs = defaultAttackMs(settings.tonePreset);
  const releaseMs = defaultReleaseMs(settings.tonePreset);
  let eventIndex = 0;
  let sampleInEvent = 0;
  let globalSampleIndex = 0;

  const renderInt16Chunk = (requestedSamples: number) => {
    const output = new Int16Array(requestedSamples);
    for (let index = 0; index < requestedSamples; index += 1) {
      while (
        eventIndex < events.length &&
        sampleInEvent >= events[eventIndex].samples
      ) {
        eventIndex += 1;
        sampleInEvent = 0;
      }

      const event = events[eventIndex];
      let value = 0;
      if (event?.type === "mark" && event.samples > 0 && amplitude > 0) {
        const attackSamples = Math.min(
          event.samples / 2,
          (sampleRate * attackMs) / 1000,
        );
        const releaseSamples = Math.min(
          event.samples / 2,
          (sampleRate * releaseMs) / 1000,
        );
        value =
          samplePresetWaveform({
            preset: settings.tonePreset,
            sampleIndex: globalSampleIndex,
            localSampleIndex: sampleInEvent,
            samples: event.samples,
            hz: settings.pitch,
            sampleRate,
          }) *
          amplitude *
          envelopeAt(sampleInEvent, event.samples, attackSamples, releaseSamples);
      }
      output[index] = floatToInt16(value);
      sampleInEvent += 1;
      globalSampleIndex += 1;
    }
    return output;
  };

  return {
    renderInt16Chunk,
    totalMs,
    totalSamples,
  };
}

function buildWavHeader(dataSize: number, sampleRate: number) {
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize);
  const view = new DataView(arrayBuffer);
  let offset = 0;
  const writeString = (value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
    offset += value.length;
  };

  writeString("RIFF");
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * 2, true);
  offset += 4;
  view.setUint16(offset, 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, dataSize, true);
  return arrayBuffer;
}

export async function renderBookPartPcm(
  text: string,
  settings: BookExportSettings,
  signal: AbortSignal,
  onProgress?: (progress: AudioRenderProgress) => void,
): Promise<Float32Array> {
  throwIfAborted(signal);
  const events = buildBookSignalEvents(text, settings);
  const sampleRate = settings.sampleRate;
  const totalMs =
    events.reduce((sum, event) => sum + event.ms, 0) +
    (settings.tailPaddingMs ?? DEFAULT_TAIL_PADDING_MS);
  assertAudioRenderWithinBrowserLimit(totalMs, sampleRate);
  const totalSamples = Math.max(1, Math.ceil((totalMs / 1000) * sampleRate));
  const output = new Float32Array(totalSamples);
  const amplitude = clamp(settings.volume, 0, 1) * 0.38;
  let offset = 0;
  let renderedMs = 0;
  onProgress?.({ renderedMs: 0, totalMs });

  for (let eventIndex = 0; eventIndex < events.length; eventIndex += 1) {
    throwIfAborted(signal);
    const event = events[eventIndex];
    const samples = Math.max(0, Math.round((event.ms / 1000) * sampleRate));

    if (event.type === "mark" && samples > 0 && amplitude > 0) {
      writeTone({
        output,
        offset,
        samples,
        sampleRate,
        hz: settings.pitch,
        amplitude,
        preset: settings.tonePreset,
      });
    }

    offset += samples;
    renderedMs += event.ms;
    if (eventIndex > 0 && eventIndex % YIELD_EVERY_EVENTS === 0) {
      onProgress?.({ renderedMs, totalMs });
      await cooperativeYield(signal);
    }
  }

  onProgress?.({ renderedMs: totalMs, totalMs });
  return output;
}

export function buildBookSignalEvents(
  text: string,
  settings: BookExportSettings,
): SignalEvent[] {
  const events: SignalEvent[] = [];
  const paragraphs = splitParagraphRanges(text);

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const sentences = splitSentenceRanges(paragraph.text);
    sentences.forEach((sentence, sentenceIndex) => {
      const morse = buildMorseTranscript(sentence.text);
      buildMorseEvents(morse, {
        charWpm: settings.charWpm,
        farnsworthWpm: settings.farnsworthWpm,
      }).forEach((event) => {
        if (event.type === "mark") {
          events.push({ type: "mark", ms: event.ms, symbol: event.symbol });
        } else {
          events.push({ type: "gap", ms: event.ms });
        }
      });

      if (sentenceIndex < sentences.length - 1) {
        events.push({
          type: "gap",
          ms: sentencePauseMs(settings),
        });
      }
    });

    if (paragraphIndex < paragraphs.length - 1) {
      events.push({
        type: "gap",
        ms: paragraphPauseMs(settings),
      });
    }
  });

  return events;
}

function sentencePauseMs(settings: BookExportSettings) {
  return wordGapMs(settings) * settings.sentencePauseMultiplier;
}

function paragraphPauseMs(settings: BookExportSettings) {
  return wordGapMs(settings) * settings.paragraphPauseMultiplier;
}

function wordGapMs(settings: BookExportSettings) {
  const morse = buildMorseTranscript("A A");
  const events = buildMorseEvents(morse, {
    charWpm: settings.charWpm,
    farnsworthWpm: settings.farnsworthWpm,
  });
  return events.find((event) => event.type === "gap" && event.gap === "word")?.ms ?? 0;
}

function writeTone({
  amplitude,
  hz,
  offset,
  output,
  preset,
  sampleRate,
  samples,
}: {
  amplitude: number;
  hz: number;
  offset: number;
  output: Float32Array;
  preset: BookExportSettings["tonePreset"];
  sampleRate: number;
  samples: number;
}) {
  const attackSamples = Math.min(
    samples / 2,
    (sampleRate * defaultAttackMs(preset)) / 1000,
  );
  const releaseSamples = Math.min(
    samples / 2,
    (sampleRate * defaultReleaseMs(preset)) / 1000,
  );

  for (let localIndex = 0; localIndex < samples; localIndex += 1) {
    const targetIndex = offset + localIndex;
    if (targetIndex >= output.length) break;
    const envelope = envelopeAt(localIndex, samples, attackSamples, releaseSamples);
    output[targetIndex] = samplePresetWaveform({
      preset,
      sampleIndex: targetIndex,
      localSampleIndex: localIndex,
      samples,
      hz,
      sampleRate,
    }) * amplitude * envelope;
  }
}

async function pcmToWavBlob(
  pcm: Float32Array,
  sampleRate: number,
  signal: AbortSignal,
  onProgress?: (progress: AudioRenderProgress) => void,
) {
  const headerSize = 44;
  const dataSize = pcm.length * 2;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);
  let offset = 0;
  const writeString = (value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
    offset += value.length;
  };

  writeString("RIFF");
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * 2, true);
  offset += 4;
  view.setUint16(offset, 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, dataSize, true);
  offset += 4;

  const totalMs = (pcm.length / sampleRate) * 1000;
  const yieldEverySamples = Math.max(sampleRate, 1);
  for (let index = 0; index < pcm.length; index += 1) {
    throwIfAborted(signal);
    view.setInt16(offset, floatToInt16(pcm[index]), true);
    offset += 2;
    if (index > 0 && index % yieldEverySamples === 0) {
      onProgress?.({
        renderedMs: (index / sampleRate) * 1000,
        totalMs,
      });
      await cooperativeYield(signal);
    }
  }

  onProgress?.({ renderedMs: totalMs, totalMs });
  return new Blob([arrayBuffer], { type: "audio/wav" });
}

async function pcmToMp3Blob(
  pcm: Float32Array,
  sampleRate: number,
  kbps: number,
  signal: AbortSignal,
  onProgress?: (progress: AudioRenderProgress) => void,
) {
  const lamejs = await loadLameJs();
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, kbps);
  const chunkSize = 1152;
  const parts: Uint8Array[] = [];
  const totalMs = (pcm.length / sampleRate) * 1000;

  for (let sampleIndex = 0; sampleIndex < pcm.length; sampleIndex += chunkSize) {
    throwIfAborted(signal);
    const end = Math.min(pcm.length, sampleIndex + chunkSize);
    const chunk = new Int16Array(end - sampleIndex);
    for (let index = sampleIndex; index < end; index += 1) {
      chunk[index - sampleIndex] = floatToInt16(pcm[index]);
    }
    const encoded = encoder.encodeBuffer(chunk);
    if (encoded.length > 0) parts.push(toUint8Array(encoded));
    if (sampleIndex > 0 && sampleIndex % (chunkSize * 48) === 0) {
      onProgress?.({
        encodedSamples: sampleIndex,
        renderedMs: (sampleIndex / sampleRate) * 1000,
        totalMs,
      });
      await cooperativeYield(signal);
    }
  }

  const flushed = encoder.flush();
  if (flushed.length > 0) parts.push(toUint8Array(flushed));
  onProgress?.({ encodedSamples: pcm.length, renderedMs: totalMs, totalMs });
  return new Blob(parts.map((part) => part.slice()), { type: "audio/mpeg" });
}

let lameModulePromise: Promise<LameModule> | null = null;

function loadLameJs() {
  if (!lameModulePromise) {
    lameModulePromise = import("@breezystack/lamejs");
  }
  return lameModulePromise;
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

function buildPlaylist(files: string[]) {
  return ["#EXTM3U", ...files.map((file) => `./${file}`), ""].join("\n");
}

function buildManifest({
  allParts,
  batchNumber,
  generatedAt,
  generatedAudioFiles,
  metadata,
  parts,
  selectedRuntimeMs,
  settings,
  totalBatches,
}: {
  allParts: BookExportPart[];
  batchNumber: number;
  generatedAt: string;
  generatedAudioFiles: string[];
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  selectedRuntimeMs: number;
  settings: BookExportSettings;
  totalBatches: number;
}) {
  const runtimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  return {
    app: "MorseWords",
    generatedAt,
    createdAt: generatedAt,
    outputType: "audio",
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
    batchNumber,
    totalBatches,
    partCount: parts.length,
    partCountInBatch: parts.length,
    globalPartCount: allParts.length,
    totalSelectedRuntimeEstimate: formatDuration(selectedRuntimeMs),
    totalSelectedRuntimeMs: selectedRuntimeMs,
    batchRuntimeEstimate: formatDuration(runtimeMs),
    batchRuntimeMs: runtimeMs,
    runtimeEstimate: formatDuration(runtimeMs),
    runtimeMs,
    selectedFormat: settings.outputFormat,
    outputFormat: settings.outputFormat,
    presetName: settings.presetName,
    settingsSummary: {
      charWpm: settings.charWpm,
      farnsworthWpm: settings.farnsworthWpm,
      tonePreset: settings.tonePreset,
      pitch: settings.pitch,
      volume: settings.volume,
      paragraphPauseMultiplier: settings.paragraphPauseMultiplier,
      sentencePauseMultiplier: settings.sentencePauseMultiplier,
      punctuationMode: settings.punctuationMode,
      outputFormat: settings.outputFormat,
      mp3Bitrate: settings.mp3Bitrate,
      sampleRate: settings.sampleRate,
      tailPaddingMs: settings.tailPaddingMs,
      splitMode: settings.splitMode,
      splitAudio: settings.splitAudio,
      targetPartMinutes: settings.targetPartMinutes,
      preferSourceSections: settings.preferSourceSections,
    },
    files: {
      audio: generatedAudioFiles,
      cleanedText: settings.includeCleanedText ? "cleaned-text.txt" : undefined,
      morseTranscript: settings.includeMorseTranscript
        ? "morse-transcript.txt"
        : undefined,
      settings: settings.includeSettings ? "settings.json" : undefined,
      playlist: "playlist.m3u",
      readme: settings.includeReadme ? "README.txt" : undefined,
    },
    parts: parts.map((part) => ({
      index: part.index,
      title: part.title,
      filename: part.estimatedFilename,
      sourceStart: part.sourceStart,
      sourceEnd: part.sourceEnd,
      coverage: {
        sourceStart: part.sourceStart,
        sourceEnd: part.sourceEnd,
        excerpt: part.cleanedExcerpt,
      },
      runtimeEstimate: formatDuration(part.morseDurationMs),
      runtimeMs: part.morseDurationMs,
      excerpt: part.cleanedExcerpt,
    })),
    allParts: allParts.map((part) => ({
      index: part.index,
      title: part.title,
      sourceStart: part.sourceStart,
      sourceEnd: part.sourceEnd,
      runtimeEstimate: formatDuration(part.morseDurationMs),
      runtimeMs: part.morseDurationMs,
    })),
  };
}

function buildReadme({
  generatedAt,
  generatedAudioFiles,
  metadata,
  parts,
  settings,
}: {
  generatedAt: string;
  generatedAudioFiles: string[];
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  settings: BookExportSettings;
}) {
  const title = metadata.title || metadata.filename || "MorseWords book download";
  const runtimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  return [
    `${title}`,
    metadata.author ? `Author: ${metadata.author}` : "",
    `Source type: ${metadata.sourceType}`,
    `Generated: ${generatedAt}`,
    `Preset: ${settings.presetName}`,
    `Output: ${settings.outputFormat.toUpperCase()} ${
      settings.splitMode !== "none" ? "parts" : "audio file"
    }`,
    `Estimated runtime: ${formatDuration(runtimeMs)}`,
    `Part count: ${parts.length}`,
    "",
    "Files",
    ...generatedAudioFiles.map((file) => `- ${file}`),
    "- playlist.m3u",
    settings.includeCleanedText ? "- cleaned-text.txt" : "",
    settings.includeMorseTranscript ? "- morse-transcript.txt" : "",
    settings.includeManifest ? "- manifest.json" : "",
    settings.includeSettings ? "- settings.json" : "",
    "",
    "Notes",
    settings.splitMode !== "none"
      ? "- Audio parts are sorted by filename and listed in playlist.m3u."
      : "",
    settings.splitMode !== "none"
      ? "- Parts are based on estimated Morse runtime and safe text boundaries, not necessarily original book chapters."
      : "",
    "- MP3 is recommended for long downloads. WAV is uncompressed and can be large.",
    "- Source files are processed in your browser. Use source text you have the right to convert and use.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function totalRuntimeWithTail(parts: BookExportPart[], settings: BookExportSettings) {
  return parts.reduce(
    (total, part) => total + partRuntimeWithTail(part, settings.tailPaddingMs),
    0,
  );
}

function partRuntimeWithTail(part: BookExportPart, tailPaddingMs: number) {
  return Math.max(0, part.morseDurationMs) + Math.max(0, tailPaddingMs);
}

function percentLabel(renderedMs: number, totalMs: number) {
  if (!Number.isFinite(totalMs) || totalMs <= 0) return "0%";
  return `${Math.max(0, Math.min(100, Math.round((renderedMs / totalMs) * 100)))}%`;
}

function partFailure(partIndex: number, error: unknown) {
  const cause = error instanceof Error ? error : undefined;
  return new Error(
    `Part ${partIndex} failed. Retry the download; completed files can be kept.`,
    cause ? { cause } : undefined,
  );
}

function floatToInt16(value: number) {
  const sample = clamp(value, -1, 1);
  return sample < 0 ? sample * 0x8000 : sample * 0x7fff;
}

function toUint8Array(input: Int8Array | Uint8Array) {
  return input instanceof Uint8Array
    ? input.slice()
    : new Uint8Array(input.buffer, input.byteOffset, input.byteLength).slice();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

async function cooperativeYield(signal: AbortSignal) {
  throwIfAborted(signal);
  await new Promise((resolve) => globalThis.setTimeout(resolve, 0));
  throwIfAborted(signal);
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new DOMException("Book download cancelled.", "AbortError");
  }
}
