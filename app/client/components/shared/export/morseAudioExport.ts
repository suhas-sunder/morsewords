import type { AudioTonePresetId } from "~/client/components/shared/audioPresetRegistry";
import {
  defaultAttackMs,
  defaultReleaseMs,
  envelopeAt,
  samplePresetWaveform,
} from "~/client/components/shared/audioToneSynthesis";
import { AUDIO_LEAD_IN_RANGE } from "~/client/components/shared/morseSettings";
import { buildMorseTimeline } from "~/client/components/shared/morseTiming";

import type { MorseExportFormat } from "./morseExportPlan";

type LameModule = typeof import("@breezystack/lamejs");

export type MorseAudioExportSettings = {
  attackMs?: number;
  charWpm: number;
  farnsworthWpm?: number;
  format: Extract<MorseExportFormat, "mp3" | "wav">;
  /** Silence added before the first Morse element in every generated file. */
  leadInMs?: number;
  mp3Kbps?: number;
  pitch: number;
  releaseMs?: number;
  sampleRate: number;
  tailPaddingMs?: number;
  tonePreset: AudioTonePresetId;
  volume: number;
};

export type MorseAudioRenderProgress = {
  renderedMs: number;
  stage: "preparing" | "rendering" | "encoding" | "finalizing";
  totalMs: number;
};

const PCM_CHUNK_SAMPLES = 4096;
const MP3_CHUNK_SAMPLES = 1152;
let lameModulePromise: Promise<LameModule> | null = null;

export async function renderMorseAudioBlob({
  morse,
  onProgress,
  settings,
  signal,
}: {
  morse: string;
  onProgress?: (progress: MorseAudioRenderProgress) => void;
  settings: MorseAudioExportSettings;
  signal: AbortSignal;
}) {
  throwIfAborted(signal);
  const renderer = createMorsePcmChunkRenderer(morse, settings);
  onProgress?.({ renderedMs: 0, stage: "preparing", totalMs: renderer.totalMs });
  await cooperativeYield(signal);

  return settings.format === "mp3"
    ? renderMp3(renderer, settings, signal, onProgress)
    : renderMorsePcmAsWav(renderer, signal, onProgress);
}

export function createMorsePcmChunkRenderer(
  morse: string,
  settings: Omit<MorseAudioExportSettings, "format">,
) {
  const sampleRate = Math.max(8_000, Math.round(settings.sampleRate));
  const timeline = buildMorseTimeline(morse, {
    charWpm: settings.charWpm,
    farnsworthWpm: settings.farnsworthWpm,
    tailPaddingMs: settings.tailPaddingMs,
  });
  const events = timeline.events.map((event) => ({
    ...event,
    samples: Math.max(0, Math.round((event.ms / 1000) * sampleRate)),
  }));
  const requestedLeadInMs = Number(settings.leadInMs ?? 0);
  const leadInMs = Number.isFinite(requestedLeadInMs)
    ? Math.max(
        AUDIO_LEAD_IN_RANGE.min,
        Math.min(AUDIO_LEAD_IN_RANGE.max, Math.round(requestedLeadInMs)),
      )
    : 0;
  const leadInSamples = Math.max(
    0,
    Math.round((leadInMs / 1000) * sampleRate),
  );
  const tailSamples = Math.max(
    0,
    Math.round((timeline.tailPaddingMs / 1000) * sampleRate),
  );
  const totalSamples = Math.max(
    1,
    leadInSamples +
      events.reduce((sum, event) => sum + event.samples, 0) +
      tailSamples,
  );
  const amplitude = Math.max(0, Math.min(1, settings.volume)) * 0.38;
  const attackMs = Math.max(
    0,
    settings.attackMs ?? defaultAttackMs(settings.tonePreset),
  );
  const releaseMs = Math.max(
    0,
    settings.releaseMs ?? defaultReleaseMs(settings.tonePreset),
  );
  let eventIndex = 0;
  let sampleInEvent = 0;
  let globalSampleIndex = 0;

  const renderInt16Chunk = (requestedSamples: number) => {
    const output = new Int16Array(requestedSamples);
    for (let index = 0; index < requestedSamples; index += 1) {
      if (globalSampleIndex < leadInSamples) {
        globalSampleIndex += 1;
        continue;
      }

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
            // The audible signal begins at the same waveform phase regardless
            // of the optional export-only lead-in silence.
            sampleIndex: globalSampleIndex - leadInSamples,
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
    sampleRate,
    timeline,
    totalMs: (totalSamples / sampleRate) * 1000,
    totalSamples,
  };
}

export type MorsePcmChunkRenderer = ReturnType<
  typeof createMorsePcmChunkRenderer
>;

export async function renderMorsePcmAsWav(
  renderer: MorsePcmChunkRenderer,
  signal: AbortSignal,
  onProgress?: (progress: MorseAudioRenderProgress) => void,
) {
  const chunks: ArrayBuffer[] = [
    buildWavHeader(renderer.totalSamples * 2, renderer.sampleRate),
  ];
  let renderedSamples = 0;
  let nextYieldAt = renderer.sampleRate;
  onProgress?.({ renderedMs: 0, stage: "rendering", totalMs: renderer.totalMs });

  while (renderedSamples < renderer.totalSamples) {
    throwIfAborted(signal);
    const count = Math.min(
      PCM_CHUNK_SAMPLES,
      renderer.totalSamples - renderedSamples,
    );
    const chunk = renderer.renderInt16Chunk(count);
    chunks.push(chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength));
    renderedSamples += count;
    if (renderedSamples >= nextYieldAt) {
      onProgress?.({
        renderedMs: (renderedSamples / renderer.sampleRate) * 1000,
        stage: "rendering",
        totalMs: renderer.totalMs,
      });
      nextYieldAt += renderer.sampleRate;
      await cooperativeYield(signal);
    }
  }

  onProgress?.({
    renderedMs: renderer.totalMs,
    stage: "finalizing",
    totalMs: renderer.totalMs,
  });
  return new Blob(chunks, { type: "audio/wav" });
}

