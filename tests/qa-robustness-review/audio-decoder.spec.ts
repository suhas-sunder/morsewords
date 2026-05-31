import { expect, test, type Page } from "@playwright/test";

import {
  analyzeSamplesToMorse,
  AUDIO_DECODER_LIMITS,
  classifySilenceGap,
  classifyToneDuration,
  mixAudioBufferToMono,
  validateAudioDecoderFile,
  validateDecodedAudioBuffer,
} from "../../app/client/components/morse-code-audio-decoder/audioDecodeUtils";
import {
  AUDIO_DECODER_ALIAS_PATHS,
  blockExternalNetwork,
  waitForRouteReady,
} from "./helpers";

const SITE_URL = "https://www.morsewords.com";
const CANONICAL_PATH = "/morse-code-audio-decoder";
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;
function syntheticMorseSamples({
  morse,
  sampleRate = 8_000,
  toneHz = 600,
  unitMs = 70,
}: {
  morse: string;
  sampleRate?: number;
  toneHz?: number;
  unitMs?: number;
}) {
  const samples: number[] = [];
  const pushTone = (units: number) => {
    const frameCount = Math.round((unitMs * units * sampleRate) / 1_000);
    for (let i = 0; i < frameCount; i += 1) {
      samples.push(Math.sin((2 * Math.PI * toneHz * i) / sampleRate) * 0.75);
    }
  };
  const pushSilence = (units: number) => {
    const frameCount = Math.round((unitMs * units * sampleRate) / 1_000);
    for (let i = 0; i < frameCount; i += 1) samples.push(0);
  };

  const words = morse.trim().split(/\s*\/\s*/);
  words.forEach((word, wordIndex) => {
    const letters = word.trim().split(/\s+/);
    letters.forEach((letter, letterIndex) => {
      [...letter].forEach((symbol, symbolIndex) => {
        pushTone(symbol === "-" ? 3 : 1);
        if (symbolIndex < letter.length - 1) pushSilence(1);
      });
      if (letterIndex < letters.length - 1) pushSilence(3);
    });
    if (wordIndex < words.length - 1) pushSilence(7);
  });

  return Float32Array.from(samples);
}

function syntheticTimedMorseSamples({
  dashMs = 224,
  letterGapMs = 1_008,
  morse,
  sampleRate = 11_050,
  symbolGapMs = 88,
  toneHz = 1_000,
  dotMs = 64,
  wordGapMs = 2_928,
}: {
  dashMs?: number;
  dotMs?: number;
  letterGapMs?: number;
  morse: string;
  sampleRate?: number;
  symbolGapMs?: number;
  toneHz?: number;
  wordGapMs?: number;
}) {
  const samples: number[] = [];
  const pushTone = (durationMs: number) => {
    const frameCount = Math.round((durationMs * sampleRate) / 1_000);
    for (let i = 0; i < frameCount; i += 1) {
      samples.push(Math.sin((2 * Math.PI * toneHz * i) / sampleRate) * 0.75);
    }
  };
  const pushSilence = (durationMs: number) => {
    const frameCount = Math.round((durationMs * sampleRate) / 1_000);
    for (let i = 0; i < frameCount; i += 1) samples.push(0);
  };

  const words = morse.trim().split(/\s*\/\s*/);
  words.forEach((word, wordIndex) => {
    const letters = word.trim().split(/\s+/);
    letters.forEach((letter, letterIndex) => {
      [...letter].forEach((symbol, symbolIndex) => {
        pushTone(symbol === "-" ? dashMs : dotMs);
        if (symbolIndex < letter.length - 1) pushSilence(symbolGapMs);
      });
      if (letterIndex < letters.length - 1) pushSilence(letterGapMs);
    });
    if (wordIndex < words.length - 1) pushSilence(wordGapMs);
  });

  return Float32Array.from(samples);
}

function fakeAudioBuffer(channels: Float32Array[], sampleRate = 8_000) {
  const length = channels[0]?.length ?? 0;

  return {
    duration: sampleRate > 0 ? length / sampleRate : 0,
    getChannelData: (index: number) => channels[index] ?? new Float32Array(length),
    length,
    numberOfChannels: channels.length,
    sampleRate,
  } as AudioBuffer;
}

