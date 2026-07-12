import { expect, test } from "@playwright/test";

import {
  buildMorseExportPlan,
  buildMorsePartFilename,
  sanitizeExportBaseFilename,
} from "../../app/client/components/shared/export/morseExportPlan";
import {
  createMorsePcmChunkRenderer,
  encodeMorsePcmAsMp3,
  renderMorseAudioBlob,
  renderMorsePcmAsWav,
} from "../../app/client/components/shared/export/morseAudioExport";
import {
  aggregateExportProgress,
  normalizeExportError,
  runSequentialExport,
  summarizeCompletedPartFiles,
} from "../../app/client/components/shared/export/sequentialExport";
import { buildMorseTimeline } from "../../app/client/components/shared/morseTiming";
import { textToMorse } from "../../app/client/components/shared/morseUtils";
import {
  buildMorseVideoTimelineFromMorse,
  getMorseVideoCanonicalFrameState,
} from "../../app/client/components/shared/video/morseVideoRenderer";
import {
  DEFAULT_BOOK_EXPORT_SETTINGS,
  sanitizeBookExportSettings,
} from "../../app/client/components/morse-code-book-translator/bookExportPresets";
import {
  audioMaxPartMs,
  buildBookExportPlan,
} from "../../app/client/components/morse-code-book-translator/bookExportPlan";
import { createBookAudioPartDownloads } from "../../app/client/components/morse-code-book-translator/bookBundleExport";

const audioSettings = {
  charWpm: 18,
  farnsworthWpm: 12,
  pitch: 650,
  sampleRate: 22_050,
  tailPaddingMs: 120,
  tonePreset: "cw_radio" as const,
  volume: 0.75,
};

