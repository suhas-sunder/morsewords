type LameModule = typeof import("@breezystack/lamejs");

let lameModulePromise: Promise<LameModule> | null = null;

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
  for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
    channels.push(buffer.getChannelData(channelIndex));
  }

  let dataOffset = 0;
  for (let sampleIndex = 0; sampleIndex < samples; sampleIndex++) {
    for (let channelIndex = 0; channelIndex < numChannels; channelIndex++) {
      const sample = clamp(channels[channelIndex][sampleIndex], -1, 1);
      const pcm = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(headerSize + dataOffset, pcm, true);
      dataOffset += 2;
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

  for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += chunkSize) {
    const chunk = samples.subarray(sampleIndex, sampleIndex + chunkSize);
    const encoded = encoder.encodeBuffer(chunk);
    if (encoded.length > 0) {
      parts.push(toUint8Array(encoded));
    }
  }

  const flushed = encoder.flush();
  if (flushed.length > 0) {
    parts.push(toUint8Array(flushed));
  }

  return new Blob(parts.map((part) => part.slice()), { type: "audio/mpeg" });
}

function loadLameJs(): Promise<LameModule> {
  if (!lameModulePromise) {
    lameModulePromise = import("@breezystack/lamejs");
  }

  return lameModulePromise;
}

function mixToMono(buffer: AudioBuffer) {
  const output = new Float32Array(buffer.length);
  for (let channelIndex = 0; channelIndex < buffer.numberOfChannels; channelIndex++) {
    const channel = buffer.getChannelData(channelIndex);
    for (let sampleIndex = 0; sampleIndex < channel.length; sampleIndex++) {
      output[sampleIndex] += channel[sampleIndex] / buffer.numberOfChannels;
    }
  }
  return output;
}

function floatTo16BitPcm(input: Float32Array) {
  const output = new Int16Array(input.length);
  for (let sampleIndex = 0; sampleIndex < input.length; sampleIndex++) {
    const sample = clamp(input[sampleIndex], -1, 1);
    output[sampleIndex] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
}

function toUint8Array(input: Int8Array | Uint8Array) {
  return input instanceof Uint8Array
    ? input
    : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampInt(value: number, min: number, max: number) {
  return Math.round(clamp(value, min, max));
}