function addDeterministicNoise(samples: Float32Array, amplitude = 0.045) {
  let seed = 2_026_053;

  return Float32Array.from(samples, (sample) => {
    seed = (seed * 1_664_525 + 1_013_904_223) >>> 0;
    const noise = (seed / 0xffffffff) * 2 - 1;
    return Math.max(-1, Math.min(1, sample + noise * amplitude));
  });
}

function tinyClickSamples(sampleRate = 8_000) {
  const samples = new Float32Array(sampleRate);
  for (let index = 0; index < samples.length; index += 400) {
    samples[index] = 1;
  }
  return samples;
}

function wavFromSamples(samples: Float32Array, sampleRate = 8_000) {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const buffer = Buffer.alloc(44 + samples.length * bytesPerSample);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * bytesPerSample, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * bytesPerSample, 40);

  samples.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + index * bytesPerSample);
  });

  return buffer;
}

async function openAudioDecoder(page: Page) {
  await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toHaveText("Morse Code Audio Decoder");
  await waitForRouteReady(page);
}

async function installDelayedAudioContextStub(page: Page) {
  await page.addInitScript(() => {
    const decodeSettledState = { count: 0 };
    Object.defineProperty(window, "__mwAudioDecodeSettled", {
      value: decodeSettledState,
      configurable: true,
    });

    const makeMorseSamples = (morse: string, sampleRate = 8_000) => {
      const samples: number[] = [];
      const pushTone = (units: number) => {
        const frameCount = Math.round((70 * units * sampleRate) / 1_000);
        for (let i = 0; i < frameCount; i += 1) {
          samples.push(Math.sin((2 * Math.PI * 600 * i) / sampleRate) * 0.75);
        }
      };
      const pushSilence = (units: number) => {
        const frameCount = Math.round((70 * units * sampleRate) / 1_000);
        for (let i = 0; i < frameCount; i += 1) samples.push(0);
      };

      morse
        .trim()
        .split(/\s+/)
        .forEach((letter, letterIndex, letters) => {
          [...letter].forEach((symbol, symbolIndex) => {
            pushTone(symbol === "-" ? 3 : 1);
            if (symbolIndex < letter.length - 1) pushSilence(1);
          });
          if (letterIndex < letters.length - 1) pushSilence(3);
        });

      return Float32Array.from(samples);
    };

    let decodeCall = 0;
    class FakeAudioContext {
      decodeAudioData(
        _arrayBuffer: ArrayBuffer,
        successCallback?: (audioBuffer: AudioBuffer) => void,
      ) {
        decodeCall += 1;
        const samples = makeMorseSamples(decodeCall === 1 ? "--- .-.. -.." : "-. . .--");
        const buffer = {
          duration: samples.length / 8_000,
          getChannelData: () => samples,
          length: samples.length,
          numberOfChannels: 1,
          sampleRate: 8_000,
        } as AudioBuffer;
        const delayMs = decodeCall === 1 ? 250 : 10;

        return new Promise<AudioBuffer>((resolve) => {
          window.setTimeout(() => {
            successCallback?.(buffer);
            decodeSettledState.count += 1;
            resolve(buffer);
          }, delayMs);
        });
      }

      close() {
        return Promise.resolve();
      }
    }

    const audioWindow = window as Window &
      typeof globalThis & { webkitAudioContext?: typeof AudioContext };
    audioWindow.AudioContext = FakeAudioContext as unknown as typeof AudioContext;
    audioWindow.webkitAudioContext = FakeAudioContext as unknown as typeof AudioContext;
  });
}