test.describe("canonical long-form export pipeline", () => {
  test("canonical timing drives preview, duration, and export boundaries", () => {
    const morse = "... --- ... / .... . .-.. .--.";
    const timeline = buildMorseTimeline(morse, {
      charWpm: 18,
      farnsworthWpm: 12,
      tailPaddingMs: 160,
    });
    const video = buildMorseVideoTimelineFromMorse(
      morse,
      { ...audioSettings, tailPaddingMs: 160 },
      "SOS HELP",
    );

    expect(video.durationMs).toBe(timeline.durationMs);
    expect(video.events).toEqual(
      timeline.events.map((event) => ({
        type: event.type,
        startMs: event.startMs,
        endMs: event.endMs,
        symbol: event.type === "mark" ? event.symbol : undefined,
      })),
    );
    for (const [index, event] of timeline.events.entries()) {
      expect(event.startMs).toBe(index === 0 ? 0 : timeline.events[index - 1].endMs);
      expect(event.endMs - event.startMs).toBeCloseTo(event.ms, 8);
    }
    const firstMark = video.events.find((event) => event.type === "mark")!;
    expect(
      getMorseVideoCanonicalFrameState(video, firstMark.startMs + 1).bulbActive,
    ).toBe(true);
  });

  test("short input remains one file and long input becomes deterministic parts", () => {
    const shortPlan = buildMorseExportPlan({
      baseFilename: "hello",
      charWpm: 18,
      farnsworthWpm: 12,
      format: "wav",
      kind: "audio",
      sampleRate: 44_100,
      source: "HELLO WORLD",
      sourceMode: "text",
      tailPaddingMs: 120,
    });
    expect(shortPlan.parts).toHaveLength(1);
    expect(shortPlan.parts[0].filename).toBe("hello.wav");

    const morseVideoPlan = buildMorseExportPlan({
      baseFilename: "sos",
      charWpm: 18,
      format: "webm",
      kind: "video",
      source: "... --- ...",
      sourceMode: "morse",
    });
    expect(morseVideoPlan.parts[0].text).toBe("SOS");

    const source = `${"ALPHA BRAVO CHARLIE. ".repeat(30)}\n\n${"SOS HELP. ".repeat(30)}`;
    const threshold = {
      targetDurationMs: 30_000,
      maxDurationMs: 45_000,
      maxEstimatedBytes: 8 * 1024 * 1024,
    };
    const longPlan = buildMorseExportPlan({
      baseFilename: "Long lesson",
      charWpm: 18,
      farnsworthWpm: 12,
      format: "webm",
      kind: "video",
      source,
      sourceMode: "text",
      tailPaddingMs: 160,
      threshold,
    });
    expect(longPlan.parts.length).toBeGreaterThan(1);
    expect(
      longPlan.parts.every(
        (part) => part.durationMs <= threshold.maxDurationMs,
      ),
    ).toBe(true);
    expect(
      longPlan.parts.every(
        (part) =>
          part.morse.length > 0 &&
          part.estimatedBytes <= threshold.maxEstimatedBytes,
      ),
    ).toBe(true);
    expect(longPlan.parts.map((part) => part.index)).toEqual(
      Array.from({ length: longPlan.parts.length }, (_, index) => index + 1),
    );
    expect(
      longPlan.parts.map((part) => source.slice(part.sourceStart, part.sourceEnd)).join(""),
    ).toBe(source);
    expect(new Set(longPlan.parts.map((part) => part.filename)).size).toBe(
      longPlan.parts.length,
    );
    const fullMarks = buildMorseTimeline(textToMorse(source), {
      charWpm: 18,
      farnsworthWpm: 12,
    }).events
      .filter((event) => event.type === "mark")
      .map((event) => event.symbol)
      .join("");
    const partMarks = longPlan.parts
      .flatMap((part) => part.timeline.events)
      .filter((event) => event.type === "mark")
      .map((event) => event.symbol)
      .join("");
    expect(partMarks).toBe(fullMarks);
    for (const part of longPlan.parts) {
      part.timeline.events.forEach((event, index) => {
        expect(event.startMs).toBe(
          index === 0 ? 0 : part.timeline.events[index - 1].endMs,
        );
      });
    }
  });

  test("paragraph, sentence, word, and oversized-unit fallbacks preserve coverage", () => {
    const source = `FIRST PARAGRAPH HAS WORDS. SECOND SENTENCE HAS MORE WORDS.\n\n${"SUPERCALIFRAGILISTIC ".repeat(20)}`;
    const plan = buildMorseExportPlan({
      baseFilename: "fallbacks",
      charWpm: 18,
      farnsworthWpm: 12,
      format: "wav",
      kind: "audio",
      sampleRate: 22_050,
      source,
      sourceMode: "text",
      threshold: {
        targetDurationMs: 4_000,
        maxDurationMs: 7_000,
        maxEstimatedBytes: 2 * 1024 * 1024,
      },
    });
    expect(plan.parts.length).toBeGreaterThan(3);
    expect(plan.parts[0].sourceStart).toBe(0);
    expect(plan.parts.at(-1)?.sourceEnd).toBe(source.length);
    plan.parts.slice(1).forEach((part, index) => {
      expect(part.sourceStart).toBe(plan.parts[index].sourceEnd);
    });
  });

  test("book plans prefer source sections and split an oversized chapter", () => {
    const chapterOne = "SOS HELP. ".repeat(200);
    const chapterTwo = "ALPHA BRAVO. ".repeat(20);
    const cleanedText = `${chapterOne}\n\n${chapterTwo}`;
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      charWpm: 5,
      farnsworthWpm: 5,
      splitMode: "duration",
      targetPartMinutes: 15,
      preferSourceSections: true,
    });
    const plan = buildBookExportPlan({
      cleanedText,
      outputType: "audio",
      settings,
      sourceTitle: "Training Book",
      sourceSections: [
        {
          id: "chapter-1",
          kind: "chapter",
          title: "Chapter 1",
          sourceLabel: "Chapter 1",
          rawText: chapterOne,
          startOffset: 0,
          endOffset: chapterOne.length,
        },
        {
          id: "chapter-2",
          kind: "chapter",
          title: "Chapter 2",
          sourceLabel: "Chapter 2",
          rawText: chapterTwo,
          startOffset: chapterOne.length + 2,
          endOffset: cleanedText.length,
        },
      ],
    });
    expect(plan.parts.length).toBeGreaterThan(2);
    expect(plan.parts.some((part) => /chapter-1/i.test(part.estimatedFilename))).toBe(true);
    expect(plan.parts.at(-1)?.title).toContain("Chapter 2");
    expect(plan.parts.every((part) => part.cleanedText.length > 0)).toBe(true);
    expect(new Set(plan.parts.map((part) => part.estimatedFilename)).size).toBe(
      plan.parts.length,
    );
    expect(
      plan.parts
        .map((part) => cleanedText.slice(part.sourceStart, part.sourceEnd))
        .join(""),
    ).toBe(cleanedText);
    expect(
      plan.parts.every(
        (part) =>
          part.morseDurationMs + settings.tailPaddingMs <= plan.maxPartMs,
      ),
    ).toBe(true);

    const duplicateChapter = "ALPHA BRAVO. ".repeat(40);
    const duplicateSettings = sanitizeBookExportSettings({
      ...settings,
      splitMode: "duration",
      targetPartMinutes: 15,
    });
    const duplicateNames = buildBookExportPlan({
      cleanedText: `${duplicateChapter}\n\n${duplicateChapter}`,
      outputType: "audio",
      settings: duplicateSettings,
      sourceTitle: "Repeated chapters",
      sourceSections: [
        {
          id: "first",
          kind: "chapter",
          title: "Chapter",
          sourceLabel: "Chapter",
          rawText: duplicateChapter,
          startOffset: 0,
          endOffset: duplicateChapter.length,
        },
        {
          id: "second",
          kind: "chapter",
          title: "Chapter",
          sourceLabel: "Chapter",
          rawText: duplicateChapter,
          startOffset: duplicateChapter.length + 2,
          endOffset: duplicateChapter.length * 2 + 2,
        },
      ],
    });
    expect(duplicateNames.parts.length).toBeGreaterThan(1);
    expect(
      new Set(duplicateNames.parts.map((part) => part.estimatedFilename)).size,
    ).toBe(duplicateNames.parts.length);
    expect(duplicateNames.parts.map((part) => part.index)).toEqual(
      Array.from({ length: duplicateNames.parts.length }, (_, index) => index + 1),
    );
    expect(
      duplicateNames.parts
        .map((part) =>
          `${duplicateChapter}\n\n${duplicateChapter}`.slice(
            part.sourceStart,
            part.sourceEnd,
          ),
        )
        .join(""),
    ).toBe(`${duplicateChapter}\n\n${duplicateChapter}`);
  });

  test("book hard splitting keeps uneven text below the ceiling without losing source", () => {
    const source = `${"E".repeat(1_000)}${"0".repeat(1_000)}`;
    const settings = sanitizeBookExportSettings({
      ...DEFAULT_BOOK_EXPORT_SETTINGS,
      charWpm: 5,
      farnsworthWpm: 5,
      splitMode: "duration",
      targetPartMinutes: 15,
    });
    const plan = buildBookExportPlan({
      cleanedText: source,
      outputType: "audio",
      settings,
      sourceTitle: "Uneven timing",
    });
    const maxPartMs = audioMaxPartMs(settings);

    expect(plan.parts.length).toBeGreaterThan(1);
    expect(plan.unresolvedOversizedPart).toBeNull();
    expect(plan.parts.every((part) => part.cleanedText.length > 0)).toBe(true);
    expect(
      plan.parts.every(
        (part) =>
          part.morseDurationMs + settings.tailPaddingMs <= maxPartMs,
      ),
    ).toBe(true);
    expect(
      plan.parts
        .map((part) => source.slice(part.sourceStart, part.sourceEnd))
        .join(""),
    ).toBe(source);
  });

  test("book multipart cancellation remains an AbortError and requests no later part", async () => {
    const settings = sanitizeBookExportSettings(DEFAULT_BOOK_EXPORT_SETTINGS);
    const plan = buildBookExportPlan({
      cleanedText: "SOS HELP",
      outputType: "audio",
      settings,
      sourceTitle: "Cancel test",
    });
    const controller = new AbortController();
    let readyCount = 0;

    await expect(
      createBookAudioPartDownloads({
        metadata: { sourceType: "pasted", title: "Cancel test" },
        parts: plan.parts,
        settings,
        signal: controller.signal,
        onProgress: (progress) => {
          if (progress.phase === "encoding") controller.abort();
        },
        onPartReady: () => {
          readyCount += 1;
        },
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(readyCount).toBe(0);
  });

  test("filenames are safe and part numbering is stable", () => {
    expect(sanitizeExportBaseFilename('  My: "Morse" / Lesson  ')).toBe(
      "My-Morse-Lesson",
    );
    expect(
      buildMorsePartFilename({
        baseFilename: "lesson",
        format: "mp3",
        index: 2,
        totalParts: 12,
      }),
    ).toBe("lesson-part-02-of-12.mp3");
  });

  test("parts generate sequentially, release references, cancel, and resume without duplicates", async () => {
    const parts = [1, 2, 3].map((index) => ({
      durationMs: 100,
      filename: `part-${index}.wav`,
      index,
    }));
    let active = 0;
    let peakActive = 0;
    const finalized: number[] = [];
    const controller = new AbortController();
    await expect(
      runSequentialExport({
        parts,
        signal: controller.signal,
        generatePart: async (part, _signal, onProgress) => {
          active += 1;
          peakActive = Math.max(peakActive, active);
          onProgress(1, "encoding");
          active -= 1;
          return new Blob([String(part.index)]);
        },
        finalizePart: (part) => {
          finalized.push(part.index);
          if (part.index === 1) controller.abort();
        },
      }),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(peakActive).toBe(1);
    expect(finalized).toEqual([1]);

    const resumed: number[] = [];
    const result = await runSequentialExport({
      completedPartIndexes: [1],
      parts,
      signal: new AbortController().signal,
      generatePart: async (part) => new Blob([String(part.index)]),
      finalizePart: (part) => resumed.push(part.index),
    });
    expect(resumed).toEqual([2, 3]);
    expect(result.completedPartIndexes).toEqual([1, 2, 3]);
  });

  test("progress reaches 100 percent only after the final request is finalized", async () => {
    const events: Array<{ finalized: boolean; progress: number; stage: string }> = [];
    let finalized = false;
    await runSequentialExport({
      parts: [{ durationMs: 100, filename: "part.wav", index: 1 }],
      signal: new AbortController().signal,
      generatePart: async (_part, _signal, onProgress) => {
        onProgress(1, "encoding");
        return new Blob(["audio"]);
      },
      finalizePart: () => {
        expect(events.every((event) => event.progress < 1)).toBe(true);
        finalized = true;
      },
      onProgress: (progress) => {
        events.push({
          finalized,
          progress: progress.overallProgress,
          stage: progress.stage,
        });
      },
    });
    expect(events.at(-1)).toMatchObject({
      finalized: true,
      progress: 1,
      stage: "complete",
    });
  });

  test("retry accounting keeps earlier filenames and bytes without duplicates", () => {
    const completed = new Map([
      [1, { bytes: 120, filename: "lesson-part-01-of-03.mp3" }],
    ]);
    expect(summarizeCompletedPartFiles(completed)).toEqual({
      filenames: ["lesson-part-01-of-03.mp3"],
      indexes: [1],
      totalBytes: 120,
    });

    completed.set(3, { bytes: 360, filename: "lesson-part-03-of-03.mp3" });
    completed.set(2, { bytes: 240, filename: "lesson-part-02-of-03.mp3" });
    completed.set(2, { bytes: 240, filename: "lesson-part-02-of-03.mp3" });
    expect(summarizeCompletedPartFiles(completed)).toEqual({
      filenames: [
        "lesson-part-01-of-03.mp3",
        "lesson-part-02-of-03.mp3",
        "lesson-part-03-of-03.mp3",
      ],
      indexes: [1, 2, 3],
      totalBytes: 720,
    });
  });

  test("progress aggregation and errors stay safe", () => {
    expect(
      aggregateExportProgress({
        completedDurationMs: 1_000,
        currentPartDurationMs: 2_000,
        partProgress: 0.5,
        totalDurationMs: 4_000,
      }),
    ).toBe(0.5);
    expect(normalizeExportError(new Error("Invalid typed array length"), "audio export"))
      .not.toContain("typed array");
  });

  test("real short WAV and MP3 renders are non-empty and use the planned duration", async () => {
    const controller = new AbortController();
    const wav = await renderMorseAudioBlob({
      morse: "... --- ...",
      settings: { ...audioSettings, format: "wav" },
      signal: controller.signal,
    });
    const mp3 = await renderMorseAudioBlob({
      morse: "... --- ...",
      settings: { ...audioSettings, format: "mp3", mp3Kbps: 128 },
      signal: controller.signal,
    });
    expect(wav.type).toBe("audio/wav");
    expect(wav.size).toBeGreaterThan(44);
    expect(mp3.type).toBe("audio/mpeg");
    expect(mp3.size).toBeGreaterThan(100);
  });

  test("WAV headers include the final partial PCM chunk and first and last marks", async () => {
    const renderer = createMorsePcmChunkRenderer(". -", {
      ...audioSettings,
      sampleRate: 8_000,
    });
    expect(renderer.totalSamples % 4_096).not.toBe(0);
    const wav = await renderMorsePcmAsWav(
      renderer,
      new AbortController().signal,
    );
    const bytes = await wav.arrayBuffer();
    const view = new DataView(bytes);
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe("RIFF");
    expect(new TextDecoder().decode(bytes.slice(8, 12))).toBe("WAVE");
    expect(view.getUint32(4, true)).toBe(bytes.byteLength - 8);
    expect(view.getUint32(40, true)).toBe(bytes.byteLength - 44);
    expect(bytes.byteLength).toBe(44 + renderer.totalSamples * 2);

    const marks = renderer.timeline.events.filter((event) => event.type === "mark");
    expect(marks.map((event) => event.symbol)).toEqual([".", "-"]);
    const pcm = new Int16Array(bytes.slice(44));
    for (const mark of [marks[0], marks.at(-1)!]) {
      const start = Math.round((mark.startMs / 1_000) * renderer.sampleRate);
      const end = Math.round((mark.endMs / 1_000) * renderer.sampleRate);
      const peak = pcm
        .slice(start, end)
        .reduce((highest, sample) => Math.max(highest, Math.abs(sample)), 0);
      expect(peak).toBeGreaterThan(0);
    }
  });

  test("MP3 encodes the final partial block, flushes, and creates one encoder", async () => {
    const renderer = createMorsePcmChunkRenderer("... --- ...", {
      ...audioSettings,
      sampleRate: 8_000,
    });
    expect(renderer.totalSamples % 1_152).not.toBe(0);
    const encodedBlockSizes: number[] = [];
    let encoderCount = 0;
    let flushCount = 0;
    const mp3 = await encodeMorsePcmAsMp3({
      renderer,
      settings: { ...audioSettings, format: "mp3", sampleRate: 8_000 },
      signal: new AbortController().signal,
      createEncoder: () => {
        encoderCount += 1;
        return {
          encodeBuffer: (pcm) => {
            encodedBlockSizes.push(pcm.length);
            return new Uint8Array([pcm.length % 251]);
          },
          flush: () => {
            flushCount += 1;
            return new Uint8Array([0xfa, 0xfb]);
          },
        };
      },
    });
    expect(encoderCount).toBe(1);
    expect(flushCount).toBe(1);
    expect(encodedBlockSizes.at(-1)).toBe(renderer.totalSamples % 1_152);
    expect([...new Uint8Array(await mp3.arrayBuffer()).slice(-2)]).toEqual([
      0xfa,
      0xfb,
    ]);
  });
});