async function renderMp3(
  renderer: MorsePcmChunkRenderer,
  settings: MorseAudioExportSettings,
  signal: AbortSignal,
  onProgress?: (progress: MorseAudioRenderProgress) => void,
) {
  const lamejs = await loadLameJs();
  return encodeMorsePcmAsMp3({
    createEncoder: (sampleRate, bitrateKbps) =>
      new lamejs.Mp3Encoder(1, sampleRate, bitrateKbps),
    onProgress,
    renderer,
    settings,
    signal,
  });
}

export type MorseMp3Encoder = {
  encodeBuffer: (pcm: Int16Array) => Int8Array | Uint8Array;
  flush: () => Int8Array | Uint8Array;
};

export async function encodeMorsePcmAsMp3({
  createEncoder,
  onProgress,
  renderer,
  settings,
  signal,
}: {
  createEncoder: (sampleRate: number, bitrateKbps: number) => MorseMp3Encoder;
  onProgress?: (progress: MorseAudioRenderProgress) => void;
  renderer: MorsePcmChunkRenderer;
  settings: MorseAudioExportSettings;
  signal: AbortSignal;
}) {
  throwIfAborted(signal);
  const encoder = createEncoder(
    renderer.sampleRate,
    Math.max(32, Math.min(320, Math.round(settings.mp3Kbps ?? 128))),
  );
  const chunks: Uint8Array[] = [];
  let renderedSamples = 0;
  let nextYieldAt = renderer.sampleRate;
  onProgress?.({ renderedMs: 0, stage: "encoding", totalMs: renderer.totalMs });

  while (renderedSamples < renderer.totalSamples) {
    throwIfAborted(signal);
    const count = Math.min(
      MP3_CHUNK_SAMPLES,
      renderer.totalSamples - renderedSamples,
    );
    const pcm = renderer.renderInt16Chunk(count);
    const encoded = encoder.encodeBuffer(pcm);
    if (encoded.length > 0) chunks.push(toUint8Array(encoded).slice());
    renderedSamples += count;
    if (renderedSamples >= nextYieldAt) {
      onProgress?.({
        renderedMs: (renderedSamples / renderer.sampleRate) * 1000,
        stage: "encoding",
        totalMs: renderer.totalMs,
      });
      nextYieldAt += renderer.sampleRate;
      await cooperativeYield(signal);
    }
  }

  const flushed = encoder.flush();
  if (flushed.length > 0) chunks.push(toUint8Array(flushed).slice());
  onProgress?.({
    renderedMs: renderer.totalMs,
    stage: "finalizing",
    totalMs: renderer.totalMs,
  });
  return new Blob(
    chunks.map((chunk) =>
      chunk.buffer.slice(
        chunk.byteOffset,
        chunk.byteOffset + chunk.byteLength,
      ) as ArrayBuffer,
    ),
    { type: "audio/mpeg" },
  );
}

function buildWavHeader(dataSize: number, sampleRate: number) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
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
  return buffer;
}

function floatToInt16(value: number) {
  const sample = Math.max(-1, Math.min(1, value));
  return sample < 0 ? Math.round(sample * 0x8000) : Math.round(sample * 0x7fff);
}

function toUint8Array(input: Int8Array | Uint8Array) {
  return input instanceof Uint8Array
    ? input
    : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
}

function loadLameJs() {
  if (!lameModulePromise) lameModulePromise = import("@breezystack/lamejs");
  return lameModulePromise;
}

export function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException("Export cancelled.", "AbortError");
}

export async function cooperativeYield(signal: AbortSignal) {
  throwIfAborted(signal);
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  throwIfAborted(signal);
}