test.describe("audio decoder utilities", () => {
  test("mixes one-channel audio without changing samples", () => {
    const channel = Float32Array.from([0, 0.5, -0.25, 1]);

    expect(Array.from(mixAudioBufferToMono(fakeAudioBuffer([channel])))).toEqual([
      0, 0.5, -0.25, 1,
    ]);
  });

  test("mixes two-channel audio into a safe mono average", () => {
    const left = Float32Array.from([1, 0.5, -0.5, -1]);
    const right = Float32Array.from([-1, 0.5, 0.5, 1]);

    expect(Array.from(mixAudioBufferToMono(fakeAudioBuffer([left, right])))).toEqual([
      0, 0.5, 0, 0,
    ]);
  });

  test("decodes clean synthetic Morse audio into raw Morse and readable text", () => {
    const samples = syntheticMorseSamples({
      morse: "... --- ... / .... . .-.. .--.",
    });

    const result = analyzeSamplesToMorse(samples, 8_000);

    expect(result.status).toBe("success");
    expect(result.rawMorse).toBe("... --- ... / .... . .-.. .--.");
    expect(result.decodedText).toBe("SOS HELP");
    expect(result.timing.toneCount).toBeGreaterThan(10);
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  test("decodes a noisy but reasonable SOS sample", () => {
    const samples = addDeterministicNoise(
      syntheticMorseSamples({ morse: "... --- ..." }),
    );

    const result = analyzeSamplesToMorse(samples, 8_000);

    expect(result.rawMorse).toBe("... --- ...");
    expect(result.decodedText).toBe("SOS");
    expect(result.status === "success" || result.status === "low-confidence").toBe(true);
  });

  test("classifies tone and silence durations against an estimated timing unit", () => {
    expect(classifyToneDuration(72, 70)).toBe(".");
    expect(classifyToneDuration(218, 70)).toBe("-");
    expect(classifySilenceGap(75, 70)).toBe("symbol");
    expect(classifySilenceGap(220, 70)).toBe("letter");
    expect(classifySilenceGap(505, 70)).toBe("word");
  });

  test("decodes fast character timing with wide Farnsworth-style gaps", () => {
    const samples = syntheticTimedMorseSamples({
      morse: "... --- ... / .. -. ... - .-. ..- -.-. - .. --- -. ...",
    });

    const result = analyzeSamplesToMorse(samples, 11_050);

    expect(result.status).toBe("success");
    expect(result.rawMorse).toBe("... --- ... / .. -. ... - .-. ..- -.-. - .. --- -. ...");
    expect(result.decodedText).toBe("SOS INSTRUCTIONS");
    expect(result.timing.estimatedUnitMs).toBeGreaterThanOrEqual(55);
    expect(result.timing.estimatedUnitMs).toBeLessThanOrEqual(85);
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  test("recovers readable spacing when punctuation audio omits an obvious word gap", () => {
    const samples = syntheticTimedMorseSamples({
      morse:
        ".. -. ... - .-. ..- -.-. - .. --- -. ... -..-. -. --- - . ... - .... .. ... / - --- --- .-..",
    });

    const result = analyzeSamplesToMorse(samples, 11_050);
    const exactResult = analyzeSamplesToMorse(samples, 11_050, {
      textSpacing: "exact",
    });

    expect(result.rawMorse).toBe(
      ".. -. ... - .-. ..- -.-. - .. --- -. ... -..-. -. --- - . ... - .... .. ... / - --- --- .-..",
    );
    expect(result.decodedText).toBe("INSTRUCTIONS/NOTES THIS TOOL");
    expect(exactResult.decodedText).toBe("INSTRUCTIONS/NOTESTHIS TOOL");
  });

  test("reports no-tone audio instead of guessing", () => {
    const result = analyzeSamplesToMorse(new Float32Array(8_000), 8_000);

    expect(result.status).toBe("no-tones");
    expect(result.rawMorse).toBe("");
    expect(result.decodedText).toBe("");
    expect(result.messages.join(" ")).toContain("No clear tone");
  });

  test("reports very short audio before analysis", () => {
    const result = analyzeSamplesToMorse(new Float32Array(800), 8_000);

    expect(result.status).toBe("too-short");
    expect(result.rawMorse).toBe("");
    expect(result.messages.join(" ")).toContain("too short");
  });

  test("ignores repeated tiny clicks instead of reading them as Morse", () => {
    const result = analyzeSamplesToMorse(tinyClickSamples(), 8_000);

    expect(result.status).toBe("no-tones");
    expect(result.rawMorse).toBe("");
    expect(result.decodedText).toBe("");
    expect(result.messages.join(" ")).toContain("filtering clicks and noise");
  });

  test("reports unknown Morse groups through the shared decoder utilities", () => {
    const result = analyzeSamplesToMorse(
      syntheticMorseSamples({ morse: "........" }),
      8_000,
    );

    expect(result.status).toBe("low-confidence");
    expect(result.rawMorse).toBe("........");
    expect(result.decodedText).toBe("?");
    expect(result.messages.join(" ")).toContain("1 Morse group could not be decoded");
  });

  test("validates upload size and decoded duration limits", () => {
    expect(
      validateAudioDecoderFile({
        name: "too-big.wav",
        size: AUDIO_DECODER_LIMITS.maxUploadBytes + 1,
        type: "audio/wav",
      }),
    ).toMatchObject({ ok: false, status: "too-large" });
    expect(
      validateAudioDecoderFile({
        name: "notes.txt",
        size: 12,
        type: "text/plain",
      }),
    ).toMatchObject({ ok: false, status: "unsupported-file" });
    expect(
      validateDecodedAudioBuffer({
        duration: AUDIO_DECODER_LIMITS.maxDecodedDurationSeconds + 0.1,
        length: 8_000,
        numberOfChannels: 1,
        sampleRate: 8_000,
      }),
    ).toMatchObject({ ok: false, status: "too-long" });
    expect(
      validateDecodedAudioBuffer({
        duration: AUDIO_DECODER_LIMITS.minUsefulDurationSeconds - 0.01,
        length: 1_900,
        numberOfChannels: 1,
        sampleRate: 8_000,
      }),
    ).toMatchObject({ ok: false, status: "too-short" });
  });
});

test.describe("Morse code audio decoder route", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test("renders a canonical upload-based decoder with labelled controls", async ({
    page,
  }) => {
    await openAudioDecoder(page);

    await expect(page.locator("h1")).toHaveText("Morse Code Audio Decoder");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      CANONICAL_URL,
    );
    await expect(page.getByTestId("audio-decoder-dropzone")).toBeVisible();
    await expect(page.getByText("Drop audio here")).toBeVisible();
    await expect(page.getByLabel("Choose Morse audio file")).toHaveAttribute(
      "type",
      "file",
    );
    await expect(page.getByRole("button", { name: "Choose audio file" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Decode audio" })).toBeVisible();
    await expect(page.getByText("No file selected")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Copy decoded text" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy raw Morse" })).toBeVisible();

    await page.getByRole("button", { name: /Advanced settings/ }).click();
    await expect(page.getByLabel("Gap style")).toBeVisible();
    await expect(page.getByLabel("Text cleanup")).toBeVisible();
    await expect(page.getByLabel("Sensitivity")).toBeVisible();
    await expect(page.getByLabel("Character speed")).toBeVisible();
    await expect(page.getByLabel("Word gap strictness")).toBeVisible();
    await expect(page.getByLabel("Minimum tone")).toBeVisible();
    await expect(page.getByLabel("Tone smoothing")).toBeVisible();
    await expect(page.getByLabel("Analysis window")).toBeVisible();
  });

  test("handles no file and unreadable upload states honestly", async ({ page }) => {
    await openAudioDecoder(page);

    await page.getByRole("button", { name: "Decode audio" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Choose an audio file before decoding.",
    );

    await page.getByLabel("Choose Morse audio file").setInputFiles({
      name: "not-audio.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("this is not audio"),
    });
    await page.getByRole("button", { name: "Decode audio" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "Choose a browser-supported audio file. WAV is safest; compressed formats depend on your browser.",
    );
  });

  test("rejects oversized and too-long files with safe messages", async ({ page }) => {
    await openAudioDecoder(page);

    await page.getByLabel("Choose Morse audio file").setInputFiles({
      name: "too-large.wav",
      mimeType: "audio/wav",
      buffer: Buffer.alloc(AUDIO_DECODER_LIMITS.maxUploadBytes + 1),
    });
    await expect(page.getByRole("alert")).toHaveText(
      "This file is too large to decode safely. Choose an audio file under 25 MB.",
    );

    const tooLongSamples = new Float32Array(
      (AUDIO_DECODER_LIMITS.maxDecodedDurationSeconds + 1) * 8_000,
    );
    await page.getByLabel("Choose Morse audio file").setInputFiles({
      name: "too-long.wav",
      mimeType: "audio/wav",
      buffer: wavFromSamples(tooLongSamples),
    });
    await page.getByRole("button", { name: "Decode audio" }).click();
    await expect(page.getByRole("alert")).toHaveText(
      "This audio is too long to decode safely. Keep files under 180 seconds.",
      { timeout: 20_000 },
    );
  });

  test("decodes a clean uploaded WAV into raw Morse and text", async ({ page }) => {
    await openAudioDecoder(page);
    const wav = wavFromSamples(
      syntheticMorseSamples({ morse: "... --- ... / .... . .-.. .--." }),
    );

    await page.getByLabel("Choose Morse audio file").setInputFiles({
      name: "sos-help.wav",
      mimeType: "audio/wav",
      buffer: wav,
    });
    await page.getByRole("button", { name: "Decode audio" }).click();

    await expect(page.getByLabel("Decoded text output")).toHaveText("SOS HELP");
    await expect(page.getByLabel("Raw Morse output")).toHaveText(
      "... --- ... / .... . .-.. .--.",
    );
    await expect(page.getByRole("link", { name: "Open in Morse decoder" })).toHaveAttribute(
      "href",
      "/morse-code-decoder?morse=...%20---%20...%20%2F%20....%20.%20.-..%20.--.",
    );
  });

  test("selecting a second file resets stale errors before decoding", async ({ page }) => {
    await openAudioDecoder(page);

    const fileInput = page.getByLabel("Choose Morse audio file");
    await expect(async () => {
      await fileInput.setInputFiles({
        name: "not-audio.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("this is not audio"),
      });
      await expect(page.getByRole("alert")).toHaveText(
        "Choose a browser-supported audio file. WAV is safest; compressed formats depend on your browser.",
        { timeout: 1_000 },
      );
    }).toPass({ timeout: 15_000 });

    await fileInput.setInputFiles({
      name: "sos.wav",
      mimeType: "audio/wav",
      buffer: wavFromSamples(syntheticMorseSamples({ morse: "... --- ..." })),
    });
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByLabel("Decoded text output")).toHaveText(
      "Decoded text will appear here.",
    );

    await page.getByRole("button", { name: "Decode audio" }).click();
    await expect(page.getByLabel("Decoded text output")).toHaveText("SOS");
  });

  test("ignores stale decode results when a newer upload is selected", async ({ page }) => {
    await installDelayedAudioContextStub(page);
    await openAudioDecoder(page);

    const decodeButton = page.getByRole("button", { name: "Decode audio" });

    await page.getByLabel("Choose Morse audio file").setInputFiles({
      name: "old.wav",
      mimeType: "audio/wav",
      buffer: Buffer.from("old"),
    });
    await decodeButton.click();

    await page.getByLabel("Choose Morse audio file").setInputFiles({
      name: "new.wav",
      mimeType: "audio/wav",
      buffer: Buffer.from("new"),
    });
    await expect(async () => {
      await expect(decodeButton).toBeEnabled({ timeout: 1_000 });
      await decodeButton.click();
      await expect(page.getByLabel("Decoded text output")).toHaveText("NEW", {
        timeout: 1_000,
      });
    }).toPass({ timeout: 15_000 });
    await page.waitForFunction(
      () =>
        ((window as typeof window & {
          __mwAudioDecodeSettled?: { count: number };
        }).__mwAudioDecodeSettled?.count ?? 0) >= 2,
    );
    await expect(page.getByLabel("Decoded text output")).toHaveText("NEW");
  });

  test("renders cleanly in persisted dark mode", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("morsewords-theme", "dark");
      document.documentElement.dataset.theme = "dark";
    });

    await openAudioDecoder(page);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.dataset.theme))
      .toBe("dark");
    await expect(page.locator("h1")).toHaveText("Morse Code Audio Decoder");
  });

  test("aliases redirect to canonical route and stay out of sitemap", async ({
    request,
  }) => {
    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    const sitemapXml = await sitemapResponse.text();
    expect(sitemapXml).toContain(CANONICAL_URL);

    for (const alias of AUDIO_DECODER_ALIAS_PATHS) {
      const response = await request.get(alias, { maxRedirects: 0 });
      expect(response.status(), `${alias} status`).toBe(301);
      expect(response.headers().location, `${alias} location`).toBe(CANONICAL_PATH);
      expect(sitemapXml, `sitemap excludes ${alias}`).not.toContain(`${SITE_URL}${alias}`);
      expect(await response.text(), `${alias} has no JSON-LD`).not.toContain(
        "application/ld+json",
      );
    }
  });
});
