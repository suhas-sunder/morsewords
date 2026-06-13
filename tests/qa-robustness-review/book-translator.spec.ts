import { expect, test } from "@playwright/test";
import type { Locator, Page, TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

import { ROUTES, absoluteUrl } from "../../app/client/data/routes";
import {
  buildBookSignalEvents,
  renderBookPartPcm,
} from "../../app/client/components/morse-code-book-translator/bookBundleExport";
import {
  buildMorseTranscript,
  estimateBookTextDurationMs,
} from "../../app/client/components/morse-code-book-translator/bookDurationEstimate";
import {
  BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES,
  BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS,
  BOOK_DEFAULT_PART_TARGET_MS,
  BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS,
  estimateBookVideoExport,
  findOversizedAudioExportPart,
  findOversizedVideoExportPart,
  friendlyBookExportErrorMessage,
} from "../../app/client/components/morse-code-book-translator/bookExportSafety";
import {
  buildBookExportPlan,
  estimateLargestAudioPartPcmBytes,
} from "../../app/client/components/morse-code-book-translator/bookExportPlan";
import {
  buildBookVideoTimeline,
  renderBookVideoFrame,
} from "../../app/client/components/morse-code-book-translator/bookVideoRenderer";
import {
  DEFAULT_BOOK_VIDEO_SETTINGS,
  sanitizeBookVideoSettings,
} from "../../app/client/components/morse-code-book-translator/bookVideoTypes";
import { BOOK_EXPORT_PREFERENCES_KEY } from "../../app/client/components/morse-code-book-translator/bookExportPreferences";
import {
  BOOK_EXPORT_PRESETS,
  sanitizeBookExportSettings,
} from "../../app/client/components/morse-code-book-translator/bookExportPresets";
import { segmentBookText } from "../../app/client/components/morse-code-book-translator/bookSegmentation";
import { applyCleanupOptions } from "../../app/client/components/morse-code-book-translator/textNormalization";
import { estimateMorseDurationMs } from "../../app/client/components/shared/morseTiming";
import {
  buildMorseVideoPreview,
  getMorseVideoPreviewFrame,
} from "../../app/client/components/shared/video/morseVideoPreview";
import {
  LIVE_PREVIEW_START_BUFFER_MS,
  getLivePreviewStartDelayMs,
} from "../../app/client/components/shared/video/livePreviewPlayback";
import {
  blockExternalNetwork,
  collectConsoleErrors,
  waitForRouteReady,
} from "./helpers";

const CANONICAL_PATH = ROUTES.bookTranslator;
const ALIAS_PATH = ROUTES.ebookTranslatorAlias;
const RAW_SECRET_TEXT = "Private Draft Source";
const BOOK_TOOL_LABEL = "Book source review and download tool";
const BOOK_TRANSLATOR_LIVE_PREVIEW_PROGRESS_KEY =
  "morsewords:book-translator:live-preview-progress:v1";
const LIVE_PREVIEW_AUDIO_CONTROL_LABELS = [
  "Tone preset",
  "Character speed",
  "Farnsworth spacing",
  "Pitch",
  "Volume",
] as const;

async function openBookTranslator(page: Page) {
  await blockExternalNetwork(page);
  await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.locator("[data-mw-book-export-ready='true']"),
  ).toBeVisible();
}

function bookTool(page: Page) {
  return page.locator(`section[aria-label="${BOOK_TOOL_LABEL}"]`);
}

function sourceStep(page: Page) {
  return page.locator("section[aria-labelledby='book-add-source-heading']");
}

async function expectWorkflowReadyNearSource(page: Page) {
  await expect(
    sourceStep(page).getByRole("link", { name: "Review export" }),
  ).toHaveCount(0);
  await expect(
    sourceStep(page).getByRole("heading", { name: "Download MP3" }),
  ).toBeVisible();
  await expect(
    previewSection(page).getByTestId("book-video-preview-frame"),
  ).toBeVisible();
  await expectPreviewReady(page);
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    bookTool(page).getByRole("button", {
      name: /Download MP3|Download ZIP (?:bundle|batch \d+)/,
    }),
  ).toHaveCount(1);
  await expect(
    sourceStep(page).getByRole("button", {
      name: /Download MP3|Download ZIP (?:bundle|batch \d+)/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download sample" }),
  ).toHaveCount(0);
  await expect(downloadSettingsToggle(page)).toHaveAttribute(
    "aria-expanded",
    "false",
  );
}

function downloadSettingsToggle(page: Page) {
  return page.locator("summary").filter({ hasText: "Download settings" });
}

function livePlayerSettingsToggle(page: Page) {
  return page.locator("summary").filter({ hasText: "Live player settings" });
}

function downloadSettingsPanel(page: Page) {
  return bookTool(page).locator("details").filter({ hasText: "Download settings" });
}

function livePlayerSettingsPanel(page: Page) {
  return bookTool(page).locator("details").filter({ hasText: "Live player settings" });
}

function playerDetailsPanel(page: Page) {
  return previewSection(page).locator("details").filter({ hasText: "Player details" });
}

async function openPlayerDetails(page: Page) {
  const details = playerDetailsPanel(page);
  const open = await details.evaluate(
    (element) => (element as HTMLDetailsElement).open,
  );
  if (!open) {
    await details.locator("summary").click();
  }
}

async function openDownloadSettings(page: Page) {
  const toggle = downloadSettingsToggle(page);
  if ((await toggle.getAttribute("aria-expanded")) !== "true") {
    await toggle.click();
  }
}

async function openLivePlayerSettings(page: Page) {
  const toggle = livePlayerSettingsToggle(page);
  if ((await toggle.getAttribute("aria-expanded")) !== "true") {
    await toggle.click();
  }
}

async function setRangeInputValue(locator: Locator, value: number) {
  await locator.evaluate((input, nextValue) => {
    const element = input as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (valueSetter) {
      valueSetter.call(element, String(nextValue));
    } else {
      element.value = String(nextValue);
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function expectNormalizedLiveAudioControls(settingsPanel: Locator) {
  for (const label of LIVE_PREVIEW_AUDIO_CONTROL_LABELS) {
    await expect(settingsPanel.getByLabel(label)).toBeVisible();
  }
}

function outputTypeRadio(page: Page, outputType: "audio" | "video") {
  return bookTool(page).getByRole("radio", {
    exact: true,
    name: outputType === "audio" ? "Audio" : "Video",
  });
}

async function chooseSplitMode(
  page: Page,
  mode: "No split" | "By duration",
) {
  const downloadSection = page.locator("#book-download-controls");
  await expect(downloadSection).toBeVisible();
  await downloadSection.getByRole("radio", { name: mode, exact: true }).click();
}

function previewSection(page: Page) {
  return bookTool(page).getByTestId("book-preview-section");
}

async function expectPreviewReady(page: Page) {
  await expect(
    previewSection(page).getByTestId("book-preview-status"),
  ).toContainText(/Ready|Stopped/);
}

async function grantClipboard(page: Page) {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });
}

async function expectNoRawSourceInStorage(page: Page, rawText: string) {
  const storageSnapshot = await page.evaluate(() =>
    [
      ...Object.keys(localStorage).map(
        (key) => `${key}:${localStorage.getItem(key)}`,
      ),
      ...Object.keys(sessionStorage).map(
        (key) => `${key}:${sessionStorage.getItem(key)}`,
      ),
    ].join("\n"),
  );
  expect(storageSnapshot).not.toContain(rawText);
}

async function expectLocatorInsideBounds(container: Locator, child: Locator) {
  await expect(container).toBeVisible();
  await expect(child).toBeVisible();
  const containerBox = await container.boundingBox();
  const childBox = await child.boundingBox();
  expect(containerBox).not.toBeNull();
  expect(childBox).not.toBeNull();
  expect(childBox!.x).toBeGreaterThanOrEqual(containerBox!.x - 1);
  expect(childBox!.y).toBeGreaterThanOrEqual(containerBox!.y - 1);
  expect(childBox!.x + childBox!.width).toBeLessThanOrEqual(
    containerBox!.x + containerBox!.width + 1,
  );
  expect(childBox!.y + childBox!.height).toBeLessThanOrEqual(
    containerBox!.y + containerBox!.height + 1,
  );
}

type PreviewLayerRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
};

type PreviewLayerMetric = {
  fontSize: number;
  letterSpacing: string;
  rect: PreviewLayerRect;
  text: string;
};

type PreviewLayerMetrics = {
  frame: PreviewLayerRect;
  morse: PreviewLayerMetric | null;
  text: PreviewLayerMetric | null;
  windowLimit: number;
};

async function readPreviewLayerMetrics(
  root: Locator,
  testIdPrefix = "book-video-preview",
): Promise<PreviewLayerMetrics> {
  return root.evaluate((scope, prefix) => {
    const frame = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-frame"]`,
    );
    if (!frame) throw new Error(`Missing preview frame for ${prefix}`);

    function rectFor(element: Element): PreviewLayerRect {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    }

    function metricFor(testId: string): PreviewLayerMetric | null {
      const element = scope.querySelector<HTMLElement>(
        `[data-testid="${testId}"]`,
      );
      if (!element) return null;
      const style = window.getComputedStyle(element);
      return {
        fontSize: Number.parseFloat(style.fontSize),
        letterSpacing: style.letterSpacing,
        rect: rectFor(element),
        text: element.textContent ?? "",
      };
    }

    return {
      frame: rectFor(frame),
      morse: metricFor(`${prefix}-morse-overlay`),
      text: metricFor(`${prefix}-text-overlay`),
      windowLimit: Number(frame.dataset.previewWindowLimit ?? 0),
    };
  }, testIdPrefix);
}

function normalizedPreviewText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function previewWordCount(value: string) {
  return normalizedPreviewText(value).split(/\s+/).filter(Boolean).length;
}

function expectLayerInsideFrame(
  metrics: PreviewLayerMetrics,
  layer: PreviewLayerMetric | null,
) {
  expect(layer).not.toBeNull();
  expect(layer!.rect.width).toBeGreaterThan(0);
  expect(layer!.rect.height).toBeGreaterThan(0);
  expect(layer!.rect.left).toBeGreaterThanOrEqual(metrics.frame.left - 1);
  expect(layer!.rect.top).toBeGreaterThanOrEqual(metrics.frame.top - 1);
  expect(layer!.rect.right).toBeLessThanOrEqual(metrics.frame.right + 1);
  expect(layer!.rect.bottom).toBeLessThanOrEqual(metrics.frame.bottom + 1);
}

function expectNormalPlainTextSpacing(layer: PreviewLayerMetric | null) {
  expect(layer).not.toBeNull();
  const spacing = layer!.letterSpacing;
  const numericSpacing = Number.parseFloat(spacing);
  expect(spacing === "normal" || Math.abs(numericSpacing) < 0.1).toBe(true);
}

function expectMorseGroupsSeparated(value: string) {
  const normalized = normalizedPreviewText(value);
  expect(normalized).toMatch(/[.-]/);
  expect(normalized).toMatch(/\/|[.-]{1,4}\s+[.-]{1,4}/);
}

async function expectActivePreviewHighlights(
  root: Locator,
  testIdPrefix = "book-video-preview",
) {
  const highlight = await root.evaluate((scope, prefix) => {
    const morseWord = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-morse-word"]`,
    );
    const morseCharacter = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-morse-character"]`,
    );
    const textWord = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-text-word"]`,
    );
    const textCharacter = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-active-text-character"]`,
    );
    const morseOverlay = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-morse-overlay"]`,
    );
    const textLayers = scope.querySelector<HTMLElement>(
      `[data-testid="${prefix}-text-layers"]`,
    );

    function rectFor(element: HTMLElement | null) {
      const rect = element?.getBoundingClientRect();
      return rect
        ? { height: rect.height, width: rect.width }
        : { height: 0, width: 0 };
    }

    function styleFor(element: HTMLElement | null) {
      if (!element) {
        return {
          backgroundColor: "",
          borderRadius: 0,
          paddingLeft: 0,
          paddingRight: 0,
        };
      }
      const style = window.getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: Number.parseFloat(style.borderTopLeftRadius),
        paddingLeft: Number.parseFloat(style.paddingLeft),
        paddingRight: Number.parseFloat(style.paddingRight),
      };
    }

    return {
      activeMorse: textLayers?.getAttribute("data-active-morse") ?? "",
      morseCharacterRect: rectFor(morseCharacter),
      morseCharacterStyle: styleFor(morseCharacter),
      morseCharacterText: morseCharacter?.textContent?.trim() ?? "",
      morseOverlayText: morseOverlay?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      morseRect: rectFor(morseWord),
      morseStyle: styleFor(morseWord),
      morseText: morseWord?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      overlayRect: rectFor(morseOverlay),
      textCharacterRect: rectFor(textCharacter),
      textCharacterStyle: styleFor(textCharacter),
      textCharacterText: textCharacter?.textContent?.trim() ?? "",
      textStyle: styleFor(textWord),
      textText: textWord?.textContent?.trim() ?? "",
    };
  }, testIdPrefix);

  expect(highlight.morseText).toMatch(/[.-]/);
  expect(highlight.textText.length).toBeGreaterThan(0);
  expect(highlight.morseCharacterText).toBe(highlight.activeMorse);
  expect(highlight.morseStyle.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(highlight.morseStyle.backgroundColor).toBe(
    highlight.textStyle.backgroundColor,
  );
  expect(highlight.morseStyle.borderRadius).toBeGreaterThan(0);
  expect(Math.abs(
    highlight.morseStyle.borderRadius - highlight.textStyle.borderRadius,
  )).toBeLessThanOrEqual(1);
  expect(highlight.textCharacterText.length).toBeGreaterThan(0);
  expect(highlight.morseCharacterStyle.backgroundColor).not.toBe(
    "rgba(0, 0, 0, 0)",
  );
  expect(highlight.textCharacterStyle.backgroundColor).not.toBe(
    "rgba(0, 0, 0, 0)",
  );
  expect(highlight.morseCharacterStyle.backgroundColor).toBe(
    highlight.textCharacterStyle.backgroundColor,
  );
  expect(highlight.morseCharacterStyle.backgroundColor).not.toBe(
    highlight.morseStyle.backgroundColor,
  );
  expect(highlight.textCharacterStyle.backgroundColor).not.toBe(
    highlight.textStyle.backgroundColor,
  );
  expect(highlight.morseCharacterStyle.borderRadius).toBeGreaterThan(0);
  expect(highlight.textCharacterStyle.borderRadius).toBeGreaterThan(0);
  expect(Math.abs(
    highlight.textStyle.paddingLeft - highlight.textStyle.paddingRight,
  )).toBeLessThanOrEqual(1);
  expect(Math.abs(
    highlight.textCharacterStyle.paddingLeft -
      highlight.textCharacterStyle.paddingRight,
  )).toBeLessThanOrEqual(1);
  expect(Math.abs(
    highlight.morseCharacterStyle.paddingLeft -
      highlight.morseCharacterStyle.paddingRight,
  )).toBeLessThanOrEqual(1);
  expect(highlight.morseOverlayText).toContain(highlight.morseText);
  expect(highlight.morseOverlayText).not.toBe(highlight.morseText);
  expect(highlight.morseRect.width).toBeGreaterThan(0);
  expect(highlight.morseCharacterRect.width).toBeGreaterThan(0);
  expect(highlight.morseRect.width).toBeGreaterThanOrEqual(
    highlight.morseCharacterRect.width,
  );
  expect(highlight.morseRect.width).toBeLessThan(highlight.overlayRect.width);
}

async function readTranslatorLivePreviewProgress(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, BOOK_TRANSLATOR_LIVE_PREVIEW_PROGRESS_KEY);
}

function writeFixture(testInfo: TestInfo, name: string, data: Buffer | string) {
  const filePath = testInfo.outputPath(name);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data);
  return filePath;
}

function makeEpub(options: {
  encrypted?: boolean;
  broken?: boolean;
  title?: string;
  author?: string;
}) {
  if (options.broken) {
    return Buffer.from(
      zipSync({ "OPS/chapter.xhtml": strToU8("<p>Missing container</p>") }),
    );
  }

  const title = options.title ?? "Signal Book";
  const author = options.author ?? "Ada Morse";
  const files: Record<string, Uint8Array> = {
    "META-INF/container.xml": strToU8(`<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`),
    "OPS/content.opf": strToU8(`<?xml version="1.0"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${title}</dc:title>
    <dc:creator>${author}</dc:creator>
  </metadata>
  <manifest>
    <item id="c2" href="chapter-two.xhtml" media-type="application/xhtml+xml"/>
    <item id="c1" href="chapter-one.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="c1"/>
    <itemref idref="c2"/>
  </spine>
</package>`),
    "OPS/chapter-one.xhtml": strToU8(
      "<html><body><h1>First Signal</h1><p>Alpha comes before beta.</p></body></html>",
    ),
    "OPS/chapter-two.xhtml": strToU8(
      "<html><body><h1>Second Signal</h1><p>Charlie follows.</p></body></html>",
    ),
  };
  if (options.encrypted) {
    files["META-INF/encryption.xml"] = strToU8(
      "<encryption><EncryptedData/></encryption>",
    );
  }
  return Buffer.from(zipSync(files));
}

