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
  BookExportPart,
  BookExportProgress,
  BookExportSettings,
} from "./bookExportTypes";
import { buildBundleFilename, buildSingleAudioFilename } from "./bookSegmentation";

type LameModule = typeof import("@breezystack/lamejs");

type ExportBundleOptions = {
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  settings: BookExportSettings;
  signal: AbortSignal;
  onProgress?: (progress: BookExportProgress) => void;
};

type SignalEvent =
  | { type: "mark"; ms: number; symbol: "." | "-" }
  | { type: "gap"; ms: number };

const DEFAULT_TAIL_PADDING_MS = 180;
const YIELD_EVERY_EVENTS = 80;

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
  return parts.length === 1 && !hasBookDownloadSidecars(settings)
    ? "audio"
    : "zip";
}

export function describeBookDownloadContents(
  parts: BookExportPart[],
  settings: BookExportSettings,
  downloadKind = getBookDownloadKind(parts, settings),
) {
  const format = settings.outputFormat.toUpperCase();
  if (downloadKind === "audio") return [`${format} audio file`];
  return [
    `${format} audio ${parts.length === 1 ? "file" : "parts"}`,
    "playlist.m3u",
    settings.includeCleanedText ? "cleaned-text.txt" : "",
    settings.includeMorseTranscript ? "morse-transcript.txt" : "",
    settings.includeManifest ? "manifest.json" : "",
    settings.includeSettings ? "settings.json" : "",
    settings.includeReadme ? "README.txt" : "",
  ].filter(Boolean);
}

export async function createBookDownloadPackage({
  metadata,
  parts,
  settings,
  signal,
  onProgress,
}: ExportBundleOptions): Promise<BookDownloadPackage> {
  throwIfAborted(signal);
  if (parts.length === 0) {
    throw new Error("No book parts are available for download.");
  }

  const downloadKind = getBookDownloadKind(parts, settings);
  if (downloadKind === "zip") {
    const zip = await createBookExportZip({
      metadata,
      parts,
      settings,
      signal,
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

export async function createBookExportZip({
  metadata,
  parts,
  settings,
  signal,
  onProgress,
}: ExportBundleOptions): Promise<{ blob: Blob; filename: string }> {
  throwIfAborted(signal);
  onProgress?.({
    phase: "analyzing",
    message: "Preparing download details...",
    currentPart: 0,
    totalParts: parts.length,
  });
  await cooperativeYield(signal);

  const { strToU8, zipSync } = await import("fflate");
  const files: Record<string, Uint8Array> = {};
  const generatedAudioFiles: string[] = [];
  const generatedAt = new Date().toISOString();

  for (const part of parts) {
    throwIfAborted(signal);
    onProgress?.({
      phase: "encoding",
      message: `Encoding part ${part.index} of ${parts.length}...`,
      currentPart: part.index,
      totalParts: parts.length,
    });
    const audioBlob = await renderBookPartAudio(part, settings, signal);
    files[part.estimatedFilename] = new Uint8Array(await audioBlob.arrayBuffer());
    generatedAudioFiles.push(part.estimatedFilename);
    await cooperativeYield(signal);
  }

  throwIfAborted(signal);
  onProgress?.({
    phase: "bundling",
    message: "Bundling audio and selected files...",
    currentPart: parts.length,
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

  if (settings.includeManifest) {
    files["manifest.json"] = strToU8(
      JSON.stringify(
        buildManifest({
          generatedAt,
          metadata,
          parts,
          settings,
          generatedAudioFiles,
        }),
        null,
        2,
      ),
    );
  }

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
    filename: buildBundleFilename(metadata.title || metadata.filename),
  };
}

export async function renderBookPartAudio(
  part: BookExportPart,
  settings: BookExportSettings,
  signal: AbortSignal,
): Promise<Blob> {
  const pcm = await renderBookPartPcm(part.cleanedText, settings, signal);
  if (settings.outputFormat === "wav") {
    return pcmToWavBlob(pcm, settings.sampleRate);
  }
  return pcmToMp3Blob(pcm, settings.sampleRate, settings.mp3Bitrate, signal);
}

export async function renderBookPartPcm(
  text: string,
  settings: BookExportSettings,
  signal: AbortSignal,
): Promise<Float32Array> {
  throwIfAborted(signal);
  const events = buildBookSignalEvents(text, settings);
  const sampleRate = settings.sampleRate;
  const totalMs =
    events.reduce((sum, event) => sum + event.ms, 0) +
    (settings.tailPaddingMs ?? DEFAULT_TAIL_PADDING_MS);
  const totalSamples = Math.max(1, Math.ceil((totalMs / 1000) * sampleRate));
  const output = new Float32Array(totalSamples);
  const amplitude = clamp(settings.volume, 0, 1) * 0.38;
  let offset = 0;

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
    if (eventIndex > 0 && eventIndex % YIELD_EVERY_EVENTS === 0) {
      await cooperativeYield(signal);
    }
  }

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

function pcmToWavBlob(pcm: Float32Array, sampleRate: number) {
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

  for (let index = 0; index < pcm.length; index += 1) {
    view.setInt16(offset, floatToInt16(pcm[index]), true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

async function pcmToMp3Blob(
  pcm: Float32Array,
  sampleRate: number,
  kbps: number,
  signal: AbortSignal,
) {
  const lamejs = await loadLameJs();
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, kbps);
  const chunkSize = 1152;
  const parts: Uint8Array[] = [];

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
      await cooperativeYield(signal);
    }
  }

  const flushed = encoder.flush();
  if (flushed.length > 0) parts.push(toUint8Array(flushed));
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
  const runtimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  return {
    generatedAt,
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
      runtimeEstimate: formatDuration(part.morseDurationMs),
      runtimeMs: part.morseDurationMs,
      excerpt: part.cleanedExcerpt,
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
      settings.splitAudio ? "parts" : "audio file"
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
    settings.splitAudio
      ? "- Audio parts are sorted by filename and listed in playlist.m3u."
      : "",
    settings.splitAudio
      ? "- Parts are based on estimated Morse runtime and safe text boundaries, not necessarily original book chapters."
      : "",
    "- MP3 is recommended for long downloads. WAV is uncompressed and can be large.",
    "- Source files are processed in your browser. Use source text you have the right to convert and use.",
  ]
    .filter((line) => line !== "")
    .join("\n");
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
