type LameJsGlobal = {
  Mp3Encoder: new (channels: number, sampleRate: number, kbps: number) => {
    encodeBuffer: (left: Int16Array) => Int8Array | Uint8Array;
    flush: () => Int8Array | Uint8Array;
  };
};

declare global {
  interface Window {
    lamejs?: LameJsGlobal;
    __mwLamePromise?: Promise<LameJsGlobal>;
  }
}

const LAME_CDN = "https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js";

export type ExportFormat = "wav" | "mp3";

export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;

  const samples = buffer.length;
  const blockAlign = (numChannels * bitDepth) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples * blockAlign;

  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  let offset = 0;
  function writeString(value: string) {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
    offset += value.length;
  }

  writeString("RIFF");
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, format, true);
  offset += 2;
  view.setUint16(offset, numChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, byteRate, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, bitDepth, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, dataSize, true);
  offset += 4;

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let idx = 0;
  for (let i = 0; i < samples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = clamp(channels[c][i], -1, 1);
      const s = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(headerSize + idx, s, true);
      idx += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

export async function audioBufferToMp3Blob(
  buffer: AudioBuffer,
  kbps = 128,
): Promise<Blob> {
  if (typeof window === "undefined") {
    throw new Error("MP3 export is only available in the browser.");
  }

  const lamejs = await loadLameJs();
  const sampleRate = buffer.sampleRate;
  const encoder = new lamejs.Mp3Encoder(1, sampleRate, clampInt(kbps, 32, 320));
  const mono = mixToMono(buffer);
  const samples = floatTo16BitPcm(mono);
  const chunkSize = 1152;
  const parts: Uint8Array[] = [];

  for (let i = 0; i < samples.length; i += chunkSize) {
    const chunk = samples.subarray(i, i + chunkSize);
    const encoded = encoder.encodeBuffer(chunk);
    if (encoded.length > 0) parts.push(toUint8Array(encoded));
  }

  const flushed = encoder.flush();
  if (flushed.length > 0) parts.push(toUint8Array(flushed));

  return new Blob(parts.map((part) => part.slice()), { type: "audio/mpeg" });
}

function loadLameJs(): Promise<LameJsGlobal> {
  if (window.lamejs?.Mp3Encoder) return Promise.resolve(window.lamejs);
  if (window.__mwLamePromise) return window.__mwLamePromise;

  window.__mwLamePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-mw-lame="true"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => {
        if (window.lamejs?.Mp3Encoder) resolve(window.lamejs);
        else reject(new Error("MP3 encoder loaded, but was not available."));
      });
      existing.addEventListener("error", () => {
        reject(new Error("Could not load the MP3 encoder."));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = LAME_CDN;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.mwLame = "true";

    script.onload = () => {
      if (window.lamejs?.Mp3Encoder) resolve(window.lamejs);
      else reject(new Error("MP3 encoder loaded, but was not available."));
    };
    script.onerror = () => reject(new Error("Could not load the MP3 encoder."));

    document.head.appendChild(script);
  });

  return window.__mwLamePromise;
}

function mixToMono(buffer: AudioBuffer) {
  const output = new Float32Array(buffer.length);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const channel = buffer.getChannelData(c);
    for (let i = 0; i < channel.length; i++) {
      output[i] += channel[i] / buffer.numberOfChannels;
    }
  }
  return output;
}

function floatTo16BitPcm(input: Float32Array) {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const sample = clamp(input[i], -1, 1);
    output[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
}

function toUint8Array(input: Int8Array | Uint8Array) {
  return input instanceof Uint8Array
    ? input
    : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function clampInt(n: number, min: number, max: number) {
  return Math.round(clamp(n, min, max));
}