function escapePdfText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function makePdf(text: string) {
  const stream = text
    ? `BT /F1 12 Tf 72 720 Td (${escapePdfText(text)}) Tj ET`
    : "";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Title (Tiny PDF) /Author (MorseWords Test) >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(Buffer.byteLength(pdf, "ascii"));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf, "ascii");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "ascii");
}

async function downloadZip(page: Page, testInfo: TestInfo) {
  const downloadPromise = page.waitForEvent("download", { timeout: 90_000 });
  await page
    .getByRole("button", { name: /Download ZIP (?:bundle|batch \d+)/ })
    .click();
  const download = await downloadPromise;
  const zipPath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(zipPath);
  const entries = unzipSync(new Uint8Array(fs.readFileSync(zipPath)));
  return {
    filename: download.suggestedFilename(),
    entries,
    names: Object.keys(entries).sort(),
  };
}

async function downloadAudioFile(
  page: Page,
  testInfo: TestInfo,
  buttonName: RegExp,
) {
  const downloadPromise = page.waitForEvent("download", { timeout: 90_000 });
  await page.getByRole("button", { name: buttonName }).click();
  const download = await downloadPromise;
  const filePath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(filePath);
  return {
    filename: download.suggestedFilename(),
    bytes: new Uint8Array(fs.readFileSync(filePath)),
  };
}

function zipText(entries: Record<string, Uint8Array>, name: string) {
  const entry = entries[name];
  if (!entry) throw new Error(`Missing ZIP entry: ${name}`);
  return strFromU8(entry);
}

function zipJson<T = Record<string, unknown>>(
  entries: Record<string, Uint8Array>,
  name: string,
): T {
  return JSON.parse(zipText(entries, name)) as T;
}

function expectOrderedPartFiles(names: string[], extension: "mp3" | "wav") {
  const partFiles = names.filter((name) =>
    new RegExp(`part-\\d{3}\\.${extension}$`).test(name),
  );
  expect(partFiles.length).toBeGreaterThan(0);
  expect(partFiles).toEqual([...partFiles].sort());
  partFiles.forEach((name, index) => {
    expect(name).toMatch(
      new RegExp(`part-${String(index + 1).padStart(3, "0")}\\.${extension}$`),
    );
  });
  return partFiles;
}

function expectPlaylistOrder(playlist: string, partFiles: string[]) {
  expect(playlist).toContain("#EXTM3U");
  expect(
    playlist
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.startsWith("./")),
  ).toEqual(partFiles.map((file) => `./${file}`));
}

function expectMp3Like(bytes: Uint8Array) {
  expect(bytes.length).toBeGreaterThan(128);
  const hasId3 = bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33;
  const hasFrameSync = bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
  expect(hasId3 || hasFrameSync).toBe(true);
}

async function installPreviewAudioProbe(page: Page) {
  await page.addInitScript(() => {
    const events: string[] = [];
    Object.defineProperty(window, "__morsePreviewAudioEvents", {
      configurable: true,
      value: events,
    });

    function fakeAudioParam() {
      return {
        value: 0,
        cancelScheduledValues: () => undefined,
        exponentialRampToValueAtTime: () => undefined,
        linearRampToValueAtTime: () => undefined,
        setTargetAtTime: () => undefined,
        setValueAtTime: () => undefined,
      };
    }

    class FakeAudioNode {
      connect() {
        return this;
      }

      addEventListener() {
        return undefined;
      }
    }

    class FakeOscillatorNode extends FakeAudioNode {
      frequency = fakeAudioParam();
      type: OscillatorType = "sine";
      onended: ((event: Event) => void) | null = null;

      start() {
        events.push("oscillator-start");
      }

      stop() {
        events.push("oscillator-stop");
      }
    }

    class FakeAudioContext {
      currentTime = 0;
      destination = new FakeAudioNode();
      sampleRate = 44100;
      state: AudioContextState = "running";

      createGain() {
        return Object.assign(new FakeAudioNode(), { gain: fakeAudioParam() });
      }

      createOscillator() {
        return new FakeOscillatorNode();
      }

      createMediaStreamDestination() {
        return Object.assign(new FakeAudioNode(), { stream: new MediaStream() });
      }

      resume() {
        events.push("resume");
        return Promise.resolve();
      }

      close() {
        return Promise.resolve();
      }
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: FakeAudioContext,
    });
    Object.defineProperty(window, "webkitAudioContext", {
      configurable: true,
      value: FakeAudioContext,
    });
  });
}

async function readPreviewAudioEvents(page: Page) {
  return page.evaluate(
    () => (window as typeof window & { __morsePreviewAudioEvents?: string[] })
      .__morsePreviewAudioEvents ?? [],
  );
}

async function expectBookVideoPreviewUsesModuleWidth(page: Page) {
  const sectionBox = await previewSection(page).boundingBox();
  const previewBox = await page.getByTestId("book-video-preview").boundingBox();
  const frameBox = await page
    .getByTestId("book-video-preview-frame")
    .boundingBox();
  const timelineBox = await page
    .getByTestId("book-video-preview-timeline")
    .boundingBox();
  expect(sectionBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  expect(frameBox).not.toBeNull();
  expect(timelineBox).not.toBeNull();
  expect(previewBox!.width).toBeGreaterThan(sectionBox!.width * 0.88);
  expect(frameBox!.width).toBeGreaterThan(previewBox!.width * 0.96);
  expect(timelineBox!.width).toBeGreaterThan(previewBox!.width * 0.96);
}

type BundleManifest = {
  partCount: number;
  outputFormat: "mp3" | "wav";
  files: { audio: string[]; cleanedText?: string; morseTranscript?: string };
  parts: Array<{
    filename: string;
    runtimeMs: number;
    sourceStart: number;
    sourceEnd: number;
  }>;
  settingsSummary: {
    outputFormat: string;
    targetPartMinutes: number;
    tonePreset: string;
    pitch: number;
    volume: number;
    mp3Bitrate: number;
    sampleRate: number;
    tailPaddingMs: number;
    splitMode: string;
    splitAudio: boolean;
  };
};

type BundleSettings = {
  generatedAt: string;
  presetName: string;
  outputFormat: "mp3" | "wav";
  tonePreset: string;
  pitch: number;
  volume: number;
  mp3Bitrate: number;
  sampleRate: number;
  tailPaddingMs: number;
  splitMode: string;
  splitAudio: boolean;
  targetPartMinutes: number;
  includeCleanedText: boolean;
  includeMorseTranscript: boolean;
};

function makeVideoPart(index: number, text = "E") {
  return {
    index,
    title: `Part ${index}`,
    sourceStart: index - 1,
    sourceEnd: index,
    cleanedText: text,
    cleanedExcerpt: text,
    morseDurationMs: estimateBookTextDurationMs(
      text,
      BOOK_EXPORT_PRESETS["Reader Quick Start"],
    ),
    estimatedFilename: `morse-book-part-${String(index).padStart(3, "0")}.mp3`,
  };
}

function repeatTextForRuntime(
  phrase: string,
  minRuntimeMs: number,
  settings = BOOK_EXPORT_PRESETS["Reader Quick Start"],
) {
  const phraseRuntimeMs = Math.max(1, estimateBookTextDurationMs(phrase, settings));
  return phrase.repeat(Math.ceil(minRuntimeMs / phraseRuntimeMs));
}

type MockCanvasCommand =
  | {
      type: "fillText";
      text: string;
      x: number;
      y: number;
      maxWidth?: number;
      font: string;
      fillStyle: string;
    }
  | { type: "arc"; x: number; y: number; radius: number; fillStyle: string }
  | { type: "fill"; fillStyle: string }
  | { type: "fillRect"; fillStyle: string };

function createMockCanvasContext() {
  const commands: MockCanvasCommand[] = [];
  let fillStyle = "";
  let font = "";
  let textAlign: CanvasTextAlign = "start";
  let textBaseline: CanvasTextBaseline = "alphabetic";

  const ctx = {
    clearRect() {},
    beginPath() {},
    fill() {
      commands.push({ type: "fill", fillStyle });
    },
    fillRect() {
      commands.push({ type: "fillRect", fillStyle });
    },
    arc(x: number, y: number, radius: number) {
      commands.push({ type: "arc", x, y, radius, fillStyle });
    },
    fillText(text: string, x: number, y: number, maxWidth?: number) {
      commands.push({
        type: "fillText",
        text: String(text),
        x,
        y,
        maxWidth,
        font,
        fillStyle,
      });
    },
    set fillStyle(value: string | CanvasGradient | CanvasPattern) {
      fillStyle = String(value);
    },
    get fillStyle() {
      return fillStyle;
    },
    set font(value: string) {
      font = value;
    },
    get font() {
      return font;
    },
    set textAlign(value: CanvasTextAlign) {
      textAlign = value;
    },
    get textAlign() {
      return textAlign;
    },
    set textBaseline(value: CanvasTextBaseline) {
      textBaseline = value;
    },
    get textBaseline() {
      return textBaseline;
    },
  };

  return {
    commands,
    ctx: ctx as unknown as CanvasRenderingContext2D,
  };
}

test("book translator route metadata, alias, and sitemap use canonical URL", async ({
  page,
  request,
}) => {
  await openBookTranslator(page);

  await expect(page).toHaveTitle(
    /Book to Morse Code Translator \| Long Text to Morse Audio/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    absoluteUrl(CANONICAL_PATH),
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    absoluteUrl(CANONICAL_PATH),
  );

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.map((script) => script.textContent ?? "").join("\n"),
    );
  expect(jsonLd).toContain(absoluteUrl(CANONICAL_PATH));
  expect(jsonLd).toContain("WebApplication");
  await expect(
    page.getByText(
      "Your text and uploaded files are not uploaded to MorseWords servers or stored in a database.",
    ),
  ).toBeVisible();

  const aliasResponse = await request.get(ALIAS_PATH, { maxRedirects: 0 });
  expect(aliasResponse.status()).toBe(301);
  expect(aliasResponse.headers().location).toBe(CANONICAL_PATH);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(absoluteUrl(CANONICAL_PATH));
  expect(sitemap).not.toContain(absoluteUrl(ALIAS_PATH));
});

test("expanded SEO guide covers long-form workflows and dark-mode copy", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("morsewords-theme", "dark");
    document.documentElement.dataset.theme = "dark";
  });
  await openBookTranslator(page);

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("heading", {
      name: "Turn books, chapters, and long text into Morse practice files",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Supported source types for long text" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Download long Morse audio as MP3",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Make long Morse output easier to listen to",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Practical long-form Morse workflows",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Limits to plan around" }),
  ).toBeVisible();
  await expect(
    page.getByText("Morse audiobook-style playback").first(),
  ).toBeVisible();
  await expect(
    page.getByText("Project Gutenberg chapter to MP3").first(),
  ).toBeVisible();
  await expect(
    page.getByText("Generated MP3 and ZIP files").first(),
  ).toBeVisible();
  await expect(
    page
      .getByText(
        "MorseWords processes your source text locally in your browser.",
      )
      .first(),
  ).toBeVisible();
  await expect(page.getByText("No OCR").first()).toBeVisible();
  await expect(page.getByText("Browser live player").first()).toBeVisible();
});

