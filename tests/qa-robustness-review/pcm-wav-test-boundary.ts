import type { Page } from "@playwright/test";

// Windows WebKit has no native AudioContext. This adapts PCM WAV decoding only;
// rendering, real samples, detector math and application behavior remain unchanged.
// It is not evidence of native WebKit audio support.
export async function installAbsentPcmWavDecoder(page: Page) {
  await page.addInitScript(() => {
    if (typeof AudioContext !== "undefined") return;
    class PcmWavContext {
      decodeAudioData(buffer: ArrayBuffer) {
        const view = new DataView(buffer);
        if (view.getUint16(20, true) !== 1 || view.getUint16(34, true) !== 16) return Promise.reject(new Error("PCM WAV only"));
        const sampleRate = view.getUint32(24, true), channels = view.getUint16(22, true);
        const length = view.getUint32(40, true) / (2 * channels);
        const data = Array.from({ length: channels }, (_, channel) => Float32Array.from({ length }, (_, i) => view.getInt16(44 + (i * channels + channel) * 2, true) / 32768));
        return Promise.resolve({ length, sampleRate, numberOfChannels: channels, duration: length / sampleRate, getChannelData: (n: number) => data[n] });
      }
      close() { return Promise.resolve(); }
    }
    Object.defineProperty(window, "AudioContext", { value: PcmWavContext, configurable: true, writable: true });
  });
}
