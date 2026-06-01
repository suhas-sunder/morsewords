import { buildMorseEvents } from "~/client/components/shared/morseTiming";

import {
  buildMorseTranscript,
  formatDuration,
  splitParagraphRanges,
  splitSentenceRanges,
} from "./bookDurationEstimate";
import type {
  BookBundleMetadata,
  BookExportPart,
  BookExportProgress,
  BookExportSettings,
} from "./bookExportTypes";
import { buildBundleFilename } from "./bookSegmentation";

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

const TAIL_PADDING_MS = 180;
const YIELD_EVERY_EVENTS = 80;
const TWO_PI = Math.PI * 2;

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
    message: "Preparing export manifest...",
    currentPart: 0,
    totalParts: parts.length,
  });
  await cooperativeYield(signal);

  const { strToU8, zipSync } = await import("fflate");
  const files: Record<string, Uint8Array> = {};
  const generatedAudioFiles: string[] = [];

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
    message: "Bundling transcripts and metadata...",
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
        buildManifest({ metadata, parts, settings, generatedAudioFiles }),
        null,
        2,
      ),
    );
  }

  if (settings.includeSettings) {
    files["settings.json"] = strToU8(JSON.stringify(settings, null, 2));
  }

  files["playlist.m3u"] = strToU8(buildPlaylist(generatedAudioFiles));

  if (settings.includeReadme) {
    files["README.txt"] = strToU8(
      buildReadme({ metadata, parts, settings, generatedAudioFiles }),
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
    events.reduce((sum, event) => sum + event.ms, 0) + TAIL_PADDING_MS;
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
  const attackSamples = preset === "sounder" ? 1 : Math.min(samples / 2, sampleRate * 0.008);
  const releaseSamples =
    preset === "sounder" ? 1 : Math.min(samples / 2, sampleRate * 0.012);

  for (let localIndex = 0; localIndex < samples; localIndex += 1) {
    const targetIndex = offset + localIndex;
    if (targetIndex >= output.length) break;
    const envelope = envelopeAt(localIndex, samples, attackSamples, releaseSamples);
    output[targetIndex] = waveformSample({
      preset,
      sampleIndex: targetIndex,
      hz,
      sampleRate,
    }) * amplitude * envelope;
  }
}

function waveformSample({
  hz,
  preset,
  sampleIndex,
  sampleRate,
}: {
  hz: number;
  preset: BookExportSettings["tonePreset"];
  sampleIndex: number;
  sampleRate: number;
}) {
  if (preset === "sounder") {
    const noise = Math.sin((sampleIndex + 1) * 12.9898) * 43758.5453;
    return ((noise - Math.floor(noise)) * 2 - 1) * 0.75;
  }

  const phase = ((sampleIndex * hz) / sampleRate) % 1;
  if (preset === "square") return phase < 0.5 ? 1 : -1;
  if (preset === "triangle") return 1 - 4 * Math.abs(Math.round(phase - 0.25) - (phase - 0.25));
  if (preset === "sawtooth") return 2 * phase - 1;
  return Math.sin(TWO_PI * phase);
}

function envelopeAt(
  sampleIndex: number,
  samples: number,
  attackSamples: number,
  releaseSamples: number,
) {
  const attack = attackSamples > 0 ? Math.min(1, sampleIndex / attackSamples) : 1;
  const releaseStart = samples - releaseSamples;
  const release =
    releaseSamples > 0 && sampleIndex > releaseStart
      ? Math.max(0, (samples - sampleIndex) / releaseSamples)
      : 1;
  return Math.min(attack, release);
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
  generatedAudioFiles,
  metadata,
  parts,
  settings,
}: {
  generatedAudioFiles: string[];
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  settings: BookExportSettings;
}) {
  const runtimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  return {
    title: metadata.title,
    author: metadata.author,
    filename: metadata.filename,
    sourceType: metadata.sourceType,
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
  generatedAudioFiles,
  metadata,
  parts,
  settings,
}: {
  generatedAudioFiles: string[];
  metadata: BookBundleMetadata;
  parts: BookExportPart[];
  settings: BookExportSettings;
}) {
  const title = metadata.title || metadata.filename || "MorseWords book export";
  const runtimeMs = parts.reduce((sum, part) => sum + part.morseDurationMs, 0);
  return [
    `${title}`,
    metadata.author ? `Author: ${metadata.author}` : "",
    `Source type: ${metadata.sourceType}`,
    `Preset: ${settings.presetName}`,
    `Output: ${settings.outputFormat.toUpperCase()} parts`,
    `Estimated runtime: ${formatDuration(runtimeMs)}`,
    "",
    "Files",
    ...generatedAudioFiles.map((file) => `- ${file}`),
    "- playlist.m3u",
    settings.includeCleanedText ? "- cleaned-text.txt" : "",
    settings.includeMorseTranscript ? "- morse-transcript.txt" : "",
    settings.includeManifest ? "- manifest.json" : "",
    settings.includeSettings ? "- settings.json" : "",
    "",
    "MorseWords exports long sources as separate parts so browsers do not need to render one massive audio buffer.",
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
    throw new DOMException("Book export cancelled.", "AbortError");
  }
}