test("translator rows run upload, source text, live preview, settings, then MP3 download", async ({
  page,
}) => {
  await openBookTranslator(page);

  const sourceEntry = page.getByTestId("book-source-entry");
  const uploadRow = page.getByTestId("book-source-upload-row");
  const uploadDropzone = page.getByTestId("book-source-upload-dropzone");
  const sourceTextRow = page.getByTestId("book-source-text-row");
  const sourceInput = page.getByLabel("Paste long-form source text");
  const preview = previewSection(page);
  const visualPreview = page.getByTestId("book-video-preview");
  const timingStrip = preview.getByTestId("book-video-preview-timing-strip");
  const previewTime = preview.getByTestId(
    "book-video-preview-timing-strip-time",
  );
  const previewDownloadLink = preview.getByTestId(
    "book-preview-download-mp3-link",
  );
  const playerDetails = playerDetailsPanel(page);
  const settingsRow = page.getByTestId("book-translator-settings-row");
  const settingsToggle = downloadSettingsToggle(page);
  const liveSettingsToggle = livePlayerSettingsToggle(page);
  const liveSettings = livePlayerSettingsPanel(page);
  const downloadRow = page.locator("#book-download-controls");
  const sourceDetails = page.getByTestId("book-source-details");

  await expect(sourceEntry).toBeVisible();
  await expect(uploadRow).toBeVisible();
  await expect(uploadDropzone).toBeVisible();
  await expect(uploadDropzone).toContainText("Replace source file");
  await expect(sourceTextRow).toBeVisible();
  await expect(sourceInput).toBeVisible();
  await expect(sourceInput).toHaveValue("SOS Help!");
  await expect(preview).toBeVisible();
  await expect(
    preview.getByRole("heading", { name: "Live preview" }),
  ).toHaveCount(0);
  await expect(visualPreview).toBeVisible();
  await expect(preview.getByRole("button", { name: "Play live player" }))
    .toBeVisible();
  await expect(previewDownloadLink).toBeVisible();
  await expect(previewDownloadLink).toHaveText("Download MP3");
  await expect(previewDownloadLink).toHaveAttribute(
    "href",
    "#book-download-controls",
  );
  await expect(timingStrip).toBeVisible();
  await expect(previewTime).toBeVisible();
  await expect(preview.getByTestId("book-video-preview-time")).toHaveCount(0);
  await expect(preview.getByText(/Preview time/)).toHaveCount(1);
  await expect(page.getByText("Condensed long preview")).toHaveCount(0);
  await expect(playerDetails).not.toHaveAttribute("open", "");
  await expect(
    playerDetails.getByRole("link", { name: "Download MP3" }),
  ).toHaveCount(0);
  await expect(preview.getByTestId("book-preview-status")).toBeHidden();
  await expect(settingsRow).toBeVisible();
  await expect(
    settingsRow.getByRole("heading", { name: "Settings" }),
  ).toBeVisible();
  await expect(settingsToggle).toBeVisible();
  await expect(liveSettingsToggle).toBeVisible();
  await expect(liveSettings).not.toHaveAttribute("open", "");
  await openLivePlayerSettings(page);
  await expect(
    liveSettings.getByRole("radio", { name: /Lightbulb signal/ }),
  ).toBeVisible();
  await expect(
    liveSettings.getByRole("radio", { name: /Dot signal/ }),
  ).toBeVisible();
  for (const retiredLabel of [
    "Full-frame flash",
    "Animated Morse signal",
    "Video quality",
    "720p",
    "1080p",
  ]) {
    await expect(liveSettings.getByText(retiredLabel, { exact: true })).toHaveCount(
      0,
    );
  }
  await expect(liveSettings.getByText(/Split mode|Split download/)).toHaveCount(0);
  await expect(page.getByTestId("book-video-preview-branding")).toHaveCount(0);
  await expect(preview.getByText(/morsewords\.com/i)).toHaveCount(0);
  await expect(
    downloadRow.getByRole("heading", { name: "Download MP3" }),
  ).toBeVisible();
  await expect(
    downloadRow.getByRole("radiogroup", { name: "Split download" }),
  ).toBeVisible();
  await expect(
    downloadRow.getByRole("radio", { name: "No split" }),
  ).toBeVisible();
  await expect(
    downloadRow.getByRole("radio", { name: "By duration" }),
  ).toBeVisible();
  await expect(sourceDetails).toBeVisible();
  await expect(sourceDetails.getByText("Active chars")).toBeVisible();
  await expect(sourceDetails.getByText("Copy extracted text")).toBeVisible();
  await expect(sourceDetails.getByText("Copy cleaned text")).toBeVisible();
  await expect(sourceDetails.getByRole("button", { name: "Clear source" }))
    .toBeVisible();

  const uploadBox = await uploadRow.boundingBox();
  const inputBox = await sourceTextRow.boundingBox();
  const previewBox = await preview.boundingBox();
  const visualPreviewBox = await visualPreview.boundingBox();
  const timingStripBox = await timingStrip.boundingBox();
  const settingsBox = await settingsRow.boundingBox();
  const downloadBox = await downloadRow.boundingBox();
  const sourceDetailsBox = await sourceDetails.boundingBox();

  expect(uploadBox).not.toBeNull();
  expect(inputBox).not.toBeNull();
  expect(previewBox).not.toBeNull();
  expect(visualPreviewBox).not.toBeNull();
  expect(timingStripBox).not.toBeNull();
  expect(settingsBox).not.toBeNull();
  expect(downloadBox).not.toBeNull();
  expect(sourceDetailsBox).not.toBeNull();
  expect(uploadBox!.y).toBeLessThan(inputBox!.y);
  expect(inputBox!.y).toBeLessThan(previewBox!.y);
  expect(previewBox!.y).toBeLessThan(settingsBox!.y);
  expect(visualPreviewBox!.y).toBeLessThan(timingStripBox!.y);
  expect(timingStripBox!.y).toBeLessThan(settingsBox!.y);
  expect(settingsBox!.y).toBeLessThan(downloadBox!.y);
  expect(downloadBox!.y).toBeLessThan(sourceDetailsBox!.y);

  await page.evaluate(() => window.scrollTo(0, 0));
  await previewDownloadLink.click();
  await expect
    .poll(() => page.evaluate(() => window.location.hash))
    .toBe("#book-download-controls");
  await expect
    .poll(() =>
      downloadRow.evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(220);

  await expect(
    page.getByRole("link", { name: "Open audio tool" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Create MP3 audio" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Create Morse audio or video" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Create Morse MP3 audio" }),
  ).toHaveCount(0);
  await expect(page.getByText("Download MP4")).toHaveCount(0);
  await expect(page.getByText("Download WebM")).toHaveCount(0);
  await expect(page.getByText("Video format")).toHaveCount(0);
});

test("pasted text review reports unsupported characters and avoids localStorage", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill(`${RAW_SECRET_TEXT}\nHello 世界 -- SOS`);

  await expect(page.getByText("Top unsupported characters")).toBeVisible();
  await expectWorkflowReadyNearSource(page);
  await expect(
    page.locator("pre").filter({ hasText: ".... . .-.. .-.. ---" }).first(),
  ).toBeVisible();
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

  const storageSnapshot = await page.evaluate(() =>
    Object.keys(localStorage)
      .map((key) => `${key}:${localStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(storageSnapshot).not.toContain(RAW_SECRET_TEXT);
  const sessionStorageSnapshot = await page.evaluate(() =>
    Object.keys(sessionStorage)
      .map((key) => `${key}:${sessionStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(sessionStorageSnapshot).not.toContain(RAW_SECRET_TEXT);
});

test("TXT and MD uploads populate source review", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const txtPath = writeFixture(
    testInfo,
    "book-source.txt",
    "Plain text chapter\nSOS help",
  );
  const mdPath = writeFixture(
    testInfo,
    "book-source.md",
    "# Markdown Chapter\n\nCQ CQ",
  );

  await page.setInputFiles("#book-source-file", txtPath);
  await expect(page.getByText("Current file: book-source.txt")).toBeVisible();
  await expect(
    page.getByText("This upload is small enough to edit directly"),
  ).toBeVisible();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    "Plain text chapter\nSOS help",
  );
  await expect(
    previewSection(page).getByTestId("book-video-preview-frame"),
  ).toBeVisible();
  await expect(
    previewSection(page).getByTestId("book-preview-sample"),
  ).toContainText("Plain text chapter");
  await expect(
    page.getByRole("button", { name: "Copy extracted text" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Copy cleaned text" }),
  ).toBeEnabled();
  await expectWorkflowReadyNearSource(page);

  await page.setInputFiles("#book-source-file", mdPath);
  await expect(page.getByText("Current file: book-source.md")).toBeVisible();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    "# Markdown Chapter\n\nCQ CQ",
  );
  await expect(
    page.getByRole("heading", { name: "Source ready" }),
  ).toBeVisible();
  await expectWorkflowReadyNearSource(page);
});

test("large uploaded text uses a capped extracted source preview", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const largeSource = `Preview starts here.\n\n${"ALPHA BRAVO SOS HELP ".repeat(
    3_200,
  )}\n\nPreview should not reach this ending marker.`;
  const txtPath = writeFixture(testInfo, "large-source.txt", largeSource);

  await page.setInputFiles("#book-source-file", txtPath);
  await expect(page.getByText("Current file: large-source.txt")).toBeVisible();
  await expect(page.getByText("Extracted source preview")).toBeVisible();
  await expect(page.getByText("Preview is truncated.")).toBeVisible();
  await expect(page.getByLabel("Paste long-form source text")).toHaveCount(0);
  const previewText =
    (await page.getByTestId("book-source-preview").textContent()) ?? "";
  expect(previewText).toContain("Preview starts here.");
  expect(previewText).not.toContain(
    "Preview should not reach this ending marker.",
  );
  expect(previewText.length).toBeLessThanOrEqual(6_050);
  await expect(
    page.getByRole("button", { name: "Edit extracted text" }),
  ).toBeEnabled();
  await expectWorkflowReadyNearSource(page);
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
});

test("large extracted edit mode uses apply and cancel without downloading draft text", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const largeSource = `Original active source SOS.\n\n${"ALPHA BRAVO HELP ".repeat(
    3_200,
  )}`;
  const txtPath = writeFixture(testInfo, "large-edit-source.txt", largeSource);

  await page.setInputFiles("#book-source-file", txtPath);
  await page.getByRole("button", { name: "Edit extracted text" }).click();
  await expect(page.getByText("Large edits apply manually")).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply edits" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel edits" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Download (MP3|WAV)|Download ZIP (?:bundle|batch \d+)/ }),
  ).toBeEnabled();

  await page
    .getByRole("textbox", { name: "Edit extracted text draft" })
    .fill("Draft only SOS");
  await expect(page.getByText("Draft edits are not included")).toBeVisible();
  await expect(
    page
      .locator("pre")
      .filter({ hasText: "Original active source SOS" })
      .first(),
  ).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "Draft only SOS" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Cancel edits" }).click();
  await expect(
    page.getByRole("textbox", { name: "Edit extracted text draft" }),
  ).toHaveCount(0);
  await expect(
    page
      .locator("pre")
      .filter({ hasText: "Original active source SOS" })
      .first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Edit extracted text" }).click();
  await page
    .getByRole("textbox", { name: "Edit extracted text draft" })
    .fill("Applied draft source SOS");
  await page.getByRole("button", { name: "Apply edits" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "Applied draft source SOS" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Extracted text edits applied.")).toBeVisible();
});

test("EPUB parser extracts metadata and spine text in reading order", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const epubPath = writeFixture(
    testInfo,
    "signal-book.epub",
    makeEpub({ title: "Signal Book", author: "Ada Morse" }),
  );

  await page.setInputFiles("#book-source-file", epubPath);
  await expect(
    page.getByLabel("Source ready").getByText("Signal Book"),
  ).toBeVisible();
  await expect(
    page.getByLabel("Source ready").getByText("Ada Morse"),
  ).toBeVisible();
  await expect(page.getByText("EPUB sections")).toBeVisible();
  await expect(page.getByText("Extracted source preview")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit extracted text" }),
  ).toBeEnabled();
  await expectWorkflowReadyNearSource(page);
  await expect(page.getByLabel("Paste long-form source text")).toHaveCount(0);

  const preview = page.getByTestId("book-source-preview");
  await expect(preview).toBeVisible();
  await expect(preview).toContainText("First Signal");
  const previewText = await bookTool(page).textContent();
  expect(previewText?.indexOf("First Signal")).toBeLessThan(
    previewText?.indexOf("Second Signal") ?? Number.POSITIVE_INFINITY,
  );
});

test("source preview actions copy, edit, and clear uploaded content", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await grantClipboard(page);
  const epubPath = writeFixture(
    testInfo,
    "copy-actions.epub",
    makeEpub({ title: "Copy Action Book", author: "Ada Morse" }),
  );

  await page.setInputFiles("#book-source-file", epubPath);
  await expect(page.getByText("Extracted source preview")).toBeVisible();

  await page.getByRole("button", { name: "Copy extracted text" }).click();
  await expect(page.getByText("Extracted text copied.")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("First Signal");

  await page.getByRole("button", { name: "Copy cleaned text" }).click();
  await expect(page.getByText("Cleaned text copied.")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("Charlie follows.");

  await page.getByRole("button", { name: "Edit extracted text" }).click();
  await expect(
    page.getByRole("textbox", { name: "Edit extracted text draft" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Edit extracted text draft" }),
  ).toHaveValue(/First Signal[\s\S]*Second Signal/);
  await expect(
    page.getByRole("button", { name: "Copy extracted text" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Copy cleaned text" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: /Download (MP3|WAV)|Download ZIP (?:bundle|batch \d+)/ }),
  ).toBeEnabled();
  await expect(page.getByRole("button", { name: "Apply edits" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel edits" }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Edit extracted text draft" })
    .fill("Edited extracted source SOS");
  await page.getByRole("button", { name: "Apply edits" }).click();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    "Edited extracted source SOS",
  );

  await page.getByRole("button", { name: "Clear source" }).first().click();
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    page.getByText("Part splitting appears after source text is available."),
  ).toHaveCount(0);
  await expect(page.getByText("Audio file summary")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Download (MP3|WAV)|Download ZIP (?:bundle|batch \d+)/ }),
  ).toBeDisabled();
  await expect(page.getByText("Last download")).toHaveCount(0);
});

test("empty uploaded source disables source copy actions", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const emptyPath = writeFixture(testInfo, "empty-source.txt", "");

  await page.setInputFiles("#book-source-file", emptyPath);
  await expect(page.getByText("Current file: empty-source.txt")).toBeVisible();
  await expect(
    page.getByText("Extraction finished, but no source text was found."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Copy extracted text" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Copy cleaned text" }),
  ).toBeDisabled();
  await expect(page.getByText("Extracted text copied.")).toHaveCount(0);
  await expect(page.getByText("Cleaned text copied.")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Clear source" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Clear source" }).click();
  await expect(page.getByText("Current file: empty-source.txt")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Source ready" })).toHaveCount(
    0,
  );
  await expect(
    page.getByText(
      /Add source text or upload a source file to enable (?:audio |video )?download\./,
    ),
  ).toBeVisible();
});

test("duration estimates and segmentation use shared Morse timing", async () => {
  const settings = {
    ...BOOK_EXPORT_PRESETS["Faithful Source"],
    splitMode: "duration" as const,
    splitAudio: true,
    targetPartMinutes: 0.035,
  };
  const plainText = "SOS HELP";
  const morse = buildMorseTranscript(plainText);
  expect(estimateBookTextDurationMs(plainText, settings)).toBeCloseTo(
    estimateMorseDurationMs(morse, {
      charWpm: settings.charWpm,
      farnsworthWpm: settings.farnsworthWpm,
    }),
    5,
  );

  const paragraphParts = segmentBookText({
    cleanedText: "ALPHA SOS.\n\nBRAVO HELP.\n\nCHARLIE CQ.",
    settings,
    sourceTitle: "Unsafe:/Book Name",
  });
  expect(paragraphParts.length).toBeGreaterThan(1);
  expect(paragraphParts.every((part) => part.cleanedText.trim())).toBe(true);
  expect(paragraphParts.map((part) => part.estimatedFilename)).toEqual(
    paragraphParts.map((part, index) =>
      expect.stringContaining(`part-${String(index + 1).padStart(3, "0")}`),
    ),
  );
  expect(paragraphParts[0].estimatedFilename).not.toContain(":");

  const directParts = segmentBookText({
    cleanedText: "ALPHA SOS.\n\nBRAVO HELP.",
    settings: { ...settings, splitMode: "none", splitAudio: false },
    sourceTitle: "Direct Book",
  });
  expect(directParts).toHaveLength(1);

  const sentenceParts = segmentBookText({
    cleanedText: "ALPHA SOS. BRAVO HELP. CHARLIE CQ. DELTA TEST.",
    settings: { ...settings, targetPartMinutes: 0.02 },
  });
  expect(sentenceParts.length).toBeGreaterThan(1);

  const wordParts = segmentBookText({
    cleanedText: "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA",
    settings: { ...settings, targetPartMinutes: 0.01 },
  });
  expect(wordParts.length).toBeGreaterThan(1);

  const hinted = segmentBookText({
    cleanedText: "FIRST SECTION SOS.\n\nSECOND SECTION HELP.",
    settings: {
      ...settings,
      splitMode: "source-sections",
      targetPartMinutes: 0.02,
    },
    sourceSections: [
      {
        title: "First",
        rawText: "FIRST SECTION SOS.",
        startOffset: 0,
        endOffset: 18,
      },
      {
        title: "Second",
        rawText: "SECOND SECTION HELP.",
        startOffset: 20,
        endOffset: 40,
      },
    ],
  });
  expect(hinted.some((part) => part.title.includes("First"))).toBe(true);
  expect(hinted.some((part) => part.title.includes("Second"))).toBe(true);
});

test("legacy splitAudio preferences do not silently enable split mode", async () => {
  const legacySettings: Partial<(typeof BOOK_EXPORT_PRESETS)["Reader Quick Start"]> =
    {
      ...BOOK_EXPORT_PRESETS["Reader Quick Start"],
      splitAudio: true,
      preferSourceSections: true,
    };
  delete legacySettings.splitMode;
  const sanitized = sanitizeBookExportSettings({
    ...legacySettings,
  });

  expect(sanitized.splitMode).toBe("none");
  expect(sanitized.splitAudio).toBe(false);
  expect(
    segmentBookText({
      cleanedText: "ALPHA SOS. BRAVO HELP. CHARLIE CQ.",
      settings: sanitized,
    }),
  ).toHaveLength(1);
});

test("legacy video text display preferences migrate to explicit layer flags", () => {
  const morseOnly = sanitizeBookVideoSettings({
    textDisplayMode: "morse",
  });
  expect(morseOnly.showVisualSignal).toBe(true);
  expect(morseOnly.showMorseSymbols).toBe(true);
  expect(morseOnly.showPlainText).toBe(false);
  expect(morseOnly.showMorseOverlay).toBe(true);
  expect(morseOnly.textDisplayMode).toBe("morse");

  const both = sanitizeBookVideoSettings({
    textDisplayMode: "both",
  });
  expect(both.showVisualSignal).toBe(true);
  expect(both.showMorseSymbols).toBe(true);
  expect(both.showPlainText).toBe(true);
  expect(both.textDisplayMode).toBe("both");

  const invalidEmptyLayers = sanitizeBookVideoSettings({
    showVisualSignal: false,
    showMorseSymbols: false,
    showPlainText: false,
  });
  expect(invalidEmptyLayers.showVisualSignal).toBe(true);
  expect(invalidEmptyLayers.showMorseSymbols).toBe(true);
  expect(invalidEmptyLayers.showPlainText).toBe(true);
});

test("live visual timeline uses shared timing", () => {
  const settings = BOOK_EXPORT_PRESETS["Reader Quick Start"];
  const text = "SOS HELP";
  const timeline = buildBookVideoTimeline(text, settings);
  const signalEvents = buildBookSignalEvents(text, settings);
  expect(timeline.events.length).toBe(signalEvents.length);
  expect(timeline.durationMs).toBeGreaterThanOrEqual(
    signalEvents.reduce((sum, event) => sum + event.ms, 0),
  );

  const preview = buildMorseVideoPreview(DEFAULT_BOOK_VIDEO_SETTINGS, text, {
    charWpm: settings.charWpm,
    farnsworthWpm: settings.farnsworthWpm,
  });
  const firstMark = preview.events.find((event) => event.type === "mark");
  expect(firstMark).toBeTruthy();
  expect(getMorseVideoPreviewFrame(preview, firstMark!.startMs + 1).active).toBe(
    true,
  );
  expect(getMorseVideoPreviewFrame(preview, preview.durationMs).active).toBe(
    false,
  );
});

