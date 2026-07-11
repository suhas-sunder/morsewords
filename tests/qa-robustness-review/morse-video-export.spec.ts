import { expect, test } from "@playwright/test";

import { textToMorse } from "../../app/client/components/shared/morseUtils";
import {
  buildMorseVideoExportFramePlan,
  buildMorseVideoSceneSnapshot,
  buildMorseVideoTimelineFromMorse,
  getMorseVideoExportProfile,
  getMorseVideoFrameSize,
  getMorseVideoPreviewWordWindowLimit,
  getMorseVideoRecordingOptions,
  renderMorseVideoFrame,
} from "../../app/client/components/shared/video/morseVideoRenderer";
import { buildMorseExportPlan } from "../../app/client/components/shared/export/morseExportPlan";
import { DEFAULT_MORSE_VIDEO_SETTINGS } from "../../app/client/components/shared/video/morseVideoTypes";

const AUDIO_SETTINGS = {
  charWpm: 18,
  farnsworthWpm: 12,
  tailPaddingMs: 600,
};

function buildTimeline(text: string) {
  return buildMorseVideoTimelineFromMorse(
    textToMorse(text, { wordSeparator: "spaces" }),
    AUDIO_SETTINGS,
    text,
  );
}

function createRecordingCanvasContext() {
  const calls: Array<{
    args: Array<number | string>;
    fillStyle?: string;
    name: string;
  }> = [];
  const context = {
    fillStyle: "",
    font: "",
    globalAlpha: 1,
    imageSmoothingEnabled: false,
    imageSmoothingQuality: "low",
    lineWidth: 1,
    strokeStyle: "",
    textAlign: "left",
    textBaseline: "alphabetic",
    arc(...args: number[]) {
      calls.push({ args, fillStyle: context.fillStyle, name: "arc" });
    },
    beginPath() {
      calls.push({ args: [], name: "beginPath" });
    },
    clearRect(...args: number[]) {
      calls.push({ args, name: "clearRect" });
    },
    closePath() {
      calls.push({ args: [], name: "closePath" });
    },
    fill() {
      calls.push({ args: [], fillStyle: context.fillStyle, name: "fill" });
    },
    fillRect(...args: number[]) {
      calls.push({ args, fillStyle: context.fillStyle, name: "fillRect" });
    },
    fillText(text: string, ...args: number[]) {
      calls.push({ args: [text, ...args], fillStyle: context.fillStyle, name: "fillText" });
    },
    lineTo(...args: number[]) {
      calls.push({ args, name: "lineTo" });
    },
    measureText(text: string) {
      const size = Number.parseFloat(context.font) || 16;
      return { width: text.length * size * 0.58 } as TextMetrics;
    },
    moveTo(...args: number[]) {
      calls.push({ args, name: "moveTo" });
    },
    quadraticCurveTo(...args: number[]) {
      calls.push({ args, name: "quadraticCurveTo" });
    },
    restore() {
      calls.push({ args: [], name: "restore" });
    },
    save() {
      calls.push({ args: [], name: "save" });
    },
    scale(...args: number[]) {
      calls.push({ args, name: "scale" });
    },
    stroke() {
      calls.push({ args: [], name: "stroke" });
    },
    translate(...args: number[]) {
      calls.push({ args, name: "translate" });
    },
  };
  return {
    calls,
    ctx: context as unknown as CanvasRenderingContext2D,
  };
}