test("live preview frames keep stable display batches and a start buffer", () => {
  const settings = BOOK_EXPORT_PRESETS["Reader Quick Start"];
  const text = [
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA JULIET KILO LIMA",
    "MIKE NOVEMBER OSCAR PAPA QUEBEC ROMEO SIERRA TANGO UNIFORM VICTOR",
  ].join(" ");
  const preview = buildMorseVideoPreview(DEFAULT_BOOK_VIDEO_SETTINGS, text, {
    charWpm: settings.charWpm,
    farnsworthWpm: settings.farnsworthWpm,
  });
  const wordWindowLimit = 48;
  const firstToken = preview.timeline.tokens[0];
  expect(firstToken).toBeTruthy();
  const firstFrame = getMorseVideoPreviewFrame(
    preview,
    firstToken.startMs + 1,
    wordWindowLimit,
  );
  const firstWindowWordIds = firstFrame.words.map((word) => word.wordIndex);
  expect(firstWindowWordIds.length).toBeGreaterThan(1);
  expectMorseGroupsSeparated(firstFrame.morseExcerpt);

  const lastVisibleWord = firstFrame.words[firstFrame.words.length - 1];
  const lastVisibleWordToken = preview.timeline.tokens.find(
    (token) => token.wordIndex === lastVisibleWord.wordIndex,
  );
  expect(lastVisibleWordToken).toBeTruthy();
  const lastFrameInBatch = getMorseVideoPreviewFrame(
    preview,
    lastVisibleWordToken!.startMs + 1,
    wordWindowLimit,
  );
  expect(lastFrameInBatch.words.map((word) => word.wordIndex)).toEqual(
    firstWindowWordIds,
  );

  const nextBatchToken = preview.timeline.tokens.find(
    (token) => token.wordIndex > lastVisibleWord.wordIndex,
  );
  expect(nextBatchToken).toBeTruthy();
  const nextFrame = getMorseVideoPreviewFrame(
    preview,
    nextBatchToken!.startMs + 1,
    wordWindowLimit,
  );
  expect(nextFrame.words.map((word) => word.wordIndex)).not.toEqual(
    firstWindowWordIds,
  );
  expect(nextFrame.words[0].wordIndex).toBeGreaterThan(
    firstWindowWordIds[0],
  );

  expect(
    getLivePreviewStartDelayMs(0, LIVE_PREVIEW_START_BUFFER_MS + 1_000),
  ).toBe(LIVE_PREVIEW_START_BUFFER_MS);
  expect(LIVE_PREVIEW_START_BUFFER_MS).toBe(2_000);
  expect(
    getLivePreviewStartDelayMs(500, LIVE_PREVIEW_START_BUFFER_MS + 1_000),
  ).toBe(0);
  expect(getLivePreviewStartDelayMs(0, LIVE_PREVIEW_START_BUFFER_MS)).toBe(0);
});

test("long export planning splits oversized selections before allocation and estimates video size", () => {
  const settings = BOOK_EXPORT_PRESETS["Reader Quick Start"];
  const noSplitSettings = {
    ...settings,
    splitMode: "none" as const,
    splitAudio: false,
  };
  const longText = repeatTextForRuntime(
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL. ",
    3 * 60 * 60 * 1000 + 10 * 60 * 1000,
    settings,
  );
  const longSection = {
    title: "Chapter 1",
    rawText: longText,
    startOffset: 0,
    endOffset: longText.length,
  };
  const audioPlan = buildBookExportPlan({
    cleanedText: longText,
    outputType: "audio",
    settings: noSplitSettings,
    sourceSections: [longSection],
    sourceTitle: "Long Manual",
  });
  expect(audioPlan.automaticSplit).toBe(true);
  expect(audioPlan.parts.length).toBeGreaterThan(1);
  expect(audioPlan.unresolvedOversizedPart).toBeNull();
  expect(findOversizedAudioExportPart(audioPlan.parts, settings)).toBeNull();
  expect(
    audioPlan.parts.every(
      (part) =>
        part.morseDurationMs + settings.tailPaddingMs <=
        BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS,
    ),
  ).toBe(true);
  expect(estimateLargestAudioPartPcmBytes(audioPlan.parts, settings)).toBeLessThanOrEqual(
    BOOK_AUDIO_SINGLE_EXPORT_MAX_PCM_BYTES,
  );

  const videoPlan = buildBookExportPlan({
    cleanedText: longText,
    outputType: "video",
    settings: noSplitSettings,
    sourceSections: [longSection],
    sourceTitle: "Long Manual",
    videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
  });
  expect(videoPlan.automaticSplit).toBe(true);
  expect(videoPlan.targetPartMs).toBe(BOOK_DEFAULT_PART_TARGET_MS);
  expect(videoPlan.parts.length).toBeLessThanOrEqual(audioPlan.parts.length + 1);
  expect(videoPlan.unresolvedOversizedPart).toBeNull();
  expect(
    findOversizedVideoExportPart(videoPlan.parts, DEFAULT_BOOK_VIDEO_SETTINGS),
  ).toBeNull();
  expect(
    videoPlan.parts.every(
      (part) =>
        part.morseDurationMs <=
        BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS[DEFAULT_BOOK_VIDEO_SETTINGS.resolution],
    ),
  ).toBe(true);

  const selectedTokens = longText.match(/[A-Z]+/g) ?? [];
  const plannedTokens = audioPlan.parts.flatMap(
    (part) => part.cleanedText.match(/[A-Z]+/g) ?? [],
  );
  expect(plannedTokens).toEqual(selectedTokens);
  for (let index = 1; index < audioPlan.parts.length; index += 1) {
    expect(audioPlan.parts[index].sourceStart).toBeGreaterThanOrEqual(
      audioPlan.parts[index - 1].sourceEnd,
    );
  }

  const smallPlan = buildBookExportPlan({
    cleanedText: "SOS HELP",
    outputType: "audio",
    settings: noSplitSettings,
    sourceTitle: "Small Manual",
  });
  expect(smallPlan.automaticSplit).toBe(false);
  expect(smallPlan.parts).toHaveLength(1);

  const normalPart = makeVideoPart(1, "SOS HELP");
  const oversizedAudioPart = {
    ...normalPart,
    morseDurationMs: BOOK_AUDIO_SINGLE_EXPORT_LIMIT_MS + 1_000,
  };
  const oversizedVideoPart = {
    ...normalPart,
    morseDurationMs:
      BOOK_VIDEO_SINGLE_EXPORT_LIMIT_MS[DEFAULT_BOOK_VIDEO_SETTINGS.resolution] +
      1_000,
  };

  expect(findOversizedAudioExportPart([normalPart], settings)).toBeNull();
  expect(findOversizedVideoExportPart([normalPart], DEFAULT_BOOK_VIDEO_SETTINGS)).toBeNull();
  expect(findOversizedAudioExportPart([oversizedAudioPart], settings)).toMatchObject({
    part: expect.objectContaining({ title: normalPart.title }),
  });
  expect(
    findOversizedVideoExportPart([oversizedVideoPart], DEFAULT_BOOK_VIDEO_SETTINGS),
  ).toMatchObject({
    part: expect.objectContaining({ title: normalPart.title }),
  });
  expect(
    friendlyBookExportErrorMessage(
      new RangeError("Invalid typed array length: 13520144345"),
      "audio",
    ),
  ).toBe(
    "Audio export failed while rendering a part. Retry the download, or use shorter parts if it fails again.",
  );
  expect(
    friendlyBookExportErrorMessage(
      new RangeError("Invalid typed array length: 13520144345"),
      "audio",
    ),
  ).not.toContain("Invalid typed array length");

  const estimate = estimateBookVideoExport(
    12 * 60 * 1000,
    "mp4",
    DEFAULT_BOOK_VIDEO_SETTINGS,
  );
  expect(estimate.sizeLabel).toMatch(/^~\d+(?:\.\d+)? (?:KB|MB|GB)$/);
  expect(estimate.renderTimeLabel).toMatch(/^~/);
  expect(estimate.sizeLabel).not.toContain(["Available", "after export"].join(" "));
});

test("video renderer keeps exported text overlays readable and away from branding", () => {
  const exportSettings = BOOK_EXPORT_PRESETS["Reader Quick Start"];
  const timeline = buildBookVideoTimeline(
    "Plain display SOS HELP checks readable MP4 overlays",
    exportSettings,
  );
  const { commands, ctx } = createMockCanvasContext();

  renderBookVideoFrame({
    ctx,
    elapsedMs: 0,
    exportSettings,
    frame: { width: 1280, height: 720 },
    resolvedBackgroundStyle: "warm-morsewords",
    settings: {
      ...DEFAULT_BOOK_VIDEO_SETTINGS,
      showBranding: true,
      textDisplayMode: "both",
      visualStyle: "lightbulb",
    },
    timeline,
  });

  const textCommands = commands.filter(
    (command): command is Extract<MockCanvasCommand, { type: "fillText" }> =>
      command.type === "fillText",
  );
  const brandText = textCommands.filter((command) =>
    command.text.includes("Morse"),
  );
  expect(textCommands.some((command) => command.text === "www.morsewords.com")).toBe(
    true,
  );
  expect(brandText.map((command) => command.text)).not.toContain("MorseWords");

  const morseEntries = textCommands.filter(
    (command) => /[.-]/.test(command.text) && command.font.includes("Space Mono"),
  );
  const morseOverlay = morseEntries[0];
  const plainOverlay = textCommands.find((command) =>
    command.text.includes("PLAIN"),
  );
  expect(morseOverlay).toBeTruthy();
  expect(plainOverlay).toBeTruthy();
  expect(
    morseEntries
      .map((command) => command.text)
      .join(" ")
      .replace(/\s+/g, "").length,
  ).toBeGreaterThanOrEqual(6);
  expect(timeline.tokens[0]).toMatchObject({
    text: "P",
    word: "PLAIN",
  });
  expect(morseOverlay!.font).toContain("Space Mono");
  expect(plainOverlay!.font).toContain("Space Grotesk");
  expect(Number.parseFloat(morseOverlay!.font)).toBeGreaterThanOrEqual(40);
  expect(Number.parseFloat(plainOverlay!.font)).toBeGreaterThanOrEqual(38);
  expect(morseOverlay!.x).toBeGreaterThan(0);
  expect(morseOverlay!.x).toBeLessThan(1280);
  expect(plainOverlay!.x).toBeGreaterThan(0);
  expect(plainOverlay!.x).toBeLessThan(1280);
  expect(morseOverlay!.y).toBeGreaterThan(350);
  expect(plainOverlay!.y).toBeGreaterThan(morseOverlay!.y);
  expect(plainOverlay!.y).toBeLessThan(560);
  expect(plainOverlay!.maxWidth).toBeGreaterThan(1100);
});

test("video renderer disables full-frame flash when visual signal layer is off", () => {
  const exportSettings = BOOK_EXPORT_PRESETS["Reader Quick Start"];
  const timeline = buildBookVideoTimeline("SOS HELP", exportSettings);
  const frame = { width: 1280, height: 720 };

  const signalOn = createMockCanvasContext();
  renderBookVideoFrame({
    ctx: signalOn.ctx,
    elapsedMs: 0,
    exportSettings,
    frame,
    resolvedBackgroundStyle: "warm-morsewords",
    settings: {
      ...DEFAULT_BOOK_VIDEO_SETTINGS,
      visualStyle: "full-frame",
      showVisualSignal: true,
    },
    timeline,
  });
  expect(signalOn.commands[0]).toMatchObject({
    type: "fillRect",
    fillStyle: "#08324f",
  });

  const signalOff = createMockCanvasContext();
  renderBookVideoFrame({
    ctx: signalOff.ctx,
    elapsedMs: 0,
    exportSettings,
    frame,
    resolvedBackgroundStyle: "warm-morsewords",
    settings: {
      ...DEFAULT_BOOK_VIDEO_SETTINGS,
      visualStyle: "full-frame",
      showVisualSignal: false,
    },
    timeline,
  });
  expect(signalOff.commands[0]).toMatchObject({
    type: "fillRect",
    fillStyle: "#fffdf8",
  });
  expect(
    signalOff.commands.some(
      (command) =>
        command.type === "arc" &&
        (command.fillStyle === "#bae6fd" || command.fillStyle === "#08324f"),
    ),
  ).toBe(false);
});

test("segmentation handles long-source boundary edge cases without empty parts", async () => {
  const settings = {
    ...BOOK_EXPORT_PRESETS["Practice Copy"],
    splitMode: "duration" as const,
    splitAudio: true,
    targetPartMinutes: 0.018,
  };
  const cases = [
    "SOS",
    Array.from(
      { length: 40 },
      (_, index) => `Paragraph ${index + 1} SOS.`,
    ).join("\n\n"),
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT. ".repeat(120),
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA ".repeat(80),
    "ALPHA   BRAVO\n\n\nSOS\tHELP ".repeat(80),
    "SOSHELP".repeat(160),
  ];

  for (const source of cases) {
    const cleanedText = applyCleanupOptions(source, {
      normalizeSmartPunctuation: true,
      stripZeroWidthAndSoftHyphen: true,
      stripGutenbergHeaderFooter: false,
      simplifyPunctuation: true,
    }).cleanedText;
    const parts = segmentBookText({
      cleanedText,
      settings,
      sourceTitle: "QA/Stress",
    });
    expect(parts.length).toBeGreaterThan(0);
    parts.forEach((part, index) => {
      expect(part.cleanedText.trim()).toBeTruthy();
      expect(part.sourceStart).toBeLessThan(part.sourceEnd);
      expect(part.index).toBe(index + 1);
      expect(part.estimatedFilename).toContain(
        `part-${String(index + 1).padStart(3, "0")}`,
      );
      expect(part.morseDurationMs).toBeCloseTo(
        estimateBookTextDurationMs(part.cleanedText, settings),
        5,
      );
    });
  }

  const wordBoundarySource =
    "ALPHA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA JULIET ".repeat(
      20,
    );
  const wordParts = segmentBookText({
    cleanedText: wordBoundarySource,
    settings: { ...settings, targetPartMinutes: 0.01 },
  });
  expect(wordParts.length).toBeGreaterThan(1);
  for (const part of wordParts) {
    const before =
      part.sourceStart > 0 ? wordBoundarySource[part.sourceStart - 1] : " ";
    const after =
      part.sourceEnd < wordBoundarySource.length
        ? wordBoundarySource[part.sourceEnd]
        : " ";
    expect(before).toMatch(/\s/);
    expect(after).toMatch(/\s/);
  }

  const trailingParts = segmentBookText({
    cleanedText: `${"ALPHA BRAVO. ".repeat(35)}\n\nSOS`,
    settings,
  });
  if (trailingParts.length > 1) {
    const targetMs = settings.targetPartMinutes * 60_000;
    expect(trailingParts.at(-1)?.morseDurationMs).toBeGreaterThanOrEqual(
      targetMs * 0.22,
    );
  }

  const stripped = applyCleanupOptions(
    `Header
*** START OF THE PROJECT GUTENBERG EBOOK TEST ***
Signal body SOS.
*** END OF THE PROJECT GUTENBERG EBOOK TEST ***
Footer`,
    {
      normalizeSmartPunctuation: true,
      stripZeroWidthAndSoftHyphen: true,
      stripGutenbergHeaderFooter: true,
      simplifyPunctuation: false,
    },
  );
  expect(stripped.cleanedText).toBe("Signal body SOS.");
  const strippedEmpty = applyCleanupOptions(
    `*** START OF THE PROJECT GUTENBERG EBOOK TEST ***
*** END OF THE PROJECT GUTENBERG EBOOK TEST ***`,
    {
      normalizeSmartPunctuation: true,
      stripZeroWidthAndSoftHyphen: true,
      stripGutenbergHeaderFooter: true,
      simplifyPunctuation: false,
    },
  );
  expect(strippedEmpty.cleanedText).toBe("");
});

test("custom cleanup rules are plain-text, ordered, reversible transforms", async () => {
  const cleanupOptions = {
    normalizeSmartPunctuation: true,
    stripZeroWidthAndSoftHyphen: true,
    stripGutenbergHeaderFooter: false,
    simplifyPunctuation: false,
  };

  const cleaned = applyCleanupOptions(
    "Intro REMOVE old phrase cat scatter Cat",
    cleanupOptions,
    [
      {
        id: "remove",
        enabled: true,
        find: "REMOVE ",
        replacement: "",
        caseSensitive: false,
        wholeWord: false,
      },
      {
        id: "replace",
        enabled: true,
        find: "old phrase",
        replacement: "new phrase",
        caseSensitive: false,
        wholeWord: false,
      },
      {
        id: "disabled",
        enabled: false,
        find: "Intro",
        replacement: "Hidden",
        caseSensitive: false,
        wholeWord: false,
      },
      {
        id: "case",
        enabled: true,
        find: "Cat",
        replacement: "Lynx",
        caseSensitive: true,
        wholeWord: true,
      },
      {
        id: "whole-word",
        enabled: true,
        find: "cat",
        replacement: "dog",
        caseSensitive: false,
        wholeWord: true,
      },
    ],
  );

  expect(cleaned.cleanedText).toBe("Intro new phrase dog scatter Lynx");
  expect(cleaned.customRuleMatches).toEqual([
    { id: "remove", count: 1, active: true },
    { id: "replace", count: 1, active: true },
    { id: "disabled", count: 0, active: false },
    { id: "case", count: 1, active: true },
    { id: "whole-word", count: 1, active: true },
  ]);

  const reverted = applyCleanupOptions(
    "Intro REMOVE old phrase cat scatter Cat",
    cleanupOptions,
    [],
  );
  expect(reverted.cleanedText).toBe("Intro REMOVE old phrase cat scatter Cat");
});