test.describe("Morse video export scene", () => {
  test("uses normalized export geometry at deterministic Morse states", () => {
    const settings = {
      ...DEFAULT_MORSE_VIDEO_SETTINGS,
      backgroundStyle: "warm-morsewords" as const,
      resolution: "1080p" as const,
      visualStyle: "lightbulb" as const,
    };
    const timeline = buildTimeline("SOS HELP");
    const firstDot = timeline.events.find(
      (event) => event.type === "mark" && event.symbol === ".",
    );
    const firstDash = timeline.events.find(
      (event) => event.type === "mark" && event.symbol === "-",
    );
    const nextWord = timeline.tokens.find((token) => token.wordIndex === 1);
    const lastFirstWordToken = timeline.tokens
      .filter((token) => token.wordIndex === 0)
      .at(-1);
    const wordGap = timeline.events.find(
      (event) =>
        event.type === "gap" &&
        event.startMs >= (lastFirstWordToken?.markEndMs ?? 0) &&
        event.endMs <= (nextWord?.startMs ?? 0),
    );
    const checkpoints = [
      0,
      (firstDot?.startMs ?? 0) + 1,
      (firstDash?.startMs ?? 0) + 1,
      (wordGap?.startMs ?? 0) + 1,
      (nextWord?.startMs ?? 0) + 1,
      Math.max(0, timeline.durationMs - 1),
    ];

    for (const elapsedMs of checkpoints) {
      const lowerResolutionScene = buildMorseVideoSceneSnapshot({
        elapsedMs,
        frame: getMorseVideoFrameSize("720p"),
        resolvedBackgroundStyle: "warm-morsewords",
        settings,
        timeline,
      });
      const exportScene = buildMorseVideoSceneSnapshot({
        elapsedMs,
        frame: getMorseVideoFrameSize(settings.resolution),
        resolvedBackgroundStyle: "warm-morsewords",
        settings,
        timeline,
      });

      expect(lowerResolutionScene).toEqual(exportScene);
      expect(exportScene.background).toEqual({
        color: expect.any(String),
        height: 1,
        width: 1,
        x: 0,
        y: 0,
      });
      expect(exportScene.signal.centerX).toBe(0.5);
      const activeTextRow = exportScene.text.words.some((word) => word.active);
      const expectedRowHeight = activeTextRow ? 49 : 45;
      const expectedSignalCenterY = activeTextRow ? 222 : 226;
      const expectedTextStartY = activeTextRow ? 322.5 : 324.5;
      expect(exportScene.layout).toMatchObject({
        maxTextWidth: Number((1008 / 1056).toFixed(6)),
        textLineGap: Number(((expectedRowHeight + 8) / 594).toFixed(6)),
        textStartY: Number((expectedTextStartY / 594).toFixed(6)),
      });
      expect(exportScene.signal.centerY).toBeCloseTo(
        expectedSignalCenterY / 594,
        5,
      );
      expect(exportScene.branding).toMatchObject({
        safeInset: Number((20 / 1056).toFixed(6)),
        x: Number((20 / 1056).toFixed(6)),
        y: Number((574 / 594).toFixed(6)),
      });
      expect(exportScene.text.morseSeparator).toBe("/");
    }

    const separatorScene = buildMorseVideoSceneSnapshot({
      elapsedMs: (wordGap?.startMs ?? 0) + 1,
      frame: getMorseVideoFrameSize(settings.resolution),
      resolvedBackgroundStyle: "warm-morsewords",
      settings,
      timeline,
    });
    expect(separatorScene.frameState.toneState).toBe("gap");
    expect(separatorScene.text.words.map((word) => word.text)).toContain("SOS");
    expect(separatorScene.text.words.map((word) => word.text)).toContain("HELP");

    const activePlan = buildMorseVideoExportFramePlan({
      elapsedMs: (firstDot?.startMs ?? 0) + 1,
      frame: getMorseVideoFrameSize(settings.resolution),
      settings,
      timeline,
    });
    expect(activePlan.activeHighlight).toEqual({ activeWord: true, roundedContainer: true });
    expect(activePlan.layout.wordWindowLimit).toBe(
      getMorseVideoPreviewWordWindowLimit({
        fullscreen: false,
        signalVisible: true,
        textLayerCount: 2,
      }),
    );
    expect(activePlan.frameState.morseWindow).toContain(" / ");
  });

  test("renders the protected inline composition into every 16:9 export frame", () => {
    const settings = {
      ...DEFAULT_MORSE_VIDEO_SETTINGS,
      backgroundStyle: "warm-morsewords" as const,
      resolution: "1080p" as const,
      showMorseSymbols: true,
      showPlainText: true,
      visualStyle: "lightbulb" as const,
    };
    const timeline = buildTimeline("E");
    const firstMark = timeline.events.find((event) => event.type === "mark");
    const frame = getMorseVideoFrameSize(settings.resolution);
    const { calls, ctx } = createRecordingCanvasContext();

    renderMorseVideoFrame({
      ctx,
      elapsedMs: (firstMark?.startMs ?? 0) + 1,
      frame,
      resolvedBackgroundStyle: "warm-morsewords",
      settings,
      timeline,
    });

    expect(calls).toContainEqual({
      args: [0, 0, 1056, 594],
      fillStyle: "#fffdf8",
      name: "fillRect",
    });
    expect(calls).toContainEqual({
      args: [1920 / 1056, 1920 / 1056],
      name: "scale",
    });
    expect(calls).toContainEqual({
      args: [468, 162],
      name: "translate",
    });
    expect(calls).toContainEqual({
      args: ["W", 20, 574],
      fillStyle: "#08324f",
      name: "fillText",
    });

  });

  test("scene wraps long input safely and every selectable resolution reaches its real frame size", () => {
    const settings = {
      ...DEFAULT_MORSE_VIDEO_SETTINGS,
      backgroundStyle: "dark-morsewords" as const,
    };
    const timeline = buildTimeline("ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA JULIET");
    const scene = buildMorseVideoSceneSnapshot({
      elapsedMs: timeline.tokens.at(-1)?.startMs ?? 0,
      frame: getMorseVideoFrameSize("720p"),
      resolvedBackgroundStyle: "dark-morsewords",
      settings,
      timeline,
    });
    expect(scene.text.words.length).toBeGreaterThan(1);
    expect(scene.text.words.map((word) => word.text).join(" ")).toContain("JULIET");
    expect(scene.layout.maxTextWidth).toBeLessThan(1);

    const expected = [
      ["720p", { width: 1280, height: 720 }, 5_000_000],
      ["1080p", { width: 1920, height: 1080 }, 9_000_000],
      ["1440p", { width: 2560, height: 1440 }, 16_000_000],
      ["4k", { width: 3840, height: 2160 }, 32_000_000],
    ] as const;
    let priorBitrate = 0;
    for (const [resolution, frame, bitrate] of expected) {
      expect(getMorseVideoFrameSize(resolution)).toEqual(frame);
      expect(getMorseVideoExportProfile(resolution).videoBitsPerSecond).toBe(bitrate);
      expect(bitrate).toBeGreaterThan(priorBitrate);
      priorBitrate = bitrate;
      expect(
        getMorseVideoRecordingOptions({
          frame,
          includeAudioTrack: true,
          mimeType: "video/webm;codecs=vp9,opus",
        }),
      ).toEqual({
        audioBitsPerSecond: 128_000,
        mimeType: "video/webm;codecs=vp9,opus",
        videoBitsPerSecond: bitrate,
      });
    }
  });

  test("advances the export-only visual window across wrapped Morse and English rows", () => {
    const source = Array.from({ length: 18 }, () => "SOS HELP").join(" ");
    const timeline = buildTimeline(source);
    const settings = {
      ...DEFAULT_MORSE_VIDEO_SETTINGS,
      backgroundStyle: "warm-morsewords" as const,
      resolution: "1080p" as const,
      showMorseSymbols: true,
      showPlainText: true,
      visualStyle: "lightbulb" as const,
    };
    const checkpointWords = [0, 3, 8, 16, 35];
    const checkpoints = checkpointWords.map((wordIndex) => {
      const token = timeline.tokens.find(
        (candidate) => candidate.wordIndex === wordIndex,
      );
      expect(token).toBeDefined();
      return token!;
    });
    const snapshots = checkpoints.map((token) =>
      buildMorseVideoSceneSnapshot({
        elapsedMs: token.startMs + 1,
        frame: getMorseVideoFrameSize("1080p"),
        resolvedBackgroundStyle: "warm-morsewords",
        settings,
        timeline,
      }),
    );

    snapshots.forEach((snapshot, index) => {
      const active = snapshot.text.words.find((word) => word.active);
      expect(active?.wordIndex).toBe(checkpointWords[index]);
      expect(snapshot.text.words).toHaveLength(
        Math.min(12, (timeline.tokens.at(-1)?.wordIndex ?? -1) + 1),
      );
      expect(snapshot.text.visibleWindowStartWordIndex).not.toBeNull();
      expect(snapshot.text.visibleWindowEndWordIndex).not.toBeNull();
      expect(snapshot.text.visibleWindowStartWordIndex).toBeLessThanOrEqual(
        checkpointWords[index],
      );
      expect(snapshot.text.visibleWindowEndWordIndex).toBeGreaterThanOrEqual(
        checkpointWords[index],
      );
    });
    expect(snapshots[0].text.visibleWindowStartWordIndex).toBe(0);
    expect(snapshots[2].text.visibleWindowStartWordIndex).toBeGreaterThan(0);
    expect(snapshots[4].text.visibleWindowEndWordIndex).toBe(35);
    expect(snapshots.at(-1)?.frameState.activeCharacter).toBe("H");
    expect(snapshots.at(-1)?.frameState.activeCharacterMorse).toBe("....");

    const activeCoordinates = checkpoints.map((token) => {
      const { calls, ctx } = createRecordingCanvasContext();
      renderMorseVideoFrame({
        ctx,
        elapsedMs: token.startMs + 1,
        frame: getMorseVideoFrameSize("1080p"),
        resolvedBackgroundStyle: "warm-morsewords",
        settings,
        timeline,
      });
      return calls
        .filter(
          (call) =>
            call.name === "fillText" &&
            call.fillStyle === "#020617" &&
            typeof call.args[2] === "number",
        )
        .map((call) => Number(call.args[2]));
    });
    expect(activeCoordinates.every((coordinates) => coordinates.length >= 2)).toBe(
      true,
    );
    expect(
      new Set(activeCoordinates.flat().map((coordinate) => coordinate.toFixed(3)))
        .size,
    ).toBeGreaterThan(3);

    const { calls, ctx } = createRecordingCanvasContext();
    renderMorseVideoFrame({
      ctx,
      elapsedMs: checkpoints[2].startMs + 1,
      frame: getMorseVideoFrameSize("1080p"),
      resolvedBackgroundStyle: "warm-morsewords",
      settings,
      timeline,
    });
    const renderedLinePositions = new Set(
      calls
        .filter(
          (call) =>
            call.name === "fillText" &&
            typeof call.args[2] === "number" &&
            call.args[2] !== 574,
        )
        .map((call) => Number(call.args[2]).toFixed(3)),
    );
    // The bounded window contains at least three Morse rows and two English
    // rows at this point, rather than one static first-line frame.
    expect(renderedLinePositions.size).toBeGreaterThanOrEqual(5);
  });

  test("keeps every multipart video part local while reaching its first and final content", () => {
    const source = Array.from({ length: 30 }, () => "SOS HELP").join(" ");
    const plan = buildMorseExportPlan({
      baseFilename: "windowed-video",
      charWpm: 18,
      farnsworthWpm: 12,
      format: "webm",
      kind: "video",
      source,
      sourceMode: "text",
      threshold: {
        maxDurationMs: 70_000,
        maxEstimatedBytes: 96 * 1024 * 1024,
        targetDurationMs: 60_000,
      },
      videoBitsPerSecond: 9_000_000,
    });
    const settings = {
      ...DEFAULT_MORSE_VIDEO_SETTINGS,
      backgroundStyle: "warm-morsewords" as const,
      resolution: "1080p" as const,
      showMorseSymbols: true,
      showPlainText: true,
    };

    expect(plan.parts.length).toBeGreaterThan(1);
    expect(
      plan.parts.map((part) => source.slice(part.sourceStart, part.sourceEnd)).join(""),
    ).toBe(source);
    plan.parts.forEach((part, index) => {
      if (index > 0) {
        expect(part.sourceStart).toBe(plan.parts[index - 1].sourceEnd);
      }
      const timeline = buildMorseVideoTimelineFromMorse(
        part.morse,
        AUDIO_SETTINGS,
        part.text,
      );
      const firstToken = timeline.tokens[0];
      const finalToken = timeline.tokens.at(-1);
      expect(firstToken).toBeDefined();
      expect(finalToken).toBeDefined();

      const firstFrame = buildMorseVideoExportFramePlan({
        elapsedMs: firstToken!.startMs + 1,
        frame: getMorseVideoFrameSize("1080p"),
        settings,
        timeline,
      });
      const finalFrame = buildMorseVideoExportFramePlan({
        elapsedMs: finalToken!.markEndMs + 1,
        frame: getMorseVideoFrameSize("1080p"),
        settings,
        timeline,
      });
      expect(firstFrame.frameState.wordWindow[0]?.wordIndex).toBe(0);
      expect(
        finalFrame.frameState.wordWindow.some(
          (word) => word.wordIndex === finalToken!.wordIndex && word.active,
        ),
      ).toBe(true);
      expect(finalFrame.frameState.activeCharacter).toBe(finalToken!.text);
      expect(
        finalFrame.frameState.wordWindow.find((word) => word.active)
          ?.activeCharIndex,
      ).toBe(finalToken!.charIndex);
      expect(finalFrame.frameState.displayWindowEndWordIndex).toBe(
        finalToken!.wordIndex,
      );
      const finalMarkFrame = buildMorseVideoExportFramePlan({
        elapsedMs: Math.max(finalToken!.startMs, finalToken!.markEndMs - 1),
        frame: getMorseVideoFrameSize("1080p"),
        settings,
        timeline,
      });
      expect(finalMarkFrame.frameState.bulbActive).toBe(true);
    });
  });

  test("resolution-aware plans keep short exports single-file and split high-resolution long exports", () => {
    const source = "ALPHA BRAVO CHARLIE DELTA ".repeat(220);
    const shortPlan = buildMorseExportPlan({
      baseFilename: "short-video",
      charWpm: 18,
      farnsworthWpm: 12,
      format: "webm",
      kind: "video",
      source: "SOS",
      sourceMode: "text",
      threshold: getMorseVideoExportProfile("4k").threshold,
      videoBitsPerSecond: getMorseVideoExportProfile("4k").videoBitsPerSecond,
    });
    const longPlan = buildMorseExportPlan({
      baseFilename: "long-video",
      charWpm: 18,
      farnsworthWpm: 12,
      format: "webm",
      kind: "video",
      source,
      sourceMode: "text",
      threshold: getMorseVideoExportProfile("4k").threshold,
      videoBitsPerSecond: getMorseVideoExportProfile("4k").videoBitsPerSecond,
    });
    expect(shortPlan.parts).toHaveLength(1);
    expect(longPlan.parts.length).toBeGreaterThan(1);
    expect(longPlan.parts.every((part) => part.durationMs <= longPlan.threshold.maxDurationMs)).toBe(true);
  });

  test("does not supply fabricated English text for an undecodable Morse part", () => {
    const plan = buildMorseExportPlan({
      baseFilename: "undecodable-video",
      charWpm: 18,
      farnsworthWpm: 12,
      format: "webm",
      kind: "video",
      source: "... --- ... ........",
      sourceMode: "morse",
    });

    expect(plan.parts).toHaveLength(1);
    expect(plan.parts[0].morse).toContain("........");
    expect(plan.parts[0].text).toBe("");
  });

});