test("preset settings, reset, and safe route preferences persist", async ({
  page,
}) => {
  await openBookTranslator(page);
  await expect(downloadSettingsToggle(page)).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await openDownloadSettings(page);
  const tool = bookTool(page);
  await expect(tool.getByText("Compact MP3 settings")).toBeVisible();

  await tool.getByRole("button", { name: "Practice Copy" }).click();
  await expect(tool.getByText("Slower Farnsworth spacing")).toBeVisible();
  await expect(tool.getByText("Best for: Training and review")).toBeVisible();
  await expect(
    tool.getByText("20/10 WPM, CW radio, MP3 48 kbps, single audio file."),
  ).toBeVisible();
  const downloadControls = page.locator("#book-download-controls");
  await expect(
    downloadControls.getByRole("radiogroup", { name: "Split download" }),
  ).toBeVisible();
  await expect(
    downloadControls.getByRole("radio", { name: "No split" }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(
    downloadControls.getByRole("radio", { name: "By duration" }),
  ).toBeVisible();
  await expect(
    downloadControls.getByRole("radio", { name: "By source sections" }),
  ).toHaveCount(0);
  await expect(downloadControls.getByLabel("Target part length")).toHaveCount(0);
  await chooseSplitMode(page, "By duration");
  await expect(downloadControls.getByLabel("Target part length")).toBeVisible();
  const downloadSettings = downloadSettingsPanel(page);
  await expect(downloadSettings.getByLabel("Tone preset")).toHaveValue("cw_radio");
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();
  await expect(page.getByLabel("WAV sample rate")).toHaveCount(0);
  await expect(page.getByLabel("Tail padding")).toHaveCount(0);

  const settingsToggle = downloadSettingsToggle(page);
  await expect(settingsToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByLabel("Include Morse transcript")).toBeVisible();
  await expect(page.getByRole("radio", { name: "WAV" })).toHaveCount(0);
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();
  await expect(page.getByLabel("WAV sample rate")).toHaveCount(0);
  await expect(page.getByLabel("Tail padding")).toHaveCount(0);
  await page.getByLabel("MP3 bitrate").selectOption("96");
  await expect(page.getByText("Modified from preset")).toBeVisible();

  await downloadSettings.getByLabel("Tone preset").selectOption("warm_tone");
  await expect(downloadSettings.getByLabel("Tone preset")).toHaveValue(
    "warm_tone",
  );
  await expect(downloadSettings.getByLabel("Pitch")).toHaveValue("560");
  await expect(downloadSettings.getByLabel("Volume")).toHaveValue("72");

  await page.getByLabel("Paste long-form source text").fill(RAW_SECRET_TEXT);
  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .toContain('"outputFormat":"mp3"');
  const storageSnapshot = await page.evaluate(() =>
    Object.keys(localStorage)
      .map((key) => `${key}:${localStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(storageSnapshot).not.toContain(RAW_SECRET_TEXT);

  await page.getByRole("button", { name: "Reset preset" }).click();
  await expect(page.getByText("Modified from preset")).toHaveCount(0);
  await expect(page.getByRole("radio", { name: /WAV/ })).toHaveCount(0);
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .toContain('"advancedOpen":true');

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.locator("[data-mw-book-export-ready='true']"),
  ).toBeVisible();
  await openDownloadSettings(page);
  await expect(page.getByRole("radio", { name: /WAV/ })).toHaveCount(0);
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();
});

test("malformed saved preferences fall back safely without source persistence", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "{not valid json");
  }, BOOK_EXPORT_PREFERENCES_KEY);
  await openBookTranslator(page);
  await expect(downloadSettingsToggle(page)).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await openDownloadSettings(page);
  await expect(
    page.getByRole("button", { name: "Reader Quick Start" }),
  ).toBeVisible();
  await page.getByLabel("Paste long-form source text").fill(RAW_SECRET_TEXT);
  await expect(
    page.locator("pre").filter({ hasText: RAW_SECRET_TEXT }).first(),
  ).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .toContain('"presetName":"Reader Quick Start"');
  const storageSnapshot = await page.evaluate(() =>
    [
      ...Object.keys(localStorage).map(
        (key) => `${key}:${localStorage.getItem(key)}`,
      ),
      ...Object.keys(sessionStorage).map(
        (key) => `${key}:${sessionStorage.getItem(key)}`,
      ),
    ].join("\n"),
  );
  expect(storageSnapshot).not.toContain(RAW_SECRET_TEXT);
});

test("legacy saved split preference renders the safe no-split default", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, settings, videoSettings }) => {
      const legacySettings = {
        ...settings,
        splitAudio: true,
        preferSourceSections: true,
      } as Record<string, unknown>;
      delete legacySettings.splitMode;
      localStorage.setItem(
        key,
        JSON.stringify({
          outputType: "audio",
          exportSettings: legacySettings,
          videoSettings,
          advancedOpen: true,
        }),
      );
    },
    {
      key: BOOK_EXPORT_PREFERENCES_KEY,
      settings: BOOK_EXPORT_PRESETS["Reader Quick Start"],
      videoSettings: DEFAULT_BOOK_VIDEO_SETTINGS,
    },
  );
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Legacy split preference SOS HELP ".repeat(40));

  await expect(downloadSettingsToggle(page)).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.getByRole("radio", { name: "No split" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByLabel("Target part length")).toHaveCount(0);
  await expect(
    sourceStep(page).getByRole("button", { name: "Download MP3" }),
  ).toBeVisible();
  await expect(
    sourceStep(page).getByRole("button", { name: /Download ZIP bundle/ }),
  ).toHaveCount(0);
});

test("split mode controls expose duration controls without public source-section mode", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Split controls SOS HELP. ".repeat(20));
  await openDownloadSettings(page);

  await expect(page.getByRole("radio", { name: "No split" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByLabel("Target part length")).toHaveCount(0);
  await expect(
    page.getByRole("radio", { name: "By source sections" }),
  ).toHaveCount(0);

  await chooseSplitMode(page, "No split");
  await expect(page.getByLabel("Target part length")).toHaveCount(0);
  await expect(page.getByTestId("book-split-section-fallback")).toHaveCount(0);

  await chooseSplitMode(page, "By duration");
  await expect(page.getByLabel("Target part length")).toBeVisible();
  await expect(page.getByLabel("Target part length")).toHaveValue("30");
  await expect(page.getByTestId("book-split-section-fallback")).toHaveCount(0);

  await openLivePlayerSettings(page);
  const liveSettings = livePlayerSettingsPanel(page);
  await expect(liveSettings.getByRole("radio", { name: "No split" })).toHaveCount(0);
  await expect(liveSettings.getByLabel("Target part length")).toHaveCount(0);
});

test("live player previews current cleaned source and updates with audio settings", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Preview KEEP REMOVE SOS HELP. ".repeat(8));

  const preview = previewSection(page);
  await expect(
    preview.getByRole("heading", { name: "Live preview" }),
  ).toHaveCount(0);
  await expect(preview.getByTestId("book-video-preview-frame")).toBeVisible();
  await expectPreviewReady(page);
  await expect(playerDetailsPanel(page)).not.toHaveAttribute("open", "");
  await expect(preview.getByTestId("book-preview-sample")).toBeHidden();
  await openPlayerDetails(page);
  await expect(preview.getByTestId("book-preview-sample")).toContainText(
    "REMOVE",
  );
  await expect(preview.getByText("18/12 WPM")).toBeVisible();
  await expect(preview.getByText("650 Hz")).toBeVisible();
  await expect(preview.getByText("75%")).toBeVisible();

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").fill("REMOVE");
  await expect(preview.getByTestId("book-preview-sample")).not.toContainText(
    "REMOVE",
  );
  await expectPreviewReady(page);

  await openDownloadSettings(page);
  const downloadSettings = downloadSettingsPanel(page);
  await page.getByRole("button", { name: "Long Listen" }).click();
  await expect(preview.getByText("16/12 WPM")).toBeVisible();
  await expect(preview.getByText("600 Hz")).toBeVisible();
  await expect(preview.getByText("68%")).toBeVisible();
  await expectPreviewReady(page);
  await expect(
    downloadSettings.getByLabel("Tone preset"),
  ).toHaveValue("sine");
  await expect(page.getByTestId("book-video-preview-frame")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-morse-overlay")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-text-overlay")).toBeVisible();
  const liveTimeline = preview.getByRole("slider", {
    name: "Live player timeline",
  });
  await expect(liveTimeline).toBeVisible();
  await expect(liveTimeline).toHaveAttribute("aria-valuenow", "0");
  const timelineBox = await liveTimeline.boundingBox();
  expect(timelineBox).not.toBeNull();
  await liveTimeline.click({
    position: {
      x: timelineBox!.width * 0.45,
      y: timelineBox!.height / 2,
    },
  });
  await expect(liveTimeline).not.toHaveAttribute("aria-valuenow", "0");

  const playButton = preview.getByRole("button", { name: "Play live player" });
  await playButton.click();
  await expect(
    preview.getByRole("button", { name: "Stop live player" }),
  ).toBeVisible();
  await expect(page.getByTestId("book-video-preview")).toHaveAttribute(
    "data-preview-playing",
    "true",
  );
  await expect
    .poll(() => liveTimeline.getAttribute("aria-valuenow"))
    .not.toBe("0");
  await liveTimeline.click({
    position: {
      x: timelineBox!.width * 0.75,
      y: timelineBox!.height / 2,
    },
  });
  await expect
    .poll(
      async () =>
        Number(
          (await liveTimeline.getAttribute("aria-valuenow")) ?? "0",
        ),
    )
    .toBeGreaterThan(10_000);
  const playedTimelineBox = await liveTimeline.boundingBox();
  expect(playedTimelineBox).not.toBeNull();
  await page.mouse.move(
    playedTimelineBox!.x + playedTimelineBox!.width * 0.25,
    playedTimelineBox!.y + playedTimelineBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    playedTimelineBox!.x + playedTimelineBox!.width * 0.85,
    playedTimelineBox!.y + playedTimelineBox!.height / 2,
    { steps: 5 },
  );
  await expect(liveTimeline).not.toHaveAttribute("aria-disabled", "true");
  await expect(
    preview.getByRole("button", { name: "Stop live player" }),
  ).toBeEnabled();
  await page.mouse.up();
  await expect(
    preview.getByRole("button", { name: "Stop live player" }),
  ).toBeEnabled();
  const clickedFocusStyle = await preview
    .getByRole("button", { name: "Stop live player" })
    .evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
  expect(["none", "solid"]).toContain(clickedFocusStyle.outlineStyle);
  expect(Number.parseFloat(clickedFocusStyle.outlineWidth)).toBeGreaterThanOrEqual(0);

  await page
    .getByLabel("Paste long-form source text")
    .fill("Changed preview SOS");
  await expect(
    preview.getByRole("button", { name: "Play live player" }),
  ).toBeVisible();
  await expect(preview.getByTestId("book-preview-sample")).toContainText(
    "Changed preview SOS",
  );
  await expectNoRawSourceInStorage(page, "Changed preview SOS");
  await expect(
    page.getByRole("button", { name: "Download sample" }),
  ).toHaveCount(0);
});

test("long and short live previews report a safe seekable duration", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("PARIS ".repeat(900));
  await expectPreviewReady(page);

  const preview = previewSection(page);
  const liveTimeline = preview.getByRole("slider", {
    name: "Live player timeline",
  });
  await expect(liveTimeline).toBeVisible();
  const longDurationMs = Number(await liveTimeline.getAttribute("aria-valuemax"));
  expect(longDurationMs).toBeGreaterThan(0);
  expect(longDurationMs).toBeGreaterThan(30 * 60 * 1000);
  expect(longDurationMs).toBeLessThanOrEqual(60 * 60 * 1000);
  expect(
    ((await preview.getByTestId("book-preview-sample").textContent()) ?? "")
      .length,
  ).toBeLessThanOrEqual(430);

  await page.getByLabel("Paste long-form source text").fill("Short SOS");
  await expectPreviewReady(page);
  const shortDurationMs = Number(
    await preview
      .getByRole("slider", { name: "Live player timeline" })
      .getAttribute("aria-valuemax"),
  );
  expect(shortDurationMs).toBeLessThan(60_000);
  expect(shortDurationMs).toBeLessThan(longDurationMs);
});

test("long live preview segments can reach the final source word", async ({
  page,
}) => {
  await openBookTranslator(page);
  const finalWord = "apples";
  const source = `${"PARIS ".repeat(900)}${finalWord}`;
  await page.getByLabel("Paste long-form source text").fill(source);

  const preview = previewSection(page);
  await expectPreviewReady(page);
  await expect(preview.getByTestId("book-video-preview-frame")).toBeVisible();
  await expect(page.getByText("Condensed long preview")).toHaveCount(0);
  await expect(
    preview.getByTestId("book-video-preview-timing-strip-time"),
  ).toBeVisible();
  await expect(preview.getByTestId("book-video-preview-time")).toHaveCount(0);
  await expect(preview.getByText(/Preview time/)).toHaveCount(1);

  const segmentSelect = preview.getByTestId("book-live-preview-segment-select");
  await expect(segmentSelect).toBeVisible();
  const segmentCount = await segmentSelect.locator("option").count();
  expect(segmentCount).toBeGreaterThan(1);
  await segmentSelect.selectOption(String(segmentCount - 1));

  const liveTimeline = preview.getByRole("slider", {
    name: "Live player timeline",
  });
  await liveTimeline.focus();
  await page.keyboard.press("End");
  await expect
    .poll(async () =>
      (
        (await page
          .getByTestId("book-video-preview-text-layers")
          .getAttribute("data-active-word")) ?? ""
      ).toLowerCase(),
    )
    .toBe(finalWord);
  await expectNoRawSourceInStorage(page, finalWord);
  await expect(page.getByText("Download MP4")).toHaveCount(0);
  await expect(page.getByText("Download WebM")).toHaveCount(0);
  await expect(page.getByText("Video format")).toHaveCount(0);
});

test("live preview progress restores only for the same translator source hash", async ({
  page,
}) => {
  await openBookTranslator(page);
  const finalWord = "apples";
  const source = `${"PARIS ".repeat(900)}${finalWord}`;
  await page.getByLabel("Paste long-form source text").fill(source);

  const preview = previewSection(page);
  await expectPreviewReady(page);
  const segmentSelect = preview.getByTestId("book-live-preview-segment-select");
  await expect(segmentSelect).toBeVisible();
  const segmentCount = await segmentSelect.locator("option").count();
  expect(segmentCount).toBeGreaterThan(1);
  await segmentSelect.selectOption(String(segmentCount - 1));

  const liveTimeline = preview.getByRole("slider", {
    name: "Live player timeline",
  });
  await liveTimeline.focus();
  await page.keyboard.press("End");

  await expect
    .poll(() => readTranslatorLivePreviewProgress(page))
    .toMatchObject({
      segmentIndex: segmentCount - 1,
      version: 1,
    });
  const storedAfterSeek = await readTranslatorLivePreviewProgress(page);
  expect(storedAfterSeek.contentHash).toEqual(expect.any(String));
  expect(storedAfterSeek.timeSeconds).toBeGreaterThan(0);
  expect(storedAfterSeek.updatedAt).toEqual(expect.any(Number));
  await expectNoRawSourceInStorage(page, finalWord);
  await expectNoRawSourceInStorage(page, source);

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.locator("[data-mw-book-export-ready='true']"),
  ).toBeVisible();
  await page.getByLabel("Paste long-form source text").fill(source);
  await expect(segmentSelect).toHaveValue(String(segmentCount - 1));
  await expect
    .poll(async () => Number(await liveTimeline.getAttribute("aria-valuenow")))
    .toBeGreaterThan(0);

  await page
    .getByLabel("Paste long-form source text")
    .fill("Different source text SOS HELP.");
  await expect
    .poll(async () => Number(await liveTimeline.getAttribute("aria-valuenow")))
    .toBe(0);
  await expect(preview.getByTestId("book-live-preview-segment-select"))
    .toHaveCount(0);
  await expectNoRawSourceInStorage(page, finalWord);
  await expect(page.getByText("Download MP4")).toHaveCount(0);
  await expect(page.getByText("Download WebM")).toHaveCount(0);
  await expect(page.getByText("Video format")).toHaveCount(0);
});

test("live preview fullscreen preserves translator source and progress", async ({
  page,
}) => {
  await openBookTranslator(page);
  const finalWord = "apples";
  const source = `${"PARIS ".repeat(900)}${finalWord}`;
  const sourceInput = page.getByLabel("Paste long-form source text");
  await sourceInput.fill(source);

  const preview = previewSection(page);
  await expectPreviewReady(page);
  await expect(preview.getByTestId("book-video-preview-frame")).toBeVisible();
  await expect(preview.getByTestId("book-video-preview-fullscreen-button")).toBeVisible();
  const embeddedMorseText = await preview
    .getByTestId("book-video-preview-morse-overlay")
    .evaluate(
      (element) => (element as HTMLElement).innerText.replace(/\s+/g, " "),
    );
  expect(embeddedMorseText).toMatch(/[.-]{1,5}\s+[.-]{1,5}/);
  expect(embeddedMorseText).toContain("/");

  const segmentSelect = preview.getByTestId("book-live-preview-segment-select");
  await expect(segmentSelect).toBeVisible();
  const segmentCount = await segmentSelect.locator("option").count();
  expect(segmentCount).toBeGreaterThan(1);
  const finalSegmentValue = String(segmentCount - 1);
  await segmentSelect.selectOption(finalSegmentValue);

  const liveTimeline = preview.getByRole("slider", {
    name: "Live player timeline",
  });
  await liveTimeline.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(async () => Number(await liveTimeline.getAttribute("aria-valuenow")))
    .toBeGreaterThan(0);

  await preview.getByTestId("book-video-preview-fullscreen-button").click();
  const overlay = page.getByTestId("book-video-preview-fullscreen-overlay");
  await expect(overlay).toBeVisible();
  await expect(overlay).toHaveAttribute("data-fullscreen-active", "true");
  const exitFullscreenButton = page.getByRole("button", {
    name: "Exit fullscreen",
  });
  await expect(exitFullscreenButton).toBeVisible();
  await expect(exitFullscreenButton.locator("svg")).toBeVisible();
  await expect(sourceInput).toHaveValue(source);
  await expect(
    page.getByTestId("book-live-preview-fullscreen-segment-select"),
  ).toHaveValue(finalSegmentValue);
  const fullscreenFrame = page.getByTestId("book-video-preview-fullscreen-frame");
  const fullscreenMorse = page.getByTestId(
    "book-video-preview-fullscreen-morse-overlay",
  );
  const fullscreenText = page.getByTestId(
    "book-video-preview-fullscreen-text-overlay",
  );
  const fullscreenMorseText = await fullscreenMorse.evaluate(
    (element) => (element as HTMLElement).innerText.replace(/\s+/g, " "),
  );
  expect(fullscreenMorseText).toMatch(/[.-]{1,5}\s+[.-]{1,5}/);
  expect(fullscreenMorseText).toContain("/");
  const fullscreenActiveTextWord = await page
    .getByTestId("book-video-preview-fullscreen-active-text-word")
    .evaluate(
      (element) => (element as HTMLElement).innerText.replace(/\s+/g, " "),
    );
  expect(fullscreenActiveTextWord).not.toMatch(
    /[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/,
  );
  await expectLocatorInsideBounds(fullscreenFrame, fullscreenMorse);
  await expectLocatorInsideBounds(fullscreenFrame, fullscreenText);
  await expectLocatorInsideBounds(
    fullscreenFrame,
    page.getByTestId("book-video-preview-fullscreen-active-morse-word"),
  );
  await expectLocatorInsideBounds(
    fullscreenFrame,
    page.getByTestId("book-video-preview-fullscreen-active-text-word"),
  );
  await overlay.getByRole("button", { name: "Play live player" }).click();
  await expect(overlay).toHaveAttribute(
    "data-fullscreen-controls-visible",
    "false",
    { timeout: 1_500 },
  );
  await expect(overlay).toHaveAttribute(
    "data-fullscreen-controls-suppressed",
    "true",
  );
  await page.mouse.move(24, 24);
  await expect(overlay).toHaveAttribute(
    "data-fullscreen-controls-visible",
    "false",
  );
  await expect(overlay).toHaveAttribute(
    "data-fullscreen-controls-suppressed",
    "false",
    { timeout: 4_000 },
  );
  await page.mouse.move(32, 32);
  await expect(overlay).toHaveAttribute(
    "data-fullscreen-controls-visible",
    "true",
  );
  await expect
    .poll(async () =>
      Number(
        await overlay
          .getByRole("slider", { name: "Fullscreen live player timeline" })
          .getAttribute("aria-valuenow"),
      ),
    )
    .toBeGreaterThan(0);

  await exitFullscreenButton.click();
  await expect(page.getByTestId("book-video-preview-fullscreen-overlay")).toHaveCount(0);
  await expect(preview.getByTestId("book-video-preview-frame")).toBeVisible();
  await expect(sourceInput).toHaveValue(source);
  await expect(segmentSelect).toHaveValue(finalSegmentValue);
  await expect
    .poll(async () => Number(await liveTimeline.getAttribute("aria-valuenow")))
    .toBeGreaterThan(0);
  await expect(
    preview.getByTestId("book-preview-download-mp3-link"),
  ).toBeVisible();
  await expect(page.getByText("Download MP4")).toHaveCount(0);
  await expect(page.getByText("Download WebM")).toHaveCount(0);
});

test("MP3 download stays primary while the live visual player remains available", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill(`${RAW_SECRET_TEXT} live player SOS`);
  await openDownloadSettings(page);

  await expect(outputTypeRadio(page, "audio")).toHaveCount(0);
  await expect(outputTypeRadio(page, "video")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Download MP3" })).toBeVisible();
  await expect(sourceStep(page).getByRole("button", { name: "Download MP3" })).toBeEnabled();
  await expect(page.getByText(["Download", "MP4"].join(" "))).toHaveCount(0);
  await expect(page.getByText(["Download", "WebM"].join(" "))).toHaveCount(0);
  await expect(page.getByText(["Video", "format"].join(" "))).toHaveCount(0);
  await expect(page.getByText(["Rendering", "video"].join(" "))).toHaveCount(0);

  await expectPreviewReady(page);
  await expect(
    previewSection(page).getByRole("button", { name: "Stop preview" }),
  ).toHaveCount(0);
  await expect(page.getByTestId("book-live-player-workflow")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-frame")).toBeVisible();
  const playLivePlayerButton = previewSection(page).getByRole("button", {
    name: "Play live player",
  });
  const fullscreenButton = previewSection(page).getByRole("button", {
    name: "Open live preview fullscreen",
  });
  const previewDownloadLink = previewSection(page).getByRole("link", {
    name: "Download MP3",
  });
  await expect(playLivePlayerButton).toBeVisible();
  await expect(playLivePlayerButton.locator("svg")).toBeVisible();
  await expect(fullscreenButton).toBeVisible();
  await expect(fullscreenButton.locator("svg")).toBeVisible();
  await expect(previewDownloadLink).toBeVisible();
  await expect(previewDownloadLink.locator("svg")).toBeVisible();
  await expectBookVideoPreviewUsesModuleWidth(page);
  await expect(playerDetailsPanel(page)).not.toHaveAttribute("open", "");
  await expect(livePlayerSettingsPanel(page)).not.toHaveAttribute("open", "");
  await openLivePlayerSettings(page);
  const liveSettings = livePlayerSettingsPanel(page);
  await expectNormalizedLiveAudioControls(liveSettings);
  await expect(liveSettings.getByLabel("Tone preset")).toHaveValue("cw_radio");
  await setRangeInputValue(liveSettings.getByLabel("Character speed"), 22);
  await expect(liveSettings.getByLabel("Character speed")).toHaveValue("22");
  await openPlayerDetails(page);
  await expect(playerDetailsPanel(page).getByText("22/12 WPM")).toBeVisible();
  await expect(liveSettings.getByRole("radio", { name: /Lightbulb/ })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(page.getByLabel("Show visual signal")).toBeChecked();
  await expect(page.getByLabel("Show Morse symbols")).toBeChecked();
  await expect(page.getByLabel("Show plain text")).toBeChecked();
  await expect(
    previewSection(page).getByText("Visual signal: Lightbulb signal on"),
  ).toHaveCount(0);
  await openPlayerDetails(page);
  await expect(playerDetailsPanel(page).getByText("Visual signal")).toBeVisible();
  await expect(playerDetailsPanel(page).getByText("Morse symbols")).toBeVisible();
  await expect(playerDetailsPanel(page).getByText("Plain text")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-lightbulb")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-morse-overlay")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-text-overlay")).toBeVisible();
  await expect(
    previewSection(page).getByTestId("book-preview-download-mp3-link"),
  ).toBeVisible();
  await expect(
    liveSettings.getByRole("button", { name: "Reset progress" }),
  ).toHaveCount(0);
  await expect(downloadSettingsPanel(page).getByLabel("MP3 bitrate")).toBeVisible();
  await expect(liveSettings.getByRole("radio", { name: "No split" })).toHaveCount(0);
  await expect(liveSettings.getByLabel("Target part length")).toHaveCount(0);
  await expect(page.getByLabel("WAV sample rate")).toHaveCount(0);
  await expect(page.getByRole("radio", { name: /MP3/ })).toHaveCount(0);
  await expect(page.getByRole("radio", { name: /WAV/ })).toHaveCount(0);
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    `${RAW_SECRET_TEXT} live player SOS`,
  );
  await expectNoRawSourceInStorage(page, RAW_SECRET_TEXT);
  await expect
    .poll(() =>
      page.evaluate(
        (key) => localStorage.getItem(key),
        BOOK_EXPORT_PREFERENCES_KEY,
      ),
    )
    .not.toContain('"outputType":"video"');
});

test("live visual preview settings hide obsolete video controls and keep layers scoped", async ({
  page,
}) => {
  const sourceText =
    "SOS HELP preview moves through a longer readable text window for seek testing with alpha bravo charlie delta echo foxtrot";
  await openBookTranslator(page);
  await page.getByLabel("Paste long-form source text").fill(sourceText);
  await openDownloadSettings(page);

  await expect(
    previewSection(page).getByRole("heading", { name: "Live preview" }),
  ).toHaveCount(0);
  await expect(
    previewSection(page).getByTestId("book-video-preview-frame"),
  ).toBeVisible();
  await expectPreviewReady(page);
  await expect(playerDetailsPanel(page)).not.toHaveAttribute("open", "");
  await openPlayerDetails(page);
  await expect(
    previewSection(page).getByTestId("book-preview-sample"),
  ).toContainText("SOS HELP preview");
  await expect(playerDetailsPanel(page).getByText("Audio")).toBeVisible();
  await expect(
    previewSection(page).getByRole("button", { name: "Play live player" }),
  ).toBeVisible();
  await openLivePlayerSettings(page);
  const liveSettings = livePlayerSettingsPanel(page);
  await expect(
    liveSettings.getByRole("radio", { name: /Lightbulb signal/ }),
  ).toBeVisible();
  await expect(
    liveSettings.getByRole("radio", { name: /Dot signal/ }),
  ).toBeVisible();
  for (const retiredLabel of [
    "Full-frame flash",
    "Animated Morse signal",
    "Video quality",
    "720p",
    "1080p",
  ]) {
    await expect(liveSettings.getByText(retiredLabel, { exact: true })).toHaveCount(
      0,
    );
  }
  await expect(page.getByTestId("book-video-preview")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-lightbulb")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-branding")).toHaveCount(0);
  await expect(previewSection(page).getByText(/morsewords\.com/i)).toHaveCount(0);
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

  await liveSettings.getByRole("radio", { name: /Dot/ }).click();
  await expect(page.getByTestId("book-video-preview-dot")).toBeVisible();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );

  await liveSettings.getByRole("radio", { name: /Lightbulb signal/ }).click();
  await expect(
    previewSection(page).getByRole("button", { name: "Play live player" }),
  ).toBeVisible();
  await expect(page.getByTestId("book-video-preview-lightbulb")).toBeVisible();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );
  await expect(page.getByLabel("Show visual signal")).toBeChecked();
  await expect(page.getByLabel("Show Morse symbols")).toBeChecked();
  await expect(page.getByLabel("Show plain text")).toBeChecked();
  await expect(
    page.getByRole("radiogroup", { name: "Text shown in video" }),
  ).toHaveCount(0);
  await expect(page.getByTestId("book-video-preview-branding")).toHaveCount(0);
  await expect(
    page.getByTestId("book-video-preview-morse-overlay"),
  ).toBeVisible();
  await expect(
    page.getByTestId("book-video-preview-text-overlay"),
  ).toBeVisible();
  const preview = page.getByTestId("book-video-preview");
  const defaultMetrics = await readPreviewLayerMetrics(preview);
  expectLayerInsideFrame(defaultMetrics, defaultMetrics.morse);
  expectLayerInsideFrame(defaultMetrics, defaultMetrics.text);
  expectMorseGroupsSeparated(defaultMetrics.morse!.text);
  expectNormalPlainTextSpacing(defaultMetrics.text);
  const defaultTextWindow = normalizedPreviewText(defaultMetrics.text!.text);
  const defaultMorseWindow = normalizedPreviewText(defaultMetrics.morse!.text);
  const liveTimeline = previewSection(page).getByRole("slider", {
    name: "Live player timeline",
  });
  await liveTimeline.focus();
  await page.keyboard.press("ArrowRight");
  const nudgedMetrics = await readPreviewLayerMetrics(preview);
  expect(normalizedPreviewText(nudgedMetrics.text!.text)).toBe(
    defaultTextWindow,
  );
  expect(normalizedPreviewText(nudgedMetrics.morse!.text)).toBe(
    defaultMorseWindow,
  );
  await expect(
    sourceStep(page).getByRole("button", { name: "Download MP3" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Download MP4|Download WebM/ }))
    .toHaveCount(0);
  await expect(page.getByText(/\bMP4\b|\bWebM\b/)).toHaveCount(0);

  await page.getByLabel("Show visual signal").uncheck();
  await expect(page.getByTestId("book-video-preview-lightbulb")).toHaveCount(0);
  await expect(page.getByTestId("book-video-preview-morse-overlay")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-text-overlay")).toBeVisible();
  const noSignalMetrics = await readPreviewLayerMetrics(preview);
  expect(noSignalMetrics.windowLimit).toBeGreaterThan(
    defaultMetrics.windowLimit,
  );
  expectLayerInsideFrame(noSignalMetrics, noSignalMetrics.morse);
  expectLayerInsideFrame(noSignalMetrics, noSignalMetrics.text);
  expect(noSignalMetrics.morse!.fontSize).toBeLessThanOrEqual(
    defaultMetrics.morse!.fontSize + 1,
  );
  expect(noSignalMetrics.text!.fontSize).toBeLessThanOrEqual(
    defaultMetrics.text!.fontSize + 1,
  );
  expect(previewWordCount(noSignalMetrics.text!.text)).toBeGreaterThanOrEqual(
    previewWordCount(defaultMetrics.text!.text),
  );
  expectMorseGroupsSeparated(noSignalMetrics.morse!.text);
  expectNormalPlainTextSpacing(noSignalMetrics.text);

  await page.getByLabel("Show Morse symbols").uncheck();
  await expect(
    page.getByTestId("book-video-preview-morse-overlay"),
  ).toHaveCount(0);
  await expect(
    page.getByTestId("book-video-preview-text-overlay"),
  ).toBeVisible();
  const textOnlyMetrics = await readPreviewLayerMetrics(preview);
  expect(textOnlyMetrics.windowLimit).toBeGreaterThan(
    noSignalMetrics.windowLimit,
  );
  expectLayerInsideFrame(textOnlyMetrics, textOnlyMetrics.text);
  expect(textOnlyMetrics.text!.fontSize).toBeLessThanOrEqual(
    defaultMetrics.text!.fontSize + 1,
  );
  expect(previewWordCount(textOnlyMetrics.text!.text)).toBeGreaterThanOrEqual(
    previewWordCount(noSignalMetrics.text!.text),
  );
  expectNormalPlainTextSpacing(textOnlyMetrics.text);

  await page.getByLabel("Show Morse symbols").check();
  await page.getByLabel("Show plain text").uncheck();
  await expect(
    page.getByTestId("book-video-preview-morse-overlay"),
  ).toBeVisible();
  await expect(
    page.getByTestId("book-video-preview-text-overlay"),
  ).toHaveCount(0);
  const morseOnlyMetrics = await readPreviewLayerMetrics(preview);
  expect(morseOnlyMetrics.windowLimit).toBeGreaterThan(
    noSignalMetrics.windowLimit,
  );
  expectLayerInsideFrame(morseOnlyMetrics, morseOnlyMetrics.morse);
  expect(morseOnlyMetrics.morse!.fontSize).toBeLessThanOrEqual(
    defaultMetrics.morse!.fontSize + 1,
  );
  expect(previewWordCount(morseOnlyMetrics.morse!.text)).toBeGreaterThanOrEqual(
    previewWordCount(noSignalMetrics.morse!.text),
  );
  expectMorseGroupsSeparated(morseOnlyMetrics.morse!.text);

  await page.getByTestId("book-video-preview-fullscreen-button").click();
  const fullscreenOverlay = page.getByTestId(
    "book-video-preview-fullscreen-overlay",
  );
  await expect(fullscreenOverlay).toBeVisible();
  const fullscreenMetrics = await readPreviewLayerMetrics(
    fullscreenOverlay,
    "book-video-preview-fullscreen",
  );
  expectLayerInsideFrame(fullscreenMetrics, fullscreenMetrics.morse);
  expect(fullscreenMetrics.morse!.fontSize).toBeLessThanOrEqual(72);
  expectMorseGroupsSeparated(fullscreenMetrics.morse!.text);
  await page.getByRole("button", { name: "Exit fullscreen" }).click();
  await expect(page.getByTestId("book-video-preview-fullscreen-overlay"))
    .toHaveCount(0);

  await page.getByLabel("Show plain text").check();
  await expect(
    page.getByTestId("book-video-preview-text-overlay"),
  ).toBeVisible();
  const overlaySizes = await page.evaluate(() => {
    const morse = document.querySelector<HTMLElement>(
      '[data-testid="book-video-preview-morse-overlay"]',
    );
    const text = document.querySelector<HTMLElement>(
      '[data-testid="book-video-preview-text-overlay"]',
    );
    return {
      morseFontSize: morse
        ? Number.parseFloat(getComputedStyle(morse).fontSize)
        : 0,
      textFontSize: text
        ? Number.parseFloat(getComputedStyle(text).fontSize)
        : 0,
      morseText: morse?.textContent ?? "",
      plainText: text?.textContent ?? "",
      activeWord:
        document
          .querySelector<HTMLElement>(
            '[data-testid="book-video-preview-text-layers"]',
          )
          ?.getAttribute("data-active-word") ?? "",
    };
  });
  expect(overlaySizes.morseFontSize).toBeGreaterThan(12);
  expect(overlaySizes.textFontSize).toBeGreaterThan(12);
  expect(overlaySizes.morseFontSize).toBeLessThanOrEqual(
    defaultMetrics.morse!.fontSize + 1,
  );
  expect(overlaySizes.textFontSize).toBeLessThanOrEqual(
    defaultMetrics.text!.fontSize + 1,
  );
  expect(overlaySizes.morseText).toMatch(/[.-]/);
  expect(overlaySizes.plainText).toContain("SOS");
  expect(overlaySizes.activeWord).toContain("SOS");
  await expect(page.getByLabel("Paste long-form source text")).toHaveValue(
    sourceText,
  );
  const videoTimeline = page.getByLabel("Live player timeline");
  const videoTimelineBox = await videoTimeline.boundingBox();
  expect(videoTimelineBox).not.toBeNull();
  await videoTimeline.click({
    position: {
      x: videoTimelineBox!.width * 0.75,
      y: videoTimelineBox!.height / 2,
    },
  });
  await expect
    .poll(() =>
      page
        .getByTestId("book-video-preview-text-layers")
        .getAttribute("data-active-word"),
    )
    .not.toContain("SOS");
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );
  await expectPreviewReady(page);
  await previewSection(page)
    .getByRole("button", { name: "Play live player" })
    .click();
  await expect(page.getByTestId("book-video-preview-frame")).toHaveAttribute(
    "data-full-frame-active",
    "false",
  );
  await previewSection(page)
    .getByRole("button", { name: "Stop live player" })
    .click();
  await page.getByLabel("Show visual signal").check();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );
  await expectPreviewReady(page);
  await previewSection(page)
    .getByRole("button", { name: "Play live player" })
    .click();
  await expect(page.getByTestId("book-video-preview-frame")).toHaveAttribute(
    "data-preview-playing",
    "true",
  );
  await previewSection(page)
    .getByRole("button", { name: "Stop live player" })
    .click();
  await page.getByRole("checkbox", { name: "Audio" }).uncheck();
  await expect(
    playerDetailsPanel(page)
      .locator("dl")
      .filter({ hasText: "Audio" })
      .filter({ hasText: "Off" }),
  ).toBeVisible();
});

test("visual preview visibly animates and stops stale playback", async ({
  page,
}) => {
  await installPreviewAudioProbe(page);
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("SOS HELP visual preview animation ".repeat(10).trim());
  await openDownloadSettings(page);
  await openLivePlayerSettings(page);
  const liveSettings = livePlayerSettingsPanel(page);
  const stopLivePlayerIfVisible = async () => {
    const stopButton = previewSection(page).getByRole("button", {
      name: "Stop live player",
    });
    if ((await stopButton.count()) > 0) {
      await stopButton.click();
    } else {
      await expect(
        previewSection(page).getByRole("button", { name: "Play live player" }),
      ).toBeVisible();
    }
    await expect(page.getByTestId("book-video-preview")).toHaveAttribute(
      "data-preview-playing",
      "false",
    );
  };
  const expectLivePlayerControlReady = async () => {
    const stopButton = previewSection(page).getByRole("button", {
      name: "Stop live player",
    });
    if ((await stopButton.count()) > 0) {
      await expect(stopButton).toBeEnabled();
    } else {
      await expect(
        previewSection(page).getByRole("button", { name: "Play live player" }),
      ).toBeVisible();
    }
  };
  await expectPreviewReady(page);
  await expectBookVideoPreviewUsesModuleWidth(page);

  const frameBox = await page
    .getByTestId("book-video-preview-frame")
    .boundingBox();
  expect(frameBox).not.toBeNull();
  const frameRatio = frameBox!.width / frameBox!.height;
  expect(frameRatio).toBeGreaterThan(1.65);
  expect(frameRatio).toBeLessThan(1.9);
  const lightbulbBox = await page
    .getByTestId("book-video-preview-lightbulb")
    .locator("svg")
    .boundingBox();
  expect(lightbulbBox).not.toBeNull();
  const viewportWidth = page.viewportSize()?.width ?? 1280;
  expect(lightbulbBox!.width).toBeGreaterThanOrEqual(
    viewportWidth < 640 ? 64 : 120,
  );
  await expect(page.getByLabel("Live player timeline")).toBeVisible();

  await previewSection(page)
    .getByRole("button", { name: "Play live player" })
    .click();
  await expect(
    previewSection(page).getByRole("button", { name: "Restart live player" }),
  ).toBeVisible();
  await expect(page.getByTestId("book-video-preview")).toHaveAttribute(
    "data-preview-active",
    "false",
  );
  await expect(page.getByTestId("book-video-preview-lightbulb")).toHaveAttribute(
    "data-preview-active",
    "false",
  );
  await expect
    .poll(async () =>
      (await readPreviewAudioEvents(page)).includes("oscillator-start"),
    )
    .toBe(true);
  await expect(page.getByLabel("Live player timeline")).not.toHaveAttribute(
    "aria-valuenow",
    "NaN",
  );
  await expect
    .poll(() =>
      page
        .getByTestId("book-video-preview-lightbulb")
        .getAttribute("data-preview-active"),
    )
    .toBe("true");
  await expect
    .poll(() =>
      page
        .getByTestId("book-video-preview-lightbulb")
        .locator("svg")
        .evaluate((element) => getComputedStyle(element).color),
    )
    .not.toBe("rgb(148, 163, 184)");
  await stopLivePlayerIfVisible();

  await liveSettings.getByRole("radio", { name: /Dot/ }).click();
  await expectPreviewReady(page);
  await previewSection(page)
    .getByRole("button", { name: "Play live player" })
    .click();
  await expect
    .poll(() =>
      page.getByTestId("book-video-preview-dot").getAttribute("data-preview-active"),
    )
    .toBe("true");
  await stopLivePlayerIfVisible();

  await expectPreviewReady(page);
  const initialActiveMorse = await page
    .getByTestId("book-video-preview-text-layers")
    .getAttribute("data-active-morse");
  const morseTimeline = page.getByLabel("Live player timeline");
  const morseTimelineBox = await morseTimeline.boundingBox();
  expect(morseTimelineBox).not.toBeNull();
  await morseTimeline.click({
    position: {
      x: morseTimelineBox!.width * 0.72,
      y: morseTimelineBox!.height / 2,
    },
  });
  await expect
    .poll(() => morseTimeline.getAttribute("aria-valuenow"))
    .not.toBe("0");
  await expect
    .poll(() =>
      page
        .getByTestId("book-video-preview-text-layers")
        .getAttribute("data-active-morse"),
    )
    .not.toBe(initialActiveMorse);
  expect(
    await page
      .getByTestId("book-video-preview-text-layers")
      .getAttribute("data-active-morse"),
  ).toBe(
    await page
      .getByTestId("book-video-preview-timeline")
      .getAttribute("data-active-morse"),
  );
  await expect(page.getByTestId("book-video-preview-active-morse-word")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-active-text-word")).toBeVisible();
  await expectActivePreviewHighlights(previewSection(page));
  await expect(page.getByTestId("book-video-preview-active-token")).toHaveCount(0);
  const seekedActiveMorse = await page
    .getByTestId("book-video-preview-text-layers")
    .getAttribute("data-active-morse");
  await previewSection(page)
    .getByRole("button", { name: "Play live player" })
    .click();
  await expect
    .poll(() =>
      page
        .getByTestId("book-video-preview-text-layers")
        .getAttribute("data-active-morse"),
    )
    .not.toBe(seekedActiveMorse);
  const playingTimelineBox = await morseTimeline.boundingBox();
  expect(playingTimelineBox).not.toBeNull();
  await page.mouse.move(
    playingTimelineBox!.x + playingTimelineBox!.width * 0.2,
    playingTimelineBox!.y + playingTimelineBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    playingTimelineBox!.x + playingTimelineBox!.width * 0.82,
    playingTimelineBox!.y + playingTimelineBox!.height / 2,
    { steps: 5 },
  );
  await expect(morseTimeline).not.toHaveAttribute("aria-disabled", "true");
  await expectLivePlayerControlReady();
  await page.mouse.up();
  await expectLivePlayerControlReady();

  await page
    .getByLabel("Paste long-form source text")
    .fill("Replacement preview source stops playback");
  await expect(page.getByTestId("book-video-preview")).toHaveAttribute(
    "data-preview-playing",
    "false",
  );
  await expect(
    previewSection(page).getByRole("button", { name: "Play live player" }),
  ).toBeVisible();
});

test("empty source, cleaned-empty source, large MP3, and progress semantics are clear", async ({
  page,
}) => {
  await openBookTranslator(page);
  const settingsToggle = downloadSettingsToggle(page);
  const downloadButton = page.getByRole("button", {
    name: /Download MP3|Download ZIP (?:bundle|batch \d+)/,
  });
  await expect(
    bookTool(page).getByRole("button", {
      name: /Download MP3|Download ZIP (?:bundle|batch \d+)/,
    }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Download MP3" }),
  ).toBeVisible();
  await expect(page.getByText("Review export")).toHaveCount(0);
  const sourceInput = page.getByLabel("Paste long-form source text");
  await expect(sourceInput).toHaveValue("SOS Help!");
  await page.getByRole("button", { name: "Clear source" }).click();
  await expect(sourceInput).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Create Morse MP3 audio" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Details and previews" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Add source text or upload a source file to enable download.",
    ),
  ).toBeVisible();
  await expect(settingsToggle).toHaveAttribute("aria-expanded", "false");
  await expect(downloadButton).toBeDisabled();
  await expect(
    page.getByRole("progressbar", { name: "Book download progress" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Choose download settings, then download audio."),
  ).toHaveCount(0);

  await sourceInput.fill("   \n   ");
  await expect(downloadButton).toBeDisabled();

  await sourceInput.fill(`*** START OF THE PROJECT GUTENBERG EBOOK TEST ***

*** END OF THE PROJECT GUTENBERG EBOOK TEST ***`);
  await page.getByLabel("Strip Project Gutenberg header/footer").check();
  await expect(page.getByText("Cleanup removed all source text")).toBeVisible();
  await expect(downloadButton).toBeDisabled();

  await sourceInput.fill("ALPHA BRAVO SOS ".repeat(4_000));
  await expect(page.getByText("WAV output may be very large")).toHaveCount(0);
  await openDownloadSettings(page);
  await expect(settingsToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByLabel("WAV sample rate")).toHaveCount(0);
  await expect(page.getByLabel("Tail padding")).toHaveCount(0);
  await expect(page.getByLabel("MP3 bitrate")).toBeVisible();

  await expect(
    page.getByRole("progressbar", { name: "Book download progress" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toHaveCount(0);
});

test("download controls stay lean and ZIP/split copy is scoped", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("ALPHA BRAVO SOS HELP ".repeat(40));

  const tool = bookTool(page);
  await expectWorkflowReadyNearSource(page);
  await expect(tool.getByText("ZIP bundle")).toHaveCount(0);
  await expect(
    tool.getByText("Split downloads save timed parts in a ZIP bundle."),
  ).toHaveCount(0);
  await expect(
    tool.getByRole("progressbar", { name: "Book download progress" }),
  ).toHaveCount(0);
  await expect(
    tool.getByRole("button", { name: "Cancel download" }),
  ).toHaveCount(0);

  await openDownloadSettings(page);
  await expect(
    tool.locator('[class*="border-t"][class*="border-slate-200/70"]'),
  ).toHaveCount(0);
  const presetControls = page.getByTestId("book-preset-controls");
  await expect(
    presetControls.getByRole("button", { name: "Reader Quick Start" }),
  ).toBeVisible();
  const resetPreset = presetControls.getByRole("button", {
    name: "Reset preset",
  });
  await expect(resetPreset).toBeVisible();
  const presetBox = await presetControls.boundingBox();
  const resetBox = await resetPreset.boundingBox();
  expect(presetBox).not.toBeNull();
  expect(resetBox).not.toBeNull();
  expect(resetBox!.y).toBeGreaterThanOrEqual(presetBox!.y - 2);
  expect(resetBox!.y + resetBox!.height).toBeLessThanOrEqual(
    presetBox!.y + presetBox!.height + 2,
  );

  await chooseSplitMode(page, "By duration");
  await page.getByLabel("Target part length").selectOption("15");
  await expect(
    tool.getByText(/Using 15m 0s target parts and safe text boundaries/),
  ).toBeVisible();
  await expect(
    tool.getByText("Split downloads save timed parts in a ZIP bundle."),
  ).toHaveCount(0);

  await chooseSplitMode(page, "No split");
  await expect(
    tool.getByText("Split downloads save timed parts in a ZIP bundle."),
  ).toHaveCount(0);

  await page.getByLabel("Include manifest").check();
  await expect(
    sourceStep(page).getByRole("button", { name: "Download ZIP bundle" }),
  ).toBeVisible();
  await expect(
    tool.getByText("No split is selected. A ZIP is still required"),
  ).toBeVisible();
  await page.getByLabel("Include manifest").uncheck();

  await page
    .getByLabel("Paste long-form source text")
    .fill(
      repeatTextForRuntime(
        "ALPHA BRAVO SOS HELP. ",
        65 * 60 * 1000,
      ),
    );
  await expect(
    tool.locator('[class*="border-t"][class*="border-slate-200/70"]'),
  ).toHaveCount(0);
  await expect(
    sourceStep(page).getByRole("button", { name: "Download ZIP batch 1" }),
  ).toBeVisible();
  await expect(
    tool.getByText(
      "This selection has a lot of text, so the download may take a while. MorseWords will prepare it in smaller parts to keep the export reliable.",
    ).first(),
  ).toBeVisible();
  await expect(page.getByLabel("ZIP batch")).toBeVisible();
  await expect(tool.getByText(/split into ZIP parts/i)).toHaveCount(0);
  await expect(
    tool.getByText("Split video downloads are packaged in ZIP files."),
  ).toHaveCount(0);
  await expect(
    tool.getByText(
      /Selected extras are packaged with the (WebM|MP4) in a ZIP download\./,
    ),
  ).toHaveCount(0);

  await chooseSplitMode(page, "By duration");
  await page.getByLabel("Target part length").selectOption("15");
  await expect(
    tool.getByText(
      "This selection has a lot of text, so the download may take a while. MorseWords will prepare it in smaller parts to keep the export reliable.",
    ).first(),
  ).toBeVisible();
  await expect(
    tool.getByText("Split video downloads are packaged in ZIP files."),
  ).toHaveCount(0);

  await chooseSplitMode(page, "No split");
  await expect(
    tool.getByText("Split video downloads are packaged in ZIP files."),
  ).toHaveCount(0);
});

test("route downloads a direct MP3 by default when no sidecars are selected", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Direct MP3 SOS HELP.");
  await expectWorkflowReadyNearSource(page);
  await expect(
    sourceStep(page).getByRole("button", { name: "Download MP3" }),
  ).toBeEnabled();
  await expect(page.getByText("Audio file summary")).toBeVisible();
  await expect(page.getByText("Single file")).toBeVisible();
  await expect(page.getByText("Split summary")).toHaveCount(0);

  const audio = await downloadAudioFile(page, testInfo, /Download MP3/);
  expect(audio.filename).toMatch(/morse-audio\.mp3$/);
  expectMp3Like(audio.bytes);
  await expect(page.getByText("Last download")).toBeVisible();
  await expect(page.getByText("MP3 audio file")).toBeVisible();
  await openDownloadSettings(page);
  await expect(page.getByRole("radio", { name: "No split" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await chooseSplitMode(page, "By duration");
  await expect(page.getByText("Last download")).toHaveCount(0);
});

test("route downloads MP3 ZIP bundles with transcripts, manifest, settings, and playlist", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const raw = "Private Export Draft\n\nSOS HELP. CQ CQ.";
  await page.getByLabel("Paste long-form source text").fill(raw);
  await expectWorkflowReadyNearSource(page);
  await openDownloadSettings(page);
  const downloadSettings = downloadSettingsPanel(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await chooseSplitMode(page, "By duration");
  await downloadSettings.getByLabel("Tone preset").selectOption("warm_tone");
  await downloadSettings.getByLabel("Pitch").fill("590");
  await downloadSettings.getByLabel("Volume").fill("64");
  await expect(
    sourceStep(page).getByText("Practice Copy").first(),
  ).toBeVisible();
  await expect(downloadSettings.getByLabel("Tone preset")).toHaveValue(
    "warm_tone",
  );
  await expect(page.getByText("Split summary")).toBeVisible();

  const zip = await downloadZip(page, testInfo);
  expect(zip.filename).toMatch(/morse-audio-bundle\.zip$/);
  await expect(page.getByText("Last download")).toBeVisible();
  await expect(page.getByText(zip.filename)).toBeVisible();
  await expect(page.getByText("Download contents:")).toBeVisible();
  const partFiles = expectOrderedPartFiles(zip.names, "mp3");
  for (const name of [
    "cleaned-text.txt",
    "morse-transcript.txt",
    "manifest.json",
    "settings.json",
    "playlist.m3u",
    "README.txt",
  ]) {
    expect(zip.names).toContain(name);
  }
  expectMp3Like(zip.entries[partFiles[0]]);
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain("SOS HELP");
  expect(zipText(zip.entries, "morse-transcript.txt")).toContain(
    "...   ---   ...",
  );
  const manifest = zipJson<BundleManifest>(zip.entries, "manifest.json");
  expect(manifest.generatedAt).toEqual(expect.any(String));
  expect(manifest.sourceKind).toBe("pasted");
  expect(manifest.source.kind).toBe("pasted");
  expect(manifest.runtimeMs).toBeGreaterThan(0);
  expect(manifest.outputFormat).toBe("mp3");
  expect(manifest.partCount).toBe(partFiles.length);
  expect(manifest.files.audio).toEqual(partFiles);
  expect(manifest.files.audio[0]).toMatch(/part-001\.mp3$/);
  expect(manifest.parts.map((part) => part.filename)).toEqual(partFiles);
  expect(manifest.parts.every((part) => part.runtimeMs > 0)).toBe(true);
  expect(
    manifest.parts.every((part) => part.sourceStart < part.sourceEnd),
  ).toBe(true);
  expect(manifest.settingsSummary.targetPartMinutes).toBe(30);
  expect(manifest.settingsSummary.splitMode).toBe("duration");
  expect(manifest.settingsSummary.splitAudio).toBe(true);
  expect(manifest.settingsSummary.outputFormat).toBe("mp3");
  expect(manifest.settingsSummary.tonePreset).toBe("warm_tone");
  expect(manifest.settingsSummary.pitch).toBe(590);
  expect(manifest.settingsSummary.volume).toBe(0.64);
  expect(manifest.settingsSummary.mp3Bitrate).toBe(48);
  expect(manifest.settingsSummary.sampleRate).toBe(44100);
  expect(manifest.settingsSummary.tailPaddingMs).toBe(180);
  expect(manifest.parts[0].filename).toMatch(/part-001\.mp3$/);
  const settings = zipJson<BundleSettings>(zip.entries, "settings.json");
  expect(settings.generatedAt).toEqual(expect.any(String));
  expect(settings.presetName).toBe("Practice Copy");
  expect(settings.outputFormat).toBe("mp3");
  expect(settings.tonePreset).toBe("warm_tone");
  expect(settings.pitch).toBe(590);
  expect(settings.volume).toBe(0.64);
  expect(settings.mp3Bitrate).toBe(48);
  expect(settings.sampleRate).toBe(44100);
  expect(settings.tailPaddingMs).toBe(180);
  expect(settings.splitAudio).toBe(true);
  expect(settings.splitMode).toBe("duration");
  expect(settings.targetPartMinutes).toBe(30);
  expect(settings.includeCleanedText).toBe(true);
  expect(settings.includeMorseTranscript).toBe(true);
  const playlist = zipText(zip.entries, "playlist.m3u");
  expectPlaylistOrder(playlist, partFiles);
  const readme = zipText(zip.entries, "README.txt");
  expect(readme).toContain("Generated:");
  expect(readme).toContain("Part count:");
  expect(readme).toContain("MP3 is recommended for long downloads");
  expect(readme).toContain("right to convert and use");

  const storageSnapshot = await page.evaluate(() =>
    Object.keys(localStorage)
      .map((key) => `${key}:${localStorage.getItem(key)}`)
      .join("\n"),
  );
  expect(storageSnapshot).not.toContain("Private Export Draft");
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);

  await downloadSettings.getByLabel("Pitch").fill("610");
  await expect(page.getByText("Last download")).toHaveCount(0);
});

test("route downloads uploaded extracted text without persisting raw source", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const raw = "Uploaded Private Export Draft\n\nSOS HELP from upload.";
  const txtPath = writeFixture(testInfo, "uploaded-export.txt", raw);

  await page.setInputFiles("#book-source-file", txtPath);
  await expect(
    page.getByText("Current file: uploaded-export.txt"),
  ).toBeVisible();
  await expectWorkflowReadyNearSource(page);
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await chooseSplitMode(page, "By duration");

  const zip = await downloadZip(page, testInfo);
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain(
    "Uploaded Private Export Draft",
  );
  expect(zipText(zip.entries, "morse-transcript.txt")).toContain(
    "...   ---   ...",
  );
  const manifest = zipJson<BundleManifest>(zip.entries, "manifest.json");
  expect(manifest.sourceKind).toBe("txt");
  expect(manifest.source.kind).toBe("txt");
  expect(manifest.source.filename).toBe("uploaded-export.txt");
  await expectNoRawSourceInStorage(page, "Uploaded Private Export Draft");
});

test("download cancellation can abort stale work before completion", async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(
    renderBookPartPcm(
      "SOS HELP",
      BOOK_EXPORT_PRESETS["Reader Quick Start"],
      controller.signal,
    ),
  ).rejects.toThrow();
});

test("route cancellation state is distinct from failure", async ({ page }) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("SOS HELP ALPHA BRAVO ".repeat(4_000));
  await chooseSplitMode(page, "By duration");

  await page.getByRole("button", { name: "Download ZIP batch 1" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Cancel download" }).click();
  await expect(page.getByText("Download cancelled.")).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText("Last download")).toHaveCount(0);
  await expect(page.getByText("Download failed.")).toHaveCount(0);
});

test("source changes during active download cancel stale completion", async ({
  page,
}) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("SOS HELP ALPHA BRAVO ".repeat(4_000));
  await chooseSplitMode(page, "By duration");

  await page.getByRole("button", { name: "Download ZIP batch 1" }).click();
  await expect(
    page.getByRole("button", { name: "Cancel download" }),
  ).toBeEnabled();
  await page
    .getByLabel("Paste long-form source text")
    .fill("Replacement source wins");
  await expect(
    page.getByText("Source changed; download cancelled."),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.locator("pre").filter({ hasText: "Replacement source wins" }),
  ).toBeVisible();
  await expect(page.getByText("Last download")).toHaveCount(0);
  await expect(page.getByText("ZIP download started")).toHaveCount(0);
});

test("transcript inclusion toggles remove private text artifacts from bundle", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("Toggle download SOS HELP.");
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();
  await page.getByLabel("Include cleaned text").uncheck();
  await page.getByLabel("Include Morse transcript").uncheck();

  const zip = await downloadZip(page, testInfo);
  const partFiles = expectOrderedPartFiles(zip.names, "mp3");
  expect(zip.names).not.toContain("cleaned-text.txt");
  expect(zip.names).not.toContain("morse-transcript.txt");
  const manifest = zipJson<BundleManifest>(zip.entries, "manifest.json");
  expect(manifest.files.audio).toEqual(partFiles);
  expect(manifest.files.cleanedText).toBeUndefined();
  expect(manifest.files.morseTranscript).toBeUndefined();
  const settings = zipJson<BundleSettings>(zip.entries, "settings.json");
  expect(settings.includeCleanedText).toBe(false);
  expect(settings.includeMorseTranscript).toBe(false);
});

test("EPUB rejection paths are clear for encrypted and broken files", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const encryptedPath = writeFixture(
    testInfo,
    "encrypted.epub",
    makeEpub({ encrypted: true }),
  );
  const brokenPath = writeFixture(
    testInfo,
    "broken.epub",
    makeEpub({ broken: true }),
  );

  await page.setInputFiles("#book-source-file", encryptedPath);
  await expect(
    page.getByLabel("Source upload failed").getByText("DRM-protected"),
  ).toBeVisible();

  await page.setInputFiles("#book-source-file", brokenPath);
  await expect(
    page
      .getByLabel("Source upload failed")
      .getByText("missing META-INF/container.xml"),
  ).toBeVisible();
});

test("PDF parser extracts text-native PDFs and rejects image-like PDFs", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const pdfPath = writeFixture(
    testInfo,
    "text-native.pdf",
    makePdf("PDF Morse source text with SOS and CQ"),
  );
  const blankPdfPath = writeFixture(testInfo, "blank.pdf", makePdf(""));
  const brokenPdfPath = writeFixture(
    testInfo,
    "broken.pdf",
    Buffer.from("%PDF-1.4\nbroken\n%%EOF", "ascii"),
  );

  await page.setInputFiles("#book-source-file", pdfPath);
  await expect(page.getByText("PDF pages")).toBeVisible();
  await expect(page.getByText("Extracted source preview")).toBeVisible();
  await expect(page.getByTestId("book-source-preview")).toContainText(
    "PDF Morse source text",
  );
  await expect(
    page.getByRole("button", { name: "Edit extracted text" }),
  ).toBeEnabled();
  await expect(
    page.getByLabel("Source ready").getByText("Tiny PDF"),
  ).toBeVisible();
  await expectWorkflowReadyNearSource(page);

  await page.setInputFiles("#book-source-file", blankPdfPath);
  await expect(
    page.getByText("scanned or image-only", { exact: false }),
  ).toBeVisible();

  await page.setInputFiles("#book-source-file", brokenPdfPath);
  await expect(
    page
      .getByLabel("Source upload failed")
      .getByText("This PDF could not be parsed as text."),
  ).toBeVisible();
});

test("cleanup toggles update preview and report Gutenberg stripping", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const cleanupPath = writeFixture(
    testInfo,
    "cleanup-upload.txt",
    `Header
*** START OF THE PROJECT GUTENBERG EBOOK TEST ***
This is \u201cpractice\u201d text \u2014 with an emoji \u2603.
*** END OF THE PROJECT GUTENBERG EBOOK TEST ***
Footer`,
  );

  await page.setInputFiles("#book-source-file", cleanupPath);
  await expect(
    page.getByText("Current file: cleanup-upload.txt"),
  ).toBeVisible();
  const cleanedPreview = page
    .locator("pre")
    .filter({ hasText: "Header" })
    .first();
  await expect(cleanedPreview).toBeVisible();
  await page.getByLabel("Strip Project Gutenberg header/footer").check();
  await expect(
    page
      .locator("li")
      .filter({ hasText: "Project Gutenberg header/footer" })
      .first(),
  ).toBeVisible();
  await expect(cleanedPreview).toHaveCount(0);
  await page.getByLabel("Simplify punctuation for practice").check();
  await expect(page.getByText("Top unsupported characters")).toBeVisible();
});

test("custom cleanup rules update previews, estimates, and downloaded transcripts", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  await page
    .getByLabel("Paste long-form source text")
    .fill("REMOVE ME\nOld phrase SOS. cat scatter Cat.");
  await openDownloadSettings(page);
  await page.getByRole("button", { name: "Practice Copy" }).click();

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").fill("REMOVE ME");
  await expect(page.getByText("Rule 1 - 1 match")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "REMOVE ME" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").nth(1).fill("Old phrase");
  await page.getByLabel("Replacement text").nth(1).fill("New phrase");
  await expect(
    page.locator("pre").filter({ hasText: "New phrase SOS" }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Add cleanup rule" }).click();
  await page.getByLabel("Find text").nth(2).fill("cat");
  await page.getByLabel("Replacement text").nth(2).fill("dog");
  await page.getByLabel("Whole word").nth(2).check();
  await expect(page.getByText("Rule 3 - 2 matches")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "dog scatter dog" }).first(),
  ).toBeVisible();

  await page.getByLabel("Case-sensitive").nth(2).check();
  await expect(page.getByText("Rule 3 - 1 match")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "dog scatter Cat" }).first(),
  ).toBeVisible();

  await page.getByLabel("Enabled").nth(2).uncheck();
  await expect(page.getByText("Rule 3 - Disabled")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "cat scatter Cat" }).first(),
  ).toBeVisible();

  await page.getByLabel("Enabled").nth(2).check();
  await page.getByLabel("Case-sensitive").nth(2).uncheck();
  const zip = await downloadZip(page, testInfo);
  expect(zipText(zip.entries, "cleaned-text.txt")).not.toContain("REMOVE ME");
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain("New phrase SOS");
  expect(zipText(zip.entries, "cleaned-text.txt")).toContain("dog scatter dog");
  expect(zipText(zip.entries, "morse-transcript.txt")).toContain(
    "...   ---   ...",
  );

  await page.getByRole("button", { name: "Clear custom rules" }).click();
  await expect(
    page.locator("pre").filter({ hasText: "REMOVE ME" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Last download")).toHaveCount(0);
});

test("large synthetic input and quick file replacement stay usable", async ({
  page,
}, testInfo) => {
  await openBookTranslator(page);
  const largeText = "ALPHA BRAVO SOS ".repeat(4_000);
  await page.getByLabel("Paste long-form source text").fill(largeText);
  const detailsSection = page.locator(
    "section[aria-labelledby='book-details-previews-heading']",
  );
  await expect(
    detailsSection.getByText("Characters", { exact: true }),
  ).toBeVisible();
  await expect(
    detailsSection.getByText("63,999", { exact: true }),
  ).toBeVisible();

  const epubPath = writeFixture(testInfo, "slowish.epub", makeEpub({}));
  const txtPath = writeFixture(
    testInfo,
    "replacement.txt",
    "Replacement source wins",
  );
  const input = page.locator("#book-source-file");
  await Promise.allSettled([
    input.setInputFiles(epubPath),
    input.setInputFiles(txtPath),
  ]);
  await expect(page.getByText("Current file: replacement.txt")).toBeVisible();
  await expect(
    page.locator("pre").filter({ hasText: "Replacement source wins" }).first(),
  ).toBeVisible();
});

test("mobile route smoke has no horizontal overflow or console regressions", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await blockExternalNetwork(page);
  const consoleEntries = collectConsoleErrors(page);
  await page.goto(CANONICAL_PATH, { waitUntil: "domcontentloaded" });
  await waitForRouteReady(page);
  await expect(
    page.locator("[data-mw-book-export-ready='true']"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Book to Morse Code/ }),
  ).toBeVisible();
  await openDownloadSettings(page);
  await openLivePlayerSettings(page);
  const liveSettings = livePlayerSettingsPanel(page);
  for (const retiredLabel of [
    "Full-frame flash",
    "Animated Morse signal",
    "Video quality",
    "720p",
    "1080p",
  ]) {
    await expect(liveSettings.getByText(retiredLabel, { exact: true })).toHaveCount(
      0,
    );
  }
  await liveSettings.getByRole("radio", { name: /Dot signal/ }).click();
  await expect(page.getByTestId("book-video-preview")).toBeVisible();
  await expect(page.getByTestId("book-video-preview-dot")).toBeVisible();
  await expect(page.getByTestId("book-video-full-frame-warning")).toHaveCount(
    0,
  );
  await expect(page.locator(".mw-strobe-flash")).toHaveCount(0);
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(consoleEntries, testInfo.title).toEqual([]);
});
